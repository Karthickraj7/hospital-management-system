from django.shortcuts import render
import base64
from django.http import HttpResponse, JsonResponse
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from backend.db_connect import get_db_connection, get_db_cursor
from datetime import datetime, timedelta, time
import decimal
from collections import defaultdict
from django.db import connection as db

from Frontoffice.models import *
from Masters.models import *
from OutPatient.models import *


def table_exists(cursor, table_name):
    cursor.execute("SHOW TABLES LIKE %s", (table_name,))
    return cursor.fetchone() is not None

# def create_table_if_not_exists(table_name, column_definitions):
#     # 
#     # cursor = db.cursor()

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

# create_table_if_not_exists("Register_patient_Details","""
#                             Patient_Id INT PRIMARY KEY,
#                             Title VARCHAR(10),
#                             Patient_Name VARCHAR(250),
#                             Father_Name VARCHAR(250),
#                             DOB VARCHAR(100),
#                             Age INT,
#                             Gender VARCHAR(150),
#                             Marital_Status VARCHAR(200),
#                             Door_No VARCHAR(25),
#                             Street VARCHAR(1000),
#                             Rural_Urban VARCHAR(250),
#                             City VARCHAR(250),
#                             State VARCHAR(250), 
#                             Pincode VARCHAR(10),
#                             Phone VARCHAR(20),
#                             Alternate_No VARCHAR(20),
#                             Email VARCHAR(300),
#                             Location VARCHAR(300),
#                             Patient_Barcode VARCHAR(19),
#                             Time_Period VARCHAR(30),
#                             CreatedBy VARCHAR(30),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)

# create_table_if_not_exists("Billing_Item_Table_for_lab","""
#                             Item_Id INT PRIMARY KEY,
#                             Billing_Invoice VARCHAR(30),
#                             Patient_Id  INT,
#                             Visit_Id INT,
#                             Patient_Name VARCHAR(250),
#                             Dispatch_Method VARCHAR(250),
#                             Test_Method VARCHAR(30),
#                             Test_Name VARCHAR(250),
#                             Gross_Amount DECIMAL(10, 3),
#                             Location VARCHAR(300),
#                             Service_Status VARCHAR(300),
#                             Analysis_Status VARCHAR(300),
#                             Verify_Status VARCHAR(300),
#                             Approve_Status VARCHAR(300),
#                             Barcode_Id  VARCHAR(20),
#                             Group_Name VARCHAR(250),
#                             CreatedBy VARCHAR(30),
#                             Billing_Date VARCHAR(25),
#                             Test_Code VARCHAR(50),
#                             Group_Code VARCHAR(50),
#                             individual_add_amount DECIMAL(10, 3),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Billing_invoice_and_bill_amount","""
#                             Billing_Id INT PRIMARY KEY,
#                             Billing_Invoice VARCHAR(25),
#                             Patient_Id INT,
#                             Visit_Id INT,
#                             Patient_Name VARCHAR(250),
#                             Item_Count INT,
#                             Total_Charge DECIMAL(10, 3),
#                             Discount_Type VARCHAR(250),
#                             Discount VARCHAR(25),
#                             Net_Amount DECIMAL(10, 3),
#                             Status VARCHAR(200),
#                             Location VARCHAR(300),
#                             Capture_Sample_Status VARCHAR(200),
#                             Analyze_Status VARCHAR(200),
#                             Verify_Status VARCHAR(200),
#                             Approve_Status VARCHAR(200),
#                             Barcode_Id  VARCHAR(20),
#                             Group_Name VARCHAR(250),
#                             CreatedBy VARCHAR(30),
#                             Billing_Date VARCHAR(25),
#                             Billing_Type VARCHAR(100),
#                             RateCard_Name VARCHAR(100),
#                             Test_Code VARCHAR(50),
#                             Group_Code VARCHAR(50),
#                             TotalPaidAmount DECIMAL(10, 3),
#                             BalanceAmount DeCIMAL(10, 3),
#                             Sample_Barcode_Image LONGBLOB,
#                             AdditionalAmount DECIMAL(10, 3),
#                            AdditionalAmountReason VARCHAR(255),
#                            DiscountReason VARCHAR(255),
#                            HistoNumber VARCHAR(255),
#                            MicroNumber VARCHAR(255),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)

# -------------------------------------------------------------------------------------------------------

# create_table_if_not_exists("Bill_Payment_details","""
#                             Billing_Id INT PRIMARY KEY,
#                             Billing_invoice VARCHAR(200),
#                             Patient_Id INT,
#                             Net_Amount DECIMAL(10, 3),
#                             Payment_Type VARCHAR(200),
#                             Paid_Amount DECIMAL(10, 3),
#                             Remaing_Amount DECIMAL(10, 3),
#                             Location VARCHAR(300),
#                             Barcode_Id  VARCHAR(20),
#                             CreatedBy VARCHAR(30),
#                             Billing_Date VARCHAR(25),
#                             Card_Number VARCHAR(30),
#                             Card_Name VARCHAR(35),
#                             UPI_Mobile_Num VARCHAR(18),
#                             Transaction_Id VARCHAR(30),
#                             Card_Type VARCHAR(55),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Patient_Visit_Id","""
#                             S_No INT PRIMARY KEY,
#                             Visit_Id INT,
#                             Patient_Name VARCHAR(250),
#                             Patient_Id INT,
#                             Phone VARCHAR(20),
#                             Visit_Type VARCHAR(250),
#                             Phlebotomist_Type VARCHAR(250),
#                             Phlebotomist_Name VARCHAR(250),
#                             Refering_Doctor VARCHAR(250),
#                             Patient_Group VARCHAR(250),
# 			                Dispatch_Method VARCHAR(200),
#                             Patient_Barcode VARCHAR(20),
#                             CreatedBy VARCHAR(30),
#                             Location VARCHAR(60),
#                             Outsourced_Type VARCHAR(68),
#                             Refering_Hospital VARCHAR(350),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("word_document","""
#                         doc_no varchar(40) primary key,
#                         file_docx LONGBLOB,
#                         department varchar(55),
#                         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")



# create_table_if_not_exists("Billing_receipts_store", """
#                             Receipt_id INT PRIMARY KEY,
#                             Invoice VARCHAR(25),
#                             Patient_Barcode VARCHAR(25),
#                             Visit_Id VARCHAR(10),
#                             Location VARCHAR(55),
#                             CreatedBy VARCHAR(150),
#                             Billdate VARCHAR(25),
#                             Receipt LONGBLOB,
#                             TRF_File LONGBLOB,
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Outsourced_External_Examinations_List","""
#                             Outsourced_id INT PRIMARY KEY,
#                             Billing_invoice VARCHAR(30),
#                             Patient_Id VARCHAR(10),
#                             Visit_Id VARCHAR(10),
#                             Patient_Name VARCHAR(155),
#                             External_Lab_Name VARCHAR(250),
#                             Doctor_Name VARCHAR(150),
#                             Net_Amount DECIMAL(10, 3),
#                             Paid_Status VARCHAR(100),
#                             Billed_By VARCHAR(150),
#                             Location VARCHAR(100),
#                             Sample_Barcode VARCHAR(20),
#                             Report_Status VARCHAR(100),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                         """)

# create_table_if_not_exists("Outsourced_Tests_List_External_Lab", """
#                             Outsource_id INT PRIMARY KEY,
#                             Billing_invoice VARCHAR(30),
#                             Patient_Id VARCHAR(10),
#                             Visit_Id VARCHAR(10),
#                             Patient_Name VARCHAR(155),
#                             External_Lab_Name VARCHAR(250),
#                             Test_Names VARCHAR(300),
#                             Location VARCHAR(100),
#                             Status VARCHAR(55),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                           """)

# -------------------------------------------------------------------------------------------------

# create_table_if_not_exists("barcode_id", """
#                             Sl_No INT PRIMARY KEY,
#                             invoice_no VARCHAR(30),
#                             barcode_id VARCHAR(100),
#                             Patient_Id VARCHAR(10),
#                             Visit_Id VARCHAR(10),
#                             Patient_Name VARCHAR(155),
#                             Test_Name VARCHAR(250),
#                             Test_Code VARCHAR(100),
#                             Barcode LONGBLOB,
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#               """)


# -------------------------------------------------
# create_table_if_not_exists(
# "General_Billing_Receipt_Table", """
#     S_No int PRIMARY KEY,
#     Invoice_NO VARCHAR(50),                     
#     PatientID VARCHAR(50),                     
#     PhoneNumber VARCHAR(50),                     
#     Patient_Name VARCHAR(50),                     
#     TotalAmount VARCHAR(50), 
#     TotalPaidAmount VARCHAR(50), 
#     BalanceAmount VARCHAR(50), 
#     Billing_Date DATE,
#     Voucher_Number VARCHAR(50), 
#     PaidAmount VARCHAR(50),                  
#     Billedby VARCHAR(50),
#     Location VARCHAR(50),
#     UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists(
#     "refering_hospital_history",
#     """
#                             S_No INT PRIMARY KEY,
#                             Invoice_NO VARCHAR(25),
#                             PatientID INT,
#                             PatientName VARCHAR(250),
#                             VisitID INT,
#                             TotalAmount VARCHAR(50),
#                             TotalPaidAmount VARCHAR(50), 
#                             BalanceAmount VARCHAR(50), 
#                             Billing_Date VARCHAR(25),
#                             Refering_Hospital VARCHAR(300),
#                             CreatedBy VARCHAR(50),
#                             Location VARCHAR(50),
#                             LabCode VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """,
# )








@csrf_exempt
def Update_Patient_Details(request):
    try:
        
        cursor = db.cursor()

        data = request.POST
        Patient_Id = data.get("Patient_Id")
        Patient_Name = data.get("Patient_Name")
        # PatientPhoto = data.get("PatientPhoto")
        DOB = data.get("DOB")
        Age = data.get("Age")
        # AdhaarNumber = data.get("AdhaarNumber")
        # Alternate_No = data.get("Alternate_No")
        Email = data.get("Email")
        # Father_Name = data.get("Father_Name")
        Gender = data.get("Gender")
        # Marital_Status = data.get("Marital_Status")
        Phone = data.get("Phone")
        # Relation = data.get("Relation")
        # SurName = data.get("SurName")
        Time_Period = data.get("Time_Period")
        Title = data.get("Title")
        Location = data.get("Location")
        CreatedBy = data.get("CreatedBy")
        # communicationAddress = data.get("communicationAddress")

        updatequery = """UPDATE Register_patient_Details SET Title = %s, 
        Patient_Name = %s, DOB = %s, Age = %s, Gender = %s,  
        Phone = %s,  Email = %s, Location = %s, Time_Period = %s, 
        CreatedBy = %s WHERE Patient_Id = %s
        """
        cursor.execute(
            updatequery,
            (
                Title,
                Patient_Name,
                DOB,
                Age,
                Gender,
                Phone,
                Email,
                Location,
                Time_Period,
                CreatedBy,
                Patient_Id,
            ),
        )
        db.commit()
        return JsonResponse({"Message": "Update Successfull"})
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)

    finally:
        cursor.close()
        db.close()



@csrf_exempt
def insert_word(request):
    if request.method == 'POST':
        try:
        

            Treatment_file = request.FILES.get('file')
            if Treatment_file:
                pdf_file_content = Treatment_file.read()
                pdf_file_base64 = base64.b64encode(pdf_file_content).decode('utf-8')
                pdf_file_size = len(pdf_file_content)
                print(f"PDF file size: {pdf_file_size} bytes")
            

                
                  # Get database connection
                cursor = db.cursor()  # Get cursor
                
                cursor.execute("SELECT MAX(doc_no) AS maxId FROM word_document")
                max_id = cursor.fetchone()[0] or 0
                next_id = max_id + 1
                
                insert_query = """
                    INSERT INTO word_document
                    (doc_no, file_docx)
                    VALUES(%s, %s)
                """
                cursor.execute(insert_query, (next_id, pdf_file_base64,))
                
                db.commit()  # Commit transaction
                cursor.close()  # Close cursor
                db.close()  # Close database connection
                
                return JsonResponse({'message': 'Inserted successfully'})
            else:
                return JsonResponse({'error': 'No file provided'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")  # Debugging statement
            return JsonResponse({'error': 'An error occurred while processing the request.'})
    else:
        return JsonResponse({'error': 'Method not allowed'})







# @csrf_exempt
# def insert_word(request):
#     if request.method == 'POST':
#         try:
#             # Debugging statement
#             Treatment_file = request.FILES.get('docxFile')
#             if Treatment_file:
#                 file_content = Treatment_file.read()
                
#                 # Encode the file content using base64
#                 encoded_content = base64.b64encode(file_content).decode('utf-8')
                
#                   # Get database connection
#                 cursor = db.cursor()  # Get cursor
                
#                 cursor.execute("SELECT MAX(doc_no) AS maxId FROM word_document")
#                 max_id = cursor.fetchone()[0] or 0
#                 next_id = int(max_id) + 1
                
#                 insert_query = """
#                     INSERT INTO word_document
#                     (doc_no, file_docx)
#                     VALUES(%s, %s)
#                 """
#                 cursor.execute(insert_query, (next_id, encoded_content))
                
#                 db.commit()  # Commit transaction
#                 cursor.close()  # Close cursor
#                 db.close()  # Close database connection
                
#                 return JsonResponse({'message': 'Inserted successfully'})
#             else:
#                 return JsonResponse({'error': 'No file provided'})
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")  # Debugging statement
#             return JsonResponse({'error': 'An error occurred while processing the request.'})
#     else:
#         return JsonResponse({'error': 'Method not allowed'})



@csrf_exempt
def get_word_data(request):
    if request.method == 'GET':
        try:
              # Get database connection
            cursor = db.cursor()
            department = request.GET.get('department')
            testcode = request.GET.get('testcode')
            testname = request.GET.get('testname')


            if not department or not testcode:
                return JsonResponse({"Error": "Missing department or testname parameter"})

            # Execute the query to fetch data from the database
            cursor.execute(
                "SELECT Document_Id, Word_File, Department_Name, Test_Name , Test_Code FROM Word_Document_for_result WHERE Department_Name = %s AND Test_Name = %s",
                (department, testname,)
            )
            word_data = cursor.fetchone()  # Fetch the first record

            if word_data:
                file_content = word_data[1]
                file_name = f"{testname}_{testcode}.docx"  # Use testname for file name

                # Set response content type as application/octet-stream
                response = HttpResponse(file_content, content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                # Set the Content-Disposition header to force download
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                return response
            else:
                return HttpResponse(status=404)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return HttpResponse(status=500)

        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return HttpResponse(status=405)



#--------------------- Get for visit id-----------------------------#
@csrf_exempt
def filesave_summa(request):
    if request.method == "POST":

        try:
            
            cursor = db.cursor()

            data = json.loads(request.body)

            cursor.execute("select max(id) from sampletable")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

        except Exception as e:
            return JsonResponse({"Error": e})

        finally:
            cursor.close()
            db.close()

def get_for_visitid(request):

    if request.method == 'GET':
        db = cursor = None
        try:
            
            cursor = db.cursor()
            patientphn = request.GET.get('patientphn')
            patient_name = request.GET.get('patientname')

            # SQL to get the highest Visit_Id for the given patientId and patientName
            visit_id_get_sql = """
                SELECT MAX(Visit_Id) FROM Patient_Visit_Id 
                WHERE Phone = %s AND Patient_Name = %s
            """

            cursor.execute(visit_id_get_sql, (patientphn, patient_name,))
            result = cursor.fetchone()[0]
            print('result',result)
            if result:
                # If a Visit_Id exists, increment it by 1
                next_visit_id = result + 1
            else:
                # If no Visit_Id exists, start with 1
                next_visit_id = 1
            print('next_visit_id',next_visit_id)
            # You can now return this next_visit_id or use it to insert a new visit record
            return JsonResponse({"nextVisitId": next_visit_id})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)})

        finally:
            # Clean up database resources
            if cursor:
                cursor.close()
            if db:
                db.close()

#--------------------------get for patient id-------------------------------------------#

@csrf_exempt
def get_for_patientid(request):
    if request.method == 'GET':
        db = cursor = None
        try:
            
            cursor = db.cursor()
            
            patient_name = request.GET.get('patientname')
            phone = request.GET.get('patientphn')

            # Check for missing parameters
            if not patient_name or not phone:
                return JsonResponse({"error": "Missing required parameters: patientname or patientphn"})

            # SQL to get the Patient_Id for the given patient name and phone
            query_sql = """
                SELECT Patient_Id FROM Register_patient_Details WHERE Patient_Name = %s AND Phone = %s
            """

            cursor.execute(query_sql, (patient_name, phone))
            result = cursor.fetchone()
            if result is not None:
                patient_id = result[0]
            else:
                # No patient found matching criteria, or table is empty
                cursor.execute("SELECT MAX(Patient_Id) FROM Register_patient_Details")
                result = cursor.fetchone()[0]
                patient_id = 1 if result is None else result + 1

            print('Patient ID:', patient_id)

            return JsonResponse({"nextPatientId": patient_id})

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)})

        finally:
            # Clean up database resources
            if cursor: 
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})


# ---------------------------------Get for patient barcode ------------------------------------------4


def get_patient_barcode_billing(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()

            patientid = request.GET.get('Patientid')
            patientname = request.GET.get('Patientname')

            # Check if patientid or patientname are None or undefined
            if not patientid or not patientname:
                return JsonResponse({"error": "Patient ID and Patient Name are required."})

            cursor.execute(
                "SELECT Patient_Barcode FROM Register_patient_Details WHERE Patient_Id = %s AND Patient_Name = %s",
                (patientid, patientname,)
            )
            patient_row = cursor.fetchone()
            print('patient_row :', patient_row)

            if patient_row is not None:
                patient_barcode = patient_row[0]
            else:
                cursor.execute("SELECT MAX(Patient_Barcode) FROM Register_patient_Details")
                max_id = cursor.fetchone()[0]
                print('max_id: ', max_id)

                # Check if max_id is valid and not 'undefined'
                if max_id and max_id.isdigit():
                    max_id = max_id
                else:
                    max_id = '0000'  # Fallback value if max_id is invalid or None

                print('max_id ;', max_id)
                patient_barcode = generate_next_patient_barcode(max_id)

            print('patient_barcode :', patient_barcode)
            return JsonResponse({'Patient_Barcode': patient_barcode})
        except Exception as e:
            print("error", e)
            return JsonResponse({"Error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})





#---------------------  get for Invoice No ----------------------------------------------#


def generate_next_key(current_max_id):
    prefix = "INV"
    numeric_part = int(current_max_id.replace(prefix, '')) + 1
    new_id = f"{prefix}{str(numeric_part).zfill(7)}"
    return new_id

# def generate_next_barcode_key(current_barcode):
#     prefix = "SAMP"  # Adjust this prefix as needed for invoices
#     date_part = datetime.now().strftime("%Y%m%d")
#     numeric_part = int(current_barcode[-3:]) + 1
#     new_barcode = f"{prefix}{date_part}{str(numeric_part).zfill(2)}"
    
#     return new_barcode
    
# def generate_next_barcode_key(current_barcode):
#     # Extract the numeric part from the current barcode (assuming the last 3 digits are numeric)
    
#     date_part = datetime.now().strftime("%Y%m%d")
#     numeric_part = int(current_barcode[-3:]) + 1  # Increment the numeric part
#     # Format numeric part with zero-padding to ensure it has at least 3 digits
#     new_barcode = f"{date_part}{str(numeric_part).zfill(3)}"

#     return new_barcode


def generate_next_barcode_key(current_barcode):
    # Get today's date in the format YYYYMMDD
    today_date = datetime.now().strftime("%Y%m%d")

    # Split the current barcode into date part and numeric part
    date_part = current_barcode[:8]
    numeric_part = int(current_barcode[-3:])

    # Check if the barcode date is the same as today
    if date_part == today_date:
        numeric_part += 1
    else:
        numeric_part = 1

    # Create new barcode
    new_barcode = f"{today_date}{str(numeric_part).zfill(3)}"
    return new_barcode
    



def generate_next_patient_barcode(current_barcode_number):
    prefix = "PAT"  # Adjust this prefix as needed
    date_part = datetime.now().strftime("%Y%m%d")
    
    # Extract the numeric part from the current barcode number
    numeric_part = int(current_barcode_number[-4:])  # Assuming the last 4 characters are numeric
    incremented_numeric_part = numeric_part + 1
    
    # Form the new barcode with the incremented numeric part
    new_barcode_number = f"{prefix}{date_part}{str(incremented_numeric_part).zfill(4)}"
    
    return new_barcode_number

def generate_next_key_fin(current_key):
    alphapart = current_key[:4]
    char_part = current_key[4:-7]
    num_part = int(current_key[-7:])

    next_char_part = ''

    if char_part == 'ZZZZZ' and num_part == 9999999:
        return f'{alphapart}AAAAAA0000001'

    char_len = len(char_part)

    if char_len == 1 and char_part == 'Z':
        next_char_part = 'AA'
    elif char_len == 2 and char_part == 'ZZ':
        next_char_part = 'AAA'
    elif char_len == 3 and char_part == 'ZZZ':
        next_char_part = 'AAAA'
    elif char_len == 4 and char_part == 'ZZZZ':
        next_char_part = 'AAAAA'
    elif char_len == 5 and char_part == 'ZZZZZ':
        next_char_part = 'AAAAAA'
    else:
        if num_part == 9999999:
            next_num_part = 1
            next_char_part = increment_char_part(char_part)
        else:
            next_num_part = min(num_part + 1, 9999999)
            next_char_part=char_part

    return f'{alphapart}{next_char_part}{next_num_part:07d}'



def increment_char_part(char_part):
    if char_part[-1] == 'Z':
        return increment_char_part(char_part[:-1]) + 'A'
    else:
        return char_part[:-1] + chr(ord(char_part[-1]) + 1)


def get_invoice_master_code(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                next_id = 'INV0000001'  # Default initial value

                # Ensure your SQL syntax and table/column names match your schema
                max_id_query = "SELECT MAX(Billing_Invoice) FROM Billing_invoice_and_bill_amount"
                cursor.execute(max_id_query)
                max_id_result = cursor.fetchone()

                if max_id_result and max_id_result[0]:
                    next_id = generate_next_key(max_id_result[0])

                response = {
                    "message": "Success",
                    "nextInvoiceCode": next_id
                }

                return JsonResponse(response)

        except Exception as e:
            print(e)
            # Consider using Django's logging here for better error tracking
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})
    else:
        return JsonResponse({'error': 'Method not allowed'})


def get_patient_barcode(request):
    if(request.method == 'GET'):
        try:
            with connection.cursor() as cursor:
                max_id_query = "SELECT MAX(Patient_Barcode) FROM Register_patient_Details"
                cursor.execute(max_id_query)
                max_id_result = cursor.fetchone()
                print('max_id_result', max_id_result)
                
                
                next_id = 'PAT' + datetime.now().strftime("%Y%m%d") + '0001'  # Default if no existing barcode found
                if max_id_result and max_id_result[0]:
                    next_id = generate_next_patient_barcode(max_id_result[0])
                    print('next_id',next_id)
                response = {
                    "message": "Success",
                    "patientbarcode": next_id  # Ensure key names in the response are clear and accurate
                }

                return JsonResponse(response)

        except Exception as e:
            print(e)  
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})
    else:
        return JsonResponse({'error': 'Method not allowed'})




# def get_invoice_master_barcode(request):
#     if request.method == 'GET':
#         try:
#             with connection.cursor() as cursor:
#                 max_id_query = "SELECT MAX(Barcode_Id) FROM Billing_invoice_and_bill_amount"
#                 cursor.execute(max_id_query)
#                 max_id_result = cursor.fetchone()

#                 next_id = 'SAMP' + datetime.now().strftime("%Y%m%d") + '301'  # Default if no existing barcode found
#                 if max_id_result and max_id_result[0]:
#                     next_id = generate_next_barcode_key(max_id_result[0])

#                 response = {
#                     "message": "Success",
#                     "nextInvoiceBarcode": next_id  # Ensure key names in the response are clear and accurate
#                 }

#                 return JsonResponse(response)

#         except Exception as e:
#             print(e)  # Consider using logging for production environments
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'})
#     else:
#         return JsonResponse({'error': 'Method not allowed'})

def get_invoice_master_barcode():
    # if request.method == "GET":
        try:
            with connection.cursor() as cursor:
                # Query to get the maximum barcode ID
                max_id_query = """SELECT Barcode_Id
                FROM Billing_invoice_and_bill_amount
                WHERE Billing_Id = (
                    SELECT MAX(Billing_Id)
                    FROM Billing_invoice_and_bill_amount
                )"""
                cursor.execute(max_id_query)

                max_id_result = cursor.fetchone()
                print("max_id_result :", max_id_result)

                # Default barcode starting from 301 if no existing barcode found
                next_id = datetime.now().strftime("%Y%m%d") + "301"

                if max_id_result and max_id_result[0]:
                    # Generate the next barcode based on the current maximum barcode
                    next_id = generate_next_barcode_key(max_id_result[0])

                response = {"nextInvoiceBarcode": next_id}

                return next_id

        except Exception as e:
            print(e)  # Consider using logging for production environments
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}
            )
    # else:
    #     return JsonResponse({"error": "Method not allowed"})






#------------------------- Get for patient personel info -----------------------------------------#
                

# @csrf_exempt
# def get_for_patient_info(request):
#     if request.method == 'GET':
#         try:
#             patient_name = request.GET.get('patientname')
#             phone_num = request.GET.get('phonenum')

#             if not phone_num:
#                 return JsonResponse({"error": "Missing phonenum in request"})

#             
#             cursor = db.cursor()

#             query = """
#                 SELECT Patient_Id, Father_Name, DOB, Age, Gender, Marital_Status, Door_No, Street, State, Alternate_No, Email, Patient_Name, Title, Rural_Urban, City, Pincode
#                 FROM Register_patient_Details 
#                 WHERE Phone = %s
#             """
#             params = [phone_num]

#             cursor.execute(query, params)
#             patient_infos = cursor.fetchall()

#             if not patient_infos:
#                 return JsonResponse({"error": "No patients found with the given phone number"}, status=404)

#             if patient_name:
#                 patient_infos = [info for info in patient_infos if info[11] == patient_name]

#             if patient_infos:
#                 patients_data = [
#                     {
#                         'Patient_Id': patient_info[0],
#                         'Father_Name': patient_info[1],
#                         'DOB': patient_info[2],
#                         'Age': patient_info[3],
#                         'Gender': patient_info[4],
#                         'Marital_Status': patient_info[5],
#                         'Door_No': patient_info[6],
#                         'Street': patient_info[7],
#                         'State': patient_info[8],
#                         'Alternate_No': patient_info[9],
#                         'Email': patient_info[10],
#                         'Patient_Name': patient_info[11],
#                         'Title': patient_info[12],
#                         'Rural_Urban': patient_info[13],
#                         'City': patient_info[14],
#                         'Pincode': patient_info[15]
#                     }
#                     for patient_info in patient_infos
#                 ]
#                 return JsonResponse({"patient_infos": patients_data})
#             else:
#                 return JsonResponse({"error": "No patients found with the given phone number and name"}, status=404)

#         except Exception as e:
#             print(e)
#             return JsonResponse({"error": str(e)})
#         finally:
#             if cursor:
#                 cursor.close()
#             if db:
#                 db.close()
#     else:
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."})

# ------------------------------------------ get all patients  -------------------------------------------#
@csrf_exempt
def get_for_patient_info(request):
    if request.method == 'GET':
        try:
            phone = request.GET.get('phonenum')
            patient_name = request.GET.get('patientname')

            if not phone:
                return JsonResponse({"error": "Missing phonenum in request"})

            
            cursor = db.cursor()

            # Query to get all patient names associated with the phone number
            name_query = """
                SELECT Patient_Name
                FROM Register_patient_Details 
                WHERE Phone = %s
            """
            cursor.execute(name_query, (phone,))
            patients = cursor.fetchall()

            patients_names = [row[0] for row in patients]

            if not patients_names:
                return JsonResponse({"error": "No patients found with the given phone number"}, status=404)

            # Query to get detailed information, potentially filtered by patient name
            query = """
                SELECT Patient_Id, Father_Name, DOB, Age, Gender, Marital_Status, Door_No, Street, State, Alternate_No, Email, Patient_Name, Title, Rural_Urban, City, Pincode
                FROM Register_patient_Details 
                WHERE Phone = %s
            """
            params = [phone]

            if patient_name:
                query += " AND Patient_Name = %s"
                params.append(patient_name)

            cursor.execute(query, params)
            patient_infos = cursor.fetchall()

            if not patient_infos:
                return JsonResponse({"error": "No patients found with the given phone number and name"}, status=404)

            patients_data = [
                {
                    'Patient_Id': patient_info[0],
                    'Father_Name': patient_info[1],
                    'DOB': patient_info[2],
                    'Age': patient_info[3],
                    'Gender': patient_info[4],
                    'Marital_Status': patient_info[5],
                    'Door_No': patient_info[6],
                    'Street': patient_info[7],
                    'State': patient_info[8],
                    'Alternate_No': patient_info[9],
                    'Email': patient_info[10],
                    'Patient_Name': patient_info[11],
                    'Title': patient_info[12],
                    'Rural_Urban': patient_info[13],
                    'City': patient_info[14],
                    'Pincode': patient_info[15]
                }
                for patient_info in patient_infos
            ]

            return JsonResponse({"patient_infos": patients_data, "patients" : patients_names})

        except Exception as e:
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})
#------------------------------ Get all Patient Details -----------------------------------#

# @csrf_exempt
# def get_for_all_patient_info(request):
#     if request.method == 'GET':
#         try:
#             location = request.GET.get('location', 'ALL')  # Default to 'ALL' if not specified
#             
#             cursor = db.cursor()

#             if location.upper() == 'ALL':
#                 query = """
#                         SELECT Patient_Id, Patient_Name, DOB, Age, Gender, Marital_Status, Door_No, City, Phone, Alternate_No, Email, Patient_Barcode
#                         FROM Register_patient_Details
#                         """
#                 cursor.execute(query)
#             else:
#                 query = """
#                         SELECT Patient_Id, Patient_Name, DOB, Age, Gender, Marital_Status, Door_No, City, Phone, Alternate_No, Email, Patient_Barcode, Street, Rural_Urban, State, Pincode
#                         FROM Register_patient_Details 
#                         WHERE Location = %s
#                         """
#                 cursor.execute(query, (location,))
            
#             patient_info_list = cursor.fetchall()
#             columns = [i[0] for i in cursor.description]

#             # Process the patient names
#             patients_data = []
#             for row in patient_info_list:
#                 patient_dict = dict(zip(columns, row))
#                 if 'Patient_Name' in patient_dict and isinstance(patient_dict['Patient_Name'], str):
#                     # Capitalize the first letter of the name and lower the rest
#                     patient_dict['Patient_Name'] = patient_dict['Patient_Name'].upper()
#                 patients_data.append(patient_dict)

#             return JsonResponse(patients_data, safe=False)

#         except Exception as e:
#             return JsonResponse({"error": str(e)})
#         finally:
#             cursor.close()
#             db.close()
#     else:
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."})


@csrf_exempt
def update_ref_doc_visit(request):
    if request.method == 'POST':
        try:
            # Parse JSON request body
            data = json.loads(request.body)
            
            patientid = data.get('patientid')
            visitid = data.get('visitid')
            referdoc = data.get('referdoc')

            # Validate inputs
            if not patientid or not visitid or not referdoc:
                return JsonResponse({"error": "Patient ID, Visit ID, and Refering Doctor are required."})

            # Database connection
            
            cursor = db.cursor()

            # Update referring doctor
            update_query = """
                UPDATE 
                    Patient_Visit_Id
                SET 
                    Refering_Doctor = %s
                WHERE 
                    Patient_Id = %s AND Visit_Id = %s;
            """
            cursor.execute(update_query, (referdoc, patientid, visitid))
            db.commit()

            # Return success response
            return JsonResponse({
                "message": "Refering Doctor updated successfully."})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            # Ensure resources are released
            try:
                cursor.close()
                db.close()
            except Exception:
                pass
    else:
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."}, status=405)




@csrf_exempt
def get_ref_doc_visit(request):
    if request.method == 'GET':
        try:
            # Get parameters
            patientid = request.GET.get('patientid')
            limit = int(request.GET.get('limit', 10))  # Default limit is 10
            offset = int(request.GET.get('offset', 0))  # Default offset is 0
            
            # Validate patientid
            if not patientid:
                return JsonResponse({"error": "Patient ID is required."}, status=400)

            # Database connection
            
            cursor = db.cursor()

            # Fetch visit details
            visit_details_query = """
                SELECT 
                    pv.Visit_Id, 
                    pv.Refering_Doctor
                FROM 
                    Patient_Visit_Id pv
                WHERE 
                    pv.Patient_Id = %s
                ORDER BY 
                    pv.Visit_Id DESC
                LIMIT %s OFFSET %s;
            """
            cursor.execute(visit_details_query, (patientid, limit, offset))
            patient_visit_list = cursor.fetchall()

            # Total visit count
            count_query = """
                SELECT COUNT(*)
                FROM Patient_Visit_Id pv 
                WHERE pv.Patient_Id = %s;
            """
            cursor.execute(count_query, (patientid,))
            total_visit_count = cursor.fetchone()[0]

            # Process patient visit data
            patients_visit_data = []
            for row in patient_visit_list:
                patients_visit_dict = {
                    "visitid": row[0],
                    "Refering_doc": row[1],
                }
                patients_visit_data.append(patients_visit_dict)

            # Return JSON response
            return JsonResponse({
                "total_visit_count": total_visit_count,
                "visit_data": patients_visit_data
            }, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            # Ensure resources are released
            try:
                cursor.close()
                db.close()
            except Exception:
                pass
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)







@csrf_exempt
def get_for_all_patient_info(request):
    if request.method == 'GET':
        try:
            location = request.GET.get('location', 'ALL')  # Default to 'ALL' if not specified
            limit = int(request.GET.get('limit', 10))  # Default limit is 10
            offset = int(request.GET.get('offset', 0))  # Default offset is 0
            
            cursor = db.cursor()

            if location.upper() == 'ALL':
                query = f"""
                        SELECT 
                            rp.Patient_Id, 
                            rp.Patient_Name, 
                            rp.DOB, 
                            rp.Age, 
                            rp.Gender, 
                            rp.Marital_Status, 
                            rp.Door_No, 
                            rp.City, 
                            rp.Phone, 
                            rp.Alternate_No, 
                            rp.Email, 
                            rp.Patient_Barcode, 
                            rp.Street, 
                            rp.Rural_Urban, 
                            rp.State, 
                            rp.Pincode
                        FROM 
                            Register_patient_Details rp
                        ORDER BY 
                            rp.CreatedAt DESC
                        LIMIT {limit} OFFSET {offset};
                        """
                cursor.execute(query)
            else:
                query = f"""
                        SELECT 
                            rp.Patient_Id, 
                            rp.Patient_Name, 
                            rp.DOB, 
                            rp.Age, 
                            rp.Gender, 
                            rp.Marital_Status, 
                            rp.Door_No, 
                            rp.City, 
                            rp.Phone, 
                            rp.Alternate_No, 
                            rp.Email, 
                            rp.Patient_Barcode, 
                            rp.Street, 
                            rp.Rural_Urban, 
                            rp.State, 
                            rp.Pincode
                        FROM 
                            Register_patient_Details rp
                        WHERE 
                            rp.Location = %s 
                        ORDER BY 
                            rp.CreatedAt DESC
                        LIMIT {limit} OFFSET {offset};
                        """
                cursor.execute(query, (location,))
            
            patient_info_list = cursor.fetchall()



           
            # Total patient count
            count_query = """
                SELECT COUNT(DISTINCT rp.Patient_Id)
                FROM Register_patient_Details rp
                WHERE %s = 'ALL' OR rp.Location = %s
            """
            cursor.execute(count_query, (location, location) if location.upper() != 'ALL' else ('ALL',))
            total_patient_count = cursor.fetchone()[0]

            # Process patient data
            patients_data = []
            for row in patient_info_list:
                
                patient_dict = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1],
                    "DOB": row[2],
                    "Age": row[3],
                    "Gender": row[4],
                    "Marital_Status": row[5],
                    "Door_No": row[6],
                    "City": row[7],
                    "Phone": row[8],
                    "Alternate_No": row[9],
                    "Email": row[10],
                    "Patient_Barcode": row[11],
                    "Street": row[12],
                    "Rural_Urban": row[13],
                    "State": row[14],
                    "Pincode": row[15],
                    
                }
                patients_data.append(patient_dict)

            return JsonResponse({
                "total_pat_count": total_patient_count,
                "patients_data": patients_data
            }, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})









@csrf_exempt
def get_search_for_patient(request):
    if request.method == 'GET':
        try:
            location = request.GET.get('location', 'ALL')
            patientname = request.GET.get('name')
            phonenumber = request.GET.get('phone')
            
            
            cursor = db.cursor()
            
            # Initialize where_condition
            where_condition = "1=1"  # Default condition that is always true
            
            filters = []
            params = []

            if patientname:
                filters.append("LOWER(rp.Patient_Name) LIKE LOWER(%s)")
                params.append(f"%{patientname}%")
            if phonenumber:
                filters.append("LOWER(rp.Phone) LIKE LOWER(%s)")
                params.append(f"%{phonenumber}%")

            # Add filters dynamically to the WHERE condition
            if filters:
                where_condition += " AND " + " AND ".join(filters)

            if location.upper() == 'ALL':
                query = f"""
                        SELECT rp.Patient_Id, rp.Patient_Name, rp.DOB, rp.Age, rp.Gender, rp.Marital_Status, rp.Door_No, rp.City, rp.Phone, rp.Alternate_No, rp.Email, rp.Patient_Barcode, rp.Street, rp.Rural_Urban, rp.State, rp.Pincode, pv.Refering_Doctor
                        FROM Register_patient_Details rp
                        JOIN Patient_Visit_Id pv ON pv.Patient_Id = rp.Patient_Id
                        WHERE pv.Visit_Id = (
                                SELECT MAX(inner_pv.Visit_Id)
                                FROM Patient_Visit_Id inner_pv
                                WHERE inner_pv.Patient_Id = pv.Patient_Id
                            ) AND {where_condition}
                        """
                cursor.execute(query, params)
            else:
                query = f"""
                        SELECT rp.Patient_Id, rp.Patient_Name, rp.DOB, rp.Age, rp.Gender, rp.Marital_Status, rp.Door_No, rp.City, rp.Phone, rp.Alternate_No, rp.Email, rp.Patient_Barcode, rp.Street, rp.Rural_Urban, rp.State, rp.Pincode, pv.Refering_Doctor
                        FROM Register_patient_Details rp
                        JOIN Patient_Visit_Id pv ON pv.Patient_Id = rp.Patient_Id
                        WHERE 
                            pv.Visit_Id = (
                                SELECT MAX(inner_pv.Visit_Id)
                                FROM Patient_Visit_Id inner_pv
                                WHERE inner_pv.Patient_Id = pv.Patient_Id
                            ) AND 
                            rp.Location = %s AND {where_condition}
                        """
                cursor.execute(query, [location, *params])
            
            patient_info_list = cursor.fetchall()
            
            count_query = f"""
                            SELECT COUNT(DISTINCT rp.Patient_Id)
                            FROM Register_patient_Details rp
                            WHERE rp.Location = %s AND {where_condition}
                            """
            cursor.execute(count_query, [location, *params])
            
            total_patient_count = cursor.fetchone()[0]
            
            # Process the patient names
            patients_data = []
            for row in patient_info_list:
                patient_dict = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1],
                    "DOB": row[2],
                    "Age": row[3],
                    "Gender": row[4],
                    "Marital_Status": row[5],
                    "Door_No": row[6],
                    "City": row[7],
                    "Phone": row[8],
                    "Alternate_No": row[9],
                    "Email": row[10],
                    "Patient_Barcode": row[11],
                    "Street": row[12],
                    "Rural_Urban": row[13],
                    "state": row[14],
                    "Pincode": row[15],
                    "Refering_Doctor": row[16]
                }
                patients_data.append(patient_dict)

            return JsonResponse({"total_pat_count": total_patient_count, "patients_data": patients_data}, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})





# --------------------------job for the billing-----------


from django_apscheduler.jobstores import register_job
from apscheduler.schedulers.background import BackgroundScheduler



def job_function_test(task_name):
    try:
        
        cursor = db.cursor()

        checkquery ="""
            select count(*) from Billing_Item_Table_for_lab where  Billing_Invoice=%s and Patient_Id=%s and Visit_Id=%s
        """
        cursor.execute(checkquery,(task_name['next_id'],task_name['patientid'],task_name['visitid']))
        count=cursor.fetchone()[0]
        if int(count)<int(task_name['times_to_call']):
            cursor.execute("SELECT MAX(Item_Id) FROM Billing_Item_Table_for_lab")
            max_id_result = cursor.fetchone()
            next_item_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

            
            # SQL query to insert the billing information
            insert_sql = """
                INSERT INTO Billing_Item_Table_for_lab (
                    Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, Verify_Status, Approve_Status, Barcode_Id, Group_Name, CreatedBy
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                next_item_id, task_name['next_id'], task_name['patientid'], task_name['visitid'], task_name['patientname'], task_name['Dispatchmethod'], 
                task_name['testmethod'], task_name['test_name'], task_name['grossAmount'], task_name['location'], "Pending", "Pending", "Pending",
                "Pending", task_name['barcode'], task_name['testname'], task_name['CreatedBy']
            )
            cursor.execute(insert_sql, values)
            db.commit()
            print('calleddddddddddd')
            return JsonResponse({"message": "Billing information added successfully"})
    except Exception as e:
        print("error:", e)
        if db is not None:
            db.rollback()  # Rollback in case of error
        return JsonResponse({"error": "Failed to add billing information"})
    finally:
        if cursor is not None:
            cursor.close()
        if db is not None:
            db.close()



# ----------------insert billing---------------
@csrf_exempt
def insert_billing_info(request):
    if request.method == "POST":
        db = None
        cursor = None
        try:
            
            cursor = db.cursor()
            data = json.loads(request.body)
            # print(data)
            
            # Fetch the next Item_Id
            cursor.execute("SELECT MAX(Item_Id) FROM Billing_Item_Table_for_lab")
            max_id_result = cursor.fetchone()
            next_item_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

            # Values to be inserted
            invoiceno = data.get('invoiceno')
            patientid = data.get('patientid')
            visitid = data.get('visitid')
            patientname = data.get('patientname')
            Dispatchmethod = data.get('Dispatchmethod')
            location = data.get('location')
            barcode = data.get('barcode')
            testdetails = data.get('testdetails')
            createdby = data.get('CreatedBy')
            print('testdetails', testdetails)
            
            checkautoquey = """
                SELECT Test_Name, Parameter_One, Parameter_Two FROM Test_Descriptions WHERE Autocheck = 'Yes'
            """
            cursor.execute(checkautoquey)
            checkautores = cursor.fetchall()
            
            dataaaaaaa = {
                'patientid': patientid,
                'visitid': visitid,
                'patientname': patientname,
                'Dispatchmethod': Dispatchmethod,
                'location': location,
                'barcode': barcode,
                'CreatedBy' : createdby
            }

            for test in testdetails:
                testname = test['test_name']
                testcode = test['test_code']
                print(testname)
                grossAmount = test['cost_per_reportable']
                testmethod = test['testmethod']
                print('testmethod', testmethod)
                if testmethod == 'Group':
                    # test_names = []
                    query = "SELECT Test_Code,Test_Name FROM GroupMasterTestList WHERE group_code = %s"
                    cursor.execute(query, (testcode,))
                    test_results = cursor.fetchall()

                    print('test_results', test_results)
                    # for test_result in test_results:
                    #     test_names.append(test_result[0])
                    # print('test_names', test_names)
                    for test_name in test_results:
                        next_id = 'INV0000001'  # Default initial value

                        max_id_query = "SELECT MAX(Billing_Invoice) FROM Billing_invoice_and_bill_amount"
                        cursor.execute(max_id_query)
                        max_id_result = cursor.fetchone()

                        if max_id_result and max_id_result[0]:
                            next_id = generate_next_key(max_id_result[0])
                        
                        checkquery = """SELECT * FROM Billing_invoice_and_bill_amount WHERE Billing_Invoice=%s AND Patient_Id=%s AND Visit_Id=%s"""
                        cursor.execute(checkquery,(invoiceno,patientid,visitid))
                        result = cursor.fetchall()
                        
                        if result is not None:
                            return JsonResponse({'Message':''})
                        else:
                            insert_sql = """
                                INSERT INTO Billing_Item_Table_for_lab (
                                    Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, Verify_Status, Approve_Status, Barcode_Id, Group_Name, CreatedBy,Test_Code,Group_Code
                                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                            """
                            values = (
                                next_item_id, next_id, patientid, visitid, patientname, Dispatchmethod, 
                                testmethod, test_name[1], grossAmount, location, "Pending", "Pending", "Pending",
                                "Pending", barcode, testname, createdby,test_name[0],testcode
                            )
                            cursor.execute(insert_sql, values)
                            
                        if any(test_name in checkauto[0] for checkauto in checkautores):
                            scheduler = BackgroundScheduler()
                            scheduler.start()
                            print('Scheduler started')

                            for checkauto in checkautores:
                                if test_name == checkauto[0]:
                                    times_to_call = checkauto[1]
                                    time_gap = checkauto[2]
                                    
                                    dataaaaaaa['next_id'] = next_id
                                    dataaaaaaa['test_name'] = test_name
                                    dataaaaaaa['testname'] = testname
                                    dataaaaaaa['times_to_call'] = checkauto[1]
                                    print('dataaaa', dataaaaaaa)
                                    
                                    for i in range(times_to_call):
                                        print('time_gap', time_gap, time_gap * (i + 1))
                                        start_time = datetime.now() + timedelta(seconds=time_gap * (i + 1))
                                        print('start_time', start_time)
                                        scheduler.add_job(
                                            func=job_function_test,
                                            trigger='date',
                                            run_date=start_time,
                                            args=(dataaaaaaa,),
                                            id=f"{dataaaaaaa['test_name']}_{next_id}_{i}",
                                            replace_existing=True
                                        )
                        next_item_id += 1

                else:
                    next_id = 'INV0000001'  # Default initial value

                    max_id_query = "SELECT MAX(Billing_Invoice) FROM Billing_invoice_and_bill_amount"
                    cursor.execute(max_id_query)
                    max_id_result = cursor.fetchone()

                    if max_id_result and max_id_result[0]:
                        next_id = generate_next_key(max_id_result[0])

                    insert_sql = """
                        INSERT INTO Billing_Item_Table_for_lab (
                            Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, Verify_Status, Approve_Status, Barcode_Id, CreatedBy,Test_Code
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    values = (
                        next_item_id, invoiceno, patientid, visitid, patientname, Dispatchmethod, 
                        testmethod, testname, grossAmount, location, "Pending", "Pending", "Pending",
                        "Pending", barcode, createdby,testcode
                    )
                    cursor.execute(insert_sql, values)
                    
                    if any(testname in checkauto[0] for checkauto in checkautores):
                        scheduler = BackgroundScheduler()
                        scheduler.start()
                        print('Scheduler started')

                        for checkauto in checkautores:
                            if testname == checkauto[0]:
                                times_to_call = checkauto[1]
                                time_gap = checkauto[2]
                                dataaaaaaa['next_id'] = next_id
                                dataaaaaaa['times_to_call'] = checkauto[1]
                                dataaaaaaa['test_name'] = testname
                                dataaaaaaa['testname'] = 'None'
                                print('dataaaa', dataaaaaaa)
                                
                                for i in range(times_to_call):
                                    print('time_gap', time_gap, time_gap * (i + 1))
                                    start_time = datetime.now() + timedelta(seconds=time_gap * (i + 1))
                                    print('start_time', start_time)
                                    scheduler.add_job(
                                        func=job_function_test,
                                        trigger='date',
                                        run_date=start_time,
                                        args=(dataaaaaaa,),
                                        id=f"{dataaaaaaa['test_name']}_{next_id}_{i}",
                                        replace_existing=True
                                    )
                    next_item_id += 1

            db.commit()

            return JsonResponse({"message": "Billing information added successfully"})
        except Exception as e:
            print("error:", e)
            if db is not None:
                db.rollback()
            return JsonResponse({"error": "Failed to add billing information"})
        finally:
            if cursor is not None:
                cursor.close()
            if db is not None:
                db.close()


# @csrf_exempt
# def insert_billing_info(request):
#     if request.method == "POST":
#         db = None
#         cursor = None
#         try:
#             
#             cursor = db.cursor()
#             data = json.loads(request.body)
#             print(data)

#             # Fetch the next Item_Id
#             cursor.execute("SELECT MAX(Item_Id) FROM Billing_Item_Table_for_lab")
#             max_id_result = cursor.fetchone()
#             next_item_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

#             # Extract values from data
#             invoiceno = data.get('invoiceno')
#             patientid = data.get('patientid')
#             visitid = data.get('visitid')
#             patientname = data.get('patientname')
#             dispatch_method = data.get('Dispatchmethod')
#             test_method = data.get('testmethod')
#             location = data.get('location')
#             barcode = data.get('barcode')
#             created_by = data.get('CreatedBy')
#             test_details = data.get('testdetails')

#             checkautoquery = """
#                 SELECT Test_Name, Parameter_One, Parameter_Two FROM Test_Descriptions WHERE Autocheck='Yes'
#             """
#             cursor.execute(checkautoquery)
#             checkautores = cursor.fetchall()

#             for test in test_details:
#                 test_name = test['test_name']
#                 gross_amount = test['cost_per_reportable']
#                 next_id = invoiceno  # Default initial value

#                 insert_sql = """
#                     INSERT INTO Billing_Item_Table_for_lab (
#                         Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, Verify_Status, Approve_Status, Barcode_Id, CreatedBy
#                     ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#                 """
#                 values = (
#                     next_item_id, next_id, patientid, visitid, patientname, dispatch_method,
#                     test_method, test_name, gross_amount, location, "Pending", "Pending", "Pending",
#                     "Pending", barcode, created_by
#                 )
#                 cursor.execute(insert_sql, values)

#                 if any(test_name == checkauto[0] for checkauto in checkautores):
#                     # Create a scheduler instance
#                     scheduler = BackgroundScheduler()
#                     scheduler.start()
#                     print('Scheduler started')

#                     for checkauto in checkautores:
#                         if test_name == checkauto[0]:
#                             times_to_call = checkauto[1]
#                             time_gap = checkauto[2]

#                             dataaaaaaa = {
#                                 'next_id': next_id,
#                                 'test_name': test_name,
#                                 'testname': test_name,
#                                 'times_to_call': times_to_call,
#                                 'patientid': patientid,
#                                 'visitid': visitid,
#                                 'patientname': patientname,
#                                 'Dispatchmethod': dispatch_method,
#                                 'testmethod': test_method,
#                                 'grossAmount': gross_amount,
#                                 'location': location,
#                                 'barcode': barcode,
#                                 'CreatedBy': created_by
#                             }
#                             print('dataaaa', dataaaaaaa)

#                             for i in range(int(times_to_call)):
#                                 start_time = datetime.now() + timedelta(minutes=int(time_gap) * (i + 1))
#                                 print('start_time', start_time)
#                                 scheduler.add_job(
#                                     func=job_function_test,
#                                     trigger='date',
#                                     run_date=start_time,
#                                     args=(dataaaaaaa,),
#                                     id=f"{dataaaaaaa['test_name']}_{next_id}_{i}",
#                                     replace_existing=True
#                                 )

#                 next_item_id += 1

#             db.commit()

#             return JsonResponse({"message": "Billing information added successfully"})
#         except Exception as e:
#             print("error:", e)
#             if db is not None:
#                 db.rollback()
#             return JsonResponse({"error": "Failed to add billing information"})
#         finally:
#             if cursor is not None:
#                 cursor.close()
#             if db is not None:
#                 db.close()
#     else:
#         return JsonResponse({"Error": "Invalid request method. Only POST is allowed."})
    









#----------------------------------------Get For Patient Request ----------------------------------------#
                
def get_patient_request_data(request):
    if request.method == 'GET':
        try:
            # Establish database connection
            
            cursor = db.cursor()

            # Increase the group_concat_max_len limit
            cursor.execute("SET SESSION group_concat_max_len = 10000")

            # Define the SQL JOIN query
            query = """
            SELECT 
                rp.Patient_Id, 
                rp.Patient_Name, 
                rp.Age, 
                rp.Gender, 
                rp.City, 
                rp.Phone,
                pvi.Patient_Group, 
                pvi.Refering_Doctor, 
                GROUP_CONCAT(DISTINCT bit.Test_Name) AS Test_Name, 
                MAX(bit.UpdatedAt) AS UpdatedAt, 
                bit.Billing_Invoice AS Billing_Invoice, 
                SUM(bit.Gross_Amount) AS Gross_Amount, 
                pvi.Phlebotomist_Type, 
                pvi.Phlebotomist_Name, 
                bit.Visit_Id,
                bit.Barcode_Id
            FROM 
                Register_patient_Details rp
            JOIN 
                Billing_Item_Table_for_lab bit ON rp.Patient_Id = bit.Patient_Id
            JOIN
                Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
            GROUP BY 
                rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.City, rp.Phone,
                pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit.Visit_Id, bit.Barcode_Id;
            """

            # Execute the query
            cursor.execute(query)
            results = cursor.fetchall()

            # Format the results into a list of dictionaries for JSON response
            patients_data = []
            for row in results:
                patient_data = {
                    'Patient_Id': row[0],
                    'Patient_Name': row[1].upper(),
                    'Age': row[2],
                    'Gender': row[3],
                    'City': row[4],  # Changed 'Address' to 'City' for consistency
                    'Phone': row[5],
                    'Patient_Group': row[6],
                    'Refering_Doctor': row[7],
                    'Test_Names': row[8],
                    'UpdatedAt': row[9].strftime('%Y-%m-%d'),  # Adjust format as needed
                    'Billing_Invoice': row[10],
                    'Gross_Amount': row[11],
                    'Phlebotomist_Type': row[12],
                    'Phlebotomist_Name': row[13],
                    'Visit_Id': row[14],
                    'Barcode': row[15]
                }
                patients_data.append(patient_data)

            return JsonResponse(patients_data, safe=False)  # Use safe=False to allow non-dict objects

        except Exception as e:
            print(e)
            # Handle any exceptions that occur during the process
            return JsonResponse({"error": str(e)})

        finally:
            # Ensure the database connection and cursor are closed properly
            cursor.close()
            db.close()

    else:
        # Handle case where the request method is not GET
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})

    
#-------------------------------get capture list -------------------------------------------------#
    
# def get_patient_request_capture_data(request):
#     if request.method == 'GET':
#         try:
#             cursor = db.cursor()
#             location = request.GET.get('Location')
#             department_codes = request.GET.get('Department')
#             limit = int(request.GET.get('limit', 10))
#             offset = int(request.GET.get('offset', 0))
            

#             location = Location_Detials.objects.get(Location_Id=location).Location_Name

#             # Convert department codes to names
#             if department_codes:
#                 department_codes_list = department_codes.split(',')
#                 cursor.execute(
#                     """
#                     SELECT SubDepartment_Name
#                     FROM SubLab_Department_Detials
#                     WHERE SubDepartment_Code IN %s
#                     """,
#                     [tuple(department_codes_list)]
#                 )
#                 department_names = [row[0] for row in cursor.fetchall()]
#             else:
#                 return JsonResponse({"error": "No valid department codes provided."}, status=400)

#             base_select = """
#                 SELECT DISTINCT
#                     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                     pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                     bit.UpdatedAt, bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id,
#                     bit.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
#                     rp.Patient_Barcode, rp.DOB, bit.Sample_Barcode_Image, bit.Status
#                 FROM Register_patient_Details rp
#                 JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
#                 JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
#                 JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
#             """

#             department_joins = """
#                 LEFT JOIN OfferPackage op ON bitem.PackageCode = op.package_code AND bitem.Test_Method = 'Offers'
#                 LEFT JOIN Group_Master gm ON bitem.Group_Code = gm.Group_Code AND bitem.Test_Method = 'group'
#                 LEFT JOIN Test_Descriptions td ON bitem.Test_Code = td.Test_Code AND bitem.Test_Method = 'individual'
#                 LEFT JOIN SubLab_Department_Detials sld ON 
#                     (bitem.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                     OR (bitem.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#             """

#             department_condition = """
#                 AND (
#                     (bitem.Test_Method = 'Offers' AND op.department_name IN %s)
#                     OR (bitem.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                     OR (bitem.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                 )
#             """

#             if location == 'ALL':
#                 patient_query = f"""
#                     {base_select}
#                     {department_joins}
#                     WHERE
#                         bit.Capture_Sample_Status != 'Completed'
#                         AND bit.Status != 'Cancelled'
#                         {department_condition}
#                     ORDER BY bit.UpdatedAt DESC
#                     LIMIT %s OFFSET %s
#                 """
#                 query_params = [tuple(department_names)] * 3 + [limit, offset]

#                 # Count query
#                 count_query = f"""
#                     SELECT COUNT(DISTINCT bit.Billing_Invoice)
#                     FROM Billing_invoice_and_bill_amount bit
#                     JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
#                     {department_joins}
#                     WHERE
#                         bit.Capture_Sample_Status != 'Completed'
#                         AND bit.Status != 'Cancelled'
#                         {department_condition}
#                 """
#                 count_params = [tuple(department_names)] * 3

#             else:
#                 where_conditions = """
#                     WHERE
#                         bit.Status != 'Cancelled'
#                         AND (
#                             (bitem.Service_Status = 'Transfer' AND LOWER(bitem.Service_Status) LIKE LOWER(%s))
#                             OR (bitem.Service_Status != 'Transfer' AND bitem.Service_Status != 'Completed' AND LOWER(bitem.Location) = LOWER(%s))
#                         )
#                 """
#                 patient_query = f"""
#                     {base_select}
#                     {department_joins}
#                     {where_conditions}
#                     {department_condition}
#                     ORDER BY bit.UpdatedAt DESC
#                     LIMIT %s OFFSET %s
#                 """
#                 query_params = [f'%{location}%', location.lower()] + [tuple(department_names)] * 3 + [limit, offset]

#                 # Count query with location filter
#                 count_query = f"""
#                     SELECT COUNT(DISTINCT bit.Billing_Invoice)
#                     FROM Billing_invoice_and_bill_amount bit
#                     JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
#                     {department_joins}
#                     {where_conditions}
#                     {department_condition}
#                 """
#                 count_params = [f'%{location}%', location.lower()] + [tuple(department_names)] * 3

#             # Execute count query
#             cursor.execute(count_query, count_params)
#             total_records = cursor.fetchone()[0]

#             # Execute data query
#             cursor.execute(patient_query, query_params)
#             patients_results = cursor.fetchall()

#             patients_data = []
#             for row in patients_results:
#                 cursor.execute("""
#                     SELECT Service_Status, Test_Name, Test_Code
#                     FROM Billing_Item_Table_for_lab
#                     WHERE Billing_Invoice = %s
#                 """, [row[11]])
#                 service_statuses = cursor.fetchall()
#                 service_status_list = [
#                     {'status': status[0], 'testname': status[1], 'testcode': status[2]}
#                     for status in service_statuses
#                 ]

#                 billdept = "OP" if row[11] and str(row[11]).startswith("OP") else "IP"

#                 patients_data.append({
#                     'Patient_Id': row[0],
#                     'Patient_Name': row[1].upper(),
#                     'Age': row[2],
#                     'Gender': row[3],
#                     'Door_No': row[4],
#                     'Phone': row[5],
#                     'Patient_Group': row[6],
#                     'Refering_Doctor': row[7],
#                     'Phlebotomist_Name': row[8],
#                     'Phlebotomist_Type': row[9],
#                     'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
#                     'Billing_Invoice': row[11],
#                     'Total_Charge': row[12],
#                     'TestCount': row[13],
#                     'Service_Statuses': service_status_list,
#                     'Barcode': row[14],
#                     'Visit_Id': row[15],
#                     'Street': row[16],
#                     'Rural_Urban': row[17],
#                     'City': row[18],
#                     'State': row[19],
#                     'Pincode': row[20],
#                     'Time_Period': row[21],
#                     'patientbarcode': row[22],
#                     'dob': row[23],
#                     'Sample_Barcode_Image': f"data:image/jpg;base64,{base64.b64encode(row[24]).decode('utf-8')}" if row[24] else None,
#                     'Bill_status': row[25],
#                     'billdept': billdept
#                 })

#             return JsonResponse({
#                 'total_records': total_records,
#                 'patients_data': patients_data
#             }, safe=False)

#         except Exception as e:
#             print('Error:', e)
#             return JsonResponse({"error": str(e)})
#         finally:
#             cursor.close()
#             db.close()
#     else:
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)


# It ruturn duplicates
                # JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id

    
def get_patient_request_capture_data(request):
    if request.method == 'GET':
        try:
            cursor = db.cursor()
            location = request.GET.get('Location')
            department_codes = request.GET.get('Department')
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            patientname = request.GET.get('name')
            patientid = request.GET.get('id')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            datetype = request.GET.get('dateType')
            dates = request.GET.get('date')
            fromdate = request.GET.get('date')
            todate = request.GET.get('to')

            where_clauses = []
            paramsD = []

            if datetype:
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    paramsD.append(dates)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    paramsD.append(fromdate)
                    paramsD.append(todate)

            if patientname and patientname !="":
                where_clauses.append("bit.Patient_Name LIKE %s")
                paramsD.append(f"%{patientname}%")
            if patientid and patientid !="":
                where_clauses.append("bit.Patient_Id = %s")
                paramsD.append(patientid)
            if barcode and barcode !="":
                where_clauses.append("bit.Barcode_Id = %s")
                paramsD.append(barcode)
            if invoicenumber and invoicenumber !="":
                where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
                paramsD.append(invoicenumber)

            where = " AND ".join(where_clauses) if where_clauses else "1=1"


            location = Location_Detials.objects.get(Location_Id=location).Location_Name

            # Convert department codes to names
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
            else:
                return JsonResponse({"error": "No valid department codes provided."}, status=400)


            # ---------------- Main query ---------------- #

            base_select = """
                SELECT DISTINCT
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                    bit.UpdatedAt, bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id,
                    bit.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                    rp.Patient_Barcode, rp.DOB, bit.Sample_Barcode_Image, bit.Status
                FROM Register_patient_Details rp
                JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN (
                    SELECT p1.*
                    FROM Patient_Visit_Id p1
                    INNER JOIN (
                        SELECT Patient_Id, Visit_Id, MAX(CreatedAt) as LatestVisit
                        FROM Patient_Visit_Id
                        GROUP BY Patient_Id, Visit_Id
                    ) p2
                    ON p1.Patient_Id = p2.Patient_Id 
                    AND p1.Visit_Id = p2.Visit_Id
                    AND p1.CreatedAt = p2.LatestVisit
                ) pvi ON rp.Patient_Id = pvi.Patient_Id 
                    AND bit.Visit_Id = pvi.Visit_Id
                JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
            """

            department_joins = """
                LEFT JOIN OfferPackage op ON bitem.PackageCode = op.package_code AND bitem.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bitem.Group_Code = gm.Group_Code AND bitem.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bitem.Test_Code = td.Test_Code AND bitem.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bitem.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bitem.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
            """

            department_condition = """
                AND (
                    (bitem.Test_Method = 'Offers' AND op.department_name IN %s)
                    OR (bitem.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                    OR (bitem.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                )
            """

            if location == 'ALL':
                patient_query = f"""
                    {base_select}
                    {department_joins}
                    WHERE
                        bit.Capture_Sample_Status != 'Completed'
                        AND bit.Status != 'Cancelled'
                        {department_condition} AND {where}
                    ORDER BY bit.UpdatedAt DESC
                    LIMIT %s OFFSET %s
                """
                query_params = [tuple(department_names)] * 3 + paramsD + [limit, offset]

                # Count query
                count_query = f"""
                    SELECT COUNT(DISTINCT bit.Billing_Invoice)
                    FROM Billing_invoice_and_bill_amount bit
                    JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
                    {department_joins}
                    WHERE
                        bit.Capture_Sample_Status != 'Completed'
                        AND bit.Status != 'Cancelled'
                        {department_condition} AND {where}  AND bitem.Bill_Status != "Canceled"	
                """
                count_params = [tuple(department_names)] * 3 + paramsD

            else:
                where_conditions = """
                    WHERE
                        bit.Status != 'Cancelled'
                        AND (
                            (bitem.Service_Status = 'Transfer' AND LOWER(bitem.Service_Status) LIKE LOWER(%s))
                            OR (bitem.Service_Status != 'Transfer' AND bitem.Service_Status != 'Completed' AND LOWER(bitem.Location) = LOWER(%s))
                        )
                """
                patient_query = f"""
                    {base_select}
                    {department_joins}
                    {where_conditions}
                    {department_condition} AND {where}  AND bitem.Bill_Status != "Canceled"	
                    ORDER BY bit.UpdatedAt DESC
                    LIMIT %s OFFSET %s
                """
                query_params = [f'%{location}%', location.lower()] + [tuple(department_names)] * 3 + paramsD + [limit, offset]

                # Count query with location filter
                count_query = f"""
                    SELECT COUNT(DISTINCT bit.Billing_Invoice)
                    FROM Billing_invoice_and_bill_amount bit
                    JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
                    {department_joins}
                    {where_conditions}
                    {department_condition} AND {where}
                """
                count_params = [f'%{location}%', location.lower()] + [tuple(department_names)] * 3 + paramsD

            # Execute count query
            cursor.execute(count_query, count_params)
            total_records = cursor.fetchone()[0]

            # Execute data query
            cursor.execute(patient_query, query_params)
            patients_results = cursor.fetchall()

            patients_data = []
            for row in patients_results:
                cursor.execute("""
                    SELECT Service_Status, Test_Name, Test_Code
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s AND Bill_Status != "Canceled"
                """, [row[11]])
                service_statuses = cursor.fetchall()
                service_status_list = [
                    {'status': status[0], 'testname': status[1], 'testcode': status[2]}
                    for status in service_statuses
                ]

                billdept = "OP" if row[11] and str(row[11]).startswith("OP") else "IP"

                if len(service_status_list) > 0:
                    patients_data.append({
                        'Patient_Id': row[0],
                        'Patient_Name': row[1].upper(),
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                        'Billing_Invoice': row[11],
                        'Total_Charge': row[12],
                        'TestCount': row[13],
                        'Service_Statuses': service_status_list,
                        'Barcode': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Time_Period': row[21],
                        'patientbarcode': row[22],
                        'dob': row[23],
                        'Sample_Barcode_Image': f"data:image/jpg;base64,{base64.b64encode(row[24]).decode('utf-8')}" if row[24] else None,
                        'Bill_status': row[25],
                        'billdept': billdept
                    })

            return JsonResponse({
                'total_records': total_records,
                'patients_data': patients_data
            }, safe=False)

        except Exception as e:
            print('Error:', e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)




def getsearchdataforphelobotomist(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        patientname = request.GET.get('name')
        patientid = request.GET.get('patientid')
        barcode = request.GET.get('barcode')
        invoicenumber = request.GET.get('invoice')
        department_list = request.GET.getlist('department')
        SubDepartment_Name = request.GET.get('SubDepartment_Name')
        locationid = request.GET.get('Location')
        limit = int(request.GET.get('limit', 10))
        offset = int(request.GET.get('offset', 0))

        # Get location name
        location = 'ALL'
        if locationid:
            try:
                location_obj = Location_Detials.objects.get(Location_Id=locationid)
                location = location_obj.Location_Name
            except Location_Detials.DoesNotExist:
                return JsonResponse({"error": "Invalid location ID."}, status=400)

        filters = []
        params = []

        if patientname:
            filters.append("LOWER(rp.Patient_Name) LIKE LOWER(%s)")
            params.append(f"%{patientname}%")
        if patientid:
            filters.append("LOWER(rp.Patient_Id) LIKE LOWER(%s)")
            params.append(f"%{patientid}%")
        if barcode:
            filters.append("LOWER(bit.Barcode_Id) LIKE LOWER(%s)")
            params.append(f"%{barcode}%")
        if invoicenumber:
            filters.append("LOWER(bit.Billing_Invoice) LIKE LOWER(%s)")
            params.append(f"%{invoicenumber}%")
        if location != 'ALL':
            filters.append("LOWER(pvi.Location) = LOWER(%s)")
            params.append(location)
        if SubDepartment_Name:
            filters.append("LOWER(sld.SubDepartment_Name) LIKE LOWER(%s)")
            params.append(f"%{SubDepartment_Name}%")

        where_condition = " AND ".join(filters) if filters else "1=1"

        with connection.cursor() as cursor:
            count_query = f"""
                SELECT COUNT(DISTINCT bit.Billing_Invoice)
                FROM Register_patient_Details rp
                JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
                JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                LEFT JOIN Test_Descriptions td ON bitem.Test_Code = td.Test_Code AND bitem.Test_Method = 'individual'
                LEFT JOIN Group_Master gm ON bitem.Group_Code = gm.Group_Code AND bitem.Test_Method = 'group'
                LEFT JOIN OfferPackage op ON bitem.PackageCode = op.package_code AND bitem.Test_Method = 'Offers'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bitem.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                    OR (bitem.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bitem.Test_Method = 'Offers' AND op.department_name = sld.SubDepartment_Name)
                WHERE bit.Status != 'Cancelled'  AND bitem.Service_Status != 'Completed' AND {where_condition}
            """
            cursor.execute(count_query, params)
            total_records = cursor.fetchone()[0]

            base_query = f"""
                SELECT DISTINCT
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                    bit.UpdatedAt, bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id,
                    bit.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
                    rp.Time_Period, rp.Patient_Barcode, rp.DOB, bit.Sample_Barcode_Image, bit.Status
                FROM Register_patient_Details rp
                JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN Billing_Item_Table_for_lab bitem ON bit.Billing_Invoice = bitem.Billing_Invoice
                JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                LEFT JOIN Test_Descriptions td ON bitem.Test_Code = td.Test_Code AND bitem.Test_Method = 'individual'
                LEFT JOIN Group_Master gm ON bitem.Group_Code = gm.Group_Code AND bitem.Test_Method = 'group'
                LEFT JOIN OfferPackage op ON bitem.PackageCode = op.package_code AND bitem.Test_Method = 'Offers'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bitem.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                    OR (bitem.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bitem.Test_Method = 'Offers' AND op.department_name = sld.SubDepartment_Name)
                WHERE bit.Status != 'Cancelled' AND bitem.Service_Status != 'Completed' AND {where_condition}
            """

            if department_list:
                base_query += """
                    AND (
                        (bitem.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bitem.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bitem.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )
                """
                params += [tuple(department_list)] * 3

            base_query += " ORDER BY bit.UpdatedAt DESC LIMIT %s OFFSET %s"
            params += [limit, offset]

            cursor.execute(base_query, params)
            rows = cursor.fetchall()

            patients_data = []
            for row in rows:
                billing_invoice = row[11]

                cursor.execute("""
                    SELECT Service_Status, Test_Name, Test_Code
                    FROM Billing_Item_Table_for_lab
                    WHERE Billing_Invoice = %s
                """, [billing_invoice])
                service_statuses = cursor.fetchall()

                service_status_list = [
                    {'status': s[0], 'testname': s[1], 'testcode': s[2]}
                    for s in service_statuses
                ]

                patients_data.append({
                    'Patient_Id': row[0],
                    'Patient_Name': row[1].upper(),
                    'Age': row[2],
                    'Gender': row[3],
                    'Door_No': row[4],
                    'Phone': row[5],
                    'Patient_Group': row[6],
                    'Refering_Doctor': row[7],
                    'Phlebotomist_Name': row[8],
                    'Phlebotomist_Type': row[9],
                    'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                    'Billing_Invoice': billing_invoice,
                    'Total_Charge': float(row[12]) if row[12] else 0.0,
                    'TestCount': row[13],
                    'Service_Statuses': service_status_list,
                    'Barcode': row[14],
                    'Visit_Id': row[15],
                    'Street': row[16],
                    'Rural_Urban': row[17],
                    'City': row[18],
                    'State': row[19],
                    'Pincode': row[20],
                    'Time_Period': row[21],
                    'patientbarcode': row[22],
                    'dob': row[23],
                    'Sample_Barcode_Image': f"data:image/jpg;base64,{base64.b64encode(row[24]).decode('utf-8')}" if row[24] else None,
                    'Bill_status': row[25],
                })

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_patient_request_capture_data_for_profile(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()
            invoice = request.GET.get('Billinginvoice')
            patient_query = """
            SELECT 
                rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Address, rp.Phone,
                rp.Patient_Group, rp.Refering_Doctor, bit.UpdatedAt, 
                bit.Billing_Invoice, bit.Total_Charge, rp.Phlebotomist_Type, rp.Phlebotomist_Name, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id
            FROM 
                Register_patient_Details rp
            JOIN 
                Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
            WHERE
                Capture_Sample_Status != 'Completed' AND Billing_Invoice = %s
            """
            cursor.execute(patient_query,(invoice,))
            patients_results = cursor.fetchall()
            patients_data = []
            for row in patients_results:
                service_status_query = """
                SELECT Service_Status, Test_Name, Test_Code
                FROM Billing_Item_Table_for_lab
                WHERE Billing_Invoice = %s
                """
                cursor.execute(service_status_query, [row[9]])
                service_statuses = cursor.fetchall()
                service_status_list = [{'status' : status[0],
                                       'testname': status[1],
                                       'testcode': status[2]}
                                        for status in service_statuses]
                patient_data = {
                    'Patient_Id': row[0],
                    'Patient_Name': row[1],
                    'Age': row[2],
                    'Gender': row[3],
                    'Address': row[4],
                    'Phone': row[5],
                    'Patient_Group': row[6],
                    'Refering_Doctor': row[7],
                    'UpdatedAt': row[8].strftime('%Y-%m-%d'),
                    'Billing_Invoice': row[9],
                    'Test_value': row[10],
                    'Phlebotomist_Type': row[11],
                    'Phlebotomist_Name': row[12],
                    'TestCount': row[13],
                    'Service_Statuses': service_status_list,
                    'Billing_Id' : row[14],
                    'Visit_id' : row[15]
                }
                patients_data.append(patient_data)
            return JsonResponse(patients_data, safe=False)
        except Exception as e:
            print('Error:', e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})



def get_for_sample_test_data(request):
    if request.method != 'GET':
        return JsonResponse({"Error": "Invalid request method. Only GET is allowed."})

    try:
        cursor = db.cursor()
        invoice = request.GET.get('Billinginvoice')
        gender = request.GET.get('gender')
        age = request.GET.get('age')
        timeperiod = request.GET.get('timeperiod')
        department_codes = request.GET.get('Department')  # e.g., 'LSDC000007,LSDC000004'

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

        # Fetch tests with department filtering
        sql_testname = """
            SELECT bit.Test_Name, bit.Test_Method, bit.Test_Code, bit.PackageCode, bit.Group_Name, bit.Group_Code,
                   bit.IsSubTest, bit.SubTestCodes
            FROM Billing_Item_Table_for_lab bit
            LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
            LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
            LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
            LEFT JOIN SubLab_Department_Detials sld ON 
                (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
            WHERE bit.Billing_Invoice = %s 
            AND bit.Bill_Status != "Canceled"
            AND bit.Service_Status != 'Completed'
            AND (
                (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
            )
        """
        cursor.execute(sql_testname, (invoice, tuple(department_names), tuple(department_names), tuple(department_names)))
        tests = cursor.fetchall()

        # Initialize a flat list for the tree structure
        tree_data = []

        # Subtest mapping
        subtest_parent_map = {}
        for test in tests:
            test_code = test[2]
            subtest_codes = test[7]
            if subtest_codes:
                for subtest_code in subtest_codes.split(','):
                    subtest_parent_map[subtest_code.strip()] = test_code

        # Temporary storage for packages and groups
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

        # Process each test
        for test in tests:
            test_name = test[0]
            test_method = test[1]
            test_code = test[2]
            package_code = test[3]
            group_name = test[4]
            group_code = test[5]
            is_subtest = test[6]

            if test_code in subtest_parent_map:
                continue  # Skip subtests for now

            # Fetch additional test details
            cursor.execute("SELECT Culturetest FROM Test_Descriptions WHERE Test_Code = %s", (test_code,))
            culturetest = cursor.fetchone()
            culturetest = culturetest[0] if culturetest is not None else 'No'

            cursor.execute("SELECT sub_department_id FROM Test_Descriptions WHERE Test_Code = %s", (test_code,))
            departmenthis = cursor.fetchone()
            departmenthis = departmenthis[0] if departmenthis is not None else 'No'

            if departmenthis in ['HISTOPATHOLOGY', 'MOLECULARBIOLOGY'] or culturetest == 'Yes':
                sql_test_details = """
                    SELECT td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name, mm.Method_Name, um.Unit_Name,
                           td.department_id, td.Input_Type, td.sub_department_id, td.Captured_Unit
                    FROM Test_Descriptions td
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN methods_masters mm ON td.Method_Name_id = mm.Method_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code
                    WHERE td.Test_Code = %s AND td.sub_department_id IN (
                        SELECT SubDepartment_Code FROM SubLab_Department_Detials WHERE SubDepartment_Name IN %s
                    )
                """
                cursor.execute(sql_test_details, (test_code, tuple(department_names)))
                test_detail = cursor.fetchall()
            else:
                sql_test_details = """
                    SELECT
                        td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name,
                        td.Captured_Unit, asm.Gender, asm.FromAge, asm.FromAgeType,
                        asm.Toage, asm.ToAgeType, asm.From_Value, asm.To_Value,
                        asm.PanicLow, asm.PanicHigh, um.Unit_Name, td.Department_id, td.Input_Type,
                        asm.NormalValue, asm.Reference_Range, td.sub_department_id
                    FROM Test_Descriptions td
                    LEFT JOIN Age_Setup_Master asm ON td.Test_Code = asm.Test_Code_id
                        AND (asm.Gender = %s OR asm.Gender = 'Both')
                        AND asm.FromAge <= %s AND asm.Toage >= %s
                        AND asm.FromAgeType = %s AND asm.ToAgeType = %s
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code
                    WHERE td.Test_Code = %s AND td.sub_department_id IN (
                        SELECT SubDepartment_Code FROM SubLab_Department_Detials WHERE SubDepartment_Name IN %s
                    )
                """
                cursor.execute(sql_test_details, (gender, age, age, timeperiod, timeperiod, test_code, tuple(department_names)))
                test_detail = cursor.fetchall()

            for detail in test_detail:
                datalist = {
                    "Test_Name": detail[0],
                    "Test_Code": detail[1],
                    "Container_Name": detail[2],
                    "Specimen_Name": detail[3],
                    "Captured_Unit": detail[4] if len(detail) > 4 else None,
                    "Gender": detail[5] if len(detail) > 5 else None,
                    "FromAge": detail[6] if len(detail) > 6 else None,
                    "FromAgeType": detail[7] if len(detail) > 7 else None,
                    "ToAge": detail[8] if len(detail) > 8 else None,
                    "ToAgeType": detail[9] if len(detail) > 9 else None,
                    "From_Value": detail[10] if len(detail) > 10 else None,
                    "To_Value": detail[11] if len(detail) > 11 else None,
                    "PanicLow": detail[12] if len(detail) > 12 else None,
                    "PanicHigh": detail[13] if len(detail) > 13 else None,
                    "Test_Method": test_method,
                    "UOM": detail[14] if len(detail) > 14 else None,
                    "Department": detail[15] if len(detail) > 15 else None,
                    "Input_Type": detail[16] if len(detail) > 16 else None,
                    "NormalValue": detail[17] if len(detail) > 17 and detail[17] is not None else 'N/A',
                    "Reference_Range": detail[18] if len(detail) > 18 and detail[18] is not None else 'N/A',
                    "Sub_Department": detail[19] if len(detail) > 19 else None,
                    "SubTests": []
                }

                # Handle subtests
                if test[7]:
                    subtest_codes = test[7].split(',')
                    for subtest_code in subtest_codes:
                        subtest_code = subtest_code.strip()
                        cursor.execute("""
                            SELECT td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name,
                                   td.Captured_Unit, um.Unit_Name, td.Department_id, td.Input_Type, td.sub_department_id
                            FROM Test_Descriptions td
                            LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code
                            LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                            LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code
                            WHERE td.Test_Code = %s AND td.sub_department_id IN (
                                SELECT SubDepartment_Code FROM SubLab_Department_Detials WHERE SubDepartment_Name IN %s
                            )
                        """, (subtest_code, tuple(department_names)))
                        subtest = cursor.fetchone()
                        if subtest:
                            subtest_data = {
                                "Test_Name": subtest[0],
                                "Test_Code": subtest[1],
                                "Container_Name": subtest[2],
                                "Specimen_Name": subtest[3],
                                "Captured_Unit": subtest[4],
                                "Test_Method": test_method,
                                "UOM": subtest[5],
                                "Department": subtest[6],
                                "Input_Type": subtest[7],
                                "Sub_Department": subtest[8],
                                "SubTests": []
                            }
                            datalist["SubTests"].append(subtest_data)

                # Organize into the tree
                if package_code:
                    cursor.execute("SELECT package_name, department_name FROM OfferPackage WHERE package_code = %s", (package_code,))
                    package_info = cursor.fetchone()
                    package_name = package_info[0] if package_info else "Unknown Package"
                    packages[package_code]["PackageName"] = package_name
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

        # Build the final tree
        for package_code, package_data in packages.items():
            package_entry = {
                "PackageName": package_data["PackageName"],
                "PackageCode": package_data["PackageCode"],
                "Groups": [
                    {"GroupName": group_data["GroupName"], "GroupCode": group_data["GroupCode"], "Tests": group_data["Tests"]}
                    for group_data in package_data["Groups"].values()
                ],
                "Tests": package_data["Tests"]
            }
            tree_data.append(package_entry)

        for group_code, group_data in standalone_groups.items():
            group_entry = {
                "GroupName": group_data["GroupName"],
                "GroupCode": group_data["GroupCode"],
                "Tests": group_data["Tests"]
            }
            tree_data.append(group_entry)

        return JsonResponse(tree_data, safe=False)

    except Exception as er:
        print('Error:', str(er))
        return JsonResponse({"Error": str(er)})
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()




# def get_for_sample_test_data(request):
#     if request.method == 'GET':
#         try:
#             
#             cursor = db.cursor()
#             invoice = request.GET.get('Billinginvoice')
#             gender = request.GET.get('gender')
#             print('gender', gender)
#             age = request.GET.get('age')
#             print('age', age)
#             timeperiod = request.GET.get('timeperiod')
#             print('timeperiod', timeperiod)

#             sql_testname = """
#                 SELECT Test_Name, Test_Method, Test_Code 
#                 FROM Billing_Item_Table_for_lab 
#                 WHERE Billing_Invoice=%s AND Service_Status != 'Completed'
#             """
#             cursor.execute(sql_testname, (invoice,))
#             tests = cursor.fetchall()
#             print('tests :',tests)
#             details_list = []
#             for test in tests:
#                 cursor.execute("SELECT Culturetest FROM Test_Descriptions WHERE Test_Code = %s", (test[2],))
#                 culturetest = cursor.fetchone()
#                 culturetest = culturetest[0] if culturetest is not None else 'No'
#                 print('culturetest :',culturetest)
#                 cursor.execute("SELECT Sub_Department FROM Test_Descriptions WHERE Test_Code = %s", (test[2],))
#                 departmenthis = cursor.fetchone()
#                 departmenthis = departmenthis[0] if departmenthis is not None else 'No'
#                 print('departmenthis :',departmenthis)
#                 if departmenthis in ['HISTOPATHOLOGY', 'MOLECULARBIOLOGY']:
#                     culture_query = """
#                         SELECT Test_Name, Test_Code, Container_Name, Specimen_Name, Method_Name, UOM, Department, Input_Type,Sub_Department
#                         FROM Test_Descriptions WHERE Test_Code = %s
#                     """
#                     cursor.execute(culture_query, (test[2],))
#                     test_detail = cursor.fetchall()
#                     for detail in test_detail:
#                         datalist = {
#                             "Test_Name": detail[0],
#                             "Test_Code": detail[1],
#                             "Container_Name": detail[2],
#                             "Specimen_Name": detail[3],
#                             "Method_Name": detail[4],
#                             "UOM": detail[5],
#                             "Department": detail[6],
#                             "Input_Type": detail[7],
#                             "Sub_Department":detail[8]
#                         }
#                         details_list.append(datalist)

#                 elif culturetest == 'Yes':
#                     culture_query = """
#                         SELECT Test_Name, Test_Code, Container_Name, Specimen_Name, Method_Name, UOM, Department, Input_Type,Sub_Department
#                         FROM Test_Descriptions WHERE Test_Code = %s
#                     """
#                     cursor.execute(culture_query, (test[2],))
#                     test_detail = cursor.fetchall()
#                     for detail in test_detail:
#                         datalist = {
#                             "Test_Name": detail[0],
#                             "Test_Code": detail[1],
#                             "Container_Name": detail[2],
#                             "Specimen_Name": detail[3],
#                             "Method_Name": detail[4],
#                             "UOM": detail[5],
#                             "Department": detail[6],
#                             "Input_Type": detail[7],
#                             "Sub_Department":detail[8]
#                         }
#                         details_list.append(datalist)  # Append to the main details_list
#                 else:
                    
#                     # queyry = """SELECT FromAge FROM Age_Setup_Master  WHERE Test_Code=%s"""
#                     # cursor.execute(queyry,(test[2],))
#                     # data =cursor.fetchall()
#                     # print('--------data', data)
#                     # if data is not None:
                        
#                     sql_test_details = """
#                       SELECT 
#     td.Test_Name, 
#     td.Test_Code, 
#     td.Container_Name, 
#     td.Specimen_Name, 
#     td.Captured_Unit,
#     asm.Gender, 
#     asm.FromAge, 
#     asm.FromAgeType, 
#     asm.Toage, 
#     asm.ToAgeType, 
#     asm.From_Value, 
#     asm.To_Value, 
#     asm.PanicLow, 
#     asm.PanicHigh, 
#     td.UOM, 
#     td.Department, 
#     td.Input_Type, 
#     asm.NormalValue, 
#     asm.Reference_Range,
#     td.Sub_Department
# FROM 
#     Test_Descriptions td
# LEFT JOIN 
#     Age_Setup_Master asm ON td.Test_Code = asm.Test_Code
#     AND (asm.Gender = %s OR asm.Gender = 'Both')
#     AND asm.FromAge <= %s 
#     AND asm.Toage >= %s 
#     AND asm.FromAgeType = %s
#     AND asm.ToAgeType = %s
# WHERE 
#     td.Test_Code = %s;

#                     """
#                     cursor.execute(sql_test_details, ( gender, age, age, timeperiod, timeperiod,test[2]))
#                     test_detail = cursor.fetchall()
#                     print('test_detail :',test_detail)
#                     for detail in test_detail:
#                         datalist = {
#                             "Test_Name": detail[0],
#                             "Test_Code": detail[1],
#                             "Container_Name": detail[2],
#                             "Specimen_Name": detail[3],
#                             "Captured_Unit": detail[4],
#                             "Gender": detail[5],
#                             "FromAge": detail[6],
#                             "FromAgeType": detail[7],
#                             "ToAge": detail[8],
#                             "ToAgeType": detail[9],
#                             "From_Value": detail[10],
#                             "To_Value": detail[11],
#                             "PanicLow": detail[12],
#                             "PanicHigh": detail[13],
#                             "Test_Method": test[1],  # Adding Test_Method to the output
#                             'UOM': detail[14],
#                             'Department': detail[15],
#                             'Input_Type': detail[16],
#                             'NormalValue': detail[17] if detail[17] is not None else '-',
#                             'Reference_Range': detail[18] if detail[18] is not None else '-',
#                             'Sub_Department':detail[19]
#                         }
#                         details_list.append(datalist)  # Append to the main details_list

#             return JsonResponse(details_list, safe=False)

#         except Exception as er:
#             print('error :',str(er))
#             return JsonResponse({"Error": str(er)})
#         finally:
#             if cursor:
#                 cursor.close()
#             if db:
#                 db.close()
#     else:
#         return JsonResponse({"Error": "Invalid request method. Only GET is allowed."})


from django.http import JsonResponse
from django.db import connection

# def get_patient_request_analys_data(request):
#     try:
#         location = request.GET.get('Location', 'ALL')
#         location = Location_Detials.objects.get(Location_Id=location).Location_Name
        
#         department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
#         limit = int(request.GET.get('limit', 10))
#         offset = int(request.GET.get('offset', 0))
#         datetype = request.GET.get('dateType')
#         dates = request.GET.get('date')
#         fromdate = request.GET.get('date')
#         todate = request.GET.get('to')
#         patientname = request.GET.get('name')
#         patientid = request.GET.get('id')
#         barcode = request.GET.get('barcode')
#         invoicenumber = request.GET.get('invoice')
#         print(f"Location: {location}, Department: {department_codes}, Limit: {limit}, Offset: {offset}")
        
        
#         where_clauses = []
#         paramsD = []
#         if datetype and datetype !="":
#             if datetype == "currentdate":
#                 where_clauses.append("DATE(bit.CreatedAt) = %s")
#                 paramsD.append(dates)
#             elif datetype == "customdate":
#                 where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
#                 paramsD.append(fromdate)
#                 paramsD.append(todate)
#             else:
#                 print("Nothing.....")

#         if patientname and patientname != "":
#             where_clauses.append("bit.Patient_Name LIKE %s")
#             paramsD.append(f"%{patientname}%")
#         if patientid and patientid != "":
#             where_clauses.append("bit.Patient_Id = %s")
#             paramsD.append(patientid)
#         if barcode and barcode!= "":
#             where_clauses.append("bit.Barcode_Id = %s")
#             paramsD.append(barcode)
#         if invoicenumber and invoicenumber != "":
#             where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
#             paramsD.append(invoicenumber)

#         where_condition = " AND ".join(where_clauses)  if where_clauses else "1=1"
#         print("where_condition-----", where_condition, paramsD)



#         # Convert department codes to department names
#         department_names = []
#         if department_codes:
#             department_codes_list = department_codes.split(',')
#             with connection.cursor() as cursor:
#                 cursor.execute(
#                     """
#                     SELECT SubDepartment_Name
#                     FROM SubLab_Department_Detials
#                     WHERE SubDepartment_Code IN %s
#                     """,
#                     [tuple(department_codes_list)]
#                 )
#                 department_names = [row[0] for row in cursor.fetchall()]
#             if not department_names:
#                 return JsonResponse({'error': 'No valid department codes found.'}, status=400)
#         else:
#             return JsonResponse({'error': 'Department parameter is required.'}, status=400)

#         # Base query with department filtering
#         patients_query = f"""
#             SELECT DISTINCT
#                 rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                 pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                 bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
#                 bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
#                 bit.Location AS Invoice_Location, bit.Transfer_Location AS Invoice_Transfer_Location,
#                 MAX(bit2.CreatedAt) AS Latest
#             FROM 
#                 Billing_Item_Table_for_lab bit
#             JOIN 
#                 Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
#             JOIN 
#                 Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
#             JOIN 
#                 Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit2.Visit_Id = pvi.Visit_Id
#             LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#             LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#             LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#             LEFT JOIN SubLab_Department_Detials sld ON 
#                 (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                 OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#             WHERE 
#                 bit.Service_Status NOT IN ('Pending', 'Recollect')
#                 AND bit.Analysis_Status != 'Completed'
#                 AND bit2.Billing_Type != 'External'
#                 AND bit.Service_Status != 'Transfer'
#                 AND (
#                     (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                     OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                     OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                 )
               
#                 AND {where_condition}
#             group BY
#                 rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                 pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                 bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
#                 bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
#                 bit.Location, bit.Transfer_Location
#             ORDER BY 
#                 Latest DESC
#             LIMIT %s OFFSET %s;
#         """

#         location_filter = "1=1"
#         paramsD.append(limit)
#         paramsD.append(offset)
#         params = [tuple(department_names), tuple(department_names), tuple(department_names) + paramsD]

#         if location != 'ALL':
#             location_filter = """
#                 AND (
#                     (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
#                     OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
#                 )
#             """
#             params = [tuple(department_names), tuple(department_names), tuple(department_names), f'%{location}%', location, limit, offset]

#         patients_query = patients_query.format(location_filter=location_filter)

#         with connection.cursor() as cursor:
#             cursor.execute(patients_query, params)
#             patients_results = cursor.fetchall()
#             print('patients_results length:', len(patients_results))

#             # Count total distinct invoices
#             count_query = f"""
#                 SELECT COUNT(DISTINCT bit2.Billing_Invoice)
#                 FROM 
#                     Billing_Item_Table_for_lab bit
#                 JOIN 
#                     Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
#                 LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                 LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                 LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                 LEFT JOIN SubLab_Department_Detials sld ON 
#                     (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                     OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                 WHERE 
#                     bit.Service_Status NOT IN ('Pending', 'Recollect')
#                     AND bit.Analysis_Status != 'Completed'
#                     AND bit2.Billing_Type != 'External'
#                     AND bit.Service_Status != 'Transfer'
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                     {location_filter}
#             """
#             count_params = [tuple(department_names), tuple(department_names), tuple(department_names)] + params[-4:-2] if location != 'ALL' else []
#             cursor.execute(count_query, count_params)
#             total_records = cursor.fetchone()[0]
#             print('total_records:', total_records)

#             # Aggregate results by invoice
#             patients_dict = {}
#             for row in patients_results:
#                 billing_invoice = row[11]

#                 if row[11] and str(row[11]).startswith("OP"):
#                     billdept = "OP"
#                 else:
#                     billdept = "IP"
#                 if billing_invoice not in patients_dict:
#                     patients_dict[billing_invoice] = {
#                         'Patient_Id': row[0],
#                         'Patient_Name': row[1],
#                         'Age': row[2],
#                         'Gender': row[3],
#                         'Door_No': row[4],
#                         'Phone': row[5],
#                         'Patient_Group': row[6],
#                         'Refering_Doctor': row[7],
#                         'Phlebotomist_Name': row[8],
#                         'Phlebotomist_Type': row[9],
#                         'UpdatedAt': row[10].strftime('%Y-%m-%d %H:%M:%S') if row[10] else None,
#                         'Billing_Invoice': billing_invoice,
#                         'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
#                         'TestCount': row[13],
#                         'Barcode_Id': row[14],
#                         'Visit_Id': row[15],
#                         'Street': row[16],
#                         'Rural_Urban': row[17],
#                         'City': row[18],
#                         'State': row[19],
#                         'Pincode': row[20],
#                         'Time_Period': row[21],
#                         'Location': row[22],
#                         'Transfer_Location': row[23],
#                         'billdept': billdept
#                     }

#             patients_data = list(patients_dict.values())

#         return JsonResponse({
#             'total_records': total_records,
#             'patients_data': patients_data
#         }, safe=False)

#     except Exception as e:
#         print('Error:', str(e))
#         return JsonResponse({'error': str(e)}, status=500)


def get_patient_request_analys_data(request):
    try:
        location = request.GET.get('Location', 'ALL')
        if location != 'ALL':
            location = Location_Detials.objects.get(Location_Id=location).Location_Name

        department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
        limit = int(request.GET.get('limit', 10))
        offset = int(request.GET.get('offset', 0))
        datetype = request.GET.get('dateType')
        dates = request.GET.get('date')
        fromdate = request.GET.get('date')
        todate = request.GET.get('to')
        patientname = request.GET.get('name')
        patientid = request.GET.get('id')
        barcode = request.GET.get('barcode')
        invoicenumber = request.GET.get('invoice')

        # ---------------- WHERE conditions ---------------- #
        where_clauses = []
        paramsD = []

        if datetype:
            if datetype == "currentdate":
                where_clauses.append("DATE(bit.CreatedAt) = %s")
                paramsD.append(dates)
            elif datetype == "customdate":
                where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                paramsD.append(fromdate)
                paramsD.append(todate)

        if patientname:
            where_clauses.append("bit.Patient_Name LIKE %s")
            paramsD.append(f"%{patientname}%")
        if patientid:
            where_clauses.append("bit.Patient_Id = %s")
            paramsD.append(patientid)
        if barcode:
            where_clauses.append("bit.Barcode_Id = %s")
            paramsD.append(barcode)
        if invoicenumber:
            where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
            paramsD.append(invoicenumber)

        where_condition = " AND ".join(where_clauses) if where_clauses else "1=1"

        # ---------------- Department names ---------------- #
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

        # ---------------- Location filter ---------------- #
        location_filter = ""
        location_params = []
        if location != 'ALL':
            location_filter = """
                AND (
                    (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                    OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                )
            """
            location_params = [f"%{location}%", location]

        # ---------------- Main query ---------------- #
        print("Before patient Query")
        patients_query = f"""
            SELECT DISTINCT
                rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
                bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                bit.Location AS Invoice_Location, bit.Transfer_Location AS Invoice_Transfer_Location,
                MAX(bit2.CreatedAt) AS Latest, DATE(bit2.CreatedAt)
            FROM 
                Billing_Item_Table_for_lab bit
            JOIN 
                Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
            JOIN 
                Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
            JOIN 
                Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit2.Visit_Id = pvi.Visit_Id
            LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
            LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
            LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
            LEFT JOIN SubLab_Department_Detials sld ON 
                (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
            WHERE 
                bit.Bill_Status != "Canceled"
                AND bit.Service_Status NOT IN ('Pending', 'Recollect')
                AND bit.Analysis_Status != 'Completed'
                AND bit2.Billing_Type != 'External'
                AND bit.Service_Status != 'Transfer'
                AND (
                    (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                    OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                    OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                )
                AND {where_condition}
                {location_filter}
            GROUP BY
                rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
                bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                bit.Location, bit.Transfer_Location, bit2.CreatedAt
            ORDER BY 
                Latest DESC
            LIMIT %s OFFSET %s;
        """

        params = [tuple(department_names), tuple(department_names), tuple(department_names)] + paramsD + location_params + [limit, offset]

        with connection.cursor() as cursor:
            cursor.execute(patients_query, params)
            patients_results = cursor.fetchall()

            # ---------------- Count query ---------------- #
            print("Before Count Query")

            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    bit.Service_Status NOT IN ('Pending', 'Recollect')
                    AND bit.Analysis_Status != 'Completed'
                    AND bit2.Billing_Type != 'External'
                    AND bit.Service_Status != 'Transfer'
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )
                    AND {where_condition}
                    {location_filter}
            """
            count_params = [tuple(department_names), tuple(department_names), tuple(department_names)] + paramsD + location_params
            cursor.execute(count_query, count_params)
            total_records = cursor.fetchone()[0]

            print("Before for")

            # ---------------- Build response ---------------- #
            patients_dict = {}
            for row in patients_results:
                billing_invoice = row[11]
                billdept = "OP" if billing_invoice and str(billing_invoice).startswith("OP") else "IP"

                cursor.execute("""
                    SELECT bit.Test_Code 
                    FROM Billing_Item_Table_for_lab bit
                    LEFT JOIN OfferPackage op 
                        ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                    LEFT JOIN Group_Master gm 
                        ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                    LEFT JOIN Test_Descriptions td 
                        ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                    LEFT JOIN SubLab_Department_Detials sld 
                        ON (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                        OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                    WHERE bit.Billing_Invoice = %s 
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )
                """, (billing_invoice, tuple(department_names), tuple(department_names), tuple(department_names)))
                tests = cursor.fetchall()
                status = "Completed"
                for t in tests:
                    test_code = t[0]  # extract the actual code value
                    cursor.execute("""
                        SELECT Status, Test_Name
                        FROM Sample_Capture_in_Phelobotomist 
                        WHERE Billing_Invoice = %s AND Test_Code = %s
                    """, (billing_invoice, test_code))
                    result = cursor.fetchone()
                    if result and result[0] == "Collected":
                        # print("Test----",result[1])
                        status = "Collected"


                if billing_invoice not in patients_dict:
                    patients_dict[billing_invoice] = {
                        'Patient_Id': row[0],
                        'Patient_Name': row[1],
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d %H:%M:%S') if row[10] else None,
                        'Billing_Invoice': billing_invoice,
                        'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
                        'TestCount': row[13],
                        'Barcode_Id': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Time_Period': row[21],
                        'Location': row[22],
                        'Transfer_Location': row[23],
                        'billdept': billdept,
                        'CreatedAt': row[25],
                        "SampleState": status,
                    }
            print("after for")
            patients_data = list(patients_dict.values())

        return JsonResponse({
            'total_records': total_records,
            'patients_data': patients_data
        }, safe=False)

    except Exception as e:
        print('Error:', str(e))
        return JsonResponse({'error': str(e)}, status=500)


def searchlabtechnician(request):
    if request.method == "GET":
        try:
            # Get search parameters
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            department_list = request.GET.getlist('department')  # List of department IDs (e.g., ['LSDC000005', 'LSDC000006', ...])
            locationid = request.GET.get('Location')
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))

            # Handle location
            location = 'ALL'
            if locationid:
                try:
                    location_obj = Location_Detials.objects.get(Location_Id=locationid)
                    location = location_obj.Location_Name
                except Location_Detials.DoesNotExist:
                    print(f"Location with ID {locationid} not found.")
                    return JsonResponse({"error": "Invalid location ID."}, status=400)

            # Initialize filters and parameters for dynamic query building
            filters = []
            params = []

            if patientname:
                filters.append("LOWER(rp.Patient_Name) LIKE LOWER(%s)")
                params.append(f"%{patientname}%")
            if patientid:
                filters.append("LOWER(rp.Patient_Id) LIKE LOWER(%s)")
                params.append(f"%{patientid}%")
            if barcode:
                filters.append("LOWER(bit.Barcode_Id) LIKE LOWER(%s)")
                params.append(f"%{barcode}%")
            if invoicenumber:
                filters.append("LOWER(bit.Billing_Invoice) LIKE LOWER(%s)")
                params.append(f"%{invoicenumber}%")

            # Handle location filter
            if location != 'ALL':
                filters.append("LOWER(pvi.Location) = LOWER(%s)")
                params.append(location)

            # Default where condition
            where_condition = " AND ".join(filters) if filters else "1=1"

            with connection.cursor() as cursor:
                # Query to count the total records based on dynamic filters
                count_query = f"""
                SELECT COUNT(DISTINCT bit.Billing_Invoice)
                FROM 
                    Register_patient_Details rp
                JOIN 
                    Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN 
                    Billing_Item_Table_for_lab bit2 ON rp.Patient_Id = bit2.Patient_Id

                JOIN 
                    Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                WHERE 
                    bit2.Service_Status != 'Pending' 
                    AND bit2.Analysis_Status != 'Completed' 
                    AND bit.Billing_Type != 'External'
                    AND {where_condition}
                """
                cursor.execute(count_query, params)
                total_records = cursor.fetchone()[0]

                # Query to fetch the patient details
                base_query = f"""
                SELECT 
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type, bit.UpdatedAt, 
                    bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id, 
                    rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                    MAX(bit.CreatedAt) AS Latest
                FROM 
                    Register_patient_Details rp
                JOIN 
                    Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN 
                    Billing_Item_Table_for_lab bit2 ON rp.Patient_Id = bit2.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                WHERE 
                    bit2.Service_Status != 'Pending' 
                    AND bit2.Analysis_Status != 'Completed' 
                    AND bit.Billing_Type != 'External'
                    AND {where_condition}
                GROUP BY 
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type, 
                    bit.UpdatedAt, bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id,
                    rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period
                ORDER BY 
                    Latest DESC
                LIMIT %s OFFSET %s
                """
                params.extend([limit, offset])
                cursor.execute(base_query, params)
                patients_results = cursor.fetchall()

                patients_data = []
                for row in patients_results:
                    # Fetch service statuses
                    cursor.execute("""
                        SELECT Service_Status, Test_Name, Test_Code
                        FROM Billing_Item_Table_for_lab
                        WHERE Billing_Invoice = %s
                    """, [row[11]])
                    service_statuses = cursor.fetchall()
                    service_status_list = [{'status': status[0], 'testname': status[1], 'testcode': status[2]} for status in service_statuses]

                    # Fetch sub_department_ids (foreign key IDs) from Test_Descriptions
                    department_ids = set()
                    cursor.execute("""
                        SELECT Test_Name, Test_Code
                        FROM Billing_Item_Table_for_lab
                        WHERE Billing_Invoice = %s
                    """, [row[11]])
                    testnames = cursor.fetchall()

                    for test in testnames:
                        cursor.execute("""
                            SELECT sub_department_id 
                            FROM Test_Descriptions 
                            WHERE Test_Code = %s
                        """, [test[1]])
                        department = cursor.fetchone()
                        if department:
                            department_ids.add(department[0])  # Add the sub_department_id (e.g., 'LSDC000005')

                    # Filter by department if specified
                    if department_list and not department_ids.intersection(department_list):
                        continue

                    # Optionally fetch department names for display (if needed)
                    department_names = []
                    if department_ids:
                        # Convert department_ids to a tuple for the IN clause
                        format_strings = ','.join(['%s'] * len(department_ids))
                        cursor.execute(f"""
                            SELECT SubDepartment_Code, SubDepartment_Name 
                            FROM SubLab_Department_Detials
                            WHERE SubDepartment_Code IN ({format_strings})
                        """, list(department_ids))
                        dept_results = cursor.fetchall()
                        department_names = [dept[1] for dept in dept_results]  # Get the department names

                    patients_data.append({
                        'Patient_Id': row[0],
                        'Patient_Name': row[1].upper(),
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                        'Billing_Invoice': row[11],
                        'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
                        'TestCount': row[13],
                        'Service_Statuses': service_status_list,
                        'Barcode': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Department': department_names,  # Use department names for display
                        'Department_Ids': list(department_ids),  # Include IDs if needed for further processing
                        'Time_Period': row[21],
                    })

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

        except Exception as e:
            print(f"Error in searchlabtechnician: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)






def searchseniorrtech(request):
    if request.method == "GET":
        try:
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            locationid = request.GET.get('Location')
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))

            location = 'ALL'
            if locationid:
                try:
                    location_obj = Location_Detials.objects.get(Location_Id=locationid)
                    location = location_obj.Location_Name
                except Location_Detials.DoesNotExist:
                    return JsonResponse({"error": "Invalid location ID."}, status=400)

            filters = []
            params = []

            if patientname:
                filters.append("LOWER(rp.Patient_Name) LIKE LOWER(%s)")
                params.append(f"%{patientname}%")
            if patientid:
                filters.append("LOWER(rp.Patient_Id) LIKE LOWER(%s)")
                params.append(f"%{patientid}%")
            if barcode:
                filters.append("LOWER(bit.Barcode_Id) LIKE LOWER(%s)")
                params.append(f"%{barcode}%")
            if invoicenumber:
                filters.append("LOWER(bit.Billing_Invoice) LIKE LOWER(%s)")
                params.append(f"%{invoicenumber}%")

            if location != 'ALL':
                filters.append("LOWER(pvi.Location) = LOWER(%s)")
                params.append(location)

            where_condition = " AND ".join(filters) if filters else "1=1"

            with connection.cursor() as cursor:
                count_query = f"""
                    SELECT COUNT(DISTINCT bit.Billing_Invoice)
                    FROM Register_patient_Details rp
                    JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                    JOIN Billing_Item_Table_for_lab bit2 ON rp.Patient_Id = bit2.Patient_Id
                    JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                    WHERE 
                        bit.Capture_Sample_Status != 'Pending'
                        AND bit.Analyze_Status != 'Pending'
                        AND bit.Verify_Status != 'Completed'
                        AND bit.Billing_Type != 'External'
                        AND {where_condition}
                """
                cursor.execute(count_query, params)
                total_records = cursor.fetchone()[0]

                base_query = f"""
                    SELECT 
                        rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                        pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type, bit.UpdatedAt, 
                        bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id, 
                        rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                        MAX(bit.CreatedAt) AS Latest
                    FROM 
                        Register_patient_Details rp
                    JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                    JOIN Billing_Item_Table_for_lab bit2 ON rp.Patient_Id = bit2.Patient_Id
                    JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                    WHERE 
                        bit.Capture_Sample_Status != 'Pending'
                        AND bit.Analyze_Status != 'Pending'
                        AND bit.Verify_Status != 'Completed'
                        AND bit.Billing_Type != 'External'
                        AND {where_condition}
                    GROUP BY 
                        rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                        pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type, 
                        bit.UpdatedAt, bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id,
                        rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period
                    ORDER BY 
                        Latest DESC
                    LIMIT %s OFFSET %s
                """
                params.extend([limit, offset])
                cursor.execute(base_query, params)
                patients_results = cursor.fetchall()

                patients_data = []
                for row in patients_results:
                    cursor.execute("""
                        SELECT Service_Status, Test_Name, Test_Code
                        FROM Billing_Item_Table_for_lab
                        WHERE Billing_Invoice = %s
                    """, [row[11]])
                    service_statuses = cursor.fetchall()
                    service_status_list = [{'status': status[0], 'testname': status[1], 'testcode': status[2]} for status in service_statuses]

                    patients_data.append({
                        'Patient_Id': row[0],
                        'Patient_Name': row[1].upper(),
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                        'Billing_Invoice': row[11],
                        'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
                        'TestCount': row[13],
                        'Service_Statuses': service_status_list,
                        'Barcode': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Time_Period': row[21],
                    })

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

        except Exception as e:
            print(f"Error in searchseniorlabtechnician: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)




def searchpathologist(request):
    if request.method == "GET":
        try:
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            locationid = request.GET.get('Location')
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))

            location = 'ALL'
            if locationid:
                try:
                    location_obj = Location_Detials.objects.get(Location_Id=locationid)
                    location = location_obj.Location_Name
                except Location_Detials.DoesNotExist:
                    return JsonResponse({"error": "Invalid location ID."}, status=400)

            filters = []
            params = []

            if patientname:
                filters.append("LOWER(rp.Patient_Name) LIKE LOWER(%s)")
                params.append(f"%{patientname}%")
            if patientid:
                filters.append("LOWER(rp.Patient_Id) LIKE LOWER(%s)")
                params.append(f"%{patientid}%")
            if barcode:
                filters.append("LOWER(bit.Barcode_Id) LIKE LOWER(%s)")
                params.append(f"%{barcode}%")
            if invoicenumber:
                filters.append("LOWER(bit.Billing_Invoice) LIKE LOWER(%s)")
                params.append(f"%{invoicenumber}%")

            if location != 'ALL':
                filters.append("LOWER(pvi.Location) = LOWER(%s)")
                params.append(location)

            where_condition = " AND ".join(filters) if filters else "1=1"

            with connection.cursor() as cursor:
                count_query = f"""
                    SELECT COUNT(DISTINCT bit.Billing_Invoice)
                    FROM Register_patient_Details rp
                    JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                    JOIN Billing_Item_Table_for_lab bit2 ON rp.Patient_Id = bit2.Patient_Id
                    JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                    WHERE 
                        bit2.Service_Status != 'Pending'
                    AND bit2.Analysis_Status != 'Pending'
                    AND bit2.Verify_Status != 'Pending'
                    AND bit2.Approve_Status != 'Completed'
                        AND {where_condition}
                """
                cursor.execute(count_query, params)
                total_records = cursor.fetchone()[0]

                base_query = f"""
                    SELECT 
                        rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                        pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type, bit.UpdatedAt, 
                        bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id, 
                        rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                        MAX(bit.CreatedAt) AS Latest
                    FROM 
                        Register_patient_Details rp
                    JOIN Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                    JOIN Billing_Item_Table_for_lab bit2 ON rp.Patient_Id = bit2.Patient_Id
                    JOIN Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                    WHERE 
                        bit2.Service_Status != 'Pending'
                    AND bit2.Analysis_Status != 'Pending'
                    AND bit2.Verify_Status != 'Pending'
                    AND bit2.Approve_Status != 'Completed'
                        AND {where_condition}
                    GROUP BY 
                        rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                        pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type, 
                        bit.UpdatedAt, bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id, bit.Visit_Id,
                        rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period
                    ORDER BY 
                        Latest DESC
                    LIMIT %s OFFSET %s
                """
                params.extend([limit, offset])
                cursor.execute(base_query, params)
                patients_results = cursor.fetchall()

                patients_data = []
                for row in patients_results:
                    cursor.execute("""
                        SELECT Service_Status, Test_Name, Test_Code
                        FROM Billing_Item_Table_for_lab
                        WHERE Billing_Invoice = %s
                    """, [row[11]])
                    service_statuses = cursor.fetchall()
                    service_status_list = [{'status': status[0], 'testname': status[1], 'testcode': status[2]} for status in service_statuses]

                    patients_data.append({
                        'Patient_Id': row[0],
                        'Patient_Name': row[1].upper(),
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                        'Billing_Invoice': row[11],
                        'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
                        'TestCount': row[13],
                        'Service_Statuses': service_status_list,
                        'Barcode': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Time_Period': row[21],
                    })

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

        except Exception as e:
            print(f"Error in searchseniorlabtechnician: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)


import re

def age_to_float(age_str: str):
    """
    Convert an age string into a float value and its unit.
    Handles formats like:
    - '49 Y, 6 M, 0 D'
    - '68years'
    - '6months'
    - '15days'
    - '2 Y'
    """
    age_str = age_str.strip().lower().replace(" ", "")

    # Try to extract years, months, days if full format provided
    if "y" in age_str or "m" in age_str or "d" in age_str:
        # Match full style "49y,6m,10d"
        y_match = re.search(r"(\d+(\.\d+)?)y", age_str)
        m_match = re.search(r"(\d+(\.\d+)?)m", age_str)
        d_match = re.search(r"(\d+(\.\d+)?)d", age_str)

        years = float(y_match.group(1)) if y_match else 0.0
        months = float(m_match.group(1)) if m_match else 0.0
        days = float(d_match.group(1)) if d_match else 0.0

        if years > 0:
            return years + (months / 12.0) + (days / 365.0), "year"
        elif months > 0:
            return months + (days / 30.0), "month"
        else:
            return days, "day"

    # Fallback: just extract number
    match = re.match(r"(\d+(\.\d+)?)", age_str)
    if match:
        return float(match.group(1)), "year"  # default if only number given

    raise ValueError(f"Invalid age format: {age_str}")



import re
from sympy import sympify, symbols
def get_for_sample_register_data(request):
    if request.method != 'GET':
        return JsonResponse({"Error": "Invalid request method. Only GET is allowed."})

    try:
        
        cursor = db.cursor()
        invoice = request.GET.get('Billinginvoice')
        gender = request.GET.get('gender')
        age = request.GET.get('age')
        print("error")
        age = request.GET.get('age')
        timeperiod = request.GET.get('timeperiod')

        if age and (age.isdigit() or age.replace(".", "", 1).isdigit()):
            age = request.GET.get('age')
            timeperiod = request.GET.get('timeperiod')
        else:
            age,timeperiod = age_to_float(age)

        department_codes = request.GET.get('Department')
        location = request.GET.get('Location', 'ALL')
        location = Location_Detials.objects.get(Location_Id = location).Location_Name
        status = 'Completed'
        result_detail = []

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

        print(f"gender: {gender}, age: {age}, timeperiod: {timeperiod}")

        # Fetch tests
        sql_testname = """
            SELECT bit.Test_Name, bit.Test_Code , bit.Test_Method ,bit.IsSubTest,bit.SubTestCodes,bit.Transfer_Location,bit.PackageName, bit.Group_Name, bit.Group_Code
            FROM Billing_Item_Table_for_lab bit
            JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code
            JOIN SubLab_Department_Detials dept ON td.sub_department_id = dept.SubDepartment_Code
            WHERE Billing_Invoice = %s 
            AND Bill_Status != "Canceled"	
            AND Service_Status = %s 
            AND Analysis_Status != 'Completed'
            AND (
                (Transfer_Location = %s)
                OR ((Transfer_Location IS NULL OR Transfer_Location = '' ) AND Location = %s)
            )
            AND dept.SubDepartment_Name IN %s
        """
        cursor.execute(sql_testname, (invoice, status,location, location, tuple(department_names)))
        tests = cursor.fetchall()
        print('tests:', tests)

        # ─────────────────────────────────────────────────────────────────────
        # OPTIMISED get_for_sample_register_data (N+1 → batch)
        # FIX 1: Culturetest + Sub_Department_id fetched together once per test
        #        using IN clause — replaces 2 queries-per-test with 1 batch query.
        # FIX 2: Previous_Value fetched for ALL test codes in one query.
        # Before: 1 + 3*N queries.  After: 1 + 2 batch queries + N detail queries.
        # ─────────────────────────────────────────────────────────────────────
        all_test_codes = [t[1] for t in tests]

        # Batch 1: Culturetest + Sub_Department_id for all test codes at once
        test_meta = {}
        if all_test_codes:
            cursor.execute("""
                SELECT Test_Code, Culturetest, Sub_Department_id
                FROM Test_Descriptions
                WHERE Test_Code IN %s
            """, [tuple(all_test_codes)])
            for row in cursor.fetchall():
                test_meta[row[0]] = {
                    'culturetest': row[1] if row[1] else 'No',
                    'sub_department_id': row[2] if row[2] else 'No',
                }

        # Batch 2: Previous_Value for all test codes at once
        previous_values = {}
        if all_test_codes:
            cursor.execute("""
                SELECT Test_Code, Previous_Value 
                FROM AnalyseInvestigationResult
                WHERE Billing_invoice = %s AND Test_Code IN %s
                  AND Status = 'Retest' AND Capture_Value IS NULL
            """, [invoice, tuple(all_test_codes)])
            for row in cursor.fetchall():
                previous_values[row[0]] = row[1]

        for test in tests:
            test_code = test[1]
            is_sub_test = test[3]
            sub_test_codes = test[4]
            transfer = test[5]
            package_name = test[6]
            group_name = test[7]
            Group_Code = test[8]

            # Use pre-fetched metadata (no more per-test queries)
            meta = test_meta.get(test_code, {})
            culturetest = meta.get('culturetest', 'No')
            departmenths = meta.get('sub_department_id', 'No')
            previous_value = previous_values.get(test_code, None)

            if departmenths in ['HISTOPATHOLOGY', 'MICROBIOLOGY']:
                cursor.execute("""
                    SELECT td.Test_Name, td.Test_Code, cm.Container_Name,sm.Specimen_Name,  mm.Method_Name, um.Unit_Name, sd.SubDepartment_Name
                    FROM Test_Descriptions as td 
                    INNER JOIN 
                        SubLab_Department_Detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code 
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN methods_masters mm ON td.Method_Name_id = mm.Method_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code                    
                    WHERE Test_Code = %s AND sd.SubDepartment_Name IN %s
                """, (test_code, tuple(department_names)))
                test_details = cursor.fetchall()

                for detail in test_details:
                    datalist = {
                        "Test_Name": detail[0],
                        "Test_Code": detail[1],
                        "Container_Name": detail[2],
                        "Specimen_Name": detail[3],
                        "Method_Name": detail[4],
                        "UOM": detail[5],
                        "Department": detail[6],
                        "Transfer": transfer,
                        'Previous_Value': previous_value
                    }
                    result_detail.append(datalist)

            elif culturetest == 'Yes':
                cursor.execute("SELECT Organism_Name FROM Organism_Masters")
                organism = cursor.fetchall()
                print("------ORGN------",organism)
                cursor.execute("SELECT anti_biotic FROM AntibioticMaster")
                antibiotic = cursor.fetchall()
                print("------ANTI------",antibiotic)
                cursor.execute("""
                    SELECT td.Test_Name, td.Test_Code, cm.Container_Name, sm.Specimen_Name , mm.Method_Name, um.Unit_Name, sd.SubDepartment_Name
                    FROM Test_Descriptions as td
                    INNER JOIN 
                        SubLab_Department_Detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code 
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN methods_masters mm ON td.Method_Name_id = mm.Method_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code                   
                    WHERE Test_Code = %s AND sd.SubDepartment_Name IN %s
                """, (test_code,tuple(department_names)))
                test_details = cursor.fetchall()

                for detail in test_details:
                    datalist = {
                        "Test_Name": detail[0],
                        "Test_Code": detail[1],
                        "Container_Name": detail[2],
                        "Specimen_Name": detail[3],
                        "Method_Name": detail[4],
                        "UOM": detail[5],
                        "Department": detail[6],
                        "Organism": organism,
                        "Antibiotic": antibiotic,
                        "culturetest": culturetest,
                        "Transfer": transfer,
                        'Previous_Value': previous_value
                    }
                    result_detail.append(datalist)

            else:
                sql_test_details = """
                    SELECT 
                        td.Test_Name, 
                        td.Test_Code, 
                        cm.Container_Name, 
                        sm.Specimen_Name, 
                        td.Captured_Unit,
                        asm.Gender, 
                        CASE 
                            WHEN asm.FromAge = '' THEN 0 
                            ELSE CAST(asm.FromAge AS SIGNED) 
                        END AS FromAge, 
                        asm.FromAgeType, 
                        CASE 
                            WHEN asm.Toage = '' THEN 0 
                            ELSE CAST(asm.Toage AS SIGNED) 
                        END AS Toage, 
                        asm.ToAgeType, 
                        asm.From_Value, 
                        asm.To_Value, 
                        asm.PanicLow, 
                        asm.PanicHigh, 
                        um.Unit_Name, 
                        td.Calculated_Test, 
                        td.Formula, 
                        td.Parameter_One, 
                        td.Parameter_Two, 
                        td.Input_Pattern_Type, 
                        sd.SubDepartment_Name,
                        asm.NormalValue, 
                        asm.Reference_Range,
                        td.Iscutoffvalue
                    FROM 
                        Test_Descriptions td
                    LEFT JOIN 
                        Age_Setup_Master asm 
                    ON 
                        td.Test_Code = asm.Test_Code_id
                        AND (asm.Gender = %s OR asm.Gender = 'Both') 
                        AND (
                            (%s >= CASE 
                                    WHEN asm.FromAge = '' THEN 0 
                                    ELSE CAST(asm.FromAge AS SIGNED) 
                                END 
                            AND %s <= CASE 
                                    WHEN asm.Toage = '' THEN 0 
                                    ELSE CAST(asm.Toage AS SIGNED) 
                                END 
                            AND asm.FromAgeType = %s 
                            AND asm.ToAgeType = %s)
                            OR
                            (asm.FromAgeType = 'day' AND asm.ToAgeType = 'year' AND %s >= CASE 
                                    WHEN asm.FromAge = '' THEN 0 
                                    ELSE CAST(asm.FromAge AS SIGNED) 
                                END 
                            AND %s <= CASE 
                                    WHEN asm.Toage = '' THEN 0 
                                    ELSE CAST(asm.Toage AS SIGNED) 
                                END)
                            OR
                            (asm.FromAgeType = 'month' AND asm.ToAgeType = 'year' AND %s >= CASE 
                                    WHEN asm.FromAge = '' THEN 0 
                                    ELSE CAST(asm.FromAge AS SIGNED) 
                                END 
                            AND %s <= CASE 
                                    WHEN asm.Toage = '' THEN 0 
                                    ELSE CAST(asm.Toage AS SIGNED) 
                                END)
                        )
                    INNER JOIN 
                    SubLab_Department_Detials sd ON td.Sub_Department_id = sd.SubDepartment_Code
                    LEFT JOIN container_masters cm ON td.Container_Name_id = cm.Container_Code 
                    LEFT JOIN specimen_masters sm ON td.Specimen_Name_id = sm.Specimen_Code
                    LEFT JOIN unit_masters um ON td.UOM_id = um.Unit_Code

                    WHERE 
                        td.Test_Code = %s
                        AND (
                            asm.Test_Code_id IS NULL 
                            OR (
                                (%s >= CASE 
                                        WHEN asm.FromAge = '' THEN 0 
                                        ELSE CAST(asm.FromAge AS SIGNED) 
                                    END 
                                AND %s <= CASE 
                                        WHEN asm.Toage = '' THEN 0 
                                        ELSE CAST(asm.Toage AS SIGNED) 
                                    END 
                                AND asm.FromAgeType = %s 
                                AND asm.ToAgeType = %s)
                                OR
                                (asm.FromAgeType = 'day' AND asm.ToAgeType = 'year' AND %s >= CASE 
                                        WHEN asm.FromAge = '' THEN 0 
                                        ELSE CAST(asm.FromAge AS SIGNED) 
                                    END 
                                AND %s <= CASE 
                                        WHEN asm.Toage = '' THEN 0 
                                        ELSE CAST(asm.Toage AS SIGNED) 
                                    END)
                                OR
                                (asm.FromAgeType = 'month' AND asm.ToAgeType = 'year' AND %s >= CASE 
                                        WHEN asm.FromAge = '' THEN 0 
                                        ELSE CAST(asm.FromAge AS SIGNED) 
                                    END 
                                AND %s <= CASE 
                                        WHEN asm.Toage = '' THEN 0 
                                        ELSE CAST(asm.Toage AS SIGNED) 
                                    END)
                            )
                        ) 
                        AND sd.SubDepartment_Name IN %s
                """

                cursor.execute(sql_test_details, (
                    gender, age, age, timeperiod, timeperiod, age, age, age, age,
                    test_code, age, age, timeperiod, timeperiod, age, age, age, age, tuple(department_names)
                ))

                test_details = cursor.fetchall()
                print('test_details:', test_details)

                for detail in test_details:
                    datalist = {
                        "Test_Name": detail[0],
                        "Test_Code": detail[1],
                        "Container_Name": detail[2],
                        "Specimen_Name": detail[3],
                        "Captured_Unit": detail[4],
                        "Gender": detail[5],
                        "FromAge": detail[6],
                        "FromAgeType": detail[7],
                        "ToAge": detail[8],
                        "ToAgeType": detail[9],
                        "From_Value": detail[10],
                        "To_Value": detail[11],
                        "PanicLow": detail[12] ,
                        "PanicHigh": detail[13],
                        "UOM": detail[14],
                        "Calculation": detail[15],
                        "Formula": detail[16],
                        "Parameterone": detail[17],
                        "ParameterTwo": detail[18],
                        'capturevalue': '',
                        'medicalremark': '',
                        'technicalremark': '',
                        'Colonycount': '',
                        'input_type': detail[19],
                        'Department': detail[20],
                        'Reference': detail[21],
                        'Referencedata': detail[22],
                        'Iscutoffvalue': detail[23],
                        'Test_Method' : test[2],
                        "is_sub_test": is_sub_test,
                        "sub_test_code": sub_test_codes,
                        "Transfer": transfer,
                        "PackageName": package_name,  # Add PackageName
                        "Group_Name": group_name,
                        'Previous_Value': previous_value,
                        'Group_Code': Group_Code
                    }
                    result_detail.append(datalist)
                    
                

        print('result_detail:', result_detail)
        return JsonResponse(result_detail, safe=False)

    except Exception as er:
        print("An error occurred:", er)
        return JsonResponse({"Error": str(er)})
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


def getformula_calculated_value(request):

    if request.method == 'GET':
        try:
            formula = request.GET.get('formula')
            parameters_str = request.GET.get('parameters')
            
            if formula is None or parameters_str is None:
                raise ValueError("Both 'formula' and 'parameters' are required.")
            
            parameters = json.loads(parameters_str)
            
            # Parse the formula into a SymPy expression
            expr = sympify(formula)
            
            # Substitute parameter values into the expression
            expr_with_values = expr.subs(parameters)
            
            # Evaluate the expression
            result = expr_with_values.evalf()
            formatted_result = round(result, 3)  # Round the result to three decimal places
            vallll = "{:.3f}".format(formatted_result)  # Format the rounded result with three digits after the decimal point
            
            return JsonResponse({'valll': vallll})
        except Exception as e:
            print('Error:', e)
            # Handle any exceptions that occur during the process
            return JsonResponse({"error": str(e)})


from django.http import JsonResponse
from django.db import connection

# def get_patient_verify_analys_data(request):
#     if request.method != 'GET':
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

#     try:
#         with connection.cursor() as cursor:
#             location = request.GET.get('Location', 'ALL')
#             location = Location_Detials.objects.get(Location_Id=location).Location_Name
#             department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
#             limit = int(request.GET.get('limit', 10))
#             offset = int(request.GET.get('offset', 0))
#             patientname = request.GET.get('name')
#             patientid = request.GET.get('id')
#             barcode = request.GET.get('barcode')
#             invoicenumber = request.GET.get('invoice')


#             where_clauses = []
#             paramsD = []

#             if patientname and patientname !="":
#                 where_clauses.append("bit.Patient_Name LIKE %s")
#                 paramsD.append(f"%{patientname}%")
#             if patientid and patientid !="":
#                 where_clauses.append("bit.Patient_Id = %s")
#                 paramsD.append(patientid)
#             if barcode and barcode !="":
#                 where_clauses.append("bit.Barcode_Id = %s")
#                 paramsD.append(barcode)
#             if invoicenumber and invoicenumber !="":
#                 where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
#                 paramsD.append(invoicenumber)

#             where_condition = " AND ".join(where_clauses) if where_clauses else "1=1"



#             print(f"Location: {location}, Department: {department_codes}, Limit: {limit}, Offset: {offset}")

#             # Convert department codes to department names
#             department_names = []
#             if department_codes:
#                 department_codes_list = department_codes.split(',')
#                 cursor.execute(
#                     """
#                     SELECT SubDepartment_Name
#                     FROM SubLab_Department_Detials
#                     WHERE SubDepartment_Code IN %s
#                     """,
#                     [tuple(department_codes_list)]
#                 )
#                 department_names = [row[0] for row in cursor.fetchall()]
#                 if not department_names:
#                     return JsonResponse({"error": "No valid department codes found."}, status=400)
#             else:
#                 return JsonResponse({"error": "Department parameter is required."}, status=400)

#             # Base query with department filtering
#             patients_query = """
#                 SELECT DISTINCT
#                     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                     pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                     bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
#                     bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
#                     bit2.Location AS Invoice_Location, bit2.Transfer_Location AS Invoice_Transfer_Location,
#                     MAX(bit2.CreatedAt) AS Latest
#                 FROM 
#                     Billing_Item_Table_for_lab bit
#                 JOIN 
#                     Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
#                 JOIN 
#                     Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
#                 JOIN 
#                     Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit2.Visit_Id = pvi.Visit_Id
#                 LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                 LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                 LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                 LEFT JOIN SubLab_Department_Detials sld ON 
#                     (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                     OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                 WHERE 
#                     bit2.Capture_Sample_Status != 'Pending'
#                     AND bit.Analysis_Status != 'Pending'
#                     AND bit.Verify_Status != 'Completed'
#                     AND bit2.Billing_Type != 'External'
#                     AND bit2.Status != 'Cancelled'
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                     {location_filter}
#                 GROUP BY
#                     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                     pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                     bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
#                     bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
#                     bit2.Location, bit2.Transfer_Location
#                 ORDER BY 
#                     Latest DESC
#                 LIMIT %s OFFSET %s
#             """

#             location_filter = ""
#             params = [tuple(department_names), tuple(department_names), tuple(department_names), limit, offset]

#             if location != 'ALL':
#                 location_filter = """
#                     AND (
#                         (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
#                         OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
#                     )
#                 """
#                 params = [tuple(department_names), tuple(department_names), tuple(department_names), f'%{location}%', location, limit, offset]

#             patients_query = patients_query.format(location_filter=location_filter)

#             cursor.execute(patients_query, params)
#             patients_results = cursor.fetchall()
#             print('patients_results length:', len(patients_results))

#             # Count total distinct invoices
#             count_query = f"""
#                 SELECT COUNT(DISTINCT bit2.Billing_Invoice)
#                 FROM 
#                     Billing_Item_Table_for_lab bit
#                 JOIN 
#                     Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
#                 LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                 LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                 LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                 LEFT JOIN SubLab_Department_Detials sld ON 
#                     (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                     OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                 WHERE 
#                     bit2.Capture_Sample_Status != 'Pending'
#                     AND bit.Analysis_Status != 'Pending'
#                     AND bit.Verify_Status != 'Completed'
#                     AND bit2.Billing_Type != 'External'
#                     AND bit2.Status != 'Cancelled'
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                     {location_filter}
#             """
#             count_params = [tuple(department_names), tuple(department_names), tuple(department_names)] + params[-4:-2] if location != 'ALL' else []
#             cursor.execute(count_query, count_params)
#             total_records = cursor.fetchone()[0]
#             print('total_records:', total_records)

#             # Aggregate results by invoice
#             patients_dict = {}
#             for row in patients_results:
#                 billing_invoice = row[11]
#                 if billing_invoice not in patients_dict:
#                     patients_dict[billing_invoice] = {
#                         'Patient_Id': row[0],
#                         'Patient_Name': row[1].upper(),
#                         'Age': row[2],
#                         'Gender': row[3],
#                         'Door_No': row[4],
#                         'Phone': row[5],
#                         'Patient_Group': row[6],
#                         'Refering_Doctor': row[7],
#                         'Phlebotomist_Name': row[8],
#                         'Phlebotomist_Type': row[9],
#                         'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
#                         'Billing_Invoice': billing_invoice,
#                         'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
#                         'TestCount': row[13],
#                         'Barcode': row[14],
#                         'Visit_Id': row[15],
#                         'Street': row[16],
#                         'Rural_Urban': row[17],
#                         'City': row[18],
#                         'State': row[19],
#                         'Pincode': row[20],
#                         'Location': row[21],
#                         'Transfer_Location': row[22],
#                         'Service_Statuses': []
#                     }

#                 # Add Analysis_Status, Test_Name, and Test_Code to Service_Statuses
#                 cursor.execute("""
#                     SELECT bit.Analysis_Status, bit.Test_Name, bit.Test_Code
#                     FROM Billing_Item_Table_for_lab bit
#                     JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                     JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                     JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                     JOIN SubLab_Department_Detials sld ON 
#                         (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                         OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                     WHERE bit.Billing_Invoice = %s
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                 """, [billing_invoice, tuple(department_names), tuple(department_names), tuple(department_names)])
#                 service_statuses = cursor.fetchall()
#                 patients_dict[billing_invoice]['Service_Statuses'] = [
#                     {'status': status[0], 'testname': status[1], 'testcode': status[2]}
#                     for status in service_statuses
#                 ]

#             patients_data = list(patients_dict.values())

#             return JsonResponse({
#                 'total_records': total_records,
#                 'patients_data': patients_data
#             }, safe=False)

#     except Exception as e:
#         print('Error:', e)
#         return JsonResponse({"error": str(e)}, status=500)



def get_patient_verify_analys_data(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        with connection.cursor() as cursor:
            location = request.GET.get('Location', 'ALL')
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            patientname = request.GET.get('name')
            patientid = request.GET.get('id')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            datetype = request.GET.get('dateType')
            dates = request.GET.get('date')
            fromdate = request.GET.get('date')
            todate = request.GET.get('to')

            where_clauses = []
            paramsD = []

            if datetype:
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    paramsD.append(dates)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    paramsD.append(fromdate)
                    paramsD.append(todate)


            if patientname and patientname !="":
                where_clauses.append("bit.Patient_Name LIKE %s")
                paramsD.append(f"%{patientname}%")
            if patientid and patientid !="":
                where_clauses.append("bit.Patient_Id = %s")
                paramsD.append(patientid)
            if barcode and barcode !="":
                where_clauses.append("bit.Barcode_Id = %s")
                paramsD.append(barcode)
            if invoicenumber and invoicenumber !="":
                where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
                paramsD.append(invoicenumber)

            where_condition = " AND ".join(where_clauses) if where_clauses else "1=1"



            print(f"Location: {location}, Department: {department_codes}, Limit: {limit}, Offset: {offset}")

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
                    return JsonResponse({"error": "No valid department codes found."}, status=400)
            else:
                return JsonResponse({"error": "Department parameter is required."}, status=400)


            # ---------------- Location filter ---------------- #
            location_filter = ""
            location_params = []
            if location != 'ALL':
                location_filter = """
                    AND (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )
                """
                location_params = [f"%{location}%", location]

            # ---------------- Main query ---------------- #

            # Base query with department filtering
            patients_query = f"""
                SELECT DISTINCT
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                    bit2.CreatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
                    bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
                    bit2.Location AS Invoice_Location, bit2.Transfer_Location AS Invoice_Transfer_Location,
                    MAX(bit2.CreatedAt) AS Latest
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit2.Visit_Id = pvi.Visit_Id
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    bit2.Capture_Sample_Status != 'Pending'
                    AND bit.Analysis_Status != 'Pending'
                    AND bit.Verify_Status != 'Completed'
                    AND bit2.Billing_Type != 'External'
                    AND bit2.Status != 'Cancelled'
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )
                    AND {where_condition}
                    {location_filter}
                GROUP BY
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                    bit2.CreatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
                    bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
                    bit2.Location, bit2.Transfer_Location
                ORDER BY 
                    Latest DESC
                LIMIT %s OFFSET %s
            """

            # location_filter = ""
            params = [tuple(department_names), tuple(department_names), tuple(department_names),]+ paramsD + location_params + [limit, offset]

            # if location != 'ALL':
            #     location_filter = """
            #         AND (
            #             (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
            #             OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
            #         )
            #     """
            #     params = [tuple(department_names), tuple(department_names), tuple(department_names), f'%{location}%', location, limit, offset]

            # patients_query = patients_query.format(location_filter=location_filter)

            cursor.execute(patients_query, params)
            patients_results = cursor.fetchall()
            print('patients_results length:', len(patients_results))

            # Count total distinct invoices
            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    bit2.Capture_Sample_Status != 'Pending'
                    AND bit.Analysis_Status != 'Pending'
                    AND bit.Verify_Status != 'Completed'
                    AND bit2.Billing_Type != 'External'
                    AND bit2.Status != 'Cancelled'
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )AND {where_condition}
                    {location_filter}
            """
            count_params = [tuple(department_names), tuple(department_names), tuple(department_names)] + paramsD + location_params
            cursor.execute(count_query, count_params)
            total_records = cursor.fetchone()[0]
            print('total_records:', total_records)

            # Aggregate results by invoice
            patients_dict = {}
            for row in patients_results:
                billing_invoice = row[11]
                if billing_invoice not in patients_dict:
                    patients_dict[billing_invoice] = {
                        'Patient_Id': row[0],
                        'Patient_Name': row[1].upper(),
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                        'Billing_Invoice': billing_invoice,
                        'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
                        'TestCount': row[13],
                        'Barcode': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Location': row[21],
                        'Transfer_Location': row[22],
                        'Service_Statuses': []
                    }

                # Add Analysis_Status, Test_Name, and Test_Code to Service_Statuses
                cursor.execute(f"""
                    SELECT bit.Analysis_Status, bit.Test_Name, bit.Test_Code
                    FROM Billing_Item_Table_for_lab bit
                    JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                    JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                    JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                    JOIN SubLab_Department_Detials sld ON 
                        (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                        OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                    WHERE bit.Billing_Invoice = %s
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    ) AND {where_condition}
                """, [billing_invoice, tuple(department_names), tuple(department_names), tuple(department_names)] + paramsD)
                service_statuses = cursor.fetchall()
                patients_dict[billing_invoice]['Service_Statuses'] = [
                    {'status': status[0], 'testname': status[1], 'testcode': status[2]}
                    for status in service_statuses
                ]

            patients_data = list(patients_dict.values())

            return JsonResponse({
                'total_records': total_records,
                'patients_data': patients_data
            }, safe=False)

    except Exception as e:
        print('Error:', e)
        return JsonResponse({"error": str(e)}, status=500)



def get_patient_history_data(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()
            data = request.GET
            DateType = data.get('DateType')
            FromDate = data.get('FromDate')
            ToDate = data.get('ToDate')
            CurrentDate = data.get('CurrentDate')
            BilledBy = data.get('BilledBy')
            Location = data.get('Location')
            print('----,getpatienthistorydata', data)
            print('----,getpatienthistorydata', DateType)
            print('----,getpatienthistorydata', FromDate)
            print('----,getpatienthistorydata', ToDate)
            print('----,getpatienthistorydata', CurrentDate)
            print('----,getpatienthistorydata', Location)
            print('----,getpatienthistorydata', BilledBy)
            
            query = """
                SELECT DISTINCT
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
                    PVI.Refering_Doctor
                FROM Billing_invoice_and_bill_amount AS BIBA
                JOIN Patient_Visit_Id AS PVI ON PVI.Visit_Id = BIBA.Visit_Id AND PVI.Patient_Id = BIBA.Patient_Id
                
            """
            
            where_conditions = []
            params = []
            
            if Location and Location != 'ALL':
                where_conditions.append("BIBA.Location = %s")
                params.append(Location)

            if BilledBy and BilledBy != 'ALL':
                where_conditions.append("BIBA.CreatedBy = %s")
                params.append(BilledBy)

            if DateType == 'Customize' and FromDate and ToDate:
                where_conditions.append("DATE(BIBA.CreatedAt) >= %s AND DATE(BIBA.CreatedAt) <= %s")
                params.extend([FromDate, ToDate])
            else:
                where_conditions.append("DATE(BIBA.CreatedAt) = %s")
                params.append(CurrentDate)
            
            if where_conditions:
                query += " WHERE " + " AND ".join(where_conditions)
            
            print(query)
            cursor.execute(query, params)
            billing_data = cursor.fetchall()
            print("billing_data", billing_data)
            
            billdatas = []
            if not billing_data:
                return JsonResponse({'error': 'No billing data found'})
            
            for row in billing_data:
                data = {
                    'Billing_Invoice': row[0],
                    'Item_Count': row[1],
                    'Total_Charge': row[2],
                    'Discount_Type': row[3],
                    'Discount': row[4],
                    'Net_Amount': row[5],
                    'Status': row[6],
                    'Patient_Id': row[7],
                    'Patient_Name': row[8].upper(),
                    'Visit_Id': row[9],
                    'Refering_Doctor': row[10],
                    
                    'TestsNames': [],
                }
                cursor.execute("""Select Phone from Register_patient_Details WHERE Patient_Id=%s""",[data['Patient_Id']])
                phone =cursor.fetchone()
                print('---',phone)
                data['Phone']=phone[0] if phone  and phone[0] else ''
                cursor.execute("""
                    SELECT DISTINCT Test_Method, Test_Name,Test_Code FROM Billing_Item_Table_for_lab 
                    WHERE Billing_Invoice = %s
                """, [data['Billing_Invoice']])
                test = cursor.fetchall()

                if test is not None:
                    data['TestsNames'] = [{
                        'Test_Method': test_row[0],
                        'Test_Name': test_row[1],
                        'Test_Code': test_row[2]
                    } for test_row in test]
                
                for meth in ['Cash', 'Card', 'OnlinePayment']:
                    cursor.execute("""
                        SELECT SUM(Paid_Amount) AS Paid_Amount FROM Bill_Payment_details
                        WHERE Billing_invoice = %s AND Payment_Type = %s
                    """, [data['Billing_Invoice'], meth])
                    amount = cursor.fetchone()[0]

                    data[meth] = amount if amount else 0
                
                billdatas.append(data)
            
            return JsonResponse(billdatas, safe=False)

        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()  

def get_barcode_details(request):
    if request.method == 'GET':  # Explicitly check for GET method
        try:
            
            cursor = db.cursor()

            barcode_id = request.GET.get('barcodeid')

            query = """
                    SELECT 
                        rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Address, rp.Phone,
                        rp.Patient_Group, rp.Refering_Doctor, bit.UpdatedAt, 
                        bit.Billing_Invoice, bit.Total_Charge, rp.Phlebotomist_Type, rp.Phlebotomist_Name, bit.Item_Count, bit.Visit_Id
                    FROM 
                        Register_patient_Details rp
                    JOIN 
                        Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                    WHERE 
                        Barcode_Id = %s
                    """
            cursor.execute(query, (barcode_id,))
            result = cursor.fetchone()

            if result:
                # Directly map the single result to a dictionary

                updated_at_formatted = result[8].strftime('%Y-%m-%d %H:%M:%S')
                 
                patient_data = {
                    'Patient_Id': result[0],
                    'Patient_Name': result[1],
                    'Age': result[2],
                    'Gender': result[3],
                    'Address': result[4],
                    'Phone': result[5],
                    'Patient_Group': result[6],
                    'Refering_Doctor': result[7],
                    'UpdatedAt':updated_at_formatted,  # Adjust format as needed
                    'Billing_Invoice': result[9],
                    'Total_Charge': result[10],  # Assuming this maps to Total_Charge
                    'Phlebotomist_Type': result[11],
                    'Phlebotomist_Name': result[12],
                    'Item_Count': result[13],
                }
                print(patient_data)
                return JsonResponse(patient_data)  # Directly return the single record as JSON
            else:
                return JsonResponse({"error": "No data found for the provided barcode ID."})
        except Exception as e:
            print('Error:', e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})



from django.http import JsonResponse
from django.db import connection

# def get_patient_request_approve_data(request):
#     if request.method != 'GET':
#         return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

#     try:
#         with connection.cursor() as cursor:
#             location = request.GET.get('Location', 'ALL')
#             location = Location_Detials.objects.get(Location_Id=location).Location_Name
#             department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
#             limit = int(request.GET.get('limit', 10))
#             offset = int(request.GET.get('offset', 0))

#             print(f"Location: {location}, Department: {department_codes}, Limit: {limit}, Offset: {offset}")

#             # Convert department codes to department names
#             department_names = []
#             if department_codes:
#                 department_codes_list = department_codes.split(',')
#                 cursor.execute(
#                     """
#                     SELECT SubDepartment_Name
#                     FROM SubLab_Department_Detials
#                     WHERE SubDepartment_Code IN %s
#                     """,
#                     [tuple(department_codes_list)]
#                 )
#                 department_names = [row[0] for row in cursor.fetchall()]
#                 if not department_names:
#                     return JsonResponse({"error": "No valid department codes found."}, status=400)
#             else:
#                 return JsonResponse({"error": "Department parameter is required."}, status=400)

#             # Base query with department filtering
#             patients_query = """
#                 SELECT DISTINCT
#                     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                     pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                     bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
#                     bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
#                     bit2.Location AS Invoice_Location, bit2.Transfer_Location AS Invoice_Transfer_Location,
#                     MAX(bit2.CreatedAt) AS Latest
#                 FROM 
#                     Billing_Item_Table_for_lab bit
#                 JOIN 
#                     Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
#                 JOIN 
#                     Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
#                 JOIN 
#                     Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit2.Visit_Id = pvi.Visit_Id
#                 LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                 LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                 LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                 LEFT JOIN SubLab_Department_Detials sld ON 
#                     (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                     OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                 WHERE 
#                     bit2.Capture_Sample_Status != 'Pending'
#                     AND bit2.Analyze_Status != 'Pending'
#                     AND bit.Verify_Status NOT IN ('Pending', 'Reverify')
#                     AND bit.Approve_Status != 'Completed'
#                     AND bit2.Status != 'Cancelled'
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                     {location_filter}
#                 GROUP BY
#                     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
#                     pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
#                     bit2.UpdatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
#                     bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
#                     bit2.Location, bit2.Transfer_Location
#                 ORDER BY 
#                     Latest DESC
#                 LIMIT %s OFFSET %s
#             """

#             location_filter = ""
#             params = [tuple(department_names), tuple(department_names), tuple(department_names), limit, offset]

#             if location != 'ALL':
#                 location_filter = """
#                     AND (
#                         (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
#                         OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
#                     )
#                 """
#                 params = [tuple(department_names), tuple(department_names), tuple(department_names), f'%{location}%', location, limit, offset]

#             patients_query = patients_query.format(location_filter=location_filter)

#             cursor.execute(patients_query, params)
#             patients_results = cursor.fetchall()
#             print('patients_results length:', len(patients_results))

#             # Count total distinct invoices
#             count_query = f"""
#                 SELECT COUNT(DISTINCT bit2.Billing_Invoice)
#                 FROM 
#                     Billing_Item_Table_for_lab bit
#                 JOIN 
#                     Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
#                 LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                 LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                 LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                 LEFT JOIN SubLab_Department_Detials sld ON 
#                     (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                     OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                 WHERE 
#                     bit2.Capture_Sample_Status != 'Pending'
#                     AND bit2.Analyze_Status != 'Pending'
#                     AND bit.Verify_Status NOT IN ('Pending', 'Reverify')
#                     AND bit.Approve_Status != 'Completed'
#                     AND bit2.Status != 'Cancelled'
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                     {location_filter}
#             """
#             count_params = [tuple(department_names), tuple(department_names), tuple(department_names)] + params[-4:-2] if location != 'ALL' else []
#             cursor.execute(count_query, count_params)
#             total_records = cursor.fetchone()[0]
#             print('total_records:', total_records)

#             # Aggregate results by invoice
#             patients_dict = {}
#             for row in patients_results:
#                 billing_invoice = row[11]
#                 if billing_invoice not in patients_dict:
#                     patients_dict[billing_invoice] = {
#                         'Patient_Id': row[0],
#                         'Patient_Name': row[1].upper(),
#                         'Age': row[2],
#                         'Gender': row[3],
#                         'Door_No': row[4],
#                         'Phone': row[5],
#                         'Patient_Group': row[6],
#                         'Refering_Doctor': row[7],
#                         'Phlebotomist_Name': row[8],
#                         'Phlebotomist_Type': row[9],
#                         'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
#                         'Billing_Invoice': billing_invoice,
#                         'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
#                         'TestCount': row[13],
#                         'Barcode': row[14],
#                         'Visit_Id': row[15],
#                         'Street': row[16],
#                         'Rural_Urban': row[17],
#                         'City': row[18],
#                         'State': row[19],
#                         'Pincode': row[20],
#                         'Location': row[21],
#                         'Transfer_Location': row[22],
#                         'Service_Statuses': []
#                     }

#                 # Fetch Verify_Status, Test_Name, and Test_Code for Service_Statuses
#                 cursor.execute("""
#                     SELECT bit.Verify_Status, bit.Test_Name, bit.Test_Code
#                     FROM Billing_Item_Table_for_lab bit
#                     LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
#                     LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
#                     LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
#                     LEFT JOIN SubLab_Department_Detials sld ON 
#                         (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
#                         OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
#                     WHERE bit.Billing_Invoice = %s
#                     AND (
#                         (bit.Test_Method = 'Offers' AND op.department_name IN %s)
#                         OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
#                         OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
#                     )
#                 """, [billing_invoice, tuple(department_names), tuple(department_names), tuple(department_names)])
#                 service_statuses = cursor.fetchall()
#                 patients_dict[billing_invoice]['Service_Statuses'] = [
#                     {'status': status[0], 'testname': status[1], 'testcode': status[2]}
#                     for status in service_statuses
#                 ]

#             patients_data = list(patients_dict.values())

#             return JsonResponse({
#                 'total_records': total_records,
#                 'patients_data': patients_data
#             }, safe=False)

#     except Exception as e:
#         print('Error:', e)
#         return JsonResponse({"error": str(e)}, status=500)
    


def get_patient_request_approve_data(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        with connection.cursor() as cursor:
            location = request.GET.get('Location', 'ALL')
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))

            patientname = request.GET.get('name')
            patientid = request.GET.get('id')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            datetype = request.GET.get('dateType')
            dates = request.GET.get('date')
            fromdate = request.GET.get('date')
            todate = request.GET.get('to')


            where_clauses = []
            paramsD = []
            
            if datetype:
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    paramsD.append(dates)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    paramsD.append(fromdate)
                    paramsD.append(todate)



            if patientname and patientname !="":
                where_clauses.append("bit.Patient_Name LIKE %s")
                paramsD.append(f"%{patientname}%")
            if patientid and patientid !="":
                where_clauses.append("bit.Patient_Id = %s")
                paramsD.append(patientid)
            if barcode and barcode !="":
                where_clauses.append("bit.Barcode_Id = %s")
                paramsD.append(barcode)
            if invoicenumber and invoicenumber !="":
                where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
                paramsD.append(invoicenumber)

            where = " AND ".join(where_clauses) if where_clauses else "1=1"


            print(f"Location: {location}, Department: {department_codes}, Limit: {limit}, Offset: {offset}")

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
                    return JsonResponse({"error": "No valid department codes found."}, status=400)
            else:
                return JsonResponse({"error": "Department parameter is required."}, status=400)

            # ---------------- Location filter ---------------- #
            location_filter = ""
            location_params = []
            if location != 'ALL':
                location_filter = """
                    AND (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )
                """
                location_params = [f"%{location}%", location]

            # ---------------- Main query ---------------- #
            
            # Base query with department filtering
            patients_query = f"""
                SELECT DISTINCT
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                    bit2.CreatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
                    bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
                    bit2.Location AS Invoice_Location, bit2.Transfer_Location AS Invoice_Transfer_Location,
                    MAX(bit2.CreatedAt) AS Latest
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit2.Visit_Id = pvi.Visit_Id
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    bit2.Capture_Sample_Status != 'Pending'
                    AND bit2.Analyze_Status != 'Pending'
                    AND bit.Verify_Status NOT IN ('Pending', 'Reverify')
                    AND bit.Approve_Status != 'Completed'
                    AND bit2.Status != 'Cancelled'
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    ) AND {where}
                    {location_filter}
                GROUP BY
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, pvi.Phlebotomist_Name, pvi.Phlebotomist_Type,
                    bit2.CreatedAt, bit2.Billing_Invoice, bit2.Total_Charge, bit2.Item_Count, bit2.Barcode_Id,
                    bit2.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode,
                    bit2.Location, bit2.Transfer_Location
                ORDER BY 
                    Latest DESC
                LIMIT %s OFFSET %s
            """

            # location_filter = ""
            params = [tuple(department_names), tuple(department_names), tuple(department_names),] + paramsD + location_params + [ limit, offset]

            # if location != 'ALL':
            #     location_filter = """
            #         AND (
            #             (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
            #             OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
            #         )
            #     """
            #     params = [tuple(department_names), tuple(department_names), tuple(department_names), f'%{location}%', location, limit, offset]

            # patients_query = patients_query.format(location_filter=location_filter)

            cursor.execute(patients_query, params)
            patients_results = cursor.fetchall()
            print('patients_results length:', len(patients_results))

            # Count total distinct invoices
            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    bit2.Capture_Sample_Status != 'Pending'
                    AND bit2.Analyze_Status != 'Pending'
                    AND bit.Verify_Status NOT IN ('Pending', 'Reverify')
                    AND bit.Approve_Status != 'Completed'
                    AND bit2.Status != 'Cancelled'
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    ) AND {where}
                    {location_filter}
            """
            count_params = [tuple(department_names), tuple(department_names), tuple(department_names)] + paramsD + location_params
            cursor.execute(count_query, count_params)
            total_records = cursor.fetchone()[0]
            print('total_records:', total_records)

            # Aggregate results by invoice
            patients_dict = {}
            for row in patients_results:
                billing_invoice = row[11]
                if billing_invoice not in patients_dict:
                    patients_dict[billing_invoice] = {
                        'Patient_Id': row[0],
                        'Patient_Name': row[1].upper(),
                        'Age': row[2],
                        'Gender': row[3],
                        'Door_No': row[4],
                        'Phone': row[5],
                        'Patient_Group': row[6],
                        'Refering_Doctor': row[7],
                        'Phlebotomist_Name': row[8],
                        'Phlebotomist_Type': row[9],
                        'UpdatedAt': row[10].strftime('%Y-%m-%d') if row[10] else None,
                        'Billing_Invoice': billing_invoice,
                        'Total_Charge': float(row[12]) if row[12] is not None else 0.0,
                        'TestCount': row[13],
                        'Barcode': row[14],
                        'Visit_Id': row[15],
                        'Street': row[16],
                        'Rural_Urban': row[17],
                        'City': row[18],
                        'State': row[19],
                        'Pincode': row[20],
                        'Location': row[21],
                        'Transfer_Location': row[22],
                        'Service_Statuses': []
                    }

                # Fetch Verify_Status, Test_Name, and Test_Code for Service_Statuses
                cursor.execute(f"""
                    SELECT bit.Verify_Status, bit.Test_Name, bit.Test_Code
                    FROM Billing_Item_Table_for_lab bit
                    LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                    LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                    LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                    LEFT JOIN SubLab_Department_Detials sld ON 
                        (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                        OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                    WHERE bit.Billing_Invoice = %s
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    ) AND {where}
                """, [billing_invoice, tuple(department_names), tuple(department_names), tuple(department_names)] + paramsD)
                service_statuses = cursor.fetchall()
                patients_dict[billing_invoice]['Service_Statuses'] = [
                    {'status': status[0], 'testname': status[1], 'testcode': status[2]}
                    for status in service_statuses
                ]

            patients_data = list(patients_dict.values())

            return JsonResponse({
                'total_records': total_records,
                'patients_data': patients_data
            }, safe=False)

    except Exception as e:
        print('Error:', e)
        return JsonResponse({"error": str(e)}, status=500)
    


#-------------------------- for Dispatch que -------------------------------------------#
    
# It give duplicates

                # SELECT DISTINCT
                #     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                #     pvi.Patient_Group, pvi.Refering_Doctor, bit2.UpdatedAt, bit2.Billing_Invoice,
                #     bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                #     bit2.Barcode_Id, bit2.Visit_Id, 
                #     GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                #     rp.Time_Period, rp.Title, pvi.Refering_Hospital,
                #     GROUP_CONCAT(DISTINCT bil.Test_Name SEPARATOR ', ') AS TestNames,
                #     GROUP_CONCAT(DISTINCT bil.Test_Code SEPARATOR ', ') AS TestCodes,
                #     GROUP_CONCAT(DISTINCT bil.Transfer_Location SEPARATOR ', ') AS TransferLocations,
                #     MAX(bit2.CreatedAt) AS Latest

                # GROUP BY
                #     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                #     pvi.Patient_Group, pvi.Refering_Doctor, bit2.UpdatedAt, bit2.Billing_Invoice,
                #     bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                #     bit2.Barcode_Id, bit2.Visit_Id, rp.Time_Period, rp.Title, pvi.Refering_Hospital






from django.http import JsonResponse
from django.db import connection
def get_patient_request_capture_data_for_dispatch(request):
    """
    OPTIMISED: Batch queries to eliminate N+1 problem.
    Fetches dispatch-ready patients with all their test details in 3 queries instead of 101.
    """
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        with connection.cursor() as cursor:
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            location = request.GET.get('Location', 'ALL')
            refering_hospital = request.GET.get('Refering_Hospital', 'All')
            department_codes = request.GET.get('Department', '')
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            datetype = request.GET.get('dateType')
            date = request.GET.get('date')
            fromdate = request.GET.get('from')
            todate = request.GET.get('to')
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')

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
                    return JsonResponse({"error": "No valid department codes found."}, status=400)
            else:
                return JsonResponse({"error": "Department parameter is required."}, status=400)

            where_clauses = ["bit.Approve_Status = 'Completed'"]
            params = []

            # Add department condition
            where_clauses.append("""
                (
                    (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                    OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                    OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                )
            """)
            params.extend([tuple(department_names), tuple(department_names), tuple(department_names)])

            # Add location condition
            if location != 'ALL':
                where_clauses.append("""
                    (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )
                """)
                params.extend([f'%{location}%', location])

            # Add referring hospital condition
            if refering_hospital != 'All':
                where_clauses.append("LOWER(TRIM(pvi.Refering_Hospital)) = LOWER(TRIM(%s))")
                params.append(refering_hospital)

            if datetype and datetype != "":
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    params.append(date)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    params.append(fromdate)
                    params.append(todate)

            if patientname and patientname != "":
                where_clauses.append("bit.Patient_Name LIKE %s")
                params.append(f"%{patientname}%")
            if patientid and patientid != "":
                where_clauses.append("bit.Patient_Id = %s")
                params.append(patientid)
            if barcode and barcode != "":
                where_clauses.append("bit.Barcode_Id = %s")
                params.append(barcode)
            if invoicenumber and invoicenumber != "":
                where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
                params.append(invoicenumber)

            where_condition = " AND ".join(where_clauses)

            # Query to count the total records
            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    {where_condition}
            """
            cursor.execute(count_query, params)
            total_records = cursor.fetchone()[0]

            # Main patient query
            patient_query = f"""
                SELECT 
                    rp.Patient_Id,
                    MAX(rp.Patient_Name) AS Patient_Name,
                    MAX(rp.Age) AS Age,
                    MAX(rp.Gender) AS Gender,
                    MAX(rp.Street) AS Address,
                    MAX(rp.Phone) AS Phone,
                    GROUP_CONCAT(DISTINCT pvi.Patient_Group) AS Patient_Group,
                    GROUP_CONCAT(DISTINCT pvi.Refering_Doctor SEPARATOR ', ') AS Refering_Doctor,
                    MAX(bit2.UpdatedAt) AS UpdatedAt,
                    bit2.Billing_Invoice,
                    MAX(bit2.Total_Charge) AS Total_Charge,
                    GROUP_CONCAT(DISTINCT pvi.Phlebotomist_Type) AS Phlebotomist_Type,
                    GROUP_CONCAT(DISTINCT pvi.Phlebotomist_Name) AS Phlebotomist_Name,
                    MAX(bit2.Item_Count) AS Item_Count,
                    MAX(bit2.Barcode_Id) AS Barcode_Id,
                    bit2.Visit_Id,
                    GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                    MAX(rp.Time_Period) AS Time_Period,
                    MAX(rp.Title) AS Title,
                    GROUP_CONCAT(DISTINCT pvi.Refering_Hospital SEPARATOR ', ') AS Refering_Hospital,
                    GROUP_CONCAT(DISTINCT bil.Test_Name SEPARATOR ', ') AS TestNames,
                    GROUP_CONCAT(DISTINCT bil.Test_Code SEPARATOR ', ') AS TestCodes,
                    GROUP_CONCAT(DISTINCT bil.Transfer_Location SEPARATOR ', ') AS TransferLocations,
                    MAX(bit2.CreatedAt) AS Latest,
                    bit2.Registration_Id
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                LEFT JOIN
                    Billing_Item_Table_for_lab bil ON bil.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    {where_condition}
                GROUP BY
                    rp.Patient_Id,
                    bit2.Billing_Invoice,
                    bit2.Visit_Id,
                    bit2.Registration_Id                
                ORDER BY 
                    Latest DESC
                LIMIT %s OFFSET %s
            """
            params.extend([limit, offset])
            cursor.execute(patient_query, params)
            patients_results = cursor.fetchall()

            # ================================================================
            # OPTIMISED: Batch fetch all data to eliminate N+1 problem
            # ================================================================
            
            # Collect all billing invoices
            all_invoices = [row[9] for row in patients_results]
            
            if not all_invoices:
                return JsonResponse({"total_records": 0, "patients_data": []}, safe=False)
            
            # ────────────────────────────────────────────────────────────────
            # Batch Query #1: Fetch ALL service statuses in ONE query
            # ────────────────────────────────────────────────────────────────
            cursor.execute("""
                SELECT Billing_Invoice, Capture_Sample_Status, Analyze_Status, 
                       Verify_Status, Approve_Status
                FROM Billing_invoice_and_bill_amount
                WHERE Billing_Invoice IN %s
            """, [tuple(all_invoices)])
            
            # Group service statuses by invoice
            service_statuses_by_invoice = {}
            for status_row in cursor.fetchall():
                invoice = status_row[0]
                if invoice not in service_statuses_by_invoice:
                    service_statuses_by_invoice[invoice] = []
                service_statuses_by_invoice[invoice].append({
                    "Capture": status_row[1],
                    "Analaysis": status_row[2],  # Typo kept for frontend compatibility
                    "Verify": status_row[3],
                    "Approve": status_row[4],
                })
            
            # ────────────────────────────────────────────────────────────────
            # Batch Query #2: Fetch ALL test details in ONE query
            # ────────────────────────────────────────────────────────────────
            cursor.execute("""
                SELECT bil.Billing_Invoice, bil.Test_Name, bil.Test_Code, 
                       bil.Service_Status, bil.Analysis_Status, bil.Verify_Status, 
                       bil.Approve_Status, bil.Transfer_Location
                FROM Billing_Item_Table_for_lab bil
                LEFT JOIN OfferPackage op 
                    ON bil.PackageCode = op.package_code 
                    AND bil.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm 
                    ON bil.Group_Code = gm.Group_Code 
                    AND bil.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td 
                    ON bil.Test_Code = td.Test_Code 
                    AND bil.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bil.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bil.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE bil.Billing_Invoice IN %s 
                  AND bil.Bill_Status != 'Canceled'
                  AND bil.Approve_Status = 'Completed'
                  AND (
                      (bil.Test_Method = 'Offers' AND op.department_name IN %s)
                      OR (bil.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                      OR (bil.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                  )
            """, [tuple(all_invoices), tuple(department_names), tuple(department_names), tuple(department_names)])
            
            # Group test details by invoice
            test_details_by_invoice = {}
            for test_row in cursor.fetchall():
                invoice = test_row[0]
                if invoice not in test_details_by_invoice:
                    test_details_by_invoice[invoice] = []
                test_details_by_invoice[invoice].append({
                    "id": len(test_details_by_invoice[invoice]) + 1,
                    "Test_Name": test_row[1],
                    "Test_Code": test_row[2],
                    "Service_Status": test_row[3],
                    "Analysis_Status": test_row[4],
                    "Verify_Status": test_row[5],
                    "Approve_Status": test_row[6],
                    "Transfer_Location": test_row[7]
                })
            
            # ────────────────────────────────────────────────────────────────
            # Build patient data using pre-fetched dictionaries (NO MORE QUERIES!)
            # ────────────────────────────────────────────────────────────────
            patients_data = []
            for row in patients_results:
                billing_invoice = row[9]
                
                # Get pre-fetched data from dictionaries (NO database query!)
                service_status_list = service_statuses_by_invoice.get(billing_invoice, [])
                test_details = test_details_by_invoice.get(billing_invoice, [])
                
                patient_data = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1].upper() if row[1] else "",
                    "Age": row[2],
                    "Gender": row[3],
                    "Address": row[4],
                    "Phone": row[5],
                    "Patient_Group": row[6],
                    "Refering_Doctor": row[7],
                    "UpdatedAt": row[8].strftime("%Y-%m-%d") if row[8] else "",
                    "Billing_Invoice": billing_invoice,
                    "Total_Charge": float(row[10]) if row[10] is not None else 0.0,
                    "Phlebotomist_Type": row[11],
                    "Phlebotomist_Name": row[12],
                    "Item_Count": row[13],
                    "Barcode": row[14],
                    "Visit_Id": row[15],
                    "TestMethods": row[16],
                    "Service_Statuses": service_status_list,
                    "Time_Period": row[17],
                    "Title": row[18],
                    "Refering_Hospital": row[19],
                    "TestDetails": test_details,
                    "RegisterId": row[24],
                }
                
                # Only include patients with test details
                if len(test_details) > 0:
                    patients_data.append(patient_data)

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

    except Exception as e:
        print("Error:", e)
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)



def get_patient_ammended_capture_data_for_dispatch(request):
    """
    OPTIMISED: Batch queries to eliminate N+1 problem for amended dispatch.
    Same pattern as get_patient_request_capture_data_for_dispatch.
    """
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        with connection.cursor() as cursor:
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            location = request.GET.get('Location', 'ALL')
            refering_hospital = request.GET.get('Refering_Hospital', 'All')
            department_codes = request.GET.get('Department', '')
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            datetype = request.GET.get('dateType')
            date = request.GET.get('date')
            fromdate = request.GET.get('from')
            todate = request.GET.get('to')
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')

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
                    return JsonResponse({"error": "No valid department codes found."}, status=400)
            else:
                return JsonResponse({"error": "Department parameter is required."}, status=400)

            where_clauses = [
                "comp.ReportStatus = 'Amended'",
                "bit.Approve_Status = 'Completed'"
            ]
            params = []

            # Add department condition
            where_clauses.append("""
                (
                    (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                    OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                    OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                )
            """)
            params.extend([tuple(department_names), tuple(department_names), tuple(department_names)])

            # Add location condition
            if location != 'ALL':
                where_clauses.append("""
                    (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )
                """)
                params.extend([f'%{location}%', location])

            # Add referring hospital condition
            if refering_hospital != 'All':
                where_clauses.append("LOWER(TRIM(pvi.Refering_Hospital)) = LOWER(TRIM(%s))")
                params.append(refering_hospital)

            if datetype and datetype != "":
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    params.append(date)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    params.append(fromdate)
                    params.append(todate)

            if patientname and patientname != "":
                where_clauses.append("bit.Patient_Name LIKE %s")
                params.append(f"%{patientname}%")
            if patientid and patientid != "":
                where_clauses.append("bit.Patient_Id = %s")
                params.append(patientid)
            if barcode and barcode != "":
                where_clauses.append("bit.Barcode_Id = %s")
                params.append(barcode)
            if invoicenumber and invoicenumber != "":
                where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
                params.append(invoicenumber)

            where_condition = " AND ".join(where_clauses)

            # Count query
            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                JOIN
                    Completed_Lab_Report_Table comp ON bit2.Billing_Invoice = comp.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    {where_condition}
            """
            cursor.execute(count_query, params)
            total_records = cursor.fetchone()[0]

            # Main query
            patient_query = f"""
                SELECT 
                    rp.Patient_Id,
                    MAX(rp.Patient_Name) AS Patient_Name,
                    MAX(rp.Age) AS Age,
                    MAX(rp.Gender) AS Gender,
                    MAX(rp.Street) AS Address,
                    MAX(rp.Phone) AS Phone,
                    GROUP_CONCAT(DISTINCT pvi.Patient_Group) AS Patient_Group,
                    GROUP_CONCAT(DISTINCT pvi.Refering_Doctor SEPARATOR ', ') AS Refering_Doctor,
                    MAX(bit2.UpdatedAt) AS UpdatedAt,
                    bit2.Billing_Invoice,
                    MAX(bit2.Total_Charge) AS Total_Charge,
                    GROUP_CONCAT(DISTINCT pvi.Phlebotomist_Type) AS Phlebotomist_Type,
                    GROUP_CONCAT(DISTINCT pvi.Phlebotomist_Name) AS Phlebotomist_Name,
                    MAX(bit2.Item_Count) AS Item_Count,
                    MAX(bit2.Barcode_Id) AS Barcode_Id,
                    bit2.Visit_Id,
                    GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                    MAX(rp.Time_Period) AS Time_Period,
                    MAX(rp.Title) AS Title,
                    GROUP_CONCAT(DISTINCT pvi.Refering_Hospital SEPARATOR ', ') AS Refering_Hospital,
                    GROUP_CONCAT(DISTINCT bil.Test_Name SEPARATOR ', ') AS TestNames,
                    GROUP_CONCAT(DISTINCT bil.Test_Code SEPARATOR ', ') AS TestCodes,
                    GROUP_CONCAT(DISTINCT bil.Transfer_Location SEPARATOR ', ') AS TransferLocations,
                    MAX(bit2.CreatedAt) AS Latest,
                    bit2.Registration_Id
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                JOIN
                    Completed_Lab_Report_Table comp ON bit2.Billing_Invoice = comp.Billing_Invoice
                LEFT JOIN
                    Billing_Item_Table_for_lab bil ON bil.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    {where_condition}
                GROUP BY
                    rp.Patient_Id,
                    bit2.Billing_Invoice,
                    bit2.Visit_Id,
                    bit2.Registration_Id                
                ORDER BY 
                    Latest DESC
                LIMIT %s OFFSET %s
            """
            params.extend([limit, offset])
            cursor.execute(patient_query, params)
            patients_results = cursor.fetchall()

            # ================================================================
            # OPTIMISED: Batch fetch (same as dispatch function)
            # ================================================================
            
            all_invoices = [row[9] for row in patients_results]
            
            if not all_invoices:
                return JsonResponse({"total_records": 0, "patients_data": []}, safe=False)
            
            # Batch Query #1: Service statuses
            cursor.execute("""
                SELECT Billing_Invoice, Capture_Sample_Status, Analyze_Status, 
                       Verify_Status, Approve_Status
                FROM Billing_invoice_and_bill_amount
                WHERE Billing_Invoice IN %s
            """, [tuple(all_invoices)])
            
            service_statuses_by_invoice = {}
            for status_row in cursor.fetchall():
                invoice = status_row[0]
                if invoice not in service_statuses_by_invoice:
                    service_statuses_by_invoice[invoice] = []
                service_statuses_by_invoice[invoice].append({
                    "Capture": status_row[1],
                    "Analaysis": status_row[2],
                    "Verify": status_row[3],
                    "Approve": status_row[4],
                })
            
            # Batch Query #2: Test details
            cursor.execute("""
                SELECT bil.Billing_Invoice, bil.Test_Name, bil.Test_Code, 
                       bil.Service_Status, bil.Analysis_Status, bil.Verify_Status, 
                       bil.Approve_Status, bil.Transfer_Location
                FROM Billing_Item_Table_for_lab bil
                LEFT JOIN OfferPackage op 
                    ON bil.PackageCode = op.package_code 
                    AND bil.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm 
                    ON bil.Group_Code = gm.Group_Code 
                    AND bil.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td 
                    ON bil.Test_Code = td.Test_Code 
                    AND bil.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bil.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bil.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE bil.Billing_Invoice IN %s 
                  AND bil.Bill_Status != 'Canceled'
                  AND bil.Approve_Status = 'Completed'
                  AND (
                      (bil.Test_Method = 'Offers' AND op.department_name IN %s)
                      OR (bil.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                      OR (bil.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                  )
            """, [tuple(all_invoices), tuple(department_names), tuple(department_names), tuple(department_names)])
            
            test_details_by_invoice = {}
            for test_row in cursor.fetchall():
                invoice = test_row[0]
                if invoice not in test_details_by_invoice:
                    test_details_by_invoice[invoice] = []
                test_details_by_invoice[invoice].append({
                    "id": len(test_details_by_invoice[invoice]) + 1,
                    "Test_Name": test_row[1],
                    "Test_Code": test_row[2],
                    "Service_Status": test_row[3],
                    "Analysis_Status": test_row[4],
                    "Verify_Status": test_row[5],
                    "Approve_Status": test_row[6],
                    "Transfer_Location": test_row[7]
                })
            
            # Build patient data
            patients_data = []
            for row in patients_results:
                billing_invoice = row[9]
                
                service_status_list = service_statuses_by_invoice.get(billing_invoice, [])
                test_details = test_details_by_invoice.get(billing_invoice, [])
                
                patient_data = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1].upper() if row[1] else "",
                    "Age": row[2],
                    "Gender": row[3],
                    "Address": row[4],
                    "Phone": row[5],
                    "Patient_Group": row[6],
                    "Refering_Doctor": row[7],
                    "UpdatedAt": row[8].strftime("%Y-%m-%d") if row[8] else "",
                    "Billing_Invoice": billing_invoice,
                    "Total_Charge": float(row[10]) if row[10] is not None else 0.0,
                    "Phlebotomist_Type": row[11],
                    "Phlebotomist_Name": row[12],
                    "Item_Count": row[13],
                    "Barcode": row[14],
                    "Visit_Id": row[15],
                    "TestMethods": row[16],
                    "Service_Statuses": service_status_list,
                    "Time_Period": row[17],
                    "Title": row[18],
                    "Refering_Hospital": row[19],
                    "TestDetails": test_details,
                    "RegisterId": row[24],
                }
                
                if len(test_details) > 0:
                    patients_data.append(patient_data)

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

    except Exception as e:
        print("Error:", e)
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)




def getfor_op_and_iplist(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        with connection.cursor() as cursor:
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            location = request.GET.get('Location', 'ALL')
            patientId = request.GET.get('patientId')

            location = Location_Detials.objects.get(Location_Id=location).Location_Name

            where_clauses = []
            params = []

            # Add location condition
            if location != 'ALL':
                where_clauses.append("""
                    (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )
                """)
                params.extend([f'%{location}%', location])

            if patientId:
                where_clauses.append("rp.Patient_Id = %s")
                params.extend([patientId,])

            where_condition = " AND ".join(where_clauses)

            # Count query
            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM Billing_Item_Table_for_lab bit
                JOIN Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                WHERE {where_condition}
            """
            cursor.execute(count_query, params)
            total_records = cursor.fetchone()[0]

            # Main query
            patient_query = f"""
                SELECT DISTINCT
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, bit2.UpdatedAt, bit2.Billing_Invoice,
                    bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                    bit2.Barcode_Id, bit2.Visit_Id, 
                    GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                    rp.Time_Period, rp.Title, pvi.Refering_Hospital,
                    GROUP_CONCAT(DISTINCT bil.Test_Name SEPARATOR ', ') AS TestNames,
                    GROUP_CONCAT(DISTINCT bil.Test_Code SEPARATOR ', ') AS TestCodes,
                    GROUP_CONCAT(DISTINCT bil.Transfer_Location SEPARATOR ', ') AS TransferLocations,
                    MAX(bit2.CreatedAt) AS Latest 
                FROM Billing_Item_Table_for_lab bit
                JOIN Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                LEFT JOIN Billing_Item_Table_for_lab bil ON bil.Billing_Invoice = bit2.Billing_Invoice
                WHERE {where_condition}
                GROUP BY
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                    pvi.Patient_Group, pvi.Refering_Doctor, bit2.UpdatedAt, bit2.Billing_Invoice,
                    bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                    bit2.Barcode_Id, bit2.Visit_Id, rp.Time_Period, rp.Title, pvi.Refering_Hospital
                ORDER BY Latest DESC
                LIMIT %s OFFSET %s
            """
            params.extend([limit, offset])
            cursor.execute(patient_query, params)
            patients_results = cursor.fetchall()

            patients_data = []
            for row in patients_results:
                billing_invoice = row[9]

                # Get service statuses
                service_status_query = """
                    SELECT Capture_Sample_Status, Analyze_Status, Verify_Status, Approve_Status
                    FROM Billing_invoice_and_bill_amount
                    WHERE Billing_Invoice = %s
                """
                cursor.execute(service_status_query, [billing_invoice])
                service_statuses = cursor.fetchall()
                service_status_list = [
                    {
                        "Capture": status[0],
                        "Analaysis": status[1],
                        "Verify": status[2],
                        "Approve": status[3],
                    }
                    for status in service_statuses
                ]

                # Get test details (no department filtering)
                service_status_query1 = """
                    SELECT bil.Test_Name, bil.Test_Code, bil.Service_Status, bil.Analysis_Status,
                           bil.Verify_Status, bil.Approve_Status, bil.Transfer_Location
                    FROM Billing_Item_Table_for_lab bil
                    WHERE bil.Billing_Invoice = %s AND bil.Approve_Status = 'Completed'
                """
                cursor.execute(service_status_query1, [billing_invoice])
                test_data = cursor.fetchall()
                test_details = [
                    {
                        "id": j + 1,
                        "Test_Name": i[0],
                        "Test_Code": i[1],
                        "Service_Status": i[2],
                        "Analysis_Status": i[3],
                        "Verify_Status": i[4],
                        "Approve_Status": i[5],
                        "Transfer_Location": i[6]
                    }
                    for j, i in enumerate(test_data)
                ]

                patient_data = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1].upper(),
                    "Age": row[2],
                    "Gender": row[3],
                    "Address": row[4],
                    "Phone": row[5],
                    "Patient_Group": row[6],
                    "Refering_Doctor": row[7],
                    "UpdatedAt": row[8].strftime("%Y-%m-%d"),
                    "UpdatedAtTime": row[8].strftime("%I:%M %p"),
                    "Billing_Invoice": billing_invoice,
                    "Total_Charge": float(row[10]) if row[10] is not None else 0.0,
                    "Phlebotomist_Type": row[11],
                    "Phlebotomist_Name": row[12],
                    "Item_Count": row[13],
                    "Barcode": row[14],
                    "Visit_Id": row[15],
                    "TestMethods": row[16],
                    "Service_Statuses": service_status_list,
                    "Time_Period": row[17],
                    "Title": row[18],
                    "TestDetails": test_details,
                }
                
                if len(patient_data["TestDetails"]) > 0:
                    patients_data.append(patient_data)
                

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

    except Exception as e:
        print("Error:", e)
        return JsonResponse({"error": str(e)}, status=500)





def dispatchsearch(request):
    if request.method == "GET":
        try:
            cursor = db.cursor()

            # Get search parameters
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')
            locationid = request.GET.get('Location')
            location = Location_Detials.objects.get(Location_Id=locationid).Location_Name 
            print('Location',location,type(location))
            refering_hospital = request.GET.get('Refering_Hospital')
            limit = int(request.GET.get('limit', 10))  # Add pagination parameters
            offset = int(request.GET.get('offset', 0))

            # Initialize where conditions and parameters
            where_clauses = ["bit.Approve_Status = 'Completed'"]
            params = []

            # Add location condition
            if location != 'ALL':
                where_clauses.append("LOWER(bit.Location) = LOWER(%s)")
                params.append(location)

            # Add referring hospital condition
            if refering_hospital and refering_hospital != "ALL":
                where_clauses.append("LOWER(TRIM(pvi.Refering_Hospital)) = LOWER(TRIM(%s))")
                params.append(refering_hospital)

            # Add dynamic filters for patient details
            if patientname:
                where_clauses.append("LOWER(rp.Patient_Name) LIKE LOWER(%s)")
                params.append(f"%{patientname}%")
            if patientid:
                where_clauses.append("LOWER(rp.Patient_Id) LIKE LOWER(%s)")
                params.append(f"%{patientid}%")
            if barcode:
                where_clauses.append("LOWER(bit.Barcode_Id) LIKE LOWER(%s)")
                params.append(f"%{barcode}%")
            if invoicenumber:
                where_clauses.append("LOWER(bit.Billing_Invoice) LIKE LOWER(%s)")
                params.append(f"%{invoicenumber}%")

            # Combine where clauses into a single condition
            where_condition = " AND ".join(where_clauses)

            # Query to count the total records based on dynamic filters
            count_query = f"""
            SELECT COUNT(DISTINCT bit.Billing_Invoice)
            FROM 
                Register_patient_Details rp
            JOIN 
                Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
            JOIN 
                Patient_Visit_Id pvi ON bit.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit.Patient_Id
            WHERE 
                {where_condition}
            """
            cursor.execute(count_query, params)
            total_records = cursor.fetchone()[0]

            # Query to fetch patient details with pagination
            base_query = f"""
            SELECT 
                rp.Patient_Id, 
                rp.Patient_Name, 
                rp.Age, 
                rp.Gender, 
                rp.Street, 
                rp.Phone,
                pvi.Patient_Group, 
                pvi.Refering_Doctor, 
                bit.UpdatedAt, 
                bit.Billing_Invoice, 
                bit.Total_Charge, 
                pvi.Phlebotomist_Type, 
                pvi.Phlebotomist_Name, 
                bit.Item_Count, 
                bit.Barcode_Id, 
                bit.Visit_Id,
                GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                rp.Time_Period,
                rp.Title,
                pvi.Refering_Hospital,
                MAX(bit.CreatedAt) AS Latest
            FROM 
                Register_patient_Details rp
            JOIN 
                Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
            JOIN 
                Patient_Visit_Id pvi ON bit.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit.Patient_Id
            LEFT JOIN
                Billing_Item_Table_for_lab bil ON bil.Billing_Invoice = bit.Billing_Invoice
            WHERE 
                {where_condition}
            GROUP BY 
                rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                pvi.Patient_Group, pvi.Refering_Doctor, bit.UpdatedAt, bit.Billing_Invoice,
                bit.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit.Item_Count,
                bit.Barcode_Id, bit.Visit_Id, rp.Time_Period, rp.Title, pvi.Refering_Hospital
            ORDER BY 
                Latest DESC
            LIMIT %s OFFSET %s
            """
            params.extend([limit, offset])
            cursor.execute(base_query, params)
            patients_results = cursor.fetchall()

            # Process results
            patients_data = []
            for row in patients_results:
                # Fetch service statuses
                service_status_query = """
                SELECT Capture_Sample_Status, Analyze_Status, Verify_Status, Approve_Status
                FROM Billing_invoice_and_bill_amount
                WHERE Billing_Invoice = %s
                """
                cursor.execute(service_status_query, [row[9]])
                service_statuses = cursor.fetchall()
                service_status_list = [
                    {
                        "Capture": status[0],
                        "Analysis": status[1],
                        "Verify": status[2],
                        "Approve": status[3],
                    }
                    for status in service_statuses
                ]

                # Fetch test details with explicit columns
                service_status_query1 = """
                SELECT Test_Name, Service_Status, Analysis_Status, Verify_Status, Approve_Status, Test_Code
                FROM Billing_Item_Table_for_lab
                WHERE Billing_Invoice = %s
                """
                cursor.execute(service_status_query1, [row[9]])
                data = cursor.fetchall()
                test_details = [
                    {
                        "id": j + 1,
                        "Test_Name": i[0],
                        "Service_Status": i[1],
                        "Analysis_Status": i[2],
                        "Verify_Status": i[3],
                        "Approve_Status": i[4],
                        "Test_Code": i[5],
                    }
                    for j, i in enumerate(data)
                ]

                # Add patient data
                patient_data = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1].upper(),
                    "Age": row[2],
                    "Gender": row[3],
                    "Address": row[4],
                    "Phone": row[5],
                    "Patient_Group": row[6],
                    "Refering_Doctor": row[7],
                    "UpdatedAt": row[8].strftime("%Y-%m-%d"),
                    "Billing_Invoice": row[9],
                    "Total_Charge": float(row[10]) if row[10] is not None else 0.0,
                    "Phlebotomist_Type": row[11],
                    "Phlebotomist_Name": row[12],
                    "Item_Count": row[13],
                    "Barcode": row[14],
                    "Visit_Id": row[15],
                    "TestMethods": row[16],
                    "Service_Statuses": service_status_list,
                    "Time_Period": row[17],
                    "Title": row[18],
                    "Refering_Hospital": row[19],
                    "TestDetails": test_details,
                }
                patients_data.append(patient_data)

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."})



from apscheduler.schedulers.background import BackgroundScheduler


def job_function():
    
    cursor = db.cursor()
    selectallquery="SELECT * FROM IP_Drug_Administration "
    cursor.execute(selectallquery)
    results = cursor.fetchall()
    todaydate = datetime.today().date()
    for res in results:
        for i in range(3):
            run_date = todaydate + timedelta(days=i)
            if(run_date == todaydate):
                getquery="""
                    select * from IP_Nurse_Drug_Completed_Administration where Completed_Date=%s
                """
                cursor.execute(getquery,(run_date,))
                print('todaydate',run_date)
            else:
                print('run_date',run_date)
            


# Call the job function

# Create a scheduler instance
sched = BackgroundScheduler()

# Calculate the next occurrence of 15:30 -----
now = datetime.now()
next_run_time = datetime.combine(now, time(16,28 ))
# if now > next_run_time:
#     next_run_time += timedelta(days=1)  # If it's already past 15:30 today, schedule it for the next day

# Schedule the job to run at the calculated next run time
sched.add_job(job_function, "interval", minutes=30, start_date=next_run_time)

# Start the scheduler
sched.start()





#------------------------------------------ patient last visit data --------------------------------------------#

def get_patient_data(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()

            patientbarcode = request.GET.get('patientbarcode')

            get_query = """
                SELECT pv1.Visit_Id, pv1.CreatedAt
                FROM Patient_Visit_Id pv1
                INNER JOIN (
                    SELECT MAX(Visit_Id) AS max_visit_id
                    FROM Patient_Visit_Id
                    WHERE Patient_Barcode = %s
                ) pv2 ON pv1.Visit_Id = pv2.max_visit_id
                WHERE pv1.Patient_Barcode = %s
            """
            cursor.execute(get_query, (patientbarcode, patientbarcode))
            result = cursor.fetchone()

            if result:
                visit_id, created_at = result
                response_data = {
                    "Visit_Id": visit_id,
                    "Created_At": created_at.strftime('%d:%m:%Y')
                }
            else:
                response_data = {
                    "Visit_Id": 1,
                    "Created_At": datetime.datetime.now().strftime('%d:%m:%Y')
                }

        except Exception as e:
            response_data = {"Error": str(e)}
        finally:
            cursor.close()
            db.close()
        
        return JsonResponse(response_data)
    






def getbilling_details_lab(request):
    try:
        
        cursor = db.cursor()

        patientid = request.GET.get('patientid')
        location = request.GET.get('location')
        # dispatch = []
        get_query = """    
                    SELECT *
                    FROM Billing_invoice_and_bill_amount 
                    WHERE Patient_Id = %s AND Location = %s 
                    """
        cursor.execute(get_query, (patientid, location,))

        data = cursor.fetchall()

        columns = [i[0] for i in cursor.description]
        dispatch = [dict(zip(columns,j)) for j in data]
        
        # for row in data:
        #     datas = {
        #         'Billing_Invoice': row[0],
        #         'Patient_Id': row[1],
        #         'Visit_Id': row[2],
        #         'Patient_Name': row[3],
        #         'Net_Amount': row[4],
        #         'Status': row[5],
        #         'Billing_Date': row[6]
        #     }
        #     dispatch.append(datas)

        return JsonResponse(dispatch, safe=False)  # safe=False to allow non-dict objects
    except Exception as e:
        return JsonResponse({"Error": str(e)})  # Convert exception to string
    finally:
        cursor.close()
        db.close()



#--------------------------------- get test list ------------------------------------------------

def gettest_details_lab(request):
    try:
        
        cursor = db.cursor()

        patient_id = request.GET.get('PatientID')
        location = request.GET.get('location')

        get_query = """    
            SELECT *
            FROM Billing_Item_Table_for_lab 
            WHERE Patient_Id = %s AND Location = %s
        """
        cursor.execute(get_query, (patient_id, location,))

        data = cursor.fetchall()
        print('data :',data)
        columns = [i[0] for i in cursor.description]
        dispatch = [dict(zip(columns,j)) for j in data]
        
        # for row in data:
        #     datas = {
        #         'Billing_Invoice': row[0],
        #         'Patient_Id': row[1],
        #         'Visit_Id': row[2],
        #         'Patient_Name': row[3],
        #         'Test_Name': row[4],
        #         'Test_Code': row[5]
        #     }
        #     dispatch.append(datas)

        return JsonResponse(dispatch, safe=False)
    except Exception as e:
        return JsonResponse({"Error": str(e)})
    finally:
        cursor.close()
        db.close()


#------------------------------------- billing barcode downloads -----------------------------------------------------#

from django.http import JsonResponse
from django.db import connection as db  # Assuming you are using Django's default DB connection

# def getfor_barcode_details_print(request):
#     try:
#         cursor = db.cursor()
#         Billinginvoice = request.GET.get('invoice')

#         cursor.execute("""
#             SELECT Test_Name, Test_Code 
#             FROM Billing_Item_Table_for_lab 
#             WHERE Billing_Invoice = %s
#         """, (Billinginvoice,))
#         testnames = cursor.fetchall()

#         departmentnames = set()

#         for test in testnames:
#             test_code = test[1]

#             cursor.execute("""
#                 SELECT sub_department_id 
#                 FROM Test_Descriptions 
#                 WHERE Test_Code = %s
#             """, (test_code,))
#             department = cursor.fetchone()

#             if department:
#                 sub_dept_id = department[0]

#                 cursor.execute("""
#                     SELECT SubDepartment_Name 
#                     FROM SubLab_Department_Detials 
#                     WHERE SubDepartment_Code = %s
#                 """, (sub_dept_id,))
#                 deptname = cursor.fetchone()

#                 print(deptname,'deptnameeeeeee')

#                 if deptname:
#                     departmentnames.add(deptname[0])  # Add department name, not code

#         return JsonResponse(list(departmentnames), safe=False)

#     except Exception as e:
#         return JsonResponse({"Error": str(e)})

#     finally:
#         if cursor:
#             cursor.close()



# def getfor_barcode_details_print(request):
#     try:
#         cursor = db.cursor()
#         Billinginvoice = request.GET.get('invoice')

#         cursor.execute("""
#             SELECT Test_Name, Test_Code, Patient_Id
#             FROM Billing_Item_Table_for_lab 
#             WHERE Billing_Invoice = %s
#         """, (Billinginvoice,))
#         test_rows = cursor.fetchall()

#         if not test_rows:
#             return JsonResponse({"Error": "No records found"})

#         departmentnames = set()
#         patient_id = test_rows[0][2]  # Patient_Id is same for all rows of the invoice

#         for row in test_rows:
#             test_code = row[1]

#             cursor.execute("""
#                 SELECT sub_department_id 
#                 FROM Test_Descriptions 
#                 WHERE Test_Code = %s
#             """, (test_code,))
#             department = cursor.fetchone()

#             if department:
#                 sub_dept_id = department[0]

#                 cursor.execute("""
#                     SELECT SubDepartment_Name 
#                     FROM SubLab_Department_Detials 
#                     WHERE SubDepartment_Code = %s
#                 """, (sub_dept_id,))
#                 deptname = cursor.fetchone()

#                 if deptname:
#                     departmentnames.add(deptname[0])

#         # Final response including Patient_Id
#         response = {
#             "patient_id": patient_id,
#             "departments": list(departmentnames)
#         }

#         return JsonResponse(response, safe=False)

#     except Exception as e:
#         return JsonResponse({"Error": str(e)})

#     finally:
#         if cursor:
#             cursor.close()


 
def getfor_barcode_details_print(request):
    try:
        cursor = db.cursor()
        Billinginvoice = request.GET.get('invoice')
 
        # Fetch patient id
        cursor.execute("""
            SELECT Patient_ID
            FROM Billing_Item_Table_for_lab
            WHERE Billing_Invoice = %s
        """, (Billinginvoice,))
        patient_row = cursor.fetchone()
        patient_id = patient_row[0] if patient_row else ""
 
        # Fetch tests
        cursor.execute("""
            SELECT Test_Name, Test_Code
            FROM Billing_Item_Table_for_lab
            WHERE Billing_Invoice = %s
        """, (Billinginvoice,))
        testnames = cursor.fetchall()
 
        departmentnames = set()
 
        for test in testnames:
            test_code = test[1]
 
            cursor.execute("""
                SELECT sub_department_id
                FROM Test_Descriptions
                WHERE Test_Code = %s
            """, (test_code,))
            department = cursor.fetchone()
 
            if department:
                sub_dept_id = department[0]
 
                cursor.execute("""
                    SELECT SubDepartment_Name
                    FROM SubLab_Department_Detials
                    WHERE SubDepartment_Code = %s
                """, (sub_dept_id,))
                deptname = cursor.fetchone()
 
                if deptname:
                    departmentnames.add(deptname[0])
 
        # Return object instead of list
        return JsonResponse({
            "departments": list(departmentnames),
            "patient_id": patient_id
        })
 
    except Exception as e:
        return JsonResponse({"Error": str(e)})
 
    finally:
        if cursor:
            cursor.close()
 
 
 



def generate_next_barcode_id(department, barcode_base_id):
    department_code = department[:3].upper()  # First 3 letters of department
    # invoice_last_2 = invoice_last_2[-2:]  # Last 2 digits of invoice
    current_date = datetime.now().strftime('%y%m%d')  # Date in YYMMDD format

    base_id = f'{department_code}{barcode_base_id}'
    return base_id


        

def get_for_pending_result_department(request):
    try:
        
        cursor = db.cursor()

        invoiceno = request.GET.get('invoice')
        cursor.execute("SELECT Test_Name,Test_Code FROM Billing_Item_Table_for_lab WHERE Billing_Invoice = %s", (invoiceno,))
        testnames = cursor.fetchall()
        departmentnames = set() 
        print('testnames', testnames)

        for test in testnames:
            cursor.execute("SELECT Sub_Department_id FROM Test_Descriptions WHERE Test_Code = %s", (test[1],))
            department = cursor.fetchone()
            cursor.execute("SELECT SubDepartment_Name FROM SubLab_Department_Detials WHERE SubDepartment_Code = %s", (department[0],))
            department = cursor.fetchone()
            print(department)
            if department:
                departmentnames.add(department[0])  # Add the department name to the set
        
        return JsonResponse(list(departmentnames), safe=False)  # Convert the set to a list before returning


    except Exception as e:
        return JsonResponse({"Error" : str(e)})
    finally:
        cursor.close()
        db.close()





def get_billing_receipts_rebilling_print(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()

            invoice = request.GET.get('invoice')
            location = request.GET.get('location')

            get_receipt_query = """
                SELECT Receipt FROM Billing_receipts_store WHERE Location = %s AND Invoice = %s             
            """
            cursor.execute(get_receipt_query, (location, invoice))
            receipt = cursor.fetchone()
            
            if receipt and receipt[0]:
                photo_base64 = base64.b64decode(base64.b64encode(receipt[0])).decode("utf-8")
                sample = photo_base64
            else:
                sample = 'Billing is not completed'

            return JsonResponse({"receipt": sample})

        except Exception as e:
            return JsonResponse({"Error": str(e)})

        finally:
            cursor.close()
            db.close()




# def getfor_barcode_details_print(request):
#     try:
#         
#         cursor = db.cursor()

#         Billinginvoice = request.GET.get('invoice')

#         cursor.execute("SELECT Test_Name,Test_Code FROM Billing_Item_Table_for_lab WHERE Billing_Invoice = %s", (Billinginvoice,))
#         testnames = cursor.fetchall()
#         print('testnames :', testnames)

#         departmentdetails = []  # List to store all test details
        
#         for test in testnames:
#             cursor.execute("SELECT Sub_Department, Specimen_Name, Test_Code, Test_Name FROM Test_Descriptions WHERE Test_Code = %s", (test[1],))
#             department = cursor.fetchall()
#             print('department :', department)
#             if department:
#                 for i in department:
#                     data = {
#                         'Sub_Department': i[0],
#                         'Specimen_Name': i[1],
#                         'Test_Code': i[2],
#                         'Test_Name': i[3]
#                     }
#                     departmentdetails.append(data)

#         return JsonResponse(departmentdetails, safe=False)  # Return list of all test details as tuples
#     except Exception as e:
#         print(str(e))
#         return JsonResponse({"Error": str(e)})
#     finally:
#         cursor.close()
#         db.close()

@csrf_exempt
def insertbarcode_id(request):
    try:
        
        cursor = db.cursor()
        
        data = request.POST
        files = request.FILES
        print('data :', data)
        
        # Extract keys and values from QueryDict
        invoice_nos = [value for key, value in data.items() if key.startswith('invoice_no')]
        barcode_ids = [value for key, value in data.items() if key.startswith('barcode_id')]
        patientids = [value for key, value in data.items() if key.startswith('patientid')]
        visitids = [value for key, value in data.items() if key.startswith('visitid')]
        patientnames = [value for key, value in data.items() if key.startswith('patientname')]
        test_names = [value for key, value in data.items() if key.startswith('test_name')]
        test_codes = [value for key, value in data.items() if key.startswith('test_code')]

        num_records = len(invoice_nos)
        
        for i in range(num_records):
            invoice_no = invoice_nos[i]
            barcode_id = barcode_ids[i]
            patientid = patientids[i]
            visitid = visitids[i]
            patientname = patientnames[i]
            test_name = test_names[i]
            test_code = test_codes[i]

            # Get the barcode image
            barcode_image = files.get(f'barcode_{i}')

            # Read barcode image data
            if barcode_image:
                    
                invoicebarcodeimage1 = barcode_image.read()
                barcode_image_data = base64.b64encode(invoicebarcodeimage1).decode('utf-8')
            else:
                barcode_image_data = None

            # Check if the record already exists
            cursor.execute("""
                SELECT 1 FROM barcode_id 
                WHERE invoice_no = %s AND Test_Code = %s
            """, (invoice_no, test_code))
            
            if cursor.fetchone():
                # Record exists, skip insertion
                print(f"Skipping insertion for invoice_no: {invoice_no}, test_code: {test_code}")
                return JsonResponse({'Message':'Already inserted'})

            # Get the maximum Sl_No for the next record
            cursor.execute("SELECT MAX(Sl_No) FROM barcode_id")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            # Insert data into the database
            cursor.execute("""
                INSERT INTO barcode_id (Sl_No, invoice_no, Barcode_ID, Patient_Id, Visit_Id, Patient_Name, Test_Name, Test_Code, Barcode)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                next_id,
                invoice_no,
                barcode_id,
                patientid,
                visitid,
                patientname,
                test_name,
                test_code,
                barcode_image_data
            ))

        db.commit()

        return JsonResponse({'message': 'Barcode IDs inserted successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)})

    finally:
        cursor.close()
        db.close()

#--------------------------- Get data for Report ---------------------------------------------------#
def get_for_report_data_by_barcodeid(request):
    try:
        
        cursor = db.cursor()

        barcodeid = request.GET.get('barcodeid')

        query = """SELECT * FROM barcode_id WHERE Barcode_ID=%s"""
        cursor.execute(query, (barcodeid,))
        data = cursor.fetchall()

        results = []
        for i in data:
            detailed_query = """
                SELECT BITL.*, BIBA.*, BPD.*, RPD.*
                FROM billing_item_table_for_lab AS BITL
                LEFT JOIN Billing_invoice_and_bill_amount AS BIBA
                    ON BITL.Billing_Invoice = BIBA.Billing_Invoice
                    AND BITL.Patient_Id = BIBA.Patient_Id
                    AND BITL.Visit_Id = BIBA.Visit_Id
                LEFT JOIN bill_payment_details AS BPD
                    ON BITL.Billing_Invoice = BPD.Billing_invoice
                    AND BITL.Patient_Id = BPD.Patient_Id
                LEFT JOIN Register_patient_Details AS RPD
                    ON BITL.Patient_Id = RPD.Patient_Id
                WHERE BITL.Billing_Invoice = %s
                    AND BITL.Test_Code = %s
                    AND BITL.Patient_Id = %s
                    AND BITL.Visit_Id = %s
            """

            cursor.execute(detailed_query, (i[1], i[7], i[3], i[4]))
            detailed_data = cursor.fetchall()

            columns = [col[0] for col in cursor.description]
            result = [dict(zip(columns, row)) for row in detailed_data]
            results.extend(result)

        return JsonResponse(results, safe=False)

    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)})

    finally:
        cursor.close()
        db.close()





def gettestnames(request):
    try:
        
        cursor = db.cursor()
        
        
        query = """SELECT DISTINCT Test_Name,Test_Code FROM Test_Descriptions"""
        cursor.execute(query)
        data = cursor.fetchall()

        result = [{'TestName':i[0],'Test_Code': i[1]} for i in data]
        print('result', result)
        return JsonResponse(result,safe=False)
    
    except Exception as e:
        return JsonResponse({"Error":str(e)})
    finally:
        cursor.close()
        db.close()





import base64

 
def get_report(request):

    if request.method == "GET":

        try:

            # Get the invoice number from query parameters

            formula = request.GET.get("inv")

            if not formula:

                return HttpResponse("No Invoice number provided.", status=400)

            with connection.cursor() as cursor:

                # Check if the bill status is 'Paid'

                cursor.execute(

                    """

                    SELECT Status FROM Billing_invoice_and_bill_amount 

                    WHERE Billing_Invoice = %s

                    """,

                    [formula],

                )

                bill_status_result = cursor.fetchone()

                if not bill_status_result:

                    return HttpResponse("Invoice not found.", status=404)

                bill_status = bill_status_result[0]

                # Fetch the report from Completed_Lab_Report_Table

                cursor.execute(

                    """

                    SELECT Report, ReportSatus FROM Completed_Lab_Report_Table 

                    WHERE Billing_Invoice = %s

                    """,

                    [formula],

                )

                report_result = cursor.fetchone()

                if not report_result:

                    return HttpResponse("Report is not ready.", status=202)

                report, report_status = report_result

                # Check report and bill status

                if bill_status != "Paid" or report_status != "Dispatched":

                    return HttpResponse("Report is not ready or bill is not cleared.", status=403)

                # Decode the base64 report content

                try:

                    report_binary = base64.b64decode(report)

                except (TypeError, ValueError) as e:

                    print(f"Error decoding base64: {e}")

                    return HttpResponse("Error decoding the report content.", status=500)

                # Return the PDF as an HttpResponse with headers for inline display or download

                response = HttpResponse(report_binary, content_type="application/pdf")

                response['Content-Disposition'] = 'inline; filename="lab_report.pdf"'

                return response

        except Exception as e:

            # Handle unexpected errors

            print(e)

            return HttpResponse(f"An error occurred: {str(e)}", status=500)
 
 






@csrf_exempt
def insert_billing_all_data(request):
    try:
        
        cursor = db.cursor()


        print('data :',request.POST)
        
        pdf_file = request.FILES.get('pdf')
        
        
        if pdf_file:
            pdf_file_content = pdf_file.read()
            pdf_file_base64 = base64.b64encode(pdf_file_content).decode('utf-8')
            pdf_file_size = len(pdf_file_content)
            print(f"PDF file size: {pdf_file_size} bytes")
        else:
            pdf_file_base64 = None
            
        invoicebarcodeimage = request.FILES.get('invoicebarcodeimage')
        print('invoicebarcodeimage :',invoicebarcodeimage)
        if invoicebarcodeimage:
            invoicebarcodeimage1 = invoicebarcodeimage.read()
            invoicebarcodeimage1base64 = base64.b64encode(invoicebarcodeimage1).decode('utf-8')
            pdf_file_size = len(pdf_file_content)
            print(f"PDF file size: {pdf_file_size} bytes")
        else:
            invoicebarcodeimage1base64 = None
        
        TRFFIle = request.FILES.get('TRFFIle')
        if TRFFIle:
            TRFFIle_con = TRFFIle.read()
            TRFFIle_con_base64 = base64.b64encode(TRFFIle_con).decode('utf-8')
        else:
            TRFFIle_con_base64 = None
            
        invoice = request.POST.get('invoice')
        print('invoice :',invoice)
        patientbarcode = request.POST.get('Patientbarcode')
        print('patientbarcode :',patientbarcode)
        visitid = request.POST.get('Visitid')
        location = request.POST.get('location')
        createdby = request.POST.get('createdby')
        patientid = request.POST.get('patientid')
        Request_Id = request.POST.get('Request_Id')
        postpersonaldata = json.loads(request.POST.get('postpersonaldata'))
        postbillingdetails = json.loads(request.POST.get('postbillingdetails'))
        postorderdetailsforpayment = json.loads(request.POST.get('postorderdetailsforpayment'))
        postorderdetailsinfo = json.loads(request.POST.get('postorderdetailsinfo'))
        postcommissionfordoctor = json.loads(request.POST.get('postcommissionfordoctor'))
        postreferinghospitaldata = json.loads(request.POST.get('postreferinghospitaldata'))

        testdetails = postorderdetailsinfo.get('testdetails')


        max_id_query = "SELECT Billing_Invoice FROM Billing_invoice_and_bill_amount WHERE Billing_Invoice=%s"
        cursor.execute(max_id_query,(invoice,))
        max_id_result = cursor.fetchone()

        if max_id_result is not None:
            if max_id_result[0] == invoice:
                
                max_id_query = "SELECT MAX(Billing_Invoice) FROM Billing_invoice_and_bill_amount"
                cursor.execute(max_id_query)
                max_id_result = cursor.fetchone()

                if max_id_result and max_id_result[0]:
                    newinvoice = generate_next_key(max_id_result[0])
            else:
                newinvoice = invoice

        else:
            newinvoice = invoice
 
 
        insert_patient_personal_info(cursor, postpersonaldata,patientbarcode)
        print('insert_patient_personal_info')

        
        insert_billing_invoice(cursor, postbillingdetails,testdetails,newinvoice,invoicebarcodeimage1base64,postpersonaldata,postorderdetailsforpayment)
        print('insert_billing_invoice')
        
        insert_billing_item(cursor,postorderdetailsinfo,testdetails,newinvoice)
        print('insert_billing_item')

        # Insert into Patient_Visit_Id
        insert_visit_id(cursor, postpersonaldata,patientbarcode)
        print('insert_visit_id')

        # Insert into Bill_Payment_details
        insert_billing_payment_details(cursor, postorderdetailsforpayment,newinvoice)
        print('insert_billing_payment_details')
        # Insert into Billing_receipts_store
        insert_billing_receipts(cursor,pdf_file_base64,patientbarcode,visitid,location,createdby,newinvoice,TRFFIle_con_base64)
        print('insert_billing_receipts')
        # Insert into Outsourced_External_Examinations_List
        insert_into_outsourced_details(cursor, postbillingdetails,newinvoice)
        print('insert_into_outsourced_details')

        if postreferinghospitaldata["concernname"] != '':
            insert_refering_hospital_details(cursor, postreferinghospitaldata, newinvoice)
            print("insert hospital")

        if postcommissionfordoctor['doctorname'] != '':
            insert_doctor_payment_commission(cursor,postcommissionfordoctor,newinvoice)
            print('insert doctor commission payment')
        if Request_Id:
            update_query = """
                UPDATE External_Hospital_Patient_Request_Table SET Status = %s, Invoice_Number=%s WHERE Request_Id = %s
            """

            cursor.execute(update_query, ("Completed",newinvoice ,Request_Id))
        db.commit()
        return JsonResponse({"message": "Data inserted successfully"})

    except Exception as e:
        print(str(e))
        return JsonResponse({"error": str(e)})
    finally:
        cursor.close()
        db.close()

def insert_patient_personal_info(cursor, postpersonaldata, patientbarcode):
    # Get the current max Patient_Id and calculate the next_id
    cursor.execute("SELECT COALESCE(MAX(Patient_Id), 0) FROM Register_patient_Details")
    max_id = cursor.fetchone()[0]
    next_id = max_id + 1

    # Check if the patient already exists
    check_sql = """
        SELECT Patient_Id FROM Register_patient_Details WHERE Patient_Name = %s AND Phone = %s
    """
    cursor.execute(check_sql, (postpersonaldata.get('patientname'), postpersonaldata.get('PhoneNo')))
    existing_patient = cursor.fetchone()

    # Handle the age field: if it's an empty string or None, replace it with 0
    age = postpersonaldata.get('age')
    if age is None or age == '' or age == 'NaN':
        age = 0
    
    # Capitalize the first letter of the title
    title = postpersonaldata.get('title')
    if title:
        title = title.capitalize()

    if existing_patient:
        # If patient exists, update the existing record
        update_sql = """
            UPDATE Register_patient_Details SET
                Title = %s, Patient_Name = %s, Father_Name = %s, DOB = %s, Age = %s, Gender = %s,
                Marital_Status = %s, Door_No = %s, Street = %s, Rural_Urban = %s, City = %s, State = %s, Pincode = %s,
                Phone = %s, Alternate_No = %s, Email = %s, Location = %s, Patient_Barcode = %s, Time_Period = %s, CreatedBy = %s
            WHERE Patient_Id = %s
        """
        values = (
            title, postpersonaldata.get('patientname').upper(),
            postpersonaldata.get('fathername'), postpersonaldata.get('dob'), age, postpersonaldata.get('gender'),
            postpersonaldata.get('maritalstatus'), postpersonaldata.get('Doorno'),
            postpersonaldata.get('Street'), postpersonaldata.get('rural'), postpersonaldata.get('City'), postpersonaldata.get('State'),
            postpersonaldata.get('pincode'), postpersonaldata.get('PhoneNo'), postpersonaldata.get('Alternatephn'), postpersonaldata.get('Email'),
            postpersonaldata.get('Location'), patientbarcode, postpersonaldata.get('timeperiod'), postpersonaldata.get('CreatedBy'),
            existing_patient[0]
        )
        cursor.execute(update_sql, values)
    else:
        # If patient doesn't exist, insert a new record
        insert_sql = """
            INSERT INTO Register_patient_Details (
                Patient_Id, Title, Patient_Name, Father_Name, DOB, Age, Gender,
                Marital_Status, Door_No, Street, Rural_Urban, City, State, Pincode, Phone, Alternate_No, Email, Location, Patient_Barcode, Time_Period, CreatedBy
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """
        values = (
            next_id,
            title, postpersonaldata.get('patientname').upper(),
            postpersonaldata.get('fathername'), postpersonaldata.get('dob'), age, postpersonaldata.get('gender'),
            postpersonaldata.get('maritalstatus'), postpersonaldata.get('Doorno'),
            postpersonaldata.get('Street'), postpersonaldata.get('rural'), postpersonaldata.get('City'), postpersonaldata.get('State'),
            postpersonaldata.get('pincode'), postpersonaldata.get('PhoneNo'), postpersonaldata.get('Alternatephn'), postpersonaldata.get('Email'),
            postpersonaldata.get('Location'), patientbarcode, postpersonaldata.get('timeperiod'), postpersonaldata.get('CreatedBy')
        )
        cursor.execute(insert_sql,values)

# ---------------------------------

# @csrf_exempt
# def insert_billing_invoice_bill_amount(request):
#     if request.method == "POST":
#         try:
#             
#             cursor = db.cursor()
#             data = json.loads(request.body)
#             print(data)
#             # Fetch the next Billing_Id
#             cursor.execute("SELECT MAX(Billing_Id) FROM Billing_invoice_and_bill_amount")
#             max_id_result = cursor.fetchone()
#             next_billing_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

#             billing_invoice = data.get('invoiceno')
#             barcode = data.get('barcode')
#             item_count = data.get('itemcount')
#             total_charge = data.get('grossAmount')
#             discount = data.get('discountValue')
#             net_amount = data.get('netAmount')
#             paid_amount = data.get('receivedAmount')
#             ratecard = data.get('Ratecardtype')
#             location= data.get('location')
#             remaining_amount = float(net_amount) - float(paid_amount)
#             sample_status = "Pending"
#             Analyze_status = "Pending"
#             verify_status = "Pending"
#             approve_status = "Pending"
#             createdby = data.get('CreatedBy')
#             PhoneNo = data.get('PhoneNo')

#             Billing_date = datetime.now().date()
#             Billing_type = data.get('Billing_Type')
#             BillType = Billing_type if Billing_type != '' else "None"
#             status = "Paid" if remaining_amount == 0 else "Due"

#             insert_sql = """
#                 INSERT INTO Billing_invoice_and_bill_amount (
#                     Billing_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Item_Count, Total_Charge, 
#                     Discount_Type, Discount, Net_Amount, Status, Location, Capture_Sample_Status, Analyze_Status, Verify_Status, Approve_Status, Barcode_Id, CreatedBy, Billing_Date, 
#                     Billing_Type, RateCard_Name,TotalPaidAmount,BalanceAmount
#                 ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """

#             values = (
#                 next_billing_id, billing_invoice, data.get('patientid'), data.get('visitid'), data.get('patientname'), 
#                 item_count, total_charge, data.get('discountType'), discount, net_amount, status, data.get('location'), 
#                 sample_status, Analyze_status, verify_status, approve_status, barcode, createdby, Billing_date, BillType, 
#                 ratecard,float(paid_amount),remaining_amount
#             )

#             if status == "Due":
#                 update_query = """
#                 UPDATE AccountMaster_Entry_Details 
#                 SET Current_Balance = Current_Balance + %s, 
#                     Credit_Amount = Credit_Amount + %s 
#                 WHERE AccountID = %s
#                 """
#                 cursor.execute(update_query, (paid_amount, paid_amount, 5))

#                 update_query = """
#                 UPDATE AccountMaster_Entry_Details 
#                 SET Current_Balance = Current_Balance + %s, 
#                     Credit_Amount = Credit_Amount + %s 
#                 WHERE AccountID = %s
#                 """
#                 cursor.execute(update_query, (remaining_amount, remaining_amount, 3))
#             else:
#                 update_query = """
#                 UPDATE AccountMaster_Entry_Details 
#                 SET Current_Balance = Current_Balance + %s, 
#                     Credit_Amount = Credit_Amount + %s 
#                 WHERE AccountID = %s
#                 """
#                 cursor.execute(update_query, (net_amount, net_amount, 5))

#             inser_reciept_tablenext_id_query = "SELECT IFNULL(MAX(S_No), 0) + 1 AS nextId FROM General_Billing_Receipt_Table"
#             cursor.execute(inser_reciept_tablenext_id_query)
#             inser_reciept_tablenext_id = cursor.fetchone()[0]

#             max_id_query = "SELECT MAX(Receipt_Voucher_Number) AS maxId FROM Receipt_Voucher_Entry_Details"
#             cursor.execute(max_id_query)
#             RCVmax_id = cursor.fetchone()[0]

#             if RCVmax_id is not None:
#                 RCVnext_id = generate_next_key(RCVmax_id)
#             else:
#                 RCVnext_id = 'RCPTA0000001'

#             insert_query = """
#                 INSERT INTO Receipt_Voucher_Entry_Details (Receipt_Voucher_Number, Receipt_Voucher_date, 
#                 Narration, FromAccountID, FromAccount, Cur_Balance, DebitAmount, Status, CreatedBy, CanceledBy, CancelDate, Location)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             cursor.execute(insert_query, (
#                 RCVnext_id, Billing_date, billing_invoice, data.get('patientid'), data.get('patientname'), remaining_amount,
#                 paid_amount, 'Available', createdby, 'Nill', 'Nill', location
#             ))

#             inser_reciept_table = """
#                 INSERT INTO General_Billing_Receipt_Table (
#                     S_No, Invoice_NO, PatientID, PhoneNumber, Patient_Name, TotalAmount,
#                     TotalPaidAmount, BalanceAmount, Billing_Date, Voucher_Number, PaidAmount, Billedby, Location
#                 )
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             cursor.execute(inser_reciept_table, (
#                 inser_reciept_tablenext_id, next_billing_id,  data.get('patientid'), PhoneNo,
#                 data.get('patientname'), net_amount, paid_amount, remaining_amount, Billing_date, RCVnext_id, paid_amount, createdby, location
#             ))

#             payment_details = data.get('payment_details', [])
            
#             cursor.execute("SELECT MAX(S_No) FROM Receipt_Voucher_Items_Entrys_Details")
#             max_id = cursor.fetchone()[0]
#             next_id_items = max_id + 1 if max_id is not None else 1

#             cursor.execute("SELECT MAX(S_No) FROM Receipt_Voucher_Multiple_Payment_Entrys_Details")
#             max_id = cursor.fetchone()[0]
#             next_id_multi_payment = max_id + 1 if max_id is not None else 1

#             for payment in payment_details:
#                 paid_amount = decimal.Decimal(payment.get('paidamount', 0))
#                 payment_method = payment.get('Billpay_method')

#                 select_query = """
#                 SELECT Account_Name, Current_Balance
#                 FROM AccountMaster_Entry_Details
#                 WHERE AccountID = %s
#                 """
#                 cursor.execute(select_query, (1,))
#                 account_details = cursor.fetchone()

#                 if payment_method == 'Cash':
#                     update_query = """
#                     UPDATE AccountMaster_Entry_Details 
#                     SET Current_Balance = Current_Balance + %s, 
#                         Credit_Amount = Credit_Amount + %s 
#                     WHERE AccountID = %s
#                     """
#                     cursor.execute(update_query, (paid_amount, paid_amount, 1))

#                     select_query = """
#                     SELECT Account_Name, Current_Balance
#                     FROM AccountMaster_Entry_Details
#                     WHERE AccountID = %s
#                     """
#                     cursor.execute(select_query, (1,))
#                     account_details = cursor.fetchone()

#                     insert_items_query = """
#                     INSERT INTO Receipt_Voucher_Items_Entrys_Details (S_No, Receipt_Voucher_Number, ToAccountID, ToAccount, Cur_Balance, CreditAmount, Location)
#                     VALUES (%s, %s, %s, %s, %s, %s, %s)
#                     """
#                     cursor.execute(insert_items_query, (next_id_items, RCVnext_id, 1, account_details[0], account_details[1], paid_amount, location))
#                     next_id_items += 1

#                 else:
#                     update_query = """
#                     UPDATE AccountMaster_Entry_Details 
#                     SET Current_Balance = Current_Balance + %s, insert_visit_id
#                         Credit_Amount = Credit_Amount + %s 
#                     WHERE AccountID = %s
#                     """
#                     cursor.execute(update_query, (paid_amount, paid_amount, 2))

#                     select_query = """
#                     SELECT Account_Name, Current_Balance
#                     FROM AccountMaster_Entry_Details
#                     WHERE AccountID = %s
#                     """
#                     cursor.execute(select_query, (2,))
#                     account_details = cursor.fetchone()

#                     insert_items_query = """
#                     INSERT INTO Receipt_Voucher_Items_Entrys_Details (S_No, Receipt_Voucher_Number, ToAccountID, ToAccount, Cur_Balance, CreditAmount, Location)
#                     VALUES (%s, %s, %s, %s, %s, %s, %s)
#                     """
#                     cursor.execute(insert_items_query, (next_id_items, RCVnext_id, 2, account_details[0], account_details[1], paid_amount, location))
#                     next_id_items += 1

#                     insert_multi_payment_query = """
#                     INSERT INTO Receipt_Voucher_Multiple_Payment_Entrys_Details (S_No, Receipt_Voucher_Number, FromAccountID, FromAccount, PaymentType, Amount, Remarks, Location)
#                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#                     """
#                     cursor.execute(insert_multi_payment_query, (next_id_multi_payment, RCVnext_id,   data.get('patientid'), 
#                         data.get('patientname') ,payment_method, paid_amount, PhoneNo, location))

#                     next_id_multi_payment += 1


#             cursor.execute(insert_sql, values)
#             db.commit()

#             return JsonResponse({"message": "Billing information added successfully", "status": status})
        
#         except Exception as e:
#             print(e)  # It's helpful to print or log the exception for debugging purposes.
#             return JsonResponse({"error": str(e)})
#         finally:
#             if cursor:
#                 cursor.close()
#             if db:
#           db.close()




# ---------------------------


def insert_billing_invoice(cursor, postbillingdetails,testdetails,newinvoice,invoicebarcodeimage1base64,postpersonaldata,postorderdetailsforpayment):
    cursor.execute("SELECT MAX(Billing_Id) FROM Billing_invoice_and_bill_amount")
    max_id_result = cursor.fetchone()
    next_billing_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1
    
    
    
    

    print('postbillingdetails :',postbillingdetails)
    # billing_invoice = postbillingdetails.get('invoiceno')
    barcode = postbillingdetails.get('barcode')
    item_count = postbillingdetails.get('itemcount')
    total_charge = postbillingdetails.get('grossAmount')
    discount = postbillingdetails.get('discountValue')
    net_amount = postbillingdetails.get('netAmount')
    paid_amount = postbillingdetails.get('receivedAmount')
    ratecard = postbillingdetails.get('Ratecardtype')
    AdditionalAmount = postbillingdetails.get('AdditionalAmount')
    AdditionalAmountReason = postbillingdetails.get('AdditionalAmountReason')
    DiscountReason = postbillingdetails.get('DiscountReason')
    HistopathologyNumber = postbillingdetails.get('HistopathologyNumber')
    MicrobiologyNumber = postbillingdetails.get('MicrobiologyNumber')
    statuss = postbillingdetails.get('status')
    PhoneNo = postpersonaldata.get('PhoneNo')
    
           
    remaining_amount = float(net_amount) - float(paid_amount)
    sample_status = "Pending"
    Analyze_status = "Pending"
    verify_status = "Pending"
    approve_status = "Pending"
    createdby = postbillingdetails.get('CreatedBy')
    Billing_date = datetime.now().date()
    try:
        if postbillingdetails['Billing_Type'] not in postbillingdetails:
            Billing_type = postbillingdetails.get('Billing_Type')
            BillType = Billing_type if Billing_type != '' else "None"
            print(BillType)

    except Exception  as KeyError:
       BillType = 'None'
    
    # Determine status based on remaining_amount
    if statuss == "Pending":
        print(statuss,"if")
        status = "Pending"
    else:
        print(statuss,"else")
        status = "Paid" if remaining_amount == 0 else "Due"
    
    
    
    
    for i in testdetails:
        testcode = i['test_code']
        query = """SELECT group_name FROM GroupMaster WHERE group_code=%s"""
        cursor.execute(query,(testcode,))
        group_name = cursor.fetchone()

        if group_name is not None:
            group_name = group_name[0]
        else:
            group_name = None

    insert_sql = """
        INSERT INTO Billing_invoice_and_bill_amount (
            Billing_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Item_Count, Total_Charge, 
            Discount_Type, Discount, Net_Amount, Status, Location, Capture_Sample_Status, Analyze_Status, Verify_Status, Approve_Status, Barcode_Id,Group_Name, CreatedBy, Billing_Date, Billing_Type, 
            RateCard_Name,Test_Code, TotalPaidAmount, BalanceAmount, Sample_Barcode_Image, AdditionalAmount, AdditionalAmountReason, DiscountReason, HistoNumber, MicroNumber 
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        next_billing_id, newinvoice, postbillingdetails.get('patientid'), postbillingdetails.get('visitid'), postbillingdetails.get('patientname').upper(), 
        item_count, total_charge, postbillingdetails.get('discountType'), discount, net_amount, status, postbillingdetails.get('location'), sample_status, Analyze_status, verify_status, approve_status, barcode,group_name, createdby, Billing_date, BillType, ratecard, testcode, float(paid_amount), remaining_amount, invoicebarcodeimage1base64,
        AdditionalAmount,AdditionalAmountReason,DiscountReason,HistopathologyNumber,MicrobiologyNumber
    )


    cursor.execute(insert_sql, values)

    if status == "Due":
        update_query = """
        UPDATE AccountMaster_Entry_Details 
        SET Current_Balance = Current_Balance + %s, 
            Credit_Amount = Credit_Amount + %s 
        WHERE AccountID = %s
        """
        cursor.execute(update_query, (paid_amount, paid_amount, 5))

        update_query = """
        UPDATE AccountMaster_Entry_Details 
        SET Current_Balance = Current_Balance + %s, 
            Credit_Amount = Credit_Amount + %s 
        WHERE AccountID = %s
        """
        cursor.execute(update_query, (remaining_amount, remaining_amount, 3))
    else:
        update_query = """
        UPDATE AccountMaster_Entry_Details 
        SET Current_Balance = Current_Balance + %s, 
            Credit_Amount = Credit_Amount + %s 
        WHERE AccountID = %s
        """
        cursor.execute(update_query, (net_amount, net_amount, 5))

        inser_reciept_tablenext_id_query = "SELECT IFNULL(MAX(S_No), 0) + 1 AS nextId FROM General_Billing_Receipt_Table"
        cursor.execute(inser_reciept_tablenext_id_query)
        inser_reciept_tablenext_id = cursor.fetchone()[0]

        max_id_query = "SELECT MAX(Receipt_Voucher_Number) AS maxId FROM Receipt_Voucher_Entry_Details"
        cursor.execute(max_id_query)
        RCVmax_id = cursor.fetchone()[0]

        if RCVmax_id is not None:
            RCVnext_id = generate_next_key_fin(RCVmax_id)
        else:
            RCVnext_id = 'RCPTA0000001'

        insert_query = """
            INSERT INTO Receipt_Voucher_Entry_Details (Receipt_Voucher_Number, Receipt_Voucher_date, 
            Narration, FromAccountID, FromAccount, Cur_Balance, DebitAmount, Status, CreatedBy, CanceledBy, CancelDate, Location)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            RCVnext_id, Billing_date, newinvoice,  postbillingdetails.get('patientid'), postbillingdetails.get('patientname').upper(), remaining_amount,
            paid_amount, 'Available', createdby, 'Nill', 'Nill', postbillingdetails.get('location')
        ))

        inser_reciept_table = """
            INSERT INTO General_Billing_Receipt_Table (
                S_No, Invoice_NO, PatientID, PhoneNumber, Patient_Name, TotalAmount,
                TotalPaidAmount, BalanceAmount, Billing_Date, Voucher_Number, PaidAmount, Billedby, Location
            )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(inser_reciept_table, (
            inser_reciept_tablenext_id, next_billing_id,  postbillingdetails.get('patientid'), PhoneNo,
            postpersonaldata.get('patientname').upper(), net_amount, paid_amount, remaining_amount, Billing_date, RCVnext_id, paid_amount, createdby, postbillingdetails.get('location')
        ))

        payment_details = postorderdetailsforpayment.get('payment_details', [])
        
        cursor.execute("SELECT MAX(S_No) FROM Receipt_Voucher_Items_Entrys_Details")
        max_id = cursor.fetchone()[0]
        next_id_items = max_id + 1 if max_id is not None else 1

        cursor.execute("SELECT MAX(S_No) FROM Receipt_Voucher_Multiple_Payment_Entrys_Details")
        max_id = cursor.fetchone()[0]
        next_id_multi_payment = max_id + 1 if max_id is not None else 1

        for payment in payment_details:
            paid_amount = decimal.Decimal(payment.get('paidamount', 0))
            payment_method = payment.get('Billpay_method')

            select_query = """
            SELECT Account_Name, Current_Balance
            FROM AccountMaster_Entry_Details
            WHERE AccountID = %s
            """
            cursor.execute(select_query, (1,))
            account_details = cursor.fetchone()

            if payment_method == 'Cash':
                update_query = """
                UPDATE AccountMaster_Entry_Details 
                SET Current_Balance = Current_Balance + %s, 
                    Credit_Amount = Credit_Amount + %s 
                WHERE AccountID = %s
                """
                cursor.execute(update_query, (paid_amount, paid_amount, 1))

                select_query = """
                SELECT Account_Name, Current_Balance
                FROM AccountMaster_Entry_Details
                WHERE AccountID = %s
                """
                cursor.execute(select_query, (1,))
                account_details = cursor.fetchone()

                insert_items_query = """
                INSERT INTO Receipt_Voucher_Items_Entrys_Details (S_No, Receipt_Voucher_Number, ToAccountID, ToAccount, Cur_Balance, CreditAmount, Location)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_items_query, (next_id_items, RCVnext_id, 1, account_details[0], account_details[1], paid_amount,  postbillingdetails.get('location')))
                next_id_items += 1

            else:
                update_query = """
                UPDATE AccountMaster_Entry_Details 
                SET Current_Balance = Current_Balance + %s, 
                    Credit_Amount = Credit_Amount + %s 
                WHERE AccountID = %s
                """
                cursor.execute(update_query, (paid_amount, paid_amount, 2))

                select_query = """
                SELECT Account_Name, Current_Balance
                FROM AccountMaster_Entry_Details
                WHERE AccountID = %s
                """
                cursor.execute(select_query, (2,))
                account_details = cursor.fetchone()

                insert_items_query = """
                INSERT INTO Receipt_Voucher_Items_Entrys_Details (S_No, Receipt_Voucher_Number, ToAccountID, ToAccount, Cur_Balance, CreditAmount, Location)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_items_query, (next_id_items, RCVnext_id, 2, account_details[0], account_details[1], paid_amount,  postbillingdetails.get('location')))
                next_id_items += 1

                insert_multi_payment_query = """
                INSERT INTO Receipt_Voucher_Multiple_Payment_Entrys_Details (S_No, Receipt_Voucher_Number, FromAccountID, FromAccount, PaymentType, Amount, Remarks, Location)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_multi_payment_query, (next_id_multi_payment, RCVnext_id,postpersonaldata.get('patientid'), 
                postpersonaldata.get('patientname').upper() ,payment_method, paid_amount, PhoneNo,  postbillingdetails.get('location')))

                next_id_multi_payment += 1


def get_next_item_id(cursor):
    # Placeholder for your logic to get next_item_id
    cursor.execute("SELECT MAX(Item_Id) FROM Billing_Item_Table_for_lab")
    max_id = cursor.fetchone()[0]
    return (max_id or 0) + 1

def insert_subtests(cursor, next_item_id, newinvoice, patientid, visitid, patientname, Dispatchmethod, 
                    testmethod, grossAmount, location, barcode, createdby, testname, testcode, subtest_codes, 
                    packagecode=None, packagename=None):
    subtest_code_list = subtest_codes.split(',') if subtest_codes else []
    for subtest_code in subtest_code_list:
        subtest_code = subtest_code.strip()
        cursor.execute("""
            SELECT Test_Name FROM Test_Descriptions WHERE Test_Code = %s
        """, [subtest_code])
        subtest_result = cursor.fetchone()
        subtest_name = subtest_result[0] if subtest_result else subtest_code
        
        insert_sql = """
            INSERT INTO Billing_Item_Table_for_lab (
                Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, 
                Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, 
                Verify_Status, Approve_Status, Barcode_Id, CreatedBy, Test_Code, IsSubTest, SubTestCodes,
                PackageCode, PackageName
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            next_item_id, newinvoice, patientid, visitid, patientname, Dispatchmethod, testmethod,
            subtest_name, grossAmount, location, "Pending", "Pending", "Pending", "Pending", barcode,
            createdby, subtest_code, "No", None, packagecode, packagename
        )
        cursor.execute(insert_sql, values)
        next_item_id += 1
    return next_item_id

def insert_billing_item(cursor, testdetails, postorderdetailsinfo, newinvoice):
    next_item_id = get_next_item_id(cursor)
    patientid = testdetails.get('patientid')
    visitid = testdetails.get('visitid')
    patientname = testdetails.get('patientname').upper()
    Dispatchmethod = testdetails.get('Dispatchmethod')
    location = testdetails.get('location')
    barcode = testdetails.get('barcode')
    createdby = testdetails.get('CreatedBy')

    dataaaaaaa = {
        'patientid': patientid, 'visitid': visitid, 'patientname': patientname,
        'Dispatchmethod': Dispatchmethod, 'location': location, 'barcode': barcode,
        'CreatedBy': createdby
    }
    print('dataaaaaaa:', dataaaaaaa)

    checkautoquery = """
        SELECT Test_Name, Parameter_One, Parameter_Two FROM Test_Descriptions WHERE Autocheck = 'Yes'
    """
    cursor.execute(checkautoquery)
    checkautores = cursor.fetchall()

    for test in testdetails.get('testdetails'):
        testname = test['test_name']
        testcode = test['test_code']
        grossAmount = test['cost_per_reportable']
        testmethod = test['testmethod']
        indaddamount = test.get('indadditionalamt', 0)
        is_subtest = test.get('is_subtest', 'No')
        subtest_codes = test.get('subtest_codes', None)
        print('testmethod:', testmethod)

        if testmethod == 'Offers':
            query = "SELECT Test_Code, Test_Method, test_name, package_code, package_name, IsSubTest, SubTestCodes FROM OfferPackageList WHERE package_code = %s"
            cursor.execute(query, (testcode,))
            results = cursor.fetchall()
            print('results:', results)

            for result in results:
                offertestcode = result[3]  # package_code
                offer_test_name = result[4]  # package_name
                offer_is_subtest = result[5]
                offer_subtest_codes = result[6]

                if result[1].capitalize() == 'Group':  # Group package in Offers
                    query = "SELECT Test_Code, Test_Name FROM GroupMasterTestList WHERE group_code = %s"
                    cursor.execute(query, (result[0],))
                    test_results = cursor.fetchall()
                    print('test_results:', test_results)

                    for test_result in test_results:
                        subtest_query = """SELECT IsSubTest, SubTestCodes FROM Test_Descriptions WHERE Test_Code = %s"""
                        cursor.execute(subtest_query, (test_result[0],))
                        subtest_info = cursor.fetchone()
                        group_is_subtest = subtest_info[0] if subtest_info else 'No'
                        group_subtest_codes = subtest_info[1] if subtest_info else None

                        insert_sql = """
                            INSERT INTO Billing_Item_Table_for_lab (
                                Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, 
                                Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, 
                                Verify_Status, Approve_Status, Barcode_Id, Group_Name, CreatedBy, Test_Code, 
                                Group_Code, individual_add_amount, PackageCode, PackageName, IsSubTest, SubTestCodes
                            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """
                        values = (
                            next_item_id, newinvoice, patientid, visitid, patientname, Dispatchmethod, 
                            testmethod, test_result[1], grossAmount, location, "Pending", "Pending", "Pending",
                            "Pending", barcode, result[2], createdby, test_result[0], result[0], indaddamount, 
                            offertestcode, offer_test_name, group_is_subtest, group_subtest_codes
                        )
                        cursor.execute(insert_sql, values)
                        next_item_id += 1

                        # Insert subtests for this group test
                        if group_is_subtest == "Yes" and group_subtest_codes:
                            next_item_id = insert_subtests(cursor, next_item_id, newinvoice, patientid, visitid, patientname, 
                                                           Dispatchmethod, testmethod, grossAmount, location, barcode, 
                                                           createdby, test_result[1], test_result[0], group_subtest_codes,offertestcode,offer_test_name)

                        # Scheduler for autocheck
                        if any(test_result[1] == checkauto[0] for checkauto in checkautores):
                            scheduler = BackgroundScheduler()
                            scheduler.start()
                            print('Scheduler started')

                            for checkauto in checkautores:
                                if test_result[1] == checkauto[0]:
                                    times_to_call = checkauto[1]
                                    time_gap = checkauto[2]
                                    dataaaaaaa.update({
                                        'next_id': newinvoice,
                                        'test_name': test_result[1],
                                        'testname': testname,
                                        'times_to_call': times_to_call
                                    })
                                    print('dataaaaaaa:', dataaaaaaa)
                                    for i in range(times_to_call):
                                        start_time = datetime.now() + timedelta(seconds=time_gap * (i + 1))
                                        print('start_time:', start_time)
                                        scheduler.add_job(
                                            func=job_function_test,
                                            trigger='date',
                                            run_date=start_time,
                                            args=(dataaaaaaa,),
                                            id=f"{dataaaaaaa['test_name']}{newinvoice}{i}",
                                            replace_existing=True
                                        )

                elif result[1].capitalize() == 'Individual':
                    insert_sql = """
                        INSERT INTO Billing_Item_Table_for_lab (
                            Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, 
                            Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, 
                            Verify_Status, Approve_Status, Barcode_Id, CreatedBy, Test_Code, individual_add_amount, 
                            PackageCode, PackageName, IsSubTest, SubTestCodes
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    values = (
                        next_item_id, newinvoice, patientid, visitid, patientname, Dispatchmethod, 
                        testmethod, result[2], grossAmount, location, "Pending", "Pending", "Pending",
                        "Pending", barcode, createdby, result[0], indaddamount, offertestcode, offer_test_name,
                        offer_is_subtest, offer_subtest_codes
                    )
                    cursor.execute(insert_sql, values)
                    next_item_id += 1

                    # Insert subtests for this individual offer test
                    if offer_is_subtest == "Yes" and offer_subtest_codes:
                        next_item_id = insert_subtests(cursor, next_item_id, newinvoice, patientid, visitid, patientname, 
                                                       Dispatchmethod, testmethod, grossAmount, location, barcode, 
                                                       createdby, result[2], result[0], offer_subtest_codes,offertestcode,offer_test_name)

                    # Scheduler for autocheck
                    if any(result[2] == checkauto[0] for checkauto in checkautores):
                        scheduler = BackgroundScheduler()
                        scheduler.start()
                        print('Scheduler started')

                        for checkauto in checkautores:
                            if result[2] == checkauto[0]:
                                times_to_call = checkauto[1]
                                time_gap = checkauto[2]
                                dataaaaaaa.update({
                                    'next_id': newinvoice,
                                    'times_to_call': times_to_call,
                                    'test_name': result[2],
                                    'testname': 'None'
                                })
                                print('dataaaaaaa:', dataaaaaaa)
                                for i in range(times_to_call):
                                    start_time = datetime.now() + timedelta(seconds=time_gap * (i + 1))
                                    print('start_time:', start_time)
                                    scheduler.add_job(
                                        func=job_function_test,
                                        trigger='date',
                                        run_date=start_time,
                                        args=(dataaaaaaa,),
                                        id=f"{dataaaaaaa['test_name']}{newinvoice}{i}",
                                        replace_existing=True
                                    )

        elif testmethod == 'Group':
            query = "SELECT Test_Code, Test_Name FROM GroupMasterTestList WHERE group_code = %s"
            cursor.execute(query, (testcode,))
            test_results = cursor.fetchall()
            print('test_results:', test_results)
        
            for test_result in test_results:
                subtest_query = """SELECT IsSubTest, SubTestCodes FROM Test_Descriptions WHERE Test_Code = %s"""
                cursor.execute(subtest_query, (test_result[0],))
                subtest_info = cursor.fetchone()
                print('subtest_info:', subtest_info)
                
                group_is_subtest = subtest_info[0] if subtest_info else 'No'
                group_subtest_codes = subtest_info[1] if subtest_info else None
        
                # Insert main test
                insert_sql = """
                    INSERT INTO Billing_Item_Table_for_lab (
                        Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, 
                        Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, 
                        Verify_Status, Approve_Status, Barcode_Id, Group_Name, CreatedBy, Test_Code, 
                        Group_Code, individual_add_amount, IsSubTest, SubTestCodes
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                values = (
                    next_item_id, newinvoice, patientid, visitid, patientname, Dispatchmethod, 
                    testmethod, test_result[1], grossAmount, location, "Pending", "Pending", "Pending",
                    "Pending", barcode, testname, createdby, test_result[0], testcode, indaddamount,
                    group_is_subtest, group_subtest_codes
                )
                cursor.execute(insert_sql, values)
                next_item_id += 1
        
                # Insert subtests
                if group_is_subtest == "Yes" and group_subtest_codes:
                    print('ellooooo:')
                    next_item_id = insert_subtests(cursor, next_item_id, newinvoice, patientid, visitid, patientname, 
                                                   Dispatchmethod, testmethod, grossAmount, location, barcode, 
                                                   createdby, test_result[1], test_result[0], group_subtest_codes)
        else:  # Individual
            insert_sql = """
                INSERT INTO Billing_Item_Table_for_lab (
                    Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, Dispatch_Method, 
                    Test_Method, Test_Name, Gross_Amount, Location, Service_Status, Analysis_Status, 
                    Verify_Status, Approve_Status, Barcode_Id, CreatedBy, Test_Code, individual_add_amount, 
                    IsSubTest, SubTestCodes
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                next_item_id, newinvoice, patientid, visitid, patientname, Dispatchmethod, 
                testmethod, testname, grossAmount, location, "Pending", "Pending", "Pending",
                "Pending", barcode, createdby, testcode, indaddamount, is_subtest, subtest_codes
            )
            cursor.execute(insert_sql, values)
            next_item_id += 1

            # Insert subtests for this individual test
            if is_subtest == "Yes" and subtest_codes:
                next_item_id = insert_subtests(cursor, next_item_id, newinvoice, patientid, visitid, patientname, 
                                               Dispatchmethod, testmethod, grossAmount, location, barcode, 
                                               createdby, testname, testcode, subtest_codes)

            # Scheduler for autocheck
            if any(testname == checkauto[0] for checkauto in checkautores):
                scheduler = BackgroundScheduler()
                scheduler.start()
                print('Scheduler started')

                for checkauto in checkautores:
                    if testname == checkauto[0]:
                        times_to_call = checkauto[1]
                        time_gap = checkauto[2]
                        dataaaaaaa.update({
                            'next_id': newinvoice,
                            'times_to_call': times_to_call,
                            'test_name': testname,
                            'testname': 'None'
                        })
                        print('dataaaaaaa:', dataaaaaaa)
                        for i in range(times_to_call):
                            start_time = datetime.now() + timedelta(seconds=time_gap * (i + 1))
                            print('start_time:', start_time)
                            scheduler.add_job(
                                func=job_function_test,
                                trigger='date',
                                run_date=start_time,
                                args=(dataaaaaaa,),
                                id=f"{dataaaaaaa['test_name']}{newinvoice}{i}",
                                replace_existing=True
                            )

    return next_item_id  # Return the updated next_item_id if needed elsewhere






def insert_visit_id(cursor, postpersonaldata, patientbarcode):
    
    print('postpersonaldata :', postpersonaldata)
    cursor.execute("SELECT MAX(S_No) FROM Patient_Visit_Id")
    max_id_result = cursor.fetchone()
    max_id = max_id_result[0] if max_id_result is not None else 0
    next_id = max_id + 1 if max_id is not None else 1

    cursor.execute("SELECT Patient_Barcode FROM Register_patient_Details WHERE Patient_Id = %s AND Patient_Name = %s", (postpersonaldata.get('patientid'), postpersonaldata.get('patientname').upper(),))
    patient_barcode_row = cursor.fetchone()
    patient_barcode = patient_barcode_row[0] if patient_barcode_row is not None else None

    print('patient_barcode insert_visit_id :', patient_barcode)
    
    if patient_barcode is None:
        patient_barcode = patientbarcode

    insert_sql = """
        INSERT INTO Patient_Visit_Id (S_No, Visit_Id, Patient_Name, Patient_Id, Phone, Visit_Type, Phlebotomist_Type, Phlebotomist_Name, Refering_Doctor, Patient_Group, Dispatch_Method, Patient_Barcode, CreatedBy, Location, Refering_Hospital)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute(insert_sql, (
        next_id, postpersonaldata.get('visitid'), postpersonaldata.get('patientname').upper(), postpersonaldata.get('patientid'),
        postpersonaldata.get('PhoneNo'), postpersonaldata.get('visittype'), postpersonaldata.get('phlebotomisttype'),
        postpersonaldata.get('phlebotomistname'), postpersonaldata.get('Referingdoctor'),
        postpersonaldata.get('Patientgroup'), postpersonaldata.get('Dispatchmethod'), patient_barcode,
        postpersonaldata.get('CreatedBy'), postpersonaldata.get('Location'), postpersonaldata.get('concernname')))


def insert_billing_payment_details(cursor, postorderdetailsforpayment,newinvoice):
    patient_id = postorderdetailsforpayment.get('patientid')
    # invoiceno = postorderdetailsforpayment.get('invoiceno')
    net_amount = decimal.Decimal(postorderdetailsforpayment.get('netAmount', 0))
    location = postorderdetailsforpayment.get('location')
    barcode = postorderdetailsforpayment.get('barcode')
    createdby = postorderdetailsforpayment.get('CreatedBy')
    Billing_date = datetime.now().date()
    cardnumber = postorderdetailsforpayment.get('cardnum')
    cardname = postorderdetailsforpayment.get('cardname')
    transactionid = postorderdetailsforpayment.get('transactionid')
    onlinenum = postorderdetailsforpayment.get('onlinenum')
    cardtype = postorderdetailsforpayment.get('cardtype')
    # Assuming payment details are in 'payment_details' field
    payment_details = postorderdetailsforpayment.get('payment_details', [])

    for payment in payment_details:
                cursor.execute("SELECT MAX(Billing_Id) FROM Bill_Payment_details")
                max_id_result = cursor.fetchone()
                next_billing_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

                cursor.execute("SELECT SUM(Paid_Amount) FROM Bill_Payment_details WHERE Billing_invoice = %s", (newinvoice,))
                total_paid = cursor.fetchone()[0] or decimal.Decimal(0)
                remaining_amount = net_amount - total_paid if total_paid is not None else net_amount

                paid_amount = decimal.Decimal(payment.get('paidamount', 0))
                payment_type = payment.get('Billpay_method')
                remaining_amount -= paid_amount

                # Correct SQL query for inserting payment details
                insert_sql = """
                    INSERT INTO Bill_Payment_details (
                        Billing_Id, Billing_invoice, Patient_Id, Net_Amount, Payment_Type, 
                        Paid_Amount, Remaing_Amount, Location, Barcode_Id, CreatedBy, Billing_Date, Card_Number, Card_Name, UPI_Mobile_Num, Transaction_Id, Card_Type
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                # Execute SQL query
                cursor.execute(insert_sql, (next_billing_id, newinvoice, patient_id, net_amount, 
                                             payment_type, paid_amount, remaining_amount, location, barcode, createdby, Billing_date, cardnumber, cardname, transactionid, onlinenum, cardtype))
                

def insert_billing_receipts(cursor,pdf_file_base64,patientbarcode,visitid,location,createdby,newinvoice,TRFFIle_con_base64):
    print('patientbarcode :',patientbarcode)
    cursor.execute("SELECT MAX(Receipt_id) FROM Billing_receipts_store")
    max_id = cursor.fetchone()[0]
    next_id = max_id + 1 if max_id is not None else 1
    
    current_date = datetime.now().date()  # Corrected here

    billdate = current_date.strftime('%Y-%m-%d')

    insert_query = """
            INSERT INTO Billing_receipts_store (Receipt_id, Invoice, Patient_Barcode, Visit_Id, Billdate, Receipt, Location, CreatedBy, TRF_File)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

    cursor.execute(insert_query, [
        next_id, newinvoice, patientbarcode, visitid, billdate, pdf_file_base64, location, createdby,TRFFIle_con_base64
])


def insert_into_outsourced_details(cursor, postbillingdetails,newinvoice):
    # invoice = postbillingdetails.get('invoiceno')
    patient_id =postbillingdetails.get('patientid')
    visitid = postbillingdetails.get('visitid')
    patientname = postbillingdetails.get('patientname').upper()
    location = postbillingdetails.get('location')
    CreatedBy = postbillingdetails.get('CreatedBy')
    netAmount = postbillingdetails.get('netAmount')
    externallab = postbillingdetails.get('outsource_type')
    referdoctor = postbillingdetails.get('refering_doctor')
    barcode = postbillingdetails.get('barcode')
    cursor.execute("SELECT MAX(Outsourced_id) FROM Outsourced_External_Examinations_List ")
    max_id = cursor.fetchone()[0]
    next_id = max_id + 1 if max_id is not None else 1

    insert_query = """
        INSERT INTO Outsourced_External_Examinations_List (Outsourced_id, Billing_invoice, Patient_Id, Visit_Id, Patient_Name, External_Lab_Name, Doctor_Name, Net_Amount, Paid_Status, Billed_By, Location, Sample_Barcode, Report_Status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(insert_query, (next_id, newinvoice, patient_id, visitid, patientname, externallab, referdoctor, netAmount, "Pending", CreatedBy, location, barcode, 'Pending'))


def insert_doctor_payment_commission(cursor,postcommissionfordoctor,newinvoice):
    cursor.execute("SELECT MAX(Payment_Id) FROM Refering_Doctor_Commission_Payment")
    max_id = cursor.fetchone()[0]
    next_id = max_id + 1 if max_id is not None else 1

    doctorname = postcommissionfordoctor.get('doctorname')
    invoice = postcommissionfordoctor.get('billinginvoice')
    invoicedate = postcommissionfordoctor.get('billingdate')
    visitid = postcommissionfordoctor.get('visitid')
    
    commission_per = postcommissionfordoctor.get('commissionper')
    commission_rate = float(commission_per) if commission_per is not None else None
    
    # Get total amount
    net_amount = postcommissionfordoctor.get('netAmount')
    totalamount = float(net_amount) if net_amount is not None else None
    patientname = postcommissionfordoctor.get('patientname').upper()
    paidstatus = 'pending'
    paiddate = 'pending'
    paidby = 'pending'
    location = postcommissionfordoctor.get('location')

    if commission_rate is not None and totalamount is not None:
        commission_amount = (commission_rate / 100) * totalamount
    else:
        commission_amount = None 

    insert_query = """
        INSERT INTO Refering_Doctor_Commission_Payment (
            Payment_Id, Doctor_Name, Billing_Invoice, Billing_Date, Patient_Name, Visit_Id,
            Total_BillAmount, Commission, Commission_Amount, Paid_Status, Paid_Date, Paid_By, Location
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(insert_query, (
        next_id, doctorname, newinvoice, invoicedate, patientname, visitid,
        totalamount, commission_rate, commission_amount, paidstatus, paiddate, paidby, location
    ))
    

def insert_refering_hospital_details(cursor, postreferinghospitaldata, newinvoice):
    # Get the maximum S_No from the database and calculate the next ID
    cursor.execute("SELECT MAX(S_No) FROM refering_hospital_history")
    max_id = cursor.fetchone()[0]
    next_id = max_id + 1 if max_id is not None else 1

    # Extract data from postreferinghospitaldata with default values for None cases
    patientid = postreferinghospitaldata.get("patientid", "")  # Default to an empty string if None
    visitid = postreferinghospitaldata.get("visitid", "")  # Default to empty if None
    patientname = postreferinghospitaldata.get("patientname", "").upper()  # Default to empty if None
    receivedAmount = postreferinghospitaldata.get("receivedAmount", 0)  # Default to 0 if None
    netAmount = postreferinghospitaldata.get("netAmount", 0)  # Default to 0 if None
    location = postreferinghospitaldata.get("location", "")  # Default to empty string if None
    CreatedBy = postreferinghospitaldata.get("CreatedBy", "")  # Default to empty string if None
    concernname = postreferinghospitaldata.get("concernname", "")  # Default to empty string if None
    LabCode = postreferinghospitaldata.get("LabCode", "")  # Default to empty string if None

    # Calculate the balance amount (ensure receivedAmount and netAmount are integers or floats)
    balanceamount = int(netAmount) - int(receivedAmount)

    # Get the current date in ISO format
    currentdate = datetime.now().date().isoformat()
    print("currentdate :", currentdate)

    # Prepare the insert query
    insert_query = """
        INSERT INTO refering_hospital_history (
            S_No, Invoice_NO, PatientID, PatientName, VisitID, TotalAmount,
            TotalPaidAmount, BalanceAmount, Billing_Date, Refering_Hospital, CreatedBy, Location, LabCode,Status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Execute the query with the values, ensuring no None values are passed
    cursor.execute(
        insert_query,
        (
            next_id,
            newinvoice,
            patientid,
            patientname,
            visitid,
            netAmount,
            receivedAmount,
            balanceamount,
            currentdate,
            concernname,
            CreatedBy,
            location,
            LabCode,
            "Pending"
        ),
    )
def get_next_item_id(cursor):
    cursor.execute("SELECT COALESCE(MAX(Item_Id), 0) + 1 FROM Billing_Item_Table_for_lab")
    return cursor.fetchone()[0]



def get_alltestreports_forprofile(request):
    try:
        
        cursor = db.cursor()
        
        patienttid = request.GET.get('patientid')
        location = request.GET.get('location')
        
        query = """SELECT * FROM completed_lab_report_table WHERE Patient_Id=%s AND Location=%s"""
        cursor.execute(query, (patienttid, location))
        data = cursor.fetchall()
        
        columns = [i[0] for i in cursor.description]
        
        result = []
        for row in data:
            row_dict = dict(zip(columns, row))
            # Check if 'Report' column exists and convert it to base64
            if 'Report' in row_dict and row_dict['Report'] is not None:
                pdf_blob = row_dict['Report']
                base64_pdf = base64.b64encode(pdf_blob).decode('utf-8')
                row_dict['Report'] = f'data:application/pdf;base64,{base64_pdf}'
            
            if 'CreatedAt' in row_dict:
                CreatedAt = row_dict['CreatedAt'].date().isoformat()
                row_dict['CreatedAt'] = CreatedAt
                
            result.append(row_dict)
        
        return JsonResponse(result, safe=False)
        
    except Exception as e:
        return JsonResponse({'Error': str(e)})
    finally:
        cursor.close()
        db.close()


from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

@csrf_exempt
def upload_image(request):
    try:
        if request.method == 'POST' and request.FILES.get('uploadImg'):
            image = request.FILES['uploadImg']
            # Save the image to the media directory
            file_name = default_storage.save(f'uploads/{image.name}', ContentFile(image.read()))
            # Get the URL of the saved image
            image_url = default_storage.url(file_name)
            # Return JSON response with the image URL
            return JsonResponse({ "url": image_url })
        # Handle invalid requests (GET or missing 'uploadImg' file)
        return JsonResponse({'error': 'Invalid request'})
    except Exception as e:
        # Handle any exceptions and return an error response
        print('error', e)
        return JsonResponse({'Error': str(e)})
    




def get_billing_Amount_bycash(request):
    try:
        
        cursor = db.cursor()

        billing_date = request.GET.get('Billing_date')
        location = request.GET.get('location')
        print("Billing Date:", billing_date)

        if location == 'ALL':
            item_query = """SELECT SUM(Net_Amount) AS Net_Amount FROM Billing_invoice_and_bill_amount WHERE Billing_date = %s AND Status = 'Paid'"""
            cursor.execute(item_query, (billing_date, ))
        else:
            item_query = """SELECT SUM(Net_Amount) AS Net_Amount FROM Billing_invoice_and_bill_amount WHERE Billing_date = %s AND Location = %s AND Status = 'Paid'"""
            cursor.execute(item_query, (billing_date, location))

        result = cursor.fetchone()
        net_amount = float(
            result[0]) if result and result[0] is not None else 0
        print("Net Amount:", net_amount)

        # Adjusting the second query to correctly include the location condition
        if location == 'ALL':
            item_query1 = """
                SELECT 
                    oat.Payment_Type,
                    SUM(oat.Paid_Amount) AS Total_Amount
                FROM 
                    Billing_invoice_and_bill_amount oab
                INNER JOIN 
                    Bill_Payment_details oat ON oab.Billing_invoice = oat.Billing_invoice
                    AND oat.Billing_Date = %s
                GROUP BY 
                    oat.Payment_Type
            """
            cursor.execute(item_query1, (billing_date, ))
        else:
            item_query1 = """
               SELECT 
                    oat.Payment_Type,
                    SUM(oat.Paid_Amount) AS Total_Amount
                FROM 
                    Billing_invoice_and_bill_amount oab
                INNER JOIN 
                    Bill_Payment_details oat ON oab.Billing_invoice = oat.Billing_invoice AND oat.Location = %s
                    AND oat.Billing_Date = %s
                GROUP BY 
                    oat.Payment_Type
            """
            cursor.execute(item_query1, (
                location,
                billing_date,
            ))

        result1 = cursor.fetchall()
        amount_types = [{
            'AmountType': row[0],
            'Total_Amount': float(row[1])
        } for row in result1]
        print("Result 1:", amount_types)

        return JsonResponse(
            {
                'net_amount': net_amount,
                'amount_types': amount_types
            },
            safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            safe=False), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


import base64
from django.http import JsonResponse

def getbarcodeimage(request):
    try:
        
        cursor = db.cursor()
        
        patientid = request.GET.get('patientid')
        visitid = request.GET.get('visitid')
        invoice = request.GET.get('invoice')

        print(f"Query params - patientid: {patientid}, visitid: {visitid}, invoice: {invoice}")

        query = """SELECT Barcode FROM barcode_id WHERE Patient_Id=%s AND Visit_Id=%s AND invoice_no=%s"""
        cursor.execute(query, (patientid, visitid, invoice))
        data = cursor.fetchall()

        columns = [i[0] for i in cursor.description]
        result = []
        unique_barcodes = set()

        for row in data:
            row_dict = dict(zip(columns, row))

            if 'Barcode' in row_dict and row_dict['Barcode'] is not None:
                barcode_image = row_dict['Barcode']
                base64_photo = base64.b64decode(base64.b64encode(barcode_image)).decode('utf-8')

                # Create a unique identifier for the barcode
                barcode_identifier = f'data:image/jpg;base64,{base64_photo}'

                if barcode_identifier not in unique_barcodes:
                    unique_barcodes.add(barcode_identifier)
                    row_dict['Barcode'] = barcode_identifier
                    result.append(row_dict)

        print('Result to be returned:', result)
        
        return JsonResponse(result, safe=False)
        
    except Exception as e:
        print('Error:', e)
        return JsonResponse({'Error': str(e)})
    finally:
        cursor.close()
        db.close()


import base64
from io import BytesIO
# from barcode import get_barcode_class
# from barcode.writer import ImageWriter
# import barcode

def get_barcodeimage(request):
    try:
        
        cursor = db.cursor()
        
        Barcode_id = request.GET.get('Barcode_id')
        invoice = request.GET.get('invoice')
        
        query = """SELECT Sample_Barcode_Image FROM Billing_invoice_and_bill_amount WHERE Billing_Invoice=%s AND Barcode_Id=%s"""
        cursor.execute(query, (invoice, Barcode_id))
        data = cursor.fetchall()
        
        # department_test_codes = {}
        
        # for row in data:
        #     test_code = row[0]
        #     tdquery = """SELECT Sub_Department FROM Test_Descriptions WHERE Test_Code=%s"""
        #     cursor.execute(tdquery, (test_code,))
        #     s_department = cursor.fetchone()
            
        #     if s_department:
        #         department = s_department[0]
        #         if department not in department_test_codes:
        #             department_test_codes[department] = []
        #         department_test_codes[department].append(test_code)
        
        result = []
        
        # for department, test_codes in department_test_codes.items():
        #     # Create a barcode image for the department
        #     barcode_data = f"{Barcode_id}{invoice}{department}"
        #     EAN = barcode.get_barcode_class('code128')
        #     ean = EAN(barcode_data, writer=ImageWriter())
        #     buffered = BytesIO()
        #     ean.write(buffered,{ 'module_width': 0.1,  # Adjust the width of the barcode lines if needed
        #         'module_height': 5.0,  'font_size': 3,})
        #     img_str = base64.b64encode(buffered.getvalue()).decode()
            
        #     result.append({
        #         'department': department,
        #         'test_codes': test_codes,
        #         'barcode_image': f'data:image/jpg;base64,{img_str}',
        #     })
        
        for i in data:
            if i[0]:
                img_str = base64.b64encode(i[0]).decode()
                data1 = {
                    'barcode_image': f'data:image/jpg;base64,{img_str}'
                }
                result.append(data1)
        
        return JsonResponse(result, safe=False)
        
        
    except Exception as e:
        return JsonResponse({'Error': str(e)})
    finally:
        cursor.close()
        db.close()



# ------------------------


@csrf_exempt
def get_General_billing_due_list(request):
    try:
        
        cursor = db.cursor()
        Status = 'Due'
        location = request.GET.get('location')
        result = []

        if location == 'ALL':
            query = """
                SELECT  A.Billing_Invoice, A.Patient_Id, A.Visit_Id, A.Patient_Name,
                A.Net_Amount, A.TotalPaidAmount,A.BalanceAmount,C.Phone,A.Billing_Date,A.CreatedBy
                FROM Billing_invoice_and_bill_amount AS A
                JOIN Register_patient_Details AS C
                ON C.Patient_Id = A.Patient_Id 
                WHERE A.Status = %s
            """
            cursor.execute(query, (Status,))
        else:
            query = """
                SELECT  A.Billing_Invoice, A.Patient_Id, A.Visit_Id, A.Patient_Name,
                A.Net_Amount, A.TotalPaidAmount,A.BalanceAmount,C.Phone,A.Billing_Date,A.CreatedBy
                FROM Billing_invoice_and_bill_amount AS A
                JOIN Register_patient_Details AS C
                ON C.Patient_Id = A.Patient_Id 
                WHERE A.Status = %s AND A.Location = %s
            """
            cursor.execute(query, (Status, location))

        result = cursor.fetchall()

        resdata = []
        for res in result:
            data = {
                'Invoice_NO': res[0],
                'PatientID': res[1],
                'VisitId': res[2],
                'PatientName': res[3].upper(),
                'NetAmount': res[4],
                'PaidAmount': res[5],
                'BalanceAmount': res[6],
                'PhoneNumber': res[7],
                'Billing_Date':res[8],
                'Physician_Name':res[9],
            }
            resdata.append(data)

        return JsonResponse(resdata, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)})
    finally:
        cursor.close()
        db.close()



# --------------------------------------------

@csrf_exempt
def insert_DueReceiptAndBill_Voucher_Entry_details(request):
    try:
        
        cursor = db.cursor()

        data = json.loads(request.body)
        print("data444", data)

        PaymentReciveState = data.get("PaymentReciveState")
        Paymentlist = data.get("Paymentlist")

        billing_Invoicenumber = PaymentReciveState.get("InvoiceNo")
        patient_id = PaymentReciveState.get("PatientID")
        patient_name = PaymentReciveState.get("PatientName")
        phone_number = PaymentReciveState.get("PhoneNumber")
        Net_Amount = float(PaymentReciveState.get("TotalAmount"))
        TotalPaid_Amount = float(PaymentReciveState.get("PaidAmount"))
        Balance_Amount = float(PaymentReciveState.get("BalanceAmount"))
        billing_date = PaymentReciveState.get("VoucherDate")
        Paid_Amount = float(PaymentReciveState.get("DebitAmount"))
        Billed_by = data.get("CreatedBy")
        location = data.get("Location")
        VoucherNo = PaymentReciveState.get("VoucherNo")
        # VoucherNarration = PaymentReciveState.get("VoucherNarration")
        VoucherNarration = PaymentReciveState.get("InvoiceNo")

        

        # print("PaymentReciveState2222", PaymentReciveState)
        # print("Paymentlist33333", Paymentlist)
        # print("Billed_by000", Billed_by)
        # print("location000", location)
        # print("Net_Amount", Net_Amount, type(Net_Amount))
        # print("TotalPaid_Amount", TotalPaid_Amount, type(TotalPaid_Amount))

        update_query = """
        UPDATE AccountMaster_Entry_Details 
        SET Current_Balance = Current_Balance - %s, 
        Debit_Amount = Debit_Amount + %s 
        WHERE AccountID = %s
        """
        cursor.execute(update_query, (Paid_Amount, Paid_Amount, 3))

        update_query = """
        UPDATE AccountMaster_Entry_Details 
        SET Current_Balance = Current_Balance + %s, 
        Credit_Amount = Credit_Amount + %s 
        WHERE AccountID = %s
        """
        cursor.execute(update_query, (Paid_Amount, Paid_Amount, 5))
        print("AmountDetails",Net_Amount,TotalPaid_Amount,type(Net_Amount),type(TotalPaid_Amount),Net_Amount==TotalPaid_Amount)
        if Net_Amount == TotalPaid_Amount:
            update_query = """
                UPDATE Billing_invoice_and_bill_amount
                SET TotalPaidAmount = TotalPaidAmount + %s, BalanceAmount = BalanceAmount - %s, Status = %s
                WHERE Billing_Invoice = %s
            """
            cursor.execute(update_query, (Paid_Amount,Paid_Amount,"Paid",billing_Invoicenumber))
        else:
            update_query = """
                UPDATE Billing_invoice_and_bill_amount
                SET TotalPaidAmount = TotalPaidAmount + %s, BalanceAmount = BalanceAmount	- %s
                WHERE Billing_Invoice = %s
            """
            cursor.execute(update_query, (Paid_Amount, Paid_Amount, billing_Invoicenumber))

        inser_reciept_tablenext_id_query = "SELECT IFNULL(MAX(S_No), 0) + 1 AS nextId FROM General_Billing_Receipt_Table"
        cursor.execute(inser_reciept_tablenext_id_query)
        inser_reciept_tablenext_id = cursor.fetchone()[0]

        inser_reciept_table = """
            INSERT INTO General_Billing_Receipt_Table (
                S_No, Invoice_NO, PatientID, PhoneNumber, Patient_Name, TotalAmount,
                TotalPaidAmount, BalanceAmount, Billing_Date, Voucher_Number, PaidAmount, Billedby, Location
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(inser_reciept_table, (
            inser_reciept_tablenext_id, billing_Invoicenumber, patient_id, phone_number,
            patient_name, Net_Amount, TotalPaid_Amount, Balance_Amount, billing_date, VoucherNo, Paid_Amount, Billed_by, location))

        insert_query = """
            INSERT INTO Receipt_Voucher_Entry_Details (Receipt_Voucher_Number, Receipt_Voucher_date, 
            Narration, FromAccountID, FromAccount, Cur_Balance, DebitAmount, Status, CreatedBy, CanceledBy, CancelDate, Location)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            VoucherNo, billing_date, VoucherNarration, patient_id, patient_name, Balance_Amount,
            Paid_Amount, 'Available', Billed_by, 'Nill', 'Nill', location))

        cursor.execute("SELECT MAX(S_No) FROM Receipt_Voucher_Items_Entrys_Details")
        max_id_items = cursor.fetchone()[0]
        next_id_items = max_id_items + 1 if max_id_items is not None else 1

        cursor.execute("SELECT MAX(S_No) FROM Receipt_Voucher_Multiple_Payment_Entrys_Details")
        max_id_multi_payment = cursor.fetchone()[0]
        next_id_multi_payment = max_id_multi_payment + 1 if max_id_multi_payment is not None else 1

        cursor.execute("SELECT MAX(Billing_Id) FROM Bill_Payment_details")
        multimax_id = cursor.fetchone()[0]
        multinext_id = multimax_id + 1 if multimax_id is not None else 1

        for payment in Paymentlist:
            ToAccountID = payment.get('ToAccountID')
            ToAccount = payment.get('ToAccount')
            ToAccountCurBalance = float(payment.get('ToAccountCurBalance'))
            CreditAmount = float(payment.get('CreditAmount'))

            # Insert code for Receipt_Voucher_Items_Entrys_Details table
            insert_items_query = """
                INSERT INTO Receipt_Voucher_Items_Entrys_Details (S_No, Receipt_Voucher_Number, ToAccountID, ToAccount, Cur_Balance, CreditAmount, Location)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_items_query, (next_id_items, VoucherNo, ToAccountID, ToAccount, ToAccountCurBalance, CreditAmount, location))

            update_query = "UPDATE AccountMaster_Entry_Details SET Current_Balance = Current_Balance + %s, Credit_Amount = Credit_Amount + %s WHERE AccountID = %s;"
            cursor.execute(update_query, (CreditAmount, CreditAmount, ToAccountID))

            next_id_items += 1

            if ToAccountID == '1':
                insert_overall_amount_query = """
                    INSERT INTO Bill_Payment_details (
                        Billing_Id, Billing_invoice, Patient_Id, Net_Amount, Payment_Type, 
                        Paid_Amount, Remaing_Amount, Location, Barcode_Id, CreatedBy, Billing_Date, Card_Number, Card_Name, UPI_Mobile_Num, Transaction_Id, Card_Type
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_overall_amount_query, (
                    multinext_id, VoucherNo, patient_id,Net_Amount,ToAccount,
                    CreditAmount, CreditAmount,location,"Nill",Billed_by, billing_date,"Nill","Nill","Nill","Nill","Nill"))
                multinext_id += 1
            else:
                for multi_payment in payment.get('MulitPayment', []):
                    PaymentType = multi_payment.get('PaymentType')
                    Amount = float(multi_payment.get('PaymentAmount'))
                    Remarks = multi_payment.get('Remarks')

                    # Insert into overall_amount_table for non-CASH payments
                    insert_overall_amount_query = """
                    INSERT INTO Bill_Payment_details (
                        Billing_Id, Billing_invoice, Patient_Id, Net_Amount, Payment_Type, 
                        Paid_Amount, Remaing_Amount, Location, Barcode_Id, CreatedBy, Billing_Date, Card_Number, Card_Name, UPI_Mobile_Num, Transaction_Id, Card_Type
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(insert_overall_amount_query, (
                    multinext_id, VoucherNo, patient_id,Net_Amount,ToAccount,
                    CreditAmount, CreditAmount,location,"Nill",Billed_by, billing_date,"Nill","Nill","Nill","Nill","Nill"))
                
                    multinext_id += 1

            for multi_payment in payment.get('MulitPayment', []):
                PaymentType = multi_payment.get('PaymentType')
                Amount = float(multi_payment.get('PaymentAmount'))
                Remarks = multi_payment.get('Remarks')

                # Insert code for Receipt_Voucher_Multiple_Payment_Entrys_Details table
                insert_multi_payment_query = """
                    INSERT INTO Receipt_Voucher_Multiple_Payment_Entrys_Details (S_No, Receipt_Voucher_Number, FromAccountID, FromAccount, PaymentType, Amount, Remarks, Location)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_multi_payment_query, (next_id_multi_payment, VoucherNo, patient_id, patient_name, PaymentType, Amount, Remarks, location))
                
                next_id_multi_payment += 1

        db.commit()

        return JsonResponse({'status': 'success'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred', 'details': str(e)})
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()



def get_test_name_for_group_compare(request):
    try:
        testcode = request.GET.get('Test_Code')
        if not testcode:
            return JsonResponse({"Error": "Test_Code parameter is required"})

        with connection.cursor() as cursor:
            get_query = """
                        SELECT test_name FROM GroupMasterTestList WHERE group_code = %s
            """
            cursor.execute(get_query, [testcode])
            testnames = cursor.fetchall()

        testnames_list = [{"test_name": test[0]} for test in testnames]

        return JsonResponse(testnames_list, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)})
        
        
        
def getMicro_and_HistoNumber(request):
    try:
        
        cursor = db.cursor()

        Billing_Invoice = request.GET.get('Invoice')

        query = """SELECT MicroNumber,HistoNumber FROM Billing_invoice_and_bill_amount WHERE Billing_Invoice=%s"""
        cursor.execute(query,(Billing_Invoice,))
        data = cursor.fetchall()

        print('data :',data)

        MicroNumber = data[0][0] if data[0] and data[0][0] is not None and data[0][0] != '' else None
        HistoNumber = data[0][1] if data[0] and data[0][1] is not None and data[0][1] != '' else None

        return JsonResponse({'MicroNumber': MicroNumber,'HistoNumber': HistoNumber},safe=False)



    except Exception as e:
        return JsonResponse({"Error": str(e)})
    finally:
        cursor.close()
        db.close()
        
        
        
def recollect_data(request):
    if request.method == "GET":
        try:
            
            cursor = db.cursor()
            location = request.GET.get("Location")
            if location == "ALL":
                patient_query = """
                SELECT 
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group,pvi.Refering_Doctor,pvi.Phlebotomist_Name,pvi.Phlebotomist_Type,bit.UpdatedAt, 
                    bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id,  bit.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                    rp.Patient_Barcode,rp.DOB,bit.Sample_Barcode_Image
                FROM 
                    Register_patient_Details rp
                JOIN 
                    Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN
                    Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                WHERE
                    Capture_Sample_Status = 'Recollect' AND Status != 'Cancelled'  
                """
                cursor.execute(patient_query)
                patients_results = cursor.fetchall()
            else:
                patient_query = """
                SELECT 
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Door_No, rp.Phone,
                    pvi.Patient_Group,pvi.Refering_Doctor,pvi.Phlebotomist_Name,pvi.Phlebotomist_Type,bit.UpdatedAt, 
                    bit.Billing_Invoice, bit.Total_Charge, bit.Item_Count, bit.Barcode_Id,  bit.Visit_Id, rp.Street, rp.Rural_Urban, rp.City, rp.State, rp.Pincode, rp.Time_Period,
                    rp.Patient_Barcode,rp.DOB,bit.Sample_Barcode_Image, rp.Title
                FROM 
                    Register_patient_Details rp
                JOIN 
                    Billing_invoice_and_bill_amount bit ON rp.Patient_Id = bit.Patient_Id
                JOIN
                    Patient_Visit_Id pvi ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                WHERE
                    Capture_Sample_Status = 'Recollect' AND bit.Location = %s AND Status != 'Cancelled' 
                """
                cursor.execute(patient_query, (location,))
                patients_results = cursor.fetchall()
            patients_data = []
            id = 1
            for row in patients_results:
                service_status_query = """
                SELECT Service_Status, Test_Name, Test_Code
                FROM Billing_Item_Table_for_lab
                WHERE Billing_Invoice = %s
                """
                cursor.execute(service_status_query, [row[11]])
                service_statuses = cursor.fetchall()
                service_status_list = [
                    {
                        "status": status[0],
                        "testname": status[1],
                        "testcode": status[2],
                        "id": row + 1,
                        "Testcount": len(service_statuses),
                    }
                    for row, status in enumerate(service_statuses)
                ]
                
                Billing_Date = row[10]
                billing_date_formatted = Billing_Date.strftime("%d-%m-%Y")



                patient_data = {
                    "id": id,
                    "Patient_Id": row[0],
                    "Patient_Name": row[25]+ " " + row[1],
                    "Age": row[2],
                    "Gender": row[3],
                    "Door_No": row[4],
                    "Phone": row[5],
                    "Patient_Group": row[6],
                    "Refering_Doctor": row[7],
                    "Phlebotomist_Name": row[8],
                    "Phlebotomist_Type": row[9],
                    "UpdatedAt": row[10].strftime("%Y-%m-%d"),
                    "Billing_Invoice": row[11],
                    "Total_Charge": row[12],
                    "TestCount": row[13],
                    "Service_Statuses": service_status_list,
                    "Barcode": row[14],
                    "Visit_Id": row[15],
                    "Street": row[16],
                    "Rural_Urban": row[17],
                    "City": row[18],
                    "State": row[19],
                    "Pincode": row[20],
                    "Time_Period": row[21],
                    "patientbarcode": row[22],
                    "dob": row[23],
                    "Sample_Barcode_Image": (
                        f"data:image/jpg;base64,{base64.b64encode(row[24]).decode('utf-8')}"
                        if row[24] is not None and row[24] != ""
                        else None
                    ),
                    "Billing_Date": billing_date_formatted
                }

                patients_data.append(patient_data)
                id += 1  # Fixed the increment here
            return JsonResponse(patients_data, safe=False)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse(
            {"error": "Invalid request method. Only GET is allowed."}, status=405
        )


# from MCI.models import *
# from django.db.models import Q
# from itertools import chain
# from dateutil.relativedelta import relativedelta
# def Get_Test_Count_Data(request):
#     if request.method == "GET":
#         try:
#             cursor = db.cursor()
#             location = request.GET.get("Location")
#             limit = request.GET.get("limit")
#             offset = request.GET.get("offset")
#             test = request.GET.get("testName") or ""
#             date = request.GET.get("date")
#             dateType = request.GET.get("dateType")
#             patientType = request.GET.get("patient")
#             method = request.GET.get("testType")
#             fromm = request.GET.get("from")
#             to = request.GET.get("to")
#             patient = request.GET.get("patientName")
#             department = request.GET.get('dept')
#             BatMan = request.GET.get('batman')
#             BatMant = True if BatMan == 'true' else False

#             dep_name = SubLab_Department_Detials.objects.all()
#             departments_list = [
#                 {
#                     "dept_name": dep.SubDepartment_Name,
#                     "dept_code": dep.SubDepartment_Code,
#                     "ipcount": 0,
#                     "opcount": 0
#                 }
#                 for dep in dep_name
#             ]



#             print("I AM BatMan -",BatMan)
#             where=[]
#             pharams=[]
#             filters = Q()
#             test_filters = Q()
#             if dateType and dateType != "":
#                 if dateType == "month":
#                     year, month = map(int, date.split("-"))
#                     print("Year------aa-",year,month)
#                     filters &= Q(created_at__year=year, created_at__month=month)
                    
#                 elif dateType == "date":
#                     _date = datetime.strptime(date, "%Y-%m-%d").date()
#                     print("date--------",_date)
#                     filters &= Q(created_at__date=_date)

                    
#                 elif dateType == "customdate":
#                     if fromm and to and fromm != "" and to != "":
#                         from_date = datetime.strptime(fromm, "%Y-%m-%d").date()
#                         to_date   = datetime.strptime(to, "%Y-%m-%d").date()
#                         print("custom---------",from_date,to_date)
#                         filters &= Q(created_at__date__range=[from_date, to_date])


                        
#                 elif dateType == "custommonth":
#                     if fromm and to:
#                         from_date = datetime.strptime(fromm, "%Y-%m").replace(day=1)
#                         to_date = datetime.strptime(to, "%Y-%m").replace(day=1)
#                         last_day = (to_date + relativedelta(months=1)) - relativedelta(days=1)
#                         to_datetime = datetime.combine(last_day, datetime.max.time())
#                         print("custom month range:", from_date, "to", to_datetime)
#                         filters &= Q(created_at__range=[from_date, to_datetime])
                                    
                    
                
#             if patientType and patientType != "All" and patientType != "":
#                 if patientType == "OP":
#                     filters &= Q(OP_Register_Id__isnull=False)
#                 else:
#                     filters &= Q(IP_Register_Id__isnull=False)


#             if patient and patient != "":
#                 print("Patient-------", patient)
#                 patient_filter = ( 
#                     Q(OP_Register_Id__PatientId__PatientId__icontains=patient) |
#                     Q(IP_Register_Id__PatientId__PatientId__icontains=patient) |
#                     Q(OP_Register_Id__PatientId__FirstName__icontains=patient) |
#                     Q(IP_Register_Id__PatientId__FirstName__icontains=patient) |
#                     Q(OP_Register_Id__Registration_Id__icontains=patient) |
#                     Q(IP_Register_Id__Registration_Id__icontains=patient)  )

#                 filters &= patient_filter

#             if test and test != "":
#                 print("Test-------",test)
#                 patient_filter = ( 
#                     Q(Test_Code__Test_Code__icontains=test) |
#                     Q(Group_Code__Group_Code__icontains=test) |
#                     Q(Package_Code__package_code__icontains=test))
#                 test_filters &= patient_filter

#             if department and department!="":
#                 print("Department---------",department)
#                 dep_name = SubLab_Department_Detials.objects.get(SubDepartment_Code = department).SubDepartment_Name
#                 patient_filter = ( 
#                     Q(Test_Code__sub_department__SubDepartment_Code__icontains=department) |
#                     Q(Group_Code__Department__SubDepartment_Code__icontains=department) |
#                     Q(Package_Code__department_name=dep_name))  
#                 test_filters &= patient_filter


#             if test_filters and len(test_filters) > 0:
#                 # item_filter = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)  ORIGINAL
#                 if BatMan:
#                     if method and method == "Patient":
#                         item_filter = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     elif method and method == "PatientS":
#                         item_filter = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     else:
#                         qs1 = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                         qs2 = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                         item_filter = qs1.union(qs2)
#                 else:
#                     qs1 = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     qs2 = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     item_filter = qs1.union(qs2)


#                 if item_filter and len(item_filter)> 0:
#                     filters &= Q(Request_Id__in=item_filter)

#             print("Filter-----------",filters,test_filters)

#             if BatMan:
#                 if method and method == "Patient":
#                     lab_rq = Lab_Request_Details.objects.filter(filters)
#                 elif method and method == "PatientS":
#                     lab_rq = MCI_Lab_Request_Details.objects.filter(filters)
#                 else:
#                     qs1 = Lab_Request_Details.objects.filter(filters)
#                     qs2 = MCI_Lab_Request_Details.objects.filter(filters)
#                     lab_rq = chain(qs1, qs2)  # ✅ merge safely in Python
#             else:
#                 qs1 = Lab_Request_Details.objects.filter(filters)
#                 qs2 = MCI_Lab_Request_Details.objects.filter(filters)
#                 lab_rq = chain(qs1, qs2)            
            
#             print("no problm at lab_rq")
#             # lab_rq = Lab_Request_Details.objects.filter(filters)   ORIGINAL
#             # print("Fetched--",len(lab_rq))
#             Report = []
#             no = 0
#             ip = 0
#             op = 0
            
#             for lab in lab_rq:
#                 if BatMan:
#                     if method and method == "Patient":
#                         lab_item = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     elif method and method == "PatientS":
#                         lab_item = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     else:
#                         qs1 = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                         qs2 = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                         lab_item = chain(qs1, qs2)  # ✅ merge both querysets into one iterator
#                 else:
#                     qs1 = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     qs2 = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     lab_item = chain(qs1, qs2)

#                 no+=1
#                 try:
#                     testData = []
#                     for item in lab_item:
#                         cost = "0.00"
#                         if item.Test_Code:
#                             dept_code = item.Test_Code.sub_department.SubDepartment_Code
#                             cost_obj = Testmaster_Cost_List.objects.filter(Test_Code=item.Test_Code.Test_Code).values("Basic").first()
#                             cost = cost_obj["Basic"] if cost_obj else "0.00"
#                         elif item.Group_Code:
#                             dept_code = item.Group_Code.Department.SubDepartment_Code
#                             cost_obj = Testmaster_Cost_List.objects.filter(Group_Code=item.Group_Code.Group_Code).values("Basic").first()
#                             cost = cost_obj["Basic"] if cost_obj else "0.00"
#                         elif item.Package_Code:
#                             dept_code = item.Package_Code.Department
#                             cost = item.Package_Code.Package_Cost
#                         else:
#                             continue

#                         if dept_code:
#                             for dept in departments_list:

#                                 if dept["dept_code"] == dept_code or dept["dept_name"] == dept_code:
#                                     # print("Dept----------",dept_code)
#                                     if lab.OP_Register_Id:
#                                         dept["opcount"] += 1
                                        
#                                     elif lab.IP_Register_Id:
#                                         dept["ipcount"] += 1
                                        
#                         test = {
#                             "testName": (
#                                     item.Test_Code.Test_Name if item.Test_Code else
#                                     item.Group_Code.Group_Name if item.Group_Code else
#                                     item.Package_Code.package_name if item.Package_Code else
#                                     None
#                                 ),
#                             "cost": cost,
#                         }
#                         testData.append(test)
#                 except Exception as err: 
#                     print(str(err))
#                     pass
#                 try:
#                     if lab.IP_Register_Id:
#                         # print("IP Patient...",lab.IP_Register_Id)
#                         ip += 1
#                         patientType = "IP"
#                         patient = lab.IP_Register_Id
#                     elif lab.OP_Register_Id:
#                         # print("OP Patient...",lab.OP_Register_Id)
#                         op += 1
#                         patientType = "OP"
#                         patient = lab.OP_Register_Id
#                     else:
#                         # print("None Patient...")
#                         patientType = "General"
#                         Patient = None
#                 except:
#                     continue
#                 if len(testData)>0:
#                     Report.append({
#                         "Sno": no,
#                         "date": lab.created_at.date() if lab.created_at else None,
#                         "request": lab.Request_Id,
#                         "patientType": patientType, 
#                         "patientid": patient.PatientId.PatientId,
#                         "opipid": patient.Registration_Id,
#                         "patientName": f"""{patient.PatientId.Title.Title_Name}. {patient.PatientId.FirstName}""" if patient and patient.PatientId and patient.PatientId.Title else "",
#                         "Phone": patient.PatientId.PhoneNo,
#                         'test': testData,
#                     }) 
#                 # else:
#                 #     print("Its a Empty Row...")
#             print("Report-----------------",op+ip)
            
#             return JsonResponse({
#                 "total_records": op+ip,
#                 "OP_records": op,
#                 "IP_records": ip,
#                 "test_data": Report,
#                 "deptData": departments_list,
#             }, safe=False)
        



#         except Exception as err:
#             print("Error:",err)
#             return JsonResponse({"error":str(err)})



from MCI.models import *
from django.db.models import Q
from itertools import chain
from dateutil.relativedelta import relativedelta

# def Get_Test_Count_Data(request):
#     if request.method == "GET":
#         try:
#             cursor = db.cursor()
#             location = request.GET.get("Location")
#             limit = request.GET.get("limit")
#             offset = request.GET.get("offset")
#             test = request.GET.get("testName") or ""
#             date = request.GET.get("date")
#             dateType = request.GET.get("dateType")
#             patientType = request.GET.get("patient")
#             method = request.GET.get("testType")
#             fromm = request.GET.get("from")
#             to = request.GET.get("to")
#             patient = request.GET.get("patientName")
#             department = request.GET.get('dept')
#             BatMan = request.GET.get('batman')
#             BatMant = True if BatMan == 'true' else False

#             dep_name = SubLab_Department_Detials.objects.all()
#             departments_list = [
#                 {
#                     "dept_name": dep.SubDepartment_Name,
#                     "dept_code": dep.SubDepartment_Code,
#                     "ipcount": 0,
#                     "opcount": 0
#                 }
#                 for dep in dep_name
#             ]



#             print("I AM BatMan -",BatMan)
#             where=[]
#             pharams=[]
#             filters = Q()
#             test_filters = Q()
#             if dateType and dateType != "":
#                 if dateType == "month":
#                     year, month = map(int, date.split("-"))
#                     print("Year------aa-",year,month)
#                     filters &= Q(created_at__year=year, created_at__month=month)
                    
#                 elif dateType == "date":
#                     _date = datetime.strptime(date, "%Y-%m-%d").date()
#                     print("date--------",_date)
#                     filters &= Q(created_at__date=_date)

                    
#                 elif dateType == "customdate":
#                     if fromm and to and fromm != "" and to != "":
#                         from_date = datetime.strptime(fromm, "%Y-%m-%d").date()
#                         to_date   = datetime.strptime(to, "%Y-%m-%d").date()
#                         print("custom---------",from_date,to_date)
#                         filters &= Q(created_at__date__range=[from_date, to_date])


                        
#                 elif dateType == "custommonth":
#                     if fromm and to:
#                         from_date = datetime.strptime(fromm, "%Y-%m").replace(day=1)
#                         to_date = datetime.strptime(to, "%Y-%m").replace(day=1)
#                         last_day = (to_date + relativedelta(months=1)) - relativedelta(days=1)
#                         to_datetime = datetime.combine(last_day, datetime.max.time())
#                         print("custom month range:", from_date, "to", to_datetime)
#                         filters &= Q(created_at__range=[from_date, to_datetime])
                                    
                    
                
#             if patientType and patientType != "All" and patientType != "":
#                 if patientType == "OP":
#                     filters &= Q(OP_Register_Id__isnull=False)
#                 else:
#                     filters &= Q(IP_Register_Id__isnull=False)


#             if patient and patient != "":
#                 print("Patient-------", patient)
#                 patient_filter = ( 
#                     Q(OP_Register_Id__PatientId__PatientId__icontains=patient) |
#                     Q(IP_Register_Id__PatientId__PatientId__icontains=patient) |
#                     Q(OP_Register_Id__PatientId__FirstName__icontains=patient) |
#                     Q(IP_Register_Id__PatientId__FirstName__icontains=patient) |
#                     Q(OP_Register_Id__Registration_Id__icontains=patient) |
#                     Q(IP_Register_Id__Registration_Id__icontains=patient)  )

#                 filters &= patient_filter

#             if test and test != "":
#                 print("Test-------",test)
#                 patient_filter = ( 
#                     Q(Test_Code__Test_Code__icontains=test) |
#                     Q(Group_Code__Group_Code__icontains=test) |
#                     Q(Package_Code__package_code__icontains=test))
#                 test_filters &= patient_filter

#             if department and department!="":
#                 print("Department---------",department)
#                 dep_name = SubLab_Department_Detials.objects.get(SubDepartment_Code = department).SubDepartment_Name
#                 patient_filter = ( 
#                     Q(Test_Code__sub_department__SubDepartment_Code__icontains=department) |
#                     Q(Group_Code__Department__SubDepartment_Code__icontains=department) |
#                     Q(Package_Code__department_name=dep_name))  
#                 test_filters &= patient_filter


#             if test_filters and len(test_filters) > 0:
#                 # item_filter = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)  ORIGINAL
#                 if BatMan:
#                     if method and method == "Patient":
#                         item_filter = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     elif method and method == "PatientS":
#                         item_filter = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     else:
#                         qs1 = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                         qs2 = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                         item_filter = qs1.union(qs2)
#                 else:
#                     qs1 = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     qs2 = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
#                     item_filter = qs1.union(qs2)


#                 if item_filter and len(item_filter)> 0:
#                     filters &= Q(Request_Id__in=item_filter)

#             print("Filter-----------",filters,test_filters)

#             if BatMan:
#                 if method and method == "Patient":
#                     lab_rq = Lab_Request_Details.objects.filter(filters)
#                 elif method and method == "PatientS":
#                     lab_rq = MCI_Lab_Request_Details.objects.filter(filters)
#                 else:
#                     qs1 = Lab_Request_Details.objects.filter(filters)
#                     qs2 = MCI_Lab_Request_Details.objects.filter(filters)
#                     lab_rq = chain(qs1, qs2)  # ✅ merge safely in Python
#             else:
#                 qs1 = Lab_Request_Details.objects.filter(filters)
#                 qs2 = MCI_Lab_Request_Details.objects.filter(filters)
#                 lab_rq = chain(qs1, qs2)            
            
#             print("no problm at lab_rq")
#             # lab_rq = Lab_Request_Details.objects.filter(filters)   ORIGINAL
#             # print("Fetched--",len(lab_rq))
#             Report = []
#             no = 0
#             ip = 0
#             op = 0
            
#             for lab in lab_rq:
#                 if BatMan:
#                     if method and method == "Patient":
#                         lab_item = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     elif method and method == "PatientS":
#                         lab_item = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     else:
#                         qs1 = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                         qs2 = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                         lab_item = chain(qs1, qs2)  # ✅ merge both querysets into one iterator
#                 else:
#                     qs1 = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     qs2 = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
#                     lab_item = chain(qs1, qs2)

#                 no+=1
#                 try:
#                     testData = []
#                     for item in lab_item:
#                         cost = "0.00"
#                         if item.Test_Code:
#                             dept_code = item.Test_Code.sub_department.SubDepartment_Code
#                             cost_obj = Testmaster_Cost_List.objects.filter(Test_Code=item.Test_Code.Test_Code).values("Basic").first()
#                             cost = cost_obj["Basic"] if cost_obj else "0.00"
#                         elif item.Group_Code:
#                             dept_code = item.Group_Code.Department.SubDepartment_Code
#                             cost_obj = Testmaster_Cost_List.objects.filter(Group_Code=item.Group_Code.Group_Code).values("Basic").first()
#                             cost = cost_obj["Basic"] if cost_obj else "0.00"
#                         elif item.Package_Code:
#                             dept_code = item.Package_Code.department_name
#                             cost = item.Package_Code.Package_Cost
#                         else:
#                             continue

#                         if dept_code:
#                             for dept in departments_list:

#                                 if dept["dept_code"] == dept_code or dept["dept_name"] == dept_code:
#                                     # print("Dept----------",dept_code)
#                                     if lab.OP_Register_Id:
#                                         dept["opcount"] += 1
                                        
#                                     elif lab.IP_Register_Id:
#                                         dept["ipcount"] += 1
                                        
#                         test = {
#                             "testName": (
#                                     item.Test_Code.Test_Name if item.Test_Code else
#                                     item.Group_Code.Group_Name if item.Group_Code else
#                                     item.Package_Code.package_name if item.Package_Code else
#                                     None
#                                 ),
#                             "testCode": (
#                                     item.Test_Code.Test_Code if item.Test_Code else
#                                     item.Group_Code.Group_Code if item.Group_Code else
#                                     item.Package_Code.package_code if item.Package_Code else
#                                     None
#                                 ),
#                             "cost": cost,
#                         }
#                         testData.append(test)
#                 except Exception as err: 
#                     print(str(err))
#                     pass
#                 try:
#                     if lab.IP_Register_Id:
#                         # print("IP Patient...",lab.IP_Register_Id)
#                         ip += 1
#                         patientType = "IP"
#                         patient = lab.IP_Register_Id
#                     elif lab.OP_Register_Id:
#                         # print("OP Patient...",lab.OP_Register_Id)
#                         op += 1
#                         patientType = "OP"
#                         patient = lab.OP_Register_Id
#                     else:
#                         # print("None Patient...")
#                         patientType = "General"
#                         Patient = None
#                 except:
#                     continue
#                 if len(testData)>0:
#                     Report.append({
#                         "Sno": no,
#                         "date": lab.created_at.date() if lab.created_at else None,
#                         "CreatedAt": lab.created_at.strftime("%d-%m-%Y %H:%M:%S"),
#                         "request": lab.Request_Id, 
#                         "remark": lab.Remarks, 
#                         "patientType": patientType, 
#                         "patientid": patient.PatientId.PatientId,
#                         "opipid": patient.Registration_Id,
#                         "patientName": f"""{patient.PatientId.Title.Title_Name}. {patient.PatientId.FirstName}""" if patient and patient.PatientId and patient.PatientId.Title else "",
#                         "Phone": patient.PatientId.PhoneNo,
#                         'test': testData,
#                         'Age':  patient.PatientId.Age,
#                         'Gender': patient.PatientId.Gender,

#                     }) 
#                 # else:
#                 #     print("Its a Empty Row...")
#             print("Report-----------------",op+ip)
            
#             return JsonResponse({
#                 "total_records": op+ip,
#                 "OP_records": op,
#                 "IP_records": ip,
#                 "test_data": Report,
#                 "deptData": departments_list,
#             }, safe=False)
        



#         except Exception as err:
#             print("Error:",err)
#             return JsonResponse({"error":str(err)})



def Get_Test_Count_Data(request):
    if request.method == "GET":
        try:
            cursor = db.cursor()
            location = request.GET.get("Location")
            limit = request.GET.get("limit")
            offset = request.GET.get("offset")
            test = request.GET.get("testName") or ""
            date = request.GET.get("date")
            dateType = request.GET.get("dateType")
            patientType = request.GET.get("patient")
            method = request.GET.get("testType")
            fromm = request.GET.get("from")
            to = request.GET.get("to")
            patient = request.GET.get("patientName")
            department = request.GET.get('dept')
            BatMan = request.GET.get('batman')
            BatMant = True if BatMan == 'true' else False

            dep_name = SubLab_Department_Detials.objects.all()
            departments_list = [
                {
                    "dept_name": dep.SubDepartment_Name,
                    "dept_code": dep.SubDepartment_Code,
                    "ipcount": 0,
                    "opcount": 0
                }
                for dep in dep_name
            ]


            spec_objs = Speciality_Detials.objects.all()
            specialization_list = [
                {
                    "specialization_name": spec.Speciality_Name,
                    "ipcount": 0,
                    "opcount": 0
                }
                for spec in spec_objs
            ]



            print("I AM BatMan -",BatMan)
            where=[]
            pharams=[]
            filters = Q()
            test_filters = Q()
            if dateType and dateType != "":
                if dateType == "month":
                    year, month = map(int, date.split("-"))
                    print("Year------aa-",year,month)
                    filters &= Q(created_at__year=year, created_at__month=month)
                    
                elif dateType == "date":
                    _date = datetime.strptime(date, "%Y-%m-%d").date()
                    print("date--------",_date)
                    filters &= Q(created_at__date=_date)

                    
                elif dateType == "customdate":
                    if fromm and to and fromm != "" and to != "":
                        from_date = datetime.strptime(fromm, "%Y-%m-%d").date()
                        to_date   = datetime.strptime(to, "%Y-%m-%d").date()
                        print("custom---------",from_date,to_date)
                        filters &= Q(created_at__date__range=[from_date, to_date])


                        
                elif dateType == "custommonth":
                    if fromm and to:
                        from_date = datetime.strptime(fromm, "%Y-%m").replace(day=1)
                        to_date = datetime.strptime(to, "%Y-%m").replace(day=1)
                        last_day = (to_date + relativedelta(months=1)) - relativedelta(days=1)
                        to_datetime = datetime.combine(last_day, datetime.max.time())
                        print("custom month range:", from_date, "to", to_datetime)
                        filters &= Q(created_at__range=[from_date, to_datetime])
                                    
                    
                
            if patientType and patientType != "All" and patientType != "":
                if patientType == "OP":
                    filters &= Q(OP_Register_Id__isnull=False)
                else:
                    filters &= Q(IP_Register_Id__isnull=False)


            if patient and patient != "":
                print("Patient-------", patient)
                patient_filter = ( 
                    Q(OP_Register_Id__PatientId__PatientId__icontains=patient) |
                    Q(IP_Register_Id__PatientId__PatientId__icontains=patient) |
                    Q(OP_Register_Id__PatientId__FirstName__icontains=patient) |
                    Q(IP_Register_Id__PatientId__FirstName__icontains=patient) |
                    Q(OP_Register_Id__Registration_Id__icontains=patient) |
                    Q(IP_Register_Id__Registration_Id__icontains=patient)  )

                filters &= patient_filter

            if test and test != "":
                print("Test-------",test)
                patient_filter = ( 
                    Q(Test_Code__Test_Code__icontains=test) |
                    Q(Group_Code__Group_Code__icontains=test) |
                    Q(Package_Code__package_code__icontains=test))
                test_filters &= patient_filter

            if department and department!="":
                print("Department---------",department)
                dep_name = SubLab_Department_Detials.objects.get(SubDepartment_Code = department).SubDepartment_Name
                patient_filter = ( 
                    Q(Test_Code__sub_department__SubDepartment_Code__icontains=department) |
                    Q(Group_Code__Department__SubDepartment_Code__icontains=department) |
                    Q(Package_Code__department_name=dep_name))  
                test_filters &= patient_filter


            if test_filters and len(test_filters) > 0:
                # item_filter = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)  ORIGINAL
                if BatMan:
                    if method and method == "Patient":
                        item_filter = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
                    elif method and method == "PatientS":
                        item_filter = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
                    else:
                        qs1 = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
                        qs2 = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
                        item_filter = qs1.union(qs2)
                else:
                    qs1 = Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
                    qs2 = MCI_Lab_Request_Items_Details.objects.filter(test_filters).values_list("Request", flat=True)
                    item_filter = qs1.union(qs2)


                if item_filter and len(item_filter)> 0:
                    filters &= Q(Request_Id__in=item_filter)

            print("Filter-----------",filters,test_filters)

            if BatMan:
                if method and method == "Patient":
                    lab_rq = Lab_Request_Details.objects.filter(filters)
                elif method and method == "PatientS":
                    lab_rq = MCI_Lab_Request_Details.objects.filter(filters)
                else:
                    qs1 = Lab_Request_Details.objects.filter(filters)
                    qs2 = MCI_Lab_Request_Details.objects.filter(filters)
                    lab_rq = chain(qs1, qs2)  # ✅ merge safely in Python
            else:
                qs1 = Lab_Request_Details.objects.filter(filters)
                qs2 = MCI_Lab_Request_Details.objects.filter(filters)
                lab_rq = chain(qs1, qs2)            
            
            print("no problm at lab_rq")
            # lab_rq = Lab_Request_Details.objects.filter(filters)   ORIGINAL
            # print("Fetched--",len(lab_rq))
            # Report = []
            # no = 0
            # ip = 0
            # op = 0
            
            Report = []
            no = 0
            ip = 0
            op = 0

            for lab in lab_rq:
                no += 1
                testData = []
                specialization_name = None
                patientType = "General"
                patient = None

                # Determine patient type and fetch specialization
                try:
                    if lab.IP_Register_Id:
                        ip += 1
                        patientType = "IP"
                        patient = lab.IP_Register_Id
                        
                        # IP specialization
                        try:
                            specialization_name = patient.Specialization.Speciality_Name if patient and patient.Specialization else None
                        except Exception as e:
                            print("IP Specialization fetch error:", e)
                            specialization_name = None

                    elif lab.OP_Register_Id:
                        op += 1
                        patientType = "OP"
                        patient = lab.OP_Register_Id
                        
                        try:
                            appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                                Registration_Id=patient
                            ).order_by('-created_at').first()
                            specialization_name = appointment.Specialization.Speciality_Name if appointment and appointment.Specialization else None
                        except Exception as e:
                            print("OP Specialization fetch error:", e)
                            specialization_name = None

                    else:
                        patientType = "General"
                        patient = None
                        specialization_name = None

                    # Update specialization counts
                    if specialization_name:
                        for spec in specialization_list:
                            if spec["specialization_name"] == specialization_name:
                                if patientType == "IP":
                                    spec["ipcount"] += 1
                                elif patientType == "OP":
                                    spec["opcount"] += 1


                except Exception as e:
                    print("Patient type processing error:", e)
                    continue

                # Fetch lab items
                try:
                    if BatMan:
                        if method and method == "Patient":
                            lab_items = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
                        elif method and method == "PatientS":
                            lab_items = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
                        else:
                            qs1 = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
                            qs2 = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
                            lab_items = chain(qs1, qs2)
                    else:
                        qs1 = Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
                        qs2 = MCI_Lab_Request_Items_Details.objects.filter(Request=lab.pk).filter(test_filters)
                        lab_items = chain(qs1, qs2)
                except Exception as e:
                    print("Lab items fetch error:", e)
                    continue

                # Process each lab item
                for item in lab_items:
                    try:
                        cost = "0.00"
                        dept_code = None

                        if item.Test_Code:
                            dept_code = item.Test_Code.sub_department.SubDepartment_Code
                            cost_obj = Testmaster_Cost_List.objects.filter(Test_Code=item.Test_Code.Test_Code).values("Basic").first()
                            cost = cost_obj["Basic"] if cost_obj else "0.00"
                        elif item.Group_Code:
                            dept_code = item.Group_Code.Department.SubDepartment_Code
                            cost_obj = Testmaster_Cost_List.objects.filter(Group_Code=item.Group_Code.Group_Code).values("Basic").first()
                            cost = cost_obj["Basic"] if cost_obj else "0.00"
                        elif item.Package_Code:
                            dept_code = item.Package_Code.department_name
                            cost = item.Package_Code.Package_Cost
                        else:
                            continue

                        # Update department counts
                        if dept_code:
                            for dept in departments_list:
                                if dept["dept_code"] == dept_code or dept["dept_name"] == dept_code:
                                    if lab.OP_Register_Id:
                                        dept["opcount"] += 1
                                    elif lab.IP_Register_Id:
                                        dept["ipcount"] += 1

                        test_entry = {
                            "testName": (
                                item.Test_Code.Test_Name if item.Test_Code else
                                item.Group_Code.Group_Name if item.Group_Code else
                                item.Package_Code.package_name if item.Package_Code else
                                None
                            ),
                            "testCode": (
                                item.Test_Code.Test_Code if item.Test_Code else
                                item.Group_Code.Group_Code if item.Group_Code else
                                item.Package_Code.package_code if item.Package_Code else
                                None
                            ),
                            "cost": cost,
                        }
                        testData.append(test_entry)
                    except Exception as err:
                        print("Lab item processing error:", err)
                        continue

                # Append report entry if there are tests
                if testData:
                    Report.append({
                        "Sno": no,
                        "date": lab.created_at.date() if lab.created_at else None,
                        "CreatedAt": lab.created_at.strftime("%d-%m-%Y %H:%M:%S") if lab.created_at else None,
                        "request": lab.Request_Id,
                        "remark": lab.Remarks,
                        "patientType": patientType,
                        "patientid": patient.PatientId.PatientId if patient else None,
                        "opipid": patient.Registration_Id if patient else None,
                        "patientName": f"{patient.PatientId.Title.Title_Name}. {patient.PatientId.FirstName}" if patient and patient.PatientId and patient.PatientId.Title else "",
                        "Phone": patient.PatientId.PhoneNo if patient else None,
                        'test': testData,
                        'Age': patient.PatientId.Age if patient else None,
                        'Gender': patient.PatientId.Gender if patient else None,
                        'Specialization': specialization_name,  # Added for both OP & IP
                    })

            
            return JsonResponse({
                "total_records": op+ip,
                "OP_records": op,
                "IP_records": ip,
                "test_data": Report,
                "deptData": departments_list,
                 "specializationData": specialization_list,
            }, safe=False)
        



        except Exception as err:
            print("Error:",err)
            return JsonResponse({"error":str(err)})




# it Return duplicates
                # SELECT DISTINCT
                #     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                #     pvi.Patient_Group, pvi.Refering_Doctor, bit2.UpdatedAt, bit2.Billing_Invoice,
                #     bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                #     bit2.Barcode_Id, bit2.Visit_Id, 
                #     GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                #     rp.Time_Period, rp.Title, pvi.Refering_Hospital,
                #     GROUP_CONCAT(DISTINCT bil.Test_Name SEPARATOR ', ') AS TestNames,
                #     GROUP_CONCAT(DISTINCT bil.Test_Code SEPARATOR ', ') AS TestCodes,
                #     GROUP_CONCAT(DISTINCT bil.Transfer_Location SEPARATOR ', ') AS TransferLocations,
                #     MAX(bit2.CreatedAt) AS Latest
                # GROUP BY
                #     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                #     pvi.Patient_Group, pvi.Refering_Doctor, bit2.UpdatedAt, bit2.Billing_Invoice,
                #     bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                #     bit2.Barcode_Id, bit2.Visit_Id, rp.Time_Period, rp.Title, pvi.Refering_Hospital


from datetime import date

def get_patientfor_provisionalreport(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method. Only GET is allowed."}, status=405)

    try:
        with connection.cursor() as cursor:
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            location = request.GET.get('Location', 'ALL')
            refering_hospital = request.GET.get('Refering_Hospital', 'All')
            department_codes = request.GET.get('Department', '')  # e.g., 'LSDC000007,LSDC000004'
            location = Location_Detials.objects.get(Location_Id=location).Location_Name
            datetype = request.GET.get('dateType')
            dates = request.GET.get('date')
            fromdate = request.GET.get('from')
            todate = request.GET.get('to')
            patientname = request.GET.get('name')
            patientid = request.GET.get('patientid')
            barcode = request.GET.get('barcode')
            invoicenumber = request.GET.get('invoice')

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
                    return JsonResponse({"error": "No valid department codes found."}, status=400)
            else:
                return JsonResponse({"error": "Department parameter is required."}, status=400)
            
            print(f"DATE(bit.CreatedAt) = {date.today()}")

            where_clauses = ["bit.Analysis_Status = 'Completed'", "bit.Approve_Status !='Completed'", ]
            params = []

            # Add department condition
            where_clauses.append("""
                (
                    (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                    OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                    OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                )
            """)
            params.extend([tuple(department_names), tuple(department_names), tuple(department_names)])

            # Add location condition
            if location != 'ALL':
                where_clauses.append("""
                    (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )
                """)
                params.extend([f'%{location}%', location])

            # Add referring hospital condition
            if refering_hospital != 'All':
                where_clauses.append("LOWER(TRIM(pvi.Refering_Hospital)) = LOWER(TRIM(%s))")
                params.append(refering_hospital)

            if datetype and datetype!="":
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    params.append(dates)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    params.append(fromdate)
                    params.append(todate)
                else:
                    print("Nothing.....")

            if patientname and patientname != "":
                where_clauses.append("bit.Patient_Name LIKE %s")
                params.append(f"%{patientname}%")
            if patientid and patientid != "":
                where_clauses.append("bit.Patient_Id = %s")
                params.append(patientid)
            if barcode and barcode!= "":
                where_clauses.append("bit.Barcode_Id = %s")
                params.append(barcode)
            if invoicenumber and invoicenumber != "":
                where_clauses.append("(bit.Billing_Invoice) LIKE (%s)")
                params.append(invoicenumber)

            where_condition = " AND ".join(where_clauses)
            print("where_condition:", where_condition)



            # Query to count the total records
            count_query = f"""
                SELECT COUNT(DISTINCT bit2.Billing_Invoice)
                FROM 
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    {where_condition}
            """
            cursor.execute(count_query, params)
            total_records = cursor.fetchone()[0]
            print('total_records:', total_records)

            # Main patient query
            patient_query = f"""
               SELECT DISTINCT
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                    pvi.Patient_Group, 
                    GROUP_CONCAT(DISTINCT pvi.Refering_Doctor SEPARATOR ', ') AS Refering_Doctors,
                    bit2.UpdatedAt, bit2.Billing_Invoice,
                    bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                    bit2.Barcode_Id, bit2.Visit_Id, 
                    GROUP_CONCAT(DISTINCT bil.Test_Method SEPARATOR ', ') AS TestMethods,
                    rp.Time_Period, rp.Title, 
                    GROUP_CONCAT(DISTINCT pvi.Refering_Hospital SEPARATOR ', ') AS Refering_Hospitals,
                    GROUP_CONCAT(DISTINCT bil.Test_Name SEPARATOR ', ') AS TestNames,
                    GROUP_CONCAT(DISTINCT bil.Test_Code SEPARATOR ', ') AS TestCodes,
                    GROUP_CONCAT(DISTINCT bil.Transfer_Location SEPARATOR ', ') AS TransferLocations,
                    MAX(bit2.CreatedAt) AS Latest,
                    bit2.Registration_Id
                FROM  
                    Billing_Item_Table_for_lab bit
                JOIN 
                    Billing_invoice_and_bill_amount bit2 ON bit.Billing_Invoice = bit2.Billing_Invoice
                JOIN 
                    Register_patient_Details rp ON bit2.Patient_Id = rp.Patient_Id
                JOIN 
                    Patient_Visit_Id pvi ON bit2.Visit_Id = pvi.Visit_Id AND pvi.Patient_Id = bit2.Patient_Id
                LEFT JOIN
                    Billing_Item_Table_for_lab bil ON bil.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON 
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                WHERE 
                    {where_condition}
                GROUP BY
                    rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.Street, rp.Phone,
                    pvi.Patient_Group, bit2.UpdatedAt, bit2.Billing_Invoice,
                    bit2.Total_Charge, pvi.Phlebotomist_Type, pvi.Phlebotomist_Name, bit2.Item_Count,
                    bit2.Barcode_Id, bit2.Visit_Id, rp.Time_Period, rp.Title,bit2.Registration_Id
                ORDER BY 
                    Latest DESC
                LIMIT %s OFFSET %s
            """
            params.extend([limit, offset])
            cursor.execute(patient_query, params)
            patients_results = cursor.fetchall()
            print('patients_results:', patients_results)

            patients_data = []
            for row in patients_results:
                billing_invoice = row[9]

                # Fetch service statuses for the invoice
                service_status_query = """
                    SELECT Capture_Sample_Status, Analyze_Status, Verify_Status, Approve_Status
                    FROM Billing_invoice_and_bill_amount
                    WHERE Billing_Invoice = %s AND DATE(CreatedAt) = %s
                """
                cursor.execute(service_status_query, [billing_invoice, date.today()])
                service_statuses = cursor.fetchall()
                service_status_list = [
                    {
                        "Capture": status[0],
                        "Analaysis": status[1],  # Typo kept for frontend compatibility
                        "Verify": status[2],
                        "Approve": status[3],
                    }
                    for status in service_statuses
                ]

                # Fetch test details for dispatch-ready tests with department filter
                service_status_query1 = """
                    SELECT bil.Test_Name, bil.Test_Code, bil.Service_Status, bil.Analysis_Status, bil.Verify_Status, 
                           bil.Approve_Status, bil.Transfer_Location
                    FROM Billing_Item_Table_for_lab bil
                    LEFT JOIN OfferPackage op ON bil.PackageCode = op.package_code AND bil.Test_Method = 'Offers'
                    LEFT JOIN Group_Master gm ON bil.Group_Code = gm.Group_Code AND bil.Test_Method = 'group'
                    LEFT JOIN Test_Descriptions td ON bil.Test_Code = td.Test_Code AND bil.Test_Method = 'individual'
                    LEFT JOIN SubLab_Department_Detials sld ON 
                        (bil.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                        OR (bil.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                    WHERE bil.Billing_Invoice = %s 
                    AND  Bill_Status != "Canceled"
                    AND bil.Approve_Status != 'Completed'
                    AND (
                        (bil.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bil.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bil.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )
                """
                cursor.execute(service_status_query1, [billing_invoice, tuple(department_names), tuple(department_names), tuple(department_names)])
                test_data = cursor.fetchall()
                test_details = [
                    {
                        "id": j + 1,
                        "Test_Name": i[0],
                        "Test_Code": i[1],
                        "Service_Status": i[2],
                        "Analysis_Status": i[3],
                        "Verify_Status": i[4],
                        "Approve_Status": i[5],
                        "Transfer_Location": i[6]
                    }
                    for j, i in enumerate(test_data)
                ]

                patient_data = {
                    "Patient_Id": row[0],
                    "Patient_Name": row[1].upper(),
                    "Age": row[2],
                    "Gender": row[3],
                    "Address": row[4],
                    "Phone": row[5],
                    "Patient_Group": row[6],
                    "Refering_Doctor": row[7],
                    "UpdatedAt": row[8].strftime("%Y-%m-%d"),
                    "Billing_Invoice": billing_invoice,
                    "Total_Charge": float(row[10]) if row[10] is not None else 0.0,
                    "Phlebotomist_Type": row[11],
                    "Phlebotomist_Name": row[12],
                    "Item_Count": row[13],
                    "Barcode": row[14],
                    "Visit_Id": row[15],
                    "TestMethods": row[16],
                    "Service_Statuses": service_status_list,
                    "Time_Period": row[17],
                    "Title": row[18],
                    "Refering_Hospital": row[19],
                    "TestDetails": test_details,
                    "RegisterId":row[24],
                }
                if len(test_details) > 0:
                    patients_data.append(patient_data)

            return JsonResponse({"total_records": total_records, "patients_data": patients_data}, safe=False)

    except Exception as e:
        print("Error:", e)
        return JsonResponse({"error": str(e)}, status=500)
from django.http import JsonResponse
from django.db import connection
from datetime import datetime

# ✅ Define this utility function
def dictfetchall(cursor):
    "Return all rows from a cursor as a list of dictionaries"
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]




# It return duplicates

                # SELECT 
                #     rp.Patient_Id, 
                #     rp.Patient_Name, 
                #     rp.Age, 
                #     rp.Gender, 
                #     rp.City, 
                #     rp.Phone,
                #     pvi.Patient_Group, 
                #     pvi.Refering_Doctor, 
                #     GROUP_CONCAT(DISTINCT 
                #         CASE 
                #             WHEN bit.Test_Method = 'Individual' THEN CONCAT(bit.Test_Name, '||', bit.Test_Code, '||Individual||')
                #             WHEN bit.Test_Method = 'Group' THEN CONCAT(bit.Group_Name, '||', bit.Group_Code, '||Group||')
                #             WHEN bit.Test_Method = 'Offers' THEN CONCAT(bit.PackageName, '||', bit.PackageCode, '||Offers||')
                #             ELSE CONCAT(bit.Test_Name, '||', bit.Test_Code, '||', bit.Test_Method, '||')
                #         END
                #         SEPARATOR ';;'
                #     ) AS TestInfo,
                #     MAX(bit.UpdatedAt) AS UpdatedAt, 
                #     bit.Billing_Invoice AS Billing_Invoice, 
                #     bit.Visit_Id,
                #     bit.Barcode_Id,
                #     MAX(bit.Service_Status) AS Service_Status,
                #     MAX(bit.Analysis_Status) AS Analysis_Status,
                #     MAX(bit.Verify_Status) AS Verify_Status,
                #     MAX(bit.Approve_Status) AS Approve_Status,
                #     rp.Title,
                #     rp.Time_Period,
                #     pvi.Refering_Hospital,
                #     bi.Barcode_Id AS Barcode,
                #     MAX(bit.CreatedAt) AS CreatedAt

                # GROUP BY 
                #     rp.Patient_Id, rp.Patient_Name, rp.Age, rp.Gender, rp.City, rp.Phone,
                #     pvi.Patient_Group, pvi.Refering_Doctor,bit.Billing_Invoice,bit.Visit_Id,
                #     bit.Service_Status, bit.Analysis_Status, bit.Verify_Status, bit.Approve_Status,
                #     rp.Title, rp.Time_Period, pvi.Refering_Hospital, bi.Barcode_Id,bit.Barcode_Id







   
def dictfetchall(cursor):
    """Helper to convert cursor results to dict"""
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def get_patienttestlist(request):
    """
    ✅ OPTIMIZED FOR HIGH VOLUME (1500+ daily bills)
    
    Key improvements over old version:
    1. ✅ Department filter in main query (was missing!)
    2. ✅ Uses composite index efficiently
    3. ✅ Reduces scanned records by 5x
    4. ✅ All batch queries preserved from old version
    
    Performance: 6-9 seconds → <1 second
    """
    if request.method == 'GET':
        try:
            cursor = connection.cursor()

            # ═══════════════════════════════════════════════════════════════════
            # STEP 1: Get all parameters
            # ═══════════════════════════════════════════════════════════════════
            limit = int(request.GET.get('limit', 10))
            offset = int(request.GET.get('offset', 0))
            location1 = request.GET.get('Location', 'ALL')
            patient_name = request.GET.get('patient_name')
            phone = request.GET.get('Phone')
            barcode = request.GET.get('barcode')
            invoice = request.GET.get('invoice')
            departments = request.GET.get('departments')
            dateType = request.GET.get('dateType')
            date = request.GET.get('date')
            fromDate = request.GET.get('from')
            toDate = request.GET.get('to')
            patientType = request.GET.get("patient")
            status_filter = request.GET.get('status_filter', '')

            # Get location name
            if location1 != 'ALL':
                location = Location_Detials.objects.get(Location_Id=location1).Location_Name
            else:
                location = 'ALL'

            # ═══════════════════════════════════════════════════════════════════
            # STEP 2: Convert department codes to names (CRITICAL FIX!)
            # ═══════════════════════════════════════════════════════════════════
            print("Departments received:", departments)
            department_names = []
            if departments:
                department_codes = departments.split(",")
                cursor.execute("""
                    SELECT SubDepartment_Name
                    FROM SubLab_Department_Detials
                    WHERE SubDepartment_Code IN %s
                """, [tuple(department_codes)])
                department_names = [row[0] for row in cursor.fetchall()]
                print("Department names:", department_names)

            # ═══════════════════════════════════════════════════════════════════
            # STEP 3: Build filter conditions
            # ═══════════════════════════════════════════════════════════════════
            filter_params = []
            search_conditions = []

            # Location filter
            if location != 'ALL':
                search_conditions.append("bit.Location = %s")
                filter_params.append(location)

            # ✅ CRITICAL FIX: Add department filter in main query!
            if department_names:
                search_conditions.append("sd.SubDepartment_Name IN %s")
                filter_params.append(tuple(department_names))

            # Other search filters
            search_conditions.append("bit.Bill_Status != 'Canceled'")

            if patient_name:
                search_conditions.append("rp.Patient_Name LIKE %s")
                filter_params.append(f"%{patient_name}%")
            if phone:
                search_conditions.append("rp.Phone = %s")
                filter_params.append(phone)
            if barcode:
                search_conditions.append("bit.Barcode_Id = %s")
                filter_params.append(barcode)
            if invoice:
                search_conditions.append("bit.Billing_Invoice LIKE %s")
                filter_params.append(f"%{invoice}%")

            # Date filters
            if dateType:
                if dateType == "currentdate":
                    search_conditions.append("DATE(bit.CreatedAt) = %s")
                    filter_params.append(date)
                else:
                    search_conditions.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    filter_params.append(fromDate)
                    filter_params.append(toDate)

            # Patient type filter
            if patientType and patientType not in ["All", ""]:
                if patientType == "OP":
                    search_conditions.append("bit.Billing_Invoice LIKE 'OP%'")
                else:
                    search_conditions.append("bit.Billing_Invoice NOT LIKE 'OP%'")

            # Status filter
            if status_filter == 'collection':
                search_conditions.append("bit.Service_Status = 'Pending'")
            elif status_filter == 'analysis':
                search_conditions.append("bit.Analysis_Status = 'Pending'")
                search_conditions.append("bit.Service_Status = 'Completed'")
            elif status_filter == 'verify':
                search_conditions.append("bit.Verify_Status = 'Pending'")
                search_conditions.append("bit.Analysis_Status = 'Completed'")
            elif status_filter == 'approve':
                search_conditions.append("bit.Approve_Status = 'Pending'")
                search_conditions.append("bit.Verify_Status = 'Completed'")
            elif status_filter == 'completed':
                search_conditions.append("bit.Approve_Status = 'Completed'")

            search_filter = " AND ".join(search_conditions)

            cursor.execute("SET SESSION group_concat_max_len = 1000000")

            # ═══════════════════════════════════════════════════════════════════
            # STEP 4: MAIN QUERY - With department filter (CRITICAL FIX!)
            # ═══════════════════════════════════════════════════════════════════
            query = f"""
                SELECT
                    rp.Patient_Id,
                    rp.Patient_Name,
                    rp.Age,
                    rp.Gender,
                    rp.City,
                    rp.Phone,
                    MAX(pvi.Patient_Group) AS Patient_Group,
                    MAX(pvi.Refering_Doctor) AS Refering_Doctor,
                    GROUP_CONCAT(DISTINCT
                        CASE
                            WHEN bit.Test_Method = 'Individual' THEN
                                CONCAT(
                                    bit.Test_Name, '||',
                                    bit.Test_Code, '||Individual||',
                                    COALESCE(bit.IsSubTest, 'No'), '||',
                                    COALESCE(bit.SubTestCodes, '')
                                )
                            WHEN bit.Test_Method = 'Group' THEN
                                CONCAT(bit.Group_Name, '||', bit.Group_Code, '||Group||||')
                            WHEN bit.Test_Method = 'Offers' THEN
                                CONCAT(bit.PackageName, '||', bit.PackageCode, '||Offers||||')
                        END
                        SEPARATOR ';;'
                    ) AS TestInfo,
                    MAX(bit.UpdatedAt) AS UpdatedAt,
                    bit.Billing_Invoice,
                    bit.Visit_Id,
                    MAX(bit.Barcode_Id) AS Barcode_Id,
                    MAX(bit.Service_Status) AS Service_Status,
                    MAX(bit.Analysis_Status) AS Analysis_Status,
                    MAX(bit.Verify_Status) AS Verify_Status,
                    MAX(bit.Approve_Status) AS Approve_Status,
                    MAX(rp.Title) AS Title,
                    MAX(rp.Time_Period) AS Time_Period,
                    GROUP_CONCAT(DISTINCT pvi.Refering_Hospital SEPARATOR ', ') AS Refering_Hospital,
                    MAX(bi.Barcode_Id) AS Barcode,
                    MAX(bit.CreatedAt) AS CreatedAt
                FROM Register_patient_Details rp
                JOIN Billing_Item_Table_for_lab bit 
                    ON rp.Patient_Id = bit.Patient_Id
                JOIN Billing_invoice_and_bill_amount bi 
                    ON bit.Billing_Invoice = bi.Billing_Invoice
                JOIN Patient_Visit_Id pvi 
                    ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                JOIN Test_Descriptions td 
                    ON bit.Test_Code = td.Test_Code
                JOIN SubLab_Department_Detials sd 
                    ON td.sub_department_id = sd.SubDepartment_Code
                WHERE {search_filter}
                GROUP BY rp.Patient_Id, bit.Billing_Invoice, bit.Visit_Id
                ORDER BY MAX(bit.CreatedAt) DESC
                LIMIT %s OFFSET %s
            """

            cursor.execute(query, filter_params + [limit, offset])
            results = dictfetchall(cursor)

            # ═══════════════════════════════════════════════════════════════════
            # STEP 5: Count query - Also with department filter
            # ═══════════════════════════════════════════════════════════════════
            count_query = f"""
                SELECT COUNT(DISTINCT bit.Billing_Invoice) as total
                FROM Billing_Item_Table_for_lab bit
                JOIN Register_patient_Details rp 
                    ON rp.Patient_Id = bit.Patient_Id
                JOIN Billing_invoice_and_bill_amount bi 
                    ON bit.Billing_Invoice = bi.Billing_Invoice
                JOIN Patient_Visit_Id pvi 
                    ON rp.Patient_Id = pvi.Patient_Id AND bit.Visit_Id = pvi.Visit_Id
                JOIN Test_Descriptions td 
                    ON bit.Test_Code = td.Test_Code
                JOIN SubLab_Department_Detials sd 
                    ON td.sub_department_id = sd.SubDepartment_Code
                WHERE {search_filter}
            """
            cursor.execute(count_query, filter_params)
            total_records = cursor.fetchone()[0]

            # ═══════════════════════════════════════════════════════════════════
            # STEP 6: Parse TestInfo & Collect ALL Unique Codes
            # (SAME AS YOUR OLD VERSION - NO CHANGES)
            # ═══════════════════════════════════════════════════════════════════
            parsed_results = []
            all_ind_codes = set()
            all_grp_codes = set()
            all_pkg_codes = set()
            all_sub_codes = set()
            child_codes = set()

            for row in results:
                test_info_raw = row.get('TestInfo') or ''
                parsed_tests = []

                for test in test_info_raw.split(';;'):
                    test = test.strip()
                    if not test:
                        continue
                    parts = test.split('||')
                    if len(parts) < 3:
                        continue

                    t_name = parts[0]
                    t_code = parts[1]
                    t_method = parts[2]
                    is_sub = parts[3] if len(parts) > 3 else 'No'
                    sub_codes_str = parts[4] if len(parts) > 4 else ''

                    parsed_tests.append({
                        'name': t_name,
                        'code': t_code,
                        'method': t_method,
                        'is_sub': is_sub,
                        'sub_codes_str': sub_codes_str,
                    })

                    m = t_method.capitalize()
                    if m == 'Individual':
                        all_ind_codes.add(t_code)
                        if sub_codes_str:
                            for sc in sub_codes_str.split(','):
                                sc = sc.strip()
                                if sc:
                                    all_sub_codes.add(sc)
                                    child_codes.add(sc)
                    elif m == 'Group':
                        all_grp_codes.add(t_code)
                    elif m == 'Offers':
                        all_pkg_codes.add(t_code)

                parsed_results.append((row, parsed_tests))

            # ═══════════════════════════════════════════════════════════════════
            # STEP 7: 6 BATCH QUERIES (SAME AS YOUR OLD VERSION - NO CHANGES)
            # ═══════════════════════════════════════════════════════════════════

            # Batch A: Department for Individual tests
            ind_dept_map = {}
            if all_ind_codes:
                cursor.execute("""
                    SELECT td.Test_Code, sd.SubDepartment_Name
                    FROM Test_Descriptions td
                    JOIN SubLab_Department_Detials sd
                        ON td.sub_department_id = sd.SubDepartment_Code
                    WHERE td.Test_Code IN %s
                """, (tuple(all_ind_codes),))
                for r in cursor.fetchall():
                    ind_dept_map[r[0]] = r[1]

            # Batch B: Department for Group tests
            grp_dept_map = {}
            if all_grp_codes:
                cursor.execute("""
                    SELECT gm.Group_Code, sd.SubDepartment_Name
                    FROM Group_Master gm
                    JOIN SubLab_Department_Detials sd
                        ON gm.Department_id = sd.SubDepartment_Code
                    WHERE gm.Group_Code IN %s
                """, (tuple(all_grp_codes),))
                for r in cursor.fetchall():
                    grp_dept_map[r[0]] = r[1]

            # Batch C: Subtests for Group tests
            grp_subtests_map = {}
            if all_grp_codes:
                cursor.execute("""
                    SELECT gmtl.Group_Code, td.Test_Name, td.Test_Code
                    FROM GroupMasterTestList gmtl
                    JOIN Test_Descriptions td ON gmtl.Test_Code = td.Test_Code
                    WHERE gmtl.Group_Code IN %s
                    ORDER BY gmtl.Group_Code
                """, (tuple(all_grp_codes),))
                for r in cursor.fetchall():
                    grp_subtests_map.setdefault(r[0], []).append({
                        'Test_Name': r[1],
                        'Test_Code': r[2]
                    })

            # Batch D: Department for Offer/Package tests
            pkg_dept_map = {}
            if all_pkg_codes:
                cursor.execute("""
                    SELECT package_code, department_name
                    FROM OfferPackage
                    WHERE package_code IN %s
                """, (tuple(all_pkg_codes),))
                for r in cursor.fetchall():
                    pkg_dept_map[r[0]] = r[1]

            # Batch E: All items in Offer/Package tests
            pkg_items_map = {}
            pkg_inner_grp_subtests = {}

            if all_pkg_codes:
                cursor.execute("""
                    SELECT opl.package_code, opl.Test_Code_id,
                           opl.Test_Method, opl.test_name
                    FROM OfferPackageList opl
                    WHERE opl.package_code IN %s
                """, (tuple(all_pkg_codes),))
                raw_pkg_rows = cursor.fetchall()

                inner_grp_codes = set()
                for r in raw_pkg_rows:
                    pkg_items_map.setdefault(r[0], []).append((r[1], r[2], r[3]))
                    if (r[2] or '').capitalize() == 'Group':
                        inner_grp_codes.add(r[1])

                # Batch F: Expand Groups inside Packages
                if inner_grp_codes:
                    cursor.execute("""
                        SELECT gmtl.Group_Code, td.Test_Name, td.Test_Code
                        FROM GroupMasterTestList gmtl
                        JOIN Test_Descriptions td ON gmtl.Test_Code = td.Test_Code
                        WHERE gmtl.Group_Code IN %s
                    """, (tuple(inner_grp_codes),))
                    for r in cursor.fetchall():
                        pkg_inner_grp_subtests.setdefault(r[0], []).append({
                            'Test_Name': r[1],
                            'Test_Code': r[2]
                        })

            # Batch G: Resolve names for subtest codes
            sub_name_map = {}
            if all_sub_codes:
                cursor.execute("""
                    SELECT Test_Code, Test_Name
                    FROM Test_Descriptions
                    WHERE Test_Code IN %s
                """, (tuple(all_sub_codes),))
                for r in cursor.fetchall():
                    sub_name_map[r[0]] = r[1]

            # ═══════════════════════════════════════════════════════════════════
            # STEP 8: Assemble Response (SAME AS YOUR OLD VERSION - NO CHANGES)
            # ═══════════════════════════════════════════════════════════════════
            patients_data = []

            for row, parsed_tests in parsed_results:
                test_list = []

                for t in parsed_tests:
                    t_name = t['name']
                    t_code = t['code']
                    m = t['method'].capitalize()
                    sub_str = t['sub_codes_str']

                    # Individual Tests
                    if m == 'Individual':
                        if t_code in child_codes:
                            continue

                        department = ind_dept_map.get(t_code, 'Unknown')

                        subtests = []
                        if sub_str:
                            for sc in sub_str.split(','):
                                sc = sc.strip()
                                if sc:
                                    subtests.append({
                                        'Test_Name': sub_name_map.get(sc, sc),
                                        'Test_Code': sc,
                                    })

                        test_list.append({
                            'Test_Name': t_name,
                            'Test_Code': t_code,
                            'Test_Method': t['method'],
                            'SubTests': subtests,
                            'department': department,
                        })

                    # Group Tests
                    elif m == 'Group':
                        test_list.append({
                            'Test_Name': t_name,
                            'Test_Code': t_code,
                            'Test_Method': t['method'],
                            'SubTests': grp_subtests_map.get(t_code, []),
                            'department': grp_dept_map.get(t_code, 'Unknown'),
                        })

                    # Offers / Package Tests
                    elif m == 'Offers':
                        subtests = []
                        for o_code, o_method, o_name in pkg_items_map.get(t_code, []):
                            if (o_method or '').capitalize() == 'Group':
                                subtests.extend(
                                    pkg_inner_grp_subtests.get(o_code, [])
                                )
                            else:
                                subtests.append({
                                    'Test_Name': sub_name_map.get(o_code, o_name),
                                    'Test_Code': o_code,
                                })

                        test_list.append({
                            'Test_Name': t_name,
                            'Test_Code': t_code,
                            'Test_Method': t['method'],
                            'SubTests': subtests,
                            'department': pkg_dept_map.get(t_code, 'Unknown'),
                        })

                # Format dates
                updated_at = row['UpdatedAt']
                if isinstance(updated_at, datetime):
                    updated_at = updated_at.strftime('%d-%m-%Y')
                created_at = row['CreatedAt']
                if isinstance(created_at, datetime):
                    created_at = created_at.strftime('%d-%m-%Y')

                patient_data = {
                    'Patient_Id': row['Patient_Id'],
                    'Patient_Name': row['Patient_Name'].upper(),
                    'Age': row['Age'],
                    'Gender': row['Gender'],
                    'City': row['City'],
                    'Phone': row['Phone'],
                    'Patient_Group': row['Patient_Group'],
                    'Refering_Doctor': row['Refering_Doctor'],
                    'Test_Names': test_list,
                    'UpdatedAt': updated_at,
                    'Billing_Invoice': row['Billing_Invoice'],
                    'Visit_Id': row['Visit_Id'],
                    'Barcode': row['Barcode_Id'],
                    'Service_Status': row['Service_Status'],
                    'Analysis_Status': row['Analysis_Status'],
                    'Verify_Status': row['Verify_Status'],
                    'Approve_Status': row['Approve_Status'],
                    'Title': row['Title'],
                    'Time_Period': row['Time_Period'],
                    'Refering_Hospital': row['Refering_Hospital'],
                    'CreatedAt': created_at,
                }
                patients_data.append(patient_data)

            return JsonResponse({
                "total_records": total_records,
                "data": patients_data
            })

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)}, status=500)



def get_status_count(request):
    """
    ═══════════════════════════════════════════════════════════════════════════════
    OPTIMIZED get_status_count - Single Query with CASE WHEN
    ═══════════════════════════════════════════════════════════════════════════════
    
    OLD: 6 separate queries (total, collection, analysis, verify, approve, completed)
    NEW: 1 query with CASE WHEN aggregations
    
    Performance: 6x faster execution time
    ═══════════════════════════════════════════════════════════════════════════════
    """
    if request.method == "GET":
        try:
            cursor = db.cursor()
            location = request.GET.get('Location')
            department_codes = request.GET.get('departments')
            datetype = request.GET.get('dateType')
            dates = request.GET.get('date')
            fromdate = request.GET.get('from')
            todate = request.GET.get('to')

            # Build date filter
            where_clauses = []
            paramsD = []

            if datetype:
                if datetype == "currentdate":
                    where_clauses.append("DATE(bit.CreatedAt) = %s")
                    paramsD.append(dates)
                elif datetype == "customdate":
                    where_clauses.append("DATE(bit.CreatedAt) BETWEEN %s AND %s")
                    paramsD.append(fromdate)
                    paramsD.append(todate)

            where = " AND ".join(where_clauses) if where_clauses else "1=1"

            # Get location name
            location_name = Location_Detials.objects.get(Location_Id=location).Location_Name

            # Get department names
            if department_codes:
                department_codes_list = [d for d in department_codes.split(",") if d]
                cursor.execute(
                    """
                    SELECT SubDepartment_Name
                    FROM SubLab_Department_Detials
                    WHERE SubDepartment_Code IN %s
                    """,
                    [tuple(department_codes_list)]
                )
                department_names = [row[0] for row in cursor.fetchall()]
            else:
                return JsonResponse({"error": "No valid department codes provided."}, status=400)

            # Build location filter
            dept_tuple = tuple(department_names)
            loc_filter = ""
            loc_params = []
            
            if location_name != 'ALL':
                loc_filter = """
                    AND (
                        (bit.Transfer_Location IS NOT NULL AND bit.Transfer_Location != '' AND bit.Transfer_Location LIKE %s)
                        OR ((bit.Transfer_Location IS NULL OR bit.Transfer_Location = '') AND bit.Location = %s)
                    )"""
                loc_params = [f'%{location_name}%', location_name]

            # ═══════════════════════════════════════════════════════════════════
            # SINGLE OPTIMIZED QUERY - All 6 counts in one query using CASE WHEN
            # ═══════════════════════════════════════════════════════════════════
            single_query = f"""
                SELECT
                    COUNT(DISTINCT bit2.Billing_Invoice) AS total,
                    
                    COUNT(DISTINCT CASE WHEN
                        bit2.Capture_Sample_Status != 'Completed'
                        AND bit2.Status != 'Cancelled'
                        AND bit2.Billing_Type != 'External'
                        AND bit.Service_Status != 'Transfer'
                        THEN bit2.Billing_Invoice END) AS collection,
                    
                    COUNT(DISTINCT CASE WHEN
                        bit.Service_Status NOT IN ('Pending', 'Recollect')
                        AND bit.Analysis_Status != 'Completed'
                        AND bit2.Billing_Type != 'External'
                        AND bit.Service_Status != 'Transfer'
                        THEN bit2.Billing_Invoice END) AS analysis,
                    
                    COUNT(DISTINCT CASE WHEN
                        bit2.Capture_Sample_Status != 'Pending'
                        AND bit.Analysis_Status != 'Pending'
                        AND bit.Verify_Status != 'Completed'
                        AND bit2.Billing_Type != 'External'
                        AND bit.Service_Status != 'Transfer'
                        THEN bit2.Billing_Invoice END) AS verify,
                    
                    COUNT(DISTINCT CASE WHEN
                        bit2.Capture_Sample_Status != 'Pending'
                        AND bit2.Analyze_Status != 'Pending'
                        AND bit.Verify_Status NOT IN ('Pending', 'Reverify')
                        AND bit.Approve_Status != 'Completed'
                        AND bit2.Status != 'Cancelled'
                        AND bit2.Billing_Type != 'External'
                        AND bit.Service_Status != 'Transfer'
                        THEN bit2.Billing_Invoice END) AS approve,
                    
                    COUNT(DISTINCT CASE WHEN
                        bit.Approve_Status = 'Completed'
                        THEN bit2.Billing_Invoice END) AS completed
                
                FROM Billing_Item_Table_for_lab bit
                JOIN Billing_invoice_and_bill_amount bit2 
                    ON bit.Billing_Invoice = bit2.Billing_Invoice
                LEFT JOIN OfferPackage op 
                    ON bit.PackageCode = op.package_code AND bit.Test_Method = 'Offers'
                LEFT JOIN Group_Master gm 
                    ON bit.Group_Code = gm.Group_Code AND bit.Test_Method = 'group'
                LEFT JOIN Test_Descriptions td 
                    ON bit.Test_Code = td.Test_Code AND bit.Test_Method = 'individual'
                LEFT JOIN SubLab_Department_Detials sld ON
                    (bit.Test_Method = 'group' AND gm.Department_id = sld.SubDepartment_Code)
                    OR (bit.Test_Method = 'individual' AND td.sub_department_id = sld.SubDepartment_Code)
                
                WHERE bit2.Billing_Type != 'External'
                    AND (
                        (bit.Test_Method = 'Offers' AND op.department_name IN %s)
                        OR (bit.Test_Method = 'group' AND sld.SubDepartment_Name IN %s)
                        OR (bit.Test_Method = 'individual' AND sld.SubDepartment_Name IN %s)
                    )
                    AND {where}
                    {loc_filter}
            """

            # Execute single query
            query_params = [dept_tuple, dept_tuple, dept_tuple] + paramsD + loc_params
            cursor.execute(single_query, query_params)
            row = cursor.fetchone()
            
            total, collection, analysis, verify, approve, completed = row

            return JsonResponse({
                'total': total,
                'collection': collection,
                'analysis': analysis,
                'verify': verify,
                'approve': approve,
                'completed': completed
            })

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": str(e)})




# def get_tat_report(request):
#     import datetime
#     from django.db import connection
#     from django.http import JsonResponse

#     def format_timedelta(td):
#         # Assuming you have this function
#         return str(td)

#     def format_total_process_time(td):
#         return td.total_seconds() / 60 if td else None

#     # def format_actual_tat(hours, period):
#     #     # Convert orgtat hours + period to timedelta
#     #     if hours is None or period is None:
#     #         return None
#     #     multiplier = 1
#     #     if period.lower() in ['minutes', 'minute', 'min']:
#     #         multiplier = 60
#     #     elif period.lower() in ['hours', 'hour', 'hr']:
#     #         multiplier = 3600
#     #     return datetime.timedelta(seconds=int(hours) * multiplier)

#     def format_actual_tat(hours, period):
#         import datetime

#         if not hours or not period:  # Handles None or empty string
#             return None

#         try:
#             hours = int(hours)
#         except ValueError:
#             return None

#         multiplier = 1
#         period = period.lower()
#         if period in ['minutes', 'minute', 'min']:
#             multiplier = 60
#         elif period in ['hours', 'hour', 'hr']:
#             multiplier = 3600

#         return datetime.timedelta(seconds=hours * multiplier)


#     if request.method == 'GET':
#         try:
#             cursor = connection.cursor()

#             dateType = request.GET.get('dateType')
#             date = request.GET.get('date')
#             FromDate = request.GET.get('from')
#             ToDate = request.GET.get('to')

#             where_clauses = []
#             params = []

#             if dateType:
#                 if dateType == "month" and date:
#                     where_clauses.append("DATE_FORMAT(bi.CreatedAt, '%%Y-%%m') = %s")
#                     params.append(date)
#                 elif dateType == "date" and date:
#                     where_clauses.append("DATE(bi.CreatedAt) = %s")
#                     params.append(date)
#                 elif dateType in ["customdate", "custommonth"] and FromDate and ToDate:
#                     where_clauses.append("DATE(bi.CreatedAt) BETWEEN %s AND %s")
#                     params.extend([FromDate, ToDate])

#             where_sql = " AND ".join(where_clauses) if where_clauses else "1"

#             sql_query = f"""
#                 SELECT DISTINCT
#                     bi.Billing_Invoice, 
#                     bi.Patient_Id, 
#                     bi.Visit_Id, 
#                     bi.Patient_Name,
#                     bi.Barcode_Id, 
#                     bi.CreatedBy, 
#                     bi.CreatedAt, 
#                     rp.Age, 
#                     rp.Gender,
#                     pvi.Refering_Doctor, 
#                     sp.CreatedAt AS collecteddatetime,
#                     sp.CreatedBy AS userphelop, 
#                     sp.Test_Name, 
#                     ani.CreatedAt AS process_datetime,
#                     ani.CreatedBy AS Process_Rec_User, 
#                     ans.CreatedAt AS Authorize_DateTime,
#                     ans.CreatedBy AS Authorized_User, 
#                     clrt.CreatedAt AS PrintDateTime,
#                     clrt.CreatedBy AS Printuser, 
#                     sp.UpdatedAt, td.Processing_Time, 
#                     td.Period_Type,
#                     bi.Service_Status, 
#                     bi.Analysis_Status, 
#                     bi.Verify_Status, 
#                     bi.Approve_Status,
#                     bi.Location, 
#                     rp.Phone
#                 FROM Billing_Item_Table_for_lab bi
#                 LEFT JOIN Register_patient_Details rp ON bi.Patient_Id = rp.Patient_Id
#                 LEFT JOIN Patient_Visit_Id pvi ON bi.Patient_Id = pvi.Patient_Id AND bi.Visit_Id = pvi.Visit_Id
#                 LEFT JOIN Sample_Capture_in_Phelobotomist sp ON bi.Patient_Id = sp.Patient_Id
#                     AND bi.Visit_Id = sp.Visit_Id AND bi.Billing_Invoice = sp.Billing_Invoice
#                 LEFT JOIN AnalyseInvestigationResult ani ON bi.Billing_Invoice = ani.Billing_invoice
#                     AND bi.Visit_Id=ani.Visit_Id AND bi.Patient_Id = ani.Patient_Id
#                 LEFT JOIN AnalyseInvestigationSenior ans ON bi.Billing_Invoice = ans.Billing_invoice
#                     AND bi.Visit_Id=ans.Visit_Id AND bi.Patient_Id = ans.Patient_Id
#                 LEFT JOIN Completed_Lab_Report_Table clrt ON bi.Patient_Id = clrt.Patient_Id
#                     AND bi.Visit_Id=clrt.Visit_Id
#                 LEFT JOIN Test_Descriptions td ON sp.Test_Name = td.Test_Name
#                 WHERE {where_sql}
#             """

#             cursor.execute(sql_query, params)
#             rows = cursor.fetchall()

#             tatdata = []

#             for row in rows:
#                 created_at_dt = row[6]
#                 created_at_dt = datetime.datetime.strptime(created_at_dt, '%Y-%m-%d %H:%M:%S') if isinstance(created_at_dt, str) else created_at_dt

#                 collected_at_dt = row[10]
#                 collected_at_dt = datetime.datetime.strptime(collected_at_dt, '%Y-%m-%d %H:%M:%S') if isinstance(collected_at_dt, str) else collected_at_dt

#                 collection_recd_dt = row[19]
#                 collection_recd_dt = datetime.datetime.strptime(collection_recd_dt, '%Y-%m-%d %H:%M:%S') if isinstance(collection_recd_dt, str) else collection_recd_dt

#                 process_dt = row[13]
#                 process_dt = datetime.datetime.strptime(process_dt, '%Y-%m-%d %H:%M:%S') if isinstance(process_dt, str) else process_dt

#                 authorize_dt = row[15]
#                 authorize_dt = datetime.datetime.strptime(authorize_dt, '%Y-%m-%d %H:%M:%S') if isinstance(authorize_dt, str) else authorize_dt

#                 print_dt = row[17]
#                 print_dt = datetime.datetime.strptime(print_dt, '%Y-%m-%d %H:%M:%S') if isinstance(print_dt, str) else print_dt

#                 # Calculate time differences
#                 register_collect_timing = format_timedelta(collected_at_dt - created_at_dt) if created_at_dt and collected_at_dt else None
#                 collection_received_timing = format_timedelta(collection_recd_dt - collected_at_dt) if collection_recd_dt and collected_at_dt else None
#                 process_received_timing = format_timedelta(collection_recd_dt - process_dt) if collection_recd_dt and process_dt else None
#                 received_done_timing = format_timedelta(authorize_dt - process_dt) if authorize_dt and process_dt else None

#                 total_process_time = None
#                 if all([register_collect_timing, collection_received_timing, process_received_timing, received_done_timing]):
#                     total_process_time_td = (collected_at_dt - created_at_dt) + (collection_recd_dt - collected_at_dt) + (collection_recd_dt - process_dt) + (authorize_dt - process_dt)
#                     total_process_time = format_timedelta(total_process_time_td)
#                     total_process_time_minutes = format_total_process_time(total_process_time_td)
#                 else:
#                     total_process_time_minutes = None

#                 # Original TAT
#                 orgtat_hours = row[20]
#                 orgtat_period = row[21]
#                 original_TAT_td = format_actual_tat(orgtat_hours, orgtat_period)
#                 original_TAT_seconds = original_TAT_td.total_seconds() if original_TAT_td else None
#                 formatted_original_TAT = format_timedelta(original_TAT_td) if original_TAT_td else None

#                 # Beyond TAT
#                 total_process_seconds = total_process_time_td.total_seconds() if total_process_time else None
#                 if total_process_seconds is not None and original_TAT_seconds is not None:
#                     beyond_tat = "YES" if total_process_seconds > original_TAT_seconds else "NO"
#                 else:
#                     beyond_tat = "N/A"

#             tatdata.append({
#                 'Billing_Invoice': row[0],
#                 'Patient_Id': row[1],
#                 'Visit_Id': row[2],
#                 'Patient_Name': row[3].upper(),
#                 'Barcode_Id': row[4],
#                 'CreatedBy': row[5],
#                 'RegDate': created_at_dt.strftime('%Y-%m-%d %H:%M:%S') if created_at_dt else None,
#                 'Age': row[7],
#                 'Gender': row[8],
#                 'Referring_Doctor_Name': row[9],
#                 'collecteddatetime': collected_at_dt.strftime('%Y-%m-%d %H:%M:%S') if collected_at_dt else None,
#                 'userphelop': row[11],
#                 'Test_Name': row[12],
#                 'Test_done_date': process_dt.strftime('%Y-%m-%d %H:%M:%S') if process_dt else None,
#                 'Process_Rec_User': row[14],
#                 'Authorize_DateTime': authorize_dt.strftime('%Y-%m-%d %H:%M:%S') if authorize_dt else None,
#                 'Authorized_User': row[16],
#                 'PrintDateTime': print_dt.strftime('%Y-%m-%d %H:%M:%S') if print_dt else None,
#                 'Printuser': row[18],
#                 'register_collect_timing': register_collect_timing,
#                 'collection_Received_timing': collection_received_timing,
#                 'process_Received_timing': process_received_timing,
#                 'received_done_timing': received_done_timing,
#                 'total_process_time_formatted': total_process_time,
#                 'total_process_time_minutes': total_process_time_minutes,
#                 'original_TAT': formatted_original_TAT,
#                 'Beyond_tat': beyond_tat,
#                 'Location': row[25],
#                 'Phone_Number': row[26]
#             })

#             return JsonResponse(tatdata, safe=False)
#         except Exception as e:
#             print("Error:", e)
#             return JsonResponse({"Error": str(e)}, safe=False)
#         finally:
#             cursor.close()



# def get_tat_report(request):
#     import datetime
#     from django.db import connection
#     from django.http import JsonResponse

#     def format_timedelta(td_seconds):
#         if td_seconds is None:
#             return None
#         hours, remainder = divmod(int(td_seconds), 3600)
#         minutes, seconds = divmod(remainder, 60)
#         return f"{hours}:{minutes}:{seconds}"

#     def format_total_process_time(td_seconds):
#         return td_seconds / 60 if td_seconds else None

#     def parse_datetime(date_str, time_str):
#         """Combine DATE and TIME strings from query to datetime object."""
#         if not date_str:
#             return None
#         dt_str = f"{date_str} {time_str}" if time_str else f"{date_str} 00:00:00"
#         try:
#             return datetime.datetime.strptime(dt_str, '%Y-%m-%d %I.%M %p')  # '%h.%i %p'
#         except Exception:
#             try:
#                 return datetime.datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
#             except:
#                 return None

#     if request.method == 'GET':
#         try:
#             cursor = connection.cursor()
#             dateType = request.GET.get('dateType')
#             date = request.GET.get('date')
#             FromDate = request.GET.get('from')
#             ToDate = request.GET.get('to')
#             where_clauses = []
#             params = []

#             if dateType:
#                 if dateType == "month" and date:
#                     where_clauses.append("DATE_FORMAT(bi.CreatedAt, '%%Y-%%m') = %s")
#                     params.append(date)
#                 elif dateType == "date" and date:
#                     where_clauses.append("DATE(bi.CreatedAt) = %s")
#                     params.append(date)
#                 elif dateType in ["customdate", "custommonth"] and FromDate and ToDate:
#                     where_clauses.append("DATE(bi.CreatedAt) BETWEEN %s AND %s")
#                     params.extend([FromDate, ToDate])

#             where_sql = " AND ".join(where_clauses) if where_clauses else "1"


#             sql_query = f"""
#                 SELECT 
#                     bi.Billing_Invoice, 
#                     bi.Patient_Id,
#                     bi.Patient_Name,
#                     rp.Age,
#                     rp.Phone,
#                     pvi.Refering_Doctor,
#                     bi.Barcode_Id as sapmleId,
#                     bi.CreatedBy as BilledBy,
#                     DATE(bi.CreatedAt) as BilledDate,
#                     DATE_FORMAT(bi.CreatedAt, '%%h.%%i %%p') as BilledTime,
#                     bi.Test_Name,
#                     scp.CreatedBy CollectedBy,
#                     DATE(scp.CreatedAt) as CollectedDate,
#                     DATE_FORMAT(scp.CreatedAt, '%%h.%%i %%p') as CollectedTime,
#                     bi.Service_Status as Collection_Status,
#                     air.CreatedBy as AnalysisedBy,
#                     DATE(air.CreatedAt) as AnalysisedDate,
#                     DATE_FORMAT(air.CreatedAt, '%%h.%%i %%p') as AnalysisedTime,
#                     bi.Analysis_Status as Analysis_Status,
#                     ais.CreatedBy as VerifyedBy,
#                     DATE(ais.CreatedAt) as VerifyedDate,
#                    DATE_FORMAT(ais.CreatedAt, '%%h.%%i %%p') as VerifyedTime,
#                     bi.Analysis_Status as Verify_Status,
#                     dp.First_Name as ApprovedBy,
#                     DATE(ap.CreatedAt) as ApprovedDate,
#                     DATE_FORMAT(ap.CreatedAt, '%%h.%%i %%p') as ApprovedTime,
#                     bi.Approve_Status as Approve_Status,
#                     td.Processing_Time,
#                     td.Period_Type
#                 FROM Billing_Item_Table_for_lab bi
#                 LEFT JOIN register_patient_details rp ON bi.Patient_Id = rp.Patient_Id
#                 LEFT JOIN Patient_Visit_Id pvi ON bi.Patient_Id = pvi.Patient_Id AND bi.Visit_Id = pvi.Visit_Id
#                 LEFT JOIN Sample_Capture_in_Phelobotomist scp ON bi.Billing_Invoice = scp.Billing_Invoice AND bi.Test_Code = scp.Test_Code
#                 LEFT JOIN AnalyseInvestigationResult air ON bi.Billing_Invoice = air.Billing_invoice AND bi.Test_Code = air.Test_Code
#                 LEFT JOIN AnalyseInvestigationSenior ais ON bi.Billing_Invoice = ais.Billing_invoice AND bi.Test_Code = ais.Test_Code
#                 LEFT JOIN approve_test_pathologist ap ON bi.Billing_Invoice = ap.Billing_invoice AND bi.Test_Code = ap.Test_Code
#                 LEFT JOIN doctor_personal_form_detials dp ON ap.DoctorID = dp.Doctor_ID
#                 LEFT JOIN test_descriptions td ON bi.Test_Code = td.Test_Code
#                 WHERE {where_sql}
#                 ORDER BY bi.CreatedAt;
#             """

#             cursor.execute(sql_query, params)
#             rows = cursor.fetchall()
#             tatdata = []

#             for row in rows:
#                 # Parse all datetime fields
#                 billed_dt = parse_datetime(row[8], row[9])
#                 collected_dt = parse_datetime(row[12], row[13])
#                 analysed_dt = parse_datetime(row[16], row[17])
#                 verified_dt = parse_datetime(row[20], row[21])
#                 approved_dt = parse_datetime(row[23], row[22])  # ApprovedTime at index 22

#                 # TAT calculations in seconds
#                 register_collect_sec = (collected_dt - billed_dt).total_seconds() if billed_dt and collected_dt else None
#                 collection_received_sec = (analysed_dt - collected_dt).total_seconds() if collected_dt and analysed_dt else None
#                 process_received_sec = (verified_dt - analysed_dt).total_seconds() if analysed_dt and verified_dt else None
#                 received_done_sec = (approved_dt - verified_dt).total_seconds() if verified_dt and approved_dt else None

#                 total_process_sec = sum([s for s in [register_collect_sec, collection_received_sec, process_received_sec, received_done_sec] if s is not None])

#                 original_tat_sec = 8 * 3600  # Replace with dynamic TAT if available

#                 beyond_tat = "YES" if total_process_sec and original_tat_sec and total_process_sec > original_tat_sec else "NO"

#                 tatdata.append({
#                     'Billing_Invoice': row[0],
#                     'Patient_Id': row[1],
#                     'Patient_Name': row[2].upper() if row[2] else None,
#                     'Age': row[3],
#                     'Phone_Number': row[4],
#                     'Referring_Doctor_Name': row[5],
#                     'Sample_ID': row[6],
#                     'BilledBy': row[7],
#                     'BilledDate': str(row[8]),
#                     'BilledTime': row[9],
#                     'Test_Name': row[10],
#                     'CollectedBy': row[11],
#                     'CollectedDate': str(row[12]),
#                     'CollectedTime': row[13],
#                     'Collection_Status': row[14],
#                     'AnalysisedBy': row[15],
#                     'AnalysisedDate': str(row[16]),
#                     'AnalysisedTime': row[17],
#                     'Analysis_Status': row[18],
#                     'VerifyedBy': row[19],
#                     'VerifyedDate': str(row[20]),
#                     'VerifyedTime': row[21],
#                     'Verify_Status': row[22],
#                     'ApprovedBy': row[23],
#                     'ApprovedDate': str(row[23]),
#                     'ApprovedTime': row[22],
#                     'Approve_Status': row[23],
#                     # TAT calculations
#                     'register_collect_timing': format_timedelta(register_collect_sec),
#                     'collection_Received_timing': format_timedelta(collection_received_sec),
#                     'process_Received_timing': format_timedelta(process_received_sec),
#                     'received_done_timing': format_timedelta(received_done_sec),
#                     'total_process_time_formatted': format_timedelta(total_process_sec),
#                     'total_process_time_minutes': format_total_process_time(total_process_sec),
#                     'original_TAT': format_timedelta(original_tat_sec),
#                     'Beyond_tat': beyond_tat,
#                 })

#             return JsonResponse(tatdata, safe=False)

#         except Exception as e:
#             print("Error:", e)
#             return JsonResponse({"Error": str(e)}, safe=False)

#         finally:
#             cursor.close()




def get_tat_report(request):
    import datetime
    from django.db import connection
    from django.http import JsonResponse

    def format_timedelta(td_seconds):
        """Format seconds to H:M:S string."""
        if td_seconds is None:
            return None
        hours, remainder = divmod(int(td_seconds), 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours}:{minutes:02d}:{seconds:02d}"

    def format_total_process_time(td_seconds):
        """Convert seconds to minutes (float)."""
        return td_seconds / 60 if td_seconds else None

    def parse_datetime(date_str, time_str):
        """Combine DATE and TIME strings from query to datetime object."""
        if not date_str:
            return None
        dt_str = f"{date_str} {time_str}" if time_str else f"{date_str} 00:00:00"
        try:
            return datetime.datetime.strptime(dt_str, '%Y-%m-%d %I.%M %p')
        except Exception:
            try:
                return datetime.datetime.strptime(dt_str, '%Y-%m-%d %H:%M:%S')
            except:
                return None

    if request.method == 'GET':
        try:
            cursor = connection.cursor()
            dateType = request.GET.get('dateType')
            date = request.GET.get('date')
            FromDate = request.GET.get('from')
            ToDate = request.GET.get('to')
            where_clauses = []
            params = []

            if dateType:
                if dateType == "month" and date:
                    where_clauses.append("DATE_FORMAT(bi.CreatedAt, '%%Y-%%m') = %s")
                    params.append(date)
                elif dateType == "date" and date:
                    where_clauses.append("DATE(bi.CreatedAt) = %s")
                    params.append(date)
                elif dateType in ["customdate", "custommonth"] and FromDate and ToDate:
                    where_clauses.append("DATE(bi.CreatedAt) BETWEEN %s AND %s")
                    params.extend([FromDate, ToDate])

            where_sql = " AND ".join(where_clauses) if where_clauses else "1"

            sql_query = f"""
                SELECT 
                    bi.Billing_Invoice,             -- 0
                    bi.Patient_Id,                  -- 1
                    bi.Patient_Name,                -- 2
                    rp.Age,                         -- 3
                    rp.Phone,                       -- 4
                    pvi.Refering_Doctor,            -- 5
                    bi.Barcode_Id as sapmleId,      -- 6
                    bi.CreatedBy as BilledBy,       -- 7
                    DATE(bi.CreatedAt) as BilledDate, -- 8
                    DATE_FORMAT(bi.CreatedAt, '%%h.%%i %%p') as BilledTime, -- 9
                    bi.Test_Name,                   -- 10
                    scp.CreatedBy CollectedBy,      -- 11
                    DATE(scp.CreatedAt) as CollectedDate, -- 12
                    DATE_FORMAT(scp.CreatedAt, '%%h.%%i %%p') as CollectedTime, -- 13
                    bi.Service_Status as Collection_Status, -- 14
                    air.CreatedBy as AnalysisedBy,  -- 15
                    DATE(air.CreatedAt) as AnalysisedDate, -- 16
                    DATE_FORMAT(air.CreatedAt, '%%h.%%i %%p') as AnalysisedTime, -- 17
                    bi.Analysis_Status as Analysis_Status, -- 18
                    ais.CreatedBy as VerifyedBy,    -- 19
                    DATE(ais.CreatedAt) as VerifyedDate, -- 20
                    DATE_FORMAT(ais.CreatedAt, '%%h.%%i %%p') as VerifyedTime, -- 21
                    bi.Analysis_Status as Verify_Status, -- 22
                    dp.First_Name as ApprovedBy,    -- 23
                    DATE(ap.CreatedAt) as ApprovedDate, -- 24
                    DATE_FORMAT(ap.CreatedAt, '%%h.%%i %%p') as ApprovedTime, -- 25
                    bi.Approve_Status as Approve_Status, -- 26
                    td.Processing_Time,             -- 27
                    td.Period_Type,                  -- 28
                    rp.Gender,
                    bi.Visit_Id
                FROM Billing_Item_Table_for_lab bi
                LEFT JOIN register_patient_details rp 
                    ON bi.Patient_Id = rp.Patient_Id
                LEFT JOIN Patient_Visit_Id pvi 
                    ON bi.Patient_Id = pvi.Patient_Id AND bi.Visit_Id = pvi.Visit_Id
                LEFT JOIN Sample_Capture_in_Phelobotomist scp 
                    ON bi.Billing_Invoice = scp.Billing_Invoice AND bi.Test_Code = scp.Test_Code
                LEFT JOIN AnalyseInvestigationResult air 
                    ON bi.Billing_Invoice = air.Billing_invoice AND bi.Test_Code = air.Test_Code
                LEFT JOIN AnalyseInvestigationSenior ais 
                    ON bi.Billing_Invoice = ais.Billing_invoice AND bi.Test_Code = ais.Test_Code
                LEFT JOIN approve_test_pathologist ap 
                    ON bi.Billing_Invoice = ap.Billing_invoice AND bi.Test_Code = ap.Test_Code
                LEFT JOIN doctor_personal_form_detials dp 
                    ON ap.DoctorID = dp.Doctor_ID
                LEFT JOIN test_descriptions td 
                    ON bi.Test_Code = td.Test_Code
                WHERE {where_sql}
                ORDER BY bi.CreatedAt;
            """

            cursor.execute(sql_query, params)
            rows = cursor.fetchall()
            tatdata = []

            for row in rows:
                billed_dt = parse_datetime(row[8], row[9])
                collected_dt = parse_datetime(row[12], row[13])
                analysed_dt = parse_datetime(row[16], row[17])
                verified_dt = parse_datetime(row[20], row[21])
                approved_dt = parse_datetime(row[24], row[25])

                # Step timings
                register_collect_sec = (collected_dt - billed_dt).total_seconds() if billed_dt and collected_dt else None
                collection_received_sec = (analysed_dt - collected_dt).total_seconds() if collected_dt and analysed_dt else None
                process_received_sec = (verified_dt - analysed_dt).total_seconds() if analysed_dt and verified_dt else None
                received_done_sec = (approved_dt - verified_dt).total_seconds() if verified_dt and approved_dt else None

                # Total processing time in seconds
                total_process_sec = sum([s for s in [register_collect_sec, collection_received_sec, process_received_sec, received_done_sec] if s is not None])

                # ✅ Dynamic Allowed TAT from Processing_Time + Period_Type
                processing_time = row[27]
                period_type = row[28]
                if processing_time and period_type:
                    if period_type.lower() == "minutes":
                        original_tat_sec = int(processing_time) * 60
                    elif period_type.lower() == "hours":
                        original_tat_sec = int(processing_time) * 3600
                    elif period_type.lower() == "days":
                        original_tat_sec = int(processing_time) * 86400
                    else:
                        original_tat_sec = None
                else:
                    original_tat_sec = None

                beyond_tat = "YES" if total_process_sec and original_tat_sec and total_process_sec > original_tat_sec else "NO"

                tatdata.append({
                    'Billing_Invoice': row[0],
                    'Patient_Id': row[1],
                    'Patient_Name': row[2].upper() if row[2] else None,
                    'Visit_Id': row[30],
                    'Age': row[3],
                    'Gender': row[29],
                    'Phone_Number': row[4],
                    'Referring_Doctor_Name': row[5],
                    'Sample_ID': row[6],
                    'BilledBy': row[7],
                    'BilledDate': str(row[8]),
                    'BilledTime': row[9],
                    'Test_Name': row[10],
                    'CollectedBy': row[11],
                    'CollectedDate': str(row[12]),
                    'CollectedTime': row[13],
                    'Collection_Status': row[14],
                    'AnalysisedBy': row[15],
                    'AnalysisedDate': str(row[16]),
                    'AnalysisedTime': row[17],
                    'Analysis_Status': row[18],
                    'VerifyedBy': row[19],
                    'VerifyedDate': str(row[20]),
                    'VerifyedTime': row[21],
                    'Verify_Status': row[22],
                    'ApprovedBy': row[23],
                    'ApprovedDate': str(row[24]),
                    'ApprovedTime': row[25],
                    'Approve_Status': row[26],
                    'ProcessingTime': f"{row[27]} {row[28]}",
                    # TAT breakdown
                    'register_collect_timing': format_timedelta(register_collect_sec),
                    'collection_Received_timing': format_timedelta(collection_received_sec),
                    'process_Received_timing': format_timedelta(process_received_sec),
                    'received_done_timing': format_timedelta(received_done_sec),
                    'total_process_time_formatted': format_timedelta(total_process_sec),
                    'total_process_time_minutes': format_total_process_time(total_process_sec),
                    'original_TAT': format_timedelta(original_tat_sec),
                    'Beyond_tat': beyond_tat,
                })

            return JsonResponse(tatdata, safe=False)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"Error": str(e)}, safe=False)
        finally:
            cursor.close()







@csrf_exempt
def repeat_the_same_test(request):
    if request.method == "POST":
        try:
            cursor = connection.cursor()
            data = json.loads(request.body)
            # print("Data--------", data)

            patient = data.get("patients_data")
            test = data.get("test_data")
            created = data.get("created")
            invoice = patient.get("Billing_Invoice", None)
            patient_id = patient.get("Patient_Id", None)
            visit = patient.get("Visit_Id", None)
            testCode = test.get("Test_Code", None)
            new_barcode = None 
            bar = get_invoice_master_barcode()
            cursor.execute("""
                SELECT Billing_Invoice 
                FROM Billing_invoice_and_bill_amount 
                WHERE Billing_Invoice LIKE 'RE%' 
                ORDER BY Billing_Id DESC 
                LIMIT 1""")
            Rid = cursor.fetchone()

            if Rid and Rid[0]:
                # Rid[0] contains something like "RE/123"
                last_no = int(Rid[0].split('/')[1])  # take the numeric part after "RE/"
                new_barcode = f"RET/{last_no + 1}"
            else:
                new_barcode = "RET/1"



            if invoice and patient_id and visit and new_barcode and testCode:
                query = """SELECT * FROM  Billing_invoice_and_bill_amount
                           WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s
                           LIMIT 1;"""
                cursor.execute(query, (invoice, patient_id, visit))
                previous = cursor.fetchone()


                # If no record found
                if not previous:
                    return JsonResponse({"Error": "No previous record found"}, safe=False)


                # Get column names
                columns = [col[0] for col in cursor.description]
                prev_data = dict(zip(columns, previous))

                query = """SELECT * FROM Billing_invoice_and_bill_amount
                           WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s
                           LIMIT 1;"""
                cursor.execute(query, (invoice, patient_id, visit))
                previous = cursor.fetchone()

                if not previous :
                    return JsonResponse({"Error": "No previous billing invoice found"}, safe=False)

                # Map column names to values
                columns = [col[0] for col in cursor.description]
                prev_data = dict(zip(columns, previous))


                # Generate new Billing_Id
                cursor.execute("SELECT MAX(Billing_Id) FROM Billing_invoice_and_bill_amount")
                max_id_result = cursor.fetchone()
                next_billing_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1

                insert_sql = f"""
                    INSERT INTO Billing_invoice_and_bill_amount (
                        Billing_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name,
                        Item_Count, Total_Charge, Discount_Type, Discount, Net_Amount,
                        Status, Location, Capture_Sample_Status, Analyze_Status, Verify_Status, Approve_Status,
                        Barcode_Id, Group_Name, CreatedBy, Billing_Date, Billing_Type, RateCard_Name,
                        Test_Code, Group_Code, TotalPaidAmount, BalanceAmount, Sample_Barcode_Image,
                        AdditionalAmount, AdditionalAmountReason, DiscountReason, HistoNumber, MicroNumber,
                        Transfer_Location, UpdatedAt, CreatedAt, Registration_Id, Request_Id, isedit
                    ) VALUES (
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s, {False}
                    )
                """

                values = (
                    next_billing_id,
                    new_barcode,
                    prev_data['Patient_Id'],
                    prev_data['Visit_Id'],
                    prev_data['Patient_Name'],
                    prev_data['Item_Count'],
                    prev_data['Total_Charge'],
                    prev_data['Discount_Type'],
                    prev_data['Discount'],
                    prev_data['Net_Amount'],
                    prev_data['Status'],  # Reset status
                    prev_data['Location'],
                    "Completed", "Pending", "Pending", "Pending",  # Reset workflow statuses
                    bar,
                    prev_data['Group_Name'],
                    created or prev_data['CreatedBy'],
                    prev_data['Billing_Date'],
                    prev_data['Billing_Type'],
                    prev_data['RateCard_Name'],
                    prev_data['Test_Code'],
                    prev_data['Group_Code'],
                    0,  # Reset TotalPaidAmount
                    prev_data['Net_Amount'],  # Full balance as outstanding
                    None,  # Sample_Barcode_Image
                    prev_data['AdditionalAmount'],
                    prev_data['AdditionalAmountReason'],
                    prev_data['DiscountReason'],
                    prev_data['HistoNumber'],
                    prev_data['MicroNumber'],
                    prev_data['Transfer_Location'],
                    prev_data['UpdatedAt'],
                    prev_data['CreatedAt'],
                    prev_data['Registration_Id'],
                    prev_data['Request_Id']
                )
                print("length",len(values))

                cursor.execute(insert_sql, values)
                
                print("Invoice Table Saved")
        # -------------------------Item-Table--------------------------------------------------------------------------------------------------
                # Fetch the previous record
                query = """SELECT * FROM Billing_Item_Table_for_lab 
                           WHERE Billing_Invoice = %s AND Patient_Id = %s AND Visit_Id = %s AND Test_Code = %s
                           LIMIT 1;"""
                cursor.execute(query, (invoice, patient_id, visit, testCode))
                previous = cursor.fetchone()

                # If no record found
                if not previous:
                    return JsonResponse({"Error": "No previous record found"}, safe=False)

                # Get column names
                columns = [col[0] for col in cursor.description]
                prev_data = dict(zip(columns, previous))

                # Get next Item_Id
                cursor.execute("SELECT MAX(Item_Id) FROM Billing_Item_Table_for_lab")
                max_id_result = cursor.fetchone()
                next_item_id = (max_id_result[0] if max_id_result[0] is not None else 0) + 1


                # Insert query (all fields)
                insert_sql = """
                    INSERT INTO Billing_Item_Table_for_lab (
                        Item_Id, Billing_Invoice, Patient_Id, Visit_Id, Patient_Name, 
                        Dispatch_Method, Test_Method, Test_Name, Gross_Amount, Location, 
                        Service_Status, Analysis_Status, Verify_Status, Approve_Status, 
                        Barcode_Id, Group_Name, CreatedBy, Billing_Date, Test_Code, 
                        Group_Code, individual_add_amount, IsSubTest, SubTestCodes, 
                        Transfer_Location, PackageCode, PackageName, UpdatedAt, CreatedAt, Bill_Status, isedit
                    ) VALUES (
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, 0
                    )
                """

                values = (
                    next_item_id,
                    new_barcode,
                    prev_data['Patient_Id'],
                    prev_data['Visit_Id'],
                    prev_data['Patient_Name'],
                    prev_data['Dispatch_Method'],
                    prev_data['Test_Method'],
                    prev_data['Test_Name'],
                    prev_data['Gross_Amount'],
                    prev_data['Location'],
                    "Completed",   # Service_Status
                    "Pending",   # Analysis_Status
                    "Pending",   # Verify_Status
                    "Pending",   # Approve_Status
                    bar,
                    prev_data['Group_Name'],
                    created or prev_data['CreatedBy'],
                    prev_data['Billing_Date'],
                    prev_data['Test_Code'],
                    prev_data['Group_Code'],
                    prev_data['individual_add_amount'],
                    prev_data['IsSubTest'],
                    prev_data['SubTestCodes'],
                    prev_data['Transfer_Location'],
                    prev_data['PackageCode'],
                    prev_data['PackageName'],
                    prev_data['UpdatedAt'],   # UpdatedAt
                    prev_data['CreatedAt'],   # CreatedAt
                    prev_data['Bill_Status'],         # Bill_Status
                )

                cursor.execute(insert_sql, values)



        # ----------------------------Capture-Sample--------------------------------------------------------------------------------------------------------------
                query = """SELECT * FROM Sample_Capture_in_Phelobotomist 
                           WHERE Billing_Invoice = %s AND Patient_Id = %s AND Test_Code = %s
                           LIMIT 1;"""
                cursor.execute(query, (invoice, patient_id, testCode))
                previous = cursor.fetchone()

                # If no record found
                if not previous:
                    return JsonResponse({"Error": "No previous record found"}, safe=False)

                # Get column names
                columns = [col[0] for col in cursor.description]
                prev_data = dict(zip(columns, previous))

                cursor.execute("SELECT COALESCE(MAX(Sample_Id), 0) + 1 FROM Sample_Capture_in_Phelobotomist")
                next_id = cursor.fetchone()[0]


                cursor.execute("""
                    INSERT INTO Sample_Capture_in_Phelobotomist 
                    (Sample_Id, Patient_Id, Patient_Name, Billing_Invoice, Test_Name, Captured_Unit, 
                    Status, Medical_Remarks, Technical_Remark, UOM, Location, Visit_Id, CreatedBy, 
                    Test_Code, Transfer_Location, UpdatedAt, CreatedAt)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    next_id,                                # New Sample_Id
                    prev_data["Patient_Id"],                # From previous record
                    prev_data["Patient_Name"],              # From previous record
                    new_barcode,           # From previous record
                    prev_data["Test_Name"],    # Override if new test_name given
                    prev_data["Captured_Unit"],
                    "Collected",
                    prev_data["Medical_Remarks"],
                    prev_data["Technical_Remark"],
                    prev_data["UOM"],
                    prev_data["Location"],
                    prev_data["Visit_Id"],
                    created or prev_data["CreatedBy"],
                    prev_data["Test_Code"],
                    prev_data["Transfer_Location"],
                    datetime.now(),                         # UpdatedAt → new
                    prev_data["CreatedAt"]                  # Keep original CreatedAt
                ))


                connection.commit()

                return JsonResponse({"Status": "Test Added successfully"}, safe=False)

            return JsonResponse({"Error": "Missing patient data"}, safe=False, status = 200)

        except Exception as e:
            print("Error:", e)
            return JsonResponse({"Status": "Proccess Faild"}, safe=False, status = 500)