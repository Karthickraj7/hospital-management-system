from django.shortcuts import render
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http.response import JsonResponse
import json
import pandas as pd
# Create your views here.

@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def minmax_nursestation_api(request):
    try:
        if request.method == "GET":
            # Optional filters: NurseStation or Prod_Stock
            nurse_station_id = request.GET.get("NurseStation")
            prod_stock_id = request.GET.get("Prod_Stock")

            queryset = MinMaxForNurseStation.objects.all()
            if nurse_station_id:
                queryset = queryset.filter(NurseStation_id=nurse_station_id)
            if prod_stock_id:
                queryset = queryset.filter(Prod_Stock_id=prod_stock_id)

            data = []
            for obj in queryset:
                data.append({
                    "id": obj.id,
                    "NurseStation": obj.NurseStation.NurseStationName,
                    "Prod_Stock": obj.Prod_Stock.Product_Detials.ItemName,
                    "Min_Qty": obj.Min_Qty,
                    "Max_Qty": obj.Max_Qty,
                    "created_by": obj.created_by,
                    "Created_at": obj.Created_at,
                    "Updated_at": obj.Updated_at
                })
            return JsonResponse({"data": data})

        elif request.method == "POST":
          try:
            data = json.loads(request.body)
            nurse_station_id = data.get("NurseStation")
            prod_stock_id = data.get("Prod_Stock",0)
            min_qty = int(data.get("Min_Qty", 0))
            max_qty = int(data.get("Max_Qty", 0))
            created_by = data.get("created_by", "")

            
            

            nurse_station = NurseStationMaster.objects.filter(NurseStationName=nurse_station_id).first()
            if not nurse_station:
                return JsonResponse({"error": "Invalid NurseStation"}, status=400)
            
            prod_stock = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__ItemName=prod_stock_id).first()
            if not prod_stock:
                return JsonResponse({"error": "Invalid Prod_Stock"}, status=400)

            obj = MinMaxForNurseStation.objects.create(
                NurseStation=nurse_station,
                Prod_Stock=prod_stock,
                Min_Qty=min_qty,
                Max_Qty=max_qty,
                created_by=created_by,
                Created_at=timezone.now(),
                Updated_at=timezone.now()
            )
            return JsonResponse({"success": f"MinMax record created for {prod_stock.Product_Detials.ItemName}"})
          except Exception as e:
                return JsonResponse({'err':str(e)})
        elif request.method == "PUT":
            data = json.loads(request.body)
            record_id = data.get("id")
            obj = MinMaxForNurseStation.objects.filter(id=record_id).first()
            if not obj:
                return JsonResponse({"error": "Record not found"}, status=404)

            obj.Min_Qty = data.get("Min_Qty", obj.Min_Qty)
            obj.Max_Qty = data.get("Max_Qty", obj.Max_Qty)
            obj.Updated_at = timezone.now()
            obj.save()
            return JsonResponse({"success": f"MinMax record {record_id} updated successfully"})

        elif request.method == "DELETE":
            data = json.loads(request.body)
            record_id = data.get("id")
            obj = MinMaxForNurseStation.objects.filter(id=record_id).first()
            if not obj:
                return JsonResponse({"error": "Record not found"}, status=404)
            obj.delete()
            return JsonResponse({"success": f"MinMax record {record_id} deleted successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(['GET'])
def nurse_station_list(request):
    try:
        stations = NurseStationMaster.objects.filter(Status=True)  # Only active
        data = [
            {
                'NurseStationid': ns.NurseStationid,
                'NurseStationName': ns.NurseStationName,
                'Building': ns.Building_Name.Building_Name if ns.Building_Name else '',
                'Block': ns.Block_Name.Block_Name if ns.Block_Name else '',
                'Floor': ns.Floor_Name.Floor_Name if ns.Floor_Name else '',
                'Location': ns.Location_Name.Location_Name if ns.Location_Name else ''
            } 
            for ns in stations
        ]
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# @csrf_exempt
# def minmax_nursestation_excel_upload(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Only POST method allowed"}, status=405)

#     try:
#         file = request.FILES.get("file")
#         created_by = request.POST.get("created_by", "Admin")

#         if not file:
#             return JsonResponse({"error": "No file uploaded"}, status=400)

#         # Read file
#         if file.name.endswith(".csv"):
#             df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
#         elif file.name.endswith(".xlsx"):
#             df = pd.read_excel(file, engine="openpyxl")
#         else:
#             return JsonResponse({"error": "Unsupported file format. Please upload CSV or XLSX"}, status=400)

#         # Clean text columns
#         for col in df.select_dtypes(include=["object"]):
#             df[col] = df[col].astype(str).str.replace("\xa0", " ").str.strip()

#         required_cols = ["NurseStation", "Prod_Stock", "Min_Qty", "Max_Qty"]
#         for col in required_cols:
#             if col not in df.columns:
#                 return JsonResponse({"error": f"Missing required column: {col}"}, status=400)

#         created_count = 0
#         skipped_rows = []

#         for index, row in df.iterrows():
#             nurse_name = row.get("NurseStation")
#             product_name = row.get("Prod_Stock")
#             min_qty = row.get("Min_Qty", 0)
#             max_qty = row.get("Max_Qty", 0)

#             # Skip rows with missing essential info
#             if not nurse_name or not product_name:
#                 skipped_rows.append(index + 2)  # +2 for Excel row number
#                 continue

#             # Convert qty to int safely
#             try:
#                 min_qty = int(min_qty)
#             except:
#                 min_qty = 0
#             try:
#                 max_qty = int(max_qty)
#             except:
#                 max_qty = 0

#             # Lookup NurseStation and Stock
#             nurse_station = NurseStationMaster.objects.filter(NurseStationName=nurse_name).first()
#             stock = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__ItemName=product_name).first()

#             if not nurse_station or not stock:
#                 skipped_rows.append(index + 2)
#                 continue

#             # Create or update MinMax
#             with transaction.atomic():
#                 obj, created = MinMaxForNurseStation.objects.update_or_create(
#                     NurseStation=nurse_station,
#                     Prod_Stock=stock,
#                     defaults={
#                         "Min_Qty": min_qty,
#                         "Max_Qty": max_qty,
#                         "created_by": created_by,
#                         "Updated_at": timezone.now()
#                     }
#                 )
#                 if created:
#                     created_count += 1

#         return JsonResponse({
#             "success": f"{created_count} MinMax records created/updated successfully.",
#             "skipped_rows": skipped_rows
#         })

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def minmax_nursestation_excel_upload(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by", "Admin")

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        # Read file
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload CSV or XLSX"}, status=400)

        # Clean text columns
        for col in df.select_dtypes(include=["object"]):
            df[col] = df[col].astype(str).str.replace("\xa0", " ").str.strip()

        required_cols = ["NurseStation", "Prod_Stock", "Min_Qty", "Max_Qty"]
        for col in required_cols:
            if col not in df.columns:
                return JsonResponse({"error": f"Missing required column: {col}"}, status=400)

        created_count = 0
        skipped_rows = []

        for index, row in df.iterrows():
            nurse_name = row.get("NurseStation")
            product_name = row.get("Prod_Stock")
            min_qty = row.get("Min_Qty", 0)
            max_qty = row.get("Max_Qty", 0)
            reason = ""

            # 1️⃣ Missing essential info
            if not nurse_name:
                reason = "Missing NurseStation"
            elif not product_name:
                reason = "Missing Prod_Stock"

            # 2️⃣ Convert quantity safely
            try:
                min_qty = int(min_qty)
            except:
                min_qty = 0
                reason += " | Invalid Min_Qty"
            try:
                max_qty = int(max_qty)
            except:
                max_qty = 0
                reason += " | Invalid Max_Qty"

            # 3️⃣ Lookup NurseStation and Stock
            nurse_station = NurseStationMaster.objects.filter(NurseStationName=nurse_name).first()
            stock = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__ItemName=product_name).first()

            if not nurse_station:
                reason += " | NurseStation not found"
            if not stock:
                reason += " | Prod_Stock not found"

            # If any reason exists, skip this row
            if reason:
                skipped_rows.append({
                    "row": index + 2,
                    "NurseStation": nurse_name,
                    "Prod_Stock": product_name,
                    "reason": reason.strip(" |")
                })
                continue

            # 4️⃣ Create or update MinMax
            with transaction.atomic():
                obj, created = MinMaxForNurseStation.objects.update_or_create(
                    NurseStation=nurse_station,
                    Prod_Stock=stock,
                    defaults={
                        "Min_Qty": min_qty,
                        "Max_Qty": max_qty,
                        "created_by": created_by,
                        "Updated_at": timezone.now()
                    }
                )
                if created:
                    created_count += 1

        return JsonResponse({
            "success": f"{created_count} MinMax records created/updated successfully.",
            "skipped_rows": skipped_rows
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
