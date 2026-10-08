from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
from datetime import datetime
import json
from django.db import connection as db


@csrf_exempt
def get_audit_report(request):
    if request.method == 'GET':
        try:
            
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
                SELECT 
                    bi.Billing_Invoice,
                    bi.Patient_Id,
                    bi.Visit_Id,
                    bi.Patient_Name,
                    bi.Barcode_Id,
                    pvi.Refering_Doctor,
                    sp.CreatedAt AS collecteddatetime,
                    sp.Created_by AS userphelop,
                    ani.Capture_Value AS latest_capture_value,
                    ani.Status AS latest_status,
                    sp.Test_Name,
                    bi.Location,
                    previous_ani.Capture_Value AS previous_capture_value,
                    ani.Medical_Remark AS latest_medical_remark,
                    previous_ani.Medical_Remark AS previous_medical_remark,
                    ani.Technical_Remark AS latest_technical_remark,
                    previous_ani.Technical_Remark AS previous_technical_remark,
                    ani.UpdatedAt
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
                else:
                    previous_value = row[8]
                    edited_value = None

                tatdata.append({
                    'Billing_Invoice': row[0],
                    'Patient_Id': row[1],
                    'Visit_Id': row[2],
                    'Patient_Name': row[3],
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
                })

            return JsonResponse(tatdata, safe=False)
        except Exception as e:
            print("Error-------------------->", e)
            return JsonResponse({"Error": str(e)}, safe=False)
        finally:
            cursor.close()
            db.close()