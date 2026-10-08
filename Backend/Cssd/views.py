from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse,HttpResponse
import json
from .models import *
from datetime import date
from django.db.models import Sum
from Inventory.models import Product_Master_All_Category_Details,Product_Category_Product_Details,SubCategory_Detailes,Stock_Maintance_Table_Detials

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def create_tray_sterlize(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            data = data.get('data')
            
            if data['Status']=='true':
                status=True
            elif data['Status']=='false':
                status=False
            else:
                print('Value NOt Entered...')

            if data['create']=='Tray':
                print(data['sterilize'])
                tray = Tray_Creation_Details.objects.create(trayName=data['trayName'],Status=status)

                for i in data['sterilize']:
                    sterilizeMethods = Sterilize_Creation_Details.objects.filter(SterilizeId=i).first()
                    tray.sterilizeMethod.add(sterilizeMethods)
                
                tray.save()
                return HttpResponse('Success...')

            if data['create']=='Sterilize':
                data=Sterilize_Creation_Details.objects.create(SterilizeName=data['sterilizeName'],Status=status)
                data.save()
                return HttpResponse('Success...')

            else:
                return HttpResponse('Data Mismatching...')


        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
        
    if request.method=='GET':
        try:
            sterilizeData=list(Sterilize_Creation_Details.objects.all().values())
            

            # manyData=[]
            # for i in tray:
            #     many=Sterilize_Creation_Details.objects.filter(SterilizeId=i['sterilizeMethod']).values("SterilizeName")
            #     i["sterilizeMethod"]=list(many)
            #     manyData.append(i)
            #     # print(many)

          


            trays=Tray_Creation_Details.objects.all()
            trayData=[]
            for i in trays:
                    sterilize = ', '.join(str(sterilizeMethods.SterilizeName) for sterilizeMethods in i.sterilizeMethod.all())
                    products = ', '.join(str(product.ItemName) for product in i.productId.all())

                    traydata={
                        "trayId":i.trayId,
                        "trayName":i.trayName,
                        "sterilizeMethod":sterilize,
                        "product":products,
                        "Status":i.Status
                    }
                    trayData.append(traydata)


            data={
                'sterilize':[],
                'tray':[]
            }
            if sterilizeData:
                data['sterilize']=(sterilizeData)
            if trayData:
                data['tray']=(trayData)
            return JsonResponse(data,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})


    if request.method=='PUT':
        try:
            data = json.loads(request.body)
            data = data.get('data')
            
            if data['Status']=='true':
                status=True
            elif data['Status']=='false':
                status=False
            else:
                print('Value NOt Entered...')

            print(data,status)
            if data['create']=='Tray':
                tray = Tray_Creation_Details.objects.get(trayId=data['Id'])
                tray.trayName=data['Name']
                tray.Status=status
                tray.sterilizeMethod.clear()

                for i in data['sterilize']:
                    sterilizeMethods = Sterilize_Creation_Details.objects.filter(SterilizeId=i).first()
                    tray.sterilizeMethod.add(sterilizeMethods)

                tray.save()

                return HttpResponse('Success...')

            if data['create']=='Sterilize':
                tdata=Sterilize_Creation_Details.objects.get(SterilizeId=data['Id'])
                tdata.SterilizeName=data['Name']
                tdata.Status=status
                print(data)
                tdata.save()
                return HttpResponse('Success...')

            # else:
            return HttpResponse('Data Mismatching...')


        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
        


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def select_category(request):
    if request.method=="GET":
        try:
            Category=list(Product_Category_Product_Details.objects.all().values("id","ProductCategory_Name"))

            

            return JsonResponse(Category,safe=False)
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
    
    
    if request.method=="PUT":
        try:
            data = json.loads(request.body)
            data = data.get('data')
            
            subCategory=list(SubCategory_Detailes.objects.filter(ProductCategoryId=data).values("SubCategory_Id","SubCategoryName"))
            # print(data)
            # if data['subcategory']:
            #     products=list(Product_Master_All_Category_Details.objects.filter(ProductCategory_id=int(data['category']),SubCategory_id=int(data['subcategory'])))
            #     print(products)

            
            # print(subCategory)
            return JsonResponse(subCategory,safe=False)
    
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def select_product(request):
    if request.method=="PUT":
        try:
            data = json.loads(request.body)
            data = data.get('data')

            print(data)
            # if data['subcategory']!="" & data['category']!='' :
            products=list(Product_Master_All_Category_Details.objects.filter(ProductCategory_id=int(data['category']),SubCategory_id=int(data['subcategory'])).order_by("ItemName")
                          .values("id","ItemName","GenericName","HSNCode","PackQty","PackType","ProductCategory","SubCategory"))
   
            
    
            return JsonResponse(products,safe=False)
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
        
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')
            print(data['Ptray'],data['category'],data['subcategory'],data['product'],data['Pcount'])

            if (data['Ptray']!='') & (data['product']!=''):
                try:
                    tray = Tray_Creation_Details.objects.get(trayId=int(data['Ptray']))
                    product = Product_Master_All_Category_Details.objects.get(id=int(data["product"]))
                    tray_product = Tray_And_Products.objects.create(
                    trayId=tray,
                    ProductId=product,
                    productCount=data['Pcount']
                    )
                    tray_product.save()
                except Exception as err:
                    print(err)

                tray = Tray_Creation_Details.objects.get(trayId=data['Ptray'])

                product = Product_Master_All_Category_Details.objects.filter(id=int(data['product'])).first()
                tray.productId.add(product)

                tray.save()


            return HttpResponse("Success...")

        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
    
    if request.method=="GET":

        try:

            tray=Tray_And_Products.objects.all().order_by("trayId")
            data=[]
            for i in tray:
                # print(i.ProductId.ItemName,i.productCount)
                Tproduct={
                    "trayId":i.trayId.trayId,
                    "trayName":i.trayId.trayName,
                    "Status":i.trayId.Status,
                    "productName":i.ProductId.ItemName,
                    "productCount":i.productCount
                }
                data.append(Tproduct)

                
            return JsonResponse(data,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    

        