from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Count, Case, When, IntegerField, Q
from datetime import datetime, date
import json

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import  Q
from django.db import transaction
from PIL import Image
from io import BytesIO
import base64
# import magic
from PyPDF2 import PdfReader, PdfWriter
from Masters.models import *
from Workbench.models import Op_to_Ip_Convertion_Table
from Masters.Login import authenticate_request
from django.db import transaction
from PIL import Image
from io import BytesIO
import base64
# import magic
import filetype
from PyPDF2 import PdfReader, PdfWriter
from Workbench.models import Op_to_Ip_Convertion_Table
from datetime import datetime
from django.utils import timezone
from OutPatient.models import *
from datetime import date
from Workbench.models import *
from django.shortcuts import get_object_or_404
from django.db.models.functions import Cast
from django.db.models import IntegerField  # or any other type you want to cast to


# ABHA
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
import base64
from datetime import datetime
import uuid
import json
# from rest_framework.exceptions import IntegrityError
from .models import *
from django.db.models import Max
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from Ip_Workbench.models import *
from Workbench.Prescription import update_refer_doctor_data,update_op_ip_data,update_ot_request_data,update_follow_up_data

from Lab.models import *

from django.forms.models import model_to_dict
 
from datetime import timedelta
from django.utils.timezone import now

def get_file_image(filedata):
    kind = filetype.guess(filedata)
                
    # Default to PDF if the type is undetermined
    contenttype1 = 'application/pdf'
    if kind and kind.mime == 'image/jpeg':
        contenttype1 = 'image/jpeg'
    elif kind and kind.mime == 'image/png':
        contenttype1 = 'image/png'

    # Return base64 encoded data with MIME type
    return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'


 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from datetime import datetime
from django.db.models import Count

@csrf_exempt
@require_http_methods(["GET"])
def Mci_Patient_Reports_OP(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        selected_genders = request.GET.getlist('selectedGenders[]')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        selectedCategories = request.GET.getlist('selectedCategories[]')
        selectedInsurance = [int(s) for s in request.GET.getlist('selectedInsurance[]')]

        # Debugging output
        print(selected_genders, 'selected_genders')
        print(selected_specialities, 'selected_specialities')

        # Initialize date filters
        if date_type == 'Current':
            date_filter = Q(Registration_Id__created_at__date=current_date)
            old_date_filter = Q(Registration_Id__created_at__date=current_date)
        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
                old_date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base querysets
        new_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType='NewConsultation',
            Registration_Id__VisitPurpose='OP'
        )

        old_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            old_date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType__in=['FollowUp No Fee', 'FollowUp With Fee','FollowUp'],
            Registration_Id__VisitPurpose='OP'
        )

        print(new_patients1.count(), 'new_patients_initial')

        # Apply gender filter (without age, as age will be filtered in Python)
        gender_queries = Q()
        if selected_genders:
            # Include Male and MaleChild as Gender='Male', Female as Gender='Female'
            if 'Male' in selected_genders or 'MaleChild' in selected_genders:
                gender_queries |= Q(Registration_Id__PatientId__Gender='Male')
            if 'Female' in selected_genders:
                gender_queries |= Q(Registration_Id__PatientId__Gender='Female')
            if gender_queries:
                new_patients1 = new_patients1.filter(gender_queries)
                old_patients1 = old_patients1.filter(gender_queries)

        print(new_patients1.count(), 'new_patients_after_gender')

        # Apply specialty filter
        if selected_specialities:
            new_patients1 = new_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)
            old_patients1 = old_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)

        print(new_patients1.count(), 'new_patients_after_specialities')
        print(old_patients1.count(), 'new_patients_after_specialities')


        if selectedCategories:
            new_patients1 = new_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)
            old_patients1 = old_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)

            print(new_patients1.count(),'new_patients1selectedCategories')
            print(old_patients1.count(),'old_patients1selectedCategories')


        if selectedInsurance:
            
            new_patients1 = new_patients1.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)
            old_patients1 = old_patients1.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)

            print(new_patients1.count(),'new_patients1selectedInsurance')
            print(old_patients1.count(),'old_patients1selectedInsurance')



        # Helper function to extract numeric age
        def get_age_value(age_str):
            try:
                if not age_str:  # Handle None or empty string
                    return 0
                # Case 1: Simple numeric string like '26'
                if age_str.isdigit():
                    return int(age_str)
                # Case 2: String with units like '26 Years' or '26 y 7 m 6 d'
                parts = age_str.split()
                for part in parts:
                    if part.isdigit():
                        return int(part)  # Return the first number (years)
                return 0
            except (ValueError, AttributeError) as e:
                print(f"Invalid age format: {age_str}, Error: {e}")
                return 0

        # Apply age filter in Python for Male and MaleChild
        def filter_by_age_and_gender(queryset, selected_genders):

            filtered = []
            for patient in queryset:

                age = get_age_value(patient.Registration_Id.PatientId.Age)
                gender = patient.Registration_Id.PatientId.Gender

                if (('Male' in selected_genders and gender == 'Male' and age > 15) or
                    ('MaleChild' in selected_genders and gender == 'Male' and age <= 15 and age > 0) or
                    ('FemaleChild' in selected_genders and gender == 'Female' and age <= 15 and age > 0) or
                    ('Female' in selected_genders and gender == 'Female')):
                    filtered.append(patient)
            return filtered


        if selected_genders:

            print('insideeeeeeeeee',selected_genders)

            new_patients1 = filter_by_age_and_gender(new_patients1, selected_genders)

            print('erorrrrrrrrr')
            old_patients1 = filter_by_age_and_gender(old_patients1, selected_genders)

        
        # print(new_patients1.count(),'FinalCountttttt')
        # print(old_patients1.count(),'FinalCountttttt')

        # Format response data
        new_patientlist = []
        for patient in new_patients1:
            if patient:
                age = get_age_value(patient.Registration_Id.PatientId.Age)
                datalist = {
                    'Department': patient.Specialization.Speciality_Name,
                    'Male': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age > 15 else 0,
                    'Female': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age > 15 else 0,
                    'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age > 0 else 0,
                    'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age > 0 else 0,
                }
                new_patientlist.append(datalist)

        old_patientlist = []
        for patient in old_patients1:
            if patient:
                age = get_age_value(patient.Registration_Id.PatientId.Age)
                datalist = {

                    'Department': patient.Specialization.Speciality_Name,
                    'Male': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age > 15 else 0,
                    'Female': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age > 15 else 0,
                    'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age > 0 else 0,
                    'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age > 0 else 0,
                }
                old_patientlist.append(datalist)

        # Combine data for response
        response_data = {
            'New': new_patientlist,
            'Old': old_patientlist
        }

        return JsonResponse(response_data, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Mci_New_Patient_Reports_OP(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        selected_genders = request.GET.getlist('selectedGenders[]')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        selectedCategories = request.GET.getlist('selectedCategories[]')
        selectedInsurance = [int(s) for s in request.GET.getlist('selectedInsurance[]')]

        # Debugging output
        print(selected_genders, 'selected_genders')
        print(selected_specialities, 'selected_specialities')

        # Initialize date filters
        if date_type == 'Current':
            date_filter = Q(Registration_Id__created_at__date=current_date)
            old_date_filter = Q(Registration_Id__created_at__date=current_date)
        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
                old_date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base querysets
        new_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType='NewConsultation',
            Registration_Id__VisitPurpose='OP'
        )

        # Apply gender filter (without age, as age will be filtered in Python)
        gender_queries = Q()
        if selected_genders:
            # Include Male and MaleChild as Gender='Male', Female as Gender='Female'
            if 'Male' in selected_genders or 'MaleChild' in selected_genders:
                gender_queries |= Q(Registration_Id__PatientId__Gender='Male')
            if 'Female' in selected_genders:
                gender_queries |= Q(Registration_Id__PatientId__Gender='Female')
            if gender_queries:
                new_patients1 = new_patients1.filter(gender_queries)


        # Apply specialty filter
        if selected_specialities:
            new_patients1 = new_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)

        if selectedCategories:
            new_patients1 = new_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)

        if selectedInsurance:           
            new_patients1 = new_patients1.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)

        # Helper function to extract numeric age
        def get_age_value(age_str):
            try:
                if not age_str:  # Handle None or empty string
                    return 0
                # Case 1: Simple numeric string like '26'
                if age_str.isdigit():
                    return int(age_str)
                # Case 2: String with units like '26 Years' or '26 y 7 m 6 d'
                parts = age_str.split()
                for part in parts:
                    if part.isdigit():
                        return int(part)  # Return the first number (years)
                return 0
            except (ValueError, AttributeError) as e:
                print(f"Invalid age format: {age_str}, Error: {e}")
                return 0

        # Apply age filter in Python for Male and MaleChild
        def filter_by_age_and_gender(queryset, selected_genders):
            filtered = []
            for patient in queryset:

                age = get_age_value(patient.Registration_Id.PatientId.Age)
                gender = patient.Registration_Id.PatientId.Gender

                print(age,'ageage')
                print(gender,'gender')


                if (('Male' in selected_genders and gender == 'Male' and age > 15) or
                    ('MaleChild' in selected_genders and gender == 'Male' and age <= 15 and age > 0) or
                    ('FemaleChild' in selected_genders and gender == 'Female' and age <= 15 and age > 0) or
                    ('Female' in selected_genders and gender == 'Female')):
                    filtered.append(patient)
            return filtered


        if selected_genders:
            new_patients1 = filter_by_age_and_gender(new_patients1, selected_genders)

        print(len(new_patients1), 'new_patients_after_age')

        # Format response data
        new_patientlist = []
        for patient in new_patients1:

            print(patient,'patientttttttttt')
            age = get_age_value(patient.Registration_Id.PatientId.Age)
            datalist = {
                'Department': patient.Specialization.Speciality_Name,
                'Male': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age > 15 else 0,
                'Female': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age > 15 else 0,
                'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age > 0 else 0,
                'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age > 0 else 0,
            }
            new_patientlist.append(datalist)

       
        # Combine data for response
        response_data = {
            'New': new_patientlist,
        }

        return JsonResponse(response_data, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Mci_Revisit_Patient_Reports_OP(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        selected_genders = request.GET.getlist('selectedGenders[]')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        selectedCategories = request.GET.getlist('selectedCategories[]')
        selectedInsurance = [int(s) for s in request.GET.getlist('selectedInsurance[]')]


        # Debugging output
        print(selected_genders, 'selected_genders')
        print(selected_specialities, 'selected_specialities')

        # Initialize date filters
        if date_type == 'Current':

            print('cureeentnnnnnnnnn',current_date)
            date_filter = Q(Registration_Id__created_at__date=current_date)
            old_date_filter = Q(Registration_Id__created_at__date=current_date)
        else:

            print('bvcghsfdytftfg')
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
                old_date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base querysets


        old_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            old_date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType__in=['FollowUp No Fee', 'FollowUp With Fee','FollowUp'],
            Registration_Id__VisitPurpose='OP'
        )


        # Apply gender filter (without age, as age will be filtered in Python)
        gender_queries = Q()
        if selected_genders:
            # Include Male and MaleChild as Gender='Male', Female as Gender='Female'
            if 'Male' in selected_genders or 'MaleChild' in selected_genders:
                gender_queries |= Q(Registration_Id__PatientId__Gender='Male')
            if 'Female' in selected_genders:
                gender_queries |= Q(Registration_Id__PatientId__Gender='Female')
            if gender_queries:
                old_patients1 = old_patients1.filter(gender_queries)


        # Apply specialty filter
        if selected_specialities:
            old_patients1 = old_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)

        if selectedCategories:
            old_patients1 = old_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)


        if selectedInsurance:
            
            old_patients1 = old_patients1.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)



        # Helper function to extract numeric age
        def get_age_value(age_str):
            try:
                if not age_str:  # Handle None or empty string
                    return 0
                # Case 1: Simple numeric string like '26'
                if age_str.isdigit():
                    return int(age_str)
                # Case 2: String with units like '26 Years' or '26 y 7 m 6 d'
                parts = age_str.split()
                for part in parts:
                    if part.isdigit():
                        return int(part)  # Return the first number (years)
                return 0
            except (ValueError, AttributeError) as e:
                print(f"Invalid age format: {age_str}, Error: {e}")
                return 0


        # Apply age filter in Python for Male and MaleChild
        def filter_by_age_and_gender(queryset, selected_genders):
            filtered = []
            for patient in queryset:

                age = get_age_value(patient.Registration_Id.PatientId.Age)
                gender = patient.Registration_Id.PatientId.Gender

                print(age,'ageage')
                print(gender,'gender')


                if (('Male' in selected_genders and gender == 'Male' and age > 15) or
                    ('MaleChild' in selected_genders and gender == 'Male' and age <= 15 and age > 0) or
                    ('FemaleChild' in selected_genders and gender == 'Female' and age <= 15 and age > 0) or
                    ('Female' in selected_genders and gender == 'Female')):
                    filtered.append(patient)
            return filtered


        if selected_genders:
            old_patients1 = filter_by_age_and_gender(old_patients1, selected_genders)


        old_patientlist = []
        for patient in old_patients1:
            age = get_age_value(patient.Registration_Id.PatientId.Age)
            datalist = {
                'Department': patient.Specialization.Speciality_Name,
                'Male': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age > 15 else 0,
                'Female': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age > 15 else 0,
                'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age > 0 else 0,
                'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age > 0 else 0,
            }
            old_patientlist.append(datalist)

        # Combine data for response
        response_data = {
            'Old': old_patientlist
        }

        return JsonResponse(response_data, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MCI_New_Patient_List1(request):

    try:

        newPatientins = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(VisitType='NewConsultation',Registration_Id__VisitPurpose='OP')

        NewList = []

        for datas in newPatientins:

            Title = datas.Registration_Id.PatientId.Title.Title_Name if datas.Registration_Id.PatientId.Title else None
            Fname = datas.Registration_Id.PatientId.FirstName if datas.Registration_Id.PatientId else None
            Mname = datas.Registration_Id.PatientId.MiddleName if datas.Registration_Id.PatientId else None
            Lname = datas.Registration_Id.PatientId.SurName if datas.Registration_Id.PatientId else None

            Fullname = f"""{Title}.{Fname}{Mname}{Lname}"""

            print(Fullname,'Fullname',datas.created_at,'datas.created_at')

            datalist = {
                    'OPDate': datas.created_at.strftime("%Y-%m-%d"),
                    'OPno': datas.Registration_Id.Registration_Id,
                    'PatientName' : Fullname,
                    'Sex':datas.Registration_Id.PatientId.Gender,
                    'Age': datas.Registration_Id.PatientId.Age,
                    'DeptName': datas.Specialization.Speciality_Name if datas.Specialization else None

            }
            NewList.append(datalist)

        return JsonResponse(NewList,safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, StreamingHttpResponse
from django.db.models import Q
from datetime import datetime
import json


@csrf_exempt
@require_http_methods(["GET"])
def MCI_New_Patient_List(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        
        selected_genders = request.GET.getlist('selectedGenders[]') or []
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selectedCategories = request.GET.getlist('selectedCategories[]')
        selectedInsurance = request.GET.getlist('selectedInsurance[]')

        # Convert IDs to integers where applicable
        try:
            selected_specialities = list(map(int, selected_specialities))
        except ValueError:
            selected_specialities = []

        try:
            selectedInsurance = list(map(int, selectedInsurance))
        except ValueError:
            selectedInsurance = []

        # Date filtering
        if date_type == 'Current':
            date_filter = Q(Registration_Id__created_at__date=current_date)

        elif date_type == 'Particular':
            date_filter = Q(Registration_Id__created_at__date=ParticularDate)


        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base queryset with date and fixed filters
        newPatientins = (
            MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects
            .filter(
                date_filter,
                VisitType='NewConsultation',
                Registration_Id__VisitPurpose='OP'
            )
            .select_related(
                'Registration_Id',
                'Registration_Id__PatientId',
                'Registration_Id__PatientId__Title',
                'Registration_Id__InsuranceName',
                'Specialization'
            )
            .order_by('-created_at')
        )

        print(len(newPatientins),'newPatientins')

        # Apply dynamic filters
        if selected_specialities:
            newPatientins = newPatientins.filter(Specialization__Speciality_Id__in=selected_specialities)

        if selectedCategories:
            newPatientins = newPatientins.filter(Registration_Id__PatientCategory__in=selectedCategories)

        if selectedInsurance:
            newPatientins = newPatientins.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)

        if selected_genders:
            newPatientins = newPatientins.filter(Registration_Id__PatientId__Gender__in=selected_genders)

        # Generator for efficient memory usage
        def generate_json():
            yield '['
            first = True
            for datas in newPatientins:
                if not first:
                    yield ','
                first = False

                title = datas.Registration_Id.PatientId.Title.Title_Name if datas.Registration_Id.PatientId.Title else ''
                fname = datas.Registration_Id.PatientId.FirstName or ''
                mname = datas.Registration_Id.PatientId.MiddleName or ''
                lname = datas.Registration_Id.PatientId.SurName or ''
                fullname = f"{title}.{fname} {mname} {lname}".strip()

                record = {
                    # 'OPDate': datas.created_at.strftime("%Y-%m-%d"),
                    'OPDate': datas.created_at.strftime("%d-%m-%y"),
                    'OPno': datas.Registration_Id.OPNo,
                    'PatientName': fullname,
                    'PatientId' : datas.Registration_Id.PatientId.PatientId if datas.Registration_Id.IsOriginal == True else datas.Registration_Id.PatientId.PatientNo,
                    'Sex': datas.Registration_Id.PatientId.Gender,
                    'Age': datas.Registration_Id.PatientId.Age,
                    'DeptName': datas.Specialization.Speciality_Name if datas.Specialization else None,
                    'Category' : datas.Registration_Id.PatientCategory,
                    'Insurance' : datas.Registration_Id.InsuranceName.Insurance_Name if datas.Registration_Id.InsuranceName else None
                }

                yield json.dumps(record)
            yield ']'

        return StreamingHttpResponse(generate_json(), content_type="application/json")

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MCI_Revisit_Patient_List(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')

        
        selected_genders = request.GET.getlist('selectedGenders[]') or []
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selectedCategories = request.GET.getlist('selectedCategories[]')
        selectedInsurance = request.GET.getlist('selectedInsurance[]')

        # Convert IDs to integers where applicable
        try:
            selected_specialities = list(map(int, selected_specialities))
        except ValueError:
            selected_specialities = []

        try:
            selectedInsurance = list(map(int, selectedInsurance))
        except ValueError:
            selectedInsurance = []

        # Date filtering
        if date_type == 'Current':
            date_filter = Q(Registration_Id__created_at__date=current_date)

        elif date_type == 'Particular':
            date_filter = Q(Registration_Id__created_at__date=ParticularDate)

        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base queryset with date and fixed filters
        newPatientins = (
            MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects
            .filter(
                date_filter,
                VisitType__in=['FollowUp No Fee','FollowUp With Fee','FollowUp'],
                Registration_Id__VisitPurpose='OP'
            )
            .select_related(
                'Registration_Id',
                'Registration_Id__PatientId',
                'Registration_Id__PatientId__Title',
                'Registration_Id__InsuranceName',
                'Specialization'
            )
            .order_by('-created_at')
        )

        print(len(newPatientins),'newPatientins')

        # Apply dynamic filters
        if selected_specialities:
            newPatientins = newPatientins.filter(Specialization__Speciality_Id__in=selected_specialities)

        if selectedCategories:
            newPatientins = newPatientins.filter(Registration_Id__PatientCategory__in=selectedCategories)

        if selectedInsurance:
            newPatientins = newPatientins.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)

        if selected_genders:
            newPatientins = newPatientins.filter(Registration_Id__PatientId__Gender__in=selected_genders)

        print(len(newPatientins),'FinalnewPatientins')

        # Generator for efficient memory usage
        def generate_json():
            yield '['
            first = True
            for datas in newPatientins:
                if not first:
                    yield ','
                first = False

                title = datas.Registration_Id.PatientId.Title.Title_Name if datas.Registration_Id.PatientId.Title else ''
                fname = datas.Registration_Id.PatientId.FirstName or ''
                mname = datas.Registration_Id.PatientId.MiddleName or ''
                lname = datas.Registration_Id.PatientId.SurName or ''
                fullname = f"{title}.{fname} {mname} {lname}".strip()

                record = {
                    'OPDate': datas.created_at.strftime("%d-%m-%y"),
                    'OPno': datas.Registration_Id.OPNo,
                    'PatientName': fullname,
                    'PatientId' : datas.Registration_Id.PatientId.PatientId if datas.Registration_Id.IsOriginal == True else datas.Registration_Id.PatientId.PatientNo,
                    'Sex': datas.Registration_Id.PatientId.Gender,
                    'Age': datas.Registration_Id.PatientId.Age,
                    'DeptName': datas.Specialization.Speciality_Name if datas.Specialization else None,
                    'Category' : datas.Registration_Id.PatientCategory,
                    'Insurance' : datas.Registration_Id.InsuranceName.Insurance_Name if datas.Registration_Id.InsuranceName else None
                }

                yield json.dumps(record)
            yield ']'

        return StreamingHttpResponse(generate_json(), content_type="application/json")

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MCI_Overall_Patient_List(request):
    try:
        # Step 1: Parse Filters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')

        current_date = datetime.now().date()

        selected_genders = request.GET.getlist('selectedGenders[]')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = [int(s) for s in request.GET.getlist('selectedInsurance[]')]

        # Step 2: Date Filter
        if date_type == 'Current':
            date_filter = Q(Registration_Id__created_at__date=current_date)

        elif date_type == 'Particular':
            date_filter = Q(Registration_Id__created_at__date=ParticularDate)

        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Step 3: Base QuerySet for both types
        base_qs = (
            MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects
            .filter(date_filter, Registration_Id__VisitPurpose='OP')
            .select_related(
                'Registration_Id',
                'Registration_Id__PatientId',
                'Registration_Id__PatientId__Title',
                'Specialization'
            )
            .order_by('-created_at')
        )

        # Step 4: Apply filters
        if selected_specialities:
            base_qs = base_qs.filter(Specialization__Speciality_Id__in=selected_specialities)
        if selected_categories:
            base_qs = base_qs.filter(Registration_Id__PatientCategory__in=selected_categories)
        if selected_insurance:
            base_qs = base_qs.filter(Registration_Id__InsuranceName__Insurance_Id__in=selected_insurance)
        if selected_genders:
            base_qs = base_qs.filter(Registration_Id__PatientId__Gender__in=selected_genders)

        # Step 5: Separate new and revisit lists
        new_patients = base_qs.filter(VisitType='NewConsultation')
        revisit_patients = base_qs.filter(VisitType__in=['FollowUp No Fee','FollowUp With Fee','FollowUp'])


        def serialize_patient(data):
            title = data.Registration_Id.PatientId.Title.Title_Name if data.Registration_Id.PatientId.Title else ''
            fname = data.Registration_Id.PatientId.FirstName or ''
            mname = data.Registration_Id.PatientId.MiddleName or ''
            lname = data.Registration_Id.PatientId.SurName or ''
            full_name = f"{title}.{fname} {mname} {lname}".strip()

            return {
                'OPDate': data.created_at.strftime("%d-%m-%y"),
                'OPno': data.Registration_Id.OPNo,
                'PatientName': full_name,
                'PatientId' : data.Registration_Id.PatientId.PatientId if data.Registration_Id.IsOriginal == True else data.Registration_Id.PatientId.PatientNo,
                'Sex': data.Registration_Id.PatientId.Gender,
                'Age': data.Registration_Id.PatientId.Age,
                'DeptName': data.Specialization.Speciality_Name if data.Specialization else None,
               'Category' : data.Registration_Id.PatientCategory,
                'Insurance' : data.Registration_Id.InsuranceName.Insurance_Name if data.Registration_Id.InsuranceName else None

            }

        # Serialize both groups
        new_list = [serialize_patient(data) for data in new_patients]
        revisit_list = [serialize_patient(data) for data in revisit_patients]

        return JsonResponse({
            'New': new_list,
            'Revisit': revisit_list
        }, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def MCI_Patient_IPAdmission_List(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')


        current_date = datetime.now().date()

        selected_genders = request.GET.getlist('selectedGenders[]') or []
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = request.GET.getlist('selectedInsurance[]')
        selected_ward = request.GET.getlist('SelectedWards[]')
        SelectedUsers = request.GET.getlist('SelectedUsers[]')

        # Convert string IDs to integers, handle invalid values
        try:
            selected_specialities = [int(x) for x in selected_specialities if x]
        except ValueError:
            selected_specialities = []

        try:
            selected_insurance = [int(x) for x in selected_insurance if x]
        except ValueError:
            selected_insurance = []

        try:
            selected_ward = [int(x) for x in selected_ward if x]
        except ValueError:
            selected_ward = []


        if date_type == 'Current':
            date_filter = Q(Status__in=['Admitted','Pending','Completed'], Booking_Status__in=['Occupied','Booked','Vacated'], created_at__date=current_date)
        
        elif date_type == 'Particular':
            date_filter = Q(Status__in=['Admitted','Pending','Completed'], Booking_Status__in=['Occupied','Booked','Vacated'], created_at__date=ParticularDate)

        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Status__in=['Admitted','Pending','Completed'], Booking_Status__in=['Occupied','Booked','Vacated'], created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Apply filters to query
        inpatient_query = MCI_Patient_IP_Registration_Detials.objects.filter(date_filter).select_related(
            'PatientId', 'PatientId__Title', 'Specialization'
        ).order_by('-created_at')

        # Apply ward filter if provided
        if selected_ward:
            wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                CurrentlyStayed=True
            ).values_list('IP_Registration_Id__IPNo', flat=True)


            inpatient_query = inpatient_query.filter(IPNo__in=list(wardwise_reg_ids))

        # Apply additional filters if provided
        if selected_genders:
            inpatient_query = inpatient_query.filter(PatientId__Gender__in=selected_genders)
        if selected_specialities:
            inpatient_query = inpatient_query.filter(Specialization__Speciality_Id__in=selected_specialities)
        if selected_insurance:
            inpatient_query = inpatient_query.filter(Insurance__Insurance_Id__in=selected_insurance) 
        if selected_categories:
            inpatient_query = inpatient_query.filter(PatientCategory__in=selected_categories)  

        if SelectedUsers:
            inpatient_query = inpatient_query.filter(created_by__in=SelectedUsers) 

        # Generator for streaming JSON response
        def generate_json():
            yield '['
            first = True
            for data in inpatient_query:
                if not first:
                    yield ','
                first = False

                title = data.PatientId.Title.Title_Name if data.PatientId.Title else ''
                fname = data.PatientId.FirstName or ''
                mname = data.PatientId.MiddleName or ''
                lname = data.PatientId.SurName or ''
                full_name = f"{title}. {fname} {mname} {lname}".strip()

                marital_status = data.PatientId.MaritalStatus
                gender = data.PatientId.Gender

                prefix = ''
                if marital_status in ['Single', 'Divorced'] and gender == 'Male':
                    prefix = f"S/O {data.PatientId.FatherName}"
                elif marital_status in ['Single', 'Divorced'] and gender == 'Female':
                    prefix = f"D/O {data.PatientId.FatherName}"
                elif marital_status in ['Married', 'Widowed'] and gender == 'Female':
                    prefix = f"W/O {data.PatientId.SpouseName}"
                elif marital_status in ['Married', 'Widowed'] and gender == 'Male':
                    prefix = f"H/O {data.PatientId.SpouseName}"

                # Construct address
                door_no = data.PatientId.PermanentdoorNo or ''
                street = data.PatientId.PermanentStreet or ''
                area = data.PatientId.PermanentArea or ''
                city = data.PatientId.PermanentCity or ''
                district = data.PatientId.PermanentDistrict or ''
                address = f"{door_no} {street} {area} {city} {district}".strip()

                # Get ward information
                ward_info = MCI_Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__IPNo = data.IPNo,
                    CurrentlyStayed=True
                ).last()

                record = {
                    'IPNo': data.IPNo,
                    'PatientId': data.PatientId.PatientId if data.IsOriginal == True else data.PatientId.PatientNo,
                    'PatientName': full_name,
                    'prefix': prefix,
                    'Address': address,
                    'Dept': data.Specialization.Speciality_Name if data.Specialization else None,
                    'gender': gender,
                    'Age': data.PatientId.Age,
                    'AdmissionDate': data.created_at.strftime("%d-%m-%y"),
                    'AdmissionTime': data.created_at.strftime("%I:%M %p"),
                    'WardName': getattr(
                            getattr(
                                getattr(
                                    getattr(ward_info, 'RoomId', None),
                                    'Ward_Name', None
                                ),
                                'Ward_Name', None
                            ),
                            'Ward_Name', None
                        ) if ward_info else None,

                    'Patientcategory' : data.PatientCategory,
                    'Createdby' : data.created_by,


                }

                yield json.dumps(record)
            yield ']'

        return StreamingHttpResponse(generate_json(), content_type="application/json")

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@require_http_methods(["GET"])
def get_radiology_reports(request):
    try:
        # --- Common query params ---
        DateType = request.GET.get("DateType")
        CurrentDate = request.GET.get("CurrentDate")
        FromDate = request.GET.get("FromDate")
        ToDate = request.GET.get("ToDate")
        Department = request.GET.get("Department")
        status = request.GET.get("status")
        RegisterType = request.GET.get("RegisterType")
        doctor_id = request.GET.get("doctor_id")
        mode = request.GET.get("mode", "list")  # default is patient list
 
        # --- Parse comma-separated values into lists ---
        department_list = Department.split(",") if Department else []
        status_list = status.split(",") if status else []
        register_type_list = RegisterType.split(",") if RegisterType else []
        doctor_id_list = doctor_id.split(",") if doctor_id else []
 
        # --- Date Filter ---
        date_filter = Q()
        if DateType and DateType.lower() == "current":
            if not CurrentDate:
                return JsonResponse({"error": "CurrentDate is required"}, status=400)
            date_filter = Q(created_at__date=CurrentDate)
        elif FromDate and ToDate:
            try:
                from_date = datetime.strptime(FromDate, "%Y-%m-%d").date()
                to_date = datetime.strptime(ToDate, "%Y-%m-%d").date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )
 
        # =====================================================
        # MODE 1: PATIENT TEST LIST (like Radiology_reports_for_original)
        # =====================================================
        if mode == "list":
            queryset = Radiology_Request_Details.objects.filter(date_filter)
 
            # Department filter: handle multiple departments
            if department_list:
                queryset = queryset.filter(TestCode__in=department_list)
 
            # Status filter: handle multiple statuses with Q objects
            if status_list:
                status_q = Q()
                for s in status_list:
                    if s == "Request":
                        status_q |= Q(Status="Request", Service_Status="Pending")
                    elif s == "Paid":
                        status_q |= Q(Status="Paid", Service_Status="Pending")
                    elif s == "Due":
                        status_q |= Q(Status="Due", Service_Status="Pending")
                    elif s == "Analyzed":
                        status_q |= Q(
                            Status__in=["Paid", "Due"], Service_Status="Analyzed"
                        )
                    elif s == "Completed":
                        status_q |= Q(
                            Status__in=["Paid", "Due"], Service_Status="Completed"
                        )
                queryset = queryset.filter(status_q)
 
            # RegisterType filter: handle multiple register types
            if register_type_list:
                queryset = queryset.filter(RegisterType__in=register_type_list)
 
            # Doctor filter: handle multiple doctors if doctor_id is provided
            if doctor_id_list:
                # Use string values directly - no conversion to integers
                queryset = queryset.filter(Doctorid__in=doctor_id_list)
 
            RadiologyList = []
            for datas in queryset:
                if datas.RegisterType in ["OP", "WALK-IN"]:
                    Registerid = datas.OP_Register_Id
                    Patient = Registerid.PatientId
                elif datas.RegisterType == "IP":
                    Registerid = datas.IP_Register_Id
                    Patient = Registerid.PatientId
                else:
                    continue
 
                full_name = f"{Patient.Title.Title_Name if Patient.Title else ''}. {Patient.FirstName or ''} {Patient.MiddleName or ''} {Patient.SurName or ''}".strip()
 
                doctor = datas.Doctorid
                Dfull_name = (
                    f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name} {doctor.Last_Name}".strip()
                    if doctor
                    else "Self"
                )
 
                radiologynameins = RadiologyNames_Details.objects.filter(
                    Radiology_Id=datas.TestCode
                ).first()
                testnameins = TestName_Details.objects.filter(
                    Test_Code=datas.SubTestCode
                ).first()
 
                RadiologyList.append(
                    {
                        "PatientId": Patient.PatientId,
                        "PatientName": full_name,
                        "RegisterType": datas.RegisterType,
                        "PhoneNumber": Patient.PhoneNo,
                        "doctor_name": Dfull_name,
                        "Deptname": (
                            radiologynameins.Radiology_Name if radiologynameins else ""
                        ),
                        "Testname": testnameins.Test_Name if testnameins else "",
                        "request_id": datas.Radiology_RequestId,
                        "Status": datas.Status,  # Added status field
                        "Service_Status": datas.Service_Status,  # Added service status field
                    }
                )
 
            for i, item in enumerate(RadiologyList, start=1):
                item["Sno"] = i
 
            return JsonResponse(
                {"RadiologyList": RadiologyList, "Totalcount": len(RadiologyList)},
                safe=False,
            )
 
        # =====================================================
        # MODE 2: DOCTOR WISE REPORT (like radiology_doctor_wise_report)
        # =====================================================
        elif mode == "doctor":
            if not doctor_id_list:
                return JsonResponse({"error": "Doctor ID is required"}, status=400)
 
            # Handle multiple doctors
            doctors = Doctor_Personal_Form_Detials.objects.filter(
                Doctor_ID__in=doctor_id_list
            )
            if not doctors:
                return JsonResponse({"error": "Doctors not found"}, status=404)
 
            # Start with base query
            reports_query = Radiology_Complete_Details.objects.all()
 
            # Apply date filter
            reports_query = reports_query.filter(date_filter)
 
            # Apply department filter if provided
            if department_list:
                reports_query = reports_query.filter(
                    Radiology_RequestId__TestCode__in=department_list
                )
 
            # Apply status filter if provided
            if status_list:
                status_q = Q()
                for s in status_list:
                    if s == "Request":
                        status_q |= Q(Status="Request")
                    elif s == "Paid":
                        status_q |= Q(Status="Paid")
                    elif s == "Due":
                        status_q |= Q(Status="Due")
                    elif s == "Analyzed":
                        status_q |= Q(Status__in=["Paid", "Due"])
                    elif s == "Completed":
                        status_q |= Q(Status__in=["Paid", "Due"])
                reports_query = reports_query.filter(status_q)
 
            # Apply register type filter if provided
            if register_type_list:
                reports_query = reports_query.filter(
                    Radiology_RequestId__RegisterType__in=register_type_list
                )
 
            # Apply doctor filter
            reports_query = reports_query.filter(doctorId__in=doctor_id_list)
 
            # Select related objects
            reports = reports_query.select_related("Radiology_RequestId", "department")
 
            report_list = []
            for report in reports:
                test_ins = TestName_Details.objects.filter(
                    Test_Code=report.Radiology_RequestId.SubTestCode
                ).first()
 
                patient_id = None
                if report.Radiology_RequestId.RegisterType.upper() == "OP":
                    patient_id = Patient_Appointment_Registration_Detials.objects.get(
                        Registration_Id=report.Radiology_RequestId.OP_Register_Id.Registration_Id
                    ).PatientId
                elif report.Radiology_RequestId.RegisterType.upper() == "IP":
                    patient_id = Patient_IP_Registration_Detials.objects.get(
                        Registration_Id=report.Radiology_RequestId.IP_Register_Id.Registration_Id
                    ).PatientId
                elif report.Radiology_RequestId.RegisterType.upper() == "CASUALITY":
                    patient_id = Patient_Casuality_Registration_Detials.objects.get(
                        Registration_Id=report.Radiology_RequestId.Casuality_Register_Id.Registration_Id
                    ).PatientId
                else:
                    patient_id = Radiology_Request_Details.objects.get(
                        Radiology_RequestId=report.Radiology_RequestId.Radiology_RequestId
                    ).Billing_Invoice_No.Patient_Id
 
                report_list.append(
                    {
                        "request_id": report.Radiology_RequestId.Radiology_RequestId,
                        "PatientId": patient_id.PatientId if patient_id else "",
                        "Testname": test_ins.Test_Name if test_ins else None,
                        "PhoneNumber": patient_id.PhoneNo if patient_id else "",
                        "doctor_id": report.doctorId,
                        "doctor_name": report.RadiologistName,
                        "RegisterType": report.Radiology_RequestId.RegisterType,
                        "PatientName": f"{patient_id.FirstName if patient_id else ' '} {patient_id.MiddleName if patient_id else ' '} {patient_id.SurName if patient_id else ' '}",
                        "Deptname": (
                            test_ins.Radiology_Id.Radiology_Name
                            if test_ins and test_ins.Radiology_Id
                            else ""
                        ),
                        "Status": report.Status,
                        "report_date": report.ReportDate,
                    }
                )
 
            # For multiple doctors, return a list of doctor details
            doctor_details_list = []
            for doc in doctors:
                doctor_details_list.append(
                    {
                        "doctor_id": doc.Doctor_ID,
                        "doctor_name": f"{doc.First_Name or ''} {doc.Middle_Name or ''} {doc.Last_Name or ''}".strip(),
                    }
                )
 
            return JsonResponse(
                {
                    "doctors": doctor_details_list,
                    "summary": {
                        "total_reports": len(report_list),
                        "completed": sum(
                            1 for r in report_list if r["Status"] == "Completed"
                        ),
                        "pending": sum(
                            1 for r in report_list if r["Status"] == "Pending"
                        ),
                    },
                    "reports": report_list,
                },
                safe=False,
            )
 
        # =====================================================
        # MODE 3: DEPARTMENT WISE REPORT (like get_radiology_deptwise_filter)
        # =====================================================
        elif mode == "deptwise":
            if not department_list:
                return JsonResponse({"error": "Department is required"}, status=400)
 
            # Apply additional filters to department-wise counts
            base_query = Radiology_Request_Details.objects.filter(date_filter)
 
            # Apply status filter if provided
            if status_list:
                status_q = Q()
                for s in status_list:
                    if s == "Request":
                        status_q |= Q(Status="Request", Service_Status="Pending")
                    elif s == "Paid":
                        status_q |= Q(Status="Paid", Service_Status="Pending")
                    elif s == "Due":
                        status_q |= Q(Status="Due", Service_Status="Pending")
                    elif s == "Analyzed":
                        status_q |= Q(
                            Status__in=["Paid", "Due"], Service_Status="Analyzed"
                        )
                    elif s == "Completed":
                        status_q |= Q(
                            Status__in=["Paid", "Due"], Service_Status="Completed"
                        )
                base_query = base_query.filter(status_q)
 
            # Apply register type filter if provided
            if register_type_list:
                base_query = base_query.filter(RegisterType__in=register_type_list)
 
            # Apply doctor filter if provided
            if doctor_id_list:
                base_query = base_query.filter(Doctorid__in=doctor_id_list)
 
            TestList = []
            # Handle multiple departments
            Testins = TestName_Details.objects.filter(
                Radiology_Id__Radiology_Id__in=department_list
            )
            for test in Testins:
                Takentest = base_query.filter(SubTestCode=test.Test_Code)
                if Takentest:
                    TestList.append(
                        {"Testname": test.Test_Name, "Testcount": Takentest.count()}
                    )
 
            # Total counts for multiple departments with all filters applied
            TotalOP = base_query.filter(
                Q(TestCode__in=department_list) & Q(RegisterType__in=["OP", "WALK-IN"])
            ).count()
 
            TotalIP = base_query.filter(
                Q(TestCode__in=department_list) & Q(RegisterType="IP")
            ).count()
 
            return JsonResponse(
                {"Countdetails": TestList, "TotalOP": TotalOP, "TotalIP": TotalIP},
                safe=False,
            )
 
        else:
            return JsonResponse(
                {"error": "Invalid mode. Use 'list', 'doctor', or 'deptwise'."},
                status=400,
            )
 
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from django.db.models import Q, Count, Case, When, IntegerField
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from datetime import datetime
import re
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_IP_Census_Patient_Combined_Reports(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')

        selected_genders = request.GET.getlist('selectedGenders[]')  # ['Male', 'Female', 'MaleChild', 'FemaleChild']
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]') if s.isdigit()]
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = [int(s) for s in request.GET.getlist('selectedInsurance[]') if s.isdigit()]
 
        # Date filtering
        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)

        elif date_type == 'Particular':
            date_filter = Q(created_at__date=ParticularDate)



        else:
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
        # Start with base queryset (only admitted patients)
        queryset = MCI_Patient_IP_Registration_Detials.objects.filter(
            date_filter,
            Status='Admitted'  # Only currently admitted
        ).select_related(
            'PatientId', 'Specialization', 'InsuranceName'
        ).only(
            'PatientId__Gender',
            'PatientId__Age',
            'Specialization__Speciality_Name',
            'PatientCategory',
            'InsuranceName__Insurance_Id'
        )
 
        # Apply filters efficiently at DB level where possible
        if selected_specialities:
            queryset = queryset.filter(Specialization__Speciality_Id__in=selected_specialities)
 
        if selected_categories:
            queryset = queryset.filter(PatientCategory__in=selected_categories)
 
        if selected_insurance:
            queryset = queryset.filter(InsuranceName__Insurance_Id__in=selected_insurance)
 
        # Helper: Extract numeric age from string like "26 Years", "5 y 3 m", "15", etc.
        def extract_age(age_field):
            if not age_field:
                return 0
            match = re.search(r'\d+', str(age_field))
            return int(match.group()) if match else 0
 
        # Final data aggregation
        new_patientlist = []
        for reg in queryset:
            patient = reg.PatientId
            age = extract_age(patient.Age)
            gender = patient.Gender  # 'Male' or 'Female'
 
            # Determine category based on gender + age
            is_male_adult = gender == 'Male' and age > 15
            is_female_adult = gender == 'Female' and age > 15
            is_male_child = gender == 'Male' and 0 <= age <= 15
            is_female_child = gender == 'Female' and 0 <= age <= 15
 
            # Check if this patient matches selected gender filters
            if selected_genders:
                if ('Male' in selected_genders and not is_male_adult) and \
                   ('Female' in selected_genders and not is_female_adult) and \
                   ('MaleChild' in selected_genders and not is_male_child) and \
                   ('FemaleChild' in selected_genders and not is_female_child):
                    continue  # Skip if no match
 
            datalist = {
                'Department': reg.Specialization.Speciality_Name if reg.Specialization else 'Unknown',
                'Male': 1 if is_male_adult else 0,
                'Female': 1 if is_female_adult else 0,
                'MCh': 1 if is_male_child else 0,
                'FCh': 1 if is_female_child else 0,
            }
            new_patientlist.append(datalist)
 
        response_data = {
            'New': new_patientlist,
            'Total': len(new_patientlist)
        }
 
        return JsonResponse(response_data, safe=False, status=200)
 
    except Exception as e:
        print(f"Error in IP_Census_Patient_Original_Reports: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_IP_Census_Patient_Combined_Reports_Completed(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')

        selected_genders = request.GET.getlist('selectedGenders[]')  # ['Male', 'Female', 'MaleChild', 'FemaleChild']
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]') if s.isdigit()]
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = [int(s) for s in request.GET.getlist('selectedInsurance[]') if s.isdigit()]
 
        # Date filtering
        if date_type == 'Current':
            
            date_filter = Q(
                Status__iexact="Completed",
                Booking_Status__iexact="Vacated",
                created_at__date=current_date
 
            ) & (
                Q(DischargeDate__date__gte=current_date) |
                Q(DischargeDate__isnull=True)
            )

        elif date_type == 'Particular':
            date_filter = Q(
                Status__iexact="Completed",
                Booking_Status__iexact="Vacated",
                created_at__date__lte=ParticularDate
 
            ) & (
                Q(DischargeDate__date__gte=ParticularDate) |
                Q(DischargeDate__isnull=True)
            )



        else:
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                
                date_filter = Q(
                    Status__iexact="Completed",
                    Booking_Status__iexact="Vacated",
                    created_at__date__lte=to_date,
                ) & (
                    Q(DischargeDate__date__gte=from_date)
                    | Q(DischargeDate__isnull=True)
                )
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
        # Start with base queryset (only admitted patients)
        queryset = MCI_Patient_IP_Registration_Detials.objects.filter(
            date_filter,
        ).select_related(
            'PatientId', 'Specialization', 'InsuranceName'
        ).only(
            'PatientId__Gender',
            'PatientId__Age',
            'Specialization__Speciality_Name',
            'PatientCategory',
            'InsuranceName__Insurance_Id'
        )
 
        # Apply filters efficiently at DB level where possible
        if selected_specialities:
            queryset = queryset.filter(Specialization__Speciality_Id__in=selected_specialities)
 
        if selected_categories:
            queryset = queryset.filter(PatientCategory__in=selected_categories)
 
        if selected_insurance:
            queryset = queryset.filter(InsuranceName__Insurance_Id__in=selected_insurance)
 
        # Helper: Extract numeric age from string like "26 Years", "5 y 3 m", "15", etc.
        def extract_age(age_field):
            if not age_field:
                return 0
            match = re.search(r'\d+', str(age_field))
            return int(match.group()) if match else 0
 
        # Final data aggregation
        new_patientlist = []
        for reg in queryset:
            patient = reg.PatientId
            age = extract_age(patient.Age)
            gender = patient.Gender  # 'Male' or 'Female'
 
            # Determine category based on gender + age
            is_male_adult = gender == 'Male' and age > 15
            is_female_adult = gender == 'Female' and age > 15
            is_male_child = gender == 'Male' and 0 <= age <= 15
            is_female_child = gender == 'Female' and 0 <= age <= 15
 
            # Check if this patient matches selected gender filters
            if selected_genders:
                if ('Male' in selected_genders and not is_male_adult) and \
                   ('Female' in selected_genders and not is_female_adult) and \
                   ('MaleChild' in selected_genders and not is_male_child) and \
                   ('FemaleChild' in selected_genders and not is_female_child):
                    continue  # Skip if no match
 
            datalist = {
                'Department': reg.Specialization.Speciality_Name if reg.Specialization else 'Unknown',
                'Male': 1 if is_male_adult else 0,
                'Female': 1 if is_female_adult else 0,
                'MCh': 1 if is_male_child else 0,
                'FCh': 1 if is_female_child else 0,
            }
            new_patientlist.append(datalist)
 
        response_data = {
            'New': new_patientlist,
            'Total': len(new_patientlist)
        }
 
        return JsonResponse(response_data, safe=False, status=200)
 
    except Exception as e:
        print(f"Error in IP_Census_Patient_Original_Reports: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)
 
        
    
    
@csrf_exempt
@require_http_methods(["GET"])
def MCI_IP_CENSUS_Discharge_Count_Reports(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')

        print(date_type,'date_type')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')

        current_date = datetime.now().date()
 
        selected_genders = request.GET.getlist('selectedGenders[]') or []
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = request.GET.getlist('selectedInsurance[]')
        selected_ward = request.GET.getlist('SelectedWards[]')
 
        # Convert to integers with error handling
        try:
            selected_specialities = [int(x) for x in selected_specialities if x]
        except ValueError:
            selected_specialities = []
 
        try:
            selected_insurance = [int(x) for x in selected_insurance if x]
        except ValueError:
            selected_insurance = []
 
        try:
            selected_ward = [int(x) for x in selected_ward if x]
        except ValueError:
            selected_ward = []
 
        # Date filtering
        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)

        elif date_type == 'Particular':

            print('insideeeeee')
            date_filter = Q(created_at__date=ParticularDate)

        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
        # Start with base discharge queryset
        Dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter).order_by('-created_at')
 
        # Apply ward filter if selected
        if selected_ward:
            wardwise_reg_ids = Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                # CurrentlyStayed=False
            ).values_list('IP_Registration_Id', flat=True)
            Dischargeins = Dischargeins.filter(Registration_Id__Registration_Id__in=list(wardwise_reg_ids))
 
        # Apply other filters
        if selected_genders:
            Dischargeins = Dischargeins.filter(Registration_Id__PatientId__Gender__in=selected_genders)
        if selected_specialities:
            Dischargeins = Dischargeins.filter(Registration_Id__Specialization__Speciality_Id__in=selected_specialities)
        if selected_insurance:
            Dischargeins = Dischargeins.filter(Registration_Id__Insurance__Insurance_Id__in=selected_insurance)  
        if selected_categories:
            Dischargeins = Dischargeins.filter(Registration_Id__Category__in=selected_categories)
 
        # Helper function to extract age
        def extract_age(age_field):
            if not age_field:
                return 0
            match = re.search(r'\d+', str(age_field))
            return int(match.group()) if match else 0
 
        # Department-wise aggregation
        department_data = {}
       
        for discharge in Dischargeins:
            patient = discharge.Registration_Id.PatientId
            department = discharge.Registration_Id.Specialization.Speciality_Name if discharge.Registration_Id.Specialization else 'Unknown'
            age = extract_age(patient.Age)
            gender = patient.Gender  # 'Male' or 'Female'
 
            # Determine category based on gender + age
            is_male_adult = gender == 'Male' and age > 15
            is_female_adult = gender == 'Female' and age > 15
            is_male_child = gender == 'Male' and 0 <= age <= 15
            is_female_child = gender == 'Female' and 0 <= age <= 15
 
            # Check if this patient matches selected gender filters
            if selected_genders:
                gender_match = False
                if 'Male' in selected_genders and is_male_adult:
                    gender_match = True
                if 'Female' in selected_genders and is_female_adult:
                    gender_match = True
                if 'MaleChild' in selected_genders and is_male_child:
                    gender_match = True
                if 'FemaleChild' in selected_genders and is_female_child:
                    gender_match = True
               
                if not gender_match:
                    continue  # Skip if no gender match
 
            # Initialize department entry if not exists
            if department not in department_data:
                department_data[department] = {
                    'Department': department,
                    'Male': 0,
                    'Female': 0,
                    'MCh': 0,
                    'FCh': 0
                }
 
            # Increment counters based on category
            if is_male_adult:
                department_data[department]['Male'] += 1
            elif is_female_adult:
                department_data[department]['Female'] += 1
            elif is_male_child:
                department_data[department]['MCh'] += 1
            elif is_female_child:
                department_data[department]['FCh'] += 1
 
        # Convert to list format like IP Census
        discharge_patientlist = list(department_data.values())
       
        # Calculate totals
        total_male = sum(dept['Male'] for dept in discharge_patientlist)
        total_female = sum(dept['Female'] for dept in discharge_patientlist)
        total_mch = sum(dept['MCh'] for dept in discharge_patientlist)
        total_fch = sum(dept['FCh'] for dept in discharge_patientlist)
        total_patients = total_male + total_female + total_mch + total_fch
 
        response_data = {
            'Discharge': discharge_patientlist,
            'Total': total_patients,
            'Summary': {
                'Male': total_male,
                'Female': total_female,
                'MCh': total_mch,
                'FCh': total_fch
            }
        }
 
        return JsonResponse(response_data, safe=False, status=200)
 
    except Exception as e:
        print(f"Error in IP_CENSUS_Discharge_Count_Reports: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
   
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_Discharge_Patient_List(request):
 
    try:
 
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')


        current_date = datetime.now().date()
 
        selected_genders = request.GET.getlist('selectedGenders[]') or []
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = request.GET.getlist('selectedInsurance[]')
        selected_ward = request.GET.getlist('SelectedWards[]')
 
        try:
            selected_specialities = [int(x) for x in selected_specialities if x]
        except ValueError:
            selected_specialities = []
 
        try:
            selected_insurance = [int(x) for x in selected_insurance if x]
        except ValueError:
            selected_insurance = []
 
        try:
            selected_ward = [int(x) for x in selected_ward if x]
        except ValueError:
            selected_ward = []
 
        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)

        elif date_type == 'Particular':
            date_filter = Q(created_at__date=ParticularDate)


        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
 
        Dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter).order_by('-created_at')
        DischargeList = []
 
        if selected_ward:
            wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                CurrentlyStayed=False
            ).values_list('IP_Registration_Id__IPNo', flat=True)
 
            print(len(wardwise_reg_ids),'wardwise_reg_idsssss')
            Dischargeins = Dischargeins.filter(Registration_Id__IPNo__in=list(wardwise_reg_ids))
 
        if selected_genders:
            Dischargeins = Dischargeins.filter(Registration_Id__PatientId__Gender__in=selected_genders)
        if selected_specialities:
            Dischargeins = Dischargeins.filter(Registration_Id__Specialization__Speciality_Id__in=selected_specialities)
        if selected_insurance:
            Dischargeins = Dischargeins.filter(Registration_Id__Insurance__Insurance_Id__in=selected_insurance)  
        if selected_categories:
            Dischargeins = Dischargeins.filter(Registration_Id__Category__in=selected_categories)
 
        for datas in Dischargeins:
            title = datas.Registration_Id.PatientId.Title.Title_Name if datas.Registration_Id.PatientId.Title else ''
            fname = datas.Registration_Id.PatientId.FirstName or ''
            mname = datas.Registration_Id.PatientId.MiddleName or ''
            lname = datas.Registration_Id.PatientId.SurName or ''
            full_name = f"{title}. {fname} {mname} {lname}".strip()
 
            ward_info = MCI_Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__IPNo=datas.Registration_Id.IPNo,
                    CurrentlyStayed=False
                ).last()
 
            # Calculate number of days between admission and discharge
            admission_date = datas.Registration_Id.created_at.date()
            discharge_date = datas.created_at.date()
            no_of_days = (discharge_date - admission_date).days
           
            # If discharge happens on the same day, show 1 day instead of 0
            if no_of_days == 0:
                no_of_days = 1
 
            datalist = {
                'IPNo': datas.Registration_Id.IPNo,
                'PatientId': datas.Registration_Id.PatientId.PatientId if datas.Registration_Id.IsOriginal == True else datas.Registration_Id.PatientId.PatientNo,
                'PatientName': full_name,
                'Dept': datas.Registration_Id.Specialization.Speciality_Name if datas.Registration_Id.Specialization else None,
                'Age': datas.Registration_Id.PatientId.Age,
                'Gender': datas.Registration_Id.PatientId.Gender,
                'AdmissionDate': datas.Registration_Id.created_at.strftime("%d-%m-%y"),
                'WardName': getattr(
                                            getattr(
                                                getattr(
                                                    getattr(ward_info, 'RoomId', None),
                                                    'Ward_Name', None
                                                ),
                                                'Ward_Name', None
                                            ),
                                            'Ward_Name', None
                                        ) if ward_info else None,                'Discharge_Date': datas.created_at.strftime("%d-%m-%y"),
                'Discharge_Time': datas.created_at.strftime("%I:%M %p"),
                'Dischargedby': datas.created_by,
                'NoOfDays': no_of_days,  # Added No of Days field
            }
            DischargeList.append(datalist)
        return JsonResponse(DischargeList, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def MRD_patient_Wise_Diagnosis_Link(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')

        try:
            selected_specialities = [int(s) for s in selected_specialities if s.isdigit()]
        except ValueError:
            selected_specialities = []



        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter)

        if selected_specialities:
            dischargeins = dischargeins.filter(
                Registration_Id__Specialization__Speciality_Id__in=selected_specialities
            )

        PatientList = []

        for dis in dischargeins:
            DiagnosisList = []
            diagnosis_qs = MRD_IP_Patient_Diagnosis_Data.objects.filter(
                Register_Id__IPNo=dis.Registration_Id.IPNo,Status = 'Added'
            )

            for dias in diagnosis_qs:
                DiagnosisList.append({
                    'ICDCode': dias.ICDCode,
                    'Code_Description': dias.Code_Description,
                    'Diagnosis': dias.Diagnosis,
                })

            patient = dis.Registration_Id.PatientId
            patient_name = " ".join(filter(None, [
                getattr(patient, 'FirstName', '') if patient else '',
                getattr(patient, 'MiddleName', '') if patient else '',
                getattr(patient, 'SurName', '') if patient else '',
            ])).strip()

            patlist = {
                'PatientId': patient.PatientId if dis.Registration_Id.IsOriginal == True else patient.PatientNo,
                'PatientName': patient_name or None,
                'Age': getattr(patient, 'Age', None),
                'Gender': getattr(patient, 'Gender', None),
                'Speciality': getattr(dis.Registration_Id.Specialization, 'Speciality_Name', None) if dis.Registration_Id.Specialization else None,
                'DischargeDate': dis.created_at.strftime('%d-%m-%y') if dis.created_at else None,
                'AdmissionDate': dis.Registration_Id.created_at.strftime('%d-%m-%y') if dis.Registration_Id.created_at else None,
                'Medicalrecords': DiagnosisList
            }
            PatientList.append(patlist)

        return JsonResponse(PatientList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in Original_patient_Wise_Diagnosis_Link: {error_msg}")
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MRD_Code_Wise_Diagnosis_Link(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selectedStockIds = request.GET.getlist('selectedStockIds[]')

        print(selectedStockIds,'selectedStockIds')

        try:
            selected_specialities = [int(s) for s in selected_specialities if s.isdigit()]
        except ValueError:
            selected_specialities = []



        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter).values_list('Registration_Id')

        diagnosis_qs = MRD_IP_Patient_Diagnosis_Data.objects.filter(
                Register_Id__pk__in = dischargeins,Status = 'Added'
            )
        
        if selectedStockIds:

            diagnosis_qs = diagnosis_qs.filter(ICDCode__in = selectedStockIds)

        PatientList = []

        for dis in diagnosis_qs:

            patient = dis.Patient_Id
            patient_name = " ".join(filter(None, [
                getattr(patient, 'FirstName', '') if patient else '',
                getattr(patient, 'MiddleName', '') if patient else '',
                getattr(patient, 'SurName', '') if patient else '',
            ])).strip()
            
            disdata = MCI_Patient_Discharge_Detials.objects.filter(Registration_Id__IPNo =dis.Register_Id.IPNo).first()

            patlist = {

                'PatientId': patient.PatientId if dis.Register_Id.IsOriginal == True else patient.PatientNo,
                'PatientName': patient_name or None,
                'Age': getattr(patient, 'Age', None),
                'Gender': getattr(patient, 'Gender', None),
                'Speciality': getattr(dis.Register_Id.Specialization, 'Speciality_Name', None) if dis.Register_Id.Specialization else None,
                'DischargeDate': disdata.created_at.strftime('%d-%m-%y') if disdata.created_at else None,
                'AdmissionDate': dis.Register_Id.created_at.strftime('%d-%m-%y') if dis.Register_Id.created_at else None,
                'ICDCode': dis.ICDCode,
                'Code_Description': dis.Code_Description,
                'Diagnosis': dis.Diagnosis

            }
            PatientList.append(patlist)

        return JsonResponse(PatientList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in Original_patient_Wise_Diagnosis_Link: {error_msg}")
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MRD_Diagnosis_Wise_Diagnosis_Link(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selectedDiagnosisIds = request.GET.getlist('selectedDiagnosisIds[]')


        try:
            selected_specialities = [int(s) for s in selected_specialities if s.isdigit()]
        except ValueError:
            selected_specialities = []



        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)



        dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter).values_list('Registration_Id')

        diagnosis_qs = MRD_IP_Patient_Diagnosis_Data.objects.filter(
                Register_Id__pk__in = dischargeins,Status = 'Added'
            )
        
        if selectedDiagnosisIds:

            diagnosis_qs = diagnosis_qs.filter(Code_Description__in = selectedDiagnosisIds)

        PatientList = []

        for dis in diagnosis_qs:

            patient = dis.Patient_Id
            patient_name = " ".join(filter(None, [
                getattr(patient, 'FirstName', '') if patient else '',
                getattr(patient, 'MiddleName', '') if patient else '',
                getattr(patient, 'SurName', '') if patient else '',
            ])).strip()
            
            disdata = MCI_Patient_Discharge_Detials.objects.filter(Registration_Id__IPNo =dis.Register_Id.IPNo).first()

            patlist = {

                'PatientId': patient.PatientId if dis.Register_Id.IsOriginal == True else patient.PatientNo,
                'PatientName': patient_name or None,
                'Age': getattr(patient, 'Age', None),
                'Gender': getattr(patient, 'Gender', None),
                'Speciality': getattr(dis.Register_Id.Specialization, 'Speciality_Name', None) if dis.Register_Id.Specialization else None,
                'DischargeDate': disdata.created_at.strftime('%d-%m-%y') if disdata.created_at else None,
                'AdmissionDate': dis.Register_Id.created_at.strftime('%d-%m-%y') if dis.Register_Id.created_at else None,
                'ICDCode': dis.ICDCode,
                'Code_Description': dis.Code_Description,
                'Diagnosis': dis.Diagnosis

            }
            PatientList.append(patlist)

        return JsonResponse(PatientList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in Original_patient_Wise_Diagnosis_Link: {error_msg}")
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)



# @csrf_exempt
# @require_http_methods(["GET"])
# def CT_Original_Reports(request):

#     try:


#         date_type = request.GET.get('searchOptions[DateType]', 'Current')
#         current_date = datetime.now().date()
#         from_date_str = request.GET.get('searchOptions[FromDate]')
#         to_date_str = request.GET.get('searchOptions[ToDate]')
#         ParticularDate = request.GET.get('searchOptions[ParticularDate]')
#         SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')


#         if date_type == 'Current':
#             date_filter = Q(created_at__date=current_date)
#         elif date_type == 'Particular':
#             if not ParticularDate:
#                 return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
#             try:
#                 particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
#                 date_filter = Q(created_at__date=particular_date)  
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
#         else:  
#             if not from_date_str or not to_date_str:
#                 return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
#             try:
#                 from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
#                 to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
#                 date_filter = Q(created_at__date__range=[from_date, to_date])
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

#         try:
#             SelectedSpecialityIds = [int(x) for x in SelectedSpecialityIds if x]
#         except ValueError:
#             SelectedSpecialityIds = []

#         testins = Radiology_Request_Details.objects.exclude(Status = 'Canceled').filter(date_filter,TestCode=1)

#         if SelectedSpecialityIds:

#             for t in testins:

#                 if t.RegisterType == 'OP' or t.RegisterType == 'WALKIN':

#                     opins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id__pk = t.OP_Register_Id_id,Specialization__Speciality_Id__in = SelectedSpecialityIds).first()

#                 elif t.RegisterType == 'IP':

#                     ipins = Patient_IP_Registration_Detials.objects.filter(Specialization__Speciality_Id__in = SelectedSpecialityIds)

#             testins = testins.filter()



#         TestList = []

#         for test in testins:

#             radins = TestName_Details.objects.filter(Test_Code = test.SubTestCode).first()

#             datalist = {
#                 'Dept' : 'CT',
#                 'Test_Name' : radins.Test_Name,
#                 'RegisterType' : test.RegisterType

#             }
#             TestList.append(datalist)

#         return JsonResponse(TestList,safe=False)



#     except Exception as e:
#         error_msg = str(e)
#         print(f"Error in Original_patient_Wise_Diagnosis_Link: {error_msg}")
#         return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


def get_patient_name(radiology_request):
    """Get patient name based on registration type"""
    try:
        if radiology_request.RegisterType in ['OP', 'WALK-IN'] and radiology_request.OP_Register_Id:
            # Assuming OP_Register_Id has PatientId relation
            patient = radiology_request.OP_Register_Id.PatientId

            print(patient,'patient opppppppp crttyrftt')
            return f"{patient.FirstName or ''} {patient.SurName or ''}".strip()
        
        elif radiology_request.RegisterType == 'IP' and radiology_request.IP_Register_Id:
            patient = radiology_request.IP_Register_Id.PatientId
            return f"{patient.FirstName or ''} {patient.SurName or ''}".strip()
        
        # Add other registration types as needed
        
        return 'N/A'
    except AttributeError:
        # Handle cases where relations don't exist or are None
        return 'N/A'


@csrf_exempt
@require_http_methods(["GET"])
def CT_Original_Reports(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset
        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]

        testins = Radiology_Request_Details.objects.exclude(
            Status='Canceled'
        ).exclude(
            SubTestCode__in=exclude_codes
        ).filter(
            date_filter, TestCode=1
        )

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def CT_Dummy_Reports(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset
        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=1)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


# @csrf_exempt
# @require_http_methods(["GET"])
# def CT_Dummy_Reports(request):

#     try:


#         date_type = request.GET.get('searchOptions[DateType]', 'Current')
#         current_date = datetime.now().date()
#         from_date_str = request.GET.get('searchOptions[FromDate]')
#         to_date_str = request.GET.get('searchOptions[ToDate]')
#         ParticularDate = request.GET.get('searchOptions[ParticularDate]')


#         if date_type == 'Current':
#             date_filter = Q(created_at__date=current_date)
#         elif date_type == 'Particular':
#             if not ParticularDate:
#                 return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
#             try:
#                 particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
#                 date_filter = Q(created_at__date=particular_date)  
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
#         else:  
#             if not from_date_str or not to_date_str:
#                 return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
#             try:
#                 from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
#                 to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
#                 date_filter = Q(created_at__date__range=[from_date, to_date])
#             except ValueError:
#                 return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)


#         testins = MCI_Radiology_Request_Details.objects.exclude(Status = 'Canceled').filter(date_filter,TestCode=1)
#         TestList = []

#         for test in testins:

#             radins = TestName_Details.objects.filter(Test_Code = test.SubTestCode).first()

#             datalist = {
#                 'Dept' : 'CT',
#                 'Test_Name' : radins.Test_Name,
#                 'RegisterType' : test.RegisterType

#             }
#             TestList.append(datalist)

#         return JsonResponse(TestList,safe=False)




#     except Exception as e:
#         error_msg = str(e)
#         print(f"Error in Original_patient_Wise_Diagnosis_Link: {error_msg}")
#         return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def MRI_Original_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=2)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MRI_Dummy_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset
        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=2)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def XRAY_Original_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=3)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def XRAY_Dummy_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=3)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def USG_Original_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=4)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def USG_Dummy_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=4)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def MAMMOGRAM_Original_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=5)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def MAMMOGRAM_Dummy_Reports(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter, TestCode=5)

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': 'CT',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def Dummy_OP_Wise_Radiology_Test(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter,RegisterType = 'OP')

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': radins.Radiology_Id.Radiology_Name if radins else 'N/A',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Original_OP_Wise_Radiology_Test(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter,RegisterType = 'OP')

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': radins.Radiology_Id.Radiology_Name if radins else 'N/A',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Dummy_IP_Wise_Radiology_Test(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter,RegisterType = 'IP')

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__MCI_appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': radins.Radiology_Id.Radiology_Name if radins else 'N/A',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Original_IP_Wise_Radiology_Test(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset

        exclude_codes = [
            'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
            'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
            'TSTCODE0032', 'TSTCODE0076'
        ]
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(
            SubTestCode__in=exclude_codes
        ).filter(date_filter,RegisterType = 'IP')

        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALKIN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALKIN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': radins.Radiology_Id.Radiology_Name if radins else 'N/A',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

  

@csrf_exempt
@require_http_methods(["GET"])
def Critical_Original_OP_Wise_Radiology_Test(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').filter(date_filter,RegisterType = 'OP',IsCritical=True)
        # testins = Radiology_Request_Details.objects.exclude(Status='Canceled').filter(date_filter,RegisterType = 'OP')
        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALK-IN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALK-IN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': radins.Radiology_Id.Radiology_Name if radins else 'N/A',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                # 'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'RequestDate' :test.CriticalIntimateDate.strftime('%d-%m-%Y') if test.CriticalIntimateDate else None
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def Critical_Original_IP_Wise_Radiology_Test(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        SelectedSpecialityIds = request.GET.getlist('SelectedSpecialityIds[]')

        if date_type == 'Current':
            date_filter = Q(created_at__date=current_date)
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate is required when DateType is Particular'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                date_filter = Q(created_at__date=particular_date)  
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Handle SelectedSpecialityIds - ensure it's always a list
        valid_speciality_ids = []
        if SelectedSpecialityIds:
            try:
                # Filter out empty strings and convert to integers
                valid_speciality_ids = [int(x) for x in SelectedSpecialityIds if x and x.strip()]
            except ValueError:
                # If conversion fails, return empty list
                valid_speciality_ids = []

        # Base queryset
        testins = Radiology_Request_Details.objects.exclude(Status='Canceled').filter(date_filter,RegisterType = 'OP',IsCritical=True)
        # testins = Radiology_Request_Details.objects.exclude(Status='Canceled').filter(date_filter,RegisterType = 'IP')
        # Filter by speciality if we have valid speciality IDs
        if valid_speciality_ids:
            # Create Q objects for different registration types
            speciality_q_objects = Q()
            
            # For OP/WALKIN registration types - check MCI_OP_Patient_Appointment_With_Multiple_Doctor
            # Note: Changed from '__in' to proper filter syntax
            op_q = Q(RegisterType__in=['OP', 'WALK-IN']) & Q(
                OP_Register_Id__appointment_doctor_specialties__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # For IP registration type - check Patient_IP_Registration_Detials
            ip_q = Q(RegisterType='IP') & Q(
                IP_Register_Id__Specialization__Speciality_Id__in=valid_speciality_ids
            )
            
            # Combine the Q objects
            speciality_q_objects = op_q | ip_q
            
            # Apply the filter
            testins = testins.filter(speciality_q_objects).distinct()

        TestList = []

        for test in testins:
            radins = TestName_Details.objects.filter(Test_Code=test.SubTestCode).first()
            
            # Get speciality information based on register type
            speciality_name = None
            if test.RegisterType in ['OP', 'WALK-IN'] and test.OP_Register_Id:
                # Get the first appointment with multiple doctors
                # Check if we have speciality filter
                filter_kwargs = {'Registration_Id': test.OP_Register_Id}
                if valid_speciality_ids:
                    filter_kwargs['Specialization__Speciality_Id__in'] = valid_speciality_ids
                
                op_appointment = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    **filter_kwargs
                ).first()
                
                if op_appointment and op_appointment.Specialization:
                    speciality_name = op_appointment.Specialization.Speciality_Name
            
            elif test.RegisterType == 'IP' and test.IP_Register_Id:
                if test.IP_Register_Id.Specialization:
                    speciality_name = test.IP_Register_Id.Specialization.Speciality_Name
            
            # Get patient name
            patient_name = get_patient_name(test)
            
            datalist = {
                'Dept': radins.Radiology_Id.Radiology_Name if radins else 'N/A',
                'Test_Name': radins.Test_Name if radins else 'N/A',
                'RegisterType': test.RegisterType,
                'Speciality': speciality_name,
                'RequestId': test.Radiology_RequestId,
                'PatientName': patient_name,
                # 'RequestDate': test.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'RequestDate' :test.CriticalIntimateDate.strftime('%d-%m-%Y') if test.CriticalIntimateDate else None
            }
            TestList.append(datalist)

        return JsonResponse(TestList, safe=False)

    except Exception as e:
        error_msg = str(e)
        print(f"Error in CT_Dummy_Reports: {error_msg}")
        # Add traceback for better debugging
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': error_msg}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def MCI_InPatient_List(request):
    try:
        date_type = request.GET.get("searchOptions[DateType]", "Current")
        from_date = request.GET.get("searchOptions[FromDate]")
        to_date = request.GET.get("searchOptions[ToDate]")
        ParticularDate = request.GET.get("searchOptions[ParticularDate]")
 
        current_date = datetime.now().date()
 
        selected_genders = request.GET.getlist("selectedGenders[]") or []
        selected_specialities = request.GET.getlist("SelectedSpecialityIds[]")
        selected_categories = request.GET.getlist("selectedCategories[]")
        selected_insurance = request.GET.getlist("selectedInsurance[]")
        selected_ward = request.GET.getlist("SelectedWards[]")
        # SelectedUsers = request.GET.getlist('SelectedUsers[]')
        # Convert string IDs to integers, handle invalid values
        try:
            selected_specialities = [int(x) for x in selected_specialities if x]
        except ValueError:
            selected_specialities = []
 
        try:
            selected_insurance = [int(x) for x in selected_insurance if x]
        except ValueError:
            selected_insurance = []
 
        try:
            selected_ward = [int(x) for x in selected_ward if x]
        except ValueError:
            selected_ward = []
 
        if date_type == "Current":
            date_filter = Q(
                Status__in=["Admitted", "Pending"],
                Booking_Status__in=["Occupied", "Booked"],
                created_at__date__lte=current_date,
            )
        elif date_type == "Particular":
            date_filter = Q(
                Status__in=["Admitted", "Pending"],
                Booking_Status__in=["Occupied", "Booked"],
                created_at__date__lte=ParticularDate,
            )
 
        else:
            try:
                from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
                date_filter = Q(
                    Status__in=["Admitted", "Pending"],
                    Booking_Status__in=["Occupied", "Booked"],
                    created_at__date__range=(from_date, to_date),
                )
 
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )
 
        inpatient_query = (
            MCI_Patient_IP_Registration_Detials.objects.filter(date_filter)
            .select_related("PatientId", "PatientId__Title", "Specialization")
            .order_by("-created_at")
        )
 
        if selected_ward:
            wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                CurrentlyStayed=True,
            ).values_list("IP_Registration_Id__IPNo", flat=True)
 
            inpatient_query = inpatient_query.filter(IPNo__in=list(wardwise_reg_ids))
 
        if selected_genders:
            inpatient_query = inpatient_query.filter(
                PatientId__Gender__in=selected_genders
            )
        if selected_specialities:
            inpatient_query = inpatient_query.filter(
                Specialization__Speciality_Id__in=selected_specialities
            )
        if selected_insurance:
            inpatient_query = inpatient_query.filter(
                Insurance__Insurance_Id__in=selected_insurance
            )  # Adjust field name as per your model
        if selected_categories:
            inpatient_query = inpatient_query.filter(
                PatientCategory__in=selected_categories
            )  # Adjust field name as per your model
 
        # if SelectedUsers:
        #     inpatient_query = inpatient_query.filter(created_by__in=SelectedUsers)  # Adjust field name as per your model
 
        def generate_json():
            yield "["
            first = True
            for data in inpatient_query:
                if not first:
                    yield ","
                first = False
 
                title = data.PatientId.Title.Title_Name if data.PatientId.Title else ""
                fname = data.PatientId.FirstName or ""
                mname = data.PatientId.MiddleName or ""
                lname = data.PatientId.SurName or ""
                full_name = f"{title}. {fname} {mname} {lname}".strip()
 
                marital_status = data.PatientId.MaritalStatus
                gender = data.PatientId.Gender
 
                prefix = ""
                if marital_status in ["Single", "Divorced"] and gender == "Male":
                    prefix = f"S/O {data.PatientId.FatherName}"
                elif marital_status in ["Single", "Divorced"] and gender == "Female":
                    prefix = f"D/O {data.PatientId.FatherName}"
                elif marital_status in ["Married", "Widowed"] and gender == "Female":
                    prefix = f"W/O {data.PatientId.SpouseName}"
                elif marital_status in ["Married", "Widowed"] and gender == "Male":
                    prefix = f"H/O {data.PatientId.SpouseName}"
 
                # Construct address
                door_no = data.PatientId.PermanentdoorNo or ""
                street = data.PatientId.PermanentStreet or ""
                area = data.PatientId.PermanentArea or ""
                city = data.PatientId.PermanentCity or ""
                district = data.PatientId.PermanentDistrict or ""
                address = f"{door_no} {street} {area} {city} {district}".strip()
 
                # Get ward information
                ward_info = MCI_Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__IPNo=data.IPNo,
                    # CurrentlyStayed=True
                ).last()
 
                record = {
                    "IPNo": data.IPNo,
                    "PatientId": (
                        data.PatientId.PatientId
                        if data.IsOriginal == True
                        else data.PatientId.PatientNo
                    ),
                    "PatientName": full_name,
                    "prefix": prefix,
                    "Address": address,
                    "Dept": (
                        data.Specialization.Speciality_Name
                        if data.Specialization
                        else None
                    ),
                    "gender": gender,
                    "Age": data.PatientId.Age,
                    "AdmissionDate": data.created_at.strftime("%d-%m-%y"),
                    "AdmissionTime": data.created_at.strftime("%I:%M %p"),
                    "WardName": (
                        getattr(
                            getattr(
                                getattr(
                                    getattr(ward_info, "RoomId", None),
                                    "Ward_Name",
                                    None,
                                ),
                                "Ward_Name",
                                None,
                            ),
                            "Ward_Name",
                            None,
                        )
                        if ward_info
                        else None
                    ),
                    "Createdby": data.created_by,
                    # 'Floor' : ward_info.RoomId.Floor_Name.Floor_Name if ward_info else None,
                    # 'Bedno' : ward_info.RoomId.Bed_No if ward_info else None,
                    "Patientcategory": data.PatientCategory,
                }
 
                yield json.dumps(record)
            yield "]"
 
        return StreamingHttpResponse(generate_json(), content_type="application/json")
 
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_prevInPatient_List(request):
    try:
        date_type = request.GET.get("searchOptions[DateType]", "Current")
        from_date = request.GET.get("searchOptions[FromDate]")
        to_date = request.GET.get("searchOptions[ToDate]")
        ParticularDate = request.GET.get("searchOptions[ParticularDate]")
 
        current_date = datetime.now().date()
 
        selected_genders = request.GET.getlist("selectedGenders[]") or []
        selected_specialities = request.GET.getlist("SelectedSpecialityIds[]")
        selected_categories = request.GET.getlist("selectedCategories[]")
        selected_insurance = request.GET.getlist("selectedInsurance[]")
        selected_ward = request.GET.getlist("SelectedWards[]")
        # SelectedUsers = request.GET.getlist('SelectedUsers[]')
        # Convert string IDs to integers, handle invalid values
        try:
            selected_specialities = [int(x) for x in selected_specialities if x]
        except ValueError:
            selected_specialities = []
 
        try:
            selected_insurance = [int(x) for x in selected_insurance if x]
        except ValueError:
            selected_insurance = []
 
        try:
            selected_ward = [int(x) for x in selected_ward if x]
        except ValueError:
            selected_ward = []
 
       
           
        if date_type == "Current":
 
            dis_filter = Q(
                Status__iexact="Completed",
                Booking_Status__iexact="Vacated",
                created_at__date=current_date
 
            ) & (
                Q(DischargeDate__date__gte=current_date) |
                Q(DischargeDate__isnull=True)
            )
           
           
        elif date_type == "Particular":
            dis_filter = Q(
                Status__iexact="Completed",
                Booking_Status__iexact="Vacated",
                created_at__date__lte=ParticularDate
 
            ) & (
                Q(DischargeDate__date__gte=ParticularDate) |
                Q(DischargeDate__isnull=True)
            )
 
        else:
            try:
                from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
                to_date = datetime.strptime(to_date, "%Y-%m-%d").date()
                # dis_filter = Q(Status__in=['Completed'], Booking_Status__in=['Vacated'],created_at__date__lte = from_date,DischargeDate__date__lte=to_date)
 
                dis_filter = Q(
                    Status__iexact="Completed",
                    Booking_Status__iexact="Vacated",
                    created_at__date__lte=to_date,
                ) & (
                    Q(DischargeDate__date__gte=from_date)
                    | Q(DischargeDate__isnull=True)
                )
            except (ValueError, TypeError):
                return JsonResponse(
                    {"error": "Invalid date format. Use YYYY-MM-DD."}, status=400
                )
 
        inpatient_query = (
            MCI_Patient_IP_Registration_Detials.objects.filter(dis_filter)
            .select_related("PatientId", "PatientId__Title", "Specialization")
            .order_by("-created_at")
        )
 
        if selected_ward:
            wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                CurrentlyStayed=True,
            ).values_list("IP_Registration_Id__IPNo", flat=True)
 
            inpatient_query = inpatient_query.filter(IPNo__in=list(wardwise_reg_ids))
 
        if selected_genders:
            inpatient_query = inpatient_query.filter(
                PatientId__Gender__in=selected_genders
            )
        if selected_specialities:
            inpatient_query = inpatient_query.filter(
                Specialization__Speciality_Id__in=selected_specialities
            )
        if selected_insurance:
            inpatient_query = inpatient_query.filter(
                Insurance__Insurance_Id__in=selected_insurance
            )  # Adjust field name as per your model
        if selected_categories:
            inpatient_query = inpatient_query.filter(
                PatientCategory__in=selected_categories
            )  # Adjust field name as per your model
 
        # if SelectedUsers:
        #     inpatient_query = inpatient_query.filter(created_by__in=SelectedUsers)  # Adjust field name as per your model
 
        def generate_json():
            yield "["
            first = True
            for data in inpatient_query:
                if not first:
                    yield ","
                first = False
 
                title = data.PatientId.Title.Title_Name if data.PatientId.Title else ""
                fname = data.PatientId.FirstName or ""
                mname = data.PatientId.MiddleName or ""
                lname = data.PatientId.SurName or ""
                full_name = f"{title}. {fname} {mname} {lname}".strip()
 
                marital_status = data.PatientId.MaritalStatus
                gender = data.PatientId.Gender
 
                prefix = ""
                if marital_status in ["Single", "Divorced"] and gender == "Male":
                    prefix = f"S/O {data.PatientId.FatherName}"
                elif marital_status in ["Single", "Divorced"] and gender == "Female":
                    prefix = f"D/O {data.PatientId.FatherName}"
                elif marital_status in ["Married", "Widowed"] and gender == "Female":
                    prefix = f"W/O {data.PatientId.SpouseName}"
                elif marital_status in ["Married", "Widowed"] and gender == "Male":
                    prefix = f"H/O {data.PatientId.SpouseName}"
 
                # Construct address
                door_no = data.PatientId.PermanentdoorNo or ""
                street = data.PatientId.PermanentStreet or ""
                area = data.PatientId.PermanentArea or ""
                city = data.PatientId.PermanentCity or ""
                district = data.PatientId.PermanentDistrict or ""
                address = f"{door_no} {street} {area} {city} {district}".strip()
 
                # Get ward information
                ward_info = MCI_Patient_Admission_Room_Detials.objects.filter(
                    IP_Registration_Id__IPNo=data.IPNo,
                    # CurrentlyStayed=True
                ).last()
 
                record = {
                    "IPNo": data.IPNo,
                    "PatientId": (
                        data.PatientId.PatientId
                        if data.IsOriginal == True
                        else data.PatientId.PatientNo
                    ),
                    "PatientName": full_name,
                    "prefix": prefix,
                    "Address": address,
                    "Dept": (
                        data.Specialization.Speciality_Name
                        if data.Specialization
                        else None
                    ),
                    "gender": gender,
                    "Age": data.PatientId.Age,
                    "AdmissionDate": data.created_at.strftime("%d-%m-%y"),
                    "DischargeDate": (
                        data.DischargeDate.strftime("%d-%m-%y")
                        if data.DischargeDate
                        else None
                    ),
                    "AdmissionTime": data.created_at.strftime("%I:%M %p"),
                    "WardName": (
                        getattr(
                            getattr(
                                getattr(
                                    getattr(ward_info, "RoomId", None),
                                    "Ward_Name",
                                    None,
                                ),
                                "Ward_Name",
                                None,
                            ),
                            "Ward_Name",
                            None,
                        )
                        if ward_info
                        else None
                    ),
                    "Createdby": data.created_by,
                    # 'Floor' : ward_info.RoomId.Floor_Name.Floor_Name if ward_info else None,
                    # 'Bedno' : ward_info.RoomId.Bed_No if ward_info else None,
                    "Patientcategory": data.PatientCategory,
                }
 
                yield json.dumps(record)
            yield "]"
 
        return StreamingHttpResponse(generate_json(), content_type="application/json")
 
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
 
 
 


