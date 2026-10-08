from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
from django.views.decorators.http import require_http_methods
import string
from django.db.models import Q


@csrf_exempt
@require_http_methods(['POST', 'GET'])
def insert_birth_register(request):
    try:
        if request.method == 'POST':
            # Parse the JSON request body
            data = json.loads(request.body)

            print(data, 'dataaa')
            
            # Extract data from JSON
            PatientId = data.get('PatientId', '')
            MotherName = data.get('MotherName', '')
            FatherName = data.get('FatherName', '')
            TypeOfDelivery = data.get('TypeOfDelivery', '')
            Gravida = data.get('Gravida', '')
            DeliveryDate = data.get('DeliveryDate', '')
            DeliveryTime = data.get('DeliveryTime', '')
            GenderOfFetus = data.get('GenderOfFetus', '')
            WeightOfFetus = data.get('WeightOfFetus', '')
            AddressOfMotherAtTimeOfDelivery = data.get('AddressOfMotherAtTimeOfDelivery', '')
            PermanentAddress = data.get('PermanentAddress', '')
            MotherEducationBusiness = data.get('MotherEducationBusiness', '')
            HusbandEducationBusiness = data.get('HusbandEducationBusiness', '')
            Cast = data.get('Cast', '')
            Relegion = data.get('Relegion', '')
            BloodGroup = data.get('BloodGroup', '')
            PregnancyPeriod = data.get('PregnancyPeriod', '')
            Location = data.get('Location', '')
            CreatedBy = data.get('CreatedBy', '')
            AgeAtTimeOfMarriage = data.get('AgeAtTimeOfMarriage', '')  
            AgeAtTimeOfDelivery = data.get('AgeAtTimeOfDelivery', '')  
            RegistrationId = data.get("RegistrationId")

            if not RegistrationId:
                return JsonResponse({'error': 'RegistrationId is required'})

            # Get the IP registration instance using the RegistrationId
            try:
                registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                Department = 'IP'
                print("Found in IP Registration")
            except Patient_IP_Registration_Detials.DoesNotExist:
                print("Not found in IP Registration, trying Casuality Registration")
                # Handle the case where the IP registration is not found
            PatientId_ins = Patient_Detials.objects.get(pk=PatientId)
            # Fetch existing birth records for the PatientId to determine ChildId suffix
            existing_children = BirthRegister.objects.filter(PatientId=PatientId)

            if existing_children.exists():
                # Get the last ChildId suffix and increment it
                last_child = existing_children.order_by('ChildId').last()
                last_suffix = last_child.ChildId[-1]  # Get the last character (suffix)

                # Find the next character in the alphabet
                if last_suffix in string.ascii_uppercase:
                    next_suffix = chr(ord(last_suffix) + 1)  # Increment the character
                else:
                    next_suffix = 'A'  # Default to 'A' if suffix is not an uppercase letter
            else:
                # If no previous children exist for this PatientId, start with 'A'
                next_suffix = 'A'

            # Generate the new ChildId
            ChildId = f"{PatientId}{next_suffix}"

            # Create a new BirthRegister entry using Django ORM
            birth_record_instance = BirthRegister(
                Ip_Registration_Id=registration_ins_ip,
                ChildId=ChildId,  # Generated ChildId
                PatientId=PatientId_ins,
                MotherName=MotherName,
                FatherName=FatherName,
                TypeOfDelivery=TypeOfDelivery,
                Gravida=Gravida,
                DeliveryDate=DeliveryDate,
                DeliveryTime=DeliveryTime,
                GenderOfFetus=GenderOfFetus,
                WeightOfFetus=WeightOfFetus,
                AddressOfMotherAtTimeOfDelivery=AddressOfMotherAtTimeOfDelivery,
                PermanentAddress=PermanentAddress,
                MotherEducationBusiness=MotherEducationBusiness,
                HusbandEducationBusiness=HusbandEducationBusiness,
                Cast=Cast,
                Relegion=Relegion,
                BloodGroup=BloodGroup,
                PregnancyPeriod=PregnancyPeriod,
                AgeAtTimeOfMarriage=AgeAtTimeOfMarriage,  
                AgeAtTimeOfDelivery=AgeAtTimeOfDelivery, 
                Department=Department,
                Created_by=CreatedBy,
                Location=Location,
            )

            birth_record_instance.save()

            return JsonResponse({'success': 'Data inserted successfully', 'ChildId': ChildId})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(['GET'])
def get_birth_register(request):
    if request.method == 'GET':
        try:
            search_query = request.GET.get('search', None)

            # Retrieve all birth register details
            BirthRegister_details = BirthRegister.objects.all()

            # Filter if a search query is provided
            if search_query:
                # Perform a case-insensitive search on PatientId (assuming you're searching for id field) and MotherName
                BirthRegister_details = BirthRegister_details.filter(
                    Q(PatientId__pk__icontains=search_query) |  # Adjust 'id' to the correct field in your Patient model if needed
                    Q(MotherName__icontains=search_query)
                )

            # Prepare the response data
            BirthRegister_details_data = []
            for idx, Birth in enumerate(BirthRegister_details, start=1):
                Birth_dict = {
                    'id': idx,
                    'RegistrationId': Birth.Ip_Registration_Id.pk,
                    # 'VisitId': Birth.Ip_Registration_Id.VisitId,
                    'PrimaryDoctorId': Birth.Ip_Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': Birth.Ip_Registration_Id.PrimaryDoctor.ShortName,
                    'PatientId': Birth.PatientId.pk,  # Assuming PatientId is a ForeignKey field
                    'ChildId': Birth.ChildId,
                    'AgeAtTimeOfMarriage': Birth.AgeAtTimeOfMarriage,
                    'AgeAtTimeOfDelivery': Birth.AgeAtTimeOfDelivery,
                    'MotherName': Birth.MotherName,
                    'FatherName': Birth.FatherName,
                    'TypeOfDelivery': Birth.TypeOfDelivery,
                    'Gravida': Birth.Gravida,
                    'DeliveryDate': Birth.DeliveryDate,
                    'DeliveryTime': Birth.DeliveryTime,
                    'GenderOfFetus': Birth.GenderOfFetus,
                    'WeightOfFetus': Birth.WeightOfFetus,
                    'AddressOfMotherAtTimeOfDelivery': Birth.AddressOfMotherAtTimeOfDelivery,
                    'PermanentAddress': Birth.PermanentAddress,
                    'MotherEducationBusiness': Birth.MotherEducationBusiness,
                    'HusbandEducationBusiness': Birth.HusbandEducationBusiness,
                    'Cast': Birth.Cast,
                    'Relegion': Birth.Relegion,
                    'BloodGroup': Birth.BloodGroup,
                    'PregnancyPeriod': Birth.PregnancyPeriod,
                    'Department': Birth.Department,
                    'CurrDate': Birth.created_at.strftime('%d-%m-%y'),
                    'CurrTime': Birth.created_at.strftime('%H:%M:%S'),
                    'Createdby': Birth.Created_by,
                }
                BirthRegister_details_data.append(Birth_dict)

            return JsonResponse(BirthRegister_details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(['POST', 'GET'])
def insert_death_register(request):
    try:
        if request.method == 'POST':
            # Parse the JSON request body
            data = json.loads(request.body)

            print(data, 'dataaa')
            
            # Extract data from JSON
            RegistrationId = data.get("RegistrationId")
            FormNo = data.get('FormNo', '')
            # Department = data.get('Department', '')
            PatientId = data.get('PatientId', '')
            PatientName = data.get('PatientName', '')
            PatientAddress = data.get('PatientAddress', '')
            PatientMotherName = data.get('PatientMotherName', '')
            PatientFatherName = data.get('PatientFatherName', '')
            PatientHusbandOrWife = data.get('PatientHusbandOrWife', '')
            DateOfDeath = data.get('DateOfDeath', '')
            Gender = data.get('Gender', '')
            Age = data.get('Age', '')
            AadharNo = data.get('AadharNo', '')
            FirstBloodRelativeName = data.get('FirstBloodRelativeName', '')
            MobileNo = data.get('MobileNo', '')
            RelationWithPatient = data.get('RelationshipWithPatient', '')
            CauseOfDeath = data.get('CauseOfDeath', '')
            PlaceOfDeath = data.get('PlaceOfDeath', '')
            TimeOfDeath = data.get('TimeOfDeath', '')
            CreatedBy = data.get('CreatedBy', '')
            Location = data.get('Location', '')

            PermanentPincode = data.get('PermanentPincode', '')
            PermanentdoorNo = data.get('PermanentdoorNo', '')
            PermanentStreet = data.get('PermanentStreet', '')
            PermanentArea = data.get('PermanentArea', '')
            PermanentCity = data.get('PermanentCity', '')
            PermanentDistrict = data.get('PermanentDistrict', '')
            PermanentState = data.get('PermanentState', '')
            PermanentCountry = data.get('PermanentCountry', '')

            
            registration_ins_ip = None
            registration_ins_casuality = None
            
            if RegistrationId:
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    Department = 'IP'
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                        Department = 'Casuality'

                        print(registration_ins_casuality,'registration_ins_casuality')
                        print("Found in Casuality Registration")
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'No registration found for the given RegistrationId'})

            else:
                return JsonResponse({'warn': 'RegistrationId is required'})
            
            PatientId_ins = Patient_Detials.objects.get(pk=PatientId)
            if DeathRegister.objects.filter(PatientId=PatientId_ins).exists():
                return JsonResponse({'warn': 'Death record for this patient already exists'})

            # Create a new DeathRegister entry using Django ORM
            death_record_instance = DeathRegister(
                Ip_Registration_Id=registration_ins_ip,
                Casuality_Registration_Id=registration_ins_casuality,
                FormNo=FormNo,
                PatientId=PatientId_ins,
                PatientName=PatientName,
                PatientAddress=PatientAddress,
                PatientMotherName=PatientMotherName,
                PatientFatherName=PatientFatherName,
                PatientHusbandOrWife=PatientHusbandOrWife,
                DateOfDeath=DateOfDeath,
                Gender=Gender,
                Age=Age,
                AadharNo=AadharNo,
                FirstBloodRelativeName=FirstBloodRelativeName,
                MobileNo=MobileNo,
                RelationWithPatient=RelationWithPatient,
                CauseOfDeath=CauseOfDeath,
                PlaceOfDeath=PlaceOfDeath,
                TimeOfDeath=TimeOfDeath,
                Department=Department,
                PermanentPincode=PermanentPincode, 
                PermanentdoorNo=PermanentdoorNo, 
                PermanentStreet=PermanentStreet, 
                PermanentArea=PermanentArea, 
                PermanentCity=PermanentCity, 
                PermanentDistrict=PermanentDistrict, 
                PermanentState=PermanentState, 
                PermanentCountry=PermanentCountry,
                Created_by=CreatedBy,
                Location=Location,

            )

            death_record_instance.save()

            return JsonResponse({'success': 'Data inserted successfully'})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(['GET'])
def get_death_register(request):
    if request.method == 'GET':
        try:
            search_query = request.GET.get('search', None)

            # Retrieve all birth register details
            DeathRegister_details = DeathRegister.objects.all()

            # Filter if a search query is provided
            if search_query:
                # Perform a case-insensitive search on PatientId (assuming you're searching for id field) and MotherName
                DeathRegister_details = DeathRegister_details.filter(
                    Q(PatientId__pk__icontains=search_query) |  # Adjust 'id' to the correct field in your Patient model if needed
                    Q(PatientName__icontains=search_query)
                )

            # Prepare the response data
            DeathRegister_details_data = []
            for idx, Death in enumerate(DeathRegister_details, start=1):
                Death_dict = {
                    'id': idx,
                    'RegistrationId': Death.Ip_Registration_Id.pk if Death.Ip_Registration_Id else Death.Casuality_Registration_Id.pk,
                    # 'VisitId': Death.Ip_Registration_Id.VisitId if Death.Ip_Registration_Id else Death.Casuality_Registration_Id.VisitId,
                    'PrimaryDoctorId': Death.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Death.Ip_Registration_Id else Death.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': Death.Ip_Registration_Id.PrimaryDoctor.ShortName if Death.Ip_Registration_Id else Death.Casuality_Registration_Id.PrimaryDoctor.ShortName,
                    'PatientId': Death.PatientId.pk,  # Assuming PatientId is a ForeignKey field
                    'FormNo': Death.FormNo,
                    'PatientName': Death.PatientName,
                    'PatientAddress': Death.PatientAddress,
                    'PatientMotherName': Death.PatientMotherName,
                    'PatientFatherName': Death.PatientFatherName,
                    'PatientHusbandOrWife': Death.PatientHusbandOrWife,
                    'DateOfDeath': Death.DateOfDeath,
                    'Gender': Death.Gender,
                    'Age': Death.Age,
                    'AadharNo': Death.AadharNo,
                    'FirstBloodRelativeName': Death.FirstBloodRelativeName,
                    'MobileNo': Death.MobileNo,
                    'RelationWithPatient': Death.RelationWithPatient,
                    'CauseOfDeath': Death.CauseOfDeath,
                    'PlaceOfDeath': Death.PlaceOfDeath,
                    'TimeOfDeath': Death.TimeOfDeath,
                    'Department': Death.Department,
                    'CurrDate': Death.created_at.strftime('%d-%m-%y'),
                    'CurrTime': Death.created_at.strftime('%H:%M:%S'),
                    'Createdby': Death.Created_by,
                }
                DeathRegister_details_data.append(Death_dict)
                
                print(DeathRegister_details_data,'DeathRegister_details_data')
            return JsonResponse(DeathRegister_details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)








# @csrf_exempt
# @require_http_methods(['GET'])
# def get_birth_register(request):
#     if request.method == 'GET':
#         try:

#             BirthRegister_details = BirthRegister.objects.all()

#             BirthRegister_details_data = []
#             for idx, Birth in enumerate(BirthRegister_details,start=1):
#                 Birth_dict = {
#                     'id': idx,
#                     'RegistrationId': Birth.Ip_Registration_Id.pk,
#                     'VisitId': Birth.Ip_Registration_Id.VisitId,
#                     'PrimaryDoctorId': Birth.Ip_Registration_Id.PrimaryDoctor.Doctor_ID,
#                     'PrimaryDoctorName': Birth.Ip_Registration_Id.PrimaryDoctor.ShortName,
#                     'PatientId':Birth.PatientId.pk,
#                     'ChildId':Birth.ChildId,
#                     'AgeAtTimeOfMarriage':Birth.AgeAtTimeOfMarriage,
#                     'AgeAtTimeOfDelivery':Birth.AgeAtTimeOfDelivery,
#                     'MotherName':Birth.MotherName,
#                     'FatherName':Birth.FatherName,
#                     'TypeOfDelivery':Birth.TypeOfDelivery,
#                     'Gravida':Birth.Gravida,
#                     'DeliveryDate':Birth.DeliveryDate,
#                     'DeliveryTime':Birth.DeliveryTime,
#                     'GenderOfFetus':Birth.GenderOfFetus,
#                     'WeightOfFetus':Birth.WeightOfFetus,
#                     'AddressOfMotherAtTimeOfDelivery':Birth.AddressOfMotherAtTimeOfDelivery,
#                     'PermanentAddress':Birth.PermanentAddress,
#                     'MotherEducationBusiness':Birth.MotherEducationBusiness,
#                     'HusbandEducationBusiness':Birth.HusbandEducationBusiness,
#                     'Cast':Birth.Cast,
#                     'Relegion':Birth.Relegion,
#                     'BloodGroup':Birth.BloodGroup,
#                     'PregnancyPeriod':Birth.PregnancyPeriod,
#                     'Department':Birth.Department,
#                     'CurrDate': Birth.created_at.strftime('%d-%m-%y'),
#                     'CurrTime': Birth.created_at.strftime('%H:%M:%S'),
#                     'Createdby': Birth.Created_by,

#                 }
#                 BirthRegister_details_data.append(Birth_dict)
#             return JsonResponse(BirthRegister_details_data, safe=False)
            
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)





# @csrf_exempt
# @require_http_methods(['GET'])
# def get_birth_register(request):
#     if request.method == 'GET':
#         try:
#             search_query = request.GET.get('search', None)


#             BirthRegister_details = BirthRegister.objects.all()
            
#             if search_query:
#                 BirthRegister_details = BirthRegister_details.filter(
#                     Q(PatientId__id__icontains=search_query) |  # Filter on the 'id' field of the related Patient model
#                     Q(MotherName__icontains=search_query)  # Filter on the MotherName field
#                 )

#             BirthRegister_details_data = []
#             for idx, Birth in enumerate(BirthRegister_details,start=1):
#                 Birth_dict = {
#                     'id': idx,
#                     'RegistrationId': Birth.Ip_Registration_Id.pk,
#                     'VisitId': Birth.Ip_Registration_Id.VisitId,
#                     'PrimaryDoctorId': Birth.Ip_Registration_Id.PrimaryDoctor.Doctor_ID,
#                     'PrimaryDoctorName': Birth.Ip_Registration_Id.PrimaryDoctor.ShortName,
#                     'PatientId':Birth.PatientId.pk,
#                     'ChildId':Birth.ChildId,
#                     'AgeAtTimeOfMarriage':Birth.AgeAtTimeOfMarriage,
#                     'AgeAtTimeOfDelivery':Birth.AgeAtTimeOfDelivery,
#                     'MotherName':Birth.MotherName,
#                     'FatherName':Birth.FatherName,
#                     'TypeOfDelivery':Birth.TypeOfDelivery,
#                     'Gravida':Birth.Gravida,
#                     'DeliveryDate':Birth.DeliveryDate,
#                     'DeliveryTime':Birth.DeliveryTime,
#                     'GenderOfFetus':Birth.GenderOfFetus,
#                     'WeightOfFetus':Birth.WeightOfFetus,
#                     'AddressOfMotherAtTimeOfDelivery':Birth.AddressOfMotherAtTimeOfDelivery,
#                     'PermanentAddress':Birth.PermanentAddress,
#                     'MotherEducationBusiness':Birth.MotherEducationBusiness,
#                     'HusbandEducationBusiness':Birth.HusbandEducationBusiness,
#                     'Cast':Birth.Cast,
#                     'Relegion':Birth.Relegion,
#                     'BloodGroup':Birth.BloodGroup,
#                     'PregnancyPeriod':Birth.PregnancyPeriod,
#                     'Department':Birth.Department,
#                     'CurrDate': Birth.created_at.strftime('%d-%m-%y'),
#                     'CurrTime': Birth.created_at.strftime('%H:%M:%S'),
#                     'Createdby': Birth.Created_by,

#                 }
#                 BirthRegister_details_data.append(Birth_dict)
#             return JsonResponse(BirthRegister_details_data, safe=False)
            
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)








# @csrf_exempt
# @require_http_methods(['POST', 'GET'])
# def insert_birth_register(request):
#     try:
#         if request.method == 'POST':
#             # Parse the JSON request body
#             data = json.loads(request.body)

#             print(data, 'dataaa')
            
#             # Extract data from JSON
#             PatientId = data.get('PatientId', '')
#             MotherName = data.get('MotherName', '')
#             FatherName = data.get('FatherName', '')
#             TypeOfDelivery = data.get('TypeOfDelivery', '')
#             Gravida = data.get('Gravida', '')
#             DeliveryDate = data.get('DeliveryDate', '')
#             DeliveryTime = data.get('DeliveryTime', '')
#             GenderOfFetus = data.get('GenderOfFetus', '')
#             WeightOfFetus = data.get('WeightOfFetus', '')
#             AddressOfMotherAtTimeOfDelivery = data.get('AddressOfMotherAtTimeOfDelivery', '')
#             PermanentAddress = data.get('PermanentAddress', '')
#             MotherEducationBusiness = data.get('MotherEducationBusiness', '')
#             HusbandEducationBusiness = data.get('HusbandEducationBusiness', '')
#             Cast = data.get('Cast', '')
#             BloodGroup = data.get('BloodGroup', '')
#             PregnancyPeriod = data.get('PregnancyPeriod', '')
#             # Department = data.get('Department', '')
#             Location = data.get('Location', '')
#             CreatedBy = data.get('CreatedBy', '')
#             AgeAtTimeOfMarriage = data.get('AgeAtTimeOfMarriage', '')  
#             AgeAtTimeOfDelivery = data.get('AgeAtTimeOfDelivery', '')  # Correct field name
#             RegistrationId = data.get("RegistrationId")


#             if RegistrationId:
#                 try:
#                     registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
#                     Department = 'IP'

#                     print("Found in IP Registration")
#                 except Patient_IP_Registration_Detials.DoesNotExist:
#                     print("Not found in IP Registration, trying Casuality Registration")
                    
#             else:
#                 return JsonResponse({'error': 'RegistrationId is required'})

#             # Create a new BirthRegister entry using Django ORM
#             birth_record_instance = BirthRegister(
#                 Ip_Registration_Id=registration_ins_ip,
#                 PatientId=PatientId,
#                 MotherName=MotherName,
#                 FatherName=FatherName,
#                 TypeOfDelivery=TypeOfDelivery,
#                 Gravida=Gravida,
#                 DeliveryDate=DeliveryDate,
#                 DeliveryTime=DeliveryTime,
#                 GenderOfFetus=GenderOfFetus,
#                 WeightOfFetus=WeightOfFetus,
#                 AddressOfMotherAtTimeOfDelivery=AddressOfMotherAtTimeOfDelivery,
#                 PermanentAddress=PermanentAddress,
#                 MotherEducationBusiness=MotherEducationBusiness,
#                 HusbandEducationBusiness=HusbandEducationBusiness,
#                 Cast=Cast,
#                 BloodGroup=BloodGroup,
#                 PregnancyPeriod=PregnancyPeriod,
#                 AgeAtTimeOfMarriage=AgeAtTimeOfMarriage,  
#                 AgeAtTimeOfDelivery=AgeAtTimeOfDelivery, 
#                 Department=Department,
#                 Created_by=CreatedBy,
#                 Location=Location,
#             )

#             birth_record_instance.save()

#             return JsonResponse({'success': 'Data inserted successfully'})

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)








