from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
from datetime import datetime
import datetime
from datetime import timedelta
from collections import defaultdict
from django.db import connection as db

def get_refering_hospitals_for_report(request):
    try:
        
        # db = get_db_connection()
        cursor = db.cursor()
        
        location = request.GET.get('location')
        
        query = """SELECT * FROM External_Lab_Details WHERE Location=%s"""
        cursor.execute(query,(location,))
        data = cursor.fetchall()
        
        columns = [i[0] for i in cursor.description]
        result = [dict(zip(columns,j)) for j in data]
        
        return JsonResponse(result,safe=False)
        
    except Exception as e:
        return JsonResponse({'Error':str(e)})
    finally:
        cursor.close()
        db.close()
        



# def get_Completed_Report_of_ReferingHospital(request):
#     try:
        # db = get_db_connection()
#         cursor = db.cursor()
        
#         currentdate = request.GET.get('currentdate')
#         datetype = request.GET.get('datetype')
#         fromdate = request.GET.get('fromdate')
#         todate = request.GET.get('todate')
#         Labcode = request.GET.get('Labcode')  # Getting the labcode parameter
        
#         if datetype == "Currentdate":
#             query = """SELECT Invoice_NO FROM refering_hospital_history WHERE Labcode=%s AND Billing_Date=%s"""
#             cursor.execute(query, [Labcode, currentdate])
#         elif datetype == "Customize":
#             query = """SELECT Invoice_NO FROM refering_hospital_history WHERE Labcode=%s AND Billing_Date BETWEEN %s AND %s"""
#             cursor.execute(query, [Labcode, fromdate, todate])
#         else:
#             return JsonResponse({'Error': 'Invalid datetype'}, status=400)
        
#         invoice_numbers = cursor.fetchall()
#         if not invoice_numbers:
#             return JsonResponse([], safe=False)

#         invoice_numbers = [inv[0] for inv in invoice_numbers]  
#         print('invoice_numbers :', invoice_numbers)
        
#         # Fetch detailed billing items based on invoice numbers
#         placeholders = ', '.join(['%s'] * len(invoice_numbers))
#         query = f"""SELECT * FROM Billing_Item_Table_for_lab WHERE Billing_Invoice IN ({placeholders})"""
#         cursor.execute(query, invoice_numbers)
        
#         billing_items = cursor.fetchall()
#         print('billing_items :', billing_items)
        
#         # Group the results by patient and structure them
#         result = {}
#         processed_groups = {}  # To keep track of processed groups for each invoice
        
#         for item in billing_items:
#             invoice = item[1]  # Assuming the invoice number is at index 1
#             patient_id = item[2]  # Assuming patient ID is at index 2
#             group_code = item[19]  # Assuming group code is at index 19
#             test_method = item[6]  # Assuming test method is at index 6
            
#             if patient_id not in result:
#                 result[patient_id] = {
#                     'patientname': item[4],  # Assuming patient name is at index 4
#                     'patientid': patient_id,
#                     'visitid': item[3],  # Assuming visit ID is at index 3
#                     'testdetails': []
#                 }
            
#             # Process only if Test_Method is 'Group'
#             if test_method == 'Group':
#                 if (invoice, group_code) not in processed_groups:
#                     processed_groups[(invoice, group_code)] = True
#                     gross_amount = item[8]
#                 else:
#                     gross_amount = '-'
#             else:
#                 gross_amount = item[8]
            
#             test_detail = {
#                 'Item_Id': item[0], 
#                 'Dispatch_Method': item[5], 
#                 'Test_Method': test_method,  
#                 'Test_Name': item[7], 
#                 'Location': item[9],  
#                 'Group_Name': item[15],  
#                 'Billing_Date': item[17],
#                 'Test_Code': item[18],  
#                 'Group_Code': item[19],  
                
#             }
            
#             result[patient_id]['testdetails'].append(test_detail)
        
#         # Convert the result to a list
#         result_list = [value for key, value in result.items()]
        
#         return JsonResponse(result_list, safe=False)
#     except Exception as e:
#         print('error', str(e))
#         return JsonResponse({'Error': str(e)}, status=500)
#     finally:
#         cursor.close()
#         db.close()




def get_Completed_Report_of_ReferingHospital(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        
        currentdate = request.GET.get('currentdate')
        datetype = request.GET.get('datetype')
        fromdate = request.GET.get('fromdate')
        todate = request.GET.get('todate')
        Labcode = request.GET.get('Labcode')  # Getting the labcode parameter
        
        if datetype == "Currentdate":
            query = """SELECT Invoice_NO FROM refering_hospital_history WHERE Labcode=%s AND Billing_Date=%s"""
            cursor.execute(query, [Labcode, currentdate])
        elif datetype == "Customize":
            query = """SELECT Invoice_NO FROM refering_hospital_history WHERE Labcode=%s AND Billing_Date BETWEEN %s AND %s"""
            cursor.execute(query, [Labcode, fromdate, todate])
        else:
            return JsonResponse({'Error': 'Invalid datetype'}, status=400)
        
        invoice_numbers = cursor.fetchall()
        if not invoice_numbers:
            return JsonResponse([], safe=False)

        invoice_numbers = [inv[0] for inv in invoice_numbers]  
        print('invoice_numbers :', invoice_numbers)
        
        # Fetch detailed billing items based on invoice numbers
        placeholders = ', '.join(['%s'] * len(invoice_numbers))
        query = f"""SELECT * FROM Billing_Item_Table_for_lab WHERE Billing_Invoice IN ({placeholders})"""
        cursor.execute(query, invoice_numbers)
        
        billing_items = cursor.fetchall()
        print('billing_items :', billing_items)
        
        # Fetch additional data from Billing_invoice_and_bill_amount
        query_additional_data = f"""SELECT Billing_Invoice, TotalPaidAmount, BalanceAmount, Status ,Net_Amount, Location,Billing_Date
                                    FROM Billing_invoice_and_bill_amount 
                                    WHERE Billing_Invoice IN ({placeholders})"""
        cursor.execute(query_additional_data, invoice_numbers)
        additional_data = cursor.fetchall()
        
        additional_data_dict = {item[0]: {'TotalPaidAmount': item[1], 'BalanceAmount': item[2], 'Status': item[3], 'Net_Amount': item[4], 'Location': item[5], 'Billing_Date': item[6]} for item in additional_data}
        
        # Group the results by patient and structure them
        result = {}
        processed_groups = {}  # To keep track of processed groups for each invoice
        
        for item in billing_items:
            invoice = item[1]  # Assuming the invoice number is at index 1
            patient_id = item[2]  # Assuming patient ID is at index 2
            group_code = item[19]  # Assuming group code is at index 19
            test_method = item[6]  # Assuming test method is at index 6
            
            if patient_id not in result:
                result[patient_id] = {
                    'patientname': item[4].upper(),  # Assuming patient name is at index 4
                    'patientid': patient_id,
                    'visitid': item[3],  # Assuming visit ID is at index 3
                    'testdetails': [],
                    'totalPaidAmount': additional_data_dict.get(invoice, {}).get('TotalPaidAmount', 0),
                    'balanceAmount': additional_data_dict.get(invoice, {}).get('BalanceAmount', 0),
                    'status': additional_data_dict.get(invoice, {}).get('Status', 'N/A'),
                    'Net_Amount': additional_data_dict.get(invoice,{}).get('Net_Amount', 0),
                    'Location': additional_data_dict.get(invoice,{}).get('Location', 'N/A'),
                    'Billing_Date': additional_data_dict.get(invoice,{}).get('Billing_Date', 'N/A')

                }
            
            # Process only if Test_Method is 'Group' 
            if test_method == 'Group':
                if (invoice, group_code) not in processed_groups:
                    processed_groups[(invoice, group_code)] = True
                    gross_amount = item[8]
                else:
                    gross_amount = '-'
            else:
                gross_amount = item[8]
            
            test_detail = {
                'Test_Method': test_method,  
                'Test_Name': item[7], 
                'Gross_Amount': gross_amount, 
                'Location': item[9],  
                'Group_Name': item[15],  
                'Billing_Date': item[17],
                'Test_Code': item[18],  
                'Group_Code': item[19],   
            }
            
            result[patient_id]['testdetails'].append(test_detail)
        
        # Convert the result to a list
        result_list = [value for key, value in result.items()]
        
        return JsonResponse(result_list, safe=False)
    except Exception as e:
        print('error', str(e))
        return JsonResponse({'Error': str(e)}, status=500)
    finally:
        cursor.close()
        db.close()
        
        
def get_report_pending(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        
        currentdate = request.GET.get('currentdate')
        datetype = request.GET.get('datetype')
        fromdate = request.GET.get('fromdate')
        todate = request.GET.get('todate')
        Labcode = request.GET.get('Labcode')  # Getting the labcode parameter
        
        if datetype == "Currentdate":
            query = """SELECT Invoice_NO FROM refering_hospital_history WHERE Labcode=%s AND Billing_Date=%s"""
            cursor.execute(query, [Labcode, currentdate])
        elif datetype == "Customize":
            query = """SELECT Invoice_NO FROM refering_hospital_history WHERE Labcode=%s AND Billing_Date BETWEEN %s AND %s"""
            cursor.execute(query, [Labcode, fromdate, todate])
        else:
            return JsonResponse({'Error': 'Invalid datetype'}, status=400)
        
        invoice_numbers = cursor.fetchall()
        if not invoice_numbers:
            return JsonResponse([], safe=False)

        invoice_numbers = [inv[0] for inv in invoice_numbers]  
        print('invoice_numbers :', invoice_numbers)
        
        # Fetch detailed billing items based on invoice numbers
        placeholders = ', '.join(['%s'] * len(invoice_numbers))
        query = f"""SELECT * FROM Billing_Item_Table_for_lab WHERE Billing_Invoice IN ({placeholders})"""
        cursor.execute(query, invoice_numbers)
        
        billing_items = cursor.fetchall()
        print('billing_items :', billing_items)
        
        # Fetch additional data from Billing_invoice_and_bill_amount
        query_additional_data = f"""SELECT Billing_Invoice, TotalPaidAmount, BalanceAmount, Status ,Net_Amount, Location,Billing_Date
                                    FROM Billing_invoice_and_bill_amount 
                                    WHERE Billing_Invoice IN ({placeholders}) AND Status = 'Pending'"""
        cursor.execute(query_additional_data, invoice_numbers)
        additional_data = cursor.fetchall()
        
        additional_data_dict = {item[0]: {'TotalPaidAmount': item[1], 'BalanceAmount': item[2], 'Status': item[3], 'Net_Amount': item[4], 'Location': item[5], 'Billing_Date': item[6]} for item in additional_data}
        
        # Group the results by patient and structure them
        result = {}
        processed_groups = {}  # To keep track of processed groups for each invoice
        
        for item in billing_items:
            invoice = item[1]  # Assuming the invoice number is at index 1
            patient_id = item[2]  # Assuming patient ID is at index 2
            group_code = item[19]  # Assuming group code is at index 19
            test_method = item[6]  # Assuming test method is at index 6
            
            if patient_id not in result:
                result[patient_id] = {
                    'patientname': item[4].upper(),  # Assuming patient name is at index 4
                    'patientid': patient_id,
                    'visitid': item[3],  # Assuming visit ID is at index 3
                    'testdetails': [],
                    'totalPaidAmount': additional_data_dict.get(invoice, {}).get('TotalPaidAmount', 0),
                    'balanceAmount': additional_data_dict.get(invoice, {}).get('BalanceAmount', 0),
                    'status': additional_data_dict.get(invoice, {}).get('Status', 'N/A'),
                    'Net_Amount': additional_data_dict.get(invoice,{}).get('Net_Amount', 0),
                    'Location': additional_data_dict.get(invoice,{}).get('Location', 'N/A'),
                    'Billing_Date': additional_data_dict.get(invoice,{}).get('Billing_Date', 'N/A')

                }
            
            # Process only if Test_Method is 'Group' 
            if test_method == 'Group':
                if (invoice, group_code) not in processed_groups:
                    processed_groups[(invoice, group_code)] = True
                    gross_amount = item[8]
                else:
                    gross_amount = '-'
            else:
                gross_amount = item[8]
            
            test_detail = {
                'Test_Method': test_method,  
                'Test_Name': item[7], 
                'Gross_Amount': gross_amount, 
                'Location': item[9],  
                'Group_Name': item[15],  
                'Billing_Date': item[17],
                'Test_Code': item[18],  
                'Group_Code': item[19],   
            }
            
            result[patient_id]['testdetails'].append(test_detail)
        
        # Convert the result to a list
        result_list = [value for key, value in result.items()]
        
        return JsonResponse(result_list, safe=False)
    except Exception as e:
        print('error', str(e))
        return JsonResponse({'Error': str(e)}, status=500)
    finally:
        cursor.close()
        db.close()
        


def finance_report_for_customize_period(request):
    try:
        # Establish database connection
        db = connection
        cursor = db.cursor()
 
        # Fetch query parameters from request
        reporttype = request.GET.get('reporttype')
        datetype = request.GET.get('datetype')
        currentdate = request.GET.get('currentdate')
        fromdate = request.GET.get('fromdate')
        todate = request.GET.get('todate')
        monthtype = request.GET.get('monthtype')
        currentmonth = request.GET.get('currentmonth')
        frommonth = request.GET.get('frommonth')
        tomonth = request.GET.get('tomonth')
        yeartype = request.GET.get('yeartype')
        currentyear = request.GET.get('currentyear')
        fromyear = request.GET.get('fromyear')
        toyear = request.GET.get('toyear')
 
        # Prepare the result dictionary to group data by date, month, or year
        result = defaultdict(list)
 
        # Prepare the query based on the report type
        if reporttype == "Datewise":
            dataquery = """
                SELECT DISTINCT
                    DATE(BIBA.CreatedAt) AS BillingDate,
                    BIBA.Billing_Invoice,
                    BIBA.Item_Count,
                    BIBA.Total_Charge,
                    BIBA.Discount_Type,
                    BIBA.Discount,
                    BIBA.Net_Amount,
                    BIBA.Status,
                    BIBA.Patient_Id,
                    BIBA.Patient_Name,
                    BIBA.Visit_Id,
                    BIBA.BalanceAmount,
                    PVI.Refering_Doctor,
                    BCA.Refund_Amount
                FROM Billing_invoice_and_bill_amount AS BIBA
                JOIN Patient_Visit_Id AS PVI ON PVI.Visit_Id = BIBA.Visit_Id AND PVI.Patient_Id = BIBA.Patient_Id
                LEFT JOIN Billing_Cancel_Table_Lab AS BCA ON BCA.Visit_Id = BIBA.Visit_Id AND BCA.Patient_Id = BIBA.Patient_Id
            """
 
            where_conditions = []
            params = []
 
            # Handle 'Customize' date range
            if datetype == "Customize" and fromdate and todate:
                where_conditions.append("DATE(BIBA.CreatedAt) BETWEEN %s AND %s")
                params.extend([fromdate, todate])
 
            # Handle 'Currentdate'
            elif currentdate:
                where_conditions.append("DATE(BIBA.CreatedAt) = %s")
                params.append(currentdate)
 
            # Append WHERE conditions if any exist
            if where_conditions:
                dataquery += " WHERE " + " AND ".join(where_conditions)
 
            # Execute the query
            cursor.execute(dataquery, params)
            billing_data = cursor.fetchall()
 
            # Group data by date
            for row in billing_data:
                billing_date = row[0].strftime('%Y-%m-%d')  # Group by this date
                data = {
                    "Billing_Invoice": row[1],
                    "Item_Count": row[2],
                    "Total_Charge": row[3],
                    "Discount_Type": row[4],
                    "Discount": row[5],
                    "Net_Amount": row[6],
                    "Status": row[7],
                    "Patient_Id": row[8],
                    "Patient_Name": row[9].upper(),
                    "Visit_Id": row[10],
                    "BalanceAmount": row[11],
                    "Refering_Doctor": row[12],
                    "Refund": row[13] if row[13] else 0
                }
 
                # Fetch phone number for the patient
                cursor.execute(
                    """SELECT Phone FROM Register_patient_Details WHERE Patient_Id=%s""",
                    [data["Patient_Id"]],
                )
                phone = cursor.fetchone()
                data["Phone"] = phone[0] if phone else ""
 
                # Fetch payment amounts for different methods
                payment_methods = ["Cash", "Card", "OnlinePayment"]
                for meth in payment_methods:
                    cursor.execute(
                        """
                        SELECT SUM(Paid_Amount) AS Paid_Amount FROM Bill_Payment_details
                        WHERE Billing_invoice = %s AND Payment_Type = %s
                        """,
                        [data["Billing_Invoice"], meth],
                    )
                    amount = cursor.fetchone()[0]
                    data[meth] = amount if amount else 0
 
                # Group by billing date
                result[billing_date].append(data)
 
        elif reporttype == "Monthwise":
            # Prepare the base query for month-wise data
            dataquery = """
                SELECT
                    DATE(BIBA.CreatedAt) AS BillingDate,
                    MONTHNAME(BIBA.CreatedAt) AS BillingMonth,
                    SUM(BIBA.BalanceAmount) AS TotalBalanceAmount,
                    SUM(CASE WHEN BPD.Payment_Type = 'Cash' THEN BPD.Paid_Amount ELSE 0 END) AS CashTotal,
                    SUM(CASE WHEN BPD.Payment_Type = 'Card' THEN BPD.Paid_Amount ELSE 0 END) AS CardTotal,
                    SUM(CASE WHEN BPD.Payment_Type = 'OnlinePayment' THEN BPD.Paid_Amount ELSE 0 END) AS OnlinePaymentTotal,
                    SUM(BCA.Refund_Amount) AS RefundTotal
                FROM Billing_invoice_and_bill_amount AS BIBA
                LEFT JOIN Bill_Payment_details AS BPD ON BPD.Billing_invoice = BIBA.Billing_Invoice
                LEFT JOIN Billing_Cancel_Table_Lab AS BCA ON BCA.Billing_Invoice = BIBA.Billing_Invoice
            """
 
            where_conditions = []
            params = []
 
            # Handle 'Currentmonth'
            if monthtype == "Currentmonth" and currentmonth:
                where_conditions.append("DATE_FORMAT(BIBA.CreatedAt, '%%Y-%%m') = %s")
                params.append(currentmonth)
 
            # Handle 'Customizemonth'
            elif monthtype == "Customizemonth" and frommonth and tomonth:
                where_conditions.append("DATE_FORMAT(BIBA.CreatedAt, '%%Y-%%m') BETWEEN %s AND %s")
                params.extend([frommonth, tomonth])
 
            # Append WHERE conditions if any exist
            if where_conditions:
                dataquery += " WHERE " + " AND ".join(where_conditions)
 
            # Group by month and order by month
            dataquery += """
                GROUP BY DATE(BIBA.CreatedAt)
                ORDER BY DATE(BIBA.CreatedAt)
            """
 
            # Execute the query
            cursor.execute(dataquery, params)
            billing_data = cursor.fetchall()
 
            # Prepare the response data
            result = {}  # Initialize result as a dictionary
            for row in billing_data:
                billing_month = row[1]  # Get the month name from the result
                billing_date = row[0]    # Get the billing date
 
                # Handle None values by treating them as 0
                total_balance_amount = row[2] if row[2] is not None else 0
                cash_total = row[3] if row[3] is not None else 0
                card_total = row[4] if row[4] is not None else 0
                online_payment_total = row[5] if row[5] is not None else 0
                refund_total = row[6] if row[6] is not None else 0
 
                # Calculate the total for the row
                row_total = total_balance_amount + cash_total + card_total + online_payment_total + refund_total
 
                # Create a dictionary for this date
                data = {
                    "BillingDate": billing_date,                  # Date for that day
                    "TotalBalanceAmount": total_balance_amount,  # Total Balance Amount
                    "CashTotal": cash_total,                    # Total Cash for the day
                    "CardTotal": card_total,                    # Total Card for the day
                    "OnlinePaymentTotal": online_payment_total,  # Total OnlinePayment for the day
                    "RefundTotal": refund_total,                # Total Refund for the day
                    "Total": row_total                          # Grand total for the day (sum of all above)
                }
 
                # Add the day's data to the appropriate month in the result dictionary
                if billing_month not in result:
                    result[billing_month] = []  # Initialize the list for the month if it doesn't exist
                result[billing_month].append(data)  # Append the day's data to the month's list
 
 
        elif reporttype == "Yearwise":
            # Prepare the base query for year-wise data
            dataquery = """
                SELECT
                    YEAR(BIBA.CreatedAt) AS BillingYear,
                    MONTH(BIBA.CreatedAt) AS BillingMonth,
                    SUM(BIBA.BalanceAmount) AS TotalBalanceAmount,
                    SUM(CASE WHEN BPD.Payment_Type = 'Cash' THEN BPD.Paid_Amount ELSE 0 END) AS CashTotal,
                    SUM(CASE WHEN BPD.Payment_Type = 'Card' THEN BPD.Paid_Amount ELSE 0 END) AS CardTotal,
                    SUM(CASE WHEN BPD.Payment_Type = 'OnlinePayment' THEN BPD.Paid_Amount ELSE 0 END) AS OnlinePaymentTotal,
                    SUM(BCA.Refund_Amount) AS RefundTotal
                FROM Billing_invoice_and_bill_amount AS BIBA
                LEFT JOIN Bill_Payment_details AS BPD ON BPD.Billing_invoice = BIBA.Billing_Invoice
                LEFT JOIN Billing_Cancel_Table_Lab AS BCA ON BCA.Billing_Invoice = BIBA.Billing_Invoice
            """
 
            where_conditions = []
            params = []
 
            # Handle 'Currentyear'
            if currentyear:
                where_conditions.append("YEAR(BIBA.CreatedAt) = %s")
                params.append(currentyear)
 
            # Handle 'Customize year' (from year to year)
            if fromyear and toyear:
                where_conditions.append("YEAR(BIBA.CreatedAt) BETWEEN %s AND %s")
                params.extend([fromyear, toyear])
 
            # Append WHERE conditions if any exist
            if where_conditions:
                dataquery += " WHERE " + " AND ".join(where_conditions)
 
            # Group by year and month and order by year and month
            dataquery += """
                GROUP BY MONTH(BIBA.CreatedAt)
                ORDER BY MONTH(BIBA.CreatedAt)
            """
 
            # Execute the query
            cursor.execute(dataquery, params)
            billing_data = cursor.fetchall()
 
            # Prepare the response data
            result = {}  # Initialize result as a dictionary
            for row in billing_data:
                billing_year = row[0]  # Get the billing year
                billing_month = row[1]  # Get the billing month (numeric value)
               
                # Month names for dictionary keys
                month_name = datetime.datetime.strptime(str(billing_month), "%m").strftime("%B")
 
                # Handle None values by treating them as 0
                total_balance_amount = row[2] if row[2] is not None else 0
                cash_total = row[3] if row[3] is not None else 0
                card_total = row[4] if row[4] is not None else 0
                online_payment_total = row[5] if row[5] is not None else 0
                refund_total = row[6] if row[6] is not None else 0
 
                # Calculate the total for the row
                row_total = total_balance_amount + cash_total + card_total + online_payment_total + refund_total
 
                # Create a dictionary for this month's billing data
                data = {
                    "Month": month_name,  # Add month name
                    "TotalBalanceAmount": total_balance_amount,  # Total Balance Amount
                    "CashTotal": cash_total,                     # Total Cash for the month
                    "CardTotal": card_total,                     # Total Card for the month
                    "OnlinePaymentTotal": online_payment_total,  # Total OnlinePayment for the month
                    "RefundTotal": refund_total,                 # Total Refund for the month
                    "Total": row_total                           # Grand total for the month (sum of all above)
                }
 
                # Check if the year already exists in the result
                if billing_year not in result:
                    result[billing_year] = []  # Initialize a list for the year if it doesn't exist
 
                # Append the month's data to the year's list
                result[billing_year].append(data)  # Store the month's data under the year's key
 
 
        return JsonResponse(result)
 
    except Exception as e:
        return JsonResponse({"error": str(e)})
        

from django.http import JsonResponse
from django.db import connection

def get_for_sales_report(request):
    try:
        db = connection
        cursor = db.cursor()

        # Fetch query parameters from the request
        reporttype = request.GET.get('reporttype')
        datetype = request.GET.get('datetype')
        currentdate = request.GET.get('currentdate')
        fromdate = request.GET.get('fromdate')
        todate = request.GET.get('todate')
        monthtype = request.GET.get('monthtype')
        currentmonth = request.GET.get('currentmonth')
        frommonth = request.GET.get('frommonth')
        tomonth = request.GET.get('tomonth')
        yeartype = request.GET.get('yeartype')
        currentyear = request.GET.get('currentyear')
        fromyear = request.GET.get('fromyear')
        toyear = request.GET.get('toyear')

        get_query = """
            SELECT 
                eld.Lab_Name, 
                eld.Labcode, 
                COALESCE(SUM(rhs.TotalAmount), 0) AS TotalAmount, 
                COALESCE(SUM(rhs.TotalPaidAmount), 0) AS TotalPaidAmount, 
                COALESCE(SUM(rhs.BalanceAmount), 0) AS BalanceAmount 
            FROM External_Lab_Details AS eld
            LEFT JOIN refering_hospital_history AS rhs 
                ON rhs.LabCode = eld.Labcode
        """
        
        # Conditions for WHERE clause
        where_conditions = []
        params = []

        # Handle 'Datewise' conditions
        if datetype and fromdate and todate:
            where_conditions.append("DATE(rhs.CreatedAt) BETWEEN %s AND %s")
            params.extend([fromdate, todate])
        elif datetype and currentdate:
            where_conditions.append("DATE(rhs.CreatedAt) = %s")
            params.append(currentdate)

        # Handle 'Monthwise' conditions
        if monthtype == "Currentmonth" and currentmonth:
            where_conditions.append("DATE_FORMAT(rhs.CreatedAt, '%%Y-%%m') = %s")
            params.append(currentmonth)
        elif monthtype == "Customizemonth" and frommonth and tomonth:
            where_conditions.append("DATE_FORMAT(rhs.CreatedAt, '%%Y-%%m') BETWEEN %s AND %s")
            params.extend([frommonth, tomonth])

        # Handle 'Yearwise' conditions
        if yeartype and fromyear and toyear:
            where_conditions.append("YEAR(rhs.CreatedAt) BETWEEN %s AND %s")
            params.extend([fromyear, toyear])
        elif yeartype and currentyear:
            where_conditions.append("YEAR(rhs.CreatedAt) = %s")
            params.append(currentyear)

        # Append WHERE conditions if any exist
        if where_conditions:
            get_query += " AND " + " AND ".join(where_conditions)

        # Add GROUP BY clause
        get_query += " GROUP BY eld.Lab_Name, eld.Labcode"
        
        # Debugging: Print the query to logs
        print("Generated Query:", get_query)
        print("Parameters:", params)

        # Execute the query
        cursor.execute(get_query, params)
        results = cursor.fetchall()

        # If no results, return an empty dataset
        if not results:
            return JsonResponse({"data": [], "message": "No data found for the given filters."})
        
        # Convert query results into a list of dictionaries
        columns = [desc[0] for desc in cursor.description]
        data = []
        for row in results:
            row_dict = dict(zip(columns, row))
            data.append(row_dict)

        # Return the result as a JSON response
        return JsonResponse({"data": data})

    except Exception as e:
        # Log and return any errors
        print("Error:", str(e))
        return JsonResponse({"Error": str(e)}, status=500)