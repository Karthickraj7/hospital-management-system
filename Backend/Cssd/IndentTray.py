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
def indent_tray(request):
    if request.method=="GET":
        try:
            Location = request.GET.get('Location')
            From = request.GET.get('From')
            TrayType=request.GET.get('trayType')
            TrayID=request.GET.get('TrayID')
            # print(Location,From,TrayType,TrayID)
            Data={
                "FromData":[],
                "TrayData":[],
                "Product":[],
                "RaiseData":[],
                "ReciveData":[]
            }
            
            
            # ----------------------Indent__Raise__Data-------------------------------------------------------------
            Raise=list(Tray_Indent_Raise_Details.objects.filter(Status="Raised").order_by("-Raise_Date").values())
            R=Tray_Indent_Raise_Details.objects.all()
            # print(Raise)
            Raised=[]
            for item,i in zip(Raise,R):
                From_Loc = Location_Detials.objects.get(Location_Id=item["Raise_From_Location_id"])
                To_Loc = Location_Detials.objects.get(Location_Id=item["Raise_To_Location_id"])
                if item["Raise_From_NurseStation_Location_id"]:
                    From_Ns = NurseStationMaster.objects.get(NurseStationid=item["Raise_From_NurseStation_Location_id"])
                else:
                    From_Ns=None
                if item["Raise_From_OT_Location_id"]:
                    From_OT = OtTheaterMaster_Detials.objects.get( Ot_Id = item["Raise_From_OT_Location_id"])
                else:
                    From_OT=None
                
                TrayId= list({"TrayId":str(Tray.trayId),"TrayName":str(Tray.TrayName)} for Tray in i.Raise_Tray.all())
                TrayName = ', '.join(str(Tray.TrayName) for Tray in i.Raise_Tray.all())

                
                raiseData={
                    "raiseId":item["raiseId"],
                    "Raise_From_Location_id":item["Raise_From_Location_id"],
                    "Raise_From_Location_Name":From_Loc.Location_Name,
                    "Raise_From_NurseStation_Location_id":item["Raise_From_NurseStation_Location_id"],
                    "Raise_From_NurseStation_Location_Name": From_Ns.NurseStationName if From_Ns else None,
                    "Raise_From_OT_Location_id":item["Raise_From_OT_Location_id"],
                    "Raise_From_OT_Location_Name": From_OT.TheatreName  if From_OT else None,
                    "Raise_To_Location_id":item["Raise_To_Location_id"],
                    "Raise_To_Location_Name": To_Loc.Location_Name,
                    "Raise_To_Department":item["Raise_To_Department"],
                    "Raise_Tray_Id":TrayId,
                    "Raise_Tray_Name":TrayName,
                    "Status":item["Status"],
                    "Raise_Date":item["Raise_Date"],
                    "created_by":item["created_by"],
                    "updated_by":item["updated_by"],
                    "created_at":item["created_at"],
                    "updated_at":item["updated_at"],
                }
                Raised.append(raiseData)
            # print(Raised)
            Data["RaiseData"]=Raised
            
            
            # ----------------------Indent__Recive__Data-------------------------------------------------------------
            Recive=list(Tray_Indent_Raise_Details.objects.filter(Status="Issued").order_by("-Raise_Date").values())
            R=Tray_Indent_Raise_Details.objects.all()
            # print(Recive)
            Recvied=[]
            for item,i in zip(Recive,R):
                From_Loc = Location_Detials.objects.get(Location_Id=item["Raise_From_Location_id"])
                To_Loc = Location_Detials.objects.get(Location_Id=item["Raise_To_Location_id"])
                if item["Raise_From_NurseStation_Location_id"]:
                    From_Ns = NurseStationMaster.objects.get(NurseStationid=item["Raise_From_NurseStation_Location_id"])
                else:
                    From_Ns=None
                if item["Raise_From_OT_Location_id"]:
                    From_OT = OtTheaterMaster_Detials.objects.get( Ot_Id = item["Raise_From_OT_Location_id"])
                else:
                    From_OT=None
                
                TrayId= list({"TrayId":str(Tray.trayId),"TrayName":str(Tray.TrayName)} for Tray in i.Raise_Tray.all())
                TrayName = ', '.join(str(Tray.TrayName) for Tray in i.Raise_Tray.all())

                
                reciveData={
                    "raiseId":item["raiseId"],
                    "Raise_From_Location_id":item["Raise_From_Location_id"],
                    "Raise_From_Location_Name":From_Loc.Location_Name,
                    "Raise_From_NurseStation_Location_id":item["Raise_From_NurseStation_Location_id"],
                    "Raise_From_NurseStation_Location_Name": From_Ns.NurseStationName if From_Ns else None,
                    "Raise_From_OT_Location_id":item["Raise_From_OT_Location_id"],
                    "Raise_From_OT_Location_Name": From_OT.TheatreName  if From_OT else None,
                    "Raise_To_Location_id":item["Raise_To_Location_id"],
                    "Raise_To_Location_Name": To_Loc.Location_Name,
                    "Raise_To_Department":item["Raise_To_Department"],
                    "Raise_Tray_Id":TrayId,
                    "Raise_Tray_Name":TrayName,
                    "Status":item["Status"],
                    "Raise_Date":item["Raise_Date"],
                    "created_by":item["created_by"],
                    "updated_by":item["updated_by"],
                    "created_at":item["created_at"],
                    "updated_at":item["updated_at"],
                }
                Recvied.append(reciveData)
            # print(Recvied)
            Data["ReciveData"]=Recvied
            

            
            
            
            if From =="nurseStation":
                fromData = list(NurseStationMaster.objects.filter(Location_Name=Location).values("NurseStationid","NurseStationName"))
                for item in fromData:
                    froms={
                        "Id":item["NurseStationid"],
                        "Name":item["NurseStationName"]
                    }
                    Data["FromData"].append(froms)
            if From =="OT":
                fromData = list(OtTheaterMaster_Detials.objects.filter(Location=Location).values("Ot_Id","TheatreName"))
                for item in fromData:
                    froms={
                        "Id":item["Ot_Id"],
                        "Name":item["TheatreName"]
                    }
                    Data["FromData"].append(froms)
            # else:
            #     print("Nothing..............................")
            Tray=[]
            if TrayType:
                Tray=list(Tray_Master.objects.filter(trayId=TrayType).values())

            Data["TrayData"]=Tray
            
            Product=[]
            if TrayID:
                Product=list(Tray_Products_Master.objects.filter(tray=TrayID).values())

            Data["Product"]=Product
            
            
           
            return JsonResponse(Data,safe=False)

            
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"}) 
        
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')    
            # print(data)
            
            if data["raiseFrom"] =="nurseStation":
                raiseNS= NurseStationMaster.objects.get(NurseStationid=int(data["raiseFromPlace"]))
                raiseOT=None
            if data["raiseFrom"] =="OT":
                raiseOT=OtTheaterMaster_Detials.objects.get(Ot_Id=int(data["raiseFromPlace"]))
                raiseNS=None
                
            if data['raiseFromLocation']:
                From_Location_ins=Location_Detials.objects.get(Location_Id=int(data["raiseFromLocation"]))
                if data["raiseToLocation"]:
                    To_Location_ins=Location_Detials.objects.get(Location_Id=int(data["raiseToLocation"]))
                    
            raised=Tray_Indent_Raise_Details.objects.create(
                Raise_From_Location = From_Location_ins,
                Raise_From_NurseStation_Location= raiseNS,
                Raise_From_OT_Location=raiseOT,
                Raise_To_Location=To_Location_ins,
                Raise_To_Department=data["raiseToCssd"],
                Status=data["status"],
                Raise_Date=data["raiseDate"],
               created_by=data.get("Created_by", ""), 
                updated_by=""
            )
            
            if len(data["Tray"])>0:
                for item in data["Tray"]:
                    raised.Raise_Tray.add(item["TrayId"])
            
            raised.save()
            
            R=Tray_Indent_Raise_Details.objects.all()
            for i in R:
                TrayId= list({"TrayId":str(Tray.trayId),"TrayName":str(Tray.TrayName)} for Tray in i.Raise_Tray.all())
            if len(TrayId)>0:
                for i in TrayId:  
                    RTray=Tray_Master.objects.get(trayId=i["TrayId"])  
                    raiseItem=Tray_Indent_Raise_Item_Status.objects.create(
                        raiseId=raised,
                        raiseTray =RTray
                    )
                    raiseItem.save()
                
            print("Data Saved...")
            return JsonResponse({"success":"Ok..."})
        
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"}) 
        
    if request.method=="PUT":
        try:
            data = json.loads(request.body)
            data = data.get('data')    
            print(data)
            
            IssueData=data["issueData"]
            IssueTray=data["issueTray"]
            
            issue=Tray_Indent_Raise_Details.objects.get(raiseId=IssueData["raiseId"])
            issue.Status="Issued"
            issue.save()
            for i in IssueTray:
                issueItem=Tray_Indent_Raise_Item_Status.objects.get(raiseTray=int(i["TrayId"]))
                issueItem.trayStatus=i["Status"]
                issueItem.save()

                print("Ok-----------",i)
            return JsonResponse({"success":"Ok..."})
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"}) 
        
        
        
        
        
        
        
        
        
        
        
        
        
@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET","PUT"])
def indent_recive(request):
    if request.method=="GET":
        try:
            recived=list(Tray_Indent_Recive_Details.objects.filter().values())
            for i in recived:
                ins=Tray_Indent_Recive_Details.objects.get(reciveId=i["reciveId"])
                location=list(Tray_Indent_Recive_Item_Status.objects.filter(reciveId=ins).values())
                for i in location:

                    if i["Tray_From_OT_Location_id"]:
                        loc=OtTheaterMaster_Detials.objects.get(Ot_Id=i["Tray_From_OT_Location_id"])
                        print(loc.TheatreName)
                    if i["Tray_From_NurseStation_Location_id"]:
                        loc=NurseStationMaster.objects.get(NurseStationid=i["Tray_From_NurseStation_Location_id"])
                        print(loc.NurseStationName)
            return JsonResponse(recived,safe=False) 
        
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"}) 
        
    
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')    
            print(data)
            Recived = data["recived"]
            RecivedTray = data["recivedTray"]
            reciveOT = None
            reciveNS = None
            if Recived.get("Raise_From_OT_Location_id"):
                reciveOT = OtTheaterMaster_Detials.objects.get(Ot_Id=Recived["Raise_From_OT_Location_id"])
            if Recived.get("Raise_From_NurseStation_Location_id"):
                reciveNS = NurseStationMaster.objects.get(NurseStationid=Recived["Raise_From_NurseStation_Location_id"])
            From_Location_ins = Location_Detials.objects.get(Location_Id=Recived["Raise_From_Location_id"])
            To_Location_ins = Location_Detials.objects.get(Location_Id=Recived["Raise_To_Location_id"])
            recived = Tray_Indent_Recive_Details.objects.create(
                Recive_From_Location=From_Location_ins,
                Recive_From_NurseStation_Location=reciveNS,
                Recive_From_OT_Location=reciveOT,
                Recive_To_Location=To_Location_ins,
                Recive_To_Department=Recived["Raise_To_Department"],
                created_by=Recived.get("created_by", ""), 
                updated_by=""
            )
            
            if len(Recived["Raise_Tray_Id"]) > 0:
                for item in Recived["Raise_Tray_Id"]:
                    recived.Recive_Tray.add(item["TrayId"])
            recived.save()
            
            
            R = Tray_Indent_Recive_Details.objects.all()

            for i in R:
                TrayId = [{"TrayId": str(Tray.trayId), "TrayName": str(Tray.TrayName)} for Tray in i.Recive_Tray.all()]
            
            if len(TrayId) > 0:
                for i, j in zip(TrayId, RecivedTray):  
                    if j["Status"] == "Returned":
                        RTray = Tray_Master.objects.get(trayId=i["TrayId"])  
                        reciveItem = Tray_Indent_Recive_Item_Status.objects.create(
                            reciveId=recived,
                            reciveTray=RTray,
                            trayStatus="Returned",
                            reason=j["Reason"],
                            trayLocation=From_Location_ins,
                            Tray_From_OT_Location=reciveOT,
                            Tray_From_NurseStation_Location=reciveNS,
                        )
                        reciveItem.save()
                        returned=Tray_Indent_Recive_Details.objects.get(reciveId=recived.reciveId)
                        returned.Status="Returned"
                        returned.save()
                    if j["Status"] == "Recived":
                        RTray = Tray_Master.objects.get(trayId=i["TrayId"])  
                        reciveItem = Tray_Indent_Recive_Item_Status.objects.create(
                            reciveId=recived,
                            reciveTray=RTray,
                            trayStatus="Recived",
                            trayLocation=From_Location_ins,
                            Tray_From_OT_Location=reciveOT,
                            Tray_From_NurseStation_Location=reciveNS,
                        )
                        reciveItem.save()
            print("Data Saved...")
            return JsonResponse({"success": "Ok..."})
        
        
        except Exception as err:
            print(f"Error: {err}")
            return JsonResponse({'Error': str(err)})
                    
                    
                    
                    
        
        
        
        
        
        
        
        
        
          # raiseItem=Tray_Indent_Raise_Item_Status.objects.get(raiseTray=i["TrayId"])
                    # raiseItem.trayLocation=From_Location_ins,
                    # raiseItem.Tray_From_OT_Location = reciveOT,
                    # raiseItem.Tray_From_NurseStation_Location=reciveNS,
                    # raiseItem.trayStatus="Recived"
                    # raiseItem.save()
                