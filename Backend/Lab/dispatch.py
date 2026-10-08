
from django.shortcuts import render
import base64
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.db import connections
from django.views.decorators.http import require_http_methods
# from backend.db_connect import get_db_connection, get_db_cursor
import mysql
from django.db import connection as db
from Frontoffice.models import *
from Lab.models import *
from collections import defaultdict
import datetime
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny



@csrf_exempt
@api_view(['GET'])
@authentication_classes([])  # disables token
@permission_classes([AllowAny])  # allows everyone
def getdataforreport1(request):
    try:
        cursor = db.cursor()

        patientid = request.GET.get("patientid")

        # Step 1: Identify patients with multiple test entries
        multi_patient_query = """
            SELECT Patient_Id
            FROM Billing_Item_Table_for_lab
            GROUP BY Patient_Id
            HAVING COUNT(*) > 1
        """
        cursor.execute(multi_patient_query)
        multi_patients = [row[0] for row in cursor.fetchall()]

        if patientid not in multi_patients:
            return JsonResponse([], safe=False)  # No multiple test data for given patient

        # Step 2: Main lab test data query (filtered only by patient ID)
        query = """
            WITH RankedResults AS (
                SELECT
                    bit.*, td.Test_Name AS td_Test_Name, sd.SubDepartment_Name,
                    ...
                    ROW_NUMBER() OVER (PARTITION BY bit.Test_Code ORDER BY asm.updated_at DESC) AS rn
                FROM Billing_Item_Table_for_lab AS bit
                LEFT JOIN Test_Descriptions AS td ON td.Test_Code = bit.Test_Code
                LEFT JOIN DepartmentOrderMaster d ON td.Sub_Department_id = d.SubDepartment_Code_id
                LEFT JOIN Age_Setup_Master AS asm ON asm.Test_Code_id = bit.Test_Code
                LEFT JOIN Register_patient_Details AS rpd ON rpd.Patient_Id = bit.Patient_Id
                INNER JOIN Approve_Test_Pathologist AS Ap ON Ap.Billing_Invoice = bit.Billing_Invoice AND Ap.Test_Code = bit.Test_Code
                LEFT JOIN sublab_department_detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
                LEFT JOIN unit_masters uom ON td.UOM_id = uom.Unit_Code AND td.UOM_id IS NOT NULL AND td.UOM_id != ''
                LEFT JOIN methods_masters mm ON td.Method_Name_id = mm.Method_Code AND td.Method_Name_id IS NOT NULL AND td.Method_Name_id != ''
                WHERE bit.Patient_Id = %s AND Ap.Status = 'Approved'
            )
            SELECT * FROM RankedResults WHERE rn = 1 ORDER BY bit_Item_Id ASC
        """
        cursor.execute(query, (patientid,))
        data = cursor.fetchall()
        column = [i[0] for i in cursor.description]

        # Proceed with same interpretation/guideline/microbiology logic from your existing function
        # (You can paste the same processing code from your full function after this point)

        return JsonResponse({"status": "Multiple test data returned", "data": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

from decimal import Decimal


# @csrf_exempt
# def getdataforreport(request):
#     try:
#         cursor = db.cursor()

#         Visitid = request.GET.get("Visitid")
#         patientid = request.GET.get("patientid")
#         Billinginvoice = request.GET.get("Billinginvoice")
#         needed = request.GET.get("Filter")
#         Filtered = [x.strip() for x in needed.split(",") if x.strip().lower() != "undefined"]
#         print("Needed-------->>",Filtered)


#         # Main query to fetch test data
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
#                     Ap.site,
#                     Ap.macroscopy,
#                     td.Iscutoffvalue,
#                     Ap.Result,
#                     Ap.srfId,
#                     Ap.icmrId,
#                     Ap.specimenCondition,
#                     Ap.covidType,
#                     Ap.covidResult,
#                     Ap.histonumber,
#                     Ap.labtechnician,
#                     Ap.DoctorID,
#                     td.Is_NABHL,
#                     Ap.pathologyremarks,
#                     Ap.pathologyyesorno,
#                     Ap.abstinence,
#                     ROW_NUMBER() OVER (PARTITION BY bit.Test_Code ORDER BY asm.updated_at DESC) AS rn,
#                     Ar.CreatedBy as tech,
#                     Asr.CreatedBy as sr_tech,
#                     Ap.acid_fast,
#                     Ap.Report_Status,
#                     Ap.positivity
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
#                 INNER JOIN
#                     Approve_Test_Pathologist AS Ap ON Ap.Billing_Invoice = bit.Billing_Invoice
#                         AND Ap.Test_Code = bit.Test_Code
#                 INNER JOIN
#                     AnalyseInvestigationResult AS Ar ON Ar.Billing_Invoice = bit.Billing_Invoice
#                         AND Ar.Test_Code = bit.Test_Code
# 				INNER JOIN
#                     AnalyseInvestigationSenior AS Asr ON Asr.Billing_Invoice = bit.Billing_Invoice
#                         AND Asr.Test_Code = bit.Test_Code
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
#                 RankedResults.*
#             FROM
#                 RankedResults
#             WHERE
#                 rn = 1
#             ORDER BY
#                 RankedResults.bit_Item_Id ASC
#         """
#         cursor.execute(query, (patientid, Visitid, Billinginvoice))
#         data = cursor.fetchall()
#         column = [i[0] for i in cursor.description]
#         print("Before filter",data)

#         if Filtered and len(Filtered) > 0:
#             print("Inside--------")
#             filtered_data = [row for row in data if row[18] in Filtered]
#             data = filtered_data
#         print("After filter",data)


#         # Debug: Log column names to verify 'bit_Item_Id' presence
#         if 'bit_Item_Id' not in column:
#             print("Warning: 'bit_Item_Id' not found in query results. Columns:", column)

#         # Fetch all interpretations for relevant Test_Codes
#         test_codes = set(row[column.index("Test_Code")] for row in data)

#         print("testtttttttttttttt",test_codes)
        
#         interpretation_query = """
#             SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
#             FROM Testmaster_Interpretation_table
#             WHERE Test_Code_id IN (%s)
#         """ % ','.join(['%s'] * len(test_codes))
#         cursor.execute(interpretation_query, list(test_codes))
#         interpretation_data = cursor.fetchall()
#         interpretation_columns = [i[0] for i in cursor.description]

#         # Map interpretations to Test_Code
#         interpretations_by_test_code = defaultdict(list)
#         for row in interpretation_data:
#             row_dict = dict(zip(interpretation_columns, row))
#             test_code = row_dict["Test_Code_id"]
#             interpretations_by_test_code[test_code].append({
#                 "Test_Id": row_dict.get("Test_Id", ""),
#                 "Header_interpretation": row_dict.get("Header_interpretation", ""),
#                 "Comments": row_dict.get("Comments", "")
#             })

#         # Fetch all guidelines for relevant Test_Codes
#         guideline_query = """
#             SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
#             FROM Testmaster_guideline_table
#             WHERE Test_Code_id IN (%s)
#         """ % ','.join(['%s'] * len(test_codes))
#         cursor.execute(guideline_query, list(test_codes))
#         guideline_data = cursor.fetchall()
#         guideline_columns = [i[0] for i in cursor.description]

#         # Map guidelines to Test_Code
#         guidelines_by_test_code = defaultdict(list)
#         for row in guideline_data:
#             row_dict = dict(zip(guideline_columns, row))
#             test_code = row_dict["Test_Code_id"]
#             guidelines_by_test_code[test_code].append({
#                 "Test_Id": row_dict.get("Test_Id", ""),
#                 "Header_interpretation": row_dict.get("Header_interpretation", ""),
#                 "Comments": row_dict.get("Comments", "")
#             })

#         def convert_to_serializable(item):
#             if isinstance(item, datetime.datetime):
#                 return item.strftime("%Y-%m-%d %H:%M:%S")
#             return item

#         def extract_panic_range(reference_range, gender):
#             # Placeholder for extract_panic_range function
#             return None, None

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

#         test_map = {}
#         subtest_map = {}
#         ordered_test_details = defaultdict(list)
#         ordered_dept_test_details = defaultdict(list)
#         processed_subtest_ids = set()
#         colony = {}

#         # Populate test_map and subtest_map
#         for row in data:
#             row_dict = dict(
#                 (column[i], convert_to_serializable(row[i])) for i in range(len(row))
#             )
#             if "bit_Item_Id" in row_dict:
#                 test_map[row_dict["bit_Item_Id"]] = row_dict
#             else:
#                 print(f"Warning: bit_Item_Id missing in row: {row_dict}")
#             if row_dict.get("SubTestCodes"):
#                 subtest_map[row_dict["SubTestCodes"]] = row_dict.get("bit_Item_Id")

#         for row in data:
#             row_dict = dict(
#                 (column[i], convert_to_serializable(row[i])) for i in range(len(row))
#             )

#             invoice_no = row_dict.get("Billing_Invoice")
#             department_name = row_dict.get("SubDepartment_Name")
#             patient_gender = row_dict.get("rpd_Gender")
#             Report_Type = row_dict.get("Report_Type")
#             OrderID = row_dict.get("OrderID")
#             Test_Method = row_dict.get("Test_Method")
#             Group_Name = row_dict.get("Group_Name")
#             PackageCode = row_dict.get("bit_PackageCode")
#             Group_Code = row_dict.get("bit_Group_Code")
#             test_code = row_dict.get("Test_Code")
#             patient_id = row_dict.get("Patient_Id")
#             invoice = row_dict.get("Billing_Invoice")
#             Culturetest = row_dict.get("Culturetest")

#             # Fetch PackageName
#             PackageName = ""
#             if PackageCode:
#                 query1 = """SELECT package_name FROM OfferPackage WHERE package_code = %s"""
#                 cursor.execute(query1, (PackageCode,))
#                 package_result = cursor.fetchone()
#                 PackageName = package_result[0] if package_result else ""
#                 if not package_result:
#                     print(f"Warning: PackageCode {PackageCode} not found in OfferPackage table")

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

#             updated_at_data_offer = {
#                 "AnalyseInvestigationResult": "N/A",
#                 "AnalyseInvestigationSenior": "N/A",
#                 "Approve_Test_Pathologist": "N/A"
#             }
#             cursor.execute("""
#                 SELECT 'AnalyseInvestigationResult' AS Source, DATE_FORMAT(MAX(CreatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
#                 FROM Sample_Capture_in_Phelobotomist 
#                 WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
#                 UNION ALL
#                 SELECT 'AnalyseInvestigationSenior', DATE_FORMAT(MAX(UpdatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
#                 FROM Sample_Capture_in_Phelobotomist 
#                 WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
#                 UNION ALL
#                 SELECT 'Approve_Test_Pathologist', DATE_FORMAT(MAX(UpdatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
#                 FROM Approve_Test_Pathologist 
#                 WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
#             """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
#             updates = cursor.fetchall()

#             # for source, updated_at in updates:
#             #     if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_offer[source]):
#             #         updated_at_data_offer[source] = updated_at.strftime("%d/%m/%Y %H:%M")

#             for source, updated_at in updates:
#                 if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at > updated_at_data_offer[source]):
#                     updated_at_data_offer[source] = updated_at  # already formatted string like "20-08-2025 02:15 PM"
            
#             print("TIME----------",updated_at_data_offer)

#             invoice_details.update(updated_at_data_offer)

#             test_details = {
#                 key: row_dict[key]
#                 for key in row_dict
#                 if key not in ["Billing_Invoice", "Sub_Department"]
#             }

#             test_details["testinterpreatation"] = interpretations_by_test_code.get(test_code, [])
#             test_details["guidelines_interpretation"] = guidelines_by_test_code.get(test_code, [])

#             reference_range = row_dict.get("ReferenceRange")
#             NormalValue = row_dict.get("NormalValue")
#             Panic_Low = row_dict.get("Panic_Low")
#             Panic_High = row_dict.get("Panic_High")

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
#                         test_details["Capture_Value"] = Decimal(Capture_Value)
#                     else:
#                         test_details["Capture_Value"] = int(Capture_Value)
#                 else:
#                     test_details["Capture_Value"] = Capture_Value

#             test_details["Billing_Invoice"] = invoice_no

#             parent_group_name = None
#             parent_department_name = None
#             if row_dict["Test_Code"] in subtest_map:
#                 parent_item_id = subtest_map[row_dict["Test_Code"]]
#                 parent_group_name = test_map.get(parent_item_id, {}).get("Group_Name")
#                 parent_department_name = test_map.get(parent_item_id, {}).get("SubDepartment_Name")
#                 if row_dict.get("bit_Item_Id") in processed_subtest_ids:
#                     continue

#             if Test_Method == "Offers":
#                 if Group_Name or parent_group_name:
#                     target_group_name = Group_Name if Group_Name else parent_group_name
#                     group_data[target_group_name]["ReportType"] = "Group"
#                     group_data[target_group_name]["OrderID"] = OrderID
#                     group_data[target_group_name]["Test_Method"] = Test_Method
#                     group_data[target_group_name]["PackageName"] = PackageName

#                     selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
#                     cursor.execute(selectquery1, (Group_Code,) if Group_Code else (test_map.get(parent_item_id, {}).get("Group_Code"),))
#                     group_result = cursor.fetchone()
#                     group_department_name = group_result[0] if group_result else department_name
#                     group_data[target_group_name]["department_name"] = group_department_name

#                     if not group_data[target_group_name]["invoice_details"]:
#                         group_data[target_group_name]["invoice_details"] = invoice_details

#                     if not parent_group_name or row_dict.get("bit_Item_Id") not in processed_subtest_ids:
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
#                             subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
#                             subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
#                             sub_ref_range = subtest_details.get("ReferenceRange")
#                             sub_normal = subtest_details.get("NormalValue")
#                             if sub_normal == "Yes":
#                                 sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
#                                 subtest_details["paniclow"] = sub_panic_low
#                                 subtest_details["panichigh"] = sub_panic_high
#                             ordered_test_details[target_group_name].append(subtest_details)
#                             processed_subtest_ids.add(subtest_item_id)

#                 else:
#                     department_data[department_name]["OrderID"] = OrderID
#                     if not department_data[department_name]["invoice_details"]:
#                         department_data[department_name]["invoice_details"] = invoice_details
#                     department_data[department_name]["test_details"].append(test_details)
#                     department_data[department_name]["Test_Method"] = Test_Method
#                     department_data[department_name]["PackageName"] = PackageName

#             elif Test_Method == "Group":
#                 group_data[Group_Name]["ReportType"] = Report_Type
#                 group_data[Group_Name]["OrderID"] = OrderID
#                 group_data[Group_Name]["Test_Method"] = Test_Method
#                 group_data[Group_Name]["PackageName"] = PackageName

#                 selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
#                 cursor.execute(selectquery1, (Group_Code,))
#                 group_result = cursor.fetchone()
#                 group_department_name = group_result[0] if group_result else None
#                 group_data[Group_Name]["department_name"] = group_department_name

#                 if not group_data[Group_Name]["invoice_details"]:
#                     group_data[Group_Name]["invoice_details"] = invoice_details

#                 if row_dict.get("bit_Item_Id") not in processed_subtest_ids:
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
#                         subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
#                         subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
#                         sub_ref_range = subtest_details.get("ReferenceRange")
#                         sub_normal = subtest_details.get("NormalValue")
#                         if sub_normal == "Yes":
#                             sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
#                             subtest_details["paniclow"] = sub_panic_low
#                             subtest_details["panichigh"] = sub_panic_high
#                         ordered_test_details[Group_Name].append(subtest_details)
#                         processed_subtest_ids.add(subtest_item_id)

#             else:
#                 department_data[department_name]["OrderID"] = OrderID
#                 if not department_data[department_name]["invoice_details"]:
#                     department_data[department_name]["invoice_details"] = invoice_details
#                 department_data[department_name]["test_details"].append(test_details)
#                 department_data[department_name]["Test_Method"] = Test_Method
#                 department_data[department_name]["PackageName"] = PackageName

#             if department_name == "MICROBIOLOGY" and Culturetest == "Yes":
#                 query1 = """SELECT DISTINCT Captured_Oraganism, Sensitive_Type, Antibiotic_Name, Antibiotic_Value
#                             FROM Complete_Culture_Examination 
#                             WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
#                 cursor.execute(query1, (Billinginvoice, patientid, Visitid))
#                 data1 = cursor.fetchall()

#                 column1 = [i[0] for i in cursor.description]
#                 result = defaultdict(list)

#                 sensitivity_order = {"Sensitive": 1, "Intermediate": 2, "Resistant": 3}

#                 for row in data1:
#                     row_data = dict(zip(column1, row))
#                     organism = row_data["Captured_Oraganism"]
#                     query = """
#                     SELECT `intermediate`, `resistant`, `sensitive` FROM AntibioticMaster WHERE anti_biotic = %s;
#                     """
#                     cursor.execute(query, (row_data["Antibiotic_Name"],))
#                     fetched = cursor.fetchall()

#                     intermediate, resistant, sensitive = "", "", ""
#                     if fetched:
#                         intermediate, resistant, sensitive = fetched[0]

#                     antibiotic_info = {
#                         "Antibiotic": row_data["Antibiotic_Name"],
#                         "SensitivityType": row_data["Sensitive_Type"],
#                         "CaptureValue": row_data["Antibiotic_Value"],
#                         "Intermediate": intermediate,
#                         "Resistant": resistant,
#                         "Sensitive": sensitive,
#                     }

#                     result[organism].append(antibiotic_info)

#                     query1 = """SELECT ColonyCount 
#                         FROM Complete_Culture_Examination 
#                         WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Captured_Oraganism = %s
#                         ORDER BY CreatedAt DESC LIMIT 1;"""
#                     cursor.execute(query1, (Billinginvoice, patientid, Visitid, organism))
#                     row = cursor.fetchone()

#                     ColonyCount = row[0] if row and row[0] is not None else ""
#                     colony[organism] = ColonyCount

#                 for organism in result:
#                     result[organism].sort(key=lambda x: sensitivity_order.get(x["SensitivityType"], float("inf")))

#                 final_result_micro = [
#                     {organism: antibiotics} for organism, antibiotics in result.items()
#                 ]

#                 for test in ordered_dept_test_details[department_name]:
#                     if "OrganismDetails" not in test:
#                         test["OrganismDetails"] = final_result_micro
#                         test["OrganismColony"] = colony
#                     else:
#                         test["OrganismDetails"].extend(final_result_micro)
#                         test["OrganismColony"] = colony

#             print("TEst----------",test_details)
#         # Populate test details for groups and departments
#         for group_name, test_details_list in ordered_test_details.items():
#             if group_name and test_details_list:
#                 group_data[group_name]["test_details"] = test_details_list

#         for dept_name, test_details_list in ordered_dept_test_details.items():
#             if dept_name and test_details_list:
#                 department_data[dept_name]["test_details"] = test_details_list

#         # Add group entries to test_details for Offers
#         for group_name, data in group_data.items():
#             if len(data["test_details"]) > 0 and group_name and data["Test_Method"] == "Offers":
#                 dept_name = data["department_name"]
#                 group_entry = {
#                     "Packagegroup": [{
#                         "groupname": group_name,
#                         "department": data["department_name"],
#                         "Report_Type": data["ReportType"],
#                         "testdetails": data["test_details"],
#                         "invoicedetails": data["invoice_details"],
#                         "OrderID": data["OrderID"],
#                         "Test_Method": data["Test_Method"],
#                         "PackageName": data["PackageName"],
#                     }]
#                 }
#                 department_data[dept_name]["test_details"].append(group_entry)

#         final_result = []
#         for dept_name, data in department_data.items():
#             if len(data["test_details"]) > 0:
#                 dept_entry = {
#                     "department": dept_name,
#                     "Report_Type": data["ReportType"],
#                     "testdetails": data["test_details"],
#                     "invoicedetails": data["invoice_details"],
#                     "OrderID": data["OrderID"],
#                     "Test_Method": data["Test_Method"],
#                     "PackageName": data["PackageName"],
#                     "index": data["index"],
#                     "Outsourcealert": data["Outsourcealert"]
#                 }
#                 final_result.append(dept_entry)

#         for group_name, data in group_data.items():
#             if len(data["test_details"]) > 0 and group_name and data["Test_Method"] != "Offers":
#                 final_result.append({
#                     "groupname": group_name,
#                     "department": data["department_name"],
#                     "Report_Type": data["ReportType"],
#                     "testdetails": data["test_details"],
#                     "invoicedetails": data["invoice_details"],
#                     "OrderID": data["OrderID"],
#                     "Test_Method": data["Test_Method"],
#                     "PackageName": data["PackageName"],
#                 })

#         return JsonResponse(final_result, safe=False)

#     except Exception as e:
#         print(f"Error in getdataforreport: {str(e)}")
#         return JsonResponse({"status": str(e)}, status=500)
#     finally:
#         if 'cursor' in locals():
#             cursor.close()
#         if 'db' in locals():
#             db.close()



@csrf_exempt
def getdataforreport(request):
    try:
        cursor = db.cursor()

        Visitid = request.GET.get("Visitid")
        patientid = request.GET.get("patientid")
        Billinginvoice = request.GET.get("Billinginvoice")
        needed = request.GET.get("Filter")
        Filtered = [x.strip() for x in needed.split(",") if x.strip().lower() != "undefined"]
        print("Needed-------->>",Filtered)


        # Main query to fetch test data
        query = """
            WITH RankedResults AS (
                SELECT
                    bit.*,
                    td.Test_Name AS td_Test_Name,
                    sd.SubDepartment_Name,
                    td.Header,
                    td.Billing_Name,
                    td.Container_Name_id,
                    td.Specimen_Name_id,
                    mm.Method_Name,
                    td.Gender AS td_Gender,
                    td.Input_Type,
                    td.Decimal_Palces,
                    td.Input_Pattern_Type,
                    td.Test_Category,
                    td.Captured_Unit,
                    uom.Unit_Name,
                    td.Test_Instructions,
                    td.Culturetest,
                    d.SubDepartment_Code_id,
                    d.OrderID,
                    Ap.Reference_Range AS ReferenceRange,
                    rpd.Gender AS rpd_Gender,
                    bit.Test_Method AS bit_Test_Method,
                    bit.Group_Name AS bit_Group_Name,
                    Ap.Technical_Remark,
                    asm.NormalValue,
                    asm.PanicLow AS Panic_Low,
                    asm.PanicHigh AS Panic_High,
                    bit.Item_Id AS bit_Item_Id,
                    bit.PackageCode AS bit_PackageCode,
                    bit.Group_Code AS bit_Group_Code,
                    Ap.Capture_Value,
                    Ap.Report_Type,
                    Ap.Microscopy_Data,
                    Ap.Notes,
                    Ap.Colony_Count,
                    Ap.Culture_Report,
                    Ap.EditContent,
                    td.DisplayText,
                    Ap.Sample_Specimen,
                    Ap.Bacteria_Isolated,
                    Ap.micronumber,
                    Ap.site,
                    Ap.macroscopy,
                    td.Iscutoffvalue,
                    Ap.Result,
                    Ap.srfId,
                    Ap.icmrId,
                    Ap.specimenCondition,
                    Ap.covidType,
                    Ap.covidResult,
                    Ap.histonumber,
                    Ap.labtechnician,
                    Ap.DoctorID,
                    td.Is_NABHL,
                    Ap.pathologyremarks,
                    Ap.pathologyyesorno,
                    Ap.abstinence,
                    ROW_NUMBER() OVER (PARTITION BY bit.Test_Code ORDER BY asm.updated_at DESC) AS rn,
                    Ar.CreatedBy as tech,
                    Asr.CreatedBy as sr_tech,
                    Ap.acid_fast,
                    Ap.Report_Status,
                    Ap.positivity,
                    bit2.isedit As edit,
                    Ap.Reportfile,
                    Ap.rangeType
                FROM
                    Billing_Item_Table_for_lab AS bit
                LEFT JOIN
                    Billing_invoice_and_bill_amount  AS bit2 ON bit2.Billing_Invoice = bit.Billing_Invoice
                LEFT JOIN
                    Test_Descriptions AS td ON td.Test_Code = bit.Test_Code
                LEFT JOIN
                    DepartmentOrderMaster d ON td.Sub_Department_id = d.SubDepartment_Code_id
                LEFT JOIN
                    Age_Setup_Master AS asm ON asm.Test_Code_id = bit.Test_Code
                LEFT JOIN
                    Register_patient_Details AS rpd ON rpd.Patient_Id = bit.Patient_Id
                INNER JOIN
                    Approve_Test_Pathologist AS Ap ON Ap.Billing_Invoice = bit.Billing_Invoice
                        AND Ap.Test_Code = bit.Test_Code
                INNER JOIN
                    AnalyseInvestigationResult AS Ar ON Ar.Billing_Invoice = bit.Billing_Invoice
                        AND Ar.Test_Code = bit.Test_Code
				INNER JOIN
                    AnalyseInvestigationSenior AS Asr ON Asr.Billing_Invoice = bit.Billing_Invoice
                        AND Asr.Test_Code = bit.Test_Code
                LEFT JOIN 
                    sublab_department_detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
                LEFT JOIN 
                    unit_masters uom ON td.UOM_id = uom.Unit_Code
                    AND td.UOM_id IS NOT NULL 
                    AND td.UOM_id != '' 
                LEFT JOIN 
                    methods_masters mm ON td.Method_Name_id = mm.Method_Code
                    AND td.Method_Name_id IS NOT NULL 
                    AND td.Method_Name_id != '' 
                WHERE
                    bit.Patient_Id = %s
                    AND bit.Visit_Id = %s
                    AND bit.Billing_Invoice = %s
                    AND Ap.Status = 'Approved'
            )
            SELECT
                RankedResults.*
            FROM
                RankedResults
            WHERE
                rn = 1
            ORDER BY
                RankedResults.bit_Item_Id ASC
        """
        cursor.execute(query, (patientid, Visitid, Billinginvoice))
        data = cursor.fetchall()
        column = [i[0] for i in cursor.description]
        print("Before filter",data)

        if Filtered and len(Filtered) > 0:
            print("Inside--------")
            filtered_data = [row for row in data if row[18] in Filtered]
            data = filtered_data
        print("After filter",data)


        # Debug: Log column names to verify 'bit_Item_Id' presence
        if 'bit_Item_Id' not in column:
            print("Warning: 'bit_Item_Id' not found in query results. Columns:", column)

        # Fetch all interpretations for relevant Test_Codes
        test_codes = set(row[column.index("Test_Code")] for row in data)

        print("testtttttttttttttt",test_codes)
        
        interpretation_query = """
            SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
            FROM Testmaster_Interpretation_table
            WHERE Test_Code_id IN (%s)
        """ % ','.join(['%s'] * len(test_codes))
        cursor.execute(interpretation_query, list(test_codes))
        interpretation_data = cursor.fetchall()
        interpretation_columns = [i[0] for i in cursor.description]

        # Map interpretations to Test_Code
        interpretations_by_test_code = defaultdict(list)
        for row in interpretation_data:
            row_dict = dict(zip(interpretation_columns, row))
            test_code = row_dict["Test_Code_id"]
            interpretations_by_test_code[test_code].append({
                "Test_Id": row_dict.get("Test_Id", ""),
                "Header_interpretation": row_dict.get("Header_interpretation", ""),
                "Comments": row_dict.get("Comments", "")
            })

        # Fetch all guidelines for relevant Test_Codes
        guideline_query = """
            SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
            FROM Testmaster_guideline_table
            WHERE Test_Code_id IN (%s)
        """ % ','.join(['%s'] * len(test_codes))
        cursor.execute(guideline_query, list(test_codes))
        guideline_data = cursor.fetchall()
        guideline_columns = [i[0] for i in cursor.description]

        # Map guidelines to Test_Code
        guidelines_by_test_code = defaultdict(list)
        for row in guideline_data:
            row_dict = dict(zip(guideline_columns, row))
            test_code = row_dict["Test_Code_id"]
            guidelines_by_test_code[test_code].append({
                "Test_Id": row_dict.get("Test_Id", ""),
                "Header_interpretation": row_dict.get("Header_interpretation", ""),
                "Comments": row_dict.get("Comments", "")
            })

        def convert_to_serializable(item):
            if isinstance(item, datetime.datetime):
                return item.strftime("%Y-%m-%d %H:%M:%S")
            return item

        def extract_panic_range(reference_range, gender):
            # Placeholder for extract_panic_range function
            return None, None

        department_data = defaultdict(
            lambda: {
                "invoice_details": {},
                "test_details": [],
                "ReportType": None,
                "OrderID": None,
                "Test_Method": None,
                "PackageName": None,
                "index": None,
                "Outsourcealert": []
            }
        )

        group_data = defaultdict(
            lambda: {
                "invoice_details": {},
                "test_details": [],
                "ReportType": None,
                "OrderID": None,
                "Test_Method": None,
                "PackageName": None,
                "department_name": None,
            }
        )

        test_map = {}
        subtest_map = {}
        ordered_test_details = defaultdict(list)
        ordered_dept_test_details = defaultdict(list)
        processed_subtest_ids = set()
        colony = {}

        # Populate test_map and subtest_map
        for row in data:
            row_dict = dict(
                (column[i], convert_to_serializable(row[i])) for i in range(len(row))
            )
            if "bit_Item_Id" in row_dict:
                test_map[row_dict["bit_Item_Id"]] = row_dict
            else:
                print(f"Warning: bit_Item_Id missing in row: {row_dict}")
            if row_dict.get("SubTestCodes"):
                subtest_map[row_dict["SubTestCodes"]] = row_dict.get("bit_Item_Id")

        for row in data:
            row_dict = dict(
                (column[i], convert_to_serializable(row[i])) for i in range(len(row))
            )

            invoice_no = row_dict.get("Billing_Invoice")
            department_name = row_dict.get("SubDepartment_Name")
            patient_gender = row_dict.get("rpd_Gender")
            Report_Type = row_dict.get("Report_Type")
            OrderID = row_dict.get("OrderID")
            Test_Method = row_dict.get("Test_Method")
            Group_Name = row_dict.get("Group_Name")
            PackageCode = row_dict.get("bit_PackageCode")
            Group_Code = row_dict.get("bit_Group_Code")
            test_code = row_dict.get("Test_Code")
            patient_id = row_dict.get("Patient_Id")
            invoice = row_dict.get("Billing_Invoice")
            Culturetest = row_dict.get("Culturetest")

            Reportfile = row_dict.get("Reportfile")

            # Fetch PackageName
            PackageName = ""
            if PackageCode:
                query1 = """SELECT package_name FROM OfferPackage WHERE package_code = %s"""
                cursor.execute(query1, (PackageCode,))
                package_result = cursor.fetchone()
                PackageName = package_result[0] if package_result else ""
                if not package_result:
                    print(f"Warning: PackageCode {PackageCode} not found in OfferPackage table")

            invoice_details = {
                "Billing_Invoice": row_dict.get("Billing_Invoice"),
                "Patient_Id": row_dict.get("Patient_Id"),
                "Visit_Id": row_dict.get("Visit_Id"),
                "Patient_Name": row_dict.get("Patient_Name"),
                "Gross_Amount": row_dict.get("Gross_Amount"),
                "Location": row_dict.get("Location"),
                "Service_Status": row_dict.get("Service_Status"),
                "Analysis_Status": row_dict.get("Analysis_Status"),
                "Verify_Status": row_dict.get("Verify_Status"),
                "Approve_Status": row_dict.get("Approve_Status"),
                "Barcode_Id": row_dict.get("Barcode_Id"),
                "CreatedBy": row_dict.get("CreatedBy"),
                "Billing_Date": row_dict.get("Billing_Date"),
                "UpdatedAt": row_dict.get("UpdatedAt"),
                "CreatedAt": row_dict.get("CreatedAt"),
            }

            updated_at_data_offer = {
                "AnalyseInvestigationResult": "N/A",
                "AnalyseInvestigationSenior": "N/A",
                "Approve_Test_Pathologist": "N/A"
            }
            cursor.execute("""
                SELECT 'AnalyseInvestigationResult' AS Source, DATE_FORMAT(MAX(CreatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
                FROM Sample_Capture_in_Phelobotomist 
                WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
                UNION ALL
                SELECT 'AnalyseInvestigationSenior', DATE_FORMAT(MAX(UpdatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
                FROM Sample_Capture_in_Phelobotomist 
                WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
                UNION ALL
                SELECT 'Approve_Test_Pathologist', DATE_FORMAT(MAX(UpdatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
                FROM Approve_Test_Pathologist 
                WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
            """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
            updates = cursor.fetchall()

            # for source, updated_at in updates:
            #     if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_offer[source]):
            #         updated_at_data_offer[source] = updated_at.strftime("%d/%m/%Y %H:%M")

            for source, updated_at in updates:
                if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at > updated_at_data_offer[source]):
                    updated_at_data_offer[source] = updated_at  # already formatted string like "20-08-2025 02:15 PM"
            
            print("TIME----------",updated_at_data_offer)

            invoice_details.update(updated_at_data_offer)

            test_details = {
                key: row_dict[key]
                for key in row_dict
                if key not in ["Billing_Invoice", "Sub_Department"]
            }

            file_base64 = None
            if Reportfile:
                file_base64 = base64.b64encode(Reportfile).decode('utf-8')
                file_base64 = f"data:application/pdf;base64,{file_base64}"

            test_details["Reportfile"] = file_base64

            test_details["testinterpreatation"] = interpretations_by_test_code.get(test_code, [])
            test_details["guidelines_interpretation"] = guidelines_by_test_code.get(test_code, [])

            reference_range = row_dict.get("ReferenceRange")
            NormalValue = row_dict.get("NormalValue")
            Panic_Low = row_dict.get("Panic_Low")
            Panic_High = row_dict.get("Panic_High")

            if NormalValue == "Yes":
                panic_low, panic_high = extract_panic_range(reference_range, patient_gender)
                test_details["paniclow"] = panic_low
                test_details["panichigh"] = panic_high
            else:
                test_details["paniclow"] = Panic_Low
                test_details["panichigh"] = Panic_High

            Capture_Value = row_dict.get("Capture_Value")
            if Capture_Value is not None:
                if Capture_Value.replace(".", "", 1).isdigit():
                    if "." in Capture_Value:
                        test_details["Capture_Value"] = Decimal(Capture_Value)
                    else:
                        test_details["Capture_Value"] = int(Capture_Value)
                else:
                    test_details["Capture_Value"] = Capture_Value

            test_details["Billing_Invoice"] = invoice_no

            parent_group_name = None
            parent_department_name = None
            if row_dict["Test_Code"] in subtest_map:
                parent_item_id = subtest_map[row_dict["Test_Code"]]
                parent_group_name = test_map.get(parent_item_id, {}).get("Group_Name")
                parent_department_name = test_map.get(parent_item_id, {}).get("SubDepartment_Name")
                if row_dict.get("bit_Item_Id") in processed_subtest_ids:
                    continue

            if Test_Method == "Offers":
                if Group_Name or parent_group_name:
                    target_group_name = Group_Name if Group_Name else parent_group_name
                    group_data[target_group_name]["ReportType"] = "Group"
                    group_data[target_group_name]["OrderID"] = OrderID
                    group_data[target_group_name]["Test_Method"] = Test_Method
                    group_data[target_group_name]["PackageName"] = PackageName

                    selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
                    cursor.execute(selectquery1, (Group_Code,) if Group_Code else (test_map.get(parent_item_id, {}).get("Group_Code"),))
                    group_result = cursor.fetchone()
                    group_department_name = group_result[0] if group_result else department_name
                    group_data[target_group_name]["department_name"] = group_department_name

                    if not group_data[target_group_name]["invoice_details"]:
                        group_data[target_group_name]["invoice_details"] = invoice_details

                    if not parent_group_name or row_dict.get("bit_Item_Id") not in processed_subtest_ids:
                        ordered_test_details[target_group_name].append(test_details)

                    if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
                        subtest_code = row_dict["SubTestCodes"]
                        subtest_item_id = next(
                            (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
                            None
                        )
                        if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
                            subtest_details = test_map[subtest_item_id].copy()
                            subtest_details["Billing_Invoice"] = invoice_no
                            subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
                            subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
                            sub_ref_range = subtest_details.get("ReferenceRange")
                            sub_normal = subtest_details.get("NormalValue")
                            if sub_normal == "Yes":
                                sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
                                subtest_details["paniclow"] = sub_panic_low
                                subtest_details["panichigh"] = sub_panic_high
                            ordered_test_details[target_group_name].append(subtest_details)
                            processed_subtest_ids.add(subtest_item_id)

                else:
                    department_data[department_name]["OrderID"] = OrderID
                    if not department_data[department_name]["invoice_details"]:
                        department_data[department_name]["invoice_details"] = invoice_details
                    department_data[department_name]["test_details"].append(test_details)
                    department_data[department_name]["Test_Method"] = Test_Method
                    department_data[department_name]["PackageName"] = PackageName

            elif Test_Method == "Group":
                group_data[Group_Name]["ReportType"] = Report_Type
                group_data[Group_Name]["OrderID"] = OrderID
                group_data[Group_Name]["Test_Method"] = Test_Method
                group_data[Group_Name]["PackageName"] = PackageName

                selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
                cursor.execute(selectquery1, (Group_Code,))
                group_result = cursor.fetchone()
                group_department_name = group_result[0] if group_result else None
                group_data[Group_Name]["department_name"] = group_department_name

                if not group_data[Group_Name]["invoice_details"]:
                    group_data[Group_Name]["invoice_details"] = invoice_details

                if row_dict.get("bit_Item_Id") not in processed_subtest_ids:
                    ordered_test_details[Group_Name].append(test_details)
                if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
                    subtest_code = row_dict["SubTestCodes"]
                    subtest_item_id = next(
                        (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
                        None
                    )
                    if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
                        subtest_details = test_map[subtest_item_id].copy()
                        subtest_details["Billing_Invoice"] = invoice_no
                        subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
                        subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
                        sub_ref_range = subtest_details.get("ReferenceRange")
                        sub_normal = subtest_details.get("NormalValue")
                        if sub_normal == "Yes":
                            sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
                            subtest_details["paniclow"] = sub_panic_low
                            subtest_details["panichigh"] = sub_panic_high
                        ordered_test_details[Group_Name].append(subtest_details)
                        processed_subtest_ids.add(subtest_item_id)

            else:
                department_data[department_name]["OrderID"] = OrderID
                if not department_data[department_name]["invoice_details"]:
                    department_data[department_name]["invoice_details"] = invoice_details
                department_data[department_name]["test_details"].append(test_details)
                department_data[department_name]["Test_Method"] = Test_Method
                department_data[department_name]["PackageName"] = PackageName

            if department_name == "MICROBIOLOGY" and Culturetest == "Yes":
                query1 = """SELECT DISTINCT Captured_Oraganism, Sensitive_Type, Antibiotic_Name, Antibiotic_Value
                            FROM Complete_Culture_Examination 
                            WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
                cursor.execute(query1, (Billinginvoice, patientid, Visitid))
                data1 = cursor.fetchall()

                column1 = [i[0] for i in cursor.description]
                result = defaultdict(list)

                sensitivity_order = {"Sensitive": 1, "Intermediate": 2, "Resistant": 3}

                for row in data1:
                    row_data = dict(zip(column1, row))
                    organism = row_data["Captured_Oraganism"]
                    query = """
                    SELECT `intermediate`, `resistant`, `sensitive` FROM AntibioticMaster WHERE anti_biotic = %s;
                    """
                    cursor.execute(query, (row_data["Antibiotic_Name"],))
                    fetched = cursor.fetchall()

                    intermediate, resistant, sensitive = "", "", ""
                    if fetched:
                        intermediate, resistant, sensitive = fetched[0]

                    antibiotic_info = {
                        "Antibiotic": row_data["Antibiotic_Name"],
                        "SensitivityType": row_data["Sensitive_Type"],
                        "CaptureValue": row_data["Antibiotic_Value"],
                        "Intermediate": intermediate,
                        "Resistant": resistant,
                        "Sensitive": sensitive,
                    }

                    result[organism].append(antibiotic_info)

                    query1 = """SELECT ColonyCount 
                        FROM Complete_Culture_Examination 
                        WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Captured_Oraganism = %s
                        ORDER BY CreatedAt DESC LIMIT 1;"""
                    cursor.execute(query1, (Billinginvoice, patientid, Visitid, organism))
                    row = cursor.fetchone()

                    ColonyCount = row[0] if row and row[0] is not None else ""
                    colony[organism] = ColonyCount

                for organism in result:
                    result[organism].sort(key=lambda x: sensitivity_order.get(x["SensitivityType"], float("inf")))

                final_result_micro = [
                    {organism: antibiotics} for organism, antibiotics in result.items()
                ]

                for test in ordered_dept_test_details[department_name]:
                    if "OrganismDetails" not in test:
                        test["OrganismDetails"] = final_result_micro
                        test["OrganismColony"] = colony
                    else:
                        test["OrganismDetails"].extend(final_result_micro)
                        test["OrganismColony"] = colony

            print("TEst----------",test_details)
        # Populate test details for groups and departments
        for group_name, test_details_list in ordered_test_details.items():
            if group_name and test_details_list:
                group_data[group_name]["test_details"] = test_details_list

        for dept_name, test_details_list in ordered_dept_test_details.items():
            if dept_name and test_details_list:
                department_data[dept_name]["test_details"] = test_details_list

        # Add group entries to test_details for Offers
        for group_name, data in group_data.items():
            if len(data["test_details"]) > 0 and group_name and data["Test_Method"] == "Offers":
                dept_name = data["department_name"]
                group_entry = {
                    "Packagegroup": [{
                        "groupname": group_name,
                        "department": data["department_name"],
                        "Report_Type": data["ReportType"],
                        "testdetails": data["test_details"],
                        "invoicedetails": data["invoice_details"],
                        "OrderID": data["OrderID"],
                        "Test_Method": data["Test_Method"],
                        "PackageName": data["PackageName"],
                    }]
                }
                department_data[dept_name]["test_details"].append(group_entry)

        final_result = []
        for dept_name, data in department_data.items():
            if len(data["test_details"]) > 0:
                dept_entry = {
                    "department": dept_name,
                    "Report_Type": data["ReportType"],
                    "testdetails": data["test_details"],
                    "invoicedetails": data["invoice_details"],
                    "OrderID": data["OrderID"],
                    "Test_Method": data["Test_Method"],
                    "PackageName": data["PackageName"],
                    "index": data["index"],
                    "Outsourcealert": data["Outsourcealert"]
                }
                final_result.append(dept_entry)

        for group_name, data in group_data.items():
            if len(data["test_details"]) > 0 and group_name and data["Test_Method"] != "Offers":
                final_result.append({
                    "groupname": group_name,
                    "department": data["department_name"],
                    "Report_Type": data["ReportType"],
                    "testdetails": data["test_details"],
                    "invoicedetails": data["invoice_details"],
                    "OrderID": data["OrderID"],
                    "Test_Method": data["Test_Method"],
                    "PackageName": data["PackageName"],
                })

        return JsonResponse(final_result, safe=False)

    except Exception as e:
        print(f"Error in getdataforreport: {str(e)}")
        return JsonResponse({"status": str(e)}, status=500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()




@csrf_exempt
def getdataforprovisionalreport(request):
    try:
        cursor = db.cursor()

        Visitid = request.GET.get("Visitid")
        patientid = request.GET.get("patientid")
        Billinginvoice = request.GET.get("Billinginvoice")
        needed = request.GET.get("Filter")
        print(needed)
        Filtered = [x.strip() for x in needed.split(",") if x.strip().lower() != "undefined"]
        print(Filtered)
        # Main query to fetch test data
        query = """
            WITH RankedResults AS (
                SELECT
                    bit.*,
                    td.Test_Name AS td_Test_Name,
                    sd.SubDepartment_Name,
                    td.Header,
                    td.Billing_Name,
                    td.Container_Name_id,
                    td.Specimen_Name_id,
                    mm.Method_Name,
                    td.Gender AS td_Gender,
                    td.Input_Type,
                    td.Decimal_Palces,
                    td.Input_Pattern_Type,
                    td.Test_Category,
                    td.Captured_Unit,
                    uom.Unit_Name,
                    td.Test_Instructions,
                    td.Culturetest,
                    d.SubDepartment_Code_id,
                    d.OrderID,
                    Ap.Reference_Range AS ReferenceRange,
                    rpd.Gender AS rpd_Gender,
                    bit.Test_Method AS bit_Test_Method,
                    bit.Group_Name AS bit_Group_Name,
                    Ap.Technical_Remark,
                    asm.NormalValue,
                    asm.PanicLow AS Panic_Low,
                    asm.PanicHigh AS Panic_High,
                    bit.Item_Id AS bit_Item_Id,
                    bit.PackageCode AS bit_PackageCode,
                    bit.Group_Code AS bit_Group_Code,
                    Ap.Capture_Value,
                    Ap.Report_Type,
                    Ap.Microscopy_Data,
                    Ap.Notes,
                    Ap.Colony_Count,
                    Ap.Culture_Report,
                    Ap.EditContent,
                    td.DisplayText,
                    Ap.Sample_Specimen,
                    Ap.Bacteria_Isolated,
                    Ap.micronumber,
                    Ap.site,
                    Ap.macroscopy,
                    td.Iscutoffvalue,
                    Ap.Result,
                    Ap.srfId,
                    Ap.icmrId,
                    Ap.specimenCondition,
                    Ap.covidType,
                    Ap.covidResult,
                    Ap.histonumber,
                    Ap.labtechnician,
                    Ap.pathologyremarks,
                    Ap.pathologyyesorno,
                    Ap.abstinence,
                    ROW_NUMBER() OVER (PARTITION BY bit.Test_Code ORDER BY asm.updated_at DESC) AS rn,
                    Ap.CreatedBy as tech,
                    Asr.CreatedBy as sr_tech,
                    Ap.acid_fast,
                    Ap.Report_Status,
                    Ap.positivity,
                    Ap.Reportfile,
                    Ap.rangeType
                FROM
                    Billing_Item_Table_for_lab AS bit
                LEFT JOIN
                    Test_Descriptions AS td ON td.Test_Code = bit.Test_Code
                
                LEFT JOIN
                    DepartmentOrderMaster d ON td.Sub_Department_id = d.SubDepartment_Code_id
                LEFT JOIN
                    Age_Setup_Master AS asm ON asm.Test_Code_id = bit.Test_Code
                LEFT JOIN
                    Register_patient_Details AS rpd ON rpd.Patient_Id = bit.Patient_Id
                INNER JOIN
                    AnalyseInvestigationResult AS Ap ON Ap.Billing_Invoice = bit.Billing_Invoice
                        AND Ap.Test_Code = bit.Test_Code
                LEFT JOIN
                    AnalyseInvestigationSenior AS Asr ON Asr.Billing_Invoice = bit.Billing_Invoice
                        AND Asr.Test_Code = bit.Test_Code
                LEFT JOIN 
                    sublab_department_detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
                LEFT JOIN 
                    unit_masters uom ON td.UOM_id = uom.Unit_Code
                    AND td.UOM_id IS NOT NULL 
                    AND td.UOM_id != '' 
                LEFT JOIN 
                    methods_masters mm ON td.Method_Name_id = mm.Method_Code
                    AND td.Method_Name_id IS NOT NULL 
                    AND td.Method_Name_id != '' 
                WHERE
                    bit.Patient_Id = %s
                    AND bit.Visit_Id = %s
                    AND bit.Billing_Invoice = %s
                    AND Ap.Status = 'Completed'
            )
            SELECT
                RankedResults.*
            FROM
                RankedResults
            WHERE
                rn = 1
            ORDER BY
                RankedResults.bit_Item_Id ASC
        """
        cursor.execute(query, (patientid, Visitid, Billinginvoice))
        data = cursor.fetchall()
        column = [i[0] for i in cursor.description]
        print('oneee',len(data))
        if Filtered and len(Filtered) > 0:
            filtered_data = [row for row in data if row[18] in Filtered]
            print(len(filtered_data))
            data = filtered_data

        # Debug: Log column names to verify 'bit_Item_Id' presence
        if 'bit_Item_Id' not in column:
            print("Warning: 'bit_Item_Id' not found in query results. Columns:", column)

        # Fetch all interpretations for relevant Test_Codes
        test_codes = set(row[column.index("Test_Code")] for row in data)

        print("Test_Code",len(test_codes))
        # test_codes = test_codes.intersection(Filtered)
        print(len(test_codes))
        
        print(data)

        interpretation_query = """
            SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
            FROM Testmaster_Interpretation_table
            WHERE Test_Code_id IN (%s)
        """ % ','.join(['%s'] * len(test_codes))
        cursor.execute(interpretation_query, list(test_codes))
        interpretation_data = cursor.fetchall()
        interpretation_columns = [i[0] for i in cursor.description]

        # Map interpretations to Test_Code
        interpretations_by_test_code = defaultdict(list)
        for row in interpretation_data:
            row_dict = dict(zip(interpretation_columns, row))
            test_code = row_dict["Test_Code_id"]
            interpretations_by_test_code[test_code].append({
                "Test_Id": row_dict.get("Test_Id", ""),
                "Header_interpretation": row_dict.get("Header_interpretation", ""),
                "Comments": row_dict.get("Comments", "")
            })

        # Fetch all guidelines for relevant Test_Codes
        guideline_query = """
            SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
            FROM Testmaster_guideline_table
            WHERE Test_Code_id IN (%s)
        """ % ','.join(['%s'] * len(test_codes))
        cursor.execute(guideline_query, list(test_codes))
        guideline_data = cursor.fetchall()
        guideline_columns = [i[0] for i in cursor.description]

        # Map guidelines to Test_Code
        guidelines_by_test_code = defaultdict(list)
        for row in guideline_data:
            row_dict = dict(zip(guideline_columns, row))
            test_code = row_dict["Test_Code_id"]
            guidelines_by_test_code[test_code].append({
                "Test_Id": row_dict.get("Test_Id", ""),
                "Header_interpretation": row_dict.get("Header_interpretation", ""),
                "Comments": row_dict.get("Comments", "")
            })

        def convert_to_serializable(item):
            if isinstance(item, datetime.datetime):
                return item.strftime("%Y-%m-%d %H:%M:%S")
            return item

        def extract_panic_range(reference_range, gender):
            # Placeholder for extract_panic_range function
            return None, None

        department_data = defaultdict(
            lambda: {
                "invoice_details": {},
                "test_details": [],
                "ReportType": None,
                "OrderID": None,
                "Test_Method": None,
                "PackageName": None,
                "index": None,
                "Outsourcealert": []
            }
        )

        group_data = defaultdict(
            lambda: {
                "invoice_details": {},
                "test_details": [],
                "ReportType": None,
                "OrderID": None,
                "Test_Method": None,
                "PackageName": None,
                "department_name": None,
            }
        )

        test_map = {}
        subtest_map = {}
        ordered_test_details = defaultdict(list)
        ordered_dept_test_details = defaultdict(list)
        processed_subtest_ids = set()
        colony = {}

        # Populate test_map and subtest_map
        for row in data:
            row_dict = dict(
                (column[i], convert_to_serializable(row[i])) for i in range(len(row))
            )
            if "bit_Item_Id" in row_dict:
                test_map[row_dict["bit_Item_Id"]] = row_dict
            else:
                print(f"Warning: bit_Item_Id missing in row: {row_dict}")
            if row_dict.get("SubTestCodes"):
                subtest_map[row_dict["SubTestCodes"]] = row_dict.get("bit_Item_Id")

        for row in data:
            row_dict = dict(
                (column[i], convert_to_serializable(row[i])) for i in range(len(row))
            )

            invoice_no = row_dict.get("Billing_Invoice")
            department_name = row_dict.get("SubDepartment_Name")
            patient_gender = row_dict.get("rpd_Gender")
            Report_Type = row_dict.get("Report_Type")
            OrderID = row_dict.get("OrderID")
            Test_Method = row_dict.get("Test_Method")
            Group_Name = row_dict.get("Group_Name")
            PackageCode = row_dict.get("bit_PackageCode")
            Group_Code = row_dict.get("bit_Group_Code")
            test_code = row_dict.get("Test_Code")
            patient_id = row_dict.get("Patient_Id")
            invoice = row_dict.get("Billing_Invoice")
            Culturetest = row_dict.get("Culturetest")

            Reportfile = row_dict.get("Reportfile")

            # Fetch PackageName
            PackageName = ""
            if PackageCode:
                query1 = """SELECT package_name FROM OfferPackage WHERE package_code = %s"""
                cursor.execute(query1, (PackageCode,))
                package_result = cursor.fetchone()
                PackageName = package_result[0] if package_result else ""
                if not package_result:
                    print(f"Warning: PackageCode {PackageCode} not found in OfferPackage table")

            invoice_details = {
                "Billing_Invoice": row_dict.get("Billing_Invoice"),
                "Patient_Id": row_dict.get("Patient_Id"),
                "Visit_Id": row_dict.get("Visit_Id"),
                "Patient_Name": row_dict.get("Patient_Name"),
                "Gross_Amount": row_dict.get("Gross_Amount"),
                "Location": row_dict.get("Location"),
                "Service_Status": row_dict.get("Service_Status"),
                "Analysis_Status": row_dict.get("Analysis_Status"),
                "Verify_Status": row_dict.get("Verify_Status"),
                "Approve_Status": row_dict.get("Approve_Status"),
                "Barcode_Id": row_dict.get("Barcode_Id"),
                "CreatedBy": row_dict.get("CreatedBy"),
                "Billing_Date": row_dict.get("Billing_Date"),
                "UpdatedAt": row_dict.get("UpdatedAt"),
                "CreatedAt": row_dict.get("CreatedAt"),
            }

            updated_at_data_offer = {
                "AnalyseInvestigationResult": "N/A",
                "AnalyseInvestigationSenior": "N/A",
                "Approve_Test_Pathologist": "N/A"
            }
            cursor.execute("""
                SELECT 'AnalyseInvestigationResult' AS Source, DATE_FORMAT(MAX(CreatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
                FROM Sample_Capture_in_Phelobotomist 
                WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
                UNION ALL
                SELECT 'AnalyseInvestigationSenior', DATE_FORMAT(MAX(UpdatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
                FROM Sample_Capture_in_Phelobotomist 
                WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
                UNION ALL
                SELECT 'Approve_Test_Pathologist', DATE_FORMAT(MAX(UpdatedAt), '%%d-%%m-%%Y %%h:%%i %%p') AS LatestDate
                FROM AnalyseInvestigationResult 
                WHERE Test_Code = %s AND Patient_Id = %s AND Billing_Invoice = %s
            """, [test_code, patient_id, invoice, test_code, patient_id, invoice, test_code, patient_id, invoice])
            updates = cursor.fetchall()

            # for source, updated_at in updates:
            #     if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at.strftime("%d/%m/%Y %H:%M") > updated_at_data_offer[source]):
            #         updated_at_data_offer[source] = updated_at.strftime("%d/%m/%Y %H:%M")

            for source, updated_at in updates:
                if updated_at and (updated_at_data_offer[source] == "N/A" or updated_at > updated_at_data_offer[source]):
                    updated_at_data_offer[source] = updated_at  # already formatted string like "20-08-2025 02:15 PM"
            
            print("TIME----------",updated_at_data_offer)

            invoice_details.update(updated_at_data_offer)

            test_details = {
                key: row_dict[key]
                for key in row_dict
                if key not in ["Billing_Invoice", "Sub_Department"]
            }

            
            file_base64 = None
            if Reportfile:
                file_base64 = base64.b64encode(Reportfile).decode('utf-8')
                file_base64 = f"data:application/pdf;base64,{file_base64}"
            
            test_details["Reportfile"] = file_base64

            test_details["testinterpreatation"] = interpretations_by_test_code.get(test_code, [])
            test_details["guidelines_interpretation"] = guidelines_by_test_code.get(test_code, [])

            reference_range = row_dict.get("ReferenceRange")
            NormalValue = row_dict.get("NormalValue")
            Panic_Low = row_dict.get("Panic_Low")
            Panic_High = row_dict.get("Panic_High")

            if NormalValue == "Yes":
                panic_low, panic_high = extract_panic_range(reference_range, patient_gender)
                test_details["paniclow"] = panic_low
                test_details["panichigh"] = panic_high
            else:
                test_details["paniclow"] = Panic_Low
                test_details["panichigh"] = Panic_High

            Capture_Value = row_dict.get("Capture_Value")
            if Capture_Value is not None:
                if Capture_Value.replace(".", "", 1).isdigit():
                    if "." in Capture_Value:
                        test_details["Capture_Value"] = Decimal(Capture_Value)
                    else:
                        test_details["Capture_Value"] = int(Capture_Value)
                else:
                    test_details["Capture_Value"] = Capture_Value

            test_details["Billing_Invoice"] = invoice_no

            parent_group_name = None
            parent_department_name = None
            if row_dict["Test_Code"] in subtest_map:
                parent_item_id = subtest_map[row_dict["Test_Code"]]
                parent_group_name = test_map.get(parent_item_id, {}).get("Group_Name")
                parent_department_name = test_map.get(parent_item_id, {}).get("SubDepartment_Name")
                if row_dict.get("bit_Item_Id") in processed_subtest_ids:
                    continue

            if Test_Method == "Offers":
                if Group_Name or parent_group_name:
                    target_group_name = Group_Name if Group_Name else parent_group_name
                    group_data[target_group_name]["ReportType"] = "Group"
                    group_data[target_group_name]["OrderID"] = OrderID
                    group_data[target_group_name]["Test_Method"] = Test_Method
                    group_data[target_group_name]["PackageName"] = PackageName

                    selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
                    cursor.execute(selectquery1, (Group_Code,) if Group_Code else (test_map.get(parent_item_id, {}).get("Group_Code"),))
                    group_result = cursor.fetchone()
                    group_department_name = group_result[0] if group_result else department_name
                    group_data[target_group_name]["department_name"] = group_department_name

                    if not group_data[target_group_name]["invoice_details"]:
                        group_data[target_group_name]["invoice_details"] = invoice_details

                    if not parent_group_name or row_dict.get("bit_Item_Id") not in processed_subtest_ids:
                        ordered_test_details[target_group_name].append(test_details)

                    if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
                        subtest_code = row_dict["SubTestCodes"]
                        subtest_item_id = next(
                            (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
                            None
                        )
                        if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
                            subtest_details = test_map[subtest_item_id].copy()
                            subtest_details["Billing_Invoice"] = invoice_no
                            subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
                            subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
                            sub_ref_range = subtest_details.get("ReferenceRange")
                            sub_normal = subtest_details.get("NormalValue")
                            if sub_normal == "Yes":
                                sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
                                subtest_details["paniclow"] = sub_panic_low
                                subtest_details["panichigh"] = sub_panic_high
                            ordered_test_details[target_group_name].append(subtest_details)
                            processed_subtest_ids.add(subtest_item_id)

                else:
                    department_data[department_name]["OrderID"] = OrderID
                    if not department_data[department_name]["invoice_details"]:
                        department_data[department_name]["invoice_details"] = invoice_details
                    department_data[department_name]["test_details"].append(test_details)
                    department_data[department_name]["Test_Method"] = Test_Method
                    department_data[department_name]["PackageName"] = PackageName

            elif Test_Method == "Group":
                group_data[Group_Name]["ReportType"] = Report_Type
                group_data[Group_Name]["OrderID"] = OrderID
                group_data[Group_Name]["Test_Method"] = Test_Method
                group_data[Group_Name]["PackageName"] = PackageName

                selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
                cursor.execute(selectquery1, (Group_Code,))
                group_result = cursor.fetchone()
                group_department_name = group_result[0] if group_result else None
                group_data[Group_Name]["department_name"] = group_department_name

                if not group_data[Group_Name]["invoice_details"]:
                    group_data[Group_Name]["invoice_details"] = invoice_details

                if row_dict.get("bit_Item_Id") not in processed_subtest_ids:
                    ordered_test_details[Group_Name].append(test_details)
                if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
                    subtest_code = row_dict["SubTestCodes"]
                    subtest_item_id = next(
                        (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
                        None
                    )
                    if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
                        subtest_details = test_map[subtest_item_id].copy()
                        subtest_details["Billing_Invoice"] = invoice_no
                        subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
                        subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
                        sub_ref_range = subtest_details.get("ReferenceRange")
                        sub_normal = subtest_details.get("NormalValue")
                        if sub_normal == "Yes":
                            sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
                            subtest_details["paniclow"] = sub_panic_low
                            subtest_details["panichigh"] = sub_panic_high
                        ordered_test_details[Group_Name].append(subtest_details)
                        processed_subtest_ids.add(subtest_item_id)

            else:
                department_data[department_name]["OrderID"] = OrderID
                if not department_data[department_name]["invoice_details"]:
                    department_data[department_name]["invoice_details"] = invoice_details
                department_data[department_name]["test_details"].append(test_details)
                department_data[department_name]["Test_Method"] = Test_Method
                department_data[department_name]["PackageName"] = PackageName

            if department_name == "MICROBIOLOGY" and Culturetest == "Yes":
                query1 = """SELECT DISTINCT Captured_Oraganism, Sensitive_Type, Antibiotic_Name, Antibiotic_Value
                            FROM Complete_Culture_Examination 
                            WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
                cursor.execute(query1, (Billinginvoice, patientid, Visitid))
                data1 = cursor.fetchall()

                column1 = [i[0] for i in cursor.description]
                result = defaultdict(list)

                sensitivity_order = {"Sensitive": 1, "Intermediate": 2, "Resistant": 3}

                for row in data1:
                    row_data = dict(zip(column1, row))
                    organism = row_data["Captured_Oraganism"]
                    query = """
                    SELECT `intermediate`, `resistant`, `sensitive` FROM AntibioticMaster WHERE anti_biotic = %s;
                    """
                    cursor.execute(query, (row_data["Antibiotic_Name"],))
                    fetched = cursor.fetchall()

                    intermediate, resistant, sensitive = "", "", ""
                    if fetched:
                        intermediate, resistant, sensitive = fetched[0]

                    antibiotic_info = {
                        "Antibiotic": row_data["Antibiotic_Name"],
                        "SensitivityType": row_data["Sensitive_Type"],
                        "CaptureValue": row_data["Antibiotic_Value"],
                        "Intermediate": intermediate,
                        "Resistant": resistant,
                        "Sensitive": sensitive,
                    }

                    result[organism].append(antibiotic_info)

                    query1 = """SELECT ColonyCount 
                        FROM Complete_Culture_Examination 
                        WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Captured_Oraganism = %s
                        ORDER BY CreatedAt DESC LIMIT 1;"""
                    cursor.execute(query1, (Billinginvoice, patientid, Visitid, organism))
                    row = cursor.fetchone()

                    ColonyCount = row[0] if row and row[0] is not None else ""
                    colony[organism] = ColonyCount

                for organism in result:
                    result[organism].sort(key=lambda x: sensitivity_order.get(x["SensitivityType"], float("inf")))

                final_result_micro = [
                    {organism: antibiotics} for organism, antibiotics in result.items()
                ]

                for test in ordered_dept_test_details[department_name]:
                    if "OrganismDetails" not in test:
                        test["OrganismDetails"] = final_result_micro
                        test["OrganismColony"] = colony
                    else:
                        test["OrganismDetails"].extend(final_result_micro)
                        test["OrganismColony"] = colony

        # Populate test details for groups and departments
        for group_name, test_details_list in ordered_test_details.items():
            if group_name and test_details_list:
                group_data[group_name]["test_details"] = test_details_list

        for dept_name, test_details_list in ordered_dept_test_details.items():
            if dept_name and test_details_list:
                department_data[dept_name]["test_details"] = test_details_list

        # Add group entries to test_details for Offers
        for group_name, data in group_data.items():
            if len(data["test_details"]) > 0 and group_name and data["Test_Method"] == "Offers":
                dept_name = data["department_name"]
                group_entry = {
                    "Packagegroup": [{
                        "groupname": group_name,
                        "department": data["department_name"],
                        "Report_Type": data["ReportType"],
                        "testdetails": data["test_details"],
                        "invoicedetails": data["invoice_details"],
                        "OrderID": data["OrderID"],
                        "Test_Method": data["Test_Method"],
                        "PackageName": data["PackageName"],
                    }]
                }
                department_data[dept_name]["test_details"].append(group_entry)

        final_result = []
        for dept_name, data in department_data.items():
            if len(data["test_details"]) > 0:
                dept_entry = {
                    "department": dept_name,
                    "Report_Type": data["ReportType"],
                    "testdetails": data["test_details"],
                    "invoicedetails": data["invoice_details"],
                    "OrderID": data["OrderID"],
                    "Test_Method": data["Test_Method"],
                    "PackageName": data["PackageName"],
                    "index": data["index"],
                    "Outsourcealert": data["Outsourcealert"]
                }
                final_result.append(dept_entry)

        for group_name, data in group_data.items():
            if len(data["test_details"]) > 0 and group_name and data["Test_Method"] != "Offers":
                final_result.append({
                    "groupname": group_name,
                    "department": data["department_name"],
                    "Report_Type": data["ReportType"],
                    "testdetails": data["test_details"],
                    "invoicedetails": data["invoice_details"],
                    "OrderID": data["OrderID"],
                    "Test_Method": data["Test_Method"],
                    "PackageName": data["PackageName"],
                })

        return JsonResponse(final_result, safe=False)

    except Exception as e:
        print(f"Error in getdataforreport: {str(e)}")
        return JsonResponse({"status": str(e)}, status=500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()











from django.utils import timezone
from OutPatient.models import *
from MCI.models import *
from django.db.models import Q
import datetime

@csrf_exempt
def getdataformrdreport(request):
    try:
        cursor = db.cursor()

        patientid = request.GET.get("patientid")
        requestid = request.GET.get("requestId")
        needed = request.GET.get("Filter")
        created = request.GET.get("date")
        register = request.GET.get('opip')
        frequest = request.GET.get('frequest')
        Filtered = [x.strip() for x in needed.split(",") if x.strip().lower() != "undefined"]
        # print("Needed-------->>",Filtered)

        # bill = BillingInvoiceAndBillAmount.objects.filter(Request_Id=requestid,Patient_Id=patientid).first()

        final_tests = []

        for test in list(Filtered):   
            if test.startswith("LGM"):
                # print("this is a group test", test)
                group_tests = Group_Master_TestList.objects.filter(
                    Group_Code__Group_Code=test
                ).values_list("Test_Code", flat=True)

                final_tests.extend(group_tests)
            elif test.startswith("PAC"):
                print("this is a package test", test)
                offer_items = OfferPackageList.objects.filter(
                    package_code=test
                ).values_list("Test_Code", "Group_Code")
                for test_code, group_code in offer_items:
                    if group_code and group_code.startswith("LGM"):
                        print("package contains group", group_code)
                        group_tests = Group_Master_TestList.objects.filter(
                            Group_Code__Group_Code=group_code
                        ).values_list("Test_Code", flat=True)
                        final_tests.extend(group_tests)
                    elif test_code:
                        print("package contains individual test", test_code)
                        final_tests.append(test_code)
            else:
                print("this is an individual test", test)
                final_tests.append(test)

        Filtered = list(dict.fromkeys(final_tests))
        print("Now Mani Query")
        query = """
            WITH RankedResults AS (
                SELECT
                    bit.*,
                    td.Test_Name AS td_Test_Name,
                    sd.SubDepartment_Name,
                    td.Header,
                    td.Billing_Name,
                    td.Container_Name_id,
                    td.Specimen_Name_id,
                    mm.Method_Name,
                    td.Gender AS td_Gender,
                    td.Input_Type,
                    td.Decimal_Palces,
                    td.Input_Pattern_Type,
                    td.Test_Category,
                    td.Captured_Unit,
                    uom.Unit_Name,
                    td.Test_Instructions,
                    td.Culturetest,
                    d.SubDepartment_Code_id,
                    d.OrderID,
                    Ap.Reference_Range AS ReferenceRange,
                    rpd.Gender AS rpd_Gender,
                    bit.Test_Method AS bit_Test_Method,
                    bit.Group_Name AS bit_Group_Name,
                    Ap.Technical_Remark,
                    asm.NormalValue,
                    asm.PanicLow AS Panic_Low,
                    asm.PanicHigh AS Panic_High,
                    bit.Item_Id AS bit_Item_Id,
                    bit.PackageCode AS bit_PackageCode,
                    bit.Group_Code AS bit_Group_Code,
                    Ap.Capture_Value,
                    Ap.Report_Type,
                    Ap.Microscopy_Data,
                    Ap.Notes,
                    Ap.Colony_Count,
                    Ap.Culture_Report,
                    Ap.EditContent,
                    td.DisplayText,
                    Ap.Sample_Specimen,
                    Ap.Bacteria_Isolated,
                    Ap.micronumber,
                    Ap.site,
                    Ap.macroscopy,
                    td.Iscutoffvalue,
                    Ap.Result,
                    Ap.srfId,
                    Ap.icmrId,
                    Ap.specimenCondition,
                    Ap.covidType,
                    Ap.covidResult,
                    Ap.histonumber,
                    Ap.labtechnician,
                    Ap.pathologyremarks,
                    Ap.pathologyyesorno,
                    Ap.abstinence,
                    ROW_NUMBER() OVER (
                        PARTITION BY bit.Test_Code
                        ORDER BY asm.updated_at DESC
                    ) AS rn,
                    Ap.CreatedBy AS tech,
                    Asr.CreatedBy AS sr_tech,
                    Ap.acid_fast,
                    Ap.Report_Status,
                    Ap.positivity,
                    Ap.Reportfile,
                    Ap.rangeType
                FROM Billing_Item_Table_for_lab AS bit
                LEFT JOIN Test_Descriptions td ON td.Test_Code = bit.Test_Code
                LEFT JOIN Age_Setup_Master asm ON asm.Test_Code_id = bit.Test_Code
                INNER JOIN AnalyseInvestigationResult Ap
                    ON Ap.Billing_Invoice = bit.Billing_Invoice
                    AND Ap.Test_Code = bit.Test_Code
                LEFT JOIN AnalyseInvestigationSenior Asr
                    ON Asr.Billing_Invoice = bit.Billing_Invoice
                    AND Asr.Test_Code = bit.Test_Code
                LEFT JOIN sublab_department_detials sd
                    ON td.Sub_Department_id = sd.SubDepartment_Code
                LEFT JOIN unit_masters uom
                    ON td.UOM_id = uom.Unit_Code
                LEFT JOIN methods_masters mm
                    ON td.Method_Name_id = mm.Method_Code
                LEFT JOIN DepartmentOrderMaster d
                    ON td.Sub_Department_id = d.SubDepartment_Code_id
                LEFT JOIN Register_patient_Details rpd
                    ON rpd.Patient_Id = bit.Patient_Id
                WHERE
                    Ap.Test_Code IN %s
            )
            SELECT *
            FROM RankedResults
            WHERE rn = 1
            ORDER BY bit_Item_Id ASC
        """
        
        
        if len(Filtered) > 0:
            # print("Inside Condition",Filtered)
            cursor.execute(query, (tuple(Filtered),))
            data = cursor.fetchall()
            column = [i[0] for i in cursor.description]
            # print("Before filter",data)

        # if Filtered and len(Filtered) > 0:
        #     print("Inside--------")
        #     filtered_data = [row for row in data if row[18] in Filtered]
        #     data = filtered_data
        # print("After filter",data)


        # Debug: Log column names to verify 'bit_Item_Id' presence
        if 'bit_Item_Id' not in column:
            print("Warning: 'bit_Item_Id' not found in query results. Columns:", column)

        # Fetch all interpretations for relevant Test_Codes
        test_codes = set(row[column.index("Test_Code")] for row in data)

        print("testtttttttttttttt",test_codes)
        
        interpretation_query = """
            SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
            FROM Testmaster_Interpretation_table
            WHERE Test_Code_id IN (%s)
        """ % ','.join(['%s'] * len(test_codes))
        cursor.execute(interpretation_query, list(test_codes))
        interpretation_data = cursor.fetchall()
        interpretation_columns = [i[0] for i in cursor.description]

        # Map interpretations to Test_Code
        interpretations_by_test_code = defaultdict(list)
        for row in interpretation_data:
            row_dict = dict(zip(interpretation_columns, row))
            test_code = row_dict["Test_Code_id"]
            interpretations_by_test_code[test_code].append({
                "Test_Id": row_dict.get("Test_Id", ""),
                "Header_interpretation": row_dict.get("Header_interpretation", ""),
                "Comments": row_dict.get("Comments", "")
            })

        # Fetch all guidelines for relevant Test_Codes
        guideline_query = """
            SELECT Test_Id, Header_interpretation, Comments, Test_Code_id
            FROM Testmaster_guideline_table
            WHERE Test_Code_id IN (%s)
        """ % ','.join(['%s'] * len(test_codes))
        cursor.execute(guideline_query, list(test_codes))
        guideline_data = cursor.fetchall()
        guideline_columns = [i[0] for i in cursor.description]

        # Map guidelines to Test_Code
        guidelines_by_test_code = defaultdict(list)
        for row in guideline_data:
            row_dict = dict(zip(guideline_columns, row))
            test_code = row_dict["Test_Code_id"]
            guidelines_by_test_code[test_code].append({
                "Test_Id": row_dict.get("Test_Id", ""),
                "Header_interpretation": row_dict.get("Header_interpretation", ""),
                "Comments": row_dict.get("Comments", "")
            })

        def convert_to_serializable(item):
            if isinstance(item, datetime.datetime):
                return item.strftime("%Y-%m-%d %H:%M:%S")
            return item

        def extract_panic_range(reference_range, gender):
            # Placeholder for extract_panic_range function
            return None, None

        department_data = defaultdict(
            lambda: {
                "invoice_details": {},
                "test_details": [],
                "ReportType": None,
                "OrderID": None,
                "Test_Method": None,
                "PackageName": None,
                "index": None,
                "Outsourcealert": []
            }
        )

        group_data = defaultdict(
            lambda: {
                "invoice_details": {},
                "test_details": [],
                "ReportType": None,
                "OrderID": None,
                "Test_Method": None,
                "PackageName": None,
                "department_name": None,
            }
        )

        test_map = {}
        subtest_map = {}
        ordered_test_details = defaultdict(list)
        ordered_dept_test_details = defaultdict(list)
        processed_subtest_ids = set()
        colony = {}

        # Populate test_map and subtest_map
        for row in data:
            row_dict = dict(
                (column[i], convert_to_serializable(row[i])) for i in range(len(row))
            )
            if "bit_Item_Id" in row_dict:
                test_map[row_dict["bit_Item_Id"]] = row_dict
            else:
                print(f"Warning: bit_Item_Id missing in row: {row_dict}")
            if row_dict.get("SubTestCodes"):
                subtest_map[row_dict["SubTestCodes"]] = row_dict.get("bit_Item_Id")

        for row in data:
            row_dict = dict(
                (column[i], convert_to_serializable(row[i])) for i in range(len(row))
            )

            invoice_no = row_dict.get("Billing_Invoice")
            department_name = row_dict.get("SubDepartment_Name")
            patient_gender = row_dict.get("rpd_Gender")
            Report_Type = row_dict.get("Report_Type")
            OrderID = row_dict.get("OrderID")
            Test_Method = row_dict.get("Test_Method")
            Group_Name = row_dict.get("Group_Name")
            PackageCode = row_dict.get("bit_PackageCode")
            Group_Code = row_dict.get("bit_Group_Code")
            test_code = row_dict.get("Test_Code")
            patient_id = row_dict.get("Patient_Id")
            invoice = row_dict.get("Billing_Invoice")
            Culturetest = row_dict.get("Culturetest")
            visit = row_dict.get("Visit_Id")

            # Fetch PackageName
            PackageName = ""
            if PackageCode:
                query1 = """SELECT package_name FROM OfferPackage WHERE package_code = %s"""
                cursor.execute(query1, (PackageCode,))
                package_result = cursor.fetchone()
                PackageName = package_result[0] if package_result else ""
                if not package_result:
                    print(f"Warning: PackageCode {PackageCode} not found in OfferPackage table")

            req_data = MCI_Lab_Request_Details.objects.filter(Request_Id = requestid).first()

            if req_data.IP_Register_Id:
                patient= req_data.IP_Register_Id

            elif req_data.OP_Register_Id:
                patient= req_data.OP_Register_Id
            else:
                patient = None
            if patient:
                invoice_details = {
                    "Billing_Invoice": patient.Registration_Id,
                    "Patient_Id": patient.PatientId.PatientNo ,
                    "Visit_Id": 1,
                    "Patient_Name":  patient.PatientId.FirstName ,
                    "Gross_Amount": "0.00",
                    "Location": None,
                    "Service_Status": "Completed",
                    "Analysis_Status": "Completed",
                    "Verify_Status":"Completed",
                    "Approve_Status": "Completed",
                    "Barcode_Id": patient.PatientId.PatientNo ,
                    "CreatedBy": req_data.created_by,
                    "Billing_Date": req_data.created_at,
                    "UpdatedAt":  req_data.updated_at,
                    "CreatedAt":  req_data.created_at,
                }

                updated_at_data_offer = {
                    "AnalyseInvestigationResult": req_data.created_at.date(),
                    "AnalyseInvestigationSenior": req_data.created_at.date(),
                    "Approve_Test_Pathologist": req_data.created_at.date()
                }
                invoice_details.update(updated_at_data_offer)

            test_details = {
                key: row_dict[key]
                for key in row_dict
                if key not in ["Billing_Invoice", "Sub_Department"]
            }

            test_details["testinterpreatation"] = interpretations_by_test_code.get(test_code, [])
            test_details["guidelines_interpretation"] = guidelines_by_test_code.get(test_code, [])

            reference_range = row_dict.get("ReferenceRange")
            NormalValue = row_dict.get("NormalValue")
            Panic_Low = row_dict.get("Panic_Low")
            Panic_High = row_dict.get("Panic_High")

            if NormalValue == "Yes":
                panic_low, panic_high = extract_panic_range(reference_range, patient_gender)
                test_details["paniclow"] = panic_low
                test_details["panichigh"] = panic_high
            else:
                test_details["paniclow"] = Panic_Low
                test_details["panichigh"] = Panic_High

            Capture_Value = row_dict.get("Capture_Value")
            if Capture_Value is not None:
                if Capture_Value.replace(".", "", 1).isdigit():
                    if "." in Capture_Value:
                        test_details["Capture_Value"] = Decimal(Capture_Value)
                    else:
                        test_details["Capture_Value"] = int(Capture_Value)
                else:
                    test_details["Capture_Value"] = Capture_Value

            test_details["Billing_Invoice"] = invoice_no

            parent_group_name = None
            parent_department_name = None
            if row_dict["Test_Code"] in subtest_map:
                parent_item_id = subtest_map[row_dict["Test_Code"]]
                parent_group_name = test_map.get(parent_item_id, {}).get("Group_Name")
                parent_department_name = test_map.get(parent_item_id, {}).get("SubDepartment_Name")
                if row_dict.get("bit_Item_Id") in processed_subtest_ids:
                    continue

            if Test_Method == "Offers":
                if Group_Name or parent_group_name:
                    target_group_name = Group_Name if Group_Name else parent_group_name
                    group_data[target_group_name]["ReportType"] = "Group"
                    group_data[target_group_name]["OrderID"] = OrderID
                    group_data[target_group_name]["Test_Method"] = Test_Method
                    group_data[target_group_name]["PackageName"] = PackageName

                    selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
                    cursor.execute(selectquery1, (Group_Code,) if Group_Code else (test_map.get(parent_item_id, {}).get("Group_Code"),))
                    group_result = cursor.fetchone()
                    group_department_name = group_result[0] if group_result else department_name
                    group_data[target_group_name]["department_name"] = group_department_name

                    if not group_data[target_group_name]["invoice_details"]:
                        group_data[target_group_name]["invoice_details"] = invoice_details

                    if not parent_group_name or row_dict.get("bit_Item_Id") not in processed_subtest_ids:
                        ordered_test_details[target_group_name].append(test_details)

                    if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
                        subtest_code = row_dict["SubTestCodes"]
                        subtest_item_id = next(
                            (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
                            None
                        )
                        if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
                            subtest_details = test_map[subtest_item_id].copy()
                            subtest_details["Billing_Invoice"] = invoice_no
                            subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
                            subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
                            sub_ref_range = subtest_details.get("ReferenceRange")
                            sub_normal = subtest_details.get("NormalValue")
                            if sub_normal == "Yes":
                                sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
                                subtest_details["paniclow"] = sub_panic_low
                                subtest_details["panichigh"] = sub_panic_high
                            ordered_test_details[target_group_name].append(subtest_details)
                            processed_subtest_ids.add(subtest_item_id)

                else:
                    department_data[department_name]["OrderID"] = OrderID
                    if not department_data[department_name]["invoice_details"]:
                        department_data[department_name]["invoice_details"] = invoice_details
                    department_data[department_name]["test_details"].append(test_details)
                    department_data[department_name]["Test_Method"] = Test_Method
                    department_data[department_name]["PackageName"] = PackageName

            elif Test_Method == "Group":
                group_data[Group_Name]["ReportType"] = Report_Type
                group_data[Group_Name]["OrderID"] = OrderID
                group_data[Group_Name]["Test_Method"] = Test_Method
                group_data[Group_Name]["PackageName"] = PackageName

                selectquery1 = """SELECT department_name FROM GroupMaster WHERE Group_Code=%s"""
                cursor.execute(selectquery1, (Group_Code,))
                group_result = cursor.fetchone()
                group_department_name = group_result[0] if group_result else None
                group_data[Group_Name]["department_name"] = group_department_name

                if not group_data[Group_Name]["invoice_details"]:
                    group_data[Group_Name]["invoice_details"] = invoice_details

                if row_dict.get("bit_Item_Id") not in processed_subtest_ids:
                    ordered_test_details[Group_Name].append(test_details)
                if row_dict.get("SubTestCodes") and row_dict["SubTestCodes"] in subtest_map:
                    subtest_code = row_dict["SubTestCodes"]
                    subtest_item_id = next(
                        (item_id for item_id, test in test_map.items() if test["Test_Code"] == subtest_code),
                        None
                    )
                    if subtest_item_id and subtest_item_id in test_map and subtest_item_id not in processed_subtest_ids:
                        subtest_details = test_map[subtest_item_id].copy()
                        subtest_details["Billing_Invoice"] = invoice_no
                        subtest_details["testinterpreatation"] = interpretations_by_test_code.get(subtest_code, [])
                        subtest_details["guidelines_interpretation"] = guidelines_by_test_code.get(subtest_code, [])
                        sub_ref_range = subtest_details.get("ReferenceRange")
                        sub_normal = subtest_details.get("NormalValue")
                        if sub_normal == "Yes":
                            sub_panic_low, sub_panic_high = extract_panic_range(sub_ref_range, patient_gender)
                            subtest_details["paniclow"] = sub_panic_low
                            subtest_details["panichigh"] = sub_panic_high
                        ordered_test_details[Group_Name].append(subtest_details)
                        processed_subtest_ids.add(subtest_item_id)

            else:
                department_data[department_name]["OrderID"] = OrderID
                if not department_data[department_name]["invoice_details"]:
                    department_data[department_name]["invoice_details"] = invoice_details
                department_data[department_name]["test_details"].append(test_details)
                department_data[department_name]["Test_Method"] = Test_Method
                department_data[department_name]["PackageName"] = PackageName

            if department_name == "MICROBIOLOGY" and Culturetest == "Yes":
                query1 = """SELECT DISTINCT Captured_Oraganism, Sensitive_Type, Antibiotic_Name, Antibiotic_Value
                            FROM Complete_Culture_Examination 
                            WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
                cursor.execute(query1, (invoice_no, patient_id, visit))
                data1 = cursor.fetchall()

                column1 = [i[0] for i in cursor.description]
                result = defaultdict(list)

                sensitivity_order = {"Sensitive": 1, "Intermediate": 2, "Resistant": 3}

                for row in data1:
                    row_data = dict(zip(column1, row))
                    organism = row_data["Captured_Oraganism"]
                    query = """
                    SELECT `intermediate`, `resistant`, `sensitive` FROM AntibioticMaster WHERE anti_biotic = %s;
                    """
                    cursor.execute(query, (row_data["Antibiotic_Name"],))
                    fetched = cursor.fetchall()

                    intermediate, resistant, sensitive = "", "", ""
                    if fetched:
                        intermediate, resistant, sensitive = fetched[0]

                    antibiotic_info = {
                        "Antibiotic": row_data["Antibiotic_Name"],
                        "SensitivityType": row_data["Sensitive_Type"],
                        "CaptureValue": row_data["Antibiotic_Value"],
                        "Intermediate": intermediate,
                        "Resistant": resistant,
                        "Sensitive": sensitive,
                    }

                    result[organism].append(antibiotic_info)

                    query1 = """SELECT ColonyCount 
                        FROM Complete_Culture_Examination 
                        WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s AND Captured_Oraganism = %s
                        ORDER BY CreatedAt DESC LIMIT 1;"""
                    cursor.execute(query1, (invoice_no, patient_id, visit, organism))
                    row = cursor.fetchone()

                    ColonyCount = row[0] if row and row[0] is not None else ""
                    colony[organism] = ColonyCount

                for organism in result:
                    result[organism].sort(key=lambda x: sensitivity_order.get(x["SensitivityType"], float("inf")))

                final_result_micro = [
                    {organism: antibiotics} for organism, antibiotics in result.items()
                ]

                for test in ordered_dept_test_details[department_name]:
                    if "OrganismDetails" not in test:
                        test["OrganismDetails"] = final_result_micro
                        test["OrganismColony"] = colony
                    else:
                        test["OrganismDetails"].extend(final_result_micro)
                        test["OrganismColony"] = colony

            print("TEst----------",test_details)
        # Populate test details for groups and departments
        for group_name, test_details_list in ordered_test_details.items():
            if group_name and test_details_list:
                group_data[group_name]["test_details"] = test_details_list

        for dept_name, test_details_list in ordered_dept_test_details.items():
            if dept_name and test_details_list:
                department_data[dept_name]["test_details"] = test_details_list

        # Add group entries to test_details for Offers
        for group_name, data in group_data.items():
            if len(data["test_details"]) > 0 and group_name and data["Test_Method"] == "Offers":
                dept_name = data["department_name"]
                group_entry = {
                    "Packagegroup": [{
                        "groupname": group_name,
                        "department": data["department_name"],
                        "Report_Type": data["ReportType"],
                        "testdetails": data["test_details"],
                        "invoicedetails": data["invoice_details"],
                        "OrderID": data["OrderID"],
                        "Test_Method": data["Test_Method"],
                        "PackageName": data["PackageName"],
                    }]
                }
                department_data[dept_name]["test_details"].append(group_entry)

        final_result = []
        for dept_name, data in department_data.items():
            if len(data["test_details"]) > 0:
                dept_entry = {
                    "department": dept_name,
                    "Report_Type": data["ReportType"],
                    "testdetails": data["test_details"],
                    "invoicedetails": data["invoice_details"],
                    "OrderID": data["OrderID"],
                    "Test_Method": data["Test_Method"],
                    "PackageName": data["PackageName"],
                    "index": data["index"],
                    "Outsourcealert": data["Outsourcealert"]
                }
                final_result.append(dept_entry)

        for group_name, data in group_data.items():
            if len(data["test_details"]) > 0 and group_name and data["Test_Method"] != "Offers":
                final_result.append({
                    "groupname": group_name,
                    "department": data["department_name"],
                    "Report_Type": data["ReportType"],
                    "testdetails": data["test_details"],
                    "invoicedetails": data["invoice_details"],
                    "OrderID": data["OrderID"],
                    "Test_Method": data["Test_Method"],
                    "PackageName": data["PackageName"],
                })

        return JsonResponse(final_result, safe=False)

    except Exception as e:
        print(f"Error in getdataforreport: {str(e)}")
        return JsonResponse({"status": str(e)}, status=500)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()



