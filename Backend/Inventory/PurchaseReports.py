from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from django.db.models import Sum, Count, Avg, F, Max
from django.db.models.functions import TruncDate
from Masters.models import *
from Inventory.models import *
import pandas as pd
from io import BytesIO
from datetime import datetime


@api_view(["GET"])
def purchase_reports(request):
    try:
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        report_type = request.GET.get("report_type")
        supplier_id = request.GET.get("supplier_id")
        product_id = request.GET.get("product_id")

        # Base queryset
        po_queryset = Purchase_Order_Details.objects.filter(
            Order_Date__range=[start_date, end_date]
        )

        if supplier_id:
            po_queryset = po_queryset.filter(Supplier_Id=supplier_id)

        if report_type == "date":
            # Date-wise report
            report_data = (
                po_queryset.annotate(date=TruncDate("Order_Date"))
                .values("date", "PurchaseOrder_Number", "Supplier_Id__Supplier_Name")
                .annotate(
                    total_items=Count("ItemTable_PO_Number"),
                    total_amount=Sum("ItemTable_PO_Number__TotalAmount"),
                )
                .order_by("date")
            )

            # Format the response
            response_data = [
                {
                    "date": item["date"].strftime("%Y-%m-%d"),
                    "po_number": item["PurchaseOrder_Number"],
                    "supplier_name": item["Supplier_Id__Supplier_Name"],
                    "total_items": item["total_items"],
                    "total_amount": float(item["total_amount"] or 0),
                    "status": "Completed",  # You might want to add actual status logic
                }
                for item in report_data
            ]

        elif report_type == "product":
            # Product-wise report
            items_queryset = Purchase_Order_Item_Details.objects.filter(
                PurchaseOrder__in=po_queryset
            )

            if product_id:
                items_queryset = items_queryset.filter(
                    PO_Item_Detailes__Product_Detials=product_id
                )

            report_data = (
                items_queryset.values(
                    "PurchaseOrder__PurchaseOrder_Number",
                    "PurchaseOrder__Order_Date",
                    "PurchaseOrder__PO_Status",
                    "PO_Item_Detailes__Product_Detials__ItemName",
                    "PO_Item_Detailes__Product_Detials__ProductCategory__ProductCategory_Name",
                    "PurchaseOrder__Supplier_Id__Supplier_Name",
                )
                .annotate(
                    total_orders=Count("PurchaseOrder", distinct=True),
                    total_quantity=Sum("PO_Order_Qty"),
                    total_value=Sum("TotalAmount"),
                    average_price=Avg("TotalAmount"),
                )
                .order_by("-PurchaseOrder__Order_Date")
            )

            response_data = [
                {
                    "product_name": item["PO_Item_Detailes__Product_Detials__ItemName"],
                    "category": item[
                        "PO_Item_Detailes__Product_Detials__ProductCategory__ProductCategory_Name"
                    ],
                    "po_number": item["PurchaseOrder__PurchaseOrder_Number"],
                    "order_date": item["PurchaseOrder__Order_Date"].strftime(
                        "%Y-%m-%d"
                    ),
                    "po_status": item["PurchaseOrder__PO_Status"],
                    "supplier_name": item["PurchaseOrder__Supplier_Id__Supplier_Name"],
                    "total_orders": item["total_orders"],
                    "total_quantity": float(item["total_quantity"] or 0),
                    "total_value": float(item["total_value"] or 0),
                    "average_price": float(item["average_price"] or 0),
                }
                for item in report_data
            ]

        else:  # supplier-wise
            report_data = (
                po_queryset.values(
                    "Supplier_Id__Supplier_Name",
                    "PurchaseOrder_Number",
                    "Order_Date",
                    "PO_Status",
                    "Total_Order_Value",
                    "Billing_Location__Location_Name",
                    "Shipping_Location__Location_Name",
                )
                .annotate(
                    total_orders=Count("PurchaseOrder_Number"),
                    total_items=Count("ItemTable_PO_Number"),
                    total_value=Sum("ItemTable_PO_Number__TotalAmount"),
                    average_order_value=Avg("ItemTable_PO_Number__TotalAmount"),
                )
                .order_by("-Order_Date")
            )

            response_data = [
                {
                    "Supplier_Name": item["Supplier_Id__Supplier_Name"],
                    "PO_Number": item["PurchaseOrder_Number"],
                    "Order_Date": item["Order_Date"].strftime("%Y-%m-%d"),
                    "PO_Status": item["PO_Status"],
                    "Total_Order_Value": float(item["Total_Order_Value"] or 0),
                    "Total_Items": item["total_items"],
                    "Total_Value": float(item["total_value"] or 0),
                    "Average_Order_Value": float(item["average_order_value"] or 0),
                    "Billing_Location": item["Billing_Location__Location_Name"],
                    "Shipping_Location": item["Shipping_Location__Location_Name"],
                }
                for item in report_data
            ]

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET"])
def purchase_reports_export(request):
    try:
        # Get the report data using the existing function
        report_data = purchase_reports(request)

        if isinstance(report_data, JsonResponse):
            data = report_data.content
        else:
            return report_data  # Return error response if any

        # Convert to DataFrame
        df = pd.DataFrame(data)

        # Create Excel file
        output = BytesIO()
        with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
            df.to_excel(writer, sheet_name="Purchase Report", index=False)

            # Get workbook and worksheet objects
            workbook = writer.book
            worksheet = writer.sheets["Purchase Report"]

            # Add some formatting
            header_format = workbook.add_format(
                {"bold": True, "bg_color": "#D3D3D3", "border": 1}
            )

            # Apply formatting to header row
            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num, value, header_format)
                worksheet.set_column(col_num, col_num, 15)  # Set column width

        # Prepare the response
        output.seek(0)
        response = HttpResponse(
            output.read(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = (
            f'attachment; filename=Purchase_Report_{datetime.now().strftime("%Y%m%d")}.xlsx'
        )

        return response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
