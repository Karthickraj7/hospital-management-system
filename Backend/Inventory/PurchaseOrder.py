from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db import transaction
import json
from Masters.models import * 
from Inventory.models import *
from DrugAdminstrations.models import *
from django.db.models import Q
import pandas as pd
from io import BytesIO
from PIL import Image
import base64
from PyPDF2 import PdfReader, PdfWriter
# import magic
from decimal import Decimal, ROUND_HALF_UP





def validate_and_process_file(file):    
        
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=10, step=5):
            output = BytesIO()
            quality = 95
            compressed_data = None
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            output.seek(0)
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            compressed_data = output.getvalue()
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        if file:
            file_data = file.split(',')[1]
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                print('maximum mb')
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)
            
            if file_type == 'image/jpeg' or file_type == 'image/png':
                try:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, compressed_size = compress_image(image)
                    return compressed_image_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing image: {str(e)}'})

            elif file_type == 'application/pdf':
                try:
                    compressed_pdf_data, compressed_size = compress_pdf(BytesIO(file_content))

                    return compressed_pdf_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing PDF: {str(e)}'})

            else:
                return JsonResponse({'warn': 'Unsupported file format'})

        return None


# ----------------------------------------------------------


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def PurchaseOrder_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # print('dataaaaaa',data)

            SupplierId=data.get('SupplierId')
            OrderDate=data.get('OrderDate')
            DeliveryDate=data.get('DeliveryExpectedDate')
            BillingLocation=data.get('BillingLocation')
            ShippingLocation=data.get('ShippingLocation')
            TotalOrderValue=data.get('TotalOrderValue')
            Create_by=data.get('Create_by','Admin')
            POItemArrays=data.get('POItemArrays')
            PurchaseOrderNumber=data.get('PurchaseOrderNumber')
            IS_PurchaseOrder_Approve = data.get('IS_PurchaseOrder_Approve')
            Remarks = data.get('Remarks')
            print("IS_PurchaseOrder_Approve:", IS_PurchaseOrder_Approve, "Type:", type(IS_PurchaseOrder_Approve))

            EditStatus=data.get('EditStatus')
            BillingLocation_instance=None
            BillingLocation_Address_instance =None
            ShippingLocation_instance=None
            ShippingLocation_Address_instance=None


            if SupplierId:
                Supplier_Instance=Supplier_Master_Details.objects.get(pk=SupplierId)
            if BillingLocation:
                BillingLocation_instance=Location_Detials.objects.get(pk=BillingLocation)
                BillingLocation_Address_instance=Clinic_Detials.objects.get(Location__Location_Id=BillingLocation)
            if ShippingLocation:
                ShippingLocation_instance=Location_Detials.objects.get(pk=ShippingLocation)
                ShippingLocation_Address_instance=Clinic_Detials.objects.get(Location__Location_Id=ShippingLocation)

            if EditStatus:
                PO_Edit_instance=Purchase_Order_Details.objects.get(pk=PurchaseOrderNumber)
                PO_Edit_instance.PO_Status=EditStatus
                PO_Edit_instance.save()

                Purchase_Order_Items = Purchase_Order_Item_Details.objects.filter(PurchaseOrder=PO_Edit_instance)
    
                for item in Purchase_Order_Items:
                    item.Item_Status = EditStatus
                    item.save() 

                return JsonResponse ({'success': 'Purchase Order Approved successfully'})      


            elif PurchaseOrderNumber:
                print('Edit---PurchaseOrderNumber',PurchaseOrderNumber)
                PO_Edit_instance=Purchase_Order_Details.objects.get(pk=PurchaseOrderNumber)
                PO_Edit_instance.Supplier_Id=Supplier_Instance
                PO_Edit_instance.Order_Date=OrderDate
                PO_Edit_instance.Delivery_Expected_Date=DeliveryDate
                PO_Edit_instance.Billing_Location=BillingLocation_instance
                PO_Edit_instance.Billing_Address=BillingLocation_Address_instance
                PO_Edit_instance.Shipping_Location=ShippingLocation_instance
                PO_Edit_instance.Shipping_Address=ShippingLocation_Address_instance
                PO_Edit_instance.Total_Order_Value=TotalOrderValue
                PO_Edit_instance.Create_by=Create_by
                PO_Edit_instance.save()

                Purchase_Order_Item_Details.objects.filter(PurchaseOrder__PurchaseOrder_Number=PurchaseOrderNumber).delete()
                
                for row in POItemArrays:
                    ItemCode=int(row.get('ItemCode'))
                    Supplier_Product_instance=Supplier_Product_Details.objects.get(Supplier_Detials=Supplier_Instance,Product_Detials__pk=ItemCode)

                    Purchase_Order_Item_Details.objects.create(
                        PurchaseOrder=PO_Edit_instance,
                        PO_Item_Detailes=Supplier_Product_instance,
                        PO_Order_Qty=row.get('PurchaseQty'),
                        TotalAmount=row.get('TotalAmount'),
                        Balance_Qty=row.get('PurchaseQty'),
                        Remarks=row.get('Remarks'),
                        Create_by=Create_by,
                    )

                return JsonResponse ({'success': 'Purchase Order Detials Update successfully'})      

            else:
                
               
                Status=None
                if IS_PurchaseOrder_Approve:
                    print('------------------------0000000000000000000')
                    Status='Waiting For Approve' 
                else:
                    print('08888888888888888888----------------')    
                    Status='Waiting For GRN'
                    

                Purchase_Order_istance=Purchase_Order_Details.objects.create(
                    Supplier_Id=Supplier_Instance,
                    Order_Date=OrderDate,
                    Delivery_Expected_Date=DeliveryDate,
                    Billing_Location=BillingLocation_instance,
                    Billing_Address=BillingLocation_Address_instance,
                    Shipping_Location=ShippingLocation_instance,
                    Shipping_Address=ShippingLocation_Address_instance,
                    Total_Order_Value=TotalOrderValue,
                    PO_Status=Status,
                    Create_by=Create_by,
                    )
                
                for row in POItemArrays:
                    ItemCode=int(row.get('ItemCode'))
                    print('111',ItemCode)
                    Supplier_Product_instance=Supplier_Product_Details.objects.get(Supplier_Detials=Supplier_Instance,Product_Detials__pk=ItemCode)
                    print('222',Supplier_Product_instance)

                    Purchase_Order_Item_Details.objects.create(
                        PurchaseOrder=Purchase_Order_istance,
                        PO_Item_Detailes=Supplier_Product_instance,
                        PO_Order_Qty=row.get('PurchaseQty'),
                        TotalAmount=row.get('TotalAmount'),
                        Balance_Qty=row.get('PurchaseQty'),
                        Remarks=row.get('Remarks'),
                        Item_Status=Status,
                        Create_by=Create_by,
                    )


                return JsonResponse ({'success': 'Purchase Order Detials added successfully'})      
        
        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse (f'An error occurred:{str(e)}')




# ------------------------PO report


# -------------------change 10.10.24


# @csrf_exempt
# @require_http_methods(["GET"])
# def PurchaseOrder_Report_Details(request):
#     if request.method == 'GET':
#         try:
#             StatusCheck = request.GET.get('StatusCheck')
#             DateType = request.GET.get('DateType')
#             CurrentDate = request.GET.get('CurrentDate')
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')
#             SupplierId = request.GET.get('SupplierId')
#             BillingLocation = request.GET.get('BillingLocation')
#             ShippingLocation = request.GET.get('ShippingLocation')

            

#             Purchase_Order_instance = Purchase_Order_Details.objects.all()

            
#             if StatusCheck:
#                 Purchase_Order_instance = Purchase_Order_instance.filter(PO_Status=StatusCheck)
            
#             if SupplierId:
#                 Purchase_Order_instance = Purchase_Order_instance.filter(Supplier_Id=SupplierId)
            
#             if BillingLocation:                
#                     Purchase_Order_instance = Purchase_Order_instance.filter(Billing_Location__Location_Id=BillingLocation)
            
#             if ShippingLocation:                
#                     Purchase_Order_instance = Purchase_Order_instance.filter(Shipping_Location__Location_Id=ShippingLocation)
            
#             if DateType == 'CurrentDate' and CurrentDate:                
#                     Purchase_Order_instance = Purchase_Order_instance.filter(Order_Date=CurrentDate)
            
#             if DateType == 'Customize' and FromDate and ToDate:
#                 Purchase_Order_instance = Purchase_Order_instance.filter(
#                     Q(Order_Date__range=[FromDate, ToDate]) | Q(Order_Date__range=[FromDate, ToDate])
#             )

#             PO_Array = []

#             for row in Purchase_Order_instance:
#                 PO_dic = {
#                     'id': row.PurchaseOrder_Number,
#                     'SupplierId': row.Supplier_Id.pk,
#                     'SupplierName': row.Supplier_Id.Supplier_Name,
#                     'SupplierMailId': row.Supplier_Id.Email_Address,
#                     'SupplierContactNumber': row.Supplier_Id.Contact_Number,
#                     'SupplierContactPerson': row.Supplier_Id.Contact_Person,
#                     'OrderDate': row.Order_Date,
#                     'DeliveryExpectedDate': row.Delivery_Expected_Date,
#                     'BillingLocation': row.Billing_Location.Location_Id if row.Billing_Location else None,
#                     'Use_BillingLocation': row.Billing_Location.Location_Name if row.Billing_Location else None,
#                     'ShippingLocation': row.Shipping_Location.Location_Id if row.Shipping_Location else None,
#                     'Use_ShippingLocation': row.Shipping_Location.Location_Name if row.Shipping_Location else None,
#                     'TotalOrderValue': row.Total_Order_Value,
#                     'PO_Status': row.PO_Status,
#                 }
                
#                 Item_instance = Purchase_Order_Item_Details.objects.filter(PurchaseOrder__PurchaseOrder_Number=row.PurchaseOrder_Number)
                
#                 Item_Array = []
#                 for item in Item_instance:
#                     # print('1232',item)
#                     Get_Rate_Inst = Supplier_Product_Amount_Details.objects.filter(Supplier_detials__Supplier_Detials__pk=row.Supplier_Id.Supplier_Id, Supplier_detials__Product_Detials=item.PO_Item_Detailes.Product_Detials.pk).order_by('-Created_at').first()

#                     item_dic = {
#                         'id': item.PO_Item_Number,
#                         'ItemCode': item.PO_Item_Detailes.Product_Detials.pk,
#                         'ItemName': item.PO_Item_Detailes.Product_Detials.ItemName,
#                         'ProductCategory': item.PO_Item_Detailes.Product_Detials.ProductCategory.ProductCategory_Name,
#                         'SubCategory': item.PO_Item_Detailes.Product_Detials.SubCategory.SubCategoryName if item.PO_Item_Detailes.Product_Detials.SubCategory else '',

#                     }
                    
#                     if item.PO_Item_Detailes.Product_Detials.GenericName :                     
#                         item_dic['GenericName'] = item.PO_Item_Detailes.Product_Detials.GenericName.GenericName
#                     if item.PO_Item_Detailes.Product_Detials.CompanyName :
#                         item_dic['ManufacturerName'] = item.PO_Item_Detailes.Product_Detials.CompanyName.CompanyName
#                     if item.PO_Item_Detailes.Product_Detials.HSNCode :
#                         item_dic['HSNCode'] = item.PO_Item_Detailes.Product_Detials.HSNCode
#                     if item.PO_Item_Detailes.Product_Detials.Strength :
#                         item_dic['Strength'] = item.PO_Item_Detailes.Product_Detials.Strength
#                     if item.PO_Item_Detailes.Product_Detials.StrengthType :
#                         item_dic['StrengthType'] = item.PO_Item_Detailes.Product_Detials.StrengthType
#                     if item.PO_Item_Detailes.Product_Detials.Volume :
#                         item_dic['Volume'] = item.PO_Item_Detailes.Product_Detials.Volume
#                     if item.PO_Item_Detailes.Product_Detials.VolumeType :
#                         item_dic['VolumeType'] = item.PO_Item_Detailes.Product_Detials.VolumeType.Unit_Name                   
#                     if item.PO_Item_Detailes.Product_Detials.PackType :
#                         item_dic['PackType'] = item.PO_Item_Detailes.Product_Detials.PackType.PackType_Name
#                     if item.PO_Item_Detailes.Product_Detials.PackQty :
#                         item_dic['PackQty']= item.PO_Item_Detailes.Product_Detials.PackQty
#                     # if item.PO_Item_Detailes.Product_Detials.Is_Manufacture_Date_Available :
#                     #     item_dic['Is_Manufacture_Date_Available']= item.PO_Item_Detailes.Product_Detials.Is_Manufacture_Date_Available
#                     # if item.PO_Item_Detailes.Product_Detials.Is_Expiry_Date_Available :
#                     #     item_dic['Is_Expiry_Date_Available']= item.PO_Item_Detailes.Product_Detials.Is_Expiry_Date_Available
                    
                    
#                     if item.Item_Status == 'Waiting For GRN' and item.PO_Item_Detailes.Product_Detials.IsSellable is not None : 
#                          item_dic['IsSellable']='Yes' if item.PO_Item_Detailes.Product_Detials.IsSellable else 'No'
#                          if item_dic['IsSellable'] == 'Yes':                         
#                             item_dic['LeastSellableUnit']=item.PO_Item_Detailes.Product_Detials.LeastSellableUnit

                    
#                     item_dic['MRP']= Get_Rate_Inst.MRP
#                     item_dic['PurchaseRateBeforeGST']= Get_Rate_Inst.PurchaseRateBeforeGST
#                     item_dic['GST']=  Get_Rate_Inst.GST
#                     item_dic['PurchaseRateAfterGST']=Get_Rate_Inst.PurchaseRateAfterGST
                    
                        
#                     item_dic['PurchaseQty']= item.PO_Order_Qty
#                     item_dic['TotalAmount'] = item.TotalAmount
#                     item_dic['Item_Status']= item.Item_Status
#                     item_dic['Reason']= item.Reason                              
#                     item_dic['Received_Qty']=item.Received_Qty
#                     item_dic['Balance_Qty']=item.Balance_Qty
                    
                    
#                     Item_Array.append(item_dic)

#                 PO_dic['Item_Details'] = Item_Array
#                 PO_Array.append(PO_dic)

#             PO_Array.reverse()

#             return JsonResponse(PO_Array, safe=False)
        
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
        



# ===================PurchseReturn Code======================================






def safe_decimal(value):
    try:
        return Decimal(value)
    except (TypeError, ValueError):
        return Decimal(0)

@csrf_exempt
@require_http_methods(["GET"])
def GRN_Details_GET_For_PurchseReturn(request):
    if request.method == 'GET':
        try:
            Suppliercode = request.GET.get('SupplierCode')
            print('----------11111111111', Suppliercode)
            StoreLocation=request.GET.get('StoreLocation')
            print('---------222222222222222',StoreLocation)

            GRNInvoiceNo=request.GET.get('GRNInvoiceNo')
            print('GRNInvoiceNo------------',GRNInvoiceNo)
            Reason=request.GET.get('Reason')
            print('Reason------',Reason)
            
            
            if Suppliercode and StoreLocation :
                GRN_Table_Detials_Ins=GRN_Table_Detials.objects.filter(Supplier_Detials=Suppliercode,Store_location=StoreLocation)
                GRN_Array=[]
                for row in GRN_Table_Detials_Ins :
                    Grn_dec={
                        'GRNNumber':row.pk,
                        'GRN_No':row.GRN_No,
                        'GrnDate':row.GrnDate.strftime('%Y-%m-%d') if row.GrnDate else None,
                        'SupplierBillNumber':row.Supplier_Bill_Number,
                        'SupplierBillDate':row.Supplier_Bill_Date.strftime('%Y-%m-%d') if row.Supplier_Bill_Date else None,
                    }

                    GRN_Array.append(Grn_dec)
              
                return JsonResponse (GRN_Array,safe=False)
            elif GRNInvoiceNo :
           
                GRN_Table_Detials_ins=GRN_Table_Detials.objects.get(pk=GRNInvoiceNo)
                GRN_Product_Item_Ins=GRN_Product_Item_Detials.objects.filter(Grn_Detials=GRNInvoiceNo)
                
                
                Item_Array=[]
                
                for row in GRN_Product_Item_Ins:
                    Item_dec = {}

                    Stock_Maintance_Ins=Stock_Maintance_Table_Detials.objects.get(Product_Detials=row.Product_Detials,Batch_No=row.Batch_No,Store_location=GRN_Table_Detials_ins.Store_location)

                    if row.Product_Detials.pk:
                        Item_dec['ItemCode'] = row.Product_Detials.pk
                    if row.Product_Detials.ItemName:
                        Item_dec['ItemName'] = row.Product_Detials.ItemName
                    # if row.Product_Detials.ProductCategory:
                    #     Item_dec['ProductCategory'] = row.Product_Detials.ProductCategory.ProductCategory_Name
                    # if row.Product_Detials.SubCategory:
                    #     Item_dec['SubCategory'] = row.Product_Detials.SubCategory.SubCategoryName
                    if row.Product_Detials.GenericName:
                        Item_dec['GenericName'] = row.Product_Detials.GenericName.GenericName
                    if row.Product_Detials.CompanyName:
                        Item_dec['CompanyName'] = row.Product_Detials.CompanyName.CompanyName
                    if row.Product_Detials.HSNCode:
                        Item_dec['HSNCode'] = row.Product_Detials.HSNCode
                    if row.Product_Detials.ProductType:
                        Item_dec['ProductType'] = row.Product_Detials.ProductType.ProductType_Name
                    # if row.Product_Detials.ProductGroup:
                    #     Item_dec['ProductGroup'] = row.Product_Detials.ProductGroup.ProductGroup_Name
                    if row.Product_Detials.Strength and row.Product_Detials.StrengthType:
                        Item_dec['Strength'] = f'{row.Product_Detials.Strength} {row.Product_Detials.StrengthType}'
                    if row.Product_Detials.Volume and row.Product_Detials.VolumeType:
                        Item_dec['Volume'] = f'{row.Product_Detials.Volume} {row.Product_Detials.VolumeType.Unit_Name}'
                    if row.Product_Detials.PackType:
                        Item_dec['PackType'] = row.Product_Detials.PackType.PackType_Name
                    if row.Product_Detials.PackQty:
                        Item_dec['PackQuantity'] = row.Product_Detials.PackQty
                    if row.Batch_No:
                        Item_dec['BatchNo'] = row.Batch_No
                    if row.Manufacture_Date:
                        Item_dec['ManufactureDate'] = row.Manufacture_Date
                    if row.Expiry_Date:
                        Item_dec['ExpiryDate'] = row.Expiry_Date
                    if row.Purchase_rate_with_tax:
                        Item_dec['PurchaseRateWithTax'] = row.Purchase_rate_with_tax
                    if row.Total_Received_Quantity:
                        Item_dec['PurchaseQuantity'] = row.Total_Received_Quantity
                    if row.Total_Pack_Amount_with_tax:
                        Item_dec['TotalAmount'] = row.Total_Pack_Amount_with_tax
                    if Stock_Maintance_Ins:
                        Item_dec['AvailableQuantity'] = Stock_Maintance_Ins.AvailableQuantity

                    if row.Discount_Amount:
                        Item_dec['Discount'] = 'Item Wise Discount'
                        Item_dec['DiscountMethod'] = row.Discount_Method
                        Item_dec['DiscountType'] = row.Discount_Type
                        Item_dec['DiscountValue'] = row.Discount_Amount

                  
                        if row.Discount_Method == 'BeforeTax':
                            if row.Discount_Type == 'Cash':
                                taxable_amount = row.Purchase_rate_taxable - (row.Discount_Amount / row.Total_Received_Quantity)
                                ResultAmount1 = taxable_amount + (taxable_amount * safe_decimal(row.Tax_Percentage) / 100)
                                Item_dec['SingleProductPurchaseAmount'] = ResultAmount1.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                                print('D11111',Item_dec['SingleProductPurchaseAmount'])

                            elif row.Discount_Type == 'Percentage':
                                discounted_rate = row.Purchase_rate_taxable * (1 - row.Discount_Amount / 100)
                                ResultAmount2 = discounted_rate + (discounted_rate * safe_decimal(row.Tax_Percentage) / 100)
                                Item_dec['SingleProductPurchaseAmount'] = ResultAmount2.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                                print('D22222',Item_dec['SingleProductPurchaseAmount'])


                        elif row.Discount_Method == 'AfterTax':
                            if row.Discount_Type == 'Cash':
                                amount_with_tax = row.Purchase_rate_with_tax 
                                ResultAmount3 = max(0, amount_with_tax - row.Discount_Amount / row.Total_Received_Quantity)
                                Item_dec['SingleProductPurchaseAmount']=ResultAmount3.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                           


                            elif row.Discount_Type == 'Percentage':
                                amount_with_tax = row.Purchase_rate_with_tax
                                ResultAmount4 = amount_with_tax * (1 - row.Discount_Amount / 100)
                                Item_dec['SingleProductPurchaseAmount'] = ResultAmount4.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                                print('D44444',Item_dec['SingleProductPurchaseAmount'])
                                

                    elif GRN_Table_Detials_ins.Discount_Amount :
                        Item_dec['Discount'] = 'Overall Discount'
                        Item_dec['DiscountMethod'] = GRN_Table_Detials_ins.Total_Discount_Method
                        Item_dec['DiscountType'] = GRN_Table_Detials_ins.Total_Discount_Type
                        Item_dec['DiscountValue'] = GRN_Table_Detials_ins.Discount_Amount

                        findlength=GRN_Product_Item_Detials.objects.filter(Grn_Detials=GRNInvoiceNo,Discount_Amount=0).count()

                        if GRN_Table_Detials_ins.Total_Discount_Method =='BeforeTax':
                            if GRN_Table_Detials_ins.Total_Discount_Type == 'Cash' :
                                ItemDiscound1 = GRN_Table_Detials_ins.Discount_Amount / findlength
                                taxable_amount = row.Purchase_rate_taxable - (ItemDiscound1 / row.Total_Received_Quantity)
                                ResultAmount1 = taxable_amount + (taxable_amount * safe_decimal(row.Tax_Percentage) / 100)
                                
                                Item_dec['DiscountValue'] = ItemDiscound1
                                Item_dec['SingleProductPurchaseAmount'] = ResultAmount1.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                                print('D55555',Item_dec['SingleProductPurchaseAmount'])


                            elif GRN_Table_Detials_ins.Total_Discount_Type == 'Percentage' :
                                discounted_rate = row.Purchase_rate_taxable * (1 - GRN_Table_Detials_ins.Discount_Amount / 100)
                                ResultAmount2 = discounted_rate + (discounted_rate * safe_decimal(row.Tax_Percentage) / 100)
                                
                                Item_dec['DiscountValue'] = GRN_Table_Detials_ins.Discount_Amount
                                Item_dec['SingleProductPurchaseAmount'] = ResultAmount2.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                                print('D66666',Item_dec['SingleProductPurchaseAmount'])
                                
                                
                        elif GRN_Table_Detials_ins.Total_Discount_Method =='AfterTax':
                            if GRN_Table_Detials_ins.Total_Discount_Type == 'Cash' :
                                ItemDiscound3 = GRN_Table_Detials_ins.Discount_Amount / findlength
                                amount_with_tax = row.Purchase_rate_with_tax 
                                ResultAmount3 = max(0, amount_with_tax - ItemDiscound3 / row.Total_Received_Quantity)
                                
                                Item_dec['DiscountValue'] = ItemDiscound3
                                Item_dec['SingleProductPurchaseAmount']=ResultAmount3.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                              

                            
                            elif GRN_Table_Detials_ins.Total_Discount_Type == 'Percentage' :
                                amount_with_tax = row.Purchase_rate_with_tax
                                ResultAmount4 = amount_with_tax * (1 - GRN_Table_Detials_ins.Discount_Amount / 100)
                                
                                Item_dec['DiscountValue'] = GRN_Table_Detials_ins.Discount_Amount
                                Item_dec['SingleProductPurchaseAmount'] = ResultAmount4.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

                                print('D88888',Item_dec['SingleProductPurchaseAmount'])

                    else:
                        Item_dec['SingleProductPurchaseAmount'] = row.Purchase_rate_with_tax

                    
                    Item_Array.append(Item_dec)

                if Reason == 'ExpiredReturn':

                    Item_Array = [item for item in Item_Array if item.get('ExpiryStatus') != 'Not-Expired']


                return JsonResponse (Item_Array,safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error':f'An error occurred: {str(e)}'},status=500)




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def PurcchaseReturn_Link(request):
    if request.method == "POST":
        try:

            data = json.loads(request.body)
         
            SupplierDetailes = data.get('SupplierDetailes')
            ReturnItemList = data.get('ReturnItemList')
            Create_by = data.get('Create_by')

            ReturnDate = SupplierDetailes.get('ReturnDate')
            SupplierCode = SupplierDetailes.get('SupplierCode')
            StoreLocation = SupplierDetailes.get('StoreLocation')
            ReturnTotalItem = SupplierDetailes.get('ReturnTotalItem')
            ReturnTotalQuantity = SupplierDetailes.get('ReturnTotalQuantity')
            ReturnTotalAmount = SupplierDetailes.get('ReturnTotalAmount')
            PurchaseReturnNumber = SupplierDetailes.get('PurchaseReturnNumber')

            Supplier_Master_Inst = Supplier_Master_Details.objects.get(pk=SupplierCode) if SupplierCode else None
            Inventory_Location_Ins = Inventory_Location_Master_Detials.objects.get(pk=StoreLocation) if StoreLocation else None

            with transaction.atomic():
                if PurchaseReturnNumber:
                    # **Updating Existing Purchase Return**
                    Purchase_Return_Ins = Purchase_Return_Details_Table.objects.get(pk=PurchaseReturnNumber)

                    Purchase_Return_Ins.Supplier_Detials = Supplier_Master_Inst
                    Purchase_Return_Ins.Store_location = Inventory_Location_Ins
                    Purchase_Return_Ins.Return_Total_Item = ReturnTotalItem
                    Purchase_Return_Ins.Return_Total_Quantity = ReturnTotalQuantity
                    Purchase_Return_Ins.Return_Total_Amount = ReturnTotalAmount
                    Purchase_Return_Ins.save()

                    # Delete Old Items Before Adding New Ones
                    Purchase_Return_Items_Details_Table.objects.filter(Purchase_Return_Details=Purchase_Return_Ins).delete()

                else:
                    # **Creating New Purchase Return**
                    Purchase_Return_Ins = Purchase_Return_Details_Table.objects.create(
                        Purchase_Return_Date=ReturnDate,
                        Supplier_Detials=Supplier_Master_Inst,
                        Store_location=Inventory_Location_Ins,
                        Return_Total_Item=ReturnTotalItem,
                        Return_Total_Quantity=ReturnTotalQuantity,
                        Return_Total_Amount=ReturnTotalAmount,
                        Created_by=Create_by
                    )
                    
                # **Processing Each Return Item**
                for row in ReturnItemList:
                    GRN_Table_Detials_ins = GRN_Table_Detials.objects.get(pk=row.get('GRNInvoiceNo'))
                    GRN_Product_ins = GRN_Product_Item_Detials.objects.filter(
                        Grn_Detials=GRN_Table_Detials_ins,
                        Product_Detials=row.get('ItemCode'),
                        Batch_No=row.get('BatchNo')
                    ).first()
                    
                    Stock_Maintance_ins = Stock_Maintance_Table_Detials.objects.filter(
                        Product_Detials=row.get('ItemCode'),
                        Batch_No=row.get('BatchNo'),
                        Store_location=Inventory_Location_Ins
                    ).first()

                    # Creating Purchase Return Item
                    purchase_return = Purchase_Return_Items_Details_Table.objects.create(
                        Purchase_Return_Details=Purchase_Return_Ins,
                        GRN_Detials=GRN_Table_Detials_ins,
                        GRN_Item_Detials=GRN_Product_ins,
                        Stock_Detials=Stock_Maintance_ins,
                        Reason=row.get('Reason'),
                        Single_Product_Purchase_Amount=row.get('PurchaseAmount'),
                        Available_Pack_Quantity=row.get('AvailablePackQuantity'),
                        Return_Quantity=row.get('ReturnQuantity'),
                        Return_Pack_Quantity=row.get('ReturnPackQuantity'),
                        Return_Quantity_Amount=row.get('ReturnQuantityAmount'),
                        Remarks=row.get('Remarks'),
                        Created_by=Create_by
                    )

                    # **Updating Stock Maintenance** (If Record Exists)
                    if Stock_Maintance_ins:
                        Stock_Maintance_ins.AvailableQuantity -= purchase_return.Return_Pack_Quantity
                        Stock_Maintance_ins.save()
                  

                return JsonResponse({'success': 'Purchase Return Details processed successfully'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

# ------------------------------------------------------

@csrf_exempt
@require_http_methods(["GET"])
def PurchaseReturn_Report_Link (request):
    if request.method == "GET":
        try:
            StatusCheck = request.GET.get('StatusCheck')
            DateType=request.GET.get('DateType')
            CurrentDate=request.GET.get('CurrentDate')
            FromDate=request.GET.get('FromDate')
            ToDate=request.GET.get('ToDate')
            SupplierId=request.GET.get('SupplierId')
            SupplierName=request.GET.get('SupplierName')
            Location=request.GET.get('Location')
            StoreId = request.GET.get('StoreId')
            print('StoreId00000000000',StoreId)

            print('Location',Location)

            Item_Array=[]

            query =Q()

            if StatusCheck :
                query &= Q(Status = StatusCheck)

            if DateType :
                if DateType == 'CurrentDate':
                    if CurrentDate:
                        query &= Q(Purchase_Return_Date = CurrentDate)
                elif DateType == 'Customize':
                    if FromDate and ToDate:
                        query &= Q(Purchase_Return_Date__range=[FromDate,ToDate])
                    elif FromDate:
                        query &= Q(Purchase_Return_Date__gte=FromDate)
                    elif ToDate:
                        query &= Q(Purchase_Return_Date__lte=ToDate)
            
            if SupplierId :
                query &= Q(Supplier_Detials=SupplierId)
            if Location :
                query &= Q(Store_location__Location_Name__Location_Id=Location)
            if StoreId:
                print('StoreId---1111111', StoreId)
                query &= Q(Store_location__Store_Id=StoreId)
            
            # print('query',query)

            Purchase_Return_Ins=Purchase_Return_Details_Table.objects.filter(query)

            for row in Purchase_Return_Ins :
                Main_Dec={
                    'id':row.pk,
                    'ReturnDate':row.Purchase_Return_Date,
                    'SupplierCode' :row.Supplier_Detials.pk,
                    'SupplierName' :row.Supplier_Detials.Supplier_Name,
                    'SupplierMailId' :row.Supplier_Detials.Email_Address,
                    'SupplierContactNumber' :row.Supplier_Detials.Contact_Number,
                    'SupplierContactPerson' :row.Supplier_Detials.Contact_Person,
                    'StoreLocation_id' :row.Store_location.Store_Id,
                    'StoreLocation' :row.Store_location.Store_Name,
                    'Location_id' :row.Store_location.Location_Name.pk,
                    'Location' :row.Store_location.Location_Name.Location_Name,
                    'ReturnTotalItem':row.Return_Total_Item,
                    'ReturnTotalQuantity':row.Return_Total_Quantity,
                    'ReturnTotalAmount':row.Return_Total_Amount,
                    'Status':row.Status,
                    'Items':[]     
                }

                Items_Ins=Purchase_Return_Items_Details_Table.objects.filter(Purchase_Return_Details=row)

                for item in Items_Ins:
                    Item_dec={
                        'id':item.pk,
                        'GRNInvoiceNo':item.GRN_Detials.pk,
                        'GRNDate':item.GRN_Detials.GrnDate,
                        'SupplierBillNo':item.GRN_Detials.Supplier_Bill_Number,
                        'SupplierBillDate':item.GRN_Detials.Supplier_Bill_Date,
                        'Reason':item.Reason,
                        'ItemCode':item.GRN_Item_Detials.Product_Detials.pk,
                        'ItemName':item.GRN_Item_Detials.Product_Detials.ItemName,
                    }

                    if item.GRN_Item_Detials.Product_Detials.GenericName:
                        Item_dec['GenericName']=item.GRN_Item_Detials.Product_Detials.GenericName.GenericName
                    if item.GRN_Item_Detials.Product_Detials.CompanyName:   
                        Item_dec['CompanyName']=item.GRN_Item_Detials.Product_Detials.CompanyName.CompanyName
                    if item.GRN_Item_Detials.Product_Detials.HSNCode:   
                        Item_dec['HSNCode']=item.GRN_Item_Detials.Product_Detials.HSNCode
                    if item.GRN_Item_Detials.Product_Detials.ProductType:
                        Item_dec['ProductType']=item.GRN_Item_Detials.Product_Detials.ProductType.ProductType_Name
                    if item.GRN_Item_Detials.Product_Detials.Strength and item.GRN_Item_Detials.Product_Detials.StrengthType:
                        Item_dec['Strength'] = f'{item.GRN_Item_Detials.Product_Detials.Strength} {item.GRN_Item_Detials.Product_Detials.StrengthType}'
                    if item.GRN_Item_Detials.Product_Detials.Volume and item.GRN_Item_Detials.Product_Detials.VolumeType:
                        Item_dec['Volume'] = f'{item.GRN_Item_Detials.Product_Detials.Volume} {item.GRN_Item_Detials.Product_Detials.VolumeType.Unit_Name}'
                    if item.GRN_Item_Detials.Product_Detials.PackType:
                        Item_dec['PackType'] = item.GRN_Item_Detials.Product_Detials.PackType.PackType_Name
                    if item.GRN_Item_Detials.Product_Detials.PackQty:
                        Item_dec['PackQuantity'] = item.GRN_Item_Detials.Product_Detials.PackQty
                    if item.GRN_Item_Detials.Batch_No:
                        Item_dec['BatchNo'] = item.GRN_Item_Detials.Batch_No
                    if item.GRN_Item_Detials.Manufacture_Date:
                        Item_dec['ManufactureDate'] = item.GRN_Item_Detials.Manufacture_Date
                    if item.GRN_Item_Detials.Expiry_Date:
                        Item_dec['ExpiryDate'] = item.GRN_Item_Detials.Expiry_Date  
                    if item.GRN_Item_Detials.Purchase_rate_with_tax:
                        Item_dec['PurchaseRateWithTax'] = item.GRN_Item_Detials.Purchase_rate_with_tax   
                    if item.GRN_Item_Detials.Total_Received_Quantity:
                        Item_dec['PurchaseQuantity'] = item.GRN_Item_Detials.Total_Received_Quantity
                    if item.GRN_Item_Detials.Total_Pack_Amount_with_tax:
                        Item_dec['TotalAmount'] = item.GRN_Item_Detials.Total_Pack_Amount_with_tax
                    if item.Stock_Detials:
                        Item_dec['AvailablePackQuantity'] = item.Stock_Detials.AvailableQuantity
                    
                    if item.GRN_Item_Detials.Discount_Amount:
                        Item_dec['Discount'] = 'Item Wise Discount'
                        Item_dec['DiscountMethod'] = item.GRN_Item_Detials.Discount_Method
                        Item_dec['DiscountType'] = item.GRN_Item_Detials.Discount_Type
                        Item_dec['DiscountValue'] = item.GRN_Item_Detials.Discount_Amount
                    if item.GRN_Detials.Discount_Amount:
                        Item_dec['Discount'] = 'Overall Discount'
                        Item_dec['DiscountMethod'] = item.GRN_Detials.Total_Discount_Method
                        Item_dec['DiscountType'] = item.GRN_Detials.Total_Discount_Type
                        Item_dec['DiscountValue'] = item.GRN_Detials.Discount_Amount
                    if item.Single_Product_Purchase_Amount :
                        Item_dec['PurchaseAmount']=item.Single_Product_Purchase_Amount
                    if item.Return_Quantity:
                        Item_dec['ReturnQuantity']=item.Return_Quantity
                    if item.Return_Pack_Quantity:
                        Item_dec['ReturnPackQuantity']=item.Return_Pack_Quantity
                    if item.Return_Quantity_Amount :
                        Item_dec['ReturnQuantityAmount']=item.Return_Quantity_Amount
                    if item.Remarks:
                        Item_dec['Remarks']=item.Remarks
                    
                    Main_Dec['Items'].append(Item_dec)
                Item_Array.append(Main_Dec)


            return JsonResponse(Item_Array,safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error':f'An error occurred: {str(e)}'},status=500)



@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def PurchaseReturn_StatusUpdate(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            EditStatus=data.get('EditStatus')
            PRreturnid=data.get('PRreturnid')

            print('data',EditStatus,PRreturnid)

            if not EditStatus or not PRreturnid:
                return JsonResponse({'error': 'EditStatus and PRreturnid are required fields.'}, status=400)
            

            Purchase_Return_Ins=Purchase_Return_Details_Table.objects.get(pk=PRreturnid)
            Purchase_Return_Ins.Status=EditStatus
            Purchase_Return_Ins.save()  

            Purchase_Return_Items_Ins=Purchase_Return_Items_Details_Table.objects.filter(Purchase_Return_Details=Purchase_Return_Ins)  

            for item in Purchase_Return_Items_Ins :
                
                item.Status = EditStatus
                item.save()

                if EditStatus == 'Approved':

                    Stock_Maintance_Table_ins = Stock_Maintance_Table_Detials.objects.get(pk=item.Stock_Detials.pk)
                   
                    Stock_Maintance_Table_ins.AvailableQuantity=Stock_Maintance_Table_ins.AvailableQuantity - item.Return_Pack_Quantity

                    Stock_Maintance_Table_ins.save()

            return JsonResponse ({'success': 'Purchase Return Status Update successfully'})      

        except Exception as e :
            print(f'An error occurred:{str(e)}')
            return JsonResponse (f'An error occurred:{str(e)}')



 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def PurchaseOrder_Itemwise_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print('data-----------',data)
            POItemsArrays = data.get('POItemArrays', data.get('PurchaseOrders', []))
            Create_by = data.get('Create_by')
 
            if not POItemsArrays:
                return JsonResponse({'error': 'No purchase order items provided'})
 
            for row in POItemsArrays:
               
                SupplierId = row.get('SupplierId')
                OrderDate = row.get('OrderDate')
                DeliveryDate = row.get('DeliveryExpectedDate',None)
                BillingLocation = row.get('BillingLocation')
                ShippingLocation = row.get('ShippingLocation')
                TotalOrderValue = row.get('TotalOrderValue')
                Items = row.get('items', row.get('MinItemArray', []))
                ShippingLocation_instance = None
                BillingLocation_instance = None
                BillingLocation_Address_instance = None
                ShippingLocation_Address_instance = None

 
                if not SupplierId or not Items:
                    return JsonResponse({'error': f'Missing required fields for supplier {SupplierId}'})
                
                # try:
                #     Supplier_Instance = Supplier_Master_Details.objects.get(pk=SupplierId)
                #     BillingLocation_instance = Location_Detials.objects.get(pk=BillingLocation)
                #     BillingLocation_Address_instance=Clinic_Detials.objects.get(Location__Location_Id=BillingLocation)
                #     ShippingLocation_instance = Location_Detials.objects.get(pk=ShippingLocation)
                #     ShippingLocation_Address_instance=Clinic_Detials.objects.get(Location__Location_Id=ShippingLocation)
                # except Supplier_Master_Details.DoesNotExist:
                #     return JsonResponse({'warn': f'Supplier {SupplierId} not found'})
                # except Location_Detials.DoesNotExist:
                #     return JsonResponse({'warn': f'Billing or shipping location not found'})
                try:
                    Supplier_Instance = Supplier_Master_Details.objects.get(pk=SupplierId)

                    if BillingLocation:
                        BillingLocation_instance = Location_Detials.objects.get(pk=BillingLocation)
                        BillingLocation_Address_instance = Clinic_Detials.objects.get(Location__Location_Id=BillingLocation)

                    if ShippingLocation:
                        ShippingLocation_instance = Location_Detials.objects.get(pk=ShippingLocation)
                        ShippingLocation_Address_instance = Clinic_Detials.objects.get(Location__Location_Id=ShippingLocation)

                except Supplier_Master_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Supplier {SupplierId} not found'})

                except Location_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'One of the provided location IDs is invalid'})
                Purchase_Order_instance = Purchase_Order_Details.objects.create(
                    Supplier_Id=Supplier_Instance,
                    Order_Date=OrderDate,
                    Delivery_Expected_Date=DeliveryDate,
                    Billing_Location=BillingLocation_instance,
                    Billing_Address=BillingLocation_Address_instance,
                    Shipping_Location=ShippingLocation_instance,
                    Shipping_Address=ShippingLocation_Address_instance,
                    Total_Order_Value=TotalOrderValue,
                    Create_by=Create_by,
                )
 
                try:
                    item_objects = []
                    for item in Items:
                        ItemCode = int(item.get('itemCode', item.get('ItemCode', 0)))
                        Supplier_Product_instance = Supplier_Product_Details.objects.get(
                            Supplier_Detials=Supplier_Instance, Product_Detials__pk=ItemCode
                        )
                        item_objects.append(
                            Purchase_Order_Item_Details(
                                PurchaseOrder=Purchase_Order_instance,
                                PO_Item_Detailes=Supplier_Product_instance,
                                PO_Order_Qty = item.get('PurchaseQty', item.get('ReorderLevel', 0)),
                                TotalAmount=item.get('TotalAmount', 0),
                                Balance_Qty=item.get('PurchaseQty', item.get('ReorderLevel', 0)),
                                Create_by=Create_by,
                            )
                        )
 
                    # Use bulk_create for efficiency
                    Purchase_Order_Item_Details.objects.bulk_create(item_objects)
 
                except Supplier_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Item {ItemCode} not found for supplier {SupplierId}'})
 
            return JsonResponse({'success': 'Purchase Order Details added successfully'})
 
 
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
 
# ----------------------------------opening closing------------




from django.db.models import F, Sum, BigIntegerField, DecimalField, Value
from django.db.models.functions import Coalesce, Cast
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from datetime import datetime

def currentmonth():
    return datetime.now().month

def currentyear():
    return datetime.now().year



from datetime import datetime

from datetime import datetime, timedelta
from django.db.models import Sum, Value, Q
from django.db.models.functions import Coalesce

def calculate_opening_quantity(product_id, batch_no, store_location, store_location_nurse_station, month, year):
    print('product_id:', product_id)
    print('batch_no:', batch_no)
    print('store_location:', store_location)
    print('store_location_nurse_station:', store_location_nurse_station)
    print('month:', month)
    print('year:', year)

    # Get cutoff date as end of the previous month
    first_day_of_current_month = datetime(year, month, 1)
    print('first_day_of_current_month---------',first_day_of_current_month)
    cutoff_date = first_day_of_current_month - timedelta(days=1)
    print('cutoff_date-------------',cutoff_date)
    cutoff_date = cutoff_date.replace(hour=23, minute=59, second=59)
    print('cutoff_date---------------',cutoff_date)

    # GRN Received quantity
    grn_filter = Q(Status='Approved', Created_at__lt=cutoff_date, Product_Detials_id=product_id, Batch_No=batch_no)
    total_received = GRN_Product_Item_Detials.objects.filter(grn_filter).aggregate(
        total_received_quantity=Coalesce(Sum('Total_Received_Quantity'), Value(0))
    )['total_received_quantity']

    # Issue quantity
    issue_filter = Q(Issue_Status='Approved', Created_at__lt=cutoff_date, Product_Detials_id=product_id)
    if store_location_nurse_station:
        issue_filter &= Q(Indent_Detials__Issue_From_NurseStation_Location__NurseStationid=store_location)
    else:
        issue_filter &= Q(Indent_Detials__Issue_From_Store_Location__Store_Id=store_location)

    total_issue = Indent_issue_items_details_table.objects.filter(issue_filter).aggregate(
        total_issue_quantity=Coalesce(Sum('Issue_Quantity'), Value(0))
    )['total_issue_quantity']

    # Receive quantity
    receive_filter = Q(Created_at__lt=cutoff_date, Indent_issue_Item__Product_Detials__id=product_id)
    if store_location_nurse_station:
        receive_filter &= Q(Indent_Detials__Indent_issue__Issue_To_NurseStation_Location__NurseStationid=store_location)
    else:
        receive_filter &= Q(Indent_Detials__Indent_issue__Issue_To_Store_Location__Store_Id=store_location)

    total_receive = Indent_receive_items_details_table.objects.filter(receive_filter).aggregate(
        total_receive_quantity=Coalesce(Sum('Received_Quantity'), Value(0))
    )['total_receive_quantity']

    # Return quantity (only for store)
    total_return_quantity = 0
    if not store_location_nurse_station and store_location:
        return_filter = Q(Created_at__lt=cutoff_date, Stock_Detials__Product_Detials_id=product_id)
        total_return_quantity = Purchase_Return_Items_Details_Table.objects.filter(return_filter).aggregate(
            total_return_quantity=Coalesce(Sum('Return_Quantity'), Value(0))
        )['total_return_quantity']

    # Adjustment Less quantity
    adjust_filter = Q(Created_at__lt=cutoff_date, Stock_Instance__Product_Detials_id=product_id)
    if store_location_nurse_station:
        adjust_filter &= Q(Stock_Instance__NurseStation_location__NurseStationid=store_location)
    else:
        adjust_filter &= Q(Stock_Instance__Store_location__Store_Id=store_location)

    total_adjust_less = StockAdjustment_Item_Details.objects.filter(adjust_filter, AdjustMode='Less').aggregate(
        total_less_quantity=Coalesce(Sum('AdjustQty'), Value(0))
    )['total_less_quantity']

    # Adjustment Add quantity
    total_adjust_add = StockAdjustment_Item_Details.objects.filter(adjust_filter, AdjustMode='Add').aggregate(
        total_add_quantity=Coalesce(Sum('AdjustQty'), Value(0))
    )['total_add_quantity']

    # Sales quantity based on location type
    total_sales_quantity = 0
   

    if store_location == 1 and not store_location_nurse_station:
        # Central store
        total_sales_quantity = 0
       

    elif store_location and not store_location_nurse_station:
        # Pharmacy
        ip_billing_ins = IP_BillingItem.objects.filter(
            Billing__created_at__lt=cutoff_date,
            ItemId__Product_Detials__pk=product_id,
            ItemId__Store_location__Store_Id=store_location
        ).aggregate(
            total_ip_sales_quantity=Coalesce(Sum('Billing_Quantity'), Value(0))
        )
        total_ip_sales_quantity = float(ip_billing_ins['total_ip_sales_quantity'])

        op_billing_ins = OP_BillingItem.objects.filter(
            Billing__created_at__lt=cutoff_date,
            ItemId__Product_Detials__pk=product_id,
            ItemId__Store_location__Store_Id=store_location
        ).aggregate(
            total_op_sales_quantity=Coalesce(Sum('Billing_Quantity'), Value(0))
        )
        total_op_sales_quantity = float(op_billing_ins['total_op_sales_quantity'])

        total_sales_quantity = total_ip_sales_quantity + total_op_sales_quantity
       

    elif store_location and store_location_nurse_station:
        # Nurse station
        total_sales_quantity = 0
        

    # Calculate opening quantity
    opening_quantity = (
        total_received
        - total_issue
        + total_receive
        + total_adjust_add
        - total_adjust_less
        - total_return_quantity
        - total_sales_quantity
    )
    print('opening_quantity------------',opening_quantity)

    return opening_quantity

@csrf_exempt
@require_http_methods(['GET'])
def Get_All_Opening_Closing_Balance(request):
    try:
        # Get parameters
        month = int(request.GET.get('month') or currentmonth())
        print('month----', month)
        year = int(request.GET.get('year') or currentyear())
        print('year----',year)
        StoreLocationNurseStation = request.GET.get('StoreLocationNurseStation')
        print('StoreLocationNurseStation----',StoreLocationNurseStation)
        StoreLocation = request.GET.get('StoreLocation')
        print('StoreLocation---',StoreLocationNurseStation)

        # Initial fetch
        Grn_Product_Details = (
            GRN_Product_Item_Detials.objects
            .filter(Status='Approved', Created_at__month=month, Created_at__year=year)
            .values('Product_Detials__pk', 'Batch_No')
            .annotate(
                total_received_quantity=Coalesce(Sum('Total_Received_Quantity', output_field=BigIntegerField()),
                    Value(0),
                    output_field=BigIntegerField()
                ),
                tax_percentage=Coalesce(
                    Sum(Cast(F('Tax_Percentage'), output_field=DecimalField(max_digits=5, decimal_places=2))),
                    Value(0),
                    output_field=DecimalField(max_digits=5, decimal_places=2)
                ),
                purchase_rate_taxable=Coalesce(
                    Sum('Purchase_rate_taxable', output_field=DecimalField(max_digits=12, decimal_places=2)),
                    Value(0),
                    output_field=DecimalField(max_digits=12, decimal_places=2)
                ),
            )
        )

        # Prefetch related data
        grn_instances_map = {
            (item.Product_Detials_id, item.Batch_No): item
            for item in GRN_Product_Item_Detials.objects
            .filter(Status='Approved')
            .select_related('Grn_Detials', 'Product_Detials', 'Grn_Detials__Purchase_order_Detials', 'Grn_Detials__Supplier_Detials')
        }

        Grn_Data = []
        

        for grn in Grn_Product_Details:
            key = (grn['Product_Detials__pk'], grn['Batch_No'])
            grn_instance = grn_instances_map.get(key)
            
            total_opening_quantity = calculate_opening_quantity(
                grn_instance.Product_Detials.pk,
                grn_instance.Batch_No,
                StoreLocation,
                StoreLocationNurseStation,
                month,
                year
            )

            if not grn_instance:
                continue

            # Initialize
            tax_percentage = float(grn['tax_percentage']) / 100
            purchase_rate_taxable = float(grn['purchase_rate_taxable'])
            total_received_quantity = float(grn['total_received_quantity']) or 1  # Prevent divide by zero

            gst_price = purchase_rate_taxable * (1 + tax_percentage)
            cpt = gst_price / total_received_quantity

            # Initialize all quantities and values to 0 to avoid reference errors
            total_issue_quantity = total_issue_value = 0
            total_receive_quantity = total_receive_value = 0
            total_return_quantity = return_quantity_Amount = 0
            total_adjust_less_qty = total_adjust_less_value = 0
            total_adjust_add_qty = total_adjust_add_value  =0
            total_closed_quantity = 0
            total_opening_quantity = 0

            filters_common = {
                'Created_at__month': month,
                'Created_at__year': year,
                'Product_Detials_id': grn_instance.Product_Detials.pk
            }

            # Issue calculations
            if StoreLocation:
                
                issue_filter = {
                    **filters_common,
                    'Issue_Status': 'Approved'
                }

                if StoreLocationNurseStation :
                    
                    issue_filter['Indent_Detials__Issue_From_NurseStation_Location__NurseStationid'] = StoreLocation
                else:
                    
                    issue_filter['Indent_Detials__Issue_From_Store_Location__Store_Id'] = StoreLocation

                issue = Indent_issue_items_details_table.objects.filter(**issue_filter).aggregate(
                    total_issue_quantity=Coalesce(Sum('Issue_Quantity'), Value(0))
                )
                total_issue_quantity = float(issue['total_issue_quantity'])
                total_issue_value = total_issue_quantity * cpt

            # Receive calculations
            if StoreLocation:
                
                receive_filter = {
                    'Created_at__month': month,
                    'Created_at__year': year,
                    'Indent_issue_Item__Product_Detials__id': grn_instance.Product_Detials.id
                }
                if StoreLocationNurseStation:
                    
                    receive_filter['Indent_Detials__Indent_issue__Issue_To_NurseStation_Location__NurseStationid'] = StoreLocation
                else:
                    
                    receive_filter['Indent_Detials__Indent_issue__Issue_To_Store_Location__Store_Id'] = StoreLocation
                    

                receive = Indent_receive_items_details_table.objects.filter(**receive_filter).aggregate(
                    total_receive_quantity=Coalesce(Sum('Received_Quantity'), Value(0))
                )
                
                
                total_receive_quantity = float(receive['total_receive_quantity'])
                total_receive_value = total_receive_quantity * cpt

            # Return calculations (Only for store, not Nurse Station)
            
            
            
            if not StoreLocationNurseStation and StoreLocation:
                Return_ins = Purchase_Return_Items_Details_Table.objects.filter(
                    Created_at__month=month,
                    Created_at__year=year,
                    Stock_Detials__Product_Detials_id=grn_instance.Product_Detials.pk
                ).aggregate(
                    total_return_quantity=Coalesce(Sum('Return_Quantity'), Value(0)),
                    return_quantity_Amount=Coalesce(Sum('Return_Quantity_Amount'), Value(0))
                )
                total_return_quantity = float(Return_ins['total_return_quantity'])
                return_quantity_Amount = float(Return_ins['return_quantity_Amount'])

            # Adjustment calculations
            if StoreLocation:

                # Prepare the base filter
                adjust_filter = {
                    'Created_at__month': month,
                    'Created_at__year': year,
                    'Stock_Instance__Product_Detials_id': grn_instance.Product_Detials.pk
                }

                if StoreLocationNurseStation:
                    adjust_filter['Stock_Instance__NurseStation_location__NurseStationid'] = StoreLocation
                else:
                    adjust_filter['Stock_Instance__Store_location__Store_Id'] = StoreLocation

                # Query for 'Less' adjustments
                less_adjustments = StockAdjustment_Item_Details.objects.filter(
                    **adjust_filter,
                    AdjustMode='Less'
                ).aggregate(
                    total_less_quantity=Coalesce(Sum('AdjustQty'), Value(0))
                )

                # Query for 'Add' adjustments
                add_adjustments = StockAdjustment_Item_Details.objects.filter(
                    **adjust_filter,
                    AdjustMode='Add'
                ).aggregate(
                    total_add_quantity=Coalesce(Sum('AdjustQty'), Value(0))
                )

                # Extract quantities
                total_adjust_less_qty = float(less_adjustments['total_less_quantity'])
                total_adjust_add_qty = float(add_adjustments['total_add_quantity'])

                # Calculate total values (assuming 'cpt' is your cost per unit)
                total_adjust_less_value = total_adjust_less_qty * cpt
                total_adjust_add_value = total_adjust_add_qty * cpt

  
            if StoreLocation == 1 and not StoreLocationNurseStation :
            # centarl store
                totalsales_quantity = 0
                totalsales_value = 0
            
            elif StoreLocation and not StoreLocationNurseStation:
                # pharmacy
                ip_billing_ins = IP_BillingItem.objects.filter(
                    Billing__created_at__month=month,
                    Billing__created_at__year=year,
                    ItemId__Product_Detials__pk=grn_instance.Product_Detials.pk,
                    ItemId__Store_location__Store_Id= StoreLocation                 
                ).aggregate(
                    total_ip_sales_quantity=Coalesce(Sum('Billing_Quantity'), Value(0))
                )
                total_ip_sales_quantity = float(ip_billing_ins['total_ip_sales_quantity'])

                op_billing_ins = OP_BillingItem.objects.filter(
                    Billing__created_at__month=month,
                    Billing__created_at__year=year,
                    ItemId__Product_Detials__pk=grn_instance.Product_Detials,
                    ItemId__Store_location__Store_Id= StoreLocation 
                ).aggregate(
                    total_op_sales_quantity=Coalesce(Sum('Billing_Quantity'), Value(0))
                )
                total_op_sales_quantity = float(op_billing_ins['total_op_sales_quantity'])
                
                totalsales_quantity = total_op_sales_quantity + total_ip_sales_quantity
                totalsales_value = totalsales_quantity * cpt
            
            elif StoreLocation and StoreLocationNurseStation:
                # nursestation
                totalsales_quantity = 0
                totalsales_value = 0

            if StoreLocation:
                total_closed_quantity = total_opening_quantity - total_issue_quantity + total_receive_quantity + total_adjust_add_qty - total_adjust_less_qty-total_return_quantity-totalsales_quantity

            
            grn_data = {
                'id': grn_instance.pk,
                'itemcode': grn_instance.Product_Detials.pk,
                'itemname': grn_instance.Product_Detials.ItemName,
                'Tax_Percentage': tax_percentage,
                'Purchase_rate_taxable': purchase_rate_taxable,
                'Total_Received_Quantity': total_received_quantity,
                'gstprice': gst_price,
                'cpt': cpt,
                'Total_Issue_Quantity': total_issue_quantity,
                'Total_Issue_Value': total_issue_value,
                'Total_Receive_Quantity': total_receive_quantity,
                'Total_Receive_Value': total_receive_value,
                'Total_Return_Quantity': total_return_quantity,
                'Total_Return_Value': return_quantity_Amount,
                'Total_Adjust_Less_Qty':total_adjust_less_qty,
                'Total_Adjust_Less_Value':total_adjust_less_value,
                'Total_Adjust_Add_Qty':total_adjust_add_qty,
                'Total_Adjust_Add_Value':total_adjust_add_value,
                'Total_Sales_Quantity': totalsales_quantity,
                'Total_Sales_Value': totalsales_value,
                'month': month,
                'year': year,
                'openingqty': 0,
                'Total_Closing_Qty': total_closed_quantity,
                'usedqty': 0,
                'usedCpt': 0,
                'usedvalue': 0,
                'opening_Cpt': 0,
                'opening_balanceqtyvalue': 0,
            }

            Grn_Data.append(grn_data)

        return JsonResponse(Grn_Data, safe=False, status=200)

    except Exception as e:
        import traceback
        print(traceback.format_exc())  # Optional: better debug output
        return JsonResponse({'error': str(e)}, status=500)





@csrf_exempt
@require_http_methods(["GET"])
def  PurchaseOrder_Report_Details(request):
    if request.method == 'GET':
        try:
            StatusCheck = request.GET.get('StatusCheck')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            SupplierId = request.GET.get('SupplierId')
            BillingLocation = request.GET.get('BillingLocation')
            ShippingLocation = request.GET.get('ShippingLocation')

            

            Purchase_Order_instance = Purchase_Order_Details.objects.all()

            
            if StatusCheck:
                Purchase_Order_instance = Purchase_Order_instance.filter(PO_Status=StatusCheck)
            
            if SupplierId:
                Purchase_Order_instance = Purchase_Order_instance.filter(Supplier_Id=SupplierId)
            
            if BillingLocation:                
                    Purchase_Order_instance = Purchase_Order_instance.filter(Billing_Location__Location_Id=BillingLocation)
            
            if ShippingLocation:                
                    Purchase_Order_instance = Purchase_Order_instance.filter(Shipping_Location__Location_Id=ShippingLocation)
            
            if DateType == 'CurrentDate' and CurrentDate:                
                    Purchase_Order_instance = Purchase_Order_instance.filter(Order_Date=CurrentDate)
            
            if DateType == 'Customize' and FromDate and ToDate:
                Purchase_Order_instance = Purchase_Order_instance.filter(
                    Q(Order_Date__range=[FromDate, ToDate]) | Q(Order_Date__range=[FromDate, ToDate])
            )

            PO_Array = []

            for row in Purchase_Order_instance:
                PO_dic = {
                    'id': row.PurchaseOrder_Number,
                    'SupplierId': row.Supplier_Id.pk,
                    'SupplierName': row.Supplier_Id.Supplier_Name,
                    'SupplierMailId': row.Supplier_Id.Email_Address,
                    'SupplierContactNumber': row.Supplier_Id.Contact_Number,
                    'SupplierContactPerson': row.Supplier_Id.Contact_Person,
                    'OrderDate': row.Order_Date,
                    'DeliveryExpectedDate': row.Delivery_Expected_Date,
                    'BillingLocation': row.Billing_Location.Location_Id if row.Billing_Location else '',
                    'Use_BillingLocation': row.Billing_Location.Location_Name if row.Billing_Location else '',
                    'ShippingLocation': row.Shipping_Location.Location_Id if row.Shipping_Location else '',
                    'Use_ShippingLocation': row.Shipping_Location.Location_Name if row.Shipping_Location else '',
                    'TotalOrderValue': row.Total_Order_Value,
                    'PO_Status': row.PO_Status,

                }
                
                Item_instance = Purchase_Order_Item_Details.objects.filter(PurchaseOrder__PurchaseOrder_Number=row.PurchaseOrder_Number)
                
                Item_Array = []
                for item in Item_instance:
                    # print('1232',item)
                    Get_Rate_Inst = Supplier_Product_Amount_Details.objects.filter(Supplier_detials__Supplier_Detials__pk=row.Supplier_Id.Supplier_Id, Supplier_detials__Product_Detials=item.PO_Item_Detailes.Product_Detials.pk).order_by('-Created_at').first()

                    item_dic = {
                        'id': item.PO_Item_Number,
                        'ItemCode': item.PO_Item_Detailes.Product_Detials.pk,
                        'ItemName': item.PO_Item_Detailes.Product_Detials.ItemName,
                        'ProductCategory_pk': item.PO_Item_Detailes.Product_Detials.ProductCategory.pk,
                        'ProductCategory': item.PO_Item_Detailes.Product_Detials.ProductCategory.ProductCategory_Name,
                        'SubCategory_pk': item.PO_Item_Detailes.Product_Detials.SubCategory.pk if item.PO_Item_Detailes.Product_Detials.SubCategory else '',
                        'SubCategory': item.PO_Item_Detailes.Product_Detials.SubCategory.SubCategoryName if item.PO_Item_Detailes.Product_Detials.SubCategory else '' ,
                    }
                    
                    if item.PO_Item_Detailes.Product_Detials.GenericName :                     
                        item_dic['GenericName_pk'] = item.PO_Item_Detailes.Product_Detials.GenericName.pk
                    if item.PO_Item_Detailes.Product_Detials.GenericName :                     
                        item_dic['GenericName'] = item.PO_Item_Detailes.Product_Detials.GenericName.GenericName
                    if item.PO_Item_Detailes.Product_Detials.CompanyName :
                        item_dic['ManufacturerName_pk'] = item.PO_Item_Detailes.Product_Detials.CompanyName.pk
                    if item.PO_Item_Detailes.Product_Detials.CompanyName :
                        item_dic['ManufacturerName'] = item.PO_Item_Detailes.Product_Detials.CompanyName.CompanyName
                    if item.PO_Item_Detailes.Product_Detials.HSNCode :
                        item_dic['HSNCode'] = item.PO_Item_Detailes.Product_Detials.HSNCode
                    if item.PO_Item_Detailes.Product_Detials.Strength :
                        item_dic['Strength'] = item.PO_Item_Detailes.Product_Detials.Strength
                    if item.PO_Item_Detailes.Product_Detials.StrengthType :
                        item_dic['StrengthType'] = item.PO_Item_Detailes.Product_Detials.StrengthType
                    if item.PO_Item_Detailes.Product_Detials.Volume :
                        item_dic['Volume'] = item.PO_Item_Detailes.Product_Detials.Volume
                    if item.PO_Item_Detailes.Product_Detials.VolumeType :
                        item_dic['VolumeType'] = item.PO_Item_Detailes.Product_Detials.VolumeType.Unit_Name
                    if item.PO_Item_Detailes.Product_Detials.PackType :
                        item_dic['PackType_pk'] = item.PO_Item_Detailes.Product_Detials.PackType.pk                   
                    if item.PO_Item_Detailes.Product_Detials.PackType :
                        item_dic['PackType'] = item.PO_Item_Detailes.Product_Detials.PackType.PackType_Name
                    if item.PO_Item_Detailes.Product_Detials.PackQty :
                        item_dic['PackQty']= item.PO_Item_Detailes.Product_Detials.PackQty
                    if item.PO_Item_Detailes.Product_Detials.Is_Manufacture_Date_Available :
                        item_dic['Is_Manufacture_Date_Available']= item.PO_Item_Detailes.Product_Detials.Is_Manufacture_Date_Available
                    if item.PO_Item_Detailes.Product_Detials.Is_Expiry_Date_Available :
                        item_dic['Is_Expiry_Date_Available']= item.PO_Item_Detailes.Product_Detials.Is_Expiry_Date_Available
                    
                    
                    if item.PO_Item_Detailes.Product_Detials.IsSellable is not None : 
                         item_dic['IsSellable']='Yes' if item.PO_Item_Detailes.Product_Detials.IsSellable else 'No'
                         if item_dic['IsSellable'] == 'Yes':                         
                            item_dic['LeastSellableUnit']=item.PO_Item_Detailes.Product_Detials.LeastSellableUnit

                    
                    item_dic['MRP']= Get_Rate_Inst.MRP
                    item_dic['PurchaseRateBeforeGST']= Get_Rate_Inst.PurchaseRateBeforeGST
                    item_dic['GST']=  Get_Rate_Inst.GST
        
        
        
        
                    item_dic['PurchaseRateAfterGST']=Get_Rate_Inst.PurchaseRateAfterGST
                    
                        
                    item_dic['PurchaseQty']= item.PO_Order_Qty
                    item_dic['TotalAmount'] = item.TotalAmount
                    item_dic['Item_Status']= item.Item_Status
                    item_dic['Reason']= item.Reason                              
                    item_dic['Received_Qty']=item.Received_Qty
                    item_dic['Balance_Qty']=item.Balance_Qty
                    
                    
                    Item_Array.append(item_dic)

                PO_dic['Item_Details'] = Item_Array
                PO_Array.append(PO_dic)

            PO_Array.reverse()

            return JsonResponse(PO_Array, safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


