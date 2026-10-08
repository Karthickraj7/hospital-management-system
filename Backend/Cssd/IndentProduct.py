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
def get_store_details(request):
    if request.method=="GET":
        try:
            Location = request.GET.get('Location')
            Store = request.GET.get('store')
            
            if Store=="CSSD":
                store = list(Inventory_Location_Master_Detials.objects.filter( Location_Name=Location,Store_Type=Store).values("Store_Id","Store_Name"))
                return JsonResponse(store,safe=False)
            
            else:
                store = list(Inventory_Location_Master_Detials.objects.filter( Location_Name=Location).values("Store_Id","Store_Name"))
                return JsonResponse(store,safe=False)
            
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})    
    
    if request.method=="POST":
        try:
            data = json.loads(request.body)
            data = data.get('data')
            Raisedata=data["raiseForm"]
            Itemdata=data["allItems"]
            print(Itemdata)
            
            if data["raiseForm"]:
                if Raisedata["RaisedFromLocation"]:
                    from_loc=Location_Detials.objects.get(Location_Id=int(Raisedata["RaisedFromLocation"]))
                    if Raisedata["RaisedFromStore"]:
                        from_store=Inventory_Location_Master_Detials.objects.get(Store_Id=int(Raisedata["RaisedFromStore"]))
                        if Raisedata["RaisedToLocation"]:
                            to_loc=Location_Detials.objects.get(Location_Id=int(Raisedata["RaisedToLocation"]))
                            if Raisedata["RaisedToStore"]:
                                to_store=Inventory_Location_Master_Detials.objects.get(Store_Id=int(Raisedata["RaisedToStore"]))
                                if Raisedata["Created_by"]:
                                    user=Raisedata["Created_by"]
                                    if Raisedata["Reason"]:
                                        reason=Raisedata["Reason"]
                                        current_date_time = datetime.now()
                                        formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')
                                    
                                        raiseDetail=Indent_raise_details_table.objects.create(
                                            Raise_From_Location = from_loc,
                                            Raise_From_Store_Location=from_store,
                                            Raise_To_Location =to_loc,
                                            Raise_To_Store_Location=to_store,
                                            Raise_Date=formatted_date_time,
                                            Raise_by=user,
                                            Raise_Reason =reason
                                        )
                                        print(raiseDetail)
                                        raiseDetail.save() 
                                else:
                                    print("Error data mismatching...")
                                    return JsonResponse({'warn': 'Data Mismatching...'}, status=200)

            if Itemdata:
                for item in Itemdata:
                    if item["id"]:
                        product=Product_Master_All_Category_Details.objects.get(id=item["ItemCode"])
                        if item["RaisedQuantity"]:
                            quantity=item["RaisedQuantity"]
                            if item["Reason"]:
                                reason=item["Reason"]
                                
                                raiseProduct=Indent_raise_items_details_table.objects.create(
                                    Indent_Detials=raiseDetail,
                                    Product_Detials=product,
                                    Raise_Quantity=quantity,
                                    Reason=reason
                                )
                                raiseProduct.save()
                                
            
            return JsonResponse({'success': 'Data saved successfully'}, status=200)
        except Exception as err:
            print(err)
            return JsonResponse({'Error':f"{str(err)}"})   
        
        


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET", "PUT"])
def get_Indent_Request(request):
    if request.method == "GET":
        try:
            data = Indent_issue_details_table.objects.filter(Issue_To_Store_Location_id=3, Issue_Status="Issued").values()
            RaiseData = []
            
            for item in data:
                from_loc = Location_Detials.objects.get(Location_Id=int(item["Issue_From_Location_id"]))
                from_store = Inventory_Location_Master_Detials.objects.get(Store_Id=int(item["Issue_From_Store_Location_id"]))
                to_loc = Location_Detials.objects.get(Location_Id=int(item["Issue_To_Location_id"]))
                to_store = Inventory_Location_Master_Detials.objects.get(Store_Id=int(item["Issue_To_Store_Location_id"]))
                
                items = list(Indent_issue_items_details_table.objects.filter(Indent_Detials=int(item["id"])).values())
                indent_item = []
                
                for i in items:
                    Idetial = Product_Master_All_Category_Details.objects.get(id=int(i["Product_Detials_id"]))
                    stock = Stock_Maintance_Table_Detials.objects.get(id=int(i["stock_Detials_id"]))

                    item_detail = {
                        "item_code": i["Product_Detials_id"],
                        "item_name": Idetial.ItemName,
                        "category": Idetial.ProductCategory.ProductCategory_Name,
                        "subcategory": Idetial.SubCategory.SubCategoryName,
                        "pack_type": str(Idetial.PackType),
                        "pack_qty": Idetial.PackQty,
                        "raise_qty": "",
                        "issue_qty": i["Issue_Quantity"],
                        "pending_qty": "",
                        "stock_id": i["stock_Detials_id"],
                        "serial_no": stock.Batch_No,
                        "recive_status": i["Receive_Status"],
                        "reson": i["Reason"],
                        "remarks": i["Remarks"],
                        "isseu_status": i["Issue_Status"]
                    }
                    indent_item.append(item_detail)

                adata = {
                    "indent_type": item["Indent_Type"],
                    "raise_invoice": item["Indent_raise_id"],
                    "issue_date": item["Issue_Date"],
                    "issue_from_id": item["Issue_From_Location_id"],
                    "issue_from": from_loc.Location_Name,
                    "issue_from_store_id": item["Issue_From_Store_Location_id"],
                    "issue_from_store": from_store.Store_Name,
                    "issue_to_id": item["Issue_To_Location_id"],
                    "issue_to": to_loc.Location_Name,
                    "issue_to_store_id": item["Issue_To_Store_Location_id"],
                    "issue_to_store": to_store.Store_Name,
                    "indent_item": indent_item,
                    "reason": item["Issue_Reason"],
                    "raise_by": "",
                    "issue_by": item["Issue_by"],
                    "issue_status": item["Issue_Status"]
                }
                RaiseData.append(adata)

            return JsonResponse(RaiseData, safe=False)

        except Exception as err:
            print(err)
            return JsonResponse({'Error': f"{str(err)}"})

    if request.method == "POST":
        try:
            data = json.loads(request.body).get('data')
            invoice = data[0]["raise_invoice"]
            user = data[0]["user"]

            if not invoice:
                return JsonResponse({"warn": "Invoice Missing..."}, status=200)

            issue = Indent_issue_details_table.objects.get(Indent_raise_id=int(invoice))

            if all(item.get('recive_status') == 'Completed' for item in data):
                issue.Issue_Status = "Received"
                issue.Receive_Status = "Received"
                issue.save()
                print("Success...")

            current_date_time = datetime.now()
            formatted_date_time = current_date_time.strftime('%Y-%m-%d %H:%M')

            receive = Indent_receive_details_table.objects.create(
                Indent_issue=issue,
                Receive_Date=formatted_date_time,
                Receive_ApprovedDate=formatted_date_time,
                Receive_by=user,
                Receive_Updated_by=user,
                Receive_Approved_by=user,
                Receive_Reason=""
            )
            receive.save()

            for i in data:
                serialNo = []
                damageSerial = []
                pendingSerial = []

                if i['recive_status'] == "Completed":
                    serialNo.append(i["stock_id"])
                elif i['recive_status'] in ["Canceled", "Waiting"]:
                    damageSerial.append(i["stock_id"])

                issueItems = Indent_issue_items_details_table.objects.filter(
                    Product_Detials=int(i["itemCode"]),
                    stock_Detials=int(i["stock_id"])
                )
                
               

                for issueItem in issueItems:
                    # print(issueItems['Receive_Status'])
                    receive_item = Indent_receive_items_details_table.objects.create(
                        Indent_Detials=receive,
                        Indent_issue_Item=issueItem,
                        Received_Quantity=len(serialNo),
                        Damaged_Quantity=len(damageSerial),
                        Pending_Quantity=len(pendingSerial),
                        Status=i["recive_status"],
                        Reason=i["recive_status"] if i["recive_status"] else "Indent Moment",
                        Remarks=""
                    )

                    if serialNo:
                        receive_item.Received_serialNo.add(*serialNo)
                    if damageSerial:
                        receive_item.Damaged_serialNo.add(*damageSerial)
                    if pendingSerial:
                        receive_item.Pending_serialNo.add(*pendingSerial)

                    receive_item.save()

            return JsonResponse({"success": "Data saved successfully"}, status=200)

        except Exception as err:
            print(err)
            return JsonResponse({'Error': f"{str(err)}"})

