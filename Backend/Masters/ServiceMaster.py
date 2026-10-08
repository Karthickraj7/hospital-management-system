from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from Frontoffice.models import *
from django.db.models import Q

@csrf_exempt
@require_http_methods(['GET'])
def Services_List(request):

    if request.method == "GET":

         try:
             
            Services_data_list = []
            consultaion_ins = Doctor_Ratecard_Master.objects.all()
            for datas in consultaion_ins:
                
                Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=datas.Doctor_ID)  
                speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=datas.Doctor_ID.Doctor_ID)
                
                service_data = {
                     
                    'pk': datas.pk,
                    'service_category' : 'Dr.Consultation',
                    'service_subcategory' : f'{datas.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',     
                }
                Services_data_list.append(service_data)
            print('0000000')
            labtest_ins = Testmaster_Cost_List.objects.all()
            for datas in labtest_ins:
              
                service_data = {
                    'pk' : datas.pk,
                    'service_category' : 'Lab',
                    'service_subcategory': f'{datas.Test_Code.Test_Code} - {datas.Test_Code.Test_Name}' if datas.Test_Code else f'{datas.Group_Code.Group_Code}-f{datas.Group_Code.Group_Name}',
                }
                Services_data_list.append(service_data)
            # group_ins = Group_Master.objects.all()
            # print('111111111')
            # for datas in labtest_ins:
            #     service_data = {
            #         'pk': datas.pk,
            #         'service_category': 'Lab',
            #         'service_subcategory': f'{datas.Group_Code.Group_Code}-{datas.Group_Code.Group_Name}' if datas.Group_Code else None,
            #     }
            #     Services_data_list.append(service_data)
            print('22222222222')
            Radiology_ins = TestName_Details.objects.all()
            for datas in Radiology_ins:
                
                service_data = {
                    'pk':datas.pk,
                    'service_category' : 'Radiology',
                    'service_subcategory':f'{datas.Test_Code} - {datas.Test_Name}',
                }
                Services_data_list.append(service_data)
            Room_ins = Room_Master_Detials.objects.all()
            for datas in Room_ins:
                
                ward_ins = WardType_Master_Detials.objects.get(pk=datas.Ward_Name.Room_Id)
                service_data = {
                    
                    'pk':datas.pk,
                    'service_subcategory':f'{datas.Room_No} - {datas.Bed_No} -{ward_ins.Ward_Name}'
                    
                }
                Services_data_list.append(service_data)
            service_ins = Service_Master_Details.objects.all()
            for datas in service_ins:
                service_data = {
                    
                    'pk' : datas.pk,
                    'service_category' : 'general services',
                    'service_subcategory' : datas.Service_Name
                }
                Services_data_list.append(service_data)
                
            return JsonResponse(Services_data_list,safe=False)

         except Exception as e:
            return JsonResponse({"error": str(e)})
         
         
@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def service_map_details(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data", data)

            category = data.get('Categoryid')
            subcategory = data.get('Subcategorypk')
            Type = data.get('Type','')

            category_ins = Service_Category_Masters.objects.get(Serviceid=category)
            service_name = category_ins.ServiceCategory
            print(service_name)
            
            print(subcategory,'subcategory')
            print(Type,'Type')

            content_type = None
            identification_object = None



            if service_name == 'CONSULTATION':
                 print('consultaion')
                 content_type = ContentType.objects.get_for_model(Doctor_Ratecard_Master)
                 identification_object = Doctor_Ratecard_Master.objects.get(pk=subcategory)
              
            elif service_name == 'LAB':
                 
                 
                 print(Type,'typeeeeeeee')
                 if Type == 'individuals':
                     
                     
                    print('labbbbbbbbb')

                    content_type = ContentType.objects.get_for_model(LabTestName_Details)
                    identification_object = LabTestName_Details.objects.get(pk=subcategory)
                
         
                 elif Type == 'Favourites':
                                   
                    content_type = ContentType.objects.get_for_model(TestName_Favourites)
                    identification_object = TestName_Favourites.objects.get(pk=subcategory)

                 elif Type == 'Package':
                                                     
                    content_type = ContentType.objects.get_for_model(Package_TestNames)
                    identification_object = Package_TestNames.objects.get(pk=subcategory)  
            
            elif service_name == 'RADIOLOGY':   
                 content_type = ContentType.objects.get_for_model(TestName_Details)
                 identification_object = TestName_Details.objects.get(pk=subcategory)
            elif service_name == 'ROOMSERVICES':
                 print('ROOMSERVICES')
                 content_type = ContentType.objects.get_for_model(Room_Master_Detials)
                 #identification_object = RoomTypeFee.objects.get(pk=subcategory)
                 identification_object = Room_Master_Detials.objects.get(pk=subcategory)        
            elif service_name == 'PROCEDURES':
                 print('PROCEDURES')
                 content_type = ContentType.objects.get_for_model(Procedure_Master_Details)
                 #identification_object = RoomTypeFee.objects.get(pk=subcategory)
                 identification_object = Procedure_Master_Details.objects.get(pk=subcategory)        
            else :
                print('General Services')
                content_type = ContentType.objects.get_for_model(Service_Master_Details)
                identification_object = Service_Master_Details.objects.get(pk=subcategory)
            try:
             existsdata = Services_Group_Details.objects.filter(content_type=content_type,object_id=subcategory).first()
             
            except Exception as e:
                
                print(e)
            
            print(existsdata,'existsdata')
            if existsdata:
                return JsonResponse({'warn':'Services already Added'})
                
                
        
            try:
                
                print('servicessssssssss')
                Services_Group_Details.objects.create(

                    content_type = content_type,
                    object_id = subcategory,
                    service_category = category_ins,
                    service_sub_category = identification_object,

                )
            except Exception as e:
                print("Error occurred:", e)

            

            return JsonResponse({'success':'Service Subcategory Added successfully'})

        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def service_added_details(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data", data)

            category = data.get('Categoryid')
            subcategory = data.get('Subcategorypk')
            patient_category = data.get('PatientCategory')
            patient_subCat = data.get('PatientSubCat')
            registrationid = data.get('RegistrationId')
            WardId = data.get('WardId')
            category_id = data.get('category_id')
            units = int(data.get('Units', 1))
            content_type = None
            category_ins = Service_Category_Masters.objects.get(Serviceid=category)
            service_name = category_ins.ServiceCategory
            rate = 0.00

            Wardidins = WardType_Master_Detials.objects.filter(Ward_Id=WardId).first()

            print(Wardidins,'Wardidins123444444')

            patient_ins = Patient_IP_Registration_Detials.objects.get(Registration_Id = registrationid)
            print('patient_inssss',patient_ins)

            if service_name == 'CONSULTATION':

                content_type = ContentType.objects.get_for_model(Doctor_Ratecard_Master)

                grouppk = Services_Group_Details.objects.filter(pk=subcategory).first()

                identification_object = Doctor_Ratecard_Master.objects.get(pk=grouppk.object_id)

                room_fees = WardTypee_for_Doctor.objects.get(doctor_ratecard=identification_object,ward_id=WardId)


                if patient_category in ['General','GENERAL']:

                    rate = room_fees.General_fee
                elif patient_category in ['Insurance','INSURANCE']:

                    insurance_fees = InsuranceFee_for_Doctor.objects.get(doctor_ratecard=identification_object, insurance_id=category_id)

                    rate = insurance_fees.Consultation_Fee
                elif patient_category in ['Client','CLIENT']:

                    client_fees = ClientFee_for_Doctor.objects.get(doctor_ratecard=identification_object,client_id=category_id)

                    rate = client_fees.Consultation_Fee

                

            elif service_name == 'LAB':
                print('LAB')
                content_type = ContentType.objects.get_for_model(Testmaster_Cost_List)
                identification_object = Testmaster_Cost_List.objects.get(pk=subcategory)
                rate = identification_object.Basic
                
               
        
            elif service_name == 'RADIOLOGY':
                
                content_type = ContentType.objects.get_for_model(TestName_Details)
                identification_object = TestName_Details.objects.get(pk=subcategory)
                rate = identification_object.Amount
               

            elif service_name == 'ROOMSERVICES':
                print('ROOMSERVICES')
                content_type = ContentType.objects.get_for_model(Room_Master_Detials)
                #identification_object = RoomTypeFee.objects.get(pk=subcategory)
                identification_object = Room_Master_Detials.objects.get(pk=subcategory)
                rate = 0


            elif service_name == 'PROCEDURES':
                print('Procedures')
                content_type = ContentType.objects.get_for_model(Procedure_Master_Details)
                print('conn', content_type)

                try:
                    subcategory = int(data.get('Subcategorypk'))
                    ward_id = int(data.get('WardId'))  # Get Ward ID
                    print(f"Subcategory value: {subcategory} (Type: {type(subcategory)})")

                    # Get procedure details
                    identification_object = Procedure_Master_Details.objects.get(pk=subcategory)
                    print('identification_object:', identification_object)

                    # Get the associated Service_Procedure_Charges entry
                    procedure_charge = Service_Procedure_Charges.objects.get(
                        MasterType='Procedure', Procedure_ratecard=identification_object
                    )
                    print('procedure_charge:', procedure_charge)

                    # Get the room fee based on the ward type
                    room_fees = Service_Procedure_RoomTypeFee.objects.get(
                        Service_Procedure_ratecard=procedure_charge,
                        room_type_id=ward_id
                    )
                    print('room_fees:', room_fees)

                    # Determine rate based on patient category
                    if patient_category.upper() == 'GENERAL':
                        print('Category: General')
                        rate = room_fees.General_fee
                    elif patient_category.upper() == 'INSURANCE':
                        print('Category: Insurance')
                        insurance_fees = Service_Procedure_InsuranceRoomTypeFee.objects.get(
                            Service_Procedure_ratecard=procedure_charge,
                            room_type_fee=room_fees.room_type,
                            insurance_id=category_id
                        )
                        rate = insurance_fees.fee
                    elif patient_category.upper() == 'CLIENT':
                        print('Category: Client')
                        client_fees = Service_Procedure_ClientRoomTypeFee.objects.get(
                            Service_Procedure_ratecard=procedure_charge,
                            room_type_fee=room_fees.room_type,
                            client_id=category_id
                        )
                        rate = client_fees.fee
                    else:
                        rate = room_fees.General_fee  # Default to general fee

                    print('Final rate:', rate)

                except ValueError:
                    return JsonResponse({'error': 'Invalid subcategory or ward ID'})
                except Procedure_Master_Details.DoesNotExist:
                    return JsonResponse({'error': 'Procedure Subcategory not found'})
                except Service_Procedure_Charges.DoesNotExist:
                    return JsonResponse({'error': 'No rate card found for the procedure'})
                except Service_Procedure_RoomTypeFee.DoesNotExist:
                    return JsonResponse({'error': 'No room fee found for the ward type'})
                except Service_Procedure_InsuranceRoomTypeFee.DoesNotExist:
                    return JsonResponse({'error': 'No insurance fee found for this procedure'})
                except Service_Procedure_ClientRoomTypeFee.DoesNotExist:
                    return JsonResponse({'error': 'No client fee found for this procedure'})

            else:
                print('GeneralServices')
                content_type = ContentType.objects.get_for_model(Service_Master_Details)
                print('conn', content_type)

                try:
                    subcategory = int(data.get('Subcategorypk'))
                    ward_id = int(data.get('WardId'))  # Get Ward ID
                    print(f"Subcategory value: {subcategory} (Type: {type(subcategory)})")

                    grouppk = Services_Group_Details.objects.filter(pk=subcategory).first()
                    print(grouppk.object_id)

                    # Get service details
                    identification_object = Service_Master_Details.objects.get(pk=grouppk.object_id)
                    print('identification_object:', identification_object)

                    # Get the associated Service_Procedure_Charges entry
                    service_procedure_charge = Service_Ratecard_Master.objects.get(
                        Service=identification_object
                    )
                    print('service_procedure_charge:', service_procedure_charge)

                    # Get the room fee based on the ward type
                    room_fees = WardtypeFee.objects.get(
                        service_ratecard=service_procedure_charge,
                        ward_id=ward_id
                    )
                    print('room_fees:', room_fees)

                    # Determine rate based on patient category
                    if patient_category.upper() == 'GENERAL':
                        print('Category: General')
                        rate = room_fees.General_fee
                    elif patient_category.upper() == 'INSURANCE':
                        print('Category: Insurance')
                        insurance_fees = Service_Insurance_Fee.objects.get(
                            Service_Ratecard=service_procedure_charge,
                            # room_type_fee=room_fees.room_type,
                            Insurance_id=category_id
                        )
                        rate = insurance_fees.Fee
                    elif patient_category.upper() == 'CLIENT':
                        print('Category: Client')
                        client_fees = Service_Client_Fee.objects.get(
                            Service_Ratecard=service_procedure_charge,
                            # room_type_fee=room_fees.room_type,
                            Client_id=category_id
                        )
                        rate = client_fees.Fee
                    else:
                        rate = room_fees.General_fee  # Default to general fee

                    print('Final rate:', rate)

                except ValueError:
                    return JsonResponse({'error': 'Invalid subcategory or ward ID'})
                except Service_Master_Details.DoesNotExist:
                    return JsonResponse({'error': 'Service Subcategory not found'})
                except Service_Procedure_Charges.DoesNotExist:
                    return JsonResponse({'error': 'No rate card found for the service'})
                except Service_Procedure_RoomTypeFee.DoesNotExist:
                    return JsonResponse({'error': 'No room fee found for the ward type'})
                except Service_Procedure_InsuranceRoomTypeFee.DoesNotExist:
                    return JsonResponse({'error': 'No insurance fee found for this service'})
                except Service_Procedure_ClientRoomTypeFee.DoesNotExist:
                    return JsonResponse({'error': 'No client fee found for this service'})


            total_rate = rate * units

            try:
                Services_SubCat_Requests_Details.objects.create(
                    content_type = content_type,
                    object_id = subcategory,
                    Registration_Id=patient_ins,
                    service_category = category_ins,
                    service_sub_category = identification_object,
                    Wardid = Wardidins,
                    rate =total_rate,
                    units = units,
                )
            except Exception as e:
                print("Error occurred:", e)

            

            return JsonResponse({'success':'Service Subcategory Added successfully'})

        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)})
    elif request.method == 'GET':

        try:
            registrationid = request.GET.get('RegistrationId')
            services_ins = Services_SubCat_Requests_Details.objects.filter(Registration_Id = registrationid)
            print("services_ins12",services_ins)
            services_list = []
            for datas in services_ins:

                serviceid = datas.service_category_id
                category_ins = Service_Category_Masters.objects.get(pk=serviceid)
                # print("category_ins",category_ins)
                

                if category_ins.ServiceCategory == 'CONSULTATION':

                    consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                    
                    Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                    speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else ''
                    doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                    data_list = {
                             'id':datas.pk,
                             'VoucherNo':datas.Voucher_Number,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else ""})',
                             'rate':datas.rate,
                             'Units':datas.units,
                        }
                    services_list.append(data_list)

                elif category_ins.ServiceCategory == 'LAB':

                    labtest_ins = Testmaster_Cost_List.objects.get(pk=datas.object_id)
                    
                    data_list = {
                             'id':datas.pk,
                             'VoucherNo':datas.Voucher_Number,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}' if labtest_ins.Test_Code else labtest_ins.Group_Code.Group_Name,
                             'rate':datas.rate,
                             'Units':datas.units,
                        }
                    services_list.append(data_list)

                elif category_ins.ServiceCategory == 'RADIOLOGY':

                    Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)
                    
                    data_list = {
                             'id':datas.pk,
                             'VoucherNo':datas.Voucher_Number,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                             'rate':datas.rate,
                             'Units':datas.units,
                        }
                    services_list.append(data_list)

                elif category_ins.ServiceCategory == 'ROOMSERVICES':

               
                    Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
                    ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
                    data_list = {
                            'id':datas.pk,
                            'VoucherNo':datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory' : f'{Room_ins.Room_No} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}',         
                            'rate':datas.rate,
                            'Units':datas.units,
                    }
                    services_list.append(data_list)

                elif category_ins.ServiceCategory == 'GENERALSERVICES':
                    print("qw")
                    

                    General_services_ins  = Service_Master_Details.objects.get(pk=datas.object_id)
                    print("General_services_ins23",General_services_ins)
                    
                    data_list = {
                             'id':datas.pk,
                             'VoucherNo':datas.Voucher_Number,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':General_services_ins.Service_Name,
                             'rate':datas.rate,
                             'Units':datas.units,
                        }
                    services_list.append(data_list)
                
                elif category_ins.ServiceCategory == 'PROCEDURES':
                    print("qw")

                    General_services_ins  = Procedure_Master_Details.objects.get(pk=datas.object_id)
                    print("General_services_ins23",General_services_ins)
                    
                    data_list = {
                             'id':datas.pk,
                             'VoucherNo':datas.Voucher_Number,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':General_services_ins.Procedure_Name,
                             'rate':datas.rate,
                             'Units':datas.units,
                        }
                    services_list.append(data_list)
                else:
                    print("alll")
                    General_services_ins  = Service_Master_Details.objects.get(pk=datas.object_id)
                    print("General_services_ins23",General_services_ins)
                    
                    data_list = {
                             'id':datas.pk,
                             'VoucherNo':datas.Voucher_Number,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':General_services_ins.Service_Name,
                             'rate':datas.rate,
                             'Units':datas.units,
                        }
                    services_list.append(data_list)
                
                
            for idx, services in enumerate(services_list, start=1):
                      services["Sno"] = idx 

            return JsonResponse(services_list,safe=False)

        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)})

# @csrf_exempt
# def services_Group_list_details(request):
#     if request.method == "GET":

#         try:
#             services_ins = Services_Group_Details.objects.all()
            
#             services_list = []

#             for datas in services_ins:

#                 data_list = {

#                     "id" : datas.pk,
#                     "object_id" : datas.object_id,
#                     "service_category_id" : datas.service_category_id,
#                     "service_name" : datas.service_category.ServiceCategory
#                 }

#                 services_list.append(data_list)
#             seen_service_categories = set()
#             unique_data = []
#             for entry in services_list:
#                 if entry["service_category_id"] not in seen_service_categories:
#                     seen_service_categories.add(entry["service_category_id"])
#                     unique_data.append(entry)
#             print(unique_data)
#             return JsonResponse(unique_data,safe=False)
#            # return JsonResponse(services_list,safe=False)
#         except Exception as e:
#             return JsonResponse({"error":str(e)})



@csrf_exempt
def services_Group_list_details(request):
    if request.method == "GET":

        try:
            services_ins = Service_Category_Masters.objects.all()
            
            services_list = []

            for datas in services_ins:

                data_list = {

                    "id" : datas.pk,
                    # "object_id" : datas.object_id,
                    "service_category_id" : datas.Serviceid,
                    "service_name" : datas.ServiceCategory
                }

                services_list.append(data_list)
            
            return JsonResponse(services_list,safe=False)
           # return JsonResponse(services_list,safe=False)
        except Exception as e:
            return JsonResponse({"error":str(e)})




# @csrf_exempt
# def services_Subcategory_details_by_category(request):
 
#     if request.method == 'GET':
#         try:
#             ServiceCategory = request.GET.get('ServiceCategory')
           
#             category_ins = Service_Category_Masters.objects.get(Serviceid=ServiceCategory)
#             services_ins = Services_Group_Details.objects.filter(service_category_id=ServiceCategory)
 
#             print(services_ins.count(),'servicescount')
#             print(category_ins.ServiceCategory,'category_ins.ServiceCategory')
#             Services_List = []
 
#             if category_ins.ServiceCategory == 'CONSULTATION':

#                 print('consultationnnnnnnnnnnnn')
 
 
#                 for datas in services_ins:
 
#                     consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)

#                     print(consultaion_ins,'consultaion_insssssssssssss')
                   
#                     Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                     speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else None
#                     doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                     data_list = {
#                              'pk': datas.pk,
#                              'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else None})',
#                         }
#                     Services_List.append(data_list)

#                     print(Services_List,'Services_Listtttttttttttt')
                
#             if category_ins.ServiceCategory == 'LAB':
                   
 
#                 for datas in services_ins:
 
#                     labins = Testmaster_Cost_List.objects.get(pk=datas.object_id)
 
#                     if labins.Test_Code:
 
#                         data_list = {
#                              'pk': datas.pk,
#                              'service_subcategory' : f'{labins.Test_Code.Test_Code} - {labins.Test_Code.Test_Name}',
#                         }
#                         Services_List.append(data_list)
 
#                     elif labins.Group_Code:
 
#                         data_list = {
#                              'pk': datas.pk,
#                              'service_subcategory' : f'{labins.Group_Code.Group_Code} - {labins.Group_Code.Group_Name}',
#                         }
#                         Services_List.append(data_list)
 
#                     elif labins.Package_Code:
 
#                         data_list = {
#                              'pk': datas.pk,
#                              'service_subcategory' : f'{labins.Package_Code.package_code} - {labins.Package_Code.package_name}',
#                         }
#                         Services_List.append(data_list)
 
#             elif category_ins.ServiceCategory == 'RADIOLOGY':
 
#                 for datas in services_ins:
 
#                     Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)
                   
#                     data_list = {
#                              'pk': datas.pk,
#                              'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
#                         }
#                     Services_List.append(data_list)
 
#             elif category_ins.ServiceCategory == 'ROOMSERVICES':
 
#                 for datas in services_ins:

#                     ward_ins = WardType_Master_Detials.objects.get(pk=datas.object_id)        
#                     data_list = {
#                             'pk':datas.pk,
#                             'service_subcategory' : f'{ward_ins.Ward_Name}'        
#                     }
#                     Services_List.append(data_list)
 
#             # elif category_ins.ServiceCategory == 'GENERALSERVICES':
 
#             #     for datas in services_ins:
 
#             #         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
                   
#             #         data_list = {
#             #                  'pk': datas.pk,
#             #                  'pk1':datas.pk,
#             #                  'service_subcategory':General_services_ins.Service_Name
#             #             }
#             #         Services_List.append(data_list)
           
#             elif category_ins.ServiceCategory == 'PROCEDURES':
 
#                 for datas in services_ins:
 
#                     General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
                   
#                     data_list = {
#                              'pk': datas.pk,
#                              'pk1':datas.pk,
#                              'service_subcategory':General_services_ins.Procedure_Name
#                         }
#                     Services_List.append(data_list)
#             else:

#                 print('mastereeeeeeeeeeeee')
                
#                 for datas in services_ins:
 
#                     General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
                   
#                     data_list = {
#                              'pk': datas.pk,
#                              'pk1':datas.pk,
#                              'service_subcategory':General_services_ins.Service_Name
#                         }
#                     Services_List.append(data_list)
           
 
#             return JsonResponse(Services_List, safe=False)
 
#         except Exception as e:
#                 return JsonResponse({"error":str(e)})
import logging

logger = logging.getLogger(__name__)
      
@csrf_exempt
@require_http_methods(['GET'])
def services_Subcategory_details_by_category(request):
    try:
        # Get ServiceCategory from query parameters
        service_category_id = request.GET.get('ServiceCategory')
        if not service_category_id:
            return JsonResponse({'error': 'ServiceCategory parameter is required'}, status=400)
 
        # Fetch Service_Category_Masters instance
        try:
            category_ins = Service_Category_Masters.objects.get(Serviceid=service_category_id)
        except Service_Category_Masters.DoesNotExist:
            logger.error(f"Service_Category_Masters with Serviceid={service_category_id} does not exist")
            return JsonResponse({'error': f'ServiceCategory with Serviceid={service_category_id} does not exist'}, status=404)
 
        # Fetch Services_Group_Details with related service_category and service_sub_category
        services_ins = Services_Group_Details.objects.select_related('service_category').filter(service_category=category_ins)
 
        services_list = []
        content_type_service = ContentType.objects.get_for_model(Service_Master_Details)
        content_type_procedure = ContentType.objects.get_for_model(Procedure_Master_Details)
        content_type_doctor = ContentType.objects.get_for_model(Doctor_Ratecard_Master)
        content_type_test = ContentType.objects.get_for_model(Testmaster_Cost_List)
        content_type_radiology = ContentType.objects.get_for_model(TestName_Details)
        content_type_room = ContentType.objects.get_for_model(WardType_Master_Detials)
        content_type_package = ContentType.objects.get_for_model(Package_Master)

        print(category_ins.ServiceCategory,'categorynameeeeeeeeee')
 
        for datas in services_ins:
            data_list = {'pk': datas.pk, 'category': category_ins.ServiceCategory}

            print(datas.pk,'pkkkkkkkkkk')
            print(datas.content_type,'contentttttttt')
 
            try:
                if category_ins.ServiceCategory == 'CONSULTATION' and datas.content_type == content_type_doctor:
                    print('objectttt',datas.object_id)
                    consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                    print('consultttttt',consultaion_ins)
                    doctor_speciality = Doctor_ProfessForm_Detials.objects.select_related('Specialization').get(Doctor_ID=consultaion_ins.Doctor_ID) 
                    print('doccccproffffff',doctor_speciality)
                    doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                    print('doccccccperrrrrrr',doctor)
                    data_list['service_subcategory'] = (
                        f'{doctor.Tittle.Title_Name}.{doctor.First_Name}{doctor.Middle_Name} {doctor_speciality.Qualification} ({doctor_speciality.Specialization.Speciality_Name if doctor_speciality.Specialization else None})'
                    )
 
                elif category_ins.ServiceCategory == 'LAB' and datas.content_type == content_type_test:
                    lab_ins = Testmaster_Cost_List.objects.select_related('Test_Code', 'Group_Code', 'Package_Code').get(pk=datas.object_id)
                    if lab_ins.Test_Code:
                        data_list['service_subcategory'] = f'{lab_ins.Test_Code.Test_Name}'
                    elif lab_ins.Group_Code:
                        data_list['service_subcategory'] = f'{lab_ins.Group_Code.Group_Name}'
                    elif lab_ins.Package_Code:
                        data_list['service_subcategory'] = f'{lab_ins.Package_Code.package_name}'
                    else:
                        logger.warning(f"No Test_Code, Group_Code, or Package_Code for Testmaster_Cost_List pk={datas.object_id}")
                        continue
 
                elif category_ins.ServiceCategory == 'RADIOLOGY' and datas.content_type == content_type_radiology:
                    radiology_ins = TestName_Details.objects.get(pk=datas.object_id)
                    data_list['service_subcategory'] = f'{radiology_ins.Radiology_Id.Radiology_Name}-{radiology_ins.Test_Name}' 
                elif category_ins.ServiceCategory == 'ROOMSERVICES' and datas.content_type == content_type_room:
                    room_ins = WardType_Master_Detials.objects.get(pk=datas.object_id)
                    data_list['service_subcategory'] = f'{room_ins.Ward_Name}'

                elif category_ins.ServiceCategory == 'PROCEDURES' and datas.content_type == content_type_procedure:
                    procedure_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
                    data_list['service_subcategory'] = procedure_ins.Procedure_Name

                elif category_ins.ServiceCategory == 'PACKAGE' and datas.content_type == content_type_package:
                    package_ins = Package_Master.objects.get(pk=datas.object_id)
                    data_list['service_subcategory'] = package_ins.Package_Name
 
                elif datas.content_type == content_type_service:
                    try:
                        general_services_ins = Service_Master_Details.objects.get(
                            pk=datas.object_id,
                            ServiceCategory__Serviceid=category_ins.Serviceid
                        )
                        data_list.update({
                            'ServiceCategory': general_services_ins.ServiceCategory.Serviceid,
                            'Department': general_services_ins.Department,
                            'ServiceCode': general_services_ins.Service_Id,
                            'ServiceName': general_services_ins.Service_Name,
                            'ServiceType': general_services_ins.Service_Type,
                            'Amount': general_services_ins.Amount,
                            'IsGst': general_services_ins.IsGst,
                            'service_subcategory': general_services_ins.Service_Name,
                        })
                    except Service_Master_Details.DoesNotExist:
                        logger.warning(f"No Service_Master_Details found for pk={datas.object_id}, ServiceCategory={category_ins.Serviceid}")
                        continue
 
                else:
                    logger.warning(f"Invalid category or content type for pk={datas.pk}, category={category_ins.ServiceCategory}")
                    continue
 
                services_list.append(data_list)
 
            except (Doctor_Ratecard_Master.DoesNotExist, Doctor_ProfessForm_Detials.DoesNotExist,
                    Doctor_Personal_Form_Detials.DoesNotExist, Testmaster_Cost_List.DoesNotExist,
                    TestName_Details.DoesNotExist, Room_Master_Detials.DoesNotExist,
                    WardType_Master_Detials.DoesNotExist, Procedure_Master_Details.DoesNotExist) as e:
                logger.error(f"Record not found for pk={datas.pk}, category={category_ins.ServiceCategory}: {str(e)}")
                continue
 
        return JsonResponse(services_list, safe=False)
 
    except Service_Category_Masters.DoesNotExist:
        logger.error(f"Service_Category_Masters with Serviceid={service_category_id} does not exist")
        return JsonResponse({'error': f'ServiceCategory with Serviceid={service_category_id} does not exist'}, status=404)
    except Exception as e:
        logger.error(f"Error in services_Subcategory_details_by_category: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
 
 
 


@csrf_exempt
def services_Subcategory_details_by_category2(request):

        if request.method == 'GET':
            try:
                ServiceCategory = request.GET.get('ServiceCategory')
            
                category_ins = Service_Category_Masters.objects.get(Serviceid=ServiceCategory)
                services_ins = Services_Group_Details.objects.filter(service_category_id=ServiceCategory)
    
                print(services_ins,'services_insservices_ins')
                Services_List = []
    
                if category_ins.ServiceCategory == 'CONSULTATION':
    
    
                    for datas in services_ins:
    
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                    
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        data_list = {
                                'pk': datas.pk,
                                'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            }
                        Services_List.append(data_list)
                    
                if category_ins.ServiceCategory == 'LAB':
                    
    
                    for datas in services_ins:
    
                        labins = Testmaster_Cost_List.objects.get(pk=datas.object_id)
    
                        if labins.Test_Code:
    
                            data_list = {
                                'pk': datas.pk,
                                'service_subcategory' : f'{labins.Test_Code.Test_Code} - {labins.Test_Code.Test_Name}',
                            }
                            Services_List.append(data_list)
    
                        elif labins.Group_Code:
    
                            data_list = {
                                'pk': datas.pk,
                                'service_subcategory' : f'{labins.Group_Code.Group_Code} - {labins.Group_Code.Group_Name}',
                            }
                            Services_List.append(data_list)
    
                        elif labins.Package_Code:
    
                            data_list = {
                                'pk': datas.pk,
                                'service_subcategory' : f'{labins.Package_Code.package_code} - {labins.Package_Code.package_name}',
                            }
                            Services_List.append(data_list)
    
                elif category_ins.ServiceCategory == 'RADIOLOGY':
    
                    for datas in services_ins:
    
                        Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)
                    
                        data_list = {
                                'pk': datas.pk,
                                'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                            }
                        Services_List.append(data_list)
    
                elif category_ins.ServiceCategory == 'ROOMSERVICES':
    
                    for datas in services_ins:
    
                    #     Room_ins = RoomTypeFee.objects.get(pk=datas.object_id)
                    #    # for roomdata in Room_ins:
                        
                    #     room_no_ins = Room_Master_Detials.objects.filter(Ward_Name_id=Room_ins.room_type_id)
                    #     for rni in room_no_ins:
                    #             print(rni.Room_No)
                    #             print(rni.Bed_No)    
    
                        Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
                        ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
                        data_list = {
                                'pk':datas.object_id,
                                'pk1':datas.object_id,
                                'Roomid':Room_ins.Room_Id,
                                'service_subcategory' : f'{Room_ins.Room_No} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}'        
                        }
                        Services_List.append(data_list)
    
                elif category_ins.ServiceCategory == 'GENERALSERVICES':
    
                    for datas in services_ins:
    
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
                    
                        data_list = {
                               'pk': datas.pk,
                                'pk1':datas.pk,
                                'service_subcategory':General_services_ins.Service_Name
                            }
                        Services_List.append(data_list)
            
                elif category_ins.ServiceCategory == 'PROCEDURES':
    
                    for datas in services_ins:
    
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
                    
                        data_list = {
                                'pk': datas.pk,
                                'pk1':datas.pk,
                                'service_subcategory':General_services_ins.Procedure_Name
                            }
                        Services_List.append(data_list)
    
                return JsonResponse(Services_List, safe=False)
    
            except Exception as e:
                    return JsonResponse({"error":str(e)})








# @csrf_exempt
# def services_Subcategory_details_by_Patient_category(request):
 
#     if request.method == 'GET':
#         try:
#             ServiceCategory = request.GET.get('ServiceCategory')
#             ServicesubCategory = request.GET.get('ServicesubCategory')
#             Patientcategory = request.GET.get('Patientcategory') # general insurance
#             RegisterId = request.GET.get('RegisterId') # op ip
           
#             VisitType = request.GET.get('VisitType')
#             op_patient = None
#             ip_patient = None
#             print('111111',ServiceCategory,ServicesubCategory,Patientcategory,RegisterId)
           
#            # op_patient = Patient_Appointment_Registration_Detials.objects.get(PatientId_id = patientid)
#             try:
#                 op_patient = Patient_Appointment_Registration_Detials.objects.get(Registration_Id= RegisterId)
                   
#             except Patient_Appointment_Registration_Detials.DoesNotExist:
#                 print("OP Patient not found")
           
#             try:
#                 ip_patient = Patient_IP_Registration_Detials.objects.get(Registration_Id = RegisterId)
#                 print('121222',ip_patient)
#             except Patient_IP_Registration_Detials.DoesNotExist:
#                 print("IP patient not found")
           
#             category_ins = Service_Category_Masters.objects.get(Serviceid=ServiceCategory)
#             print('categoryyyyy',category_ins)
           
#             services_ins = Services_Group_Details.objects.filter(pk=ServicesubCategory)
#             print('serviceeeee',services_ins)
#             Services_List = []
 
#             if category_ins.ServiceCategory == 'CONSULTATION':

#                 print('consullllll')
#                 if Patientcategory == 'General' and VisitType == 'OP':
 
#                     for datas in services_ins:
#                         print('dataasss',datas.object_id)
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                                 'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                                 'amt' : consultaion_ins.General_Consultation_Fee
#                             }
#                         Services_List.append(data_list)
               
#                 elif Patientcategory == 'General' and VisitType == 'IP':

#                     print('ippayutuefwf')
 
#                     for datas in services_ins:
 
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
 
#                         print(consultaion_ins,'consultaion_ins')
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                         data_list = {
#                             'pk': datas.pk,
#                             'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                             'amt' : consultaion_ins.General_Consultation_Fee
#                         }
#                         Services_List.append(data_list)
                   
#                 elif Patientcategory == 'Insurance' and VisitType == 'OP' :
#                     print('2345678')
 
#                     for datas in services_ins:
 
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)      
#                         insurance_ins = Insurance_Master_Detials.objects.get(pk=op_patient.InsuranceName.Insurance_Id)
#                         insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,insurance_id=insurance_ins.pk)
 
#                         data_list = {
#                             'pk': datas.pk,
#                             'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                             'insurancename': insurance_ins.Insurance_Name,
#                             'amt' : insurance_fee_ins.Consultation_Fee
#                         }
#                         Services_List.append(data_list)
 
#                 elif Patientcategory == 'Insurance' and VisitType == 'IP' :
                       
#                         for datas in services_ins:
 
#                             consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                             Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                             speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                             doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                             insurance_ins = Insurance_Master_Detials.objects.get(pk=ip_patient.InsuranceName_id)
#                             insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,insurance_id=insurance_ins.pk)
 
#                             data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                                 'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                                 'insurancename': insurance_ins.Insurance_Name,
#                                 'amt' : insurance_fee_ins.Consultation_Fee
#                             }
#                             Services_List.append(data_list)
 
#                 elif Patientcategory == 'Client' and VisitType == 'OP':
 
#                     for datas in services_ins:
 
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
 
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                         Client_ins = Client_Master_Detials.objects.get(pk=op_patient.ClientName_id)
#                         client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,client_id=Client_ins.pk)
 
#                         data_list = {
#                             'pk': datas.pk,
#                             'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                             'clientname': Client_ins.Client_Name,
#                             'amt' : client_fee_ins.Consultation_Fee,
#                         }
#                         Services_List.append(data_list)
 
#                 elif Patientcategory == 'Client' and VisitType == 'IP':
                       
#                         for datas in services_ins:
 
#                             consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                             Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                             speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                             doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                             Client_ins = Client_Master_Detials.objects.get(pk=ip_patient.ClientName_id)
#                             client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,client_id=Client_ins.pk)
 
#                             data_list = {
#                             'pk': datas.pk,
#                             'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                             'clientname': Client_ins.Client_Name,
#                             'amt' : client_fee_ins.Consultation_Fee,
#                             }
#                             Services_List.append(data_list)
 
#                 elif Patientcategory == 'Corporate' and VisitType == 'OP':
 
#                     for datas in services_ins:
 
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                         corporate_ins = Corporate_Master_Detials.objects.get(pk=op_patient.CorporateName_id)
#                         corporate_fee_ins = CorporateFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,corporate_id=corporate_ins.Corporate_Id)
 
#                         data_list = {
#                             'pk': datas.pk,
#                             'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                             'corporatename': corporate_ins.Corporate_Name,
#                             'amt' : corporate_fee_ins.Consultation_Fee,
#                         }
#                         Services_List.append(data_list)
 
#                 elif Patientcategory == 'Corporate' and VisitType == 'IP':
 
#                     for datas in services_ins:
 
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
#                         corporate_ins = Corporate_Master_Detials.objects.get(pk=ip_patient.CorporateName_id)
#                         corporate_fee_ins = CorporateFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,corporate_id=corporate_ins.Corporate_Id)
 
#                         data_list = {
#                             'pk': datas.pk,
#                             'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
#                             'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
#                             'corporatename': corporate_ins.Corporate_Name,
#                             'amt' : corporate_fee_ins.Consultation_Fee,
#                         }
#                         Services_List.append(data_list)
                
#             elif category_ins.ServiceCategory == 'LAB':
 
#                 for datas in services_ins:
                 
#                     labtest_ins = Testmaster_Cost_List.objects.get(Test_Id=datas.object_id)

#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='LAB',
#                         Patient_Type=Patientcategory
#                     ).first()

#                     print(Discount ,' Lab Discount ')

#                     LabDiscount = None

 
#                     if labtest_ins.Test_Code:

#                         if Discount:
#                             LabDiscount = DiscountFeeLab.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 Lab_Test_Id__Test_Id=labtest_ins.Test_Id
#                             ).first()
#                             print(LabDiscount, 'RadDiscount', labtest_ins.Test_Id)

#                             rate = labtest_ins.Basic if labtest_ins else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = LabDiscount.discount_method if LabDiscount else None
#                             discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"
                        
#                             data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': labtest_ins.Test_Code.Test_Code,
#                                 'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
#                                 'amt' : labtest_ins.Basic,
#                                 'type': 'individual',
#                                 'final_rate' : final_rate,
#                                 'DiscountType': discount_value_display,
#                                 'Discount': discount_value if discount_value else '-',
#                                 'Discountamt' : discount_amount_display,
#                                 'Discountmethod' : Discountmethod,
#                                 'Discountval' : discount_value,
#                                 }
#                             Services_List.append(data_list)
 
#                         else:

#                             data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': labtest_ins.Test_Code.Test_Code,
#                                     'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
#                                     'amt' : labtest_ins.Basic,
#                                     'type': 'individual',
#                             }
#                             Services_List.append(data_list)
 
#                     elif labtest_ins.Group_Code:

#                         if Discount:
#                             LabDiscount = DiscountFeeLab.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 Lab_Test_Id__Test_Id=labtest_ins.Test_Id
#                             ).first()
#                             print(LabDiscount, 'RadDiscount')

#                             rate = labtest_ins.Basic if labtest_ins else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = LabDiscount.discount_method if LabDiscount else None
#                             discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"
                        
#                             data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': labtest_ins.Test_Code.Test_Code,
#                                 'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
#                                 'amt' : labtest_ins.Basic,
#                                 'type': 'individual',
#                                 'final_rate' : final_rate,
#                                 'DiscountType': discount_value_display,
#                                 'Discount': discount_value if discount_value else '-',
#                                 'Discountamt' : discount_amount_display,
#                                 'Discountmethod' : Discountmethod,
#                                 'Discountval' : discount_value,
#                                 }
#                             Services_List.append(data_list)
 
#                         else:
#                             data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': labtest_ins.Group_Code.Group_Code,
#                                     'service_subcategory': f'{labtest_ins.Group_Code.Group_Code} - {labtest_ins.Group_Code.Group_Name}',
#                                     'amt' : labtest_ins.Basic,
#                                     'type' : 'group'
#                             }
#                             Services_List.append(data_list)
 
#                     elif labtest_ins.Package_Code:

#                         if Discount:
#                             LabDiscount = DiscountFeeLab.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 Lab_Test_Id__Test_Id=labtest_ins.Test_Id
#                             ).first()
#                             print(LabDiscount, 'RadDiscount')

#                             rate = labtest_ins.Basic if labtest_ins else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = LabDiscount.discount_method if LabDiscount else None
#                             discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"
                        
#                             data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': labtest_ins.Test_Code.Test_Code,
#                                 'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
#                                 'amt' : labtest_ins.Basic,
#                                 'type': 'individual',
#                                 'final_rate' : final_rate,
#                                 'DiscountType': discount_value_display,
#                                 'Discount': discount_value if discount_value else '-',
#                                 'Discountamt' : discount_amount_display,
#                                 'Discountmethod' : Discountmethod,
#                                 'Discountval' : discount_value,
#                                 }
#                             Services_List.append(data_list)
 
#                         else:
#                             data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': labtest_ins.Package_Code.package_code,
#                                     'service_subcategory': f'{labtest_ins.Package_Code.package_code} - {labtest_ins.Package_Code.package_name}',
#                                     'amt' : labtest_ins.Basic,
#                                     'type': 'offers'
#                             }
#                             Services_List.append(data_list)
 
#             elif category_ins.ServiceCategory == 'RADIOLOGY':
 
#                 for datas in services_ins:
 
#                     print(datas.object_id,'datas.object_id')
 
#                     Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)

                    
#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='RADIOLOGY',
#                         Patient_Type=Patientcategory
#                     ).first()

#                     RadDiscount = None
#                     print(Discount, 'Discount')

#                     if Discount:
#                         RadDiscount = Discount_Radiology_Fee.objects.filter(
#                             discount__Discount_ID=Discount.Discount_ID,
#                             Radiology_Test_Id__Room_Id__Test_Code=Radiology_ins.Test_Code
#                         ).first()
#                         print(RadDiscount, 'RadDiscount')

#                         rate = Radiology_ins.Amount if Radiology_ins else 0
#                         final_rate = rate  
#                         discount_amount = 0  

#                         discount_type = RadDiscount.discount_method if RadDiscount else None
#                         discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

#                         discount_amount = 0
#                         final_rate = rate

#                         if discount_type and discount_value:
#                             if discount_type.lower() == "percentage":
#                                 discount_amount = (rate * discount_value) / 100
#                                 final_rate = rate - discount_amount
#                                 discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                 Discountmethod = 'PERCENTAGE'
#                             elif discount_type.lower() == "flat":
#                                 discount_amount = discount_value
#                                 final_rate = rate - discount_amount
#                                 discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                 Discountmethod = 'FLATAMOUNT'


#                             # format discount amount nicely
#                             discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                         else:
#                             discount_value_display = "-"
#                             discount_amount_display = "-"
                    
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': Radiology_ins.Test_Code,
#                                 'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
#                                 'amt':Radiology_ins.Amount,
#                                 'final_rate' : final_rate,
#                                 'DiscountType': discount_value_display,
#                                 'Discount': discount_value if discount_value else '-',
#                                 'Discountamt' : discount_amount_display,
#                                 'Discountmethod' : Discountmethod,
#                                 'Discountval' : discount_value,
#                         }
#                         Services_List.append(data_list)
 

#                     else:
#                         data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': Radiology_ins.Test_Code,
#                                     'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
#                                     'amt':Radiology_ins.Amount,
#                                     # 'final_rate' : final_rate,
#                                     # 'DiscountType': discount_value_display,
#                                     # 'Discount': discount_value if discount_value else '-',
#                                     # 'Discountamt' : discount_amount_display,
#                                     # 'Discountmethod' : Discountmethod,
#                                     # 'Discountval' : discount_value,
#                             }
#                         Services_List.append(data_list)
    
#             elif category_ins.ServiceCategory == 'GENERALSERVICES':
 
#                 for datas in services_ins:
 
#                     if VisitType == 'OP':
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)                        
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': General_services_ins.Service_Id,
#                                 'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
#                                 'amt':General_services_ins.Amount,
#                         }
#                         Services_List.append(data_list)
#                     elif VisitType == 'IP':
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)                        
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': General_services_ins.Service_Id,
#                                 'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
#                                 'amt':General_services_ins.Amount,
#                         }
#                         Services_List.append(data_list)
           
#             elif category_ins.ServiceCategory == 'PACKAGE':
#                 print('PACKAGE inside')
 
#                 for datas in services_ins:
 
#                     if VisitType == 'OP':
#                         General_services_ins = Package_Master.objects.get(pk=datas.object_id)                        
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': General_services_ins.pk,
#                                 'service_subcategory':f'{General_services_ins.pk} - {General_services_ins.Package_Name}',
#                                 'amt':General_services_ins.Price,
#                         }
#                         Services_List.append(data_list)
#                     elif VisitType == 'IP':
#                         General_services_ins = Package_Master.objects.get(pk=datas.object_id)                        
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': General_services_ins.pk,
#                                 'service_subcategory':f'{General_services_ins.pk} - {General_services_ins.Package_Name}',
#                                 'amt':General_services_ins.Price,
#                         }
#                         Services_List.append(data_list)
            
#             elif category_ins.ServiceCategory == 'PROCEDURES':
#                 print('Proceduressss')
 
#                 for datas in services_ins:
 
#                     if VisitType == 'OP':
#                         General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)                        
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': General_services_ins.Procedure_Id,
#                                 'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
#                                 'amt':General_services_ins.Amount,
#                         }
#                         Services_List.append(data_list)
#                     elif VisitType == 'IP':
#                         General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)                        
#                         data_list = {
#                                 'pk': datas.pk,
#                                 'ServiceId': General_services_ins.Procedure_Id,
#                                 'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
#                                 'amt':General_services_ins.Amount,
#                         }
#                         Services_List.append(data_list)
            
#             else:
#                 for datas in services_ins:
 
#                     if VisitType == 'OP':
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    

#                         print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')

#                         print(op_patient.PatientCategory,'pat catgoryyyyyyyyyy')

#                         Discount = DiscountMaster.objects.filter(
#                             Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
#                             Patient_Type=op_patient.PatientCategory
#                         ).first()

#                         print(Discount,'Discount minor procedure')

#                         MPDiscount = None

#                         if Discount:
#                             MPDiscount = Discount_service_Fee.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 service_Id__Service__Service_Id=General_services_ins.Service_Id
#                             ).first()

#                             rate = General_services_ins.Amount if General_services_ins else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = MPDiscount.discount_method if MPDiscount else None
#                             discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"


#                             data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': General_services_ins.Service_Id,
#                                     'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
#                                     'amt':General_services_ins.Amount,
#                                     'final_rate' : final_rate,
#                                     'DiscountType': discount_value_display,
#                                     'Discount': discount_value if discount_value else '-',
#                                     'Discountamt' : discount_amount_display,
#                                     'Discountmethod' : Discountmethod,
#                                     'Discountval' : discount_value,
#                             }
#                             Services_List.append(data_list)

#                         data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': General_services_ins.Service_Id,
#                                     'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
#                                     'amt':General_services_ins.Amount,
#                                     # 'final_rate' : final_rate,
#                                     # 'DiscountType': discount_value_display,
#                                     # 'Discount': discount_value if discount_value else '-',
#                                     # 'Discountamt' : discount_amount_display,
#                                     # 'Discountmethod' : Discountmethod,
#                                     # 'Discountval' : discount_value,
#                             }
#                         Services_List.append(data_list)
#                     elif VisitType == 'IP':
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    

#                         print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')

#                         Discount = DiscountMaster.objects.filter(
#                             Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
#                             Patient_Type=ip_patient.PatientCategory
#                         ).first()

#                         print(Discount,'Discount minor procedure')

#                         MPDiscount = None

#                         if Discount:
#                             MPDiscount = Discount_service_Fee.objects.filter(
#                                 discount__Discount_ID=Discount.Discount_ID,
#                                 service_Id__Service__Service_Id=General_services_ins.Service_Id
#                             ).first()

#                             rate = General_services_ins.Amount if General_services_ins else 0
#                             final_rate = rate  
#                             discount_amount = 0  

#                             discount_type = MPDiscount.discount_method if MPDiscount else None
#                             discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0

#                             discount_amount = 0
#                             final_rate = rate

#                             if discount_type and discount_value:
#                                 if discount_type.lower() == "percentage":
#                                     discount_amount = (rate * discount_value) / 100
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                                     Discountmethod = 'PERCENTAGE'
#                                 elif discount_type.lower() == "flat":
#                                     discount_amount = discount_value
#                                     final_rate = rate - discount_amount
#                                     discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                                     Discountmethod = 'FLATAMOUNT'


#                                 # format discount amount nicely
#                                 discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                             else:
#                                 discount_value_display = "-"
#                                 discount_amount_display = "-"

                    
#                             data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': General_services_ins.Service_Id,
#                                     'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
#                                     'amt':General_services_ins.Amount,
#                                     'final_rate' : final_rate,
#                                     'DiscountType': discount_value_display,
#                                     'Discount': discount_value if discount_value else '-',
#                                     'Discountamt' : discount_amount_display,
#                                     'Discountmethod' : Discountmethod,
#                                     'Discountval' : discount_value,

#                             }
#                             Services_List.append(data_list)
 
#                         data_list = {
#                                     'pk': datas.pk,
#                                     'ServiceId': General_services_ins.Service_Id,
#                                     'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
#                                     'amt':General_services_ins.Amount,
#                                     # 'final_rate' : final_rate,
#                                     # 'DiscountType': discount_value_display,
#                                     # 'Discount': discount_value if discount_value else '-',
#                                     # 'Discountamt' : discount_amount_display,
#                                     # 'Discountmethod' : Discountmethod,
#                                     # 'Discountval' : discount_value,

#                             }
#                         Services_List.append(data_list)

#             return JsonResponse(Services_List, safe=False)
 
#         except Exception as e:
#                 return JsonResponse({"error":str(e)})
 


@csrf_exempt
def services_Subcategory_details_by_Patient_category(request):
 
    if request.method == 'GET':
        try:
            ServiceCategory = request.GET.get('ServiceCategory')
            ServicesubCategory = request.GET.get('ServicesubCategory')
            Patientcategory = request.GET.get('Patientcategory') # general insurance
            RegisterId = request.GET.get('RegisterId') # op ip
           
            VisitType = request.GET.get('VisitType')
            Type = request.GET.get('Type')
            op_patient = None
            ip_patient = None
            print('111111',ServiceCategory,ServicesubCategory,Patientcategory,RegisterId)
           
           # op_patient = Patient_Appointment_Registration_Detials.objects.get(PatientId_id = patientid)
            try:
                op_patient = Patient_Appointment_Registration_Detials.objects.get(Registration_Id= RegisterId)
                   
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                print("OP Patient not found")
           
            try:
                ip_patient = Patient_IP_Registration_Detials.objects.get(Registration_Id = RegisterId)
                print('121222',ip_patient)
            except Patient_IP_Registration_Detials.DoesNotExist:
                print("IP patient not found")
           
            category_ins = Service_Category_Masters.objects.get(Serviceid=ServiceCategory)
            print('categoryyyyy',category_ins)
           
            services_ins = Services_Group_Details.objects.filter(pk=ServicesubCategory)
            print('serviceeeee',services_ins)
            Services_List = []
 
            if category_ins.ServiceCategory == 'CONSULTATION':

                print('consullllll')
                if Patientcategory == 'General' and VisitType == 'OP':
 
                    for datas in services_ins:
                        print('dataasss',datas.object_id)
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                                'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                                'amt' : consultaion_ins.General_Consultation_Fee
                            }
                        Services_List.append(data_list)
               
                elif Patientcategory == 'General' and VisitType == 'IP':

                    print('ippayutuefwf')
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
 
                        print(consultaion_ins,'consultaion_ins')
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : consultaion_ins.General_Consultation_Fee
                        }
                        Services_List.append(data_list)
                   
                elif Patientcategory == 'Insurance' and VisitType == 'OP' :
                    print('2345678')
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)      
                        insurance_ins = Insurance_Master_Detials.objects.get(pk=op_patient.InsuranceName.Insurance_Id)
                        insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,insurance_id=insurance_ins.pk)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'insurancename': insurance_ins.Insurance_Name,
                            'amt' : insurance_fee_ins.Consultation_Fee
                        }
                        Services_List.append(data_list)
 
                elif Patientcategory == 'Insurance' and VisitType == 'IP' :
                       
                        for datas in services_ins:
 
                            consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                            Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                            speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                            insurance_ins = Insurance_Master_Detials.objects.get(pk=ip_patient.InsuranceName_id)
                            insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,insurance_id=insurance_ins.pk)
 
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                                'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                                'insurancename': insurance_ins.Insurance_Name,
                                'amt' : insurance_fee_ins.Consultation_Fee
                            }
                            Services_List.append(data_list)
 
                elif Patientcategory == 'Client' and VisitType == 'OP':
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
 
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        Client_ins = Client_Master_Detials.objects.get(pk=op_patient.ClientName_id)
                        client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,client_id=Client_ins.pk)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : client_fee_ins.Consultation_Fee,
                        }
                        Services_List.append(data_list)
 
                elif Patientcategory == 'Client' and VisitType == 'IP':
                       
                        for datas in services_ins:
 
                            consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                            Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                            speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                            Client_ins = Client_Master_Detials.objects.get(pk=ip_patient.ClientName_id)
                            client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,client_id=Client_ins.pk)
 
                            data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : client_fee_ins.Consultation_Fee,
                            }
                            Services_List.append(data_list)
 
                elif Patientcategory == 'Corporate' and VisitType == 'OP':
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        corporate_ins = Corporate_Master_Detials.objects.get(pk=op_patient.CorporateName_id)
                        corporate_fee_ins = CorporateFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,corporate_id=corporate_ins.Corporate_Id)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'corporatename': corporate_ins.Corporate_Name,
                            'amt' : corporate_fee_ins.Consultation_Fee,
                        }
                        Services_List.append(data_list)
 
                elif Patientcategory == 'Corporate' and VisitType == 'IP':
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        corporate_ins = Corporate_Master_Detials.objects.get(pk=ip_patient.CorporateName_id)
                        corporate_fee_ins = CorporateFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,corporate_id=corporate_ins.Corporate_Id)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'corporatename': corporate_ins.Corporate_Name,
                            'amt' : corporate_fee_ins.Consultation_Fee,
                        }
                        Services_List.append(data_list)
                
            elif category_ins.ServiceCategory == 'LAB':
 
                for datas in services_ins:
                 
                    labtest_ins = Testmaster_Cost_List.objects.get(Test_Id=datas.object_id)

                    print(labtest_ins,'labtest_ins insideeeeeeee')

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=Patientcategory
                    ).first()

                    print(Discount ,' Lab Discount ')

                    LabDiscount = None

 
                    if labtest_ins.Test_Code:

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=labtest_ins.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount', labtest_ins.Test_Id)

                            rate = labtest_ins.Basic if labtest_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate
                            Discountmethod = ''

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"
                        
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': labtest_ins.Test_Code.Test_Code,
                                'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
                                'amt' : labtest_ins.Basic,
                                'type': 'individual',
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
 
                        else:

                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': labtest_ins.Test_Code.Test_Code,
                                    'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
                                    'amt' : labtest_ins.Basic,
                                    'type': 'individual',
                            }
                            Services_List.append(data_list)
 
                    elif labtest_ins.Group_Code:

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=labtest_ins.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount')

                            rate = labtest_ins.Basic if labtest_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate
                            Discountmethod = ''


                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"
                        
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': labtest_ins.Group_Code.Group_Code,
                                'service_subcategory': f'{labtest_ins.Group_Code.Group_Code} - {labtest_ins.Group_Code.Group_Name}',
                                'amt' : labtest_ins.Basic,
                                'type': 'group',
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
 
                        else:
                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': labtest_ins.Group_Code.Group_Code,
                                    'service_subcategory': f'{labtest_ins.Group_Code.Group_Code} - {labtest_ins.Group_Code.Group_Name}',
                                    'amt' : labtest_ins.Basic,
                                    'type' : 'group'
                            }
                            Services_List.append(data_list)
 
                    elif labtest_ins.Package_Code:

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=labtest_ins.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount')

                            rate = labtest_ins.Basic if labtest_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate
                            Discountmethod = ''


                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"
                        
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': labtest_ins.Package_Code.package_code,
                                'service_subcategory': f'{labtest_ins.Package_Code.package_code} - {labtest_ins.Package_Code.package_name}',
                                'amt' : labtest_ins.Basic,
                                'type': 'offers',
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
 
                        else:
                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': labtest_ins.Package_Code.package_code,
                                    'service_subcategory': f'{labtest_ins.Package_Code.package_code} - {labtest_ins.Package_Code.package_name}',
                                    'amt' : labtest_ins.Basic,
                                    'type': 'offers'
                            }
                            Services_List.append(data_list)
 
            elif category_ins.ServiceCategory == 'RADIOLOGY':
 
                for datas in services_ins:
 
                    print(datas.object_id,'datas.object_id')
 
                    Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)

                    
                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='RADIOLOGY',
                        Patient_Type=Patientcategory
                    ).first()

                    RadDiscount = None
                    print(Discount, 'Discount')

                    if Discount:
                        RadDiscount = Discount_Radiology_Fee.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Radiology_Test_Id__Room_Id__Test_Code=Radiology_ins.Test_Code
                        ).first()
                        print(RadDiscount, 'RadDiscount')

                        rate = Radiology_ins.Amount if Radiology_ins else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = RadDiscount.discount_method if RadDiscount else None
                        discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

                        discount_amount = 0
                        final_rate = rate

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'


                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                        else:
                            discount_value_display = "-"
                            discount_amount_display = "-"
                    
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': Radiology_ins.Test_Code,
                                'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                                'amt':Radiology_ins.Amount,
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                        }
                        Services_List.append(data_list)
 

                    else:
                        data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': Radiology_ins.Test_Code,
                                    'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                                    'amt':Radiology_ins.Amount,
                                    # 'final_rate' : final_rate,
                                    # 'DiscountType': discount_value_display,
                                    # 'Discount': discount_value if discount_value else '-',
                                    # 'Discountamt' : discount_amount_display,
                                    # 'Discountmethod' : Discountmethod,
                                    # 'Discountval' : discount_value,
                            }
                        Services_List.append(data_list)
    
            elif category_ins.ServiceCategory == 'GENERALSERVICES':
 
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.Service_Id,
                                'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                'amt':General_services_ins.Amount,
                        }
                        Services_List.append(data_list)
                    elif VisitType == 'IP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.Service_Id,
                                'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                'amt':General_services_ins.Amount,
                        }
                        Services_List.append(data_list)
           
            elif category_ins.ServiceCategory == 'PACKAGE':
                print('PACKAGE inside')
 
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Package_Master.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.pk,
                                'service_subcategory':f'{General_services_ins.pk} - {General_services_ins.Package_Name}',
                                'amt':General_services_ins.Price,
                        }
                        Services_List.append(data_list)
                    elif VisitType == 'IP':
                        General_services_ins = Package_Master.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.pk,
                                'service_subcategory':f'{General_services_ins.pk} - {General_services_ins.Package_Name}',
                                'amt':General_services_ins.Price,
                        }
                        Services_List.append(data_list)
            
            elif category_ins.ServiceCategory == 'PROCEDURES':
                print('Proceduressss')
 
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)    
                        if General_services_ins.IsSeparateFee == True:  
 
                            if Type == 'WARD':
 
                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Procedure_Id,
                                        'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                        'amt':General_services_ins.TotalWardAmount,
                                }
                                Services_List.append(data_list)
 
                            elif Type == 'ROOM':
                                data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalRoomAmount,
                                    }
                                Services_List.append(data_list)
                   
                        else:
 
                             data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalAmount,
                                    }
                             Services_List.append(data_list)
 
 
 
                    elif VisitType == 'IP':
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)    
                        if General_services_ins.IsSeparateFee == True:
                            if Type == 'WARD':
 
                                    data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalWardAmount,
                                    }
                                    Services_List.append(data_list)
 
                            elif Type == 'ROOM':
                                    data_list = {
                                                'pk': datas.pk,
                                                'ServiceId': General_services_ins.Procedure_Id,
                                                'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                                'amt':General_services_ins.TotalRoomAmount,
                                        }
                                    Services_List.append(data_list)
                       
                        else:
 
                            data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalAmount,
                                    }
                            Services_List.append(data_list)
 
            elif category_ins.ServiceCategory    == 'ROOMSERVICES':
 
                for datas in services_ins:

                    room_services_ins = WardType_Master_Detials.objects.get(pk=datas.object_id) 
                    Discount = DiscountMaster.objects.filter(
                            Service__ServiceCategory= 'ROOMSERVICES',
                            Patient_Type=ip_patient.PatientCategory
                        ).first()   

                    RoomDiscount = None    

                    if Discount:  
                        RoomDiscount = DiscountFeeRoom.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Ward_Rate_Id__Ward_Id = room_services_ins.Ward_Id
                        ).first()

                        rate = room_services_ins.Amount if room_services_ins else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = RoomDiscount.discount_method if RoomDiscount else None
                        discount_value = RoomDiscount.Cur_Fee if RoomDiscount else 0

                        print(discount_type,'discount_type',discount_value,'discount_value')

                        discount_amount = 0
                        final_rate = rate

                        discount_value_display =''
                        discount_amount_display = ''
                        Discountmethod = ''
 

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'


                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                        else:
                            discount_value_display = "-"
                            discount_amount_display = "-"



                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': room_services_ins.Ward_Id,
                                'service_subcategory':f'{room_services_ins.Ward_Id} - {room_services_ins.Ward_Name}',
                                'amt':room_services_ins.Amount,
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                        }
                        Services_List.append(data_list)
 

                    else:
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': room_services_ins.Ward_Id,
                                'service_subcategory':f'{room_services_ins.Ward_Id} - {room_services_ins.Ward_Name}',
                                'amt':room_services_ins.Amount,
                                # 'final_rate' : final_rate,
                                # 'DiscountType': discount_value_display,
                                # 'Discount': discount_value if discount_value else '-',
                                # 'Discountamt' : discount_amount_display,
                                # 'Discountmethod' : Discountmethod,
                                # 'Discountval' : discount_value,
                        }
                        Services_List.append(data_list)

 
            else:
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    

                        print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')

                        print(op_patient.PatientCategory,'pat catgoryyyyyyyyyy')

                        Discount = DiscountMaster.objects.filter(
                            Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
                            Patient_Type=op_patient.PatientCategory
                        ).first()

                        print(Discount,'Discount minor procedure')

                        MPDiscount = None

                        if Discount:
                            MPDiscount = Discount_service_Fee.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                service_Id__Service__Service_Id=General_services_ins.Service_Id
                            ).first()

                            rate = General_services_ins.Amount if General_services_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = MPDiscount.discount_method if MPDiscount else None
                            discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0

                            discount_amount = 0
                            final_rate = rate
                            Discountmethod = ''

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"


                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': General_services_ins.Service_Id,
                                    'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                    'amt':General_services_ins.Amount,
                                    'final_rate' : final_rate,
                                    'DiscountType': discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt' : discount_amount_display,
                                    'Discountmethod' : Discountmethod,
                                    'Discountval' : discount_value,
                            }
                            Services_List.append(data_list)

                        else:
                            data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Service_Id,
                                        'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                        'amt':General_services_ins.Amount,
                                        # 'final_rate' : final_rate,
                                        # 'DiscountType': discount_value_display,
                                        # 'Discount': discount_value if discount_value else '-',
                                        # 'Discountamt' : discount_amount_display,
                                        # 'Discountmethod' : Discountmethod,
                                        # 'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
                    elif VisitType == 'IP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    

                        print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')

                        Discount = DiscountMaster.objects.filter(
                            Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
                            Patient_Type=ip_patient.PatientCategory
                        ).first()

                        print(Discount,'Discount minor procedure')

                        MPDiscount = None

                        if Discount:
                            MPDiscount = Discount_service_Fee.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                service_Id__Service__Service_Id=General_services_ins.Service_Id
                            ).first()

                            rate = General_services_ins.Amount if General_services_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = MPDiscount.discount_method if MPDiscount else None
                            discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"

                    
                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': General_services_ins.Service_Id,
                                    'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                    'amt':General_services_ins.Amount,
                                    'final_rate' : final_rate,
                                    'DiscountType': discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt' : discount_amount_display,
                                    'Discountmethod' : Discountmethod,
                                    'Discountval' : discount_value,

                            }
                            Services_List.append(data_list)
 
                        else:
                            data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Service_Id,
                                        'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                        'amt':General_services_ins.Amount,
                                        # 'final_rate' : final_rate,
                                        # 'DiscountType': discount_value_display,
                                        # 'Discount': discount_value if discount_value else '-',
                                        # 'Discountamt' : discount_amount_display,
                                        # 'Discountmethod' : Discountmethod,
                                        # 'Discountval' : discount_value,

                                }
                            Services_List.append(data_list)

            return JsonResponse(Services_List, safe=False)
 
        except Exception as e:
                return JsonResponse({"error":str(e)})
 
@csrf_exempt
def services_Subcategory_details_by_Patient_category_for_IP(request):
 
    if request.method == 'GET':
        try:
            ServiceCategory = request.GET.get('ServiceCategory')
            ServicesubCategory = request.GET.get('ServicesubCategory')
            Patientcategory = request.GET.get('Patientcategory') # general insurance
            RegisterId = request.GET.get('RegisterId') # op ip
           
            VisitType = request.GET.get('VisitType')
            Type = request.GET.get('Type')
            op_patient = None
            ip_patient = None
            print('111111',ServiceCategory,ServicesubCategory,Patientcategory,RegisterId)
           
           # op_patient = Patient_Appointment_Registration_Detials.objects.get(PatientId_id = patientid)
            try:
                op_patient = Patient_Appointment_Registration_Detials.objects.get(Registration_Id= RegisterId)
                   
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                print("OP Patient not found")
           
            try:
                ip_patient = Patient_IP_Registration_Detials.objects.get(Registration_Id = RegisterId)
                print('121222',ip_patient)
            except Patient_IP_Registration_Detials.DoesNotExist:
                print("IP patient not found")
           
            category_ins = Service_Category_Masters.objects.get(Serviceid=ServiceCategory)
            print('categoryyyyy',category_ins)
           
            services_ins = Services_Group_Details.objects.filter(pk=ServicesubCategory)
            print('serviceeeee',services_ins)
            Services_List = []
 
            if category_ins.ServiceCategory == 'CONSULTATION':

                print('consullllll')
                if Patientcategory == 'General' and VisitType == 'OP':
 
                    for datas in services_ins:
                        print('dataasss',datas.object_id)
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                                'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                                'amt' : consultaion_ins.General_Consultation_Fee
                            }
                        Services_List.append(data_list)
               
                elif Patientcategory == 'General' and VisitType == 'IP':

                    print('ippayutuefwf')
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
 
                        print(consultaion_ins,'consultaion_ins')
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'amt' : consultaion_ins.General_Consultation_Fee
                        }
                        Services_List.append(data_list)
                   
                elif Patientcategory == 'Insurance' and VisitType == 'OP' :
                    print('2345678')
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)      
                        insurance_ins = Insurance_Master_Detials.objects.get(pk=op_patient.InsuranceName.Insurance_Id)
                        insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,insurance_id=insurance_ins.pk)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'insurancename': insurance_ins.Insurance_Name,
                            'amt' : insurance_fee_ins.Consultation_Fee
                        }
                        Services_List.append(data_list)
 
                elif Patientcategory == 'Insurance' and VisitType == 'IP' :
                       
                        for datas in services_ins:
 
                            consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                            Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                            speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                            insurance_ins = Insurance_Master_Detials.objects.get(pk=ip_patient.InsuranceName_id)
                            insurance_fee_ins = InsuranceFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,insurance_id=insurance_ins.pk)
 
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                                'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                                'insurancename': insurance_ins.Insurance_Name,
                                'amt' : insurance_fee_ins.Consultation_Fee
                            }
                            Services_List.append(data_list)
 
                elif Patientcategory == 'Client' and VisitType == 'OP':
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
 
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        Client_ins = Client_Master_Detials.objects.get(pk=op_patient.ClientName_id)
                        client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,client_id=Client_ins.pk)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : client_fee_ins.Consultation_Fee,
                        }
                        Services_List.append(data_list)
 
                elif Patientcategory == 'Client' and VisitType == 'IP':
                       
                        for datas in services_ins:
 
                            consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                            Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                            speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                            Client_ins = Client_Master_Detials.objects.get(pk=ip_patient.ClientName_id)
                            client_fee_ins = ClientFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,client_id=Client_ins.pk)
 
                            data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'clientname': Client_ins.Client_Name,
                            'amt' : client_fee_ins.Consultation_Fee,
                            }
                            Services_List.append(data_list)
 
                elif Patientcategory == 'Corporate' and VisitType == 'OP':
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        corporate_ins = Corporate_Master_Detials.objects.get(pk=op_patient.CorporateName_id)
                        corporate_fee_ins = CorporateFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,corporate_id=corporate_ins.Corporate_Id)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'corporatename': corporate_ins.Corporate_Name,
                            'amt' : corporate_fee_ins.Consultation_Fee,
                        }
                        Services_List.append(data_list)
 
                elif Patientcategory == 'Corporate' and VisitType == 'IP':
 
                    for datas in services_ins:
 
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        corporate_ins = Corporate_Master_Detials.objects.get(pk=ip_patient.CorporateName_id)
                        corporate_fee_ins = CorporateFee_for_Doctor.objects.get(doctor_ratecard_id=consultaion_ins.pk,corporate_id=corporate_ins.Corporate_Id)
 
                        data_list = {
                            'pk': datas.pk,
                            'ServiceId': consultaion_ins.Doctor_ID.Doctor_ID,
                            'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                            'corporatename': corporate_ins.Corporate_Name,
                            'amt' : corporate_fee_ins.Consultation_Fee,
                        }
                        Services_List.append(data_list)
                
            elif category_ins.ServiceCategory == 'LAB':
 
                for datas in services_ins:
                 
                    labtest_ins = Testmaster_Cost_List.objects.get(Test_Id=datas.object_id)

                    print(labtest_ins,'labtest_ins insideeeeeeee')

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='LAB',
                        Patient_Type=Patientcategory
                    ).first()

                    print(Discount ,' Lab Discount ')

                    LabDiscount = None

 
                    if labtest_ins.Test_Code:

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=labtest_ins.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount', labtest_ins.Test_Id)

                            rate = labtest_ins.Basic if labtest_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"
                        
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': labtest_ins.Test_Code.Test_Code,
                                'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
                                'amt' : labtest_ins.Basic,
                                'type': 'individual',
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
 
                        else:

                            if ip_patient.PatientCategory == 'Insurance':

                                patinsurance = ip_patient.InsuranceName.Insurance_Id if ip_patient.InsuranceName else None
                            
                                insurancefee = InsuranceFeeLab.objects.filter(insurance__Insurance_Id = patinsurance, Lab_Test_Id__Test_Id = labtest_ins.Test_Id).first()

                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': labtest_ins.Test_Code.Test_Code,
                                        'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
                                        'amt' : insurancefee.Cur_Test_Fee,
                                        'type': 'individual',
                                        'CGHScode' : labtest_ins.CGHS_CODE

                                }
                                Services_List.append(data_list)
 
                            else:
                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': labtest_ins.Test_Code.Test_Code,
                                        'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}',
                                        'amt' : labtest_ins.Basic,
                                        'type': 'individual',
                                        'CGHScode' : labtest_ins.CGHS_CODE

                                }
                                Services_List.append(data_list)

                    elif labtest_ins.Group_Code:

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=labtest_ins.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount')

                            rate = labtest_ins.Basic if labtest_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"
                        
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': labtest_ins.Group_Code.Group_Code,
                                'service_subcategory': f'{labtest_ins.Group_Code.Group_Code} - {labtest_ins.Group_Code.Group_Name}',
                                'amt' : labtest_ins.Basic,
                                'type': 'group',
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
 
                        else:


                              if ip_patient.PatientCategory == 'Insurance':

                                patinsurance = ip_patient.InsuranceName.Insurance_Id if ip_patient.InsuranceName else None
                            
                                insurancefee = InsuranceFeeLab.objects.filter(insurance__Insurance_Id = patinsurance, Lab_Test_Id__Test_Id = labtest_ins.Test_Id).first()

                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': labtest_ins.Group_Code.Group_Code,
                                        'service_subcategory': f'{labtest_ins.Group_Code.Group_Code} - {labtest_ins.Group_Code.Group_Name}',
                                        'amt' : insurancefee.Cur_Test_Fee,
                                        'type': 'individual',
                                        'CGHScode' : labtest_ins.CGHS_CODE
                                }
                                Services_List.append(data_list)
 
                              else:
                                  

                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': labtest_ins.Group_Code.Group_Code,
                                        'service_subcategory': f'{labtest_ins.Group_Code.Group_Code} - {labtest_ins.Group_Code.Group_Name}',
                                        'amt' : labtest_ins.Basic,
                                        'type' : 'group'
                                }
                                Services_List.append(data_list)
 
                    elif labtest_ins.Package_Code:

                        if Discount:
                            LabDiscount = DiscountFeeLab.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                Lab_Test_Id__Test_Id=labtest_ins.Test_Id
                            ).first()
                            print(LabDiscount, 'RadDiscount')

                            rate = labtest_ins.Basic if labtest_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = LabDiscount.discount_method if LabDiscount else None
                            discount_value = LabDiscount.Cur_Test_Fee if LabDiscount else 0

                            discount_amount = 0
                            final_rate = rate

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"
                        
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': labtest_ins.Package_Code.package_code,
                                'service_subcategory': f'{labtest_ins.Package_Code.package_code} - {labtest_ins.Package_Code.package_name}',
                                'amt' : labtest_ins.Basic,
                                'type': 'offers',
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
 
                        else:

                            if ip_patient.PatientCategory == 'Insurance':

                                patinsurance = ip_patient.InsuranceName.Insurance_Id if ip_patient.InsuranceName else None
                            
                                insurancefee = InsuranceFeeLab.objects.filter(insurance__Insurance_Id = patinsurance, Lab_Test_Id__Test_Id = labtest_ins.Test_Id).first()

                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': labtest_ins.Package_Code.package_code,
                                        'service_subcategory': f'{labtest_ins.Package_Code.package_code} - {labtest_ins.Package_Code.package_name}',
                                        'amt' :  insurancefee.Cur_Test_Fee,
                                        'type': 'offers',
                                         'CGHScode' : labtest_ins.CGHS_CODE

                                }
                                Services_List.append(data_list)

                            else:

                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': labtest_ins.Package_Code.package_code,
                                        'service_subcategory': f'{labtest_ins.Package_Code.package_code} - {labtest_ins.Package_Code.package_name}',
                                        'amt' : labtest_ins.Basic,
                                        'type': 'offers',
                                        'CGHScode' : labtest_ins.CGHS_CODE
                                }
                                Services_List.append(data_list)
 


            elif category_ins.ServiceCategory == 'RADIOLOGY':
 
                for datas in services_ins:
 
                    print(datas.object_id,'datas.object_id')
 
                    Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)

                    
                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='RADIOLOGY',
                        Patient_Type=Patientcategory
                    ).first()

                    RadDiscount = None
                    print(Discount, 'Discount')

                    if Discount:
                        RadDiscount = Discount_Radiology_Fee.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Radiology_Test_Id__Room_Id__Test_Code=Radiology_ins.Test_Code
                        ).first()
                        print(RadDiscount, 'RadDiscount')

                        rate = Radiology_ins.Amount if Radiology_ins else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = RadDiscount.discount_method if RadDiscount else None
                        discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

                        discount_amount = 0
                        final_rate = rate

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'


                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                        else:
                            discount_value_display = "-"
                            discount_amount_display = "-"
                    
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': Radiology_ins.Test_Code,
                                'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                                'amt':Radiology_ins.Amount,
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                        }
                        Services_List.append(data_list)
 

                    else:

                        if ip_patient.PatientCategory == 'Insurance':

                            patinsurance = ip_patient.InsuranceName.Insurance_Id if ip_patient.InsuranceName else None

                            insurancefee = Radiology_Insurance_Fee.objects.filter(Insurance__Insurance_Id = patinsurance, Radiology_Ratecard__Room_Id__Test_Code = Radiology_ins.Test_Code).first()

                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': Radiology_ins.Test_Code,
                                    'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                                    'amt':insurancefee.Fee,
                                    'CGHScode' : Radiology_ins.CGHS_CODE
                                    # 'final_rate' : final_rate,
                                    # 'DiscountType': discount_value_display,
                                    # 'Discount': discount_value if discount_value else '-',
                                    # 'Discountamt' : discount_amount_display,
                                    # 'Discountmethod' : Discountmethod,
                                    # 'Discountval' : discount_value,
                            }
                            Services_List.append(data_list)

                        else:


                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': Radiology_ins.Test_Code,
                                    'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                                    'amt':Radiology_ins.Amount,
                                    # 'final_rate' : final_rate,
                                    # 'DiscountType': discount_value_display,
                                    # 'Discount': discount_value if discount_value else '-',
                                    # 'Discountamt' : discount_amount_display,
                                    # 'Discountmethod' : Discountmethod,
                                    # 'Discountval' : discount_value,
                            }
                            Services_List.append(data_list)

            elif category_ins.ServiceCategory == 'GENERALSERVICES':
 
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.Service_Id,
                                'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                'amt':General_services_ins.Amount,
                        }
                        Services_List.append(data_list)
                    elif VisitType == 'IP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.Service_Id,
                                'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                'amt':General_services_ins.Amount,
                        }
                        Services_List.append(data_list)
           
            elif category_ins.ServiceCategory == 'PACKAGE':
                print('PACKAGE inside')
 
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Package_Master.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.pk,
                                'service_subcategory':f'{General_services_ins.pk} - {General_services_ins.Package_Name}',
                                'amt':General_services_ins.Price,
                        }
                        Services_List.append(data_list)
                    elif VisitType == 'IP':
                        General_services_ins = Package_Master.objects.get(pk=datas.object_id)                        
                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': General_services_ins.pk,
                                'service_subcategory':f'{General_services_ins.pk} - {General_services_ins.Package_Name}',
                                'amt':General_services_ins.Price,
                        }
                        Services_List.append(data_list)
            
            elif category_ins.ServiceCategory == 'PROCEDURES':
                print('Proceduressss')
 
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)    
                        if General_services_ins.IsSeparateFee == True:  
 
                            if Type == 'WARD':
 
                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Procedure_Id,
                                        'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                        'amt':General_services_ins.TotalWardAmount,
                                }
                                Services_List.append(data_list)
 
                            elif Type == 'ROOM':
                                data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalRoomAmount,
                                    }
                                Services_List.append(data_list)
                   
                        else:
 
                             data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalAmount,
                                    }
                             Services_List.append(data_list)
 
 
 
                    elif VisitType == 'IP':
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)    
                        if General_services_ins.IsSeparateFee == True:
                            if Type == 'WARD':
 
                                    data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalWardAmount,
                                    }
                                    Services_List.append(data_list)
 
                            elif Type == 'ROOM':
                                    data_list = {
                                                'pk': datas.pk,
                                                'ServiceId': General_services_ins.Procedure_Id,
                                                'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                                'amt':General_services_ins.TotalRoomAmount,
                                        }
                                    Services_List.append(data_list)
                       
                        else:
 
                            data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Procedure_Id,
                                            'service_subcategory':f'{General_services_ins.Procedure_Id} - {General_services_ins.Procedure_Name}',
                                            'amt':General_services_ins.TotalAmount,
                                    }
                            Services_List.append(data_list)
 
            elif category_ins.ServiceCategory    == 'ROOMSERVICES':
 
                for datas in services_ins:

                    room_services_ins = WardType_Master_Detials.objects.get(pk=datas.object_id) 
                    Discount = DiscountMaster.objects.filter(
                            Service__ServiceCategory= 'ROOMSERVICES',
                            Patient_Type=ip_patient.PatientCategory
                        ).first()   

                    RoomDiscount = None    

                    if Discount:  
                        RoomDiscount = DiscountFeeRoom.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Ward_Rate_Id__Ward_Id = room_services_ins.Ward_Id
                        ).first()

                        rate = room_services_ins.Amount if room_services_ins else 0
                        final_rate = rate  
                        discount_amount = 0  

                        discount_type = RoomDiscount.discount_method if RoomDiscount else None
                        discount_value = RoomDiscount.Cur_Fee if RoomDiscount else 0

                        print(discount_type,'discount_type',discount_value,'discount_value')

                        discount_amount = 0
                        final_rate = rate

                        discount_value_display =''
                        discount_amount_display = ''
                        Discountmethod = ''
 

                        if discount_type and discount_value:
                            if discount_type.lower() == "percentage":
                                discount_amount = (rate * discount_value) / 100
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                Discountmethod = 'PERCENTAGE'
                            elif discount_type.lower() == "flat":
                                discount_amount = discount_value
                                final_rate = rate - discount_amount
                                discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                Discountmethod = 'FLATAMOUNT'


                            # format discount amount nicely
                            discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                        else:
                            discount_value_display = "-"
                            discount_amount_display = "-"



                        data_list = {
                                'pk': datas.pk,
                                'ServiceId': room_services_ins.Ward_Id,
                                'service_subcategory':f'{room_services_ins.Ward_Id} - {room_services_ins.Ward_Name}',
                                'amt':room_services_ins.Amount,
                                'final_rate' : final_rate,
                                'DiscountType': discount_value_display,
                                'Discount': discount_value if discount_value else '-',
                                'Discountamt' : discount_amount_display,
                                'Discountmethod' : Discountmethod,
                                'Discountval' : discount_value,
                        }
                        Services_List.append(data_list)
 

                    else:
 
                        if ip_patient.PatientCategory == 'Insurance':
 
                            patinsurance = ip_patient.InsuranceName.Insurance_Id if ip_patient.InsuranceName else None
                            insurancefee = Insurance_Ward_Fee.objects.filter(Insurance__Insurance_Id = patinsurance, Ward_Ratecard__Ward_Id = room_services_ins.Ward_Id).first()
 
                            data_list = {
                                'pk': datas.pk,
                                'ServiceId': room_services_ins.Ward_Id,
                                'service_subcategory':f'{room_services_ins.Ward_Id} - {room_services_ins.Ward_Name}',
                                'amt':insurancefee.Fee,
                                # 'final_rate' : final_rate,
                                # 'DiscountType': discount_value_display,
                                # 'Discount': discount_value if discount_value else '-',
                                # 'Discountamt' : discount_amount_display,
                                # 'Discountmethod' : Discountmethod,
                                # 'Discountval' : discount_value,
                            }
                            Services_List.append(data_list)
 
                        else:
 
                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': room_services_ins.Ward_Id,
                                    'service_subcategory':f'{room_services_ins.Ward_Id} - {room_services_ins.Ward_Name}',
                                    'amt':room_services_ins.Amount,
                                    # 'final_rate' : final_rate,
                                    # 'DiscountType': discount_value_display,
                                    # 'Discount': discount_value if discount_value else '-',
                                    # 'Discountamt' : discount_amount_display,
                                    # 'Discountmethod' : Discountmethod,
                                    # 'Discountval' : discount_value,
                            }
                            Services_List.append(data_list)
 
 
 
            else:
                for datas in services_ins:
 
                    if VisitType == 'OP':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    

                        print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')

                        print(op_patient.PatientCategory,'pat catgoryyyyyyyyyy')

                        Discount = DiscountMaster.objects.filter(
                            Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
                            Patient_Type=op_patient.PatientCategory
                        ).first()

                        print(Discount,'Discount minor procedure')

                        MPDiscount = None

                        if Discount:
                            MPDiscount = Discount_service_Fee.objects.filter(
                                discount__Discount_ID=Discount.Discount_ID,
                                service_Id__Service__Service_Id=General_services_ins.Service_Id
                            ).first()

                            rate = General_services_ins.Amount if General_services_ins else 0
                            final_rate = rate  
                            discount_amount = 0  

                            discount_type = MPDiscount.discount_method if MPDiscount else None
                            discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0

                            discount_amount = 0
                            final_rate = rate
                            Discountmethod = ''

                            if discount_type and discount_value:
                                if discount_type.lower() == "percentage":
                                    discount_amount = (rate * discount_value) / 100
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                    Discountmethod = 'PERCENTAGE'
                                elif discount_type.lower() == "flat":
                                    discount_amount = discount_value
                                    final_rate = rate - discount_amount
                                    discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                    Discountmethod = 'FLATAMOUNT'


                                # format discount amount nicely
                                discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                            else:
                                discount_value_display = "-"
                                discount_amount_display = "-"


                            data_list = {
                                    'pk': datas.pk,
                                    'ServiceId': General_services_ins.Service_Id,
                                    'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                    'amt':General_services_ins.Amount,
                                    'final_rate' : final_rate,
                                    'DiscountType': discount_value_display,
                                    'Discount': discount_value if discount_value else '-',
                                    'Discountamt' : discount_amount_display,
                                    'Discountmethod' : Discountmethod,
                                    'Discountval' : discount_value,
                            }
                            Services_List.append(data_list)

                        else:
                            data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Service_Id,
                                        'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                        'amt':General_services_ins.Amount,
                                        # 'final_rate' : final_rate,
                                        # 'DiscountType': discount_value_display,
                                        # 'Discount': discount_value if discount_value else '-',
                                        # 'Discountamt' : discount_amount_display,
                                        # 'Discountmethod' : Discountmethod,
                                        # 'Discountval' : discount_value,
                                }
                            Services_List.append(data_list)
                    
                    for datas in services_ins:
 
                        if VisitType == 'OP':
                            General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    
    
                            print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')
    
                            print(op_patient.PatientCategory,'pat catgoryyyyyyyyyy')
    
                            Discount = DiscountMaster.objects.filter(
                                Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
                                Patient_Type=op_patient.PatientCategory
                            ).first()
    
                            print(Discount,'Discount minor procedure')
    
                            MPDiscount = None
    
                            if Discount:
                                MPDiscount = Discount_service_Fee.objects.filter(
                                    discount__Discount_ID=Discount.Discount_ID,
                                    service_Id__Service__Service_Id=General_services_ins.Service_Id
                                ).first()
    
                                rate = General_services_ins.Amount if General_services_ins else 0
                                final_rate = rate  
                                discount_amount = 0  
    
                                discount_type = MPDiscount.discount_method if MPDiscount else None
                                discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0
    
                                discount_amount = 0
                                final_rate = rate
                                Discountmethod = ''
    
                                if discount_type and discount_value:
                                    if discount_type.lower() == "percentage":
                                        discount_amount = (rate * discount_value) / 100
                                        final_rate = rate - discount_amount
                                        discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                        Discountmethod = 'PERCENTAGE'
                                    elif discount_type.lower() == "flat":
                                        discount_amount = discount_value
                                        final_rate = rate - discount_amount
                                        discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                        Discountmethod = 'FLATAMOUNT'
    
    
                                    # format discount amount nicely
                                    discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                                else:
                                    discount_value_display = "-"
                                    discount_amount_display = "-"
    
    
                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Service_Id,
                                        'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                        'amt':General_services_ins.Amount,
                                        'final_rate' : final_rate,
                                        'DiscountType': discount_value_display,
                                        'Discount': discount_value if discount_value else '-',
                                        'Discountamt' : discount_amount_display,
                                        'Discountmethod' : Discountmethod,
                                        'Discountval' : discount_value,
                                }
                                Services_List.append(data_list)
    
                            else:
                                data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Service_Id,
                                            'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                            'amt':General_services_ins.Amount,
                                            # 'final_rate' : final_rate,
                                            # 'DiscountType': discount_value_display,
                                            # 'Discount': discount_value if discount_value else '-',
                                            # 'Discountamt' : discount_amount_display,
                                            # 'Discountmethod' : Discountmethod,
                                            # 'Discountval' : discount_value,
                                    }
                                Services_List.append(data_list)
                            
                            
                        elif VisitType == 'IP':
                            General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)    
    
                            print(General_services_ins.ServiceCategory.ServiceCategory,'service cat name founddddd')
    
                            Discount = DiscountMaster.objects.filter(
                                Service__ServiceCategory= General_services_ins.ServiceCategory.ServiceCategory,
                                Patient_Type=ip_patient.PatientCategory
                            ).first()
    
                            print(Discount,'Discount minor procedure')
    
                            MPDiscount = None
    
                            if Discount:
                                MPDiscount = Discount_service_Fee.objects.filter(
                                    discount__Discount_ID=Discount.Discount_ID,
                                    service_Id__Service__Service_Id=General_services_ins.Service_Id
                                ).first()
    
                                rate = General_services_ins.Amount if General_services_ins else 0
                                final_rate = rate  
                                discount_amount = 0  
    
                                discount_type = MPDiscount.discount_method if MPDiscount else None
                                discount_value = MPDiscount.Cur_Test_Fee if MPDiscount else 0
    
                                discount_amount = 0
                                final_rate = rate
    
                                if discount_type and discount_value:
                                    if discount_type.lower() == "percentage":
                                        discount_amount = (rate * discount_value) / 100
                                        final_rate = rate - discount_amount
                                        discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
                                        Discountmethod = 'PERCENTAGE'
                                    elif discount_type.lower() == "flat":
                                        discount_amount = discount_value
                                        final_rate = rate - discount_amount
                                        discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
                                        Discountmethod = 'FLATAMOUNT'
    
    
                                    # format discount amount nicely
                                    discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                                else:
                                    discount_value_display = "-"
                                    discount_amount_display = "-"
    
                    
                                data_list = {
                                        'pk': datas.pk,
                                        'ServiceId': General_services_ins.Service_Id,
                                        'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                        'amt':General_services_ins.Amount,
                                        'final_rate' : final_rate,
                                        'DiscountType': discount_value_display,
                                        'Discount': discount_value if discount_value else '-',
                                        'Discountamt' : discount_amount_display,
                                        'Discountmethod' : Discountmethod,
                                        'Discountval' : discount_value,
                                        'ISWardConsession' : General_services_ins.ISWardConsession,
                                        'ISWardPercentage' : General_services_ins.ISWardPercentage,
    
                                }
                                Services_List.append(data_list)
    
                            else:
    
                                if ip_patient.PatientCategory == 'Insurance':
    
                                    patinsurance = ip_patient.InsuranceName.Insurance_Id if ip_patient.InsuranceName else None
                                    insurancefee = Service_Insurance_Fee.objects.filter(Insurance__Insurance_Id = patinsurance,Service_Ratecard__Service__Service_Id = General_services_ins.Service_Id).first()
    
                                    data_list = {
                                            'pk': datas.pk,
                                            'ServiceId': General_services_ins.Service_Id,
                                            'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                            'amt':insurancefee.Fee,
                                            'CGHScode' : General_services_ins.CGHS_CODE,
                                            'ISWardConsession' : General_services_ins.ISWardConsession,
                                            'ISWardPercentage' : General_services_ins.ISWardPercentage,
                                            # 'final_rate' : final_rate,
                                            # 'DiscountType': discount_value_display,
                                            # 'Discount': discount_value if discount_value else '-',
                                            # 'Discountamt' : discount_amount_display,
                                            # 'Discountmethod' : Discountmethod,
                                            # 'Discountval' : discount_value,
    
                                    }
                                    Services_List.append(data_list)
    
                                else:
                                    data_list = {
                                                'pk': datas.pk,
                                                'ServiceId': General_services_ins.Service_Id,
                                                'service_subcategory':f'{General_services_ins.Service_Id} - {General_services_ins.Service_Name}',
                                                'amt':General_services_ins.Amount,
                                                'ISWardConsession' : General_services_ins.ISWardConsession,
                                                'ISWardPercentage' : General_services_ins.ISWardPercentage,
                                                # 'final_rate' : final_rate,
                                                # 'DiscountType': discount_value_display,
                                                # 'Discount': discount_value if discount_value else '-',
                                                # 'Discountamt' : discount_amount_display,
                                                # 'Discountmethod' : Discountmethod,
                                                # 'Discountval' : discount_value,
    
                                        }
                                    Services_List.append(data_list)
    
    
 
 
                        return JsonResponse(Services_List, safe=False)
           
           
 



            return JsonResponse(Services_List, safe=False)
 
        except Exception as e:
                return JsonResponse({"error":str(e)})
 


@csrf_exempt
def Services_Group_details(request):
 
    if request.method == 'GET':
 
        try:
            services_ins = Services_Group_Details.objects.all()
            services_list = []
            for datas in services_ins:
 
                serviceid = datas.service_category_id
                category_ins = Service_Category_Masters.objects.get(pk=serviceid)
               
 
                if category_ins.ServiceCategory == 'CONSULTATION':
 
                    consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                   
                    Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)   
                    speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else ""
                    doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                    data_list = {
                             'id':datas.pk,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory' : f'{doctor_ins.Tittle.Title_Name}{doctor_ins.First_Name}{doctor_ins.Middle_Name} {doctor_ins.Last_Name} {Doctor_speciality_ins.Qualification} ({speciality_ins.Speciality_Name if speciality_ins else ""})',
                             'service_subcategorywithid' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else ""})',
                        }
                    services_list.append(data_list)
                elif category_ins.ServiceCategory == 'LAB':
 
                   
 
                    lab_ins = Testmaster_Cost_List.objects.get(pk=datas.object_id)
                   
                    data_list = {
                             'id':datas.pk,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory': lab_ins.Test_Code.Test_Name if lab_ins.Test_Code else lab_ins.Group_Code.Group_Name,
                             'service_subcategorywithid': f'{lab_ins.Test_Code.Test_Code} - {lab_ins.Test_Code.Test_Name}' if lab_ins.Test_Code else f'{lab_ins.Group_Code.Group_Code}-f{lab_ins.Group_Code.Group_Name}',
                        }
                    services_list.append(data_list)      
                elif category_ins.ServiceCategory == 'RADIOLOGY':
 
                    Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)
                   
                    data_list = {
                             'id':datas.pk,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':f'{Radiology_ins.Radiology_Id.Radiology_Name}-{Radiology_ins.Test_Name}',
                             'service_subcategorywithid':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                        }
                    services_list.append(data_list)
                elif category_ins.ServiceCategory == 'ROOMSERVICES':
 
               
                    Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
                    ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
                    data_list = {
                            'id':datas.pk,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory' : f'{Room_ins.Room_No} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}'        
                    }
                    services_list.append(data_list)
                elif category_ins.ServiceCategory == 'GENERALSERVICES':
 
                    General_services_ins  = Service_Master_Details.objects.get(pk=datas.object_id)
                   
                    data_list = {
                             'id':datas.pk,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':General_services_ins.Service_Name
                        }
                    services_list.append(data_list)
                elif category_ins.ServiceCategory == 'PROCEDURES':
 
                    General_services_ins  = Procedure_Master_Details.objects.get(pk=datas.object_id)
                   
                    data_list = {
                             'id':datas.pk,
                             'category': category_ins.ServiceCategory,
                             'service_subcategory':General_services_ins.Procedure_Name
                        }
                    services_list.append(data_list)
                else:
                    General_services_ins  = Service_Master_Details.objects.get(pk=datas.object_id)
                    data_list = {
                             'id':datas.pk,
                             'category': General_services_ins.ServiceCategory.ServiceCategory,
                             'service_subcategory':General_services_ins.Service_Name
                        }
                    services_list.append(data_list)
               
            for idx, services in enumerate(services_list, start=1):
                      services["Sno"] = idx
 
            return JsonResponse(services_list,safe=False)
 
        except Exception as e:
            # Handle and return the error message in the response
            return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def service_map_delete(request):
    if request.method == 'POST':

        try:

            id = request.GET.get('id')
            services =  Services_Group_Details.objects.get(pk=id)
            services.delete()

            return JsonResponse({'success':'Data Deleted Successfully'})

        except Exception as e:
                return JsonResponse({"error":str(e)})

@csrf_exempt
@require_http_methods(['GET'])
def Services_List_by_servicecategory(request):
 
    if request.method == "GET":
 
         try:
 
            servicecategory = request.GET.get('servicecategory','')
 
            Services_data_list = []
 
            category_ins = Service_Category_Masters.objects.get(Serviceid = servicecategory)
 
            print(category_ins,'category_ins')
 
            if category_ins.ServiceCategory == 'CONSULTATION':
               
                consultaion_ins = Doctor_Ratecard_Master.objects.all()
                for datas in consultaion_ins:
                   
                    Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=datas.Doctor_ID)  
                    speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                    doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=datas.Doctor_ID.Doctor_ID)
                   
                    service_data = {
                       
                        'pk': datas.pk,
                        'service_category' : 'Dr.Consultation',
                        'service_subcategory' : f'{datas.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',    
                    }
                    Services_data_list.append(service_data)
           
            elif category_ins.ServiceCategory == 'LAB':
                    labtest_ins = Testmaster_Cost_List.objects.all()
                    for datas in labtest_ins:
                   
                        service_data = {
                            'pk' : datas.pk,
                            'service_category' : 'Lab',
                            'service_subcategory': f'{datas.Test_Code.Test_Code} - {datas.Test_Code.Test_Name}' if datas.Test_Code else f'{datas.Group_Code.Group_Code}-f{datas.Group_Code.Group_Name}',
                        }
                        Services_data_list.append(service_data)
           
            elif category_ins.ServiceCategory == 'RADIOLOGY':
                Radiology_ins = TestName_Details.objects.all()
                for datas in Radiology_ins:
                   
                    service_data = {
                        'pk':datas.pk,
                        'service_category' : 'Radiology',
                        'service_subcategory':f'{datas.Test_Code} - {datas.Test_Name}',
                    }
                    Services_data_list.append(service_data)
           
            elif category_ins.ServiceCategory == 'ROOMSERVICES':
                Room_ins = WardType_Master_Detials.objects.all()
                for datas in Room_ins:
                   
                    service_data = {
                       
                        'pk':datas.pk,
                        'service_subcategory':f'{datas.Ward_Name}'
                       
                    }
                    Services_data_list.append(service_data)
           
            elif category_ins.ServiceCategory == 'GENERALSERVICES':
                service_ins = Service_Master_Details.objects.all()
                for datas in service_ins:
                    service_data = {
                       
                        'pk' : datas.pk,
                        'service_category' : 'general services',
                        'service_subcategory' : datas.Service_Name
                    }
                    Services_data_list.append(service_data)
                   
            elif category_ins.ServiceCategory == 'PROCEDURES':
                service_ins = Procedure_Master_Details.objects.all()
                for datas in service_ins:
                    service_data = {
                       
                        'pk' : datas.pk,
                        'service_category' : 'procedures',
                        'service_subcategory' : datas.Procedure_Name
                    }
                    Services_data_list.append(service_data)
                   
            elif category_ins.ServiceCategory == 'THERAPY':
                service_ins = TherapyType_Detials.objects.all()
                for datas in service_ins:
                    service_data = {
                       
                        'pk' : datas.pk,
                        'service_category' : 'therapy',
                        'service_subcategory' : datas.Therapy_Name
                    }
                    Services_data_list.append(service_data)
 
            else:
 
                service_ins = Service_Master_Details.objects.filter(ServiceCategory__Serviceid = servicecategory)
                for datas in service_ins:
                    service_data = {
                       
                        'pk' : datas.pk,
                        'service_category' : 'general services',
                        'service_subcategory' : datas.Service_Name
                    }
                    Services_data_list.append(service_data)
 
                   
            return JsonResponse(Services_data_list,safe=False)
 
         except Exception as e:
            return JsonResponse({"error": str(e)})
 
 
 

