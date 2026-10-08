from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from Masters.models import *
import pandas as pd
from Inventory.models import *
from django.db.models import Func, Value,Q
from Inventory.models import *
from django.db.models import Func, Value


# -----------------------------------------------------------------------------------



@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Rack_Detials_link(request):
    if request.method == 'POST':
         try:
            data=json.loads(request.body)
            # print("data",data)

            RackID=data.get("RackID",'')
            RackName=data.get('RackName')
            Location=data.get('Location')
            StoreLocation=data.get('StoreLocation')
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit',False)
            
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
            if StoreLocation:
                Inventory_Location = Inventory_Location_Master_Detials.objects.get(Store_Id = StoreLocation)
            
            if RackID:
                if Statusedit:
                    Rack_instance = Rack_Master_Detials.objects.get(pk=RackID)
                    Rack_instance.Status = not Rack_instance.Status
                    Rack_instance.save()
                    
                    return JsonResponse({'success': 'Rack Detials Updated successfully'})
                    

                else:
                    if not RackName  or not Location or not StoreLocation:
                        return JsonResponse({'warn': 'RackName , Location and StoreLocation are mandatory fields'})
                
                    if Rack_Master_Detials.objects.filter(Rack_Name=RackName).exclude(pk=RackID).exists():

                        return JsonResponse ({'warn':f"The Rack Detials are already present in the name of {RackName}"})


                    else:
                        Rack_instance=Rack_Master_Detials.objects.get(pk=RackID)
                        Rack_instance.Rack_Name=RackName
                        Rack_instance.Store_Location_Name=Inventory_Location
                        Rack_instance.Location_Name=Location_instance
                        Rack_instance.save()

                        return JsonResponse({'success': 'Rack Detials Updated successfully'})
            
            else:
                if not RackName  or not Location or not StoreLocation:
                    return JsonResponse({'warn': 'RackName , Location and StoreLocation are mandatory fields'})

                if Rack_Master_Detials.objects.filter(Rack_Name=RackName, Location_Name=Location_instance,Store_Location_Name=Inventory_Location).exists():
                    return JsonResponse({'warn': f"The Rack Detials are already present in the name of {RackName},{Inventory_Location.Store_Name} and {Location_instance.Location_Name} "})
                else:
                    Rack_instance=Rack_Master_Detials(
                        Rack_Name=RackName,
                        Location_Name=Location_instance,
                        Store_Location_Name=Inventory_Location,
                        created_by=created_by
                    )
                    Rack_instance.save()
                    return JsonResponse ({'success': 'Rack Detials added successfully'})


         except Exception as e :
             print(f"An error occurred: {str(e)}")
             return JsonResponse ({'error':'An internal server error occurred'},status=500)

    elif request.method == 'GET':
        try:
            SearchLocation=request.GET.get('SearchLocation')
            StoreLocation=request.GET.get('StoreLocation')

            Rack_Master=Rack_Master_Detials.objects.all()

            if SearchLocation:
                Rack_Master=Rack_Master.filter(Location_Name__Location_Id=SearchLocation)
            
            if StoreLocation:
                Rack_Master=Rack_Master.filter(Store_Location_Name__Store_Id=StoreLocation)

            Rack_Master_Array = []

            for row in Rack_Master :
                Rack_Master_dic={
                    "id":row.Rack_Id,
                    "RackName":row.Rack_Name,
                    "Location":row.Location_Name.Location_Name,
                    'Location_Id': row.Location_Name.Location_Id,                    
                    "Store_Location":row.Store_Location_Name.Store_Name,
                    'Store_Location_Id': row.Store_Location_Name.Store_Id,
                    "Status":row.Status,
                }
                
                Rack_Master_Array.append(Rack_Master_dic)
            
            return JsonResponse (Rack_Master_Array,safe=False)

        except Exception as e :
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)    


# -----------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Shelf_Detials_link(request):
    if request.method=='POST':
        try:
            data = json.loads(request.body)
            # print("data",data)
            ShelfID=data.get('ShelfID','')
            RackName=data.get('RackName')
            ShelfName=data.get('ShelfName')
            created_by=data.get('created_by')
            Location=data.get('Location')
            Statusedit=data.get('Statusedit',False)
            StoreLocation=data.get('StoreLocation')

            print(ShelfID,Statusedit,'===')


            
            if RackName :
                RackDetials_Instance=Rack_Master_Detials.objects.get(pk=RackName)

            if ShelfID:
                if Statusedit:
                    Shelf_instance=Shelf_Master_Detials.objects.get(pk=ShelfID)
                    Shelf_instance.Status=not Shelf_instance.Status
                    Shelf_instance.save()

                    return JsonResponse({'success': 'Shelf Detials Updated successfully'})
                
                else:
                  
                  if not RackName or not ShelfName or not StoreLocation or not Location:
                        return JsonResponse({'warn': 'RackName, ShelfName, StoreLocation and Location are mandatory fields'})
                  if Shelf_Master_Detials.objects.filter(Shelf_Name=ShelfName).exclude(pk=ShelfID).exists():
                        return JsonResponse ({'warn':f"The Shelf Detials are already present in the name of {RackName} and {ShelfName} "})
                  else:
                      Shelf_instance=Shelf_Master_Detials.objects.get(pk=ShelfID)
                      Shelf_instance.Shelf_Name=ShelfName
                      Shelf_instance.Rack_Name=RackDetials_Instance
                      Shelf_instance.save()
                  
                      return JsonResponse({'success': 'Shelf Detials Updated successfully'})


                
            else:
                if not RackName or not ShelfName or not StoreLocation or not Location:
                    return JsonResponse({'warn': 'RackName, ShelfName, StoreLocation and Location are mandatory fields'})

                if Shelf_Master_Detials.objects.filter(Shelf_Name=ShelfName,Rack_Name__Rack_Id=RackName,Rack_Name__Location_Name__Location_Id=Location,Rack_Name__Store_Location_Name__Store_Id=StoreLocation).exists():
                    return JsonResponse({'warn': f"The Shelf Detials are already present in the name of {ShelfName} and {RackName} "})
                else:
                    Shelf_instance=Shelf_Master_Detials(
                        Shelf_Name=ShelfName,
                        Rack_Name=RackDetials_Instance,
                        created_by=created_by

                    )
                    Shelf_instance.save()
                    
                    return JsonResponse ({'success':'Shelf Detials Added Successfully'})


        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error Occurred'},status=500)
    elif request.method == "GET":
        try:
            SearchLocation=request.GET.get('SearchLocation')
            StoreLocation=request.GET.get('StoreLocation')
            RackName=request.GET.get('RackName')


            Shelf_Master=Shelf_Master_Detials.objects.all()

            if SearchLocation:
                Shelf_Master=Shelf_Master.filter(Rack_Name__Location_Name__Location_Id=SearchLocation)
            
            if StoreLocation:
                Shelf_Master=Shelf_Master.filter(Rack_Name__Store_Location_Name__Store_Id=StoreLocation)
            
            if RackName:
                Shelf_Master=Shelf_Master.filter(Rack_Name__Rack_Id=RackName)

            shelf_Master_Array =[]

            for row in Shelf_Master:
                Shelf_dict={
                    'id':row.Shelf_Id,
                    'Shelf_Name':row.Shelf_Name,
                    'Rack_Name':row.Rack_Name.Rack_Name,
                    'Rack_Id':row.Rack_Name.Rack_Id,
                    'Location_Name':row.Rack_Name.Location_Name.Location_Name,
                    'Location_Id':row.Rack_Name.Location_Name.Location_Id,                    
                    'Store_Location':row.Rack_Name.Store_Location_Name.Store_Name,
                    'Store_Location_Id':row.Rack_Name.Store_Location_Name.Store_Id,
                    "Status":row.Status,
                }
                shelf_Master_Array.append(Shelf_dict)
            
            return JsonResponse (shelf_Master_Array,safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error': 'An internal server error occurred'}, status=500)



# -----------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Tray_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)

            TrayID = data.get("TrayID", '')
            RackName = data.get("RackName")
            ShelfName = data.get("ShelfName")
            TrayName = data.get("TrayName")
            Location = data.get('Location')
            StoreLocation = data.get('StoreLocation')
            created_by = data.get('created_by')
            Statusedit=data.get('Statusedit',False)

            if ShelfName:
                Shelf_instance = Shelf_Master_Detials.objects.get(pk=ShelfName)


            if TrayID:
                if Statusedit:
                    Tray_instance=Tray_Master_Details.objects.get(pk=TrayID)
                    Tray_instance.Status=  not Tray_instance.Status
                    Tray_instance.save()
                    
                    return JsonResponse({'success': 'Tray Detials Updated successfully'})

                else:
                    if not RackName or not ShelfName or not TrayName or not Location or not StoreLocation:
                        return JsonResponse({'warn': 'RackName, ShelfName, TrayName, StoreLocation and Location are mandatory fields'})
                    if Tray_Master_Details.objects.filter(Tray_Name=TrayName).exclude(pk=TrayID).exists():
                        return JsonResponse ({'warn':f"The Tray Detials are already present in the name of {TrayName} "})
                    else:
                        Tray_instance=Tray_Master_Details.objects.get(pk=TrayID)
                        Tray_instance.Tray_Name=TrayName
                        Tray_instance.Shelf_Name=Shelf_instance                   
                        Tray_instance.created_by=created_by
                        Tray_instance.save()

                    return JsonResponse({'success': 'Tray Detials Updated successfully'})
            
            else:       
                if not RackName or not ShelfName or not TrayName or not Location:
                    return JsonResponse({'warn': 'RackName, ShelfName, TrayName, and Location are mandatory fields'})
                if Tray_Master_Details.objects.filter(Tray_Name=TrayName).exists():
                        return JsonResponse ({'warn':f"The Tray Detials are already present in the name of {TrayName} "})
                
                if Tray_Master_Details.objects.filter(
                    Tray_Name=TrayName,
                    Shelf_Name__Shelf_Id=ShelfName,
                    Shelf_Name__Rack_Name__Rack_Id=RackName,
                    Shelf_Name__Rack_Name__Location_Name__Location_Id=Location
                ).exists():
                    return JsonResponse({
                        'warn': f"The Tray Detials are already present in the name of {ShelfName},{RackName} and {TrayName}"
                    })

                Tray_instance = Tray_Master_Details(
                    Tray_Name=TrayName,
                    Shelf_Name=Shelf_instance,
                    created_by=created_by
                )
                Tray_instance.save()

                return JsonResponse({'success': 'Tray details saved successfully'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == "GET":
        try:
            SearchLocation=request.GET.get('SearchLocation')
            StoreLocation=request.GET.get('StoreLocation')
            RackName=request.GET.get('RackName')
            ShelfName=request.GET.get('ShelfName')
            Statuschek=request.GET.get('Statuschek')
            # BookingStatus=request.GET.get('BookingStatus')


            # print('ShelfName',ShelfName)

            Tray_Master=Tray_Master_Details.objects.all()

            if SearchLocation:
                Tray_Master=Tray_Master.filter(Shelf_Name__Rack_Name__Location_Name__Location_Id=SearchLocation)
            
            if StoreLocation:
                Tray_Master=Tray_Master.filter(Shelf_Name__Rack_Name__Store_Location_Name__Store_Id=StoreLocation)
            
            if RackName:
                Tray_Master=Tray_Master.filter(Shelf_Name__Rack_Name__Rack_Id=RackName)
            
            if ShelfName:
                Tray_Master=Tray_Master.filter(Shelf_Name__Shelf_Id=ShelfName)
            
            if Statuschek:
                Tray_Master=Tray_Master.filter(Status=True)
            
            # if BookingStatus:
            #     Tray_Master=Tray_Master.filter(Booking_Status=BookingStatus)


            Tray_Master_Array =[]

            for row in Tray_Master:
                Tray_dict={
                    'id':row.Tray_Id,
                    'Tray_Name':row.Tray_Name,
                    'Shelf_Id':row.Shelf_Name.Shelf_Id,
                    'Shelf_Name':row.Shelf_Name.Shelf_Name,
                    'Rack_Name':row.Shelf_Name.Rack_Name.Rack_Name,
                    'Rack_Id':row.Shelf_Name.Rack_Name.Rack_Id,
                    'Store_Location':row.Shelf_Name.Rack_Name.Store_Location_Name.Store_Name,
                    'Store_Location_Id':row.Shelf_Name.Rack_Name.Store_Location_Name.Store_Id,
                    'Location_Name':row.Shelf_Name.Rack_Name.Location_Name.Location_Name,
                    'Location_Id':row.Shelf_Name.Rack_Name.Location_Name.Location_Id,
                    "Status":row.Status,
                    # 'BookingStatus':row.Booking_Status
                }
                Tray_Master_Array.append(Tray_dict)
            
            return JsonResponse (Tray_Master_Array,safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error': 'An internal server error occurred'}, status=500)


# ==============================TrayManagement===============================

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS"])
# def Difine_Tray_For_Products(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
 
#             print(data,'kkkkk')
 
#             Rack_ID= data.get('RackName')
#             Shelf_ID= data.get('ShelfName')
#             Tray_ID = data.get('TrayName')
#             ItemCode = data.get('ItemCode')
#             created_by = data.get('created_by')            
#             StoreLocation = data.get('StoreLocation')
 
#             print(Rack_ID,'kkkkk-aaa',Shelf_ID,'kkkkk-bbb',Tray_ID)
 
 
#             ItemConfirmed = data.get('ItemConfirmed')
#             TrayManagementId=data.get('TrayManagementId')
 
#             print('vvvvvv',ItemConfirmed,'------',TrayManagementId)
 
#             if not Rack_ID:
#                 return JsonResponse({'warn': 'RackName is a mandatory field'}, status=400)
#             else:                
#                 Rack_Master_instance = Rack_Master_Detials.objects.get(pk=Rack_ID)
           
#             Shelf_Master_instance=None
#             Tray_Master_instance=None
#             existing_tray_management=None
 
#             if Shelf_ID:
#                 Shelf_Master_instance = Shelf_Master_Detials.objects.get(pk=Shelf_ID)
#             if Tray_ID:
#                 Tray_Master_instance = Tray_Master_Details.objects.get(pk=Tray_ID)
 
           
#             if not ItemCode:
#                 return JsonResponse({'warn': 'ItemCode and ItemName are mandatory fields'}, status=400)
#             else:
#                 Product_Master_instance=Product_Master_All_Category_Details.objects.get(pk=ItemCode)
           
#             if ItemCode and Rack_ID :
#                 existing_tray_management = Tray_management_Details.objects.filter(
#                         Product_Detials__pk=ItemCode,
#                         Rack_Name__Store_Location_Name__Store_Id=StoreLocation
#                     ).select_related('Rack_Name').first()
 
#             if TrayManagementId and Rack_ID and ItemCode :
                   
#                     print( TrayManagementId , Rack_ID , ItemCode ,'wertyui')
 
#                     Delete_Tray_management_instance = Tray_management_Details.objects.get(pk=TrayManagementId)
                   
#                     DelRack_Master_instance=None
#                     DelShelf_Master_instance=None
#                     DelTray_Master_instance=None
 
#                     if Delete_Tray_management_instance.Rack_Name:
#                         DelRack_Master_instance = Rack_Master_Detials.objects.get(pk=Delete_Tray_management_instance.Rack_Name.Rack_Id)
#                     if Delete_Tray_management_instance.Shelf_Name:
#                         DelShelf_Master_instance = Shelf_Master_Detials.objects.get(pk=Delete_Tray_management_instance.Shelf_Name.Shelf_Id)
#                     if Delete_Tray_management_instance.Tray_Name:
#                         DelTray_Master_instance = Tray_Master_Details.objects.get(pk=Delete_Tray_management_instance.Tray_Name.Tray_Id)
                   
#                     DelMedical_Product_instance = Product_Master_All_Category_Details.objects.get(pk=Delete_Tray_management_instance.Product_Detials.pk)
 
#                     Prev_Tray_management_instance = Prev_Tray_management_Details(
#                     Prev_Rack_Name=DelRack_Master_instance,
#                     Prev_Shelf_Name=DelShelf_Master_instance,
#                     Prev_Tray_Name=DelTray_Master_instance,
#                     Prev_Product_Detials=DelMedical_Product_instance,
#                     Create_by=Delete_Tray_management_instance.Create_by,
#                     )
 
#                     Prev_Tray_management_instance.save()
 
#                     Delete_Tray_management_instance.delete()
 
 
#                     if Tray_Master_instance:
#                         Tray_Master_instance.Booking_Status = 'Available'
#                         Tray_Master_instance.save()
#                     elif Shelf_Master_instance:
#                         Shelf_Master_instance.Booking_Status = 'Available'
#                         Shelf_Master_instance.save()
#                     elif Rack_Master_instance:
#                         Rack_Master_instance.Booking_Status = 'Available'
#                         Rack_Master_instance.save()                  
 
#                     return JsonResponse({'success': 'Item removed from tray and tray is now available'}, status=200)
 
#             elif ItemConfirmed :
 
#                 Update_Tray_Master_Id=existing_tray_management.Tray_Management_Id
 
#                 Edit_Tray_management_instance = Tray_management_Details.objects.get(pk=Update_Tray_Master_Id)
               
#                 EditRack_Master_instance=None            
#                 EditShelf_Master_instance=None
#                 EditTray_Master_instance=None
 
#                 if Edit_Tray_management_instance.Rack_Name:
#                     EditRack_Master_instance = Rack_Master_Detials.objects.get(pk=Edit_Tray_management_instance.Rack_Name.Rack_Id)
#                 if Edit_Tray_management_instance.Shelf_Name:
#                     EditShelf_Master_instance = Shelf_Master_Detials.objects.get(pk=Edit_Tray_management_instance.Shelf_Name.Shelf_Id)
                 
#                 if Edit_Tray_management_instance.Tray_Name:
#                     EditTray_Master_instance = Tray_Master_Details.objects.get(pk=Edit_Tray_management_instance.Tray_Name.Tray_Id)
                 
#                 EditMedical_Product_instance = Product_Master_All_Category_Details.objects.get(pk=Edit_Tray_management_instance.Product_Detials.pk)
 
#                 Prev_Tray_management_instance = Prev_Tray_management_Details(
#                     Prev_Rack_Name=EditRack_Master_instance,
#                     Prev_Shelf_Name=EditShelf_Master_instance,
#                     Prev_Tray_Name=EditTray_Master_instance,
#                     Prev_Product_Detials=EditMedical_Product_instance,
#                     Create_by=Edit_Tray_management_instance.Create_by,
#                 )
 
#                 Prev_Tray_management_instance.save()
 
#                 Edit_Tray_management_instance.delete()
 
#                 if EditTray_Master_instance:
#                     EditTray_Master_instance.Booking_Status = 'Available'
#                     EditTray_Master_instance.save()
#                 elif EditShelf_Master_instance:
#                     EditShelf_Master_instance.Booking_Status = 'Available'
#                     EditShelf_Master_instance.save()
#                 elif EditRack_Master_instance:
#                     EditRack_Master_instance.Booking_Status = 'Available'
#                     EditRack_Master_instance.save()
               
               
 
#                 Tray_management_Details.objects.create(
#                     Rack_Name=Rack_Master_instance,
#                     Shelf_Name=Shelf_Master_instance,
#                     Tray_Name=Tray_Master_instance,
#                     Product_Detials=Product_Master_instance,
#                     Create_by=created_by,
#                 )
 
#                 if Tray_Master_instance:
#                     Tray_Master_instance.Booking_Status = 'Occupied'
#                     Tray_Master_instance.save()
#                 elif Shelf_Master_instance:
#                     Shelf_Master_instance.Booking_Status = 'Occupied'
#                     Shelf_Master_instance.save()
#                 elif Rack_Master_instance:
#                     Rack_Master_instance.Booking_Status = 'Occupied'
#                     Rack_Master_instance.save()          
 
#                 return JsonResponse({'success': 'Updated successfully'})
                       
#             else:
#                 print('--0--00-',existing_tray_management)
#                 if existing_tray_management:
#                     Update_Tray_Master_instance = existing_tray_management
#                     store_location = Update_Tray_Master_instance.Rack_Name.Store_Location_Name.Store_Name
 
#                     response_message = (
#                         "This Item already exists in the following tray. Do you want to change the item combination and free the tray?"
#                         f" Store Location: {store_location},"
#                         f" Rack Name: {Update_Tray_Master_instance.Rack_Name.Rack_Name},"
#                     )
 
#                     if Update_Tray_Master_instance.Shelf_Name and Update_Tray_Master_instance.Shelf_Name.Shelf_Name:
#                         response_message += f" Shelf Name: {Update_Tray_Master_instance.Shelf_Name.Shelf_Name},"
 
#                     if Update_Tray_Master_instance.Tray_Name and Update_Tray_Master_instance.Tray_Name.Tray_Name:
#                         response_message += f" Tray Name: {Update_Tray_Master_instance.Tray_Name.Tray_Name}"
 
#                     return JsonResponse({'Update': response_message})
 
 
#                 Tray_management_Details.objects.create(
#                     Rack_Name=Rack_Master_instance,
#                     Shelf_Name=Shelf_Master_instance,
#                     Tray_Name=Tray_Master_instance,
#                     Product_Detials=Product_Master_instance,
#                     Create_by=created_by,
#                 )
#                 if Tray_Master_instance:
#                     Tray_Master_instance.Booking_Status = 'Occupied'
#                     Tray_Master_instance.save()
#                 elif Shelf_Master_instance:
#                     Shelf_Master_instance.Booking_Status = 'Occupied'
#                     Shelf_Master_instance.save()
#                 elif Rack_Master_instance:
#                     Rack_Master_instance.Booking_Status = 'Occupied'
#                     Rack_Master_instance.save()
 
#                 return JsonResponse({'success': 'Tray management details created successfully'}, status=201)
 
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
     
 
 
# # --------------------------------------------------------------------------------------------------
 
 
 
# @csrf_exempt
# @require_http_methods(["GET"])
# def Tray_Management_List_For_Products(request):
#     if request.method == "GET":
#         try:
#             SearchLocation = request.GET.get('SearchLocation')
#             StoreLocation = request.GET.get('StoreLocation')
#             tray_status = request.GET.get('TrayStatus')
#             rack_name = request.GET.get('RackName')
#             shelf_name = request.GET.get('ShelfName')
#             tray_name = request.GET.get('TrayName')
#             ItemCode = request.GET.get('ItemCode')
#             ProductCategory = request.GET.get('ProductCategory')
#             SubCategory = request.GET.get('SubCategory')
 
#             result_data = []
 
#             query1 = Q()
#             query2 = Q()
#             query3 = Q()
 
#             if rack_name:
#                 query1 &= Q(Rack_Id=rack_name)
#             if StoreLocation:
#                 query1 &= Q(Store_Location_Name__Store_Id=StoreLocation)
 
 
#             if shelf_name:
#                 query2 &= Q(Shelf_Id=shelf_name)
#             if tray_name:
#                 query3 &= Q(Tray_Id=tray_name)
 
#             Rack_Master_list = Rack_Master_Detials.objects.filter(query1)
 
#             num = 1
#             for row in Rack_Master_list:
#                 rack_item_code = ''
#                 rack_item_name = ''
#                 rack_tray_id = ''
 
#                 if row.Booking_Status == 'Occupied':
#                     try:
#                         tray_instance = Tray_management_Details.objects.get(Rack_Name__Rack_Id=row.Rack_Id)
#                         rack_item_code = tray_instance.Product_Detials.pk
#                         rack_item_name = tray_instance.Product_Detials.ItemName
#                         rack_tray_id = tray_instance.Tray_Management_Id
#                     except Tray_management_Details.DoesNotExist:
#                         pass
 
#                 shelf_qs = Shelf_Master_Detials.objects.filter(Q(Rack_Name__Rack_Id=row.Rack_Id) & query2)
 
#                 if shelf_qs.exists():
#                     for s in shelf_qs:
#                         shelf_item_code = ''
#                         shelf_item_name = ''
#                         shelf_tray_id = ''
 
#                         if s.Booking_Status == 'Occupied':
#                             try:
#                                 shelf_instance = Tray_management_Details.objects.get(Shelf_Name__Shelf_Id=s.Shelf_Id)
#                                 shelf_item_code = shelf_instance.Product_Detials.pk
#                                 shelf_item_name = shelf_instance.Product_Detials.ItemName
#                                 shelf_tray_id = shelf_instance.Tray_Management_Id
#                             except Tray_management_Details.DoesNotExist:
#                                 pass
 
#                         tray_qs = Tray_Master_Details.objects.filter(Q(Shelf_Name__Shelf_Id=s.Shelf_Id) & query3)
 
#                         if tray_qs.exists():
#                             for tray in tray_qs:
#                                 tray_item_code = ''
#                                 tray_item_name = ''
#                                 tray_mgmt_id = ''
 
#                                 if tray.Booking_Status == 'Occupied':
#                                     try:
#                                         tray_mgmt = Tray_management_Details.objects.get(Tray_Name__Tray_Id=tray.Tray_Id)
#                                         tray_item_code = tray_mgmt.Product_Detials.pk
#                                         tray_item_name = tray_mgmt.Product_Detials.ItemName
#                                         tray_mgmt_id = tray_mgmt.Tray_Management_Id
#                                     except Tray_management_Details.DoesNotExist:
#                                         pass
 
#                                 result_data.append({
#                                     'id': num,
#                                     'Rack_Id': row.Rack_Id,
#                                     'Rack_Name': row.Rack_Name,
#                                     'Store_Location_Id': row.Store_Location_Name.Store_Id,
#                                     'Store_Location_Name': row.Store_Location_Name.Store_Name,
#                                     'Location_Id': row.Location_Name.Location_Id,
#                                     'Location_Name': row.Location_Name.Location_Name,
#                                     'Shelf_Id': s.Shelf_Id,
#                                     'Shelf_Name': s.Shelf_Name,
#                                     'Tray_Id': tray.Tray_Id,
#                                     'Tray_Name': tray.Tray_Name,
#                                     'Status': tray.Status,
#                                     'Booking_Status': tray.Booking_Status,
#                                     'Item_Code': tray_item_code,
#                                     'Item_Name': tray_item_name,
#                                     'Tray_Management_Id': tray_mgmt_id,
#                                 })
#                                 num += 1
#                         else:
#                             result_data.append({
#                                 'id': num,
#                                 'Rack_Id': row.Rack_Id,
#                                 'Rack_Name': row.Rack_Name,
#                                 'Store_Location_Id': row.Store_Location_Name.Store_Id,
#                                 'Store_Location_Name': row.Store_Location_Name.Store_Name,
#                                 'Location_Id': row.Location_Name.Location_Id,
#                                 'Location_Name': row.Location_Name.Location_Name,
#                                 'Shelf_Id': s.Shelf_Id,
#                                 'Shelf_Name': s.Shelf_Name,
#                                 'Status': s.Status,
#                                 'Booking_Status': s.Booking_Status,
#                                 'Item_Code': shelf_item_code,
#                                 'Item_Name': shelf_item_name,
#                                 'Tray_Management_Id': shelf_tray_id,
#                                 'Tray_Id': '',
#                                 'Tray_Name': '',
#                             })
#                             num += 1
#                 else:
#                     result_data.append({
#                         'id': num,
#                         'Rack_Id': row.Rack_Id,
#                         'Rack_Name': row.Rack_Name,
#                         'Store_Location_Id': row.Store_Location_Name.Store_Id,
#                         'Store_Location_Name': row.Store_Location_Name.Store_Name,
#                         'Location_Id': row.Location_Name.Location_Id,
#                         'Location_Name': row.Location_Name.Location_Name,
#                         'Status': row.Status,
#                         'Booking_Status': row.Booking_Status,
#                         'Item_Code': rack_item_code,
#                         'Item_Name': rack_item_name,
#                         'Tray_Management_Id': rack_tray_id,
#                         'Shelf_Id': '',
#                         'Shelf_Name': '',
#                         'Tray_Id': '',
#                         'Tray_Name': '',
                       
#                     })
#                     num += 1
 
#             # Apply filters after building result_data
#             if tray_status !='All' and tray_status !='InActive':
#                 result_data = [entry for entry in result_data if entry.get('Booking_Status') == tray_status]
#             if tray_status =='InActive':
#                 result_data = [entry for entry in result_data if entry.get('Status') == False]
 
#             if ItemCode:
#                 result_data = [entry for entry in result_data if str(entry.get('Item_Code')) == str(ItemCode)]
 
 
#             return JsonResponse(result_data, safe=False)
 
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': str(e)}, safe=False, status=500)
 
 
 

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET","DELETE"])
def Difine_Tray_For_Products(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            Rack_ID = data.get('RackName')
            Shelf_ID = data.get('ShelfName')
            Tray_ID = data.get('TrayName')
            ItemCode = data.get('ItemCode')
            created_by = data.get('created_by')            
            StoreLocation = data.get('StoreLocation')
            Quantity = data.get('Quantity', 1)  # Default to 1 if not provided
            Batch_No = data.get('Batch_No','')
   
            # Validate required fields
            if not ItemCode or not (Rack_ID or Shelf_ID or Tray_ID):
                return JsonResponse({'warn': 'ItemCode and at least one location (Rack/Shelf/Tray) are mandatory'}, status=400)
 
            # Get product instance
            try:
                product = Product_Master_All_Category_Details.objects.get(pk=ItemCode)
            except Product_Master_All_Category_Details.DoesNotExist:
                return JsonResponse({'warn': 'Product not found'}, status=400)
 
            # Get location instances
            rack = Rack_Master_Detials.objects.get(pk=Rack_ID) if Rack_ID else None
            shelf = Shelf_Master_Detials.objects.get(pk=Shelf_ID) if Shelf_ID else None
            tray = Tray_Master_Details.objects.get(pk=Tray_ID) if Tray_ID else None
 
            # Check if product already exists in this tray
            if tray:
                existing_entry = Tray_management_Details.objects.filter(
                    Tray_Name=tray,
                    Product_Detials=product
                ).first()
 
                if existing_entry:
                    # Update quantity if product already exists in tray
                    return JsonResponse({'success': 'Product already in this Located Tray '})
                    # existing_entry.Quantity += Quantity
                    # existing_entry.save()
               
                # Check tray capacity
                tray_products = Tray_management_Details.objects.filter(Tray_Name=tray)
                # if tray_products.count() >= tray.Capacity:
                #     return JsonResponse({'warn': 'Tray is at full capacity'}, status=400)
 
            # Create new tray management entry
            Tray_management_Details.objects.create(
                Rack_Name=rack,
                Shelf_Name=shelf,
                Tray_Name=tray,
                Product_Detials=product,
                Quantity=Quantity,
                Create_by=created_by
            )
 
            return JsonResponse({'success': 'Product added to tray successfully'})
   
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    elif request.method == "DELETE":
        try:
            print('ites try to delete ......')
            data = json.loads(request.body)
            print('data is diplayed ....', data)
            Rack_ID = data.get('RackName')
            Shelf_ID = data.get('ShelfName')
            Tray_ID = data.get('TrayName')
            ItemCode = data.get('ItemCode')
            created_by = data.get('created_by')            
            StoreLocation = data.get('StoreLocation')
            Quantity = data.get('Quantity', 1)  # Default to 1 if not provided
            Batch_No = data.get('Batch_No','')
            print('batch_no ///',Batch_No)
            print('-----',Shelf_ID)
            print('----',Tray_ID)
            # Validate required fields
            if not ItemCode or not (Rack_ID or Shelf_ID or Tray_ID):
                return JsonResponse({'warn': 'ItemCode and at least one location (Rack/Shelf/Tray) are mandatory'}, status=400)
 
            # Get product instance
            try:
                 
                product = Product_Master_All_Category_Details.objects.get(pk=ItemCode)
            except Product_Master_All_Category_Details.DoesNotExist:
                return JsonResponse({'warn': 'Product not found'}, status=400)
 
            # Get location instances
            rack = Rack_Master_Detials.objects.get(pk=Rack_ID) if Rack_ID else None
            shelf = Shelf_Master_Detials.objects.get(pk=Shelf_ID) if Shelf_ID else None
            tray = Tray_Master_Details.objects.get(pk=Tray_ID) if Tray_ID else None
           
               
            # Check if product already exists in this tray
            if tray:
                existing_entry = Tray_management_Details.objects.filter(
                    Tray_Name=tray,
                    Product_Detials=product
                ).first()
 
                if existing_entry:
                    # Update quantity if product already exists in tray
                    existing_entry.Quantity += Quantity
                    existing_entry.save()
                    existing_entry.delete()
                    return JsonResponse({'success': 'Product quantity updated in tray'})
               
                # Check tray capacity
                tray_products = Tray_management_Details.objects.filter(Tray_Name=tray)
                # if tray_products.count() >= tray.Capacity:
                #     return JsonResponse({'warn': 'Tray is at full capacity'}, status=400)
 
            # Create new tray management entry
            if Shelf_ID == 0 :
                Rack_destroy = Tray_management_Details.objects.filter(
                    Rack_Name = rack,
                    Product_Detials=product
                )
                Rack_destroy.delete()
                return JsonResponse({'success': 'Product deleted from Rack'})
            elif Tray_ID == 0 :
                shelf_destroy = Tray_management_Details.objects.filter(
                    Rack_Name = rack,
                    Shelf_Name=shelf,
                    Product_Detials=product
                )
               
                shelf_destroy.delete()
                return JsonResponse({'success': 'Product deleted from shelf'})
            else:
                tray_destroy = Tray_management_Details.objects.filter(
                     Rack_Name=rack,
                     Shelf_Name=shelf,
                     Tray_Name=tray,
                     Product_Detials=product,
               
            )
           
                tray_destroy.delete()
                return JsonResponse({'success': 'Product deleted from tray'})
           
           
           
           
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
       
       
#Excel file upload for TRay MAnagement
 
@csrf_exempt
def upload_tray_management_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        excel_file = request.FILES.get("file")
        if not excel_file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        df = pd.read_excel(excel_file)

        required_columns = ["Item_Name"]
        for col in required_columns:
            if col not in df.columns:
                return JsonResponse({"error": f"Missing required column: {col}"}, status=400)

        success_count = 0
        update_count = 0
        error_rows = []

        for index, row in df.iterrows():
            try:
                Item_Name = str(row["Item_Name"]).strip()
                Tray_Name = str(row["Tray_Name"]).strip()
                Shelf_Name = str(row["Shelf_Name"]).strip()
                Rack_Name = str(row["Rack_Name"]).strip()
                
               

                tray = Tray_Master_Details.objects.get(Tray_Name=Tray_Name)
                shelf = Shelf_Master_Detials.objects.get(Shelf_Name=Shelf_Name)
                rack = Rack_Master_Detials.objects.get(Rack_Name=Rack_Name)
                product = Product_Master_All_Category_Details.objects.get(ItemName=Item_Name)

                # Check if record exists
                existing = Tray_management_Details.objects.filter(Tray_Name=tray, Product_Detials=product).first()

                if existing:
                   
                    existing.Rack_Name = rack
                    existing.Shelf_Name = shelf
                  
                    existing.save()
                    update_count += 1
                else:
                    Tray_management_Details.objects.create(
                        Rack_Name=rack,
                        Shelf_Name=shelf,
                        Tray_Name=tray,
                        Product_Detials=product,
                       
                    )
                    success_count += 1

            except Exception as e:
                error_rows.append({"row": index + 2, "error": str(e)})
            except Exception as e:
                error_rows.append({"row": index + 2, "error": str(e)})

        return JsonResponse({
            "success": f"{success_count} inserted, {update_count} updated.",
            "errors": error_rows
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# --------------------------------------------------------------------------------------------------
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Tray_Management_List_For_Products(request):
    if request.method == "GET":
        try:
            SearchLocation = request.GET.get('SearchLocation')
            StoreLocation = request.GET.get('StoreLocation')
            tray_status = request.GET.get('TrayStatus')
            rack_name = request.GET.get('RackName')
            shelf_name = request.GET.get('ShelfName')
            tray_name = request.GET.get('TrayName')
            ItemCode = request.GET.get('ItemCode')
            ItemName = request.GET.get('ItemName')
            ProductCategory = request.GET.get('ProductCategory')
            SubCategory = request.GET.get('SubCategory')
            print('itemCode',ItemCode,'itemNAme',ItemName)
            result_data = []
 
            # Build base query
            tray_management_qs = Tray_management_Details.objects.all()
   
 
            # Apply filters
            if SearchLocation:
                tray_management_qs = tray_management_qs.filter(
                    Q(Rack_Name__Location_Name__Location_Id=SearchLocation) |
                    Q(Shelf_Name__Rack_Name__Location_Name__Location_Id=SearchLocation) |
                    Q(Tray_Name__Shelf_Name__Rack_Name__Location_Name__Location_Id=SearchLocation)
                )
           
            if StoreLocation:
                tray_management_qs = tray_management_qs.filter(
                    Q(Rack_Name__Store_Location_Name__Store_Id=StoreLocation) |
                    Q(Shelf_Name__Rack_Name__Store_Location_Name__Store_Id=StoreLocation) |
                    Q(Tray_Name__Shelf_Name__Rack_Name__Store_Location_Name__Store_Id=StoreLocation)
                )
 
            if rack_name:
                tray_management_qs = tray_management_qs.filter(
                    Q(Rack_Name__Rack_Id=rack_name) |
                    Q(Shelf_Name__Rack_Name__Rack_Id=rack_name) |
                    Q(Tray_Name__Shelf_Name__Rack_Name__Rack_Id=rack_name)
                )
 
            if shelf_name:
                tray_management_qs = tray_management_qs.filter(
                    Q(Shelf_Name__Shelf_Id=shelf_name) |
                    Q(Tray_Name__Shelf_Name__Shelf_Id=shelf_name)
                )
 
            if tray_name:
                tray_management_qs = tray_management_qs.filter(Tray_Name__Tray_Id=tray_name)
 
            if ItemName:
                tray_management_qs = tray_management_qs.filter(Product_Detials__ItemName=ItemName)
 
            # Process results
            num = 1
            for item in tray_management_qs:
                location = None
                store_location = None
                rack = None
                shelf = None
                tray = None
               
               
 
                # Get location hierarchy
                if item.Tray_Name:
                    tray = item.Tray_Name
                    shelf = tray.Shelf_Name
                    rack = shelf.Rack_Name
                    location = rack.Location_Name
                    store_location = rack.Store_Location_Name
                elif item.Shelf_Name:
                    shelf = item.Shelf_Name
                    rack = shelf.Rack_Name
                    location = rack.Location_Name
                    store_location = rack.Store_Location_Name
                elif item.Rack_Name:
                    rack = item.Rack_Name
                    location = rack.Location_Name
                    store_location = rack.Store_Location_Name
 
                result_data.append({
                    'id': num,
                    'Tray_Management_Id': item.Tray_Management_Id,
                    'Rack_Id': rack.Rack_Id if rack else None,
                    'Rack_Name': rack.Rack_Name if rack else None,
                    'Store_Location_Id': store_location.Store_Id if store_location else None,
                    'Store_Location_Name': store_location.Store_Name if store_location else None,
                    'Location_Id': location.Location_Id if location else None,
                    'Location_Name': location.Location_Name if location else None,
                    'Shelf_Id': shelf.Shelf_Id if shelf else None,
                    'Shelf_Name': shelf.Shelf_Name if shelf else None,
                    'Tray_Id': tray.Tray_Id if tray else None,
                    'Tray_Name': tray.Tray_Name if tray else None,
                    'Status': tray.Status if tray else (shelf.Status if shelf else (rack.Status if rack else None)),
                    # 'Booking_Status': tray.Booking_Status if tray else (shelf.Booking_Status if shelf else (rack.Booking_Status if rack else None)),
                    'Item_Code': item.Product_Detials.pk,
                    'Item_Name': item.Product_Detials.ItemName,
                    # 'Quantity': item.Product_Detials.Quantity,
                    'Product_Category': item.Product_Detials.ProductCategory.ProductCategory_Name if item.Product_Detials.ProductCategory and item.Product_Detials else '',
                    'Sub_Category': item.Product_Detials.SubCategory.SubCategoryName if item.Product_Detials.SubCategory and item.Product_Detials else '',
                    # 'Batch_No':item.Product_Detials.Batch_No,
                })
                num += 1
 
            # Apply additional filters
            if tray_status != 'All' and tray_status != 'InActive':
                result_data = [entry for entry in result_data ]
            if tray_status == 'InActive':
                result_data = [entry for entry in result_data ]
 
            return JsonResponse(result_data, safe=False)
 
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': str(e)}, safe=False, status=500)



# ------------------------------------------------------------------------------
# ---------------------------------ProductCatgory-------------------------------












@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def ProductCategory_Master_link (request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            ProductCategoryId=data.get('ProductCategoryId')
        
        except Exception as e:
             print(f'An error occurred: {str(e)}')
             return JsonResponse ({'error':'An internal server error occurred'},status=500)


        
    elif request.method == 'GET':
        try:
            Medical_ProductCategory_instance=ProductCategory_Details.objects.all()

            Category_Array=[]

            for row in Medical_ProductCategory_instance:
                Category_dic={
                    'id':row.ProductCategory_Id,
                    'ProductCategoryName':row.ProductCategory_Name,
                    'Status':row.Status
                }
                Category_Array.append(Category_dic)

            return JsonResponse (Category_Array,safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def SubCategory_Master_link (request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)
            print('data',data)

            SubCategoryId=data.get('SubCategoryId','')
            ProductCategoryId=data.get('ProductCategoryId')
            SubCategoryName=data.get('SubCategoryName')
            
            if SubCategoryName:
                Uppercase_name = SubCategoryName.upper()
                normalized_name = SubCategoryName.replace(" ", "").lower()
            else:
                
                Uppercase_name = None
                normalized_name = None
            
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            if SubCategoryId:
                if Statusedit:
                    SubCategory_Instance=SubCategory_Detailes.objects.get(pk=SubCategoryId)
                    SubCategory_Instance.Status=not SubCategory_Instance.Status
                    SubCategory_Instance.save()

                    return JsonResponse ({'success': 'SubCategory Updated successfully'})
                else:
                    if not ProductCategoryId:
                        return JsonResponse({'warn': 'Product Category Name are mandatory fields'})
                    if not SubCategoryName:
                        return JsonResponse({'warn': 'SubCategory Name are mandatory fields'})
                    if ProductCategoryId:
                        ProductCat_instance=Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    existing_Sub_category = SubCategory_Detailes.objects.annotate(
                        normalized_name=Func(
                            'SubCategoryName',
                            function='LOWER',
                            template="REPLACE(%(expressions)s, ' ', '')"
                        )
                    ).filter(ProductCategoryId=ProductCat_instance,normalized_name = normalized_name).exclude(pk=SubCategoryId)
                    if existing_Sub_category.exists():
                        return JsonResponse ({'Warn':f"The Product Category are already present in the name of {Uppercase_name}"})
                    
                    SubCategory_Instance=SubCategory_Detailes.objects.get(pk=SubCategoryId)
                    SubCategory_Instance.ProductCategoryId=ProductCat_instance
                    SubCategory_Instance.SubCategoryName=Uppercase_name
                    SubCategory_Instance.save()

                    return JsonResponse ({'success': 'SubCategory Updated successfully'})


                    



            else:
                if not ProductCategoryId:
                    return JsonResponse({'warn': 'Product Category Name are mandatory fields'})
                if not SubCategoryName:
                    return JsonResponse({'warn': 'SubCategory Name are mandatory fields'})
                if ProductCategoryId:
                    ProductCat_instance=Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                existing_Sub_category = SubCategory_Detailes.objects.annotate(
                    normalized_name=Func(
                        'SubCategoryName',
                        function='LOWER',
                        template="REPLACE(%(expressions)s, ' ', '')"
                    )
                ).filter(ProductCategoryId=ProductCat_instance,normalized_name = normalized_name)
                if existing_Sub_category.exists():
                    return JsonResponse ({'warn':f"The Product Category are already present in the name of {Uppercase_name}"})
                
                else:
                    SubCategory_Instance=SubCategory_Detailes(
                        ProductCategoryId=ProductCat_instance,
                        SubCategoryName=Uppercase_name,
                        Created_by=created_by
                    )
                    SubCategory_Instance.save()

                    return JsonResponse ({'success': 'SubCategory saved successfully'})

        except Exception as e:
            print(f'An error occurred :{str(e)}')
            return JsonResponse (f'error:{str(e)}')

    elif request.method == 'GET':
        try:
            ProductCategory =request.GET.get('ProductCategory',None)

            SubCategory_instance=SubCategory_Detailes.objects.all().order_by('ProductCategoryId')

            if ProductCategory:                          
                SubCategory_instance=SubCategory_instance.filter(ProductCategoryId__pk = int(ProductCategory),Status=True)
                
            SubCategoryArray=[]

            for row in SubCategory_instance:
                Cat_dic={
                    'id':row.SubCategory_Id,
                    'ProductCategoryId':row.ProductCategoryId.pk,
                    'ProductCategory_Name':row.ProductCategoryId.ProductCategory_Name,
                    'SubCategoryName':row.SubCategoryName,
                    'Status':row.Status,
                }
                SubCategoryArray.append(Cat_dic)

            return JsonResponse(SubCategoryArray,safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error': 'An internal server error occurred'},status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def SubCategory_Master_link1 (request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)
            print('data',data)

            SubCategoryId=data.get('SubCategoryId','')
            ProductCategoryId=data.get('ProductCategoryId')
            SubCategoryName=data.get('SubCategoryName')
            
            if SubCategoryName:
                Uppercase_name = SubCategoryName.upper()
                normalized_name = SubCategoryName.replace(" ", "").lower()
            else:
                
                Uppercase_name = None
                normalized_name = None
            
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            if SubCategoryId:
                if Statusedit:
                    SubCategory_Instance=SubCategory_Detailes.objects.get(pk=SubCategoryId)
                    SubCategory_Instance.Status=not SubCategory_Instance.Status
                    SubCategory_Instance.save()

                    return JsonResponse ({'success': 'SubCategory Updated successfully'})
                else:
                    if not ProductCategoryId:
                        return JsonResponse({'warn': 'Product Category Name are mandatory fields'})
                    if not SubCategoryName:
                        return JsonResponse({'warn': 'SubCategory Name are mandatory fields'})
                    if ProductCategoryId:
                        ProductCat_instance=Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    existing_Sub_category = SubCategory_Detailes.objects.annotate(
                        normalized_name=Func(
                            'SubCategoryName',
                            function='LOWER',
                            template="REPLACE(%(expressions)s, ' ', '')"
                        )
                    ).filter(ProductCategoryId=ProductCat_instance,normalized_name = normalized_name).exclude(pk=SubCategoryId)
                    if existing_Sub_category.exists():
                        return JsonResponse ({'Warn':f"The Product Category are already present in the name of {Uppercase_name}"})
                    
                    SubCategory_Instance=SubCategory_Detailes.objects.get(pk=SubCategoryId)
                    SubCategory_Instance.ProductCategoryId=ProductCat_instance
                    SubCategory_Instance.SubCategoryName=Uppercase_name
                    SubCategory_Instance.save()

                    return JsonResponse ({'success': 'SubCategory Updated successfully'})


                    



            else:
                if not ProductCategoryId:
                    return JsonResponse({'warn': 'Product Category Name are mandatory fields'})
                if not SubCategoryName:
                    return JsonResponse({'warn': 'SubCategory Name are mandatory fields'})
                if ProductCategoryId:
                    ProductCat_instance=Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                existing_Sub_category = SubCategory_Detailes.objects.annotate(
                    normalized_name=Func(
                        'SubCategoryName',
                        function='LOWER',
                        template="REPLACE(%(expressions)s, ' ', '')"
                    )
                ).filter(ProductCategoryId=ProductCat_instance,normalized_name = normalized_name)
                if existing_Sub_category.exists():
                    return JsonResponse ({'warn':f"The Product Category are already present in the name of {Uppercase_name}"})
                
                else:
                    SubCategory_Instance=SubCategory_Detailes(
                        ProductCategoryId=ProductCat_instance,
                        SubCategoryName=Uppercase_name,
                        Created_by=created_by
                    )
                    SubCategory_Instance.save()

                    return JsonResponse ({'success': 'SubCategory saved successfully'})

        except Exception as e:
            print(f'An error occurred :{str(e)}')
            return JsonResponse (f'error:{str(e)}')

    elif request.method == 'GET':
        try:
            ProductCategory =request.GET.get('ProductCategory',None)
            itemcode =request.GET.get('ItemCode',None)

            SubCategory_instance=SubCategory_Detailes.objects.all().order_by('ProductCategoryId')

            if ProductCategory and itemcode:                          
                SubCategory_instance = Product_Master_All_Category_Details.objects.filter(pk=itemcode)
                
            SubCategoryArray=[]

            for row in SubCategory_instance:
                Cat_dic={
                    'id':row.SubCategory.SubCategory_Id,
                    'ProductCategoryId':row.ProductCategory.pk,
                    'ProductCategory_Name':row.ProductCategory.ProductCategory_Name,
                    'SubCategoryName':row.SubCategory.SubCategoryName,
                    'CompanyName':row.CompanyName.CompanyName,
                    'SubCategoryName':row.GenericName.GenericName,
                    'Status':True,
                }
                SubCategoryArray.append(Cat_dic)

            return JsonResponse(SubCategoryArray,safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error': 'An internal server error occurred'},status=500)



def get_subcategories(request):
    if request.method == 'GET':
        try:
            ProductCategory = request.GET.get('ProductCategory', None)

            SubCategory_instance = SubCategory_Detailes.objects.all().order_by('ProductCategoryId')

            # Handle multiple ProductCategory IDs (e.g., ?ProductCategory=1,2)
            if ProductCategory:
                try:
                    category_ids = [int(cid.strip()) for cid in ProductCategory.split(',') if cid.strip().isdigit()]
                    SubCategory_instance = SubCategory_instance.filter(ProductCategoryId__pk__in=category_ids, Status=True)
                except ValueError:
                    return JsonResponse({'error': 'Invalid ProductCategory value(s)'}, status=400)

            SubCategoryArray = []

            for row in SubCategory_instance:
                Cat_dic = {
                    'id': row.SubCategory_Id,
                    'ProductCategoryId': row.ProductCategoryId.pk,
                    'ProductCategory_Name': row.ProductCategoryId.ProductCategory_Name,
                    'SubCategoryName': row.SubCategoryName,
                    'Status': row.Status,
                }
                SubCategoryArray.append(Cat_dic)

            return JsonResponse(SubCategoryArray, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Product_Group_Link (request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)

            print("ProductGroupName",data)

            ProductGroupID=data.get('ProductGroupID')
            ProductCategoryId=data.get('ProductCategoryName', None)
            SubProductCategoryId=data.get('SubProductCategoryName', None)
            ProductGroupName=data.get('ProductGroupName')
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            if ProductGroupID:
                if Statusedit:
                    Product_Group_Master_instance=Product_Group_Master_Details.objects.get(pk=ProductGroupID)
                    Product_Group_Master_instance.Status=not Product_Group_Master_instance.Status
                    Product_Group_Master_instance.save()

                    return JsonResponse ({'success': 'Drug Group Updated successfully'})
                else:
                    if not ProductGroupName:
                        return JsonResponse({'warn': 'Drug Group Name are mandatory fields'})
                    if Product_Group_Master_Details.objects.filter(ProductGroup_Name=ProductGroupName).exclude(pk=ProductGroupID).exists():
                        return JsonResponse({'warn':f"The Product Category are already present in the name of {ProductGroupName}" })
                    if not ProductCategoryId:
                        return({'warn': 'ProductCategory not found'})
                    if not SubProductCategoryId:
                        return JsonResponse({'warn': "SubCategory not found"})
                    try:
                        ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                        print("ProductCategory_instance",ProductCategory_instance)
                    
                    except Product_Category_Product_Details.DoesNotExist:
                        return JsonResponse({'warn':  "Productid not found"})
                    
                    try:
                        Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                        print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                    except Sub_ProductCategory_instance.DoesNotExist:
                        return JsonResponse({'warn': 'SubProduct Category not found'})
                        
                    else:
                        Product_Group_Master_instance=Product_Group_Master_Details.objects.get(pk=ProductGroupID)
                        Product_Group_Master_instance.ProductCategory=ProductCategory_instance
                        Product_Group_Master_instance.SubProductCategory=Sub_ProductCategory_instance
                        Product_Group_Master_instance.ProductGroup_Name=ProductGroupName
                        Product_Group_Master_instance.save()
                        
                        return JsonResponse ({'success': 'Drug Group Updated successfully'})
                        

            else:
                if not ProductGroupName:
                    return JsonResponse ({'warn':'Drug Group Name are mandatory fields'})
                if Product_Group_Master_Details.objects.filter(ProductGroup_Name=ProductGroupName).exists():
                    return JsonResponse ({'warn': f"The Drug Group Name are already present in the name of {ProductGroupName}"})
                if not ProductCategoryId:
                    return({'warn': 'ProductCategory not found'})
                if not SubProductCategoryId:
                    return JsonResponse({'warn': "SubCategory not found"})
                try:
                    ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    print("ProductCategory_instance",ProductCategory_instance)
                
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn':  "Productid not found"})
                
                try:
                    Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                    print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                except Sub_ProductCategory_instance.DoesNotExist:
                    return JsonResponse({'warn': 'SubProduct Category not found'})
                else:
                    Product_Group_instance=Product_Group_Master_Details(
                        ProductCategory=ProductCategory_instance,
                        SubProductCategory=Sub_ProductCategory_instance,
                        ProductGroup_Name=ProductGroupName,
                        Create_by=created_by
                    )
                    Product_Group_instance.save()

                    return JsonResponse ({'success': 'Drug Group Name saved successfully'})
        
        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
    elif request.method == 'GET':
        try:
            Product_Group_Master_instance=Product_Group_Master_Details.objects.all()

            Product_Group=[]

            for row in Product_Group_Master_instance:
                Drug_dic={
                    'id':row.ProductGroup_Id,
                    'ProductGroupName':row.ProductGroup_Name,
                    'ProductCategoryName':row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory':row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName':row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory':row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status':row.Status
                }
                Product_Group.append(Drug_dic)

            return JsonResponse (Product_Group,safe=False)
        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Pack_Type_link (request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)

            print("data",data)

            PackTypeID=data.get('PackTypeID')
            PackTypeName=data.get('PackTypeName')
            ProductCategoryId=data.get('ProductCategoryName', None)
            SubProductCategoryId=data.get('SubProductCategoryName', None)
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            if PackTypeID:
                if Statusedit:
                    Pack_Type_Master_instance=Pack_Type_Master_Details.objects.get(pk=PackTypeID)
                    Pack_Type_Master_instance.Status=not Pack_Type_Master_instance.Status
                    Pack_Type_Master_instance.save()

                    return JsonResponse ({'success': 'Pack Type Updated successfully'})
                else:
                    if not PackTypeName:
                        return JsonResponse({'warn': 'Pack Type Name are mandatory fields'})
                    if Pack_Type_Master_Details.objects.filter(PackType_Name=PackTypeName).exclude(pk=PackTypeID).exists():
                        return JsonResponse({'warn':f"The Pack Type are already present in the name of {PackTypeName}" })
                    if not ProductCategoryId:
                        return({'warn': 'ProductCategory not found'})
                    if not SubProductCategoryId:
                        return JsonResponse({'warn': "SubCategory not found"})
                    try:
                        ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                        print("ProductCategory_instance",ProductCategory_instance)
                    
                    except Product_Category_Product_Details.DoesNotExist:
                        return JsonResponse({'warn':  "Productid not found"})
                    
                    try:
                        Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                        print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                    except Sub_ProductCategory_instance.DoesNotExist:
                        return JsonResponse({'warn': 'SubProduct Category not found'})
                        
                    else:
                        Pack_Type_Master_instance=Pack_Type_Master_Details.objects.get(pk=PackTypeID)
                        Pack_Type_Master_instance.ProductCategory=ProductCategory_instance
                        Pack_Type_Master_instance.SubProductCategory=Sub_ProductCategory_instance
                        Pack_Type_Master_instance.PackType_Name=PackTypeName
                        Pack_Type_Master_instance.save()
                        
                        return JsonResponse ({'success': 'Pack Type Updated successfully'})
                        

            else:
                if not PackTypeName:
                    return JsonResponse ({'warn':'Pack Type Name are mandatory fields'})
                if Pack_Type_Master_Details.objects.filter(PackType_Name=PackTypeName).exists():
                    return JsonResponse ({'warn': f"The Pack Type Name are already present in the name of {PackTypeName}"})
                if not ProductCategoryId:
                    return({'warn': 'ProductCategory not found'})
                if not SubProductCategoryId:
                    return JsonResponse({'warn': "SubCategory not found"})
                try:
                    ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    print("ProductCategory_instance",ProductCategory_instance)
                
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn':  "Productid not found"})
                
                try:
                    Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                    print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                except Sub_ProductCategory_instance.DoesNotExist:
                    return JsonResponse({'warn': 'SubProduct Category not found'})
                else:
                    Pack_Type_instance=Pack_Type_Master_Details(
                        ProductCategory=ProductCategory_instance,
                        SubProductCategory=Sub_ProductCategory_instance,
                        PackType_Name=PackTypeName,
                        Create_by=created_by
                    )
                    Pack_Type_instance.save()

                    return JsonResponse ({'success': 'Pack Type Name saved successfully'})
        
        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
    elif request.method == 'GET':
        try:
            Pack_Type_Master_instance=Pack_Type_Master_Details.objects.all()

            Pack_Type_array=[]
            
            for row in Pack_Type_Master_instance:
                Drug_dic={
                    'id':row.pk,
                    'PackTypeName':row.PackType_Name,
                    'ProductCategoryName':row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory':row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName':row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory':row.SubProductCategory.pk if row.SubProductCategory else None,                   
                    'Status':row.Status
                }
                Pack_Type_array.append(Drug_dic)
            return JsonResponse (Pack_Type_array,safe=False)
        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def GenericName_Master_Link (request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # print("gent",data)

            GenericNameID=data.get('GenericNameID')
            GenericName=data.get('GenericName')
            ProductCategoryId=data.get('ProductCategoryName', None)
            SubProductCategoryId=data.get('SubProductCategoryName', None)
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            
            if GenericNameID:
                if Statusedit:
                    GenericName_Instance=GenericName_Master_Details.objects.get(pk=GenericNameID)
                    GenericName_Instance.Status = not GenericName_Instance.Status
                    GenericName_Instance.save()
                    
                    return JsonResponse ({'success': 'Generic Name Updated successfully'})

                else:

                    if not GenericName:
                        return JsonResponse ({'warn':'Generic Name are mandatory fields'})
                    if GenericName_Master_Details.objects.filter(GenericName=GenericName).exclude(pk=GenericNameID).exists():
                        return JsonResponse ({'warn': f"The Generic Name are already present in the name of {GenericName}"})
                    if not ProductCategoryId:
                        return({'warn': 'ProductCategory not found'})
                    if not SubProductCategoryId:
                        return JsonResponse({'warn': "SubCategory not found"})
                    try:
                        ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                        print("ProductCategory_instance",ProductCategory_instance)
                    
                    except Product_Category_Product_Details.DoesNotExist:
                        return JsonResponse({'warn':  "Productid not found"})
                    
                    try:
                        Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                        print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                    except Sub_ProductCategory_instance.DoesNotExist:
                        return JsonResponse({'warn': 'SubProduct Category not found'})
                                           
                    GenericName_Instance=GenericName_Master_Details.objects.get(pk=GenericNameID)
                    GenericName_Instance.ProductCategory=ProductCategory_instance
                    GenericName_Instance.SubProductCategory=Sub_ProductCategory_instance
                    GenericName_Instance.GenericName=GenericName
                    GenericName_Instance.Updated_by=created_by
                    GenericName_Instance.save()

                    return JsonResponse ({'success': 'Generic Name Updated successfully'})





            else:
                if not GenericName:
                    return JsonResponse ({'warn':'Generic Name are mandatory fields'})
                if GenericName_Master_Details.objects.filter(GenericName=GenericName).exists():
                        return JsonResponse ({'warn': f"The Generic Name are already present in the name of {GenericName}"})
                if not ProductCategoryId:
                    return({'warn': 'ProductCategory not found'})
                if not SubProductCategoryId:
                    return JsonResponse({'warn': "SubCategory not found"})
                try:
                    ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    print("ProductCategory_instance",ProductCategory_instance)
                
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn':  "Productid not found"})
                
                try:
                    Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                    print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                except Sub_ProductCategory_instance.DoesNotExist:
                    return JsonResponse({'warn': 'SubProduct Category not found'})                
                else:
                    GenericName_Ins=GenericName_Master_Details(
                        ProductCategory=ProductCategory_instance,
                        SubProductCategory=Sub_ProductCategory_instance,
                        GenericName=GenericName,
                        Create_by=created_by
                    )
                    GenericName_Ins.save()
            
                    return JsonResponse ({'success': 'Generic Name saved successfully'})
        
        except Exception as e :
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)

    elif request.method == "GET":
        try:

            GenericName_Instance=GenericName_Master_Details.objects.all()

            GenericName_Array=[]

            for row in GenericName_Instance :
                Gen_dic={
                    'id':row.pk,
                    'GenericName':row.GenericName,
                    'ProductCategoryName':row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory':row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName':row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory':row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status':row.Status,
                }
                GenericName_Array.append(Gen_dic)
            
            return JsonResponse(GenericName_Array,safe=False)

        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)




@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def CompanyName_Master_Link (request):
    if request.method == "POST":
        try:
            data =json.loads(request.body)

            CompanyNameId=data.get('CompanyNameId')
            CompanyName=data.get('CompanyName','')
            ProductCategoryId=data.get('ProductCategoryName', None)
            SubProductCategoryId=data.get('SubProductCategoryName', None)
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            if CompanyNameId:
                if Statusedit:
                    CompanyName_Instance=CompanyName_mfg_Master_Details.objects.get(pk=CompanyNameId)
                    CompanyName_Instance.Status = not CompanyName_Instance.Status
                    CompanyName_Instance.save()

                    return JsonResponse ({'success': 'Company Name Updated successfully'})
                
                else:
                    if not CompanyName:
                        return JsonResponse ({'warn':'Company Name are mandatory fields'})
                    if CompanyName_mfg_Master_Details.objects.filter(CompanyName=CompanyName).exclude(pk=CompanyNameId).exists():
                        return JsonResponse ({'warn': f"The Company Name are already present in the name of {CompanyName}"})
                    if not ProductCategoryId:
                        return({'warn': 'ProductCategory not found'})
                    if not SubProductCategoryId:
                        return JsonResponse({'warn': "SubCategory not found"})
                    try:
                        ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                        print("ProductCategory_instance",ProductCategory_instance)
                    
                    except Product_Category_Product_Details.DoesNotExist:
                        return JsonResponse({'warn':  "Productid not found"})
                    
                    try:
                        Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                        print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                    except Sub_ProductCategory_instance.DoesNotExist:
                        return JsonResponse({'warn': 'SubProduct Category not found'})
                                            
                    else:
                        CompanyName_Instance=CompanyName_mfg_Master_Details.objects.get(pk=CompanyNameId)
                        CompanyName_Instance.ProductCategory=ProductCategory_instance
                        CompanyName_Instance.SubProductCategory=Sub_ProductCategory_instance
                        CompanyName_Instance.CompanyName = CompanyName
                        CompanyName_Instance.Updated_by = created_by
                        CompanyName_Instance.save()

                        return JsonResponse ({'success': 'Company Name Updated successfully'})


            else:
                if not CompanyName:
                    return JsonResponse ({'warn':'Company Name are mandatory fields'})
                if CompanyName_mfg_Master_Details.objects.filter(CompanyName=CompanyName).exists():
                        return JsonResponse ({'warn': f"The Company Name are already present in the name of {CompanyName}"})
                if not ProductCategoryId:
                    return({'warn': 'ProductCategory not found'})
                if not SubProductCategoryId:
                    return JsonResponse({'warn': "SubCategory not found"})
                try:
                    ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    print("ProductCategory_instance",ProductCategory_instance)
                
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn':  "Productid not found"})
                
                try:
                    Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                    print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                except Sub_ProductCategory_instance.DoesNotExist:
                    return JsonResponse({'warn': 'SubProduct Category not found'})
                else:
                    CompanyName_instance=CompanyName_mfg_Master_Details(
                        ProductCategory=ProductCategory_instance,
                        SubProductCategory=Sub_ProductCategory_instance,
                        CompanyName=CompanyName,
                        Create_by=created_by,
                    )

                    CompanyName_instance.save()
                
                    return JsonResponse ({'success': 'Company Name saved successfully'})
            
            
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return  JsonResponse ({'error':'An internal server error occurred'},status=500)

    elif request.method == "GET":
        try:
            CompanyName_Instance=CompanyName_mfg_Master_Details.objects.all()

            CompanyName_Array=[]

            for row in CompanyName_Instance:
                dic={
                    'id':row.pk,
                    'CompanyName':row.CompanyName,
                    'ProductCategoryName':row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory':row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName':row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory':row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status':row.Status
                }
                CompanyName_Array.append(dic)

            return JsonResponse (CompanyName_Array,safe=False)
        
        except Exception as e :
            print(f'An error occurred:{str(e)}')
            return JsonResponse ({'error':f'An error occurred:{str(e)}'},status=500)




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Medical_Stock_InsetLink(request):
    if request.method == "POST":
        try:
            Getfile = request.FILES.get('file')
            print('file', Getfile)

            if Getfile.name.endswith('.csv'):
                df = pd.read_csv(Getfile)
            else:
                return JsonResponse({
                    'error': 'Unsupported file format. Please upload a CSV or Excel file'
                })

            csv_data = df.to_dict(orient='records')

            Medical_Stock_FileUpload.objects.all().delete()

            for row in csv_data:
                for key in row:
                    if pd.isna(row[key]):
                        if isinstance(row[key], str):
                            row[key] = 'None'
                        elif isinstance(row[key], (int, float)):
                            row[key] = None
        
                Medical_Stock_FileUpload.objects.create(
                    Product_Id=row.get('Product_Id', 'None'),
                    Product_Name=row.get('Product_Name', 'None'),
                    Generic_Name=row.get('Generic_Name', 'None'),
                    Available_Qantity=row.get('Available_Qantity', 0),
                    Item_Type = row.get('Item_Type'),
                    Dosage = row.get('Dosage')
                )

            return JsonResponse({'message': 'File uploaded and data inserted successfully'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == "GET":
        try:
            medical_stock_data = Medical_Stock_FileUpload.objects.all()
            data = [
                {
                    'id': item.Product_Id,
                    'Product_Name': item.Product_Name,
                    'Generic_Name': item.Generic_Name,
                    'Item_Type':item.Item_Type,
                    'Dosage':item.Dosage,
                    'Available_Qantity': item.Available_Qantity,
                }
                for item in medical_stock_data
            ]
            return JsonResponse(data, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# ----------------------------------------------------------

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def ProductType_Master_lik(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            print('000',data)
            ProductTypeID=data.get('ProductTypeID','')
            ProductTypeName=data.get('ProductTypeName','')
            ProductCategoryId=data.get('ProductCategoryName', None)
            SubProductCategoryId=data.get('SubProductCategoryName', None)
            created_by=data.get('created_by')
            Statusedit=data.get('Statusedit')

            if ProductTypeID:
                if Statusedit:
                    ProductType_instance=ProductType_Master_Details.objects.get(pk=ProductTypeID)
                    ProductType_instance.Status= not ProductType_instance.Status
                    ProductType_instance.save()
                    return JsonResponse ({'success': 'ProductType Updated successfully'})
                else:
                    if not ProductTypeName:
                        return JsonResponse({'warn': 'ProductType Name are mandatory fields'})
                    # if ProductType_Master_Details.objects.filter(ProductType_Name=ProductTypeName).exclude(pk=ProductTypeID).exists():
                    #     return JsonResponse ({'Warn':f"The ProductType are already present in the name of {ProductTypeName}"})
                    if not ProductCategoryId:
                        return({'warn': 'ProductCategory not found'})
                    if not SubProductCategoryId:
                        return JsonResponse({'warn': "SubCategory not found"})
                    try:
                        ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                        print("ProductCategory_instance",ProductCategory_instance)
                    
                    except Product_Category_Product_Details.DoesNotExist:
                        return JsonResponse({'warn':  "Productid not found"})
                    
                    try:
                        Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                        print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                    except Sub_ProductCategory_instance.DoesNotExist:
                        return JsonResponse({'warn': 'SubProduct Category not found'})
                        
                    ProductType_instance=ProductType_Master_Details.objects.get(pk=ProductTypeID)
                    ProductType_instance.ProductCategory=ProductCategory_instance
                    ProductType_instance.SubProductCategory=Sub_ProductCategory_instance
                    ProductType_instance.ProductType_Name=ProductTypeName
                    ProductType_instance.save()

                    return JsonResponse ({'success': 'ProductType Updated successfully'})

            else:
                if not ProductTypeName:
                    return JsonResponse ({'warn': 'ProductType Name are mandatory fields'})
                if ProductType_Master_Details.objects.filter(ProductType_Name=ProductTypeName).exists():
                    return JsonResponse({'warn': f"The ProductType Name are already present in the name of {ProductTypeName}"})
                if not ProductCategoryId:
                    return({'warn': 'ProductCategory not found'})
                if not SubProductCategoryId:
                    return JsonResponse({'warn': "SubCategory not found"})
                try:
                    ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryId)
                    print("ProductCategory_instance",ProductCategory_instance)
                
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn':  "Productid not found"})
                
                try:
                    Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryId)
                    print("Sub_ProductCategory_instance",Sub_ProductCategory_instance)
                except Sub_ProductCategory_instance.DoesNotExist:
                    return JsonResponse({'warn': 'SubProduct Category not found'})
                else:
                    ProductType_instance=ProductType_Master_Details(
                    ProductCategory=ProductCategory_instance,
                    SubProductCategory=Sub_ProductCategory_instance,
                    ProductType_Name= ProductTypeName,
                    Create_by=created_by
                    )
                    ProductType_instance.save()
                    
                    return JsonResponse({'success': 'ProductType saved successfully'})
                    

        except Exception as e:
            print(f'An error occurred:{str(e)}')
            return JsonResponse(f'An error occurred:{str(e)}')
    
    elif request.method =='GET':
        try:
            ProductType_instance=ProductType_Master_Details.objects.all()

            ProductType_Array=[]

            for row in ProductType_instance:
                ProductType_dic={
                    'id':row.ProductType_Id,
                    'ProductTypeName':row.ProductType_Name,
                    'ProductCategoryName':row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory':row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName':row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory':row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status':row.Status
                }
                ProductType_Array.append(ProductType_dic)

            return JsonResponse(ProductType_Array,safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)




# -------------------------------------------




# bharathi



# @csrf_exempt
# @require_http_methods(["GET"])
# def GenericName_by_Product_SubProduct(request):
#     try:
#         # Extract query parameters
#         ProductCategoryid = request.GET.get('ProductCategory')
#         SubProductCategoryid = request.GET.get('SubProductCategory')

#         # Validate input
#         if not ProductCategoryid:
#             return JsonResponse({'warn': 'ProductCategory not found.'}, status=400)

#         # Query database
#         if SubProductCategoryid:
#             GenericName_Instance = GenericName_Master_Details.objects.filter(
#                 ProductCategory=ProductCategoryid,
#                 SubProductCategory=SubProductCategoryid
#             ).order_by('GenericName')
#         else:
#             GenericName_Instance = GenericName_Master_Details.objects.filter(
#                 ProductCategory=ProductCategoryid
#             ).order_by('GenericName')

#         # Prepare response data
#         GenericName_Array = []
#         for row in GenericName_Instance:
#             Gen_dic = {
#                 'id': row.pk,
#                 'GenericName': row.GenericName,
#                 'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
#                 'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
#                 'SubProductCategoryName': row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
#                 'SubProductCategory': row.SubProductCategory.pk if row.SubProductCategory else None,
#                 'Status': row.Status,
#             }
#             GenericName_Array.append(Gen_dic)

#         return JsonResponse(GenericName_Array, safe=False)

#     except Exception as e:
#         print("Error:", str(e))
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def GenericName_by_Product_SubProduct(request):
    try:
        ProductCategoryid = request.GET.get('ProductCategory')
        SubProductCategoryid = request.GET.get('SubProductCategory')
 
        if not ProductCategoryid:
            return JsonResponse({'warn': 'ProductCategory not found.'}, status=400)
 
        filters = {'ProductCategory': ProductCategoryid}
        if SubProductCategoryid:
            filters['SubProductCategory'] = SubProductCategoryid
 
        # ✅ Step 1: Fetch only unique GenericName values
        distinct_names = (
            GenericName_Master_Details.objects
            .filter(**filters)
            .values_list('GenericName', flat=True)
            .distinct()
            .order_by('GenericName')
        )
 
        # ✅ Step 2: Optionally fetch related info (first matching row per GenericName)
        GenericName_Array = []
        for name in distinct_names:
            first_row = GenericName_Master_Details.objects.filter(
                GenericName=name, **filters
            ).first()
 
            if first_row:
                GenericName_Array.append({
                    'GenericName': first_row.GenericName,
                    'ProductCategoryName': first_row.ProductCategory.ProductCategory_Name if first_row.ProductCategory else None,
                    'ProductCategory': first_row.ProductCategory.pk if first_row.ProductCategory else None,
                    'SubProductCategoryName': first_row.SubProductCategory.SubCategoryName if first_row.SubProductCategory else None,
                    'SubProductCategory': first_row.SubProductCategory.pk if first_row.SubProductCategory else None,
                    'Status': first_row.Status,
                })
 
        return JsonResponse(GenericName_Array, safe=False)
 
    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 




@csrf_exempt
@require_http_methods(["POST"])
def GenericName_by_Product_SubProduct1(request):
    try:
        # Parse JSON body
        data = json.loads(request.body.decode('utf-8'))
        ProductCategoryid = data.get('ProductCategory', None)
        ProductId = data.get('ProductId', None)

        if not ProductId:
            return JsonResponse({'warn': 'ProductId not found.'}, status=400)

        # fetch product master entry
        product_instance = Product_Master_All_Category_Details.objects.filter(
            pk=ProductId
        )

        GenericName_Array = []
        for row in product_instance:
            Gen_dic = {
                'id': row.GenericName.pk if row.GenericName else None,
                'GenericName': row.GenericName.GenericName if row.GenericName else None,
                'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
                'SubProductCategoryName': row.SubCategory.SubCategoryName if row.SubCategory else None,
                'SubProductCategory': row.SubCategory.pk if row.SubCategory else None,
                'ProductId': row.pk,
                'Status': True,
            }
            GenericName_Array.append(Gen_dic)

        return JsonResponse(GenericName_Array, safe=False)

    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# @csrf_exempt
# @require_http_methods(["GET"])
# def CompanyName_by_Product_SubProduct(request):
#     if request.method == 'GET':
#         try:
#             ProductCategoryid = request.GET.get('ProductCategory')
#             SubProductCategoryid = request.GET.get('SubProductCategory')
#             if not ProductCategoryid:
#                 return JsonResponse({'warn': 'ProductCategory  not found.'})
#             if SubProductCategoryid:

#                 CompanyName_instance = CompanyName_mfg_Master_Details.objects.filter(
#                     ProductCategory=ProductCategoryid,
#                     SubProductCategory=SubProductCategoryid
#                 ).order_by('CompanyName')
#             else:
#                  CompanyName_instance = CompanyName_mfg_Master_Details.objects.filter(
#                     ProductCategory=ProductCategoryid
#                 ).order_by('CompanyName')


#             CompanyName_Array = []
#             for row in CompanyName_instance:
#                 Company_dict = {
#                     'id':row.pk,
#                     'CompanyName': row.CompanyName,
#                     'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
#                     'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
#                     'SubProductCategoryName': row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
#                     'SubProductCategory': row.SubProductCategory.pk if row.SubProductCategory else None,
#                     'Status': row.Status,
#                 }
#                 CompanyName_Array.append(Company_dict)
#             return JsonResponse(CompanyName_Array, safe=False)


        
#         except Exception as e:
#             return JsonResponse({'warn': 'An internal server error occurred.'}, status=500)

    
#     return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
@require_http_methods(["GET"])
def CompanyName_by_Product_SubProduct(request):
    try:
        ProductCategoryid = request.GET.get('ProductCategory')
        SubProductCategoryid = request.GET.get('SubProductCategory')
 
        if not ProductCategoryid:
            return JsonResponse({'warn': 'ProductCategory not found.'}, status=400)
 
        filters = {'ProductCategory': ProductCategoryid}
        if SubProductCategoryid:
            filters['SubProductCategory'] = SubProductCategoryid
 
        # ✅ Step 1: Get distinct company names only
        distinct_names = (
            CompanyName_mfg_Master_Details.objects
            .filter(**filters)
            .values_list('CompanyName', flat=True)
            .distinct()
            .order_by('CompanyName')
        )
 
        # ✅ Step 2: For each unique name, get one representative row
        CompanyName_Array = []
        for name in distinct_names:
            first_row = CompanyName_mfg_Master_Details.objects.filter(
                CompanyName=name, **filters
            ).first()
 
            if first_row:
                CompanyName_Array.append({
                    'id': first_row.pk,
                    'CompanyName': first_row.CompanyName,
                    'ProductCategoryName': first_row.ProductCategory.ProductCategory_Name if first_row.ProductCategory else None,
                    'ProductCategory': first_row.ProductCategory.pk if first_row.ProductCategory else None,
                    'SubProductCategoryName': first_row.SubProductCategory.SubCategoryName if first_row.SubProductCategory else None,
                    'SubProductCategory': first_row.SubProductCategory.pk if first_row.SubProductCategory else None,
                    'Status': first_row.Status,
                })
 
        return JsonResponse(CompanyName_Array, safe=False)
 
    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({'error': 'An internal server error occurred.'}, status=500)
 
 







@csrf_exempt
@require_http_methods(["POST"])
def CompanyName_by_Product_SubProduct1(request):
    try:
        # Parse JSON body
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'warn': 'Invalid JSON body.'}, status=400)

        ProductId = data.get('ProductId', None)

        if not ProductId:
            return JsonResponse({'warn': 'ProductId not found.'}, status=400)

        # fetch product master entry
        product_instance = Product_Master_All_Category_Details.objects.filter(pk=ProductId)

        CompanyName_Array = []
        for row in product_instance:
            if row.CompanyName:  # check relation exists
                Company_dict = {
                    'id': row.CompanyName.pk,
                    'CompanyName': row.CompanyName.CompanyName,
                    'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName': row.SubCategory.SubCategoryName if row.SubCategory else None,
                    'SubProductCategory': row.SubCategory.pk if row.SubCategory else None,
                    'ProductId': row.pk,
                    'Status': row.Status,
                }
                CompanyName_Array.append(Company_dict)

        return JsonResponse(CompanyName_Array, safe=False)

    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    

@csrf_exempt
@require_http_methods(["GET"])
def Product_Group_by_Product_SubProduct(request):
    if request.method == 'GET':
        try:
            ProductCategoryid = request.GET.get('ProductCategory')
            SubProductCategoryid = request.GET.get('SubProductCategory')
            if not ProductCategoryid:
                return JsonResponse({'warn': 'ProductCategory  not found'})
            if SubProductCategoryid:
                ProductGroup_instance = Product_Group_Master_Details.objects.filter(
                    ProductCategory=ProductCategoryid,
                    SubProductCategory=SubProductCategoryid
                )
            else:
                ProductGroup_instance = Product_Group_Master_Details.objects.filter(
                    ProductCategory=ProductCategoryid
                )

            print("ProductGroup_instance",ProductGroup_instance)
            ProductGroupName_Array = []
            for row in ProductGroup_instance:
                group_dict = {
                    'id':row.pk,
                    'ProductGroupName':row.ProductGroup_Name,
                    'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName': row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory': row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status': row.Status,
                }
                ProductGroupName_Array.append(group_dict)
            return JsonResponse(ProductGroupName_Array, safe=False)
        except Exception as e:
            return JsonResponse({'warn':'An internal server error occurred'}, status=500)
            
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def PackType_by_Product_SubProduct(request):
    if request.method == 'GET':
        try:
            ProductCategoryid = request.GET.get('ProductCategory')
            SubProductCategoryid = request.GET.get('SubProductCategory')
            if not ProductCategoryid:
                return JsonResponse({'warn': 'ProductCategory and SubProductCategory not found'})
            if SubProductCategoryid:
                PackType_instance = Pack_Type_Master_Details.objects.filter(
                    ProductCategory=ProductCategoryid,
                    SubProductCategory=SubProductCategoryid
                )
            else:
                PackType_instance = Pack_Type_Master_Details.objects.filter(
                    ProductCategory=ProductCategoryid
                )

            print("PackType_instance",PackType_instance)
            PackType_Array = []
            for row in PackType_instance:
                group_dict = {
                    'id':row.pk,
                    'PackTypeName':row.PackType_Name,
                    'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName': row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory': row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status': row.Status,
                }
                PackType_Array.append(group_dict)
            return JsonResponse(PackType_Array, safe=False)
        except Exception as e:
            return JsonResponse({'warn':'An internal server error occurred'}, status=500)
            
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)





@csrf_exempt
@require_http_methods(["GET"])
def ProductType_by_Product_SubProduct(request):
    if request.method == 'GET':
        try:
            ProductCategoryid = request.GET.get('ProductCategory')
            SubProductCategoryid = request.GET.get('SubProductCategory')
            if not ProductCategoryid:
                return JsonResponse({'warn': 'ProductCategory not found'})
            if SubProductCategoryid:
                ProductType_instance = ProductType_Master_Details.objects.filter(
                    ProductCategory=ProductCategoryid,
                    SubProductCategory=SubProductCategoryid,
                    Status = True

                )
            else:
                ProductType_instance = ProductType_Master_Details.objects.filter(
                    ProductCategory=ProductCategoryid,
                     Status = True
                )

            print("ProductType_instance",ProductType_instance)
            ProductType_Array = []
            for row in ProductType_instance:
                group_dict = {
                    'id':row.pk,
                    'ProductTypeName':row.ProductType_Name,
                    'ProductCategoryName': row.ProductCategory.ProductCategory_Name if row.ProductCategory else None,
                    'ProductCategory': row.ProductCategory.pk if row.ProductCategory else None,
                    'SubProductCategoryName': row.SubProductCategory.SubCategoryName if row.SubProductCategory else None,
                    'SubProductCategory': row.SubProductCategory.pk if row.SubProductCategory else None,
                    'Status': row.Status,
                }
                ProductType_Array.append(group_dict)
            return JsonResponse(ProductType_Array, safe=False)
        except Exception as e:
            return JsonResponse({'warn':'An internal server error occurred'}, status=500)
            
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)




@csrf_exempt
def All_CompanyName_Files_Upload(request):
    try:
        # Fetching file and created_by information from request
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")
 
        # Check if the file format is valid
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")  # Handle encoding errors
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)

 
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")
 
        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            """
            Helper function to get or create a foreign key instance.
            Args:
                model: Django model to query.
                filters: Dictionary of fields to filter.
                defaults: Dictionary of fields for creating an object if not found.
                return_existing_code: Whether to return the existing instance's code if found.
            Returns:
                Instance of the model or existing code if specified.
            """
            filter_conditions = {key: value for key, value in filters.items() if value}  # Only add non-empty values
            instance = model.objects.filter(**filter_conditions).first()
 
            if instance:
                # If an instance exists, return it or its code (primary key)
                return instance.pk if return_existing_code else instance
 
            # Create a new instance if it does not exist
            instance = model.objects.create(**{**filters, **defaults})
            return instance.pk if return_existing_code else instance
 
        for row in csv_data:
            productcategory = None
            sub_category = None
            productcategory_instance = None
            sub_productcategory_instance = None
 
            # Check if the ProductCategory exists, if not, create it
            if row["ProductCategory"]:
                productcategory = get_or_create_foreign_key(
                    model=Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
 
            # Check if the SubCategory exists, if not, create it
            if row["SubCategory"]:
                try:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        model=SubCategory_Detailes,
                        filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {csv_data.index(row) + 1}: Product Category not found for SubCategory "{row["SubCategory"]}"'})
 
            # Check if the CompanyName exists with the same ProductCategory and SubCategory, if not, create it
            CompanyName = row.get("CompanyName", "").strip() if row.get("CompanyName") else ""
            if CompanyName:
                existing_company = CompanyName_mfg_Master_Details.objects.filter(
                    ProductCategory=productcategory_instance,
                    SubProductCategory=sub_productcategory_instance,
                    CompanyName=CompanyName
                ).first()
 
                if existing_company:
                    print("existing_company",existing_company)
                    # If the CompanyName with the same ProductCategory and SubCategory already exists, continue to the next row
                    continue
 
                # If CompanyName does not exist, create a new one
                with transaction.atomic():
                    CompanyName_mfg_Master_Details.objects.create(
                        ProductCategory=productcategory_instance,
                        SubProductCategory=sub_productcategory_instance,
                        CompanyName=CompanyName,
                        Status=True,
                        Create_by=created_by
 
                    )
 
        return JsonResponse({'success': 'CompanyName xlxs/csv file uploaded successfully'})
 
    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)
 
 
@csrf_exempt
def All_GenericName_Files_Upload(request):
    try:
        # Fetching file and created_by information from request
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")
 
        # Check if the file format is valid
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")  # Handle encoding errors
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)

 
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")
 
        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            """
            Helper function to get or create a foreign key instance.
            Args:
                model: Django model to query.
                filters: Dictionary of fields to filter.
                defaults: Dictionary of fields for creating an object if not found.
                return_existing_code: Whether to return the existing instance's code if found.
            Returns:
                Instance of the model or existing code if specified.
            """
            filter_conditions = {key: value for key, value in filters.items() if value}  # Only add non-empty values
            instance = model.objects.filter(**filter_conditions).first()
 
            if instance:
                # If an instance exists, return it or its code (primary key)
                return instance.pk if return_existing_code else instance
 
            # Create a new instance if it does not exist
            instance = model.objects.create(**{**filters, **defaults})
            return instance.pk if return_existing_code else instance
 
        for row in csv_data:
            productcategory = None
            sub_category = None
            productcategory_instance = None
            sub_productcategory_instance = None
 
            # Check if the ProductCategory exists, if not, create it
            if row["ProductCategory"]:
                productcategory = get_or_create_foreign_key(
                    model=Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
 
            # Check if the SubCategory exists, if not, create it
            if row["SubCategory"]:
                try:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        model=SubCategory_Detailes,
                        filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {csv_data.index(row) + 1}: Product Category not found for SubCategory "{row["SubCategory"]}"'})
 
            # Check if the CompanyName exists with the same ProductCategory and SubCategory, if not, create it
            GenericName = row.get("GenericName", "").strip() if row.get("GenericName") else ""
            if GenericName:
                existing_GenericName = GenericName_Master_Details.objects.filter(
                    ProductCategory=productcategory_instance,
                    SubProductCategory=sub_productcategory_instance,
                    GenericName=GenericName
                ).first()
 
                if existing_GenericName:
                    print("existing_GenericName",existing_GenericName)
                    # If the CompanyName with the same ProductCategory and SubCategory already exists, continue to the next row
                    continue
 
                # If CompanyName does not exist, create a new one
                with transaction.atomic():
                    GenericName_Master_Details.objects.create(
                        ProductCategory=productcategory_instance,
                        SubProductCategory=sub_productcategory_instance,
                        GenericName=GenericName,
                        Status=True,
                        Create_by=created_by
 
                    )
 
        return JsonResponse({'success': 'GenericName xlxs/csv file uploaded successfully'})
 
    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)
 


@csrf_exempt
def All_PackType_Files_Upload(request):
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")

        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith("xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)
        
        for col in df.select_dtypes(include=["object"]):
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")

        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            """
            Helper function to get or create a foreign key instance.
            Args:
                model: Django model to query.
                filters: Dictionary of fields to filter.
                defaults: Dictionary of fields for creating an object if not found.
                return_existing_code: Whether to return the existing instance's code if found.
            Returns:
                Instance of the model or existing code if specified.
            """
            filter_conditions = {key: value for key, value in filters.items() if value} 
            instance = model.objects.filter(**filter_conditions).first()

            if instance:
                return instance.pk if return_existing_code else instance
            instance = model.objects.create(**{**filters, **defaults})
            return instance.pk if return_existing_code else instance
        
        for row in csv_data:
            productcategory = None
            sub_category = None
            productcategory_instance = None
            sub_productcategory_instance = None

            if row["ProductCategory"]:
                productcategory = get_or_create_foreign_key(
                    model=Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
            
            if row["SubCategory"]:
                try:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        model=SubCategory_Detailes,
                        filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {csv_data.index(row) + 1}: Product Category not found for SubCategory "{row["SubCategory"]}"'})
 
            

            PackTypeName = row.get("PackTypeName", "").strip() if row.get("PackTypeName") else ""
            if PackTypeName:
                existing_packtypename = Pack_Type_Master_Details.objects.filter(
                    ProductCategory=productcategory_instance,
                    SubProductCategory=sub_productcategory_instance,
                    PackType_Name=PackTypeName
                ).first()
 
                if existing_packtypename:
                    print("existing_packtypename",existing_packtypename)
                    # If the CompanyName with the same ProductCategory and SubCategory already exists, continue to the next row
                    continue
 
                # If CompanyName does not exist, create a new one
                with transaction.atomic():
                    Pack_Type_Master_Details.objects.create(
                        ProductCategory=productcategory_instance,
                        SubProductCategory=sub_productcategory_instance,
                        PackType_Name=PackTypeName,
                        Status=True,
                        Create_by=created_by
 
                    )
 
        return JsonResponse({'success': 'PackType xlxs/csv file uploaded successfully'})
 

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server  error occurred: {str(e)}'}, statue=500)


@csrf_exempt
def All_ProductGroup_Files_Upload(request):
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")

        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith("xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)
        
        for col in df.select_dtypes(include=["object"]):
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")

        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            """
            Helper function to get or create a foreign key instance.
            Args:
                model: Django model to query.
                filters: Dictionary of fields to filter.
                defaults: Dictionary of fields for creating an object if not found.
                return_existing_code: Whether to return the existing instance's code if found.
            Returns:
                Instance of the model or existing code if specified.
            """
            filter_conditions = {key: value for key, value in filters.items() if value} 
            instance = model.objects.filter(**filter_conditions).first()

            if instance:
                return instance.pk if return_existing_code else instance
            instance = model.objects.create(**{**filters, **defaults})
            return instance.pk if return_existing_code else instance
        
        for row in csv_data:
            print("---------------productgrouprow--------------",row)
            productcategory = None
            sub_category = None
            productcategory_instance = None
            sub_productcategory_instance = None

            if row["ProductCategory"]:
                productcategory = get_or_create_foreign_key(
                    model=Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
            
            if row["SubCategory"]:
                try:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        model=SubCategory_Detailes,
                        filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {csv_data.index(row) + 1}: Product Category not found for SubCategory "{row["SubCategory"]}"'})
 
            

            ProductGroup_Name = row.get("ProductGroupName", "").strip() if row.get("PackTypeName") else ""
            if ProductGroup_Name:
                existing_product_groupname = Product_Group_Master_Details.objects.filter(
                    ProductCategory=productcategory_instance,
                    SubProductCategory=sub_productcategory_instance,
                    ProductGroup_Name=ProductGroup_Name
                ).first()
 
                if existing_product_groupname:
                    print("existing_product_groupname",existing_product_groupname)
                    # If the CompanyName with the same ProductCategory and SubCategory already exists, continue to the next row
                    continue
 
                # If CompanyName does not exist, create a new one
                with transaction.atomic():
                    Product_Group_Master_Details.objects.create(
                        ProductCategory=productcategory_instance,
                        SubProductCategory=sub_productcategory_instance,
                        ProductGroup_Name=ProductGroup_Name,
                        Status=True,
                        Create_by=created_by
 
                    )
 
        return JsonResponse({'success': 'ProductGroup xlxs/csv file uploaded successfully'})
 

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server  error occurred: {str(e)}'}, statue=500)


@csrf_exempt
def All_ProductType_Files_Upload(request):
    try:
        file = request.FILES.get("file")
        print("-------------------------------file",file)
        created_by = request.POST.get("created_by")

        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith("xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)
        
        for col in df.select_dtypes(include=["object"]):
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")

        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            """
            Helper function to get or create a foreign key instance.
            Args:
                model: Django model to query.
                filters: Dictionary of fields to filter.
                defaults: Dictionary of fields for creating an object if not found.
                return_existing_code: Whether to return the existing instance's code if found.
            Returns:
                Instance of the model or existing code if specified.
            """
            filter_conditions = {key: value for key, value in filters.items() if value} 
            instance = model.objects.filter(**filter_conditions).first()

            if instance:
                return instance.pk if return_existing_code else instance
            instance = model.objects.create(**{**filters, **defaults})
            return instance.pk if return_existing_code else instance
        
        for row in csv_data:
            print("-------------row-------------",row)
            productcategory = None
            sub_category = None
            productcategory_instance = None
            sub_productcategory_instance = None

            if row["ProductCategory"]:
                productcategory = get_or_create_foreign_key(
                    model=Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
            
            if row["SubCategory"]:
                try:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        model=SubCategory_Detailes,
                        filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {csv_data.index(row) + 1}: Product Category not found for SubCategory "{row["SubCategory"]}"'})
 
            

            ProductType_Name = row.get("ProductTypeName", "").strip() if row.get("ProductTypeName") else ""
            if ProductType_Name:
                existing_product_typename = ProductType_Master_Details.objects.filter(
                    ProductCategory=productcategory_instance,
                    SubProductCategory=sub_productcategory_instance,
                    ProductType_Name=ProductType_Name
                ).first()
 
                if existing_product_typename:
                    print("existing_product_typename",existing_product_typename)
                    # If the CompanyName with the same ProductCategory and SubCategory already exists, continue to the next row
                    continue
 
                # If CompanyName does not exist, create a new one
                with transaction.atomic():
                    ProductType_Master_Details.objects.create(
                        ProductCategory=productcategory_instance,
                        SubProductCategory=sub_productcategory_instance,
                        ProductType_Name=ProductType_Name,
                        Status=True,
                        Create_by=created_by
 
                    )
 
        return JsonResponse({'success': 'ProductType xlxs/csv file uploaded successfully'})
 

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server  error occurred: {str(e)}'}, statue=500)





