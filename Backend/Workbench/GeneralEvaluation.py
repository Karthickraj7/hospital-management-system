import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
# import magic
import filetype
import base64
from django.db.models import Q
from Masters.models import *


def Generate_Next_Code_3digit(max_code):
    numeric_part = max_code[-3:]
    prefix = max_code[:-3]
    next_number = int(numeric_part) + 1
    new_code = f"{prefix}{next_number:03d}"

    return new_code


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_GeneralEvaluation_Details(request):

    def validate_and_process_file(file):
        def get_file_type(file):
            if file.startswith('data:application/pdf;base64'):
                return 'application/pdf'
            elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                return 'image/jpeg'
            elif file.startswith('data:image/png;base64'):
                return 'image/png'
            else:
                return 'unknown'

        def compress_image(image, min_quality=50, step=5):
            output = BytesIO()
            quality = 95
            compressed_data = None
            while quality >= min_quality:
                output.seek(0)
                image.save(output, format='JPEG', quality=quality)
                compressed_data = output.getvalue()
                quality -= step
            output.seek(0)
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        def compress_pdf(file):
            output = BytesIO()
            reader = PdfReader(file)
            writer = PdfWriter()
            for page_num in range(len(reader.pages)):
                writer.add_page(reader.pages[page_num])
            writer.write(output)
            compressed_data = output.getvalue()
            compressed_size = len(compressed_data)
            return compressed_data, compressed_size

        if file:
            file_data = file.split(',')[1] if ',' in file else file
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)

            if file_type in ['image/jpeg', 'image/png']:
                try:
                    image = Image.open(BytesIO(file_content))
                    if image.mode in ('RGBA', 'P'):
                        image = image.convert('RGB')
                    compressed_image_data, compressed_size = compress_image(image)
                    return compressed_image_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing image: {str(e)}'})

            elif file_type == 'application/pdf':
                try:
                    compressed_pdf_data, compressed_size = compress_pdf(BytesIO(file_content))
                    return compressed_pdf_data
                except Exception as e:
                    return JsonResponse({'error': f'Error processing PDF: {str(e)}'})

            else:
                return JsonResponse({'warn': 'Unsupported file format'})

        return None
    
    
    if request.method == 'POST':
        try:
            data = request.POST

            print(data,'wrs3ere')
            
            cheifComplaint = data.get('cheifComplaint','')
            KeyComplaint = data.get('KeyComplaint','')
            History = data.get('History','')
            Examine = data.get('Examine','')
            Diagnosis = data.get('Diagnosis','')

            SearchICDCode = data.get('SearchICDCode','')
            SearchDescription = data.get('SearchDescription','')
            SearchDiagnosis = data.get('SearchDiagnosis','')

            ChooseDocument = data.get('ChooseDocument', None)

            currentAnnotation = data.get('currentAnnotation', None)

            
            DiseaseDetails = data.get('DiseaseDetails',None)
            diseasedata = json.loads(DiseaseDetails)
            print(diseasedata)
             
           
            created_by = data.get('Createdby', '')
            Type = data.get('Type', '')
            registration_id = data.get('RegistrationId', '')

            processedChooseDocument = validate_and_process_file(ChooseDocument) if ChooseDocument  else None

            processedcurrentAnnotation = validate_and_process_file(currentAnnotation) if currentAnnotation  else None

            print(registration_id,'registration_id')

            DoctorId = data.get('DoctorId')

            Doctorins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=DoctorId).first()

            if not registration_id:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)
        
            # try:
            registration_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            # except Patient_Appointment_Registration_Detials.DoesNotExist:
            #     return JsonResponse({'error': 'OPPatient not found'})

            print(registration_ins,'registration_ins')

            # try:
            Ip_registration_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
            # except Patient_IP_Registration_Detials.DoesNotExist:
            #     return JsonResponse({'error': 'IPPatient not found'})


            print(Ip_registration_ins,'Ip_registration_ins')

            print('vvvvvv------1')
            GeneralEvaluation_instance = Workbench_GeneralEvaluation(
                Registration_Id=registration_ins,
                IpRegistration_Id=Ip_registration_ins,
                CheifComplaint=cheifComplaint,
                KeyComplaint=KeyComplaint,
                History=History,
                Examine=Examine,
                Diagnosis=Diagnosis,
                ICDCode=SearchICDCode,
                ICDCode_Description=SearchDescription,
                ICDCode_Diagnosis=SearchDiagnosis,
                DiseaseDetails = diseasedata,
                ChooseDocument=processedChooseDocument,
                AnnotationDocument=processedcurrentAnnotation,
                created_by=created_by,
                Type=Type,
                Doctor = Doctorins,
            )
            GeneralEvaluation_instance.save()
            return JsonResponse({'success': 'GeneralEvaluation Details added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
            
   
    elif request.method == 'GET':
      try:
        def get_file_image(filedata):
            kind = filetype.guess(filedata)
            contenttype1 = 'application/pdf'  # default MIME
            if kind:
                if kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind.mime == 'image/png':
                    contenttype1 = 'image/png'
            return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'

        registration_id = request.GET.get('RegistrationId')
        if not registration_id:
            return JsonResponse({'warn': 'RegistrationId is required'}, status=400)

        # Try to get OP and IP registrations
        registration_ins = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=registration_id).first()
        Ip_registration_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id=registration_id).first()

        filters = Q()
        if registration_ins:
            filters |= Q(Registration_Id=registration_ins)
        if Ip_registration_ins:
            filters |= Q(IpRegistration_Id=Ip_registration_ins)

        if not filters:
            return JsonResponse({'error': 'No registration found for given ID'}, status=404)

        # Get evaluations
        evaluations = Workbench_GeneralEvaluation.objects.filter(filters)

        evaluation_data = []
        for idx, eval in enumerate(evaluations, start=1):
            reg_id = ''
            if eval.Registration_Id:
                reg_id = eval.Registration_Id.Registration_Id
            elif eval.IpRegistration_Id:
                reg_id = eval.IpRegistration_Id.Registration_Id

            evaluation_data.append({
                'sno': idx,
                'id': eval.Id,
                'RegistrationId': reg_id,
                'KeyComplaint': eval.KeyComplaint,
                'cheifComplaint': eval.CheifComplaint,
                'History': eval.History,
                'Examine': eval.Examine,
                'Diagnosis': eval.Diagnosis,
                'SearchICDCode': eval.ICDCode,
                'SearchDescription': eval.ICDCode_Description,
                'SearchDiagnosis': eval.ICDCode_Diagnosis,
                'ChooseDocument': get_file_image(eval.ChooseDocument) if eval.ChooseDocument else None,
                'currentAnnotation': get_file_image(eval.AnnotationDocument) if eval.AnnotationDocument else None,
                'DiseaseDetails': eval.DiseaseDetails,
                'created_by': eval.created_by,
                'Type': eval.Type,
                'Date': eval.created_at.strftime('%Y-%m-%d'),
                'Time': eval.created_at.strftime('%H:%M:%S'),
            })

        return JsonResponse(evaluation_data, safe=False)

      except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)




def Get_Keycomplaint(request):
    try:
        data = request.GET.get('KeyComplaint')
        querys =Q()
        if data:
            querys &= Q(KeyComplaint__icontains = data)
        responsedata =[]
        keycomplaints = Workbench_GeneralEvaluation.objects.filter(querys).values('KeyComplaint').distinct()[:10]
        print(keycomplaints,'keycomplaints')
        for key in keycomplaints:

            keval= key.get('KeyComplaint')
            complaints = Workbench_GeneralEvaluation.objects.filter(KeyComplaint = keval).order_by('-created_at').first()
            print(complaints,'complaints')
            data={
                    'id': len(responsedata) +1,
                    # 'PrimaryDoctorId': complaints.Registration_Id.PrimaryDoctor.Doctor_ID,
                    # 'PrimaryDoctorName': complaints.Registration_Id.PrimaryDoctor.ShortName,
                    'KeyComplaint': complaints.KeyComplaint,
                    'cheifComplaint': complaints.CheifComplaint,
                    'History': complaints.History,
                    'Examine': complaints.Examine,
                    'Diagnosis': complaints.Diagnosis,
                    'SearchICDCode':complaints.ICDCode,
                    'SearchDescription':complaints.ICDCode_Description,
                    'SearchDiagnosis':complaints.ICDCode_Diagnosis,

                }
            responsedata.append(data)
        return JsonResponse(responsedata, safe=False)
    except Exception as e:
        # Log the error and return a 500 Internal Server Error
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

def Get_DiseaseName(request):
    try:
        diseasename = request.GET.get('Diseasename','')
        print(diseasename)
        diseasedata = Disease_Master.objects.all()
        disease_list = []

        if diseasename:

            disease_ins = Disease_Master.objects.filter(DiseaseName=diseasename)
            print(disease_ins)
            for datas in disease_ins:
                disease_dict = {
                    'DiseaseCode': datas.DiseaseCode,
                    'DiseaseName': datas.DiseaseName,
                    'IsChronicle': datas.IsChronicle,
                    'IsCommunicable' : datas.IsCommunicable

                }
                disease_list.append(disease_dict)
            return JsonResponse(disease_list, safe=False)

        for datas in diseasedata:

            disease_dict = {
                   'DiseaseCode': datas.DiseaseCode,
                   'DiseaseName': datas.DiseaseName,
                   'IsChronicle': datas.IsChronicle,
                   'IsCommunicable' : datas.IsCommunicable

            }
            disease_list.append(disease_dict)
   
        return JsonResponse(disease_list, safe=False)
    except Exception as e:
        # Log the error and return a 500 Internal Server Error
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)   

def Get_PrimaryCodes():

        try:
            max_code = Disease_Master.objects.all().aggregate(
                    Max("DiseaseCode")
                )["DiseaseCode__max"]

            if max_code:
                new_department_code = (
                    Generate_Next_Code_3digit(max_code)
                )
            else:
                new_department_code = "DMC001"
        
            return new_department_code 
      
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return JsonResponse(
                {"success": False, "message": "An internal error occurred."}, status=500
            )

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Disease_master_details(request):

    if request.method == 'POST':

        data = json.loads(request.body)
        DiseaseCode = Get_PrimaryCodes()
        disease =  data.get('DiseaseName','')
        Ischronicle = data.get('IsChronicle','')
        IsCommunicable = data.get('IsCommunicable','')
        CreatedBy = data.get('CreatedBy','host')

        existing_name = Disease_Master.objects.filter(DiseaseName=disease).first()

        if existing_name:
            return JsonResponse('The name already present',safe=False)
        
        Disease_ins = Disease_Master(
            DiseaseCode = DiseaseCode,
            DiseaseName = disease,
            IsCommunicable = IsCommunicable,
            IsChronicle = Ischronicle,
            CreatedBy = CreatedBy
        )

        Disease_ins.save()

        return JsonResponse('success',safe=False)


# def Generate_Next_Code_3digit(max_code):
#     numeric_part = max_code[-3:]
#     prefix = max_code[:-3]
#     next_number = int(numeric_part) + 1
#     new_code = f"{prefix}{next_number:03d}"

#     return new_code


# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Workbench_GeneralEvaluation_Details(request):
#     def validate_and_process_file(file):
#         def compress_image(image, min_quality=50, step=5):
#             output = BytesIO()
#             quality = 95
#             compressed_data = None
#             while quality >= min_quality:
#                 output.seek(0)
#                 image.save(output, format='JPEG', quality=quality)
#                 compressed_data = output.getvalue()
#                 quality -= step
#             output.seek(0)
#             return compressed_data, len(compressed_data)
 
#         def compress_pdf(file):
#             output = BytesIO()
#             reader = PdfReader(file)
#             writer = PdfWriter()
#             for page_num in range(len(reader.pages)):
#                 writer.add_page(reader.pages[page_num])
#             writer.write(output)
#             compressed_data = output.getvalue()
#             return compressed_data, len(compressed_data)
 
#         if file:
#             file_content = file.read()  # File is now a file object from request.FILES
#             file_size = len(file_content)
#             max_size_mb = 5
 
#             if file_size > max_size_mb * 1024 * 1024:
#                 return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})
 
#             file_type = file.content_type
 
#             if file_type in ['image/jpeg', 'image/png']:
#                 try:
#                     image = Image.open(BytesIO(file_content))
#                     if image.mode in ('RGBA', 'P'):
#                         image = image.convert('RGB')
#                     compressed_image_data, _ = compress_image(image)
#                     return compressed_image_data
#                 except Exception as e:
#                     return JsonResponse({'error': f'Error processing image: {str(e)}'})
 
#             elif file_type == 'application/pdf':
#                 try:
#                     compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
#                     return compressed_pdf_data
#                 except Exception as e:
#                     return JsonResponse({'error': f'Error processing PDF: {str(e)}'})
 
#             else:
#                 return JsonResponse({'warn': 'Unsupported file format'})
 
#         return None
 
#     if request.method == 'POST':
#         try:
#             data = request.POST

#             print(data,'data-----------')
           
#             # cheifComplaint = data.get('cheifComplaint', '')
#             # KeyComplaint = data.get('KeyComplaint', '')
#             # History = data.get('History', '')
#             # Examine = data.get('Examine', '')
#             Diagnosis = data.get('Diagnosis', '')
 
#             SearchICDCode = data.get('SearchICDCode', '')
#             SearchDescription = data.get('SearchDescription', '')
#             SearchDiagnosis = data.get('SearchDiagnosis', '')
 
#             # Get files from request.FILES instead of request.POST
#             ChooseDocument = request.FILES.get('ChooseDocument', None)
#             currentAnnotation = request.FILES.get('currentAnnotation', None)
 
#             DiseaseDetails = data.get('DiseaseDetails', None)
#             diseasedata = json.loads(DiseaseDetails) if DiseaseDetails else []
            
#             created_by = data.get('Createdby', '')
#             Type = data.get('Type', '')
#             registration_id = data.get('RegistrationId', '')

#             KeyComplaint_list = request.POST.get('KeyComplaint', '')
#             KeyComplaint_ids = KeyComplaint_list.split(',') if KeyComplaint_list else []
            
#             ChiefComplaint_list = request.POST.get('cheifComplaint', '') 
#             ChiefComplaint_ids = ChiefComplaint_list.split(',') if ChiefComplaint_list else []

#             History_list = request.POST.get('History', '')
#             History_ids = History_list.split(',') if History_list else []

#             Examination_list = request.POST.get('Examine', '')
#             Examination_ids = Examination_list.split(',') if Examination_list else []

            
#             print(registration_id,'registration_id')
#             processedChooseDocument = validate_and_process_file(ChooseDocument) if ChooseDocument else None
#             processedcurrentAnnotation = validate_and_process_file(currentAnnotation) if currentAnnotation else None
 
#             registration_ins = None
#             Ip_registration_ins = None

#             try:
#                 registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
#             except Patient_Appointment_Registration_Detials.DoesNotExist:
#                 pass

#             try:
#                 Ip_registration_ins = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
#             except Patient_IP_Registration_Detials.DoesNotExist:
#                 pass

#             if not registration_ins and not Ip_registration_ins:
#                 return JsonResponse({'error': 'No registration found with this ID'})

#             print('aaaaaaaaaa')
           
#             # Primary_ins = PrimaryComplaintMaster.objects.filter(pk=KeyComplaint) if KeyComplaint else None
#             # ChiefComplaint_ins = ChiefComplaintMaster.objects.filter(pk=cheifComplaint) if cheifComplaint else None
#             # History_ins = HistoryMaster.objects.filter(pk=History) if History else None
#             # Examination_ins = ExaminationMaster.objects.filter(pk=Examine) if Examine else None
            
#             Primary_ins = PrimaryComplaintMaster.objects.filter(pk__in=KeyComplaint_ids) if KeyComplaint_ids else None
#             ChiefComplaint_ins = ChiefComplaintMaster.objects.filter(pk__in=ChiefComplaint_ids) if ChiefComplaint_ids else None
#             History_ins = HistoryMaster.objects.filter(pk__in=History_ids) if History_ids else None
#             Examination_ins = ExaminationMaster.objects.filter(pk__in=Examination_ids) if Examination_ids else None
            
#             print('qqqqqqqqqqq')
#             print(Primary_ins,'Primary_ins')
# #            Field Type	Use .get() or .filter()?
# #            ForeignKey	✅ Use .get() (only one object)
# #            ManyToManyField	✅ Use .filter() and .set() after saving
#             GeneralEvaluation_instance = Workbench_GeneralEvaluation(
#                 Registration_Id=registration_ins,
#                 IP_RegistrationId=Ip_registration_ins,
#                 # KeyComplaint=Primary_ins,
#                 Diagnosis=Diagnosis,
#                 ICDCode=SearchICDCode,
#                 ICDCode_Description=SearchDescription,
#                 ICDCode_Diagnosis=SearchDiagnosis,
#                 DiseaseDetails=diseasedata,
#                 ChooseDocument=processedChooseDocument,
#                 AnnotationDocument=processedcurrentAnnotation,
#                 created_by=created_by,
#                 Type=Type,
#             )
#             GeneralEvaluation_instance.save()

#             # Now add ManyToMany fields
#             if Primary_ins:
#                 GeneralEvaluation_instance.KeyComplaint.set(Primary_ins)

#             if ChiefComplaint_ins:
#                 GeneralEvaluation_instance.CheifComplaint.set(ChiefComplaint_ins)

#             if History_ins:
#                 GeneralEvaluation_instance.History.set(History_ins)

#             if Examination_ins:
#                 GeneralEvaluation_instance.Examine.set(Examination_ins)

#             for disease_item in diseasedata:
#                 disease_name = disease_item.get('DiseaseName', '')
#                 is_chronicle = disease_item.get('IsChronicle', '')
#                 is_communicable = disease_item.get('IsCommunicable', '')

#                 DiseaseDetails_instance = EvaluationDiseaseDetail(
#                     Evaluation=GeneralEvaluation_instance,
#                     DiseaseName=disease_name,
#                     IsChronicle=is_chronicle,
#                     IsCommunicable=is_communicable,
#                     CreatedBy=created_by
#                 )
#                 DiseaseDetails_instance.save()

#             # DiseaseDetails_instance = EvaluationDiseaseDetail (
#             #     Evaluation=GeneralEvaluation_instance,
#             #     DiseaseName=disease,
#             #     IsCommunicable = IsCommunicable,
#             #     IsChronicle = Ischronicle,
#             #     CreatedBy = CreatedBy
#             # )
#             # DiseaseDetails_instance.save()

#             return JsonResponse({'success': 'GeneralEvaluation Details added successfully'})
       
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
   
#     elif request.method == 'GET':
#         # ... (GET logic remains unchanged) ...
#         try:
#             def get_file_image(filedata):
#                 kind = filetype.guess(filedata)
#                 contenttype1 = 'application/pdf'  # Default
#                 if kind and kind.mime == 'image/jpeg':
#                     contenttype1 = 'image/jpeg'
#                 elif kind and kind.mime == 'image/png':
#                     contenttype1 = 'image/png'
#                 return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
           
#             registration_id = request.GET.get('RegistrationId')
            
#             registration_ins = None
#             Ip_registration_ins = None

#             try:
#                 registration_ins = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=registration_id)
#             except Patient_Appointment_Registration_Detials.DoesNotExist:
#                 pass

#             try:
#                 Ip_registration_ins = Patient_IP_Registration_Detials.objects.get(Registration_Id=registration_id)
#             except Patient_IP_Registration_Detials.DoesNotExist:
#                 pass

#             if not registration_ins and not Ip_registration_ins:
#                 return JsonResponse({'error': 'No registration found with this ID'})

#             GeneralEvaluation = Workbench_GeneralEvaluation.objects.filter(Q(Registration_Id=registration_ins) | Q(IP_RegistrationId=Ip_registration_ins))
           
#             GeneralEvaluation_data = [
#                 {
#                     'id': item.Id,
#                     # 'RegistrationId': getattr(item.Registration_Id, 'pk', '') or getattr(item.IP_RegistrationId, 'pk', ''),
#                     # 'RegistrationId': item.Registration_Id.pk if item.Registration_Id else item.IP_RegistrationId.pk if item.IP_RegistrationId else '',

#                     'RegistrationId': item.Registration_Id.pk if item.Registration_Id else item.IP_RegistrationId.pk if item.IP_RegistrationId else '',
#                     'VisitId': item.Registration_Id.VisitId if item.Registration_Id else '',
#                     # 'PrimaryDoctorId': item.Registration_Id.PrimaryDoctor.Doctor_ID,
#                     # 'PrimaryDoctorName': item.Registration_Id.PrimaryDoctor.ShortName,
#                     # 'KeyComplaint': {
#                     #     'id': item.KeyComplaint.pk,
#                     #     'name': item.KeyComplaint.PrimaryComplaintName,
#                     # } if item.KeyComplaint else None,

#                     'KeyComplaint': list(item.KeyComplaint.values('id', 'PrimaryComplaintName')),
#                     'cheifComplaint': list(item.CheifComplaint.values('id', 'ChiefComplaintName')),
#                     'History': list(item.History.values('id', 'HistoryName')),
#                     'Examine': list(item.Examine.values('id', 'ExaminationName')),

#                     'Diagnosis': item.Diagnosis,
#                     'SearchICDCode': item.ICDCode,
#                     'SearchDescription': item.ICDCode_Description,
#                     'SearchDiagnosis': item.ICDCode_Diagnosis,
#                     'ChooseDocument': get_file_image(item.ChooseDocument) if item.ChooseDocument else None,
#                     'currentAnnotation': get_file_image(item.AnnotationDocument) if item.AnnotationDocument else None,
#                     'DiseaseDetails': item.DiseaseDetails,
#                     'created_by': item.created_by,
#                     'Type': item.Type,
#                     'Date': item.created_at.strftime('%Y-%m-%d'),
#                     'Time': item.created_at.strftime('%H:%M:%S'),
#                 } for item in GeneralEvaluation
#             ]
#             for idx, item in enumerate(GeneralEvaluation_data, start=1):
#                 item["sno"] = idx
#             return JsonResponse(GeneralEvaluation_data, safe=False)
 
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
   
#     return JsonResponse({'error': 'Method not allowed'}, status=405)


 
# def Get_Keycomplaint(request):
#     try:
#         data = request.GET.get('KeyComplaint')
#         querys =Q()
#         if data:
#             querys &= Q(KeyComplaint__icontains = data)
#         responsedata =[]
#         keycomplaints = Workbench_GeneralEvaluation.objects.filter(querys).values('KeyComplaint').distinct()[:10]
#         print(keycomplaints,'keycomplaints')
#         for key in keycomplaints:

#             keval= key.get('KeyComplaint')
#             complaints = Workbench_GeneralEvaluation.objects.filter(KeyComplaint = keval).order_by('-created_at').first()
#             print(complaints,'complaints')
#             data={
#                     'id': len(responsedata) +1,
#                     # 'PrimaryDoctorId': complaints.Registration_Id.PrimaryDoctor.Doctor_ID,
#                     # 'PrimaryDoctorName': complaints.Registration_Id.PrimaryDoctor.ShortName,
#                     'KeyComplaint': complaints.KeyComplaint,
#                     'cheifComplaint': complaints.CheifComplaint,
#                     'History': complaints.History,
#                     'Examine': complaints.Examine,
#                     'Diagnosis': complaints.Diagnosis,
#                     'SearchICDCode':complaints.ICDCode,
#                     'SearchDescription':complaints.ICDCode_Description,
#                     'SearchDiagnosis':complaints.ICDCode_Diagnosis,

#                 }
#             responsedata.append(data)
#         return JsonResponse(responsedata, safe=False)
#     except Exception as e:
#         # Log the error and return a 500 Internal Server Error
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)




# def Get_DiseaseName(request):
#     try:
#         diseasename = request.GET.get('Diseasename','')
#         print(diseasename)
#         diseasedata = Disease_Master.objects.all()
#         disease_list = []

#         if diseasename:

#             disease_ins = Disease_Master.objects.filter(DiseaseName=diseasename)
#             print(disease_ins)
#             for datas in disease_ins:
#                 disease_dict = {
#                     'DiseaseCode': datas.DiseaseCode,
#                     'DiseaseName': datas.DiseaseName,
#                     'IsChronicle': datas.IsChronicle,
#                     'IsCommunicable' : datas.IsCommunicable

#                 }
#                 disease_list.append(disease_dict)
#             return JsonResponse(disease_list, safe=False)

#         for datas in diseasedata:

#             disease_dict = {
#                    'DiseaseCode': datas.DiseaseCode,
#                    'DiseaseName': datas.DiseaseName,
#                    'IsChronicle': datas.IsChronicle,
#                    'IsCommunicable' : datas.IsCommunicable

#             }
#             disease_list.append(disease_dict)
   
#         return JsonResponse(disease_list, safe=False)
#     except Exception as e:
#         # Log the error and return a 500 Internal Server Error
#         print(f"An error occurred: {str(e)}")
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)   

# def Get_PrimaryCodes():

#         try:
#             max_code = Disease_Master.objects.all().aggregate(
#                     Max("DiseaseCode")
#                 )["DiseaseCode__max"]

#             if max_code:
#                 new_department_code = (
#                     Generate_Next_Code_3digit(max_code)
#                 )
#             else:
#                 new_department_code = "DMC001"
        
#             return new_department_code 
      
#         except Exception as e:
#             print(f"Error occurred: {str(e)}")
#             return JsonResponse(
#                 {"success": False, "message": "An internal error occurred."}, status=500
#             )

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Disease_master_details(request):

#     if request.method == 'POST':

#         data = json.loads(request.body)
#         DiseaseCode = Get_PrimaryCodes()
#         disease =  data.get('DiseaseName','')
#         Ischronicle = data.get('IsChronicle','')
#         IsCommunicable = data.get('IsCommunicable','')
#         CreatedBy = data.get('CreatedBy','host')

#         existing_name = Disease_Master.objects.filter(DiseaseName=disease).first()

#         if existing_name:
#             return JsonResponse('The name already present',safe=False)
        
#         Disease_ins = Disease_Master(
#             DiseaseCode = DiseaseCode,
#             DiseaseName = disease,
#             IsCommunicable = IsCommunicable,
#             IsChronicle = Ischronicle,
#             CreatedBy = CreatedBy
#         )

#         Disease_ins.save()

#         return JsonResponse('success',safe=False)

#    # emr


import logging
logger = logging.getLogger(__name__)

@csrf_exempt
def workbench_emr_evaluation(request):
    if request.method == "GET":
        registration_id = request.GET.get("RegistrationId")
        print(registration_id, 'reg id ----')

        data = Workbench_EMREvaluation.objects.none()

        if registration_id:
            if registration_id.startswith("IP"):
                data = Workbench_EMREvaluation.objects.filter(
                    IP_RegistrationId__Registration_Id=registration_id
                ).order_by("-created_at")
            elif registration_id.startswith("OP"):
                data = Workbench_EMREvaluation.objects.filter(
                    Registration_Id__Registration_Id=registration_id
                ).order_by("-created_at")

        result = []
        for d in data:
            result.append({
                "Id": d.Id,
                "KeyComplaint": d.KeyComplaint,
                "ChiefComplaint": d.CheifComplaint,
                "History": d.History,
                "Examine": d.Examine,
                "Diagnosis": d.Diagnosis,
                "created_by":d.created_by,
                "ChooseDocument": (
                    f"data:image/jpeg;base64,{base64.b64encode(d.ChooseDocument).decode('utf-8')}"
                    if d.ChooseDocument else None
                ),
                "created_at": d.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return JsonResponse(result, safe=False)

    elif request.method == "POST":
        entry_id = request.POST.get("Id")
        registration_id = request.POST.get("RegistrationId")
        ip_registration_id = request.POST.get("IPRegistrationId")
        created_by = request.POST.get("created_by")

        # Fallback if only one value is sent
        if not ip_registration_id and registration_id and registration_id.startswith("IP"):
            ip_registration_id = registration_id
        if not registration_id and ip_registration_id and ip_registration_id.startswith("OP"):
            registration_id = ip_registration_id

        try:
            file = request.FILES.get("ChooseDocument")
            file_data = file.read() if file else None

            if entry_id:
                # UPDATE mode
                entry = Workbench_EMREvaluation.objects.get(Id=int(entry_id))
                entry.KeyComplaint = request.POST.get("KeyComplaint", entry.KeyComplaint)
                entry.CheifComplaint = request.POST.get("ChiefComplaint", entry.CheifComplaint)
                entry.History = request.POST.get("History", entry.History)
                entry.Examine = request.POST.get("Examine", entry.Examine)
                entry.Diagnosis = request.POST.get("Diagnosis", entry.Diagnosis)
                if file_data:
                    entry.ChooseDocument = file_data
                entry.save()
                return JsonResponse({"success": "Updated successfully"})

            else:
                # CREATE mode
                reg_obj = None
                ip_obj = None

                try:
                    if registration_id:
                        reg_obj = Patient_Appointment_Registration_Detials.objects.get(
                            Registration_Id=registration_id)
                except Exception as e:
                    logger.warning(f"OP registration not found: {str(e)}")

                try:
                    if ip_registration_id:
                        ip_obj = Patient_IP_Registration_Detials.objects.get(
                            Registration_Id=ip_registration_id)
                except Exception as e:
                    logger.warning(f"IP registration not found: {str(e)}")

                if not reg_obj and not ip_obj:
                    return JsonResponse({"error": "Neither OP nor IP registration found"}, status=400)

                Workbench_EMREvaluation.objects.create(
                    Registration_Id=reg_obj,
                    IP_RegistrationId=ip_obj,
                    KeyComplaint=request.POST.get("KeyComplaint"),
                    CheifComplaint=request.POST.get("ChiefComplaint"),
                    History=request.POST.get("History"),
                    Examine=request.POST.get("Examine"),
                    Diagnosis=request.POST.get("Diagnosis"),
                    ChooseDocument=file_data,
                    created_by=created_by,
                    created_at=timezone.now()
                )
                return JsonResponse({"success": "Saved successfully"})

        except Workbench_EMREvaluation.DoesNotExist:
            logger.error(f"Entry with Id {entry_id} does not exist")
            return JsonResponse({"error": f"Entry with Id {entry_id} does not exist"}, status=404)
        except Exception as e:
            logger.error(f"Error in POST workbench_emr_evaluation: {str(e)}\n{traceback.format_exc()}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)