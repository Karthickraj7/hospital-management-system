import json
from django.http import JsonResponse, HttpResponse
from .models import UnitOfMeasurement,Product_field_Details,Product_Category_Product_Details,ProductMaster_Drug_Segment_Details
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from .models import *
from Masters.models import *
from .serializer import *
from rest_framework.response import Response
from rest_framework import status
@csrf_exempt
@require_http_methods(['GET'])
def stock_audit_report(request):

    stock_id = request.GET.get("stock_id")
    operation = request.GET.get("operation")
    changed_by = request.GET.get("changed_by")
    date_from = request.GET.get("date_from")
    date_to = request.GET.get("date_to")

    filters = Q()

    if stock_id:
        filters &= Q(stock_id=stock_id)

    if operation:
        filters &= Q(operation_type=operation)

    if changed_by:
        filters &= Q(changed_by__icontains=changed_by)

    if date_from and date_to:
        filters &= Q(changed_at__date__range=[date_from, date_to])

    audits = StockMaintenanceAudit.objects.filter(filters).order_by("-changed_at")

    data = []

    for audit in audits:
        data.append({
            "id": audit.id,
            "stock_id": audit.stock_id,
            "operation": audit.operation_type,
            "changed_by": audit.changed_by,
            "reason": audit.update_reason,
            "changed_at": audit.changed_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    return JsonResponse({"success": True, "data": data})


@csrf_exempt
def get_unit_of_measurements(request):
    if request.method == 'GET':
        # Fetch all unit records from the database
        units = UnitOfMeasurement.objects.filter(Status = True)

        # Prepare data as a list of dictionaries
        units_data = []
        for unit in units:
            units_data.append({
                'id': unit.pk,
                'Unit_Name': unit.Unit_Name,
                'Unit_Symbol': unit.Unit_Symbol,
                'Unit_Type': unit.Unit_Type,
                'Base_Unit': unit.Base_Unit,
                'Conversion_Factor': float(unit.Conversion_Factor),  # Convert to string for JSON compatibility
                'Difference_Description': unit.Difference_Description,
            })

        # Return the data as JSON
        return JsonResponse(units_data, safe=False)
    else:
        return HttpResponse("Only GET method is allowed", status=405)
    
    



@csrf_exempt
def get_Product_fields_for_productcategory(request):
    if request.method == 'GET':
        gettype = request.GET.get('type','category')
        Category = request.GET.get('Category','')
        # Fetch all unit records from the database
        fileds = Product_field_Details.objects.filter(Status = True).order_by('field_Order')
        
        if gettype =='category' :
            fileds_data = []
            for filed in fileds:
                fileds_data.append({
                    'id': filed.pk,
                    'field_Name': filed.field_Name,
                    'checked': True if filed.pk in [1,2,3,4,12,13,18,21,22,23] else False
                })
            return JsonResponse(fileds_data, safe=False)
            
        else:
            fileds_data=[]
            
            if Category :
                Product_instance =Product_Category_Product_Details.objects.get(pk = int(Category))
                product_field_pks = Product_instance.Product_fields.values_list('pk', flat=True)
                for filed in fileds:
                    if filed.pk in product_field_pks:
                        fields_name =filed.field_Name.strip().replace(' ',"_")
                        
                        if fields_name =='Volume':
                            fileds_data.append(fields_name)
                            fileds_data.append(f"{fields_name}_Type")
                            
                        elif fields_name =='Strength':
                            fileds_data.append(fields_name)
                            fileds_data.append(f"{fields_name}_Type")

                        elif fields_name =='Is_Reusable':
                            fileds_data.append(fields_name)
                            fileds_data.append("Re_Usable_Times")
                        elif fields_name =='Is_Sellable':
                            fileds_data.append(fields_name)
                            fileds_data.append('Least_Sellable_Unit')
                        
                            
                        elif fields_name =='Is_Perishable':
                            fileds_data.append(fields_name) 
                            fileds_data.append("Perishable_Duration") 
                            fileds_data.append("Perishable_Duration_Type") 
                        else :
                            fileds_data.append(fields_name)
            else:
                
                for filed in fileds:
                    if filed.pk <=4:
                        fields_name =filed.field_Name.replace(' ',"_")
                        fileds_data.append(fields_name)
                 
            # Return the data as JSON
            return JsonResponse(fileds_data, safe=False)
    else:
        return HttpResponse("Only GET method is allowed", status=405)
    



@csrf_exempt
def get_Drug_segments(request):
    if request.method == 'GET':
        # Fetch all unit records from the database
        segments = ProductMaster_Drug_Segment_Details.objects.filter(Status = True)

        # Prepare data as a list of dictionaries
        segments_data = []
        for seg in segments:
            segments_data.append({
                'id': seg.pk,
                'Segment': seg.Segment,
                'Description': seg.Description,
                'checked':False
            })

        # Return the data as JSON
        return JsonResponse(segments_data, safe=False)
    else:
        return HttpResponse("Only GET method is allowed", status=405)
    
    
# bharathi


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Sub_Product_Category_Details_by_Product(request):
    if request.method == 'GET':
        try:
            Product = request.GET.get('ProductCategory')
            
            if not Product:
                return JsonResponse({'warn': 'Product Category not found'})
            SubProductCategory_Details = SubCategory_Detailes.objects.filter(ProductCategoryId=Product)
            print("SubProductCategory_Details",SubProductCategory_Details)

            Sub_ProductData = []
            for sub in SubProductCategory_Details:
                sub_dict = {
                    'id':sub.pk,
                    'SubCategoryName':sub.SubCategoryName,
                    'ProductCategoryId':sub.ProductCategoryId.pk,
                    'ProductCategory_Name':sub.ProductCategoryId.ProductCategory_Name,
                    'Status':'Active' if sub.Status else 'Inactive',

                }
                Sub_ProductData.append(sub_dict)
            return JsonResponse(Sub_ProductData, safe=False)


        except Exception as e:
            print(f"Error occurred: {e}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not Allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Items_by_ProductCategory_Details(request):
    if request.method == 'GET':
        try:
            Product = request.GET.get('ProductCategory')
            if not Product:
                return JsonResponse({'warn': 'Product Category not found'})
            
            Product_Items = Product_Master_All_Category_Details.objects.filter(ProductCategory=Product)
            print("Product_Items",Product_Items)
            Product_ItemData = []
            for item in Product_Items:
                item_dict = {
                    'id':item.pk,
                    'ItemName':item.ItemName,                    
                    'Status':item.Status,
                }
                Product_ItemData.append(item_dict)
            return JsonResponse(Product_ItemData, safe=False)


        except Exception as e:
            return JsonResponse({'warn': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not Allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def Item_wise_supplier_getdata(request):
    try:
        ItemCode = request.GET.get('ItemCode', '')
        if not ItemCode:
            return JsonResponse({'warn': 'ItemCode not found'})

        # Get supplier-product mappings for the given ItemCode
        supplier_products = (
            Supplier_Product_Details.objects
            .filter(Product_Detials__pk=ItemCode)
            .select_related("Supplier_Detials")
            .prefetch_related("Supplier_Product_Details_Amount")  # ✅ correct related_name
            .order_by("Supplier_Detials__pk")
        )

        if not supplier_products.exists():
            return JsonResponse({'warn': 'No suppliers found for this ItemCode'})

        # Prepare response
        list_supplier = {
            'data': [],
            'Suppliers': [
                {
                    "id": sp.Supplier_Detials.pk,
                    "Name": sp.Supplier_Detials.Supplier_Name,
                }
                for sp in supplier_products
            ]
        }

        amount_types = ["PurchaseRateBeforeGST", "GST", "PurchaseRateAfterGST", "MRP"]
        amount_type_labels = {
            "PurchaseRateBeforeGST": "Purchase Rate Before GST",
            "GST": "GST",
            "PurchaseRateAfterGST": "Purchase Rate After GST",
            "MRP": "MRP",
        }

        # Build rows per amount type
        for amount_type in amount_types:
            dic = {
                'id': len(list_supplier['data']) + 1,
                'AmountType': amount_type_labels[amount_type],
            }
            for sp in supplier_products:
                supplier_key = str(sp.Supplier_Detials.pk)

                # Get first amount record (if multiple exist, adjust logic)
                amount_obj = sp.Supplier_Product_Details_Amount.first()
                dic[supplier_key] = getattr(amount_obj, amount_type, "-") if amount_obj else "-"
            list_supplier['data'].append(dic)

        # Add DeliveryDuration row
        delivery_duration_dic = {
            'id': len(list_supplier['data']) + 1,
            'AmountType': "Delivery Duration",
        }
        for sp in supplier_products:
            delivery_duration_dic[str(sp.Supplier_Detials.pk)] = (
                sp.Supplier_Detials.DeliveryDuration or "-"
            )
        list_supplier['data'].append(delivery_duration_dic)

        return JsonResponse(list_supplier)

    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
@require_http_methods(["GET"])  
def SupplierId_Supplier_Data_Get(request):
    if request.method == "GET":
        try:
            SupplierId = request.GET.get('SupplierId')
  
            if not SupplierId:
                return JsonResponse({'warn': "Supplier not found"})
            if SupplierId:
                Supplier_Master_instance=Supplier_Master_Details.objects.get(pk=SupplierId)
                dic={
                    'id':Supplier_Master_instance.Supplier_Id,
                    'SupplierName':Supplier_Master_instance.Supplier_Name,
                    'ContactPerson':Supplier_Master_instance.Contact_Person,
                    'ContactNumber':Supplier_Master_instance.Contact_Number,
                    'EmailAddress':Supplier_Master_instance.Email_Address,
                    'LeadTime':Supplier_Master_instance.DeliveryDuration,
                }
                return JsonResponse(dic,safe=False)


        except Exception as e:
            return JsonResponse({'warn':'An internal server error occurred'}, status=500)

    
    return JsonResponse({'warn': 'Invalid Method'}, status=405)

# PO_SupplierWise_Item_Get

@csrf_exempt
@require_http_methods(["GET"])
def PO_SupplierWise_Item_Get(request):
    try:
        # Extract parameters
        SupplierId = request.GET.get('SupplierId')
        POitems = request.GET.get('POitems')

        # Debugging logs
        print("SupplierId:", SupplierId)
        print("POitems:", POitems)
        Item_Array = []

        # Validate parameters
        if not SupplierId or not POitems:
            return JsonResponse({'warn': 'Both SupplierId and item are required'}, status=400)

        # Fetch supplier product details
        Supplier_Product_Inst = Supplier_Product_Details.objects.filter(
            Supplier_Detials__Supplier_Id=SupplierId,
            Product_Detials__pk=POitems,
            Status=True
        )

        if not Supplier_Product_Inst.exists():
            return JsonResponse(Item_Array, safe=False)

        # Process each product detail
        for row in Supplier_Product_Inst:
            item_Dec = {
                'itemCode': row.Product_Detials.pk,
                'itemName': row.Product_Detials.ItemName,
                'ProductCategory': row.Product_Detials.ProductCategory.ProductCategory_Name if row.Product_Detials.ProductCategory else None,
                'SubCategory': row.Product_Detials.SubCategory.SubCategoryName if row.Product_Detials.SubCategory else None,
            }

            # Fetch rate details
            Get_Rate_Inst = Supplier_Product_Amount_Details.objects.filter(
                Supplier_detials=row,
                Supplier_detials__Product_Detials=row.Product_Detials
            ).order_by('-Created_at').first()

            # Optional fields
            if row.Product_Detials.GenericName:
                item_Dec['GenericName'] = row.Product_Detials.GenericName.GenericName
            if row.Product_Detials.CompanyName:
                item_Dec['ManufacturerName'] = row.Product_Detials.CompanyName.CompanyName
            if row.Product_Detials.HSNCode:
                item_Dec['HSNCode'] = row.Product_Detials.HSNCode
            if row.Product_Detials.Strength:
                item_Dec['Strength'] = row.Product_Detials.Strength
            if row.Product_Detials.StrengthType:
                item_Dec['StrengthType'] = row.Product_Detials.StrengthType
            if row.Product_Detials.Volume:
                item_Dec['Volume'] = row.Product_Detials.Volume
            if row.Product_Detials.VolumeType:
                item_Dec['VolumeType'] = row.Product_Detials.VolumeType.Unit_Name
            if row.Product_Detials.PackType:
                item_Dec['PackType'] = row.Product_Detials.PackType.PackType_Name
            if row.Product_Detials.PackQty:
                item_Dec['PackQty'] = row.Product_Detials.PackQty
            if row.Product_Detials.Is_Manufacture_Date_Available is not None:
                item_Dec['Is_Manufacture_Date_Available'] = row.Product_Detials.Is_Manufacture_Date_Available
            if row.Product_Detials.Is_Expiry_Date_Available is not None:
                item_Dec['Is_Expiry_Date_Available'] = row.Product_Detials.Is_Expiry_Date_Available

            # Safely check and assign 'IsSellable'
            if row.Product_Detials.IsSellable is not None:
                item_Dec['IsSellable'] = 'Yes' if row.Product_Detials.IsSellable else 'No'
                if row.Product_Detials.IsSellable:
                    item_Dec['LeastSellableUnit'] = row.Product_Detials.LeastSellableUnit

            # Add rate details
            if Get_Rate_Inst:
                item_Dec['MRP'] = Get_Rate_Inst.MRP
                item_Dec['PurchaseRateBeforeGST'] = Get_Rate_Inst.PurchaseRateBeforeGST
                item_Dec['GST'] = Get_Rate_Inst.GST
                item_Dec['PurchaseRateAfterGST'] = Get_Rate_Inst.PurchaseRateAfterGST

            Item_Array.append(item_Dec)

        return JsonResponse(Item_Array, safe=False)

    except Exception as e:
        print("Error:", str(e))  # Detailed logging for debugging
        return JsonResponse({'warn': 'An internal server error occurred'}, status=500)
    




# @csrf_exempt
# @require_http_methods(["GET"])
# def Opening_Balance_Closing_Balance(request):
#     try:
#         balances = InventoryBalance.objects.all()
#         # today = datetime.now()
#         today = datetime.today().strftime('%Y-%m-%d')
#         print("today is .. ",today)
#         from_date = request.GET.get("from_date")
#         to_date = request.GET.get("to_date")
#         product = request.GET.get("product")
#         store = request.GET.get("store")
#         day = request.GET.get("day")
#         month = request.GET.get("month")
#         year = request.GET.get("year")
        
#         if from_date:
#             balances = balances.filter(date=from_date)
#         if to_date:
#             balances = balances.filter(date=to_date)
#         if product:
#             balances = balances.filter(product__ItemName__icontains=product)
#         if store:
#             balances = balances.filter(store__Store_Name__icontains=store)

#         # ✅ New: Filter by day, month, year
#         if day:
#             balances = balances.filter(date__day=int(day))
#         if month:
#             balances = balances.filter(date__month=int(month))
#         if year:
#             balances = balances.filter(date__year=int(year))

#         data = []
#         for bal in balances:
#             data.append({
#                 "S.No": bal.pk,
#                 "product": bal.product.ItemName,
#                 "batch_no": bal.batch,
#                 "store": bal.store.Store_Name,
#                 "date": bal.date.strftime("%d-%m-%Y") if bal.date else "",
#                 "opening_balance": bal.opening_balance,
#                 "closing_balance": bal.closing_balance,
#                 "created_at": bal.created_at.strftime("%d-%m-%Y") if bal.created_at else "",
#             })

#         return JsonResponse(data, safe=False)
#     except Exception as e:
#         return JsonResponse({"err": str(e)})

import pymysql

def get_remote_connection():
    return pymysql.connect(
        host="192.168.20.194",
        user="remoteapi",
        password="Store007",
        database="store",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

@csrf_exempt
@require_http_methods(["GET"])
def Opening_Balance_Closing_Balance(request):
    try:
        conn = get_remote_connection()
        cursor = conn.cursor()

        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")
        product = request.GET.get("product")
        store = request.GET.get("store")
        day = request.GET.get("day")
        month = request.GET.get("month")
        year = request.GET.get("year")

        query = """
            SELECT 
                id,
                product,
                batch,
                store,
                date,
                opening_balance,
                closing_balance,
                created_at
            FROM inventorybalance
            WHERE 1=1
        """

        params = []

        # 🔹 Created date filter
        if from_date and to_date:
            query += " AND DATE(created_at) BETWEEN %s AND %s"
            params.extend([from_date, to_date])
        elif from_date:
            query += " AND DATE(created_at) = %s"
            params.append(from_date)
        elif to_date:
            query += " AND DATE(created_at) = %s"
            params.append(to_date)

        # 🔹 Product filter
        if product:
            query += " AND product LIKE %s"
            params.append(f"%{product}%")

        # 🔹 Store filter
        if store:
            query += " AND store LIKE %s"
            params.append(f"%{store}%")

        # 🔹 Day / Month / Year (based on inventory date)
        if day:
            query += " AND DAY(date) = %s"
            params.append(int(day))

        if month:
            query += " AND MONTH(date) = %s"
            params.append(int(month))

        if year:
            query += " AND YEAR(date) = %s"
            params.append(int(year))

        query += " ORDER BY date DESC"

        cursor.execute(query, params)
        rows = cursor.fetchall()

        data = []
        for i, row in enumerate(rows, start=1):
            data.append({
                "S.No": i,
                "product": row["product"],
                "batch_no": row["batch"],
                "store": row["store"],
                "date": row["date"].strftime("%d-%m-%Y") if row["date"] else "",
                "opening_balance": row["opening_balance"],
                "closing_balance": row["closing_balance"],
                "created_at": row["created_at"].strftime("%d-%m-%Y") if row["created_at"] else "",
            })

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    finally:
        cursor.close()
        conn.close()
# @csrf_exempt
# @require_http_methods(['GET'])
# def get_available_stocks(request):

#     try:
#         # Fetch only available stock rows
#         stocks = Stock_Maintance_Table_Detials.objects.filter(AvailableQuantity__gt=0)

#         # Prepare data manually
#         data = []
#         for stock in stocks:
#             data.append({
#                 "id": stock.pk,
#                 "product_id": stock.Product_Detials.pk if stock.Product_Detials else None,
#                 "product_name": stock.Product_Detials.ItemName if stock.Product_Detials else None,
#                 "batch_no": stock.Batch_No,
#                 "available_qty": stock.AvailableQuantity,
#                 "sellable_price": float(stock.Sellable_price),
#                 "expiry_status": stock.Expiry_Status,
#                 "store_location": stock.Store_location.Store_Name if stock.Store_location else '',
#                 "nurse_location": stock.NurseStation_location.NurseStationName if stock.NurseStation_location else '',
#             })

#         return JsonResponse(data, safe=False)
#     except Exception as e:
#         return JsonResponse({'err':str(e)})


# @csrf_exempt
# @require_http_methods(["GET"])
# def get_available_stocks(request):
 
#     try:
#         # Fetch only available stock rows
#         stocks = Stock_Maintance_Table_Detials.objects.filter(AvailableQuantity__gt=0)
 
#         # Get filter parameters from request
#         product_name = request.GET.get("product_name", "").strip()
#         store_location = request.GET.get("store_location", "").strip()
#         nurse_location = request.GET.get("nurse_location", "").strip()
 
#         # Apply filters if provided
#         if product_name:
#             stocks = stocks.filter(Product_Detials__ItemName__icontains=product_name)
 
#         if store_location:
#             stocks = stocks.filter(Store_location__Store_Name__icontains=store_location)
 
#         if nurse_location:
#             stocks = stocks.filter(
#                 NurseStation_location__NurseStationName__icontains=nurse_location
#             )
 
#         # Prepare data manually
#         data = []
#         for stock in stocks:
#             product = stock.Product_Detials
#             store = stock.Store_location
#             nurse = stock.NurseStation_location

#             try:
#                 grn_item = stock.Grn_Details_Item
#             except GRN_Product_Item_Detials.DoesNotExist:
#                 grn_item = None

#             data.append({
#                 "id": stock.pk,

#                 "product_id": product.pk if product else None,
#                 "product_name": product.ItemName if product else "",

#                 "batch_no": stock.Batch_No,
#                 "available_qty": stock.AvailableQuantity or 0,

#                 "sellable_price": float(stock.Sellable_price or 0),
#                 "sellable_qty_price": float(stock.Sellable_qty_price or 0),

#                 "current_price": float(stock.Current_Price or 0),
#                 "current_quantity_price": float(stock.Current_Qunatity_Price or 0),

#                 "mrp_quantity_price": float(stock.MRP_Qunatity_Price or 0),

#                 "tax_amount": float(stock.Tax_Amount or 0),
#                 "tax_percentage": float(stock.Tax_Percentage or 0),
#                 "tax_type": stock.Tax_Type or "",

#                 "expiry_status": stock.Expiry_Status or "",

#                 "store_location": store.Store_Name if store else "",
#                 "nurse_location": nurse.NurseStationName if nurse else "",

#                 "purchase_rate_with_tax": float(
#                     grn_item.Purchase_rate_with_tax
#                 ) if grn_item and grn_item.Purchase_rate_with_tax else 0.0,
#             })

 
#         return JsonResponse(data, safe=False)
#     except Exception as e:
#         return JsonResponse({"err": str(e)})
 
# @csrf_exempt
# @require_http_methods(["GET"])
# def get_available_stocks(request):
#     try:
#         # Base queryset with optimization
#         stocks = (
#             Stock_Maintance_Table_Detials.objects
#             .select_related(
#                 "Product_Detials",
#                 "Store_location",
#                 "NurseStation_location",
#                 "Grn_Details_Item",
#             )
#             .filter(AvailableQuantity__gt=0)
#         )

#         # Filters
#         product_name = request.GET.get("product_name", "").strip()
#         store_location = request.GET.get("store_location", "").strip()
#         nurse_location = request.GET.get("nurse_location", "").strip()

#         if product_name:
#             stocks = stocks.filter(Product_Detials__ItemName__icontains=product_name)

#         if store_location:
#             stocks = stocks.filter(Store_location__Store_Name__icontains=store_location)

#         if nurse_location:
#             stocks = stocks.filter(
#                 NurseStation_location__NurseStationName__icontains=nurse_location
#             )

#         data = []

#         for stock in stocks:
#             # ---------- SAFE PRODUCT ----------
#             try:
#                 product_id = stock.Product_Detials.pk
#                 product_name = stock.Product_Detials.ItemName
#             except Exception as e:
#                 product_id = None
#                 product_name = None

#             # ---------- SAFE STORE ----------
#             try:
#                 store_name = stock.Store_location.Store_Name
#             except Exception as e:
#                 store_name = ""

#             # ---------- SAFE NURSE STATION ----------
#             try:
#                 nurse_name = stock.NurseStation_location.NurseStationName
#             except Exception as e:
#                 nurse_name = ""

#             # ---------- SAFE GRN ----------
#             try:
#                 purchase_rate_with_tax = (
#                     float(stock.Grn_Details_Item.Purchase_rate_with_tax)
#                     if stock.Grn_Details_Item
#                     and stock.Grn_Details_Item.Purchase_rate_with_tax
#                     else 0.0
#                 )
#             except Exception as e:
#                 purchase_rate_with_tax = 0.0




#             data.append({
#                 "id": stock.pk,
#                 "product_id": product_id,
#                 "product_name": product_name,
#                 "batch_no": stock.Batch_No,
#                 "available_qty": stock.AvailableQuantity,
#                 "sellable_price": float(stock.Sellable_price or 0),
#                 "sellable_qty_price": float(stock.Sellable_qty_price or 0),
#                 "current_price": float(stock.Current_Price or 0),
#                 "current_quantity_price": float(stock.Current_Qunatity_Price or 0),
#                 "mrp_quantity_price": float(stock.MRP_Qunatity_Price or 0),
#                 "tax_amount": float(stock.Tax_Amount or 0),
#                 "tax_percentage": float(stock.Tax_Percentage or 0),
#                 "tax_type": stock.Tax_Type,
#                 "expiry_status": stock.Expiry_Status,
#                 "store_location": store_name,
#                 "nurse_location": nurse_name,
#                 "purchase_rate_with_tax": float(stock.Grn_Details_Item.Purchase_rate_with_tax or 0) if stock.Grn_Details_Item and stock else 0,
#             })

#         return JsonResponse(data, safe=False)

#     except Exception as e:
#         # GLOBAL FAIL-SAFE (API NEVER CRASHES)
#         return JsonResponse({
#             "success": False,
#             "error": "Internal Server Error",
#             "details": str(e)
#         }, status=500)
    

@csrf_exempt
@require_http_methods(['GET'])
def get_available_stocks(request):
    try:
        stocks = Stock_Maintance_Table_Detials.objects.filter(Store_location__in = [1,2,3,4]).exclude(AvailableQuantity=0)

        data = []

        product_name = request.GET.get("product_name", "").strip()
        store_location = request.GET.get("store_location", "").strip()
        nurse_location = request.GET.get("nurse_location", "").strip()
        if product_name:
            stocks = stocks.filter(
    Product_Detials__ItemName__icontains=product_name
)


        if store_location:
            stocks = stocks.filter(Store_location__Store_Name = store_location)
        if nurse_location:
            stocks = stocks.filter(NurseStation_location__NurseStationName = nurse_location)
        for s in stocks:
            purchase_rate = 0
            if s.Grn_Details_Item_id:
                try:
                    purchase_rate = float(
                        s.Grn_Details_Item.Purchase_rate_with_tax or 0
                    )
                except Exception:
                    purchase_rate = 0

            data.append({
        "id": s.pk,
        "product_id": s.Product_Detials.pk,
        "product_name": s.Product_Detials.ItemName,
        "batch_no": s.Batch_No,
        "available_qty": s.AvailableQuantity,
        "sellable_price": float(s.Sellable_price or 0),
        "sellable_qty_price": float(s.Sellable_qty_price or 0),
        "current_price": float(s.Current_Price or 0),
        "current_quantity_price": float(s.Current_Qunatity_Price or 0),
        "mrp_quantity_price": float(s.MRP_Qunatity_Price or 0),
        "tax_amount": float(s.Tax_Amount or 0),
        "tax_percentage": float(s.Tax_Percentage or 0),
        "tax_type": s.Tax_Type,
        "expiry_status": s.Expiry_Status,

        "store_location": (
            s.Store_location.Store_Name
            if s.Store_location else None
        ),

        "nurse_location": (
            s.NurseStation_location.NurseStationName
            if s.NurseStation_location else None
        ),

        "purchase_rate_with_tax": purchase_rate,
    })

        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'err':str(e)})



from django.db.models import Sum, Count



from datetime import datetime

# @require_http_methods(["GET"])
# def grn_report_by_reason(request):
#     try:
#         reason = request.GET.get("reason")
#         start_date = request.GET.get("start_date")
#         end_date = request.GET.get("end_date")

#         if not reason:
#             return JsonResponse({"error": "Reason query param is required"}, status=400)

#         # Base filter
#         filters = {"Reason": reason}

#         # ✅ Add date range filter if provided
#         if start_date and end_date:
#             try:
#                 start = datetime.strptime(start_date, "%Y-%m-%d")
#                 end = datetime.strptime(end_date, "%Y-%m-%d")
#                 # assuming your model has CreatedAt / GRN_Date field
#                 filters["Created_at__date__range"] = (start.date(), end.date())
#             except ValueError:
#                 return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

#         # 1. Filter only products
#         product_items = GRN_Product_Item_Detials.objects.filter(**filters).values(
#             "Product_Detials__id",
#             "Product_Detials__ItemName",
#             "Batch_No",
#             "Received_Quantity",
#             "Purchase_rate_with_tax",
#             "Total_Pack_Amount_with_tax",
#             "Reason",
#             "Grn_Detials__Purchase_order_Detials__PurchaseOrder_Number",
#             "Created_by",
#             "Created_at",
#         )

#         # 2. Totals
#         totals = GRN_Product_Item_Detials.objects.filter(**filters).aggregate(
#             total_amount=Sum("Final_Total_Pack_Amount_with_tax"),
#             total_products=Count("id"),
#         )

#         # Rounding total amount
#         total_amount = totals["total_amount"] or 0
#         total_amount = round(float(total_amount))  # no decimals

#         response = {
#             "reason": reason,
#             "products": list(product_items),
#             "summary": {
#                 "total_amount": total_amount,
#                 "total_products": totals["total_products"] or 0,
#             }
#         }

#         return JsonResponse(response, safe=False)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


# @require_http_methods(["GET"])
# def grn_report_by_reason(request):
#     try:
#         reason = request.GET.get("reason")
#         start_date = request.GET.get("start_date")
#         end_date = request.GET.get("end_date")

#         if not reason:
#             return JsonResponse({"error": "Reason query param is required"}, status=400)

#         # ✅ Handle multiple reasons
#         reason_list = reason.split(",")
#         filters = {"Reason__in": reason_list}

#         # Add date range filter if provided
#         if start_date and end_date:
#             try:
#                 start = datetime.strptime(start_date, "%Y-%m-%d")
#                 end = datetime.strptime(end_date, "%Y-%m-%d")
#                 filters["Created_at__date__range"] = (start.date(), end.date())
#             except ValueError:
#                 return JsonResponse({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

#         # Fetch product items
#         product_items = GRN_Product_Item_Detials.objects.filter(**filters).values(
#             "Product_Detials__id",
#             "Product_Detials__ItemName",
#             "Batch_No",
#             "Received_Quantity",
#             "Purchase_rate_with_tax",
#             "Total_Pack_Amount_with_tax",
#             "Reason",
#             "Grn_Detials__Purchase_order_Detials__PurchaseOrder_Number",
#             "Created_by",
#             "Created_at",
#         )

#         # Totals
#         totals = GRN_Product_Item_Detials.objects.filter(**filters).aggregate(
#             total_amount=Sum("Final_Total_Pack_Amount_with_tax"),
#             total_products=Count("id"),
#         )

#         total_amount = totals["total_amount"] or 0
#         total_amount = round(float(total_amount))

#         response = {
#             "reason": reason_list,
#             "products": list(product_items),
#             "summary": {
#                 "total_amount": total_amount,
#                 "total_products": totals["total_products"] or 0,
#             }
#         }

#         return JsonResponse(response, safe=False)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)



from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Sum, Count
from datetime import datetime

@require_http_methods(["GET"])
def grn_report_by_reason(request):
    try:
        reason = request.GET.get("reason")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        if not reason:
            return JsonResponse({"error": "Reason query param is required"}, status=400)

        # Multiple reasons
        reason_list = reason.split(",")

        filters = {
            "Reason__in": reason_list
        }

        # Date filter
        if start_date and end_date:
            try:
                filters["Created_at__date__range"] = (
                    datetime.strptime(start_date, "%Y-%m-%d").date(),
                    datetime.strptime(end_date, "%Y-%m-%d").date()
                )
            except ValueError:
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD"},
                    status=400
                )

        # ===========================
        # MAIN QUERY (GRN + ITEMS)
        # ===========================
        product_items = GRN_Product_Item_Detials.objects.filter(**filters).values(
            # ✅ GRN DETAILS
            "Grn_Detials__GRN_No",
            "Grn_Detials__GrnDate",
            "Grn_Detials__Supplier_Detials__Supplier_Name",
            "Grn_Detials__Supplier_Bill_Date",
            "Grn_Detials__Net_Amount",

            # ✅ ITEM DETAILS
            "Product_Detials__ItemName",
            "Received_Quantity",
            "Purchase_rate_with_tax",        # PTR
            "Total_Pack_Amount_with_tax",    # Net item amount
            "Reason",
        )

        # ===========================
        # SUMMARY TOTALS
        # ===========================
        totals = GRN_Product_Item_Detials.objects.filter(**filters).aggregate(
            total_net_amount=Sum("Grn_Detials__Net_Amount"),
            total_qty=Sum("Received_Quantity"),
            total_products=Count("id"),
        )

        response = {
            "reason": reason_list,
            "products": list(product_items),
            "summary": {
                "total_qty": totals["total_qty"] or 0,
                "total_products": totals["total_products"] or 0,
                "total_net_amount": round(float(totals["total_net_amount"] or 0), 2),
            }
        }

        return JsonResponse(response, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Sum, Avg, Count, Q
from django.db import models
from datetime import datetime
import calendar
from DrugAdminstrations.models import (
    IP_Pharmacy_Billing_Table_Detials, IP_BillingItem,
    OP_Pharmacy_Billing_Table_Detials, OP_BillingItem
)

# @csrf_exempt
# @require_http_methods(['GET'])
# def pharmacysalesproductwise(request):
#     try:
#         # Get parameters
#         pharmacy_type = request.GET.get('type', 'ip').lower()
#         item_name = request.GET.get('item_name', '').strip()
#         status = request.GET.get('status', 'All')
        
#         # Date filters
#         date_filter = Q()
#         if request.GET.get('month') and request.GET.get('year'):
#             year = int(request.GET.get('year'))
#             month = int(request.GET.get('month'))
#             month_start = datetime(year, month, 1).date()
#             days_in_month = calendar.monthrange(year, month)[1]
#             month_end = datetime(year, month, days_in_month).date()
#             date_filter = Q(Billing__Billing_Date__range=(month_start, month_end))
#         elif request.GET.get('start_date') and request.GET.get('end_date'):
#             start_date = request.GET.get('start_date')
#             end_date = request.GET.get('end_date')
#             date_filter = Q(Billing__Billing_Date__range=(start_date, end_date))
        
#         # Item filter
#         item_filter = Q()
#         if item_name:
#             item_filter = Q(ItemName__icontains=item_name)
        
#         # Status filter
#         status_filter = Q()
#         if status != 'All':
#             status_filter = Q(Billing__Bill_Status=status)
        
#         if pharmacy_type == 'ip':
#             # IP Pharmacy query
#             base_qs = IP_BillingItem.objects.filter(
#                 Billing__Billing_Type='IP PHARMACY'
#             ).select_related('Billing', 'ItemId').filter(
#                 date_filter, item_filter, status_filter
#             )
            
#             items_summary = base_qs.values('ItemName').annotate(
#                 total_quantity=Sum('Billing_Quantity'),
#                 total_amount=Sum('Total'),
#                 avg_unit_price=Avg('Unit_Price'),
#                 sales_count=Count('id')
#             ).order_by('-total_amount')
            
#             # Details query for IP
#             details_qs = base_qs.values(
#                 'Billing__Billing_Date',
#                 'Billing__Billing_Invoice_No',
#                 'Billing__Bill_Status',
#                 'ItemName',
#                 'Billing_Quantity',
#                 'Unit_Price',
#                 'Amount',
#                 'Total',
#                 'BatchNo',
#                 'Exp_Date'
#             ).order_by('-Billing__Billing_Date')
#             details = list(details_qs)
#             pharmacy_label = 'IP Pharmacy'
            
#         elif pharmacy_type == 'op':
#             # OP Pharmacy query
#             base_qs = OP_BillingItem.objects.filter(
#                 Billing__Billing_Type='OPPharmacy'
#             ).select_related('Billing', 'ItemId').filter(
#                 date_filter, item_filter, status_filter
#             )
            
#             items_summary = base_qs.values('ItemName').annotate(
#                 total_quantity=Sum('Billing_Quantity'),
#                 total_amount=Sum('Total'),
#                 avg_unit_price=Avg('Unit_Price'),
#                 sales_count=Count('id')
#             ).order_by('-total_amount')
            
#             # Details query for OP
#             details_qs = base_qs.values(
#                 'Billing__Billing_Date',
#                 'Billing__Billing_Invoice_No',
#                 'Billing__Bill_Status',
#                 'ItemName',
#                 'Billing_Quantity',
#                 'Unit_Price',
#                 'Amount',
#                 'Total',
#                 'BatchNo',
#                 'Exp_Date'
#             ).order_by('-Billing__Billing_Date')
#             details = list(details_qs)
#             pharmacy_label = 'OP Pharmacy'
            
#         else:
#             return JsonResponse({"error": "Invalid type. Use 'ip' or 'op'."}, status=400)
        
#         # Overall totals (full, not limited)
#         totals = base_qs.aggregate(
#             total_qty=Sum('Billing_Quantity'),
#             total_amt=Sum('Total')
#         )
        
#         # Prepare summary list
#         summary_list = []
#         for item in items_summary:
#             summary = {
#                 'product': item['ItemName'],
#                 'total_quantity_sold': item['total_quantity'] or 0,
#                 'total_sales_amount': float(item['total_amount'] or 0),
#                 'average_unit_price': float(item['avg_unit_price'] or 0),
#                 'number_of_sales': item['sales_count'] or 0
#             }
#             summary_list.append(summary)
        
#         response_data = {
#             'pharmacy_type': pharmacy_label,
#             'filter_item': item_name or 'All Items',
#             'filter_status': status,
#             'items_summary': summary_list,
#             'sales_details': details,  # Limited to 100 for performance
#             'total_items_analyzed': len(summary_list),
#             'overall_totals': {
#                 'total_quantity': totals['total_qty'] or 0,
#                 'total_amount': float(totals['total_amt'] or 0)
#             }
#         }
        
#         return JsonResponse(response_data, safe=False)
        
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)



# @csrf_exempt
# @require_http_methods(['GET'])
# def pharmacysalesproductwise(request):
#     try:
#         # --- Query parameters ---
#         pharmacy_type = request.GET.get('type', 'ip').lower()  # ip / op / foc
#         item_name = request.GET.get('item_name', '').strip()
#         status = request.GET.get('status', 'All')

#         # --- Date filters ---
#         date_filter = Q()
#         if request.GET.get('month') and request.GET.get('year'):
#             year = int(request.GET.get('year'))
#             month = int(request.GET.get('month'))
#             month_start = datetime(year, month, 1).date()
#             days_in_month = calendar.monthrange(year, month)[1]
#             month_end = datetime(year, month, days_in_month).date()
#             date_filter = Q(Billing__Billing_Date__range=(month_start, month_end))
#         elif request.GET.get('start_date') and request.GET.get('end_date'):
#             start_date = request.GET.get('start_date')
#             end_date = request.GET.get('end_date')
#             date_filter = Q(Billing__Billing_Date__range=(start_date, end_date))

#         # --- Item filter ---
#         item_filter = Q()
#         if item_name:
#             item_filter = Q(ItemName__icontains=item_name)

#         # --- Status filter ---
#         status_filter = Q()
#         if status != 'All':
#             status_filter = Q(Billing__Bill_Status=status)

#         # --- Base Query Logic ---
#         if pharmacy_type == 'ip':
#             base_qs = IP_BillingItem.objects.filter(
#                 Billing__Billing_Type='IP PHARMACY'
#             ).select_related('Billing', 'ItemId').filter(
#                 date_filter, item_filter, status_filter
#             )
#             pharmacy_label = 'IP Pharmacy'

#         elif pharmacy_type == 'op':
#             base_qs = OP_BillingItem.objects.filter(
#                 Billing__Billing_Type='OPPharmacy'
#             ).select_related('Billing', 'ItemId').filter(
#                 date_filter, item_filter, status_filter
#             )
#             pharmacy_label = 'OP Pharmacy'

#         elif pharmacy_type == 'foc':
#             base_qs = IP_BillingItem.objects.filter(
#                 Billing__Billing_Type='FREE PHARMACY'
#             ).select_related('Billing', 'ItemId').filter(
#                 date_filter, item_filter, status_filter
#             )
#             pharmacy_label = 'FOC Pharmacy'

#         else:
#             return JsonResponse({"error": "Invalid type. Use 'ip', 'op', or 'foc'."}, status=400)

#         # --- Item Summary ---
#         items_summary = base_qs.values('ItemName').annotate(
#             total_quantity=Sum('Billing_Quantity'),
#             total_amount=Sum('Total'),
#             avg_unit_price=Avg('Unit_Price'),
#             sales_count=Count('id')
#         ).order_by('-total_amount')

#         # --- Details ---
#         details_qs = base_qs.values(
#             'Billing__Billing_Date',
#             'Billing__Billing_Invoice_No',
#             'Billing__Bill_Status',
#             'ItemName',
#             'Billing_Quantity',
#             'Unit_Price',
#             'Amount',
#             'Total',
#             'BatchNo',
#             'Exp_Date'
#         ).order_by('-Billing__Billing_Date')
#         details = list(details_qs)

#         # --- Totals ---
#         totals = base_qs.aggregate(
#             total_qty=Sum('Billing_Quantity'),
#             total_amt=Sum('Total')
#         )

#         # --- Prepare summary list ---
#         summary_list = []
#         for item in items_summary:
#             summary_list.append({
#                 'product': item['ItemName'],
#                 'total_quantity_sold': item['total_quantity'] or 0,
#                 'total_sales_amount': float(item['total_amount'] or 0),
#                 'average_unit_price': float(item['avg_unit_price'] or 0),
#                 'number_of_sales': item['sales_count'] or 0
#             })

#         # --- Response ---
#         response_data = {
#             'pharmacy_type': pharmacy_label,
#             'filter_item': item_name or 'All Items',
#             'filter_status': status,
#             'items_summary': summary_list,
#             'sales_details': details,
#             'total_items_analyzed': len(summary_list),
#             'overall_totals': {
#                 'total_quantity': totals['total_qty'] or 0,
#                 'total_amount': float(totals['total_amt'] or 0)
#             }
#         }

#         return JsonResponse(response_data, safe=False)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def pharmacysalesproductwise(request):
    try:
        # --- Query parameters ---
        pharmacy_type = request.GET.get("type", "ip").lower()  # ip / op / foc
        item_name = request.GET.get("item_name", "").strip()
        product = request.GET.get("product", "").strip()  # Alternative parameter name
        status = request.GET.get("status", "All")

        # Use product parameter if item_name is not provided
        search_product = item_name or product

        # --- Date filters ---
        date_filter = Q()
        if request.GET.get("month") and request.GET.get("year"):
            year = int(request.GET.get("year"))
            month = int(request.GET.get("month"))
            month_start = datetime(year, month, 1).date()
            days_in_month = calendar.monthrange(year, month)[1]
            month_end = datetime(year, month, days_in_month).date()
            date_filter = Q(Billing__Billing_Date__range=(month_start, month_end))
        elif request.GET.get("start_date") and request.GET.get("end_date"):
            start_date = request.GET.get("start_date")
            end_date = request.GET.get("end_date")
            date_filter = Q(Billing__Billing_Date__range=(start_date, end_date))

        # --- Item filter (case-insensitive search) ---
        item_filter = Q()
        if search_product:
            item_filter = Q(ItemName__icontains=search_product)

        # --- Status filter ---
        status_filter = Q()
        if status != "All":
            status_filter = Q(Billing__Bill_Status=status)

        # --- Base Query Logic ---
        if pharmacy_type == "all":
            # Combine all pharmacy types - handle separately to avoid union() + annotate() issue
            ip_qs = (
                IP_BillingItem.objects.filter(Billing__Billing_Type="IP PHARMACY")
                .select_related("Billing", "ItemId")
                .filter(date_filter, item_filter, status_filter)
            )
            op_qs = (
                OP_BillingItem.objects.filter(Billing__Billing_Type="OPPharmacy")
                .select_related("Billing", "ItemId")
                .filter(date_filter, item_filter, status_filter)
            )
            foc_qs = (
                IP_BillingItem.objects.filter(Billing__Billing_Type="FREE PHARMACY")
                .select_related("Billing", "ItemId")
                .filter(date_filter, item_filter, status_filter)
            )

            # Get summary from each pharmacy type separately
            ip_summary = ip_qs.values("ItemName").annotate(
                total_quantity=Sum("Billing_Quantity"),
                total_amount=Sum("Total"),
                avg_unit_price=Avg("Unit_Price"),
                sales_count=Count("id"),
            )
            op_summary = op_qs.values("ItemName").annotate(
                total_quantity=Sum("Billing_Quantity"),
                total_amount=Sum("Total"),
                avg_unit_price=Avg("Unit_Price"),
                sales_count=Count("id"),
            )
            foc_summary = foc_qs.values("ItemName").annotate(
                total_quantity=Sum("Billing_Quantity"),
                total_amount=Sum("Total"),
                avg_unit_price=Avg("Unit_Price"),
                sales_count=Count("id"),
            )

            # Combine summaries manually
            combined_summary = {}
            for summary in [ip_summary, op_summary, foc_summary]:
                for item in summary:
                    item_name = item["ItemName"]
                    if item_name not in combined_summary:
                        combined_summary[item_name] = {
                            "total_quantity": 0,
                            "total_amount": 0,
                            "total_unit_price_sum": 0,
                            "sales_count": 0,
                        }
                    combined_summary[item_name]["total_quantity"] += (
                        item["total_quantity"] or 0
                    )
                    combined_summary[item_name]["total_amount"] += float(
                        item["total_amount"] or 0
                    )
                    combined_summary[item_name]["total_unit_price_sum"] += float(
                        item["avg_unit_price"] or 0
                    ) * (item["sales_count"] or 0)
                    combined_summary[item_name]["sales_count"] += (
                        item["sales_count"] or 0
                    )

            # Convert to list format for consistency
            items_summary = []
            for item_name, data in combined_summary.items():
                avg_price = (
                    data["total_unit_price_sum"] / data["sales_count"]
                    if data["sales_count"] > 0
                    else 0
                )
                items_summary.append(
                    {
                        "ItemName": item_name,
                        "total_quantity": data["total_quantity"],
                        "total_amount": data["total_amount"],
                        "avg_unit_price": avg_price,
                        "sales_count": data["sales_count"],
                    }
                )
            items_summary = sorted(
                items_summary, key=lambda x: x["total_amount"], reverse=True
            )

            # Get details from all querysets
            ip_details = list(
                ip_qs.values(
                    "Billing__Billing_Date",
                    "Billing__Billing_Invoice_No",
                    "Billing__Bill_Status",
                    "ItemName",
                    "Billing_Quantity",
                    "Unit_Price",
                    "Amount",
                    "Total",
                    "BatchNo",
                    "Exp_Date",
                )
            )
            op_details = list(
                op_qs.values(
                    "Billing__Billing_Date",
                    "Billing__Billing_Invoice_No",
                    "Billing__Bill_Status",
                    "ItemName",
                    "Billing_Quantity",
                    "Unit_Price",
                    "Amount",
                    "Total",
                    "BatchNo",
                    "Exp_Date",
                )
            )
            foc_details = list(
                foc_qs.values(
                    "Billing__Billing_Date",
                    "Billing__Billing_Invoice_No",
                    "Billing__Bill_Status",
                    "ItemName",
                    "Billing_Quantity",
                    "Unit_Price",
                    "Amount",
                    "Total",
                    "BatchNo",
                    "Exp_Date",
                )
            )
            details = ip_details + op_details + foc_details
            details = sorted(
                details, key=lambda x: x["Billing__Billing_Date"], reverse=True
            )

            # Calculate totals
            ip_totals = ip_qs.aggregate(
                total_qty=Sum("Billing_Quantity"), total_amt=Sum("Total")
            )
            op_totals = op_qs.aggregate(
                total_qty=Sum("Billing_Quantity"), total_amt=Sum("Total")
            )
            foc_totals = foc_qs.aggregate(
                total_qty=Sum("Billing_Quantity"), total_amt=Sum("Total")
            )

            totals = {
                "total_qty": (ip_totals["total_qty"] or 0)
                + (op_totals["total_qty"] or 0)
                + (foc_totals["total_qty"] or 0),
                "total_amt": (ip_totals["total_amt"] or 0)
                + (op_totals["total_amt"] or 0)
                + (foc_totals["total_amt"] or 0),
            }

            pharmacy_label = "All Pharmacies"
            base_qs = None  # Not used for "all" type

        elif pharmacy_type == "ip":
            base_qs = (
                IP_BillingItem.objects.filter(Billing__Billing_Type="IP PHARMACY")
                .select_related("Billing", "ItemId")
                .filter(date_filter, item_filter, status_filter)
            )
            pharmacy_label = "IP Pharmacy"

        elif pharmacy_type == "op":
            base_qs = (
                OP_BillingItem.objects.filter(Billing__Billing_Type="OPPharmacy")
                .select_related("Billing", "ItemId")
                .filter(date_filter, item_filter, status_filter)
            )
            pharmacy_label = "OP Pharmacy"

        elif pharmacy_type == "foc":
            base_qs = (
                IP_BillingItem.objects.filter(Billing__Billing_Type="FREE PHARMACY")
                .select_related("Billing", "ItemId")
                .filter(date_filter, item_filter, status_filter)
            )
            pharmacy_label = "FOC Pharmacy"

        else:
            return JsonResponse(
                {"error": "Invalid type. Use 'all', 'ip', 'op', or 'foc'."}, status=400
            )

        # --- Item Summary (for non-"all" types) ---
        if pharmacy_type != "all":
            items_summary = (
                base_qs.values("ItemName")
                .annotate(
                    total_quantity=Sum("Billing_Quantity"),
                    total_amount=Sum("Total"),
                    avg_unit_price=Avg("Unit_Price"),
                    sales_count=Count("id"),
                )
                .order_by("-total_amount")
            )

            # --- Details ---
            details_qs = base_qs.values(
                "Billing__Billing_Date",
                "Billing__Billing_Invoice_No",
                "Billing__Bill_Status",
                "ItemName",
                "Billing_Quantity",
                "Unit_Price",
                "Amount",
                "Total",
                "BatchNo",
                "Exp_Date",
            ).order_by("-Billing__Billing_Date")
            details = list(details_qs)

            # --- Totals ---
            totals = base_qs.aggregate(
                total_qty=Sum("Billing_Quantity"), total_amt=Sum("Total")
            )

        # --- Prepare summary list ---
        summary_list = []
        for item in items_summary:
            summary_list.append(
                {
                    "product": item["ItemName"],
                    "total_quantity_sold": item["total_quantity"] or 0,
                    "total_sales_amount": float(item["total_amount"] or 0),
                    "average_unit_price": float(item["avg_unit_price"] or 0),
                    "number_of_sales": item["sales_count"] or 0,
                }
            )

        # --- Response ---
        response_data = {
            "pharmacy_type": pharmacy_label,
            "filter_item": search_product or "All Items",
            "filter_status": status,
            "items_summary": summary_list,
            "sales_details": details,
            "total_details_records": len(details),
            "total_items_analyzed": len(summary_list),
            "overall_totals": {
                "total_quantity": totals["total_qty"] or 0,
                "total_amount": float(totals["total_amt"] or 0),
            },
        }

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt 
@require_http_methods(['GET'])
def SupplierBillNumberCheck(request):
    try:
        bill_number = request.GET.get('BillNumber')
        Date = request.GET.get('Date')
        print('----',bill_number)
        grn = GRN_Table_Detials.objects.filter(Supplier_Bill_Number__exact = bill_number).first()
        grn_with_date =  GRN_Table_Detials.objects.filter(Supplier_Bill_Number__exact = bill_number , Supplier_Bill_Date = Date).first()
        if grn:
            return JsonResponse({'warn': True, 'msg': 'GRN Bill Number Already Exists'}, status=200)
        if grn_with_date:
            return JsonResponse({'warn': True, 'msg': 'GRN Bill Number and Bill date Already Exists'}, status=200)

        return JsonResponse({'warn': False, 'msg': 'OK'}, status=200)

    except Exception as e:
        return JsonResponse({'err':str(e)},status=500)    
    




@api_view(['POST'])
def create_department_location(request):
    serializer = DepartmentLocationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Department Location created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_department_location(request, pk):
    try:
        department = Department_Location_Master_Detials.objects.get(Store_Id=pk)
    except Department_Location_Master_Detials.DoesNotExist:
        return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DepartmentLocationSerializer(department, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Department Location updated successfully", "data": serializer.data}
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_department_location(request, pk):
    try:
        department = Department_Location_Master_Detials.objects.get(Store_Id=pk)
    except Department_Location_Master_Detials.DoesNotExist:
        return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

    department.Status = False
    department.save()

    return Response({"message": "Department Location deleted successfully"})


@csrf_exempt
def get_department_location(request):
    if request.method == 'GET':
        try:
            data = Department_Location_Master_Detials.objects.select_related('Location_Name')

            department_list = []
            for d in data:
                department_list.append({
                    "Store_Id": d.Store_Id,
                    "Store_Name": d.Store_Name,
                    "Store_Type": d.Store_Type,

                    # ForeignKey details
                    "Location_Name": d.Location_Name.Location_Id,
                    "Location_Name_name": d.Location_Name.Location_Name,

                    "IsPointOfSale": d.IsPointOfSale,
                    "Status": d.Status,
                    "created_by": d.created_by,
                    "created_at": d.created_at,
                    "updated_at": d.updated_at
                })

            return JsonResponse(department_list, safe=False)

        except Exception as e:
            print("GET Department Location Error:", e)
            return JsonResponse(
                {'error': 'An internal server error occurred'},
                status=500
            )

    return JsonResponse({'error': 'Method not allowed'}, status=405)
