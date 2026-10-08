from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Count
from django.http import JsonResponse
from .models import *
from Masters.models import *
from Frontoffice.models import Patient_Admission_Room_Detials,Patient_Admission_Detials
from django.shortcuts import get_object_or_404
from django.db.models import  Q
from .serializers import *

# building----------------
@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Building_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'dataaa')
            # Extract and validate data
            BuildingId = data.get('BuildingId','')
            BuildingName = data.get('BuildingName','')
            Location = data.get('Location','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
           
            if BuildingId:
                if Statusedit:
                    Building_instance = Building_Master_Detials.objects.get(pk=BuildingId)
                    # Check if any Room_Master_Detials records have Booking_Status not equal to "Available"
                    non_available_status_exists = Room_Master_Detials.objects.filter(
                        Building_Name=Building_instance
                    ).exclude(Booking_Status='Available').exists()

                    if non_available_status_exists:
                        # Raise a ValidationError if any Booking_Status is not "Available"
                        return JsonResponse ({'warn':"Cannot change the status because some Booking_Status in Room_Master_Detials is not 'Available'."})
                    else:
                        # Toggle the status
                        Building_instance.Status = not Building_instance.Status

                        # If all Booking_Status are 'Available', proceed with the status update
                        Block_Master_Detials.objects.filter(Building_Name=Building_instance).update(Status=Building_instance.Status)
                        Floor_Master_Detials.objects.filter(Building_Name=Building_instance).update(Status=Building_instance.Status)
                        WardType_Master_Detials.objects.filter(Building_Name=Building_instance).update(Status=Building_instance.Status)
                        RoomType_Master_Detials.objects.filter(Building_Name=Building_instance).update(Status=Building_instance.Status)
                        Room_Master_Detials.objects.filter(Building_Name=Building_instance).update(Status=Building_instance.Status)
                        # Save the changes to the database
                        Building_instance.save()

                 
        
                    
                else:
                    if Building_Master_Detials.objects.filter(Building_Name=BuildingName, Location_Name=Location_instance ).exclude(pk = BuildingId).exists():
                        return JsonResponse({'warn': f"The Building Detials are already present in the name of {BuildingName} and {Location_instance.Location_Name} "})
                    else:
                        Building_instance = Building_Master_Detials.objects.get(pk=BuildingId)
                        # Create a new LocationName instance
                        Building_instance.Building_Name=BuildingName
                        Building_instance.Location_Name=Location_instance
                    
                        Building_instance.save()

                return JsonResponse({'success': 'Building Detials Updated successfully'})
            else:
                if Building_Master_Detials.objects.filter(Building_Name=BuildingName, Location_Name=Location_instance ).exists():
                    return JsonResponse({'warn': f"The Building Detials are already present in the name of {BuildingName} and {Location_instance.Location_Name} "})
                else:
                    Building_instance = Building_Master_Detials(
                        Building_Name=BuildingName,
                        Location_Name=Location_instance,
                        created_by=created_by
                    )
                Building_instance.save()
                return JsonResponse({'success': 'Building Detials added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Building_Master = Building_Master_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Building_Master_data = []
            for Build in Building_Master:
                Build_dict = {
                    'id': Build.Building_Id,
                    'BuildingName': Build.Building_Name,
                    'Location_Name': Build.Location_Name.Location_Name,
                    'Location_Id': Build.Location_Name.Location_Id,
                    'Status': 'Active' if Build.Status else 'Inactive',
                    'created_by': Build.created_by,
                    
                }
                Building_Master_data.append(Build_dict)

            return JsonResponse(Building_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


def get_building_Data_by_location(request):
    try:
        Location=request.GET.get('Location')
        if not Location:
            return JsonResponse({'error':'Location are required'})
        
        loc_ins= Location_Detials.objects.get(Location_Id=Location)
        # Fetch all records from the LocationName model
        if not Building_Master_Detials.objects.filter(Status=True,Location_Name=loc_ins).exists():
            return JsonResponse({'error':'Data not found'})
        
        Building_Master = Building_Master_Detials.objects.filter(Status=True,Location_Name=loc_ins)
        print(Building_Master)
        # Construct a list of dictionaries containing location data
        Building_Master_data = []
        for Build in Building_Master:
            Build_dict = {
                'id': Build.Building_Id,
                'BuildingName': Build.Building_Name,
                
            }
            Building_Master_data.append(Build_dict)

        return JsonResponse(Building_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# block-----------

@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Block_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'dataaa')
            # Extract and validate data
            BlockId = data.get('BlockId','')
            BlockName = data.get('BlockName','')
            BuildingName = data.get('BuildingName','')
            Location = data.get('Location','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
            if BuildingName:
                Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
                
           
            if BlockId:
                if Statusedit:
                    Block_instance = Block_Master_Detials.objects.get(pk=BlockId)
    
                    # Check if any Room_Master_Detials records have Booking_Status not equal to "Available"
                    non_available_status_exists = Room_Master_Detials.objects.filter(
                        Block_Name=Block_instance
                    ).exclude(Booking_Status='Available').exists()

                    if non_available_status_exists:
                        # Return a warning message if any Booking_Status is not "Available"
                        return JsonResponse({'warn': "Cannot change the status because some Booking_Status in Room_Master_Detials is not 'Available'."})
                    
                    # Check if all parent statuses are True
                    parent_statuses = []
                    
                    if not Block_instance.Building_Name.Status:
                        parent_statuses.append("Building Status")
                    
                    if parent_statuses:
                        # If any parent status is False, return a warning message
                        return JsonResponse({'warn': f"Cannot change the block status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
                    
                    # Toggle the status
                    Block_instance.Status = not Block_instance.Status
                    
                    # If all Booking_Status are 'Available', proceed with the status update
                    Floor_Master_Detials.objects.filter(Block_Name=Block_instance).update(Status=Block_instance.Status)
                    WardType_Master_Detials.objects.filter(Block_Name=Block_instance).update(Status=Block_instance.Status)
                    RoomType_Master_Detials.objects.filter(Block_Name=Block_instance).update(Status=Block_instance.Status)
                    Room_Master_Detials.objects.filter(Block_Name=Block_instance).update(Status=Block_instance.Status)
                    
                    # Save the changes to the database
                    Block_instance.save()
                    
                    return JsonResponse({'success': "Block status updated successfully."})
                    
        
                else:
                    if Block_Master_Detials.objects.filter(Block_Name=BlockName, Location_Name=Location_instance,Building_Name = Building_instance ).exclude(pk = BlockId).exists():
                        return JsonResponse({'warn': f"The Block Detials are already present in the name of {BlockName} and {Location_instance.Location_Name} and {Building_instance.Building_Name}"})
                    else:
                        Block_instance = Block_Master_Detials.objects.get(pk=BlockId)
                        # Create a new LocationName instance
                        Block_instance.Block_Name=BlockName
                        Block_instance.Location_Name=Location_instance
                        Block_instance.Building_Name = Building_instance
                    
                        Block_instance.save()

                return JsonResponse({'success': 'Block Detials Updated successfully'})
            else:
                if Block_Master_Detials.objects.filter(Block_Name=BlockName, Location_Name=Location_instance,Building_Name = Building_instance ).exists():
                    return JsonResponse({'warn': f"The Block Detials are already present in the name of {BlockName} and {Location_instance.Location_Name} and {Building_instance.Building_Name}"})
                else:
                    Block_instance = Block_Master_Detials(
                        Block_Name=BlockName,
                        Building_Name = Building_instance,
                        Location_Name=Location_instance,
                        created_by=created_by
                    )
                Block_instance.save()
                return JsonResponse({'success': 'Block Detials added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Block_Master = Block_Master_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Block_Master_data = []
            for Block in Block_Master:
                Block_dict = {
                    'id': Block.Block_Id,
                    'BlockName': Block.Block_Name,
                    'BuildingId': Block.Building_Name.Building_Id,
                    'BuildingName': Block.Building_Name.Building_Name,
                    'Location_Name': Block.Location_Name.Location_Name,
                    'Location_Id': Block.Location_Name.Location_Id,
                    'Status': 'Active' if Block.Status else 'Inactive',
                    'created_by': Block.created_by,
                    
                }
                Block_Master_data.append(Block_dict)

            return JsonResponse(Block_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



def get_block_Data_by_Building(request):
    try:
       
        Building=request.GET.get('Building')
        if not Building:
            return JsonResponse({'error':'Building are required'},status=400)
        
        Building_ins= Building_Master_Detials.objects.get(Building_Id=Building)
        
        if not Block_Master_Detials.objects.filter(Status=True,Building_Name=Building_ins,Location_Name__pk=Building_ins.Location_Name.pk).exists():
            return JsonResponse({'error':'Data Not Found'},status=400)
        # Fetch all records from the LocationName model
        Block_Master = Block_Master_Detials.objects.filter(Status=True,Building_Name=Building_ins,Location_Name__pk=Building_ins.Location_Name.pk)
 
        # Construct a list of dictionaries containing location data
        Block_Master_data = []
        for Block in Block_Master:
            Block_dict = {
                'id': Block.Block_Id,
                'BlockName': Block.Block_Name,
                
            }
            Block_Master_data.append(Block_dict)

        return JsonResponse(Block_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



# floor------------
@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Floor_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'dataaa')
            # Extract and validate data
            FloorId = data.get('FloorId','')
            FloorName = data.get('FloorName','')
            BlockName = data.get('BlockName','')
            BuildingName = data.get('BuildingName','')
            Location = data.get('Location','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            
            Location_instance=None
            Building_instance=None
            Block_instance=None
            
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
            if BuildingName:
                Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
                
            if BlockName:
                Block_instance = Block_Master_Detials.objects.get(Block_Id = BlockName)
                
        
            if FloorId:
                if Statusedit:
                    Floor_instance = Floor_Master_Detials.objects.get(pk=FloorId)
    
                    # Check if any Room_Master_Detials records have Booking_Status not equal to "Available"
                    non_available_status_exists = Room_Master_Detials.objects.filter(
                        Floor_Name=Floor_instance
                    ).exclude(Booking_Status='Available').exists()

                    if non_available_status_exists:
                        # Return a warning message if any Booking_Status is not "Available"
                        return JsonResponse({'warn': "Cannot change the status because some Booking_Status in Room_Master_Detials is not 'Available'."})
                    
                    # Check if all parent statuses are True
                    parent_statuses = []
                    
                    if not Floor_instance.Building_Name.Status:
                        parent_statuses.append("Building Status")
                    
                    if not Floor_instance.Block_Name.Status:
                        parent_statuses.append("Block Status")
                    
                    if parent_statuses:
                        # If any parent status is False, return a warning message
                        return JsonResponse({'warn': f"Cannot change the floor status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
                    
                    # Toggle the status
                    Floor_instance.Status = not Floor_instance.Status
                    
                    # If all Booking_Status are 'Available', proceed with the status update
                    WardType_Master_Detials.objects.filter(Floor_Name=Floor_instance).update(Status=Floor_instance.Status)
                    RoomType_Master_Detials.objects.filter(Floor_Name=Floor_instance).update(Status=Floor_instance.Status)
                    Room_Master_Detials.objects.filter(Floor_Name=Floor_instance).update(Status=Floor_instance.Status)
                    
                    # Save the changes to the database
                    Floor_instance.save()
                    
                    return JsonResponse({'success': "Floor status updated successfully."})
                    
                   
        
                    # Toggle the status
                    
                    
                    # Save the changes to the database
                    
                else:
                    if Floor_Master_Detials.objects.filter(Floor_Name=FloorName, Location_Name=Location_instance,Building_Name = Building_instance ,Block_Name=Block_instance).exclude(pk= FloorId).exists():
                        return JsonResponse({'warn': f"The Block Detials are already present in the name of {FloorName} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name}"})
                    else:
                        Floor_instance = Floor_Master_Detials.objects.get(pk=FloorId)
                        # Create a new LocationName instance
                        Floor_instance.Floor_Name=FloorName
                        Floor_instance.Block_Name=Block_instance
                        Floor_instance.Location_Name=Location_instance
                        Floor_instance.Building_Name = Building_instance
                    
                        Floor_instance.save()

                return JsonResponse({'success': 'Floor Detials Updated successfully'})
            else:
                if Floor_Master_Detials.objects.filter(Floor_Name=FloorName, Location_Name=Location_instance,Building_Name = Building_instance ,Block_Name=Block_instance).exists():
                    return JsonResponse({'warn': f"The Block Detials are already present in the name of {FloorName} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name}"})
                else:
                    Floor_instance = Floor_Master_Detials(
                        Floor_Name=FloorName,
                        Block_Name=Block_instance,
                        Building_Name = Building_instance,
                        Location_Name=Location_instance,
                        created_by=created_by
                    )
                Floor_instance.save()
                return JsonResponse({'success': 'Floor Detials added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Floor_Master = Floor_Master_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Floor_Master_data = []
            for Floor in Floor_Master:
                Floor_dict = {
                    'id': Floor.Floor_Id,
                    'FloorName': Floor.Floor_Name,
                    'BlockId': Floor.Block_Name.Block_Id,
                    'BlockName': Floor.Block_Name.Block_Name,
                    'BuildingId': Floor.Building_Name.Building_Id,
                    'BuildingName': Floor.Building_Name.Building_Name,
                    'Location_Name': Floor.Location_Name.Location_Name,
                    'Location_Id': Floor.Location_Name.Location_Id,
                    'Status': 'Active' if Floor.Status else 'Inactive',
                    'created_by': Floor.created_by,
                    
                }
                Floor_Master_data.append(Floor_dict)

            return JsonResponse(Floor_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



def get_Floor_Data_by_Building_block_loc(request):
    try:
        Block=request.GET.get('Block')
        if not Block:
            return JsonResponse({'error':'Block are required'})
        
        Block_ins= Block_Master_Detials.objects.get(Block_Id=Block)
        if not Floor_Master_Detials.objects.filter(Status=True,Building_Name=Block_ins.Building_Name,Block_Name=Block_ins,Location_Name=Block_ins.Location_Name).exists():
            return JsonResponse({'error':'Data not found'})
        # Fetch all records from the LocationName model
        Floor_Master = Floor_Master_Detials.objects.filter(Status=True,Building_Name=Block_ins.Building_Name,Block_Name=Block_ins,Location_Name=Block_ins.Location_Name)
 
        # Construct a list of dictionaries containing location data
        Floor_Master_data = []
        for Floor in Floor_Master:
            Floor_dict = {
                'id': Floor.Floor_Id,
                'FloorName': Floor.Floor_Name, 
            }
            Floor_Master_data.append(Floor_dict)

        return JsonResponse(Floor_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# ward name
@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Ward_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'dataaa')
            # Extract and validate data
            WardId = data.get('WardId','')
            WardName = data.get('WardName','')
            FloorName = data.get('FloorName','')
            BlockName = data.get('BlockName','')
            BuildingName = data.get('BuildingName','')
            Location = data.get('Location','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')

            Acamt = data.get('Acamt','')
            Amount = data.get('Amount','')
            DoctorCharges = data.get('DoctorCharges','')
            NonACamt = data.get('NonACamt','')
            NurseCharges = data.get('NurseCharges','')
            Type = data.get('Type','')
            isAc = data.get('isAc','')

            print(isAc)
            print(type(isAc))
            
            Location_instance=None
            Building_instance=None
            Block_instance=None
            Floor_instance=None
            
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
            
            # if BuildingName:
            #     Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
                
            # if BlockName:
            #     Block_instance = Block_Master_Detials.objects.get(Block_Id = BlockName)
                
            # if FloorName:
            #     Floor_instance = Floor_Master_Detials.objects.get(Floor_Id = FloorName)
                
        
            if WardId:
                if Statusedit:
                    ward_instance = WardType_Master_Detials.objects.get(pk=WardId)
                    ward_instance.Status = not ward_instance.Status
    
                    # Check if any Room_Master_Detials records have Booking_Status not equal to "Available"
                    # non_available_status_exists = Room_Master_Detials.objects.filter(
                    #     Ward_Name=ward_instance
                    # ).exclude(Booking_Status='Available').exists()

                    # if non_available_status_exists:
                    #     # Return a warning message if any Booking_Status is not "Available"
                    #     return JsonResponse({'warn': "Cannot change the status because some Booking_Status in Room_Master_Detials is not 'Available'."})
                    
                    # # Check if all parent statuses are True
                    # parent_statuses = []
                    
                    # # if not ward_instance.Building_Name.Status:
                    # #     parent_statuses.append("Building Status")
                    
                    # # if not ward_instance.Block_Name.Status:
                    # #     parent_statuses.append("Block Status")
                    
                    # # if not ward_instance.Floor_Name.Status:
                    # #     parent_statuses.append("Floor Status")
                    
                    # if parent_statuses:
                    #     # If any parent status is False, return a warning message
                    #     return JsonResponse({'warn': f"Cannot change the ward status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
                    
                    # # If all conditions are met, toggle the ward status
                    # ward_instance.Status = not ward_instance.Status
                    
                    # # Update related RoomType and Room statuses
                    # RoomType_Master_Detials.objects.filter(Ward_Name=ward_instance).update(Status=ward_instance.Status)
                    # Room_Master_Detials.objects.filter(Ward_Name=ward_instance).update(Status=ward_instance.Status)
                    
                    # Save the changes to the database
                    ward_instance.save()
                    
                    return JsonResponse({'success': "Ward status updated successfully."})
                            
                else:
                    if WardType_Master_Detials.objects.filter(Ward_Name=WardName, Location_Name=Location_instance,Type=Type).exclude(pk=WardId).exists():
                        return JsonResponse({'warn': f"The Ward Detials are already present in the name of {WardName} and {Location_instance.Location_Name} "})
                    else:
                        print("opopopoo")
                        ward_instance = WardType_Master_Detials.objects.get(pk=WardId)
                        print("ward_instance",ward_instance)
                        # Create a new LocationName instance
                        ward_instance.Ward_Name=WardName
                        # ward_instance.Floor_Name=Floor_instance
                        # ward_instance.Block_Name=Block_instance
                        # ward_instance.Building_Name = Building_instance
                        ward_instance.Type = Type
                        ward_instance.isAC = isAc
                        ward_instance.Amount = Amount
                        ward_instance.Acamt = Acamt
                        ward_instance.NonACamt = NonACamt
                        ward_instance.DoctorCharges = DoctorCharges
                        ward_instance.NurseCharges = NurseCharges
                        ward_instance.Location_Name=Location_instance
                        ward_instance.save()
                        print("8080809")
    
                return JsonResponse({'success': 'Ward Detials Updated successfully'})
            else:
                if WardType_Master_Detials.objects.filter(Ward_Name=WardName,Type=Type,Location_Name=Location_instance).exists():
                        return JsonResponse({'warn': f"The Ward Detials are already present in the name of {WardName} and {Location_instance.Location_Name}"})
                else:
                    print("ward")
                    ward_instance = WardType_Master_Detials(
                        Ward_Name=WardName,
                        # Floor_Name=Floor_instance,
                        # Block_Name=Block_instance,
                        # Building_Name = Building_instance,
                        Location_Name=Location_instance,
                        Type = Type,
                        isAC = isAc,
                        Amount = Amount,
                        Acamt = Acamt,
                        NonACamt = NonACamt,
                        DoctorCharges = DoctorCharges,
                        NurseCharges = NurseCharges,

                        created_by=created_by
                    )

                    ward_instance.save()

                    return JsonResponse({'success': 'Ward Detials added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            Floor_Master = WardType_Master_Detials.objects.all()
            
            Floor_Master_data = []
            for Floor in Floor_Master:
                Floor_dict = {
                    'id': Floor.Ward_Id,
                    'WardName': Floor.Ward_Name,
                    # 'FloorId': Floor.Floor_Name.Floor_Id,
                    # 'FloorName': Floor.Floor_Name.Floor_Name,
                    # 'BlockId': Floor.Block_Name.Block_Id,
                    # 'BlockName': Floor.Block_Name.Block_Name,
                    # 'BuildingId': Floor.Building_Name.Building_Id,
                    # 'BuildingName': Floor.Building_Name.Building_Name,
                    'Location_Name': Floor.Location_Name.Location_Name,
                    'Location_Id': Floor.Location_Name.Location_Id,
                    'Status': 'Active' if Floor.Status else 'Inactive',
                    'created_by': Floor.created_by,
                    'Type' : Floor.Type,
                    'Amount' : Floor.Amount,
                    'DoctorCharges' : Floor.DoctorCharges,
                    'NurseCharges' : Floor.NurseCharges,
                    'isAc': Floor.isAC,
                    'Acamt':Floor.Acamt,
                    'NonACamt': Floor.NonACamt


                }

                Floor_Master_data.append(Floor_dict)
            return JsonResponse(Floor_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





def get_Ward_Data_by_Building_block_Floor_loc(request):
    try:
        Floor = request.GET.get('Floor')
        RegisterType = request.GET.get('RegisterType')
        
        if not Floor:
            return JsonResponse({'error': 'Floor is required'}, status=400)
        
        # Get the Floor instance
        try:
            Floor_ins = Floor_Master_Detials.objects.get(Floor_Id=Floor)
        except Floor_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Floor not found'}, status=404)
        
        # Base query for WardType_Master_Details
        ward_query = WardType_Master_Detials.objects.filter(
            Status=True,
            Building_Name=Floor_ins.Building_Name,
            Block_Name=Floor_ins.Block_Name,
            Floor_Name=Floor_ins,
            Location_Name=Floor_ins.Location_Name
        )
        
        # Apply additional filtering based on RegisterType
        if RegisterType == 'IP':
            ward_query = ward_query.exclude(Ward_Name__in=['CASUALITY', 'OT'])
        elif RegisterType == 'Casuality':
            ward_query = ward_query.filter(Ward_Name='Casuality')
        
        # If no Ward records found
        if not ward_query.exists():
            return JsonResponse({'error': 'No Ward data found'}, status=404)
        
        # Construct response data
        Ward_Master_data = [{'id': Ward.Ward_Id, 'WardName': Ward.Ward_Name} for Ward in ward_query]

        return JsonResponse(Ward_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# room name master
@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Room_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'dataaa')
            # Extract and validate data
            RoomId = data.get('RoomId','')
            # RoomName = data.get('RoomName')
            WardName = data.get('WardName','')
            FloorName = data.get('FloorName','')
            BlockName = data.get('BlockName','')
            BuildingName = data.get('BuildingName','')
            # RoomCharge = float(data.get('RoomCharge','0'))
            # doctorcharges = float(data.get('DoctorCharges','0'))
            # nursecharges = float(data.get('NurseCharges','0'))
            # GST_val = data.get('GST','Nill')
            Location = data.get('Location','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            RoomNo = data.get('Roomno','')
            # isAc = data.get('isAc','')
            # Acamt = data.get('Acamt','')
            # NonACamt = data.get('NonACamt','')
            
            Location_instance=None
            Building_instance=None
            Block_instance=None
            Floor_instance=None
            Ward_instance=None
            
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
            
            if BuildingName:
                Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
                
            if BlockName:
                Block_instance = Block_Master_Detials.objects.get(Block_Id = BlockName)
                
            if FloorName:
                Floor_instance = Floor_Master_Detials.objects.get(Floor_Id = FloorName)
                
            if WardName:
                Ward_instance = WardType_Master_Detials.objects.get(Ward_Id = WardName)
                
            Total_Current_Charge=0
            # if GST_val !='Nill':
            #     Total_Current_Charge=  RoomCharge + ((RoomCharge * int(GST_val)) / 100) 
            # else:
            #     Total_Current_Charge=RoomCharge
                
            if RoomId:
                if Statusedit:
                   
                    Room_instance = RoomType_Master_Detials.objects.get(pk=RoomId)
                    
                    # Check if any Room_Master_Detials records have Booking_Status not equal to "Available"
                    non_available_status_exists = Room_Master_Detials.objects.filter(
                        Room_Name=Room_instance
                    ).exclude(Booking_Status='Available').exists()

                    if non_available_status_exists:
                        # Return a warning message if any Booking_Status is not "Available"
                        return JsonResponse({'warn': "Cannot change the status because some Booking_Status in Room_Master_Detials is not 'Available'."})
                    
                    # Check if all parent statuses are True
                    parent_statuses = []
                    
                    if not Room_instance.Building_Name.Status:
                        parent_statuses.append("Building Status")
                    
                    if not Room_instance.Block_Name.Status:
                        parent_statuses.append("Block Status")
                    
                    if not Room_instance.Floor_Name.Status:
                        parent_statuses.append("Floor Status")
                    
                    if not Room_instance.Ward_Name.Status:
                        parent_statuses.append("Ward Status")
                    
                    if parent_statuses:
                        # If any parent status is False, return a warning message
                        return JsonResponse({'warn': f"Cannot change the room status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
                    
                    # If all conditions are met, toggle the room status
                    Room_instance.Status = not Room_instance.Status
                    
                    # Update related Room_Master_Detials statuses
                    Room_Master_Detials.objects.filter(Room_Name=Room_instance).update(Status=Room_instance.Status)
                    
                    # Save the changes to the database
                    Room_instance.save()
                    
                    return JsonResponse({'success': "Room status updated successfully."})
        
                else:
                    if RoomType_Master_Detials.objects.filter(Location_Name=Location_instance,Building_Name = Building_instance ,Block_Name=Block_instance,Floor_Name=Floor_instance,Ward_Name=Ward_instance,RoomNo = RoomNo).exclude(pk = RoomId).exists():
                        return JsonResponse({'warn': f"The Room Detials are already present in the name of {Ward_instance.Ward_Name} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name} and {RoomNo}"})
                    else:
                        RoomType_instance = RoomType_Master_Detials.objects.get(pk=RoomId)
                        # RoomType_instance.Room_Name = RoomName
                        RoomType_instance.Ward_Name=Ward_instance
                        RoomType_instance.Floor_Name=Floor_instance
                        RoomType_instance.Block_Name=Block_instance
                        RoomType_instance.Building_Name = Building_instance
                        RoomType_instance.Location_Name=Location_instance
                        RoomType_instance.RoomNo = RoomNo

                        RoomType_instance.save()
                        

                return JsonResponse({'success': 'Room Detials Updated successfully'})
            else:
                if RoomType_Master_Detials.objects.filter(Location_Name=Location_instance,Building_Name = Building_instance ,Block_Name=Block_instance,Floor_Name=Floor_instance,Ward_Name=Ward_instance,RoomNo = RoomNo).exists():
                        return JsonResponse({'warn': f"The Room Detials are already present in the name of {Ward_instance.Ward_Name} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name} and {RoomNo}"})
                else:
                    RoomType_instance = RoomType_Master_Detials(
                        Ward_Name=Ward_instance,
                        Floor_Name=Floor_instance,
                        Block_Name=Block_instance,
                        Building_Name = Building_instance,
                        Location_Name=Location_instance,
                        RoomNo = RoomNo,          
                        created_by=created_by
                    )
                    RoomType_instance.save()
                    return JsonResponse({'success': 'Room Detials added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            RoomType_Master = RoomType_Master_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            RoomType_Master_data = []
            for Roomtype in RoomType_Master:
                Roomtype_dict = {
                    'id': Roomtype.Room_Id,
                    # 'RoomName': Roomtype.Room_Name,
                    'Roomno' : Roomtype.RoomNo,        
                    'WardId': Roomtype.Ward_Name.Ward_Id,
                    'WardName': Roomtype.Ward_Name.Ward_Name,
                    'FloorId': Roomtype.Floor_Name.Floor_Id,
                    'FloorName': Roomtype.Floor_Name.Floor_Name,
                    'BlockId': Roomtype.Block_Name.Block_Id,
                    'BlockName': Roomtype.Block_Name.Block_Name,
                    'BuildingId': Roomtype.Building_Name.Building_Id,
                    'BuildingName': Roomtype.Building_Name.Building_Name,
                    'Location_Name': Roomtype.Location_Name.Location_Name,
                    'Location_Id': Roomtype.Location_Name.Location_Id,
                    'Status': 'Active' if Roomtype.Status else 'Inactive',
                    'created_by': Roomtype.created_by,
                    
                }
                RoomType_Master_data.append(Roomtype_dict)

            return JsonResponse(RoomType_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)


def get_RoomType_Data_by_Building_block_Floor_ward_loc(request):
    try:
        Ward=request.GET.get('Ward')
        Floor = request.GET.get('Floor')
        RegisterType=request.GET.get('RegisterType')
        print('Waaarrrrddddddddd',Ward)
        if not Ward:
            return JsonResponse({'error':'Ward are required'})
        

        Ward_ins= WardType_Master_Detials.objects.get(Ward_Id=Ward)
        Floor_ins = Floor_Master_Detials.objects.get(Floor_Id=Floor)
        print('Waaarrrrd111111',Ward)
        if not RoomType_Master_Detials.objects.filter(Status=True,Floor_Name=Floor_ins,Ward_Name=Ward_ins,Location_Name=Ward_ins.Location_Name).exists():
            return JsonResponse({'error':'Data not found'})
        
        # Fetch all records from the LocationName model
        RoomType_Master = RoomType_Master_Detials.objects.filter(
            Status=True,
            # Building_Name=Ward_ins.Building_Name,
            # Block_Name=Ward_ins.Block_Name,
            # Floor_Name=Ward_ins.Floor_Name,
            Floor_Name = Floor_ins,
            Ward_Name=Ward_ins,
            Location_Name=Ward_ins.Location_Name
            )
        
 
        # Construct a list of dictionaries containing location data
        RoomType_Master_data = []
        for RoomType in RoomType_Master:
            Floor_dict = {
                'id': RoomType.Room_Id,
                'id1': RoomType.Ward_Name.Ward_Id,
                # 'RoomName': RoomType.Room_Name,               
              #  'GST': RoomType.GST_Charge,            
                'RoomNo' : RoomType.RoomNo
            }
            RoomType_Master_data.append(Floor_dict)

        return JsonResponse(RoomType_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



# room master master


@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Room_Master_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'dataaa')
 
            # Extract and validate data
            RoomMasterId = data.get('RoomMasterId', '')
            RoomNo = data.get('RoomNo')
            Room_Id = data.get('Roomid','')
            BedNo = data.get('BedNo')
            BedCount = data.get('BedCount','')
            # NOB = data.get('NOB','')
            WardName = data.get('WardName', '')
            FloorName = data.get('FloorName', '')
            BlockName = data.get('BlockName', '')
            BuildingName = data.get('BuildingName', '')
            Location = data.get('Location', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
 
            # Fetch related instances
            Location_instance = Location_Detials.objects.filter(Location_Id=Location).first()  if Location else None
            Building_instance = Building_Master_Detials.objects.filter(Building_Id=BuildingName).first()  if BuildingName else None
            Block_instance = Block_Master_Detials.objects.filter(Block_Id=BlockName).first()  if BlockName else None
            Floor_instance = Floor_Master_Detials.objects.filter(Floor_Id=FloorName).first()  if FloorName else None
            Ward_instance = RoomType_Master_Detials.objects.filter(Room_Id=RoomNo).first() if WardName else None           
            print(Ward_instance)
 
            if RoomMasterId:
                if Statusedit:
                    Room_master_instance = Room_Master_Detials.objects.get(pk=RoomMasterId)
 
                    # Ensure Booking_Status is 'Available'
                    if Room_master_instance.Booking_Status != 'Available':
                        return JsonResponse({'warn': "Cannot change the status because the Booking_Status is not 'Available'."})
 
                    # Validate parent statuses
                    parent_statuses = []
                    if not Room_master_instance.Building_Name.Status:
                        parent_statuses.append("Building Status")
                    if not Room_master_instance.Block_Name.Status:
                        parent_statuses.append("Block Status")
                    if not Room_master_instance.Floor_Name.Status:
                        parent_statuses.append("Floor Status")
                    if not Room_master_instance.Ward_Name.Status:
                        parent_statuses.append("Ward Status")
 
                    if parent_statuses:
                        return JsonResponse({'warn': f"Cannot change the room status because the following parent statuses are not Active: {', '.join(parent_statuses)}."})
 
                    # Toggle the status
                    Room_master_instance.Status = not Room_master_instance.Status
                    Room_master_instance.save()
 
                    return JsonResponse({'success': "Room status updated successfully."})
                else:
                    # Validate uniqueness of Room Master Details
 
                    Room_master_instance = Room_Master_Detials.objects.get(pk=RoomMasterId)
 
                    existing_beds = Room_Master_Detials.objects.filter(
                        Location_Name=Location_instance,
                        Building_Name=Building_instance,
                        Block_Name=Block_instance,
                        Floor_Name=Floor_instance,
                        Ward_Name=Ward_instance,
                    ).exclude(pk=RoomMasterId)
                   
                    existing_bed_indices = [int(bed.Bed_No) for bed in existing_beds if bed.Bed_No.isdigit()]
 
                    current_bed_count = len(existing_bed_indices)
                    max_bed_index = max(existing_bed_indices, default=0)
 
                    bedincins = Room_Master_Detials.objects.filter(Ward_Name=Room_master_instance.Ward_Name)
 
                    for bci in bedincins:
 
                        bci.NOB = str(BedCount)
                        bci.save()
 
                    if int(BedCount) < current_bed_count:
                        return JsonResponse({'warn': f'Cannot reduce BedCount to {BedCount}. There are already {current_bed_count} beds.'})
                   
                    # Room_master_instance.NOB = str(BedCount)
                    # Room_master_instance.Bed_No = str(max_bed_index + 1)  
                    # Room_master_instance.Ward_Name = Ward_instance
                    # Room_master_instance.Floor_Name = Floor_instance
                    # Room_master_instance.Block_Name = Block_instance
                    # Room_master_instance.Building_Name = Building_instance
                    # Room_master_instance.Location_Name = Location_instance
                    # # Room_master_instance.Status = Statusedit
                    # Room_master_instance.created_by = created_by
                    # Room_master_instance.save()
 
                    new_beds = []
                    for bed_index in range(max_bed_index + 1, int(BedCount) + 1):
                        bed_no = str(bed_index)
                   
                        # Skip if this is the Bed_No being updated in the main instance
                        if bed_no == Room_master_instance.Bed_No:
                            continue
 
                        # Check for duplicate bed number
                        if Room_Master_Detials.objects.filter(
                            Bed_No=bed_no,
                            Location_Name=Location_instance,
                            Building_Name=Building_instance,
                            Block_Name=Block_instance,
                            Floor_Name=Floor_instance,
                            Ward_Name=Ward_instance
                        ).exists():
                            return JsonResponse({'warn': f"Bed {bed_no} already exists."})
 
                        # Create new bed record
                        new_beds.append(
                            Room_Master_Detials(
                                Bed_No=bed_no,
                                NOB=str(BedCount),
                                Location_Name=Location_instance,
                                Building_Name=Building_instance,
                                Block_Name=Block_instance,
                                Floor_Name=Floor_instance,
                                Ward_Name=Ward_instance,
                                Status=True,
                                Booking_Status='Available',
                                created_by=created_by
                            )
                        )
 
                    # Bulk create new beds
                    if new_beds:
                        Room_Master_Detials.objects.bulk_create(new_beds)
 
                    return JsonResponse({
                        'success': f'Room Master Details updated successfully. {len(new_beds)} new beds created.'
                    })
 
 
                #     if Room_Master_Detials.objects.filter(
                #         # Room_No=RoomNo,
                #         Bed_No=BedNo,
                #         Location_Name=Location_instance,
                #         Building_Name=Building_instance,
                #         Block_Name=Block_instance,
                #         Floor_Name=Floor_instance
                #     ).exclude(pk=RoomMasterId).exists():
                #         return JsonResponse({'warn': f"The Room Master Detials are already present in the name of {RoomNo} and {BedNo}."})
                #     else:
                #         # Update the Room Master details
                #         Room_master_instance = Room_Master_Detials.objects.get(pk=RoomMasterId)
                #         # Room_master_instance.Room_No = RoomNo
                #         Room_master_instance.Bed_No = BedNo
                #         Room_master_instance.Ward_Name = Ward_instance
                #         Room_master_instance.Floor_Name = Floor_instance
                #         Room_master_instance.Block_Name = Block_instance
                #         Room_master_instance.Building_Name = Building_instance
                #         Room_master_instance.Location_Name = Location_instance
                #         Room_master_instance.save()
 
                # return JsonResponse({'success': 'Room Master Detials Updated successfully'})
           
            else:
                # Validate uniqueness of Room Master Details
                # if Room_Master_Detials.objects.filter(
                #     # Room_No=RoomNo,
                #     Bed_No=BedNo,
                #     Location_Name=Location_instance,
                #     Building_Name=Building_instance,
                #     Block_Name=Block_instance,
                #     Floor_Name=Floor_instance
                # ).exists():
                #     return JsonResponse({'warn': f"The Room Master Detials are already present in the name of {RoomNo} and {BedNo}."})
                if BedNo:
                 pass
                else:
                    # Create a new Room Master instance
 
                    if BedCount == '1':
 
                        print('one')
 
                        Room_master_instance = Room_Master_Detials(
                            # Room_No=RoomNo,
                            NOB = BedCount,
                            Bed_No=RoomNo,
                            Ward_Name=Ward_instance,
                            Floor_Name=Floor_instance,
                            Block_Name=Block_instance,
                            Building_Name=Building_instance,
                            Location_Name=Location_instance,
                            created_by=created_by
                        )
                        Room_master_instance.save()
                        return JsonResponse({'success': 'Room Master Detials added successfully'})
 
 
                 
                    for i in range(1, int(BedCount) + 1):
                        # bedno = f"{RoomNo} / {str(i)}"
                        bedno = f"{str(i)}"
                        print(bedno)
 
                        if Room_Master_Detials.objects.filter(
                            # Room_No=RoomNo,
                            Bed_No=bedno,
                            Location_Name=Location_instance,
                            Building_Name=Building_instance,
                            Block_Name=Block_instance,
                            Floor_Name=Floor_instance,
                            Ward_Name = Ward_instance,
                        ).exists():
                            return JsonResponse({'warn': f"The Room Master Detials are already present in the name of {RoomNo} and {bedno}."})
 
                   
                        Room_master_instance = Room_Master_Detials(
                            # Room_No=RoomNo,
                            NOB = BedCount,
                            Bed_No=bedno,
                            Ward_Name=Ward_instance,
                            Floor_Name=Floor_instance,
                            Block_Name=Block_instance,
                            Building_Name=Building_instance,
                            Location_Name=Location_instance,
                            created_by=created_by
                        )
                        Room_master_instance.save()
                    return JsonResponse({'success': 'Room Master Detials added successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
       
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            # Room_master_instance = Room_Master_Detials.objects.all().order_by(
            #     'Location_Name__Location_Name',
            #     'Building_Name__Building_Name',
            #     'Block_Name__Block_Name',
            #     'Floor_Name__Floor_Name',
            #     'Ward_Name__Ward_Name',
            #     # '-Room_Name__Room_Name',
            #     # 'Room_No',
            #     'Bed_No',
            #     )
           
            Room_master_instance = Room_Master_Detials.objects.all().order_by(
                'Ward_Name__RoomNo',
            )
 
            print(Room_master_instance,'Room_master_instance')
           
            # Construct a list of dictionaries containing location data
            Room_Master_data = []
            for Roommaster in Room_master_instance:
                RoomMaster_dict = {
                    'id': Roommaster.Room_Id,
                    'RoomNo': Roommaster.Ward_Name.RoomNo,
                    'BedNo': Roommaster.Bed_No,
                    'RoomId': Roommaster.Room_Id,
                    # 'RoomName': Roommaster.Ward_Name.RoomNo,
                    # 'BedCharge': Roommaster.Ward_Name.Current_Charge,
                    'NOB': Roommaster.NOB,
                   # 'GST': Roommaster.Ward_Name.GST_Charge,
                    # 'TotalCharge': Roommaster.Ward_Name.Total_Current_Charge,
                    'WardId': Roommaster.Ward_Name.Ward_Name.Ward_Id,
                    'WardName': Roommaster.Ward_Name.Ward_Name.Ward_Name,
                    'FloorId': Roommaster.Floor_Name.Floor_Id,
                    'FloorName': Roommaster.Floor_Name.Floor_Name,
                    'BlockId': Roommaster.Block_Name.Block_Id,
                    'BlockName': Roommaster.Block_Name.Block_Name,
                    'BuildingId': Roommaster.Building_Name.Building_Id,
                    'BuildingName': Roommaster.Building_Name.Building_Name,
                    'LocationName': Roommaster.Location_Name.Location_Name,
                    'LocationId': Roommaster.Location_Name.Location_Id,
                    'Status': 'Active' if Roommaster.Status else 'Inactive',
                    'created_by': Roommaster.created_by,
                   
                }
                Room_Master_data.append(RoomMaster_dict)
 
            return JsonResponse(Room_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)
 
 
 

def get_RoomNo_Data_by_Building_block_Floor_ward_Room_loc(request):
    try:
        Room = request.GET.get('Room')
        Room_ins =None
        if not Room:
            return JsonResponse({'error':'Room are required'})
        
        Room_ins = RoomType_Master_Detials.objects.get(Room_Id=Room)
        
        if not Room_Master_Detials.objects.filter(
            Status=True,
            Building_Name=Room_ins.Building_Name,
            Block_Name=Room_ins.Block_Name,
            Floor_Name=Room_ins.Floor_Name,
            Ward_Name=Room_ins.Ward_Name,
            Location_Name=Room_ins.Location_Name,
            Room_Name=Room_ins
        ).exists():
            return JsonResponse({'error':'Data not found'})
        
        
        # Fetch all records from the Room_Master_Detials model
        RoomType_Master = Room_Master_Detials.objects.filter(
            Status=True,
            Building_Name=Room_ins.Building_Name,
            Block_Name=Room_ins.Block_Name,
            Floor_Name=Room_ins.Floor_Name,
            Ward_Name=Room_ins.Ward_Name,
            Location_Name=Room_ins.Location_Name,
            Room_Name=Room_ins
        ).values('Room_No').distinct()  # Ensure distinct room numbers

        # Construct a list of dictionaries containing location data
        RoomType_Master_data = []
        index = 0
        for room in RoomType_Master:
            room_dict = {
                'id': index + 1,
                'RoomNo': room['Room_No'], 
            }
            RoomType_Master_data.append(room_dict)
            index += 1

        return JsonResponse(RoomType_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)





def get_BedNo_Data_by_Building_block_Floor_ward_RoomNo_loc(request):
    try:
        Room = request.GET.get('Room')
        RoomNo = request.GET.get('RoomNo')
        
        Room_ins =None
        if not Room and not RoomNo:
            return JsonResponse({'error':'Room are required'})
        
        Room_ins = RoomType_Master_Detials.objects.get(Room_Id=Room)
        
        if not Room_Master_Detials.objects.filter(
            Status=True,
            Building_Name=Room_ins.Building_Name,
            Block_Name=Room_ins.Block_Name,
            Floor_Name=Room_ins.Floor_Name,
            Ward_Name=Room_ins.Ward_Name,
            Location_Name=Room_ins.Location_Name,
            Room_Name=Room_ins,
            Room_No=RoomNo
        ).exists():
            return JsonResponse({'error':'Data not found'})
        
        
        # Fetch all records from the Room_Master_Detials model
        RoomType_Master = Room_Master_Detials.objects.filter(
            Status=True,
            Building_Name=Room_ins.Building_Name,
            Block_Name=Room_ins.Block_Name,
            Floor_Name=Room_ins.Floor_Name,
            Ward_Name=Room_ins.Ward_Name,
            Location_Name=Room_ins.Location_Name,
            Room_Name=Room_ins,
            Room_No=RoomNo,
        ).exclude(Booking_Status = 'Occupied') 
        print('RoomType_Master',RoomType_Master)
       
        RoomType_Master_data = []
        index = 0
        for room in RoomType_Master:
            room_dict = {
                'id': index + 1,
                'BedNo': room.Bed_No, 
                'RoomId':room.Room_Id
            }
            RoomType_Master_data.append(room_dict)
            index += 1

        return JsonResponse(RoomType_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(['GET'])
def get_Room_Master_Data(request):
    try:
        location = request.GET.get('location')
        status = request.GET.get('status', 'Total')
        wardtype = request.GET.get('wardtype', '')
        searchquery = request.GET.get('searchquery', '').strip().lower()

        if not location:
            return JsonResponse({'error': 'Location parameter is required'}, status=400)

        queryset = Room_Master_Detials.objects.select_related(
            'Ward_Name__Ward_Name', 'Floor_Name', 'Block_Name', 'Building_Name', 'Location_Name'
        ).filter(Location_Name__pk=location)

        if status and status != 'Total':
            if status == 'InActive':
                queryset = queryset.filter(Status=False)
            else:
                queryset = queryset.filter(Booking_Status=status)

        if wardtype:
            try:
                ward_name, _ = wardtype.split(" - ")
                queryset = queryset.filter(Ward_Name__Ward_Name__Ward_Name__icontains=ward_name)
            except ValueError:
                return JsonResponse({'error': 'Invalid wardtype format. Use "WardName - RoomNo"'}, status=400)

        queryset = queryset.order_by('Booking_Status', '-Status')

        room_master_data = []

        for room in queryset:
            patient_data = {}

            # Check for rooms with patient admissions
            if room.Booking_Status in ['Booked', 'Occupied', 'Requested']:
                admission_query = Patient_Admission_Room_Detials.objects.filter(RoomId=room)

                if not admission_query.exists():
                    continue

                admission = admission_query.order_by('-created_by').first()

                if admission and admission.IP_Registration_Id:
                    dat = admission.IP_Registration_Id
                    try:
                        admiss_det = get_object_or_404(Patient_Admission_Detials, IP_Registration_Id=dat)

                        patient = dat.PatientId

                        # Prepare values to search
                        first_name = patient.FirstName.lower() if patient and patient.FirstName else ''
                        reg_id = dat.Registration_Id.lower() if dat and dat.Registration_Id else ''
                        phone_no = patient.PhoneNo.lower() if patient and patient.PhoneNo else ''

                        if searchquery and (
                            searchquery not in first_name and
                            searchquery not in reg_id and
                            searchquery not in phone_no
                        ):
                            continue  # Skip if search doesn't match any field

                        patient_data.update({
                            'PatientProfile': patient.Patient_profile if patient else '',
                            'IsCasualityPatient': admiss_det.IsCasualityPatient,
                            'Casuality_Registration_Id': admiss_det.Casuality_Registration_Id,
                            'AdmissionPurpose': admiss_det.AdmissionPurpose,
                            'IP_Registration_Id': dat.Registration_Id if dat else None,
                            'DoctorName': f"{dat.PrimaryDoctor.Tittle.Title_Name if dat.PrimaryDoctor else ''} "
                                        f"{dat.PrimaryDoctor.First_Name if dat.PrimaryDoctor else ''} "
                                        f"{dat.PrimaryDoctor.Middle_Name if dat.PrimaryDoctor else ''} "
                                        f"{dat.PrimaryDoctor.Last_Name if dat.PrimaryDoctor else ''}",
                            'PatientCategory': dat.PatientCategory or '',
                            'Admitdate': admission.Admitted_Date,
                            'PatientID': patient.PatientId if patient else None,
                            'Age': patient.Age if patient else None,
                            'Gender': patient.Gender if patient else None,
                            'BloodGroup': str(patient.BloodGroup) if patient and patient.BloodGroup else None,
                            'PhoneNo': patient.PhoneNo if patient else None,
                            'attenders': admiss_det.NextToKinName,
                            'attenderPhoneNo': admiss_det.RelativePhoneNo,
                            'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}"
                                        if patient and patient.Title else '',
                        })
                    except Exception as e:
                        print(f"Error fetching admission data: {e}")
                        continue
            elif searchquery:
                continue  # If there's no admission and searchquery exists, skip

            elif searchquery:
                # If searchquery is set and no patient info, skip the room
                continue

            room_dict = {
                'id': room.Room_Id,
                'RoomNo': room.Ward_Name.RoomNo if room.Ward_Name else None,
                'BedNo': room.Bed_No,
                'RoomId': room.Ward_Name.Room_Id if room.Ward_Name else None,
                'WardId': room.Ward_Name.Ward_Name.Ward_Id if room.Ward_Name and room.Ward_Name.Ward_Name else None,
                'WardName': room.Ward_Name.Ward_Name.Ward_Name if room.Ward_Name and room.Ward_Name.Ward_Name else None,
                'FloorId': room.Floor_Name.Floor_Id if room.Floor_Name else None,
                'FloorName': room.Floor_Name.Floor_Name if room.Floor_Name else None,
                'BlockId': room.Block_Name.Block_Id if room.Block_Name else None,
                'BlockName': room.Block_Name.Block_Name if room.Block_Name else None,
                'BuildingId': room.Building_Name.Building_Id if room.Building_Name else None,
                'BuildingName': room.Building_Name.Building_Name if room.Building_Name else None,
                'LocationName': room.Location_Name.Location_Name if room.Location_Name else None,
                'LocationId': room.Location_Name.Location_Id if room.Location_Name else None,
                'Status': 'Active' if room.Status else 'Inactive',
                'BookingStatus': room.Booking_Status,
                'created_by': room.created_by,
            }

            room_dict.update(patient_data)
            room_master_data.append(room_dict)

        return JsonResponse(room_master_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'Internal Server Error: {str(e)}'}, status=500)

@csrf_exempt
def get_room_count_data_total(request):
    try:
        if request.method == 'GET':
            location = request.GET.get('Location')
            
            if not location:
                return JsonResponse({'error': 'Location is required'}, status=400)
            
            # Default statuses
            default_statuses = ['Available', 'Requested', 'Booked', 'Occupied', 'Maintenance']
            
            # Initialize a dictionary to hold the total counts and room data
            formatted_data = {
                'totalcount': {
                    'Total': 0,
                    'InActive': 0,
                    **{status: 0 for status in default_statuses}
                },
                'totaldata': []
            }
            
            # Query to get distinct Ward_Type and Room_name
            distinct_ward_rooms = Room_Master_Detials.objects.filter(Location_Name__pk=location).values('Ward_Name__Ward_Name').distinct()
            index = 1
            print('dissssss', distinct_ward_rooms)
            for ward_room in distinct_ward_rooms:
                # Corrected field reference
                room_name = f"{ward_room['Ward_Name__Ward_Name']}"
                
                # Total count for the room
                total_count = Room_Master_Detials.objects.filter(
                    Location_Name__pk=location,
                    Ward_Name__Ward_Name=ward_room['Ward_Name__Ward_Name']
                ).count()
                total_inactive_count = Room_Master_Detials.objects.filter(
                    Location_Name__pk=location,
                    Ward_Name__Ward_Name=ward_room['Ward_Name__Ward_Name'],
                    Status=False
                ).count()

                # Initialize room data with default statuses
                room_data = {
                    "id": index,
                    "roomname": room_name,
                    "Total": total_count,
                    'InActive': total_inactive_count,
                    **{status: 0 for status in default_statuses}  # Initialize default statuses
                }

                # Count occurrences of each status for the room
                for status in default_statuses:
                    count_status = Room_Master_Detials.objects.filter(
                        Location_Name__pk=location,
                        Ward_Name__Ward_Name=ward_room['Ward_Name__Ward_Name'],
                        Booking_Status=status,
                        Status=True
                    ).count()
                    room_data[status] = count_status
                    
                    # Update the total counts for the entire location
                    formatted_data['totalcount'][status] += count_status

                # Append the total count for the room to the overall total count
                formatted_data['totalcount']['Total'] += total_count
                formatted_data['totalcount']['InActive'] += total_inactive_count

                # Append formatted room data to the list
                formatted_data['totaldata'].append(room_data)
                index += 1

            return JsonResponse(formatted_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)




# def get_Room_Master_Data_for_registration(request):
#     try:
#         Location = request.GET.get('location')
#         RegisterType = request.GET.get('RegisterType')
#         Building = request.GET.get('Building')
#         Block = request.GET.get('Block',"")
#         Floor = request.GET.get('Floor',"")
#         Ward = request.GET.get('Ward',"")
#         # Room = request.GET.get('Room',"")
#         print('111111111111',Block, RegisterType)
        
#         filter_kwargs = {
#             'Location_Name__pk': Location,
#             'Status': True,
#             'Booking_Status': 'Available',
#         }

#         # Add the non-empty fields to the filter kwargs
#         if Building:
#             filter_kwargs['Building_Name__pk'] = Building
#         if Block:
#             filter_kwargs['Block_Name__pk'] = Block
#         if Floor:
#             filter_kwargs['Floor_Name__pk'] = Floor
#         if Ward:
#             filter_kwargs['Ward_Name__pk'] = Ward
#         print('22222222')

#         # if Room:
#         #     filter_kwargs['Room_Name__pk'] = Room
#         if RegisterType == 'Casuality':
#             filter_kwargs['Ward_Name__Ward_Name'] = 'CASUALITY'
#         Room_master_instances = None
#         print('kaawwwggg',filter_kwargs)
#         if RegisterType == 'IP':
#             Room_master_instances = Room_Master_Detials.objects.filter(**filter_kwargs).exclude(Ward_Name__Ward_Name__Ward_Name__in=['CASUALITY', 'OT'])
#         elif RegisterType == 'Emergency':
#             Room_master_instances = Room_Master_Detials.objects.filter(**filter_kwargs).exclude(Ward_Name__Ward_Name__Ward_Name__in=['GENERAL', 'OT','ICU'])
 
#         else:
#             Room_master_instances = Room_Master_Detials.objects.filter(**filter_kwargs)
            
#         print('22222222')
#         Room_Master_data = []
        
#         if Room_master_instances:
#             for Roommaster in Room_master_instances:
                

#                 RoomMaster_dict = {
#                     'id': Roommaster.Room_Id,
#                     'RoomNo': Roommaster.Room_No,
#                     'BedNo': Roommaster.Bed_No,
#                     'RoomId': Roommaster.Ward_Name.Room_Id,
#                     'BedCharge': Roommaster.Ward_Name.Current_Charge,
#                     'GST': Roommaster.Ward_Name.GST_Charge,
#                     'TotalCharge': Roommaster.Ward_Name.Total_Current_Charge,
#                     'WardId': Roommaster.Ward_Name.Ward_Name.Ward_Id,
#                     'WardName': Roommaster.Ward_Name.Ward_Name.Ward_Name,
#                     'FloorId': Roommaster.Floor_Name.Floor_Id,
#                     'FloorName': Roommaster.Floor_Name.Floor_Name,
#                     'BlockId': Roommaster.Block_Name.Block_Id,
#                     'BlockName': Roommaster.Block_Name.Block_Name,
#                     'BuildingId': Roommaster.Building_Name.Building_Id,
#                     'BuildingName': Roommaster.Building_Name.Building_Name,
#                     'LocationName': Roommaster.Location_Name.Location_Name,
#                     'LocationId': Roommaster.Location_Name.Location_Id,
#                     'Status': 'Active' if Roommaster.Status else 'Inactive',
#                     'BookingStatus': Roommaster.Booking_Status,
#                     'created_by': Roommaster.created_by,
#                 }

              
#                 Room_Master_data.append(RoomMaster_dict)

#         return JsonResponse(Room_Master_data, safe=False)

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

def get_Room_Master_Data_for_registration(request):
    try:
        # Extract query parameters
        Location = request.GET.get('location')
        RegisterType = request.GET.get('RegisterType')
        Building = request.GET.get('Building')
        Block = request.GET.get('Block')
        Floor = request.GET.get('Floor')
        Ward = request.GET.get('Ward')

        print('Filter inputs:', Block, RegisterType)

        # Base filter conditions
        # filter_kwargs = Q(Status=True, Booking_Status='Available')
        
        filter_kwargs = Q(Status=True)


        if Location:
            filter_kwargs &= Q(Location_Name__Location_Id=Location)
        print(filter_kwargs,'filter_kwargs11111')
        
        if Building:
            filter_kwargs &= Q(Building_Name__Building_Id=Building)
        print(filter_kwargs,'filter_kwargs222222')
        
        if Block:
            filter_kwargs &= Q(Block_Name__Block_Id=Block)
        print(filter_kwargs,'filter_kwargs33333')
        
        if Floor:
            filter_kwargs &= Q(Floor_Name__Floor_Id=Floor)
        print(filter_kwargs,'filter_kwargs44444')
        
        if Ward:
            filter_kwargs &= Q(Ward_Name__Ward_Name__Ward_Id=Ward)  # Adjusted to match model
        print(filter_kwargs, 'filter_kwargs5555555')


        # Special filtering based on RegisterType
        # if RegisterType == 'Emergency':
        #     filter_kwargs &= Q(Ward_Name__Ward_Name='CASUALITY')
        if RegisterType == 'Emergency':
            casualty_ward_ids = WardType_Master_Detials.objects.filter(Ward_Name__in=['CASUALITY']).values_list('Ward_Id', flat=True)
            filter_kwargs &= Q(Ward_Name__Ward_Name__Ward_Id__in=casualty_ward_ids)

        if RegisterType == 'IP':
            exclude_ward_ids = WardType_Master_Detials.objects.exclude(Ward_Name__in=['CASUALITY', 'OT']).values_list('Ward_Id', flat=True)
            filter_kwargs &= Q(Ward_Name__Ward_Name__Ward_Id__in=exclude_ward_ids)
        
        print('Final filter:', filter_kwargs)

        # Fetch filtered room data
        Room_master_instances = Room_Master_Detials.objects.filter(filter_kwargs)
        
        print('Room_master_instances----??',Room_master_instances)
        # Convert queryset to JSON response
        Room_Master_data = [
            {
                'id': room.Room_Id,
                'RoomNo': room.Ward_Name.RoomNo,
                'BedNo': room.Bed_No,
                'RoomId': room.Ward_Name.Room_Id,
                # 'BedCharge': room.Ward_Name.Current_Charge,
             #   'GST': room.Ward_Name.GST_Charge,
                # 'TotalCharge': float(room.Ward_Name.Total_Current_Charge),
                # 'ACCharge': float(room.Ward_Name.Acamt),  # AC amount
                # 'NonACCharge': float(room.Ward_Name.NonACamt),  # Non-AC amount
                # 'isAC': room.Ward_Name.isAC,  # AC status
                
                # 'WardId': room.Ward_Name.Ward_Name.Ward_Id,
                # 'WardName': room.Ward_Name.Ward_Name.Ward_Name,

                # Safe access to nested related Ward object
                'WardId': room.Ward_Name.Ward_Name.Ward_Id if room.Ward_Name and room.Ward_Name.Ward_Name else None,
                'WardName': room.Ward_Name.Ward_Name.Ward_Name if room.Ward_Name and room.Ward_Name.Ward_Name else None,

                'FloorId': room.Floor_Name.Floor_Id,
                'FloorName': room.Floor_Name.Floor_Name,
                'BlockId': room.Block_Name.Block_Id,
                'BlockName': room.Block_Name.Block_Name,
                'BuildingId': room.Building_Name.Building_Id,
                'BuildingName': room.Building_Name.Building_Name,
                'LocationName': room.Location_Name.Location_Name,
                'LocationId': room.Location_Name.Location_Id,
                'Status': 'Active' if room.Status else 'Inactive',
                'BookingStatus': room.Booking_Status,
                'created_by': room.created_by,
            }
            for room in Room_master_instances
        ]
        
        print(Room_Master_data,'Room_Master_data')
        return JsonResponse(Room_Master_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})
    
     
    
# --------------------------------------------------------------------------------------------
import logging

logger = logging.getLogger(__name__)
@csrf_exempt
def update_total_charge(request, room_id):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

    try:
        data = json.loads(request.body)
        logger.info(f"Received data for room {room_id}: {data}")
        
        ac_status = data.get('acStatus')
        if ac_status is None:
            return JsonResponse({'success': False, 'message': 'Missing AC status parameter'})

        # Debug: Log what we're looking for
        logger.info(f"Looking for room with ID: {room_id}")
        
        # Check which model the room ID belongs to
        try:
            # First try to find in RoomType_Master_Detials
            room = RoomType_Master_Detials.objects.get(Room_Id=room_id)
            logger.info(f"Room found in RoomType_Master_Detials for ID {room_id}")
        except RoomType_Master_Detials.DoesNotExist:
            # If not found, try Room_Master_Detials
            try:
                room_master = Room_Master_Detials.objects.get(Room_Id=room_id)
                # Now get the associated RoomType from room_master
                room = room_master.Ward_Name
                logger.info(f"Room found in Room_Master_Detials for ID {room_id}")
            except Room_Master_Detials.DoesNotExist:
                logger.error(f"Room not found in any model for ID {room_id}")
                return JsonResponse({'success': False, 'message': 'Room not found'})

        # Update the AC status
        room.isAC = bool(ac_status)
        # Update the total charge based on AC status
        room.Total_Current_Charge = room.Acamt if room.isAC else room.NonACamt
        room.save()

        return JsonResponse({
            'success': True,
            'message': 'Charge updated successfully',
            'room': {
                'id': room.Room_Id,
                'isAC': room.isAC,
                'TotalCharge': float(room.Total_Current_Charge),
                'ACCharge': float(room.Acamt),
                'NonACCharge': float(room.NonACamt),
            }
        })
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'success': False, 'message': str(e)})
    
         
@require_http_methods(["GET"])
def get_room_data(request):
    try:
        room_id = request.GET.get('roomId')
        print('room_id',room_id)
        room = RoomType_Master_Detials.objects.get(Room_Id=room_id)
        return JsonResponse({
            'success': True,
            'room': {
                'TotalCharge': room.Ward_Name.Amount,
                'isAC': room.Ward_Name.isAC,
                'ACCharge': room.Ward_Name.Acamt,
                'NonACCharge': room.Ward_Name.NonACamt,
            }
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
    
      
    
    
# -------------------------------------------------------------------------------------------
@csrf_exempt
def Vacate_room_booking(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Method not allowed'})

        data = json.loads(request.body)
        room_id = data.get('roomId')
        location = data.get('location')

        if not room_id or not location:
            return JsonResponse({'error': 'Missing required parameters'})

        try:
            room = Room_Master_Detials.objects.get(
                Room_Id=room_id,
                Location_Name__Location_Id=location
            )
            
            if room.Booking_Status == 'Occupied':
                room.Booking_Status = 'Maintenance'
                room.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Room booking cancelled successfully'
                })
            else:
                return JsonResponse({
                    'error': 'Room is not in Booked status',
                    'current_status': room.Booking_Status
                })

        except Room_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Room not found'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        print(f"An error occurred while cancelling room booking: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})
    
@csrf_exempt
def cancel_room_booking(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Method not allowed'})

        data = json.loads(request.body)
        room_id = data.get('roomId')
        location = data.get('location')

        if not room_id or not location:
            return JsonResponse({'error': 'Missing required parameters'})

        try:
            room = Room_Master_Detials.objects.get(
                Room_Id=room_id,
                Location_Name__Location_Id=location
            )
            
            if room.Booking_Status == 'Booked':
                room.Booking_Status = 'Available'
                room.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Room booking cancelled successfully'
                })
            else:
                return JsonResponse({
                    'error': 'Room is not in Booked status',
                    'current_status': room.Booking_Status
                })

        except Room_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Room not found'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        print(f"An error occurred while cancelling room booking: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})
    
@csrf_exempt
def Avilable_room_booking(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Method not allowed'})

        data = json.loads(request.body)
        room_id = data.get('roomId')
        location = data.get('location')

        if not room_id or not location:
            return JsonResponse({'error': 'Missing required parameters'})

        try:
            room = Room_Master_Detials.objects.get(
                Room_Id=room_id,
                Location_Name__Location_Id=location
            )
            
            if room.Booking_Status == 'Maintenance':
                room.Booking_Status = 'Available'
                room.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Room booking cancelled successfully'
                })
            else:
                return JsonResponse({
                    'error': 'Room is not in Booked status',
                    'current_status': room.Booking_Status
                })

        except Room_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Room not found'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        print(f"An error occurred while cancelling room booking: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})
    
@csrf_exempt
def Occupied_room_booking(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Method not allowed'})

        data = json.loads(request.body)
        room_id = data.get('roomId')
        location = data.get('location')

        if not room_id or not location:
            return JsonResponse({'error': 'Missing required parameters'})

        try:
            room = Room_Master_Detials.objects.get(
                Room_Id=room_id,
                Location_Name__Location_Id=location
            )
            
            if room.Booking_Status == 'Booked':
                room.Booking_Status = 'Occupied'
                room.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Room booking cancelled successfully'
                })
            else:
                return JsonResponse({
                    'error': 'Room is not in Booked status',
                    'current_status': room.Booking_Status
                })

        except Room_Master_Detials.DoesNotExist:
            return JsonResponse({'error': 'Room not found'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        print(f"An error occurred while cancelling room booking: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'})
    
# --------------------------------------------------------------------------------------------------------------------------------
# def get_filter_Data_for_registration(request):
#     try:
#         Location = request.GET.get('location')
#         RegisterType = request.GET.get('RegisterType')
        
#         data={
#             'Building':[],
#             'Block':[],
#             'Floor':[],
#             'Ward':[],
#             # 'Room':[],
#         }
#         for buil in Building_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True):
#             data['Building'].append({'id':buil.pk,'Name':buil.Building_Name})
#         for block in Block_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True):
#             data['Block'].append({'id':block.pk,'Name':block.Block_Name})
#         for floor in Floor_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True):
#             data['Floor'].append({'id':floor.pk,'Name':floor.Floor_Name})
        
#         if RegisterType=='IP':
#             for ward in WardType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True).exclude(Ward_Name__in=['CASUALITY', 'OT']):
#                 data['Ward'].append({'id':ward.pk,'Name':ward.Ward_Name})
#             # for room in RoomType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True).exclude(Ward_Name__Ward_Name__in=['CASUALITY', 'OT']):
#                 # data['Room'].append({'id':room.pk,'Name':room.Room_Name})
#         else:
#             for ward in WardType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True,Ward_Name='CASUALITY'):
#                 data['Ward'].append({'id':ward.pk,'Name':ward.Ward_Name})
#             # for room in RoomType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True,Ward_Name__Ward_Name='CASUALITY'):
#             #     data['Room'].append({'id':room.pk,'Name':room.Room_Name})

      
#         return JsonResponse(data)

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)




def get_filter_Data_for_registration(request):
    try:
        Location = request.GET.get('location')
        RegisterType = request.GET.get('RegisterType')
        Building=request.GET.get('Building')
        Block=request.GET.get('Block')
        Floor=request.GET.get('Floor')
        Ward=request.GET.get('Ward')


        print('8877-0099---1111',RegisterType,Building,Block,Floor,Ward)

        data={
            'Building':[],
            'Block':[],
            'Floor':[],
            'Ward':[],
        }
        for buil in Building_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True):
            data['Building'].append({'id':buil.Building_Id,'Name':buil.Building_Name})
        if Building:
            for block in Block_Master_Detials.objects.filter(Location_Name__pk = Location ,Building_Name__Building_Id =Building, Status=True):
                data['Block'].append({'id':block.Block_Id,'Name':block.Block_Name})
        if Block:
            for floor in Floor_Master_Detials.objects.filter(Location_Name__pk = Location ,Block_Name__Block_Id=Block,Status=True):
                data['Floor'].append({'id':floor.Floor_Id,'Name':floor.Floor_Name})
        
        if RegisterType=='IP':
            if Floor:
                for ward in WardType_Master_Detials.objects.filter(Location_Name__pk = Location,Status=True).exclude(Ward_Name__in=['CASUALITY', 'OT']):
                    data['Ward'].append({'id':ward.Ward_Id,'Name':ward.Ward_Name})
            # for room in RoomType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True).exclude(Ward_Name__Ward_Name__in=['CASUALITY', 'OT']):
                # data['Room'].append({'id':room.pk,'Name':room.Room_Name})
        else:
            if Floor:
                for ward in WardType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True,Ward_Name='CASUALITY'):
                    data['Ward'].append({'id':ward.Ward_Id,'Name':ward.Ward_Name})
            # for room in RoomType_Master_Detials.objects.filter(Location_Name__pk = Location ,Status=True,Ward_Name__Ward_Name='CASUALITY'):
            #     data['Room'].append({'id':room.pk,'Name':room.Room_Name})

        print(data,'dataaaaaaaaaaaaa')
        return JsonResponse(data)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)





# -----------------------------------Invvvvv-------------------------------------



# ward name
# @csrf_exempt   
# @require_http_methods(["POST","OPTIONS","GET"])
# def Inventory_Master_Detials_link(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
            
#             # Extract and validate data
#             StoreId = data.get('StoreId', '')
#             StoreName = data.get('StoreName', '')
#             StoreType = data.get('StoreType', '')
#             FloorName = data.get('FloorName', '')
#             BlockName = data.get('BlockName', '')
#             BuildingName = data.get('BuildingName', '')
#             Location = data.get('Location', '')
#             Statusedit = data.get('Statusedit', False)
#             created_by = data.get('created_by', '')
#             approvalConditions = data.get('approvalConditions', [])

#             # Print to check received conditions
#             print('approvalConditions', approvalConditions)

#             # Fetch related instances
#             Location_instance = Location_Detials.objects.get(Location_Id=Location) if Location else None
#             Building_instance = Building_Master_Detials.objects.get(Building_Id=BuildingName) if BuildingName else None
#             Block_instance = Block_Master_Detials.objects.get(Block_Id=BlockName) if BlockName else None
#             Floor_instance = Floor_Master_Detials.objects.get(Floor_Id=FloorName) if FloorName else None

#             # Update Store Details
#             if StoreId:
#                 Inventory_Location_instance = Inventory_Location_Master_Detials.objects.get(pk=StoreId)

#                 if Statusedit:
#                     # Toggle Status
#                     Inventory_Location_instance.Status = not Inventory_Location_instance.Status
#                     Inventory_Location_instance.save()
#                     return JsonResponse({'success': "Store Name status updated successfully."})

#                 else:
#                     if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exclude(pk=StoreId).exists():
#                         return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
                    
#                     if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exclude(pk=StoreId).exists():
#                         return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
                    
#                     # Update store details
#                     Inventory_Location_instance.Store_Name = StoreName
#                     Inventory_Location_instance.Store_Type = StoreType
#                     Inventory_Location_instance.Floor_Name = Floor_instance
#                     Inventory_Location_instance.Block_Name = Block_instance
#                     Inventory_Location_instance.Building_Name = Building_instance
#                     Inventory_Location_instance.Location_Name = Location_instance
#                     Inventory_Location_instance.save()

#                     # Handle approval conditions
#                     Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Inventory_Location_instance).delete()  # Clear existing access

#                     for condition in approvalConditions:
                                    
#                         if condition['id'] == 'PurchaseOrder' :
#                             get_IS_PurchaseOrder = condition['exists']
#                             get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']

                        
#                         if condition['id'] == 'GoodsReceivedNote' :
#                             get_IS_GRN = condition['exists']
#                             get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']

#                         if condition['id'] == 'QuickGoodsReceivedNote' :
#                             get_IS_Quick_GRN = condition['exists']
#                             get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']

#                         if condition['id'] == 'PurchaseReturn' :
#                             get_IS_Purchase_Return = condition['exists']
#                             get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']

#                         if condition['id'] == 'Indent' :
#                             get_IS_Indent = condition['exists']
#                             get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
#                             get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
#                             get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
#                             get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
                            


#                     Inventory_Page_Access_Detailes.objects.create(
#                         Access_StoreId=Inventory_Location_instance,
#                         IS_PurchaseOrder=get_IS_PurchaseOrder,
#                         IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
#                         IS_GRN=get_IS_GRN,
#                         IS_GRN_Approve=get_IS_GRN_Approve,
#                         IS_Quick_GRN=get_IS_Quick_GRN,
#                         IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
#                         IS_Purchase_Return=get_IS_Purchase_Return,
#                         IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
#                         IS_Indent=get_IS_Indent,
#                         IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
#                         IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
#                         IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
#                         IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
#                         updated_by=created_by
#                     )

#                     return JsonResponse({'success': 'Store Name and Approval Conditions updated successfully.'})

#             else:
#                 # Add new store
#                 if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exists():
#                     return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})

#                 if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exists():
#                     return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
                
#                 Inventory_Location_instance = Inventory_Location_Master_Detials(
#                     Store_Name=StoreName,
#                     Store_Type=StoreType,
#                     Floor_Name=Floor_instance,
#                     Block_Name=Block_instance,
#                     Building_Name=Building_instance,
#                     Location_Name=Location_instance,
#                     created_by=created_by
#                 )
#                 Inventory_Location_instance.save()

#                 for condition in approvalConditions:
                                    
#                         if condition['id'] == 'PurchaseOrder' :
#                             get_IS_PurchaseOrder = condition['exists']
#                             get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']

                        
#                         if condition['id'] == 'GoodsReceivedNote' :
#                             get_IS_GRN = condition['exists']
#                             get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']

#                         if condition['id'] == 'QuickGoodsReceivedNote' :
#                             get_IS_Quick_GRN = condition['exists']
#                             get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']

#                         if condition['id'] == 'PurchaseReturn' :
#                             get_IS_Purchase_Return = condition['exists']
#                             get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']

#                         if condition['id'] == 'Indent' :
#                             get_IS_Indent = condition['exists']
#                             get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
#                             get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
#                             get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
#                             get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']


#                 Inventory_Page_Access_Detailes.objects.create(
#                         Access_StoreId=Inventory_Location_instance,
#                         IS_PurchaseOrder=get_IS_PurchaseOrder,
#                         IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
#                         IS_GRN=get_IS_GRN,
#                         IS_GRN_Approve=get_IS_GRN_Approve,
#                         IS_Quick_GRN=get_IS_Quick_GRN,
#                         IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
#                         IS_Purchase_Return=get_IS_Purchase_Return,
#                         IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
#                         IS_Indent=get_IS_Indent,
#                         IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
#                         IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
#                         IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
#                         IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
#                         created_by=created_by
#                     )              

#                 return JsonResponse({'success': 'Store Name and Approval Conditions added successfully.'})

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)  
    
#     elif request.method == 'GET':
#         try:
#             SearchLocation = request.GET.get('SearchLocation')
#             forquickgrn = bool(request.GET.get('forquickgrn', False))

#             Inventory_Location_Master = Inventory_Location_Master_Detials.objects.all()
#             if SearchLocation:
#                 Inventory_Location_Master = Inventory_Location_Master.filter(Location_Name__Location_Id=SearchLocation, Status=True)

#             INLO_Master_data = []
#             for Floor in Inventory_Location_Master:
#                 Floor_dict = {
#                     'id': Floor.Store_Id,
#                     'StoreName': Floor.Store_Name,
#                     'StoreType': Floor.Store_Type,
#                     'FloorId': Floor.Floor_Name.Floor_Id if Floor.Floor_Name else None,
#                     'FloorName': Floor.Floor_Name.Floor_Name if Floor.Floor_Name else None,
#                     'BlockId': Floor.Block_Name.Block_Id if Floor.Block_Name else None,
#                     'BlockName': Floor.Block_Name.Block_Name if Floor.Block_Name else None,
#                     'BuildingId': Floor.Building_Name.Building_Id if Floor.Building_Name else None,
#                     'BuildingName': Floor.Building_Name.Building_Name if Floor.Building_Name else None,
#                     'Location_Name': Floor.Location_Name.Location_Name if Floor.Location_Name else None,
#                     'Location_Id': Floor.Location_Name.Location_Id if Floor.Location_Name else None,
#                     'Status': 'Active' if Floor.Status else 'Inactive',
#                     'created_by': Floor.created_by
#                 }

#                 # Fetch approval conditions for the current store
#                 approval_conditions = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Floor.Store_Id).first()

#                 # Define default approval conditions structure
#                 approvalConditions = [
#                     {
#                         'id': 'PurchaseOrder',
#                         'label': 'Purchase Order',
#                         'exists': approval_conditions.IS_PurchaseOrder if approval_conditions else False,
#                         'additionalOptions': [
#                             {'id': 'PurchaseOrderApprove', 'label': 'Purchase Order Approve', 'checked': approval_conditions.IS_PurchaseOrder_Approve if approval_conditions else False}
#                         ]
#                     },
#                     {
#                         'id': 'GoodsReceivedNote',
#                         'label': 'Goods Received Note',
#                         'exists': approval_conditions.IS_GRN if approval_conditions else False,
#                         'additionalOptions': [
#                             {'id': 'GoodsReceivedNoteApprove', 'label': 'Goods Received Note Approve', 'checked': approval_conditions.IS_GRN_Approve if approval_conditions else False}
#                         ]
#                     },
#                     {
#                         'id': 'QuickGoodsReceivedNote',
#                         'label': 'Quick Goods Received Note',
#                         'exists': approval_conditions.IS_Quick_GRN if approval_conditions else False,
#                         'additionalOptions': [
#                             {'id': 'QuickGoodsReceivedNoteApprove', 'label': 'Quick Goods Received Note Approve', 'checked': approval_conditions.IS_Quick_GRN_Approve if approval_conditions else False}
#                         ]
#                     },
#                     {
#                         'id': 'PurchaseReturn',
#                         'label': 'Purchase Return',
#                         'exists': approval_conditions.IS_Purchase_Return if approval_conditions else False,
#                         'additionalOptions': [
#                             {'id': 'PurchaseReturnApprove', 'label': 'Purchase Return Approve', 'checked': approval_conditions.IS_Purchase_Return_Approve if approval_conditions else False}
#                         ]
#                     },
#                     {
#                         'id': 'Indent',
#                         'label': 'Indent',
#                         'exists': approval_conditions.IS_Indent if approval_conditions else False,
#                         'additionalOptions': [
#                             {'id': 'raiseApprove', 'label': 'Raise Approve', 'checked': approval_conditions.IS_Indent_Raise_Approve if approval_conditions else False},
#                             {'id': 'issueApprove', 'label': 'Issue Approve', 'checked': approval_conditions.IS_Indent_Issue_Approve if approval_conditions else False},
#                             {'id': 'receiveApprove', 'label': 'Receive Approve', 'checked': approval_conditions.IS_Indent_Receive_Approve if approval_conditions else False},
#                             {'id': 'returnApprove', 'label': 'Return Approve', 'checked': approval_conditions.IS_Indent_Return_Approve if approval_conditions else False},
#                         ]
#                     },
#                 ]

#                 Floor_dict['approvalConditions'] = approvalConditions

#                 getSingledata = []

#                 conditions = {
#                     'IS_PurchaseOrder': 'PurchaseOrder',
#                     'IS_PurchaseOrder_Approve': 'PurchaseOrderApprove',
#                     'IS_GRN': 'GoodsReceivedNote',
#                     'IS_GRN_Approve': 'GoodsReceivedNoteApprove',
#                     'IS_Quick_GRN': 'QuickGoodsReceivedNote',
#                     'IS_Quick_GRN_Approve': 'QuickGoodsReceivedNoteApprove',
#                     'IS_Purchase_Return': 'PurchaseReturn',
#                     'IS_Purchase_Return_Approve': 'PurchaseReturnApprove',
#                     'IS_Indent': 'Indent',
#                     'IS_Indent_Raise_Approve': 'IndentRaiseApprove',
#                     'IS_Indent_Issue_Approve': 'IndentIssueApprove',
#                     'IS_Indent_Receive_Approve': 'IndentReceiveApprove',
#                     'IS_Indent_Return_Approve': 'IndentReturnApprove',

#                 }


#                 if approval_conditions:
#                     for condition, label in conditions.items():
#                         if getattr(approval_conditions, condition, False):
#                             getSingledata.append(label)
                
#                 Floor_dict['getSingledata'] =getSingledata
                
#                 INLO_Master_data.append(Floor_dict)

#             return JsonResponse(INLO_Master_data, safe=False)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)





@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Inventory_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract and validate data
            StoreId = data.get('StoreId', '')
            StoreName = data.get('StoreName', '')
            StoreType = data.get('StoreType', '')
            FloorName = data.get('FloorName', '')
            BlockName = data.get('BlockName', '')
            BuildingName = data.get('BuildingName', '')
            IsPointOfSale=data.get('IsPointOfSale','')
            Location = data.get('Location', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
            approvalConditions = data.get('approvalConditions', [])
 
            SelectedDepartmentIDs=data.get('SelectedDepartmentIDs')
 
            # Print to check received conditions
            print('SelectedDepartmentIDs', SelectedDepartmentIDs)
 
            # Fetch related instances
            Location_instance = Location_Detials.objects.get(Location_Id=Location) if Location else None
            Building_instance = Building_Master_Detials.objects.get(Building_Id=BuildingName) if BuildingName else None
            Block_instance = Block_Master_Detials.objects.get(Block_Id=BlockName) if BlockName else None
            Floor_instance = Floor_Master_Detials.objects.get(Floor_Id=FloorName) if FloorName else None
 
            # Update Store Details
            if StoreId:
                Inventory_Location_instance = Inventory_Location_Master_Detials.objects.get(pk=StoreId)
 
                if Statusedit:
                    # Toggle Status
                    Inventory_Location_instance.Status = not Inventory_Location_instance.Status
                    Inventory_Location_instance.save()
                    return JsonResponse({'success': "Store Name status updated successfully."})
 
                else:
                    if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exclude(pk=StoreId).exists():
                        return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
                   
                    if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exclude(pk=StoreId).exists():
                        return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
                   
                    # Update store details
                    Inventory_Location_instance.Store_Name = StoreName
                    Inventory_Location_instance.Store_Type = StoreType
                    Inventory_Location_instance.Floor_Name = Floor_instance
                    Inventory_Location_instance.Block_Name = Block_instance
                    Inventory_Location_instance.Building_Name = Building_instance
                    Inventory_Location_instance.Location_Name = Location_instance                    
                    Inventory_Location_instance.IsPointOfSale = IsPointOfSale
 
                 
 
                    Inventory_Location_instance.save()
 
                    # Handle approval conditions
                    Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Inventory_Location_instance).delete()  # Clear existing access
 
                    for condition in approvalConditions:
                                   
                        if condition['id'] == 'PurchaseOrder' :
                            get_IS_PurchaseOrder = condition['exists']
                            get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']
 
                       
                        if condition['id'] == 'GoodsReceivedNote' :
                            get_IS_GRN = condition['exists']
                            get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'QuickGoodsReceivedNote' :
                            get_IS_Quick_GRN = condition['exists']
                            get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'PurchaseReturn' :
                            get_IS_Purchase_Return = condition['exists']
                            get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'Indent' :
                            get_IS_Indent = condition['exists']
                            get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
                            get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
                            get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
                            # get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
                           
 
 
                    Inventory_Page_Access_Detailes.objects.create(
                        Access_StoreId=Inventory_Location_instance,
                        IS_PurchaseOrder=get_IS_PurchaseOrder,
                        IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
                        IS_GRN=get_IS_GRN,
                        IS_GRN_Approve=get_IS_GRN_Approve,
                        IS_Quick_GRN=get_IS_Quick_GRN,
                        IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
                        IS_Purchase_Return=get_IS_Purchase_Return,
                        IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
                        IS_Indent=get_IS_Indent,
                        IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
                        IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
                        IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
                        # IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
                        updated_by=created_by
                    )
 
                    return JsonResponse({'success': 'Store Name and Approval Conditions updated successfully.'})
 
            else:
                # Add new store
                if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exists():
                    return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
 
                if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exists():
                    return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
               
                Inventory_Location_instance = Inventory_Location_Master_Detials(
                    Store_Name=StoreName,
                    Store_Type=StoreType,
                    Floor_Name=Floor_instance,
                    Block_Name=Block_instance,
                    Building_Name=Building_instance,
                    Location_Name=Location_instance,
                    IsPointOfSale=IsPointOfSale,
                    created_by=created_by
                )
                Inventory_Location_instance.save()  # Save first to generate Store_Id
 
 
 
                # Optionally save again (not required, but safe)
                Inventory_Location_instance.save()
 
                for condition in approvalConditions:
                                   
                        if condition['id'] == 'PurchaseOrder' :
                            get_IS_PurchaseOrder = condition['exists']
                            get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']
 
                       
                        if condition['id'] == 'GoodsReceivedNote' :
                            get_IS_GRN = condition['exists']
                            get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'QuickGoodsReceivedNote' :
                            get_IS_Quick_GRN = condition['exists']
                            get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'PurchaseReturn' :
                            get_IS_Purchase_Return = condition['exists']
                            get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'Indent' :
                            get_IS_Indent = condition['exists']
                            get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
                            get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
                            get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
                            # get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
 
 
                Inventory_Page_Access_Detailes.objects.create(
                        Access_StoreId=Inventory_Location_instance,
                        IS_PurchaseOrder=get_IS_PurchaseOrder,
                        IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
                        IS_GRN=get_IS_GRN,
                        IS_GRN_Approve=get_IS_GRN_Approve,
                        IS_Quick_GRN=get_IS_Quick_GRN,
                        IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
                        IS_Purchase_Return=get_IS_Purchase_Return,
                        IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
                        IS_Indent=get_IS_Indent,
                        IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
                        IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
                        IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
                        # IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
                        created_by=created_by
                    )              
 
                return JsonResponse({'success': 'Store Name and Approval Conditions added successfully.'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)  
   
    elif request.method == 'GET':
        try:
            SearchLocation = request.GET.get('SearchLocation')
            forquickgrn = bool(request.GET.get('forquickgrn', False))
 
            Inventory_Location_Master = Inventory_Location_Master_Detials.objects.all()
            if SearchLocation:
                Inventory_Location_Master = Inventory_Location_Master.filter(Location_Name__Location_Id=SearchLocation, Status=True)
 
            INLO_Master_data = []
            for Floor in Inventory_Location_Master:
                Floor_dict = {
                    'id': Floor.Store_Id,
                    'StoreName': Floor.Store_Name,
                    'StoreType': Floor.Store_Type,
                    'FloorId': Floor.Floor_Name.Floor_Id if Floor.Floor_Name else None,
                    'FloorName': Floor.Floor_Name.Floor_Name if Floor.Floor_Name else None,
                    'BlockId': Floor.Block_Name.Block_Id if Floor.Block_Name else None,
                    'BlockName': Floor.Block_Name.Block_Name if Floor.Block_Name else None,
                    'BuildingId': Floor.Building_Name.Building_Id if Floor.Building_Name else None,
                    'BuildingName': Floor.Building_Name.Building_Name if Floor.Building_Name else None,
                    'Location_Name': Floor.Location_Name.Location_Name if Floor.Location_Name else None,
                    'Location_Id': Floor.Location_Name.Location_Id if Floor.Location_Name else None,
                    'IsPointOfSale': 'Yes' if Floor.IsPointOfSale else 'No',
                    'Status': 'Active' if Floor.Status else 'Inactive',
                    'created_by': Floor.created_by,
                 
                }
 
               
               
                # Fetch approval conditions for the current store              
                approval_conditions = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Floor.Store_Id).first()
 
                # Define default approval conditions structure
                approvalConditions = [
                    {
                        'id': 'PurchaseOrder',
                        'label': 'Purchase Order',
                        'exists': approval_conditions.IS_PurchaseOrder if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'PurchaseOrderApprove', 'label': 'Purchase Order Approve', 'checked': approval_conditions.IS_PurchaseOrder_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'GoodsReceivedNote',
                        'label': 'Goods Received Note',
                        'exists': approval_conditions.IS_GRN if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'GoodsReceivedNoteApprove', 'label': 'Goods Received Note Approve', 'checked': approval_conditions.IS_GRN_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'QuickGoodsReceivedNote',
                        'label': 'Quick Goods Received Note',
                        'exists': approval_conditions.IS_Quick_GRN if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'QuickGoodsReceivedNoteApprove', 'label': 'Quick Goods Received Note Approve', 'checked': approval_conditions.IS_Quick_GRN_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'PurchaseReturn',
                        'label': 'Purchase Return',
                        'exists': approval_conditions.IS_Purchase_Return if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'PurchaseReturnApprove', 'label': 'Purchase Return Approve', 'checked': approval_conditions.IS_Purchase_Return_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'Indent',
                        'label': 'Indent',
                        'exists': approval_conditions.IS_Indent if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'raiseApprove', 'label': 'Raise Approve', 'checked': approval_conditions.IS_Indent_Raise_Approve if approval_conditions else False},
                            {'id': 'issueApprove', 'label': 'Issue Approve', 'checked': approval_conditions.IS_Indent_Issue_Approve if approval_conditions else False},
                            {'id': 'receiveApprove', 'label': 'Receive Approve', 'checked': approval_conditions.IS_Indent_Receive_Approve if approval_conditions else False},
                            # {'id': 'returnApprove', 'label': 'Return Approve', 'checked': approval_conditions.IS_Indent_Return_Approve if approval_conditions else False},
                        ]
                    },
                ]
 
                Floor_dict['approvalConditions'] = approvalConditions
 
                getSingledata = []
 
                conditions = {
                    'IS_PurchaseOrder': 'PurchaseOrder',
                    'IS_PurchaseOrder_Approve': 'PurchaseOrderApprove',
                    'IS_GRN': 'GoodsReceivedNote',
                    'IS_GRN_Approve': 'GoodsReceivedNoteApprove',
                    'IS_Quick_GRN': 'QuickGoodsReceivedNote',
                    'IS_Quick_GRN_Approve': 'QuickGoodsReceivedNoteApprove',
                    'IS_Purchase_Return': 'PurchaseReturn',
                    'IS_Purchase_Return_Approve': 'PurchaseReturnApprove',
                    'IS_Indent': 'Indent',
                    'IS_Indent_Raise_Approve': 'IndentRaiseApprove',
                    'IS_Indent_Issue_Approve': 'IndentIssueApprove',
                    'IS_Indent_Receive_Approve': 'IndentReceiveApprove',
                    # 'IS_Indent_Return_Approve': 'IndentReturnApprove',
 
                }
 
 
                if approval_conditions:
                    for condition, label in conditions.items():
                        if getattr(approval_conditions, condition, False):
                            getSingledata.append(label)
               
                Floor_dict['getSingledata'] =getSingledata
               
                INLO_Master_data.append(Floor_dict)
 
            return JsonResponse(INLO_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Inventory_Master_Detials_link_optical(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract and validate data
            StoreId = data.get('StoreId', '')
            StoreName = data.get('StoreName', '')
            StoreType = data.get('StoreType', '')
            FloorName = data.get('FloorName', '')
            BlockName = data.get('BlockName', '')
            BuildingName = data.get('BuildingName', '')
            IsPointOfSale=data.get('IsPointOfSale','')
            Location = data.get('Location', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
            approvalConditions = data.get('approvalConditions', [])
 
            SelectedDepartmentIDs=data.get('SelectedDepartmentIDs')
 
            # Print to check received conditions
            print('SelectedDepartmentIDs', SelectedDepartmentIDs)
 
            # Fetch related instances
            Location_instance = Location_Detials.objects.get(Location_Id=Location) if Location else None
            Building_instance = Building_Master_Detials.objects.get(Building_Id=BuildingName) if BuildingName else None
            Block_instance = Block_Master_Detials.objects.get(Block_Id=BlockName) if BlockName else None
            Floor_instance = Floor_Master_Detials.objects.get(Floor_Id=FloorName) if FloorName else None
 
            # Update Store Details
            if StoreId:
                Inventory_Location_instance = Inventory_Location_Master_Detials.objects.get(pk=StoreId)
 
                if Statusedit:
                    # Toggle Status
                    Inventory_Location_instance.Status = not Inventory_Location_instance.Status
                    Inventory_Location_instance.save()
                    return JsonResponse({'success': "Store Name status updated successfully."})
 
                else:
                    if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exclude(pk=StoreId).exists():
                        return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
                   
                    if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exclude(pk=StoreId).exists():
                        return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
                   
                    # Update store details
                    Inventory_Location_instance.Store_Name = StoreName
                    Inventory_Location_instance.Store_Type = StoreType
                    Inventory_Location_instance.Floor_Name = Floor_instance
                    Inventory_Location_instance.Block_Name = Block_instance
                    Inventory_Location_instance.Building_Name = Building_instance
                    Inventory_Location_instance.Location_Name = Location_instance                    
                    Inventory_Location_instance.IsPointOfSale = IsPointOfSale
 
                 
 
                    Inventory_Location_instance.save()
 
                    # Handle approval conditions
                    Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Inventory_Location_instance).delete()  # Clear existing access
 
                    for condition in approvalConditions:
                                   
                        if condition['id'] == 'PurchaseOrder' :
                            get_IS_PurchaseOrder = condition['exists']
                            get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']
 
                       
                        if condition['id'] == 'GoodsReceivedNote' :
                            get_IS_GRN = condition['exists']
                            get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'QuickGoodsReceivedNote' :
                            get_IS_Quick_GRN = condition['exists']
                            get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'PurchaseReturn' :
                            get_IS_Purchase_Return = condition['exists']
                            get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'Indent' :
                            get_IS_Indent = condition['exists']
                            get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
                            get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
                            get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
                            # get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
                           
 
 
                    Inventory_Page_Access_Detailes.objects.create(
                        Access_StoreId=Inventory_Location_instance,
                        IS_PurchaseOrder=get_IS_PurchaseOrder,
                        IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
                        IS_GRN=get_IS_GRN,
                        IS_GRN_Approve=get_IS_GRN_Approve,
                        IS_Quick_GRN=get_IS_Quick_GRN,
                        IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
                        IS_Purchase_Return=get_IS_Purchase_Return,
                        IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
                        IS_Indent=get_IS_Indent,
                        IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
                        IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
                        IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
                        # IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
                        updated_by=created_by
                    )
 
                    return JsonResponse({'success': 'Store Name and Approval Conditions updated successfully.'})
 
            else:
                # Add new store
                if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exists():
                    return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
 
                if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exists():
                    return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
               
                Inventory_Location_instance = Inventory_Location_Master_Detials(
                    Store_Name=StoreName,
                    Store_Type=StoreType,
                    Floor_Name=Floor_instance,
                    Block_Name=Block_instance,
                    Building_Name=Building_instance,
                    Location_Name=Location_instance,
                    IsPointOfSale=IsPointOfSale,
                    created_by=created_by
                )
                Inventory_Location_instance.save()  # Save first to generate Store_Id
 
 
 
                # Optionally save again (not required, but safe)
                Inventory_Location_instance.save()
 
                for condition in approvalConditions:
                                   
                        if condition['id'] == 'PurchaseOrder' :
                            get_IS_PurchaseOrder = condition['exists']
                            get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']
 
                       
                        if condition['id'] == 'GoodsReceivedNote' :
                            get_IS_GRN = condition['exists']
                            get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'QuickGoodsReceivedNote' :
                            get_IS_Quick_GRN = condition['exists']
                            get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'PurchaseReturn' :
                            get_IS_Purchase_Return = condition['exists']
                            get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'Indent' :
                            get_IS_Indent = condition['exists']
                            get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
                            get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
                            get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
                            # get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
 
 
                Inventory_Page_Access_Detailes.objects.create(
                        Access_StoreId=Inventory_Location_instance,
                        IS_PurchaseOrder=get_IS_PurchaseOrder,
                        IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
                        IS_GRN=get_IS_GRN,
                        IS_GRN_Approve=get_IS_GRN_Approve,
                        IS_Quick_GRN=get_IS_Quick_GRN,
                        IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
                        IS_Purchase_Return=get_IS_Purchase_Return,
                        IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
                        IS_Indent=get_IS_Indent,
                        IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
                        IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
                        IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
                        # IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
                        created_by=created_by
                    )              
 
                return JsonResponse({'success': 'Store Name and Approval Conditions added successfully.'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)  
   
    elif request.method == 'GET':
        try:
            SearchLocation = request.GET.get('SearchLocation')
            forquickgrn = bool(request.GET.get('forquickgrn', False))
 
            Inventory_Location_Master = Inventory_Location_Master_Detials.objects.filter(Store_Id__in=[9,10])
            if SearchLocation:
                Inventory_Location_Master = Inventory_Location_Master.filter(Location_Name__Location_Id=SearchLocation, Status=True)
 
            INLO_Master_data = []
            for Floor in Inventory_Location_Master:
                Floor_dict = {
                    'id': Floor.Store_Id,
                    'StoreName': Floor.Store_Name,
                    'StoreType': Floor.Store_Type,
                    'FloorId': Floor.Floor_Name.Floor_Id if Floor.Floor_Name else None,
                    'FloorName': Floor.Floor_Name.Floor_Name if Floor.Floor_Name else None,
                    'BlockId': Floor.Block_Name.Block_Id if Floor.Block_Name else None,
                    'BlockName': Floor.Block_Name.Block_Name if Floor.Block_Name else None,
                    'BuildingId': Floor.Building_Name.Building_Id if Floor.Building_Name else None,
                    'BuildingName': Floor.Building_Name.Building_Name if Floor.Building_Name else None,
                    'Location_Name': Floor.Location_Name.Location_Name if Floor.Location_Name else None,
                    'Location_Id': Floor.Location_Name.Location_Id if Floor.Location_Name else None,
                    'IsPointOfSale': 'Yes' if Floor.IsPointOfSale else 'No',
                    'Status': 'Active' if Floor.Status else 'Inactive',
                    'created_by': Floor.created_by,
                 
                }
 
               
               
                # Fetch approval conditions for the current store              
                approval_conditions = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Floor.Store_Id).first()
 
                # Define default approval conditions structure
                approvalConditions = [
                    {
                        'id': 'PurchaseOrder',
                        'label': 'Purchase Order',
                        'exists': approval_conditions.IS_PurchaseOrder if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'PurchaseOrderApprove', 'label': 'Purchase Order Approve', 'checked': approval_conditions.IS_PurchaseOrder_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'GoodsReceivedNote',
                        'label': 'Goods Received Note',
                        'exists': approval_conditions.IS_GRN if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'GoodsReceivedNoteApprove', 'label': 'Goods Received Note Approve', 'checked': approval_conditions.IS_GRN_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'QuickGoodsReceivedNote',
                        'label': 'Quick Goods Received Note',
                        'exists': approval_conditions.IS_Quick_GRN if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'QuickGoodsReceivedNoteApprove', 'label': 'Quick Goods Received Note Approve', 'checked': approval_conditions.IS_Quick_GRN_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'PurchaseReturn',
                        'label': 'Purchase Return',
                        'exists': approval_conditions.IS_Purchase_Return if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'PurchaseReturnApprove', 'label': 'Purchase Return Approve', 'checked': approval_conditions.IS_Purchase_Return_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'Indent',
                        'label': 'Indent',
                        'exists': approval_conditions.IS_Indent if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'raiseApprove', 'label': 'Raise Approve', 'checked': approval_conditions.IS_Indent_Raise_Approve if approval_conditions else False},
                            {'id': 'issueApprove', 'label': 'Issue Approve', 'checked': approval_conditions.IS_Indent_Issue_Approve if approval_conditions else False},
                            {'id': 'receiveApprove', 'label': 'Receive Approve', 'checked': approval_conditions.IS_Indent_Receive_Approve if approval_conditions else False},
                            # {'id': 'returnApprove', 'label': 'Return Approve', 'checked': approval_conditions.IS_Indent_Return_Approve if approval_conditions else False},
                        ]
                    },
                ]
 
                Floor_dict['approvalConditions'] = approvalConditions
 
                getSingledata = []
 
                conditions = {
                    'IS_PurchaseOrder': 'PurchaseOrder',
                    'IS_PurchaseOrder_Approve': 'PurchaseOrderApprove',
                    'IS_GRN': 'GoodsReceivedNote',
                    'IS_GRN_Approve': 'GoodsReceivedNoteApprove',
                    'IS_Quick_GRN': 'QuickGoodsReceivedNote',
                    'IS_Quick_GRN_Approve': 'QuickGoodsReceivedNoteApprove',
                    'IS_Purchase_Return': 'PurchaseReturn',
                    'IS_Purchase_Return_Approve': 'PurchaseReturnApprove',
                    'IS_Indent': 'Indent',
                    'IS_Indent_Raise_Approve': 'IndentRaiseApprove',
                    'IS_Indent_Issue_Approve': 'IndentIssueApprove',
                    'IS_Indent_Receive_Approve': 'IndentReceiveApprove',
                    # 'IS_Indent_Return_Approve': 'IndentReturnApprove',
 
                }
 
 
                if approval_conditions:
                    for condition, label in conditions.items():
                        if getattr(approval_conditions, condition, False):
                            getSingledata.append(label)
               
                Floor_dict['getSingledata'] =getSingledata
               
                INLO_Master_data.append(Floor_dict)
 
            return JsonResponse(INLO_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Inventory_Master_Detials_link_GEN(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract and validate data
            StoreId = data.get('StoreId', '')
            StoreName = data.get('StoreName', '')
            StoreType = data.get('StoreType', '')
            FloorName = data.get('FloorName', '')
            BlockName = data.get('BlockName', '')
            BuildingName = data.get('BuildingName', '')
            IsPointOfSale=data.get('IsPointOfSale','')
            Location = data.get('Location', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
            approvalConditions = data.get('approvalConditions', [])
 
            SelectedDepartmentIDs=data.get('SelectedDepartmentIDs')
 
            # Print to check received conditions
            print('SelectedDepartmentIDs', SelectedDepartmentIDs)
 
            # Fetch related instances
            Location_instance = Location_Detials.objects.get(Location_Id=Location) if Location else None
            Building_instance = Building_Master_Detials.objects.get(Building_Id=BuildingName) if BuildingName else None
            Block_instance = Block_Master_Detials.objects.get(Block_Id=BlockName) if BlockName else None
            Floor_instance = Floor_Master_Detials.objects.get(Floor_Id=FloorName) if FloorName else None
 
            # Update Store Details
            if StoreId:
                Inventory_Location_instance = Inventory_Location_Master_Detials.objects.get(pk=StoreId)
 
                if Statusedit:
                    # Toggle Status
                    Inventory_Location_instance.Status = not Inventory_Location_instance.Status
                    Inventory_Location_instance.save()
                    return JsonResponse({'success': "Store Name status updated successfully."})
 
                else:
                    if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exclude(pk=StoreId).exists():
                        return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
                   
                    if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exclude(pk=StoreId).exists():
                        return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
                   
                    # Update store details
                    Inventory_Location_instance.Store_Name = StoreName
                    Inventory_Location_instance.Store_Type = StoreType
                    Inventory_Location_instance.Floor_Name = Floor_instance
                    Inventory_Location_instance.Block_Name = Block_instance
                    Inventory_Location_instance.Building_Name = Building_instance
                    Inventory_Location_instance.Location_Name = Location_instance                    
                    Inventory_Location_instance.IsPointOfSale = IsPointOfSale
 
                 
 
                    Inventory_Location_instance.save()
 
                    # Handle approval conditions
                    Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Inventory_Location_instance).delete()  # Clear existing access
 
                    for condition in approvalConditions:
                                   
                        if condition['id'] == 'PurchaseOrder' :
                            get_IS_PurchaseOrder = condition['exists']
                            get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']
 
                       
                        if condition['id'] == 'GoodsReceivedNote' :
                            get_IS_GRN = condition['exists']
                            get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'QuickGoodsReceivedNote' :
                            get_IS_Quick_GRN = condition['exists']
                            get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'PurchaseReturn' :
                            get_IS_Purchase_Return = condition['exists']
                            get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'Indent' :
                            get_IS_Indent = condition['exists']
                            get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
                            get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
                            get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
                            # get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
                           
 
 
                    Inventory_Page_Access_Detailes.objects.create(
                        Access_StoreId=Inventory_Location_instance,
                        IS_PurchaseOrder=get_IS_PurchaseOrder,
                        IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
                        IS_GRN=get_IS_GRN,
                        IS_GRN_Approve=get_IS_GRN_Approve,
                        IS_Quick_GRN=get_IS_Quick_GRN,
                        IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
                        IS_Purchase_Return=get_IS_Purchase_Return,
                        IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
                        IS_Indent=get_IS_Indent,
                        IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
                        IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
                        IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
                        # IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
                        updated_by=created_by
                    )
 
                    return JsonResponse({'success': 'Store Name and Approval Conditions updated successfully.'})
 
            else:
                # Add new store
                if Inventory_Location_Master_Detials.objects.filter(Store_Name=StoreName).exists():
                    return JsonResponse({'warn': f"The Store Name Detials are already present in the name of {StoreName}."})
 
                if StoreType == 'CENTRALSTORE' and Inventory_Location_Master_Detials.objects.filter(Store_Type=StoreType).exists():
                    return JsonResponse({'warn': f"A Central Store already exists. Cannot add another Central Store with the name '{StoreName}'."})
               
                Inventory_Location_instance = Inventory_Location_Master_Detials(
                    Store_Name=StoreName,
                    Store_Type=StoreType,
                    Floor_Name=Floor_instance,
                    Block_Name=Block_instance,
                    Building_Name=Building_instance,
                    Location_Name=Location_instance,
                    IsPointOfSale=IsPointOfSale,
                    created_by=created_by
                )
                Inventory_Location_instance.save()  # Save first to generate Store_Id
 
 
 
                # Optionally save again (not required, but safe)
                Inventory_Location_instance.save()
 
                for condition in approvalConditions:
                                   
                        if condition['id'] == 'PurchaseOrder' :
                            get_IS_PurchaseOrder = condition['exists']
                            get_IS_PurchaseOrder_Approve =  condition['additionalOptions'][0]['checked']
 
                       
                        if condition['id'] == 'GoodsReceivedNote' :
                            get_IS_GRN = condition['exists']
                            get_IS_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'QuickGoodsReceivedNote' :
                            get_IS_Quick_GRN = condition['exists']
                            get_IS_Quick_GRN_Approve = condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'PurchaseReturn' :
                            get_IS_Purchase_Return = condition['exists']
                            get_IS_Purchase_Return_Approve =  condition['additionalOptions'][0]['checked']
 
                        if condition['id'] == 'Indent' :
                            get_IS_Indent = condition['exists']
                            get_IS_Indent_Raise_Approve = condition['additionalOptions'][0]['checked']
                            get_IS_Indent_Issue_Approve = condition['additionalOptions'][1]['checked']
                            get_IS_Indent_Receive_Approve = condition['additionalOptions'][2]['checked']
                            # get_IS_Indent_Return_Approve = condition['additionalOptions'][3]['checked']
 
 
                Inventory_Page_Access_Detailes.objects.create(
                        Access_StoreId=Inventory_Location_instance,
                        IS_PurchaseOrder=get_IS_PurchaseOrder,
                        IS_PurchaseOrder_Approve=get_IS_PurchaseOrder_Approve,
                        IS_GRN=get_IS_GRN,
                        IS_GRN_Approve=get_IS_GRN_Approve,
                        IS_Quick_GRN=get_IS_Quick_GRN,
                        IS_Quick_GRN_Approve=get_IS_Quick_GRN_Approve,
                        IS_Purchase_Return=get_IS_Purchase_Return,
                        IS_Purchase_Return_Approve=get_IS_Purchase_Return_Approve,
                        IS_Indent=get_IS_Indent,
                        IS_Indent_Raise_Approve=get_IS_Indent_Raise_Approve,
                        IS_Indent_Issue_Approve=get_IS_Indent_Issue_Approve,
                        IS_Indent_Receive_Approve=get_IS_Indent_Receive_Approve,
                        # IS_Indent_Return_Approve=get_IS_Indent_Return_Approve,
                        created_by=created_by
                    )              
 
                return JsonResponse({'success': 'Store Name and Approval Conditions added successfully.'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)  
   
    elif request.method == 'GET':
        try:
            SearchLocation = request.GET.get('SearchLocation')
            forquickgrn = bool(request.GET.get('forquickgrn', False))
 
            Inventory_Location_Master = Inventory_Location_Master_Detials.objects.filter(Store_Id__in=[5])
            if SearchLocation:
                Inventory_Location_Master = Inventory_Location_Master.filter(Location_Name__Location_Id=SearchLocation, Status=True)
 
            INLO_Master_data = []
            for Floor in Inventory_Location_Master:
                Floor_dict = {
                    'id': Floor.Store_Id,
                    'StoreName': Floor.Store_Name,
                    'StoreType': Floor.Store_Type,
                    'FloorId': Floor.Floor_Name.Floor_Id if Floor.Floor_Name else None,
                    'FloorName': Floor.Floor_Name.Floor_Name if Floor.Floor_Name else None,
                    'BlockId': Floor.Block_Name.Block_Id if Floor.Block_Name else None,
                    'BlockName': Floor.Block_Name.Block_Name if Floor.Block_Name else None,
                    'BuildingId': Floor.Building_Name.Building_Id if Floor.Building_Name else None,
                    'BuildingName': Floor.Building_Name.Building_Name if Floor.Building_Name else None,
                    'Location_Name': Floor.Location_Name.Location_Name if Floor.Location_Name else None,
                    'Location_Id': Floor.Location_Name.Location_Id if Floor.Location_Name else None,
                    'IsPointOfSale': 'Yes' if Floor.IsPointOfSale else 'No',
                    'Status': 'Active' if Floor.Status else 'Inactive',
                    'created_by': Floor.created_by,
                 
                }
 
               
               
                # Fetch approval conditions for the current store              
                approval_conditions = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=Floor.Store_Id).first()
 
                # Define default approval conditions structure
                approvalConditions = [
                    {
                        'id': 'PurchaseOrder',
                        'label': 'Purchase Order',
                        'exists': approval_conditions.IS_PurchaseOrder if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'PurchaseOrderApprove', 'label': 'Purchase Order Approve', 'checked': approval_conditions.IS_PurchaseOrder_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'GoodsReceivedNote',
                        'label': 'Goods Received Note',
                        'exists': approval_conditions.IS_GRN if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'GoodsReceivedNoteApprove', 'label': 'Goods Received Note Approve', 'checked': approval_conditions.IS_GRN_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'QuickGoodsReceivedNote',
                        'label': 'Quick Goods Received Note',
                        'exists': approval_conditions.IS_Quick_GRN if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'QuickGoodsReceivedNoteApprove', 'label': 'Quick Goods Received Note Approve', 'checked': approval_conditions.IS_Quick_GRN_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'PurchaseReturn',
                        'label': 'Purchase Return',
                        'exists': approval_conditions.IS_Purchase_Return if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'PurchaseReturnApprove', 'label': 'Purchase Return Approve', 'checked': approval_conditions.IS_Purchase_Return_Approve if approval_conditions else False}
                        ]
                    },
                    {
                        'id': 'Indent',
                        'label': 'Indent',
                        'exists': approval_conditions.IS_Indent if approval_conditions else False,
                        'additionalOptions': [
                            {'id': 'raiseApprove', 'label': 'Raise Approve', 'checked': approval_conditions.IS_Indent_Raise_Approve if approval_conditions else False},
                            {'id': 'issueApprove', 'label': 'Issue Approve', 'checked': approval_conditions.IS_Indent_Issue_Approve if approval_conditions else False},
                            {'id': 'receiveApprove', 'label': 'Receive Approve', 'checked': approval_conditions.IS_Indent_Receive_Approve if approval_conditions else False},
                            # {'id': 'returnApprove', 'label': 'Return Approve', 'checked': approval_conditions.IS_Indent_Return_Approve if approval_conditions else False},
                        ]
                    },
                ]
 
                Floor_dict['approvalConditions'] = approvalConditions
 
                getSingledata = []
 
                conditions = {
                    'IS_PurchaseOrder': 'PurchaseOrder',
                    'IS_PurchaseOrder_Approve': 'PurchaseOrderApprove',
                    'IS_GRN': 'GoodsReceivedNote',
                    'IS_GRN_Approve': 'GoodsReceivedNoteApprove',
                    'IS_Quick_GRN': 'QuickGoodsReceivedNote',
                    'IS_Quick_GRN_Approve': 'QuickGoodsReceivedNoteApprove',
                    'IS_Purchase_Return': 'PurchaseReturn',
                    'IS_Purchase_Return_Approve': 'PurchaseReturnApprove',
                    'IS_Indent': 'Indent',
                    'IS_Indent_Raise_Approve': 'IndentRaiseApprove',
                    'IS_Indent_Issue_Approve': 'IndentIssueApprove',
                    'IS_Indent_Receive_Approve': 'IndentReceiveApprove',
                    # 'IS_Indent_Return_Approve': 'IndentReturnApprove',
 
                }
 
 
                if approval_conditions:
                    for condition, label in conditions.items():
                        if getattr(approval_conditions, condition, False):
                            getSingledata.append(label)
               
                Floor_dict['getSingledata'] =getSingledata
               
                INLO_Master_data.append(Floor_dict)
 
            return JsonResponse(INLO_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
# Administration name
@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Administration_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("administrationdata", data)
            AdministartionNameId = data.get('AdministartionNameId', '')
            AdministartionName = data.get('AdministartionName','')
            BlockName = data.get('BlockName','')
            FloorName = data.get('FloorName','')
            BuildingName = data.get('BuildingName','')
            Location = data.get('Location','')
            created_by = data.get('created_by','')
            Statusedit = data.get('Statusedit',False)
 
            Location_instance=None
            Building_instance=None
            Block_instance=None
            Floor_instance=None
 
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
           
            if BuildingName:
                Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
               
            if BlockName:
                Block_instance = Block_Master_Detials.objects.get(Block_Id = BlockName)
               
            if FloorName:
                Floor_instance = Floor_Master_Detials.objects.get(Floor_Id = FloorName)
               
            if AdministartionNameId:
                if Statusedit:
                    administration_instance = Administration_Master_Details.objects.get(Administration_Id=AdministartionNameId)
                    administration_instance.Status = not administration_instance.Status
                    administration_instance.save()
                    return JsonResponse({'success': "Administration status updated successfully."})
                else:
 
                    if Administration_Master_Details.objects.filter(Administration_Name=AdministartionName, Location_Name=Location_instance, Building_Name = Building_instance,Block_Name=Block_instance, Floor_Name=Floor_instance).exclude(pk=AdministartionNameId).exists():
                        return JsonResponse({'warn': f"The Administration Details are already present  in the name of {AdministartionName} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name}"})
                    else:
                        administration_instance = Administration_Master_Details.objects.get(pk=AdministartionNameId)
                        administration_instance.Administration_Name = AdministartionName
                        administration_instance.Floor_Name = Floor_instance
                        administration_instance.Block_Name = Block_instance
                        administration_instance.Building_Name = Building_instance
                        administration_instance.Location_Name=Location_instance
                        administration_instance.save()
                    return JsonResponse({'success': 'Administration  Detials Updated successfully'})
 
            else:
                if Administration_Master_Details.objects.filter(Administration_Name=AdministartionName, Location_Name=Location_instance, Building_Name = Building_instance ,Block_Name=Block_instance,Floor_Name=Floor_instance).exists():
                    return JsonResponse({'warn': f"The Administration Detials are already present in the name of {AdministartionName} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name}"})
                else:
                    administration_instance = Administration_Master_Details(
                        Administration_Name=AdministartionName,
                        Building_Name=Building_instance,
                        Block_Name=Block_instance,
                        Floor_Name=Floor_instance,
                        Location_Name=Location_instance,
                        created_by=created_by,
 
 
 
                    )
                    administration_instance.save()
                    return JsonResponse({'success': 'Administration Detials added successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    elif request.method == 'GET':
        try:
            Administration_Master = Administration_Master_Details.objects.all()
            print("Administration_Master",Administration_Master)
            Administration_Master_Data = []
            for administration in Administration_Master:
                administration_dict = {
                    'id': administration.Administration_Id,
                    'AdministrationName':administration.Administration_Name,
                    'FloorId': administration.Floor_Name.Floor_Id,
                    'FloorName': administration.Floor_Name.Floor_Name,
                    'BlockId': administration.Block_Name.Block_Id,
                    'BlockName': administration.Block_Name.Block_Name,
                    'BuildingId': administration.Building_Name.Building_Id,
                    'BuildingName': administration.Building_Name.Building_Name,
                    'Location_Name': administration.Location_Name.Location_Name,
                    'Location_Id': administration.Location_Name.Location_Id,
                    'Status': 'Active' if administration.Status else 'Inactive',
                    'created_by': administration.created_by,
                }
                Administration_Master_Data.append(administration_dict)
            return JsonResponse(Administration_Master_Data, safe=False)
 
       
        except Exception as e:
            return JsonResponse({'error' : 'An internal server error occurred'}, status=500)
 



@csrf_exempt
def NurseStationData(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            # print(data, 'data::::::::')
 
            ward_ids = data.get('SelectedWardIDs', [])
            room_ward_ids = data.get('SelectedRoomIDs', [])
            selected_room_ids = data.get('SelectedRoomIdsForSelection', {})  
            created_by = data.get('created_by', '')
            nurse_station_id = data.get('NurseStationid', None)
 
 
            print(nurse_station_id,'nurse_station_id')
            print(selected_room_ids,'selected_room_ids')
            print(room_ward_ids,'room_ward_ids')
            print(ward_ids,'ward_ids')
 
 
            # Validate room assignments
            room_assignments = {}  # For rooms
 
            # Validate room_ward_ids are of Type 'ROOM'
            for ward_id in room_ward_ids:
 
                print(ward_id,'ward_id')
                try:
                    ward_id = int(ward_id)
                    ward = WardType_Master_Detials.objects.get(Ward_Id=ward_id)
 
                    print(ward,'warddddd')
                    if ward.Type != 'ROOM':
                        return JsonResponse(
                            {"message": f"Ward ID {ward_id} ({ward.Ward_Name}) is not of type ROOM", "type": "error"},
                            status=400
                        )
                except (ValueError, WardType_Master_Detials.DoesNotExist):
                    return JsonResponse(
                        {"message": f"Invalid ward ID in SelectedRoomIDs: {ward_id}", "type": "error"},
                        status=400
                    )
 
            # Check for existing room assignments and validate room-ward relationships
            for ward_id, room_ids in selected_room_ids.items():
 
                print(ward_id,'ward_id',room_ids,'room_ids')
                try:
                    ward_id = int(ward_id)
                    # Ensure ward is of type ROOM
                    ward = WardType_Master_Detials.objects.get(Ward_Id=ward_id)
                    if ward.Type != 'ROOM':
                        return JsonResponse(
                            {"message": f"Ward ID {ward_id} ({ward.Ward_Name}) in SelectedRoomIdsForSelection is not of type ROOM", "type": "error"},
                            status=400
                        )
                    # Ensure ward_id is in SelectedRoomIDs
                    if ward_id not in room_ward_ids:
                        return JsonResponse(
                            {"message": f"Ward ID {ward_id} in SelectedRoomIdsForSelection is not in SelectedRoomIDs", "type": "error"},
                            status=400
                        )
                    for room_id in room_ids:
                        try:
                            room_id = int(room_id)
                            # Validate room belongs to the ward
                            room = RoomType_Master_Detials.objects.get(Room_Id=room_id)
                            print(room,'roominsideeeeeeeee')
                            if room.Ward_Name.Ward_Id != ward_id:
                                return JsonResponse(
                                    {"message": f"Room ID {room_id} ({room.RoomNo}) does not belong to ward ID {ward_id} ({ward.Ward_Name})", "type": "error"},
                                    status=400
                                )
                            # Check for existing room assignment (exclude current nurse station for update)
                           
                            if nurse_station_id:
                                existing_room_detail = NurseStationMasterRoomDetails.objects.filter(
                                    ward_id=ward_id, rooms__Room_Id=room_id
                                ).exclude(nurse_station__NurseStationid=nurse_station_id).first()
 
                                print(existing_room_detail,'existing_room_detail')
                                if existing_room_detail:
                                    existing_station = NurseStationMaster.objects.get(
                                        NurseStationid=existing_room_detail.nurse_station.NurseStationid
                                    )
                                    station_name = existing_station.NurseStationName
                                    if station_name not in room_assignments:
                                        room_assignments[station_name] = []
                                    room_assignments[station_name].append(room.RoomNo)
                            else:
 
                                print('else parttttttttt')
                                existing_room_detail = NurseStationMasterRoomDetails.objects.filter(
                                    ward_id=ward_id, rooms__Room_Id=room_id
                                ).first()
 
                                print(existing_room_detail,'existing_room_detail')
                                if existing_room_detail:
                                    existing_station = NurseStationMaster.objects.get(
                                        NurseStationid=existing_room_detail.nurse_station.NurseStationid
                                    )
                                    station_name = existing_station.NurseStationName
                                    if station_name not in room_assignments:
                                        room_assignments[station_name] = []
                                    room_assignments[station_name].append(room.RoomNo)
                        except (ValueError, RoomType_Master_Detials.DoesNotExist):
                            return JsonResponse(
                                {"message": f"Invalid room ID: {room_id}", "type": "error"},
                                status=400
                            )
                except (ValueError, WardType_Master_Detials.DoesNotExist):
                    return JsonResponse(
                        {"message": f"Invalid ward ID in SelectedRoomIdsForSelection: {ward_id}", "type": "error"},
                        status=400
                    )
 
            # Return warnings if any room assignments exist
            messages = []
            if room_assignments:
                for station_name, rooms in room_assignments.items():
                    room_list = ', '.join(rooms)
                    messages.append(f"Selected rooms {room_list} are already assigned to Nurse Station '{station_name}'")
            if messages:
                return JsonResponse(
                    {"message": '\n'.join(messages), "type": "warn"},
                    status=400
                )
 
            # Prepare data for NurseStationMaster
            fields_to_convert = ['Location_Name', 'Building_Name', 'Block_Name', 'Floor_Name']
            keys_to_remove = ['SelectedWardIDs', 'SelectedRoomIDs', 'WardNames', 'SelectedRoomIdsForSelection', 'NurseStationid']
            nurse_station_data = data.copy()
            for field in fields_to_convert:
                if field in nurse_station_data and nurse_station_data[field]:
                    try:
                        nurse_station_data[field] = int(nurse_station_data[field])
                    except ValueError:
                        return JsonResponse(
                            {"message": f"Invalid {field}: {nurse_station_data[field]}", "type": "error"},
                            status=400
                        )
            for key in keys_to_remove:
                nurse_station_data.pop(key, None)
 
            if nurse_station_id:
                # Update existing nurse station
                try:
                    nurse_station = NurseStationMaster.objects.get(NurseStationid=nurse_station_id)
                except NurseStationMaster.DoesNotExist:
                    return JsonResponse(
                        {"message": f"Nurse Station ID {nurse_station_id} does not exist", "type": "error"},
                        status=404
                    )
                nurse_station_serializer = NurseStationSerializer(nurse_station, data=nurse_station_data, partial=True)
                if not nurse_station_serializer.is_valid():
                    return JsonResponse(nurse_station_serializer.errors, status=400)
                try:
                    nurse_station = nurse_station_serializer.save()
                    # Delete existing ward and room assignments
                    NurseStationMasterDetails.objects.filter(NurseStationid=nurse_station_id).delete()
                    NurseStationMasterRoomDetails.objects.filter(nurse_station=nurse_station_id).delete()
                except Exception as e:
                    print('error updating nurse station:', e)
                    return JsonResponse({"message": "Error updating Nurse Station.", "error": str(e), "type": "error"}, status=500)
            else:
                # Create new nurse station
                nurse_station_serializer = NurseStationSerializer(data=nurse_station_data, context={'request': request})
                if not nurse_station_serializer.is_valid():
                    return JsonResponse(nurse_station_serializer.errors, status=400)
                try:
                    nurse_station = nurse_station_serializer.save()
                except Exception as e:
                    print('error saving nurse station:', e)
                    return JsonResponse({"message": "Error saving Nurse Station.", "error": str(e), "type": "error"}, status=500)
 
            # Save NurseStationMasterDetails
            nurse_station_details_list = []
            for ward_id in ward_ids:
                if ward_id != "ALL":
                    try:
                        ward_id = int(ward_id)
                        detail_data = {
                            'NurseStationid': nurse_station.NurseStationid,
                            'Wardid': ward_id,
                            'created_by': created_by,
                        }
                        details_serializer = NurseStationDetailsSerializer(data=detail_data)
                        if details_serializer.is_valid():
                            detail = details_serializer.save()
                            nurse_station_details_list.append(detail)
                        else:
                            return JsonResponse(details_serializer.errors, status=400)
                    except (ValueError, WardType_Master_Detials.DoesNotExist):
                        return JsonResponse(
                            {"message": f"Invalid ward ID: {ward_id}", "type": "error"},
                            status=400
                        )
 
            # Save NurseStationMasterRoomDetails
            nurse_station_room_details_list = []
            for ward_id, room_ids in selected_room_ids.items():
                try:
                    ward_id = int(ward_id)
                    room_detail_data = {
                        'nurse_station': nurse_station.NurseStationid,
                        'ward': ward_id,
                        'created_by': created_by,
                    }
                    room_detail_serializer = NurseStationRoomDetailsSerializer(data=room_detail_data)
                    if room_detail_serializer.is_valid():
                        room_detail = room_detail_serializer.save()
                        try:
                            rooms = RoomType_Master_Detials.objects.filter(Room_Id__in=room_ids)
                            if len(rooms) != len(room_ids):
                                invalid_ids = [rid for rid in room_ids if not RoomType_Master_Detials.objects.filter(Room_Id=rid).exists()]
                                return JsonResponse(
                                    {"message": f"Invalid room IDs: {invalid_ids}", "type": "error"},
                                    status=400
                                )
                            room_detail.rooms.set(rooms)
                            nurse_station_room_details_list.append(room_detail)
                        except Exception as e:
                            return JsonResponse(
                                {"message": f"Error assigning rooms for ward {ward_id}", "error": str(e), "type": "error"},
                                status=500
                            )
                    else:
                        return JsonResponse(room_detail_serializer.errors, status=400)
                except (ValueError, WardType_Master_Detials.DoesNotExist):
                    return JsonResponse(
                        {"message": f"Invalid ward ID in SelectedRoomIdsForSelection: {ward_id}", "type": "error"},
                        status=400
                    )
 
            return JsonResponse(
                {
                    "message": f"Nurse Station {'updated' if nurse_station_id else 'inserted'} successfully.",
                    "type": "success",
                    "nurse_station": nurse_station_serializer.data,
                    "nurse_station_details": [detail.NurseStationDetailsid for detail in nurse_station_details_list],
                    "nurse_station_room_details": [detail.id for detail in nurse_station_room_details_list],
                },
                status=200 if nurse_station_id else 201
            )
 
        elif request.method == 'GET':
            nurse_stations = NurseStationMaster.objects.all()
            nurse_stations_serialized = NurseStationSerializer(nurse_stations, many=True, context={'request': request})
 
            for idex, station in enumerate(nurse_stations_serialized.data, start=1):
                station["id"] = idex
                station["Status_Name"] = "Active" if station.get('Status') else "InActive"
               
                # Attach wards
                station_details = NurseStationMasterDetails.objects.filter(NurseStationid=station["NurseStationid"])
                details_serialized = NurseStationDetailsSerializer(station_details, many=True)
                station["Wards"] = details_serialized.data
               
                # Attach rooms
                room_details = NurseStationMasterRoomDetails.objects.filter(nurse_station=station["NurseStationid"])
                room_details_serialized = NurseStationRoomDetailsSerializer(room_details, many=True)
                station["Rooms"] = room_details_serialized.data
 
            return JsonResponse(nurse_stations_serialized.data, safe=False)
 
        else:
            return JsonResponse({"message": "Invalid HTTP method.", "type": "error"}, status=405)
 
    except Exception as e:
        print('error:', e)
        return JsonResponse({'message': 'An error occurred.', 'error': str(e), 'type': 'error'}, status=500)
 
 
 


@csrf_exempt
def NurseStationStatusEdit(request):
    try:

        data =json.loads(request.body)
        NurseStationid  = data.get('NurseStationid')

        if NurseStationid:

            nurseststion = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

            nurseststion.Status = not nurseststion.Status
            nurseststion.save()

            return JsonResponse({
                "success": "Nurse Station Status Updated successfully",
            })
                


    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET","POST"])
def NurseStation_Equipment_Link(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)
            print(data,'dataaaaaaa')

            EquipmentsName = data.get('EquipmentsName')
            Stock = data.get('Stock')
            Remarks = data.get('Remarks')
            createdby = data.get('createdby')
            NSEId = data.get('NSEId')
            NurseStationid = data.get('NurseStationid')

            NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

            if NSEId:

                if NSEquipments.objects.filter(EquipmentsName=EquipmentsName,NurseStationid = NurseStationidins).exclude(NSEId=NSEId).exists():
                    return JsonResponse({'warn': {f"{EquipmentsName} Already Exists"}})
                
                else:

                    equipins = NSEquipments.objects.filter(NSEId=NSEId).first()
                    equipins.EquipmentsName = EquipmentsName
                    equipins.Stock = Stock
                    equipins.Remarks = Remarks
                    equipins.updated_by = createdby
                    equipins.save()

                    return JsonResponse({'success': "Equipment Updated Successfully"})


            else:

                if NSEquipments.objects.filter(EquipmentsName=EquipmentsName,NurseStationid = NurseStationidins).exists():
                    return JsonResponse({'warn': {f"{EquipmentsName} Already Exists"}})
                
                else:

                    NSEquipmentsins = NSEquipments(

                        NurseStationid = NurseStationidins,
                        EquipmentsName = EquipmentsName,
                        Stock = Stock,
                        Remarks = Remarks,
                        created_by = createdby,
                    )

                    NSEquipmentsins.save()

            return JsonResponse({'success': f'Equipment Mapped to {NurseStationidins.NurseStationName} Successfully'})










        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == "GET":

        try:

            NurseStationid = request.GET.get('NurseStationid')

            NurseStationidins = NSEquipments.objects.filter(NurseStationid_id=NurseStationid)
            EquipmentList = []

            for datas in NurseStationidins:

                datalist = {

                    'NSEId' : datas.NSEId,
                    'EquipmentsName' : datas.EquipmentsName,
                    'Stock': datas.Stock,
                    'Remarks': datas.Remarks
                }
                EquipmentList.append(datalist)

            for idx, patient in enumerate(EquipmentList, start=1):
                      patient["Sno"] = idx
 
            return JsonResponse(EquipmentList,safe=False)


        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET","POST"])
def NurseStation_Instrument_Link(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)
            print(data,'dataaaaaaa')

            InstrumentName = data.get('InstrumentName')
            Stock = data.get('Stock')
            Remarks = data.get('Remarks')
            createdby = data.get('createdby')
            NSIId = data.get('NSIId')
            NurseStationid = data.get('NurseStationid')

            NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

            if NSIId:

                if NSInstruments.objects.filter(InstrumentsName=InstrumentName,NurseStationid = NurseStationidins).exclude(NSIId=NSIId).exists():

                    return JsonResponse({'warn': {f"{InstrumentName} Already Exists"}})
                else:
                    instrumentins = NSInstruments.objects.filter(NSIId=NSIId).first()
                    instrumentins.InstrumentsName = InstrumentName
                    instrumentins.Stock = Stock
                    instrumentins.Remarks = Remarks
                    instrumentins.updated_by = createdby
                    instrumentins.save()

                    return JsonResponse({'success': "Instrument Updated Successfully"})


            else:

                if NSInstruments.objects.filter(InstrumentsName=InstrumentName,NurseStationid = NurseStationidins).exists():

                    return JsonResponse({'warn': {f"{InstrumentName} Already Exists"}})
                
                else:

                    NSEquipmentsins = NSInstruments(

                        NurseStationid = NurseStationidins,
                        InstrumentsName = InstrumentName,
                        Stock = Stock,
                        Remarks = Remarks,
                        created_by = createdby,
                    )


                    NSEquipmentsins.save()

            return JsonResponse({'success': f'Instrument Mapped to {NurseStationidins.NurseStationName} Successfully'})



        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == "GET":

        try:

            NurseStationid = request.GET.get('NurseStationid')

            NurseStationidins = NSInstruments.objects.filter(NurseStationid_id=NurseStationid)
            EquipmentList = []

            for datas in NurseStationidins:

                datalist = {

                    'NSIId' : datas.NSIId,
                    'InstrumentName' : datas.InstrumentsName,
                    'Stock': datas.Stock,
                    'Remarks': datas.Remarks
                }
                EquipmentList.append(datalist)

            for idx, patient in enumerate(EquipmentList, start=1):
                      patient["Sno"] = idx
 
            return JsonResponse(EquipmentList,safe=False)


        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET","POST"])
def NurseStation_Furniture_Link(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)
            print(data,'dataaaaaaa')

            FurnituresName = data.get('FurnituresName')
            Stock = data.get('Stock')
            Remarks = data.get('Remarks')
            createdby = data.get('createdby')
            NSFId = data.get('NSFId')
            NurseStationid = data.get('NurseStationid')

            NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

            if NSFId:

                if NSFurniture.objects.filter(FurnitureName=FurnituresName,NurseStationid = NurseStationidins).exclude(NSFId=NSFId).exists():

                    return JsonResponse({'warn': {f"{FurnituresName} Already Exists"}})
                
                else:

                    equipins = NSFurniture.objects.filter(NSFId=NSFId).first()
                    equipins.FurnitureName = FurnituresName
                    equipins.Stock = Stock
                    equipins.Remarks = Remarks
                    equipins.updated_by = createdby
                    equipins.save()

                    return JsonResponse({'success': "Furniture Updated Successfully"})





            else:

                if NSFurniture.objects.filter(FurnitureName=FurnituresName,NurseStationid = NurseStationidins).exists():

                    return JsonResponse({'warn': {f"{FurnituresName} Already Exists"}})
                
                else:

                    NSEquipmentsins = NSFurniture(

                        NurseStationid = NurseStationidins,
                        FurnitureName = FurnituresName,
                        Stock = Stock,
                        Remarks = Remarks,
                        created_by = createdby,
                    )

                    NSEquipmentsins.save()

            return JsonResponse({'success': f'Furniture Mapped to {NurseStationidins.NurseStationName} Successfully'})










        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == "GET":

        try:

            NurseStationid = request.GET.get('NurseStationid')

            NurseStationidins = NSFurniture.objects.filter(NurseStationid_id=NurseStationid)
            EquipmentList = []

            for datas in NurseStationidins:

                datalist = {

                    'NSFId' : datas.NSFId,
                    'FurnitureName' : datas.FurnitureName,
                    'Stock': datas.Stock,
                    'Remarks': datas.Remarks
                }
                EquipmentList.append(datalist)

            for idx, patient in enumerate(EquipmentList, start=1):
                      patient["Sno"] = idx
 
            return JsonResponse(EquipmentList,safe=False)


        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
         
@csrf_exempt
@require_http_methods(["GET","POST"])
def NurseStation_Consumable_Link(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)
            print(data,'dataaaaaaa')

            ConsumableName = data.get('ConsumableName')
            ExpiryDate = data.get('ExpiryDate') or None
            Stock = data.get('Stock')
            Remarks = data.get('Remarks')
            createdby = data.get('createdby')
            NSCId = data.get('NSCId')
            NurseStationid = data.get('NurseStationid')

            NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()

            if NSCId:

                if NSConsumables.objects.filter(ConsumablesName=ConsumableName,NurseStationid = NurseStationidins).exclude(NSCId=NSCId).exists():

                    return JsonResponse({'warn': f"{ConsumableName} Already Exists"})
                
                else:

                    equipins = NSConsumables.objects.filter(NSCId=NSCId).first()
                    equipins.ConsumablesName = ConsumableName
                    equipins.Stock = Stock
                    equipins.Remarks = Remarks
                    equipins.updated_by = createdby
                    equipins.ExpiryDate = ExpiryDate 
                    equipins.save()
                    
                    return JsonResponse({'success': "Consumable Updated Successfully"})





            else:

                if NSConsumables.objects.filter(ConsumablesName=ConsumableName,NurseStationid = NurseStationidins).exists():

                    return JsonResponse({'warn': f"{ConsumableName} Already Exists"})
                
                else:

                    NSEquipmentsins = NSConsumables(

                        NurseStationid = NurseStationidins,
                        ConsumablesName = ConsumableName,
                        Stock = Stock,
                        Remarks = Remarks,
                        created_by = createdby,
                        ExpiryDate = ExpiryDate
                    )

                    NSEquipmentsins.save()

            return JsonResponse({'success': f'Consumable Mapped to {NurseStationidins.NurseStationName} Successfully'})










        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

    elif request.method == "GET":

        try:

            NurseStationid = request.GET.get('NurseStationid')

            NurseStationidins = NSConsumables.objects.filter(NurseStationid_id=NurseStationid)
            EquipmentList = []

            for datas in NurseStationidins:

                datalist = {

                    'NSCId' : datas.NSCId,
                    'ConsumablesName' : datas.ConsumablesName,
                    'Stock': datas.Stock,
                    'Remarks': datas.Remarks,
                    'ExpiryDate':datas.ExpiryDate
                }
                EquipmentList.append(datalist)

            for idx, patient in enumerate(EquipmentList, start=1):
                      patient["Sno"] = idx
 
            return JsonResponse(EquipmentList,safe=False)


        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET","POST"])
def NurseStation_Pharmacy_Link(request):
 
    if request.method == "POST":
 
        try:
 
            data = json.loads(request.body)
            print(data,'dataaaaaaa')
 
            Stockid = data.get('Stockid')
            Expiry_Date = data.get('Expiry_Date') or None
            ItemCode = data.get('ItemCode')
            Batch_No = data.get('Batch_No')
            createdby = data.get('createdby')
            AvailableQuantity = data.get('AvailableQuantity') or 0
            IssuedQuantity = data.get('IssuedQuantity') or 0
            ReplacedQuantity = data.get('ReplacedQuantity') or 0
            NurseStationid = data.get('NurseStationid')
 
            FinalQuantity = 0
 
            NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()
            Stockidins = Stock_Maintance_Table_Detials.objects.filter(pk=Stockid).first()
            Product_Detialsins = Product_Master_All_Category_Details.objects.filter(pk=ItemCode).first()
 
 
            if IssuedQuantity != 0:
 
                print(IssuedQuantity,'IssuedQuantity')
 
                FinalQuantity =  int(AvailableQuantity) - int(IssuedQuantity)
 
 
                issueins = Stock_Maintance_Table_Detials.objects.filter(pk=Stockid).first()
                issueins.AvailableQuantity = issueins.AvailableQuantity - int(IssuedQuantity)
                issueins.save()
 
            if ReplacedQuantity != 0:
                print(ReplacedQuantity,'ReplacedQuantity')
                FinalQuantity =  int(AvailableQuantity) + int(ReplacedQuantity)
 
                replaceins = Stock_Maintance_Table_Detials.objects.filter(pk=Stockid).first()
                replaceins.AvailableQuantity = replaceins.AvailableQuantity + int(ReplacedQuantity)
                replaceins.save()
 
            NSPharmacyins = NSPharmacy(
 
                NurseStationid = NurseStationidins,
                Stockid = Stockidins,
                Product_Detials = Product_Detialsins,
                AvailableQuantity = AvailableQuantity,
                IssuedQuantity = IssuedQuantity,
                ReplacedQuantity = ReplacedQuantity,
                FinalQuantity = FinalQuantity,
                issued_by = createdby,
                Replaced_by = createdby,
            )
 
            NSPharmacyins.save()
 
            return JsonResponse({'success': f'Pharmacy Stock Details Stored Successfully'})
 
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
 
 
 



def get_Ward_Data_by_Floor_loc(request):
    try:
        LocationName = request.GET.get('LocationName')
       
        if not LocationName:
            return JsonResponse({'error': 'Location is required'})
       
        # Get the Floor instance
        try:
            Location_ins = Location_Detials.objects.get(Location_Id=LocationName)
        except Location_Detials.DoesNotExist:
            return JsonResponse({'error': 'Location not found'})
       
        # Base query for WardType_Master_Details
        ward_query = WardType_Master_Detials.objects.filter(
            Status=True,
            # Building_Name=Floor_ins.Building_Name,
            # Block_Name=Floor_ins.Block_Name,
            # Floor_Name=Floor_ins,
            Location_Name=Location_ins
        )
               
        # If no Ward records found
        if not ward_query.exists():
            return JsonResponse({'error': 'No Ward data found'}, status=404)
       
        # Construct response data
        Ward_Master_data = [{'id': Ward.Ward_Id, 'WardName': Ward.Ward_Name,'Type':Ward.Type} for Ward in ward_query]
       
        Ward_Master_data.insert(0,{'id': 'ALL', 'WardName': 'ALL' })
 
        return JsonResponse(Ward_Master_data, safe=False)
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
   
 
def get_roomdetails_by_ward(request):

    try:

        id = request.GET.get('id')

        roomdatas = RoomType_Master_Detials.objects.filter(Ward_Name_id=id,Status=True)

        roomdatalist = []

        for datas in roomdatas:

            datalist = {
                'RoomNo' : datas.RoomNo,
                'Roomid' : datas.Room_Id
            }
            roomdatalist.append(datalist)

        return JsonResponse(roomdatalist, safe=False)



    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    
    

@csrf_exempt
def get_Building_data(request):
 
    try:
      if request.method == 'GET':
 
        building_ins = Building_Master_Detials.objects.all()
        building_data_list = []
        for datas in building_ins:
            data_dict = {
                'id': datas.Building_Id,
                'BuildingName': datas.Building_Name
            }
            building_data_list.append(data_dict)
 
 
 
        return JsonResponse(building_data_list,safe = False)
 
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},status=500)
   
@csrf_exempt
def get_floor_data_by_Block(request):
 
    try:
      if request.method == 'GET':
 
        Block = request.GET.get('Block')
 
        Floor_ins = Floor_Master_Detials.objects.filter(Block_Name_id=Block)
        floor_data_list = []
        for datas in Floor_ins:
            data_dict = {
                'id': datas.Floor_Id,
                'FloorName': datas.Floor_Name
            }
            floor_data_list.append(data_dict)
 
 
 
        return JsonResponse(floor_data_list,safe = False)
 
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},status=500)
 
@csrf_exempt
def get_Ward_details_by_floor(request):
 
    try:
      if request.method == 'GET':
 
        Floor = request.GET.get('Floor')
 
        Ward_ins = WardType_Master_Detials.objects.filter(Floor_Name_id=Floor)
       
       
        bed_details = []
        for datas in Ward_ins:
           
            rooms = Room_Master_Detials.objects.filter(Ward_Name_id=datas.Ward_Id)
            unique_rooms = {}
 
            for room in rooms:
                    room_no = room.Ward_Name.RoomNo
                    if room_no not in unique_rooms:
                        unique_rooms[room_no] = {
                            "RoomNo": room_no,
                            "Beds": []
                        }
                    unique_rooms[room_no]["Beds"].append({
                        "BedId": room.Room_Id,
                        "BedNo": room.Bed_No,
                        "status":room.Booking_Status
                    })
 
            ward_data = {
                    'WardId': datas.Ward_Id,
                    'WardName': datas.Ward_Name,
                    "Rooms": list(unique_rooms.values())
                }
            bed_details.append(ward_data)
           
       
 
 
 
        return JsonResponse(bed_details,safe = False)
 
 
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'},status=500)
 

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Consultation_Room_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("administrationdata", data)
            ConsultationId = data.get('ConsultationId', '')
            ConsultationroomName = data.get('ConsultationroomName','')
            BlockName = data.get('BlockName','')
            FloorName = data.get('FloorName','')
            BuildingName = data.get('BuildingName','')
            Location = data.get('Location','')
            created_by = data.get('created_by','')
            Statusedit = data.get('Statusedit',False)
            Specialization = data.get('Specialization','')
            OPNo = data.get('OPNo','')
 
            Location_instance=None
            Building_instance=None
            Block_instance=None
            Floor_instance=None
            Speciality_instance=None
           
 
            if Location:
                Location_instance = Location_Detials.objects.get(Location_Id = Location)
           
            if BuildingName:
                Building_instance = Building_Master_Detials.objects.get(Building_Id = BuildingName)
               
            if BlockName:
                Block_instance = Block_Master_Detials.objects.get(Block_Id = BlockName)
               
            if FloorName:
                Floor_instance = Floor_Master_Detials.objects.get(Floor_Id = FloorName)
 
            if Specialization:
                Speciality_instance = Speciality_Detials.objects.get(Speciality_Id=Specialization)
 
               
            if ConsultationId:
                if Statusedit:
                    consultation_instance = Consultaion_Room_Master_Details.objects.get(Con_Room_Id=ConsultationId)
                    consultation_instance.Status = not consultation_instance.Status
                    consultation_instance.save()
                    return JsonResponse({'success': "Consultation Room status updated successfully."})
                else:
 
                    if Consultaion_Room_Master_Details.objects.filter(Con_Room_Name=ConsultationroomName, Location_Name=Location_instance, Building_Name = Building_instance,Block_Name=Block_instance, Floor_Name=Floor_instance).exclude(pk=ConsultationId).exists():
                        return JsonResponse({'warn': f"The Consultation room Details are already present  in the name of {ConsultationroomName} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name}"})
                    else:
                        consultation_instance = Consultaion_Room_Master_Details.objects.get(pk=ConsultationId)
                        consultation_instance.Con_Room_Name = ConsultationroomName
                        consultation_instance.Floor_Name = Floor_instance
                        consultation_instance.Block_Name = Block_instance
                        consultation_instance.Building_Name = Building_instance
                        consultation_instance.Location_Name=Location_instance
                        consultation_instance.Speciality = Speciality_instance
                        consultation_instance.OPNo = OPNo
                        consultation_instance.save()
                    return JsonResponse({'success': 'Consultation Room  Detials Updated successfully'})
 
            else:
                if Consultaion_Room_Master_Details.objects.filter(Con_Room_Name=ConsultationroomName, Location_Name=Location_instance, Building_Name = Building_instance ,Block_Name=Block_instance,Floor_Name=Floor_instance).exists():
                    return JsonResponse({'warn': f"The Consultation Room Detials are already present in the name of {ConsultationroomName} and {Location_instance.Location_Name} and {Building_instance.Building_Name} and {Block_instance.Block_Name} and {Floor_instance.Floor_Name}"})
                else:
                    consultation_instance = Consultaion_Room_Master_Details(
                        Con_Room_Name=ConsultationroomName,
                        Building_Name=Building_instance,
                        Block_Name=Block_instance,
                        Floor_Name=Floor_instance,
                        Location_Name=Location_instance,
                        OPNo = OPNo,
                        Speciality = Speciality_instance,
                        created_by=created_by,
 
                    )
                    consultation_instance.save()
                    return JsonResponse({'success': 'Consultation Room Detials added successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    elif request.method == 'GET':
        try:
            Consultation_Room_Master = Consultaion_Room_Master_Details.objects.all()
            print("Administration_Master",Consultation_Room_Master)
            Consultation_Room_Master_Data = []
            for consultation in Consultation_Room_Master:
                consultation_dict = {
                    'id': consultation.Con_Room_Id,
                    'ConsultationroomName':consultation.Con_Room_Name,
                    'FloorId': consultation.Floor_Name.Floor_Id,
                    'FloorName': consultation.Floor_Name.Floor_Name,
                    'BlockId': consultation.Block_Name.Block_Id,
                    'BlockName': consultation.Block_Name.Block_Name,
                    'BuildingId': consultation.Building_Name.Building_Id,
                    'BuildingName': consultation.Building_Name.Building_Name,
                    'Location_Name': consultation.Location_Name.Location_Name,
                    'Location_Id': consultation.Location_Name.Location_Id,
                    'SpecialityId':consultation.Speciality.Speciality_Id if consultation.Speciality else None,
                    'SpecialityName':consultation.Speciality.Speciality_Name if consultation.Speciality else None,
                    'OPNo':consultation.OPNo,
                    'Status': 'Active' if consultation.Status else 'Inactive',
                    'created_by': consultation.created_by,
                }
                Consultation_Room_Master_Data.append(consultation_dict)
            return JsonResponse(Consultation_Room_Master_Data, safe=False)
 
       
        except Exception as e:
            return JsonResponse({'error' : 'An internal server error occurred'}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def inventory_page_access_by_storeid(request):
    if request.method == 'GET':
        try:
            Storeid = request.GET.get('Storeid')
            print("Storeid----------------", Storeid)
 
            if not Storeid:
                return JsonResponse({'warn': 'Storeid parameter is required'}, status=400)
 
            store_data = []
            inventory_stores = Inventory_Location_Master_Detials.objects.filter(Store_Id=Storeid)  # Use filter instead of get
 
            if not inventory_stores.exists():
                return JsonResponse({'warn': 'No stores found for this Storeid'}, status=404)
 
            for store in inventory_stores:
                store_dict = {
                    'storeid': store.Store_Id,
                    'storename': store.Store_Name,
                }
 
                page_access_list = Inventory_Page_Access_Detailes.objects.filter(Access_StoreId=store.Store_Id)  # Use filter
 
                page_access_data = []
                for page in page_access_list:
                    page_dict = {
                        'IS_PurchaseOrder': True,
                        'IS_PurchaseOrder_Approve': True,
                        'IS_GRN': True,
                        'IS_GRN_Approve': True,
                        'IS_Quick_GRN': True,
                        'IS_Quick_GRN_Approve': True,
                        'IS_Purchase_Return': True,
                        'IS_Purchase_Return_Approve': True,
                        'IS_Indent': True,
                        'IS_Indent_Raise_Approve': True,
                        'IS_Indent_Issue_Approve': True,
                        'IS_Indent_Receive_Approve': True,
                       
                    }
                    page_access_data.append(page_dict)
                # for page in page_access_list:
                #     page_dict = {
                #         'IS_PurchaseOrder': page.IS_PurchaseOrder,
                #         'IS_PurchaseOrder_Approve': page.IS_PurchaseOrder_Approve,
                #         'IS_GRN': page.IS_GRN,
                #         'IS_GRN_Approve': page.IS_GRN_Approve,
                #         'IS_Quick_GRN': page.IS_Quick_GRN,
                #         'IS_Quick_GRN_Approve': page.IS_Quick_GRN_Approve,
                #         'IS_Purchase_Return': page.IS_Purchase_Return,
                #         'IS_Purchase_Return_Approve': page.IS_Purchase_Return_Approve,
                #         'IS_Indent': page.IS_Indent,
                #         'IS_Indent_Raise_Approve': page.IS_Indent_Raise_Approve,
                #         'IS_Indent_Issue_Approve': page.IS_Indent_Issue_Approve,
                #         'IS_Indent_Receive_Approve': page.IS_Indent_Receive_Approve,
                       
                #     }
                #     page_access_data.append(page_dict)
 
                store_dict['page_access'] = page_access_data
                store_data.append(store_dict)
 
            return JsonResponse(store_data, status=200, safe=False)  # ✅ FIXED
 
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




# @csrf_exempt     
# def room_ratecard_details_view_by_room_id(request):
#     try:
#         room_id = request.GET.get('RoomId')
       
#         if room_id:
#             room = RoomType_Master_Detials.objects.get(pk=room_id)
#             ratecard = Room_Ratecard_Master.objects.get(Room_Id=room)
#             insurance_fees = Insurance_Room_Fee.objects.filter(Room_Ratecard=ratecard)
#             client_fees = Client_Room_Fee.objects.filter(Room_Ratecard=ratecard)
#             corporate_fees = Corporate_Room_Fee.objects.filter(Room_Ratecard=ratecard)
           
#             room_data = {
#                 'id': room.Room_Id,
#                 'room_name': f"{room.Floor_Name.Floor_Name}-{room.Ward_Name.Ward_Name}-{room.RoomNo or ''}",
#                 'Status': 'Active' if room.Status else 'Inactive',
#                 'Ratecarddetials': [
#                     {
#                         'id': 1,
#                         'isrowgroup': False,
#                         'RatecardType': 'General',
#                         'RatecardShow': 'General',
#                         'RatecardName': None,
#                         'room_ratecard_id': ratecard.RateCard_Id,
#                         'prev_fee': ratecard.Prev_Fee,
#                         'curr_fee': ratecard.Fee,
#                         'prev_ac_fee': ratecard.Prev_AC_Fee,
#                         'curr_ac_fee': ratecard.AC_Fee,
#                         'prev_nac_fee': ratecard.Prev_NAC_Fee,
#                         'curr_nac_fee': ratecard.NAC_Fee,
#                     }
#                 ]
#             }
 
#             # Add insurance fees as a grouped section
#             if insurance_fees:
#                 room_data['Ratecarddetials'].append({
#                     'id': len(room_data['Ratecarddetials']) + 1,
#                     'isrowgroup': True,
#                     'RatecardType': 'Insurance',
#                     'RatecardShow': 'Insurance',
#                     'RatecardName': None,
#                     'prev_fee': None,
#                     'curr_fee': None,
#                     'prev_ac_fee': None,
#                     'curr_ac_fee': None,
#                     'prev_nac_fee': None,
#                     'curr_nac_fee': None,
#                 })
 
#             for insurance_fee in insurance_fees:
#                 insurance_ratecard = {
#                     'id': len(room_data['Ratecarddetials']) + 1,
#                     'isrowgroup': False,
#                     'RatecardType': 'Insurance',
#                     'RatecardShow': None,
#                     'room_ratecard_id': insurance_fee.Room_Ratecard.RateCard_Id,
#                     'RatecardName': insurance_fee.Insurance.Insurance_Name,
#                     'Ratecardid': insurance_fee.Insurance.Insurance_Id,
#                     'prev_fee': insurance_fee.Prev_Fee,
#                     'curr_fee': insurance_fee.Fee,
#                     'prev_ac_fee': insurance_fee.Prev_AC_Fee,
#                     'curr_ac_fee': insurance_fee.AC_Fee,
#                     'prev_nac_fee': insurance_fee.Prev_NAC_Fee,
#                     'curr_nac_fee': insurance_fee.NAC_Fee,
#                 }
#                 room_data['Ratecarddetials'].append(insurance_ratecard)
 
#             # Add client fees as a grouped section
#             if client_fees:
#                 room_data['Ratecarddetials'].append({
#                     'id': len(room_data['Ratecarddetials']) + 1,
#                     'isrowgroup': True,
#                     'RatecardType': 'Client',
#                     'RatecardShow': 'Client',
#                     'RatecardName': None,
#                     'prev_fee': None,
#                     'curr_fee': None,
#                     'prev_ac_fee': None,
#                     'curr_ac_fee': None,
#                     'prev_nac_fee': None,
#                     'curr_nac_fee': None,
#                 })
 
#             for client_fee in client_fees:
#                 client_ratecard = {
#                     'id': len(room_data['Ratecarddetials']) + 1,
#                     'isrowgroup': False,
#                     'RatecardType': 'Client',
#                     'RatecardShow': None,
#                     'room_ratecard_id': client_fee.Room_Ratecard.RateCard_Id,
#                     'RatecardName': client_fee.Client.Client_Name,
#                     'Ratecardid': client_fee.Client.Client_Id,
#                     'prev_fee': client_fee.Prev_Fee,
#                     'curr_fee': client_fee.Fee,
#                     'prev_ac_fee': client_fee.Prev_AC_Fee,
#                     'curr_ac_fee': client_fee.AC_Fee,
#                     'prev_nac_fee': client_fee.Prev_NAC_Fee,
#                     'curr_nac_fee': client_fee.NAC_Fee,
#                 }
#                 room_data['Ratecarddetials'].append(client_ratecard)
 
#             # Add corporate fees as a grouped section
#             if corporate_fees:
#                 room_data['Ratecarddetials'].append({
#                     'id': len(room_data['Ratecarddetials']) + 1,
#                     'isrowgroup': True,
#                     'RatecardType': 'Corporate',
#                     'RatecardShow': 'Corporate',
#                     'RatecardName': None,
#                     'prev_fee': None,
#                     'curr_fee': None,
#                     'prev_ac_fee': None,
#                     'curr_ac_fee': None,
#                     'prev_nac_fee': None,
#                     'curr_nac_fee': None,
#                 })
 
#             for corporate_fee in corporate_fees:
#                 corporate_ratecard = {
#                     'id': len(room_data['Ratecarddetials']) + 1,
#                     'isrowgroup': False,
#                     'RatecardType': 'Corporate',
#                     'RatecardShow': None,
#                     'room_ratecard_id': corporate_fee.Room_Ratecard.RateCard_Id,
#                     'RatecardName': corporate_fee.Corporate.Corporate_Name,
#                     'Ratecardid': corporate_fee.Corporate.Corporate_Id,
#                     'prev_fee': corporate_fee.Prev_Fee,
#                     'curr_fee': corporate_fee.Fee,
#                     'prev_ac_fee': corporate_fee.Prev_AC_Fee,
#                     'curr_ac_fee': corporate_fee.AC_Fee,
#                     'prev_nac_fee': corporate_fee.Prev_NAC_Fee,
#                     'curr_nac_fee': corporate_fee.NAC_Fee,
#                 }
#                 room_data['Ratecarddetials'].append(corporate_ratecard)
 
#             return JsonResponse(room_data, safe=False)
#         else:
#             return JsonResponse({'warn': 'Room Id required to fetch the ratecard details'}, safe=False)
   
#     except Exception as e:
#         return JsonResponse({'error': str(e)})


# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS"])
# def room_ratecard_details_update(request):
#     try:
#         data = json.loads(request.body)
#         room_id = data.get('room_id')
#         RatecardType = data.get('RatecardType')
#         room_ratecard_id = data.get('room_ratecard_id')
#         Ratecardid = data.get('Ratecardid')
#         col = data.get('col')
#         changedRate = data.get('changedRate')
 
#         if not room_id:
#             return JsonResponse({'error': 'Room ID is required'}, status=400)
       
#         room_details = RoomType_Master_Detials.objects.get(Room_Id=room_id)
 
#         if RatecardType == 'General':
#             ratecard = Room_Ratecard_Master.objects.get(RateCard_Id=room_ratecard_id)
#             if col == 'fee':
#                 ratecard.Prev_Fee = ratecard.Fee
#                 ratecard.Fee = changedRate
#                 ratecard.save()
#             elif col == 'ac_fee':
#                 ratecard.Prev_AC_Fee = ratecard.AC_Fee
#                 ratecard.AC_Fee = changedRate
#                 ratecard.save()
#             elif col == 'nac_fee':
#                 ratecard.Prev_NAC_Fee = ratecard.NAC_Fee
#                 ratecard.NAC_Fee = changedRate
#                 ratecard.save()
#             else:
#                 return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
#         elif RatecardType == 'Insurance':
#             insurance_fee = Insurance_Room_Fee.objects.get(
#                 Room_Ratecard__RateCard_Id=room_ratecard_id,
#                 Insurance__Insurance_Id=Ratecardid
#             )
#             if col == 'fee':
#                 insurance_fee.Prev_Fee = insurance_fee.Fee
#                 insurance_fee.Fee = changedRate
#                 insurance_fee.save()
#             elif col == 'ac_fee':
#                 insurance_fee.Prev_AC_Fee = insurance_fee.AC_Fee
#                 insurance_fee.AC_Fee = changedRate
#                 insurance_fee.save()
#             elif col == 'nac_fee':
#                 insurance_fee.Prev_NAC_Fee = insurance_fee.NAC_Fee
#                 insurance_fee.NAC_Fee = changedRate
#                 insurance_fee.save()
#             else:
#                 return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
#         elif RatecardType == 'Client':
#             client_fee = Client_Room_Fee.objects.get(
#                 Room_Ratecard__RateCard_Id=room_ratecard_id,
#                 Client__Client_Id=Ratecardid
#             )
#             if col == 'fee':
#                 client_fee.Prev_Fee = client_fee.Fee
#                 client_fee.Fee = changedRate
#                 client_fee.save()
#             elif col == 'ac_fee':
#                 client_fee.Prev_AC_Fee = client_fee.AC_Fee
#                 client_fee.AC_Fee = changedRate
#                 client_fee.save()
#             elif col == 'nac_fee':
#                 client_fee.Prev_NAC_Fee = client_fee.NAC_Fee
#                 client_fee.NAC_Fee = changedRate
#                 client_fee.save()
#             else:
#                 return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
#         elif RatecardType == 'Corporate':
#             corporate_fee = Corporate_Room_Fee.objects.get(
#                 Room_Ratecard__RateCard_Id=room_ratecard_id,
#                 Corporate__Corporate_Id=Ratecardid
#             )
#             if col == 'fee':
#                 corporate_fee.Prev_Fee = corporate_fee.Fee
#                 corporate_fee.Fee = changedRate
#                 corporate_fee.save()
#             elif col == 'ac_fee':
#                 corporate_fee.Prev_AC_Fee = corporate_fee.AC_Fee
#                 corporate_fee.AC_Fee = changedRate
#                 corporate_fee.save()
#             elif col == 'nac_fee':
#                 corporate_fee.Prev_NAC_Fee = corporate_fee.NAC_Fee
#                 corporate_fee.NAC_Fee = changedRate
#                 corporate_fee.save()
#             else:
#                 return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
#         else:
#             return JsonResponse({'error': f'Invalid RatecardType: {RatecardType}'}, status=400)
 
#         room_name = f"{room_details.Floor_Name.Floor_Name}-{room_details.Ward_Name.Ward_Name}-{room_details.RoomNo or ''}"
#         return JsonResponse({
#             'success': f'Room {room_name} ratecard details updated successfully'
#         }, status=200)
 
#     except RoomType_Master_Detials.DoesNotExist:
#         return JsonResponse({'error': 'Room not found'}, status=404)
#     except Room_Ratecard_Master.DoesNotExist:
#         return JsonResponse({'error': 'Ratecard not found'}, status=404)
#     except Insurance_Room_Fee.DoesNotExist:
#         return JsonResponse({'error': 'Insurance fee not found'}, status=404)
#     except Client_Room_Fee.DoesNotExist:
#         return JsonResponse({'error': 'Client fee not found'}, status=404)
#     except Corporate_Room_Fee.DoesNotExist:
#         return JsonResponse({'error': 'Corporate fee not found'}, status=404)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def HandleRoomDelete(request):
    try:
        body = json.loads(request.body)
        room_id = body.get('id')

        if not room_id:
            return JsonResponse({'error': 'Room ID not provided'}, status=400)

        room = RoomType_Master_Detials.objects.get(RoomNo=room_id)
        room.delete()

        return JsonResponse({'message': 'Room deleted successfully'}, status=200)

    except RoomType_Master_Detials.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def HandleRoomMasterDelete(request):
    try:
        body = json.loads(request.body)
        room_id = body.get('id')

        if not room_id:
            return JsonResponse({'error': 'Room ID not provided'}, status=400)

        room = Room_Master_Detials.objects.get(Room_Id=room_id)
        room.delete()

        return JsonResponse({'message': 'Room deleted successfully'}, status=200)

    except RoomType_Master_Detials.DoesNotExist:
        return JsonResponse({'error': 'Room not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import openpyxl

@csrf_exempt  
def upload_nsequipments_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        # Load the uploaded Excel file
        file = request.FILES["file"]
        workbook = openpyxl.load_workbook(file)
        sheet = workbook["NSEquipments"]

        # Expected headers
        expected_headers = ["NSEId", "NurseStationid", "EquipmentsName", "Stock", "Remarks", "created_by", "updated_by"]
        headers = [cell.value for cell in sheet[1]]  # First row is headers
        if headers != expected_headers:
            return JsonResponse({"error": "Invalid Excel file format. Headers do not match."}, status=400)

        # Get all NurseStationMaster entries for name-to-ID mapping
        nurse_stations = {ns.NurseStationName: ns for ns in NurseStationMaster.objects.all()}  # Assuming 'name' field in NurseStationMaster

        errors = []
        created_records = []
        row_number = 2  # Start from row 2 (after headers)

        for row in sheet.iter_rows(min_row=2, values_only=True):
            nse_id, nurse_station_name, equipment_name, stock, remarks, created_by, updated_by = row

            if not any([equipment_name, stock, remarks, created_by, updated_by]):
                continue

            if nurse_station_name.strip() and nurse_station_name.strip() not in nurse_stations:
                errors.append(f"Row {row_number}: Invalid NurseStationid '{nurse_station_name}'")
                row_number += 1
                continue

            nurse_station = nurse_stations.get(nurse_station_name.strip())
            if nurse_station and equipment_name:
                existing_record = NSEquipments.objects.filter(
                    NurseStationid=nurse_station,
                    EquipmentsName=equipment_name
                ).exists()
                if existing_record:
                    errors.append(f"Row {row_number}: Duplicate entry for '{equipment_name}' at '{nurse_station_name}'")
                    row_number += 1
                    continue

            try:
                nse_data = {
                    "NurseStationid": nurse_station if nurse_station_name else None,
                    "EquipmentsName": equipment_name or "",
                    "Stock": stock or "",
                    "Remarks": remarks or "",
                    "created_by": created_by or "system",
                    "updated_by": updated_by or "system",
                }

                nse = NSEquipments(**nse_data)
                # nse.full_clean()  
                nse.save()
                created_records.append({
                    "row": row_number,
                    "EquipmentsName": equipment_name,
                    "NurseStationid": nurse_station_name
                })

            except ValidationError as e:
                errors.append(f"Row {row_number}: {str(e)}")
            except Exception as e:
                errors.append(f"Row {row_number}: Error saving record - {str(e)}")

            row_number += 1

        # response = {
        #     "status": "success" if not errors else "partial_success",
        #     "created_records": created_records,
        #     "errors": errors
        # }
        return JsonResponse({'success': f'{len(created_records)} records added successfully'})

    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)
    
@csrf_exempt 
def upload_nsconsumables_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        # Load the uploaded Excel file
        file = request.FILES["file"]
        workbook = openpyxl.load_workbook(file)
        sheet = workbook["NSConsumables"]

        # Expected headers
        expected_headers = ["NSCId", "NurseStationid", "ConsumablesName", "ExpiryDate", "Stock", "Remarks", "created_by", "updated_by"]
        headers = [cell.value for cell in sheet[1]]  # First row is headers
        if headers != expected_headers:
            return JsonResponse({"error": "Invalid Excel file format. Headers do not match."}, status=400)

        # Get all NurseStationMaster entries for name-to-ID mapping
        nurse_stations = {ns.NurseStationName: ns for ns in NurseStationMaster.objects.all()}  # Assuming 'name' field in NurseStationMaster

        errors = []
        created_records = []
        row_number = 2  # Start from row 2 (after headers)

        for row in sheet.iter_rows(min_row=2, values_only=True):
            nsc_id, nurse_station_name, consumable_name, expiry_date, stock, remarks, created_by, updated_by = row

            # Skip empty rows
            if not any([consumable_name, stock]):
                continue

            # Validate NurseStationid
            if nurse_station_name.strip() and nurse_station_name.strip() not in nurse_stations:
                errors.append(f"Row {row_number}: Invalid NurseStationid '{nurse_station_name}'")
                row_number += 1
                continue

            # Convert ExpiryDate to Python date object
            if expiry_date:
                try:
                    if isinstance(expiry_date, str):
                        expiry_date = datetime.strptime(expiry_date, "%Y-%m-%d").date()
                    elif isinstance(expiry_date, datetime):
                        expiry_date = expiry_date.date()
                except ValueError:
                    errors.append(f"Row {row_number}: Invalid ExpiryDate format. Use YYYY-MM-DD.")
                    row_number += 1
                    continue

            # Check for duplicates based on NurseStationid and ConsumablesName
            nurse_station = nurse_stations.get(nurse_station_name.strip())
            if nurse_station and consumable_name:
                existing_record = NSConsumables.objects.filter(
                    NurseStationid=nurse_station,
                    ConsumablesName=consumable_name
                ).exists()
                if existing_record:
                    errors.append(f"Row {row_number}: Duplicate entry for '{consumable_name}' at '{nurse_station_name}'")
                    row_number += 1
                    continue

            # Prepare data for NSConsumables model
            try:
                nsconsumable_data = {
                    "NurseStationid": nurse_station if nurse_station_name else None,
                    "ConsumablesName": consumable_name or "",
                    "ExpiryDate": expiry_date,
                    "Stock": stock or "",
                    "Remarks": remarks or "",
                    "created_by": created_by or "system",
                    "updated_by": updated_by or "system",
                }

                # Create NSConsumables instance (NSCId is auto-generated by the model)
                nsc = NSConsumables(**nsconsumable_data)
                # nsc.full_clean()  # Validate model fields
                nsc.save()
                created_records.append({
                    "row": row_number,
                    "ConsumablesName": consumable_name,
                    "NurseStationid": nurse_station_name
                })

            except ValidationError as e:
                errors.append(f"Row {row_number}: {str(e)}")
            except Exception as e:
                errors.append(f"Row {row_number}: Error saving record - {str(e)}")

            row_number += 1

        response = {
            "status": "success" if not errors else "partial_success",
            "created_records": created_records,
            "errors": errors
        }
        return JsonResponse({'success': f'{len(created_records)} records added successfully'})

    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)

@csrf_exempt 
def upload_nsfurniture_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        # Load the uploaded Excel file
        file = request.FILES["file"]
        workbook = openpyxl.load_workbook(file)
        sheet = workbook["NSFurniture"]

        # Expected headers
        expected_headers = ["NSFId", "NurseStationid", "FurnitureName", "Stock", "Remarks", "created_by", "updated_by"]
        headers = [cell.value for cell in sheet[1]]  # First row is headers
        if headers != expected_headers:
            return JsonResponse({"error": "Invalid Excel file format. Headers do not match."}, status=400)

        # Get all NurseStationMaster entries for name-to-ID mapping
        nurse_stations = {ns.NurseStationName: ns for ns in NurseStationMaster.objects.all()}  # Assuming 'name' field in NurseStationMaster

        errors = []
        created_records = []
        row_number = 2  # Start from row 2 (after headers)

        for row in sheet.iter_rows(min_row=2, values_only=True):
            nsf_id, nurse_station_name, furniture_name, stock, remarks, created_by, updated_by = row

            # Skip empty rows
            if not any([furniture_name, stock]):
                continue

            # Validate NurseStationid
            if nurse_station_name.strip() and nurse_station_name.strip() not in nurse_stations:
                errors.append(f"Row {row_number}: Invalid NurseStationid '{nurse_station_name}'")
                row_number += 1
                continue

            # Check for duplicates based on NurseStationid and FurnitureName
            nurse_station = nurse_stations.get(nurse_station_name.strip())
            if nurse_station and furniture_name:
                existing_record = NSFurniture.objects.filter(
                    NurseStationid=nurse_station,
                    FurnitureName=furniture_name
                ).exists()
                if existing_record:
                    errors.append(f"Row {row_number}: Duplicate entry for '{furniture_name}' at '{nurse_station_name}'")
                    row_number += 1
                    continue

            # Prepare data for NSFurniture model
            try:
                nsfurniture_data = {
                    "NurseStationid": nurse_station if nurse_station_name else None,
                    "FurnitureName": furniture_name or "",
                    "Stock": stock or "",
                    "Remarks": remarks or "",
                    "created_by": created_by or "system",
                    "updated_by": updated_by or "system",
                }

                # Create NSFurniture instance (NSFId is auto-generated by the model)
                nsf = NSFurniture(**nsfurniture_data)
                # nsf.full_clean()  # Validate model fields
                nsf.save()
                created_records.append({
                    "row": row_number,
                    "FurnitureName": furniture_name,
                    "NurseStationid": nurse_station_name
                })

            except ValidationError as e:
                errors.append(f"Row {row_number}: {str(e)}")
            except Exception as e:
                errors.append(f"Row {row_number}: Error saving record - {str(e)}")

            row_number += 1

        response = {
            "status": "success" if not errors else "partial_success",
            "created_records": created_records,
            "errors": errors
        }
        return JsonResponse({'success': f'{len(created_records)} records added successfully'})

    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)

@csrf_exempt  # Use only if CSRF is disabled; otherwise, include CSRF token in the request
def upload_nsinstruments_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        # Load the uploaded Excel file
        file = request.FILES["file"]
        workbook = openpyxl.load_workbook(file)
        sheet = workbook["NSInstruments"]

        # Expected headers
        expected_headers = ["NSIId", "NurseStationid", "InstrumentsName", "Stock", "Remarks", "created_by", "updated_by"]
        headers = [cell.value for cell in sheet[1]]  # First row is headers
        if headers != expected_headers:
            return JsonResponse({"error": "Invalid Excel file format. Headers do not match."}, status=400)

        # Get all NurseStationMaster entries for name-to-ID mapping
        nurse_stations = {ns.NurseStationName: ns for ns in NurseStationMaster.objects.all()}  # Assuming 'name' field in NurseStationMaster

        errors = []
        created_records = []
        row_number = 2  # Start from row 2 (after headers)

        for row in sheet.iter_rows(min_row=2, values_only=True):
            nsi_id, nurse_station_name, instrument_name, stock, remarks, created_by, updated_by = row

            print(instrument_name,'instrument_name',stock,'stock')

            # Skip empty rows
            if not any([instrument_name, stock]):
                print('Empty rows')
                continue

            # Validate NurseStationid
            if nurse_station_name.strip() and nurse_station_name.strip() not in nurse_stations:
                errors.append(f"Row {row_number}: Invalid NurseStationid '{nurse_station_name}'")
                row_number += 1
                continue

            # Check for duplicates based on NurseStationid and InstrumentsName
            nurse_station = nurse_stations.get(nurse_station_name.strip())
            if nurse_station and instrument_name:

                print(nurse_station,'nurse_station',instrument_name,'instrument_name')
                existing_record = NSInstruments.objects.filter(
                    NurseStationid=nurse_station,
                    InstrumentsName=instrument_name.strip()
                ).exists()
                if existing_record:

                    print(existing_record,'existing_record')
                    errors.append(f"Row {row_number}: Duplicate entry for '{instrument_name}' at '{nurse_station_name}'")
                    row_number += 1
                    continue

            # Prepare data for NSInstruments model
            try:
                nsinstrument_data = {
                    "NurseStationid": nurse_station if nurse_station_name else None,
                    "InstrumentsName": instrument_name or "",
                    "Stock": stock or "",
                    "Remarks": remarks or "",
                    "created_by": created_by or "system",
                    "updated_by": updated_by or "system",
                }


                print(nsinstrument_data,'nsinstrument_data')

                # Create NSInstruments instance (NSIId is auto-generated by the model)
                nsi = NSInstruments(**nsinstrument_data)
                print(nsi,'nsiiiiiiiiiiiiii')
                # nsi.full_clean()  # Validate model fields
                # print(nsi,'nsiiiiiiiiiiiiii')

                nsi.save()
                print(nsi,'nsiiiiiiiiiiiiii')

                created_records.append({
                    "row": row_number,
                    "InstrumentsName": instrument_name,
                    "NurseStationid": nurse_station_name
                })

            except ValidationError as e:
                errors.append(f"Row {row_number}: {str(e)}")
            except Exception as e:
                errors.append(f"Row {row_number}: Error saving record - {str(e)}")

            row_number += 1

        response = {
            "status": "success" if not errors else "partial_success",
            "created_records": created_records,
            "errors": errors
        }
        return JsonResponse({'success': f'{len(created_records)} records added successfully'})

    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)


import openpyxl
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from .models import *
from datetime import datetime, timedelta
from dateutil import parser

@csrf_exempt
def upload_oldpatient_details_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        # Load the uploaded Excel file
        file = request.FILES["file"]
        workbook = openpyxl.load_workbook(file)
        sheet = workbook["Sheet1"]

        # Expected headers based on the model and provided data
        expected_headers = [
            "OPNo", "YearNo", "OPDate", "OpTime", "NamePrefix", "PatientName", "CasualtyPat",
            "Category", "MemberID", "Specialty", "DeptName", "UnitNo", "Ref_Doctor", "TariffType",
            "TillValidity", "RegFee", "FatherName", "Address", "Location", "PhoneNo", "Age",
            "AgeIn", "Date_of_Birth", "Sex", "MarriedYN", "Religion", "SubCaste", "Occupation",
            "Anual_Income", "BloodGrp", "Complaint", "Corporate", "PrepBy", "ModiBy", "CreditYN",
            "RefDoctor", "RefHospital", "RSBYCardYN", "RSBYCardNo", "OPNORef", "OPYearRef",
            "CardCount", "ModifiedDate"
        ]
        headers = [cell.value.strip() if cell.value else "" for cell in sheet[1]]
        if headers != expected_headers:
            return JsonResponse({"error": "Invalid Excel file format. Headers do not match."}, status=400)

        errors = []
        created_records = []
        row_number = 2  # Start from row 2 (after headers)

        def excel_date_to_datetime(excel_date):
            """Convert Excel serial date to Python datetime."""
            if not excel_date or isinstance(excel_date, str):
                return None
            try:
                return datetime(1899, 12, 30) + timedelta(days=float(excel_date))
            except (ValueError, TypeError):
                return None

        def parse_time(time_value):
            """Parse OpTime (decimal or string like '31:00.0')."""
            if not time_value:
                return None
            try:
                if isinstance(time_value, (int, float)):
                    # Convert decimal time (fraction of a day) to datetime.time
                    hours = int(time_value * 24)
                    minutes = int((time_value * 24 * 60) % 60)
                    seconds = int((time_value * 24 * 3600) % 60)
                    return datetime.strptime(f"{hours:02}:{minutes:02}:{seconds:02}", "%H:%M:%S").time()
                elif isinstance(time_value, str):
                    # Parse time string using dateutil.parser
                    parsed = parser.parse(time_value, fuzzy=True)
                    return parsed.time()
                return None
            except (ValueError, TypeError):
                return None

        for row in sheet.iter_rows(min_row=2, values_only=True):
            if not any(row):  # Skip empty rows
                row_number += 1
                continue

            # Unpack row values
            (
                op_no, year_no, op_date, op_time, name_prefix, patient_name, casualty_pat, category,
                member_id, specialty, dept_name, unit_no, ref_doctor, tariff_type, till_validity,
                reg_fee, father_name, address, location, phone_no, age, age_in, date_of_birth,
                sex, married_yn, religion, sub_caste, occupation, annual_income, blood_grp,
                complaint, corporate, prep_by, modi_by, credit_yn, ref_doctor, ref_hospital,
                rsby_card_yn, rsby_card_no, opno_ref, op_year_ref, card_count, modified_date
            ) = row

            # Validate required fields
            if not op_no or not patient_name:
                errors.append(f"Row {row_number}: Missing required fields (OPNo or PatientName)")
                row_number += 1
                continue

            # Check for duplicate OPNo
            if Existing_Patient_Details.objects.filter(OPNo=op_no).exists():
                errors.append(f"Row {row_number}: Duplicate OPNo '{op_no}'")
                row_number += 1
                continue

            # Convert and validate data
            try:
                # Handle dates
                op_date = excel_date_to_datetime(op_date)
                till_validity = excel_date_to_datetime(till_validity)
                date_of_birth = excel_date_to_datetime(date_of_birth)
                modified_date = excel_date_to_datetime(modified_date)

                # Handle time
                op_time = parse_time(op_time)

                # Handle numeric fields
                reg_fee = float(reg_fee) if reg_fee and isinstance(reg_fee, (int, float, str)) else None
                annual_income = float(annual_income) if annual_income and isinstance(annual_income, (int, float, str)) else None
                age = int(age) if age and isinstance(age, (int, float, str)) else None
                opno_ref = int(opno_ref) if opno_ref and isinstance(opno_ref, (int, float, str)) else None
                op_year_ref = int(op_year_ref) if op_year_ref and isinstance(op_year_ref, (int, float, str)) else None
                card_count = int(card_count) if card_count and isinstance(card_count, (int, float, str)) else None

                # Prepare data for model
                patient_data = {
                    "OPNo": op_no,
                    "YearNo": int(year_no) if year_no else 0,
                    "OPDate": op_date,
                    "OpTime": op_time,
                    "NamePrefix": name_prefix.strip() if name_prefix else "",
                    "PatientName": patient_name.strip() if patient_name else "",
                    "CasualtyPat": casualty_pat.strip() if casualty_pat else "",
                    "Category": category.strip() if category else "",
                    "MemberID": str(member_id) if member_id else "",
                    "Specialty": specialty.strip() if specialty else "",
                    "DeptName": dept_name.strip() if dept_name else "",
                    "UnitNo": unit_no.strip() if unit_no else "",
                    "Ref_Doctor": ref_doctor.strip() if ref_doctor else "",
                    "TariffType": tariff_type.strip() if tariff_type else "",
                    "TillValidity": till_validity,
                    "RegFee": reg_fee,
                    "FatherName": father_name.strip() if father_name else "",
                    "Address": address.strip() if address else "",
                    "Location": location.strip() if location else "",
                    "PhoneNo": phone_no.strip() if phone_no else "",
                    "Age": age,
                    "AgeIn": age_in.strip() if age_in else "",
                    "Date_of_Birth": date_of_birth,
                    "Sex": sex.strip() if sex else "",
                    "MarriedYN": married_yn.strip() if married_yn else "",
                    "Religion": religion.strip() if religion else "",
                    "SubCaste": sub_caste.strip() if sub_caste else "",
                    "Occupation": occupation.strip() if occupation else "",
                    "Anual_Income": annual_income,
                    "BloodGrp": blood_grp.strip() if blood_grp else "",
                    "Complaint": complaint.strip() if complaint else "",
                    "Corporate": corporate.strip() if corporate else "",
                    "PrepBy": prep_by.strip() if prep_by else "",
                    "ModiBy": modi_by.strip() if modi_by else "",
                    "CreditYN": credit_yn.strip() if credit_yn else "",
                    "RefDoctor": ref_doctor.strip() if ref_doctor else "",
                    "RefHospital": ref_hospital.strip() if ref_hospital else "",
                    "RSBYCardYN": rsby_card_yn.strip() if rsby_card_yn else "",
                    "RSBYCardNo": rsby_card_no.strip() if rsby_card_no else "",
                    "OPNORef": opno_ref,
                    "OPYearRef": op_year_ref,
                    "CardCount": card_count,
                    "ModifiedDate": modified_date
                }

                # Create and save model instance
                patient = Existing_Patient_Details(**patient_data)
                patient.full_clean()  # Validate model fields
                patient.save()

                created_records.append({
                    "row": row_number,
                    "OPNo": op_no,
                    "PatientName": patient_name
                })

            except ValidationError as e:
                errors.append(f"Row {row_number}: {str(e)}")
            except Exception as e:
                errors.append(f"Row {row_number}: Error saving record - {str(e)}")

            row_number += 1

        response = {
            "status": "success" if not errors else "partial_success",
            "created_records": created_records,
            "errors": errors
        }
        return JsonResponse({'success': f'{len(created_records)} records added successfully', 'details': response})

    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)
    
# @csrf_exempt
# def upload_revisit_patient_excel(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Method not allowed"}, status=405)

#     if "file" not in request.FILES:
#         return JsonResponse({"error": "No file uploaded"}, status=400)

#     try:
#         file = request.FILES["file"]
#         print(file,'fileeeeeeeeeeeeee')
#         workbook = openpyxl.load_workbook(file)
#         sheet = workbook["Sheet1"]

#         expected_headers = [
#             "OPNo", "YearNo", "ReVisitDate", "ReVisitTime", "DeptName", "UnitNo", "RefDoctor",
#             "TillValidity", "Revisit_Fee", "Age", "AgeIn", "Complaint", "Category", "Specialty",
#             "PrepBy", "ModiBy", "CasualtyPat", "CreditYN", "OFFDoctor", "Remarks", "VisitID",
#             "RefBy", "RefHospital"
#         ]

#         headers = [cell.value.strip() if cell.value else "" for cell in sheet[1]]
#         if headers != expected_headers:
#             return JsonResponse({"error": "Invalid Excel file format. Headers do not match."}, status=400)

#         errors = []
#         created_records = []
#         row_number = 2

#         def excel_date_to_datetime(excel_date):
#             if not excel_date or isinstance(excel_date, str):
#                 return None
#             try:
#                 return datetime(1899, 12, 30) + timedelta(days=float(excel_date))
#             except (ValueError, TypeError):
#                 return None

#         def parse_time(time_value):
#             if not time_value:
#                 return None
#             try:
#                 if isinstance(time_value, (int, float)):
#                     hours = int(time_value * 24)
#                     minutes = int((time_value * 24 * 60) % 60)
#                     seconds = int((time_value * 24 * 3600) % 60)
#                     return datetime.strptime(f"{hours:02}:{minutes:02}:{seconds:02}", "%H:%M:%S").time()
#                 elif isinstance(time_value, str):
#                     parsed = parser.parse(time_value, fuzzy=True)
#                     return parsed.time()
#                 return None
#             except (ValueError, TypeError):
#                 return None

#         for row in sheet.iter_rows(min_row=2, values_only=True):
#             if not any(row):
#                 row_number += 1
#                 continue

#             (
#                 op_no, year_no, revisit_date, revisit_time, dept_name, unit_no, ref_doctor,
#                 till_validity, revisit_fee, age, age_in, complaint, category, specialty, prep_by,
#                 modi_by, casualty_pat, credit_yn, off_doctor, remarks, visit_id, ref_by, ref_hospital
#             ) = row

#             if not op_no:
#                 errors.append(f"Row {row_number}: Missing OPNo")
#                 row_number += 1
#                 continue

#             if Existing_Patient_RevisitPatient.objects.filter(OPNo=op_no, YearNo=year_no, ReVisitDate=revisit_date).exists():
#                 errors.append(f"Row {row_number}: Duplicate record for OPNo '{op_no}' and date '{revisit_date}'")
#                 row_number += 1
#                 continue

#             try:
#                 revisit_date = excel_date_to_datetime(revisit_date)
#                 till_validity = excel_date_to_datetime(till_validity)
#                 revisit_time = parse_time(revisit_time)

#                 revisit_fee = float(revisit_fee) if revisit_fee else None
#                 age = int(age) if age else None
#                 visit_id = int(visit_id) if visit_id else None

#                 patient_data = {
#                     "OPNo": str(op_no),
#                     "YearNo": str(year_no) if year_no else "",
#                     "ReVisitDate": revisit_date,
#                     "ReVisitTime": revisit_time,
#                     "DeptName": dept_name or "",
#                     "UnitNo": unit_no or "",
#                     "RefDoctor": ref_doctor or "",
#                     "TillValidity": till_validity,
#                     "Revisit_Fee": revisit_fee,
#                     "Age": age,
#                     "AgeIn": age_in or "",
#                     "Complaint": complaint or "",
#                     "Category": category or "",
#                     "Specialty": specialty or "",
#                     "PrepBy": prep_by or "",
#                     "ModiBy": modi_by or "",
#                     "CasualtyPat": casualty_pat or "",
#                     "CreditYN": credit_yn or "",
#                     "OFFDoctor": off_doctor or "",
#                     "Remarks": remarks or "",
#                     "VisitID": str(visit_id) if visit_id else "",
#                     "RefBy": ref_by or "",
#                     "RefHospital": ref_hospital or ""
#                 }

#                 record = Existing_Patient_RevisitPatient(**patient_data)
#                 record.full_clean()
#                 record.save()

#                 created_records.append({
#                     "row": row_number,
#                     "OPNo": op_no,
#                     "ReVisitDate": revisit_date
#                 })

#             except ValidationError as e:
#                 errors.append(f"Row {row_number}: {str(e)}")
#             except Exception as e:
#                 errors.append(f"Row {row_number}: Error saving record - {str(e)}")

#             row_number += 1

#         response = {
#             "status": "success" if not errors else "partial_success",
#             "created_records": created_records,
#             "errors": errors
#         }
#         return JsonResponse({'success': f'{len(created_records)} records added successfully', 'details': response})

#     except Exception as e:
#         return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)



import csv
import io
import openpyxl
from datetime import datetime, timedelta
from dateutil import parser
from django.core.exceptions import ValidationError
from django.http import JsonResponse


@csrf_exempt
@require_http_methods(['POST'])
def upload_revisit_patient_excel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        file = request.FILES["file"]
        filename = file.name.lower()

        expected_headers = [
            "OPNo", "YearNo", "ReVisitDate", "ReVisitTime", "DeptName", "UnitNo", "RefDoctor",
            "TillValidity", "Revisit_Fee", "Age", "AgeIn", "Complaint", "Category", "Specialty",
            "PrepBy", "ModiBy", "CasualtyPat", "CreditYN", "OFFDoctor", "Remarks", "VisitID",
            "RefBy", "RefHospital"
        ]

        # Function to handle Excel date conversion
        def excel_date_to_datetime(excel_date):
            if not excel_date or isinstance(excel_date, str):
                return None
            try:
                return datetime(1899, 12, 30) + timedelta(days=float(excel_date))
            except (ValueError, TypeError):
                return None

        # Function to handle time parsing
        def parse_time(time_value):
            if not time_value:
                return None
            try:
                if isinstance(time_value, (int, float)):
                    hours = int(time_value * 24)
                    minutes = int((time_value * 24 * 60) % 60)
                    seconds = int((time_value * 24 * 3600) % 60)
                    return datetime.strptime(f"{hours:02}:{minutes:02}:{seconds:02}", "%H:%M:%S").time()
                elif isinstance(time_value, str):
                    parsed = parser.parse(time_value, fuzzy=True)
                    return parsed.time()
                return None
            except (ValueError, TypeError):
                return None

        # Read rows from file depending on type
        rows = []
        if filename.endswith(".csv"):
            decoded_file = file.read().decode("utf-8-sig")  # utf-8-sig removes BOM
            csv_reader = csv.reader(io.StringIO(decoded_file))
            rows = list(csv_reader)
        elif filename.endswith(".xlsx") or filename.endswith(".xlsm"):
            workbook = openpyxl.load_workbook(file)
            sheet = workbook.active
            rows = list(sheet.iter_rows(values_only=True))
        else:
            return JsonResponse({"error": "Unsupported file type. Please upload CSV or Excel."}, status=400)

        # Normalize headers for comparison
        headers = [str(cell).strip().lstrip("\ufeff") if cell else "" for cell in rows[0]]
        normalized_headers = [h.lower() for h in headers]
        expected_normalized = [h.lower() for h in expected_headers]

        if normalized_headers != expected_normalized:
            return JsonResponse({
                "error": f"Invalid file format. Headers do not match.",
                "found_headers": headers
            }, status=400)

        errors = []
        created_records = []
        row_number = 2

        # Process each row
        for row in rows[1:]:
            if not any(row):
                row_number += 1
                continue

            (
                op_no, year_no, revisit_date, revisit_time, dept_name, unit_no, ref_doctor,
                till_validity, revisit_fee, age, age_in, complaint, category, specialty, prep_by,
                modi_by, casualty_pat, credit_yn, off_doctor, remarks, visit_id, ref_by, ref_hospital
            ) = row

            if not op_no:
                errors.append(f"Row {row_number}: Missing OPNo")
                row_number += 1
                continue

            if Existing_Patient_RevisitPatient.objects.filter(OPNo=op_no, YearNo=year_no, ReVisitDate=revisit_date).exists():
                errors.append(f"Row {row_number}: Duplicate record for OPNo '{op_no}' and date '{revisit_date}'")
                row_number += 1
                continue

            try:
                # Date handling
                revisit_date = excel_date_to_datetime(revisit_date) or (parser.parse(str(revisit_date), fuzzy=True) if revisit_date else None)
                till_validity = excel_date_to_datetime(till_validity) or (parser.parse(str(till_validity), fuzzy=True) if till_validity else None)
                revisit_time = parse_time(revisit_time)

                # Type conversions
                revisit_fee = float(revisit_fee) if revisit_fee else None
                age = int(age) if age else None
                visit_id = int(visit_id) if visit_id else None

                # Build patient record
                patient_data = {
                    "OPNo": str(op_no),
                    "YearNo": str(year_no) if year_no else "",
                    "ReVisitDate": revisit_date,
                    "ReVisitTime": revisit_time,
                    "DeptName": dept_name or "",
                    "UnitNo": unit_no or "",
                    "RefDoctor": ref_doctor or "",
                    "TillValidity": till_validity,
                    "Revisit_Fee": revisit_fee,
                    "Age": age,
                    "AgeIn": age_in or "",
                    "Complaint": complaint or "",
                    "Category": category or "",
                    "Specialty": specialty or "",
                    "PrepBy": prep_by or "",
                    "ModiBy": modi_by or "",
                    "CasualtyPat": casualty_pat or "",
                    "CreditYN": credit_yn or "",
                    "OFFDoctor": off_doctor or "",
                    "Remarks": remarks or "",
                    "VisitID": str(visit_id) if visit_id else "",
                    "RefBy": ref_by or "",
                    "RefHospital": ref_hospital or ""
                }

                record = Existing_Patient_RevisitPatient(**patient_data)
                record.full_clean()
                record.save()

                created_records.append({
                    "row": row_number,
                    "OPNo": op_no,
                    "ReVisitDate": revisit_date
                })

            except ValidationError as e:
                errors.append(f"Row {row_number}: {str(e)}")
            except Exception as e:
                errors.append(f"Row {row_number}: Error saving record - {str(e)}")

            row_number += 1

        response = {
            "status": "success" if not errors else "partial_success",
            "created_records": created_records,
            "errors": errors
        }
        return JsonResponse({'success': f'{len(created_records)} records added successfully', 'details': response})

    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)



@csrf_exempt
@require_http_methods(['GET'])
def get_ward_details_by_floor_for_ipregistration(request):

    try:

        Floor = request.GET.get('Floor')

        ward_ids = (
            RoomType_Master_Detials.objects
            .filter(Floor_Name_id=Floor)
            .values_list("Ward_Name", flat=True)
            .distinct()
        )

        print(ward_ids,'ward_ids')

        Wardins = WardType_Master_Detials.objects.filter(Ward_Id__in = ward_ids)

        print(len(Wardins),'lennnnnnnnnnnnnnnnn')

        wardlist = []

        for ward in Wardins:

            datalist = {
                'id' : ward.Ward_Id,
                 'Name' : ward.Ward_Name
            }

            wardlist.append(datalist)

        return JsonResponse(wardlist,safe=False)




    except Exception as e:
        return JsonResponse({"error": f"Failed to process file: {str(e)}"}, status=400)

