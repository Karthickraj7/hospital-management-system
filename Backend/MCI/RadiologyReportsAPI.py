# Additional API endpoints for RadiologyReports - Add these to your MCIPatientReports.py
from django.db.models import Q
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from datetime import datetime
from OutPatient.models import Radiology_Complete_Details, Radiology_Request_Details


# Import required models
from .models import (
    RadiologyNames_Details,
    TestName_Details,
    Doctor_Personal_Form_Detials,
    Patient_Appointment_Registration_Detials,
    Patient_IP_Registration_Detials,
    Doctor_ProfessForm_Detials
)


@require_http_methods(["GET"])
def get_radiology_patient_list(request):
    """
    Get detailed patient list for radiology reports with filtering
    Similar to mode='list' in get_radiology_reports
    """
    try:
        # Date filters
        DateType = request.GET.get("DateType")
        CurrentDate = request.GET.get("CurrentDate")
        FromDate = request.GET.get("FromDate")
        ToDate = request.GET.get("ToDate")

        # Other filters
        Department = request.GET.get("Department")
        status = request.GET.get("status")
        Service_Status = request.GET.get("Service_Status") 
        RegisterType = request.GET.get("RegisterType")
        doctor_id = request.GET.get("doctor_id")
        patient_search = request.GET.get("patient_search")
        test_search = request.GET.get("test_search")

        # Parse comma-separated values
        department_list = Department.split(",") if Department else []
        status_list = status.split(",") if status else []
        service_status_list = Service_Status.split(",") if Service_Status else []
        register_type_list = RegisterType.split(",") if RegisterType else []
        doctor_id_list = doctor_id.split(",") if doctor_id else []

        # Date Filter
        date_filter = Q()
        if DateType and DateType.lower() == "current":
            if not CurrentDate:
                return JsonResponse({"error": "CurrentDate is required"}, status=400)
            try:
                current_date = datetime.strptime(CurrentDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date=current_date)
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid CurrentDate format. Use YYYY-MM-DD."}, status=400
                )
        elif FromDate and ToDate:
            try:
                from_date = datetime.strptime(FromDate, "%Y-%m-%d").date()
                to_date = datetime.strptime(ToDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Base query

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        queryset = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter)

        # Apply filters
        if department_list:
            queryset = queryset.filter(TestCode__in=department_list)

        if status_list:
            status_q = Q()
            for s in status_list:
                if s == "Request":
                    status_q |= Q(Status="Request")
                elif s == "Paid":
                    status_q |= Q(Status="Paid")
                elif s == "Due":
                    status_q |= Q(Status="Due")
                elif s == "Analyzed":
                    status_q |= Q(Status="Analyzed")
                elif s == "Completed":
                    status_q |= Q(Status="Completed")
            queryset = queryset.filter(status_q)
        
        if service_status_list:
            service_q = Q()
            for s in service_status_list:
                if s == "All":
                    continue
                elif s == "Pending":
                    service_q |= Q(Service_Status="Pending")
                elif s == "Analyzed":
                    service_q |= Q(Service_Status="Analyzed")
                elif s == "Completed":
                    service_q |= Q(Service_Status="Completed")
            if service_q:
                queryset = queryset.filter(service_q)

        if register_type_list:
            queryset = queryset.filter(RegisterType__in=register_type_list)

        if doctor_id_list:
            queryset = queryset.filter(Doctorid__in=doctor_id_list)

        RadiologyList = []
        for datas in queryset:
            try:
                Patient = None
                if datas.RegisterType in ["OP", "WALK-IN"]:
                    if datas.OP_Register_Id:
                        Registerid = datas.OP_Register_Id
                        Patient = Registerid.PatientId
                elif datas.RegisterType == "IP":
                    if datas.IP_Register_Id:
                        Registerid = datas.IP_Register_Id
                        Patient = Registerid.PatientId
                else:
                    continue

                if not Patient:
                    continue

                # Build patient name
                title_name = Patient.Title.Title_Name if Patient.Title else ""
                first_name = Patient.FirstName or ""
                middle_name = Patient.MiddleName or ""
                last_name = Patient.SurName or ""
                full_name = (
                    f"{title_name}. {first_name} {middle_name} {last_name}".strip()
                )

                # Apply client-side search filters
                if patient_search:
                    if not (
                        patient_search.lower() in full_name.lower()
                        or patient_search.lower() in (Patient.PatientId or "").lower()
                    ):
                        continue

                # Build doctor name
                doctor = datas.Doctorid
                if doctor:
                    doctor_first = doctor.First_Name or ""
                    doctor_middle = doctor.Middle_Name or ""
                    doctor_last = doctor.Last_Name or ""
                    Dfull_name = f"{doctor_first} {doctor_middle} {doctor_last}".strip()
                else:
                    Dfull_name = "Self"

                # Get department and test names
                radiologynameins = RadiologyNames_Details.objects.filter(
                    Radiology_Id=datas.TestCode
                ).first()
                testnameins = TestName_Details.objects.filter(
                    Test_Code=datas.SubTestCode
                ).first()

                # Apply test search filter
                if test_search:
                    test_name = testnameins.Test_Name if testnameins else ""
                    if test_search.lower() not in test_name.lower():
                        continue

                RadiologyList.append(
                    {
                        "PatientId": Patient.PatientId or "",
                        "PatientName": full_name,
                        "RegisterType": datas.RegisterType,
                        "PhoneNumber": Patient.PhoneNo or "",
                        "doctor_name": Dfull_name,
                        "doctor_id": doctor.Doctor_ID if doctor else "",
                        "Deptname": (
                            radiologynameins.Radiology_Name if radiologynameins else ""
                        ),
                        "Testname": testnameins.Test_Name if testnameins else "",
                        "request_id": datas.Radiology_RequestId,
                        "Status": datas.Status or "",
                        "Service_Status": datas.Service_Status or "",
                        "created_date": (
                            datas.created_at.strftime("%Y-%m-%d")
                            if datas.created_at
                            else ""
                        ),
                    }
                )
            except Exception as e:
                print(
                    f"Error processing radiology request {datas.Radiology_RequestId}: {e}"
                )
                continue

        # Add serial numbers
        for i, item in enumerate(RadiologyList, start=1):
            item["Sno"] = i

        return JsonResponse(
            {
                "RadiologyList": RadiologyList,
                "Totalcount": len(RadiologyList),
                "summary": {
                    "total": len(RadiologyList),
                    "request": len(
                        [r for r in RadiologyList if r["Status"] == "Request"]
                    ),
                    "paid": len([r for r in RadiologyList if r["Status"] == "Paid"]),
                    "due": len([r for r in RadiologyList if r["Status"] == "Due"]),
                    "analyzed": len(
                        [r for r in RadiologyList if r["Status"] == "Analyzed"]
                    ),
                    "completed": len(
                        [r for r in RadiologyList if r["Status"] == "Completed"]
                    ),
                },
            },
            safe=False,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_radiology_doctor_wise_reports(request):
    """
    Get doctor-wise radiology reports with patient details
    Similar to mode='doctor' in get_radiology_reports
    """
    try:
        # Date filters
        DateType = request.GET.get("DateType")
        CurrentDate = request.GET.get("CurrentDate")
        FromDate = request.GET.get("FromDate")
        ToDate = request.GET.get("ToDate")

        # Required filter
        doctor_id = request.GET.get("doctor_id")
        if not doctor_id:
            return JsonResponse({"error": "Doctor ID is required"}, status=400)

        # Other filters
        Department = request.GET.get("Department")
        status = request.GET.get("status")
        RegisterType = request.GET.get("RegisterType")

        # Parse comma-separated values
        department_list = Department.split(",") if Department else []
        status_list = status.split(",") if status else []
        register_type_list = RegisterType.split(",") if RegisterType else []
        doctor_id_list = doctor_id.split(",") if doctor_id else []

        # Date Filter
        date_filter = Q()
        if DateType and DateType.lower() == "current":
            if not CurrentDate:
                return JsonResponse({"error": "CurrentDate is required"}, status=400)
            try:
                current_date = datetime.strptime(CurrentDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date=current_date)
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid CurrentDate format. Use YYYY-MM-DD."}, status=400
                )
        elif FromDate and ToDate:
            try:
                from_date = datetime.strptime(FromDate, "%Y-%m-%d").date()
                to_date = datetime.strptime(ToDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Get doctors
        doctors = Doctor_Personal_Form_Detials.objects.filter(
            Doctor_ID__in=doctor_id_list
        )
        if not doctors:
            return JsonResponse({"error": "Doctors not found"}, status=404)

        # Query radiology complete details
        reports_query = Radiology_Complete_Details.objects.filter(date_filter)

        # Apply filters
        if department_list:
            reports_query = reports_query.filter(
                Radiology_RequestId__TestCode__in=department_list
            )

        if status_list:
            status_q = Q()
            for s in status_list:
                if s == "Request":
                    status_q |= Q(Status="Request")
                elif s == "Paid":
                    status_q |= Q(Status="Paid")
                elif s == "Due":
                    status_q |= Q(Status="Due")
                elif s == "Analyzed":
                    status_q |= Q(Status__in=["Paid", "Due"])
                elif s == "Completed":
                    status_q |= Q(Status__in=["Paid", "Due"])
            reports_query = reports_query.filter(status_q)

        if register_type_list:
            reports_query = reports_query.filter(
                Radiology_RequestId__RegisterType__in=register_type_list
            )

        # Apply doctor filter
        reports_query = reports_query.filter(doctorId__in=doctor_id_list)

        # Select related to avoid N+1 queries
        reports = reports_query.select_related(
            "Radiology_RequestId",
            "Radiology_RequestId__OP_Register_Id",
            "Radiology_RequestId__IP_Register_Id",
            "Radiology_RequestId__Casuality_Register_Id",
        )

        report_list = []
        for report in reports:
            try:
                test_ins = TestName_Details.objects.filter(
                    Test_Code=report.Radiology_RequestId.SubTestCode
                ).first()

                # Get patient details based on register type
                patient_id = None
                if report.Radiology_RequestId.RegisterType.upper() == "OP":
                    if report.Radiology_RequestId.OP_Register_Id:
                        op_reg = Patient_Appointment_Registration_Detials.objects.filter(
                            Registration_Id=report.Radiology_RequestId.OP_Register_Id.Registration_Id
                        ).first()
                        patient_id = op_reg.PatientId if op_reg else None
                elif report.Radiology_RequestId.RegisterType.upper() == "IP":
                    if report.Radiology_RequestId.IP_Register_Id:
                        ip_reg = Patient_IP_Registration_Detials.objects.filter(
                            Registration_Id=report.Radiology_RequestId.IP_Register_Id.Registration_Id
                        ).first()
                        patient_id = ip_reg.PatientId if ip_reg else None

                # Build patient details
                patient_name = ""
                phone_number = ""
                patient_id_str = ""

                if patient_id:
                    first_name = getattr(patient_id, "FirstName", None) or ""
                    middle_name = getattr(patient_id, "MiddleName", None) or ""
                    last_name = getattr(patient_id, "SurName", None) or ""
                    patient_name = f"{first_name} {middle_name} {last_name}".strip()
                    phone_number = getattr(patient_id, "PhoneNo", None) or ""
                    patient_id_str = getattr(patient_id, "PatientId", None) or ""

                report_list.append(
                    {
                        "request_id": report.Radiology_RequestId.Radiology_RequestId,
                        "PatientId": patient_id_str,
                        "PatientName": patient_name,
                        "PhoneNumber": phone_number,
                        "Testname": test_ins.Test_Name if test_ins else "",
                        "doctor_id": report.doctorId,
                        "doctor_name": report.RadiologistName or "",
                        "RegisterType": report.Radiology_RequestId.RegisterType,
                        "Deptname": (
                            test_ins.Radiology_Id.Radiology_Name
                            if test_ins and test_ins.Radiology_Id
                            else ""
                        ),
                        "Status": report.Status or "",
                        "report_date": (
                            report.ReportDate.strftime("%Y-%m-%d")
                            if report.ReportDate
                            else ""
                        ),
                    }
                )
            except Exception as e:
                print(f"Error processing report: {e}")
                continue

        # Doctor details
        doctor_details_list = []
        for doc in doctors:
            doctor_details_list.append(
                {
                    "doctor_id": doc.Doctor_ID,
                    "doctor_name": f"{doc.First_Name or ''} {doc.Middle_Name or ''} {doc.Last_Name or ''}".strip(),
                }
            )

        return JsonResponse(
            {
                "doctors": doctor_details_list,
                "reports": report_list,
                "summary": {
                    "total_reports": len(report_list),
                    "completed": sum(
                        1 for r in report_list if r["Status"] == "Completed"
                    ),
                    "pending": sum(
                        1 for r in report_list if r["Status"] != "Completed"
                    ),
                    "request": sum(1 for r in report_list if r["Status"] == "Request"),
                    "paid": sum(1 for r in report_list if r["Status"] == "Paid"),
                    "due": sum(1 for r in report_list if r["Status"] == "Due"),
                },
            },
            safe=False,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_radiology_department_summary(request):
    """
    Get department-wise test summary with counts
    Similar to mode='deptwise' in get_radiology_reports
    """
    try:
        # Date filters
        DateType = request.GET.get("DateType")
        CurrentDate = request.GET.get("CurrentDate")
        FromDate = request.GET.get("FromDate")
        ToDate = request.GET.get("ToDate")

        # Required filter
        Department = request.GET.get("Department")
        if not Department:
            return JsonResponse({"error": "Department is required"}, status=400)

        # Other filters
        status = request.GET.get("status")
        RegisterType = request.GET.get("RegisterType")
        doctor_id = request.GET.get("doctor_id")

        # Parse comma-separated values
        department_list = Department.split(",") if Department else []
        status_list = status.split(",") if status else []
        register_type_list = RegisterType.split(",") if RegisterType else []
        doctor_id_list = doctor_id.split(",") if doctor_id else []

        # Date Filter
        date_filter = Q()
        if DateType and DateType.lower() == "current":
            if not CurrentDate:
                return JsonResponse({"error": "CurrentDate is required"}, status=400)
            try:
                current_date = datetime.strptime(CurrentDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date=current_date)
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid CurrentDate format. Use YYYY-MM-DD."}, status=400
                )
        elif FromDate and ToDate:
            try:
                from_date = datetime.strptime(FromDate, "%Y-%m-%d").date()
                to_date = datetime.strptime(ToDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )

        # Base query with date filter

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        base_query = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter)

        # Apply additional filters
        if status_list:
            status_q = Q()
            for s in status_list:
                if s == "Request":
                    status_q |= Q(Status="Request", Service_Status="Pending")
                elif s == "Paid":
                    status_q |= Q(Status="Paid", Service_Status="Pending")
                elif s == "Due":
                    status_q |= Q(Status="Due", Service_Status="Pending")
                elif s == "Analyzed":
                    status_q |= Q(Status__in=["Paid", "Due"], Service_Status="Analyzed")
                elif s == "Completed":
                    status_q |= Q(
                        Status__in=["Paid", "Due"], Service_Status="Completed"
                    )
            base_query = base_query.filter(status_q)

        if register_type_list:
            base_query = base_query.filter(RegisterType__in=register_type_list)

        if doctor_id_list:
            base_query = base_query.filter(Doctorid__in=doctor_id_list)

        # Get test-wise counts
        TestList = []
        Testins = TestName_Details.objects.filter(
            Radiology_Id__Radiology_Id__in=department_list
        )

        for test in Testins:
            Takentest = base_query.filter(SubTestCode=test.Test_Code)
            if Takentest.exists():
                TestList.append(
                    {
                        "Testname": test.Test_Name,
                        "Testcount": Takentest.count(),
                        "Test_Code": test.Test_Code,
                    }
                )

        # Total counts by register type
        TotalOP = base_query.filter(
            Q(TestCode__in=department_list) & Q(RegisterType__in=["OP", "WALK-IN"])
        ).count()

        TotalIP = base_query.filter(
            Q(TestCode__in=department_list) & Q(RegisterType="IP")
        ).count()

        # Get department name
        dept_name = ""
        if department_list:
            dept_obj = RadiologyNames_Details.objects.filter(
                Radiology_Id=department_list[0]
            ).first()
            dept_name = dept_obj.Radiology_Name if dept_obj else ""

        return JsonResponse(
            {
                "Countdetails": TestList,
                "TotalOP": TotalOP,
                "TotalIP": TotalIP,
                "TotalCount": TotalOP + TotalIP,
                "DepartmentName": dept_name,
                "summary": {
                    "total_tests": len(TestList),
                    "total_cases": sum(test["Testcount"] for test in TestList),
                    "op_cases": TotalOP,
                    "ip_cases": TotalIP,
                },
            },
            safe=False,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)





@require_http_methods(["GET"])
def get_radiology_departments(request):
    """
    Get all radiology departments
    """
    try:
        departments = RadiologyNames_Details.objects.all().values(
            "Radiology_Id", "Radiology_Name"
        )
        return JsonResponse(list(departments), safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# @require_http_methods(["GET"])
# def get_radiology_doctors(request):
#     """
#     Get all doctors for radiology department
#     """
#     try:
#         # Get all doctors - remove the specialization filter since the field doesn't exist
#         doctors = Doctor_Personal_Form_Detials.objects.all().values(
#             "Doctor_ID", "First_Name", "Middle_Name", "Last_Name"
#         )

#         doctor_list = []
#         for doc in doctors:
#             full_name = f"{doc['First_Name'] or ''} {doc['Middle_Name'] or ''} {doc['Last_Name'] or ''}".strip()
#             print(full_name, "full_name")
#             doctor_list.append(
#                 {
#                     "Doctor_ID": doc["Doctor_ID"],
#                     "doctor_name": full_name,
#                     "First_Name": doc["First_Name"],
#                     "Last_Name": doc["Last_Name"],
#                 }
#             )

#         return JsonResponse(doctor_list, safe=False)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def get_radiology_doctors(request):
    """
    Get all doctors for RADIOLOGY department only (exact match)
    """
    print("DEBUG: get_radiology_doctors API called - looking for 'RADIOLOGY' department")
    
    try:
        # Get all doctors with their professional details
        doctor_personal_data = Doctor_Personal_Form_Detials.objects.all()
        doctor_list = []
        
        radiology_doctors_count = 0
        total_doctors_checked = 0
        
        for doctor_personal in doctor_personal_data:
            total_doctors_checked += 1
            try:
                # Get professional details for each doctor
                doctor_professional = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=doctor_personal.Doctor_ID)
                
                # Check if doctor has "RADIOLOGY" department (exact match)
                is_radiology_doctor = False
                department_names = []
                
                if doctor_professional and doctor_professional.Department.exists():
                    # Get all department names for this doctor
                    for department in doctor_professional.Department.all():
                        department_name = department.Department_Name.strip()
                        department_names.append(department_name)
                        
                        # Check if department is exactly "RADIOLOGY"
                        if department_name == "RADIOLOGY":
                            is_radiology_doctor = True
                
                # If it's a radiology doctor, add to the list
                if is_radiology_doctor:
                    radiology_doctors_count += 1
                    # Construct doctor name
                    doctor_name = f"{doctor_personal.First_Name or ''} {doctor_personal.Middle_Name or ''} {doctor_personal.Last_Name or ''}".strip()
                    
                    doctor_list.append({
                        "Doctor_ID": doctor_personal.Doctor_ID,
                        "doctor_name": doctor_name,
                        "First_Name": doctor_personal.First_Name or "",
                        "Last_Name": doctor_personal.Last_Name or "",
                        "Department": ", ".join(department_names),
                    })
                    
                    # Debug print for radiology doctors
                    print(f"DEBUG: ✓ RADIOLOGY Doctor #{radiology_doctors_count}: {doctor_name}")
                    print(f"       Doctor ID: {doctor_personal.Doctor_ID}")
                    print(f"       Departments: {department_names}")
                    
            except Doctor_ProfessForm_Detials.DoesNotExist:
                # Skip doctors without professional details
                continue
        
        print("=" * 60)
        print(f"DEBUG: CHECK COMPLETED")
        print(f"DEBUG: Total doctors checked: {total_doctors_checked}")
        print(f"DEBUG: RADIOLOGY doctors found: {radiology_doctors_count}")
        print(f"DEBUG: Returning {len(doctor_list)} doctors")
        
        if radiology_doctors_count == 0:
            print("DEBUG: ⚠️ WARNING: No doctors found with department 'RADIOLOGY'")
            print("DEBUG: Checking department assignments...")
            
            # Get a sample of doctors to see their departments
            sample_doctors = Doctor_ProfessForm_Detials.objects.select_related('Doctor_ID')[:10]
            for doc_pro in sample_doctors:
                doc_name = f"{doc_pro.Doctor_ID.First_Name or ''} {doc_pro.Doctor_ID.Last_Name or ''}".strip()
                depts = [d.Department_Name for d in doc_pro.Department.all()]
                print(f"DEBUG: Sample Doctor: {doc_name} - Departments: {depts}")
        
        return JsonResponse(doctor_list, safe=False)
        
    except Exception as e:
        import traceback
        print(f"ERROR fetching radiology doctors: {e}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)





# @require_http_methods(["GET"])
# def specialization_department_get(request):
#     try:
#         # Date filters
#         DateType = request.GET.get("DateType")
#         CurrentDate = request.GET.get("CurrentDate")
#         FromDate = request.GET.get("FromDate")
#         ToDate = request.GET.get("ToDate")

#         # Optional filters
#         RegisterType = request.GET.get("RegisterType")
#         status = request.GET.get("status")
#         Department = request.GET.get("Department")  # Add Department filter

#         # Parse comma-separated values
#         register_type_list = RegisterType.split(",") if RegisterType else []
#         status_list = status.split(",") if status else []
#         department_list = Department.split(",") if Department else []

#         print(f"Debug - Received parameters:")
#         print(f"FromDate: {FromDate}, ToDate: {ToDate}")
#         print(f"Department: {Department}")
#         print(f"RegisterType: {RegisterType}")
#         print(f"Status: {status}")

#         # Date Filter - Make it less restrictive for debugging
#         date_filter = Q()
#         if DateType and DateType.lower() == "current":
#             if not CurrentDate:
#                 return JsonResponse({"error": "CurrentDate is required"}, status=400)
#             try:
#                 current_date = datetime.strptime(CurrentDate, "%Y-%m-%d").date()
#                 date_filter = Q(created_at__date=current_date)
#             except (ValueError, TypeError):
#                 return JsonResponse(
#                     {"error": "Invalid CurrentDate format. Use YYYY-MM-DD."}, status=400
#                 )
#         elif FromDate and ToDate:
#             try:
#                 from_date = datetime.strptime(FromDate, "%Y-%m-%d").date()
#                 to_date = datetime.strptime(ToDate, "%Y-%m-%d").date()
#                 # Try both created_at and updated_at fields, and also try without time part
#                 date_filter = (
#                     Q(created_at__date__range=(from_date, to_date))
#                     | Q(created_at__gte=from_date, created_at__lte=to_date)
#                     | Q(updated_at__date__range=(from_date, to_date))
#                     | Q(updated_at__gte=from_date, updated_at__lte=to_date)
#                 )
#             except (ValueError, TypeError):
#                 return JsonResponse(
#                     {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
#                 )
#         else:
#             # If no date filter, get all data for debugging
#             print("Debug - No date filter applied, getting all data")

#         # Base query - Get radiology request details with date filter

#         exclude_codes = [
#             'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
#             'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
#             'TSTCODE0032', 'TSTCODE0076'
#         ]
#         # radiology_requests = Radiology_Request_Details.exclude(Status='Canceled').exclude(
#         #     SubTestCode__in=exclude_codes
#         # ).objects.all()
#         radiology_requests = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
#             SubTestCode__in=exclude_codes
#         ).all()  # CORRECT
#         if date_filter:
#             radiology_requests = radiology_requests.filter(date_filter)

#         print(
#             f"Debug - Total radiology requests after date filter: {radiology_requests.count()}"
#         )

#         # Apply department filter if provided
#         if department_list:
#             radiology_requests = radiology_requests.filter(TestCode__in=department_list)
#             print(
#                 f"Debug - Radiology requests after department filter: {radiology_requests.count()}"
#             )

#         # Apply additional filters
#         if register_type_list:
#             radiology_requests = radiology_requests.filter(
#                 RegisterType__in=register_type_list
#             )
#             print(
#                 f"Debug - Radiology requests after register type filter: {radiology_requests.count()}"
#             )

#         if status_list:
#             status_q = Q()
#             for s in status_list:
#                 if s == "Request":
#                     status_q |= Q(Status="Request")
#                 elif s == "Paid":
#                     status_q |= Q(Status="Paid")
#                 elif s == "Due":
#                     status_q |= Q(Status="Due")
#                 elif s == "Analyzed":
#                     status_q |= Q(Status="Analyzed")
#                 elif s == "Completed":
#                     status_q |= Q(Status="Completed")
#             radiology_requests = radiology_requests.filter(status_q)
#             print(
#                 f"Debug - Radiology requests after status filter: {radiology_requests.count()}"
#             )

#         # Import the required models for OP patient appointments
#         from OutPatient.models import OP_Patient_Appointment_With_Multiple_Doctor
#         from Masters.models import Speciality_Detials

#         print(f"Debug - Final radiology requests count: {radiology_requests.count()}")

#         # Dictionary to store specialization counts with test details
#         specialization_counts = {}
#         processed_count = 0
#         op_patients_count = 0
#         appointments_found_count = 0
#         specializations_found_count = 0

#         # Process each radiology request
#         for request_detail in radiology_requests:
#             try:
#                 processed_count += 1
#                 print(
#                     f"Debug - Processing request {processed_count}: {request_detail.Radiology_RequestId}, Type: {request_detail.RegisterType}"
#                 )

#                 # Get Registration_Id from OP_Register_Id (for OP patients)
#                 if (
#                     request_detail.RegisterType in ["OP", "WALK-IN"]
#                     and request_detail.OP_Register_Id
#                 ):
#                     op_patients_count += 1
#                     # Use the actual Registration_Id object, not the string value
#                     registration_obj = request_detail.OP_Register_Id
#                     registration_id_str = registration_obj.Registration_Id
#                     print(
#                         f"Debug - OP Patient found, Registration_Id string: {registration_id_str}"
#                     )

#                     # Get appointment details to find Specialization_id
#                     # Use the Registration_Id object itself for the foreign key lookup
#                     op_appointments = (
#                         OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
#                             Registration_Id=registration_obj
#                         )
#                     )

#                     print(
#                         f"Debug - Found {op_appointments.count()} appointments for registration {registration_id_str}"
#                     )
#                     appointments_found_count += op_appointments.count()

#                     for appointment in op_appointments:
#                         if appointment.Specialization:
#                             specializations_found_count += 1
#                             # appointment.Specialization is the Speciality_Detials object
#                             specialization_obj = appointment.Specialization
#                             specialization_id = specialization_obj.Speciality_Id
#                             specialization_name = specialization_obj.Speciality_Name
#                             print(
#                                 f"Debug - Found specialization_id: {specialization_id}, name: {specialization_name}"
#                             )

#                             # Get test and department details
#                             test_details = TestName_Details.objects.filter(
#                                 Test_Code=request_detail.SubTestCode
#                             ).first()

#                             dept_details = RadiologyNames_Details.objects.filter(
#                                 Radiology_Id=request_detail.TestCode
#                             ).first()

#                             print(
#                                 f"Debug - Test: {test_details.Test_Name if test_details else 'Not found'}, Dept: {dept_details.Radiology_Name if dept_details else 'Not found'}"
#                             )

#                             test_name = (
#                                 test_details.Test_Name
#                                 if test_details
#                                 else "Unknown Test"
#                             )
#                             dept_name = (
#                                 dept_details.Radiology_Name
#                                 if dept_details
#                                 else "Unknown Department"
#                             )

#                             # Initialize specialization if not exists
#                             if specialization_name not in specialization_counts:
#                                 specialization_counts[specialization_name] = {
#                                     "Specialization_Id": specialization_id,
#                                     "Specialization_Name": specialization_name,
#                                     "Total_Test_Count": 0,
#                                     "Total_Request_Count": 0,
#                                     "Total_Paid_Count": 0,
#                                     "Total_Due_Count": 0,
#                                     "Total_Analyzed_Count": 0,
#                                     "Total_Completed_Count": 0,
#                                     "Departments": {},
#                                 }

#                             # Initialize department if not exists
#                             if (
#                                 dept_name
#                                 not in specialization_counts[specialization_name][
#                                     "Departments"
#                                 ]
#                             ):
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name] = {
#                                     "Department_Name": dept_name,
#                                     "Department_Test_Count": 0,
#                                     "Department_Request_Count": 0,
#                                     "Department_Paid_Count": 0,
#                                     "Department_Due_Count": 0,
#                                     "Department_Analyzed_Count": 0,
#                                     "Department_Completed_Count": 0,
#                                     "Tests": {},
#                                 }

#                             # Initialize test if not exists
#                             if (
#                                 test_name
#                                 not in specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"]
#                             ):
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"][test_name] = {
#                                     "Test_Name": test_name,
#                                     "Test_Code": request_detail.SubTestCode,
#                                     "Test_Count": 0,
#                                     "Request_Count": 0,
#                                     "Paid_Count": 0,
#                                     "Due_Count": 0,
#                                     "Analyzed_Count": 0,
#                                     "Completed_Count": 0,
#                                 }

#                             # Increment counts at all levels
#                             specialization_counts[specialization_name][
#                                 "Total_Test_Count"
#                             ] += 1
#                             specialization_counts[specialization_name]["Departments"][
#                                 dept_name
#                             ]["Department_Test_Count"] += 1
#                             specialization_counts[specialization_name]["Departments"][
#                                 dept_name
#                             ]["Tests"][test_name]["Test_Count"] += 1

#                             # Count by status at all levels
#                             if request_detail.Status == "Request":
#                                 specialization_counts[specialization_name][
#                                     "Total_Request_Count"
#                                 ] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Department_Request_Count"] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"][test_name]["Request_Count"] += 1
#                             elif request_detail.Status == "Paid":
#                                 specialization_counts[specialization_name][
#                                     "Total_Paid_Count"
#                                 ] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Department_Paid_Count"] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"][test_name]["Paid_Count"] += 1
#                             elif request_detail.Status == "Due":
#                                 specialization_counts[specialization_name][
#                                     "Total_Due_Count"
#                                 ] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Department_Due_Count"] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"][test_name]["Due_Count"] += 1
#                             elif request_detail.Status == "Analyzed":
#                                 specialization_counts[specialization_name][
#                                     "Total_Analyzed_Count"
#                                 ] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Department_Analyzed_Count"] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"][test_name]["Analyzed_Count"] += 1
#                             elif request_detail.Status == "Completed":
#                                 specialization_counts[specialization_name][
#                                     "Total_Completed_Count"
#                                 ] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Department_Completed_Count"] += 1
#                                 specialization_counts[specialization_name][
#                                     "Departments"
#                                 ][dept_name]["Tests"][test_name]["Completed_Count"] += 1

#                 elif (
#                     request_detail.RegisterType == "IP"
#                     and request_detail.IP_Register_Id
#                 ):
#                     # For IP patients, you might need to implement similar logic
#                     # depending on how IP appointments are structured
#                     pass

#             except Exception as e:
#                 print(
#                     f"Error processing request {request_detail.Radiology_RequestId}: {e}"
#                 )
#                 continue

#         # Convert nested dictionaries to lists for better JSON structure
#         specialization_list = []
#         for spec_name, spec_data in specialization_counts.items():
#             departments_list = []
#             for dept_name, dept_data in spec_data["Departments"].items():
#                 tests_list = list(dept_data["Tests"].values())
#                 # Sort tests by count (descending)
#                 tests_list.sort(key=lambda x: x["Test_Count"], reverse=True)

#                 dept_data_clean = {
#                     "Department_Name": dept_data["Department_Name"],
#                     "Department_Test_Count": dept_data["Department_Test_Count"],
#                     "Department_Request_Count": dept_data["Department_Request_Count"],
#                     "Department_Paid_Count": dept_data["Department_Paid_Count"],
#                     "Department_Due_Count": dept_data["Department_Due_Count"],
#                     "Department_Analyzed_Count": dept_data["Department_Analyzed_Count"],
#                     "Department_Completed_Count": dept_data[
#                         "Department_Completed_Count"
#                     ],
#                     "Tests": tests_list,
#                 }
#                 departments_list.append(dept_data_clean)

#             # Sort departments by test count (descending)
#             departments_list.sort(
#                 key=lambda x: x["Department_Test_Count"], reverse=True
#             )

#             spec_data_clean = {
#                 "Specialization_Id": spec_data["Specialization_Id"],
#                 "Specialization_Name": spec_data["Specialization_Name"],
#                 "Total_Test_Count": spec_data["Total_Test_Count"],
#                 "Total_Request_Count": spec_data["Total_Request_Count"],
#                 "Total_Paid_Count": spec_data["Total_Paid_Count"],
#                 "Total_Due_Count": spec_data["Total_Due_Count"],
#                 "Total_Analyzed_Count": spec_data["Total_Analyzed_Count"],
#                 "Total_Completed_Count": spec_data["Total_Completed_Count"],
#                 "Departments": departments_list,
#             }
#             specialization_list.append(spec_data_clean)

#         # Sort specializations by total test count (descending)
#         specialization_list.sort(key=lambda x: x["Total_Test_Count"], reverse=True)

#         # Add serial numbers
#         for i, item in enumerate(specialization_list, start=1):
#             item["Sno"] = i

#         # Calculate totals
#         total_tests = sum(item["Total_Test_Count"] for item in specialization_list)
#         total_request = sum(item["Total_Request_Count"] for item in specialization_list)
#         total_paid = sum(item["Total_Paid_Count"] for item in specialization_list)
#         total_due = sum(item["Total_Due_Count"] for item in specialization_list)
#         total_analyzed = sum(
#             item["Total_Analyzed_Count"] for item in specialization_list
#         )
#         total_completed = sum(
#             item["Total_Completed_Count"] for item in specialization_list
#         )

#         # Debug: Print final results
#         print(f"Final specialization_list length: {len(specialization_list)}")
#         print(f"Returning total tests: {total_tests}")
#         for spec in specialization_list[:2]:  # Show first 2 for brevity
#             print(
#                 f"Spec: {spec['Specialization_Name']} - Tests: {spec['Total_Test_Count']}"
#             )

#         return JsonResponse(
#             {
#                 "SpecializationCounts": specialization_list,
#                 "TotalCount": len(specialization_list),
#                 "Summary": {
#                     "total_specializations": len(specialization_list),
#                     "total_tests": total_tests,
#                     "total_request": total_request,
#                     "total_paid": total_paid,
#                     "total_due": total_due,
#                     "total_analyzed": total_analyzed,
#                     "total_completed": total_completed,
#                 },
#             },
#             safe=False,
#         )

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def specialization_department_get(request):
    try:
        # Date filters
        DateType = request.GET.get("DateType")
        CurrentDate = request.GET.get("CurrentDate")
        FromDate = request.GET.get("FromDate")
        ToDate = request.GET.get("ToDate")

        # Optional filters
        RegisterType = request.GET.get("RegisterType")
        status = request.GET.get("status")  # Payment status
        Service_Status = request.GET.get("Service_Status")  # Service status - ADD THIS
        Department = request.GET.get("Department")

        # Parse comma-separated values
        register_type_list = RegisterType.split(",") if RegisterType else []
        status_list = status.split(",") if status else []
        service_status_list = Service_Status.split(",") if Service_Status else []  # ADD THIS
        department_list = Department.split(",") if Department else []

        print(f"Debug - Received parameters:")
        print(f"FromDate: {FromDate}, ToDate: {ToDate}")
        print(f"Department: {Department}")
        print(f"RegisterType: {RegisterType}")
        print(f"Status: {status}")
        print(f"Service_Status: {Service_Status}")

        # Date Filter
        date_filter = Q()
        if DateType and DateType.lower() == "current":
            if not CurrentDate:
                return JsonResponse({"error": "CurrentDate is required"}, status=400)
            try:
                current_date = datetime.strptime(CurrentDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date=current_date)
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid CurrentDate format. Use YYYY-MM-DD."}, status=400
                )
        elif FromDate and ToDate:
            try:
                from_date = datetime.strptime(FromDate, "%Y-%m-%d").date()
                to_date = datetime.strptime(ToDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )
        else:
            # If no date filter, get all data for debugging
            print("Debug - No date filter applied, getting all data")

        # Base query - FIXED syntax
        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        
        radiology_requests = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).all()
        
        if date_filter:
            radiology_requests = radiology_requests.filter(date_filter)

        print(
            f"Debug - Total radiology requests after date filter: {radiology_requests.count()}"
        )

        # Apply department filter if provided
        if department_list:
            radiology_requests = radiology_requests.filter(TestCode__in=department_list)
            print(
                f"Debug - Radiology requests after department filter: {radiology_requests.count()}"
            )

        # Apply register type filter
        if register_type_list:
            radiology_requests = radiology_requests.filter(
                RegisterType__in=register_type_list
            )
            print(
                f"Debug - Radiology requests after register type filter: {radiology_requests.count()}"
            )

        # STATUS FILTER (Payment status only: Request, Paid, Due)
        if status_list:
            status_q = Q()
            for s in status_list:
                if s == "All":
                    continue
                elif s == "Request":
                    status_q |= Q(Status="Request")
                elif s == "Paid":
                    status_q |= Q(Status="Paid")
                elif s == "Due":
                    status_q |= Q(Status="Due")
                # Note: "Analyzed" and "Completed" are NOT payment statuses
            if status_q:
                radiology_requests = radiology_requests.filter(status_q)
                print(
                    f"Debug - Radiology requests after status filter: {radiology_requests.count()}"
                )

        # SERVICE STATUS FILTER (Service status: Pending, Analyzed, Completed)
        if service_status_list:
            service_q = Q()
            for s in service_status_list:
                if s == "All":
                    continue
                elif s == "Pending":
                    service_q |= Q(Service_Status="Pending")
                elif s == "Analyzed":
                    service_q |= Q(Service_Status="Analyzed")
                elif s == "Completed":
                    service_q |= Q(Service_Status="Completed")
            if service_q:
                radiology_requests = radiology_requests.filter(service_q)
                print(
                    f"Debug - Radiology requests after service status filter: {radiology_requests.count()}"
                )

        # Import the required models for OP patient appointments
        from OutPatient.models import OP_Patient_Appointment_With_Multiple_Doctor
        from Masters.models import Speciality_Detials

        print(f"Debug - Final radiology requests count: {radiology_requests.count()}")

        # Dictionary to store specialization counts with test details
        specialization_counts = {}
        processed_count = 0
        op_patients_count = 0
        appointments_found_count = 0
        specializations_found_count = 0

        # Process each radiology request
        for request_detail in radiology_requests:
            try:
                processed_count += 1
                if processed_count % 100 == 0:  # Print progress every 100 records
                    print(
                        f"Debug - Processing request {processed_count}: {request_detail.Radiology_RequestId}, Type: {request_detail.RegisterType}"
                    )

                # Get Registration_Id from OP_Register_Id (for OP patients)
                if (
                    request_detail.RegisterType in ["OP", "WALK-IN"]
                    and request_detail.OP_Register_Id
                ):
                    op_patients_count += 1
                    # Use the actual Registration_Id object, not the string value
                    registration_obj = request_detail.OP_Register_Id

                    # Get appointment details to find Specialization_id
                    op_appointments = (
                        OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                            Registration_Id=registration_obj
                        )
                    )

                    appointments_found_count += op_appointments.count()

                    for appointment in op_appointments:
                        if appointment.Specialization:
                            specializations_found_count += 1
                            # appointment.Specialization is the Speciality_Detials object
                            specialization_obj = appointment.Specialization
                            specialization_id = specialization_obj.Speciality_Id
                            specialization_name = specialization_obj.Speciality_Name

                            # Get test and department details
                            test_details = TestName_Details.objects.filter(
                                Test_Code=request_detail.SubTestCode
                            ).first()

                            dept_details = RadiologyNames_Details.objects.filter(
                                Radiology_Id=request_detail.TestCode
                            ).first()

                            test_name = (
                                test_details.Test_Name
                                if test_details
                                else "Unknown Test"
                            )
                            dept_name = (
                                dept_details.Radiology_Name
                                if dept_details
                                else "Unknown Department"
                            )

                            # Initialize specialization if not exists
                            if specialization_name not in specialization_counts:
                                specialization_counts[specialization_name] = {
                                    "Specialization_Id": specialization_id,
                                    "Specialization_Name": specialization_name,
                                    "Total_Test_Count": 0,
                                    "Total_Request_Count": 0,
                                    "Total_Paid_Count": 0,
                                    "Total_Due_Count": 0,
                                    "Total_Analyzed_Count": 0,
                                    "Total_Completed_Count": 0,
                                    "Departments": {},
                                }

                            # Initialize department if not exists
                            if (
                                dept_name
                                not in specialization_counts[specialization_name][
                                    "Departments"
                                ]
                            ):
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name] = {
                                    "Department_Name": dept_name,
                                    "Department_Test_Count": 0,
                                    "Department_Request_Count": 0,
                                    "Department_Paid_Count": 0,
                                    "Department_Due_Count": 0,
                                    "Department_Analyzed_Count": 0,
                                    "Department_Completed_Count": 0,
                                    "Tests": {},
                                }

                            # Initialize test if not exists
                            if (
                                test_name
                                not in specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"]
                            ):
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"][test_name] = {
                                    "Test_Name": test_name,
                                    "Test_Code": request_detail.SubTestCode,
                                    "Test_Count": 0,
                                    "Request_Count": 0,
                                    "Paid_Count": 0,
                                    "Due_Count": 0,
                                    "Analyzed_Count": 0,
                                    "Completed_Count": 0,
                                }

                            # Increment counts at all levels
                            specialization_counts[specialization_name][
                                "Total_Test_Count"
                            ] += 1
                            specialization_counts[specialization_name]["Departments"][
                                dept_name
                            ]["Department_Test_Count"] += 1
                            specialization_counts[specialization_name]["Departments"][
                                dept_name
                            ]["Tests"][test_name]["Test_Count"] += 1

                            # Count by STATUS (payment status) at all levels
                            if request_detail.Status == "Request":
                                specialization_counts[specialization_name][
                                    "Total_Request_Count"
                                ] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Department_Request_Count"] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"][test_name]["Request_Count"] += 1
                            elif request_detail.Status == "Paid":
                                specialization_counts[specialization_name][
                                    "Total_Paid_Count"
                                ] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Department_Paid_Count"] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"][test_name]["Paid_Count"] += 1
                            elif request_detail.Status == "Due":
                                specialization_counts[specialization_name][
                                    "Total_Due_Count"
                                ] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Department_Due_Count"] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"][test_name]["Due_Count"] += 1

                            # Count by SERVICE STATUS at all levels
                            if request_detail.Service_Status == "Analyzed":
                                specialization_counts[specialization_name][
                                    "Total_Analyzed_Count"
                                ] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Department_Analyzed_Count"] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"][test_name]["Analyzed_Count"] += 1
                            elif request_detail.Service_Status == "Completed":
                                specialization_counts[specialization_name][
                                    "Total_Completed_Count"
                                ] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Department_Completed_Count"] += 1
                                specialization_counts[specialization_name][
                                    "Departments"
                                ][dept_name]["Tests"][test_name]["Completed_Count"] += 1

                elif (
                    request_detail.RegisterType == "IP"
                    and request_detail.IP_Register_Id
                ):
                    # For IP patients, you might need to implement similar logic
                    # depending on how IP appointments are structured
                    pass

            except Exception as e:
                print(
                    f"Error processing request {request_detail.Radiology_RequestId}: {e}"
                )
                continue

        print(f"Debug - Processed {processed_count} radiology requests")
        print(f"Debug - OP patients found: {op_patients_count}")
        print(f"Debug - Appointments found: {appointments_found_count}")
        print(f"Debug - Specializations found: {specializations_found_count}")

        # Convert nested dictionaries to lists for better JSON structure
        specialization_list = []
        for spec_name, spec_data in specialization_counts.items():
            departments_list = []
            for dept_name, dept_data in spec_data["Departments"].items():
                tests_list = list(dept_data["Tests"].values())
                # Sort tests by count (descending)
                tests_list.sort(key=lambda x: x["Test_Count"], reverse=True)

                dept_data_clean = {
                    "Department_Name": dept_data["Department_Name"],
                    "Department_Test_Count": dept_data["Department_Test_Count"],
                    "Department_Request_Count": dept_data["Department_Request_Count"],
                    "Department_Paid_Count": dept_data["Department_Paid_Count"],
                    "Department_Due_Count": dept_data["Department_Due_Count"],
                    "Department_Analyzed_Count": dept_data["Department_Analyzed_Count"],
                    "Department_Completed_Count": dept_data[
                        "Department_Completed_Count"
                    ],
                    "Tests": tests_list,
                }
                departments_list.append(dept_data_clean)

            # Sort departments by test count (descending)
            departments_list.sort(
                key=lambda x: x["Department_Test_Count"], reverse=True
            )

            spec_data_clean = {
                "Specialization_Id": spec_data["Specialization_Id"],
                "Specialization_Name": spec_data["Specialization_Name"],
                "Total_Test_Count": spec_data["Total_Test_Count"],
                "Total_Request_Count": spec_data["Total_Request_Count"],
                "Total_Paid_Count": spec_data["Total_Paid_Count"],
                "Total_Due_Count": spec_data["Total_Due_Count"],
                "Total_Analyzed_Count": spec_data["Total_Analyzed_Count"],
                "Total_Completed_Count": spec_data["Total_Completed_Count"],
                "Departments": departments_list,
            }
            specialization_list.append(spec_data_clean)

        # Sort specializations by total test count (descending)
        specialization_list.sort(key=lambda x: x["Total_Test_Count"], reverse=True)

        # Add serial numbers
        for i, item in enumerate(specialization_list, start=1):
            item["Sno"] = i

        # Calculate totals
        total_tests = sum(item["Total_Test_Count"] for item in specialization_list)
        total_request = sum(item["Total_Request_Count"] for item in specialization_list)
        total_paid = sum(item["Total_Paid_Count"] for item in specialization_list)
        total_due = sum(item["Total_Due_Count"] for item in specialization_list)
        total_analyzed = sum(
            item["Total_Analyzed_Count"] for item in specialization_list
        )
        total_completed = sum(
            item["Total_Completed_Count"] for item in specialization_list
        )

        # Debug: Print final results
        print(f"Final specialization_list length: {len(specialization_list)}")
        print(f"Returning total tests: {total_tests}")
        for spec in specialization_list[:5]:  # Show first 5 for brevity
            print(
                f"Spec: {spec['Specialization_Name']} - Tests: {spec['Total_Test_Count']}, Request: {spec['Total_Request_Count']}, Paid: {spec['Total_Paid_Count']}, Due: {spec['Total_Due_Count']}"
            )

        return JsonResponse(
            {
                "SpecializationCounts": specialization_list,
                "TotalCount": len(specialization_list),
                "Summary": {
                    "total_specializations": len(specialization_list),
                    "total_tests": total_tests,
                    "total_request": total_request,
                    "total_paid": total_paid,
                    "total_due": total_due,
                    "total_analyzed": total_analyzed,
                    "total_completed": total_completed,
                },
            },
            safe=False,
        )

    except Exception as e:
        import traceback
        print(f"Error in specialization_department_get: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse({"error": str(e)}, status=500)

