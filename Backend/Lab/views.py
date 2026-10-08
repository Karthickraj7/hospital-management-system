from django.shortcuts import render
import base64
from django.http import JsonResponse
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection

from django.views.decorators.http import require_http_methods
# from backend.db_connect import get_db_connection, get_db_cursor
from django.db import connection as db










# def table_exists(cursor, table_name):
#     cursor.execute("SHOW TABLES LIKE %s", (table_name,))
#     return cursor.fetchone() is not None

# def create_table_if_not_exists(table_name, column_definitions):
    
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




# create_table_if_not_exists("UserControl_location",
#                     """location_id INT PRIMARY KEY,
#                         location_name VARCHAR(255),
#                         Status VARCHAR(10),
#                         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")

# create_table_if_not_exists("Organization_Details", 
#                         """
#                         S_No bigint PRIMARY KEY,
#                         Organization VARCHAR(60),
#                         Email VARCHAR(50),
#                         Phone_no VARCHAR(20),
#                         Land_line VARCHAR(20),
#                         Gst_No VARCHAR(20),
#                         Door_no VARCHAR(20),
#                         Street VARCHAR(200),
#                         Area VARCHAR(200),
#                         City VARCHAR(500),
#                         Pincode VARCHAR(10),
#                         State VARCHAR(150),
#                         Country VARCHAR(50),
#                         Location VARCHAR(50),
#                         UpdatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt timestamp DEFAULT CURRENT_TIMESTAMP""")

# create_table_if_not_exists("External_Lab_Details","""
#                            S_No BIGINT PRIMARY KEY,
#                            Lab_Name VARCHAR(100),
#                            Register_No VARCHAR(25),
#                            Labcode VARCHAR(10),
#                            Address VARCHAR(500),
#                            Email VARCHAR(100),
#                            Phone_No VARCHAR(20),
#                            Pincode VARCHAR(20),
#                            Referencecode VARCHAR(20),
#                            SourceType VARCHAR(30),
#                            Location VARCHAR(50),
#                            UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")


# create_table_if_not_exists("Age_Setup_Master","""
#                             S_No BIGINT PRIMARY KEY,
#                             TestName VARCHAR(250),
#                             Gender VARCHAR(50),
#                             FromAge VARCHAR(10),
#                             FromAgeType VARCHAR(20),
#                             Toage  VARCHAR(20),
#                             ToAgeType VARCHAR(20),
#                             From_Value VARCHAR(30),
#                             To_Value VARCHAR(30),
#                             PanicLow VARCHAR(30),
#                             PanicHigh VARCHAR(30),
#                             NormalValue VARCHAR(30),
#                             Reference_Range VARCHAR(350),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")

# # --------------------------------------------------------------
# create_table_if_not_exists("suppliermaster_information", """
#                             SupplierCode varchar(50) PRIMARY KEY,
#                             SupplierName varchar(50),
#                             SupplierGST varchar(50),
#                             SupplierType varchar(25),
#                             country varchar(25),
#                             state varchar(50),
#                             city varchar(50),
#                             place varchar(50),
#                             street varchar(50),
#                             email varchar(50),
#                             phoneno bigint,
#                             alternatephoneno bigint,
#                             BankName varchar(50),
#                             BranchName varchar(50),
#                             AccountNo varchar(50),
#                             IfscCode varchar(50),
#                             PancardNo varchar(50),
#                             ShortName varchar(50),
#                             Website varchar(250),
#                             Remarks varchar(100),
#                             ConcernForm longblob,
#                             Created_By varchar(25),
#                             Status varchar(25),
#                             Location varchar(50),
#                             Payment_Due_Days INT,
#                             UpdatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt timestamp DEFAULT CURRENT_TIMESTAMP""")




def get_location_data(request):
    try:
        
        cursor = db.cursor()

        # Select role data from the database
        query = "SELECT * FROM UserControl_location"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        location_data = []
        for row in result:
            location_dict = {
                'location_id': row[0],
                'location_name': row[1].strip(),
                'status': row[2]
            }
            location_data.append(location_dict)

        # Return the role data as JSON
        return JsonResponse(location_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)






# ---------------------------------insert location ---------------------------------------------------------------------

@csrf_exempt
def insert_location(request):
        

            try:
                
                cursor = db.cursor()

                # Get the role name from the request data
                location_name = request.POST.get('locationname')
                status='Active'

                # Capitalize the first letter and convert the rest to lowercase
            

                # SQL query to check if the role_name already exists
                check_query = "SELECT COUNT(*) FROM UserControl_location WHERE location_name = %s"
                cursor.execute(check_query, (location_name,))
                existing_count = cursor.fetchone()[0]  # Count of existing roles with the same name

                if existing_count > 0:
                    # Role with the same name already exists, return an error message
                    response_data = {'error': 'Location with the same name already exists'}
                else:
                    # Role doesn't exist, proceed to insert
                    # SQL query to fetch the highest existing role_id
                    next_id = 1
                    max_id_query = "SELECT MAX(location_id) AS maxId FROM UserControl_location"
                    cursor.execute(max_id_query)
                    max_id = cursor.fetchone()[0]

                    next_id = max_id + 1 if max_id is not None else 1

                    # SQL query to insert a new record with placeholders
                    insert_query = "INSERT INTO UserControl_location (location_id, location_name,Status) VALUES (%s, %s,%s)"
                    cursor.execute(insert_query, (next_id, location_name,status))
                    db.commit()

                    response_data = {'message': 'Location inserted successfully'}

                return JsonResponse(response_data)

            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}), 500
            finally:
                cursor.close()
                db.close()


#---------------------------Insert into Oraganization---------------------------------#
@csrf_exempt
def insert_organization(request):
    if request.method == 'POST':
        try:
            
            cursor = db.cursor()

            # Parse JSON data from request body
            data = json.loads(request.body)

            # Calculate the next available user_id
            cursor.execute("SELECT MAX(S_No) FROM Organization_Details")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            # Extract fields from the request data
            name = data.get('concernName')
            mail = data.get('email')
            phno = data.get('phoneNo')
            landlineno = data.get('landline_no')
            gstno = data.get('Gst_no')
            doornum = data.get('doorNo')
            Street = data.get('street')
            Area = data.get('area')
            City = data.get('city')
            pcode = data.get('pincode')
            State = data.get('state')
            Country = data.get('country')
            location = data.get('location')

            check_query = "SELECT * FROM Organization_Details WHERE S_No = %s"
            cursor.execute(check_query, (1,))  # Assuming concern_id is always 1 for checking
            existing_data = cursor.fetchone()

            if existing_data:
                update_query = """UPDATE Organization_Details
                                  SET Organization = %s, Email = %s, Phone_no = %s, Land_line = %s, Gst_No = %s, 
                                  Door_no = %s, Street = %s, Area = %s, City = %s, Pincode = %s, State = %s, 
                                  Country = %s, Location = %s WHERE  S_No= %s"""
                cursor.execute(update_query, (name, mail, phno, landlineno, gstno, doornum, Street, Area, City, pcode, State, Country, location, 1))
            else:
                insert_query = """INSERT INTO Organization_Details 
                                  (S_No, Organization, Email, Phone_no, Land_line, Gst_No, Door_no, Street, Area, City, 
                                  Pincode, State, Country, Location) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
                cursor.execute(insert_query, (next_id, name, mail, phno, landlineno, gstno, doornum, Street, Area, City, pcode, State, Country, location))

            db.commit()
            return JsonResponse({'message': 'Organization information processed successfully'})

        except Exception as e:
            # It's generally a bad idea to print errors in production environments; consider logging instead
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'This endpoint only supports POST requests'}, status=405)


@csrf_exempt
def get_organization(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()

            # Fetch organization details from the database
            cursor.execute("SELECT * FROM Organization_Details")
            organization_details = cursor.fetchall()

            # Format the data into a list of dictionaries
            organization_list = []
            for org in organization_details:
                organization_list.append({
                    'S_No': org[0],
                    'Organization': org[1],
                    'Email': org[2],
                    'Phone_no': org[3],
                    'Land_line': org[4],
                    'Gst_No': org[5],
                    'Door_no': org[6],
                    'Street': org[7],
                    'Area': org[8],
                    'City': org[9],
                    'Pincode': org[10],
                    'State': org[11],
                    'Country': org[12],
                    'Location': org[13]
                })

            return JsonResponse(organization_list, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'This endpoint only supports GET requests'}, status=405)


#---------------------------Insert into Oraganization---------------------------------#

@csrf_exempt
def insert_agesetup_lab(request):
    if request.method == 'POST':
        try:
              # Ensure get_db_connection() is defined elsewhere to get a DB connection
            cursor = db.cursor()

            # Parse JSON data from the request body
            data = json.loads(request.body)
            print('data :',data)
            # Calculate the next available S_No
            cursor.execute("SELECT MAX(S_No) FROM Age_Setup_Master")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            # Extract fields from the request data
            testName = data.get('testname')
            gender = data.get('gender')
            fromAge = data.get('fromAge')
            fromAgeType = data.get('ageType')  # Corrected from your provided data structure
            toAge = data.get('toAge')
            toAgeType = data.get('toAgeType')  # Corrected from your provided data structure
            fromValue = data.get('fromvalue')  # Corrected to match your provided field
            toValue = data.get('tovalue')  # Corrected to match your provided field
            panicLow = data.get('panicLow')
            panicHigh = data.get('panicHigh')
            reference = data.get('referencerange')
            print('reference', reference)
            referencerange = reference if reference is not None and reference != '' else 'None'
            print('referencerange', referencerange)
            Test_Code = data.get('testcode')
            
            if referencerange != 'None':
                summa = 'Yes'
            else:
                summa = 'No'
            

            # Insert query corrected to include all relevant columns
            insert_query = """INSERT INTO Age_Setup_Master
                              (S_No, TestName, Gender, FromAge, FromAgeType, Toage, ToAgeType, From_Value, To_Value, PanicLow, PanicHigh, Reference_Range, NormalValue,Test_Code)
                              VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(insert_query, (next_id, testName, gender, fromAge, fromAgeType, toAge, toAgeType, fromValue, toValue, panicLow, panicHigh, referencerange, summa,Test_Code))

            db.commit()
            return JsonResponse({'message': 'Age setup information processed successfully'})

        except Exception as e:
            # It's a good practice to log errors
            print({'error': f'An internal server error occurred: {str(e)}'})
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
        finally:
            if cursor: cursor.close()
            if db: db.close()
    else:
        return JsonResponse({'error': 'This endpoint only supports POST requests'}, status=405)
    


@csrf_exempt
def insert_external_lab(request):
    if request.method == 'POST':
        try:
              # Ensure this function returns a valid DB connection
            cursor = db.cursor()

            # Parse JSON data from request body
            data = json.loads(request.body)
            print('data', data)

            # Calculate the next available S_No in External_Lab_Details
            cursor.execute("SELECT MAX(S_No) FROM External_Lab_Details")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            # Extract and process fields from the request data
            labName = data.get('labName')
            if labName:
                # Convert to CamelCase by capitalizing each word and joining without spaces
                column_name = ''.join(word.capitalize() for word in labName.split())

            registerNo = data.get('registerNo')
            labCode = data.get('labCode')
            address = data.get('address')
            email = data.get('email')
            phoneNumber = data.get('phoneNumber')
            pincode = data.get('pincode')
            referenceCode = data.get('referenceCode')
            source = data.get('source')
            location = data.get('location')

            # Insert into External_Lab_Details table
            insert_query = """INSERT INTO External_Lab_Details
                              (S_No, Lab_Name, Register_No, Labcode, Address, Email, Phone_No, Pincode, Referencecode, SourceType, Location)
                              VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(insert_query, (next_id, labName, registerNo, labCode, address, email, phoneNumber, pincode, referenceCode, source, location))

            # Add a new column to the Testmaster_Cost_List table using the CamelCase column name
            alter_query = f"ALTER TABLE Testmaster_Cost_List ADD COLUMN {column_name} DECIMAL(10,3) DEFAULT 0.000"
            cursor.execute(alter_query)

            db.commit()
            return JsonResponse({'message': 'External Lab information processed successfully and Testmaster_Cost_List updated'})

        except Exception as e:
            print({'error': f'An internal server error occurred: {str(e)}'})
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'This endpoint only supports POST requests'}, status=405)







def generate_next_key(current_max_id):
    prefix = "SUPMA"
    # Extract the numeric part of the ID. Assuming current_max_id format is "SUPMA0000012"
    numeric_part = int(current_max_id.replace(prefix, '')) + 1
    # Format the new ID with leading zeros
    new_id = f"{prefix}{str(numeric_part).zfill(7)}"
    return new_id

@require_http_methods(["GET"])
def get_supplier_master_code(request):
    try:
        with connection.cursor() as cursor:
            next_id = 'SUPMA0000001'  # Default initial value

            max_id_query = "SELECT MAX(SupplierCode) FROM suppliermaster_information"
            cursor.execute(max_id_query)
            max_id = cursor.fetchone()[0]

            if max_id:
                next_id = generate_next_key(max_id)

            response = {
                "message": "Success",
                "nextSupplierCode": next_id
            }

            return JsonResponse(response)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
def insert_supplier_master_data(request):
    try:
        
        cursor = db.cursor()
        print('request :',request)

        # data = json.loads(request.body)
        
        # print('data :',data)
        SupplierCode = request.POST.get('SupplierCode')
        max_id_query = "SELECT MAX(SupplierCode) FROM suppliermaster_information"
        cursor.execute(max_id_query)
        max_id = cursor.fetchone()[0]

        if max_id == SupplierCode:
            Supplier = generate_next_key(SupplierCode)
        else:
            Supplier = SupplierCode

        SupplierName = request.POST.get('SupplierName')
        SupplierGST = request.POST.get('SupplierGST')
        SupplierType = request.POST.get('SupplierType')
        country = request.POST.get('country')
        state = request.POST.get('state')
        city = request.POST.get('city')
        place = request.POST.get('place')
        street = request.POST.get('street')
        email = request.POST.get('email')
        phoneno = request.POST.get('phoneno')
        alternate_no = request.POST.get('alternate_no')
        BankName = request.POST.get('BankName')
        BranchName = request.POST.get('BranchName')
        AccountNo = request.POST.get('AccountNo')
        IfscCode = request.POST.get('IfscCode')
        PancardNo = request.POST.get('PancardNo')
        ShortName = request.POST.get('ShortName')
        Website = request.POST.get('Website')
        Remarks = request.POST.get('Remarks')
        createdby = request.POST.get('createdby')
        Status = request.POST.get('Status')
        Payment_Due_Days = request.POST.get('Payment_Due_Days')
        # Defaulting Location to 'Store'
        Location = 'Store'
        concern_form_file = request.FILES.get('ConcernForm')
        concern_form_content = concern_form_file.read() 


        # ConcernForm = base64.b64decode(ConcernForm_encoded) if ConcernForm_encoded else None

        sql_query = """
        INSERT INTO suppliermaster_information 
            (SupplierCode, SupplierName, SupplierGST, SupplierType, country, state, city, place, street,
            email, phoneno, alternatephoneno, BankName, BranchName, AccountNo, IfscCode, PancardNo,
            ShortName, Website, Remarks, ConcernForm, Created_By, Status, Location, Payment_Due_Days)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql_query, (Supplier, SupplierName, SupplierGST, SupplierType, country, state, city,
                                   place, street, email, phoneno, alternate_no, BankName, BranchName,
                                   AccountNo, IfscCode, PancardNo, ShortName, Website, Remarks,
                                   concern_form_content, createdby, Status, Location, Payment_Due_Days))

        db.commit()
        response_data = {'message': 'Data inserted successfully'}
        return JsonResponse(response_data)

    except Exception as e:
        print({f'error :':f'{str(e)}'})
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
    finally:
        cursor.close()
        db.close()
   

# @require_http_methods(["GET"])
# def get_supplier_image(request):
#     try:
#         db= get_db_connection()
#         cursor= db.cursor()

#         max_id_query = "SELECT ConcernForm FROM suppliermaster_information"
#         data = cursor.execute(max_id_query)



#     except Exception as e:
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#     finally:
#         cursor.close()
#         db.close()
        


@csrf_exempt
def get_external_lab(request):
    if request.method == 'GET':
        try:
            
            cursor = db.cursor()

            # Adjusted SQL to match the intended fields
            cursor.execute("SELECT S_No, Lab_Name, Register_No, Labcode, Address, Email, Phone_No, Pincode, Referencecode, SourceType, Location FROM External_Lab_Details")
            lab_details = cursor.fetchall()

            # Adjust the dictionary to match the selected fields
            lab_list = [{
                'S_No': lab[0],
                'Lab_Name': lab[1],
                'Register_No': lab[2],
                'Labcode': lab[3],
                'Address': lab[4],
                'Email': lab[5],
                'Phone_No': lab[6],
                'Pincode': lab[7],
                'Referencecode': lab[8],
                'SourceType': lab[9],
                'Location': lab[10]
            } for lab in lab_details]

            return JsonResponse(lab_list, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
        finally:
            if cursor: cursor.close()
            if db: db.close()
    else:
        return JsonResponse({'error': 'This endpoint only supports GET requests'}, status=405)



# def getApprovesign(request):
#     try:
#         
#         cursor = db.cursor()
        
        
        
#         query = """SELECT DoctorSign,Designation FROM employee_rollmanagemnt WHERE  EmployeeID='CHE000001'"""
#         cursor.execute(query)
#         data = cursor.fetchall()
        
        
#         result = [{'DoctorSign': f'data:image/jpg;base64,{base64.b64encode(i[0]).decode("utf-8")}','Designation':  i[1]} for i in data]
        
#         return JsonResponse(result,safe=False)
        
#     except Exception as e:
#         return JsonResponse({'Error':str(e)})
#     finally:
#         cursor.close()
#         db.close()




def getTestCode(request):
    try:
        
        cursor = db.cursor()
        
        
        query = """SELECT MAX(Test_Code) FROM Test_Descriptions"""
        cursor.execute(query)
        data = cursor.fetchone()
        
        if data and data[0]:
            max_test_code = data[0]
            # Extract the numeric part and increment it
            numeric_part = int(max_test_code[2:]) + 1
            # Format it back to the desired format
            new_test_code = f'RD{numeric_part:04d}'
        else:
            new_test_code = 'RD0001'
        
        return JsonResponse({'TestCode': new_test_code})
        
        
    except Exception as e:
        return JsonResponse({'Error':str(e)})
    finally:
        cursor.close()
        db.close()
        
        
        


def getGroupCode(request):
    try:
        
        cursor = db.cursor()
        
        
        query = """SELECT MAX(group_code) FROM GroupMaster"""
        cursor.execute(query)
        data = cursor.fetchone()
        
        if data and data[0]:
            max_test_code = data[0]
            # Extract the numeric part and increment it
            numeric_part = int(max_test_code[2:]) + 1
            # Format it back to the desired format
            new_test_code = f'GM{numeric_part:04d}'
        else:
            new_test_code = 'GM0001'
        
        return JsonResponse({'GroupCode': new_test_code})
        
        
    except Exception as e:
        return JsonResponse({'Error':str(e)})
    finally:
        cursor.close()
        db.close()