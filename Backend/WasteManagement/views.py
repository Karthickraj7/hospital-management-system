from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse,HttpResponse
import json
from .models import *
from datetime import date
from django.db.models import Sum

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def bioWst(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            Waste=data.get("data")
            date=data.get("date")
            print(date)
            for clr in Waste:
                print(Waste[clr])

                if clr=="Red":
                    desc="Contaminated Waste - Recyclable"
                if clr=="Blue":
                    desc="Glass Waste"
                if clr=="Yellow":
                    desc="Infectious & Pathological Waste"

                if Waste:
                    data=wasteManagement.objects.create( wasteCategory='Bio Waste',wasteColor=clr, bagCount=Waste[clr]['BagCount'],weight=Waste[clr]['Weight'],date=date,description=desc)
                    data.save()
                    wstdata=WasteCount.objects.get(wasteCategory='Bio Waste',wasteColor=clr)
                    wstdata.bagcount=wstdata.bagcount+int(Waste[clr]['BagCount'])
                    wstdata.weight=wstdata.weight+int(Waste[clr]['Weight'])
                    wstdata.totalWst=wstdata.totalWst+int(Waste[clr]['Weight'])
                    wstdata.save()        
                    print("data Saved...")

                else:
                    print("No Bio Waste...")

            data=wasteManagement.objects.all()
            # print(data)
            

            return JsonResponse({'success':"yes, success"})
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})
    

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def genrelWst(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            Waste=data.get("data")
            date=data.get("date")
            print(date,Waste)


            
            data=wasteManagement.objects.create( wasteCategory='Genrel Waste',wasteColor='Green', bagCount=Waste['BagCount'],weight=Waste['Weight'],date=date,description="General Non-Infectious Waste")
            data.save()
            wstdata=WasteCount.objects.get(wasteCategory='Genrel Waste',wasteColor="Green")
            wstdata.bagcount=wstdata.bagcount+int(Waste['BagCount'])
            wstdata.weight=wstdata.weight+int(Waste['Weight'])
            wstdata.totalWst=wstdata.totalWst+int(Waste['Weight'])
            wstdata.save()
            print("data Saved...")

            data=wasteManagement.objects.all()
            print(data)
            

            return JsonResponse({'success':"yes, success"})
        except Exception as err:
            return JsonResponse({'Error':f"{str(err)}"})
        


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def eWst(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            Waste=data.get("data")
            date=data.get("date")
            print(date,Waste)


            
            data=wasteManagement.objects.create( wasteCategory='E Waste',wasteColor='Black',bagCount=Waste['BagCount'],weight=Waste['Weight'],date=date,description="discarded electronic devices or equipment")
            data.save()
            wstdata=WasteCount.objects.get(wasteCategory='E Waste',wasteColor="Black")
            wstdata.bagcount=wstdata.bagcount+int(Waste['BagCount'])
            wstdata.weight=wstdata.weight+int(Waste['Weight'])
            wstdata.totalWst=wstdata.totalWst+int(Waste['Weight'])
            wstdata.save()
            print("data Saved...")

            data=wasteManagement.objects.all()
            print(data)
            

            return JsonResponse({'success':"yes, success"})
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})
        

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def wastelist(request):
        try:
            data=list(wasteManagement.objects.all().order_by('-date').values())
            return JsonResponse(data,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})
        

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def totalWaste(request):
        try:
             # data=WasteCount.objects.create(wasteCategory="Bio Waste",wasteColor="Red",weight=0,totalWst=0)
            # data=WasteCount.objects.create(wasteCategory="Bio Waste",wasteColor="Yellow",weight=0,totalWst=0)
            # data=WasteCount.objects.create(wasteCategory="Bio Waste",wasteColor="Blue",weight=0,totalWst=0)
            # data=WasteCount.objects.create(wasteCategory="Genrel Waste",wasteColor="Green",weight=0,totalWst=0)
            # data=WasteCount.objects.create(wasteCategory="E Waste",wasteColor="Black",weight=0,totalWst=0)
            # data.save()
 
            data=list(WasteCount.objects.all().values())
            # print(data[2]['wasteColor'])
            total_weight = WasteCount.objects.aggregate(total_weight=Sum('weight'))
            # print(total_weight['total_weight'])
            # print(data[0]['bagcount']+data[1]['bagcount']+data[2]['bagcount']+data[3]['bagcount']+data[4]['bagcount'])
            # print(data[0]['weight']+data[1]['weight']+data[2]['weight']+data[3]['weight']+data[4]['weight'])

            # print(data[0]['bagcount'])
            wstDetails={
               "red":{'bagcount':data[0]['bagcount'],'weight':data[0]['weight']},
               "yellow":{'bagcount':data[1]['bagcount'],'weight':data[1]['weight']},
               "blue":{'bagcount':data[2]['bagcount'],'weight':data[2]['weight']},
               "green":{'bagcount':data[3]['bagcount'],'weight':data[0]['weight']},
               "black":{'bagcount':data[4]['bagcount'],'weight':data[4]['weight']},
               " total":total_weight['total_weight'],
               "date":data[0]['date']
            }



            return JsonResponse(wstDetails,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def handle(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            Waste = data.get("data")

            if not Waste:
                return JsonResponse({'Error': "Missing required 'data' field."}, status=400)

            waste_records = list(WasteCount.objects.all().values())  # Fetch all waste records
            
            if not waste_records:
                return JsonResponse({'Error': "No waste records found."}, status=404)

            for record in waste_records:
                waste_category = record['wasteCategory']
                waste_color = record['wasteColor']
                bag_count = int(record.get('bagcount', 0))  # Avoid NoneType errors
                weight = int(record.get('weight', 0))

                # Ensure all required fields are present in Waste
                if "Collector" not in Waste or "CollectorContact" not in Waste or "Incharge" not in Waste:
                    return JsonResponse({'Error': "Some required fields are missing in the request data."}, status=400)

                # Create new handOver entry
                new_entry = handOver.objects.create(
                    wasteCategory=waste_category,
                    wasteColor=waste_color,
                    bagcount=bag_count,
                    weight=weight,
                    collecter=Waste['Collector'],
                    collecterCnt=Waste['CollectorContact'],
                    incharge=Waste['Incharge']
                )
                new_entry.save()

                # Update WasteCount table
                try:
                    waste_data = WasteCount.objects.get(wasteCategory=waste_category, wasteColor=waste_color)
                    waste_data.bagcount = max(0, waste_data.bagcount - bag_count)
                    waste_data.weight = max(0, waste_data.weight - weight)
                    waste_data.totalWst = max(0, waste_data.totalWst - weight)
                    waste_data.save()
                except WasteCount.DoesNotExist:
                    return JsonResponse({'Error': f"Waste data not found for {waste_category}, {waste_color}"}, status=404)

            return JsonResponse({'success': "Data successfully saved."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'Error': "Invalid JSON format."}, status=400)
        except Exception as err:
            return JsonResponse({'Error': f"{str(err)}"}, status=500)
        


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def handoverlist(request):
        try:
            data=list(handOver.objects.all().order_by("-date").values())
            return JsonResponse(data,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})
        


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def wastcompany(request):
    if request.method=="GET":
        try:
            data=list(Waste_Collecting_Company.objects.all().values())
            return JsonResponse(data,safe=False)
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})
        
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            company=data.get("data")
            print(company)

            if company['Status']=="true":
                status=True
            elif company['Status']=="false":
                status=False

            data=Waste_Collecting_Company.objects.create(
                companyName=company['ComName'],companyAddress=company['ComAddress'],
                companyPhone=company['ComPhone'],contract_start=company['contStart'],
                contract_end=company['contEnd'],bioRed=company['priceRed'],
                status=status,bioYellow=company['priceYellow'],
                bioBlue=company['priceBlue'],genrel=company['priceGenrel'],EWst=company['priceE'])
            data.save()
            print('Data Saved...')
            return JsonResponse({'success':"yes, success"})


        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})
        
    if request.method=='PUT':
        try:
            data = json.loads(request.body)
            company=data.get("data")
            print(company)

            return JsonResponse({'success':"yes, success"})
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})