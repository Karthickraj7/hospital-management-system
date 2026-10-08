import base64
from Lab.models import *
from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
import json
from datetime import datetime
from collections import defaultdict

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from email.mime.base import MIMEBase
from email import encoders
from email.parser import BytesParser
from email.policy import default
import re
from django.db import connection as db
from Frontoffice.models import *

# def table_exists(cursor, table_name):
#     cursor.execute("SHOW TABLES LIKE %s", (table_name,))
#     return cursor.fetchone() is not None

# def create_table_if_not_exists(table_name, column_definitions):
#     
#     cursor = db.cursor()

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

# create_table_if_not_exists(
#                     "AnalyseInvestigationResult",
#                     """
#                     Analyse_Id INT PRIMARY KEY,
#                     Test VARCHAR(200),
#                     Billing_invoice VARCHAR(30),
#                     Patent_Name VARCHAR(250),
#                     Visit_Id VARCHAR(10),
#                     Sample_Specimen VARCHAR(250),
#                     Method VARCHAR(55),
#                     Capture_Value VARCHAR(300),
#                     Panic_Low VARCHAR(350),
#                     Panic_High VARCHAR(350),
#                     Medical_Remark VARCHAR(500),
#                     Technical_Remark VARCHAR(500),
#                     Status VARCHAR(350),
#                     Patient_Id INT,
#                     Colony_Count VARCHAR(1500),
#                     Capture_Organism VARCHAR(150),
#                     Location VARCHAR(200),
#                     EditContent LONGTEXT,
#                     CreatedBy VARCHAR(150),
#                     Department VARCHAR(155),
#                     Sample_Picture LONGBLOB,
#                     Reference VARCHAR(25),
#                     Reference_Range VARCHAR(450),
#                     Test_Code VARCHAR(50),
#                     Notes TEXT,
#                     Microscopy_Data TEXT,
#                     Culture_Report TEXT,
#                     Report_Type VARCHAR(100),
#                     Input_Type VARCHAR(70),
#                     Test_Method VARCHAR(150),
#                     Report_Status VARCHAR(35),
#                     micronumber varchar(75),
#                     histonumber varchar(74),
#                     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                     """
# )

# create_table_if_not_exists(
#                     "AnalyseInvestigationSenior",
#                 """
#                     Sl_No INT PRIMARY KEY,
#                     Test VARCHAR(200),
#                     Billing_invoice VARCHAR(30),
#                     Patent_Name VARCHAR(250),
#                     Visit_Id VARCHAR(10),
#                     Sample_Specimen VARCHAR(250),
#                     Method VARCHAR(55),
#                     Capture_Value VARCHAR(300),
#                     Panic_Low VARCHAR(350),
#                     Panic_High VARCHAR(350),
#                     Medical_Remark VARCHAR(500),
#                     Technical_Remark VARCHAR(500),
#                     Status VARCHAR(350),
#                     Patient_Id INT,
#                     Colony_Count VARCHAR(1500),
#                     Capture_Organism VARCHAR(150),
#                     Location VARCHAR(200),
#                     CreatedBy VARCHAR(150),
#                     EditContent LONGTEXT,
#                     Department VARCHAR(155),
#                     Reference VARCHAR(25),
#                     Reference_Range VARCHAR(450),
#                     Test_Code VARCHAR(50),
#                     Notes TEXT,
#                     Microscopy_Data TEXT,
#                     Culture_Report TEXT,
#                     Report_Type VARCHAR(100),
#                     Input_Type VARCHAR(100),
#                     Report_Status VARCHAR(35),
#                     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                 """)


# create_table_if_not_exists ("Approve_Test_Pathologist",
#                         """
#                             Sl_No INT PRIMARY KEY,
#                             Test VARCHAR(200),
#                             Billing_invoice VARCHAR(30),
#                             Patent_Name VARCHAR(250),
#                             Visit_Id VARCHAR(10),
#                             Sample_Specimen VARCHAR(250),
#                             Method VARCHAR(55),
#                             Capture_Value VARCHAR(300),
#                             Panic_Low VARCHAR(350),
#                             Panic_High VARCHAR(350),
#                             Medical_Remark VARCHAR(500),
#                             Technical_Remark VARCHAR(500),
#                             Status VARCHAR(350),
#                             Patient_Id INT,
#                             Colony_Count VARCHAR(1500),
#                             Capture_Organism VARCHAR(150),
#                             Location VARCHAR(200),
#                             CreatedBy VARCHAR(150),
#                             EditContent LONGTEXT,
#                             Reference VARCHAR(25),
#                             Reference_Range VARCHAR(450),
#                             Test_Code VARCHAR(50),
#                             Notes TEXT,
#                             Microscopy_Data TEXT,
#                             Culture_Report TEXT,
#                             Report_Type VARCHAR(100),
#                             Report_Status VARCHAR(35),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#             """)



# create_table_if_not_exists("Completed_Lab_Report_Table", """
#                             Report_Id INT PRIMARY KEY,
#                             Dispatched_Id VARCHAR(10),
#                             Billing_Invoice VARCHAR(30),
#                             Patient_Id VARCHAR(30),
#                             Patient_Name VARCHAR(75), 
#                             Visit_Id VARCHAR(29),
#                             Refering_Doctor VARCHAR(255),
#                             ReportSatus VARCHAR(25),
#                             Patient_Barcode VARCHAR(25),
#                             Sample_Barcode VARCHAR(25),
#                             Location VARCHAR(150),
#                             CreatedBy VARCHAR(50),
#                             Reprint_Reason VARCHAR(200),
#                             Report LONGBLOB,
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Complete_Culture_Examination","""
#                             Culture_Id INT PRIMARY KEY,
#                             Billing_Invoice VARCHAR(30),
#                             Patient_Id VARCHAR(30),
#                             Patient_Name VARCHAR(150),
#                             Visit_Id VARCHAR(10),
#                             Refering_Doctor VARCHAR(150),
#                             Antibiotic_Name VARCHAR(150),
#                             Sensitive_Type VARCHAR(75),
#                             Captured_Oraganism VARCHAR(400),
#                             CreatedBy VARCHAR(50),
#                             Location VARCHAR(100),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


 
# create_table_if_not_exists(
#     "histo_templates",
#     """
#     Histo_Templates_Id INT PRIMARY KEY,
#     Billing_Invoice VARCHAR(30),
#     Patient_Id VARCHAR(30),
#     Visit_Id VARCHAR(10),
#     Captured_Organism VARCHAR(400),
#     CreatedBy VARCHAR(50),
#     Location VARCHAR(100),
#     Format VARCHAR(255),
 
#     /* common columns */
#     Impression TEXT,
#     Specimen TEXT,
#     Microscopy TEXT,
#     Note TEXT,
#     Cyto_No VARCHAR(500),
#     Report_Status VARCHAR(500),
#     Clinical_Data TEXT,
#     Clinical_Comment TEXT,
#     Specimen_Category TEXT,
#     Gross_Findings TEXT,
#     Diagnostic_Summary TEXT,
#     Comments TEXT,
#     HPE_No TEXT,
 
#     /* Peripheral Smear Columns */
#     RBC TEXT,
#     WBC TEXT,
#     Platelets TEXT,
#     Parasite TEXT,
 
#     /* LBC Columns */
#     Clinical_History TEXT,
#     Specimen_Adequacy TEXT,
#     Microscopic_Observations TEXT,
   
   
 
#     /* FNAC Columns */
#     Site TEXT,
#     Gross TEXT,
#     Stains_Used TEXT,
 
#     /* Pathology Report Columns */
#     Microscopic_Findings TEXT,
#     HPE_Diagnosis TEXT,
#     Histo_Image LONGBLOB,
#     Test_Code VARCHAR(255),
#     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#     """,
# )
 
 
 

@csrf_exempt

def insert_analyse_investigation_result(request):
    """
    ✅ OPTIMIZED VERSION: Bulk processing for multiple test results
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'})

    try:
        cursor = db.cursor()
        
        # ====== STEP 1: Extract Common Data (Once) ======
        data = request.POST
        visitid = data.get('visitid')
        patient_id = data.get('patient_Id')
        createdby = data.get('CreatedBy')
        location_id = data.get('Location')
        location = Location_Detials.objects.get(Location_Id=location_id).Location_Name
        
        # Common fields
        srfId = data.get("srfId")
        icmrId = data.get("icmrId")
        specimenCondition = data.get("condition")
        covidType = data.get("testType")
        covidResult = data.get("covidTest")
        histonumber = data.get('histonumber')
        labtechnicianname = data.get("labtechnicianname")
        pathologyyesorno = data.get("pathologyyesorno")
        pathologyremark = data.get("pathologyremark")
        abstinence = data.get("abstinence")
        
        # Photo (if exists)
        Photo = request.FILES.get("Photo")
        photo_data = Photo.read() if Photo else None
        
        # Content (if exists)
        content = data.get('content')
        encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8') if content else None
        
        # Parse test details
        test_details_json = data.get('valids', [])
        if not test_details_json:
            return JsonResponse({'error': 'No test details provided'})
        
        test_details = json.loads(test_details_json)
        
        if len(test_details) == 0:
            return JsonResponse({'error': 'No test details provided'})
        
        # ====== STEP 2: Collect All Test Codes and Billing Invoices ======
        test_codes = set()
        billing_invoices = set()
        
        for item in test_details:
            test_codes.add(item.get('testcode'))
            billing_invoices.add(item.get('Billing_Invoice'))
        
        # Convert to lists for SQL IN clause
        test_codes_list = list(test_codes)
        billing_invoices_list = list(billing_invoices)
        
        # ====== STEP 3: Batch Check Existing Records ======
        # Instead of checking each test individually, check all at once
        placeholders = ','.join(['%s'] * len(test_codes_list))
        cursor.execute(f"""
            SELECT Test_Code, Billing_invoice
            FROM AnalyseInvestigationResult
            WHERE Test_Code IN ({placeholders})
        """, test_codes_list)
        
        existing_records = {(row[0], row[1]) for row in cursor.fetchall()}
        
        # ====== STEP 4: Batch Get Autocheck Info ======
        cursor.execute(f"""
            SELECT Test_Code, Autocheck, Parameter_One
            FROM Test_Descriptions
            WHERE Test_Code IN ({placeholders})
        """, test_codes_list)
        
        autocheck_map = {row[0]: {'autocheck': row[1], 'param': row[2]} for row in cursor.fetchall()}
        
        # ====== STEP 5: Prepare Bulk INSERT and UPDATE Data ======
        inserts = []
        updates = []
        billing_updates = []
        
        # Get next Analyse_Id once (not per test)
        cursor.execute("SELECT COALESCE(MAX(Analyse_Id), 0) + 1 FROM AnalyseInvestigationResult")
        next_id = cursor.fetchone()[0]
        
        for item in test_details:
            test = item.get('testname')
            testcode = item.get('testcode')
            billing_invoice = item.get('Billing_Invoice')
            patient_name = item.get('patient_name')
            test_method = item.get('Test_Method')
            method = item.get('Container_Name')
            uom = item.get('uom')
            panic_low = item.get('paniclow')
            panic_high = item.get('panichigh')
            medical_remark = item.get('medicalremark')
            technical_remark = item.get('technicalremark')
            colony_count = item.get('Colonycount')
            capture_value = item.get('capturevalue')
            Result = item.get('Result')
            department = item.get('subdepartment')
            sample_specimen = item.get('Specimen_Name')
            capture_organism = item.get('captureOrganism')
            Notes = item.get('comments')
            microscopy = item.get('microscopy')
            site = item.get('site')
            macroscopy = item.get('macroscopy')
            micronumber = item.get('micronumber')
            reportformat = item.get('reportformat')
            reportstatus = item.get('reportstatus')
            nogrowthreport = item.get('nogrowthreport')
            reference = item.get('reference')
            referencerange = item.get('referencedata')
            bacteriaisolated = item.get('bacteriaisolated')
            input_type = item.get('inputtype')
            is_sub_test = item.get("is_sub_test")
            sub_test_code = item.get("sub_test_code")
            transferlocation = item.get("transferlocation")
            acid_fast = item.get('acid_fast')
            positivity = item.get('positivity')
            
            if not (billing_invoice and testcode):
                continue  # Skip invalid records
            
            # Check if record exists
            if (testcode, billing_invoice) in existing_records:
                # ✅ Collect UPDATE data
                updates.append((
                    capture_value, 'Completed', encoded_html,
                    billing_invoice, testcode
                ))
            else:
                # ✅ Collect INSERT data
                inserts.append((
                    next_id, test, billing_invoice, patient_name, visitid, 
                    sample_specimen, method, capture_value, panic_low, panic_high,
                    medical_remark, technical_remark, 'Completed', patient_id,
                    colony_count, capture_organism, encoded_html, department,
                    location, createdby, photo_data, reference, referencerange,
                    testcode, Notes, microscopy, reportformat, nogrowthreport,
                    input_type, test_method, reportstatus, micronumber, histonumber,
                    bacteriaisolated, is_sub_test, sub_test_code, transferlocation,
                    site, macroscopy, Result, datetime.now(), datetime.now(),
                    srfId, icmrId, specimenCondition, covidType, covidResult,
                    uom, labtechnicianname, pathologyremark, pathologyyesorno,
                    abstinence, acid_fast, positivity
                ))
                next_id += 1
            
            # ✅ Collect Billing_Item updates
            billing_updates.append((
                'Completed', datetime.now(), billing_invoice, testcode
            ))
        
        # ====== STEP 6: Execute Bulk Operations ======
        
        # ✅ Bulk INSERT (if any)
        if inserts:
            insert_sql = """
                INSERT INTO AnalyseInvestigationResult 
                (Analyse_Id, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, 
                Method, Capture_Value, Panic_Low, Panic_High, Medical_Remark, Technical_Remark, 
                Status, Patient_Id, Colony_Count, Capture_Organism, EditContent, Department, 
                Location, CreatedBy, Sample_Picture, Reference, Reference_Range, Test_Code, 
                Notes, Microscopy_Data, Report_Type, Culture_Report, Input_Type, Test_Method, 
                Report_Status, micronumber, histonumber, Bacteria_Isolated, IsSubTest, 
                SubTestCodes, Transfer_Location, site, macroscopy, Result, UpdatedAt, CreatedAt,
                srfId, icmrId, specimenCondition, covidType, covidResult, uom, labtechnician,
                pathologyremarks, pathologyyesorno, abstinence, acid_fast, positivity)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.executemany(insert_sql, inserts)
            print(f"✅ Bulk inserted {len(inserts)} test results")
        
        # ✅ Bulk UPDATE (if any)
        if updates:
            update_sql = """
                UPDATE AnalyseInvestigationResult
                SET Capture_Value=%s, Status=%s, EditContent=%s
                WHERE Billing_invoice=%s AND Test_Code=%s
            """
            cursor.executemany(update_sql, updates)
            print(f"✅ Bulk updated {len(updates)} test results")
        
        # ✅ Bulk Billing_Item UPDATE
        if billing_updates:
            billing_update_sql = """
                UPDATE Billing_Item_Table_for_lab
                SET Analysis_Status=%s, UpdatedAt=%s
                WHERE Billing_Invoice=%s AND Test_Code=%s
            """
            cursor.executemany(billing_update_sql, billing_updates)
            print(f"✅ Bulk updated {len(billing_updates)} billing items")
        
        # ====== STEP 7: Handle Autocheck and Overall Status (Per Invoice) ======
        for billing_invoice in billing_invoices_list:
            # Get tests for this invoice that have autocheck
            autocheck_tests = [
                tc for tc in test_codes_list 
                if tc in autocheck_map and autocheck_map[tc]['autocheck'] == 'Yes'
            ]
            
            if autocheck_tests:
                # Handle autocheck logic
                for testcode in autocheck_tests:
                    param_value = autocheck_map[testcode]['param']
                    
                    cursor.execute("""
                        SELECT COUNT(*)
                        FROM Billing_Item_Table_for_lab
                        WHERE Test_Code = %s AND Billing_Invoice = %s
                    """, (testcode, billing_invoice))
                    count = cursor.fetchone()[0]
                    
                    if param_value and int(param_value) == count:
                        cursor.execute("""
                            UPDATE Billing_invoice_and_bill_amount
                            SET Analyze_Status = 'Completed', UpdatedAt = %s
                            WHERE Billing_Invoice = %s
                        """, (datetime.now(), billing_invoice))
                    else:
                        cursor.execute("""
                            UPDATE Billing_invoice_and_bill_amount
                            SET Analyze_Status = 'Autocheck', UpdatedAt = %s
                            WHERE Billing_Invoice = %s
                        """, (datetime.now(), billing_invoice))
            else:
                # Check overall completion status
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s AND Analysis_Status != 'Completed'
                """, (billing_invoice,))
                not_completed_count = cursor.fetchone()[0]
                
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s 
                    AND Transfer_Location IS NOT NULL 
                    AND Transfer_Location != ''
                """, (billing_invoice,))
                transfer_count = cursor.fetchone()[0]
                
                if not_completed_count == 0:
                    new_analyze_status = 'Completed'
                elif transfer_count > 0:
                    new_analyze_status = 'Transfer'
                else:
                    new_analyze_status = 'Recollect'
                
                cursor.execute("""
                    UPDATE Billing_invoice_and_bill_amount
                    SET Analyze_Status = %s, UpdatedAt = %s
                    WHERE Billing_Invoice = %s
                """, (new_analyze_status, datetime.now(), billing_invoice))
        
        # Commit all changes
        db.commit()
        
        print(f"✅ Successfully processed {len(test_details)} tests")
        return JsonResponse({
            'success': True,
            'message': f'Successfully processed {len(test_details)} tests',
            'inserts': len(inserts),
            'updates': len(updates)
        })
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
        return JsonResponse({'error': str(e)}, status=500)
    
    finally:
        cursor.close()


# def insert_analyse_investigation_result(request):
#     if request.method != 'POST':
#         return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'})

#     try:
#         cursor = db.cursor()

#         data = request.POST
#         visitid = data.get('visitid')
#         print('data:', data)
#         print('files:', request.FILES)
#         srfId = data.get("srfId")
#         icmrId = data.get("icmrId")
#         specimenCondition = data.get("condition")
#         covidType = data.get("testType")
#         covidResult = data.get("covidTest")
        
        


#         Photo = request.FILES.get("Photo")
#         photo_data = Photo.read() if Photo else None

#         test_details = data.get('valids', [])
#         print('test_details:', test_details)
#         if not test_details:
#             return JsonResponse({'error': 'No test details provided'})

#         test_detail = json.loads(test_details)

#         print('test_details details========> :', test_detail)

#         for item in test_detail:
#             # print('items------><------- :', item)
#             test = item.get('testname')
#             testcode = item.get('testcode')
#             billing_invoice = item.get('Billing_Invoice')
#             patient_name = item.get('patient_name')
#             test_method = item.get('Test_Method')
#             method = item.get('Container_Name')
#             uom = item.get('uom')
            
#             panic_low = item.get('paniclow')
#             panic_high = item.get('panichigh')
#             medical_remark = item.get('medicalremark')
#             technical_remark = item.get('technicalremark')
#             colony_count = item.get('Colonycount')
#             capture_value = item.get('capturevalue')
#             Result = item.get('Result')
#             department = item.get('subdepartment')
#             sample_specimen = item.get('Specimen_Name') 
            
#             content = data.get('content')
#             encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8') if content else None
#             createdby = data.get('CreatedBy')
#             location = data.get('Location')
#             location = Location_Detials.objects.get(Location_Id = location).Location_Name
#             capture_organism = item.get('captureOrganism')
#             patient_id = data.get('patient_Id')
#             status = 'Completed'
#             Notes = item.get('comments')
#             microscopy = item.get('microscopy')
#             site = item.get('site')
#             macroscopy = item.get('macroscopy')
#             micronumber = item.get('micronumber')
#             histonumber = data.get('histonumber')
#             reportformat = item.get('reportformat')
#             reportstatus = item.get('reportstatus')
#             nogrowthreport = item.get('nogrowthreport')
#             reference = item.get('reference')
#             referencerange = item.get('referencedata')
#             bacteriaisolated = item.get('bacteriaisolated')
#             input_type = item.get('inputtype')
#             is_sub_test = item.get("is_sub_test")
#             sub_test_code = item.get("sub_test_code")
#             transferlocation = item.get("transferlocation")
#             labtechnicianname = data.get("labtechnicianname")
#             pathologyyesorno = data.get("pathologyyesorno")
#             pathologyremark = data.get("pathologyremark")
#             abstinence = data.get("abstinence")
#             acid_fast = item.get('acid_fast')
#             positivity = item.get('positivity')

                     
            

#             if not (billing_invoice and testcode):
#                 return JsonResponse({'error': 'Missing required parameters in testDetails'})

#             # Check for existing records
#             cursor.execute("""
#                 SELECT COUNT(*)
#                 FROM AnalyseInvestigationResult 
#                 WHERE Billing_invoice = %s AND Test_Code = %s
#             """, (billing_invoice, testcode))
#             count = cursor.fetchone()[0]
#             print('count:', count)
            
#             if count > 0:
                


#                 sql = """
#                     UPDATE AnalyseInvestigationResult
#                     SET 
#                         Capture_Value=%s,Status =%s,EditContent = %s
#                     WHERE Billing_invoice=%s AND Test_Code=%s
#                 """
#                 cursor.execute(sql, ( capture_value,status,encoded_html,billing_invoice, testcode))
#             else:
#                 # Generate new Analyse_Id
#                 cursor.execute("SELECT MAX(Analyse_Id) FROM AnalyseInvestigationResult")
#                 max_id_result = cursor.fetchone()
#                 next_id = (max_id_result[0] or 0) + 1

#                 # Insert into AnalyseInvestigationResult table
#                 sql = """INSERT INTO AnalyseInvestigationResult 
#                             (Analyse_Id, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, 
#                             Capture_Value, Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, Patient_Id, 
#                             Colony_Count, Capture_Organism, EditContent, Department, Location, CreatedBy, Sample_Picture, 
#                             Reference, Reference_Range, Test_Code, Notes, Microscopy_Data, Report_Type, Culture_Report, 
#                             Input_Type, Test_Method, Report_Status, micronumber, histonumber, Bacteria_Isolated, IsSubTest, 
#                             SubTestCodes, Transfer_Location,site,macroscopy,Result, UpdatedAt, CreatedAt,
#                             srfId, icmrId,specimenCondition, covidType, covidResult,uom,labtechnician,
#                             pathologyremarks,pathologyyesorno,abstinence,acid_fast,positivity)

#                         VALUES (%s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s,%s, %s, %s,%s, %s,%s,%s,%s,%s,%s,%s,%s)"""
#                 cursor.execute(sql, (next_id, test, billing_invoice, patient_name, visitid, sample_specimen, method,
#                                     capture_value, panic_low, panic_high, medical_remark, technical_remark, status, 
#                                     patient_id, colony_count, capture_organism, encoded_html, department, location, createdby, 
#                                     photo_data, reference, referencerange, testcode, Notes, microscopy, reportformat, 
#                                     nogrowthreport, input_type, test_method, reportstatus, micronumber, histonumber, 
#                                     bacteriaisolated, is_sub_test, sub_test_code, transferlocation,site,macroscopy,Result,datetime.now(), datetime.now(), srfId, icmrId, 
#                                     specimenCondition, covidType, covidResult,uom,labtechnicianname,pathologyremark,pathologyyesorno,abstinence, acid_fast,positivity))

#             db.commit()
#             print('Insert success')

#             # Update Billing_Item_Table_for_lab
#             cursor.execute("""
#                 UPDATE Billing_Item_Table_for_lab 
#                 SET Analysis_Status = %s,UpdatedAt = %s 
#                 WHERE Billing_Invoice = %s AND Test_Code = %s
#             """, ('Completed',datetime.now(), billing_invoice, testcode))
#             db.commit()
#             print('Billing_Item_Table_for_lab success')

#             # Check Autocheck logic
#             cursor.execute("""
#                 SELECT Autocheck, Parameter_One 
#                 FROM Test_Descriptions 
#                 WHERE Test_Code = %s
#             """, (testcode,))
#             autocheck_result = cursor.fetchone()
#             autocheck, value = autocheck_result if autocheck_result else (None, None)
#             print('autocheck:', autocheck)

#             if autocheck == 'Yes':
#                 cursor.execute("""
#                     SELECT COUNT(*)
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Test_Code = %s AND Billing_Invoice = %s
#                 """, (testcode, billing_invoice))
#                 count = cursor.fetchone()[0]
#                 print('count:', count)
#                 if int(value) == count:
#                     cursor.execute("""
#                         UPDATE Billing_invoice_and_bill_amount
#                         SET Analyze_Status = 'Completed', UpdatedAt = %s
#                         WHERE Billing_Invoice = %s
#                     """, (datetime.now(),billing_invoice,))
#                 else:
#                     cursor.execute("""
#                         UPDATE Billing_invoice_and_bill_amount
#                         SET Analyze_Status = 'Autocheck', UpdatedAt = %s
#                         WHERE Billing_Invoice = %s
#                     """, (datetime.now(), billing_invoice,))
#                 db.commit()
#                 print('Autocheck update success')
#             else:
#                 # Check overall completion status
#                 cursor.execute("""
#                     SELECT COUNT(*)
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Billing_Invoice = %s AND Analysis_Status != 'Completed'
#                 """, (billing_invoice,))
#                 not_completed_count = cursor.fetchone()[0]
#                 print('not_completed_count:', not_completed_count)

#                 cursor.execute("""
#                     SELECT COUNT(*)
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Billing_Invoice = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != ''
#                 """, (billing_invoice,))
#                 transfer_count = cursor.fetchone()[0]
#                 print('transfer_count:', transfer_count)

#                 if not_completed_count == 0:
#                     new_analyze_status = 'Completed'
#                 elif transfer_count > 0:
#                     new_analyze_status = 'Transfer'  # Keep as Transfer if any test is transferred
#                 else:
#                     new_analyze_status = 'Recollect'  # Partial completion without transfers

#                 cursor.execute("""
#                     UPDATE Billing_invoice_and_bill_amount
#                     SET Analyze_Status = %s, UpdatedAt = %s
#                     WHERE Billing_Invoice = %s
#                 """, (new_analyze_status, datetime.now(), billing_invoice))
#                 db.commit()
#                 print(f'Updated Analyze_Status to {new_analyze_status}')

#         return JsonResponse({'message': 'Operation completed successfully'})

#     except Exception as e:
#         print("Error:", str(e))
#         return JsonResponse({'error': str(e)}, status=500)

#     finally:
#         cursor.close()
#         db.close()


        


def get_record_from_lab_techy_completed(request):
    if request.method == 'GET':
        from django.db import connection as _conn
        try:
            limit = int(request.GET.get('limit', 15))
            offset = int(request.GET.get('offset', 0))

            with _conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM AnalyseInvestigationResult")
                total_records = cursor.fetchone()[0]

                sql_query = """
                    SELECT Analyse_Id, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
                           Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, UpdatedAt, CreatedAt
                    FROM AnalyseInvestigationResult
                    ORDER BY CreatedAt DESC
                    LIMIT %s OFFSET %s
                """
                cursor.execute(sql_query, (limit, offset))
                records = cursor.fetchall()

            test_report_data = []
            for record in records:
                # Map all returned columns to the response, including both remarks separately
                test_record = {
                    'Analyse_Id': record[0],
                    'Test': record[1],
                    'Billing_invoice': record[2],
                    'Patient_Name': record[3],
                    'Visit_Id': record[4],
                    'Sample_Specimen': record[5],
                    'Method': record[6],
                    'Capture_Value': record[7],
                    'Panic_Low': record[8],
                    'Panic_High': record[9],
                    'Medical_Remark': record[10],
                    'Technical_Remark': record[11],
                    'Status': record[12],
                    'UpdatedAt': record[13].strftime('%Y-%m-%d %H:%M:%S') if record[13] else None,  # Formatting timestamp
                    'CreatedAt': record[14].strftime('%Y-%m-%d %H:%M:%S') if record[14] else None
                }
                
                test_report_data.append(test_record)
               
            return JsonResponse({'total_records': total_records, 'data': test_report_data}, safe=False)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'})


def get_record_from_lab_techy(request):
    if request.method != 'GET':
        return JsonResponse({"Error": "Invalid request method. Only GET is allowed."})

    invoice = request.GET.get('Billinginvoice')
    if not invoice:
        return JsonResponse({"Error": "Billing invoice parameter is missing."})

    try:
        
        cursor = db.cursor()
        status = 'Completed'
        visitid = request.GET.get('Visitid')
        location = request.GET.get('Location', 'ALL')
        department_codes = request.GET.get('Department')
        location = Location_Detials.objects.get(Location_Id = location).Location_Name

        department_names = []
        if department_codes:
            department_codes_list = department_codes.split(',')
            
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
        
        # ─────────────────────────────────────────────────────────────────────────
        # OPTIMISED get_record_from_lab_techy
        # FIX 1: Added Culturetest to the main SELECT — eliminates 1 query per test.
        # FIX 2: Batch A fetches ALL culture results in one query (IN clause).
        # FIX 3: Batch B fetches ALL normal results in one query (IN clause).
        # FIX 4: Correlated subquery for MAX(Analyse_Id) fixed — dept alias was
        #        incorrectly referenced inside subquery; now uses clean GROUP BY.
        # Before: 1 + (2 × N) queries for N tests.  After: 3 queries total.
        # ─────────────────────────────────────────────────────────────────────────
        sql_testname = """
            SELECT bit.Test_Name, bit.Test_Code, bit.IsSubTest, bit.SubTestCodes,
                   bit.Transfer_Location, bit.PackageName, bit.Group_Name,
                   td.Culturetest
            FROM Billing_Item_Table_for_lab bit
            JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
            JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
            WHERE bit.Billing_Invoice = %s
              AND bit.Bill_Status != 'Canceled'
              AND bit.Service_Status = %s
              AND bit.Analysis_Status = 'Completed'
              AND bit.Verify_Status != 'Completed'
              AND (
                  (bit.Transfer_Location = %s)
                  OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
              )
              AND dept.SubDepartment_Name IN %s
        """
        cursor.execute(sql_testname, (invoice, status, location, location, tuple(department_names)))
        tests = cursor.fetchall()

        if not tests:
            return JsonResponse({"Error": "No tests found for the given invoice and status."})

        # Split codes by type and build metadata lookup dict
        culture_codes = [t[1] for t in tests if (t[7] or 'No') == 'Yes']
        normal_codes  = [t[1] for t in tests if (t[7] or 'No') != 'Yes']
        test_meta = {
            t[1]: {
                'IsSubTest': t[2], 'SubTestCodes': t[3],
                'transfer': t[4], 'package_name': t[5],
                'group_name': t[6], 'culturetest': t[7] or 'No',
            }
            for t in tests
        }

        details_list = []
        # ── Batch A: all culture tests in ONE query ────────────────────────────
        if culture_codes:
            cursor.execute("""
                SELECT air.Analyse_Id, air.Test, air.Billing_invoice, air.Patent_Name,
                       air.Visit_Id, air.Sample_Specimen, air.Method, air.Colony_Count,
                       air.Capture_Organism, air.Status, air.Department, air.Test_Code,
                       air.Notes, air.Microscopy_Data, air.Culture_Report, air.Report_Type,
                       air.Input_Type, air.EditContent, air.Report_Status, air.micronumber,
                       air.Bacteria_Isolated, air.site, air.macroscopy, air.srfId, air.icmrId,
                       air.specimenCondition, air.covidType, air.covidResult, air.labtechnician,
                       air.acid_fast, air.positivity
                FROM AnalyseInvestigationResult air
                JOIN Test_Descriptions td ON air.Test_Code = td.Test_Code
                JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
                WHERE air.Billing_invoice = %s
                  AND air.Visit_Id = %s
                  AND air.Test_Code IN %s
                  AND dept.SubDepartment_Name IN %s
            """, (invoice, visitid, tuple(culture_codes), tuple(department_names)))

            for record in cursor.fetchall():
                meta = test_meta.get(record[11], {})

                details_list.append({
                    'Analyse_Id': record[0],
                    'Test': record[1],
                    'Billing_invoice': record[2],
                    'Patient_Name': record[3],
                    'Visit_Id': record[4],
                    'Sample_Specimen': record[5],
                    'Method': record[6],
                    'Colony_Count': record[7],
                    'Capture_Oragnism': record[8],
                    'Status': record[9],
                    'Culturetest': 'Yes',
                    'Department': record[10],
                    'Test_Code': record[11],
                    'Notes': record[12],
                    'Microscopy_Data': record[13],
                    'Culture_Report': record[14],
                    'Report_Type': record[15],
                    'Input_Type': record[16],
                    'Content': record[17],
                    'Report_Status': record[18],
                    'micronumber': record[19],
                    'Bacteria_Isolated': record[20],
                    'site': record[21],
                    'macroscopy': record[22],
                    'transferlocation': meta.get('transfer'),
                    'srfId': record[23],
                    'icmrId': record[24],
                    'condition': record[25],
                    'testType': record[26],
                    'covidTest': record[27],
                    'labtechnician': record[28],
                    'acid_fast': record[29],
                    'positivity': record[30],
                })

        # ── Batch B: all normal (non-culture) tests in ONE query ───────────────
        if normal_codes:
            cursor.execute("""
                SELECT air.Analyse_Id, air.Test, air.Billing_invoice, air.Patent_Name,
                       air.Visit_Id, air.Sample_Specimen, air.Method, air.Capture_Value,
                       air.Panic_Low, air.Panic_High, air.Medical_Remark, air.Technical_Remark,
                       air.Status, air.UpdatedAt, air.CreatedAt, air.Department, air.EditContent,
                       air.Reference, air.Reference_Range, air.Test_Code, air.Input_Type,
                       air.Result, td.Iscutoffvalue, air.srfId, air.icmrId,
                       air.specimenCondition, air.covidType, air.covidResult, air.uom,
                       air.Previous_Value, air.labtechnician, air.micronumber,
                       air.histonumber, air.pathologyremarks, air.pathologyyesorno,
                       air.abstinence
                FROM AnalyseInvestigationResult AS air
                INNER JOIN Test_Descriptions AS td ON td.Test_Code = air.Test_Code
                JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
                WHERE air.Billing_invoice = %s
                  AND air.Visit_Id = %s
                  AND air.Test_Code IN %s
                  AND dept.SubDepartment_Name IN %s
                  AND air.Analyse_Id IN (
                        SELECT MAX(Analyse_Id)
                        FROM AnalyseInvestigationResult
                        WHERE Billing_invoice = %s
                          AND Visit_Id = %s
                          AND Test_Code IN %s
                        GROUP BY Test_Code
                  )
            """, (
                invoice, visitid,
                tuple(normal_codes), tuple(department_names),
                invoice, visitid, tuple(normal_codes)
            ))

            for record in cursor.fetchall():
                meta = test_meta.get(record[19], {})

                details_list.append({
                    'Analyse_Id': record[0],
                    'Test': record[1],
                    'Billing_invoice': record[2],
                    'Patient_Name': record[3],
                    'Visit_Id': record[4],
                    'Sample_Specimen': record[5],
                    'Method': record[6],
                    'Capture_Value': record[7],
                    'Panic_Low': record[8],
                    'Panic_High': record[9],
                    'Medical_Remark': record[10],
                    'Technical_Remark': record[11],
                    'Status': record[12],
                    'UpdatedAt': record[13].strftime('%Y-%m-%d %H:%M:%S') if record[13] else None,
                    'CreatedAt': record[14].strftime('%Y-%m-%d %H:%M:%S') if record[14] else None,
                    'Department': record[15],
                    'Content': record[16],
                    'Reference': record[17],
                    'Reference_Range': record[18],
                    'Test_Code': record[19],
                    'Input_Type': record[20],
                    'Result': record[21],
                    'Iscutoffvalue': record[22],
                    'IsSubTest': meta.get('IsSubTest'),
                    'SubTestCodes': meta.get('SubTestCodes'),
                    'transferlocation': meta.get('transfer'),
                    'srfId': record[23],
                    'icmrId': record[24],
                    'condition': record[25],
                    'testType': record[26],
                    'covidTest': record[27],
                    'uom': record[28],
                    'PackageName': meta.get('package_name'),
                    'Group_Name': meta.get('group_name'),
                    'Previous_Value': record[29],
                    'labtechnician': record[30],
                    'micronumber': record[31],
                    'histonumber': record[32],
                    'pathologyremarks': record[33],
                    'pathologyyesorno': record[34],
                    'abstinence': record[35],
                    'Culturetest': 'No',
                })

        return JsonResponse(details_list, safe=False)


    except Exception as er:
        print("Error::::::::", er)
        return JsonResponse({"Error": str(er)})
    finally:
        cursor.close()
        db.close()




@csrf_exempt
def insert_or_update_approve_status(request):
    if request.method != 'POST':
        return JsonResponse({"Error": "Invalid request method"}, status=400)

    try:
        test_records = json.loads(request.body)
        print('test_records:', test_records)
        if not isinstance(test_records, list):
            return JsonResponse({"Error": "Payload must be a list of records"}, status=400)

        
        cursor = db.cursor()

        for data in test_records:
            billing_invoice = data.get('Billing_Invoice')
            test = data.get('testname')
            patient_id = data.get('patient_id')
            Test_Code = data.get('Test_Code')
            Notes = data.get('Notes')
            Report_Type = data.get('Report_Type')
            Microscopy_Data = data.get('Microscopy_Data')
            macroscopy = data.get('macroscopy')
            site = data.get('site')
            Culture_Report = data.get('Culture_Report')
            report_status = data.get('Report_Status')
            Bacteria_isolated = data.get('Bacteria_Isolated')
            IsSubTest = data.get("IsSubTest")
            SubTestCodes = data.get("SubTestCodes")
            transferlocation = data.get("transferlocation")  # Fixed typo: data..get -> data.get
            srfId = data.get("srfId")
            icmrId = data.get("icmrId")
            specimenCondition = data.get("condition")
            covidType = data.get("testType")
            covidResult = data.get("covidTest")
            uom = data.get("uom")
            content = data.get('Content')
            labtechnician = data.get('labtechnician')
            doctorid = data.get('doctorid')
            pathologyremarks = data.get('pathologyremarks')
            pathologyyesorno = data.get('pathologyyesorno')
            abstinence = data.get('abstinence')
            acid_fast = data.get('acid_fast')
            positivity = data.get('positivity')
            encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8') if content else None

            if not all([billing_invoice, test, Test_Code]):
                return JsonResponse({"Error": "Missing billing invoice, test name, or test code"}, status=400)

            # Check for existing records
            cursor.execute("""
                SELECT COUNT(*)
                FROM AnalyseInvestigationSenior 
                WHERE Patient_Id = %s AND Billing_invoice = %s AND Test_Code = %s
            """, (patient_id, billing_invoice, Test_Code))
            count = cursor.fetchone()[0]
            print('count:', count)
            
            # status = 'Retest' if count > 0 else ('Verified' if data.get('status') == 'Verified' else 'Retest')
            if count > 0:
                
                sql = """
                    UPDATE AnalyseInvestigationSenior
                    SET 
                      Capture_Value=%s,Status =%s ,EditContent = %s
                     WHERE Billing_invoice=%s AND Test_Code=%s
                """
                cursor.execute(sql,( data.get('Capture_Value'),data.get('status'),encoded_html,billing_invoice,Test_Code))
            else:
                # Generate new Sl_No
                cursor.execute("SELECT MAX(Sl_No) FROM AnalyseInvestigationSenior")
                max_id_result = cursor.fetchone()
                next_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

                # Insert into AnalyseInvestigationSenior
                cursor.execute("""
                    INSERT INTO AnalyseInvestigationSenior (
                        Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
                        Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, Patient_Id, Colony_Count, 
                        Capture_Organism, Location, CreatedBy, EditContent, Department, Reference, Reference_Range, 
                        Test_Code, Notes, Microscopy_Data, Culture_Report, Report_Type, Input_Type, Report_Status, 
                        micronumber, histonumber, Bacteria_Isolated, IsSubTest, SubTestCodes, Transfer_Location,site,macroscopy,
                        UpdatedAt, CreatedAt,Result, srfId, icmrId, specimenCondition, covidType, covidResult,uom,
                        DoctorID,labtechnician,pathologyremarks,pathologyyesorno,abstinence,acid_fast,positivity
                    )
                   VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s)
                """, (
                    next_id, test, billing_invoice, data.get('Patient_Name'), data.get('visitid'),
                    data.get('Sample_Specimen', 'N/A'), data.get('Method', 'N/A'), data.get('Capture_Value'),
                    data.get('paniclow', 'N/A'), data.get('panichigh', 'N/A'), data.get('Medical_Remark', ''),
                    data.get('Technical_Remark', ''), data.get('status'), patient_id, data.get('colony_count'),
                    data.get('Capture_Oragnism'), data.get('location'), data.get('createdby'), encoded_html,
                    data.get('department'), data.get('reference'), data.get('referencedata'), Test_Code, Notes,
                    Microscopy_Data, Culture_Report, Report_Type, data.get('inputtype'), report_status,
                    data.get('micronumber'), data.get('histonumber'), Bacteria_isolated, IsSubTest, SubTestCodes,
                    transferlocation,site, macroscopy,datetime.now(), datetime.now(),data.get('Result'), srfId, icmrId, 
                    specimenCondition, covidType, covidResult,uom,doctorid,labtechnician,pathologyremarks,
                    pathologyyesorno,abstinence,acid_fast,positivity
                ))

            # Update Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab 
                SET Verify_Status = 'Completed', UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, (datetime.now(), billing_invoice, Test_Code))
            print('Updated Verify_Status to Completed for', Test_Code)

            # Check Autocheck logic
            cursor.execute("""
                SELECT Autocheck, Parameter_One 
                FROM Test_Descriptions 
                WHERE Test_Code = %s
            """, (Test_Code,))
            autocheck_result = cursor.fetchone()
            autocheck, value = autocheck_result if autocheck_result else (None, None)
            print('autocheck:', autocheck, 'value:', value)

            if autocheck == 'Yes':
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Test_Code = %s AND Billing_Invoice = %s
                """, (Test_Code, billing_invoice))
                count = cursor.fetchone()[0]
                print('autocheck count:', count)

                if int(value) == count:
                    cursor.execute("""
                        UPDATE Billing_invoice_and_bill_amount
                        SET Verify_Status = 'Completed', UpdatedAt = %s
                        WHERE Billing_Invoice = %s
                    """, (datetime.now(), billing_invoice,))
                else:
                    cursor.execute("""
                        UPDATE Billing_invoice_and_bill_amount
                        SET Verify_Status = 'Autocheck', UpdatedAt = %s
                        WHERE Billing_Invoice = %s
                    """, (datetime.now(), billing_invoice,))
                db.commit()
                print('Autocheck update success')
            else:
                # Check overall verification status
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s AND Verify_Status != 'Completed'
                """, (billing_invoice,))
                not_completed_count = cursor.fetchone()[0]
                print('not_completed_count:', not_completed_count)

                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != ''
                """, (billing_invoice,))
                transfer_count = cursor.fetchone()[0]
                print('transfer_count:', transfer_count)

                if not_completed_count == 0:
                    new_verify_status = 'Completed'
                elif transfer_count > 0:
                    new_verify_status = 'Transfer'  # Preserve Transfer if any test is transferred
                else:
                    new_verify_status = 'Recollect'  # Partial completion without transfers

                cursor.execute("""
                    UPDATE Billing_invoice_and_bill_amount
                    SET Verify_Status = %s, UpdatedAt = %s
                    WHERE Billing_Invoice = %s
                """, (new_verify_status, datetime.now(), billing_invoice))
                db.commit()
                print(f'Updated Verify_Status to {new_verify_status}')

        return JsonResponse({"message": "Records processed successfully."}, status=200)

    except Exception as e:
        print("Error:", str(e))
        if 'db' in locals():
            db.rollback()
        return JsonResponse({"Error": str(e)}, status=500)

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()






@csrf_exempt
def update_if_retest(request):
    if request.method != "POST":
        return JsonResponse({"Error": "This endpoint only accepts POST requests."})

    try:
        # Assuming get_db_connection() is a function that returns a database connection
        
        cursor = db.cursor()

        data = json.loads(request.body)
        print( "Payload",data)

        if not isinstance(data, list):
            return JsonResponse({"Error": "Payload must be a list."})

        for record in data:
            billing_invoice = record.get('Billing_Invoice')
            Test_Code = record.get('Test_Code')
            Capture_Value = record.get('Capture_Value')

            if not billing_invoice or not Test_Code:
                # Skipping records with missing required fields
                continue

            cursor.execute("""
                UPDATE AnalyseInvestigationResult
                SET Previous_Value = %s, Capture_Value = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [Capture_Value,None, billing_invoice, Test_Code])

            cursor.execute("""
                UPDATE AnalyseInvestigationSenior
                SET Previous_Value = %s, Capture_Value = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [Capture_Value,None, billing_invoice, Test_Code])





            # Update Analysis_Status in Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab
                SET Analysis_Status = 'Retest', Verify_Status = 'Retest', UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [datetime.now(), billing_invoice, Test_Code])

            # Assuming you want to update the status in Billing_invoice_and_bill_amount as well
            cursor.execute("""
                UPDATE Billing_invoice_and_bill_amount
                SET Verify_Status = 'Retest', Analyze_Status ='Retest', Approve_Status = 'Retest', UpdatedAt = %s
                WHERE Billing_Invoice = %s
            """, [datetime.now(), billing_invoice])

        db.commit()  # Make sure to commit changes

        return JsonResponse({"message": "Records updated successfully."}, status=200)
    except Exception as er:
        # Rollback in case of any exception
        db.rollback()
        return JsonResponse({"Error": str(er)})
    finally:
        # Make sure to close both cursor and db connection
        cursor.close()
        db.close()


@csrf_exempt
def update_if_retest_senior(request):
    if request.method != "POST":
        return JsonResponse({"Error": "This endpoint only accepts POST requests."})

    try:
        # Assuming get_db_connection() is a function that returns a database connection
        
        cursor = db.cursor()

        data = json.loads(request.body)

        if not isinstance(data, list):
            return JsonResponse({"Error": "Payload must be a list."})

        for record in data:
            billing_invoice = record.get('Billing_Invoice')
            Test_Code = record.get('Test_Code')
            Capture_Value = record.get('Capture_Value')

            if not billing_invoice or not Test_Code:
                # Skipping records with missing required fields
                continue

            # Update Analysis_Status in Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE AnalyseInvestigationResult
                SET Previous_Value = %s, Capture_Value = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [Capture_Value,None, billing_invoice, Test_Code])

            # Update Analysis_Status in Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab
                SET Analysis_Status = 'Retest', UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [datetime.now(), billing_invoice, Test_Code])

            # Assuming you want to update the status in Billing_invoice_and_bill_amount as well
            cursor.execute("""
                UPDATE Billing_invoice_and_bill_amount
                SET Verify_Status = 'Retest', UpdatedAt = %s
                WHERE Billing_Invoice = %s
            """, [datetime.now(),billing_invoice])

        db.commit()  # Make sure to commit changes

        return JsonResponse({"message": "Records updated successfully."}, status=200)
    except Exception as er:
        # Rollback in case of any exception
        db.rollback()
        return JsonResponse({"Error": str(er)})
    finally:
        # Make sure to close both cursor and db connection
        cursor.close()
        db.close()


      
def get_record_from_lab_seniortechy_completed(request):
    if request.method == 'GET':
        from django.db import connection as _conn
        try:
            limit = int(request.GET.get('limit', 15))
            offset = int(request.GET.get('offset', 0))

            with _conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM AnalyseInvestigationSenior")
                total_records = cursor.fetchone()[0]

                sql_query = """
                    SELECT Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
                           Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, UpdatedAt, CreatedAt
                    FROM AnalyseInvestigationSenior
                    ORDER BY CreatedAt DESC
                    LIMIT %s OFFSET %s
                """
                cursor.execute(sql_query, (limit, offset))
                records = cursor.fetchall()

                test_report_data = []
                for record in records:
                    test_record = {
                        'Analyse_Id': record[0],
                        'Test': record[1],
                        'Billing_invoice': record[2],
                        'Patient_Name': record[3],
                        'Visit_Id': record[4],
                        'Sample_Specimen': record[5],
                        'Method': record[6],
                        'Capture_Value': record[7],
                        'Panic_Low': record[8],
                        'Panic_High': record[9],
                        'Medical_Remark': record[10],
                        'Technical_Remark': record[11],
                        'Status': record[12],
                        'UpdatedAt': record[13].strftime('%Y-%m-%d %H:%M:%S') if record[13] else None,
                        'CreatedAt': record[14].strftime('%Y-%m-%d %H:%M:%S') if record[14] else None
                    }
                    test_report_data.append(test_record)
               
            return JsonResponse({'total_records': total_records, 'data': test_report_data}, safe=False)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'})

def get_record_from_lab_seniortechy(request):
    if request.method != 'GET':
        return JsonResponse({"Error": "Invalid request method. Only GET is allowed."}, status=405)

    invoice = request.GET.get('Billinginvoice')     
    if not invoice:
        return JsonResponse({"Error": "Billing invoice parameter is missing."}, status=400)

    try:
        with connection.cursor() as cursor:
            visitid = request.GET.get('Visitid')
            location = request.GET.get('Location', 'ALL')
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
            status = 'Completed'

            # Convert department codes to department names
            department_names = []
            if department_codes:
                department_codes_list = department_codes.split(',')
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
                    return JsonResponse({"Error": "No valid department codes found."}, status=400)
            else:
                return JsonResponse({"Error": "Department parameter is required."}, status=400)

            # Initial query with department filtering
            print((invoice, status, location, location, tuple(department_names), tuple(department_names), tuple(department_names)))
            # ── OPTIMISED: Added td.Culturetest so no per-test lookup needed ────────
            # Also simplified dept filter: senior techy tests are individual type only,
            # so direct JOIN is cleaner and faster than 3-way LEFT JOIN.
            sql_testname = """
                SELECT bit.Test_Name, bit.Test_Code, bit.IsSubTest, bit.SubTestCodes,
                       bit.Transfer_Location, bit.PackageName, bit.Group_Name,
                       td.Culturetest
                FROM Billing_Item_Table_for_lab bit
                JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
                JOIN SubLab_Department_Detials sld ON td.sub_department_id = sld.SubDepartment_Code
                WHERE bit.Billing_Invoice = %s
                  AND bit.Bill_Status != 'Canceled'
                  AND bit.Service_Status = %s
                  AND bit.Analysis_Status = 'Completed'
                  AND bit.Verify_Status = 'Completed'
                  AND bit.Approve_Status != 'Completed'
                  AND (
                      (bit.Transfer_Location = %s)
                      OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                  )
                  AND sld.SubDepartment_Name IN %s
            """
            cursor.execute(sql_testname, (invoice, status, location, location, tuple(department_names)))
            tests = cursor.fetchall()
            print('tests:', tests)

            if not tests:
                return JsonResponse({"Error": "No tests found for the given invoice, status, and departments."}, status=404)

            details_list = []

            # ─────────────────────────────────────────────────────────────────────
            # OPTIMISED get_record_from_lab_seniortechy
            # FIX: Same N+1 as junior techy — Culturetest now fetched in main query.
            # Batch A: all culture results in ONE query.
            # Batch B: all normal results in ONE query.
            # Before: 1 + (2 × N) queries.  After: 3 queries total.
            # ─────────────────────────────────────────────────────────────────────
            culture_codes = [t[1] for t in tests if (t[7] or 'No') == 'Yes']
            normal_codes  = [t[1] for t in tests if (t[7] or 'No') != 'Yes']
            test_meta = {
                t[1]: {
                    'is_subtest': t[2], 'subtest_codes': t[3],
                    'transfer': t[4], 'package_name': t[5], 'group_name': t[6],
                }
                for t in tests
            }
            details_list = []

            # Batch A: culture tests
            if culture_codes:
                cursor.execute("""
                    SELECT Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen,
                           Method, Colony_Count, Capture_Organism, Status, Department, Test_Code,
                           Notes, Microscopy_Data, Culture_Report, Report_Type, EditContent,
                           Report_Status, micronumber, histonumber, Bacteria_Isolated, site,
                           macroscopy, srfId, icmrId, specimenCondition, covidType,
                           covidResult, labtechnician, acid_fast, positivity
                    FROM AnalyseInvestigationSenior
                    WHERE Billing_invoice = %s AND Visit_Id = %s AND Test_Code IN %s
                """, (invoice, visitid, tuple(culture_codes)))
                for record in cursor.fetchall():
                    meta = test_meta.get(record[11], {})
                    
                    details_list.append({
                        'Analyse_Id': record[0], 'Test': record[1],
                        'Billing_invoice': record[2], 'Patient_Name': record[3],
                        'Visit_Id': record[4], 'Sample_Specimen': record[5],
                        'Method': record[6], 'Colony_Count': record[7],
                        'Capture_Oragnism': record[8], 'Status': record[9],
                        'Culturetest': 'Yes', 'Department': record[10],
                        'Test_Code': record[11], 'Notes': record[12],
                        'Microscopy_Data': record[13], 'Culture_Report': record[14],
                        'Report_Type': record[15], 'Content': record[16],
                        'Report_Status': record[17], 'micronumber': record[18],
                        'histonumber': record[19], 'Bacteria_Isolated': record[20],
                        'site': record[21], 'macroscopy': record[22],
                        'transferlocation': meta.get('transfer'),
                        'IsSubTest': meta.get('is_subtest'),
                        'SubTestCodes': meta.get('subtest_codes'),
                        'PackageName': meta.get('package_name'),
                        'Group_Name': meta.get('group_name'),
                        'srfId': record[23], 'icmrId': record[24],
                        'condition': record[25], 'testType': record[26],
                        'covidTest': record[27], 'labtechnician': record[28],
                        'acid_fast': record[29], 'positivity': record[30],
                        # 'reportfile': file_base64, 'rangeType': record[32],
                    })

            # Batch B: normal tests
            if normal_codes:
                cursor.execute("""
                    SELECT ais.Sl_No, ais.Test, ais.Billing_invoice, ais.Patent_Name,
                           ais.Visit_Id, ais.Sample_Specimen, ais.Method, ais.Capture_Value,
                           ais.Panic_Low, ais.Panic_High, ais.Medical_Remark, ais.Technical_Remark,
                           ais.Status, ais.UpdatedAt, ais.CreatedAt, ais.EditContent,
                           ais.Department, ais.Reference, ais.Reference_Range, ais.Test_Code,
                           ais.Input_Type, ais.Result, td.Iscutoffvalue, ais.srfId, ais.icmrId,
                           ais.specimenCondition, ais.covidType, ais.covidResult, ais.uom,
                           ais.Previous_Value, ais.labtechnician, ais.pathologyremarks,
                           ais.pathologyyesorno, ais.abstinence, ais.Reportfile
                    FROM AnalyseInvestigationSenior ais
                    INNER JOIN Test_Descriptions td ON td.Test_Code = ais.Test_Code
                    WHERE ais.Billing_invoice = %s AND ais.Visit_Id = %s AND ais.Test_Code IN %s
                """, (invoice, visitid, tuple(normal_codes)))
                for record in cursor.fetchall():
                    meta = test_meta.get(record[19], {})
                    
                    # Safe base64 encoding for reportfile
                    file_base64 = None
                    if record[34]:
                        try:
                            # Check if it's already a base64 string
                            if isinstance(record[34], str):
                                if record[34].startswith('data:'):
                                    file_base64 = record[34]
                                else:
                                    file_base64 = 'data:application/pdf;base64,' + record[34]
                            # If it's bytes, encode it
                            elif isinstance(record[34], bytes) and len(record[34]) > 0:
                                file_base64 = 'data:application/pdf;base64,' + base64.b64encode(record[34]).decode('utf-8')
                        except Exception as e:
                            print(f"Reportfile encoding error for test {record[19]}: {e}")
                            file_base64 = None
                    
                    details_list.append({
                        'Analyse_Id': record[0], 'Test': record[1],
                        'Billing_invoice': record[2], 'Patient_Name': record[3],
                        'Visit_Id': record[4], 'Sample_Specimen': record[5],
                        'Method': record[6], 'Capture_Value': record[7],
                        'Panic_Low': record[8], 'Panic_High': record[9],
                        'Medical_Remark': record[10], 'Technical_Remark': record[11],
                        'Status': record[12],
                        'UpdatedAt': record[13].strftime('%Y-%m-%d %H:%M:%S') if record[13] else None,
                        'CreatedAt': record[14].strftime('%Y-%m-%d %H:%M:%S') if record[14] else None,
                        'Content': record[15], 'Department': record[16],
                        'Reference': record[17], 'Reference_Range': record[18],
                        'Test_Code': record[19], 'Input_Type': record[20],
                        'Result': record[21], 'Iscutoffvalue': record[22],
                        'IsSubTest': meta.get('is_subtest'),
                        'SubTestCodes': meta.get('subtest_codes'),
                        'transferlocation': meta.get('transfer'),
                        'srfId': record[23], 'icmrId': record[24],
                        'condition': record[25], 'testType': record[26],
                        'covidTest': record[27], 'uom': record[28],
                        'PackageName': meta.get('package_name'),
                        'Group_Name': meta.get('group_name'),
                        'Previous_Value': record[29], 'labtechnician': record[30],
                        'pathologyremarks': record[31], 'pathologyyesorno': record[32],
                        'abstinence': record[33],
                        'reportfile': file_base64,  # ✅ ADDED - Was missing!
                        'Culturetest': 'No',
                    })

            return JsonResponse(details_list, safe=False)

    except Exception as er:
        print('Error:', er)
        return JsonResponse({"Error": str(er)}, status=500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

# @csrf_exempt
# def insert_or_update_path_approve_status(request):
#     if request.method != 'POST':
#         return JsonResponse({"Error": "Invalid request method"}, status=400)

#     try:
#         test_records = json.loads(request.body)
#         if not isinstance(test_records, list):
#             return JsonResponse({"Error": "Payload must be a list of records"}, status=400)

        
#         cursor = db.cursor()

#         for data in test_records:
#             status = 'Approved' if data.get('status') == 'Approved' else 'Retest'
#             billing_invoice = data.get('Billing_Invoice')
#             test = data.get('testname')
#             patient_id = data.get('patient_id')
#             Test_Code = data.get('Test_Code')
#             Notes = data.get('Notes')
#             Report_Type = data.get('Report_Type')
#             Microscopy_Data = data.get('Microscopy_Data')
#             site = data.get('site')
#             macroscopy = data.get('macroscopy')
#             Culture_Report = data.get('Culture_Report')
#             Report_Status = data.get('Report_Status')
#             Bacteria_Isolated = data.get('Bacteria_Isolated')
#             IsSubTest = data.get("IsSubTest")
#             SubTestCodes = data.get("SubTestCodes")
#             transferlocation = data.get("transferlocation")
#             srfId = data.get("srfId")
#             icmrId = data.get("icmrId")
#             specimenCondition = data.get("condition")
#             covidType = data.get("testType")
#             labtechnician = data.get("labtechnician")
#             doctorid = data.get("doctorid")
#             covidResult = data.get("covidTest")
#             pathologyremarks = data.get("pathologyremarks")
#             pathologyyesorno = data.get("pathologyyesorno")
#             abstinence = data.get("abstinence")
#             content = data.get('Content')
#             encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8') if content else None

#             print("IsSubTest:", IsSubTest)
#             print("SubTestCodes:", SubTestCodes)

#             if not all([billing_invoice, test, Test_Code]):
#                 return JsonResponse({"Error": "Missing billing invoice, test name, or test code"}, status=400)

#             cursor.execute("""
#                 SELECT COUNT(*)
#                 FROM Approve_Test_Pathologist 
#                 WHERE Patient_Id = %s AND Billing_invoice = %s AND Test_Code = %s
#             """, (patient_id, billing_invoice, Test_Code))
#             count = cursor.fetchone()[0]
#             print('count:', count)
            
#             # status = 'Retest' if count > 0 else ('Verified' if data.get('status') == 'Verified' else 'Retest')
#             if count > 0:
#                 sql = """
#                     UPDATE Approve_Test_Pathologist
#                     SET 
#                         Capture_Value=%s,Status =%s ,EditContent = %s,Previous_Value =%s
#                     WHERE Billing_invoice=%s AND Test_Code=%s
#                 """
#                 cursor.execute(sql,( data.get('Capture_Value'),data.get('status'),encoded_html,data.get('Previous_Value'),billing_invoice,Test_Code))
#             else:

#                 # Generate new Sl_No
#                 cursor.execute("SELECT MAX(Sl_No) FROM Approve_Test_Pathologist")
#                 max_id_result = cursor.fetchone()
#                 next_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

#                 # Insert into Approve_Test_Pathologist
#                 cursor.execute("""
#                     INSERT INTO Approve_Test_Pathologist (
#                         Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
#                         Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, Patient_Id, Colony_Count, 
#                         Capture_Organism, Location, CreatedBy, Reference, Reference_Range, Test_Code, Notes, 
#                         Microscopy_Data, Culture_Report, Report_Type, EditContent, Report_Status, micronumber, 
#                         histonumber, Bacteria_Isolated, IsSubTest, SubTestCodes, Transfer_Location, UpdatedAt,CreatedAt,
#                         macroscopy,site,Result, srfId, icmrId, specimenCondition, covidType,covidResult,Previous_Value,
#                         labtechnician,DoctorID,pathologyremarks,pathologyyesorno,abstinence
#                     )

#                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s,%s, %s, %s,%s, %s,%s,%s,%s,%s,%s,%s,%s)
#                 """, [
#                     next_id, test, billing_invoice, data.get('Patient_Name'), data.get('visitid'),
#                     data.get('Sample_Specimen', 'N/A'), data.get('Method', 'N/A'), data.get('Capture_Value'),
#                     data.get('paniclow', 'N/A'), data.get('panichigh', 'N/A'), data.get('Medical_Remark', ''),
#                     data.get('Technical_Remark', ''), status, patient_id, data.get('colony_count'),
#                     data.get('Capture_Oragnism'), data.get('location'), data.get('createdby'),
#                     data.get('reference'), data.get('referencedata'), Test_Code, Notes, Microscopy_Data,
#                     Culture_Report, Report_Type, encoded_html, Report_Status, data.get('micronumber'),
#                     data.get('histonumber'), Bacteria_Isolated, IsSubTest, SubTestCodes, transferlocation, datetime.now(), datetime.now(),
#                     macroscopy,site,data.get('Result'), srfId, icmrId, specimenCondition, covidType, covidResult,data.get('Previous_Value'),
#                     labtechnician,doctorid,pathologyremarks,pathologyyesorno,abstinence
#                 ])

#             # Update Billing_Item_Table_for_lab
#             cursor.execute("""
#                 UPDATE Billing_Item_Table_for_lab 
#                 SET Approve_Status = 'Completed', UpdatedAt = %s
#                 WHERE Billing_Invoice = %s AND Test_Code = %s
#             """, [datetime.now(), billing_invoice, Test_Code])
#             print('Updated Approve_Status to Completed for', Test_Code)

#             # Check Autocheck logic
#             cursor.execute("""
#                 SELECT Autocheck, Parameter_One 
#                 FROM Test_Descriptions 
#                 WHERE Test_Code = %s
#             """, (Test_Code,))
#             autocheck_result = cursor.fetchone()
#             autocheck, value = autocheck_result if autocheck_result else (None, None)
#             print('autocheck:', autocheck, 'value:', value)

#             if autocheck == 'Yes':
#                 cursor.execute("""
#                     SELECT COUNT(*)
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Test_Code = %s AND Billing_Invoice = %s
#                 """, (Test_Code, billing_invoice))
#                 count = cursor.fetchone()[0]
#                 print('autocheck count:', count)

#                 if int(value) == count:
#                     cursor.execute("""
#                         UPDATE Billing_invoice_and_bill_amount
#                         SET Approve_Status = 'Completed', UpdatedAt = %s
#                         WHERE Billing_Invoice = %s
#                     """, (datetime.now(), billing_invoice,))
#                 else:
#                     cursor.execute("""
#                         UPDATE Billing_invoice_and_bill_amount
#                         SET Approve_Status = 'Autocheck', UpdatedAt = %s
#                         WHERE Billing_Invoice = %s
#                     """, (datetime.now(), billing_invoice,))
#                 db.commit()
#                 print('Autocheck update success')
#             else:
#                 # Check overall approval status
#                 cursor.execute("""
#                     SELECT COUNT(*)
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Billing_Invoice = %s AND Approve_Status != 'Completed' AND Test_Method != 'Reflex'
#                 """, (billing_invoice,))
#                 not_completed_count = cursor.fetchone()[0]
#                 print('not_completed_count:', not_completed_count)

#                 cursor.execute("""
#                     SELECT COUNT(*)
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Billing_Invoice = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != ''
#                 """, (billing_invoice,))
#                 transfer_count = cursor.fetchone()[0]
#                 print('transfer_count:', transfer_count)

#                 if not_completed_count == 0:
#                     new_approve_status = 'Completed'
#                 elif transfer_count > 0:
#                     new_approve_status = 'Transfer'  # Preserve Transfer if any test is transferred
#                 else:
#                     new_approve_status = 'Recollect'  # Partial completion without transfers

#                 cursor.execute("""
#                     UPDATE Billing_invoice_and_bill_amount
#                     SET Approve_Status = %s, UpdatedAt = %s
#                     WHERE Billing_Invoice = %s
#                 """, (new_approve_status,datetime.now(), billing_invoice))
#                 db.commit()
#                 print(f'Updated Approve_Status to {new_approve_status}')

#         return JsonResponse({"message": "Records processed successfully."}, status=200)

#     except Exception as e:
#         print("Error:", str(e))
#         if 'db' in locals():
#             db.rollback()
#         return JsonResponse({"Error": str(e)}, status=500)

#     finally:
#         if 'cursor' in locals():
#             cursor.close()
#         if 'db' in locals():
#             db.close()



@csrf_exempt
def insert_or_update_path_approve_status(request):
    if request.method != 'POST':
        return JsonResponse({"Error": "Invalid request method"}, status=400)

    try:
        test_records = json.loads(request.body)
        if not isinstance(test_records, list):
            return JsonResponse({"Error": "Payload must be a list of records"}, status=400)

        
        cursor = db.cursor()
        
        for data in test_records:
            status = 'Approved' if data.get('status') == 'Approved' else 'Retest'
            billing_invoice = data.get('Billing_Invoice')
            test = data.get('testname')
            patient_id = data.get('patient_id')
            Test_Code = data.get('Test_Code')
            Notes = data.get('Notes')
            Report_Type = data.get('Report_Type')
            Microscopy_Data = data.get('Microscopy_Data')
            site = data.get('site')
            macroscopy = data.get('macroscopy')
            Culture_Report = data.get('Culture_Report')
            Report_Status = data.get('Report_Status')
            Bacteria_Isolated = data.get('Bacteria_Isolated')
            IsSubTest = data.get("IsSubTest")
            SubTestCodes = data.get("SubTestCodes")
            transferlocation = data.get("transferlocation")
            srfId = data.get("srfId")
            icmrId = data.get("icmrId")
            specimenCondition = data.get("condition")
            covidType = data.get("testType")
            labtechnician = data.get("labtechnician")
            doctorid = data.get("doctorid")
            covidResult = data.get("covidTest")
            pathologyremarks = data.get("pathologyremarks")
            pathologyyesorno = data.get("pathologyyesorno")
            abstinence = data.get("abstinence")
            content = data.get('Content')
            encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8') if content else None
            acid_fast = data.get('acid_fast')
            positivity = data.get('positivity')

           
            

            
            # print("Decoded reportfile size:", len(reportfile))
            
            
            if data.get('status') == "co-authorize":

                print("Status-----------",data.get('status'))
                if not all([billing_invoice, test, Test_Code]):
                    return JsonResponse({"Error": "Missing billing invoice, test name, or test code"}, status=400)

                cursor.execute("""
                    SELECT DoctorID
                    FROM Approve_Test_Pathologist 
                    WHERE Patient_Id = %s AND Billing_invoice = %s AND Test_Code = %s
                """, (patient_id, billing_invoice, Test_Code))
                Doctor = cursor.fetchone()
                print('count:', Doctor)
                print("Doctor------------")
                
                if Doctor:
                    doctor_list = Doctor[0].split("//")
                    
                    if doctorid:
                        doctorss = Doctor[0] + "//" + doctorid
                    else:
                        doctorss = Doctor[0]
                    sql = """
                        UPDATE Approve_Test_Pathologist
                        SET 
                            Capture_Value=%s,Status =%s ,EditContent = %s,Previous_Value =%s, DoctorID = %s , UpdatedAt = %s
                        WHERE Billing_invoice=%s AND Test_Code=%s
                    """
                    cursor.execute(sql,( data.get('Capture_Value'),data.get('status'),encoded_html,data.get('Previous_Value'), doctorss, datetime.now(), billing_invoice, Test_Code))
                    db.commit()
                else:
                    cursor.execute("SELECT MAX(Sl_No) FROM Approve_Test_Pathologist")
                    max_id_result = cursor.fetchone()
                    next_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

                    cursor.execute("""
                        INSERT INTO Approve_Test_Pathologist (
                            Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
                            Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, Patient_Id, Colony_Count, 
                            Capture_Organism, Location, CreatedBy, Reference, Reference_Range, Test_Code, Notes, 
                            Microscopy_Data, Culture_Report, Report_Type, EditContent, Report_Status, micronumber, 
                            histonumber, Bacteria_Isolated, IsSubTest, SubTestCodes, Transfer_Location, UpdatedAt,CreatedAt,
                            macroscopy,site,Result, srfId, icmrId, specimenCondition, covidType,covidResult,Previous_Value,
                            labtechnician,DoctorID,pathologyremarks,pathologyyesorno,abstinence,acid_fast,positivity,rangeType
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s,%s, %s, %s,%s, %s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """, [
                        next_id, test, billing_invoice, data.get('Patient_Name'), data.get('visitid'),
                        data.get('Sample_Specimen', 'N/A'), data.get('Method', 'N/A'), data.get('Capture_Value'),
                        data.get('paniclow', 'N/A'), data.get('panichigh', 'N/A'), data.get('Medical_Remark', ''),
                        data.get('Technical_Remark', ''), data.get('status'), patient_id, data.get('colony_count'),
                        data.get('Capture_Oragnism'), data.get('location'), data.get('createdby'),
                        data.get('reference'), data.get('referencedata'), Test_Code, Notes, Microscopy_Data,
                        Culture_Report, Report_Type, encoded_html, Report_Status, data.get('micronumber'),
                        data.get('histonumber'), Bacteria_Isolated, IsSubTest, SubTestCodes, transferlocation, datetime.now(), datetime.now(),
                        macroscopy,site,data.get('Result'), srfId, icmrId, specimenCondition, covidType, covidResult,data.get('Previous_Value'),
                        labtechnician,doctorid,pathologyremarks,pathologyyesorno,abstinence,acid_fast,positivity
                    ])
                    db.commit()
                    print("co-authorize Inserted")

            else:
                status = 'Approved' if data.get('status') == 'Approved' else 'Retest'
                if not all([billing_invoice, test, Test_Code]):
                    return JsonResponse({"Error": "Missing billing invoice, test name, or test code"}, status=400)

                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Approve_Test_Pathologist 
                    WHERE Patient_Id = %s AND Billing_invoice = %s AND Test_Code = %s
                """, (patient_id, billing_invoice, Test_Code))
                count = cursor.fetchone()[0]
                print('count:', count)
                
                # status = 'Retest' if count > 0 else ('Verified' if data.get('status') == 'Verified' else 'Retest')
                if count > 0:
                    cursor.execute("""
                        SELECT Status, DoctorID
                        FROM Approve_Test_Pathologist 
                        WHERE Patient_Id = %s AND Billing_invoice = %s AND Test_Code = %s
                    """, (patient_id, billing_invoice, Test_Code))
                    Status = cursor.fetchone()
                    print('Status:', Status[0])
                    print("Status------------1")

                    if Status[0] == "co-authorize":
                        doctor_list = Status[1].split("//")
                        if doctorid:
                            doctorss = Status[1] + "//" + doctorid
                        else:
                            doctorss = Status[1]

                        print("Status------------",doctorss)
                        sql = """
                            UPDATE Approve_Test_Pathologist
                            SET 
                                Capture_Value=%s,Status =%s ,EditContent = %s,Previous_Value =%s, DoctorID = %s, UpdatedAt = %s
                            WHERE Billing_invoice=%s AND Test_Code=%s
                        """
                        cursor.execute(sql,( data.get('Capture_Value'),data.get('status'),encoded_html,data.get('Previous_Value'), doctorss, datetime.now(), billing_invoice,Test_Code))

                    else:
                        sql = """
                            UPDATE Approve_Test_Pathologist
                            SET 
                                Capture_Value=%s,Status =%s ,EditContent = %s,Previous_Value =%s, UpdatedAt = %s
                            WHERE Billing_invoice=%s AND Test_Code=%s
                        """
                        cursor.execute(sql,( data.get('Capture_Value'),data.get('status'),encoded_html,data.get('Previous_Value'), datetime.now(), billing_invoice,Test_Code))
                else:
                    # Generate new Sl_No
                    cursor.execute("SELECT MAX(Sl_No) FROM Approve_Test_Pathologist")
                    max_id_result = cursor.fetchone()
                    next_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

                    # Insert into Approve_Test_Pathologist
                    cursor.execute("""
                        INSERT INTO Approve_Test_Pathologist (
                            Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
                            Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, Patient_Id, Colony_Count, 
                            Capture_Organism, Location, CreatedBy, Reference, Reference_Range, Test_Code, Notes, 
                            Microscopy_Data, Culture_Report, Report_Type, EditContent, Report_Status, micronumber, 
                            histonumber, Bacteria_Isolated, IsSubTest, SubTestCodes, Transfer_Location, UpdatedAt,CreatedAt,
                            macroscopy,site,Result, srfId, icmrId, specimenCondition, covidType,covidResult,Previous_Value,
                            labtechnician,DoctorID,pathologyremarks,pathologyyesorno,abstinence,acid_fast,positivity
                        )

                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s,%s, %s, %s,%s, %s,%s,%s,%s,%s,%s,%s)
                    """, [
                        next_id, test, billing_invoice, data.get('Patient_Name'), data.get('visitid'),
                        data.get('Sample_Specimen', 'N/A'), data.get('Method', 'N/A'), data.get('Capture_Value'),
                        data.get('paniclow', 'N/A'), data.get('panichigh', 'N/A'), data.get('Medical_Remark', ''),
                        data.get('Technical_Remark', ''), status, patient_id, data.get('colony_count'),
                        data.get('Capture_Oragnism'), data.get('location'), data.get('createdby'),
                        data.get('reference'), data.get('referencedata'), Test_Code, Notes, Microscopy_Data,
                        Culture_Report, Report_Type, encoded_html, Report_Status, data.get('micronumber'),
                        data.get('histonumber'), Bacteria_Isolated, IsSubTest, SubTestCodes, transferlocation, datetime.now(), datetime.now(),
                        macroscopy,site,data.get('Result'), srfId, icmrId, specimenCondition, covidType, covidResult,data.get('Previous_Value'),
                        labtechnician,doctorid,pathologyremarks,pathologyyesorno,abstinence,acid_fast,positivity
                    ])

                cursor.execute("""
                    UPDATE Billing_Item_Table_for_lab 
                    SET Approve_Status = 'Completed', UpdatedAt = %s
                    WHERE Billing_Invoice = %s AND Test_Code = %s
                """, [datetime.now(), billing_invoice, Test_Code])
                print('Updated Approve_Status to Completed for', Test_Code)

                # Check Autocheck logic
                cursor.execute("""
                    SELECT Autocheck, Parameter_One 
                    FROM Test_Descriptions 
                    WHERE Test_Code = %s
                """, (Test_Code,))
                autocheck_result = cursor.fetchone()
                autocheck, value = autocheck_result if autocheck_result else (None, None)
                print('autocheck:', autocheck, 'value:', value)

                if autocheck == 'Yes':
                    cursor.execute("""
                        SELECT COUNT(*)
                        FROM Billing_Item_Table_for_lab
                        WHERE Test_Code = %s AND Billing_Invoice = %s
                    """, (Test_Code, billing_invoice))
                    count = cursor.fetchone()[0]
                    print('autocheck count:', count)

                    if int(value) == count:
                        cursor.execute("""
                            UPDATE Billing_invoice_and_bill_amount
                            SET Approve_Status = 'Completed', UpdatedAt = %s
                            WHERE Billing_Invoice = %s
                        """, (datetime.now(), billing_invoice,))
                    else:
                        cursor.execute("""
                            UPDATE Billing_invoice_and_bill_amount
                            SET Approve_Status = 'Autocheck', UpdatedAt = %s
                            WHERE Billing_Invoice = %s
                        """, (datetime.now(), billing_invoice,))
                    db.commit()
                    print('Autocheck update success')
                else:
                    # Check overall approval status
                    cursor.execute("""
                        SELECT COUNT(*)
                        FROM Billing_Item_Table_for_lab
                        WHERE Billing_Invoice = %s AND Approve_Status != 'Completed' AND Test_Method != 'Reflex'
                    """, (billing_invoice,))
                    not_completed_count = cursor.fetchone()[0]
                    print('not_completed_count:', not_completed_count)

                    cursor.execute("""
                        SELECT COUNT(*)
                        FROM Billing_Item_Table_for_lab
                        WHERE Billing_Invoice = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != ''
                    """, (billing_invoice,))
                    transfer_count = cursor.fetchone()[0]
                    print('transfer_count:', transfer_count)

                    if not_completed_count == 0:
                        new_approve_status = 'Completed'
                    elif transfer_count > 0:
                        new_approve_status = 'Transfer'  # Preserve Transfer if any test is transferred
                    else:
                        new_approve_status = 'Recollect'  # Partial completion without transfers

                    cursor.execute("""
                        UPDATE Billing_invoice_and_bill_amount
                        SET Approve_Status = %s, UpdatedAt = %s
                        WHERE Billing_Invoice = %s
                    """, (new_approve_status,datetime.now(), billing_invoice))
                    db.commit()
                    print(f'Updated Approve_Status to {new_approve_status}')
            
        return JsonResponse({"message": "Records processed successfully."}, status=200)

    except Exception as e:
        print("Error:", str(e))
        if 'db' in locals():
            db.rollback()
        return JsonResponse({"Error": str(e)}, status=500)

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



# #-------------------------get for pathalogist---------------------------------------

def get_record_from_lab_pathalogist_completed(request):
    if request.method == 'GET':
        from django.db import connection as _conn
        try:
            limit = int(request.GET.get('limit', 15))
            offset = int(request.GET.get('offset', 0))

            with _conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM Approve_Test_Pathologist")
                total_records = cursor.fetchone()[0]

                sql_query = """
                    SELECT Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value, 
                           Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, UpdatedAt, CreatedAt
                    FROM Approve_Test_Pathologist
                    ORDER BY CreatedAt DESC
                    LIMIT %s OFFSET %s
                """
                cursor.execute(sql_query, (limit, offset))
                records = cursor.fetchall()

                test_report_data = []
                for record in records:
                    test_record = {
                        'Analyse_Id': record[0],
                        'Test': record[1],
                        'Billing_invoice': record[2],
                        'Patient_Name': record[3],
                        'Visit_Id': record[4],
                        'Sample_Specimen': record[5],
                        'Method': record[6],
                        'Capture_Value': record[7],
                        'Panic_Low': record[8],
                        'Panic_High': record[9],
                        'Medical_Remark': record[10],
                        'Technical_Remark': record[11],
                        'Status': record[12],
                        'UpdatedAt': record[13].strftime('%Y-%m-%d %H:%M:%S') if record[13] else None,
                        'CreatedAt': record[14].strftime('%Y-%m-%d %H:%M:%S') if record[14] else None
                    }
                    test_report_data.append(test_record)
               
            return JsonResponse({'total_records': total_records, 'data': test_report_data}, safe=False)

        except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'})




def get_graph_trends(request):
    if request.method == 'GET':
        response_data = []
        try:
            cursor = db.cursor()

            patientname = request.GET.get('patientname')
            testcode = request.GET.get('test')
            print('testcode', testcode)
            # Debugging: Confirming the received parameters
            print(f"Received patientname: {patientname}, testname: {testcode}")

            query = """
                SELECT DATE(CreatedAt), Capture_Value
                FROM (
                    SELECT Visit_Id, CreatedAt, Capture_Value
                    FROM AnalyseInvestigationResult
                    WHERE Test_Code = %s AND Patient_Id = %s
                    ORDER BY Visit_Id DESC
                    LIMIT 5
                ) AS sub
                ORDER BY Visit_Id ASC;
            """
            cursor.execute(query, (testcode, patientname,))
            rows = cursor.fetchall()

            print(f"Fetched rows: {rows}")  # Debugging: Check what the query returns

            # Correct the data format
            response_data = [{'visit': row[0], 'data': row[1]} for row in rows]
            # response_data = sorted(response_data, key=lambda x: datetime.strptime(x["visit"], "%Y-%m-%d"))
            
            return JsonResponse(response_data, safe=False)

        except Exception as er:
            print(f"Error: {er}")  # Debugging: Log any errors
            return JsonResponse({"Error": str(er)})
        finally:
            if cursor: cursor.close()
            if db: db.close()


#--------------------------- Get data for Report ---------------------------------------------------#
def get_for_report_data(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()

            query = """
            SELECT
                rpd.Patient_Id,
                rpd.UpdatedAt,
                rpd.Patient_Name,
                rpd.Address,
                rpd.Phone,
                rpd.Refering_Doctor,
                bia.Billing_Id,
                bia.Billing_Invoice AS BillingAmount_Billing_Invoice,
                bia.Patient_Id AS BillingAmount_Patient_Id,
                bia.Visit_Id AS BillingAmount_Visit_Id,
                bia.Patient_Name AS BillingAmount_Patient_Name,
                bia.Item_Count AS BillingAmount_Item_Count,
                bia.Total_Charge AS BillingAmount_Total_Charge,
                bia.Discount_Type AS BillingAmount_Discount_Type,
                bia.Discount AS BillingAmount_Discount,
                bia.Net_Amount AS BillingAmount_Net_Amount,
                bia.Status AS BillingAmount_Status,
                bia.Location AS BillingAmount_Location,
                bpd.Billing_Id AS PaymentDetails_Billing_Id,
                bpd.Billing_invoice AS PaymentDetails_Billing_Invoice,
                bpd.Patient_Id AS PaymentDetails_Patient_Id,
                bpd.Net_Amount AS PaymentDetails_Net_Amount,
                bpd.Payment_Type AS PaymentDetails_Payment_Type,
                bpd.Paid_Amount AS PaymentDetails_Paid_Amount,
                bpd.Remaing_Amount AS PaymentDetails_Remaining_Amount
            FROM
                Register_patient_Details rpd
            INNER JOIN Billing_invoice_and_bill_amount bia ON rpd.Patient_Id = bia.Patient_Id
            INNER JOIN Bill_Payment_details bpd ON bia.Billing_Id = bpd.Billing_Id
            """

            cursor.execute(query)
            results = cursor.fetchall()

            patients_data = []
            for row in results:
                patient_data = {
                    'Patient_Id': row[0],
                    'UpdatedAt': row[1].strftime('%Y-%m-%d'),
                    'Patient_Name': row[2],
                    'Address': row[3],
                    'Phone': row[4],
                    'Refering_Doctor': row[5],
                    # Assuming Billing_Invoice refers to bia.Billing_Invoice for clarification
                    'Billing_Invoice': row[6],
                    'BillingAmount_Billing_Invoice': row[7],
                    'BillingAmount_Patient_Id': row[8],
                    'BillingAmount_Visit_Id': row[9],
                    'BillingAmount_Patient_Name': row[10],
                    'BillingAmount_Item_Count': row[11],
                    'BillingAmount_Total_Charge': row[12],
                    'BillingAmount_Discount_Type': row[13],
                    'BillingAmount_Discount': row[14],
                    'BillingAmount_Net_Amount': row[15],
                    'BillingAmount_Status': row[16],
                    'BillingAmount_Location': row[17],
                    'PaymentDetails_Billing_Id': row[18],
                    'PaymentDetails_Billing_Invoice': row[19],
                    'PaymentDetails_Patient_Id': row[20],
                    'PaymentDetails_Net_Amount': row[21],
                    'PaymentDetails_Payment_Type': row[22],
                    'PaymentDetails_Paid_Amount': row[23],
                    'PaymentDetails_Remaining_Amount': row[24]
                }
                patients_data.append(patient_data)

            return JsonResponse(patients_data, safe=False)

        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()

    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})
    

#--------------------------------- Get for Report -------------------------------------------#


import re

def extract_panic_range(reference_range, patient_gender=None):
    print('reference_range:', reference_range)
    
    """Extracts panic values (low and high) from a complex reference range string."""
    if not isinstance(reference_range, str) or not reference_range.strip():
        return None, None  # If reference_range is None or not a string, return None values.

    min_value, max_value = None, None

    # Regex for a simple range (e.g., "70 - 120")
    range_match = re.findall(r"(\d+\.?\d*)\s*-\s*(\d+\.?\d*)", reference_range)

    # Regex for "less than" and "more than" cases
    less_than_match = re.findall(
        r"less than\s*(\d+\.?\d*)", reference_range, re.IGNORECASE
    )
    more_than_match = re.findall(
        r"more than\s*(\d+\.?\d*)", reference_range, re.IGNORECASE
    )

    # Regex for gender-specific ranges (e.g., "Male: 0.7 to 1.2")
    gender_range_match = re.findall(
        r"(Male|Female)\s*:\s*(\d+\.?\d*)\s*(?:to|and)\s*(\d+\.?\d*)",
        reference_range,
        re.IGNORECASE,
    )

    # Regex for "up to" a certain value (e.g., "Up to 1.1")
    upto_match = re.findall(r"up to\s*(\d+\.?\d*)", reference_range, re.IGNORECASE)

    # Handle gender-specific ranges first
    if gender_range_match:
        # If gender-specific, match the patient gender
        for gender, low, high in gender_range_match:
            gender = gender.lower()
            if (patient_gender and gender == patient_gender.lower()) or gender in ['children', 'other']:
                min_value, max_value = float(low), float(high)
                break  # Once matched, break out of the loop

    # Handle simple range
    elif range_match:
        min_value, max_value = float(range_match[0][0]), float(range_match[0][1])

    # Handle "less than"
    elif less_than_match:
        max_value = float(less_than_match[0])

    # Handle "more than"
    elif more_than_match:
        min_value = float(more_than_match[0])

    # Handle "up to"
    elif upto_match:
        max_value = float(upto_match[0])

    return min_value, max_value




# def getdataforreport(request):
#     try:
        
#         cursor = db.cursor()

#         Visitid = request.GET.get("Visitid")
#         patientid = request.GET.get("patientid")
#         Billinginvoice = request.GET.get("Billinginvoice")
#         print("dssdfsfs")

#         query = """
#             WITH RankedResults AS (
#                 SELECT
#                     bit.*,
#                     td.Test_Name AS td_Test_Name,
#                     sd.SubDepartment_Name,
#                     td.Header,
#                     td.Billing_Name,
#                     td.Container_Name_id,
#                     td.Specimen_Name_id,
#                     mm.Method_Name,
#                     td.Gender AS td_Gender,
#                     td.Input_Type,
#                     td.Decimal_Palces,
#                     td.Input_Pattern_Type,
#                     td.Test_Category,
#                     td.Captured_Unit,
#                     uom.Unit_Name,
#                     td.Test_Instructions,
#                     td.Culturetest,
#                     d.SubDepartment_Code_id,
#                     d.OrderID,
#                     Ap.Reference_Range AS ReferenceRange,
#                     rpd.Gender AS rpd_Gender,
#                     bit.Test_Method AS bit_Test_Method,
#                     bit.Group_Name AS bit_Group_Name,
#                     Ap.Technical_Remark,
#                     asm.NormalValue,
#                     asm.PanicLow AS Panic_Low,
#                     asm.PanicHigh AS Panic_High,
#                     bit.Item_Id AS bit_Item_Id,
#                     bit.PackageCode AS bit_PackageCode,
#                     bit.Group_Code AS bit_Group_Code,
#                     Ap.Capture_Value,
#                     Ap.Report_Type,
#                     Ap.Microscopy_Data,
#                     Ap.Notes,
#                     Ap.Colony_Count,
#                     Ap.Culture_Report,
#                     Ap.EditContent,
#                     td.DisplayText,
#                     Ap.Sample_Specimen,
#                     Ap.Bacteria_Isolated,
#                     Ap.micronumber,
#                     ti.Header_interpretation, 
#                     ti.Comments,
#                     Ap.site,
#                     Ap.macroscopy,
#                     td.Iscutoffvalue,
#                     Ap.Result,
#                     ROW_NUMBER() OVER (PARTITION BY bit.Test_Code ORDER BY asm.updated_at DESC) AS rn,
#                     Ap.srfId,
#                     Ap.icmrId,
#                     Ap.specimenCondition,
#                     Ap.covidType,
#                     Ap.covidResult
#                 FROM
#                     Billing_Item_Table_for_lab AS bit
#                 LEFT JOIN
#                     Test_Descriptions AS td ON td.Test_Code = bit.Test_Code
#                 LEFT JOIN
#                     DepartmentOrderMaster d ON td.Sub_Department_id = d.SubDepartment_Code_id
#                 LEFT JOIN
#                     Age_Setup_Master AS asm ON asm.Test_Code_id = bit.Test_Code
#                 LEFT JOIN
#                     Register_patient_Details AS rpd ON rpd.Patient_Id = bit.Patient_Id
#                 LEFT JOIN Testmaster_Interpretation_table ti ON ti.Test_Code_id = bit.Test_Code
#                 INNER JOIN
#                     Approve_Test_Pathologist AS Ap ON Ap.Billing_Invoice = bit.Billing_Invoice
#                         AND Ap.Test_Code = bit.Test_Code
#                 LEFT JOIN 
#                     sublab_department_detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
#                 LEFT JOIN 
#                     unit_masters uom ON td.UOM_id = uom.Unit_Code
#                     AND td.UOM_id IS NOT NULL 
#                     AND td.UOM_id != '' 
#                 LEFT JOIN 
#                     methods_masters mm ON td.Method_Name_id = mm.Method_Code
#                     AND td.Method_Name_id IS NOT NULL 
#                     AND td.Method_Name_id != '' 
#                 WHERE
#                     bit.Patient_Id = %s
#                     AND bit.Visit_Id = %s
#                     AND bit.Billing_Invoice = %s
#                     AND Ap.Status = 'Approved'
#             )
#             SELECT
#                 RankedResults.*,
#                 RankedResults.td_Test_Name AS Test_Name
#             FROM
#                 RankedResults
#             WHERE
#                 rn = 1
#             ORDER BY
#                 CAST(OrderID AS UNSIGNED) ASC, SubDepartment_Name ASC
#         """
#         cursor.execute(query, (patientid, Visitid, Billinginvoice))
#         data = cursor.fetchall()
        
#         # print("data", data)
#         column = [i[0] for i in cursor.description]

#         def convert_to_serializable(item):
#             if isinstance(item, datetime):
#                 return item.strftime("%Y-%m-%d %H:%M:%S")
#             return item

#         department_data = defaultdict(
#             lambda: {
#                 "invoice_details": {},
#                 "test_details": [],
#                 "ReportType": None,
#                 "OrderID": None,
#                 "Test_Method": None,
#                 "PackageName": None,
#                 "index": None,
#                 "Outsourcealert": []
#             }
#         )

#         group_data = defaultdict(
#             lambda: {
#                 "invoice_details": {},
#                 "test_details": [],
#                 "ReportType": None,
#                 "OrderID": None,
#                 "Test_Method": None,
#                 "PackageName": None,
#                 "department_name": None,
#             }
#         )

#         # Dictionary to hold tests and their subtests for ordering
#         test_map = {}
#         subtest_map = {}
#         ordered_test_details = defaultdict(list)
#         ordered_dept_test_details = defaultdict(list)
#         processed_subtest_ids = set()
#         colony={}

#         # First pass: Build test and subtest mappings
#         for row in data:
#             row_dict = dict(
#                 (column[i], convert_to_serializable(row[i])) for i in range(len(row))
#             )
#             test_map[row_dict["Item_Id"]] = row_dict
#             if row_dict.get("SubTestCodes"):
#                 subtest_map[row_dict["SubTestCodes"]] = row_dict["Item_Id"]
#             print(row_dict)
#         for row in data:
#             row_dict = dict(
#                 (column[i], convert_to_serializable(row[i])) for i in range(len(row))
#             )

#             invoice_no = row_dict.get("Billing_Invoice")

#             department_name = row_dict.get("SubDepartment_Name")
#             patient_gender = row_dict.get("Gender")
#             Report_Type = row_dict.get("Report_Type")
#             OrderID = row_dict.get("OrderID")
#             Test_Method = row_dict.get("Test_Method")
#             print('Test_Method', Test_Method)
#             Group_Name = row_dict.get("Group_Name")
#             PackageCode = row_dict.get("bit_PackageCode")
#             Group_Code = row_dict.get("Group_Code")
#             test_code = row_dict.get("Test_Code")
#             patient_id = row_dict.get("Patient_Id")
#             invoice = row_dict.get("Billing_Invoice")
#             Culturetest = row_dict.get("Culturetest")
#             department_data[department_name]["ReportType"] = Report_Type

#             PackageName = ""
#             if PackageCode is not None:
#                 query1 = """SELECT package_name FROM OfferPackage WHERE package_code = %s"""
#                 cursor.execute(query1, (PackageCode,))
#                 package_result = cursor.fetchone()
#                 PackageName = package_result[0] if package_result else ""

#             # Define invoice_details with only invoice-related fields
#             invoice_details = {
#                 "Billing_Invoice": row_dict.get("Billing_Invoice"),
#                 "Patient_Id": row_dict.get("Patient_Id"),
#                 "Visit_Id": row_dict.get("Visit_Id"),
#                 "Patient_Name": row_dict.get("Patient_Name"),
#                 "Gross_Amount": row_dict.get("Gross_Amount"),
#                 "Location": row_dict.get("Location"),
#                 "Service_Status": row_dict.get("Service_Status"),
#                 "Analysis_Status": row_dict.get("Analysis_Status"),
#                 "Verify_Status": row_dict.get("Verify_Status"),
#                 "Approve_Status": row_dict.get("Approve_Status"),
#                 "Barcode_Id": row_dict.get("Barcode_Id"),
#                 "CreatedBy": row_dict.get("CreatedBy"),
#                 "Billing_Date": row_dict.get("Billing_Date"),
#                 "UpdatedAt": row_dict.get("UpdatedAt"),
#                 "CreatedAt": row_dict.get("CreatedAt"),
#             }

#             # Fetch and add updated_at timestamps to invoice_details
#             updated_at_data_offer = {
#                 "AnalyseInvestigationResult": "N/A",
#                 "AnalyseInvestigationSenior": "N/A",
#                 "Approve_Test_Pathologist": "N/A"
#             }
#             cursor.execute("""
#                 SELECT 'AnalyseInvestigationResult' AS Source, MAX(UpdatedAt) 
#                 FROM AnalyseInvestigationResult 
#                 WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
#                 UNION ALL
#                 SELECT 'AnalyseInvestigationSenior', MAX(UpdatedAt) 
#                 FROM AnalyseInvestigationSenior 
#                 WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
#                 UNION ALL
#                 SELECT 'Approve_Test_Pathologist', MAX(UpdatedAt) 
#                 FROM Approve_Test_Pathologist 
#                 WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
#             """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
#             updates = cursor.fetchall()

#             for source, updated_at in updates:
#                 if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_offer[source]):
#                     updated_at_data_offer[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#             # Add timestamps to invoice_details
#             invoice_details.update(updated_at_data_offer)

#             test_details = {
#                 key: row_dict[key]
#                 for key in row_dict
#                 if key not in ["Billing_Invoice", "Sub_Department"]
#             }

#             reference_range = row_dict.get("ReferenceRange")
#             NormalValue = row_dict.get("NormalValue")
#             Panic_Low = row_dict.get("Panic_Low")
#             Panic_High = row_dict.get("Panic_High")
#             print("lllooooo")

#             if NormalValue == "Yes":
#                 panic_low, panic_high = extract_panic_range(reference_range, patient_gender)
#                 test_details["paniclow"] = panic_low
#                 test_details["panichigh"] = panic_high
#             else:
#                 test_details["paniclow"] = Panic_Low
#                 test_details["panichigh"] = Panic_High

#             Capture_Value = row_dict.get("Capture_Value")
#             if Capture_Value is not None:
#                 if Capture_Value.replace(".", "", 1).isdigit():
#                     if "." in Capture_Value:
#                         test_details["Capture_Value"] = float(Capture_Value)
#                     else:
#                         test_details["Capture_Value"] = int(Capture_Value)
#                 else:
#                     test_details["Capture_Value"] = Capture_Value

#             test_details["Billing_Invoice"] = invoice_no
#             print("22222222")
#             # Check if this test is a subtest and get its parent's group or department
#             parent_group_name = None
#             parent_department_name = None
#             if row_dict["Test_Code"] in subtest_map:
#                 parent_item_id = subtest_map[row_dict["Test_Code"]]
#                 parent_group_name = test_map[parent_item_id].get("Group_Name")
#                 parent_department_name = test_map[parent_item_id].get("Sub_Department")
#                 if row_dict["Item_Id"] in processed_subtest_ids:
#                     continue
#             print("333333")
#             # Handle package tests (Test_Method == "Offers")
#             if Test_Method == "Offers":
#                 print("Handling Offers")
#                 if Group_Name or parent_group_name:
#                     target_group_name = Group_Name if Group_Name else parent_group_name
#                     group_data[target_group_name]["ReportType"] = "Group" if not group_data[target_group_name]["ReportType"] else group_data[target_group_name]["ReportType"]
#                     group_data[target_group_name]["OrderID"] = OrderID
#                     group_data[target_group_name]["Test_Method"] = Test_Method
                    
#                     print("Group_Code", Group_Code)
#                     selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
#                     cursor.execute(selectquery1, (Group_Code,) if Group_Code else (test_map.get(parent_item_id, {}).get("Group_Code"),))
#                     group_result = cursor.fetchone()
#                     group_department_name = group_result[0] if group_result else department_name
#                     group_data[target_group_name]["department_name"] = group_department_name

#                     if not group_data[target_group_name]["invoice_details"]:
#                         group_data[target_group_name]["invoice_details"] = invoice_details

#                     if not parent_group_name or row_dict["Item_Id"] not in processed_subtest_ids:
#                         ordered_test_details[target_group_name].append(test_details)

#                     if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
#                         subtest_code = row_dict["SubTestCodes"]
#                         subtest_item_id = next(
#                             (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
#                             None
#                         )
#                         if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
#                             subtest_details = test_map[subtest_item_id].copy()
#                             subtest_details["Billing_Invoice"] = invoice_no
#                             sub_ref_range = subtest_details.get("ReferenceRange")
#                             sub_normal = subtest_details.get("NormalValue")
#                             if sub_normal == "Yes":
#                                 sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
#                                 subtest_details["paniclow"] = sub_panic_low
#                                 subtest_details["panichigh"] = sub_panic_high
#                             ordered_test_details[target_group_name].append(subtest_details)
#                             processed_subtest_ids.add(subtest_item_id)

#                 elif not parent_group_name:
#                     department_data[department_name]["OrderID"] = OrderID
#                     if not department_data[department_name]["invoice_details"]:
#                         department_data[department_name]["invoice_details"] = invoice_details
#                     department_data[department_name]["test_details"].append(test_details)
#                     department_data[department_name]["Test_Method"] = Test_Method
#                     department_data[department_name]["PackageName"] = PackageName

#             # Handle regular group tests (Test_Method == "Group")
#             elif Test_Method == "Group":
#                 print("llllooo")
#                 group_data[Group_Name]["ReportType"] = Report_Type
#                 group_data[Group_Name]["OrderID"] = OrderID
#                 group_data[Group_Name]["Test_Method"] = Test_Method
                
#                 print("Group_Code", Group_Code)
#                 selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
#                 cursor.execute(selectquery1, (Group_Code,))
#                 group_result = cursor.fetchone()
#                 group_department_name = group_result[0] if group_result else None
#                 group_data[Group_Name]["department_name"] = group_department_name

#                 if not group_data[Group_Name]["invoice_details"]:
#                     group_data[Group_Name]["invoice_details"] = invoice_details

#                 if row_dict["Item_Id"] not in processed_subtest_ids:
#                     ordered_test_details[Group_Name].append(test_details)
#                 if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
#                     subtest_code = row_dict["SubTestCodes"]
#                     subtest_item_id = next(
#                         (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
#                         None
#                     )
#                     if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
#                         subtest_details = test_map[subtest_item_id].copy()
#                         subtest_details["Billing_Invoice"] = invoice_no
#                         sub_ref_range = subtest_details.get("ReferenceRange")
#                         sub_normal = subtest_details.get("NormalValue")
#                         if sub_normal == "Yes":
#                             sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
#                             subtest_details["paniclow"] = sub_panic_low
#                             subtest_details["panichigh"] = sub_panic_high
#                         ordered_test_details[Group_Name].append(subtest_details)
#                         processed_subtest_ids.add(subtest_item_id)

#             # Handle individual tests not in a package or group
#             else:
#                 print("llllooo1111")
#                 department_data[department_name]["OrderID"] = OrderID
#                 if not department_data[department_name]["invoice_details"]:
#                     department_data[department_name]["invoice_details"] = invoice_details
#                 department_data[department_name]["Test_Method"] = Test_Method
#                 department_data[department_name]["PackageName"] = PackageName

#                 if row_dict["Item_Id"] not in processed_subtest_ids:
#                     ordered_dept_test_details[department_name].append(test_details)
#                 if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
#                     subtest_code = row_dict["SubTestCodes"]
#                     subtest_item_id = next(
#                         (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
#                         None
#                     )
#                     if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
#                         subtest_details = test_map[subtest_item_id].copy()
#                         subtest_details["Billing_Invoice"] = invoice_no
#                         sub_ref_range = subtest_details.get("ReferenceRange")
#                         sub_normal = subtest_details.get("NormalValue")
#                         if sub_normal == "Yes":
#                             sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)

#                             subtest_details["paniclow"] = sub_panic_low
#                             subtest_details["panichigh"] = sub_panic_high
#                         ordered_dept_test_details[department_name].append(subtest_details)
#                         processed_subtest_ids.add(subtest_item_id)

#                 print('department_name :', department_name)
#                 print('Culturetest :', Culturetest)
#                 if department_name == "MICROBIOLOGY" and Culturetest == "Yes":
#                     query1 = """SELECT DISTINCT Captured_Oraganism, Sensitive_Type, Antibiotic_Name, Antibiotic_Value
#                                 FROM Complete_Culture_Examination 
#                                 WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
#                     cursor.execute(query1, (Billinginvoice, patientid, Visitid))
#                     data1 = cursor.fetchall()

#                     column1 = [i[0] for i in cursor.description]
#                     result = defaultdict(list)

#                     sensitivity_order = {"Sensitive": 1, "Intermediate": 2, "Resistant": 3}
                    
                    
                    
#                     for row in data1:
#                         row_data = dict(zip(column1, row))
#                         organism = row_data["Captured_Oraganism"]
#                         query = """
#                         SELECT `intermediate`, `resistant`, `sensitive` FROM AntibioticMaster WHERE anti_biotic = %s;
#                         """
#                         cursor.execute(query, (row_data["Antibiotic_Name"],))
#                         fetched = cursor.fetchall()

#                         # Set defaults in case no result is returned
#                         intermediate, resistant, sensitive = "", "", ""

#                         if fetched:
#                             intermediate, resistant, sensitive = fetched[0]

#                         antibiotic_info = {
#                             "Antibiotic": row_data["Antibiotic_Name"],
#                             "SensitivityType": row_data["Sensitive_Type"],
#                             "CaptureValue": row_data["Antibiotic_Value"],
#                             "Intermediate": intermediate,
#                             "Resistant": resistant,
#                             "Sensitive": sensitive,
#                         }
                        
#                         result[organism].append(antibiotic_info)
#                         print(organism,antibiotic_info)
                        
#                         query1 = """SELECT ColonyCount 
#                             FROM Complete_Culture_Examination 
#                             WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Captured_Oraganism = %s
#                             ORDER BY CreatedAt DESC LIMIT 1;"""
#                         cursor.execute(query1, (Billinginvoice, patientid, Visitid, organism))
#                         row = cursor.fetchone()

#                         if row is not None and row[0] is not None:
#                             ColonyCount = row[0]
#                         else:
#                             ColonyCount = ""
#                         colony[organism] = ColonyCount
#                     # print(result[organism])
                    

#                     for organism in result:
#                         result[organism].sort(key=lambda x: sensitivity_order.get(x["SensitivityType"], float("inf")))

#                     final_result_micro = [
#                         {organism: antibiotics} for organism, antibiotics in result.items()
#                     ]

#                     if ordered_dept_test_details[department_name]:
#                         for test in ordered_dept_test_details[department_name]:
#                             if "OrganismDetails" not in test:
#                                 test["OrganismDetails"] = final_result_micro
#                                 test["OrganismColony"] = colony
#                             else:
#                                 test["OrganismDetails"].extend(final_result_micro)
#                                 test["OrganismColony"] = colony
#                     else:
#                         ordered_dept_test_details[department_name].append(
#                             {"OrganismDetails": final_result_micro}
#                         )
#                         ordered_dept_test_details[department_name].append(
#                             {"OrganismColony":colony }
#                         )


#             if Group_Name:
#                 group_data[Group_Name]["PackageName"] = PackageName

#         # Assign ordered test details to group_data and sort by Item_Id
#         for group_name, test_details_list in ordered_test_details.items():
#             if group_name and test_details_list:
#                 test_details_list.sort(key=lambda x: x["Item_Id"])
#                 group_data[group_name]["test_details"] = test_details_list

#         # Assign ordered test details to department_data and sort by Item_Id
#         for dept_name, test_details_list in ordered_dept_test_details.items():
#             if dept_name and test_details_list:
#                 test_details_list.sort(key=lambda x: x["Item_Id"])
#                 department_data[dept_name]["test_details"] = test_details_list

#         # Prepare the final result
#         final_result = []
#         for dept_name, data in department_data.items():
#             if len(data["test_details"]) > 0:
#                 final_result.append(
#                     {
#                         "department": dept_name,
#                         "Report_Type": data["ReportType"],
#                         "testdetails": data["test_details"],
#                         "invoicedetails": data["invoice_details"],
#                         "OrderID": data["OrderID"],
#                         "Test_Method": data["Test_Method"],
#                         "PackageName": data["PackageName"],
#                         "index": data["index"],
#                         "Outsourcealert": data["Outsourcealert"]
#                     }
#                 )
#                 print("------colony------",data["test_details"])
                
#         for group_name, data in group_data.items():
#             print(data)
#             if len(data["test_details"]) > 0 and group_name:
                
#                 final_result.append(
#                     {
#                         "groupname": group_name,
#                         "department": data["department_name"],
#                         "Report_Type": data["ReportType"],
#                         "testdetails": data["test_details"],
#                         "invoicedetails": data["invoice_details"],
#                         "OrderID": data["OrderID"],
#                         "Test_Method": data["Test_Method"],
#                         "PackageName": data["PackageName"],
#                     }
#                 )
#                 print("------colony------",data)
#         print("-----------",colony,"----------")

#         # Sort final result based on OrderID
#         def sort_key(department):
#             order_id = department.get("OrderID")
#             if isinstance(order_id, str):
#                 try:
#                     order_id = int(order_id)
#                 except ValueError:
#                     order_id = float("inf")
#             return (
#                 order_id if order_id is not None else float("inf"),
#                 department.get("department") != "Coagulation",
#             )

#         final_result.sort(key=sort_key)
#         # print("------Fineal------",final_result)
#         return JsonResponse(final_result, safe=False)

#     except Exception as e:
#         print("error", e)
#         return JsonResponse({"status": str(e)}, safe=False)
#     finally:
#         if 'cursor' in locals():
#             cursor.close()
#         if 'db' in locals():
#             db.close()










# def get_report_data_by_dispatch(request):
#     if request.method != 'GET':
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=400)

#     invoice = request.GET.get('Billing_Invoice')
#     age = request.GET.get('age')
#     gender = request.GET.get('gender')
#     age_type = request.GET.get('timeperiod')
#     location = request.GET.get('Location')

#     if not invoice:
#         return JsonResponse({"error": "Billing_Invoice parameter is required"}, status=400)
#     if not location:
#         return JsonResponse({"error": "Location parameter is required"}, status=400)

#     try:
#         
#         cursor = db.cursor()

#         # Base query with location-specific filtering
#         where_clause = """
#             WHERE Billing_Invoice = %s 
#             AND Service_Status = 'Completed' 
#             AND Approve_Status = 'Completed'
#             AND (
#                 (Location = %s)
#                 OR (Transfer_Location = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != '')
#             )
#         """
#         params = [invoice, location, location]

#         # Fetch distinct items for Offers, Groups, and Individual tests
#         cursor.execute(f"""
#             SELECT DISTINCT PackageCode, Group_Name, Visit_Id, Patient_Id, Test_Method, Group_Code
#             FROM Billing_Item_Table_for_lab
#             {where_clause}
#         """, params)
        
#         items = cursor.fetchall()
#         print('items:', items)

#         if not items:
#             return JsonResponse({"error": "No data found for provided Billing_Invoice and Location"}, status=404)

#         result = []
#         processed_packages = set()

#         for package_code, group_name, visit_id, patient_id, test_method, group_code in items:
#             if test_method == 'Offers' and package_code and package_code not in processed_packages:
#                 # Handle Offers (Packages)
#                 processed_packages.add(package_code)
#                 cursor.execute("""
#                     SELECT package_name FROM OfferPackage WHERE package_code = %s
#                 """, [package_code])
#                 package_name_result = cursor.fetchone()
#                 package_name = package_name_result[0] if package_name_result else "Unknown Package"

#                 # Fetch all tests for this package
#                 cursor.execute(f"""
#                     SELECT DISTINCT Test_Name, Test_Code, Group_Name, Group_Code
#                     FROM Billing_Item_Table_for_lab
#                     {where_clause} AND Test_Method = 'Offers' AND PackageCode = %s
#                 """, params + [package_code])
#                 test_names = cursor.fetchall()
#                 print('offer test_names for', package_code, ':', test_names)

#                 offer_data = {
#                     "Method": "Offers",
#                     "Package_Name": package_name,
#                     "Package_Code": package_code,
#                     "Groups": [],
#                     "Ungrouped_Tests": [],
#                     "ReferenceRange": [],
#                     "Updated_At": {},
#                     "Department": package_name
#                 }
#                 updated_at_data_offer = {
#                     'AnalyseInvestigationResult': "N/A",
#                     'AnalyseInvestigationSenior': "N/A",
#                     'Approve_Test_Pathologist': "N/A",
#                 }

#                 # Store test info temporarily
#                 test_info_dict = {}

#                 # Fetch all test details
#                 for test_name_tuple in test_names:
#                     test_name = test_name_tuple[0]
#                     test_code = test_name_tuple[1]
#                     group_name_inner = test_name_tuple[2]
#                     group_code_inner = test_name_tuple[3]

#                     cursor.execute("""
#                         SELECT td.Method_Name, td.Test_Name, td.UOM, 
#                         ap.Capture_Value, td.Specimen_Name, ti.Header_interpretation, ti.Comments, 
#                         ap.Panic_Low, ap.Panic_High, td.Test_Code, td.Display_Text, td.Sub_Department,
#                         td.IsSubTest, td.SubTestCodes
#                         FROM Test_Descriptions td
#                         LEFT JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                         LEFT JOIN Testmaster_Interpretation_table ti ON ti.Test_Code = td.Test_Code
#                         WHERE td.Test_Code = %s
#                     """, [visit_id, patient_id, test_code])
#                     test_details = cursor.fetchall()

#                     for detail in test_details:
#                         test_info = {
#                             'Method_Name': detail[0],
#                             'Test_Name': detail[1],
#                             'UOM': detail[2],
#                             'CaptureValue': detail[3],
#                             'Sepcimen': detail[4],
#                             'Head': detail[5],
#                             'Detail': detail[6],
#                             'Paniclow': detail[7],
#                             'Panichigh': detail[8],
#                             'Test_Code': detail[9],
#                             'Display_Text': detail[10],
#                             'Department': detail[11] or package_name,
#                             'IsSubTest': detail[12],
#                             'SubTestCodes': detail[13]
#                         }
#                         test_info_dict[test_code] = test_info

#                     # Fetch reference range
#                     cursor.execute("""
#                         SELECT From_Value, To_Value, Gender, PanicLow, PanicHigh, TestName, Test_Code, 
#                         FromAge, Toage, FromAgeType, ToAgeType, NormalValue, Reference_Range
#                         FROM Age_Setup_Master 
#                         WHERE Test_Code = %s 
#                         AND (Gender = %s OR Gender = 'Both') 
#                         AND (
#                             (%s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END 
#                             AND FromAgeType = %s AND ToAgeType = %s)
#                             OR
#                             (FromAgeType = 'day' AND ToAgeType = 'year' 
#                             AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                             OR
#                             (FromAgeType = 'month' AND ToAgeType = 'year' 
#                             AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                         )
#                     """, (test_code, gender, age, age, age_type, age_type, age, age, age, age))
#                     reference_details = cursor.fetchall()

#                     for reference in reference_details:
#                         offer_data['ReferenceRange'].append({
#                             'From_Value': reference[0],
#                             'To_Value': reference[1],
#                             'Gender': reference[2],
#                             'PanicLow': reference[3],
#                             'PanicHigh': reference[4],
#                             'TestName': reference[5],
#                             'Test_Code': reference[6],
#                             'NormalValue': reference[11],
#                             'Reference_Range': reference[12]
#                         })

#                     # Fetch updated timestamps
#                     cursor.execute("""
#                         SELECT 'AnalyseInvestigationResult' AS Source, MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationResult 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'AnalyseInvestigationSenior', MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationSenior 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'Approve_Test_Pathologist', MAX(UpdatedAt) 
#                         FROM Approve_Test_Pathologist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                     """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
#                     updates = cursor.fetchall()

#                     for source, updated_at in updates:
#                         if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_offer[source]):
#                             updated_at_data_offer[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#                 # Process subtests and organize into groups
#                 group_dict = {}
#                 parent_to_subtests = {}

#                 # Identify parent-subtest relationships
#                 for test_code, test_info in test_info_dict.items():
#                     if test_info['IsSubTest'] == "Yes" and test_info['SubTestCodes']:
#                         subtest_codes = test_info['SubTestCodes'].split(',') if test_info['SubTestCodes'] else []
#                         parent_to_subtests[test_code] = subtest_codes

#                 # Organize tests into groups
#                 for test_code, test_info in test_info_dict.items():
#                     test_name_tuple = next(t for t in test_names if t[1] == test_code)
#                     group_name_inner = test_name_tuple[2]
#                     group_code_inner = test_name_tuple[3]

#                     # Only include tests that are not subtests of others (unless they are parents themselves)
#                     subtest_of_another = any(test_code in subtests for subtests in parent_to_subtests.values())
#                     if not subtest_of_another or test_code in parent_to_subtests:
#                         if group_name_inner and group_code_inner:
#                             group_key = (group_name_inner, group_code_inner)
#                             if group_key not in group_dict:
#                                 group_dict[group_key] = {
#                                     "Group_Name": group_name_inner,
#                                     "Group_Code": group_code_inner,
#                                     "Tests": []
#                                 }
#                             # Add subtests if this test is a parent
#                             if test_code in parent_to_subtests:
#                                 test_info['Subtests'] = [
#                                     test_info_dict[sub_code] for sub_code in parent_to_subtests[test_code]
#                                     if sub_code in test_info_dict
#                                 ]
#                             group_dict[group_key]["Tests"].append(test_info)
#                         else:
#                             if test_code in parent_to_subtests:
#                                 test_info['Subtests'] = [
#                                     test_info_dict[sub_code] for sub_code in parent_to_subtests[test_code]
#                                     if sub_code in test_info_dict
#                                 ]
#                             offer_data["Ungrouped_Tests"].append(test_info)

#                 offer_data["Groups"] = list(group_dict.values())
#                 offer_data['Updated_At'] = updated_at_data_offer
#                 result.append(offer_data)

#             elif test_method == 'Group' and group_code:
#                 # Handle Groups
#                 cursor.execute("""
#                     SELECT DISTINCT Test_Name, Test_Code
#                     FROM GroupMasterTestList 
#                     WHERE group_code = %s
#                 """, [group_code])
#                 test_names = cursor.fetchall()
#                 print('group test_names:', test_names)
#                 cursor.execute("""
#                     SELECT department_name FROM GroupMaster WHERE group_code = %s
#                 """, [group_code])
#                 department_result = cursor.fetchone()
#                 department = department_result[0] if department_result else "General"

#                 group_data = {
#                     "Method": test_method,
#                     "Group_Name": group_name,
#                     "Tests": [],
#                     "ReferenceRange": [],
#                     "Updated_At": {},
#                     "Department": department,
#                     "Group_Code": group_code
#                 }
#                 updated_at_data_group = {
#                     'AnalyseInvestigationResult': "N/A",
#                     'AnalyseInvestigationSenior': "N/A",
#                     'Approve_Test_Pathologist': "N/A"
#                 }

#                 # Store test info temporarily
#                 test_info_dict = {}

#                 for test_name_tuple in test_names:
#                     test_name = test_name_tuple[0]
#                     test_code = test_name_tuple[1]
#                     cursor.execute("""
#                         SELECT td.Method_Name, td.Test_Name, td.UOM, 
#                         ap.Capture_Value, td.Specimen_Name, ti.Header_interpretation, ti.Comments, 
#                         ap.Panic_Low, ap.Panic_High, td.Test_Code, td.Display_Text, td.Sub_Department,
#                         td.IsSubTest, td.SubTestCodes
#                         FROM Test_Descriptions td
#                         LEFT JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                         LEFT JOIN Testmaster_Interpretation_table ti ON ti.Test_Code = td.Test_Code
#                         WHERE td.Test_Code = %s
#                     """, [visit_id, patient_id, test_code])
#                     test_details = cursor.fetchall()

#                     for detail in test_details:
#                         test_info = {
#                             'Method_Name': detail[0],
#                             'Test_Name': detail[1],
#                             'UOM': detail[2],
#                             'CaptureValue': detail[3],
#                             'Sepcimen': detail[4],
#                             'Head': detail[5],
#                             'Detail': detail[6],
#                             'Paniclow': detail[7],
#                             'Panichigh': detail[8],
#                             'Test_Code': detail[9],
#                             'Display_Text': detail[10],
#                             'Department': detail[11] or department,
#                             'IsSubTest': detail[12],
#                             'SubTestCodes': detail[13]
#                         }
#                         test_info_dict[test_code] = test_info

#                     cursor.execute("""
#                         SELECT From_Value, To_Value, Gender, PanicLow, PanicHigh, TestName, Test_Code, 
#                         FromAge, Toage, FromAgeType, ToAgeType, NormalValue, Reference_Range
#                         FROM Age_Setup_Master 
#                         WHERE Test_Code = %s 
#                         AND (Gender = %s OR Gender = 'Both') 
#                         AND (
#                             (%s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END 
#                             AND FromAgeType = %s AND ToAgeType = %s)
#                             OR
#                             (FromAgeType = 'day' AND ToAgeType = 'year' 
#                             AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                             OR
#                             (FromAgeType = 'month' AND ToAgeType = 'year' 
#                             AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                         )
#                     """, (test_code, gender, age, age, age_type, age_type, age, age, age, age))
#                     reference_details = cursor.fetchall()

#                     for reference in reference_details:
#                         group_data['ReferenceRange'].append({
#                             'From_Value': reference[0],
#                             'To_Value': reference[1],
#                             'Gender': reference[2],
#                             'PanicLow': reference[3],
#                             'PanicHigh': reference[4],
#                             'TestName': reference[5],
#                             'Test_Code': reference[6],
#                             'NormalValue': reference[11],
#                             'Reference_Range': reference[12]
#                         })

#                     cursor.execute("""
#                         SELECT 'AnalyseInvestigationResult' AS Source, MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationResult 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'AnalyseInvestigationSenior', MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationSenior 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'Approve_Test_Pathologist', MAX(UpdatedAt) 
#                         FROM Approve_Test_Pathologist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                     """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
#                     updates = cursor.fetchall()

#                     for source, updated_at in updates:
#                         if updated_at and (updated_at_data_group[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_group[source]):
#                             updated_at_data_group[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#                 # Process subtests for Group
#                 parent_to_subtests = {}
#                 for test_code, test_info in test_info_dict.items():
#                     if test_info['IsSubTest'] == "Yes" and test_info['SubTestCodes']:
#                         subtest_codes = test_info['SubTestCodes'].split(',') if test_info['SubTestCodes'] else []
#                         parent_to_subtests[test_code] = subtest_codes

#                 for test_code, test_info in test_info_dict.items():
#                     subtest_of_another = any(test_code in subtests for subtests in parent_to_subtests.values())
#                     if not subtest_of_another or test_code in parent_to_subtests:
#                         if test_code in parent_to_subtests:
#                             test_info['Subtests'] = [
#                                 test_info_dict[sub_code] for sub_code in parent_to_subtests[test_code]
#                                 if sub_code in test_info_dict
#                             ]
#                         group_data["Tests"].append(test_info)

#                 group_data['Updated_At'] = updated_at_data_group
#                 result.append(group_data)

#             elif test_method == 'Individual':
#                 # Handle Individual Tests
#                 cursor.execute(f"""
#                     SELECT DISTINCT Test_Name, Test_Code, IsSubTest, SubTestCodes, Transfer_Location
#                     FROM Billing_Item_Table_for_lab
#                     {where_clause} AND Test_Method = 'Individual'
#                 """, params)
#                 test_names = cursor.fetchall()
#                 print('individual test_names:', test_names)

#                 for test_name_tuple in test_names:
#                     test_name = test_name_tuple[0]
#                     test_code = test_name_tuple[1]
#                     is_subtest = test_name_tuple[2]
#                     subtest_codes = test_name_tuple[3]
#                     transfer_location = test_name_tuple[4]

#                     updated_at_data_individual = {
#                         'AnalyseInvestigationResult': "N/A",
#                         'AnalyseInvestigationSenior': "N/A",
#                         'Approve_Test_Pathologist': "N/A",
#                     }

#                     test_data = {
#                         "Method": test_method,
#                         "Group_Name": test_name,
#                         "Tests": [],
#                         "ReferenceRange": [],
#                         "Updated_At": updated_at_data_individual,
#                         "Department": None
#                     }

#                     # Fetch Culturetest and Autocheck separately
#                     cursor.execute("SELECT Culturetest FROM Test_Descriptions WHERE Test_Code = %s", (test_code,))
#                     culturetest_result = cursor.fetchone()
#                     culturetest = culturetest_result[0] if culturetest_result else 'No'

#                     cursor.execute("SELECT Autocheck FROM Test_Descriptions WHERE Test_Code = %s", (test_code,))
#                     autocheck_result = cursor.fetchone()
#                     autocheck = autocheck_result[0] if autocheck_result else 'No'

#                     test_info_dict = {}

#                     # Fetch test details based on type
#                     if autocheck == 'Yes':
#                         cursor.execute("""
#                             SELECT td.Method_Name, td.Test_Name, td.Specimen_Name, td.UOM, td.Parameter_One, td.Parameter_Two, td.Test_Code,
#                             td.IsSubTest, td.SubTestCodes, td.Sub_Department
#                             FROM Test_Descriptions td
#                             WHERE td.Test_Code = %s
#                         """, [test_code])
#                         test_details = cursor.fetchall()

#                         for detail in test_details:
#                             test_info = {
#                                 'Method_Name': detail[0],
#                                 'Test_Name': detail[1],
#                                 'Sepcimen': detail[2],
#                                 'UOM': detail[3],
#                                 'Parameter_One': detail[4],
#                                 'Parameter_Two': detail[5],
#                                 'Test_Code': detail[6],
#                                 'IsSubTest': detail[7],
#                                 'SubTestCodes': detail[8],
#                                 'Department': detail[9]
#                             }
#                             test_info_dict[test_code] = test_info

#                         cursor.execute("""
#                             SELECT DISTINCT Capture_Value 
#                             FROM Approve_Test_Pathologist 
#                             WHERE Billing_invoice = %s AND Test_Code = %s AND Visit_Id = %s
#                         """, (invoice, test_code, visit_id))
#                         values = cursor.fetchall()
#                         test_data['Values'] = [value[0] for value in values]
#                         test_data['Times'] = []
#                         if test_info_dict[test_code]['Parameter_One'] and test_info_dict[test_code]['Parameter_Two']:
#                             parameter_one = int(test_info_dict[test_code]['Parameter_One']) if test_info_dict[test_code]['Parameter_One'] else 0
#                             parameter_two = int(test_info_dict[test_code]['Parameter_Two']) if test_info_dict[test_code]['Parameter_Two'] else 0
#                             for i in range(1, parameter_one + 1):
#                                 test_data['Times'].append(i * parameter_two)
#                         test_data['Culturetest'] = culturetest

#                     elif culturetest == 'Yes':
#                         cursor.execute("""
#                             SELECT td.Method_Name, td.Test_Name, ap.Colony_Count, ap.Capture_Organism, ap.Sample_Specimen, 
#                             td.UOM, ap.Notes, ap.Microscopy_Data, ap.Culture_Report, ap.Report_Type, td.Test_Code, 
#                             ap.Report_Status, td.Display_Text, ap.micronumber, ap.Bacteria_Isolated,
#                             td.IsSubTest, td.SubTestCodes, td.Sub_Department
#                             FROM Test_Descriptions td
#                             JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                             WHERE td.Test_Code = %s
#                         """, [visit_id, patient_id, test_code])
#                         test_details = cursor.fetchall()

#                         for detail in test_details:
#                             test_info = {
#                                 'Method_Name': detail[0],
#                                 'Test_Name': detail[1],
#                                 'Colony_Count': detail[2],
#                                 'Capture_Organism': detail[3],
#                                 'Sepcimen': detail[4],
#                                 'UOM': detail[5],
#                                 'Notes': detail[6],
#                                 'Microscopy_Data': detail[7],
#                                 'Culture_Report': detail[8],
#                                 'Report_Type': detail[9],
#                                 'Test_Code': detail[10],
#                                 'Report_Status': detail[11],
#                                 'Display_Text': detail[12],
#                                 'micronumber': detail[13],
#                                 'Bacteria_Isolated': detail[14],
#                                 'IsSubTest': detail[15],
#                                 'SubTestCodes': detail[16],
#                                 'Department': detail[17]
#                             }
#                             test_info_dict[test_code] = test_info

#                         cursor.execute("""
#                             SELECT DISTINCT Antibiotic_Name, Sensitive_Type, Captured_Oraganism
#                             FROM Complete_Culture_Examination 
#                             WHERE Billing_Invoice = %s AND Visit_Id = %s AND Test_Code = %s
#                             ORDER BY 
#                                 CASE 
#                                     WHEN Sensitive_Type = 'Sensitive' THEN 1
#                                     WHEN Sensitive_Type = 'Intermediate' THEN 2
#                                     WHEN Sensitive_Type = 'Resistant' THEN 3
#                                 END,
#                                 Antibiotic_Name ASC
#                         """, (invoice, visit_id, test_code))
#                         sensitivetype = cursor.fetchall()
#                         test_data['Sensitive'] = [
#                             {'antibiotic': row[0], 'sensitivetype': row[1], 'Organism': row[2]}
#                             for row in sensitivetype
#                         ]
#                         test_data['Display_Text'] = test_info_dict[test_code]['Display_Text']

#                     else:
#                         cursor.execute("""
#                             SELECT td.Method_Name, td.Test_Name, td.UOM, ap.Capture_Value, td.Sub_Department, 
#                             td.Specimen_Name, ap.Panic_Low, ap.Panic_High, td.Test_Code,
#                             td.IsSubTest, td.SubTestCodes
#                             FROM Test_Descriptions td
#                             LEFT JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                             WHERE td.Test_Code = %s
#                         """, [visit_id, patient_id, test_code])
#                         test_details = cursor.fetchall()

#                         for detail in test_details:
#                             test_info = {
#                                 'Method_Name': detail[0],
#                                 'Test_Name': detail[1],
#                                 'UOM': detail[2],
#                                 'CaptureValue': detail[3],
#                                 'Department': detail[4],
#                                 'Sepcimen': detail[5],
#                                 'Paniclow': detail[6],
#                                 'Panichigh': detail[7],
#                                 'Test_Code': detail[8],
#                                 'IsSubTest': detail[9],
#                                 'SubTestCodes': detail[10]
#                             }
#                             test_info_dict[test_code] = test_info

#                         cursor.execute("""
#                             SELECT From_Value, To_Value, Gender, PanicLow, PanicHigh, TestName, Test_Code, 
#                             FromAge, Toage, FromAgeType, ToAgeType, NormalValue, Reference_Range
#                             FROM Age_Setup_Master 
#                             WHERE Test_Code = %s 
#                             AND (Gender = %s OR Gender = 'Both') 
#                             AND (
#                                 (%s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                 AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END 
#                                 AND FromAgeType = %s AND ToAgeType = %s)
#                                 OR
#                                 (FromAgeType = 'day' AND ToAgeType = 'year' 
#                                 AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                 AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                                 OR
#                                 (FromAgeType = 'month' AND ToAgeType = 'year' 
#                                 AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                 AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                             )
#                         """, (test_code, gender, age, age, age_type, age_type, age, age, age, age))
#                         reference_details = cursor.fetchall()

#                         for reference in reference_details:
#                             test_data['ReferenceRange'].append({
#                                 'From_Value': reference[0],
#                                 'To_Value': reference[1],
#                                 'Gender': reference[2],
#                                 'PanicLow': reference[3],
#                                 'PanicHigh': reference[4],
#                                 'TestName': reference[5],
#                                 'Test_Code': reference[6],
#                                 'NormalValue': reference[11],
#                                 'Reference_Range': reference[12]
#                             })

#                         cursor.execute("""
#                             SELECT Header_interpretation, Comments 
#                             FROM Testmaster_Interpretation_table 
#                             WHERE Test_Code = %s
#                         """, [test_code])
#                         interpretations = cursor.fetchall()
#                         if interpretations:
#                             test_data['Interpretations'] = {
#                                 'Head': interpretations[0][0],
#                                 'Detail': interpretations[0][1]
#                             }
#                         test_data['Culturetest'] = culturetest

#                     # Process subtests for Individual
#                     parent_to_subtests = {}
#                     for test_code, test_info in test_info_dict.items():
#                         if test_info['IsSubTest'] == "Yes" and test_info['SubTestCodes']:
#                             subtest_codes = test_info['SubTestCodes'].split(',') if test_info['SubTestCodes'] else []
#                             parent_to_subtests[test_code] = subtest_codes

#                     for test_code, test_info in test_info_dict.items():
#                         subtest_of_another = any(test_code in subtests for subtests in parent_to_subtests.values())
#                         if not subtest_of_another or test_code in parent_to_subtests:
#                             if test_code in parent_to_subtests:
#                                 test_info['Subtests'] = [
#                                     test_info_dict[sub_code] for sub_code in parent_to_subtests[test_code]
#                                     if sub_code in test_info_dict
#                                 ]
#                             test_data["Tests"].append(test_info)

#                     cursor.execute("""
#                         SELECT 'AnalyseInvestigationResult' AS Source, MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationResult 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'AnalyseInvestigationSenior', MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationSenior 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'Approve_Test_Pathologist', MAX(UpdatedAt) 
#                         FROM Approve_Test_Pathologist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                     """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
#                     updates = cursor.fetchall()

#                     for source, updated_at in updates:
#                         if updated_at and (updated_at_data_individual[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_individual[source]):
#                             updated_at_data_individual[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#                     test_data['Updated_At'] = updated_at_data_individual
#                     result.append(test_data)

#         return JsonResponse(result, safe=False)

#     except Exception as e:
#         print('error:', e)
#         return JsonResponse({"Error": str(e)}, status=500)

#     finally:
#         if 'cursor' in locals():
#             cursor.close()
#         if 'db' in locals():
#             db.close()




    
# from django.http import JsonResponse
# from django.db import connection

# def get_report_data_by_dispatch(request):
#     if request.method != 'GET':
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=400)

#     invoice = request.GET.get('Billing_Invoice')
#     age = request.GET.get('age')
#     gender = request.GET.get('gender')
#     age_type = request.GET.get('timeperiod')
#     location = request.GET.get('Location')  # No default 'ALL'

#     if not invoice:
#         return JsonResponse({"error": "Billing_Invoice parameter is required"}, status=400)
#     if not location:
#         return JsonResponse({"error": "Location parameter is required"}, status=400)

#     try:
#         
#         cursor = db.cursor()

#         # Base query with location-specific filtering
#         where_clause = """
#             WHERE Billing_Invoice = %s 
#             AND Service_Status = 'Completed' 
#             AND Approve_Status = 'Completed'
#             AND (
#                 (Location = %s)
#                 OR (Transfer_Location = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != '')
#             )
#         """
#         params = [invoice, location, location]

#         cursor.execute(f"""
#             SELECT DISTINCT Group_Name, Visit_Id, Patient_Id, Test_Method, Group_Code
#             FROM Billing_Item_Table_for_lab
#             {where_clause}
#         """, params)
        
#         items = cursor.fetchall()
#         print('items:', items)

#         if not items:
#             return JsonResponse({"error": "No data found for provided Billing_Invoice and Location"}, status=404)

#         result = []
#         for group_name, visit_id, patient_id, test_method, Group_Code in items:
#             if test_method == 'Group':
#                 print('Group_Code:', Group_Code)
#                 cursor.execute("""
#                     SELECT DISTINCT Test_Name, Test_Code
#                     FROM GroupMasterTestList 
#                     WHERE group_code = %s
#                 """, [Group_Code])
#                 test_names = cursor.fetchall()
#                 print('test_names:', test_names)
#                 cursor.execute("""
#                     SELECT department_name FROM GroupMaster WHERE group_code = %s
#                 """, [Group_Code])
#                 Department = cursor.fetchone()[0] if cursor.fetchone() else None

#                 group_data = {
#                     "Method": test_method,
#                     'Group_Name': group_name,
#                     'Tests': [],
#                     'ReferenceRange': [],
#                     'Updated_At': {},
#                     'Department': Department,
#                     'Group_Code': Group_Code
#                 }
#                 updated_at_data_group = {
#                     'AnalyseInvestigationResult': "N/A",
#                     'AnalyseInvestigationSenior': "N/A",
#                     'Approve_Test_Pathologist': "N/A"
#                 }

#                 for test_name_tuple in test_names:
#                     test_name = test_name_tuple[0]
#                     Test_Code = test_name_tuple[1]
#                     cursor.execute("""
#                         SELECT td.Method_Name, td.Test_Name, td.UOM, 
#                         ap.Capture_Value, td.Specimen_Name, ti.Header_interpretation, ti.Comments, 
#                         ap.Panic_Low, ap.Panic_High, td.Test_Code, td.Display_Text
#                         FROM Test_Descriptions td
#                         LEFT JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                         LEFT JOIN Testmaster_Interpretation_table ti ON ti.Test_Code = td.Test_Code
#                         WHERE td.Test_Code = %s
#                     """, [visit_id, patient_id, Test_Code])
#                     test_details = cursor.fetchall()

#                     for detail in test_details:
#                         test_info = {
#                             'Method_Name': detail[0],
#                             'Test_Name': detail[1],
#                             'UOM': detail[2],
#                             'CaptureValue': detail[3],
#                             'Sepcimen': detail[4],
#                             'Head': detail[5],
#                             'Detail': detail[6],
#                             'Paniclow': detail[7],
#                             'Panichigh': detail[8],
#                             'Test_Code': detail[9],
#                             'Display_Text': detail[10],
#                         }
#                         group_data['Tests'].append(test_info)

#                     cursor.execute("""
#                         SELECT From_Value, To_Value, Gender, PanicLow, PanicHigh, TestName, Test_Code, 
#                         FromAge, Toage, FromAgeType, ToAgeType, NormalValue, Reference_Range
#                         FROM Age_Setup_Master 
#                         WHERE Test_Code = %s 
#                         AND (Gender = %s OR Gender = 'Both') 
#                         AND (
#                             (%s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END 
#                             AND FromAgeType = %s AND ToAgeType = %s)
#                             OR
#                             (FromAgeType = 'day' AND ToAgeType = 'year' 
#                             AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                             OR
#                             (FromAgeType = 'month' AND ToAgeType = 'year' 
#                             AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                             AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                         )
#                     """, (Test_Code, gender, age, age, age_type, age_type, age, age, age, age))
#                     reference_details = cursor.fetchall()
#                     print('reference_details:', reference_details)

#                     for reference in reference_details:
#                         group_data['ReferenceRange'].append({
#                             'From_Value': reference[0],
#                             'To_Value': reference[1],
#                             'Gender': reference[2],
#                             'PanicLow': reference[3],
#                             'PanicHigh': reference[4],
#                             'TestName': reference[5],
#                             'Test_Code': reference[6],
#                             'NormalValue': reference[11],
#                             'Reference_Range': reference[12]
#                         })

#                     cursor.execute("""
#                         SELECT 'AnalyseInvestigationResult' AS Source, MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationResult 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'AnalyseInvestigationSenior', MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationSenior 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'Approve_Test_Pathologist', MAX(UpdatedAt) 
#                         FROM Approve_Test_Pathologist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                     """, [Test_Code, patient_id, invoice, Test_Code, patient_id, invoice, Test_Code, patient_id, invoice])
#                     updates = cursor.fetchall()

#                     for source, updated_at in updates:
#                         if updated_at and (updated_at_data_group[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_group[source]):
#                             updated_at_data_group[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#                 group_data['Updated_At'] = updated_at_data_group
#                 result.append(group_data)

#             else:  # Individual tests
#                 cursor.execute(f"""
#                     SELECT DISTINCT Test_Name, Test_Code, IsSubTest, SubTestCodes, Transfer_Location
#                     FROM Billing_Item_Table_for_lab
#                     {where_clause} AND Test_Method = 'Individual'
#                 """, params)
#                 test_names = cursor.fetchall()
#                 print('test_names:', test_names)

#                 for test_name_tuple in test_names:
#                     test_name = test_name_tuple[0]
#                     Test_Code = test_name_tuple[1]
#                     IsSubTest = test_name_tuple[2]
#                     SubTestCodes = test_name_tuple[3]
#                     transfer_location = test_name_tuple[4]

#                     updated_at_data_group = {
#                         'AnalyseInvestigationResult': "N/A",
#                         'AnalyseInvestigationSenior': "N/A",
#                         'Approve_Test_Pathologist': "N/A",
#                     }

#                     # Fetch Culturetest safely
#                     cursor.execute("SELECT Culturetest FROM Test_Descriptions WHERE Test_Code = %s", (Test_Code,))
#                     culturetest_result = cursor.fetchone()
#                     culturetest = culturetest_result[0] if culturetest_result else 'No'
#                     print('culturetest:', culturetest)

#                     # Fetch Autocheck safely
#                     cursor.execute("SELECT Autocheck FROM Test_Descriptions WHERE Test_Code = %s", (Test_Code,))
#                     autocheck_result = cursor.fetchone()
#                     autocheck = autocheck_result[0] if autocheck_result else 'No'
#                     print('autocheck:', autocheck)

#                     if autocheck == 'Yes':
#                         cursor.execute("SELECT Sub_Department FROM Test_Descriptions WHERE Test_Code = %s", (Test_Code,))
#                         Department = cursor.fetchone()[0] if cursor.fetchone() else None
#                         test_data = {
#                             "Method": test_method,
#                             'Group_Name': test_name,
#                             'Tests': [],
#                             'Values': [],
#                             'Times': [],
#                             'Culturetest': culturetest,
#                             'Updated_At': updated_at_data_group,
#                             'Department': Department
#                         }

#                         cursor.execute("""
#                             SELECT Method_Name, Test_Name, Specimen_Name, UOM, Parameter_One, Parameter_Two, Test_Code
#                             FROM Test_Descriptions 
#                             WHERE Test_Code = %s
#                         """, [Test_Code])
#                         test_details = cursor.fetchall()

#                         for row in test_details:
#                             test_data['Tests'].append({
#                                 'Method_Name': row[0],
#                                 'Test_Name': row[1],
#                                 'Sepcimen': row[2],
#                                 'UOM': row[3],
#                                 'Parameter_One': row[4],
#                                 'Parameter_Two': row[5],
#                                 'Test_Code': row[6]
#                             })

#                             if row[4] and row[5]:
#                                 parameter_one = int(row[4]) if row[4] else 0
#                                 parameter_two = int(row[5]) if row[5] else 0
#                                 for i in range(1, parameter_one + 1):
#                                     test_data['Times'].append(i * parameter_two)

#                         cursor.execute("""
#                             SELECT DISTINCT Capture_Value 
#                             FROM Approve_Test_Pathologist 
#                             WHERE Billing_invoice = %s AND Test_Code = %s AND Visit_Id = %s
#                         """, (invoice, Test_Code, visit_id))
#                         values = cursor.fetchall()
#                         test_data['Values'].extend([value[0] for value in values])

#                     elif culturetest == 'Yes':
#                         cursor.execute("SELECT Sub_Department, Display_Text FROM Test_Descriptions WHERE Test_Code = %s", (Test_Code,))
#                         Department_result = cursor.fetchone()
#                         Department = Department_result[0] if Department_result else None
#                         Display_Text = Department_result[1] if Department_result and len(Department_result) > 1 else None
#                         test_data = {
#                             "Method": test_method,
#                             'Group_Name': test_name,
#                             'Tests': [],
#                             'Sensitive': [],
#                             'Culturetest': culturetest,
#                             'Updated_At': updated_at_data_group,
#                             'Department': Department,
#                             'Display_Text': Display_Text
#                         }

#                         cursor.execute("""
#                             SELECT td.Method_Name, td.Test_Name, ap.Colony_Count, ap.Capture_Organism, ap.Sample_Specimen, 
#                             td.UOM, ap.Notes, ap.Microscopy_Data, ap.Culture_Report, ap.Report_Type, td.Test_Code, 
#                             ap.Report_Status, td.Display_Text, ap.micronumber, ap.Bacteria_Isolated
#                             FROM Test_Descriptions td
#                             JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                             WHERE td.Test_Code = %s
#                         """, [visit_id, patient_id, Test_Code])
#                         test_details = cursor.fetchall()

#                         for row in test_details:
#                             test_data['Tests'].append({
#                                 'Method_Name': row[0],
#                                 'Test_Name': row[1],
#                                 'Colony_Count': row[2],
#                                 'Capture_Organism': row[3],
#                                 'Sepcimen': row[4],
#                                 'UOM': row[5],
#                                 'Notes': row[6],
#                                 'Microscopy_Data': row[7],
#                                 'Culture_Report': row[8],
#                                 'Report_Type': row[9],
#                                 'Test_Code': row[10],
#                                 'Report_Status': row[11],
#                                 'Display_Text': row[12],
#                                 'micronumber': row[13],
#                                 'Bacteria_Isolated': row[14]
#                             })

#                         cursor.execute("""
#                             SELECT DISTINCT Antibiotic_Name, Sensitive_Type, Captured_Oraganism
#                             FROM Complete_Culture_Examination 
#                             WHERE Billing_Invoice = %s AND Visit_Id = %s AND Test_Code = %s
#                             ORDER BY 
#                                 CASE 
#                                     WHEN Sensitive_Type = 'Sensitive' THEN 1
#                                     WHEN Sensitive_Type = 'Intermediate' THEN 2
#                                     WHEN Sensitive_Type = 'Resistant' THEN 3
#                                 END,
#                                 Antibiotic_Name ASC
#                         """, (invoice, visit_id, Test_Code))
#                         sensitivetype = cursor.fetchall()

#                         for row in sensitivetype:
#                             test_data['Sensitive'].append({
#                                 'antibiotic': row[0],
#                                 'sensitivetype': row[1],
#                                 'Organism': row[2]
#                             })

#                     else:
#                         cursor.execute("SELECT Sub_Department FROM Test_Descriptions WHERE Test_Code = %s", (Test_Code,))
#                         Department_result = cursor.fetchone()
#                         Department = Department_result[0] if Department_result else None
#                         test_data = {
#                             "Method": test_method,
#                             'Group_Name': test_name,
#                             'Tests': [],
#                             'ReferenceRange': [],
#                             'Interpretations': {},
#                             'Updated_At': updated_at_data_group,
#                             'Culturetest': culturetest,
#                             'Department': Department
#                         }

#                         cursor.execute("""
#                             SELECT td.Method_Name, td.Test_Name, td.UOM, ap.Capture_Value, td.Sub_Department, 
#                             td.Specimen_Name, ap.Panic_Low, ap.Panic_High, td.Test_Code
#                             FROM Test_Descriptions td
#                             LEFT JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                             WHERE td.Test_Code = %s
#                         """, [visit_id, patient_id, Test_Code])
#                         test_details = cursor.fetchall()

#                         cursor.execute("""
#                             SELECT From_Value, To_Value, Gender, PanicLow, PanicHigh, TestName, Test_Code, 
#                             FromAge, Toage, FromAgeType, ToAgeType, NormalValue, Reference_Range
#                             FROM Age_Setup_Master 
#                             WHERE Test_Code = %s 
#                             AND (Gender = %s OR Gender = 'Both') 
#                             AND (
#                                 (%s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                 AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END 
#                                 AND FromAgeType = %s AND ToAgeType = %s)
#                                 OR
#                                 (FromAgeType = 'day' AND ToAgeType = 'year' 
#                                 AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                 AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                                 OR
#                                 (FromAgeType = 'month' AND ToAgeType = 'year' 
#                                 AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                 AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                             )
#                         """, (Test_Code, gender, age, age, age_type, age_type, age, age, age, age))
#                         reference_details = cursor.fetchall()

#                         for reference in reference_details:
#                             test_data['ReferenceRange'].append({
#                                 'From_Value': reference[0],
#                                 'To_Value': reference[1],
#                                 'Gender': reference[2],
#                                 'PanicLow': reference[3],
#                                 'PanicHigh': reference[4],
#                                 'TestName': reference[5],
#                                 'Test_Code': reference[6],
#                                 'NormalValue': reference[11],
#                                 'Reference_Range': reference[12]
#                             })

#                         for detail in test_details:
#                             test_data['Tests'].append({
#                                 'Method_Name': detail[0],
#                                 'Test_Name': detail[1],
#                                 'UOM': detail[2],
#                                 'CaptureValue': detail[3],
#                                 'Department': detail[4],
#                                 'Sepcimen': detail[5],
#                                 'Paniclow': detail[6],
#                                 'Panichigh': detail[7],
#                                 'Test_Code': detail[8]
#                             })

#                         cursor.execute("""
#                             SELECT Header_interpretation, Comments 
#                             FROM Testmaster_Interpretation_table 
#                             WHERE Test_Code = %s
#                         """, [Test_Code])
#                         interpretations = cursor.fetchall()
#                         for interpretation in interpretations:
#                             test_data['Interpretations'] = {
#                                 'Head': interpretation[0],
#                                 'Detail': interpretation[1]
#                             }

#                     cursor.execute("""
#                         SELECT 'AnalyseInvestigationResult' AS Source, MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationResult 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'AnalyseInvestigationSenior', MAX(UpdatedAt) 
#                         FROM AnalyseInvestigationSenior 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'Approve_Test_Pathologist', MAX(UpdatedAt) 
#                         FROM Approve_Test_Pathologist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                     """, [Test_Code, patient_id, invoice, Test_Code, patient_id, invoice, Test_Code, patient_id, invoice])
#                     updates = cursor.fetchall()

#                     for source, updated_at in updates:
#                         if updated_at and (updated_at_data_group[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_group[source]):
#                             updated_at_data_group[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#                     test_data['Updated_At'] = updated_at_data_group
#                     result.append(test_data)

#                     if IsSubTest == "Yes" and SubTestCodes:
#                         sub_test_code_list = SubTestCodes.split(",")
#                         for sub_test_code in sub_test_code_list:
#                             cursor.execute("SELECT Culturetest FROM Test_Descriptions WHERE Test_Code = %s", (sub_test_code,))
#                             culturetest_result = cursor.fetchone()
#                             culturetest = culturetest_result[0] if culturetest_result else 'No'
#                             cursor.execute("SELECT Sub_Department FROM Test_Descriptions WHERE Test_Code = %s", (sub_test_code,))
#                             Department_result = cursor.fetchone()
#                             Department = Department_result[0] if Department_result else None

#                             cursor.execute("""
#                                 SELECT td.Method_Name, td.Test_Name, td.UOM, ap.Capture_Value, td.Sub_Department, 
#                                 td.Specimen_Name, ap.Panic_Low, ap.Panic_High, td.Test_Code
#                                 FROM Test_Descriptions td
#                                 LEFT JOIN Approve_Test_Pathologist ap ON ap.Test_Code = td.Test_Code AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                                 WHERE td.Test_Code = %s
#                             """, [visit_id, patient_id, sub_test_code])
#                             test_details = cursor.fetchall()

#                             cursor.execute("""
#                                 SELECT From_Value, To_Value, Gender, PanicLow, PanicHigh, TestName, Test_Code, 
#                                 FromAge, Toage, FromAgeType, ToAgeType, NormalValue, Reference_Range
#                                 FROM Age_Setup_Master 
#                                 WHERE Test_Code = %s 
#                                 AND (Gender = %s OR Gender = 'Both') 
#                                 AND (
#                                     (%s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                     AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END 
#                                     AND FromAgeType = %s AND ToAgeType = %s)
#                                     OR
#                                     (FromAgeType = 'day' AND ToAgeType = 'year' 
#                                     AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                     AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                                     OR
#                                     (FromAgeType = 'month' AND ToAgeType = 'year' 
#                                     AND %s >= CASE WHEN FromAge = '' THEN 0 ELSE CAST(FromAge AS SIGNED) END 
#                                     AND %s <= CASE WHEN Toage = '' THEN 0 ELSE CAST(Toage AS SIGNED) END)
#                                 )
#                             """, (sub_test_code, gender, age, age, age_type, age_type, age, age, age, age))
#                             reference_details = cursor.fetchall()

#                             sub_test_data = {
#                                 "Method": test_method,
#                                 'Group_Name': test_name,
#                                 'Tests': [],
#                                 'ReferenceRange': [],
#                                 'Interpretations': {},
#                                 'Updated_At': updated_at_data_group.copy(),
#                                 'Culturetest': culturetest,
#                                 'Department': Department
#                             }

#                             for reference in reference_details:
#                                 sub_test_data['ReferenceRange'].append({
#                                     'From_Value': reference[0],
#                                     'To_Value': reference[1],
#                                     'Gender': reference[2],
#                                     'PanicLow': reference[3],
#                                     'PanicHigh': reference[4],
#                                     'TestName': reference[5],
#                                     'Test_Code': reference[6],
#                                     'NormalValue': reference[11],
#                                     'Reference_Range': reference[12]
#                                 })

#                             for detail in test_details:
#                                 sub_test_data['Tests'].append({
#                                     'Method_Name': detail[0],
#                                     'Test_Name': detail[1],
#                                     'UOM': detail[2],
#                                     'CaptureValue': detail[3],
#                                     'Department': detail[4],
#                                     'Sepcimen': detail[5],
#                                     'Paniclow': detail[6],
#                                     'Panichigh': detail[7],
#                                     'Test_Code': detail[8]
#                                 })

#                             cursor.execute("""
#                                 SELECT Header_interpretation, Comments 
#                                 FROM Testmaster_Interpretation_table 
#                                 WHERE Test_Code = %s
#                             """, [sub_test_code])
#                             interpretations = cursor.fetchall()
#                             for interpretation in interpretations:
#                                 sub_test_data['Interpretations'] = {
#                                     'Head': interpretation[0],
#                                     'Detail': interpretation[1]
#                                 }

#                             result.append(sub_test_data)

#         return JsonResponse(result, safe=False)

#     except Exception as e:
#         print('error:', e)
#         return JsonResponse({"Error": str(e)}, status=500)

#     finally:
#         if 'cursor' in locals():
#             cursor.close()
#         if 'db' in locals():
#             db.close()




#------------------------------------------ For reflex test -----------------------------------------------

@csrf_exempt
def insert_for_reflex(request):
    if request.method != "POST":
        return JsonResponse({"Error": "This endpoint only accepts POST requests."})

    try:
        # Assuming get_db_connection() is a function that returns a database connection
        
        cursor = db.cursor()

        data = json.loads(request.body)
        print( "Payload",data)

        if not isinstance(data, list):
            return JsonResponse({"Error": "Payload must be a list."})

        for record in data:
            billing_invoice = record.get('Billing_Invoice')
            Test_Code = record.get('Test_Code')
            

            if not billing_invoice or not Test_Code:
                # Skipping records with missing required fields
                continue

            cursor.execute("""
                UPDATE AnalyseInvestigationSenior
                SET Status = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, ["Reverify",billing_invoice, Test_Code])





            # Update Analysis_Status in Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab
                SET Verify_Status = 'Reverify', UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [datetime.now(), billing_invoice, Test_Code])

            # Assuming you want to update the status in Billing_invoice_and_bill_amount as well
            

        db.commit()  # Make sure to commit changes

        return JsonResponse({"message": "Records updated successfully."}, status=200)
    except Exception as er:
        # Rollback in case of any exception
        db.rollback()
        return JsonResponse({"Error": str(er)})
    finally:
        # Make sure to close both cursor and db connection
        cursor.close()
        db.close()


#------------------------- INSERT into culture report -------------------------------------------------------
@csrf_exempt
def insert_into_culture_report(request):
    if request.method == 'POST':
        try:
            
            cursor = db.cursor()
            data = json.loads(request.body)

            Billing_Invoice = data.get('Billing_Invoice')
            visit_id = data.get('visitid')
            Createdby = data.get('CreatedBy')
            location = data.get('Location')
            Patient_id = data.get('patient_Id')
            patient_name = data.get('Patient_name')
            refering_doc = data.get('refering_doc')
            capture_organism = data.get('captureOrganism', [])  # Expecting a list of organisms
            antibiotic_data = data.get('antibiotic', {})
            antibiotic_value = data.get('antibioticValue',{})
            colonyCount = data.get('Colonycount')

            print('antibiotic_data',antibiotic_data)

            # Handle antibiotic data separately
            for antibiotic_name, antibiotic_info in antibiotic_data.items():
                level = antibiotic_info.get("level")
                uservalue = antibiotic_info.get("uservalue")
                sensitiverange = antibiotic_info.get("sensitiverange")
                intermediaterange = antibiotic_info.get("intermediaterange")
                resistantrange = antibiotic_info.get("resistantrange")
                cursor.execute("SELECT MAX(Culture_Id) FROM Complete_Culture_Examination")
                max_id = cursor.fetchone()[0]
                next_id = str(max_id + 1) if max_id is not None else '1'

                for organism_detail in capture_organism:
                    test_code = organism_detail.get('testcode')
                    organism_name = organism_detail.get('organism_name')
                    
                
                    print("-----------------------",colonyCount)
                    try:
                        insert_query_antibiotic = """
                            INSERT INTO Complete_Culture_Examination 
                            (Culture_Id, Billing_Invoice, Patient_Id, Patient_Name, Visit_Id, Refering_Doctor, 
                            Antibiotic_Name,Sensitive_Type,CreatedBy,Captured_Oraganism,Location, 
                            Test_Code, UpdatedAt, CreatedAt, Antibiotic_Value, ColonyCount,
                            sensitiverange,intermediaterange,resistantrange)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s)
                        """
                        cursor.execute(insert_query_antibiotic, (next_id, Billing_Invoice, Patient_id, 
                                                                 patient_name, visit_id, refering_doc, antibiotic_name, level, 
                                                                 Createdby,organism_name, location, test_code, datetime.now(), datetime.now(),
                                                                 uservalue, colonyCount,sensitiverange,intermediaterange,resistantrange))
                        print("-----------Data-Loaded------------")        
                        db.commit()
                    except Exception as err:
                        print(str(err))

            return JsonResponse({"success": True})  # Return a success response

        except Exception as e:
            return JsonResponse({"error": str(e)})  # Return an error response

        finally:
            cursor.close()
            db.close() 

    return JsonResponse({"error": "Method not allowed"})




#--------------------------------------sensitive type get -------------------------

def get_for_culture_report_completion(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()
            invoice = request.GET.get('Billinginvoice')
            visitid = request.GET.get('Visitid')
            testcode = request.GET.get('testcode')
            status = 'Completed'
            datasend = []

            # ─────────────────────────────────────────────────────────────────────
            # OPTIMISED get_for_culture_report_completion
            # FIX: Removed N+1 — was doing 1 Culturetest query per test name.
            # Now: single JOIN query to get only culture tests directly.
            # Then one query for the actual antibiotic data.
            # Before: 1 + N queries.  After: 2 queries total.
            # ─────────────────────────────────────────────────────────────────────
            cursor.execute("""
                SELECT bit.Test_Name, bit.Test_Code
                FROM Billing_Item_Table_for_lab bit
                JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
                WHERE bit.Billing_Invoice = %s
                  AND bit.Service_Status = %s
                  AND bit.Analysis_Status = 'Completed'
                  AND td.Culturetest = 'Yes'
            """, (invoice, status))
            culture_tests = cursor.fetchall()

            if culture_tests:
                cursor.execute("""
                    SELECT Culture_Id, Antibiotic_Name, Sensitive_Type, Captured_Oraganism,
                           Test_Code, Antibiotic_Value, ColonyCount,
                           intermediaterange, resistantrange, sensitiverange
                    FROM Complete_Culture_Examination
                    WHERE Billing_Invoice = %s AND Visit_Id = %s AND Test_Code = %s
                """, (invoice, visitid, testcode))
                for row in cursor.fetchall():
                    datasend.append({
                        'Culture_Id': row[0], 'antibiotic': row[1],
                        'Sensitivetype': row[2], 'Oraganism': row[3],
                        'testcode': row[4], 'Antibiotic_Value': row[5],
                        'ColonyCount': row[6], 'intermediaterange': row[7],
                        'resistantrange': row[8], 'sensitiverange': row[9],
                    })

            return JsonResponse(datasend, safe=False)

        except Exception as e:
            return JsonResponse({'Error': str(e)})

        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()


#---------------------------------- preview for histopathology examinations  -- - - - - - - - - - - - - - - - - -- - - 

def get_for_preview_examinations(request):
    try:
        
        cursor = db.cursor()

        visit_id = request.GET.get('Visitid')
        patient_id = request.GET.get('patientid')
        invoice = request.GET.get('Billinginvoice')
        result = []

        # ─────────────────────────────────────────────────────────────────────────
        # OPTIMISED get_for_preview_examinations
        # FIX: Was running 3 queries per test (dept lookup + test details + timestamps).
        # Now: 1 query for all test+dept info, 1 for all AIR details, 1 for all timestamps.
        # Before: 1 + (3 × N) queries.  After: 4 queries total.
        # ─────────────────────────────────────────────────────────────────────────

        # Query 1: get all distinct tests with dept in one shot
        cursor.execute("""
            SELECT DISTINCT bit.Test_Name, bit.Test_Code, td.Sub_Department_id
            FROM Billing_Item_Table_for_lab bit
            LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
            WHERE bit.Billing_Invoice = %s AND bit.Bill_Status != 'Canceled'
        """, [invoice])
        test_rows = cursor.fetchall()

        if test_rows:
            all_codes = [r[1] for r in test_rows]
            codes_tuple = tuple(all_codes)

            # Query 2: all test details across all codes in ONE query
            cursor.execute("""
                SELECT td.Method_Name_id, td.Test_Name, ap.EditContent,
                       td.Sub_Department_id, td.Specimen_Name_id, ap.Sample_Picture,
                       td.Test_Code
                FROM Test_Descriptions AS td
                INNER JOIN AnalyseInvestigationResult AS ap ON ap.Test_Code = td.Test_Code
                WHERE td.Test_Code IN %s AND ap.Visit_Id = %s AND ap.Patient_Id = %s
            """, [codes_tuple, visit_id, patient_id])
            # Group details by Test_Code
            details_by_code = {}
            for d in cursor.fetchall():
                details_by_code.setdefault(d[6], []).append(d)

            # Query 3: all timestamps across all codes in ONE query
            cursor.execute("""
                SELECT Source, Test_Code, MAX(CreatedAt)
                FROM (
                    SELECT 'Sample_Capture_in_Phelobotomist' AS Source, Test_Code, CreatedAt
                    FROM Sample_Capture_in_Phelobotomist
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                    UNION ALL
                    SELECT 'AnalyseInvestigationSenior', Test_Code, CreatedAt
                    FROM AnalyseInvestigationSenior
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                    UNION ALL
                    SELECT 'Approve_Test_Pathologist', Test_Code, CreatedAt
                    FROM Approve_Test_Pathologist
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                ) AS SubQuery
                GROUP BY Source, Test_Code
            """, [codes_tuple, patient_id, invoice,
                  codes_tuple, patient_id, invoice,
                  codes_tuple, patient_id, invoice])
            # Group timestamps by (Test_Code, Source)
            timestamps_by_code = {}
            for source, t_code, created_at in cursor.fetchall():
                timestamps_by_code.setdefault(t_code, {})[source] = (
                    created_at.strftime("%Y-%m-%d %H:%M:%S") if created_at else "N/A"
                )

            # Assemble result using dict lookups — O(1) per test, zero extra queries
            for test_name, Test_Code, dept in test_rows:
                test_data = {
                    'Group_Name': test_name,
                    'Department': dept,
                    'Tests': [],
                    'Updated_At': {
                        'Sample_Capture_in_Phelobotomist': 'N/A',
                        'AnalyseInvestigationSenior': 'N/A',
                        'Approve_Test_Pathologist': 'N/A',
                    }
                }
                ts = timestamps_by_code.get(Test_Code, {})
                test_data['Updated_At'].update(ts)

                for detail in details_by_code.get(Test_Code, []):
                    photo_data = detail[5]
                    sample = base64.b64encode(photo_data).decode("utf-8") if photo_data else None
                    test_data['Tests'].append({
                        'Method_Name': detail[0], 'Test_Name': detail[1],
                        'EditContent': detail[2], 'Department': detail[3],
                        'Specimen': detail[4], 'Samplepic': sample,
                        'Test_Code': detail[6],
                    })
                result.append(test_data)

        return JsonResponse(result, safe=False)

    except Exception as e:
        print(e)
        return JsonResponse({"Error": str(e)})
    finally:
        cursor.close()
        db.close()



#-----------------------------------  insert_reort_table ----------------------------------------


@csrf_exempt

def insert_reort_table(request):

    if request.method == "POST":

        try:

            

            cursor = db.cursor()
 
            print(request.FILES)

            print(request.POST)
 
            patientbarcode = request.POST.get("patinetbillingbarcode")

            Visit_Id = request.POST.get("Visit_Id")

            refering_doc = request.POST.get("refering_doc")

            invoice = request.POST.get("invoice")

            samplecode = request.POST.get("samplecode")

            patientname = request.POST.get("patientname")

            patient_Id = request.POST.get("patient_Id")

            createdby = request.POST.get("createdby")

            location = request.POST.get("location")

            reportstatus = "Dispatched"

            image_file = request.FILES.get("report")

            reprintreason = request.POST.get("cancelReason")

 
            cursor.execute(

                "SELECT MAX(Dispatched_Id) FROM Completed_Lab_Report_Table WHERE Billing_Invoice = %s",

                (invoice,),

            )

            max_id = cursor.fetchone()[0]
            print('max_id :',max_id)
            nextid = int(max_id) + 1 if max_id is not None else 1
            print('nextid :',nextid)
            cursor.execute("SELECT MAX(Report_Id) FROM Completed_Lab_Report_Table")

            max_id1 = cursor.fetchone()[0]
            print('max_id1 :',max_id1)

            nextid1 = int(max_id1) + 1 if max_id1 is not None else 1

            if image_file:

                PatientPhoto_con = image_file.read()

                PatientPhoto_con_base64 = base64.b64encode(PatientPhoto_con).decode("utf-8")
            
            
            else:

                PatientPhoto_con_base64 = None
 
            insert_query = """

                INSERT INTO Completed_Lab_Report_Table 

                (Report_Id, Dispatched_Id, Billing_Invoice, Patient_Id, Patient_Name, Visit_Id, Refering_Doctor, ReportSatus, Patient_Barcode, Sample_Barcode, Location, CreatedBy, Reprint_Reason,Report) 

                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)

            """

            cursor.execute(

                insert_query,

                (

                    nextid1,

                    nextid,

                    invoice,

                    patient_Id,

                    patientname,

                    Visit_Id,

                    refering_doc,

                    reportstatus,

                    patientbarcode,

                    samplecode,

                    location,

                    createdby,

                    reprintreason,

                    PatientPhoto_con_base64,

                ),

            )
 
            db.commit()
 
            return JsonResponse({"message": "insert successfully"})
 
        except Exception as e:

            print("error", str(e))

            return JsonResponse({"Error": str(e)})

        finally:

            cursor.close()

            db.close()

    else:

        return JsonResponse({"Error": "Invalid request method"})
 
    
    
@csrf_exempt
def sendEmail(request):
    try:
        
        
        cursor = db.cursor()
        
        patientname = request.POST.get('patientname')
        image_file = request.FILES.get('report')
        Patient_Id = request.POST.get('Patient_Id')
        
        
        check = """SELECT Email FROM Register_patient_Details WHERE Patient_Id=%s"""
        cursor.execute(check,(Patient_Id,))
        pemail = cursor.fetchone()[0]
        print('pemail :',pemail)
        
        if pemail is not None and pemail != '':
            
            accountsettings = """SELECT Clinic_Name FROM usercontrol_accountsetting WHERE accountsetting_id=1"""
            cursor.execute(accountsettings)
            clinic_name = cursor.fetchone()


            clinic_name = clinic_name[0] if clinic_name is not None else ''
            print('clinic_name :',clinic_name)
            
            clinicdetailsquery = """SELECT * FROM usercontrol_clinicinformation WHERE concern_id=1"""
            cursor.execute(clinicdetailsquery)
            clinic_details = cursor.fetchone()

            print('clinic_details :',clinic_details)
            if clinic_details:
                email = clinic_details[2]
                phoneno = clinic_details[3]
                landlineno = clinic_details[4]
                doorno = clinic_details[5]
                street = clinic_details[6]
                area = clinic_details[7]
                city = clinic_details[8]
                pincode = clinic_details[9]
                state = clinic_details[10]
                country = clinic_details[11]

                clinic_address = f"""   
                {doorno},{street},{area},{city},\n 
                {state}-{pincode},\n
                {country}"""
            else:
                clinic_address = "Clinic address not available"

            image_file.seek(0)

            # Email configuration
            sender_email = 'rudraashdiagnostics@gmail.com'
            sender_password = 'vehk bacg uffm rfkw'
            
            #sender_email = 'tamilrs2001@gmail.com'
            #sender_password = 'nbxh alis gbak anij'

            smtp_server = 'smtp.gmail.com'
            smtp_port = 587

            # Create the email content
            subject = f'{clinic_name} - Test Report'
            body = "Your Test Report"
            receiver_email = pemail

            # Compose the email
            message = MIMEMultipart()
            message['From'] = sender_email
            message['To'] = receiver_email
            message['Subject'] = subject

            message.attach(MIMEText(body, 'plain'))

            # Attach the file from memory
            pdf_attachment = MIMEBase('application', 'pdf')
            pdf_attachment.set_payload(image_file.read())
            encoders.encode_base64(pdf_attachment)
            pdf_attachment.add_header('Content-Disposition', f'attachment; filename="{patientname}_TestReport"')
            message.attach(pdf_attachment)

            message.attach(MIMEText(f"\n\nClinic Address: \n{clinic_address}", 'plain'))


            # Set up the SMTP connection
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, receiver_email, message.as_string())
            print("Email with attachment sent successfully!")


            return JsonResponse({"message": "sent successfully!"})
        else:
            return JsonResponse({'message': 'No Email id for this Patient to send Email'})
        
    except Exception as e:
        print('Error',str(e))
        return JsonResponse({'Error':str(e)})
    

#= =  = = = = =  == = =  ==  = ==  == =  == = = = = GET FOR SMART REPORT =  = = = = = = =  = = = == = = = == = = == = = = 

def get_data_for_smart_report(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()
            
            invoice = request.GET.get('invoice')
            patientid = request.GET.get('Patientid')
            # testname = request.GET.get('testname')
            visitid = request.GET.get('Visitid')

            get_smart_report = """
                SELECT Panic_Low, Panic_High, Capture_Value, Test
                FROM Approve_Test_Pathologist 
                WHERE Billing_invoice = %s 
                  AND Visit_Id = %s 
                  AND Patient_Id = %s 
            """
            cursor.execute(get_smart_report, (invoice, visitid, patientid))
            result = cursor.fetchall()
            report =[]
            print('result', result)
            for row in result:
                data = {
                    'Capturevalue': row[2],
                    'Paniclow': row[0],
                    'Panichigh': row[1],
                    'Testname' : row[3]
                }
                report.append(data)

            else:
                data = {"Error": "No data found"}

            return JsonResponse(report, safe=False)
        
        except Exception as e:
            return JsonResponse({"Error": str(e)})
        
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"Error": "Invalid request method"})
    


# @csrf_exempt
# def insert_reort_table(request):
#     try:
#         
#         cursor = db.cursor()
        
#         data = request.POST

        
#         pdf_file_path = request.FILES.get('report')

            
        
#         query = """SELECT Clinic_Name,Clinic_Logo FROM usercontrol_accountsetting"""
#         cursor.execute(query)
#         data = cursor.fetchone()
        
#         ClinicName = data[0]        
#         ClinicLogo = data[1]


#         # Attach the PDF to the email

#         # Create the email content
#         # subject = f"Interview Invitation for {Role} Position at {ClinicName}"
#         body = 'Test Report'
#         subject  = f"""{ClinicName} | Test Report
#         HR Team - {ClinicName} 
#         """
#         CandidateEmail = 'tamilrs2001@gmail.com'
#         # Configure email settings
#         sender_name = 'Santhosh'
#         sender_email = 'info@vesoft.in'
#         sender_password = 'ME6tG6x2v1mZ'
#         smtp_server = 'smtp.gmail.com'
#         smtp_port = 587

#         # Create the email message
#         message = MIMEMultipart()
#         message['From'] = "{0} <{1}>".format(sender_name, sender_email)
#         message['To'] = 'tamilrs2001@gmail.com'
#         message['Subject'] = subject

#         # Attach the body to the email
#         message.attach(MIMEText(body, 'plain'))
#         with open(pdf_file_path, 'rb') as attachment:
#             part = MIMEBase('application', 'octet-stream')
#             part.set_payload(attachment.read())
#             encoders.encode_base64(part)
#             part.add_header('Content-Disposition', f'attachment; filename= "{pdf_file_path}"')
#             message.attach(part)
            

#         # Set up SMTP server and send email
#         smtp_server = smtplib.SMTP(smtp_server, smtp_port)
#         smtp_server.starttls()
#         smtp_server.login(sender_email, sender_password)
#         smtp_server.sendmail(sender_email, CandidateEmail, message.as_string())
#         smtp_server.quit()

#         db.commit()
        
#         return JsonResponse({'Message':'Sent Successfully'})
        
#     except Exception as e:
#         return JsonResponse({'Message':str(e)})
#     finally:
#         cursor.close()
#         db.close()




#= = =  = = = = = = == == = == = = == = = = == = = get for dispatch report = = = = = === = = == = = == = = == = == = = = = = = == = 

def get_for_dispatch_report_status(request):
    try:
        
        cursor = db.cursor()

        invoice = request.GET.get('invoice')

        cursor.execute("SELECT MAX(Dispatched_Id) FROM Completed_Lab_Report_Table WHERE Billing_Invoice = %s", (invoice,))
        dispatch_id =  cursor.fetchone()[0]
        print('dispatch_id :',dispatch_id)
        
        if dispatch_id is not None:

            status_query = """
                    SELECT ReportSatus FROM Completed_Lab_Report_Table WHERE Billing_Invoice = %s AND Dispatched_Id = %s
                """
            cursor.execute(status_query, (invoice, dispatch_id,))
            Status = cursor.fetchone()

            return JsonResponse({'Status':Status[0]}, safe=False)

        else:
            return JsonResponse('',safe=False)
            
    except Exception as e:
        return JsonResponse({"Error" : str(e)})
    finally:
        cursor.close()
        db.close()


def getreportpdf(request):
    try:

        
        cursor = db.cursor()
        
        
        selectq = """SELECT """
        
    except Exception as e:
        return JsonResponse({"Error" : e})
    finally:
        cursor.close()
        db.close()





def get_for_preview_examinations_pathologist(request):
    try:
        cursor = db.cursor()

        visit_id = request.GET.get('Visitid')
        patient_id = request.GET.get('patientid')
        invoice = request.GET.get('Billinginvoice')
        result = []

        # ─────────────────────────────────────────────────────────────────────────
        # OPTIMISED get_for_preview_examinations_pathologist
        # FIX: Was running 2 queries per test (dept lookup + test details).
        # Now: 1 query for all test+dept info, 1 for all details, 1 for timestamps.
        # Before: 1 + (2 × N) + timestamp queries.  After: 3 queries total.
        # ─────────────────────────────────────────────────────────────────────────

        # Query 1: Get all distinct tests with department in one shot
        cursor.execute("""
            SELECT DISTINCT bit.Test_Name, bit.Test_Code, td.sub_department_id
            FROM Billing_Item_Table_for_lab bit
            LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
            WHERE bit.Billing_Invoice = %s AND bit.Bill_Status != "Canceled"
        """, [invoice])
        test_rows = cursor.fetchall()

        if test_rows:
            all_codes = [r[1] for r in test_rows]
            codes_tuple = tuple(all_codes)

            # Query 2: All test details across all codes in ONE query
            cursor.execute("""
                SELECT td.Method_Name_id, td.Test_Name, ap.EditContent,
                       td.sub_department_id, td.Specimen_Name_id, td.Test_Code
                FROM Test_Descriptions AS td
                INNER JOIN AnalyseInvestigationSenior AS ap ON ap.Test_Code = td.Test_Code
                WHERE td.Test_Code IN %s AND ap.Visit_Id = %s AND ap.Patient_Id = %s
            """, [codes_tuple, visit_id, patient_id])
            
            # Group details by Test_Code for O(1) lookup
            details_by_code = {}
            for d in cursor.fetchall():
                details_by_code.setdefault(d[5], []).append(d)

            # Query 2.5: Fetch antibiotic data for culture tests
            cursor.execute("""
                SELECT Captured_Oraganism, Sensitive_Type, Antibiotic_Name, 
                       Antibiotic_Value, Test_Code, ColonyCount,
                       sensitiverange, intermediaterange, resistantrange
                FROM Complete_Culture_Examination 
                WHERE Billing_Invoice = %s AND Visit_Id = %s AND Test_Code IN %s
                ORDER BY Test_Code, Captured_Oraganism, Sensitive_Type
            """, [invoice, visit_id, codes_tuple])
            
            antibiotics_by_test = {}
            for org, sens_type, anti_name, anti_value, test_code, colony_count, sens_range, inter_range, resist_range in cursor.fetchall():
                if test_code not in antibiotics_by_test:
                    antibiotics_by_test[test_code] = {}
                if org not in antibiotics_by_test[test_code]:
                    antibiotics_by_test[test_code][org] = {
                        'organism_name': org,
                        'colony_count': colony_count,
                        'antibiotics': []
                    }
                antibiotics_by_test[test_code][org]['antibiotics'].append({
                    'Antibiotic': anti_name,
                    'SensitivityType': sens_type,
                    'CaptureValue': anti_value,
                    'SensitiveRange': sens_range,
                    'IntermediateRange': inter_range,
                    'ResistantRange': resist_range
                })


            # Query 3: All timestamps across all codes in ONE query
            cursor.execute("""
                SELECT Source, Test_Code, MAX(CreatedAt)
                FROM (
                    SELECT 'Sample_Capture_in_Phelobotomist' AS Source, Test_Code, CreatedAt
                    FROM Sample_Capture_in_Phelobotomist
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                    UNION ALL
                    SELECT 'AnalyseInvestigationSenior', Test_Code, CreatedAt
                    FROM AnalyseInvestigationSenior
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                    UNION ALL
                    SELECT 'Approve_Test_Pathologist', Test_Code, CreatedAt
                    FROM Approve_Test_Pathologist
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                ) AS SubQuery
                GROUP BY Source, Test_Code
            """, [codes_tuple, patient_id, invoice,
                  codes_tuple, patient_id, invoice,
                  codes_tuple, patient_id, invoice])
            
            # Group timestamps by (Test_Code, Source)
            timestamps_by_code = {}
            for source, t_code, created_at in cursor.fetchall():
                timestamps_by_code.setdefault(t_code, {})[source] = (
                    created_at.strftime("%Y-%m-%d %H:%M:%S") if created_at else "N/A"
                )

            # Assemble result using dict lookups — O(1) per test, zero extra queries
            for test_name, Test_Code, dept in test_rows:
                test_data = {
                    'Group_Name': test_name,
                    'Department': dept,
                    'Tests': [],
                    'Antibiotics': antibiotics_by_test.get(Test_Code, {}),
                    'Updated_At': {
                        'Sample_Capture_in_Phelobotomist': 'N/A',
                        'AnalyseInvestigationSenior': 'N/A',
                        'Approve_Test_Pathologist': 'N/A',
                    }
                }
                
                # Update timestamps from dict lookup (O(1))
                ts = timestamps_by_code.get(Test_Code, {})
                test_data['Updated_At'].update(ts)

                # Add test details from dict lookup (O(1))
                for detail in details_by_code.get(Test_Code, []):
                    test_data['Tests'].append({
                        'Method_Name': detail[0],
                        'Test_Name': detail[1],
                        'EditContent': detail[2],
                        'Department': detail[3],
                        'Specimen': detail[4],
                        'Test_Code': detail[5]
                    })
                
                result.append(test_data)

        return JsonResponse(result, safe=False)

    except Exception as e:
        print(e)
        return JsonResponse({"Error": str(e)})
    finally:
        cursor.close()
        db.close()








@csrf_exempt
def get_for_preview_examinations_dispatch(request):
    try:
        cursor = db.cursor()

        visit_id = request.GET.get('Visitid')
        patient_id = request.GET.get('patientid')
        invoice = request.GET.get('Billinginvoice')
        result = []

        # ═══════════════════════════════════════════════════════════════════
        # OPTIMIZED get_for_preview_examinations_dispatch
        # Handles: Individual, Group, and Package (Offers) tests
        # ═══════════════════════════════════════════════════════════════════

        # Query 1: Get CreatedBy
        cursor.execute("""
            SELECT CreatedBy
            FROM Approve_Test_Pathologist
            WHERE Billing_Invoice = %s
            LIMIT 1
        """, [invoice])
        created_by_row = cursor.fetchone()
        created_by = created_by_row[0] if created_by_row else "N/A"

        # Query 2: Get ALL tests with correct department based on Test_Method
        cursor.execute("""
            SELECT DISTINCT 
                bit.Test_Name, 
                bit.Test_Code,
                COALESCE(
                    CASE 
                        WHEN bit.Test_Method = 'Individual' THEN sld1.SubDepartment_Name
                        WHEN bit.Test_Method = 'Group' THEN sld2.SubDepartment_Name  
                        WHEN bit.Test_Method = 'Offers' THEN op.department_name
                        ELSE 'Unknown'
                    END,
                    'Unknown'
                ) AS SubDepartment_Name,
                bit.Test_Method
            FROM Billing_Item_Table_for_lab bit
            -- Individual tests
            LEFT JOIN Test_Descriptions td 
                ON bit.Test_Code = td.Test_Code 
                AND bit.Test_Method = 'Individual'
            LEFT JOIN SubLab_Department_Detials sld1 
                ON td.Sub_Department_id = sld1.SubDepartment_Code
            -- Group tests
            LEFT JOIN Group_Master gm
                ON bit.Group_Code = gm.Group_Code
                AND bit.Test_Method = 'Group'
            LEFT JOIN SubLab_Department_Detials sld2
                ON gm.Department_id = sld2.SubDepartment_Code
            -- Package tests (Offers)
            LEFT JOIN OfferPackage op 
                ON bit.PackageCode = op.package_code 
                AND bit.Test_Method = 'Offers'
            WHERE bit.Billing_Invoice = %s
              AND bit.Bill_Status != 'Canceled'
              AND (bit.IsSubTest IS NULL OR bit.IsSubTest != 'Yes')
        """, [invoice])
        
        test_rows = cursor.fetchall()

        if test_rows:
            all_codes = [r[1] for r in test_rows]
            codes_tuple = tuple(all_codes)

            # Query 3: All test details in ONE query
            cursor.execute("""
                SELECT td.Method_Name_id, td.Test_Name, ap.EditContent,
                       sld.SubDepartment_Name, td.Specimen_Name_id, td.Test_Code
                FROM Test_Descriptions td
                INNER JOIN Approve_Test_Pathologist ap 
                    ON ap.Test_Code = td.Test_Code
                LEFT JOIN SubLab_Department_Detials sld 
                    ON td.Sub_Department_id = sld.SubDepartment_Code
                WHERE td.Test_Code IN %s 
                  AND ap.Visit_Id = %s 
                  AND ap.Patient_Id = %s
            """, [codes_tuple, visit_id, patient_id])
            
            details_by_code = {}
            for d in cursor.fetchall():
                details_by_code.setdefault(d[5], []).append(d)

            # Query 4: All timestamps in ONE query
            cursor.execute("""
                SELECT Source, Test_Code, MAX(CreatedAt)
                FROM (
                    SELECT 'Sample_Capture_in_Phelobotomist' AS Source, Test_Code, CreatedAt
                    FROM Sample_Capture_in_Phelobotomist
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                    UNION ALL
                    SELECT 'AnalyseInvestigationSenior', Test_Code, CreatedAt
                    FROM AnalyseInvestigationSenior
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                    UNION ALL
                    SELECT 'Approve_Test_Pathologist', Test_Code, CreatedAt
                    FROM Approve_Test_Pathologist
                    WHERE Test_Code IN %s AND Patient_Id = %s AND Billing_invoice = %s
                ) AS SubQuery
                GROUP BY Source, Test_Code
            """, [codes_tuple, patient_id, invoice,
                  codes_tuple, patient_id, invoice,
                  codes_tuple, patient_id, invoice])
            
            timestamps_by_code = {}
            for source, t_code, created_at in cursor.fetchall():
                timestamps_by_code.setdefault(t_code, {})[source] = (
                    created_at.strftime("%d/%m/%Y %H:%M") if created_at else "N/A"
                )

            # Assemble result
            for test_name, Test_Code, dept, test_method in test_rows:
                test_data = {
                    'Group_Name': test_name,
                    'Department': dept if dept else 'Unknown',
                    'Test_Method': test_method,
                    'Tests': [],
                    'Updated_At': {
                        'Sample_Capture_in_Phelobotomist': 'N/A',
                        'AnalyseInvestigationSenior': 'N/A',
                        'Approve_Test_Pathologist': 'N/A',
                    },
                    "CreatedBy": created_by,
                }
                
                ts = timestamps_by_code.get(Test_Code, {})
                test_data['Updated_At'].update(ts)

                for detail in details_by_code.get(Test_Code, []):
                    test_data['Tests'].append({
                        'Method_Name': detail[0],
                        'Test_Name': detail[1],
                        'EditContent': detail[2],
                        'Department': detail[3] if detail[3] else dept,
                        'Specimen': detail[4],
                        'Test_Code': detail[5]
                    })
                
                result.append(test_data)

        return JsonResponse(result, safe=False)

    except Exception as e:
        print(f"Dispatch error: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({"Error": str(e)}, status=500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



@csrf_exempt
def updatecontenteditsenior(request):
    if request.method == 'POST':
        try:
            
            cursor = db.cursor()
            data = json.loads(request.body)

            print('data........................', data)
            
            content = data.get('seniorcontent')
            patientid = data.get('patientid')
            visitid = data.get('visitid')
            invoiceno = data.get('invoiceno')
            
            # Correct SQL query
            insert_query = """
                UPDATE AnalyseInvestigationResult
                SET EditContent = %s
                WHERE Patient_Id = %s AND Visit_Id = %s AND Billing_invoice = %s
            """
            cursor.execute(insert_query, (content, patientid, visitid, invoiceno))
            db.commit()

            return JsonResponse({"success": True}, status=200)  # Return a success response with status 200

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)  # Return an error response with status 500

        finally:
            if cursor:
                cursor.close()  # Ensure cursor is closed
            if db:
                db.close()  # Ensure the database connection is closed

    return JsonResponse({"error": "Method not allowed"}, status=405)
    
    

@csrf_exempt
def updatepathologyeditcontent(request):
    if request.method == 'POST':
        try:
            
            cursor = db.cursor()
            data = json.loads(request.body)

            print('data........................', data)
            
            content = data.get('pathologycontent')
            patientid = data.get('patientid')
            visitid = data.get('visitid')
            invoiceno = data.get('invoiceno')
            
            # Correct SQL query
            insert_query = """
                UPDATE AnalyseInvestigationSenior
                SET EditContent = %s
                WHERE Patient_Id = %s AND Visit_Id = %s AND Billing_invoice = %s
            """
            cursor.execute(insert_query, (content, patientid, visitid, invoiceno))
            db.commit()

            return JsonResponse({"success": True}, status=200)  # Return a success response with status 200

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)  # Return an error response with status 500

        finally:
            if cursor:
                cursor.close()  # Ensure cursor is closed
            if db:
                db.close()  # Ensure the database connection is closed

    return JsonResponse({"error": "Method not allowed"}, status=405)
    
 
# @csrf_exempt
# def insert_Histo_Template(request):
#     try:
        
#         cursor = db.cursor()
 
#         # Get the data from the request
#         data = request.POST
#         print("data:", data)
#         # Helper function to convert empty strings to None
#         def empty_to_none(value):
#             return None if value == "" else value
#         # print("files:", request.FILES)
 
#         # Prepare to insert the common data
#         billing_invoice = data.get("Billing_Invoice", None)
#         patient_id = data.get("Patient_Id", None)
#         visit_id = data.get("Visit_Id", None)
#         created_by = data.get("CreatedBy", None)
#         location = data.get("Location", None)
 
#         # Define format columns
#         format_columns = {
#             "peripheralSmear": [
#                 {"format": "peripheralSmear"},
#                 {"name": "RBC", "value":None},
#                 {"name": "WBC", "value":None},
#                 {"name": "Platelets", "value":None},
#                 {"name": "Parasite", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Note", "value":None},
#                 {"name": "Comments", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "imageData", "value": None},
#             ],
#             "lbc": [
#                 {"format": "lbc"},
#                 {"name": "Cyto_No", "value":None},
#                 {"name": "Specimen", "value":None},
#                 {"name": "Clinical_History", "value":None},
#                 {"name": "Microscopy", "value":None},
#                 {"name": "Specimen_Adequacy", "value":None},
#                 {"name": "Microscopic_Observations", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "imageData", "value": None},
#             ],
#             "biopsy": [
#                 {"format": "biopsy"},
#                 {"name": "HPE_No", "value":None},
#                 {"name": "Report_Status", "value":None},
#                 {"name": "Specimen_Category", "value":None},
#                 {"name": "Specimen", "value":None},
#                 {"name": "Clinical_Data", "value":None},
#                 {"name": "Gross_Findings", "value":None},
#                 {"name": "Microscopy", "value":None},
#                 {"name": "Diagnostic_Summary", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Clinical_Comment", "value":None},
#                 {"name": "Note", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "imageData", "value": None},
#             ],
#             "fnac": [
#                 {"format": "fnac"},
#                 {"name": "Cyto_No", "value":None},
#                 {"name": "Report_Status", "value":None},
#                 {"name": "Specimen", "value":None},
#                 {"name": "Site", "value":None},
#                 {"name": "Clinical_Data", "value":None},
#                 {"name": "Gross", "value":None},
#                 {"name": "Stains_Used", "value":None},
#                 {"name": "Microscopy", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Clinical_Comment", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "imageData", "value": None},
#             ],
#             "FluidCytology": [
#                 {"format": "FluidCytology"},
#                 {"name": "Cyto_No", "value": ""},
#                 {"name": "Report_Status", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Site", "value": ""},
#                 {"name": "Clinical_Data", "value": ""},
#                 {"name": "Gross", "value": ""},
#                 {"name": "Stains_Used", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Clinical_Comment", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "histopathologySecondOpinion": [
#                 {"format": "histopathologySecondOpinion"},
#                 {"name": "HPE_No", "value":None},
#                 {"name": "Report_Status", "value":None},
#                 {"name": "Specimen_Category", "value":None},
#                 {"name": "Specimen", "value":None},
#                 {"name": "Clinical_Data", "value":None},
#                 {"name": "Gross_Findings", "value":None},
#                 {"name": "Microscopy", "value":None},
#                 {"name": "Diagnostic_Summary", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Clinical_Comment", "value":None},
#                 {"name": "Note", "value":None},
#                 {"name": "Comments", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "imageData", "value": None},
#             ],
#             "pathologyReport": [
#                 {"format": "pathologyReport"},
#                 {"name": "Specimen", "value":None},
#                 {"name": "Gross_Findings", "value":None},
#                 {"name": "Microscopic_Findings", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "imageData", "value": None},
#             ], 
#             "Immunohistochemistry(IHC)": [
#                 {"format": "Immunohistochemistry(IHC)"},
#                 {"name": "Report_Status", "value":None},
#                 {"name": "Specimen", "value":None},
#                 {"name": "Clinical_Data", "value":None},
#                 {"name": "HPE_Diagnosis", "value":None},
#                 {"name": "Gross", "value":None},
#                 {"name": "Microscopy", "value":None},
#                 {"name": "Impression", "value":None},
#                 {"name": "Disclaimer", "value":None},
#                 {"name": "Comments", "value": None},
#             ],
#             #  "Histopathology Report HP": [
#             #     {"format": "Histopathology Report HP"},
#             #     {"name":"Clinical Diagnosis","value":""},
#             #     {"name":"Nature Of Specimen","value":""},
#             #     {"name":"Gross appearance","value":""},
#             #     {"name":"Microscopic appearance","value":""},
#             #     {"name":"Diagnosis","value":""},
#             #     {"name":"Disclaimer","value":"Slides and blocks will be stored for five years. Slides and blocks shall be given upon request to a reliable attender/ patient. Specimens will be stored for one month. The management does not commit for retrieval of specimens after this period. The clinical and demographic details as per requisition form."},
#             # ],
#                         "PAP": [
#                 {"format": "PAP"},
#                 {"name":"Clinical Details","value":""},
#                 {"name":"Specimen Type","value":""},
#                 {"name":"Specimen Adequacy","value":""},
#                 {"name":"Superficial Cells","value":""},
#                 {"name":"Intermediate Cells","value":""},
#                 {"name":"Deep Parabasal Cells","value":""},
#                 {"name":"Parabasal Cells","value":""},
#                 {"name":"Parabasal Cells","value":""},
#                 {"name":"Metaplastic squamous Cells","value":""},
#                 {"name":"Endocervical Cells","value":""},
#                 {"name":"Inflammatory cells","value":""},
#                 {"name":"Squamous metaplasia","value":""},
#                 {"name":"Keratotic changes","value":""},
#                 {"name":"Tubal metaplasia","value":""},
#                 {"name":"Atrophy","value":""},
#                 {"name":"Pregnancy associated changes","value":""},
#                 {"name":"Inflammation","value":""},
#                 {"name":"Atrophy","value":""},
#                 {"name":"Radiation","value":""},
#                 {"name":"IUCD","value":""},
#                 {"name":"Repai","value":""},
#                 {"name":"Glandular cells post hysterectomy","value":""},
#                 {"name":"Inflammatory changes","value":""},
#                 {"name":"Doderlein bacilli","value":""},
#                 {"name":"Trichomonas Vaginalis","value":""},
#                 {"name":"Fungal Organisms","value":""},
#                 {"name":"Shift in flora suggestive of bacterial vaginosis","value":""},
#                 {"name":"Bacteria morphologically consistent with Actinomyces spp","value":""},
#                 {"name":"Cellular changes consistent with Herpes Simplex","value":""},
#                 {"name":"Cellular changes consistent with CMV","value":""},
#                 {"name":"SQUAMOUS CELLS","value":""},
#                 {"name":"GLANDULAR CELLS","value":""},
#                 {"name":"Endocervical Cells (NOS)","value":""},
#                 {"name":"Endometrial Cells (NOS)","value":""},
#                 {"name":"Glandular Cells (NOS)","value":""},
#                 {"name":"Endocervical cells favour neoplastic ","value":""},
#                 {"name":"Glandular cells favour neoplastic ","value":""},
#                 {"name":"Endocervical Adenocarcinoma In Situ","value":""},
#                 {"name":"Endocervical","value":""},
#                 {"name":"Endometrial","value":""},
#                 {"name":"Extra uterine","value":""},
#                 {"name":"NOS","value":""},
#                 {"name":"Note","value":"Cervical cytology is a screening test and has associated with false negative and false positive results. Regular sampling and follow up is recommended."},
#             ],  

#         }
 
#         # Prepare to insert multiple test formats
#         for test_code in data.keys():
#             # Skip if the key doesn't follow the expected test code format
#             if not test_code.endswith("_format"):
#                 continue
 
#             # Initialize insert_data with common fields and default values for all other fields
#             insert_data = {
#                 "Billing_Invoice": billing_invoice,
#                 "Patient_Id": patient_id,
#                 "Visit_Id": visit_id,
#                 "Test_Code": test_code[:-7],  # Remove '_format' to get actual test code
#                 "CreatedBy": created_by,
#                 "Location": location,
#                 "Format": None,
#                 "Impression": None,
#                 "Specimen": None,
#                 "Microscopy": None,
#                 "Note": None,
#                 "Cyto_No": None,
#                 "Report_Status": None,
#                 "Clinical_Data": None,
#                 "Clinical_Comment": None,
#                 "Specimen_Category": None,
#                 "Gross_Findings": None,
#                 "Diagnostic_Summary": None,
#                 "Comments": None,
#                 "HPE_No": None,
#                 "RBC": None,
#                 "WBC": None,
#                 "Platelets": None,
#                 "Parasite": None,
#                 "Clinical_History": None,
#                 "Specimen_Adequacy": None,
#                 "Microscopic_Observations": None,
#                 "Site": None,
#                 "Gross": None,
#                 "Stains_Used": None,
#                 "Microscopic_Findings": None,
#                 "Histo_Image": None,
#                 "Captured_Organism": None,
#                 "HPE_Diagnosis": None,
#                 "Disclaimer": None,
#             }
#             # Extract the format type from the corresponding _format key
#             format_type = data.get(test_code, [None])
#             insert_data["Format"] = format_type
 
#             if format_type in format_columns:
#                 format_fields = format_columns[format_type]
#                 for field in format_fields:
#                     field_name = field.get("name")
#                     print("field_name :", field_name)
#                     field_value = data.get(
#                         f"{insert_data['Test_Code']}_{field_name}", [None]
#                     )
#                     print("field_value :", field_value)
#                     insert_data[field_name] = field_value
 
#             # Handle the image if available
#             image_key = f"{insert_data['Test_Code']}_imageData"
#             print("image_key:", image_key)
        
#             # Check if image_key is in request.POST (for base64 string) or request.FILES (for file upload)
#             if image_key in request.POST:
#                 # Handle base64 string from frontend
#                 image_data = request.POST[image_key]
#                 print("image_data from POST:", image_data)
#                 if image_data.startswith("data:image/"):
#                     insert_data["Histo_Image"] = image_data  # Use the data URL directly
#                     print("Histo_Image set from POST:", insert_data["Histo_Image"])
#             elif image_key in request.FILES:      
#                 # Handle file upload (same as insert logic)
#                 image_file = request.FILES[image_key]
#                 print("image_file from FILES:", image_file)
#                 content_type = image_file.content_type
#                 print("content_type:", content_type)
#                 if content_type.startswith("image/"):
#                     image_content = image_file.read()
#                     image_base64 = base64.b64encode(image_content).decode("utf-8")
#                     insert_data["Histo_Image"] = f"data:{content_type};base64,{image_base64}"
#                     print("Histo_Image set from FILES:", insert_data["Histo_Image"])
#                 else:
#                     return JsonResponse(
#                         {"status": "error", "message": "Only image files are supported"},
#                         status=400
#                     )
 
#             cursor.execute("SELECT MAX(Histo_Templates_Id) FROM histo_templates")
#             max_id = cursor.fetchone()[0]
 
#             if max_id is None:
#                 next_id = 1
#             else:
#                 next_id = max_id + 1
 
#             # Check if the record already exists
#             cursor.execute(
#                 """
#                 SELECT Test_Code FROM histo_templates
#                 WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s AND Test_Code = %s
#                 """,
#                 (billing_invoice, patient_id, visit_id, insert_data["Test_Code"]),
#             )
#             existing_record = cursor.fetchone()

#             print('existing_record',existing_record) 
#             if existing_record:
#                 # Update the record if it exists

#                 if insert_data["Format"]=="PAP":
#                     cursor.execute("""UPDATE Cytology_Report
#                     SET 
#                         Billing_Invoice = 'INV123456',
#                         Patient_Id = 'PAT001',
#                         Visit_Id = 'VIS1001',
#                         CreatedBy = 'admin',
#                         Location = 'Chennai',
#                         Format = 'Default',
#                         Clinical_Details = 'Sample detail',
#                         Specimen_Type = 'Cervical',
#                         Specimen_Adequacy = 'Adequate',
#                         Superficial_Cells = 'Present',
#                         Intermediate_Cells = 'Moderate',
#                         Deep_Parabasal_Cells = 'Few',
#                         Parabasal_Cells_1 = 'Low',
#                         Parabasal_Cells_2 = 'Low',
#                         Metaplastic_squamous_Cells = 'Noted',
#                         Endocervical_Cells = 'Present',
#                         Inflammatory_cells = 'Scattered',
#                         Squamous_metaplasia = 'Seen',
#                         Keratotic_changes = 'None',
#                         Tubal_metaplasia = 'Absent',
#                         Atrophy_1 = 'Mild',
#                         Pregnancy_associated_changes = 'None',
#                         Inflammation = 'Chronic',
#                         Atrophy_2 = 'Mild',
#                         Radiation = 'No',
#                         IUCD = 'No',
#                         Repai = 'No changes',
#                         Glandular_cells_post_hysterectomy = 'Not Seen',
#                         Inflammatory_changes = 'Minimal',
#                         Doderlein_bacilli = 'Normal',
#                         Trichomonas_Vaginalis = 'Negative',
#                         Fungal_Organisms = 'Negative',
#                         Shift_in_flora_suggestive_of_bacterial_vaginosis = 'Not Present',
#                         Bacteria_morphologically_consistent_with_Actinomyces_spp = 'Absent',
#                         Cellular_changes_consistent_with_Herpes_Simplex = 'Not Detected',
#                         Cellular_changes_consistent_with_CMV = 'Negative',
#                         SQUAMOUS_CELLS = 'Normal',
#                         GLANDULAR_CELLS = 'Normal',
#                         Endocervical_Cells_NOS = 'Clear',
#                         Endometrial_Cells_NOS = 'Clear',
#                         Glandular_Cells_NOS = 'Clear',
#                         Endocervical_cells_favour_neoplastic = 'No',
#                         Glandular_cells_favour_neoplastic = 'No',
#                         Endocervical_Adenocarcinoma_In_Situ = 'Negative',
#                         Endocervical = 'Present',
#                         Endometrial = 'Noted',
#                         Extra_uterine = 'Absent',
#                         NOS = 'None',
#                         Note = 'Follow-up recommended'
#                     WHERE Histo_Templates_Id = 101;
#                     """)
                
#                 else:
#                     cursor.execute(
#                         """
#                         UPDATE histo_templates
#                         SET Format = %s, CreatedBy = %s, Location = %s,
#                             Impression = %s, Specimen = %s, Microscopy = %s, Note = %s,
#                             Cyto_No = %s, Report_Status = %s, Clinical_Data = %s,
#                             Clinical_Comment = %s, Specimen_Category = %s,
#                             Gross_Findings = %s, Diagnostic_Summary = %s, Comments = %s,
#                             HPE_No = %s, RBC = %s, WBC = %s, Platelets = %s,
#                             Parasite = %s, Clinical_History = %s, Specimen_Adequacy = %s,
#                             Microscopic_Observations = %s, Site = %s, Gross = %s,
#                             Stains_Used = %s, Microscopic_Findings = %s , HPE_Diagnosis = %s ,Disclaimer = %s,Histo_Image =%s, UpdatedAt = %s
#                         WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s AND Test_Code = %s
#                         """,
#                         (
#                             empty_to_none(insert_data["Format"]),
#                             empty_to_none(insert_data["CreatedBy"]),
#                             empty_to_none(insert_data["Location"]),
#                             empty_to_none(insert_data["Impression"]),
#                             empty_to_none(insert_data["Specimen"]),
#                             empty_to_none(insert_data["Microscopy"]),
#                             empty_to_none(insert_data["Note"]),
#                             empty_to_none(insert_data.get("Cyto_No")),
#                             empty_to_none(insert_data.get("Report_Status")),
#                             empty_to_none(insert_data.get("Clinical_Data")),
#                             empty_to_none(insert_data.get("Clinical_Comment")),
#                             empty_to_none(insert_data.get("Specimen_Category")),
#                             empty_to_none(insert_data.get("Gross_Findings")),
#                             empty_to_none(insert_data.get("Diagnostic_Summary")),
#                             empty_to_none(insert_data.get("Comments")),
#                             empty_to_none(insert_data.get("HPE_No")),
#                             empty_to_none(insert_data.get("RBC")),
#                             empty_to_none(insert_data.get("WBC")),
#                             empty_to_none(insert_data.get("Platelets")),
#                             empty_to_none(insert_data.get("Parasite")),
#                             empty_to_none(insert_data.get("Clinical_History")),
#                             empty_to_none(insert_data.get("Specimen_Adequacy")),
#                             empty_to_none(insert_data.get("Microscopic_Observations")),
#                             empty_to_none(insert_data.get("Site")),
#                             empty_to_none(insert_data.get("Gross")),
#                             empty_to_none(insert_data.get("Stains_Used")),
#                             empty_to_none(insert_data.get("Microscopic_Findings")),
#                             empty_to_none(insert_data.get("HPE_Diagnosis")),
#                             empty_to_none(insert_data.get("Disclaimer")),
#                             empty_to_none(insert_data["Histo_Image"]),
#                             datetime.now(),
#                             empty_to_none(billing_invoice),
#                             empty_to_none(patient_id),
#                             empty_to_none(visit_id),
#                             empty_to_none(insert_data["Test_Code"]),
#                         ),
#                     )

                
 
#             else:
#                 # Insert new record if it doesn't exist
#                 cursor.execute(
#                     """
#                     INSERT INTO histo_templates (Histo_Templates_Id, Billing_Invoice, Patient_Id, Visit_Id, Test_Code,
#                                                   Format, Histo_Image, CreatedBy, Location,
#                                                   Impression, Specimen, Microscopy, Note,
#                                                   Cyto_No, Report_Status, Clinical_Data,
#                                                   Clinical_Comment, Specimen_Category,
#                                                   Gross_Findings, Diagnostic_Summary, Comments,
#                                                   HPE_No, RBC, WBC, Platelets, Parasite,
#                                                   Clinical_History, Specimen_Adequacy,
#                                                   Microscopic_Observations, Site, Gross,
#                                                   Stains_Used, Microscopic_Findings,HPE_Diagnosis,Disclaimer, CreatedAt, UpdatedAt)
#                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s,
#                             %s, %s, %s, %s, %s, %s, %s, %s,
#                             %s, %s, %s, %s, %s, %s, %s, %s,
#                             %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s, %s)
#                     """,
#                     (
#                         next_id,
#                         billing_invoice,
#                         patient_id,
#                         visit_id,
#                         empty_to_none(insert_data["Test_Code"]),
#                         empty_to_none(insert_data["Format"]),
#                         empty_to_none(insert_data["Histo_Image"]),
#                         empty_to_none(insert_data["CreatedBy"]),
#                         empty_to_none(insert_data["Location"]),
#                         empty_to_none(insert_data["Impression"]),
#                         empty_to_none(insert_data["Specimen"]),
#                         empty_to_none(insert_data["Microscopy"]),
#                         empty_to_none(insert_data["Note"]),
#                         empty_to_none(insert_data.get("Cyto_No")),
#                         empty_to_none(insert_data.get("Report_Status")),
#                         empty_to_none(insert_data.get("Clinical_Data")),
#                         empty_to_none(insert_data.get("Clinical_Comment")),
#                         empty_to_none(insert_data.get("Specimen_Category")),
#                         empty_to_none(insert_data.get("Gross_Findings")),
#                         empty_to_none(insert_data.get("Diagnostic_Summary")),
#                         empty_to_none(insert_data.get("Comments")),
#                         empty_to_none(insert_data.get("HPE_No")),
#                         empty_to_none(insert_data.get("RBC")),
#                         empty_to_none(insert_data.get("WBC")),
#                         empty_to_none(insert_data.get("Platelets")),
#                         empty_to_none(insert_data.get("Parasite")),
#                         empty_to_none(insert_data.get("Clinical_History")),
#                         empty_to_none(insert_data.get("Specimen_Adequacy")),
#                         empty_to_none(insert_data.get("Microscopic_Observations")),
#                         empty_to_none(insert_data.get("Site")),
#                         empty_to_none(insert_data.get("Gross")),
#                         empty_to_none(insert_data.get("Stains_Used")),
#                         empty_to_none(insert_data.get("Microscopic_Findings")),
#                         empty_to_none(insert_data.get("HPE_Diagnosis")),
#                         empty_to_none(insert_data.get("Disclaimer")),
#                         datetime.now(),
#                         datetime.now()
#                     ),
#                 )
 
#             # Commit the changes
#             db.commit()
 
#         return JsonResponse(
#             {"status": "success", "message": "Data inserted/updated successfully!"},
#             status=200,
#         )
 
#     except Exception as e:
#         print("Error:", e)
#         db.rollback()
#         return JsonResponse({"status": "error", "message": str(e)}, status=400)
#     finally:
#         cursor.close()
#         db.close()
 
@csrf_exempt
def insert_Histo_Template(request):
    try:
        
        cursor = db.cursor()
 
        # Get the data from the request
        data = request.POST
        print("data:", data)
        # Helper function to convert empty strings to None
        def empty_to_none(value):
            return None if value == "" else value
        # print("files:", request.FILES)
 
        # Prepare to insert the common data
        billing_invoice = data.get("Billing_Invoice", None)
        patient_id = data.get("Patient_Id", None)
        visit_id = data.get("Visit_Id", None)
        created_by = data.get("CreatedBy", None)
        location = data.get("Location", None)
 
        # Define format columns
        format_columns = {
            "peripheralSmear": [
                {"format": "peripheralSmear"},
                {"name": "RBC", "value":None},
                {"name": "WBC", "value":None},
                {"name": "Platelets", "value":None},
                {"name": "Parasite", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Note", "value":None},
                {"name": "Comments", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "imageData", "value": None},
            ],
            "lbc": [
                {"format": "lbc"},
                {"name": "Cyto_No", "value":None},
                {"name": "Specimen", "value":None},
                {"name": "Clinical_History", "value":None},
                {"name": "Microscopy", "value":None},
                {"name": "Specimen_Adequacy", "value":None},
                {"name": "Microscopic_Observations", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "imageData", "value": None},
            ],
            "biopsy": [
                {"format": "biopsy"},
                {"name": "HPE_No", "value":None},
                {"name": "Report_Status", "value":None},
                {"name": "Specimen_Category", "value":None},
                {"name": "Specimen", "value":None},
                {"name": "Clinical_Data", "value":None},
                {"name": "Gross_Findings", "value":None},
                {"name": "Microscopy", "value":None},
                {"name": "Diagnostic_Summary", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Clinical_Comment", "value":None},
                {"name": "Note", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "imageData", "value": None},
            ],
            "fnac": [
                {"format": "fnac"},
                {"name": "Cyto_No", "value":None},
                {"name": "Report_Status", "value":None},
                {"name": "Specimen", "value":None},
                {"name": "Site", "value":None},
                {"name": "Clinical_Data", "value":None},
                {"name": "Gross", "value":None},
                {"name": "Stains_Used", "value":None},
                {"name": "Microscopy", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Clinical_Comment", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "imageData", "value": None},
            ],
            "FluidCytology": [
                {"format": "FluidCytology"},
                {"name": "Cyto_No", "value": ""},
                {"name": "Report_Status", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Site", "value": ""},
                {"name": "Clinical_Data", "value": ""},
                {"name": "Gross", "value": ""},
                {"name": "Stains_Used", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Clinical_Comment", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "histopathologySecondOpinion": [
                {"format": "histopathologySecondOpinion"},
                {"name": "HPE_No", "value":None},
                {"name": "Report_Status", "value":None},
                {"name": "Specimen_Category", "value":None},
                {"name": "Specimen", "value":None},
                {"name": "Clinical_Data", "value":None},
                {"name": "Gross_Findings", "value":None},
                {"name": "Microscopy", "value":None},
                {"name": "Diagnostic_Summary", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Clinical_Comment", "value":None},
                {"name": "Note", "value":None},
                {"name": "Comments", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "imageData", "value": None},
            ],
            "pathologyReport": [
                {"format": "pathologyReport"},
                {"name": "Specimen", "value":None},
                {"name": "Gross_Findings", "value":None},
                {"name": "Microscopic_Findings", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "imageData", "value": None},
            ], 
            "Immunohistochemistry(IHC)": [
                {"format": "Immunohistochemistry(IHC)"},
                {"name": "Report_Status", "value":None},
                {"name": "Specimen", "value":None},
                {"name": "Clinical_Data", "value":None},
                {"name": "HPE_Diagnosis", "value":None},
                {"name": "Gross", "value":None},
                {"name": "Microscopy", "value":None},
                {"name": "Impression", "value":None},
                {"name": "Disclaimer", "value":None},
                {"name": "Comments", "value": None},
            ],
            #  "Histopathology Report HP": [
            #     {"format": "Histopathology Report HP"},
            #     {"name":"Clinical Diagnosis","value":""},
            #     {"name":"Nature Of Specimen","value":""},
            #     {"name":"Gross appearance","value":""},
            #     {"name":"Microscopic appearance","value":""},
            #     {"name":"Diagnosis","value":""},
            #     {"name":"Disclaimer","value":"Slides and blocks will be stored for five years. Slides and blocks shall be given upon request to a reliable attender/ patient. Specimens will be stored for one month. The management does not commit for retrieval of specimens after this period. The clinical and demographic details as per requisition form."},
            # ],
                        "PAP": [
                {"format": "PAP"},
                {"name":"Clinical Details","value":""},
                {"name":"Specimen Type","value":""},
                {"name":"Specimen Adequacy","value":""},
                {"name":"Superficial Cells","value":""},
                {"name":"Intermediate Cells","value":""},
                {"name":"Deep Parabasal Cells","value":""},
                {"name":"Parabasal Cells","value":""},
                {"name":"Metaplastic squamous Cells","value":""},
                {"name":"Endocervical Cells","value":""},
                {"name":"Inflammatory cells","value":""},
                {"name":"Squamous metaplasia","value":""},
                {"name":"Keratotic changes","value":""},
                {"name":"Tubal metaplasia","value":""},
                {"name":"Non Neoplastic-Atrophy","value":""},
                {"name":"Pregnancy associated changes","value":""},
                {"name":"Inflammation","value":""},
                {"name":"Atrophy","value":""},
                {"name":"Radiation","value":""},
                {"name":"IUCD","value":""},
                {"name":"Repai","value":""},
                {"name":"Glandular cells post hysterectomy","value":""},
                {"name":"Inflammatory changes","value":""},
                {"name":"Doderlein bacilli","value":""},
                {"name":"Trichomonas Vaginalis","value":""},
                {"name":"Fungal Organisms","value":""},
                {"name":"Shift in flora suggestive of bacterial vaginosis","value":""},
                {"name":"Bacteria morphologically consistent with Actinomyces spp","value":""},
                {"name":"Cellular changes consistent with Herpes Simplex","value":""},
                {"name":"Cellular changes consistent with CMV","value":""},
                {"name":"SQUAMOUS CELLS","value":""},
                {"name":"GLANDULAR CELLS","value":""},
                {"name":"Endocervical Cells (NOS)","value":""},
                {"name":"Endometrial Cells (NOS)","value":""},
                {"name":"Glandular Cells (NOS)","value":""},
                {"name":"Endocervical cells favour neoplastic ","value":""},
                {"name":"Glandular cells favour neoplastic ","value":""},
                {"name":"Endocervical Adenocarcinoma In Situ","value":""},
                {"name":"Endocervical","value":""},
                {"name":"Endometrial","value":""},
                {"name":"Extra uterine","value":""},
                {"name":"NOS","value":""},
                {"name":"Note","value":"Cervical cytology is a screening test and has associated with false negative and false positive results. Regular sampling and follow up is recommended."},
            ],  

        }
 
        # Prepare to insert multiple test formats
        for test_code in data.keys():
            # Skip if the key doesn't follow the expected test code format
            if not test_code.endswith("_format"):
                continue
 
            # Initialize insert_data with common fields and default values for all other fields
            insert_data = {
                "Billing_Invoice": billing_invoice,
                "Patient_Id": patient_id,
                "Visit_Id": visit_id,
                "Test_Code": test_code[:-7],  # Remove '_format' to get actual test code
                "CreatedBy": created_by,
                "Location": location,
                "Format": None,
                "Impression": None,
                "Specimen": None,
                "Microscopy": None,
                "Note": None,
                "Cyto_No": None,
                "Report_Status": None,
                "Clinical_Data": None,
                "Clinical_Comment": None,
                "Specimen_Category": None,
                "Gross_Findings": None,
                "Diagnostic_Summary": None,
                "Comments": None,
                "HPE_No": None,
                "RBC": None,
                "WBC": None,
                "Platelets": None,
                "Parasite": None,
                "Clinical_History": None,
                "Specimen_Adequacy": None,
                "Microscopic_Observations": None,
                "Site": None,
                "Gross": None,
                "Stains_Used": None,
                "Microscopic_Findings": None,
                "Histo_Image": None,
                "Captured_Organism": None,
                "HPE_Diagnosis": None,
                "Disclaimer": None,
            }
            # Extract the format type from the corresponding _format key
            format_type = data.get(test_code, [None])
            insert_data["Format"] = format_type
 
            if format_type in format_columns:
                format_fields = format_columns[format_type]
                for field in format_fields:
                    field_name = field.get("name")
                    print("field_name :", field_name)
                    field_value = data.get(
                        f"{insert_data['Test_Code']}_{field_name}", [None]
                    )
                    print("field_value :", field_value)
                    insert_data[field_name] = field_value
 
            # Handle the image if available
            image_key = f"{insert_data['Test_Code']}_imageData"
            print("image_key:", image_key)
        
            # Check if image_key is in request.POST (for base64 string) or request.FILES (for file upload)
            if image_key in request.POST:
                # Handle base64 string from frontend
                image_data = request.POST[image_key]
                print("image_data from POST:", image_data)
                if image_data.startswith("data:image/"):
                    insert_data["Histo_Image"] = image_data  # Use the data URL directly
                    print("Histo_Image set from POST:", insert_data["Histo_Image"])
            elif image_key in request.FILES:      
                # Handle file upload (same as insert logic)
                image_file = request.FILES[image_key]
                print("image_file from FILES:", image_file)
                content_type = image_file.content_type
                print("content_type:", content_type)
                if content_type.startswith("image/"):
                    image_content = image_file.read()
                    image_base64 = base64.b64encode(image_content).decode("utf-8")
                    insert_data["Histo_Image"] = f"data:{content_type};base64,{image_base64}"
                    print("Histo_Image set from FILES:", insert_data["Histo_Image"])
                else:
                    return JsonResponse(
                        {"status": "error", "message": "Only image files are supported"},
                        status=400
                    )
 
            cursor.execute("SELECT MAX(Histo_Templates_Id) FROM histo_templates")
            max_id = cursor.fetchone()[0]
 
            if max_id is None:
                next_id = 1
            else:
                next_id = max_id + 1
 
 
            if insert_data["Format"]=="PAP":
                cursor.execute(
                """SELECT Billing_Invoice FROM cytology_report
                WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s""",
                (billing_invoice, patient_id, visit_id,)
                )
            else:
            # Check if the record already exists
                cursor.execute(
                    """
                    SELECT Test_Code FROM histo_templates
                    WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s AND Test_Code = %s
                    """,
                    (billing_invoice, patient_id, visit_id, insert_data["Test_Code"]),
                )
                
            existing_record = cursor.fetchone()

            print('-------Data-------',insert_data) 
            if existing_record:
                # Update the record if it exists

                if insert_data["Format"]=="PAP":
                    print("-----Its-PAP-----------")
                    query = """UPDATE Cytology_Report
                    SET 
                        Clinical_Details = %s,
                        Specimen_Type = %s,
                        Specimen_Adequacy = %s,
                        Superficial_Cells = %s,
                        Intermediate_Cells = %s,
                        Deep_Parabasal_Cells = %s,
                        Parabasal_Cells_1 = %s,
                        Metaplastic_squamous_Cells = %s,
                        Endocervical_Cells = %s,
                        Inflammatory_cells = %s,
                        Squamous_metaplasia = %s,
                        Keratotic_changes = %s,
                        Tubal_metaplasia = %s,
                        Atrophy_1 =%s,
                        Pregnancy_associated_changes = %s,
                        Inflammation = %s,
                        Atrophy_2 = %s,
                        Radiation = %s,
                        IUCD = %s,
                        Repai = %s,
                        Glandular_cells_post_hysterectomy = %s,
                        Inflammatory_changes = %s,
                        Doderlein_bacilli = %s,
                        Trichomonas_Vaginalis = %s,
                        Fungal_Organisms = %s,
                        Shift_in_flora_suggestive_of_bacterial_vaginosis = %s,
                        Bacteria_morphologically_consistent_with_Actinomyces_spp = %s,
                        Cellular_changes_consistent_with_Herpes_Simplex =%s,
                        Cellular_changes_consistent_with_CMV = %s,
                        SQUAMOUS_CELLS = %s,
                        GLANDULAR_CELLS = %s,
                        Endocervical_Cells_NOS = %s,
                        Endometrial_Cells_NOS = %s,
                        Glandular_Cells_NOS = %s,
                        Endocervical_cells_favour_neoplastic = %s,
                        Glandular_cells_favour_neoplastic = %s,
                        Endocervical_Adenocarcinoma_In_Situ = %s,
                        Endocervical = %s,
                        Endometrial = %s,
                        Extra_uterine = %s,
                        NOS = %s,
                        Note = %s
                        WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s
                    """
                    cursor.execute(query,(
                        empty_to_none(insert_data.get("Clinical Details")),
                        empty_to_none(insert_data.get("Specimen Type")),
                        empty_to_none(insert_data.get("Specimen Adequacy")),
                        empty_to_none(insert_data.get("Superficial Cells")),
                        empty_to_none(insert_data.get("Intermediate Cells")),
                        empty_to_none(insert_data.get("Deep Parabasal Cells")),
                        empty_to_none(insert_data.get("Parabasal Cells")),
                        empty_to_none(insert_data.get("Metaplastic squamous Cells")),
                        empty_to_none(insert_data.get("Endocervical Cells")),
                        empty_to_none(insert_data.get("Inflammatory cells")),
                        empty_to_none(insert_data.get("Squamous metaplasia")),
                        empty_to_none(insert_data.get("Keratotic changes")),
                        empty_to_none(insert_data.get("Tubal metaplasia")),
                        empty_to_none(insert_data.get("Non Neoplastic-Atrophy")),
                        empty_to_none(insert_data.get("Pregnancy associated changes")),
                        empty_to_none(insert_data.get("Inflammation")),
                        empty_to_none(insert_data.get("Atrophy")),
                        empty_to_none(insert_data.get("Radiation")),
                        empty_to_none(insert_data.get("IUCD")),
                        empty_to_none(insert_data.get("Repai")),
                        empty_to_none(insert_data.get("Glandular cells post hysterectomy")),
                        empty_to_none(insert_data.get("Inflammatory changes")),
                        empty_to_none(insert_data.get("Doderlein bacilli")),
                        empty_to_none(insert_data.get("Trichomonas Vaginalis")),
                        empty_to_none(insert_data.get("Fungal Organisms")),
                        empty_to_none(insert_data.get("Shift in flora suggestive of bacterial vaginosis")),
                        empty_to_none(insert_data.get("Bacteria morphologically consistent with Actinomyces spp")),
                        empty_to_none(insert_data.get("Cellular changes consistent with Herpes Simplex")),
                        empty_to_none(insert_data.get("Cellular changes consistent with CMV")),
                        empty_to_none(insert_data.get("SQUAMOUS CELLS")),
                        empty_to_none(insert_data.get("GLANDULAR CELLS")),
                        empty_to_none(insert_data.get("Endocervical Cells (NOS)")),
                        empty_to_none(insert_data.get("Endometrial Cells (NOS)")),
                        empty_to_none(insert_data.get("Glandular Cells (NOS)")),
                        empty_to_none(insert_data.get("Endocervical cells favour neoplastic ")),
                        empty_to_none(insert_data.get("Glandular cells favour neoplastic ")),
                        empty_to_none(insert_data.get("Endocervical Adenocarcinoma In Situ")),
                        empty_to_none(insert_data.get("Endocervical")),
                        empty_to_none(insert_data.get("Endometrial")),
                        empty_to_none(insert_data.get("Extra uterine")),
                        empty_to_none(insert_data.get("NOS")),
                        empty_to_none(insert_data.get("Note")),
                        empty_to_none(billing_invoice),
                        empty_to_none(patient_id),
                        empty_to_none(visit_id),
                    ))
                    print("-----Its-PAP-OK----------")

                else:
                    cursor.execute(
                        """
                        UPDATE histo_templates
                        SET Format = %s, CreatedBy = %s, Location = %s,
                            Impression = %s, Specimen = %s, Microscopy = %s, Note = %s,
                            Cyto_No = %s, Report_Status = %s, Clinical_Data = %s,
                            Clinical_Comment = %s, Specimen_Category = %s,
                            Gross_Findings = %s, Diagnostic_Summary = %s, Comments = %s,
                            HPE_No = %s, RBC = %s, WBC = %s, Platelets = %s,
                            Parasite = %s, Clinical_History = %s, Specimen_Adequacy = %s,
                            Microscopic_Observations = %s, Site = %s, Gross = %s,
                            Stains_Used = %s, Microscopic_Findings = %s , HPE_Diagnosis = %s ,Disclaimer = %s,Histo_Image =%s, UpdatedAt = %s
                        WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s AND Test_Code = %s
                        """,
                        (
                            empty_to_none(insert_data["Format"]),
                            empty_to_none(insert_data["CreatedBy"]),
                            empty_to_none(insert_data["Location"]),
                            empty_to_none(insert_data["Impression"]),
                            empty_to_none(insert_data["Specimen"]),
                            empty_to_none(insert_data["Microscopy"]),
                            empty_to_none(insert_data["Note"]),
                            empty_to_none(insert_data.get("Cyto_No")),
                            empty_to_none(insert_data.get("Report_Status")),
                            empty_to_none(insert_data.get("Clinical_Data")),
                            empty_to_none(insert_data.get("Clinical_Comment")),
                            empty_to_none(insert_data.get("Specimen_Category")),
                            empty_to_none(insert_data.get("Gross_Findings")),
                            empty_to_none(insert_data.get("Diagnostic_Summary")),
                            empty_to_none(insert_data.get("Comments")),
                            empty_to_none(insert_data.get("HPE_No")),
                            empty_to_none(insert_data.get("RBC")),
                            empty_to_none(insert_data.get("WBC")),
                            empty_to_none(insert_data.get("Platelets")),
                            empty_to_none(insert_data.get("Parasite")),
                            empty_to_none(insert_data.get("Clinical_History")),
                            empty_to_none(insert_data.get("Specimen_Adequacy")),
                            empty_to_none(insert_data.get("Microscopic_Observations")),
                            empty_to_none(insert_data.get("Site")),
                            empty_to_none(insert_data.get("Gross")),
                            empty_to_none(insert_data.get("Stains_Used")),
                            empty_to_none(insert_data.get("Microscopic_Findings")),
                            empty_to_none(insert_data.get("HPE_Diagnosis")),
                            empty_to_none(insert_data.get("Disclaimer")),
                            empty_to_none(insert_data["Histo_Image"]),
                            datetime.now(),
                            empty_to_none(billing_invoice),
                            empty_to_none(patient_id),
                            empty_to_none(visit_id),
                            empty_to_none(insert_data["Test_Code"]),
                        ),
                    )

                
 
            else:
                
                if insert_data["Format"]=="PAP":
                    print("------Its-PAP-Insert------")
                    query = """INSERT INTO Cytology_Report (
                            Billing_Invoice,
                            Patient_Id,
                            Visit_Id,
                            CreatedBy,
                            Location,
                            Format,
                            Clinical_Details,
                            Specimen_Type,
                            Specimen_Adequacy,
                            Superficial_Cells,
                            Intermediate_Cells,
                            Deep_Parabasal_Cells,
                            Parabasal_Cells_1,
                            Metaplastic_squamous_Cells,
                            Endocervical_Cells,
                            Inflammatory_cells,
                            Squamous_metaplasia,
                            Keratotic_changes,
                            Tubal_metaplasia,
                            Atrophy_1,
                            Pregnancy_associated_changes,
                            Inflammation,
                            Atrophy_2,
                            Radiation,
                            IUCD,
                            Repai,
                            Glandular_cells_post_hysterectomy,
                            Inflammatory_changes,
                            Doderlein_bacilli,
                            Trichomonas_Vaginalis,
                            Fungal_Organisms,
                            Shift_in_flora_suggestive_of_bacterial_vaginosis,
                            Bacteria_morphologically_consistent_with_Actinomyces_spp,
                            Cellular_changes_consistent_with_Herpes_Simplex,
                            Cellular_changes_consistent_with_CMV,
                            SQUAMOUS_CELLS,
                            GLANDULAR_CELLS,
                            Endocervical_Cells_NOS,
                            Endometrial_Cells_NOS,
                            Glandular_Cells_NOS,
                            Endocervical_cells_favour_neoplastic,
                            Glandular_cells_favour_neoplastic,
                            Endocervical_Adenocarcinoma_In_Situ,
                            Endocervical,
                            Endometrial,
                            Extra_uterine,
                            NOS,
                            Note
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s, %s, %s, %s
                        );"""
                    cursor.execute(query, (
                        billing_invoice,
                        patient_id,
                        visit_id,
                        empty_to_none(insert_data["CreatedBy"]),
                        empty_to_none(insert_data["Location"]),
                        empty_to_none(insert_data["Format"]),
                        empty_to_none(insert_data.get("Clinical Details")),
                        empty_to_none(insert_data.get("Specimen Type")),
                        empty_to_none(insert_data.get("Specimen Adequacy")),
                        empty_to_none(insert_data.get("Superficial Cells")),
                        empty_to_none(insert_data.get("Intermediate Cells")),
                        empty_to_none(insert_data.get("Deep Parabasal Cells")),
                        empty_to_none(insert_data.get("Parabasal Cells")),
                        empty_to_none(insert_data.get("Metaplastic squamous Cells")),
                        empty_to_none(insert_data.get("Endocervical Cells")),
                        empty_to_none(insert_data.get("Inflammatory cells")),
                        empty_to_none(insert_data.get("Squamous metaplasia")),
                        empty_to_none(insert_data.get("Keratotic changes")),
                        empty_to_none(insert_data.get("Tubal metaplasia")),
                        empty_to_none(insert_data.get("Non Neoplastic-Atrophy")),
                        empty_to_none(insert_data.get("Pregnancy associated changes")),
                        empty_to_none(insert_data.get("Inflammation")),
                        empty_to_none(insert_data.get("Atrophy")),
                        empty_to_none(insert_data.get("Radiation")),
                        empty_to_none(insert_data.get("IUCD")),
                        empty_to_none(insert_data.get("Repai")),
                        empty_to_none(insert_data.get("Glandular cells post hysterectomy")),
                        empty_to_none(insert_data.get("Inflammatory changes")),
                        empty_to_none(insert_data.get("Doderlein bacilli")),
                        empty_to_none(insert_data.get("Trichomonas Vaginalis")),
                        empty_to_none(insert_data.get("Fungal Organisms")),
                        empty_to_none(insert_data.get("Shift in flora suggestive of bacterial vaginosis")),
                        empty_to_none(insert_data.get("Bacteria morphologically consistent with Actinomyces spp")),
                        empty_to_none(insert_data.get("Cellular changes consistent with Herpes Simplex")),
                        empty_to_none(insert_data.get("Cellular changes consistent with CMV")),
                        empty_to_none(insert_data.get("SQUAMOUS CELLS")),
                        empty_to_none(insert_data.get("GLANDULAR CELLS")),
                        empty_to_none(insert_data.get("Endocervical Cells (NOS)")),
                        empty_to_none(insert_data.get("Endometrial Cells (NOS)")),
                        empty_to_none(insert_data.get("Glandular Cells (NOS)")),
                        empty_to_none(insert_data.get("Endocervical cells favour neoplastic ")),
                        empty_to_none(insert_data.get("Glandular cells favour neoplastic ")),
                        empty_to_none(insert_data.get("Endocervical Adenocarcinoma In Situ")),
                        empty_to_none(insert_data.get("Endocervical")),
                        empty_to_none(insert_data.get("Endometrial")),
                        empty_to_none(insert_data.get("Extra uterine")),
                        empty_to_none(insert_data.get("NOS")),
                        empty_to_none(insert_data.get("Note")),
                    ))
                    print("----Insert-Ok-------")
              
                else:
                    # Insert new record if it doesn't exist
                    cursor.execute(
                        """
                        INSERT INTO histo_templates (Histo_Templates_Id, Billing_Invoice, Patient_Id, Visit_Id, Test_Code,
                                                    Format, Histo_Image, CreatedBy, Location,
                                                    Impression, Specimen, Microscopy, Note,
                                                    Cyto_No, Report_Status, Clinical_Data,
                                                    Clinical_Comment, Specimen_Category,
                                                    Gross_Findings, Diagnostic_Summary, Comments,
                                                    HPE_No, RBC, WBC, Platelets, Parasite,
                                                    Clinical_History, Specimen_Adequacy,
                                                    Microscopic_Observations, Site, Gross,
                                                    Stains_Used, Microscopic_Findings,HPE_Diagnosis,Disclaimer, CreatedAt, UpdatedAt)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s, %s)
                        """,
                        (
                            next_id,
                            billing_invoice,
                            patient_id,
                            visit_id,
                            empty_to_none(insert_data["Test_Code"]),
                            empty_to_none(insert_data["Format"]),
                            empty_to_none(insert_data["Histo_Image"]),
                            empty_to_none(insert_data["CreatedBy"]),
                            empty_to_none(insert_data["Location"]),
                            empty_to_none(insert_data["Impression"]),
                            empty_to_none(insert_data["Specimen"]),
                            empty_to_none(insert_data["Microscopy"]),
                            empty_to_none(insert_data["Note"]),
                            empty_to_none(insert_data.get("Cyto_No")),
                            empty_to_none(insert_data.get("Report_Status")),
                            empty_to_none(insert_data.get("Clinical_Data")),
                            empty_to_none(insert_data.get("Clinical_Comment")),
                            empty_to_none(insert_data.get("Specimen_Category")),
                            empty_to_none(insert_data.get("Gross_Findings")),
                            empty_to_none(insert_data.get("Diagnostic_Summary")),
                            empty_to_none(insert_data.get("Comments")),
                            empty_to_none(insert_data.get("HPE_No")),
                            empty_to_none(insert_data.get("RBC")),
                            empty_to_none(insert_data.get("WBC")),
                            empty_to_none(insert_data.get("Platelets")),
                            empty_to_none(insert_data.get("Parasite")),
                            empty_to_none(insert_data.get("Clinical_History")),
                            empty_to_none(insert_data.get("Specimen_Adequacy")),
                            empty_to_none(insert_data.get("Microscopic_Observations")),
                            empty_to_none(insert_data.get("Site")),
                            empty_to_none(insert_data.get("Gross")),
                            empty_to_none(insert_data.get("Stains_Used")),
                            empty_to_none(insert_data.get("Microscopic_Findings")),
                            empty_to_none(insert_data.get("HPE_Diagnosis")),
                            empty_to_none(insert_data.get("Disclaimer")),
                            datetime.now(),
                            datetime.now()
                        ),
                    )
    
            # Commit the changes
            db.commit()
 
        return JsonResponse(
            {"status": "success", "message": "Data inserted/updated successfully!"},
            status=200,
        )
 
    except Exception as e:
        print("Error:", e)
        db.rollback()
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
    finally:
        cursor.close()
        db.close()



import base64

def process_file(file1):
    if file1 is None or file1 == b'' or file1 == '':
        return None

    # Check if file1 is already a data URL (string starting with "data:")
    if isinstance(file1, str) and file1.startswith("data:"):
        return file1  # Return the data URL as-is if it's already formatted correctly

    # If file1 is raw bytes, determine the content type
    if isinstance(file1, bytes):
        file_signature = file1[:4]
        if file_signature.startswith(b"%PDF"):
            content_type = "application/pdf"
        elif file_signature.startswith(b"\xFF\xD8\xFF"):  # JPEG signature
            content_type = "image/jpeg"
        else:
            content_type = "application/octet-stream"
        
        # Encode the bytes to base64 and create a data URL
        base64_encoded = base64.b64encode(file1).decode("utf-8")
        return f"data:{content_type};base64,{base64_encoded}"

    return None  # Return None for invalid input
 
 
# def Get_Template(request):
#     # cursor = None
#     # db = None
#     try:
#         # Assuming db connection functions exist
        
#         cursor = db.cursor()
 
#         # Get the newFormat from the request
#         newFormat = request.GET.get("newFormat")
 
#         Billing_Invoice = request.GET.get("Billing_Invoice")
#         print("Billing_Invoice :", Billing_Invoice)
#         patient_id = request.GET.get("patient_id")
#         visitid = request.GET.get("visitid")
#         Test_Code = request.GET.get("Test_Code")
 
#         if Billing_Invoice and patient_id and visitid and Test_Code:
 
#             query = """SELECT * FROM histo_templates WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Test_Code=%s"""
#             cursor.execute(query, (Billing_Invoice, patient_id, visitid, Test_Code))
#             data = cursor.fetchone()
#             newFormat = data[7]
#         else:
 
#             query = "SELECT * FROM histo_templates WHERE Format=%s ORDER BY CreatedAt DESC LIMIT 1"
#             cursor.execute(query, (newFormat,))
#             data = cursor.fetchone()
 
#         print("newFormat :", newFormat)
#         print("data :", data)
 
#         format_columns = {
#             "peripheralSmear": [
#                 {"format": "peripheralSmear"},
#                 {"name": "RBC", "value": ""},
#                 {"name": "WBC", "value": ""},
#                 {"name": "Platelets", "value": ""},
#                 {"name": "Parasite", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Note", "value": ""},
#                 {"name": "Comments", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "lbc": [
#                 {"format": "lbc"},
#                 {"name": "Cyto_No", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Clinical_History", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Specimen_Adequacy", "value": ""},
#                 {"name": "Microscopic_Observations", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "biopsy": [
#                 {"format": "biopsy"},
#                 {"name": "HPE_No", "value": ""},
#                 {"name": "Report_Status", "value": ""},
#                 {"name": "Specimen_Category", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Clinical_Data", "value": ""},
#                 {"name": "Gross_Findings", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Diagnostic_Summary", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Clinical_Comment", "value": ""},
#                 {"name": "Note", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "fnac": [
#                 {"format": "fnac"},
#                 {"name": "Cyto_No", "value": ""},
#                 {"name": "Report_Status", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Site", "value": ""},
#                 {"name": "Clinical_Data", "value": ""},
#                 {"name": "Gross", "value": ""},
#                 {"name": "Stains_Used", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Clinical_Comment", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "FluidCytology": [
#                 {"format": "FluidCytology"},
#                 {"name": "Cyto_No", "value": ""},
#                 {"name": "Report_Status", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Site", "value": ""},
#                 {"name": "Clinical_Data", "value": ""},
#                 {"name": "Gross", "value": ""},
#                 {"name": "Stains_Used", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Clinical_Comment", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "histopathologySecondOpinion": [
#                 {"format": "histopathologySecondOpinion"},
#                 {"name": "HPE_No", "value": ""},
#                 {"name": "Report_Status", "value": ""},
#                 {"name": "Specimen_Category", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Clinical_Data", "value": ""},
#                 {"name": "Gross_Findings", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Diagnostic_Summary", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Clinical_Comment", "value": ""},
#                 {"name": "Note", "value": ""},
#                 {"name": "Comments", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "pathologyReport": [
#                 {"format": "pathologyReport"},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Gross_Findings", "value": ""},
#                 {"name": "Microscopic_Findings", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "imageData", "value": None},
#             ],
#             "Immunohistochemistry(IHC)": [
#                 {"format": "Immunohistochemistry(IHC)"},
#                 {"name": "Report_Status", "value": ""},
#                 {"name": "Specimen", "value": ""},
#                 {"name": "Clinical_Data", "value": ""},
#                 {"name": "HPE_Diagnosis", "value": ""},
#                 {"name": "Gross", "value": ""},
#                 {"name": "Microscopy", "value": ""},
#                 {"name": "Impression", "value": ""},
#                 {"name": "Disclaimer", "value": ""},
#                 {"name": "Comments", "value": None},
#             ],
#             "PAP": [
#                 {"format": "PAP"},
#                 {"name":"Clinical Details","value":""},
#                 {"name":"Specimen Type","value":""},
#                 {"name":"Specimen Adequacy","value":""},
#                 {"name":"Superficial Cells","value":""},
#                 {"name":"Intermediate Cells","value":""},
#                 {"name":"Deep Parabasal Cells","value":""},
#                 {"name":"Parabasal Cells","value":""},
#                 {"name":"Parabasal Cells","value":""},
#                 {"name":"Metaplastic squamous Cells","value":""},
#                 {"name":"Endocervical Cells","value":""},
#                 {"name":"Inflammatory cells","value":""},
#                 {"name":"Squamous metaplasia","value":""},
#                 {"name":"Keratotic changes","value":""},
#                 {"name":"Tubal metaplasia","value":""},
#                 {"name":"Atrophy","value":""},
#                 {"name":"Pregnancy associated changes","value":""},
#                 {"name":"Inflammation","value":""},
#                 {"name":"Atrophy","value":""},
#                 {"name":"Radiation","value":""},
#                 {"name":"IUCD","value":""},
#                 {"name":"Repai","value":""},
#                 {"name":"Glandular cells post hysterectomy","value":""},
#                 {"name":"Inflammatory changes","value":""},
#                 {"name":"Doderlein bacilli","value":""},
#                 {"name":"Trichomonas Vaginalis","value":""},
#                 {"name":"Fungal Organisms","value":""},
#                 {"name":"Shift in flora suggestive of bacterial vaginosis","value":""},
#                 {"name":"Bacteria morphologically consistent with Actinomyces spp","value":""},
#                 {"name":"Cellular changes consistent with Herpes Simplex","value":""},
#                 {"name":"Cellular changes consistent with CMV","value":""},
#                 {"name":"SQUAMOUS CELLS","value":""},
#                 {"name":"GLANDULAR CELLS","value":""},
#                 {"name":"Endocervical Cells (NOS)","value":""},
#                 {"name":"Endometrial Cells (NOS)","value":""},
#                 {"name":"Glandular Cells (NOS)","value":""},
#                 {"name":"Endocervical cells favour neoplastic ","value":""},
#                 {"name":"Glandular cells favour neoplastic ","value":""},
#                 {"name":"Endocervical Adenocarcinoma In Situ","value":""},
#                 {"name":"Endocervical","value":""},
#                 {"name":"Endometrial","value":""},
#                 {"name":"Extra uterine","value":""},
#                 {"name":"NOS","value":""},
#                 {"name":"Note","value":"Cervical cytology is a screening test and has associated with false negative and false positive results. Regular sampling and follow up is recommended."},
#             ],  
#             # "Histopathology Report HP": [
#             #     {"format": "Histopathology Report HP"},
#             #     {"name":"Clinical Diagnosis","value":""},
#             #     {"name":"Nature Of Specimen","value":""},
#             #     {"name":"Gross appearance","value":""},
#             #     {"name":"Microscopic appearance","value":""},
#             #     {"name":"Diagnosis","value":""},
#             #     {"name":"Disclaimer","value":"Slides and blocks will be stored for five years. Slides and blocks shall be given upon request to a reliable attender/ patient. Specimens will be stored for one month. The management does not commit for retrieval of specimens after this period. The clinical and demographic details as per requisition form."},
#             # ]
            
            
#         }
 
#         # Get the format based on newFormat
#         if newFormat in format_columns:
#             format_data = format_columns[newFormat]
#             print("format_data :", format_data)
#             if data:
#                 # Assuming data is a tuple-like object with the same order as your columns
#                 # Create a dictionary for easy access
#                 if Billing_Invoice and patient_id and visitid and Test_Code:
#                     data_dict = {
#                     "Histo_Templates_Id": data[0],
#                     "Billing_Invoice": data[1],
#                     "Patient_Id": data[2],
#                     "Visit_Id": data[3],
#                     "Captured_Organism": data[4],
#                     "CreatedBy": data[5],
#                     "Location": data[6],
#                     "Format": data[7],
#                     "Impression": data[8],
#                     "Specimen": data[9],
#                     "Microscopy": data[10],
#                     "Note": data[11],
#                     "Cyto_No": data[12],
#                     "Report_Status": data[13],
#                     "Clinical_Data": data[14],
#                     "Clinical_Comment": data[15],
#                     "Specimen_Category": data[16],
#                     "Gross_Findings": data[17],
#                     "Diagnostic_Summary": data[18],
#                     "Comments": data[19],
#                     "HPE_No": data[20],
#                     "RBC": data[21],
#                     "WBC": data[22],
#                     "Platelets": data[23],
#                     "Parasite": data[24],
#                     "Clinical_History": data[25],
#                     "Specimen_Adequacy": data[26],
#                     "Microscopic_Observations": data[27],
#                     "Site": data[28],
#                     "Gross": data[29],
#                     "Stains_Used": data[30],
#                     "Microscopic_Findings": data[31],
#                     "Histo_Image": data[32],
#                     "Test_Code": data[33],
#                     "HPE_Diagnosis": data[34],
#                     "Disclaimer":data[35]
#                 }
#                 else:
#                     data_dict = {
#                     "Histo_Templates_Id": "",
#                     "Billing_Invoice": "",
#                     "Patient_Id": "",
#                     "Visit_Id": "",
#                     "Captured_Organism": "" ,
#                     "CreatedBy": "",
#                     "Location": "",
#                     "Format": "",
#                     "Impression": "",
#                     "Specimen": "",
#                     "Microscopy": "",
#                     "Note": "",
#                     "Cyto_No": "",
#                     "Report_Status": "",
#                     "Clinical_Data": "",
#                     "Clinical_Comment": "",
#                     "Specimen_Category": "",
#                     "Gross_Findings": "",
#                     "Diagnostic_Summary": "",
#                     "Comments": "",
#                     "HPE_No": "",
#                     "RBC": "",
#                     "WBC": "",
#                     "Platelets": "",
#                     "Parasite": "",
#                     "Clinical_History": "",
#                     "Specimen_Adequacy": "",
#                     "Microscopic_Observations": "",
#                     "Site": "",
#                     "Gross": "",
#                     "Stains_Used": "",
#                     "Microscopic_Findings": "",
#                     "Histo_Image": None,
#                     "Test_Code": "",
#                     "HPE_Diagnosis": "",
#                     "Disclaimer":""
#                 }
 
#                 # Populate format_data with existing values
#                 for column in format_data:
#                     if "format" in column:
#                         continue  # Skip to the next iteration
 
#                     column_name = column["name"]
#                     if column_name in data_dict:
#                         column["value"] = data_dict[column_name]
 
#                     # Handle the image data
#                     if Billing_Invoice and patient_id and visitid and Test_Code:
 
#                         if column_name == "imageData" and data_dict["Histo_Image"]:
#                             # Assuming Histo_Image is base64 encoded, e.g., image/png
#                             image_data = data_dict["Histo_Image"]
                            
#                             print("image_data",image_data)
#                             column["value"] = image_data.decode("utf-8")
#                         #    f'data:image/jpg;base64,{base64.b64decode(base64.b64encode(image_data)).decode("utf-8")}'
#                             # process_file(image_data)
#                     else:
#                         if column_name == "imageData" and data_dict["Histo_Image"]:
#                             column["value"] = None
#                 # If no data found, values remain empty strings
#                 pass
 
#             # Return the selected format
#             print("format_data :", format_data)
#             return JsonResponse({"format": format_data}, status=200)
 
#     except Exception as e:
#         print("error", str(e))
#         return JsonResponse({"Error": str(e)}, status=500)
 
#     finally:
#         if cursor:
#             cursor.close()
#         if db:
#             db.close()

def Get_Template(request):
    # cursor = None
    # db = None
    try:
        # Assuming db connection functions exist
        
        cursor = db.cursor()
 
        # Get the newFormat from the request
        newFormat = request.GET.get("newFormat")
 
        Billing_Invoice = request.GET.get("Billing_Invoice")
        print("Billing_Invoice :", Billing_Invoice)
        patient_id = request.GET.get("patient_id")
        visitid = request.GET.get("visitid")
        Test_Code = request.GET.get("Test_Code")

        if Billing_Invoice and patient_id and visitid and Test_Code:
            print("------If-Error-------",Billing_Invoice, patient_id, visitid, Test_Code)
            query = """SELECT * FROM histo_templates WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Test_Code=%s"""
            cursor.execute(query, (Billing_Invoice, patient_id, visitid, Test_Code))
            data = cursor.fetchone()
            
            if data:
                newFormat = data[7]

            else:
                query = """SELECT * FROM Cytology_Report WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
                cursor.execute(query, (Billing_Invoice, patient_id, visitid,))
                data = cursor.fetchone()
                # print("-----DATA-----",data)
                newFormat = data[6]
        else:
            print("------Else-Error-------")
            query = "SELECT * FROM histo_templates WHERE Format=%s ORDER BY CreatedAt DESC LIMIT 1"
            cursor.execute(query, (newFormat,))
            data = cursor.fetchone()
 
        print("newFormat :", newFormat)
        print("data :", data)
 
        format_columns = {
            "peripheralSmear": [
                {"format": "peripheralSmear"},
                {"name": "RBC", "value": ""},
                {"name": "WBC", "value": ""},
                {"name": "Platelets", "value": ""},
                {"name": "Parasite", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Note", "value": ""},
                {"name": "Comments", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "lbc": [
                {"format": "lbc"},
                {"name": "Cyto_No", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Clinical_History", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Specimen_Adequacy", "value": ""},
                {"name": "Microscopic_Observations", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "biopsy": [
                {"format": "biopsy"},
                {"name": "HPE_No", "value": ""},
                {"name": "Report_Status", "value": ""},
                {"name": "Specimen_Category", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Clinical_Data", "value": ""},
                {"name": "Gross_Findings", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Diagnostic_Summary", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Clinical_Comment", "value": ""},
                {"name": "Note", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "fnac": [
                {"format": "fnac"},
                {"name": "Cyto_No", "value": ""},
                {"name": "Report_Status", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Site", "value": ""},
                {"name": "Clinical_Data", "value": ""},
                {"name": "Gross", "value": ""},
                {"name": "Stains_Used", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Clinical_Comment", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "Cytology": [
                {"format": "Cytology"},
                {"name": "Cyto_No", "value": ""},
                {"name": "Report_Status", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Site", "value": ""},
                {"name": "Clinical_Data", "value": ""},
                {"name": "Gross", "value": ""},
                {"name": "Stains_Used", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Clinical_Comment", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "histopathologySecondOpinion": [
                {"format": "histopathologySecondOpinion"},
                {"name": "HPE_No", "value": ""},
                {"name": "Report_Status", "value": ""},
                {"name": "Specimen_Category", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Clinical_Data", "value": ""},
                {"name": "Gross_Findings", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Diagnostic_Summary", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Clinical_Comment", "value": ""},
                {"name": "Note", "value": ""},
                {"name": "Comments", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "pathologyReport": [
                {"format": "pathologyReport"},
                {"name": "Specimen", "value": ""},
                {"name": "Gross_Findings", "value": ""},
                {"name": "Microscopic_Findings", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "imageData", "value": None},
            ],
            "Immunohistochemistry(IHC)": [
                {"format": "Immunohistochemistry(IHC)"},
                {"name": "Report_Status", "value": ""},
                {"name": "Specimen", "value": ""},
                {"name": "Clinical_Data", "value": ""},
                {"name": "HPE_Diagnosis", "value": ""},
                {"name": "Gross", "value": ""},
                {"name": "Microscopy", "value": ""},
                {"name": "Impression", "value": ""},
                {"name": "Disclaimer", "value": ""},
                {"name": "Comments", "value": None},
            ],
            "PAP": [
                {"format": "PAP"},
                {"name":"Clinical Details","value":""},
                {"name":"Specimen Type","value":""},
                {"name":"Specimen Adequacy","value":""},
                {"name":"Superficial Cells","value":""},
                {"name":"Intermediate Cells","value":""},
                {"name":"Deep Parabasal Cells","value":""},
                {"name":"Parabasal Cells","value":""},
                {"name":"Metaplastic squamous Cells","value":""},
                {"name":"Endocervical Cells","value":""},
                {"name":"Inflammatory cells","value":""},
                {"name":"Squamous metaplasia","value":""},
                {"name":"Keratotic changes","value":""},
                {"name":"Tubal metaplasia","value":""},
                {"name":"Non Neoplastic-Atrophy","value":""},
                {"name":"Pregnancy associated changes","value":""},
                {"name":"Inflammation","value":""},
                {"name":"Atrophy","value":""},
                {"name":"Radiation","value":""},
                {"name":"IUCD","value":""},
                {"name":"Repai","value":""},
                {"name":"Glandular cells post hysterectomy","value":""},
                {"name":"Inflammatory changes","value":""},
                {"name":"Doderlein bacilli","value":""},
                {"name":"Trichomonas Vaginalis","value":""},
                {"name":"Fungal Organisms","value":""},
                {"name":"Shift in flora suggestive of bacterial vaginosis","value":""},
                {"name":"Bacteria morphologically consistent with Actinomyces spp","value":""},
                {"name":"Cellular changes consistent with Herpes Simplex","value":""},
                {"name":"Cellular changes consistent with CMV","value":""},
                {"name":"SQUAMOUS CELLS","value":""},
                {"name":"GLANDULAR CELLS","value":""},
                {"name":"Endocervical Cells (NOS)","value":""},
                {"name":"Endometrial Cells (NOS)","value":""},
                {"name":"Glandular Cells (NOS)","value":""},
                {"name":"Endocervical cells favour neoplastic ","value":""},
                {"name":"Glandular cells favour neoplastic ","value":""},
                {"name":"Endocervical Adenocarcinoma In Situ","value":""},
                {"name":"Endocervical","value":""},
                {"name":"Endometrial","value":""},
                {"name":"Extra uterine","value":""},
                {"name":"NOS","value":""},
                {"name":"Note","value":"Cervical cytology is a screening test and has associated with false negative and false positive results. Regular sampling and follow up is recommended."},
            ],  
            # "Histopathology Report HP": [
            #     {"format": "Histopathology Report HP"},
            #     {"name":"Clinical Diagnosis","value":""},
            #     {"name":"Nature Of Specimen","value":""},
            #     {"name":"Gross appearance","value":""},
            #     {"name":"Microscopic appearance","value":""},
            #     {"name":"Diagnosis","value":""},
            #     {"name":"Disclaimer","value":"Slides and blocks will be stored for five years. Slides and blocks shall be given upon request to a reliable attender/ patient. Specimens will be stored for one month. The management does not commit for retrieval of specimens after this period. The clinical and demographic details as per requisition form."},
            # ]
            
            
        }
 
        # Get the format based on newFormat
        if newFormat in format_columns:
            format_data = format_columns[newFormat]
            # print("format_data :", format_data)
            if data:
                # Assuming data is a tuple-like object with the same order as your columns
                # Create a dictionary for easy access
                print("-----IF-----")
                if Billing_Invoice and patient_id and visitid and Test_Code:
                    if newFormat == "PAP":
                        data_dict = {
                        "Histo_Templates_Id": data[0],
                        "Billing_Invoice": data[1],
                        "Patient_Id": data[2],
                        "Visit_Id": data[3],
                        "CreatedBy": data[4],
                        "Location": data[5],
                        "Format": data[6],
                        "Clinical Details": data[7],
                        "Specimen Type": data[8],
                        "Specimen Adequacy": data[9],
                        "Superficial Cells": data[10],
                        "Intermediate Cells": data[11],
                        "Deep Parabasal Cells": data[12],
                        "Parabasal Cells": data[13],
                        "Metaplastic squamous Cells": data[15],
                        "Endocervical Cells": data[16],
                        "Inflammatory cells": data[17],
                        "Squamous metaplasia": data[18],
                        "Keratotic changes": data[19],
                        "Tubal metaplasia": data[20],
                        "Non Neoplastic-Atrophy": data[21],
                        "Pregnancy associated changes": data[22],
                        "Inflammation": data[23],
                        "Atrophy": data[24],
                        "Radiation": data[25],
                        "IUCD": data[26],
                        "Repai": data[27],
                        "Glandular cells post hysterectomy": data[28],
                        "Inflammatory changes": data[29],
                        "Doderlein bacilli": data[30],
                        "Trichomonas Vaginalis": data[31],
                        "Fungal Organisms": data[32],
                        "Shift in flora suggestive of bacterial vaginosis": data[33],
                        "Bacteria morphologically consistent with Actinomyces spp": data[34],
                        "Cellular changes consistent with Herpes Simplex": data[35],
                        "Cellular changes consistent with CMV": data[36],
                        "SQUAMOUS CELLS": data[37],
                        "GLANDULAR CELLS": data[38],
                        "Endocervical Cells (NOS)": data[39],
                        "Endometrial Cells (NOS)": data[40],
                        "Glandular Cells (NOS)": data[41],
                        "Endocervical cells favour neoplastic ": data[42],
                        "Glandular cells favour neoplastic ": data[43],
                        "Endocervical Adenocarcinoma In Situ": data[44],
                        "Endocervical": data[45],
                        "Endometrial": data[46],
                        "Extra uterine": data[47],
                        "NOS": data[48],
                        "Note": data[49],
                        }
                    else:
                            
                        data_dict = {               
                        "Histo_Templates_Id": data[0],
                        "Billing_Invoice": data[1],
                        "Patient_Id": data[2],
                        "Visit_Id": data[3],
                        "Captured_Organism": data[4],
                        "CreatedBy": data[5],
                        "Location": data[6],
                        "Format": data[7],
                        "Impression": data[8],
                        "Specimen": data[9],
                        "Microscopy": data[10],
                        "Note": data[11],
                        "Cyto_No": data[12],
                        "Report_Status": data[13],
                        "Clinical_Data": data[14],
                        "Clinical_Comment": data[15],
                        "Specimen_Category": data[16],
                        "Gross_Findings": data[17],
                        "Diagnostic_Summary": data[18],
                        "Comments": data[19],
                        "HPE_No": data[20],
                        "RBC": data[21],
                        "WBC": data[22],
                        "Platelets": data[23],
                        "Parasite": data[24],
                        "Clinical_History": data[25],
                        "Specimen_Adequacy": data[26],
                        "Microscopic_Observations": data[27],
                        "Site": data[28],
                        "Gross": data[29],
                        "Stains_Used": data[30],
                        "Microscopic_Findings": data[31],
                        "Histo_Image": data[32],
                        "Test_Code": data[33],
                        "HPE_Diagnosis": data[34],
                        "Disclaimer":data[35]
                    }
              
                else:
                    print("-----ELSE-----")
                    
                    if newFormat == "PAP":
                        data_dict = {
                        "Histo_Templates_Id": "",
                        "Billing_Invoice": "",
                        "Patient_Id": "",
                        "Visit_Id": "",
                        "CreatedBy": "",
                        "Location": "",
                        "Format": "",
                        "Clinical Details": "",
                        "Specimen Type": "",
                        "Specimen Adequacy": "",
                        "Superficial Cells": "",
                        "Intermediate Cells": "",
                        "Deep Parabasal Cells": "",
                        "Parabasal Cells": "",
                        "Metaplastic squamous Cells": "",
                        "Endocervical Cells": "",
                        "Inflammatory cells": "",
                        "Squamous metaplasia": "",
                        "Keratotic changes": "",
                        "Tubal metaplasia": "",
                        "Non Neoplastic-Atrophy": "",
                        "Pregnancy associated changes": "",
                        "Inflammation": "",
                        "Atrophy": "",
                        "Radiation": "",
                        "IUCD": "",
                        "Repai": "",
                        "Glandular cells post hysterectomy": "",
                        "Inflammatory changes": "",
                        "Doderlein bacilli": "",
                        "Trichomonas Vaginalis": "",
                        "Fungal Organisms": "",
                        "Shift in flora suggestive of bacterial vaginosis": "",
                        "Bacteria morphologically consistent with Actinomyces spp": "",
                        "Cellular changes consistent with Herpes Simplex": "",
                        "Cellular changes consistent with CMV": "",
                        "SQUAMOUS CELLS": "",
                        "GLANDULAR CELLS": "",
                        "Endocervical Cells (NOS)": "",
                        "Endometrial Cells (NOS)": "",
                        "Glandular Cells (NOS)": "",
                        "Endocervical cells favour neoplastic ": "",
                        "Glandular cells favour neoplastic ": "",
                        "Endocervical Adenocarcinoma In Situ": "",
                        "Endocervical": "",
                        "Endometrial": "",
                        "Extra uterine": "",
                        "NOS": "",
                        "Note": "",
                        }
                        
                    else:
                        data_dict = {
                        "Histo_Templates_Id": "",
                        "Billing_Invoice": "",
                        "Patient_Id": "",
                        "Visit_Id": "",
                        "Captured_Organism": "" ,
                        "CreatedBy": "",
                        "Location": "",
                        "Format": "",
                        "Impression": "",
                        "Specimen": "",
                        "Microscopy": "",
                        "Note": "",
                        "Cyto_No": "",
                        "Report_Status": "",
                        "Clinical_Data": "",
                        "Clinical_Comment": "",
                        "Specimen_Category": "",
                        "Gross_Findings": "",
                        "Diagnostic_Summary": "",
                        "Comments": "",
                        "HPE_No": "",
                        "RBC": "",
                        "WBC": "",
                        "Platelets": "",
                        "Parasite": "",
                        "Clinical_History": "",
                        "Specimen_Adequacy": "",
                        "Microscopic_Observations": "",
                        "Site": "",
                        "Gross": "",
                        "Stains_Used": "",
                        "Microscopic_Findings": "",
                        "Histo_Image": None,
                        "Test_Code": "",
                        "HPE_Diagnosis": "",
                        "Disclaimer":""
                    }
    
                # Populate format_data with existing values
                for column in format_data:
                    if "format" in column:
                        continue  # Skip to the next iteration
 
                    column_name = column["name"]
                    if column_name in data_dict:
                        column["value"] = data_dict[column_name]
 
                    # Handle the image data
                    if Billing_Invoice and patient_id and visitid and Test_Code:
 
                        if column_name == "imageData" and data_dict["Histo_Image"]:
                            # Assuming Histo_Image is base64 encoded, e.g., image/png
                            image_data = data_dict["Histo_Image"]
                            
                            print("image_data",image_data)
                            column["value"] = image_data.decode("utf-8")
                        #    f'data:image/jpg;base64,{base64.b64decode(base64.b64encode(image_data)).decode("utf-8")}'
                            # process_file(image_data)
                    else:
                        if column_name == "imageData" and data_dict["Histo_Image"]:
                            column["value"] = None
                # If no data found, values remain empty strings
                pass
 
            # Return the selected format
            print("format_data :", format_data)
            return JsonResponse({"format": format_data}, status=200)
 
    except Exception as e:
        print("error", str(e))
        return JsonResponse({"Error": str(e)}, status=500)
 
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()





# import base64
# from django.http import JsonResponse

# def get_for_preview_examinations(request):
#     try:
#         
#         cursor = db.cursor()

#         visit_id = request.GET.get('Visitid')
#         patient_id = request.GET.get('patientid')
#         invoice = request.GET.get('Billinginvoice')
#         result = []

#         cursor.execute("""
#             SELECT DISTINCT Test_Name, Test_Code
#             FROM Billing_Item_Table_for_lab
#             WHERE Billing_Invoice = %s 
#         """, [invoice])

#         test_names = cursor.fetchall()
#         if test_names:
#             for test_name_row in test_names:
#                 test_name = test_name_row[0]
#                 Test_Code = test_name_row[1]
                
#                 # Get department name
#                 deptquery = """SELECT Sub_Department FROM Test_Descriptions WHERE Test_Code=%s"""
#                 cursor.execute(deptquery, (Test_Code,))
#                 dept = cursor.fetchone()[0]

#                 # Get test details
#                 cursor.execute("""
#                     SELECT td.Method_Name, td.Test_Name, ap.EditContent, 
#                     td.Sub_Department, td.Specimen_Name, ap.Sample_Picture, td.Test_Code
#                     FROM Test_Descriptions as td
#                     INNER JOIN AnalyseInvestigationResult as ap ON ap.Test_Code = td.Test_Code  
#                     WHERE td.Test_Code = %s AND ap.Visit_Id = %s AND ap.Patient_Id = %s
#                 """, [Test_Code, visit_id, patient_id])
#                 test_details = cursor.fetchall()

#                 test_data = {
#                     'Group_Name': test_name,
#                     'Department': dept,
#                     'Tests': [],
#                     'Updated_At': {
#                         'Sample_Capture_in_Phelobotomist': "N/A",
#                         'AnalyseInvestigationSenior': "N/A",
#                         'Approve_Test_Pathologist': "N/A",
#                     }
#                 }

#                 for detail in test_details:
#                     photo_data = detail[5]
#                     if photo_data:
#                         photo_base64 = base64.b64encode(photo_data).decode("utf-8")
#                         sample = photo_base64
#                     else:
#                         sample = None

#                     test_data['Tests'].append({
#                         'Method_Name': detail[0],
#                         'Test_Name': detail[1],
#                         'EditContent': detail[2],
#                         'Department': detail[3],
#                         'Specimen': detail[4],
#                         'Samplepic': sample,
#                         'Test_Code': detail[6]
#                     })

#                 # Get updated timestamps
#                 cursor.execute("""
#                     SELECT Source, MAX(CreatedAt) 
#                     FROM (
#                         SELECT 'Sample_Capture_in_Phelobotomist' AS Source, CreatedAt 
#                         FROM Sample_Capture_in_Phelobotomist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'AnalyseInvestigationSenior' AS Source, CreatedAt 
#                         FROM AnalyseInvestigationSenior 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                         UNION ALL
#                         SELECT 'Approve_Test_Pathologist' AS Source, CreatedAt 
#                         FROM Approve_Test_Pathologist 
#                         WHERE Test_Code = %s AND Patient_Id = %s AND Billing_invoice = %s
#                     ) AS SubQuery
#                     GROUP BY Source
#                 """, [Test_Code, patient_id, invoice, Test_Code, patient_id, invoice, Test_Code, patient_id, invoice])

#                 updates = cursor.fetchall()
#                 for source, updated_at in updates:
#                     if updated_at is not None:
#                         test_data['Updated_At'][source] = updated_at.strftime("%Y-%m-%d %H:%M:%S")

#                 # Fetch data from histo_templates based on conditions
#                 print("")
#                 newFormat = None  # Initialize newFormat
#                 if invoice and patient_id and visit_id and Test_Code:
#                     query = "SELECT * FROM histo_templates WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Test_Code=%s"
#                     cursor.execute(query, (invoice, patient_id, visit_id, Test_Code))
#                     data = cursor.fetchone()
#                     print("hjadshjadshsj",data)
#                     if data:
#                         newFormat = data[7]  # Assuming format is at index 7

#                 # Format columns based on newFormat
#                 format_columns = {
#                     "peripheralSmear": [
#                         {"format": "peripheralSmear"},
#                         {"name": "RBC", "value": ""},
#                         {"name": "WBC", "value": ""},
#                         {"name": "Platelets", "value": ""},
#                         {"name": "Parasite", "value": ""},
#                         {"name": "Impression", "value": ""},
#                         {"name": "Note", "value": ""},
#                         {"name": "Comments", "value": ""},
#                         {"name": "imageData", "value": None},
#                     ],
#                     "lbc": [
#                         {"format": "lbc"},
#                         {"name": "Cyto_No", "value": ""},
#                         {"name": "Specimen", "value": ""},
#                         {"name": "Clinical_History", "value": ""},
#                         {"name": "Microscopy", "value": ""},
#                         {"name": "Specimen_Adequacy", "value": ""},
#                         {"name": "Microscopic_Observations", "value": ""},
#                         {"name": "Impression", "value": ""},
#                         {"name": "imageData", "value": None},
#                     ],
#                     "biopsy": [
#                         {"format": "biopsy"},
#                         {"name": "HPE_No", "value": ""},
#                         {"name": "Report_Status", "value": ""},
#                         {"name": "Specimen_Category", "value": ""},
#                         {"name": "Specimen", "value": ""},
#                         {"name": "Clinical_Data", "value": ""},
#                         {"name": "Gross_Findings", "value": ""},
#                         {"name": "Microscopy", "value": ""},
#                         {"name": "Diagnostic_Summary", "value": ""},
#                         {"name": "Impression", "value": ""},
#                         {"name": "Clinical_Comment", "value": ""},
#                         {"name": "Note", "value": ""},
#                         {"name": "imageData", "value": None},
#                     ],
#                     "fnac": [
#                         {"format": "fnac"},
#                         {"name": "Cyto_No", "value": ""},
#                         {"name": "Report_Status", "value": ""},
#                         {"name": "Specimen", "value": ""},
#                         {"name": "Site", "value": ""},
#                         {"name": "Clinical_Data", "value": ""},
#                         {"name": "Gross", "value": ""},
#                         {"name": "Stains_Used", "value": ""},
#                         {"name": "Microscopy", "value": ""},
#                         {"name": "Impression", "value": ""},
#                         {"name": "Clinical_Comment", "value": ""},
#                         {"name": "imageData", "value": None},
#                     ],
#                     "histopathologySecondOpinion": [
#                         {"format": "histopathologySecondOpinion"},
#                         {"name": "HPE_No", "value": ""},
#                         {"name": "Report_Status", "value": ""},
#                         {"name": "Specimen_Category", "value": ""},
#                         {"name": "Specimen", "value": ""},
#                         {"name": "Clinical_Data", "value": ""},
#                         {"name": "Gross_Findings", "value": ""},
#                         {"name": "Microscopy", "value": ""},
#                         {"name": "Diagnostic_Summary", "value": ""},
#                         {"name": "Impression", "value": ""},
#                         {"name": "Clinical_Comment", "value": ""},
#                         {"name": "Note", "value": ""},
#                         {"name": "Comments", "value": ""},
#                         {"name": "imageData", "value": None},
#                     ],
#                     "pathologyReport": [
#                         {"format": "pathologyReport"},
#                         {"name": "Specimen", "value": ""},
#                         {"name": "Gross_Findings", "value": ""},
#                         {"name": "Microscopic_Findings", "value": ""},
#                         {"name": "Impression", "value": ""},
#                         {"name": "imageData", "value": None},
#                     ],
#                 }

#                 if newFormat in format_columns:
#                     format_data = format_columns[newFormat]
#                     if data:
#                         # Create a dictionary for easy access
#                         data_dict = {
#                             "Histo_Templates_Id": data[0],
#                             "Billing_Invoice": data[1],
#                             "Patient_Id": data[2],
#                             "Visit_Id": data[3],
#                             "Captured_Organism": data[4],
#                             "CreatedBy": data[5],
#                             "Location": data[6],
#                             "Format": data[7],
#                             "Impression": data[8],
#                             "Specimen": data[9],
#                             "Microscopy": data[10],
#                             "Note": data[11],
#                             "Cyto_No": data[12],
#                             "Report_Status": data[13],
#                             "Clinical_Data": data[14],
#                             "Clinical_Comment": data[15],
#                             "Specimen_Category": data[16],
#                             "Gross_Findings": data[17],
#                             "Diagnostic_Summary": data[18],
#                             "Comments": data[19],
#                             "HPE_No": data[20],
#                             "RBC": data[21],
#                             "WBC": data[22],
#                             "Platelets": data[23],
#                             "Parasite": data[24],
#                             "Clinical_History": data[25],
#                             "Specimen_Adequacy": data[26],
#                             "Stains_Used": data[27],
#                             "Gross": data[28],
#                         }

#                         for entry in format_data:
#                             column_name = entry['name']  # Get the column name
#                             # Set value for imageData based on conditions
#                             if invoice and patient_id and visit_id and Test_Code:
#                                 if column_name == "imageData" and data_dict.get("Histo_Image"):
#                                     image_data = data_dict["Histo_Image"]
#                                     entry['value'] = process_file(image_data)
                                 
#                                 else:
#                                     entry['value'] = None
#                             else:
#                                 if column_name == "imageData" and data_dict.get("Histo_Image"):
#                                     entry['value'] = None

#                             # Set values for other entries
#                             if column_name in data_dict:
#                                 entry['value'] = data_dict[column_name]

#                     # Add formatted data to the test data
#                     test_data['Formatted_Data'] = format_data

#                 result.append(test_data)

#         return JsonResponse(result, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

#     finally:
#         cursor.close()
#         db.close()

@csrf_exempt
def culture_sencitivity_type_update(request):
    try:
        cursor = connection.cursor()
        data = json.loads(request.body)
        print('Received data:', data)  # Debug print

        invoice = data.get('invoice')
        visitid = data.get('visitid')
        cultureval = data.get('culturevalues')
        testdetailsupdate = data.get('testdetailstoupdate')


        deletedItems = data.get('deletedItems')

        if deletedItems:
            delete_ids = [item.get('Culture_Id') for item in deletedItems if item.get('Culture_Id')]
            
            if delete_ids:
                query = "DELETE FROM Complete_Culture_Examination WHERE Culture_Id IN %s"
                cursor.execute(query, (tuple(delete_ids),))

        # Extracting patient details from testdetailsupdate
        if not testdetailsupdate:
            return JsonResponse({"status": "error", "message": "Test details are missing"})

        patient_details = testdetailsupdate[0]
        Patient_id = patient_details.get('patient_id')
        patient_name = patient_details.get('Patient_Name')
        refering_doc = patient_details.get('createdby')
        location = patient_details.get('location')

        for entry in cultureval:
            cultureid = entry.get('Culture_Id')
            antibiotic = entry.get('antibiotic')
            new_sensitivetype = entry.get('Sensitivetype')
            organism = entry.get('Oraganism')
            testcode = entry.get('testcode')
            antibioticvalue = entry.get('Antibiotic_Value')
            sensitiverange = entry.get('sensitiverange')
            intermediaterange = entry.get('intermediaterange')
            resistantrange = entry.get('resistantrange')
            colonycount = entry.get('ColonyCount')

            print(f'Processing entry: antibiotic={antibiotic}, Sensitivetype={new_sensitivetype}, Oraganism={organism}, testcode={testcode}')

            if cultureid:
                # Update existing culture sensitivity
                query = """
                    UPDATE Complete_Culture_Examination
                    SET Sensitive_Type = %s, UpdatedAt = %s, Antibiotic_Value = %s,ColonyCount = %s,
                    sensitiverange =%s ,intermediaterange = %s ,resistantrange = %s
                    WHERE Billing_Invoice = %s 
                    AND Visit_Id = %s 
                    AND Antibiotic_Name = %s 
                    AND Captured_Oraganism = %s 
                    AND Test_Code = %s
                """
                values = (new_sensitivetype, datetime.now(), antibioticvalue,colonycount,sensitiverange,intermediaterange,resistantrange, invoice, visitid, antibiotic, organism, testcode)
                cursor.execute(query, values)
            else:
                # Insert new culture sensitivity
                cursor.execute("SELECT COALESCE(MAX(Culture_Id), 0) + 1 FROM Complete_Culture_Examination")
                next_id = cursor.fetchone()[0]

                insert_query_antibiotic = """
                    INSERT INTO Complete_Culture_Examination 
                    (Culture_Id, Billing_Invoice, Patient_Id, Patient_Name, Visit_Id, Refering_Doctor, Antibiotic_Name,
                    Sensitive_Type, CreatedBy, Captured_Oraganism, Location, Test_Code, UpdatedAt, CreatedAt, 
                    Antibiotic_Value, ColonyCount,sensitiverange,intermediaterange,resistantrange)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s)
                """
                cursor.execute(insert_query_antibiotic, (
                    next_id, invoice, Patient_id, patient_name, visitid, None,
                    antibiotic, new_sensitivetype, refering_doc, organism, location,
                    testcode, datetime.now(), datetime.now(), antibioticvalue, colonycount,
                    sensitiverange,intermediaterange,resistantrange
                ))

        # Updating test details if available
        if testdetailsupdate:
            for detail in testdetailsupdate:
                specimen = detail.get("Sample_Specimen")
                comment = detail.get("Notes")
                Microscopy_Data = detail.get("Microscopy_Data")
                site = detail.get("site")
                macroscopy = detail.get("macroscopy")
                micronumber = detail.get("micronumber")
                testcodes = detail.get("Test_Code")

                query = """
                    UPDATE AnalyseInvestigationResult
                    SET Sample_Specimen = %s, Notes = %s, Microscopy_Data = %s, site = %s,
                        macroscopy = %s, micronumber = %s
                    WHERE Billing_Invoice = %s 
                    AND Visit_Id = %s 
                    AND Test_Code = %s
                """
                values = (specimen, comment, Microscopy_Data, site, macroscopy, micronumber, invoice, visitid, testcodes)
                cursor.execute(query, values)

        connection.commit()
        return JsonResponse({"status": "success", "message": "Sensitivetype updated successfully"})

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Debug print
        if connection:
            connection.rollback()
        return JsonResponse({"status": "error", "message": str(e)})

    finally:
        if cursor:
            cursor.close()






@csrf_exempt
def update_microafter_flow_completed(request):
    try:
        
        cursor = db.cursor()

        # Parse the incoming request body
        data = json.loads(request.body)
        print('data:', data)  # Log the incoming data for debugging

        # Extract necessary fields from the request data
        invoice = data.get('invoice')
        culturereport = data.get('culturereport')
        Visit_Id = data.get('Visit_Id')
        notes = data.get('notes')
        patient_Id = data.get('patient_Id')
        Patient_Name = data.get('patientname')
        reportstatus = data.get('reportstatus')
        testcode = data.get('testcode')
        microscopy = data.get('microscopy')
        macroscopy = data.get('macroscopy')
        site = data.get('site')
        content =  data.get('content')
        bacteriaisolated = data.get('bacteriaisolated')
        Sample = data.get('Sample')
        CreatedBy = data.get('CreatedBy')
        location = data.get('Location')

        cultureval = data.get('culturevalues')
        deletedItems = data.get('deletedItems')
        

        print('content', content)

        if deletedItems:
            delete_ids = [item.get('Culture_Id') for item in deletedItems if item.get('Culture_Id')]
            
            if delete_ids:
                query = "DELETE FROM Complete_Culture_Examination WHERE Culture_Id IN %s"
                cursor.execute(query, (tuple(delete_ids),))

        # Construct the update query
        updatequery = """
            UPDATE Approve_Test_Pathologist 
            SET Notes = %s, Microscopy_Data = %s, Culture_Report = %s, Report_Status = %s, EditContent = %s, Bacteria_Isolated = %s,Sample_Specimen=%s, UpdatedAt = %s,macroscopy=%s,site = %s
            WHERE Billing_invoice = %s AND Visit_Id = %s AND Test_Code = %s AND Patient_Id = %s
        """

        # Execute the query with the provided parameters
        cursor.execute(
            updatequery, 
            (notes, microscopy, culturereport, reportstatus, content, bacteriaisolated,Sample,datetime.now(),macroscopy,site, invoice, Visit_Id, testcode, patient_Id)
        )
        updatequery = """
            UPDATE AnalyseInvestigationSenior 
            SET Notes = %s, Microscopy_Data = %s, Culture_Report = %s, Report_Status = %s, EditContent = %s, Bacteria_Isolated = %s,Sample_Specimen=%s, UpdatedAt = %s,macroscopy=%s,site = %s
            WHERE Billing_invoice = %s AND Visit_Id = %s AND Test_Code = %s AND Patient_Id = %s
        """

        # Execute the query with the provided parameters
        cursor.execute(
            updatequery, 
            (notes, microscopy, culturereport, reportstatus, content, bacteriaisolated,Sample,datetime.now(),macroscopy,site, invoice, Visit_Id, testcode, patient_Id)
        )
        updatequery = """
            UPDATE AnalyseInvestigationResult 
            SET Notes = %s, Microscopy_Data = %s, Culture_Report = %s, Report_Status = %s, EditContent = %s, Bacteria_Isolated = %s,Sample_Specimen=%s, UpdatedAt = %s,macroscopy=%s,site = %s
            WHERE Billing_invoice = %s AND Visit_Id = %s AND Test_Code = %s AND Patient_Id = %s
        """

        # Execute the query with the provided parameters
        cursor.execute(
            updatequery, 
            (notes, microscopy, culturereport, reportstatus, content, bacteriaisolated,Sample,datetime.now(),macroscopy,site, invoice, Visit_Id, testcode, patient_Id)
        )

        if cultureval:

            for entry in cultureval:
                cultureid = entry.get('Culture_Id')
                antibiotic = entry.get('antibiotic')
                new_sensitivetype = entry.get('Sensitivetype')
                organism = entry.get('Oraganism')
                testcode = entry.get('testcode')
                antibioticvalue = entry.get('Antibiotic_Value')
                Sensitive = entry.get('Sensitive')
                Intermediate = entry.get('Intermediate')
                Resistant = entry.get('Resistant')
                colonycount = entry.get('ColonyCount')

                print(f'Processing entry: antibiotic={antibiotic}, Sensitivetype={new_sensitivetype}, Oraganism={organism}, testcode={testcode}')

                if cultureid:
                    # Update existing culture sensitivity
                    query = """
                        UPDATE Complete_Culture_Examination
                        SET Sensitive_Type = %s, UpdatedAt = %s, Antibiotic_Value = %s,ColonyCount = %s,
                        sensitiverange =%s ,intermediaterange = %s ,resistantrange = %s
                        WHERE Billing_Invoice = %s 
                        AND Visit_Id = %s 
                        AND Antibiotic_Name = %s 
                        AND Captured_Oraganism = %s 
                        AND Test_Code = %s
                    """
                    values = (new_sensitivetype, datetime.now(), antibioticvalue,colonycount,Sensitive,Intermediate,Resistant,
                    invoice, Visit_Id, antibiotic, organism, testcode,)
                    cursor.execute(query, values)
                else:
                    # Insert new culture sensitivity
                    cursor.execute("SELECT COALESCE(MAX(Culture_Id), 0) + 1 FROM Complete_Culture_Examination")
                    next_id = cursor.fetchone()[0]

                    insert_query_antibiotic = """
                        INSERT INTO Complete_Culture_Examination 
                        (Culture_Id, Billing_Invoice, Patient_Id, Patient_Name, Visit_Id, Refering_Doctor, Antibiotic_Name,
                        Sensitive_Type, CreatedBy, Captured_Oraganism, Location, Test_Code, UpdatedAt, CreatedAt, 
                        Antibiotic_Value, ColonyCount,sensitiverange,intermediaterange,resistantrange)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s)
                    """
                    cursor.execute(insert_query_antibiotic, (
                        next_id, invoice, patient_Id, Patient_Name, Visit_Id, None,
                        antibiotic, new_sensitivetype, CreatedBy, organism, location,
                        testcode, datetime.now(), datetime.now(), antibioticvalue, colonycount,
                        Sensitive,Intermediate,Resistant
                    ))


        # Commit the transaction
        db.commit()

        # Return a success response
        return JsonResponse({"Success": "Updated successfully"})

    except Exception as e:
        # Log and return the error message in case of an exception
        return JsonResponse({"Error": str(e)})

    finally:
        # Ensure the cursor and database connection are closed properly
        if cursor:
            cursor.close()
        if db:
            db.close()
            
               

@csrf_exempt
def update_Histo_Template(request):
    try:
        
        cursor = db.cursor()

        # Get the data from the request
        data = json.loads(request.body)
        print("data:", data)

        # Extract histoformatdata from request as a list
        histoformatdata_list = data.get("histoformatdata", [])

        # Initialize the dictionary and process each item
        histoformatdata = {}
        for item in histoformatdata_list:
            if isinstance(item, dict):
                # Handle the 'format' key separately if present
                if 'format' in item:
                    histoformatdata['format'] = item['format']
                elif 'name' in item and 'value' in item:
                    histoformatdata[item['name']] = item['value']
        
        print("Processed histoformatdata:", histoformatdata)

        # Extract other necessary fields from the request
        billing_invoice = data.get("invoice", None)
        patient_id = data.get("patient_Id", None)
        visit_id = data.get("Visit_Id", None)
        testcode = data.get("testcode", None)

        # Update the database with the extracted data
        cursor.execute(
            """
            UPDATE histo_templates
            SET Format = %s,
                Impression = %s, Specimen = %s, Microscopy = %s, Note = %s,
                Cyto_No = %s, Report_Status = %s, Clinical_Data = %s,
                Clinical_Comment = %s, Specimen_Category = %s,
                Gross_Findings = %s, Diagnostic_Summary = %s, Comments = %s,
                HPE_No = %s, RBC = %s, WBC = %s, Platelets = %s,
                Parasite = %s, Clinical_History = %s, Specimen_Adequacy = %s,
                Microscopic_Observations = %s, Site = %s, Gross = %s,
                Stains_Used = %s, Microscopic_Findings = %s, HPE_Diagnosis = %s
            WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s AND Test_Code = %s
            """,
            (
                histoformatdata.get("format", None),
                histoformatdata.get("Impression", None),
                histoformatdata.get("Specimen", None),
                histoformatdata.get("Microscopy", None),
                histoformatdata.get("Note", None),
                histoformatdata.get("Cyto_No", None),
                histoformatdata.get("Report_Status", None),
                histoformatdata.get("Clinical_Data", None),
                histoformatdata.get("Clinical_Comment", None),
                histoformatdata.get("Specimen_Category", None),
                histoformatdata.get("Gross_Findings", None),
                histoformatdata.get("Diagnostic_Summary", None),
                histoformatdata.get("Comments", None),
                histoformatdata.get("HPE_No", None),
                histoformatdata.get("RBC", None),
                histoformatdata.get("WBC", None),
                histoformatdata.get("Platelets", None),
                histoformatdata.get("Parasite", None),
                histoformatdata.get("Clinical_History", None),
                histoformatdata.get("Specimen_Adequacy", None),
                histoformatdata.get("Microscopic_Observations", None),
                histoformatdata.get("Site", None),
                histoformatdata.get("Gross", None),
                histoformatdata.get("Stains_Used", None),
                histoformatdata.get("Microscopic_Findings", None),
                histoformatdata.get("HPE_Diagnosis", None),
                billing_invoice,
                patient_id,
                visit_id,
                testcode,
            ),
        )

        # Commit the changes
        db.commit()

        return JsonResponse(
            {"status": "success", "message": "Data inserted/updated successfully!"},
            status=200,
        )

    except Exception as e:
        print("Error:", e)
        db.rollback()
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
    
    finally:
        cursor.close()
        db.close()

def get_for_culture_report_dispatc(request):
    if request.method == 'GET':
        try:
            invoice = request.GET.get('Billinginvoice')
            visitid = request.GET.get('Visitid')
            testcode = request.GET.get('testcode')
            status = 'Completed'
            datasend = []

            with connection.cursor() as cursor:
                # Step 1: Get all completed test names for the invoice
                cursor.execute("""
                    SELECT Test_Name 
                    FROM Billing_Item_Table_for_lab 
                    WHERE Billing_Invoice=%s AND Service_Status='Completed' AND Analysis_Status='Completed'
                """, [invoice, ])
                tests = cursor.fetchall()
                test_names = [test[0] for test in tests]

                if not test_names:
                    return JsonResponse({"Error": "No completed tests found for the given invoice."}, safe=False)

                print("test--------",test_names)
                # Step 2: Filter only those which are culture tests
                cursor.execute("""
                    SELECT Test_Name 
                    FROM Test_Descriptions 
                    WHERE Test_Name IN %s AND Culturetest='Yes'
                """, [tuple(test_names)])
                culture_tests = [row[0] for row in cursor.fetchall()]

                if not culture_tests:
                    return JsonResponse({"Error": "No culture tests found in the specified invoice."}, safe=False)

                # Step 3: Fetch culture report details
                cursor.execute("""
                    SELECT Culture_Id, Antibiotic_Name, Sensitive_Type, Captured_Oraganism, 
                           Test_Code, Antibiotic_Value, ColonyCount, sensitiverange, 
                           intermediaterange, resistantrange
                    FROM Complete_Culture_Examination 
                    WHERE Billing_Invoice=%s AND Visit_Id=%s AND Test_Code=%s
                """, [invoice, visitid, testcode])
                results = cursor.fetchall()
                columns = [col[0] for col in cursor.description]

                if not results:
                    return JsonResponse({"Error": "No culture examination data found."}, safe=False)

                # Step 4: Format the results into JSON
                for row in results:
                    row_data = dict(zip(columns, row))
                    datasend.append({
                        'Culture_Id': row_data["Culture_Id"],
                        'antibiotic': row_data["Antibiotic_Name"],
                        'Sensitivetype': row_data["Sensitive_Type"],
                        'Oraganism': row_data["Captured_Oraganism"],
                        'testcode': row_data["Test_Code"],
                        'Antibiotic_Value': row_data["Antibiotic_Value"],
                        'ColonyCount': row_data["ColonyCount"],
                        'Sensitive': row_data["sensitiverange"],
                        'Intermediate': row_data["intermediaterange"],
                        'Resistant': row_data["resistantrange"],
                    })

            return JsonResponse(datasend, safe=False)

        except Exception as e:
            return JsonResponse({'Error': str(e)}, status=500)

# @csrf_exempt
# def update_senior_edit_content(request):
#     if request.method == 'POST':
#         try:
#             cursor = db.cursor()
#             data = json.loads(request.body)

#             content = data.get('content')
#             testcode = data.get('testcode')
#             billinginvoice = data.get('billinginvoice')
#             seniortech = data.get('seniortech')
#             pathologist = data.get('pathologist')

#             if not content or not testcode or not billinginvoice:
#                 return JsonResponse({'error': 'Missing required data'}, status=400)

#             encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8')

#             # Perform the update operation here
#             # For example:
#             if seniortech:

                
#                 update_query = """
#                     update AnalyseInvestigationResult
#                     set EditContent = %s
#                     WHERE Billing_invoice=%s AND Test_Code=%s
#                     """
#                 cursor.execute(update_query, ( encoded_html,billinginvoice,testcode))
#             elif pathologist:

                
#                 update_query = """
#                     update AnalyseInvestigationSenior
#                     set EditContent = %s
#                     WHERE Billing_invoice=%s AND Test_Code=%s
#                     """
#                 cursor.execute(update_query, ( encoded_html,billinginvoice,testcode))
#             else:

                
#                 update_query = """
#                     update Approve_Test_Pathologist
#                     set EditContent = %s
#                     WHERE Billing_invoice=%s AND Test_Code=%s
#                     """
#                 cursor.execute(update_query, ( encoded_html,billinginvoice,testcode))


#             return JsonResponse({'success': 'Document updated successfully'})

#         except Exception as e:
#             print(f"Update Error: {str(e)}")
#             return JsonResponse({'error': f'Error updating document: {str(e)}'}, status=400)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)




@csrf_exempt
def update_senior_edit_content(request):
    if request.method == 'POST':
        try:
            cursor = db.cursor()
            data = json.loads(request.body)

            content = data.get('content')
            testcode = data.get('testcode')
            billinginvoice = data.get('billinginvoice')
            seniortech = data.get('seniortech')
            pathologist = data.get('pathologist')

            if not content or not testcode or not billinginvoice:
                return JsonResponse({'error': 'Missing required data'}, status=400)

            # Encode content to base64
            encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8')

            # Check existing records
            cursor.execute(
                "SELECT COUNT(*) FROM AnalyseInvestigationResult WHERE Billing_invoice=%s AND Test_Code=%s",
                (billinginvoice, testcode),
            )
            sr = cursor.fetchone()[0]

            cursor.execute(
                "SELECT COUNT(*) FROM AnalyseInvestigationSenior WHERE Billing_invoice=%s AND Test_Code=%s",
                (billinginvoice, testcode),
            )
            pt = cursor.fetchone()[0]
            
            cursor.execute(
                "SELECT COUNT(*) FROM Approve_Test_Pathologist WHERE Billing_invoice=%s AND Test_Code=%s",
                (billinginvoice, testcode),
            )
            ot = cursor.fetchone()[0]



            if seniortech or sr > 0:
                print("tech")
                update_query = """
                    UPDATE AnalyseInvestigationResult
                    SET EditContent = %s
                    WHERE Billing_invoice=%s AND Test_Code=%s
                """
                cursor.execute(update_query, (encoded_html, billinginvoice, testcode))

            if pathologist or pt > 0:
                print("Sr tech")
                update_query = """
                    UPDATE AnalyseInvestigationSenior
                    SET EditContent = %s
                    WHERE Billing_invoice=%s AND Test_Code=%s
                """
                cursor.execute(update_query, (encoded_html, billinginvoice, testcode))
            if ot > 0:
                print("Pathology")
                update_query = """
                    UPDATE Approve_Test_Pathologist
                    SET EditContent = %s
                    WHERE Billing_invoice=%s AND Test_Code=%s
                """
                cursor.execute(update_query, (encoded_html, billinginvoice, testcode))

                isEdit = """UPDATE Billing_invoice_and_bill_amount 
                            SET isEdit = %s
                            WHERE Billing_Invoice = %s """
                cursor.execute(isEdit, (True, billinginvoice))


            # Commit changes
            db.commit()

            return JsonResponse({'success': 'Document updated successfully'})

        except Exception as e:
            print(f"Update Error: {str(e)}")
            return JsonResponse({'error': f'Error updating document: {str(e)}'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def get_for_due_reports(request):
    if request.method == 'GET':
        try:
            cursor = db.cursor()
            Invoice = request.GET.get('Billing_Invoice')
            print("Invoice--------",Invoice)

            if Invoice.startswith("OP"):
                status = "Due"
            else:
                status = "Pending"
            print("status-----",status)
            query = """
                SELECT * FROM Billing_invoice_and_bill_amount
                WHERE Billing_Invoice = %s AND Status = %s;
            """
            cursor.execute(query, (Invoice, status, ))
            rows = cursor.fetchall()
            print("Row--------",rows)
            if rows:
                return JsonResponse({
                    "status": "Pending",
                    "message": "Bill Payment is Pending...",
                }, status=200)
            else:
                return JsonResponse({
                    "status": "paid",
                    "message": "Bill is cleared.",
                }, status=200)

        except Exception as er:
            print(f"Error: {er}")
            return JsonResponse({"status": "error", "message": str(er)}, status=500)
        finally:
            if cursor: cursor.close()
            if db: db.close()


def get_pathologist(data):
    try:
        with connection.cursor() as cursor:
            
            invoice = data.get('Billinginvoice')
            visitid = data.get('Visitid')
            patient_id = data.get('Patientid')
            location = data.get('Location', 'ALL')
            created = data.get('created')
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            department_codes = data.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
            status = 'Completed'

            # Convert department codes to department names
            department_names = []
            if department_codes:
                department_codes_list = department_codes.split(',')
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
                    return print( "No valid department codes found.")
            else:
                return print("Department parameter is required.")

            # ── OPTIMISED sql_testname: added Culturetest, simplified to direct JOIN ──
            sql_testname = """
                SELECT bit.Test_Name, bit.Test_Code, bit.IsSubTest, bit.SubTestCodes,
                       bit.Transfer_Location, bit.PackageName, bit.Group_Name,
                       td.Culturetest
                FROM Billing_Item_Table_for_lab bit
                JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
                JOIN SubLab_Department_Detials sld ON td.sub_department_id = sld.SubDepartment_Code
                WHERE bit.Billing_Invoice = %s
                  AND bit.Service_Status = %s
                  AND bit.Analysis_Status = 'Completed'
                  AND bit.Verify_Status = 'Completed'
                  AND bit.Approve_Status != 'Completed'
                  AND (
                      (bit.Transfer_Location = %s)
                      OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                  )
                  AND sld.SubDepartment_Name IN %s
            """
            cursor.execute(sql_testname, (invoice, status, location, location, tuple(department_names)))
            tests = cursor.fetchall()

            if not tests:
                return print("No tests found for the given invoice, status, and departments.")


            # ──────────────────────────────────────────────────────────────────
            # OPTIMISED get_pathologist
            # FIX 1: Added Culturetest to main SELECT (eliminates 1 query per test).
            # FIX 2: Replaced 3-way LEFT JOIN with direct JOIN (faster, cleaner).
            # FIX 3: Age + AgeRange queries moved OUT of per-test loop — batched.
            # FIX 4: Culture and normal results fetched in 2 batch queries.
            # Before: 1 + (3-4 × N) queries.  After: 5 queries total.
            # ──────────────────────────────────────────────────────────────────

            # Fetch patient age once (was fetched once per normal test in loop)
            cursor.execute("SELECT Age FROM Register_patient_Details WHERE Patient_Id = %s", (patient_id,))
            age_row = cursor.fetchone()
            patient_age = int(age_row[0]) if age_row and age_row[0] else None

            # Split tests into culture vs normal (Culturetest already in column 7)
            culture_codes = [t[1] for t in tests if (t[7] or 'No') == 'Yes']
            normal_codes  = [t[1] for t in tests if (t[7] or 'No') != 'Yes']
            test_meta = {
                t[1]: {
                    'is_subtest': t[2], 'subtest_codes': t[3],
                    'transfer': t[4], 'package_name': t[5], 'group_name': t[6],
                }
                for t in tests
            }

            # Batch: age ranges for all normal test codes at once
            age_range_map = {}
            if normal_codes and patient_age is not None:
                cursor.execute("""
                    SELECT Test_Code_id, From_Value, To_Value
                    FROM Age_Setup_Master
                    WHERE Test_Code_id IN %s AND FromAge <= %s AND ToAge >= %s
                """, (tuple(normal_codes), patient_age, patient_age))
                for r in cursor.fetchall():
                    age_range_map[r[0]] = (r[1], r[2])

            details_list = []

            # Batch A: all culture tests
            if culture_codes:
                cursor.execute("""
                    SELECT Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id,
                           Sample_Specimen, Method, Colony_Count, Capture_Organism,
                           Status, Department, Test_Code, Notes, Microscopy_Data,
                           Culture_Report, Report_Type, EditContent, Report_Status,
                           micronumber, histonumber, Bacteria_Isolated, site, macroscopy,
                           srfId, icmrId, specimenCondition, covidType, covidResult, labtechnician
                    FROM AnalyseInvestigationSenior
                    WHERE Billing_invoice = %s AND Visit_Id = %s AND Test_Code IN %s
                """, (invoice, visitid, tuple(culture_codes)))
                for record in cursor.fetchall():
                    meta = test_meta.get(record[11], {})
                    test_details = {
                        'Analyse_Id': record[0], 'testname': record[1],
                        'Billing_Invoice': record[2], 'Patient_Name': record[3],
                        'visitid': record[4], 'Sample_Specimen': record[5],
                        'Method': record[6], 'Colony_Count': record[7],
                        'Capture_Oragnism': record[8], 'Status': record[9],
                        'Culturetest': 'Yes', 'Department': record[10],
                        'Test_Code': record[11], 'Notes': record[12],
                        'Microscopy_Data': record[13], 'Culture_Report': record[14],
                        'Report_Type': record[15], 'Content': record[16],
                        'Report_Status': record[17], 'micronumber': record[18],
                        'histonumber': record[19], 'Bacteria_Isolated': record[20],
                        'site': record[21], 'macroscopy': record[22],
                        'transferlocation': meta.get('transfer'),
                        'IsSubTest': meta.get('is_subtest'),
                        'SubTestCodes': meta.get('subtest_codes'),
                        'PackageName': meta.get('package_name'),
                        'Group_Name': meta.get('group_name'),
                        'srfId': record[23], 'icmrId': record[24],
                        'condition': record[25], 'testType': record[26],
                        'covidTest': record[27], 'labtechnician': record[28],
                        'patient_id': patient_id, 'location': location,
                        'createdby': created,
                    }
                    if test_details['Report_Type'] == '':
                        details_list.append(test_details)

            # Batch B: all normal tests
            if normal_codes:
                cursor.execute("""
                    SELECT ais.Sl_No, ais.Test, ais.Billing_invoice, ais.Patent_Name,
                           ais.Visit_Id, ais.Sample_Specimen, ais.Method, ais.Capture_Value,
                           ais.Panic_Low, ais.Panic_High, ais.Medical_Remark, ais.Technical_Remark,
                           ais.Status, ais.UpdatedAt, ais.CreatedAt, ais.EditContent,
                           ais.Department, ais.Reference, ais.Reference_Range, ais.Test_Code,
                           ais.Input_Type, ais.Result, td.Iscutoffvalue, ais.srfId, ais.icmrId,
                           ais.specimenCondition, ais.covidType, ais.covidResult, ais.uom,
                           ais.Previous_Value, ais.labtechnician, ais.pathologyremarks,
                           ais.pathologyyesorno, ais.abstinence
                    FROM AnalyseInvestigationSenior ais
                    INNER JOIN Test_Descriptions td ON td.Test_Code = ais.Test_Code
                    WHERE ais.Billing_invoice = %s AND ais.Visit_Id = %s AND ais.Test_Code IN %s
                """, (invoice, visitid, tuple(normal_codes)))
                for record in cursor.fetchall():
                    meta = test_meta.get(record[19], {})
                    test_details = {
                        'Analyse_Id': record[0], 'testname': record[1],
                        'Billing_Invoice': record[2], 'Patient_Name': record[3],
                        'visitid': record[4], 'Sample_Specimen': record[5],
                        'Method': record[6], 'Capture_Value': record[7],
                        'Panic_Low': record[8], 'Panic_High': record[9],
                        'Medical_Remark': record[10], 'Technical_Remark': record[11],
                        'Status': record[12],
                        'UpdatedAt': record[13].strftime('%Y-%m-%d %H:%M:%S') if record[13] else None,
                        'CreatedAt': record[14].strftime('%Y-%m-%d %H:%M:%S') if record[14] else None,
                        'Content': record[15], 'Department': record[16],
                        'Reference': record[17], 'referencedata': record[18],
                        'Test_Code': record[19], 'Input_Type': record[20],
                        'Result': record[21], 'Iscutoffvalue': record[22],
                        'IsSubTest': meta.get('is_subtest'),
                        'SubTestCodes': meta.get('subtest_codes'),
                        'transferlocation': meta.get('transfer'),
                        'srfId': record[23], 'icmrId': record[24],
                        'condition': record[25], 'testType': record[26],
                        'covidTest': record[27], 'uom': record[28],
                        'PackageName': meta.get('package_name'),
                        'Group_Name': meta.get('group_name'),
                        'Previous_Value': record[29], 'labtechnician': record[30],
                        'pathologyremarks': record[31], 'pathologyyesorno': record[32],
                        'abstinence': record[33],
                        'patient_id': patient_id, 'location': location,
                        'createdby': created,
                        'Culturetest': 'No',
                    }
                    # Apply age range filter (O(1) lookup — no extra query)
                    age_range = age_range_map.get(record[19])
                    cap_val = test_details.get('Capture_Value')
                    if age_range and cap_val is not None:
                        try:
                            if float(age_range[0]) <= float(cap_val) <= float(age_range[1]):
                                details_list.append(test_details)
                        except (ValueError, TypeError):
                            details_list.append(test_details)
                    else:
                        details_list.append(test_details)

            print("------End-----", len(details_list))
            return details_list
    except Exception as er:
        print('Error:', str(er))
        return str(er)

def insert_pathologist(datas,cursor):
    try:
        for data in datas:
            status = 'Approved' if data.get('status') == 'Approved' else 'Retest'
            billing_invoice = data.get('Billing_Invoice')
            test = data.get('testname')
            patient_id = data.get('patient_id')
            Test_Code = data.get('Test_Code')
            Notes = data.get('Notes') or ''
            Report_Type = data.get('Report_Type') or ''
            Microscopy_Data = data.get('Microscopy_Data') or ''
            site = data.get('site') or ''
            macroscopy = data.get('macroscopy') or ''
            Culture_Report = data.get('Culture_Report') or ''
            Report_Status = data.get('Report_Status') or ''
            Bacteria_Isolated = data.get('Bacteria_Isolated') or ''
            IsSubTest = data.get("IsSubTest")
            SubTestCodes = data.get("SubTestCodes")
            transferlocation = data.get("transferlocation")
            srfId = data.get("srfId")
            icmrId = data.get("icmrId")
            specimenCondition = data.get("condition")
            covidType = data.get("testType")
            labtechnician = data.get("labtechnician")
            doctorid = data.get("doctorid")
            covidResult = data.get("covidTest")
            pathologyremarks = data.get("pathologyremarks") or ''
            pathologyyesorno = data.get("pathologyyesorno") or ''
            abstinence = data.get("abstinence") or ''
            content = data.get('Content')
            encoded_html = base64.b64encode(content.encode('utf-8')).decode('utf-8') if content else None
 
            print("IsSubTest:", IsSubTest)
            print("SubTestCodes:", SubTestCodes)
 
            if not all([billing_invoice, test, Test_Code]):
                return print("Missing billing invoice, test name, or test code")
 
            cursor.execute("""
                SELECT COUNT(*)
                FROM Approve_Test_Pathologist
                WHERE Patient_Id = %s AND Billing_invoice = %s AND Test_Code = %s
            """, (patient_id, billing_invoice, Test_Code))
            count = cursor.fetchone()[0]
            print('count:', count)
           
            # status = 'Retest' if count > 0 else ('Verified' if data.get('status') == 'Verified' else 'Retest')
            if count > 0:
                sql = """
                    UPDATE Approve_Test_Pathologist
                    SET
                        Capture_Value=%s,Status =%s ,EditContent = %s,Previous_Value =%s
                    WHERE Billing_invoice=%s AND Test_Code=%s
                """
                cursor.execute(sql,( data.get('Capture_Value'),data.get('status'),encoded_html,data.get('Previous_Value'),billing_invoice,Test_Code))
            else:
 
                # Generate new Sl_No
                cursor.execute("SELECT MAX(Sl_No) FROM Approve_Test_Pathologist")
                max_id_result = cursor.fetchone()
                next_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1
 
                # Insert into Approve_Test_Pathologist
                cursor.execute("""
                    INSERT INTO Approve_Test_Pathologist (
                        Sl_No, Test, Billing_invoice, Patent_Name, Visit_Id, Sample_Specimen, Method, Capture_Value,
                        Panic_Low, Panic_High, Medical_Remark, Technical_Remark, Status, Patient_Id, Colony_Count,
                        Capture_Organism, Location, CreatedBy, Reference, Reference_Range, Test_Code, Notes,
                        Microscopy_Data, Culture_Report, Report_Type, EditContent, Report_Status, micronumber,
                        histonumber, Bacteria_Isolated, IsSubTest, SubTestCodes, Transfer_Location, UpdatedAt,CreatedAt,
                        macroscopy,site,Result, srfId, icmrId, specimenCondition, covidType,covidResult,Previous_Value,
                        labtechnician,DoctorID,pathologyremarks,pathologyyesorno,abstinence
                    )
 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s,%s, %s, %s,%s, %s,%s,%s,%s,%s,%s,%s,%s)
                """, [
                    next_id, test, billing_invoice, data.get('Patient_Name'), data.get('visitid'),
                    data.get('Sample_Specimen', 'N/A'), data.get('Method', 'N/A'), data.get('Capture_Value') or None,
                    data.get('paniclow', 'N/A'), data.get('panichigh', 'N/A'), data.get('Medical_Remark', ''),
                    data.get('Technical_Remark', ''), status, patient_id, data.get('colony_count') or '',
                    data.get('Capture_Oragnism'), data.get('location'), data.get('createdby'),
                    data.get('reference') or None, data.get('referencedata') or None, Test_Code, Notes, Microscopy_Data,
                    Culture_Report, Report_Type, encoded_html, Report_Status, data.get('micronumber') or '',
                    data.get('histonumber') or '', Bacteria_Isolated, IsSubTest, SubTestCodes, transferlocation, datetime.now(), datetime.now(),
                    macroscopy,site,data.get('Result') or None, srfId, icmrId, specimenCondition, covidType, covidResult,data.get('Previous_Value') or None,
                    labtechnician,doctorid,pathologyremarks,pathologyyesorno,abstinence
                ])
 
            # Update Billing_Item_Table_for_lab
            cursor.execute("""
                UPDATE Billing_Item_Table_for_lab
                SET Approve_Status = 'Completed', UpdatedAt = %s
                WHERE Billing_Invoice = %s AND Test_Code = %s
            """, [datetime.now(), billing_invoice, Test_Code])
            print('Updated Approve_Status to Completed for', Test_Code)
 
            # Check Autocheck logic
            cursor.execute("""
                SELECT Autocheck, Parameter_One
                FROM Test_Descriptions
                WHERE Test_Code = %s
            """, (Test_Code,))
            autocheck_result = cursor.fetchone()
            autocheck, value = autocheck_result if autocheck_result else (None, None)
            print('autocheck:', autocheck, 'value:', value)
 
            if autocheck == 'Yes':
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Test_Code = %s AND Billing_Invoice = %s
                """, (Test_Code, billing_invoice))
                count = cursor.fetchone()[0]
                print('autocheck count:', count)
 
                if int(value) == count:
                    cursor.execute("""
                        UPDATE Billing_invoice_and_bill_amount
                        SET Approve_Status = 'Completed', UpdatedAt = %s
                        WHERE Billing_Invoice = %s
                    """, (datetime.now(), billing_invoice,))
                else:
                    cursor.execute("""
                        UPDATE Billing_invoice_and_bill_amount
                        SET Approve_Status = 'Autocheck', UpdatedAt = %s
                        WHERE Billing_Invoice = %s
                    """, (datetime.now(), billing_invoice,))
                db.commit()
                print('Autocheck update success')
            else:
                # Check overall approval status
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s AND Approve_Status != 'Completed' AND Test_Method != 'Reflex'
                """, (billing_invoice,))
                not_completed_count = cursor.fetchone()[0]
                print('not_completed_count:', not_completed_count)
 
                cursor.execute("""
                    SELECT COUNT(*)
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s AND Transfer_Location IS NOT NULL AND Transfer_Location != ''
                """, (billing_invoice,))
                transfer_count = cursor.fetchone()[0]
                print('transfer_count:', transfer_count)
 
                if not_completed_count == 0:
                    new_approve_status = 'Completed'
                elif transfer_count > 0:
                    new_approve_status = 'Transfer'  # Preserve Transfer if any test is transferred
                else:
                    new_approve_status = 'Recollect'  # Partial completion without transfers
 
                cursor.execute("""
                    UPDATE Billing_invoice_and_bill_amount
                    SET Approve_Status = %s, UpdatedAt = %s
                    WHERE Billing_Invoice = %s
                """, (new_approve_status,datetime.now(), billing_invoice))
                db.commit()
                print(f'Updated Approve_Status to {new_approve_status}')
        print("Records processed successfully.")            
        return
 
    except Exception as e:
        print("Error:", str(e))
        return str(e)
 
@csrf_exempt
def post_bulk_pathologist_data(request):
    if request.method == "POST":
        try:
            cursor = db.cursor()
            datas= json.loads(request.body)
            print(datas)
           
            for data in datas:
                end = get_pathologist(data)
                print("after get")
                insert = insert_pathologist(end,cursor=cursor)
                # print(insert)
            return JsonResponse({'success': 'Document updated successfully'})
       
       
        except Exception as er:
            print(f"Error: {er}")
            return JsonResponse({"status":  str(er)}, status=500)

# ============================================================
# MACHINE INTERFACE ENDPOINTS - Added for analyser integration
# Reads results from LIS_MACHINERESULT table (written by analyser EXE)
# 
# Add to urls.py:
#   path('getmachineinterfaceresult', views.getmachineinterfaceresult),
#   path('get_labtech_forlab', views.get_labtech_forlab),
# ============================================================

def getmachineinterfaceresult(request):
    """
    Called by ReportCapture.js when a patient result screen is opened.
    Fetches analyser results from LIS_MACHINERESULT table for this barcode.

    Frontend call:
      GET /Lab/getmachineinterfaceresult?sampleid=BARCODE&Test_Codes=LTC001,LTC002

    Returns: [{ LIS_MACHTESTID, LIS_MACHRESULTS, LIS_UNITS }]

    Flexible barcode matching handles format differences between
    your system barcode and what the analyser EXE stored.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'GET only'}, status=405)

    try:
        sample_id  = request.GET.get('sampleid', '').strip()
        test_codes = request.GET.get('Test_Codes', '').strip()

        if not sample_id:
            return JsonResponse([], safe=False)

        with connection.cursor() as cursor:
            if test_codes:
                code_list = [c.strip() for c in test_codes.split(',') if c.strip()]
                placeholders = ','.join(['%s'] * len(code_list))
                cursor.execute(f"""
                    SELECT LIS_MACHTESTID, LIS_MACHRESULTS, LIS_UNITS, LIS_Test_Code
                    FROM LIS_MACHINERESULT
                    WHERE (
                        LIS_SAMPLENO = %s
                        OR LIS_SAMPLENO LIKE %s
                    )
                    AND (LIS_MACHTESTID IN ({placeholders}) OR LIS_Test_Code IN ({placeholders}))
                    AND (IsProcessed IS NULL OR IsProcessed = 'No')
                    ORDER BY LIS_CREATEDDTTM DESC
                """, [sample_id, f'%{sample_id}%'] + code_list + code_list)
            else:
                cursor.execute("""
                    SELECT LIS_MACHTESTID, LIS_MACHRESULTS, LIS_UNITS, LIS_Test_Code
                    FROM LIS_MACHINERESULT
                    WHERE (
                        LIS_SAMPLENO = %s
                        OR LIS_SAMPLENO LIKE %s
                    )
                    AND (IsProcessed IS NULL OR IsProcessed = 'No')
                    ORDER BY LIS_CREATEDDTTM DESC
                """, [sample_id, f'%{sample_id}%'])

            rows = cursor.fetchall()

        results = [
            {
                'LIS_MACHTESTID':  row[0],
                'LIS_MACHRESULTS': row[1],
                'LIS_UNITS':       row[2],
                'LIS_Test_Code':   row[3],
            }
            for row in rows
        ]

        # Mark results as processed so they are not returned again
        if rows:
            with connection.cursor() as upd_cursor:
                fetched_ids_q = ','.join(['%s'] * len(rows))
                upd_cursor.execute(f"""
                    UPDATE LIS_MACHINERESULT
                    SET IsProcessed = 'Yes'
                    WHERE (LIS_SAMPLENO = %s OR LIS_SAMPLENO LIKE %s)
                    AND (IsProcessed IS NULL OR IsProcessed = 'No')
                """, [sample_id, f'%{sample_id}%'])

        return JsonResponse(results, safe=False)

    except Exception as e:
        print(f"[getmachineinterfaceresult] Error: {e}")
        return JsonResponse({'error': str(e)}, status=500)


def get_labtech_forlab(request):
    """
    Returns lab technician name by employee ID.
    Called by ReportCapture.js to stamp technician name on report.

    Frontend call:
      GET /Lab/get_labtech_forlab?employeeid=EMP001
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'GET only'}, status=405)

    try:
        employee_id = request.GET.get('employeeid', '').strip()
        if not employee_id:
            return JsonResponse({'Name': ''})

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT Employee_Name
                FROM Employee_Detials
                WHERE Employee_Id = %s
                LIMIT 1
            """, [employee_id])
            row = cursor.fetchone()

        name = row[0] if row else ''
        return JsonResponse({'Name': name})

    except Exception as e:
        print(f"[get_labtech_forlab] Error: {e}")
        return JsonResponse({'Name': '', 'error': str(e)})