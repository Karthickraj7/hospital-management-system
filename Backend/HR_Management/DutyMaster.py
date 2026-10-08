import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Max, Q
from datetime import datetime
import random
import string
from django.db import transaction
from decimal import Decimal
from Masters.models import *
from django.utils.dateparse import parse_time
from .serializers import *
from django.db.models.functions import Cast
from django.db.models import IntegerField

# @csrf_exempt
# @require_http_methods(["POST", "GET", "OPTIONS"])
# def Duty_Master(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print("data",data)
#             ShiftId = data.get('ShiftId')
#             ShiftName = data.get('ShiftName', '').strip()
#             StartTime = parse_time(data.get('StartTime', ''))
#             EndTime = parse_time(data.get('EndTime', ''))
#             location = data.get('location')
#             created_by = data.get('created_by', '')
#             Statusedit = data.get('Statusedit', False)

#             # Validate required fields


#             if ShiftId:
#                 try:
#                     duty_instance = DutyRouster_Master_Details.objects.get(Shift_Id=ShiftId)
#                 except DutyRouster_Master_Details.DoesNotExist:
#                     return JsonResponse({'warn': 'DutyRouster not found'})

#                 if Statusedit:
#                     print("Statusedit",Statusedit)
#                     duty_instance.Status = not duty_instance.Status
#                 else:
#                     if DutyRouster_Master_Details.objects.filter(ShiftName=ShiftName).exclude(Shift_Id=duty_instance.Shift_Id).exists():
#                         return JsonResponse({'warn': f"The ShiftName '{ShiftName}' already exists"})
#                     duty_instance.ShiftName = ShiftName
#                     duty_instance.ShiftStartTime = StartTime
#                     duty_instance.ShiftEndTime = EndTime

#                 duty_instance.save()
#                 return JsonResponse({'success': 'Duty Rouster updated successfully'})
#             else:
#                 # Create a new DutyRouster
#                 if not location:
#                     return JsonResponse({'warn': 'Location is required'})

#                 try:
#                     Location_instance = Location_Detials.objects.get(pk=location)
#                 except Location_Detials.DoesNotExist:
#                     return JsonResponse({'warn': 'Invalid Location'})

#                 if DutyRouster_Master_Details.objects.filter(ShiftName=ShiftName).exists():
#                     return JsonResponse({'warn': f"The ShiftName '{ShiftName}' already exists"})
#                 if not ShiftName or not StartTime or not EndTime:
#                     return JsonResponse({'warn': 'ShiftName, StartTime, and EndTime are required'})
#                 duty_instance = DutyRouster_Master_Details(
#                     Location=Location_instance,
#                     ShiftName=ShiftName,
#                     ShiftStartTime=StartTime,
#                     ShiftEndTime=EndTime,
#                     Create_by=created_by
#                 )
#                 duty_instance.save()
#                 return JsonResponse({'success': 'New ShiftName created successfully'}, status=201)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     elif request.method == 'GET':
#         try:
#             duty_list = [
#                 {
#                     'id': duty.Shift_Id,
#                     'ShiftName': duty.ShiftName,
#                     'StartTime': duty.ShiftStartTime.strftime('%H:%M:%S'),
#                     'EndTime': duty.ShiftEndTime.strftime('%H:%M:%S'),
#                     'Status': 'Active' if duty.Status else 'Inactive',
#                     'Create_by': duty.Create_by,
#                 }
#                 for duty in DutyRouster_Master_Details.objects.all()
#             ]
#             return JsonResponse(duty_list, safe=False, status=200)
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt
def DutyRosterMasters(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            print("data :", data)
            succmsg = ""
            print('type :',type(data))
            Statusedit = False
            SingleShiftEdit = False
            if type(data) == dict:
                Statusedit = data.get("Statusedit")
                print('Statusedit :', Statusedit)
                SingleShiftEdit = data.get('SingleShiftEdit')
            if Statusedit is True:
                ShiftId = data.get("ShiftId")
                duty_record = DutyRousterMaster.objects.get(ShiftId=ShiftId)
                data['Statusedit'] = Statusedit
                print('data :', data)
                
                serializer = DutyRousterMasterDetailsSerializer(
                    duty_record, data=data, partial=True, context={"request": request}
                )
                Status = data.get('Status')
                print('Status :', Status)
                Status1 = "Inactive" if Status is True else "Active"
                if serializer.is_valid():
                    serializer.save()
                    succmsg = {"success": "{} successfully.".format(Status1)}
                else:
                    succmsg = {"error": serializer.errors}

                print(succmsg)
            elif SingleShiftEdit is True:
                ShiftId = data.get("ShiftId")
                duty_record = DutyRousterMaster.objects.get(ShiftId=ShiftId)
                serializer = DutyRousterMasterDetailsSerializer(
                    duty_record, data=data, partial=True, context={"request": request}
                )
                if serializer.is_valid():
                    serializer.save()
                    succmsg = {"success": "Shift Update successfully."}
                else:
                    succmsg = {"error": serializer.errors}
            else:
                        # Cast ShiftId to IntegerField for proper numeric comparison
                max_shift_id_query = DutyRousterMaster.objects.annotate(
                    shift_id_as_int=Cast("ShiftId", output_field=IntegerField())
                ).aggregate(Max("shift_id_as_int"))
                max_shift_id = max_shift_id_query["shift_id_as_int__max"]

                print("max_shift_id :", max_shift_id)

                # Compute next ShiftId
                next_shift_id = 1 if max_shift_id is None else max_shift_id + 1
                print("next_shift_id :", next_shift_id)

                for i in data:
                    is_edit = i.get("is_edit")
                    if is_edit is True:
                        existing_record = DutyRousterMaster.objects.filter(
                            ShiftId=i.get("ShiftId"), BranchID=i.get("BranchID")
                        ).first()
                        if existing_record is not None:
                            serializer = DutyRousterMasterDetailsSerializer(
                                existing_record,
                                data=i,
                                partial=True,
                                context={"request": request},
                            )
                            if serializer.is_valid():
                                serializer.save()
                                succmsg = {"success": "Updated successfully."}
                            else:
                                succmsg = {"error": serializer.errors}
                    else:
                        print("ShiftId from request:", i.get("ShiftId"))
                        existing_record = DutyRousterMaster.objects.filter(
                           ShiftId = str(next_shift_id), BranchID=i.get("BranchID")
                        ).first()
                        print('existing_record :',existing_record)
                        if existing_record is not None:
                            serializer = DutyRousterMasterDetailsSerializer(
                                existing_record,
                                data=i,
                                partial=True,
                                context={"request": request},
                            )
                            if serializer.is_valid():
                                serializer.save()
                                succmsg = {"success": "Updated successfully."}
                            else:
                                succmsg = {"error": serializer.errors}
                        else:
                            # Insert a new record with next available ShiftId
                            i["ShiftId"] = (
                                next_shift_id  # Assign the next available ShiftId
                            )
                            next_shift_id += 1  # Increment ShiftId for the next record
                            print('i ===>',i)
                            print('StartTime :',i.get('StartTime'),type(i.get('StartTime')))
                            
                            if i.get("StartTime") == "None":
                                i["StartTime"] = None
                            if i.get("EndTime") == "None":
                                i["EndTime"] = None
                            if i.get("DayOff") == True:
                                i["DayOff"] = "Yes"
                                i["ShiftHours"] = None
                            else:
                                i["DayOff"] = "No"
                            print('i =asdfvfdsgvs==>',i)
                            serializerdata = DutyRousterMasterDetailsSerializer(
                                data=i, context={"request": request}
                            )
                            if serializerdata.is_valid():
                                serializerdata.save()
                                succmsg = {"success": "Inserted successfully."}
                            else:
                                succmsg = {"error": serializerdata.errors}

            return JsonResponse(succmsg)

        elif request.method == 'GET':
            location = request.GET.get("location")
            departments = DutyRousterMaster.objects.filter(Location=location).all()
            serializer = DutyRousterMasterDetailsSerializer(departments, many=True, context={'request': request})
            return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        print("error :", e)
        return JsonResponse({"error": str(e)})
