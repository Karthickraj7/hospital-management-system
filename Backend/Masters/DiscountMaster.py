import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Q
from .serializers import *
import pandas as pd
from PyPDF2 import PdfReader, PdfWriter
from io import BytesIO
import base64
from PIL import Image
import filetype

from django.utils import timezone
 
current_date = timezone.now().date()

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Discount_Master_link(request):


    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data,'dataaaaaaa')

            Discount_ID = data.get('Discount_ID')
            DiscountName = data.get('DiscountName')
            Patient_Type = data.get('Patient_Type')
            Department = data.get('Department')
            Service = data.get('Service')
            Discount_Type = data.get('Discount_Type')
            Discount_Value = data.get('Discount_Value')
            Min_Bill_Amount = data.get('Min_Bill_Amount')
            Valid_From = data.get('Valid_From')
            Valid_To = data.get('Valid_To')
            Approval_Level = data.get('Approval_Level')
            Notes = data.get('Notes')
            Status = data.get('Status')
            created_by = data.get('created_by') 
            Statusedit = data.get('Statusedit')

            Departmentins = Department_Detials.objects.filter(Department_Id=Department).first() if Department else None
            Serviceins = Service_Category_Masters.objects.filter(Serviceid=Service).first() if Service else None

            if Discount_ID:

                if Statusedit:
                     
                     DiscountMasterins = DiscountMaster.objects.filter(Discount_ID=Discount_ID).first()
                     DiscountMasterins.Status = Status
                     DiscountMasterins.save()

                     return JsonResponse({'success':'Discount Status Updated Successfully'})
                     

                DiscountMasterins = DiscountMaster.objects.filter(Discount_ID=Discount_ID).first()
                DiscountMasterins.DiscountName = DiscountName
                DiscountMasterins.Patient_Type = Patient_Type
                DiscountMasterins.Department = Departmentins
                DiscountMasterins.Service = Serviceins
                DiscountMasterins.Discount_Type = Discount_Type
                DiscountMasterins.Discount_Value = Discount_Value
                DiscountMasterins.Min_Bill_Amount = Min_Bill_Amount
                DiscountMasterins.Valid_From = Valid_From
                DiscountMasterins.Valid_To = Valid_To
                DiscountMasterins.Approval_Level = Approval_Level
                DiscountMasterins.Notes = Notes
                DiscountMasterins.Status = Status
                DiscountMasterins.created_by = created_by
                DiscountMasterins.save()

                return JsonResponse({'success':'Discount Details Updated Successfully'})

            DiscountMasterins = DiscountMaster(
                DiscountName = DiscountName,
                Patient_Type = Patient_Type,
                Department = Departmentins,
                Service = Serviceins,
                Discount_Type = Discount_Type,
                Discount_Value = Discount_Value,
                Min_Bill_Amount = Min_Bill_Amount,
                Valid_From = Valid_From,
                Valid_To = Valid_To,
                Approval_Level = Approval_Level,
                Notes = Notes,
                Status = Status,
                created_by = created_by
            )

            DiscountMasterins.save()

            return JsonResponse({'success':'Discount Details Created Successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
        
    elif request.method == 'GET':

        try:

            DiscountMasterins = DiscountMaster.objects.all()
            Discountlist = []

            for datas in DiscountMasterins:
                
                datalist = {
                    'Discount_ID' : datas.Discount_ID,
                    'DiscountName': datas.DiscountName,
                    'Patient_Type' : datas.Patient_Type,
                    'DepartmentId' :datas.Department.Department_Id if datas.Department else None,
                    'DepartmentName' :datas.Department.Department_Name if datas.Department else None,
                    'ServiceName': datas.Service.ServiceCategory if datas.Service else None,
                    'ServiceId' : datas.Service.Serviceid if datas.Service else None,
                    'Discount_Type': datas.Discount_Type,
                    'Discount_Value': datas.Discount_Value,
                    'Min_Bill_Amount': datas.Min_Bill_Amount,
                    'Valid_From': datas.Valid_From,
                    'Valid_To':datas.Valid_To,
                    'Approval_Level': datas.Approval_Level,
                    'Notes': datas.Notes,
                    'Status': datas.Status,
                    'created_by': datas.created_by
                }
                Discountlist.append(datalist)

            for start, item in enumerate(Discountlist, start=1):
                        item['sno'] = start

            return JsonResponse(Discountlist,safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

 
@csrf_exempt  
@require_http_methods(["GET"])
def Discount_List_For_Department(request):
     
    if request.method == 'GET':
 
        try:
 
            Category = request.GET.get('Category')
            Dept = request.GET.get('Dept')
 
            DiscountMasterins = DiscountMaster.objects.filter(
                Patient_Type=Category,
                Department__Department_Name=Dept,
                Valid_From__lte=current_date,
                Valid_To__gte=current_date,
                Status=True
            )      
 
            print(DiscountMasterins,'DiscountMasterins')  
               
            Discountlist = []
 
            for datas in DiscountMasterins:
               
                datalist = {
                    'Discount_ID' : datas.Discount_ID,
                    'DiscountName': datas.DiscountName,
                    # 'Patient_Type' : datas.Patient_Type,
                    # 'DepartmentId' :datas.Department.Department_Id if datas.Department else None,
                    # 'DepartmentName' :datas.Department.Department_Name if datas.Department else None,
                    # 'ServiceName': datas.Service.ServiceCategory if datas.Service else None,
                    # 'ServiceId' : datas.Service.Serviceid if datas.Service else None,
                    'Discount_Type': datas.Discount_Type,
                    'Discount_Value': datas.Discount_Value,
                    'Min_Bill_Amount': datas.Min_Bill_Amount,
                    # 'Valid_From': datas.Valid_From,
                    # 'Valid_To':datas.Valid_To,
                    # 'Approval_Level': datas.Approval_Level,
                    # 'Notes': datas.Notes,
                    # 'Status': datas.Status,
                    # 'created_by': datas.created_by
                }
                Discountlist.append(datalist)
 
            for start, item in enumerate(Discountlist, start=1):
                        item['sno'] = start
 
            return JsonResponse(Discountlist,safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
     
   
 
 




           
