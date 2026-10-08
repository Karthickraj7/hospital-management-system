from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
import json
import pandas as pd
from datetime import datetime
from django.conf import settings
import base64
import hashlib
from django.shortcuts import get_object_or_404

from django.db import connection as db
from Masters.models import *
import filetype

# def table_exists(cursor, table_name):
#     cursor.execute("SHOW TABLES LIKE %s", (table_name,))
#     return cursor.fetchone() is not None

# def create_table_if_not_exists(table_name, column_definitions):
    # db = get_db_connection()
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

# create_table_if_not_exists("Test_Descriptions","""
#                            Test_Id INT PRIMARY KEY,
#                            Test_Name VARCHAR(1000),
#                            Test_Code VARCHAR(50),
#                            Department VARCHAR(200),
#                            Sub_Department VARCHAR(200),
#                            Header VARCHAR(1000),
#                            Display_Text VARCHAR(1000),
#                            Billing_Name VARCHAR(1000),
#                            Container_Name VARCHAR(300),
#                            Specimen_Name VARCHAR(300),
#                            Method_Name VARCHAR(300),
#                            Gender VARCHAR(300),
#                            Input_Type VARCHAR(390),
#                            Decimal_Palces INT,
#                            Input_Pattern_Type  VARCHAR(200),
#                            Test_Category VARCHAR(300),
#                            Logical_Category VARCHAR(300),
#                            Captured_Unit VARCHAR(30),                        
#                            UOM VARCHAR(30),
#                            Report_Type VARCHAR(200),
#                            Test_Instructions VARCHAR(500),
#                            Loinc_Code VARCHAR(200),
#                            Allow_Discount VARCHAR(20),
#                            Oderable VARCHAR(30),
#                            Show_Graph VARCHAR(30),
#                            Active_Status VARCHAR(30),
#                            STAT VARCHAR(35),
#                            Non_Reportable VARCHAR(20),
#                            Calculated_Test VARCHAR(30),
#                            Outsourced VARCHAR(20),
#                            Processing_Time VARCHAR(20),
#                            Emergency_Processing_Time VARCHAR(20),
#                            Period_Type VARCHAR(20),
#                            Formula VARCHAR(150),
#                            Parameter_One VARCHAR(200),
#                            Parameter_Two VARCHAR(200),
#                            Autocheck VARCHAR(20),
#                            Culturetest VARCHAR(20),
#                            Is_NABHL VARCHAR(20),
#                            Is_CAP VARCHAR(20),
#                            Is_Machine_Interfaced VARCHAR(20),
#                            Machine_Name VARCHAR(250),
#                            Reagent_Level VARCHAR(25),
#                            Assay_Code VARCHAR(25),
#                            UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                 """)


# create_table_if_not_exists("Testmaster_Remarks","""
#                             Test_Id INT PRIMARY KEY,
#                             Test_Name VARCHAR(1000),
#                             Validation VARCHAR(200),
#                             Remark_Type VARCHAR(500),
#                             Remark      VARCHAR(550),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)

# create_table_if_not_exists("Testmaster_Reference_Range",
#                             """
#                             Test_Id INT PRIMARY KEY,
#                             Test_Name VARCHAR(1000),
#                             Analizer_Type VARCHAR(350),
#                             validation VARCHAR(300),
#                             Method_Type VARCHAR(350),
#                             Gender VARCHAR(50),
#                             Range_Lower_Limit INT,
#                             Range_Higher_Limit INT,
#                             Reference_Range_Text VARCHAR(400),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Testmaster_Cost_List","""
#                             Test_id INT PRIMARY KEY,
#                             Test_Name VARCHAR(1000),
#                             Basic DECIMAL(10, 3),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Testmaster_Rule_Based","""
#                             Test_Id INT PRIMARY KEY,
#                             Test_Name VARCHAR(1000),
#                             Validation_type VARCHAR(250),
#                             Gender VARCHAR(55),
#                             Rule_Type VARCHAR(300),
#                             Remark VARCHAR(350),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Testmaster_Interpretation_table","""
#                             Test_Id INT PRIMARY KEY,
#                             Test_Name VARCHAR(1000),
#                             Header_interpretation VARCHAR(200),
#                             Comments VARCHAR(2000),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("Testmaster_Reflex_Test","""
#                             Test_id INT PRIMARY KEY,
#                             Test_Name VARCHAR(200),
#                             Main_Test VARCHAR(200),
#                             Reflex_Test VARCHAR(200),
#                             Reflex_Code VARCHAR(200),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)


# create_table_if_not_exists("AntibioticGroups",
#     """anti_biotic_group_id INT PRIMARY KEY,
#        anti_biotic_group_code VARCHAR(100),
#        anti_biotic_group_des VARCHAR(100),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )

# create_table_if_not_exists("AntibioticMaster",
#     """anti_biotic_id INT PRIMARY KEY,
#        anti_biotic_group_code VARCHAR(100),
#        anti_biotic_code VARCHAR(100),
#        anti_biotic_des VARCHAR(100),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )
# create_table_if_not_exists("OrganismMaster",
#     """organism_id INT PRIMARY KEY,
#        organism_code VARCHAR(100),
#        organism_name VARCHAR(100),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )

# create_table_if_not_exists("GroupMaster",
#     """group_master_id INT PRIMARY KEY,
#        group_code VARCHAR(100),
#        group_name VARCHAR(100),
#        display_name VARCHAR(100),
#        billing_code VARCHAR(100),
#        billing_name VARCHAR(100),
#        gender VARCHAR(100),
#        report VARCHAR(100),
#        department_name VARCHAR(100),
#        test_category VARCHAR(100),
#        logical_category VARCHAR(100),
#        authorized_user VARCHAR(100),
#        loinc_code VARCHAR(100),
#        InterpretationHead VARCHAR(500),
#        Interpretation VARCHAR(5000),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )

# create_table_if_not_exists("GroupMasterTestList",
#     """Groupmaster_testlist_id INT PRIMARY KEY,
#        group_code VARCHAR(100),
#        group_name VARCHAR(100),
#        test_name VARCHAR(100),
#        Test_Code VARCHAR(50),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )

# create_table_if_not_exists("Refering_Doctor_Commission","""
#                             Commission_Id INT PRIMARY KEY, 
#                             Doctor_Name VARCHAR(120),
#                             Doctor_Type VARCHAR(55),
#                             Phone VARCHAR(15),
#                             Commission_Percentage VARCHAR(10),
#                             Address_One VARCHAR(350),
#                             Address_Two VARCHAR(450),
#                             Status VARCHAR(200),
#                             Payment_Type VARCHAR(200),
#                             Bank_Name VARCHAR(300),
#                             Holder_Name VARCHAR(450),
#                             Account_Number VARCHAR(30),
#                             Location VARCHAR(55),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#                         """)

# create_table_if_not_exists("Outsource_Ratecard_List", """
#                             Ratecard_Id VARCHAR(10) PRIMARY KEY,
#                             Test_Name VARCHAR(350),
#                             CreatedBy VARCHAR(155),
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# """)

# create_table_if_not_exists("OfferPackage",
#     """offer_package_id INT PRIMARY KEY,
#        package_code VARCHAR(100),
#        package_name VARCHAR(100),
#        display_name VARCHAR(100),
#        gender VARCHAR(100),
#        report VARCHAR(100),
#        department_name VARCHAR(100),
#        test_category VARCHAR(100),
#        logical_category VARCHAR(100),
#        authorized_user VARCHAR(100),
#        Package_Cost decimal(10,3),
#        Status VARCHAR(255),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )
# create_table_if_not_exists("OfferPackageList",
#     """offer_package_list_id INT PRIMARY KEY,
#        package_code VARCHAR(100),
#        package_name VARCHAR(100),
#        test_name VARCHAR(100),
#        Test_Code VARCHAR(50),
#        Test_Method VARCHAR(255),
#        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP"""
# )

# create_table_if_not_exists("Word_Document_for_result", """
#                             Document_Id INT PRIMARY KEY,
#                             Department_Name VARCHAR(299),
#                             Test_Name VARCHAR(1000),
#                             Word_File LONGBLOB,
#                             Test_Code VARCHAR(50),
#                             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

# """)

@csrf_exempt
def insert_antibiotic_master(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)

            # Get the asset type and code from the request data
            anti_biotic_group_code = data.get('antibioticGroupCode')
            anti_biotic_code = data.get('antibioticCode')
            anti_biotic_des = data.get('antibioticDes')

            # Convert asset type and code to uppercase
            anti_biotic_group_code_upper =  anti_biotic_group_code
            anti_biotic_code_upper =  anti_biotic_code
            anti_biotic_des_upper =  anti_biotic_des

            # SQL query to check if the asset type already exists
            check_query = "SELECT COUNT(*) FROM AntibioticMaster WHERE  anti_biotic_group_code= %s"
            cursor.execute(check_query, (anti_biotic_group_code_upper,))
            existing_count = cursor.fetchone()[0]

            if existing_count > 0:
                # Asset with the same type already exists, return an error message
                response_data = {'error': 'antibioticmaster with the same type already exists'}
            else:
                # Asset doesn't exist, proceed to insert
                # SQL query to fetch the highest existing asset_id
                max_id_query = "SELECT MAX(anti_biotic_id) AS maxId FROM AntibioticMaster"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                # SQL query to insert a new record with placeholders
                insert_query = "INSERT INTO AntibioticMaster(anti_biotic_id, anti_biotic_group_code,anti_biotic_code, anti_biotic_des) VALUES (%s, %s, %s,%s)"
                cursor.execute(insert_query, (next_id, anti_biotic_group_code_upper,anti_biotic_code_upper, anti_biotic_des_upper))
                db.commit()

                response_data = {'message': 'antibioticmaster data inserted successfully'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()



def get_antibiotic_master(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select asset data from the database
        query = "SELECT * FROM AntibioticMaster"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        antibiotic_master_data = []
        for row in result:
            antibiotic_master_dict = {
                'anti_biotic_group_id': row[0],
                'anti_biotic_group_code': row[1].strip(),
                'anti_biotic_code': row[2].strip(),
                'anti_biotic_des': row[3].strip()
            }
            antibiotic_master_data.append(antibiotic_master_dict)

        # Return the asset data as JSON
        return JsonResponse(antibiotic_master_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
def update_antibiotic_master(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new method details
            data = json.loads(request.body)

            method_id = data.get('method_id')
            print(method_id)
            new_method_name = data.get('method_name')
            new_method_code = data.get('method_code')
            new_method_des = data.get('method_des')

            # Check if the method exists
            cursor.execute("SELECT COUNT(*) FROM AntibioticMaster WHERE anti_biotic_id = %s", [method_id])
            method_exists = cursor.fetchone()[0]

            if method_exists:
                # Method exists, proceed to update
                update_query = "UPDATE AntibioticMaster SET anti_biotic_group_code = %s, anti_biotic_code = %s, anti_biotic_des = %s WHERE anti_biotic_id = %s"
                cursor.execute(update_query, (new_method_name, new_method_code, new_method_des, method_id))
                db.commit()

                response_data = {'message': 'antibioticmaster updated successfully'}
            else:
                # Method does not exist
                response_data = {'error': 'antibioticmaster does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()




@csrf_exempt
def insert_antibiotic_group(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)

            # Get the asset type and code from the request data
            anti_biotic_group_code = data.get('antibioticGroupCode')
            anti_biotic_group_des = data.get('antibioticGroupDes')

            # Convert asset type and code to uppercase
            anti_biotic_group_code_upper =  anti_biotic_group_code
            anti_biotic_group_des_upper =  anti_biotic_group_des

            # SQL query to check if the asset type already exists
            check_query = "SELECT COUNT(*) FROM AntibioticGroups WHERE  anti_biotic_group_code= %s"
            cursor.execute(check_query, (anti_biotic_group_code_upper,))
            existing_count = cursor.fetchone()[0]

            if existing_count > 0:
                # Asset with the same type already exists, return an error message
                response_data = {'error': 'antibioticgroup with the same type already exists'}
            else:
                # Asset doesn't exist, proceed to insert
                # SQL query to fetch the highest existing asset_id
                max_id_query = "SELECT MAX(anti_biotic_group_id) AS maxId FROM AntibioticGroups"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                # SQL query to insert a new record with placeholders
                insert_query = "INSERT INTO AntibioticGroups(anti_biotic_group_id, anti_biotic_group_code, anti_biotic_group_des) VALUES (%s, %s, %s)"
                cursor.execute(insert_query, (next_id, anti_biotic_group_code_upper, anti_biotic_group_des_upper))
                db.commit()

                response_data = {'message': 'antibioticgroup data inserted successfully'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()



def get_antibiotic_group(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select asset data from the database
        query = "SELECT * FROM AntibioticGroups"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        antibiotic_group_data = []
        for row in result:
            antibiotic_group_dict = {
                'anti_biotic_group_id': row[0],
                'anti_biotic_group_code': row[1].strip(),
                'anti_biotic_group_des': row[2].strip()
            }
            antibiotic_group_data.append(antibiotic_group_dict)

        # Return the asset data as JSON
        return JsonResponse(antibiotic_group_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    


@csrf_exempt
def update_antibiotic_group(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new method details
            data = json.loads(request.body)
            method_id = data.get('method_id')
            new_method_name = data.get('method_name')  # Assuming you want to standardize names to uppercase
            new_method_code = data.get('method_code')

            # Check if the method exists
            cursor.execute("SELECT COUNT(*) FROM AntibioticGroups WHERE anti_biotic_group_id = %s", [method_id])
            method_exists = cursor.fetchone()[0]

            if method_exists:
                # Method exists, proceed to update
                update_query = "UPDATE AntibioticGroups SET anti_biotic_group_code= %s, anti_biotic_group_des= %s WHERE anti_biotic_group_id= %s"
                cursor.execute(update_query, (new_method_name, new_method_code, method_id))
                db.commit()

                response_data = {'message': 'antibioticgroup updated successfully'}
            else:
                # Method does not exist
                response_data = {'error': 'expense does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()



@csrf_exempt
def insert_group_master(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print(data)
            # Get the asset type and code from the request data
            group_code = data.get('groupCode') if 'groupCode' in data else None
            group_name = data.get('groupName') if 'groupName' in data else None
            display_name = data.get('displayName') if 'displayName' in data else None
            billing_code = data.get('billingCode') if 'billingCode' in data else None
            billing_name = data.get('billingName') if 'billingName' in data else None
            gender = data.get('gender') if 'gender' in data else None
            report = data.get('reportType') if 'reportType' in data else None
            department_name = data.get('departmentName') if 'departmentName' in data else None
            test_category = data.get('testCategory') if 'testCategory' in data else None
            logical_category = data.get('logicalCategory') if 'logicalCategory' in data else None
            authorized_user = data.get('authorizedUser') if 'authorizedUser' in data else None
            lonic_code = data.get('lonicCode') if 'lonicCode' in data else None
            group_cost = data.get('groupCost') if 'groupCost' in data else None
            interpretationhead = data.get('InterpretationHead') if 'InterpretationHead' in data else None
            interpretation = data.get('Interpretation') if 'Interpretation' in data else None
            
            

            # SQL query to check if the asset type already exists
            check_query = "SELECT COUNT(*) FROM GroupMaster WHERE group_name = %s"
            cursor.execute(check_query, (group_name,))
            existing_count = cursor.fetchone()[0]

            if existing_count > 0:
                # Asset with the same type already exists, return an error message
                response_data = {'error': 'groupmaster with the same type already exists'}
            else:
                # Asset doesn't exist, proceed to insert
                # SQL query to fetch the highest existing asset_id
                max_id_query = "SELECT MAX(group_master_id) AS maxId FROM GroupMaster"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                insert_query = "INSERT INTO GroupMaster(group_master_id, group_code, group_name, display_name, billing_code, billing_name, gender, report, department_name, test_category, logical_category, authorized_user, loinc_code, InterpretationHead, Interpretation ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(insert_query, (next_id, group_code, group_name, display_name, billing_code, billing_name, gender, report, department_name, test_category, logical_category, authorized_user, lonic_code,interpretationhead, interpretation ))
                db.commit()

                response_data = {'message': 'groupmaster data inserted successfully'}


            max_id_query = "SELECT MAX(Test_id) AS maxId FROM Testmaster_Cost_List"
            cursor.execute(max_id_query)
            max_id = cursor.fetchone()[0]
            Next_id = max_id + 1 if max_id is not None else 1

            insert_groupcost = """INSERT INTO Testmaster_Cost_List (Test_id,Test_Name,Basic,Test_Code) VALUES (%s, %s, %s, %s)"""
            cursor.execute(insert_groupcost,(Next_id,group_name,group_cost,group_code))

            db.commit()
            return JsonResponse(response_data)

        except Exception as e:
            # Handle unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()


def get_group_master_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select asset data from the database
        query = "SELECT * FROM GroupMaster"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        group_master_data = []
        for row in result:
            group_master_dict = {
                'group_master_id': row[0],
                'group_code': row[1].strip() if row[1] is not None else None,
                'group_name': row[2].strip() if row[2] is not None else None,
                'display_name': row[3].strip() if row[3] is not None else None,
                'billing_code': row[4].strip() if row[4] is not None else None,
                'billing_name': row[5].strip() if row[5] is not None else None,
                'gender': row[6].strip() if row[6] is not None else None,
                'report': row[7].strip() if row[7] is not None else None,
                'department_name': row[8].strip() if row[8] is not None else None,
                'test_category': row[9].strip() if row[9] is not None else None,
                'logical_category': row[10].strip() if row[10] is not None else None,
                'authorized_user': row[11].strip() if row[11] is not None else None,
                'lonic_code': row[12].strip() if row[12] is not None else None,
            }
            group_master_data.append(group_master_dict)

        # Return the asset data as JSON
        return JsonResponse(group_master_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
# def update_group_master_data

@csrf_exempt
def update_group_master_data(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new group master details
            data = json.loads(request.body)
            print('data.......',data)
            group_master_id = data.get('group_master_id')
            group_code = data.get('groupCode')
            group_name = data.get('groupName')
            display_name = data.get('displayName')
            billing_code = data.get('billingCode')
            billing_name = data.get('billingName')
            gender = data.get('gender')
            report = data.get('reportType')
            department_name = data.get('departmentName')
            test_category = data.get('testCategory')
            logical_category = data.get('logicalCategory')
            authorized_user = data.get('authorizedUser')
            lonic_code = data.get('lonicCode')
            group_cost = data.get('groupCost')
            selected_tests = data.get('selectedtest', [])

            # Convert fields to uppercase if needed
            group_name_upper = group_name.upper() if group_name else None
            lonic_code_upper = lonic_code.upper() if lonic_code else None

            # Check if the group master exists
            update_query = """
                UPDATE GroupMaster
                SET  group_name = %s, display_name = %s, billing_code = %s,
                    billing_name = %s, gender = %s, report = %s, department_name = %s,
                    test_category = %s, logical_category = %s, authorized_user = %s, loinc_code = %s, Group_Cost = %s
                WHERE group_code = %s
            """

            cursor.execute(update_query, (
                group_name_upper, display_name, billing_code,
                billing_name, gender, report, department_name,
                test_category, logical_category, authorized_user, lonic_code_upper, group_cost,
                group_code
            ))

            updated_query = """
                UPDATE Testmaster_Cost_List SET 
"""

            cursor.execute("DELETE FROM GroupMasterTestList WHERE group_code = %s", (group_code,))
            print('delete')

            if selected_tests:
                for test in selected_tests:
                    max_id_query = "SELECT MAX(Groupmaster_testlist_id) AS maxId FROM GroupMasterTestList"
                    cursor.execute(max_id_query)
                    max_id = cursor.fetchone()[0]
                    next_id = max_id + 1 if max_id is not None else 1

                    test_name = test.get('test_name')
                    test_code = test.get('Test_Code')
                    cursor.execute("""
                        INSERT INTO GroupMasterTestList (Groupmaster_testlist_id, group_code, group_name, test_name, Test_Code)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (next_id, group_code, group_name_upper, test_name, test_code))
                print('insert')

            db.commit()

            response_data = {'message': 'groupmaster updated successfully'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()


@csrf_exempt
def insert_organism_master(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)

            print('data :',data)
            # Get the asset type and code from the request data
            organism_code = data.get('organismCode')
            organism_name = data.get('organismName')

            # Convert asset type and code to uppercase
            organism_code_upper =  organism_code
            organism_name_upper =  organism_name

            # SQL query to check if the asset type already exists
            check_query = "SELECT COUNT(*) FROM OrganismMaster WHERE  organism_code= %s"
            cursor.execute(check_query, (organism_code_upper,))
            existing_count = cursor.fetchone()[0]

            if existing_count > 0:
                # Asset with the same type already exists, return an error message
                response_data = {'error': 'organismmaster with the same type already exists'}
            else:
                # Asset doesn't exist, proceed to insert
                # SQL query to fetch the highest existing asset_id
                max_id_query = "SELECT MAX(organism_id) AS maxId FROM OrganismMaster"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                # SQL query to insert a new record with placeholders
                insert_query = "INSERT INTO OrganismMaster(organism_id, organism_code, organism_name) VALUES (%s, %s, %s)"
                cursor.execute(insert_query, (next_id, organism_code_upper, organism_name_upper))
                db.commit()

                response_data = {'message': 'organismmaster data inserted successfully'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()


def get_organism_master(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select asset data from the database
        query = "SELECT * FROM OrganismMaster"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        organism_master_data = []
        for row in result:
            organism_master_dict = {
                'organism_id': row[0],
                'organism_code': row[1].strip(),
                'organism_name': row[2].strip()
            }
            organism_master_data.append(organism_master_dict)

        # Return the asset data as JSON
        return JsonResponse(organism_master_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
def update_organism_master(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new method details
            data = json.loads(request.body)
            method_id = data.get('method_id')
            new_method_name = data.get('method_name')  # Assuming you want to standardize names to uppercase
            new_method_code = data.get('method_code')

            # Check if the method exists
            cursor.execute("SELECT COUNT(*) FROM OrganismMaster WHERE organism_id= %s", [method_id])
            method_exists = cursor.fetchone()[0]

            if method_exists:
                # Method exists, proceed to update
                update_query = "UPDATE OrganismMaster SET organism_code= %s, organism_name= %s WHERE organism_id= %s"
                cursor.execute(update_query, (new_method_name, new_method_code, method_id))
                db.commit()

                response_data = {'message': 'organismmaster updated successfully'}
            else:
                # Method does not exist
                response_data = {'error': 'organismmaster does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()

#================================================ Insert in testmasters========================================#

@csrf_exempt
def insert_test_description_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # print(data)
        data = json.loads(request.body)
        print(data)
        # Retrieve data from request
        cursor.execute("SELECT MAX(Test_Id) FROM Test_Descriptions")
        max_id = cursor.fetchone()[0]
        next_id = max_id + 1 if max_id is not None else 1
     
        Test_Name = data.get('testName')
        Test_Code = data.get('testCode')
        Department = data.get('department')
        Sub_Department = data.get('subdepartment')
        Header = data.get('header')
        Display_Text = data.get('displayText')
        Billing_Name = data.get('billingName')
        Container_Name = data.get('container')
        Specimen_Name = data.get('specimen')
        Method_Name = data.get('method')
        Gender = data.get('gender')
        Input_Type = data.get('inputType')
        Decimal_Places = data.get('decimalPlaces')
        if Decimal_Places:
            Decimal_Places = Decimal_Places
        else:
            Decimal_Places = None
            
        print('Decimal_Places :',Decimal_Places)
        Input_Pattern_Type = data.get('inputPatternType')
        Test_Category = data.get('testCategory')
        Logical_Category = data.get('logicalCategory')
        UOM = data.get('uom')
        Report_Type = data.get('reportType')
        Test_Instructions = data.get('testInstruction')
        Loinc_Code = data.get('loincCode')
        # Highlight = data.get('highlight')
        Allow_Discount = data.get('allowDiscount')
        Orderable = data.get('orderable')
        Show_Graph = data.get('showGraph')
        Active_Status = data.get('active')
        STAT = data.get('stat')
        Non_Reportable = data.get('nonReportable')
        Calculated_Test = data.get('calculatedTest')
        Outsourced = data.get('isOutsourced')
        Processingtime = data.get('minimumtime')
        emergency = data.get('Emergencytime')
        processperiod = data.get('timeperiod')
        capturedunit = data.get('capturedUnit')
        formula = data.get('formula')
        paraone = data.get('paraone')
        paratwo = data.get('paratwo')
        checkout = data.get('Checkout')
        culturetest = data.get('Culturetest')
        isNABHL = data.get('isNABHL')
        isCAP = data.get('isCAP')
        is_Machine_Interfaced = data.get('is_Machine_Interfaced')
        Reagentlevel = data.get('Reagentlevel')
        assaycode = data.get('AssayCode')
        IsSubTest = data.get("IsSubTest")
        SubTestCodes = data.get("SubTestCodes")
        Status = "Active"
        # SQL Query to insert data
        sql_query = """
        INSERT INTO Test_Descriptions
            (Test_Id, Test_Name, Test_Code, Department, Sub_Department, Header, Display_Text, Billing_Name, Container_Name, Specimen_Name,
            Method_Name, Gender, Input_Type, Decimal_Palces, Input_Pattern_Type, Test_Category, Logical_Category, Captured_Unit, UOM,
            Report_Type, Test_INstructions, Loinc_Code, Allow_Discount, Oderable, Show_Graph, Active_Status,
            STAT, Non_Reportable, Calculated_Test, Outsourced, Processing_Time, Emergency_Processing_Time, Period_Type, Formula, Parameter_One, Parameter_Two, Autocheck, Culturetest, Is_NABHL, Is_CAP, Is_Machine_Interfaced, Reagent_Level, Assay_Code,Status,IsSubTest,SubTestCodes )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Executing the SQL command
        cursor.execute(sql_query, (next_id, Test_Name, Test_Code, Department, Sub_Department, Header, Display_Text, Billing_Name,
                                   Container_Name, Specimen_Name, Method_Name, Gender, Input_Type, Decimal_Places,
                                   Input_Pattern_Type, Test_Category, Logical_Category, capturedunit, UOM, Report_Type,
                                   Test_Instructions, Loinc_Code, Allow_Discount, Orderable, Show_Graph,
                                   Active_Status, STAT, Non_Reportable, Calculated_Test, Outsourced, Processingtime, emergency, processperiod, formula, paraone, paratwo, checkout, culturetest, isNABHL, isCAP, is_Machine_Interfaced, Reagentlevel, assaycode,Status,IsSubTest,SubTestCodes,  ))

        db.commit()  # Committing the transaction
        response_data = {'message': 'Test description data inserted successfully'}
        return JsonResponse(response_data)

    except Exception as e:
        print({'error': f'{str(e)}'})
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
    finally:
        if cursor: cursor.close()
        if db: db.close()


def get_test_name(request):
    if request.method == "GET":
        try:
            # db = get_db_connection()
            cursor = db.cursor() # Assuming get_db_cursor(db) is equivalent to db.cursor()

            # Correct SQL query to fetch the latest Test_Name
            get_name_query = """
                SELECT Test_Name,Test_Code
                FROM Test_Descriptions 
                WHERE Test_Id = (SELECT MAX(Test_Id) FROM Test_Descriptions)
            """
            cursor.execute(get_name_query)
            test_name = cursor.fetchone()  # Fetch the first row of the results
            
            if test_name:
                return JsonResponse({"test_name": test_name[0],"test_code": test_name[1]}, status=200)  # Assuming test_name is the first column
            else:
                return JsonResponse({"error": "No tests found."})
        
        except Exception as e:
            print('errrrrrrrrrrrr :', e)
            return JsonResponse({"error": str(e)}, status=500)
        
        finally:
            cursor.close()
            db.close()

    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
    

def get_all_test_name(request):
    if request.method == "GET":
        db = None
        cursor = None
        try:
            # Database connection
            # db = get_db_connection()
            cursor = db.cursor()
            
            # Get the 'gender' parameter from the request
            gender = request.GET.get('gender')
            
            # SQL query to fetch all Test_Name and Test_Code based on gender
            get_name_query = """
                SELECT Test_Name, Test_Code 
                FROM Test_Descriptions 
                WHERE (Gender = %s OR Gender = 'Both') AND Status = 'Active'
               
            """
            cursor.execute(get_name_query, (gender,))
            
            # Fetch all the test names
            test_names = cursor.fetchall()
            
            # Format the data into a list of dictionaries
            test_name_list = [{'Test_Name': row[0], 'Test_Code': row[1]} for row in test_names]
            
            # If test_name_list has data, return it
            if test_name_list:
                return JsonResponse(test_name_list, safe=False, status=200)
            else:
                return JsonResponse({"error": "No tests found."}, status=404)

        except Exception as e:
            # Handle and log the exception
            return JsonResponse({"error": str(e)}, status=500)

        finally:
            # Close the cursor and db connection if they exist
            if cursor:
                cursor.close()
            if db:
                db.close()

    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)


def get_all_test_name_without_gender(request):
    if request.method == "GET":
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            gender = request.GET.get('gender')
            # SQL query to fetch all Test_Name entries
            get_name_query = "SELECT Test_Name,Test_Code FROM Test_Descriptions "
            cursor.execute(get_name_query)
            test_names = cursor.fetchall()  # Fetch all rows of the results 

            # Use a list comprehension to extract test names directly
            test_name_list = [{row[0],row[1]} for row in test_names]

            # Check if the test_name_list is not empty
            if test_name_list:
                return JsonResponse(test_name_list, safe=False, status=200)
            else:
                return JsonResponse({"error": "No tests found."}, status=404)
        except Exception as e:
            # Log or print the exception message here if needed
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            # Close the cursor and db connection if they were successfully created
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)

    
    
@csrf_exempt
def insert_testmaster_remark(request):
    if request.method == "POST":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print("Received data:", data)

            # Execute the query to get the maximum Test_Id
            cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Remarks")
            max_id_result = cursor.fetchone()
            print(max_id_result)
            # If max_id_result[0] is None, set max_id to 0, else use the value
            max_id = max_id_result[0] if max_id_result[0] is not None else 0
            next_id = max_id + 1

            # Extract the required fields from the request data
            testname = data.get('testname')
            Test_Code = data.get('Test_Code')
            # Assuming '0' is a key in your JSON structure for nested data
            nested_data = data.get('0', {})  # Default to empty dict if '0' is not found

            validation = nested_data.get('validation')
            remarktype = nested_data.get('type')
            remark = nested_data.get('remarks')
            
            # Prepare and execute the insertion query
            insert_sql = """
                INSERT INTO Testmaster_Remarks (Test_Id, Test_Name, Validation, Remark_Type, Remark,Test_Code)
                VALUES (%s, %s, %s, %s, %s,%s)
            """
            cursor.execute(insert_sql, (next_id, testname, validation, remarktype, remark,Test_Code))
            db.commit()

            return JsonResponse({"message": "Remark inserted successfully"}, status=200)

        except Exception as e:
            # Log the error for debugging
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)
        
        finally:
            # Ensure resources are released properly
            if cursor: cursor.close()
            if db: db.close()



@csrf_exempt
def insert_testmaster_referencerange(request):
    if request.method == "POST":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print("Received data:", data)

            # Execute the query to get the maximum Test_Id
            cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Reference_Range")
            max_id_result = cursor.fetchone()
            print(max_id_result)
            # If max_id_result[0] is None, set max_id to 0, else use the value
            max_id = max_id_result[0] if max_id_result[0] is not None else 0
            next_id = max_id + 1

            # Extract the required fields from the request data
            testname = data.get('testname')
            Test_Code = data.get('Test_Code')
            # Assuming '0' is a key in your JSON structure for nested data
            # Default to empty dict if '0' is not found

            analyzerType = data.get('analyzerType')
            validation = data.get('validation')
            gender = data.get('gender')
            method = data.get('method')
            rangeLowerLimit = data.get('rangeLowerLimit')
            rangeUpperLimit = data.get('rangeUpperLimit')
            referenceRangeText = data.get('referanceRangeText')  # Check spelling in your frontend

            # Prepare and execute the insertion query
            insert_sql = """
                INSERT INTO Testmaster_Reference_Range (Test_Id,Test_Name, Analizer_Type, Validation, Method_Type, Gender, Range_Lower_Limit, Range_Higher_Limit, Reference_Range_Text,Test_Code)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_sql, (next_id, testname, analyzerType, validation, method, gender, rangeLowerLimit, rangeUpperLimit, referenceRangeText,Test_Code))
            db.commit()

            return JsonResponse({"message": "Reference range inserted successfully"}, status=200)


        except Exception as e:
            # Log the error for debugging
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)
        
        finally:
            # Ensure resources are released properly
            if cursor: cursor.close()
            if db: db.close()


@csrf_exempt
def insert_testmaster_cost(request):
    if request.method == "POST":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print("Received data:", data)
            database = settings.DATABASES['default']['NAME']
            getquery = """
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Testmaster_Cost_List' 
                AND TABLE_SCHEMA = %s
                AND COLUMN_NAME NOT IN ('UpdatedAt', 'CreatedAt', 'Test_id', 'Test_Name', 'Test_Code');
            """
            cursor.execute(getquery, [database])
            ratecard_columns = [column[0] for column in cursor.fetchall()]
            print("Ratecard columns:", ratecard_columns)
            
            cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Cost_List")
            max_id_result = cursor.fetchone()
            print(max_id_result)
            max_id = max_id_result[0] if max_id_result[0] is not None else 0
            next_id = max_id + 1

            testname = data.get('testname')
            Test_Code = data.get('testcode')
            print('Test_Code', Test_Code)
            ratecard_values = data.get('ratecardValues', {})

            # Filter the columns and values based on the retrieved columns
            filtered_columns = []
            filtered_values = []
            for column in ratecard_columns:
                if column in ratecard_values:
                    filtered_columns.append(column)
                    filtered_values.append(ratecard_values[column])
                else:
                    # Handle missing columns with default values, if necessary
                    filtered_columns.append(column)
                    filtered_values.append('0')  # Default value as '0'

            # Prepare the SQL query with dynamic columns and placeholders
            columns_str = ", ".join([f"{col}" for col in filtered_columns])
            placeholders_str = ", ".join(["%s"] * len(filtered_values))
            update_set_clause = ", ".join([f"{col} = %s" for col in filtered_columns])

            cursor.execute("SELECT Test_Id FROM Testmaster_Cost_List WHERE Test_Code = %s", (Test_Code,))
            already = cursor.fetchone()

            if already is None:
                # Insert new record
                insert_sql = f"""
                    INSERT INTO Testmaster_Cost_List (Test_Id, Test_Name, {columns_str}, Test_Code)
                    VALUES (%s, %s, {placeholders_str}, %s)
                """
                cursor.execute(insert_sql, [next_id, testname] + filtered_values + [Test_Code])
            else:
                # Update existing record
                update_sql = f"""
                    UPDATE Testmaster_Cost_List
                    SET Test_Name = %s, {update_set_clause}, Test_Code = %s
                    WHERE Test_Code = %s
                """
                cursor.execute(update_sql, [testname] + filtered_values + [Test_Code, Test_Code])

            db.commit()
            return JsonResponse({"message": "Cost data processed successfully"}, status=200)

        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)
        
        finally:
            if cursor: cursor.close()
            if db: db.close()
    else:
        return JsonResponse({"error": "Invalid request method. Only POST is allowed."},status=405)



@csrf_exempt
def insert_testmaster_interpretation(request):
    if request.method == "POST":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print("Received data:", data)
            cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Interpretation_table")
            max_id_result = cursor.fetchone()
            print(max_id_result)
            # If max_id_result[0] is None, set max_id to 0, else use the value
            max_id = max_id_result[0] if max_id_result[0] is not None else 0
            next_id = max_id + 1
            # Extract the required fields from the request data
            testname = data.get('testname')
            header = data.get('header')
            comments = data.get('comments')
            Test_Code = data.get('Test_Code')
            # Prepare and execute the insertion query
            insert_sql = """
                INSERT INTO Testmaster_Interpretation_table (Test_Id,Test_Name, Header_interpretation, Comments,Test_Code)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_sql, (next_id, testname, header, comments, Test_Code))
            db.commit()

            return JsonResponse({"message": "Comments data inserted successfully"}, status=200)

        except Exception as e:
            # Log the error for debugging purposes
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)
        
        finally:
            # Ensure resources such as database connections and cursors are properly closed
            if cursor: cursor.close()
            if db: db.close()




def get_payment_and_test_details_by_testname(request):
    if request.method == "GET":
        try:
            # db = get_db_connection()
            cursor = db.cursor(buffered=True)

            Test_Code = request.GET.get('Test_Code')
            ratecard = request.GET.get('ratecard')

            if not Test_Code or not ratecard:
                return JsonResponse({"error": "Test_Code and ratecard are required parameters."}, status=400)

            print('Test_Code:', Test_Code)

            # Constructing the column name dynamically
            column_name = f"`{ratecard}`"

            # Determine query based on Test_Code prefix
            if Test_Code.startswith('GM'):
                # Query for Group tests
                get_details_query = f"""
                SELECT t.group_code, tc.Test_Name, tc.{column_name}
                FROM GroupMaster t
                INNER JOIN Testmaster_Cost_List tc ON t.group_code = tc.Test_Code 
                WHERE t.group_code = '{Test_Code}' AND tc.{column_name} IS NOT NULL
                """
                
                query = """SELECT test_name,Test_Code FROM GroupMasterTestList WHERE group_code=%s"""
                cursor.execute(query, (Test_Code,))
                data = cursor.fetchall()

            elif Test_Code.startswith('R'):
                # Query for Individual tests
                get_details_query = f"""
                SELECT t.Test_Code, t.Test_Name, tc.{column_name}, t.Specimen_Name, t.Container_Name, t.Sub_Department,t.IsSubTest, t.SubTestCodes
                FROM Test_Descriptions t
                INNER JOIN Testmaster_Cost_List tc ON t.Test_Code = tc.Test_Code 
                WHERE t.Test_Code = '{Test_Code}' AND tc.{column_name} IS NOT NULL
                """
                
                # Query to get processing time and period type for the main test
                query = """SELECT Processing_Time, Period_Type FROM Test_Descriptions WHERE Test_Code=%s"""
                cursor.execute(query, (Test_Code,))
                time = cursor.fetchone()
    
                # Set default time if not found
                Time = time[0] if time[0] is not None and time[0] != "" else 0
            elif Test_Code.startswith('PAC'):
                # Query for Offer packages
                get_details_query = f"""
                SELECT t.package_code, tc.Test_Name, tc.{column_name}
                FROM OfferPackage t
                INNER JOIN Testmaster_Cost_List tc ON t.package_code = tc.Test_Code 
                WHERE t.package_code = '{Test_Code}' AND tc.{column_name} IS NOT NULL
                """
                newquery = """SELECT * FROM OfferPackageList WHERE package_code=%s"""
                cursor.execute(newquery, (Test_Code,))
                package_data = cursor.fetchall()
                
            else:
                return JsonResponse({"error": "Invalid Test_Code format."}, status=400)

            # Execute the query
            cursor.execute(get_details_query)
            result = cursor.fetchone()

            if result:
                if Test_Code.startswith('GM'):
                    # Response for Group tests
                    group_data = {
                        'test_code': result[0],
                        'test_name': result[1],
                        'cost_per_reportable': result[2],
                        'testmethod': 'Group',
                        "Testdetails": [],
                    }
                    for i in data:
                        get_details_query1 = f"""
                            SELECT Test_Code, Test_Name, {column_name}
                            FROM Testmaster_Cost_List 
                            WHERE Test_Code = '{i[1]}' AND {column_name} IS NOT NULL
                        """                 
                        cursor.execute(get_details_query1)
                        data1 = cursor.fetchall()
                        for i in data1:
                            group_data["Testdetails"].append(
                                {"test_name": i[1], "Test_Code": i[0], "Amount": i[2]}
                            )
                    print('group_data :',group_data)
                    return JsonResponse(group_data)
                elif Test_Code.startswith('R'):
                    if result:
                        subtest_codes = result[7]
                    # Response for Individual tests
                    details_dict = {
                        'test_code': result[0],
                        'test_name': result[1],
                        'cost_per_reportable': result[2],
                        'Specimen_Name': result[3],
                        'Container_Name': result[4],
                        'testmethod': 'Individual',
                        'Department': result[5],
                        "time": Time,
                        "Time_Period": time[1],
                        "is_subtest":result[6],
                        "subtest_codes": subtest_codes,
                        "subtests": []
                    }
                        
                    if result[6] == "Yes" and subtest_codes:
                        subtest_codes_list = subtest_codes.split(",")  # Split the SubTestCodes into a list
    
                        # Loop through each subtest code to fetch its details
                        for sub_test_code in subtest_codes_list:
                            subtest_query = f"""
                            SELECT t.Test_Code, t.Test_Name, tc.{column_name}, t.Specimen_Name, t.Container_Name, t.Sub_Department
                            FROM Test_Descriptions t
                            INNER JOIN Testmaster_Cost_List tc ON t.Test_Code = tc.Test_Code 
                            WHERE t.Test_Code = %s AND tc.{column_name} IS NOT NULL
                            """
                            cursor.execute(subtest_query, (sub_test_code,))
                            subtest_details = cursor.fetchone()
                            print("subtest_details",subtest_details)
    
                            if subtest_details:
                                subtest_time_query = """SELECT Processing_Time, Period_Type FROM Test_Descriptions WHERE Test_Code=%s"""
                                cursor.execute(subtest_time_query, (sub_test_code,))
                                subtest_time = cursor.fetchone()
    
                                subtest_time_value = subtest_time[0] if subtest_time[0] is not None and subtest_time[0] != "" else 0
    
                                # Construct subtest details dict
                                subtest_details_dict = {
                                    "test_code": subtest_details[0],
                                    "test_name": subtest_details[1],
                                    "cost_per_reportable": subtest_details[2],
                                    "Specimen_Name": subtest_details[3],
                                    "Container_Name": subtest_details[4],
                                    "testmethod": "Individual",
                                    "Department": subtest_details[5],
                                    "time": subtest_time_value,
                                    "Time_Period": subtest_time[1],
                                }
    
                                # Append each subtest to the main test's subtests list
                                details_dict["subtests"].append(subtest_details_dict)
    

                    return JsonResponse(details_dict)
                elif Test_Code.startswith('PAC'):
                    
                    print('package_data :',package_data)
                    # Response for Offer packages
                    offer_data = {
                        'test_code': result[0],
                        'test_name': result[1],
                        'cost_per_reportable': result[2],
                        'testmethod': 'Offers',
                        'Testdetails': []
                    }
                    for package in package_data:
                        print('package[6] :', package[6])
        
                        if package[5] == "Group":
                            print("hello2")
                            # Step 8: If testmethod is "group", fetch grouped tests along with the group name.
                            group_query = """
                            SELECT test_name, Test_Code, group_name FROM GroupMasterTestList WHERE group_code=%s
                            """
                            cursor.execute(group_query, (package[4],))  # package[4] is the group_code
                            group_tests = cursor.fetchall()
                            print('group_tests :', group_tests)
        
                            # Step 9: Loop through each test in the group and get its details from Testmaster_Cost_List
                            for i in group_tests:
                                get_details_query1 = f"""
                                SELECT Test_Code, Test_Name, {column_name}
                                FROM Testmaster_Cost_List
                                WHERE Test_Code = '{i[1]}' AND {column_name} IS NOT NULL
                                """
                                cursor.execute(get_details_query1)
                                data = cursor.fetchall()
                                
                            
        
                                # Step 10: Append the test details with amount and group name into 'Testdetails'
                                if data:
                                    offer_data['Testdetails'].extend([
                                        {
                                            "test_name": test[1], 
                                            "Test_Code": test[0],
                                            'method': 'offer', 
                                            'Amount': test[2],
                                            'group_name': i[2]  # Including group_name from group_tests
                                        } for test in data
                                    ])
        
                        elif package[6] == 'Yes':
                            print("hello3")
                            # First, add the main test details
                            main_test_query = f"""
                            SELECT Test_Code, Test_Name, {column_name}
                            FROM Testmaster_Cost_List
                            WHERE Test_Code = '{package[4]}' AND {column_name} IS NOT NULL
                            """
                            cursor.execute(main_test_query)
                            print("hello")
                            main_test_data = cursor.fetchall()
                            print("main_test_data",main_test_data)
                            
                            if main_test_data:
                                offer_data['Testdetails'].extend([
                                    {
                                        "test_name": test[1], 
                                        "Test_Code": test[0],
                                        'method': 'offer', 
                                        'Amount': test[2],
                                        'group_name': '-'  # No group name for individual tests
                                    } for test in main_test_data
                                ])
        
                            # Then, handle the subtest details
                            SubTestCodes = package[7]
                            print('SubTestCodes :', SubTestCodes)
                            subtest_codes_list = SubTestCodes.split(",")
                            print('subtest_codes_list :', subtest_codes_list)
        
                            for i in subtest_codes_list:
                                query3 = f"""
                                SELECT Test_Code, Test_Name, {column_name}
                                FROM Testmaster_Cost_List
                                WHERE Test_Code = %s AND {column_name} IS NOT NULL
                                """
                                cursor.execute(query3, (i,))
                                data1 = cursor.fetchall()
                                print('data1 :', data1)
        
                                offer_data['Testdetails'].extend([
                                    {
                                        "test_name": test[1], 
                                        "Test_Code": test[0],
                                        'method': 'offer', 
                                        'Amount': test[2],
                                        'group_name': f'Sub Test'  # No group name for subtests
                                    } for test in data1
                                ])
        
                        elif package[5] == 'Individual':
                            print(package[4])
                            print("hello2")
                        
                            get_details_query1 = f"""
                            SELECT Test_Code, Test_Name, {column_name}
                            FROM Testmaster_Cost_List
                            WHERE Test_Code = '{package[4]}' AND {column_name} IS NOT NULL
                            """
                    
                            cursor.execute(get_details_query1)
                            data1 = cursor.fetchall()  # Fetch all results
                        
                            print('package_data :', data1)
                        
                            offer_data['Testdetails'].extend([
                                {
                                    "test_name": test[1], 
                                    "Test_Code": test[0],
                                    'method': 'Offers', 
                                    'Amount': test[2],
                                    'group_name': '-'  # No group name for individual tests
                                } for test in data1
                            ])

        
        
                    return JsonResponse(offer_data)
            else:
                return JsonResponse({"message": "No data found."})

        except Exception as e:
            print('Error:', e)
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)


#================================================= Update in testmaster ==============================================#



@csrf_exempt
def update_test_description_data(request):
    if request.method == 'POST':
        
        cursor = None
        try:
           
            
            cursor = db.cursor()

            # Parse request body
            data = json.loads(request.body)
            print('Request data:', data)
            testId = data.get('testCode')
            
            # Handle decimalPlaces
            decimalplace = data.get('decimalPlaces')
            decimalPlaces = int(decimalplace) if decimalplace and decimalplace != 'None' else 0
            print(f"decimalPlaces: {decimalPlaces}")

            # Check if test description exists
            cursor.execute("SELECT COUNT(*) FROM Test_Descriptions WHERE Test_Code = %s", [testId])
            test_description_exists = cursor.fetchone()[0]

            if not test_description_exists:
                return JsonResponse({'error': f"Test description with Test_Code {testId} does not exist"}, status=404)

            # Validate foreign keys
            container = data.get('containercode')
            if container in ("", "None", None):
                container_id = None
            else:
                cursor.execute("SELECT COUNT(*) FROM Container_Masters WHERE Container_Code = %s", [container])
                if cursor.fetchone()[0] == 0:
                    return JsonResponse({'error': f"Container code {container} does not exist in container_masters"}, status=400)
                container_id = container

            specimen = data.get('specimencode')
            if specimen in ("", "None", None):
                specimen_id = None
            else:
                cursor.execute("SELECT COUNT(*) FROM Specimen_Masters WHERE Specimen_Code = %s", [specimen])
                if cursor.fetchone()[0] == 0:
                    return JsonResponse({'error': f"Specimen code {specimen} does not exist in specimen_masters"}, status=400)
                specimen_id = specimen

            method = data.get('methodcode')
            if method in ("", "None", None):
                method_id = None
            else:
                cursor.execute("SELECT COUNT(*) FROM Methods_Masters WHERE Method_Code = %s", [method])
                if cursor.fetchone()[0] == 0:
                    return JsonResponse({'error': f"Method code {method} does not exist in method_masters"}, status=400)
                method_id = method

            uom = data.get('uomcode')
            if uom in ("", "None", None):
                Unit_Code = None
            else:
                cursor.execute("SELECT COUNT(*) FROM Unit_Masters WHERE Unit_Code = %s", [uom])
                if cursor.fetchone()[0] == 0:
                    return JsonResponse({'error': f"UOM code {uom} does not exist in uom_masters"}, status=400)
                Unit_Code = uom

            department = data.get('departmentcode')
            if department:
                cursor.execute("SELECT COUNT(*) FROM Lab_Department_Detials WHERE Department_Code = %s", [department])
                if cursor.fetchone()[0] == 0:
                    return JsonResponse({'error': f"Department code {department} does not exist in department_masters"}, status=400)

            subdepartment = data.get('subdepartmentcode')
            if subdepartment:
                cursor.execute("SELECT COUNT(*) FROM SubLab_Department_Detials WHERE SubDepartment_Code = %s", [subdepartment])
                if cursor.fetchone()[0] == 0:
                    return JsonResponse({'error': f"SubDepartment code {subdepartment} does not exist in sub_department_masters"}, status=400)

            # Handle Captured_Unit
            captured_unit = data.get('capturedUnit')
            cap_unit = int(captured_unit) if captured_unit and captured_unit != "" else 0

            # Log foreign key values for debugging
            print(f"Foreign keys: container_id={container_id}, specimen_id={specimen_id}, method_id={method_id}, uom_id={Unit_Code}, department={department}, subdepartment={subdepartment}")

            # Update query
            update_query = """
                UPDATE Test_Descriptions
                SET Test_Name = %s, department_id = %s, sub_department_id = %s, Header = %s,
                    DisplayText = %s, Billing_Name = %s, Container_Name_id = %s, Specimen_Name_id = %s,
                    Method_Name_id = %s, Gender = %s, Input_Type = %s, Decimal_Palces = %s,
                    Input_Pattern_Type = %s, Test_Category = %s, Logical_Category = %s,
                    Captured_Unit = %s, UOM_id = %s, Report_Type = %s, Test_Instructions = %s,
                    Loinc_Code = %s, Allow_Discount = %s, Oderable = %s, Show_Graph = %s,
                    Status = %s, STAT = %s, Non_Reportable = %s, Calculated_Test = %s,
                    Outsourced = %s, Processing_Time = %s, Emergency_Processing_Time = %s,
                    Period_Type = %s, Formula = %s, Parameter_One = %s, Parameter_Two = %s,
                    Autocheck = %s, Culturetest = %s, Is_NABHL = %s, Is_CAP = %s, Is_Machine_Interfaced = %s,
                    Machine_Name = %s, Assay_Code = %s, IsSubTest = %s, SubTestCodes = %s, 
                    updated_at = %s, Iscutoffvalue = %s, Status = %s
                WHERE Test_Code = %s
            """

            cursor.execute(update_query, (
                data.get('testName'), department, subdepartment,
                data.get('header'), data.get('displayText'), data.get('billingName'), container_id,
                specimen_id, method_id, data.get('gender'), data.get('inputType'),
                decimalPlaces, data.get('inputPatternType'), data.get('testCategory'),
                data.get('logicalCategory'), cap_unit, Unit_Code, data.get('reportType'),
                data.get('testInstruction'), data.get('loincCode'), data.get('allowDiscount'), 
                data.get('orderable'), data.get('showGraph'), data.get('active'), data.get('stat'), 
                data.get('nonReportable'), data.get('calculatedTest'), data.get('isOutsourced'), 
                data.get('minimumtime'), data.get('Emergencytime'), data.get('timeperiod'), 
                data.get('formula'), data.get('paraone'), data.get('paratwo'), data.get('Checkout'), 
                data.get('Culturetest'), data.get('isNABHL'), data.get('isCAP'), 
                data.get('is_Machine_Interfaced'), data.get('MachineName'), data.get('AssayCode'),
                data.get('IsSubTest'), data.get('SubTestCodes'), datetime.now(), 
                data.get('Iscutoffvalue'),'Active', testId
            ))

            db.commit()
            return JsonResponse({'message': 'Test description data updated successfully'})

       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)




@csrf_exempt
def delete_test_description_data(request):
    if request.method == 'POST':
        try:
            # Parse request body
            data = json.loads(request.body)
            testCode = data.get('testCode')
            print(f"Processing deletion for Test_Code={testCode}")

            if not testCode:
                print("Error: testCode is missing in request data")
                return JsonResponse({"success": False, "message": "testCode is required"}, status=400)

            # Check if the test exists
            existing_test = Test_Descriptions.objects.filter(Test_Code=testCode).first()
            if not existing_test:
                print(f"Test_Code {testCode} not found in Test_Descriptions")
                return JsonResponse({"success": False, "message": f"Test with Test_Code {testCode} does not exist"}, status=404)

            # Delete the test and related records within a transaction
            with transaction.atomic():
                # Delete related records (if ON DELETE CASCADE is not set)
                Testmaster_Remarks.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Testmaster_Remarks records for Test_Code={testCode}")

                Testmaster_Reference_Range.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Testmaster_Reference_Range records for Test_Code={testCode}")

                Testmaster_Cost_List.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Testmaster_Cost_List records for Test_Code={testCode}")

                Testmaster_Rule_Based.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Testmaster_Rule_Based records for Test_Code={testCode}")

                Testmaster_Interpretation_table.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Testmaster_Interpretation_table records for Test_Code={testCode}")

                Testmaster_Reflex_Test.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Testmaster_Reflex_Test records for Test_Code={testCode}")

                Age_Setup_Master.objects.filter(Test_Code=existing_test).delete()
                print(f"Deleted Age_Setup_Master records for Test_Code={testCode}")

                # Delete the Test_Descriptions record
                existing_test.delete()
                print(f"Deleted Test_Descriptions record for Test_Code={testCode}")

            return JsonResponse({"success": True, "message": "Test deleted successfully"}, status=200)

        except Exception as e:
            print(f"Error deleting Test_Code={testCode}: {str(e)}")
            return JsonResponse({"success": False, "message": f"Error deleting test: {str(e)}"}, status=500)

    else:
        print("Invalid request method")
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)

# gettestdescriptiondata
def get_test_description_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()

        # Select specific columns from the database
        query = """
            SELECT Test_Id, Test_Name, Test_Code, Department, Sub_Department, Header, Display_Text, Billing_Name, 
                   Container_Name, Specimen_Name, Method_Name, Gender, Input_Type, Decimal_Palces, Input_Pattern_Type, 
                   Test_Category, Logical_Category, Captured_Unit, UOM, Report_Type, Test_Instructions, Loinc_Code, 
                   Allow_Discount, Oderable, Show_Graph, Active_Status, STAT, Non_Reportable, Calculated_Test, Outsourced, 
                   Processing_Time, Emergency_Processing_Time, Period_Type, Formula, Parameter_One, Parameter_Two, Autocheck, 
                   Culturetest, Is_NABHL, Is_CAP, Is_Machine_Interfaced, Machine_Name, Reagent_Level, Assay_Code
            FROM Test_Descriptions
        """
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        test_description_data = []
        for row in result:
            test_description_dict = {
                'Test_Id': row[0],
                'Test_Name': row[1],
                'Test_Code': row[2],
                'Department': row[3],
                'Sub_Department': row[4],
                'Header': row[5],
                'Display_Text': row[6],
                'Billing_Name': row[7],
                'Container_Name': row[8],
                'Specimen_Name': row[9],
                'Method_Name': row[10],
                'Gender': row[11],
                'Input_Type': row[12],
                'Decimal_Places': row[13],
                'Input_Pattern_Type': row[14],
                'Test_Category': row[15],
                'Logical_Category': row[16],
                'Captured_Unit': row[17],
                'UOM': row[18],
                'Report_Type': row[19],
                'Test_Instructions': row[20],
                'Loinc_Code': row[21],
                'Allow_Discount': row[22],
                'Orderable': row[23],
                'Show_Graph': row[24],
                'Active_Status': row[25],
                'STAT': row[26],
                'Non_Reportable': row[27],
                'Calculated_Test': row[28],
                'Outsourced': row[29],
                'Processing_Time': row[30],
                'Emergency_Processing_Time': row[31],
                'Period_Type': row[32],
                'Formula': row[33],
                'Parameter_One': row[34],
                'Parameter_Two': row[35],
                'Autocheck': row[36],
                'Culturetest': row[37],
                'Is_NABHL': row[38],
                'Is_CAP': row[39],
                'Is_Machine_Interfaced': row[40],
                'Machine_Name': row[41],
                'Reagent_Level': row[42],
                'Assay_Code': row[43],
            }
            test_description_data.append(test_description_dict)

        # Return the asset data as JSON
        return JsonResponse(test_description_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},status=500)



@csrf_exempt
def insert_groupmaster_testlist(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            # print(data)

            # Get the tests from the request data
            tests = data if isinstance(data, list) else []
            print('data :',data)
            print('tests :',tests)
            if not tests:
                return JsonResponse({'error': 'No test data provided'})

            # Iterate over tests to extract group details and test names
            for test in tests:
                if not isinstance(test, dict):
                    return JsonResponse({'error': 'Invalid test data format'})
                


                group_code = test.get('group_code', '')
                group_name = test.get('group_name', '')
                test_name = test.get('test_name', '')
                Test_Code = test.get('Test_Code', '')
                print('group_code :',group_code)
                # Check if group_code already exists in the table
                check_query = "SELECT * FROM GroupMasterTestList WHERE group_code = %s AND Test_Code=%s"
                cursor.execute(check_query, (group_code,Test_Code))
                existing_record = cursor.fetchone()
                print('existing_record :',existing_record)
                
                if existing_record is not None:
                    # Update the existing record
                    print('update')
                    update_query = """
                        UPDATE GroupMasterTestList 
                        SET group_name = %s, test_name = %s 
                        WHERE group_code = %s
                    """
                    cursor.execute(update_query, (group_name, test_name, group_code))
                else:
                                
                    max_id_query = "SELECT MAX(Groupmaster_testlist_id) AS maxId FROM GroupMasterTestList"
                    cursor.execute(max_id_query)
                    max_id = cursor.fetchone()[0]
                    next_id = max_id + 1 if max_id is not None else 1


                    # Insert a new record
                    insert_query = """
                        INSERT INTO GroupMasterTestList 
                        (Groupmaster_testlist_id,group_code, group_name, test_name, Test_Code) 
                        VALUES (%s, %s, %s, %s, %s)
                    """
                    cursor.execute(insert_query, (next_id,group_code, group_name, test_name, Test_Code))

            db.commit()

            response_data = {'message': 'GroupMasterTestList data inserted/updated successfully'}
            return JsonResponse(response_data)

        except Exception as e:
            # Handle unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



@csrf_exempt
def update_add_interpretation_data(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new commercial data details
            data = json.loads(request.body)
            method_id = data.get('method_id')
            new_header = data.get('header')
            new_comments = data.get('comments')
            testname = data.get('testname')
            Test_Code = data.get('Test_Code')
            # Check if the reflex data exists
            cursor.execute("SELECT COUNT(*) FROM Testmaster_Interpretation_table WHERE Test_Id = %s", [method_id])
            testmaster_addinterpretation_exists = cursor.fetchone()[0]

            if testmaster_addinterpretation_exists:
                # Update the reflex data
                update_query = """
                    UPDATE Testmaster_Interpretation_table
                    SET 
                        Test_Name = %s, 
                        Header_interpretation = %s, 
                        Comments = %s                        
                    WHERE Test_Id = %s
                """
                cursor.execute(update_query, (testname, new_header, new_comments,  method_id))
                db.commit()

                response_data = {'message': 'addinterpretation data updated successfully'}
            else:
                # Reflex data does not exist
                response_data = {'error': 'addinterpretation data with the specified ID does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

#---------------------------------- get for interpretaion-----------------------------------------
    
def get_add_interpretation_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select role data from the database
        query = "SELECT * FROM Testmaster_Interpretation_table"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        testmaster_interpretation_data = []
        for row in result:
            testmaster_interpretation_dict = {
                'Test_Id': row[0],
                'Test_Name': row[1],
                'Header_interpretation': row[2],
                'Comments':row[3]
                 

            }
            testmaster_interpretation_data.append(testmaster_interpretation_dict)

        # Return the role data as JSON
        return JsonResponse(testmaster_interpretation_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#------------------------------- Update Reflex ---------------------------------=-----

@csrf_exempt
def update_reflex_data(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new commercial data details
            data = json.loads(request.body)
            method_id = data.get('method_id')
            new_mainTest = data.get('mainTest')
            new_reflexTest = data.get('reflexTest')
            new_reflexCode = data.get('reflexCode')
            testname = data.get('testname')
            Test_Code = data.get('Test_Code')
            
            # Check if the reflex data exists
            cursor.execute("SELECT COUNT(*) FROM Testmaster_Reflex_Test WHERE Test_id = %s", [method_id])
            testmaster_reflex_exists = cursor.fetchone()[0]

            if testmaster_reflex_exists:
                # Update the reflex data
                update_query = """
                    UPDATE Testmaster_Reflex_Test
                    SET 
                        Test_Name = %s, 
                        Main_Test = %s, 
                        Reflex_Test = %s,
                        Reflex_Code = %s
                    WHERE Test_id = %s
                """
                cursor.execute(update_query, (testname, new_mainTest, new_reflexTest, new_reflexCode, method_id))
                db.commit()

                response_data = {'message': 'Reflex data updated successfully'}
            else:
                # Reflex data does not exist
                response_data = {'error': 'Reflex data with the specified ID does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


#------------------------------- Get for Reflex --------------------------------------------------

def get_reflex_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select role data from the database
        query = "SELECT * FROM Testmaster_Reflex_Test"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        testmaster_reflex_data = []
        for row in result:
            testmaster_reflex_dict = {
                'Test_id': row[0],
                'Test_Name': row[1],
                'Main_Test': row[2],
                'Reflex_Test':row[3],
                'Reflex_Code':row[4]   

            }
            testmaster_reflex_data.append(testmaster_reflex_dict)

        # Return the role data as JSON
        return JsonResponse(testmaster_reflex_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#------------------------------------ update for Commercial---------------------------------

@csrf_exempt
def update_commericial_data(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new commercial data details
            data = json.loads(request.body)
            print(data)
            method_id = data.get('method_id')
            new_cpt = data.get('cpt')
            new_cprt = data.get('cprt')
            testname = data.get('testname')

            # Check if the commercial data exists
            cursor.execute("SELECT COUNT(*) FROM Testmaster_Cost_List WHERE Test_id = %s", [method_id])
            testmaster_commercial_exists = cursor.fetchone()[0]

            if testmaster_commercial_exists:
                # Update the commercial data
                update_query = """
                    UPDATE Testmaster_Cost_List
                    SET Test_Name = %s, 
                        Cost_per_Test = %s, 
                        Cost_Per_Reportable_Test = %s
                    WHERE Test_id = %s
                """
                cursor.execute(update_query, (testname, new_cpt, new_cprt, method_id))
                db.commit()

                response_data = {'message': 'Commercial data updated successfully'}
            else:
                # Commercial data does not exist
                response_data = {'error': 'Commercial data with the specified ID does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    

#---------------------------------- Get for cCommercial----------------------------0000000--------------

def get_commercial_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select role data from the database
        query = "SELECT * FROM Testmaster_Cost_List"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        commercial_data = []
        for row in result:
            commercial_dict = {
                'Test_id': row[0],
                'Test_Name': row[1].strip(),
                'Cost_per_Test': row[2],
                'Cost_Per_Reportable_Test':row[3]       

            }
            commercial_data.append(commercial_dict)

        # Return the role data as JSON
        return JsonResponse(commercial_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    


    
@csrf_exempt
def update_age_setup(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming this function connects to your database
            cursor = db.cursor()

            # Parse request body to get new age setup details
            data = json.loads(request.body)
            method_id = data.get('method_id')
            new_gender = data.get('gender')
            new_from_age = data.get('fromAge')
            new_age_type = data.get('ageType')
            new_to_age = data.get('toAge')
            new_to_age_type = data.get('toAgeType')
            new_from_value = data.get('fromvalue')
            new_to_value = data.get('tovalue')
            new_panic_low = data.get('panicLow')
            new_panic_high = data.get('panicHigh')
            testname = data.get('testname')
            reference = data.get('referencerange')
            print('reference', reference)
            referencerange = reference if reference is not None and reference != '' else 'None'
            print('referencerange', referencerange)
            if referencerange != 'None':
                summa = 'Yes'
            else:
                summa = 'No'

            # Check if the age setup exists
            cursor.execute("SELECT COUNT(*) FROM Age_Setup_Master WHERE S_No = %s", [method_id])
            age_setup_exists = cursor.fetchone()[0]

            if age_setup_exists:
                # Age setup exists, proceed to update
                update_query = """
                    UPDATE Age_Setup_Master 
                    SET TestName = %s, Gender = %s, FromAge = %s, FromAgeType = %s, Toage = %s,
                    ToAgeType = %s, From_Value = %s, To_Value = %s, PanicLow = %s, PanicHigh = %s, NormalValue = %s, Reference_Range = %s
                    WHERE S_No = %s
                """
                cursor.execute(update_query, (
                    testname, new_gender, new_from_age, new_age_type, new_to_age, new_to_age_type,
                    new_from_value, new_to_value, new_panic_low, new_panic_high, summa, referencerange, method_id
                ))
                db.commit()

                response_data = {'message': 'Age setup updated successfully'}
            else:
                # Age setup does not exist
                response_data = {'error': 'Age setup does not exist'}

            return JsonResponse(response_data)

        except Exception as e:
            # Handle any unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



def get_agesetup_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select role data from the database
        query = "SELECT * FROM Age_Setup_Master"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        age_setup_data = []
        for row in result:
            age_setup_dict = {
                'S_No': row[0],
                'TestName': row[1],
                'Gender': row[2],
                'FromAge':row[3],
                'FromAgeType':row[4],
                'Toage':row[5],
                'ToAgeType':row[6],
                'From_Value':row[7],
                'To_Value':row[8],
                'PanicLow':row[9],
                'PanicHigh':row[10],
                'Reference': row[12],
                'Test_Code': row[13]
            }
            age_setup_data.append(age_setup_dict)

        # Return the role data as JSON
        return JsonResponse(age_setup_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


    

#------------------------------------Insert for reflex-----------------------------------------
    
@csrf_exempt
def insert_reflex_test(request):
    if request.method == "POST":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print("Received data:", data)
            cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Reflex_Test")
            max_id_result = cursor.fetchone()
            # If max_id_result[0] is None, set max_id to 0, else use the value
            max_id = max_id_result[0] if max_id_result[0] is not None else 0
            next_id = max_id + 1
            # Extract the required fields from the request data
            testname = data.get('testname')
            maintestname = data.get('maintest')
            reflex_test = data.get('reflextestname')
            reflex_code= data.get('reflexcode')
            Test_Code = data.get('Test_Code')

            # Prepare and execute the insertion query
            insert_sql = """
                INSERT INTO Testmaster_Reflex_Test (Test_Id,Test_Name, Main_Test , Reflex_Test, Reflex_Code ,Test_Code)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_sql, (next_id, testname, maintestname, reflex_test, reflex_code,Test_Code))
            db.commit()

            return JsonResponse({"message": "reflex data inserted successfully"}, status=200)

        except Exception as e:
            # Log the error for debugging purposes
            print(f"Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)
        
        finally:
            # Ensure resources such as database connections and cursors are properly closed
            if cursor: cursor.close()
            if db: db.close()


#--------------------------------------Get For Groupmaster=----------------------------------------------
        
def get_groupmaster_masterlist(request):
    try:
        # with get_db_connection() as db, get_db_cursor(db) as cursor:
            
        cursor = db.cursor()            
        groupcode = request.GET.get('groupcode')
        # Select data from the database
        query = "SELECT * FROM GroupMasterTestList WHERE group_code = %s"
        cursor.execute(query, (groupcode,))
        
        # Convert the result into a list of dictionaries
        testmaster_grouplist_data = []
        for row in cursor:
            groupmaster_testlist_dict = {
                'groupmaster_testlist_id': row[0],
                'group_code': row[1].strip() if row[1] is not None else '',
                'group_name': row[2].strip() if row[2] is not None else '',
                'test_name': row[3].strip() if row[3] is not None else '',
                'Test_Code': row[4].strip() if row[4] is not None else '',
            }
            testmaster_grouplist_data.append(groupmaster_testlist_dict)
            
        # Return the data as JSON
        return JsonResponse(testmaster_grouplist_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    


def get_all_group_name(request):
    if request.method == "GET":
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            # SQL query to fetch all Test_Name entries
            get_name_query = "SELECT group_name, group_code FROM GroupMaster "
            cursor.execute(get_name_query)
            group_test_names = cursor.fetchall()  # Fetch all rows of the results

            # Use a list comprehension to extract test names directly
            group_test_name_list = [{'groupname': row[0], 'groupcode': row[1] }for row in group_test_names]

            # Check if the test_name_list is not empty
            print('group_test_name_list', group_test_name_list)
            if group_test_name_list:
                return JsonResponse(group_test_name_list, safe=False)
            else:
                return JsonResponse({"error": "No tests found."} )
        except Exception as e:
            # Log or print the exception message here if needed
            return JsonResponse({"error": str(e)})
        finally:
            # Close the cursor and db connection if they were successfully created
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."},status=400)
    



@csrf_exempt
def get_group_cost_for_billing(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            # group_name = request.GET.get('testname')
            

            # testname = request.GET.get('testname')
            ratecard = request.GET.get('ratecard')
            Test_Code = request.GET.get('Test_Code')
            
            print('Test_Code :',Test_Code)
            
            # Constructing the column name dynamically
            column_name = f"{ratecard}"
            
            get_details_query = f"""
    SELECT t.group_code, tc.Test_Name, tc.{column_name}
    FROM GroupMaster t
    INNER JOIN Testmaster_Cost_List tc ON t.group_code = tc.Test_Code 
    WHERE t.group_code = '{Test_Code}' AND tc.{column_name} IS NOT NULL
"""


            cursor.execute(get_details_query)
            result = cursor.fetchone()

            if result:
                group_data = {
                    'test_code': result[0],
                    'test_name': result[1],
                    'cost_per_reportable': result[2],
                    'testmethod' : 'Group'
                }
                return JsonResponse(group_data)
            else:
                return JsonResponse({'error': 'Group not found'}, status=404)

        except Exception as er:
            print('error :',er)
            return JsonResponse({"error": str(er)}, status=500)

        finally:
            if db:
                db.commit()
                db.close()
            if cursor:
                cursor.close()


#----------------------------------- Get for individual reflex data--------------------------------------
                

def get_for_individual_reflex(request):
    if request.method == 'GET':
        try:
            group_name = request.GET.get('testname')
            Test_Code = request.GET.get('Test_Code')
            cursor = db.cursor()
            cursor.execute(
                "SELECT Reflex_Test FROM Testmaster_Reflex_Test WHERE Test_Code = %s",
                [Test_Code]
            )
            result = cursor.fetchall()
            if result:
                testdata = [row[0] for row in result]
                return JsonResponse(testdata, safe=False)
            else:
                return JsonResponse({'error': 'Group not found'})

        except Exception as er:
            return JsonResponse({"error": str(er)}, status=500)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)




#-------------------------------- CSV apload for groupmaster=--------------------------------
    




@csrf_exempt
def post_groupmaster_csvfile(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        file = request.FILES.get('file')  # Get the uploaded file
        print(file)
        # Check if the file is in CSV format
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return JsonResponse({
                'error':
                'Unsupported file format. Please upload a CSV or Excel file'
            })

        # Convert DataFrame to a list of dictionaries
        csv_data = df.to_dict(orient='records')

        for row in csv_data:
            # Process data for missing values
            for key in row:
                if pd.isna(row[key]):
                    if isinstance(row[key], str):
                        row[key] = 'None'
                    elif isinstance(row[key], (int, float)):
                        row[key] = None

            # Fetch max ID from database for GroupMaster
            cursor.execute("SELECT MAX(group_master_id) FROM GroupMaster")
            max_group_master_id = cursor.fetchone()[0]
            next_group_master_id = max_group_master_id + 1 if max_group_master_id is not None else 1

            
            group_master_query = """INSERT INTO GroupMaster (group_master_id, group_code, group_name, display_name, billing_code, billing_name, gender, report, department_name,
                        test_category, logical_category, authorized_user, loinc_code, Group_Cost, InterpretationHead, Interpretation)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(
                group_master_query,
                (next_group_master_id, row['Group Code'], row['Group Name'],
                 row['Display Name'], row['Billing Code'], row['Billing Name'],
                 row['Gender'], row['Report'], row['Department Name'],
                 row['Test Category'], row['Logical Category'], row['Authorized User'],
                 row['Loinc Code'], row['Group Cost'], row['Interpretaion Head'],
                 row['Interpretation']))

          

        db.commit()  

        return JsonResponse({'message': 'File processed successfully'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        db.rollback()  # Rollback in case of an error
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)

    finally:
        cursor.close()
        db.close()


@csrf_exempt
def insert_into_commission_master(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('data',data)
            doctor_name = data.get('doctorname')
            doctor_type = data.get('doctortype')
            phone = data.get('phone')
            commission_percentage = data.get('commission')
            address_one = data.get('address1')
            address_two = data.get('address2')
            status = 'Active'
            PaymentType = data.get('PaymentType')
            Bankname = data.get('Bankname')
            AccNumber = data.get('CardNumber')
            HolderName = data.get('HolderName')
            Location = data.get('location')
            # db = get_db_connection()
            cursor = db.cursor()
            # Get the maximum Commission_Id from the table
            cursor.execute("SELECT MAX(Commission_Id) FROM Refering_Doctor_Commission")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            # Insert data into the database
            insert_query = """
            INSERT INTO Refering_Doctor_Commission (Commission_Id, Doctor_Name, Doctor_Type, Phone, Commission_Percentage, Address_One, Address_Two, Status, Payment_Type, Bank_Name, Holder_Name, Account_Number, Location)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (next_id, doctor_name, doctor_type, phone, commission_percentage, address_one, address_two, status, PaymentType, Bankname, HolderName, AccNumber, Location))
            db.commit()

            return JsonResponse({"success": "Data inserted successfully"})
        except Exception as e:
            print("Error", str(e))
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Only POST requests are allowed"})


#----------------------------------- get for commission ---------------------------------------

def get_commission_data(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            sql_query = """
                    SELECT Commission_Id, Doctor_Name, Doctor_Type, Phone, Commission_Percentage, Address_One, Address_Two, Status, Payment_Type, Bank_Name, Holder_Name, Account_Number FROM Refering_Doctor_Commission 
            """
            cursor.execute(sql_query)
            commission_data = cursor.fetchall()
            commission_list = []
            for row in commission_data:
                commission = {
                    'Commission_Id': row[0],
                    'Doctor_Name': row[1],
                    'Doctor_Type': row[2],
                    'Phone': row[3],
                    'Commission_Percentage': row[4],
                    'Address_One': row[5],
                    'Address_Two': row[6],
                    'Status' : row[7],
                    'Payment_Type': row[8],
                    'Bank_Name' : row[9],
                    'Holder_Name' : row[10],
                    'Account_Number': row[11]
                }
                commission_list.append(commission)
            
            return JsonResponse({'data': commission_list}, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({"error": "Only GET requests are allowed"})

#------------------------------------- update commission --------------------------------------------
@csrf_exempt
def update_into_commission_master(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()  # Assuming get_db_connection() and get_db_cursor() are defined somewhere
            cursor = db.cursor()            
            data = json.loads(request.body)
            print('data............', data)
            id = data.get('id')  # Retrieve id from the JSON data, not from request.POST
            print('---------------------------->', id)
            doctor_name = data.get('doctorname')
            doctor_type = data.get('doctortype')
            phone = data.get('phone')
            commission_percentage = data.get('commission')
            address_one = data.get('address1')
            address_two = data.get('address2')
            status = 'Active'
            update_query = """
                        UPDATE Refering_Doctor_Commission SET Doctor_Name = %s, Doctor_Type = %s, Phone = %s, Commission_Percentage = %s, Address_One = %s, Address_Two = %s, Status = %s WHERE Commission_Id = %s
                        """
            cursor.execute(update_query, (doctor_name, doctor_type, phone, commission_percentage, address_one, address_two, status, id))
            db.commit()
            return JsonResponse({"success": "Data updated successfully"})  # Changed "inserted" to "updated"
        except Exception as e:
            return JsonResponse({"error": str(e)})  # Changed "Error" to "error"
        finally:
            cursor.close()
            db.close()


#-------------------------- update status commission --------------------------------
@csrf_exempt
def statusupdatefor_doc_commission(request):
    if(request.method=='POST'):
        try:
            # db = get_db_connection()
            cursor = db.cursor()            
            data = json.loads(request.body)

            commission_id = data.get('Commission_Id')
            status = data.get('status')
            update_sql ="""
                    UPDATE Refering_Doctor_Commission SET Status = %s WHERE Commission_Id =%s
"""
            cursor.execute(update_sql, (status,commission_id,))
            db.commit()
            return JsonResponse({"success":"Status Changed Successfully"})
        except Exception as e:
            return JsonResponse({"Error : ", str(e)})
        finally:
            cursor.close()
            db.close()

def get_for_indivitual_doctor_commission(request):
    if(request.method == 'GET'):
        try:
            # db = get_db_connection()
            cursor = db.cursor()            
            doctorname = request.GET.get('Referingdoctor')

            get_query = """
                        SELECT Commission_Percentage FROM Refering_Doctor_Commission WHERE Doctor_Name = %s AND Status ='Active'
                        """
            cursor.execute(get_query, (doctorname,))
            commission = cursor.fetchone()[0]
            return JsonResponse({'amount': commission}, safe=False)

        except Exception as e:
            return JsonResponse({"Error:", str(e)})
        finally:
            cursor.close()
            db.close()


#= == = = = = = = = = = = = = = = = = => get for reference doc < = = = = = = = = = = = = = = = = = = = = = = = 

def get_ref_doctorname(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            location = request.GET.get('location')

            sql_query = """
                        SELECT Doctor_Name FROM Refering_Doctor_Commission 
                        WHERE Location = %s              
                          """
            cursor.execute(sql_query, (location,))

            doctor_names = [row[0] for row in cursor.fetchall()]

            return JsonResponse(doctor_names, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)})
        finally:
            cursor.close()
            db.close()


#==========================================> csv file insert for lab masters <===============================================

@csrf_exempt
def insert_csv_file_for_testmasters(request): 
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        file = request.FILES.get('file')
        print('file.................', file)

        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return JsonResponse({
                'error': "'Unsupported file format. Please upload a CSV or Excel file'"
            })
        csv_data = df.to_dict(orient='records')
        print('csv_data', csv_data)
        for row in csv_data:
            for key in row:
                if pd.isna(row[key]):
                    if isinstance(row[key], str):
                        row[key] = 'None'
                    elif isinstance(row[key], (int, float)):
                        row[key] = None  
            
            cursor.execute("SELECT MAX(Test_Id) FROM Test_Descriptions")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            insert_query = """
                INSERT INTO Test_Descriptions (
                    Test_Id, Test_Name, Test_Code, Department, Sub_Department, Header, Display_Text, Billing_Name,
                    Container_Name, Specimen_Name, Method_Name, Gender, Input_Type, Decimal_Palces, Input_Pattern_Type,
                    Test_Category, Logical_Category, Captured_Unit, UOM, Report_Type, Test_Instructions, Loinc_Code,
                    Allow_Discount, Oderable, Show_Graph, Active_Status, STAT, Non_Reportable, Calculated_Test, Outsourced,
                    Processing_Time, Emergency_Processing_Time, Period_Type, Formula, Parameter_One, Parameter_Two, Autocheck,
                    Culturetest, Is_NABHL, Is_CAP, Is_Machine_Interfaced, Machine_Name, Reagent_Level
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                          %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                next_id, row['Test_Name'], row['Test_Code'], row['Department'], row['Sub_Department'], row['Header'],
                row['Display_Text'], row['Billing_Name'], row['Container_Name'], row['Specimen_Name'], row['Method_Name'],
                row['Gender'], row['Input_Type'], row['Decimal_Palces'], row['Input_Pattern_Type'], row['Test_Category'],
                row['Logical_Category'], row['Captured_Unit'], row['UOM'], row['Report_Type'], row['Test_Instructions'],
                row['Loinc_Code'], row['Allow_Discount'], row['Oderable'], row['Show_Graph'], row['Active_Status'], row['STAT'],
                row['Non_Reportable'], row['Calculated_Test'], row['Outsourced'], row['Processing_Time'], row['Emergency_Processing_Time'],
                row['Period_Type'], row['Formula'], row['Parameter_One'], row['Parameter_Two'], row['Autocheck'], row['Culturetest'],
                row['Is_NABHL'], row['Is_CAP'], row['Is_Machine_Interfaced'], row['Machine_Name'], row['Reagent_Level']
            ))

            cursor.execute("SELECT MAX(Test_id) FROM Testmaster_Cost_List")
            max_id = cursor.fetchone()[0]
            next_id_cost = max_id + 1 if max_id is not None else 1

            insert_query_cost = """
                INSERT INTO Testmaster_Cost_List (Test_id, Test_Name, Basic,Test_Code) 
                VALUES (%s, %s, %s,%s)
            """
            cursor.execute(insert_query_cost, (
                next_id_cost, row['Test_Name'], row['Basic'] ,row['Test_Code']
            ))

            cursor.execute("SELECT MAX(Test_Id) FROM Testmaster_Interpretation_table")
            max_id = cursor.fetchone()[0]
            inter_id = max_id + 1 if max_id is not None else 1

            insert_inter_query = """
                INSERT INTO Testmaster_Interpretation_table (Test_Id, Test_Name, Header_interpretation, Comments,Test_Code)
                VALUES (%s, %s, %s, %s,%s)
            """
            cursor.execute(insert_inter_query, (
                inter_id, row['Test_Name'], row['Header_interpretation'], row['Comments'],row['Test_Code']
            ))


        db.commit()  
        return JsonResponse({'message': 'File processed successfully'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        db.rollback()  # Rollback in case of an error
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()



# @csrf_exempt
# def insert_csv_file_for_referencerange(request):
#     try:
#         # db = get_db_connection()
#         cursor = db.cursor()
#         file = request.FILES.get('file')
#         print('file.................', file)

#         if file.name.endswith('.csv'):
#             try:
#                 df = pd.read_csv(file, encoding='utf-8')
#             except UnicodeDecodeError:
#                 try:
#                     df = pd.read_csv(file, encoding='latin-1')
#                 except UnicodeDecodeError as e:
#                     print(f"UnicodeDecodeError: {str(e)}")
#                     return JsonResponse({
#                         'error': 'Failed to decode CSV file. Please check the file encoding.'
#                     })

#         elif file.name.endswith('.xlsx'):
#             df = pd.read_excel(file, engine='openpyxl')
#         else:
#             return JsonResponse({
#                 'error': 'Unsupported file format. Please upload a CSV or Excel file'
#             })

#         print('df :',df)
#         csv_data = df.to_dict(orient='records')
#         print('csv_data :',csv_data)
#         for row in csv_data:
#             # Handle NaN values in the row
#             for key in row:
#                 if pd.isna(row[key]):
#                     if isinstance(row[key], str):
#                         row[key] = 'None'
#                     elif isinstance(row[key], (int, float)):
#                         row[key] = None

#             # Determine the next ID to insert
#             cursor.execute("SELECT MAX(Test_Id) FROM Age_Setup_Master")
#             max_id = cursor.fetchone()[0]
#             next_id = max_id + 1 if max_id is not None else 1

#             # Check if Gender column is missing and insert 'Both' if needed
#             gender = row['Gender']
#             print('gender :',gender)
            
#             if gender is None:
#                 gender = 'Both'
#             elif gender == 'None':
#                 gender = 'Both'
#             else:
#                 gender = gender
            
#             insert_query = """
#                 INSERT INTO Age_Setup_Master (Test_Id, Gender, FromAge, FromAgeType, Toage, ToAgeType, From_Value, To_Value, PanicLow, PanicHigh, Test_Code_id, Reference_Range, created_by, created_at, updated_at)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             cursor.execute(insert_query, (
#                 next_id,
#                 # row['Testname'],
#                 gender,
#                 row['FromAge'],
#                 row['FromAgeType'],
#                 row['Toage'],
#                 row['ToAgeType'],
#                 row['From_Value'],
#                 row['To_Value'],
#                 row['PanicLow'],
#                 row['PanicHigh'],
#                 row['Test_Code'],
#                 row['Reference_Range'],
#                 'admin',
#                 datetime.now(),
#                 datetime.now()
#             ))

#         db.commit()
#         return JsonResponse({'message': 'File processed successfully'})

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         db.rollback()  # Rollback in case of an error
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     finally:
#         if cursor:
#             cursor.close()
#         if db:
#             db.close()

from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

@csrf_exempt
def insert_csv_file_for_referencerange(request):
    try:
        cursor = db.cursor()
        file = request.FILES.get('file')

        if file.name.endswith('.csv'):
            try:
                df = pd.read_csv(file, encoding='utf-8')
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(file, encoding='latin-1')
                except UnicodeDecodeError as e:
                    return JsonResponse({'error': 'Failed to decode CSV file. Please check the file encoding.'})
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return JsonResponse({'error': 'Unsupported file format. Please upload a CSV or Excel file'})

        csv_data = df.to_dict(orient='records')
        for row in csv_data:
            # Clean NaN
            for key in row:
                if pd.isna(row[key]):
                    row[key] = None

            gender = row.get('Gender') or 'Both'
            if gender == 'None':
                gender = 'Both'

            # ✅ Check if Test_Code exists
            cursor.execute("SELECT 1 FROM test_descriptions WHERE Test_Code = %s", (row['Test_Code'],))
            if cursor.fetchone() is None:
                print(f"Skipping row: Test_Code '{row['Test_Code']}' not found in test_descriptions")
                continue

            cursor.execute("SELECT MAX(Test_Id) FROM Age_Setup_Master")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            insert_query = """
                INSERT INTO Age_Setup_Master (
                    Test_Id, Gender, FromAge, FromAgeType, Toage, ToAgeType,
                    From_Value, To_Value, PanicLow, PanicHigh,
                    Test_Code_id, Reference_Range,
                    created_by, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                next_id,
                gender,
                row['FromAge'],
                row['FromAgeType'],
                row['Toage'],
                row['ToAgeType'],
                row['From_Value'],
                row['To_Value'],
                row['PanicLow'],
                row['PanicHigh'],
                row['Test_Code'],  # Ensure this exists in test_descriptions
                row['Reference_Range'],
                'admin',
                datetime.now(),
                datetime.now()
            ))

        db.commit()
        return JsonResponse({'message': 'File processed successfully'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        db.rollback()
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


# @csrf_exempt
# def insert_groupmaster_testlist(request):
#     if request.method == 'POST':
#         try:
            # db = get_db_connection()
#             cursor = db.cursor()
#             data = json.loads(request.body)
#             print(data)

#             # Get the tests from the request data
#             tests = data if isinstance(data, list) else []

#             if not tests:
#                 return JsonResponse({'error': 'No test data provided'})

#             # SQL query to fetch the highest existing groupmaster_testlist_id
#             max_id_query = "SELECT MAX(groupmaster_testlist_id) FROM GroupMasterTestList"
#             cursor.execute(max_id_query)
#             max_id = cursor.fetchone()[0]
#             next_id = max_id + 1 if max_id is not None else 1

#             # SQL query to insert a new record with placeholders
#             insert_query = "INSERT INTO GroupMasterTestList (groupmaster_testlist_id, group_code, group_name, test_name,Test_Code) VALUES (%s, %s, %s, %s, %s)"


#             # Iterate over tests to extract group details and test names
#             for test in tests:
#                 if not isinstance(test, dict):
#                     return JsonResponse({'error': 'Invalid test data format'})

#                 group_code = test.get('groupCode', '')
#                 group_name = test.get('groupName', '')
#                 test_name = test.get('TestName', '')
#                 Test_Code = test.get('Test_Code', '')
               

#                 # Insert the test into the database
#                 cursor.execute(insert_query, (next_id, group_code, group_name, test_name,Test_Code))
#                 next_id += 1  # Increment the ID for the next test

#             insertgroupcost = """INSERT INTO Testmaster_Cost_List (Test_id,Test_Name,Basic,Test_Code) VALUES (%s, %s, %s, %s)"""
#             cursor.execute(insertgroupcost,(group_name,))
#             db.commit()

#             response_data = {'message': 'GroupMasterTestList data inserted successfully'}
#             return JsonResponse(response_data)

#         except Exception as e:
#             # Handle unexpected errors
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#         finally:
#             # Ensure the cursor and connection are closed properly
#             cursor.close()
#             db.close()
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)


def get_offer_package_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select asset data from the database
        query = "SELECT * FROM OfferPackage"
        cursor.execute(query)
        result = cursor.fetchall()

        # Close the database connection
        cursor.close()
        db.close()

        # Convert the result into a list of dictionaries
        group_master_data = []
        for row in result:
            group_master_dict = {
                'offer_package_id': row[0],
                'package_code': row[1].strip() if row[1] is not None else None,
                'package_name': row[2].strip() if row[2] is not None else None,
                'display_name': row[3].strip() if row[3] is not None else None,

                'gender': row[4].strip() if row[4] is not None else None,
                'report': row[5].strip() if row[5] is not None else None,
                'department_name': row[6].strip() if row[6] is not None else None,
                'test_category': row[7].strip() if row[7] is not None else None,
                'logical_category': row[8].strip() if row[8] is not None else None,
                'authorized_user': row[9].strip() if row[9] is not None else None,

                'Package_Cost': row[10] if row[10] is not None else None,
                'Status': row[11] if row[11] is not None else None
            }
            group_master_data.append(group_master_dict)

        # Return the asset data as JSON
        return JsonResponse(group_master_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

from Masters.models import *


@csrf_exempt
def insert_offer_package(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()            
            data = json.loads(request.body)
            print("offerpackagedata", data)

            package_code = data.get('PackageCode', None)
            package_name = data.get('PackageName', None)
            display_name = data.get('displayName', None)
            gender = data.get('gender', None)
            report = data.get('reportType', None)
            department_name = data.get('departmentName', None)
            test_category = data.get('testCategory', None)
            logical_category = data.get('logicalCategory', None)
            authorized_user = data.get('authorizedUser', None)
            package_cost = data.get('PackageCost', None)

            package_code_upper = package_code if package_code else None
            package_name_upper = package_name if package_name else None
            display_name_upper = display_name if display_name else None
            gender_upper = gender if gender else None
            report_upper = report if report else None
            department_name_upper = department_name if department_name else None
            test_category_upper = test_category if test_category else None
            logical_category_upper = logical_category if logical_category else None
            authorized_user_upper = authorized_user if authorized_user else None
            status= 'Active'
            check_query = "SELECT COUNT(*) FROM OfferPackage WHERE package_name = %s"
            cursor.execute(check_query, (package_name_upper,))
            existing_count = cursor.fetchone()[0]

            if existing_count > 0:
                response_data = {'error': 'OfferPackage with the same type already exists'}
            else:
                max_id_query = "SELECT MAX(offer_package_id) AS maxId FROM OfferPackage"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                insert_query = "INSERT INTO OfferPackage(offer_package_id, package_code, package_name, display_name, gender, report, department_name, test_category, logical_category, authorized_user,Status, UpdatedAt, CreatedAt, Package_Cost) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s)"
                cursor.execute(insert_query, (next_id, package_code_upper, package_name_upper, display_name_upper, gender_upper, report_upper, department_name_upper, test_category_upper, logical_category_upper, authorized_user_upper, status,datetime.now(), datetime.now(), package_cost))
                db.commit()
                
                
            Testmaster_Cost_List_Test_Id = (
                            Testmaster_Cost_List.objects.aggregate(Max("Test_Id"))[
                                "Test_Id__max"
                            ]
                        )
            next_Testmaster_Cost_List_Test_Id = (
                            1
                            if Testmaster_Cost_List_Test_Id is None
                            else int(Testmaster_Cost_List_Test_Id) + 1
                        )     
            package_ins = OfferPackageMaster.objects.get(package_code = package_code_upper)
            Testmaster_Cost_List.objects.create(
                        Test_Id = next_Testmaster_Cost_List_Test_Id,
                        Basic = package_cost,
                        Package_Code = package_ins,
                        created_by = authorized_user_upper
                    )    
            response_data = {'message': 'OfferPackage data inserted successfully'}
                
            # max_id_query = "SELECT MAX(Test_id) AS maxId FROM Testmaster_Cost_List"
            # cursor.execute(max_id_query)
            # max_id = cursor.fetchone()[0]
            # Next_id = max_id + 1 if max_id is not None else 1

            # insert_groupcost = """INSERT INTO Testmaster_Cost_List (Test_id,Test_Name,Basic,Test_Code) VALUES (%s, %s, %s, %s)"""
            # cursor.execute(insert_groupcost,(Next_id,package_name_upper,package_cost,package_code_upper))
            # db.commit()
            
            
            
            
            return JsonResponse(response_data)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
        finally:
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



@csrf_exempt
def insert_offerpackage_testlist(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            data = json.loads(request.body)
            print("igfds",data)

            # Get the tests from the request data
            tests = data if isinstance(data, list) else []

            if not tests:
                return JsonResponse({'error': 'No test data provided'})

            # SQL query to fetch the highest existing offer_package_list_id
            # max_id_query = "SELECT MAX(offer_package_list_id) FROM OfferPackageList"
            # cursor.execute(max_id_query)
            # max_id = cursor.fetchone()[0]
            # next_id = max_id + 1 if max_id is not None else 1

            # SQL query to insert a new record with placeholders
            insert_query = "INSERT INTO OfferPackageList (offer_package_list_id, package_code, package_name, test_name,Test_Code_id,Test_Method, UpdatedAt, CreatedAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

            # Iterate over tests to extract package details and test names
            for test in tests:
                if not isinstance(test, dict):
                    return JsonResponse({'error': 'Invalid test data format'})
                
                max_id_query = "SELECT MAX(offer_package_list_id) AS maxId FROM OfferPackageList"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1
                package_code = test.get('PackageCode', '')
                package_name = test.get('PackageName', '')
                test_name = test.get('TestName', '')
                # Test_Code = test.get('Test_Code','')
                Test_Method = test.get('Test_Method', '')

                # Insert the test into the database
                # cursor.execute(insert_query, (next_id, package_code, package_name, test_name,Test_Code,Test_Method))
                # next_id += 1  # Increment the ID for the next test
                test_code = None
                group_code = None
                if test.get('Test_Code','').startswith('LTC'):
                    test_code = test.get('Test_Code')
                    print('test_code',test_code)
                    cursor.execute("""
                        INSERT INTO OfferPackageList (offer_package_list_id,package_code, package_name, test_name, Test_Code_id,Test_Method, UpdatedAt, CreatedAt)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (next_id,package_code, package_name, test_name, test_code,Test_Method, datetime.now(), datetime.now()))
                else:
                    group_code = test.get('Test_Code')
                    print(group_code,"group_code")
                    cursor.execute("""
                        INSERT INTO OfferPackageList (offer_package_list_id,package_code, package_name, test_name, Group_Code_id,Test_Method, UpdatedAt, CreatedAt)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (next_id,package_code, package_name, test_name, group_code,Test_Method, datetime.now(), datetime.now()))

            db.commit()
            

            response_data = {'message': 'OfferPackageList data inserted successfully'}
            return JsonResponse(response_data)

        except Exception as e:
            # Handle unexpected errors
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        finally:
            # Ensure the cursor and connection are closed properly
            cursor.close()
            db.close()
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


        
def get_offerpackage_masterlist(request):
    try:
        # with get_db_connection() as db, get_db_cursor(db) as cursor:
        cursor = db.cursor()
        # Select data from the database
        query = "SELECT * FROM OfferPackageList"
        cursor.execute(query)
        # Convert the result into a list of dictionaries
        testmaster_grouplist_data = []
        for row in cursor:
            groupmaster_testlist_dict = {
                'offer_package_list_id': row[0],
                'package_code': row[1].strip() if row[1] is not None else '',
                'package_name': row[2].strip() if row[2] is not None else '',
                'test_name': row[3].strip() if row[3] is not None else '',
                'Test_Code': row[4].strip() if row[4] is not None else ''
            }
            testmaster_grouplist_data.append(groupmaster_testlist_dict)
        # Return the data as JSON
        return JsonResponse(testmaster_grouplist_data, safe=False)

    except Exception as e:
        # Handle unexpected errors
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    
@csrf_exempt
def update_offerpackage_data(request):
    if request.method == 'POST':
        # cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()         
            data = json.loads(request.body)

            package_code = data.get('PackageCode')
            package_name = data.get('PackageName')
            display_name = data.get('displayName')
            gender = data.get('gender')
            report_type = data.get('reportType')
            department_name = data.get('departmentName')
            test_category = data.get('testCategory')
            logical_category = data.get('logicalCategory')
            authorized_user = data.get('authorizedUser')
            package_cost = data.get('PackageCost')
            selected_tests = data.get('selectedtest')


            # Update the OfferPackage table
            cursor.execute("""
                UPDATE OfferPackage
                SET package_name = %s, display_name = %s, gender = %s, report = %s, department_name = %s,
                    test_category = %s, logical_category = %s, authorized_user = %s, Package_Cost = %s, UpdatedAt = %s
                WHERE package_code = %s
            """, (package_name, display_name, gender, report_type, department_name, test_category, logical_category, authorized_user, package_cost, datetime.now(), package_code))

            print('update')
            # Remove old tests from OfferPackageList
            cursor.execute("DELETE FROM OfferPackageList WHERE package_code = %s", (package_code,))

            print('delete')

            # Insert new tests into OfferPackageList
            for test in selected_tests:
                max_id_query = "SELECT MAX(offer_package_list_id) AS maxId FROM OfferPackageList"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1
 
 
                test_name = test.get('TestName')
                test_code = None
                group_code = None
                Test_Method = test.get('Test_Method')
                print('test_code',test.get('Test_Code'))
                if test.get('Test_Code','').startswith('LTC'):
                    test_code = test.get('Test_Code')
                    print('test_code',test_code)
                    cursor.execute("""
                        INSERT INTO OfferPackageList (offer_package_list_id,package_code, package_name, test_name, Test_Code_id,Test_Method, UpdatedAt, CreatedAt)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (next_id,package_code, package_name, test_name, test_code,Test_Method, datetime.now(), datetime.now()))
                else:
                    group_code = test.get('Test_Code')
                    print(group_code,"group_code")
                    cursor.execute("""
                        INSERT INTO OfferPackageList (offer_package_list_id,package_code, package_name, test_name, Group_Code_id,Test_Method, UpdatedAt, CreatedAt)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (next_id,package_code, package_name, test_name, group_code,Test_Method, datetime.now(), datetime.now()))
               
             
            print('insert')
           
            db.commit()
 
            return JsonResponse({'success': 'Package updated successfully'})

        except Exception as e:
            db.rollback()
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

        finally:
            cursor.close()
            db.close()





# def summafun():
#     try:
#         testname = 'Hemoglobin'
        # db = get_db_connection()
#         cursor = db.cursor()#         checkautoquey="""
#             select Test_Name,Parameter_One,Parameter_Two from Test_Descriptions where Autocheck='Yes'
#         """
#         cursor.execute(checkautoquey)
#         checkautores=cursor.fetchall()
        
#         if any(testname in checkauto[0] for checkauto in checkautores):
#             # Create a scheduler instance
#             scheduler = BackgroundScheduler()
#             scheduler.start()
#             print('Scheduler started')
#             dataaaaaaa={
#                         'next_id':1,
#                         'patientid':'chchgchg',
#                         'visitid':'visitid',
#                     }
#             # If testname matches, add task to the job scheduler
#             for checkauto in checkautores:
#                 if testname == checkauto[0]:
#                     task_name = testname
#                     times_to_call = 3  # Parameter_One determines how many times to call the job
#                     time_gap = 20  # Parameter_Two determines time gap for the job calling

#                     # Schedule the job to run multiple times with a time gap
#                     for i in range(times_to_call):
#                         print('time_gap', time_gap, time_gap * (i + 1))
#                         start_time = datetime.now() + timedelta(seconds=time_gap * (i + 1))  # Adjusted start time
#                         print('start_time', start_time)
#                         scheduler.add_job(
#                             func=job_function_test,
#                             trigger='date',  # Using 'date' trigger to specify a specific date and time
#                             run_date=start_time,  # Time at which the job should run
#                             args=(dataaaaaaa,),
#                             id=f"{task_name}_{i}",
#                             replace_existing=True  # Replace existing job with the same id if present
#                         )
#     except Exception as e:
#         print("error:", e)
#         if db is not None:
#             db.rollback()  # Rollback in case of error
#         return JsonResponse({"error": "Failed to add billing information"}, status=500)
#     finally:
#         if cursor is not None:
#             cursor.close()
#         if db is not None:
#             db.close()

# # Call the function to execute the scheduling logic
# summafun()



def get_for_ratecard(request):
    if request.method == "GET":
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            ratecard = request.GET.get('ratecard')
            
            # Constructing the column name dynamically
            column_name = f"`{ratecard}`"
            test_cost = []
            
            # Updated query to join Test_Descriptions and Testmaster_Cost_List tables
            # Assumes 'Test_Name' is a column in both tables that can be used for joining
            get_details_query = f"""
            SELECT Test_Name, {column_name}, Basic, Test_id
            FROM Testmaster_Cost_List
            WHERE {column_name} IS NOT NULL
            """
            
            cursor.execute(get_details_query)
            test_details = cursor.fetchall()

            for row in test_details:
                # Creating the dictionary with additional details
                details_dict = {
                    'testname': row[0],
                    'Schemecost': row[1],
                    'basicprice': row[2],
                    'testid' : row[3] 
                }
                test_cost.append(details_dict)

            if test_cost:
                return JsonResponse(test_cost, safe=False)
            else:
                return JsonResponse({"message": "No data found."})

        except Exception as e:
            print('error:', e)
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."})
    

@csrf_exempt
def update_new_ratecard(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()            
            data = json.loads(request.body)
            print(data)

            testid = data.get('0')
            testname = data.get('1')
            update = data.get('5')
            franchaise = data.get('franchaisename')

            # Use parameterized queries to prevent SQL injection
            update_query = f"""
                UPDATE Testmaster_Cost_List 
                SET {franchaise} = {update}
                WHERE Test_id = {testid}
            """
            cursor.execute(update_query)
            db.commit()
            return JsonResponse({'message': "Ratecard updated successfully"})

        except Exception as e:
            print('Error', e)
            return JsonResponse({"Error": str(e)})
        finally:
            cursor.close()
            db.close()

#= = = = = = = = = = = = = = = = = == = = = =  Test report for Word file == = = = = == = = = = = = = = = = = = = = = = = = 
@csrf_exempt
def insert_word_file_for_test(request):
    if request.method == 'POST':
        db = None
        cursor = None
        try:
            # Get database connection and cursor
            # db = get_db_connection()
            cursor = db.cursor()
            # Retrieve data from the request
            wordfile = request.FILES.get('file')
            testname = request.POST.get('Testname')
            department = request.POST.get('department')
            # test_code = request.POST.get('Test_Code')
            
            if not (wordfile and testname and department):
                return JsonResponse({"Error": "Missing required fields"}, status=400)

            # Read and encode the file
            pdf_file_content = wordfile.read()
            pdf_file_base64 = base64.b64encode(pdf_file_content).decode('utf-8')
            
            # Generate next Document_Id
            cursor.execute("SELECT MAX(Document_Id) FROM Word_Document_for_result")
            max_id = cursor.fetchone()[0]
            next_id = max_id + 1 if max_id is not None else 1

            # Insert the data into the database
            insert_query = """
                INSERT INTO Word_Document_for_result (Document_Id, Department_Name, Test_Name, Word_File)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(insert_query, (next_id, department, testname, pdf_file_base64))
            db.commit()

            # Check if the row was inserted successfully
            if cursor.rowcount > 0:
                return JsonResponse({"message": "Document uploaded successfully"})
            else:
                return JsonResponse({"Error": "Failed to insert document into the database"}, status=500)

        except Exception as e:
            # Log the full stack trace for debugging
            # print("Error: ", traceback.format_exc())
            return JsonResponse({"Error": str(e)}, status=500)

        finally:
            # Close cursor and connection
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"Error": "Invalid request method"}, status=405)

#===  = = = = = = = = = = = =  = = = = = = = get test name for department wise = = = == = = = == == = = = = == = = = = = = = = = = = = = = =

def get_test_by_dept(request):
    if request.method == "GET":
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            department = request.GET.get('department')
            # SQL query to fetch all Test_Name entries
            get_name_query = "SELECT Test_Name FROM Test_Descriptions WHERE Sub_Department = %s"
            cursor.execute(get_name_query, (department,))
            test_names = cursor.fetchall()  # Fetch all rows of the results 

            # Use a list comprehension to extract test names directly
            test_name_list = [{'Test_Name' :row[0]}for row in test_names]

            # Check if the test_name_list is not empty
            if test_name_list:
                return JsonResponse(test_name_list, safe=False, status=200)
            else:
                return JsonResponse({"error": "No tests found."}, status=404)
        except Exception as e:
            # Log or print the exception message here if needed
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            # Close the cursor and db connection if they were successfully created
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
    


def get_test_name_by_word(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            # department = request.GET.get('department')
            # SQL query to fetch all Test_Name entries
            get_name_query = "SELECT Test_Name, Department_Name FROM Word_Document_for_result "
            cursor.execute(get_name_query)
            test_names = cursor.fetchall()  # Fetch all rows of the results 

            # Use a list comprehension to extract test names directly
            test_name_list = [{'Test_Name' :row[0],'Department_Name': row[1] }for row in test_names]

            # Check if the test_name_list is not empty
            if test_name_list:
                return JsonResponse(test_name_list, safe=False, status=200)
            else:
                return JsonResponse({"error": "No tests found."}, status=404)
        except Exception as e:
            # Log or print the exception message here if needed
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            # Close the cursor and db connection if they were successfully created
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)



@csrf_exempt
def insert_csv_file_for_antibiotic(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        file = request.FILES.get('file')
        print('file.................', file)

        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return JsonResponse({
                'error':
                "'Unsupported file format. Please upload a CSV or Excel file'"
            })
        csv_data = df.to_dict(orient='records')

        for row in csv_data:
            for key in row:
                if pd.isna(row[key]):
                    if isinstance(row[key], str):
                        row[key] = 'None'
                    elif isinstance(row[key], (int, float)):
                        row[key] = None  
            
            cursor.execute("SELECT MAX(anti_biotic_id) FROM AntibioticMaster ")
            max_id = cursor.fetchone()[0]

            next_id = max_id + 1 if max_id is not None else 1 

            insert_query = """
                            INSERT INTO AntibioticMaster (anti_biotic_id, anti_biotic_group_code, anti_biotic_code, anti_biotic_des)
                            VALUES (%s, %s, %s, %s)

                        """
            cursor.execute(insert_query, (next_id, row['anti_biotic_group_code'], row['anti_biotic_code'], row['anti_biotic_des']))

        db.commit()
        return JsonResponse({'message': 'File processed successfully'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        db.rollback()  # Rollback in case of an error
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()




def get_package_code(request):
    try:
        
        # db = get_db_connection()
        cursor = db.cursor()       
        query = """SELECT MAX(package_code) FROM OfferPackage"""
        cursor.execute(query)
        max_id = cursor.fetchone()[0]
        print('max_id :',max_id)
        
        
        numeric_part = 1
        
        if max_id is not None:
            numeric_part = int(max_id[4:]) + 1
       
        print('numeric_part :',numeric_part)
        numeric_part_str = str(numeric_part).zfill(3)  
        print('numeric_part_str :',numeric_part_str)
        next_id = f'PAC{numeric_part_str}'

        response = {"message": "Success", "nextoffer_package_id": next_id}
        return JsonResponse(response)
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)},status=500)

    finally:
       cursor.close()
       db.close()
     
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
    
        
# def test_and_group_forpackage(request):
#     try:
        
        # db = get_db_connection()
#         cursor = db.cursor()
#             # First query: Get all test names and group names with their codes
#         query1 = """
#             SELECT test_name AS name, Test_Code AS code, 'Test_Code' AS code_type
#             FROM Test_Descriptions
#             UNION ALL
#             SELECT group_name AS name, group_code AS code, 'group_code' AS code_type
#             FROM GroupMaster
#             UNION ALL 
#             SELECT package_name AS name, package_code AS code, 'package_code' AS code_type
#             FROM OfferPackage
#             """ 
            
#         cursor.execute(query1)
#         result1 = cursor.fetchall()
            
#         formatted_results = [
#                 {
#                     'name': row[0], 
#                     row[2]: row[1],
#                     'testmethod': 'Group' if row[2] == 'group_code' or row[2] == 'package_code' else 'Individual',
#                     'test_details': [] if row[2] == 'group_code' or row[2] == 'package_code' else None
#                 }
#                 for row in result1
#             ]
            
#             # Prepare a dictionary to keep track of group codes
#         group_codes = {row['group_code']: row for row in formatted_results if 'group_code' in row}
            
#         for group_code, group in group_codes.items():
#             query2 = """
#                 SELECT td.test_name, td.Test_Code
#                 FROM GroupMasterTestList gmtl
#                 JOIN Test_Descriptions td ON gmtl.Test_Code = td.Test_Code
#                 WHERE gmtl.group_code = %s
#                 """
#             cursor.execute(query2, (group_code,))
#             result2 = cursor.fetchall()
                
#                 # Add test details to the group
#             group['test_details'] = [
#                     {'test_name': row[0], 'test_code': row[1]}
#                     for row in result2
#                 ]
            
#         return JsonResponse(formatted_results, safe=False)
#         # else:
#         #         return JsonResponse({'error': 'Invalid credentials'}, status=401)
#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': str(e)}, status=500)

#     finally:
#         cursor.close()
#         db.close()
        

def test_and_group_forpackage(request):
    try:
        # token_id = request.headers.get('tokenid')
        # password = request.headers.get('password')
        # print('tokenid',token_id)
        # print('password',password)
        
        # if not token_id or not password:
        #     return JsonResponse({'error': 'Token-ID and Password required'}, status=400)
        
        # if authenticate_request(token_id, password):
        # db = get_db_connection()
        cursor = db.cursor()    
        # Query to get all test names, group names, and package names with their codes
        query1 = """
            SELECT test_name AS name, Test_Code AS code, 'Test_Code' AS code_type
            FROM Test_Descriptions
            UNION ALL
            SELECT group_name AS name, group_code AS code, 'group_code' AS code_type
            FROM group_master
            UNION ALL 
            SELECT package_name AS name, package_code AS code, 'package_code' AS code_type
            FROM OfferPackage
        """ 
        cursor.execute(query1)
        result1 = cursor.fetchall()

        # Format the results
        formatted_results = [
            {
                'name': row[0], 
                row[2]: row[1],
                'testmethod': (
                    'Group' if row[2] == 'group_code' 
                    else 'Offers' if row[2] == 'package_code' 
                    else 'Individual'
                ),
                'test_details': [] if row[2] in ['group_code', 'package_code'] else None
            }
            for row in result1
        ]

        # Prepare a dictionary to keep track of group codes
        group_codes = {row['group_code']: row for row in formatted_results if 'group_code' in row}
        
        package_codes = {row['package_code']: row for row in formatted_results if 'package_code' in row}
        
        if group_codes:

            for group_code, group in group_codes.items():
                # Query to get tests for each group
                query2 = """
                    SELECT td.test_name, td.Test_Code
                    FROM GroupMasterTestList gmtl
                    JOIN Test_Descriptions td ON gmtl.Test_Code = td.Test_Code
                    WHERE gmtl.group_code = %s
                """
                cursor.execute(query2, (group_code,))
                result2 = cursor.fetchall()
    
                # Add test details to the group
                group['test_details'] = [
                    {'test_name': row[0], 'test_code': row[1]}
                    for row in result2
                ]
    
        return JsonResponse(formatted_results, safe=False)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        # cursor.close()
        db.close()
        
        
def alltestforlocal(request):
    try:
        token_id = request.headers.get('tokenid')
        password = request.headers.get('password')
        print('tokenid', token_id)
        print('password', password)

        if not token_id or not password:
            return JsonResponse({'error': 'Token-ID and Password required'}, status=400)

        if authenticate_request(token_id, password):
            # db = get_db_connection()
            cursor = db.cursor()
            # Query to get all test names, group names, and package names with their codes
            query1 = """
                SELECT test_name AS name, Test_Code AS code, 'Test_Code' AS code_type
                FROM Test_Descriptions
                UNION ALL
                SELECT group_name AS name, group_code AS code, 'group_code' AS code_type
                FROM GroupMaster
                UNION ALL 
                SELECT package_name AS name, package_code AS code, 'package_code' AS code_type
                FROM OfferPackage
            """ 
            cursor.execute(query1)
            result1 = cursor.fetchall()

            # Format the results
            formatted_results = [
                {
                    'name': row[0], 
                    'Test_Code': row[1],  # Always use 'Test_Code' as the key
                    'testmethod': (
                        'Group' if row[2] == 'group_code' 
                        else 'Offers' if row[2] == 'package_code' 
                        else 'Individual'
                    ),
                    'test_details': [] if row[2] in ['group_code', 'package_code'] else None
                }
                for row in result1
            ]

            # Prepare a dictionary to keep track of group codes
            group_codes = {row['Test_Code']: row for row in formatted_results if row['testmethod'] == 'Group'}
            package_codes = {row['Test_Code']: row for row in formatted_results if row['testmethod'] == 'Offers'}

            if group_codes:
                for group_code, group in group_codes.items():
                    # Query to get tests for each group
                    query2 = """
                        SELECT td.test_name, td.Test_Code
                        FROM GroupMasterTestList gmtl
                        JOIN Test_Descriptions td ON gmtl.Test_Code = td.Test_Code
                        WHERE gmtl.group_code = %s
                    """
                    cursor.execute(query2, (group_code,))
                    result2 = cursor.fetchall()

                    # Add test details to the group
                    group['test_details'] = [
                        {'test_name': row[0], 'Test_Code': row[1]}
                        for row in result2
                    ]

        return JsonResponse(formatted_results, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        # Ensure cursor and db are closed only if they were assigned
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if 'db' in locals() and db is not None:
            db.close()

        
        
def test_and_group_forpackage_forlocal(request):
    try:
        
        # db = get_db_connection()
        cursor = db.cursor()
            # First query: Get all test names and group names with their codes
        query1 = """
            SELECT test_name AS name, Test_Code AS code, 'Test_Code' AS code_type
            FROM Test_Descriptions
            UNION ALL
            SELECT group_name AS name, group_code AS code, 'group_code' AS code_type
            FROM GroupMaster
            """ 
            
        cursor.execute(query1)
        result1 = cursor.fetchall()
            
        formatted_results = [
                {
                    'name': row[0], 
                    row[2]: row[1],
                    'testmethod': 'Group' if row[2] == 'group_code' else 'Individual',
                    'test_details': [] if row[2] == 'group_code' else None
                }
                for row in result1
            ]
            
            # Prepare a dictionary to keep track of group codes
        group_codes = {row['group_code']: row for row in formatted_results if 'group_code' in row}
            
        for group_code, group in group_codes.items():
            query2 = """
                SELECT td.test_name, td.Test_Code
                FROM GroupMasterTestList gmtl
                JOIN Test_Descriptions td ON gmtl.Test_Code = td.Test_Code
                WHERE gmtl.group_code = %s
                """
            cursor.execute(query2, (group_code,))
            result2 = cursor.fetchall()
                
                # Add test details to the group
            group['test_details'] = [
                    {'test_name': row[0], 'test_code': row[1]}
                    for row in result2
                ]
            
        return JsonResponse(formatted_results, safe=False)
      
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        cursor.close()
        db.close()
        
        
        


@csrf_exempt
def update_packagestatus(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()        
        package_code = request.GET.get('package_code')
        newstatus = request.GET.get('newstatus')
        
        update_query = """UPDATE OfferPackage SET Status=%s, UpdatedAt = %s WHERE package_code=%s"""
        cursor.execute(update_query,(newstatus, datetime.now(), package_code))
        
        db.commit()
        
        return JsonResponse({'message': 'Successfully Updated'})
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        cursor.close()
        db.close()
        
def get_packagedata_forupdate(request):
    try:
        cursor = db.cursor()
        package_code = request.GET.get('package_code')

        if not package_code:
            return JsonResponse({'error': 'package_code is required'}, status=400)

        # Get main package data
        cursor.execute("SELECT * FROM OfferPackage WHERE package_code=%s", (package_code,))
        data = cursor.fetchall()
        columns = [i[0] for i in cursor.description]
        package_details = []

        for row in data:
            package_detail = dict(zip(columns, row))

            # Get associated test list
            cursor.execute("SELECT * FROM OfferPackageList WHERE package_code=%s", (row[1],))
            tests = cursor.fetchall()
            test_columns = [i[0] for i in cursor.description]
            test_list = []

            for test in tests:
                test_detail = dict(zip(test_columns, test))
                test_method = test_detail.get("Test_Method")

                if test_method == "Group":
                    # Optimized join to get group test details with DisplayText
                    cursor.execute("""
                        SELECT t.Test_Code_id, d.DisplayText
                        FROM Group_Master_TestList t
                        JOIN Test_Descriptions d ON t.Test_Code_id = d.Test_Code
                        WHERE t.Group_Code_id = %s
                    """, (test_detail["Group_Code_id"],))
                    group_tests = cursor.fetchall()

                    group_test_list = [{
                        "test_code": gt[0],
                        "test_name": gt[1]
                    } for gt in group_tests]

                    test_detail["test_details"] = group_test_list
                else:
                    test_detail["test_details"] = None

                test_list.append(test_detail)

            package_detail["tests"] = test_list
            package_details.append(package_detail)

        return JsonResponse(package_details, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        cursor.close()
        db.close()




def get_all_package_name(request):
    if request.method == "GET":
        db = None
        cursor = None
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            # SQL query to fetch all Test_Name entries
            get_name_query = "SELECT package_name, package_code FROM OfferPackage WHERE Status = 'Active' "
            cursor.execute(get_name_query)
            group_test_names = cursor.fetchall()  # Fetch all rows of the results

            # Use a list comprehension to extract test names directly
            group_test_name_list = [{'package_name': row[0], 'package_code': row[1] }for row in group_test_names]

            # Check if the test_name_list is not empty
            print('group_test_name_list', group_test_name_list)
            if group_test_name_list:
                return JsonResponse(group_test_name_list, safe=False)
            else:
                return JsonResponse({"error": "No tests found."} )
        except Exception as e:
            # Log or print the exception message here if needed
            return JsonResponse({"error": str(e)})
        finally:
            # Close the cursor and db connection if they were successfully created
            if cursor:
                cursor.close()
            if db:
                db.close()
    else:
        return JsonResponse({"error": "Invalid request method."},status=400)
    




def getcostperoffer(request):
    try:

        # db = get_db_connection()
        cursor = db.cursor()
        ratecard = request.GET.get('ratecard')
        Test_Code = request.GET.get('Test_Code')
        print('Test_Code :',Test_Code)
            # Constructing the column name dynamically
        column_name = f"{ratecard}"
            
        get_details_query = f"""
    SELECT t.package_code, tc.Test_Name, tc.{column_name}
    FROM OfferPackage t
    INNER JOIN Testmaster_Cost_List tc ON t.package_code = tc.Test_Code 
    WHERE t.package_code = '{Test_Code}' AND tc.{column_name} IS NOT NULL
"""


        cursor.execute(get_details_query)
        result = cursor.fetchone()

        if result:
                group_data = {
                    'test_code': result[0],
                    'test_name': result[1],
                    'cost_per_reportable': result[2],
                    'testmethod' : 'Offers'
                }
                return JsonResponse(group_data)
        else:
                return JsonResponse({'error': 'Group not found'}, status=404)


    except Exception as e:
        return JsonResponse({"Error": e})
    finally:
        cursor.close()
        db.close()


def getratecardforallfranchise(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()        
        
        query = """SELECT * FROM Testmaster_Cost_List"""
        cursor.execute(query)
        data = cursor.fetchall()
        
        columns = [i[0] for i in cursor.description]
        
        result = [dict(zip(columns,j)) for j in data]
        return JsonResponse(result,safe=False)
        
        
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        cursor.close()
        db.close()
        
        
@csrf_exempt
def postratecrdcsvfile(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Get the uploaded file
        file = request.FILES.get('file')
        print('file :', file)
        
        # Check if the file is in CSV or Excel format
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return JsonResponse({
                'error': 'Unsupported file format. Please upload a CSV or Excel file'
            }, status=400)

        # Convert DataFrame to a list of dictionaries
        csv_data = df.to_dict(orient='records')

        # Process the data for missing values
        for row in csv_data:
            for key in row:
                if pd.isna(row[key]):
                    if isinstance(row[key], str):
                        row[key] = 'None'
                    elif isinstance(row[key], (int, float)):
                        row[key] = None

        # Iterate through the processed data
        for row in csv_data:
            test_code = row.get('Test_Code')
            test_name = row.get('Test_Name')

            # Iterate over columns except 'Test_Code' and 'Test_Name'
            for column in df.columns:
                if column not in ['Test_Code', 'Test_Name']:
                    amount = row[column]

                    # SQL to update the database for each franchise column
                    update_query = f"""
                        UPDATE Testmaster_Cost_List 
                        SET {column} = %s
                        WHERE Test_Code = %s 
                    """
                    cursor.execute(update_query, (amount, test_code))

        # Commit the transaction
        db.commit()

        return JsonResponse({'message': 'CSV/Excel data updated successfully'}, status=200)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        cursor.close()
        db.close()

        
def get_lab_code(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()        
        # Fetch the maximum Labcode from the database
        query = """SELECT MAX(Labcode) FROM External_Lab_Details"""
        cursor.execute(query)
        maxid = cursor.fetchone()[0]  # Get the maxid value from the tuple
        
        if not maxid:
            next_id = 'LAB0001'
        else:
            # Strip the 'LAB' prefix and convert the remaining part to an integer
            prefix = 'LAB'
            numeric_part = maxid[len(prefix):]  # Get the numeric part after 'LAB'
            current_number = int(numeric_part)
            next_number = current_number + 1
            
            # Format the next number with leading zeros to ensure it has 4 digits
            next_id = f'{prefix}{next_number:04}'
        
        return JsonResponse({'next_id': next_id}, safe=False)
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        cursor.close()
        db.close()
        
        
def get_department_and_their_tests(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Fetch department data using LEFT JOIN, ordered by OrderID (ascending) and then by sub_department_name for those without OrderID
        cursor.execute(
            """
            SELECT s.sub_department_id, s.main_department_name, s.sub_department_name, d.OrderID , s.Status,s.sub_department_code
            FROM SubMaindepartment s
            LEFT JOIN DepartmentOrderMaster d
                ON s.sub_department_code = d.Sub_Department_Code
            ORDER BY 
                CASE WHEN d.OrderID IS NOT NULL THEN 0 ELSE 1 END,  
                CAST(d.OrderID AS UNSIGNED) ASC,  
                s.sub_department_name ASC  
        """
        )

        sub_departments = cursor.fetchall()

        print("sub_departments :", sub_departments)
        data = []

        newsn = 1
        # Iterate over each sub-department and fetch their tests
        for sub_department in sub_departments:
            (
                sub_department_id,
                main_department_name,
                sub_department_name,
                OrderID,
                Status,
                sub_department_code,
            ) = sub_department

            # Fetch associated tests for the current sub-department
            cursor.execute(
                """
                    SELECT Test_Id, Test_Name, Test_Code, Department, Sub_Department, Header, Display_Text, Billing_Name, 
                  Container_Name, Specimen_Name, Method_Name, Gender, Input_Type, Decimal_Palces, Input_Pattern_Type, 
                  Test_Category, Logical_Category, Captured_Unit, UOM, Report_Type, Test_Instructions, Loinc_Code, 
                  Allow_Discount, Oderable, Show_Graph, Active_Status, STAT, Non_Reportable, Calculated_Test, Outsourced, 
                  Processing_Time, Emergency_Processing_Time, Period_Type, Formula, Parameter_One, Parameter_Two, Autocheck, 
                  Culturetest, Is_NABHL, Is_CAP, Is_Machine_Interfaced, Machine_Name, Reagent_Level, Assay_Code, Status,IsSubTest,SubTestCodes
                    FROM Test_Descriptions
                    WHERE Sub_Department = %s
                """,
                [sub_department_name],
            )
            tests = cursor.fetchall()

            test_count = len(tests)

            # Prepare tests data for this sub-department
            test_data = [
                {
                    "id": idx + 1,  # Auto-increment SNo starting from 1
                    "Test_Id": row[0],
                    "Test_Name": row[1],
                    "Test_Code": row[2],
                    "Department": row[3],
                    "Sub_Department": row[4],
                    "Header": row[5],
                    "Display_Text": row[6],
                    "Billing_Name": row[7],
                    "Container_Name": row[8],
                    "Specimen_Name": row[9],
                    "Method_Name": row[10],
                    "Gender": row[11],
                    "Input_Type": row[12],
                    "Decimal_Places": row[13],
                    "Input_Pattern_Type": row[14],
                    "Test_Category": row[15],
                    "Logical_Category": row[16],
                    "Captured_Unit": row[17],
                    "UOM": row[18],
                    "Report_Type": row[19],
                    "Test_Instructions": row[20],
                    "Loinc_Code": row[21],
                    "Allow_Discount": row[22],
                    "Orderable": row[23],
                    "Show_Graph": row[24],
                    "Active_Status": row[25],
                    "STAT": row[26],
                    "Non_Reportable": row[27],
                    "Calculated_Test": row[28],
                    "Outsourced": row[29],
                    "Processing_Time": row[30],
                    "Emergency_Processing_Time": row[31],
                    "Period_Type": row[32],
                    "Formula": row[33],
                    "Parameter_One": row[34],
                    "Parameter_Two": row[35],
                    "Autocheck": row[36],
                    "Culturetest": row[37],
                    "Is_NABHL": row[38],
                    "Is_CAP": row[39],
                    "Is_Machine_Interfaced": row[40],
                    "Machine_Name": row[41],
                    "Reagent_Level": row[42],
                    "Assay_Code": row[43],
                    "Status": row[44],
                    "IsSubTest": row[45],
                    "SubTestCodes": row[46],
                }
                for idx, row in enumerate(tests)
            ]

            # Append the sub-department and its tests to the final data structure
            data.append(
                {
                    "sub_department_name": sub_department_name,
                    "main_department_name": main_department_name,
                    "tests": test_data,
                    "Testcount": test_count,
                    "sub_department_id": sub_department_id,
                    "DepartmentOrderID": OrderID,
                    "id": newsn,
                    "Status": Status,
                    "sub_department_code": sub_department_code,
                }
            )

            newsn += 1
        # Return the data in JSON format
        return JsonResponse({"data": data}, status=200)

    except Exception as e:
        print("error", str(e))
        return JsonResponse({"error": str(e)}, status=500)
        
        
@csrf_exempt
def update_testStatus(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        Test_Code = request.GET.get("Test_Code")
        newstatus = request.GET.get("newstatus")

        query = """UPDATE Test_Descriptions SET Status=%s WHERE Test_Code=%s"""
        cursor.execute(query, (newstatus, Test_Code))

        db.commit()

        return JsonResponse({"Message": f"{newstatus} Successfully"}, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)})
    finally:
        cursor.close()
        db.close()

@csrf_exempt
def update_subdepartmentStatus(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        subdepartment_code = request.GET.get("subdepartment_code")
        newstatus = request.GET.get("newstatus")

        updatequery = """UPDATE SubMaindepartment SET Status = %s WHERE sub_department_code = %s"""
        cursor.execute(updatequery, (newstatus, subdepartment_code))

        db.commit()

        return JsonResponse({"Message": f"{newstatus} Successfully"}, safe=False)

    except Exception as e:
        return JsonResponse({"Error": str(e)})
    finally:
        cursor.close()
        db.close()
        
        
        
def getdepartmentorder(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        query = """SELECT * FROM DepartmentOrderMaster"""
        cursor.execute(query)
        data = cursor.fetchall()
        result = []
        for i in data:
            data_dict = {
                "id": i[0],
                "DepartmentOrderID": i[3],
                "subdepartment_name": i[1],
                "subdepartment_code": i[2],
            }
            result.append(data_dict)

        return JsonResponse(result, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": "An internal server error occurred"}, status=500)
    finally:
        cursor.close()
        db.close()
        
@csrf_exempt
def InsertDepartmentOrder(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            department_orders = data.get("departmentOrders", [])

            # Connect to the database
            # db = get_db_connection()
            cursor = db.cursor()
            delete_all_query = "DELETE FROM DepartmentOrderMaster"
            cursor.execute(delete_all_query)
            # Prepare the SQL queries
            select_max_id_query = "SELECT MAX(S_No) AS maxId FROM DepartmentOrderMaster"

            insert_query = """
                INSERT INTO DepartmentOrderMaster
                (S_No, Sub_Department_Name, Sub_Department_Code, OrderID)
                VALUES (%s, %s, %s, %s)
            """

            for order in department_orders:
                cursor.execute(select_max_id_query)
                max_id = cursor.fetchone()[0]
                next_id = max_id + 1 if max_id is not None else 1

                # Insert the new record
                cursor.execute(
                    insert_query,
                    (
                        next_id,
                        order["subdepartment_name"],
                        order["subdepartment_code"],
                        order["DepartmentOrderID"],
                    ),
                )

            # Commit the transaction
            db.commit()

            return JsonResponse({"success": "Data inserted successfully"}, status=200)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse(
                {"error": "An internal server error occurred"}, status=500
            )

        finally:
            cursor.close()
            db.close()



# @csrf_exempt
# def get_doctor_forlab(request):
#     if request.method == 'GET':
#         try:
#             doctor_id = request.GET.get('doctor_id')
            

#             # Get all Doctor_ProfessForm_Detials linked to the Lab department
#             doctor_details = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id)
#             doctor_qual = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doctor_id)
#             doctor_doc = Doctor_DocumentsForm_Detials.objects.get(Doctor_ID=doctor_id)

#             # Filter associated Doctor_Personal_Form_Detials, excluding 'Referral'
            
            
#             def get_file_image(filedata):
#                     kind = filetype.guess(filedata)
                
#                     # Default to PDF if the type is undetermined
#                     contenttype1 = 'application/pdf'
#                     if kind and kind.mime == 'image/jpeg':
#                         contenttype1 = 'image/jpeg'
#                     elif kind and kind.mime == 'image/png':
#                         contenttype1 = 'image/png'

#                     # Return base64 encoded data with MIME type
#                     return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                
#             doctor_dict = {
#                 'id': doctor_details.Doctor_ID,
#                 'Name': f'{doctor_details.Tittle.Title_Name}.{doctor_details.First_Name} {doctor_details.Middle_Name} {doctor_details.Last_Name}',
#                 'ShortName': f'{doctor_details.Tittle.Title_Name}.{doctor_details.ShortName}',
#                 'Designation': doctor_qual.Designation.Designation_Name if doctor_qual.Designation else '',
#                 'Qualification': doctor_qual.Qualification,
#                 'State_RegistrationNumber': doctor_qual.State_RegistrationNumber,
#                 'sign': get_file_image(doctor_doc.Signature),
#             }
                

#             return JsonResponse(doctor_dict, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)

# @csrf_exempt
# def get_doctor_forlab(request):
#     if request.method == 'GET':
#         try:
#             doctor_id = request.GET.get('doctor_id')
#             Tech = request.GET.get('tech')
#             srtech = request.GET.get('sr_tech')
           
#             # Get all Doctor_ProfessForm_Detials linked to the Lab department
#             doctor_details = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor_id)
#             doctor_qual = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doctor_id)
#             doctor_doc = Doctor_DocumentsForm_Detials.objects.get(Doctor_ID=doctor_id)
#             print(Tech,srtech)
#             tech = None
#             sr_tech = None
#             # Filter associated Doctor_Personal_Form_Detials, excluding 'Referral'
#             if Tech and (any(i.isdigit() for i in Tech)):
#                 tech = Employee_Personal_Form_Detials.objects.get(Employee_ID = Tech)
#                 print(tech)
#             if srtech and (any(i.isdigit() for i in srtech)):
#                 sr_tech = Employee_Personal_Form_Detials.objects.get(Employee_ID = srtech)
#                 print(sr_tech)
           
           
#             def get_file_image(filedata):
#                     kind = filetype.guess(filedata)
               
#                     # Default to PDF if the type is undetermined
#                     contenttype1 = 'application/pdf'
#                     if kind and kind.mime == 'image/jpeg':
#                         contenttype1 = 'image/jpeg'
#                     elif kind and kind.mime == 'image/png':
#                         contenttype1 = 'image/png'
 
#                     # Return base64 encoded data with MIME type
#                     return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
               
#             doctor_dict = {
#                 'id': doctor_details.Doctor_ID,
#                 'Name': f'{doctor_details.Tittle.Title_Name}.{doctor_details.First_Name} {doctor_details.Middle_Name} {doctor_details.Last_Name}',
#                 'ShortName': f'{doctor_details.Tittle.Title_Name}.{doctor_details.ShortName}',
#                 'Designation': doctor_qual.Designation.Designation_Name if doctor_qual.Designation else '',
#                 'Qualification': doctor_qual.Qualification,
#                 'State_RegistrationNumber': doctor_qual.State_RegistrationNumber,
#                 'sign': get_file_image(doctor_doc.Signature),
#                 'tech_name': tech.First_Name if tech and tech.First_Name else None,
#                 'sr_tech_name': sr_tech.First_Name if sr_tech and sr_tech.First_Name else None,
#                 'tech_sign': get_file_image(tech.Signature) if tech and tech.Signature else None,
#                 'sr_tech_sign': get_file_image(sr_tech.Signature) if sr_tech and sr_tech.Signature else None,
#             }
               
 
#             return JsonResponse(doctor_dict, safe=False)
 
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def get_doctor_forlab(request):
    if request.method == 'GET':
        try:
            def get_file_image(filedata):
                kind = filetype.guess(filedata)
            
                # Default to PDF if the type is undetermined
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
               

            doctor_id = request.GET.get('doctor_id')
            Tech = request.GET.get('tech')
            srtech = request.GET.get('sr_tech')
            
            id = []
            name =[]
            shortname = []
            designation = []
            qualification = []
            stateregister = []
            sign =[]
            if doctor_id and doctor_id != "":
                print(doctor_id)
                doctor_list = doctor_id.split("//")
                for doc in doctor_list:

                    doctor_details = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doc)
                    doctor_qual = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doc)
                    doctor_doc = Doctor_DocumentsForm_Detials.objects.get(Doctor_ID=doc)

                    id.append(doctor_details.Doctor_ID)
                    name.append(f'{doctor_details.Tittle.Title_Name}.{doctor_details.First_Name} {doctor_details.Middle_Name} {doctor_details.Last_Name}')
                    shortname.append(f'{doctor_details.Tittle.Title_Name}.{doctor_details.ShortName}')
                    designation.append( doctor_qual.Designation.Designation_Name if doctor_qual.Designation else '')
                    qualification.append(doctor_qual.Qualification)
                    stateregister.append(doctor_qual.State_RegistrationNumber)
                    sign.append(get_file_image(doctor_doc.Signature))


            print(Tech,srtech)
            tech = None
            sr_tech = None
            if Tech and Tech != "":
                if any(i.isdigit() for i in Tech):
                    tech = Employee_Personal_Form_Detials.objects.filter(Employee_ID=Tech).first()
                    print(Tech,'Tech')
                else:
                    print(Tech,'1Tech')
                    reg_user = UserRegister_Master_Details.objects.filter(plain_text_password=Tech).first()
                    print("tech---------",reg_user)
                    if reg_user:
                        tech = Employee_Personal_Form_Detials.objects.filter(Employee_ID=reg_user.Employee_Id.Employee_ID).first()

            if srtech and srtech != "":
                if any(i.isdigit() for i in srtech):
                    sr_tech = Employee_Personal_Form_Detials.objects.filter(Employee_ID=srtech).first()
                else:
                    reg_user = UserRegister_Master_Details.objects.filter(plain_text_password=srtech).first()
                    # print("SRtech---------",reg_user.Employee_Id.Employee_ID)
                    if reg_user:
                        sr_tech = Employee_Personal_Form_Detials.objects.filter(Employee_ID=reg_user.Employee_Id.Employee_ID).first()

            doctor_dict = {
                'id': id,
                'Name': name,
                'ShortName': shortname,
                'Designation': designation,
                'Qualification': qualification,
                'State_RegistrationNumber': stateregister,
                'sign': sign,
                'tech_name': tech.First_Name if tech and tech.First_Name else None,
                'sr_tech_name': sr_tech.First_Name if sr_tech and sr_tech.First_Name else None,
                'tech_sign': get_file_image(tech.Signature) if tech and tech.Signature else None,
                'sr_tech_sign': get_file_image(sr_tech.Signature) if sr_tech and sr_tech.Signature else None,
            }
            
            return JsonResponse(doctor_dict, safe=False)
    
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def get_labtech_forlab(request):
    if request.method == 'GET':
        try:
            employee_id = request.GET.get('employeeid')

            try:
                lab_employee = Employee_Personal_Form_Detials.objects.get(Employee_ID=employee_id)
            except Employee_Personal_Form_Detials.DoesNotExist:
                return JsonResponse({'error': 'Employee Id Not Found'}, status=404)
            
            first_name = lab_employee.First_Name or ''
            middle_name = lab_employee.Middle_Name or ''
            last_name = lab_employee.Last_Name or ''
            full_name = f"{first_name} {middle_name} {last_name}".strip()

            labtech_data = {
                'Name': full_name
            }
            return JsonResponse(labtech_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

#-------------word file upload for editing ------------
import io
import mammoth
@csrf_exempt
def uploaddocumentlink(request):
    if request.method == 'POST':
        try:
            document = request.FILES.get('document')
            testname = request.POST.get('testname')
            testcode = request.POST.get('testcode')

            if not document:
                return JsonResponse({'error': 'No file provided'}, status=400)

            if not testname or not testcode:
                return JsonResponse({'error': 'Test name and test code are required'}, status=400)

            # Extract file name and extension
            file_name = document.name
            file_extension = file_name.split('.')[-1].lower()

            # Default HTML content
            html_content = '<p>Document uploaded, no HTML content extracted.</p>'

            # Convert DOCX/DOC to HTML if applicable
            if file_extension in ['docx', 'doc']:
                try:
                    # Read file content and wrap in BytesIO
                    file_content = document.read()
                    file_like_object = io.BytesIO(file_content)
                    result = mammoth.convert_to_html(file_like_object)
                    html_content = result.value or html_content
                except Exception as e:
                    html_content = f"<p>Error reading DOCX file: {str(e)}</p>"

            # Encode HTML content as base64
            encoded_html = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')

            # Create document record
            document_record = Histodocupload(
                TestName=testname,
                Testcode=testcode,
                html_content=encoded_html,
                file_name=file_name  # Store file name if your model supports it
            )
            document_record.save()

            print(f"Uploaded document ID {document_record.id}, HTML length: {len(encoded_html)}")
            return JsonResponse({
                'success': 'Document uploaded successfully',
                'id': document_record.id,
                'fileName': file_name,
            })

        except Exception as e:
            print(f"Upload Error: {str(e)}")
            return JsonResponse({'error': f'Error uploading document: {str(e)}'}, status=400)
   


    return JsonResponse({'error': 'Invalid request method'}, status=405)



def getdocview(request):
        try:
            documents = Histodocupload.objects.all()
            # Manually construct response data
            data = [
                {
                    'id': doc.id,
                    'testname': doc.TestName,
                    'testcode': doc.Testcode,
                    'html_content': doc.html_content,
                    
                }
                for doc in documents
            ]
            return JsonResponse({'tests': data})
        except Exception as e:
            return JsonResponse(
                {'error': f'An error occurred: {str(e)}'},
                
            )

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def Documents_Edit_link(request):
    if request.method == 'GET':
        try:
            # Retrieve the document by ID
            document_id = request.GET.get('documentId')
            document_record = get_object_or_404(Histodocupload, id=document_id)

            # The HTML content is already base64-encoded in the database
            # Return it directly along with fileName
            response_data = {
                'html': document_record.html_content,  # Already base64-encoded
                'fileName': document_record.file_name or 'Untitled Document'
            }

            return JsonResponse(response_data)

        except Exception as e:
            print(f"View Error: {str(e)}")
            return JsonResponse({'error': f'Error retrieving document: {str(e)}'}, status=400)

    elif request.method == 'POST':
        try:
            # Retrieve the document by ID from query parameter
            document_id = request.GET.get('documentId')
            print('documentId',document_id)
            document_record = get_object_or_404(Histodocupload, id=document_id)

            # Parse the JSON body
            try:
                data = json.loads(request.body)
                html_content = data.get('html')
                print('html',html_content)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)

            if not html_content:
                return JsonResponse({'error': 'HTML content is required'}, status=400)

            # Encode the HTML content as base64 to match storage format
            encoded_html = base64.b64encode(html_content.encode('utf-8')).decode('utf-8')

            # Update the document record
            document_record.html_content = encoded_html
            document_record.save()

            print(f"Updated document ID {document_record.id}, HTML length: {len(encoded_html)}")
            return JsonResponse({
                'success': 'Document updated successfully',
                'id': document_record.id,
                'fileName': document_record.TestName or 'Untitled Document'
            })

        except Exception as e:
            print(f"Update Error: {str(e)}")
            return JsonResponse({'error': f'Error updating document: {str(e)}'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def getbytestcodedoc(request):
    if request.method == 'GET':
        try:
            # Retrieve the document by ID
            testcode = request.GET.get('testcode')
            document_record = get_object_or_404(Histodocupload, Testcode=testcode)

            # The HTML content is already base64-encoded in the database
            # Return it directly along with fileName
            response_data = {
                'html': document_record.html_content,  # Already base64-encoded
                'fileName': document_record.file_name or 'Untitled Document'
            }

            return JsonResponse(response_data)

        except Exception as e:
            print(f"View Error: {str(e)}")
            return JsonResponse({'error': f'Error retrieving document: {str(e)}'}, status=400)

