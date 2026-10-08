import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Q
import os
import pandas as pd
from .serializers import *


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import ShiftDetails_Master  # Replace with your actual model
from .serializers import ShiftDetailsSerializer  # Replace with your actual serializer

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Shift_Details_link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            bulkAssign = data.get("bulkAssign")
            def check_existing_duty(employee_id, start_date, end_date):
                return ShiftDetails_Master.objects.filter(Employee=employee_id,Shiftstartdate__lte=end_date, Shiftenddate__gte=start_date).exists()
            if bulkAssign is True:
                Employees = data.get("selectedEmployees")
                print('Employees :',Employees)
                errors = []
                for i in Employees:
                    if check_existing_duty(i["Employee_Id"], data.get("Shiftstartdate"), data.get("Shiftenddate")):
                        error_msg = f"Employee {i['Employee_Id']} already has a duty assigned during this period."
                        errors.append({i["Employee_Id"]: error_msg})
                        continue
                    i["Shiftstartdate"] = data.get("Shiftstartdate")
                    i["Shiftenddate"] = data.get("Shiftenddate")
                    i["Shift_Id"] = data.get("Shift_Id")
                    i["Create_by"] = data.get("Create_by")
                    i["Location_Name"] = data.get("Location_Name")
                    i["Department"] = data.get("openRow")
                    i["Status"] = data.get("Status1")
                    i["Employee"] = i.get("Employee_Id")
                    serializer = ShiftDetailsSerializer(data=i)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        errors.append({i["Employee_Id"]: serializer.errors})
                if errors:
                    print('errors :',errors)
                    return JsonResponse({"errors": errors})
                return JsonResponse({"success": "All shifts added successfully"}, status=200)

            else:
                employee_id = data.get("Employee")
                duplicate = check_existing_duty(employee_id, data.get("Shiftstartdate"), data.get("Shiftenddate"))
                if duplicate:
                    return JsonResponse({"error": f"Employee {employee_id} already has a duty assigned during this period."},)
                serializer = ShiftDetailsSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(
                        {"success": "Shift added successfully"})
                return JsonResponse({"error": serializer.errors})
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred"})

    elif request.method == "GET":
        try:
            # Fetch all records from the LocationName model
            ShiftsData = ShiftDetails_Master.objects.all()

            # Construct a list of dictionaries containing location data
            Shift_Master_data = []
            for Shift in ShiftsData:
                Shift_dict = {
                    "id": Shift.pk,
                    "Employee": Shift.Employee.Employee_ID if Shift.Employee else None,
                    "ShiftName": Shift.ShiftName.ShiftName if Shift.ShiftName else None,
                    "Intime": Shift.Intime,
                    "Outtime": Shift.Outtime,
                    "Shiftstartdate": Shift.Shiftstartdate,
                    "Shiftenddate": Shift.Shiftenddate,
                    "Status": "Active" if Shift.Status else "Inactive",
                    "Create_by": Shift.Create_by,
                }
                Shift_Master_data.append(Shift_dict)

            return JsonResponse(Shift_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": "An internal server error occurred"})


@csrf_exempt
@require_http_methods(['GET'])
def get_shift_details(request):
    try:
        # Optimize queries
        shifts = (
            ShiftDetails_Master.objects.filter(Status ='Approved')
            .select_related("Employee", "Shift_Id", "Location_Name")
            .prefetch_related("Employee__Department")
            .exclude(ot_status="Yes")
        )

        department_dict = {}

        for shift in shifts:
            # get departments of the employee
            departments = shift.Employee.Department.values_list("Department_Name", flat=True)
            
            employee_data = {
                "Employee_Shift_ID": shift.Employee_Shift_Id,
                "Employee_ID": shift.Employee.Employee_ID,
                "Employee_Name": f"{shift.Employee.First_Name} {shift.Employee.Middle_Name} {shift.Employee.Last_Name}".strip(),
                "Shift_Id": shift.Shift_Id.ShiftName if shift.Shift_Id else None,
                "ShiftDate": shift.ShiftDate,
                "Status": shift.Status,
                "Create_by": shift.Create_by,
                "Location_Name": shift.Location_Name.Location_Name if shift.Location_Name else None,
                "Created_at": shift.Created_at,
                "Updated_at": shift.Updated_at,
            }

            for dept in departments:
                department_dict.setdefault(dept, []).append(employee_data)

        return JsonResponse({"departments": department_dict})
    except Exception as e:
        return JsonResponse({"err": str(e)})




@csrf_exempt
@require_http_methods(["POST"])
def submit_overtime(request):
    try:
        data = json.loads(request.body)
        if not isinstance(data, list):
            return JsonResponse({"error": "Expected a list of OT records."}, status=400)

        created_records = []
        for record in data:
            shift_id = record.get("Employee_Shift_ID")
            ot_date = record.get("OTDate")
            start_time = record.get("StartTime")
            end_time = record.get("EndTime")
            hours = record.get("Hours")
            created_by = record.get("Created_by", "System")  # optional

            if not all([shift_id, ot_date, start_time, end_time, hours]):
                continue  # skip incomplete records

            # Fetch the related shift
            shift = ShiftDetails_Master.objects.filter(Employee_Shift_Id=shift_id).first()
            if not shift:
                continue  # skip invalid shift IDs

            # Create OT record
            ot = OverTime_Master.objects.create(
                Employee_Shift=shift,
                StartTime=start_time,
                EndTime=end_time,
                Hours=hours,
                Created_by=created_by,
                Status="Assigned"
            )
            created_records.append(ot.OT_ID)

            # Update OT_Status in the shift details
            shift.ot_status = "Yes"
            shift.save(update_fields=["ot_status"])

        return JsonResponse({
            "message": "Overtime records submitted successfully.",
            "created_OT_IDs": created_records
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(['GET'])
def OtAssignedDatas(request):
    try:
        ot_records = OverTime_Master.objects.filter(Status="Assigned")
        data = []

        for ot in ot_records:
            shift = getattr(ot, 'Employee_Shift', '')  # safe access
            employee = getattr(shift, 'Employee', '') if shift else ''

            data.append({
                "OT_ID": ot.OT_ID,
                "Employee_ID": employee.Employee_ID if employee else "",
                "Employee_Name": employee.First_Name if employee else "",
                "Shift_ID": shift.Shift_Id if shift and shift else '',
                "Shift_Date": shift.ShiftDate.strftime('%d-%m-%Y') if shift and shift.ShiftDate else "",
                "StartTime": ot.StartTime.strftime('%H:%M') if ot.StartTime else "",
                "EndTime": ot.EndTime.strftime('%H:%M') if ot.EndTime else "",
                "Hours": float(ot.Hours) if ot.Hours else 0,
                "Status": ot.Status,
            })

        return JsonResponse({"assigned_OTs": data}, status=200)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


    
def safe_parse_date(val):
    """
    Try to parse a date string without warnings.
    Supports DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY and times like 08:15.
    """
    if not val or str(val).strip() == "":
        return None

    text = str(val).strip()

    # Try known full date formats
    for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue

    # Try to parse time-only values (like "08:15")
    if ":" in text:
        try:
            return pd.to_datetime(text).time()
        except Exception:
            return None

    return None


@csrf_exempt
@require_http_methods(["POST"])
def upload_attendance(request):
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by", "System")

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        # ✅ Handle CSV, XLSX, XLS
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        elif file.name.endswith(".xls"):
            df = pd.read_excel(file, engine="xlrd")   # pip install xlrd==2.0.1
        else:
            return JsonResponse(
                {"error": "Unsupported file format. Please upload only CSV, XLSX, or XLS"},
                status=400,
            )

        # ✅ Normalize column names
        df.columns = df.columns.str.strip().str.replace("\xa0", " ").str.lower()

        # ✅ Convert dataframe to dicts
        csv_data = df.to_dict(orient="records")

        def safe_strip(val):
            return str(val).strip() if pd.notna(val) and str(val).strip() != "" else None

        inserted_count = 0

        for row in csv_data:
            try:
                emp_id = safe_strip(row.get("existing_employeeid"))
                if not emp_id:
                    continue

                employee = Employee_Personal_Form_Detials.objects.filter(
                    Existing_Employee_ID=emp_id
                ).first()
                if not employee:
                    continue

                # ✅ Collect all IN/OUT punches
                punches = []
                for key, val in row.items():
                    parsed = safe_parse_date(val)
                    if parsed:
                        punches.append(parsed)

                # ✅ First punch = Date, rest = Times
                if not punches:
                    continue

                date = None
                if isinstance(punches[0], datetime):
                    date = punches[0].date()
                else:
                    continue

                times = [p for p in punches[1:] if isinstance(p, datetime) or isinstance(p, str) or hasattr(p, "strftime")]

                # Normalize times into strings (HH:MM)
                times = [p.strftime("%H:%M") if hasattr(p, "strftime") else str(p) for p in times if ":" in str(p)]

                # ✅ Pair IN/OUT
                for i in range(0, len(times), 2):
                    in_time = times[i]
                    out_time = times[i + 1] if i + 1 < len(times) else None

                    if in_time and out_time:
                        with transaction.atomic():
                            Employee_Attendance.objects.create(
                                Employee=employee,
                                Date=date,
                                In_Time=in_time,
                                Out_Time=out_time,
                                Attendance_Status="Present",
                                CreatedBy=created_by,
                            )
                            inserted_count += 1

            except Exception as row_error:
                print(f"❌ Error processing row {row}: {row_error}")
                continue

        return JsonResponse(
            {"message": f"Attendance file uploaded successfully ✅ ({inserted_count} records inserted)"}
        )

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)