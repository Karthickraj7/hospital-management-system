import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q
from decimal import Decimal, InvalidOperation
from django.db import transaction
from io import BytesIO
from PIL import Image
import base64
from PyPDF2 import PdfReader, PdfWriter
# import magic
from .models import (Purchase_Order_Details,GRN_Table_Detials,GRN_Product_Item_Detials,Supplier_Master_Details,
Product_Master_All_Category_Details,Purchase_Order_Item_Details,Supplier_Product_Amount_Details,Stock_Maintance_Table_Detials,SerialNumber_Stock_Maintance_Table_Detials)
from Masters.models import Inventory_Location_Master_Detials,Inventory_Page_Access_Detailes
from datetime import datetime






@csrf_exempt
@require_http_methods(["GET"])
def GET_SerialNo_Quelist(request):
    if request.method == "GET":
        try:
            StatusCheck = request.GET.get('StatusCheck')
            print('StatusCheck', StatusCheck)

            Stock_Maintance_ins = Stock_Maintance_Table_Detials.objects.filter(Is_Serial_No_Available_for_each_quantity=True)

            if StatusCheck:
                Stock_Maintance_ins = Stock_Maintance_ins.filter(Is_Serial_No_Status=StatusCheck)

            print('Stock_Maintance_ins', Stock_Maintance_ins)

            Item_Array = []
           
            for index, row in enumerate(Stock_Maintance_ins, start=1):
                Item_dic = {
                    'id':index,
                    'StockId': row.pk,
                    'ItemCode': row.Product_Detials.pk,
                    'ItemName': row.Product_Detials.ItemName,
                    'ProductCategory': row.Product_Detials.ProductCategory.ProductCategory_Name,  # Assuming CategoryName is the field
                    'SubCategory': row.Product_Detials.SubCategory.SubCategoryName if row.Product_Detials.SubCategory else '',
                    'BatchNo': row.Batch_No,
                    'ItemQuantity': row.Grn_Recieve_Quantity,
                    'StoreLocation':'',
                    'StoreLocationName':'',
                    'Status': row.Is_Serial_No_Status,
                }
                if row.IsNurseStation :
                    Item_dic['StoreLocation']=row.NurseStation_location.pk,
                    Item_dic['StoreLocationName']=row.NurseStation_location.NurseStationName,
                
                else:
                    Item_dic['StoreLocation']=row.Store_location.Store_Id,
                    Item_dic['StoreLocationName']=row.Store_location.Store_Name,
                

                Item_Array.append(Item_dic)

            return JsonResponse(Item_Array, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
@require_http_methods(['POST','OPTIONS','GET'])
def SerialNumber_Create_Link(request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)

            StockId=data.get('StockId')
            Create_by=data.get('Create_by')
            ItemCode=data.get('ItemCode')
            SelectSerialType=data.get('SelectSerialType')



            if StockId:
                Stock_Inst=Stock_Maintance_Table_Detials.objects.get(pk=StockId)
            if ItemCode:
                Product_Ins=Product_Master_All_Category_Details(pk=ItemCode)


            SerialItemArray=data.get('SerialItemArray')

            for row in SerialItemArray:

                Check_Duplicate = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                    Serial_Number=row.get('SerialNumber')
                ).first()
                
                if Check_Duplicate:
                    return JsonResponse(
                        {
                            'warn': f"Duplicate entry '{Check_Duplicate.Serial_Number}' for 'Serial_Number'"
                        }
                    )
                
                SerialNumber_Stock_Maintance_Table_Detials.objects.create(
                    Product_Detailes=Product_Ins,
                    Stock_Table=Stock_Inst,
                    Serial_Number=row.get('SerialNumber'),
                    IsNurseStation=Stock_Inst.IsNurseStation,
                    Store_location=Stock_Inst.Store_location,
                    NurseStation_location=Stock_Inst.NurseStation_location,
                    Item_Status='Available',
                    Created_by=Create_by
                )

           
            Stock_Inst.Is_Serial_No_Status='Completed'
            Stock_Inst.Serial_No_Type=SelectSerialType

            Stock_Inst.save()

            return JsonResponse({'success': 'Serial Number Create successfully'}, status=200)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def GET_Last_SerialNumber_ItemDetails(request):
    if request.method == "GET":
        try:
            ItemCode = request.GET.get('ItemCode')
            StockId = request.GET.get('StockId')

            Detailes = {}

            
            SerialNumber_Stock_Ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
                Product_Detailes=ItemCode
            ).order_by('-Created_at').first()

            
            Stock_Ins = Stock_Maintance_Table_Detials.objects.filter(
                Product_Detials=ItemCode
            ).exclude(pk=StockId).order_by('-Created_at').first()

            if SerialNumber_Stock_Ins and Stock_Ins:
                Detailes = {
                    'ItemLastSerialNumber': SerialNumber_Stock_Ins.Serial_Number,
                    'ItemLastSerialNumberType': Stock_Ins.Serial_No_Type,
                }
            else:
                return JsonResponse({'message': 'No Data'})

            return JsonResponse({'message': 'success','Items':Detailes})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def GET_SerialNumber_Prodect_From_Master(request):
    if request.method == "GET":
        try:
            Product_inst=Product_Master_All_Category_Details.objects.filter(Is_Serial_No_Available_for_each_quantity=True)

            ItemArray=[]

            for row in Product_inst:
                Item_dec={
                    'ItemCode':row.pk,
                    'ItemName':row.ItemName,
                }
                ItemArray.append(Item_dec)
            
            return JsonResponse (ItemArray,safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
        

@csrf_exempt
@require_http_methods('GET')
def Get_SerialNumber(request):
    if request.method == "GET":
        try:

            SerialNumber=request.GET.get('SerialNumber')
            SerialArray=[]

            if SerialNumber:
                SerialNumber_inst=SerialNumber_Stock_Maintance_Table_Detials.objects.filter(Serial_Number__icontains=SerialNumber)
            else:
                return JsonResponse(SerialArray,safe=False)      
       
            for row in SerialNumber_inst:
                Item_dec={
                    'id':row.pk,
                    'SerialNumber':row.Serial_Number,
                }
                SerialArray.append(Item_dec)

            return JsonResponse(SerialArray,safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)



@csrf_exempt
@require_http_methods(['GET'])
def Get_BatchNo(request):
    try:
       
        GRN_Invo = []

        
        serial_number_table_ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(
            Stock_Table__Is_Serial_No_Available_for_each_quantity=True
        ).values('Stock_Table__Batch_No').distinct()

        
        for row in serial_number_table_ins:
            dec = {
                'BatchNo': row['Stock_Table__Batch_No'], 
            }
            GRN_Invo.append(dec)

        
        print('GRN_Invo', GRN_Invo)

       
        return JsonResponse(GRN_Invo, safe=False)

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
@require_http_methods('GET')
def Get_SerialNumber_Report(request):
    if request.method == 'GET':
        try:
            SerialNumber = request.GET.get('SerialNumber')
            ItemCode = request.GET.get('ItemCode')
            ItemName = request.GET.get('ItemName')
            BatchNo = request.GET.get('BatchNo')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            Monthly = request.GET.get('Monthly')
            Location = request.GET.get('Location')
            StoreType = request.GET.get('StoreType')
            StoreName = request.GET.get('StoreName')

            print('+++vvvvvvvv----',Location, StoreType,StoreName)

            query = Q()

            if SerialNumber:
                query &= Q(Serial_Number__icontains=SerialNumber)
            if ItemCode:
                query &= Q(Product_Detailes__pk__icontains=ItemCode)
            if ItemName:
                query &= Q(Product_Detailes__ItemName__icontains=ItemName)
            if BatchNo:
                query &= Q(Stock_Table__Batch_No=BatchNo)
            if DateType:
                if DateType == 'Current':
                    query &= Q(Created_at__date=CurrentDate)
                elif DateType == "Customize":
                    if FromDate and ToDate:
                        query &= Q(Created_at__date__range=[FromDate, ToDate])
                    elif FromDate:
                        query &= Q(Created_at__date__gte=FromDate)
                    elif ToDate:
                        query &= Q(Created_at__date__lte=ToDate)
                elif DateType == "Monthly":
                    if Monthly:
                        try:
                            monthly_date = datetime.strptime(Monthly, '%Y-%m')
                            year = monthly_date.year
                            month = monthly_date.month
                            query &= Q(Created_at__year=year) & Q(Created_at__month=month)
                        except ValueError:
                            print('Invalid Monthly format, expected YYYY-MM')

            SerialNumber_Stock_Ins = SerialNumber_Stock_Maintance_Table_Detials.objects.filter(query)

            if Location:
                    # SerialNumber_Stock_Ins = SerialNumber_Stock_Ins.filter(NurseStation_location__Location_Name__Location_Id=Location,Store_location__Location_Name__Location_Id=Location)
                    SerialNumber_Stock_Ins = SerialNumber_Stock_Ins.filter(
                        Q(NurseStation_location__Location_Name__Location_Id=Location) |
                        Q(Store_location__Location_Name__Location_Id=Location)
                    )
            if Location and StoreType=='NurseStation' :
                SerialNumber_Stock_Ins = SerialNumber_Stock_Ins.filter(NurseStation_location__Location_Name__Location_Id=Location)
            if Location and StoreType=='InventoryStore' :
                SerialNumber_Stock_Ins = SerialNumber_Stock_Ins.filter(Store_location__Location_Name__Location_Id=Location)

            if StoreType:
                if StoreType =='NurseStation' and StoreName:
                    SerialNumber_Stock_Ins = SerialNumber_Stock_Ins.filter(NurseStation_location__pk=StoreName)
                elif StoreType == 'InventoryStore' and StoreName:
                    SerialNumber_Stock_Ins = SerialNumber_Stock_Ins.filter(Store_location__Store_Id=StoreName)

            Item_Array = []

            for row in SerialNumber_Stock_Ins:
                Item_dec = {
                    'id': row.pk,
                    'ItemCode': row.Product_Detailes.pk,
                    'ItemName': row.Product_Detailes.ItemName,
                    'BatchNo': row.Stock_Table.Batch_No,
                    'SerialNoType': row.Stock_Table.Serial_No_Type,
                    'SerialNumber': row.Serial_Number,
                    'Location': row.Store_location.Location_Name.pk if row.Store_location else '',
                    'LocationName': row.Store_location.Location_Name.Location_Name if row.Store_location else '',
                    'StoreLocation': row.Store_location.Store_Id if row.Store_location else '',
                    'StoreLocationName': row.Store_location.Store_Name if row.Store_location else '',
                    'ItemStatus': row.Item_Status,
                    'Created_by': row.Created_by,
                }

                if row.IsNurseStation:
                    Item_dec['IsNurseStation'] = row.IsNurseStation
                    Item_dec['Location'] = row.NurseStation_location.Location_Name.Location_Name
                    Item_dec['LocationName'] = row.NurseStation_location.Location_Name.Location_Name
                    Item_dec['StoreLocation'] = row.NurseStation_location.pk
                    Item_dec['StoreLocationName'] = row.NurseStation_location.NurseStationName

                Item_Array.append(Item_dec)

            return JsonResponse(Item_Array, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




