from django.http import JsonResponse
from django.db import connection as db
from django.views.decorators.csrf import csrf_exempt
# from backend.db_connect import get_db_connection, get_db_cursor
import json



# def table_exists(cursor, table_name):
#     cursor.execute("SHOW TABLES LIKE %s", (table_name, ))
#     return cursor.fetchone() is not None


# def create_table_if_not_exists(table_name, column_definitions):
#     # db = get_db_connection()
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
#     "UserControl_Role", """role_id INT  PRIMARY KEY,
#                         Department VARCHAR(50),
#                         role_name VARCHAR(50),
#                         Status VARCHAR(10),
#                         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")

# create_table_if_not_exists(
#     "UserControl_Department", """Dept_id INT  PRIMARY KEY,
#                         Department_name VARCHAR(255),
#                         Status VARCHAR(10),
#                         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")

# create_table_if_not_exists(
#     "UserControl_location", """location_id INT PRIMARY KEY,
#                         location_name VARCHAR(255),
#                         Status VARCHAR(10),
#                         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")

# create_table_if_not_exists(
#     "UserControl_Sublocation", """location_id INT PRIMARY KEY,
#                         location_name VARCHAR(255),
#                         Sublocation_name VARCHAR(255),
#                         Status VARCHAR(10),
#                         UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
#                         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP""")

# ------------------------------get role data----------------------------------------------


def get_role_data(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        # Select role data from the database
        query = "SELECT * FROM UserControl_Role"
        cursor.execute(query)
        result = cursor.fetchall()

        # Convert the result into a list of dictionaries
        role_data = []
        for row in result:
            role_dict = {
                'role_id': row[0],
                'Department': row[1],
                'role_name': row[2],
                'status': row[3]
            }
            role_data.append(role_dict)

        return JsonResponse(role_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


# ------------------------------employee register get role by department -----------------------------------------------------------


def get_roles_by_department(request):
    try:
        if 'department' in request.GET:  # Check if 'department' parameter is present in the request
            department = request.GET[
                'department']  # Get the value of 'department' parameter
        else:
            return JsonResponse({'error': 'Department parameter is missing'},
                                status=400)

        # Manually open the database connection
        db_connection = connection.cursor()

        # SQL query to get all role names for a specific department
        roles_query = "SELECT role_name FROM UserControl_Role WHERE Department = %s"
        db_connection.execute(roles_query, (department, ))
        roles = db_connection.fetchall()

        # Extract role names from the result
        role_names = [role[0] for role in roles]

        response_data = {'department': department, 'roles': role_names}

        # Manually close the database connection
        db_connection.close()

        return JsonResponse(response_data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


#----------------------------------------insert role data---------------------------------------------------------
@csrf_exempt
def insert_role(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        if request.method == 'POST':
            department = request.POST.get('department')
            role_name = request.POST.get('roleName')
            status = 'Active'

            # SQL query to check if the role_name already exists
            check_query = "SELECT COUNT(*) FROM UserControl_Role WHERE role_name = %s and Department=%s"
            cursor.execute(check_query, (role_name, department))
            existing_count = cursor.fetchone()[
                0]  # Count of existing roles with the same name


            if existing_count > 0:
                # Role with the same name already exists, return an error message
                response_data = {
                    'error': 'Role with the same name already exists'
                }
            else:
                # Role doesn't exist, proceed to insert
                # SQL query to fetch the highest existing role_id
                next_id = 1
                max_id_query = "SELECT MAX(role_id) AS maxId FROM UserControl_Role"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]

                next_id = max_id + 1 if max_id is not None else 1

                # SQL query to insert a new record with placeholders
                insert_query = "INSERT INTO UserControl_Role (role_id, Department, role_name, Status) VALUES (%s, %s, %s, %s)"  # Corrected query
                cursor.execute(insert_query,
                               (next_id, department, role_name, status))
                db.commit()

                response_data = {'message': 'Role inserted successfully'}

            return JsonResponse(response_data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error':
                             'An internal server error occurred'}), 500
    finally:
        cursor.close()
        db.close()


#-----------------------------------status update for role-----------------------------------------------------------

from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def update_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Assuming data is sent via POST request

            role_id = data.get('role_id')
            status = data.get('status')

            # Manually open the database connection
            db_connection = connection.cursor()

            update_query = """
                UPDATE UserControl_Role 
                SET Status = %s
                WHERE role_id = %s
            """
            db_connection.execute(update_query, (status, role_id))

            # Manually commit the transaction
            db_connection.connection.commit()

            # Manually close the database connection
            db_connection.close()

            return JsonResponse({'message': 'Data Updated Successfully'},
                                status=200)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


#--------------------------------------------Department---------------------------------------------------------------------

from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_department(request):
    if request.method == 'GET':
        try:
            # Manually open the database connection
            db_connection = connection.cursor()

            # Select role data from the database
            query = "SELECT * FROM UserControl_Department"
            db_connection.execute(query)
            result = db_connection.fetchall()

            # Convert the result into a list of dictionaries
            role_data = []
            for row in result:
                dept_dict = {
                    'Dept_id': row[0],
                    'Department_name': row[1],
                    'status': row[2]
                }
                role_data.append(dept_dict)

            # Manually close the database connection
            db_connection.close()

            # Return the role data as JSON
            return JsonResponse(role_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


# -----------------------------------------------------------------------------------------------------------------


@csrf_exempt
def insert_department(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            # Get the department name from the request data
            dept_name = request.POST.get('department')
            status = 'Active'

            # SQL query to check if the department name already exists
            check_query = "SELECT COUNT(*) FROM UserControl_Department WHERE Department_name = %s"
            cursor.execute(check_query, (dept_name, ))
            existing_count = cursor.fetchone()[
                0]  # Count of existing departments with the same name

            if existing_count > 0:
                # Department with the same name already exists, return an error message
                response_data = {
                    'error': 'Department with the same name already exists'
                }
            else:
                # Department doesn't exist, proceed to insert
                # SQL query to fetch the highest existing Dept_id
                next_id = 1
                max_id_query = "SELECT MAX(Dept_id) AS maxId FROM UserControl_Department"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]

                next_id = max_id + 1 if max_id is not None else 1

                # SQL query to insert a new record with placeholders
                insert_query = "INSERT INTO UserControl_Department (Dept_id, Department_name, Status) VALUES (%s, %s, %s)"
                cursor.execute(insert_query, (next_id, dept_name, status))
                db.commit()

                response_data = {
                    'message': 'Department Name inserted successfully'
                }

            return JsonResponse(response_data)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)
        finally:
            cursor.close()
            db.close()

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# -----------------------------------------------------------------------------------------

from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def update_status_for_dept(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)
            dept_id = data.get('dept_id')
            status = data.get('status')
            print('258',dept_id,status)
            # Manually open the database connection
            db_connection = connection.cursor()

            # Update data in the table
            update_query = """
                UPDATE UserControl_Department 
                SET Status = %s
                WHERE Dept_id = %s
            """
            db_connection.execute(update_query, (status, dept_id))

            # Commit the transaction
            db_connection.connection.commit()

            # Manually close the database connection
            db_connection.close()

            # Prepare and return the response
            response_data = {'message': 'Data Updated Successfully'}
            return JsonResponse(response_data)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


# ------------------------------get roles by department-------------------------------------------------------
@csrf_exempt
def get_roles_by_department(request):
    try:
        if 'department' in request.GET:  # Check if 'department' parameter is present in the request
            department = request.GET[
                'department']  # Get the value of 'department' parameter
        else:
            return JsonResponse({'error': 'Department parameter is missing'},
                                status=400)

        with connection.cursor() as cursor:
            # SQL query to get all role names for a specific department
            roles_query = "SELECT role_name FROM UserControl_Role WHERE Department = %s"
            cursor.execute(roles_query, (department, ))
            roles = cursor.fetchall()

            # Extract role names from the result
            role_names = [role[0] for role in roles]

            response_data = {'department': department, 'roles': role_names}

        return JsonResponse(response_data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


# -----------------------------------------------------------------------------------------------------------------
# @csrf_exempt
# def update_department_status(request):
#     if request.method == 'POST':
#         try:
#             # Get department ID and status from the JSON request data
#             data = request.POST
#             dept_id = data.get('dept_id')
#             status = data.get('status')

#             # Establish database connection and cursor
#             with connection.cursor() as cursor:
#                 # SQL query to update department status
#                 update_query = """
#                     UPDATE UserControl_Department
#                     SET Status = %s
#                     WHERE Dept_id = %s
#                 """
#                 cursor.execute(update_query, (status, dept_id))

#             return JsonResponse({'message': 'Data Updated Successfully'}, status=200)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)

#---------------------------------location get------------------------------------------------


def get_location_data(request):
    try:
        # Establish database connection
        # db = get_db_connection()
        cursor = db.cursor()

        # Select location data from the database
        cursor.execute("SELECT * FROM UserControl_location")
        result = cursor.fetchall()

        # Convert the result into a list of dictionaries
        location_data = []
        for row in result:
            location_dict = {
                'location_id': row[0],
                'location_name': row[1].strip(),
                'status': row[2]
            }
            location_data.append(location_dict)

        # Close cursor
        cursor.close()

        # Close connection
        connection.close()

        return JsonResponse(
            location_data,
            safe=False)  # Safe is set to False to allow serializing lists

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


#.....................................................................


def get_location_data_for_login(request):
    try:
        username = request.GET.get('username')
        print(username)

        # Establish database connection and cursor
        with connection.cursor() as cursor:
            if username == 'admin':
                # If admin, set default location to 'all'
                cursor.execute("SELECT * FROM UserControl_location")
                result = cursor.fetchall()
                location_data = [{
                    'location_id': row[0],
                    'location_name': row[1]
                } for row in result]
            else:
                # If not admin, select all locations from employee personal details
                cursor.execute(
                    "SELECT DISTINCT Location FROM usercontrol_staffuserregister WHERE username = %s",
                    [username])
                result_locations = cursor.fetchall()

                # Fetch location data for each location
                location_data = []
                for location_row in result_locations:
                    location_name = location_row[0]
                    # Get location data from user control location table
                    cursor.execute(
                        "SELECT location_id FROM usercontrol_location WHERE location_name = %s",
                        [location_name])
                    result_location = cursor.fetchone()

                    # Append location data to the list of dictionaries
                    if result_location:
                        location_data.append({
                            'location_id': result_location[0],
                            'location_name': location_name
                        })

        return JsonResponse(
            location_data,
            safe=False)  # Safe is set to False to allow serializing lists

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


# ---------------------------------insert location ---------------------------------------------------------------------


@csrf_exempt
def insert_location(request):
    if request.method == 'POST':
        try:
            # Get the location name from the request
            location_name = request.POST.get('locationname')
            status = 'Active'

            # Establish database connection and cursor
            # db = get_db_connection()
            cursor = db.cursor()

            # SQL query to check if the location name already exists
            check_query = "SELECT COUNT(*) FROM UserControl_location WHERE location_name = %s"
            cursor.execute(check_query, [location_name])
            existing_count = cursor.fetchone()[0]

            if existing_count > 0:
                # If location name already exists, return error response
                return JsonResponse(
                    {'error': 'Location with the same name already exists'},
                    status=400)

            # SQL query to fetch the highest existing location_id
            cursor.execute(
                "SELECT MAX(location_id) AS maxId FROM UserControl_location")
            max_id = cursor.fetchone()[0] or 0
            next_id = max_id + 1

            # SQL query to insert a new record with placeholders
            insert_query = "INSERT INTO UserControl_location (location_id, location_name, Status) VALUES (%s, %s, %s)"
            cursor.execute(insert_query, [next_id, location_name, status])

            # Commit the transaction
            db.commit()

            # Close the cursor and database connection
            cursor.close()
            db.close()

            return JsonResponse({'message': 'Location inserted successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ---------------------------------update status location-----------------------------------------------


@csrf_exempt  
def update_location_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            location_id = data.get('location_id')
            status = data.get('status')
            # print('status',status)
            # Establish database connection and cursor
            with connection.cursor() as cursor:
                # Update data in the table
                update_query = """
                    UPDATE UserControl_location 
                    SET Status = %s
                    WHERE location_id = %s
                """
                cursor.execute(update_query, [status, location_id])

            return JsonResponse({'message': 'Data Updated Successfully'},
                                status=200)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ----------------------fetch employee name and id by department -------------------------------------------------------


def get_role_data_by_location(request):
    try:
        location = request.GET.get('location')
        department = request.GET.get('Department')

        print('kkkk',location,department)
        # Establish database connection and cursor
        with connection.cursor() as cursor:
            # Select role data from the database
            query = """
                SELECT epd.EmployeeID, epd.EmployeeName, erm.Department
                FROM employee_personaldetails as epd
                INNER JOIN employee_rollmanagemnt as erm ON epd.EmployeeID = erm.EmployeeID
                WHERE epd.Location = %s AND erm.Department = %s
            """
            cursor.execute(query, [location, department])
            result = cursor.fetchall()

        # Convert the result into a list of dictionaries
        role_data = []
        for row in result:
            role_dict = {
                'EmployeeID': row[0],
                'EmployeeName': row[1],
                'Department': row[2],
            }
            role_data.append(role_dict)

        return JsonResponse(
            role_data, safe=False
        )  # Set safe=False to allow non-dict objects to be serialized

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


#...........................................................................


def getlocationdataforlogin(request):
    try:
        # db = get_db_connection()
        cursor = db.cursor()
        
        username = request.GET.get('username')

        print('username :', username)
        if username == 'admin':
            # If admin, set default location to 'all'
            query = "SELECT * FROM UserControl_location"
            cursor.execute(query)
            result = cursor.fetchall()
            location_data = [{'location_id': row[0], 'location_name': row[1]} for row in result]
        else:
            # If not admin, select all locations from usercontrol_staffuserregister
            query = "SELECT Location FROM usercontrol_staffuserregister WHERE username = %s"
            cursor.execute(query, (username,))
            result_locations = cursor.fetchone()
            
            if result_locations:
                locations_str = result_locations[0]
                location_names = locations_str.split(',')

                # Fetch location data for each location
                location_data = []
                for location_name in location_names:
                    # Get location data from usercontrol_location table
                    query_location = "SELECT location_id, location_name FROM UserControl_location WHERE location_name = %s"
                    cursor.execute(query_location, (location_name,))
                    result_location = cursor.fetchone()
                    # Append location data to the list of dictionaries
                    if result_location:
                        location_data.append({
                            'location_id': result_location[0],
                            'location_name': result_location[1]
                        })
            else:
                location_data = []

        cursor.close()

        return JsonResponse(location_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



#...................................................................................................


@csrf_exempt
def insertpharmacy(request):
    if request.method == 'POST':
        try:
            # db = get_db_connection()
            cursor = db.cursor()

            # Get the department name from the request data
            location = request.POST.get('location')
            pharmacyname = request.POST.get('pharmacy')
            status = 'Active'

            # SQL query to check if the department name already exists
            check_query = "SELECT COUNT(*) FROM usercontrol_sublocation WHERE location_name = %s AND Sublocation_name=%s"
            cursor.execute(check_query, (location, pharmacyname))
            existing_count = cursor.fetchone()[
                0]  # Count of existing departments with the same name

            if existing_count > 0:
                response_data = {
                    'error': 'Department with the same name already exists'
                }
            else:
                # Department doesn't exist, proceed to insert
                # SQL query to fetch the highest existing Dept_id
                next_id = 1
                max_id_query = "SELECT MAX(location_id) AS maxId FROM usercontrol_sublocation"
                cursor.execute(max_id_query)
                max_id = cursor.fetchone()[0]

                next_id = max_id + 1 if max_id is not None else 1

                # SQL query to insert a new record with placeholders
                insert_query = "INSERT INTO usercontrol_sublocation (location_id, location_name,Sublocation_name,Status) VALUES (%s, %s, %s, %s)"
                cursor.execute(insert_query,
                               (next_id, location, pharmacyname, status))
                db.commit()

                response_data = {
                    'message': 'Pharmachy Name inserted successfully'
                }

            return JsonResponse(response_data)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},
                                status=500)
        finally:
            cursor.close()
            db.close()

    return JsonResponse({'error': 'Method not allowed'}, status=405)


def get_pharmacy_bylocation(request):
    try:
        # location = request.GET.get('location')
        # department = request.GET.get('Department')

        # Establish database connection and cursor
        # Select role data from the database

        # db = get_db_connection()
        cursor = db.cursor()

        query = """
    SELECT location_id, location_name, Sublocation_name, Status
    FROM usercontrol_sublocation
"""
        cursor.execute(query)
        result = cursor.fetchall()

        # Convert the result into a list of dictionaries
        role_data = []
        for row in result:
            role_dict = {
                'location_id': row[0],
                'location_name': row[1],
                'Sublocation_name': row[2],
                'Status': row[3]
            }
            role_data.append(role_dict)

        return JsonResponse(
            role_data, safe=False
        )  # Set safe=False to allow non-dict objects to be serialized

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


@csrf_exempt
def update_pharmacy_status(request):
    try:
        location_id = request.GET.get('location_id')
        status = request.GET.get('status')

        # Establish database connection and cursor
        # Select role data from the database

        # db = get_db_connection()
        cursor = db.cursor()

        query = """
    UPDATE  usercontrol_sublocation SET  Status = %s
    WHERE location_id=%s
"""
        cursor.execute(query, (status, location_id))

        db.commit()

        return JsonResponse({
            'Message': 'Status Updated Successfully'
        })  # Set safe=False to allow non-dict objects to be serialized

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)


def getpharmacyname(request):
    try:
        location = request.GET.get('location')
        
        # db = get_db_connection()
        cursor = db.cursor()

        query = """
    SELECT Sublocation_name
    FROM usercontrol_sublocation WHERE location_name=%s AND Status = 'Active' 
"""
        cursor.execute(query,(location,))
        result = cursor.fetchall()

        # Convert the result into a list of dictionaries
        role_data = []
        for row in result:
            role_dict = {
                'Sublocation_name': row[0]
            }
            role_data.append(role_dict)

        return JsonResponse(
            role_data, safe=False
        )  # Set safe=False to allow non-dict objects to be serialized

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},
                            status=500)
                            
                            
def getDepartment_for_userregister(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            # Select role data from the database
            query = "SELECT * FROM SubMaindepartment"
            cursor.execute(query)
            result = cursor.fetchall()
            
            columns = [i[0] for i in cursor.description]
            role_data = [dict(zip(columns, j)) for j in result]
            
            # Modify the department name
           
                # if item.get('subdepartment_name') == 'ADMIN':
                #     item['subdepartment_name'] = 'ALL'
            
            # Return the role data as JSON
            return JsonResponse(role_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
        
        
        
def getlocation_for_sampletransfer(request):
    if request.method == 'GET':
        try:
            # db = get_db_connection()
            cursor = db.cursor()
            # Select role data from the database
            query = "SELECT * FROM UserControl_location"
            cursor.execute(query)
            result = cursor.fetchall()
            
            columns = [i[0] for i in cursor.description]
            role_data = [dict(zip(columns, j)) for j in result]
            
            # Modify the department name
            for item in role_data:
                if item.get('location_name') == 'ALL':
                    item['location_name'] = ''
            
            # Return the role data as JSON
            return JsonResponse(role_data, safe=False)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
    else:
        return JsonResponse({'error': 'Method not allowed'})