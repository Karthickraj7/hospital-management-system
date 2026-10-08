from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse,HttpResponse
import json
from .models import *
from datetime import date
from django.db.models import Sum
from Inventory.models import *
from Masters.models import *

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def create_tray_master(request):
    if request.method=='PUT':
        try:
            data = json.loads(request.body)
            data = data.get('data')            
            print('data----',data)

            if data['trayStatus']=='true':
                status=True
            elif data['trayStatus']=='false':
                status=False
            else:
                print('Value NOt Entered...')

            master=Tray_Master.objects.get(trayId=data['Id'])
            tray = Tray_Creation_Details.objects.get(trayId=int(data['tray']))
            master.tray= tray
            master.TrayName= data["trayName"]
            master.TrayCategory= data["trayCategory"]
            master.TrayCreateOn= data["trayCreate"]
            master.TrayExpireOn= data["trayExpire"]
            master.TrayStatus=status
            master.save()

            return HttpResponse('Success...')
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    


    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')            
            print('data----',data)

            if data['trayStatus']=='true':
                status=True
            elif data['trayStatus']=='false':
                status=False
            else:
                print('Value NOt Entered...')


            tray = Tray_Creation_Details.objects.get(trayId=int(data['tray']))
            # product = Product_Master_All_Category_Details.objects.get(ItemName=data["product"])
            trayMaster=Tray_Master.objects.create(
                tray=tray,
                TrayName= data["trayName"],
                TrayCategory= data["trayCategory"],
                TrayCreateOn= data["trayCreate"],
                TrayExpireOn= data["trayExpire"],
                TrayStatus=status
                )
            trayMaster.save()

            return HttpResponse('Success...')
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
    

    if request.method=="GET":
        try:
            master=list(Tray_Master.objects.all().order_by("TrayName").values())

            Data=[]
            for i in master:
                trays=list(Tray_Creation_Details.objects.filter(trayId=i["tray_id"]).values("trayName"))
                tray_name= [tray["trayName"] for tray in trays]
                data={
                    "trayId": i["trayId"],
                    "tray_id": i["tray_id"],
                    "tray_name": tray_name[0],
                    "TrayName": i["TrayName"],
                    "Category": i["TrayCategory"],
                    "CreateOn": i["TrayCreateOn"],
                    "ExpireOn": i["TrayExpireOn"],
                    "Status": i["TrayStatus"]
                }
                Data.append(data)


            return JsonResponse(Data,safe=False)

        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def create_product_master(request):
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')            
            print('data----',data)

            # if data['productStatus']=='true':
            #     status=True
            # elif data['productStatus']=='false':
            #     status=False
            # else:
            #     print('Value NOt Entered...')


            tray = Tray_Master.objects.get(trayId=int(data['tray']))
            product = Product_Master_All_Category_Details.objects.get(ItemName=data["product"])
            trayMaster=Tray_Products_Master.objects.create(
                tray=tray,
                ProductId=product,
                ProductName= data["product"],
                BatchNo=data["batch"],
                )
            trayMaster.save()

            return HttpResponse('Success...')
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
    

    
    if request.method=="PUT":
        try:
            data = json.loads(request.body)
            data = data.get('data')            
            print('data----',data)

            Data={
                "product":[],
                "Batch":[]
            }
            if data["tray"]!="":
                tray=Tray_And_Products.objects.filter(trayId=int(data['tray'])).select_related('trayId', 'ProductId')
                Pdata=[]
                for i in tray:
                    # print(i.ProductId.ItemName,i.productCount)
                    Tproduct={
                        "trayId":i.trayId.trayId,
                        "trayName":i.trayId.trayName,
                        "Status":i.trayId.Status,
                        "productName":i.ProductId.ItemName,
                        "productCount":i.productCount
                    }
                    Pdata.append(Tproduct)
                Data["product"]=Pdata

                # print(data)
                if data["product"]!="":
                    ProductID=Product_Master_All_Category_Details.objects.filter(ItemName=data['product']).values('id').first()
                    store= Inventory_Location_Master_Detials.objects.filter(Store_Id=3)
                    Batch=Stock_Maintance_Table_Detials.objects.filter(Store_location=3,Product_Detials=ProductID['id']).order_by("Batch_No").values('Batch_No')
                    Bdata=[]
                    for i in Batch:
                        # print(i["Batch_No"])
                        Bno={
                            "batch":i["Batch_No"]
                        }
                        Bdata.append(Bno)
                    Data["Batch"]=Bdata

            return JsonResponse(Data,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
        


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def view_product_master(request):
    if request.method=="PUT":
        try:
            data = json.loads(request.body)
            data = data.get('data')    
            # print(data)
            
            if data["trayId"]:
                products=list(Tray_Products_Master.objects.filter(tray=data['trayId']).values("Id","ProductName","BatchNo"))
                
                # print(products)
                return JsonResponse(products,safe=False)
            else:
                return HttpResponse("Tray Not selected...")
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
        
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')    
            print(data)
            
            if data["action"]=="Move":
                tray = Tray_Master.objects.get(trayId=int(data['tray']))
                product = Tray_Products_Master.objects.get(Id=int(data["product"]))
                product.tray=tray
                product.productFrom=data['trayName']
                product.Reason=data['reason']
                product.incharge=data["incharge"]
                product.save()
            if data["action"]=="Trash":
                product = Tray_Products_Master.objects.get(Id=int(data["product"]))
                product.tray= None
                product.Reason=data['reason']
                product.incharge=data["incharge"]
                product.save()

            
            
            return HttpResponse("Moved Successfully...")
            
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    