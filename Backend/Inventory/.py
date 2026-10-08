import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *



@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_NurseStation_Details_list(request):
    try:
        NurseStation_Names = Stock_Maintance_Table_Detials.objects.filter(IsNurseStation=True)
        NurseStation_data = []
        added_nurse_station_ids = set()  # Track already added NurseStationIds

        for nursestation in NurseStation_Names:
            nurse_station_location = nursestation.NurseStation_location
            nurse_station_id = nurse_station_location.pk if nurse_station_location else None
            nurse_station_name = nurse_station_location.NurseStationName if nurse_station_location else ''

            if nurse_station_id and nurse_station_id not in added_nurse_station_ids:
                nurse_dict = {
                    # 'id': nursestation.pk,
                    'id': nurse_station_id,
                    'NurseStationName': nurse_station_name
                }
                NurseStation_data.append(nurse_dict)
                added_nurse_station_ids.add(nurse_station_id)  # Mark this ID as added

        return JsonResponse(NurseStation_data, safe=False)

    except Exception as e:
        print(f"Exception: {e}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_Product_Category_byNurseStation(request):
    try:
        NurseStationid = request.GET.get('NurseStationid')
        print("NurseStationid:", NurseStationid)

        if not NurseStationid:
            return JsonResponse({'warn': 'NurseStationid not found'})
        
        ProductCategory_names = Stock_Maintance_Table_Detials.objects.filter(NurseStation_location=NurseStationid)
        # print("ProductCategory_names", ProductCategory_names)
        product_category_data = []
        added_product_ids = set()  # Set to track unique product IDs

        for product in ProductCategory_names:
            if product.Product_Detials and product.Product_Detials.ProductCategory:
                product_id = product.Product_Detials.ProductCategory.pk
                product_name = product.Product_Detials.ProductCategory.ProductCategory_Name
                
                if product_id not in added_product_ids:
                    productname_dict = {
                        'productid': product_id,
                        'productcategoryname': product_name,
                    }
                    product_category_data.append(productname_dict)
                    added_product_ids.add(product_id)  # Mark this product ID as added

        return JsonResponse(product_category_data, safe=False)

    except Exception as e:
        print(f"Exception: {e}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_SubProductCategory_byProductCategory(request):
    try:
        ProductCategoryid = request.GET.get('ProductCategoryid')
        print("ProductCategoryid",ProductCategoryid)
        if not ProductCategoryid:
            return JsonResponse({'warn': 'ProductCategoryid not found'})

        sub_product_category_data = []
        added_subproduct_ids = set()

        # Correcting the filter method typo
        SubProductCategory_names = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials__ProductCategory=ProductCategoryid
        )

        for subproduct in SubProductCategory_names:
            print("subproduct",subproduct)
            subproductid = subproduct.Product_Detials.SubCategory.SubCategory_Id  # Assuming 'id' is the field name for subproduct ID
            subproductcategoryname = subproduct.Product_Detials.SubCategory.SubCategoryName  # Adjust field if necessary
            print("subproductcategoryname",subproductcategoryname)

            if subproductid not in added_subproduct_ids:
                sub_product_category_data.append({
                    'subproductid': subproductid,
                    'SubproductCategoryname': subproductcategoryname
                })
                added_subproduct_ids.add(subproductid)

        return JsonResponse(sub_product_category_data, safe=False)

    except Exception as e:
        print(f"Exception: {e}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_Item_Details_byNurseStation(request):
    try:
        NurseStationid = request.GET.get('NurseStationid')
        print("NurseStationid",NurseStationid)
        if not NurseStationid:
            return JsonResponse({'warn': 'NurseStationid not found'})
        
        item_names_data = []

        itemname_details = Stock_Maintance_Table_Detials.objects.filter(NurseStation_location=NurseStationid, IsNurseStation=True)
        for item in itemname_details:
            itemid = item.Product_Detials.pk  # Removed comma to avoid tuple
            itemname = item.Product_Detials.ItemName
            item_names_data.append({
                'ItemCode': itemid,
                'ItemName': itemname
            })
        
        return JsonResponse(item_names_data, safe=False, status=200)

    except Exception as e:
        print(f"Exception: {e}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_NurseStationall_Details_list(request):
    try:
        # Retrieve query parameters
        nurse_station_name = request.GET.get('NurseStationName')
        item_code = request.GET.get('ItemCode')
        product_category_id = request.GET.get('ProductCategoryid')
        sub_category_id = request.GET.get('SubCategoryid')

        # Validate required field
        if not nurse_station_name:
            return JsonResponse({'warn': 'NurseStationName is required'})

        # Base query for NurseStation_location and IsNurseStation filter
        filters = {
            'NurseStation_location': nurse_station_name,
            'IsNurseStation': True
        }
        all_item_data=[]

        # Apply conditional filters
        if nurse_station_name and product_category_id and sub_category_id:
            print("123")
            itemname_details = Stock_Maintance_Table_Detials.objects.filter(
                NurseStation_location=nurse_station_name, 
                IsNurseStation=True, 
                Product_Detials__ProductCategory=product_category_id, 
                Product_Detials__SubCategory=sub_category_id
            )
        else:
            if item_code:
                print("12")
                filters['Product_Detials__id'] = item_code
            if product_category_id:
                print("345")
                filters['Product_Detials__ProductCategory'] = product_category_id


            itemname_details = Stock_Maintance_Table_Detials.objects.filter(**filters)
            print("itemname_details",itemname_details)

        # Fetch and serialize data
        for item in itemname_details:
            item_dict = {
                'itemcode': item.Product_Detials.pk,
                'itemname': item.Product_Detials.ItemName,
                'productcategoryname': item.Product_Detials.ProductCategory.ProductCategory_Name,
                'productcategoryid': item.Product_Detials.ProductCategory.pk,
                'subproductcategoryid': item.Product_Detials.SubCategory.pk,
                'subproductcategoryname': item.Product_Detials.SubCategory.SubCategoryName,
                'availablequantity': item.AvailableQuantity,
                'nursestationname': item.NurseStation_location.NurseStationName,
                'nursestationid': item.NurseStation_location.pk,
            }
            all_item_data.append(item_dict)

        


        # Return response
        return JsonResponse(all_item_data, safe=False)

    except Exception as e:
        print(f"Exception: {e}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
