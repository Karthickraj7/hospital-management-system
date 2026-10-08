from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from Masters.models import NurseStationMaster,Inventory_Location_Master_Detials,Location_Detials,Inventory_Page_Access_Detailes,Department_Location_Master_Detials
from .models import (
    Product_Category_Product_Details,Product_Master_All_Category_Details,GEN_Indent_receive_details_table,GEN_Indent_receive_items_details_table,
    
    Indent_raise_details_table,Indent_raise_items_details_table,
    Indent_issue_details_table,GEN_Indent_issue_details_table,Indent_issue_items_details_table,GEN_Indent_issue_items_details_table,
    Indent_receive_details_table,Indent_receive_items_details_table,
    Stock_Maintance_Table_Detials,
    GEN_Indent_raise_details_table,
    SerialNumber_Stock_Maintance_Table_Detials,GEN_Indent_raise_items_details_table)
from django.db.models import  Q
import json
from django.db import transaction
from .GoodsReceiptNote import get_or_none,to_integer
from django.utils import timezone
from datetime import datetime
from django.db.models import Sum


def get_ward_store_detials_by_loc(request):
    try:
        Location = request.GET.get('Location')
        IsFromWardStore =request.GET.get('IsFromWardStore','true') == 'true'
        
        
        print('llll---',Location,IsFromWardStore)

        if not Location:
            return JsonResponse({'error': 'Location is required'}, status=400)
        
        response_data = []
        if IsFromWardStore:
            # Base query for WardType_Master_Details
            dataa_ins = NurseStationMaster.objects.filter(
                Status=True,
                Location_Name__pk =Location
            )
            for ins in dataa_ins:
                dict_dat={
                    'id':ins.pk,
                    'NurseStation':ins.NurseStationName,
                    'BuildingName':ins.Building_Name.Building_Name,
                    'BlockName':ins.Block_Name.Block_Name,
                    'FloorName':ins.Floor_Name.Floor_Name,
                  
                }
                response_data.append(dict_dat)
        else:
            dataa_ins = Inventory_Location_Master_Detials.objects.filter(
                Status =True,
                Location_Name__pk = Location
            )
            for ins in dataa_ins:
                dict_dat={
                    'id':ins.pk,
                    'StoreName':ins.Store_Name,
                    'BuildingName':ins.Building_Name.Building_Name,
                    'BlockName':ins.Block_Name.Block_Name,
                    'FloorName':ins.Floor_Name.Floor_Name,
                  
                }
                response_data.append(dict_dat)
        
        
        
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



def GEN_get_ward_store_detials_by_loc(request):
    try:
        Location = request.GET.get('Location')
        IsFromWardStore =request.GET.get('IsFromWardStore','true') == 'true'
        
        
        print('llll---',Location,IsFromWardStore)

        if not Location:
            return JsonResponse({'error': 'Location is required'}, status=400)
        
        response_data = []
        if IsFromWardStore:
            # Base query for WardType_Master_Details
            dataa_ins = NurseStationMaster.objects.filter(
                Status=True,
                Location_Name__pk =Location
            )
            for ins in dataa_ins:
                dict_dat={
                    'id':ins.pk,
                    'NurseStation':ins.NurseStationName,
                    'BuildingName':ins.Building_Name.Building_Name,
                    'BlockName':ins.Block_Name.Block_Name,
                    'FloorName':ins.Floor_Name.Floor_Name,
                  
                }
                response_data.append(dict_dat)
        else:
            dataa_ins = Inventory_Location_Master_Detials.objects.filter(
                Status =True,
                Location_Name__pk = Location,
                Store_Id=5
            )
            for ins in dataa_ins:
                dict_dat={
                    'id':ins.pk,
                    'StoreName':ins.Store_Name,
                    'BuildingName':ins.Building_Name.Building_Name,
                    'BlockName':ins.Block_Name.Block_Name,
                    'FloorName':ins.Floor_Name.Floor_Name,
                  
                }
                response_data.append(dict_dat)
        
        
        
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)




def get_ward_depart_detials_by_loc(request):
    try:
        Location = request.GET.get('Location')
        IsFromWardStore =request.GET.get('IsFromWardStore','true') == 'true'
        
        
        print('llll---',Location,IsFromWardStore)

        if not Location:
            return JsonResponse({'error': 'Location is required'}, status=400)
        
        response_data = []
        if IsFromWardStore:
            # Base query for WardType_Master_Details
            dataa_ins = NurseStationMaster.objects.filter(
                Status=True,
                Location_Name__pk =Location
            )
            for ins in dataa_ins:
                dict_dat={
                    'id':ins.pk,
                    'NurseStation':ins.NurseStationName,
                    'BuildingName':ins.Building_Name.Building_Name,
                    'BlockName':ins.Block_Name.Block_Name,
                    'FloorName':ins.Floor_Name.Floor_Name,
                  
                }
                response_data.append(dict_dat)
        else:
            dataa_ins = Department_Location_Master_Detials.objects.filter(
                Status =True,
                Location_Name__pk = Location
            )
            for ins in dataa_ins:
                dict_dat={
                    'id':ins.pk,
                    'StoreName':ins.Store_Name,
                    # 'BuildingName':ins.Building_Name.Building_Name,
                    # 'BlockName':ins.Block_Name.Block_Name,
                    # 'FloorName':ins.Floor_Name.Floor_Name,
                  
                }
                response_data.append(dict_dat)
        
        
        
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



# @csrf_exempt
# @require_http_methods(["GET"])
# def get_item_detials_for_indent(request):
#     if request.method == "GET":
#         try:
#             ItemCode = request.GET.get('ItemCode')
#             ItemName = request.GET.get('ItemName')
#             filtercondition=Q()
#             if ItemCode:
#                 filtercondition &= Q(pk__icontains=ItemCode)
#             if ItemName:
#                 filtercondition &= Q(ItemName__icontains=ItemName)
                
#             product_ins = Product_Master_All_Category_Details.objects.filter(Status=True).filter(filtercondition)[:10]
#             productlist=[]
#             for ins in product_ins:
               
#                 product_field_names = Product_Category_Product_Details.objects.get(pk = ins.SubCategory.ProductCategoryId.pk).Product_fields.values_list('field_Name',flat=True)
             
#                 data = {
#                     'id': ins.pk,
#                     'ItemName': ins.ItemName,
#                     'ProductCategory': ins.SubCategory.ProductCategoryId.ProductCategory_Name,
#                     'SubCategory': ins.SubCategory.SubCategoryName,
#                     'CompanyName': ins.CompanyName.CompanyName if ins.CompanyName else '',
#                     'GenericName': ins.GenericName.GenericName if ins.GenericName else '',
#                     'HSNCode': ins.HSNCode if ins.HSNCode else '',
#                     'PackType': ins.PackType.PackType_Name if ins.PackType else 'Nill',
#                     'PackQuantity': ins.PackQty if ins.PackQty else 'Nill',
#                 }
#                 filtereddata={}
#                 for fields,value in data.items():
#                     if fields in ['id','MRP','PurchaseRateBeforeGST','GST','PurchaseRateAfterGST']:
#                         filtereddata[fields]=value 
#                     else:
#                         cleaned_product_field_names = [field.replace(' ', '') for field in product_field_names]
#                         if fields in cleaned_product_field_names:
#                             filtereddata[fields]=value
                    

#                 productlist.append(filtereddata)
#             return JsonResponse(productlist, safe=False)
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#     else:
#         return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=500)
    

@csrf_exempt
@require_http_methods(["GET"])
def get_item_detials_for_indent(request):
    try:
        ItemCode = request.GET.get('ItemCode')
        ItemName = request.GET.get('ItemName')
        loc = request.GET.get('loc')

        filtercondition = Q()
        if ItemCode:
            filtercondition &= Q(pk__icontains=ItemCode)
        if ItemName:
            filtercondition &= Q(ItemName__icontains=ItemName)

        product_ins = Product_Master_All_Category_Details.objects.filter(Status=True,Is_GEN=False,Is_Optical=False).filter(filtercondition)
        productlist = []

        for ins in product_ins:
            # Get dynamic product fields (if any)
            if ins.ProductCategory:
                product_field_names = ins.ProductCategory.Product_fields.values_list('field_Name', flat=True)
            else:
                product_field_names = []

            cleaned_product_field_names = [field.replace(' ', '') for field in product_field_names]

            # ✅ Fetch batch-wise stock details
            stock_qs = Stock_Maintance_Table_Detials.objects.filter(
                Product_Detials=ins,
                AvailableQuantity__gt=0
            )

            if loc:
                stock_qs = stock_qs.filter(Store_location__Store_Id=loc)

            batch_list = []
            for stock in stock_qs:
                batch_list.append({
                    "Batch_No": stock.Batch_No or "N/A",
                    "AvailableQuantity": stock.AvailableQuantity,
                    "Expiry_Status": stock.Expiry_Status,
                    "Expiry_Date": stock.Expiry_Date.strftime('%Y-%m-%d') if stock.Expiry_Date else None,
                    "Sellable_price": float(stock.Sellable_price),
                    "Current_Price": float(stock.Current_Price),
                    "Store_Location": stock.Store_location.Store_Name if stock.Store_location else "",
                })

            data = {
                "id": ins.pk,
                "ItemName": ins.ItemName,
                "ProductCategory": ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else "",
                "SubCategory": ins.SubCategory.SubCategoryName if ins.SubCategory else "",
                "CompanyName": ins.CompanyName.CompanyName if ins.CompanyName else "",
                "GenericName": ins.GenericName.GenericName if ins.GenericName else "",
                "HSNCode": ins.HSNCode or "",
                "PackType": ins.PackType.PackType_Name if ins.PackType else "Nill",
                "PackQuantity": ins.PackQty or "Nill",
                "Batches": batch_list,  # ✅ include batch details
            }

            # Include only necessary fields
            filtereddata = {}
            for field, value in data.items():
                if field in ['id', 'ItemName', 'ProductCategory', 'SubCategory',
                             'CompanyName', 'GenericName', 'HSNCode',
                             'PackType', 'PackQuantity', 'Batches']:
                    filtereddata[field] = value
                elif field in cleaned_product_field_names:
                    filtereddata[field] = value

            productlist.append(filtereddata)

        return JsonResponse(productlist, safe=False)

    except Exception as e:
        print(f'Error in get_item_detials_for_indent: {str(e)}')
        return JsonResponse({'error': str(e)}, status=500)

    

@csrf_exempt
@require_http_methods(["GET"])
def Gen_get_item_detials_for_indent(request):
    try:
        ItemCode = request.GET.get('ItemCode')
        ItemName = request.GET.get('ItemName')
        loc = request.GET.get('loc')

        filtercondition = Q()
        if ItemCode:
            filtercondition &= Q(pk__icontains=ItemCode)
        if ItemName:
            filtercondition &= Q(ItemName__icontains=ItemName)

        product_ins = Product_Master_All_Category_Details.objects.filter(Status=True,Is_GEN=True).filter(filtercondition)
        productlist = []

        for ins in product_ins:
            # Get dynamic product fields (if any)
            if ins.ProductCategory:
                product_field_names = ins.ProductCategory.Product_fields.values_list('field_Name', flat=True)
            else:
                product_field_names = []

            cleaned_product_field_names = [field.replace(' ', '') for field in product_field_names]

            # ✅ Fetch batch-wise stock details
            stock_qs = Stock_Maintance_Table_Detials.objects.filter(
                Product_Detials=ins,
                AvailableQuantity__gt=0,
                Store_location__Store_Id=5

            )

            if loc:
                stock_qs = stock_qs.filter(Store_location__Store_Id=loc)

            batch_list = []
            for stock in stock_qs:
                batch_list.append({
                    "Batch_No": stock.Batch_No or "N/A",
                    "AvailableQuantity": stock.AvailableQuantity,
                    "Expiry_Status": stock.Expiry_Status,
                    "Expiry_Date": stock.Expiry_Date.strftime('%Y-%m-%d') if stock.Expiry_Date else None,
                    "Sellable_price": float(stock.Sellable_price),
                    "Current_Price": float(stock.Current_Price),
                    "Store_Location": stock.Store_location.Store_Name if stock.Store_location else "",
                })

            data = {
                "id": ins.pk,
                "ItemName": ins.ItemName,
                "ProductCategory": ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else "",
                "SubCategory": ins.SubCategory.SubCategoryName if ins.SubCategory else "",
                "CompanyName": ins.CompanyName.CompanyName if ins.CompanyName else "",
                "GenericName": ins.GenericName.GenericName if ins.GenericName else "",
                "HSNCode": ins.HSNCode or "",
                "PackType": ins.PackType.PackType_Name if ins.PackType else "Nill",
                "PackQuantity": ins.PackQty or "Nill",
                "Batches": batch_list,  # ✅ include batch details
            }

            # Include only necessary fields
            filtereddata = {}
            for field, value in data.items():
                if field in ['id', 'ItemName', 'ProductCategory', 'SubCategory',
                             'CompanyName', 'GenericName', 'HSNCode',
                             'PackType', 'PackQuantity', 'Batches']:
                    filtereddata[field] = value
                elif field in cleaned_product_field_names:
                    filtereddata[field] = value

            productlist.append(filtereddata)

        return JsonResponse(productlist, safe=False)

    except Exception as e:
        print(f'Error in get_item_detials_for_indent: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def post_indent_raise_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('data',data)
            pk = data.get('pk')
            RequestFromLocation = data.get('RequestFromLocation', None)
            RequestFromNurseStation = data.get('RequestFromNurseStation', False)
            RequestFromStore = data.get('RequestFromStore', None)
            RequestToLocation = data.get('RequestToLocation', None)
            RequestToNurseStation = data.get('RequestToNurseStation', False)
            RequestToStore = data.get('RequestToStore', None)
            RequestDate = data.get('RequestDate', None)
            Reason = data.get('Reason', '')
            Created_by = data.get('Created_by', '')
            IndentItemsList = data.get('IndentItemsList', [])
            IS_Indent_Raise_Approve = data.get('IS_Indent_Raise_Approve')
            approval_status = 'Raised'
            if IS_Indent_Raise_Approve:
                approval_status = 'Raised'
            else:
                approval_status = 'Approved'
                
            # Initialize variables for storing instances
            RequestFromLocation_ins = None
            RequestFromStore_Nurse_ins = None
            RequestFromStore_ins = None
            
            RequestToLocation_ins = None
            RequestToStore_Nurse_ins = None
            RequestToStore_ins = None


            # Get instances if present
            if RequestFromLocation:
                RequestFromLocation_ins = get_or_none(Location_Detials, RequestFromLocation)
                if RequestFromLocation_ins:
                    inv_page_access = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId__pk = RequestFromLocation_ins.pk).first()
                    if inv_page_access:
                        if inv_page_access.IS_Indent:
                            if inv_page_access.IS_Indent_Raise_Approve:
                                approval_status ='Raised' if inv_page_access.IS_Indent_Raise_Approve else 'Approved'
           
            if RequestFromStore:
                if RequestFromNurseStation:
                    RequestFromStore_Nurse_ins = get_or_none(NurseStationMaster, RequestFromStore)
                else:
                    RequestFromStore_ins = get_or_none(Inventory_Location_Master_Detials, RequestFromStore)
            
            if RequestToLocation:
                RequestToLocation_ins = get_or_none(Location_Detials, RequestToLocation)
           
            if RequestToStore:
                if RequestToNurseStation:
                    RequestToStore_Nurse_ins = get_or_none(NurseStationMaster, RequestToStore)
                else:
                    RequestToStore_ins = get_or_none(Inventory_Location_Master_Detials, RequestToStore)
            
            with transaction.atomic():
                # Update case
                # Get current date and time
                current_date_time = datetime.now()

                # Format as 'yyyy-MM-dd hh:mm am/pm'
                formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

                indent_data={
                    'Raise_From_Location':RequestFromLocation_ins,
                    'Raise_From_NurseStation_Store':RequestFromNurseStation,
                    'Raise_From_Store_Location':RequestFromStore_ins,
                    'Raise_From_NurseStation_Location':RequestFromStore_Nurse_ins,
                    'Raise_To_Location':RequestToLocation_ins,
                    'Raise_To_NurseStation_Store':RequestToNurseStation,
                    'Raise_To_Store_Location':RequestToStore_ins,
                    'Raise_To_NurseStation_Location':RequestToStore_Nurse_ins,
                    'Raise_Date':formatted_date_time,
                    'Raise_Reason':Reason,
                    'Raise_by':Created_by,
                    'Raise_Status': approval_status
                }


                if approval_status == 'Approved':
                    indent_data['Raise_Approved_by'] = Created_by
                    indent_data['Raise_ApprovedDate'] = formatted_date_time
                if pk:
                    indent_ins = get_or_none(Indent_raise_details_table,pk)
                    if indent_ins:
                        for key, value in indent_data.items():
                            if key =='Created_by':
                                setattr(indent_ins, 'Raise_Updated_by', value)
                            setattr(indent_ins, key, value)
                        indent_ins.save()
                   
                else:
                    indent_ins = Indent_raise_details_table.objects.create(**indent_data)
               
                # Handle indent items
                # Handle indent items
                print('IndentItemsList', IndentItemsList)
                for ins in IndentItemsList:
                    item_pk = ins.get('pk')
                    Item_code_ins = get_or_none(Product_Master_All_Category_Details, ins.get('ItemCode'))

                    # Skip if product does not exist
                    if not Item_code_ins:
                        print(f"Skipping item, Product ID {ins.get('ItemCode')} not found")
                        continue

                    indent_items_data = {
                        'Indent_Detials': indent_ins,
                        'Product_Detials': Item_code_ins,
                        'Raise_Quantity': ins.get('RaisedQuantity'),
                        'Reason': ins.get('Reason', ''),
                        'Remarks': ins.get('Remarks', ''),
                        'Raise_Status': approval_status,
                    }

                    # Update item case
                    if item_pk:
                        indent_item_ins = get_or_none(Indent_raise_items_details_table, item_pk)
                        if indent_item_ins:
                            for key, value in indent_items_data.items():
                                setattr(indent_item_ins, key, value)
                            indent_item_ins.save()
                    # Create item case
                    else:
                        Indent_raise_items_details_table.objects.create(**indent_items_data)

                    
                    
                    # # Update item case
                    # if item_pk:
                    #     indent_item_ins = Indent_raise_items_details_table.objects.get(pk=item_pk)
                    #     if indent_item_ins:
                    #         for key, value in indent_items_data.items():
                    #             setattr(indent_item_ins, key, value)
                    #     indent_item_ins.save()
                    # # Create item case
                    # else:
                    #     Indent_raise_items_details_table.objects.create(**indent_items_data)
                        
            return JsonResponse({'success': 'Data saved successfully'}, status=200)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        

    elif request.method == 'GET':
      try:
        def to_bool(val):
            return str(val).lower() in ['true', '1', 'yes']

        Invoice_No = request.GET.get('Invoice_No')
        RaisedFromLocation = request.GET.get('RaisedFromLocation')
        RaisedFromNurseStation = request.GET.get('RaisedFromNurseStation')
        RaisedFromStore = request.GET.get('RaisedFromStore')
        RaisedToLocation = request.GET.get('RaisedToLocation')
        RaisedToNurseStation = request.GET.get('RaisedToNurseStation')
        RaisedToStore = request.GET.get('RaisedToStore')
        DateType = request.GET.get('DateType')
        CurrentDate = request.GET.get('CurrentDate')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        Status = request.GET.get('Status')
        ActivePharmacyStoreId = request.GET.get('ActivePharmacyStoreId')
        
 


        query = Q()

        # Raised From
        if RaisedFromLocation:
            query &= Q(Raise_From_Location__pk=RaisedFromLocation)
        if RaisedFromNurseStation is not None:
            query &= Q(Raise_From_NurseStation_Store=to_bool(RaisedFromNurseStation))
        if RaisedFromStore:
            if to_bool(RaisedFromNurseStation):
                query &= Q(Raise_From_NurseStation_Location__pk=RaisedFromStore)
            else:
                query &= Q(Raise_From_Store_Location__pk=RaisedFromStore)

        if ActivePharmacyStoreId:
            if to_bool(ActivePharmacyStoreId):
                query &= Q(Raise_From_NurseStation_Location__pk=ActivePharmacyStoreId)
            else:
                query &= Q(Raise_From_Store_Location__pk=ActivePharmacyStoreId)

        # Raised To
        if RaisedToLocation:
            query &= Q(Raise_To_Location__pk=RaisedToLocation)
        if RaisedToNurseStation is not None:
            query &= Q(Raise_To_NurseStation_Store=to_bool(RaisedToNurseStation))
        if RaisedToStore:
            if to_bool(RaisedToNurseStation):
                query &= Q(Raise_To_NurseStation_Location__pk=RaisedToStore)
            else:
                query &= Q(Raise_To_Store_Location__pk=RaisedToStore)

        # Invoice
        if Invoice_No:
            query &= Q(pk__iexact=Invoice_No)

        # # Dates
        if DateType == 'Current' and CurrentDate:
            current_date_obj = datetime.strptime(CurrentDate, '%Y-%m-%d').date()

            print(current_date_obj,'current_date_objjjjjj')
            query &= Q(Raise_Date__date=current_date_obj)

            print(query,'queryyyyyyy')
        elif DateType == 'Customize' and FromDate and ToDate:
            from_date_obj = datetime.strptime(FromDate, '%Y-%m-%d').date()
            to_date_obj = datetime.strptime(ToDate, '%Y-%m-%d').date()
            query &= Q(Raise_Date__range=(from_date_obj, to_date_obj))

        # Status
        if Status:
            query &= Q(Raise_Status=Status)
        
        indent_table_ins = Indent_raise_details_table.objects.filter(query).order_by('-Created_at')
        
        responsedata=[]
        for index,ins in enumerate(indent_table_ins):
            dic={
                'id':index+1,
                'pk':ins.pk,
                'RaisedFromLocation_pk':ins.Raise_From_Location.pk if ins.Raise_From_Location else None,
                'RaisedFromLocation':ins.Raise_From_Location.Location_Name if ins.Raise_From_Location else None,
                'RaisedFromNurseStation':ins.Raise_From_NurseStation_Store,
                'RaisedFromNurseStation_pk':ins.Raise_From_NurseStation_Location.pk if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else '',
                'RaisedFromStoreNurseStation':ins.Raise_From_NurseStation_Location.NurseStationName if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else "",
                'RaisedFromStore_pk':ins.Raise_From_Store_Location.pk if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else '',
                'RaisedFromStore':ins.Raise_From_Store_Location.Store_Name if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else '',
                'RaisedToLocation_pk':ins.Raise_To_Location.pk if ins.Raise_To_Location else None,
                'RaisedToLocation':ins.Raise_To_Location.Location_Name if ins.Raise_To_Location else None,
                'RequestToNurseStation':ins.Raise_To_NurseStation_Store,
                'RaisedToStoreNurseStation_pk':ins.Raise_To_NurseStation_Location.pk if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else '',
                'RaisedToStoreNurseStation':ins.Raise_To_NurseStation_Location.NurseStationName if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else '',
                'RaisedToStore_pk':ins.Raise_To_Store_Location.pk if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else '',
                'RaisedToStore':ins.Raise_To_Store_Location.Store_Name if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else '',
                'RaisedDate':ins.Raise_Date.strftime('%Y-%m-%d') if ins.Raise_Date else None,
                'RaisedApprovedDate':ins.Raise_ApprovedDate.strftime('%Y-%m-%d') if ins.Raise_ApprovedDate else None,
                'Raised_by':ins.Raise_by,
                'RaisedApproved_by':ins.Raise_Approved_by,
                'RaisedReason':ins.Raise_Reason,
                'Raise_Status':ins.Raise_Status,
                'Issue_Status':ins.Issue_Status,
              
                'Item_Detials':[]
            }
            
            

            Items_filter_query = Q(Indent_Detials__pk=ins.pk)

            
            indent_item_data_ins = Indent_raise_items_details_table.objects.filter(Items_filter_query)
            for it_index,it_ins in enumerate(indent_item_data_ins):
                item_dic={
                    'id':it_index +1,
                    'pk':it_ins.pk,
                    "ItemCode": it_ins.Product_Detials.pk,
                    "ItemName": it_ins.Product_Detials.ItemName,
                    "ProductCategory":it_ins.Product_Detials.ProductCategory.ProductCategory_Name if it_ins.Product_Detials.ProductCategory else '',
                    "SubCategory": it_ins.Product_Detials.SubCategory.SubCategoryName if it_ins.Product_Detials.SubCategory else '',
                    'PackType': it_ins.Product_Detials.PackType.PackType_Name if it_ins.Product_Detials.PackType else 'Nill',
                    'PackQuantity': it_ins.Product_Detials.PackQty if it_ins.Product_Detials.PackQty else 'Nill',
                    'RaisedQuantity':it_ins.Raise_Quantity,
                    'IssuedQuantity':it_ins.Issue_Quantity,
                    'IssueQuantity':it_ins.Issue_Quantity,
                    'PendingQuantity':it_ins.Pending_Quantity,
                    'RaisedReason':it_ins.Reason,
                    'RaisedRemarks':it_ins.Remarks,
                    'Raise_Status':it_ins.Raise_Status,
                    'Issue_Status':it_ins.Issue_Status,
                    'Status':it_ins.Issue_Status

                }
                dic['Item_Detials'].append(item_dic)
            responsedata.append(dic)
        return JsonResponse (responsedata,safe=False)   
    
      except Exception as e:
          return JsonResponse({'err':str(e)})
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=405)
    



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def GEN_post_indent_raise_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('data',data)
            pk = data.get('pk')
            RequestFromLocation = data.get('RequestFromLocation', None)
            RequestFromNurseStation = data.get('RequestFromNurseStation', False)
            RequestFromStore = data.get('RequestFromStore', None)
            RequestToLocation = data.get('RequestToLocation', None)
            RequestToNurseStation = data.get('RequestToNurseStation', False)
            RequestToStore = data.get('RequestToStore', None)
            RequestDate = data.get('RequestDate', None)
            Reason = data.get('Reason', '')
            Created_by = data.get('Created_by', '')
            IndentItemsList = data.get('IndentItemsList', [])
            IS_Indent_Raise_Approve = data.get('IS_Indent_Raise_Approve')
            approval_status = 'Raised'
            if IS_Indent_Raise_Approve:
                approval_status = 'Raised'
            else:
                approval_status = 'Approved'
                
            # Initialize variables for storing instances
            RequestFromLocation_ins = None
            RequestFromStore_Nurse_ins = None
            RequestFromStore_ins = None
            
            RequestToLocation_ins = None
            RequestToStore_Nurse_ins = None
            RequestToStore_ins = None


            # Get instances if present
            if RequestFromLocation:
                RequestFromLocation_ins = get_or_none(Location_Detials, RequestFromLocation)
                if RequestFromLocation_ins:
                    inv_page_access = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId__pk = RequestFromLocation_ins.pk).first()
                    if inv_page_access:
                        if inv_page_access.IS_Indent:
                            if inv_page_access.IS_Indent_Raise_Approve:
                                approval_status ='Raised' if inv_page_access.IS_Indent_Raise_Approve else 'Approved'
           
            if RequestFromStore:
                if RequestFromNurseStation:
                    RequestFromStore_Nurse_ins = get_or_none(NurseStationMaster, RequestFromStore)
                else:
                    RequestFromStore_ins = get_or_none(Department_Location_Master_Detials, RequestFromStore)
            
            if RequestToLocation:
                RequestToLocation_ins = get_or_none(Location_Detials, RequestToLocation)
           
            if RequestToStore:
                if RequestToNurseStation:
                    RequestToStore_Nurse_ins = get_or_none(NurseStationMaster, RequestToStore)
                else:
                    RequestToStore_ins = get_or_none(Inventory_Location_Master_Detials, RequestToStore)
            
            with transaction.atomic():
                # Update case
                # Get current date and time
                current_date_time = datetime.now()

                # Format as 'yyyy-MM-dd hh:mm am/pm'
                formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

                indent_data={
                    'Raise_From_Location':RequestFromLocation_ins,
                    'Raise_From_NurseStation_Store':RequestFromNurseStation,
                    'Raise_From_Store_Location':RequestFromStore_ins,
                    'Raise_From_NurseStation_Location':RequestFromStore_Nurse_ins,
                    'Raise_To_Location':RequestToLocation_ins,
                    'Raise_To_NurseStation_Store':RequestToNurseStation,
                    'Raise_To_Store_Location':RequestToStore_ins,
                    'Raise_To_NurseStation_Location':RequestToStore_Nurse_ins,
                    'Raise_Date':formatted_date_time,
                    'Raise_Reason':Reason,
                    'Raise_by':Created_by,
                    'Raise_Status': approval_status
                }


                if approval_status == 'Approved':
                    indent_data['Raise_Approved_by'] = Created_by
                    indent_data['Raise_ApprovedDate'] = formatted_date_time
                if pk:
                    indent_ins = get_or_none(GEN_Indent_raise_details_table,pk)
                    if indent_ins:
                        for key, value in indent_data.items():
                            if key =='Created_by':
                                setattr(indent_ins, 'Raise_Updated_by', value)
                            setattr(indent_ins, key, value)
                        indent_ins.save()
                   
                else:
                    indent_ins = GEN_Indent_raise_details_table.objects.create(**indent_data)
               
                # Handle indent items
                # Handle indent items
                print('IndentItemsList', IndentItemsList)
                for ins in IndentItemsList:
                    item_pk = ins.get('pk')
                    Item_code_ins = get_or_none(Product_Master_All_Category_Details, ins.get('ItemCode'))

                    # Skip if product does not exist
                    if not Item_code_ins:
                        print(f"Skipping item, Product ID {ins.get('ItemCode')} not found")
                        continue

                    indent_items_data = {
                        'Indent_Detials': indent_ins,
                        'Product_Detials': Item_code_ins,
                        'Raise_Quantity': ins.get('RaisedQuantity'),
                        'Reason': ins.get('Reason', ''),
                        'Remarks': ins.get('Remarks', ''),
                        'Raise_Status': approval_status,
                    }

                    # Update item case
                    if item_pk:
                        indent_item_ins = get_or_none(GEN_Indent_raise_items_details_table, item_pk)
                        if indent_item_ins:
                            for key, value in indent_items_data.items():
                                setattr(indent_item_ins, key, value)
                            indent_item_ins.save()
                    # Create item case
                    else:
                        GEN_Indent_raise_items_details_table.objects.create(**indent_items_data)

                    
                    
                    # # Update item case
                    # if item_pk:
                    #     indent_item_ins = Indent_raise_items_details_table.objects.get(pk=item_pk)
                    #     if indent_item_ins:
                    #         for key, value in indent_items_data.items():
                    #             setattr(indent_item_ins, key, value)
                    #     indent_item_ins.save()
                    # # Create item case
                    # else:
                    #     Indent_raise_items_details_table.objects.create(**indent_items_data)
                        
            return JsonResponse({'success': 'Data saved successfully'}, status=200)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
        

    elif request.method == 'GET':
        try:
            def to_bool(val):
                return str(val).lower() in ['true', '1', 'yes']

            # -------------------- GET PARAMS --------------------
            Invoice_No = request.GET.get('Invoice_No')
            RaisedFromLocation = request.GET.get('RaisedFromLocation')
            RaisedFromNurseStation = request.GET.get('RaisedFromNurseStation')
            RaisedFromStore = request.GET.get('RaisedFromStore')
            RaisedToLocation = request.GET.get('RaisedToLocation')
            RaisedToNurseStation = request.GET.get('RaisedToNurseStation')
            RaisedToStore = request.GET.get('RaisedToStore')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            Status = request.GET.get('Status')
            ActivePharmacyStoreId = request.GET.get('ActivePharmacyStoreId')

            # -------------------- QUERY BUILD --------------------
            query = Q()

            # -------- Raised From --------
            if RaisedFromLocation not in [None, '']:
                query &= Q(Raise_From_Location__pk=RaisedFromLocation)

            if RaisedFromNurseStation not in [None, '']:
                query &= Q(Raise_From_NurseStation_Store=to_bool(RaisedFromNurseStation))

            if RaisedFromStore not in [None, '']:
                if to_bool(RaisedFromNurseStation):
                    query &= Q(Raise_From_NurseStation_Location__pk=RaisedFromStore)
                else:
                    query &= Q(Raise_From_Store_Location__pk=RaisedFromStore)

            if ActivePharmacyStoreId not in [None, '']:
                if to_bool(ActivePharmacyStoreId):
                    query &= Q(Raise_From_NurseStation_Location__pk=ActivePharmacyStoreId)
                else:
                    query &= Q(Raise_From_Store_Location__pk=ActivePharmacyStoreId)

            # -------- Raised To --------
            if RaisedToLocation not in [None, '']:
                query &= Q(Raise_To_Location__pk=RaisedToLocation)

            if RaisedToNurseStation not in [None, '']:
                query &= Q(Raise_To_NurseStation_Store=to_bool(RaisedToNurseStation))

            if RaisedToStore not in [None, '']:
                if to_bool(RaisedToNurseStation):
                    query &= Q(Raise_To_NurseStation_Location__pk=RaisedToStore)
                else:
                    query &= Q(Raise_To_Store_Location__pk=RaisedToStore)

            # -------- Invoice --------
            if Invoice_No not in [None, '']:
                query &= Q(pk=Invoice_No)

            # -------- Date Filter (FIXED) --------
            if DateType == 'Current' and CurrentDate:
                current_date_obj = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                start_dt = datetime.combine(current_date_obj, time.min)
                end_dt = datetime.combine(current_date_obj, time.max)
                query &= Q(Raise_Date__range=(start_dt, end_dt))

            elif DateType == 'Customize' and FromDate and ToDate:
                from_dt = datetime.combine(
                    datetime.strptime(FromDate, '%Y-%m-%d').date(),
                    time.min
                )
                to_dt = datetime.combine(
                    datetime.strptime(ToDate, '%Y-%m-%d').date(),
                    time.max
                )
                query &= Q(Raise_Date__range=(from_dt, to_dt))

            # -------- Status --------
            if Status not in [None, '']:
                query &= Q(Raise_Status=Status)

            # -------------------- QUERY EXECUTION --------------------
            indent_table_ins = (
                GEN_Indent_raise_details_table.objects
                .filter(query)
                .order_by('-Created_at')
            )

            # DEBUG (optional – remove in prod)
            print("FINAL QUERY:", query)
            print("RESULT COUNT:", indent_table_ins.count())

            # -------------------- RESPONSE BUILD --------------------
            responsedata = []

            for index, ins in enumerate(indent_table_ins):
                dic = {
                    'id': index + 1,
                    'pk': ins.pk,

                    'RaisedFromLocation_pk': ins.Raise_From_Location.pk if ins.Raise_From_Location else None,
                    'RaisedFromLocation': ins.Raise_From_Location.Location_Name if ins.Raise_From_Location else None,

                    'RaisedFromNurseStation': ins.Raise_From_NurseStation_Store,
                    'RaisedFromNurseStation_pk': ins.Raise_From_NurseStation_Location.pk
                        if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else None,
                    'RaisedFromStoreNurseStation': ins.Raise_From_NurseStation_Location.NurseStationName
                        if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else "",

                    'RaisedFromStore_pk': ins.Raise_From_Store_Location.pk
                        if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else None,
                    'RaisedFromStore': ins.Raise_From_Store_Location.Store_Name
                        if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else "",

                    'RaisedToLocation_pk': ins.Raise_To_Location.pk if ins.Raise_To_Location else None,
                    'RaisedToLocation': ins.Raise_To_Location.Location_Name if ins.Raise_To_Location else None,

                    'RequestToNurseStation': ins.Raise_To_NurseStation_Store,
                    'RaisedToStoreNurseStation_pk': ins.Raise_To_NurseStation_Location.pk
                        if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else None,
                    'RaisedToStoreNurseStation': ins.Raise_To_NurseStation_Location.NurseStationName
                        if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else "",

                    'RaisedToStore_pk': ins.Raise_To_Store_Location.pk
                        if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else None,
                    'RaisedToStore': ins.Raise_To_Store_Location.Store_Name
                        if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else "",

                    'RaisedDate': ins.Raise_Date.strftime('%Y-%m-%d') if ins.Raise_Date else None,
                    'RaisedApprovedDate': ins.Raise_ApprovedDate.strftime('%Y-%m-%d')
                        if ins.Raise_ApprovedDate else None,

                    'Raised_by': ins.Raise_by,
                    'RaisedApproved_by': ins.Raise_Approved_by,
                    'RaisedReason': ins.Raise_Reason,
                    'Raise_Status': ins.Raise_Status,
                    'Issue_Status': ins.Issue_Status,

                    'Item_Detials': []
                }

                items = GEN_Indent_raise_items_details_table.objects.filter(
                    Indent_Detials__pk=ins.pk
                )

                for it_index, it_ins in enumerate(items):
                    dic['Item_Detials'].append({
                        'id': it_index + 1,
                        'pk': it_ins.pk,
                        'ItemCode': it_ins.Product_Detials.pk,
                        'ItemName': it_ins.Product_Detials.ItemName,
                        'ProductCategory': it_ins.Product_Detials.ProductCategory.ProductCategory_Name
                            if it_ins.Product_Detials.ProductCategory else '',
                        'SubCategory': it_ins.Product_Detials.SubCategory.SubCategoryName
                            if it_ins.Product_Detials.SubCategory else '',
                        'PackType': it_ins.Product_Detials.PackType.PackType_Name
                            if it_ins.Product_Detials.PackType else 'Nill',
                        'PackQuantity': it_ins.Product_Detials.PackQty or 'Nill',
                        'RaisedQuantity': it_ins.Raise_Quantity,
                        'IssuedQuantity': it_ins.Issue_Quantity,
                        'PendingQuantity': it_ins.Pending_Quantity,
                        'RaisedReason': it_ins.Reason,
                        'RaisedRemarks': it_ins.Remarks,
                        'Raise_Status': it_ins.Raise_Status,
                        'Issue_Status': it_ins.Issue_Status,
                        'Status': it_ins.Issue_Status
                    })

                responsedata.append(dic)

            return JsonResponse(responsedata, safe=False)

 
   
    
        except Exception as e:
            return JsonResponse({'err':str(e)})
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=405)
    


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Indent_Raise_Details_Approve_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            InvoiceNo = data.get('InvoiceNo')
            Status = data.get('Status','Approved')
            Approved_by = data.get('Approved_by', '')
            
            if InvoiceNo:
                try:
                    indent_table_ins = Indent_raise_details_table.objects.filter(pk=InvoiceNo).first()
                except :
                    return JsonResponse({'error': 'Invoice not found'}, status=404)
                
                indent_table_ins.Raise_Status = Status
                indent_table_ins.Raise_Approved_by = Approved_by
                indent_table_ins.save()

                 # Fetch related GRN_Product_Item_Detials instances
                product_items = Indent_raise_items_details_table.objects.filter(Indent_Detials=indent_table_ins, Raise_Status='Raised')

                # Iterate and update each item to trigger the post_save signal
                for item in product_items:
                    item.Raise_Status = Status
                    item.save()  
                
                return JsonResponse({'success': 'Indent Raise approved successfully'}, status=200)
            
            return JsonResponse({'error': 'InvoiceNo is required'}, status=400)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def GEN_Indent_Raise_Details_Approve_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            InvoiceNo = data.get('InvoiceNo')
            Status = data.get('Status','Approved')
            Approved_by = data.get('Approved_by', '')
            
            if InvoiceNo:
                try:
                    indent_table_ins = GEN_Indent_raise_details_table.objects.filter(pk=InvoiceNo).first()
                except :
                    return JsonResponse({'error': 'Invoice not found'}, status=404)
                
                indent_table_ins.Raise_Status = Status
                indent_table_ins.Raise_Approved_by = Approved_by
                indent_table_ins.save()

                 # Fetch related GRN_Product_Item_Detials instances
                product_items = GEN_Indent_raise_items_details_table.objects.filter(Indent_Detials=indent_table_ins, Raise_Status='Raised')

                # Iterate and update each item to trigger the post_save signal
                for item in product_items:
                    item.Raise_Status = Status
                    item.save()  
                
                return JsonResponse({'success': 'Indent Raise approved successfully'}, status=200)
            
            return JsonResponse({'error': 'InvoiceNo is required'}, status=400)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_item_detials_for_batch_indent_issue(request):
    if request.method == "GET":
        try:
            ItemCode = request.GET.get('ItemCode')
            Location = request.GET.get('Location')
            Isward = request.GET.get('Isward','').lower()
            StoreName = request.GET.get('StoreName')
            ExpiredProducts = request.GET.get('ExpiredProducts','false').lower()
            filter_query =Q()
            if ItemCode:
                filter_query &= Q(Product_Detials__pk__iexact = ItemCode)
            if Location:
                filter_query &= Q(Store_location__Location_Name__pk__iexact = Location) | Q(NurseStation_location__Location_Name__pk__iexact = Location)
            if Isward:
                if StoreName:
                    if Isward =='true':
                        filter_query &= Q( NurseStation_location__pk__iexact = StoreName,IsNurseStation = True )
                    else: 
                        filter_query &= Q( Store_location__pk__iexact = StoreName,IsNurseStation = False )
            if ExpiredProducts ==  'true':
                filter_query &= ~Q(Expiry_Status='Not-Expired')
            if not ItemCode:
                return JsonResponse({'error': 'ItemCode Is required'}, status=400)
                
            product_ins = Stock_Maintance_Table_Detials.objects.filter(filter_query).exclude(AvailableQuantity=0)
            productlist=[]
            for ins in product_ins:
                data = {
                    'pk': ins.pk,
                    'ItemCode': ins.Product_Detials.pk,
                    'ItemName': ins.Product_Detials.ItemName,
                    'SerialNoAvailable': ins.Product_Detials.Is_Serial_No_Available_for_each_quantity,
                    'BatchNo': ins.Batch_No,
                    'AvailableQuantity': ins.AvailableQuantity,
                    'IsSellable':ins.Product_Detials.IsSellable,
                    'LeastSellableUnit':ins.Product_Detials.LeastSellableUnit,
                    'Sellable_price':ins.Sellable_price,
                    'Sellable_qty_price':ins.Sellable_qty_price,
                }
                productlist.append(data)
            return JsonResponse(productlist, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=500)

 

@csrf_exempt
@require_http_methods(["GET"])
def GEN_get_item_detials_for_batch_indent_issue(request):
    if request.method == "GET":
        try:
            ItemCode = request.GET.get('ItemCode')
            Location = request.GET.get('Location')
            Isward = request.GET.get('Isward','').lower()
            StoreName = request.GET.get('StoreName')
            ExpiredProducts = request.GET.get('ExpiredProducts','false').lower()
            filter_query =Q()
            if ItemCode:
                filter_query &= Q(Product_Detials__pk__iexact = ItemCode)
            if Location:
                filter_query &= Q(Store_location__Location_Name__pk__iexact = Location) | Q(NurseStation_location__Location_Name__pk__iexact = Location)
            if Isward:
                if StoreName:
                    if Isward =='true':
                        filter_query &= Q( NurseStation_location__pk__iexact = StoreName,IsNurseStation = True )
                    else: 
                        filter_query &= Q( Store_location__pk__iexact = StoreName,IsNurseStation = False )
            if ExpiredProducts ==  'true':
                filter_query &= ~Q(Expiry_Status='Not-Expired')
            if not ItemCode:
                return JsonResponse({'error': 'ItemCode Is required'}, status=400)
                
            product_ins = Stock_Maintance_Table_Detials.objects.filter(filter_query,Store_location__Store_Id=5).exclude(AvailableQuantity=0)
            productlist=[]
            for ins in product_ins:
                data = {
                    'pk': ins.pk,
                    'ItemCode': ins.Product_Detials.pk,
                    'ItemName': ins.Product_Detials.ItemName,
                    'SerialNoAvailable': ins.Product_Detials.Is_Serial_No_Available_for_each_quantity,
                    'BatchNo': ins.Batch_No,
                    'AvailableQuantity': ins.AvailableQuantity,
                    'IsSellable':ins.Product_Detials.IsSellable,
                    'LeastSellableUnit':ins.Product_Detials.LeastSellableUnit,
                    'Sellable_price':ins.Sellable_price,
                    'Sellable_qty_price':ins.Sellable_qty_price,
                }
                productlist.append(data)
            return JsonResponse(productlist, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=500)

 
@csrf_exempt
@require_http_methods(["GET"])
def get_serialno_detials_for_batch_indent_issue(request):
    if request.method == "GET":
        try:
            ItemCode = request.GET.get('ItemCode')
            Location = request.GET.get('Location')
            Isward = request.GET.get('Isward','').lower()
            StoreName = request.GET.get('StoreName')
            BatchNo = request.GET.get('BatchNo')
            
            filter_query =Q(Item_Status ='Available')
            if ItemCode:
                filter_query &= Q(Stock_Table__Product_Detials__pk__iexact = ItemCode)
            if BatchNo:
                filter_query &= Q(Stock_Table__Batch_No = BatchNo)
            if Location:
                filter_query &= Q(Stock_Table__Store_location__Location_Name__pk__iexact = Location) | Q(Stock_Table__NurseStation_location__Location_Name__pk__iexact = Location)
            if Isward:
                if StoreName:
                    if Isward =='true':
                        filter_query &= Q( Stock_Table__NurseStation_location__pk__iexact = StoreName,IsNurseStation = True )
                    else: 
                        filter_query &= Q( Stock_Table__Store_location__pk__iexact = StoreName,IsNurseStation = False )
            
            if not ItemCode:
                return JsonResponse({'error': 'ItemCode Is required'}, status=400)
                
            serialNo_ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(filter_query)
            serialNo_ins_list=[]
            for ins_indx,ins in enumerate(serialNo_ins):
                data = {
                    'pk': ins.pk,
                    'Serial_Number': ins.Serial_Number,
                    "Status": False,
                    'Item_Status': ins.Item_Status,
                }
                serialNo_ins_list.append(data)
            return JsonResponse(serialNo_ins_list, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=500)


@csrf_exempt
@require_http_methods(["POST", 'GET', 'OPTIONS'])
def post_indent_issue_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            
            # Extract main data fields from request
            IndentRaiseInvoice = data.get("IndentRaiseInvoice", None)
            IndentIssueInvoice = data.get("IndentIssueInvoice", None)
            IssueFromLocation = data.get("IssueFromLocation")
            IssueFromNurseStation = data.get("IssueFromNurseStation")
            IssueFromStore = data.get("IssueFromStore")
            IssueToLocation = data.get("IssueToLocation")
            IssueToNurseStation = data.get("IssueToNurseStation")
            IssueToStore = data.get("IssueToStore")
            IssueReason = data.get("IssueReason", '')
            print("IssueReason",IssueReason)
            createdBy = data.get("createdBy", '')
            ItemsData = data.get("ItemsData", [])
            IS_Indent_Issue_Approve = data.get('IS_Indent_Issue_Approve')
            print('IS_Indent_Issue_Approve------------',IS_Indent_Issue_Approve)

            # Initialize instances for locations and stores
            IssueFromLocation_ins = IssueFromNurseStation_ins = IssueFromInvStore_ins = None
            IssueToLocation_ins = IssueToNurseStation_ins = IssueToInvStore_ins = None
            approval_status = 'Issued'
            IndentRaiseInvoice_ins = None
            if IS_Indent_Issue_Approve:
                approval_status = 'Issued'
            else:
                approval_status = 'Approved'
                  
            

            # Get indent raise instance
            if IndentRaiseInvoice:
                IndentRaiseInvoice_ins = get_or_none(Indent_raise_details_table, IndentRaiseInvoice)
            
            # Handle issue location instances for IssueFrom
            if IssueFromLocation:
                IssueFromLocation_ins = get_or_none(Location_Detials, IssueFromLocation)
                if IssueFromLocation_ins:
                    inv_page_access = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId__pk=IssueFromLocation_ins.pk).first()
                    if inv_page_access and inv_page_access.IS_Indent:
                        approval_status = 'Issued' if inv_page_access.IS_Indent_Issue_Approve else 'Approved'
            
            # Handle ward and inventory store instances for IssueFrom
            if IssueFromStore:
                if IssueFromNurseStation:
                    IssueFromNurseStation_ins = get_or_none(NurseStationMaster, IssueFromStore)
                else:
                    IssueFromInvStore_ins = get_or_none(Inventory_Location_Master_Detials, IssueFromStore)
            
            # Handle issue location instances for IssueTo
            if IssueToLocation:
                IssueToLocation_ins = get_or_none(Location_Detials, IssueToLocation)
            
            # Handle ward and inventory store instances for IssueTo
            if IssueToStore:
                if IssueToNurseStation:
                    IssueToNurseStation_ins = get_or_none(NurseStationMaster, IssueToStore)
                else:
                    IssueToInvStore_ins = get_or_none(Inventory_Location_Master_Detials, IssueToStore)
            
            # Current datetime for issuing
            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            # Begin transaction for atomic database operations
            with transaction.atomic():
                # Update or create All_Indent_Details record
                indent_data = {
                    'pk': IndentIssueInvoice,
                    'Indent_Type': 'raise' if IndentRaiseInvoice else "issue",
                    'Indent_raise': IndentRaiseInvoice_ins,
                    'Issue_From_Location': IssueFromLocation_ins,
                    'Issue_From_NurseStation_Store': IssueFromNurseStation,
                    'Issue_From_Store_Location': IssueFromInvStore_ins,
                    'Issue_From_NurseStation_Location': IssueFromNurseStation_ins,
                    'Issue_To_Location': IssueToLocation_ins,
                    'Issue_To_NurseStation_Store': IssueToNurseStation,
                    'Issue_To_Store_Location': IssueToInvStore_ins,
                    'Issue_To_NurseStation_Location': IssueToNurseStation_ins,
                    'Issue_Date': formatted_date_time,
                    'Issue_Reason': IssueReason,
                    'Issue_Status': approval_status,
                }
                
                # Set issue/updated by fields
                if indent_data['pk']:
                    indent_data['Issue_Updated_by'] = createdBy
                else:
                    indent_data['Issue_by'] = createdBy
                
                # Set approval fields if status is approved
                if approval_status == 'Approved':
                    indent_data.update({
                        'Issue_Approved_by': createdBy,
                        'Issue_ApprovedDate': formatted_date_time,
                    })

                # Save or update indent issue instance
                if indent_data['pk']:
                    indent_issue_ins = get_or_none(Indent_issue_details_table, indent_data['pk'])
                    if indent_issue_ins:
                        for key, value in indent_data.items():
                            setattr(indent_issue_ins, key, value)
                        indent_issue_ins.save()
                else:
                    indent_issue_ins = Indent_issue_details_table.objects.create(**indent_data)

                issue_messages = []
                for it_ins in ItemsData:
                    try:
                        item_code = it_ins.get('ItemCode')
                        IssueQuantity = int(it_ins.get('IssueQuantity'))
                        BatchNo = it_ins.get('BatchNo')
                        Serial_Number = it_ins.get('SerialNo', [])

                        product_ins = Product_Master_All_Category_Details.objects.filter(pk=item_code).first()

                        stock_Ins = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials=product_ins,
                            Batch_No=BatchNo,
                            IsNurseStation=IssueFromNurseStation,
                            Store_location=IssueFromInvStore_ins,
                            NurseStation_location=IssueFromNurseStation_ins
                        ).first()
                        
                        # Check stock availability
                        if stock_Ins.AvailableQuantity < IssueQuantity:
                            issue_messages.append(f"Insufficient stock for {product_ins.ItemName} (ItemCode: {item_code}). Available: {stock_Ins.AvailableQuantity}, Requested: {IssueQuantity}.")
                        # print('1111')
                        # print('1111', len(Serial_Number))
                        # Check serial number availability
                        if len(Serial_Number):
                            # print('1222')
                            Serial_no_ins = []
                            for serial in Serial_Number:
                                serial_ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                    pk=serial['pk'],
                                    Stock_Table=stock_Ins,
                                    Store_location=IssueFromInvStore_ins,
                                    NurseStation_location=IssueFromNurseStation_ins,
                                    Item_Status='Available'
                                ).first()
                                # print('12',serial_ins)
                                if serial_ins:
                                    Serial_no_ins.append({
                                        'serial_no':serial['pk'],
                                        'message': f" the serial no {serial['pk']} in the selected location "
                                    })
                            # print('222',Serial_no_ins)
                            if len(Serial_no_ins) < IssueQuantity:
                                issue_messages.append(f"Insufficient serials for {product_ins.ItemName} (ItemCode: {item_code}). Available serials: {len(Serial_no_ins)}, Requested: {IssueQuantity}.")
                    
                    except Exception as e:
                        return JsonResponse({
                            'ItemCode': item_code,
                            'Issue': f"An error occurred: {str(e)}"
                        },status=400)
                
                if issue_messages:
                    return JsonResponse({
                        'warn': issue_messages
                    },status=400)
                
                # print('ItemsData',ItemsData)

                for it_ins in ItemsData:
                    # print('it_ins')
                    try:
                        Raisedpk = it_ins.get('Raisedpk')
                        Issuedpk = it_ins.get('Issuedpk')
                        item_code = it_ins.get('ItemCode')
                        IssueQuantity = int(it_ins.get('IssueQuantity'))
                        BatchNo = it_ins.get('BatchNo')
                        Reason = it_ins.get('Reason', '')
                        Remarks = it_ins.get('Remarks', '')
                        Serial_Number = it_ins.get('SerialNo', [])
                        Status = it_ins.get('Status', '')
                        if Status != 'Cancelled':
                            Status = approval_status
                        
                        # Fetch product and stock details
                        product_ins = Product_Master_All_Category_Details.objects.filter(pk=item_code).first()
                        try:
                            stock_Ins = Stock_Maintance_Table_Detials.objects.filter(
                                Product_Detials=product_ins,
                                Batch_No=BatchNo,
                                IsNurseStation=IssueFromNurseStation,
                                Store_location=IssueFromInvStore_ins,
                                NurseStation_location=IssueFromNurseStation_ins
                            ).first()
                        except Exception as e :
                            return JsonResponse(f"Error fetching stock for ItemCode {item_code}, BatchNo {BatchNo}: {str(e)}",status=400)
                        # print('///1')
                        Serial_no_ins = set()
                        for serial in Serial_Number:
                            serial_ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                pk=serial['pk'],
                                Stock_Table=stock_Ins,
                                Store_location=IssueFromInvStore_ins,
                                NurseStation_location=IssueFromNurseStation_ins
                            ).first()
                            # print('///2')

                            if serial_ins:
                                Serial_no_ins.add(serial_ins)
                            # print('///3')
                        # print('///4',Serial_no_ins)
                        
                        # Prepare data for indent items
                        indent_items_data = {
                            'pk': Issuedpk,
                            'Indent_Raise_Item': get_or_none(Indent_raise_items_details_table, Raisedpk),
                            'Indent_Detials': indent_issue_ins,
                            'Product_Detials': product_ins,
                            'stock_Detials': stock_Ins,
                            'Issue_Quantity': 0 if  Status == 'Cancelled' else IssueQuantity,
                            'Issue_Status': Status,
                            'Reason': Reason,
                            'Remarks': Remarks,
                        }

                        # Save or update indent item instance
                        if indent_items_data['pk']:
                            print("indent_items_data['pk']",indent_items_data['pk'])
                            indent_issue_item_ins = get_or_none(Indent_issue_items_details_table, indent_items_data['pk'])
                            print('indent_issue_item_ins',indent_issue_item_ins)
                            if indent_issue_item_ins:
                                for key, value in indent_items_data.items():
                                    setattr(indent_issue_item_ins, key, value)
                                indent_issue_item_ins.save()
                        else:
                            indent_issue_item_ins = Indent_issue_items_details_table.objects.create(**indent_items_data)
                        
                        
                        
                        # print('///6')
                        # Assign serial numbers to the many-to-many field
                        if Serial_no_ins:
                            indent_issue_item_ins.serialNo.set(Serial_no_ins)
                        # print('////7')
                        
                        
                        if indent_issue_item_ins.Issue_Status == 'Approved':
                            # print('///8')
                            stock = indent_issue_item_ins.stock_Detials
                            issue_quantity = indent_issue_item_ins.Issue_Quantity

                            # Update stock details
                            stock.AvailableQuantity -= issue_quantity
                            stock.Indent_Send_Quantity += issue_quantity
                            stock.Total_Moved_Quantity += issue_quantity
                            stock.save(update_fields=['AvailableQuantity', 'Indent_Send_Quantity', 'Total_Moved_Quantity'])
                            if indent_issue_item_ins.serialNo.exists():
                                # Update serial numbers for the issue item
                                serial_numbers_to_update = list(
                                    indent_issue_item_ins.serialNo.filter(
                                        Store_location=indent_issue_ins.Issue_From_Store_Location,
                                        NurseStation_location=indent_issue_ins.Issue_From_NurseStation_Location,
                                        Item_Status='Available'
                                    ).values_list('id', flat=True)[:issue_quantity]
                                )
                                # Update serial numbers in stock maintenance table
                                SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                    pk__in=serial_numbers_to_update
                                ).update(Item_Status='Indent Movement')

                        if indent_issue_item_ins.Issue_Status == 'Cancelled':
                             # Update serial numbers for the issue item
                            if indent_issue_item_ins.serialNo.exists(): 
                                serial_numbers_to_update = list(
                                    indent_issue_item_ins.serialNo.filter(
                                        Store_location=indent_issue_ins.Issue_From_Store_Location,
                                        NurseStation_location=indent_issue_ins.Issue_From_NurseStation_Location,
                                        
                                    ).values_list('id', flat=True)[:indent_issue_item_ins.Issue_Quantity]
                                )
                                # Update serial numbers in stock maintenance table
                                SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                    pk__in=serial_numbers_to_update
                                ).update(Item_Status='Available')

                        # print('///9')
                        if indent_issue_item_ins.Indent_Raise_Item:
                            # print('///10')
                            if indent_issue_item_ins.Issue_Status != 'Cancelled':
                                # print('///11')
                                indent_raise_ins_indent = indent_issue_item_ins.Indent_Raise_Item
                                indent_raise_ins_indent.Issue_Quantity += indent_issue_item_ins.Issue_Quantity
                                indent_raise_ins_indent.Pending_Quantity = indent_raise_ins_indent.Pending_Quantity - indent_issue_item_ins.Issue_Quantity if indent_raise_ins_indent.Raise_Quantity > indent_raise_ins_indent.Issue_Quantity else 0
                                if indent_raise_ins_indent.Pending_Quantity == 0:
                                    indent_raise_ins_indent.Issue_Status = 'Completed'
                                elif indent_issue_item_ins.Issue_Quantity != 0:
                                    indent_raise_ins_indent.Issue_Status = 'Completed'
                                # print('///12')
                            else:
                                # print('///13')
                                indent_raise_ins_indent = indent_issue_item_ins.Indent_Raise_Item
                                indent_raise_ins_indent.Issue_Quantity = 0
                                indent_raise_ins_indent.Pending_Quantity = indent_raise_ins_indent.Raise_Quantity
                                indent_raise_ins_indent.Issue_Status = 'Cancelled'
                                # print('///14')
                            indent_raise_ins_indent.save()
                        
                    except Exception as e:
                        return JsonResponse({
                            'ItemCode': item_code,
                            'Issue': f"An error occurred: {str(e)}"
                        },status=400)

                if indent_issue_ins.Indent_raise:
                    # print('///15')
                    indent_issue_item_ins_12 = list(
                        Indent_issue_items_details_table.objects.exclude(
                            Issue_Status='Cancelled'
                        ).filter(
                            Indent_Raise_Item__Indent_Detials=indent_issue_ins.Indent_raise
                        ).values_list('Indent_Raise_Item', flat=True)
                    )
                    # print('///15---',indent_issue_item_ins_12)
                    if indent_issue_item_ins_12:
                        # print('///16')
                        indent_raise_update_ins = Indent_raise_items_details_table.objects.exclude(pk__in=indent_issue_item_ins_12)
                        for ins_ins in indent_raise_update_ins:
                            ins_ins.Issue_Status = 'Cancelled'
                            ins_ins.save()
                    # print('///17')
                    indent_raise_items = Indent_raise_items_details_table.objects.filter(
                        Indent_Detials=indent_issue_ins.Indent_raise,
                        Raise_Status='Approved'
                    )
                    all_Cancelled = all(item.Issue_Status == 'Cancelled' for item in indent_raise_items)
                    # print('///18')
                    if all_Cancelled:
                        indent_issue_ins.Indent_raise.Issue_Status = 'Cancelled'
                        indent_issue_ins.Issue_Status = 'Cancelled'
                    else:
                        indent_issue_ins.Indent_raise.Issue_Status = 'Completed'
                    # print('///19')
                    indent_issue_ins.save()
                    indent_issue_ins.Indent_raise.save()

                # If no issues, save instances and return success
                return JsonResponse({
                    'status': 'Success',
                    'message': 'Indent issue details recorded successfully.'
                }, status=200)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            # Extract and validate query parameters
            indent_type = request.GET.get('Indent_Type', 'raise').strip().lower()
            if indent_type not in ['raise', 'issue']:
                return JsonResponse({'error': 'Invalid Indent_Type'}, status=400)

            raised_from_location = request.GET.get('RaisedFromLocation')
            raised_from_nurse_station1 = request.GET.get('RaisedFromNurseStation')
            raised_from_nurse_station=False
            if raised_from_nurse_station1 == 'true':
                raised_from_nurse_station = True

            print(type(raised_from_location),'bjhtg')
            raised_from_store = request.GET.get('RaisedFromStore')
            raised_to_location = request.GET.get('RaisedToLocation')
            raised_to_nurse_station1 = request.GET.get('RaisedToNurseStation')
            raised_to_nurse_station = False
            if raised_to_nurse_station1 == 'true':
                raised_to_nurse_station = True

            raised_to_store = request.GET.get('RaisedToStore')
            raise_invoice_no = request.GET.get('Raise_Invoice_No')
            issue_invoice_no = request.GET.get('Issue_Invoice_No')
            date_type = request.GET.get('DateType')
            current_date = request.GET.get('CurrentDate')
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')
            status = request.GET.get('Status', 'Waiting').strip()

            # Initialize query
            query = Q()
            indent_table = Indent_raise_details_table if indent_type == 'raise' else Indent_issue_details_table

            # Base filter
            if indent_type == 'raise':
                # Status filter
                query &= Q(Raise_Status='Approved', Issue_Status=status)

                # From location / store
                if raised_from_location:
                    query &= Q(Raise_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Raise_From_NurseStation_Store=raised_from_nurse_station)
                    if raised_from_store:
                        query &= Q(Raise_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Raise_From_Store_Location__pk=raised_from_store)

                # To location / store
                if raised_to_location:
                    query &= Q(Raise_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Raise_To_NurseStation_Store=raised_to_nurse_station)
                    if raised_to_store:
                        query &= Q(Raise_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Raise_To_Store_Location__pk=raised_to_store)

                # Invoice filter
                if raise_invoice_no:
                    query &= Q(pk__iexact=raise_invoice_no)
                if issue_invoice_no:
                    query &= Q(indent_raise_details_issue__pk__iexact=issue_invoice_no)
                print(query,'query1')    


            elif indent_type == 'issue':
                # Status filter
                query &= Q(Issue_Status=status)

                # From location / store
                if raised_from_location:
                    query &= Q(Issue_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Issue_From_NurseStation_Store=True)
                    if raised_from_store:
                        query &= Q(Issue_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Issue_From_Store_Location__pk=raised_from_store)

                # To location / store
                if raised_to_location:
                    query &= Q(Issue_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Issue_To_NurseStation_Store=True)
                    if raised_to_store:
                        query &= Q(Issue_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Issue_To_Store_Location__pk=raised_to_store)

                # Invoice filter
                if raise_invoice_no:
                    # This comes from related raise indent
                    query &= Q(Indent_raise__pk__iexact=raise_invoice_no)
                if issue_invoice_no:
                    query &= Q(pk__iexact=issue_invoice_no)


            # Date filters
            if date_type == 'Current' and current_date:
                current_date_obj = current_date
                query &= Q(Raise_Date__date=current_date_obj) if indent_type == 'raise' else Q(Issue_Date__date=current_date_obj)
            elif date_type == 'Customize' and from_date and to_date:
                from_date_obj = from_date, 'FromDate'
                to_date_obj = to_date, 'ToDate'
                if from_date_obj > to_date_obj:
                    return JsonResponse({'error': 'FromDate cannot be later than ToDate'}, status=400)
                query &= Q(Raise_Date__range=(from_date_obj, to_date_obj)) if indent_type == 'raise' else Q(Issue_Date__range=(from_date_obj, to_date_obj))

            # Apply filter
            Indent_table_results = indent_table.objects.filter(query).order_by('-Created_at')
            # Display results for debugging
            
            indent_inssue_datas=[]
            if Indent_table_results:
                for indx, ins in enumerate(Indent_table_results):
                    dic={
                        'id':indx+1,
                        'Item_Detials':[]
                    }
                    
                    if indent_type == "raise":
                        
                        dic['Raised_pk'] = ins.pk
                        dic['RaisedFromLocation_pk'] = ins.Raise_From_Location.pk if ins.Raise_From_Location else None
                        dic['RaisedFromLocation'] = ins.Raise_From_Location.Location_Name if ins.Raise_From_Location else None
                        dic['RaisedFromNurseStation'] = ins.Raise_From_NurseStation_Store
                        dic['RaisedFromNurseStation_pk'] = ins.Raise_From_NurseStation_Location.pk if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else ''
                        dic['RaisedFromNurseStationWard'] = ins.Raise_From_NurseStation_Location.NurseStationName if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else ""
                        dic['RaisedFromStore_pk'] = ins.Raise_From_Store_Location.pk if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else ''
                        dic['RaisedFromStore'] = ins.Raise_From_Store_Location.Store_Name if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else ''
                        dic['RaisedToLocation_pk'] = ins.Raise_To_Location.pk if ins.Raise_To_Location else None
                        dic['RaisedToLocation'] = ins.Raise_To_Location.Location_Name if ins.Raise_To_Location else None
                        dic['RaisedToNurseStation'] = ins.Raise_To_NurseStation_Store
                        dic['RaisedToNurseStation_pk'] = ins.Raise_To_NurseStation_Location.pk if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else ''
                        dic['RaisedToNurseStationWard'] = ins.Raise_To_NurseStation_Location.NurseStationName if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else ''
                        dic['RaisedToStore_pk'] = ins.Raise_To_Store_Location.pk if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else ''
                        dic['RaisedToStore'] = ins.Raise_To_Store_Location.Store_Name if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else ''
                        dic['RaisedDate'] = ins.Raise_Date.strftime('%Y-%m-%d') if ins.Raise_Date else None
                        dic['RaisedApprovedDate'] = ins.Raise_ApprovedDate.strftime('%Y-%m-%d %I:%M %p') if ins.Raise_ApprovedDate else None
                        dic['Raised_by'] = ins.Raise_by
                        dic['RaisedApproved_by'] = ins.Raise_Approved_by
                        dic['RaisedReason'] = ins.Raise_Reason
                        dic['Raise_Status'] = ins.Raise_Status
                        dic['Issue_Status'] = ins.Issue_Status
                        
                        indent_items = Indent_raise_items_details_table.objects.filter(
    Indent_Detials__pk=ins.pk,
    Raise_Status='Approved'
)

                        for idx, item in enumerate(indent_items):

                            # Get batch-wise stocks for this product
                            stocks = Stock_Maintance_Table_Detials.objects.filter(
                                Store_location = item.Indent_Detials.Raise_From_Store_Location,
                                Product_Detials = item.Product_Detials
                            )

                            pharma_qty = Stock_Maintance_Table_Detials.objects.filter(
                                Store_location = 1,
                                Product_Detials = item.Product_Detials
                            )

                            op_qty = Stock_Maintance_Table_Detials.objects.filter(
                                Store_location = 2,
                                Product_Detials = item.Product_Detials
                            )
                            ip_qty = Stock_Maintance_Table_Detials.objects.filter(
                                Store_location = 3,
                                Product_Detials = item.Product_Detials
                            )
                            Foc_qty = Stock_Maintance_Table_Detials.objects.filter(
                                Store_location = 3,
                                Product_Detials = item.Product_Detials
                            )

                            # Sum available qty for THIS product only
                            total_available_qty = stocks.aggregate(
                                total=Sum('AvailableQuantity')
                            )['total'] or 0
                            pharma_available_qty = pharma_qty.aggregate(
                                total=Sum('AvailableQuantity')
                            )['total'] or 0
                            op_available_qty = op_qty.aggregate(
                                total=Sum('AvailableQuantity')
                            )['total'] or 0
                            ip_available_qty = ip_qty.aggregate(
                                total=Sum('AvailableQuantity')
                            )['total'] or 0
                            foc_available_qty = Foc_qty.aggregate(
                                total=Sum('AvailableQuantity')
                            )['total'] or 0

                            # Build item dictionary
                            item_dic = {
                                'id': idx + 1,
                                'pk': item.pk,
                                "ItemCode": item.Product_Detials.pk,
                                "ItemName": item.Product_Detials.ItemName,
                                "total_available_qty": total_available_qty,
                                "pharma_available_qty": pharma_available_qty,
                                "op_available_qty": op_available_qty,
                                "ip_available_qty": ip_available_qty,
                                "foc_available_qty": foc_available_qty,
                                "ProductCategory": item.Product_Detials.ProductCategory.ProductCategory_Name \
                                    if item.Product_Detials.ProductCategory else '',
                                "SubCategory": item.Product_Detials.SubCategory.SubCategoryName \
                                    if item.Product_Detials.SubCategory else '',
                                'PackType': item.Product_Detials.PackType.PackType_Name \
                                    if item.Product_Detials.PackType else 'Nill',
                                'PackQuantity': item.Product_Detials.PackQty if item.Product_Detials.PackQty else 'Nill',
                                'RaisedQuantity': item.Raise_Quantity,
                                'IssuedQuantity': item.Issue_Quantity,
                                'PendingQuantity': item.Pending_Quantity,
                                'RaisedReason': item.Reason,
                                'RaisedRemarks': item.Remarks,
                                'Raise_Status': item.Raise_Status,
                                'Issue_Status': item.Issue_Status
                            }

                            dic['Item_Detials'].append(item_dic)

                    
                    else:
                        
                        dic['Indent_Type'] = 'By Raise' if ins.Indent_Type =='raise' else 'Direct Issue'
                        dic['Issued_pk'] = ins.pk

                        if ins.Indent_Type =='raise':
                            Indent_raise_insss = ins.Indent_raise
                            dic['Raised_pk'] = Indent_raise_insss.pk if Indent_raise_insss else None
                            dic['RaisedFromLocation_pk'] = Indent_raise_insss.Raise_From_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromLocation'] = Indent_raise_insss.Raise_From_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromNurseStation'] = Indent_raise_insss.Raise_From_NurseStation_Store
                            dic['RaisedFromNurseStation_pk'] = Indent_raise_insss.Raise_From_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ''
                            dic['RaisedFromNurseStationWard'] = Indent_raise_insss.Raise_From_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ""
                            dic['RaisedFromStore_pk'] = Indent_raise_insss.Raise_From_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedFromStore'] = Indent_raise_insss.Raise_From_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                           
                            dic['RaisedToLocation_pk'] = Indent_raise_insss.Raise_To_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToLocation'] = Indent_raise_insss.Raise_To_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToNurseStation'] = Indent_raise_insss.Raise_To_NurseStation_Store
                            dic['RaisedToNurseStation_pk'] = Indent_raise_insss.Raise_To_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToNurseStationWard'] = Indent_raise_insss.Raise_To_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToStore_pk'] = Indent_raise_insss.Raise_To_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedToStore'] = Indent_raise_insss.Raise_To_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            
                            dic['RaisedDate'] = Indent_raise_insss.Raise_Date.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_Date else None
                            dic['RaisedApprovedDate'] = Indent_raise_insss.Raise_ApprovedDate.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_ApprovedDate else None
                            dic['Raised_by'] = Indent_raise_insss.Raise_by
                            dic['RaisedApproved_by'] = Indent_raise_insss.Raise_Approved_by
                            dic['RaisedReason'] = Indent_raise_insss.Raise_Reason
                            dic['Raise_Status'] = Indent_raise_insss.Raise_Status
                            dic['Issue_Status'] = Indent_raise_insss.Issue_Status
                        
                        dic['IssuedFromLocation_pk'] = ins.Issue_From_Location.pk if ins.Issue_From_Location else None
                        dic['IssuedFromLocation'] = ins.Issue_From_Location.Location_Name if ins.Issue_From_Location else None
                        dic['IssuedFromNurseStation'] = ins.Issue_From_NurseStation_Store
                        dic['IssuedFromNurseStation_pk'] = ins.Issue_From_NurseStation_Location.pk if ins.Issue_From_NurseStation_Store and ins.Issue_From_NurseStation_Location else ''
                        dic['IssuedFromNurseStationWard'] = ins.Issue_From_NurseStation_Location.NurseStationName if ins.Issue_From_NurseStation_Store and ins.Issue_From_NurseStation_Location else ""
                        dic['IssuedFromStore_pk'] = ins.Issue_From_Store_Location.pk if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        dic['IssuedFromStore'] = ins.Issue_From_Store_Location.Store_Name if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        
                        dic['IssuedToLocation_pk'] = ins.Issue_To_Location.pk if ins.Issue_To_Location else None
                        dic['IssuedToLocation'] = ins.Issue_To_Location.Location_Name if ins.Issue_To_Location else None
                        dic['IssuedToNurseStation'] = ins.Issue_To_NurseStation_Store
                        dic['IssuedToNurseStation_pk'] = ins.Issue_To_NurseStation_Location.pk if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToNurseStationWard'] = ins.Issue_To_NurseStation_Location.NurseStationName if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToStore_pk'] = ins.Issue_To_Store_Location.pk if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        dic['IssuedToStore'] = ins.Issue_To_Store_Location.Store_Name if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        
                        
                        dic['IssuedDate'] = ins.Issue_Date.strftime('%Y-%m-%d') if ins.Issue_Date else None
                        dic['IssuedApprovedDate'] = ins.Issue_ApprovedDate.strftime('%Y-%m-%d') if ins.Issue_ApprovedDate else None
                        dic['Issued_by'] = ins.Issue_by
                        dic['IssuedApproved_by'] = ins.Issue_Approved_by
                        dic['IssuedReason'] = ins.Issue_Reason
                        dic['Status'] = ins.Issue_Status
                        
                        indent_items = Indent_issue_items_details_table.objects.filter(
    Indent_Detials__pk=ins.pk
)

                        for idx, it_ins in enumerate(indent_items):

                            # Calculate stock for this specific product
                            stocks = Stock_Maintance_Table_Detials.objects.filter(
                                Store_location = it_ins.Indent_Detials.Issue_To_Store_Location,
                                Product_Detials = it_ins.Product_Detials
                            )

                            total_available_qty = stocks.aggregate(
                                total=Sum('AvailableQuantity')
                            )['total'] or 0

                            # Build dictionary for this item
                            item_dic = {
                                'id': idx + 1,
                                'Raisedpk': it_ins.Indent_Raise_Item.pk if it_ins.Indent_Raise_Item else None,
                                'Issuedpk': it_ins.pk,
                                "ItemCode": it_ins.Product_Detials.pk,
                                "ItemName": it_ins.Product_Detials.ItemName,
                                "total_available_qty": total_available_qty,
                                "ProductCategory": it_ins.Product_Detials.ProductCategory.ProductCategory_Name
                                    if it_ins.Product_Detials.ProductCategory else '',
                                "SubCategory": it_ins.Product_Detials.SubCategory.SubCategoryName
                                    if it_ins.Product_Detials.SubCategory else '',
                                'PackType': it_ins.Product_Detials.PackType.PackType_Name
                                    if it_ins.Product_Detials.PackType else 'Nill',
                                'PackQuantity': it_ins.Product_Detials.PackQty
                                    if it_ins.Product_Detials.PackQty else 'Nill',
                                'Reason': it_ins.Reason,
                                'BatchNo': it_ins.stock_Detials.Batch_No,
                                'AvailableQuantity': it_ins.stock_Detials.AvailableQuantity,
                                'IssuedQuantity': it_ins.Issue_Quantity,
                                'IssueQuantity': it_ins.Issue_Quantity,
                                'Remarks': it_ins.Remarks,
                                'Issue_Status': it_ins.Issue_Status,
                                'Status': it_ins.Issue_Status,
                                'SerialNoAvailable': it_ins.stock_Detials.Is_Serial_No_Available_for_each_quantity
                            }

                            if item_dic['SerialNoAvailable'] and it_ins.serialNo.exists():

                                print('123333')
                                item_dic['SerialNo'] = []
                                for serial in it_ins.serialNo.all():
                                    print('serial',serial)
                                    print('serial',serial.pk)
                                   
                                    print('121212')
                                    dattt= {
                                        'pk': serial.pk,
                                        'Serial_Number': serial.Serial_Number,
                                        "Status": True,
                                        'Item_Status': serial.Item_Status,
                                    }
                                    item_dic['SerialNo'].append(dattt)
                                    print('0000')
                                serial_status = all(item.get('Item_Status') == 'Available' for item in item_dic['SerialNo'])
                                if not serial_status:
                                    item_dic['SerialNo'] = []
                                    item_dic['SerialNo_status'] = False
                                else:
                                    item_dic['SerialNo_status'] = True
                                
                            if it_ins.Indent_Raise_Item:
                                item_dic['RaisedQuantity'] = it_ins.Indent_Raise_Item.Raise_Quantity
                                item_dic['PendingQuantity'] = it_ins.Indent_Raise_Item.Pending_Quantity
                            dic['Item_Detials'].append(item_dic)
                    indent_inssue_datas.append(dic)
                    
            return JsonResponse(indent_inssue_datas, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)   



@csrf_exempt
@require_http_methods(["POST", 'GET', 'OPTIONS'])
def GEN_post_indent_issue_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            
            # Extract main data fields from request
            IndentRaiseInvoice = data.get("IndentRaiseInvoice", None)
            IndentIssueInvoice = data.get("IndentIssueInvoice", None)
            IssueFromLocation = data.get("IssueFromLocation")
            IssueFromNurseStation = data.get("IssueFromNurseStation")
            IssueFromStore = data.get("IssueFromStore")
            IssueToLocation = data.get("IssueToLocation")
            IssueToNurseStation = data.get("IssueToNurseStation")
            IssueToStore = data.get("IssueToStore")
            IssueReason = data.get("IssueReason", '')
            print("IssueReason",IssueReason)
            createdBy = data.get("createdBy", '')
            ItemsData = data.get("ItemsData", [])
            IS_Indent_Issue_Approve = data.get('IS_Indent_Issue_Approve')
            print('IS_Indent_Issue_Approve------------',IS_Indent_Issue_Approve)

            # Initialize instances for locations and stores
            IssueFromLocation_ins = IssueFromNurseStation_ins = IssueFromInvStore_ins = None
            IssueToLocation_ins = IssueToNurseStation_ins = IssueToInvStore_ins = None
            approval_status = 'Issued'
            IndentRaiseInvoice_ins = None
            if IS_Indent_Issue_Approve:
                approval_status = 'Issued'
            else:
                approval_status = 'Approved'
                  
            

            # Get indent raise instance
            if IndentRaiseInvoice:
                IndentRaiseInvoice_ins = get_or_none(GEN_Indent_raise_details_table, IndentRaiseInvoice)
            
            # Handle issue location instances for IssueFrom
            if IssueFromLocation:
                IssueFromLocation_ins = get_or_none(Location_Detials, IssueFromLocation)
                if IssueFromLocation_ins:
                    inv_page_access = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId__pk=IssueFromLocation_ins.pk).first()
                    if inv_page_access and inv_page_access.IS_Indent:
                        approval_status = 'Issued' if inv_page_access.IS_Indent_Issue_Approve else 'Approved'
            
            # Handle ward and inventory store instances for IssueFrom
            if IssueFromStore:
                if IssueFromNurseStation:
                    IssueFromNurseStation_ins = get_or_none(NurseStationMaster, IssueFromStore)
                else:
                    IssueFromInvStore_ins = get_or_none(Inventory_Location_Master_Detials, IssueFromStore)
            
            # Handle issue location instances for IssueTo
            if IssueToLocation:
                IssueToLocation_ins = get_or_none(Location_Detials, IssueToLocation)
            
            # Handle ward and inventory store instances for IssueTo
            if IssueToStore:
                if IssueToNurseStation:
                    IssueToNurseStation_ins = get_or_none(NurseStationMaster, IssueToStore)
                else:
                    IssueToInvStore_ins = get_or_none(Department_Location_Master_Detials, IssueToStore)
            
            # Current datetime for issuing
            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            # Begin transaction for atomic database operations
            with transaction.atomic():
                # Update or create All_Indent_Details record
                indent_data = {
                    'pk': IndentIssueInvoice,
                    'Indent_Type': 'raise' if IndentRaiseInvoice else "issue",
                    'Indent_raise': IndentRaiseInvoice_ins,
                    'Issue_From_Location': IssueFromLocation_ins,
                    'Issue_From_NurseStation_Store': IssueFromNurseStation,
                    'Issue_From_Store_Location': IssueFromInvStore_ins,
                    'Issue_From_NurseStation_Location': IssueFromNurseStation_ins,
                    'Issue_To_Location': IssueToLocation_ins,
                    'Issue_To_NurseStation_Store': IssueToNurseStation,
                    'Issue_To_Store_Location': IssueToInvStore_ins,
                    'Issue_To_NurseStation_Location': IssueToNurseStation_ins,
                    'Issue_Date': formatted_date_time,
                    'Issue_Reason': IssueReason,
                    'Issue_Status': approval_status,
                }
                
                # Set issue/updated by fields
                if indent_data['pk']:
                    indent_data['Issue_Updated_by'] = createdBy
                else:
                    indent_data['Issue_by'] = createdBy
                
                # Set approval fields if status is approved
                if approval_status == 'Approved':
                    indent_data.update({
                        'Issue_Approved_by': createdBy,
                        'Issue_ApprovedDate': formatted_date_time,
                    })

                # Save or update indent issue instance
                if indent_data['pk']:
                    indent_issue_ins = get_or_none(GEN_Indent_issue_details_table, indent_data['pk'])
                    if indent_issue_ins:
                        for key, value in indent_data.items():
                            setattr(indent_issue_ins, key, value)
                        indent_issue_ins.save()
                else:
                    indent_issue_ins = GEN_Indent_issue_details_table.objects.create(**indent_data)

                issue_messages = []
                for it_ins in ItemsData:
                    try:
                        item_code = it_ins.get('ItemCode')
                        IssueQuantity = int(it_ins.get('IssueQuantity'))
                        BatchNo = it_ins.get('BatchNo')
                        Serial_Number = it_ins.get('SerialNo', [])

                        product_ins = Product_Master_All_Category_Details.objects.filter(pk=item_code).first()

                        # print(stock_Ins,'--sdfsdf ---1')
                        stock_Ins = Stock_Maintance_Table_Detials.objects.filter(
                            Product_Detials=product_ins,
                            Batch_No=BatchNo,
                            IsNurseStation=IssueFromNurseStation,
                            Store_location=IssueFromInvStore_ins,
                            NurseStation_location=IssueFromNurseStation_ins
                        ).first()

                        print(stock_Ins,'--sdfsdf')
                        
                        # Check stock availability
                        if stock_Ins.AvailableQuantity < IssueQuantity:
                            issue_messages.append(f"Insufficient stock for {product_ins.ItemName} (ItemCode: {item_code}). Available: {stock_Ins.AvailableQuantity}, Requested: {IssueQuantity}.")
                        # print('1111')
                        # print('1111', len(Serial_Number))
                        # Check serial number availability
                        if len(Serial_Number):
                            # print('1222')
                            Serial_no_ins = []
                            for serial in Serial_Number:
                                serial_ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                    pk=serial['pk'],
                                    Stock_Table=stock_Ins,
                                    Store_location=IssueFromInvStore_ins,
                                    NurseStation_location=IssueFromNurseStation_ins,
                                    Item_Status='Available'
                                ).first()
                                # print('12',serial_ins)
                                if serial_ins:
                                    Serial_no_ins.append({
                                        'serial_no':serial['pk'],
                                        'message': f" the serial no {serial['pk']} in the selected location "
                                    })
                            # print('222',Serial_no_ins)
                            if len(Serial_no_ins) < IssueQuantity:
                                issue_messages.append(f"Insufficient serials for {product_ins.ItemName} (ItemCode: {item_code}). Available serials: {len(Serial_no_ins)}, Requested: {IssueQuantity}.")
                    
                    except Exception as e:
                        return JsonResponse({
                            'ItemCode': item_code,
                            'Issue': f"An error occurred: {str(e)}"
                        },status=400)
                
                if issue_messages:
                    return JsonResponse({
                        'warn': issue_messages
                    },status=400)
                
                # print('ItemsData',ItemsData)

                for it_ins in ItemsData:
                    # print('it_ins')
                    try:
                        Raisedpk = it_ins.get('Raisedpk')
                        Issuedpk = it_ins.get('Issuedpk')
                        item_code = it_ins.get('ItemCode')
                        IssueQuantity = int(it_ins.get('IssueQuantity'))
                        BatchNo = it_ins.get('BatchNo')
                        Reason = it_ins.get('Reason', '')
                        Remarks = it_ins.get('Remarks', '')
                        Serial_Number = it_ins.get('SerialNo', [])
                        Status = it_ins.get('Status', '')
                        if Status != 'Cancelled':
                            Status = approval_status
                        
                        # Fetch product and stock details
                        product_ins = Product_Master_All_Category_Details.objects.filter(pk=item_code).first()
                        try:
                            stock_Ins = Stock_Maintance_Table_Detials.objects.filter(
                                Product_Detials=product_ins,
                                Batch_No=BatchNo,
                                IsNurseStation=IssueFromNurseStation,
                                Store_location=IssueFromInvStore_ins,
                                NurseStation_location=IssueFromNurseStation_ins
                            ).first()
                        except Exception as e :
                            return JsonResponse(f"Error fetching stock for ItemCode {item_code}, BatchNo {BatchNo}: {str(e)}",status=400)
                        # print('///1')
                        Serial_no_ins = set()
                        for serial in Serial_Number:
                            serial_ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                pk=serial['pk'],
                                Stock_Table=stock_Ins,
                                Store_location=IssueFromInvStore_ins,
                                NurseStation_location=IssueFromNurseStation_ins
                            ).first()
                            # print('///2')

                            if serial_ins:
                                Serial_no_ins.add(serial_ins)
                            # print('///3')
                        # print('///4',Serial_no_ins)
                        
                        # Prepare data for indent items
                        indent_items_data = {
                            'pk': Issuedpk,
                            'Indent_Raise_Item': get_or_none(GEN_Indent_raise_items_details_table, Raisedpk),
                            'Indent_Detials': indent_issue_ins,
                            'Product_Detials': product_ins,
                            'stock_Detials': stock_Ins,
                            'Issue_Quantity': 0 if  Status == 'Cancelled' else IssueQuantity,
                            'Issue_Status': Status,
                            'Reason': Reason,
                            'Remarks': Remarks,
                        }

                        # Save or update indent item instance
                        if indent_items_data['pk']:
                            print("indent_items_data['pk']",indent_items_data['pk'])
                            indent_issue_item_ins = get_or_none(GEN_Indent_issue_items_details_table, indent_items_data['pk'])
                            print('indent_issue_item_ins',indent_issue_item_ins)
                            if indent_issue_item_ins:
                                for key, value in indent_items_data.items():
                                    setattr(indent_issue_item_ins, key, value)
                                indent_issue_item_ins.save()
                        else:
                            indent_issue_item_ins = GEN_Indent_issue_items_details_table.objects.create(**indent_items_data)
                        
                        
                        
                        # print('///6')
                        # Assign serial numbers to the many-to-many field
                        if Serial_no_ins:
                            indent_issue_item_ins.serialNo.set(Serial_no_ins)
                        # print('////7')
                        
                        
                        if indent_issue_item_ins.Issue_Status == 'Approved':
                            # print('///8')
                            stock = indent_issue_item_ins.stock_Detials
                            issue_quantity = indent_issue_item_ins.Issue_Quantity

                            # Update stock details
                            stock.AvailableQuantity -= issue_quantity
                            stock.Indent_Send_Quantity += issue_quantity
                            stock.Total_Moved_Quantity += issue_quantity
                            stock.save(update_fields=['AvailableQuantity', 'Indent_Send_Quantity', 'Total_Moved_Quantity'])
                            if indent_issue_item_ins.serialNo.exists():
                                # Update serial numbers for the issue item
                                serial_numbers_to_update = list(
                                    indent_issue_item_ins.serialNo.filter(
                                        Store_location=indent_issue_ins.Issue_From_Store_Location,
                                        NurseStation_location=indent_issue_ins.Issue_From_NurseStation_Location,
                                        Item_Status='Available'
                                    ).values_list('id', flat=True)[:issue_quantity]
                                )
                                # Update serial numbers in stock maintenance table
                                SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                    pk__in=serial_numbers_to_update
                                ).update(Item_Status='Indent Movement')

                        if indent_issue_item_ins.Issue_Status == 'Cancelled':
                             # Update serial numbers for the issue item
                            if indent_issue_item_ins.serialNo.exists(): 
                                serial_numbers_to_update = list(
                                    indent_issue_item_ins.serialNo.filter(
                                        Store_location=indent_issue_ins.Issue_From_Store_Location,
                                        NurseStation_location=indent_issue_ins.Issue_From_NurseStation_Location,
                                        
                                    ).values_list('id', flat=True)[:indent_issue_item_ins.Issue_Quantity]
                                )
                                # Update serial numbers in stock maintenance table
                                SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                    pk__in=serial_numbers_to_update
                                ).update(Item_Status='Available')

                        # print('///9')
                        if indent_issue_item_ins.Indent_Raise_Item:
                            # print('///10')
                            if indent_issue_item_ins.Issue_Status != 'Cancelled':
                                # print('///11')
                                indent_raise_ins_indent = indent_issue_item_ins.Indent_Raise_Item
                                indent_raise_ins_indent.Issue_Quantity += indent_issue_item_ins.Issue_Quantity
                                indent_raise_ins_indent.Pending_Quantity = indent_raise_ins_indent.Pending_Quantity - indent_issue_item_ins.Issue_Quantity if indent_raise_ins_indent.Raise_Quantity > indent_raise_ins_indent.Issue_Quantity else 0
                                if indent_raise_ins_indent.Pending_Quantity == 0:
                                    indent_raise_ins_indent.Issue_Status = 'Completed'
                                elif indent_issue_item_ins.Issue_Quantity != 0:
                                    indent_raise_ins_indent.Issue_Status = 'Completed'
                                # print('///12')
                            else:
                                # print('///13')
                                indent_raise_ins_indent = indent_issue_item_ins.Indent_Raise_Item
                                indent_raise_ins_indent.Issue_Quantity = 0
                                indent_raise_ins_indent.Pending_Quantity = indent_raise_ins_indent.Raise_Quantity
                                indent_raise_ins_indent.Issue_Status = 'Cancelled'
                                # print('///14')
                            indent_raise_ins_indent.save()
                        
                    except Exception as e:
                        return JsonResponse({
                            'ItemCode': item_code,
                            'Issue': f"An error occurred: {str(e)}"
                        },status=400)

                if indent_issue_ins.Indent_raise:
                    # print('///15')
                    indent_issue_item_ins_12 = list(
                        GEN_Indent_issue_items_details_table.objects.exclude(
                            Issue_Status='Cancelled'
                        ).filter(
                            Indent_Raise_Item__Indent_Detials=indent_issue_ins.Indent_raise
                        ).values_list('Indent_Raise_Item', flat=True)
                    )
                    # print('///15---',indent_issue_item_ins_12)
                    if indent_issue_item_ins_12:
                        # print('///16')
                        indent_raise_update_ins = GEN_Indent_raise_items_details_table.objects.exclude(pk__in=indent_issue_item_ins_12)
                        for ins_ins in indent_raise_update_ins:
                            ins_ins.Issue_Status = 'Cancelled'
                            ins_ins.save()
                    # print('///17')
                    indent_raise_items = GEN_Indent_raise_items_details_table.objects.filter(
                        Indent_Detials=indent_issue_ins.Indent_raise,
                        Raise_Status='Approved'
                    )
                    all_Cancelled = all(item.Issue_Status == 'Cancelled' for item in indent_raise_items)
                    # print('///18')
                    if all_Cancelled:
                        indent_issue_ins.Indent_raise.Issue_Status = 'Cancelled'
                        indent_issue_ins.Issue_Status = 'Cancelled'
                    else:
                        indent_issue_ins.Indent_raise.Issue_Status = 'Completed'
                    # print('///19')
                    indent_issue_ins.save()
                    indent_issue_ins.Indent_raise.save()

                # If no issues, save instances and return success
                return JsonResponse({
                    'status': 'Success',
                    'message': 'Indent issue details recorded successfully.'
                }, status=200)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error':str(e)}, status=500)

    elif request.method == 'GET':
        try:
            # Extract and validate query parameters
            indent_type = request.GET.get('Indent_Type', 'raise').strip().lower()
            if indent_type not in ['raise', 'issue']:
                return JsonResponse({'error': 'Invalid Indent_Type'}, status=400)

            raised_from_location = request.GET.get('RaisedFromLocation')
            raised_from_nurse_station1 = request.GET.get('RaisedFromNurseStation')
            raised_from_nurse_station=False
            if raised_from_nurse_station1 == 'true':
                raised_from_nurse_station = True

            print(type(raised_from_location),'bjhtg')
            raised_from_store = request.GET.get('RaisedFromStore')
            raised_to_location = request.GET.get('RaisedToLocation')
            raised_to_nurse_station1 = request.GET.get('RaisedToNurseStation')
            raised_to_nurse_station = False
            if raised_to_nurse_station1 == 'true':
                raised_to_nurse_station = True

            raised_to_store = request.GET.get('RaisedToStore')
            raise_invoice_no = request.GET.get('Raise_Invoice_No')
            issue_invoice_no = request.GET.get('Issue_Invoice_No')
            date_type = request.GET.get('DateType')
            current_date = request.GET.get('CurrentDate')
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')
            status = request.GET.get('Status', 'Waiting').strip()

            # Initialize query
            query = Q()
            indent_table = GEN_Indent_raise_details_table if indent_type == 'raise' else GEN_Indent_issue_details_table

            # Base filter
            if indent_type == 'raise':
                # Status filter
                query &= Q(Raise_Status='Approved', Issue_Status=status)

                # From location / store
                if raised_from_location:
                    query &= Q(Raise_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Raise_From_NurseStation_Store=raised_from_nurse_station)
                    if raised_from_store:
                        query &= Q(Raise_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Raise_From_Store_Location__pk=raised_from_store)

                # To location / store
                if raised_to_location:
                    query &= Q(Raise_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Raise_To_NurseStation_Store=raised_to_nurse_station)
                    if raised_to_store:
                        query &= Q(Raise_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Raise_To_Store_Location__pk=raised_to_store)

                # Invoice filter
                if raise_invoice_no:
                    query &= Q(pk__iexact=raise_invoice_no)
                if issue_invoice_no:
                    query &= Q(indent_raise_details_issue__pk__iexact=issue_invoice_no)
                print(query,'query1')    


            elif indent_type == 'issue':
                # Status filter
                query &= Q(Issue_Status=status)

                # From location / store
                if raised_from_location:
                    query &= Q(Issue_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Issue_From_NurseStation_Store=True)
                    if raised_from_store:
                        query &= Q(Issue_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Issue_From_Store_Location__pk=raised_from_store)

                # To location / store
                if raised_to_location:
                    query &= Q(Issue_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Issue_To_NurseStation_Store=True)
                    if raised_to_store:
                        query &= Q(Issue_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Issue_To_Store_Location__pk=raised_to_store)

                # Invoice filter
                if raise_invoice_no:
                    # This comes from related raise indent
                    query &= Q(Indent_raise__pk__iexact=raise_invoice_no)
                if issue_invoice_no:
                    query &= Q(pk__iexact=issue_invoice_no)


            if date_type == 'Current' and current_date:
                current_date_obj = current_date
                query &= Q(Raise_Date__date=current_date_obj) if indent_type == 'raise' else Q(Issue_Date__date=current_date_obj)
            elif date_type == 'Customize' and from_date and to_date:
                from_date_obj = from_date, 'FromDate'
                to_date_obj = to_date, 'ToDate'
                if from_date_obj > to_date_obj:
                    return JsonResponse({'error': 'FromDate cannot be later than ToDate'}, status=400)
                query &= Q(Raise_Date__range=(from_date_obj, to_date_obj)) if indent_type == 'raise' else Q(Issue_Date__range=(from_date_obj, to_date_obj))

            # Apply filter
            Indent_table_results = indent_table.objects.filter(query).order_by('-Created_at')
            # Display results for debugging
            
            indent_inssue_datas=[]
            if Indent_table_results:
                for indx, ins in enumerate(Indent_table_results):
                    dic={
                        'id':indx+1,
                        'Item_Detials':[]
                    }
                    print('ins',ins)
                    if indent_type == "raise":
                        
                        dic['Raised_pk'] = ins.pk
                        dic['RaisedFromLocation_pk'] = ins.Raise_From_Location.pk if ins.Raise_From_Location else None
                        dic['RaisedFromLocation'] = ins.Raise_From_Location.Location_Name if ins.Raise_From_Location else None
                        dic['RaisedFromNurseStation'] = ins.Raise_From_NurseStation_Store
                        dic['RaisedFromNurseStation_pk'] = ins.Raise_From_NurseStation_Location.pk if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else ''
                        dic['RaisedFromNurseStationWard'] = ins.Raise_From_NurseStation_Location.NurseStationName if ins.Raise_From_NurseStation_Store and ins.Raise_From_NurseStation_Location else ""
                        dic['RaisedFromStore_pk'] = ins.Raise_From_Store_Location.pk if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else ''
                        dic['RaisedFromStore'] = ins.Raise_From_Store_Location.Store_Name if not ins.Raise_From_NurseStation_Store and ins.Raise_From_Store_Location else ''
                        dic['RaisedToLocation_pk'] = ins.Raise_To_Location.pk if ins.Raise_To_Location else None
                        dic['RaisedToLocation'] = ins.Raise_To_Location.Location_Name if ins.Raise_To_Location else None
                        dic['RaisedToNurseStation'] = ins.Raise_To_NurseStation_Store
                        dic['RaisedToNurseStation_pk'] = ins.Raise_To_NurseStation_Location.pk if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else ''
                        dic['RaisedToNurseStationWard'] = ins.Raise_To_NurseStation_Location.NurseStationName if ins.Raise_To_NurseStation_Store and ins.Raise_To_NurseStation_Location else ''
                        dic['RaisedToStore_pk'] = ins.Raise_To_Store_Location.pk if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else ''
                        dic['RaisedToStore'] = ins.Raise_To_Store_Location.Store_Name if not ins.Raise_To_NurseStation_Store and ins.Raise_To_Store_Location else ''
                        dic['RaisedDate'] = ins.Raise_Date.strftime('%Y-%m-%d') if ins.Raise_Date else None
                        dic['RaisedApprovedDate'] = ins.Raise_ApprovedDate.strftime('%Y-%m-%d %I:%M %p') if ins.Raise_ApprovedDate else None
                        dic['Raised_by'] = ins.Raise_by
                        dic['RaisedApproved_by'] = ins.Raise_Approved_by
                        dic['RaisedReason'] = ins.Raise_Reason
                        dic['Raise_Status'] = ins.Raise_Status
                        dic['Issue_Status'] = ins.Issue_Status
                        
                        indent_items = GEN_Indent_raise_items_details_table.objects.filter(
                            Indent_Detials__pk=ins.pk,
                            Raise_Status='Approved'
                        )

                        for idx, item in enumerate(indent_items):
                            # FIXED: Check if store_location exists and handle the query properly
                            total_available_qty = 0
                            pharma_available_qty = 0
                            op_available_qty = 0
                            ip_available_qty = 0
                            foc_available_qty = 0
                            
                            # Only query stocks if we have a valid store location
                            if item.Indent_Detials and item.Indent_Detials.Raise_From_Store_Location:
                                try:
                                    # Get batch-wise stocks for this product - use pk instead of object
                                    stocks = Stock_Maintance_Table_Detials.objects.filter(
                                        Store_location__pk=item.Indent_Detials.Raise_From_Store_Location.pk,
                                        Product_Detials=item.Product_Detials
                                    )
                                    total_available_qty = stocks.aggregate(
                                        total=Sum('AvailableQuantity')
                                    )['total'] or 0
                                except Exception as e:
                                    print(f"Error querying stocks: {e}")
                                    total_available_qty = 0

                            # For fixed locations, use their primary keys directly
                            try:
                                pharma_qty = Stock_Maintance_Table_Detials.objects.filter(
                                    Store_location__pk=1,  # Assuming 1 is the pk for pharma store
                                    Product_Detials=item.Product_Detials
                                )
                                pharma_available_qty = pharma_qty.aggregate(
                                    total=Sum('AvailableQuantity')
                                )['total'] or 0
                            except:
                                pharma_available_qty = 0
                                
                            try:
                                op_qty = Stock_Maintance_Table_Detials.objects.filter(
                                    Store_location__pk=2,  # Assuming 2 is the pk for OP store
                                    Product_Detials=item.Product_Detials
                                )
                                op_available_qty = op_qty.aggregate(
                                    total=Sum('AvailableQuantity')
                                )['total'] or 0
                            except:
                                op_available_qty = 0
                                
                            try:
                                ip_qty = Stock_Maintance_Table_Detials.objects.filter(
                                    Store_location__pk=3,  # Assuming 3 is the pk for IP store
                                    Product_Detials=item.Product_Detials
                                )
                                ip_available_qty = ip_qty.aggregate(
                                    total=Sum('AvailableQuantity')
                                )['total'] or 0
                            except:
                                ip_available_qty = 0
                                
                            try:
                                Foc_qty = Stock_Maintance_Table_Detials.objects.filter(
                                    Store_location__pk=4,  # Changed from 3 to 4 to avoid duplication with IP
                                    Product_Detials=item.Product_Detials
                                )
                                foc_available_qty = Foc_qty.aggregate(
                                    total=Sum('AvailableQuantity')
                                )['total'] or 0
                            except:
                                foc_available_qty = 0

                            # Build item dictionary
                            item_dic = {
                                'id': idx + 1,
                                'pk': item.pk,
                                "ItemCode": item.Product_Detials.pk,
                                "ItemName": item.Product_Detials.ItemName,
                                "total_available_qty": total_available_qty,
                                "pharma_available_qty": pharma_available_qty,
                                "op_available_qty": op_available_qty,
                                "ip_available_qty": ip_available_qty,
                                "foc_available_qty": foc_available_qty,
                                "ProductCategory": item.Product_Detials.ProductCategory.ProductCategory_Name \
                                    if item.Product_Detials.ProductCategory else '',
                                "SubCategory": item.Product_Detials.SubCategory.SubCategoryName \
                                    if item.Product_Detials.SubCategory else '',
                                'PackType': item.Product_Detials.PackType.PackType_Name \
                                    if item.Product_Detials.PackType else 'Nill',
                                'PackQuantity': item.Product_Detials.PackQty if item.Product_Detials.PackQty else 'Nill',
                                'RaisedQuantity': item.Raise_Quantity,
                                'IssuedQuantity': item.Issue_Quantity,
                                'PendingQuantity': item.Pending_Quantity,
                                'RaisedReason': item.Reason,
                                'RaisedRemarks': item.Remarks,
                                'Raise_Status': item.Raise_Status,
                                'Issue_Status': item.Issue_Status
                            }

                            dic['Item_Detials'].append(item_dic)

                    
                    else:
                        
                        dic['Indent_Type'] = 'By Raise' if ins.Indent_Type =='raise' else 'Direct Issue'
                        dic['Issued_pk'] = ins.pk

                        if ins.Indent_Type =='raise':
                            Indent_raise_insss = ins.Indent_raise
                            dic['Raised_pk'] = Indent_raise_insss.pk if Indent_raise_insss else None
                            dic['RaisedFromLocation_pk'] = Indent_raise_insss.Raise_From_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromLocation'] = Indent_raise_insss.Raise_From_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromNurseStation'] = Indent_raise_insss.Raise_From_NurseStation_Store
                            dic['RaisedFromNurseStation_pk'] = Indent_raise_insss.Raise_From_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ''
                            dic['RaisedFromNurseStationWard'] = Indent_raise_insss.Raise_From_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ""
                            dic['RaisedFromStore_pk'] = Indent_raise_insss.Raise_From_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedFromStore'] = Indent_raise_insss.Raise_From_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                        
                            dic['RaisedToLocation_pk'] = Indent_raise_insss.Raise_To_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToLocation'] = Indent_raise_insss.Raise_To_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToNurseStation'] = Indent_raise_insss.Raise_To_NurseStation_Store
                            dic['RaisedToNurseStation_pk'] = Indent_raise_insss.Raise_To_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToNurseStationWard'] = Indent_raise_insss.Raise_To_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToStore_pk'] = Indent_raise_insss.Raise_To_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedToStore'] = Indent_raise_insss.Raise_To_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            
                            dic['RaisedDate'] = Indent_raise_insss.Raise_Date.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_Date else None
                            dic['RaisedApprovedDate'] = Indent_raise_insss.Raise_ApprovedDate.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_ApprovedDate else None
                            dic['Raised_by'] = Indent_raise_insss.Raise_by
                            dic['RaisedApproved_by'] = Indent_raise_insss.Raise_Approved_by
                            dic['RaisedReason'] = Indent_raise_insss.Raise_Reason
                            dic['Raise_Status'] = Indent_raise_insss.Raise_Status
                            dic['Issue_Status'] = Indent_raise_insss.Issue_Status
                        
                        dic['IssuedFromLocation_pk'] = ins.Issue_From_Location.pk if ins.Issue_From_Location else None
                        dic['IssuedFromLocation'] = ins.Issue_From_Location.Location_Name if ins.Issue_From_Location else None
                        dic['IssuedFromNurseStation'] = ins.Issue_From_NurseStation_Store
                        dic['IssuedFromNurseStation_pk'] = ins.Issue_From_NurseStation_Location.pk if ins.Issue_From_NurseStation_Store and ins.Issue_From_NurseStation_Location else ''
                        dic['IssuedFromNurseStationWard'] = ins.Issue_From_NurseStation_Location.NurseStationName if ins.Issue_From_NurseStation_Store and ins.Issue_From_NurseStation_Location else ""
                        dic['IssuedFromStore_pk'] = ins.Issue_From_Store_Location.pk if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        dic['IssuedFromStore'] = ins.Issue_From_Store_Location.Store_Name if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        
                        dic['IssuedToLocation_pk'] = ins.Issue_To_Location.pk if ins.Issue_To_Location else None
                        dic['IssuedToLocation'] = ins.Issue_To_Location.Location_Name if ins.Issue_To_Location else None
                        dic['IssuedToNurseStation'] = ins.Issue_To_NurseStation_Store
                        dic['IssuedToNurseStation_pk'] = ins.Issue_To_NurseStation_Location.pk if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToNurseStationWard'] = ins.Issue_To_NurseStation_Location.NurseStationName if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToStore_pk'] = ins.Issue_To_Store_Location.pk if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        dic['IssuedToStore'] = ins.Issue_To_Store_Location.Store_Name if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        
                        
                        dic['IssuedDate'] = ins.Issue_Date.strftime('%Y-%m-%d') if ins.Issue_Date else None
                        dic['IssuedApprovedDate'] = ins.Issue_ApprovedDate.strftime('%Y-%m-%d') if ins.Issue_ApprovedDate else None
                        dic['Issued_by'] = ins.Issue_by
                        dic['IssuedApproved_by'] = ins.Issue_Approved_by
                        dic['IssuedReason'] = ins.Issue_Reason
                        dic['Status'] = ins.Issue_Status
                        
                        indent_items = GEN_Indent_issue_items_details_table.objects.filter(
                            Indent_Detials__pk=ins.pk
                        )

                        for idx, it_ins in enumerate(indent_items):
                            # FIXED: Handle stock query for issue items
                            total_available_qty = 0
                            
                            if it_ins.Indent_Detials and it_ins.Indent_Detials.Issue_To_Store_Location:
                                try:
                                    # Calculate stock for this specific product - use pk instead of object
                                    stocks = Stock_Maintance_Table_Detials.objects.filter(
                                        Store_location__pk=it_ins.Indent_Detials.Issue_To_Store_Location.pk,
                                        Product_Detials=it_ins.Product_Detials
                                    )
                                    total_available_qty = stocks.aggregate(
                                        total=Sum('AvailableQuantity')
                                    )['total'] or 0
                                except Exception as e:
                                    print(f"Error querying issue stocks: {e}")
                                    total_available_qty = 0

                            # Build dictionary for this item
                            item_dic = {
                                'id': idx + 1,
                                'Raisedpk': it_ins.Indent_Raise_Item.pk if it_ins.Indent_Raise_Item else None,
                                'Issuedpk': it_ins.pk,
                                "ItemCode": it_ins.Product_Detials.pk,
                                "ItemName": it_ins.Product_Detials.ItemName,
                                "total_available_qty": total_available_qty,
                                "ProductCategory": it_ins.Product_Detials.ProductCategory.ProductCategory_Name
                                    if it_ins.Product_Detials.ProductCategory else '',
                                "SubCategory": it_ins.Product_Detials.SubCategory.SubCategoryName
                                    if it_ins.Product_Detials.SubCategory else '',
                                'PackType': it_ins.Product_Detials.PackType.PackType_Name
                                    if it_ins.Product_Detials.PackType else 'Nill',
                                'PackQuantity': it_ins.Product_Detials.PackQty
                                    if it_ins.Product_Detials.PackQty else 'Nill',
                                'Reason': it_ins.Reason,
                                'BatchNo': it_ins.stock_Detials.Batch_No if it_ins.stock_Detials else '',
                                'AvailableQuantity': it_ins.stock_Detials.AvailableQuantity if it_ins.stock_Detials else 0,
                                'IssuedQuantity': it_ins.Issue_Quantity,
                                'IssueQuantity': it_ins.Issue_Quantity,
                                'Remarks': it_ins.Remarks,
                                'Issue_Status': it_ins.Issue_Status,
                                'Status': it_ins.Issue_Status,
                                'SerialNoAvailable': it_ins.stock_Detials.Is_Serial_No_Available_for_each_quantity if it_ins.stock_Detials else False
                            }

                            if item_dic['SerialNoAvailable'] and it_ins.serialNo.exists():
                                item_dic['SerialNo'] = []
                                for serial in it_ins.serialNo.all():
                                    dattt= {
                                        'pk': serial.pk,
                                        'Serial_Number': serial.Serial_Number,
                                        "Status": True,
                                        'Item_Status': serial.Item_Status,
                                    }
                                    item_dic['SerialNo'].append(dattt)
                                
                                serial_status = all(item.get('Item_Status') == 'Available' for item in item_dic['SerialNo'])
                                if not serial_status:
                                    item_dic['SerialNo'] = []
                                    item_dic['SerialNo_status'] = False
                                else:
                                    item_dic['SerialNo_status'] = True
                                
                            if it_ins.Indent_Raise_Item:
                                item_dic['RaisedQuantity'] = it_ins.Indent_Raise_Item.Raise_Quantity
                                item_dic['PendingQuantity'] = it_ins.Indent_Raise_Item.Pending_Quantity
                            dic['Item_Detials'].append(item_dic)
                    indent_inssue_datas.append(dic)
                    
            return JsonResponse(indent_inssue_datas, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Indent_Issue_Details_Approve_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            indent_type = data.get('IndentType')
            invoice_no = data.get('InvoiceNo')
            status = data.get('Status')
            approved_by = data.get('Approved_by', '')

            if not invoice_no:
                return JsonResponse({'error': 'InvoiceNo is required'}, status=400)
            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            with transaction.atomic():
                if indent_type == 'raise':
                    # Process for Indent Raise
                    try:
                        indent_instance = Indent_raise_details_table.objects.filter(pk=invoice_no).first()
                    except Indent_raise_details_table.DoesNotExist:
                        return JsonResponse({'error': 'Indent raise entry not found'}, status=404)

                    

                    # Update related items
                    related_items = Indent_raise_items_details_table.objects.filter(
                        Indent_Detials=indent_instance,
                        Raise_Status='Approved'
                    )
                    for item in related_items:
                        item.Issue_Status = status
                        item.save()

                    
                    indent_instance.Issue_Status = status
                    indent_instance.Raise_ApprovedDate = formatted_date_time
                    indent_instance.Raise_Approved_by = approved_by
                    indent_instance.save()
                    
                    return JsonResponse({'success': f'Indent Raise {status} successfully'}, status=200)

                elif indent_type == 'issue':
                    # Process for Indent Issue
                    try:
                        indent_instance = Indent_issue_details_table.objects.filter(pk=invoice_no).first()
                    except Indent_issue_details_table.DoesNotExist:
                        return JsonResponse({'error': 'Indent issue entry not found'}, status=404)

                    

                    # Update related items
                    related_items = Indent_issue_items_details_table.objects.filter(
                        Indent_Detials=indent_instance,
                        Issue_Status='Issued'
                    )
                    issue_messages =[]
                    for item in related_items:
                        try:
                            product_ins = item.Product_Detials
                            IssueQuantity = item.Issue_Quantity
                            stock_Ins = item.stock_Detials
                            serial_no =  item.serialNo
                            issue_parent_ins = item.Indent_Detials
                            if stock_Ins.AvailableQuantity < IssueQuantity:
                                issue_messages.append(f"Insufficient stock for {product_ins.ItemName} (ItemCode: {product_ins.pk}). Available: {stock_Ins.AvailableQuantity}, Requested: {IssueQuantity}.")

                            if serial_no.exists():
                                Serial_no_ins = serial_no.filter(Item_Status='Available')

                                if len(Serial_no_ins) < IssueQuantity:
                                    issue_messages.append(f"Insufficient serials for {product_ins.ItemName} (ItemCode: {product_ins.pk}). Available serials: {len(Serial_no_ins)}, Requested: {IssueQuantity}.")
                        
                        except Exception as e:
                            print(f"An error occurred: {str(e)}")
                            return JsonResponse({'error': str(e)}, status=500)   
                    if issue_messages:
                        return JsonResponse({
                            'warn': issue_messages
                        })
                    for item in related_items:
                        item.Issue_Status = status
                        item.save()
                    # Check if status is approved and update stock and serial numbers
                        if item.Issue_Status == 'Approved':
                            stock = item.stock_Detials
                            issue_quantity = item.Issue_Quantity

                            # Update stock details
                            stock.AvailableQuantity -= issue_quantity
                            stock.Update_Reason = 'Indent Issued'
                            stock.Update_at = datetime.now()
                            stock.Updated_by = approved_by
                            stock.Indent_Send_Quantity += issue_quantity
                            stock.Total_Moved_Quantity += issue_quantity
                            stock.save(update_fields=['AvailableQuantity', 'Indent_Send_Quantity', 'Total_Moved_Quantity','Update_Reason','Update_at','Updated_by'])

                            # Update serial numbers for the issue item

                            serial_numbers_to_update = list(
                                item.serialNo.filter(
                                    Store_location=indent_instance.Issue_From_Store_Location,
                                    NurseStation_location=indent_instance.Issue_From_NurseStation_Location,
                                    Item_Status='Available'
                                ).values_list('id', flat=True)[:issue_quantity]
                            )
                            # Update serial numbers in stock maintenance table

                            
                            SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                id__in=serial_numbers_to_update
                            ).update(Item_Status='Indent Movement')
                    
                    indent_instance.Issue_Status = status
                    indent_instance.Issue_ApprovedDate = formatted_date_time
                    indent_instance.Issue_Approved_by = approved_by
                    indent_instance.save()
                    
                    return JsonResponse({'success': f'Indent Issue {status} successfully'}, status=200)

                else:
                    return JsonResponse({'error': 'Invalid IndentType provided'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def GEN_Indent_Issue_Details_Approve_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            indent_type = data.get('IndentType')
            invoice_no = data.get('InvoiceNo')
            status = data.get('Status')
            approved_by = data.get('Approved_by', '')

            if not invoice_no:
                return JsonResponse({'error': 'InvoiceNo is required'}, status=400)
            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            with transaction.atomic():
                if indent_type == 'raise':
                    # Process for Indent Raise
                    try:
                        indent_instance = GEN_Indent_raise_details_table.objects.filter(pk=invoice_no).first()
                    except Indent_raise_details_table.DoesNotExist:
                        return JsonResponse({'error': 'Indent raise entry not found'}, status=404)

                    

                    # Update related items
                    related_items = GEN_Indent_raise_items_details_table.objects.filter(
                        Indent_Detials=indent_instance,
                        Raise_Status='Approved'
                    )
                    for item in related_items:
                        item.Issue_Status = status
                        item.save()

                    
                    indent_instance.Issue_Status = status
                    indent_instance.Raise_ApprovedDate = formatted_date_time
                    indent_instance.Raise_Approved_by = approved_by
                    indent_instance.save()
                    
                    return JsonResponse({'success': f'Indent Raise {status} successfully'}, status=200)

                elif indent_type == 'issue':
                    # Process for Indent Issue
                    try:
                        indent_instance = GEN_Indent_issue_details_table.objects.filter(pk=invoice_no).first()
                    except GEN_Indent_issue_details_table.DoesNotExist:
                        return JsonResponse({'error': 'Indent issue entry not found'}, status=404)

                    

                    # Update related items
                    related_items = GEN_Indent_issue_items_details_table.objects.filter(
                        Indent_Detials=indent_instance,
                        Issue_Status='Issued'
                    )
                    issue_messages =[]
                    for item in related_items:
                        try:
                            product_ins = item.Product_Detials
                            IssueQuantity = item.Issue_Quantity
                            stock_Ins = item.stock_Detials
                            serial_no =  item.serialNo
                            issue_parent_ins = item.Indent_Detials
                            if stock_Ins.AvailableQuantity < IssueQuantity:
                                issue_messages.append(f"Insufficient stock for {product_ins.ItemName} (ItemCode: {product_ins.pk}). Available: {stock_Ins.AvailableQuantity}, Requested: {IssueQuantity}.")

                            if serial_no.exists():
                                Serial_no_ins = serial_no.filter(Item_Status='Available')

                                if len(Serial_no_ins) < IssueQuantity:
                                    issue_messages.append(f"Insufficient serials for {product_ins.ItemName} (ItemCode: {product_ins.pk}). Available serials: {len(Serial_no_ins)}, Requested: {IssueQuantity}.")
                        
                        except Exception as e:
                            print(f"An error occurred: {str(e)}")
                            return JsonResponse({'error': str(e)}, status=500)   
                    if issue_messages:
                        return JsonResponse({
                            'warn': issue_messages
                        })
                    for item in related_items:
                        item.Issue_Status = status
                        item.save()
                    # Check if status is approved and update stock and serial numbers
                        if item.Issue_Status == 'Approved':
                            stock = item.stock_Detials
                            issue_quantity = item.Issue_Quantity

                            # Update stock details
                            stock.AvailableQuantity -= issue_quantity
                            stock.Update_Reason = 'Indent Issued'
                            stock.Indent_Send_Quantity += issue_quantity
                            stock.Total_Moved_Quantity += issue_quantity
                            stock.save(update_fields=['AvailableQuantity', 'Indent_Send_Quantity', 'Total_Moved_Quantity'])

                            # Update serial numbers for the issue item

                            serial_numbers_to_update = list(
                                item.serialNo.filter(
                                    Store_location=indent_instance.Issue_From_Store_Location,
                                    NurseStation_location=indent_instance.Issue_From_NurseStation_Location,
                                    Item_Status='Available'
                                ).values_list('id', flat=True)[:issue_quantity]
                            )
                            # Update serial numbers in stock maintenance table

                            
                            SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                id__in=serial_numbers_to_update
                            ).update(Item_Status='Indent Movement')
                    
                    indent_instance.Issue_Status = status
                    indent_instance.Issue_ApprovedDate = formatted_date_time
                    indent_instance.Issue_Approved_by = approved_by
                    indent_instance.save()
                    
                    return JsonResponse({'success': f'Indent Issue {status} successfully'}, status=200)

                else:
                    return JsonResponse({'error': 'Invalid IndentType provided'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def Post_Indent_Receive_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            Received_pk = data.get('Received_pk')
            Issued_pk = data.get('Issued_pk')
            ReceivedReason = data.get('ReceivedReason')
            Items_Data = data.get('Items_Data', [])
            createdBy = data.get('createdBy')

            # Determine approval status
            approval_status = 'Received' if not data.get('IS_Indent_Receive_Approve') else 'Received'
            # print(approval_status,'approval_status')
            # Fetch Indent Issue & Receive Details
            Received_pk_ins = get_or_none(Indent_receive_details_table, Received_pk) if Received_pk else None
            Issued_pk_ins = get_or_none(Indent_issue_details_table, Issued_pk)
            if not Issued_pk_ins:
                return JsonResponse({'error': 'Invalid Issued_pk'}, status=400)

            with transaction.atomic():
                current_date_time = datetime.now().strftime('%Y-%m-%d')

                indent_data = {
                    'Indent_issue': Issued_pk_ins,
                    'Receive_Date': current_date_time,
                    'Receive_Reason': ReceivedReason,
                    'Receive_Status': approval_status,
                    'Receive_by': createdBy if not Received_pk_ins else None,
                    'Receive_Updated_by': createdBy if Received_pk_ins else None
                }

                if approval_status == 'Approved':
                    indent_data.update({
                        'Receive_Approved_by': createdBy,
                        'Receive_ApprovedDate': current_date_time,
                    })

                # Update or Create Indent Receive Record
                if Received_pk_ins:
                    for key, value in indent_data.items():
                        setattr(Received_pk_ins, key, value)
                    Received_pk_ins.save()
                    indent_receive_ins = Received_pk_ins
                else:
                    indent_receive_ins = Indent_receive_details_table.objects.create(**indent_data)

                # Process Indent Items
                for it_ins in Items_Data:
                    it_ins_Receivedpk = it_ins.get('Receivedpk')
                    it_ins_Issuedpk = it_ins.get('Issuedpk')

                    it_ins_Receivedpk_ins = get_or_none(Indent_receive_items_details_table, it_ins_Receivedpk)
                    it_ins_Issuedpk_ins = get_or_none(Indent_issue_items_details_table, it_ins_Issuedpk)

                    ReceivedSerialNo_ins = {
                        get_or_none(SerialNumber_Stock_Maintance_Table_Detials, serial['pk'])
                        for serial in it_ins.get('ReceivedSerialNo', []) if serial.get('pk')
                    }
                    DamagedSerialNo_ins = {
                        get_or_none(SerialNumber_Stock_Maintance_Table_Detials, serial['pk'])
                        for serial in it_ins.get('DamagedSerialNo', []) if serial.get('pk')
                    }
                    PendingSerialNo_ins = {
                        get_or_none(SerialNumber_Stock_Maintance_Table_Detials, serial['pk'])
                        for serial in it_ins.get('PendingSerialNo', []) if serial.get('pk')
                    }

                    indent_items_data = {
                        'Indent_Detials': indent_receive_ins,
                        'Indent_issue_Item': it_ins_Issuedpk_ins,
                        'Received_Quantity': it_ins.get('ReceivedQuantity', 0),
                        'Damaged_Quantity': it_ins.get('DamagedQuantity', 0),
                        'Pending_Quantity': it_ins.get('PendingQuantity', 0),
                        'Reason': it_ins.get('Reason', ''),
                        'Remarks': it_ins.get('Remarks', ''),
                        'Status': approval_status if it_ins.get('Status') != 'Cancelled' else 'Cancelled',
                    }

                    if it_ins_Receivedpk_ins:
                        for key, value in indent_items_data.items():
                            setattr(it_ins_Receivedpk_ins, key, value)
                        it_ins_Receivedpk_ins.save()
                        indent_receive_item_ins = it_ins_Receivedpk_ins
                    else:
                        indent_receive_item_ins = Indent_receive_items_details_table.objects.create(**indent_items_data)

                    indent_receive_item_ins.Received_serialNo.set(ReceivedSerialNo_ins)
                    indent_receive_item_ins.Damaged_serialNo.set(DamagedSerialNo_ins)
                    indent_receive_item_ins.Pending_serialNo.set(PendingSerialNo_ins)

                    # ✅ Update `Receive_Status` for `Indent_issue_items_details_table`
                    if approval_status in ["Received", "Approved"]:
                        it_ins_Issuedpk_ins.Receive_Status = 'Completed'
                        it_ins_Issuedpk_ins.save()

                # ✅ Update `Receive_Status` for `Indent_issue_details_table`
                if approval_status in ["Received", "Approved"]:
                    Indent_issue_Ins = Indent_issue_details_table.objects.filter(pk=Issued_pk_ins.pk).first()
                    Indent_issue_Ins.Receive_Status = 'Completed'
                    Indent_issue_Ins.save()

                return JsonResponse({
                    'status': 'success',
                    'message': 'Indent receive details recorded successfully.'
                }, status=200)

        except Exception as e:
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            Indent_Type = request.GET.get('Indent_Type', 'issue').strip().lower()
            if Indent_Type not in ['issue', 'receive']:
                return JsonResponse({'error': 'Invalid Indent_Type'}, status=400)

            # Params
            raised_from_location = request.GET.get('RaisedFromLocation')
            raised_from_nurse_station = request.GET.get('RaisedFromNurseStation', False)
            raised_from_store = request.GET.get('RaisedFromStore')
            raised_to_location = request.GET.get('RaisedToLocation')
            raised_to_nurse_station = request.GET.get('RaisedToNurseStation', False)
            raised_to_store = request.GET.get('RaisedToStore')
            issue_invoice_no = request.GET.get('Issue_Invoice_No')
            receive_invoice_no = request.GET.get('Receive_Invoice_No')
            date_type = request.GET.get('DateType')
            current_date = request.GET.get('CurrentDate')
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')
            status = request.GET.get('Status', 'waiting').strip()
            ActivePharmacyStoreId = request.GET.get('ActivePharmacyStoreId')


            query = Q()

            if Indent_Type == 'issue':
                indent_table = Indent_issue_details_table
                indent_items_table = Indent_issue_items_details_table
                query &= Q(Issue_Status='Approved', Receive_Status=status)

                # From filters
                if raised_from_location:
                    query &= Q(Issue_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Issue_From_NurseStation_Store=True)
                    if raised_from_store:
                        query &= Q(Issue_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Issue_From_Store_Location__pk=raised_from_store)

                # To filters
                if raised_to_location:
                    query &= Q(Issue_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Issue_To_NurseStation_Store=True)
                    if raised_to_store:
                        query &= Q(Issue_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Issue_To_Store_Location__pk=raised_to_store)


                if ActivePharmacyStoreId:
                    query &= Q(Issue_To_Store_Location__pk=ActivePharmacyStoreId)

                if issue_invoice_no:
                    query &= Q(pk__iexact=issue_invoice_no)

                # Dates
                if date_type == 'Current' and current_date:
                    query &= Q(Issue_Date__date=current_date)
                elif date_type == 'Customize' and from_date and to_date:

                    print('indieeeeeeeeeeeee issue')

                    if from_date > to_date:
                        return JsonResponse({'error': 'FromDate cannot be later than ToDate'}, status=400)
                    query &= Q(Issue_Date__range=(from_date, to_date))

                    print(query,'queryyyyyyyyyyyy issue')


            elif Indent_Type == 'receive':
                indent_table = Indent_receive_details_table
                indent_items_table = Indent_receive_items_details_table
                query &= Q(Receive_Status=status)

                # From filters
                if raised_from_location:
                    query &= Q(Receive_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Receive_From_NurseStation_Store=True)
                    if raised_from_store:
                        query &= Q(Receive_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Receive_From_Store_Location__pk=raised_from_store)

                # To filters
                if raised_to_location:
                    query &= Q(Receive_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Indent_issue__Issue_To_NurseStation_Store=True)
                    if raised_to_store:
                        query &= Q(Receive_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Receive_To_Store_Location__pk=raised_to_store)

                if issue_invoice_no:
                    query &= Q(Indent_raise__pk__iexact=issue_invoice_no)
                if receive_invoice_no:
                    query &= Q(pk__iexact=receive_invoice_no)

                # Dates
                if date_type == 'Current' and current_date:
                    query &= Q(Receive_Date__date=current_date)
                elif date_type == 'Customize' and from_date and to_date:

                    print('indieeeeeeeeeeeee receiveeeeeeeee')
                    if from_date > to_date:
                        return JsonResponse({'error': 'FromDate cannot be later than ToDate'}, status=400)
                    query &= Q(Receive_Date__range=(from_date, to_date))

                    print(query,'queryyyyyyyyyyyy receiveeeeeeeee')

            # Execute query on chosen table
            Indent_table_results = None
            if indent_table:
                Indent_table_results = indent_table.objects.filter(query).order_by('-Created_at')
            
            print('Indent_table_results???',Indent_table_results)

            indent_inssue_datas=[]

            print('Indent_Type',Indent_Type)

            if Indent_table_results:
                for indx, ins in enumerate(Indent_table_results):
                    print("ins",ins)
                    dic ={
                        'id':indx + 1, 
                        'Item_Detials':[]
                    }

                    if Indent_Type == 'issue':
                        print('111111')

                        print(ins.Indent_raise)


                        print('22222222')

                        if ins.Indent_raise:
                            Indent_raise_insss = ins.Indent_raise
                            dic['issue_Indent_Type'] = ins.Indent_Type
                            dic['Raised_pk'] = Indent_raise_insss.pk if Indent_raise_insss else None
                            dic['RaisedFromLocation_pk'] = Indent_raise_insss.Raise_From_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromLocation'] = Indent_raise_insss.Raise_From_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromNurseStation'] = Indent_raise_insss.Raise_From_NurseStation_Store if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store is not None else None
                            dic['RaisedFromNurseStation_pk'] = Indent_raise_insss.Raise_From_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ''
                            dic['RaisedFromNurseStationWard'] = Indent_raise_insss.Raise_From_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ""
                            dic['RaisedFromStore_pk'] = Indent_raise_insss.Raise_From_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedFromStore'] = Indent_raise_insss.Raise_From_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            
                            dic['RaisedToLocation_pk'] = Indent_raise_insss.Raise_To_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToLocation'] = Indent_raise_insss.Raise_To_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToNurseStation'] = Indent_raise_insss.Raise_To_NurseStation_Store
                            dic['RaisedToNurseStation_pk'] = Indent_raise_insss.Raise_To_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToNurseStationWard'] = Indent_raise_insss.Raise_To_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToStore_pk'] = Indent_raise_insss.Raise_To_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedToStore'] = Indent_raise_insss.Raise_To_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedDate'] = Indent_raise_insss.Raise_Date.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_Date else None
                            dic['RaisedApprovedDate'] = Indent_raise_insss.Raise_ApprovedDate.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_ApprovedDate else None
                            dic['Raised_by'] = Indent_raise_insss.Raise_by if Indent_raise_insss else None
                            dic['RaisedApproved_by'] = Indent_raise_insss.Raise_Approved_by if Indent_raise_insss else None
                            dic['RaisedReason'] = Indent_raise_insss.Raise_Reason if Indent_raise_insss else None
                            dic['raise_Raise_Status'] = Indent_raise_insss.Raise_Status if Indent_raise_insss else None
                            dic['raise_Issue_Status'] = Indent_raise_insss.Issue_Status if Indent_raise_insss else None

                        dic['Issued_pk'] = ins.pk
                        dic['IssuedFromLocation_pk'] = ins.Issue_From_Location.pk if ins.Issue_From_Location else None
                        dic['IssuedFromLocation'] = ins.Issue_From_Location.Location_Name if ins.Issue_From_Location else None
                        dic['IssuedFromNurseStation'] = ins.Issue_From_NurseStation_Store
                        dic['IssuedFromNurseStation_pk'] = ins.Issue_From_Store_Location.pk if ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        dic['IssuedFromNurseStationWard'] = ins.Issue_From_Store_Location.NurseStationName if ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ""
                        dic['IssuedFromStore_pk'] = ins.Issue_From_Store_Location.pk if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        dic['IssuedFromStore'] = ins.Issue_From_Store_Location.Store_Name if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        
                        dic['IssuedToLocation_pk'] = ins.Issue_To_Location.pk if ins.Issue_To_Location else None
                        dic['IssuedToLocation'] = ins.Issue_To_Location.Location_Name if ins.Issue_To_Location else None
                        dic['IssuedToNurseStation'] = ins.Issue_To_NurseStation_Store
                        dic['IssuedToNurseStation_pk'] = ins.Issue_To_NurseStation_Location.pk if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToNurseStationWard'] = ins.Issue_To_NurseStation_Location.NurseStationName if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToStore_pk'] = ins.Issue_To_Store_Location.pk if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        dic['IssuedToStore'] = ins.Issue_To_Store_Location.Store_Name if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        
                        dic['IssuedDate'] = ins.Issue_Date.strftime('%Y-%m-%d') if ins.Issue_Date else None
                        dic['IssuedApprovedDate'] = ins.Issue_ApprovedDate.strftime('%Y-%m-%d') if ins.Issue_ApprovedDate else None
                        dic['Issued_by'] = ins.Issue_by
                        dic['IssuedApproved_by'] = ins.Issue_Approved_by
                        dic['IssuedReason'] = ins.Issue_Reason
                        dic['issue_Issue_Status'] = ins.Issue_Status
                        dic['issue_Receive_Status'] = ins.Receive_Status
                    else:
                        print("elsepart")
                        Indent_issue_inssss = ins.Indent_issue
                        print("Indent_issue_inssss",Indent_issue_inssss)
                        Indent_raise_insss = Indent_issue_inssss.Indent_raise
                        if Indent_raise_insss:
                            dic['Raised_pk'] = Indent_raise_insss.pk if Indent_raise_insss else None
                            dic['RaisedFromLocation_pk'] = Indent_raise_insss.Raise_From_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromLocation'] = Indent_raise_insss.Raise_From_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromNurseStation'] = Indent_raise_insss.Raise_From_NurseStation_Store
                            dic['RaisedFromNurseStation_pk'] = Indent_raise_insss.Raise_From_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ''
                            dic['RaisedFromNurseStationWard'] = Indent_raise_insss.Raise_From_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ""
                            dic['RaisedFromStore_pk'] = Indent_raise_insss.Raise_From_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedFromStore'] = Indent_raise_insss.Raise_From_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedToLocation_pk'] = Indent_raise_insss.Raise_To_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToLocation'] = Indent_raise_insss.Raise_To_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToNurseStation'] = Indent_raise_insss.Raise_To_NurseStation_Store 
                            dic['RaisedToNurseStation_pk'] = Indent_raise_insss.Raise_To_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToNurseStationWard'] = Indent_raise_insss.Raise_To_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToStore_pk'] = Indent_raise_insss.Raise_To_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedToStore'] = Indent_raise_insss.Raise_To_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedDate'] = Indent_raise_insss.Raise_Date.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_Date else None
                            dic['RaisedApprovedDate'] = Indent_raise_insss.Raise_ApprovedDate.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_ApprovedDate else None
                            dic['Raised_by'] = Indent_raise_insss.Raise_by if Indent_raise_insss else None
                            dic['RaisedApproved_by'] = Indent_raise_insss.Raise_Approved_by if Indent_raise_insss else None
                            dic['RaisedReason'] = Indent_raise_insss.Raise_Reason if Indent_raise_insss else None
                            dic['raise_Raise_Status'] = Indent_raise_insss.Raise_Status if Indent_raise_insss else None
                            dic['raise_Issue_Status'] = Indent_raise_insss.Issue_Status if Indent_raise_insss else None

                        dic['issue_Indent_Type'] = Indent_issue_inssss.Indent_Type


                        


                        dic['Issued_pk'] = Indent_issue_inssss.pk
                        dic['IssuedFromLocation_pk'] = Indent_issue_inssss.Issue_From_Location.pk if Indent_issue_inssss.Issue_From_Location else None
                        dic['IssuedFromLocation'] = Indent_issue_inssss.Issue_From_Location.Location_Name if Indent_issue_inssss.Issue_From_Location else None
                        dic['IssuedFromNurseStation'] = Indent_issue_inssss.Issue_From_NurseStation_Store
                        dic['IssuedFromNurseStation_pk'] = Indent_issue_inssss.Issue_From_NurseStation_Location.pk if Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_NurseStation_Location else ''
                        dic['IssuedFromNurseStationWard'] = Indent_issue_inssss.Issue_From_NurseStation_Location.NurseStationName if Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_NurseStation_Location else ""
                        dic['IssuedFromStore_pk'] = Indent_issue_inssss.Issue_From_Store_Location.pk if not Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_Store_Location else ''
                        dic['IssuedFromStore'] = Indent_issue_inssss.Issue_From_Store_Location.Store_Name if not Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_Store_Location else ''
                        
                        dic['IssuedToLocation_pk'] = Indent_issue_inssss.Issue_To_Location.pk if Indent_issue_inssss.Issue_To_Location else None
                        dic['IssuedToLocation'] = Indent_issue_inssss.Issue_To_Location.Location_Name if Indent_issue_inssss.Issue_To_Location else None
                        dic['IssuedToNurseStation'] = Indent_issue_inssss.Issue_To_NurseStation_Store
                        dic['IssuedToNurseStation_pk'] = Indent_issue_inssss.Issue_To_NurseStation_Location.pk if Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_NurseStation_Location else ''
                        dic['IssuedToNurseStationWard'] = Indent_issue_inssss.Issue_To_NurseStation_Location.NurseStationName if Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_NurseStation_Location else ''
                        dic['IssuedToStore_pk'] = Indent_issue_inssss.Issue_To_Store_Location.pk if not Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_Store_Location else ''
                        dic['IssuedToStore'] = Indent_issue_inssss.Issue_To_Store_Location.Store_Name if not Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_Store_Location else ''
                        
                        dic['IssuedDate'] = Indent_issue_inssss.Issue_Date.strftime('%Y-%m-%d') if Indent_issue_inssss.Issue_Date else None
                        dic['IssuedApprovedDate'] = Indent_issue_inssss.Issue_ApprovedDate.strftime('%Y-%m-%d') if Indent_issue_inssss.Issue_ApprovedDate else None
                        dic['Issued_by'] = Indent_issue_inssss.Issue_by
                        dic['IssuedApproved_by'] = Indent_issue_inssss.Issue_Approved_by
                        dic['IssuedReason'] = Indent_issue_inssss.Issue_Reason
                        dic['issue_Issue_Status'] = Indent_issue_inssss.Issue_Status
                        dic['issue_Receive_Status'] = Indent_issue_inssss.Receive_Status
                        
                        dic['Received_pk'] = ins.pk
                        dic['ReceiveDate'] = ins.Receive_Date.strftime('%Y-%m-%d %I:%M %p') if ins.Receive_Date else None
                        dic['ReceiveApprovedDate'] = ins.Receive_ApprovedDate.strftime('%Y-%m-%d %I:%M %p') if ins.Receive_ApprovedDate else None
                        dic['Receive_by'] = ins.Receive_by
                        dic['ReceiveApproved_by'] = ins.Receive_Approved_by
                        dic['ReceiveReason'] = ins.Receive_Reason
                        dic['Receive_Receive_Status'] = ins.Receive_Status
                    items_query =Q()
                    if Indent_Type=='issue' :
                        items_query &=Q(Indent_Detials = dic['Issued_pk'],Issue_Status='Approved')
                    else:
                        items_query &=Q(Indent_Detials = dic['Received_pk'])

                    indent_items_table_insss = indent_items_table.objects.filter(Indent_Detials = dic['Issued_pk'] if Indent_Type=='issue' else dic['Received_pk']).order_by('-Created_at')
                    print("indent_items_table_insss",indent_items_table_insss)
                    for it_index,it_ins in enumerate(indent_items_table_insss):
                        if Indent_Type == 'issue':
                            print("sundari")

                            item_dic={
                                'id':len(dic['Item_Detials']) +1,
                                'Raisedpk':it_ins.Indent_Raise_Item.pk if it_ins.Indent_Raise_Item else None,
                                'Issuedpk':it_ins.pk,
                                'Receivedpk':None,
                                "ItemCode": it_ins.Product_Detials.pk,
                                "ItemName": it_ins.Product_Detials.ItemName,
                                "ProductCategory":it_ins.Product_Detials.ProductCategory.ProductCategory_Name if it_ins.Product_Detials.ProductCategory else '',
                                "SubCategory": it_ins.Product_Detials.SubCategory.SubCategoryName if it_ins.Product_Detials.SubCategory else '',
                                'PackType': it_ins.Product_Detials.PackType.PackType_Name if it_ins.Product_Detials.PackType else 'Nill',
                                'PackQuantity': it_ins.Product_Detials.PackQty if it_ins.Product_Detials.PackQty else 'Nill',
                                'Reason':it_ins.Reason,
                                'BatchNo':it_ins.stock_Detials.Batch_No,
                                'RaisedQuantity':it_ins.Indent_Raise_Item.Raise_Quantity if it_ins.Indent_Raise_Item else None,
                                'IssueQuantity':it_ins.Issue_Quantity,
                                'ReceivedQuantity':it_ins.Issue_Quantity,
                                'DamagedQuantity':it_ins.Issue_Quantity if it_ins.Reason == 'DamagedProducts' else 0 ,
                                'Remarks':it_ins.Remarks,
                                'Issue_Status':it_ins.Issue_Status,
                                'Receive_Status':it_ins.Receive_Status,
                                'SerialNoAvailable':it_ins.stock_Detials.Is_Serial_No_Available_for_each_quantity
                            }
                            if item_dic['SerialNoAvailable'] and it_ins.serialNo.exists():
                                item_dic['SerialNo'] = []
                                for serial in it_ins.serialNo.all():
                                    dattt= {
                                        'pk': serial.pk,
                                        'Serial_Number': serial.Serial_Number,
                                        "Status": True,
                                        'Item_Status': serial.Item_Status,
                                        'Product_Status': 'good',
                                    }
                                    item_dic['SerialNo'].append(dattt)
                            dic['Item_Detials'].append(item_dic)
                        else:
                            print('bharathi------')
                            issue_items_ins = it_ins.Indent_issue_Item
                            item_dic={
                                "id":len(dic['Item_Detials']) +1,
                                'Raisedpk':issue_items_ins.Indent_Raise_Item.pk if issue_items_ins.Indent_Raise_Item else None,
                                'Issuedpk':issue_items_ins.pk,
                                'Receivedpk':it_ins.pk,
                                "ItemCode": issue_items_ins.Product_Detials.pk,
                                "ItemName": issue_items_ins.Product_Detials.ItemName,
                                "ProductCategory":issue_items_ins.Product_Detials.ProductCategory.ProductCategory_Name if issue_items_ins.Product_Detials.ProductCategory else '',
                                "SubCategory": issue_items_ins.Product_Detials.SubCategory.SubCategoryName if issue_items_ins.Product_Detials.SubCategory else '',
                                'PackType': issue_items_ins.Product_Detials.PackType.PackType_Name if issue_items_ins.Product_Detials.PackType else 'Nill',
                                'PackQuantity': issue_items_ins.Product_Detials.PackQty if issue_items_ins.Product_Detials.PackQty else 'Nill',
                                'Reason':issue_items_ins.Reason,
                                'BatchNo':issue_items_ins.stock_Detials.Batch_No,
                                'SerialNoAvailable':issue_items_ins.stock_Detials.Is_Serial_No_Available_for_each_quantity,
                                'RaisedQuantity':issue_items_ins.Indent_Raise_Item.Raise_Quantity if issue_items_ins.Indent_Raise_Item else None,
                                'IssueQuantity':issue_items_ins.Issue_Quantity,
                                'ReceivedQuantity':it_ins.Received_Quantity,
                                'Receive_Status':issue_items_ins.Receive_Status,
                                'DamagedQuantity':it_ins.Damaged_Quantity,
                                'PendingQuantity':it_ins.Pending_Quantity,
                                'SerialNo':[],
                                'ReceivedSerialNo':[],
                                'DamagedSerialNo':[],
                                'PendingSerialNo':[],
                            }
                            # Check if SerialNo is available and then append related serial numbers
                            if item_dic['SerialNoAvailable']:
                                # Process Received Serial Numbers
                                if it_ins.Received_serialNo.exists():
                                    for serial in it_ins.Received_serialNo.all():
                                        dattt = {
                                            'pk': serial.pk,
                                            'Serial_Number': serial.Serial_Number,
                                            "Status": True,
                                            'Item_Status': serial.Item_Status,
                                            'Product_Status': 'good',
                                        }
                                        item_dic['ReceivedSerialNo'].append(dattt)
                                        item_dic['SerialNo'].append(dattt)

                                # Process Damaged Serial Numbers
                                if it_ins.Damaged_serialNo.exists():
                                    for serial in it_ins.Damaged_serialNo.all():
                                        dattt = {
                                            'pk': serial.pk,
                                            'Serial_Number': serial.Serial_Number,
                                            "Status": True,
                                            'Item_Status': serial.Item_Status,
                                            'Product_Status': 'damaged',
                                        }
                                        item_dic['DamagedSerialNo'].append(dattt)
                                        # Check if the serial.pk already exists in SerialNo, replace if found
                                        serial_exists = False
                                        for idx, existing_serial in enumerate(item_dic['SerialNo']):
                                            if existing_serial['pk'] == serial.pk:
                                                item_dic['SerialNo'][idx] = dattt  # Replace the existing entry
                                                serial_exists = True
                                                break

                                        # If the serial does not exist in SerialNo, append it
                                        if not serial_exists:
                                            item_dic['SerialNo'].append(dattt)

                                        for idx, existing_serial in enumerate(item_dic['ReceivedSerialNo']):
                                            if existing_serial['pk'] == serial.pk:
                                                item_dic['ReceivedSerialNo'][idx] = dattt  # Replace the existing entry
                                                serial_exists = True
                                                break

                                # Process Pending Serial Numbers
                                if it_ins.Pending_serialNo.exists():
                                    for serial in it_ins.Pending_serialNo.all():
                                        dattt = {
                                            'pk': serial.pk,
                                            'Serial_Number': serial.Serial_Number,
                                            "Status": False,
                                            'Item_Status': serial.Item_Status,
                                            'Product_Status': 'good',
                                        }
                                        item_dic['PendingSerialNo'].append(dattt)
                                        item_dic['SerialNo'].append(dattt)
                                
                            dic['Item_Detials'].append(item_dic)    
                    
                    indent_inssue_datas.append(dic)
                    # print("indent_inssue_datas",indent_inssue_datas)
            return JsonResponse(indent_inssue_datas, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def GEN_Post_Indent_Receive_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            Received_pk = data.get('Received_pk')
            Issued_pk = data.get('Issued_pk')
            ReceivedReason = data.get('ReceivedReason')
            Items_Data = data.get('Items_Data', [])
            createdBy = data.get('createdBy')

            # Determine approval status
            approval_status = 'Received' if not data.get('IS_Indent_Receive_Approve') else 'Received'
            # print(approval_status,'approval_status')
            # Fetch Indent Issue & Receive Details
            Received_pk_ins = get_or_none(GEN_Indent_receive_details_table, Received_pk) if Received_pk else None
            Issued_pk_ins = get_or_none(GEN_Indent_issue_details_table, Issued_pk)
            if not Issued_pk_ins:
                return JsonResponse({'error': 'Invalid Issued_pk'}, status=400)

            with transaction.atomic():
                current_date_time = datetime.now().strftime('%Y-%m-%d')

                indent_data = {
                    'Indent_issue': Issued_pk_ins,
                    'Receive_Date': current_date_time,
                    'Receive_Reason': ReceivedReason,
                    'Receive_Status': approval_status,
                    'Receive_by': createdBy if not Received_pk_ins else None,
                    'Receive_Updated_by': createdBy if Received_pk_ins else None
                }

                if approval_status == 'Approved':
                    indent_data.update({
                        'Receive_Approved_by': createdBy,
                        'Receive_ApprovedDate': current_date_time,
                    })

                # Update or Create Indent Receive Record
                if Received_pk_ins:
                    for key, value in indent_data.items():
                        setattr(Received_pk_ins, key, value)
                    Received_pk_ins.save()
                    indent_receive_ins = Received_pk_ins
                else:
                    indent_receive_ins = GEN_Indent_receive_details_table.objects.create(**indent_data)

                # Process Indent Items
                for it_ins in Items_Data:
                    it_ins_Receivedpk = it_ins.get('Receivedpk')
                    it_ins_Issuedpk = it_ins.get('Issuedpk')

                    it_ins_Receivedpk_ins = get_or_none(GEN_Indent_receive_items_details_table, it_ins_Receivedpk)
                    it_ins_Issuedpk_ins = get_or_none(GEN_Indent_issue_items_details_table, it_ins_Issuedpk)

                    ReceivedSerialNo_ins = {
                        get_or_none(SerialNumber_Stock_Maintance_Table_Detials, serial['pk'])
                        for serial in it_ins.get('ReceivedSerialNo', []) if serial.get('pk')
                    }
                    DamagedSerialNo_ins = {
                        get_or_none(SerialNumber_Stock_Maintance_Table_Detials, serial['pk'])
                        for serial in it_ins.get('DamagedSerialNo', []) if serial.get('pk')
                    }
                    PendingSerialNo_ins = {
                        get_or_none(SerialNumber_Stock_Maintance_Table_Detials, serial['pk'])
                        for serial in it_ins.get('PendingSerialNo', []) if serial.get('pk')
                    }

                    indent_items_data = {
                        'Indent_Detials': indent_receive_ins,
                        'Indent_issue_Item': it_ins_Issuedpk_ins,
                        'Received_Quantity': it_ins.get('ReceivedQuantity', 0),
                        'Damaged_Quantity': it_ins.get('DamagedQuantity', 0),
                        'Pending_Quantity': it_ins.get('PendingQuantity', 0),
                        'Reason': it_ins.get('Reason', ''),
                        'Remarks': it_ins.get('Remarks', ''),
                        'Status': approval_status if it_ins.get('Status') != 'Cancelled' else 'Cancelled',
                    }

                    if it_ins_Receivedpk_ins:
                        for key, value in indent_items_data.items():
                            setattr(it_ins_Receivedpk_ins, key, value)
                        it_ins_Receivedpk_ins.save()
                        indent_receive_item_ins = it_ins_Receivedpk_ins
                    else:
                        indent_receive_item_ins = GEN_Indent_receive_items_details_table.objects.create(**indent_items_data)

                    indent_receive_item_ins.Received_serialNo.set(ReceivedSerialNo_ins)
                    indent_receive_item_ins.Damaged_serialNo.set(DamagedSerialNo_ins)
                    indent_receive_item_ins.Pending_serialNo.set(PendingSerialNo_ins)

                    # ✅ Update `Receive_Status` for `Indent_issue_items_details_table`
                    if approval_status in ["Received", "Approved"]:
                        it_ins_Issuedpk_ins.Receive_Status = 'Completed'
                        it_ins_Issuedpk_ins.save()

                # ✅ Update `Receive_Status` for `Indent_issue_details_table`
                if approval_status in ["Received", "Approved"]:
                    Indent_issue_Ins = GEN_Indent_issue_details_table.objects.filter(pk=Issued_pk_ins.pk).first()
                    Indent_issue_Ins.Receive_Status = 'Completed'
                    Indent_issue_Ins.save()

                return JsonResponse({
                    'status': 'success',
                    'message': 'Indent receive details recorded successfully.'
                }, status=200)

        except Exception as e:
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            Indent_Type = request.GET.get('Indent_Type', 'issue').strip().lower()
            if Indent_Type not in ['issue', 'receive']:
                return JsonResponse({'error': 'Invalid Indent_Type'}, status=400)

            # Params
            raised_from_location = request.GET.get('RaisedFromLocation')
            raised_from_nurse_station = request.GET.get('RaisedFromNurseStation', False)
            raised_from_store = request.GET.get('RaisedFromStore')
            raised_to_location = request.GET.get('RaisedToLocation')
            raised_to_nurse_station = request.GET.get('RaisedToNurseStation', False)
            raised_to_store = request.GET.get('RaisedToStore')
            issue_invoice_no = request.GET.get('Issue_Invoice_No')
            receive_invoice_no = request.GET.get('Receive_Invoice_No')
            date_type = request.GET.get('DateType')
            current_date = request.GET.get('CurrentDate')
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')
            status = request.GET.get('Status', 'waiting').strip()
            ActivePharmacyStoreId = request.GET.get('ActivePharmacyStoreId')


            query = Q()

            if Indent_Type == 'issue':
                indent_table = GEN_Indent_issue_details_table
                indent_items_table = GEN_Indent_issue_items_details_table
                query &= Q(Issue_Status='Approved', Receive_Status=status)

                # From filters
                if raised_from_location:
                    query &= Q(Issue_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Issue_From_NurseStation_Store=True)
                    if raised_from_store:
                        query &= Q(Issue_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Issue_From_Store_Location__pk=raised_from_store)

                # To filters
                if raised_to_location:
                    query &= Q(Issue_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Issue_To_NurseStation_Store=True)
                    if raised_to_store:
                        query &= Q(Issue_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Issue_To_Store_Location__pk=raised_to_store)


                if ActivePharmacyStoreId:
                    query &= Q(Issue_To_Store_Location__pk=ActivePharmacyStoreId)

                if issue_invoice_no:
                    query &= Q(pk__iexact=issue_invoice_no)

                # Dates
                if date_type == 'Current' and current_date:
                    query &= Q(Issue_Date__date=current_date)
                elif date_type == 'Customize' and from_date and to_date:

                    print('indieeeeeeeeeeeee issue')

                    if from_date > to_date:
                        return JsonResponse({'error': 'FromDate cannot be later than ToDate'}, status=400)
                    query &= Q(Issue_Date__range=(from_date, to_date))

                    print(query,'queryyyyyyyyyyyy issue')


            elif Indent_Type == 'receive':
                indent_table = GEN_Indent_receive_details_table
                indent_items_table = GEN_Indent_receive_items_details_table
                query &= Q(Receive_Status=status)

                # From filters
                if raised_from_location:
                    query &= Q(Receive_From_Location__pk=raised_from_location)
                if raised_from_nurse_station:
                    query &= Q(Receive_From_NurseStation_Store=True)
                    if raised_from_store:
                        query &= Q(Receive_From_NurseStation_Location__pk=raised_from_store)
                elif raised_from_store:
                    query &= Q(Receive_From_Store_Location__pk=raised_from_store)

                # To filters
                if raised_to_location:
                    query &= Q(Receive_To_Location__pk=raised_to_location)
                if raised_to_nurse_station:
                    query &= Q(Indent_issue__Issue_To_NurseStation_Store=True)
                    if raised_to_store:
                        query &= Q(Receive_To_NurseStation_Location__pk=raised_to_store)
                elif raised_to_store:
                    query &= Q(Receive_To_Store_Location__pk=raised_to_store)

                if issue_invoice_no:
                    query &= Q(Indent_raise__pk__iexact=issue_invoice_no)
                if receive_invoice_no:
                    query &= Q(pk__iexact=receive_invoice_no)

                # Dates
                if date_type == 'Current' and current_date:
                    query &= Q(Receive_Date__date=current_date)
                elif date_type == 'Customize' and from_date and to_date:

                    print('indieeeeeeeeeeeee receiveeeeeeeee')
                    if from_date > to_date:
                        return JsonResponse({'error': 'FromDate cannot be later than ToDate'}, status=400)
                    query &= Q(Receive_Date__range=(from_date, to_date))

                    print(query,'queryyyyyyyyyyyy receiveeeeeeeee')

            # Execute query on chosen table
            Indent_table_results = None
            if indent_table:
                Indent_table_results = indent_table.objects.filter(query).order_by('-Created_at')
            
            print('Indent_table_results???',Indent_table_results)

            indent_inssue_datas=[]

            print('Indent_Type',Indent_Type)

            if Indent_table_results:
                for indx, ins in enumerate(Indent_table_results):
                    print("ins",ins)
                    dic ={
                        'id':indx + 1, 
                        'Item_Detials':[]
                    }

                    if Indent_Type == 'issue':
                        print('111111')

                        print(ins.Indent_raise)


                        print('22222222')

                        if ins.Indent_raise:
                            Indent_raise_insss = ins.Indent_raise
                            dic['issue_Indent_Type'] = ins.Indent_Type
                            dic['Raised_pk'] = Indent_raise_insss.pk if Indent_raise_insss else None
                            dic['RaisedFromLocation_pk'] = Indent_raise_insss.Raise_From_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromLocation'] = Indent_raise_insss.Raise_From_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromNurseStation'] = Indent_raise_insss.Raise_From_NurseStation_Store if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store is not None else None
                            dic['RaisedFromNurseStation_pk'] = Indent_raise_insss.Raise_From_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ''
                            dic['RaisedFromNurseStationWard'] = Indent_raise_insss.Raise_From_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ""
                            dic['RaisedFromStore_pk'] = Indent_raise_insss.Raise_From_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedFromStore'] = Indent_raise_insss.Raise_From_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            
                            dic['RaisedToLocation_pk'] = Indent_raise_insss.Raise_To_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToLocation'] = Indent_raise_insss.Raise_To_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToNurseStation'] = Indent_raise_insss.Raise_To_NurseStation_Store
                            dic['RaisedToNurseStation_pk'] = Indent_raise_insss.Raise_To_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToNurseStationWard'] = Indent_raise_insss.Raise_To_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToStore_pk'] = Indent_raise_insss.Raise_To_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedToStore'] = Indent_raise_insss.Raise_To_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedDate'] = Indent_raise_insss.Raise_Date.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_Date else None
                            dic['RaisedApprovedDate'] = Indent_raise_insss.Raise_ApprovedDate.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_ApprovedDate else None
                            dic['Raised_by'] = Indent_raise_insss.Raise_by if Indent_raise_insss else None
                            dic['RaisedApproved_by'] = Indent_raise_insss.Raise_Approved_by if Indent_raise_insss else None
                            dic['RaisedReason'] = Indent_raise_insss.Raise_Reason if Indent_raise_insss else None
                            dic['raise_Raise_Status'] = Indent_raise_insss.Raise_Status if Indent_raise_insss else None
                            dic['raise_Issue_Status'] = Indent_raise_insss.Issue_Status if Indent_raise_insss else None

                        dic['Issued_pk'] = ins.pk
                        dic['IssuedFromLocation_pk'] = ins.Issue_From_Location.pk if ins.Issue_From_Location else None
                        dic['IssuedFromLocation'] = ins.Issue_From_Location.Location_Name if ins.Issue_From_Location else None
                        dic['IssuedFromNurseStation'] = ins.Issue_From_NurseStation_Store
                        dic['IssuedFromNurseStation_pk'] = ins.Issue_From_Store_Location.pk if ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        dic['IssuedFromNurseStationWard'] = ins.Issue_From_Store_Location.NurseStationName if ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ""
                        dic['IssuedFromStore_pk'] = ins.Issue_From_Store_Location.pk if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        dic['IssuedFromStore'] = ins.Issue_From_Store_Location.Store_Name if not ins.Issue_From_NurseStation_Store and ins.Issue_From_Store_Location else ''
                        
                        dic['IssuedToLocation_pk'] = ins.Issue_To_Location.pk if ins.Issue_To_Location else None
                        dic['IssuedToLocation'] = ins.Issue_To_Location.Location_Name if ins.Issue_To_Location else None
                        dic['IssuedToNurseStation'] = ins.Issue_To_NurseStation_Store
                        dic['IssuedToNurseStation_pk'] = ins.Issue_To_NurseStation_Location.pk if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToNurseStationWard'] = ins.Issue_To_NurseStation_Location.NurseStationName if ins.Issue_To_NurseStation_Store and ins.Issue_To_NurseStation_Location else ''
                        dic['IssuedToStore_pk'] = ins.Issue_To_Store_Location.pk if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        dic['IssuedToStore'] = ins.Issue_To_Store_Location.Store_Name if not ins.Issue_To_NurseStation_Store and ins.Issue_To_Store_Location else ''
                        
                        dic['IssuedDate'] = ins.Issue_Date.strftime('%Y-%m-%d') if ins.Issue_Date else None
                        dic['IssuedApprovedDate'] = ins.Issue_ApprovedDate.strftime('%Y-%m-%d') if ins.Issue_ApprovedDate else None
                        dic['Issued_by'] = ins.Issue_by
                        dic['IssuedApproved_by'] = ins.Issue_Approved_by
                        dic['IssuedReason'] = ins.Issue_Reason
                        dic['issue_Issue_Status'] = ins.Issue_Status
                        dic['issue_Receive_Status'] = ins.Receive_Status
                    else:
                        print("elsepart")
                        Indent_issue_inssss = ins.Indent_issue
                        print("Indent_issue_inssss",Indent_issue_inssss)
                        Indent_raise_insss = Indent_issue_inssss.Indent_raise
                        if Indent_raise_insss:
                            dic['Raised_pk'] = Indent_raise_insss.pk if Indent_raise_insss else None
                            dic['RaisedFromLocation_pk'] = Indent_raise_insss.Raise_From_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromLocation'] = Indent_raise_insss.Raise_From_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_From_Location else None
                            dic['RaisedFromNurseStation'] = Indent_raise_insss.Raise_From_NurseStation_Store
                            dic['RaisedFromNurseStation_pk'] = Indent_raise_insss.Raise_From_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ''
                            dic['RaisedFromNurseStationWard'] = Indent_raise_insss.Raise_From_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_NurseStation_Location else ""
                            dic['RaisedFromStore_pk'] = Indent_raise_insss.Raise_From_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedFromStore'] = Indent_raise_insss.Raise_From_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_From_NurseStation_Store and Indent_raise_insss.Raise_From_Store_Location else ''
                            dic['RaisedToLocation_pk'] = Indent_raise_insss.Raise_To_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToLocation'] = Indent_raise_insss.Raise_To_Location.Location_Name if Indent_raise_insss and Indent_raise_insss.Raise_To_Location else None
                            dic['RaisedToNurseStation'] = Indent_raise_insss.Raise_To_NurseStation_Store 
                            dic['RaisedToNurseStation_pk'] = Indent_raise_insss.Raise_To_NurseStation_Location.pk if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToNurseStationWard'] = Indent_raise_insss.Raise_To_NurseStation_Location.NurseStationName if Indent_raise_insss and Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_NurseStation_Location else ''
                            dic['RaisedToStore_pk'] = Indent_raise_insss.Raise_To_Store_Location.pk if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedToStore'] = Indent_raise_insss.Raise_To_Store_Location.Store_Name if Indent_raise_insss and not Indent_raise_insss.Raise_To_NurseStation_Store and Indent_raise_insss.Raise_To_Store_Location else ''
                            dic['RaisedDate'] = Indent_raise_insss.Raise_Date.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_Date else None
                            dic['RaisedApprovedDate'] = Indent_raise_insss.Raise_ApprovedDate.strftime('%Y-%m-%d') if Indent_raise_insss and Indent_raise_insss.Raise_ApprovedDate else None
                            dic['Raised_by'] = Indent_raise_insss.Raise_by if Indent_raise_insss else None
                            dic['RaisedApproved_by'] = Indent_raise_insss.Raise_Approved_by if Indent_raise_insss else None
                            dic['RaisedReason'] = Indent_raise_insss.Raise_Reason if Indent_raise_insss else None
                            dic['raise_Raise_Status'] = Indent_raise_insss.Raise_Status if Indent_raise_insss else None
                            dic['raise_Issue_Status'] = Indent_raise_insss.Issue_Status if Indent_raise_insss else None

                        dic['issue_Indent_Type'] = Indent_issue_inssss.Indent_Type


                        


                        dic['Issued_pk'] = Indent_issue_inssss.pk
                        dic['IssuedFromLocation_pk'] = Indent_issue_inssss.Issue_From_Location.pk if Indent_issue_inssss.Issue_From_Location else None
                        dic['IssuedFromLocation'] = Indent_issue_inssss.Issue_From_Location.Location_Name if Indent_issue_inssss.Issue_From_Location else None
                        dic['IssuedFromNurseStation'] = Indent_issue_inssss.Issue_From_NurseStation_Store
                        dic['IssuedFromNurseStation_pk'] = Indent_issue_inssss.Issue_From_NurseStation_Location.pk if Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_NurseStation_Location else ''
                        dic['IssuedFromNurseStationWard'] = Indent_issue_inssss.Issue_From_NurseStation_Location.NurseStationName if Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_NurseStation_Location else ""
                        dic['IssuedFromStore_pk'] = Indent_issue_inssss.Issue_From_Store_Location.pk if not Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_Store_Location else ''
                        dic['IssuedFromStore'] = Indent_issue_inssss.Issue_From_Store_Location.Store_Name if not Indent_issue_inssss.Issue_From_NurseStation_Store and Indent_issue_inssss.Issue_From_Store_Location else ''
                        
                        dic['IssuedToLocation_pk'] = Indent_issue_inssss.Issue_To_Location.pk if Indent_issue_inssss.Issue_To_Location else None
                        dic['IssuedToLocation'] = Indent_issue_inssss.Issue_To_Location.Location_Name if Indent_issue_inssss.Issue_To_Location else None
                        dic['IssuedToNurseStation'] = Indent_issue_inssss.Issue_To_NurseStation_Store
                        dic['IssuedToNurseStation_pk'] = Indent_issue_inssss.Issue_To_NurseStation_Location.pk if Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_NurseStation_Location else ''
                        dic['IssuedToNurseStationWard'] = Indent_issue_inssss.Issue_To_NurseStation_Location.NurseStationName if Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_NurseStation_Location else ''
                        dic['IssuedToStore_pk'] = Indent_issue_inssss.Issue_To_Store_Location.pk if not Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_Store_Location else ''
                        dic['IssuedToStore'] = Indent_issue_inssss.Issue_To_Store_Location.Store_Name if not Indent_issue_inssss.Issue_To_NurseStation_Store and Indent_issue_inssss.Issue_To_Store_Location else ''
                        
                        dic['IssuedDate'] = Indent_issue_inssss.Issue_Date.strftime('%Y-%m-%d') if Indent_issue_inssss.Issue_Date else None
                        dic['IssuedApprovedDate'] = Indent_issue_inssss.Issue_ApprovedDate.strftime('%Y-%m-%d') if Indent_issue_inssss.Issue_ApprovedDate else None
                        dic['Issued_by'] = Indent_issue_inssss.Issue_by
                        dic['IssuedApproved_by'] = Indent_issue_inssss.Issue_Approved_by
                        dic['IssuedReason'] = Indent_issue_inssss.Issue_Reason
                        dic['issue_Issue_Status'] = Indent_issue_inssss.Issue_Status
                        dic['issue_Receive_Status'] = Indent_issue_inssss.Receive_Status
                        
                        dic['Received_pk'] = ins.pk
                        dic['ReceiveDate'] = ins.Receive_Date.strftime('%Y-%m-%d %I:%M %p') if ins.Receive_Date else None
                        dic['ReceiveApprovedDate'] = ins.Receive_ApprovedDate.strftime('%Y-%m-%d %I:%M %p') if ins.Receive_ApprovedDate else None
                        dic['Receive_by'] = ins.Receive_by
                        dic['ReceiveApproved_by'] = ins.Receive_Approved_by
                        dic['ReceiveReason'] = ins.Receive_Reason
                        dic['Receive_Receive_Status'] = ins.Receive_Status
                    items_query =Q()
                    if Indent_Type=='issue' :
                        items_query &=Q(Indent_Detials = dic['Issued_pk'],Issue_Status='Approved')
                    else:
                        items_query &=Q(Indent_Detials = dic['Received_pk'])

                    indent_items_table_insss = indent_items_table.objects.filter(Indent_Detials = dic['Issued_pk'] if Indent_Type=='issue' else dic['Received_pk']).order_by('-Created_at')
                    print("indent_items_table_insss",indent_items_table_insss)
                    for it_index,it_ins in enumerate(indent_items_table_insss):
                        if Indent_Type == 'issue':
                            print("sundari")

                            item_dic={
                                'id':len(dic['Item_Detials']) +1,
                                'Raisedpk':it_ins.Indent_Raise_Item.pk if it_ins.Indent_Raise_Item else None,
                                'Issuedpk':it_ins.pk,
                                'Receivedpk':None,
                                "ItemCode": it_ins.Product_Detials.pk,
                                "ItemName": it_ins.Product_Detials.ItemName,
                                "ProductCategory":it_ins.Product_Detials.ProductCategory.ProductCategory_Name if it_ins.Product_Detials.ProductCategory else '',
                                "SubCategory": it_ins.Product_Detials.SubCategory.SubCategoryName if it_ins.Product_Detials.SubCategory else '',
                                'PackType': it_ins.Product_Detials.PackType.PackType_Name if it_ins.Product_Detials.PackType else 'Nill',
                                'PackQuantity': it_ins.Product_Detials.PackQty if it_ins.Product_Detials.PackQty else 'Nill',
                                'Reason':it_ins.Reason,
                                'BatchNo':it_ins.stock_Detials.Batch_No,
                                'RaisedQuantity':it_ins.Indent_Raise_Item.Raise_Quantity if it_ins.Indent_Raise_Item else None,
                                'IssueQuantity':it_ins.Issue_Quantity,
                                'ReceivedQuantity':it_ins.Issue_Quantity,
                                'DamagedQuantity':it_ins.Issue_Quantity if it_ins.Reason == 'DamagedProducts' else 0 ,
                                'Remarks':it_ins.Remarks,
                                'Issue_Status':it_ins.Issue_Status,
                                'Receive_Status':it_ins.Receive_Status,
                                'SerialNoAvailable':it_ins.stock_Detials.Is_Serial_No_Available_for_each_quantity
                            }
                            if item_dic['SerialNoAvailable'] and it_ins.serialNo.exists():
                                item_dic['SerialNo'] = []
                                for serial in it_ins.serialNo.all():
                                    dattt= {
                                        'pk': serial.pk,
                                        'Serial_Number': serial.Serial_Number,
                                        "Status": True,
                                        'Item_Status': serial.Item_Status,
                                        'Product_Status': 'good',
                                    }
                                    item_dic['SerialNo'].append(dattt)
                            dic['Item_Detials'].append(item_dic)
                        else:
                            print('bharathi------')
                            issue_items_ins = it_ins.Indent_issue_Item
                            item_dic={
                                "id":len(dic['Item_Detials']) +1,
                                'Raisedpk':issue_items_ins.Indent_Raise_Item.pk if issue_items_ins.Indent_Raise_Item else None,
                                'Issuedpk':issue_items_ins.pk,
                                'Receivedpk':it_ins.pk,
                                "ItemCode": issue_items_ins.Product_Detials.pk,
                                "ItemName": issue_items_ins.Product_Detials.ItemName,
                                "ProductCategory":issue_items_ins.Product_Detials.ProductCategory.ProductCategory_Name if issue_items_ins.Product_Detials.ProductCategory else '',
                                "SubCategory": issue_items_ins.Product_Detials.SubCategory.SubCategoryName if issue_items_ins.Product_Detials.SubCategory else '',
                                'PackType': issue_items_ins.Product_Detials.PackType.PackType_Name if issue_items_ins.Product_Detials.PackType else 'Nill',
                                'PackQuantity': issue_items_ins.Product_Detials.PackQty if issue_items_ins.Product_Detials.PackQty else 'Nill',
                                'Reason':issue_items_ins.Reason,
                                'BatchNo':issue_items_ins.stock_Detials.Batch_No,
                                'SerialNoAvailable':issue_items_ins.stock_Detials.Is_Serial_No_Available_for_each_quantity,
                                'RaisedQuantity':issue_items_ins.Indent_Raise_Item.Raise_Quantity if issue_items_ins.Indent_Raise_Item else None,
                                'IssueQuantity':issue_items_ins.Issue_Quantity,
                                'ReceivedQuantity':it_ins.Received_Quantity,
                                'Receive_Status':issue_items_ins.Receive_Status,
                                'DamagedQuantity':it_ins.Damaged_Quantity,
                                'PendingQuantity':it_ins.Pending_Quantity,
                                'SerialNo':[],
                                'ReceivedSerialNo':[],
                                'DamagedSerialNo':[],
                                'PendingSerialNo':[],
                            }
                            # Check if SerialNo is available and then append related serial numbers
                            if item_dic['SerialNoAvailable']:
                                # Process Received Serial Numbers
                                if it_ins.Received_serialNo.exists():
                                    for serial in it_ins.Received_serialNo.all():
                                        dattt = {
                                            'pk': serial.pk,
                                            'Serial_Number': serial.Serial_Number,
                                            "Status": True,
                                            'Item_Status': serial.Item_Status,
                                            'Product_Status': 'good',
                                        }
                                        item_dic['ReceivedSerialNo'].append(dattt)
                                        item_dic['SerialNo'].append(dattt)

                                # Process Damaged Serial Numbers
                                if it_ins.Damaged_serialNo.exists():
                                    for serial in it_ins.Damaged_serialNo.all():
                                        dattt = {
                                            'pk': serial.pk,
                                            'Serial_Number': serial.Serial_Number,
                                            "Status": True,
                                            'Item_Status': serial.Item_Status,
                                            'Product_Status': 'damaged',
                                        }
                                        item_dic['DamagedSerialNo'].append(dattt)
                                        # Check if the serial.pk already exists in SerialNo, replace if found
                                        serial_exists = False
                                        for idx, existing_serial in enumerate(item_dic['SerialNo']):
                                            if existing_serial['pk'] == serial.pk:
                                                item_dic['SerialNo'][idx] = dattt  # Replace the existing entry
                                                serial_exists = True
                                                break

                                        # If the serial does not exist in SerialNo, append it
                                        if not serial_exists:
                                            item_dic['SerialNo'].append(dattt)

                                        for idx, existing_serial in enumerate(item_dic['ReceivedSerialNo']):
                                            if existing_serial['pk'] == serial.pk:
                                                item_dic['ReceivedSerialNo'][idx] = dattt  # Replace the existing entry
                                                serial_exists = True
                                                break

                                # Process Pending Serial Numbers
                                if it_ins.Pending_serialNo.exists():
                                    for serial in it_ins.Pending_serialNo.all():
                                        dattt = {
                                            'pk': serial.pk,
                                            'Serial_Number': serial.Serial_Number,
                                            "Status": False,
                                            'Item_Status': serial.Item_Status,
                                            'Product_Status': 'good',
                                        }
                                        item_dic['PendingSerialNo'].append(dattt)
                                        item_dic['SerialNo'].append(dattt)
                                
                            dic['Item_Detials'].append(item_dic)    
                    
                    indent_inssue_datas.append(dic)
                    # print("indent_inssue_datas",indent_inssue_datas)
            return JsonResponse(indent_inssue_datas, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    else:
        return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["POST","OPTIONS"])
def Indent_Receive_Details_Approve_link(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)
            indent_type = data.get('IndentType')
            invoice_no = data.get('InvoiceNo')
            status = data.get('Status')
            approved_by = data.get('Approved_by')
            CancelReceivepk = data.get('CancelReceivepk')


            print('data-----2222',data,invoice_no,CancelReceivepk)

            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            with transaction.atomic():
                if (indent_type == 'issue' and status == 'Cancelled') or \
                   (indent_type == 'Receive' and status == 'Cancelled' and CancelReceivepk):
                    try:
                        indent_instance = Indent_issue_details_table.objects.filter(pk=invoice_no).first()
                    except Indent_issue_details_table.DoesNotExist:
                        return JsonResponse({'error': 'Indent raise entry not found'}, status=404)

                    related_items = Indent_issue_items_details_table.objects.filter(
                        Indent_Detials=indent_instance,
                        Issue_Status='Approved'
                    )
                    for item in related_items:
                        item.Receive_Status = status
                        issue_quantity = item.Issue_Quantity

                        Stock_instance=Stock_Maintance_Table_Detials.objects.filter(pk=item.stock_Detials.pk).first()
                        
                        Stock_instance.AvailableQuantity += issue_quantity
                        Stock_instance.Update_Reason = 'Indent Received'
                        Stock_instance.Update_at = datetime.now()
                        Stock_instance.Updated_by = approved_by
                        Stock_instance.Indent_Send_Quantity -= issue_quantity
                        Stock_instance.Total_Moved_Quantity -= issue_quantity
                        Stock_instance.save()
                        item.save()
                        
                        if item.serialNo.exists():
                            serial_no_ids = list(item.serialNo.values_list('id', flat=True))  
                            print("Serial Numbers to Update:", serial_no_ids)
                            SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                id__in=serial_no_ids
                            ).update(Item_Status='Available')
                    
                    
                    indent_instance.Receive_Status = status
                    indent_instance.Issue_ApprovedDate = formatted_date_time
                    indent_instance.Issue_Approved_by = approved_by
                    indent_instance.save()

                    if indent_type =='Receive' and status == 'Cancelled' and CancelReceivepk :
                        print('hiiii---1111')

                        Indent_receive_Ins=Indent_receive_details_table.objects.filter(pk=CancelReceivepk).first()
                        Indent_receive_Ins.Receive_Status=status
                        Indent_receive_Ins.save()

                        Indent_receive_items_details_table.objects.filter(
                           Indent_Detials=Indent_receive_Ins
                        ).update(Status=status)

                        
                
                elif indent_type == 'Receive':
                    if status == 'Approved':

                        print('ooooo',status)
                        try:
                            indent_instance = Indent_receive_details_table.objects.filter(pk=invoice_no).first()
                        except Indent_receive_details_table.DoesNotExist:
                            return JsonResponse({'error': 'Indent raise entry not found'}, status=404)

                        related_items = Indent_receive_items_details_table.objects.filter(
                            Indent_Detials=indent_instance
                        )

                        for item in related_items:
                            print(item.Indent_issue_Item.stock_Detials.pk,'kkkk??????')
                            
                            StockIns=item.Indent_issue_Item.stock_Detials
                            Indent_issue_ins=indent_instance.Indent_issue

                            print('vvvvv',StockIns)

                            if StockIns:
                                Product_Master_Ins=Product_Master_All_Category_Details.objects.filter(pk=StockIns.Product_Detials.pk).first()
                            
                            Stock_Maintance_Ins=''
                            try:
                                Stock_Maintance_Ins=Stock_Maintance_Table_Detials.objects.filter(
                                Product_Detials=Product_Master_Ins,
                                Batch_No=StockIns.Batch_No,
                                IsNurseStation=Indent_issue_ins.Issue_To_NurseStation_Store,
                                Store_location=Indent_issue_ins.Issue_To_Store_Location,
                                NurseStation_location=Indent_issue_ins.Issue_To_NurseStation_Location
                                ).first()
                            except:
                                print('Data Not Matching')

                            if Stock_Maintance_Ins:

                                print('Stock_Maintance_Ins save update')

                                Stock_Maintance_Ins.Total_Quantity+=item.Received_Quantity
                                Stock_Maintance_Ins.Indent_Recieve_Quantity+=item.Received_Quantity
                                Stock_Maintance_Ins.AvailableQuantity+=item.Received_Quantity
                                Stock_Maintance_Ins.Update_Reason ='Indent Received'
                                Stock_Maintance_Ins.Update_at = datetime.now()
                                Stock_Maintance_Ins.Updated_by = approved_by
                                Stock_Maintance_Ins.save()

                                if StockIns.Is_Serial_No_Available_for_each_quantity :
                                    if item.Indent_issue_Item.serialNo.exists():
                                        serial_no_ids = list(item.Indent_issue_Item.serialNo.values_list('id', flat=True))  
                                        print("Serial Numbers to Update:", serial_no_ids)
                                        SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                            id__in=serial_no_ids
                                        ).update(Item_Status='Available',
                                                IsNurseStation=Indent_issue_ins.Issue_To_NurseStation_Store,
                                                Store_location=Indent_issue_ins.Issue_To_Store_Location,
                                                NurseStation_location=Indent_issue_ins.Issue_To_NurseStation_Location)
                                        
                            else:
                                Stock_Maintance_Table_Detials.objects.create(
                                    Product_Detials=Product_Master_Ins,
                                    Batch_No=StockIns.Batch_No,
                                    Is_MRP_as_sellable_price=StockIns.Is_MRP_as_sellable_price,
                                    Sellable_price=StockIns.Sellable_price,
                                    Sellable_qty_price=StockIns.Sellable_qty_price,
                                    Is_Manufacture_Date_Available=StockIns.Is_Manufacture_Date_Available,
                                    Manufacture_Date=StockIns.Manufacture_Date,
                                    Is_Expiry_Date_Available=StockIns.Is_Expiry_Date_Available,
                                    Expiry_Date=StockIns.Expiry_Date,
                                    Total_Quantity=item.Received_Quantity,
                                    Indent_Recieve_Quantity=item.Received_Quantity,
                                    AvailableQuantity=item.Received_Quantity,
                                    IsNurseStation=Indent_issue_ins.Issue_To_NurseStation_Store,
                                    Store_location=Indent_issue_ins.Issue_To_Store_Location,
                                    NurseStation_location=Indent_issue_ins.Issue_To_NurseStation_Location,
                                    Expiry_Status=StockIns.Expiry_Status,
                                    Is_Serial_No_Available_for_each_quantity=StockIns.Is_Serial_No_Available_for_each_quantity,
                                    Is_Serial_No_Status=StockIns.Is_Serial_No_Status,
                                    Serial_No_Type=StockIns.Serial_No_Type,
                                    Update_Reason='Created By Indent',
                                    Created_by=approved_by
                                    )
                            
                                if StockIns.Is_Serial_No_Available_for_each_quantity :
                                    if item.Indent_issue_Item.serialNo.exists():
                                        serial_no_ids = list(item.Indent_issue_Item.serialNo.values_list('id', flat=True))  
                                        print("Serial Numbers to Update:", serial_no_ids)
                                        SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                                            id__in=serial_no_ids
                                        ).update(Item_Status='Available',
                                                IsNurseStation=Indent_issue_ins.Issue_To_NurseStation_Store,
                                                Store_location=Indent_issue_ins.Issue_To_Store_Location,
                                                NurseStation_location=Indent_issue_ins.Issue_To_NurseStation_Location)
                                


                            item.Status=status
                            item.save()


                        indent_instance.Receive_Status=status
                        indent_instance.save()

            return JsonResponse({'success': f'Indent Raise {status} successfully'}, status=200)

        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
@require_http_methods(["POST","OPTIONS"])
def GEN_Indent_Receive_Details_Approve_link(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)
            indent_type = data.get('IndentType')
            invoice_no = data.get('InvoiceNo')
            status = data.get('Status')
            approved_by = data.get('Approved_by')
            CancelReceivepk = data.get('CancelReceivepk')


            print('data-----2222',data,invoice_no,CancelReceivepk)

            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            with transaction.atomic():
                if (indent_type == 'issue' and status == 'Cancelled') or \
                   (indent_type == 'Receive' and status == 'Cancelled' and CancelReceivepk):
                    try:
                        indent_instance = GEN_Indent_issue_details_table.objects.filter(pk=invoice_no).first()
                    except GEN_Indent_issue_details_table.DoesNotExist:
                        return JsonResponse({'error': 'Indent raise entry not found'}, status=404)

                    related_items = GEN_Indent_issue_items_details_table.objects.filter(
                        Indent_Detials=indent_instance,
                        Issue_Status='Approved'
                    )
                  
                    
                    
                    indent_instance.Receive_Status = status
                    indent_instance.Issue_ApprovedDate = formatted_date_time
                    indent_instance.Issue_Approved_by = approved_by
                    indent_instance.save()

                    if indent_type =='Receive' and status == 'Cancelled' and CancelReceivepk :
                        print('hiiii---1111')

                        Indent_receive_Ins=GEN_Indent_receive_details_table.objects.filter(pk=CancelReceivepk).first()
                        Indent_receive_Ins.Receive_Status=status
                        Indent_receive_Ins.save()

                        GEN_Indent_receive_items_details_table.objects.filter(
                           Indent_Detials=Indent_receive_Ins
                        ).update(Status=status)

                        
                
                elif indent_type == 'Receive':
                    if status == 'Approved':

                        print('ooooo',status)
                        try:
                            indent_instance = GEN_Indent_receive_details_table.objects.filter(pk=invoice_no).first()
                        except GEN_Indent_receive_details_table.DoesNotExist:
                            return JsonResponse({'error': 'Indent raise entry not found'}, status=404)

                        related_items = GEN_Indent_receive_items_details_table.objects.filter(
                            Indent_Detials=indent_instance
                        )

                       
                           


                        indent_instance.Receive_Status=status
                        indent_instance.save()

            return JsonResponse({'success': f'Indent Raise {status} successfully'}, status=200)

        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)



from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime,time
from .models import (
    Indent_raise_details_table,
    Indent_raise_items_details_table,
)


# @csrf_exempt
# @require_http_methods(["GET"])
# def IndentRaiseReport(request):
#     from_date = request.GET.get("FromDate")
#     to_date = request.GET.get("ToDate")
#     location = request.GET.get("Location")

#     query = Q()
#     if from_date and to_date:
#         query &= Q(Raise_Date__range=[from_date, to_date])
#     if location:
#         query &= Q(Raise_From_Location__Location_Name__icontains=location)

#     results = Indent_raise_details_table.objects.filter(query).order_by("-Raise_Date")
#     data = []
#     for i, obj in enumerate(results, start=1):
#         # Get items for this indent
#         items = []
#         for item in Indent_raise_items_details_table.objects.filter(Indent_Detials=obj):
#             prod = item.Product_Detials
#             items.append(
#                 {
#                     "ItemCode": str(prod.pk) if prod else "",
#                     "ItemName": getattr(prod, "ItemName", "") if prod else "",
#                     "ProductCategory": (
#                         getattr(
#                             prod.SubCategory.ProductCategoryId,
#                             "ProductCategory_Name",
#                             "",
#                         )
#                         if getattr(prod, "SubCategory", None)
#                         and getattr(prod.SubCategory, "ProductCategoryId", None)
#                         else ""
#                     ),
#                     "SubCategory": (
#                         getattr(prod.SubCategory, "SubCategoryName", "")
#                         if getattr(prod, "SubCategory", None)
#                         else ""
#                     ),
#                     "PackType": (
#                         getattr(prod.PackType, "PackType_Name", "")
#                         if getattr(prod, "PackType", None)
#                         else ""
#                     ),
#                     "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#                     "RaisedQuantity": item.Raise_Quantity or 0,
#                     "Status": item.Raise_Status or "",
#                 }
#             )

#         data.append(
#             {
#                 "SNo": i,
#                 "Invoice_No": obj.pk,
#                 "RequestDate": (
#                     obj.Raise_Date.strftime("%Y-%m-%d") if obj.Raise_Date else ""
#                 ),
#                 "RaisedFrom": f"{obj.Raise_From_Location.Location_Name if obj.Raise_From_Location else ''} - store - {obj.Raise_From_Store_Location.Store_Name if obj.Raise_From_Store_Location else ''}",
#                 "RaisedTo": f"{obj.Raise_To_Location.Location_Name if obj.Raise_To_Location else ''} - store - {obj.Raise_To_Store_Location.Store_Name if obj.Raise_To_Store_Location else ''}",
#                 "Reason": obj.Raise_Reason or "",
#                 "RaisedBy": obj.Raise_by or "",
#                 "Status": obj.Raise_Status or "",
#                 "Items": items,
#             }
#         )
#     return JsonResponse(data, safe=False)


# //latest
# @csrf_exempt
# @require_http_methods(["GET"])
# def IndentRaiseReport(request):
#     from_date = request.GET.get("FromDate")
#     to_date = request.GET.get("ToDate")
#     location = request.GET.get("Location")
 
#     query = Q()
#     if from_date and to_date:
#         query &= Q(Raise_Date__range=[from_date, to_date])
#     if location:
#         query &= Q(Raise_From_Location__Location_Name__icontains=location)
 
#     results = Indent_raise_details_table.objects.filter(query).order_by("-Raise_Date")
#     data = []
#     for i, obj in enumerate(results, start=1):
#         # Get items for this indent
#         items = []
#         # for item in Indent_raise_items_details_table.objects.filter(Indent_Detials=obj):
#         #     prod = item.Product_Detials
#         #     print('prod123',prod)
#         #     print("hello",prod.pk if prod else "")
#         #     items.append(
#         #         {
#         #             "ItemCode": str(prod.pk) if prod else "",
                     
#         #             "ItemName": getattr(prod, "ItemName", "") if prod else "",
#         #             "ProductCategory": (
#         #                 getattr(
#         #                     prod.SubCategory.ProductCategoryId,
#         #                     "ProductCategory_Name",
#         #                     "",
#         #                 )
#         #                 if getattr(prod, "SubCategory", None)
#         #                 and getattr(prod.SubCategory, "ProductCategoryId", None)
#         #                 else ""
#         #             ),
#         #             "SubCategory": (
#         #                 getattr(prod.SubCategory, "SubCategoryName", "")
#         #                 if getattr(prod, "SubCategory", None)
#         #                 else ""
#         #             ),
#         #             "PackType": (
#         #                 getattr(prod.PackType, "PackType_Name", "")
#         #                 if getattr(prod, "PackType", None)
#         #                 else ""
#         #             ),
#         #             "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#         #             "RaisedQuantity": item.Raise_Quantity or 0,
#         #             "Status": item.Raise_Status or "",
#         #         }
#         #     )
#         for item in Indent_raise_items_details_table.objects.filter(Indent_Detials=obj):
#             prod = item.Product_Detials
#             sellable_price = None
 
#             if prod:
#                 stock_entry = (
#                     Stock_Maintance_Table_Detials.objects
#                     .filter(Product_Detials=prod)
#                     .order_by('-Created_at')  # latest entry if multiple exist
#                     .first()
#                 )
#                 sellable_price = stock_entry.Sellable_price if stock_entry else None
 
#             items.append(
#                 {
#                     "ItemCode": str(prod.pk) if prod else "",
#                     "ItemName": getattr(prod, "ItemName", "") if prod else "",
#                     "ProductCategory": (
#                         getattr(
#                             prod.SubCategory.ProductCategoryId,
#                             "ProductCategory_Name",
#                             "",
#                         )
#                         if getattr(prod, "SubCategory", None)
#                         and getattr(prod.SubCategory, "ProductCategoryId", None)
#                         else ""
#                     ),
#                     "SubCategory": (
#                         getattr(prod.SubCategory, "SubCategoryName", "")
#                         if getattr(prod, "SubCategory", None)
#                         else ""
#                     ),
#                     "PackType": (
#                         getattr(prod.PackType, "PackType_Name", "")
#                         if getattr(prod, "PackType", None)
#                         else ""
#                     ),
#                     "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#                     "RaisedQuantity": item.Raise_Quantity or 0,
#                     "SellablePrice": float(sellable_price) if sellable_price else 0.0,  
#                     "Status": item.Raise_Status or "",
#                 }
#             )
 
#         data.append(
#             {
#                 "SNo": i,
#                 "Invoice_No": obj.pk,
#                 "RequestDate": (
#                     obj.Raise_Date.strftime("%Y-%m-%d") if obj.Raise_Date else ""
#                 ),
#                 "RaisedFrom": f"{obj.Raise_From_Location.Location_Name if obj.Raise_From_Location else ''} - store - {obj.Raise_From_Store_Location.Store_Name if obj.Raise_From_Store_Location else ''}",
#                 "RaisedTo": f"{obj.Raise_To_Location.Location_Name if obj.Raise_To_Location else ''} - store - {obj.Raise_To_Store_Location.Store_Name if obj.Raise_To_Store_Location else ''}",
#                 "Reason": obj.Raise_Reason or "",
#                 "RaisedBy": obj.Raise_by or "",
#                 "Status": obj.Raise_Status or "",
#                 "Items": items,
#             }
#         )
#     return JsonResponse(data, safe=False)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def IndentRaiseReport(request):
    try:
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        location = request.GET.get("Location")
    
        query = Q()
        # if from_date and to_date:
        #     query &= Q(Raise_Date__range=[from_date, to_date])
            
        if from_date and to_date and from_date != "" and to_date != "":
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            print("custom---------", from_date, to_date)
            query &= Q(Raise_Date__date__range=[from_date, to_date])
            
            
        # if from_date and to_date:
        #     from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
        #     to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
        #     query &= Q(Raise_Date__date__gte=from_date) & Q(Raise_Date__date__lte=to_date)

            
        if location:
            query &= Q(Raise_From_Location__Location_Name__icontains=location)
    
        results = Indent_raise_details_table.objects.filter(query).order_by("Raise_Date")
        data = []
        for i, obj in enumerate(results, start=1):
            # Get items for this indent
            items = []
            for item in Indent_raise_items_details_table.objects.filter(Indent_Detials=obj):
                prod = item.Product_Detials
                sellable_price = None
    
                if prod:
                    stock_entry = (
                        Stock_Maintance_Table_Detials.objects
                        .filter(Product_Detials=prod)
                        .order_by('-Created_at')  # latest entry if multiple exist
                        .first()
                    )
                    sellable_price = stock_entry.Sellable_price if stock_entry else None
    
                items.append(
                    {
                        "ItemCode": str(prod.pk) if prod else "",
                        "ItemName": getattr(prod, "ItemName", "") if prod else "",
                        "ProductCategory": (
                            getattr(
                                prod.SubCategory.ProductCategoryId,
                                "ProductCategory_Name",
                                "",
                            )
                            if getattr(prod, "SubCategory", None)
                            and getattr(prod.SubCategory, "ProductCategoryId", None)
                            else ""
                        ),
                        "SubCategory": (
                            getattr(prod.SubCategory, "SubCategoryName", "")
                            if getattr(prod, "SubCategory", None)
                            else ""
                        ),
                        "PackType": (
                            getattr(prod.PackType, "PackType_Name", "")
                            if getattr(prod, "PackType", None)
                            else ""
                        ),
                        "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
                        "RaisedQuantity": item.Raise_Quantity or 0,
                        "SellablePrice": float(sellable_price) if sellable_price else 0.0,  
                        "Status": item.Raise_Status or "",
                    }
                )
    
            data.append(
                {
                    "SNo": i,
                    "Invoice_No": obj.pk,
                    "RequestDate": (
                        obj.Raise_Date.strftime("%Y-%m-%d") if obj.Raise_Date else ""
                    ),
                    "RaisedFrom": f"{obj.Raise_From_Location.Location_Name if obj.Raise_From_Location else ''} - store - {obj.Raise_From_Store_Location.Store_Name if obj.Raise_From_Store_Location else ''}",
                    "RaisedTo": f"{obj.Raise_To_Location.Location_Name if obj.Raise_To_Location else ''} - store - {obj.Raise_To_Store_Location.Store_Name if obj.Raise_To_Store_Location else ''}",
                    "Reason": obj.Raise_Reason or "",
                    "RaisedBy": obj.Raise_by or "",
                    "Status": obj.Raise_Status or "",
                    "Items": items,
                }
            )
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

 
@csrf_exempt
@require_http_methods(["GET"])
def IndentRaiseReportGEN(request):
    try:
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        location = request.GET.get("Location")
    
        query = Q()
        # if from_date and to_date:
        #     query &= Q(Raise_Date__range=[from_date, to_date])
            
        if from_date and to_date and from_date != "" and to_date != "":
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            print("custom---------", from_date, to_date)
            query &= Q(Raise_Date__date__range=[from_date, to_date])
            
            
        # if from_date and to_date:
        #     from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
        #     to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
        #     query &= Q(Raise_Date__date__gte=from_date) & Q(Raise_Date__date__lte=to_date)

            
        if location:
            query &= Q(Raise_From_Location__Location_Name__icontains=location)
    
        results = GEN_Indent_raise_details_table.objects.filter(query).order_by("Raise_Date")
        data = []
        for i, obj in enumerate(results, start=1):
            # Get items for this indent
            items = []
            for item in GEN_Indent_raise_items_details_table.objects.filter(Indent_Detials=obj):
                prod = item.Product_Detials
                sellable_price = None
    
                if prod:
                    stock_entry = (
                        Stock_Maintance_Table_Detials.objects
                        .filter(Product_Detials=prod)
                        .order_by('-Created_at')  # latest entry if multiple exist
                        .first()
                    )
                    sellable_price = stock_entry.Sellable_price if stock_entry else None
    
                items.append(
                    {
                        "ItemCode": str(prod.pk) if prod else "",
                        "ItemName": getattr(prod, "ItemName", "") if prod else "",
                        "ProductCategory": (
                            getattr(
                                prod.SubCategory.ProductCategoryId,
                                "ProductCategory_Name",
                                "",
                            )
                            if getattr(prod, "SubCategory", None)
                            and getattr(prod.SubCategory, "ProductCategoryId", None)
                            else ""
                        ),
                        "SubCategory": (
                            getattr(prod.SubCategory, "SubCategoryName", "")
                            if getattr(prod, "SubCategory", None)
                            else ""
                        ),
                        "PackType": (
                            getattr(prod.PackType, "PackType_Name", "")
                            if getattr(prod, "PackType", None)
                            else ""
                        ),
                        "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
                        "RaisedQuantity": item.Raise_Quantity or 0,
                        "SellablePrice": float(sellable_price) if sellable_price else 0.0,  
                        "Status": item.Raise_Status or "",
                    }
                )
    
            data.append(
                {
                    "SNo": i,
                    "Invoice_No": obj.pk,
                    "RequestDate": (
                        obj.Raise_Date.strftime("%Y-%m-%d") if obj.Raise_Date else ""
                    ),
                    "RaisedFrom": f"{obj.Raise_From_Location.Location_Name if obj.Raise_From_Location else ''} - store - {obj.Raise_From_Store_Location.Store_Name if obj.Raise_From_Store_Location else ''}",
                    "RaisedTo": f"{obj.Raise_To_Location.Location_Name if obj.Raise_To_Location else ''} - store - {obj.Raise_To_Store_Location.Store_Name if obj.Raise_To_Store_Location else ''}",
                    "Reason": obj.Raise_Reason or "",
                    "RaisedBy": obj.Raise_by or "",
                    "Status": obj.Raise_Status or "",
                    "Items": items,
                }
            )
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

 
 
 

# @csrf_exempt
# @require_http_methods(["GET"])
# def IndentIssueReport(request):
#     from_date = request.GET.get("FromDate")
#     to_date = request.GET.get("ToDate")
#     location = request.GET.get("Location")
#     query = Q()
#     if from_date and to_date:
#         query &= Q(Issue_Date__range=[from_date, to_date])
#     if location:
#         query &= Q(Issue_From_Location__Location_Name__icontains=location)
#     results = Indent_issue_details_table.objects.filter(query).order_by("-Issue_Date")
#     data = []
#     for i, obj in enumerate(results, start=1):
#         items = []
#         for item in Indent_issue_items_details_table.objects.filter(Indent_Detials=obj):
#             prod = item.Product_Detials
#             items.append(
#                 {
#                     "ItemCode": str(prod.pk) if prod else "",
#                     "ItemName": getattr(prod, "ItemName", "") if prod else "",
#                     "ProductCategory": (
#                         getattr(
#                             prod.SubCategory.ProductCategoryId,
#                             "ProductCategory_Name",
#                             "",
#                         )
#                         if getattr(prod, "SubCategory", None)
#                         and getattr(prod.SubCategory, "ProductCategoryId", None)
#                         else ""
#                     ),
#                     "SubCategory": (
#                         getattr(prod.SubCategory, "SubCategoryName", "")
#                         if getattr(prod, "SubCategory", None)
#                         else ""
#                     ),
#                     "PackType": (
#                         getattr(prod.PackType, "PackType_Name", "")
#                         if getattr(prod, "PackType", None)
#                         else ""
#                     ),
#                     "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#                     "IssueQuantity": item.Issue_Quantity or 0,
#                     "Status": item.Issue_Status or "",
#                 }
#             )
#         data.append(
#             {
#                 "SNo": i,
#                 "Issue_Invoice_No": obj.pk,
#                 "IssueDate": (
#                     obj.Issue_Date.strftime("%Y-%m-%d") if obj.Issue_Date else ""
#                 ),
#                 "RaisedFrom": f"{obj.Issue_From_Location.Location_Name if obj.Issue_From_Location else ''} - store - {obj.Issue_From_Store_Location.Store_Name if obj.Issue_From_Store_Location else ''}",
#                 "RaisedTo": f"{obj.Issue_To_Location.Location_Name if obj.Issue_To_Location else ''} - store - {obj.Issue_To_Store_Location.Store_Name if obj.Issue_To_Store_Location else ''}",
#                 "Reason": obj.Issue_Reason or "",
#                 "IssuedBy": obj.Issue_by or "",
#                 "Status": obj.Issue_Status or "",
#                 "Items": items,
#             }
#         )
#     return JsonResponse(data, safe=False)


# lates//
# @csrf_exempt
# @require_http_methods(["GET"])
# def IndentIssueReport(request):
#     from_date = request.GET.get("FromDate")
#     to_date = request.GET.get("ToDate")
#     location = request.GET.get("Location")
 
#     query = Q()
#     if from_date and to_date:
#         query &= Q(Issue_Date__range=[from_date, to_date])
#     if location:
#         query &= Q(Issue_From_Location__Location_Name__icontains=location)
 
#     results = Indent_issue_details_table.objects.filter(query).order_by("-Issue_Date")
#     data = []
 
#     for i, obj in enumerate(results, start=1):
#         items = []
#         for item in Indent_issue_items_details_table.objects.filter(Indent_Detials=obj):
#             prod = item.Product_Detials
 
#             # 🔹 Fetch Sellable_price from stock maintenance
#             sellable_price = None
#             if prod:
#                 stock_entry = (
#                     Stock_Maintance_Table_Detials.objects
#                     .filter(Product_Detials=prod)
#                     .order_by("-Created_at")
#                     .first()
#                 )
#                 sellable_price = stock_entry.Sellable_price if stock_entry else None
 
#             items.append(
#                 {
#                     "ItemCode": str(prod.pk) if prod else "",
#                     "ItemName": getattr(prod, "ItemName", "") if prod else "",
#                     "ProductCategory": (
#                         getattr(
#                             prod.SubCategory.ProductCategoryId,
#                             "ProductCategory_Name",
#                             "",
#                         )
#                         if getattr(prod, "SubCategory", None)
#                         and getattr(prod.SubCategory, "ProductCategoryId", None)
#                         else ""
#                     ),
#                     "SubCategory": (
#                         getattr(prod.SubCategory, "SubCategoryName", "")
#                         if getattr(prod, "SubCategory", None)
#                         else ""
#                     ),
#                     "PackType": (
#                         getattr(prod.PackType, "PackType_Name", "")
#                         if getattr(prod, "PackType", None)
#                         else ""
#                     ),
#                     "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#                     "IssueQuantity": item.Issue_Quantity or 0,
#                     "SellablePrice": float(sellable_price) if sellable_price else 0.0,  # ✅ Added
#                     "Status": item.Issue_Status or "",
#                 }
#             )
 
#         data.append(
#             {
#                 "SNo": i,
#                 "Issue_Invoice_No": obj.pk,
#                 "IssueDate": obj.Issue_Date.strftime("%Y-%m-%d") if obj.Issue_Date else "",
#                 "RaisedFrom": f"{obj.Issue_From_Location.Location_Name if obj.Issue_From_Location else ''} - store - {obj.Issue_From_Store_Location.Store_Name if obj.Issue_From_Store_Location else ''}",
#                 "RaisedTo": f"{obj.Issue_To_Location.Location_Name if obj.Issue_To_Location else ''} - store - {obj.Issue_To_Store_Location.Store_Name if obj.Issue_To_Store_Location else ''}",
#                 "Reason": obj.Issue_Reason or "",
#                 "IssuedBy": obj.Issue_by or "",
#                 "Status": obj.Issue_Status or "",
#                 "Items": items,
#             }
#         )
 
#     return JsonResponse(data, safe=False)
 
@csrf_exempt
@require_http_methods(["GET"])
def IndentIssueReport(request):
    
    try:
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        location = request.GET.get("Location")
    
        query = Q()
        # if from_date and to_date:
        #     query &= Q(Issue_Date__range=[from_date, to_date])
        
        if from_date and to_date and from_date != "" and to_date != "":
                from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
                print("custom---------", from_date, to_date)
                query &= Q(Issue_Date__date__range=[from_date, to_date])
        
        
        if location:
            query &= Q(Issue_From_Location__Location_Name__icontains=location)
    
        results = Indent_issue_details_table.objects.filter(query).order_by("Issue_Date")
        data = []
    
        for i, obj in enumerate(results, start=1):
            items = []
            for item in Indent_issue_items_details_table.objects.filter(Indent_Detials=obj):
                prod = item.Product_Detials
    
                # 🔹 Fetch Sellable_price from stock maintenance
                sellable_price = None
                if prod:
                    stock_entry = (
                        Stock_Maintance_Table_Detials.objects
                        .filter(Product_Detials=prod)
                        .order_by("-Created_at")
                        .first()
                    )
                    sellable_price = stock_entry.Sellable_price if stock_entry else None
    
                items.append(
                    {
                        "ItemCode": str(prod.pk) if prod else "",
                        "ItemName": getattr(prod, "ItemName", "") if prod else "",
                        "ProductCategory": (
                            getattr(
                                prod.SubCategory.ProductCategoryId,
                                "ProductCategory_Name",
                                "",
                            )
                            if getattr(prod, "SubCategory", None)
                            and getattr(prod.SubCategory, "ProductCategoryId", None)
                            else ""
                        ),
                        "SubCategory": (
                            getattr(prod.SubCategory, "SubCategoryName", "")
                            if getattr(prod, "SubCategory", None)
                            else ""
                        ),
                        "PackType": (
                            getattr(prod.PackType, "PackType_Name", "")
                            if getattr(prod, "PackType", None)
                            else ""
                        ),
                        "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
                        "IssueQuantity": item.Issue_Quantity or 0,
                        "SellablePrice": float(sellable_price) if sellable_price else 0.0,  # ✅ Added
                        "Status": item.Issue_Status or "",
                    }
                )
    
            data.append(
                {
                    "SNo": i,
                    "Issue_Invoice_No": obj.pk,
                    "IssueDate": obj.Issue_Date.strftime("%Y-%m-%d") if obj.Issue_Date else "",
                    "RaisedFrom": f"{obj.Issue_From_Location.Location_Name if obj.Issue_From_Location else ''} - store - {obj.Issue_From_Store_Location.Store_Name if obj.Issue_From_Store_Location else ''}",
                    "RaisedTo": f"{obj.Issue_To_Location.Location_Name if obj.Issue_To_Location else ''} - store - {obj.Issue_To_Store_Location.Store_Name if obj.Issue_To_Store_Location else ''}",
                    "Reason": obj.Issue_Reason or "",
                    "IssuedBy": obj.Issue_by or "",
                    "Status": obj.Issue_Status or "",
                    "Items": items,
                }
            )
    
        return JsonResponse(data, safe=False)
    except Exception as e:
        print("error :",str(e))
        return JsonResponse({'error': str(e)}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def IndentIssueReportGEN(request):
    
    try:
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        location = request.GET.get("Location")
    
        query = Q()
        # if from_date and to_date:
        #     query &= Q(Issue_Date__range=[from_date, to_date])
        
        if from_date and to_date and from_date != "" and to_date != "":
                from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
                print("custom---------", from_date, to_date)
                query &= Q(Issue_Date__date__range=[from_date, to_date])
        
        
        if location:
            query &= Q(Issue_From_Location__Location_Name__icontains=location)
    
        results = GEN_Indent_issue_details_table.objects.filter(query).order_by("Issue_Date")
        data = []
    
        for i, obj in enumerate(results, start=1):
            items = []
            for item in GEN_Indent_issue_items_details_table.objects.filter(Indent_Detials=obj):
                prod = item.Product_Detials
    
                # 🔹 Fetch Sellable_price from stock maintenance
                sellable_price = None
                if prod:
                    stock_entry = (
                        Stock_Maintance_Table_Detials.objects
                        .filter(Product_Detials=prod)
                        .order_by("-Created_at")
                        .first()
                    )
                    sellable_price = stock_entry.Sellable_price if stock_entry else None
    
                items.append(
                    {
                        "ItemCode": str(prod.pk) if prod else "",
                        "ItemName": getattr(prod, "ItemName", "") if prod else "",
                        "ProductCategory": (
                            getattr(
                                prod.SubCategory.ProductCategoryId,
                                "ProductCategory_Name",
                                "",
                            )
                            if getattr(prod, "SubCategory", None)
                            and getattr(prod.SubCategory, "ProductCategoryId", None)
                            else ""
                        ),
                        "SubCategory": (
                            getattr(prod.SubCategory, "SubCategoryName", "")
                            if getattr(prod, "SubCategory", None)
                            else ""
                        ),
                        "PackType": (
                            getattr(prod.PackType, "PackType_Name", "")
                            if getattr(prod, "PackType", None)
                            else ""
                        ),
                        "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
                        "IssueQuantity": item.Issue_Quantity or 0,
                        "SellablePrice": float(sellable_price) if sellable_price else 0.0,  # ✅ Added
                        "Status": item.Issue_Status or "",
                    }
                )
    
            data.append(
                {
                    "SNo": i,
                    "Issue_Invoice_No": obj.pk,
                    "IssueDate": obj.Issue_Date.strftime("%Y-%m-%d") if obj.Issue_Date else "",
                    "RaisedFrom": f"{obj.Issue_From_Location.Location_Name if obj.Issue_From_Location else ''} - store - {obj.Issue_From_Store_Location.Store_Name if obj.Issue_From_Store_Location else ''}",
                    "RaisedTo": f"{obj.Issue_To_Location.Location_Name if obj.Issue_To_Location else ''} - store - {obj.Issue_To_Store_Location.Store_Name if obj.Issue_To_Store_Location else ''}",
                    "Reason": obj.Issue_Reason or "",
                    "IssuedBy": obj.Issue_by or "",
                    "Status": obj.Issue_Status or "",
                    "Items": items,
                }
            )
    
        return JsonResponse(data, safe=False)
    except Exception as e:
        print("error :",str(e))
        return JsonResponse({'error': str(e)}, status=500)
 


# @csrf_exempt
# @require_http_methods(["GET"])
# def IndentReceiveReport(request):
#     from_date = request.GET.get("FromDate")
#     to_date = request.GET.get("ToDate")
#     location = request.GET.get("Location")
#     query = Q()
#     if from_date and to_date:
#         query &= Q(Receive_Date__range=[from_date, to_date])
#     if location:
#         query &= Q(Receive_From_Location__Location_Name__icontains=location)
#     results = Indent_receive_details_table.objects.filter(query).order_by(
#         "-Receive_Date"
#     )
#     data = []
#     for i, obj in enumerate(results, start=1):
#         items = []
#         for item in Indent_receive_items_details_table.objects.filter(
#             Indent_Detials=obj
#         ):
#             # Defensive: check Indent_issue_Item and Product_Detials
#             prod = None
#             if hasattr(item, "Indent_issue_Item") and item.Indent_issue_Item:
#                 prod = getattr(item.Indent_issue_Item, "Product_Detials", None)
#             items.append(
#                 {
#                     "ItemCode": str(prod.pk) if prod and hasattr(prod, "pk") else "",
#                     "ItemName": getattr(prod, "ItemName", "") if prod else "",
#                     "ProductCategory": (
#                         getattr(
#                             prod.SubCategory.ProductCategoryId,
#                             "ProductCategory_Name",
#                             "",
#                         )
#                         if prod
#                         and getattr(prod, "SubCategory", None)
#                         and getattr(prod.SubCategory, "ProductCategoryId", None)
#                         else ""
#                     ),
#                     "SubCategory": (
#                         getattr(prod.SubCategory, "SubCategoryName", "")
#                         if prod and getattr(prod, "SubCategory", None)
#                         else ""
#                     ),
#                     "PackType": getattr(prod, "PackType", None)
#                     and getattr(prod.PackType, "PackType_Name", "")
#                     or "",
#                     "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#                     "ReceivedQuantity": getattr(item, "Received_Quantity", 0) or 0,
#                     "Status": getattr(item, "Status", "") or "",
#                 }
#             )
#         data.append(
#             {
#                 "SNo": i,
#                 "Receive_Invoice_No": obj.pk,
#                 "ReceiveDate": (
#                     obj.Receive_Date.strftime("%Y-%m-%d")
#                     if hasattr(obj, "Receive_Date") and obj.Receive_Date
#                     else ""
#                 ),
#                 "IssueFrom": f"{getattr(obj.Receive_From_Location, 'Location_Name', '') if hasattr(obj, 'Receive_From_Location') and obj.Receive_From_Location else ''} - store - {getattr(obj.Receive_From_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_From_Store_Location') and obj.Receive_From_Store_Location else ''}",
#                 "ReceiveTo": f"{getattr(obj.Receive_To_Location, 'Location_Name', '') if hasattr(obj, 'Receive_To_Location') and obj.Receive_To_Location else ''} - store - {getattr(obj.Receive_To_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_To_Store_Location') and obj.Receive_To_Store_Location else ''}",
#                 "Reason": getattr(obj, "Receive_Reason", "") or "",
#                 "ReceivedBy": getattr(obj, "Receive_by", "") or "",
#                 "Status": getattr(obj, "Receive_Status", "") or "",
#                 "Items": items,
#             }
#         )
#     return JsonResponse(data, safe=False)


# latest
# @csrf_exempt
# @require_http_methods(["GET"])
# def IndentReceiveReport(request):
#     from_date = request.GET.get("FromDate")
#     to_date = request.GET.get("ToDate")
#     location = request.GET.get("Location")
 
#     query = Q()
#     if from_date and to_date:
#         query &= Q(Receive_Date__range=[from_date, to_date])
#     if location:
#         query &= Q(Receive_From_Location__Location_Name__icontains=location)
 
#     results = Indent_receive_details_table.objects.filter(query).order_by("-Receive_Date")
#     data = []
 
#     for i, obj in enumerate(results, start=1):
#         items = []
#         for item in Indent_receive_items_details_table.objects.filter(Indent_Detials=obj):
#             prod = None
#             if hasattr(item, "Indent_issue_Item") and item.Indent_issue_Item:
#                 prod = getattr(item.Indent_issue_Item, "Product_Detials", None)
 
#             # 🔹 Fetch Sellable_price from stock maintenance
#             sellable_price = None
#             if prod:
#                 stock_entry = (
#                     Stock_Maintance_Table_Detials.objects
#                     .filter(Product_Detials=prod)
#                     .order_by("-Created_at")
#                     .first()
#                 )
#                 sellable_price = stock_entry.Sellable_price if stock_entry else None
 
#             items.append(
#                 {
#                     "ItemCode": str(prod.pk) if prod and hasattr(prod, "pk") else "",
#                     "ItemName": getattr(prod, "ItemName", "") if prod else "",
#                     "ProductCategory": (
#                         getattr(
#                             prod.SubCategory.ProductCategoryId,
#                             "ProductCategory_Name",
#                             "",
#                         )
#                         if prod
#                         and getattr(prod, "SubCategory", None)
#                         and getattr(prod.SubCategory, "ProductCategoryId", None)
#                         else ""
#                     ),
#                     "SubCategory": (
#                         getattr(prod.SubCategory, "SubCategoryName", "")
#                         if prod and getattr(prod, "SubCategory", None)
#                         else ""
#                     ),
#                     "PackType": getattr(prod, "PackType", None)
#                     and getattr(prod.PackType, "PackType_Name", "")
#                     or "",
#                     "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
#                     "ReceivedQuantity": getattr(item, "Received_Quantity", 0) or 0,
#                     "SellablePrice": float(sellable_price) if sellable_price else 0.0,  # ✅ Added
#                     "Status": getattr(item, "Status", "") or "",
#                 }
#             )
 
#         data.append(
#             {
#                 "SNo": i,
#                 "Receive_Invoice_No": obj.pk,
#                 "ReceiveDate": obj.Receive_Date.strftime("%Y-%m-%d") if hasattr(obj, "Receive_Date") and obj.Receive_Date else "",
#                 "IssueFrom": f"{getattr(obj.Receive_From_Location, 'Location_Name', '') if hasattr(obj, 'Receive_From_Location') and obj.Receive_From_Location else ''} - store - {getattr(obj.Receive_From_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_From_Store_Location') and obj.Receive_From_Store_Location else ''}",
#                 "ReceiveTo": f"{getattr(obj.Receive_To_Location, 'Location_Name', '') if hasattr(obj, 'Receive_To_Location') and obj.Receive_To_Location else ''} - store - {getattr(obj.Receive_To_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_To_Store_Location') and obj.Receive_To_Store_Location else ''}",
#                 "Reason": getattr(obj, "Receive_Reason", "") or "",
#                 "ReceivedBy": getattr(obj, "Receive_by", "") or "",
#                 "Status": getattr(obj, "Receive_Status", "") or "",
#                 "Items": items,
#             }
#         )
 
#     return JsonResponse(data, safe=False)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def IndentReceiveReport(request):
    try:
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        location = request.GET.get("Location")
    
        query = Q()
        # if from_date and to_date:
        #     query &= Q(Receive_Date__range=[from_date, to_date])
        
        if from_date and to_date and from_date != "" and to_date != "":
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            print("custom---------", from_date, to_date)
            query &= Q(Receive_Date__date__range=[from_date, to_date])

        if location:
            query &= Q(Receive_From_Location__Location_Name__icontains=location)
    
        results = Indent_receive_details_table.objects.filter(query).order_by("Receive_Date")
        data = []
    
        for i, obj in enumerate(results, start=1):
            items = []
            for item in Indent_receive_items_details_table.objects.filter(Indent_Detials=obj):
                prod = None
                if hasattr(item, "Indent_issue_Item") and item.Indent_issue_Item:
                    prod = getattr(item.Indent_issue_Item, "Product_Detials", None)
    
                # 🔹 Fetch Sellable_price from stock maintenance
                sellable_price = None
                if prod:
                    stock_entry = (
                        Stock_Maintance_Table_Detials.objects
                        .filter(Product_Detials=prod)
                        .order_by("-Created_at")
                        .first()
                    )
                    sellable_price = stock_entry.Sellable_price if stock_entry else None
    
                items.append(
                    {
                        "ItemCode": str(prod.pk) if prod and hasattr(prod, "pk") else "",
                        "ItemName": getattr(prod, "ItemName", "") if prod else "",
                        "ProductCategory": (
                            getattr(
                                prod.SubCategory.ProductCategoryId,
                                "ProductCategory_Name",
                                "",
                            )
                            if prod
                            and getattr(prod, "SubCategory", None)
                            and getattr(prod.SubCategory, "ProductCategoryId", None)
                            else ""
                        ),
                        "SubCategory": (
                            getattr(prod.SubCategory, "SubCategoryName", "")
                            if prod and getattr(prod, "SubCategory", None)
                            else ""
                        ),
                        "PackType": getattr(prod, "PackType", None)
                        and getattr(prod.PackType, "PackType_Name", "")
                        or "",
                        "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
                        "ReceivedQuantity": getattr(item, "Received_Quantity", 0) or 0,
                        "SellablePrice": float(sellable_price) if sellable_price else 0.0,  # ✅ Added
                        "Status": getattr(item, "Status", "") or "",
                    }
                )
    
            data.append(
                {
                    "SNo": i,
                    "Receive_Invoice_No": obj.pk,
                    "ReceiveDate": obj.Receive_Date.strftime("%Y-%m-%d") if hasattr(obj, "Receive_Date") and obj.Receive_Date else "",
                    "IssueFrom": f"{getattr(obj.Receive_From_Location, 'Location_Name', '') if hasattr(obj, 'Receive_From_Location') and obj.Receive_From_Location else ''} - store - {getattr(obj.Receive_From_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_From_Store_Location') and obj.Receive_From_Store_Location else ''}",
                    "ReceiveTo": f"{getattr(obj.Receive_To_Location, 'Location_Name', '') if hasattr(obj, 'Receive_To_Location') and obj.Receive_To_Location else ''} - store - {getattr(obj.Receive_To_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_To_Store_Location') and obj.Receive_To_Store_Location else ''}",
                    "Reason": getattr(obj, "Receive_Reason", "") or "",
                    "ReceivedBy": getattr(obj, "Receive_by", "") or "",
                    "Status": getattr(obj, "Receive_Status", "") or "",
                    "Items": items,
                }
            )
    
        return JsonResponse(data, safe=False)
    except Exception as e:
        print("error :",str(e))
        return JsonResponse({'error': str(e)}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def IndentReceiveReportGEN(request):
    try:
        from_date = request.GET.get("FromDate")
        to_date = request.GET.get("ToDate")
        location = request.GET.get("Location")
    
        query = Q()
        # if from_date and to_date:
        #     query &= Q(Receive_Date__range=[from_date, to_date])
        
        if from_date and to_date and from_date != "" and to_date != "":
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
            print("custom---------", from_date, to_date)
            query &= Q(Receive_Date__date__range=[from_date, to_date])

        if location:
            query &= Q(Receive_From_Location__Location_Name__icontains=location)
    
        results = GEN_Indent_receive_details_table.objects.filter(query).order_by("Receive_Date")
        data = []
    
        for i, obj in enumerate(results, start=1):
            items = []
            for item in GEN_Indent_receive_items_details_table.objects.filter(Indent_Detials=obj):
                prod = None
                if hasattr(item, "Indent_issue_Item") and item.Indent_issue_Item:
                    prod = getattr(item.Indent_issue_Item, "Product_Detials", None)
    
                # 🔹 Fetch Sellable_price from stock maintenance
                sellable_price = None
                if prod:
                    stock_entry = (
                        Stock_Maintance_Table_Detials.objects
                        .filter(Product_Detials=prod)
                        .order_by("-Created_at")
                        .first()
                    )
                    sellable_price = stock_entry.Sellable_price if stock_entry else None
    
                items.append(
                    {
                        "ItemCode": str(prod.pk) if prod and hasattr(prod, "pk") else "",
                        "ItemName": getattr(prod, "ItemName", "") if prod else "",
                        "ProductCategory": (
                            getattr(
                                prod.SubCategory.ProductCategoryId,
                                "ProductCategory_Name",
                                "",
                            )
                            if prod
                            and getattr(prod, "SubCategory", None)
                            and getattr(prod.SubCategory, "ProductCategoryId", None)
                            else ""
                        ),
                        "SubCategory": (
                            getattr(prod.SubCategory, "SubCategoryName", "")
                            if prod and getattr(prod, "SubCategory", None)
                            else ""
                        ),
                        "PackType": getattr(prod, "PackType", None)
                        and getattr(prod.PackType, "PackType_Name", "")
                        or "",
                        "PackQuantity": getattr(prod, "PackQty", 0) if prod else 0,
                        "ReceivedQuantity": getattr(item, "Received_Quantity", 0) or 0,
                        "SellablePrice": float(sellable_price) if sellable_price else 0.0,  # ✅ Added
                        "Status": getattr(item, "Status", "") or "",
                    }
                )
    
            data.append(
                {
                    "SNo": i,
                    "Receive_Invoice_No": obj.pk,
                    "ReceiveDate": obj.Receive_Date.strftime("%Y-%m-%d") if hasattr(obj, "Receive_Date") and obj.Receive_Date else "",
                    "IssueFrom": f"{getattr(obj.Receive_From_Location, 'Location_Name', '') if hasattr(obj, 'Receive_From_Location') and obj.Receive_From_Location else ''} - store - {getattr(obj.Receive_From_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_From_Store_Location') and obj.Receive_From_Store_Location else ''}",
                    "ReceiveTo": f"{getattr(obj.Receive_To_Location, 'Location_Name', '') if hasattr(obj, 'Receive_To_Location') and obj.Receive_To_Location else ''} - store - {getattr(obj.Receive_To_Store_Location, 'Store_Name', '') if hasattr(obj, 'Receive_To_Store_Location') and obj.Receive_To_Store_Location else ''}",
                    "Reason": getattr(obj, "Receive_Reason", "") or "",
                    "ReceivedBy": getattr(obj, "Receive_by", "") or "",
                    "Status": getattr(obj, "Receive_Status", "") or "",
                    "Items": items,
                }
            )
    
        return JsonResponse(data, safe=False)
    except Exception as e:
        print("error :",str(e))
        return JsonResponse({'error': str(e)}, status=500)
 
 