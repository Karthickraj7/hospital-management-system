from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import *
from django.utils.timezone import now
from Workbench.models import *





@csrf_exempt
@require_http_methods(['POST', 'GET'])
def IP_DischargeSummary_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'Received Data')

            RegistrationId = data.get("RegistrationId")
            FinalDiagnosis = data.get("finalDiagnosis", '')
            PresentingComplaints = data.get("presentingComplaints", '')
            PastMedicalHistory = data.get("PastMedicalHistory", '')
            AllergyHistory = data.get("AllergyHistory", '')
            Vitals = data.get("vitals", '')
            Radiology = data.get("Radiology", '')
            DischargeNotes = data.get("dischargeNotes", '')
            Referdoctor = data.get("Referdoctor", '')
            ConditionOnDischarge = data.get("ConditionOnDischarge", '')
            PrescriptionSummary = data.get("PrescriptionSummary", '')
            NoOfDays = data.get("NoOfDays", '')
            TimeInterval = data.get("TimeInterval", '')
            Date = data.get("Date", '')
            DietAdvice = data.get("DietAdvice", '')
            Emergency = data.get("Emergency", '')
            AdviceOnDischarge = data.get("AdviceOnDischarge", '')
            DoctorSchedule = data.get("doctorSchedule", '')
            DepartmentType = data.get("DepartmentType")
            createdby = data.get("Createdby")
            Prescription = data.get("Prescription")

            registration_ins_ip = None
            registration_ins_casuality = None

            print(f"Received RegistrationId: {RegistrationId}")  # Debugging line

            if RegistrationId:
                # Attempt to find registration in IP or Casualty tables
                try:
                    registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId)
                    print("Found in IP Registration")
                except Patient_IP_Registration_Detials.DoesNotExist:
                    print("Not found in IP Registration, trying Casuality Registration")
                    try:
                        registration_ins_casuality = Patient_Casuality_Registration_Detials.objects.get(pk=RegistrationId)
                        print("Found in Casuality Registration")
                    except Patient_Casuality_Registration_Detials.DoesNotExist:
                        return JsonResponse({'error': 'No registration found for the given RegistrationId'})

                # Update existing discharge summary if it exists
                try:
                    print('3333333')
                    DischargeSummary = IP_DischargeSummary.objects.get(Ip_Registration_Id=RegistrationId)
                    DischargeSummary.DepartmentType = DepartmentType
                    DischargeSummary.FinalDiagnosis = FinalDiagnosis
                    DischargeSummary.PresentingComplaints = PresentingComplaints
                    DischargeSummary.PastMedicalHistory = PastMedicalHistory
                    DischargeSummary.AllergyHistory = AllergyHistory
                    DischargeSummary.Vitals = Vitals
                    DischargeSummary.Radiology = Radiology
                    DischargeSummary.DischargeNotes = DischargeNotes
                    DischargeSummary.Referdoctor = Referdoctor
                    DischargeSummary.ConditionOnDischarge = ConditionOnDischarge
                    DischargeSummary.PrescriptionSummary = PrescriptionSummary
                    DischargeSummary.NoOfDays = NoOfDays
                    DischargeSummary.TimeInterval = TimeInterval
                    DischargeSummary.Date = Date
                    DischargeSummary.DietAdvice = DietAdvice
                    DischargeSummary.Emergency = Emergency
                    DischargeSummary.AdviceOnDischarge = AdviceOnDischarge
                    DischargeSummary.DoctorSchedule = DoctorSchedule
                    DischargeSummary.Created_by = createdby
                    DischargeSummary.save()
                    print('4444444444')



                    for PresData in Prescription:
                        ItemId=PresData.get('ItemId','')
                        strength=PresData.get('strength','')
                        frequencyId=PresData.get('frequencyId','')
                        route=PresData.get('route','')
                        mealRelation=PresData.get('mealRelation','')
                        # duration=PresData.get('duration','')
                        durationType=PresData.get('durationType','')

                        raw_duration = PresData.get('duration', '')
                        try:
                            duration = int(raw_duration) if raw_duration not in [None, '', 'null'] else None
                        except ValueError:
                            duration = None
                        
                        print('55555555')

                        print(ItemId,'ItemId')
                        ItemId_ins = Product_Master_All_Category_Details.objects.get(pk=ItemId) if ItemId else None
                        frequencyId_ins = Frequency_Master_Drug.objects.get(FrequencyId=frequencyId) if frequencyId else None
                        registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId) if RegistrationId else None

                        print(ItemId_ins,'ItemId_ins')
                        print(frequencyId_ins,'frequencyId_ins---')

                        Prescription_Details = OPD_Prescription_Details.objects.filter(IP_Registration_Id=RegistrationId)
                        
                        print(Prescription_Details,'Prescription_Details')
                       
                        
                        if Prescription_Details:
                            for Presc in Prescription_Details:
                                Presc.IP_Registration_Id=registration_ins_ip
                                Presc.ItemId=ItemId_ins
                                Presc.Dosage=strength
                                Presc.FrequencyId=frequencyId_ins
                                Presc.Route=route
                                Presc.mealRelation=mealRelation
                                Presc.DurationNumber=duration
                                Presc.DurationUnit=durationType
                                Presc.created_by = createdby
                                Presc.save()
                        else:
                            Prescription_ins = OPD_Prescription_Details(
                                IP_Registration_Id=registration_ins_ip,
                                ItemId=ItemId_ins,
                                Dosage=strength,
                                FrequencyId=frequencyId_ins,
                                Route=route,
                                mealRelation=mealRelation,
                                DurationNumber=duration,
                                DurationUnit=durationType,
                                created_by=createdby,
                            )
                            Prescription_ins.save()

                    
                        
                except IP_DischargeSummary.DoesNotExist:
                    # Create a new discharge summary if it doesn't exist
                  
                    
                    print('222222-------')

                    for PresData in Prescription:
                        ItemId=PresData.get('ItemId')
                        strength=PresData.get('strength')
                        frequencyId=PresData.get('frequencyId')
                        route=PresData.get('route')
                        mealRelation=PresData.get('mealRelation')
                        # duration=PresData.get('duration')
                        durationType=PresData.get('durationType')

                        raw_duration = PresData.get('duration', '')
                        try:
                            duration = int(raw_duration) if raw_duration not in [None, '', 'null'] else None
                        except ValueError:
                            duration = None

                        
                        
                        print(ItemId,'ItemId')
                        ItemId_ins = Product_Master_All_Category_Details.objects.get(pk=ItemId) if ItemId else None
                        frequencyId_ins = Frequency_Master_Drug.objects.get(FrequencyId=frequencyId) if frequencyId else None
                        registration_ins_ip = Patient_IP_Registration_Detials.objects.get(pk=RegistrationId) if RegistrationId else None

                        print(ItemId_ins,'ItemId_ins')
                        print(frequencyId_ins,'frequencyId_ins---')


                        Prescription_ins = OPD_Prescription_Details(
                            IP_Registration_Id=registration_ins_ip,
                            ItemId=ItemId_ins,
                            Dosage=strength,
                            FrequencyId=frequencyId_ins,
                            Route=route,
                            mealRelation=mealRelation,
                            DurationNumber=duration,
                            DurationUnit=durationType,
                            created_by=createdby,
                        )
                        Prescription_ins.save()
                        print(Prescription_ins,'Prescription_ins')


                    Discharge_instance = IP_DischargeSummary(
                        Ip_Registration_Id=registration_ins_ip,
                        Casuality_Registration_Id=registration_ins_casuality,
                        DepartmentType=DepartmentType,
                        FinalDiagnosis=FinalDiagnosis,
                        PresentingComplaints=PresentingComplaints,
                        PastMedicalHistory=PastMedicalHistory,
                        AllergyHistory=AllergyHistory,
                        Vitals=Vitals,
                        Radiology=Radiology,
                        DischargeNotes=DischargeNotes,
                        Referdoctor=Referdoctor,
                        ConditionOnDischarge=ConditionOnDischarge,
                        PrescriptionSummary=PrescriptionSummary,
                        NoOfDays=NoOfDays,
                        TimeInterval=TimeInterval,
                        Date=Date,
                        DietAdvice=DietAdvice,
                        Emergency=Emergency,
                        AdviceOnDischarge=AdviceOnDischarge,
                        DoctorSchedule=DoctorSchedule,
                        Created_by=createdby,
                    )
                    Discharge_instance.save()




            else:
                return JsonResponse({'error': 'RegistrationId is required'})

            return JsonResponse({'success': 'Discharge summary details saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            Ip_Registration_Id = request.GET.get('RegistrationId')
            DepartmentType = request.GET.get('DepartmentType')

            if not Ip_Registration_Id and not DepartmentType:
                return JsonResponse({'error': 'Both Ip_Registration_Id and DepartmentType are required'})

            # Prescription = OPD_Prescription_Details.objects.filter(Ip_Registration_Id=Ip_Registration_Id)
            # print(Prescription,'Prescription')

            try:
                Prescription = OPD_Prescription_Details.objects.filter(
                    IP_Registration_Id__Registration_Id=Ip_Registration_Id
                )
                print(Prescription, 'Prescription')
            except Exception as e:
                print(f"Prescription fetch error: {str(e)}")
                Prescription = []

            if DepartmentType == 'IP':
                Discharge_Details = IP_DischargeSummary.objects.filter(Ip_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)    
            else:
                Discharge_Details = IP_DischargeSummary.objects.filter(Casuality_Registration_Id__pk=Ip_Registration_Id, DepartmentType=DepartmentType)

            
            # Serialize data
            Discharge_Details_data = []
            for idx, Discharge in enumerate(Discharge_Details, start=1):
                ip_registration = Discharge.Ip_Registration_Id
                casuality_registration = Discharge.Casuality_Registration_Id
                
               
                Discharge_dict = {
                    'id': idx,
                    # 'RegistrationId': Discharge.Ip_Registration_Id.pk if Discharge.Ip_Registration_Id else Discharge.Casuality_Registration_Id.pk,
                    # 'VisitId': Discharge.Ip_Registration_Id.VisitId if Discharge.Ip_Registration_Id else Discharge.Casuality_Registration_Id.VisitId,
                    # 'PrimaryDoctorId': Discharge.Ip_Registration_Id.PrimaryDoctor.Doctor_ID if Discharge.Ip_Registration_Id else Discharge.Casuality_Registration_Id.PrimaryDoctor.Doctor_ID,
                    # 'PrimaryDoctorName': Discharge.Ip_Registration_Id.PrimaryDoctor.ShortName if Discharge.Ip_Registration_Id else Discharge.Casuality_Registration_Id.PrimaryDoctor.ShortName,
                    'RegistrationId': ip_registration.pk if ip_registration else casuality_registration.pk if casuality_registration else None,
                    'PrimaryDoctorId': (
                        ip_registration.PrimaryDoctor.Doctor_ID if ip_registration and ip_registration.PrimaryDoctor 
                        else casuality_registration.PrimaryDoctor.Doctor_ID if casuality_registration and casuality_registration.PrimaryDoctor 
                        else None
                    ),
                    'PrimaryDoctorName': (
                        ip_registration.PrimaryDoctor.ShortName if ip_registration and ip_registration.PrimaryDoctor 
                        else casuality_registration.PrimaryDoctor.ShortName if casuality_registration and casuality_registration.PrimaryDoctor 
                        else None
                    ),
                   
                    'FinalDiagnosis': Discharge.FinalDiagnosis,
                    'PresentingComplaints': Discharge.PresentingComplaints,
                    'PastMedicalHistory': Discharge.PastMedicalHistory,
                    'AllergyHistory': Discharge.AllergyHistory,
                    'Vitals': Discharge.Vitals,
                    'Radiology': Discharge.Radiology,
                    'DischargeNotes': Discharge.DischargeNotes,
                    'Referdoctor': Discharge.Referdoctor,
                    'ConditionOnDischarge': Discharge.ConditionOnDischarge,
                    'PrescriptionSummary': Discharge.PrescriptionSummary,
                    'NoOfDays': Discharge.NoOfDays,
                    'TimeInterval': Discharge.TimeInterval,
                    'Date': Discharge.Date,
                    'DietAdvice': Discharge.DietAdvice,
                    'Emergency': Discharge.Emergency,
                    'AdviceOnDischarge': Discharge.AdviceOnDischarge,
                    'DoctorSchedule': Discharge.DoctorSchedule,
                    'DepartmentType': Discharge.DepartmentType,
                    'CurrDate': Discharge.created_at.strftime('%d-%m-%y'),
                    'CurrTime': Discharge.created_at.strftime('%H:%M:%S'),
                    'Createdby': Discharge.Created_by,
                    'PrescriptionData':[],
                }

                for Pres in Prescription:
                    pres_dict = {
                        'ItemName': Pres.ItemId.ItemName if Pres.ItemId else None,
                        'ItemId': Pres.ItemId.pk if Pres.ItemId else None,
                        'Dose': Pres.Dosage,
                        'Route': Pres.Route,
                        'DurationNumber': Pres.DurationNumber,
                        'DurationUnit': Pres.DurationUnit,
                        'Frequency': Pres.FrequencyId.Frequency if Pres.FrequencyId else None,
                        'FrequencyId': Pres.FrequencyId.FrequencyId if Pres.FrequencyId else None,
                        'mealRelation': Pres.mealRelation,
                        'mealRelation': Pres.mealRelation,
                        'created_by': Pres.created_by,
                        'created_at': Pres.created_at.strftime('%d-%m-%Y %H:%M:%S'),
                    }
                    Discharge_dict['PrescriptionData'].append(pres_dict)
                        

                Discharge_Details_data.append(Discharge_dict)

                


            return JsonResponse(Discharge_Details_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





