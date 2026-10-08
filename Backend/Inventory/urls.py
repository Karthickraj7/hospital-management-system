from .PurchaseOrder import *
from .ProductMaster import *
from .SupplierMaster import *
from .NewSupplierMaster import *
from .NurseStationStock import *
from .views import *
from .task import *
from .GoodsReceiptNote import *
from .PurchaseReports import purchase_reports, purchase_reports_export

from .ProductCategory import Product_Category_Product_Details_link
from .GoodsReceiptNote import (Goods_Reciept_Note_Details_link,Goods_Reciept_Note_Details_link1,Goods_Reciept_Note_Details_Approve_link, getgrnlistforsearch, get_item_details_ForBarcode,get_Purchase_Return_Report,
                               PO_Goods_Reciept_Note_Details_link,PO_Goods_Reciept_Note_GET_Details_link,get_Purchase_Order_Report,Grn_Invoice_link,Purchase_Return_Invoice_linK,
                               Old_Goods_Reciept_Note_stock_supplier_link,get_overall_stock_list_details,
                               get_overall_stock_list_table_column_details,get_overall_stock_list_By_batchwise_details, UpdateMasterDataInGrn, UpdateMasterDataQuickGrn)
from .Indent import (get_ward_store_detials_by_loc,get_item_detials_for_indent,Gen_get_item_detials_for_indent,post_indent_raise_details,get_ward_depart_detials_by_loc,
                     Indent_Raise_Details_Approve_link,get_item_detials_for_batch_indent_issue,GEN_get_item_detials_for_batch_indent_issue,
                     get_serialno_detials_for_batch_indent_issue,post_indent_issue_details,GEN_post_indent_issue_details,GEN_get_ward_store_detials_by_loc,
                     Indent_Issue_Details_Approve_link,GEN_Indent_Issue_Details_Approve_link,Post_Indent_Receive_Details_link,GEN_Post_Indent_Receive_Details_link,Indent_Receive_Details_Approve_link,GEN_Indent_Receive_Details_Approve_link,IndentIssueReport,IndentIssueReportGEN,
    IndentRaiseReport,IndentRaiseReportGEN,IndentReceiveReport,
    IndentReceiveReportGEN,GEN_post_indent_raise_details,GEN_Indent_Raise_Details_Approve_link,)

from .SupplierPay import get_supplier_payment_detials,get_supplier_payment_by_invoice_detials,supplier_payment_day_by_date

from .SerialNoForProduct import (GET_SerialNo_Quelist,SerialNumber_Create_Link,
GET_Last_SerialNumber_ItemDetails,GET_SerialNumber_Prodect_From_Master,Get_SerialNumber,Get_BatchNo,
Get_SerialNumber_Report)

from .ItemMinimumMaximum import (Product_Get_For_MinimumMaximum,get_Reorder_Level_Report,
Single_Item_All_Location_Minimum_Maximum_Qty,
Post_Change_Minimum_Maximum_Qty)

from django.urls import path

urlpatterns = [

    path('get_Drug_segments',get_Drug_segments,name='get_Drug_segments'),
    path('get_unit_of_measurements',get_unit_of_measurements,name='get_unit_of_measurements'),
    path('Product_Category_Product_Details_link',Product_Category_Product_Details_link,name='Product_Category_Product_Details_link'),
    path('get_Product_fields_for_productcategory',get_Product_fields_for_productcategory,name='get_Product_fields_for_productcategory'),
    path('product_master_Detials_link',product_master_Detials_link,name='product_master_Detials_link'),
    path('Update_product_master_status',Update_product_master_status,name='Update_product_master_status'),
    path('Supplier_Master_Link',Supplier_Master_Link,name='Supplier_Master_Link'),
    path('Supplier_product_Mapping_link',Supplier_product_Mapping_link,name='Supplier_product_Mapping_link'),
    path('Product_wise_supplier_getdata',Product_wise_supplier_getdata,name='Product_wise_supplier_getdata'),
    path('Supplier_Data_Get',Supplier_Data_Get,name='Supplier_Data_Get'),
    path('Supplier_Master_Link_GEN',Supplier_Master_Link_GEN,name='Supplier_Master_Link_GEN'),
    path('Supplier_Data_Get_GEN',Supplier_Data_Get_GEN,name='Supplier_Data_Get_GEN'),
    path('Supplier_Data_Get_Optical',Supplier_Data_Get_Optical,name='Supplier_Data_Get_Optical'),
    # path('Supplier_Product_Category_link',Supplier_Product_Category_link,name='Supplier_Product_Category_link'),
    path('PurchaseOrder_Link',PurchaseOrder_Link,name='PurchaseOrder_Link'),
    path('PurchaseOrder_Report_Details',PurchaseOrder_Report_Details,name='PurchaseOrder_Report_Details'),
    path('PurchaseOrder_Itemwise_Link',PurchaseOrder_Itemwise_Link,name='PurchaseOrder_Itemwise_Link'),

    path('GET_Product_Detials_For_Tray_link',GET_Product_Detials_For_Tray_link,name='GET_Product_Detials_For_Tray_link'),
    path('GET_Product_Detials_For_Tray_link2',GET_Product_Detials_For_Tray_link2,name='GET_Product_Detials_For_Tray_link2'),

    
    path('PO_SupplierWise_product_Get',PO_SupplierWise_product_Get,name='PO_SupplierWise_product_Get'),
    path('PO_Supplier_Data_Get',PO_Supplier_Data_Get,name='PO_Supplier_Data_Get'),
    path('Goods_Reciept_Note_Details_link',Goods_Reciept_Note_Details_link,name='Goods_Reciept_Note_Details_link'),
    path('Goods_Reciept_Note_Details_Approve_link',Goods_Reciept_Note_Details_Approve_link,name='Goods_Reciept_Note_Details_Approve_link'),
    path('Old_Goods_Reciept_Note_stock_supplier_link',Old_Goods_Reciept_Note_stock_supplier_link,name='Old_Goods_Reciept_Note_stock_supplier_link'),
    path('get_overall_stock_list_table_column_details',get_overall_stock_list_table_column_details,name='get_overall_stock_list_table_column_details'),
    path('get_overall_stock_list_By_batchwise_details',get_overall_stock_list_By_batchwise_details,name='get_overall_stock_list_By_batchwise_details'),
    path('get_overall_stock_list_details',get_overall_stock_list_details,name='get_overall_stock_list_details'),
    
    
    # get store and ward store loc
    path('get_ward_store_detials_by_loc',get_ward_store_detials_by_loc,name='get_ward_store_detials_by_loc'),
    path('GEN_get_ward_store_detials_by_loc',GEN_get_ward_store_detials_by_loc,name='GEN_get_ward_store_detials_by_loc'),
    path('get_ward_depart_detials_by_loc',get_ward_depart_detials_by_loc,name='get_ward_depart_detials_by_loc'),
    path('get_item_detials_for_indent',get_item_detials_for_indent,name='get_item_detials_for_indent'),
    path('get_item_detials_for_batch_indent_issue',get_item_detials_for_batch_indent_issue,name='get_item_detials_for_batch_indent_issue'),
    path('GEN_get_item_detials_for_batch_indent_issue',GEN_get_item_detials_for_batch_indent_issue,name='GEN_get_item_detials_for_batch_indent_issue'),
    path('get_serialno_detials_for_batch_indent_issue',get_serialno_detials_for_batch_indent_issue,name='get_serialno_detials_for_batch_indent_issue'),
   
    # indent
    path('post_indent_raise_details',post_indent_raise_details,name='post_indent_raise_details'),
    path('Indent_Raise_Details_Approve_link',Indent_Raise_Details_Approve_link,name='Indent_Raise_Details_Approve_link'),
    path('post_indent_issue_details',post_indent_issue_details,name='post_indent_issue_details'),
    path('GEN_post_indent_issue_details',GEN_post_indent_issue_details,name='GEN_post_indent_issue_details'),
    path('Indent_Issue_Details_Approve_link',Indent_Issue_Details_Approve_link,name='Indent_Issue_Details_Approve_link'),
    path('GEN_Indent_Issue_Details_Approve_link',GEN_Indent_Issue_Details_Approve_link,name='GEN_Indent_Issue_Details_Approve_link'),
    path('Post_Indent_Receive_Details_link',Post_Indent_Receive_Details_link,name='Post_Indent_Receive_Details_link'),
    path('GEN_Post_Indent_Receive_Details_link',GEN_Post_Indent_Receive_Details_link,name='GEN_Post_Indent_Receive_Details_link'),
    path('Indent_Receive_Details_Approve_link',Indent_Receive_Details_Approve_link,name='Indent_Receive_Details_Approve_link'),
    path('GEN_Indent_Receive_Details_Approve_link',GEN_Indent_Receive_Details_Approve_link,name='GEN_Indent_Receive_Details_Approve_link'),
    
    path('PO_Goods_Reciept_Note_Details_link',PO_Goods_Reciept_Note_Details_link,name='PO_Goods_Reciept_Note_Details_link'),
    path('PO_Goods_Reciept_Note_GET_Details_link',PO_Goods_Reciept_Note_GET_Details_link,name='PO_Goods_Reciept_Note_GET_Details_link'),

    # supplier pay
    path('get_supplier_payment_detials',get_supplier_payment_detials,name='get_supplier_payment_detials'),
    path('get_supplier_payment_by_invoice_detials',get_supplier_payment_by_invoice_detials,name='get_supplier_payment_by_invoice_detials'),
    path('supplier_payment_day_by_date',supplier_payment_day_by_date,name='supplier_payment_day_by_date'),
    
    path('GET_SerialNo_Quelist',GET_SerialNo_Quelist,name='GET_SerialNo_Quelist'),
    path('SerialNumber_Create_Link',SerialNumber_Create_Link,name='SerialNumber_Create_Link'),
    path('GET_Last_SerialNumber_ItemDetails',GET_Last_SerialNumber_ItemDetails,name='GET_Last_SerialNumber_ItemDetails'),
    path('GET_SerialNumber_Prodect_From_Master',GET_SerialNumber_Prodect_From_Master,name='GET_SerialNumber_Prodect_From_Master'),
    path('Get_SerialNumber',Get_SerialNumber,name='Get_SerialNumber'),
    path('Get_BatchNo',Get_BatchNo,name='Get_BatchNo'),
    path('Get_SerialNumber_Report',Get_SerialNumber_Report,name='Get_SerialNumber_Report'),

    path('Product_Get_For_MinimumMaximum',Product_Get_For_MinimumMaximum,name='Product_Get_For_MinimumMaximum'),
    path('Single_Item_All_Location_Minimum_Maximum_Qty',Single_Item_All_Location_Minimum_Maximum_Qty,name='Single_Item_All_Location_Minimum_Maximum_Qty'),
    path('Post_Change_Minimum_Maximum_Qty',Post_Change_Minimum_Maximum_Qty,name='Post_Change_Minimum_Maximum_Qty'),
    
    path('GRN_Details_GET_For_PurchseReturn',GRN_Details_GET_For_PurchseReturn,name='GRN_Details_GET_For_PurchseReturn'),
    path('PurcchaseReturn_Link',PurcchaseReturn_Link,name='PurcchaseReturn_Link'),
    path('PurchaseReturn_Report_Link',PurchaseReturn_Report_Link,name='PurchaseReturn_Report_Link'),
    path('PurchaseReturn_StatusUpdate',PurchaseReturn_StatusUpdate,name='PurchaseReturn_StatusUpdate'),


    # views
    path('Sub_Product_Category_Details_by_Product', Sub_Product_Category_Details_by_Product, name='Sub_Product_Category_Details_by_Product'),
    path('Items_by_ProductCategory_Details', Items_by_ProductCategory_Details, name='Items_by_ProductCategory_Details'),
    path('Item_wise_supplier_getdata', Item_wise_supplier_getdata, name='Item_wise_supplier_getdata'),
    path('SupplierId_Supplier_Data_Get', SupplierId_Supplier_Data_Get, name='SupplierId_Supplier_Data_Get'),
    path('PO_SupplierWise_Item_Get', PO_SupplierWise_Item_Get, name='PO_SupplierWise_Item_Get'),

    # nursestationlink
    path("get_NurseStation_Details_list", get_NurseStation_Details_list, name='get_NurseStation_Details_list'),
    path('get_Product_Category_byNurseStation', get_Product_Category_byNurseStation, name='get_Product_Category_byNurseStation'),
    path('get_SubProductCategory_byProductCategory', get_SubProductCategory_byProductCategory, name='get_SubProductCategory_byProductCategory'),
    path('get_Item_Details_byNurseStation', get_Item_Details_byNurseStation,name='get_Item_Details_byNurseStation'),
    path('get_NurseStationall_Details_list', get_NurseStationall_Details_list, name='get_NurseStationall_Details_list'),


    path('Manufacturer_Names_link', Manufacturer_Names_link, name='Manufacturer_Names_link'),
    path('ItemNames_for_RepMaster', ItemNames_for_RepMaster, name='ItemNames_for_RepMaster'),
    path('MedicalRep_Details_Link', MedicalRep_Details_Link, name='MedicalRep_Details_Link'),
    path('Medical_Rep', Medical_Rep, name='Medical_Rep'),
    path('all_supplier_details_link', all_supplier_details_link, name='all_supplier_details_link'),


    # bharathi17/3/2025
    path('All_Supplier_Details_Upload', All_Supplier_Details_Upload, name='All_Supplier_Details_Upload'),
    path('Product_Master_File_Upload', Product_Master_File_Upload, name='Product_Master_File_Upload'),
    path('Product_Master_File_Upload_GEN', Product_Master_File_Upload_GEN, name='Product_Master_File_Upload_GEN'),
    path('Medical_RepMaster_File_Upload', Medical_RepMaster_File_Upload, name='Medical_RepMaster_File_Upload'),
    
    # 19/3/2025
    # path('Medical_RepMaster_File_Upload', Medical_RepMaster_File_Upload, name='Medical_RepMaster_File_Upload'),
    path('get_item_details_batchwiseExpiryStatus', get_item_details_batchwiseExpiryStatus, name='get_item_details_batchwiseExpiryStatus'),
    # path('Supplier_Data_Get', Supplier_Data_Get, name='Supplier_Data_Get'),
    path('Product_Master_data_link', Product_Master_data_link, name='Product_Master_data_link'),
    path('Get_BatchNumber_From_Stock_data_link', Get_BatchNumber_From_Stock_data_link, name='Get_BatchNumber_From_Stock_data_link'),
    # path('check_minimum_qty_lessthan_available_qty', check_minimum_qty_lessthan_available_qty, name='check_minimum_qty_lessthan_available_qty'),
    # path('check_minimum_qty_lessthan_available_qty_withid', check_minimum_qty_lessthan_available_qty_withid, name='check_minimum_qty_lessthan_available_qty_withid'),
    path('get_Purchase_Order_Report', get_Purchase_Order_Report, name='get_Purchase_Order_Report'),
    path('Grn_Invoice_link', Grn_Invoice_link, name='Grn_Invoice_link'),
    path('getgrnlistforsearch',  getgrnlistforsearch, name='getgrnlistforsearch'),
    path('get_item_details_ForBarcode', get_item_details_ForBarcode, name='get_item_details_ForBarcode'),
    path('get_Purchase_Return_Report', get_Purchase_Return_Report, name='get_Purchase_Return_Report'),
    path('Purchase_Return_Invoice_linK', Purchase_Return_Invoice_linK, name='Purchase_Return_Invoice_linK'),
    path('get_items_details_StockEvaluationSingleItem', get_items_details_StockEvaluationSingleItem, name='get_items_details_StockEvaluationSingleItem'),
    path('get_items_details_StockEvaluationReport', get_items_details_StockEvaluationReport, name='get_items_details_StockEvaluationReport'),
    path('get_items_details_StockMovementReport', get_items_details_StockMovementReport, name='get_items_details_StockMovementReport'),
    path('All_Items_Link', All_Items_Link, name='All_Items_Link'),
    path('All_Doctors_Item_Link', All_Doctors_Item_Link, name='All_Doctors_Item_Link'),
    path('Item_Doctor_Mapping_Link', Item_Doctor_Mapping_Link, name='Item_Doctor_Mapping_Link'),
    path('get_Reorder_Level_Report', get_Reorder_Level_Report, name='get_Reorder_Level_Report'),
    path('get_all_store_locations', get_all_store_locations, name='get_all_store_locations'),
    path('get_item_details_batchwise_for_stockadjusment', get_item_details_batchwise_for_stockadjusment, name='get_item_details_batchwise_for_stockadjusment'),
    path('get_all_nurse_station_link', get_all_nurse_station_link, name='get_all_nurse_station_link'),
    path('changestockavailableqty', changestockavailableqty, name='changestockavailableqty'),
    path('Get_All_Opening_Closing_Balance',  Get_All_Opening_Closing_Balance, name='Get_All_Opening_Closing_Balance'),
    path('Supplierid_ItemNameMapping_Upload', Supplierid_ItemNameMapping_Upload, name='Supplierid_ItemNameMapping_Upload'),
    path('Stock_Excel_File_Upload', Stock_Excel_File_Upload, name='Stock_Excel_File_Upload'),
    path('UpdateMasterDataInGrn', UpdateMasterDataInGrn, name='UpdateMasterDataInGrn'),
    path('UpdateMasterDataQuickGrn', UpdateMasterDataQuickGrn, name='UpdateMasterDataQuickGrn'),
    path('get_available_stocks', get_available_stocks, name='get_available_stocks'),
    path('grn_report_by_reason', grn_report_by_reason, name='grn_report_by_reason'),
    path('Opening_Balance_Closing_Balance', Opening_Balance_Closing_Balance, name='Opening_Balance_Closing_Balance'),
    

    path("IndentRaiseReport", IndentRaiseReport, name="IndentRaiseReport"),
    path("IndentRaiseReportGEN", IndentRaiseReportGEN, name="IndentRaiseReportGEN"),
    path("IndentIssueReport", IndentIssueReport, name="IndentIssueReport"),
    path("IndentIssueReportGEN", IndentIssueReportGEN, name="IndentIssueReportGEN"),
    path("IndentReceiveReport", IndentReceiveReport, name="IndentReceiveReport"),
    path("IndentReceiveReportGEN", IndentReceiveReportGEN, name="IndentReceiveReportGEN"),
    path("Purchase_Reports", purchase_reports, name="purchase_reports"),
    path("Stock_Maintenance_List", Stock_Maintenance_List, name="Stock_Maintenance_List"),
    path("edit_stock", edit_stock, name="edit_stock"),
    path("stock_audit_report", stock_audit_report, name="stock_audit_report"),
    path("list_stocks", list_stocks, name="list_stocks"),
    path("list_stocks1", list_stocks1, name="list_stocks1"),
    path("delete_stock", delete_stock, name="delete_stock"),
    path("Goods_Reciept_Note_Details_link1", Goods_Reciept_Note_Details_link1, name="Goods_Reciept_Note_Details_link1"),
    path("Goods_Reciept_Note_Details_link1_GEN", Goods_Reciept_Note_Details_link1_GEN, name="Goods_Reciept_Note_Details_link1_GEN"),
    path("bulk_edit_stock", bulk_edit_stock, name="bulk_edit_stock"),
    path("Store_Data_list", Store_Data_list, name="Store_Data_list"),
    path("pharmacysalesproductwise", pharmacysalesproductwise, name="pharmacysalesproductwise"),
    path("Product_Data_list", Product_Data_list, name="Product_Data_list"),
    path("Add_Stock_Item", Add_Stock_Item, name="Add_Stock_Item"),
    path("GST_Sales_Report", GST_Sales_Report, name="GST_Sales_Report"),
    path("GST_Refund_Report", GST_Refund_Report, name="GST_Refund_Report"),
    path("Sales_Return_HSN_Report", Sales_Return_HSN_Report, name="Sales_Return_HSN_Report"),
    path("GST_Purchase_Report_GST", GST_Purchase_Report_GST, name="GST_Purchase_Report_GST"),
    path("HSN_Sales_Report", HSN_Sales_Report, name="HSN_Sales_Report"),
    path("SupplierBillNumberCheck", SupplierBillNumberCheck, name="SupplierBillNumberCheck"),
    path("supplier_accounts_report", supplier_accounts_report, name="supplier_accounts_report"),


    # opticals -----------------
    path("Goods_Reciept_Note_Details_link_Optical", Goods_Reciept_Note_Details_link_Optical, name="Goods_Reciept_Note_Details_link_Optical"),
    path("Goods_Reciept_Note_Details_link_GEN", Goods_Reciept_Note_Details_link_GEN, name="Goods_Reciept_Note_Details_link_GEN"),
    path("Supplier_Master_Link_Optical", Supplier_Master_Link_Optical, name="Supplier_Master_Link_Optical"),
    # path("Supplier_Master_Link_GEN", Supplier_Master_Link_GEN, name="Supplier_Master_Link_GEN"),
    path("product_master_Detials_link_Optical", product_master_Detials_link_Optical, name="product_master_Detials_link_Optical"),
    path("product_master_Detials_link_GEN", product_master_Detials_link_GEN, name="product_master_Detials_link_GEN"),
    path("Store_Data_list_optical", Store_Data_list_optical, name="Store_Data_list_optical"),
    path("Product_Data_list_Opticals", Product_Data_list_Opticals, name="Product_Data_list_Opticals"),
      path('department-location/', get_department_location),                 # GET (list)
    path('department-location/create/', create_department_location),        # POST
    path('department-location/update/<int:pk>/', update_department_location),  # PUT
    path('department-location/delete/<int:pk>/', delete_department_location),  # DELETE (soft)
    path('Gen_get_item_detials_for_indent', Gen_get_item_detials_for_indent,name='Gen_get_item_detials_for_indent'),  # DELETE (soft)
    path('GEN_post_indent_raise_details', GEN_post_indent_raise_details,name='GEN_post_indent_raise_details'),  # DELETE (soft)
    path('GEN_Indent_Raise_Details_Approve_link', GEN_Indent_Raise_Details_Approve_link,name='GEN_Indent_Raise_Details_Approve_link'),  # DELETE (soft)
   


]
