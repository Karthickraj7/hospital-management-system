




























































from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Sum, Count,Q
from django.utils import timezone
from datetime import date, timedelta
from collections import defaultdict


# @csrf_exempt
# @require_http_methods(['GET'])
# def pharmacy_sales_report(request):
#     try:
#         department = request.GET.get("department", "All")  # iPharmacy / oPharmacy / All
#         report_type = request.GET.get("type", "daily")  # daily / weekly / monthly
#         date_str = request.GET.get("date")  # daily
#         start_date = request.GET.get("start_date")  # weekly
#         end_date = request.GET.get("end_date")  # weekly
#         year = request.GET.get("year")  # monthly
#         month = request.GET.get("month")  # monthly
#         item_name_filter = request.GET.get("item_name", "").strip()
#         patient_filter = request.GET.get("patient_name", "").strip()

#         # Convert date strings to datetime.date objects
#         def parse_date(d):
#             if not d:
#                 return None
#             if isinstance(d, date):
#                 return d
#             return datetime.strptime(d, "%Y-%m-%d").date()

#         today = date.today()

#         if report_type == "daily":
#             start = end = parse_date(date_str) or today
#         elif report_type == "weekly":
#             start = parse_date(start_date) or today
#             end = parse_date(end_date) or today
#         elif report_type == "monthly":
#             if year and month:
#                 start = date(int(year), int(month), 1)
#                 if int(month) == 12:
#                     end = date(int(year) + 1, 1, 1) - timedelta(days=1)
#                 else:
#                     end = date(int(year), int(month) + 1, 1) - timedelta(days=1)
#             else:
#                 start = date(today.year, today.month, 1)
#                 end = date(today.year, today.month, 1) + timedelta(days=31)
#         else:
#             start = end = today

#         # Helper to fetch data from billing items
#         def fetch_data(model, dept_label):
#             qs = model.objects.filter(
#                 Billing__Billing_Date__range=[start, end],
#                 Billing__Bill_Status="PAID"
#             ).select_related("Billing__Patient_Id")

#             # Apply filters
#             if item_name_filter:
#                 qs = qs.filter(ItemName__icontains=item_name_filter)
#             if patient_filter:
#                 qs = qs.filter(Billing__Patient_Id__FirstName__icontains=patient_filter)

#             # Group by item
#             items_dict = defaultdict(lambda: {"patients": [], "count": 0, "sales": 0})

#             for row in qs:
#                 item_key = row.ItemName
#                 qty = row.Billing_Quantity
#                 total = row.Total
#                 items_dict[item_key]["count"] += 1
#                 items_dict[item_key]["sales"] += total
#                 items_dict[item_key]["patients"].append({
#                     "patient_name": row.Billing.Patient_Id.FirstName,
#                     "patient_id": row.Billing.Patient_Id.PatientId,
#                     "patient_phone": row.Billing.Patient_Id.PhoneNo,
#                     "qty": qty,
#                     "total": total,
#                     "billing_date": row.Billing.Billing_Date,
#                 })

#             # Convert to list
#             return [
#                 {
#                     "ItemName": item,
#                     "department": dept_label,
#                     "count": data["count"],
#                     "sales": round(data["sales"], 2),
#                     "patients": data["patients"],
#                 }
#                 for item, data in items_dict.items()
#             ]

#         sales_data = []
#         if department in ["All", "iPharmacy"]:
#             sales_data += fetch_data(IP_BillingItem, "iPharmacy")
#         if department in ["All", "oPharmacy"]:
#             sales_data += fetch_data(OP_BillingItem, "oPharmacy")

#         return JsonResponse(sales_data, safe=False)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def pharmacy_sales_report(request):
    try:
        department = request.GET.get("department", "All")  # iPharmacy / oPharmacy / All
        report_type = request.GET.get("type", "daily")  # daily / weekly / monthly
        date_str = request.GET.get("date")  # daily
        start_date = request.GET.get("start_date")  # weekly
        end_date = request.GET.get("end_date")  # weekly
        year = request.GET.get("year")  # monthly
        month = request.GET.get("month")  # monthly
        item_name_filter = request.GET.get("item_name", "").strip()
        patient_filter = request.GET.get("patient_name", "").strip()

        # Convert date strings to datetime.date objects
        def parse_date(d):
            if not d:
                return None
            if isinstance(d, date):
                return d
            return datetime.strptime(d, "%Y-%m-%d").date()

        today = date.today()

        if report_type == "daily":
            start = end = parse_date(date_str) or today
        elif report_type == "weekly":
            start = parse_date(start_date) or today
            end = parse_date(end_date) or today
        elif report_type == "monthly":
            if year and month:
                start = date(int(year), int(month), 1)
                if int(month) == 12:
                    end = date(int(year) + 1, 1, 1) - timedelta(days=1)
                else:
                    end = date(int(year), int(month) + 1, 1) - timedelta(days=1)
            else:
                start = date(today.year, today.month, 1)
                end = date(today.year, today.month, 1) + timedelta(days=31)
        else:
            start = end = today

        # Helper to fetch data from billing items
        def fetch_data(model, dept_label):
            qs = model.objects.filter(
                Billing__Billing_Date__range=[start, end], Billing__Bill_Status="PAID"
            ).select_related("Billing__Patient_Id")

            # Apply filters
            if item_name_filter:
                qs = qs.filter(ItemName__icontains=item_name_filter)
            if patient_filter:
                qs = qs.filter(Billing__Patient_Id__FirstName__icontains=patient_filter)

            # Group by item
            items_dict = defaultdict(lambda: {"patients": [], "count": 0, "sales": 0})

            for row in qs:
                
                item_key = row.ItemName
                qty = row.Billing_Quantity
                total = row.Total
                items_dict[item_key]["count"] += 1
                items_dict[item_key]["sales"] += total
                items_dict[item_key]["patients"].append(
                    {
                       "patient_name": (
    getattr(row.Billing.Patient_Id, 'FirstName', None)
    if getattr(row.Billing, 'Patient_Id', None)
    else None
) or getattr(row.Billing, 'PatientName', None) or getattr(row.Billing, 'Patient_name', ''),

                        "patient_id": (
                            row.Billing.Patient_Id.PatientId
                            if row.Billing.Patient_Id
                            else ""
                        ),
                        "patient_phone": (
                            row.Billing.Patient_Id.PhoneNo
                            if row.Billing.Patient_Id
                            else ""
                        ),
                        "qty": qty,
                        "total": total,
                        "billing_date": row.Billing.Billing_Date,
                    }
                )

            # Convert to list
            return [
                {
                    "ItemName": item,
                    "department": dept_label,
                    "count": data["count"],
                    "sales": round(data["sales"], 2),
                    "patients": data["patients"],
                }
                for item, data in items_dict.items()
            ]

        sales_data = []
        if department in ["All", "iPharmacy"]:
            sales_data += fetch_data(IP_BillingItem, "iPharmacy")
        if department in ["All", "oPharmacy"]:
            sales_data += fetch_data(OP_BillingItem, "oPharmacy")
        if department in ["All", "FOCPharmacy"]:
            sales_data += fetch_data(IP_BillingItem, "FOCPharmacy")

        return JsonResponse(sales_data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)







# @csrf_exempt
# @require_http_methods(['GET'])
# def user_wise_pharmacy_bill_report(request):
#     """
#     Returns per-user bill transactions summary with:
#     - total Paid/Due bills & amounts
#     - detailed list of invoices with status
#     """
#     try:
#         print("ahiiiiiiiiiiiiiiii")
#         department = request.GET.get("department")  # 'iPharmacy', 'oPharmacy', or 'All'
#         user_filter = request.GET.get("user_id")  # optional, or 'All'
#         doc_filter = request.GET.get("doc_Id")  # optional, or 'All'
#         bot_filter = request.GET.get("patient")
#         podu_filter = request.GET.get("prod")
#         print(doc_filter)
#         # Filter by date range
#         start_date = request.GET.get("start_date")
#         end_date = request.GET.get("end_date")
#         today = timezone.now().date()
#         if start_date and end_date:
#             start = datetime.strptime(start_date, "%Y-%m-%d").date()
#             end = datetime.strptime(end_date, "%Y-%m-%d").date()
#         else:
#             start = datetime(2000, 1, 1).date()
#             end = today

#         def fetch_summary(model, dept_label, doc, bot, produ):
#             print("filter DOc",doc)
#             filter = Q()
#             if dept_label == "focPharmacy":
#                 filter = Q(Billing_Type="FREE PHARMACY")
#             if doc and doc != "all":
#                 print("filter DOc")
#                 filter &= Q(Doctor_Id__Doctor_ID=doc)
#             if bot and bot!= "":
#                 patient_filter = (
#                     Q(Patient_Id__PatientId__icontains=bot) |
#                     Q(Patient_Id__FirstName__icontains=bot) |
#                     Q(Patient_Id__PhoneNo__icontains=bot)
#                 )
#                 filter &= patient_filter
            

#             if produ and produ !="":
#                 idata= []
#                 if dept_label in [None, "", "All", "iPharmacy","focPharmacy"]:
#                     prod_data = list(IP_BillingItem.objects.filter(ItemName__icontains=produ).values_list("Billing__Billing_Invoice_No", flat=True)) 
#                     prod_qty = list(IP_BillingItem.objects.filter(ItemName__icontains=produ).values_list("Billing_Quantity", flat=True)) 
#                     prod_count_ip = sum(qty or 0 for qty in prod_qty) 
#                     idata.extend(prod_data)
#                 if dept_label in [None, "", "All", "oPharmacy"]:
#                     prod_data = list(OP_BillingItem.objects.filter(ItemName__icontains=produ).values_list("Billing__Billing_Invoice_No", flat=True)) 
#                     prod_qty = list(OP_BillingItem.objects.filter(ItemName__icontains=produ).values_list("Billing_Quantity", flat=True)) 
#                     prod_count_op = sum(qty or 0 for qty in prod_qty)
#                     idata.extend(prod_data)

#                 if len(idata) > 0:
#                     filter &=Q(Billing_Invoice_No__in=idata)

#             qs = model.objects.filter(Q(Billing_Date__range=[start, end]), filter)
#             if user_filter and user_filter != "All":
#                 qs = qs.filter(created_by=user_filter)

#             # Organize bills by user
#             user_details = defaultdict(list)
#             for bill in qs.order_by("Billing_Date"):
#                 try:
#                     register = bill.Register_Id
#                 except:
#                     register = None

#                 print(register,'registerttttttttttttt')

#                 # print("Register-------",bill)
#                 user_details[bill.created_by].append({
#                     "Billing_Invoice_No": bill.Billing_Invoice_No,
#                     "PatientId": bill.Patient_Id.PatientId ,
#                     "PatientName": bill.Patient_Id.FirstName,
#                     "PhoneNo": bill.Patient_Id.PhoneNo,
#                     "PatientCate": register.PatientCategory if register else "General",
#                     'Categoryname': f"""{register.PatientCategory if register else ''} {register.InsuranceName.Insurance_Name if register and register.PatientCategory == 'Insurance' and register.InsuranceName else ''}""",
#                     "Billing_Date": bill.Billing_Date.strftime("%d-%m-%y"),
#                     "Bill_Status": "Credit" if register and register.PatientCategory == 'Insurance' else bill.Bill_Status,
#                     "Paid_Amount": float(bill.Total_Amount or 0),
#                     "Total_Amount": float(bill.Total_Amount or 0),
#                     "Doctor": "Dr." + bill.Doctor_Id.First_Name + " " + bill.Doctor_Id.Last_Name if bill.Doctor_Id else "Self",
#                     "DoctorId": bill.Doctor_Id.Doctor_ID if bill.Doctor_Id else None,
#                     "Speciality": Doctor_ProfessForm_Detials.objects.get(Doctor_ID=bill.Doctor_Id.Doctor_ID).Specialization.Speciality_Name  if bill.Doctor_Id else None,
#                 })


#             # Aggregate per user by status
#             result = []
#             for user, bills in user_details.items():
#                 summary = defaultdict(lambda: {"total_bills": 0, "total_amount": 0})
#                 for b in bills:
#                     status = b["Bill_Status"]
#                     summary[status]["total_bills"] += 1
#                     summary[status]["total_amount"] += b["Paid_Amount"]

#                 result.append({
#                     "prod_Count": '',
#                     "user": user,
#                     "department": "FOC Pharmacy" if dept_label == "focPharmacy" else (
#                         "IP Pharmacy" if dept_label == "iPharmacy" else "OP Pharmacy"),    
#                     "summary": {
#                     "Paid": summary.get("Paid", {"total_bills": 0, "total_amount": 0}),
#                     "Due": summary.get("Due", {"total_bills": 0, "total_amount": 0})
#                     },
#                     "bills": bills
#                 })
#             return result

#         report = []
#         if department in [None, "", "All", "iPharmacy","focPharmacy"]:
#             from .models import IP_Pharmacy_Billing_Table_Detials
#             report += fetch_summary(IP_Pharmacy_Billing_Table_Detials, department, doc_filter, bot_filter,podu_filter)
#         if department in [None, "", "All", "oPharmacy"]:
#             from .models import OP_Pharmacy_Billing_Table_Detials
#             report += fetch_summary(OP_Pharmacy_Billing_Table_Detials, "oPharmacy", doc_filter, bot_filter, podu_filter)

#         # Merge users if department = All
#         if department in ["All", None, ""]:
#             merged = defaultdict(lambda: {"summary": {"Paid": {"total_bills":0,"total_amount":0},"Due": {"total_bills":0,"total_amount":0}}, "bills":[]})
#             for row in report:
#                 user = row["user"]
#                 for status in ["Paid","Due"]:
#                     merged[user]["summary"][status]["total_bills"] += row["summary"][status]["total_bills"]
#                     merged[user]["summary"][status]["total_amount"] += row["summary"][status]["total_amount"]
#                 merged[user]["bills"] += row["bills"]

#             final_report = []
#             for user, data in merged.items():
#                 # Round amounts
#                 for status in ["Paid","Due"]:
#                     data["summary"][status]["total_amount"] = round(data["summary"][status]["total_amount"],2)
#                 final_report.append({
#                     "user": user,
#                     "department": "All",
#                     "summary": data["summary"],
#                     "bills": data["bills"]
#                 })
#             return JsonResponse(final_report, safe=False)
#         return JsonResponse(report, safe=False)

#     except Exception as e:
#         print("Error:",str(e))
#         return JsonResponse({"error": str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(["GET"])
def user_wise_pharmacy_bill_report(request):
    """
    Returns per-user bill transactions summary with:
    - total Paid/Due bills & amounts
    - detailed list of invoices with status
    """

    def get_doctor_speciality(doctor):
        """Helper function to safely get doctor's speciality"""
        if not doctor:
            return None
        try:
            doctor_detail = Doctor_ProfessForm_Detials.objects.filter(
                Doctor_ID=doctor.Doctor_ID
            ).first()
            if doctor_detail and doctor_detail.Specialization:
                return doctor_detail.Specialization.Speciality_Name
            return None
        except Exception:
            return None

    try:
        print("ahiiiiiiiiiiiiiiii")
        department = request.GET.get("department")  # 'iPharmacy', 'oPharmacy', or 'All'
        user_filter = request.GET.get("user_id")  # optional, or 'All'
        doc_filter = request.GET.get("doc_Id")  # optional, or 'All'
        bot_filter = request.GET.get("patient")
        podu_filter = request.GET.get("prod")
        print(doc_filter)
        # Filter by date range
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        today = timezone.now().date()
        if start_date and end_date:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
        else:
            start = datetime(2000, 1, 1).date()
            end = today

        def fetch_summary(model, dept_label, doc, bot, produ):
            print("filter DOc", doc)
            filter = Q()
            if dept_label == "focPharmacy":
                filter = Q(Billing_Type="FREE PHARMACY")
            if doc and doc != "all":
                print("filter DOc")
                filter &= Q(Doctor_Id__Doctor_ID=doc)
            if bot and bot != "":
                patient_filter = (
                    Q(Patient_Id__PatientId__icontains=bot)
                    | Q(Patient_Id__FirstName__icontains=bot)
                    | Q(Patient_Id__PhoneNo__icontains=bot)
                )
                filter &= patient_filter

            if produ and produ != "":
                idata = []
                if dept_label in [None, "", "All", "iPharmacy", "focPharmacy"]:
                    prod_data = list(
                        IP_BillingItem.objects.filter(
                            ItemName__icontains=produ
                        ).values_list("Billing__Billing_Invoice_No", flat=True)
                    )
                    prod_qty = list(
                        IP_BillingItem.objects.filter(
                            ItemName__icontains=produ
                        ).values_list("Billing_Quantity", flat=True)
                    )
                    prod_count_ip = sum(qty or 0 for qty in prod_qty)
                    idata.extend(prod_data)
                if dept_label in [None, "", "All", "oPharmacy"]:
                    prod_data = list(
                        OP_BillingItem.objects.filter(
                            ItemName__icontains=produ
                        ).values_list("Billing__Billing_Invoice_No", flat=True)
                    )
                    prod_qty = list(
                        OP_BillingItem.objects.filter(
                            ItemName__icontains=produ
                        ).values_list("Billing_Quantity", flat=True)
                    )
                    prod_count_op = sum(qty or 0 for qty in prod_qty)
                    idata.extend(prod_data)

                if len(idata) > 0:
                    filter &= Q(Billing_Invoice_No__in=idata)

            qs = model.objects.filter(Q(Billing_Date__range=[start, end]), filter)
            if user_filter and user_filter != "All":
                qs = qs.filter(created_by=user_filter)

            # Organize bills by user
            user_details = defaultdict(list)
            for bill in qs.order_by("Billing_Date"):
                try:
                    register = bill.Register_Id
                except:
                    register = None

                print(register, "registerttttttttttttt")

                # print("Register-------",bill)
                user_details[bill.created_by].append(
                    {
                        "Billing_Invoice_No": bill.Billing_Invoice_No,
                        "PatientId": (
                            bill.Patient_Id.PatientId if bill.Patient_Id else None
                        ),
                        "patient_name": (
    getattr(bill.Patient_Id, 'FirstName', None)
    if getattr(bill, 'Patient_Id', None)
    else None
) or getattr(bill, 'PatientName', None) or getattr(bill, 'Patient_name', '')
,
                        "PhoneNo": bill.Patient_Id.PhoneNo if bill.Patient_Id else None,
                        "PatientCate": (
                            register.PatientCategory if register else "General"
                        ),
                        "Categoryname": f"""{register.PatientCategory if register else ''} {register.InsuranceName.Insurance_Name if register and register.PatientCategory == 'Insurance' and register.InsuranceName else ''}""",
                        "Billing_Date": bill.Billing_Date.strftime("%d-%m-%y"),
                        "Bill_Status": (
                            "Credit"
                            if register and register.PatientCategory == "Insurance"
                            else bill.Bill_Status
                        ),
                        "Paid_Amount": float(bill.Total_Amount or 0),
                        "Total_Amount": float(bill.Total_Amount or 0),
                        "Doctor": (
                            "Dr."
                            + bill.Doctor_Id.First_Name
                            + " "
                            + bill.Doctor_Id.Last_Name
                            if bill.Doctor_Id
                            else "Self"
                        ),
                        "DoctorId": (
                            bill.Doctor_Id.Doctor_ID if bill.Doctor_Id else None
                        ),
                        "Speciality": get_doctor_speciality(bill.Doctor_Id),
                    }
                )

            # Aggregate per user by status
            result = []
            for user, bills in user_details.items():
                summary = defaultdict(lambda: {"total_bills": 0, "total_amount": 0})
                for b in bills:
                    status = b["Bill_Status"]
                    summary[status]["total_bills"] += 1
                    summary[status]["total_amount"] += b["Paid_Amount"]

                result.append(
                    {
                        "prod_Count": "",
                        "user": user,
                        "department": (
                            "FOC Pharmacy"
                            if dept_label == "focPharmacy"
                            else (
                                "IP Pharmacy"
                                if dept_label == "iPharmacy"
                                else "OP Pharmacy"
                            )
                        ),
                        "summary": {
                            "Paid": summary.get(
                                "Paid", {"total_bills": 0, "total_amount": 0}
                            ),
                            "Due": summary.get(
                                "Due", {"total_bills": 0, "total_amount": 0}
                            ),
                        },
                        "bills": bills,
                    }
                )
            return result

        report = []
        if department in [None, "", "All", "iPharmacy", "focPharmacy"]:
            from .models import IP_Pharmacy_Billing_Table_Detials

            report += fetch_summary(
                IP_Pharmacy_Billing_Table_Detials,
                department,
                doc_filter,
                bot_filter,
                podu_filter,
            )
        if department in [None, "", "All", "oPharmacy"]:
            from .models import OP_Pharmacy_Billing_Table_Detials

            report += fetch_summary(
                OP_Pharmacy_Billing_Table_Detials,
                "oPharmacy",
                doc_filter,
                bot_filter,
                podu_filter,
            )

        # Merge users if department = All
        if department in ["All", None, ""]:
            merged = defaultdict(
                lambda: {
                    "summary": {
                        "Paid": {"total_bills": 0, "total_amount": 0},
                        "Due": {"total_bills": 0, "total_amount": 0},
                    },
                    "bills": [],
                }
            )
            for row in report:
                user = row["user"]
                for status in ["Paid", "Due"]:
                    merged[user]["summary"][status]["total_bills"] += row["summary"][
                        status
                    ]["total_bills"]
                    merged[user]["summary"][status]["total_amount"] += row["summary"][
                        status
                    ]["total_amount"]
                merged[user]["bills"] += row["bills"]

            final_report = []
            for user, data in merged.items():
                # Round amounts
                for status in ["Paid", "Due"]:
                    data["summary"][status]["total_amount"] = round(
                        data["summary"][status]["total_amount"], 2
                    )
                final_report.append(
                    {
                        "user": user,
                        "department": "All",
                        "summary": data["summary"],
                        "bills": data["bills"],
                    }
                )
            return JsonResponse(final_report, safe=False)
        return JsonResponse(report, safe=False)

    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({"error": str(e)}, status=500)


from datetime import datetime, time


# @csrf_exempt
# @require_http_methods(["GET"])
# def shift_closing_report(request):
#     """
#     Shift-wise pharmacy billing summary with user info.
#     Shifts:
#       - Morning: 08:00 - 17:00
#       - Night: 17:00 - 20:00
#     """
#     try:
#         department = request.GET.get("department", "All")  # iPharmacy / oPharmacy / All
#         status_filter = request.GET.get("status", "All")   # Paid / Due / All
#         shift_param = request.GET.get("shift", "All")      # Morning / Night / All
#         start_date = request.GET.get("start_date")
#         end_date = request.GET.get("end_date")
#         today = timezone.now().date()

#         # Date range
#         if start_date and end_date:
#             start = datetime.strptime(start_date, "%Y-%m-%d").date()
#             end = datetime.strptime(end_date, "%Y-%m-%d").date()
#         else:
#             start = datetime(2000, 1, 1).date()
#             end = today

#         # Define shifts
#         shifts = {
#             "Morning": (time(8, 0), time(17, 0)),
#             "Night": (time(17, 0), time(20, 0)),
#         }

#         # Function to fetch shift summary for a model
#         def fetch_shift_summary(model, dept_label):
#             qs = model.objects.filter(Billing_Date__range=[start, end])
#             if status_filter != "All":
#                 qs = qs.filter(Bill_Status=status_filter)

#             shift_summary = defaultdict(list)
#             for bill in qs:
#                 # Ensure datetime is aware
#                 bill_time = bill.created_at
#                 if timezone.is_naive(bill_time):
#                     bill_time = timezone.make_aware(bill_time)
#                 bill_time = bill_time.time()

#                 for shift_name, (start_time, end_time) in shifts.items():
#                     if start_time <= bill_time <= end_time:
#                         shift_summary[shift_name].append({
#                             "user": str(bill.created_by),
#                             "department": dept_label,
#                             "Billing_Invoice_No": bill.Billing_Invoice_No,
#                             "Billing_Date": bill.Billing_Date.strftime("%Y-%m-%d"),
#                             "Bill_Status": bill.Bill_Status,
#                             "Paid_Amount": float(bill.Paid_Amount or 0)
#                         })
#                         break

#             # Summarize per shift
#             result = []
#             for shift_name, bills in shift_summary.items():
#                 if shift_param != "All" and shift_name != shift_param:
#                     continue  # apply shift filter
#                 total_bills = len(bills)
#                 total_amount = sum(b["Paid_Amount"] for b in bills)
#                 result.append({
#                     "shift": shift_name,
#                     "department": dept_label,
#                     "total_bills": total_bills,
#                     "total_amount": round(total_amount, 2),
#                     "bills": bills
#                 })
#             return result

#         report = []

#         if department in ["All", "iPharmacy"]:
#             from .models import IP_Pharmacy_Billing_Table_Detials
#             report += fetch_shift_summary(IP_Pharmacy_Billing_Table_Detials, "iPharmacy")
#         if department in ["All", "oPharmacy"]:
#             from .models import OP_Pharmacy_Billing_Table_Detials
#             report += fetch_shift_summary(OP_Pharmacy_Billing_Table_Detials, "oPharmacy")

#         # Merge shifts if department = All
#         if department == "All":
#             merged = defaultdict(lambda: {"total_bills": 0, "total_amount": 0, "bills": []})
#             for row in report:
#                 key = row["shift"]
#                 merged[key]["total_bills"] += row["total_bills"]
#                 merged[key]["total_amount"] += row["total_amount"]
#                 merged[key]["bills"] += row["bills"]

#             final_report = []
#             for shift_name, data in merged.items():
#                 if shift_param != "All" and shift_name != shift_param:
#                     continue
#                 final_report.append({
#                     "department": "All",
#                     "shift": shift_name,
#                     "total_bills": data["total_bills"],
#                     "total_amount": round(data["total_amount"], 2),
#                     "bills": data["bills"]
#                 })
#             return JsonResponse(final_report, safe=False)

#         return JsonResponse(report, safe=False)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["GET"])
def shift_closing_report(request):
    """
    Shift-wise pharmacy billing summary with user info.
    Shifts:
      - Morning: 08:00 - 17:00
      - Night: 17:00 - 20:00
    Supports department filter:
      - iPharmacy / oPharmacy / focPharmacy / All
    """
    try:
        department = request.GET.get(
            "department", "All"
        )  # iPharmacy / oPharmacy / focPharmacy / All
        status_filter = request.GET.get("status", "All")  # Paid / Due / All
        shift_param = request.GET.get("shift", "All")  # Morning / Night / All
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        today = timezone.now().date()

        # --- Date range ---
        if start_date and end_date:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
        else:
            start = datetime(2000, 1, 1).date()
            end = today

        # --- Shifts ---
        shifts = {
            "Morning": (time(8, 0), time(17, 0)),
            "Night": (time(17, 0), time(20, 0)),
        }

        # --- Reusable summary function ---
        def fetch_shift_summary(qs, dept_label):
            shift_summary = defaultdict(list)
            for bill in qs:
                bill_time = bill.created_at
                if timezone.is_naive(bill_time):
                    bill_time = timezone.make_aware(bill_time)
                bill_time = bill_time.time()

                for shift_name, (start_time, end_time) in shifts.items():
                    if start_time <= bill_time <= end_time:
                        shift_summary[shift_name].append(
                            {
                                "user": str(bill.created_by),
                                "department": dept_label,
                                "Billing_Invoice_No": bill.Billing_Invoice_No,
                                "Billing_Date": bill.Billing_Date.strftime("%Y-%m-%d"),
                                "Bill_Status": bill.Bill_Status,
                                "Paid_Amount": float(bill.Paid_Amount or 0),
                            }
                        )
                        break

            result = []
            for shift_name, bills in shift_summary.items():
                if shift_param != "All" and shift_name != shift_param:
                    continue
                total_bills = len(bills)
                total_amount = sum(b["Paid_Amount"] for b in bills)
                result.append(
                    {
                        "shift": shift_name,
                        "department": dept_label,
                        "total_bills": total_bills,
                        "total_amount": round(total_amount, 2),
                        "bills": bills,
                    }
                )
            return result

        # --- Main report list ---
        report = []

        # ✅ iPharmacy
        if department in ["All", "iPharmacy"]:
            from .models import IP_Pharmacy_Billing_Table_Detials

            qs = IP_Pharmacy_Billing_Table_Detials.objects.filter(
                Billing_Date__range=[start, end]
            )
            if status_filter != "All":
                qs = qs.filter(Bill_Status=status_filter)

            report += fetch_shift_summary(qs, "iPharmacy")

        # ✅ oPharmacy
        if department in ["All", "oPharmacy"]:
            from .models import OP_Pharmacy_Billing_Table_Detials

            qs = OP_Pharmacy_Billing_Table_Detials.objects.filter(
                Billing_Date__range=[start, end]
            )
            if status_filter != "All":
                qs = qs.filter(Bill_Status=status_filter)

            report += fetch_shift_summary(qs, "oPharmacy")

        # ✅ focPharmacy (Free of Cost)
        if department in ["All", "focPharmacy"]:
            from .models import IP_Pharmacy_Billing_Table_Detials

            qs = IP_Pharmacy_Billing_Table_Detials.objects.filter(
                Billing_Type="FREE PHARMACY",
                Billing_Date__range=[start, end],
            )
            if status_filter != "All":
                qs = qs.filter(Bill_Status=status_filter)

            report += fetch_shift_summary(qs, "focPharmacy")

        # ✅ Merge shifts when department = All
        if department == "All":
            merged = defaultdict(
                lambda: {"total_bills": 0, "total_amount": 0, "bills": []}
            )
            for row in report:
                key = row["shift"]
                merged[key]["total_bills"] += row["total_bills"]
                merged[key]["total_amount"] += row["total_amount"]
                merged[key]["bills"] += row["bills"]

            final_report = []
            for shift_name, data in merged.items():
                if shift_param != "All" and shift_name != shift_param:
                    continue
                final_report.append(
                    {
                        "department": "All",
                        "shift": shift_name,
                        "total_bills": data["total_bills"],
                        "total_amount": round(data["total_amount"], 2),
                        "bills": data["bills"],
                    }
                )
            return JsonResponse(final_report, safe=False)

        return JsonResponse(report, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




from collections import defaultdict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from datetime import datetime
from django.db.models import Q
from collections import defaultdict
from collections import defaultdict
from collections import defaultdict
from datetime import datetime
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from collections import defaultdict
from datetime import datetime
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone

@csrf_exempt
@require_http_methods(['GET'])
def get_refunded_pharmacy_bills(request):
    try:
        department = request.GET.get("department")  # "oPharmacy", "iPharmacy", "All" or None
        user_filter = request.GET.get("user_id")
        patient_filter = request.GET.get("patient")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        today = timezone.now().date()

        if start_date and end_date:
            start = datetime.strptime(start_date, "%Y-%m-%d").date()
            end = datetime.strptime(end_date, "%Y-%m-%d").date()
        else:
            start = datetime(2000, 1, 1).date()
            end = today

        user_dict = defaultdict(lambda: {
            "prod_Count": "",
            "user": "",
            "department": "",
            "bills": [],
            "total_paid": 0,
            "total_amount": 0
        })

        # ----------------------
        # iPharmacy Refunds
        # ----------------------
        if department in ["iPharmacy", "All", None] :
            qs_ip_refund = IPPharmacyBillingRefundReceipt.objects.filter(Billing_Date__range=[start, end])
         
            if patient_filter:
                qs_ip_refund = qs_ip_refund.filter(
                    Q(PatientID__icontains=patient_filter) |
                    Q(Patient_Name__icontains=patient_filter) |
                    Q(PhoneNumber__icontains=patient_filter)
                )
            if user_filter and user_filter != "All":
                qs_ip_refund = qs_ip_refund.filter(Billedby=user_filter)

            for refund in qs_ip_refund.order_by("Billing_Date"):
                user = refund.Billedby or "Self"
                user_dict[user]["user"] = user
                user_dict[user]["department"] = "IP Pharmacy"

                paid_amount = float(refund.TotalPaidAmount or 0)
                total_amount = float(refund.TotalAmount or 0)

                # Handle Invoice Number properly
                invoice_no = ""
                doctor_name = "Self"
                doctor_id = None
                speciality_name = ""

                if refund.BillInvoice_NO:
                    invoice_no = refund.BillInvoice_NO.Billing_Invoice_No or ""
                    doctor = refund.BillInvoice_NO.Doctor_Id
                    if doctor:
                        doctor_name = doctor.First_Name or "Self"
                        doctor_id = doctor.Doctor_ID
                        if hasattr(doctor, "Specialization") and doctor.Specialization:
                            speciality_name = getattr(doctor.Specialization, "Speciality_Name", "")

                user_dict[user]["bills"].append({
                    "Billing_Invoice_No": invoice_no,
                    "PatientId": refund.PatientID,
                    "PatientName": refund.Patient_Name,
                    "PhoneNo": refund.PhoneNumber,
                    "PatientCate": "Refunded",
                    "Categoryname": "Refunded",
                    "Billing_Date": refund.Billing_Date.strftime("%d-%m-%y"),
                    "Bill_Status": "Refunded",
                    "Paid_Amount": paid_amount,
                    "Total_Amount": total_amount,
                    "Doctor": doctor_name,
                    "DoctorId": doctor_id,
                    "Speciality": speciality_name,
                })

                user_dict[user]["total_paid"] += paid_amount
                user_dict[user]["total_amount"] += total_amount


        if department in ['focPharmacy', "All", None] :
            qs_ip_refund = IPPharmacyBillingRefundReceipt.objects.filter(Billing_Date__range=[start, end],BillInvoice_NO__Billing_Type='FREE PHARMACY')
         
            if patient_filter:
                qs_ip_refund = qs_ip_refund.filter(
                    Q(PatientID__icontains=patient_filter) |
                    Q(Patient_Name__icontains=patient_filter) |
                    Q(PhoneNumber__icontains=patient_filter)
                )
            if user_filter and user_filter != "All":
                qs_ip_refund = qs_ip_refund.filter(Billedby=user_filter)

            for refund in qs_ip_refund.order_by("Billing_Date"):
                user = refund.Billedby or "Self"
                user_dict[user]["user"] = user
                user_dict[user]["department"] = "Foc Pharmacy"

                paid_amount = float(refund.TotalPaidAmount or 0)
                total_amount = float(refund.TotalAmount or 0)

                # Handle Invoice Number properly
                invoice_no = ""
                doctor_name = "Self"
                doctor_id = None
                speciality_name = ""

                if refund.BillInvoice_NO:
                    invoice_no = refund.BillInvoice_NO.Billing_Invoice_No or ""
                    doctor = refund.BillInvoice_NO.Doctor_Id
                    if doctor:
                        doctor_name = doctor.First_Name or "Self"
                        doctor_id = doctor.Doctor_ID
                        if hasattr(doctor, "Specialization") and doctor.Specialization:
                            speciality_name = getattr(doctor.Specialization, "Speciality_Name", "")

                user_dict[user]["bills"].append({
                    "Billing_Invoice_No": invoice_no,
                    "PatientId": refund.PatientID,
                    "PatientName": refund.Patient_Name,
                    "PhoneNo": refund.PhoneNumber,
                    "PatientCate": "Refunded",
                    "Categoryname": "Refunded",
                    "Billing_Date": refund.Billing_Date.strftime("%d-%m-%y"),
                    "Bill_Status": "Refunded",
                    "Paid_Amount": paid_amount,
                    "Total_Amount": total_amount,
                    "Doctor": doctor_name,
                    "DoctorId": doctor_id,
                    "Speciality": speciality_name,
                })

                user_dict[user]["total_paid"] += paid_amount
                user_dict[user]["total_amount"] += total_amount

        # ----------------------
        # oPharmacy Refunds
        # ----------------------
        if department in ["oPharmacy", "All", None]:
            qs_op = OP_Pharmacy_Billing_Table_Detials.objects.filter(Billing_Date__range=[start, end])
            if patient_filter:
                qs_op = qs_op.filter(
                    Q(Patient_Id__FirstName__icontains=patient_filter) |
                    Q(Patient_Id__PatientId__icontains=patient_filter) |
                    Q(Patient_Id__PhoneNo__icontains=patient_filter)
                )
            if user_filter and user_filter != "All":
                qs_op = qs_op.filter(created_by=user_filter)

            for bill in qs_op.order_by("Billing_Date"):
                user = bill.created_by or "Self"
                user_dict[user]["user"] = user
                user_dict[user]["department"] = "OP Pharmacy"

                paid_amount = float(bill.Paid_Amount or 0)
                total_amount = float(bill.Net_Amount or 0)

                doc = None
                doctor_name = "Self"
                doctor_id = None
                speciality_name = ""

                if bill.Doctor_Id:
                    doc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=bill.Doctor_Id.Doctor_ID).first()
                    if doc:
                        doctor_name = doc.Doctor_ID.First_Name or "Self"
                        doctor_id = doc.Doctor_ID.Doctor_ID
                        if hasattr(doc, "Specialization") and doc.Specialization:
                            speciality_name = getattr(doc.Specialization, "Speciality_Name", "")

                user_dict[user]["bills"].append({
                    "Billing_Invoice_No": bill.Billing_Invoice_No,
                    "PatientId": bill.Patient_Id.PatientId,
                    "PatientName": bill.Patient_Id.FirstName,
                    "PhoneNo": bill.Patient_Id.PhoneNo,
                    "PatientCate": "Refunded",
                    "Categoryname": "Refunded",
                    "Billing_Date": bill.Billing_Date.strftime("%d-%m-%y"),
                    "Bill_Status": "Refunded",
                    "Paid_Amount": paid_amount,
                    "Total_Amount": total_amount,
                    "Doctor": doctor_name,
                    "DoctorId": doctor_id,
                    "Speciality": speciality_name,
                })

                user_dict[user]["total_paid"] += paid_amount
                user_dict[user]["total_amount"] += total_amount

        # ----------------------
        # Build final result with summary
        # ----------------------
        final_result = []
        for user, data in user_dict.items():
            total_paid = data["total_paid"]
            total_amount = data["total_amount"]
            data["summary"] = {
                "Paid": {
                    "total_bills": len(data["bills"]),
                    "total_amount": round(total_paid, 2)
                },
                "Due": {
                    "total_bills": 0,
                    "total_amount": 0
                }
            }
            data["total_paid"] = round(total_paid, 2)
            data["total_amount"] = round(total_amount, 2)
            final_result.append(data)

        return JsonResponse(final_result, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import AdvanceOptical
from Frontoffice.models import Patient_Detials

@csrf_exempt
@require_http_methods(["POST"])
def create_advance_optical(request):
    try:
        data = json.loads(request.body)

        patient = None
        if data.get("Patient_Id"):
            patient = Patient_Detials.objects.get(pk=data["Patient_Id"])

        obj = AdvanceOptical.objects.create(
            Patient_Name=data.get("Patient_Name"),
            Patient_Phone_No=data.get("Patient_Phone_No"),
            Patient_Phone_age=data.get("Patient_Phone_age"),
            Patient_Id=patient,
            Advance_Amount=data["Advance_Amount"],
            Advance_Status=data.get("Advance_Status", "Hold"),
            Status=data.get("Status", True)
        )

        return JsonResponse({
            "message": "Advance created",
            "Advance_Id": obj.Advance_Id
        }, status=201)

    except Patient_Detials.DoesNotExist:
        return JsonResponse({"error": "Invalid Patient"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_advance_optical(request):
    try:
        advances = AdvanceOptical.objects.filter(Status=True)

        data = []
        for adv in advances:
            data.append({
                "Advance_Id": adv.Advance_Id,
                "Patient_Name": adv.Patient_Name,
                "Patient_Phone_No": adv.Patient_Phone_No,
                "Patient_Phone_age": adv.Patient_Phone_age,
                "Patient_Id": adv.Patient_Id_id,
                "Advance_Amount": float(adv.Advance_Amount),
                "Status": adv.Status,
                "Advance_Status": adv.Advance_Status,
            })

        return JsonResponse({"data": data}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def get_single_advance_optical(request, advance_id):
    try:
        adv = AdvanceOptical.objects.get(pk=advance_id)

        data = {
            "Advance_Id": adv.Advance_Id,
            "Patient_Name": adv.Patient_Name,
            "Patient_Phone_No": adv.Patient_Phone_No,
            "Patient_Phone_age": adv.Patient_Phone_age,
            "Patient_Id": adv.Patient_Id_id,
            "Advance_Amount": float(adv.Advance_Amount),
            "Status": adv.Status,
            "Advance_Status": adv.Advance_Status,
        }

        return JsonResponse(data)

    except AdvanceOptical.DoesNotExist:
        return JsonResponse({"error": "Advance not found"}, status=404)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def update_advance_optical(request, advance_id):
    try:
        data = json.loads(request.body)
        adv = AdvanceOptical.objects.get(pk=advance_id)

        if "Patient_Name" in data:
            adv.Patient_Name = data["Patient_Name"]

        if "Patient_Phone_No" in data:
            adv.Patient_Phone_No = data["Patient_Phone_No"]

        if "Patient_Phone_age" in data:
            adv.Patient_Phone_age = data["Patient_Phone_age"]

        if "Advance_Amount" in data:
            adv.Advance_Amount = data["Advance_Amount"]

        if "Advance_Status" in data:
            adv.Advance_Status = data["Advance_Status"]

        if "Status" in data:
            adv.Status = data["Status"]

        if "Patient_Id" in data:
            adv.Patient_Id = Patient_Detials.objects.get(pk=data["Patient_Id"])

        adv.save()

        return JsonResponse({"message": "Advance updated successfully"})

    except AdvanceOptical.DoesNotExist:
        return JsonResponse({"error": "Advance not found"}, status=404)

    except Patient_Detials.DoesNotExist:
        return JsonResponse({"error": "Invalid Patient_Id"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def search_patient(request):
    query = request.GET.get('q', '').strip()

    if not query:
        return JsonResponse({"data": []})

    patients = Patient_Detials.objects.filter(
        Q(PatientId__icontains=query) |
        Q(FirstName__icontains=query) |
        Q(PhoneNo__icontains=query)
    )[:10]

    data = [{
        "PatientId": p.PatientId,
        "Name": f"{p.FirstName or ''} {p.SurName or ''}".strip(),
        "Phone": p.PhoneNo,
        "Age": p.Age
    } for p in patients]

    return JsonResponse({"data": data})
