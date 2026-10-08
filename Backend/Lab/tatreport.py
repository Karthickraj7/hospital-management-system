from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
from datetime import datetime
import datetime
from datetime import timedelta

from django.db import connection as db 

def get_tat_report(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            Location = request.GET.get('Location')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            invoiceno = request.GET.get('invoiceno')

            tatdata = []

            # Function to format timedelta
            def format_timedelta(td):
                total_seconds = int(td.total_seconds())
                days, remainder = divmod(total_seconds, 86400)
                hours, remainder = divmod(remainder, 3600)
                minutes, seconds = divmod(remainder, 60)
                if days > 0:
                    return f"{days}d {hours}h {minutes}m {seconds}s"
                else:
                    return f"{hours}h {minutes}m {seconds}s"
            # Function to format total process time
            def format_total_process_time(td):
                total_seconds = td.total_seconds()
                minutes, seconds = divmod(total_seconds, 60)
                return f"{int(minutes)}m {seconds:.2f}s"
            
            # Function to format actual TAT
            def format_actual_tat(processing_time, period_type):
                if processing_time is None or period_type is None:
                    return None
                try:
                    if period_type.lower() == 'hours':
                        actual_tat_td = timedelta(hours=int(processing_time))
                    elif period_type.lower() == 'days':
                        actual_tat_td = timedelta(days=int(processing_time))
                    elif period_type.lower() == 'minutes':
                        actual_tat_td = timedelta(minutes=int(processing_time))
                    else:
                        return None
                    return actual_tat_td
                except ValueError:
                    return None
            # Constructing the date condition
            if DateType == 'Current':
                date_condition = f"DATE(bi.CreatedAt) = '{CurrentDate}'"
            else:
                date_condition = f"DATE(bi.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}'"

            if invoiceno:
                invoice_condition = f"AND bi.Billing_Invoice = '{invoiceno}'"
            else:
                invoice_condition = ""
            


            # Adding location condition
            if Location == 'ALL':
                
                sql_query = f"""
                 SELECT DISTINCT
                        bi.Billing_Invoice,
                        bi.Patient_Id,
                        bi.Visit_Id,
                        bi.Patient_Name,
                        bi.Barcode_Id,
                        bi.CreatedBy,
                        bi.CreatedAt,
                        rp.Age,
                        rp.Gender,
                        pvi.Refering_Doctor,
                        sp.CreatedAt AS collecteddatetime,
                        sp.CreatedBy AS userphelop,
                        sp.Test_Name,
                        ani.CreatedAt AS process_datetime,
                        ani.CreatedBy AS Process_Rec_User,
                        ans.CreatedAt AS Authorize_DateTime,
                        ans.CreatedBy AS Authorized_User,
                        clrt.CreatedAt AS PrintDateTime,
                        clrt.CreatedBy AS Printuser,
                        sp.UpdatedAt,
                        td.Processing_Time,
                        td.Period_Type,
                        bi.Capture_Sample_Status,
                        bi.Analyze_Status,
                        bi.Verify_Status,
                        bi.Approve_Status,
                        bi.Billing_Type,
                        bi.Location,
                        rp.Phone
                    FROM
                        Billing_invoice_and_bill_amount bi
                    LEFT JOIN
                        Register_patient_Details rp ON bi.Patient_Id = rp.Patient_Id
                    LEFT JOIN
                        Patient_Visit_Id pvi ON bi.Patient_Id = pvi.Patient_Id AND bi.Visit_Id = pvi.Visit_Id
                    LEFT JOIN
                        Sample_Capture_in_Phelobotomist sp ON bi.Patient_Id = sp.Patient_Id
                        AND bi.Visit_Id = sp.Visit_Id 
                        AND bi.Billing_Invoice = sp.Billing_Invoice
                    LEFT JOIN
                        AnalyseInvestigationResult ani ON bi.Billing_Invoice = ani.Billing_invoice
                        AND bi.Visit_Id=ani.Visit_Id AND bi.Patient_Id = ani.Patient_Id
                    LEFT JOIN
                        AnalyseInvestigationSenior ans ON bi.Billing_Invoice = ans.Billing_invoice
                        AND bi.Visit_Id=ans.Visit_Id AND bi.Patient_Id = ans.Patient_Id
                    LEFT JOIN
                        Completed_Lab_Report_Table clrt ON bi.Patient_Id = clrt.Patient_Id
                        AND bi.Visit_Id=clrt.Visit_Id AND bi.Patient_Id = clrt.Patient_Id
                    LEFT JOIN
                        Test_Descriptions td ON sp.Test_Name = td.Test_Name
                    WHERE
                        {date_condition}{invoice_condition};
                """
            else:
                

                sql_query = f"""
                    SELECT DISTINCT
                        bi.Billing_Invoice,
                        bi.Patient_Id,
                        bi.Visit_Id,
                        bi.Patient_Name,
                        bi.Barcode_Id,
                        bi.CreatedBy,
                        bi.CreatedAt,
                        rp.Age,
                        rp.Gender,
                        pvi.Refering_Doctor,
                        sp.CreatedAt AS collecteddatetime,
                        sp.CreatedBy AS userphelop,
                        sp.Test_Name,
                        ani.CreatedAt AS process_datetime,
                        ani.CreatedBy AS Process_Rec_User,
                        ans.CreatedAt AS Authorize_DateTime,
                        ans.CreatedBy AS Authorized_User,
                        clrt.CreatedAt AS PrintDateTime,
                        clrt.CreatedBy AS Printuser,
                        sp.UpdatedAt,
                        td.Processing_Time,
                        td.Period_Type,
                        bi.Capture_Sample_Status,
                        bi.Analyze_Status,
                        bi.Verify_Status,
                        bi.Approve_Status,
                        bi.Billing_Type,
                        bi.Location,
                        rp.Phone
                    FROM
                        Billing_invoice_and_bill_amount bi
                    LEFT JOIN
                        Register_patient_Details rp ON bi.Patient_Id = rp.Patient_Id
                    LEFT JOIN
                        Patient_Visit_Id pvi ON bi.Patient_Id = pvi.Patient_Id AND bi.Visit_Id = pvi.Visit_Id
                    LEFT JOIN
                        Sample_Capture_in_Phelobotomist sp ON bi.Patient_Id = sp.Patient_Id
                        AND bi.Visit_Id = sp.Visit_Id 
                        AND bi.Billing_Invoice = sp.Billing_Invoice
                    LEFT JOIN
                        AnalyseInvestigationResult ani ON bi.Billing_Invoice = ani.Billing_invoice
                        AND bi.Visit_Id=ani.Visit_Id AND bi.Patient_Id = ani.Patient_Id
                    LEFT JOIN
                        AnalyseInvestigationSenior ans ON bi.Billing_Invoice = ans.Billing_invoice
                        AND bi.Visit_Id=ans.Visit_Id AND bi.Patient_Id = ans.Patient_Id
                    LEFT JOIN
                        Completed_Lab_Report_Table clrt ON bi.Patient_Id = clrt.Patient_Id
                        AND bi.Visit_Id=clrt.Visit_Id AND bi.Patient_Id = clrt.Patient_Id
                    LEFT JOIN
                        Test_Descriptions td ON sp.Test_Name = td.Test_Name
                    WHERE
                        {date_condition} AND bi.Location = '{Location}'{invoice_condition};
                """

            print("Executing query:", sql_query)
            cursor.execute(sql_query)
            rows = cursor.fetchall()
            if not rows:
                print("No data returned from query.")

            for row in rows:
                # Log each row to debug
                print(row)

                # Extract datetime values
                created_at = row[6] 
                print("hi")
                if created_at is not None:
                    print("hi1")
                    created_at_dt = datetime.datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S') if isinstance(created_at, str) else created_at
                    print(created_at,"rrrrr")
                else:
                    print("hi2")
                    created_at_dt = None

                print('iioioi')
                collected_at = row[10]
                print(collected_at,"4444444")
                if collected_at is not None:
                    collected_at_dt = datetime.datetime.strptime(collected_at, '%Y-%m-%d %H:%M:%S')if isinstance(collected_at, str) else collected_at
                    print(collected_at_dt,"9999")
                else:
                    collected_at_dt = None
                    print(collected_at_dt)

                collection_recd = row[19]  # UpdatedAt column for phelobotomist table
                if collection_recd is not None:
                    collected_Received_dt = datetime.datetime.strptime(collection_recd, '%Y-%m-%d %H:%M:%S')if isinstance(collection_recd, str) else collection_recd
                    print(collected_Received_dt)
                else:
                    collected_Received_dt = None

                process_recive_at = row[13]  # CreatedAt column of AnalyseInvestigationResult
                if process_recive_at is not None:
                    process_receivetime = datetime.datetime.strptime(process_recive_at, '%Y-%m-%d %H:%M:%S')if isinstance(process_recive_at, str) else process_recive_at
                else:
                    process_receivetime = None
                print('ooooo')
                receivedat = row[15]  # CreatedAt column of AnalyseInvestigationSenior
                if receivedat is not None:
                    receivetime_done = datetime.datetime.strptime(receivedat, '%Y-%m-%d %H:%M:%S')if isinstance(receivedat, str) else receivedat
                    print(receivetime_done,"iopeyeuy")
                else:
                    receivetime_done = None
                    print(receivetime_done,"pocchhhhh varala")
                # Ensure datetime objects for subtraction
                
                # Calculate time differences
                if created_at_dt is not None and collected_at_dt is not None:
                    time_difference = collected_at_dt - created_at_dt
                    register_collect_timing = format_timedelta(time_difference)
                else:
                    register_collect_timing = None
                print('minnal')
                if collected_Received_dt is not None and collected_at_dt is not None:
                    time_difference1 = collected_Received_dt - collected_at_dt
                    collection_received_timing = format_timedelta(time_difference1)
                    collecteddatetime=collected_at_dt.strftime('%Y-%m-%d %H:%M:%S')
                else:
                    collection_received_timing = None
                    

                if collected_Received_dt is not None and process_receivetime is not None:
                    time_difference2 = collected_Received_dt - process_receivetime
                    process_received_timing = format_timedelta(time_difference2)
                else:
                    process_received_timing = None

                if receivetime_done is not None and process_receivetime is not None:
                    print('33333')
                    time_difference3 = receivetime_done - process_receivetime
                    received_done_timing = format_timedelta(time_difference3)
                else:
                    received_done_timing = None
                # Calculate total process time
                # Calculate total process time in timedelta
                if all([register_collect_timing, collection_received_timing, process_received_timing, received_done_timing]):
                    total_process_time = time_difference + time_difference1 + time_difference2 + time_difference3
                    total_process_time_formatted = format_timedelta(total_process_time)
                    total_process_time_seconds = total_process_time.total_seconds()
                    total_process_time_minutes =format_total_process_time(total_process_time)
                else:
                    total_process_time_formatted = None
                    total_process_time_seconds = None
                    total_process_time_minutes=None
                    print(total_process_time_minutes,"minnalbharathi")
                
                # Format datetime values
                if created_at_dt is not None :
                    reg_time = created_at_dt.strftime('%H:%M:%S')
                    reg_date = created_at_dt.strftime('%Y-%m-%d')
                    reg_date1 = f"{reg_date} {reg_time}"
                else:
                    reg_date1 = None
                print('opoiopp1')
                orgtat_hours = row[20]
                orgtat_period = row[21]

                # Check if either orgtat_hours or orgtat_period is None
                if orgtat_hours is None or orgtat_period is None:
                    orgtat = None
                else:
                    orgtat = f"{orgtat_hours} {orgtat_period}"
                    print(orgtat)
                original_TAT_td = format_actual_tat(orgtat_hours, orgtat_period)
                if original_TAT_td is not None:
                    original_TAT_seconds = original_TAT_td.total_seconds()
                    formatted_original_TAT = format_timedelta(original_TAT_td)
                else:
                    original_TAT_seconds = None
                    formatted_original_TAT = None

                print(type(original_TAT_seconds))

                if total_process_time_seconds is not None and original_TAT_seconds is not None:
                    if int(total_process_time_seconds) > int(original_TAT_seconds):
                        beyond_tat = "YES"
                    else:
                        beyond_tat = "NO"
                else:
                    beyond_tat = "N/A"  # or handle this case as needed
                
                outsourcetype= row[26]
                if outsourcetype == 'External':
                    outsource_type= 'Yes'
                else:
                    outsource_type= 'No'

                if row[13] is not None:
                    process_datetime = row[13].strftime('%Y-%m-%d %H:%M:%S')
                else:
                    process_datetime = None
                
                if row[15] is not None:
                    Authorize_DateTime = row[15].strftime('%Y-%m-%d %H:%M:%S')
                else:
                    Authorize_DateTime = None
                if row[17] is not None:
                    PrintDateTime = row[17].strftime('%Y-%m-%d %H:%M:%S')
                else:
                    PrintDateTime = None
                print('opoiopp')
                tatdata.append({
                    'Billing_Invoice': row[0],
                    'Patient_Id': row[1],
                    'Visit_Id': row[2],
                    'Patient_Name': row[3].upper(),
                    'Barcode_Id': row[4],
                    'CreatedBy': row[5],
                    'RegDate': reg_date1,
                    'Age': row[7],
                    'Gender': row[8],
                    'Referring_Doctor_Name': row[9],
                    'collecteddatetime': collecteddatetime,
                    'userphelop': row[11],
                    'Test_Name': row[12],
                    'Received_date': collecteddatetime,
                    'Received_user': row[11],
                    'Test_done_date': process_datetime,
                    'Test_Done_User': row[14],
                    'process_datetime': process_datetime,
                    'Process_Rec_User': row[14],
                    'Authorize_DateTime': Authorize_DateTime,
                    'Authorized_User': row[16],
                    'PrintDateTime': PrintDateTime,
                    'Printuser': row[18],
                    'dispatch_date': PrintDateTime,
                    'dispatch_user': row[18],
                    'Capture_Sample_Status': row[22],
                    'Analyze_Status': row[23],
                    'Verify_Status': row[24],
                    'Approve_Status': row[25],
                    'outsource_type':outsource_type,
                    'register_collect_timing': register_collect_timing,
                    'collection_Received_timing': collection_received_timing,
                    'process_Received_timing': process_received_timing,
                    'received_done_timing': received_done_timing,
                    'total_process_time_formatted': total_process_time_formatted,
                    'total_process_time_minutes': total_process_time_minutes,
                    'original_TAT':formatted_original_TAT,
                    'actual_TAT':total_process_time_formatted,
                    'original_TAT_seconds': original_TAT_seconds,
                    'actual_TAT_seconds': total_process_time_seconds,
                    'Beyond_tat':beyond_tat,
                    'Location':row[27],
                    'Phone_Number':row[28]
                })

            return JsonResponse(tatdata, safe=False)
        except Exception as e:
            print("Error-------------------->", e)
            return JsonResponse({"Error": str(e)}, safe=False)
        finally:
            cursor.close()
            db.close()




#---------------------------------- Repering Doctor Patient Report ---------------------------------------------------



# def get_report_for_refering_doctor_patient(request):
#     if request.method == 'GET':
#         try:
            # db = get_db_connection()  # Assuming get_db_connection() connects to your database
#             cursor = db.cursor()  # Assuming db.cursor() returns a cursor for the database

#             Location = request.GET.get('Location')
#             DateType = request.GET.get('DateType')
#             CurrentDate = request.GET.get('CurrentDate')
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')
#             invoiceno = request.GET.get('invoiceno')

#             reportdata = []

#             if DateType == 'Current':
#                 date_condition = f"DATE(rdc.CreatedAt) = '{CurrentDate}'"
#             else:
#                 date_condition = f"DATE(rdc.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}'"

#             invoice_condition = f"AND rdc.Billing_Invoice = '{invoiceno}'" if invoiceno else ""

#             if Location == 'ALL':
#                 reportquery = f"""
#                     SELECT 
#                         rdc.Doctor_Name,
#                         rdc.Billing_Invoice,
#                         rdc.Patient_Name,
#                         rdc.Visit_Id,
#                         rdc.Total_BillAmount,
#                         rdc.Location,
#                         rdc.Billing_Date,
#                         GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
#                         bit.Patient_Id,
#                         bia.Item_Count,
#                         bia.Discount,
#                         bia.Discount_Type,
#                         COALESCE(max_bpt.Paid_Amount, 0) AS Paid_Amount,
#                         COALESCE(bpt.Remaing_Amount, 0) AS Remaining_Amount,
#                         max_bpt.Max_Billing_Id,
#                         bia.Status
#                     FROM 
#                         Refering_Doctor_Commission_Payment rdc
#                     INNER JOIN
#                         Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = rdc.Billing_Invoice
#                     INNER JOIN 
#                         Billing_invoice_and_bill_amount bia ON bia.Billing_Invoice = rdc.Billing_Invoice
#                     LEFT JOIN 
#                         (SELECT 
#                             Billing_invoice, 
#                             SUM(Paid_Amount) AS Paid_Amount, 
#                             MAX(Billing_Id) AS Max_Billing_Id
#                         FROM 
#                             Bill_Payment_details
#                         GROUP BY 
#                             Billing_invoice) max_bpt ON max_bpt.Billing_invoice = rdc.Billing_Invoice
#                     LEFT JOIN 
#                         (SELECT 
#                             Billing_invoice, 
#                             Remaing_Amount, 
#                             Billing_Id
#                         FROM 
#                             Bill_Payment_details) bpt ON bpt.Billing_invoice = rdc.Billing_Invoice AND bpt.Billing_Id = max_bpt.Max_Billing_Id
#                     WHERE
#                         {invoice_condition}
#                         {date_condition}
#                     GROUP BY
#                         rdc.Doctor_Name,
#                         rdc.Billing_Invoice, 
#                         rdc.Patient_Name, 
#                         rdc.Visit_Id, 
#                         rdc.Total_BillAmount, 
#                         rdc.Location, 
#                         rdc.Billing_Date, 
#                         bit.Patient_Id, 
#                         bia.Item_Count, 
#                         bia.Discount, 
#                         bia.Discount_Type, 
#                         bpt.Remaing_Amount,
#                         max_bpt.Max_Billing_Id,
#                         bia.Status
#                 """
#             else:
#                 reportquery = f"""
#                     SELECT 
#                         rdc.Doctor_Name,
#                         rdc.Billing_Invoice,
#                         rdc.Patient_Name,
#                         rdc.Visit_Id,
#                         rdc.Total_BillAmount,
#                         rdc.Location,
#                         rdc.Billing_Date,
#                         GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
#                         bit.Patient_Id,
#                         bia.Item_Count,
#                         bia.Discount,
#                         bia.Discount_Type,
#                         COALESCE(max_bpt.Paid_Amount, 0) AS Paid_Amount,
#                         COALESCE(bpt.Remaing_Amount, 0) AS Remaining_Amount,
#                         max_bpt.Max_Billing_Id,
#                         bia.Status
#                     FROM 
#                         Refering_Doctor_Commission_Payment rdc
#                     INNER JOIN
#                         Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = rdc.Billing_Invoice
#                     INNER JOIN 
#                         Billing_invoice_and_bill_amount bia ON bia.Billing_Invoice = rdc.Billing_Invoice
#                     LEFT JOIN 
#                         (SELECT 
#                             Billing_invoice, 
#                             SUM(Paid_Amount) AS Paid_Amount, 
#                             MAX(Billing_Id) AS Max_Billing_Id
#                         FROM 
#                             Bill_Payment_details
#                         GROUP BY 
#                             Billing_invoice) max_bpt ON max_bpt.Billing_invoice = rdc.Billing_Invoice
#                     LEFT JOIN 
#                         (SELECT 
#                             Billing_invoice, 
#                             Remaing_Amount, 
#                             Billing_Id
#                         FROM 
#                             Bill_Payment_details) bpt ON bpt.Billing_invoice = rdc.Billing_Invoice AND bpt.Billing_Id = max_bpt.Max_Billing_Id
#                     WHERE
#                         {date_condition}AND rdc.Location = '{Location}' {invoice_condition} 
#                     GROUP BY
#                         rdc.Doctor_Name,
#                         rdc.Billing_Invoice, 
#                         rdc.Patient_Name, 
#                         rdc.Visit_Id, 
#                         rdc.Total_BillAmount, 
#                         rdc.Location, 
#                         rdc.Billing_Date, 
#                         bit.Patient_Id, 
#                         bia.Item_Count, 
#                         bia.Discount, 
#                         bia.Discount_Type, 
#                         bpt.Remaing_Amount,
#                         max_bpt.Max_Billing_Id,
#                         bia.Status
#                 """

#             cursor.execute(reportquery)
#             rows = cursor.fetchall()

#             doctors_data = {}
#             for row in rows:
#                 doctor_name = row[0]
#                 if doctor_name not in doctors_data:
#                     doctors_data[doctor_name] = []
#                 doctors_data[doctor_name].append({
#                     'Billing_Invoice': row[1],
#                     'Patient_Name': row[2],
#                     'Visit_Id': row[3],
#                     'Total_BillAmount': row[4],
#                     'Location': row[5],
#                     'Billing_Date': row[6],
#                     'Test_Name': row[7],
#                     'Patient_Id': row[8],
#                     'Item_Count': row[9],
#                     'Discount': row[10],
#                     'Discount_Type': row[11],
#                     'Paid_Amount': row[12],
#                     'Remaining_Amount': row[13],
#                     'Max_Billing_Id': row[14],
#                     'Status': row[15]
#                 })

#             reportdata = [{'Doctor_Name': doctor_name, 'Details': details} for doctor_name, details in doctors_data.items()]
#             return JsonResponse(reportdata, safe=False)

#         except Exception as e:
#             print(f"Error occurred: {e}")
#             return JsonResponse({"Error": str(e)}, status=500)
#         finally:
#             cursor.close()
#             db.close()

#     return JsonResponse({"Error": "Invalid request method"}, status=405)



def get_report_for_refering_doctor_patient(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()  # Assuming get_db_connection() connects to your database
            cursor = db.cursor()  # Assuming db.cursor() returns a cursor for the database

            # Increase GROUP_CONCAT max length
            cursor.execute("SET SESSION group_concat_max_len = 10000;")

            Location = request.GET.get('Location')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            invoiceno = request.GET.get('invoiceno')

            reportdata = []

            if DateType == 'Current':
                date_condition = f"DATE(rdc.CreatedAt) = '{CurrentDate}'"
            else:
                date_condition = f"DATE(rdc.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}'"

            invoice_condition = f"AND rdc.Billing_Invoice = '{invoiceno}'" if invoiceno else ""

            if Location == 'ALL':
                reportquery = f"""
                    SELECT 
                        rdc.Doctor_Name,
                        rdc.Billing_Invoice,
                        rdc.Patient_Name,
                        rdc.Visit_Id,
                        rdc.Total_BillAmount,
                        rdc.Location,
                        rdc.Billing_Date,
                        GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
                        bit.Patient_Id,
                        bia.Item_Count,
                        bia.Discount,
                        bia.Discount_Type,
                        COALESCE(max_bpt.Paid_Amount, 0) AS Paid_Amount,
                        COALESCE(bpt.Remaing_Amount, 0) AS Remaining_Amount,
                        max_bpt.Max_Billing_Id,
                        bia.Status
                    FROM 
                        Refering_Doctor_Commission_Payment rdc
                    INNER JOIN
                        Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = rdc.Billing_Invoice
                    INNER JOIN 
                        Billing_invoice_and_bill_amount bia ON bia.Billing_Invoice = rdc.Billing_Invoice
                    LEFT JOIN 
                        (SELECT 
                            Billing_invoice, 
                            SUM(Paid_Amount) AS Paid_Amount, 
                            MAX(Billing_Id) AS Max_Billing_Id
                        FROM 
                            Bill_Payment_details
                        GROUP BY 
                            Billing_invoice) max_bpt ON max_bpt.Billing_invoice = rdc.Billing_Invoice
                    LEFT JOIN 
                        (SELECT 
                            Billing_invoice, 
                            Remaing_Amount, 
                            Billing_Id
                        FROM 
                            Bill_Payment_details) bpt ON bpt.Billing_invoice = rdc.Billing_Invoice AND bpt.Billing_Id = max_bpt.Max_Billing_Id
                    WHERE
                        {invoice_condition}
                        {date_condition}
                    GROUP BY
                        rdc.Doctor_Name,
                        rdc.Billing_Invoice, 
                        rdc.Patient_Name, 
                        rdc.Visit_Id, 
                        rdc.Total_BillAmount, 
                        rdc.Location, 
                        rdc.Billing_Date, 
                        bit.Patient_Id, 
                        bia.Item_Count, 
                        bia.Discount, 
                        bia.Discount_Type, 
                        bpt.Remaing_Amount,
                        max_bpt.Max_Billing_Id,
                        bia.Status
                """
            else:
                reportquery = f"""
                    SELECT 
                        rdc.Doctor_Name,
                        rdc.Billing_Invoice,
                        rdc.Patient_Name,
                        rdc.Visit_Id,
                        rdc.Total_BillAmount,
                        rdc.Location,
                        rdc.Billing_Date,
                        GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
                        bit.Patient_Id,
                        bia.Item_Count,
                        bia.Discount,
                        bia.Discount_Type,
                        COALESCE(max_bpt.Paid_Amount, 0) AS Paid_Amount,
                        COALESCE(bpt.Remaing_Amount, 0) AS Remaining_Amount,
                        max_bpt.Max_Billing_Id,
                        bia.Status
                    FROM 
                        Refering_Doctor_Commission_Payment rdc
                    INNER JOIN
                        Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = rdc.Billing_Invoice
                    INNER JOIN 
                        Billing_invoice_and_bill_amount bia ON bia.Billing_Invoice = rdc.Billing_Invoice
                    LEFT JOIN 
                        (SELECT 
                            Billing_invoice, 
                            SUM(Paid_Amount) AS Paid_Amount, 
                            MAX(Billing_Id) AS Max_Billing_Id
                        FROM 
                            Bill_Payment_details
                        GROUP BY 
                            Billing_invoice) max_bpt ON max_bpt.Billing_invoice = rdc.Billing_Invoice
                    LEFT JOIN 
                        (SELECT 
                            Billing_invoice, 
                            Remaing_Amount, 
                            Billing_Id
                        FROM 
                            Bill_Payment_details) bpt ON bpt.Billing_invoice = rdc.Billing_Invoice AND bpt.Billing_Id = max_bpt.Max_Billing_Id
                    WHERE
                        {date_condition}AND rdc.Location = '{Location}' {invoice_condition} 
                    GROUP BY
                        rdc.Doctor_Name,
                        rdc.Billing_Invoice, 
                        rdc.Patient_Name, 
                        rdc.Visit_Id, 
                        rdc.Total_BillAmount, 
                        rdc.Location, 
                        rdc.Billing_Date, 
                        bit.Patient_Id, 
                        bia.Item_Count, 
                        bia.Discount, 
                        bia.Discount_Type, 
                        bpt.Remaing_Amount,
                        max_bpt.Max_Billing_Id,
                        bia.Status
                """

            cursor.execute(reportquery)
            rows = cursor.fetchall()

            doctors_data = {}
            for row in rows:
                doctor_name = row[0]
                if doctor_name not in doctors_data:
                    doctors_data[doctor_name] = []
                doctors_data[doctor_name].append({
                    'Billing_Invoice': row[1],
                    'Patient_Name': row[2].upper(),
                    'Visit_Id': row[3],
                    'Total_BillAmount': row[4],
                    'Location': row[5],
                    'Billing_Date': row[6],
                    'Test_Name': row[7],
                    'Patient_Id': row[8],
                    'Item_Count': row[9],
                    'Discount': row[10],
                    'Discount_Type': row[11],
                    'Paid_Amount': row[12],
                    'Remaining_Amount': row[13],
                    'Max_Billing_Id': row[14],
                    'Status': row[15]
                })

            reportdata = [{'Doctor_Name': doctor_name, 'Details': details} for doctor_name, details in doctors_data.items()]
            return JsonResponse(reportdata, safe=False)

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({"Error": str(e)}, status=500)
        finally:
            cursor.close()
            db.close()

    return JsonResponse({"Error": "Invalid request method"}, status=405)



#= = =  == = == =  = = = = == = == =  = == = == = = userwise Collection Report = = =  = = = = == = = = = = = = = = = == = =  == = = =



def get_report_for_user_wise_billing(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            Location = request.GET.get('Location')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            invoiceno = request.GET.get('invoiceno')

            # Debugging received parameters
            print(f"Location: {Location}, DateType: {DateType}, CurrentDate: {CurrentDate}, FromDate: {FromDate}, ToDate: {ToDate}, invoiceno: {invoiceno}")

            # Initialize query and parameters
            where_clauses = []
            params = []

            # Handle DateType logic
            if DateType == 'Current':
                where_clauses.append("DATE(bia.CreatedAt) = %s")
                params.append(CurrentDate)
            elif FromDate and ToDate:
                where_clauses.append("DATE(bia.CreatedAt) BETWEEN %s AND %s")
                params.extend([FromDate, ToDate])

            # Handle invoiceno
            if invoiceno:
                where_clauses.append("bia.Billing_Invoice = %s")
                params.append(invoiceno)

            # Handle Location
            if Location and Location.upper() != 'ALL':
                where_clauses.append("bia.Location = %s")
                params.append(Location)

            # Default condition if no filters are provided
            if not where_clauses:
                where_clauses.append("1 = 1")

            # Combine where conditions
            where_clause = " AND ".join(where_clauses)

            # Construct query
            query = f"""
                SELECT
                    bia.CreatedBy,
                    bia.Billing_Date,
                    bia.Patient_Name,
                    bia.Patient_Id,
                    bia.Visit_Id,
                    bia.Item_Count,
                    bia.Total_Charge,
                    bia.Discount_Type,
                    bia.Discount,
                    bia.Net_Amount,
                    bia.Status,
                    GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
                    bpt.Paid_Amount,
                    GROUP_CONCAT(DISTINCT bpt.Payment_Type) AS Payment_Method,
                    bia.Billing_Invoice,
                    bia.Location
                FROM
                    Billing_invoice_and_bill_amount bia
                INNER JOIN 
                    Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = bia.Billing_Invoice
                INNER JOIN
                    Bill_Payment_details bpt ON bpt.Billing_invoice = bia.Billing_Invoice
                WHERE
                    {where_clause}
                GROUP BY
                    bia.CreatedBy,
                    bia.Billing_Date,
                    bia.Patient_Name,
                    bia.Patient_Id,
                    bia.Visit_Id,
                    bia.Item_Count,
                    bia.Total_Charge,
                    bpt.Paid_Amount
            """

            # Execute query
            print(f"Executing query: {query} with params: {params}")
            cursor.execute(query, params)
            rows = cursor.fetchall()

            # Process results
            user_wise_data = {}
            for row in rows:
                created_by = row[0]
                billing_detail = {
                    'Billing_Date': row[1],
                    'Patient_Name': row[2].upper(),
                    'Patient_Id': row[3],
                    'Visit_Id': row[4],
                    'Item_Count': row[5],
                    'Total_Charge': row[6],
                    'Discount_Type': row[7],
                    'Discount': row[8],
                    'Net_Amount': row[9],
                    'Status': row[10],
                    'Test_Name': row[11],
                    'Paid_Amount': row[12],
                    'Payment_Method': row[13],
                    'Billing_Invoice': row[14],
                    'Location': row[15]
                }
                if created_by not in user_wise_data:
                    user_wise_data[created_by] = {
                        'Details': [],
                        'Total_Paid_Amount': 0
                    }
                user_wise_data[created_by]['Details'].append(billing_detail)
                user_wise_data[created_by]['Total_Paid_Amount'] += row[12]

            # Format response
            report_data = [{'CreatedBy': user, 'Details': data['Details'], 'Total_Paid_Amount': data['Total_Paid_Amount']} for user, data in user_wise_data.items()]

            return JsonResponse(report_data, safe=False)

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({"Error": str(e)}, status=500)
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()

    return JsonResponse({"Error": "Invalid request method"}, status=405)




#= =  = = == = = = = == = = = = = = == = = = =  GET AUDIT TRAIL = = = =  = == = = = = == = = = == = = == = = = = = = = 
@csrf_exempt
def get_audit_report(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            Location = request.GET.get('Location')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            invoiceno = request.GET.get('invoiceno')

            tatdata = []

            # Constructing the date condition
            if DateType == 'Current':
                date_condition = f"DATE(bi.CreatedAt) = '{CurrentDate}'"
            else:
                date_condition = f"DATE(bi.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}'"

            if invoiceno:
                invoice_condition = f"AND bi.Billing_Invoice = '{invoiceno}'"
            else:
                invoice_condition = ""

            location_condition = f"AND bi.Location = '{Location}'" if Location != 'ALL' else ""

            sql_query = f"""
                WITH latest_results AS (
                    SELECT *,
                           ROW_NUMBER() OVER (PARTITION BY Billing_invoice ORDER BY UpdatedAt DESC) AS rn
                    FROM AnalyseInvestigationResult
                )
                SELECT DISTINCT
                    bi.Billing_Invoice,
                    bi.Patient_Id,
                    bi.Visit_Id,
                    bi.Patient_Name,
                    bi.Barcode_Id,
                    pvi.Refering_Doctor,
                    sp.CreatedAt AS collecteddatetime,
                    sp.CreatedBy AS userphelop,
                    ani.Capture_Value AS latest_capture_value,
                    ani.Status AS latest_status,
                    sp.Test_Name,
                    bi.Location,
                    previous_ani.Capture_Value AS previous_capture_value,
                    ani.Medical_Remark AS latest_medical_remark,
                    previous_ani.Medical_Remark AS previous_medical_remark,
                    ani.Technical_Remark AS latest_technical_remark,
                    previous_ani.Technical_Remark AS previous_technical_remark,
                    ani.UpdatedAt AS latest_updated_at,
                    ani.CreatedBy AS latest_created_by,
                    previous_ani.CreatedBy AS previous_created_by
                FROM
                    Billing_invoice_and_bill_amount bi
                LEFT JOIN
                    Register_patient_Details rp ON bi.Patient_Id = rp.Patient_Id
                LEFT JOIN
                    Patient_Visit_Id pvi ON bi.Patient_Id = pvi.Patient_Id AND bi.Visit_Id = pvi.Visit_Id
                LEFT JOIN
                    Sample_Capture_in_Phelobotomist sp ON bi.Patient_Id = sp.Patient_Id
                    AND bi.Visit_Id = sp.Visit_Id 
                    AND bi.Billing_Invoice = sp.Billing_Invoice
                LEFT JOIN
                    latest_results ani ON bi.Billing_Invoice = ani.Billing_invoice
                LEFT JOIN
                    AnalyseInvestigationResult previous_ani ON bi.Billing_Invoice = previous_ani.Billing_invoice
                    AND previous_ani.Status = 'Completed'
                WHERE
                    {date_condition} {location_condition} {invoice_condition}
                    AND ani.rn = 1;
            """

            print("Executing query:", sql_query)
            cursor.execute(sql_query)
            rows = cursor.fetchall()
            if not rows:
                print("No data returned from query.")

            for row in rows:
                # Log each row to debug
                print(row)

                # Extract datetime values
                created_at = row[6] 
                if created_at is not None:
                    created_at_dt = datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S') if isinstance(created_at, str) else created_at
                else:
                    created_at_dt = None

                # Format datetime values
                if created_at_dt is not None:
                    reg_time = created_at_dt.strftime('%H:%M:%S')
                    reg_date = created_at_dt.strftime('%Y-%m-%d')
                    reg_date1 = f"{reg_date} {reg_time}"
                else:
                    reg_date1 = None

                # Determine previous and edited values based on the status comparison
                if row[9] == 'Retest' and row[12] != row[8]:
                    previous_value = row[12]
                    edited_value = row[8]
                    edited_user = row[18]
                    latest_updated_at = row[17].strftime('%Y-%m-%d %H:%M:%S') if row[17] else None
                else:
                    previous_value = row[8]
                    edited_value = None
                    edited_user = None
                    latest_updated_at = None

                tatdata.append({
                    'Billing_Invoice': row[0],
                    'Patient_Id': row[1],
                    'Visit_Id': row[2],
                    'Patient_Name': row[3].upper(),
                    'Barcode_Id': row[4],
                    'Referring_Doctor_Name': row[5],
                    'RegDate': reg_date1,
                    'Test_Name': row[10],
                    'Location': row[11],
                    'Previous_Capture_Value': previous_value,
                    'Edited_Capture_Value': edited_value,
                    'Latest_Medical_Remark': row[13],
                    'Previous_Medical_Remark': row[14],
                    'Latest_Technical_Remark': row[15],
                    'Previous_Technical_Remark': row[16],
                    'Latest_Updated_At': latest_updated_at,
                    'Edited_User': edited_user,
                    'Created_User': row[19],
                })

            return JsonResponse(tatdata, safe=False)
        except Exception as e:
            print("Error-------------------->", e)
            return JsonResponse({"Error": str(e)}, safe=False)
        finally:
            cursor.close()
            db.close()



#= =  = = = = = = = = = = = = = = = = = = = = = = = =   GET FOR REFERING DOCT NAMES = = = =  = = =  = = = =  = =  = = = = = = 

def get_refering_doc_names(request):
    if request.method == 'GET':
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            Location = request.GET.get('Location')
            if Location == 'ALL':
                docnamequery = """
                    SELECT Doctor_Name FROM Refering_Doctor_Commission
                """
                cursor.execute(docnamequery)
            else:
                docnamequery = """
                    SELECT Doctor_Name FROM Refering_Doctor_Commission WHERE Location = %s
                """
                cursor.execute(docnamequery, (Location,))

            doctorname = cursor.fetchall()
            doctornames = [row[0] for row in doctorname]

            return JsonResponse(doctornames, safe=False)
        
        except Exception as e:
            return JsonResponse({"Error": str(e)}, status=500)
        
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()



# def get_report_for_refering_doctor_review_patient(request):
#     if request.method == 'GET':
#         db = None
#         cursor = None
#         try:
            # db = get_db_connection()
#             cursor = db.cursor()

#             Location = request.GET.get('Location')
#             DateType = request.GET.get('DateType')
#             CurrentDate = request.GET.get('CurrentDate')
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')
#             Doctorname = request.GET.get('DoctorName')
#             print('Doctorname',Doctorname)
#             reportdata = []

#             if DateType == 'Current':
#                 date_condition = f"DATE(rdc.CreatedAt) = '{CurrentDate}'"
#             else:
#                 date_condition = f"DATE(rdc.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}'"

#             location_condition = ""
#             if Location != 'ALL':
#                 location_condition = f"AND rdc.Location = '{Location}'"

#             doctor_condition = ""
#             if Doctorname:
#                 doctor_condition = f"AND rdc.Doctor_Name = '{Doctorname}'"

#             reportquery = f"""
#                 SELECT 
#                     rdc.Doctor_Name,
#                     rdc.Billing_Invoice,
#                     rdc.Patient_Name,
#                     rdc.Visit_Id,
#                     rdc.Total_BillAmount,
#                     rdc.Location,
#                     rdc.Billing_Date,
#                     GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
#                     bit.Patient_Id,
#                     bia.Item_Count,
#                     bia.Discount,
#                     bia.Discount_Type,
#                     COALESCE(max_bpt.Paid_Amount, 0) AS Paid_Amount,
#                     COALESCE(bpt.Remaing_Amount, 0) AS Remaining_Amount,
#                     max_bpt.Max_Billing_Id,
#                     bia.Status,
#                     rdp.Phone
#                 FROM 
#                     Refering_Doctor_Commission_Payment rdc
#                 INNER JOIN
#                     Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = rdc.Billing_Invoice
#                 INNER JOIN 
#                     Billing_invoice_and_bill_amount bia ON bia.Billing_Invoice = rdc.Billing_Invoice
#                 LEFT JOIN 
#                     (SELECT 
#                         Billing_invoice, 
#                         SUM(Paid_Amount) AS Paid_Amount, 
#                         MAX(Billing_Id) AS Max_Billing_Id
#                     FROM 
#                         Bill_Payment_details
#                     GROUP BY 
#                         Billing_invoice) max_bpt ON max_bpt.Billing_invoice = rdc.Billing_Invoice
#                 LEFT JOIN 
#                     (SELECT 
#                         Billing_invoice, 
#                         Remaing_Amount, 
#                         Billing_Id
#                     FROM 
#                         Bill_Payment_details) bpt ON bpt.Billing_invoice = rdc.Billing_Invoice AND bpt.Billing_Id = max_bpt.Max_Billing_Id
#                 INNER JOIN
#                      Refering_Doctor_Commission rdp ON rdp.Doctor_Name = rdc.Doctor_Name
#                 WHERE
#                     {date_condition} {location_condition} {doctor_condition}
#                 GROUP BY
#                     rdc.Doctor_Name,
#                     rdc.Billing_Invoice, 
#                     rdc.Patient_Name, 
#                     rdc.Visit_Id, 
#                     rdc.Total_BillAmount, 
#                     rdc.Location, 
#                     rdc.Billing_Date, 
#                     bit.Patient_Id, 
#                     bia.Item_Count, 
#                     bia.Discount, 
#                     bia.Discount_Type, 
#                     bpt.Remaing_Amount,
#                     max_bpt.Max_Billing_Id,
#                     bia.Status
#             """
#             print(reportquery, 'iioioioi')
#             cursor.execute(reportquery)
#             rows = cursor.fetchall()

#             doctors_data = {}
#             for row in rows:
#                 doctor_name = row[0]
#                 doctor_phone = row[16]
#                 if doctor_name not in doctors_data:
#                     doctors_data[doctor_name] = []
#                 doctors_data[doctor_name].append({
#                     'Billing_Invoice': row[1],
#                     'Patient_Name': row[2],
#                     'Visit_Id': row[3],
#                     'Total_BillAmount': row[4],
#                     'Location': row[5],
#                     'Billing_Date': row[6],
#                     'Test_Name': row[7],
#                     'Patient_Id': row[8],
#                     'Item_Count': row[9],
#                     'Discount': row[10],
#                     'Discount_Type': row[11],
#                     'Paid_Amount': row[12],
#                     'Remaining_Amount': row[13],
#                     'Max_Billing_Id': row[14],
#                     'Status': row[15],
#                     'DocPhone' : row[16]
#                 }) 

#             # Return data for the specified doctor only
#             if Doctorname in doctors_data:
#                 reportdata = {'Doctor_Name': Doctorname, 'Details': doctors_data[Doctorname], 'DoctorPh': doctor_phone}
#                 return JsonResponse(reportdata, safe=False)
           

#         except Exception as e:
#             print(f"Error occurred: {e}")
#             return JsonResponse({"Error": str(e)}, status=500)
#         finally:
#             if cursor:
#                 cursor.close()
#             if db:
#                 db.close()

#     return JsonResponse({"Error": "Invalid request method"}, status=405)




def get_report_for_refering_doctor_review_patient(request):
    if request.method == 'GET':
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            cursor.execute("SET SESSION group_concat_max_len = 1000000;")

            # Retrieve parameters
            Location = request.GET.get('Location', 'ALL')
            DateType = request.GET.get('DateType', 'Current')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            Doctorname = request.GET.get('DoctorName')
            
            reportdata = []

            # Build date condition
            if DateType == 'Current' and CurrentDate:
                date_condition = f"DATE(rdc.CreatedAt) = '{CurrentDate}'"
            elif FromDate and ToDate:
                date_condition = f"DATE(rdc.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}'"
            else:
                raise ValueError("Invalid date parameters.")

            # Build location condition
            location_condition = ""
            if Location and Location.upper() != 'ALL':
                location_condition = f"AND rdc.Location = '{Location}'"

            # Build doctor condition
            doctor_condition = ""
            if Doctorname:
                doctor_condition = f"AND rdc.Doctor_Name = '{Doctorname}'"

            # Construct SQL query
            reportquery = f"""
                SELECT 
                    rdc.Doctor_Name,
                    rdc.Billing_Invoice,
                    rdc.Patient_Name,
                    rdc.Visit_Id,
                    rdc.Total_BillAmount,
                    rdc.Location,
                    rdc.Billing_Date,
                    GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name,
                    bit.Patient_Id,
                    bia.Item_Count,
                    COALESCE(bia.Discount, 0) AS Discount,
                    COALESCE(bia.Discount_Type, 'None') AS Discount_Type,
                    COALESCE(max_bpt.Paid_Amount, 0) AS Paid_Amount,
                    COALESCE(bpt.Remaing_Amount, 0) AS Remaining_Amount,
                    max_bpt.Max_Billing_Id,
                    bia.Status,
                    rdp.Phone
                FROM 
                    Refering_Doctor_Commission_Payment rdc
                INNER JOIN
                    Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = rdc.Billing_Invoice
                INNER JOIN 
                    Billing_invoice_and_bill_amount bia ON bia.Billing_Invoice = rdc.Billing_Invoice
                LEFT JOIN 
                    (SELECT 
                        Billing_invoice, 
                        SUM(Paid_Amount) AS Paid_Amount, 
                        MAX(Billing_Id) AS Max_Billing_Id
                    FROM 
                        Bill_Payment_details
                    GROUP BY 
                        Billing_invoice) max_bpt ON max_bpt.Billing_invoice = rdc.Billing_Invoice
                LEFT JOIN 
                    (SELECT 
                        Billing_invoice, 
                        Remaing_Amount, 
                        Billing_Id
                    FROM 
                        Bill_Payment_details) bpt ON bpt.Billing_invoice = rdc.Billing_Invoice AND bpt.Billing_Id = max_bpt.Max_Billing_Id
                INNER JOIN
                    Refering_Doctor_Commission rdp ON rdp.Doctor_Name = rdc.Doctor_Name
                WHERE
                    {date_condition} {location_condition} {doctor_condition}
                GROUP BY
                    rdc.Doctor_Name,
                    rdc.Billing_Invoice, 
                    rdc.Patient_Name, 
                    rdc.Visit_Id, 
                    rdc.Total_BillAmount, 
                    rdc.Location, 
                    rdc.Billing_Date, 
                    bit.Patient_Id, 
                    bia.Item_Count, 
                    bia.Discount, 
                    bia.Discount_Type, 
                    bpt.Remaing_Amount,
                    max_bpt.Max_Billing_Id,
                    bia.Status,
                    rdp.Phone
            """
            print("Executing query:", reportquery)
            cursor.execute(reportquery)
            rows = cursor.fetchall()

            # Organize data by doctor
            doctors_data = {}
            for row in rows:
                doctor_name = row[0]
                doctor_phone = row[16]
                if doctor_name not in doctors_data:
                    doctors_data[doctor_name] = []
                doctors_data[doctor_name].append({
                    'Billing_Invoice': row[1],
                    'Patient_Name': row[2].upper(),
                    'Visit_Id': row[3],
                    'Total_BillAmount': row[4],
                    'Location': row[5],
                    'Billing_Date': row[6],
                    'Test_Name': row[7],
                    'Patient_Id': row[8],
                    'Item_Count': row[9],
                    'Discount': row[10],
                    'Discount_Type': row[11],
                    'Paid_Amount': row[12],
                    'Remaining_Amount': row[13],
                    'Max_Billing_Id': row[14],
                    'Status': row[15],
                    'DocPhone': row[16],
                })

            # Return data for the specified doctor only
            if Doctorname and Doctorname in doctors_data:
                reportdata = {'Doctor_Name': Doctorname, 'Details': doctors_data[Doctorname], 'DoctorPh': doctors_data[Doctorname][0]['DocPhone']}
            elif Doctorname:
                return JsonResponse({"Error": "No data found for the specified doctor."}, status=404)
            else:
                reportdata = {'All_Doctors': doctors_data}

            return JsonResponse(reportdata, safe=False)

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({"Error": str(e)}, status=500)
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()


#= = =  = = = = ==  ==  = == =  = = = = = => <MIS REPORT Department Wise =   = = =  = = = = = = = = = = = == = = = = = = =
def get_report_for_collection_department_wise(request):
    if request.method == 'GET':
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            Location = request.GET.get('Location')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            Departmentname = request.GET.get('Departmentname')

            print(f"Received parameters: Location={Location}, DateType={DateType}, CurrentDate={CurrentDate}, FromDate={FromDate}, ToDate={ToDate}, Departmentname={Departmentname}")

            if DateType == 'Current':
                date_condition = f"DATE(bia.CreatedAt) = '{CurrentDate}' AND bia.Status = 'Paid'"
            else:
                date_condition = f"DATE(bia.CreatedAt) BETWEEN '{FromDate}' AND '{ToDate}' AND bia.Status = 'Paid'"

            location_condition = ""
            if Location and Location != 'ALL':
                location_condition = f"AND bia.Location = '{Location}'"

            department_condition = ""
            if Departmentname:
                department_condition = f"AND td.Sub_Department = '{Departmentname}'"

            collection_query = f"""
                SELECT 
                    bia.Billing_Invoice,
                    bia.Item_Count,
                    bia.Discount_Type,
                    bia.Discount,
                    bia.Total_Charge,
                    bia.Location,
                    bit.Test_Method,
                    bit.Test_Name,
                    bit.Gross_Amount,
                    td.Sub_Department,
                    bia.Status
                FROM 
                    Billing_invoice_and_bill_amount bia
                INNER JOIN
                    Billing_Item_Table_for_lab bit ON bit.Billing_Invoice = bia.Billing_Invoice 
                LEFT JOIN 
                    Test_Descriptions td ON td.Test_Name = bit.Test_Name
                WHERE
                    {date_condition} {location_condition} {department_condition}
            """
            print(f"Executing query: {collection_query}")
            cursor.execute(collection_query)
            collection = cursor.fetchall()

            print(f"Retrieved {len(collection)} records from the database.")

            collectiondata = []
            total_new_gross = 0  # Initialize total_new_gross

            for row in collection:
                new_gross = 0  # Initialize new_gross before conditionals

                if row[2] == 'Cash':
                    discount = float(row[3]) / float(row[1])  # Divide the total discount by the number of items
                    new_gross = float(row[8]) - discount
                elif row[2] == 'Percentage':
                    discount = (float(row[3]) / 100) * float(row[4])  # Calculate percentage discount on the total charge
                    new_gross = float(row[8]) - (discount / float(row[1]))  # Divide the discount by the number of items
                else:
                    new_gross = float(row[8])

                new_gross = round(new_gross, 2)
                total_new_gross += new_gross  # Add the new_gross to the total

                collect_report = {
                    'Billing_Invoice': row[0],
                    'Item_Count': row[1],
                    'Discount_Type': row[2],
                    'Discount': row[3],
                    'Net_Amount': row[4],
                    'Location': row[5],
                    'Test_Method': row[6],
                    'Test_Name': row[7],
                    'Gross_Amount': row[8],
                    'Sub_Department': row[9],
                    'New_Gross': new_gross,
                    'Status': row[10]
                }
                collectiondata.append(collect_report)

            # Add the total new gross and department name to the response
            response_data = [{
                'CollectionData': collectiondata,
                'Total_New_Gross': round(total_new_gross, 2),  # Ensure the total is rounded to 2 decimal places
                'DepartmentName': Departmentname  # Include the department name
            }]

            print(f"Response Data: {response_data}")

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({"Error": str(e)}, status=500)

        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()

    return JsonResponse({"Error": "Invalid request method"}, status=405)