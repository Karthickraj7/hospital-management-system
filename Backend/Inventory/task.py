from Inventory.models import Stock_Maintance_Table_Detials,Supplier_Product_Amount_Details, Purchase_Order_Item_Details,InventoryBalance
from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
import datetime
from django.http import JsonResponse
from django.db.models import Q
from datetime import timedelta
from datetime import datetime, timedelta, date
from django.db.models import Sum
from DrugAdminstrations.models import *
from dateutil.relativedelta import relativedelta



def create_purchase_order(supplier, po_items):
    po_instance = Purchase_Order_Details.objects.create(
        Supplier_Id=supplier,
        Order_Date=date.today(),
        Delivery_Expected_Date=date.today() + timedelta(days=7),
        Total_Order_Value=sum(item['TotalAmount'] for item in po_items),
        PO_Status='Waiting For Approve',
        Create_by="system"
    )

    for item in po_items:
        supplier_product = Supplier_Product_Details.objects.get(
            Supplier_Detials=supplier,
            Product_Detials__pk=item['ItemCode']
        )
        Purchase_Order_Item_Details.objects.create(
            PurchaseOrder=po_instance,
            PO_Item_Detailes=supplier_product,
            PO_Order_Qty=item['PurchaseQty'],
            TotalAmount=item['TotalAmount'],
            Balance_Qty=item['PurchaseQty'],
            Item_Status='Waiting For Approve',
            Create_by="system"
        )
    return po_instance

def check_and_update_expiry_status():
    stock_items = Stock_Maintance_Table_Detials.objects.all()
    for stock_item in stock_items:
        old_status = stock_item.Expiry_Status
        stock_item.check_and_update_expiry_status()
        new_status = stock_item.Expiry_Status
       
        
def check_and_update_expiry_status_stsrt_fun():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        check_and_update_expiry_status,
        'interval',
        seconds=200,  # Changed from days=1 to seconds=5
        start_date=timezone.now() + timedelta(seconds=200)
    )
    try:
        scheduler.start()
    except Exception as e:
        print(f"Failed to start expiry check scheduler: {e}")
       


# bharathi

def check_minimum_qty_lessthan_available_qty():
    # stock_items = Stock_Maintance_Table_Detials.objects.all()
    stock_items = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__Status=True)
    print('stock_items----------',stock_items)

    stock_data = []
    idx =1
    for index, stock_item in enumerate(stock_items, start=1):
        product_id = stock_item.Product_Detials.pk
        # Ensure Product_Detials exists and available quantity is less than the minimum
        if stock_item.Product_Detials and stock_item.AvailableQuantity < stock_item.Product_Detials.MinimumQty:
            

            has_valid_po_queryset = Purchase_Order_Item_Details.objects.filter(
                Item_Status="Waiting For Approve",
                PO_Item_Detailes__Product_Detials__pk=int(product_id)
            )
            has_valid_po_querysets = Purchase_Order_Item_Details.objects.filter(
                Item_Status="Waiting For GRN",
                PO_Item_Detailes__Product_Detials__pk=int(product_id)
            )
   
            has_valid_po = has_valid_po_queryset.exists()
            has_valid_poo = has_valid_po_querysets.exists()

            # If at least one valid PO exists, continue to the next item
            if has_valid_po:
                # print(f"Skipping Product {product_id} as it has a valid PO.")
                continue
            if has_valid_poo:
                continue
                

           
            today = date.today()
            ninety_days_ago = today - timedelta(days=90)

            # Step 1: Get unique months in the 90-day range
            month_set = set()
            cursor = ninety_days_ago
            while cursor <= today:
                month_set.add((cursor.year, cursor.month))
                cursor += timedelta(days=1)

            months_count = len(month_set)

            # Step 2: Total sales in last 90 days
            op_qty = OP_BillingItem.objects.filter(
                ItemId=stock_item,
                Billing__Billing_Date__range=(ninety_days_ago, today)
            ).aggregate(total_qty=Sum('Billing_Quantity'))['total_qty'] or 0

            ip_qty = IP_BillingItem.objects.filter(
                ItemId=stock_item,
                Billing__Billing_Date__range=(ninety_days_ago, today)
            ).aggregate(total_qty=Sum('Billing_Quantity'))['total_qty'] or 0

            total_qty = op_qty + ip_qty

            # Step 3: Dynamic reorder level logic
            if months_count == 3:
                print('-------------3months')
                reorder_level = round(total_qty / 3)
            elif months_count == 2:
                print('-----------------2months')
                reorder_level = round(total_qty / 2)
            elif months_count == 1:
                print('--------------------------1month')
                reorder_level = round(total_qty / 1)
            else:
                print('0----------------------month')
                reorder_level = stock_item.Product_Detials.ReorderLevel or 0
            # reorder_level_one = stock_item.Product_Detials.ReorderLevel or 0

            # Prepare item data
            
            item_data = {
                "id": idx,  
                "ItemCode": product_id,
                "ItemName": stock_item.Product_Detials.ItemName,
                "AvailableQuantity": stock_item.AvailableQuantity,
                "MinimumQuantity": stock_item.Product_Detials.MinimumQty,
                "ReorderLevel":reorder_level,
                "StoreLocation": stock_item.Store_location.Store_Name,
                "StoreId": stock_item.Store_location.Store_Id,
                "LowStockAlert": stock_item.AvailableQuantity < stock_item.Product_Detials.MinimumQty
            }
            idx +=1

            # Fetch supplier details
            supplier_details = Supplier_Product_Amount_Details.objects.filter(
                Supplier_detials__Product_Detials=product_id
            ).order_by("PurchaseRateAfterGST").first()

            if supplier_details:
                purchase_rate = float(supplier_details.PurchaseRateAfterGST)
                total_amount = purchase_rate * reorder_level

                supplier_dict = {
                    "Supplierid": supplier_details.Supplier_detials.Supplier_Detials.Supplier_Id,
                    "SupplierName": supplier_details.Supplier_detials.Supplier_Detials.Supplier_Name,
                    "PurchaseRateAfterGST": f"{purchase_rate:.2f}",
                    "MRP": f"{supplier_details.MRP:.2f}",
                    "TotalAmount": f"{total_amount:.2f}"
                }
                item_data.update(supplier_dict)

            # Append item data to stock_data list
            stock_data.append(item_data)

    return JsonResponse(stock_data, safe=False)




def check_minimum_qty_lessthan_available_qty_withid(request):
    Supplierid = request.GET.get("Supplierid", "").strip()
    itemCode = request.GET.get("itemCode", None)

    # Convert itemCode to an integer if present
    itemCode = int(itemCode) if itemCode and itemCode.isdigit() else None

    supplier_details = None
    supplier_dict = {}

    # Fetch supplier details if Supplierid and itemCode are provided
    if Supplierid and itemCode:
        supplier_details = Supplier_Product_Amount_Details.objects.filter(
            Supplier_detials__Supplier_Detials=Supplierid,
            Supplier_detials__Product_Detials=itemCode
        ).first()

    # If a supplier is found, prepare the response dictionary
    if supplier_details:
        
        purchase_rate = float(supplier_details.PurchaseRateAfterGST)  # Convert to float
        
        # Corrected: Access Product_Detials through Supplier_detials
        reorder_level = supplier_details.Supplier_detials.Product_Detials.ReorderLevel or 0
        total_amount = purchase_rate * reorder_level  # Calculate TotalAmount

        supplier_dict = {
            "Supplierid": supplier_details.Supplier_detials.Supplier_Detials.Supplier_Id,
            "SupplierName": supplier_details.Supplier_detials.Supplier_Detials.Supplier_Name,
            "PurchaseRateAfterGST": f"{purchase_rate:.2f}",  # Format to two decimal places
            "MRP": f"{supplier_details.MRP:.2f}",  # Format to two decimal places
            "TotalAmount": f"{total_amount:.2f}"  # Format to two decimal places
        }

    return JsonResponse(supplier_dict, safe=False)

# def check_and_create_auto_po():
#     # print("🔍 Running stock check...")

#     # Group by product and sum the available quantity across all batches
#     product_stock = (
#         Stock_Maintance_Table_Detials.objects
#         .filter(Product_Detials__Status=True,Store_location_id=1)
#         .values('Product_Detials')  # Group by Product
#         .annotate(total_available=Sum('AvailableQuantity'))
#     )

#     for product in product_stock:
#         product_id = product['Product_Detials']
#         total_available = product['total_available']

#         product_details = Product_Master_All_Category_Details.objects.get(pk=product_id)

#         # Compare total available quantity with minimum quantity
#         if total_available < product_details.MinimumQty:
#             if Purchase_Order_Item_Details.objects.filter(
#                 Q(Item_Status="Waiting For Approve") | Q(Item_Status="Waiting For GRN"),
#                 PO_Item_Detailes__Product_Detials__pk=product_id
#             ).exists():
#                 continue

#             # Calculate reorder level (same logic as before)
#             today = date.today()
#             ninety_days_ago = today - timedelta(days=90)

#             op_qty = OP_BillingItem.objects.filter(
#                 ItemId__Product_Detials=product_id,
#                 Billing__Billing_Date__range=(ninety_days_ago, today)
#             ).aggregate(total_qty=Sum('Billing_Quantity'))['total_qty'] or 0

#             ip_qty = IP_BillingItem.objects.filter(
#                 ItemId__Product_Detials=product_id,
#                 Billing__Billing_Date__range=(ninety_days_ago, today)
#             ).aggregate(total_qty=Sum('Billing_Quantity'))['total_qty'] or 0

#             total_qty = op_qty + ip_qty
#             reorder_level = round(total_qty / 3) if total_qty else (int(product_details.MaximumQty) - int(total_available) or 0)
            
        
#             # Get cheapest supplier
#             cheapest_supplier_detail = Supplier_Product_Amount_Details.objects.filter(
#                 Supplier_detials__Product_Detials=product_id
#             ).order_by("PurchaseRateAfterGST").first()

#             if not cheapest_supplier_detail:
#                 print(f"⚠ No supplier found for {product_details.ItemName}")
#                 continue

#             supplier = cheapest_supplier_detail.Supplier_detials.Supplier_Detials
#             total_amount = float(cheapest_supplier_detail.PurchaseRateAfterGST) * reorder_level

#             po_items = [{
#                 "ItemCode": product_id,
#                 "PurchaseQty": reorder_level,
#                 "TotalAmount": total_amount
#             }]

#             po = create_purchase_order(supplier, po_items)
#             print(f"✅ Auto PO {po.PurchaseOrder_Number} created for {product_details.ItemName}")


def start_inventory_scheduler():
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    all_items = Stock_Maintance_Table_Detials.objects.all()

    for item in all_items:
        product = item.Product_Detials
        batch = item.Batch_No
        store = item.Store_location

        # Opening = yesterday's closing balance
        yesterday_balance = InventoryBalance.objects.filter(
            product=product,
            batch=batch,
            store=store,
            date=yesterday
        ).first()

        opening = yesterday_balance.closing_balance if yesterday_balance else item.AvailableQuantity
        closing = item.AvailableQuantity  # Current live available quantity

        InventoryBalance.objects.update_or_create(
            product=product,
            batch=batch,
            store=store,
            date=today,
            defaults={
                'opening_balance': opening,
                'closing_balance': closing
            }
        )


def start_inventory_check_scheduler():
    """
    Starts a background scheduler to run:
    - Minimum quantity check every 5 seconds
    """
    scheduler = BackgroundScheduler()
    
    scheduler.add_job(
        # check_and_create_auto_po,
        'interval',
        seconds=5,  # Changed from days=1 to seconds=5
        start_date=timezone.now() + timedelta(seconds=1)
    )
    
    try:
        scheduler.start()
        print("Scheduler started successfully for Inventory Minimum Quantity Check.")
    except Exception as e:
        print(f"Failed to start scheduler: {e}")


