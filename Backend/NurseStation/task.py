from django.utils import timezone
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import timedelta

# Module-level global variables
collected_items_per_nurse = {}  # { nurse_id: [{product, qty}] }
last_run_time_per_shift = None

def auto_raise_indent():
    """
    Collect low-stock items per nurse station and raise a separate indent at shift end.
    """
    global collected_items_per_nurse, last_run_time_per_shift

    from Masters.models import (
        Stock_Maintance_Table_Detials,
        Location_Detials,
        Inventory_Location_Master_Detials,
        NurseStationMaster
    )
    from .models import MinMaxForNurseStation
    from Inventory.models import Indent_raise_details_table, Indent_raise_items_details_table

    now = timezone.now()
    print(f"[DEBUG] Scheduler running at {now}")

    # Determine shift end time
    if 9 <= now.hour < 17:  # Day shift
        shift_end_time = now.replace(hour=17, minute=0, second=0, microsecond=0)
    else:  # Night shift
        if now.hour >= 17:
            shift_end_time = now.replace(hour=8, minute=30, second=0, microsecond=0) + timedelta(days=1)
        else:
            shift_end_time = now.replace(hour=8, minute=30, second=0, microsecond=0)
    print(f"[DEBUG] Current shift end time: {shift_end_time}")

    # Get locations
    loc = Location_Detials.objects.get(Location_Id=1)
    stor_loc = Inventory_Location_Master_Detials.objects.get(Store_Id=1)

    # Collect low-stock items per nurse station
    minmax_records = MinMaxForNurseStation.objects.select_related(
        'NurseStation', 'Prod_Stock', 'Prod_Stock__Product_Detials'
    ).all()
    print(f"[DEBUG] Total MinMax records: {minmax_records.count()}")

    for record in minmax_records:
        nurse = record.NurseStation
        # Filter stock specifically for this nurse station
        stocks = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials=record.Prod_Stock.Product_Detials,
            NurseStation_location=nurse
        )

        for stock in stocks:
            needed_qty = max(record.Max_Qty - stock.AvailableQuantity, 0)
            if needed_qty <= 0:
                print(f"[DEBUG] {stock.Product_Detials.ItemName} sufficient for {nurse.NurseStationName}")
                continue

            # Skip if already raised
            if Indent_raise_items_details_table.objects.filter(
                Product_Detials=stock.Product_Detials,
                Indent_Detials__Raise_From_NurseStation_Location=nurse,
                Raise_Status__in=['Raised', 'Pending']
            ).exists():
                print(f"[DEBUG] Skipping {stock.Product_Detials.ItemName} for {nurse.NurseStationName} (already raised)")
                continue

            # Initialize nurse in dict
            if nurse.NurseStationid not in collected_items_per_nurse:
                collected_items_per_nurse[nurse.NurseStationid] = []

            # Add product
            collected_items_per_nurse[nurse.NurseStationid].append({
                'product': stock.Product_Detials,
                'qty': needed_qty
            })
            print(f"[COLLECTED] Nurse: {nurse.NurseStationName}, Product: {stock.Product_Detials.ItemName}, Qty: {needed_qty}")

    # Show summary
    print("\n[DEBUG] ===== SUMMARY OF COLLECTED ITEMS =====")
    for nurse_id, items in collected_items_per_nurse.items():
        nurse_name = NurseStationMaster.objects.get(NurseStationid=nurse_id).NurseStationName
        print("[DEBUG] Preparing summary for nurse:", nurse_name)
        for x in items:
            print("[CHECK] Product object:", x['product'], type(x['product']))
        debug_list = [{"product": x['product'].ItemName if x['product'] else "UNKNOWN", "qty": x['qty']} for x in items]




        print(f"[DEBUG] Nurse: {nurse_name}, Items: {debug_list}")
    print("[DEBUG] ======================================\n")

    # Raise indents at shift end
    if now >= shift_end_time and (last_run_time_per_shift is None or last_run_time_per_shift < shift_end_time):
        for nurse_id, items in collected_items_per_nurse.items():
            if not items:
                continue

            nurse_obj = NurseStationMaster.objects.get(NurseStationid=nurse_id)
            indent_details = Indent_raise_details_table.objects.create(
                Raise_From_Location=loc,
                Raise_From_NurseStation_Store=True,
                Raise_To_Location=loc,
                Raise_From_NurseStation_Location=nurse_obj,
                Raise_To_Store_Location=stor_loc,
                Raise_Date=now,
                Raise_Reason="Auto-generated at shift end",
                Raise_Status="Raised",
                Raise_by="System",
            )

            # Bulk create items
            indent_items = [
                Indent_raise_items_details_table(
                    Indent_Detials=indent_details,
                    Product_Detials=item['product'],
                    Raise_Quantity=item['qty'],
                    Pending_Quantity=item['qty'],
                    Raise_Status="Raised",
                    Issue_Status="Waiting",
                    Reason="Auto-generated by scheduler"
                ) for item in items
            ]
            Indent_raise_items_details_table.objects.bulk_create(indent_items)
            print(f"[RAISED] Indent created for {len(items)} products for nurse {nurse_obj.NurseStationName}")

        # Clear after raising
        collected_items_per_nurse = {}
        last_run_time_per_shift = now

def start_test_scheduler():
    """
    Starts the scheduler for testing every 6 seconds.
    """
    print('[DEBUG] Starting auto-indent scheduler (6 sec interval)...')
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        auto_raise_indent,
        trigger='interval',
        seconds=600,
        next_run_time=timezone.now() + timedelta(seconds=1)
    )
    scheduler.start()
    print("[DEBUG] Scheduler started")
