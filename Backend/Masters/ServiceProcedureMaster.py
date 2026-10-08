from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.db.models import Q

 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Service_Procedure_Master_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract and validate data
            MasterType = data.get('MasterType','')
           
            Department = data.get('Department','')
            ServiceCode = data.get('ServiceCode','')
            ServiceCatCode = data.get('ServiceCategory','')
            ServiceName = data.get('ServiceName','')
            ServiceType = data.get('ServiceType','')
            Amount = data.get('Amount','')
           
           
            procedureType = data.get('Type','')
            ProcedureCode = data.get('ProcedureCode','')
            ProcedureName = data.get('ProcedureName','')
            Speciality = data.get('Speciality','')
 
            IsSeparateFee = True if data.get('IsSeparateFee') == 'true' else False
 
            SurgeonFee = data.get('SurgeonFee',0)
            OTFee = data.get('OTFee',0)
            AssistantSurgeonFee = data.get('AssistantSurgeonFee',0)
            AnesthesianFee = data.get('AnesthesianFee',0)
            TotalAmount = data.get('TotalAmount',0)
 
            RoomSurgeonFee = data.get('RoomSurgeonFee',0)
            RoomOTFee = data.get('RoomOTFee',0)
            RoomAssistantSurgeonFee = data.get('RoomAssistantSurgeonFee',0)
            RoomAnesthesianFee = data.get('RoomAnesthesianFee',0)
            TotalRoomAmount = data.get('TotalRoomAmount',0)
 
            WardSurgeonFee = data.get('WardSurgeonFee',0)
            WardOTFee = data.get('WardSurgeonFee',0)
            WardAssistantSurgeonFee = data.get('WardSurgeonFee',0)
            WardAnesthesianFee = data.get('WardAnesthesianFee',0)
            TotalWardAmount = data.get('WardSurgeonFee',0)
           
            IsGst = data.get('IsGst','')
            GSTValue = data.get('GSTValue','')
           
            created_by = data.get('Created_by', '')
           
            ISWardConsession = data.get('ISWardConsession', '')
            ISWardPercentage = data.get('ISWardPercentage', '')
 
            print(created_by,'created_by')
 
 
            print(IsSeparateFee,'IsSeparateFee')
       
           
            if MasterType == 'Service':
                if ServiceCode:
                    service_cat_ins = Service_Category_Masters.objects.get(Serviceid = ServiceCatCode)
                    if Service_Master_Details.objects.filter(Service_Name=ServiceName,Department=Department,ServiceCategory=service_cat_ins).exclude(pk=ServiceCode).exists():
                        return JsonResponse({'warn': 'Service Name already exists'})
                   
                    else:
                        Service_instance=Service_Master_Details.objects.get(pk= ServiceCode)
                        Service_instance.ServiceCategory=service_cat_ins
                        Service_instance.Service_Name=ServiceName
                        Service_instance.Service_Type=ServiceType
                        Service_instance.Department=Department
                        Service_instance.IsGst=IsGst
                        Service_instance.Amount=Amount
                        Service_instance.GstValue=GSTValue
                        Service_instance.ISWardConsession=True if ISWardConsession == 'Yes' else False
                        Service_instance.ISWardPercentage=ISWardPercentage
                        Service_instance.save()
                       
                        return JsonResponse({'success': 'Service Details Updated Successfully'})
                else:
                    service_cat_ins = Service_Category_Masters.objects.get(Serviceid = ServiceCatCode)
 
                    if Service_Master_Details.objects.filter(Service_Name=ServiceName,Department=Department,ServiceCategory=service_cat_ins).exists():
                        return JsonResponse({'warn': 'Service Name already exists'})
                    Service_instance = Service_Master_Details.objects.create(
                        ServiceCategory = service_cat_ins,
                        Service_Name=ServiceName,
                        Department=Department,
                        Service_Type=ServiceType,
                        IsGst=IsGst,
                        GstValue=GSTValue,
                        Amount=Amount,
                        created_by=created_by,
                        ISWardConsession= True if ISWardConsession == 'Yes' else False,
                        ISWardPercentage=ISWardPercentage
                       
                    )
                    return JsonResponse({'success': 'Service  Details added successfully'})
            else:
 
                Specialityins = Speciality_Detials.objects.filter(Speciality_Id=Speciality).first()
 
                if ProcedureCode:
                     
                    if Procedure_Master_Details.objects.filter(Procedure_Name=ProcedureName,Type=procedureType).exclude(pk=ProcedureCode).exists():
                        return JsonResponse({'warn': 'Procedure Name already exists'})
                   
                    else:
                        Procedure_instance=Procedure_Master_Details.objects.get(pk= ProcedureCode)
 
                        print(Procedure_instance,'Procedure_instance1111111111111')
                        Procedure_instance.Procedure_Name=ProcedureName
                        Procedure_instance.Type=procedureType
                        Procedure_instance.IsSeparateFee=IsSeparateFee
                        Procedure_instance.Speciality = Specialityins
 
                        Procedure_instance.SurgeonFee=SurgeonFee
                        Procedure_instance.OTFee=OTFee
                        Procedure_instance.AssistantSurgeonFee = AssistantSurgeonFee
                        Procedure_instance.AnesthesianFee = AnesthesianFee
                        Procedure_instance.TotalAmount=TotalAmount
 
                        Procedure_instance.RoomSurgeonFee = RoomSurgeonFee
                        Procedure_instance.RoomOTFee = RoomOTFee
                        Procedure_instance.RoomAssistantSurgeonFee = RoomAssistantSurgeonFee
                        Procedure_instance.RoomAnesthesianFee = RoomAnesthesianFee
                        Procedure_instance.TotalRoomAmount = TotalRoomAmount
 
                        Procedure_instance.WardSurgeonFee = WardSurgeonFee
                        Procedure_instance.WardOTFee = WardOTFee
                        Procedure_instance.WardAssistantSurgeonFee = WardAssistantSurgeonFee
                        Procedure_instance.WardAnesthesianFee = WardAnesthesianFee
                        Procedure_instance.TotalWardAmount = TotalWardAmount
 
                        Procedure_instance.save()
                       
                        return JsonResponse({'success': 'Procedure Details Updated Successfully'})
                else:
                    if Procedure_Master_Details.objects.filter(Procedure_Name=ProcedureName,Type=procedureType).exists():
                        return JsonResponse({'warn': 'Procedure Name already exists'})
 
                    Procedure_instance = Procedure_Master_Details.objects.create(
 
                        Procedure_Name=ProcedureName,
                        Type=procedureType,
                        Speciality = Specialityins,
                        IsSeparateFee = IsSeparateFee,
 
                        SurgeonFee = SurgeonFee,
                        OTFee = OTFee,
                        AssistantSurgeonFee = AssistantSurgeonFee,
                        AnesthesianFee = AnesthesianFee,
                        TotalAmount = TotalAmount,
 
                        RoomSurgeonFee = RoomSurgeonFee,
                        RoomOTFee = RoomOTFee,
                        RoomAssistantSurgeonFee = RoomAssistantSurgeonFee,
                        RoomAnesthesianFee = RoomAnesthesianFee,
                        TotalRoomAmount = TotalRoomAmount,
 
                        WardSurgeonFee = WardSurgeonFee,
                        WardOTFee = WardOTFee,
                        WardAssistantSurgeonFee = WardAssistantSurgeonFee,
                        WardAnesthesianFee = WardAnesthesianFee,
                        TotalWardAmount = TotalWardAmount,
                       
                        # IsGst=IsGst,
                        # GstValue=GSTValue,
                        # Amount=Amount,
                        created_by=created_by
                    )
 
                    return JsonResponse({'success': 'Procedure Details added successfully'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
    elif request.method == 'GET':
        try:
            MasterType = request.GET.get('MasterType')
            Type = request.GET.get('Type')
            SearchBy = request.GET.get('SearchBy')
           
            if MasterType == 'Service':
 
                if Type:
 
                    Service_Procedure_ins = Service_Master_Details.objects.filter(
                     Q(ServiceCategory=Type)
                )
                   
                else:
 
                    Service_Procedure_ins = Service_Master_Details.objects.filter(
                        Q(Department__icontains=Type) & (Q(Service_Name__icontains=SearchBy) | Q(Service_Id__icontains=SearchBy))
                    )
            else:
                if Type:
 
                    Service_Procedure_ins = Procedure_Master_Details.objects.filter(
                        Q(Speciality_id=Type)
                    )
 
                else:
 
                    Service_Procedure_ins = Procedure_Master_Details.objects.filter(
                         (Q(Procedure_Name__icontains=SearchBy) | Q(Procedure_Id__icontains=SearchBy))
                    )
 
            Service_Procedure_data = []
            for Serpro in Service_Procedure_ins:
                Serpro_dict = {}
                if MasterType == 'Service':
                    service_cat_ins = Service_Category_Masters.objects.get(Serviceid = Serpro.ServiceCategory.Serviceid)
                    Serpro_dict = {
                        'id': Serpro.Service_Id,
                        'ServiceCatId': service_cat_ins.Serviceid,
                        'ServiceCatName': service_cat_ins.ServiceCategory,
                        'ServiceName': Serpro.Service_Name,
                        'ServiceType': Serpro.Service_Type,
                        'Department': Serpro.Department,
                        'IsGst': Serpro.IsGst,
                        'GSTValue': Serpro.GstValue,
                        'Amount': Serpro.Amount,
                        'Status': 'Active' if Serpro.Status else 'Inactive',
                        'CreatedBy': Serpro.created_by,
                        'ISWardConsession' : 'Yes' if Serpro.ISWardConsession else 'No',
                        'ISWardPercentage' : Serpro.ISWardPercentage,
                    }
                else:
                    Serpro_dict = {
                        'id': Serpro.Procedure_Id,
                        'ProcedureName': Serpro.Procedure_Name,
                        'Type': Serpro.Type,
                        # 'IsGst': Serpro.IsGst,
                        # 'GSTValue': Serpro.GstValue,
                       
                        'SpecialityId': Serpro.Speciality.Speciality_Id,
                        'SpecialityName': Serpro.Speciality.Speciality_Name,
                        'IsSeparateFee': 'true' if Serpro.IsSeparateFee == True else 'false',
 
                        'SurgeonFee': Serpro.SurgeonFee,
                        'OTFee': Serpro.OTFee,
                        'AssistantSurgeonFee': Serpro.AssistantSurgeonFee,
                        'AnesthesianFee': Serpro.AnesthesianFee,
                        'TotalAmount': Serpro.TotalAmount,
 
                        'RoomSurgeonFee': Serpro.RoomSurgeonFee,
                        'RoomOTFee': Serpro.RoomOTFee,
                        'RoomAssistantSurgeonFee': Serpro.RoomAssistantSurgeonFee,
                        'RoomAnesthesianFee': Serpro.RoomAnesthesianFee,
                        'TotalRoomAmount': Serpro.TotalRoomAmount,
 
                        'WardSurgeonFee': Serpro.WardSurgeonFee,
                        'WardOTFee': Serpro.WardOTFee,
                        'WardAssistantSurgeonFee': Serpro.WardAssistantSurgeonFee,
                        'WardAnesthesianFee': Serpro.WardAnesthesianFee,
                        'TotalWardAmount': Serpro.TotalWardAmount,
 
 
                        'Status': 'Active' if Serpro.Status else 'Inactive',
                        'CreatedBy': Serpro.created_by,
 
                    }
                Service_Procedure_data.append(Serpro_dict)
 
            return JsonResponse(Service_Procedure_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
 
 
 



@csrf_exempt
def update_status_Service_Procedure_Detials_link(request):
    try:
        data = json.loads(request.body)
        print(data)
        MasterType = data.get('MasterType', '')

        # Insurance data
        id = data.get('id', '')   
        # Retrieve data from Doctor_Personal_Form_Detials
        if MasterType == 'Service':
            if id:
                
                Service_data = Service_Master_Details.objects.get(pk = id)
                Service_data.Status = not Service_data.Status
                Service_data.save()
                return JsonResponse({'success': 'Service Status Updated successfully'})
            return JsonResponse({'success': 'Service '})
        else:
            if id:
                
                Procedure_data = Procedure_Master_Details.objects.get(pk = id)
                Procedure_data.Status = not Procedure_data.Status
                Procedure_data.save()
                return JsonResponse({'success': 'Procedure Status Updated successfully'})
            return JsonResponse({'success': 'Procedure '})        

        # Return JSON response
       
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})


@csrf_exempt
def Service_Procedure_Ratecard_details_view_by_id(request):
    try:
        MasterType = request.GET.get('MasterType')
        print('MasterType------------------',MasterType)
        id = request.GET.get('id')
       
        if not id:
            return JsonResponse({'warn': 'ID is required to fetch the ratecard details'}, safe=False)
       
        if MasterType == 'Service':
            service_procedure_ins = Service_Master_Details.objects.get(pk=id)
            ratecard_ins = Service_Procedure_Charges.objects.filter(MasterType=MasterType, Service_ratecard__pk=id)
        else:
            service_procedure_ins = Procedure_Master_Details.objects.get(pk=id)
            ratecard_ins = Service_Procedure_Charges.objects.filter(MasterType=MasterType, Procedure_ratecard__pk=id)
 
        doctor_data = {
            'id': service_procedure_ins.pk,
            'Service_procedure_name': service_procedure_ins.Service_Name if MasterType == 'Service' else service_procedure_ins.Procedure_Name,
            'Typess': service_procedure_ins.Department if MasterType == 'Service' else service_procedure_ins.Type,
            'Status': 'Active' if service_procedure_ins.Status else 'Inactive',
            'Roomtypes': [],
            'Ratecarddetials': [],
        }
 
        for ratecard in ratecard_ins:
            doctor_data['Ratecarddetials'].append(
                {
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': None,
                    'RatecardShow': None,
                    'RatecardName': None,
                    'ratecard_id':None,
                    'locationshow':ratecard.Location.Location_Name,
                    'location_id':ratecard.Location.Location_Id,
                    'location_name':ratecard.Location.Location_Name,
 
                }
            )
           
           
            General_rates={
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': 'General',
                    'RatecardShow': 'General',
                    'RatecardName': None,
                    'ratecard_id': ratecard.pk,
                    'locationshow': None,
                    'location_id': ratecard.Location.Location_Id,
                    'location_name': ratecard.Location.Location_Name,
                }
            if MasterType=='Service' and doctor_data['Typess'] == 'OP':
               
                service_procedure_rates= Service_Procedure_Rate_Charges.objects.get(Service_Procedure_ratecard=ratecard)
                General_rates['prev_fee']=service_procedure_rates.General_Prev_fee
                General_rates['fee']=service_procedure_rates.General_fee
           
            elif MasterType=='Service' and doctor_data['Typess'] == 'IP':
               
                service_procedure_room_rates= Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    print("room_name----------------",room_name)
                    room_id = room.room_type.Room_Id
                    General_rates[f'{room_name}_{room_id}_prev_fee'] = room.General_Prev_fee
                    General_rates[f'{room_name}_{room_id}_curr_fee'] = room.General_fee
            else:
                service_procedure_rates= Service_Procedure_Rate_Charges.objects.get(Service_Procedure_ratecard=ratecard)
                General_rates['prev_fee']=service_procedure_rates.General_Prev_fee
                General_rates['fee']=service_procedure_rates.General_fee
               
                service_procedure_room_rates= Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    General_rates[f'{room_name}_{room_id}_prev_fee'] = room.General_Prev_fee
                    General_rates[f'{room_name}_{room_id}_curr_fee'] = room.General_fee
           
            doctor_data['Ratecarddetials'].append(General_rates)
           
            Special_rates={
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': 'Special',
                    'RatecardShow': 'Special',
                    'RatecardName': None,
                    'ratecard_id': ratecard.pk,
                    'locationshow': None,
                    'location_id': ratecard.Location.Location_Id,
                    'location_name': ratecard.Location.Location_Name,
                }
            if MasterType=='Service' and doctor_data['Typess'] == 'OP':
                service_procedure_rates= Service_Procedure_Rate_Charges.objects.get(Service_Procedure_ratecard=ratecard)
                Special_rates['prev_fee']=service_procedure_rates.Special_Prev_fee
                Special_rates['fee']=service_procedure_rates.Special_fee
               
            elif MasterType=='Service' and doctor_data['Typess'] == 'IP':
                service_procedure_room_rates= Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    Special_rates[f'{room_name}_{room_id}_prev_fee'] = room.Special_Prev_fee
                    Special_rates[f'{room_name}_{room_id}_curr_fee'] = room.Special_fee
            else:
                service_procedure_rates= Service_Procedure_Rate_Charges.objects.get(Service_Procedure_ratecard=ratecard)
                Special_rates['prev_fee']=service_procedure_rates.Special_Prev_fee
                Special_rates['fee']=service_procedure_rates.Special_fee
               
                service_procedure_room_rates= Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    Special_rates[f'{room_name}_{room_id}_prev_fee'] = room.Special_Prev_fee
                    Special_rates[f'{room_name}_{room_id}_curr_fee'] = room.Special_fee
           
            doctor_data['Ratecarddetials'].append(Special_rates)
           
           
           
            # Client rates
            if Client_Master_Detials.objects.exists():
                doctor_data['Ratecarddetials'].append({
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Client',
                    'RatecardShow': 'Client',
                    'RatecardName': None,
                    'ratecard_id': None,
                    'locationshow': None,
                    'location_id': None,
                    'location_name': None,
                })
               
               
                if MasterType=='Service' and doctor_data['Typess'] == 'OP':
                    service_procedure_client_rate = Service_Procedure_ClientFee.objects.filter(Service_Procedure_ratecard=ratecard)
                    for cli in service_procedure_client_rate:
                        client_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Client',
                            'RatecardShow': None,
                            'ratecard_id': cli.Service_Procedure_ratecard.pk,
                            'RatecardName': cli.client.Client_Name,
                            'Ratecardid': cli.client.Client_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                           
                        }
                        client_ratecard['prev_fee']=cli.Prev_fee
                        client_ratecard['fee']=cli.fee
                        doctor_data['Ratecarddetials'].append(client_ratecard)
                       
                elif MasterType=='Service' and doctor_data['Typess'] == 'IP':
                    for clie in Client_Master_Detials.objects.all():
                        client_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Client',
                            'RatecardShow': None,
                            'ratecard_id': ratecard.pk,
                            'RatecardName': clie.Client_Name,
                            'Ratecardid': clie.Client_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                           
                        }
                        service_procedure_roon_client_fee= Service_Procedure_ClientRoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard,client__pk=clie.Client_Id)
                        for room_cli in service_procedure_roon_client_fee:
                            room_name = room_cli.room_type_fee.Ward_Name.Ward_Name
                            print("000000000000000999999999999999")
                            room_id = room_cli.room_type_fee.Room_Id
                            client_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_cli.Prev_fee
                            client_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_cli.fee
                        doctor_data['Ratecarddetials'].append(client_ratecard)
                else:
                    service_procedure_client_rate = Service_Procedure_ClientFee.objects.filter(Service_Procedure_ratecard=ratecard)
                    for cli in service_procedure_client_rate:
                        client_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Client',
                            'RatecardShow': None,
                            'ratecard_id': cli.Service_Procedure_ratecard.pk,
                            'RatecardName': cli.client.Client_Name,
                            'Ratecardid': cli.client.Client_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                           
                        }
                        client_ratecard['prev_fee']=cli.Prev_fee
                        client_ratecard['fee']=cli.fee
                        service_procedure_roon_client_fee= Service_Procedure_ClientRoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard,client__pk=cli.client.Client_Id)
                        for room_cli in service_procedure_roon_client_fee:
                            room_name = room_cli.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_cli.room_type_fee.Room_Id
                            client_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_cli.Prev_fee
                            client_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_cli.fee    
                       
                        doctor_data['Ratecarddetials'].append(client_ratecard)
           
            # for insurance
            if Insurance_Master_Detials.objects.exists():
                doctor_data['Ratecarddetials'].append({
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Insurance',
                    'RatecardShow': 'Insurance',
                    'RatecardName': None,
                    'ratecard_id': None,
                    'locationshow': None,
                    'location_id': None,
                    'location_name': None,
                })
               
                if MasterType=='Service' and doctor_data['Typess'] == 'OP':
                    service_procedure_insurance_rate = Service_Procedure_InsuranceFee.objects.filter(Service_Procedure_ratecard=ratecard)
                    for ins in service_procedure_insurance_rate:
                        ins_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Insurance',
                            'RatecardShow': None,
                            'ratecard_id': ins.Service_Procedure_ratecard.pk,
                            'RatecardName': ins.insurance.Insurance_Name ,
                            'Ratecardid': ins.insurance.Insurance_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
 
                        }
                        ins_ratecard['prev_fee']=ins.Prev_fee
                        ins_ratecard['fee']=ins.fee
                        doctor_data['Ratecarddetials'].append(ins_ratecard)
                   
                elif MasterType=='Service' and doctor_data['Typess'] == 'IP':
                    for ins in Insurance_Master_Detials.objects.all():
                        ins_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Insurance',
                            'RatecardShow': None,
                            'ratecard_id': ratecard.pk,
                            'RatecardName': ins.Insurance_Name,
                            'Ratecardid': ins.Insurance_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                           
                        }
                        service_procedure_roon_client_fee= Service_Procedure_InsuranceRoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard,insurance__pk=ins.Insurance_Id)
                        for room_ins in service_procedure_roon_client_fee:
                            room_name = room_ins.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_ins.room_type_fee.Room_Id
                            ins_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_ins.Prev_fee
                            ins_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_ins.fee
                        doctor_data['Ratecarddetials'].append(ins_ratecard)
                else:
                    service_procedure_insurance_rate = Service_Procedure_InsuranceFee.objects.filter(Service_Procedure_ratecard=ratecard)
                    for ins in service_procedure_insurance_rate:
                        ins_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Insurance',
                            'RatecardShow': None,
                            'ratecard_id': ins.Service_Procedure_ratecard.pk,
                            'RatecardName': ins.insurance.Insurance_Name,
                            'Ratecardid': ins.insurance.Insurance_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
 
                        }
                        ins_ratecard['prev_fee']=ins.Prev_fee
                        ins_ratecard['fee']=ins.fee
                        service_procedure_roon_client_fee= Service_Procedure_InsuranceRoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard,insurance__pk=ins.insurance.Insurance_Id)
                        for room_ins in service_procedure_roon_client_fee:
                            room_name = room_ins.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_ins.room_type_fee.Room_Id
                            ins_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_ins.Prev_fee
                            ins_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_ins.fee
                        doctor_data['Ratecarddetials'].append(ins_ratecard)
           
            if MasterType=='Service' or doctor_data['Typess'] != 'OP':              
                for room_fee in Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=ratecard):
                        room_name = room_fee.room_type.Ward_Name.Ward_Name
                        room_id = room_fee.room_type.Room_Id
                        if {'id':room_id,'name':room_name} not in doctor_data['Roomtypes']:
                            doctor_data['Roomtypes'].append({'id':room_id,'name':room_name})        
           
       
       
        return JsonResponse(doctor_data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)})
 

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Service_Procedure_Ratecard_details_update(request):
    try:
        data = json.loads(request.body)
        MasterType = data.get('MasterType')
        RatecardType = data.get('RatecardType')
        SP_ratecard_id = data.get('SP_ratecard_id')
        SP_Ratecardid = data.get('SP_Ratecardid')
        locationid = data.get('location')
        colId = data.get('colId')
        col = data.get('col')
        changedRate = data.get('changedRate')
        
        
        # Check if the Service_Procedure_Charges record exists
        try:
            service_procedure_details = Service_Procedure_Charges.objects.get(pk=SP_ratecard_id)
            
        except Service_Procedure_Charges.DoesNotExist:
            return JsonResponse({'error': 'Service_Procedure_Charges record not found'}, status=404)

        
        if col =='OP':
            service_procedure_OP_rates = Service_Procedure_Rate_Charges.objects.get(Service_Procedure_ratecard=service_procedure_details)
            if RatecardType == 'General':
                service_procedure_OP_rates.General_Prev_fee = service_procedure_OP_rates.General_fee
                service_procedure_OP_rates.General_fee = changedRate
                service_procedure_OP_rates.save()
            elif RatecardType == 'Special':
                service_procedure_OP_rates.Special_Prev_fee = service_procedure_OP_rates.Special_fee
                service_procedure_OP_rates.Special_fee = changedRate
                service_procedure_OP_rates.save()
            elif RatecardType == 'Client':
                service_procedure_client_rate = Service_Procedure_ClientFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,client__pk = SP_Ratecardid)
                service_procedure_client_rate.Prev_fee = service_procedure_client_rate.fee
                service_procedure_client_rate.fee = changedRate
                service_procedure_client_rate.save()
            elif RatecardType == 'Insurance':
                service_procedure_insurance_rate = Service_Procedure_InsuranceFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,insurance__pk=SP_Ratecardid)
                service_procedure_insurance_rate.Prev_fee = service_procedure_insurance_rate.fee
                service_procedure_insurance_rate.fee = changedRate
                service_procedure_insurance_rate.save()
        else:
            if RatecardType == 'General':
                service_procedure_room_charge=Service_Procedure_RoomTypeFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,room_type__pk=colId)
                service_procedure_room_charge.General_Prev_fee = service_procedure_room_charge.General_fee
                service_procedure_room_charge.General_fee = changedRate
                service_procedure_room_charge.save()
            elif RatecardType == 'Special':
                service_procedure_room_charge=Service_Procedure_RoomTypeFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,room_type__pk=colId)
                service_procedure_room_charge.Special_Prev_fee = service_procedure_room_charge.Special_fee
                service_procedure_room_charge.Special_fee = changedRate
                service_procedure_room_charge.save()
            elif RatecardType == 'Client':
                service_procedure_room_client_charge=Service_Procedure_ClientRoomTypeFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,room_type_fee__pk=colId,client__pk=SP_Ratecardid)
                service_procedure_room_client_charge.Prev_fee = service_procedure_room_client_charge.fee
                service_procedure_room_client_charge.fee = changedRate
                service_procedure_room_client_charge.save()
            elif RatecardType == 'Insurance':
                service_procedure_room_ins_charge=Service_Procedure_InsuranceRoomTypeFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,room_type_fee__pk=colId,insurance__pk=SP_Ratecardid)
                service_procedure_room_ins_charge.Prev_fee = service_procedure_room_ins_charge.fee
                service_procedure_room_ins_charge.fee = changedRate
                service_procedure_room_ins_charge.save()
            
            
       
                
        return JsonResponse({'success': f'{MasterType} ratecard details updated successfully'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)





@csrf_exempt
def get_service_procedure_for_ip(request):
    try:
        
        MasterType = request.GET.get('MasterType', '')

        if MasterType:
            
            # Retrieve data from Doctor_Personal_Form_Detials
            if MasterType == 'Service':
                
                Service_data = Service_Master_Details.objects.filter(Status=True).exclude(Department= 'OP')
                ser_dat = [{'id': service.pk, 'name': service.Service_Name,'Type':service.Service_Type} for service in Service_data]
                return JsonResponse(ser_dat,safe=False)

            else:
                Procedure_data = Procedure_Master_Details.objects.filter(Status=True)
                ser_dat = [{'id': pro.pk, 'name': pro.Procedure_Name,'Type':pro.Type} for pro in Procedure_data]
                return JsonResponse(ser_dat,safe=False)
     
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})

def Surgery_Procedure_Ratecard_details_view_by_id(request):
    try:
        MasterType = request.GET.get('MasterType','Surgery')
        id = request.GET.get('id')

        if not id:
            return JsonResponse({'warn': 'ID is required to fetch the ratecard details'}, safe=False)
        if not MasterType:
            return JsonResponse({'warn': 'MasterType is required'})
        
        if MasterType == 'Surgery':
            service_procedure_ins = SurgeryName_Details.objects.get(pk=id)
            ratecard_ins = Surgery_Procedure_Charges.objects.filter(MasterType=MasterType, Surgery_ratecard__pk=id)
            print("ratecard_ins1------------",ratecard_ins)

        doctor_data = {
            'id': service_procedure_ins.pk,
            'Service_procedure_name': service_procedure_ins.Surgery_Name if MasterType == 'Surgery' else None,
            'Typess': 'IP',
            'Status': 'Active' if service_procedure_ins.Status else 'Inactive',
            'Roomtypes': [],
            'Ratecarddetials': [],
        }
        print("doctor_data",doctor_data)
        for ratecard in ratecard_ins:
            doctor_data['Ratecarddetials'].append(
                {
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': None,
                    'RatecardShow': None,
                    'RatecardName': None,
                    'ratecard_id':None,
                    'locationshow':ratecard.Location.Location_Name,
                    'location_id':ratecard.Location.Location_Id,
                    'location_name':ratecard.Location.Location_Name,

                }

            )

            General_rates={
                'id': len(doctor_data['Ratecarddetials']) + 1,
                'isrowgroup': False,
                'RatecardType': 'General',
                'RatecardShow': 'General',
                'RatecardName': None,
                'ratecard_id': ratecard.pk,
                'locationshow': None,
                'location_id': ratecard.Location.Location_Id,
                'location_name': ratecard.Location.Location_Name,

            }
            print("General_rates",General_rates)
            if MasterType=='Surgery'and doctor_data['Typess'] == 'IP':
                # print("111111111111-----------")
                service_procedure_room_rates= Surgery_Procedure_RoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    General_rates[f'{room_name}_{room_id}_prev_fee'] = room.General_Prev_fee
                    General_rates[f'{room_name}_{room_id}_curr_fee'] = room.General_fee
            else:
                # print("---------------22222222222")
                service_procedure_rates= Surgery_Procedure_Rate_Charges.objects.get(Surgery__Procedure_ratecard=ratecard)
                General_rates['prev_fee']=service_procedure_rates.General_Prev_fee
                General_rates['fee']=service_procedure_rates.General_fee
                
                service_procedure_room_rates= Surgery_Procedure_RoomTypeFee.objects.filter(Surgery__Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    General_rates[f'{room_name}_{room_id}_prev_fee'] = room.General_Prev_fee
                    General_rates[f'{room_name}_{room_id}_curr_fee'] = room.General_fee
            doctor_data['Ratecarddetials'].append(General_rates)
            Special_rates={
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': 'Special',
                    'RatecardShow': 'Special',
                    'RatecardName': None,
                    'ratecard_id': ratecard.pk,
                    'locationshow': None,
                    'location_id': ratecard.Location.Location_Id,
                    'location_name': ratecard.Location.Location_Name,
                }
            print("Special_rates",Special_rates)
            if MasterType=='Surgery' and doctor_data['Typess'] == 'IP':
             
                service_procedure_room_rates= Surgery_Procedure_RoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    Special_rates[f'{room_name}_{room_id}_prev_fee'] = room.Special_Prev_fee
                    Special_rates[f'{room_name}_{room_id}_curr_fee'] = room.Special_fee
            else:
             
                service_procedure_rates= Surgery_Procedure_Rate_Charges.objects.get(Surgery_Procedure_ratecard=ratecard)
                Special_rates['prev_fee']=service_procedure_rates.Special_Prev_fee
                Special_rates['fee']=service_procedure_rates.Special_fee

                service_procedure_room_rates= Surgery_Procedure_RoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard)
                for room in service_procedure_room_rates:
                    room_name = room.room_type.Ward_Name.Ward_Name
                    room_id = room.room_type.Room_Id
                    Special_rates[f'{room_name}_{room_id}_prev_fee'] = room.Special_Prev_fee
                    Special_rates[f'{room_name}_{room_id}_curr_fee'] = room.Special_fee

            doctor_data['Ratecarddetials'].append(Special_rates)

            if Client_Master_Detials.objects.exists():
                doctor_data['Ratecarddetials'].append({
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Client',
                    'RatecardShow': 'Client',
                    'RatecardName': None,
                    'ratecard_id': None,
                    'locationshow': None,
                    'location_id': None,
                    'location_name': None,
                })
              
                if MasterType=='Surgery' and doctor_data['Typess'] == 'IP':
                    
                    for clie in Client_Master_Detials.objects.all():
                        client_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Client',
                            'RatecardShow': None,
                            'ratecard_id': ratecard.pk,
                            'RatecardName': clie.Client_Name,
                            'Ratecardid': clie.Client_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                            
                        }
                        service_procedure_roon_client_fee= Surgery_Procedure_ClientRoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard,client__pk=clie.Client_Id)
                        for room_cli in service_procedure_roon_client_fee:
                            room_name = room_cli.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_cli.room_type_fee.Room_Id
                            client_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_cli.Prev_fee
                            client_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_cli.fee
                        doctor_data['Ratecarddetials'].append(client_ratecard)
                else:
                  
                    service_procedure_client_rate = Surgery_Procedure_ClientFee.objects.filter(Surgery_Procedure_ratecard=ratecard)
                    for cli in service_procedure_client_rate:
                        client_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Client',
                            'RatecardShow': None,
                            'ratecard_id': cli.Surgery_Procedure_ratecard.pk,
                            'RatecardName': cli.client.Client_Name,
                            'Ratecardid': cli.client.Client_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                            
                        }
                        client_ratecard['prev_fee']=cli.Prev_fee
                        client_ratecard['fee']=cli.fee 
                        service_procedure_roon_client_fee= Surgery_Procedure_ClientRoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard,client__pk=cli.client.Client_Id)
                        for room_cli in service_procedure_roon_client_fee:
                            room_name = room_cli.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_cli.room_type_fee.Room_Id
                            client_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_cli.Prev_fee
                            client_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_cli.fee    
                        
                        doctor_data['Ratecarddetials'].append(client_ratecard)
           

                            # for insurance
            if Insurance_Master_Detials.objects.exists():
                doctor_data['Ratecarddetials'].append({
                    'id': len(doctor_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Insurance',
                    'RatecardShow': 'Insurance',
                    'RatecardName': None,
                    'ratecard_id': None,
                    'locationshow': None,
                    'location_id': None,
                    'location_name': None,
                })
                
              
                if MasterType=='Surgery' and doctor_data['Typess'] == 'IP':
                   
                    for ins in Insurance_Master_Detials.objects.all():
                        ins_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Insurance',
                            'RatecardShow': None,
                            'ratecard_id': ratecard.pk,
                            'RatecardName': ins.Insurance_Name,
                            'Ratecardid': ins.Insurance_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,
                            
                        }
                        service_procedure_roon_client_fee= Surgery_Procedure_InsuranceRoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard,insurance__pk=ins.Insurance_Id)
                        for room_ins in service_procedure_roon_client_fee:
                            room_name = room_ins.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_ins.room_type_fee.Room_Id
                            ins_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_ins.Prev_fee
                            ins_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_ins.fee
                        doctor_data['Ratecarddetials'].append(ins_ratecard)
                else:
                    
                    service_procedure_insurance_rate = Surgery_Procedure_InsuranceFee.objects.filter(Surgery_Procedure_ratecard=ratecard)
                    for ins in service_procedure_insurance_rate:
                        ins_ratecard = {
                            'id': len(doctor_data['Ratecarddetials']) + 1,
                            'isrowgroup': False,
                            'RatecardType': 'Insurance',
                            'RatecardShow': None,
                            'ratecard_id': ins.Surgery_Procedure_ratecard.pk,
                            'RatecardName': ins.insurance.Insurance_Name,
                            'Ratecardid': ins.insurance.Insurance_Id,
                            'locationshow': None,
                            'location_id': ratecard.Location.Location_Id,
                            'location_name': ratecard.Location.Location_Name,

                        }
                        ins_ratecard['prev_fee']=ins.Prev_fee
                        ins_ratecard['fee']=ins.fee
                        service_procedure_roon_client_fee= Surgery_Procedure_InsuranceRoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard,insurance__pk=ins.insurance.Insurance_Id)
                        for room_ins in service_procedure_roon_client_fee:
                            room_name = room_ins.room_type_fee.Ward_Name.Ward_Name
                            room_id = room_ins.room_type_fee.Room_Id
                            ins_ratecard[f'{room_name}_{room_id}_prev_fee'] = room_ins.Prev_fee
                            ins_ratecard[f'{room_name}_{room_id}_curr_fee'] = room_ins.fee
                        doctor_data['Ratecarddetials'].append(ins_ratecard)
            
            if MasterType=='Surgery' or doctor_data['Typess'] != 'OP':               
                for room_fee in Surgery_Procedure_RoomTypeFee.objects.filter(Surgery_Procedure_ratecard=ratecard):
                        room_name = room_fee.room_type.Ward_Name.Ward_Name
                        room_id = room_fee.room_type.Room_Id
                        if {'id':room_id,'name':room_name} not in doctor_data['Roomtypes']:
                            doctor_data['Roomtypes'].append({'id':room_id,'name':room_name})        
            
        return JsonResponse(doctor_data, safe=False)


    except Exception as e:
        return JsonResponse({'error': str(e)})



@csrf_exempt
@require_http_methods(["POST",  "OPTIONS"])
def Surgery_Procedure_Ratecard_details_update(request):
    try:
        data = json.loads(request.body)
        MasterType = data.get('MasterType')
        RatecardType = data.get('RatecardType')
        SP_ratecard_id = data.get('SP_ratecard_id')
        SP_Ratecardid = data.get('SP_Ratecardid')
        locationid = data.get('location')
        colId = data.get('colId')
        col = data.get('col')
        changedRate = data.get('changedRate')

        try:
            surgery_procedure_details = Surgery_Procedure_Charges.objects.get(pk=SP_ratecard_id)
        
        except Surgery_Procedure_Charges.DoesNotExist:
            return JsonResponse({'error':'Surgery_Procedure_Charges record not found '}, status=404)


        if RatecardType == 'General':
            surgery_procedure_room_charge=Surgery_Procedure_RoomTypeFee.objects.get(Surgery_Procedure_ratecard__pk=SP_ratecard_id,room_type__pk=colId)
            surgery_procedure_room_charge.General_Prev_fee = surgery_procedure_room_charge.General_fee
            surgery_procedure_room_charge.General_fee = changedRate
            surgery_procedure_room_charge.save()
        elif RatecardType == 'Special':
            surgery_procedure_room_charge=Surgery_Procedure_RoomTypeFee.objects.get(Surgery_Procedure_ratecard__pk=SP_ratecard_id,room_type__pk=colId)
            surgery_procedure_room_charge.Special_Prev_fee = surgery_procedure_room_charge.Special_fee
            surgery_procedure_room_charge.Special_fee = changedRate
            surgery_procedure_room_charge.save()
        elif RatecardType == 'Client':
            surgery_procedure_room_client_charge = Surgery_Procedure_ClientRoomTypeFee.objects.get(Surgery_Procedure_ratecard__pk=SP_ratecard_id,room_type_fee__pk=colId,client__pk=SP_Ratecardid)
            surgery_procedure_room_client_charge.Prev_fee = surgery_procedure_room_client_charge.fee
            surgery_procedure_room_client_charge.fee = changedRate
            surgery_procedure_room_client_charge.save()
        elif RatecardType == 'Insurance':
            surgery_procedure_room_ins_charge=Service_Procedure_InsuranceRoomTypeFee.objects.get(Service_Procedure_ratecard__pk=SP_ratecard_id,room_type_fee__pk=colId,insurance__pk=SP_Ratecardid)
            surgery_procedure_room_ins_charge.Prev_fee = surgery_procedure_room_ins_charge.fee
            surgery_procedure_room_ins_charge.fee = changedRate
            surgery_procedure_room_ins_charge.save()

        return JsonResponse({'success': f'{MasterType} ratecard details updated successfully'}, status=200)

        
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db import transaction
from decimal import Decimal
import json
import logging
 
from .models import (
    Procedure_Master_Details, wardFeeProcedure, InsuranceFeeProcedure,
    ClientFeeProcedure, CorporateFeeProcedure, DiscountFeeProcedure
)
 
logger = logging.getLogger(__name__)
 
 
@csrf_exempt
@require_http_methods(["OPTIONS", "GET", "POST"])
def Procedure_Ratecard_Master_API(request):
    if request.method == "GET":
        try:
            SearchbySpecialityId = request.GET.get('SearchbySpecialityId','')
            SearchbyProcedureName = request.GET.get('SearchbyProcedureName','')
            all_ratecards = None
 
            if SearchbySpecialityId:
                all_ratecards = Procedure_Master_Details.objects.filter(Speciality__Speciality_Id = SearchbySpecialityId)
 
            if SearchbyProcedureName:
                all_ratecards = Procedure_Master_Details.objects.filter(Procedure_Name__icontains = SearchbyProcedureName)
 
            else:
                all_ratecards = Procedure_Master_Details.objects.select_related('Speciality').all()[:10]
 
            data = []
 
            for ratecard in all_ratecards:
                item = {
                    "id": f"PRM{ratecard.Procedure_Id}",
                    "ProcedureName": ratecard.Procedure_Name,
                    "ProcedureId": ratecard.Procedure_Id,
                    "CGHSCode": ratecard.CGHS_CODE or "",  # Add CGHS Code to response
                    "BasicFee": str(ratecard.TotalAmount),
                    "SurgeonFee": str(ratecard.SurgeonFee),
                    "OTFee": str(ratecard.OTFee),
                    "AssistantSurgeonFee": str(ratecard.AssistantSurgeonFee),
                    "AnesthesianFee": str(ratecard.AnesthesianFee),
                    "Speciality": ratecard.Speciality.Speciality_Name if ratecard.Speciality else "",
                    "DoctorContribution": [
                        {"Type": "Inhouse", "Value": str(ratecard.Inhouse_Doctor_Con), "Method": ratecard.Inhouse_Method or ""},
                        {"Type": "Referral", "Value": str(ratecard.Referral_Doctor_Con), "Method": ratecard.Referral_Method or ""},
                        {"Type": "Visiting", "Value": str(ratecard.Visiting_Doctor_Con), "Method": ratecard.Visiting_Method or ""}
                    ],
                    "WardDetails": [],
                    "InsuranceDetails": [],
                    "ClientDetails": [],
                    "CorporateDetails": [],
                    "DiscountDetails": []
                }
 
                # Ward Fees
                for ward in ratecard.Procedure_masters_ward_ratecard.all():
                    item["WardDetails"].append({
                        "WardName": ward.Ward.Ward_Name,
                        "WardId": ward.Ward.Ward_Id,
                        "Fee": str(ward.Fee),
                        "SurgeonFee": str(ward.SurgeonFee),
                        "OTFee": str(ward.OTFee),
                        "AssistantSurgeonFee": str(ward.AssistantSurgeonFee),
                        "AnesthesianFee": str(ward.AnesthesianFee),
                        "SpecialFee": str(ward.Special_fee),
                        "SpecialSurgeonFee": str(ward.Special_SurgeonFee),
                        "SpecialOTFee": str(ward.Special_OTFee),
                        "SpecialAssistantSurgeonFee": str(ward.Special_AssistantSurgeonFee),
                        "SpecialAnesthesianFee": str(ward.Special_AnesthesianFee)
                    })
 
                # Insurance Fees
                for ins in ratecard.Procedure_masters_Ins_ratecard.all():
                    item["InsuranceDetails"].append({
                        "RatecardName": ins.Insurance.Insurance_Name,
                        "Ratecardid": ins.Insurance.Insurance_Id,
                        "Fee": str(ins.Fee),
                        "SurgeonFee": str(ins.SurgeonFee),
                        "OTFee": str(ins.OTFee),
                        "AssistantSurgeonFee": str(ins.AssistantSurgeonFee),
                        "AnesthesianFee": str(ins.AnesthesianFee)
                    })
 
                # Client Fees
                for client in ratecard.Procedure_masters_Cli_ratecard.all():
                    item["ClientDetails"].append({
                        "RatecardName": client.Client.Client_Name,
                        "Ratecardid": client.Client.Client_Id,
                        "Fee": str(client.Fee),
                        "SurgeonFee": str(client.SurgeonFee),
                        "OTFee": str(client.OTFee),
                        "AssistantSurgeonFee": str(client.AssistantSurgeonFee),
                        "AnesthesianFee": str(client.AnesthesianFee)
                    })
 
                # Corporate Fees
                for corp in ratecard.Procedure_masters_Cor_ratecard.all():
                    item["CorporateDetails"].append({
                        "RatecardName": corp.Corporate.Corporate_Name,
                        "Ratecardid": corp.Corporate.Corporate_Id,
                        "Fee": str(corp.Fee),
                        "SurgeonFee": str(corp.SurgeonFee),
                        "OTFee": str(corp.OTFee),
                        "AssistantSurgeonFee": str(corp.AssistantSurgeonFee),
                        "AnesthesianFee": str(corp.AnesthesianFee)
                    })
 
                # Discount Fees
                for disc in ratecard.Procedure_masters_discount_ratecard.all():
                    item["DiscountDetails"].append({
                        "RatecardName": disc.discount.DiscountName,
                        "Ratecardid": disc.discount.Discount_ID,
                        "Method": disc.discount_method,
                        "Fee": str(disc.Fee),
                        "SurgeonFee": str(disc.SurgeonFee),
                        "OTFee": str(disc.OTFee),
                        "AssistantSurgeonFee": str(disc.AssistantSurgeonFee),
                        "AnesthesianFee": str(disc.AnesthesianFee)
                    })
 
                data.append(item)
 
            return JsonResponse(data, safe=False)
 
        except Exception as e:
            logger.error(f"GET Procedure Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data,'data123')
            logger.info(f"Received POST Data: {data}")
 
            if not isinstance(data, list):
                return JsonResponse({"error": "Invalid format. Expected list of entries."}, status=400)
 
            with transaction.atomic():
                for entry in data:
                    procedure_id = entry["id"].replace("PRM", "")
                    ratecard = Procedure_Master_Details.objects.get(Procedure_Id=procedure_id)
 
                    # Update Core Fees
                    ratecard.TotalAmount = Decimal(entry["BasicFee"])
                    ratecard.SurgeonFee = Decimal(entry["SurgeonFee"])
                    ratecard.OTFee = Decimal(entry["OTFee"])
                    ratecard.AssistantSurgeonFee = Decimal(entry["AssistantSurgeonFee"])
                    ratecard.AnesthesianFee = Decimal(entry["AnesthesianFee"])
 
                    # Update CGHS Code
                    if "CGHSCode" in entry:
                        ratecard.CGHS_CODE = entry["CGHSCode"]
                        logger.info(f"Updated CGHS_CODE for procedure {procedure_id}: {entry['CGHSCode']}")
 
                    # Doctor Contribution
                    for dc in entry.get("DoctorContribution", []):
                        val = Decimal(dc["Value"])
                        method = dc["Method"]
                        if dc["Type"] == "Inhouse":
                            ratecard.Inhouse_Doctor_Con = val
                            ratecard.Inhouse_Method = method
                        elif dc["Type"] == "Referral":
                            ratecard.Referral_Doctor_Con = val
                            ratecard.Referral_Method = method
                        elif dc["Type"] == "Visiting":
                            ratecard.Visiting_Doctor_Con = val
                            ratecard.Visiting_Method = method
 
                    ratecard.save()
 
                    # Ward Fees Update
                    for ward in entry.get("WardDetails", []):
                        ward_fee, created = wardFeeProcedure.objects.get_or_create(
                            ProcedureId=ratecard,
                            Ward_id=ward["WardId"],
                            defaults={
                                'Fee': Decimal(ward["Fee"]),
                                'SurgeonFee': Decimal(ward["SurgeonFee"]),
                                'OTFee': Decimal(ward["OTFee"]),
                                'AssistantSurgeonFee': Decimal(ward["AssistantSurgeonFee"]),
                                'AnesthesianFee': Decimal(ward["AnesthesianFee"]),
                                'Special_fee': Decimal(ward["SpecialFee"]),
                                'Special_SurgeonFee': Decimal(ward["SpecialSurgeonFee"]),
                                'Special_OTFee': Decimal(ward["SpecialOTFee"]),
                                'Special_AssistantSurgeonFee': Decimal(ward["SpecialAssistantSurgeonFee"]),
                                'Special_AnesthesianFee': Decimal(ward["SpecialAnesthesianFee"])
                            }
                        )
                        if not created:
                            ward_fee.Prev_Fee = ward_fee.Fee
                            ward_fee.Fee = Decimal(ward["Fee"])
                            ward_fee.Prev_SurgeonFee = ward_fee.SurgeonFee
                            ward_fee.SurgeonFee = Decimal(ward["SurgeonFee"])
                            ward_fee.Prev_OTFee = ward_fee.OTFee
                            ward_fee.OTFee = Decimal(ward["OTFee"])
                            ward_fee.Prev_AssistantSurgeonFee = ward_fee.AssistantSurgeonFee
                            ward_fee.AssistantSurgeonFee = Decimal(ward["AssistantSurgeonFee"])
                            ward_fee.Prev_AnesthesianFee = ward_fee.AnesthesianFee
                            ward_fee.AnesthesianFee = Decimal(ward["AnesthesianFee"])
                            ward_fee.Special_Prev_fee = ward_fee.Special_fee
                            ward_fee.Special_fee = Decimal(ward["SpecialFee"])
                            ward_fee.Special_Prev_SurgeonFee = ward_fee.Special_SurgeonFee
                            ward_fee.Special_SurgeonFee = Decimal(ward["SpecialSurgeonFee"])
                            ward_fee.Special_Prev_OTFee = ward_fee.Special_OTFee
                            ward_fee.Special_OTFee = Decimal(ward["SpecialOTFee"])
                            ward_fee.Special_Prev_AssistantSurgeonFee = ward_fee.Special_AssistantSurgeonFee
                            ward_fee.Special_AssistantSurgeonFee = Decimal(ward["SpecialAssistantSurgeonFee"])
                            ward_fee.Special_Prev_AnesthesianFee = ward_fee.Special_AnesthesianFee
                            ward_fee.Special_AnesthesianFee = Decimal(ward["SpecialAnesthesianFee"])
                            ward_fee.save()
 
                    # Insurance Fees Update
                    for ins in entry.get("InsuranceDetails", []):
                        rateins_obj = InsuranceFeeProcedure.objects.get(
                        ProcedureId=ratecard,
                        Insurance__Insurance_Id=ins["Ratecardid"]
                    )
 
                        # Save previous values
                        rateins_obj.Prev_Fee = rateins_obj.Fee
                        rateins_obj.Prev_SurgeonFee = rateins_obj.SurgeonFee
                        rateins_obj.Prev_OTFee = rateins_obj.OTFee
                        rateins_obj.Prev_AssistantSurgeonFee = rateins_obj.AssistantSurgeonFee
                        rateins_obj.Prev_AnesthesianFee = rateins_obj.AnesthesianFee
 
                        # Update with new values
                        rateins_obj.Fee = Decimal(ins["Fee"])
                        rateins_obj.SurgeonFee = Decimal(ins["SurgeonFee"])
                        rateins_obj.OTFee = Decimal(ins["OTFee"])
                        rateins_obj.AssistantSurgeonFee = Decimal(ins["AssistantSurgeonFee"])
                        rateins_obj.AnesthesianFee = Decimal(ins["AnesthesianFee"])
 
                        # Save changes
                        rateins_obj.save()
 
                    # Client Fees Update
                    for client in entry.get("ClientDetails", []):
                       
                        rateins_obj = ClientFeeProcedure.objects.get(
                        ProcedureId=ratecard,
                        Client__Client_Id=client["Ratecardid"]
                            )
 
                        rateins_obj.Prev_Fee = rateins_obj.Fee
                        rateins_obj.Prev_SurgeonFee = rateins_obj.SurgeonFee
                        rateins_obj.Prev_OTFee = rateins_obj.OTFee
                        rateins_obj.Prev_AssistantSurgeonFee = rateins_obj.AssistantSurgeonFee
                        rateins_obj.Prev_AnesthesianFee = rateins_obj.AnesthesianFee
 
                        rateins_obj.Fee = Decimal(client["Fee"])
                        rateins_obj.SurgeonFee = Decimal(client["SurgeonFee"])
                        rateins_obj.OTFee = Decimal(client["OTFee"])
                        rateins_obj.AssistantSurgeonFee = Decimal(client["AssistantSurgeonFee"])
                        rateins_obj.AnesthesianFee = Decimal(client["AnesthesianFee"])
 
                        rateins_obj.save()
 
                    # Corporate Fees Update
                    for corp in entry.get("CorporateDetails", []):
                       
                        rateins_obj = CorporateFeeProcedure.objects.get(
                        ProcedureId=ratecard,
                        Corporate__Corporate_Id=corp["Ratecardid"]
                            )
 
                        rateins_obj.Prev_Fee = rateins_obj.Fee
                        rateins_obj.Prev_SurgeonFee = rateins_obj.SurgeonFee
                        rateins_obj.Prev_OTFee = rateins_obj.OTFee
                        rateins_obj.Prev_AssistantSurgeonFee = rateins_obj.AssistantSurgeonFee
                        rateins_obj.Prev_AnesthesianFee = rateins_obj.AnesthesianFee
 
                        # Update with new values
                        rateins_obj.Fee = Decimal(corp["Fee"])
                        rateins_obj.SurgeonFee = Decimal(corp["SurgeonFee"])
                        rateins_obj.OTFee = Decimal(corp["OTFee"])
                        rateins_obj.AssistantSurgeonFee = Decimal(corp["AssistantSurgeonFee"])
                        rateins_obj.AnesthesianFee = Decimal(corp["AnesthesianFee"])
 
                        # Save changes
                        rateins_obj.save()
 
                    # Discount Fees Update
                    for disc in entry.get("DiscountDetails", []):
                       
                        rateins_obj = DiscountFeeProcedure.objects.get(
                            ProcedureId=ratecard,
                            discount__Discount_ID=disc["Ratecardid"]
                            )
 
                        rateins_obj.Prev_Fee = rateins_obj.Fee
                        rateins_obj.Prev_SurgeonFee = rateins_obj.SurgeonFee
                        rateins_obj.Prev_OTFee = rateins_obj.OTFee
                        rateins_obj.Prev_AssistantSurgeonFee = rateins_obj.AssistantSurgeonFee
                        rateins_obj.Prev_AnesthesianFee = rateins_obj.AnesthesianFee
 
                        # Update with new values
                        rateins_obj.Fee = Decimal(disc["Fee"])
                        rateins_obj.SurgeonFee = Decimal(disc["SurgeonFee"])
                        rateins_obj.OTFee = Decimal(disc["OTFee"])
                        rateins_obj.AssistantSurgeonFee = Decimal(disc["AssistantSurgeonFee"])
                        rateins_obj.AnesthesianFee = Decimal(disc["AnesthesianFee"])
 
                        # Save changes
                        rateins_obj.save()
 
                return JsonResponse({"success": "Procedure Ratecard updated successfully."})
 
        except Procedure_Master_Details.DoesNotExist:
            logger.error(f"Procedure Ratecard not found: {procedure_id}")
            return JsonResponse({'error': 'Procedure Ratecard not found'}, status=404)
        except Exception as e:
            logger.error(f"POST Procedure Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
 
 
 
 
import pandas as pd
from django.http import JsonResponse
from .models import Procedure_Master_Details, Speciality_Detials
import decimal

@csrf_exempt
@require_http_methods(["POST",  "OPTIONS"])
def upload_procedure_excel(request):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            # Read the Excel file
            excel_file = request.FILES['file']
            df = pd.read_excel(excel_file)

            # Initialize response data
            errors = []
            success_count = 0

            # Expected columns based on the model
            expected_columns = [
                'Procedure_Name', 'Type', 'Speciality', 'IsSeparateFee',
                'SurgeonFee', 'OTFee', 'AssistantSurgeonFee', 'AnesthesianFee', 'TotalAmount',
                'RoomSurgeonFee', 'RoomOTFee', 'RoomAssistantSurgeonFee', 'RoomAnesthesianFee', 'TotalRoomAmount',
                'WardSurgeonFee', 'WardOTFee', 'WardAssistantSurgeonFee', 'WardAnesthesianFee', 'TotalWardAmount',
                 'Status', 'created_by'
            ]

            # Check if all expected columns are present
            if not all(col in df.columns for col in expected_columns):
                missing_cols = [col for col in expected_columns if col not in df.columns]
                return JsonResponse({'status': 'error', 'message': f'Missing columns: {", ".join(missing_cols)}'})

            # Process each row
            for index, row in df.iterrows():
                try:
                    # Validate Speciality
                    speciality_id = row['Speciality']
                    speciality_ins = Speciality_Detials.objects.filter(Speciality_Name=speciality_id.strip()).first()
                    if not speciality_ins:
                        errors.append(f"Row {index + 2}: Invalid Speciality ID {speciality_id}")
                        continue

                    # Convert boolean fields
                    is_separate_fee = True if str(row['IsSeparateFee']).lower() == 'true' else False
                    status = True if str(row['Status']).lower() == 'true' else False

                    # Convert decimal fields
                    decimal_fields = [
                        'SurgeonFee', 'OTFee', 'AssistantSurgeonFee', 'AnesthesianFee', 'TotalAmount',
                        'RoomSurgeonFee', 'RoomOTFee', 'RoomAssistantSurgeonFee', 'RoomAnesthesianFee', 'TotalRoomAmount',
                        'WardSurgeonFee', 'WardOTFee', 'WardAssistantSurgeonFee', 'WardAnesthesianFee', 'TotalWardAmount'
                    ]
                    for field in decimal_fields:
                        row[field] = decimal.Decimal(str(row[field])) if pd.notnull(row[field]) else decimal.Decimal('0')


                    if Procedure_Master_Details.objects.filter( Procedure_Name=row['Procedure_Name'],Speciality=speciality_ins).exists():  
                           
                            errors.append(f"Row {index + 2}: Duplicate ProcedureName '{row['Procedure_Name']}' for Speciality '{speciality_ins.Speciality_Name}'")
                            continue
                    logger.info(f"Row {index + 2}: No duplicates found")
 
                    # Create Procedure_Master_Details instance
                    Procedure_Master_Details.objects.create(
                        Procedure_Name=row['Procedure_Name'],
                        Type=row['Type'],
                        Speciality=speciality_ins,
                        IsSeparateFee=is_separate_fee,
                        SurgeonFee=row['SurgeonFee'],
                        OTFee=row['OTFee'],
                        AssistantSurgeonFee=row['AssistantSurgeonFee'],
                        AnesthesianFee=row['AnesthesianFee'],
                        TotalAmount=row['TotalAmount'],
                        RoomSurgeonFee=row['RoomSurgeonFee'],
                        RoomOTFee=row['RoomOTFee'],
                        RoomAssistantSurgeonFee=row['RoomAssistantSurgeonFee'],
                        RoomAnesthesianFee=row['RoomAnesthesianFee'],
                        TotalRoomAmount=row['TotalRoomAmount'],
                        WardSurgeonFee=row['WardSurgeonFee'],
                        WardOTFee=row['WardOTFee'],
                        WardAssistantSurgeonFee=row['WardAssistantSurgeonFee'],
                        WardAnesthesianFee=row['WardAnesthesianFee'],
                        TotalWardAmount=row['TotalWardAmount'],
                        Status=status,
                        created_by=str(row['created_by']) if pd.notnull(row['created_by']) else ''
                    )
                    success_count += 1

                except Exception as e:
                    errors.append(f"Row {index + 2}: {str(e)}")
                    continue

            # Prepare response
            if errors:
                return JsonResponse({
                    'status': 'partial_success',
                    'message': f'{success_count} records uploaded successfully, but {len(errors)} errors occurred.',
                    'errors': errors
                })
            return JsonResponse({
                'success': f'{success_count} records uploaded successfully.'
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Error processing file: {str(e)}'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method or no file provided.'})


import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Service_Category_Masters, Service_Master_Details
import logging

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@csrf_exempt
def upload_service_master_excel(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

    if 'file' not in request.FILES:
        return JsonResponse({'status': 'error', 'message': 'No file uploaded'}, status=400)

    file = request.FILES['file']
    if not file.name.endswith('.xlsx'):
        return JsonResponse({'status': 'error', 'message': 'Invalid file format. Please upload an Excel file (.xlsx)'}, status=400)

    try:
        # Read Excel file
        excel_data = pd.read_excel(file, sheet_name='Service_Master_Details')

        # Validate required columns
        required_columns = [
            'ServiceCategory_id', 'Service_Name', 'Service_Type', 'Department',
            'IsGst', 'GstValue', 'Amount', 'Status', 'created_by'
        ]
        missing_columns = [col for col in required_columns if col not in excel_data.columns]
        if missing_columns:
            return JsonResponse({
                'status': 'error',
                'message': f'Missing required columns: {", ".join(missing_columns)}'
            }, status=400)

        # Process each row
        success_count = 0
        errors = []
        for index, row in excel_data.iterrows():
            try:
                # Map ServiceCategory_id (string) to Service_Category_Masters Serviceid
                service_category = Service_Category_Masters.objects.filter(
                    ServiceCategory=row['ServiceCategory_id']
                ).first()
                logger.info(f"Row {index + 2}: ServiceCategory_id '{row['ServiceCategory_id']}' mapped to {service_category}")
                if not service_category:
                    errors.append(f"Row {index + 2}: Invalid ServiceCategory_id '{row['ServiceCategory_id']}'")
                    continue

                # Validate data types and constraints
                if not isinstance(row['Service_Name'], str) or len(row['Service_Name']) > 100:
                    errors.append(f"Row {index + 2}: Invalid Service_Name")
                    continue
                logger.info(f"Row {index + 2}: Service_Name validated")

                if row['Service_Type'] not in ['Quantity', 'Hourly']:
                    errors.append(f"Row {index + 2}: Invalid Service_Type")
                    continue
                logger.info(f"Row {index + 2}: Service_Type validated")

                if row['Department'] not in ['OP', 'IP', 'Both OP and IP']:
                    errors.append(f"Row {index + 2}: Invalid Department")
                    continue
                logger.info(f"Row {index + 2}: Department validated")

                if row['IsGst'] not in ['Yes', 'No']:
                    errors.append(f"Row {index + 2}: Invalid IsGst")
                    continue
                logger.info(f"Row {index + 2}: IsGst validated")

                # GstValue validation (commented out as per original code)
                # if not isinstance(row['GstValue'], str) or len(row['GstValue']) > 50:
                #     errors.append(f"Row {index + 2}: Invalid GstValue")
                #     continue

                if not isinstance(row['Amount'], (int, float)) or row['Amount'] < 0:
                    errors.append(f"Row {index + 2}: Invalid Amount")
                    continue
                logger.info(f"Row {index + 2}: Amount validated")

                # Validate Status (expects "TRUE" or "FALSE" from Excel)
                if row['Status'] not in [True, False]:
                    errors.append(f"Row {index + 2}: Invalid Status")
                    continue
                # logger.info(f"Row {index + 2}: Status validated as {status_value}")

                if not isinstance(row['created_by'], str) or len(row['created_by']) > 30:
                    errors.append(f"Row {index + 2}: Invalid created_by")
                    continue
                logger.info(f"Row {index + 2}: created_by validated")

                # Check for duplicates (Service_Name within ServiceCategory)
                if Service_Master_Details.objects.filter(
                    ServiceCategory=service_category,
                    Service_Name=row['Service_Name']
                ).exists():
                    errors.append(f"Row {index + 2}: Duplicate Service_Name '{row['Service_Name']}' for ServiceCategory '{row['ServiceCategory_id']}'")
                    continue
                logger.info(f"Row {index + 2}: No duplicates found")

                # Create Service_Master_Details record
                Service_Master_Details.objects.create(
                    ServiceCategory=service_category,
                    Service_Name=row['Service_Name'],
                    Service_Type=row['Service_Type'],
                    Department=row['Department'],
                    IsGst=row['IsGst'],
                    GstValue=str(row['GstValue']),  # Ensure string for GstValue
                    Amount=row['Amount'],
                    Status=row['Status'],
                    created_by=row['created_by']
                )
                success_count += 1
                logger.info(f"Row {index + 2}: Record created successfully")
            except Exception as e:
                logger.error(f"Error processing row {index + 2}: {str(e)}")
                errors.append(f"Row {index + 2}: {str(e)}")
                continue

        # Prepare response
        response = {
            'status': 'success' if success_count > 0 else 'error',
            'message': f'Processed {success_count} records successfully',
            'errors': errors if errors else None
        }
        return JsonResponse({'success': f'{success_count} records uploaded successfully.'})

    except Exception as e:
        logger.error(f"Error processing Excel file: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': f'Error processing file: {str(e)}'
        }, status=500)



# import pandas as pd
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from .models import Service_Category_Masters, Service_Master_Details
# import logging

# # Set up logging
# logger = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# @csrf_exempt
# def upload_service_master_excel(request):
#     if request.method != 'POST':
#         return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

#     if 'file' not in request.FILES:
#         return JsonResponse({'status': 'error', 'message': 'No file uploaded'}, status=400)

#     file = request.FILES['file']
#     if not file.name.endswith('.xlsx'):
#         return JsonResponse({'status': 'error', 'message': 'Invalid file format. Please upload an Excel file (.xlsx)'}, status=400)

#     try:
#         # Read Excel file
#         excel_data = pd.read_excel(file, sheet_name='Service_Master_Details')

#         # Validate required columns
#         required_columns = [
#             'ServiceCategory_id', 'Service_Name', 'Service_Type', 'Department',
#             'IsGst', 'GstValue', 'Amount', 'Status', 'created_by'
#         ]
#         missing_columns = [col for col in required_columns if col not in excel_data.columns]
#         if missing_columns:
#             return JsonResponse({
#                 'status': 'error',
#                 'message': f'Missing required columns: {", ".join(missing_columns)}'
#             }, status=400)

#         # Process each row
#         success_count = 0
#         errors = []
#         for index, row in excel_data.iterrows():
#             try:
#                 # Map ServiceCategory_id (string) to Service_Category_Masters Serviceid
#                 service_category = Service_Category_Masters.objects.filter(
#                     ServiceCategory=row['ServiceCategory_id']
#                 ).first()

#                 print(service_category,'service_categoryyyyyyy')
#                 if not service_category:
#                     errors.append(f"Row {index + 2}: Invalid ServiceCategory_id '{row['ServiceCategory_id']}'")
#                     continue

#                 # Validate data types and constraints
#                 if not isinstance(row['Service_Name'], str) or len(row['Service_Name']) > 100:
#                     errors.append(f"Row {index + 2}: Invalid Service_Name")
#                     continue

#                 print('test1')
#                 if row['Service_Type'] not in ['Quantity', 'Hourly']:
#                     errors.append(f"Row {index + 2}: Invalid Service_Type")
#                     continue
#                 print('test2')

#                 if row['Department'] not in ['OP', 'IP', 'Both OP and IP']:
#                     errors.append(f"Row {index + 2}: Invalid Department")
#                     continue
#                 print('test3')

#                 if row['IsGst'] not in ['Yes', 'No']:
#                     errors.append(f"Row {index + 2}: Invalid IsGst")
#                     continue

#                 print('test4')

#                 # if not isinstance(row['GstValue'], str) or len(row['GstValue']) > 50:
#                 #     errors.append(f"Row {index + 2}: Invalid GstValue")
#                 #     continue
#                 if not isinstance(row['Amount'], (int, float)) or row['Amount'] < 0:
#                     errors.append(f"Row {index + 2}: Invalid Amount")
#                     continue

#                 print('test5',row['Status'])

#                 if row['Status'] not in [True, False]:
#                     errors.append(f"Row {index + 2}: Invalid Status")
#                     continue
#                 print('test6')

#                 if not isinstance(row['created_by'], str) or len(row['created_by']) > 30:
#                     errors.append(f"Row {index + 2}: Invalid created_by")
#                     continue
#                 print('test7')


#                 # Create Service_Master_Details record
#                 Service_Master_Details.objects.create(
#                     ServiceCategory=service_category,
#                     Service_Name=row['Service_Name'],
#                     Service_Type=row['Service_Type'],
#                     Department=row['Department'],
#                     IsGst=row['IsGst'],
#                     GstValue=row['GstValue'],
#                     Amount=row['Amount'],
#                     Status= row['Status'],  # Convert string to boolean
#                     created_by=row['created_by']
#                 )
#                 success_count += 1
#             except Exception as e:
#                 logger.error(f"Error processing row {index + 2}: {str(e)}")
#                 errors.append(f"Row {index + 2}: {str(e)}")
#                 continue

#         # Prepare response
#         response = {
#             'status': 'success' if success_count > 0 else 'error',
#             'message': f'Processed {success_count} records successfully',
#             'errors': errors if errors else None
#         }
#         return JsonResponse({'success': f'{success_count} records uploaded successfully.'})

#     except Exception as e:
#         logger.error(f"Error processing Excel file: {str(e)}")
#         return JsonResponse({
#             'status': 'error',
#             'message': f'Error processing file: {str(e)}'
#         }, status=500)












