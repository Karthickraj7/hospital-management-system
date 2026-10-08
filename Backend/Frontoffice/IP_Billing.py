import json
import pycountry
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from Masters.models import *
from decimal import Decimal, InvalidOperation
from .models import Patient_Appointment_Registration_Detials
from django.shortcuts import render
from .models import Service_Master_Details, Service_Procedure_Charges
from django.db.models import  Q, Sum
from Ip_Workbench.models import *
from OutPatient.models import *
from django.utils import timezone
from Insurance.models import *
from DrugAdminstrations.models import *
from OTManagement.models import *
from OutPatient.ReferDoctor import get_rad_request_details


import math

from django.db import connection, transaction
from .models import Patient_Appointment_Registration_Detials, Patient_Detials
from Workbench.models import Workbench_Prescription
from django.core.serializers import serialize
from datetime import datetime
from OutPatient.LabRequests import get_lab_request_details

from django.utils.decorators import method_decorator
from django.views import View
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to
from OutPatient.LabRequests import model_to_dict, extract_panic_range
from django.db.models import Sum, F, ExpressionWrapper, FloatField, Case, When\


from django.db import connection as db
# -------------------------------------------------------------------------------

     
# @csrf_exempt
# @require_http_methods(["GET"])
# def Get_IP_Billing_Details(request):
#     try:
#         location = request.GET.get('location')
#         Status = request.GET.get('Status','Pending')
#         searchBy = request.GET.get('searchBy')
         
            
#         Get_IPBilling_instance=IP_Billing_QueueList_Detials.objects.filter(
#            ( Q(Registration_Id__PatientId__PatientId__icontains=searchBy)|
#             Q(Registration_Id__PatientId__PhoneNo__icontains=searchBy)|
#             Q(Registration_Id__PatientId__FirstName__icontains=searchBy)) &
#             Q(Status=Status,Registration_Id__Location=location) 
#         )
      
#         Billing_data=[]

#         for row in Get_IPBilling_instance:
#             ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Registration_Id)
#             wardname=None
#             bedno=None
#             if ward_details:
#                 ward_name=ward_details.RoomId.Ward_Name.Ward_Name.Ward_Name
#                 print("ward_name",ward_name)
#                 bedno=ward_details.RoomId.Bed_No

           
#             full_name = f"{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}" 
#             formatted_date = row.created_at.strftime("%d/%b/%Y")
#             categoryname = ''
#             categoryid = ''
#             if row.Registration_Id.PatientCategory == 'Insurance':
#                 categoryname = row.Registration_Id.InsuranceName.Insurance_Name
#                 categoryid = row.Registration_Id.InsuranceName.Insurance_Id
#             elif row.Registration_Id.PatientCategory == 'Client':
#                 categoryname = row.Registration_Id.ClientName.Client_Name
#                 categoryid = row.Registration_Id.ClientName.Client_Id
#             else:
#                 categoryname=None

#             Billing_data.append({    
#                 'id':row.BillingQueueList_ID,
#                 'VisitType' : 'IP',
#                 'Status': row.Status,
#                 'Date': formatted_date,
#                 'Registration_Id':row.Registration_Id.Registration_Id,
#                 'PatientId':row.Registration_Id.PatientId.PatientId,
#                 'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
#                 'Patient_Name':full_name.strip(),
#                 'AgeGender': f'{row.Registration_Id.PatientId.Age}/{row.Registration_Id.PatientId.Gender}',
#                 'Address': f'{row.Registration_Id.PatientId.DoorNo}, {row.Registration_Id.PatientId.Street}, {row.Registration_Id.PatientId.Area}, {row.Registration_Id.PatientId.City}, {row.Registration_Id.PatientId.State}, {row.Registration_Id.PatientId.Country}, {row.Registration_Id.PatientId.Pincode}',
#                 'PatientCategory':row.Registration_Id.PatientCategory,
#                 'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id else None,
#                 'Doctor_Id':row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
#                 'Title' : row.Registration_Id.PatientId.Title.Title_Name,
#                 'FirstName' : row.Registration_Id.PatientId.FirstName,
#                 'MiddleName' : row.Registration_Id.PatientId.MiddleName,
#                 'SurName' : row.Registration_Id.PatientId.SurName,
#                 'Gender' : row.Registration_Id.PatientId.Gender,
#                 'DOB' : row.Registration_Id.PatientId.DOB,
#                 'Age' : row.Registration_Id.PatientId.Age,
#                 'Email' : row.Registration_Id.PatientId.Email,
#                 'BloodGroup' : row.Registration_Id.PatientId.BloodGroup.BloodGroup_Name if row.Registration_Id.PatientId.BloodGroup else None,
#                 'Occupation' : row.Registration_Id.PatientId.Occupation,
#                 'Religion' : row.Registration_Id.PatientId.Religion.Religion_Id if row.Registration_Id.PatientId.Religion else None,
#                 'Nationality' :row.Registration_Id.PatientId.Nationality,
#                 'UniqueIdType' : row.Registration_Id.PatientId.UniqueIdType,
#                 'UniqueIdNo' : row.Registration_Id.PatientId.UniqueIdNo,
#                 # 'CaseSheetNo' : row.Registration_Id.PatientId.CasesheetNo,
#                 'Complaint' : row.Registration_Id.Complaint,
#                 'PatientCategory': row.Registration_Id.PatientCategory,
#                 'PatientCategoryName': categoryname, 
#                 'PatientCategoryId': categoryid, 
#                 'DoorNo' : row.Registration_Id.PatientId.DoorNo,
#                 'Street' :row.Registration_Id.PatientId.Street,
#                 'Area' :row.Registration_Id.PatientId.Area,
#                 'City' :row.Registration_Id.PatientId.City,
#                 'State' :row.Registration_Id.PatientId.State,
#                 'Country' :row.Registration_Id.PatientId.Country,
#                 'Pincode' :row.Registration_Id.PatientId.Pincode,    
#                 'ward':   ward_name-bedno               
#             })

#         print('111111111',Billing_data)
#         return JsonResponse (Billing_data,safe=False)
#     except Exception  as e:
#         print({'error':str(e)})
#         return JsonResponse ({'error':str(e)})


@method_decorator(csrf_exempt, name='dispatch')
class IPBillingDetailsView(View):

    def get(self, request):
        try:
            # Get query parameters
            filters = self.extract_filters(request)

            # Construct query
            search_query = self.build_query(filters)

            # Fetch billing records excluding 'Vacated' and 'Booked' status
            billing_queryset = IP_Billing_QueueList_Detials.objects.exclude(Status__in=['Vacated', 'Booked']).filter(search_query)

            # Call lab request details

            # print('premmmmmmmmm')
            # lab_data = get_lab_request_details(
            #     request,
            #     Billing_Status1=filters.get('SearchStatus'),
            #     queue_type1="billling",
            #     Type="IP"
            # )
            # print('labbbb',lab_data)

            # rad_data =get_rad_request_details(
            #     request,
            #     Status='Request'
            # )
            # print('labbbb123',rad_data)


            # Format the final response
            response_data = self.format_billing_data(billing_queryset)
            response_data = []
            # response_data.extend(lab_data)
            # response_data.extend(rad_data)

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})


    def extract_filters(self, request):
        return {
            'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
            'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
            'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
            'DateType': request.GET.get('DateType'),
            'CurrentDate': request.GET.get('CurrentDate'),
            'FromDate': request.GET.get('FromDate'),
            'ToDate': request.GET.get('ToDate'),
            'SearchStatus': request.GET.get('SearchStatus'),
        }

    def build_query(self, filters):
        query = Q()

        if filters['SearchbyFirstName']:
            name_filter = filters['SearchbyFirstName']
            query &= (
                Q(Registration_Id__PatientId__FirstName__icontains=name_filter) |
                Q(Registration_Id__PatientId__MiddleName__icontains=name_filter) |
                Q(Registration_Id__PatientId__SurName__icontains=name_filter) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=name_filter)
            )

        if filters['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=filters['SearchbySpeciality'])

        if filters['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=filters['SearchbyDoctor'])

        if filters['SearchStatus']:
            query &= Q(Status=filters['SearchStatus'])

        # Date filters
        if filters['DateType'] == "Current" and filters['CurrentDate']:
            query &= Q(created_at__date=filters['CurrentDate'])
        elif filters['DateType'] == "Customize":
            if filters['FromDate'] and filters['ToDate']:
                query &= Q(created_at__date__range=[filters['FromDate'], filters['ToDate']])
            elif filters['FromDate']:
                query &= Q(created_at__date__gte=filters['FromDate'])
            elif filters['ToDate']:
                query &= Q(created_at__date__lte=filters['ToDate'])

        return query

    def format_billing_data(self, queryset):
        billing_data = []
        for row in queryset:
            patient = row.Registration_Id.PatientId
            room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Registration_Id).last()
            referral = Patient_Referral_Detials.objects.filter(IP_Register_Id__Registration_Id=row.Registration_Id.Registration_Id).first()

            ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
            bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

            full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
            formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None

            # Category
            if row.Registration_Id.PatientCategory == 'Insurance':
                categoryname = row.Registration_Id.InsuranceName.Insurance_Name
                categoryid = row.Registration_Id.InsuranceName.Insurance_Id
            elif row.Registration_Id.PatientCategory == 'Client':
                categoryname = row.Registration_Id.ClientName.Client_Name
                categoryid = row.Registration_Id.ClientName.Client_Id
            else:
                categoryname = None
                categoryid = None

            billing_data.append({
                'id': row.BillingQueueList_ID,
                'VisitType': 'IP',
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id': row.Registration_Id.Registration_Id,
                'PatientId': patient.PatientId,
                'PhoneNo': patient.PhoneNo,
                'Patient_Name': full_name,
                'Address': ', '.join(filter(None, [
                    patient.DoorNo,
                    patient.Street,
                    patient.Area,
                    patient.City,
                    patient.State,
                    patient.Country,
                    patient.Pincode
                ])) or "No address available",
                'AgeGender': f'{patient.Age}/{patient.Gender}',
                'PatientCategory': row.Registration_Id.PatientCategory,
                'Doctor_ShortName': f"""{row.Doctor_Ratecard_Id.Doctor_ID.Tittle.Title_Name}.{row.Doctor_Ratecard_Id.Doctor_ID.First_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Middle_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Last_Name}""" if row.Doctor_Ratecard_Id else None,
                'Doctor_Id': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
                'Title': patient.Title.Title_Name,
                'FirstName': patient.FirstName,
                'MiddleName': patient.MiddleName,
                'SurName': patient.SurName,
                'Gender': patient.Gender,
                'DOB': patient.DOB,
                'Age': patient.Age,
                'Email': patient.Email,
                'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
                'Occupation': patient.Occupation,
                'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                'Nationality': patient.Nationality,
                'UniqueIdType': patient.UniqueIdType,
                'UniqueIdNo': patient.UniqueIdNo,
                'Complaint': row.Registration_Id.Complaint,
                'PatientCategoryName': categoryname,
                'PatientCategoryId': categoryid,
                'DoorNo': patient.DoorNo,
                'Street': patient.Street,
                'Area': patient.Area,
                'City': patient.City,
                'State': patient.State,
                'Country': patient.Country,
                'Pincode': patient.Pincode,
                'WardName': ward_name,
                'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,
                'AdmittionDate': row.Registration_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                'ServiceProcedureForm': 'IP',
            })

        return billing_data
    



@method_decorator(csrf_exempt, name='dispatch')
class IPBillingLabRadDetailsView(View):
 
    def get(self, request):
        try:
            # Get query parameters
            filters = self.extract_filters(request)
 
            # Fetch lab request details

            try:
                lab_data = get_lab_request_details(
                    request,
                    Billing_Status1=filters.get('SearchStatus'),
                    queue_type1="billling",
                    Type="IP",
                    date_filters=filters  # Pass date filters
                )

            except Exception as e:
                print(str(e),'errrrrrrrr')

 
            # Fetch radiology request details

            # try:
            #     rad_data = get_rad_request_details(
            #         request,
            #         Status='Request',
            #         date_filters=filters  # Pass date filters
            #     )

            # except Exception as e:
            #     print(str(e),'errrrrrrrr')
 
            # Combine lab and radiology data
            response_data = []
            response_data.extend(lab_data)
            # response_data.extend(rad_data)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)}, status=500)
       
    def extract_filters(self, request):
        return {
            'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
            'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
            'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
            'DateType': request.GET.get('DateType'),
            'CurrentDate': request.GET.get('CurrentDate'),
            'FromDate': request.GET.get('FromDate'),
            'ToDate': request.GET.get('ToDate'),
            'SearchStatus': request.GET.get('SearchStatus'),
        }
 

@method_decorator(csrf_exempt, name='dispatch')
class IPBillingRadDetailsView(View):
 
    def get(self, request):
        try:
            # Get query parameters
            filters = self.extract_filters(request)
 
           
            try:
                rad_data = get_rad_request_details(
                    request,
                    Status='Request',
                    date_filters=filters  # Pass date filters
                )

            except Exception as e:
                print(str(e),'errrrrrrrr')
 
            # Combine lab and radiology data
            response_data = []
            # response_data.extend(lab_data)
            response_data.extend(rad_data)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error in class': str(e)})
            return JsonResponse({'error': str(e)}, status=500)
       
    def extract_filters(self, request):
        return {
            'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
            'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
            'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
            'DateType': request.GET.get('DateType'),
            'CurrentDate': request.GET.get('CurrentDate'),
            'FromDate': request.GET.get('FromDate'),
            'ToDate': request.GET.get('ToDate'),
            'SearchStatus': request.GET.get('SearchStatus'),
        }
 
 
 
 


# @method_decorator(csrf_exempt, name='dispatch')
# class IPBillingFinalDetailsView(View):

#     def get(self, request):
#         try:
#             # Get query parameters
#             filters = self.extract_filters(request)

#             # Construct query
#             search_query = self.build_query(filters)

#             # Fetch billing records excluding 'Vacated' and 'Booked' status
#             billing_queryset = IP_Billing_QueueList_Detials.objects.exclude(Status__in=['Vacated', 'Booked']).filter(search_query)


#             response_data = self.format_billing_data(billing_queryset)


#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             print({'error': str(e)})
#             return JsonResponse({'error': str(e)})


#     def extract_filters(self, request):
#         return {
#             'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
#             'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
#             'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
#             'DateType': request.GET.get('DateType'),
#             'CurrentDate': request.GET.get('CurrentDate'),
#             'FromDate': request.GET.get('FromDate'),
#             'ToDate': request.GET.get('ToDate'),
#             'SearchStatus': request.GET.get('SearchStatus'),
#         }

#     def build_query(self, filters):
#         query = Q()

#         if filters['SearchbyFirstName']:
#             name_filter = filters['SearchbyFirstName']
#             query &= (
#                 Q(Registration_Id__PatientId__FirstName__icontains=name_filter) |
#                 Q(Registration_Id__PatientId__MiddleName__icontains=name_filter) |
#                 Q(Registration_Id__PatientId__SurName__icontains=name_filter) |
#                 Q(Registration_Id__PatientId__PhoneNo__icontains=name_filter)
#             )

#         if filters['SearchbySpeciality']:
#             query &= Q(Register_Id__Specialization__Speciality_Id__icontains=filters['SearchbySpeciality'])

#         if filters['SearchbyDoctor']:
#             query &= Q(Doctor_Id__Doctor_ID__icontains=filters['SearchbyDoctor'])

#         if filters['SearchStatus']:
#             query &= Q(Status=filters['SearchStatus'])

#         # Date filters
#         if filters['DateType'] == "Current" and filters['CurrentDate']:
#             query &= Q(created_at__date=filters['CurrentDate'])
#         elif filters['DateType'] == "Customize":
#             if filters['FromDate'] and filters['ToDate']:
#                 query &= Q(created_at__date__range=[filters['FromDate'], filters['ToDate']])
#             elif filters['FromDate']:
#                 query &= Q(created_at__date__gte=filters['FromDate'])
#             elif filters['ToDate']:
#                 query &= Q(created_at__date__lte=filters['ToDate'])

#         return query

#     def format_billing_data(self, queryset):
#         billing_data = []
#         for row in queryset:
#             patient = row.Registration_Id.PatientId
#             room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Registration_Id).last()
#             referral = Patient_Referral_Detials.objects.filter(IP_Register_Id__Registration_Id=row.Registration_Id.Registration_Id).first()

#             ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#             floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#             bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

#             full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
#             formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
#             doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Ratecard_Id.Doctor_ID).first()

#             # Category
#             if row.Registration_Id.PatientCategory == 'Insurance':
#                 categoryname = row.Registration_Id.InsuranceName.Insurance_Name
#                 categoryid = row.Registration_Id.InsuranceName.Insurance_Id
#             elif row.Registration_Id.PatientCategory == 'Client':
#                 categoryname = row.Registration_Id.ClientName.Client_Name
#                 categoryid = row.Registration_Id.ClientName.Client_Id
#             else:
#                 categoryname = None
#                 categoryid = None
            
#             # address_parts = [
#             #     row.Registration_Id.,
#             #     patient.Street,
#             #     patient.Area,
#             #     patient.City,
#             #     patient.State,
#             #     patient.Country,
#             #     patient.Pincode
#             # ]
#             # filtered_parts = [part for part in address_parts if part]  # Filter out None and empty strings
#             # print('address',filtered_parts)
#             billing_data.append({
#                 'id': row.BillingQueueList_ID,
#                 'VisitType': 'IP',
#                 'Status': row.Status,
#                 'Date': formatted_date,
#                 'Registration_Id': row.Registration_Id.Registration_Id,
#                 'PatientId': patient.PatientId,
#                 'PhoneNo': patient.PhoneNo,
#                 'Patient_Name': full_name,
#                 'Address': ', '.join(filter(None, [
#                     patient.DoorNo,
#                     patient.Street,
#                     patient.Area,
#                     patient.City,
#                     patient.State,
#                     patient.Country,
#                     patient.Pincode
#                 ])) or "No address available",
#                 'AgeGender': f'{patient.Age}/{patient.Gender}',
#                 'PatientCategory': row.Registration_Id.PatientCategory,
#                 'Doctor_ShortName': f"""{row.Doctor_Ratecard_Id.Doctor_ID.Tittle.Title_Name}.{row.Doctor_Ratecard_Id.Doctor_ID.First_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Middle_Name} {row.Doctor_Ratecard_Id.Doctor_ID.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Ratecard_Id else None,
#                 'Doctor_Id': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
#                 'Title': patient.Title.Title_Name,
#                 'FirstName': patient.FirstName,
#                 'MiddleName': patient.MiddleName,
#                 'SurName': patient.SurName,
#                 'Gender': patient.Gender,
#                 'DOB': patient.DOB,
#                 'Age': patient.Age,
#                 'Email': patient.Email,
#                 'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
#                 'Occupation': patient.Occupation,
#                 'Religion': patient.Religion.Religion_Id if patient.Religion else None,
#                 'Nationality': patient.Nationality,
#                 'UniqueIdType': patient.UniqueIdType,
#                 'UniqueIdNo': patient.UniqueIdNo,
#                 'Complaint': row.Registration_Id.Complaint,
#                 'PatientCategoryName': categoryname,
#                 'PatientCategoryId': categoryid,
#                 'DoorNo': patient.DoorNo,
#                 'Street': patient.Street,
#                 'Area': patient.Area,
#                 'City': patient.City,
#                 'State': patient.State,
#                 'Country': patient.Country,
#                 'Pincode': patient.Pincode,
#                 'WardName': ward_name,
#                 'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
#                 'AdmittionDate': row.Registration_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
#                 'ServiceProcedureForm': 'IP',
#             })

#         return billing_data


@method_decorator(csrf_exempt, name='dispatch')
class IPBillingFinalDetailsView(View):
 
    def get(self, request):
        try:
            # Get query parameters
            filters = self.extract_filters(request)
 
            # Construct query
            search_query = self.build_query(filters)
 
            # Fetch billing records excluding 'Vacated' and 'Booked' status
            billing_queryset = IP_Billing_QueueList_Detials.objects.exclude(Status__in=['Vacated', 'Booked']).filter(search_query)
 
            response_data = self.format_billing_data(billing_queryset)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
 
    def extract_filters(self, request):
        return {
            'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
            'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
            'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
            'DateType': request.GET.get('DateType'),
            'CurrentDate': request.GET.get('CurrentDate'),
            'FromDate': request.GET.get('FromDate'),
            'ToDate': request.GET.get('ToDate'),
            'SearchStatus': request.GET.get('SearchStatus'),
        }
 
    def build_query(self, filters):
        query = Q()
 
        if filters['SearchbyFirstName']:
            name_filter = filters['SearchbyFirstName']
            query &= (
                Q(Registration_Id__PatientId__FirstName__icontains=name_filter) |
                Q(Registration_Id__PatientId__MiddleName__icontains=name_filter) |
                Q(Registration_Id__PatientId__SurName__icontains=name_filter) |
                Q(Registration_Id__PatientId__PhoneNo__icontains=name_filter) |
                Q(Registration_Id__PatientId__PatientId__icontains=name_filter) |
                Q(Registration_Id__Registration_Id__iexact= f"""{'IP'}{name_filter}""") 
            )
 
        if filters['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=filters['SearchbySpeciality'])
 
        if filters['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=filters['SearchbyDoctor'])
 
        if filters['SearchStatus']:
            query &= Q(Status=filters['SearchStatus'])
 
        # Date filters
        if filters['DateType'] == "Current" and filters['CurrentDate']:
            query &= Q(created_at__date=filters['CurrentDate'])
        elif filters['DateType'] == "Customize":
            if filters['FromDate'] and filters['ToDate']:
                query &= Q(created_at__date__range=[filters['FromDate'], filters['ToDate']])
            elif filters['FromDate']:
                query &= Q(created_at__date=filters['FromDate'])
            elif filters['ToDate']:
                query &= Q(created_at__date=filters['ToDate'])
 
        return query
 
    def format_billing_data(self, queryset):
        billing_data = []
        for row in queryset:
            try:
                patient = row.Registration_Id.PatientId
                room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Registration_Id).last()
                referral = Patient_Referral_Detials.objects.filter(IP_Register_Id__Registration_Id=row.Registration_Id.Registration_Id).first()
 
                ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
                floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
                bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None
 
                full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
                formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
                doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Ratecard_Id.Doctor_ID).first()
 
                # Category with None checks to skip and proceed
                categoryname = None
                categoryid = None
                if row.Registration_Id.PatientCategory == 'Insurance':
                    if row.Registration_Id.InsuranceName:
                        categoryname = row.Registration_Id.InsuranceName.Insurance_Name
                        categoryid = row.Registration_Id.InsuranceName.Insurance_Id
                elif row.Registration_Id.PatientCategory == 'Client':
                    if row.Registration_Id.ClientName:
                        categoryname = row.Registration_Id.ClientName.Client_Name
                        categoryid = row.Registration_Id.ClientName.Client_Id
 
                # Doctor short name with None check for doc_info
                doctor_shortname = None
                if row.Doctor_Ratecard_Id:
                    title = row.Doctor_Ratecard_Id.Doctor_ID.Tittle.Title_Name if hasattr(row.Doctor_Ratecard_Id.Doctor_ID, 'Tittle') and row.Doctor_Ratecard_Id.Doctor_ID.Tittle else ''
                    first = row.Doctor_Ratecard_Id.Doctor_ID.First_Name or ''
                    middle = row.Doctor_Ratecard_Id.Doctor_ID.Middle_Name or ''
                    last = row.Doctor_Ratecard_Id.Doctor_ID.Last_Name or ''
                    qualification = f"({doc_info.Qualification})" if doc_info and doc_info.Qualification else ''
                    doctor_shortname = f"{title}.{first} {middle} {last}{qualification}"
 
                billing_data.append({
                    'id': row.BillingQueueList_ID,
                    'VisitType': 'IP',
                    'Status': row.Status,
                    'Date': formatted_date,
                    'Registration_Id': row.Registration_Id.Registration_Id,
                    'PatientId': patient.PatientId,
                    'PhoneNo': patient.PhoneNo,
                    'Patient_Name': full_name,
                    'Address': ', '.join(filter(None, [
                        patient.DoorNo,
                        patient.Street,
                        patient.Area,
                        patient.City,
                        patient.State,
                        patient.Country,
                        patient.Pincode
                    ])) or "No address available",
                    'AgeGender': f'{patient.Age}/{patient.Gender}',
                    'PatientCategory': row.Registration_Id.PatientCategory,
                    'Doctor_ShortName': doctor_shortname,
                    'Doctor_Id': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
                    'Title': patient.Title.Title_Name,
                    'FirstName': patient.FirstName,
                    'MiddleName': patient.MiddleName,
                    'SurName': patient.SurName,
                    'Gender': patient.Gender,
                    'DOB': patient.DOB,
                    'Age': patient.Age,
                    'Email': patient.Email,
                    'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
                    'Occupation': patient.Occupation,
                    'Religion': patient.Religion.Religion_Id if patient.Religion else None,
                    'Nationality': patient.Nationality,
                    'UniqueIdType': patient.UniqueIdType,
                    'UniqueIdNo': patient.UniqueIdNo,
                    'Complaint': row.Registration_Id.Complaint,
                    'PatientCategoryName': categoryname,
                    'PatientCategoryId': categoryid,
                    'DoorNo': patient.DoorNo,
                    'Street': patient.Street,
                    'Area': patient.Area,
                    'City': patient.City,
                    'State': patient.State,
                    'Country': patient.Country,
                    'Pincode': patient.Pincode,
                    'WardName': ward_name,
                    'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
                    'AdmittionDate': row.Registration_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                    'ServiceProcedureForm': 'IP',
                })
            except Exception as e:
                # Skip this row on error and continue with others
                print(f"Skipping row due to error: {str(e)}")
                continue
 
        return billing_data
 
 
 



@csrf_exempt
@require_http_methods(["GET"])
def Get_IP_Billing_Details_SingleId(request):
    try:
        QueueList_ID=request.GET.get('QueueList_ID')

        if not QueueList_ID:
            return JsonResponse({'error':'QueueList_ID is required'},status=400)
        try:
            row =IP_Billing_QueueList_Detials.objects.get(BillingQueueList_ID=QueueList_ID)
        
        except IP_Billing_QueueList_Detials.DoesNotExist:
            return JsonResponse ({'error': 'Billing data not found'}, status=404)

           
        full_name = f"{row.Registration_Id.PatientId.FirstName}"

        formatted_date = row.created_at.strftime("%d/%b/%Y")

        Billing_data={    
                'id':row.BillingQueueList_ID,
                'Billing_Type': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id':row.Registration_Id.Registration_Id,
                'PatientId':row.Registration_Id.PatientId.PatientId,
                'PhoneNo':row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name':full_name.strip(),
                'Gender':row.Registration_Id.PatientId.Gender,
                'DoorNo':row.Registration_Id.PatientId.DoorNo,
                'Age':row.Registration_Id.PatientId.Age,
                'Street':row.Registration_Id.PatientId.Street,
                'Area':row.Registration_Id.PatientId.Area,
                'City':row.Registration_Id.PatientId.City,
                'State':row.Registration_Id.PatientId.State,
                'Country':row.Registration_Id.PatientId.Country,
                'Pincode':row.Registration_Id.PatientId.Pincode,
                'VisitId':row.Registration_Id.VisitId,
                'PatientType':row.Registration_Id.PatientType,
                'PatientCategory':row.Registration_Id.PatientCategory,
                'Doctor_ID':row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID,
                'Doctor_ShortName':row.Doctor_Ratecard_Id.Doctor_ID.ShortName,
            }        
        return JsonResponse(Billing_data, safe=False)
    except Exception  as e:
        print({'error':str(e)})
        return JsonResponse ({'error':str(e)})

# @csrf_exempt
# @require_http_methods(['GET'])
# def IP_Billing_Service_List(request):
#     if request.method == "GET":
#         try:
#             # Initialize all cumulative variables at the start
#             cumulative_consultation = 0
#             cumulative_lab = 0
#             cumulative_radiology = 0
#             cumulative_general_services = 0
            
#             # Initialize other variables that might be used later
#             consultation_amount = 0
#             general_service_amount = 0
#             lab_amount = 0
#             radiology_amount = 0
#             discount_value_display = ""
#             discount_amount_display = ""
#             discount_value = 0
#             discount_amount = 0
#             Discountmethod = ""
#             final_rate = 0
#             roomamt = 0
#             nurseamt = 0
#             doctoramt = 0
#             nursecharges = 0
#             Doctorcharges = 0

#             QueueList_ID = request.GET.get('QueueList_ID')
#             print("QueueList_ID", QueueList_ID)
#             Billing_Invoice_No = request.GET.get('Billing_Invoice_No')
#             print("Billing_Invoice_No", Billing_Invoice_No)
            
#             if not Billing_Invoice_No:
#                 if not QueueList_ID:
#                     return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
                
#                 try:
#                     row = IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
#                 except IP_Billing_QueueList_Detials.DoesNotExist:
#                     return JsonResponse({'error': 'Billing data not found'}, status=404)
                
#                 full_name = f"""{row.Registration_Id.PatientId.Title.Title_Name}{"."}{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}"""
#                 formatted_date = row.created_at.strftime("%d/%b/%Y")
#                 Patientcategory = row.Registration_Id.PatientCategory

#                 Billing_data_list = []
#                 services_ins = Services_SubCat_Requests_Details.objects.filter(Registration_Id=QueueList_ID)
#                 services_list = []
#                 pharmacy_list = []
#                 cumulative_service_rate = 0

#                 print(services_ins, 'services_ins')

#                 for datas in services_ins:
#                     serviceid = datas.service_category_id
#                     category_ins = Service_Category_Masters.objects.get(pk=serviceid)

#                     print(serviceid, 'serviceid', category_ins, 'category_ins')
                    
#                     # Reset service-specific variables for each iteration
#                     consultation_amount = 0
#                     general_service_amount = 0
#                     lab_amount = 0
#                     radiology_amount = 0
                    
#                     if category_ins.ServiceCategory == 'ROOMSERVICES':
#                         Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
#                         ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
#                         data_list = {
#                             'id': datas.pk,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': f'{ward_ins.RoomNo} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}',         
#                             'rate': datas.rate,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y %I:%M %p')
#                         }
#                         services_list.append(data_list)

#                     elif category_ins.ServiceCategory == 'CONSULTATION':
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else ""
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        
#                         consultation_amount = 0  # Initialize

#                         if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
#                             if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
#                                 wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
#                                 print(wardfee, 'wardfee444444444')
#                                 consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
#                                 cumulative_consultation += consultation_amount

#                             elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
#                                 wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
#                                 consultation_amount = wardfee.Special_fee * datas.units if wardfee else 0
#                                 cumulative_consultation += consultation_amount

#                             else:
#                                 wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
#                                 consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
#                                 cumulative_consultation += consultation_amount

#                         elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
#                             insurancefee = InsuranceFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, insurance=row.Registration_Id.InsuranceName).first()
#                             consultation_amount = insurancefee.Consultation_Fee * datas.units if insurancefee else 0
#                             cumulative_consultation += consultation_amount

#                         elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
#                             clientfee = ClientFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, client=row.Registration_Id.ClientName).first()
#                             consultation_amount = clientfee.Consultation_Fee * datas.units if clientfee else 0
#                             cumulative_consultation += consultation_amount

#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else ""})',
#                             'rate': consultation_amount,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)      
                   
#                     elif category_ins.ServiceCategory == 'GENERALSERVICES':
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
#                         services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
                        
#                         general_service_amount = 0  # Initialize
                        
#                         if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
#                             if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
#                                 Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 if Wardfee:
#                                     general_service_amount = Wardfee.General_fee * datas.units
#                                 cumulative_general_services += general_service_amount
#                             elif row.Registration_Id.PatientId.PatientType.upper() in ['GOVT', 'VIP']:
#                                 wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 if wardfee:
#                                     general_service_amount = wardfee.Special_fee * datas.units
#                                 cumulative_general_services += general_service_amount
#                             else:
#                                 Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 if Wardfee:
#                                     general_service_amount = Wardfee.General_fee * datas.units
#                                 cumulative_general_services += general_service_amount
#                         elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
#                             insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard, Insurance=row.Registration_Id.InsuranceName).first()
#                             if insurancefee:
#                                 general_service_amount = insurancefee.Fee * datas.units
#                             cumulative_general_services += general_service_amount
#                         elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
#                             clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard, Client=row.Registration_Id.ClientName).first()
#                             if clientfee:
#                                 general_service_amount = clientfee.Fee * datas.units
#                             cumulative_general_services += general_service_amount
#                         else:
#                             # Fallback case if none of the above conditions are met
#                             general_service_amount = datas.rate * datas.units  # Use default rate from datas
#                             cumulative_general_services += general_service_amount

#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': General_services_ins.Service_Name,
#                             'rate': general_service_amount,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)
                    
#                     elif category_ins.ServiceCategory == 'PROCEDURES':
#                         General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
#                         general_service_amount = datas.rate * datas.units
#                         cumulative_general_services += general_service_amount
#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': General_services_ins.Procedure_Name,
#                             'rate': datas.rate,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)
                    
#                     else:
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
#                         services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
#                         general_service_amount = datas.rate * datas.units
#                         cumulative_general_services += general_service_amount
 
#                         if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
#                             if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
#                                 Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 general_service_amount = Wardfee.General_fee * datas.units if Wardfee else general_service_amount
#                                 cumulative_general_services += general_service_amount
#                             elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
#                                 wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 general_service_amount = wardfee.Special_fee * datas.units if wardfee else general_service_amount
#                                 cumulative_general_services += general_service_amount
#                             else:
#                                 Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 general_service_amount = Wardfee.General_fee * datas.units if Wardfee else general_service_amount
#                                 cumulative_general_services += general_service_amount
#                         elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
#                             insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard, Insurance=row.Registration_Id.InsuranceName).first()
#                             general_service_amount = insurancefee.Fee * datas.units if insurancefee else general_service_amount
#                             cumulative_general_services += general_service_amount
#                         elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
#                             clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard, Client=row.Registration_Id.ClientName).first()
#                             general_service_amount = clientfee.Fee * datas.units if clientfee else general_service_amount
#                             cumulative_general_services += general_service_amount

#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': General_services_ins.Service_Name,
#                             'rate': general_service_amount,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)

#                 for idx, services in enumerate(services_list, start=1):
#                     services["Sno"] = idx

#                 roomdatas = Patient_Admission_Room_Detials.objects.filter(
#                     IP_Registration_Id__pk= QueueList_ID, IsStayed=True
#                 ).exclude(Iscanceled=True)

#                 print(roomdatas, 'roomdatas')

#                 emp_datas = {
#                     'RoomDatas': [],
#                     'NurseCharges': [],
#                     'DutyDoctorCharges': [],
#                     'CumulativeDays': 0,
#                     'CumulativeHours': 0,
#                     'CumulativeTotalAmount': 0,
#                     'CumulativeDaysHours': '',
#                 }

#                 cumulative_days = 0
#                 cumulative_hours = 0
#                 cumulative_total_amount = 0
               
#                 for room in roomdatas:
#                     # Reset room-specific variables for each iteration
#                     days = 0
#                     hours = 0
#                     hours_to_charge = 0
#                     total_amount = 0
#                     nursecharges = 0
#                     Doctorcharges = 0
#                     discount_value_display = ""
#                     discount_amount_display = ""
#                     discount_value = 0
#                     discount_amount = 0
#                     Discountmethod = ""
#                     final_rate = 0
#                     roomamt = 0
#                     nurseamt = 0
#                     doctoramt = 0
#                     Calc_rounded_days = 0

#                     if room.Admitted_Date:
#                         admitted_date = room.Admitted_Date  
#                         discharge_date = room.Discharge_Date if room.Discharge_Date else None
    
#                         if discharge_date:
#                             difference = discharge_date - admitted_date
#                             days = difference.days
#                             hours, remainder = divmod(difference.seconds, 3600)
#                             calc_total_days = difference.total_seconds() / (24 * 60 * 60)
#                             Calc_rounded_days = math.ceil(calc_total_days)
#                         else:
#                             current_datetime = timezone.now()  
#                             difference = current_datetime - admitted_date
#                             days = difference.days
#                             hours, remainder = divmod(difference.seconds, 3600)
#                             calc_total_days = difference.total_seconds() / (24 * 60 * 60)
#                             Calc_rounded_days = math.ceil(calc_total_days)
    
#                     # Define hours-to-charge logic
#                     print(hours, 'room hours', Calc_rounded_days, calc_total_days)
#                     if hours > 12:
#                         hours_to_charge = 24
#                     else:
#                         hours_to_charge = 0
 
#                     current_datetime = timezone.now() 
#                     admitted_date_str = admitted_date.strftime('%d-%m-%y / %I-%M %p') if admitted_date else ""
#                     discharge_date_str = discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else current_datetime.strftime('%d-%m-%y / %I-%M %p')
#                     date_range = f"{admitted_date_str} - {discharge_date_str}" if admitted_date_str else ""

#                     # Calculate room charge
#                     total_amount = 0
#                     nursecharges = 0
#                     Doctorcharges = 0

#                     # ... rest of your room calculation logic remains the same
#                     # Make sure to initialize all variables before using them

#                     # Update cumulative totals
#                     cumulative_days += days
#                     cumulative_hours += hours
#                     cumulative_total_amount += total_amount

#                     SelectItemName = ''
 
#                     if room.RoomId.Ward_Name.Ward_Name.Type == 'WARD':
#                         SelectItemName = 'WARD CHARGES'
#                     elif room.RoomId.Ward_Name.Ward_Name.Type == 'ROOM':
#                         SelectItemName = 'ROOM CHARGES'
 
#                     # Construct room details object
#                     roomdetials = {
#                         'id': len(emp_datas['RoomDatas']) + 1,
#                         "WardName": room.RoomId.Ward_Name.Ward_Name.Ward_Name if room.RoomId.Ward_Name.Ward_Name else "",
#                         "RoomName": room.RoomId.Ward_Name.Ward_Name.Ward_Name if room.RoomId.Ward_Name.Ward_Name else "",
#                         "Room_No": room.RoomId.Ward_Name.RoomNo if room.RoomId.Ward_Name else "",
#                         "Bed_No": room.RoomId.Bed_No if room.RoomId else "",
#                         "Charge": int(roomamt),
#                         "Amount": int(roomamt),
#                         "Total_Current_Charge": round(total_amount, 2),
#                         "Admitted_Date": admitted_date_str,
#                         "Discharge_Date": discharge_date_str,
#                         "Days": f"{days} days, {hours} hours",
#                         "DateRange": date_range,
#                         "Total_amount": round(total_amount, 2),
#                         'isReimbursable': 'Yes',
#                         'SelectItemName': SelectItemName,
#                         'DiscountType': discount_value_display,
#                         'Discount': discount_value if discount_value else '-',
#                         'Discountamt': discount_amount_display,
#                         'Discountmethod': Discountmethod,
#                         'Discountval': discount_value,
#                         'Finalrate': round(final_rate, 2),
#                     }
 
#                     emp_datas['RoomDatas'].append(roomdetials)
 
#                 # Update cumulative totals in response
#                 emp_datas['CumulativeDays'] = cumulative_days
#                 emp_datas['CumulativeHours'] = cumulative_hours
#                 emp_datas['CumulativeTotalAmount'] = round(cumulative_total_amount, 2)
#                 emp_datas['CumulativeDaysHours'] = f"{cumulative_days} days, {cumulative_hours} hours"
 
#             # Filter the payments based on Billpay_method="Due" and Patient_Id_id=provided Patient_Id
#             pharmacy_details = IP_Pharmacy_Billing_Table_Detials.objects.filter(
#                 Bill_Status="Dueeeee",
#                 Patient_Id=row.Registration_Id.PatientId.PatientId,
#                 Register_Id=row.Registration_Id
#             )
            
#             for pharm in pharmacy_details:
#                 item_ins = IP_BillingItem.objects.filter(Billing=pharm.Billing_Invoice_No)
#                 print('pharmacy_details', item_ins)
#                 for item in item_ins:
#                     data_list = {
#                         'id': item.pk,
#                         'VoucherNo': item.Billing.Billing_Invoice_No if item.Billing else "",
#                         'category': 'Pharmacy',
#                         'service_subcategory': item.ItemName,
#                         'rate': item.Unit_Price,
#                         'total': item.Total,
#                         'Units': item.Billing_Quantity,
#                         'Date': item.Billing.created_at.strftime('%d-%m-%Y') if item.Billing else "",
#                         'isReimbursable': item.Reimbursable,
#                     }
#                     print('dataaaa', data_list)
#                     pharmacy_list.append(data_list)

#             roomdatas_last = Patient_Admission_Room_Detials.objects.filter(
#                 IP_Registration_Id__pk=QueueList_ID, Status=True, IsStayed=True
#             ).exclude(Iscanceled=True, CurrentlyStayed=True).last()
            
#             RoomType = roomdatas_last.RoomId.Ward_Name.Ward_Name.Type if roomdatas_last and roomdatas_last.RoomId else ""

#             ot_ins = OT_Billing.objects.filter(IP_Registration_Id=QueueList_ID)
#             OT_list = []
#             sno = 0

#             for datas in ot_ins:
#                 sno = sno + 1
#                 data_list = {
#                     'id': sno,
#                     'category': 'OT',
#                     'service_subcategory': f"""{datas.Service_name}({datas.Name})""",
#                     'rate': datas.Amount,
#                     'Units': datas.Quantity,
#                     'Date': datas.created_at.strftime('%d-%m-%Y'),
#                     'isReimbursable': 'Yes'
#                 }
#                 OT_list.append(data_list)

#             Labins = Interim_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id=QueueList_ID, Bill_Status='Due')
#             Lab_list = []
#             sno = 0

#             for labdata in Labins: 
#                 sno = sno + 1
#                 itemins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=labdata.Billing_Invoice_No, Service_Type='LAB')
#                 for datas in itemins:
#                     # Initialize discount variables
#                     discount_value_display = "-"
#                     discount_amount_display = "-"
#                     discount_value = 0
#                     Discountmethod = ""
#                     final_rate = 0

#                     rate = datas.Total_Amount if datas else 0
#                     final_rate = rate  
#                     discount_amount = 0

#                     discount_type = datas.Discount_Type if datas else None
#                     discount_value = datas.Discount_Value if datas else 0

#                     if discount_type and discount_value:
#                         if discount_type.lower() == "percentage":
#                             discount_amount = (rate * discount_value) / 100
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                             Discountmethod = 'PERCENTAGE'
#                         elif discount_type.lower() == "flat":
#                             discount_amount = discount_value
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                             Discountmethod = 'FLATAMOUNT'

#                         discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                     else:
#                         discount_value_display = "-"
#                         discount_amount_display = "-"

#                     data_list = {
#                         'id': sno,
#                         'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
#                         'Requestid': labdata.pk,
#                         'category': 'LAB',
#                         'service_subcategory': datas.Service_Name,
#                         'servicecode': datas.Service_Code,
#                         'Charges': datas.Charge,
#                         'rate': datas.Amount,
#                         'Units': datas.Quantity,
#                         'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
#                         'isReimbursable': 'Yes',
#                         'Discountmethod': datas.Discount_Type,
#                         'DiscountType': discount_value_display,
#                         'Discount': discount_value if discount_value else '-',
#                         'Discountamt': datas.Discount_Amount,
#                         'Finalrate': round(datas.Total_Amount, 2),
#                         'Discountmethod': Discountmethod,
#                         'Discountval': discount_value,
#                     }
#                     Lab_list.append(data_list)

#             radins = Radiology_Request_Details.objects.filter(IP_Register_Id__Registration_Id=QueueList_ID, Status__in=['Due'])
#             Rad_list = []
#             sno = 0

#             for datas in radins:
#                 if datas.Interim_Billing_Invoice_No != '':
#                     sno = sno + 1

#                     # Initialize variables
#                     discount_value_display = "-"
#                     discount_amount_display = "-"
#                     discount_value = 0
#                     Discountmethod = ""
#                     final_rate = 0
#                     rate = 0

#                     Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
#                     Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='RADIOLOGY',
#                         Patient_Type=row.Registration_Id.PatientCategory
#                     ).first()

#                     RadDiscount = None
#                     print(Discount, 'Discount')

#                     if Discount:
#                         RadDiscount = Discount_Radiology_Fee.objects.filter(
#                             discount__Discount_ID=Discount.Discount_ID,
#                             Radiology_Test_Id__Room_Id__Test_Code=datas.SubTestCode
#                         ).first()
#                         print(RadDiscount, 'RadDiscount')

#                     rate = Test.Amount if Test else 0
#                     final_rate = rate  
#                     discount_amount = 0  

#                     discount_type = RadDiscount.discount_method if RadDiscount else None
#                     discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

#                     if discount_type and discount_value:
#                         if discount_type.lower() == "percentage":
#                             discount_amount = (rate * discount_value) / 100
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                             Discountmethod = 'PERCENTAGE'
#                         elif discount_type.lower() == "flat":
#                             discount_amount = discount_value
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                             Discountmethod = 'FLATAMOUNT'

#                         discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                     else:
#                         discount_value_display = "-"
#                         discount_amount_display = "-"

#                     print(datas.Interim_Billing_Invoice_No.Discount_Amount if datas.Interim_Billing_Invoice_No else "", ' dis amt for rad')

#                     raditem = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=datas.Interim_Billing_Invoice_No, Service_Code=datas.SubTestCode).first()

#                     data_list = {
#                         'sno': sno,
#                         'VoucherNo': datas.Interim_Billing_Invoice_No.Billing_Invoice_No if datas.Interim_Billing_Invoice_No else "",
#                         'category': 'RADIOLOGY',
#                         'service_subcategory': f"""{Dep.Radiology_Name if Dep else ''}({Test.Test_Name if Test else ''})""",
#                         'servicecode': datas.SubTestCode,
#                         'rate': rate,
#                         'Units': 1,
#                         'Date': datas.created_at.strftime('%d-%m-%Y'),
#                         'isReimbursable': 'Yes',
#                         'Requestid': datas.pk,
#                         'DiscountType': discount_value_display,
#                         'Discount': discount_value if discount_value else '-',
#                         'Discountamt': raditem.Discount_Amount if raditem else "",
#                         'Finalrate': raditem.Total_Amount if raditem else "",
#                         'Discountmethod': Discountmethod,
#                         'Discountval': discount_value,
#                     }
#                     Rad_list.append(data_list)

#             radins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Register_Id__Registration_Id=QueueList_ID).exclude(Service_Type__in=["RADIOLOGY", "Radiology", 'LAB', 'Lab'])
#             print('intttt', radins)
#             Interim_list = []
#             sno = 0

#             for datas in radins:
#                 sno = sno + 1
#                 data_list = {
#                     'sno': sno,
#                     'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
#                     'category': datas.Service_Type,
#                     'service_subcategory': datas.Service_Name,
#                     'servicecode': datas.Service_Code,
#                     'rate': datas.Amount,
#                     'Units': 1,
#                     'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
#                     'isReimbursable': 'Yes',
#                 }
#                 Interim_list.append(data_list)
           
#             Billing_data = {    
#                 'id': row.BillingQueueList_ID,
#                 'Billing_Type': row.Billing_Type,
#                 'Status': row.Status,
#                 'Date': formatted_date,
#                 'Registration_Id': row.Registration_Id.Registration_Id,
#                 'PatientId': row.Registration_Id.PatientId.PatientId,
#                 'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
#                 'Patient_Name': full_name.strip(),
#                 'Gender': row.Registration_Id.PatientId.Gender,
#                 'DoorNo': row.Registration_Id.PatientId.DoorNo,
#                 'Age': row.Registration_Id.PatientId.Age,
#                 'Street': row.Registration_Id.PatientId.Street,
#                 'Area': row.Registration_Id.PatientId.Area,
#                 'City': row.Registration_Id.PatientId.City,
#                 'State': row.Registration_Id.PatientId.State,
#                 'Country': row.Registration_Id.PatientId.Country,
#                 'Pincode': row.Registration_Id.PatientId.Pincode,
#                 'PatientType': row.Registration_Id.PatientId.PatientType,
#                 'PatientCategory': row.Registration_Id.PatientCategory,
#                 'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
#                 'Doctor_ShortName': row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
#                 'WardName': roomdatas_last.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdatas_last and roomdatas_last.RoomId else "",
#                 'ROOMNo': roomdatas_last.RoomId.Ward_Name.RoomNo if roomdatas_last and roomdatas_last.RoomId else "",
#                 'BedNo': roomdatas_last.RoomId.Bed_No if roomdatas_last and roomdatas_last.RoomId else ""
#             }
            
#             ip_bill_service_data = {
#                 'Billing_data_list': Billing_data_list,
#                 'Billing_data': Billing_data,
#                 'Room_data': emp_datas,
#                 'services': services_list,
#                 'pharmacy_list': pharmacy_list,
#                 'CumulativeConsultation': round(cumulative_consultation, 2),
#                 'CumulativeLab': round(cumulative_lab, 2),
#                 'CumulativeRadiology': round(cumulative_radiology, 2),
#                 'CumulativeGeneralServices': round(cumulative_general_services, 2),
#                 'OT_data': OT_list,
#                 'Lab_list': Lab_list,
#                 'Rad_list': Rad_list,
#                 'InterimList': Interim_list,
#             }    
            
#             return JsonResponse(ip_bill_service_data, safe=False)
        
#         except Exception as e:
#             return JsonResponse({"error": str(e)})


@csrf_exempt
@require_http_methods(['GET'])
def IP_Billing_Service_List(request):
    if request.method == "GET":
        try:
            # Initialize all cumulative variables at the start
            cumulative_consultation = 0
            cumulative_lab = 0
            cumulative_radiology = 0
            cumulative_general_services = 0
            
            # Initialize other variables that might be used later
            consultation_amount = 0
            general_service_amount = 0
            lab_amount = 0
            radiology_amount = 0
            discount_value_display = ""
            discount_amount_display = ""
            discount_value = 0
            discount_amount = 0
            Discountmethod = ""
            final_rate = 0
            roomamt = 0
            nurseamt = 0
            doctoramt = 0
            nursecharges = 0
            Doctorcharges = 0

            QueueList_ID = request.GET.get('QueueList_ID')
            print("QueueList_ID", QueueList_ID)
            Billing_Invoice_No = request.GET.get('Billing_Invoice_No')
            print("Billing_Invoice_No", Billing_Invoice_No)
            
            if not Billing_Invoice_No:
                if not QueueList_ID:
                    return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
                
                try:
                    row = IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
                except IP_Billing_QueueList_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Billing data not found'}, status=404)
                
                full_name = f"""{row.Registration_Id.PatientId.Title.Title_Name}{"."}{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}"""
                formatted_date = row.created_at.strftime("%d/%b/%Y")
                Patientcategory = row.Registration_Id.PatientCategory

                Billing_data_list = []
                services_ins = Services_SubCat_Requests_Details.objects.filter(Registration_Id=QueueList_ID)
                services_list = []
                pharmacy_list = []
                cumulative_service_rate = 0

                print(services_ins, 'services_ins')

                for datas in services_ins:
                    serviceid = datas.service_category_id
                    category_ins = Service_Category_Masters.objects.get(pk=serviceid)

                    print(serviceid, 'serviceid', category_ins, 'category_ins')
                    
                    # Reset service-specific variables for each iteration
                    consultation_amount = 0
                    general_service_amount = 0
                    lab_amount = 0
                    radiology_amount = 0
                    
                    if category_ins.ServiceCategory == 'ROOMSERVICES':
                        Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
                        ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
                        data_list = {
                            'id': datas.pk,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': f'{ward_ins.RoomNo} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}',         
                            'rate': datas.rate,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y %I:%M %p')
                        }
                        services_list.append(data_list)

                    elif category_ins.ServiceCategory == 'CONSULTATION':
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else ""
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        
                        consultation_amount = 0  # Initialize

                        if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
                            if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
                                print(wardfee, 'wardfee444444444')
                                consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
                                cumulative_consultation += consultation_amount

                            elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
                                consultation_amount = wardfee.Special_fee * datas.units if wardfee else 0
                                cumulative_consultation += consultation_amount

                            else:
                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
                                consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
                                cumulative_consultation += consultation_amount

                        elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
                            insurancefee = InsuranceFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, insurance=row.Registration_Id.InsuranceName).first()
                            consultation_amount = insurancefee.Consultation_Fee * datas.units if insurancefee else 0
                            cumulative_consultation += consultation_amount

                        elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
                            clientfee = ClientFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, client=row.Registration_Id.ClientName).first()
                            consultation_amount = clientfee.Consultation_Fee * datas.units if clientfee else 0
                            cumulative_consultation += consultation_amount

                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else ""})',
                            'rate': consultation_amount,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)      
                   
                    elif category_ins.ServiceCategory == 'GENERALSERVICES':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
                        services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
                        
                        general_service_amount = 0  # Initialize
                        
                        if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
                            if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                if Wardfee:
                                    general_service_amount = Wardfee.General_fee * datas.units
                                cumulative_general_services += general_service_amount
                            elif row.Registration_Id.PatientId.PatientType.upper() in ['GOVT', 'VIP']:
                                wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                if wardfee:
                                    general_service_amount = wardfee.Special_fee * datas.units
                                cumulative_general_services += general_service_amount
                            else:
                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                if Wardfee:
                                    general_service_amount = Wardfee.General_fee * datas.units
                                cumulative_general_services += general_service_amount
                        elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
                            insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard, Insurance=row.Registration_Id.InsuranceName).first()
                            if insurancefee:
                                general_service_amount = insurancefee.Fee * datas.units
                            cumulative_general_services += general_service_amount
                        elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
                            clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard, Client=row.Registration_Id.ClientName).first()
                            if clientfee:
                                general_service_amount = clientfee.Fee * datas.units
                            cumulative_general_services += general_service_amount
                        else:
                            # Fallback case if none of the above conditions are met
                            general_service_amount = datas.rate * datas.units  # Use default rate from datas
                            cumulative_general_services += general_service_amount

                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': General_services_ins.Service_Name,
                            'rate': general_service_amount,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)
                    
                    elif category_ins.ServiceCategory == 'PROCEDURES':
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
                        general_service_amount = datas.rate * datas.units
                        cumulative_general_services += general_service_amount
                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': General_services_ins.Procedure_Name,
                            'rate': datas.rate,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)
                    
                    else:
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
                        services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
                        general_service_amount = datas.rate * datas.units
                        cumulative_general_services += general_service_amount
 
                        if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
                            if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                general_service_amount = Wardfee.General_fee * datas.units if Wardfee else general_service_amount
                                cumulative_general_services += general_service_amount
                            elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
                                wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                general_service_amount = wardfee.Special_fee * datas.units if wardfee else general_service_amount
                                cumulative_general_services += general_service_amount
                            else:
                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                general_service_amount = Wardfee.General_fee * datas.units if Wardfee else general_service_amount
                                cumulative_general_services += general_service_amount
                        elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
                            insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard, Insurance=row.Registration_Id.InsuranceName).first()
                            general_service_amount = insurancefee.Fee * datas.units if insurancefee else general_service_amount
                            cumulative_general_services += general_service_amount
                        elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
                            clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard, Client=row.Registration_Id.ClientName).first()
                            general_service_amount = clientfee.Fee * datas.units if clientfee else general_service_amount
                            cumulative_general_services += general_service_amount

                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': General_services_ins.Service_Name,
                            'rate': general_service_amount,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)

                for idx, services in enumerate(services_list, start=1):
                    services["Sno"] = idx

                roomdatas = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__pk= QueueList_ID, IsStayed=True
                ).exclude(Iscanceled=True)

                print(roomdatas, 'roomdatas')

                emp_datas = {
                    'RoomDatas': [],
                    'NurseCharges': [],
                    'DutyDoctorCharges': [],
                    'CumulativeDays': 0,
                    'CumulativeHours': 0,
                    'CumulativeTotalAmount': 0,
                    'CumulativeDaysHours': '',
                }

                cumulative_days = 0
                cumulative_hours = 0
                cumulative_total_amount = 0
               
                for room in roomdatas:
                    # Reset room-specific variables for each iteration
                    days = 0
                    hours = 0
                    hours_to_charge = 0
                    total_amount = 0
                    nursecharges = 0
                    Doctorcharges = 0
                    discount_value_display = ""
                    discount_amount_display = ""
                    discount_value = 0
                    discount_amount = 0
                    Discountmethod = ""
                    final_rate = 0
                    roomamt = 0
                    nurseamt = 0
                    doctoramt = 0
                    Calc_rounded_days = 0

                    if room.Admitted_Date:
                        admitted_date = room.Admitted_Date  
                        discharge_date = room.Discharge_Date if room.Discharge_Date else None
    
                        if discharge_date:
                            difference = discharge_date - admitted_date
                            days = difference.days
                            hours, remainder = divmod(difference.seconds, 3600)
                            calc_total_days = difference.total_seconds() / (24 * 60 * 60)
                            Calc_rounded_days = math.ceil(calc_total_days)
                        else:
                            current_datetime = timezone.now()  
                            difference = current_datetime - admitted_date
                            days = difference.days
                            hours, remainder = divmod(difference.seconds, 3600)
                            calc_total_days = difference.total_seconds() / (24 * 60 * 60)
                            Calc_rounded_days = math.ceil(calc_total_days)
    
                    # Define hours-to-charge logic
                    print(hours, 'room hours', Calc_rounded_days, calc_total_days)
                    if hours > 12:
                        hours_to_charge = 24
                    else:
                        hours_to_charge = 0
 
                    current_datetime = timezone.now() 
                    admitted_date_str = admitted_date.strftime('%d-%m-%y / %I-%M %p') if admitted_date else ""
                    discharge_date_str = discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else current_datetime.strftime('%d-%m-%y / %I-%M %p')
                    date_range = f"{admitted_date_str} - {discharge_date_str}" if admitted_date_str else ""

                    # Calculate room charge
                    total_amount = 0
                    nursecharges = 0
                    Doctorcharges = 0

                    # ... rest of your room calculation logic remains the same
                    # Make sure to initialize all variables before using them

                    # Update cumulative totals
                    cumulative_days += days
                    cumulative_hours += hours
                    cumulative_total_amount += total_amount

                    SelectItemName = ''
 
                    if room.RoomId.Ward_Name.Ward_Name.Type == 'WARD':
                        SelectItemName = 'WARD CHARGES'
                    elif room.RoomId.Ward_Name.Ward_Name.Type == 'ROOM':
                        SelectItemName = 'ROOM CHARGES'
 
                    # Construct room details object
                    roomdetials = {
                        'id': len(emp_datas['RoomDatas']) + 1,
                        "WardName": room.RoomId.Ward_Name.Ward_Name.Ward_Name if room.RoomId.Ward_Name.Ward_Name else "",
                        "RoomName": room.RoomId.Ward_Name.Ward_Name.Ward_Name if room.RoomId.Ward_Name.Ward_Name else "",
                        "Room_No": room.RoomId.Ward_Name.RoomNo if room.RoomId.Ward_Name else "",
                        "Bed_No": room.RoomId.Bed_No if room.RoomId else "",
                        "Charge": int(roomamt),
                        "Amount": int(roomamt),
                        "Total_Current_Charge": round(total_amount, 2),
                        "Admitted_Date": admitted_date_str,
                        "Discharge_Date": discharge_date_str,
                        "Days": f"{days} days, {hours} hours",
                        "DateRange": date_range,
                        "Total_amount": round(total_amount, 2),
                        'isReimbursable': 'Yes',
                        'SelectItemName': SelectItemName,
                        'DiscountType': discount_value_display,
                        'Discount': discount_value if discount_value else '-',
                        'Discountamt': discount_amount_display,
                        'Discountmethod': Discountmethod,
                        'Discountval': discount_value,
                        'Finalrate': round(final_rate, 2),
                    }
 
                    emp_datas['RoomDatas'].append(roomdetials)
 
                # Update cumulative totals in response
                emp_datas['CumulativeDays'] = cumulative_days
                emp_datas['CumulativeHours'] = cumulative_hours
                emp_datas['CumulativeTotalAmount'] = round(cumulative_total_amount, 2)
                emp_datas['CumulativeDaysHours'] = f"{cumulative_days} days, {cumulative_hours} hours"
 
            # Filter the payments based on Billpay_method="Due" and Patient_Id_id=provided Patient_Id
            pharmacy_details = IP_Pharmacy_Billing_Table_Detials.objects.filter(
                Bill_Status="Dueeeee",
                Patient_Id=row.Registration_Id.PatientId.PatientId,
                Register_Id=row.Registration_Id
            )
            
            for pharm in pharmacy_details:
                item_ins = IP_BillingItem.objects.filter(Billing=pharm.Billing_Invoice_No)
                print('pharmacy_details', item_ins)
                for item in item_ins:
                    data_list = {
                        'id': item.pk,
                        'VoucherNo': item.Billing.Billing_Invoice_No if item.Billing else "",
                        'category': 'Pharmacy',
                        'service_subcategory': item.ItemName,
                        'rate': item.Unit_Price,
                        'total': item.Total,
                        'Units': item.Billing_Quantity,
                        'Date': item.Billing.created_at.strftime('%d-%m-%Y') if item.Billing else "",
                        'isReimbursable': item.Reimbursable,
                    }
                    print('dataaaa', data_list)
                    pharmacy_list.append(data_list)

            roomdatas_last = Patient_Admission_Room_Detials.objects.filter(
                IP_Registration_Id__pk=QueueList_ID, Status=True, IsStayed=True
            ).exclude(Iscanceled=True, CurrentlyStayed=True).last()
            
            RoomType = roomdatas_last.RoomId.Ward_Name.Ward_Name.Type if roomdatas_last and roomdatas_last.RoomId else ""

            ot_ins = OT_Billing.objects.filter(IP_Registration_Id=QueueList_ID)
            OT_list = []
            sno = 0

            for datas in ot_ins:
                sno = sno + 1
                data_list = {
                    'id': sno,
                    'category': 'OT',
                    'service_subcategory': f"""{datas.Service_name}({datas.Name})""",
                    'rate': datas.Amount,
                    'Units': datas.Quantity,
                    'Date': datas.created_at.strftime('%d-%m-%Y'),
                    'isReimbursable': 'Yes'
                }
                OT_list.append(data_list)

            Labins = Interim_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id=QueueList_ID, Bill_Status='Due')
            Lab_list = []
            sno = 0

            for labdata in Labins: 
                sno = sno + 1
                itemins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=labdata.Billing_Invoice_No, Service_Type='LAB')
                for datas in itemins:
                    # Initialize discount variables
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    discount_value = 0
                    Discountmethod = ""
                    final_rate = 0

                    rate = datas.Total_Amount if datas else 0
                    final_rate = rate  
                    discount_amount = 0

                    discount_type = datas.Discount_Type if datas else None
                    discount_value = datas.Discount_Value if datas else 0

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

                        discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                    else:
                        discount_value_display = "-"
                        discount_amount_display = "-"

                    data_list = {
                        'id': sno,
                        'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
                        'Requestid': labdata.pk,
                        'category': 'LAB',
                        'service_subcategory': datas.Service_Name,
                        'servicecode': datas.Service_Code,
                        'Charges': datas.Charge,
                        'rate': datas.Amount,
                        'Units': datas.Quantity,
                        'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
                        'isReimbursable': 'Yes',
                        'Discountmethod': datas.Discount_Type,
                        'DiscountType': discount_value_display,
                        'Discount': discount_value if discount_value else '-',
                        'Discountamt': datas.Discount_Amount,
                        'Finalrate': round(datas.Total_Amount, 2),
                        'Discountmethod': Discountmethod,
                        'Discountval': discount_value,
                        'CGHScode' : datas.CGHS_CODE

                    }
                    Lab_list.append(data_list)

            radins = Radiology_Request_Details.objects.filter(IP_Register_Id__Registration_Id=QueueList_ID, Status__in=['Due'])
            Rad_list = []
            sno = 0

            for datas in radins:
                if datas.Interim_Billing_Invoice_No != '':
                    sno = sno + 1

                    # Initialize variables
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    discount_value = 0
                    Discountmethod = ""
                    final_rate = 0
                    rate = 0

                    Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
                    Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='RADIOLOGY',
                        Patient_Type=row.Registration_Id.PatientCategory
                    ).first()

                    RadDiscount = None
                    print(Discount, 'Discount')

                    if Discount:
                        RadDiscount = Discount_Radiology_Fee.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Radiology_Test_Id__Room_Id__Test_Code=datas.SubTestCode
                        ).first()
                        print(RadDiscount, 'RadDiscount')

                    rate = Test.Amount if Test else 0
                    final_rate = rate  
                    discount_amount = 0  

                    discount_type = RadDiscount.discount_method if RadDiscount else None
                    discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

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

                        discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                    else:
                        discount_value_display = "-"
                        discount_amount_display = "-"

                    print(datas.Interim_Billing_Invoice_No.Discount_Amount if datas.Interim_Billing_Invoice_No else "", ' dis amt for rad')

                    raditem = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=datas.Interim_Billing_Invoice_No, Service_Code=datas.SubTestCode).first()

                    data_list = {
                        'sno': sno,
                        'VoucherNo': datas.Interim_Billing_Invoice_No.Billing_Invoice_No if datas.Interim_Billing_Invoice_No else "",
                        'category': 'RADIOLOGY',
                        'service_subcategory': f"""{Dep.Radiology_Name if Dep else ''}({Test.Test_Name if Test else ''})""",
                        'servicecode': datas.SubTestCode,
                        'rate': rate,
                        'Units': 1,
                        'Date': datas.created_at.strftime('%d-%m-%Y'),
                        'isReimbursable': 'Yes',
                        'Requestid': datas.pk,
                        'DiscountType': discount_value_display,
                        'Discount': discount_value if discount_value else '-',
                        'Discountamt': raditem.Discount_Amount if raditem else "",
                        'Finalrate': raditem.Total_Amount if raditem else "",
                        'Discountmethod': Discountmethod,
                        'Discountval': discount_value,
                        'CGHScode' : raditem.CGHS_CODE
                    }
                    Rad_list.append(data_list)

            radins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Register_Id__Registration_Id=QueueList_ID).exclude(Service_Type__in=["RADIOLOGY", "Radiology", 'LAB', 'Lab'])
            print('intttt', radins)
            Interim_list = []
            sno = 0

            for datas in radins:
                sno = sno + 1
                data_list = {
                    'sno': sno,
                    'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
                    'category': datas.Service_Type,
                    'service_subcategory': datas.Service_Name,
                    'servicecode': datas.Service_Code,
                    'rate': datas.Amount,
                    'Units': 1,
                    'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
                    'isReimbursable': 'Yes',
                    'CGHScode' : datas.CGHS_CODE
                }
                Interim_list.append(data_list)
           
            Billing_data = {    
                'id': row.BillingQueueList_ID,
                'Billing_Type': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id': row.Registration_Id.Registration_Id,
                'PatientId': row.Registration_Id.PatientId.PatientId,
                'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name': full_name.strip(),
                'Gender': row.Registration_Id.PatientId.Gender,
                'DoorNo': row.Registration_Id.PatientId.DoorNo,
                'Age': row.Registration_Id.PatientId.Age,
                'Street': row.Registration_Id.PatientId.Street,
                'Area': row.Registration_Id.PatientId.Area,
                'City': row.Registration_Id.PatientId.City,
                'State': row.Registration_Id.PatientId.State,
                'Country': row.Registration_Id.PatientId.Country,
                'Pincode': row.Registration_Id.PatientId.Pincode,
                'PatientType': row.Registration_Id.PatientId.PatientType,
                'PatientCategory': row.Registration_Id.PatientCategory,
                'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
                'Doctor_ShortName': row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
                'WardName': roomdatas_last.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdatas_last and roomdatas_last.RoomId else "",
                'ROOMNo': roomdatas_last.RoomId.Ward_Name.RoomNo if roomdatas_last and roomdatas_last.RoomId else "",
                'BedNo': roomdatas_last.RoomId.Bed_No if roomdatas_last and roomdatas_last.RoomId else ""
            }
            
            ip_bill_service_data = {
                'Billing_data_list': Billing_data_list,
                'Billing_data': Billing_data,
                'Room_data': emp_datas,
                'services': services_list,
                'pharmacy_list': pharmacy_list,
                'CumulativeConsultation': round(cumulative_consultation, 2),
                'CumulativeLab': round(cumulative_lab, 2),
                'CumulativeRadiology': round(cumulative_radiology, 2),
                'CumulativeGeneralServices': round(cumulative_general_services, 2),
                'OT_data': OT_list,
                'Lab_list': Lab_list,
                'Rad_list': Rad_list,
                'InterimList': Interim_list,
            }    
            
            return JsonResponse(ip_bill_service_data, safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)})




from Lab.BillingView import get_invoice_master_barcode


@method_decorator(csrf_exempt, name='dispatch')
class IPBillingLinkView(View):
    def __init__(self):
        self.doctor = None
        self.patient = None
        self.register = None

    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)

    def get_related_objects(self, data):
        """Get required foreign key objects"""
        try:
            self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
            self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
            self.register = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
            )
            return True
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Registration not found'})

    def create_billing_receipt(self, ip_billing,billing_data, total_amount, balance_amount, paid_amount, created_by):
        """Create billing receipt record"""
        return IPBillingReceipt.objects.create(
            Invoice_NO=ip_billing,
            PatientID=self.patient.PatientId,
            PhoneNumber=self.patient.PhoneNo,
            Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
            TotalAmount=total_amount,
            TotalPaidAmount=total_amount,
            BalanceAmount=balance_amount,
            Billing_Date=billing_data.get('InvoiceDate'),
            PaidAmount=paid_amount,
            Billedby=created_by
        )

    def save_payment_details(self, payment_data, receipt):
        """Save payment details"""
        return Multiple_Payment_Table_IP_Detials.objects.create(
            Invoice_No=receipt,
            Payment_Type=payment_data.get('Billpay_method'),
            Cart_Type=payment_data.get('CardType'),
            Card_No=payment_data.get('CardNo'),
            TransactionId=payment_data.get('TransactionId'),
            upiid=payment_data.get('upiid'),
            Cheque_No=payment_data.get('ChequeNo'),
            Bank_Name=payment_data.get('BankName'),
            Amount=self.safe_to_decimal(payment_data.get('paidamount')),
            Transaction_Amount=self.safe_to_decimal(payment_data.get('transactionFee')),
            AdditionalAmount=self.safe_to_decimal(payment_data.get('Additionalamount'))
        )

    def save_billing_items(self, items, billing,new_bill_status):
        """Save billing items"""
        for item in items:
            IP_Billing_Items_Table_Detials.objects.create(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType').upper(),
                Service_Code= item.get('TestCode') or item.get('Test_Code') or item.get('Group_Code') or item.get('ServiceSubCatId'),
                Service_Name=item.get('SelectItemName'),
                Rate=self.safe_to_decimal(item.get('Rate')),
                Charge=self.safe_to_decimal(item.get('Charges')),
                Quantity=item.get('Quantity', 1),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Type=item.get('Discountmethod'),
                Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
                Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                Item_Status=new_bill_status,
                IsReimbursable=item.get('isReimbursable'),
                Billing_Type = 'DailyBill'
            )

    def save_interim_billing_items(self, items, billing,new_bill_status):
        """Save billing items"""
        print('interimmmmitems')
        for item in items:

            scode = item.get('servicecode') or item.get('TestCode')
            print(scode,'scode')
            Interim_Billing_Items_Table_Detials.objects.create(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType').upper(),
                Service_Code=item.get('TestCode') or item.get('Test_Code') or item.get('Group_Code') or item.get('ServiceSubCatId'),
                Service_Name=item.get('SelectItemName'),
                Rate=self.safe_to_decimal(item.get('Rate')),
                Charge=self.safe_to_decimal(item.get('Charges')),
                Quantity=item.get('Quantity', 1),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Type=item.get('Discountmethod'),
                Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
                Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                Item_Status=new_bill_status,
                IsReimbursable=item.get('isReimbursable')
            )
    def Radiology_Requestlink_Billing(self,select_data,ip_billing,new_bill_status,created_by):
        print('ucjcjvjhcj')
        for item in select_data:
            if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
                Test_Code = (item.get('ServiceSubCatId') or "").strip()
                RegisterType = "IP"
                try:
                    testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                    Radiology_Request_Details.objects.create(
                        RegisterType = RegisterType,
                        OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=self.register if RegisterType == "IP" else None,
                        Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=item.get('ServiceSubCatId').strip(),
                        created_by=created_by,
                        Status = new_bill_status,
                        IP_Billing_Invoice_No = ip_billing 
                    )
                except TestName_Details.DoesNotExist:
                    print(f"TestName_Details not found for Test_Code: {Test_Code}")

    def Radiology_Requestlink_InterimBilling(self,select_data,ip_billing,new_bill_status,created_by):
        print('ucjcjvjhcj')
        for item in select_data:
            if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
                Test_Code = (item.get('ServiceSubCatId') or "").strip()
                RegisterType = "IP"
                try:
                    testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                    Radiology_Request_Details.objects.create(
                        RegisterType = RegisterType,
                        OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=self.register if RegisterType == "IP" else None,
                        Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=item.get('ServiceSubCatId').strip(),
                        created_by=created_by,
                        Status = new_bill_status,
                        Interim_Billing_Invoice_No = ip_billing 
                    )
                except TestName_Details.DoesNotExist:
                    print(f"TestName_Details not found for Test_Code: {Test_Code}")


    def Lab_Request_Detailslink_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location):
        try:
            print('/////////////////////////////labbbbbb')
            # print('dberger',item)
            print('yvbhjkb',SelectedPatient_list.get('RegisterId'))
            print('yvbhjkb',item)
            service_types = []
            for i in item:
                print('uyfuygkj')
                service_types.append(i.get('ServiceType'))
            if 'LAB' in service_types:
                print('vyujhbf')
                created_by = Created_by
                registration_id = SelectedPatient_list.get('RegisterId')

                register_type = "IP"
                # register_type = data.get('RegisterType', 'OP')
                SelectedTest = item
                location = location.Location_Id
                # Remarks = data.get("Remarks",'')

                # print('dberger',item)
                print('yvbhjkb',registration_id)
                print('uvbkjnk',SelectedTest)
                # print('dberger',item)
                # register_type = item.get('type')


                if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
                    return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})

                # Prepare the arguments based on the register type
                register_kwargs = {'RegisterType': register_type}
                if register_type == 'OP':
                    try:
                        print('xxxxxxxxxxxxxxxxxxx')
                        op_register_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['OP_Register_Id'] = op_register_instance
                    except Patient_Appointment_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'OP Registration ID not found'})

                elif register_type == 'IP':
                    try:
                        ip_register_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['IP_Register_Id'] = ip_register_instance
                    except Patient_IP_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'IP Registration ID not found'})

                elif register_type == 'Casuality':
                    try:
                        casuality_register_instance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=registration_id)
                        register_kwargs['Casuality_Register_Id'] = casuality_register_instance
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'Casuality Registration ID not found'})

                # Insert into Lab_Request_Details
                Location_instance = Location_Detials.objects.get(Location_Id=location)
                lab_request = Lab_Request_Details.objects.create(
                    created_by=created_by,
                    Location=Location_instance,
                    Billing_Status = new_bill_status,
                    Status = new_bill_status,
                    # Billing_Invoice_No = general_billing,
                    # Remarks=Remarks,
                    **register_kwargs,
                )
                print('labbbbb createddd')





                # Loop through SelectedTest and insert into Lab_Request_Items_Details
                for test in SelectedTest:
                    print('tettttttt',test)
                    if test.get("ServiceType") == 'LAB':
                        print(test,'test')
                        SubDepartment_Code = test.get("sub_department_id")
                        testType = test.get("type")
                        Department_Code = test.get("department_id")
                        Code = test.get("ServiceSubCatId").strip()
                        print(testType,'testtypeeee')
                        print(Code,'COdeeeee')
                        NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
                            item_id_int=Cast("Item_Id", IntegerField())
                        ).aggregate(Max("item_id_int"))["item_id_int__max"]
                        NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

                        print(NextItemID,'NextItemID')
                        Dcode = None
                        lab_request_item_data = {}
                        if testType == 'Individual' or testType == 'individual':
                            print(testType,'testType')
                            print(Code,'COdeeeee')
                            print(len(Code))
                            Dcode = Test_Descriptions.objects.get(Test_Code = Code)
                            print('testttttt',Dcode)
                            lab_request_item_data = {
                                "Item_Id":NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
                                "Department_Code_id": Dcode.department.Department_Code,
                                }
                        elif testType == 'Group':
                            print(testType,'testType')
                            Gcode = Group_Master.objects.get(Group_Code = Code)

                            lab_request_item_data = {
                                "Item_Id":NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "Department_Code_id": Gcode.Department.department.Department_Code,
                                "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
                                }
                        elif testType == 'Offers':
                            print(testType, 'testType')
                            Pcode = OfferPackageMaster.objects.get(package_code=Code)
                            department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
                            lab_department = Lab_Department_Detials.objects.get(Department_Code=department.department_id)
                            print("---------", Pcode.department_name)
                            print("---------", Pcode.pk)
                            print("----IDDDDDDD-----", Pcode.offer_package_id)
                            lab_request_item_data = {
                                "Item_Id": NextItemID,
                                "Request": lab_request,
                                "TestType": testType,
                                "Department_Code_id": lab_department.pk,
                                "SubDepartment_Code_id": department.pk,
                            }
                        print(NextItemID,'NextItemID')



                        print(lab_request_item_data,'lab_request_item_data')
                        # Insert into appropriate columns based on testType
                        if testType == "Individual" or testType == "individual":
                            print('summaaa1111')
                            lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
                        elif testType == "Profiles" or testType == "Group":
                            lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
                        elif testType == "Profiles" or testType == "Offers":
                            lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code
                        # Save the item
                        Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                if register_type == 'IP':       
                    item_details = []
                    filterdepartment = []
                    TestDetails = []
                    keys_seen = set()
                    filterSpecimen = []
                    Specimen_keys_seen = set()
                    print('intooo the forr loop')
                    for index, item in enumerate(lab_request.lab_request_items.filter(Request = lab_request.Request_Id), start=1):
                        print("TestType :",item.TestType)
                        print(model_to_dict(item))                        

                        if item.TestType.lower() == "individual":
                            if lab_request.Billing_Status == "Completed":
                                sub_department_code = (
                                    item.Test_Code.sub_department.SubDepartment_Code
                                )
                                sub_department_name = (
                                    item.Test_Code.sub_department.SubDepartment_Name
                                )

                                if sub_department_code not in keys_seen:
                                    filterdepartment.append(
                                        {
                                            "key": sub_department_code,
                                            "value": sub_department_name,
                                        }
                                    )
                                    keys_seen.add(sub_department_code)

                                Specimen_Name = (
                                    item.Test_Code.Specimen_Name.Specimen_Name
                                    if item.Test_Code.Specimen_Name
                                    else None
                                )
                                Specimen_Code = (
                                    item.Test_Code.Specimen_Name.Specimen_Code
                                    if item.Test_Code.Specimen_Name
                                    else None
                                )

                                if Specimen_Code not in Specimen_keys_seen:
                                    filterSpecimen.append(
                                        {"key": Specimen_Code, "value": Specimen_Name}
                                    )
                                    Specimen_keys_seen.add(Specimen_Code)

                            print("type :", item.TestType)
                            print("item.Test_Code :", item.Test_Code)
                            test_cost = Testmaster_Cost_List.objects.filter(
                                Test_Code=item.Test_Code.Test_Code
                            ).first()
                        
                            print('test_cost :',test_cost)
                            print('Billing_Status :',lab_request.Billing_Status)
                            
                            if lab_request.Billing_Status == "Completed":
                                data = model_to_dict(item.Test_Code)
                                modified_data = (
                                    {}
                                )  # Create a new dictionary to store the modified data
                                for key, value in data.items():
                                    if key == "department" and item.Test_Code.department:
                                        modified_data[key] = (
                                            item.Test_Code.department.Department_Name
                                        )
                                        modified_data["Department_Code"] = (
                                            item.Test_Code.department.Department_Code
                                        )
                                    elif (
                                        key == "sub_department"
                                        and item.Test_Code.sub_department
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.sub_department.SubDepartment_Name
                                        )
                                        modified_data["SubDepartment_Code"] = (
                                            item.Test_Code.sub_department.SubDepartment_Code
                                        )
                                    elif (
                                        key == "Container_Name"
                                        and item.Test_Code.Container_Name
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.Container_Name.Container_Name
                                        )
                                    elif (
                                        key == "Specimen_Name"
                                        and item.Test_Code.Specimen_Name is not None
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.Specimen_Name.Specimen_Name
                                        )
                                    elif key == "Method_Name" and item.Test_Code.Method_Name:
                                        modified_data[key] = (
                                            item.Test_Code.Method_Name.Method_Name
                                        )
                                    elif key == "UOM" and item.Test_Code.UOM:
                                        modified_data[key] = item.Test_Code.UOM.Unit_Name
                                    elif (
                                        key == "Captured_Unit_UOM"
                                        and item.Test_Code.Captured_Unit_UOM
                                    ):
                                        modified_data[key] = (
                                            item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        )
                                    else:
                                        modified_data[key] = value  # Copy unchanged values
                                    
                                    RefernceRangeData = Age_Setup_Master.objects.filter(
                                        Test_Code=item.Test_Code.Test_Code
                                    ).first()
                                    
                                    reference_range = RefernceRangeData.Reference_Range
                                    NormalValue = RefernceRangeData.NormalValue
                                    Panic_Low = RefernceRangeData.PanicLow
                                    Panic_High = RefernceRangeData.PanicHigh

                                    if NormalValue == "Yes":
                                        panic_low, panic_high = extract_panic_range(
                                            reference_range, patient.Gender
                                        )
                                        modified_data["paniclow"] = panic_low
                                        modified_data["panichigh"] = panic_high
                                    else:
                                        modified_data["paniclow"] = Panic_Low
                                        modified_data["panichigh"] = Panic_High
                                    modified_data["type"] = "individual"
                                    
                                    modified_data["Display_Service_Status"] = "Completed"
                                    modified_data["Display_Analysis_Status"] = "Completed"
                                    modified_data["Display_Verify_Status"] = "Verified"
                                    modified_data["Display_Approve_Status"] = "Approved"
                                    
                                    modified_data["Service_Status"] = "Completed"
                                    modified_data["Analysis_Status"] = item.Analysis_Status
                                    modified_data["Verify_Status"] = item.Verify_Status
                                    modified_data["Approve_Status"] = item.Approve_Status
                                    
                                    
                                    
                                    modified_data["referencedata"] = reference_range
                                    modified_data["NormalValue"] = NormalValue 
                                    modified_data["Result_Value"] = None 
                                    modified_data["Remarks"] = None
                                    modified_data["Result_Value"] = item.Result_Value
                                    modified_data["TestType"] = "Individual"
                                    modified_data["ColumName"] = "Test_Code"

                                # Append the modified dictionary to TestDetails
                                TestDetails.append(modified_data)

                            item_details.append(
                                {
                                    "type": "individual",
                                    "S_No": index,
                                    "Test_Code": (
                                        item.Test_Code.Test_Code if item.Test_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Test_Code.Test_Name if item.Test_Code else None
                                    ),
                                    "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                        elif item.TestType.lower() == "group":
                            if lab_request.Billing_Status == "Completed":
                                if (
                                    item.Group_Code.Department.SubDepartment_Code
                                    not in filterdepartment
                                ):
                                    filterdepartment.append(
                                        {
                                            "key": item.Group_Code.Department.SubDepartment_Code,
                                            "value": item.Group_Code.Department.SubDepartment_Name,
                                        }
                                    )

                            # Get group test cost
                            test_cost = Testmaster_Cost_List.objects.filter(
                                Group_Code=item.Group_Code
                            ).first()

                            # Fetch sub-items for the group
                            group_items = []
                            sub_item_instances = Group_Master_TestList.objects.filter(
                                Group_Code=item.Group_Code
                            )
                            for sub_item in sub_item_instances:
                                if sub_item.Test_Code:

                                    Specimen_Name = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name
                                    )
                                    Specimen_Code = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Code
                                    )

                                    if Specimen_Code not in Specimen_keys_seen:
                                        filterSpecimen.append(
                                            {"key": Specimen_Code, "value": Specimen_Name}
                                        )
                                        Specimen_keys_seen.add(Specimen_Code)

                                    sub_item_data = model_to_dict(sub_item.Test_Code)
                                    # Add any additional details or transformations if needed
                                    # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                    sub_item_data["SubDepartment_Name"] = (
                                        sub_item.Test_Code.sub_department.SubDepartment_Name
                                        if sub_item.Test_Code.sub_department
                                        else None
                                    )
                                    sub_item_data["Container_Name"] = (
                                        sub_item.Test_Code.Container_Name.Container_Name
                                        if sub_item.Test_Code.Container_Name
                                        else None
                                    )
                                    sub_item_data["Specimen_Name"] = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name
                                        if sub_item.Test_Code.Specimen_Name
                                        else None
                                    )
                                    sub_item_data["Method_Name"] = (
                                        sub_item.Test_Code.Method_Name.Method_Name
                                        if sub_item.Test_Code.Method_Name
                                        else None
                                    )
                                    sub_item_data["UOM"] = (
                                        sub_item.Test_Code.UOM.Unit_Name
                                        if sub_item.Test_Code.UOM
                                        else None
                                    )
                                    sub_item_data["Captured_Unit_UOM"] = (
                                        sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        if sub_item.Test_Code.Captured_Unit_UOM
                                        else None
                                    )

                                    sub_item_data["Result_Value"] = None

                                    sub_item_data["columnname"] = "Group_Code"

                                    group_items.append(sub_item_data)

                            # Add group-level item details
                            item_details.append(
                                {
                                    "type": "group",
                                    "S_No": index,
                                    "Group_Code": (
                                        item.Group_Code.Group_Code if item.Group_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Group_Code.Group_Name if item.Group_Code else None
                                    ),
                                    "Gender": "All",
                                    "Department": (
                                        item.Group_Code.Department.SubDepartment_Name
                                        if item.Group_Code.Department
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )

                            TestDetails.append(
                                {
                                    "type": "group",
                                    "S_No": index,
                                    "Group_Code": (
                                        item.Group_Code.Group_Code if item.Group_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Group_Code.Group_Name if item.Group_Code else None
                                    ),
                                    "Gender": "All",
                                    "SubDepartment_Code": (
                                        item.Group_Code.Department.SubDepartment_Code
                                        if item.Group_Code.Department
                                        else None
                                    ),
                                    "Department": (
                                        item.Group_Code.Department.SubDepartment_Name
                                        if item.Group_Code.Department
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                    "Service_Status": "Completed",
                                    "Analysis_Status": item.Analysis_Status,
                                    "Verify_Status": item.Verify_Status,
                                    "Approve_Status": item.Approve_Status,
                                "TestType" : "Group",
                                "ColumName": "Group_Code",
                                "Result_Value": None
                                }
                            )
                        elif item.TestType.lower() == "offers":
                            
                            sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
                            if lab_request.Billing_Status == "Completed":
                                
                                if (
                                    item.Package_code.department_name
                                    not in filterdepartment
                                ):
                                    filterdepartment.append(
                                        {
                                            "key": sub_dpt.pk,
                                            "value": item.Package_Code.department_name,
                                        }
                                    )

                            # Get group test cost
                            test_cost = Testmaster_Cost_List.objects.filter(
                                Package_Code=item.Package_Code
                            ).first()

                            # Fetch sub-items for the group
                            group_items = []
                            sub_item_instances = OfferPackageList.objects.filter(
                                package_code=item.Package_Code.package_code
                            )
                            print("-------Offer-------",sub_item_instances)
                            for sub_item in sub_item_instances:
                                print("-------Item-------",sub_item.Test_Code)
                                
                                if sub_item.Test_Code:
                                    print("------Test------",sub_item.Test_Code.Test_Name)
                                    Specimen_Name = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                    )
                                    Specimen_Code = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                    )

                                    if Specimen_Code not in Specimen_keys_seen:
                                        filterSpecimen.append(
                                            {"key": Specimen_Code, "value": Specimen_Name}
                                        )
                                        Specimen_keys_seen.add(Specimen_Code)

                                    sub_item_data = model_to_dict(sub_item.Test_Code)
                                    # Add any additional details or transformations if needed
                                    # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                    sub_item_data["SubDepartment_Name"] = (
                                        sub_item.Test_Code.sub_department.SubDepartment_Name
                                        if sub_item.Test_Code.sub_department
                                        else None
                                    )
                                    sub_item_data["Container_Name"] = (
                                        sub_item.Test_Code.Container_Name.Container_Name
                                        if sub_item.Test_Code.Container_Name
                                        else None
                                    )
                                    sub_item_data["Specimen_Name"] = (
                                        sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                        if sub_item.Test_Code.Specimen_Name 
                                        else None
                                    )
                                    sub_item_data["Method_Name"] = (
                                        sub_item.Test_Code.Method_Name.Method_Name
                                        if sub_item.Test_Code.Method_Name
                                        else None
                                    )
                                    sub_item_data["UOM"] = (
                                        sub_item.Test_Code.UOM.Unit_Name
                                        if sub_item.Test_Code.UOM
                                        else None
                                    )
                                    sub_item_data["Captured_Unit_UOM"] = (
                                        sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                        if sub_item.Test_Code.Captured_Unit_UOM
                                        else None
                                    )

                                    sub_item_data["Result_Value"] = None

                                    sub_item_data["columnname"] = "Group_Code"
                                    sub_item_data["Group_Code"] = ""
                                    sub_item_data["Group_Name"] = ""

                                    print("-------Items-------",sub_item_data['Test_Name'])
                                    if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                        group_items.append(sub_item_data)
                                
                                elif sub_item.Group_Code:
                                    print("------group------",sub_item.Group_Code.Group_Code)
                                    group = sub_item.Group_Code.Group_Code
                                    groupName = sub_item.Group_Code.Group_Name
                                    sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
                                    print("-------Item-------",sub_item_instances)
                                    for sub_item in sub_item_instances:
                                        print("------Test------",sub_item.Test_Code.Test_Name)
                                        Specimen_Name = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                        )
                                        Specimen_Code = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                        )

                                        if Specimen_Code not in Specimen_keys_seen:
                                            filterSpecimen.append(
                                                {"key": Specimen_Code, "value": Specimen_Name}
                                            )
                                            Specimen_keys_seen.add(Specimen_Code)

                                        sub_item_data = model_to_dict(sub_item.Test_Code)
                                        # Add any additional details or transformations if needed
                                        # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                        sub_item_data["SubDepartment_Name"] = (
                                            sub_item.Test_Code.sub_department.SubDepartment_Name
                                            if sub_item.Test_Code.sub_department
                                            else None
                                        )
                                        sub_item_data["Container_Name"] = (
                                            sub_item.Test_Code.Container_Name.Container_Name
                                            if sub_item.Test_Code.Container_Name
                                            else None
                                        )
                                        sub_item_data["Specimen_Name"] = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                            if sub_item.Test_Code.Specimen_Name 
                                            else None
                                        )
                                        sub_item_data["Method_Name"] = (
                                            sub_item.Test_Code.Method_Name.Method_Name
                                            if sub_item.Test_Code.Method_Name
                                            else None
                                        )
                                        sub_item_data["UOM"] = (
                                            sub_item.Test_Code.UOM.Unit_Name
                                            if sub_item.Test_Code.UOM
                                            else None
                                        )
                                        sub_item_data["Captured_Unit_UOM"] = (
                                            sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                            if sub_item.Test_Code.Captured_Unit_UOM
                                            else None
                                        )

                                        sub_item_data["Result_Value"] = None

                                        sub_item_data["columnname"] = "Group_Code"
                                        sub_item_data["Group_Code"] = group
                                        sub_item_data["Group_Name"] = groupName

                                        print("-------Items-------",sub_item_data['Test_Name'])
                                        if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                            group_items.append(sub_item_data)
                                
                            # Add group-level item details
                            item_details.append(
                                {
                                    "type": "Offers",
                                    "S_No": index,
                                    "Request_Id": lab_request.Request_Id,
                                    "Group_Code": (
                                        item.Package_Code.package_code if item.Package_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Package_Code.package_name if item.Package_Code else None
                                    ),
                                    "Gender": "All",
                                    "Department": (
                                        item.Package_Code.department_name
                                        if item.Package_Code.department_name
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                }
                            )
                            print("---------OK--------")
                            TestDetails.append(
                                {
                                    "type": "Offers",
                                    "S_No": index,
                                    "Group_Code": (
                                        item.Package_Code.package_code if item.Package_Code else None
                                    ),
                                    "SelectItemName": (
                                        item.Package_Code.package_name if item.Package_Code else None
                                    ),
                                    "Gender": "All",
                                    "SubDepartment_Code": (
                                        sub_dpt.SubDepartment_Code
                                        if item.Package_Code.department_name
                                        else None
                                    ),
                                    "Department": (
                                        item.Package_Code.department_name
                                        if item.Package_Code.department_name
                                        else None
                                    ),
                                    "group_items": group_items,  # Include detailed sub-items here
                                    "ServiceType": "Lab",
                                    "Charges": test_cost.Basic if test_cost else None,
                                    "Amount": test_cost.Basic if test_cost else None,
                                    "NetAmount": test_cost.Basic if test_cost else None,
                                    "Total": test_cost.Basic if test_cost else None,
                                    "Quantity":1,
                                    "DiscountType": "",
                                    "Discount": "",
                                    "GST_per": "",
                                    "GST": "",
                                    "DiscountAmount": "",
                                    "isReimbursable": "No",
                                    "Service_Status": "Completed",
                                    "Analysis_Status": item.Analysis_Status,
                                    "Verify_Status": item.Verify_Status,
                                    "Approve_Status": item.Approve_Status,
                                "TestType" : "Offers",
                                "ColumName": "Package_Code",
                                "Result_Value": None
                                }
                            )
                    
                    print("-----ITEMS-----",item_details)
                    print('-----Billing---',model_to_dict(general_billing))
                    
                    bill_exists = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = general_billing.Billing_Invoice_No).exists()

                    VisitId = PatientVisitId.objects.filter(Patient_Id=ip_register_instance.PatientId.PatientId).order_by('-Visit_Id').first()
                    if VisitId:
                        VisitId = VisitId.Visit_Id + 1
                    else:
                        VisitId = 1

                    

                    if not bill_exists:
                        count = len(item_details)
                        BarcodeId = get_invoice_master_barcode()
                        invoiceTable = BillingInvoiceAndBillAmount.objects.create(
                            Billing_Invoice = general_billing.Billing_Invoice_No,
                            Patient_Id = ip_register_instance.PatientId.PatientId,
                            Visit_Id = VisitId,
                            Patient_Name = ip_register_instance.PatientId.FirstName,
                            Item_Count = count,
                            Total_Charge = general_billing.Net_Amount,
                            Status = new_bill_status,
                            Location = Location_instance.Location_Name,
                            Capture_Sample_Status = "Pending",
                            Analyze_Status = "Pending",
                            Verify_Status = "Pending",
                            Approve_Status = "Pending",
                            Barcode_Id = BarcodeId,
                            Group_Name = "",
                            CreatedBy = created_by,
                            Billing_Date = datetime.date(datetime.now()),
                            Billing_Type = "",
                            RateCard_Name = '',
                            Test_Code = "",
                            Group_Code = "",
                            TotalPaidAmount = general_billing.Paid_Amount,
                            BalanceAmount = general_billing.Balance_Amount,
                            Sample_Barcode_Image = None,
                            AdditionalAmount = '0.00',
                            AdditionalAmountReason = "",
                            DiscountReason = "",
                            HistoNumber = '',
                            MicroNumber = '',
                            Transfer_Location= "",
                            Registration_Id = registration_id

                        )
                        invoiceTable.save()
                        print("--------Invoice Table OK--------")
                    for item in item_details:
                        if item["type"] == "Offers":
                            
                            if item.get("group_items"):
                                for subtest in item.get("group_items", []):
                                    if subtest["Group_Code"] and subtest["Group_Name"]:
                                        group=subtest["Group_Code"]
                                        groupName=subtest["Group_Name"]
                                    else:
                                        group=""
                                        groupName=""

                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = ip_register_instance.PatientId.PatientId,
                                    Visit_Id = VisitId,
                                    Patient_Name = ip_register_instance.PatientId.FirstName,
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = subtest["Test_Name"],
                                    Gross_Amount = item["Charges"],
                                    Location = Location_instance.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId,
                                    Group_Name = groupName,
                                    CreatedBy = created_by,
                                    Billing_Date = datetime.date(datetime.now()),
                                    Test_Code = subtest["Test_Code"],
                                    Group_Code = group,
                                    individual_add_amount = None,
                                    IsSubTest = subtest.get("IsSubTest", ""),
                                    SubTestCodes = subtest.get("SubTestCodes", ""),
                                    Transfer_Location = "",
                                    PackageCode = item.get("Group_Code", ""),
                                    PackageName = item.get("SelectItemName", ""),
                                    Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()
                            else:
                                print("--------Offer-Test---------", item)
                                invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                Billing_Invoice = general_billing.Billing_Invoice_No,
                                Patient_Id = ip_register_instance.PatientId.PatientId,
                                Visit_Id = VisitId,
                                Patient_Name = ip_register_instance.PatientId.FirstName,
                                Dispatch_Method = "",
                                Test_Method = item["type"],
                                Test_Name = item["SelectItemName"],
                                Gross_Amount = item["Charges"],
                                Location = Location_instance.Location_Name,
                                Service_Status = "Pending",
                                Analysis_Status = "Pending",
                                Verify_Status = "Pending",
                                Approve_Status = "Pending",
                                Barcode_Id = BarcodeId,
                                Group_Name = "",
                                CreatedBy = created_by,
                                Billing_Date = datetime.date(datetime.now()),
                                Test_Code = item["Test_Code"],
                                Group_Code = "",
                                individual_add_amount = None,
                                IsSubTest = "",
                                SubTestCodes = "",
                                Transfer_Location = "",
                                PackageCode = "",
                                PackageName = "",
                                Bill_Status = new_bill_status
                                )
                                invoiceItemTable.save()                    
                        elif item["type"] == "group":
                            for subtest in item.get("group_items", []):
                                invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = general_billing.Billing_Invoice_No,
                                    Patient_Id = ip_register_instance.PatientId.PatientId,
                                    Visit_Id = VisitId,
                                    Patient_Name = ip_register_instance.PatientId.FirstName,
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = subtest["Test_Name"],
                                    Gross_Amount = item["Charges"],
                                    Location = Location_instance.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = BarcodeId,
                                    Group_Name = item.get("SelectItemName", ""),
                                    CreatedBy = created_by,
                                    Billing_Date = datetime.date(datetime.now()),
                                    Test_Code = subtest["Test_Code"],
                                    Group_Code = item.get("Group_Code", ""),
                                    individual_add_amount = None,
                                    IsSubTest = subtest.get("IsSubTest", ""),
                                    SubTestCodes = subtest.get("SubTestCodes", ""),
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                )
                                invoiceItemTable.save()
                        else:
                            print("---------Test---------", item)
                            invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                Billing_Invoice = general_billing.Billing_Invoice_No,
                                Patient_Id = ip_register_instance.PatientId.PatientId,
                                Visit_Id =  VisitId,
                                Patient_Name = ip_register_instance.PatientId.FirstName,
                                Dispatch_Method = "",
                                Test_Method = item["type"],
                                Test_Name = item["SelectItemName"],
                                Gross_Amount = item["Charges"],
                                Location = Location_instance.Location_Name,
                                Service_Status = "Pending",
                                Analysis_Status = "Pending",
                                Verify_Status = "Pending",
                                Approve_Status = "Pending",
                                Barcode_Id = BarcodeId,
                                Group_Name = "",
                                CreatedBy = created_by,
                                Billing_Date = datetime.date(datetime.now()),
                                Test_Code = item["Test_Code"],
                                Group_Code = "",
                                individual_add_amount = None,
                                IsSubTest = "",
                                SubTestCodes = "",
                                Transfer_Location = "",
                                PackageCode = "",
                                PackageName = "",
                                Bill_Status = new_bill_status
                            )
                            invoiceItemTable.save()
                    
                    print("--------Invoice Item Table OK--------")
                    try:      
                            exists= Register_patient_Details.objects.filter(Patient_Id = ip_register_instance.PatientId.PatientId).exists()
                            patient_id = ip_register_instance.PatientId.PatientId
                            patient = Patient_Detials.objects.get(PatientId = ip_register_instance.PatientId.PatientId)

                            


                            if not exists:        
                                PatientData = Register_patient_Details(
                                    Patient_Id = patient_id if patient_id else None,
                                    Title = patient.Title.Title_Name,
                                    Patient_Name =  patient.FirstName,
                                    Father_Name = patient.FatherName,
                                    DOB = patient.DOB,
                                    Age = patient.Age,
                                    Gender = patient.Gender,
                                    Marital_Status = "",
                                    Door_No = patient.DoorNo,
                                    Street = patient.Street,
                                    Rural_Urban ="",
                                    City = patient.City,
                                    State = patient.State,
                                    Pincode = patient.Pincode,
                                    Phone = patient.PhoneNo,
                                    Alternate_No = "",
                                    Email = patient.Email,
                                    Location = Location_instance.Location_Name,
                                    Patient_Barcode = patient_id if patient_id else None,
                                    Time_Period = 'year',
                                    CreatedBy =created_by,    
                                )
                                PatientData.save()
                                print("--------Patient Data OK--------")
                            # Create and save the Patient Visit Table entry
                            doctor_name = None
                            if self.doctor:
                                docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=self.doctor.Doctor_ID).first()
                                spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=self.doctor.Doctor_ID).first()

                                if docs:
                                    doctor_name = docs.First_Name + "/" + spc.Specialization.Speciality_Name or ""
                                else:
                                    doctor_name = 'Self'


                            visitTable = PatientVisitId.objects.create(
                                    Visit_Id = VisitId,
                                    Patient_Name = patient.FirstName,
                                    Patient_Id = patient_id,
                                    Phone = patient.PhoneNo,
                                    Visit_Type = "IP",
                                    Phlebotomist_Type = "",
                                    Phlebotomist_Name = "",
                                    Refering_Doctor = doctor_name ,
                                    Patient_Group = ip_register_instance.PatientCategory,
                                    Dispatch_Method = "",
                                    Patient_Barcode =  patient_id,
                                    CreatedBy = created_by,
                                    Location = Location_instance.Location_Name,
                                    Outsourced_Type = "",
                                    Refering_Hospital = "",
                                )
                            visitTable.save()
                            print("--------Patient Visit Table OK--------")
                    except Exception as e:
                            print(str(e))
                
        
                return ('success Data saved successfully')
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)

    def Lab_Request_Detailslink_Status_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,BillingType):
        try:
            print('/////////////////////////////labbbbbb')
            # print('dberger',item)
            print('yvbhjkb',SelectedPatient_list.get('RegisterId'))
            print('yvbhjkb',item)
            service_types = []
            for i in item:
                print('uyfuygkj')
                service_types.append(i.get('ServiceType'))
            if 'Lab' in service_types and BillingType == 'Lab' or BillingType == 'RADIOLOGY':
                for i in item:
                    if i.get('ServiceType') == 'RADIOLOGY':
                        radins = Radiology_Request_Details.objects.filter(pk=i.get('Requestid')).first()
                        radins.Status = new_bill_status
                        radins.save()
                    if i.get('ServiceType') == 'Lab':
                        print('lab interim bill savingg')
                        labins = BillingInvoiceAndBillAmount.objects.filter(pk=i.get('Requestid')).first()
                        labins.Status = new_bill_status
                        labins.save()
                
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)




    def post(self, request):
        try:
            data = json.loads(request.body)


            print(data,'000000000000000')
            
            # Get related objects
            related_objects = self.get_related_objects(data)
            if isinstance(related_objects, JsonResponse):
                return related_objects

            # Extract data
            initial_state = data.get('initialState', {})
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            bill_amounts = data.get('billAmount', [])
            select_data = data.get('SelectDatalist', [])
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
            new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
            Location = data.get('Location', '')
            BillingType = data.get('BillingType', '')
            location = Location_Detials.objects.get(Location_Id=Location)
            receipt_no = None
            if data.get('Paytype') == 'Cash':

                # Create IP Billing record
                try:
                    ip_billing = IP_Billing_Table_Detials.objects.create(
                        Billing_Date=billing_data.get('InvoiceDate'),
                        Doctor_Id=self.doctor,
                        Patient_Id=self.patient,
                        Register_Id=self.register,
                        Billing_Type='DailyBill',
                        Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
                        Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
                        Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
                        Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
                        Total_Items=int(initial_state.get('totalItems')),
                        Total_Qty=int(initial_state.get('totalUnits', 1)),
                        Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
                        Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
                        Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
                        Net_Paid_Amount=initial_state.get('totalAmountt'),
                        Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
                        Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
                        Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
                        Bill_Status=new_bill_status,
                        created_by=created_by
                    )
                    
                except Exception as e:

                    print('error4545454',e)

                # Save billing items
                self.save_billing_items(select_data, ip_billing, new_bill_status)
                
                # Create receipt and payment records
                receipt = self.create_billing_receipt(
                    ip_billing,
                    billing_data,
                    self.safe_to_decimal(initial_state.get('totalNetAmount')),
                    self.safe_to_decimal(initial_state.get('BalanceAmount')),
                    self.safe_to_decimal(initial_state.get('PaidAmount')),
                    created_by
                )
                
                # Save payment details
                for payment in bill_amounts:
                    self.save_payment_details(payment, receipt)
                receipt_no = receipt.Voucher_Number
                self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
            else:
                print('ygubvieb')
                ip_billing = Interim_Billing_Table_Detials.objects.create(
                    Billing_Date=billing_data.get('InvoiceDate'),
                    Doctor_Id=self.doctor,
                    Patient_Id=self.patient,
                    Register_Id=self.register,
                    Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
                    Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
                    Total_Items=int(initial_state.get('totalItems')),
                    Total_Qty=int(initial_state.get('totalUnits', 1)),
                    Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
                    Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
                    Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
                    Net_Paid_Amount=initial_state.get('totalAmountt'),
                    Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
                    Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
                    Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
                    Bill_Status=new_bill_status,
                    created_by=created_by
                )

                # Save billing items
                self.save_interim_billing_items(select_data, ip_billing, new_bill_status)
                self.Radiology_Requestlink_InterimBilling(select_data,ip_billing,new_bill_status,created_by)
            self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
            self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType)

            print('ubufbbr')
            if BillingType != 'quickbilling' and BillingType != 'Lab':
                bill_ins = IP_Billing_QueueList_Detials.objects.get(Registration_Id__Registration_Id=SelectedPatient_list.get('RegisterId'))
                if bill_ins:
                    bill_ins.Status = new_bill_status
                    bill_ins.save()
            formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
            print('jhbsv')
            return JsonResponse({
                'status': 'success',
                'message': 'Billing details saved successfully',
                'InvoiceNo': ip_billing.Billing_Invoice_No,
                'InvoiceDate': formatted_date,
                'ReceiptNo': receipt_no
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request):
        try:
            search_params = {
                'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
                'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
                'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
                'DateType': request.GET.get('DateType'),
                'CurrentDate': request.GET.get('CurrentDate'),
                'FromDate': request.GET.get('FromDate'),
                'ToDate': request.GET.get('ToDate'),
                'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
                'SearchStatus': request.GET.get('SearchStatus')
            }

            query = self.build_search_query(search_params)
            billing_data = IP_Billing_Table_Detials.objects.filter(query)
            print('biligggggggg',billing_data)
            
            if search_params['SearchTimeOrderby']:
                billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

            response_data = self.format_billing_data(billing_data)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def build_search_query(self, params):
        query = Q()
        if params['SearchbyFirstName']:
            query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName'])
        if params['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
        if params['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
        if params['SearchStatus']:
            query &= Q(Bill_Status=params['SearchStatus'])

        # Date filtering
        if params['DateType'] == "Current" and params['CurrentDate']:
            query &= Q(created_at__date=params['CurrentDate'])
        elif params['DateType'] == "Customize":
            if params['FromDate'] and params['ToDate']:
                query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
            elif params['FromDate']:
                query &= Q(created_at__date__gte=params['FromDate'])
            elif params['ToDate']:
                query &= Q(created_at__date__lte=params['ToDate'])

        return query

    def apply_ordering(self, queryset, order_param):
        if order_param.lower() == 'order':
            return queryset.order_by('created_at')
        elif order_param.lower() == 'disorder':
            return queryset.order_by('-created_at')
        return queryset

    def get_estimated_item_details(self,row):
        bill_items_list = []
        bill_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = row.Billing_Invoice_No)
        for item in bill_items:
            item_details = {
                'Service_Type': item.Service_Type,
                'Service_Name': item.Service_Name,
                'Rate': item.Rate,
                'Charge': item.Charge,
                'Quantity': item.Quantity,
                'Amount': item.Amount,
                'Discount_Type': item.Discount_Type,
                'Discount_Value': item.Discount_Value,
                'Discount_Amount': item.Discount_Amount,
                'Taxable_Amount': item.Taxable_Amount,
                'Tax_Percentage': item.Tax_Percentage,
                'Tax_Amount': item.Tax_Amount,
                'Total_Amount': item.Total_Amount,
                'IsReimbursable' : item.IsReimbursable,
                # 'Date' : item.Date,
                }
            bill_items_list.append(item_details)
        return bill_items_list
    

    def format_billing_data(self, billing_queryset):
        response_data = []
        for row in billing_queryset:
            billing_details = self.get_billing_details(row)
            bill_items = self.get_estimated_item_details(row)
            billing_details['Billing_Items'] = bill_items  # ✅ Add items as a key
            response_data.append(billing_details)
        return response_data

    def get_billing_details(self,row):
        print('rowwwwwww',row)
        # ⚠️ Assumed to exist in your code — sample structure:
        patient = row.Patient_Id
        room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id.Registration_Id).last()

        ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

        full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
        formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
        doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Id.Doctor_ID).first()

        # Category
        # if row.Registration_Id.PatientCategory == 'Insurance':
        #     categoryname = row.Registration_Id.InsuranceName.Insurance_Name
        #     categoryid = row.Registration_Id.InsuranceName.Insurance_Id
        # elif row.Registration_Id.PatientCategory == 'Client':
        #     categoryname = row.Registration_Id.ClientName.Client_Name
        #     categoryid = row.Registration_Id.ClientName.Client_Id
        # else:
        #     categoryname = None
        #     categoryid = None
        
        return{
            'id': row.pk,
            'VisitType': 'IP',
            'Type': "IPEdit",
            'Status': row.Bill_Status,
            'Date': formatted_date,
            'Registration_Id': row.Register_Id.Registration_Id,
            'PatientId': patient.PatientId,
            'PhoneNo': patient.PhoneNo,
            'Patient_Name': full_name,
            'Address': ', '.join(filter(None, [
                patient.DoorNo,
                patient.Street,
                patient.Area,
                patient.City,
                patient.State,
                patient.Country,
                patient.Pincode
            ])) or "No address available",
            'AgeGender': f'{patient.Age}/{patient.Gender}',
            'PatientCategory': row.Register_Id.PatientCategory,
            'Doctor_ShortName': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Id else None,
            'Doctor_Id': row.Doctor_Id.Doctor_ID if row.Doctor_Id else None,
            'Title': patient.Title.Title_Name,
            'FirstName': patient.FirstName,
            'MiddleName': patient.MiddleName,
            'SurName': patient.SurName,
            'Gender': patient.Gender,
            'DOB': patient.DOB,
            'Age': patient.Age,
            'Email': patient.Email,
            'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
            'Occupation': patient.Occupation,
            'Religion': patient.Religion.Religion_Id if patient.Religion else None,
            'Nationality': patient.Nationality,
            'UniqueIdType': patient.UniqueIdType,
            'UniqueIdNo': patient.UniqueIdNo,
            'Complaint': row.Register_Id.Complaint,
            # 'PatientCategoryName': categoryname,
            # 'PatientCategoryId': categoryid,
            'DoorNo': patient.DoorNo,
            'Street': patient.Street,
            'Area': patient.Area,
            'City': patient.City,
            'State': patient.State,
            'Country': patient.Country,
            'Pincode': patient.Pincode,
            'WardName': ward_name,
            'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
            'AdmittionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
            'Discharge_Date': room_detail.Discharge_Date.strftime('%d-%m-%Y %I:%M %p') if room_detail.Discharge_Date else "",
            'AdvanceAmount': row.Advance_Amount,
            'TotalAmount': row.Total_Amount,
            'totalItems': row.Total_Items,
            'TotalQty': row.Total_Qty,
            'Net_Amount': row.Net_Amount,
            'PaidAmount': row.Net_Paid_Amount,
            'RefundedAmount': row.Refund_Amount,
            'ReceivableAmount': row.Receivable_Amount,
            'DiscountType': row.Discount_Type,
            'DiscountValue': row.Discount_Value,
            # 'DiscountAmount': row.Discount_Amount,
        }

# @method_decorator(csrf_exempt, name='dispatch')
# class IPBillingFinalLinkView(View):
#     def __init__(self):
#         self.doctor = None
#         self.patient = None
#         self.register = None

#     def safe_to_decimal(self, value, default=0.00):
#         try:
#             return Decimal(value)
#         except (InvalidOperation, TypeError, ValueError):
#             return Decimal(default)

#     def get_related_objects(self, data):
#         """Get required foreign key objects"""
#         try:
#             self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
#             self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
#             self.register = Patient_IP_Registration_Detials.objects.get(
#                 Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
#             )
#             return True
#         except Doctor_Personal_Form_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Doctor not found'})
#         except Patient_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Patient not found'})
#         except Patient_IP_Registration_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Registration not found'})

#     def create_billing_receipt(self, ip_billing,billing_data, total_amount, balance_amount, paid_amount, created_by):
#         """Create billing receipt record"""
#         return IPBillingReceipt.objects.create(
#             Invoice_NO=ip_billing,
#             PatientID=self.patient.PatientId,
#             PhoneNumber=self.patient.PhoneNo,
#             Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
#             TotalAmount=total_amount,
#             TotalPaidAmount=paid_amount,
#             BalanceAmount=balance_amount,
#             Billing_Date=billing_data.get('InvoiceDate'),
#             PaidAmount=paid_amount,
#             Billedby=created_by
#         )

#     def create_billing_refund_receipt(self,receipt, ip_billing,billing_data, total_amount, balance_amount, paid_amount, created_by):
#         """Create billing receipt record"""
#         return IPBillingRefundReceipt.objects.create(
#             Invoice_NO=receipt,
#             PatientID=self.patient.PatientId,
#             PhoneNumber=self.patient.PhoneNo,
#             Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
#             TotalAmount=total_amount,
#             TotalPaidAmount=paid_amount,
#             BalanceAmount=balance_amount,
#             Billing_Date=billing_data.get('InvoiceDate'),
#             PaidAmount=paid_amount,
#             Billedby=created_by
#         )

#     def save_payment_details(self, payment_data, receipt, created_by, paytype, initial_state):
#         """Save payment details"""
#         return Multiple_Payment_Table_IP_Detials.objects.create(
#             Invoice_No=receipt,
#             Payment_Type=payment_data.get('Billpay_method'),
#             Cart_Type=payment_data.get('CardType'),
#             Card_No=payment_data.get('CardNo'),
#             TransactionId=payment_data.get('TransactionId'),
#             upiid=payment_data.get('upiid'),
#             Cheque_No=payment_data.get('ChequeNo'),
#             Bank_Name=payment_data.get('BankName'),
#             Amount=self.safe_to_decimal(payment_data.get('paidamount')) if paytype == 'Cash' else initial_state.get('totalNetAmount'),
#             Transaction_Amount=self.safe_to_decimal(payment_data.get('transactionFee')),
#             AdditionalAmount=self.safe_to_decimal(payment_data.get('Additionalamount')),
#             created_by = created_by
#         )

#     def save_billing_items(self, items, billing,new_bill_status):
#         """Save billing items"""
#         for item in items:

#             try:
#                 IP_Billing_Items_Table_Detials.objects.create(
#                     Billing_Invoice_No=billing,
#                     Service_Type=item.get('ServiceType'),
#                     Service_Code=item.get('TestCode') or item.get('Test_Code')  or item.get('Group_Code') or item.get('ServiceSubCatId'),
#                     Service_Name=item.get('SelectItemName'),
#                     Rate=self.safe_to_decimal(item.get('Rate')),
#                     Charge=self.safe_to_decimal(item.get('Charges')),
#                     Quantity=item.get('Quantity', 1),
#                     Amount=self.safe_to_decimal(item.get('Amount')),
#                     Discount_Type=item.get('DiscountType'),
#                     Discount_Value=self.safe_to_decimal(item.get('Discount_Value')),
#                     Discount_Amount=self.safe_to_decimal(item.get('Discount')),
#                     Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
#                     Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
#                     Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
#                     Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
#                     Item_Status=new_bill_status,
#                     IsReimbursable=item.get('isReimbursable'),
#                     Billing_Type = 'FinalBill'
#                 )
#             except Exception as e:
#                 print(str(e),'err')


#     def save_interim_billing_items(self, items, billing,new_bill_status):
#         """Save billing items"""
#         print('interimmmmitems')
#         for item in items:
#             Interim_Billing_Items_Table_Detials.objects.create(
#                 Billing_Invoice_No=billing,
#                 Service_Type=item.get('ServiceType'),
#                 Service_Code=item.get('servicecode'),
#                 Service_Name=item.get('SelectItemName'),
#                 Rate=self.safe_to_decimal(item.get('Rate')),
#                 Charge=self.safe_to_decimal(item.get('Charges')),
#                 Quantity=item.get('Quantity', 1),
#                 Amount=self.safe_to_decimal(item.get('Amount')),
#                 Discount_Type=item.get('DiscountType'),
#                 Discount_Value=self.safe_to_decimal(item.get('Discount')),
#                 Discount_Amount=self.safe_to_decimal(item.get('DiscountAmount')),
#                 Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
#                 Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
#                 Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
#                 Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
#                 Item_Status=new_bill_status,
#                 IsReimbursable=item.get('isReimbursable')
#             )
#     def Radiology_Requestlink_Billing(self,select_data,ip_billing,new_bill_status,created_by):
#         print('ucjcjvjhcj')
#         for item in select_data:
#             if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
#                 Test_Code = (item.get('ServiceSubCatId') or "").strip()
#                 RegisterType = "IP"
#                 try:
#                     testnames = TestName_Details.objects.get(Test_Code=Test_Code)
#                     Radiologyid = testnames.Radiology_Id.Radiology_Id
#                     Radiology_Request_Details.objects.create(
#                         RegisterType = RegisterType,
#                         OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
#                         IP_Register_Id=self.register if RegisterType == "IP" else None,
#                         Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
#                         Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
#                         TestCode=Radiologyid,
#                         SubTestCode=item.get('ServiceSubCatId').strip(),
#                         created_by=created_by,
#                         Status = new_bill_status,
#                         IP_Billing_Invoice_No = ip_billing 
#                     )
#                 except TestName_Details.DoesNotExist:
#                     print(f"TestName_Details not found for Test_Code: {Test_Code}")

#     def Radiology_Requestlink_InterimBilling(self,select_data,ip_billing,new_bill_status,created_by):
#         print('ucjcjvjhcj')
#         for item in select_data:
#             if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
#                 Test_Code = (item.get('ServiceSubCatId') or "").strip()
#                 RegisterType = "IP"
#                 try:
#                     testnames = TestName_Details.objects.get(Test_Code=Test_Code)
#                     Radiologyid = testnames.Radiology_Id.Radiology_Id
#                     Radiology_Request_Details.objects.create(
#                         RegisterType = RegisterType,
#                         OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
#                         IP_Register_Id=self.register if RegisterType == "IP" else None,
#                         Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
#                         Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
#                         TestCode=Radiologyid,
#                         SubTestCode=item.get('ServiceSubCatId').strip(),
#                         created_by=created_by,
#                         Status = new_bill_status,
#                         Interim_Billing_Invoice_No = ip_billing 
#                     )
#                 except TestName_Details.DoesNotExist:
#                     print(f"TestName_Details not found for Test_Code: {Test_Code}")

#     def Lab_Request_Detailslink_Status_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,BillingType):
#         try:
#             print('/////////////////////////////labbbbbb')
#             # print('dberger',item)
#             print('yvbhjkb',SelectedPatient_list.get('RegisterId'))
#             print('yvbhjkb',item)
#             service_types = []
#             for i in item:
#                 print('uyfuygkj')
#                 service_types.append(i.get('ServiceType'))
#             if 'Lab' in service_types and BillingType == 'Lab' or BillingType == 'RADIOLOGY':
#                 for i in item:
#                     if i.get('ServiceType') == 'RADIOLOGY':
#                         radins = Radiology_Request_Details.objects.filter(pk=i.get('Requestid')).first()
#                         radins.Status = new_bill_status
#                         radins.save()
#                     if i.get('ServiceType') == 'Lab':
#                         print('lab interim bill savingg')
#                         labins = BillingInvoiceAndBillAmount.objects.filter(pk=i.get('Requestid')).first()
#                         labins.Status = new_bill_status
#                         labins.save()
                
#         except Exception as e:
#             print("Exception:", e)
#             return JsonResponse({'error': 'An internal server error occurred'},status=500)




#     def post(self, request):
#         try:
#             data = json.loads(request.body)


#             # print(data,'000000000000000')
            
#             # Get related objects
#             related_objects = self.get_related_objects(data)
#             if isinstance(related_objects, JsonResponse):
#                 return related_objects

#             # Extract data
#             initial_state = data.get('initialState', {})
#             SelectedPatient_list = data.get('SelectedPatient_list', {})
#             bill_amounts = data.get('billAmount', [])
#             select_data = data.get('SelectDatalist', [])
#             billing_data = data.get('BillingData', {})
#             created_by = data.get('Created_by', '')
#             new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
#             Location = data.get('Location', '')
#             BillingType = data.get('BillingType', '')
#             location = Location_Detials.objects.get(Location_Id=Location)
#             RefundAmount = data.get('RefundAmount')
#             AdvanceTotal = data.get('AdvanceTotal')
#             ReceivableAmount = data.get('ReceivableAmount')
#             editid = data.get('EditId')

#             receipt_no = None
#             if data.get('Paytype') == 'Cash' or data.get('Paytype') == 'Refund':
#                 # Create IP Billing record
#                 try:
#                     ip_billing = IP_Billing_Table_Detials.objects.create(
#                         Billing_Date=billing_data.get('InvoiceDate'),
#                         Doctor_Id=self.doctor,
#                         Patient_Id=self.patient,
#                         Register_Id=self.register,
#                         Billing_Type='FinalBill',
#                         Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
#                         Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
#                         Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
#                         Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
#                         Total_Items=int(initial_state.get('totalItems')),
#                         Total_Qty=int(initial_state.get('totalUnits', 1)),
#                         Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
#                         Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
#                         Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
#                         Net_Paid_Amount=initial_state.get('totalAmountt') if data.get('Paytype') == 'Cash' else initial_state.get('totalNetAmount'),
#                         Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
#                         Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')) if data.get('Paytype') == 'Cash' else initial_state.get('totalNetAmount'),
#                         Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                         Refund_Amount=self.safe_to_decimal(RefundAmount) if Decimal(RefundAmount) > 0 else 0.00,
#                         Advance_Amount=self.safe_to_decimal(AdvanceTotal) if Decimal(AdvanceTotal) else 0.00,
#                         Receivable_Amount=self.safe_to_decimal(ReceivableAmount) if Decimal(ReceivableAmount) else 0.00,
#                         Bill_Status=data.get('Paytype'),
#                         created_by=created_by
#                     )
                    
#                 except Exception as e:

#                     print('error4545454',str(e))

#                 # Save billing items
#                 self.save_billing_items(select_data, ip_billing, new_bill_status)
                

#                 # Create receipt and payment records
#                 receipt = self.create_billing_receipt(
#                     ip_billing,
#                     billing_data,
#                     self.safe_to_decimal(initial_state.get('totalNetAmount')) ,
#                     self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                     self.safe_to_decimal(initial_state.get('PaidAmount')) if data.get('Paytype') == 'Cash' else initial_state.get('totalNetAmount'),
#                     created_by
#                 )
#                 if data.get('Paytype') == 'Refund':
#                     # Create receipt and payment records
#                     refund_receipt = self.create_billing_refund_receipt(
#                         receipt,
#                         ip_billing,
#                         billing_data,
#                         self.safe_to_decimal(initial_state.get('totalNetAmount')) ,
#                         self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                         self.safe_to_decimal(initial_state.get('PaidAmount')),
#                         created_by
#                     )
  
#                 paytype = data.get('Paytype') 
#                 # Save payment details
#                 for payment in bill_amounts:
#                     self.save_payment_details(payment, receipt, created_by, paytype, initial_state)
#                 receipt_no = receipt.Voucher_Number
#                 self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
#                 self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType)

#             if editid:
#                 estim_bill = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No = editid)
#                 estim_bill.Bill_Status = new_bill_status
#                 estim_bill.save()

#                 estim_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = editid)
#                 for est in estim_items:
#                     est.Item_Status = new_bill_status
#                     est.save()
#             print('ubufbbr')
#             if BillingType != 'quickbilling' and BillingType != 'Lab':
#                 bill_ins = IP_Billing_QueueList_Detials.objects.get(Registration_Id__Registration_Id=SelectedPatient_list.get('RegisterId'))
#                 if bill_ins:
#                     bill_ins.Status = new_bill_status
#                     bill_ins.save()
            
#             formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
#             print('jhbsv')
#             return JsonResponse({
#                 'status': 'success',
#                 'message': 'Billing details saved successfully',
#                 'InvoiceNo': ip_billing.Billing_Invoice_No,
#                 'InvoiceDate': formatted_date,
#                 'ReceiptNo': receipt_no
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def get(self, request):
#         try:
#             search_params = {
#                 'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
#                 'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
#                 'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
#                 'DateType': request.GET.get('DateType'),
#                 'CurrentDate': request.GET.get('CurrentDate'),
#                 'FromDate': request.GET.get('FromDate'),
#                 'ToDate': request.GET.get('ToDate'),
#                 'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
#                 'SearchStatus': request.GET.get('SearchStatus')
#             }

#             query = self.build_search_query(search_params)
#             billing_data = IP_Billing_Table_Detials.objects.filter(query)
            
#             if search_params['SearchTimeOrderby']:
#                 billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

#             response_data = self.format_billing_data(billing_data)
#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def build_search_query(self, params):
#         query = Q()
#         if params['SearchbyFirstName']:
#             query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName'])
#         if params['SearchbySpeciality']:
#             query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
#         if params['SearchbyDoctor']:
#             query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
#         if params['SearchStatus']:
#             query &= Q(Bill_Status=params['SearchStatus'])

#         # Date filtering
#         if params['DateType'] == "Current" and params['CurrentDate']:
#             query &= Q(created_at__date=params['CurrentDate'])
#         elif params['DateType'] == "Customize":
#             if params['FromDate'] and params['ToDate']:
#                 query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
#             elif params['FromDate']:
#                 query &= Q(created_at__date__gte=params['FromDate'])
#             elif params['ToDate']:
#                 query &= Q(created_at__date__lte=params['ToDate'])

#         return query

#     def apply_ordering(self, queryset, order_param):
#         if order_param.lower() == 'order':
#             return queryset.order_by('created_at')
#         elif order_param.lower() == 'disorder':
#             return queryset.order_by('-created_at')
#         return queryset

#     def format_billing_data(self, billing_queryset):
#         response_data = []
#         for row in billing_queryset:
#             billing_details = self.get_billing_details(row)
#             response_data.append(billing_details)
#         return response_data


import json
from decimal import Decimal, InvalidOperation
from django.views import View
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# @method_decorator(csrf_exempt, name='dispatch')
# class IPBillingFinalLinkView(View):
#     def __init__(self):
#         self.doctor = None
#         self.patient = None
#         self.register = None

#     def safe_to_decimal(self, value, default=0.00):
#         print(f"Converting value: {value}, type: {type(value)}")  # Debug log
#         if value is None:
#             print("Value is None, returning default")
#             return Decimal(str(default))
#         try:
#             return Decimal(str(value))
#         except (InvalidOperation, TypeError, ValueError) as e:
#             print(f"Error converting {value} to Decimal: {str(e)}")
#             return Decimal(str(default))

#     def get_related_objects(self, data):
#         """Get required foreign key objects"""
#         try:
#             self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
#             self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
#             self.register = Patient_IP_Registration_Detials.objects.get(
#                 Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
#             )
#             return True
#         except Doctor_Personal_Form_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Doctor not found'})
#         except Patient_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Patient not found'})
#         except Patient_IP_Registration_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Registration not found'})

#     def create_billing_receipt(self, ip_billing, billing_data, total_amount, balance_amount, paid_amount, created_by):
#         """Create billing receipt record"""
#         return IPBillingReceipt.objects.create(
#             Invoice_NO=ip_billing,
#             PatientID=self.patient.PatientId,
#             PhoneNumber=self.patient.PhoneNo,
#             Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
#             TotalAmount=total_amount,
#             TotalPaidAmount=paid_amount,
#             BalanceAmount=balance_amount,
#             Billing_Date=billing_data.get('InvoiceDate'),
#             PaidAmount=paid_amount,
#             Billedby=created_by
#         )

#     def create_billing_refund_receipt(self, receipt, ip_billing, billing_data, total_amount, balance_amount, paid_amount, created_by):
#         """Create billing refund receipt record"""
#         return IPBillingRefundReceipt.objects.create(
#             Invoice_NO=receipt,
#             PatientID=self.patient.PatientId,
#             PhoneNumber=self.patient.PhoneNo,
#             Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
#             TotalAmount=total_amount,
#             TotalPaidAmount=paid_amount,
#             BalanceAmount=balance_amount,
#             Billing_Date=billing_data.get('InvoiceDate'),
#             PaidAmount=paid_amount,
#             Billedby=created_by
#         )

#     def save_payment_details(self, payment_data, receipt, created_by, paytype, initial_state):
#         """Save payment details"""
#         return Multiple_Payment_Table_IP_Detials.objects.create(
#             Invoice_No=receipt,
#             Payment_Type=payment_data.get('Billpay_method', ''),
#             Cart_Type=payment_data.get('CardType', ''),
#             Card_No=payment_data.get('CardNo', ''),
#             TransactionId=payment_data.get('TransactionId', ''),
#             upiid=payment_data.get('upiid', ''),
#             Cheque_No=payment_data.get('ChequeNo', ''),
#             Bank_Name=payment_data.get('BankName', ''),
#             Amount=self.safe_to_decimal(payment_data.get('paidamount', 0.00)) if paytype == 'Cash' else self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
#             Transaction_Amount=self.safe_to_decimal(payment_data.get('transactionFee', 0.00)),
#             AdditionalAmount=self.safe_to_decimal(payment_data.get('Additionalamount', 0.00)),
#             created_by=created_by
#         )

#     def save_billing_items(self, items, billing, new_bill_status):
#         """Save billing items"""
#         for item in items:
#             try:
#                 IP_Billing_Items_Table_Detials.objects.create(
#                     Billing_Invoice_No=billing,
#                     Service_Type=item.get('ServiceType', ''),
#                     Service_Code=item.get('TestCode') or item.get('Test_Code') or item.get('Group_Code') or item.get('ServiceSubCatId', ''),
#                     Service_Name=item.get('SelectItemName', ''),
#                     Rate=self.safe_to_decimal(item.get('Rate', 0.00)),
#                     Charge=self.safe_to_decimal(item.get('Charges', 0.00)),
#                     Quantity=item.get('Quantity', 1),
#                     Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
#                     Discount_Type=item.get('DiscountType', ''),
#                     Discount_Value=self.safe_to_decimal(item.get('Discount_Value', 0.00)),
#                     Discount_Amount=self.safe_to_decimal(item.get('Discount', 0.00)),
#                     Taxable_Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
#                     Tax_Percentage=self.safe_to_decimal(item.get('GST', 0.00)),
#                     Tax_Amount=self.safe_to_decimal(item.get('GSTamount', 0.00)),
#                     Total_Amount=self.safe_to_decimal(item.get('NetAmount', 0.00)),
#                     Item_Status=new_bill_status,
#                     IsReimbursable=item.get('isReimbursable', False),
#                     Billing_Type='FinalBill',
#                     VoucherNo = item.get('VoucherNo', False),

#                 )
#             except Exception as e:
#                 print(f"Error saving billing item: {str(e)}")

#     def save_interim_billing_items(self, items, billing, new_bill_status):
#         """Save interim billing items"""
#         print('interimmmmitems')
#         for item in items:
#             Interim_Billing_Items_Table_Detials.objects.create(
#                 Billing_Invoice_No=billing,
#                 Service_Type=item.get('ServiceType', ''),
#                 Service_Code=item.get('servicecode', ''),
#                 Service_Name=item.get('SelectItemName', ''),
#                 Rate=self.safe_to_decimal(item.get('Rate', 0.00)),
#                 Charge=self.safe_to_decimal(item.get('Charges', 0.00)),
#                 Quantity=item.get('Quantity', 1),
#                 Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
#                 Discount_Type=item.get('DiscountType', ''),
#                 Discount_Value=self.safe_to_decimal(item.get('Discount', 0.00)),
#                 Discount_Amount=self.safe_to_decimal(item.get('DiscountAmount', 0.00)),
#                 Taxable_Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
#                 Tax_Percentage=self.safe_to_decimal(item.get('GST', 0.00)),
#                 Tax_Amount=self.safe_to_decimal(item.get('GSTamount', 0.00)),
#                 Total_Amount=self.safe_to_decimal(item.get('NetAmount', 0.00)),
#                 Item_Status=new_bill_status,
#                 IsReimbursable=item.get('isReimbursable', False)
#             )

#     def Radiology_Requestlink_Billing(self, select_data, ip_billing, new_bill_status, created_by):
#         print('ucjcjvjhcj')
#         for item in select_data:
#             if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') != '':
#                 Test_Code = (item.get('ServiceSubCatId') or "").strip()
#                 RegisterType = "IP"
#                 try:
#                     testnames = TestName_Details.objects.get(Test_Code=Test_Code)
#                     Radiologyid = testnames.Radiology_Id.Radiology_Id
#                     Radiology_Request_Details.objects.create(
#                         RegisterType=RegisterType,
#                         OP_Register_Id=self.register if RegisterType == "OP" or RegisterType == 'WALK-IN' else None,
#                         IP_Register_Id=self.register if RegisterType == "IP" else None,
#                         Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
#                         Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
#                         TestCode=Radiologyid,
#                         SubTestCode=item.get('ServiceSubCatId', '').strip(),
#                         created_by=created_by,
#                         Status=new_bill_status,
#                         IP_Billing_Invoice_No=ip_billing
#                     )
#                 except TestName_Details.DoesNotExist:
#                     print(f"TestName_Details not found for Test_Code: {Test_Code}")

#     def Radiology_Requestlink_InterimBilling(self, select_data, ip_billing, new_bill_status, created_by):
#         print('ucjcjvjhcj')
#         for item in select_data:
#             if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') != '':
#                 Test_Code = (item.get('ServiceSubCatId') or "").strip()
#                 RegisterType = "IP"
#                 try:
#                     testnames = TestName_Details.objects.get(Test_Code=Test_Code)
#                     Radiologyid = testnames.Radiology_Id.Radiology_Id
#                     Radiology_Request_Details.objects.create(
#                         RegisterType=RegisterType,
#                         OP_Register_Id=self.register if RegisterType == "OP" or RegisterType == 'WALK-IN' else None,
#                         IP_Register_Id=self.register if RegisterType == "IP" else None,
#                         Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
#                         Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
#                         TestCode=Radiologyid,
#                         SubTestCode=item.get('ServiceSubCatId', '').strip(),
#                         created_by=created_by,
#                         Status=new_bill_status,
#                         Interim_Billing_Invoice_No=ip_billing
#                     )
#                 except TestName_Details.DoesNotExist:
#                     print(f"TestName_Details not found for Test_Code: {Test_Code}")

#     def Lab_Request_Detailslink_Status_Billing(self, item, general_billing, new_bill_status, SelectedPatient_list, Created_by, location, BillingType):
#         try:
#             print('/////////////////////////////labbbbbb')
#             service_types = [i.get('ServiceType', '') for i in item]
#             if 'Lab' in service_types and (BillingType == 'Lab' or BillingType == 'RADIOLOGY'):
#                 for i in item:
#                     if i.get('ServiceType') == 'RADIOLOGY':
#                         radins = Radiology_Request_Details.objects.filter(pk=i.get('Requestid')).first()
#                         if radins:
#                             radins.Status = new_bill_status
#                             radins.save()
#                     if i.get('ServiceType') == 'Lab':
#                         print('lab interim bill savingg')
#                         labins = BillingInvoiceAndBillAmount.objects.filter(pk=i.get('Requestid')).first()
#                         if labins:
#                             labins.Status = new_bill_status
#                             labins.save()
#         except Exception as e:
#             print(f"Exception in Lab_Request_Detailslink_Status_Billing: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     def post(self, request):
#         try:
#             data = json.loads(request.body)

#             # Validate required fields
#             initial_state = data.get('initialState', {})
#             required_fields = ['totalNetAmount', 'totalTaxable', 'totalGstamount', 'BalanceAmount']
#             for field in required_fields:
#                 if initial_state.get(field) is None:
#                     return JsonResponse({'error': f'Missing or null field: {field}'}, status=400)

#             # Get related objects
#             related_objects = self.get_related_objects(data)
#             if isinstance(related_objects, JsonResponse):
#                 return related_objects

#             # Extract data
#             bill_amounts = data.get('billAmount', [])
#             select_data = data.get('SelectDatalist', [])
#             billing_data = data.get('BillingData', {})
#             created_by = data.get('Created_by', '')
#             new_bill_status = 'Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)) == Decimal('0.00') else 'Due'
#             Location = data.get('Location', '')
#             BillingType = data.get('BillingType', '')
#             location = Location_Detials.objects.get(Location_Id=Location)
#             RefundAmount = data.get('RefundAmount')
#             AdvanceTotal = data.get('AdvanceTotal')
#             ReceivableAmount = data.get('ReceivableAmount')
#             editid = data.get('EditId')
#             Remarks = data.get('Remarks')


#             receipt_no = None
#             if data.get('Paytype') in ['Cash', 'Refund', 'Credit']:
#                 # Create IP Billing record
#                 try:
#                     ip_billing = IP_Billing_Table_Detials.objects.create(
#                         Billing_Date=billing_data.get('InvoiceDate'),
#                         Doctor_Id=self.doctor,
#                         Patient_Id=self.patient,
#                         Register_Id=self.register,
#                         Billing_Type='FinalBill',
#                         Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method', ''),
#                         Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method', ''),
#                         Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount', 0.00)),
#                         Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount', 0.00)),
#                         Total_Items=int(initial_state.get('totalItems', 0)),
#                         Total_Qty=int(initial_state.get('totalUnits', 1)),
#                         Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable', 0.00)),
#                         Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount', 0.00)),
#                         Net_Amount=self.safe_to_decimal(initial_state.get('afterschemedistotal', 0.00)),
#                         Net_Paid_Amount=self.safe_to_decimal(initial_state.get('Finalnetamt', 0.00)) if data.get('Paytype') == 'Cash' else self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
#                         Round_Off=self.safe_to_decimal(initial_state.get('Roundoff', 0.00)),
#                         Paid_Amount = (
#                             0.00 
#                             if data.get('Paytype') == 'Refund' 
#                             else self.safe_to_decimal(initial_state.get('PaidAmount', 0.00))
#                         ),
#                         Balance_Amount = (
#                             self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00))
#                             if data.get('Paytype') == 'Credit' 
#                             else 0.00
#                         ),
#                         # Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)),
#                         Refund_Amount = (
#                             self.safe_to_decimal(initial_state.get('PaidAmount', 0.00))
#                             if data.get('Paytype') == 'Refund' 
#                             else 0.00
#                         ),
                        
#                         # Refund_Amount=self.safe_to_decimal(RefundAmount) if RefundAmount is not None and self.safe_to_decimal(RefundAmount) > 0 else Decimal('0.00'),
#                         Advance_Amount=self.safe_to_decimal(AdvanceTotal) if AdvanceTotal is not None and self.safe_to_decimal(AdvanceTotal) != 0 else Decimal('0.00'),
#                         Receivable_Amount=self.safe_to_decimal(ReceivableAmount) if ReceivableAmount is not None and self.safe_to_decimal(ReceivableAmount) != 0 else Decimal('0.00'),
#                         Bill_Status=data.get('Paytype', ''),
#                         created_by=created_by,
#                         Remarks = Remarks,
#                         SchemeDiscount = self.safe_to_decimal(initial_state.get('schemediscount', 0.00)),
#                     )
#                 except Exception as e:
#                     print(f"Error creating IP billing: {str(e)}")
#                     return JsonResponse({'error': f'Failed to create billing: {str(e)}'}, status=500)

#                 # Save billing items
#                 self.save_billing_items(select_data, ip_billing, new_bill_status)

#                 # Create receipt
#                 receipt = self.create_billing_receipt(
#                     ip_billing,
#                     billing_data,
#                     self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
#                     self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)),
#                     self.safe_to_decimal(initial_state.get('PaidAmount', 0.00)) if data.get('Paytype') == 'Cash' else self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
#                     created_by
#                 )

#                 if data.get('Paytype') == 'Refund':
#                     refund_receipt = self.create_billing_refund_receipt(
#                         receipt,
#                         ip_billing,
#                         billing_data,
#                         self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
#                         self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)),
#                         self.safe_to_decimal(initial_state.get('PaidAmount', 0.00)),
#                         created_by
#                     )

#                 paytype = data.get('Paytype', '')
#                 # Save payment details
#                 for payment in bill_amounts:
#                     self.save_payment_details(payment, receipt, created_by, paytype, initial_state)
#                 receipt_no = receipt.Voucher_Number
#                 self.Radiology_Requestlink_Billing(select_data, ip_billing, new_bill_status, created_by)
#                 self.Lab_Request_Detailslink_Status_Billing(select_data, ip_billing, new_bill_status, data.get('SelectedPatient_list', {}), created_by, location, BillingType)

#             if editid:
#                 estim_bill = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No=editid)
#                 estim_bill.Bill_Status = new_bill_status
#                 estim_bill.save()

#                 estim_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No=editid)
#                 for est in estim_items:
#                     est.Item_Status = new_bill_status
#                     est.save()

#             if BillingType not in ['quickbilling', 'Lab']:
#                 bill_ins = IP_Billing_QueueList_Detials.objects.get(Registration_Id__Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId'))
#                 if bill_ins:
#                     bill_ins.Status = new_bill_status
#                     bill_ins.save()

#             formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
#             return JsonResponse({
#                 'status': 'success',
#                 'message': 'Billing details saved successfully',
#                 'InvoiceNo': ip_billing.Billing_Invoice_No,
#                 'InvoiceDate': formatted_date,
#                 'ReceiptNo': receipt_no
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def get(self, request):
#         try:
#             search_params = {
#                 'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
#                 'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
#                 'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
#                 'DateType': request.GET.get('DateType'),
#                 'CurrentDate': request.GET.get('CurrentDate'),
#                 'FromDate': request.GET.get('FromDate'),
#                 'ToDate': request.GET.get('ToDate'),
#                 'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
#                 'SearchStatus': request.GET.get('SearchStatus')
#             }

#             query = self.build_search_query(search_params)
#             billing_data = IP_Billing_Table_Detials.objects.filter(query)

#             if search_params['SearchTimeOrderby']:
#                 billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

#             response_data = self.format_billing_data(billing_data)
#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def build_search_query(self, params):
#         query = Q()
#         if params['SearchbyFirstName']:
#             query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName'])
#         if params['SearchbySpeciality']:
#             query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
#         if params['SearchbyDoctor']:
#             query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
#         if params['SearchStatus']:
#             query &= Q(Bill_Status=params['SearchStatus'])

#         # Date filtering
#         if params['DateType'] == "Current" and params['CurrentDate']:
#             query &= Q(created_at__date=params['CurrentDate'])
#         elif params['DateType'] == "Customize":
#             if params['FromDate'] and params['ToDate']:
#                 query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
#             elif params['FromDate']:
#                 query &= Q(created_at__date__gte=params['FromDate'])
#             elif params['ToDate']:
#                 query &= Q(created_at__date__lte=params['ToDate'])

#         return query

#     def apply_ordering(self, queryset, order_param):
#         if order_param.lower() == 'order':
#             return queryset.order_by('created_at')
#         elif order_param.lower() == 'disorder':
#             return queryset.order_by('-created_at')
#         return queryset

#     def format_billing_data(self, billing_queryset):
#         response_data = []
#         for row in billing_queryset:
#             billing_details = self.get_billing_details(row)
#             response_data.append(billing_details)
#         return response_data


@method_decorator(csrf_exempt, name='dispatch')
class IPBillingFinalLinkView(View):
    def __init__(self):
        self.doctor = None
        self.patient = None
        self.register = None

    def safe_to_decimal(self, value, default=0.00):
        print(f"Converting value: {value}, type: {type(value)}")  # Debug log
        if value is None:
            print("Value is None, returning default")
            return Decimal(str(default))
        try:
            return Decimal(str(value))
        except (InvalidOperation, TypeError, ValueError) as e:
            print(f"Error converting {value} to Decimal: {str(e)}")
            return Decimal(str(default))

    def get_related_objects(self, data):
        """Get required foreign key objects"""
        try:
            self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
            self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
            self.register = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
            )
            return True
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Registration not found'})

    def create_billing_receipt(self, ip_billing, billing_data, total_amount, balance_amount, paid_amount, created_by):
        """Create billing receipt record"""
        return IPBillingReceipt.objects.create(
            Invoice_NO=ip_billing,
            PatientID=self.patient.PatientId,
            PhoneNumber=self.patient.PhoneNo,
            Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
            TotalAmount=total_amount,
            TotalPaidAmount=paid_amount,
            BalanceAmount=balance_amount,
            Billing_Date=billing_data.get('InvoiceDate'),
            PaidAmount=paid_amount,
            Billedby=created_by
        )

    def create_billing_refund_receipt(self, receipt, ip_billing, billing_data, total_amount, balance_amount, paid_amount, created_by):
        """Create billing refund receipt record"""
        return IPBillingRefundReceipt.objects.create(
            Invoice_NO=receipt,
            PatientID=self.patient.PatientId,
            PhoneNumber=self.patient.PhoneNo,
            Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
            TotalAmount=total_amount,
            TotalPaidAmount=paid_amount,
            BalanceAmount=balance_amount,
            Billing_Date=billing_data.get('InvoiceDate'),
            PaidAmount=paid_amount,
            Billedby=created_by
        )

    def save_payment_details(self, payment_data, receipt, created_by, paytype, initial_state):
        """Save payment details"""
        return Multiple_Payment_Table_IP_Detials.objects.create(
            Invoice_No=receipt,
            Payment_Type=payment_data.get('Billpay_method', ''),
            Cart_Type=payment_data.get('CardType', ''),
            Card_No=payment_data.get('CardNo', ''),
            TransactionId=payment_data.get('TransactionId', ''),
            upiid=payment_data.get('upiid', ''),
            Cheque_No=payment_data.get('ChequeNo', ''),
            Bank_Name=payment_data.get('BankName', ''),
            Amount=self.safe_to_decimal(payment_data.get('paidamount', 0.00)) if paytype == 'Cash' else self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
            Transaction_Amount=self.safe_to_decimal(payment_data.get('transactionFee', 0.00)),
            AdditionalAmount=self.safe_to_decimal(payment_data.get('Additionalamount', 0.00)),
            created_by=created_by
        )

    def save_billing_items(self, items, billing, new_bill_status):
        """Save billing items"""
        for item in items:
            try:
                IP_Billing_Items_Table_Detials.objects.create(
                    Billing_Invoice_No=billing,
                    Service_Type=item.get('ServiceType', ''),
                    Service_Code=item.get('TestCode') or item.get('Test_Code') or item.get('Group_Code') or item.get('ServiceSubCatId', ''),
                    Service_Name=item.get('SelectItemName', ''),
                    Rate=self.safe_to_decimal(item.get('Rate', 0.00)),
                    Charge=self.safe_to_decimal(item.get('Charges', 0.00)),
                    Quantity=item.get('Quantity', 1),
                    Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
                    Discount_Type=item.get('DiscountType', ''),
                    Discount_Value=self.safe_to_decimal(item.get('Discount_Value', 0.00)),
                    Discount_Amount=self.safe_to_decimal(item.get('Discount', 0.00)),
                    Taxable_Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
                    Tax_Percentage=self.safe_to_decimal(item.get('GST', 0.00)),
                    Tax_Amount=self.safe_to_decimal(item.get('GSTamount', 0.00)),
                    Total_Amount=self.safe_to_decimal(item.get('NetAmount', 0.00)),
                    Item_Status=new_bill_status,
                    IsReimbursable=item.get('isReimbursable', False),
                    Billing_Type='FinalBill',
                    VoucherNo = item.get('VoucherNo', False),
                    CGHS_CODE = item.get('CGHScode')


                )
            except Exception as e:
                print(f"Error saving billing item: {str(e)}")

    def save_interim_billing_items(self, items, billing, new_bill_status):
        """Save interim billing items"""
        print('interimmmmitems')
        for item in items:
            Interim_Billing_Items_Table_Detials.objects.create(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType', ''),
                Service_Code=item.get('servicecode', ''),
                Service_Name=item.get('SelectItemName', ''),
                Rate=self.safe_to_decimal(item.get('Rate', 0.00)),
                Charge=self.safe_to_decimal(item.get('Charges', 0.00)),
                Quantity=item.get('Quantity', 1),
                Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
                Discount_Type=item.get('DiscountType', ''),
                Discount_Value=self.safe_to_decimal(item.get('Discount', 0.00)),
                Discount_Amount=self.safe_to_decimal(item.get('DiscountAmount', 0.00)),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount', 0.00)),
                Tax_Percentage=self.safe_to_decimal(item.get('GST', 0.00)),
                Tax_Amount=self.safe_to_decimal(item.get('GSTamount', 0.00)),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount', 0.00)),
                Item_Status=new_bill_status,
                IsReimbursable=item.get('isReimbursable', False)
            )

    def Radiology_Requestlink_Billing(self, select_data, ip_billing, new_bill_status, created_by):
        print('ucjcjvjhcj')
        for item in select_data:
            if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') != '':
                Test_Code = (item.get('ServiceSubCatId') or "").strip()
                RegisterType = "IP"
                try:
                    testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                    Radiology_Request_Details.objects.create(
                        RegisterType=RegisterType,
                        OP_Register_Id=self.register if RegisterType == "OP" or RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=self.register if RegisterType == "IP" else None,
                        Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=item.get('ServiceSubCatId', '').strip(),
                        created_by=created_by,
                        Status=new_bill_status,
                        IP_Billing_Invoice_No=ip_billing
                    )
                except TestName_Details.DoesNotExist:
                    print(f"TestName_Details not found for Test_Code: {Test_Code}")

    def Radiology_Requestlink_InterimBilling(self, select_data, ip_billing, new_bill_status, created_by):
        print('ucjcjvjhcj')
        for item in select_data:
            if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') != '':
                Test_Code = (item.get('ServiceSubCatId') or "").strip()
                RegisterType = "IP"
                try:
                    testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                    Radiology_Request_Details.objects.create(
                        RegisterType=RegisterType,
                        OP_Register_Id=self.register if RegisterType == "OP" or RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=self.register if RegisterType == "IP" else None,
                        Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=item.get('ServiceSubCatId', '').strip(),
                        created_by=created_by,
                        Status=new_bill_status,
                        Interim_Billing_Invoice_No=ip_billing
                    )
                except TestName_Details.DoesNotExist:
                    print(f"TestName_Details not found for Test_Code: {Test_Code}")

    def Lab_Request_Detailslink_Status_Billing(self, item, general_billing, new_bill_status, SelectedPatient_list, Created_by, location, BillingType):
        try:
            print('/////////////////////////////labbbbbb')
            service_types = [i.get('ServiceType', '') for i in item]
            if 'Lab' in service_types and (BillingType == 'Lab' or BillingType == 'RADIOLOGY'):
                for i in item:
                    if i.get('ServiceType') == 'RADIOLOGY':
                        radins = Radiology_Request_Details.objects.filter(pk=i.get('Requestid')).first()
                        if radins:
                            radins.Status = new_bill_status
                            radins.save()
                    if i.get('ServiceType') == 'Lab':
                        print('lab interim bill savingg')
                        labins = BillingInvoiceAndBillAmount.objects.filter(pk=i.get('Requestid')).first()
                        if labins:
                            labins.Status = new_bill_status
                            labins.save()
        except Exception as e:
            print(f"Exception in Lab_Request_Detailslink_Status_Billing: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    def post(self, request):
        try:
            data = json.loads(request.body)

            # Validate required fields
            initial_state = data.get('initialState', {})
            required_fields = ['totalNetAmount', 'totalTaxable', 'totalGstamount', 'BalanceAmount']
            for field in required_fields:
                if initial_state.get(field) is None:
                    return JsonResponse({'error': f'Missing or null field: {field}'}, status=400)

            # Get related objects
            related_objects = self.get_related_objects(data)
            if isinstance(related_objects, JsonResponse):
                return related_objects

            # Extract data
            bill_amounts = data.get('billAmount', [])
            select_data = data.get('SelectDatalist', [])
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
            new_bill_status = 'Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)) == Decimal('0.00') else 'Due'
            Location = data.get('Location', '')
            BillingType = data.get('BillingType', '')
            location = Location_Detials.objects.get(Location_Id=Location)
            RefundAmount = data.get('RefundAmount')
            AdvanceTotal = data.get('AdvanceTotal')
            ReceivableAmount = data.get('ReceivableAmount')
            editid = data.get('EditId')
            Remarks = data.get('Remarks')


            receipt_no = None
            if data.get('Paytype') in ['Cash', 'Refund', 'Credit']:
                # Create IP Billing record

                prev_bill = IP_Billing_Table_Detials.objects.filter(
                        Billing_Date=billing_data.get('InvoiceDate'),
                        Patient_Id=self.patient,
                        Register_Id=self.register
                    ).order_by('-created_at').first()
 
                if prev_bill:
 
                        Total_Amount = self.safe_to_decimal(initial_state.get('totalTaxable'))
                        Net_Amount = self.safe_to_decimal(initial_state.get('afterschemedistotal'))
                        Net_Paid_Amount = self.safe_to_decimal(initial_state.get('Finalnetamt'))
                       
                        prev_total = self.safe_to_decimal(prev_bill.Total_Amount)
                        prev_net = self.safe_to_decimal(prev_bill.Net_Amount)
                        prev_net_paid = self.safe_to_decimal(prev_bill.Net_Paid_Amount)
                       
                        is_duplicate = (
                            prev_total == Total_Amount and
                            prev_net == Net_Amount and
                            prev_net_paid == Net_Paid_Amount and
                            prev_bill.created_by == created_by and
                            prev_bill.Bill_Status == data.get('Paytype', '') and
                            prev_bill.Remarks == data.get('Remarks','')
                        )
                       
                        if is_duplicate:
                            return JsonResponse({
                                'status': 'warn',
                                'message': 'Duplicate billing entry detected'
                            }, status=400)
 
                try:
                    ip_billing = IP_Billing_Table_Detials.objects.create(
                        Billing_Date=billing_data.get('InvoiceDate'),
                        Doctor_Id=self.doctor,
                        Patient_Id=self.patient,
                        Register_Id=self.register,
                        Billing_Type='FinalBill',
                        Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method', ''),
                        Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method', ''),
                        Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount', 0.00)),
                        Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount', 0.00)),
                        Total_Items=int(initial_state.get('totalItems', 0)),
                        Total_Qty=int(initial_state.get('totalUnits', 1)),
                        Total_Amount=self.safe_to_decimal(initial_state.get('Itempharmacygrandtotal', 0.00)),
                        Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount', 0.00)),
                        Net_Amount=self.safe_to_decimal(initial_state.get('afterschemedistotal', 0.00)),
                        # Net_Paid_Amount=self.safe_to_decimal(initial_state.get('Finalnetamt', 0.00)) if data.get('Paytype') == 'Cash' else self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
                        Net_Paid_Amount=self.safe_to_decimal(initial_state.get('Finalnetamt', 0.00)),
                        Round_Off=self.safe_to_decimal(initial_state.get('Roundoff', 0.00)),
                        Paid_Amount = (
                            0.00 
                            if data.get('Paytype') == 'Refund' 
                            else self.safe_to_decimal(initial_state.get('PaidAmount', 0.00))
                        ),
                        Balance_Amount = (
                            self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00))
                            if data.get('Paytype') == 'Credit' 
                            else 0.00
                        ),
                        # Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)),
                        Refund_Amount = (
                            self.safe_to_decimal(initial_state.get('PaidAmount', 0.00))
                            if data.get('Paytype') == 'Refund' 
                            else 0.00
                        ),
                        
                        # Refund_Amount=self.safe_to_decimal(RefundAmount) if RefundAmount is not None and self.safe_to_decimal(RefundAmount) > 0 else Decimal('0.00'),
                        Advance_Amount=self.safe_to_decimal(AdvanceTotal) if AdvanceTotal is not None and self.safe_to_decimal(AdvanceTotal) != 0 else Decimal('0.00'),
                        Receivable_Amount=self.safe_to_decimal(ReceivableAmount) if ReceivableAmount is not None and self.safe_to_decimal(ReceivableAmount) != 0 else Decimal('0.00'),
                        Bill_Status=data.get('Paytype', ''),
                        created_by=created_by,
                        Remarks = Remarks,
                        SchemeDiscount = self.safe_to_decimal(initial_state.get('schemediscount', 0.00)),
                    )
                except Exception as e:
                    print(f"Error creating IP billing: {str(e)}")
                    return JsonResponse({'error': f'Failed to create billing: {str(e)}'}, status=500)

                # Save billing items
                self.save_billing_items(select_data, ip_billing, new_bill_status)

                # Create receipt
                receipt = self.create_billing_receipt(
                    ip_billing,
                    billing_data,
                    self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
                    self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)),
                    self.safe_to_decimal(initial_state.get('PaidAmount', 0.00)) if data.get('Paytype') == 'Cash' else self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
                    created_by
                )

                if data.get('Paytype') == 'Refund':
                    refund_receipt = self.create_billing_refund_receipt(
                        receipt,
                        ip_billing,
                        billing_data,
                        self.safe_to_decimal(initial_state.get('totalNetAmount', 0.00)),
                        self.safe_to_decimal(initial_state.get('BalanceAmount', 0.00)),
                        self.safe_to_decimal(initial_state.get('PaidAmount', 0.00)),
                        created_by
                    )

                paytype = data.get('Paytype', '')
                # Save payment details
                for payment in bill_amounts:
                    self.save_payment_details(payment, receipt, created_by, paytype, initial_state)
                receipt_no = receipt.Voucher_Number
                self.Radiology_Requestlink_Billing(select_data, ip_billing, new_bill_status, created_by)
                self.Lab_Request_Detailslink_Status_Billing(select_data, ip_billing, new_bill_status, data.get('SelectedPatient_list', {}), created_by, location, BillingType)

            if editid:
                estim_bill = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No=editid)
                estim_bill.Bill_Status = new_bill_status
                estim_bill.save()

                estim_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No=editid)
                for est in estim_items:
                    est.Item_Status = new_bill_status
                    est.save()

            if BillingType not in ['quickbilling', 'Lab']:
                bill_ins = IP_Billing_QueueList_Detials.objects.get(Registration_Id__Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId'))
                if bill_ins:
                    bill_ins.Status = new_bill_status
                    bill_ins.save()

            formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
            return JsonResponse({
                'status': 'success',
                'message': 'Billing details saved successfully',
                'InvoiceNo': ip_billing.Billing_Invoice_No,
                'InvoiceDate': formatted_date,
                'ReceiptNo': receipt_no
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request):
        try:
            search_params = {
                'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
                'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
                'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
                'DateType': request.GET.get('DateType'),
                'CurrentDate': request.GET.get('CurrentDate'),
                'FromDate': request.GET.get('FromDate'),
                'ToDate': request.GET.get('ToDate'),
                'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
                'SearchStatus': request.GET.get('SearchStatus')
            }

            query = self.build_search_query(search_params)
            billing_data = IP_Billing_Table_Detials.objects.filter(query)

            if search_params['SearchTimeOrderby']:
                billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

            response_data = self.format_billing_data(billing_data)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def build_search_query(self, params):
        query = Q()
        if params['SearchbyFirstName']:
            query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName'])
        if params['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
        if params['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
        if params['SearchStatus']:
            query &= Q(Bill_Status=params['SearchStatus'])

        # Date filtering
        if params['DateType'] == "Current" and params['CurrentDate']:
            query &= Q(created_at__date=params['CurrentDate'])
        elif params['DateType'] == "Customize":
            if params['FromDate'] and params['ToDate']:
                query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
            elif params['FromDate']:
                query &= Q(created_at__date__gte=params['FromDate'])
            elif params['ToDate']:
                query &= Q(created_at__date__lte=params['ToDate'])

        return query

    def apply_ordering(self, queryset, order_param):
        if order_param.lower() == 'order':
            return queryset.order_by('created_at')
        elif order_param.lower() == 'disorder':
            return queryset.order_by('-created_at')
        return queryset

    def format_billing_data(self, billing_queryset):
        response_data = []
        for row in billing_queryset:
            billing_details = self.get_billing_details(row)
            response_data.append(billing_details)
        return response_data


# @method_decorator(csrf_exempt, name='dispatch')
# class IPQuickBillingLinkView(View):
#     def __init__(self):
#         self.doctor = None
#         self.patient = None
#         self.register = None

#     def safe_to_decimal(self, value, default=0.00):
#         try:
#             return Decimal(value)
#         except (InvalidOperation, TypeError, ValueError):
#             return Decimal(default)

#     def get_related_objects(self, data):
#         """Get required foreign key objects"""
#         try:
#             self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
#             self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
#             self.register = Patient_IP_Registration_Detials.objects.get(
#                 Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
#             )
#             return True
#         except Doctor_Personal_Form_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Doctor not found'})
#         except Patient_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Patient not found'})
#         except Patient_IP_Registration_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Registration not found'})

#     def create_billing_receipt(self, ip_billing,billing_data, total_amount, balance_amount, paid_amount, created_by):
#         """Create billing receipt record"""
#         return IPBillingReceipt.objects.create(
#             Invoice_NO=ip_billing,
#             PatientID=self.patient.PatientId,
#             PhoneNumber=self.patient.PhoneNo,
#             Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
#             TotalAmount=total_amount,
#             TotalPaidAmount=total_amount,
#             BalanceAmount=balance_amount,
#             Billing_Date=billing_data.get('InvoiceDate'),
#             PaidAmount=paid_amount,
#             Billedby=created_by
#         )

#     def save_payment_details(self, payment_data, receipt):
#         """Save payment details"""
#         return Multiple_Payment_Table_IP_Detials.objects.create(
#             Invoice_No=receipt,
#             Payment_Type=payment_data.get('Billpay_method'),
#             Cart_Type=payment_data.get('CardType'),
#             Card_No=payment_data.get('CardNo'),
#             TransactionId=payment_data.get('TransactionId'),
#             upiid=payment_data.get('upiid'),
#             Cheque_No=payment_data.get('ChequeNo'),
#             Bank_Name=payment_data.get('BankName'),
#             Amount=self.safe_to_decimal(payment_data.get('paidamount')),
#             Transaction_Amount=self.safe_to_decimal(payment_data.get('transactionFee')),
#             AdditionalAmount=self.safe_to_decimal(payment_data.get('Additionalamount'))
#         )

#     def save_billing_items(self, items, billing,new_bill_status):
#         """Save billing items"""
       
#         for item in items:

#             try:

#                 Status = item.get('status')

#             except :
#                 Status = ""



#             if Status == 'Canceled':

#                 pass

#             else:
#                 IP_Billing_Items_Table_Detials.objects.create(
#                     Billing_Invoice_No=billing,
#                     Service_Type=item.get('ServiceType').upper(),
#                     Service_Code= item.get('TestCode') or item.get('Test_Code') or item.get('Group_Code') or item.get('ServiceSubCatId'),
#                     Service_Name=item.get('SelectItemName'),
#                     Rate=self.safe_to_decimal(item.get('Rate')),
#                     Charge=self.safe_to_decimal(item.get('Charges')),
#                     Quantity=item.get('Quantity', 1),
#                     Amount=self.safe_to_decimal(item.get('Amount')),
#                     Discount_Type=item.get('Discountmethod'),
#                     Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
#                     Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
#                     Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
#                     Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
#                     Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
#                     Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
#                     Item_Status=new_bill_status,
#                     IsReimbursable=item.get('isReimbursable'),
#                     Billing_Type = 'DailyBill'

#                 )



#     def save_interim_billing_items(self, items, billing,new_bill_status):
#         """Save billing items"""
#         print('interimmmmitems')
#         for item in items:

#             Scode = item.get('TestCode') or item.get('Test_Code')  or item.get('Group_Code') or item.get('ServiceSubCatId')

#             print(Scode,'ScodeScodeScode')


#             Interim_Billing_Items_Table_Detials.objects.create(
#                 Billing_Invoice_No=billing,
#                 Service_Type=item.get('ServiceType').upper(),
#                 Service_Code= item.get('TestCode') or item.get('Test_Code')  or item.get('Group_Code') or item.get('ServiceSubCatId'),
#                 Service_Name=item.get('SelectItemName'),
#                 Rate=self.safe_to_decimal(item.get('Rate')),
#                 Charge=self.safe_to_decimal(item.get('Charges')),
#                 Quantity=item.get('Quantity', 1),
#                 Amount=self.safe_to_decimal(item.get('Amount')),
#                 Discount_Type=item.get('Discountmethod'),
#                 Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
#                 Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
#                 Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
#                 Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
#                 Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
#                 Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
#                 Item_Status=new_bill_status,
#                 IsReimbursable=item.get('isReimbursable')
#             )
#     def Radiology_Requestlink_Billing(self,select_data,ip_billing,new_bill_status,created_by):
#         print('ucjcjvjhcj')
#         for item in select_data:
#             if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
#                 Test_Code = (item.get('ServiceSubCatId') or item.get('TestCode')).strip()
#                 RegisterType = "IP"
#                 try:
#                     testnames = TestName_Details.objects.get(Test_Code=Test_Code)
#                     Radiologyid = testnames.Radiology_Id.Radiology_Id
#                     Radiology_Request_Details.objects.create(
#                         RegisterType = RegisterType,
#                         OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
#                         IP_Register_Id=self.register if RegisterType == "IP" else None,
#                         Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
#                         Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
#                         TestCode=Radiologyid,
#                         SubTestCode=item.get('ServiceSubCatId').strip(),
#                         created_by=created_by,
#                         Status = new_bill_status,
#                         IP_Billing_Invoice_No = ip_billing 
#                     )
#                 except TestName_Details.DoesNotExist:
#                     print(f"TestName_Details not found for Test_Code: {Test_Code}")

#     def Radiology_Requestlink_InterimBilling(self,select_data,ip_billing,new_bill_status,created_by):
#         print('ucjcjvjhcj')
#         for item in select_data:
#             if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
#                 Test_Code = (item.get('ServiceSubCatId') or item.get('TestCode')).strip()
#                 RegisterType = "IP"
#                 try:
#                     testnames = TestName_Details.objects.get(Test_Code=Test_Code)
#                     Radiologyid = testnames.Radiology_Id.Radiology_Id
#                     Radiology_Request_Details.objects.create(
#                         RegisterType = RegisterType,
#                         OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
#                         IP_Register_Id=self.register if RegisterType == "IP" else None,
#                         Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
#                         Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
#                         TestCode=Radiologyid,
#                         SubTestCode=item.get('ServiceSubCatId').strip(),
#                         created_by=created_by,
#                         Status = new_bill_status,
#                         Interim_Billing_Invoice_No = ip_billing 
#                     )
#                 except TestName_Details.DoesNotExist:
#                     print(f"TestName_Details not found for Test_Code: {Test_Code}")


#     # def Lab_Request_Detailslink_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location):
#     #     try:
#     #         print('/////////////////////////////labbbbbb')
#     #         # print('dberger',item)
#     #         print('yvbhjkb',SelectedPatient_list.get('RegisterId'))
#     #         print('yvbhjkb',item)
#     #         service_types = []
#     #         for i in item:
#     #             print('uyfuygkj')
#     #             service_types.append(i.get('ServiceType'))
#     #         if 'LAB' in service_types:
#     #             print('vyujhbf')
#     #             created_by = Created_by
#     #             registration_id = SelectedPatient_list.get('RegisterId')

#     #             register_type = "IP"
#     #             # register_type = data.get('RegisterType', 'OP')
#     #             SelectedTest = item
#     #             location = location.Location_Id
#     #             # Remarks = data.get("Remarks",'')

#     #             # print('dberger',item)
#     #             print('yvbhjkb',registration_id)
#     #             print('uvbkjnk',SelectedTest)
#     #             # print('dberger',item)
#     #             # register_type = item.get('type')


#     #             if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
#     #                 return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})

#     #             # Prepare the arguments based on the register type
#     #             register_kwargs = {'RegisterType': register_type}
#     #             if register_type == 'OP':
#     #                 try:
#     #                     print('xxxxxxxxxxxxxxxxxxx')
#     #                     op_register_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
#     #                     register_kwargs['OP_Register_Id'] = op_register_instance
#     #                 except Patient_Appointment_Registration_Detials.DoesNotExist:
#     #                     return JsonResponse({'warn': 'OP Registration ID not found'})

#     #             elif register_type == 'IP':
#     #                 try:
#     #                     ip_register_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
#     #                     register_kwargs['IP_Register_Id'] = ip_register_instance
#     #                 except Patient_IP_Registration_Detials.DoesNotExist:
#     #                     return JsonResponse({'warn': 'IP Registration ID not found'})

#     #             elif register_type == 'Casuality':
#     #                 try:
#     #                     casuality_register_instance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=registration_id)
#     #                     register_kwargs['Casuality_Register_Id'] = casuality_register_instance
#     #                 except Patient_Casuality_Registration_Detials.DoesNotExist:
#     #                     return JsonResponse({'warn': 'Casuality Registration ID not found'})

#     #             # Insert into Lab_Request_Details
#     #             Location_instance = Location_Detials.objects.get(Location_Id=location)
#     #             lab_request = Lab_Request_Details.objects.create(
#     #                 created_by=created_by,
#     #                 Location=Location_instance,
#     #                 Billing_Status = new_bill_status,
#     #                 Status = new_bill_status,
#     #                 # Billing_Invoice_No = general_billing,
#     #                 # Remarks=Remarks,
#     #                 **register_kwargs,
#     #             )
#     #             print('labbbbb createddd')





#     #             # Loop through SelectedTest and insert into Lab_Request_Items_Details
#     #             for test in SelectedTest:
#     #                 print('tettttttt',test)
#     #                 if test.get("ServiceType") == 'LAB':
#     #                     print(test,'test')
#     #                     SubDepartment_Code = test.get("sub_department_id")
#     #                     testType = test.get("type")
#     #                     Department_Code = test.get("department_id")
#     #                     Code = test.get("ServiceSubCatId").strip()
#     #                     print(testType,'testtypeeee')
#     #                     print(Code,'COdeeeee')
#     #                     NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
#     #                         item_id_int=Cast("Item_Id", IntegerField())
#     #                     ).aggregate(Max("item_id_int"))["item_id_int__max"]
#     #                     NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

#     #                     print(NextItemID,'NextItemID')
#     #                     Dcode = None
#     #                     lab_request_item_data = {}
#     #                     if testType == 'Individual' or testType == 'individual':
#     #                         print(testType,'testType')
#     #                         print(Code,'COdeeeee')
#     #                         print(len(Code))
#     #                         Dcode = Test_Descriptions.objects.get(Test_Code = Code)
#     #                         print('testttttt',Dcode)
#     #                         lab_request_item_data = {
#     #                             "Item_Id":NextItemID,
#     #                             "Request": lab_request,
#     #                             "TestType": testType,
#     #                             "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
#     #                             "Department_Code_id": Dcode.department.Department_Code,
#     #                             }
#     #                     elif testType == 'Group':
#     #                         print(testType,'testType')
#     #                         Gcode = Group_Master.objects.get(Group_Code = Code)

#     #                         lab_request_item_data = {
#     #                             "Item_Id":NextItemID,
#     #                             "Request": lab_request,
#     #                             "TestType": testType,
#     #                             "Department_Code_id": Gcode.Department.department.Department_Code,
#     #                             "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
#     #                             }
#     #                     elif testType == 'Offers':
#     #                         print(testType, 'testType')
#     #                         Pcode = OfferPackageMaster.objects.get(package_code=Code)
#     #                         department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
#     #                         lab_department = Lab_Department_Detials.objects.get(Department_Code=department.department_id)
#     #                         print("---------", Pcode.department_name)
#     #                         print("---------", Pcode.pk)
#     #                         print("----IDDDDDDD-----", Pcode.offer_package_id)
#     #                         lab_request_item_data = {
#     #                             "Item_Id": NextItemID,
#     #                             "Request": lab_request,
#     #                             "TestType": testType,
#     #                             "Department_Code_id": lab_department.pk,
#     #                             "SubDepartment_Code_id": department.pk,
#     #                         }
#     #                     print(NextItemID,'NextItemID')



#     #                     print(lab_request_item_data,'lab_request_item_data')
#     #                     # Insert into appropriate columns based on testType
#     #                     if testType == "Individual" or testType == "individual":
#     #                         print('summaaa1111')
#     #                         lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
#     #                     elif testType == "Profiles" or testType == "Group":
#     #                         lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
#     #                     elif testType == "Profiles" or testType == "Offers":
#     #                         lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code
#     #                     # Save the item
#     #                     Lab_Request_Items_Details.objects.create(**lab_request_item_data)

#     #             if register_type == 'IP':       
#     #                 item_details = []
#     #                 filterdepartment = []
#     #                 TestDetails = []
#     #                 keys_seen = set()
#     #                 filterSpecimen = []
#     #                 Specimen_keys_seen = set()
#     #                 print('intooo the forr loop')
#     #                 for index, item in enumerate(lab_request.lab_request_items.filter(Request = lab_request.Request_Id), start=1):
#     #                     print("TestType :",item.TestType)
#     #                     print(model_to_dict(item))                        
                        
#     #                     if item.TestType.lower() == "individual":
#     #                         if lab_request.Billing_Status == "Completed":
#     #                             sub_department_code = (
#     #                                 item.Test_Code.sub_department.SubDepartment_Code
#     #                             )
#     #                             sub_department_name = (
#     #                                 item.Test_Code.sub_department.SubDepartment_Name
#     #                             )

#     #                             if sub_department_code not in keys_seen:
#     #                                 filterdepartment.append(
#     #                                     {
#     #                                         "key": sub_department_code,
#     #                                         "value": sub_department_name,
#     #                                     }
#     #                                 )
#     #                                 keys_seen.add(sub_department_code)

#     #                             Specimen_Name = (
#     #                                 item.Test_Code.Specimen_Name.Specimen_Name
#     #                                 if item.Test_Code.Specimen_Name
#     #                                 else None
#     #                             )
#     #                             Specimen_Code = (
#     #                                 item.Test_Code.Specimen_Name.Specimen_Code
#     #                                 if item.Test_Code.Specimen_Name
#     #                                 else None
#     #                             )

#     #                             if Specimen_Code not in Specimen_keys_seen:
#     #                                 filterSpecimen.append(
#     #                                     {"key": Specimen_Code, "value": Specimen_Name}
#     #                                 )
#     #                                 Specimen_keys_seen.add(Specimen_Code)

#     #                         print("type :", item.TestType)
#     #                         print("item.Test_Code :", item.Test_Code)
#     #                         test_cost = Testmaster_Cost_List.objects.filter(
#     #                             Test_Code=item.Test_Code.Test_Code
#     #                         ).first()
                        
#     #                         print('test_cost :',test_cost)
#     #                         print('Billing_Status :',lab_request.Billing_Status)
                            
#     #                         if lab_request.Billing_Status == "Completed":
#     #                             data = model_to_dict(item.Test_Code)
#     #                             modified_data = (
#     #                                 {}
#     #                             )  # Create a new dictionary to store the modified data
#     #                             for key, value in data.items():
#     #                                 if key == "department" and item.Test_Code.department:
#     #                                     modified_data[key] = (
#     #                                         item.Test_Code.department.Department_Name
#     #                                     )
#     #                                     modified_data["Department_Code"] = (
#     #                                         item.Test_Code.department.Department_Code
#     #                                     )
#     #                                 elif (
#     #                                     key == "sub_department"
#     #                                     and item.Test_Code.sub_department
#     #                                 ):
#     #                                     modified_data[key] = (
#     #                                         item.Test_Code.sub_department.SubDepartment_Name
#     #                                     )
#     #                                     modified_data["SubDepartment_Code"] = (
#     #                                         item.Test_Code.sub_department.SubDepartment_Code
#     #                                     )
#     #                                 elif (
#     #                                     key == "Container_Name"
#     #                                     and item.Test_Code.Container_Name
#     #                                 ):
#     #                                     modified_data[key] = (
#     #                                         item.Test_Code.Container_Name.Container_Name
#     #                                     )
#     #                                 elif (
#     #                                     key == "Specimen_Name"
#     #                                     and item.Test_Code.Specimen_Name is not None
#     #                                 ):
#     #                                     modified_data[key] = (
#     #                                         item.Test_Code.Specimen_Name.Specimen_Name
#     #                                     )
#     #                                 elif key == "Method_Name" and item.Test_Code.Method_Name:
#     #                                     modified_data[key] = (
#     #                                         item.Test_Code.Method_Name.Method_Name
#     #                                     )
#     #                                 elif key == "UOM" and item.Test_Code.UOM:
#     #                                     modified_data[key] = item.Test_Code.UOM.Unit_Name
#     #                                 elif (
#     #                                     key == "Captured_Unit_UOM"
#     #                                     and item.Test_Code.Captured_Unit_UOM
#     #                                 ):
#     #                                     modified_data[key] = (
#     #                                         item.Test_Code.Captured_Unit_UOM.Unit_Name
#     #                                     )
#     #                                 else:
#     #                                     modified_data[key] = value  # Copy unchanged values
                                    
#     #                                 RefernceRangeData = Age_Setup_Master.objects.filter(
#     #                                     Test_Code=item.Test_Code.Test_Code
#     #                                 ).first()
                                    
#     #                                 reference_range = RefernceRangeData.Reference_Range
#     #                                 NormalValue = RefernceRangeData.NormalValue
#     #                                 Panic_Low = RefernceRangeData.PanicLow
#     #                                 Panic_High = RefernceRangeData.PanicHigh

#     #                                 if NormalValue == "Yes":
#     #                                     panic_low, panic_high = extract_panic_range(
#     #                                         reference_range, patient.Gender
#     #                                     )
#     #                                     modified_data["paniclow"] = panic_low
#     #                                     modified_data["panichigh"] = panic_high
#     #                                 else:
#     #                                     modified_data["paniclow"] = Panic_Low
#     #                                     modified_data["panichigh"] = Panic_High
#     #                                 modified_data["type"] = "individual"
                                    
#     #                                 modified_data["Display_Service_Status"] = "Completed"
#     #                                 modified_data["Display_Analysis_Status"] = "Completed"
#     #                                 modified_data["Display_Verify_Status"] = "Verified"
#     #                                 modified_data["Display_Approve_Status"] = "Approved"
                                    
#     #                                 modified_data["Service_Status"] = "Completed"
#     #                                 modified_data["Analysis_Status"] = item.Analysis_Status
#     #                                 modified_data["Verify_Status"] = item.Verify_Status
#     #                                 modified_data["Approve_Status"] = item.Approve_Status
                                    
                                    
                                    
#     #                                 modified_data["referencedata"] = reference_range
#     #                                 modified_data["NormalValue"] = NormalValue 
#     #                                 modified_data["Result_Value"] = None 
#     #                                 modified_data["Remarks"] = None
#     #                                 modified_data["Result_Value"] = item.Result_Value
#     #                                 modified_data["TestType"] = "Individual"
#     #                                 modified_data["ColumName"] = "Test_Code"

#     #                             # Append the modified dictionary to TestDetails
#     #                             TestDetails.append(modified_data)

#     #                         item_details.append(
#     #                             {
#     #                                 "type": "individual",
#     #                                 "S_No": index,
#     #                                 "Test_Code": (
#     #                                     item.Test_Code.Test_Code if item.Test_Code else None
#     #                                 ),
#     #                                 "SelectItemName": (
#     #                                     item.Test_Code.Test_Name if item.Test_Code else None
#     #                                 ),
#     #                                 "Gender": item.Test_Code.Gender if item.Test_Code else None,
#     #                                 "ServiceType": "Lab",
#     #                                 "Charges": test_cost.Basic if test_cost else None,
#     #                                 "Amount": test_cost.Basic if test_cost else None,
#     #                                 "Total": test_cost.Basic if test_cost else None,
#     #                                 "NetAmount": test_cost.Basic if test_cost else None,
#     #                                 "Quantity":1,
#     #                                 "DiscountType": "",
#     #                                 "Discount": "",
#     #                                 "GST_per": "",
#     #                                 "GST": "",
#     #                                 "DiscountAmount": "",
#     #                                 "isReimbursable": "No",
#     #                             }
#     #                         )
#     #                     elif item.TestType.lower() == "group":
#     #                         if lab_request.Billing_Status == "Completed":
#     #                             if (
#     #                                 item.Group_Code.Department.SubDepartment_Code
#     #                                 not in filterdepartment
#     #                             ):
#     #                                 filterdepartment.append(
#     #                                     {
#     #                                         "key": item.Group_Code.Department.SubDepartment_Code,
#     #                                         "value": item.Group_Code.Department.SubDepartment_Name,
#     #                                     }
#     #                                 )

#     #                         # Get group test cost
#     #                         test_cost = Testmaster_Cost_List.objects.filter(
#     #                             Group_Code=item.Group_Code
#     #                         ).first()

#     #                         # Fetch sub-items for the group
#     #                         group_items = []
#     #                         sub_item_instances = Group_Master_TestList.objects.filter(
#     #                             Group_Code=item.Group_Code
#     #                         )
#     #                         for sub_item in sub_item_instances:
#     #                             if sub_item.Test_Code:

#     #                                 Specimen_Name = (
#     #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name
#     #                                 )
#     #                                 Specimen_Code = (
#     #                                     sub_item.Test_Code.Specimen_Name.Specimen_Code
#     #                                 )

#     #                                 if Specimen_Code not in Specimen_keys_seen:
#     #                                     filterSpecimen.append(
#     #                                         {"key": Specimen_Code, "value": Specimen_Name}
#     #                                     )
#     #                                     Specimen_keys_seen.add(Specimen_Code)

#     #                                 sub_item_data = model_to_dict(sub_item.Test_Code)
#     #                                 # Add any additional details or transformations if needed
#     #                                 # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#     #                                 sub_item_data["SubDepartment_Name"] = (
#     #                                     sub_item.Test_Code.sub_department.SubDepartment_Name
#     #                                     if sub_item.Test_Code.sub_department
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Container_Name"] = (
#     #                                     sub_item.Test_Code.Container_Name.Container_Name
#     #                                     if sub_item.Test_Code.Container_Name
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Specimen_Name"] = (
#     #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name
#     #                                     if sub_item.Test_Code.Specimen_Name
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Method_Name"] = (
#     #                                     sub_item.Test_Code.Method_Name.Method_Name
#     #                                     if sub_item.Test_Code.Method_Name
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["UOM"] = (
#     #                                     sub_item.Test_Code.UOM.Unit_Name
#     #                                     if sub_item.Test_Code.UOM
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Captured_Unit_UOM"] = (
#     #                                     sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#     #                                     if sub_item.Test_Code.Captured_Unit_UOM
#     #                                     else None
#     #                                 )

#     #                                 sub_item_data["Result_Value"] = None

#     #                                 sub_item_data["columnname"] = "Group_Code"

#     #                                 group_items.append(sub_item_data)

#     #                         # Add group-level item details
#     #                         item_details.append(
#     #                             {
#     #                                 "type": "group",
#     #                                 "S_No": index,
#     #                                 "Group_Code": (
#     #                                     item.Group_Code.Group_Code if item.Group_Code else None
#     #                                 ),
#     #                                 "SelectItemName": (
#     #                                     item.Group_Code.Group_Name if item.Group_Code else None
#     #                                 ),
#     #                                 "Gender": "All",
#     #                                 "Department": (
#     #                                     item.Group_Code.Department.SubDepartment_Name
#     #                                     if item.Group_Code.Department
#     #                                     else None
#     #                                 ),
#     #                                 "group_items": group_items,  # Include detailed sub-items here
#     #                                 "ServiceType": "Lab",
#     #                                 "Charges": test_cost.Basic if test_cost else None,
#     #                                 "Amount": test_cost.Basic if test_cost else None,
#     #                                 "NetAmount": test_cost.Basic if test_cost else None,
#     #                                 "Total": test_cost.Basic if test_cost else None,
#     #                                 "Quantity":1,
#     #                                 "DiscountType": "",
#     #                                 "Discount": "",
#     #                                 "GST_per": "",
#     #                                 "GST": "",
#     #                                 "DiscountAmount": "",
#     #                                 "isReimbursable": "No",
#     #                             }
#     #                         )

#     #                         TestDetails.append(
#     #                             {
#     #                                 "type": "group",
#     #                                 "S_No": index,
#     #                                 "Group_Code": (
#     #                                     item.Group_Code.Group_Code if item.Group_Code else None
#     #                                 ),
#     #                                 "SelectItemName": (
#     #                                     item.Group_Code.Group_Name if item.Group_Code else None
#     #                                 ),
#     #                                 "Gender": "All",
#     #                                 "SubDepartment_Code": (
#     #                                     item.Group_Code.Department.SubDepartment_Code
#     #                                     if item.Group_Code.Department
#     #                                     else None
#     #                                 ),
#     #                                 "Department": (
#     #                                     item.Group_Code.Department.SubDepartment_Name
#     #                                     if item.Group_Code.Department
#     #                                     else None
#     #                                 ),
#     #                                 "group_items": group_items,  # Include detailed sub-items here
#     #                                 "ServiceType": "Lab",
#     #                                 "Charges": test_cost.Basic if test_cost else None,
#     #                                 "Amount": test_cost.Basic if test_cost else None,
#     #                                 "NetAmount": test_cost.Basic if test_cost else None,
#     #                                 "Total": test_cost.Basic if test_cost else None,
#     #                                 "Quantity":1,
#     #                                 "DiscountType": "",
#     #                                 "Discount": "",
#     #                                 "GST_per": "",
#     #                                 "GST": "",
#     #                                 "DiscountAmount": "",
#     #                                 "isReimbursable": "No",
#     #                                 "Service_Status": "Completed",
#     #                                 "Analysis_Status": item.Analysis_Status,
#     #                                 "Verify_Status": item.Verify_Status,
#     #                                 "Approve_Status": item.Approve_Status,
#     #                             "TestType" : "Group",
#     #                             "ColumName": "Group_Code",
#     #                             "Result_Value": None
#     #                             }
#     #                         )
#     #                     elif item.TestType.lower() == "offers":
                            
#     #                         sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
#     #                         if lab_request.Billing_Status == "Completed":
                                
#     #                             if (
#     #                                 item.Package_code.department_name
#     #                                 not in filterdepartment
#     #                             ):
#     #                                 filterdepartment.append(
#     #                                     {
#     #                                         "key": sub_dpt.pk,
#     #                                         "value": item.Package_Code.department_name,
#     #                                     }
#     #                                 )

#     #                         # Get group test cost
#     #                         test_cost = Testmaster_Cost_List.objects.filter(
#     #                             Package_Code=item.Package_Code
#     #                         ).first()

#     #                         # Fetch sub-items for the group
#     #                         group_items = []
#     #                         sub_item_instances = OfferPackageList.objects.filter(
#     #                             package_code=item.Package_Code.package_code
#     #                         )
#     #                         print("-------Offer-------",sub_item_instances)
#     #                         for sub_item in sub_item_instances:
#     #                             print("-------Item-------",sub_item.Test_Code)
                                
#     #                             if sub_item.Test_Code:
#     #                                 print("------Test------",sub_item.Test_Code.Test_Name)
#     #                                 Specimen_Name = (
#     #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#     #                                 )
#     #                                 Specimen_Code = (
#     #                                     sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
#     #                                 )

#     #                                 if Specimen_Code not in Specimen_keys_seen:
#     #                                     filterSpecimen.append(
#     #                                         {"key": Specimen_Code, "value": Specimen_Name}
#     #                                     )
#     #                                     Specimen_keys_seen.add(Specimen_Code)

#     #                                 sub_item_data = model_to_dict(sub_item.Test_Code)
#     #                                 # Add any additional details or transformations if needed
#     #                                 # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#     #                                 sub_item_data["SubDepartment_Name"] = (
#     #                                     sub_item.Test_Code.sub_department.SubDepartment_Name
#     #                                     if sub_item.Test_Code.sub_department
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Container_Name"] = (
#     #                                     sub_item.Test_Code.Container_Name.Container_Name
#     #                                     if sub_item.Test_Code.Container_Name
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Specimen_Name"] = (
#     #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#     #                                     if sub_item.Test_Code.Specimen_Name 
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Method_Name"] = (
#     #                                     sub_item.Test_Code.Method_Name.Method_Name
#     #                                     if sub_item.Test_Code.Method_Name
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["UOM"] = (
#     #                                     sub_item.Test_Code.UOM.Unit_Name
#     #                                     if sub_item.Test_Code.UOM
#     #                                     else None
#     #                                 )
#     #                                 sub_item_data["Captured_Unit_UOM"] = (
#     #                                     sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#     #                                     if sub_item.Test_Code.Captured_Unit_UOM
#     #                                     else None
#     #                                 )

#     #                                 sub_item_data["Result_Value"] = None

#     #                                 sub_item_data["columnname"] = "Group_Code"
#     #                                 sub_item_data["Group_Code"] = ""
#     #                                 sub_item_data["Group_Name"] = ""

#     #                                 print("-------Items-------",sub_item_data['Test_Name'])
#     #                                 if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
#     #                                     group_items.append(sub_item_data)
                                
#     #                             elif sub_item.Group_Code:
#     #                                 print("------group------",sub_item.Group_Code.Group_Code)
#     #                                 group = sub_item.Group_Code.Group_Code
#     #                                 groupName = sub_item.Group_Code.Group_Name
#     #                                 sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
#     #                                 print("-------Item-------",sub_item_instances)
#     #                                 for sub_item in sub_item_instances:
#     #                                     print("------Test------",sub_item.Test_Code.Test_Name)
#     #                                     Specimen_Name = (
#     #                                         sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#     #                                     )
#     #                                     Specimen_Code = (
#     #                                         sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
#     #                                     )

#     #                                     if Specimen_Code not in Specimen_keys_seen:
#     #                                         filterSpecimen.append(
#     #                                             {"key": Specimen_Code, "value": Specimen_Name}
#     #                                         )
#     #                                         Specimen_keys_seen.add(Specimen_Code)

#     #                                     sub_item_data = model_to_dict(sub_item.Test_Code)
#     #                                     # Add any additional details or transformations if needed
#     #                                     # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#     #                                     sub_item_data["SubDepartment_Name"] = (
#     #                                         sub_item.Test_Code.sub_department.SubDepartment_Name
#     #                                         if sub_item.Test_Code.sub_department
#     #                                         else None
#     #                                     )
#     #                                     sub_item_data["Container_Name"] = (
#     #                                         sub_item.Test_Code.Container_Name.Container_Name
#     #                                         if sub_item.Test_Code.Container_Name
#     #                                         else None
#     #                                     )
#     #                                     sub_item_data["Specimen_Name"] = (
#     #                                         sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#     #                                         if sub_item.Test_Code.Specimen_Name 
#     #                                         else None
#     #                                     )
#     #                                     sub_item_data["Method_Name"] = (
#     #                                         sub_item.Test_Code.Method_Name.Method_Name
#     #                                         if sub_item.Test_Code.Method_Name
#     #                                         else None
#     #                                     )
#     #                                     sub_item_data["UOM"] = (
#     #                                         sub_item.Test_Code.UOM.Unit_Name
#     #                                         if sub_item.Test_Code.UOM
#     #                                         else None
#     #                                     )
#     #                                     sub_item_data["Captured_Unit_UOM"] = (
#     #                                         sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#     #                                         if sub_item.Test_Code.Captured_Unit_UOM
#     #                                         else None
#     #                                     )

#     #                                     sub_item_data["Result_Value"] = None

#     #                                     sub_item_data["columnname"] = "Group_Code"
#     #                                     sub_item_data["Group_Code"] = group
#     #                                     sub_item_data["Group_Name"] = groupName

#     #                                     print("-------Items-------",sub_item_data['Test_Name'])
#     #                                     if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
#     #                                         group_items.append(sub_item_data)
                                
#     #                         # Add group-level item details
#     #                         item_details.append(
#     #                             {
#     #                                 "type": "Offers",
#     #                                 "S_No": index,
#     #                                 "Request_Id": lab_request.Request_Id,
#     #                                 "Group_Code": (
#     #                                     item.Package_Code.package_code if item.Package_Code else None
#     #                                 ),
#     #                                 "SelectItemName": (
#     #                                     item.Package_Code.package_name if item.Package_Code else None
#     #                                 ),
#     #                                 "Gender": "All",
#     #                                 "Department": (
#     #                                     item.Package_Code.department_name
#     #                                     if item.Package_Code.department_name
#     #                                     else None
#     #                                 ),
#     #                                 "group_items": group_items,  # Include detailed sub-items here
#     #                                 "ServiceType": "Lab",
#     #                                 "Charges": test_cost.Basic if test_cost else None,
#     #                                 "Amount": test_cost.Basic if test_cost else None,
#     #                                 "NetAmount": test_cost.Basic if test_cost else None,
#     #                                 "Total": test_cost.Basic if test_cost else None,
#     #                                 "Quantity":1,
#     #                                 "DiscountType": "",
#     #                                 "Discount": "",
#     #                                 "GST_per": "",
#     #                                 "GST": "",
#     #                                 "DiscountAmount": "",
#     #                                 "isReimbursable": "No",
#     #                             }
#     #                         )
#     #                         print("---------OK--------")
#     #                         TestDetails.append(
#     #                             {
#     #                                 "type": "Offers",
#     #                                 "S_No": index,
#     #                                 "Group_Code": (
#     #                                     item.Package_Code.package_code if item.Package_Code else None
#     #                                 ),
#     #                                 "SelectItemName": (
#     #                                     item.Package_Code.package_name if item.Package_Code else None
#     #                                 ),
#     #                                 "Gender": "All",
#     #                                 "SubDepartment_Code": (
#     #                                     sub_dpt.SubDepartment_Code
#     #                                     if item.Package_Code.department_name
#     #                                     else None
#     #                                 ),
#     #                                 "Department": (
#     #                                     item.Package_Code.department_name
#     #                                     if item.Package_Code.department_name
#     #                                     else None
#     #                                 ),
#     #                                 "group_items": group_items,  # Include detailed sub-items here
#     #                                 "ServiceType": "Lab",
#     #                                 "Charges": test_cost.Basic if test_cost else None,
#     #                                 "Amount": test_cost.Basic if test_cost else None,
#     #                                 "NetAmount": test_cost.Basic if test_cost else None,
#     #                                 "Total": test_cost.Basic if test_cost else None,
#     #                                 "Quantity":1,
#     #                                 "DiscountType": "",
#     #                                 "Discount": "",
#     #                                 "GST_per": "",
#     #                                 "GST": "",
#     #                                 "DiscountAmount": "",
#     #                                 "isReimbursable": "No",
#     #                                 "Service_Status": "Completed",
#     #                                 "Analysis_Status": item.Analysis_Status,
#     #                                 "Verify_Status": item.Verify_Status,
#     #                                 "Approve_Status": item.Approve_Status,
#     #                             "TestType" : "Offers",
#     #                             "ColumName": "Package_Code",
#     #                             "Result_Value": None
#     #                             }
#     #                         )
                    
#     #                 print("-----ITEMS-----",item_details)
#     #                 print('-----Billing---',model_to_dict(general_billing))
                    
#     #                 bill_exists = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = general_billing.Billing_Invoice_No).exists()

#     #                 VisitId = PatientVisitId.objects.filter(Patient_Id=ip_register_instance.PatientId.PatientId).order_by('-Visit_Id').first()
#     #                 if VisitId:
#     #                     VisitId = VisitId.Visit_Id + 1
#     #                 else:
#     #                     VisitId = 1

                    

#     #                 if not bill_exists:
#     #                     count = len(item_details)
#     #                     BarcodeId = get_invoice_master_barcode()
#     #                     invoiceTable = BillingInvoiceAndBillAmount.objects.create(
#     #                         Billing_Invoice = general_billing.Billing_Invoice_No,
#     #                         Patient_Id = ip_register_instance.PatientId.PatientId,
#     #                         # Visit_Id = visit.VisitId,
#     #                         Patient_Name = ip_register_instance.PatientId.FirstName,
#     #                         Item_Count = count,
#     #                         Total_Charge = general_billing.Net_Amount,
#     #                         Status = new_bill_status,
#     #                         Location = Location_instance.Location_Name,
#     #                         Capture_Sample_Status = "Pending",
#     #                         Analyze_Status = "Pending",
#     #                         Verify_Status = "Pending",
#     #                         Approve_Status = "Pending",
#     #                         Barcode_Id = BarcodeId,
#     #                         Group_Name = "",
#     #                         CreatedBy = created_by,
#     #                         Billing_Date = datetime.date(datetime.now()),
#     #                         Billing_Type = "",
#     #                         RateCard_Name = '',
#     #                         Test_Code = "",
#     #                         Group_Code = "",
#     #                         TotalPaidAmount = general_billing.Paid_Amount,
#     #                         BalanceAmount = general_billing.Balance_Amount,
#     #                         Sample_Barcode_Image = None,
#     #                         AdditionalAmount = '0.00',
#     #                         AdditionalAmountReason = "",
#     #                         DiscountReason = "",
#     #                         HistoNumber = '',
#     #                         MicroNumber = '',
#     #                         Transfer_Location= "",
#     #                         Registration_Id = registration_id

#     #                     )
#     #                     invoiceTable.save()
#     #                     print("--------Invoice Table OK--------")
#     #                 for item in item_details:
#     #                     if item["type"] == "Offers":
                            
#     #                         if item.get("group_items"):
#     #                             for subtest in item.get("group_items", []):
#     #                                 if subtest["Group_Code"] and subtest["Group_Name"]:
#     #                                     group=subtest["Group_Code"]
#     #                                     groupName=subtest["Group_Name"]
#     #                                 else:
#     #                                     group=""
#     #                                     groupName=""

#     #                                 invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#     #                                 Billing_Invoice = general_billing.Billing_Invoice_No,
#     #                                 Patient_Id = ip_register_instance.PatientId.PatientId,
#     #                                 # Visit_Id = visit.VisitId,
#     #                                 Patient_Name = ip_register_instance.PatientId.FirstName,
#     #                                 Dispatch_Method = "",
#     #                                 Test_Method = item["type"],
#     #                                 Test_Name = subtest["Test_Name"],
#     #                                 Gross_Amount = item["Charges"],
#     #                                 Location = Location_instance.Location_Name,
#     #                                 Service_Status = "Pending",
#     #                                 Analysis_Status = "Pending",
#     #                                 Verify_Status = "Pending",
#     #                                 Approve_Status = "Pending",
#     #                                 Barcode_Id = BarcodeId,
#     #                                 Group_Name = groupName,
#     #                                 CreatedBy = created_by,
#     #                                 Billing_Date = datetime.date(datetime.now()),
#     #                                 Test_Code = subtest["Test_Code"],
#     #                                 Group_Code = group,
#     #                                 individual_add_amount = None,
#     #                                 IsSubTest = subtest.get("IsSubTest", ""),
#     #                                 SubTestCodes = subtest.get("SubTestCodes", ""),
#     #                                 Transfer_Location = "",
#     #                                 PackageCode = item.get("Group_Code", ""),
#     #                                 PackageName = item.get("SelectItemName", ""),
#     #                                 Bill_Status = new_bill_status
#     #                                 )
#     #                                 invoiceItemTable.save()
#     #                         else:
#     #                             print("--------Offer-Test---------", item)
#     #                             invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#     #                             Billing_Invoice = general_billing.Billing_Invoice_No,
#     #                             Patient_Id = ip_register_instance.PatientId.PatientId,
#     #                             # Visit_Id = visit.VisitId,
#     #                             Patient_Name = ip_register_instance.PatientId.FirstName,
#     #                             Dispatch_Method = "",
#     #                             Test_Method = item["type"],
#     #                             Test_Name = item["SelectItemName"],
#     #                             Gross_Amount = item["Charges"],
#     #                             Location = Location_instance.Location_Name,
#     #                             Service_Status = "Pending",
#     #                             Analysis_Status = "Pending",
#     #                             Verify_Status = "Pending",
#     #                             Approve_Status = "Pending",
#     #                             Barcode_Id = BarcodeId,
#     #                             Group_Name = "",
#     #                             CreatedBy = created_by,
#     #                             Billing_Date = datetime.date(datetime.now()),
#     #                             Test_Code = item["Test_Code"],
#     #                             Group_Code = "",
#     #                             individual_add_amount = None,
#     #                             IsSubTest = "",
#     #                             SubTestCodes = "",
#     #                             Transfer_Location = "",
#     #                             PackageCode = "",
#     #                             PackageName = "",
#     #                             Bill_Status = new_bill_status
#     #                             )
#     #                             invoiceItemTable.save()                    
#     #                     elif item["type"] == "group":
#     #                         for subtest in item.get("group_items", []):
#     #                             invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#     #                                 Billing_Invoice = general_billing.Billing_Invoice_No,
#     #                                 Patient_Id = ip_register_instance.PatientId.PatientId,
#     #                                 # Visit_Id = visit.VisitId,
#     #                                 Patient_Name = ip_register_instance.PatientId.FirstName,
#     #                                 Dispatch_Method = "",
#     #                                 Test_Method = item["type"],
#     #                                 Test_Name = subtest["Test_Name"],
#     #                                 Gross_Amount = item["Charges"],
#     #                                 Location = Location_instance.Location_Name,
#     #                                 Service_Status = "Pending",
#     #                                 Analysis_Status = "Pending",
#     #                                 Verify_Status = "Pending",
#     #                                 Approve_Status = "Pending",
#     #                                 Barcode_Id = BarcodeId,
#     #                                 Group_Name = item.get("SelectItemName", ""),
#     #                                 CreatedBy = created_by,
#     #                                 Billing_Date = datetime.date(datetime.now()),
#     #                                 Test_Code = subtest["Test_Code"],
#     #                                 Group_Code = item.get("Group_Code", ""),
#     #                                 individual_add_amount = None,
#     #                                 IsSubTest = subtest.get("IsSubTest", ""),
#     #                                 SubTestCodes = subtest.get("SubTestCodes", ""),
#     #                                 Transfer_Location = "",
#     #                                 PackageCode = "",
#     #                                 PackageName = "",
#     #                                 Bill_Status = new_bill_status
#     #                             )
#     #                             invoiceItemTable.save()
#     #                     else:
#     #                         print("---------Test---------", item)
#     #                         invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#     #                             Billing_Invoice = general_billing.Billing_Invoice_No,
#     #                             Patient_Id = ip_register_instance.PatientId.PatientId,
#     #                             # Visit_Id =  visit.VisitId,
#     #                             Patient_Name = ip_register_instance.PatientId.FirstName,
#     #                             Dispatch_Method = "",
#     #                             Test_Method = item["type"],
#     #                             Test_Name = item["SelectItemName"],
#     #                             Gross_Amount = item["Charges"],
#     #                             Location = Location_instance.Location_Name,
#     #                             Service_Status = "Pending",
#     #                             Analysis_Status = "Pending",
#     #                             Verify_Status = "Pending",
#     #                             Approve_Status = "Pending",
#     #                             Barcode_Id = BarcodeId,
#     #                             Group_Name = "",
#     #                             CreatedBy = created_by,
#     #                             Billing_Date = datetime.date(datetime.now()),
#     #                             Test_Code = item["Test_Code"],
#     #                             Group_Code = "",
#     #                             individual_add_amount = None,
#     #                             IsSubTest = "",
#     #                             SubTestCodes = "",
#     #                             Transfer_Location = "",
#     #                             PackageCode = "",
#     #                             PackageName = "",
#     #                             Bill_Status = new_bill_status
#     #                         )
#     #                         invoiceItemTable.save()
                    
#     #                 print("--------Invoice Item Table OK--------")
#     #                 try:      
#     #                         exists= Register_patient_Details.objects.filter(Patient_Id = ip_register_instance.PatientId.PatientId).exists()
#     #                         patient_id = ip_register_instance.PatientId.PatientId
#     #                         patient = Patient_Detials.objects.get(PatientId = ip_register_instance.PatientId.PatientId)

#     #                         if not exists:   

                                
                                
                                     
#     #                             PatientData = Register_patient_Details(
#     #                                 Patient_Id = patient_id if patient_id else None,
#     #                                 Title = patient.Title.Title_Name,
#     #                                 Patient_Name =  patient.FirstName,
#     #                                 Father_Name = patient.FatherName,
#     #                                 DOB = patient.DOB,
#     #                                 Age = patient.Age,
#     #                                 Gender = patient.Gender,
#     #                                 Marital_Status = "",
#     #                                 Door_No = patient.DoorNo,
#     #                                 Street = patient.Street,
#     #                                 Rural_Urban ="",
#     #                                 City = patient.City,
#     #                                 State = patient.State,
#     #                                 Pincode = patient.Pincode,
#     #                                 Phone = patient.PhoneNo,
#     #                                 Alternate_No = "",
#     #                                 Email = patient.Email,
#     #                                 Location = Location_instance.Location_Name,
#     #                                 Patient_Barcode = patient_id if patient_id else None,
#     #                                 Time_Period = 'year',
#     #                                 CreatedBy =created_by,    
#     #                             )
#     #                             PatientData.save()
#     #                             print("--------Patient Data OK--------")
#     #                         # Create and save the Patient Visit Table entry
#     #                         doctor_name = None
#     #                         if self.doctor:
#     #                             docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=self.doctor.Doctor_ID).first()
#     #                             spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=self.doctor.Doctor_ID).first()

#     #                             if docs:
#     #                                 doctor_name =  docs.First_Name + "/" + spc.Specialization.Speciality_Name or ""
#     #                             else:
#     #                                 doctor_name = 'Self'

#     #                         visitTable = PatientVisitId.objects.create(
#     #                                 Visit_Id = VisitId,
#     #                                 Patient_Name = patient.FirstName,
#     #                                 Patient_Id = patient_id,
#     #                                 Phone = patient.PhoneNo,
#     #                                 Visit_Type = "IP",
#     #                                 Phlebotomist_Type = "",
#     #                                 Phlebotomist_Name = "",
#     #                                 Refering_Doctor = doctor_name,
#     #                                 Patient_Group = ip_register_instance.PatientCategory,
#     #                                 Dispatch_Method = "",
#     #                                 Patient_Barcode =  patient_id,
#     #                                 CreatedBy = created_by,
#     #                                 Location = Location_instance.Location_Name,
#     #                                 Outsourced_Type = "",
#     #                                 Refering_Hospital = "",
#     #                             )
#     #                         visitTable.save()
#     #                         print("--------Patient Visit Table OK--------")
#     #                 except Exception as e:
#     #                         print(str(e))
                
        
#     #             return ('success Data saved successfully')
        
#     #     except Exception as e:
#     #         print("Exception:", e)
#     #         return JsonResponse({'error': 'An internal server error occurred'},status=500)


#     def Lab_Request_Detailslink_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,Request_Id):
#         try:
#             print('/////////////////////////////labbbbbb_add-new')
#             print('yvbhjkb', SelectedPatient_list.get('RegisterId'))
#             bill_exists = BillingInvoiceAndBillAmount.objects.filter(Request_Id=Request_Id).first()

#             service_types = []
#             if len(item) > 0:
#                 for i in item:
#                     service_types.append(i.get('ServiceType'))

#                 if 'LAB' in service_types:
#                     created_by = Created_by
#                     registration_id = SelectedPatient_list.get('RegisterId')

#                     register_type = "IP"
#                     SelectedTest = item
#                     location = location.Location_Id

#                     if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
#                         return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})

#                     Location_instance = Location_Detials.objects.get(Location_Id=location)
#                     lab_request = Lab_Request_Details.objects.filter(Request_Id=Request_Id).first()

#                     print('labbbbb createddd', lab_request)

#                     for test in SelectedTest:
#                         print('tettttttt',test)
#                         NextItemIDGet = Lab_Request_Items_Details.objects.annotate(item_id_int=Cast("Item_Id", IntegerField())).aggregate(Max("item_id_int"))["item_id_int__max"]
#                         NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1
#                         Code = test.get("ServiceSubCatId").strip()
#                         if Code.startswith("LTC"):
#                             testType = "Individual"
#                         elif Code.startswith("LGM"):
#                             testType = "Group"
#                         elif Code.startswith("PAC"):
#                             testType = "Offers"
#                         Service_Status = "Pending"
#                         Analysis_Status = "Pending"
#                         Verify_Status = "Pending"
#                         Approve_Status = "Pending"
#                         Pcode=None
#                         if testType == 'Individual' or testType == 'individual':
#                             print("Individual")
#                             Dcode = Test_Descriptions.objects.get(Test_Code = Code)
#                             print("Dept----------",Dcode.department.Department_Code, Dcode.sub_department.SubDepartment_Code)
#                             department = Lab_Department_Detials.objects.get(Department_Code = Dcode.department.Department_Code)
#                             SubDepartment = SubLab_Department_Detials.objects.get(SubDepartment_Code = Dcode.sub_department.SubDepartment_Code)
#                             PackgeCode = None
#                             GroupCode = None
#                             TestCode = Dcode.pk

#                         elif testType == 'Group':
#                             print("Group")
#                             Gcode = Group_Master.objects.get(Group_Code = Code)
#                             print("Dept----------",Gcode.Department.department.Department_Code, Gcode.Department.SubDepartment_Code)
#                             department = Lab_Department_Detials.objects.get(Department_Code = Gcode.Department.department.Department_Code)
#                             SubDepartment = SubLab_Department_Detials.objects.get(SubDepartment_Code = Gcode.Department.SubDepartment_Code)
#                             PackgeCode = None
#                             GroupCode = Gcode.pk
#                             TestCode = None

#                         elif testType == 'Offers':
#                             print("Offers")
#                             Pcode = OfferPackageMaster.objects.filter(package_code=Code).first()
#                             print("Dept----------1",Pcode.department_name)
#                             SubDepartment = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
#                             print("Dept----------2",SubDepartment.department.Department_Code)
#                             department = Lab_Department_Detials.objects.get(Department_Code = SubDepartment.department.Department_Code)
#                             PackgeCode = Pcode.offer_package_id
#                             GroupCode = None
#                             TestCode = None

#                         print("Data--------",NextItemID,lab_request.Request_Id,testType,TestCode,GroupCode,PackgeCode,department.Department_Code,SubDepartment.SubDepartment_Code,Service_Status,Analysis_Status,Verify_Status,Approve_Status)
#                         cursor = db.cursor()

#                         query = """INSERT INTO Lab_Request_Items_Details (Item_Id, Request_id, TestType, Test_Code_id, Group_Code_id, Package_Code_id,
#                           Department_Code_id, SubDepartment_Code_id, Service_Status, Analysis_Status, Verify_Status, Approve_Status, created_at, updated_at) 
#                           VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""
#                         cursor.execute(query,[NextItemID, lab_request.Request_Id, testType, TestCode, GroupCode , PackgeCode, department.Department_Code, SubDepartment.SubDepartment_Code , Service_Status,
#                                                Analysis_Status, Verify_Status, Approve_Status, datetime.now(), datetime.now()])
#                         db.commit()
#                         print("Data commited...")
 
#                     print("Next-----------")
                    
#                     if register_type == 'IP':       
#                         item_details = []
#                         filterdepartment = []
#                         TestDetails = []
#                         keys_seen = set()
#                         filterSpecimen = []
#                         Specimen_keys_seen = set()
#                         Pcode = OfferPackageMaster.objects.filter(package_code=Code).first()

#                         new_codes = [test.get("ServiceSubCatId").strip() for test in SelectedTest if test.get("ServiceSubCatId")]
#                         new_group_codes = [test.get("ServiceSubCatId").strip() for test in SelectedTest if test.get("ServiceSubCatId") and test.get("ServiceSubCatId").startswith("LGM")]
#                         new_package_codes = [
#                             OfferPackageMaster.objects.filter(package_code=test.get("ServiceSubCatId").strip()).first()
#                             for test in SelectedTest
#                             if test.get("ServiceSubCatId") and test.get("ServiceSubCatId").startswith("PAC")
#                         ]
#                         new_items = lab_request.lab_request_items.filter(
#                             Q(Test_Code__in=new_codes) |
#                             Q(Group_Code__in=new_group_codes) |
#                             Q(Package_Code__in=new_package_codes)
#                         )

#                         for index, item in enumerate(new_items, start=1):
#                             print("TestType :",item.TestType,item.Test_Code)
                            
#                             if item.TestType.lower() == "individual":
#                                 if lab_request.Billing_Status == "Completed":
#                                     sub_department_code = (
#                                         item.Test_Code.sub_department.SubDepartment_Code
#                                     )
#                                     sub_department_name = (
#                                         item.Test_Code.sub_department.SubDepartment_Name
#                                     )

#                                     if sub_department_code not in keys_seen:
#                                         filterdepartment.append(
#                                             {
#                                                 "key": sub_department_code,
#                                                 "value": sub_department_name,
#                                             }
#                                         )
#                                         keys_seen.add(sub_department_code)

#                                     Specimen_Name = (
#                                         item.Test_Code.Specimen_Name.Specimen_Name
#                                         if item.Test_Code.Specimen_Name
#                                         else None
#                                     )
#                                     Specimen_Code = (
#                                         item.Test_Code.Specimen_Name.Specimen_Code
#                                         if item.Test_Code.Specimen_Name
#                                         else None
#                                     )

#                                     if Specimen_Code not in Specimen_keys_seen:
#                                         filterSpecimen.append(
#                                             {"key": Specimen_Code, "value": Specimen_Name}
#                                         )
#                                         Specimen_keys_seen.add(Specimen_Code)

#                                 print("type :", item.TestType)
#                                 print("item.Test_Code :", item.Test_Code)
#                                 test_cost = Testmaster_Cost_List.objects.filter(
#                                     Test_Code=item.Test_Code.Test_Code
#                                 ).first()
                            
#                                 print('test_cost :',test_cost)
#                                 print('Billing_Status :',lab_request.Billing_Status)
                                
#                                 if lab_request.Billing_Status == "Completed":
#                                     data = model_to_dict(item.Test_Code)
#                                     modified_data = (
#                                         {}
#                                     )  # Create a new dictionary to store the modified data
#                                     for key, value in data.items():
#                                         if key == "department" and item.Test_Code.department:
#                                             modified_data[key] = (
#                                                 item.Test_Code.department.Department_Name
#                                             )
#                                             modified_data["Department_Code"] = (
#                                                 item.Test_Code.department.Department_Code
#                                             )
#                                         elif (
#                                             key == "sub_department"
#                                             and item.Test_Code.sub_department
#                                         ):
#                                             modified_data[key] = (
#                                                 item.Test_Code.sub_department.SubDepartment_Name
#                                             )
#                                             modified_data["SubDepartment_Code"] = (
#                                                 item.Test_Code.sub_department.SubDepartment_Code
#                                             )
#                                         elif (
#                                             key == "Container_Name"
#                                             and item.Test_Code.Container_Name
#                                         ):
#                                             modified_data[key] = (
#                                                 item.Test_Code.Container_Name.Container_Name
#                                             )
#                                         elif (
#                                             key == "Specimen_Name"
#                                             and item.Test_Code.Specimen_Name is not None
#                                         ):
#                                             modified_data[key] = (
#                                                 item.Test_Code.Specimen_Name.Specimen_Name
#                                             )
#                                         elif key == "Method_Name" and item.Test_Code.Method_Name:
#                                             modified_data[key] = (
#                                                 item.Test_Code.Method_Name.Method_Name
#                                             )
#                                         elif key == "UOM" and item.Test_Code.UOM:
#                                             modified_data[key] = item.Test_Code.UOM.Unit_Name
#                                         elif (
#                                             key == "Captured_Unit_UOM"
#                                             and item.Test_Code.Captured_Unit_UOM
#                                         ):
#                                             modified_data[key] = (
#                                                 item.Test_Code.Captured_Unit_UOM.Unit_Name
#                                             )
#                                         else:
#                                             modified_data[key] = value  # Copy unchanged values
                                        
#                                         RefernceRangeData = Age_Setup_Master.objects.filter(
#                                             Test_Code=item.Test_Code.Test_Code
#                                         ).first()
                                        
#                                         reference_range = RefernceRangeData.Reference_Range
#                                         NormalValue = RefernceRangeData.NormalValue
#                                         Panic_Low = RefernceRangeData.PanicLow
#                                         Panic_High = RefernceRangeData.PanicHigh

#                                         if NormalValue == "Yes":
#                                             panic_low, panic_high = extract_panic_range(
#                                                 reference_range, SelectedPatient_list.Gender
#                                             )
#                                             modified_data["paniclow"] = panic_low
#                                             modified_data["panichigh"] = panic_high
#                                         else:
#                                             modified_data["paniclow"] = Panic_Low
#                                             modified_data["panichigh"] = Panic_High
#                                         modified_data["type"] = "individual"
                                        
#                                         modified_data["Display_Service_Status"] = "Completed"
#                                         modified_data["Display_Analysis_Status"] = "Completed"
#                                         modified_data["Display_Verify_Status"] = "Verified"
#                                         modified_data["Display_Approve_Status"] = "Approved"
                                        
#                                         modified_data["Service_Status"] = "Completed"
#                                         modified_data["Analysis_Status"] = item.Analysis_Status
#                                         modified_data["Verify_Status"] = item.Verify_Status
#                                         modified_data["Approve_Status"] = item.Approve_Status
                                        
                                        
                                        
#                                         modified_data["referencedata"] = reference_range
#                                         modified_data["NormalValue"] = NormalValue 
#                                         modified_data["Result_Value"] = None 
#                                         modified_data["Remarks"] = None
#                                         modified_data["Result_Value"] = item.Result_Value
#                                         modified_data["TestType"] = "Individual"
#                                         modified_data["ColumName"] = "Test_Code"

#                                     # Append the modified dictionary to TestDetails
#                                     TestDetails.append(modified_data)

#                                 item_details.append(
#                                     {
#                                         "type": "individual",
#                                         "S_No": index,
#                                         "Test_Code": (
#                                             item.Test_Code.Test_Code if item.Test_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Test_Code.Test_Name if item.Test_Code else None
#                                         ),
#                                         "Gender": item.Test_Code.Gender if item.Test_Code else None,
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "NetAmount": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": "",
#                                         "Discount": "",
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                     }
#                                 )
#                             elif item.TestType.lower() == "group":
#                                 if lab_request.Billing_Status == "Completed":
#                                     if (
#                                         item.Group_Code.Department.SubDepartment_Code
#                                         not in filterdepartment
#                                     ):
#                                         filterdepartment.append(
#                                             {
#                                                 "key": item.Group_Code.Department.SubDepartment_Code,
#                                                 "value": item.Group_Code.Department.SubDepartment_Name,
#                                             }
#                                         )

#                                 # Get group test cost
#                                 test_cost = Testmaster_Cost_List.objects.filter(
#                                     Group_Code=item.Group_Code
#                                 ).first()

#                                 # Fetch sub-items for the group
#                                 group_items = []
#                                 sub_item_instances = Group_Master_TestList.objects.filter(
#                                     Group_Code=item.Group_Code
#                                 )
#                                 for sub_item in sub_item_instances:
#                                     if sub_item.Test_Code:

#                                         Specimen_Name = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Name
#                                         )
#                                         Specimen_Code = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Code
#                                         )

#                                         if Specimen_Code not in Specimen_keys_seen:
#                                             filterSpecimen.append(
#                                                 {"key": Specimen_Code, "value": Specimen_Name}
#                                             )
#                                             Specimen_keys_seen.add(Specimen_Code)

#                                         sub_item_data = model_to_dict(sub_item.Test_Code)
#                                         # Add any additional details or transformations if needed
#                                         # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#                                         sub_item_data["SubDepartment_Name"] = (
#                                             sub_item.Test_Code.sub_department.SubDepartment_Name
#                                             if sub_item.Test_Code.sub_department
#                                             else None
#                                         )
#                                         sub_item_data["Container_Name"] = (
#                                             sub_item.Test_Code.Container_Name.Container_Name
#                                             if sub_item.Test_Code.Container_Name
#                                             else None
#                                         )
#                                         sub_item_data["Specimen_Name"] = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Name
#                                             if sub_item.Test_Code.Specimen_Name
#                                             else None
#                                         )
#                                         sub_item_data["Method_Name"] = (
#                                             sub_item.Test_Code.Method_Name.Method_Name
#                                             if sub_item.Test_Code.Method_Name
#                                             else None
#                                         )
#                                         sub_item_data["UOM"] = (
#                                             sub_item.Test_Code.UOM.Unit_Name
#                                             if sub_item.Test_Code.UOM
#                                             else None
#                                         )
#                                         sub_item_data["Captured_Unit_UOM"] = (
#                                             sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#                                             if sub_item.Test_Code.Captured_Unit_UOM
#                                             else None
#                                         )

#                                         sub_item_data["Result_Value"] = None

#                                         sub_item_data["columnname"] = "Group_Code"

#                                         group_items.append(sub_item_data)

#                                 # Add group-level item details
#                                 item_details.append(
#                                     {
#                                         "type": "group",
#                                         "S_No": index,
#                                         "Group_Code": (
#                                             item.Group_Code.Group_Code if item.Group_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Group_Code.Group_Name if item.Group_Code else None
#                                         ),
#                                         "Gender": "All",
#                                         "Department": (
#                                             item.Group_Code.Department.SubDepartment_Name
#                                             if item.Group_Code.Department
#                                             else None
#                                         ),
#                                         "group_items": group_items,  # Include detailed sub-items here
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "NetAmount": test_cost.Basic if test_cost else None,
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": "",
#                                         "Discount": "",
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                     }
#                                 )

#                                 TestDetails.append(
#                                     {
#                                         "type": "group",
#                                         "S_No": index,
#                                         "Group_Code": (
#                                             item.Group_Code.Group_Code if item.Group_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Group_Code.Group_Name if item.Group_Code else None
#                                         ),
#                                         "Gender": "All",
#                                         "SubDepartment_Code": (
#                                             item.Group_Code.Department.SubDepartment_Code
#                                             if item.Group_Code.Department
#                                             else None
#                                         ),
#                                         "Department": (
#                                             item.Group_Code.Department.SubDepartment_Name
#                                             if item.Group_Code.Department
#                                             else None
#                                         ),
#                                         "group_items": group_items,  # Include detailed sub-items here
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "NetAmount": test_cost.Basic if test_cost else None,
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": "",
#                                         "Discount": "",
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                         "Service_Status": "Completed",
#                                         "Analysis_Status": item.Analysis_Status,
#                                         "Verify_Status": item.Verify_Status,
#                                         "Approve_Status": item.Approve_Status,
#                                     "TestType" : "Group",
#                                     "ColumName": "Group_Code",
#                                     "Result_Value": None
#                                     }
#                                 )
#                             elif item.TestType.lower() == "offers":
                                
#                                 sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
#                                 if lab_request.Billing_Status == "Completed":
                                    
#                                     if (
#                                         item.Package_code.department_name
#                                         not in filterdepartment
#                                     ):
#                                         filterdepartment.append(
#                                             {
#                                                 "key": sub_dpt.pk,
#                                                 "value": item.Package_Code.department_name,
#                                             }
#                                         )

#                                 # Get group test cost
#                                 test_cost = Testmaster_Cost_List.objects.filter(
#                                     Package_Code=item.Package_Code
#                                 ).first()

#                                 # Fetch sub-items for the group
#                                 group_items = []
#                                 sub_item_instances = OfferPackageList.objects.filter(
#                                     package_code=item.Package_Code.package_code
#                                 )
#                                 print("-------Offer-------",sub_item_instances)
#                                 for sub_item in sub_item_instances:
#                                     print("-------Item-------",sub_item.Test_Code)
                                    
#                                     if sub_item.Test_Code:
#                                         print("------Test------",sub_item.Test_Code.Test_Name)
#                                         Specimen_Name = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                         )
#                                         Specimen_Code = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
#                                         )

#                                         if Specimen_Code not in Specimen_keys_seen:
#                                             filterSpecimen.append(
#                                                 {"key": Specimen_Code, "value": Specimen_Name}
#                                             )
#                                             Specimen_keys_seen.add(Specimen_Code)

#                                         sub_item_data = model_to_dict(sub_item.Test_Code)
#                                         # Add any additional details or transformations if needed
#                                         # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#                                         sub_item_data["SubDepartment_Name"] = (
#                                             sub_item.Test_Code.sub_department.SubDepartment_Name
#                                             if sub_item.Test_Code.sub_department
#                                             else None
#                                         )
#                                         sub_item_data["Container_Name"] = (
#                                             sub_item.Test_Code.Container_Name.Container_Name
#                                             if sub_item.Test_Code.Container_Name
#                                             else None
#                                         )
#                                         sub_item_data["Specimen_Name"] = (
#                                             sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                             if sub_item.Test_Code.Specimen_Name 
#                                             else None
#                                         )
#                                         sub_item_data["Method_Name"] = (
#                                             sub_item.Test_Code.Method_Name.Method_Name
#                                             if sub_item.Test_Code.Method_Name
#                                             else None
#                                         )
#                                         sub_item_data["UOM"] = (
#                                             sub_item.Test_Code.UOM.Unit_Name
#                                             if sub_item.Test_Code.UOM
#                                             else None
#                                         )
#                                         sub_item_data["Captured_Unit_UOM"] = (
#                                             sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#                                             if sub_item.Test_Code.Captured_Unit_UOM
#                                             else None
#                                         )

#                                         sub_item_data["Result_Value"] = None

#                                         sub_item_data["columnname"] = "Group_Code"
#                                         sub_item_data["Group_Code"] = ""
#                                         sub_item_data["Group_Name"] = ""

#                                         print("-------Items-------",sub_item_data['Test_Name'])
#                                         if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
#                                             group_items.append(sub_item_data)
                                    
#                                     elif sub_item.Group_Code:
#                                         print("------group------",sub_item.Group_Code.Group_Code)
#                                         group = sub_item.Group_Code.Group_Code
#                                         groupName = sub_item.Group_Code.Group_Name
#                                         sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
#                                         print("-------Item-------",sub_item_instances)
#                                         for sub_item in sub_item_instances:
#                                             print("------Test------",sub_item.Test_Code.Test_Name)
#                                             Specimen_Name = (
#                                                 sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                             )
#                                             Specimen_Code = (
#                                                 sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
#                                             )

#                                             if Specimen_Code not in Specimen_keys_seen:
#                                                 filterSpecimen.append(
#                                                     {"key": Specimen_Code, "value": Specimen_Name}
#                                                 )
#                                                 Specimen_keys_seen.add(Specimen_Code)

#                                             sub_item_data = model_to_dict(sub_item.Test_Code)
#                                             # Add any additional details or transformations if needed
#                                             # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
#                                             sub_item_data["SubDepartment_Name"] = (
#                                                 sub_item.Test_Code.sub_department.SubDepartment_Name
#                                                 if sub_item.Test_Code.sub_department
#                                                 else None
#                                             )
#                                             sub_item_data["Container_Name"] = (
#                                                 sub_item.Test_Code.Container_Name.Container_Name
#                                                 if sub_item.Test_Code.Container_Name
#                                                 else None
#                                             )
#                                             sub_item_data["Specimen_Name"] = (
#                                                 sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
#                                                 if sub_item.Test_Code.Specimen_Name 
#                                                 else None
#                                             )
#                                             sub_item_data["Method_Name"] = (
#                                                 sub_item.Test_Code.Method_Name.Method_Name
#                                                 if sub_item.Test_Code.Method_Name
#                                                 else None
#                                             )
#                                             sub_item_data["UOM"] = (
#                                                 sub_item.Test_Code.UOM.Unit_Name
#                                                 if sub_item.Test_Code.UOM
#                                                 else None
#                                             )
#                                             sub_item_data["Captured_Unit_UOM"] = (
#                                                 sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
#                                                 if sub_item.Test_Code.Captured_Unit_UOM
#                                                 else None
#                                             )

#                                             sub_item_data["Result_Value"] = None

#                                             sub_item_data["columnname"] = "Group_Code"
#                                             sub_item_data["Group_Code"] = group
#                                             sub_item_data["Group_Name"] = groupName

#                                             print("-------Items-------",sub_item_data['Test_Name'])
#                                             if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
#                                                 group_items.append(sub_item_data)
                                    
#                                 # Add group-level item details
#                                 item_details.append(
#                                     {
#                                         "type": "Offers",
#                                         "S_No": index,
#                                         "Request_Id": lab_request.Request_Id,
#                                         "Group_Code": (
#                                             item.Package_Code.package_code if item.Package_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Package_Code.package_name if item.Package_Code else None
#                                         ),
#                                         "Gender": "All",
#                                         "Department": (
#                                             item.Package_Code.department_name
#                                             if item.Package_Code.department_name
#                                             else None
#                                         ),
#                                         "group_items": group_items,  # Include detailed sub-items here
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "NetAmount": test_cost.Basic if test_cost else None,
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": "",
#                                         "Discount": "",
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                     }
#                                 )
#                                 print("---------OK--------")
#                                 TestDetails.append(
#                                     {
#                                         "type": "Offers",
#                                         "S_No": index,
#                                         "Group_Code": (
#                                             item.Package_Code.package_code if item.Package_Code else None
#                                         ),
#                                         "SelectItemName": (
#                                             item.Package_Code.package_name if item.Package_Code else None
#                                         ),
#                                         "Gender": "All",
#                                         "SubDepartment_Code": (
#                                             sub_dpt.SubDepartment_Code
#                                             if item.Package_Code.department_name
#                                             else None
#                                         ),
#                                         "Department": (
#                                             item.Package_Code.department_name
#                                             if item.Package_Code.department_name
#                                             else None
#                                         ),
#                                         "group_items": group_items,  # Include detailed sub-items here
#                                         "ServiceType": "Lab",
#                                         "Charges": test_cost.Basic if test_cost else None,
#                                         "Amount": test_cost.Basic if test_cost else None,
#                                         "NetAmount": test_cost.Basic if test_cost else None,
#                                         "Total": test_cost.Basic if test_cost else None,
#                                         "Quantity":1,
#                                         "DiscountType": "",
#                                         "Discount": "",
#                                         "GST_per": "",
#                                         "GST": "",
#                                         "DiscountAmount": "",
#                                         "isReimbursable": "No",
#                                         "Service_Status": "Completed",
#                                         "Analysis_Status": item.Analysis_Status,
#                                         "Verify_Status": item.Verify_Status,
#                                         "Approve_Status": item.Approve_Status,
#                                     "TestType" : "Offers",
#                                     "ColumName": "Package_Code",
#                                     "Result_Value": None
#                                     }
#                                 )
                        
                        
                        

#                         # if not bill_exists:
#                         #     count = len(item_details)
#                         #     BarcodeId = bill_exists.Barcode_Id
#                         #     invoiceTable = BillingInvoiceAndBillAmount.objects.create(
#                         #         Billing_Invoice = general_billing.Billing_Invoice_No,
#                         #         Patient_Id = ip_register_instance.PatientId.PatientId,
#                         #         # Visit_Id = visit.VisitId,
#                         #         Patient_Name = ip_register_instance.PatientId.FirstName,
#                         #         Item_Count = count,
#                         #         Total_Charge = general_billing.Net_Amount,
#                         #         Status = new_bill_status,
#                         #         Location = Location_instance.Location_Name,
#                         #         Capture_Sample_Status = "Pending",
#                         #         Analyze_Status = "Pending",
#                         #         Verify_Status = "Pending",
#                         #         Approve_Status = "Pending",
#                         #         Barcode_Id = BarcodeId,
#                         #         Group_Name = "",
#                         #         CreatedBy = created_by,
#                         #         Billing_Date = datetime.date(datetime.now()),
#                         #         Billing_Type = "",
#                         #         RateCard_Name = '',
#                         #         Test_Code = "",
#                         #         Group_Code = "",
#                         #         TotalPaidAmount = general_billing.Paid_Amount,
#                         #         BalanceAmount = general_billing.Balance_Amount,
#                         #         Sample_Barcode_Image = None,
#                         #         AdditionalAmount = '0.00',
#                         #         AdditionalAmountReason = "",
#                         #         DiscountReason = "",
#                         #         HistoNumber = '',
#                         #         MicroNumber = '',
#                         #         Transfer_Location= "",
#                         #         Registration_Id = registration_id

#                         #     )
#                         #     invoiceTable.save()
#                         #     print("--------Invoice Table OK--------")
#                         print("Previous========",bill_exists.Billing_Invoice)

#                         for item in item_details:
#                             print("---------Test---------", item)
#                             if item["type"] == "Offers":
#                                 if item.get("group_items"):
#                                     for subtest in item.get("group_items", []):
#                                         if subtest["Group_Code"] and subtest["Group_Name"]:
#                                             group=subtest["Group_Code"]
#                                             groupName=subtest["Group_Name"]
#                                         else:
#                                             group=""
#                                             groupName=""

#                                         invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#                                         Billing_Invoice = bill_exists.Billing_Invoice,
#                                         Patient_Id = bill_exists.Patient_Id,
#                                         Visit_Id = bill_exists.Visit_Id,
#                                         Patient_Name = bill_exists.Patient_Name,
#                                         Dispatch_Method = "",
#                                         Test_Method = item["type"],
#                                         Test_Name = subtest["Test_Name"],
#                                         Gross_Amount = item["Charges"],
#                                         Location = Location_instance.Location_Name,
#                                         Service_Status = "Pending",
#                                         Analysis_Status = "Pending",
#                                         Verify_Status = "Pending",
#                                         Approve_Status = "Pending",
#                                         Barcode_Id = bill_exists.Barcode_Id,
#                                         Group_Name = groupName,
#                                         CreatedBy = created_by,
#                                         Billing_Date = datetime.date(datetime.now()),
#                                         Test_Code = subtest["Test_Code"],
#                                         Group_Code = group,
#                                         individual_add_amount = None,
#                                         IsSubTest = subtest.get("IsSubTest", ""),
#                                         SubTestCodes = subtest.get("SubTestCodes", ""),
#                                         Transfer_Location = "",
#                                         PackageCode = item.get("Group_Code", ""),
#                                         PackageName = item.get("SelectItemName", ""),
#                                         Bill_Status = new_bill_status
#                                         )
#                                         invoiceItemTable.save()
#                                 else:
#                                     print("--------Offer-Test---------", item)
#                                     invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#                                     Billing_Invoice = bill_exists.Billing_Invoice,
#                                     Patient_Id = bill_exists.Patient_Id,
#                                     Visit_Id = bill_exists.Visit_Id,
#                                     Patient_Name = bill_exists.Patient_Name,
#                                     Dispatch_Method = "",
#                                     Test_Method = item["type"],
#                                     Test_Name = item["SelectItemName"],
#                                     Gross_Amount = item["Charges"],
#                                     Location = Location_instance.Location_Name,
#                                     Service_Status = "Pending",
#                                     Analysis_Status = "Pending",
#                                     Verify_Status = "Pending",
#                                     Approve_Status = "Pending",
#                                     Barcode_Id = bill_exists.Barcode_Id,
#                                     Group_Name = "",
#                                     CreatedBy = created_by,
#                                     Billing_Date = datetime.date(datetime.now()),
#                                     Test_Code = item["Test_Code"],
#                                     Group_Code = "",
#                                     individual_add_amount = None,
#                                     IsSubTest = "",
#                                     SubTestCodes = "",
#                                     Transfer_Location = "",
#                                     PackageCode = "",
#                                     PackageName = "",
#                                     Bill_Status = new_bill_status
#                                     )
#                                     invoiceItemTable.save()                    
#                             elif item["type"] == "group":
#                                 for subtest in item.get("group_items", []):
#                                     invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#                                         Billing_Invoice = bill_exists.Billing_Invoice,
#                                         Patient_Id = bill_exists.Patient_Id,
#                                         Visit_Id = bill_exists.Visit_Id,
#                                         Patient_Name = bill_exists.Patient_Name,
#                                         Dispatch_Method = "",
#                                         Test_Method = item["type"],
#                                         Test_Name = subtest["Test_Name"],
#                                         Gross_Amount = item["Charges"],
#                                         Location = Location_instance.Location_Name,
#                                         Service_Status = "Pending",
#                                         Analysis_Status = "Pending",
#                                         Verify_Status = "Pending",
#                                         Approve_Status = "Pending",
#                                         Barcode_Id = bill_exists.Barcode_Id,
#                                         Group_Name = item.get("SelectItemName", ""),
#                                         CreatedBy = created_by,
#                                         Billing_Date = datetime.date(datetime.now()),
#                                         Test_Code = subtest["Test_Code"],
#                                         Group_Code = item.get("Group_Code", ""),
#                                         individual_add_amount = None,
#                                         IsSubTest = subtest.get("IsSubTest", ""),
#                                         SubTestCodes = subtest.get("SubTestCodes", ""),
#                                         Transfer_Location = "",
#                                         PackageCode = "",
#                                         PackageName = "",
#                                         Bill_Status = new_bill_status
#                                     )
#                                     invoiceItemTable.save()
#                             else:
#                                 invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
#                                     Billing_Invoice = bill_exists.Billing_Invoice,
#                                     Patient_Id = bill_exists.Patient_Id,
#                                     Visit_Id = bill_exists.Visit_Id,
#                                     Patient_Name = bill_exists.Patient_Name,
#                                     Dispatch_Method = "",
#                                     Test_Method = item["type"],
#                                     Test_Name = item["SelectItemName"],
#                                     Gross_Amount = item["Charges"],
#                                     Location = Location_instance.Location_Name,
#                                     Service_Status = "Pending",
#                                     Analysis_Status = "Pending",
#                                     Verify_Status = "Pending",
#                                     Approve_Status = "Pending",
#                                     Barcode_Id = bill_exists.Barcode_Id,
#                                     Group_Name = "",
#                                     CreatedBy = created_by,
#                                     Billing_Date = datetime.date(datetime.now()),
#                                     Test_Code = item["Test_Code"],
#                                     Group_Code = "",
#                                     individual_add_amount = None,
#                                     IsSubTest = "",
#                                     SubTestCodes = "",
#                                     Transfer_Location = "",
#                                     PackageCode = "",
#                                     PackageName = "",
#                                     Bill_Status = new_bill_status
#                                 )
#                                 invoiceItemTable.save()
                        
#                         print("--------Invoice Item Table OK--------")
            
#                     return ('success Data saved successfully')
            
#         except Exception as e:
#             print("Exception:", e)
#             return JsonResponse({'error': 'An internal server error occurred'},status=500)


#     # def Lab_Request_Detailslink_Status_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,BillingType,Request_Id,paytype):
#     #     try:
#     #         print('labbbbbb Quickkkkkk')

#     #         service_types = []
#     #         for i in item:
#     #             service_types.append(i.get('ServiceType'))
#     #         if 'Lab' in service_types or 'Radiology' in service_types or BillingType == 'RADIOLOGY':
#     #             for i in item:
#     #                 if i.get('ServiceType') == 'RADIOLOGY' or i.get('ServiceType') == 'Radiology':

#     #                     if paytype == 'Cash':
#     #                         radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
#     #                         radins.Status = new_bill_status
#     #                         radins.IP_Billing_Invoice_No = general_billing
#     #                         radins.save()

#     #                     else:

#     #                         radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
#     #                         radins.Status = new_bill_status
#     #                         radins.Interim_Billing_Invoice_No = general_billing
#     #                         radins.save()

#     #                 if i.get('ServiceType') == 'Lab':
#     #                     print('ufkjoiuyg')
#     #                     print('yvbhjvev',Request_Id)
#     #                     labins = BillingInvoiceAndBillAmount.objects.filter(Request_Id=Request_Id).first()
#     #                     print('iubnveijbn',labins)
#     #                     labins.Status = new_bill_status
#     #                     # labins.Billing_Invoice = general_billing.Billing_Invoice_No
#     #                     labins.save()

#     #                     labitem_ins =Billing_Item_Table_for_lab.objects.filter(Barcode_Id=labins.Barcode_Id)
#     #                     for item in labitem_ins:
#     #                         # item.Billing_Invoice = general_billing.Billing_Invoice_No
#     #                         item.Bill_Status = new_bill_status
#     #                         item.save()

#     #                     lab_req_ins = Lab_Request_Details.objects.filter(pk = Request_Id).first()
#     #                     lab_req_ins.Billing_Status = new_bill_status
#     #                     lab_req_ins.save()
                
#     #     except Exception as e:
#     #         print("Exception:", e)
#     #         return JsonResponse({'error': 'An internal server error occurred'},status=500)



#     def Lab_Request_Detailslink_Status_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,BillingType,Request_Id,paytype):
#         try:
#             # print('labbbbbb Quickkkkkk',item)

#             service_types = []
#             for i in item:
#                 service_types.append(i.get('ServiceType'))
#             if 'Lab' in service_types or 'Radiology' in service_types or BillingType == 'RADIOLOGY':
#                 for i in item:
#                     if i.get('ServiceType') == 'RADIOLOGY' or i.get('ServiceType') == 'Radiology':

#                         if paytype == 'Cash':
#                             radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
#                             radins.Status = new_bill_status
#                             radins.IP_Billing_Invoice_No = general_billing
#                             radins.save()

#                         else:

#                             radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
#                             radins.Status = new_bill_status
#                             radins.Interim_Billing_Invoice_No = general_billing
#                             radins.save()

#                     if i.get('ServiceType') == 'Lab':
#                         print('ufkjoiuyg')
#                         # print('yvbhjvev',Request_Id)
#                         lab_req_ins = Lab_Request_Details.objects.filter(pk = Request_Id).first()
#                         lab_req_ins.Billing_Status = new_bill_status
#                         lab_req_ins.save()

#                         labins = BillingInvoiceAndBillAmount.objects.filter(Request_Id=Request_Id).first()
#                         # print('iubnveijbn',labins)
#                         labins.Status = new_bill_status
#                         # labins.Billing_Invoice = general_billing.Billing_Invoice_No
#                         labins.save()
                        
#                         labitem_ins =Billing_Item_Table_for_lab.objects.filter(Barcode_Id=labins.Barcode_Id)

                        
#                         for lab_item in labitem_ins:
#                             if lab_item.Bill_Status == "Canceled":
#                                 status = "Canceled"
#                             else:
#                                 status = new_bill_status   

#                             print("Status---------",i.get("type"),lab_item.Test_Method)
#                             if i.get("type") == lab_item.Test_Method:
#                                 if i.get('status') == 'Canceled':
#                                     if (i.get("Group_Code") and lab_item.PackageCode == i.get("Group_Code")) \
#                                     or (i.get("Group_Code") and lab_item.Group_Code == i.get("Group_Code")) \
#                                     or (i.get("Test_Code") and lab_item.Test_Code == i.get("Test_Code")):
#                                         status = "Canceled"                            

#                             print("STatus----------", status)
#                             lab_item.Bill_Status = status
#                             lab_item.save()

                
#         except Exception as e:
#             print("Exception:", e)
#             return JsonResponse({'error': 'An internal server error occurred'},status=500)



#     def post(self, request):
#         try:
#             data = json.loads(request.body)
            
#             # Get related objects
#             related_objects = self.get_related_objects(data)
#             if isinstance(related_objects, JsonResponse):
#                 return related_objects

#             # Extract data
#             initial_state = data.get('initialState', {})
#             SelectedPatient_list = data.get('SelectedPatient_list', {})
#             bill_amounts = data.get('billAmount', [])
#             select_data = data.get('SelectDatalist', [])
#             billing_data = data.get('BillingData', {})
#             created_by = data.get('Created_by', '')
#             new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
#             Location = data.get('Location', '')
#             BillingType = data.get('BillingType', '')
#             Request_Id = data.get('Request_Id','')

#             new_select_data = data.get('NewItems', [])


#             paytype = data.get('Paytype') 
#             location = Location_Detials.objects.get(Location_Id=Location)
#             receipt_no = None
#             if data.get('Paytype') == 'Cash':
#                 # Create IP Billing record
#                 ip_billing = IP_Billing_Table_Detials.objects.create(
#                     Billing_Date=billing_data.get('InvoiceDate'),
#                     Doctor_Id=self.doctor,
#                     Patient_Id=self.patient,
#                     Register_Id=self.register,
#                     Billing_Type='DailyBill',
#                     Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
#                     Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
#                     Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
#                     Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
#                     Total_Items=int(initial_state.get('totalItems')),
#                     Total_Qty=int(initial_state.get('totalUnits', 1)),
#                     Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
#                     Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
#                     Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
#                     Net_Paid_Amount=initial_state.get('totalAmountt'),
#                     Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
#                     Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
#                     Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                     Bill_Status=new_bill_status,
#                     created_by=created_by
#                 )

#                 # Save billing items
#                 self.save_billing_items(select_data, ip_billing, new_bill_status)
                
#                 # Create receipt and payment records
#                 receipt = self.create_billing_receipt(
#                     ip_billing,
#                     billing_data,
#                     self.safe_to_decimal(initial_state.get('totalNetAmount')),
#                     self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                     self.safe_to_decimal(initial_state.get('PaidAmount')),
#                     created_by
#                 )
                
#                 # Save payment details
#                 for payment in bill_amounts:
#                     self.save_payment_details(payment, receipt)
#                 receipt_no = receipt.Voucher_Number
#                 self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
#             else:
#                 print('ygubvieb')
#                 ip_billing = Interim_Billing_Table_Detials.objects.create(
#                     Billing_Date=billing_data.get('InvoiceDate'),
#                     Doctor_Id=self.doctor,
#                     Patient_Id=self.patient,
#                     Register_Id=self.register,
#                     Billing_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
#                     Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
#                     Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
#                     Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
#                     Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
#                     Total_Items=int(initial_state.get('totalItems')),
#                     Total_Qty=int(initial_state.get('totalUnits', 1)),
#                     Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
#                     Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
#                     Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
#                     Net_Paid_Amount=initial_state.get('totalAmountt'),
#                     Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
#                     Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
#                     Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                     Bill_Status=new_bill_status,
#                     created_by=created_by
#                 )

#                 print(ip_billing,'ip_billing')
#                 # Save billing items
#                 self.save_interim_billing_items(select_data, ip_billing, new_bill_status)
#                 self.Radiology_Requestlink_InterimBilling(select_data,ip_billing,new_bill_status,created_by)
#             # self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType,Request_Id,paytype)
#             # self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
#             self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType,Request_Id,paytype)
#             self.Lab_Request_Detailslink_Billing(new_select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,Request_Id)

#             print('ubufbbr')
#             formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
#             print('jhbsv')
#             return JsonResponse({
#                 'status': 'success',
#                 'message': 'Billing details saved successfully',
#                 'InvoiceNo': ip_billing.Billing_Invoice_No,
#                 'InvoiceDate': formatted_date,
#                 'ReceiptNo': receipt_no
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def get(self, request):
#         try:
#             search_params = {
#                 'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
#                 'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
#                 'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
#                 'DateType': request.GET.get('DateType'),
#                 'CurrentDate': request.GET.get('CurrentDate'),
#                 'FromDate': request.GET.get('FromDate'),
#                 'ToDate': request.GET.get('ToDate'),
#                 'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
#                 'SearchStatus': request.GET.get('SearchStatus')
#             }

#             query = self.build_search_query(search_params)
#             billing_data = IP_Billing_Table_Detials.objects.filter(query)
            
#             if search_params['SearchTimeOrderby']:
#                 billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

#             response_data = self.format_billing_data(billing_data)
#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def build_search_query(self, params):
#         query = Q()
#         if params['SearchbyFirstName']:
#             query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName'])
#         if params['SearchbySpeciality']:
#             query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
#         if params['SearchbyDoctor']:
#             query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
#         if params['SearchStatus']:
#             query &= Q(Bill_Status=params['SearchStatus'])

#         # Date filtering
#         if params['DateType'] == "Current" and params['CurrentDate']:
#             query &= Q(created_at__date=params['CurrentDate'])
#         elif params['DateType'] == "Customize":
#             if params['FromDate'] and params['ToDate']:
#                 query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
#             elif params['FromDate']:
#                 query &= Q(created_at__date__gte=params['FromDate'])
#             elif params['ToDate']:
#                 query &= Q(created_at__date__lte=params['ToDate'])

#         return query

#     def apply_ordering(self, queryset, order_param):
#         if order_param.lower() == 'order':
#             return queryset.order_by('created_at')
#         elif order_param.lower() == 'disorder':
#             return queryset.order_by('-created_at')
#         return queryset

#     def format_billing_data(self, billing_queryset):
#         response_data = []
#         for row in billing_queryset:
#             billing_details = self.get_billing_details(row)
#             response_data.append(billing_details)
#         return response_data

@method_decorator(csrf_exempt, name='dispatch')
class IPQuickBillingLinkView(View):
    def __init__(self):
        self.doctor = None
        self.patient = None
        self.register = None

    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)

    def get_related_objects(self, data):
        """Get required foreign key objects"""
        try:
            self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
            self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
            self.register = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
            )
            return True
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Registration not found'})

    def create_billing_receipt(self, ip_billing,billing_data, total_amount, balance_amount, paid_amount, created_by):
        """Create billing receipt record"""
        return IPBillingReceipt.objects.create(
            Invoice_NO=ip_billing,
            PatientID=self.patient.PatientId,
            PhoneNumber=self.patient.PhoneNo,
            Patient_Name=f"{self.patient.FirstName} {self.patient.MiddleName or ''} {self.patient.SurName}".strip(),
            TotalAmount=total_amount,
            TotalPaidAmount=total_amount,
            BalanceAmount=balance_amount,
            Billing_Date=billing_data.get('InvoiceDate'),
            PaidAmount=paid_amount,
            Billedby=created_by
        )

    def save_payment_details(self, payment_data, receipt):
        """Save payment details"""
        return Multiple_Payment_Table_IP_Detials.objects.create(
            Invoice_No=receipt,
            Payment_Type=payment_data.get('Billpay_method'),
            Cart_Type=payment_data.get('CardType'),
            Card_No=payment_data.get('CardNo'),
            TransactionId=payment_data.get('TransactionId'),
            upiid=payment_data.get('upiid'),
            Cheque_No=payment_data.get('ChequeNo'),
            Bank_Name=payment_data.get('BankName'),
            Amount=self.safe_to_decimal(payment_data.get('paidamount')),
            Transaction_Amount=self.safe_to_decimal(payment_data.get('transactionFee')),
            AdditionalAmount=self.safe_to_decimal(payment_data.get('Additionalamount'))
        )

    def save_billing_items(self, items, billing,new_bill_status):
        """Save billing items"""
       
        for item in items:

            try:

                Status = item.get('status')

            except :
                Status = ""



            if Status == 'Canceled':

                pass

            else:
                IP_Billing_Items_Table_Detials.objects.create(
                    Billing_Invoice_No=billing,
                    Service_Type=item.get('ServiceType').upper(),
                    Service_Code= item.get('TestCode') or item.get('Test_Code') or item.get('Group_Code') or item.get('ServiceSubCatId'),
                    Service_Name=item.get('SelectItemName'),
                    Rate=self.safe_to_decimal(item.get('Rate')),
                    Charge=self.safe_to_decimal(item.get('Charges')),
                    Quantity=item.get('Quantity', 1),
                    Amount=self.safe_to_decimal(item.get('Amount')),
                    Discount_Type=item.get('Discountmethod'),
                    Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
                    Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
                    Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                    Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                    Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
                    Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                    Item_Status=new_bill_status,
                    IsReimbursable=item.get('isReimbursable'),
                    Billing_Type = 'DailyBill'

                )



    def save_interim_billing_items(self, items, billing,new_bill_status):
        """Save billing items"""
        print('interimmmmitems')
        for item in items:

            Scode = item.get('TestCode') or item.get('Test_Code')  or item.get('Group_Code') or item.get('ServiceSubCatId')

            print(Scode,'ScodeScodeScode')


            Interim_Billing_Items_Table_Detials.objects.create(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType').upper(),
                Service_Code= item.get('TestCode') or item.get('Test_Code')  or item.get('Group_Code') or item.get('ServiceSubCatId'),
                Service_Name=item.get('SelectItemName'),
                Rate=self.safe_to_decimal(item.get('Rate')),
                Charge=self.safe_to_decimal(item.get('Charges')),
                Quantity=item.get('Quantity', 1),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Type=item.get('Discountmethod'),
                Discount_Value=self.safe_to_decimal(item.get('Discountval', 0.00)),
                Discount_Amount = self.safe_to_decimal(item.get('Discountamt', 0.00)),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                Item_Status=new_bill_status,
                IsReimbursable=item.get('isReimbursable'),
                CGHS_CODE = item.get('CGHScode')
            )
    def Radiology_Requestlink_Billing(self,select_data,ip_billing,new_bill_status,created_by):
        print('ucjcjvjhcj')
        for item in select_data:
            if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
                Test_Code = (item.get('ServiceSubCatId') or item.get('TestCode')).strip()
                RegisterType = "IP"
                try:
                    testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                    Radiology_Request_Details.objects.create(
                        RegisterType = RegisterType,
                        OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=self.register if RegisterType == "IP" else None,
                        Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=item.get('ServiceSubCatId').strip(),
                        created_by=created_by,
                        Status = new_bill_status,
                        IP_Billing_Invoice_No = ip_billing 
                    )
                except TestName_Details.DoesNotExist:
                    print(f"TestName_Details not found for Test_Code: {Test_Code}")

    def Radiology_Requestlink_InterimBilling(self,select_data,ip_billing,new_bill_status,created_by):
        print('ucjcjvjhcj')
        for item in select_data:
            if item.get('ServiceType') == "RADIOLOGY" and item.get('request_id') !='':
        
                Test_Code = (item.get('ServiceSubCatId') or item.get('TestCode')).strip()
                RegisterType = "IP"
                try:
                    testnames = TestName_Details.objects.get(Test_Code=Test_Code)
                    Radiologyid = testnames.Radiology_Id.Radiology_Id
                    Radiology_Request_Details.objects.create(
                        RegisterType = RegisterType,
                        OP_Register_Id=self.register if RegisterType == "OP" or  RegisterType == 'WALK-IN' else None,
                        IP_Register_Id=self.register if RegisterType == "IP" else None,
                        Casuality_Register_Id=self.register if RegisterType == "Casuality" else None,
                        Diagnosis_Register_Id=self.register if RegisterType == "ExternalRadiology" else None,
                        TestCode=Radiologyid,
                        SubTestCode=item.get('ServiceSubCatId').strip(),
                        created_by=created_by,
                        Status = new_bill_status,
                        Interim_Billing_Invoice_No = ip_billing 
                    )
                except TestName_Details.DoesNotExist:
                    print(f"TestName_Details not found for Test_Code: {Test_Code}")


    # def Lab_Request_Detailslink_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location):
    #     try:
    #         print('/////////////////////////////labbbbbb')
    #         # print('dberger',item)
    #         print('yvbhjkb',SelectedPatient_list.get('RegisterId'))
    #         print('yvbhjkb',item)
    #         service_types = []
    #         for i in item:
    #             print('uyfuygkj')
    #             service_types.append(i.get('ServiceType'))
    #         if 'LAB' in service_types:
    #             print('vyujhbf')
    #             created_by = Created_by
    #             registration_id = SelectedPatient_list.get('RegisterId')

    #             register_type = "IP"
    #             # register_type = data.get('RegisterType', 'OP')
    #             SelectedTest = item
    #             location = location.Location_Id
    #             # Remarks = data.get("Remarks",'')

    #             # print('dberger',item)
    #             print('yvbhjkb',registration_id)
    #             print('uvbkjnk',SelectedTest)
    #             # print('dberger',item)
    #             # register_type = item.get('type')


    #             if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
    #                 return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})

    #             # Prepare the arguments based on the register type
    #             register_kwargs = {'RegisterType': register_type}
    #             if register_type == 'OP':
    #                 try:
    #                     print('xxxxxxxxxxxxxxxxxxx')
    #                     op_register_instance = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
    #                     register_kwargs['OP_Register_Id'] = op_register_instance
    #                 except Patient_Appointment_Registration_Detials.DoesNotExist:
    #                     return JsonResponse({'warn': 'OP Registration ID not found'})

    #             elif register_type == 'IP':
    #                 try:
    #                     ip_register_instance = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
    #                     register_kwargs['IP_Register_Id'] = ip_register_instance
    #                 except Patient_IP_Registration_Detials.DoesNotExist:
    #                     return JsonResponse({'warn': 'IP Registration ID not found'})

    #             elif register_type == 'Casuality':
    #                 try:
    #                     casuality_register_instance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=registration_id)
    #                     register_kwargs['Casuality_Register_Id'] = casuality_register_instance
    #                 except Patient_Casuality_Registration_Detials.DoesNotExist:
    #                     return JsonResponse({'warn': 'Casuality Registration ID not found'})

    #             # Insert into Lab_Request_Details
    #             Location_instance = Location_Detials.objects.get(Location_Id=location)
    #             lab_request = Lab_Request_Details.objects.create(
    #                 created_by=created_by,
    #                 Location=Location_instance,
    #                 Billing_Status = new_bill_status,
    #                 Status = new_bill_status,
    #                 # Billing_Invoice_No = general_billing,
    #                 # Remarks=Remarks,
    #                 **register_kwargs,
    #             )
    #             print('labbbbb createddd')





    #             # Loop through SelectedTest and insert into Lab_Request_Items_Details
    #             for test in SelectedTest:
    #                 print('tettttttt',test)
    #                 if test.get("ServiceType") == 'LAB':
    #                     print(test,'test')
    #                     SubDepartment_Code = test.get("sub_department_id")
    #                     testType = test.get("type")
    #                     Department_Code = test.get("department_id")
    #                     Code = test.get("ServiceSubCatId").strip()
    #                     print(testType,'testtypeeee')
    #                     print(Code,'COdeeeee')
    #                     NextItemIDGet = Lab_Request_Items_Details.objects.annotate(
    #                         item_id_int=Cast("Item_Id", IntegerField())
    #                     ).aggregate(Max("item_id_int"))["item_id_int__max"]
    #                     NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1

    #                     print(NextItemID,'NextItemID')
    #                     Dcode = None
    #                     lab_request_item_data = {}
    #                     if testType == 'Individual' or testType == 'individual':
    #                         print(testType,'testType')
    #                         print(Code,'COdeeeee')
    #                         print(len(Code))
    #                         Dcode = Test_Descriptions.objects.get(Test_Code = Code)
    #                         print('testttttt',Dcode)
    #                         lab_request_item_data = {
    #                             "Item_Id":NextItemID,
    #                             "Request": lab_request,
    #                             "TestType": testType,
    #                             "SubDepartment_Code_id": Dcode.sub_department.SubDepartment_Code,
    #                             "Department_Code_id": Dcode.department.Department_Code,
    #                             }
    #                     elif testType == 'Group':
    #                         print(testType,'testType')
    #                         Gcode = Group_Master.objects.get(Group_Code = Code)

    #                         lab_request_item_data = {
    #                             "Item_Id":NextItemID,
    #                             "Request": lab_request,
    #                             "TestType": testType,
    #                             "Department_Code_id": Gcode.Department.department.Department_Code,
    #                             "SubDepartment_Code_id": Gcode.Department.SubDepartment_Code,
    #                             }
    #                     elif testType == 'Offers':
    #                         print(testType, 'testType')
    #                         Pcode = OfferPackageMaster.objects.get(package_code=Code)
    #                         department = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
    #                         lab_department = Lab_Department_Detials.objects.get(Department_Code=department.department_id)
    #                         print("---------", Pcode.department_name)
    #                         print("---------", Pcode.pk)
    #                         print("----IDDDDDDD-----", Pcode.offer_package_id)
    #                         lab_request_item_data = {
    #                             "Item_Id": NextItemID,
    #                             "Request": lab_request,
    #                             "TestType": testType,
    #                             "Department_Code_id": lab_department.pk,
    #                             "SubDepartment_Code_id": department.pk,
    #                         }
    #                     print(NextItemID,'NextItemID')



    #                     print(lab_request_item_data,'lab_request_item_data')
    #                     # Insert into appropriate columns based on testType
    #                     if testType == "Individual" or testType == "individual":
    #                         print('summaaa1111')
    #                         lab_request_item_data["Test_Code_id"] = Code  # Assuming Code is the Test_Code
    #                     elif testType == "Profiles" or testType == "Group":
    #                         lab_request_item_data["Group_Code_id"] = Code  # Assuming Code is the Group_Code
    #                     elif testType == "Profiles" or testType == "Offers":
    #                         lab_request_item_data["Package_Code_id"] = Pcode.pk  # Assuming Code is the Group_Code
    #                     # Save the item
    #                     Lab_Request_Items_Details.objects.create(**lab_request_item_data)

    #             if register_type == 'IP':       
    #                 item_details = []
    #                 filterdepartment = []
    #                 TestDetails = []
    #                 keys_seen = set()
    #                 filterSpecimen = []
    #                 Specimen_keys_seen = set()
    #                 print('intooo the forr loop')
    #                 for index, item in enumerate(lab_request.lab_request_items.filter(Request = lab_request.Request_Id), start=1):
    #                     print("TestType :",item.TestType)
    #                     print(model_to_dict(item))                        
                        
    #                     if item.TestType.lower() == "individual":
    #                         if lab_request.Billing_Status == "Completed":
    #                             sub_department_code = (
    #                                 item.Test_Code.sub_department.SubDepartment_Code
    #                             )
    #                             sub_department_name = (
    #                                 item.Test_Code.sub_department.SubDepartment_Name
    #                             )

    #                             if sub_department_code not in keys_seen:
    #                                 filterdepartment.append(
    #                                     {
    #                                         "key": sub_department_code,
    #                                         "value": sub_department_name,
    #                                     }
    #                                 )
    #                                 keys_seen.add(sub_department_code)

    #                             Specimen_Name = (
    #                                 item.Test_Code.Specimen_Name.Specimen_Name
    #                                 if item.Test_Code.Specimen_Name
    #                                 else None
    #                             )
    #                             Specimen_Code = (
    #                                 item.Test_Code.Specimen_Name.Specimen_Code
    #                                 if item.Test_Code.Specimen_Name
    #                                 else None
    #                             )

    #                             if Specimen_Code not in Specimen_keys_seen:
    #                                 filterSpecimen.append(
    #                                     {"key": Specimen_Code, "value": Specimen_Name}
    #                                 )
    #                                 Specimen_keys_seen.add(Specimen_Code)

    #                         print("type :", item.TestType)
    #                         print("item.Test_Code :", item.Test_Code)
    #                         test_cost = Testmaster_Cost_List.objects.filter(
    #                             Test_Code=item.Test_Code.Test_Code
    #                         ).first()
                        
    #                         print('test_cost :',test_cost)
    #                         print('Billing_Status :',lab_request.Billing_Status)
                            
    #                         if lab_request.Billing_Status == "Completed":
    #                             data = model_to_dict(item.Test_Code)
    #                             modified_data = (
    #                                 {}
    #                             )  # Create a new dictionary to store the modified data
    #                             for key, value in data.items():
    #                                 if key == "department" and item.Test_Code.department:
    #                                     modified_data[key] = (
    #                                         item.Test_Code.department.Department_Name
    #                                     )
    #                                     modified_data["Department_Code"] = (
    #                                         item.Test_Code.department.Department_Code
    #                                     )
    #                                 elif (
    #                                     key == "sub_department"
    #                                     and item.Test_Code.sub_department
    #                                 ):
    #                                     modified_data[key] = (
    #                                         item.Test_Code.sub_department.SubDepartment_Name
    #                                     )
    #                                     modified_data["SubDepartment_Code"] = (
    #                                         item.Test_Code.sub_department.SubDepartment_Code
    #                                     )
    #                                 elif (
    #                                     key == "Container_Name"
    #                                     and item.Test_Code.Container_Name
    #                                 ):
    #                                     modified_data[key] = (
    #                                         item.Test_Code.Container_Name.Container_Name
    #                                     )
    #                                 elif (
    #                                     key == "Specimen_Name"
    #                                     and item.Test_Code.Specimen_Name is not None
    #                                 ):
    #                                     modified_data[key] = (
    #                                         item.Test_Code.Specimen_Name.Specimen_Name
    #                                     )
    #                                 elif key == "Method_Name" and item.Test_Code.Method_Name:
    #                                     modified_data[key] = (
    #                                         item.Test_Code.Method_Name.Method_Name
    #                                     )
    #                                 elif key == "UOM" and item.Test_Code.UOM:
    #                                     modified_data[key] = item.Test_Code.UOM.Unit_Name
    #                                 elif (
    #                                     key == "Captured_Unit_UOM"
    #                                     and item.Test_Code.Captured_Unit_UOM
    #                                 ):
    #                                     modified_data[key] = (
    #                                         item.Test_Code.Captured_Unit_UOM.Unit_Name
    #                                     )
    #                                 else:
    #                                     modified_data[key] = value  # Copy unchanged values
                                    
    #                                 RefernceRangeData = Age_Setup_Master.objects.filter(
    #                                     Test_Code=item.Test_Code.Test_Code
    #                                 ).first()
                                    
    #                                 reference_range = RefernceRangeData.Reference_Range
    #                                 NormalValue = RefernceRangeData.NormalValue
    #                                 Panic_Low = RefernceRangeData.PanicLow
    #                                 Panic_High = RefernceRangeData.PanicHigh

    #                                 if NormalValue == "Yes":
    #                                     panic_low, panic_high = extract_panic_range(
    #                                         reference_range, patient.Gender
    #                                     )
    #                                     modified_data["paniclow"] = panic_low
    #                                     modified_data["panichigh"] = panic_high
    #                                 else:
    #                                     modified_data["paniclow"] = Panic_Low
    #                                     modified_data["panichigh"] = Panic_High
    #                                 modified_data["type"] = "individual"
                                    
    #                                 modified_data["Display_Service_Status"] = "Completed"
    #                                 modified_data["Display_Analysis_Status"] = "Completed"
    #                                 modified_data["Display_Verify_Status"] = "Verified"
    #                                 modified_data["Display_Approve_Status"] = "Approved"
                                    
    #                                 modified_data["Service_Status"] = "Completed"
    #                                 modified_data["Analysis_Status"] = item.Analysis_Status
    #                                 modified_data["Verify_Status"] = item.Verify_Status
    #                                 modified_data["Approve_Status"] = item.Approve_Status
                                    
                                    
                                    
    #                                 modified_data["referencedata"] = reference_range
    #                                 modified_data["NormalValue"] = NormalValue 
    #                                 modified_data["Result_Value"] = None 
    #                                 modified_data["Remarks"] = None
    #                                 modified_data["Result_Value"] = item.Result_Value
    #                                 modified_data["TestType"] = "Individual"
    #                                 modified_data["ColumName"] = "Test_Code"

    #                             # Append the modified dictionary to TestDetails
    #                             TestDetails.append(modified_data)

    #                         item_details.append(
    #                             {
    #                                 "type": "individual",
    #                                 "S_No": index,
    #                                 "Test_Code": (
    #                                     item.Test_Code.Test_Code if item.Test_Code else None
    #                                 ),
    #                                 "SelectItemName": (
    #                                     item.Test_Code.Test_Name if item.Test_Code else None
    #                                 ),
    #                                 "Gender": item.Test_Code.Gender if item.Test_Code else None,
    #                                 "ServiceType": "Lab",
    #                                 "Charges": test_cost.Basic if test_cost else None,
    #                                 "Amount": test_cost.Basic if test_cost else None,
    #                                 "Total": test_cost.Basic if test_cost else None,
    #                                 "NetAmount": test_cost.Basic if test_cost else None,
    #                                 "Quantity":1,
    #                                 "DiscountType": "",
    #                                 "Discount": "",
    #                                 "GST_per": "",
    #                                 "GST": "",
    #                                 "DiscountAmount": "",
    #                                 "isReimbursable": "No",
    #                             }
    #                         )
    #                     elif item.TestType.lower() == "group":
    #                         if lab_request.Billing_Status == "Completed":
    #                             if (
    #                                 item.Group_Code.Department.SubDepartment_Code
    #                                 not in filterdepartment
    #                             ):
    #                                 filterdepartment.append(
    #                                     {
    #                                         "key": item.Group_Code.Department.SubDepartment_Code,
    #                                         "value": item.Group_Code.Department.SubDepartment_Name,
    #                                     }
    #                                 )

    #                         # Get group test cost
    #                         test_cost = Testmaster_Cost_List.objects.filter(
    #                             Group_Code=item.Group_Code
    #                         ).first()

    #                         # Fetch sub-items for the group
    #                         group_items = []
    #                         sub_item_instances = Group_Master_TestList.objects.filter(
    #                             Group_Code=item.Group_Code
    #                         )
    #                         for sub_item in sub_item_instances:
    #                             if sub_item.Test_Code:

    #                                 Specimen_Name = (
    #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name
    #                                 )
    #                                 Specimen_Code = (
    #                                     sub_item.Test_Code.Specimen_Name.Specimen_Code
    #                                 )

    #                                 if Specimen_Code not in Specimen_keys_seen:
    #                                     filterSpecimen.append(
    #                                         {"key": Specimen_Code, "value": Specimen_Name}
    #                                     )
    #                                     Specimen_keys_seen.add(Specimen_Code)

    #                                 sub_item_data = model_to_dict(sub_item.Test_Code)
    #                                 # Add any additional details or transformations if needed
    #                                 # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
    #                                 sub_item_data["SubDepartment_Name"] = (
    #                                     sub_item.Test_Code.sub_department.SubDepartment_Name
    #                                     if sub_item.Test_Code.sub_department
    #                                     else None
    #                                 )
    #                                 sub_item_data["Container_Name"] = (
    #                                     sub_item.Test_Code.Container_Name.Container_Name
    #                                     if sub_item.Test_Code.Container_Name
    #                                     else None
    #                                 )
    #                                 sub_item_data["Specimen_Name"] = (
    #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name
    #                                     if sub_item.Test_Code.Specimen_Name
    #                                     else None
    #                                 )
    #                                 sub_item_data["Method_Name"] = (
    #                                     sub_item.Test_Code.Method_Name.Method_Name
    #                                     if sub_item.Test_Code.Method_Name
    #                                     else None
    #                                 )
    #                                 sub_item_data["UOM"] = (
    #                                     sub_item.Test_Code.UOM.Unit_Name
    #                                     if sub_item.Test_Code.UOM
    #                                     else None
    #                                 )
    #                                 sub_item_data["Captured_Unit_UOM"] = (
    #                                     sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
    #                                     if sub_item.Test_Code.Captured_Unit_UOM
    #                                     else None
    #                                 )

    #                                 sub_item_data["Result_Value"] = None

    #                                 sub_item_data["columnname"] = "Group_Code"

    #                                 group_items.append(sub_item_data)

    #                         # Add group-level item details
    #                         item_details.append(
    #                             {
    #                                 "type": "group",
    #                                 "S_No": index,
    #                                 "Group_Code": (
    #                                     item.Group_Code.Group_Code if item.Group_Code else None
    #                                 ),
    #                                 "SelectItemName": (
    #                                     item.Group_Code.Group_Name if item.Group_Code else None
    #                                 ),
    #                                 "Gender": "All",
    #                                 "Department": (
    #                                     item.Group_Code.Department.SubDepartment_Name
    #                                     if item.Group_Code.Department
    #                                     else None
    #                                 ),
    #                                 "group_items": group_items,  # Include detailed sub-items here
    #                                 "ServiceType": "Lab",
    #                                 "Charges": test_cost.Basic if test_cost else None,
    #                                 "Amount": test_cost.Basic if test_cost else None,
    #                                 "NetAmount": test_cost.Basic if test_cost else None,
    #                                 "Total": test_cost.Basic if test_cost else None,
    #                                 "Quantity":1,
    #                                 "DiscountType": "",
    #                                 "Discount": "",
    #                                 "GST_per": "",
    #                                 "GST": "",
    #                                 "DiscountAmount": "",
    #                                 "isReimbursable": "No",
    #                             }
    #                         )

    #                         TestDetails.append(
    #                             {
    #                                 "type": "group",
    #                                 "S_No": index,
    #                                 "Group_Code": (
    #                                     item.Group_Code.Group_Code if item.Group_Code else None
    #                                 ),
    #                                 "SelectItemName": (
    #                                     item.Group_Code.Group_Name if item.Group_Code else None
    #                                 ),
    #                                 "Gender": "All",
    #                                 "SubDepartment_Code": (
    #                                     item.Group_Code.Department.SubDepartment_Code
    #                                     if item.Group_Code.Department
    #                                     else None
    #                                 ),
    #                                 "Department": (
    #                                     item.Group_Code.Department.SubDepartment_Name
    #                                     if item.Group_Code.Department
    #                                     else None
    #                                 ),
    #                                 "group_items": group_items,  # Include detailed sub-items here
    #                                 "ServiceType": "Lab",
    #                                 "Charges": test_cost.Basic if test_cost else None,
    #                                 "Amount": test_cost.Basic if test_cost else None,
    #                                 "NetAmount": test_cost.Basic if test_cost else None,
    #                                 "Total": test_cost.Basic if test_cost else None,
    #                                 "Quantity":1,
    #                                 "DiscountType": "",
    #                                 "Discount": "",
    #                                 "GST_per": "",
    #                                 "GST": "",
    #                                 "DiscountAmount": "",
    #                                 "isReimbursable": "No",
    #                                 "Service_Status": "Completed",
    #                                 "Analysis_Status": item.Analysis_Status,
    #                                 "Verify_Status": item.Verify_Status,
    #                                 "Approve_Status": item.Approve_Status,
    #                             "TestType" : "Group",
    #                             "ColumName": "Group_Code",
    #                             "Result_Value": None
    #                             }
    #                         )
    #                     elif item.TestType.lower() == "offers":
                            
    #                         sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
    #                         if lab_request.Billing_Status == "Completed":
                                
    #                             if (
    #                                 item.Package_code.department_name
    #                                 not in filterdepartment
    #                             ):
    #                                 filterdepartment.append(
    #                                     {
    #                                         "key": sub_dpt.pk,
    #                                         "value": item.Package_Code.department_name,
    #                                     }
    #                                 )

    #                         # Get group test cost
    #                         test_cost = Testmaster_Cost_List.objects.filter(
    #                             Package_Code=item.Package_Code
    #                         ).first()

    #                         # Fetch sub-items for the group
    #                         group_items = []
    #                         sub_item_instances = OfferPackageList.objects.filter(
    #                             package_code=item.Package_Code.package_code
    #                         )
    #                         print("-------Offer-------",sub_item_instances)
    #                         for sub_item in sub_item_instances:
    #                             print("-------Item-------",sub_item.Test_Code)
                                
    #                             if sub_item.Test_Code:
    #                                 print("------Test------",sub_item.Test_Code.Test_Name)
    #                                 Specimen_Name = (
    #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
    #                                 )
    #                                 Specimen_Code = (
    #                                     sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
    #                                 )

    #                                 if Specimen_Code not in Specimen_keys_seen:
    #                                     filterSpecimen.append(
    #                                         {"key": Specimen_Code, "value": Specimen_Name}
    #                                     )
    #                                     Specimen_keys_seen.add(Specimen_Code)

    #                                 sub_item_data = model_to_dict(sub_item.Test_Code)
    #                                 # Add any additional details or transformations if needed
    #                                 # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
    #                                 sub_item_data["SubDepartment_Name"] = (
    #                                     sub_item.Test_Code.sub_department.SubDepartment_Name
    #                                     if sub_item.Test_Code.sub_department
    #                                     else None
    #                                 )
    #                                 sub_item_data["Container_Name"] = (
    #                                     sub_item.Test_Code.Container_Name.Container_Name
    #                                     if sub_item.Test_Code.Container_Name
    #                                     else None
    #                                 )
    #                                 sub_item_data["Specimen_Name"] = (
    #                                     sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
    #                                     if sub_item.Test_Code.Specimen_Name 
    #                                     else None
    #                                 )
    #                                 sub_item_data["Method_Name"] = (
    #                                     sub_item.Test_Code.Method_Name.Method_Name
    #                                     if sub_item.Test_Code.Method_Name
    #                                     else None
    #                                 )
    #                                 sub_item_data["UOM"] = (
    #                                     sub_item.Test_Code.UOM.Unit_Name
    #                                     if sub_item.Test_Code.UOM
    #                                     else None
    #                                 )
    #                                 sub_item_data["Captured_Unit_UOM"] = (
    #                                     sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
    #                                     if sub_item.Test_Code.Captured_Unit_UOM
    #                                     else None
    #                                 )

    #                                 sub_item_data["Result_Value"] = None

    #                                 sub_item_data["columnname"] = "Group_Code"
    #                                 sub_item_data["Group_Code"] = ""
    #                                 sub_item_data["Group_Name"] = ""

    #                                 print("-------Items-------",sub_item_data['Test_Name'])
    #                                 if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
    #                                     group_items.append(sub_item_data)
                                
    #                             elif sub_item.Group_Code:
    #                                 print("------group------",sub_item.Group_Code.Group_Code)
    #                                 group = sub_item.Group_Code.Group_Code
    #                                 groupName = sub_item.Group_Code.Group_Name
    #                                 sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
    #                                 print("-------Item-------",sub_item_instances)
    #                                 for sub_item in sub_item_instances:
    #                                     print("------Test------",sub_item.Test_Code.Test_Name)
    #                                     Specimen_Name = (
    #                                         sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
    #                                     )
    #                                     Specimen_Code = (
    #                                         sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
    #                                     )

    #                                     if Specimen_Code not in Specimen_keys_seen:
    #                                         filterSpecimen.append(
    #                                             {"key": Specimen_Code, "value": Specimen_Name}
    #                                         )
    #                                         Specimen_keys_seen.add(Specimen_Code)

    #                                     sub_item_data = model_to_dict(sub_item.Test_Code)
    #                                     # Add any additional details or transformations if needed
    #                                     # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
    #                                     sub_item_data["SubDepartment_Name"] = (
    #                                         sub_item.Test_Code.sub_department.SubDepartment_Name
    #                                         if sub_item.Test_Code.sub_department
    #                                         else None
    #                                     )
    #                                     sub_item_data["Container_Name"] = (
    #                                         sub_item.Test_Code.Container_Name.Container_Name
    #                                         if sub_item.Test_Code.Container_Name
    #                                         else None
    #                                     )
    #                                     sub_item_data["Specimen_Name"] = (
    #                                         sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
    #                                         if sub_item.Test_Code.Specimen_Name 
    #                                         else None
    #                                     )
    #                                     sub_item_data["Method_Name"] = (
    #                                         sub_item.Test_Code.Method_Name.Method_Name
    #                                         if sub_item.Test_Code.Method_Name
    #                                         else None
    #                                     )
    #                                     sub_item_data["UOM"] = (
    #                                         sub_item.Test_Code.UOM.Unit_Name
    #                                         if sub_item.Test_Code.UOM
    #                                         else None
    #                                     )
    #                                     sub_item_data["Captured_Unit_UOM"] = (
    #                                         sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
    #                                         if sub_item.Test_Code.Captured_Unit_UOM
    #                                         else None
    #                                     )

    #                                     sub_item_data["Result_Value"] = None

    #                                     sub_item_data["columnname"] = "Group_Code"
    #                                     sub_item_data["Group_Code"] = group
    #                                     sub_item_data["Group_Name"] = groupName

    #                                     print("-------Items-------",sub_item_data['Test_Name'])
    #                                     if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
    #                                         group_items.append(sub_item_data)
                                
    #                         # Add group-level item details
    #                         item_details.append(
    #                             {
    #                                 "type": "Offers",
    #                                 "S_No": index,
    #                                 "Request_Id": lab_request.Request_Id,
    #                                 "Group_Code": (
    #                                     item.Package_Code.package_code if item.Package_Code else None
    #                                 ),
    #                                 "SelectItemName": (
    #                                     item.Package_Code.package_name if item.Package_Code else None
    #                                 ),
    #                                 "Gender": "All",
    #                                 "Department": (
    #                                     item.Package_Code.department_name
    #                                     if item.Package_Code.department_name
    #                                     else None
    #                                 ),
    #                                 "group_items": group_items,  # Include detailed sub-items here
    #                                 "ServiceType": "Lab",
    #                                 "Charges": test_cost.Basic if test_cost else None,
    #                                 "Amount": test_cost.Basic if test_cost else None,
    #                                 "NetAmount": test_cost.Basic if test_cost else None,
    #                                 "Total": test_cost.Basic if test_cost else None,
    #                                 "Quantity":1,
    #                                 "DiscountType": "",
    #                                 "Discount": "",
    #                                 "GST_per": "",
    #                                 "GST": "",
    #                                 "DiscountAmount": "",
    #                                 "isReimbursable": "No",
    #                             }
    #                         )
    #                         print("---------OK--------")
    #                         TestDetails.append(
    #                             {
    #                                 "type": "Offers",
    #                                 "S_No": index,
    #                                 "Group_Code": (
    #                                     item.Package_Code.package_code if item.Package_Code else None
    #                                 ),
    #                                 "SelectItemName": (
    #                                     item.Package_Code.package_name if item.Package_Code else None
    #                                 ),
    #                                 "Gender": "All",
    #                                 "SubDepartment_Code": (
    #                                     sub_dpt.SubDepartment_Code
    #                                     if item.Package_Code.department_name
    #                                     else None
    #                                 ),
    #                                 "Department": (
    #                                     item.Package_Code.department_name
    #                                     if item.Package_Code.department_name
    #                                     else None
    #                                 ),
    #                                 "group_items": group_items,  # Include detailed sub-items here
    #                                 "ServiceType": "Lab",
    #                                 "Charges": test_cost.Basic if test_cost else None,
    #                                 "Amount": test_cost.Basic if test_cost else None,
    #                                 "NetAmount": test_cost.Basic if test_cost else None,
    #                                 "Total": test_cost.Basic if test_cost else None,
    #                                 "Quantity":1,
    #                                 "DiscountType": "",
    #                                 "Discount": "",
    #                                 "GST_per": "",
    #                                 "GST": "",
    #                                 "DiscountAmount": "",
    #                                 "isReimbursable": "No",
    #                                 "Service_Status": "Completed",
    #                                 "Analysis_Status": item.Analysis_Status,
    #                                 "Verify_Status": item.Verify_Status,
    #                                 "Approve_Status": item.Approve_Status,
    #                             "TestType" : "Offers",
    #                             "ColumName": "Package_Code",
    #                             "Result_Value": None
    #                             }
    #                         )
                    
    #                 print("-----ITEMS-----",item_details)
    #                 print('-----Billing---',model_to_dict(general_billing))
                    
    #                 bill_exists = BillingInvoiceAndBillAmount.objects.filter(Billing_Invoice = general_billing.Billing_Invoice_No).exists()

    #                 VisitId = PatientVisitId.objects.filter(Patient_Id=ip_register_instance.PatientId.PatientId).order_by('-Visit_Id').first()
    #                 if VisitId:
    #                     VisitId = VisitId.Visit_Id + 1
    #                 else:
    #                     VisitId = 1

                    

    #                 if not bill_exists:
    #                     count = len(item_details)
    #                     BarcodeId = get_invoice_master_barcode()
    #                     invoiceTable = BillingInvoiceAndBillAmount.objects.create(
    #                         Billing_Invoice = general_billing.Billing_Invoice_No,
    #                         Patient_Id = ip_register_instance.PatientId.PatientId,
    #                         # Visit_Id = visit.VisitId,
    #                         Patient_Name = ip_register_instance.PatientId.FirstName,
    #                         Item_Count = count,
    #                         Total_Charge = general_billing.Net_Amount,
    #                         Status = new_bill_status,
    #                         Location = Location_instance.Location_Name,
    #                         Capture_Sample_Status = "Pending",
    #                         Analyze_Status = "Pending",
    #                         Verify_Status = "Pending",
    #                         Approve_Status = "Pending",
    #                         Barcode_Id = BarcodeId,
    #                         Group_Name = "",
    #                         CreatedBy = created_by,
    #                         Billing_Date = datetime.date(datetime.now()),
    #                         Billing_Type = "",
    #                         RateCard_Name = '',
    #                         Test_Code = "",
    #                         Group_Code = "",
    #                         TotalPaidAmount = general_billing.Paid_Amount,
    #                         BalanceAmount = general_billing.Balance_Amount,
    #                         Sample_Barcode_Image = None,
    #                         AdditionalAmount = '0.00',
    #                         AdditionalAmountReason = "",
    #                         DiscountReason = "",
    #                         HistoNumber = '',
    #                         MicroNumber = '',
    #                         Transfer_Location= "",
    #                         Registration_Id = registration_id

    #                     )
    #                     invoiceTable.save()
    #                     print("--------Invoice Table OK--------")
    #                 for item in item_details:
    #                     if item["type"] == "Offers":
                            
    #                         if item.get("group_items"):
    #                             for subtest in item.get("group_items", []):
    #                                 if subtest["Group_Code"] and subtest["Group_Name"]:
    #                                     group=subtest["Group_Code"]
    #                                     groupName=subtest["Group_Name"]
    #                                 else:
    #                                     group=""
    #                                     groupName=""

    #                                 invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
    #                                 Billing_Invoice = general_billing.Billing_Invoice_No,
    #                                 Patient_Id = ip_register_instance.PatientId.PatientId,
    #                                 # Visit_Id = visit.VisitId,
    #                                 Patient_Name = ip_register_instance.PatientId.FirstName,
    #                                 Dispatch_Method = "",
    #                                 Test_Method = item["type"],
    #                                 Test_Name = subtest["Test_Name"],
    #                                 Gross_Amount = item["Charges"],
    #                                 Location = Location_instance.Location_Name,
    #                                 Service_Status = "Pending",
    #                                 Analysis_Status = "Pending",
    #                                 Verify_Status = "Pending",
    #                                 Approve_Status = "Pending",
    #                                 Barcode_Id = BarcodeId,
    #                                 Group_Name = groupName,
    #                                 CreatedBy = created_by,
    #                                 Billing_Date = datetime.date(datetime.now()),
    #                                 Test_Code = subtest["Test_Code"],
    #                                 Group_Code = group,
    #                                 individual_add_amount = None,
    #                                 IsSubTest = subtest.get("IsSubTest", ""),
    #                                 SubTestCodes = subtest.get("SubTestCodes", ""),
    #                                 Transfer_Location = "",
    #                                 PackageCode = item.get("Group_Code", ""),
    #                                 PackageName = item.get("SelectItemName", ""),
    #                                 Bill_Status = new_bill_status
    #                                 )
    #                                 invoiceItemTable.save()
    #                         else:
    #                             print("--------Offer-Test---------", item)
    #                             invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
    #                             Billing_Invoice = general_billing.Billing_Invoice_No,
    #                             Patient_Id = ip_register_instance.PatientId.PatientId,
    #                             # Visit_Id = visit.VisitId,
    #                             Patient_Name = ip_register_instance.PatientId.FirstName,
    #                             Dispatch_Method = "",
    #                             Test_Method = item["type"],
    #                             Test_Name = item["SelectItemName"],
    #                             Gross_Amount = item["Charges"],
    #                             Location = Location_instance.Location_Name,
    #                             Service_Status = "Pending",
    #                             Analysis_Status = "Pending",
    #                             Verify_Status = "Pending",
    #                             Approve_Status = "Pending",
    #                             Barcode_Id = BarcodeId,
    #                             Group_Name = "",
    #                             CreatedBy = created_by,
    #                             Billing_Date = datetime.date(datetime.now()),
    #                             Test_Code = item["Test_Code"],
    #                             Group_Code = "",
    #                             individual_add_amount = None,
    #                             IsSubTest = "",
    #                             SubTestCodes = "",
    #                             Transfer_Location = "",
    #                             PackageCode = "",
    #                             PackageName = "",
    #                             Bill_Status = new_bill_status
    #                             )
    #                             invoiceItemTable.save()                    
    #                     elif item["type"] == "group":
    #                         for subtest in item.get("group_items", []):
    #                             invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
    #                                 Billing_Invoice = general_billing.Billing_Invoice_No,
    #                                 Patient_Id = ip_register_instance.PatientId.PatientId,
    #                                 # Visit_Id = visit.VisitId,
    #                                 Patient_Name = ip_register_instance.PatientId.FirstName,
    #                                 Dispatch_Method = "",
    #                                 Test_Method = item["type"],
    #                                 Test_Name = subtest["Test_Name"],
    #                                 Gross_Amount = item["Charges"],
    #                                 Location = Location_instance.Location_Name,
    #                                 Service_Status = "Pending",
    #                                 Analysis_Status = "Pending",
    #                                 Verify_Status = "Pending",
    #                                 Approve_Status = "Pending",
    #                                 Barcode_Id = BarcodeId,
    #                                 Group_Name = item.get("SelectItemName", ""),
    #                                 CreatedBy = created_by,
    #                                 Billing_Date = datetime.date(datetime.now()),
    #                                 Test_Code = subtest["Test_Code"],
    #                                 Group_Code = item.get("Group_Code", ""),
    #                                 individual_add_amount = None,
    #                                 IsSubTest = subtest.get("IsSubTest", ""),
    #                                 SubTestCodes = subtest.get("SubTestCodes", ""),
    #                                 Transfer_Location = "",
    #                                 PackageCode = "",
    #                                 PackageName = "",
    #                                 Bill_Status = new_bill_status
    #                             )
    #                             invoiceItemTable.save()
    #                     else:
    #                         print("---------Test---------", item)
    #                         invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
    #                             Billing_Invoice = general_billing.Billing_Invoice_No,
    #                             Patient_Id = ip_register_instance.PatientId.PatientId,
    #                             # Visit_Id =  visit.VisitId,
    #                             Patient_Name = ip_register_instance.PatientId.FirstName,
    #                             Dispatch_Method = "",
    #                             Test_Method = item["type"],
    #                             Test_Name = item["SelectItemName"],
    #                             Gross_Amount = item["Charges"],
    #                             Location = Location_instance.Location_Name,
    #                             Service_Status = "Pending",
    #                             Analysis_Status = "Pending",
    #                             Verify_Status = "Pending",
    #                             Approve_Status = "Pending",
    #                             Barcode_Id = BarcodeId,
    #                             Group_Name = "",
    #                             CreatedBy = created_by,
    #                             Billing_Date = datetime.date(datetime.now()),
    #                             Test_Code = item["Test_Code"],
    #                             Group_Code = "",
    #                             individual_add_amount = None,
    #                             IsSubTest = "",
    #                             SubTestCodes = "",
    #                             Transfer_Location = "",
    #                             PackageCode = "",
    #                             PackageName = "",
    #                             Bill_Status = new_bill_status
    #                         )
    #                         invoiceItemTable.save()
                    
    #                 print("--------Invoice Item Table OK--------")
    #                 try:      
    #                         exists= Register_patient_Details.objects.filter(Patient_Id = ip_register_instance.PatientId.PatientId).exists()
    #                         patient_id = ip_register_instance.PatientId.PatientId
    #                         patient = Patient_Detials.objects.get(PatientId = ip_register_instance.PatientId.PatientId)

    #                         if not exists:   

                                
                                
                                     
    #                             PatientData = Register_patient_Details(
    #                                 Patient_Id = patient_id if patient_id else None,
    #                                 Title = patient.Title.Title_Name,
    #                                 Patient_Name =  patient.FirstName,
    #                                 Father_Name = patient.FatherName,
    #                                 DOB = patient.DOB,
    #                                 Age = patient.Age,
    #                                 Gender = patient.Gender,
    #                                 Marital_Status = "",
    #                                 Door_No = patient.DoorNo,
    #                                 Street = patient.Street,
    #                                 Rural_Urban ="",
    #                                 City = patient.City,
    #                                 State = patient.State,
    #                                 Pincode = patient.Pincode,
    #                                 Phone = patient.PhoneNo,
    #                                 Alternate_No = "",
    #                                 Email = patient.Email,
    #                                 Location = Location_instance.Location_Name,
    #                                 Patient_Barcode = patient_id if patient_id else None,
    #                                 Time_Period = 'year',
    #                                 CreatedBy =created_by,    
    #                             )
    #                             PatientData.save()
    #                             print("--------Patient Data OK--------")
    #                         # Create and save the Patient Visit Table entry
    #                         doctor_name = None
    #                         if self.doctor:
    #                             docs= Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=self.doctor.Doctor_ID).first()
    #                             spc = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=self.doctor.Doctor_ID).first()

    #                             if docs:
    #                                 doctor_name =  docs.First_Name + "/" + spc.Specialization.Speciality_Name or ""
    #                             else:
    #                                 doctor_name = 'Self'

    #                         visitTable = PatientVisitId.objects.create(
    #                                 Visit_Id = VisitId,
    #                                 Patient_Name = patient.FirstName,
    #                                 Patient_Id = patient_id,
    #                                 Phone = patient.PhoneNo,
    #                                 Visit_Type = "IP",
    #                                 Phlebotomist_Type = "",
    #                                 Phlebotomist_Name = "",
    #                                 Refering_Doctor = doctor_name,
    #                                 Patient_Group = ip_register_instance.PatientCategory,
    #                                 Dispatch_Method = "",
    #                                 Patient_Barcode =  patient_id,
    #                                 CreatedBy = created_by,
    #                                 Location = Location_instance.Location_Name,
    #                                 Outsourced_Type = "",
    #                                 Refering_Hospital = "",
    #                             )
    #                         visitTable.save()
    #                         print("--------Patient Visit Table OK--------")
    #                 except Exception as e:
    #                         print(str(e))
                
        
    #             return ('success Data saved successfully')
        
    #     except Exception as e:
    #         print("Exception:", e)
    #         return JsonResponse({'error': 'An internal server error occurred'},status=500)


    def Lab_Request_Detailslink_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,Request_Id):
        try:
            print('/////////////////////////////labbbbbb_add-new')
            print('yvbhjkb', SelectedPatient_list.get('RegisterId'))
            bill_exists = BillingInvoiceAndBillAmount.objects.filter(Request_Id=Request_Id).first()

            service_types = []
            if len(item) > 0:
                for i in item:
                    service_types.append(i.get('ServiceType'))

                if 'LAB' in service_types:
                    created_by = Created_by
                    registration_id = SelectedPatient_list.get('RegisterId')

                    register_type = "IP"
                    SelectedTest = item
                    location = location.Location_Id

                    if registration_id is None or register_type not in ['OP', 'IP', 'Casuality']:
                        return JsonResponse({'warn': 'Missing or invalid registration ID or registration type'})

                    Location_instance = Location_Detials.objects.get(Location_Id=location)
                    lab_request = Lab_Request_Details.objects.filter(Request_Id=Request_Id).first()

                    print('labbbbb createddd', lab_request)

                    for test in SelectedTest:
                        print('tettttttt',test)
                        NextItemIDGet = Lab_Request_Items_Details.objects.annotate(item_id_int=Cast("Item_Id", IntegerField())).aggregate(Max("item_id_int"))["item_id_int__max"]
                        NextItemID = 1 if NextItemIDGet is None else NextItemIDGet+1
                        Code = test.get("ServiceSubCatId").strip()
                        if Code.startswith("LTC"):
                            testType = "Individual"
                        elif Code.startswith("LGM"):
                            testType = "Group"
                        elif Code.startswith("PAC"):
                            testType = "Offers"
                        Service_Status = "Pending"
                        Analysis_Status = "Pending"
                        Verify_Status = "Pending"
                        Approve_Status = "Pending"
                        Pcode=None
                        if testType == 'Individual' or testType == 'individual':
                            print("Individual")
                            Dcode = Test_Descriptions.objects.get(Test_Code = Code)
                            print("Dept----------",Dcode.department.Department_Code, Dcode.sub_department.SubDepartment_Code)
                            department = Lab_Department_Detials.objects.get(Department_Code = Dcode.department.Department_Code)
                            SubDepartment = SubLab_Department_Detials.objects.get(SubDepartment_Code = Dcode.sub_department.SubDepartment_Code)
                            PackgeCode = None
                            GroupCode = None
                            TestCode = Dcode.pk

                        elif testType == 'Group':
                            print("Group")
                            Gcode = Group_Master.objects.get(Group_Code = Code)
                            print("Dept----------",Gcode.Department.department.Department_Code, Gcode.Department.SubDepartment_Code)
                            department = Lab_Department_Detials.objects.get(Department_Code = Gcode.Department.department.Department_Code)
                            SubDepartment = SubLab_Department_Detials.objects.get(SubDepartment_Code = Gcode.Department.SubDepartment_Code)
                            PackgeCode = None
                            GroupCode = Gcode.pk
                            TestCode = None

                        elif testType == 'Offers':
                            print("Offers")
                            Pcode = OfferPackageMaster.objects.filter(package_code=Code).first()
                            print("Dept----------1",Pcode.department_name)
                            SubDepartment = SubLab_Department_Detials.objects.get(SubDepartment_Name=Pcode.department_name)
                            print("Dept----------2",SubDepartment.department.Department_Code)
                            department = Lab_Department_Detials.objects.get(Department_Code = SubDepartment.department.Department_Code)
                            PackgeCode = Pcode.offer_package_id
                            GroupCode = None
                            TestCode = None

                        print("Data--------",NextItemID,lab_request.Request_Id,testType,TestCode,GroupCode,PackgeCode,department.Department_Code,SubDepartment.SubDepartment_Code,Service_Status,Analysis_Status,Verify_Status,Approve_Status)
                        cursor = db.cursor()

                        query = """INSERT INTO Lab_Request_Items_Details (Item_Id, Request_id, TestType, Test_Code_id, Group_Code_id, Package_Code_id,
                          Department_Code_id, SubDepartment_Code_id, Service_Status, Analysis_Status, Verify_Status, Approve_Status, created_at, updated_at) 
                          VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""
                        cursor.execute(query,[NextItemID, lab_request.Request_Id, testType, TestCode, GroupCode , PackgeCode, department.Department_Code, SubDepartment.SubDepartment_Code , Service_Status,
                                               Analysis_Status, Verify_Status, Approve_Status, datetime.now(), datetime.now()])
                        db.commit()
                        print("Data commited...")
 
                    print("Next-----------")
                    
                    if register_type == 'IP':       
                        item_details = []
                        filterdepartment = []
                        TestDetails = []
                        keys_seen = set()
                        filterSpecimen = []
                        Specimen_keys_seen = set()
                        Pcode = OfferPackageMaster.objects.filter(package_code=Code).first()

                        new_codes = [test.get("ServiceSubCatId").strip() for test in SelectedTest if test.get("ServiceSubCatId")]
                        new_group_codes = [test.get("ServiceSubCatId").strip() for test in SelectedTest if test.get("ServiceSubCatId") and test.get("ServiceSubCatId").startswith("LGM")]
                        new_package_codes = [
                            OfferPackageMaster.objects.filter(package_code=test.get("ServiceSubCatId").strip()).first()
                            for test in SelectedTest
                            if test.get("ServiceSubCatId") and test.get("ServiceSubCatId").startswith("PAC")
                        ]
                        new_items = lab_request.lab_request_items.filter(
                            Q(Test_Code__in=new_codes) |
                            Q(Group_Code__in=new_group_codes) |
                            Q(Package_Code__in=new_package_codes)
                        )

                        for index, item in enumerate(new_items, start=1):
                            print("TestType :",item.TestType,item.Test_Code)
                            
                            if item.TestType.lower() == "individual":
                                if lab_request.Billing_Status == "Completed":
                                    sub_department_code = (
                                        item.Test_Code.sub_department.SubDepartment_Code
                                    )
                                    sub_department_name = (
                                        item.Test_Code.sub_department.SubDepartment_Name
                                    )

                                    if sub_department_code not in keys_seen:
                                        filterdepartment.append(
                                            {
                                                "key": sub_department_code,
                                                "value": sub_department_name,
                                            }
                                        )
                                        keys_seen.add(sub_department_code)

                                    Specimen_Name = (
                                        item.Test_Code.Specimen_Name.Specimen_Name
                                        if item.Test_Code.Specimen_Name
                                        else None
                                    )
                                    Specimen_Code = (
                                        item.Test_Code.Specimen_Name.Specimen_Code
                                        if item.Test_Code.Specimen_Name
                                        else None
                                    )

                                    if Specimen_Code not in Specimen_keys_seen:
                                        filterSpecimen.append(
                                            {"key": Specimen_Code, "value": Specimen_Name}
                                        )
                                        Specimen_keys_seen.add(Specimen_Code)

                                print("type :", item.TestType)
                                print("item.Test_Code :", item.Test_Code)
                                test_cost = Testmaster_Cost_List.objects.filter(
                                    Test_Code=item.Test_Code.Test_Code
                                ).first()
                            
                                print('test_cost :',test_cost)
                                print('Billing_Status :',lab_request.Billing_Status)
                                
                                if lab_request.Billing_Status == "Completed":
                                    data = model_to_dict(item.Test_Code)
                                    modified_data = (
                                        {}
                                    )  # Create a new dictionary to store the modified data
                                    for key, value in data.items():
                                        if key == "department" and item.Test_Code.department:
                                            modified_data[key] = (
                                                item.Test_Code.department.Department_Name
                                            )
                                            modified_data["Department_Code"] = (
                                                item.Test_Code.department.Department_Code
                                            )
                                        elif (
                                            key == "sub_department"
                                            and item.Test_Code.sub_department
                                        ):
                                            modified_data[key] = (
                                                item.Test_Code.sub_department.SubDepartment_Name
                                            )
                                            modified_data["SubDepartment_Code"] = (
                                                item.Test_Code.sub_department.SubDepartment_Code
                                            )
                                        elif (
                                            key == "Container_Name"
                                            and item.Test_Code.Container_Name
                                        ):
                                            modified_data[key] = (
                                                item.Test_Code.Container_Name.Container_Name
                                            )
                                        elif (
                                            key == "Specimen_Name"
                                            and item.Test_Code.Specimen_Name is not None
                                        ):
                                            modified_data[key] = (
                                                item.Test_Code.Specimen_Name.Specimen_Name
                                            )
                                        elif key == "Method_Name" and item.Test_Code.Method_Name:
                                            modified_data[key] = (
                                                item.Test_Code.Method_Name.Method_Name
                                            )
                                        elif key == "UOM" and item.Test_Code.UOM:
                                            modified_data[key] = item.Test_Code.UOM.Unit_Name
                                        elif (
                                            key == "Captured_Unit_UOM"
                                            and item.Test_Code.Captured_Unit_UOM
                                        ):
                                            modified_data[key] = (
                                                item.Test_Code.Captured_Unit_UOM.Unit_Name
                                            )
                                        else:
                                            modified_data[key] = value  # Copy unchanged values
                                        
                                        RefernceRangeData = Age_Setup_Master.objects.filter(
                                            Test_Code=item.Test_Code.Test_Code
                                        ).first()
                                        
                                        reference_range = RefernceRangeData.Reference_Range
                                        NormalValue = RefernceRangeData.NormalValue
                                        Panic_Low = RefernceRangeData.PanicLow
                                        Panic_High = RefernceRangeData.PanicHigh

                                        if NormalValue == "Yes":
                                            panic_low, panic_high = extract_panic_range(
                                                reference_range, SelectedPatient_list.Gender
                                            )
                                            modified_data["paniclow"] = panic_low
                                            modified_data["panichigh"] = panic_high
                                        else:
                                            modified_data["paniclow"] = Panic_Low
                                            modified_data["panichigh"] = Panic_High
                                        modified_data["type"] = "individual"
                                        
                                        modified_data["Display_Service_Status"] = "Completed"
                                        modified_data["Display_Analysis_Status"] = "Completed"
                                        modified_data["Display_Verify_Status"] = "Verified"
                                        modified_data["Display_Approve_Status"] = "Approved"
                                        
                                        modified_data["Service_Status"] = "Completed"
                                        modified_data["Analysis_Status"] = item.Analysis_Status
                                        modified_data["Verify_Status"] = item.Verify_Status
                                        modified_data["Approve_Status"] = item.Approve_Status
                                        
                                        
                                        
                                        modified_data["referencedata"] = reference_range
                                        modified_data["NormalValue"] = NormalValue 
                                        modified_data["Result_Value"] = None 
                                        modified_data["Remarks"] = None
                                        modified_data["Result_Value"] = item.Result_Value
                                        modified_data["TestType"] = "Individual"
                                        modified_data["ColumName"] = "Test_Code"

                                    # Append the modified dictionary to TestDetails
                                    TestDetails.append(modified_data)

                                item_details.append(
                                    {
                                        "type": "individual",
                                        "S_No": index,
                                        "Test_Code": (
                                            item.Test_Code.Test_Code if item.Test_Code else None
                                        ),
                                        "SelectItemName": (
                                            item.Test_Code.Test_Name if item.Test_Code else None
                                        ),
                                        "Gender": item.Test_Code.Gender if item.Test_Code else None,
                                        "ServiceType": "Lab",
                                        "Charges": test_cost.Basic if test_cost else None,
                                        "Amount": test_cost.Basic if test_cost else None,
                                        "Total": test_cost.Basic if test_cost else None,
                                        "NetAmount": test_cost.Basic if test_cost else None,
                                        "Quantity":1,
                                        "DiscountType": "",
                                        "Discount": "",
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                    }
                                )
                            elif item.TestType.lower() == "group":
                                if lab_request.Billing_Status == "Completed":
                                    if (
                                        item.Group_Code.Department.SubDepartment_Code
                                        not in filterdepartment
                                    ):
                                        filterdepartment.append(
                                            {
                                                "key": item.Group_Code.Department.SubDepartment_Code,
                                                "value": item.Group_Code.Department.SubDepartment_Name,
                                            }
                                        )

                                # Get group test cost
                                test_cost = Testmaster_Cost_List.objects.filter(
                                    Group_Code=item.Group_Code
                                ).first()

                                # Fetch sub-items for the group
                                group_items = []
                                sub_item_instances = Group_Master_TestList.objects.filter(
                                    Group_Code=item.Group_Code
                                )
                                for sub_item in sub_item_instances:
                                    if sub_item.Test_Code:

                                        Specimen_Name = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name
                                        )
                                        Specimen_Code = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Code
                                        )

                                        if Specimen_Code not in Specimen_keys_seen:
                                            filterSpecimen.append(
                                                {"key": Specimen_Code, "value": Specimen_Name}
                                            )
                                            Specimen_keys_seen.add(Specimen_Code)

                                        sub_item_data = model_to_dict(sub_item.Test_Code)
                                        # Add any additional details or transformations if needed
                                        # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                        sub_item_data["SubDepartment_Name"] = (
                                            sub_item.Test_Code.sub_department.SubDepartment_Name
                                            if sub_item.Test_Code.sub_department
                                            else None
                                        )
                                        sub_item_data["Container_Name"] = (
                                            sub_item.Test_Code.Container_Name.Container_Name
                                            if sub_item.Test_Code.Container_Name
                                            else None
                                        )
                                        sub_item_data["Specimen_Name"] = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name
                                            if sub_item.Test_Code.Specimen_Name
                                            else None
                                        )
                                        sub_item_data["Method_Name"] = (
                                            sub_item.Test_Code.Method_Name.Method_Name
                                            if sub_item.Test_Code.Method_Name
                                            else None
                                        )
                                        sub_item_data["UOM"] = (
                                            sub_item.Test_Code.UOM.Unit_Name
                                            if sub_item.Test_Code.UOM
                                            else None
                                        )
                                        sub_item_data["Captured_Unit_UOM"] = (
                                            sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                            if sub_item.Test_Code.Captured_Unit_UOM
                                            else None
                                        )

                                        sub_item_data["Result_Value"] = None

                                        sub_item_data["columnname"] = "Group_Code"

                                        group_items.append(sub_item_data)

                                # Add group-level item details
                                item_details.append(
                                    {
                                        "type": "group",
                                        "S_No": index,
                                        "Group_Code": (
                                            item.Group_Code.Group_Code if item.Group_Code else None
                                        ),
                                        "SelectItemName": (
                                            item.Group_Code.Group_Name if item.Group_Code else None
                                        ),
                                        "Gender": "All",
                                        "Department": (
                                            item.Group_Code.Department.SubDepartment_Name
                                            if item.Group_Code.Department
                                            else None
                                        ),
                                        "group_items": group_items,  # Include detailed sub-items here
                                        "ServiceType": "Lab",
                                        "Charges": test_cost.Basic if test_cost else None,
                                        "Amount": test_cost.Basic if test_cost else None,
                                        "NetAmount": test_cost.Basic if test_cost else None,
                                        "Total": test_cost.Basic if test_cost else None,
                                        "Quantity":1,
                                        "DiscountType": "",
                                        "Discount": "",
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                    }
                                )

                                TestDetails.append(
                                    {
                                        "type": "group",
                                        "S_No": index,
                                        "Group_Code": (
                                            item.Group_Code.Group_Code if item.Group_Code else None
                                        ),
                                        "SelectItemName": (
                                            item.Group_Code.Group_Name if item.Group_Code else None
                                        ),
                                        "Gender": "All",
                                        "SubDepartment_Code": (
                                            item.Group_Code.Department.SubDepartment_Code
                                            if item.Group_Code.Department
                                            else None
                                        ),
                                        "Department": (
                                            item.Group_Code.Department.SubDepartment_Name
                                            if item.Group_Code.Department
                                            else None
                                        ),
                                        "group_items": group_items,  # Include detailed sub-items here
                                        "ServiceType": "Lab",
                                        "Charges": test_cost.Basic if test_cost else None,
                                        "Amount": test_cost.Basic if test_cost else None,
                                        "NetAmount": test_cost.Basic if test_cost else None,
                                        "Total": test_cost.Basic if test_cost else None,
                                        "Quantity":1,
                                        "DiscountType": "",
                                        "Discount": "",
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                        "Service_Status": "Completed",
                                        "Analysis_Status": item.Analysis_Status,
                                        "Verify_Status": item.Verify_Status,
                                        "Approve_Status": item.Approve_Status,
                                    "TestType" : "Group",
                                    "ColumName": "Group_Code",
                                    "Result_Value": None
                                    }
                                )
                            elif item.TestType.lower() == "offers":
                                
                                sub_dpt = SubLab_Department_Detials.objects.get(SubDepartment_Name=item.Package_Code.department_name)
                                if lab_request.Billing_Status == "Completed":
                                    
                                    if (
                                        item.Package_code.department_name
                                        not in filterdepartment
                                    ):
                                        filterdepartment.append(
                                            {
                                                "key": sub_dpt.pk,
                                                "value": item.Package_Code.department_name,
                                            }
                                        )

                                # Get group test cost
                                test_cost = Testmaster_Cost_List.objects.filter(
                                    Package_Code=item.Package_Code
                                ).first()

                                # Fetch sub-items for the group
                                group_items = []
                                sub_item_instances = OfferPackageList.objects.filter(
                                    package_code=item.Package_Code.package_code
                                )
                                print("-------Offer-------",sub_item_instances)
                                for sub_item in sub_item_instances:
                                    print("-------Item-------",sub_item.Test_Code)
                                    
                                    if sub_item.Test_Code:
                                        print("------Test------",sub_item.Test_Code.Test_Name)
                                        Specimen_Name = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                        )
                                        Specimen_Code = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                        )

                                        if Specimen_Code not in Specimen_keys_seen:
                                            filterSpecimen.append(
                                                {"key": Specimen_Code, "value": Specimen_Name}
                                            )
                                            Specimen_keys_seen.add(Specimen_Code)

                                        sub_item_data = model_to_dict(sub_item.Test_Code)
                                        # Add any additional details or transformations if needed
                                        # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                        sub_item_data["SubDepartment_Name"] = (
                                            sub_item.Test_Code.sub_department.SubDepartment_Name
                                            if sub_item.Test_Code.sub_department
                                            else None
                                        )
                                        sub_item_data["Container_Name"] = (
                                            sub_item.Test_Code.Container_Name.Container_Name
                                            if sub_item.Test_Code.Container_Name
                                            else None
                                        )
                                        sub_item_data["Specimen_Name"] = (
                                            sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                            if sub_item.Test_Code.Specimen_Name 
                                            else None
                                        )
                                        sub_item_data["Method_Name"] = (
                                            sub_item.Test_Code.Method_Name.Method_Name
                                            if sub_item.Test_Code.Method_Name
                                            else None
                                        )
                                        sub_item_data["UOM"] = (
                                            sub_item.Test_Code.UOM.Unit_Name
                                            if sub_item.Test_Code.UOM
                                            else None
                                        )
                                        sub_item_data["Captured_Unit_UOM"] = (
                                            sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                            if sub_item.Test_Code.Captured_Unit_UOM
                                            else None
                                        )

                                        sub_item_data["Result_Value"] = None

                                        sub_item_data["columnname"] = "Group_Code"
                                        sub_item_data["Group_Code"] = ""
                                        sub_item_data["Group_Name"] = ""

                                        print("-------Items-------",sub_item_data['Test_Name'])
                                        if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                            group_items.append(sub_item_data)
                                    
                                    elif sub_item.Group_Code:
                                        print("------group------",sub_item.Group_Code.Group_Code)
                                        group = sub_item.Group_Code.Group_Code
                                        groupName = sub_item.Group_Code.Group_Name
                                        sub_item_instances = Group_Master_TestList.objects.filter(Group_Code=group)
                                        print("-------Item-------",sub_item_instances)
                                        for sub_item in sub_item_instances:
                                            print("------Test------",sub_item.Test_Code.Test_Name)
                                            Specimen_Name = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                            )
                                            Specimen_Code = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Code if  sub_item.Test_Code.Specimen_Name else ""
                                            )

                                            if Specimen_Code not in Specimen_keys_seen:
                                                filterSpecimen.append(
                                                    {"key": Specimen_Code, "value": Specimen_Name}
                                                )
                                                Specimen_keys_seen.add(Specimen_Code)

                                            sub_item_data = model_to_dict(sub_item.Test_Code)
                                            # Add any additional details or transformations if needed
                                            # sub_item_data['Department_Name'] = sub_item.Test_Code.department.Department_Name if sub_item.Test_Code.department else None
                                            sub_item_data["SubDepartment_Name"] = (
                                                sub_item.Test_Code.sub_department.SubDepartment_Name
                                                if sub_item.Test_Code.sub_department
                                                else None
                                            )
                                            sub_item_data["Container_Name"] = (
                                                sub_item.Test_Code.Container_Name.Container_Name
                                                if sub_item.Test_Code.Container_Name
                                                else None
                                            )
                                            sub_item_data["Specimen_Name"] = (
                                                sub_item.Test_Code.Specimen_Name.Specimen_Name if  sub_item.Test_Code.Specimen_Name else ""
                                                if sub_item.Test_Code.Specimen_Name 
                                                else None
                                            )
                                            sub_item_data["Method_Name"] = (
                                                sub_item.Test_Code.Method_Name.Method_Name
                                                if sub_item.Test_Code.Method_Name
                                                else None
                                            )
                                            sub_item_data["UOM"] = (
                                                sub_item.Test_Code.UOM.Unit_Name
                                                if sub_item.Test_Code.UOM
                                                else None
                                            )
                                            sub_item_data["Captured_Unit_UOM"] = (
                                                sub_item.Test_Code.Captured_Unit_UOM.Unit_Name
                                                if sub_item.Test_Code.Captured_Unit_UOM
                                                else None
                                            )

                                            sub_item_data["Result_Value"] = None

                                            sub_item_data["columnname"] = "Group_Code"
                                            sub_item_data["Group_Code"] = group
                                            sub_item_data["Group_Name"] = groupName

                                            print("-------Items-------",sub_item_data['Test_Name'])
                                            if sub_item_data['Test_Code'] not in [item['Test_Code'] for item in group_items]:
                                                group_items.append(sub_item_data)
                                    
                                # Add group-level item details
                                item_details.append(
                                    {
                                        "type": "Offers",
                                        "S_No": index,
                                        "Request_Id": lab_request.Request_Id,
                                        "Group_Code": (
                                            item.Package_Code.package_code if item.Package_Code else None
                                        ),
                                        "SelectItemName": (
                                            item.Package_Code.package_name if item.Package_Code else None
                                        ),
                                        "Gender": "All",
                                        "Department": (
                                            item.Package_Code.department_name
                                            if item.Package_Code.department_name
                                            else None
                                        ),
                                        "group_items": group_items,  # Include detailed sub-items here
                                        "ServiceType": "Lab",
                                        "Charges": test_cost.Basic if test_cost else None,
                                        "Amount": test_cost.Basic if test_cost else None,
                                        "NetAmount": test_cost.Basic if test_cost else None,
                                        "Total": test_cost.Basic if test_cost else None,
                                        "Quantity":1,
                                        "DiscountType": "",
                                        "Discount": "",
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                    }
                                )
                                print("---------OK--------")
                                TestDetails.append(
                                    {
                                        "type": "Offers",
                                        "S_No": index,
                                        "Group_Code": (
                                            item.Package_Code.package_code if item.Package_Code else None
                                        ),
                                        "SelectItemName": (
                                            item.Package_Code.package_name if item.Package_Code else None
                                        ),
                                        "Gender": "All",
                                        "SubDepartment_Code": (
                                            sub_dpt.SubDepartment_Code
                                            if item.Package_Code.department_name
                                            else None
                                        ),
                                        "Department": (
                                            item.Package_Code.department_name
                                            if item.Package_Code.department_name
                                            else None
                                        ),
                                        "group_items": group_items,  # Include detailed sub-items here
                                        "ServiceType": "Lab",
                                        "Charges": test_cost.Basic if test_cost else None,
                                        "Amount": test_cost.Basic if test_cost else None,
                                        "NetAmount": test_cost.Basic if test_cost else None,
                                        "Total": test_cost.Basic if test_cost else None,
                                        "Quantity":1,
                                        "DiscountType": "",
                                        "Discount": "",
                                        "GST_per": "",
                                        "GST": "",
                                        "DiscountAmount": "",
                                        "isReimbursable": "No",
                                        "Service_Status": "Completed",
                                        "Analysis_Status": item.Analysis_Status,
                                        "Verify_Status": item.Verify_Status,
                                        "Approve_Status": item.Approve_Status,
                                    "TestType" : "Offers",
                                    "ColumName": "Package_Code",
                                    "Result_Value": None
                                    }
                                )
                        
                        
                        

                        # if not bill_exists:
                        #     count = len(item_details)
                        #     BarcodeId = bill_exists.Barcode_Id
                        #     invoiceTable = BillingInvoiceAndBillAmount.objects.create(
                        #         Billing_Invoice = general_billing.Billing_Invoice_No,
                        #         Patient_Id = ip_register_instance.PatientId.PatientId,
                        #         # Visit_Id = visit.VisitId,
                        #         Patient_Name = ip_register_instance.PatientId.FirstName,
                        #         Item_Count = count,
                        #         Total_Charge = general_billing.Net_Amount,
                        #         Status = new_bill_status,
                        #         Location = Location_instance.Location_Name,
                        #         Capture_Sample_Status = "Pending",
                        #         Analyze_Status = "Pending",
                        #         Verify_Status = "Pending",
                        #         Approve_Status = "Pending",
                        #         Barcode_Id = BarcodeId,
                        #         Group_Name = "",
                        #         CreatedBy = created_by,
                        #         Billing_Date = datetime.date(datetime.now()),
                        #         Billing_Type = "",
                        #         RateCard_Name = '',
                        #         Test_Code = "",
                        #         Group_Code = "",
                        #         TotalPaidAmount = general_billing.Paid_Amount,
                        #         BalanceAmount = general_billing.Balance_Amount,
                        #         Sample_Barcode_Image = None,
                        #         AdditionalAmount = '0.00',
                        #         AdditionalAmountReason = "",
                        #         DiscountReason = "",
                        #         HistoNumber = '',
                        #         MicroNumber = '',
                        #         Transfer_Location= "",
                        #         Registration_Id = registration_id

                        #     )
                        #     invoiceTable.save()
                        #     print("--------Invoice Table OK--------")
                        print("Previous========",bill_exists.Billing_Invoice)

                        for item in item_details:
                            print("---------Test---------", item)
                            if item["type"] == "Offers":
                                if item.get("group_items"):
                                    for subtest in item.get("group_items", []):
                                        if subtest["Group_Code"] and subtest["Group_Name"]:
                                            group=subtest["Group_Code"]
                                            groupName=subtest["Group_Name"]
                                        else:
                                            group=""
                                            groupName=""

                                        invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                        Billing_Invoice = bill_exists.Billing_Invoice,
                                        Patient_Id = bill_exists.Patient_Id,
                                        Visit_Id = bill_exists.Visit_Id,
                                        Patient_Name = bill_exists.Patient_Name,
                                        Dispatch_Method = "",
                                        Test_Method = item["type"],
                                        Test_Name = subtest["Test_Name"],
                                        Gross_Amount = item["Charges"],
                                        Location = Location_instance.Location_Name,
                                        Service_Status = "Pending",
                                        Analysis_Status = "Pending",
                                        Verify_Status = "Pending",
                                        Approve_Status = "Pending",
                                        Barcode_Id = bill_exists.Barcode_Id,
                                        Group_Name = groupName,
                                        CreatedBy = created_by,
                                        Billing_Date = datetime.date(datetime.now()),
                                        Test_Code = subtest["Test_Code"],
                                        Group_Code = group,
                                        individual_add_amount = None,
                                        IsSubTest = subtest.get("IsSubTest", ""),
                                        SubTestCodes = subtest.get("SubTestCodes", ""),
                                        Transfer_Location = "",
                                        PackageCode = item.get("Group_Code", ""),
                                        PackageName = item.get("SelectItemName", ""),
                                        Bill_Status = new_bill_status
                                        )
                                        invoiceItemTable.save()
                                else:
                                    print("--------Offer-Test---------", item)
                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = bill_exists.Billing_Invoice,
                                    Patient_Id = bill_exists.Patient_Id,
                                    Visit_Id = bill_exists.Visit_Id,
                                    Patient_Name = bill_exists.Patient_Name,
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = item["SelectItemName"],
                                    Gross_Amount = item["Charges"],
                                    Location = Location_instance.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = bill_exists.Barcode_Id,
                                    Group_Name = "",
                                    CreatedBy = created_by,
                                    Billing_Date = datetime.date(datetime.now()),
                                    Test_Code = item["Test_Code"],
                                    Group_Code = "",
                                    individual_add_amount = None,
                                    IsSubTest = "",
                                    SubTestCodes = "",
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()                    
                            elif item["type"] == "group":
                                for subtest in item.get("group_items", []):
                                    invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                        Billing_Invoice = bill_exists.Billing_Invoice,
                                        Patient_Id = bill_exists.Patient_Id,
                                        Visit_Id = bill_exists.Visit_Id,
                                        Patient_Name = bill_exists.Patient_Name,
                                        Dispatch_Method = "",
                                        Test_Method = item["type"],
                                        Test_Name = subtest["Test_Name"],
                                        Gross_Amount = item["Charges"],
                                        Location = Location_instance.Location_Name,
                                        Service_Status = "Pending",
                                        Analysis_Status = "Pending",
                                        Verify_Status = "Pending",
                                        Approve_Status = "Pending",
                                        Barcode_Id = bill_exists.Barcode_Id,
                                        Group_Name = item.get("SelectItemName", ""),
                                        CreatedBy = created_by,
                                        Billing_Date = datetime.date(datetime.now()),
                                        Test_Code = subtest["Test_Code"],
                                        Group_Code = item.get("Group_Code", ""),
                                        individual_add_amount = None,
                                        IsSubTest = subtest.get("IsSubTest", ""),
                                        SubTestCodes = subtest.get("SubTestCodes", ""),
                                        Transfer_Location = "",
                                        PackageCode = "",
                                        PackageName = "",
                                        Bill_Status = new_bill_status
                                    )
                                    invoiceItemTable.save()
                            else:
                                invoiceItemTable = Billing_Item_Table_for_lab.objects.create(
                                    Billing_Invoice = bill_exists.Billing_Invoice,
                                    Patient_Id = bill_exists.Patient_Id,
                                    Visit_Id = bill_exists.Visit_Id,
                                    Patient_Name = bill_exists.Patient_Name,
                                    Dispatch_Method = "",
                                    Test_Method = item["type"],
                                    Test_Name = item["SelectItemName"],
                                    Gross_Amount = item["Charges"],
                                    Location = Location_instance.Location_Name,
                                    Service_Status = "Pending",
                                    Analysis_Status = "Pending",
                                    Verify_Status = "Pending",
                                    Approve_Status = "Pending",
                                    Barcode_Id = bill_exists.Barcode_Id,
                                    Group_Name = "",
                                    CreatedBy = created_by,
                                    Billing_Date = datetime.date(datetime.now()),
                                    Test_Code = item["Test_Code"],
                                    Group_Code = "",
                                    individual_add_amount = None,
                                    IsSubTest = "",
                                    SubTestCodes = "",
                                    Transfer_Location = "",
                                    PackageCode = "",
                                    PackageName = "",
                                    Bill_Status = new_bill_status
                                )
                                invoiceItemTable.save()
                        
                        print("--------Invoice Item Table OK--------")
            
                    return ('success Data saved successfully')
            
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)


    # def Lab_Request_Detailslink_Status_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,BillingType,Request_Id,paytype):
    #     try:
    #         print('labbbbbb Quickkkkkk')

    #         service_types = []
    #         for i in item:
    #             service_types.append(i.get('ServiceType'))
    #         if 'Lab' in service_types or 'Radiology' in service_types or BillingType == 'RADIOLOGY':
    #             for i in item:
    #                 if i.get('ServiceType') == 'RADIOLOGY' or i.get('ServiceType') == 'Radiology':

    #                     if paytype == 'Cash':
    #                         radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
    #                         radins.Status = new_bill_status
    #                         radins.IP_Billing_Invoice_No = general_billing
    #                         radins.save()

    #                     else:

    #                         radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
    #                         radins.Status = new_bill_status
    #                         radins.Interim_Billing_Invoice_No = general_billing
    #                         radins.save()

    #                 if i.get('ServiceType') == 'Lab':
    #                     print('ufkjoiuyg')
    #                     print('yvbhjvev',Request_Id)
    #                     labins = BillingInvoiceAndBillAmount.objects.filter(Request_Id=Request_Id).first()
    #                     print('iubnveijbn',labins)
    #                     labins.Status = new_bill_status
    #                     # labins.Billing_Invoice = general_billing.Billing_Invoice_No
    #                     labins.save()

    #                     labitem_ins =Billing_Item_Table_for_lab.objects.filter(Barcode_Id=labins.Barcode_Id)
    #                     for item in labitem_ins:
    #                         # item.Billing_Invoice = general_billing.Billing_Invoice_No
    #                         item.Bill_Status = new_bill_status
    #                         item.save()

    #                     lab_req_ins = Lab_Request_Details.objects.filter(pk = Request_Id).first()
    #                     lab_req_ins.Billing_Status = new_bill_status
    #                     lab_req_ins.save()
                
    #     except Exception as e:
    #         print("Exception:", e)
    #         return JsonResponse({'error': 'An internal server error occurred'},status=500)



    def Lab_Request_Detailslink_Status_Billing(self,item,general_billing,new_bill_status,SelectedPatient_list,Created_by,location,BillingType,Request_Id,paytype):
        try:
            # print('labbbbbb Quickkkkkk',item)

            service_types = []
            for i in item:
                service_types.append(i.get('ServiceType'))
            if 'Lab' in service_types or 'Radiology' in service_types or BillingType == 'RADIOLOGY':
                for i in item:
                    if i.get('ServiceType') == 'RADIOLOGY' or i.get('ServiceType') == 'Radiology':

                        if paytype == 'Cash':
                            radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
                            radins.Status = new_bill_status
                            radins.IP_Billing_Invoice_No = general_billing
                            radins.save()

                        else:

                            radins = Radiology_Request_Details.objects.filter(pk=i.get('request_id')).first()
                            radins.Status = new_bill_status
                            radins.Interim_Billing_Invoice_No = general_billing
                            radins.save()

                    if i.get('ServiceType') == 'Lab':
                        print('ufkjoiuyg')
                        # print('yvbhjvev',Request_Id)
                        lab_req_ins = Lab_Request_Details.objects.filter(pk = Request_Id).first()
                        lab_req_ins.Billing_Status = new_bill_status
                        lab_req_ins.save()

                        labins = BillingInvoiceAndBillAmount.objects.filter(Request_Id=Request_Id).first()
                        # print('iubnveijbn',labins)
                        labins.Status = new_bill_status
                        # labins.Billing_Invoice = general_billing.Billing_Invoice_No
                        labins.save()
                        
                        labitem_ins =Billing_Item_Table_for_lab.objects.filter(Barcode_Id=labins.Barcode_Id)

                        
                        for lab_item in labitem_ins:
                            if lab_item.Bill_Status == "Canceled":
                                status = "Canceled"
                            else:
                                status = new_bill_status   

                            print("Status---------",i.get("type"),lab_item.Test_Method)
                            if i.get("type") == lab_item.Test_Method:
                                if i.get('status') == 'Canceled':
                                    if (i.get("Group_Code") and lab_item.PackageCode == i.get("Group_Code")) \
                                    or (i.get("Group_Code") and lab_item.Group_Code == i.get("Group_Code")) \
                                    or (i.get("Test_Code") and lab_item.Test_Code == i.get("Test_Code")):
                                        status = "Canceled"                            

                            print("STatus----------", status)
                            lab_item.Bill_Status = status
                            lab_item.save()

                
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': 'An internal server error occurred'},status=500)



    def post(self, request):
        try:
            data = json.loads(request.body)
            
            # Get related objects
            related_objects = self.get_related_objects(data)
            if isinstance(related_objects, JsonResponse):
                return related_objects

            # Extract data
            initial_state = data.get('initialState', {})
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            bill_amounts = data.get('billAmount', [])
            select_data = data.get('SelectDatalist', [])
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
            new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
            Location = data.get('Location', '')
            BillingType = data.get('BillingType', '')
            Request_Id = data.get('Request_Id','')

            new_select_data = data.get('NewItems', [])


            paytype = data.get('Paytype') 
            location = Location_Detials.objects.get(Location_Id=Location)
            receipt_no = None
            if data.get('Paytype') == 'Cash':
                # Create IP Billing record
                ip_billing = IP_Billing_Table_Detials.objects.create(
                    Billing_Date=billing_data.get('InvoiceDate'),
                    Doctor_Id=self.doctor,
                    Patient_Id=self.patient,
                    Register_Id=self.register,
                    Billing_Type='DailyBill',
                    Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
                    Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
                    Total_Items=int(initial_state.get('totalItems')),
                    Total_Qty=int(initial_state.get('totalUnits', 1)),
                    Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
                    Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
                    Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
                    Net_Paid_Amount=initial_state.get('totalAmountt'),
                    Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
                    Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
                    Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
                    Bill_Status=new_bill_status,
                    created_by=created_by
                )

                # Save billing items
                self.save_billing_items(select_data, ip_billing, new_bill_status)
                
                # Create receipt and payment records
                receipt = self.create_billing_receipt(
                    ip_billing,
                    billing_data,
                    self.safe_to_decimal(initial_state.get('totalNetAmount')),
                    self.safe_to_decimal(initial_state.get('BalanceAmount')),
                    self.safe_to_decimal(initial_state.get('PaidAmount')),
                    created_by
                )
                
                # Save payment details
                for payment in bill_amounts:
                    self.save_payment_details(payment, receipt)
                receipt_no = receipt.Voucher_Number
                self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
            else:
                print('ygubvieb')
                ip_billing = Interim_Billing_Table_Detials.objects.create(
                    Billing_Date=billing_data.get('InvoiceDate'),
                    Doctor_Id=self.doctor,
                    Patient_Id=self.patient,
                    Register_Id=self.register,
                    Billing_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
                    Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
                    Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
                    Total_Items=int(initial_state.get('totalItems')),
                    Total_Qty=int(initial_state.get('totalUnits', 1)),
                    Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
                    Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
                    Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
                    Net_Paid_Amount=initial_state.get('totalAmountt'),
                    Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
                    Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
                    Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
                    Bill_Status=new_bill_status,
                    created_by=created_by
                )

                print(ip_billing,'ip_billing')
                # Save billing items
                self.save_interim_billing_items(select_data, ip_billing, new_bill_status)
                self.Radiology_Requestlink_InterimBilling(select_data,ip_billing,new_bill_status,created_by)
            # self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType,Request_Id,paytype)
            # self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
            self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType,Request_Id,paytype)
            self.Lab_Request_Detailslink_Billing(new_select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,Request_Id)

            print('ubufbbr')
            formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
            print('jhbsv')
            return JsonResponse({
                'status': 'success',
                'message': 'Billing details saved successfully',
                'InvoiceNo': ip_billing.Billing_Invoice_No,
                'InvoiceDate': formatted_date,
                'ReceiptNo': receipt_no
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request):
        try:
            search_params = {
                'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
                'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
                'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
                'DateType': request.GET.get('DateType'),
                'CurrentDate': request.GET.get('CurrentDate'),
                'FromDate': request.GET.get('FromDate'),
                'ToDate': request.GET.get('ToDate'),
                'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
                'SearchStatus': request.GET.get('SearchStatus')
            }

            query = self.build_search_query(search_params)
            billing_data = IP_Billing_Table_Detials.objects.filter(query)
            
            if search_params['SearchTimeOrderby']:
                billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

            response_data = self.format_billing_data(billing_data)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def build_search_query(self, params):
        query = Q()
        if params['SearchbyFirstName']:
            query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName'])
        if params['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
        if params['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
        if params['SearchStatus']:
            query &= Q(Bill_Status=params['SearchStatus'])

        # Date filtering
        if params['DateType'] == "Current" and params['CurrentDate']:
            query &= Q(created_at__date=params['CurrentDate'])
        elif params['DateType'] == "Customize":
            if params['FromDate'] and params['ToDate']:
                query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
            elif params['FromDate']:
                query &= Q(created_at__date__gte=params['FromDate'])
            elif params['ToDate']:
                query &= Q(created_at__date__lte=params['ToDate'])

        return query

    def apply_ordering(self, queryset, order_param):
        if order_param.lower() == 'order':
            return queryset.order_by('created_at')
        elif order_param.lower() == 'disorder':
            return queryset.order_by('-created_at')
        return queryset

    def format_billing_data(self, billing_queryset):
        response_data = []
        for row in billing_queryset:
            billing_details = self.get_billing_details(row)
            response_data.append(billing_details)
        return response_data




# @method_decorator(csrf_exempt, name='dispatch')
# class IPBillingEstimatedLinkView(View):
#     def __init__(self):
#         self.doctor = None
#         self.patient = None
#         self.register = None

#     def safe_to_decimal(self, value, default=0.00):
#         try:
#             return Decimal(value)
#         except (InvalidOperation, TypeError, ValueError):
#             return Decimal(default)

#     def get_related_objects(self, data):
#         """Get required foreign key objects"""
#         try:
#             self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
#             self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
#             self.register = Patient_IP_Registration_Detials.objects.get(
#                 Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
#             )
#             return True
#         except Doctor_Personal_Form_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Doctor not found'})
#         except Patient_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Patient not found'})
#         except Patient_IP_Registration_Detials.DoesNotExist:
#             return JsonResponse({'error': 'Registration not found'})

#     def save_billing_items(self, items, billing,new_bill_status,Deleteditem):
#         """Save billing items"""
#         for item in items:

#             try:
#                 IP_Billing_Estimated_Items_Table_Detials.objects.create(
#                     Billing_Invoice_No=billing,
#                     Service_Type=item.get('ServiceType'),
#                     Service_Code=item.get('servicecode'),
#                     Service_Name=item.get('SelectItemName'),
#                     Rate=self.safe_to_decimal(item.get('Rate')),
#                     Charge=self.safe_to_decimal(item.get('Charges')),
#                     Quantity=item.get('Quantity', 1),
#                     Amount=self.safe_to_decimal(item.get('Amount')),
#                     Discount_Type=item.get('Discountmethod'),
#                     Discount_Value=self.safe_to_decimal(item.get('Discountval')),
#                     Discount_Amount=self.safe_to_decimal(item.get('Discount')),
#                     Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
#                     Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
#                     Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
#                     Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
#                     Voucher_No=item.get('VoucherNo',""),
#                     Date=item.get('Date',""),
#                     Item_Status=new_bill_status,
#                     IsReimbursable=item.get('isReimbursable')
#                 )

#             except Exception as e:

#                 print(str(e),'err')

#         for delitem in Deleteditem:

#             if delitem.get('ServiceType') == "RADIOLOGY":

#                 radins = Radiology_Request_Details.objects.filter(Radiology_RequestId = delitem.get('Requestid')).first()
#                 radins.Status = 'Canceled'
#                 radins.save()

#             if delitem.get('ServiceType') == "LAB":

#                 labins = Interim_Billing_Items_Table_Detials.objects.filter(Items_Id = delitem.get('Requestid')).first()
#                 labins.Item_Status = 'Canceled'
#                 labins.save()

#     def post(self, request):
#         try:
#             data = json.loads(request.body)
            
#             # Get related objects
#             related_objects = self.get_related_objects(data)
#             if isinstance(related_objects, JsonResponse):
#                 return related_objects

#             # Extract data
#             initial_state = data.get('initialState', {})
#             select_data = data.get('SelectDatalist', [])
#             billing_data = data.get('BillingData', {})
#             created_by = data.get('Created_by', '')
#             new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
#             Location = data.get('Location', '')
#             Status = data.get('Status')
#             RefundAmount = data.get('RefundAmount')
#             AdvanceTotal = data.get('AdvanceTotal')
#             receipt_no = None
#             Deleteditem = data.get('Deleteditem')
#             # Create IP Billing record
#             ip_billing = IP_Billing_Estimated_Table_Detials.objects.create(
#                 Billing_Date=billing_data.get('InvoiceDate'),
#                 Doctor_Id=self.doctor,
#                 Patient_Id=self.patient,
#                 Register_Id=self.register,
#                 Billing_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
#                 Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
#                 Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
#                 Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
#                 Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
#                 Total_Items=int(initial_state.get('totalItems')),
#                 Total_Qty=int(initial_state.get('totalUnits', 1)),
#                 Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
#                 Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
#                 Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
#                 Net_Paid_Amount=initial_state.get('totalAmountt'),
#                 Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
#                 Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
#                 Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
#                 Refund_Amount = self.safe_to_decimal(RefundAmount) if Decimal(RefundAmount) > 0 else 0.00,
#                 Receivable_Amount = self.safe_to_decimal(RefundAmount) if Decimal(RefundAmount) < 0 else 0.00,
#                 Advance_Amount = self.safe_to_decimal(AdvanceTotal) if Decimal(AdvanceTotal) else 0.00,
#                 Bill_Status=Status,
#                 created_by=created_by
#             )

#             # Save billing items
#             self.save_billing_items(select_data, ip_billing, new_bill_status,Deleteditem)
        
#             # self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
#             # self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
#             # self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType)

#             print('ubufbbr')
            
#             formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
#             ip_billing_que = IP_Billing_QueueList_Detials.objects.get(Registration_Id = self.register)
#             ip_billing_que.Status = 'Estimated'
#             ip_billing_que.save()
#             print('jhbsv')
#             return JsonResponse({
#                 'status': 'success',
#                 'message': 'Billing details saved successfully',
#                 'InvoiceNo': ip_billing.Billing_Invoice_No,
#                 'InvoiceDate': formatted_date,
#                 'ReceiptNo': receipt_no
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def get(self, request):
#         try:
#             search_params = {
#                 'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
#                 'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
#                 'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
#                 'DateType': request.GET.get('DateType'),
#                 'CurrentDate': request.GET.get('CurrentDate'),
#                 'FromDate': request.GET.get('FromDate'),
#                 'ToDate': request.GET.get('ToDate'),
#                 'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
#                 'SearchStatus': request.GET.get('SearchStatus')
#             }

#             query = self.build_search_query(search_params)
#             billing_data = IP_Billing_Estimated_Table_Detials.objects.filter(query)
            
#             if search_params['SearchTimeOrderby']:
#                 billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

#             response_data = self.format_billing_data(billing_data)
#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def build_search_query(self, params):
#         query = Q()
#         if params['SearchbyFirstName']:
#             query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName']) | Q(Register_Id__Registration_Id__iexact=f"""{'IP'}{params['SearchbyFirstName']}""")
#         if params['SearchbySpeciality']:
#             query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
#         if params['SearchbyDoctor']:
#             query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
#         if params['SearchStatus']:
#             query &= Q(Bill_Status=params['SearchStatus'])

#         # Date filtering
#         if params['DateType'] == "Current" and params['CurrentDate']:
#             query &= Q(created_at__date=params['CurrentDate'])
#         elif params['DateType'] == "Customize":
#             if params['FromDate'] and params['ToDate']:
#                 query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
#             elif params['FromDate']:
#                 query &= Q(created_at__date__gte=params['FromDate'])
#             elif params['ToDate']:
#                 query &= Q(created_at__date__lte=params['ToDate'])

#         return query

#     def apply_ordering(self, queryset, order_param):
#         if order_param.lower() == 'order':
#             return queryset.order_by('created_at')
#         elif order_param.lower() == 'disorder':
#             return queryset.order_by('-created_at')
#         return queryset

#     def get_estimated_item_details(self,row):
#         bill_items_list = []
#         bill_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = row.Billing_Invoice_No)
#         for item in bill_items:
#             item_details = {
#                 'Service_Type': item.Service_Type,
#                 'Service_Name': item.Service_Name,
#                 'Rate': item.Rate,
#                 'Charge': item.Charge,
#                 'Quantity': item.Quantity,
#                 'Amount': item.Amount,
#                 'DiscountType': item.Discount_Type,
#                 'Discount_Value': item.Discount_Value,
#                 'Discount_Amount': item.Discount_Amount,
#                 'Taxable_Amount': item.Taxable_Amount,
#                 'Tax_Percentage': item.Tax_Percentage,
#                 'Tax_Amount': item.Tax_Amount,
#                 'Total_Amount': item.Total_Amount,
#                 'IsReimbursable' : item.IsReimbursable,
#                 'VoucherNo' : item.Voucher_No,
#                 'Date' : item.Date,
#                 'Discount_Type': f"{int(float(item.Discount_Value)) if float(item.Discount_Value).is_integer() else item.Discount_Value}%"
#                 }
#             bill_items_list.append(item_details)
#         return bill_items_list
    
#     def format_billing_data(self, billing_queryset):
#         response_data = []
#         for row in billing_queryset:    
#             billing_details = self.get_billing_details(row)
#             bill_items = self.get_estimated_item_details(row)
#             billing_details['Estimated_Items'] = bill_items  # ✅ Add items as a key
#             response_data.append(billing_details)
#         return response_data

#     def get_billing_details(self,row):
#         # ⚠️ Assumed to exist in your code — sample structure:
#         patient = row.Patient_Id
#         room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id.Registration_Id).last()

#         ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#         floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#         bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

#         full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
#         formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
#         doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Id.Doctor_ID).first()

#         # Category
#         # if row.Registration_Id.PatientCategory == 'Insurance':
#         #     categoryname = row.Registration_Id.InsuranceName.Insurance_Name
#         #     categoryid = row.Registration_Id.InsuranceName.Insurance_Id
#         # elif row.Registration_Id.PatientCategory == 'Client':
#         #     categoryname = row.Registration_Id.ClientName.Client_Name
#         #     categoryid = row.Registration_Id.ClientName.Client_Id
#         # else:
#         #     categoryname = None
#         #     categoryid = None
        
#         return{
#             'id': row.pk,
#             'VisitType': 'IP',
#             'Type': "IPEstimated",
#             'Status': row.Bill_Status,
#             'Date': formatted_date,
#             'Registration_Id': row.Register_Id.Registration_Id,
#             'PatientId': patient.PatientId,
#             'PhoneNo': patient.PhoneNo,
#             'Patient_Name': full_name,
#             'Address': ', '.join(filter(None, [
#                 patient.DoorNo,
#                 patient.Street,
#                 patient.Area,
#                 patient.City,
#                 patient.State,
#                 patient.Country,
#                 patient.Pincode
#             ])) or "No address available",
#             'AgeGender': f'{patient.Age}/{patient.Gender}',
#             'PatientCategory': row.Register_Id.PatientCategory,
#             'Doctor_ShortName': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Id else None,
#             'Doctor_Id': row.Doctor_Id.Doctor_ID if row.Doctor_Id else None,
#             'Title': patient.Title.Title_Name,
#             'FirstName': patient.FirstName,
#             'MiddleName': patient.MiddleName,
#             'SurName': patient.SurName,
#             'Gender': patient.Gender,
#             'DOB': patient.DOB,
#             'Age': patient.Age,
#             'Email': patient.Email,
#             'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
#             'Occupation': patient.Occupation,
#             'Religion': patient.Religion.Religion_Id if patient.Religion else None,
#             'Nationality': patient.Nationality,
#             'UniqueIdType': patient.UniqueIdType,
#             'UniqueIdNo': patient.UniqueIdNo,
#             'Complaint': row.Register_Id.Complaint,
#             # 'PatientCategoryName': categoryname,
#             # 'PatientCategoryId': categoryid,
#             'DoorNo': patient.DoorNo,
#             'Street': patient.Street,
#             'Area': patient.Area,
#             'City': patient.City,
#             'State': patient.State,
#             'Country': patient.Country,
#             'Pincode': patient.Pincode,
#             'WardName': ward_name,
#             'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
#             'AdmittionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
#             'Discharge_Date': room_detail.Discharge_Date.strftime('%d-%m-%Y %I:%M %p') if room_detail.Discharge_Date else "",
#             'AdvanceAmount': row.Advance_Amount,
#             'TotalAmount': row.Total_Amount,
#             'totalItems': row.Total_Items,
#             'TotalQty': row.Total_Qty,
#             'Net_Amount': row.Net_Amount,
#             'RefundedAmount': row.Refund_Amount,
#             'ReceivableAmount': row.Receivable_Amount,
#             'DiscountType': row.Discount_Type,
#             'DiscountValue': row.Discount_Value,
#             # 'DiscountAmount': row.Discount_Amount,
#         }


@method_decorator(csrf_exempt, name='dispatch')
class IPBillingEstimatedLinkView(View):
    def __init__(self):
        self.doctor = None
        self.patient = None
        self.register = None

    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)

    def get_related_objects(self, data):
        """Get required foreign key objects"""
        try:
            self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
            self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
            self.register = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
            )
            return True
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Registration not found'})

    def save_billing_items(self, items, billing,new_bill_status,Deleteditem):
        """Save billing items"""
        for item in items:

            try:
                IP_Billing_Estimated_Items_Table_Detials.objects.create(
                    Billing_Invoice_No=billing,
                    Service_Type=item.get('ServiceType'),
                    Service_Code=item.get('servicecode'),
                    Service_Name=item.get('SelectItemName'),
                    Rate=self.safe_to_decimal(item.get('Rate')),
                    Charge=self.safe_to_decimal(item.get('Charges')),
                    Quantity=item.get('Quantity', 1),
                    Amount=self.safe_to_decimal(item.get('Amount')),
                    Discount_Type=item.get('Discountmethod'),
                    Discount_Value=self.safe_to_decimal(item.get('Discountval')),
                    Discount_Amount=self.safe_to_decimal(item.get('Discount')),
                    Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                    Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                    Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
                    Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                    Voucher_No=item.get('VoucherNo',""),
                    Date=item.get('Date',""),
                    Item_Status=new_bill_status,
                    IsReimbursable=item.get('isReimbursable'),
                    CGHS_CODE = item.get('CGHScode')
                )

            except Exception as e:

                print(str(e),'err')

        for delitem in Deleteditem:

            if delitem.get('ServiceType') == "RADIOLOGY":

                radins = Radiology_Request_Details.objects.filter(Radiology_RequestId = delitem.get('Requestid')).first()
                radins.Status = 'Canceled'
                radins.save()

            if delitem.get('ServiceType') == "LAB":

                labins = Interim_Billing_Items_Table_Detials.objects.filter(Items_Id = delitem.get('Requestid')).first()
                labins.Item_Status = 'Canceled'
                labins.save()

    # def post(self, request):
    #     try:
    #         data = json.loads(request.body)
            
    #         # Get related objects
    #         related_objects = self.get_related_objects(data)
    #         if isinstance(related_objects, JsonResponse):
    #             return related_objects

    #         # Extract data
    #         initial_state = data.get('initialState', {})
    #         select_data = data.get('SelectDatalist', [])
    #         billing_data = data.get('BillingData', {})
    #         created_by = data.get('Created_by', '')
    #         new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
    #         Location = data.get('Location', '')
    #         Status = data.get('Status')
    #         RefundAmount = data.get('RefundAmount')
    #         AdvanceTotal = data.get('AdvanceTotal')
    #         receipt_no = None
    #         Deleteditem = data.get('Deleteditem')
    #         # Create IP Billing record


    #         ip_billing = IP_Billing_Estimated_Table_Detials.objects.create(
    #             Billing_Date=billing_data.get('InvoiceDate'),
    #             Doctor_Id=self.doctor,
    #             Patient_Id=self.patient,
    #             Register_Id=self.register,
    #             Billing_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
    #             Select_Discount=data.get('NetAmount_CDmethod', {}).get('Method'),
    #             Discount_Type=data.get('NetAmount_CDmethod', {}).get('Method'),
    #             Discount_Value=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount',0.00)),
    #             Discount_Amount=self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount',0.00)),
    #             Total_Items=int(initial_state.get('totalItems')),
    #             Total_Qty=int(initial_state.get('totalUnits', 1)),
    #             Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable')),
    #             Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount')),
    #             Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount')),
    #             Net_Paid_Amount=initial_state.get('totalAmountt'),
    #             Round_Off=self.safe_to_decimal(initial_state.get('Roundoff')),
    #             Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount')),
    #             Balance_Amount=self.safe_to_decimal(initial_state.get('BalanceAmount')),
    #             Refund_Amount = self.safe_to_decimal(RefundAmount) if Decimal(RefundAmount) > 0 else 0.00,
    #             Receivable_Amount = self.safe_to_decimal(RefundAmount) if Decimal(RefundAmount) < 0 else 0.00,
    #             Advance_Amount = self.safe_to_decimal(AdvanceTotal) if Decimal(AdvanceTotal) else 0.00,
    #             Bill_Status=Status,
    #             created_by=created_by
    #         )




    #         # Save billing items
    #         self.save_billing_items(select_data, ip_billing, new_bill_status,Deleteditem)
        
    #         # self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
    #         # self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
    #         # self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType)

    #         print('ubufbbr')
            
    #         formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
    #         ip_billing_que = IP_Billing_QueueList_Detials.objects.get(Registration_Id = self.register)
    #         ip_billing_que.Status = 'Estimated'
    #         ip_billing_que.save()
    #         print('jhbsv')
    #         return JsonResponse({
    #             'status': 'success',
    #             'message': 'Billing details saved successfully',
    #             'InvoiceNo': ip_billing.Billing_Invoice_No,
    #             'InvoiceDate': formatted_date,
    #             'ReceiptNo': receipt_no
    #         })

    #     except Exception as e:
    #         return JsonResponse({'error': str(e)}, status=500)

    def post(self, request):
        try:
            data = json.loads(request.body)
            
            # Get related objects
            related_objects = self.get_related_objects(data)
            if isinstance(related_objects, JsonResponse):
                return related_objects

            # Extract data with proper defaults
            initial_state = data.get('initialState', {})
            select_data = data.get('SelectDatalist', [])
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
            net_amount_method = data.get('NetAmount_CDmethod', {})
            
            # Calculate bill status
            balance_amount = self.safe_to_decimal(initial_state.get('BalanceAmount', '0.00'))
            new_bill_status = 'Paid' if balance_amount == Decimal('0.00') else 'Due'
            
            # Extract other fields with safe defaults
            location = data.get('Location', '')
            status = data.get('Status')
            refund_amount = data.get('RefundAmount', '0.00')
            advance_total = data.get('AdvanceTotal', '0.00')
            receipt_no = None
            deleted_items = data.get('Deleteditem', [])
            
            
            prev_bill = IP_Billing_Estimated_Table_Detials.objects.filter(
                Billing_Date=billing_data.get('InvoiceDate'),
                Patient_Id=self.patient,
                Register_Id=self.register
            ).order_by('-created_at').first()

            if prev_bill:

                total_taxable = self.safe_to_decimal(initial_state.get('totalTaxable'))
                total_net_amount = self.safe_to_decimal(initial_state.get('totalNetAmount'))
                total_amount = self.safe_to_decimal(initial_state.get('totalAmountt'))
                paid_amount = self.safe_to_decimal(initial_state.get('PaidAmount'))
                
                prev_total = self.safe_to_decimal(prev_bill.Total_Amount)
                prev_net = self.safe_to_decimal(prev_bill.Net_Amount)
                prev_net_paid = self.safe_to_decimal(prev_bill.Net_Paid_Amount)
                prev_paid = self.safe_to_decimal(prev_bill.Paid_Amount)
                
                is_duplicate = (
                    prev_total == total_taxable and
                    prev_net == total_net_amount and
                    prev_net_paid == total_amount and
                    prev_paid == paid_amount and
                    prev_bill.created_by == created_by
                )
                
                if is_duplicate:
                    return JsonResponse({
                        'status': 'warn',
                        'message': 'Duplicate billing entry detected'
                    }, status=400)


            # Create IP Billing record with proper null checks
            refund_decimal = self.safe_to_decimal(refund_amount)
            advance_decimal = self.safe_to_decimal(advance_total)
            
            ip_billing = IP_Billing_Estimated_Table_Detials.objects.create(
                Billing_Date=billing_data.get('InvoiceDate'),
                Doctor_Id=self.doctor,
                Patient_Id=self.patient,
                Register_Id=self.register,
                Billing_Type=net_amount_method.get('Method'),
                Select_Discount=net_amount_method.get('Method'),
                Discount_Type=net_amount_method.get('Method'),
                Discount_Value=self.safe_to_decimal(net_amount_method.get('Amount', '0.00')),
                Discount_Amount=self.safe_to_decimal(net_amount_method.get('totalDiscount', '0.00')),
                Total_Items=int(initial_state.get('totalItems', 0)),
                Total_Qty=int(initial_state.get('totalUnits', 1)),
                Total_Amount=self.safe_to_decimal(initial_state.get('totalTaxable', '0.00')),
                Total_GSTAmount=self.safe_to_decimal(initial_state.get('totalGstamount', '0.00')),
                Net_Amount=self.safe_to_decimal(initial_state.get('totalNetAmount', '0.00')),
                Net_Paid_Amount=initial_state.get('totalAmountt', '0.00'),
                Round_Off=self.safe_to_decimal(initial_state.get('Roundoff', '0.00')),
                Paid_Amount=self.safe_to_decimal(initial_state.get('PaidAmount', '0.00')),
                Balance_Amount=balance_amount,
                Refund_Amount=refund_decimal if refund_decimal > Decimal('0.00') else Decimal('0.00'),
                Receivable_Amount=abs(refund_decimal) if refund_decimal < Decimal('0.00') else Decimal('0.00'),
                Advance_Amount=advance_decimal if advance_decimal else Decimal('0.00'),
                Bill_Status=status,
                created_by=created_by
            )

            # Save billing items
            self.save_billing_items(select_data, ip_billing, new_bill_status, deleted_items)
            
            # Update billing queue status
            ip_billing_queue = IP_Billing_QueueList_Detials.objects.get(Registration_Id=self.register)
            ip_billing_queue.Status = 'Estimated'
            ip_billing_queue.save()
            
            # Format date for response
            formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
            
            return JsonResponse({
                'status': 'success',
                'message': 'Billing details saved successfully',
                'InvoiceNo': ip_billing.Billing_Invoice_No,
                'InvoiceDate': formatted_date,
                'ReceiptNo': receipt_no
            })

        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON format', 'details': str(e)}, status=400)
        except IP_Billing_QueueList_Detials.DoesNotExist:
            return JsonResponse({'error': 'Billing queue entry not found'}, status=404)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except Exception as e:
            # Log the exception for debugging

            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



    def get(self, request):
        try:
            search_params = {
                'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
                'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
                'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
                'DateType': request.GET.get('DateType'),
                'CurrentDate': request.GET.get('CurrentDate'),
                'FromDate': request.GET.get('FromDate'),
                'ToDate': request.GET.get('ToDate'),
                'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
                'SearchStatus': request.GET.get('SearchStatus')
            }

            query = self.build_search_query(search_params)
            billing_data = IP_Billing_Estimated_Table_Detials.objects.filter(query)
            
            if search_params['SearchTimeOrderby']:
                billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

            response_data = self.format_billing_data(billing_data)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def build_search_query(self, params):
        query = Q()
        if params['SearchbyFirstName']:
            query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName']) | Q(Register_Id__Registration_Id__iexact=f"""{'IP'}{params['SearchbyFirstName']}""")
        if params['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
        if params['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
        if params['SearchStatus']:
            query &= Q(Bill_Status=params['SearchStatus'])

        # Date filtering
        if params['DateType'] == "Current" and params['CurrentDate']:
            query &= Q(created_at__date=params['CurrentDate'])
        elif params['DateType'] == "Customize":
            if params['FromDate'] and params['ToDate']:
                query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
            elif params['FromDate']:
                query &= Q(created_at__date__gte=params['FromDate'])
            elif params['ToDate']:
                query &= Q(created_at__date__lte=params['ToDate'])

        return query

    def apply_ordering(self, queryset, order_param):
        if order_param.lower() == 'order':
            return queryset.order_by('created_at')
        elif order_param.lower() == 'disorder':
            return queryset.order_by('-created_at')
        return queryset

    def get_estimated_item_details(self,row):
        bill_items_list = []
        bill_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = row.Billing_Invoice_No)
        for item in bill_items:
            item_details = {
                'Service_Type': item.Service_Type,
                'Service_Name': item.Service_Name,
                'Rate': item.Rate,
                'Charge': item.Charge,
                'Quantity': item.Quantity,
                'Amount': item.Amount,
                'DiscountType': item.Discount_Type,
                'Discount_Value': item.Discount_Value,
                'Discount_Amount': item.Discount_Amount,
                'Taxable_Amount': item.Taxable_Amount,
                'Tax_Percentage': item.Tax_Percentage,
                'Tax_Amount': item.Tax_Amount,
                'Total_Amount': item.Total_Amount,
                'IsReimbursable' : item.IsReimbursable,
                'VoucherNo' : item.Voucher_No,
                'Date' : item.Date,
                'Discount_Type': f"{int(float(item.Discount_Value)) if float(item.Discount_Value).is_integer() else item.Discount_Value}%",
                'CGHScode' : item.CGHS_CODE
                }
            bill_items_list.append(item_details)
        return bill_items_list
    
    def format_billing_data(self, billing_queryset):
        response_data = []
        for row in billing_queryset:    
            billing_details = self.get_billing_details(row)
            bill_items = self.get_estimated_item_details(row)
            billing_details['Estimated_Items'] = bill_items  # ✅ Add items as a key
            response_data.append(billing_details)
        return response_data

    def get_billing_details(self,row):
        # ⚠️ Assumed to exist in your code — sample structure:
        patient = row.Patient_Id
        room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id.Registration_Id).last()

        ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

        full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
        formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
        doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Id.Doctor_ID).first()

        # Category
        # if row.Registration_Id.PatientCategory == 'Insurance':
        #     categoryname = row.Registration_Id.InsuranceName.Insurance_Name
        #     categoryid = row.Registration_Id.InsuranceName.Insurance_Id
        # elif row.Registration_Id.PatientCategory == 'Client':
        #     categoryname = row.Registration_Id.ClientName.Client_Name
        #     categoryid = row.Registration_Id.ClientName.Client_Id
        # else:
        #     categoryname = None
        #     categoryid = None
        
        return{
            'id': row.pk,
            'VisitType': 'IP',
            'Type': "IPEstimated",
            'Status': row.Bill_Status,
            'Date': formatted_date,
            'Registration_Id': row.Register_Id.Registration_Id,
            'PatientId': patient.PatientId,
            'PhoneNo': patient.PhoneNo,
            'Patient_Name': full_name,
            'Address': ', '.join(filter(None, [
                patient.DoorNo,
                patient.Street,
                patient.Area,
                patient.City,
                patient.State,
                patient.Country,
                patient.Pincode
            ])) or "No address available",
            'AgeGender': f'{patient.Age}/{patient.Gender}',
            'PatientCategory': row.Register_Id.PatientCategory,
            'Doctor_ShortName': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Id else None,
            'Doctor_Id': row.Doctor_Id.Doctor_ID if row.Doctor_Id else None,
            'Title': patient.Title.Title_Name,
            'FirstName': patient.FirstName,
            'MiddleName': patient.MiddleName,
            'SurName': patient.SurName,
            'Gender': patient.Gender,
            'DOB': patient.DOB,
            'Age': patient.Age,
            'Email': patient.Email,
            'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
            'Occupation': patient.Occupation,
            'Religion': patient.Religion.Religion_Id if patient.Religion else None,
            'Nationality': patient.Nationality,
            'UniqueIdType': patient.UniqueIdType,
            'UniqueIdNo': patient.UniqueIdNo,
            'Complaint': row.Register_Id.Complaint,
            # 'PatientCategoryName': categoryname,
            # 'PatientCategoryId': categoryid,
            'DoorNo': patient.DoorNo,
            'Street': patient.Street,
            'Area': patient.Area,
            'City': patient.City,
            'State': patient.State,
            'Country': patient.Country,
            'Pincode': patient.Pincode,
            'WardName': ward_name,
            'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
            'AdmittionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
            'Discharge_Date': room_detail.Discharge_Date.strftime('%d-%m-%Y %I:%M %p') if room_detail.Discharge_Date else "",
            'AdvanceAmount': row.Advance_Amount,
            'TotalAmount': row.Total_Amount,
            'totalItems': row.Total_Items,
            'TotalQty': row.Total_Qty,
            'Net_Amount': row.Net_Amount,
            'RefundedAmount': row.Refund_Amount,
            'ReceivableAmount': row.Receivable_Amount,
            'DiscountType': row.Discount_Type,
            'DiscountValue': row.Discount_Value,
            # 'DiscountAmount': row.Discount_Amount,
        }



# @method_decorator(csrf_exempt, name='dispatch')
# class IPBillingEstimatedEditLinkView(View):
#     def safe_to_decimal(self, value, default=0.00):
#         try:
#             return Decimal(value)
#         except (InvalidOperation, TypeError, ValueError):
#             return Decimal(default)

#     def save_billing_items(self, items, billing,new_bill_status,Deleteditem):
#         """Save billing items"""
#         IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No = billing).delete()
#         for item in items:
#             IP_Billing_Estimated_Items_Table_Detials.objects.create(
#                 Billing_Invoice_No=billing,
#                 Service_Type=item.get('ServiceType'),
#                 Service_Code=item.get('servicecode'),
#                 Service_Name=item.get('SelectItemName'),
#                 Rate=self.safe_to_decimal(item.get('Rate')),
#                 Charge=self.safe_to_decimal(item.get('Charges')),
#                 Quantity=item.get('Quantity', 1),
#                 Amount=self.safe_to_decimal(item.get('Amount')),
#                 Discount_Type=item.get('Discountmethod'),
#                 Discount_Value=self.safe_to_decimal(item.get('Discountval')),
#                 Discount_Amount=self.safe_to_decimal(item.get('Discount')),
#                 Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
#                 Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
#                 Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
#                 Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
#                 Voucher_No=item.get('VoucherNo',""),
#                 Date=item.get('Date',""),
#                 Item_Status=new_bill_status,
#                 IsReimbursable=item.get('isReimbursable')
#             )

#         for delitem in Deleteditem:

#             if delitem.get('ServiceType') == "RADIOLOGY":

#                 radins = Radiology_Request_Details.objects.filter(Radiology_RequestId = delitem.get('Requestid'),Interim_Billing_Invoice_No_id = delitem.get('VoucherNo')).first()
#                 radins.Status = 'Canceled'
#                 radins.save()

#             if delitem.get('ServiceType') == "LAB":

#                 labins = Interim_Billing_Items_Table_Detials.objects.filter(Items_Id = delitem.get('Requestid'),Billing_Invoice_No_id = delitem.get('VoucherNo')).first()
#                 labins.Item_Status = 'Canceled'
#                 labins.save()
    

#     def post(self, request):
#         try:
#             data = json.loads(request.body)

#             # Extract data
#             initial_state = data.get('initialState', {})
#             select_data = data.get('SelectDatalist', [])
#             billing_data = data.get('BillingData', {})
#             created_by = data.get('Created_by', '')
#             new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
#             Location = data.get('Location', '')
#             Status = data.get('Status')
#             RefundAmount = data.get('RefundAmount')
#             AdvanceTotal = data.get('AdvanceTotal')
#             receipt_no = None
#             editid = data.get('EditId')
#             Deleteditem = data.get('Deleteditem')
#             # Create IP Billing record
#             if editid:
#                 ip_billing = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No=editid)
#                 ip_billing.Billing_Type = data.get('NetAmount_CDmethod', {}).get('Method')  # Remove comma
#                 ip_billing.Select_Discount = data.get('NetAmount_CDmethod', {}).get('Method')  # Remove comma
#                 ip_billing.Discount_Type = data.get('NetAmount_CDmethod', {}).get('Method')  # Remove comma
#                 ip_billing.Discount_Value = self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount', 0.00))  # Remove comma
#                 ip_billing.Discount_Amount = self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount', 0.00))  # Remove comma
#                 ip_billing.Total_Items = int(initial_state.get('totalItems'))
#                 ip_billing.Total_Qty = int(initial_state.get('totalUnits', 1))
#                 ip_billing.Total_Amount = self.safe_to_decimal(initial_state.get('totalTaxable'))
#                 ip_billing.Total_GSTAmount = self.safe_to_decimal(initial_state.get('totalGstamount'))
#                 ip_billing.Net_Amount = self.safe_to_decimal(initial_state.get('totalNetAmount'))
#                 ip_billing.Net_Paid_Amount = initial_state.get('totalAmountt')
#                 ip_billing.Round_Off = self.safe_to_decimal(initial_state.get('Roundoff'))
#                 ip_billing.Paid_Amount = self.safe_to_decimal(initial_state.get('PaidAmount'))
#                 ip_billing.Balance_Amount = self.safe_to_decimal(initial_state.get('BalanceAmount'))
#                 ip_billing.Refund_Amount = self.safe_to_decimal(RefundAmount) if self.safe_to_decimal(RefundAmount) > 0 else 0.00  # Remove comma
#                 ip_billing.Receivable_Amount = self.safe_to_decimal(RefundAmount) if self.safe_to_decimal(RefundAmount) < 0 else 0.00  # Remove comma
#                 ip_billing.Advance_Amount = self.safe_to_decimal(AdvanceTotal) if self.safe_to_decimal(AdvanceTotal) else 0.00  # Remove comma
#                 ip_billing.Bill_Status = Status
#                 ip_billing.created_by = created_by
#                 ip_billing.save()

#                 # Save billing items
#                 self.save_billing_items(select_data, ip_billing, new_bill_status,Deleteditem)
            
#                 # self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
#             # self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
#             # self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType)

#             print('ubufbbr')
            
#             formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
#             print('jhbsv')
#             return JsonResponse({
#                 'status': 'success',
#                 'message': 'Estimated bill details updated successfully',
#                 'InvoiceNo': ip_billing.Billing_Invoice_No,
#                 'InvoiceDate': formatted_date,
#                 'ReceiptNo': receipt_no
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def get(self, request):
#         try:
#             search_params = {
#                 'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
#                 'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
#                 'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
#                 'DateType': request.GET.get('DateType'),
#                 'CurrentDate': request.GET.get('CurrentDate'),
#                 'FromDate': request.GET.get('FromDate'),
#                 'ToDate': request.GET.get('ToDate'),
#                 'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
#                 'SearchStatus': request.GET.get('SearchStatus')
#             }

#             query = self.build_search_query(search_params)
#             billing_data = IP_Billing_Estimated_Table_Detials.objects.filter(query)
            
#             if search_params['SearchTimeOrderby']:
#                 billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

#             response_data = self.format_billing_data(billing_data)
#             return JsonResponse(response_data, safe=False)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     def build_search_query(self, params):
#         query = Q()
#         if params['SearchbyFirstName']:
#             query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName']) | Q(Register_Id__Registration_Id__iexact=f"""{'IP'}{params['SearchbyFirstName']}""")
#         if params['SearchbySpeciality']:
#             query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
#         if params['SearchbyDoctor']:
#             query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
#         if params['SearchStatus']:
#             query &= Q(Bill_Status=params['SearchStatus'])

#         # Date filtering
#         if params['DateType'] == "Current" and params['CurrentDate']:
#             query &= Q(created_at__date=params['CurrentDate'])
#         elif params['DateType'] == "Customize":
#             if params['FromDate'] and params['ToDate']:
#                 query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
#             elif params['FromDate']:
#                 query &= Q(created_at__date__gte=params['FromDate'])
#             elif params['ToDate']:
#                 query &= Q(created_at__date__lte=params['ToDate'])

#         return query

#     def apply_ordering(self, queryset, order_param):
#         if order_param.lower() == 'order':
#             return queryset.order_by('created_at')
#         elif order_param.lower() == 'disorder':
#             return queryset.order_by('-created_at')
#         return queryset

#     def get_estimated_item_details(self,row):
#         bill_items_list = []
#         bill_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = row.Billing_Invoice_No)
#         for item in bill_items:
#             item_details = {
#                 'Service_Type': item.Service_Type,
#                 'Service_Name': item.Service_Name,
#                 'Rate': item.Rate,
#                 'Charge': item.Charge,
#                 'Quantity': item.Quantity,
#                 'Amount': item.Amount,
#                 'Discount_Type': item.Discount_Type,
#                 'Discount_Value': item.Discount_Value,
#                 'Discount_Amount': item.Discount_Amount,
#                 'Taxable_Amount': item.Taxable_Amount,
#                 'Tax_Percentage': item.Tax_Percentage,
#                 'Tax_Amount': item.Tax_Amount,
#                 'Total_Amount': item.Total_Amount,
#                 'IsReimbursable' : item.IsReimbursable,
#                 'VoucherNo' : item.Voucher_No,
#                 'Date' : item.Date,
#                 }
#             bill_items_list.append(item_details)
#         return bill_items_list
#     def format_billing_data(self, billing_queryset):
#         response_data = []
#         for row in billing_queryset:    
#             billing_details = self.get_billing_details(row)
#             bill_items = self.get_estimated_item_details(row)
#             billing_details['Estimated_Items'] = bill_items  # ✅ Add items as a key
#             response_data.append(billing_details)
#         return response_data

#     def get_billing_details(self,row):
#         # ⚠️ Assumed to exist in your code — sample structure:
#         patient = row.Patient_Id
#         room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id.Registration_Id).last()

#         ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#         floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
#         bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

#         full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
#         formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
#         doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Id.Doctor_ID).first()

#         # Category
#         # if row.Registration_Id.PatientCategory == 'Insurance':
#         #     categoryname = row.Registration_Id.InsuranceName.Insurance_Name
#         #     categoryid = row.Registration_Id.InsuranceName.Insurance_Id
#         # elif row.Registration_Id.PatientCategory == 'Client':
#         #     categoryname = row.Registration_Id.ClientName.Client_Name
#         #     categoryid = row.Registration_Id.ClientName.Client_Id
#         # else:
#         #     categoryname = None
#         #     categoryid = None
        
#         return{
#             'id': row.pk,
#             'VisitType': 'IP',
#             'Type': "IPEstimated",
#             'Status': row.Bill_Status,
#             'Date': formatted_date,
#             'Registration_Id': row.Register_Id.Registration_Id,
#             'PatientId': patient.PatientId,
#             'PhoneNo': patient.PhoneNo,
#             'Patient_Name': full_name,
#             'Address': ', '.join(filter(None, [
#                 patient.DoorNo,
#                 patient.Street,
#                 patient.Area,
#                 patient.City,
#                 patient.State,
#                 patient.Country,
#                 patient.Pincode
#             ])) or "No address available",
#             'AgeGender': f'{patient.Age}/{patient.Gender}',
#             'PatientCategory': row.Register_Id.PatientCategory,
#             'Doctor_ShortName': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Id else None,
#             'Doctor_Id': row.Doctor_Id.Doctor_ID if row.Doctor_Id else None,
#             'Title': patient.Title.Title_Name,
#             'FirstName': patient.FirstName,
#             'MiddleName': patient.MiddleName,
#             'SurName': patient.SurName,
#             'Gender': patient.Gender,
#             'DOB': patient.DOB,
#             'Age': patient.Age,
#             'Email': patient.Email,
#             'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
#             'Occupation': patient.Occupation,
#             'Religion': patient.Religion.Religion_Id if patient.Religion else None,
#             'Nationality': patient.Nationality,
#             'UniqueIdType': patient.UniqueIdType,
#             'UniqueIdNo': patient.UniqueIdNo,
#             'Complaint': row.Register_Id.Complaint,
#             # 'PatientCategoryName': categoryname,
#             # 'PatientCategoryId': categoryid,
#             'DoorNo': patient.DoorNo,
#             'Street': patient.Street,
#             'Area': patient.Area,
#             'City': patient.City,
#             'State': patient.State,
#             'Country': patient.Country,
#             'Pincode': patient.Pincode,
#             'WardName': ward_name,
#             'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
#             'AdmittionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
#             'AdvanceAmount': row.Advance_Amount,
#             'TotalAmount': row.Total_Amount,
#             'totalItems': row.Total_Items,
#             'TotalQty': row.Total_Qty,
#             'Net_Amount': row.Net_Amount,
#             'RefundedAmount': row.Refund_Amount,
#             'ReceivableAmount': row.Receivable_Amount,
#             'DiscountType': row.Discount_Type,
#             'DiscountValue': row.Discount_Value,
#             # 'DiscountAmount': row.Discount_Amount,
#         }



@method_decorator(csrf_exempt, name='dispatch')
class IPBillingEstimatedEditLinkView(View):
    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)

    def save_billing_items(self, items, billing,new_bill_status,Deleteditem):
        """Save billing items"""
        IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No = billing).delete()
        for item in items:
            IP_Billing_Estimated_Items_Table_Detials.objects.create(
                Billing_Invoice_No=billing,
                Service_Type=item.get('ServiceType'),
                Service_Code=item.get('servicecode'),
                Service_Name=item.get('SelectItemName'),
                Rate=self.safe_to_decimal(item.get('Rate')),
                Charge=self.safe_to_decimal(item.get('Charges')),
                Quantity=item.get('Quantity', 1),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Type=item.get('Discountmethod'),
                Discount_Value=self.safe_to_decimal(item.get('Discountval')),
                Discount_Amount=self.safe_to_decimal(item.get('Discount')),
                Taxable_Amount=self.safe_to_decimal(item.get('Amount')),
                Tax_Percentage=self.safe_to_decimal(item.get('GST')) if item.get('GST') else Decimal('0.00'),
                Tax_Amount=self.safe_to_decimal(item.get('GSTamount')),
                Total_Amount=self.safe_to_decimal(item.get('NetAmount')),
                Voucher_No=item.get('VoucherNo',""),
                Date=item.get('Date',""),
                Item_Status=new_bill_status,
                IsReimbursable=item.get('isReimbursable'),
                CGHS_CODE = item.get('CGHScode')

            )

        for delitem in Deleteditem:

            if delitem.get('ServiceType') == "RADIOLOGY":

                radins = Radiology_Request_Details.objects.filter(Radiology_RequestId = delitem.get('Requestid'),Interim_Billing_Invoice_No_id = delitem.get('VoucherNo')).first()
                radins.Status = 'Canceled'
                radins.save()

            if delitem.get('ServiceType') == "LAB":

                labins = Interim_Billing_Items_Table_Detials.objects.filter(Items_Id = delitem.get('Requestid'),Billing_Invoice_No_id = delitem.get('VoucherNo')).first()
                labins.Item_Status = 'Canceled'
                labins.save()
    

    def post(self, request):
        try:
            data = json.loads(request.body)

            # Extract data
            initial_state = data.get('initialState', {})
            select_data = data.get('SelectDatalist', [])
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
            new_bill_status='Paid' if self.safe_to_decimal(initial_state.get('BalanceAmount')) == Decimal('0.00') else 'Due'
            Location = data.get('Location', '')
            Status = data.get('Status')
            RefundAmount = data.get('RefundAmount')
            AdvanceTotal = data.get('AdvanceTotal')
            receipt_no = None
            editid = data.get('EditId')
            Deleteditem = data.get('Deleteditem')
            # Create IP Billing record
            if editid:
                ip_billing = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No=editid)
                ip_billing.Billing_Type = data.get('NetAmount_CDmethod', {}).get('Method')  # Remove comma
                ip_billing.Select_Discount = data.get('NetAmount_CDmethod', {}).get('Method')  # Remove comma
                ip_billing.Discount_Type = data.get('NetAmount_CDmethod', {}).get('Method')  # Remove comma
                ip_billing.Discount_Value = self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('Amount', 0.00))  # Remove comma
                ip_billing.Discount_Amount = self.safe_to_decimal(data.get('NetAmount_CDmethod', {}).get('totalDiscount', 0.00))  # Remove comma
                ip_billing.Total_Items = int(initial_state.get('totalItems'))
                ip_billing.Total_Qty = int(initial_state.get('totalUnits', 1))
                ip_billing.Total_Amount = self.safe_to_decimal(initial_state.get('totalTaxable'))
                ip_billing.Total_GSTAmount = self.safe_to_decimal(initial_state.get('totalGstamount'))
                ip_billing.Net_Amount = self.safe_to_decimal(initial_state.get('totalNetAmount'))
                ip_billing.Net_Paid_Amount = initial_state.get('totalAmountt')
                ip_billing.Round_Off = self.safe_to_decimal(initial_state.get('Roundoff'))
                ip_billing.Paid_Amount = self.safe_to_decimal(initial_state.get('PaidAmount'))
                ip_billing.Balance_Amount = self.safe_to_decimal(initial_state.get('BalanceAmount'))
                ip_billing.Refund_Amount = self.safe_to_decimal(RefundAmount) if self.safe_to_decimal(RefundAmount) > 0 else 0.00  # Remove comma
                ip_billing.Receivable_Amount = self.safe_to_decimal(RefundAmount) if self.safe_to_decimal(RefundAmount) < 0 else 0.00  # Remove comma
                ip_billing.Advance_Amount = self.safe_to_decimal(AdvanceTotal) if self.safe_to_decimal(AdvanceTotal) else 0.00  # Remove comma
                ip_billing.Bill_Status = Status
                ip_billing.created_by = created_by
                ip_billing.save()

                # Save billing items
                self.save_billing_items(select_data, ip_billing, new_bill_status,Deleteditem)
            
                # self.Radiology_Requestlink_Billing(select_data,ip_billing,new_bill_status,created_by)
            # self.Lab_Request_Detailslink_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location)
            # self.Lab_Request_Detailslink_Status_Billing(select_data,ip_billing,new_bill_status,SelectedPatient_list,created_by,location,BillingType)

            print('ubufbbr')
            
            formatted_date = ip_billing.created_at.strftime('%d-%m-%Y %I:%M %p')
            print('jhbsv')
            return JsonResponse({
                'status': 'success',
                'message': 'Estimated bill details updated successfully',
                'InvoiceNo': ip_billing.Billing_Invoice_No,
                'InvoiceDate': formatted_date,
                'ReceiptNo': receipt_no
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request):
        try:
            search_params = {
                'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
                'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
                'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
                'DateType': request.GET.get('DateType'),
                'CurrentDate': request.GET.get('CurrentDate'),
                'FromDate': request.GET.get('FromDate'),
                'ToDate': request.GET.get('ToDate'),
                'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
                'SearchStatus': request.GET.get('SearchStatus')
            }

            query = self.build_search_query(search_params)
            billing_data = IP_Billing_Estimated_Table_Detials.objects.filter(query)
            
            if search_params['SearchTimeOrderby']:
                billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])

            response_data = self.format_billing_data(billing_data)
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def build_search_query(self, params):
        query = Q()
        if params['SearchbyFirstName']:
            query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName']) | Q(Register_Id__Registration_Id__iexact=f"""{'IP'}{params['SearchbyFirstName']}""")
        if params['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
        if params['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
        if params['SearchStatus']:
            query &= Q(Bill_Status=params['SearchStatus'])

        # Date filtering
        if params['DateType'] == "Current" and params['CurrentDate']:
            query &= Q(created_at__date=params['CurrentDate'])
        elif params['DateType'] == "Customize":
            if params['FromDate'] and params['ToDate']:
                query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
            elif params['FromDate']:
                query &= Q(created_at__date__gte=params['FromDate'])
            elif params['ToDate']:
                query &= Q(created_at__date__lte=params['ToDate'])

        return query

    def apply_ordering(self, queryset, order_param):
        if order_param.lower() == 'order':
            return queryset.order_by('created_at')
        elif order_param.lower() == 'disorder':
            return queryset.order_by('-created_at')
        return queryset

    def get_estimated_item_details(self,row):
        bill_items_list = []
        bill_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = row.Billing_Invoice_No)
        for item in bill_items:
            item_details = {
                'Service_Type': item.Service_Type,
                'Service_Name': item.Service_Name,
                'Rate': item.Rate,
                'Charge': item.Charge,
                'Quantity': item.Quantity,
                'Amount': item.Amount,
                'Discount_Type': item.Discount_Type,
                'Discount_Value': item.Discount_Value,
                'Discount_Amount': item.Discount_Amount,
                'Taxable_Amount': item.Taxable_Amount,
                'Tax_Percentage': item.Tax_Percentage,
                'Tax_Amount': item.Tax_Amount,
                'Total_Amount': item.Total_Amount,
                'IsReimbursable' : item.IsReimbursable,
                'VoucherNo' : item.Voucher_No,
                'Date' : item.Date,
                'CGHScode' : item.CGHS_CODE
                }
            bill_items_list.append(item_details)
        return bill_items_list
    def format_billing_data(self, billing_queryset):
        response_data = []
        for row in billing_queryset:    
            billing_details = self.get_billing_details(row)
            bill_items = self.get_estimated_item_details(row)
            billing_details['Estimated_Items'] = bill_items  # ✅ Add items as a key
            response_data.append(billing_details)
        return response_data

    def get_billing_details(self,row):
        # ⚠️ Assumed to exist in your code — sample structure:
        patient = row.Patient_Id
        room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id.Registration_Id).last()

        ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

        full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
        formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
        doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Id.Doctor_ID).first()

        # Category
        # if row.Registration_Id.PatientCategory == 'Insurance':
        #     categoryname = row.Registration_Id.InsuranceName.Insurance_Name
        #     categoryid = row.Registration_Id.InsuranceName.Insurance_Id
        # elif row.Registration_Id.PatientCategory == 'Client':
        #     categoryname = row.Registration_Id.ClientName.Client_Name
        #     categoryid = row.Registration_Id.ClientName.Client_Id
        # else:
        #     categoryname = None
        #     categoryid = None
        
        return{
            'id': row.pk,
            'VisitType': 'IP',
            'Type': "IPEstimated",
            'Status': row.Bill_Status,
            'Date': formatted_date,
            'Registration_Id': row.Register_Id.Registration_Id,
            'PatientId': patient.PatientId,
            'PhoneNo': patient.PhoneNo,
            'Patient_Name': full_name,
            'Address': ', '.join(filter(None, [
                patient.DoorNo,
                patient.Street,
                patient.Area,
                patient.City,
                patient.State,
                patient.Country,
                patient.Pincode
            ])) or "No address available",
            'AgeGender': f'{patient.Age}/{patient.Gender}',
            'PatientCategory': row.Register_Id.PatientCategory,
            'Doctor_ShortName': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Id else None,
            'Doctor_Id': row.Doctor_Id.Doctor_ID if row.Doctor_Id else None,
            'Title': patient.Title.Title_Name,
            'FirstName': patient.FirstName,
            'MiddleName': patient.MiddleName,
            'SurName': patient.SurName,
            'Gender': patient.Gender,
            'DOB': patient.DOB,
            'Age': patient.Age,
            'Email': patient.Email,
            'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
            'Occupation': patient.Occupation,
            'Religion': patient.Religion.Religion_Id if patient.Religion else None,
            'Nationality': patient.Nationality,
            'UniqueIdType': patient.UniqueIdType,
            'UniqueIdNo': patient.UniqueIdNo,
            'Complaint': row.Register_Id.Complaint,
            # 'PatientCategoryName': categoryname,
            # 'PatientCategoryId': categoryid,
            'DoorNo': patient.DoorNo,
            'Street': patient.Street,
            'Area': patient.Area,
            'City': patient.City,
            'State': patient.State,
            'Country': patient.Country,
            'Pincode': patient.Pincode,
            'WardName': ward_name,
            'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
            'AdmittionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
            'AdvanceAmount': row.Advance_Amount,
            'TotalAmount': row.Total_Amount,
            'totalItems': row.Total_Items,
            'TotalQty': row.Total_Qty,
            'Net_Amount': row.Net_Amount,
            'RefundedAmount': row.Refund_Amount,
            'ReceivableAmount': row.Receivable_Amount,
            'DiscountType': row.Discount_Type,
            'DiscountValue': row.Discount_Value,
            # 'DiscountAmount': row.Discount_Amount,
        }



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def CGHS_Link(request):

    try:

        data = json.loads(request.body)

        print(data,'data::::')

        refNo = data.get('refNo','')
        refDate = data.get('refDate','')
        employeeId = data.get('employeeId','')
        employeeName = data.get('employeeName','')
        crNo = data.get('crNo','')
        designation =data.get('designation','')
        Relation = data.get('Relation','')
        PostInvoice = data.get('PostInvoice','')
        UMIDNO = data.get('UMIDNO','')


        billins = IP_Billing_Table_Detials.objects.filter(Billing_Invoice_No = PostInvoice).first()

        print(billins,'billins')

        billins.refNo = refNo
        billins.refDate = refDate
        billins.employeeId = employeeId
        billins.employeeName = employeeName
        billins.crNo = crNo
        billins.designation = designation
        billins.Relation = Relation
        billins.UMIDNO = UMIDNO
        billins.save()

        return JsonResponse({'success': 'Datas are Saved Successfully'})


    except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})

    


@method_decorator(csrf_exempt, name='dispatch')
class IPBillingEstimatedReportLinkView(View):
    def __init__(self):
        self.doctor = None
        self.patient = None
        self.register = None
 
    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)
 
    def get_related_objects(self, data):
        """Get required foreign key objects"""
        try:
            self.doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=data.get('BillingData', {}).get('DoctorId'))
            self.patient = Patient_Detials.objects.get(PatientId=data.get('SelectedPatient_list', {}).get('PatientId'))
            self.register = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=data.get('SelectedPatient_list', {}).get('RegisterId')
            )
            return True
        except Doctor_Personal_Form_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'})
        except Patient_Detials.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'})
        except Patient_IP_Registration_Detials.DoesNotExist:
            return JsonResponse({'error': 'Registration not found'})
 
 
 
 
 
 
    def get(self, request):
        try:
            search_params = {
                'SearchbyFirstName': request.GET.get('SearchbyFirstName'),
                'SearchbySpeciality': request.GET.get('SearchbySpeciality'),
                'SearchbyDoctor': request.GET.get('SearchbyDoctor'),
                'DateType': request.GET.get('DateType'),
                'CurrentDate': request.GET.get('CurrentDate'),
                'FromDate': request.GET.get('FromDate'),
                'ToDate': request.GET.get('ToDate'),
                'SearchTimeOrderby': request.GET.get('SearchTimeOrderby'),
                'SearchStatus': request.GET.get('SearchStatus')
            }
 
            query = self.build_search_query(search_params)
            billing_data = IP_Billing_Estimated_Table_Detials.objects.exclude(created_by__in = ['host','admin']).filter(query)
           
            if search_params['SearchTimeOrderby']:
                billing_data = self.apply_ordering(billing_data, search_params['SearchTimeOrderby'])
 
            response_data = self.format_billing_data(billing_data)
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
 
    def build_search_query(self, params):
        query = Q()
        if params['SearchbyFirstName']:
            query &= Q(Register_Id__PatientId__FirstName__icontains=params['SearchbyFirstName']) | Q(Register_Id__Registration_Id__iexact=f"""{'IP'}{params['SearchbyFirstName']}""")
        if params['SearchbySpeciality']:
            query &= Q(Register_Id__Specialization__Speciality_Id__icontains=params['SearchbySpeciality'])
        if params['SearchbyDoctor']:
            query &= Q(Doctor_Id__Doctor_ID__icontains=params['SearchbyDoctor'])
        if params['SearchStatus']:
            query &= Q(Bill_Status__in= [ 'Estimated','Paid','Approved','Due'])
 
        # Date filtering
        if params['DateType'] == "Current" and params['CurrentDate']:
            query &= Q(created_at__date=params['CurrentDate'])
        elif params['DateType'] == "Customize":
            if params['FromDate'] and params['ToDate']:
                query &= Q(created_at__date__range=[params['FromDate'], params['ToDate']])
            elif params['FromDate']:
                query &= Q(created_at__date__gte=params['FromDate'])
            elif params['ToDate']:
                query &= Q(created_at__date__lte=params['ToDate'])
 
        return query
 
    def apply_ordering(self, queryset, order_param):
        if order_param.lower() == 'order':
            return queryset.order_by('created_at')
        elif order_param.lower() == 'disorder':
            return queryset.order_by('-created_at')
        return queryset
 
    def get_estimated_item_details(self,row):
        bill_items_list = []
        bill_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = row.Billing_Invoice_No)
        for item in bill_items:
            item_details = {
                'Service_Type': item.Service_Type,
                'Service_Name': item.Service_Name,
                'Rate': item.Rate,
                'Charge': item.Charge,
                'Quantity': item.Quantity,
                'Amount': item.Amount,
                'DiscountType': item.Discount_Type,
                'Discount_Value': item.Discount_Value,
                'Discount_Amount': item.Discount_Amount,
                'Taxable_Amount': item.Taxable_Amount,
                'Tax_Percentage': item.Tax_Percentage,
                'Tax_Amount': item.Tax_Amount,
                'Total_Amount': item.Total_Amount,
                'IsReimbursable' : item.IsReimbursable,
                'VoucherNo' : item.Voucher_No,
                'Date' : item.Date,
                'Discount_Type': f"{int(float(item.Discount_Value)) if float(item.Discount_Value).is_integer() else item.Discount_Value}%"
                }
            bill_items_list.append(item_details)
        return bill_items_list
   
    def format_billing_data(self, billing_queryset):
        response_data = []
        for row in billing_queryset:    
            billing_details = self.get_billing_details(row)
            bill_items = self.get_estimated_item_details(row)
            billing_details['Estimated_Items'] = bill_items  # ✅ Add items as a key
            response_data.append(billing_details)
        return response_data
 
    def get_billing_details(self,row):
        # ⚠️ Assumed to exist in your code — sample structure:
        patient = row.Patient_Id
        room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id.Registration_Id).last()
 
        ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        floor_name = room_detail.RoomId.Ward_Name.Floor_Name.Floor_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
        bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None
 
        full_name = f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}".strip()
        formatted_date = row.created_at.strftime("%Y-%m-%d") if row.created_at else None
        doc_info = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID=row.Doctor_Id.Doctor_ID).first()
 
        # Category
        # if row.Registration_Id.PatientCategory == 'Insurance':
        #     categoryname = row.Registration_Id.InsuranceName.Insurance_Name
        #     categoryid = row.Registration_Id.InsuranceName.Insurance_Id
        # elif row.Registration_Id.PatientCategory == 'Client':
        #     categoryname = row.Registration_Id.ClientName.Client_Name
        #     categoryid = row.Registration_Id.ClientName.Client_Id
        # else:
        #     categoryname = None
        #     categoryid = None
       
        return{
            'id': row.pk,
            'VisitType': 'IP',
            'Type': "IPEstimated",
            'Status': row.Bill_Status,
            'Date': formatted_date,
            'Registration_Id': row.Register_Id.Registration_Id,
            'PatientId': patient.PatientId,
            'PhoneNo': patient.PhoneNo,
            'Patient_Name': full_name,
            'Address': ', '.join(filter(None, [
                patient.DoorNo,
                patient.Street,
                patient.Area,
                patient.City,
                patient.State,
                patient.Country,
                patient.Pincode
            ])) or "No address available",
            'AgeGender': f'{patient.Age}/{patient.Gender}',
            'PatientCategory': row.Register_Id.PatientCategory,
            'Doctor_ShortName': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}{"("}{doc_info.Qualification}{")"} """if row.Doctor_Id else None,
            'Doctor_Id': row.Doctor_Id.Doctor_ID if row.Doctor_Id else None,
            'Title': patient.Title.Title_Name,
            'FirstName': patient.FirstName,
            'MiddleName': patient.MiddleName,
            'SurName': patient.SurName,
            'Gender': patient.Gender,
            'DOB': patient.DOB,
            'Age': patient.Age,
            'Email': patient.Email,
            'BloodGroup': patient.BloodGroup.BloodGroup_Name if patient.BloodGroup else None,
            'Occupation': patient.Occupation,
            'Religion': patient.Religion.Religion_Id if patient.Religion else None,
            'Nationality': patient.Nationality,
            'UniqueIdType': patient.UniqueIdType,
            'UniqueIdNo': patient.UniqueIdNo,
            'Complaint': row.Register_Id.Complaint,
            # 'PatientCategoryName': categoryname,
            # 'PatientCategoryId': categoryid,
            'DoorNo': patient.DoorNo,
            'Street': patient.Street,
            'Area': patient.Area,
            'City': patient.City,
            'State': patient.State,
            'Country': patient.Country,
            'Pincode': patient.Pincode,
            'WardName': ward_name,
            'ward': f"{floor_name}-{ward_name}-{bedno}" if ward_name and bedno else None,
            'AdmittionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
            'Discharge_Date': room_detail.Discharge_Date.strftime('%d-%m-%Y %I:%M %p') if room_detail.Discharge_Date else "",
            'AdvanceAmount': row.Advance_Amount,
            'TotalAmount': row.Total_Amount,
            'totalItems': row.Total_Items,
            'TotalQty': row.Total_Qty,
            'Net_Amount': row.Net_Amount,
            'RefundedAmount': row.Refund_Amount,
            'ReceivableAmount': row.Receivable_Amount,
            'DiscountType': row.Discount_Type,
            'DiscountValue': row.Discount_Value,
            # 'DiscountAmount': row.Discount_Amount,
        }
 
 
 

@csrf_exempt
def IP_Estimated_Billing_Approve_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        

            # Extract data
            initial_state = data.get('initialState', {})
            select_data = data.get('SelectDatalist', [])
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
            Location = data.get('Location', '')
            Status = data.get('Status')
            RefundAmount = data.get('RefundAmount')
            AdvanceTotal = data.get('AdvanceTotal')
            receipt_no = None
            Actiontype = data.get('ActionType')
            Remarks = data.get('Remarks')
            editid = data.get('EditId')

            if editid and Actiontype == 'Approved':
                estimated_bill = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No = editid)
                estimated_bill.Bill_Status = 'Approved'
                estimated_bill.Remarks = Remarks
                estimated_bill.save()

                estimated_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No = estimated_bill)
                for items in estimated_items:
                    items.Item_Status = 'Approved'
                    items.save()
            
            elif editid and Actiontype == 'Rejected':
                estimated_bill = IP_Billing_Estimated_Table_Detials.objects.get(Billing_Invoice_No = editid)
                estimated_bill.Bill_Status = 'Estimated'
                estimated_bill.Remarks = Remarks
                estimated_bill.save()

                estimated_items = IP_Billing_Estimated_Items_Table_Detials.objects.filter(Billing_Invoice_No = estimated_bill)
                for items in estimated_items:
                    items.Item_Status = 'Estimated'
                    items.save()

            return JsonResponse({"success":f'Estimated Bill {Actiontype} successfully'})
        except Exception as e:
            print('error',str(e))
            return JsonResponse({'error':str(e)})




@method_decorator(csrf_exempt, name='dispatch')
class IPBillingEditLinkView(View):

    def safe_to_decimal(self, value, default=0.00):
        try:
            return Decimal(value)
        except (InvalidOperation, TypeError, ValueError):
            return Decimal(default)

    def get_related_objects(self, BillingData, SelectedPatient_list):
        try:
            doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=BillingData.get('DoctorId'))
        except ObjectDoesNotExist:
            return None, 'Doctor not found'
        except MultipleObjectsReturned:
            return None, 'Multiple doctors found'

        try:
            patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
        except ObjectDoesNotExist:
            return None, 'Patient not found'
        except MultipleObjectsReturned:
            return None, 'Multiple patients found'

        try:
            register = Patient_IP_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
        except ObjectDoesNotExist:
            return None, 'Registration not found'
        except MultipleObjectsReturned:
            return None, 'Multiple registrations found'

        return (doctor, patient, register), None

    def update_general_billing(self, general_billing, data, doctor, patient, register):
        initialState = data['initialState']
        NetAmount_CDmethod = data['NetAmount_CDmethod']
        general_billing.Doctor_Id = doctor
        general_billing.Patient_Id = patient
        general_billing.Register_Id = register
        general_billing.Billing_Type = NetAmount_CDmethod.get('Method')
        general_billing.Select_Discount = NetAmount_CDmethod.get('Method')
        general_billing.Discount_Type = NetAmount_CDmethod.get('Method')
        general_billing.Discount_Value = self.safe_to_decimal(NetAmount_CDmethod.get('Amount'))
        general_billing.Discount_Amount = self.safe_to_decimal(initialState.get('totalDiscount'))
        general_billing.Total_Items = int(initialState.get('totalItems'))
        general_billing.Total_Qty = int(initialState.get('totalUnits', 1))
        general_billing.Total_Amount = self.safe_to_decimal(initialState.get('totalTaxable'))
        general_billing.Total_GSTAmount = self.safe_to_decimal(initialState.get('totalGstamount'))
        general_billing.Net_Amount = self.safe_to_decimal(initialState.get('totalNetAmount'))
        general_billing.Net_Paid_Amount = initialState.get('totalAmountt')
        general_billing.Round_Off = self.safe_to_decimal(initialState.get('Roundoff'))
        general_billing.Paid_Amount = self.safe_to_decimal(initialState.get('PaidAmount'))
        general_billing.Balance_Amount = self.safe_to_decimal(initialState.get('BalanceAmount'))
        general_billing.Refund_Amount = self.safe_to_decimal(data.get('RefundAmount')) if self.safe_to_decimal(data.get('RefundAmount')) > 0 else 0.00
        general_billing.Advance_Amount = self.safe_to_decimal(data.get('AdvanceTotal'))  if self.safe_to_decimal(data.get('AdvanceTotal')) else 0.00 
        general_billing.Receivable_Amount = self.safe_to_decimal(initialState.get('BalanceAmount'))  if self.safe_to_decimal(data.get('RefundAmount')) < 0 else 0.00
        general_billing.Bill_Status = "Paid" if initialState.get('BalanceAmount') == '0.00' else 'Due'
        general_billing.created_by = data['Created_by']
        general_billing.save()

    def update_billing_items(self, editid, newitemslist, removeditemslist):
        for delete in removeditemslist:
            IP_Billing_Items_Table_Detials.objects.filter(Items_Id=delete.get('Requestid')).update(Item_Status='Canceled')

        for item in newitemslist:
            IP_Billing_Items_Table_Detials.objects.create(
                Billing_Invoice_No_id=editid,
                Service_Type=item.get('ServiceType'),
                Service_Code=item.get('Service_Code'),
                Service_Name=item.get('SelectItemName'),
                Rate=self.safe_to_decimal(item.get('Rate')),
                Charge=self.safe_to_decimal(item.get('Charge')),
                Quantity=item.get('Quantity', 1),
                Amount=self.safe_to_decimal(item.get('Amount')),
                Discount_Type=item.get('Discount_Type'),
                Discount_Value=self.safe_to_decimal(item.get('Discount_Value')),
                Discount_Amount=self.safe_to_decimal(item.get('Discount_Amount')),
                Taxable_Amount=self.safe_to_decimal(item.get('Taxable_Amount')),
                Tax_Percentage=self.safe_to_decimal(item.get('Tax_Percentage')) if item.get('GST') else Decimal('0.00'),
                Tax_Amount=self.safe_to_decimal(item.get('Tax_Amount')),
                Total_Amount=self.safe_to_decimal(item.get('Total_Amount')),
                Item_Status="Paid",
                IsReimbursable=item.get('IsReimbursable'),
            )

    def update_receipt(self, editid, data):
        initialState = data['initialState']
        receipt = IPBillingReceipt.objects.filter(Invoice_NO_id=editid).first()
        receipt.BalanceAmount = self.safe_to_decimal(initialState.get('BalanceAmount'))
        receipt.PaidAmount = self.safe_to_decimal(initialState.get('PaidAmount')) if data.get('AmountStatus') == 'Pay' else self.safe_to_decimal(initialState.get('totalNetAmount'))
        receipt.TotalPaidAmount = self.safe_to_decimal(initialState.get('PaidAmount')) if data.get('AmountStatus') == 'Pay' else self.safe_to_decimal(initialState.get('totalNetAmount'))
        receipt.TotalAmount = self.safe_to_decimal(initialState.get('totalNetAmount')) if data.get('AmountStatus') == 'Pay' else self.safe_to_decimal(initialState.get('totalNetAmount'))
        receipt.save()
        return receipt

    def create_refund_receipt(self, editid, data):
        initialState = data['initialState']
        receipt = IPBillingRefundReceipt.objects.filter(Invoice_NO__Invoice_NO_id=editid).first()
        # receipt.BalanceAmount = self.safe_to_decimal(initialState.get('BalanceAmount'))
        receipt.PaidAmount = self.safe_to_decimal(data.get('RefundAmount')) if self.safe_to_decimal(data.get('RefundAmount')) > 0 else 0.00
        receipt.TotalPaidAmount = self.safe_to_decimal(data.get('RefundAmount')) if self.safe_to_decimal(data.get('RefundAmount')) > 0 else 0.00
        receipt.TotalAmount = self.safe_to_decimal(data.get('RefundAmount')) if self.safe_to_decimal(data.get('RefundAmount')) > 0 else 0.00
        receipt.save()
        return receipt

    def update_payment_details(self, receipt, billAmount):
        for payment in billAmount:
            multiple_payment = Multiple_Payment_Table_IP_Detials.objects.filter(
                Invoice_No=receipt,
                Payment_Type=payment.get('Billpay_method')
            ).first()

            if multiple_payment:
                multiple_payment.Cart_Type = payment.get('CardType')
                multiple_payment.Card_No = payment.get('CardNo')
                multiple_payment.TransactionId = payment.get('TransactionId')
                multiple_payment.upiid = payment.get('upiid')
                multiple_payment.Cheque_No = payment.get('ChequeNo')
                multiple_payment.Bank_Name = payment.get('BankName')
                multiple_payment.Transaction_Amount = self.safe_to_decimal(payment.get('transactionFee'))
                multiple_payment.AdditionalAmount = self.safe_to_decimal(payment.get('Additionalamount'))
                multiple_payment.Amount = self.safe_to_decimal(payment.get('paidamount'))
                multiple_payment.save()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            editid = data.get('EditId', '')

            related_objects, error = self.get_related_objects(data['BillingData'], data['SelectedPatient_list'])
            if error:
                return JsonResponse({'error': error})

            doctor, patient, register = related_objects

            if editid:
                general_billing = IP_Billing_Table_Detials.objects.get(Billing_Invoice_No=editid)

                self.update_general_billing(general_billing, data, doctor, patient, register)
                self.update_billing_items(editid, data['newitemslist'], data['removeditemslist'])
                receipt = self.update_receipt(editid, data)
                refund_receipt = self.create_refund_receipt(editid,data) if data.get('AmountStatus') == 'Refund' else ''
                self.update_payment_details(receipt, data['billAmount'])

                return JsonResponse({'status': 'Success', 'InvoiceNo': editid})

        except Exception as e:
            return JsonResponse({'error': str(e)})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IPBilling_Due_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Extract data from the request
            billAmount = data.get('billAmount', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            NetAmount_CDmethod = data.get('NetAmount_CDmethod', {})
            SelectDatalist = data.get('SelectDatalist', [])
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            editid = data.get('EditId','')
            request_id = data.get('Request_Id','')
            service_type = data.get('ServiceProcedureForm','')
            editid = data.get('EditId','')
            Paytype = data.get('Paytype','')
            Location = data.get('Location', '')
            selectedOption = data.get('selectedOption', '')
            editdue = data.get('EditDue','')

            print('IPPPPPP',data)
            print('edittt',editdue)
            # Fetch related foreign key objects
            try:
                doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=BillingData.get('DoctorId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple doctors found'})

            try:
                patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple patients found'})

            try:
                register = Patient_IP_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple registrations found'})
            
            # Convert to Decimal
            def safe_to_decimal(value, default=0.00):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError, ValueError):
                    return Decimal(default)
            new_bill_status= 'Paid' if safe_to_decimal(initialState.get('BalanceAmount')) == 0.00 else 'Due'
            

            # Create and save the General Billing entry
            print('hello')
            if editdue:
                # Edit existing billing entry
                general_billing = IP_Billing_Table_Detials.objects.get(Billing_Invoice_No=editdue)
                general_billing.Net_Paid_Amount+=safe_to_decimal(initialState.get('totalAmountt'))
                general_billing.Paid_Amount+=safe_to_decimal(initialState.get('PaidAmount'))
                general_billing.Balance_Amount-=safe_to_decimal(initialState.get('PaidAmount'))
                general_billing.Bill_Status=new_bill_status
                general_billing.save()
                print("Updated General Billing:", general_billing.Paid_Amount, general_billing.Net_Paid_Amount, general_billing.Balance_Amount, general_billing.Bill_Status)

                
                general_billing_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No=editdue)
                for item in general_billing_items:
                    item.Item_Status = new_bill_status
                    item.save()
                    print("Updated General Billing:", item.Item_Status)

                recipetbill = None
                billing_receipt_table = IPBillingReceipt(
                    Invoice_NO=general_billing,
                    PatientID=patient.PatientId,
                    PhoneNumber=patient.PhoneNo,
                    NewPayment= "DuePayment",
                    Patient_Name=f"{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                    TotalAmount= safe_to_decimal(initialState.get('totalNetAmount')),
                    TotalPaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                    BalanceAmount=safe_to_decimal(initialState.get('BalanceAmount')),
                    Billing_Date=BillingData.get('InvoiceDate'),
                    PaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                    Billedby=Created_by
                )
                billing_receipt_table.save()
                recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
                formatted_created_at = billing_receipt_table.CreatedAt.strftime('%d-%m-%Y %I:%M %p')

                # Save multiple payment details
                for payment in billAmount:
                    multiple_payment = Multiple_Payment_Table_IP_Detials(
                        Invoice_No=billing_receipt_table if billing_receipt_table else None,
                        Payment_Type=payment.get('Billpay_method'),
                        Cart_Type=payment.get('CardType'),
                        Card_No=payment.get('CardNo'),
                        TransactionId=payment.get('TransactionId'),
                        upiid=payment.get('upiid'),
                        Cheque_No=payment.get('ChequeNo'),
                        Bank_Name=payment.get('BankName'),
                        Amount=safe_to_decimal(payment.get('paidamount')),
                        Transaction_Amount = safe_to_decimal(payment.get('transactionFee')),
                        AdditionalAmount = safe_to_decimal(payment.get('Additionalamount')),
                    )
                    multiple_payment.save()

                return JsonResponse({'status': 'success', 'message': 'Billing details saved successfully','InvoiceDate':formatted_created_at,'ReceiptNo':recipetbill})

        except Exception as e:
            print({'error':str(e)})
            return JsonResponse({'error': str(e)})
    
    elif request.method == "GET":
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')

            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            # Build dynamic filter query
            search_query = Q()

            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Register_Id__PatientId__FirstName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__MiddleName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__SurName__icontains=SearchbyFirstName) | \
                                Q(Register_Id__PatientId__PhoneNo__icontains=SearchbyFirstName)

            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)

            general_billing_data = Interim_Billing_Table_Detials.objects.filter(search_query)
            response_data = []

            for row in general_billing_data:
                try:
                    ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id)
                    ward_name = None
                    bedno = None
                    # Ensure ward_details is not empty before accessing its attributes
                    if ward_details.exists():
                        # Make sure to access the related field correctly
                        ward_name = ward_details.last().RoomId.Ward_Name.Ward_Name.Ward_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                        bedno = ward_details.last().RoomId.Bed_No if ward_details.last().RoomId else None
                    # Construct the patient's full name
                    full_name = f"""{row.Patient_Id.Title.Title_Name}.{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}""".strip()

                    # Handle PatientCategoryName safely
                    patient_category_name = None
                    if row.Register_Id.PatientCategory == 'Insurance':
                        if row.Register_Id.InsuranceName:  # Check if InsuranceName is not None
                            patient_category_name = row.Register_Id.InsuranceName.Insurance_Name
                    else:
                        if row.Register_Id.ClientName:  # Check if ClientName is not None
                            patient_category_name = getattr(row.Register_Id.ClientName, 'Client_Name', None)

                    # Skip the row if patient_category_name is None (optional, based on your needs)
                    

                    # Prepare the general billing details
                    billing_details = {
                        'id': row.Billing_Invoice_No,
                        'Type': 'IPDue',
                        'Billing_Date': row.Billing_Date,
                        'Doctor_Id': row.Doctor_Id.Doctor_ID,
                        'Doctor_Name': f"{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}",
                        'PatientId': row.Patient_Id.PatientId,
                        'Patient_Name': full_name,
                        'PhoneNo': row.Patient_Id.PhoneNo,
                        'Register_Id': row.Register_Id.Registration_Id,
                        'Gender': row.Register_Id.PatientId.Gender,
                        'City': row.Register_Id.PatientId.City,
                        'State': row.Register_Id.PatientId.State,
                        'Pincode': row.Register_Id.PatientId.Pincode,
                        'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                        'Address': ', '.join(
                            filter(None, [
                                row.Register_Id.PatientId.PermanentdoorNo if row.Register_Id.PatientId.PermanentdoorNo else None,
                                row.Register_Id.PatientId.PermanentStreet if row.Register_Id.PatientId.PermanentStreet else None,
                                row.Register_Id.PatientId.PermanentArea if row.Register_Id.PatientId.PermanentArea else None,
                                row.Register_Id.PatientId.PermanentCity if row.Register_Id.PatientId.PermanentCity else None,
                            ])
                        ) or "No address available",
                        'PatientCategory': row.Register_Id.PatientCategory,
                        'PatientCategoryName': patient_category_name,
                        'WardName': ward_name if ward_name else None,
                        'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,  # Combine ward name and bed number
                        'AdmissionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                        'Billing_Type': row.Billing_Type,
                        'TotalItems': row.Total_Items,
                        'TotalQty': row.Total_Qty,
                        'RoundOff': row.Round_Off,
                        'TotalAmount': row.Total_Amount,
                        'Net_Amount': row.Net_Amount,
                        'PaidAmount': row.Paid_Amount,
                        'PaidNetAmount': row.Net_Paid_Amount,
                        'BalanceAmount': row.Balance_Amount,
                        'Bill_Status': row.Bill_Status,
                        'Billing_Items': [],
                        'Payment_Details': [],
                    }

                    # Fetch related billing items
                    billing_items = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                    for item in billing_items:
                        item_details = {
                            'Service_Type': item.Service_Type,
                            'Service_Name': item.Service_Name,
                            'Rate': item.Rate,
                            'Charge': item.Charge,
                            'Quantity': item.Quantity,
                            'Amount': item.Amount,
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': item.Discount_Value,
                            'Discount_Amount': item.Discount_Amount,
                            'Taxable_Amount': item.Taxable_Amount,
                            'Tax_Percentage': item.Tax_Percentage,
                            'Tax_Amount': item.Tax_Amount,
                            'Total_Amount': item.Total_Amount,
                            'IsReimbursable': item.IsReimbursable
                        }
                        billing_details['Billing_Items'].append(item_details)

                    # Fetch related payment details
                    payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                    for payment in payment_details:
                        payment_info = {
                            'Payment_Type': payment.Payment_Type,
                            'Card_Type': payment.Cart_Type,  # Note: 'Cart_Type' seems like a typo, should it be 'Card_Type'?
                            'Card_No': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'upiid': payment.upiid,
                            'Cheque_No': payment.Cheque_No,
                            'Bank_Name': payment.Bank_Name,
                            'Amount': payment.Amount,
                            'Transaction_Amount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                        }
                        billing_details['Payment_Details'].append(payment_info)

                    # Add the billing details to the response data
                    response_data.append(billing_details)

                except Exception as e:
                    # Log the error and skip the problematic row
                    print(f"Error processing row with Billing_Invoice_No {row.Billing_Invoice_No}: {str(e)}")
                    continue

            return JsonResponse(response_data, safe=False)


        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)}) 
        



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IPBillingFinal_Reprint_Link(request):
    
    if request.method == "GET":
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')

            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            status_filter = request.GET.get('SearchStatus')
            # Build dynamic filter query
            search_query = Q()

            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Patient_Id__FirstName__icontains=SearchbyFirstName) | \
                                Q(Patient_Id__MiddleName__icontains=SearchbyFirstName) | \
                                Q(Patient_Id__SurName__icontains=SearchbyFirstName) | \
                                Q(Patient_Id__PhoneNo__icontains=SearchbyFirstName) | \
                                Q(Register_Id__Registration_Id__iexact= f"""{'IP'}{SearchbyFirstName}""") | \
                                Q(Billing_Invoice_No__iexact= f"""{'IPDR/'}{SearchbyFirstName}""")
                                
                                

            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate,Billing_Type='FinalBill')  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate],Billing_Type='FinalBill')
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate,Billing_Type='FinalBill')
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate,Billing_Type='FinalBill')

            general_billing_data = IP_Billing_Table_Detials.objects.exclude(created_by__in = ['host','admin']).filter(search_query)

            print(len(general_billing_data),'general_billing_data')
            response_data = []

            for row in general_billing_data:
                try:
                    ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=row.Register_Id)
                    ward_name = None
                    bedno = None
                    # Ensure ward_details is not empty before accessing its attributes
                    if ward_details.exists():
                        # Make sure to access the related field correctly
                        ward_name = ward_details.last().RoomId.Ward_Name.Ward_Name.Ward_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                        bedno = ward_details.last().RoomId.Bed_No if ward_details.last().RoomId else None
                    # Construct the patient's full name
                    full_name = f"""{row.Patient_Id.Title.Title_Name}.{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}""".strip()

                    # Handle PatientCategoryName safely - DON'T SKIP ROW, just set to None if missing
                    patient_category_name = None
                    if row.Register_Id.PatientCategory == 'Insurance':
                        if row.Register_Id.InsuranceName:  # Check if InsuranceName is not None
                            patient_category_name = row.Register_Id.InsuranceName.Insurance_Name
                        else:
                            patient_category_name = None  # Explicitly set to None instead of skipping
                    else:
                        if row.Register_Id.ClientName:  # Check if ClientName is not None
                            patient_category_name = getattr(row.Register_Id.ClientName, 'Client_Name', None)
                        else:
                            patient_category_name = None  # Explicitly set to None instead of skipping

                    
                    admission_dt = row.Register_Id.created_at
                    discharge_dt = row.created_at

                    no_of_days = (discharge_dt.date() - admission_dt.date()).days

                    # Prepare the general billing details
                    billing_details = {
                        'id': row.Billing_Invoice_No,
                        'Type': 'IPDue',
                        'Billing_Date': row.Billing_Date,
                        'Doctor_Id': row.Doctor_Id.Doctor_ID,
                        'Doctor_Name': f"{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}",
                        'PatientId': row.Patient_Id.PatientId,
                        'Patient_Name': full_name,
                        'PhoneNo': row.Patient_Id.PhoneNo,
                        'Register_Id': row.Register_Id.Registration_Id,
                        'Registration_Id': row.Register_Id.Registration_Id,
                        'Gender': row.Register_Id.PatientId.Gender,
                        'City': row.Register_Id.PatientId.City,
                        'State': row.Register_Id.PatientId.State,
                        'Pincode': row.Register_Id.PatientId.Pincode,
                        'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                        'Address': ', '.join(
                            filter(None, [
                                row.Register_Id.PatientId.PermanentdoorNo if row.Register_Id.PatientId.PermanentdoorNo else None,
                                row.Register_Id.PatientId.PermanentStreet if row.Register_Id.PatientId.PermanentStreet else None,
                                row.Register_Id.PatientId.PermanentArea if row.Register_Id.PatientId.PermanentArea else None,
                                row.Register_Id.PatientId.PermanentCity if row.Register_Id.PatientId.PermanentCity else None,
                            ])
                        ) or "No address available",
                        'PatientCategory': row.Register_Id.PatientCategory,
                        'PatientCategoryName': patient_category_name,  # This can be None now
                        'WardName': ward_name if ward_name else None,
                        'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,  # Combine ward name and bed number
                        'AdmissionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                        'DischargeDate' : row.created_at.strftime('%d-%m-%Y %I:%M %p'),
                        'Billing_Type': row.Billing_Type,
                        'TotalItems': row.Total_Items,
                        'TotalQty': row.Total_Qty,
                        'RoundOff': row.Round_Off,
                        'TotalAmount': row.Total_Amount,
                        'Net_Amount': row.Net_Amount,
                        'PaidAmount': row.Paid_Amount,
                        'PaidNetAmount': row.Net_Paid_Amount,
                        'BalanceAmount': row.Balance_Amount,
                        'Bill_Status': row.Bill_Status,
                        'Billedby' : row.created_by,
                        'Discount_Amount' : row.Discount_Amount,
                        'Discount_Value' : row.Discount_Value,
                        'Refund_Amount' : row.Refund_Amount,
                        'Balance_Amount' : row.Balance_Amount,
                        'SchemeDiscount' : row.SchemeDiscount,
                        'refNo' : row.refNo,
                        'refDate' : row.refDate,
                        'employeeId' : row.employeeId,
                        'employeeName' : row.employeeName,
                        'crNo' : row.crNo,
                        'designation' : row.designation,
                        'Relation' : row.Relation,
                        'UMIDNO' : row.UMIDNO,
                        'no_of_days': no_of_days,


                        'Billing_Items': [],
                        'Payment_Details': [],
                    }

                    # Fetch related billing items
                    billing_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                    for item in billing_items:
                        item_details = {
                            'Service_Type': item.Service_Type,
                            'Service_Name': item.Service_Name,
                            'Rate': item.Rate,
                            'Charge': item.Charge,
                            'Quantity': item.Quantity,
                            'Amount': item.Amount,
                            'Discount_Type': item.Discount_Type,
                            'Discount_Value': item.Discount_Value,
                            'Discount_Amount': item.Discount_Amount,
                            'Taxable_Amount': item.Taxable_Amount,
                            'Tax_Percentage': item.Tax_Percentage,
                            'Tax_Amount': item.Tax_Amount,
                            'Total_Amount': item.Total_Amount,
                            'IsReimbursable': item.IsReimbursable,
                            'VoucherNo' : item.VoucherNo,
                            'CGHSCode' : item.CGHS_CODE
                        }
                        billing_details['Billing_Items'].append(item_details)

                    # Fetch related payment details
                    payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                    for payment in payment_details:
                        payment_info = {
                            'Payment_Type': payment.Payment_Type,
                            'Card_Type': payment.Cart_Type,  # Note: 'Cart_Type' seems like a typo, should it be 'Card_Type'?
                            'Card_No': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'upiid': payment.upiid,
                            'Cheque_No': payment.Cheque_No,
                            'Bank_Name': payment.Bank_Name,
                            'Amount': payment.Amount,
                            'Transaction_Amount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                        }
                        billing_details['Payment_Details'].append(payment_info)

                    # Add the billing details to the response data
                    response_data.append(billing_details)

                except Exception as e:
                    # Log the error and skip the problematic row
                    print(f"Error processing row with Billing_Invoice_No {row.Billing_Invoice_No}: {str(e)}")
                    continue

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)}) 



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IPBilling_Refund_Link(request):
   
    if request.method == "POST":
        try:
            data = json.loads(request.body)
           
            # Extract data from the request
            billAmount = data.get('billAmount', [])
            SelectedPatient_list = data.get('SelectedPatient_list', {})
            NetAmount_CDmethod = data.get('NetAmount_CDmethod', {})
            SelectDatalist = data.get('SelectDatalist', [])
            BillingData = data.get('BillingData', {})
            initialState = data.get('initialState', {})
            Created_by = data.get('Created_by', '')
            editid = data.get('EditId','')
            request_id = data.get('Request_Id','')
            service_type = data.get('ServiceProcedureForm','')
            editid = data.get('EditId','')
            Paytype = data.get('Paytype','')
            Location = data.get('Location', '')
            selectedOption = data.get('selectedOption', '')
            editdue = data.get('EditDue','')
 
            print('IPPPPPP',initialState['PaidAmount'])
            print('edittt',editdue)
            # Fetch related foreign key objects
            try:
                doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=BillingData.get('DoctorId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Doctor not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple doctors found'})
 
            try:
                patient = Patient_Detials.objects.get(PatientId=SelectedPatient_list.get('PatientId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Patient not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple patients found'})
 
            try:
                register = Patient_IP_Registration_Detials.objects.get(Registration_Id=SelectedPatient_list.get('RegisterId'))
            except ObjectDoesNotExist:
                return JsonResponse({'error': 'Registration not found'})
            except MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple registrations found'})
           
            # Convert to Decimal
            def safe_to_decimal(value, default=0.00):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError, ValueError):
                    return Decimal(default)            
 
            # Create and save the General Billing entry
            print('hello')
            # Create and save the General Billing entry
            print('hello')
            print('dvwebjvwhbvjwe',editdue)
            if editdue:
                receipt_ins = IPBillingReceipt.objects.get(Invoice_NO__Billing_Invoice_No=editdue)
                receipt_ins.NewPayment = "RefundPayment"
                receipt_ins.save()
 
                invoiceins = IP_Billing_Table_Detials.objects.filter(Billing_Invoice_No=editdue).first()
                print(invoiceins,'invoiceins')
                invoiceins.Refund_Status = 'Refunded'
                paid_amount = Decimal(str(initialState['PaidAmount']))
                invoiceins.Refund_Amount = abs(paid_amount - invoiceins.Refund_Amount)
                invoiceins.save()
 
            billing_receipt_table = IPBillingRefundReceipt(
                Invoice_NO = receipt_ins,
                PatientID=patient.PatientId,
                PhoneNumber=patient.PhoneNo,
                NewPayment= "RefundPayment",
                Patient_Name=f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName or ''} {patient.SurName}".strip(),
                TotalAmount= safe_to_decimal(initialState.get('totalNetAmount')),
                TotalPaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                BalanceAmount=safe_to_decimal(initialState.get('BalanceAmount')),
                Billing_Date=BillingData.get('InvoiceDate'),
                PaidAmount=safe_to_decimal(initialState.get('PaidAmount')),
                Billedby=Created_by
            )
            billing_receipt_table.save()
            recipetbill = billing_receipt_table.Voucher_Number if billing_receipt_table.Voucher_Number else None
            formatted_created_at = billing_receipt_table.CreatedAt.strftime('%d-%m-%Y %I:%M %p')
            # Save multiple payment details
            print('ucjcjvjhcj')
            for payment in billAmount:
 
                print(payment.get('CardNo'),'carddddddddd')
           
                multiple_payment = Multiple_Payment_IP_Refund_Table_Detials(
                    Receipt_No_Paid=billing_receipt_table if billing_receipt_table else None,
                    Payment_Type=payment.get('Billpay_method'),
                    Cart_Type=payment.get('CardType'),
                    Card_No=payment.get('CardNo') if payment.get('CardNo') else '0000',
                    TransactionId=payment.get('TransactionId'),
                    upiid=payment.get('upiid'),
                    Cheque_No=payment.get('ChequeNo'),
                    Bank_Name=payment.get('BankName'),
                    Amount=safe_to_decimal(payment.get('paidamount')),
                    Transaction_Amount = safe_to_decimal(payment.get('transactionFee')),
                    AdditionalAmount = safe_to_decimal(payment.get('Additionalamount')),
                )
                multiple_payment.save()
 
            return JsonResponse({'status': 'success', 'message': 'Billing details saved successfully','InvoiceDate':formatted_created_at,'ReceiptNo':recipetbill})
 
        except Exception as e:
            print({'error':str(e)})
            return JsonResponse({'error': str(e)})
   
    elif request.method == "GET":
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
 
            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            ItemSearchStatus = request.GET.get('ItemSearchStatus')
            # Build dynamic filter query
            search_query = Q()
           
   
            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Patient_Id__FirstName__icontains=SearchbyFirstName)
   
            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__icontains=SearchbyDoctor)
 
            if ItemSearchStatus:
 
                search_query &= Q(Refund_Status=ItemSearchStatus)
 
 
            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)
   
            # general_billing_data = IPBillingReceipt.objects.filter(search_query).exclude(NewPayment__in=['RefundPayment', 'AdvancePayment'])
            general_billing_data = IP_Billing_Table_Detials.objects.filter(search_query)
            response_data = []
 
            print('YGSDJVJWSVV')
            for row in general_billing_data:
                print('54545555',row.Register_Id.Registration_Id)
                ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__Registration_Id=row.Register_Id.Registration_Id)
                print('23232333',ward_details)
                ward_name = None
                bedno = None
                # Ensure ward_details is not empty before accessing its attributes
                if ward_details.exists():
                    # Make sure to access the related field correctly
                    ward_name = ward_details.last().RoomId.Ward_Name.Ward_Name.Ward_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                    bedno = ward_details.last().RoomId.Bed_No if ward_details.last().RoomId else None
                # Construct the patient's full name
                print('121221212')
                # Prepare the general billing details
                billing_details = {
                    'id': row.Billing_Invoice_No,
                    'Type': 'IPRefund',
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': row.Doctor_Id.Doctor_ID,
                    'Doctor_Name': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}""",
                    'PatientId': row.Patient_Id.PatientId,
                    'Patient_Name': f"""{row.Patient_Id.Title.Title_Name}{row.Patient_Id.FirstName}{row.Patient_Id.MiddleName or ''}{row.Patient_Id.SurName or ''}""",
                    'PhoneNo': row.Patient_Id.PhoneNo,
                    'Register_Id': row.Register_Id.Registration_Id,
                    'Gender': row.Register_Id.PatientId.Gender,
                    'City': row.Register_Id.PatientId.City,
                    'State': row.Register_Id.PatientId.State,
                    'Pincode': row.Register_Id.PatientId.Pincode,
                    'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                    'Address': ', '.join(
                        filter(None, [
                            row.Register_Id.PatientId.DoorNo if row.Register_Id.PatientId.DoorNo else None,
                            row.Register_Id.PatientId.Street if row.Register_Id.PatientId.Street else None,
                            row.Register_Id.PatientId.Area if row.Register_Id.PatientId.Area else None,
                            row.Register_Id.PatientId.City if row.Register_Id.PatientId.City else None,
                            row.Register_Id.PatientId.State if row.Register_Id.PatientId.State else None,
                            row.Register_Id.PatientId.Country if row.Register_Id.PatientId.Country else None,
                            row.Register_Id.PatientId.Pincode if row.Register_Id.PatientId.Pincode else None
                        ])
                    ) or "No address available",
                    'PatientCategory': row.Register_Id.PatientCategory,
                    'PatientCategoryName': (
                        row.Register_Id.InsuranceName.Insurance_Name
                        if row.Register_Id.PatientCategory == 'Insurance'
                        else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                    ),
                    'WardName': ward_name if ward_name else None,
                    'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,  # Combine ward name and bed number
                    'AdmissionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                    # 'Visit_Id': row.Visit_Id.VisitId,
                    'Billing_Type': row.Billing_Type,
                    'TotalItems': row.Total_Items,
                    'TotalQty': row.Total_Qty,
                    'RoundOff': row.Round_Off,
                    'TotalAmount': row.Total_Amount,
                    'Net_Amount': row.Net_Amount,
                    'PaidAmount': row.Paid_Amount,
                    # 'PaidNetAmount': row.TotalPaidAmount,
                    'BalanceAmount': row.Balance_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Refund_Status': row.Refund_Status,
                    'Refund_Amount': row.Refund_Amount,
                    'Billing_Items': [],
                    'Payment_Details': [],
                }
                print('yviyvivi')
                # Fetch related billing items
                billing_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                print('11111',billing_items)
                for item in billing_items:
                    item_details = {
                        'Service_Type': item.Service_Type,
                        'Service_Name': item.Service_Name,
                        'Rate': item.Rate,
                        'Charge': item.Charge,
                        'Quantity': item.Quantity,
                        'Amount': item.Amount,
                        'Discount_Type': item.Discount_Type,
                        'Discount_Value': item.Discount_Value,
                        'Discount_Amount': item.Discount_Amount,
                        'Taxable_Amount': item.Taxable_Amount,
                        'Tax_Percentage': item.Tax_Percentage,
                        'Tax_Amount': item.Tax_Amount,
                        'Total_Amount': item.Total_Amount,
                    }
                    billing_details['Billing_Items'].append(item_details)
                print('22222')
                # Fetch related payment details
                payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                print('33333',payment_details)
                for payment in payment_details:
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Card_Type': payment.Cart_Type,
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': payment.Amount,
                        'Transaction_Amount': payment.Transaction_Amount,
                        'AdditionalAmount': payment.AdditionalAmount,
                    }
                    billing_details['Payment_Details'].append(payment_info)
 
                # Add the billing details to the response data
                response_data.append(billing_details)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
 
           
 
    return JsonResponse({'status': 'failure', 'message': 'Invalid request method'})
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IPBilling_Refund_Approval_Link(request):
 
    if request.method == 'GET':
 
        try:
            # Single search parameter for name and phone filtering
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
 
            # Other search parameters
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            ItemSearchStatus = request.GET.get('ItemSearchStatus')
            # Build dynamic filter query
            search_query = Q()
           
   
            # Filtering by Name or Phone Number in a single search field
            if SearchbyFirstName:
                search_query &= Q(Patient_Id__FirstName__icontains=SearchbyFirstName)
   
            # Filtering by speciality, doctor, and status
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__icontains=SearchbyDoctor)
 
            if ItemSearchStatus:
 
                search_query &= Q(Refund_Status__icontains=ItemSearchStatus)
 
 
            # Date filtering
            if DateType == "Current" and CurrentDate:
                search_query &= Q(created_at__date=CurrentDate)  # Compares only the date, ignoring time
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(created_at__date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(created_at__date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(created_at__date__lte=ToDate)
   
            # general_billing_data = IPBillingReceipt.objects.filter(search_query).exclude(NewPayment__in=['RefundPayment', 'AdvancePayment'])
            general_billing_data = IP_Billing_Table_Detials.objects.filter(search_query)
            response_data = []
 
            print('YGSDJVJWSVV')
            for row in general_billing_data:
                print('54545555',row.Register_Id.Registration_Id)
                ward_details = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__Registration_Id=row.Register_Id.Registration_Id)
                print('23232333',ward_details)
                ward_name = None
                bedno = None
                # Ensure ward_details is not empty before accessing its attributes
                if ward_details.exists():
                    # Make sure to access the related field correctly
                    ward_name = ward_details.last().RoomId.Ward_Name.Ward_Name.Ward_Name if ward_details.last().RoomId and ward_details.last().RoomId.Ward_Name else None
                    bedno = ward_details.last().RoomId.Bed_No if ward_details.last().RoomId else None
                # Construct the patient's full name
                print('121221212')
                # Prepare the general billing details
                billing_details = {
                    'id': row.Billing_Invoice_No,
                    'Type': 'IPRefund',
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': row.Doctor_Id.Doctor_ID,
                    'Doctor_Name': f"""{row.Doctor_Id.Tittle.Title_Name}.{row.Doctor_Id.First_Name} {row.Doctor_Id.Middle_Name} {row.Doctor_Id.Last_Name}""",
                    'PatientId': row.Patient_Id.PatientId,
                    'Patient_Name': f"""{row.Patient_Id.Title.Title_Name}{row.Patient_Id.FirstName}{row.Patient_Id.MiddleName or ''}{row.Patient_Id.SurName or ''}""",
                    'PhoneNo': row.Patient_Id.PhoneNo,
                    'Register_Id': row.Register_Id.Registration_Id,
                    'Gender': row.Register_Id.PatientId.Gender,
                    'City': row.Register_Id.PatientId.City,
                    'State': row.Register_Id.PatientId.State,
                    'Pincode': row.Register_Id.PatientId.Pincode,
                    'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                    'Address': ', '.join(
                        filter(None, [
                            row.Register_Id.PatientId.DoorNo if row.Register_Id.PatientId.DoorNo else None,
                            row.Register_Id.PatientId.Street if row.Register_Id.PatientId.Street else None,
                            row.Register_Id.PatientId.Area if row.Register_Id.PatientId.Area else None,
                            row.Register_Id.PatientId.City if row.Register_Id.PatientId.City else None,
                            row.Register_Id.PatientId.State if row.Register_Id.PatientId.State else None,
                            row.Register_Id.PatientId.Country if row.Register_Id.PatientId.Country else None,
                            row.Register_Id.PatientId.Pincode if row.Register_Id.PatientId.Pincode else None
                        ])
                    ) or "No address available",
                    'PatientCategory': row.Register_Id.PatientCategory,
                    'PatientCategoryName': (
                        row.Register_Id.InsuranceName.Insurance_Name
                        if row.Register_Id.PatientCategory == 'Insurance'
                        else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                    ),
                    'WardName': ward_name if ward_name else None,
                    'ward': f"{ward_name}-{bedno}" if ward_name and bedno else None,  # Combine ward name and bed number
                    'AdmissionDate': row.Register_Id.created_at.strftime('%d-%m-%Y %I:%M %p'),
                    # 'Visit_Id': row.Visit_Id.VisitId,
                    'Billing_Type': row.Billing_Type,
                    'TotalItems': row.Total_Items,
                    'TotalQty': row.Total_Qty,
                    'RoundOff': row.Round_Off,
                    'TotalAmount': row.Total_Amount,
                    'Net_Amount': row.Net_Amount,
                    'PaidAmount': row.Paid_Amount,
                    # 'PaidNetAmount': row.TotalPaidAmount,
                    'BalanceAmount': row.Balance_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Refund_Status': row.Refund_Status,
                    'Refund_Amount': row.Refund_Amount,
                    'Billing_Items': [],
                    'Payment_Details': [],
                }
                print('yviyvivi')
                # Fetch related billing items
                billing_items = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=row.Billing_Invoice_No)
                print('11111',billing_items)
                for item in billing_items:
                    item_details = {
                        'Service_Type': item.Service_Type,
                        'Service_Name': item.Service_Name,
                        'Rate': item.Rate,
                        'Charge': item.Charge,
                        'Quantity': item.Quantity,
                        'Amount': item.Amount,
                        'Discount_Type': item.Discount_Type,
                        'Discount_Value': item.Discount_Value,
                        'Discount_Amount': item.Discount_Amount,
                        'Taxable_Amount': item.Taxable_Amount,
                        'Tax_Percentage': item.Tax_Percentage,
                        'Tax_Amount': item.Tax_Amount,
                        'Total_Amount': item.Total_Amount,
                    }
                    billing_details['Billing_Items'].append(item_details)
                print('22222')
                # Fetch related payment details
                payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                print('33333',payment_details)
                for payment in payment_details:
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Card_Type': payment.Cart_Type,
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': payment.Amount,
                        'Transaction_Amount': payment.Transaction_Amount,
                        'AdditionalAmount': payment.AdditionalAmount,
                    }
                    billing_details['Payment_Details'].append(payment_info)
 
                # Add the billing details to the response data
                response_data.append(billing_details)
 
            return JsonResponse(response_data, safe=False)
 
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IPBilling_Refund_Request_Link(request):
 
    if request.method == 'POST':
 
            data = json.loads(request.body)
 
            print(data,'data2222222')
 
            InvoiceNo = data.get('InvoiceNo')
            RefundRequest = data.get('RefundRequest')

            if RefundRequest == 'RefundRequest':
 
                billins = IP_Billing_Table_Detials.objects.filter(Billing_Invoice_No=InvoiceNo).first()
                billins.Refund_Status = 'RefundRequest'
                billins.save()
    
                return JsonResponse({'success':'Refund Requested Successfully'})
          
            else :

                billins = IP_Billing_Table_Detials.objects.filter(Billing_Invoice_No=InvoiceNo).first()
                billins.Refund_Status = 'Approved'
                billins.save()
    
                return JsonResponse({'success':'Refund Approved Successfully'})


 
 
 

@csrf_exempt
@require_http_methods(["GET"])
def Filter_Patient_data_For_Billing(request):
    try:
        first_name = request.GET.get("FirstName", None)
        phone_no = request.GET.get("PhoneNo", None)
        patient_id = request.GET.get("PatientId", None)

        filter_Conditions=Q()

        if first_name:
            filter_Conditions &= Q(FirstName__icontains=first_name)
        if phone_no:
            filter_Conditions &= Q(PhoneNo__icontains=phone_no)
        if patient_id:
            filter_Conditions &= Q(PatientId__icontains=patient_id)

        patients = Patient_Detials.objects.filter(filter_Conditions,DuplicateId=False)
        print('patients :', patients)

        patient_data = [
            {
                'PatientId': patient.PatientId,
                'PhoneNo': patient.PhoneNo,
                'FirstName': patient.FirstName,
                'Gender':patient.Gender,
                'DoorNo':patient.DoorNo,
                'Age':patient.Age,
                'Street':patient.Street,
                'Area':patient.Area,
                'City':patient.City,
                'State':patient.State,
                'Country':patient.Country,
                'Pincode':patient.Pincode,

            } for patient in patients
        ]

       
        return JsonResponse(patient_data, safe=False)

    
    except Exception as e:
        print({f'error:{str(e)}'})
        return JsonResponse({'error':'An internal server error occurred'},status=500)


 



@csrf_exempt
def get_merged_service_data_bill(request):
    try:
        selectedOption = request.GET.get('ServiceProcedureForm')
        location = request.GET.get('location')
        PatientCategory = request.GET.get('PatientCategory')
        PatientCategoryType = request.GET.get('PatientCategoryType', None)
        ServiceType = request.GET.get('ServiceType', 'Interventional')
        merged_data = []
        print('22222',selectedOption)
        print('33333',location)
        print('44444',PatientCategory)
        print('55555',PatientCategoryType)
        print('66666',ServiceType)
        
        if selectedOption == 'GeneralBillingItem':
            ser_pro_inss = Service_Master_Details.objects.filter(Status=True)
            print('hiiii',ser_pro_inss)
        elif selectedOption == 'Procedure':
            ser_pro_inss = Procedure_Master_Details.objects.filter(Status=True, Type=ServiceType)
            print('hello',ser_pro_inss)

        
        for inss in ser_pro_inss:
            data = {
                'Service_Id': inss.pk,
                'Service_Name': inss.Service_Name if selectedOption == 'GeneralBillingItem' else inss.Procedure_Name,
                'GstValue': inss.GstValue if inss.IsGst == 'Yes' else "Nill",
                'charge' : inss.Amount if selectedOption == 'IPDServices' else inss.Amount,
            }
            print('11111111',data)

            # Filter conditions
            filter_conditions = Q()
            if selectedOption == 'GeneralBillingItem':
                filter_conditions &= Q(Service_ratecard__pk=inss.pk, Location__pk=location)
                print('IPDServices',filter_conditions)
            elif selectedOption == 'Procedure':
                filter_conditions &= Q(Procedure_ratecard__pk=inss.pk, Location__pk=location)
                print('IPDProcedures',filter_conditions)

            try:
                print('Summmmaaaaa')

                inss_ser_pro = Service_Procedure_Charges.objects.filter(filter_conditions).first()
                print('hiiiii1111',inss_ser_pro)

                charges_gen_spe = Service_Procedure_Rate_Charges.objects.filter(Service_Procedure_ratecard=inss_ser_pro).first()
                
                print('hiiiii2222',charges_gen_spe)

                if PatientCategory == 'General':
                    data['charge'] = charges_gen_spe.General_fee
                elif PatientCategory == 'Special':
                    data['charge'] = charges_gen_spe.Special_fee
                elif PatientCategory == 'Insurance' and PatientCategoryType:
                    ins_ins = Service_Procedure_InsuranceFee.objects.get(Service_Procedure_ratecard=inss_ser_pro, insurance__pk=PatientCategoryType)
                    data['charge'] = ins_ins.fee
                elif PatientCategory == 'Client' and PatientCategoryType:
                    cli_ins = Service_Procedure_ClientFee.objects.get(Service_Procedure_ratecard=inss_ser_pro, client__pk=PatientCategoryType)
                    data['charge'] = cli_ins.fee
                    
            except Service_Procedure_Charges.DoesNotExist:
                print('Service_Procedure_Charges doesnt exist')
                # data['charge'] = ""
            except Service_Procedure_Rate_Charges.DoesNotExist:
                print('Service_Procedure_Rate_Charges doesnt exist')
                # data['charge'] = ""
            except (Service_Procedure_InsuranceFee.DoesNotExist, Service_Procedure_ClientFee.DoesNotExist):
                print('Service_Procedure_InsuranceFee doesnt exist')
                # data['charge'] = ""

            merged_data.append(data)
        
        return JsonResponse(merged_data, safe=False)

    except Exception as e:
        print(f'error: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(['POST','GET'])
def get_client_insurance_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            PatientId = data.get('PatientId')
            isClient = data.get('isClient')
            CoPaymentType = data.get('CoPaymentType')
            CoPaymentTypeinp = data.get('CoPaymentTypeinp')
            CoPaymentLogic = data.get('CoPaymentLogic')
            CoPaymentdeducted = data.get('CoPaymentdeducted')
            PreAuthType = data.get('PreAuthType')
            PreAuthTypeinp = data.get('PreAuthTypeinp')
            PreAuthAmount = data.get('PreAuthAmount')
            PreAuthApprovalNo = data.get('PreAuthApprovalNo')
            PolicyNo = data.get('PolicyNo')
            PolicyStartDate = data.get('PolicyStartDate')
            PolicyEndDate = data.get('PolicyEndDate')
            Created_by = data.get('Created_by')
            Location = data.get('Location')
            
            print('11111111',data)
            patient_instance = Patient_Detials.objects.get(PatientId = PatientId)
            print('222222222',patient_instance)
            locationget=Location_Detials.objects.get(Location_Id=Location)

            
            client_instance = Patient_Client_Insurance_details(
                Patient_Id = patient_instance,
                isClient = isClient,
                CoPaymentType = CoPaymentType,
                CoPaymentTypeinp = CoPaymentTypeinp,
                CoPaymentLogic = CoPaymentLogic,
                CoPaymentdeducted = CoPaymentdeducted,
                PreAuthType = PreAuthType,
                PreAuthTypeinp = PreAuthTypeinp,
                PreAuthAmount = PreAuthAmount,
                PreAuthApprovalNo = PreAuthApprovalNo,
                PolicyNo = PolicyNo,
                PolicyStartDate = PolicyStartDate,
                PolicyEndDate = PolicyEndDate,
                created_by = Created_by,
                Location = locationget,
            )
            
            print('333333',client_instance)
            client_instance.save()
            return JsonResponse({'success':"Client Details Added Successfully"}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})
    
    elif request.method == 'GET':
        try:
            PatientId = request.GET.get('PatientId')
            
            # Query the patient insurance details for the given PatientId
            patient_instance = Patient_Client_Insurance_details.objects.filter(Patient_Id=PatientId).first()

            if not patient_instance:
                return JsonResponse({'error': 'No insurance details found for this PatientId'}, safe=False)

            # Format the patient details into a dictionary
            client_instance = {
                "PatientId": patient_instance.Patient_Id.PatientId,
                "isClient": patient_instance.isClient,
                "CoPaymentType": patient_instance.CoPaymentType,
                "CoPaymentTypeinp": patient_instance.CoPaymentTypeinp,
                "CoPaymentLogic": patient_instance.CoPaymentLogic,
                "CoPaymentdeducted": patient_instance.CoPaymentdeducted,
                "PreAuthType": patient_instance.PreAuthType,
                "PreAuthTypeinp": patient_instance.PreAuthTypeinp,
                "PreAuthAmount": patient_instance.PreAuthAmount,
                "PreAuthApprovalNo": patient_instance.PreAuthApprovalNo,
                "PolicyNo": patient_instance.PolicyNo,
                "PolicyStartDate": patient_instance.PolicyStartDate,
                "PolicyEndDate": patient_instance.PolicyEndDate,
            }

            # Return the details in dictionary format
            return JsonResponse(client_instance, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)})

# Get the list of countries
@csrf_exempt
@require_http_methods(['GET'])
def get_countries(request):
    try:
        # Fetch country names using pycountry
        countries = [{'code': country.alpha_2, 'name': country.name} for country in pycountry.countries]
        return JsonResponse({'countries': countries}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# Get states (administrative subdivisions) based on selected country
@csrf_exempt
@require_http_methods(['GET'])
def get_states(request):
    try:
        country_code = request.GET.get('country_code')
        if not country_code:
            return JsonResponse({'error': 'Country code parameter is missing'}, status=400)
        
        # Fetch the states (administrative subdivisions) for the selected country
        subdivisions = pycountry.subdivisions.get(country_code=country_code)
        states = [{'code': sub.code, 'name': sub.name} for sub in subdivisions]
        return JsonResponse({'states': states}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(['GET'])
def get_location_by_pincode(request):
    try:
        pincode = request.GET.get('pincode')
        if not pincode:
            return JsonResponse({'error': 'Pincode is required'}, status=400)
       
        # Use Zippopotam.us API to get country, state, and city info based on postal code
        response = requests.get(f"http://api.zippopotam.us/in/{pincode}")
        district = get_district_by_pincode(pincode)  # Replace with actual logic
        if response.status_code != 200:
            return JsonResponse({'error': 'Location not found for this pincode'}, status=404)
 
        location_data = response.json()
        country = location_data['country']
        state = location_data['places'][0]['state']
        city = location_data['places'][0]['place name']  # Extracting the city name
       
        return JsonResponse({'country': country, 'state': state, 'city': city, 'district' : district}, safe=False)
   
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
   
 
def get_district_by_pincode(pincode):
    # Fetch location data dynamically from India Post API or similar
    response = requests.get(f"https://api.postalpincode.in/pincode/{pincode}")
   
    if response.status_code != 200 or not response.json():
        return JsonResponse({'error': 'Location not found for this pincode'}, status=404)
   
    location_data = response.json()[0]
    if location_data['Status'] != 'Success':
        return JsonResponse({'error': 'Invalid pincode or data not available'}, status=404)
   
    # Extract district and other details
    post_office_data = location_data['PostOffice'][0]
    district = post_office_data.get('District', 'District not found')
    print('Disssssss',district)
    return district
   
  
    

# Geonames username (replace 'your_geonames_username' with your actual username)
GEONAMES_USERNAME = 'sridhar0507'

@csrf_exempt
@require_http_methods(['GET'])
def get_location_by_params(request):
    try:
        # Get the parameters from the request
        pincode = request.GET.get('pincode', '')
        country = request.GET.get('country', '')
        state = request.GET.get('state', '')
        city = request.GET.get('city', '')
        
        # Ensure at least one parameter is passed
        if not (pincode or country or state or city):
            return JsonResponse({'error': 'At least one parameter is required'}, status=400)

        # Base URL for Geonames postalCodeSearch API
        base_url = "http://api.geonames.org/postalCodeSearchJSON"

        # Prepare the request parameters based on what is provided
        params = {
            'postalcode': pincode,
            'placename': city if city else '',  # Geonames uses placename for cities
            'adminName1': state if state else '',  # adminName1 is the state field in Geonames
            'country': country if country else '',
            'maxRows': 1,  # We only need one result
            'username': GEONAMES_USERNAME
        }
        print('111111',params)
        # Make the API request
        response = requests.get(base_url, params=params)
        print('22222222', response)
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch data from Geonames API'})

        # Parse the API response
        location_data = response.json()
        postal_codes = location_data.get('postalCodes', [])
        if not postal_codes:
            return JsonResponse({'error': 'No location data found'})

        # Extract the first postal code result
        result = postal_codes[0]
        
        # Initialize the location information
        location_info = {
            'pincode': result.get('postalCode', ''),
            'country': result.get('countryCode', ''),
            'state': result.get('adminName1', ''),
            'city': result.get('placeName', ''),
            'area': result.get('adminName2', '')  # You can use adminName2 as area/subdivision
        }

        return JsonResponse(location_info, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)})
   
    
    
    
    
    
    
    
@csrf_exempt
def get_latest_appointment_for_patient(request):
    try:
        patient_id = request.GET.get('PatientId')
        latest_appointment = Patient_IP_Registration_Detials.objects.filter(PatientId=patient_id).order_by('-Registration_Id').first()

        if latest_appointment:
            appointment_data = {
                'Registration_Id': latest_appointment.Registration_Id,
                'VisitId': latest_appointment.VisitId,
            }

            return JsonResponse(appointment_data, safe=False)
        else:
            return JsonResponse({'error': 'No appointments found for this patient.'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)








#  For  Pharmacy Billing Op



def get_prescription(request):
    try:
        # Retrieve PatientID from request
        PatientID = request.GET.get('PatientID')
        print('PatientID :',PatientID)
        VisitID=request.GET.get('VisitID')
        # Check if PatientID is provided
        if not PatientID:
            return JsonResponse({"error": "PatientID parameter is required"}, status=400)

        # Fetch patient details to get the Patient Name
        patient = Patient_Detials.objects.get(PatientId=PatientID)
        PatientName = f"{patient.FirstName} {patient.MiddleName} {patient.SurName}"

        registration = Patient_Appointment_Registration_Detials.objects.get(
            PatientId_id =PatientID, VisitId=VisitID
        )



        # Query the prescriptions related to the PatientID
        prescriptions = Workbench_Prescription.objects.filter(
            Registration_Id_id =registration
        ).select_related('Doctor_Id', 'Registration_Id')

        # Prepare the list of prescriptions in the specified format
        prescription_list = []
        for prescription in prescriptions:
            registration = prescription.Registration_Id
            try:
                location = Location_Detials.objects.get(Location_Id=registration.Location_id)
                location_name = location.Location_Name
            except ObjectDoesNotExist:
                location_name = "N/A"
            
            doctor = prescription.Doctor_Id
            prescription_dict = {
                'PrescriptionID': prescription.Id,
                'PatientID': PatientID,
                'VisitID': registration.VisitId,
                'AppointmentDate': registration.created_at.date().isoformat(),  # or any other date field you want to use
                'DoctorName': f"{doctor.First_Name} {doctor.Last_Name}" if doctor else "N/A",
                'GenericName': prescription.GenericName,
                'ItemName': prescription.ItemName,
                'Dose': prescription.Dose,
                'Route': prescription.Route,
                'Frequency': prescription.Frequency,
                'Duration': f"{prescription.DurationNumber} {prescription.DurationUnit}",
                'Qty': prescription.Qty,
                'Instruction': prescription.Instruction,
                'Status': registration.Status,
                'LoggedBy': prescription.created_by,
                'Location': location_name,
                'CreatedAt': prescription.created_at.date().isoformat(),
                'Patient_Name': PatientName
            }
            prescription_list.append(prescription_dict)

        return JsonResponse(prescription_list, safe=False)

    except ObjectDoesNotExist:
        return JsonResponse({"error": "Patient not found"})
    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)})
    

    
def get_prescriptionqueue(request):
    try:
        # Fetch all prescriptions with related data
        prescriptions = Workbench_Prescription.objects.select_related(
            'Doctor_Id'  # Related doctor details
        ).all()

        # Serialize the prescriptions queryset to JSON
        serialized_prescriptions = serialize('json', prescriptions, use_natural_primary_keys=True)
        
        # Convert serialized data to Python dict
        serialized_data = json.loads(serialized_prescriptions)

        # Dictionary to hold unique patient details
        patient_data = {}
        
        id = 1
        # Enhance the serialized data with additional details
        for item in serialized_data:
            fields = item['fields']
            registration_id = fields.get('Registration_Id')
            doctor_id = fields.get('Doctor_Id')
            
            # Get PatientId using Registration_Id
            appointment = Patient_Appointment_Registration_Detials.objects.filter(id=registration_id).first()
            if appointment:
                patient_id = appointment.PatientId.PatientId
            else:
                patient_id = None
            
            if patient_id:
                if registration_id not in patient_data:
                    patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
                    if patient:
                        # Fetch doctor details
                        doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctor_id).first()
                        doctor_name = f"{doctor.First_Name} {doctor.Last_Name}" if doctor else ''
                        
                        patient_data[registration_id] = {
                            'Patient_Name': f"{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                            'PatientPhoneNo': patient.PhoneNo,
                            'PatientEmail': patient.Email,
                            'PatientCity': patient.City,
                            'PatientState': patient.State,
                            'PatientCountry': patient.Country,
                            'VisitID': appointment.VisitId if appointment else '',
                            'DoctorName': doctor_name,
                            'id': id,
                            'PatientID': patient.PatientId 
                        }
            id += 1    
        # Convert patient data dictionary to list
        enhanced_data = list(patient_data.values())
        
        # Return the enhanced serialized data
        return JsonResponse(enhanced_data, safe=False)

    except Exception as e:
        print('error:', str(e))
        return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)
    
    
    
@csrf_exempt
def get_personal_info(request):
    try:
        

        patientdata = Patient_Detials.objects.all()
        serialized_prescriptions = serialize('json', patientdata, use_natural_primary_keys=True)
        
        # Convert serialized data to Python dict
        serialized_data = json.loads(serialized_prescriptions)

        cleaned_data = [
            {
                **item['fields'],
                'PatientId': item['pk'] 
            }
            for item in serialized_data
        ]

        return JsonResponse(cleaned_data, safe=False)


    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)},
                            status=500)
    

@csrf_exempt
def get_quick_list(request):
    try:
        # Get location id from query parameters
        location_id = request.GET.get('location')
        
        location = Location_Detials.objects.filter(Location_Id=location_id).first()

        if not location:
            return JsonResponse({'error': 'Location not found'}, status=404)

        stock_query = pharmacy_stock_location_information.objects.filter(Location=location.Location_Name)

        serialized_stock = serialize('json', stock_query, use_natural_primary_keys=True)
        
        serialized_data = json.loads(serialized_stock)
        
        cleaned_data = [
            {
                **item['fields']
            }
            for item in serialized_data
        ]

        return JsonResponse(cleaned_data, safe=False)

        
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)})
    
    
@csrf_exempt
def get_name(request):
    try:
        item_name = request.GET.get('ItemName')  
        batch_no = request.GET.get('BatchNo') 
        location = request.GET.get('location')  
        
        location = Location_Detials.objects.get(Location_Id=location)
        print('location :',location)
        if not location:
            return JsonResponse({'error': f'Location {location} not found'}, status=404)
        
        stock_query = pharmacy_stock_location_information.objects.filter(Location=location.Location_Name,Item_Name=item_name,Batch_No=batch_no)
       
        
        serialized_stock = serialize('json', stock_query, use_natural_primary_keys=True)
        # cleaned_data = [
        #     {
        #         **item['fields']
        #     }
        #     for item in serialized_stock
        # ]
        serialized_data = json.loads(serialized_stock)

        return JsonResponse(serialized_data, safe=False)
    
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal Server Error: ' + str(e)}, status=500)
    



# def get_prescription_forIP(request):
#     try:
#         # Retrieve PatientID from request
#         PatientID = request.GET.get('PatientID')
#         VisitID = request.GET.get('VisitID')

#         # Check if PatientID and VisitID are provided
#         if not PatientID:
#             return JsonResponse({"error": "PatientID parameter is required"}, status=400)
#         if not VisitID:
#             return JsonResponse({"error": "VisitID parameter is required"}, status=400)

#         # Fetch patient details to get the Patient Name
#         patient = Patient_Detials.objects.get(PatientId=PatientID)
#         PatientName = f"{patient.FirstName} {patient.MiddleName} {patient.SurName}"

#         # Query the prescriptions related to the VisitID (Registration_Id_id)
#         prescriptions = ip_drug_request_table.objects.filter(Booking_Id=VisitID)

#         # Prepare the list of prescriptions in the specified format
#         prescription_list = []
#         for prescription in prescriptions:
#             prescription_dict = {
#                 'PrescriptionID': prescription.Drug_Request_Id,
#                 'PatientID': PatientID,
#                 'VisitID': VisitID,  # Mapping VisitID as Registration_Id
#                 'Booking_Id': prescription.Booking_Id,
#                 # 'AppointmentDate': prescription.CreatedAt.date().isoformat(),  # Date of prescription creation
#                 'DoctorName': prescription.DoctorName,
#                 'GenericName': prescription.GenericName,
#                 'ItemName': prescription.MedicineName,
#                 'Dose': prescription.Dosage,
#                 'Route': prescription.Route,
#                 'Frequency': prescription.Duration,  # Assuming Frequency is in Duration
#                 'Duration': prescription.DurationType,
#                 'Qty': prescription.RequestQuantity,
#                 'Instruction': prescription.RequestType,  # Assuming RequestType includes instructions
#                 'Status': prescription.Status,
#                 'LoggedBy': prescription.CreatedBy,
#                 # 'CreatedAt': prescription.CreatedAt.date().isoformat(),
#                 'Patient_Name': PatientName
#             }
#             prescription_list.append(prescription_dict)

#         return JsonResponse(prescription_list, safe=False)

#     except Patient_Detials.DoesNotExist:
#         return JsonResponse({"error": "Patient not found"}, status=404)
#     except Exception as e:
#         print('error:', str(e))
#         return JsonResponse({"error": "Internal Server Error: " + str(e)}, status=500)



# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.db import connection

# @csrf_exempt
# def Post_Ip_PharmacyBilling_table(request):
#     if request.method == 'POST':
#         try:
#             # Extract prescription barcode from the form
#             prescription_barcode = request.POST.get('Priscription_Barcode', None)
            
#             # Extract medicines data
#             Billing_itemtable = []
#             index = 0
#             while True:
#                 item_id = request.POST.get(f'ItemId_{index}', None)
#                 quantity = request.POST.get(f'Billing_Quantity_{index}', None)
#                 if item_id is None and quantity is None:
#                     break
#                 Billing_itemtable.append({
#                     'ItemId': item_id,
#                     'Billing_Quantity': quantity
#                 })
#                 index += 1

#             # Database operations
#             with connection.cursor() as cursor:
#                 if prescription_barcode:
#                     # Update the status of the prescription barcode
#                     update_query_ip = """
#                         UPDATE Ip_Drug_Request_Table
#                         SET Status = 'Completed'
#                         WHERE Priscription_Barcode = %s
#                     """
#                     cursor.execute(update_query_ip, [prescription_barcode])

#                     # Update quantities for each medicine item
#                     for item in Billing_itemtable:
#                         item_id = item.get('ItemId')
#                         quantity = item.get('Billing_Quantity')
#                         if item_id and quantity is not None:
#                             update_query_item = """
#                                 UPDATE Ip_Drug_Request_Table
#                                 SET RecivedQuantity = %s
#                                 WHERE Priscription_Barcode = %s AND MedicineCode = %s
#                             """
#                             cursor.execute(update_query_item, [quantity, prescription_barcode, item_id])

#                     response_data = {'message': 'Data updated successfully'}
#                     return JsonResponse(response_data)
#                 else:
#                     return JsonResponse({'error': 'Prescription barcode is missing'}, status=400)

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
@require_http_methods(['POST'])
def Patient_details_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract RegisterData from the main request body
            register_data = data.get('RegisterData', {})

            patient_id = register_data.get('PatientId', '')
            phone_no = register_data.get('PhoneNo', '')
            title = register_data.get('Title', '')
            first_name = register_data.get('FirstName', '').strip()
            middle_name = register_data.get('MiddleName', '')
            sur_name = register_data.get('SurName', '')
            gender = register_data.get('Gender', '')
            dob = register_data.get('DOB', '')
            age = register_data.get('Age', '')
            email = register_data.get('Email', '')
            blood_group = register_data.get('BloodGroup', '')
            occupation = register_data.get('Occupation', '')
            religion = register_data.get('Religion', '')
            nationality = register_data.get('Nationality', '')
            unique_id_type = register_data.get('UniqueIdType', '')
            unique_id_no = register_data.get('UniqueIdNo', '')
            Location_Id = register_data.get('Location', None)
            visit_purpose = register_data.get('VisitPurpose', '')
            # case_sheet_no = register_data.get('CaseSheetNo', '')
            complaint = register_data.get('Complaint', '')
            patient_type = register_data.get('PatientType', '')
            patient_category = register_data.get('PatientCategory', '')

            # Address fields
            door_no = register_data.get('DoorNo', '')
            street = register_data.get('Street', '')
            area = register_data.get('Area', '')
            city = register_data.get('City', '')
            state = register_data.get('State', '')
            country = register_data.get('Country', '')
            pincode = register_data.get('Pincode', '')
            created_by = data.get('Created_by', '')

            print("2222222222", register_data)
            
            religion_instance = Religion_Detials.objects.get(Religion_Id=religion) if religion else None
            print("33333333333")
            title_instance = Title_Detials.objects.get(Title_Id=title) if title else None

            with transaction.atomic():
                print('4444444444')
                patient = None
                print('4444444444')

                # Check if patient with same PhoneNo and FirstName exists
                if Patient_Detials.objects.filter(PhoneNo=phone_no, FirstName=first_name).exists():
                    patient = Patient_Detials.objects.get(PhoneNo=phone_no, FirstName=first_name)
                    print('666666666')
                    return JsonResponse({'warn': f"The Patient {patient.PatientId} is already registered with {phone_no} and {first_name}"})
                
                print("555555555")

                # Create a new Patient_Detials object and save it
                patient_ins = Patient_Detials(
                    PhoneNo=phone_no,
                    Title=title_instance,
                    FirstName=first_name,
                    MiddleName=middle_name, 
                    SurName=sur_name, 
                    Gender=gender, 
                    DOB=dob, 
                    Age=age, 
                    Email=email, 
                    BloodGroup=blood_group, 
                    Occupation=occupation, 
                    Religion=religion_instance, 
                    Nationality=nationality, 
                    UniqueIdType=unique_id_type, 
                    UniqueIdNo=unique_id_no, 
                    DoorNo=door_no, 
                    Street=street, 
                    Area=area, 
                    City=city, 
                    State=state, 
                    Country=country, 
                    Pincode=pincode, 
                    created_by=created_by
                )
                patient_ins.save()
                print('11111111', patient_ins)
                
                return JsonResponse({'success': 'Patient Details Added Successfully'})

        except Exception as e:
            return JsonResponse({'error': str(e)})

@csrf_exempt
@require_http_methods(['POST','GET'])
def IP_AdvanceAmount_collection(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            registration = data.get('RegistrationId')
            created_by = data.get('Created_by')
            Advanceamount = data.get('AdvanceAmount')
            billAmount = data.get('BillAmount', [])
            Patientdept = data.get('Patientdept',{})
            totalAmount = data.get('totalAmount','')
            SelectDatalist = data.get('SelectDatalist',{})
            Remarks = data.get('Remarks','')
 
 
            BankName = None
            Billpay_method = None
            CardType = None
            CardNo = None
            TransactionId = None
            upiid = None
            Cheque_No = None
            Bank_Name = None
            AdvanceServiceRemark = None
            AdvancePurpose = None
            AdvanceAmount = None
 
            for payment in SelectDatalist:
 
                Billpay_method = payment['Billpay_method']
                CardType = payment['CardType']
                CardNo = payment['CardNo']
                TransactionId = payment['TransactionId']
                upiid = payment['upiid']
                Cheque_No = payment['ChequeNo']
                Bank_Name = payment['BankName']
 
                AdvanceServiceRemark = payment['AdvanceServiceRemark']
                AdvancePurpose = payment['AdvancePurpose']
                AdvanceAmount = payment['Amount']
 
                break
 
 
            OP_Register_Id = None
            IP_Register_Id = None
 
            if  Patientdept['Department'] == 'OP':
 
                OP_Register_Id = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id = registration).first()
                print('OPpppppp',OP_Register_Id)
            elif Patientdept['Department'] == 'IP':
 
                IP_Register_Id = Patient_IP_Registration_Detials.objects.filter(pk = registration).first()
                print('IIIIPpppppp',IP_Register_Id)
            if not totalAmount:
                return JsonResponse({'error': 'Enter the Advance Amount'})
 
            def safe_to_decimal(value, default=0.00):
                try:
                    return Decimal(value)
                except (InvalidOperation, TypeError, ValueError):
                    return Decimal(default)
 
           
 
            if  Patientdept['Department'] == 'IP':
 
                    ipgeneral_billing_instance = IPBillingReceipt.objects.create(
 
                    NewPayment = 'AdvancePayment',
                    PatientID = Patientdept['PatientId'],
                    PhoneNumber = Patientdept['PhoneNo'],
                    Patient_Name = Patientdept['FirstName'],
                    TotalAmount = totalAmount,
                    TotalPaidAmount = totalAmount,
                    BalanceAmount = 0,
                    Billing_Date = timezone.now().date(),
                    PaidAmount = totalAmount,
                    Billedby = created_by
 
                    )
                    receipt_no = ipgeneral_billing_instance.Voucher_Number
                    ippaymentins = Multiple_Payment_Table_IP_Detials(
 
                        Invoice_No = ipgeneral_billing_instance,
                        Payment_Type = Billpay_method,
                        Cart_Type = CardType,
                        Card_No = CardNo,
                        TransactionId = TransactionId,
                        upiid = upiid,
                        Cheque_No = Cheque_No,
                        Bank_Name = Bank_Name,
                        Transaction_Amount = 0,
                        AdditionalAmount = 0,
                        Amount = totalAmount
 
                    )
                    ippaymentins.save()  
 
 
 
                    for adv in SelectDatalist:
 
                        Advance_regis = Advance_Collection_IP(
                            RegisterType = Patientdept['Department'],
                            OP_Register_Id = OP_Register_Id,
                            IP_Register_Id = IP_Register_Id,
                            IPBillingReceipt = ipgeneral_billing_instance,
                            GeneralBillingReceipt = None,
                            AdvanceAmount = AdvanceAmount,
                            AdvancePurpose = AdvancePurpose,
                            Advance_Desc = AdvanceServiceRemark,
                            created_by = created_by,
                              Remarks = Remarks
                        )
                        Advance_regis.save()
                        print('2222222',Advance_regis)          
            elif  Patientdept['Department'] == 'OP':
 
                general_billing_instance  = GeneralBillingReceipt.objects.create(
 
                   
                    NewPayment = 'AdvancePayment',
                    PatientID = Patientdept['PatientId'],
                    PhoneNumber = Patientdept['PhoneNo'],
                    Patient_Name = Patientdept['FirstName'],
                    TotalAmount = totalAmount,
                    TotalPaidAmount = totalAmount,
                    BalanceAmount = 0,
                    Billing_Date = timezone.now().date(),
                    PaidAmount = totalAmount,
                    Billedby = created_by
 
                )
                receipt_no = general_billing_instance.Voucher_Number
 
                paymentins = Multiple_Payment_Table_Detials(
 
                        Receipt_No_Paid = general_billing_instance,
                        Payment_Type = Billpay_method,
                        Cart_Type = CardType,
                        Card_No = CardNo,
                        TransactionId = TransactionId,
                        upiid = upiid,
                        Cheque_No = Cheque_No,
                        Bank_Name = Bank_Name,
                        Transaction_Amount = 0,
                        AdditionalAmount = 0,
                        Amount = totalAmount
 
                )
                paymentins.save()
 
                for adv in SelectDatalist:
 
                        Advance_regis = Advance_Collection_IP(
                            RegisterType = Patientdept['Department'],
                            OP_Register_Id = OP_Register_Id,
                            IP_Register_Id = IP_Register_Id,
                            IPBillingReceipt = None,
                            GeneralBillingReceipt = general_billing_instance,
                            AdvanceAmount = AdvanceAmount,
                            AdvancePurpose = AdvancePurpose,
                            Advance_Desc = AdvanceServiceRemark,
                            created_by = created_by,
                            Remarks = Remarks
                        )
                        Advance_regis.save()
                        print('2222222',Advance_regis)
 
            return JsonResponse({'success' : 'Advance Amount saved successfully','InvoiceNo':receipt_no,'InvoiceDate' : Advance_regis.created_at.strftime('%d-%m-%y %I:%M %p')})
        except Exception as e:
            return JsonResponse({'error': str(e)})
       
    elif request.method == 'GET':
        try:
            registration = request.GET.get('RegistrationId')
            type = request.GET.get('Type')
            if type == 'IP':
                advance_ins = Advance_Collection_IP.objects.filter(IP_Register_Id__Registration_Id=registration,Status='Paid')
            else:
                advance_ins = Advance_Collection_IP.objects.filter(OP_Register_Id__Registration_Id=registration,Status='Paid')
            remaining_cred = IP_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id = registration)
 
            advance_total = []
            TotalAmount = 0
            print('advance',advance_ins)
            # Loop through all filtered records
            for advance in advance_ins:
                print('advance',advance)
                TotalAmount += advance.AdvanceAmount
                advance_ip = {
                    'AdvanceAmount': advance.AdvanceAmount,
                    'Date': advance.created_at.strftime('%Y-%m-%d'),  # Fixing inconsistent key
                    'Time': advance.created_at.strftime('%H:%M'),  # Fixing inconsistent key
                    'ReceivedBy': advance.created_by,  # Fixed typo
                    'TotalAmount': TotalAmount,       # Running total
                }
                advance_total.append(advance_ip)  # Append in each iteration
 
            # Adding the Total Advance Amount to the response
            total_advance_amount = advance_ins.aggregate(total=Sum('AdvanceAmount'))['total'] or 0
            total_paid_amount = remaining_cred.aggregate(totalpaid = Sum('Paid_Amount'))['totalpaid'] or 0
            response_data = {
                'AdvanceDetails': advance_total,
                'TotalAdvanceAmount': total_advance_amount,
                'TotalPaidAmount': total_paid_amount,
                'RemainingCredit' : total_advance_amount-total_paid_amount,
            }
 
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
 
@csrf_exempt
def get_overall_patient_details(request):
    if request.method == 'GET':
        try:
            # Extract filters
            name_or_phone = request.GET.get('SearchbyFirstName', '').strip()
            patient_id = request.GET.get('SearchbyPatientId', '').strip()
            registration_id = request.GET.get('SearchbyRegistrationId', '').strip()
            phone_no = request.GET.get('SearchbyPhoneNumber', '').strip()
            doctor = request.GET.get('SearchbyDoctor', '').strip()
            speciality = request.GET.get('SearchbySpeciality', '').strip()
            # status = request.GET.get('SearchStatus', '').strip()
            date_type = request.GET.get('DateType', '').strip()
            advance_type = request.GET.get('AdvanceType', '').strip()
            current_date = request.GET.get('CurrentDate', '').strip()
            from_date = request.GET.get('FromDate', '').strip()
            to_date = request.GET.get('ToDate', '').strip()
 
            # Start with empty queryset
            patient_list = []
            patient_ids_set = set()
            print('nameeeeeeeeee',name_or_phone)
            print('regggggg',registration_id)
            print('patittttttt',patient_id)
            if advance_type == 'OP':
                # OP Filter
                op_filters = Q()
                if name_or_phone:
                    op_filters |= Q(PatientId__FirstName__icontains=name_or_phone)
                if phone_no:
                    op_filters |= Q(PatientId__PhoneNo__icontains=phone_no)
 
                if patient_id:
                    op_filters |= Q(PatientId__PatientId__icontains=patient_id)
                if registration_id:
                    op_filters |= Q(Registration_Id__icontains=registration_id)
 
                if date_type == "Current" and current_date:
                    op_filters &= Q(created_at__date=current_date)
                elif date_type == "Customize" and from_date and to_date:
                    op_filters &= Q(created_at__date__range=[from_date, to_date])
 
                op_records = Patient_Appointment_Registration_Detials.objects.filter(op_filters).select_related('PatientId')[:1000]
                print('oppppp',op_records, op_filters)
                for op in op_records:
                    patient = op.PatientId
                    doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Registration_Id__Registration_Id=op.Registration_Id
                    ).first()
 
                    # Optional filters for doctor/speciality
                    if doctor and (not doc_ins or not doc_ins.PrimaryDoctor or doctor.lower() not in doc_ins.PrimaryDoctor.First_Name.lower()):
                        continue
                    if speciality and (not doc_ins or not doc_ins.Specialization or speciality.lower() not in doc_ins.Specialization.Speciality_Name.lower()):
                        continue
 
                    patient_list.append({
                        'id': len(patient_list) + 1,
                        'type': 'OP',
                        'RegistrationId': op.Registration_Id,
                        'PatientId': patient.PatientId,
                        'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                        'PhoneNo': patient.PhoneNo,
                        'Age': f"{patient.Age}/{patient.Gender}",
                        'Gender': patient.Gender,
                        'isMLC': op.IsMLC,
                        'isRefferal': op.IsReferral,
                        'Status': op.Status,
                        'DoctorName': f"{doc_ins.PrimaryDoctor.Tittle.Title_Name}.{doc_ins.PrimaryDoctor.First_Name} {doc_ins.PrimaryDoctor.Last_Name}" if doc_ins and doc_ins.PrimaryDoctor else '',
                        'Specilization': str(doc_ins.Specialization.Speciality_Name) if doc_ins and doc_ins.Specialization else '',
                        'PatientCategory': op.PatientCategory,
                        'AdmissionDate': op.created_at.strftime("%d-%m-%Y"),
                        'Address': ', '.join(filter(None, [
                            patient.DoorNo, patient.Street, patient.Area,
                            patient.City, patient.State, patient.Country, patient.Pincode
                        ])) or "No address available"
                    })
 
                    patient_ids_set.add(patient.PatientId)
            elif advance_type == 'IP':
                # IP Filter
                ip_filters = Q()
                if name_or_phone:
                    ip_filters |= Q(PatientId__FirstName__icontains=name_or_phone)
                if phone_no:
                    ip_filters |= Q(PatientId__PhoneNo__icontains=phone_no)
                if patient_id:
                    ip_filters |= Q(PatientId__PatientId__icontains=patient_id)
                if registration_id:
                    ip_filters &= Q(Registration_Id__icontains=registration_id)
 
                if date_type == "Current" and current_date:
                    ip_filters &= Q(created_at__date=current_date)
                elif date_type == "Customize" and from_date and to_date:
                    ip_filters &= Q(created_at__date__range=[from_date, to_date])
 
                ip_records = Patient_IP_Registration_Detials.objects.filter(ip_filters,Status__in=['Admitted','Pending']).select_related('PatientId')[:1000]
                print('ippppp',ip_records)
                for register in ip_records:
                    patient = register.PatientId
 
                    # Skip if already added as OP
                    if patient.PatientId in patient_ids_set:
                        continue
 
                    # Optional filters for doctor/speciality
                    if doctor and (not register.PrimaryDoctor or doctor.lower() not in register.PrimaryDoctor.First_Name.lower()):
                        continue
                    if speciality and (not register.Specialization or speciality.lower() not in register.Specialization.Speciality_Name.lower()):
                        continue
 
                    ip_data = {
                        'id': len(patient_list) + 1,
                        'type': "IP",
                        'RegistrationId': register.Registration_Id,
                        'PatientId': patient.PatientId,
                        'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                        'PhoneNo': patient.PhoneNo,
                        'Age': f"{patient.Age}/{patient.Gender}",
                        'Gender': patient.Gender,
                        'Complaint': register.Complaint,
                        'isMLC': register.IsMLC,
                        'isRefferal': register.IsReferral,
                        'Status': register.Status,
                        'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                        'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                        'PatientCategory': register.PatientCategory,
                        'AdmissionDate': register.created_at.strftime("%d-%m-%Y"),
                        'Address': ', '.join(filter(None, [
                            patient.DoorNo, patient.Street, patient.Area,
                            patient.City, patient.State, patient.Country, patient.Pincode
                        ])) or "No address available"
                    }
 
                    # Room details
                    if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
                        room = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_by').first()
                        if room and room.RoomId:
                            ip_data.update({
                                'BuildingName': room.RoomId.Building_Name.Building_Name,
                                'BlockName': room.RoomId.Block_Name.Block_Name,
                                'FloorName': room.RoomId.Floor_Name.Floor_Name,
                                'WardName': room.RoomId.Ward_Name.Ward_Name.Ward_Name,
                                'WardId': room.RoomId.Ward_Name.Ward_Name.Ward_Id,
                                'RoomNo': room.RoomId.Ward_Name.RoomNo,
                                'BedNo': room.RoomId.Bed_No,
                                'RoomId': room.RoomId.Room_Id,
                                'RoomDetails': f"{room.RoomId.Floor_Name.Floor_Name}-{room.RoomId.Ward_Name.Ward_Name.Ward_Name}-{room.RoomId.Ward_Name.RoomNo}/{room.RoomId.Bed_No}",
                            })
 
                    patient_list.append(ip_data)
 
            return JsonResponse(patient_list, safe=False)
 
        except Exception as e:
            print(str(e))
            return JsonResponse({'error': str(e)})
 
 
 


@csrf_exempt
def get_overall_advance_details(request):
    if request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            type = request.GET.get('Type')
            if type == 'OP':
                advance_ins = Advance_Collection_IP.objects.filter(OP_Register_Id__Registration_Id=registration_id)
            else:
                advance_ins = Advance_Collection_IP.objects.filter(IP_Register_Id__Registration_Id=registration_id)
           
            advance_total = []
            response_data = []
            TotalAmount = 0
           
            # Loop through all filtered records
            for idx, advance in enumerate(advance_ins, start=1):
                # Fetch payment details for the current advance record
               
               
                if advance.RegisterType == 'IP':
                    roomdetials = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=registration_id).order_by('-created_by').first()
                    TotalAmount += advance.AdvanceAmount
 
                    receiptins = IPBillingReceipt.objects.filter(pk = advance.IPBillingReceipt.pk).first()
 
 
                    payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No = receiptins)
 
                    print(payment_details,'payment_details')
                    payment_info = [
                        {
                            'PaymentType': payment.Payment_Type,
                            'CartType': payment.Cart_Type,
                            'CardNo': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'UPIId': payment.upiid,
                            'ChequeNo': payment.Cheque_No,
                            'BankName': payment.Bank_Name,
                            'TransactionAmount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                            'Amount': payment.Amount
                        } for payment in payment_details
                    ]
                    advance_ip = {
                        'id': idx,
                        'PatientId': advance.IP_Register_Id.PatientId.PatientId,
                        'PatientName': f"{advance.IP_Register_Id.PatientId.Title.Title_Name}.{advance.IP_Register_Id.PatientId.FirstName} {advance.IP_Register_Id.PatientId.MiddleName} {advance.IP_Register_Id.PatientId.SurName}" if advance.IP_Register_Id.PatientId.FirstName else None,
                        'RegistrationId': advance.IP_Register_Id.Registration_Id,
                        'PhoneNo': advance.IP_Register_Id.PatientId.PhoneNo,
                        'AgeGender' : f"""{advance.IP_Register_Id.PatientId.Age} / {advance.IP_Register_Id.PatientId.Gender}""",
                        'AdvanceAmount': advance.AdvanceAmount,
                        'AdvancePurpose': advance.AdvancePurpose,
                        'Advance_Desc': advance.Advance_Desc,
                        'AdvanceTime' : advance.created_at.strftime('%d-%m-%y %H:%M:%S'),
                        'Date': advance.created_at.strftime('%Y-%m-%d'),
                        'Time': advance.created_at.strftime('%H:%M:%S'),
                        'ReceivedBy': advance.created_by,
                        'TotalAmount': advance.AdvanceAmount,
                        'RoomDetails': f"{roomdetials.RoomId.Floor_Name.Floor_Name if roomdetials.RoomId else None}-{roomdetials.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdetials.RoomId else None}-{roomdetials.RoomId.Ward_Name.RoomNo if roomdetials.RoomId else None}/{roomdetials.RoomId.Bed_No if roomdetials.RoomId else None}",
                        'PaymentDetails': payment_info,
                        'Receiptno' : receiptins.Voucher_Number
                    }
                    advance_total.append(advance_ip)
               
                if advance.RegisterType == 'OP':
                    TotalAmount += advance.AdvanceAmount
 
                    receiptins = GeneralBillingReceipt.objects.filter(pk = advance.GeneralBillingReceipt.pk).first()
                    payment_details = Multiple_Payment_Table_Detials.objects.filter(Receipt_No_Paid = receiptins)
 
                    print(payment_details,'payment_details')
                    payment_info = [
                        {
                            'PaymentType': payment.Payment_Type,
                            'CartType': payment.Cart_Type,
                            'CardNo': payment.Card_No,
                            'TransactionId': payment.TransactionId,
                            'UPIId': payment.upiid,
                            'ChequeNo': payment.Cheque_No,
                            'BankName': payment.Bank_Name,
                            'TransactionAmount': payment.Transaction_Amount,
                            'AdditionalAmount': payment.AdditionalAmount,
                            'Amount': payment.Amount
                        } for payment in payment_details
                    ]
                    advance_ip = {
                        'id': idx,
                        'PatientId': advance.OP_Register_Id.PatientId.PatientId,
                        'PatientName': f"{advance.OP_Register_Id.PatientId.Title.Title_Name}.{advance.OP_Register_Id.PatientId.FirstName} {advance.OP_Register_Id.PatientId.MiddleName} {advance.OP_Register_Id.PatientId.SurName}" if advance.OP_Register_Id.PatientId.FirstName else None,
                        'RegistrationId': advance.OP_Register_Id.Registration_Id,
                        'PhoneNo': advance.OP_Register_Id.PatientId.PhoneNo,
                        'AgeGender' : f"""{advance.OP_Register_Id.PatientId.Age} / {advance.OP_Register_Id.PatientId.Gender}""",
                        'AdvanceAmount': advance.AdvanceAmount,
                        'AdvancePurpose': advance.AdvancePurpose,
                        'Advance_Desc': advance.Advance_Desc,
                        'AdvanceTime' : advance.created_at.strftime('%d-%m-%y %H:%M:%S'),
                        'Date': advance.created_at.strftime('%Y-%m-%d'),
                        'Time': advance.created_at.strftime('%H:%M:%S'),
                        'ReceivedBy': advance.created_by,
                        'TotalAmount': advance.AdvanceAmount,
                        'PaymentDetails': payment_info,
                        'Receiptno' : receiptins.Voucher_Number

                    }
                    advance_total.append(advance_ip)
           
            # Adding the Total Advance Amount to the response
            total_advance_amount = advance_ins.aggregate(total=Sum('AdvanceAmount'))['total'] or 0
            response_data = {
                'AdvanceDetails': advance_total,
                'TotalAdvanceAmount': total_advance_amount,
            }
            return JsonResponse(response_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
 
 
 
 



def get_Insurance_amount(request):
    if request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            PatientCategory = request.GET.get('PatientCategory')
            print("0000000", registration_id)
            
            # Assuming you have the model for the registration
            # Replace 'YourModel' with the actual model name for registration
            if PatientCategory == 'Insurance':
                content_type = ContentType.objects.get_for_model(Patient_IP_Registration_Detials)
                
                single_ins = Insuranse_Patient_Entery_Details.objects.get(
                    content_type=content_type,
                    object_id=registration_id
                )
                
                print('121211222', single_ins)
                
                insurance_data = {
                    'PreAuthDate': single_ins.PreAuthDate,
                    'PreAuthAmount': single_ins.PreAuthAmount,
                    'DischargeDate': single_ins.DischargeDate,
                    'FinalBillAmount': single_ins.FinalBillAmount,
                    'RaisedAmount': single_ins.RaisedAmount,
                    'ApprovedAmount': single_ins.ApprovedAmount,
                    'CourierDate': single_ins.CourierDate,
                    'SettlementDateCount': single_ins.SettlementDateCount,
                    'TdsPercentage': single_ins.TdsPercentage,
                    'TdsAmount': single_ins.TdsAmount,
                    'FinalSettlementAmount': single_ins.FinalSettlementAmount,
                    'CoPaymentCoverage': single_ins.IsCopayment,
                    'insurancetype': single_ins.InsuranceType or '',
                    'policynumber': single_ins.PolicyNumber or '',
                }
                return JsonResponse(insurance_data, safe=False)
            elif PatientCategory == 'Client':
                content_type = ContentType.objects.get_for_model(Patient_IP_Registration_Detials)
                
                Single_Ins = Client_Patient_Entry_Details.objects.get(
                    content_type=content_type,
                    object_id=registration_id
                )
                
                print('121211222', Single_Ins)
                
                insurance_data = {
                    'PreAuthDate': Single_Ins.PreAuthDate,
                    'PreAuthAmount': Single_Ins.PreAuthAmount,
                    'DischargeDate': Single_Ins.DischargeDate,
                    'FinalBillAmount': Single_Ins.FinalBillAmount,
                    'RaisedAmount': Single_Ins.RaisedAmount,
                    'ApprovedAmount': Single_Ins.ApprovedAmount,
                    'CourierDate': Single_Ins.CourierDate,
                    'SettlementDateCount': Single_Ins.SettlementDateCount,
                    'TdsPercentage': Single_Ins.TdsPercentage,
                    'TdsAmount': Single_Ins.TdsAmount,
                    'FinalSettlementAmount': Single_Ins.FinalSettlementAmount,
                    'CoPaymentCoverage': Single_Ins.IsCopayment,
                    'AmountArray': []
                }
                return JsonResponse(insurance_data, safe=False)
            
        except Exception as e:
            return JsonResponse({'error': str(e)})


@csrf_exempt
def risk_management_list(request):
    if request.method == 'GET':
        try:
            location = request.GET.get('location')
            Status = request.GET.get('Status','Admitted')
            searchBy = request.GET.get('searchBy')
                
            patient_ins=Patient_IP_Registration_Detials.objects.filter(
            ( Q(PatientId__PatientId__icontains=searchBy)|
                Q(PatientId__PhoneNo__icontains=searchBy)|
                Q(PatientId__FirstName__icontains=searchBy)) &
                Q(Status=Status,Location=location) 
            )
            print('patient_ins',patient_ins)
            # patient_ins = Patient_IP_Registration_Detials.objects.all()
            ip_bill_service_data_list = []  # To collect data for all patients

            
            
            for patient in patient_ins:
                Patientcategory = patient.PatientCategory
                services_ins = Services_SubCat_Requests_Details.objects.filter(Registration_Id=patient.Registration_Id)
                # print('services_ins', services_ins)
                
                services_list = []
                cumulative_service_rate = 0
                cumulative_consultation = 0
                cumulative_lab = 0
                cumulative_radiology = 0
                cumulative_general_services = 0


                for datas in services_ins:

                    serviceid = datas.service_category_id
                    category_ins = Service_Category_Masters.objects.get(pk=serviceid)

                    print(serviceid,'serviceid',category_ins,'category_ins')
                    if category_ins.ServiceCategory == 'ROOMSERVICES':

                
                        Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
                        ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
                        data_list = {
                                'id':datas.pk,
                                'category': category_ins.ServiceCategory,
                                'service_subcategory' : f'{ward_ins.RoomNo} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}',         
                                'rate':datas.rate,
                                'Units':datas.units,
                                'Date':datas.created_at.strftime('%d-%m-%Y %I:%M %p')
                        }
                        services_list.append(data_list)


                    elif category_ins.ServiceCategory == 'CONSULTATION':

                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id)
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        


                        if patient.PatientCategory.upper() == 'GENERAL':

                            print('hfgfffdg')


                            if patient.PatientId.PatientType.upper() == 'GENERAL':

                                print('utfvjhbk',consultaion_ins,datas.Wardid)

                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins,ward=datas.Wardid).first()
                                print(wardfee,'wardfee444444444')
                                consultation_amount = wardfee.General_fee * datas.units
                                cumulative_consultation += consultation_amount

                            elif patient.PatientId.PatientType.upper() == 'GOVT' or patient.PatientId.PatientType.upper() == 'VIP':


                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins,ward=datas.Wardid).first()
                                consultation_amount = wardfee.Special_fee * datas.units
                                cumulative_consultation += consultation_amount


                            else:
                                print('utfvjhbk13122')

                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins,ward=datas.Wardid).first()
                                consultation_amount = wardfee.General_fee * datas.units
                                cumulative_consultation += consultation_amount

                        elif  patient.PatientCategory.upper() == 'INSURANCE':

                            insurancefee = InsuranceFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins,insurance=patient.InsuranceName).first()
                            consultation_amount = insurancefee.Consultation_Fee * datas.units
                            cumulative_consultation += consultation_amount

                        elif  patient.PatientCategory.upper() == 'CLIENT':

                            clientfee = ClientFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins,client=patient.ClientName).first()
                            consultation_amount = clientfee.Consultation_Fee * datas.units
                            cumulative_consultation += consultation_amount


                        




                        data_list = {
                                'id':datas.pk,
                                'VoucherNo': datas.Voucher_Number,
                                'category': category_ins.ServiceCategory,
                                'service_subcategory' : f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name})',
                                'rate':consultation_amount,
                                'Units':datas.units,
                                'Date':datas.created_at.strftime('%d-%m-%Y')
                            }
                        services_list.append(data_list)    
                        print('serviceeee',services_list)  
                    elif category_ins.ServiceCategory == 'GENERALSERVICES':

                        General_services_ins  = Service_Master_Details.objects.get(pk=datas.object_id)
                        services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
                        # general_service_amount = datas.rate * datas.units
                        # cumulative_general_services += general_service_amount

                        if patient.PatientCategory.upper() == 'GENERAL':

                            if patient.PatientId.PatientType.upper() == 'GENERAL':

                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard,ward=datas.Wardid).first()
                                general_service_amount = Wardfee.General_fee * datas.units
                                cumulative_general_services += general_service_amount

                            elif patient.PatientId.PatientType.upper() == 'GOVT' or patient.PatientId.PatientType.upper() == 'VIP':

                                wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard,ward=datas.Wardid).first()
                                general_service_amount = wardfee.Special_fee * datas.units
                                cumulative_general_services += general_service_amount

                            else:

                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard,ward=datas.Wardid).first()
                                general_service_amount = Wardfee.General_fee * datas.units
                                cumulative_general_services += general_service_amount

                        elif  patient.PatientCategory.upper() == 'INSURANCE':

                            print('INSURANCEuuuu')

                            insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard,Insurance=patient.InsuranceName).first()
                            general_service_amount = insurancefee.Fee * datas.units
                            cumulative_general_services += general_service_amount

                            print(insurancefee,'insurancefee')
                            print(general_service_amount,'general_service_amount')
                            print(cumulative_general_services,'cumulative_general_services')

                        elif patient.PatientCategory.upper() == 'CLIENT':

                            clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard,Client=patient.ClientName).first()
                            general_service_amount = clientfee.Fee * datas.units
                            cumulative_general_services += general_service_amount
 

                        data_list = {
                                'id':datas.pk,
                                'VoucherNo': datas.Voucher_Number,
                                'category': category_ins.ServiceCategory,
                                'service_subcategory':General_services_ins.Service_Name,
                                'rate':general_service_amount,
                                'Units':datas.units,
                                'Date':datas.created_at.strftime('%d-%m-%Y')
                            }
                        services_list.append(data_list)
                        print('generalllserrrr',services_list)  
                    elif category_ins.ServiceCategory == 'PROCEDURES':

                        General_services_ins  = Procedure_Master_Details.objects.get(pk=datas.object_id)
                        general_service_amount = datas.rate * datas.units
                        cumulative_general_services += general_service_amount
                        data_list = {
                                'id':datas.pk,
                                'VoucherNo': datas.Voucher_Number,
                                'category': category_ins.ServiceCategory,
                                'service_subcategory':General_services_ins.Procedure_Name,
                                'rate':datas.rate,
                                'Units':datas.units,
                                'Date':datas.created_at.strftime('%d-%m-%Y')
                            }
                        services_list.append(data_list)
                        print('prooceeeddd',services_list)  

                    # elif category_ins.ServiceCategory == 'LAB':

                    

                    #     labtest_ins = Testmaster_Cost_List.objects.get(pk=datas.object_id)
                    #     lab_amount = datas.rate * datas.units
                    #     cumulative_lab += lab_amount
                    #     data_list = {
                    #             'id':datas.pk,
                    #             'category': category_ins.ServiceCategory,
                    #             'service_subcategory': f'{labtest_ins.Test_Code.Test_Code} - {labtest_ins.Test_Code.Test_Name}' if labtest_ins.Test_Code else labtest_ins.Group_Code.Group_Name,
                    #             'rate':datas.rate,
                    #             'Units':datas.units,
                    #         }
                    #     services_list.append(data_list)

                    # elif category_ins.ServiceCategory == 'RADIOLOGY':

                    

                    #     Radiology_ins = TestName_Details.objects.get(pk=datas.object_id)
                    #     radiology_amount = datas.rate * datas.units
                    #     cumulative_radiology += radiology_amount
                    #     data_list = {
                    #             'id':datas.pk,
                    #             'category': category_ins.ServiceCategory,
                    #             'service_subcategory':f'{Radiology_ins.Test_Code} - {Radiology_ins.Test_Name}',
                    #             'rate':datas.rate,
                    #             'Units':datas.units,
                    #         }
                    #     services_list.append(data_list)

                    cumulative_service_rate += datas.rate * datas.units
                    print('cummmm',cumulative_service_rate)
                 
                   
                for idx, services in enumerate(services_list, start=1):
                        services["Sno"] = idx
 
               
                roomdatas = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__pk= patient.Registration_Id, Status=True, IsStayed=True
                ).exclude(Iscanceled=True, CurrentlyStayed=True)

                print(roomdatas,'roomdatas')

                emp_datas = {
                    'RoomDatas': [],
                    'NurseCharges': [],
                    'DutyDoctorCharges': [],
                    'CumulativeDays': 0,
                    'CumulativeHours': 0,
                    'CumulativeTotalAmount': 0,
                    'CumulativeDaysHours': '',  # To hold combined days and hours
                }
 
                cumulative_days = 0
                cumulative_hours = 0
                cumulative_total_amount = 0
               
                for room in roomdatas:
           
                    admitted_date = room.Admitted_Date  
                    discharge_date = room.Discharge_Date if room.Discharge_Date else None
 
                    if discharge_date:
                        difference = discharge_date - admitted_date
                        days = difference.days  # Total number of full days
                        hours, remainder = divmod(difference.seconds, 3600)  # Total hours
                    else:
                        current_datetime = timezone.now()  # Get current time for ongoing admissions
                        difference = current_datetime - admitted_date
                        days = difference.days
                        hours, remainder = divmod(difference.seconds, 3600)
 
 
 
                    # Define hours-to-charge logic
                    if hours > 12:
                        hours_to_charge = 24
                    # elif hours > 6:
                    #     hours_to_charge = 12
                    # elif hours > 3:
                    #     hours_to_charge = 6
                    # elif hours > 2:
                    #     hours_to_charge = 3
                    else:
                        hours_to_charge = 12  # If less than or equal to 2 hours, charge actual hours
 
                    # Format date range
                    admitted_date_str = admitted_date.strftime('%d-%m-%y / %I-%M %p')
                    discharge_date_str = discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else "Currently Admitted"
                    date_range = f"{admitted_date_str} - {discharge_date_str}"
 
                    # Calculate room charge
 
                    total_amount = 0
                    nursecharges = 0
                    Doctorcharges = 0

                    print(Patientcategory,'Patientcategory123')
 
                    if Patientcategory == 'General':
 
 
                        generalrate = RoomType_Master_Detials.objects.filter(Room_Id=room.RoomId.Ward_Name.Room_Id).first()
 
                        if  generalrate.Ward_Name.isAC:
 
                            room_charge_per_hour = generalrate.Ward_Name.Acamt / 24
                            total_amount = (days * generalrate.Ward_Name.Acamt) + (hours_to_charge * room_charge_per_hour) 
                            nursecharges = generalrate.Ward_Name.NurseCharges
                            Doctorcharges = generalrate.Ward_Name.DoctorCharges     
 
                        else:
 
                            room_charge_per_hour = generalrate.Ward_Name.Amount / 24
                            total_amount = (days * generalrate.Ward_Name.Amount) + (hours_to_charge * room_charge_per_hour)
                            nursecharges = generalrate.Ward_Name.NurseCharges
                            Doctorcharges = generalrate.Ward_Name.DoctorCharges 
                           
                    elif Patientcategory == 'Insurance':

                        print('insurancerateeeeeeeeeeeeeeeeee',room.RoomId.Ward_Name.Room_Id)
 
                        generalrate = RoomType_Master_Detials.objects.filter(Room_Id=room.RoomId.Ward_Name.Room_Id).first()
                        print(generalrate,'generalrate')
                        insurancerate = Insurance_Ward_Fee.objects.filter(Ward_Ratecard=generalrate.Ward_Name).first()
 
                        if  generalrate.Ward_Name.isAC:
 
                            room_charge_per_hour = insurancerate.AC_Fee / 24
                            total_amount = (days * insurancerate.AC_Fee) + (hours_to_charge * room_charge_per_hour)  
                            nursecharges = generalrate.Ward_Name.NurseCharges
                            Doctorcharges = generalrate.Ward_Name.DoctorCharges     
 
                        else:
 
                            room_charge_per_hour = insurancerate.Fee / 24
                            total_amount = (days * insurancerate.Fee) + (hours_to_charge * room_charge_per_hour)
                            nursecharges = generalrate.Ward_Name.NurseCharges
                            Doctorcharges = generalrate.Ward_Name.DoctorCharges 
 
                    elif Patientcategory == 'Client':

                        print('westttttttttt')
 
                        generalrate = RoomType_Master_Detials.objects.filter(Room_Id=room.RoomId.Ward_Name.Room_Id).first()
                        clientrate = Client_Ward_Fee.objects.filter(Ward_Ratecard=generalrate.Ward_Name).first()
 
                        if  generalrate.Ward_Name.isAC:
 
                            room_charge_per_hour = clientrate.AC_Fee / 24
                            total_amount = (days * clientrate.AC_Fee) + (hours_to_charge * room_charge_per_hour)    
                            nursecharges = generalrate.Ward_Name.NurseCharges
                            Doctorcharges = generalrate.Ward_Name.DoctorCharges   

                            print(nursecharges,'nursecharges',Doctorcharges,'Doctorcharges')
 
                        else:
 
                            room_charge_per_hour = clientrate.Fee / 24
                            total_amount = (days * clientrate.Fee) + (hours_to_charge * room_charge_per_hour)
                            nursecharges = generalrate.Ward_Name.NurseCharges
                            Doctorcharges = generalrate.Ward_Name.DoctorCharges 

                            print(nursecharges,'nursecharges',Doctorcharges,'Doctorcharges')

 
 
 

                    # Update cumulative totals
                    cumulative_days += days
                    cumulative_hours += hours
                    cumulative_total_amount += total_amount
 
                    # Construct room details object
                    roomdetials = {
                        'id': len(emp_datas['RoomDatas']) + 1,
                        "WardName": room.RoomId.Ward_Name.Ward_Name.Ward_Name,
                        "RoomName": room.RoomId.Ward_Name.Ward_Name.Ward_Name,
                        "Room_No": room.RoomId.Ward_Name.RoomNo,
                        "Bed_No": room.RoomId.Bed_No,
                        "Charge": int(total_amount),
                        "Amount": int(total_amount),
                        "Total_Current_Charge": round(total_amount, 2),
                        "Admitted_Date": admitted_date_str,
                        "Discharge_Date": discharge_date_str,
                        "Days": f"{days} days, {hours} hours",
                        "DateRange": date_range,  # New field added
                        "Total_amount": round(total_amount, 2),
                        'isReimbursable': 'Yes',
                        'nursecharges':nursecharges,
                        'Doctorcharges':Doctorcharges
                    }
                   
          
                    emp_datas['RoomDatas'].append(roomdetials)
              

 
                # Update cumulative totals in response
                emp_datas['CumulativeDays'] = cumulative_days
                emp_datas['CumulativeHours'] = cumulative_hours
                emp_datas['CumulativeTotalAmount'] = round(cumulative_total_amount, 2)
                emp_datas['CumulativeDaysHours'] = f"{cumulative_days} days, {cumulative_hours} hours"

                print('rooommmmddddddddddddd')
                pharmacy_list = []
                # Filter the payments based on Billpay_method="Due" and Patient_Id_id=provided Patient_Id
                pharmacy_details = IP_Pharmacy_Billing_Table_Detials.objects.filter(
                    Bill_Status = "Due",
                    Patient_Id= patient.PatientId.PatientId,
                    Register_Id = patient.Registration_Id
                )
                for pharm in pharmacy_details:
                    item_ins = IP_BillingItem.objects.filter(Billing = pharm.Billing_Invoice_No)
                    print('pharmacy_details',item_ins)
                    for item in item_ins:
                        data_list = {
                                        'id':item.pk,
                                        'VoucherNo':item.Billing.Billing_Invoice_No,
                                        'category': 'Pharmacy',
                                        'service_subcategory': item.ItemName,
                                        'rate':item.Unit_Price,
                                        'total':item.Total,
                                        'Units': item.Billing_Quantity,
                                        'Date': item.Billing.created_at.strftime('%d-%m-%Y'),
                                        'isReimbursable': item.Reimbursable,
                                    }
                        print('dataaaa',data_list)
                        pharmacy_list.append(data_list)
                print('pharmaaaaaaa')
                ot_ins = OT_Billing.objects.filter(IP_Registration_Id = patient.Registration_Id)
                print('otttt',ot_ins)
                OT_list = []
    
                for datas in ot_ins:
    
                    data_list = {
    
                        'id':datas.pk,
                        'category': 'OT',
                        'service_subcategory':f"""{datas.Service_name}({datas.Name})""" ,
                        'rate':datas.Amount,
                        'Units':datas.Quantity,
                        'Date':datas.created_at.strftime('%d-%m-%Y'),
                        'isReimbursable': 'Yes'
                    }
                    OT_list.append(data_list)
    

                Labins = BillingInvoiceAndBillAmount.objects.filter(Registration_Id=patient.Registration_Id,Status='Due')
                Lab_list = []
                sno = 0

                for labdata in Labins:

                    sno = sno + 1

                    itemins = Billing_Item_Table_for_lab.objects.filter(Billing_Invoice=labdata.Billing_Invoice)

                    for datas in itemins:
        
                        if datas.Test_Method == "individual":
                            test_data = Testmaster_Cost_List.objects.get(Test_Code__Test_Code=datas.Test_Code)
                            print('test')
                            data_list = {
                                'id':sno,
                                'Requestid':labdata.pk,
                                'category': 'LAB',
                                'service_subcategory':datas.Test_Name,
                                'servicecode': datas.Test_Code,
                                'rate':test_data.Basic,
                                'Units':1,
                                'Date':datas.CreatedAt.strftime('%d-%m-%Y'),
                                'isReimbursable': 'Yes'
                            }
                            Lab_list.append(data_list)

                        elif datas.Test_Method == "group":
        
                            Grpins = Group_Master.objects.filter(Group_Code = datas.Group_Code).first()
                            amt = datas.Gross_Amount
        
                            data_list = {
        
                                'Requestid':labdata.pk,
                                'category': 'LAB',
                                'service_subcategory':datas.Group_Name,
                                'servicecode':datas.Group_Code,
                                'rate':amt,
                                'Units':1,
                                'Date':datas.CreatedAt.strftime('%d-%m-%Y'),
                                'isReimbursable': 'Yes',
                                'id':sno,
                            }
                            Lab_list.append(data_list)
        
                            break
        
                        elif datas.Test_Method == "Offers":
        
                            pkgins = OfferPackageMaster.objects.filter(package_code = datas.PackageCode).first()
                            amt = datas.Gross_Amount
        
                            data_list = {
        
                                'Requestid':labdata.pk,
                                'category': 'LAB',
                                'service_subcategory':datas.PackageName,
                                'servicecode': datas.PackageCode,
                                'rate':amt,
                                'Units':1,
                                'Date':datas.CreatedAt.strftime('%d-%m-%Y'),
                                'isReimbursable': 'Yes',
                                'id':sno,
                            }
                            Lab_list.append(data_list)
        
                            break
        
                radins = Radiology_Request_Details.objects.filter(IP_Register_Id__Registration_Id=patient.Registration_Id,Status__in=['Due'])
                print('yvuv',radins)
                Rad_list = []
                sno = 0

                for datas in radins:
                    if datas.Interim_Billing_Invoice_No != '':
                        sno = sno + 1

                        Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
                        Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

                        data_list = {

                            'sno':sno,
                            'VoucherNo':datas.Interim_Billing_Invoice_No.Billing_Invoice_No if datas.Interim_Billing_Invoice_No else "",
                            'category': 'RADIOLOGY',
                            'service_subcategory':f"""{Dep.Radiology_Name}({Test.Test_Name})""" ,
                            'servicecode':datas.SubTestCode,
                            'rate':Test.Amount,
                            'Units':1,
                            'Date':datas.created_at.strftime('%d-%m-%Y'),
                            'isReimbursable': 'Yes',
                            'Requestid':datas.pk
                        }
                        Rad_list.append(data_list)

                radins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Register_Id__Registration_Id=patient.Registration_Id).exclude(Service_Type__in = ["RADIOLOGY","Radiology",'LAB','Lab'])
                print('interimmmmm',radins)
                Interim_list = []
                sno = 0

                for datas in radins:
                    sno = sno + 1
                    data_list = {
                        'sno':sno,
                        'VoucherNo':datas.Billing_Invoice_No.Billing_Invoice_No,
                        'category': datas.Service_Type,
                        'service_subcategory': datas.Service_Name,
                        'servicecode':datas.Service_Code,
                        'rate':Test.Amount,
                        'Units':1,
                        'Date':datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y'),
                        'isReimbursable': 'Yes',
                    }
                    Interim_list.append(data_list)
            

                categoryname = ''
                categoryid = ''
                if patient.PatientCategory == 'Insurance':
                    categoryname = patient.InsuranceName.Insurance_Name
                    categoryid = patient.InsuranceName.Insurance_Id
                elif patient.PatientCategory == 'Client':
                    categoryname = patient.ClientName.Client_Name
                    categoryid = patient.ClientName.Client_Id
                else:
                    categoryname = ''
                
                Patient_data = {
                    'PatientId': patient.PatientId.PatientId,
                    'PatientName': f"{patient.PatientId.FirstName} {patient.PatientId.MiddleName} {patient.PatientId.SurName}",
                    'RegistrationId': patient.Registration_Id,
                    'PhoneNo': patient.PatientId.PhoneNo,
                    'AgeGender': f"{patient.PatientId.Age} / {patient.PatientId.Gender}",
                    'Doctor_name': f"{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.ShortName}",
                    'Status': patient.Status,
                    'PatientCategory' : f"""{patient.PatientCategory} / {categoryname}""" if patient.PatientCategory in ['Insurance', 'Client'] else patient.PatientCategory,
                    # 'PatientCategoryName' : categoryname,
                }
                total_advance_amount = 0
                if patient.PatientCategory == 'General':
                    patient_advance = Advance_Collection_IP.objects.filter(IP_Register_Id__Registration_Id=patient.Registration_Id)
                    print('patientadvvvv',patient_advance)
                    total_advance_amount = patient_advance.aggregate(total=Sum('AdvanceAmount'))['total'] or 0
                # elif patient.PatientCategory == 'Insurance':
                #     content_type = ContentType.objects.get_for_model(Patient_IP_Registration_Detials)
                #     patient_advance = Insuranse_Patient_Entery_Details.objects.get(content_type=content_type,object_id=patient.Registration_Id)
                #     # total_advance_amount = patient_advance.FinalSettlementAmount
                # elif patient.PatientCategory == 'Client':
                #     content_type = ContentType.objects.get_for_model(Patient_IP_Registration_Detials)
                #     patient_advance = Client_Patient_Entry_Details.objects.get(content_type=content_type,object_id=patient.Registration_Id)
                #     total_advance_amount = patient_advance.FinalSettlementAmount
                    # print('patient_advance', patient_advance)
                    # print('patient', patient.Registration_Id)
                ip_bill_service_data = {
                    'Patient_data':Patient_data,
                    'Room_data': emp_datas,
                    'services': services_list,
                    'OT_data' : OT_list,
                    'Lab_list': Lab_list,
                    'Rad_list':Rad_list,
                    'CumulativeConsultation': round(cumulative_consultation, 2),
                    'CumulativeLab': round(cumulative_lab, 2),
                    'CumulativeRadiology': round(cumulative_radiology, 2),
                    'CumulativeGeneralServices': round(cumulative_general_services, 2),
                    # 'Cumulative_Service_Rate': round(cumulative_service_rate, 2),
                    # 'Cumulative_Room_Rate': round(cumulative_total_amount, 2),
                    'Total_Cumulative_Amount': round(cumulative_consultation + cumulative_general_services + cumulative_lab + cumulative_radiology, 2),
                    'Total_Advance_Amount': round(total_advance_amount,2),
                }
                    # print('ipppppppppp', ip_bill_service_data)
                ip_bill_service_data_list.append(ip_bill_service_data)  # Collect all patients' data

            return JsonResponse(ip_bill_service_data_list, safe=False)  # Return the list of data for all patients

        except Exception as e:
            return JsonResponse({'error': str(e)})
      


@csrf_exempt
def IP_Billing_Report(request):
    if request.method == 'GET':
        try:
            # Retrieve query parameters
            SearchbyFirstName = request.GET.get('SearchbyFirstName')
            SearchbySpeciality = request.GET.get('SearchbySpeciality')
            SearchbyDoctor = request.GET.get('SearchbyDoctor')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')  
            FromDate = request.GET.get('FromDate')  
            ToDate = request.GET.get('ToDate')
            SearchTimeOrderby = request.GET.get('SearchTimeOrderby')
            status_filter = request.GET.get('SearchStatus')

            print('status_filter:', status_filter)
            print('Date:', CurrentDate)
            
            # Build dynamic filter query
            search_query = Q()
            
            if SearchbyFirstName:
                search_query &= Q(created_by__icontains=SearchbyFirstName)
            if SearchbySpeciality:
                search_query &= Q(Register_Id__Specialization__Speciality_Id__icontains=SearchbySpeciality)
            if SearchbyDoctor:
                search_query &= Q(Doctor_Id__Doctor_ID__icontains=SearchbyDoctor)
            if status_filter:
                search_query &= Q(Bill_Status=status_filter)

            if DateType == "Current" and CurrentDate:
                search_query &= Q(Billing_Date=CurrentDate)
            elif DateType == "Customize":
                if FromDate and ToDate:
                    search_query &= Q(Billing_Date__range=[FromDate, ToDate])
                elif FromDate:
                    search_query &= Q(Billing_Date__gte=FromDate)
                elif ToDate:
                    search_query &= Q(Billing_Date__lte=ToDate)

            general_billing_data = IP_Billing_Table_Detials.objects.filter(search_query)

            # Apply ordering dynamically
            if SearchTimeOrderby:
                if SearchTimeOrderby.lower() == 'order':
                    general_billing_data = general_billing_data.order_by('Billing_Date')  # Ascending
                elif SearchTimeOrderby.lower() == 'disorder':
                    general_billing_data = general_billing_data.order_by('-Billing_Date')  # Descending

            invoice_numbers = general_billing_data.values_list('Billing_Invoice_No', flat=True)

            payment_summary = (
                Multiple_Payment_Table_IP_Detials.objects
                .filter(Invoice_No__Invoice_NO__in=invoice_numbers)
                .annotate(
                    adjusted_amount=Case(
                        When(
                            Payment_Type='Card',
                            then=ExpressionWrapper(
                                F('Amount') + (F('Amount') * F('Transaction_Amount') / 100.0),
                                output_field=FloatField()
                            )
                        ),
                        default=ExpressionWrapper(F('Amount'), output_field=FloatField()),
                        output_field=FloatField()
                    )
                )
                .values('Payment_Type')
                .annotate(
                    total_amount=Sum('adjusted_amount', output_field=FloatField())
                )
            )
            payment_totals_by_type = {item['Payment_Type']: f"{item['total_amount']:.2f}" for item in payment_summary}

            # **Ensure response is initialized before the loop**
            response = {
                "total_paid_amount": general_billing_data.aggregate(total_paid=Sum('Net_Paid_Amount'))['total_paid'] or 0,
                "payment_totals_by_type": payment_totals_by_type,
                "billing_data": []
            }

            for row in general_billing_data:
                full_name = f"""{row.Patient_Id.FirstName} {row.Patient_Id.MiddleName or ''} {row.Patient_Id.SurName}""".strip()

                billing_details = {
                    'id': row.Billing_Invoice_No,
                    'Type': 'OPEdit',
                    'Billing_Date': row.Billing_Date,
                    'Doctor_Id': row.Doctor_Id.Doctor_ID,
                    'Doctor_Name': row.Doctor_Id.ShortName,
                    'PatientId': row.Patient_Id.PatientId,
                    'Patient_Name': full_name,
                    'PhoneNo': row.Patient_Id.PhoneNo,
                    'Register_Id': row.Register_Id.Registration_Id,
                    'Gender': row.Register_Id.PatientId.Gender,
                    'City': row.Register_Id.PatientId.City,
                    'State': row.Register_Id.PatientId.State,
                    'Pincode': row.Register_Id.PatientId.Pincode,
                    'AgeGender': f'{row.Register_Id.PatientId.Age}/{row.Register_Id.PatientId.Gender}',
                    'Address': f'{row.Register_Id.PatientId.DoorNo}, {row.Register_Id.PatientId.Street}, {row.Register_Id.PatientId.Area}, {row.Register_Id.PatientId.City}, {row.Register_Id.PatientId.State}, {row.Register_Id.PatientId.Country}, {row.Register_Id.PatientId.Pincode}',
                    'PatientCategory': row.Register_Id.PatientCategory,
                    'PatientCategoryName': (
                        row.Register_Id.InsuranceName.Insurance_Name
                        if row.Register_Id.PatientCategory == 'Insurance'
                        else getattr(row.Register_Id.ClientName, 'Client_Name', None)
                    ),
                    'Billing_Type': row.Billing_Type,
                    'TotalItems': row.Total_Items,
                    'TotalQty': row.Total_Qty,
                    'RoundOff': row.Round_Off,
                    'TotalAmount': row.Total_Amount,
                    'Net_Amount': row.Net_Amount,
                    'PaidAmount': row.Paid_Amount,
                    'PaidNetAmount': row.Net_Paid_Amount,
                    'BalanceAmount': row.Balance_Amount,
                    'Bill_Status': row.Bill_Status,
                    'Billing_Items': [],
                    'Payment_Details': [],
                }
                print('rowwwwww',row.Billing_Invoice_No)

                # Aggregate total payment amount grouped by Payment_Type
                # Fetch related payment details
                payment_details = Multiple_Payment_Table_IP_Detials.objects.filter(Invoice_No__Invoice_NO__Billing_Invoice_No=row.Billing_Invoice_No)
                print('payyyyyy',payment_details)
                for payment in payment_details:
                    payment_info = {
                        'Payment_Type': payment.Payment_Type,
                        'Card_Type': payment.Cart_Type,
                        'Card_No': payment.Card_No,
                        'TransactionId': payment.TransactionId,
                        'upiid': payment.upiid,
                        'Cheque_No': payment.Cheque_No,
                        'Bank_Name': payment.Bank_Name,
                        'Amount': payment.Amount,
                        'Transaction_Amount': payment.Transaction_Amount,
                        'AdditionalAmount': payment.AdditionalAmount,
                    }
                    print('cuvvjbjv')
                    billing_details['Payment_Details'].append(payment_info)
                print('dgergerg')
                response["billing_data"].append(billing_details)

            return JsonResponse(response, safe=False)
        except Exception as e:
            print({'error': str(e)})
            return JsonResponse({'error': str(e)})


@method_decorator(csrf_exempt, name = 'dispatch')
class Risk_Management_Items(View):
    def get(self,request):
        try:
            RegistrationId = request.GET.get('Registration_Id')
            
            print('Regissss',RegistrationId)
            ip_bill_ins = IP_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id = RegistrationId)
            print('ipppp',ip_bill_ins)
            response_data = self.get_table_details(ip_bill_ins)
            if not ip_bill_ins:
                response_data =[]
            return JsonResponse(response_data,safe= False)
        except Exception as e:
            return JsonResponse({'error': str(e)})

    def get_table_details(self,ip_bill_ins):
        # billing_data = []

        for bill in ip_bill_ins:
            print('bill',bill)
            patient = bill.Patient_Id
            room_detail = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=bill.Register_Id.Registration_Id).last()

            ward_name = room_detail.RoomId.Ward_Name.Ward_Name.Ward_Name if room_detail and room_detail.RoomId and room_detail.RoomId.Ward_Name else None
            bedno = room_detail.RoomId.Bed_No if room_detail and room_detail.RoomId else None

            full_name = f"""{bill.Patient_Id.Title.Title_Name}.{bill.Patient_Id.FirstName} {bill.Patient_Id.MiddleName} {bill.Patient_Id.SurName}"""
            formatted_date = bill.created_at.strftime("%Y-%m-%d") if bill.created_at else None

            # Category
            if bill.Register_Id.PatientCategory == 'Insurance':
                categoryname = bill.Register_Id.InsuranceName.Insurance_Name if bill.Register_Id.PatientCategory == 'Insurance' else ''
                categoryid = bill.Register_Id.InsuranceName.Insurance_Id
            elif bill.Register_Id.PatientCategory == 'Client':
                categoryname = bill.Register_Id.ClientName.Client_Name if bill.Register_Id.PatientCategory == 'Client' else ''
                categoryid = bill.Register_Id.ClientName.Client_Id
            else:
                categoryname = None
                categoryid = None
            total_items = 0
            total_qty = 0
            totalAmount = 0
            paid_amount = 0

            total_items += bill.Total_Items
            total_qty += bill.Total_Qty
            totalAmount += bill.Net_Amount
            paid_amount += bill.Paid_Amount

            Bill_item = IP_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Billing_Invoice_No = bill.Billing_Invoice_No)

            advance_ins = Advance_Collection_IP.objects.filter(IP_Register_Id__Registration_Id=bill.Register_Id.Registration_Id)
            print('advvvvvaaaa',advance_ins)
            billing_data = {
                'Patient_Id': bill.Patient_Id.PatientId,
                'Registration_Id': bill.Register_Id.Registration_Id,
                'Patient_Name' : full_name,
                'Total_Items' : total_items,
                'Total_Qty' : total_qty,
                'Net_Amount' : totalAmount,
                'Paid_Amount' : paid_amount,
                'PatientCategory' : f"""{bill.Register_Id.PatientCategory}/{categoryname} """ if bill.Register_Id.PatientCategory != 'General' else bill.Register_Id.PatientCategory,
                'Date' : formatted_date,
                'Item_details': [{
                        'Service_Type': i.Service_Type,
                        'Service_Name': i.Service_Name,
                        'Rate': i.Rate,
                        'Charge': i.Charge,
                        'Quantity': i.Quantity,
                        'Amount': i.Amount,
                        'Discount_Type': i.Discount_Type,
                        'Discount_Value': i.Discount_Value,
                        'Discount_Amount': i.Discount_Amount,
                        'Taxable_Amount': i.Taxable_Amount,
                        'Tax_Amount': i.Tax_Amount,
                        'Total_Amount': i.Total_Amount,
                    } for i in Bill_item],
                'AdvanceCollections': {
                    'TotalAdvance': sum(i.AdvanceAmount for i in advance_ins),
                    'Advance_Items': [
                        {
                            'Advance_Amount': i.AdvanceAmount,
                        } for i in advance_ins
                    ]
                }
            }

            return billing_data


@csrf_exempt
def IP_Test_Que_Cancel(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            billing_type = data.get("BillingType", "").strip().upper()
            createdby = data.get('createdby','')
            print('dataaaa',data)
            if billing_type == "LAB":
                request_id = data.get("Request_Id")
                if request_id:
                    Lab_Request_Details.objects.filter(Request_Id=request_id).update(Status="Canceled")
                    try:
                        labins = BillingInvoiceAndBillAmount.objects.filter(Request_Id=request_id).first()
                        labins.Status = "Canceled"
                        labins.save()
                        labitem_ins =Billing_Item_Table_for_lab.objects.filter(Barcode_Id=labins.Barcode_Id)
                        
                        for lab_item in labitem_ins:
                            lab_item.Bill_Status = "Canceled"
                            lab_item.save()
                    except Exception as err:
                        print(str(err))


            elif billing_type == "RADIOLOGY":
                test_list = data.get("radiologytestlist", [])
                for test in test_list:
                    req_id = test.get("request_id")
                    if req_id:
                        Radiology_Request_Details.objects.filter(Radiology_RequestId=req_id).update(Status="Canceled",Canceledby=createdby)
            else:
                return JsonResponse({'error': "Unknown BillingType"}, status=400)
 
            return JsonResponse({'success': f'{billing_type} status changed successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST allowed'}, status=405)






from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Sum

 
@csrf_exempt
@require_http_methods(['GET'])
def IPBilling_Pharmacy_credit_get_details(request):
    try:
        # Retrieve query parameters
        Registration_Id = request.GET.get('Registration_Id')
        PatientId = request.GET.get('PatientId')
 
        # Validate input parameters
        if not Registration_Id or not PatientId:
            return JsonResponse({'error': 'Registration_Id and PatientId are required'}, status=400)
 
        # Fetch due bills
        pharmacy_details = IP_Pharmacy_Billing_Table_Detials.objects.exclude(created_by='host').filter(
            Bill_Status__in=["Due"],
            Patient_Id=PatientId,
            Register_Id=Registration_Id,
        )
 
        # Build list of bills
        pharmacy_list = []
        for pharm in pharmacy_details:
            datalist = {
                'Billing_Date': pharm.created_at.strftime("%d-%m-%y") if pharm.created_at else None,
                'Billing_Type': 'PHARMACY',
                'Net_Amount': float(pharm.Net_Amount) if pharm.Net_Amount else 0,
                'Billing_Invoice_No': pharm.Billing_Invoice_No,
            }
            pharmacy_list.append(datalist)
 
        # Calculate grand total
        grand_total = pharmacy_details.aggregate(total=Sum('Net_Amount'))['total'] or 0
 
        # Fetch refund details
        Refundpharmacy_list = []
        for rpharm in pharmacy_details:
            refund_pharmacy_details = IPPharmacyBillingRefundReceipt.objects.exclude(
                Billedby__in=['host', 'admin']
            ).filter(
                BillInvoice_NO__Billing_Invoice_No=rpharm.Billing_Invoice_No
            )
 
            for refund in refund_pharmacy_details:
                refundlist = {
                    'Billing_Date': refund.Billing_Date.strftime("%d-%m-%y") if refund.Billing_Date else None,
                    'Voucher_Number': refund.Voucher_Number,
                    'PaidAmount': float(refund.TotalAmount) if refund.TotalAmount else 0,
                }
                Refundpharmacy_list.append(refundlist)
 
        # Calculate total refunded amount
        total_refunded = sum(refund['PaidAmount'] for refund in Refundpharmacy_list) if Refundpharmacy_list else 0
 
        # Calculate net due amount (grand_total - total_refunded)
        net_due = float(grand_total) - total_refunded
 
        # Return response
        return JsonResponse({
            'status': 'success',
            'pharmacy_list': pharmacy_list,
            'grand_total': float(grand_total),
            'refund_list': Refundpharmacy_list,
            'total_refunded': total_refunded,
            'net_due': net_due
        }, safe=False)
 
    except IP_Pharmacy_Billing_Table_Detials.DoesNotExist:
        return JsonResponse({'error': 'No pharmacy billing details found for the given parameters'}, status=404)
    except IPPharmacyBillingRefundReceipt.DoesNotExist:
        return JsonResponse({
            'status': 'success',
            'pharmacy_list': pharmacy_list,
            'grand_total': float(grand_total),
            'refund_list': [],
            'total_refunded': 0,
            'net_due': float(grand_total)
        }, safe=False)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
 
 
 


from django.http import JsonResponse
from django.db import transaction, DatabaseError
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .models import (
    IP_Billing_Table_Detials, 
    IP_Billing_Items_Table_Detials,
    IPBillingReceipt,
    Multiple_Payment_Table_IP_Detials
)

# Set up logging
# logger = logging.getLogger(__name__)

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_ipfinalreprint_billing_details(request):
#     """
#     GET API to retrieve IP billing details with error handling
#     """
#     try:
#         # Get query parameters with defaults
#         billing_invoice_no = request.GET.get('billing_invoice_no')
#         patient_id = request.GET.get('patient_id')
#         from_date = request.GET.get('from_date')
#         to_date = request.GET.get('to_date')
#         limit = int(request.GET.get('limit', 100))
#         offset = int(request.GET.get('offset', 0))
        
#         # Build base query
#         billing_query = IP_Billing_Table_Detials.objects.all()
        
#         # Apply filters if provided
#         if billing_invoice_no:
#             billing_query = billing_query.filter(Billing_Invoice_No=billing_invoice_no)
        
#         if patient_id:
#             billing_query = billing_query.filter(Patient_Id=patient_id)
        
#         if from_date and to_date:
#             billing_query = billing_query.filter(Billing_Date__range=[from_date, to_date])
        
#         # Apply pagination
#         billing_query = billing_query.order_by('-Billing_Date')[offset:offset+limit]
        
#         # Initialize response data
#         response_data = {
#             'success': True,
#             'message': 'Data retrieved successfully',
#             'data': [],
#             'errors': [],
#             'total_count': billing_query.count(),
#             'returned_count': 0
#         }
        
#         # Process each billing record
#         for billing in billing_query:
#             try:
#                 billing_data = {
#                     'billing_invoice_no': billing.Billing_Invoice_No,
#                     'billing_date': billing.Billing_Date.isoformat() if billing.Billing_Date else None,
#                     'doctor_id': billing.Doctor_Id_id,
#                     'patient_id': billing.Patient_Id_id,
#                     'register_id': billing.Register_Id_id,
#                     'billing_type': billing.Billing_Type,
#                     'select_discount': billing.Select_Discount,
#                     'discount_type': billing.Discount_Type,
#                     'discount_value': float(billing.Discount_Value) if billing.Discount_Value else 0,
#                     'discount_amount': float(billing.Discount_Amount) if billing.Discount_Amount else 0,
#                     'total_items': billing.Total_Items,
#                     'total_qty': billing.Total_Qty,
#                     'total_amount': float(billing.Total_Amount) if billing.Total_Amount else 0,
#                     'total_gst_amount': float(billing.Total_GSTAmount) if billing.Total_GSTAmount else 0,
#                     'net_amount': float(billing.Net_Amount) if billing.Net_Amount else 0,
#                     'round_off': float(billing.Round_Off) if billing.Round_Off else 0,
#                     'net_paid_amount': float(billing.Net_Paid_Amount) if billing.Net_Paid_Amount else 0,
#                     'paid_amount': float(billing.Paid_Amount) if billing.Paid_Amount else 0,
#                     'balance_amount': float(billing.Balance_Amount) if billing.Balance_Amount else 0,
#                     'bill_status': billing.Bill_Status,
#                     'refund_status': billing.Refund_Status,
#                     'refund_amount': float(billing.Refund_Amount) if billing.Refund_Amount else 0,
#                     'advance_amount': float(billing.Advance_Amount) if billing.Advance_Amount else 0,
#                     'receivable_amount': float(billing.Receivable_Amount) if billing.Receivable_Amount else 0,
#                     'created_by': billing.created_by,
#                     'updated_by': billing.updated_by,
#                     'created_at': billing.created_at.isoformat() if billing.created_at else None,
#                     'updated_at': billing.updated_at.isoformat() if billing.updated_at else None,
#                     'remarks': billing.Remarks,
#                     'items': [],
#                     'receipts': []
#                 }
                
#                 # Get related items
#                 try:
#                     items = IP_Billing_Items_Table_Detials.objects.filter(
#                         Billing_Invoice_No=billing.Billing_Invoice_No
#                     )
                    
#                     for item in items:
#                         item_data = {
#                             'items_id': item.Items_Id,
#                             'service_type': item.Service_Type,
#                             'service_code': item.Service_Code,
#                             'service_name': item.Service_Name,
#                             'rate': float(item.Rate) if item.Rate else 0,
#                             'charge': float(item.Charge) if item.Charge else 0,
#                             'quantity': item.Quantity,
#                             'amount': float(item.Amount) if item.Amount else 0,
#                             'discount_type': item.Discount_Type,
#                             'discount_value': float(item.Discount_Value) if item.Discount_Value else 0,
#                             'discount_amount': float(item.Discount_Amount) if item.Discount_Amount else 0,
#                             'taxable_amount': float(item.Taxable_Amount) if item.Taxable_Amount else 0,
#                             'tax_percentage': item.Tax_Percentage,
#                             'tax_amount': float(item.Tax_Amount) if item.Tax_Amount else 0,
#                             'total_amount': float(item.Total_Amount) if item.Total_Amount else 0,
#                             'item_status': item.Item_Status,
#                             'is_reimbursable': item.IsReimbursable,
#                             'billing_type': item.Billing_Type,
#                             'created_by': item.created_by,
#                             'updated_by': item.updated_by,
#                             'created_at': item.created_at.isoformat() if item.created_at else None,
#                             'updated_at': item.updated_at.isoformat() if item.updated_at else None
#                         }
#                         billing_data['items'].append(item_data)
                
#                 except Exception as e:
#                     error_msg = f"Error retrieving items for billing {billing.Billing_Invoice_No}: {str(e)}"
#                     logger.error(error_msg)
#                     response_data['errors'].append(error_msg)
#                     # Continue processing other data even if items fail
                
#                 # Get related receipts
#                 try:
#                     receipts = IPBillingReceipt.objects.filter(
#                         Invoice_NO=billing.Billing_Invoice_No
#                     )
                    
#                     for receipt in receipts:
#                         receipt_data = {
#                             'invoice_no': receipt.Invoice_NO_id,
#                             'new_payment': receipt.NewPayment,
#                             'patient_id': receipt.PatientID,
#                             'phone_number': receipt.PhoneNumber,
#                             'patient_name': receipt.Patient_Name,
#                             'total_amount': receipt.TotalAmount,
#                             'total_paid_amount': receipt.TotalPaidAmount,
#                             'balance_amount': receipt.BalanceAmount,
#                             'billing_date': receipt.Billing_Date.isoformat() if receipt.Billing_Date else None,
#                             'voucher_number': receipt.Voucher_Number,
#                             'paid_amount': receipt.PaidAmount,
#                             'billed_by': receipt.Billedby,
#                             'created_at': receipt.CreatedAt.isoformat() if receipt.CreatedAt else None,
#                             'updated_at': receipt.UpdatedAt.isoformat() if receipt.UpdatedAt else None,
#                             'payments': []
#                         }
                        
#                         # Get payment details for this receipt
#                         try:
#                             payments = Multiple_Payment_Table_IP_Detials.objects.filter(
#                                 Invoice_No=receipt
#                             )
                            
#                             for payment in payments:
#                                 payment_data = {
#                                     's_no': payment.S_No,
#                                     'payment_type': payment.Payment_Type,
#                                     'cart_type': payment.Cart_Type,
#                                     'card_no': payment.Card_No,
#                                     'transaction_id': payment.TransactionId,
#                                     'upi_id': payment.upiid,
#                                     'cheque_no': payment.Cheque_No,
#                                     'bank_name': payment.Bank_Name,
#                                     'transaction_amount': float(payment.Transaction_Amount) if payment.Transaction_Amount else 0,
#                                     'additional_amount': float(payment.AdditionalAmount) if payment.AdditionalAmount else 0,
#                                     'amount': float(payment.Amount) if payment.Amount else 0,
#                                     'created_by': payment.created_by,
#                                     'created_at': payment.created_at.isoformat() if payment.created_at else None,
#                                     'updated_at': payment.updated_at.isoformat() if payment.updated_at else None
#                                 }
#                                 receipt_data['payments'].append(payment_data)
                        
#                         except Exception as e:
#                             error_msg = f"Error retrieving payments for receipt {receipt.Voucher_Number}: {str(e)}"
#                             logger.error(error_msg)
#                             response_data['errors'].append(error_msg)
#                             # Continue processing other data even if payments fail
                        
#                         billing_data['receipts'].append(receipt_data)
                
#                 except Exception as e:
#                     error_msg = f"Error retrieving receipts for billing {billing.Billing_Invoice_No}: {str(e)}"
#                     logger.error(error_msg)
#                     response_data['errors'].append(error_msg)
#                     # Continue processing other data even if receipts fail
                
#                 response_data['data'].append(billing_data)
#                 response_data['returned_count'] += 1
                
#             except Exception as e:
#                 error_msg = f"Error processing billing record {billing.Billing_Invoice_No if billing else 'Unknown'}: {str(e)}"
#                 logger.error(error_msg)
#                 response_data['errors'].append(error_msg)
#                 # Continue processing other billing records
        
#         return JsonResponse(response_data, status=200)
    
#     except Exception as e:
#         logger.error(f"Unexpected error in get_ip_billing_details: {str(e)}")
#         return JsonResponse({
#             'success': False,
#             'message': 'An unexpected error occurred',
#             'error': str(e),
#             'data': [],
#             'errors': [f'Unexpected error: {str(e)}']
#         }, status=500)


# @csrf_exempt
# @require_http_methods(['GET'])
# def IP_Billing_Service_List_after_estimated(request):
#     if request.method == "GET":
#         try:
#             # Initialize all variables that might be used in different code paths
#             cumulative_consultation = 0
#             cumulative_lab = 0
#             cumulative_radiology = 0
#             cumulative_general_services = 0
#             consultation_amount = 0
#             general_service_amount = 0
#             lab_amount = 0
#             radiology_amount = 0
#             discount_value_display = ""
#             discount_amount_display = ""
#             discount_value = 0
#             discount_amount = 0
#             Discountmethod = ""
#             final_rate = 0

#             QueueList_ID = request.GET.get('QueueList_ID')
#             print("QueueList_ID", QueueList_ID)
#             Billing_Invoice_No = request.GET.get('Billing_Invoice_No')
#             print("Billing_Invoice_No", Billing_Invoice_No)
            
#             if not Billing_Invoice_No:
#                 if not QueueList_ID:
#                     return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
                
#                 try:
#                     row = IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
#                 except IP_Billing_QueueList_Detials.DoesNotExist:
#                     return JsonResponse({'error': 'Billing data not found'}, status=404)
                
#                 full_name = f"""{row.Registration_Id.PatientId.Title.Title_Name}{"."}{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}"""
#                 formatted_date = row.created_at.strftime("%d/%b/%Y")
#                 Patientcategory = row.Registration_Id.PatientCategory

#                 Billing_data_list = []
#                 services_ins = Services_SubCat_Requests_Details.objects.filter(Registration_Id=QueueList_ID)
#                 services_list = []
#                 pharmacy_list = []
#                 cumulative_service_rate = 0

#                 print(services_ins, 'services_ins')

#                 for datas in services_ins:
#                     serviceid = datas.service_category_id
#                     category_ins = Service_Category_Masters.objects.get(pk=serviceid)

#                     print(serviceid, 'serviceid', category_ins, 'category_ins')
                    
#                     # Reset service-specific variables for each iteration
#                     consultation_amount = 0
#                     general_service_amount = 0
                    
#                     if category_ins.ServiceCategory == 'ROOMSERVICES':
#                         Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
#                         ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
#                         data_list = {
#                             'id': datas.pk,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': f'{ward_ins.RoomNo} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}',         
#                             'rate': datas.rate,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y %I:%M %p')
#                         }
#                         services_list.append(data_list)

#                     elif category_ins.ServiceCategory == 'CONSULTATION':
#                         consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
#                         Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
#                         speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else ""
#                         doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        
#                         consultation_amount = 0  # Initialize

#                         if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
#                             if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
#                                 wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
#                                 print(wardfee, 'wardfee444444444')
#                                 consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
#                                 cumulative_consultation += consultation_amount

#                             elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
#                                 wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
#                                 consultation_amount = wardfee.Special_fee * datas.units if wardfee else 0
#                                 cumulative_consultation += consultation_amount

#                             else:
#                                 wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
#                                 consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
#                                 cumulative_consultation += consultation_amount

#                         elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
#                             insurancefee = InsuranceFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, insurance=row.Registration_Id.InsuranceName).first()
#                             consultation_amount = insurancefee.Consultation_Fee * datas.units if insurancefee else 0
#                             cumulative_consultation += consultation_amount

#                         elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
#                             clientfee = ClientFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, client=row.Registration_Id.ClientName).first()
#                             consultation_amount = clientfee.Consultation_Fee * datas.units if clientfee else 0
#                             cumulative_consultation += consultation_amount

#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else ""})',
#                             'rate': consultation_amount,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)      
                    
#                     elif category_ins.ServiceCategory == 'GENERALSERVICES':
#                         General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
#                         services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
                        
#                         general_service_amount = 0  # Initialize

#                         if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
#                             if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
#                                 Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 general_service_amount = Wardfee.General_fee * datas.units if Wardfee else 0
#                                 cumulative_general_services += general_service_amount

#                             elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
#                                 wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 general_service_amount = wardfee.Special_fee * datas.units if wardfee else 0
#                                 cumulative_general_services += general_service_amount

#                             else:
#                                 Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
#                                 general_service_amount = Wardfee.General_fee * datas.units if Wardfee else 0
#                                 cumulative_general_services += general_service_amount

#                         elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
#                             insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard, Insurance=row.Registration_Id.InsuranceName).first()
#                             general_service_amount = insurancefee.Fee * datas.units if insurancefee else 0
#                             cumulative_general_services += general_service_amount

#                         elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
#                             clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard, Client=row.Registration_Id.ClientName).first()
#                             general_service_amount = clientfee.Fee * datas.units if clientfee else 0
#                             cumulative_general_services += general_service_amount

#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': General_services_ins.Service_Name,
#                             'rate': general_service_amount,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)
                    
#                     elif category_ins.ServiceCategory == 'PROCEDURES':
#                         General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
#                         general_service_amount = datas.rate * datas.units
#                         cumulative_general_services += general_service_amount
#                         data_list = {
#                             'id': datas.pk,
#                             'VoucherNo': datas.Voucher_Number,
#                             'category': category_ins.ServiceCategory,
#                             'service_subcategory': General_services_ins.Procedure_Name,
#                             'rate': datas.rate,
#                             'Units': datas.units,
#                             'Date': datas.created_at.strftime('%d-%m-%Y')
#                         }
#                         services_list.append(data_list)

#                 for idx, services in enumerate(services_list, start=1):
#                     services["Sno"] = idx

#                 roomdatas = Patient_Admission_Room_Detials.objects.filter(
#                     IP_Registration_Id__pk=QueueList_ID, IsStayed=True
#                 ).exclude(Iscanceled=True)

#                 print(roomdatas, 'roomdatas')

#                 cumulative_days = 0
#                 cumulative_hours = 0
#                 cumulative_total_amount = 0
               
#                 for room in roomdatas:
#                     # Reset room-specific variables for each iteration
#                     days = 0
#                     hours = 0
#                     hours_to_charge = 0
#                     total_amount = 0
#                     nursecharges = 0
#                     Doctorcharges = 0
#                     discount_value_display = ""
#                     discount_amount_display = ""
#                     discount_value = 0
#                     discount_amount = 0
#                     Discountmethod = ""
#                     final_rate = 0
#                     roomamt = 0
#                     nurseamt = 0
#                     doctoramt = 0
#                     Calc_rounded_days = 0

#                     if room.Admitted_Date:
#                         admitted_date = room.Admitted_Date  
#                         discharge_date = room.Discharge_Date if room.Discharge_Date else None
    
#                         if discharge_date:
#                             difference = discharge_date - admitted_date
#                             days = difference.days
#                             hours, remainder = divmod(difference.seconds, 3600)
#                             calc_total_days = difference.total_seconds() / (24 * 60 * 60)
#                             Calc_rounded_days = math.ceil(calc_total_days)
#                         else:
#                             current_datetime = timezone.now()  
#                             difference = current_datetime - admitted_date
#                             days = difference.days
#                             hours, remainder = divmod(difference.seconds, 3600)
#                             calc_total_days = difference.total_seconds() / (24 * 60 * 60)
#                             Calc_rounded_days = math.ceil(calc_total_days)
    
#                     # Define hours-to-charge logic
#                     print(hours, 'room hours', Calc_rounded_days, calc_total_days)
#                     if hours > 12:
#                         hours_to_charge = 24
#                     else:
#                         hours_to_charge = 0
 
#                     current_datetime = timezone.now() 
#                     admitted_date_str = admitted_date.strftime('%d-%m-%y / %I-%M %p') if admitted_date else ""
#                     discharge_date_str = discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else current_datetime.strftime('%d-%m-%y / %I-%M %p')
#                     date_range = f"{admitted_date_str} - {discharge_date_str}" if admitted_date_str else ""

#                     # Calculate room charge
#                     total_amount = 0
#                     nursecharges = 0
#                     Doctorcharges = 0

#                     # ... rest of your room calculation logic (same as before)
#                     # Make sure to add proper null checks for all object accesses

#                     # Update cumulative totals
#                     cumulative_days += days
#                     cumulative_hours += hours
#                     cumulative_total_amount += total_amount

#             # Filter the payments based on Billpay_method="Due" and Patient_Id_id=provided Patient_Id
#             pharmacy_details = IP_Pharmacy_Billing_Table_Detials.objects.filter(
#                 Bill_Status="Dueeeee",
#                 Patient_Id=row.Registration_Id.PatientId.PatientId,
#                 Register_Id=row.Registration_Id
#             )
            
#             for pharm in pharmacy_details:
#                 item_ins = IP_BillingItem.objects.filter(Billing=pharm.Billing_Invoice_No)
#                 print('pharmacy_details', item_ins)
#                 for item in item_ins:
#                     data_list = {
#                         'id': item.pk,
#                         'VoucherNo': item.Billing.Billing_Invoice_No if item.Billing else "",
#                         'category': 'Pharmacy',
#                         'service_subcategory': item.ItemName,
#                         'rate': item.Unit_Price,
#                         'total': item.Total,
#                         'Units': item.Billing_Quantity,
#                         'Date': item.Billing.created_at.strftime('%d-%m-%Y') if item.Billing else "",
#                         'isReimbursable': item.Reimbursable,
#                     }
#                     print('dataaaa', data_list)
#                     pharmacy_list.append(data_list)

#             roomdatas_last = Patient_Admission_Room_Detials.objects.filter(
#                 IP_Registration_Id__pk=QueueList_ID, Status=True, IsStayed=True
#             ).exclude(Iscanceled=True, CurrentlyStayed=True).last()
            
#             RoomType = roomdatas_last.RoomId.Ward_Name.Ward_Name.Type if roomdatas_last and roomdatas_last.RoomId else ""

#             ot_ins = OT_Billing.objects.filter(IP_Registration_Id=QueueList_ID)
#             OT_list = []
#             sno = 0

#             for datas in ot_ins:
#                 sno = sno + 1
#                 data_list = {
#                     'id': sno,
#                     'category': 'OT',
#                     'service_subcategory': f"""{datas.Service_name}({datas.Name})""",
#                     'rate': datas.Amount,
#                     'Units': datas.Quantity,
#                     'Date': datas.created_at.strftime('%d-%m-%Y'),
#                     'isReimbursable': 'Yes'
#                 }
#                 OT_list.append(data_list)

#             Labins = Interim_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id=QueueList_ID, Bill_Status='Due')
#             Lab_list = []
#             sno = 0

#             for labdata in Labins: 
#                 sno = sno + 1
#                 itemins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=labdata.Billing_Invoice_No, Service_Type='LAB', Item_Status='Due')
#                 for datas in itemins:
#                     # Initialize discount variables
#                     discount_value_display = "-"
#                     discount_amount_display = "-"
#                     discount_value = 0
#                     Discountmethod = ""
#                     final_rate = 0

#                     rate = datas.Total_Amount if datas else 0
#                     final_rate = rate  
#                     discount_amount = 0

#                     discount_type = datas.Discount_Type if datas else None
#                     discount_value = datas.Discount_Value if datas else 0

#                     if discount_type and discount_value:
#                         if discount_type.lower() == "percentage":
#                             discount_amount = (rate * discount_value) / 100
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                             Discountmethod = 'PERCENTAGE'
#                         elif discount_type.lower() == "flat":
#                             discount_amount = discount_value
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                             Discountmethod = 'FLATAMOUNT'

#                         discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                     else:
#                         discount_value_display = "-"
#                         discount_amount_display = "-"

#                     data_list = {
#                         'id': sno,
#                         'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
#                         'Requestid': datas.pk,
#                         'category': 'LAB',
#                         'service_subcategory': datas.Service_Name,
#                         'servicecode': datas.Service_Code,
#                         'rate': datas.Amount,
#                         'Units': datas.Quantity,
#                         'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
#                         'isReimbursable': 'Yes',
#                         'Discountmethod': datas.Discount_Type,
#                         'DiscountType': discount_value_display,
#                         'Discount': discount_value if discount_value else '-',
#                         'Discountamt': datas.Discount_Amount,
#                         'Finalrate': round(datas.Total_Amount, 2),
#                         'Discountmethod': Discountmethod,
#                         'Discountval': discount_value,
#                     }
#                     Lab_list.append(data_list)

#             radins = Radiology_Request_Details.objects.filter(IP_Register_Id__Registration_Id=QueueList_ID, Status__in=['Due'])
#             Rad_list = []
#             sno = 0

#             for datas in radins:
#                 if datas.Interim_Billing_Invoice_No != '':
#                     sno = sno + 1

#                     # Initialize variables
#                     discount_value_display = "-"
#                     discount_amount_display = "-"
#                     discount_value = 0
#                     Discountmethod = ""
#                     final_rate = 0
#                     rate = 0

#                     Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
#                     Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

#                     Discount = DiscountMaster.objects.filter(
#                         Service__ServiceCategory='RADIOLOGY',
#                         Patient_Type=row.Registration_Id.PatientCategory
#                     ).first()

#                     RadDiscount = None
#                     print(Discount, 'Discount')

#                     if Discount:
#                         RadDiscount = Discount_Radiology_Fee.objects.filter(
#                             discount__Discount_ID=Discount.Discount_ID,
#                             Radiology_Test_Id__Room_Id__Test_Code=datas.SubTestCode
#                         ).first()
#                         print(RadDiscount, 'RadDiscount')

#                     rate = Test.Amount if Test else 0
#                     final_rate = rate  
#                     discount_amount = 0  

#                     discount_type = RadDiscount.discount_method if RadDiscount else None
#                     discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

#                     if discount_type and discount_value:
#                         if discount_type.lower() == "percentage":
#                             discount_amount = (rate * discount_value) / 100
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.') + "%"
#                             Discountmethod = 'PERCENTAGE'
#                         elif discount_type.lower() == "flat":
#                             discount_amount = discount_value
#                             final_rate = rate - discount_amount
#                             discount_value_display = f"{discount_value:.2f}".rstrip('0').rstrip('.')
#                             Discountmethod = 'FLATAMOUNT'

#                         discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
#                     else:
#                         discount_value_display = "-"
#                         discount_amount_display = "-"

#                     print(datas.Interim_Billing_Invoice_No.Discount_Amount if datas.Interim_Billing_Invoice_No else "", ' dis amt for rad')

#                     raditem = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=datas.Interim_Billing_Invoice_No, Service_Code=datas.SubTestCode).first()

#                     data_list = {
#                         'sno': sno,
#                         'VoucherNo': datas.Interim_Billing_Invoice_No.Billing_Invoice_No if datas.Interim_Billing_Invoice_No else "",
#                         'category': 'RADIOLOGY',
#                         'service_subcategory': f"""{Dep.Radiology_Name if Dep else ''}({Test.Test_Name if Test else ''})""",
#                         'servicecode': datas.SubTestCode,
#                         'rate': rate,
#                         'Units': 1,
#                         'Date': datas.created_at.strftime('%d-%m-%Y'),
#                         'isReimbursable': 'Yes',
#                         'Requestid': datas.pk,
#                         'DiscountType': discount_value_display,
#                         'Discount': discount_value if discount_value else '-',
#                         'Discountamt': raditem.Discount_Amount if raditem else "",
#                         'Finalrate': raditem.Total_Amount if raditem else "",
#                         'Discountmethod': Discountmethod,
#                         'Discountval': discount_value,
#                     }
#                     Rad_list.append(data_list)

#             radins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Register_Id__Registration_Id=QueueList_ID).exclude(Service_Type__in=["RADIOLOGY", "Radiology", 'LAB', 'Lab'])
#             print('intttt', radins)
#             Interim_list = []
#             sno = 0

#             for datas in radins:
#                 sno = sno + 1
#                 data_list = {
#                     'sno': sno,
#                     'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
#                     'category': datas.Service_Type,
#                     'service_subcategory': datas.Service_Name,
#                     'servicecode': datas.Service_Code,
#                     'rate': datas.Amount,
#                     'Units': 1,
#                     'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
#                     'isReimbursable': 'Yes',
#                 }
#                 Interim_list.append(data_list)
           
#             Billing_data = {    
#                 'id': row.BillingQueueList_ID,
#                 'Billing_Type': row.Billing_Type,
#                 'Status': row.Status,
#                 'Date': formatted_date,
#                 'Registration_Id': row.Registration_Id.Registration_Id,
#                 'PatientId': row.Registration_Id.PatientId.PatientId,
#                 'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
#                 'Patient_Name': full_name.strip(),
#                 'Gender': row.Registration_Id.PatientId.Gender,
#                 'DoorNo': row.Registration_Id.PatientId.DoorNo,
#                 'Age': row.Registration_Id.PatientId.Age,
#                 'Street': row.Registration_Id.PatientId.Street,
#                 'Area': row.Registration_Id.PatientId.Area,
#                 'City': row.Registration_Id.PatientId.City,
#                 'State': row.Registration_Id.PatientId.State,
#                 'Country': row.Registration_Id.PatientId.Country,
#                 'Pincode': row.Registration_Id.PatientId.Pincode,
#                 'PatientType': row.Registration_Id.PatientId.PatientType,
#                 'PatientCategory': row.Registration_Id.PatientCategory,
#                 'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
#                 'Doctor_ShortName': row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
#                 'WardName': roomdatas_last.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdatas_last and roomdatas_last.RoomId else "",
#                 'ROOMNo': roomdatas_last.RoomId.Ward_Name.RoomNo if roomdatas_last and roomdatas_last.RoomId else "",
#                 'BedNo': roomdatas_last.RoomId.Bed_No if roomdatas_last and roomdatas_last.RoomId else ""
#             }
            
#             ip_bill_service_data = {
#                 'Billing_data_list': Billing_data_list,
#                 'Billing_data': Billing_data,
#                 'services': services_list,
#                 'pharmacy_list': pharmacy_list,
#                 'CumulativeConsultation': round(cumulative_consultation, 2),
#                 'CumulativeLab': round(cumulative_lab, 2),
#                 'CumulativeRadiology': round(cumulative_radiology, 2),
#                 'CumulativeGeneralServices': round(cumulative_general_services, 2),
#                 'OT_data': OT_list,
#                 'Lab_list': Lab_list,
#                 'Rad_list': Rad_list,
#                 'InterimList': Interim_list,
#             }    
            
#             return JsonResponse(ip_bill_service_data, safe=False)
        
#         except Exception as e:
#             return JsonResponse({"error": str(e)})


@csrf_exempt
@require_http_methods(['GET'])
def IP_Billing_Service_List_after_estimated(request):
    if request.method == "GET":
        try:
            # Initialize all variables that might be used in different code paths
            cumulative_consultation = 0
            cumulative_lab = 0
            cumulative_radiology = 0
            cumulative_general_services = 0
            consultation_amount = 0
            general_service_amount = 0
            lab_amount = 0
            radiology_amount = 0
            discount_value_display = ""
            discount_amount_display = ""
            discount_value = 0
            discount_amount = 0
            Discountmethod = ""
            final_rate = 0

            QueueList_ID = request.GET.get('QueueList_ID')
            print("QueueList_ID", QueueList_ID)
            Billing_Invoice_No = request.GET.get('Billing_Invoice_No')
            print("Billing_Invoice_No", Billing_Invoice_No)
            
            if not Billing_Invoice_No:
                if not QueueList_ID:
                    return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
                
                try:
                    row = IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
                except IP_Billing_QueueList_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Billing data not found'}, status=404)
                
                full_name = f"""{row.Registration_Id.PatientId.Title.Title_Name}{"."}{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}"""
                formatted_date = row.created_at.strftime("%d/%b/%Y")
                Patientcategory = row.Registration_Id.PatientCategory

                Billing_data_list = []
                services_ins = Services_SubCat_Requests_Details.objects.filter(Registration_Id=QueueList_ID)
                services_list = []
                pharmacy_list = []
                cumulative_service_rate = 0

                print(services_ins, 'services_ins')

                for datas in services_ins:
                    serviceid = datas.service_category_id
                    category_ins = Service_Category_Masters.objects.get(pk=serviceid)

                    print(serviceid, 'serviceid', category_ins, 'category_ins')
                    
                    # Reset service-specific variables for each iteration
                    consultation_amount = 0
                    general_service_amount = 0
                    
                    if category_ins.ServiceCategory == 'ROOMSERVICES':
                        Room_ins = Room_Master_Detials.objects.get(pk=datas.object_id)
                        ward_ins = WardType_Master_Detials.objects.get(pk=Room_ins.Ward_Name.Room_Id)        
                        data_list = {
                            'id': datas.pk,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': f'{ward_ins.RoomNo} - {Room_ins.Bed_No} -{ward_ins.Ward_Name}',         
                            'rate': datas.rate,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y %I:%M %p')
                        }
                        services_list.append(data_list)

                    elif category_ins.ServiceCategory == 'CONSULTATION':
                        consultaion_ins = Doctor_Ratecard_Master.objects.get(pk=datas.object_id)
                        Doctor_speciality_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID)  
                        speciality_ins = Speciality_Detials.objects.get(Speciality_Id=Doctor_speciality_ins.Specialization.Speciality_Id) if Doctor_speciality_ins.Specialization else ""
                        doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=consultaion_ins.Doctor_ID.Doctor_ID)
                        
                        consultation_amount = 0  # Initialize

                        if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
                            if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
                                print(wardfee, 'wardfee444444444')
                                consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
                                cumulative_consultation += consultation_amount

                            elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
                                consultation_amount = wardfee.Special_fee * datas.units if wardfee else 0
                                cumulative_consultation += consultation_amount

                            else:
                                wardfee = WardTypee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, ward=datas.Wardid).first()
                                consultation_amount = wardfee.General_fee * datas.units if wardfee else 0
                                cumulative_consultation += consultation_amount

                        elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
                            insurancefee = InsuranceFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, insurance=row.Registration_Id.InsuranceName).first()
                            consultation_amount = insurancefee.Consultation_Fee * datas.units if insurancefee else 0
                            cumulative_consultation += consultation_amount

                        elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
                            clientfee = ClientFee_for_Doctor.objects.filter(doctor_ratecard=consultaion_ins, client=row.Registration_Id.ClientName).first()
                            consultation_amount = clientfee.Consultation_Fee * datas.units if clientfee else 0
                            cumulative_consultation += consultation_amount

                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': f'{consultaion_ins.Doctor_ID.Doctor_ID} - Dr.{doctor_ins.First_Name}{doctor_ins.Middle_Name}({speciality_ins.Speciality_Name if speciality_ins else ""})',
                            'rate': consultation_amount,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)      
                    
                    elif category_ins.ServiceCategory == 'GENERALSERVICES':
                        General_services_ins = Service_Master_Details.objects.get(pk=datas.object_id)
                        services_ratecard = Service_Ratecard_Master.objects.filter(Service=General_services_ins).first()
                        
                        general_service_amount = 0  # Initialize

                        if row.Registration_Id.PatientCategory.upper() == 'GENERAL':
                            if row.Registration_Id.PatientId.PatientType.upper() == 'GENERAL':
                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                general_service_amount = Wardfee.General_fee * datas.units if Wardfee else 0
                                cumulative_general_services += general_service_amount

                            elif row.Registration_Id.PatientId.PatientType.upper() == 'GOVT' or row.Registration_Id.PatientId.PatientType.upper() == 'VIP':
                                wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                general_service_amount = wardfee.Special_fee * datas.units if wardfee else 0
                                cumulative_general_services += general_service_amount

                            else:
                                Wardfee = WardtypeFee.objects.filter(service_ratecard=services_ratecard, ward=datas.Wardid).first()
                                general_service_amount = Wardfee.General_fee * datas.units if Wardfee else 0
                                cumulative_general_services += general_service_amount

                        elif row.Registration_Id.PatientCategory.upper() == 'INSURANCE':
                            insurancefee = Service_Insurance_Fee.objects.filter(Service_Ratecard=services_ratecard, Insurance=row.Registration_Id.InsuranceName).first()
                            general_service_amount = insurancefee.Fee * datas.units if insurancefee else 0
                            cumulative_general_services += general_service_amount

                        elif row.Registration_Id.PatientCategory.upper() == 'CLIENT':
                            clientfee = Service_Client_Fee.objects.filter(Service_Ratecard=services_ratecard, Client=row.Registration_Id.ClientName).first()
                            general_service_amount = clientfee.Fee * datas.units if clientfee else 0
                            cumulative_general_services += general_service_amount

                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': General_services_ins.Service_Name,
                            'rate': general_service_amount,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)
                    
                    elif category_ins.ServiceCategory == 'PROCEDURES':
                        General_services_ins = Procedure_Master_Details.objects.get(pk=datas.object_id)
                        general_service_amount = datas.rate * datas.units
                        cumulative_general_services += general_service_amount
                        data_list = {
                            'id': datas.pk,
                            'VoucherNo': datas.Voucher_Number,
                            'category': category_ins.ServiceCategory,
                            'service_subcategory': General_services_ins.Procedure_Name,
                            'rate': datas.rate,
                            'Units': datas.units,
                            'Date': datas.created_at.strftime('%d-%m-%Y')
                        }
                        services_list.append(data_list)

                for idx, services in enumerate(services_list, start=1):
                    services["Sno"] = idx

                roomdatas = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__pk=QueueList_ID, IsStayed=True
                ).exclude(Iscanceled=True)

                print(roomdatas, 'roomdatas')

                cumulative_days = 0
                cumulative_hours = 0
                cumulative_total_amount = 0
               
                for room in roomdatas:
                    # Reset room-specific variables for each iteration
                    days = 0
                    hours = 0
                    hours_to_charge = 0
                    total_amount = 0
                    nursecharges = 0
                    Doctorcharges = 0
                    discount_value_display = ""
                    discount_amount_display = ""
                    discount_value = 0
                    discount_amount = 0
                    Discountmethod = ""
                    final_rate = 0
                    roomamt = 0
                    nurseamt = 0
                    doctoramt = 0
                    Calc_rounded_days = 0

                    if room.Admitted_Date:
                        admitted_date = room.Admitted_Date  
                        discharge_date = room.Discharge_Date if room.Discharge_Date else None
    
                        if discharge_date:
                            difference = discharge_date - admitted_date
                            days = difference.days
                            hours, remainder = divmod(difference.seconds, 3600)
                            calc_total_days = difference.total_seconds() / (24 * 60 * 60)
                            Calc_rounded_days = math.ceil(calc_total_days)
                        else:
                            current_datetime = timezone.now()  
                            difference = current_datetime - admitted_date
                            days = difference.days
                            hours, remainder = divmod(difference.seconds, 3600)
                            calc_total_days = difference.total_seconds() / (24 * 60 * 60)
                            Calc_rounded_days = math.ceil(calc_total_days)
    
                    # Define hours-to-charge logic
                    print(hours, 'room hours', Calc_rounded_days, calc_total_days)
                    if hours > 12:
                        hours_to_charge = 24
                    else:
                        hours_to_charge = 0
 
                    current_datetime = timezone.now() 
                    admitted_date_str = admitted_date.strftime('%d-%m-%y / %I-%M %p') if admitted_date else ""
                    discharge_date_str = discharge_date.strftime('%d-%m-%y / %I-%M %p') if discharge_date else current_datetime.strftime('%d-%m-%y / %I-%M %p')
                    date_range = f"{admitted_date_str} - {discharge_date_str}" if admitted_date_str else ""

                    # Calculate room charge
                    total_amount = 0
                    nursecharges = 0
                    Doctorcharges = 0

                    # ... rest of your room calculation logic (same as before)
                    # Make sure to add proper null checks for all object accesses

                    # Update cumulative totals
                    cumulative_days += days
                    cumulative_hours += hours
                    cumulative_total_amount += total_amount

            # Filter the payments based on Billpay_method="Due" and Patient_Id_id=provided Patient_Id
            pharmacy_details = IP_Pharmacy_Billing_Table_Detials.objects.filter(
                Bill_Status="Dueeeee",
                Patient_Id=row.Registration_Id.PatientId.PatientId,
                Register_Id=row.Registration_Id
            )
            
            for pharm in pharmacy_details:
                item_ins = IP_BillingItem.objects.filter(Billing=pharm.Billing_Invoice_No)
                print('pharmacy_details', item_ins)
                for item in item_ins:
                    data_list = {
                        'id': item.pk,
                        'VoucherNo': item.Billing.Billing_Invoice_No if item.Billing else "",
                        'category': 'Pharmacy',
                        'service_subcategory': item.ItemName,
                        'rate': item.Unit_Price,
                        'total': item.Total,
                        'Units': item.Billing_Quantity,
                        'Date': item.Billing.created_at.strftime('%d-%m-%Y') if item.Billing else "",
                        'isReimbursable': item.Reimbursable,
                    }
                    print('dataaaa', data_list)
                    pharmacy_list.append(data_list)

            roomdatas_last = Patient_Admission_Room_Detials.objects.filter(
                IP_Registration_Id__pk=QueueList_ID, Status=True, IsStayed=True
            ).exclude(Iscanceled=True, CurrentlyStayed=True).last()
            
            RoomType = roomdatas_last.RoomId.Ward_Name.Ward_Name.Type if roomdatas_last and roomdatas_last.RoomId else ""

            ot_ins = OT_Billing.objects.filter(IP_Registration_Id=QueueList_ID)
            OT_list = []
            sno = 0

            for datas in ot_ins:
                sno = sno + 1
                data_list = {
                    'id': sno,
                    'category': 'OT',
                    'service_subcategory': f"""{datas.Service_name}({datas.Name})""",
                    'rate': datas.Amount,
                    'Units': datas.Quantity,
                    'Date': datas.created_at.strftime('%d-%m-%Y'),
                    'isReimbursable': 'Yes'
                }
                OT_list.append(data_list)

            Labins = Interim_Billing_Table_Detials.objects.filter(Register_Id__Registration_Id=QueueList_ID, Bill_Status='Due')
            Lab_list = []
            sno = 0

            for labdata in Labins: 
                sno = sno + 1
                itemins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=labdata.Billing_Invoice_No, Service_Type='LAB', Item_Status='Due')
                for datas in itemins:
                    # Initialize discount variables
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    discount_value = 0
                    Discountmethod = ""
                    final_rate = 0

                    rate = datas.Total_Amount if datas else 0
                    final_rate = rate  
                    discount_amount = 0

                    discount_type = datas.Discount_Type if datas else None
                    discount_value = datas.Discount_Value if datas else 0

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

                        discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                    else:
                        discount_value_display = "-"
                        discount_amount_display = "-"

                    data_list = {
                        'id': sno,
                        'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
                        'Requestid': datas.pk,
                        'category': 'LAB',
                        'service_subcategory': datas.Service_Name,
                        'servicecode': datas.Service_Code,
                        'rate': datas.Amount,
                        'Units': datas.Quantity,
                        'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
                        'isReimbursable': 'Yes',
                        'Discountmethod': datas.Discount_Type,
                        'DiscountType': discount_value_display,
                        'Discount': discount_value if discount_value else '-',
                        'Discountamt': datas.Discount_Amount,
                        'Finalrate': round(datas.Total_Amount, 2),
                        'Discountmethod': Discountmethod,
                        'Discountval': discount_value,
                        'CGHScode' : datas.CGHS_CODE if datas and datas.CGHS_CODE else ''

                    }
                    Lab_list.append(data_list)

            radins = Radiology_Request_Details.objects.filter(IP_Register_Id__Registration_Id=QueueList_ID, Status__in=['Due'])
            Rad_list = []
            sno = 0
            print('radins ---',radins)
            for datas in radins:
                if datas.Interim_Billing_Invoice_No != '':
                    sno = sno + 1

                    # Initialize variables
                    discount_value_display = "-"
                    discount_amount_display = "-"
                    discount_value = 0
                    Discountmethod = ""
                    final_rate = 0
                    rate = 0

                    Dep = RadiologyNames_Details.objects.filter(Radiology_Id=datas.TestCode).first()
                    Test = TestName_Details.objects.filter(Test_Code=datas.SubTestCode).first()

                    Discount = DiscountMaster.objects.filter(
                        Service__ServiceCategory='RADIOLOGY',
                        Patient_Type=row.Registration_Id.PatientCategory
                    ).first()

                    RadDiscount = None
                    print(Discount, 'Discount')

                    if Discount:
                        RadDiscount = Discount_Radiology_Fee.objects.filter(
                            discount__Discount_ID=Discount.Discount_ID,
                            Radiology_Test_Id__Room_Id__Test_Code=datas.SubTestCode
                        ).first()
                        print(RadDiscount, 'RadDiscount')

                    rate = Test.Amount if Test else 0
                    final_rate = rate  
                    discount_amount = 0  

                    discount_type = RadDiscount.discount_method if RadDiscount else None
                    discount_value = RadDiscount.Cur_Test_Fee if RadDiscount else 0

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

                        discount_amount_display = f"{discount_amount:.2f}".rstrip('0').rstrip('.')
                    else:
                        discount_value_display = "-"
                        discount_amount_display = "-"

                    print(datas.Interim_Billing_Invoice_No.Discount_Amount if datas.Interim_Billing_Invoice_No else "", ' dis amt for rad')

                    raditem = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No=datas.Interim_Billing_Invoice_No, Service_Code=datas.SubTestCode).first()

                    data_list = {
                        'sno': sno,
                        'VoucherNo': datas.Interim_Billing_Invoice_No.Billing_Invoice_No if datas.Interim_Billing_Invoice_No else "",
                        'category': 'RADIOLOGY',
                        'service_subcategory': f"""{Dep.Radiology_Name if Dep else ''}({Test.Test_Name if Test else ''})""",
                        'servicecode': datas.SubTestCode,
                        'rate': rate,
                        'Units': 1,
                        'Date': datas.created_at.strftime('%d-%m-%Y'),
                        'isReimbursable': 'Yes',
                        'Requestid': datas.pk,
                        'DiscountType': discount_value_display,
                        'Discount': discount_value if discount_value else '-',
                        'Discountamt': raditem.Discount_Amount if raditem else "",
                        'Finalrate': raditem.Total_Amount if raditem else "",
                        'Discountmethod': Discountmethod,
                        'Discountval': discount_value,
                                                'CGHScode' : raditem.CGHS_CODE if raditem and raditem.CGHS_CODE else ''

                    }
                    Rad_list.append(data_list)

            radins = Interim_Billing_Items_Table_Detials.objects.filter(Billing_Invoice_No__Register_Id__Registration_Id=QueueList_ID).exclude(Service_Type__in=["RADIOLOGY", "Radiology", 'LAB', 'Lab'])
            print('intttt', radins)
            Interim_list = []
            sno = 0

            for datas in radins:
                sno = sno + 1
                data_list = {
                    'sno': sno,
                    'VoucherNo': datas.Billing_Invoice_No.Billing_Invoice_No if datas.Billing_Invoice_No else "",
                    'category': datas.Service_Type,
                    'service_subcategory': datas.Service_Name,
                    'servicecode': datas.Service_Code,
                    'rate': datas.Amount,
                    'Units': 1,
                    'Date': datas.Billing_Invoice_No.created_at.strftime('%d-%m-%Y') if datas.Billing_Invoice_No else "",
                    'isReimbursable': 'Yes',
                    'CGHScode' : datas.CGHS_CODE if datas and datas.CGHS_CODE else ''

                    
                }
                Interim_list.append(data_list)
           
            Billing_data = {    
                'id': row.BillingQueueList_ID,
                'Billing_Type': row.Billing_Type,
                'Status': row.Status,
                'Date': formatted_date,
                'Registration_Id': row.Registration_Id.Registration_Id,
                'PatientId': row.Registration_Id.PatientId.PatientId,
                'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
                'Patient_Name': full_name.strip(),
                'Gender': row.Registration_Id.PatientId.Gender,
                'DoorNo': row.Registration_Id.PatientId.DoorNo,
                'Age': row.Registration_Id.PatientId.Age,
                'Street': row.Registration_Id.PatientId.Street,
                'Area': row.Registration_Id.PatientId.Area,
                'City': row.Registration_Id.PatientId.City,
                'State': row.Registration_Id.PatientId.State,
                'Country': row.Registration_Id.PatientId.Country,
                'Pincode': row.Registration_Id.PatientId.Pincode,
                'PatientType': row.Registration_Id.PatientId.PatientType,
                'PatientCategory': row.Registration_Id.PatientCategory,
                'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
                'Doctor_ShortName': row.Doctor_Ratecard_Id.Doctor_ID.ShortName if row.Doctor_Ratecard_Id and row.Doctor_Ratecard_Id.Doctor_ID else None,
                'WardName': roomdatas_last.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdatas_last and roomdatas_last.RoomId else "",
                'ROOMNo': roomdatas_last.RoomId.Ward_Name.RoomNo if roomdatas_last and roomdatas_last.RoomId else "",
                'BedNo': roomdatas_last.RoomId.Bed_No if roomdatas_last and roomdatas_last.RoomId else ""
            }
            
            ip_bill_service_data = {
                'Billing_data_list': Billing_data_list,
                'Billing_data': Billing_data,
                'services': services_list,
                'pharmacy_list': pharmacy_list,
                'CumulativeConsultation': round(cumulative_consultation, 2),
                'CumulativeLab': round(cumulative_lab, 2),
                'CumulativeRadiology': round(cumulative_radiology, 2),
                'CumulativeGeneralServices': round(cumulative_general_services, 2),
                'OT_data': OT_list,
                'Lab_list': Lab_list,
                'Rad_list': Rad_list,
                'InterimList': Interim_list,
            }    
            
            return JsonResponse(ip_bill_service_data, safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)})




@csrf_exempt
@require_http_methods(['GET'])
def get_overall_patient_details_for_discharged(request):
    if request.method == 'GET':
        try:
            # Extract filters
            name_or_phone = request.GET.get('SearchbyFirstName', '').strip()
            patient_id = request.GET.get('SearchbyPatientId', '').strip()
            registration_id = request.GET.get('SearchbyRegistrationId', '').strip()
            phone_no = request.GET.get('SearchbyPhoneNumber', '').strip()
            doctor = request.GET.get('SearchbyDoctor', '').strip()
            speciality = request.GET.get('SearchbySpeciality', '').strip()
            # status = request.GET.get('SearchStatus', '').strip()
            date_type = request.GET.get('DateType', '').strip()
            advance_type = request.GET.get('AdvanceType', '').strip()
            current_date = request.GET.get('CurrentDate', '').strip()
            from_date = request.GET.get('FromDate', '').strip()
            to_date = request.GET.get('ToDate', '').strip()
 
            # Start with empty queryset
            patient_list = []
            patient_ids_set = set()
            print('nameeeeeeeeee',name_or_phone)
            print('regggggg',registration_id)
            print('patittttttt',patient_id)
            if advance_type == 'OP':
                # OP Filter
                op_filters = Q()
                if name_or_phone:
                    op_filters |= Q(PatientId__FirstName__icontains=name_or_phone)
                if phone_no:
                    op_filters |= Q(PatientId__PhoneNo__icontains=phone_no)
 
                if patient_id:
                    op_filters |= Q(PatientId__PatientId__icontains=patient_id)
                if registration_id:
                    op_filters |= Q(Registration_Id__icontains=registration_id)
 
                if date_type == "Current" and current_date:
                    op_filters &= Q(created_at__date=current_date)
                elif date_type == "Customize" and from_date and to_date:
                    op_filters &= Q(created_at__date__range=[from_date, to_date])
 
                op_records = Patient_Appointment_Registration_Detials.objects.filter(op_filters).select_related('PatientId')[:1000]
                print('oppppp',op_records, op_filters)
                for op in op_records:
                    patient = op.PatientId
                    doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                        Registration_Id__Registration_Id=op.Registration_Id
                    ).first()
 
                    # Optional filters for doctor/speciality
                    if doctor and (not doc_ins or not doc_ins.PrimaryDoctor or doctor.lower() not in doc_ins.PrimaryDoctor.First_Name.lower()):
                        continue
                    if speciality and (not doc_ins or not doc_ins.Specialization or speciality.lower() not in doc_ins.Specialization.Speciality_Name.lower()):
                        continue
 
                    patient_list.append({
                        'id': len(patient_list) + 1,
                        'type': 'OP',
                        'RegistrationId': op.Registration_Id,
                        'PatientId': patient.PatientId,
                        'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                        'PhoneNo': patient.PhoneNo,
                        'Age': f"{patient.Age}/{patient.Gender}",
                        'Gender': patient.Gender,
                        'isMLC': op.IsMLC,
                        'isRefferal': op.IsReferral,
                        'Status': op.Status,
                        'DoctorName': f"{doc_ins.PrimaryDoctor.Tittle.Title_Name}.{doc_ins.PrimaryDoctor.First_Name} {doc_ins.PrimaryDoctor.Last_Name}" if doc_ins and doc_ins.PrimaryDoctor else '',
                        'Specilization': str(doc_ins.Specialization.Speciality_Name) if doc_ins and doc_ins.Specialization else '',
                        'PatientCategory': op.PatientCategory,
                        'AdmissionDate': op.created_at.strftime("%d-%m-%Y"),
                        'Address': ', '.join(filter(None, [
                            patient.DoorNo, patient.Street, patient.Area,
                            patient.City, patient.State, patient.Country, patient.Pincode
                        ])) or "No address available"
                    })
 
                    patient_ids_set.add(patient.PatientId)
            elif advance_type == 'IP':
                # IP Filter
                ip_filters = Q()
                if name_or_phone:
                    ip_filters |= Q(PatientId__FirstName__icontains=name_or_phone)
                if phone_no:
                    ip_filters |= Q(PatientId__PhoneNo__icontains=phone_no)
                if patient_id:
                    ip_filters |= Q(PatientId__PatientId__icontains=patient_id)
                if registration_id:
                    ip_filters &= Q(Registration_Id__icontains=registration_id)
 
                if date_type == "Current" and current_date:
                    ip_filters &= Q(created_at__date=current_date)
                elif date_type == "Customize" and from_date and to_date:
                    ip_filters &= Q(created_at__date__range=[from_date, to_date])
 
                ip_records = Patient_IP_Registration_Detials.objects.filter(ip_filters,Status__in=['Admitted','Pending','Completed']).select_related('PatientId')[:1000]
                print('ippppp',ip_records)
                for register in ip_records:
                    patient = register.PatientId
 
                    # Skip if already added as OP
                    if patient.PatientId in patient_ids_set:
                        continue
 
                    # Optional filters for doctor/speciality
                    if doctor and (not register.PrimaryDoctor or doctor.lower() not in register.PrimaryDoctor.First_Name.lower()):
                        continue
                    if speciality and (not register.Specialization or speciality.lower() not in register.Specialization.Speciality_Name.lower()):
                        continue
 
                    ip_data = {
                        'id': len(patient_list) + 1,
                        'type': "IP",
                        'RegistrationId': register.Registration_Id,
                        'PatientId': patient.PatientId,
                        'PatientName': f"{patient.Title.Title_Name}.{patient.FirstName} {patient.MiddleName} {patient.SurName}",
                        'PhoneNo': patient.PhoneNo,
                        'Age': f"{patient.Age}/{patient.Gender}",
                        'Gender': patient.Gender,
                        'Complaint': register.Complaint,
                        'isMLC': register.IsMLC,
                        'isRefferal': register.IsReferral,
                        'Status': register.Status,
                        'DoctorName': f"{register.PrimaryDoctor.Tittle.Title_Name}.{register.PrimaryDoctor.First_Name} {register.PrimaryDoctor.Last_Name}" if register.PrimaryDoctor else '',
                        'Specilization': str(register.Specialization.Speciality_Name) if register.Specialization else '',
                        'PatientCategory': register.PatientCategory,
                        'AdmissionDate': register.created_at.strftime("%d-%m-%Y"),
                        'Address': ', '.join(filter(None, [
                            patient.DoorNo, patient.Street, patient.Area,
                            patient.City, patient.State, patient.Country, patient.Pincode
                        ])) or "No address available"
                    }
 
                    # Room details
                    if register.Booking_Status in ['Booked', 'Occupied', 'Vacated']:
                        room = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id=register).order_by('-created_by').first()
                        if room and room.RoomId:
                            ip_data.update({
                                'BuildingName': room.RoomId.Building_Name.Building_Name,
                                'BlockName': room.RoomId.Block_Name.Block_Name,
                                'FloorName': room.RoomId.Floor_Name.Floor_Name,
                                'WardName': room.RoomId.Ward_Name.Ward_Name.Ward_Name,
                                'WardId': room.RoomId.Ward_Name.Ward_Name.Ward_Id,
                                'RoomNo': room.RoomId.Ward_Name.RoomNo,
                                'BedNo': room.RoomId.Bed_No,
                                'RoomId': room.RoomId.Room_Id,
                                'RoomDetails': f"{room.RoomId.Floor_Name.Floor_Name}-{room.RoomId.Ward_Name.Ward_Name.Ward_Name}-{room.RoomId.Ward_Name.RoomNo}/{room.RoomId.Bed_No}",
                            })
 
                    patient_list.append(ip_data)
 
            return JsonResponse(patient_list, safe=False)
 
        except Exception as e:
            print(str(e))
            return JsonResponse({'error': str(e)})
 
 
def safe_to_decimal(value, default=0.00):
        print(f"Converting value: {value}, type: {type(value)}")  # Debug log
        if value is None:
            print("Value is None, returning default")
            return Decimal(str(default))
        try:
            return Decimal(str(value))
        except (InvalidOperation, TypeError, ValueError) as e:
            print(f"Error converting {value} to Decimal: {str(e)}")
            return Decimal(str(default))
 
@csrf_exempt
@require_http_methods(['POST'])
def Outstanding_Credit_Details_Link(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            print(data, 'data:::::')
           
            billAmount_list = data.get('billAmount', [])
            initial_state = data.get('initialState', {})
            IP_BillingData = data.get('IP_BillingData', {})
            billing_data = data.get('BillingData', {})
            created_by = data.get('Created_by', '')
           
            # Handle billAmount as list - get first item or default to empty dict
            billAmount = {}
            if billAmount_list and isinstance(billAmount_list, list) and len(billAmount_list) > 0:
                billAmount = billAmount_list[0] if isinstance(billAmount_list[0], dict) else {}
            else:
                # If no valid billAmount, create default structure
                billAmount = {
                    'Billpay_method': '',
                    'paidamount': '0',
                    # ... other defaults
                }
           
            # Validate required data
            if not IP_BillingData:
                return JsonResponse({'error': 'IP_BillingData is required'}, status=400)
           
            FBillNo = IP_BillingData.get('FBillNo')
            if not FBillNo:
                return JsonResponse({'error': 'FBillNo is required'}, status=400)
 
            # Get the billing instance
            Fbillins = IP_Billing_Table_Detials.objects.filter(Billing_Invoice_No=FBillNo).first()
            if not Fbillins:
                return JsonResponse({'error': 'Billing record not found'}, status=404)
 
            # Validate billAmount data - now billAmount is guaranteed to be a dict
            paid_amount = safe_to_decimal(billAmount.get('paidamount', '0'))
            if paid_amount <= 0:
                return JsonResponse({'error': 'Invalid paid amount'}, status=400)
 
            # Create Outstanding Billing record
            credit_billing = Outstanding_Billing_Table_Detials.objects.create(
                Billing_Date=billing_data.get('InvoiceDate'),
                FBill=Fbillins,
                Doctor_Id=Fbillins.Doctor_Id,
                Patient_Id=Fbillins.Patient_Id,
                Register_Id=Fbillins.Register_Id,
                Billing_Type='CreditBill',
                Select_Discount=Fbillins.Select_Discount,
                Discount_Type=Fbillins.Discount_Type,
                Discount_Value=Fbillins.Discount_Value,
                Discount_Amount=Fbillins.Discount_Amount,
                Total_Items=Fbillins.Total_Items,
                Total_Qty=Fbillins.Total_Qty,
                Total_Amount=Fbillins.Total_Amount,
                Total_GSTAmount=Fbillins.Total_GSTAmount,
                Net_Amount=Fbillins.Net_Amount,
                Net_Paid_Amount=Fbillins.Net_Paid_Amount,
                Round_Off=Fbillins.Round_Off,
                Paid_Amount=paid_amount,
                Balance_Amount=0,
                Bill_Status='Paid',
                created_by=created_by
            )
 
            # Create Outstanding Billing Receipt
            OutstandingBillingReceiptins = OutstandingBillingReceipt.objects.create(
                Invoice_NO=credit_billing,
                PatientID=Fbillins.Patient_Id.PatientId,
                PhoneNumber=Fbillins.Patient_Id.PhoneNo,
                Patient_Name=f"{Fbillins.Patient_Id.FirstName} {Fbillins.Patient_Id.MiddleName} {Fbillins.Patient_Id.SurName}".strip(),
                TotalAmount=Fbillins.Net_Amount,
                TotalPaidAmount=paid_amount,
                BalanceAmount=0,
                Billing_Date=billing_data.get('InvoiceDate'),
                PaidAmount=paid_amount,
                Billedby=created_by
            )
 
            # Create Payment record
            paymentins = Multiple_Payment_Table_Outstanding_Detials.objects.create(
                Invoice_No=OutstandingBillingReceiptins,
                Payment_Type=billAmount.get('Billpay_method', ''),
                Cart_Type=billAmount.get('CardType', ''),
                Card_No=billAmount.get('CardNo', ''),
                TransactionId=billAmount.get('TransactionId', ''),
                upiid=billAmount.get('upiid', ''),
                Cheque_No=billAmount.get('ChequeNo', ''),
                Bank_Name=billAmount.get('BankName', ''),
                Amount=paid_amount,
                Transaction_Amount=safe_to_decimal(billAmount.get('transactionFee', '0')),
                AdditionalAmount=safe_to_decimal(billAmount.get('Additionalamount', '0')),
                created_by=created_by
            )
 
            remaining_balance = Fbillins.Balance_Amount - paid_amount
            print(remaining_balance, 'remaining_balance')
            print(type(remaining_balance), 'remaining_balance')
 
            if remaining_balance <= 0:
               
                Fbillins.IsCreditPaid = True
                Fbillins.CreditPaidDate = billing_data.get('InvoiceDate')
                Fbillins.Balance_Amount = remaining_balance
                Fbillins.save()
               
                print('Balance cleared, credit paid in full.')
               
            else:
               
                Fbillins.Balance_Amount = remaining_balance
                Fbillins.CreditPaidDate = billing_data.get('InvoiceDate')
                Fbillins.save()
               
                print('Partial payment made, balance remains.')
 
 
            return JsonResponse({
                'success': True,
                'message': 'Billing Details Saved successfully',
                'InvoiceNo': credit_billing.Billing_Invoice_No,
                # 'receipt_id': OutstandingBillingReceiptins.id,
                # 'payment_id': paymentins.id
            })
 
       
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

 
@csrf_exempt
@require_http_methods(['GET'])
def IP_Outstanding_Billing_Service_List(request):
    if request.method == "GET":
        try:
            QueueList_ID = request.GET.get('QueueList_ID')
            Billing_Invoice_No = request.GET.get('Billing_Invoice_No')
           
            if not Billing_Invoice_No:
                if not QueueList_ID:
                    return JsonResponse({'error': 'QueueList_ID is required'}, status=400)
               
                try:
                    row = IP_Billing_QueueList_Detials.objects.get(Registration_Id=QueueList_ID)
                except IP_Billing_QueueList_Detials.DoesNotExist:
                    return JsonResponse({'error': 'Billing data not found'}, status=404)
               
                # Get room data for ward/room/bed info
                roomdatas = Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__pk=QueueList_ID,
                    IsStayed=True
                ).exclude(Iscanceled=True).last()
               
                # Format patient name
                full_name = f"""{row.Registration_Id.PatientId.Title.Title_Name}{"."}{row.Registration_Id.PatientId.FirstName} {row.Registration_Id.PatientId.MiddleName} {row.Registration_Id.PatientId.SurName}"""
                formatted_date = row.created_at.strftime("%d/%b/%Y")
                DocQual = ''
 
                DocQualification = Doctor_ProfessForm_Detials.objects.filter(Doctor_ID__Doctor_ID = row.Doctor_Ratecard_Id.Doctor_ID).first()
                if DocQualification:
                    DocQual = DocQualification.Qualification
               
                # Prepare billing data
                Billing_data = {    
                    'id': row.BillingQueueList_ID,
                    'Billing_Type': row.Billing_Type,
                    'Status': row.Status,
                    'Date': formatted_date,
                    'Registration_Id': row.Registration_Id.Registration_Id,
                    'PatientId': row.Registration_Id.PatientId.PatientId,
                    'PhoneNo': row.Registration_Id.PatientId.PhoneNo,
                    'Patient_Name': full_name.strip(),
                    'Gender': row.Registration_Id.PatientId.Gender,
                    'DoorNo': row.Registration_Id.PatientId.DoorNo,
                    'AgeGender': f"""{row.Registration_Id.PatientId.Age}{row.Registration_Id.PatientId.Gender}""",
                    'Street': row.Registration_Id.PatientId.Street,
                    'Area': row.Registration_Id.PatientId.Area,
                    'City': row.Registration_Id.PatientId.City,
                    'State': row.Registration_Id.PatientId.State,
                    'Country': row.Registration_Id.PatientId.Country,
                    'Pincode': row.Registration_Id.PatientId.Pincode,
                    'PatientType': row.Registration_Id.PatientId.PatientType,
                    'PatientCategory': row.Registration_Id.PatientCategory,
                    'Doctor_ID': row.Doctor_Ratecard_Id.Doctor_ID.Doctor_ID if row.Doctor_Ratecard_Id else None,
                    'Doctor_ShortName': f"""{row.Doctor_Ratecard_Id.Doctor_ID.Tittle.Title_Name}.{row.Doctor_Ratecard_Id.Doctor_ID.First_Name}{row.Doctor_Ratecard_Id.Doctor_ID.Middle_Name}{row.Doctor_Ratecard_Id.Doctor_ID.Last_Name} ({DocQual})""" if row.Doctor_Ratecard_Id else None,
                    'AdmittionDate': row.Registration_Id.created_at.strftime('%d-%m-%y'),
                    'Address': f"""{row.Registration_Id.PatientId.PermanentdoorNo},{row.Registration_Id.PatientId.PermanentArea},{row.Registration_Id.PatientId.PermanentStreet}""",
                }
               
                # Add ward/room/bed info if room data exists
                if roomdatas and roomdatas.RoomId and roomdatas.RoomId.Ward_Name:
                    Billing_data.update({
                        'WardName': roomdatas.RoomId.Ward_Name.Ward_Name.Ward_Name if roomdatas.RoomId.Ward_Name.Ward_Name else '',
                        'ROOMNo': roomdatas.RoomId.Ward_Name.RoomNo if roomdatas.RoomId.Ward_Name else '',
                        'BedNo': roomdatas.RoomId.Bed_No if roomdatas.RoomId else ''
                    })
                else:
                    Billing_data.update({
                        'WardName': '',
                        'ROOMNo': '',
                        'BedNo': ''
                    })
               
                return JsonResponse({
                    'Billing_data': Billing_data
                })
               
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
 
 
 

@csrf_exempt
@require_http_methods(['GET'])
def IPFinalBill_Details_Link_Credit_for_Payment(request):
 
    try:
 
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        SearchbyFirstName = request.GET.get('SearchbyFirstName','')
 
        search_query = Q()
 
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
               
        if SelectedUsers:
                search_query &= Q(created_by__in=SelectedUsers)
 
        if SearchbyFirstName:
            search_query &= (
                Q(Patient_Id__FirstName__icontains=SearchbyFirstName)
                | Q(Patient_Id__PatientId__icontains=SearchbyFirstName)
                | Q(Billing_Invoice_No__iexact=f"IPDR/{SearchbyFirstName}")
                | Q(Register_Id__Registration_Id=f"IP{SearchbyFirstName}")
                | Q(created_by__icontains=SearchbyFirstName)
            )
 
        Finalbillins = IP_Billing_Table_Detials.objects.filter(search_query & Q(Billing_Type='FinalBill') & Q(Bill_Status='Credit') & Q(IsCreditPaid = False)).exclude(created_by__in=['host', 'admin'])
        FinalbillList = []
 
        for fbill in Finalbillins:
 
            datalist = {
 
                'FBillNo' : fbill.Billing_Invoice_No,
                'FBilldate' : fbill.Billing_Date.strftime('%d-%m-%y'),
                'Patientid' : fbill.Patient_Id.PatientId,
                'IPNo' : fbill.Register_Id.Registration_Id,
                'Patientname' : f"""{fbill.Patient_Id.FirstName} {fbill.Patient_Id.MiddleName}{fbill.Patient_Id.SurName}""",
                'Net_Amount' : fbill.Net_Amount,
                'Discount' : fbill.Discount_Amount,
                'Advanceamt' : fbill.Advance_Amount,
                'Paidamt' : fbill.Paid_Amount,
                'Refundamt' : fbill.Refund_Amount,
                'Receivable_Amount' : fbill.Receivable_Amount,
                'BillStatus' : fbill.Bill_Status,
                'Balance_Amount' : fbill.Balance_Amount,
                'Remarks' : fbill.Remarks,
                'Billedby' : fbill.created_by
 
            }
            FinalbillList.append(datalist)
 
        return JsonResponse(FinalbillList,safe=False)
 
    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
@csrf_exempt
@require_http_methods(['GET'])
def Outstanding_Credit_Details_For_Reprint(request):
    try:
        DateType = request.GET.get('DateType', '')
        CurrentDate = request.GET.get('CurrentDate', '')
        FromDate = request.GET.get('FromDate', '')
        ToDate = request.GET.get('ToDate', '')
        userid = request.GET.get('userid', '')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')
        SearchbyFirstName = request.GET.get('SearchbyFirstName', '')
        BillingType = request.GET.get('BillingType', 'CreditBill')  # Default to CreditBill
        BillStatus = request.GET.get('BillStatus', '')  # Optional filter for Bill Status

        search_query = Q()

        # Date filtering
        if DateType == "Current" and CurrentDate:
            try:
                current_date = datetime.strptime(CurrentDate, '%Y-%m-%d').date()
                search_query &= Q(created_at__date=current_date)
            except ValueError:
                raise ValueError('Invalid CurrentDate format. Use YYYY-MM-DD.')
        elif DateType == "Customize":
            try:
                if FromDate and ToDate:
                    FromDate_dt = datetime.strptime(FromDate, '%Y-%m-%d').date()
                    ToDate_dt = datetime.strptime(ToDate, '%Y-%m-%d').date()
                    search_query &= Q(created_at__date__range=[FromDate_dt, ToDate_dt])
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')

        # User filtering
        if SelectedUsers:
            search_query &= Q(created_by__in=SelectedUsers)

        # Search by various fields
        if SearchbyFirstName:
            search_query &= (
                Q(Patient_Id__FirstName__icontains=SearchbyFirstName) |
                Q(Patient_Id__PatientId__icontains=SearchbyFirstName) |
                Q(Billing_Invoice_No__icontains=SearchbyFirstName) |
                Q(Register_Id__Registration_Id__icontains=SearchbyFirstName) |
                Q(Doctor_Id__DoctorId__icontains=SearchbyFirstName) |
                Q(created_by__icontains=SearchbyFirstName)
            )

        # Base query - filter by Billing_Type and exclude system users
        base_query = Outstanding_Billing_Table_Detials.objects.filter(
            search_query
        ).exclude(created_by__in=['host', 'admin'])

        print(len(base_query),'base_queryyyyy')

        # Optional Bill Status filter
        if BillStatus:
            base_query = base_query.filter(Bill_Status=BillStatus)

        # Order by latest created
        outstanding_bills = base_query.order_by('-created_at')

        outstanding_bills_list = []

        for bill in outstanding_bills:
            # Get related payment information if available
            payment_info = None
            receipt = OutstandingBillingReceipt.objects.filter(Invoice_NO=bill).first()
            if receipt:
                multiple_payments = Multiple_Payment_Table_Outstanding_Detials.objects.filter(Invoice_No=receipt)
                payment_list = []
                for payment in multiple_payments:
                    payment_list.append({
                        'payment_type': payment.Payment_Type,
                        'amount': payment.Amount,
                        'transaction_id': payment.TransactionId,
                        'card_type': payment.Cart_Type,
                        'cheque_no': payment.Cheque_No,
                        'bank_name': payment.Bank_Name
                    })
                payment_info = payment_list

            Admissiondatas = Patient_Admission_Room_Detials.objects.filter(IP_Registration_Id__Registration_Id = bill.Register_Id.Registration_Id).order_by('-created_at').first()

            datalist = {
                'Billing_Invoice_No': bill.Billing_Invoice_No,
                'Billing_Date': bill.Billing_Date.strftime('%d-%m-%y'),
                'Patient_Id': bill.Patient_Id.PatientId,
                'Patient_Name': f"{bill.Patient_Id.Title.Title_Name}.{bill.Patient_Id.FirstName} {bill.Patient_Id.MiddleName or ''} {bill.Patient_Id.SurName}".strip(),
                "Agegender": f"""{bill.Patient_Id.Age}/{bill.Patient_Id.Gender}""",
                'Admissiondate':bill.Register_Id.created_at.strftime('%d-%m-%y'),
                'Wardname' : Admissiondatas.RoomId.Ward_Name.Ward_Name.Ward_Name,
                "Mobileno" : bill.Patient_Id.PhoneNo,
                'Address' : f"""{bill.Patient_Id.PermanentdoorNo} {bill.Patient_Id.PermanentStreet} {bill.Patient_Id.PermanentArea} {bill.Patient_Id.PermanentDistrict}""",
                "Patientcategory": bill.Register_Id.PatientCategory,
                'Registration_Id': bill.Register_Id.Registration_Id if bill.Register_Id else '',
                'Doctor_Id': bill.Doctor_Id.Doctor_ID if bill.Doctor_Id else '',
                'Doctor_Name': f"{'Dr'}.{bill.Doctor_Id.First_Name} {bill.Doctor_Id.Last_Name}" if bill.Doctor_Id else '',
                'Billing_Type': bill.Billing_Type,
                'Total_Amount': float(bill.Total_Amount),
                'Discount_Amount': float(bill.Discount_Amount),
                'Net_Amount': float(bill.Net_Amount),
                'Paid_Amount': float(bill.Paid_Amount),
                'Balance_Amount': float(bill.Balance_Amount),
                'Net_Paid_Amount': float(bill.Net_Paid_Amount),
                'Bill_Status': bill.Bill_Status,
                'Refund_Status': bill.Refund_Status,
                'Refund_Amount': float(bill.Refund_Amount),
                'Advance_Amount': float(bill.Advance_Amount),
                'Receivable_Amount': float(bill.Receivable_Amount),
                'Remarks': bill.Remarks or '',
                'IsCreditPaid': bill.IsCreditPaid,
                'CreditPaidDate': bill.CreditPaidDate.strftime('%d-%m-%Y') if bill.CreditPaidDate else '',
                'Created_By': bill.created_by,
                'Created_At': bill.created_at.strftime('%d-%m-%Y %H:%M:%S'),
                'Updated_At': bill.updated_at.strftime('%d-%m-%Y %H:%M:%S'),
                'Payment_Info': payment_info
            }
            outstanding_bills_list.append(datalist)

        return JsonResponse(outstanding_bills_list, safe=False)

    except ValueError as ve:
        return JsonResponse({'error': f'Invalid input: {str(ve)}'}, status=400)
    except DatabaseError as de:
        return JsonResponse({'error': f'Database error: {str(de)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


 
 
