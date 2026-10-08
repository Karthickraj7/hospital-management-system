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
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
# import magic
import filetype
import base64

@transaction.atomic
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

        def compress_image(image, min_quality=10, step=5):
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



@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Pre_Operative_Checklist_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')
            BookingType = data.get('BookingType', '')
            PatientUHID = data.get('PatientUHID', '')
            Allergies = data.get('Allergies', '')
            Dentures = data.get('Dentures', '')
            VitalSigns = data.get('VitalSigns', '')
            Pre_op_medication = data.get('Pre_op_medication', '')
            Nilbymouth = data.get('Nilbymouth', '')
            Consent_for_Procedure_Surgery = data.get('Consent_for_Procedure_Surgery', '')
            High_risk_Consent = data.get('High_risk_Consent', '')
            BloodRequirement = data.get('BloodRequirement', '')
            PreAnaestheticAssessment = data.get('PreAnaestheticAssessment', '')
            Operationtype = data.get('Operationtype', '')
            MarkingofsiteDate = data.get('MarkingofsiteDate', '')
            MarkingofsiteTime = data.get('MarkingofsiteTime', '')
            ConfirmbysurgeonDate = data.get('ConfirmbysurgeonDate', '')
            ConfirmbysurgeonTime = data.get('ConfirmbysurgeonTime', '')

            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None


            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            pre_op_checklist = Pre_Operative_Checklist_OT(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,
                PatientUHID = PatientUHID,
                Allergies = Allergies,
                Dentures = Dentures,
                VitalSigns = VitalSigns,
                Pre_op_medication = Pre_op_medication,
                Nilbymouth = Nilbymouth,
                Consent_for_Procedure_Surgery = Consent_for_Procedure_Surgery,
                High_risk_Consent = High_risk_Consent,
                BloodRequirement = BloodRequirement,
                PreAnaestheticAssessment = PreAnaestheticAssessment,
                Operationtype = Operationtype,
                MarkingofsiteDate = MarkingofsiteDate,
                MarkingofsiteTime = MarkingofsiteTime,
                ConfirmbysurgeonDate = ConfirmbysurgeonDate,
                ConfirmbysurgeonTime = ConfirmbysurgeonTime,
                BookingType = BookingType,
                CreatedBy = created_by,
                
            )

            pre_op_checklist.save()

            return JsonResponse({"success": "Data Saved successfully"})



        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Intra_Post_Operative_Notes_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')
            Procedure = data.get('Procedure', '')
            Intraoperativecomplications = data.get('Intraoperativecomplications', '')
            Bloodloss = data.get('Bloodloss', '')
            Replaced = data.get('Replaced', '')
            Closure = data.get('Closure', '')
            Extubation = data.get('Extubation', '')
            SpecimenHistopathology = data.get('SpecimenHistopathology', '')
            Microbiology = data.get('Microbiology', '')
            Specimen = data.get('Specimen', '')
            Surgicalprocedures = data.get('Surgicalprocedures', '')
            Date = data.get('Date', '')
            Time = data.get('Time', '')
            Patientcondition = data.get('Patientcondition', '')
            BookingType = data.get('BookingType', '')
            drainsData = data.get('drainsData','')

            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None


            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            pre_op_checklist = Intra_Post_Operative_Notes_OT(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,
                Procedure = Procedure,
                Intraoperativecomplications = Intraoperativecomplications,
                Bloodloss = Bloodloss,
                Replaced = Replaced,
                Closure = Closure,
                Extubation = Extubation,
                SpecimenHistopathology = SpecimenHistopathology,
                Microbiology = Microbiology,
                Specimen = Specimen,
                Surgicalprocedures = Surgicalprocedures,
                Date = Date,
                Time = Time,
                Patientcondition = Patientcondition,
                BookingType = BookingType,
                CreatedBy = created_by,
                
            )

            pre_op_checklist.save()

            instance = pre_op_checklist
            print(instance,'instanceinstanceinstance') 

            for datas in drainsData:

                print(datas,'instanceinstance')

                print(datas['type'])
                print(datas['size'])
                print(datas['site'])

                Operative_category_type_ins = Operative_category_type(

                   IntraOp_Id =  instance,
                   Categorytype = datas['type'],
                   Size = datas['size'],
                   Site = datas['site'],
                   CreatedBy = created_by,
                )

                Operative_category_type_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Cataract_Notes_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')
            Eye = data.get('Eye','')
            Surgeryname = data.get('Surgeryname','')
            Incision = data.get('Incision','')
            Siteofincision = data.get('Siteofincision','')
            Capsulorhexis = data.get('Capsulorhexis','')
            NucleusRemoval = data.get('NucleusRemoval','')
            LensImplantation = data.get('LensImplantation','')
            Intraopcomplications = data.get('Intraopcomplications','')
            Postop = data.get('Postop','')
            BookingType = data.get('BookingType','')
            

            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None


            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            Cataract_notes_ins = Cataract_notes(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,
                Eye = Eye,
                Surgeryname = Surgeryname,
                Incision = Incision,
                Siteofincision = Siteofincision,
                Capsulorhexis = Capsulorhexis,
                NucleusRemoval = NucleusRemoval,
                LensImplantation = LensImplantation,
                Intraopcomplications = Intraopcomplications,
                Postop = Postop,     
                BookingType = BookingType,
                CreatedBy = created_by,
                
            )

            Cataract_notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def DCR_Notes_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')
            Eye = data.get('Eye','')
            Surgeryname = data.get('Surgeryname','')
            Operationnotes = data.get('OperationNotes','')



            

            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None


            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            DCR_notes_ins = DCR_notes(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,
                Eye = Eye,
                Surgeryname = Surgeryname,
                Operationnotes = Operationnotes
        
            )

            DCR_notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Terigium_Notes_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')
            Eye = data.get('Eye','')
            NameoftheSurgery = data.get('Surgeryname','')
            OperationNotes = data.get('OperationNotes','')



            

            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None


            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            Terigium_notes_ins = Terigium_notes(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,
                Eye = Eye,
                Surgeryname = NameoftheSurgery,
                Operationnotes = OperationNotes
        
            )

            Terigium_notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Neuro_Notes_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')
            PostOpInstructions = data.get('PostOpInstructions','')
            Surgeryname = data.get('Surgeryname','')
            Operationnotes = data.get('Operationnotes','')

            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None

            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            Neuro_notes_ins = Neuro_Surgery_notes(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,
                PostOpInstructions = PostOpInstructions,
                Surgeryname = Surgeryname,
                Operationnotes = Operationnotes
        
            )

            Neuro_notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Labour_delivery_Notes_OT_Details(request):

    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')
            Labourtype = data.get('Labourtype','')
            Duration1 = data.get('Duration1','')
            Duration2 = data.get('Duration2','')
            Duration3 = data.get('Duration3','')
            DeliveryDate = data.get('DeliveryDate','')
            DeliveryTime = data.get('DeliveryTime','')
            Gender = data.get('Gender','')
            DeliveryWt = data.get('DeliveryWt','')
            APGARscore = data.get('APGARscore','')
            Type = data.get('Type','')
            Complications = data.get('Complications','')
            Babybloodgroup = data.get('Babybloodgroup','')
            Placenta_Membranes = data.get('Placenta_Membranes','')
            MembranesCondition = data.get('MembranesCondition','')
            PlacentaCondition = data.get('PlacentaCondition','')
            Conductedby = data.get('Conductedby','')
            Assistedby = data.get('Assistedby','')
            Anaesthesiologist = data.get('Anaesthesiologist','')
            LabourAnalgesia = data.get('LabourAnalgesia','')
            PPH = data.get('PPH','')
            Amount = data.get('Amount','')
            Laceration = data.get('Laceration','')
            Episiotomy = data.get('Episiotomy','')
            EpisiotomyMaterial = data.get('EpisiotomyMaterial','')
            ProphylacticOxytocic = data.get('ProphylacticOxytocic','')
            Pulse = data.get('Pulse','')
            BP = data.get('BP','')
            Uterus = data.get('Uterus','')
            BleedingPV=data.get('BleedingPV','')
            PostDeleiveryOrders = data.get('PostDeleiveryOrders','')
            BeforeWT = data.get('BeforeWT','')
            BeforeHC = data.get('BeforeHC','')
            Length = data.get('Length','')
            Anomalies = data.get('Anomalies','')
            Remarks = data.get('Remarks','')
            PaediatricianRecord = data.get('PaediatricianRecord','')



            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None

            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None
            Babybloodgroup_ins = BloodGroup_Detials.objects.get(BloodGroup_Id=Babybloodgroup) if Babybloodgroup else None

            delivery_Notes_ins = Labour_and_Delivery_notes(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,
                Labourtype = Labourtype,
                Duration1 = Duration1,
                Duration2 = Duration2,
                Duration3 = Duration3,
                DeliveryDate = DeliveryDate,
                DeliveryTime = DeliveryTime,
                Gender = Gender,
                DeliveryWt = DeliveryWt,
                APGARscore = APGARscore,
                Type = Type,
                Complications = Complications,
                Babybloodgroup = Babybloodgroup_ins,
                Placenta_Membranes = Placenta_Membranes,
                MembranesCondition = MembranesCondition,
                PlacentaCondition = PlacentaCondition,
                Conductedby =Conductedby,
                Assistedby = Assistedby,
                Anaesthesiologist = Anaesthesiologist,
                LabourAnalgesia = LabourAnalgesia,
                PPH =  PPH,
                Amount = Amount,
                Laceration = Laceration,
                Episiotomy = Episiotomy,
                EpisiotomyMaterial = EpisiotomyMaterial,
                ProphylacticOxytocic = ProphylacticOxytocic,
                Pulse = Pulse,
                BP = BP,
                Uterus = Uterus,
                BleedingPV = BleedingPV,
                PostDeleiveryOrders = PostDeleiveryOrders,
                BeforeWT = BeforeWT,
                BeforeHC = BeforeHC,
                Length = Length,
                Anomalies = Anomalies,
                Remarks = Remarks,
                PaediatricianRecord = PaediatricianRecord,

            )

            delivery_Notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':

        RegistrationId = request.GET.get('RegistrationId', None)
        BookingType = request.GET.get('BookingType', None)

        op_reg_ins = None
        ip_reg_ins = None
        emg_reg_ins = None


        if BookingType == 'IP':

            IPList = []
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            Labnotesins = Labour_and_Delivery_notes.objects.filter(IP_Registration_Id= ip_reg_ins)

            IPList = []
            for index, Lab in enumerate(Labnotesins):
                datalist = {
                    'sno': index + 1,  # Adding serial number starting from 1
                    'Labourtype': Lab.Labourtype,
                    'Duration1': Lab.Duration1,
                    'Duration2': Lab.Duration2,
                    'Duration3': Lab.Duration3,
                    'DeliveryDate': Lab.DeliveryDate,
                    'DeliveryTime': Lab.DeliveryTime,
                    'Gender': Lab.Gender,
                    'DeliveryWt': Lab.DeliveryWt,
                    'APGARscore': Lab.APGARscore,
                    'Type': Lab.Type,
                    'Complications': Lab.Complications,
                    'Babybloodgroup': Lab.Babybloodgroup.BloodGroup_Id,
                    'Babybloodgroupname': Lab.Babybloodgroup.BloodGroup_Name,
                    'Placenta_Membranes': Lab.Placenta_Membranes,
                    'MembranesCondition': Lab.MembranesCondition,
                    'PlacentaCondition': Lab.PlacentaCondition,
                    'Conductedby': Lab.Conductedby,
                    'Assistedby': Lab.Assistedby,
                    'Anaesthesiologist': Lab.Anaesthesiologist,
                    'LabourAnalgesia': Lab.LabourAnalgesia,
                    'PPinfrastrutture': Lab.PPH,
                    'Amount': Lab.Amount,
                    'Laceration': Lab.Laceration,
                    'Episiotomy': Lab.Episiotomy,
                    'EpisiotomyMaterial': Lab.EpisiotomyMaterial,
                    'ProphylacticOxytocic': Lab.ProphylacticOxytocic,
                    'Pulse': Lab.Pulse,
                    'Uterus': Lab.Uterus,
                    'BleedingPV' : Lab.BleedingPV,
                    'PostDeleiveryOrders' : Lab.PostDeleiveryOrders,
                    'BeforeWT' : Lab.BeforeWT,
                    'BeforeHC' : Lab.BeforeHC,
                    'Length' : Lab.Length,
                    'Anomalies' : Lab.Anomalies,
                    'Remarks' : Lab.Remarks,
                    'PaediatricianRecord' : Lab.PaediatricianRecord,
                    'CreatedBy' : Lab.CreatedBy,
                    'RegisterId': Lab.IP_Registration_Id.Registration_Id,
                    'PatientName': f"{Lab.Patientid.FirstName} {Lab.Patientid.MiddleName} {Lab.Patientid.SurName}",
                }
                IPList.append(datalist)

            return JsonResponse(IPList, safe=False)



@csrf_exempt
@require_http_methods(["GET"])
def OTConfirmedpatient_details_for_OtAnaesthesia(request):


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
                       
                       anaesthesiologistId = [anaesthesiologis.Doctor_ID for anaesthesiologis in crew_ins.Anaesthesiologist.all()]
    

                       if Doctorid in anaesthesiologistId:

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
                                        'patientId': datas.OP_Registration_Id.PatientId.PatientId,
                                        'PatientName':datas.OP_Registration_Id.PatientId.FirstName,
                                        'PatientCategory' : datas.OP_Registration_Id.PatientCategory,
                                        'BloodGroup' : datas.OP_Registration_Id.PatientId.BloodGroup.BloodGroup_Name if datas.OP_Registration_Id.PatientId.BloodGroup else None,
                                        'Age':datas.OP_Registration_Id.PatientId.Age,
                                        'Gender':datas.OP_Registration_Id.PatientId.Gender,
                                        'UHIDNO':datas.OP_Registration_Id.PatientId.UniqueIdNo,
                                        'Status':datas.Status,
                                        'Reason' : datas.Reason,
                                        'CreatedBy':datas.CreatedBy,
                                         'DoctorConfirm': datas.DoctorConfirm,
                                        'RegistrationId' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
                                       
                                    }
                                completed_list.append(data_list)
                    elif  datas.BookingType == 'IP':

                       crew_ins = Surgical_Team_Details.objects.get(IP_Registration_Id=datas.IP_Registration_Id)
                       
                       anaesthesiologistId = [anaesthesiologis.Doctor_ID for anaesthesiologis in crew_ins.Anaesthesiologist.all()]
                  
                       


                       if Doctorid in anaesthesiologistId:
                            
                
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
                                'patientId': datas.IP_Registration_Id.PatientId.PatientId,
                                'PatientName':datas.IP_Registration_Id.PatientId.FirstName,
                                'PatientCategory' : datas.IP_Registration_Id.PatientCategory,
                                'BloodGroup' : datas.IP_Registration_Id.PatientId.BloodGroup.BloodGroup_Name if datas.IP_Registration_Id.PatientId.BloodGroup else None,
                                'Age':datas.IP_Registration_Id.PatientId.Age,
                                'Gender':datas.IP_Registration_Id.PatientId.Gender,
                                'UHIDNO':datas.IP_Registration_Id.PatientId.UniqueIdNo,
                                'Status':datas.Status,
                                'Reason' : datas.Reason,
                                'CreatedBy':datas.CreatedBy,
                                 'DoctorConfirm': datas.DoctorConfirm,
                                'RegistrationId' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                                

                            }
                            completed_list.append(data_list)
                    elif  datas.BookingType == 'EMERGENCY':

                        crew_ins = Surgical_Team_Details.objects.get(EMR_Registration_Id=datas.EMR_Registration_Id)

                        anaesthesiologistId = [anaesthesiologis.Doctor_ID for anaesthesiologis in crew_ins.Anaesthesiologist.all()]
                        
                        if Doctorid in anaesthesiologistId:
                
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
                                'patientId': datas.EMR_Registration_Id.PatientId.PatientId,
                                'PatientName':datas.EMR_Registration_Id.PatientId.FirstName,
                                'PatientCategory' : datas.EMR_Registration_Id.PatientCategory,
                                'BloodGroup' : datas.EMR_Registration_Id.PatientId.BloodGroup.BloodGroup_Name if datas.EMR_Registration_Id.PatientId.BloodGroup else None,
                                'Age':datas.EMR_Registration_Id.PatientId.Age,
                                'Gender':datas.EMR_Registration_Id.PatientId.Gender,
                                'UHIDNO':datas.EMR_Registration_Id.PatientId.UniqueIdNo,
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
@require_http_methods(["POST","OPTIONS","GET"])
def Anaesthesia_Pre_Operative_Checklist_Details(request):

        
    if request.method == 'POST':

        try:

            data = json.loads(request.body)

             # print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')
            Concerns = data.get('Concerns', '')  
            ClinicalDiagnosis = data.get('ClinicalDiagnosis', '')  
            ProcedureDate = data.get('ProcedureDate', '')  
            LMP = data.get('LMP', '')  
            Pregnant = data.get('Pregnant', '')  
            PregnantWeeks = data.get('PregnantWeeks', '')  
            Hypertension = data.get('Hypertension', '')  
            Diabetes = data.get('Diabetes', '')  
            Asthma = data.get('Asthma', '')  
            Allergy = data.get('Allergy', '')  
            Hyphothyroid = data.get('Hyphothyroid', '')  
            Epilepsy = data.get('Epilepsy', '')  
            IHD = data.get('IHD', '')  
            Smoking = data.get('Smoking', '')  
            PreProSurgery = data.get('PreProSurgery', '')  
            Medications = data.get('Medications', '')  
            Antiplatelets = data.get('Antiplatelets', '')  
            Relevanthistory = data.get('Relevanthistory', '')  
            Icterus = data.get('Icterus', '')  
            Pallor = data.get('Pallor', '')  
            Cyanosis = data.get('Cyanosis', '')  
            Clubbing = data.get('Clubbing', '')  
            Odema = data.get('Odema', '')  
            AirwayDentition = data.get('AirwayDentition', '')  
            Thyroid = data.get('Thyroid', '')  
            Spine = data.get('Spine', '')  
            MouthOpening = data.get('MouthOpening', '')  
            Mallampattigrade = data.get('Mallampattigrade', '')
            OSAScore = data.get('OSAScore', '')
            FunctionalLimitation = data.get('FunctionalLimitation', '')
            Mentohyoiddistance = data.get('Mentohyoiddistance', '')
            NeckMovements = data.get('NeckMovements', '')
            NeckCircumference = data.get('NeckCircumference', '')
            Pulse = data.get('Pulse', '')
            BP = data.get('BP', '')
            RR = data.get('RR', '')
            Temparature = data.get('Temparature', '')
            Weight = data.get('Weight', '')
            CVS = data.get('CVS', '')
            RS = data.get('RS', '')
            GIT = data.get('GIT', '')
            CNS = data.get('CNS', '')
            BreathHoldingTime = data.get('BreathHoldingTime', '')
            EffortTolerance = data.get('EffortTolerance', '')
            OtherRelevantFindings = data.get('OtherRelevantFindings', '')
            AnaesthesiaPlanned = data.get('AnaesthesiaPlanned', '')
            PreOpinion = data.get('PreOpinion', '')
            PostOperativeAnalgesiaPlanned = data.get('PostOperativeAnalgesiaPlanned', '')
            ASACategory = data.get('ASACategory', '')
            AnticipatedPostAnaesthesiaCare = data.get('AnticipatedPostAnaesthesiaCare', '')
            Nilbymouth = data.get('Nilbymouth', '')
            unitsBloodReserved = data.get('unitsBloodReserved', '')
            Premedication = data.get('Premedication', '')
            OtherSpecificinstructions = data.get('OtherSpecificinstructions', '')
            Name = data.get('Name', '')
            Date = data.get('Date', '')
            Time = data.get('Time', '')

           
            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None

            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            Anaesthesia_Pre_Notes_ins = Anaesthesia_Pre_Operative_Checklist(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,
                Concerns = Concerns , 
                ClinicalDiagnosis = ClinicalDiagnosis , 
                ProcedureDate = ProcedureDate,  
                LMP = LMP  ,
                Pregnant = Pregnant,  
                PregnantWeeks = PregnantWeeks , 
                Hypertension = Hypertension , 
                Diabetes = Diabetes  ,
                Asthma = Asthma,  
                Allergy = Allergy,  
                Hyphothyroid = Hyphothyroid , 
                Epilepsy = Epilepsy,  
                IHD = IHD,  
                Smoking = Smoking,  
                PreProSurgery = PreProSurgery,  
                Medications = Medications,  
                Antiplatelets = Antiplatelets,  
                Relevanthistory = Relevanthistory,  
                Icterus = Icterus,  
                Pallor = Pallor,  
                Cyanosis = Cyanosis,  
                Clubbing = Clubbing,  
                Odema = Odema,  
                AirwayDentition = AirwayDentition,  
                Thyroid = Thyroid,  
                Spine = Spine,  
                MouthOpening = MouthOpening,  
                Mallampattigrade = Mallampattigrade,
                OSAScore = OSAScore,
                FunctionalLimitation = FunctionalLimitation,
                Mentohyoiddistance = Mentohyoiddistance,
                NeckMovements = NeckMovements,
                NeckCircumference = NeckCircumference,
                Pulse = Pulse,
                BP = BP,
                RR = RR,
                Temparature = Temparature,
                Weight = Weight,
                CVS = CVS,
                RS = RS,
                GIT = GIT,
                CNS = CNS,
                BreathHoldingTime = BreathHoldingTime,
                EffortTolerance = EffortTolerance,
                OtherRelevantFindings = OtherRelevantFindings,
                AnaesthesiaPlanned = AnaesthesiaPlanned,
                PreOpinion = PreOpinion,
                PostOperativeAnalgesiaPlanned = PostOperativeAnalgesiaPlanned,
                ASACategory = ASACategory,
                AnticipatedPostAnaesthesiaCare = AnticipatedPostAnaesthesiaCare,
                Nilbymouth = Nilbymouth,
                unitsBloodReserved = unitsBloodReserved,
                Premedication = Premedication,
                OtherSpecificinstructions = OtherSpecificinstructions,
                Name = Name,
                Date = Date,
                Time = Time,


            )

            Anaesthesia_Pre_Notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Anaesthesia_Post_Operative_Checklist_Details(request):

        
    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')

            ConsciousnessLevel = data.get('ConsciousnessLevel', '')
            Reflexes = data.get('Reflexes', '')
            Headlift = data.get('Headlift', '')
            PR = data.get('PR', '')
            BP = data.get('BP', '')
            RR = data.get('RR', '')
            SPO2 = data.get('SPO2', '')
            PatientTransferred = data.get('PatientTransferred', '')
            AdverseEvents = data.get('AdverseEvents', '')
            Name = data.get('Name', '')
            Date = data.get('Date', '')
            Time = data.get('Time', '')

           

           
            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None

            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            Anaesthesia_Post_Notes_ins = Anaesthesia_Post_Operative_Checklist(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,
                ConsciousnessLevel = ConsciousnessLevel,  
                Reflexes = Reflexes,  
                Headlift = Headlift,  
                PR = PR,  
                BP = BP,  
                RR = RR,  
                SPO2 = SPO2,  
                PatientTransferred = PatientTransferred,  
                AdverseEvents = AdverseEvents,  
                Name = Name,  
                Date = Date,  
                Time = Time,
            )

            Anaesthesia_Post_Notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def Anaesthesia_Intra_Operative_Checklist_Details(request):

        
    if request.method == 'POST':

        try:

            data = json.loads(request.body)

            print(data, 'data')

            Patientid = data.get('Patientid', '')
            RegistrationId = data.get('RegistrationId', '')
            created_by = data.get('created_by', '')
            DoctorId = data.get('DoctorId', '')           
            BookingType = data.get('BookingType','')

            Name1 = data.get('Name1', ' ')
            Anaesthesiaplan = data.get('Anaesthesiaplan', ' ')
            Proceduresurgery = data.get('Proceduresurgery', ' ')
            Anaesmachinecheck = data.get('Anaesmachinecheck', False)
            Pulseoximeter = data.get('Pulseoximeter', False)
            KnownAllergy = data.get('KnownAllergy', ' ')
            DifficultAirway = data.get('DifficultAirway', ' ')
            Aspirationrisk = data.get('Aspirationrisk', ' ')
            Bloodlossrisk = data.get('Bloodlossrisk', ' ')
            HR = data.get('HR', ' ')
            BP = data.get('BP', ' ')
            RR = data.get('RR', ' ')
            SPO2 = data.get('SPO2', ' ')
            Airways = data.get('Airways', ' ')
            Generaltype = data.get('Generaltype', ' ')
            Size = data.get('Size', ' ')
            Cuff = data.get('Cuff', ' ')
            CLGrade = data.get('CLGrade', ' ')
            Attempts = data.get('Attempts', ' ')
            Intubation = data.get('Intubation', ' ')
            Ventilation = data.get('Ventilation', ' ')
            GeneralVt = data.get('GeneralVt', ' ')
            GeneralRR = data.get('GeneralRR', ' ')
            GenralMV = data.get('GenralMV', ' ')
            GeneralPIP = data.get('GeneralPIP', ' ')
            GeneralPEEP = data.get('GeneralPEEP', ' ')
            GeneralTDV = data.get('GeneralTDV', ' ')
            GeneralRatio = data.get('GeneralRatio', ' ')
            GeneralMode = data.get('GeneralMode', ' ')
            GeneralCircuit = data.get('GeneralCircuit', ' ')
            GeneralMap = data.get('GeneralMap', ' ')
            TourniquestApplied = data.get('TourniquestApplied', ' ')
            TourniquestRemoved = data.get('TourniquestRemoved', ' ')
            Technique = data.get('Technique', ' ')
            Needle = data.get('Needle', ' ')
            Space = data.get('Space', ' ')
            Drug = data.get('Drug', ' ')
            Onsetofaction = data.get('Onsetofaction', ' ')
            Sensorylevel = data.get('Sensorylevel', ' ')
            Motorlevel = data.get('Motorlevel', ' ')
            EA = data.get('EA', ' ')
            TestDose = data.get('TestDose', ' ')
            LocalAnaesthesia = data.get('LocalAnaesthesia', ' ')
            TopicalAnaesthesia = data.get('TopicalAnaesthesia', ' ')
            Intravenous = data.get('Intravenous', ' ')
            IntraMuscular = data.get('IntraMuscular', ' ')
            Intrathecal = data.get('Intrathecal', ' ')
            Inhalational = data.get('Inhalational', ' ')
            PressurePointsPadded = data.get('PressurePointsPadded', ' ')
            EyesCovered = data.get('EyesCovered', ' ')
            ThroatPack = data.get('ThroatPack', ' ')
            IntraOperativeEvents = data.get('IntraOperativeEvents', ' ')
            Name2 = data.get('Name2', ' ')
            Date = data.get('Date', None)
            Time = data.get('Time', None)


            if Anaesmachinecheck == 'on':
                    Anaesmachinecheck = True

            if Pulseoximeter == 'on':

                Pulseoximeter = True

           

           
            op_reg_ins = None
            ip_reg_ins = None
            emg_reg_ins = None

            Patientins = Patient_Detials.objects.get(PatientId = Patientid) if Patientid else None
            if BookingType == 'OP':
                op_reg_ins = Patient_Appointment_Registration_Detials.objects.filter(pk=RegistrationId).first() if RegistrationId else None
            ip_reg_ins = Patient_IP_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            emg_reg_ins = Patient_Emergency_Registration_Detials.objects.filter(Registration_Id = RegistrationId).first() if RegistrationId else None
            DoctorIdins = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID = DoctorId).first() if DoctorId else None

            Anaesthesia_Intra_Notes_ins = Anaesthesia_Intra_Operative_Checklist(

                Patientid = Patientins,
                OP_Registration_Id = op_reg_ins,
                IP_Registration_Id = ip_reg_ins,
                EMR_Registration_Id = emg_reg_ins,
                DoctorId = DoctorIdins,     
                BookingType = BookingType,
                CreatedBy = created_by,

                Name1 = Name1,  
                Anaesthesiaplan = Anaesthesiaplan,  
                Proceduresurgery = Proceduresurgery,  
                Anaesmachinecheck = Anaesmachinecheck,  
                Pulseoximeter = Pulseoximeter,  
                KnownAllergy = KnownAllergy,  
                DifficultAirway = DifficultAirway,  
                Aspirationrisk = Aspirationrisk,  
                Bloodlossrisk = Bloodlossrisk,  
                HR = HR,  
                BP = BP,  
                RR = RR,  
                SPO2 = SPO2,  
                Airways = Airways,  
                Generaltype = Generaltype,  
                Size = Size,  
                Cuff = Cuff,  
                CLGrade = CLGrade,  
                Attempts = Attempts,  
                Intubation = Intubation,  
                Ventilation = Ventilation,  
                GeneralVt = GeneralVt,  
                GeneralRR = GeneralRR,  
                GenralMV = GenralMV,  
                GeneralPIP = GeneralPIP,  
                GeneralPEEP = GeneralPEEP,  
                GeneralTDV = GeneralTDV,  
                GeneralRatio = GeneralRatio,  
                GeneralMode = GeneralMode,  
                GeneralCircuit = GeneralCircuit,  
                GeneralMap = GeneralMap,  
                TourniquestApplied = TourniquestApplied,  
                TourniquestRemoved = TourniquestRemoved,  
                Technique = Technique,  
                Needle = Needle,  
                Space = Space,  
                Drug = Drug,  
                Onsetofaction = Onsetofaction,  
                Sensorylevel = Sensorylevel,  
                Motorlevel = Motorlevel,  
                EA = EA,  
                TestDose = TestDose,  
                LocalAnaesthesia = LocalAnaesthesia,  
                TopicalAnaesthesia = TopicalAnaesthesia,  
                Intravenous = Intravenous,  
                IntraMuscular = IntraMuscular,  
                Intrathecal = Intrathecal,  
                Inhalational = Inhalational,  
                PressurePointsPadded = PressurePointsPadded,  
                EyesCovered = EyesCovered,  
                ThroatPack = ThroatPack,  
                IntraOperativeEvents = IntraOperativeEvents,  
                Name2 = Name2,  
                Date = Date,  
                Time = Time,  

                
            )

            Anaesthesia_Intra_Notes_ins.save()

            return JsonResponse({"success": "Data Saved successfully"})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def OTConfirmedpatient_details_for_OtNurse(request):
 
 
    if request.method == 'GET':
 
        try:
            status = request.GET.get('status','')
            Employeeid = request.GET.get('Employeeid','')
 
            if status :
 
                pat_ins = Theatre_Booking_Request_Details.objects.filter(Status = status)
                # print(pat_ins)
                completed_list = []
 
                for datas in pat_ins:
 
                    formatted_rdate =  datas.ReqDate.strftime('%d-%m-%y')                  
                    formatted_bdate = datas.BookingDate.strftime('%d-%m-%y')
 
                    if datas.BookingType == 'OP':
                       
                   
 
                       crew_ins = Surgical_Team_Details.objects.get(OP_Registration_Id=datas.OP_Registration_Id)
                       
                       scrubNurseId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Scrub_Nurse.all())
                       scrubNurse = ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Scrub_Nurse.all())
 
                       circulatingNurseId= ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Circulating_Nurse.all())
                       circulatingNurse= ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Circulating_Nurse.all())
 
 
                       merged_nurse_ids = scrubNurseId + circulatingNurseId
   
 
                       if Employeeid in merged_nurse_ids:
 
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
                                        'patientId': datas.OP_Registration_Id.PatientId.PatientId,
                                        'PatientName':datas.OP_Registration_Id.PatientId.FirstName,
                                        'PatientCategory' : datas.OP_Registration_Id.PatientCategory,
                                        'BloodGroup' : datas.OP_Registration_Id.PatientId.BloodGroup.BloodGroup_Name if datas.OP_Registration_Id.PatientId.BloodGroup else None,
                                        'Age':datas.OP_Registration_Id.PatientId.Age,
                                        'Gender':datas.OP_Registration_Id.PatientId.Gender,
                                        'UHIDNO':datas.OP_Registration_Id.PatientId.UniqueIdNo,
                                        'Status':datas.Status,
                                        'Reason' : datas.Reason,
                                        'CreatedBy':datas.CreatedBy,
                                         'DoctorConfirm': datas.DoctorConfirm,
                                        'RegistrationId' : datas.OP_Registration_Id.id if datas.OP_Registration_Id else None,
                                       
                                    }
                                completed_list.append(data_list)
                    elif  datas.BookingType == 'IP':
 
                       crew_ins = Surgical_Team_Details.objects.get(IP_Registration_Id=datas.IP_Registration_Id)
                       
                       scrubNurseId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Scrub_Nurse.all())
                       scrubNurse = ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Scrub_Nurse.all())
 
                       circulatingNurseId= ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Circulating_Nurse.all())
                       circulatingNurse= ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Circulating_Nurse.all())
 
 
                       merged_nurse_ids = scrubNurseId + circulatingNurseId
                 
                       
 
 
                       if Employeeid in merged_nurse_ids:
                           
               
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
                                'patientId': datas.IP_Registration_Id.PatientId.PatientId,
                                'PatientName':datas.IP_Registration_Id.PatientId.FirstName,
                                'PatientCategory' : datas.IP_Registration_Id.PatientCategory,
                                'BloodGroup' : datas.IP_Registration_Id.PatientId.BloodGroup.BloodGroup_Name if datas.IP_Registration_Id.PatientId.BloodGroup else None,
                                'Age':datas.IP_Registration_Id.PatientId.Age,
                                'Gender':datas.IP_Registration_Id.PatientId.Gender,
                                'UHIDNO':datas.IP_Registration_Id.PatientId.UniqueIdNo,
                                'Status':datas.Status,
                                'Reason' : datas.Reason,
                                'CreatedBy':datas.CreatedBy,
                                 'DoctorConfirm': datas.DoctorConfirm,
                                'RegistrationId' : datas.IP_Registration_Id.Registration_Id if datas.IP_Registration_Id else None,
                               
 
                            }
                            completed_list.append(data_list)
                    elif  datas.BookingType == 'EMERGENCY':
 
                        crew_ins = Surgical_Team_Details.objects.get(EMR_Registration_Id=datas.EMR_Registration_Id)
 
                        scrubNurseId = ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Scrub_Nurse.all())
                        scrubNurse = ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Scrub_Nurse.all())
 
                        circulatingNurseId= ', '.join(str(Surgeon.Employee_ID) for Surgeon in crew_ins.Circulating_Nurse.all())
                        circulatingNurse= ', '.join(str(Surgeon.First_Name) for Surgeon in crew_ins.Circulating_Nurse.all())
 
 
                        merged_nurse_ids = scrubNurseId + circulatingNurseId
                       
                        if Employeeid in merged_nurse_ids:
               
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
                                'patientId': datas.EMR_Registration_Id.PatientId.PatientId,
                                'PatientName':datas.EMR_Registration_Id.PatientId.FirstName,
                                'PatientCategory' : datas.EMR_Registration_Id.PatientCategory,
                                'BloodGroup' : datas.EMR_Registration_Id.PatientId.BloodGroup.BloodGroup_Name if datas.EMR_Registration_Id.PatientId.BloodGroup else None,
                                'Age':datas.EMR_Registration_Id.PatientId.Age,
                                'Gender':datas.EMR_Registration_Id.PatientId.Gender,
                                'UHIDNO':datas.EMR_Registration_Id.PatientId.UniqueIdNo,
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
