

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from Masters.models import *
from Ip_Workbench.models import *
from Workbench.models import *
from Inventory.models import *
from django.db.models import Sum, Q
from Masters.serializers import *
import pandas as pd
from django.db.models import Q
from datetime import datetime
from .models import *
from collections import defaultdict
 


@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def OtTheaterMaster_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # print(f"Received data: {data}")

            print('otttttttttttt')
            
            # Extract and validate data
            OtId = data.get('OtId')
            Location = data.get('Location')
            TheatreName = data.get('TheatreName')
            ShortName = data.get('ShortName')
            FloorName = data.get('FloorName')
            Building = data.get('Building')
            Block = data.get('Block')

           
            
            speciality = data.get('Speciality')
            SpecialityId = data.get("SpecialityId", [])

            print(SpecialityId,'SpecialityIdSpecialityIdSpecialityId')

          
            SpecialityId= SpecialityId.split(', ') if SpecialityId else None

            print(SpecialityId,'SpecialityIdSpecialityId')

            
            TheatreType = data.get('TheatreType')
            Rent = data.get('Rent')
            Emergency = data.get('Emergency',False)
            Details = data.get('Details')
            Remarks = data.get('Remarks')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
      
            try:
                location_instance = Location_Detials.objects.get(pk=Location)
                floor_instance = Floor_Master_Detials.objects.get(pk=FloorName)
                Buiding_ins = Building_Master_Detials.objects.get(pk=Building)
                Block_ins = Block_Master_Detials.objects.get(pk=Block)

          

                if not SpecialityId:
                        
                        SpecialityId = []

                Speciality_instance = Speciality_Detials.objects.filter(Speciality_Id__in=SpecialityId)

                print(Speciality_instance,'Speciality_instanceSpeciality_instance')
              
                
                
            except (Location_Detials.DoesNotExist, Floor_Master_Detials.DoesNotExist,Building_Master_Detials.DoesNotExist,Block_Master_Detials.DoesNotExist,WardType_Master_Detials.DoesNotExist):
                return JsonResponse({'error': 'Invalid Location or FloorName'})

                 
            if OtId:
                if Statusedit:
                   
                    OtTheater_instance = OtTheaterMaster_Detials.objects.get(Ot_Id=OtId)
                    OtTheater_instance.Status = not OtTheater_instance.Status
                    OtTheater_instance.save()
                      
                    
                else:  
                    
                        OtTheater_instance = OtTheaterMaster_Detials.objects.get(Ot_Id=OtId)
                        
                        OtTheater_instance.Location=location_instance
                        OtTheater_instance.TheatreName=TheatreName
                        OtTheater_instance.ShortName=ShortName
                        OtTheater_instance.FloorName=floor_instance
                        OtTheater_instance.Building = Buiding_ins
                        OtTheater_instance.Block = Block_ins
                    
                        OtTheater_instance.TheatreType = TheatreType
                        OtTheater_instance.Rent = Rent
                        OtTheater_instance.Emergency=Emergency
                        OtTheater_instance.Details=Details
                        OtTheater_instance.Remarks=Remarks
                        OtTheater_instance.save()

                        OtTheater_instance.Speciality.set(Speciality_instance)
                        

                return JsonResponse({'success': 'OtTheater Updated successfully'})
            else:
                
                if OtTheaterMaster_Detials.objects.filter(TheatreName=TheatreName).exists():
                    return JsonResponse({'warn': f"The TheatreName  are already present in the name of {TheatreName} "})
                else:
                    
                    OtTheater_instance = OtTheaterMaster_Detials.objects.create(
                        Location=location_instance,
                        TheatreName=TheatreName,
                        ShortName=ShortName,
                        FloorName=floor_instance,
                        Building = Buiding_ins,
                        Block = Block_ins,
                          
                        TheatreType = TheatreType,
                        Rent = Rent,
                        Emergency=Emergency,
                        Details=Details,
                        Remarks=Remarks,
                        created_by=created_by
                    )

                if Speciality_instance:
                    print('premkumar')
                    OtTheater_instance.Speciality.set(Speciality_instance)
                else:
                    OtTheater_instance.Speciality.set([])
                print('premkumar')
                
            return JsonResponse({'success': 'OtTheater added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            
            OtTheaters = OtTheaterMaster_Detials.objects.all()
            print(OtTheaters)
            
            
            OtTheaters_Master_data = []
            for OtTheater in OtTheaters:


                SpecialityID = ', '.join(str(Speciality.Speciality_Id) for Speciality in OtTheater.Speciality.all())
                Specialitynames = ', '.join(Speciality.Speciality_Name for Speciality in OtTheater.Speciality.all())
               

                OtTheater_dict = {
                    'id': OtTheater.pk,
                    'LocationId': OtTheater.Location.Location_Id,
                    'Location': OtTheater.Location.Location_Name,
                    'TheatreName': OtTheater.TheatreName,
                    'ShortName': OtTheater.ShortName,
                    'FloorId': OtTheater.FloorName.Floor_Id,
                    'FloorName': OtTheater.FloorName.Floor_Name,
                    'BuidingId':OtTheater.Building.Building_Id,
                    'BuildingName':OtTheater.Building.Building_Name,
                    'BlockId':OtTheater.Block.Block_Id,
                    'BlockName':OtTheater.Block.Block_Name,
                    'SpecialityID':SpecialityID,
                    'Specialityname':Specialitynames,
                      
                    'TheatreType':OtTheater.TheatreType,
                    'Rent':OtTheater.Rent,
                    'Emergency': OtTheater.Emergency,
                    'Details': OtTheater.Details,
                    'Remarks': OtTheater.Remarks,
                    'Status': 'Active' if OtTheater.Status else 'Inactive',
                    'created_by': OtTheater.created_by,
                    
                }
                OtTheaters_Master_data.append(OtTheater_dict)

                for idx, theatre in enumerate(OtTheaters_Master_data, start=1):
                        theatre["sno"] = idx 

            return JsonResponse(OtTheaters_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

@csrf_exempt
@require_http_methods(["GET"])
def Theatrename_all(request):

      if request.method == 'GET':
          
          try:
              
              Speciality = request.GET.get('Speciality', None)
              
              theatre_ins = OtTheaterMaster_Detials.objects.all()
              
              theatre_list = []
              for datas in theatre_ins:
                  
                  data_list = {
                      
                      'id':datas.Ot_Id,
                      'Theatrename':datas.TheatreName
                  }
                  theatre_list.append(data_list)
                  

              return JsonResponse(theatre_list,safe=False)
              





          except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Doctorname_for_OTBooking(request):

    if request.method == 'GET':

        try:

         
            specialityid = request.GET.get('Speciality', None)
            
            doct_list = []
        
              
            Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Category_id=4,Specialization_id=specialityid)
           
            for datas in Doc_ins:
                
                data_list={
                    'id':datas.Doctor_ID.Doctor_ID,
                    'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name}.{datas.Doctor_ID.Last_Name}'
                }
                doct_list.append(data_list)

            return JsonResponse(doct_list,safe=False)
            


        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Surgeon_list(request):

    if request.method == 'GET':

        try:

            # des_ins = Designation_Detials.objects.get(Designation_Name='SENIORSURGEON')
            Catins = Category_Detials.objects.get(Category_Name='SURGEON')

            Surgeon_list=[]
            Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Category_id = Catins.Category_Id)
            for datas in Doc_ins:
                
                data_list={
                    'id':datas.Doctor_ID.Doctor_ID,
                    'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name} {datas.Doctor_ID.Middle_Name} {datas.Doctor_ID.Last_Name} ({datas.Qualification})'
                }
                Surgeon_list.append(data_list)

            return JsonResponse(Surgeon_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Surgeon_list_for_calendar(request):

    if request.method == 'GET':

        try:

            categoryname = request.GET.get('categoryname','')

            if categoryname == 'SURGEON':

                des_ins = Category_Detials.objects.get(Category_Name = categoryname)

                Surgeon_list=[]
                Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Category_id = des_ins.Category_Id)
                for datas in Doc_ins:
                    
                    data_list={
                        'id':datas.Doctor_ID.Doctor_ID,
                        'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name}.{datas.Doctor_ID.Last_Name}'
                    }
                    Surgeon_list.append(data_list)

                return JsonResponse(Surgeon_list,safe=False)
            
            elif categoryname == 'ANAESTHESIOLOGIST':

                spe_ins = Speciality_Detials.objects.get(Speciality_Name = categoryname)

                Anaesthesiologist_list=[]
                Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Specialization_id = spe_ins.Speciality_Id)
                
                for datas in Doc_ins:
                        
                        data_list={
                        'id':datas.Doctor_ID.Doctor_ID,
                        'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name}.{datas.Doctor_ID.Last_Name}'
                        }

                        Anaesthesiologist_list.append(data_list)

                return JsonResponse(Anaesthesiologist_list,safe=False)

            elif categoryname == 'NURSE':

                des_ins = Category_Detials.objects.get(Category_Name = categoryname)

                Surgeon_list=[]
                Doc_ins = Employee_Personal_Form_Detials.objects.filter(Category = des_ins.Category_Id)
                for datas in Doc_ins:
                    
                    data_list={
                        'id':datas.Employee_ID,
                        'Doctorname':f'{datas.Tittle.Title_Name}.{datas.First_Name}.{datas.Middle_Name} {datas.Last_Name}'
                    }
                    Surgeon_list.append(data_list)

                return JsonResponse(Surgeon_list,safe=False)

            # elif categoryname == 'CIRCULATINGNURSE':

            #     des_ins = Designation_Detials.objects.get(Designation_Name = categoryname)

            #     Surgeon_list=[]
            #     Doc_ins = Employee_Personal_Form_Detials.objects.filter(Designation = des_ins.Designation_Id)
            #     for datas in Doc_ins:
                    
            #         data_list={
            #             'id':datas.Employee_ID,
            #             'Doctorname':f'{datas.Tittle.Title_Name}.{datas.First_Name}.{datas.Middle_Name} {datas.Last_Name}'
            #         }
            #         Surgeon_list.append(data_list)

            #     return JsonResponse(Surgeon_list,safe=False)


            elif categoryname == 'TECHNICIAN':

                des_ins = Category_Detials.objects.get(Category_Name = categoryname)

                Surgeon_list=[]
                Doc_ins = Employee_Personal_Form_Detials.objects.filter(Category = des_ins.Category_Id)
                for datas in Doc_ins:
                    
                    data_list={
                        'id':datas.Employee_ID,
                        'Doctorname':f'{datas.Tittle.Title_Name}.{datas.First_Name}.{datas.Middle_Name} {datas.Last_Name}'
                    }
                    Surgeon_list.append(data_list)

                return JsonResponse(Surgeon_list,safe=False)

            elif categoryname == 'HELPER':

                des_ins = Category_Detials.objects.get(Category_Name = categoryname)

                Surgeon_list=[]
                Doc_ins = Employee_Personal_Form_Detials.objects.filter(Category = des_ins.Category_Id)
                for datas in Doc_ins:
                    
                    data_list={
                        'id':datas.Employee_ID,
                        'Doctorname':f'{datas.Tittle.Title_Name}.{datas.First_Name}.{datas.Middle_Name} {datas.Last_Name}'
                    }
                    Surgeon_list.append(data_list)

                return JsonResponse(Surgeon_list,safe=False)



        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Assistant_Surgeon_list(request):

    if request.method == 'GET':

        try:


            # des_ins = Designation_Detials.objects.get(Designation_Name='JUNIORSURGEON')
            # Surgeon_list=[]
            # Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Designation_id = des_ins.Designation_Id)
            # for datas in Doc_ins:
                
            #     data_list={
            #         'id':datas.Doctor_ID.Doctor_ID,
            #         'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name} {datas.Doctor_ID.Middle_Name} {datas.Doctor_ID.Last_Name}'
            #     }
            #     Surgeon_list.append(data_list)

            # return JsonResponse(Surgeon_list,safe=False)

            Catins = Category_Detials.objects.get(Category_Name='SURGEON')

            Surgeon_list=[]
            Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Category_id = Catins.Category_Id)
            for datas in Doc_ins:
                
                data_list={
                    'id':datas.Doctor_ID.Doctor_ID,
                    'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name} {datas.Doctor_ID.Middle_Name} {datas.Doctor_ID.Last_Name} ({datas.Qualification})'
                }
                Surgeon_list.append(data_list)

            return JsonResponse(Surgeon_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Anaesthesiologist_list(request):

    if request.method == 'GET':

        try:

            

            spe_ins = Speciality_Detials.objects.get(Speciality_Name='ANAESTHESIOLOGIST')

            Anaesthesiologist_list=[]
            Doc_ins = Doctor_ProfessForm_Detials.objects.filter(Specialization_id = spe_ins.Speciality_Id)
            
            for datas in Doc_ins:
                    
                    data_list={
                    'id':datas.Doctor_ID.Doctor_ID,
                    'Doctorname':f'{datas.Doctor_ID.Tittle.Title_Name}.{datas.Doctor_ID.First_Name} {datas.Doctor_ID.Middle_Name} {datas.Doctor_ID.Last_Name}'
                     }

                    Anaesthesiologist_list.append(data_list)

            return JsonResponse(Anaesthesiologist_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Scrub_Nurse_list(request):

    if request.method == 'GET':

        try:

            Catins = Category_Detials.objects.get(Category_Name='NURSE')
            Scrub_Nurse_list=[]
            emp_ins = Employee_Personal_Form_Detials.objects.filter(Category_id=Catins.Category_Id,Department__Department_Name__in=['OT'])
            
            
            for datas in emp_ins:

                    data_list={
                        'id':datas.Employee_ID,
                        'Employeename':f'{datas.Tittle.Title_Name}.{datas.First_Name}.{datas.Last_Name}'
                    }
                    Scrub_Nurse_list.append(data_list)

            return JsonResponse(Scrub_Nurse_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Circulating_Nurse_list(request):

    if request.method == 'GET':

        try:
            Catins = Category_Detials.objects.get(Category_Name='NURSE')
            Circulating_Nurse_list=[]
            emp_ins = Employee_Personal_Form_Detials.objects.exclude(Department__Department_Name__in=['OT']).filter(Category_id=Catins.Category_Id)
            
            
            for datas in emp_ins:


                    data_list={
                        'id':datas.Employee_ID,
                        'Employeename':f'{datas.Tittle.Title_Name}.{datas.First_Name}.{datas.Last_Name}'
                    }
                    Circulating_Nurse_list.append(data_list)

            return JsonResponse(Circulating_Nurse_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Technician_list(request):

    if request.method == 'GET':

        try:
            cat_ins = Category_Detials.objects.get(Category_Name='TECHNICIAN')
            Dep_ins = Department_Detials.objects.get(Department_Name='OT')
            Technician_list=[]
            emp_ins = Employee_Personal_Form_Detials.objects.filter(Category_id=cat_ins.Category_Id,Department__in=[Dep_ins])
            
            
            for datas in emp_ins:

                    data_list={
                        'id':datas.Employee_ID,
                        'Employeename':f'{datas.Tittle.Title_Name}.{datas.First_Name} {datas.Middle_Name} {datas.Last_Name}'
                    }
                    Technician_list.append(data_list)

            return JsonResponse(Technician_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Helper_list(request):


    if request.method == 'GET':

        try:

            cat_ins = Category_Detials.objects.get(Category_Name='HELPER')
            Dep_ins = Department_Detials.objects.get(Department_Name='OT')
            Helper_list=[]
            emp_ins = Employee_Personal_Form_Detials.objects.filter(Category_id=cat_ins.Category_Id,Department__in=[Dep_ins])
            
            
            for datas in emp_ins:


                    data_list={
                        'id':datas.Employee_ID,
                        'Employeename':f'{datas.Tittle.Title_Name}.{datas.First_Name} {datas.Middle_Name} {datas.Last_Name}'
                    }
                    Helper_list.append(data_list)

            return JsonResponse(Helper_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# @csrf_exempt
# @require_http_methods(["POST","OPTIONS","GET"])
# def Theatre_booking_request_details(request):
 
#     if request.method == 'POST':
 
#         try:
 
#             data = json.loads(request.body)
#             print(data,'premmmmmmmm')
#             id = data.get('Booking_Id','')
#             Theatreid =data.get('Theatreid','')
#             ReqDate = data.get('reqDate','')
#             ReqTime = data.get('reqTime','')
#             BookingType = data.get('bookingType','')
#             BookingDate = data.get('bookingDate','') or data.get('BookingDate','')
#             BookingTime = data.get('bookingTime','') or data.get('BookingTime','')
#             # BookingTime1 = data.get('BookingTime','')
#             Duration = data.get('duration','')
#             OperationType = data.get('operationType','')
#             priority = data.get('priority','')
#             patientId = data.get('patientId','')
#             patientName = data.get('patientName','')
#             Age = data.get('age','')
#             Gender = data.get('gender','')
#             UHIDno = data.get('uhidNo','')
#             Createdby = data.get('created_by','')
#             Specializtion = data.get('specialization','')
#             bdate = data.get('BookingDate','')
#             SurgeryName = data.get('surgeryName','')
#             OTName = data.get('OTName') or data.get('Theatreid')
#             DoctorName = data.get('doctorName','')
#             Status = data.get('Status','')
#             Statusedit = data.get('Statusedit','')
#             Reason = data.get('Reason','')
#             OPD_Id = data.get('OPD_Id','')
#             OperationMode = data.get('OperationMode','')
#             RegistrationId = data.get('RegistrationId','')
#             opregistrationnid = data.get('opregistrationnid','')
#             ipregistrationid = data.get('ipregistrationid','')
#             emgregistrationid = data.get('emgregistrationid','')
 
           
 
           
#             Surgery_ins = ''
#             Procdure_ins = ''

 
#             Specialization_ins = Speciality_Detials.objects.get(pk=Specializtion) if Specializtion else None

#             if OperationMode == 'SURGERY':
 
#                 Surgery_ins = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None

#             else:

#                 print('Procdure_ins')
#                 Procdure_ins = Procedure_Master_Details.objects.get(pk=SurgeryName) if SurgeryName else None
#                 print('Procdure_ins',Procdure_ins)



           
#             Theatre_ins = OtTheaterMaster_Detials.objects.get(pk=OTName) if OTName else None
 
#             print(Theatre_ins,'Theatre_ins')
           
#             Doctor_ins = Doctor_Personal_Form_Detials.objects.get(pk=DoctorName) if DoctorName else None
         
#             Patient_ins = Patient_Detials.objects.get(pk=patientId) if patientId else None
         
#             booking_ins = Theatre_Booking_Request_Details.objects.get(pk=id) if id else None
         
#             op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
     
#             ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
         
#             emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
   
         
#             if BookingType == 'OP' and OPD_Id:
                   
#                     OPD_Otrequest = OPD_OtRequest_Details.objects.get(pk=OPD_Id)
#                     OPD_Otrequest.Status = not OPD_Otrequest.Status
#                     OPD_Otrequest.save()
                   
#                     Theatre_request_ins = Theatre_Booking_Request_Details(
               
#                     ReqDate = ReqDate,
#                     ReqTime = ReqTime,
#                     BookingType = BookingType,
#                     BookingDate = BookingDate,
#                     BookingTime = BookingTime,
#                     Duration = Duration,
#                     OperationType = OperationType,
#                     OperationMode = OperationMode,
 
#                     Priority = priority,
#                     PatientName = patientName,
#                     Age = Age,
#                     Gender = Gender,
#                     UHIDNO = UHIDno,
#                     CreatedBy =Createdby,
#                     Status=Status,
#                     Specialization = Specialization_ins,
#                     SurgeryName = Surgery_ins,
#                     TheatreName = Theatre_ins,
#                     Patientid = Patient_ins,
#                     DoctorName = Doctor_ins,
#                     OP_Registration_Id = op_reg_id_ins,
#                     IP_Registration_Id = ip_reg_id_ins,
#                     EMR_Registration_Id = emg_reg_id_ins
 
#                     )
 
#                     Theatre_request_ins.save()
 
#                     return JsonResponse({'success': 'Booking Request Added successfully'})
           
#             elif id:  
               
#                if Statusedit == True:
 
#                     Theatre_request_ins =  Theatre_Booking_Request_Details.objects.get(Booking_Id=id)
                   
#                     Theatre_request_ins.Status = Status
#                     Theatre_request_ins.Reason = Reason
#                     Theatre_request_ins.save()
 
#                     if Status == "Canceled":
 
#                         OTC = OTTheatrecalendar.objects.filter(booking=booking_ins)
 
#                         for i in OTC:
#                             i.delete()
 
#                         ODC = OTDoctorcalendar.objects.filter(booking=booking_ins)
#                         for j in ODC:
#                             j.delete()
 
#                         OEC = OTEmployeecalendar.objects.filter(booking=booking_ins)
#                         for k in OEC:
#                             k.delete()
                     
 
#                         return JsonResponse({'success': f'Operation {Status} successfully'})
 
#                     existsdata = OTTheatrecalendar.objects.filter(date=BookingDate,time=BookingTime).first()
 
#                     if existsdata:
 
#                         return None
                   
#                     OT_ins = OtTheaterMaster_Detials.objects.get(pk=Theatreid) if Theatreid else None
#                     # BookingTime_obj = datetime.strptime(BookingTime, "%H:%M:%S").time()
#                     # print(BookingTime_obj,'BookingTime_obj')
 
#                     try :
#                         calendar_ins = OTTheatrecalendar(
 
#                         Theatre = OT_ins,
#                         booking = booking_ins,
#                         date = BookingDate,
#                         time = BookingTime,
                       
#                          )
 
#                         calendar_ins.save()
 
                   
#                     except Exception as e:
 
#                         print(e)
 
#                     return JsonResponse({'success': f'Booking Request {Status} successfully'})
                   
#                Theatre_request_ins =  Theatre_Booking_Request_Details.objects.get(Booking_Id=id)

#                print(Theatre_request_ins,'Theatre_request_ins')

#                if OperationMode == 'SURGERY':

 
#                     Theatre_request_ins.ReqDate = ReqDate
#                     Theatre_request_ins.ReqTime = ReqTime
#                     Theatre_request_ins.BookingType = BookingType
#                     Theatre_request_ins.BookingDate = BookingDate
#                     Theatre_request_ins.BookingTime = BookingTime
#                     Theatre_request_ins.Duration = Duration
#                     Theatre_request_ins.OperationType = OperationType
#                     Theatre_request_ins.Priority = priority
#                     Theatre_request_ins.Patientid = Patient_ins
#                     Theatre_request_ins.PatientName = patientName
#                     Theatre_request_ins.Age = Age
#                     Theatre_request_ins.Gender = Gender
#                     Theatre_request_ins.UHIDNO = UHIDno
#                     Theatre_request_ins.CreatedBy = Createdby
#                     Theatre_request_ins.Status = Status
#                     Theatre_request_ins.Specialization = Specialization_ins
#                     Theatre_request_ins.SurgeryName = Surgery_ins

                    
#                     Theatre_request_ins.TheatreName = Theatre_ins
#                     Theatre_request_ins.DoctorName = Doctor_ins
#                     Theatre_request_ins.OP_Registration_Id = op_reg_id_ins
#                     Theatre_request_ins.IP_Registration_Id = ip_reg_id_ins
#                     Theatre_request_ins.EMR_Registration_Id = emg_reg_id_ins

#                     Theatre_request_ins.save()

#                     ottheatre = OTTheatrecalendar.objects.filter(booking=Theatre_request_ins).first()

#                     if ottheatre:
#                             ottheatre.date = BookingDate
#                             ottheatre.time = BookingTime
#                             ottheatre.save()

#                     otdoc = OTDoctorcalendar.objects.filter(booking=Theatre_request_ins)

#                     if otdoc:
#                             for d in otdoc:
#                                 d.date = BookingDate
#                                 d.time = BookingTime
#                                 d.save()
        
#                     otemp = OTEmployeecalendar.objects.filter(booking=Theatre_request_ins)

#                     if otemp:
#                             for e in otemp:
#                                 e.date = BookingDate
#                                 e.time = BookingTime
#                                 e.save()
        
#                     return JsonResponse({'success':'Booking Request Updated successfully'})


#                else:
                    
#                     print('else insideeeeeeeee')
 
#                     Theatre_request_ins.ReqDate = ReqDate
#                     Theatre_request_ins.ReqTime = ReqTime
#                     Theatre_request_ins.BookingType = BookingType
#                     Theatre_request_ins.BookingDate = BookingDate
#                     Theatre_request_ins.BookingTime = BookingTime
#                     Theatre_request_ins.Duration = Duration
#                     Theatre_request_ins.OperationType = OperationType
#                     Theatre_request_ins.Priority = priority
#                     Theatre_request_ins.Patientid = Patient_ins
#                     Theatre_request_ins.PatientName = patientName
#                     Theatre_request_ins.Age = Age
#                     Theatre_request_ins.Gender = Gender
#                     Theatre_request_ins.UHIDNO = UHIDno
#                     Theatre_request_ins.CreatedBy = Createdby
#                     Theatre_request_ins.Status = Status
#                     Theatre_request_ins.Specialization = Specialization_ins
#                     Theatre_request_ins.ProcedureName = Procdure_ins
  
#                     Theatre_request_ins.TheatreName = Theatre_ins
#                     Theatre_request_ins.DoctorName = Doctor_ins
#                     Theatre_request_ins.OP_Registration_Id = op_reg_id_ins
#                     Theatre_request_ins.IP_Registration_Id = ip_reg_id_ins
#                     Theatre_request_ins.EMR_Registration_Id = emg_reg_id_ins

#                     Theatre_request_ins.save()

#                     ottheatre = OTTheatrecalendar.objects.filter(booking=Theatre_request_ins).first()

#                     if ottheatre:
#                             ottheatre.date = BookingDate
#                             ottheatre.time = BookingTime
#                             ottheatre.save()

#                     otdoc = OTDoctorcalendar.objects.filter(booking=Theatre_request_ins)

#                     if otdoc:
#                             for d in otdoc:
#                                 d.date = BookingDate
#                                 d.time = BookingTime
#                                 d.save()
        
#                     otemp = OTEmployeecalendar.objects.filter(booking=Theatre_request_ins)

#                     if otemp:
#                             for e in otemp:
#                                 e.date = BookingDate
#                                 e.time = BookingTime
#                                 e.save()
        
#                     return JsonResponse({'success':'Booking Request Updated successfully'})
 
               
 
#             if OperationMode == 'SURGERY':

#                 Theatre_request_ins = Theatre_Booking_Request_Details(
                
#                     ReqDate = ReqDate,
#                     ReqTime = ReqTime,
#                     BookingType = BookingType,
#                     BookingDate = BookingDate,
#                     BookingTime = BookingTime,
#                     Duration = Duration,
#                     OperationType = OperationType,
#                     OperationMode = OperationMode,
#                     Priority = priority,
#                     Patientid = Patient_ins,
#                     PatientName = patientName,
#                     Age = Age,
#                     Gender = Gender,
#                     UHIDNO = UHIDno,
#                     CreatedBy =Createdby,
#                     Status=Status,
#                     Reason = Reason,
    
#                     Specialization = Specialization_ins,
#                     SurgeryName = Surgery_ins ,
#                     # ProcedureName = Procdure_ins,
#                     TheatreName = Theatre_ins,
#                     DoctorName = Doctor_ins,
#                     OP_Registration_Id = op_reg_id_ins,
#                     IP_Registration_Id = ip_reg_id_ins,
#                     EMR_Registration_Id = emg_reg_id_ins
    
#                     )
    
#                 Theatre_request_ins.save()
    
#                 return JsonResponse({'success': 'Booking Request Added successfully'})
 
#             else:

#                 Theatre_request_ins = Theatre_Booking_Request_Details(
                
#                     ReqDate = ReqDate,
#                     ReqTime = ReqTime,
#                     BookingType = BookingType,
#                     BookingDate = BookingDate,
#                     BookingTime = BookingTime,
#                     Duration = Duration,
#                     OperationType = OperationType,
#                     OperationMode = OperationMode,
#                     Priority = priority,
#                     Patientid = Patient_ins,
#                     PatientName = patientName,
#                     Age = Age,
#                     Gender = Gender,
#                     UHIDNO = UHIDno,
#                     CreatedBy =Createdby,
#                     Status=Status,
#                     Reason = Reason,
    
#                     Specialization = Specialization_ins,
#                     # SurgeryName = Surgery_ins ,
#                     ProcedureName = Procdure_ins,
#                     TheatreName = Theatre_ins,
#                     DoctorName = Doctor_ins,
#                     OP_Registration_Id = op_reg_id_ins,
#                     IP_Registration_Id = ip_reg_id_ins,
#                     EMR_Registration_Id = emg_reg_id_ins
    
#                     )
    
#                 Theatre_request_ins.save()
    
#                 return JsonResponse({'success': 'Booking Request Added successfully'})




#         except Exception as e:
       
#            return JsonResponse({'error': str(e)})
 
#     elif request.method == 'GET':
 
#         try:

#             PhoneNo = request.GET.get('PhoneNo')
#             Fname = request.GET.get('Fname')
 
#             Theatrerequest_list = []
#             Theatre_ins = Theatre_Booking_Request_Details.objects.all()
 
#             print(Theatre_ins)

#             if PhoneNo and not Fname:

#                 Theatre_ins = Theatre_ins.filter(Patientid__PhoneNo__icontains=PhoneNo)

#             elif Fname and not PhoneNo:

#                 Theatre_ins = Theatre_ins.filter(Patientid__FirstName__icontains = Fname)

#             elif Fname and PhoneNo :

#                 Theatre_ins = Theatre_ins.filter(Patientid__PhoneNo__icontains=PhoneNo,Patientid__FirstName__icontains = Fname)

#             for datas in Theatre_ins:
 
#                 formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
               
#                 formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
 
 
#                 if datas.BookingType == 'OP':
 
#                      data_list = {
 
#                     'Booking_Id':datas.Booking_Id,
#                     'ReqDate':formatted_rdate,
#                     'ReqTime':datas.ReqTime,
#                     'BookingType':datas.BookingType,
#                     'Specialization_name':datas.Specialization.Speciality_Name if datas.Specialization else None,
#                     'Specializationid':datas.Specialization.Speciality_Id if datas.Specialization else None,
#                     'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
#                     'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
#                     'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
#                     'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,

#                     'TheatreName':datas.TheatreName.TheatreName if datas.TheatreName else None,
#                     'Theatreid':datas.TheatreName.Ot_Id if datas.TheatreName else None,
#                     'theatrerent' : datas.TheatreName.Rent if datas.TheatreName else None,
#                     'DoctorID':datas.DoctorName.Doctor_ID if datas.DoctorName else None,
#                     'DoctorName':datas.DoctorName.First_Name if datas.DoctorName else None, 
#                     'BookingDate':datas.BookingDate,
#                     'bookingdate':formatted_bdate,
#                     'BookingTime':datas.BookingTime,
#                     'Duration':datas.Duration,
#                     'OperationType':datas.OperationType,
#                     'OperationMode':datas.OperationMode,
#                     'Priority':datas.Priority,
#                     'patientId': datas.OP_Registration_Id.PatientId.PatientId if datas.OP_Registration_Id else None,
#                     'PatientName':datas.OP_Registration_Id.PatientId.FirstName if datas.OP_Registration_Id else None,
#                     'Age':datas.OP_Registration_Id.PatientId.Age if datas.OP_Registration_Id else None,
#                     'Gender':datas.OP_Registration_Id.PatientId.Gender if datas.OP_Registration_Id else None,
#                     'UHIDNO':datas.OP_Registration_Id.PatientId.UniqueIdNo if datas.OP_Registration_Id else None,
#                     'Status':datas.Status,
#                     'Reason' : datas.Reason,
#                     'CreatedBy':datas.CreatedBy,
#                     'DoctorConfirm': datas.DoctorConfirm,
#                     # 'opregid' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
#                     'RegistrationId' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
                   
 
#                 }
#                      Theatrerequest_list.append(data_list)
 
#                 elif  datas.BookingType == 'IP':
 
#                      data_list = {
 
#                     'Booking_Id':datas.Booking_Id,
#                     'ReqDate':formatted_rdate,
#                     'ReqTime':datas.ReqTime,
#                     'BookingType':datas.BookingType,
#                     'Specialization_name':datas.Specialization.Speciality_Name if datas.Specialization else None ,
#                     'Specializationid':datas.Specialization.Speciality_Id if datas.Specialization else None ,
#                     'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
#                     'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
#                     'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
#                     'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,

#                     'TheatreName':datas.TheatreName.TheatreName if datas.TheatreName else None,
#                     'Theatreid':datas.TheatreName.Ot_Id if datas.TheatreName else None,
#                     'theatrerent' : int(datas.TheatreName.Rent) if datas.TheatreName else 0,
#                     'DoctorID':datas.DoctorName.Doctor_ID if datas.DoctorName else None,
#                     'DoctorName':datas.DoctorName.First_Name if datas.DoctorName else None,
#                     'BookingDate':datas.BookingDate,
#                     'bookingdate':formatted_bdate,
#                     'BookingTime':datas.BookingTime,
#                     'Duration':int(datas.Duration) if datas.Duration else 0,
#                     'OperationType':datas.OperationType,
#                     'OperationMode':datas.OperationMode,

#                     'Priority':datas.Priority,
#                     'patientId': datas.IP_Registration_Id.PatientId.PatientId if datas.IP_Registration_Id else None,
#                     'PatientName':datas.IP_Registration_Id.PatientId.FirstName if datas.IP_Registration_Id else None,
#                     'Age':datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
#                     'Gender':datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
#                     'UHIDNO':datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
#                     'Status':datas.Status,
#                     'Reason' : datas.Reason,
#                     'CreatedBy':datas.CreatedBy,
#                     'DoctorConfirm': datas.DoctorConfirm,
#                     'RegistrationId' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                   
 
#                 }
#                      Theatrerequest_list.append(data_list)
 
#                 elif  datas.BookingType == 'EMERGENCY':
 
#                      data_list = {
 
#                     'Booking_Id':datas.Booking_Id,
#                     'ReqDate':formatted_rdate,
#                     'ReqTime':datas.ReqTime,
#                     'BookingType':datas.BookingType,
#                     'Specialization_name':datas.Specialization.Speciality_Name,
#                     'Specializationid':datas.Specialization.Speciality_Id,
#                     'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
#                     'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
#                     'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
#                     'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,

#                     'TheatreName':datas.TheatreName.TheatreName,
#                     'Theatreid':datas.TheatreName.Ot_Id,
#                     'DoctorID':datas.DoctorName.Doctor_ID,
#                     'DoctorName':datas.DoctorName.First_Name,
#                     'BookingDate':datas.BookingDate,
#                     'bookingdate':formatted_bdate,
#                     'BookingTime':datas.BookingTime,
#                     'Duration':int(datas.Duration),
#                     'OperationType':datas.OperationType,
#                     'OperationMode':datas.OperationMode,

#                     'Priority':datas.Priority,
#                     'patientId': datas.EMR_Registration_Id.PatientId.PatientId if datas.EMR_Registration_Id else None,
#                     'PatientName':datas.EMR_Registration_Id.PatientId.FirstName if datas.EMR_Registration_Id.PatientId.FirstName else None,
#                     'Age':datas.EMR_Registration_Id.PatientId.Age if datas.EMR_Registration_Id.PatientId.Age else None,
#                     'Gender':datas.EMR_Registration_Id.PatientId.Gender if datas.EMR_Registration_Id.PatientId.Gender else None,
#                     'UHIDNO':datas.EMR_Registration_Id.PatientId.UniqueIdNo if datas.EMR_Registration_Id.PatientId.UniqueIdNo else None,
#                     'Status':datas.Status,
#                     'Reason' : datas.Reason,
#                     'CreatedBy':datas.CreatedBy,
#                     'DoctorConfirm': datas.DoctorConfirm,
#                     'RegistrationId' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None,
                   
 
#                 }
#                      Theatrerequest_list.append(data_list)

#             opd_request_ins = OPD_OtRequest_Details.objects.all()
           
#             for datas in opd_request_ins:
 
#                if datas.Status == True:
                   
       
#                     created_at = datas.created_at
#                     formatted_bdate = datas.SurgeryRequestedDate.strftime('%d-%m-%y')
#                     formatted_date =  created_at.strftime('%d-%m-%y')
#                     formatted_time = created_at.strftime('%H:%M:%S')
                   
#                     data_list = {
 
#                         'OPD_Id' : datas.OtRequest_Id,
#                         'BookingDate':datas.SurgeryRequestedDate,
#                         'bookingdate' : formatted_bdate,
#                         'ReqDate' : formatted_date,
#                         'ReqTime' : formatted_time,
#                         'SurgeryName' : datas.SurgeryName.Surgery_Name,
#                         'Surgeryid' : datas.SurgeryName.Surgery_Id,
#                         'patientId':datas.Patient_Id.PatientId,
#                         'RegistrationId' :datas.Registration_Id.Registration_Id,
#                         'PatientName':datas.Patient_Id.FirstName,
#                         'Age':datas.Patient_Id.Age,
#                         'Gender':datas.Patient_Id.Gender,
#                         'BookingType':'OP',
#                         'Specialization_name':datas.Speciality.Speciality_Name,
#                         'Specializationid':datas.Speciality.Speciality_Id,
#                         'UHIDNO':datas.Patient_Id.UniqueIdNo,
#                         'Status' : 'Requested',
                       
 
#                     }
#                     Theatrerequest_list.append(data_list)  
           
#             for idx, Theatre in enumerate(Theatrerequest_list, start=1):
#                         Theatre["Sno"] = idx
                     
#             return JsonResponse(Theatrerequest_list,safe=False)
 
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Theatre_booking_request_details(request):
 
    if request.method == 'POST':
 
        try:
 
            data = json.loads(request.body)
            print(data,'premmmmmmmm')
            id = data.get('Booking_Id','')
            Theatreid =data.get('Theatreid','')
            ReqDate = data.get('reqDate','')
            ReqTime = data.get('reqTime','')
            BookingType = data.get('bookingType','')
            BookingDate = data.get('bookingDate','') or data.get('BookingDate','')
            BookingTime = data.get('bookingTime','') or data.get('BookingTime','')
            # BookingTime1 = data.get('BookingTime','')
            Duration = data.get('duration','')
            OperationType = data.get('operationType','')
            priority = data.get('priority','')
            patientId = data.get('patientId','')
            patientName = data.get('patientName','')
            Age = data.get('age','')
            Gender = data.get('gender','')
            UHIDno = data.get('uhidNo','')
            Createdby = data.get('created_by','')
            Specializtion = data.get('specialization','')
            bdate = data.get('BookingDate','')
            SurgeryName = data.get('surgeryName','')
            OTName = data.get('OTName') or data.get('Theatreid')
            DoctorName = data.get('doctorName','')
            Status = data.get('Status','')
            Statusedit = data.get('Statusedit','')
            Reason = data.get('Reason','')
            OPD_Id = data.get('OPD_Id','')
            OperationMode = data.get('OperationMode','')
            RegistrationId = data.get('RegistrationId','')
            opregistrationnid = data.get('opregistrationnid','')
            ipregistrationid = data.get('ipregistrationid','')
            emgregistrationid = data.get('emgregistrationid','')
 
           
 
           
            Surgery_ins = ''
            Procdure_ins = ''

 
            Specialization_ins = Speciality_Detials.objects.get(pk=Specializtion) if Specializtion else None

            if OperationMode == 'SURGERY':
 
                Surgery_ins = SurgeryName_Details.objects.get(pk=SurgeryName) if SurgeryName else None

            else:

                print('Procdure_ins')
                Procdure_ins = Procedure_Master_Details.objects.get(pk=SurgeryName) if SurgeryName else None
                print('Procdure_ins',Procdure_ins)



           
            Theatre_ins = OtTheaterMaster_Detials.objects.get(pk=OTName) if OTName else None
 
            print(Theatre_ins,'Theatre_ins')
           
            Doctor_ins = Doctor_Personal_Form_Detials.objects.get(pk=DoctorName) if DoctorName else None
         
            Patient_ins = Patient_Detials.objects.get(pk=patientId) if patientId else None
         
            booking_ins = Theatre_Booking_Request_Details.objects.get(pk=id) if id else None
         
            op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
     
            ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
         
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
   
         
            if BookingType == 'OP' and OPD_Id:
                   
                    OPD_Otrequest = OPD_OtRequest_Details.objects.get(pk=OPD_Id)
                    OPD_Otrequest.Status = not OPD_Otrequest.Status
                    OPD_Otrequest.save()
                   
                    Theatre_request_ins = Theatre_Booking_Request_Details(
               
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
 
                    Priority = priority,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy =Createdby,
                    Status=Status,
                    Specialization = Specialization_ins,
                    SurgeryName = Surgery_ins,
                    TheatreName = Theatre_ins,
                    Patientid = Patient_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
 
                    )
 
                    Theatre_request_ins.save()
 
                    return JsonResponse({'success': 'Booking Request Added successfully'})
           
            elif id:  
               
               if Statusedit == True:
 
                    Theatre_request_ins =  Theatre_Booking_Request_Details.objects.get(Booking_Id=id)
                   
                    Theatre_request_ins.Status = Status
                    Theatre_request_ins.Reason = Reason
                    Theatre_request_ins.save()
 
                    if Status == "Canceled":
 
                        OTC = OTTheatrecalendar.objects.filter(booking=booking_ins)
 
                        for i in OTC:
                            i.delete()
 
                        ODC = OTDoctorcalendar.objects.filter(booking=booking_ins)
                        for j in ODC:
                            j.delete()
 
                        OEC = OTEmployeecalendar.objects.filter(booking=booking_ins)
                        for k in OEC:
                            k.delete()
                     
 
                        return JsonResponse({'success': f'Operation {Status} successfully'})
 
                    existsdata = OTTheatrecalendar.objects.filter(date=BookingDate,time=BookingTime).first()
 
                    if existsdata:
 
                        return None
                   
                    OT_ins = OtTheaterMaster_Detials.objects.get(pk=Theatreid) if Theatreid else None
                    # BookingTime_obj = datetime.strptime(BookingTime, "%H:%M:%S").time()
                    # print(BookingTime_obj,'BookingTime_obj')
 
                    try :
                        calendar_ins = OTTheatrecalendar(
 
                        Theatre = OT_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                       
                         )
 
                        calendar_ins.save()
 
                   
                    except Exception as e:
 
                        print(e)
 
                    return JsonResponse({'success': f'Booking Request {Status} successfully'})
                   
               Theatre_request_ins =  Theatre_Booking_Request_Details.objects.get(Booking_Id=id)

               print(Theatre_request_ins,'Theatre_request_ins')

               if OperationMode == 'SURGERY':

 
                    Theatre_request_ins.ReqDate = ReqDate
                    Theatre_request_ins.ReqTime = ReqTime
                    Theatre_request_ins.BookingType = BookingType
                    Theatre_request_ins.BookingDate = BookingDate
                    Theatre_request_ins.BookingTime = BookingTime
                    Theatre_request_ins.Duration = Duration
                    Theatre_request_ins.OperationType = OperationType
                    Theatre_request_ins.Priority = priority
                    Theatre_request_ins.Patientid = Patient_ins
                    Theatre_request_ins.PatientName = patientName
                    Theatre_request_ins.Age = Age
                    Theatre_request_ins.Gender = Gender
                    Theatre_request_ins.UHIDNO = UHIDno
                    Theatre_request_ins.CreatedBy = Createdby
                    Theatre_request_ins.Status = Status
                    Theatre_request_ins.Specialization = Specialization_ins
                    Theatre_request_ins.SurgeryName = Surgery_ins

                    
                    Theatre_request_ins.TheatreName = Theatre_ins
                    Theatre_request_ins.DoctorName = Doctor_ins
                    Theatre_request_ins.OP_Registration_Id = op_reg_id_ins
                    Theatre_request_ins.IP_Registration_Id = ip_reg_id_ins
                    Theatre_request_ins.EMR_Registration_Id = emg_reg_id_ins

                    Theatre_request_ins.save()

                    ottheatre = OTTheatrecalendar.objects.filter(booking=Theatre_request_ins).first()

                    if ottheatre:
                            ottheatre.date = BookingDate
                            ottheatre.time = BookingTime
                            ottheatre.save()

                    otdoc = OTDoctorcalendar.objects.filter(booking=Theatre_request_ins)

                    if otdoc:
                            for d in otdoc:
                                d.date = BookingDate
                                d.time = BookingTime
                                d.save()
        
                    otemp = OTEmployeecalendar.objects.filter(booking=Theatre_request_ins)

                    if otemp:
                            for e in otemp:
                                e.date = BookingDate
                                e.time = BookingTime
                                e.save()
        
                    return JsonResponse({'success':'Booking Request Updated successfully'})


               else:
                    
                    print('else insideeeeeeeee')
 
                    Theatre_request_ins.ReqDate = ReqDate
                    Theatre_request_ins.ReqTime = ReqTime
                    Theatre_request_ins.BookingType = BookingType
                    Theatre_request_ins.BookingDate = BookingDate
                    Theatre_request_ins.BookingTime = BookingTime
                    Theatre_request_ins.Duration = Duration
                    Theatre_request_ins.OperationType = OperationType
                    Theatre_request_ins.Priority = priority
                    Theatre_request_ins.Patientid = Patient_ins
                    Theatre_request_ins.PatientName = patientName
                    Theatre_request_ins.Age = Age
                    Theatre_request_ins.Gender = Gender
                    Theatre_request_ins.UHIDNO = UHIDno
                    Theatre_request_ins.CreatedBy = Createdby
                    Theatre_request_ins.Status = Status
                    Theatre_request_ins.Specialization = Specialization_ins
                    Theatre_request_ins.ProcedureName = Procdure_ins
  
                    Theatre_request_ins.TheatreName = Theatre_ins
                    Theatre_request_ins.DoctorName = Doctor_ins
                    Theatre_request_ins.OP_Registration_Id = op_reg_id_ins
                    Theatre_request_ins.IP_Registration_Id = ip_reg_id_ins
                    Theatre_request_ins.EMR_Registration_Id = emg_reg_id_ins

                    Theatre_request_ins.save()

                    ottheatre = OTTheatrecalendar.objects.filter(booking=Theatre_request_ins).first()

                    if ottheatre:
                            ottheatre.date = BookingDate
                            ottheatre.time = BookingTime
                            ottheatre.save()

                    otdoc = OTDoctorcalendar.objects.filter(booking=Theatre_request_ins)

                    if otdoc:
                            for d in otdoc:
                                d.date = BookingDate
                                d.time = BookingTime
                                d.save()
        
                    otemp = OTEmployeecalendar.objects.filter(booking=Theatre_request_ins)

                    if otemp:
                            for e in otemp:
                                e.date = BookingDate
                                e.time = BookingTime
                                e.save()
        
                    return JsonResponse({'success':'Booking Request Updated successfully'})
 
               
 
            if OperationMode == 'SURGERY':

                Theatre_request_ins = Theatre_Booking_Request_Details(
                
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy =Createdby,
                    Status=Status,
                    Reason = Reason,
    
                    Specialization = Specialization_ins,
                    SurgeryName = Surgery_ins ,
                    # ProcedureName = Procdure_ins,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
    
                    )
    
                Theatre_request_ins.save()
    
                return JsonResponse({'success': 'Booking Request Added successfully'})
 
            else:

                Theatre_request_ins = Theatre_Booking_Request_Details(
                
                    ReqDate = ReqDate,
                    ReqTime = ReqTime,
                    BookingType = BookingType,
                    BookingDate = BookingDate,
                    BookingTime = BookingTime,
                    Duration = Duration,
                    OperationType = OperationType,
                    OperationMode = OperationMode,
                    Priority = priority,
                    Patientid = Patient_ins,
                    PatientName = patientName,
                    Age = Age,
                    Gender = Gender,
                    UHIDNO = UHIDno,
                    CreatedBy =Createdby,
                    Status=Status,
                    Reason = Reason,
    
                    Specialization = Specialization_ins,
                    # SurgeryName = Surgery_ins ,
                    ProcedureName = Procdure_ins,
                    TheatreName = Theatre_ins,
                    DoctorName = Doctor_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins
    
                    )
    
                Theatre_request_ins.save()
    
                return JsonResponse({'success': 'Booking Request Added successfully'})




        except Exception as e:
       
           return JsonResponse({'error': str(e)})
 
    elif request.method == 'GET':
 
        try:

            DateType = request.GET.get('DateType', '')
            CurrentDate = request.GET.get('CurrentDate', '')
            FromDate = request.GET.get('FromDate', '')
            ToDate = request.GET.get('ToDate', '')
            ParticularDate = request.GET.get('ParticularDate', '')
            SearchbyFirstName = request.GET.get('SearchbyFirstName','')


            search_query = Q()

            if DateType == "Current" and CurrentDate:
                try:
                    current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                    search_query &= Q(BookingDate=current_date)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
           
            elif DateType == "Customize":
                try:
                    if FromDate and ToDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(BookingDate__range=[FromDate_dt, ToDate_dt])
                    elif FromDate:
                        FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                        search_query &= Q(BookingDate__gte=FromDate_dt)
                    elif ToDate:
                        ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                        search_query &= Q(BookingDate__lte=ToDate_dt)
                except ValueError:
                    raise ValueError('Invalid date format. Use YYYY-MM-DD.')
 
            elif DateType == "Particular":

                try:
                    ParticularDate = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                    search_query &= Q(BookingDate=ParticularDate)
                except ValueError:
                    raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')

            if SearchbyFirstName:
 
                print(SearchbyFirstName,'SearchbyFirstName')
                search_query &= (
                    # Q(Ip_Registration_Id__Registration_Id__iexact=f"""{'IP'}{SearchbyFirstName}""") |
                    Q(Patientid__PatientId__icontains=SearchbyFirstName) |
                    Q(Patientid__FirstName__icontains=SearchbyFirstName)
                )
 

 
            Theatrerequest_list = []
            Theatre_ins = Theatre_Booking_Request_Details.objects.filter(search_query)

            print(len(Theatre_ins),'Theatre_ins')
 
            

            for datas in Theatre_ins:
 
                formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
               
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
 
 
                if datas.BookingType == 'OP':
 
                     data_list = {
    'Booking_Id': datas.Booking_Id,
    'ReqDate': datas.ReqDate.strftime('%d-%m-%Y') if datas.ReqDate else None,
    'ReqTime': datas.ReqTime.strftime('%H:%M:%S') if datas.ReqTime else None,
    'BookingType': datas.BookingType,
    'Specialization_name': datas.Specialization.Speciality_Name if datas.Specialization else None,
    'Specializationid': datas.Specialization.Speciality_Id if datas.Specialization else None,
    'SurgeryName': datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
    'Surgeryid': datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
    'ProcedureName': datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
    'Procedureid': datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
    'TheatreName': datas.TheatreName.TheatreName if datas.TheatreName else None,
    'Theatreid': datas.TheatreName.Ot_Id if datas.TheatreName else None,
    'theatrerent': int(datas.TheatreName.Rent) if datas.TheatreName else None,
    'DoctorID': datas.DoctorName.Doctor_ID if datas.DoctorName else None,
    'DoctorName': datas.DoctorName.First_Name if datas.DoctorName else None,
    'BookingDate': datas.BookingDate.strftime('%Y-%m-%d') if datas.BookingDate else None,
    'bookingdate': datas.BookingDate.strftime('%d-%m-%Y') if datas.BookingDate else None,
    'BookingTime': datas.BookingTime.strftime('%H:%M:%S') if datas.BookingTime else None,
    'Duration': "{:.2f}".format(float(datas.Duration or 0)),
    'OperationType': datas.OperationType,
    'OperationMode': datas.OperationMode,
    'Priority': datas.Priority,
    'patientId': datas.IP_Registration_Id.PatientId.PatientId if datas.IP_Registration_Id else None,
    'PatientName': datas.IP_Registration_Id.PatientId.FirstName if datas.IP_Registration_Id else None,
    'Age': datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
    'Gender': datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
    'UHIDNO': datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
    'Status': datas.Status,
    'Reason': datas.Reason,
    'CreatedBy': datas.CreatedBy,
    'DoctorConfirm': datas.DoctorConfirm,
    'RegistrationId': datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
}

                     Theatrerequest_list.append(data_list)
 
                elif  datas.BookingType == 'IP':
 
                     data_list = {
    'Booking_Id': datas.Booking_Id,
    'ReqDate': datas.ReqDate.strftime('%d-%m-%Y') if datas.ReqDate else None,
    'ReqTime': datas.ReqTime.strftime('%H:%M:%S') if datas.ReqTime else None,
    'BookingType': datas.BookingType,
    'Specialization_name': datas.Specialization.Speciality_Name if datas.Specialization else None,
    'Specializationid': datas.Specialization.Speciality_Id if datas.Specialization else None,
    'SurgeryName': datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
    'Surgeryid': datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
    'ProcedureName': datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
    'Procedureid': datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
    'TheatreName': datas.TheatreName.TheatreName if datas.TheatreName else None,
    'Theatreid': datas.TheatreName.Ot_Id if datas.TheatreName else None,
    'theatrerent': int(datas.TheatreName.Rent) if datas.TheatreName else None,
    'DoctorID': datas.DoctorName.Doctor_ID if datas.DoctorName else None,
    'DoctorName': datas.DoctorName.First_Name if datas.DoctorName else None,
    'BookingDate': datas.BookingDate.strftime('%Y-%m-%d') if datas.BookingDate else None,
    'bookingdate': datas.BookingDate.strftime('%d-%m-%Y') if datas.BookingDate else None,
    'BookingTime': datas.BookingTime.strftime('%H:%M:%S') if datas.BookingTime else None,
    'Duration': "{:.2f}".format(float(datas.Duration or 0)),
    'OperationType': datas.OperationType,
    'OperationMode': datas.OperationMode,
    'Priority': datas.Priority,
    'patientId': datas.IP_Registration_Id.PatientId.PatientId if datas.IP_Registration_Id else None,
    'PatientName': datas.IP_Registration_Id.PatientId.FirstName if datas.IP_Registration_Id else None,
    'Age': datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
    'Gender': datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
    'UHIDNO': datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
    'Status': datas.Status,
    'Reason': datas.Reason,
    'CreatedBy': datas.CreatedBy,
    'DoctorConfirm': datas.DoctorConfirm,
    'RegistrationId': datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
}

                     Theatrerequest_list.append(data_list)
 
                elif  datas.BookingType == 'EMERGENCY':
 
                     data_list = {
    'Booking_Id': datas.Booking_Id,
    'ReqDate': datas.ReqDate.strftime('%d-%m-%Y') if datas.ReqDate else None,
    'ReqTime': datas.ReqTime.strftime('%H:%M:%S') if datas.ReqTime else None,
    'BookingType': datas.BookingType,
    'Specialization_name': datas.Specialization.Speciality_Name if datas.Specialization else None,
    'Specializationid': datas.Specialization.Speciality_Id if datas.Specialization else None,
    'SurgeryName': datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
    'Surgeryid': datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
    'ProcedureName': datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
    'Procedureid': datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
    'TheatreName': datas.TheatreName.TheatreName if datas.TheatreName else None,
    'Theatreid': datas.TheatreName.Ot_Id if datas.TheatreName else None,
    'theatrerent': int(datas.TheatreName.Rent) if datas.TheatreName else None,
    'DoctorID': datas.DoctorName.Doctor_ID if datas.DoctorName else None,
    'DoctorName': datas.DoctorName.First_Name if datas.DoctorName else None,
    'BookingDate': datas.BookingDate.strftime('%Y-%m-%d') if datas.BookingDate else None,
    'bookingdate': datas.BookingDate.strftime('%d-%m-%Y') if datas.BookingDate else None,
    'BookingTime': datas.BookingTime.strftime('%H:%M:%S') if datas.BookingTime else None,
    'Duration': "{:.2f}".format(float(datas.Duration or 0)),
    'OperationType': datas.OperationType,
    'OperationMode': datas.OperationMode,
    'Priority': datas.Priority,
    'patientId': datas.IP_Registration_Id.PatientId.PatientId if datas.IP_Registration_Id else None,
    'PatientName': datas.IP_Registration_Id.PatientId.FirstName if datas.IP_Registration_Id else None,
    'Age': datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
    'Gender': datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
    'UHIDNO': datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
    'Status': datas.Status,
    'Reason': datas.Reason,
    'CreatedBy': datas.CreatedBy,
    'DoctorConfirm': datas.DoctorConfirm,
    'RegistrationId': datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
}

                     Theatrerequest_list.append(data_list)

            opd_request_ins = OPD_OtRequest_Details.objects.all()
           
            for datas in opd_request_ins:
 
               if datas.Status == True:
                   
       
                    created_at = datas.created_at
                    formatted_bdate = datas.SurgeryRequestedDate.strftime('%d-%m-%y')
                    formatted_date =  created_at.strftime('%d-%m-%y')
                    formatted_time = created_at.strftime('%H:%M:%S')
                   
                    data_list = {
 
                        'OPD_Id' : datas.OtRequest_Id,
                        'BookingDate':datas.SurgeryRequestedDate,
                        'bookingdate' : formatted_bdate,
                        'ReqDate' : formatted_date,
                        'ReqTime' : formatted_time,
                        'SurgeryName' : datas.SurgeryName.Surgery_Name,
                        'Surgeryid' : datas.SurgeryName.Surgery_Id,
                        'patientId':datas.Patient_Id.PatientId,
                        'RegistrationId' :datas.Registration_Id.Registration_Id,
                        'PatientName':datas.Patient_Id.FirstName,
                        'Age':datas.Patient_Id.Age,
                        'Gender':datas.Patient_Id.Gender,
                        'BookingType':'OP',
                        'Specialization_name':datas.Speciality.Speciality_Name,
                        'Specializationid':datas.Speciality.Speciality_Id,
                        'UHIDNO':datas.Patient_Id.UniqueIdNo,
                        'Status' : 'Requested',
                       
 
                    }
                    Theatrerequest_list.append(data_list)  
           
            for idx, Theatre in enumerate(Theatrerequest_list, start=1):
                        Theatre["Sno"] = idx
                     
            return JsonResponse(Theatrerequest_list,safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def  Booking_Complete_Link(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data)

            Booking_Id = data.get('Booking_Id','')
            CompletedBy = data.get('CompletedBy','')

            booking_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id) if Booking_Id else None

            booking_ins.Status = 'Completed'
            booking_ins.CompletedBy = CompletedBy
            booking_ins.save()

            return JsonResponse({'success': 'Booking Completed successfully'})

        except Exception as e:

            print(e)

            return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def OTCalendar_Booking_Status(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data)

            bdate = data.get('BookingDate','')
            btime = data.get('BookingTime','')
            Booking_Id = data.get('Booking_Id','')
            CreatedBy = data.get('CreatedBy','')
            Theatreid = data.get('Theatreid','')
            Status = data.get('Status','')
            opregid = data.get('opregid','')
            patientId = data.get('patientId','')
            RegistrationId = data.get('RegistrationId','')
            BookingType = data.get('BookingType','')


            booking_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id) if Booking_Id else None
            theatre_ins = OtTheaterMaster_Detials.objects.get(Ot_Id = Theatreid) if Theatreid else None

            existsdata = OTTheatrecalendar.objects.filter(date=bdate,time=btime).first()
           

            if Status == 'Completed':

                print(Status,'status')

                booking_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id)

                booking_ins.Status = Status
                booking_ins.save()

            if existsdata:

                return JsonResponse({'success': 'already exists'})

            calendar_ins = OTTheatrecalendar(

                Theatre = theatre_ins,
                booking = booking_ins,
                date = bdate,
                time = btime,
            )

            calendar_ins.save()

            if BookingType == 'OP':

                crew_ins = Surgical_Team_Details.objects.get(OP_Registration_Id = opregid)

                surgeonId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Surgeon.all() ]

                for datas in surgeonId:
                    
                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

                assistantSurgeonId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Assistant_Surgeon.all() ]

                for datas in assistantSurgeonId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

                anaesthesiologistId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Anaesthesiologist.all() ]
                for datas in anaesthesiologistId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

            if BookingType == 'IP':

                crew_ins = Surgical_Team_Details.objects.get(IP_Registration_Id = RegistrationId)

                print(crew_ins)

                surgeonId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Surgeon.all() ]

                for datas in surgeonId:
                    
                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

                assistantSurgeonId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Assistant_Surgeon.all() ]

                for datas in assistantSurgeonId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

                anaesthesiologistId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Anaesthesiologist.all() ]
                for datas in anaesthesiologistId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

            if BookingType == 'EMERGENCY':

                crew_ins = Surgical_Team_Details.objects.get(EMR_Registration_Id = RegistrationId)

                print(crew_ins)

                surgeonId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Surgeon.all() ]

                for datas in surgeonId:
                    
                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

                assistantSurgeonId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Assistant_Surgeon.all() ]

                for datas in assistantSurgeonId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

                anaesthesiologistId = [ Surgeon.Doctor_ID for Surgeon in crew_ins.Anaesthesiologist.all() ]
                for datas in anaesthesiologistId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = bdate,
                        time = btime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

            return JsonResponse({'success': 'details addes successfully'})





        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def OTCompletepatient_details(request):


    if request.method == 'GET':

        try:
            
            pat_ins = Theatre_Booking_Request_Details.objects.filter(Status = 'Completed')
            completed_list = []

            for datas in pat_ins:

                formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
                
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')


                if datas.BookingType == 'OP':

                    data_list = {

                    'Booking_Id':datas.Booking_Id,
                    'ReqDate':formatted_rdate,
                    'ReqTime':datas.ReqTime,
                    'BookingType':datas.BookingType,
                    'Specialization_name':datas.Specialization.Speciality_Name,
                    'Specializationid':datas.Specialization.Speciality_Id,
                    'SurgeryName':datas.SurgeryName.Surgery_Name,
                    'Surgeryid':datas.SurgeryName.Surgery_Id,
                    'TheatreName':datas.TheatreName.TheatreName,
                    'Theatreid':datas.TheatreName.Ot_Id,
                    'theatrerent' : int(datas.TheatreName.Rent),
                    'DoctorID':datas.DoctorName.Doctor_ID,
                    'DoctorName':datas.DoctorName.First_Name,
                    'BookingDate':datas.BookingDate,
                    'bookingdate':formatted_bdate,
                    'BookingTime':datas.BookingTime,
                    'Duration':int(datas.Duration),
                    'OperationType':datas.OperationType,
                    'Priority':datas.Priority,
                    'patientId': datas.OP_Registration_Id.PatientId.PatientId if datas.OP_Registration_Id else None,
                    'PatientName':datas.OP_Registration_Id.PatientId.FirstName if datas.OP_Registration_Id else None,
                    'Age':datas.OP_Registration_Id.PatientId.Age if datas.OP_Registration_Id else None,
                    'Gender':datas.OP_Registration_Id.PatientId.Gender if datas.OP_Registration_Id else None,
                    'UHIDNO':datas.OP_Registration_Id.PatientId.UniqueIdNo if datas.OP_Registration_Id else None,
                    'Status':datas.Status,
                    'Reason' : datas.Reason,
                    'CreatedBy':datas.CreatedBy,
                    'DoctorConfirm': datas.DoctorConfirm,
                    # 'opregid' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
                    'RegistrationId' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
                    

                }
                    completed_list.append(data_list)

                elif  datas.BookingType == 'IP':

                     data_list = {

                            'Booking_Id':datas.Booking_Id,
                            'ReqDate':formatted_rdate,
                            'ReqTime':datas.ReqTime,
                            'BookingType':datas.BookingType,
                            'Specialization_name':datas.Specialization.Speciality_Name,
                            'Specializationid':datas.Specialization.Speciality_Id,
                            'SurgeryName':datas.SurgeryName.Surgery_Name,
                            'Surgeryid':datas.SurgeryName.Surgery_Id,
                            'TheatreName':datas.TheatreName.TheatreName,
                            'Theatreid':datas.TheatreName.Ot_Id,
                            'theatrerent' : int(datas.TheatreName.Rent),
                            'DoctorID':datas.DoctorName.Doctor_ID,
                            'DoctorName':datas.DoctorName.First_Name,
                            'BookingDate':datas.BookingDate,
                            'bookingdate':formatted_bdate,
                            'BookingTime':datas.BookingTime,
                            'Duration':int(datas.Duration),
                            'OperationType':datas.OperationType,
                            'Priority':datas.Priority,
                            'patientId': datas.IP_Registration_Id.PatientId.PatientId if datas.IP_Registration_Id else None,
                            'PatientName':datas.IP_Registration_Id.PatientId.FirstName if datas.IP_Registration_Id else None,
                            'Age':datas.IP_Registration_Id.PatientId.Age if datas.IP_Registration_Id else None,
                            'Gender':datas.IP_Registration_Id.PatientId.Gender if datas.IP_Registration_Id else None,
                            'UHIDNO':datas.IP_Registration_Id.PatientId.UniqueIdNo if datas.IP_Registration_Id else None,
                            'Status':datas.Status,
                            'Reason' : datas.Reason,
                            'CreatedBy':datas.CreatedBy,
                            'DoctorConfirm': datas.DoctorConfirm,
                            'RegistrationId' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                            

                        }
                     completed_list.append(data_list)

                elif  datas.BookingType == 'EMERGENCY':

                     data_list = {

                        'Booking_Id':datas.Booking_Id,
                        'ReqDate':formatted_rdate,
                        'ReqTime':datas.ReqTime,
                        'BookingType':datas.BookingType,
                        'Specialization_name':datas.Specialization.Speciality_Name,
                        'Specializationid':datas.Specialization.Speciality_Id,
                        'SurgeryName':datas.SurgeryName.Surgery_Name,
                        'Surgeryid':datas.SurgeryName.Surgery_Id,
                        'TheatreName':datas.TheatreName.TheatreName,
                        'Theatreid':datas.TheatreName.Ot_Id,
                        'DoctorID':datas.DoctorName.Doctor_ID,
                        'DoctorName':datas.DoctorName.First_Name,
                        'BookingDate':datas.BookingDate,
                        'bookingdate':formatted_bdate,
                        'BookingTime':datas.BookingTime,
                        'Duration':int(datas.Duration),
                        'OperationType':datas.OperationType,
                        'Priority':datas.Priority,
                        'patientId': datas.EMR_Registration_Id.PatientId.PatientId if datas.EMR_Registration_Id else None,
                        'PatientName':datas.EMR_Registration_Id.PatientId.FirstName if datas.EMR_Registration_Id else None,
                        'Age':datas.EMR_Registration_Id.PatientId.Age if datas.EMR_Registration_Id else None,
                        'Gender':datas.EMR_Registration_Id.PatientId.Gender if datas.EMR_Registration_Id else None,
                        'UHIDNO':datas.EMR_Registration_Id.PatientId.UniqueIdNo if datas.EMR_Registration_Id else None,
                        'Status':datas.Status,
                        'Reason' : datas.Reason,
                        'CreatedBy':datas.CreatedBy,
                        'DoctorConfirm': datas.DoctorConfirm,
                        'RegistrationId' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None,
                        

                    }
                     completed_list.append(data_list)



            for idx, Theatre in enumerate(completed_list, start=1):
                        Theatre["Sno"] = idx 

            return JsonResponse(completed_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def OTConfirmedpatient_details(request):


    if request.method == 'GET':

        try:
            status = request.GET.get('status','')
            Doctorid = request.GET.get('Doctorid','')

            if status :

                pat_ins = Theatre_Booking_Request_Details.objects.filter(Status = status)
                # print(pat_ins)
                completed_list = []

                for datas in pat_ins:

                    formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')                   
                    formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')

                    if datas.BookingType == 'OP':
                       
                    

                       crew_ins = Surgical_Team_Details.objects.get(OP_Registration_Id=datas.OP_Registration_Id)
                       crew_list = []
                       surgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Surgeon.all())
                       surgeon = ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Surgeon.all())

                       surgeonidot = [Surgeon.Doctor_ID for Surgeon in crew_ins.Surgeon.all()]



                       if Doctorid in surgeonidot:

                                data_list = {
                                        'Booking_Id':datas.Booking_Id,
                                        'ReqDate':formatted_rdate,
                                        'ReqTime':datas.ReqTime,
                                        'BookingType':datas.BookingType,
                                        'Specialization_name':datas.Specialization.Speciality_Name,
                                        'Specializationid':datas.Specialization.Speciality_Id,
                                        'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                                        'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                                        'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                                        'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
                                        'TheatreName':datas.TheatreName.TheatreName,
                                        'Theatreid':datas.TheatreName.Ot_Id,
                                        'theatrerent' : int(datas.TheatreName.Rent),
                                        'DoctorID':datas.DoctorName.Doctor_ID,
                                        'DoctorName':datas.DoctorName.First_Name,
                                        'BookingDate':datas.BookingDate,
                                        'bookingdate':formatted_bdate,
                                        'BookingTime':datas.BookingTime,
                                        'Duration':int(datas.Duration),
                                        'OperationType':datas.OperationType,
                                        'Priority':datas.Priority,
                                        'patientId': datas.OP_Registration_Id.PatientId.PatientId,
                                        'PatientName':datas.OP_Registration_Id.PatientId.FirstName,
                                        'Age':datas.OP_Registration_Id.PatientId.Age,
                                        'Gender':datas.OP_Registration_Id.PatientId.Gender,
                                        'UHIDNO':datas.OP_Registration_Id.PatientId.UniqueIdNo,
                                        'Status':datas.Status,
                                        'Reason' : datas.Reason,
                                        'CreatedBy':datas.CreatedBy,
                                         'DoctorConfirm': datas.DoctorConfirm,
                                        'RegistrationId' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
                                        # 'crewlist': crew_list,
                                        # 'Equipment_list': Equipment_list,
                                        # 'Consignment_list':Consignment_list,
                                        # 'consumable_list': consumable_list
                                    }
                                completed_list.append(data_list)
                    
                    
                    elif  datas.BookingType == 'IP':
                       
                       crew_ins = Surgical_Team_Details.objects.filter(IP_Registration_Id=datas.IP_Registration_Id).first()

                       if crew_ins:

                        surgeonidot = [Surgeon.Doctor_ID for Surgeon in crew_ins.Surgeon.all()]

                        if Doctorid in surgeonidot:
                                
                                print('insideeeeee')
                                
                    
                                data_list = {

                                    'Booking_Id':datas.Booking_Id,
                                    'ReqDate':formatted_rdate,
                                    'ReqTime':datas.ReqTime,
                                    'BookingType':datas.BookingType,
                                    'Specialization_name':datas.Specialization.Speciality_Name,
                                    'Specializationid':datas.Specialization.Speciality_Id,
                                    'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                                    'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                                    'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                                    'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
                                    'TheatreName':datas.TheatreName.TheatreName,
                                    'Theatreid':datas.TheatreName.Ot_Id,
                                    'theatrerent' : int(datas.TheatreName.Rent),
                                    'DoctorID':datas.DoctorName.Doctor_ID,
                                    'DoctorName':datas.DoctorName.First_Name,
                                    'BookingDate':datas.BookingDate,
                                    'bookingdate':formatted_bdate,
                                    'BookingTime':datas.BookingTime,
                                    'Duration':int(datas.Duration),
                                    'OperationType':datas.OperationType,
                                    'Priority':datas.Priority,
                                    'patientId': datas.IP_Registration_Id.PatientId.PatientId,
                                    'PatientName':datas.IP_Registration_Id.PatientId.FirstName,
                                    'Age':datas.IP_Registration_Id.PatientId.Age,
                                    'Gender':datas.IP_Registration_Id.PatientId.Gender,
                                    'UHIDNO':datas.IP_Registration_Id.PatientId.UniqueIdNo,
                                    'Status':datas.Status,
                                    'Reason' : datas.Reason,
                                    'CreatedBy':datas.CreatedBy,
                                    'DoctorConfirm': datas.DoctorConfirm,
                                    # 'crewlist': crew_list,
                                    # 'Equipment_list': Equipment_list,
                                    #         'Consignment_list':Consignment_list,
                                    #         'consumable_list': consumable_list,
                                    'RegistrationId' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                                    

                                }
                                completed_list.append(data_list)
                        
                        
                    elif  datas.BookingType == 'EMERGENCY':

                        crew_ins = Surgical_Team_Details.objects.get(EMR_Registration_Id=datas.EMR_Registration_Id)

                        surgeonidot = [Surgeon.Doctor_ID for Surgeon in crew_ins.Surgeon.all()]

                        if Doctorid in surgeonidot:
                
                            data_list = {

                                'Booking_Id':datas.Booking_Id,
                                'ReqDate':formatted_rdate,
                                'ReqTime':datas.ReqTime,
                                'BookingType':datas.BookingType,
                                'Specialization_name':datas.Specialization.Speciality_Name,
                                'Specializationid':datas.Specialization.Speciality_Id,
                                'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                                'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                                'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                                'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,
                                'TheatreName':datas.TheatreName.TheatreName,
                                'Theatreid':datas.TheatreName.Ot_Id,
                                'theatrerent' : int(datas.TheatreName.Rent),
                                'DoctorID':datas.DoctorName.Doctor_ID,
                                'DoctorName':datas.DoctorName.First_Name,
                                'BookingDate':datas.BookingDate,
                                'bookingdate':formatted_bdate,
                                'BookingTime':datas.BookingTime,
                                'Duration':int(datas.Duration),
                                'OperationType':datas.OperationType,
                                'Priority':datas.Priority,
                                'patientId': datas.EMR_Registration_Id.PatientId.PatientId,
                                'PatientName':datas.EMR_Registration_Id.PatientId.FirstName,
                                'Age':datas.EMR_Registration_Id.PatientId.Age,
                                'Gender':datas.EMR_Registration_Id.PatientId.Gender,
                                'UHIDNO':datas.EMR_Registration_Id.PatientId.UniqueIdNo,
                                'Status':datas.Status,
                                'Reason' : datas.Reason,
                                'CreatedBy':datas.CreatedBy,
                                'DoctorConfirm': datas.DoctorConfirm,
                                # 'crewlist': crew_list,
                                # 'Equipment_list': Equipment_list,
                                # 'Consignment_list':Consignment_list,
                                # 'consumable_list': consumable_list,
                                'RegistrationId' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None,
                                

                            }
                            completed_list.append(data_list)



            for idx, Theatre in enumerate(completed_list, start=1):
                            Theatre["Sno"] = idx 

            return JsonResponse(completed_list,safe=False)








            # pat_ins = Theatre_Booking_Request_Details.objects.filter(Status = 'Confirmed')
            # completed_list = []

            # for datas in pat_ins:

            #     formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
                
            #     formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')

            #     if datas.BookingType == 'OP':
            #            data_list = {

            #                 'Booking_Id':datas.Booking_Id,
            #                 'ReqDate':formatted_rdate,
            #                 'ReqTime':datas.ReqTime,
            #                 'BookingType':datas.BookingType,
            #                 'Specialization_name':datas.Specialization.Speciality_Name,
            #                 'Specializationid':datas.Specialization.Speciality_Id,
            #                 'SurgeryName':datas.SurgeryName.Surgery_Name,
            #                 'Surgeryid':datas.SurgeryName.Surgery_Id,
            #                 'TheatreName':datas.TheatreName.TheatreName,
            #                 'Theatreid':datas.TheatreName.Ot_Id,
            #                 'theatrerent' : int(datas.TheatreName.Rent),
            #                 'DoctorID':datas.DoctorName.Doctor_ID,
            #                 'DoctorName':datas.DoctorName.First_Name,
            #                 'BookingDate':datas.BookingDate,
            #                 'bookingdate':formatted_bdate,
            #                 'BookingTime':datas.BookingTime,
            #                 'Duration':int(datas.Duration),
            #                 'OperationType':datas.OperationType,
            #                 'Priority':datas.Priority,
            #                 'patientId': datas.OP_Registration_Id.PatientId.PatientId,
            #                 'PatientName':datas.OP_Registration_Id.PatientId.FirstName,
            #                 'Age':datas.OP_Registration_Id.PatientId.Age,
            #                 'Gender':datas.OP_Registration_Id.PatientId.Gender,
            #                 'UHIDNO':datas.OP_Registration_Id.PatientId.UniqueIdNo,
            #                 'Status':datas.Status,
            #                 'Reason' : datas.Reason,
            #                 'CreatedBy':datas.CreatedBy,
            #                 'opregid' : datas.OP_Registration_Id.id,
            #                 'RegistrationId' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                            

            #             }
            #            completed_list.append(data_list)
            #     elif  datas.BookingType == 'IP':
                
            #             data_list = {

            #                 'Booking_Id':datas.Booking_Id,
            #                 'ReqDate':formatted_rdate,
            #                 'ReqTime':datas.ReqTime,
            #                 'BookingType':datas.BookingType,
            #                 'Specialization_name':datas.Specialization.Speciality_Name,
            #                 'Specializationid':datas.Specialization.Speciality_Id,
            #                 'SurgeryName':datas.SurgeryName.Surgery_Name,
            #                 'Surgeryid':datas.SurgeryName.Surgery_Id,
            #                 'TheatreName':datas.TheatreName.TheatreName,
            #                 'Theatreid':datas.TheatreName.Ot_Id,
            #                 'theatrerent' : int(datas.TheatreName.Rent),
            #                 'DoctorID':datas.DoctorName.Doctor_ID,
            #                 'DoctorName':datas.DoctorName.First_Name,
            #                 'BookingDate':datas.BookingDate,
            #                 'bookingdate':formatted_bdate,
            #                 'BookingTime':datas.BookingTime,
            #                 'Duration':int(datas.Duration),
            #                 'OperationType':datas.OperationType,
            #                 'Priority':datas.Priority,
            #                 'patientId': datas.IP_Registration_Id.PatientId.PatientId,
            #                 'PatientName':datas.IP_Registration_Id.PatientId.FirstName,
            #                 'Age':datas.IP_Registration_Id.PatientId.Age,
            #                 'Gender':datas.IP_Registration_Id.PatientId.Gender,
            #                 'UHIDNO':datas.IP_Registration_Id.PatientId.UniqueIdNo,
            #                 'Status':datas.Status,
            #                 'Reason' : datas.Reason,
            #                 'CreatedBy':datas.CreatedBy,
                            
            #                 'RegistrationId' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                            

            #             }
            #             completed_list.append(data_list)
            #     elif  datas.BookingType == 'EMERGENCY':
                
            #             data_list = {

            #                 'Booking_Id':datas.Booking_Id,
            #                 'ReqDate':formatted_rdate,
            #                 'ReqTime':datas.ReqTime,
            #                 'BookingType':datas.BookingType,
            #                 'Specialization_name':datas.Specialization.Speciality_Name,
            #                 'Specializationid':datas.Specialization.Speciality_Id,
            #                 'SurgeryName':datas.SurgeryName.Surgery_Name,
            #                 'Surgeryid':datas.SurgeryName.Surgery_Id,
            #                 'TheatreName':datas.TheatreName.TheatreName,
            #                 'Theatreid':datas.TheatreName.Ot_Id,
            #                 'theatrerent' : int(datas.TheatreName.Rent),
            #                 'DoctorID':datas.DoctorName.Doctor_ID,
            #                 'DoctorName':datas.DoctorName.First_Name,
            #                 'BookingDate':datas.BookingDate,
            #                 'bookingdate':formatted_bdate,
            #                 'BookingTime':datas.BookingTime,
            #                 'Duration':int(datas.Duration),
            #                 'OperationType':datas.OperationType,
            #                 'Priority':datas.Priority,
            #                 'patientId': datas.EMR_Registration_Id.PatientId.PatientId,
            #                 'PatientName':datas.EMR_Registration_Id.PatientId.FirstName,
            #                 'Age':datas.EMR_Registration_Id.PatientId.Age,
            #                 'Gender':datas.EMR_Registration_Id.PatientId.Gender,
            #                 'UHIDNO':datas.EMR_Registration_Id.PatientId.UniqueIdNo,
            #                 'Status':datas.Status,
            #                 'Reason' : datas.Reason,
            #                 'CreatedBy':datas.CreatedBy,
                            
            #                 'RegistrationId' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None,
                            

            #             }
            #             completed_list.append(data_list)

            # for idx, Theatre in enumerate(completed_list, start=1):
            #             Theatre["Sno"] = idx 

            # return JsonResponse(completed_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def OTQueuelist_details(request):

    if request.method  == 'GET':

        try:

            opd_request_ins = OPD_OtRequest_Details.objects.all()
            Theatrerequest_list = []
            
            
            for datas in opd_request_ins:
                print(datas.Status)


                if datas.Status == True:
                
                    created_at = datas.created_at 
                    formatted_bdate = datas.SurgeryRequestedDate.strftime('%d-%m-%y')
                    formatted_date =  created_at.strftime('%d-%m-%y')
                    formatted_time = created_at.strftime('%H:%M:%S')
                    
                    data_list = {

                        'id' : datas.OtRequest_Id,
                        'BookingDate' : formatted_bdate,
                        'ReqDate' : formatted_date,
                        'ReqTime' : formatted_time,
                        'SurgeryName' : datas.SurgeryName.Surgery_Name,
                        'PatientId':datas.Patient_Id.PatientId,
                        'PatientName':datas.Patient_Id.FirstName,
                        'BookingType':'OP'

                    }
                    Theatrerequest_list.append(data_list)



            return JsonResponse(Theatrerequest_list,safe=False)
            






        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Theatre_booking_request_detail_by_Patient(request):
 
    if request.method == 'GET':
 
        try:
 
            RegistrationId = request.GET.get('RegistrationId', None)
           
 
            ip_request_ins = Theatre_Booking_Request_Details.objects.exclude(Status='Completed').filter(IP_Registration_Id=RegistrationId)
           
           
            iprequest_list = []
           
           
            for datas in ip_request_ins:
 
               
               
                created_at = datas.created_at
              #  formatted_bdate =
                formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
                formatted_time = created_at.strftime('%H:%M:%S')
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
               
                data_list = {
 
                    'Booking_Id':datas.Booking_Id,
                    'ReqDate':formatted_rdate,
                    'ReqTime':datas.ReqTime,
                    'BookingType':datas.BookingType,
                    'Specialization_name':datas.Specialization.Speciality_Name,
                    'Specializationid':datas.Specialization.Speciality_Id,
                    'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                    'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                    'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                    'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,

                    'TheatreName':datas.TheatreName.TheatreName,
                    'Theatreid':datas.TheatreName.Ot_Id,
                    'DoctorID':datas.DoctorName.Doctor_ID,
                    'DoctorName':datas.DoctorName.First_Name,
                    'BookingDate':datas.BookingDate,
                    'bookingdate':formatted_bdate,
                    'BookingTime':datas.BookingTime,
                    'Duration':datas.Duration,
                    'OperationType':datas.OperationType,
                    'Priority':datas.Priority,
                    'Patientid':datas.Patientid.PatientId,
                    'PatientName':datas.PatientName,
                    'Age':datas.Age,
                    'Gender':datas.Gender,
                    'UHIDNO':datas.Patientid.UniqueIdNo,
                    'Status':datas.Status,
                    'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                    'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                    'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None,
                    'CreatedBy':datas.CreatedBy
 
                }
                iprequest_list.append(data_list)
 
                for idx,request in enumerate(iprequest_list,start=1):
                     request['Sno'] = idx
 
            return JsonResponse(iprequest_list,safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def Theatre_booking_request_detail_For_Emg_Patient(request):
 
    if request.method == 'GET':
 
        try:
 
            RegistrationId = request.GET.get('RegistrationId', None)
           
 
            ip_request_ins = Theatre_Booking_Request_Details.objects.filter(EMR_Registration_Id=RegistrationId)
           
           
            iprequest_list = []
           
           
            for datas in ip_request_ins:
 
               
               
                created_at = datas.created_at
              #  formatted_bdate =
                formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
                formatted_time = created_at.strftime('%H:%M:%S')
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
               
                data_list = {
 
                    'Booking_Id':datas.Booking_Id,
                    'ReqDate':formatted_rdate,
                    'ReqTime':datas.ReqTime,
                    'BookingType':datas.BookingType,
                    'Specialization_name':datas.Specialization.Speciality_Name,
                    'Specializationid':datas.Specialization.Speciality_Id,
                    'SurgeryName':datas.SurgeryName.Surgery_Name if datas.SurgeryName else None,
                    'Surgeryid':datas.SurgeryName.Surgery_Id if datas.SurgeryName else None,
                    'ProcedureName':datas.ProcedureName.Procedure_Name if datas.ProcedureName else None,
                    'Procedureid':datas.ProcedureName.Procedure_Id if datas.ProcedureName else None,

                    'TheatreName':datas.TheatreName.TheatreName,
                    'Theatreid':datas.TheatreName.Ot_Id,
                    'DoctorID':datas.DoctorName.Doctor_ID,
                    'DoctorName':datas.DoctorName.First_Name,
                    'BookingDate':datas.BookingDate,
                    'bookingdate':formatted_bdate,
                    'BookingTime':datas.BookingTime,
                    'Duration':datas.Duration,
                    'OperationType':datas.OperationType,
                    'Priority':datas.Priority,
                    'Patientid':datas.Patientid.PatientId,
                    'PatientName':datas.PatientName,
                    'Age':datas.Age,
                    'Gender':datas.Gender,
                    'UHIDNO':datas.Patientid.UniqueIdNo,
                    'Status':datas.Status,
                    'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                    'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                    'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None,
                    'CreatedBy':datas.CreatedBy
 
                }
                iprequest_list.append(data_list)
 
                for idx,request in enumerate(iprequest_list,start=1):
                     request['Sno'] = idx
 
            return JsonResponse(iprequest_list,safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def Theatre_booking_request_Outside_details(request):

    if request.method == 'GET':

        try:

            Theatrerequest_list = []
            Theatre_ins = Theatre_Booking_Request_Details.objects.filter(BookingType='OutSide')
            
            for datas in Theatre_ins:

                formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')
                
                formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')

                data_list = {

                    'id':datas.id,
                    'ReqDate':formatted_rdate,
                    'ReqTime':datas.ReqTime,
                    'BookingType':datas.BookingType,
                    'Specialization_name':datas.Specialization.Speciality_Name,
                    'Specializationid':datas.Specialization.Speciality_Id,
                    'SurgeryName':datas.SurgeryName.Surgery_Name,
                    'Surgeryid':datas.SurgeryName.Surgery_Id,
                    'TheatreName':datas.TheatreName.TheatreName,
                    'Theatreid':datas.TheatreName.Ot_Id,
                    'DoctorID':datas.DoctorName.Doctor_ID,
                    'DoctorName':datas.DoctorName.First_Name,
                    'BookingDate':datas.BookingDate,
                    'bookingdate':formatted_bdate,
                    'BookingTime':datas.BookingTime,
                    'Duration':datas.Duration,
                    'OperationType':datas.OperationType,
                    'Priority':datas.Priority,
                    'Patientid':datas.Patientid,
                    'PatientName':datas.PatientName,
                    'Age':datas.Age,
                    'Gender':datas.Gender,
                    'UHIDNO':datas.UHIDNO,
                    'Status':datas.Status,
                    'CreatedBy':datas.CreatedBy
                }

                Theatrerequest_list.append(data_list)
                for idx, Theatre in enumerate(Theatrerequest_list, start=1):
                        Theatre["Sno"] = idx 
            return JsonResponse(Theatrerequest_list,safe=False)




        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_item_details_for_consumables(request):

    if request.method == 'GET':

        try:
            location = request.GET.get('location', None)
            item_ins = Stock_Maintance_Table_Detials.objects.filter(Store_location_id = location )
            item_list = []
            for datas in item_ins:
                data_list = {
                    'id' : datas.id,
                    'Batch' : datas.Batch_No,
                    'productid' : datas.Product_Detials.id,
                    'productname' : f"{datas.Product_Detials.ItemName} {datas.Product_Detials.Strength}",
                    
                }
                item_list.append(data_list)
            

            return JsonResponse(item_list,safe=False)

        except Exception as e:

            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
@csrf_exempt
@require_http_methods(["GET"])
def get_store_name_for_OT(request):

    if request.method == 'GET':

        try:
            store_ins =  Inventory_Location_Master_Detials.objects.filter(Status=1).exclude(Store_Name__in=['OTPHARMACY'])
            
            store_list = []
            for datas in store_ins:
                data_list = {
                    'id':datas.Store_Id,
                    'Storetype':datas.Store_Type,
                    'Storename':datas.Store_Name,
                   
                }
                store_list.append(data_list)

            return JsonResponse(store_list,safe=False)

        except Exception as e:

            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_Theatre_name_for_OT_Calendar(request):

    if request.method == 'GET':

        try:
            ot_ins = OtTheaterMaster_Detials.objects.all()  
            ot_list = []
            for datas in ot_ins:
                SpecialityID = ', '.join(str(Speciality.Speciality_Id) for Speciality in datas.Speciality.all())
                Specialitynames = ', '.join(Speciality.Speciality_Name for Speciality in datas.Speciality.all())
                
                data_list = {
                    'id':datas.Ot_Id,
                    'otname':f'{datas.TheatreName} ({Specialitynames})',   
                }
                ot_list.append(data_list)

            return JsonResponse(ot_list,safe=False)

        except Exception as e:

            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
def get_ot_availability(request):
    
    if request.method == 'GET':

        try:
            id = request.GET.get('id','')
            ot_avail_list = []
            print(id,'id')

            if id:
                Ot_avail_ins = OTTheatrecalendar.objects.filter(Theatre_id = id)
                
                for datas in Ot_avail_ins:
                    formatted_time = datetime.strptime(str(datas.time), "%H:%M:%S").strftime("%I:%M %p")
                    print(formatted_time)

                    time_obj = datetime.strptime(formatted_time, "%I:%M %p")
                    end_time_obj = time_obj + timedelta(hours=int(datas.booking.Duration))
                    etime = end_time_obj.strftime("%I:%M %p")

                    data_list = {

                        'id' : datas.id,
                        'bdate' : datas.date,
                        'stime' : formatted_time,
                        'etime' : etime,
                        'status' : datas.Status,
                        'Theatrename' : datas.Theatre.TheatreName,
                        'Theatreid' : datas.Theatre.Ot_Id,
                        'bookingid' : datas.booking.Booking_Id,
                        'bookingtype' : datas.booking.BookingType,
                        'priority' : datas.booking.Priority,
                        'operationtype' : datas.booking.OperationType,
                        'patientname' : datas.booking.PatientName,
                        'Duration' : datas.booking.Duration,
                    }
                    ot_avail_list.append(data_list)

                return JsonResponse(ot_avail_list,safe=False)
            
            else:

                 return JsonResponse(ot_avail_list,safe=False)

        except Exception as e:

            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
def get_ot_doctor_availability(request):
    
    if request.method == 'GET':
        
        try:
            
            docid = request.GET.get('docid','')
            desname = request.GET.get('desname','')
            ot_doc_list = []

            doclist = ['SURGEON','ANAESTHESIOLOGIST']
            emplist = ['NURSE','TECHNICIAN','HELPER']






            if desname in doclist:
                
                 Ot_avail_ins = OTDoctorcalendar.objects.filter(Doctorid_id = docid)
                
                 for datas in Ot_avail_ins:
                    formatted_time = datetime.strptime(str(datas.time), "%H:%M:%S").strftime("%I:%M %p")
                    print(formatted_time)

                    time_obj = datetime.strptime(formatted_time, "%I:%M %p")
                    end_time_obj = time_obj + timedelta(hours=int(datas.booking.Duration))
                    etime = end_time_obj.strftime("%I:%M %p")

                    data_list = {

                        'id' : datas.id,
                        'bdate' : datas.date,
                        'stime' : formatted_time,
                        'etime' : etime,
                        'status' : datas.Status,
                        'Theatrename' : datas.Theatre.TheatreName,
                        'Theatreid' : datas.Theatre.Ot_Id,
                        'bookingid' : datas.booking.Booking_Id,
                        'bookingtype' : datas.booking.BookingType,
                        'priority' : datas.booking.Priority,
                        'operationtype' : datas.booking.OperationType,
                        'patientname' : datas.booking.PatientName,
                        'doctorname' : datas.Doctorid.First_Name,
                    }
                    ot_doc_list.append(data_list)

                 return JsonResponse(ot_doc_list,safe=False)
            
            elif desname in emplist:
                
                 Ot_avail_ins = OTEmployeecalendar.objects.filter(employeeid_id = docid)
                
                 for datas in Ot_avail_ins:
                    formatted_time = datetime.strptime(str(datas.time), "%H:%M:%S").strftime("%I:%M %p")
                    print(formatted_time)

                    time_obj = datetime.strptime(formatted_time, "%I:%M %p")
                    end_time_obj = time_obj + timedelta(hours=int(datas.booking.Duration))
                    etime = end_time_obj.strftime("%I:%M %p")

                    data_list = {

                        'id' : datas.id,
                        'bdate' : datas.date,
                        'stime' : formatted_time,
                        'etime' : etime,
                        'status' : datas.Status,
                        'Theatrename' : datas.Theatre.TheatreName,
                        'Theatreid' : datas.Theatre.Ot_Id,
                        'bookingid' : datas.booking.Booking_Id,
                        'bookingtype' : datas.booking.BookingType,
                        'priority' : datas.booking.Priority,
                        'operationtype' : datas.booking.OperationType,
                        'patientname' : datas.booking.PatientName,
                        'doctorname' : datas.employeeid.First_Name,
                    }
                    ot_doc_list.append(data_list)

                 return JsonResponse(ot_doc_list,safe=False)
                









    
        except Exception as e:

            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Consumable_details(request):
 
    if request.method == 'POST':
 
        try:
 
 
            data = json.loads(request.body)
 
            print(data)
 
            quantity = data.get('quantity','')
            Patientid = data.get('Patientid','')
            created_by = data.get('created_by','')
            categoryid = data.get('categoryid','')
            subcategoryid = data.get('subcategoryid','')
            tostoreid = data.get('tostoreid','')
            itemid = data.get('itemid','')
            id = data.get('id','')
            RegistrationId = data.get('RegistrationId','')
            BookingType = data.get('BookingType','')
            
            Booking_Id = data.get('Booking_Id','')  
 
            op_reg_id_ins =None
            ip_reg_id_ins = None
            emg_reg_id_ins = None
           
 
 
            patient_ins = Patient_Detials.objects.get(pk=Patientid)
            category_ins = Product_Category_Product_Details.objects.get(pk=categoryid)
            subcategory_ins = SubCategory_Detailes.objects.get(pk=subcategoryid)
            store_ins = Inventory_Location_Master_Detials.objects.get(pk=tostoreid)
            item_ins = Stock_Maintance_Table_Detials.objects.get(pk=itemid)


            Booking_Id_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id) if Booking_Id else None

            if BookingType == 'OP':
 
             op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()  if RegistrationId else None
            ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId) .first() if RegistrationId else None
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first()  if RegistrationId else None
 
 
            consumable_ins = OTConsumable_Details(
 
                Category = category_ins,
                Subcategory = subcategory_ins,
                Store = store_ins,
                Product = item_ins,
                Patientid = patient_ins,
                Quantity = quantity,
                CreatedBy = created_by,
                BookingType = BookingType,
                OP_Registration_Id = op_reg_id_ins,
                IP_Registration_Id = ip_reg_id_ins,
                EMR_Registration_Id = emg_reg_id_ins,
                
                Booking_Id = Booking_Id_ins
 
            )
 
            consumable_ins.save()
 
            return JsonResponse({'success': 'consumable added successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
    if request.method == 'GET':
 
        try:
 
            RegistrationId = request.GET.get('RegistrationId', None)
            BookingType = request.GET.get('BookingType', None)
 
            if BookingType == "OP":
 
                con_ins = OTConsumable_Details.objects.filter(OP_Registration_Id = RegistrationId)
                consumable_list = []
                print(con_ins)
 
                for datas in con_ins:
                    data_list = {
 
                    'id' : datas.id,
                    'category' : datas.Category.id,
                    'Categoryname' : datas.Category.ProductCategory_Name,
                    'Subcategory' : datas.Subcategory.SubCategory_Id,
                    'Subcategoryname' : datas.Subcategory.SubCategoryName,
                    'ToStoreid' : datas.Store.Store_Id,
                    'ToStorename' : datas.Store.Store_Name,
                    'Productname' : f'{datas.Product.Product_Detials.ItemName} {datas.Product.Product_Detials.Strength}',
                    'productid' : datas.Product.Product_Detials.id,
                    'Batchno' : datas.Product.Batch_No,
                    'Quantity' : datas.Quantity,
                    'isEditing' : False,
                    'price' : datas.Product.Sellable_qty_price,
                    'checkboxes' : ['false' for i in range(int(datas.Quantity))],
                    'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                    'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                    'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None
                }
                    consumable_list.append(data_list)
 
            elif BookingType == "IP":
 
                con_ins = OTConsumable_Details.objects.filter(IP_Registration_Id = RegistrationId)
                consumable_list = []
                print(con_ins)
 
                for datas in con_ins:
                    data_list = {
 
                    'id' : datas.id,
                    'category' : datas.Category.id,
                    'Categoryname' : datas.Category.ProductCategory_Name,
                    'Subcategory' : datas.Subcategory.SubCategory_Id,
                    'Subcategoryname' : datas.Subcategory.SubCategoryName,
                    'ToStoreid' : datas.Store.Store_Id,
                    'ToStorename' : datas.Store.Store_Name,
                    'Productname' : f'{datas.Product.Product_Detials.ItemName} {datas.Product.Product_Detials.Strength}',
                    'productid' : datas.Product.Product_Detials.id,
                    'Batchno' : datas.Product.Batch_No,
                    'Quantity' : datas.Quantity,
                    'isEditing' : False,
                    'price' : datas.Product.Sellable_qty_price,
                    'checkboxes' : ['false' for i in range(int(datas.Quantity))],
                    'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                    'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                    'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None
 
 
                         }
                    consumable_list.append(data_list)
 
            elif BookingType == "EMERGENCY":
 
                con_ins = OTConsumable_Details.objects.filter(EMR_Registration_Id = RegistrationId)
                consumable_list = []
                print(con_ins)
 
                for datas in con_ins:
                    data_list = {
 
                    'id' : datas.id,
                    'category' : datas.Category.id,
                    'Categoryname' : datas.Category.ProductCategory_Name,
                    'Subcategory' : datas.Subcategory.SubCategory_Id,
                    'Subcategoryname' : datas.Subcategory.SubCategoryName,
                    'ToStoreid' : datas.Store.Store_Id,
                    'ToStorename' : datas.Store.Store_Name,
                    'Productname' : f'{datas.Product.Product_Detials.ItemName} {datas.Product.Product_Detials.Strength}',
                    'productid' : datas.Product.Product_Detials.id,
                    'Batchno' : datas.Product.Batch_No,
                    'Quantity' : datas.Quantity,
                    'isEditing' : False,
                    'price' : datas.Product.Sellable_qty_price,
                    'checkboxes' : ['false' for i in range(int(datas.Quantity))],
                    'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                    'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                    'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None
 
 
                }
                    consumable_list.append(data_list)
 
 
               
 
            return JsonResponse(consumable_list,safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Consignment_details(request):

    if request.method == 'POST':

        try:


            data = json.loads(request.body)

            print(data)

            consignment = data.get('consignment','')
            Patientid = data.get('Patientid','')
            quantity = data.get('quantity','')
            id = data.get('id','')
            created_by = data.get('created_by','')
            RegistrationId = data.get('RegistrationId','')
            BookingType = data.get('BookingType','')
            Booking_Id = data.get('Booking_Id','')  
            op_reg_id_ins = None
            ip_reg_id_ins = None
            emg_reg_id_ins = None
            
            Booking_Id_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id) if Booking_Id else None

            patient_ins = Patient_Detials.objects.get(pk=Patientid)
            if BookingType == 'OP':
                op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()  if RegistrationId else None
      
            ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId) .first() if RegistrationId else None
         
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first()  if RegistrationId else None

            
           
         

            

            consignment_ins = OTConsignment_Details(

                Consignment = consignment,
                Quantity = quantity,
                CreatedBy = created_by,
                Patientid = patient_ins,
                BookingType= BookingType,
                OP_Registration_Id = op_reg_id_ins,
                IP_Registration_Id = ip_reg_id_ins,
                EMR_Registration_Id = emg_reg_id_ins,
                
                Booking_Id = Booking_Id_ins
            )

            consignment_ins.save()

            return JsonResponse({'success': 'consignment added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    if request.method == 'GET':

        try:

            RegistrationId = request.GET.get('RegistrationId', None)
            BookingType = request.GET.get('BookingType', None)

            if BookingType == "OP":


                con_ins = OTConsignment_Details.objects.filter(OP_Registration_Id = RegistrationId)
                Consignment_list = []
                print(con_ins)

                for datas in con_ins:


                    data_list = {

                        'id' : datas.id,
                        'consignmentname' : datas.Consignment,
                        'quantity' : datas.Quantity,
                        'patientid' : datas.Patientid.PatientId,
                        'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                        'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                        'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None

                    }
                    Consignment_list.append(data_list)

            if BookingType == "IP":


                con_ins = OTConsignment_Details.objects.filter(IP_Registration_Id = RegistrationId)
                Consignment_list = []
                print(con_ins)

                for datas in con_ins:


                    data_list = {

                        'id' : datas.id,
                        'consignmentname' : datas.Consignment,
                        'quantity' : datas.Quantity,
                        'patientid' : datas.Patientid.PatientId,
                        'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                        'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                        'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None

                    }
                    Consignment_list.append(data_list)

            if BookingType == "EMERGENCY":


                con_ins = OTConsignment_Details.objects.filter(EMR_Registration_Id = RegistrationId)
                Consignment_list = []
                print(con_ins)

                for datas in con_ins:


                    data_list = {

                        'id' : datas.id,
                        'consignmentname' : datas.Consignment,
                        'quantity' : datas.Quantity,
                        'patientid' : datas.Patientid.PatientId,
                        'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                        'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                        'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None

                    }
                    Consignment_list.append(data_list)









            return JsonResponse(Consignment_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Equipment_details(request):

    if request.method == 'POST':

        try:


            data = json.loads(request.body)

            print(data)

            equipment = data.get('equipment','')
            Patientid = data.get('Patientid','')
            quantity = data.get('quantity','')
            id = data.get('id','')
            created_by = data.get('created_by','')
            RegistrationId = data.get('RegistrationId','')
            BookingType = data.get('BookingType','')
            Booking_Id = data.get('Booking_Id','')  
            op_reg_id_ins = None
            ip_reg_id_ins = None
            emg_reg_id_ins = None
            

            Booking_Id_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id) if Booking_Id else None
            patient_ins = Patient_Detials.objects.get(pk=Patientid)
            if BookingType == 'OP':
                op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()  if RegistrationId else None
            ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId) .first() if RegistrationId else None
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first()  if RegistrationId else None


            equipment_ins = OTEquipment_Details(

                Equipment = equipment,
                Quantity = quantity,
                CreatedBy = created_by,
                Patientid = patient_ins,
                BookingType = BookingType,
                OP_Registration_Id = op_reg_id_ins,
                IP_Registration_Id = ip_reg_id_ins,
                EMR_Registration_Id = emg_reg_id_ins,
                Booking_Id = Booking_Id_ins
           
            )

            equipment_ins.save()

            return JsonResponse({'success': 'Equipment added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    if request.method == 'GET':

        try:

            RegistrationId = request.GET.get('RegistrationId', None)
            BookingType = request.GET.get('BookingType', None)

            if BookingType == 'OP':

                con_ins = OTEquipment_Details.objects.filter(OP_Registration_Id = RegistrationId)
                Consignment_list = []
                print(con_ins)

                for datas in con_ins:


                    data_list = {

                        'id' : datas.id,
                        'equipmentname' : datas.Equipment,
                        'quantity' : datas.Quantity,
                        'patientid' : datas.Patientid.PatientId,
                        'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                        'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                        'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None

                    }
                    Consignment_list.append(data_list)

            if BookingType == 'IP':

                con_ins = OTEquipment_Details.objects.filter(IP_Registration_Id = RegistrationId)
                Consignment_list = []
                print(con_ins)

                for datas in con_ins:


                    data_list = {

                        'id' : datas.id,
                        'equipmentname' : datas.Equipment,
                        'quantity' : datas.Quantity,
                        'patientid' : datas.Patientid.PatientId,
                        'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                        'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                        'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None

                    }
                    Consignment_list.append(data_list)

            if BookingType == 'EMERGENCY':

                con_ins = OTEquipment_Details.objects.filter(EMR_Registration_Id = RegistrationId)
                Consignment_list = []
                print(con_ins)

                for datas in con_ins:


                    data_list = {

                        'id' : datas.id,
                        'equipmentname' : datas.Equipment,
                        'quantity' : datas.Quantity,
                        'patientid' : datas.Patientid.PatientId,
                        'OP_Registration_Id' : datas.OP_Registration_Id.Registration_Id if datas.OP_Registration_Id else None,
                        'IP_Registration_Id' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                        'EMR_Registration_Id' : datas.EMR_Registration_Id.Registration_Id if datas.EMR_Registration_Id else None

                    }
                    Consignment_list.append(data_list)




            return JsonResponse(Consignment_list,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Surgical_Team_details(request):
    

    if request.method == 'POST':

        try:
            data = json.loads(request.body)
            # print(data)
            id = data.get('id','')
            surgeonId = data.get('surgeon','')
           # surgeonId = surgeon.split(', ') if surgeon else None  
            assistantSurgeonId = data.get('assistantSurgeon','')
           # assistantSurgeonId = assistantSurgeon.split(', ') if assistantSurgeon else None
            anaesthesiologistId = data.get('anaesthesiologist','')
           # anaesthesiologistId = anaesthesiologist.split(', ') if anaesthesiologist else None
            scrubNurseId = data.get('scrubNurse','')
           # scrubNurseId = scrubNurse.split(', ') if scrubNurse else None
            technicianId = data.get('technician','')
           # technicianId = technician.split(', ') if technician else None
            circulatingNurseId = data.get('circulatingNurse','')
           # circulatingNurseId = circulatingNurse.split(', ') if circulatingNurse else None
            othersId = data.get('others','')
           # othersId = others.split(', ') if others else None
            created_by = data.get('created_by','')
            Patientid = data.get('Patientid','')
            RegistrationId = data.get('RegistrationId','')
            BookingType = data.get('BookingType','')
            BookingDate = data.get('BookingDate','')
            BookingTime = data.get('BookingTime','')
            Booking_Id = data.get('Booking_Id','')
            Theatreid = data.get('Theatreid','')

            print(surgeonId,'surgeonIdddddddddddd')
            print(assistantSurgeonId,'assistantSurgeonIdIdddddddddddd')
            print(anaesthesiologistId,'anaesthesiologistIdIdddddddddddd')
            print(scrubNurseId,'scrubNurseIdIdddddddddddd')
            print(technicianId,'technicianIdIdddddddddddd')
            print(circulatingNurseId,'circulatingNurseIdIdddddddddddd')





            


            try:

                surgeon_ins = None
                assistantSurgeon_ins = None
                anaesthesiologist_ins = None
                scrubNurse_ins = None
                technician_ins = None
                circulatingNurse_ins = None
                others_ins = None
                op_reg_id_ins = None
                ip_reg_id_ins = None
                emg_reg_id_ins = None
                theatre_ins = None
                booking_ins = None

                surgeon_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID__in = surgeonId)
                assistantSurgeon_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID__in = assistantSurgeonId)
                anaesthesiologist_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID__in=anaesthesiologistId)
                scrubNurse_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID__in = scrubNurseId)
                technician_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID__in = technicianId)
                circulatingNurse_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID__in = circulatingNurseId)
                others_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID__in = othersId)
                Patient_ins = Patient_Detials.objects.get(pk=Patientid)
                Booking_Id_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id=Booking_Id) if Booking_Id else None
                
                
                if BookingType == 'OP':
                    op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()  if RegistrationId else None
                ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first()  if RegistrationId else None
                emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first()  if RegistrationId else None




                

            except (Doctor_Personal_Form_Detials.DoesNotExist, Employee_Personal_Form_Detials.DoesNotExist):
                return JsonResponse({'error': 'Invalid Doctor or Employee'})

            if id:

                print('insise edit')

                crew_ins = Surgical_Team_Details.objects.get(pk=id)

                crew_ins.CreatedBy = created_by
                crew_ins.save()

                crew_ins.Surgeon.set(surgeon_ins)
                crew_ins.Assistant_Surgeon.set(assistantSurgeon_ins)
                crew_ins.Anaesthesiologist.set(anaesthesiologist_ins)
                crew_ins.Scrub_Nurse.set(scrubNurse_ins)
                crew_ins.Circulating_Nurse.set(circulatingNurse_ins)
                crew_ins.Helper.set(others_ins)

                print(crew_ins.Surgeon.all(),'crew_ins.Surgeon')
                print(crew_ins.Assistant_Surgeon.all(),'crew_ins.Assistant_Surgeon')

                # for S in crew_ins.Surgeon.all():

                #     print(S,'mnmbkhgukhkj')

                # return None

                for datas in surgeonId:

                    print(datas,'id11111111111')
                    
                    sur_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = datas).first()
                    theatre_ins = OtTheaterMaster_Detials.objects.get(pk=Theatreid) if Theatreid else None
                    booking_ins = Theatre_Booking_Request_Details.objects.get(pk=Booking_Id) if Booking_Id else None

                    if sur_ins:

                        doct_list_set = set(OTDoctorcalendar.objects.filter(booking=Booking_Id,DoctorType='SENIORSURGEON').values_list('Doctorid', flat=True))
                        print(doct_list_set,'doct_list_set')

                        for doc in  doct_list_set:

                            print(doc,'doccccccccccccc')

                            # desins = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID=doc).first()

                            # print(desins.Doctor_ID.Doctor_ID  not in surgeonId,'12345')
                            # print(desins.Category.Category_Name,'12345')
                        
                            # if desins.Doctor_ID.Doctor_ID  not in surgeonId and desins.Category.Category_Name == "SURGEON":
                            if doc not in surgeonId:
                                print('inside condition')

                                deletedata = OTDoctorcalendar.objects.filter(booking=Booking_Id,Doctorid=doc)
                                deletedata.delete()

                        existsdata = OTDoctorcalendar.objects.filter(date=BookingDate,time=BookingTime,Doctorid=sur_ins).first()

                        if existsdata:

                            continue

                        doc_ins = OTDoctorcalendar(

                            Theatre = theatre_ins,
                            booking = booking_ins,
                            date = BookingDate,
                            time = BookingTime,
                            Doctorid = sur_ins
                        )

                        doc_ins.save()

                for datas in assistantSurgeonId:

                        print(datas)
                        sur_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = datas).first()

                        if sur_ins:
                            doct_list_set = set(OTDoctorcalendar.objects.filter(booking=Booking_Id,DoctorType='JUNIORSURGEON').values_list('Doctorid', flat=True))

                            for doc in  doct_list_set:

                                # desins = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID=doc).first()
                        
                                if doc  not in assistantSurgeonId:

                                    deletedata = OTDoctorcalendar.objects.filter(booking=Booking_Id,Doctorid=doc)
                                    deletedata.delete()

                            existsdata = OTDoctorcalendar.objects.filter(date=BookingDate,time=BookingTime,Doctorid=sur_ins).first()

                            if existsdata:

                                continue

                            doc_ins = OTDoctorcalendar(

                                Theatre = theatre_ins,
                                booking = booking_ins,
                                date = BookingDate,
                                time = BookingTime,
                                Doctorid = sur_ins
                            )

                            doc_ins.save()

                for datas in anaesthesiologistId:

                        print(datas)
                        sur_ins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = datas).first()

                        if sur_ins:

                            doct_list_set = set(OTDoctorcalendar.objects.filter(booking=Booking_Id).values_list('Doctorid', flat=True))

                            for doc in  doct_list_set:

                                desins = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID=doc).first()
                       
                                if desins.Doctor_ID.Doctor_ID  not in anaesthesiologistId and desins.Specialization.Speciality_Name == "ANAESTHESIOLOGIST":

                                    deletedata = OTDoctorcalendar.objects.filter(booking=Booking_Id,Doctorid=desins.Doctor_ID.Doctor_ID)
                                    deletedata.delete()

                            existsdata = OTDoctorcalendar.objects.filter(date=BookingDate,time=BookingTime,Doctorid=sur_ins).first()

                            if existsdata:

                                continue

                    
                            doc_ins = OTDoctorcalendar(

                                Theatre = theatre_ins,
                                booking = booking_ins,
                                date = BookingDate,
                                time = BookingTime,
                                Doctorid = sur_ins
                            )

                            doc_ins.save()

                for datas in scrubNurseId:

                        print(datas)
                        sur_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID = datas).first()

                        if sur_ins:

                            emp_list_set = set(OTEmployeecalendar.objects.filter(booking=Booking_Id,EmployeeType='SCRUBNURSE').values_list('employeeid', flat=True))

                            for doc in  emp_list_set:

                                # desins = Employee_Personal_Form_Detials.objects.filter(Employee_ID=doc).first()
                        
                                if doc not in scrubNurseId:

                                    deletedata = OTEmployeecalendar.objects.filter(booking=Booking_Id,employeeid=doc)
                                    deletedata.delete()

                            existsdata = OTEmployeecalendar.objects.filter(date=BookingDate,time=BookingTime,employeeid=sur_ins).first()

                            if existsdata:

                                continue

                            

                            doc_ins = OTEmployeecalendar(

                                Theatre = theatre_ins,
                                booking = booking_ins,
                                date = BookingDate,
                                time = BookingTime,
                                employeeid = sur_ins
                            )

                            doc_ins.save()
                              
                for datas in technicianId:

                        print(datas)

                        sur_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID = datas).first()

                        if sur_ins:

                            emp_list_set = set(OTEmployeecalendar.objects.filter(booking=Booking_Id).values_list('employeeid', flat=True))
                            for doc in  emp_list_set:

                                desins = Employee_Personal_Form_Detials.objects.filter(Employee_ID=doc).first()
                        
                                if desins.Employee_ID  not in technicianId and desins.Category.Category_Name == "TECHNICIAN":

                                    deletedata = OTEmployeecalendar.objects.filter(booking=Booking_Id,employeeid=desins.Employee_ID)
                                    deletedata.delete()

                            existsdata = OTEmployeecalendar.objects.filter(date=BookingDate,time=BookingTime,employeeid=sur_ins).first()

                            if existsdata:

                                continue

                            doc_ins = OTEmployeecalendar(

                                Theatre = theatre_ins,
                                booking = booking_ins,
                                date = BookingDate,
                                time = BookingTime,
                                employeeid = sur_ins
                            )

                            doc_ins.save()
                            
                for datas in circulatingNurseId:

                        print(datas)

                        sur_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID = datas).first()

                        if sur_ins:

                            emp_list_set = set(OTEmployeecalendar.objects.filter(booking=Booking_Id,EmployeeType='CIRCULATINGNURSE').values_list('employeeid', flat=True))
                        
                            for doc in  emp_list_set:

                        
                                # desins = Employee_Personal_Form_Detials.objects.filter(Employee_ID=doc).first()
                        
                                if doc  not in circulatingNurseId:

                                    deletedata = OTEmployeecalendar.objects.filter(booking=Booking_Id,employeeid=doc)
                                    deletedata.delete()

                            existsdata = OTEmployeecalendar.objects.filter(date=BookingDate,time=BookingTime,employeeid=sur_ins).first()

                            if existsdata:

                                continue

                            doc_ins = OTEmployeecalendar(

                                Theatre = theatre_ins,
                                booking = booking_ins,
                                date = BookingDate,
                                time = BookingTime,
                                employeeid = sur_ins
                            )

                            doc_ins.save()
                          
                for datas in othersId:

                        print(datas)

                        sur_ins = Employee_Personal_Form_Detials.objects.filter(Employee_ID = datas).first()

                        if sur_ins:

                            emp_list_set = set(OTEmployeecalendar.objects.filter(booking=Booking_Id).values_list('employeeid', flat=True))

                            for doc in  emp_list_set:

                                desins = Employee_Personal_Form_Detials.objects.filter(Employee_ID=doc).first()

                        
                                if desins.Employee_ID  not in othersId and desins.Designation.Designation_Name == "OTHERS":
 

                                    deletedata = OTEmployeecalendar.objects.filter(booking=Booking_Id,employeeid=desins.Employee_ID)
                                    deletedata.delete()

                            existsdata = OTEmployeecalendar.objects.filter(date=BookingDate,time=BookingTime,employeeid=sur_ins).first()

                            if existsdata:

                                continue

                            doc_ins = OTEmployeecalendar(

                                Theatre = theatre_ins,
                                booking = booking_ins,
                                date = BookingDate,
                                time = BookingTime,
                                employeeid = sur_ins
                            )

                            doc_ins.save()
                
            
                
            

                return JsonResponse({'success': 'CREW Updated Successfully'})

            Crew_ins = Surgical_Team_Details.objects.create(

                    Patientid = Patient_ins,
                    OP_Registration_Id = op_reg_id_ins,
                    IP_Registration_Id = ip_reg_id_ins,
                    EMR_Registration_Id = emg_reg_id_ins,
                    BookingType = BookingType,
                    CreatedBy = created_by,
                    Booking_Id =  Booking_Id_ins
                    )


            try:
                if surgeon_ins.exists() :   
                    Crew_ins.Surgeon.set(surgeon_ins) 
            except Exception as e:
                print(f"An error occurred: {str(e)}")

            try:
                if assistantSurgeon_ins.exists():
                    Crew_ins.Assistant_Surgeon.set(assistantSurgeon_ins) 
            except Exception as e:
                print(f"An error occurred: {str(e)}")
            try:
                if anaesthesiologist_ins.exists():
                    Crew_ins.Anaesthesiologist.set(anaesthesiologist_ins)
            except Exception as e:
                print(f"An error occurred: {str(e)}")

            try:
                if scrubNurse_ins.exists():
                    Crew_ins.Scrub_Nurse.set(scrubNurse_ins)
            except Exception as e:
                print(f"An error occurred: {str(e)}")

            try:
                if technician_ins.exists():
                    Crew_ins.Technician.set(technician_ins)
            except Exception as e:
                print(f"An error occurred: {str(e)}")

            try:
                if circulatingNurse_ins.exists():
                    Crew_ins.Circulating_Nurse.set(circulatingNurse_ins)
            except Exception as e:
                print(f"An error occurred: {str(e)}")

            try:
                if others_ins.exists():
                    Crew_ins.Helper.set(others_ins)
            except Exception as e:
                print(f"An error occurred: {str(e)}")

            for datas in surgeonId:
                    
                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)
                    theatre_ins = OtTheaterMaster_Detials.objects.get(pk=Theatreid) if Theatreid else None
                    booking_ins = Theatre_Booking_Request_Details.objects.get(pk=Booking_Id) if Booking_Id else None

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        Doctorid = sur_ins,
                        DoctorType = 'SENIORSURGEON'
                    )

                    doc_ins.save()

            for datas in assistantSurgeonId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        Doctorid = sur_ins,
                        DoctorType = 'JUNIORSURGEON'

                    )

                    doc_ins.save()

            for datas in anaesthesiologistId:

                    print(datas)

                    sur_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID = datas)

                    doc_ins = OTDoctorcalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        Doctorid = sur_ins
                    )

                    doc_ins.save()

            for datas in scrubNurseId:

                    print(datas)

                    sur_ins = Employee_Personal_Form_Detials.objects.get(Employee_ID = datas)

                    doc_ins = OTEmployeecalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        employeeid = sur_ins,
                        EmployeeType = 'SCRUBNURSE'
                    )

                    doc_ins.save()
               
            for datas in technicianId:

                    print(datas)

                    sur_ins = Employee_Personal_Form_Detials.objects.get(Employee_ID = datas)

                    doc_ins = OTEmployeecalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        employeeid = sur_ins,
                       
                    )

                    doc_ins.save()
               
            for datas in circulatingNurseId:

                    print(datas)

                    sur_ins = Employee_Personal_Form_Detials.objects.get(Employee_ID = datas)

                    doc_ins = OTEmployeecalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        employeeid = sur_ins,
                        EmployeeType = 'CIRCULATINGNURSE'
                       
                    )

                    doc_ins.save()
               
            for datas in othersId:

                    print(datas)

                    sur_ins = Employee_Personal_Form_Detials.objects.get(Employee_ID = datas)

                    doc_ins = OTEmployeecalendar(

                        Theatre = theatre_ins,
                        booking = booking_ins,
                        date = BookingDate,
                        time = BookingTime,
                        employeeid = sur_ins
                    )

                    doc_ins.save()
               
        


            return JsonResponse({'success': 'CREW Added Successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    if request.method == 'GET':

        try:

         RegistrationId = request.GET.get('RegistrationId', None)
         BookingType = request.GET.get('BookingType', None)

         print(RegistrationId,'RegistrationId')
         print(BookingType,'BookingType')

         if BookingType == "OP":
         
            crew_ins = Surgical_Team_Details.objects.get(OP_Registration_Id=RegistrationId)
            
            crew_list = []
            surgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Surgeon.all())
            # surgeon = ', '.join(str(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""") for Surgeon in crew_ins.Surgeon.all())
            surgeon = ', '.join(f"{surgeon.Tittle.Title_Name}.{surgeon.First_Name}{surgeon.Middle_Name}{surgeon.Last_Name}" for surgeon in crew_ins.Surgeon.all())


            assistantSurgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Assistant_Surgeon.all())
            assistantSurgeon = ', '.join(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name}{Surgeon.Middle_Name}{Surgeon.Last_Name}""" for Surgeon in crew_ins.Assistant_Surgeon.all())

            anaesthesiologistId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Anaesthesiologist.all())
            anaesthesiologist = ', '.join(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name}{Surgeon.Middle_Name}{Surgeon.Last_Name}""" for Surgeon in crew_ins.Anaesthesiologist.all())

            scrubNurseId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Scrub_Nurse.all())
            scrubNurse = ', '.join(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Scrub_Nurse.all())

            circulatingNurseId= ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Circulating_Nurse.all())
            circulatingNurse= ', '.join(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Circulating_Nurse.all())

            technicianId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Technician.all())
            technician = ', '.join(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Technician.all())

            othersId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Helper.all())
            others = ', '.join(f"""{surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Helper.all())

            Crew_dict = {
                'id': crew_ins.id,
                'surgeonId' : surgeonId,
                'surgeon' : surgeon,
                'assistantSurgeonId' : assistantSurgeonId,
                'assistantSurgeon' : assistantSurgeon,
                'anaesthesiologistId' : anaesthesiologistId,
                'anaesthesiologist' : anaesthesiologist,
                'scrubNurseId' : scrubNurseId,
                'scrubNurse' : scrubNurse,
                'circulatingNurseId' : circulatingNurseId,
                'circulatingNurse' : circulatingNurse,
                'technicianId' : technicianId,
                'technician' : technician,
                'othersId' : othersId,
                'others' : others,
                'patientid' : crew_ins.Patientid.PatientId,
                'OP_Registration_Id' : crew_ins.OP_Registration_Id.Registration_Id if crew_ins.OP_Registration_Id else None,
                'IP_Registration_Id' : crew_ins.IP_Registration_Id.Registration_Id if crew_ins.IP_Registration_Id else None,
                'EMR_Registration_Id' : crew_ins.EMR_Registration_Id.Registration_Id if crew_ins.EMR_Registration_Id else None
                

            }
            crew_list.append(Crew_dict)

         if BookingType == "IP":
         
            crew_ins = Surgical_Team_Details.objects.get(IP_Registration_Id=RegistrationId)

            print(crew_ins,'crew_inspremmmm')
            
            crew_list = []
            surgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Surgeon.all())
            print(surgeonId)
            surgeon = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name}{Surgeon.Middle_Name or ''}{Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Surgeon.all()) 
            print(surgeon)
            assistantSurgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Assistant_Surgeon.all())
            assistantSurgeon = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name}{Surgeon.Middle_Name or ''}{Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Assistant_Surgeon.all())
            anaesthesiologistId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Anaesthesiologist.all())
            anaesthesiologist = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name}{Surgeon.Middle_Name or ''}{Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Anaesthesiologist.all())
            scrubNurseId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Scrub_Nurse.all())
            scrubNurse = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name or ''} {Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Scrub_Nurse.all())
            circulatingNurseId= ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Circulating_Nurse.all())
            circulatingNurse = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name or ''} {Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Circulating_Nurse.all())
            technicianId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Technician.all())
            technician = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name or ''} {Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Technician.all())
            othersId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Helper.all())
            others = ', '.join(f"{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name or ''} {Surgeon.Last_Name or ''}" for Surgeon in crew_ins.Helper.all())
            Crew_dict = {
                'id': crew_ins.id,
                'surgeonId' : surgeonId,
                'surgeon' : surgeon,
                'assistantSurgeonId' : assistantSurgeonId,
                'assistantSurgeon' : assistantSurgeon,
                'anaesthesiologistId' : anaesthesiologistId,
                'anaesthesiologist' : anaesthesiologist,
                'scrubNurseId' : scrubNurseId,
                'scrubNurse' : scrubNurse,
                'circulatingNurseId' : circulatingNurseId,
                'circulatingNurse' : circulatingNurse,
                'technicianId' : technicianId,
                'technician' : technician,
                'othersId' : othersId,
                'others' : others,
                'patientid' : crew_ins.Patientid.PatientId,
                'OP_Registration_Id' : crew_ins.OP_Registration_Id.Registration_Id if crew_ins.OP_Registration_Id else None,
                'IP_Registration_Id' : crew_ins.IP_Registration_Id.Registration_Id if crew_ins.IP_Registration_Id else None,
                'EMR_Registration_Id' : crew_ins.EMR_Registration_Id.Registration_Id if crew_ins.EMR_Registration_Id else None
                

            }
            crew_list.append(Crew_dict)

         if BookingType == "EMERGENCY":
         
            crew_ins = Surgical_Team_Details.objects.get(EMR_Registration_Id=RegistrationId)

            print(crew_ins,'crew_ins')
            
            crew_list = []
            surgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Surgeon.all())
            surgeon = ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Surgeon.all())

            assistantSurgeonId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Assistant_Surgeon.all())
            assistantSurgeon = ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Assistant_Surgeon.all())

            anaesthesiologistId = ', '.join(str(Surgeon.Doctor_ID) for Surgeon in crew_ins.Anaesthesiologist.all())
            anaesthesiologist = ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Anaesthesiologist.all())

            scrubNurseId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Scrub_Nurse.all())
            scrubNurse = ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Scrub_Nurse.all())

            circulatingNurseId= ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Circulating_Nurse.all())
            circulatingNurse= ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Circulating_Nurse.all())

            technicianId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Technician.all())
            technician = ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Technician.all())

            othersId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Helper.all())
            others = ', '.join(f"""{Surgeon.Tittle.Title_Name}.{Surgeon.First_Name} {Surgeon.Middle_Name} {Surgeon.Last_Name}""" for Surgeon in crew_ins.Helper.all())

            Crew_dict = {
                'id': crew_ins.id,
                'surgeonId' : surgeonId,
                'surgeon' : surgeon,
                'assistantSurgeonId' : assistantSurgeonId,
                'assistantSurgeon' : assistantSurgeon,
                'anaesthesiologistId' : anaesthesiologistId,
                'anaesthesiologist' : anaesthesiologist,
                'scrubNurseId' : scrubNurseId,
                'scrubNurse' : scrubNurse,
                'circulatingNurseId' : circulatingNurseId,
                'circulatingNurse' : circulatingNurse,
                'technicianId' : technicianId,
                'technician' : technician,
                'othersId' : othersId,
                'others' : others,
                'patientid' : crew_ins.Patientid.PatientId,
                'OP_Registration_Id' : crew_ins.OP_Registration_Id.Registration_Id if crew_ins.OP_Registration_Id else None,
                'IP_Registration_Id' : crew_ins.IP_Registration_Id.Registration_Id if crew_ins.IP_Registration_Id else None,
                'EMR_Registration_Id' : crew_ins.EMR_Registration_Id.Registration_Id if crew_ins.EMR_Registration_Id else None
                

            }
            crew_list.append(Crew_dict)



         return JsonResponse(crew_list,safe=False)


        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def get_Ward_details_by_floor_for_ot(request):
    try:
        if request.method == 'GET':
            Floor = request.GET.get('Floor')
            
            Ward_ins = WardType_Master_Detials.objects.filter(Floor_Name_id=Floor).exclude(Ward_Name="GENERAL")
            
            bed_details = []
            for datas in Ward_ins:

                print(datas.Ward_Name,'wardname')
                if datas.Ward_Name not in ["ICU", "CASUALITY"]:
                    continue
                
                rooms = Room_Master_Detials.objects.filter(Ward_Name_id=datas.Ward_Id)
                unique_rooms = {}
                
                for room in rooms:
                    room_no = room.Room_No
                    if room_no not in unique_rooms:
                        unique_rooms[room_no] = {
                            "RoomNo": room_no,
                            "Beds": []
                        }
                    unique_rooms[room_no]["Beds"].append({
                        "BedId": room.Room_Id,
                        "BedNo": room.Bed_No,
                        "status": room.Booking_Status
                    })
                
                ward_data = {
                    'WardId': datas.Ward_Id,
                    'WardName': datas.Ward_Name,
                    "Rooms": list(unique_rooms.values())
                }
                bed_details.append(ward_data)
            
            return JsonResponse(bed_details, safe=False)
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def OT_Billing_details(request):

    if request.method == 'POST':
        try:
            # Parse the request body
            data_list = json.loads(request.body)
            
            print(data_list)

            # Extract RegistrationId and other metadata
            RegistrationId = data_list.get('RegistrationId', '')
            BookingType = data_list.get('BookingType', '')
            created_by = data_list.get('Created_by', '')

            print(RegistrationId, BookingType, 'RegistrationId')

            # Validate RegistrationId
            if not RegistrationId:
                return JsonResponse({"error": "RegistrationId is required"}, status=400)

            # Get related registration details
            op_reg_id_ins = None
            ip_reg_id_ins = None
            emg_reg_id_ins = None

            if BookingType == 'OP':
                op_reg_id_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first()
            
            ip_reg_id_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
            emg_reg_id_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()

            entries = []
            
            # Filter out non-numeric keys to get only the service entries
            ot_charges = []
            for key, value in data_list.items():
                if key not in ["RegistrationId", "BookingType", "Created_by"] and isinstance(value, dict):
                    ot_charges.append(value)
            
            # Process each service entry
            for data in ot_charges:
                service_name = data.get("serviceName", "")
                name = data.get("units", "")
                per_hr_unit_cost = data.get("perHourCost", "")
                quantity = data.get("quantity", "")
                amount = data.get("amount", "")
              
                ot_billing = OT_Billing(
                    Service_name=service_name,
                    Name=name,
                    Per_hr_unit_cost=per_hr_unit_cost,
                    Quantity=quantity,
                    Amount=amount,
                    OP_Registration_Id=op_reg_id_ins,
                    IP_Registration_Id=ip_reg_id_ins,
                    EMR_Registration_Id=emg_reg_id_ins,
                    CreatedBy=created_by
                )
                entries.append(ot_billing)

            # Bulk insert the entries
            OT_Billing.objects.bulk_create(entries)

            return JsonResponse({"success": "Data saved successfully"})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'},status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Confirmation_by_doctor(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            print(data,'data')

            isChecked = data.get('isChecked','')
            Booking_Id = data.get('Booking_Id','')

            change_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id = Booking_Id)
            change_ins.DoctorConfirm = isChecked
            change_ins.save()

            return JsonResponse({"message": "Crew,Instruments and consumables are confirmed by doctor successfully"})



        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def delete_consignment(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data)
            id = data.get('id','')

            print(data)

            delete_consignment = OTConsignment_Details.objects.get(pk=id)
            delete_consignment.delete()

            return JsonResponse({"success": "Data removed successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def delete_equipment(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data)
            id = data.get('id','')

            print(data)

            delete_consignment = OTEquipment_Details.objects.get(pk=id)
            delete_consignment.delete()

            return JsonResponse({"success": "Data removed successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Confirmation_by_nurse(request):
 
    if request.method == "POST":
 
        try:
 
            data = json.loads(request.body)
 
            print(data,'data')
 
            isChecked = data.get('isChecked','')
            Booking_Id = data.get('Booking_Id','')
            WheelInTime = data.get('WheelInTime','')
            WheelOutTime = data.get('WheelOutTime','')
            DoctorInTime = data.get('DoctorInTime','')
            ProcedureStartTime = data.get('ProcedureStartTime','')
            ProcedureendTime = data.get('ProcedureendTime','')
 
 
            change_ins = Theatre_Booking_Request_Details.objects.get(Booking_Id = Booking_Id)
            print(change_ins,'change_ins')
            change_ins.Status = 'Completed'
            change_ins.WheelInTime = WheelInTime
            change_ins.WheelOutTime = WheelOutTime
            change_ins.DoctorInTime = DoctorInTime
            change_ins.ProcedureStartTime = ProcedureStartTime
            change_ins.ProcedureendTime = ProcedureendTime
 
            change_ins.save()
 
            return JsonResponse({"Success": "Operation Completed Successfully"})
 
 
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
@csrf_exempt
def room_filter_by_floor(request):
 
    if request.method == 'GET':
        try:
            floorid = request.GET.get('Floor')
 
            available_beds = Room_Master_Detials.objects.filter(
                Floor_Name__Floor_Id=floorid,
                Booking_Status='Available'
            )
 
            room_dict = defaultdict(lambda: {'Ward_Name': '', 'beds': []})
 
            for datas in available_beds:
                room_no = datas.Ward_Name.RoomNo  # You might need to adjust this based on your model
                ward_name = datas.Ward_Name.Ward_Name.Ward_Name  # Adjust based on your model structure
 
                room_dict[room_no]['Ward_Name'] = ward_name
                room_dict[room_no]['beds'].append(datas.Bed_No)
 
            # Convert dict to list of dicts with RoomNo included
            bedlist = [
                {
                    'RoomNo': room_no,
                    'Ward_Name': values['Ward_Name'],
                    'beds': values['beds']
                }
                for room_no, values in room_dict.items()
            ]
 
            return JsonResponse(bedlist, safe=False)
 
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def Procedurename_Speciality_link(request):
#     if request.method == 'GET':
#         try:
#             speciality_name = request.GET.get('Speciality', None)
            
#             if not speciality_name:
#                 return JsonResponse({'warn': 'Missing Speciality'})

#             # Assuming Speciality_Id is the primary key or you're filtering by it
#             speciality_obj = Speciality_Detials.objects.filter(Speciality_Id=speciality_name).first()

#             if not speciality_obj:
#                 return JsonResponse({'warn': 'Speciality not found'})

#             # Filter SurgeryName_Details based on the matched Speciality
#             procedure_names = Procedure_Master_Details.objects.filter(Speciality=speciality_obj, Status=True).values('Procedure_Id', 'Procedure_Name')

#             if procedure_names.exists():
#                 return JsonResponse(list(procedure_names), safe=False)
#             else:
#                 return JsonResponse({'warn': 'No procedures found for the given speciality'})

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Procedurename_Speciality_link(request):
    if request.method == 'GET':
        try:
            speciality_name = request.GET.get('Speciality', None)
            
            if not speciality_name:
                return JsonResponse({'warn': 'Missing Speciality'})

            # Get speciality object
            speciality_obj = Speciality_Detials.objects.filter(
                Speciality_Id=speciality_name
            ).first()

            if not speciality_obj:
                return JsonResponse({'warn': 'Speciality not found'})

            # Get procedure names
            procedure_names = Procedure_Master_Details.objects.filter(
                Speciality=speciality_obj,
                Status=True
            ).values('Procedure_Id', 'Procedure_Name')

            if not procedure_names.exists():
                return JsonResponse({'warn': 'No procedures found for the given speciality'})

            # Clean \r and \n from Procedure_Name
            cleaned_list = []
            for p in procedure_names:
                name = p['Procedure_Name']
                name = name.replace('\r', '').replace('\n', '').strip()
                p['Procedure_Name'] = " ".join(name.split())  # remove extra spaces
                cleaned_list.append(p)

            return JsonResponse(cleaned_list, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Surgeryname_Speciality_link(request):
    if request.method == 'GET':
        try:
            speciality_name = request.GET.get('Speciality', None)
            
            if not speciality_name:
                return JsonResponse({'warn': 'Missing Speciality'})

            # Assuming Speciality_Id is the primary key or you're filtering by it
            speciality_obj = Speciality_Detials.objects.filter(Speciality_Id=speciality_name).first()

            if not speciality_obj:
                return JsonResponse({'warn': 'Speciality not found'})

            # Filter SurgeryName_Details based on the matched Speciality
            surgery_names = SurgeryName_Details.objects.filter(Speciality_Name=speciality_obj, Status=True).values('Surgery_Id', 'Surgery_Name')

            if surgery_names.exists():
                return JsonResponse(list(surgery_names), safe=False)
            else:
                return JsonResponse({'warn': 'No surgeries found for the given speciality'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def OTItem_List_For_IP(request):
 
        if request.method == 'GET':
            try:
 
                QueueList_ID = request.GET.get('QueueList_ID')
 
                OT_list = []
                ot_info = Theatre_Booking_Request_Details.objects.filter(IP_Registration_Id=QueueList_ID).first()
 
                roomdatas = Patient_Admission_Room_Detials.objects.filter(
                        IP_Registration_Id__pk= QueueList_ID, Status=True, IsStayed=True
                    ).exclude(Iscanceled=True, CurrentlyStayed=True).last()
               
                print(roomdatas.RoomId.Ward_Name.Ward_Name.Ward_Id,'mmmmmmmmmmmmmmmmm')
                RoomType = roomdatas.RoomId.Ward_Name.Ward_Name.Type
 
                # billinglist = [{'SURGEON FEE':0},{'OT FEE':0},{'ASSISTANT SURGEON FEE':0},{'ANESTHESIAN FEE':0}]
                billinglist = [{}, {}, {}, {}]
 
 
                if ot_info:
   
                    if ot_info.ProcedureName:
   
                        print(ot_info.ProcedureName.Procedure_Id,'iddddddddddddd')
   
                        Pro_data = Procedure_Master_Details.objects.filter(Procedure_Id=ot_info.ProcedureName.Procedure_Id).first()
                        if Pro_data.IsSeparateFee == True:
   
                                if RoomType == 'WARD':
   
                                    print('warddddddddd')
                       
                                    billinglist[0][ot_info.ProcedureName.Procedure_Name + ' ' + 'SURGEON FEE'] = Pro_data.WardSurgeonFee
                                    billinglist[1][ot_info.ProcedureName.Procedure_Name + ' ' + 'OT FEE'] = Pro_data.WardOTFee
                                    billinglist[2][ot_info.ProcedureName.Procedure_Name + ' ' + 'ASSISTANTSURGEON FEE'] = Pro_data.WardAssistantSurgeonFee
                                    billinglist[3][ot_info.ProcedureName.Procedure_Name + ' ' + 'ANESTHESIAN FEE'] = Pro_data.WardAnesthesianFee
   
                                elif RoomType == 'ROOM':
   
                                    print('rommmmmmm')
   
                                    billinglist[0][ot_info.ProcedureName.Procedure_Name + ' ' + 'SURGEON FEE'] = Pro_data.RoomSurgeonFee
                                    billinglist[1][ot_info.ProcedureName.Procedure_Name + ' ' + 'OT FEE'] = Pro_data.RoomOTFee
                                    billinglist[2][ot_info.ProcedureName.Procedure_Name + ' ' + 'ASSISTANTSURGEON FEE'] = Pro_data.RoomAssistantSurgeonFee
                                    billinglist[3][ot_info.ProcedureName.Procedure_Name + ' ' + 'ANESTHESIAN FEE'] = Pro_data.RoomAnesthesianFee                        
   
                        else :
                                    billinglist[0][ot_info.ProcedureName.Procedure_Name +  ' ' +'SURGEON FEE'] = Pro_data.SurgeonFee
                                    billinglist[1][ot_info.ProcedureName.Procedure_Name + ' ' + 'OT FEE'] = Pro_data.OTFee
                                    billinglist[2][ot_info.ProcedureName.Procedure_Name + ' ' + 'ASSISTANTSURGEON FEE'] = Pro_data.AssistantSurgeonFee
                                    billinglist[3][ot_info.ProcedureName.Procedure_Name + ' ' + 'ANESTHESIAN FEE'] = Pro_data.AnesthesianFee                        
   
                        for datas in billinglist:
                            for key, value in datas.items():
                                print(f"{key}: {value}", 'dictttttttttt')
   
                           
                                data_list={
                                    'category': 'OT',
                                    'service_subcategory':key,
                                    'rate':value,
                                    'Units': '1',
                                    'Date':ot_info.BookingDate,
                                    'isReimbursable': 'Yes'
 
 
                                }
                                OT_list.append(data_list)
                   
               
                return JsonResponse(OT_list,safe=False)
               
 
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def OTItem_List_For_IP_Estimated_Bill(request):
    if request.method == "GET":
        try:
            # Retrieve GET parameters
            procedure_id = request.GET.get("Procedureid")
            room_type = request.GET.get("Type")  # Use one parameter for Type
            booking_date = request.GET.get("BookingDate")  # Assuming BookingDate is passed
 
            # Validate required parameters
            if not procedure_id or not room_type:
                return JsonResponse(
                    {"error": "Procedureid and Type are required parameters"},
                    status=400,
                )
 
            if room_type not in ["WARD", "ROOM"]:
                return JsonResponse(
                    {"error": "Invalid Type. Must be 'WARD' or 'ROOM'"},
                    status=400,
                )
 
            # Fetch procedure data
            pro_data = Procedure_Master_Details.objects.filter(
                Procedure_Id=procedure_id
            ).first()
            if not pro_data:
                return JsonResponse(
                    {"error": f"No procedure found with Procedure_Id: {procedure_id}"},
                    status=404,
                )
 
            # Initialize billing list
            billing_list = [
                {"category": "SURGEON FEE", "rate": 0},
                {"category": "OT FEE", "rate": 0},
                {"category": "ASSISTANTSURGEON FEE", "rate": 0},
                {"category": "ANESTHESIAN FEE", "rate": 0},
            ]
 
            # Populate billing list based on IsSeparateFee and RoomType
            if pro_data.IsSeparateFee:
                if room_type == "WARD":
                    billing_list[0]["rate"] = pro_data.RoomSurgeonFee or 0
                    billing_list[1]["rate"] = pro_data.RoomOTFee or 0
                    billing_list[2]["rate"] = pro_data.RoomAssistantSurgeonFee or 0
                    billing_list[3]["rate"] = pro_data.RoomAnesthesianFee or 0
                elif room_type == "ROOM":
                    billing_list[0]["rate"] = pro_data.RoomSurgeonFee or 0
                    billing_list[1]["rate"] = pro_data.RoomOTFee or 0
                    billing_list[2]["rate"] = pro_data.RoomAssistantSurgeonFee or 0
                    billing_list[3]["rate"] = pro_data.RoomAnesthesianFee or 0
            else:
                billing_list[0]["rate"] = pro_data.SurgeonFee or 0
                billing_list[1]["rate"] = pro_data.OTFee or 0
                billing_list[2]["rate"] = pro_data.AssistantSurgeonFee or 0
                billing_list[3]["rate"] = pro_data.AnesthesianFee or 0
 
            # Construct OT_list for response
            ot_list = [
                {
                    "sno": idx + 1,  # start from 1
                    "category": "OT",
                    "service_subcategory": f"{pro_data.Procedure_Name} {item['category']}",
                    "rate": item["rate"],
                    "Units": "1",
                    "Date": booking_date or datetime.now().strftime("%Y-%m-%d"),
                    "isReimbursable": "Yes",
                }
                for idx, item in enumerate(billing_list)
            ]
 
            # Debugging: Print billing details
            for item in ot_list:
                print(f"{item['service_subcategory']}: {item['rate']}")
 
            return JsonResponse(ot_list, safe=False)
 
        except Procedure_Master_Details.DoesNotExist:
            return JsonResponse(
                {"error": f"No procedure found with Procedure_Id: {procedure_id}"},
                status=404,
            )
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": "An internal server error occurred"}, status=500)
 
    return JsonResponse({"error": "Method not allowed"}, status=405)
 
 
 
 
 
# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def OTItem_List_For_IP_Estimated_Bill(request):
#     if request.method == "GET":
#         try:
#             # Retrieve GET parameters
#             procedure_id = request.GET.get("Procedureid")
#             room_type = request.GET.get("Type")
#             booking_date = request.GET.get("BookingDate")
#             Registration_Id = request.GET.get('Registration_Id', '')

#             # Validate required parameters
#             if not procedure_id or not room_type:
#                 return JsonResponse(
#                     {"error": "Procedureid and Type are required parameters"},
#                     status=400,
#                 )

#             if room_type not in ["WARD", "ROOM"]:
#                 return JsonResponse(
#                     {"error": "Invalid Type. Must be 'WARD' or 'ROOM'"},
#                     status=400,
#                 )

#             # Fetch procedure data
#             pro_data = Procedure_Master_Details.objects.filter(
#                 Procedure_Id=procedure_id
#             ).first()
#             if not pro_data:
#                 return JsonResponse(
#                     {"error": f"No procedure found with Procedure_Id: {procedure_id}"},
#                     status=404,
#                 )

#             # Initialize discount variables
#             discount_config = None
#             ProDiscount = None
#             PatientCategory = ''

#             # Get patient category if Registration_Id is provided
#             if Registration_Id:
#                 regins = Patient_IP_Registration_Detials.objects.filter(
#                     Registration_Id=Registration_Id
#                 ).first()
#                 if regins:
#                     PatientCategory = regins.PatientCategory

#                     # Fetch discount configuration
#                     discount_config = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='PROCEDURES',
#                         Patient_Type=PatientCategory
#                     ).first()

#                     if discount_config:
#                         ProDiscount = DiscountFeeProcedure.objects.filter(
#                             discount__Discount_ID=discount_config.Discount_ID,
#                             ProcedureId__Procedure_Id=procedure_id
#                         ).first()

#             # Initialize billing list with discount fields
#             billing_list = [
#                 {
#                     "category": "SURGEON FEE",
#                     "room_rate": 0,
#                     "ward_rate": 0,
#                     "common_rate": 0,
#                     "rate": 0,
#                     "discount_rate": 0,
#                     "final_rate": 0,
#                     "discount_value_display": "-",
#                     "discount_amount_display": "-",
#                     "discount_method": "",
#                     "discount_field": "SurgeonFee",
#                     "room_ward_difference": 0,
#                     "room_ward_percentage": 0
#                 },
#                 {
#                     "category": "OT FEE",
#                     "room_rate": 0,
#                     "ward_rate": 0,
#                     "common_rate": 0,
#                     "rate": 0,
#                     "discount_rate": 0,
#                     "final_rate": 0,
#                     "discount_value_display": "-",
#                     "discount_amount_display": "-",
#                     "discount_method": "",
#                     "discount_field": "OTFee",
#                     "room_ward_difference": 0,
#                     "room_ward_percentage": 0
#                 },
#                 {
#                     "category": "ASSISTANTSURGEON FEE",
#                     "room_rate": 0,
#                     "ward_rate": 0,
#                     "common_rate": 0,
#                     "rate": 0,
#                     "discount_rate": 0,
#                     "final_rate": 0,
#                     "discount_value_display": "-",
#                     "discount_amount_display": "-",
#                     "discount_method": "",
#                     "discount_field": "AssistantSurgeonFee",
#                     "room_ward_difference": 0,
#                     "room_ward_percentage": 0
#                 },
#                 {
#                     "category": "ANESTHESIAN FEE",
#                     "room_rate": 0,
#                     "ward_rate": 0,
#                     "common_rate": 0,
#                     "rate": 0,
#                     "discount_rate": 0,
#                     "final_rate": 0,
#                     "discount_value_display": "-",
#                     "discount_amount_display": "-",
#                     "discount_method": "",
#                     "discount_field": "AnesthesianFee",
#                     "room_ward_difference": 0,
#                     "room_ward_percentage": 0
#                 },
#             ]

#             # Helper function to format decimal to 2 places
#             def format_decimal(value):
#                 """Format decimal value to 2 decimal places"""
#                 if value is None:
#                     return 0.00
#                 try:
#                     return float(f"{float(value):.2f}")
#                 except (ValueError, TypeError):
#                     return 0.00

#             # Populate rates based on IsSeparateFee
#             if pro_data.IsSeparateFee:
#                 # Store both ward and room rates
#                 billing_list[0]["room_rate"] = format_decimal(pro_data.RoomSurgeonFee)
#                 billing_list[0]["ward_rate"] = format_decimal(pro_data.WardSurgeonFee)
#                 billing_list[1]["room_rate"] = format_decimal(pro_data.RoomOTFee)
#                 billing_list[1]["ward_rate"] = format_decimal(pro_data.WardOTFee)
#                 billing_list[2]["room_rate"] = format_decimal(pro_data.RoomAssistantSurgeonFee)
#                 billing_list[2]["ward_rate"] = format_decimal(pro_data.WardAssistantSurgeonFee)
#                 billing_list[3]["room_rate"] = format_decimal(pro_data.RoomAnesthesianFee)
#                 billing_list[3]["ward_rate"] = format_decimal(pro_data.WardAnesthesianFee)
                
#                 # Calculate room-ward difference and percentage for display
#                 for item in billing_list:
#                     if item["room_rate"] > 0 and item["ward_rate"] > 0:
#                         item["room_ward_difference"] = format_decimal(item["room_rate"] - item["ward_rate"])
#                         item["room_ward_percentage"] = format_decimal((item["room_ward_difference"] / item["room_rate"]) * 100)
#             else:
#                 # If not separate fee, use common rates
#                 common_rate_0 = format_decimal(pro_data.SurgeonFee)
#                 common_rate_1 = format_decimal(pro_data.OTFee)
#                 common_rate_2 = format_decimal(pro_data.AssistantSurgeonFee)
#                 common_rate_3 = format_decimal(pro_data.AnesthesianFee)
                
#                 billing_list[0]["common_rate"] = common_rate_0
#                 billing_list[1]["common_rate"] = common_rate_1
#                 billing_list[2]["common_rate"] = common_rate_2
#                 billing_list[3]["common_rate"] = common_rate_3

#             # Set the actual rate to display based on room_type
#             for item in billing_list:
#                 if pro_data.IsSeparateFee:
#                     if room_type == "WARD":
#                         item["rate"] = item["room_rate"]  # Show Room rate as base
#                         item["final_rate"] = item["ward_rate"]  # Show Ward rate as final
#                         item["discount_amount"] = item["room_ward_difference"]
#                     elif room_type == "ROOM":
#                         item["rate"] = item["room_rate"]
#                         item["final_rate"] = item["room_rate"]
#                         item["discount_amount"] = 0.00
#                 else:
#                     item["rate"] = item["common_rate"]
#                     item["final_rate"] = item["common_rate"]
#                     item["discount_amount"] = 0.00

#             # Apply patient category discounts on top of room/ward rates
#             if ProDiscount and discount_config:
#                 discount_type = ProDiscount.discount_method if ProDiscount else None
               
#                 for item in billing_list:
#                     current_rate = item["final_rate"]  # Already has room/ward adjustment
#                     discount_field = item["discount_field"]
                   
#                     # Get the discounted rate from ProDiscount and format it
#                     discount_rate = format_decimal(getattr(ProDiscount, discount_field, 0))
                   
#                     if discount_type and discount_rate > 0:
#                         if discount_type.lower() == "percentage":
#                             # Calculate additional patient category discount
#                             additional_discount = format_decimal((current_rate * discount_rate) / 100)
#                             item["final_rate"] = format_decimal(current_rate - additional_discount)
#                             item["discount_rate"] = discount_rate
#                             item["discount_value_display"] = f"{discount_rate:.2f}%"
#                             item["discount_method"] = 'PERCENTAGE'
#                             item["discount_amount"] = format_decimal(item["discount_amount"] + additional_discount)
                            
#                         elif discount_type.lower() == "flat":
#                             additional_discount = format_decimal(discount_rate)
#                             item["final_rate"] = format_decimal(current_rate - additional_discount)
#                             item["discount_rate"] = discount_rate
#                             item["discount_value_display"] = f"{discount_rate:.2f}"
#                             item["discount_method"] = 'FLATAMOUNT'
#                             item["discount_amount"] = format_decimal(item["discount_amount"] + additional_discount)
                            
#                         elif discount_type.lower() == "value":
#                             additional_discount = format_decimal(current_rate - discount_rate)
#                             item["final_rate"] = format_decimal(discount_rate)
#                             item["discount_rate"] = discount_rate
#                             item["discount_value_display"] = f"{discount_rate:.2f}"
#                             item["discount_method"] = 'FIXEDRATE'
#                             item["discount_amount"] = format_decimal(item["discount_amount"] + additional_discount)
                            
#             # Format discount display for room-ward difference when room_type is WARD
#             for item in billing_list:
#                 if room_type == "WARD" and pro_data.IsSeparateFee and item["room_ward_difference"] > 0:
#                     # Show room-ward difference as discount
#                     item["discount_amount_display"] = f"{item['discount_amount']:.2f}"
                    
#                     # If there's also a patient category discount, combine the display
#                     if ProDiscount and discount_config:
#                         item["discount_value_display"] = f"Room-Ward: {item['room_ward_percentage']:.2f}% + Patient: {item['discount_value_display']}"
#                     else:
#                         item["discount_value_display"] = f"{item['room_ward_percentage']:.2f}%"
#                         item["discount_method"] = "PERCENTAGE"
#                         item["discount_rate"] = item["room_ward_percentage"]
#                 else:
#                     # For ROOM type or no room-ward difference
#                     if item["discount_amount"] > 0:
#                         item["discount_amount_display"] = f"{item['discount_amount']:.2f}"
#                     else:
#                         item["discount_amount_display"] = "-"

#             # Construct OT_list for response
#             ot_list = []
#             for idx, item in enumerate(billing_list):
#                 ot_item = {
#                     "sno": idx + 1,
#                     "category": "OT",
#                     "service_subcategory": f"{pro_data.Procedure_Name} {item['category']}",
#                     "rate": item["rate"],  # Room rate when WARD, Room rate when ROOM
#                     "discount_rate": item["discount_rate"],
#                     "discount_amount": item["discount_amount"],
#                     "final_rate": item["final_rate"],  # Ward rate when WARD, Room rate when ROOM
#                     "discount_value_display": item["discount_value_display"],
#                     "discount_amount_display": item["discount_amount_display"],
#                     "discount_method": item["discount_method"],
#                     "Units": "1",
#                     "Date": booking_date or datetime.now().strftime("%Y-%m-%d"),
#                     "isReimbursable": "Yes",
#                     "patient_category": PatientCategory,
#                     "has_discount": bool(ProDiscount and discount_config) or (room_type == "WARD" and pro_data.IsSeparateFee),
#                     "room_type": room_type,
#                     "room_rate": item.get("room_rate", 0),
#                     "ward_rate": item.get("ward_rate", 0),
#                     "room_ward_difference": item.get("room_ward_difference", 0),
#                     "room_ward_percentage": item.get("room_ward_percentage", 0)
#                 }
#                 ot_list.append(ot_item)

#             return JsonResponse(ot_list, safe=False)

#         except Procedure_Master_Details.DoesNotExist:
#             return JsonResponse(
#                 {"error": f"No procedure found with Procedure_Id: {procedure_id}"},
#                 status=404,
#             )
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Method not allowed"}, status=405)






