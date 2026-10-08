from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Count, Case, When, IntegerField, Q
from datetime import datetime, date
import json

import json
from django.http import JsonResponse,StreamingHttpResponse
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

from datetime import datetime
import re
 

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


# Registration_Id__Registration_Id__startswith="FOP"


@csrf_exempt
@require_http_methods(["GET"])
def Mci_Patient_Fake_Reports_OP(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        
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

        elif date_type == 'Particular':
            date_filter = Q(Registration_Id__created_at__date=ParticularDate)
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
            Registration_Id__VisitPurpose='OP',
        )

        old_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            old_date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType__in=['FollowUp No Fee', 'FollowUp With Fee','FollowUp'],
            Registration_Id__VisitPurpose='OP',

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
                old_patients1 = old_patients1.filter(gender_queries)


        # Apply specialty filter
        if selected_specialities:
            new_patients1 = new_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)
            old_patients1 = old_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)


        if selectedCategories:
            new_patients1 = new_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)
            old_patients1 = old_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)


        if selectedInsurance:
            
            new_patients1 = new_patients1.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)
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
                    'Patientid':patient.Registration_Id.PatientId.PatientNo,
                    'originalPatientid':patient.Registration_Id.PatientId.PatientId if patient.Registration_Id.PatientId.PatientId else None ,
                    'PatientName':patient.Registration_Id.PatientId.FirstName,
                    'Age':patient.Registration_Id.PatientId.Age,
                    'Gender':patient.Registration_Id.PatientId.Gender,
                    'Male': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age > 15 else 0,
                    'Female': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age > 15 else 0,
                    'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age >= 0 else 0,
                    'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age >= 0 else 0,
                }
                new_patientlist.append(datalist)

        old_patientlist = []
        for patient in old_patients1:
            if patient:
                age = get_age_value(patient.Registration_Id.PatientId.Age)
                datalist = {

                    'Department': patient.Specialization.Speciality_Name,
                    'Patientid':patient.Registration_Id.PatientId.PatientNo,
                    'originalPatientid':patient.Registration_Id.PatientId.PatientId if patient.Registration_Id.PatientId.PatientId else None ,
                    'PatientName':patient.Registration_Id.PatientId.FirstName,
                    'Age':patient.Registration_Id.PatientId.Age,
                    'Gender':patient.Registration_Id.PatientId.Gender,
                    'Male': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age > 15 else 0,
                    'Female': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age > 15 else 0,
                    'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age >= 0 else 0,
                    'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age >= 0 else 0,
                }
                old_patientlist.append(datalist)





        # Combine data for response

        print(len(new_patientlist),'Final new_patientlist')
        print(len(old_patientlist),'Final old_patientlist')
        response_data = {
            'New': new_patientlist,
            'Old': old_patientlist
        }

        return JsonResponse(response_data, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Mci_New_Patient_Fake_Reports_OP(request):
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
            old_date_filter = ~Q(Registration_Id__created_at__date=current_date)
        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
                old_date_filter = ~Q(Registration_Id__created_at__date__gte=from_date, Registration_Id__created_at__date__lte=to_date)
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Base querysets
        new_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType='NewConsultation',
            Registration_Id__VisitPurpose='OP',
            Registration_Id__Registration_Id__startswith="FOP"
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

        print(new_patients1.count(), 'new_patients_after_gender')

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
def Mci_Revisit_Patient_Fake_Reports_OP(request):
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
            Registration_Id__VisitPurpose='OP',
            Registration_Id__Registration_Id__startswith="FOP"
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
def MCI_New_Fake_Patient_List(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        
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
                Registration_Id__VisitPurpose='OP',
                Registration_Id__IsOriginal = False
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
def MCI_Revisit_Fake_Patient_List(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        
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
                Registration_Id__VisitPurpose='OP',
                                Registration_Id__IsOriginal = False

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
def MCI_Overall_Fake_Patient_List(request):
    try:
        # Step 1: Parse Filters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        current_date = datetime.now().date()

        selected_genders = request.GET.getlist('selectedGenders[]')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]')]
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = [int(s) for s in request.GET.getlist('selectedInsurance[]')]

        # Step 2: Date Filter
        if date_type == 'Current':
            date_filter = Q(Registration_Id__created_at__date=current_date)
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
            .filter(date_filter, Registration_Id__VisitPurpose='OP',Registration_Id__IsOriginal = False
)
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
def MCI_InPatient_Fake_List(request):
    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
        current_date = datetime.now().date()

        selected_genders = request.GET.getlist('selectedGenders[]') or []
        selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = request.GET.getlist('selectedInsurance[]')
        selected_ward = request.GET.getlist('SelectedWards[]')
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


        if date_type == 'Current':
            date_filter = Q(Status__in=['Admitted','Pending'], Booking_Status__in=['Occupied','Booked'], created_at__date__lte=current_date)
        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Status__in=['Admitted','Pending'], Booking_Status__in=['Occupied','Booked'], created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        inpatient_query = MCI_Patient_IP_Registration_Detials.objects.filter(date_filter,IsOriginal = False).select_related(
            'PatientId', 'PatientId__Title', 'Specialization'
        ).order_by('-created_at')

        if selected_ward:
            wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                # CurrentlyStayed=True
            ).values_list('IP_Registration_Id_id', flat=True)


            inpatient_query = inpatient_query.filter(Registration_Id__in=list(wardwise_reg_ids))

        if selected_genders:
            inpatient_query = inpatient_query.filter(PatientId__Gender__in=selected_genders)
        if selected_specialities:
            inpatient_query = inpatient_query.filter(Specialization__Speciality_Id__in=selected_specialities)
        if selected_insurance:
            inpatient_query = inpatient_query.filter(Insurance__Insurance_Id__in=selected_insurance)  # Adjust field name as per your model
        if selected_categories:
            inpatient_query = inpatient_query.filter(PatientCategory__in=selected_categories)  # Adjust field name as per your model

        # if SelectedUsers:
        #     inpatient_query = inpatient_query.filter(created_by__in=SelectedUsers)  # Adjust field name as per your model


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
                    IP_Registration_Id__Registration_Id=data.Registration_Id,
                    # CurrentlyStayed=True
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
                    'WardName': ward_info.RoomId.Ward_Name.Ward_Name.Ward_Name if ward_info else None,
                    'Createdby' : data.created_by,
                    'Floor' : ward_info.RoomId.Floor_Name.Floor_Name,
                    'Bedno' : ward_info.RoomId.Bed_No,
                    'Patientcategory' : data.PatientCategory
                 }

                yield json.dumps(record)
            yield ']'

        return StreamingHttpResponse(generate_json(), content_type="application/json")

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# @csrf_exempt
# @require_http_methods(["GET"])
# def MCI_Discharge_Patient_List(request):

#     try:

#         date_type = request.GET.get('searchOptions[DateType]', 'Current')
#         from_date = request.GET.get('searchOptions[FromDate]')
#         to_date = request.GET.get('searchOptions[ToDate]')
#         current_date = datetime.now().date()

#         selected_genders = request.GET.getlist('selectedGenders[]') or []
#         selected_specialities = request.GET.getlist('SelectedSpecialityIds[]')
#         selected_categories = request.GET.getlist('selectedCategories[]')
#         selected_insurance = request.GET.getlist('selectedInsurance[]')
#         selected_ward = request.GET.getlist('SelectedWards[]')

#         try:
#             selected_specialities = [int(x) for x in selected_specialities if x]
#         except ValueError:
#             selected_specialities = []

#         try:
#             selected_insurance = [int(x) for x in selected_insurance if x]
#         except ValueError:
#             selected_insurance = []

#         try:
#             selected_ward = [int(x) for x in selected_ward if x]
#         except ValueError:
#             selected_ward = []

#         if date_type == 'Current':
#             date_filter = Q(Discharge_Date__date=current_date)
#         else:
#             try:
#                 from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
#                 to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
#                 date_filter = Q(Discharge_Date__date__range=(from_date, to_date))
#             except (ValueError, TypeError):
#                 return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)






#         Dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter).order_by('-created_at')
#         DischargeList = []

#         if selected_ward:
#             wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
#                 RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
#                 CurrentlyStayed=False
#             ).values_list('IP_Registration_Id', flat=True)
#             Dischargeins = Dischargeins.filter(Registration_Id__Registration_Id__in=list(wardwise_reg_ids))


#         if selected_genders:
#             Dischargeins = Dischargeins.filter(Registration_Id__PatientId__Gender__in=selected_genders)
#         if selected_specialities:
#             Dischargeins = Dischargeins.filter(Registration_Id__Specialization__Speciality_Id__in=selected_specialities)
#         if selected_insurance:
#             Dischargeins = Dischargeins.filter(Registration_Id__Insurance__Insurance_Id__in=selected_insurance)  
#         if selected_categories:
#             Dischargeins = Dischargeins.filter(Registration_Id__Category__in=selected_categories) 




#         for datas in Dischargeins:


#             title = datas.Registration_Id.PatientId.Title.Title_Name if datas.Registration_Id.PatientId.Title else ''
#             fname = datas.Registration_Id.PatientId.FirstName or ''
#             mname = datas.Registration_Id.PatientId.MiddleName or ''
#             lname = datas.Registration_Id.PatientId.SurName or ''
#             full_name = f"{title}. {fname} {mname} {lname}".strip()

#             ward_info = MCI_Patient_Admission_Room_Detials.objects.filter(
#                     IP_Registration_Id__Registration_Id=datas.Registration_Id.Registration_Id,
#                     CurrentlyStayed=False
#                 ).last()

#             datalist = {
#                 'IPNo': datas.Registration_Id.Registration_Id,
#                 'PatientId' : datas.Registration_Id.PatientId.PatientId,
#                 'PatientName': full_name,
#                 'Dept': datas.Registration_Id.Specialization.Speciality_Name if datas.Registration_Id.Specialization else None,
#                 'Age': datas.Registration_Id.PatientId.Age,
#                 'Gender': datas.Registration_Id.PatientId.Gender,
#                 'AdmissionDate': datas.Registration_Id.created_at.strftime("%d-%m-%y"),
#                 'WardName': ward_info.RoomId.Ward_Name.Ward_Name.Ward_Name if ward_info else None,
#                 'Discharge_Date': datas.Discharge_Date.strftime("%d-%m-%y")


#             }
#             DischargeList.append(datalist)
#         return JsonResponse(DischargeList,safe=False)

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def MCI_Fake_Patient_IPAdmission_List(request):

    try:
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        from_date = request.GET.get('searchOptions[FromDate]')
        to_date = request.GET.get('searchOptions[ToDate]')
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


        # Define date filter with status conditions
        if date_type == 'Current':
            date_filter = Q(Status__in=['Admitted','Pending','Completed'], Booking_Status__in=['Occupied','Booked','Vacated'], created_at__date=current_date)
        else:
            try:
                from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                date_filter = Q(Status__in=['Admitted','Pending','Completed'], Booking_Status__in=['Occupied','Booked','Vacated'], created_at__date__range=(from_date, to_date))
            except (ValueError, TypeError):
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Apply filters to query
        inpatient_query = MCI_Patient_IP_Registration_Detials.objects.filter(date_filter,IsOriginal = False).select_related(
            'PatientId', 'PatientId__Title', 'Specialization'
        ).order_by('-created_at')

        # Apply ward filter if provided
        if selected_ward:
            wardwise_reg_ids = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId__Ward_Name__Ward_Name__Ward_Id__in=selected_ward,
                # CurrentlyStayed=True
            ).values_list('IP_Registration_Id_id', flat=True)


            inpatient_query = inpatient_query.filter(Registration_Id__in=list(wardwise_reg_ids))

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
                    IP_Registration_Id__Registration_Id=data.Registration_Id
                    # CurrentlyStayed=True
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
                    'WardName': ward_info.RoomId.Ward_Name.Ward_Name.Ward_Name if ward_info else None,
                    'Patientcategory' : data.PatientCategory,
                    'Createdby' : data.created_by,


                }

                yield json.dumps(record)
            yield ']'

        return StreamingHttpResponse(generate_json(), content_type="application/json")

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Mci_Fake_Patient_Original_Reports_OP(request):

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
            Registration_Id__VisitPurpose='OP',
            Registration_Id__IsOriginal = False
        )

        old_patients1 = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
            old_date_filter,
            Status__in=['Registered', 'InProgress', 'Completed'],
            VisitType__in=['FollowUp No Fee', 'FollowUp With Fee','FollowUp'],
            Registration_Id__VisitPurpose='OP',
            Registration_Id__IsOriginal = False

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
                old_patients1 = old_patients1.filter(gender_queries)


        # Apply specialty filter
        if selected_specialities:
            new_patients1 = new_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)
            old_patients1 = old_patients1.filter(Specialization__Speciality_Id__in=selected_specialities)


        if selectedCategories:
            new_patients1 = new_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)
            old_patients1 = old_patients1.filter(Registration_Id__PatientCategory__in=selectedCategories)


        if selectedInsurance:
            
            new_patients1 = new_patients1.filter(Registration_Id__InsuranceName__Insurance_Id__in=selectedInsurance)
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

                if (('Male' in selected_genders and gender == 'Male' and age > 15) or
                    ('MaleChild' in selected_genders and gender == 'Male' and age <= 15 and age >= 0) or
                    ('FemaleChild' in selected_genders and gender == 'Female' and age <= 15 and age >= 0) or
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
                    'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age >= 0 else 0,
                    'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age >= 0 else 0,
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
                    'MCh': 1 if patient.Registration_Id.PatientId.Gender == 'Male' and age <= 15 and age >= 0 else 0,
                    'FCh': 1 if patient.Registration_Id.PatientId.Gender == 'Female' and age <= 15 and age >= 0 else 0,
                }
                old_patientlist.append(datalist)

        # Combine data for response

        print(len(new_patientlist),'Final new_patientlist')
        print(len(old_patientlist),'Final old_patientlist')
        response_data = {
            'New': new_patientlist,
            'Old': old_patientlist
        }

        return JsonResponse(response_data, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def MCI_IP_Census_Only_Fake_Patient_Combined_Reports(request):
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
            Status='Admitted',
            IsOriginal = False
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
def MCI_IP_CENSUS_Only_Fake_Discharge_Count_Reports(request):
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
        Dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter,Registration_Id__IsOriginal = False ).order_by('-created_at')
 
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
def MCI_IP_Census_Only_Fake_INPatient_Count_Reports(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]') if s.isdigit()]
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = [int(s) for s in request.GET.getlist('selectedInsurance[]') if s.isdigit()]
 
        # Date filtering
        if date_type == 'Current':
            date_filter = Q(created_at__date__lte=current_date)
           
        elif date_type == 'Particular':
            date_filter = Q(created_at__date__lte=ParticularDate)
           
        else:
            if not from_date_str or not to_date_str:
                return JsonResponse({'error': 'FromDate and ToDate required for date range'}, status=400)
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
                date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
           
        # date_filter = Q(created_at__date__lte=current_date)
 
        # Start with base queryset (only admitted patients)
        queryset = MCI_Patient_IP_Registration_Detials.objects.filter(
            date_filter,
            Status='Admitted'  # Only currently admitted
        ).select_related(
            'PatientId', 'Specialization'
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
 
        # Aggregate counts by department
        department_counts = {}
        for reg in queryset:
            department = reg.Specialization.Speciality_Name if reg.Specialization else 'Unknown'
           
            if department not in department_counts:
                department_counts[department] = 0
            department_counts[department] += 1
 
        # Convert to list format expected by frontend
        inpatient_count_list = []
        for department, count in department_counts.items():
            inpatient_count_list.append({
                'Department': department,
                'Count': count,
                'total': count  # Adding both formats for compatibility
            })
 
        # Or if you want to return a simple dictionary structure:
        # response_data = {
        #     'data': inpatient_count_list,
        #     'Total': len(queryset)
        # }
 
        return JsonResponse(inpatient_count_list, safe=False, status=200)
 
    except Exception as e:
        print(f"Error in IP_Census_INPatient_Count_Reports: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error'}, status=500)
 
 
def get_previous_date(input_date):
    return input_date - timedelta(days=1)
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_IP_Census_Only_Fake_Prev_INPatient_Count_Reports(request):
    try:
        # Parse query parameters
        date_type = request.GET.get('searchOptions[DateType]', 'Current')
        current_date = datetime.now().date()
        from_date_str = request.GET.get('searchOptions[FromDate]')
        to_date_str = request.GET.get('searchOptions[ToDate]')
        ParticularDate = request.GET.get('searchOptions[ParticularDate]')
       
        selected_specialities = [int(s) for s in request.GET.getlist('SelectedSpecialityIds[]') if s.isdigit()]
        selected_categories = request.GET.getlist('selectedCategories[]')
        selected_insurance = [int(s) for s in request.GET.getlist('selectedInsurance[]') if s.isdigit()]
 
        if date_type == 'Current':
            effective_date = get_previous_date(current_date)
            date_filter = Q(created_at__date__lte=effective_date)
            dis_date_filter = Q(created_at__date__gte=current_date)
 
        elif date_type == 'Particular':
            if not ParticularDate:
                return JsonResponse({'error': 'ParticularDate required'}, status=400)
            try:
                particular_date = datetime.strptime(ParticularDate, '%Y-%m-%d').date()
                effective_date = get_previous_date(particular_date)
                date_filter = Q(created_at__date__lte=effective_date)
                dis_date_filter = Q(created_at__date=particular_date)
            except ValueError:
                return JsonResponse({'error': 'Invalid ParticularDate format. Use YYYY-MM-DD.'}, status=400)
 
        else:  
            if not from_date_str or not to_date_str:
                return JsonResponse(
                    {'error': 'FromDate and ToDate required for date range'},
                    status=400
                )
            try:
                from_date = datetime.strptime(from_date_str, '%Y-%m-%d').date()
                to_date = datetime.strptime(to_date_str, '%Y-%m-%d').date()
               
                effective_from_date = get_previous_date(from_date)
                effective_to_date = get_previous_date(to_date)
               
                date_filter = Q(created_at__date__range=[effective_from_date, effective_to_date])
                dis_date_filter = Q(created_at__date__range=[from_date, to_date])
            except ValueError:
                return JsonResponse(
                    {'error': 'Invalid date format. Use YYYY-MM-DD.'},
                    status=400
                )
 
        prevqueryset = MCI_Patient_IP_Registration_Detials.objects.filter(
            date_filter,
            Status__in=['Admitted'],
            IsOriginal = False
        ).select_related(
            'PatientId', 'Specialization'
        ).only(
            'PatientId__Gender',
            'PatientId__Age',
            'Specialization__Speciality_Name',
            'PatientCategory',
            'InsuranceName__Insurance_Id'
        )
 
        discharged_patients = MCI_Patient_Discharge_Detials.objects.filter(
            dis_date_filter,
            Registration_Id__IsOriginal = False
        ).select_related('Registration_Id')
 
        admitted_ip_nos = prevqueryset.values_list('IPNo', flat=True)
        discharged_ip_nos = discharged_patients.values_list('Registration_Id__IPNo', flat=True)
 
        combined_ip_nos = list(set(list(admitted_ip_nos) + list(discharged_ip_nos)))
 
        queryset = MCI_Patient_IP_Registration_Detials.objects.filter(
            IPNo__in=combined_ip_nos
        ).select_related(
            'PatientId', 'Specialization', 'InsuranceName'
        )
 
        if selected_specialities:
            queryset = queryset.filter(Specialization__Speciality_Id__in=selected_specialities)
 
        if selected_categories:
            queryset = queryset.filter(PatientCategory__in=selected_categories)
 
        if selected_insurance:
            queryset = queryset.filter(InsuranceName__Insurance_Id__in=selected_insurance)
 
        # Aggregate counts by department
        department_counts = {}
        for reg in queryset:
            department = reg.Specialization.Speciality_Name if reg.Specialization else 'Unknown'
           
            if department not in department_counts:
                department_counts[department] = 0
            department_counts[department] += 1
 
        # Convert to list format expected by frontend
        inpatient_count_list = []
        for department, count in department_counts.items():
            inpatient_count_list.append({
                'Department': department,
                'Count': count,
                'total': count  # Adding both formats for compatibility
            })
 
        # Or if you want to return a simple dictionary structure:
        # response_data = {
        #     'data': inpatient_count_list,
        #     'Total': len(queryset)
        # }
 
        return JsonResponse(inpatient_count_list, safe=False, status=200)
 
    except Exception as e:
        print(f"Error in IP_Census_INPatient_Count_Reports: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
 
@csrf_exempt
@require_http_methods(["GET"])
def MCI_Discharge_Only_Fake_Patient_List(request):
 
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
 
        Dischargeins = MCI_Patient_Discharge_Detials.objects.filter(date_filter,Registration_Id__IsOriginal = False).order_by('-created_at')
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
                'PatientId' : datas.Registration_Id.PatientId.PatientId if datas.Registration_Id.IsOriginal == True else datas.Registration_Id.PatientId.PatientNo,
                'PatientName': full_name,
                'Dept': datas.Registration_Id.Specialization.Speciality_Name if datas.Registration_Id.Specialization else None,
                'Age': datas.Registration_Id.PatientId.Age,
                'Gender': datas.Registration_Id.PatientId.Gender,
                'AdmissionDate': datas.Registration_Id.created_at.strftime("%d-%m-%y"),
                'WardName': ward_info.RoomId.Ward_Name.Ward_Name.Ward_Name if ward_info else None,
                'Discharge_Date': datas.created_at.strftime("%d-%m-%y"),
                'Discharge_Time': datas.created_at.strftime("%I:%M %p"),
                'Dischargedby': datas.created_by,
                'NoOfDays': no_of_days,  # Added No of Days field
            }
            DischargeList.append(datalist)
        return JsonResponse(DischargeList, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
 
  
 
 

