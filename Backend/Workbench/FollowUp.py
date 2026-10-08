
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
import json
from django.db.models import Q
from Ip_Workbench.models import *


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Workbench_FollowUp_Details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            NoOfDays = data.get('NoOfDays','')
            Date = data.get('Date','')
            created_by = data.get('Created_by', '')
            registration_id = data.get('RegistrationId', '')

            if not registration_id:
                return JsonResponse({'error': 'RegistrationId is required'}, status=400)

            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

            Follow_instance = Workbench_FollowUp(
                Registration_Id=registration_ins,
                NoOfDays=NoOfDays,
                Date=Date,
                created_by=created_by
            )
            Follow_instance.save()
            return JsonResponse({'success': 'Followup Details added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
            
   
    elif request.method == 'GET':
        try:
            registration_id = request.GET.get('RegistrationId')
            if not registration_id:
                return JsonResponse({'warn': 'RegistrationId is required'}, status=400)
            
            try:
                registration_ins = Patient_Appointment_Registration_Detials.objects.get(pk=registration_id)
            except Patient_Appointment_Registration_Detials.DoesNotExist:
                return JsonResponse({'error': 'Patient not found'}, status=404)

            # Fetch all records from the Location_Detials model
            FollowUp = Workbench_FollowUp.objects.filter(Registration_Id=registration_ins)
            
            # Construct a list of dictionaries containing location data
            FollowUp_data = [
                {
                    'id': Follow.Id,
                    'RegistrationId': Follow.Registration_Id.pk,
                    'VisitId': Follow.Registration_Id.VisitId,
                    'PrimaryDoctorId': Follow.Registration_Id.PrimaryDoctor.Doctor_ID,
                    'PrimaryDoctorName': Follow.Registration_Id.PrimaryDoctor.ShortName,
                    'NoOfDays': Follow.NoOfDays,
                    'Date': Follow.Date,
                    'created_by': Follow.created_by,
                    'CurrDate' : Follow.created_at.strftime('%Y-%m-%d'),  # Format date
                    'CurrTime' : Follow.created_at.strftime('%H:%M:%S') , # Format time
                } for Follow in FollowUp
            ]
            print(FollowUp_data,'FollowUp_data')
            return JsonResponse(FollowUp_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def get_OPD_General_Advice_FollowUp(request):

    if request.method == 'GET':
              try:
                patient_ins = Patient_Appointment_Registration_Detials.objects.all()
            
                follow_up_data_list =[]
            
                for patient in patient_ins:
                    
                    try:
            
                        followup_ins = OPD_GeneralAdviceFollowUp.objects.filter(Patient_Id_id=patient.PatientId_id)
                    
                        for followup in followup_ins:
                         if followup.FollowUpDataCheck == True:
                            

                        
                            date_str = followup.Date
                            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                            formatted_date = date_obj.strftime("%d-%m-%Y")
                            # Get today's date dynamically
                            todaydate = datetime.today().strftime("%d-%m-%Y")
                            #print("Today's Date:", todaydate)

                            # Example to compare follow-up dates
                            
                            followupdate_dt = datetime.strptime(formatted_date, "%d-%m-%Y")
                            #print(followupdate_dt)
                            todaydate_dt = datetime.strptime(todaydate, "%d-%m-%Y")
                           # print(todaydate_dt)

                            # Calculate difference
                            difference = (followupdate_dt - todaydate_dt).days
                            
                            if difference == 2:
                                followup_data = {
                                
                                    'patientid' : followup.Patient_Id.PatientId,
                                    'patient_name': f'{followup.Patient_Id.Title.Title_Name}.{followup.Patient_Id.FirstName}{followup.Patient_Id.MiddleName}',
                                    'fname':followup.Patient_Id.FirstName,
                                    'mname':followup.Patient_Id.MiddleName,
                                    'lname':followup.Patient_Id.SurName,
                                    'title':followup.Patient_Id.Title.Title_Name,
                                    'Gender' : followup.Patient_Id.Gender,
                                    'Age':followup.Patient_Id.Age,
                                    'PhoneNo':followup.Patient_Id.PhoneNo,
                                    'Email':followup.Patient_Id.Email,
                                    'Followup_Date':formatted_date,
                                    'registerid':followup.Registration_Id_id,
                                    'reviewid':followup.NextReview_Id,
                                    'reason':followup.Reason if followup.Reason else None,
                                    'status': 'Confirm' if followup.Status else 'pending',
                                    'Doctorname':f'{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
            
                                }
                        
                                follow_up_data_list.append(followup_data)
                            
                            
                    except OPD_GeneralAdviceFollowUp.DoesNotExist:
                        continue
                for idx, patient in enumerate(follow_up_data_list, start=1):
                                patient["id"] = idx
                return JsonResponse(follow_up_data_list,safe=False)
                
                
              except Exception as e:
                        print(f"An error occurred: {str(e)}")
                        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    elif request.method == 'POST':
         
         id = request.GET.get('id')
         status = request.GET.get('status')
         reviewid = request.GET.get('reviewid')
         reason = request.GET.get('reason')
         print(reason)
         
         followup_ins = OPD_GeneralAdviceFollowUp.objects.get(Registration_Id_id=id,NextReview_Id=reviewid)
         if status == 'pending':
              followup_ins.Status = not followup_ins.Status
              followup_ins.Reason = reason
              followup_ins.save()
              print(followup_ins.Status,'pending')
         else:
              print(followup_ins.Status,'before')
              followup_ins.Status = not followup_ins.Status
              followup_ins.Reason = None
              followup_ins.save()
              print(followup_ins.Status,'confirm')
         return JsonResponse('success',safe=False)

         





    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_IP_General_Advice_FollowUp(request):

    # try:
    #  Patient_ip  = Patient_IP_Registration_Detials.objects.all()
    #  follow_up_data_list =[]
 
    #  for patient in Patient_ip:
    #     #print(patient.PatientId_id)
    #     try:
    #         patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
    #         followup_ins = IP_DischargeSummary.objects.filter(Ip_Registration_Id_id=patient.Registration_Id)
           
    #         for followup in followup_ins:
              
    #             date_str = followup.Date
    #             date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    #             formatted_date = date_obj.strftime("%d-%m-%Y")
    #             todaydate = datetime.today().strftime("%d-%m-%Y")
    #             followupdate_dt = datetime.strptime(formatted_date, "%d-%m-%Y")
    #             todaydate_dt = datetime.strptime(todaydate, "%d-%m-%Y")

    #             # Calculate difference
    #             difference = (followupdate_dt - todaydate_dt).days
    #             #print(difference)

    #             if difference == 2:
    #                 followup_data = {
                       
    #                     'patientid' : patient_ins.PatientId,
    #                     'patient_name': f'{patient_ins.Title}.{patient_ins.FirstName}{patient_ins.MiddleName}',
    #                     'Gender' : patient_ins.Gender,
    #                     'Age':patient_ins.Age,
    #                     'PhoneNo':patient_ins.PhoneNo,
    #                     'Email':patient_ins.Email,
    #                     'Followup_Date':formatted_date,
    #                     'Doctorname':f'{patient.PrimaryDoctor.Tittle}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
 
    #                    }
               
    #                 follow_up_data_list.append(followup_data)
                  
                
    #     except IP_DischargeSummary.DoesNotExist:
    #         continue
    #  for idx, patient in enumerate(follow_up_data_list, start=1):
    #                   patient["id"] = idx
    #  return JsonResponse(follow_up_data_list,safe=False)

    # except Exception as e:
    #         print(f"An error occurred: {str(e)}")
    #         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    if request.method == 'POST':
         
         id = request.GET.get('id')
         
         status = request.GET.get('status')
         reviewid = request.GET.get('reviewid')
         reason = request.GET.get('reason')
         
         
         followup_ins = IP_DischargeSummary.objects.get(Ip_Registration_Id_id=id,Id=reviewid)
         if status == 'pending':
              followup_ins.Status = not followup_ins.Status
              followup_ins.Reason = reason
              followup_ins.save()
             
         else:
              
              followup_ins.Status = not followup_ins.Status
              followup_ins.Reason = None
              followup_ins.save()
              
         return JsonResponse('success',safe=False)

@csrf_exempt
def get_Discharged_Patient_Details(request):
    if request.method == 'GET':


     try: 
       
        Date = request.GET.get('date')
        SearchQuery = request.GET.get('search')
        follow_up_data_list =[]
        
        if SearchQuery:

            patient_instance = Patient_Detials.objects.filter(Q(PatientId__icontains=SearchQuery) | Q(FirstName__icontains=SearchQuery))
            #print(patient_instance)
            for patient in patient_instance:
                 Patient_ip  = Patient_IP_Registration_Detials.objects.filter(PatientId_id=patient.PatientId)
                
                 for patientip in Patient_ip:
                #  patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                  followup_ins = IP_DischargeSummary.objects.filter(Ip_Registration_Id_id=patientip.Registration_Id)
                  print(followup_ins,'Patient_ip')
                
                  for followup in followup_ins: 
                        discharge_date = followup.created_at.date()    
                        date_obj = datetime.strptime(str(discharge_date), "%Y-%m-%d")
                        formatted_discharge_date = date_obj.strftime("%d-%m-%Y")
                        discharge_datetime = datetime.strptime(formatted_discharge_date, "%d-%m-%Y")
                        follow_up_date = discharge_datetime + timedelta(days=2)
                        follow_up_date_str = follow_up_date.strftime("%Y-%m-%d")
                        todaydate = datetime.today().strftime("%Y-%m-%d")
                      
                        
                        followup_data = {
                            
                                'patientid' : patient.PatientId,
                                'patient_name': f'{patient.Title}.{patient.FirstName}{patient.MiddleName}',
                                'Gender' : patient.Gender,
                                'Age':patient.Age,
                                'PhoneNo':patient.PhoneNo,
                                'Email':patient.Email,
                                'VisitPurpose': 'FollowUp',
                                'discharge_date':discharge_date,
                                'Doctorname':f'{patientip.PrimaryDoctor.Tittle}.{patientip.PrimaryDoctor.First_Name}{patientip.PrimaryDoctor.Middle_Name}'
        
                            }
                    
                        follow_up_data_list.append(followup_data)
                 
            
        else:
            Patient_ip  = Patient_IP_Registration_Detials.objects.all()
                
            
            for patient in Patient_ip:

                try:
                    patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                    followup_ins = IP_DischargeSummary.objects.filter(Ip_Registration_Id_id=patient.Registration_Id)
                
                    for followup in followup_ins:
                        discharge_date = followup.created_at.date()    
                        date_obj = datetime.strptime(str(discharge_date), "%Y-%m-%d")
                        formatted_discharge_date = date_obj.strftime("%d-%m-%Y")
                        discharge_datetime = datetime.strptime(formatted_discharge_date, "%d-%m-%Y")
                        follow_up_date = discharge_datetime + timedelta(days=2)
                        follow_up_date_str = follow_up_date.strftime("%Y-%m-%d")
                        todaydate = datetime.today().strftime("%Y-%m-%d")
                      
                        if todaydate == follow_up_date_str:
                            followup_data = {
                            
                                'patientid' : patient_ins.PatientId,
                                'patient_name': f'{patient_ins.Title}.{patient_ins.FirstName}{patient_ins.MiddleName}',
                                'fname':patient_ins.FirstName,
                                'mname':patient_ins.MiddleName,
                                'lname':patient_ins.SurName,
                                'title':patient_ins.Title,
                                'Gender' : patient_ins.Gender,
                                'Age':patient_ins.Age,
                                'PhoneNo':patient_ins.PhoneNo,
                                'Email':patient_ins.Email,
                                'discharge_date':discharge_date,
                                'registerid':followup.Ip_Registration_Id_id,
                                'reviewid':followup.Id,
                                'reason':followup.Reason if followup.Reason else '-',
                                'status': 'Confirm' if followup.Status else 'pending',
                                'Doctorname':f'{patient.PrimaryDoctor.Tittle}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
        
                            }
                    
                            follow_up_data_list.append(followup_data)
                           
                except IP_DischargeSummary.DoesNotExist:
                    continue
        for idx, patient in enumerate(follow_up_data_list, start=1):
                      patient["id"] = idx
        return JsonResponse(follow_up_data_list,safe=False)
 
     except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
def get_OPD_General_Advice_FollowUp_by_filter(request):
     
     if request.method == 'GET':
      try:
        Date = request.GET.get('date')
        SearchQuery = request.GET.get('search')
        follow_up_data_list=[]

        if Date:
            followup_op_ins = OPD_GeneralAdviceFollowUp.objects.filter(Date=Date)

            print(followup_op_ins,'followup_op_ins')
            
            for followup in followup_op_ins:
                date_str = followup.Date
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                formatted_date = date_obj.strftime("%d-%m-%Y")

                print(followup.Registration_Id.Registration_Id)
                patient = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=followup.Registration_Id.Registration_Id)
                followup_data = {
                                        'patientid' : followup.Patient_Id.PatientId,
                                        'patient_name': f'{followup.Patient_Id.Title.Title_Name}.{followup.Patient_Id.FirstName}{followup.Patient_Id.MiddleName}',
                                        'fname':followup.Patient_Id.FirstName,
                                        'mname':followup.Patient_Id.MiddleName,
                                        'lname':followup.Patient_Id.SurName,
                                        'title':followup.Patient_Id.Title.Title_Name,
                                        'Gender' : followup.Patient_Id.Gender,
                                        'Age':followup.Patient_Id.Age,
                                        'PhoneNo':followup.Patient_Id.PhoneNo,
                                        'Email':followup.Patient_Id.Email,
                                        'Followup_Date':formatted_date,
                                        'registerid':followup.Registration_Id_id,
                                        'reviewid':followup.NextReview_Id,
                                        'reason':followup.Reason if followup.Reason else '-',
                                        'status': 'Confirm' if followup.Status else 'pending',
                                        'Department':'OP',
                                        # 'Doctorname':f'{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
                
                                    }
                            
                follow_up_data_list.append(followup_data)

            
            
            followup_ip_ins = IP_DischargeSummary.objects.filter(Date=Date)
            for followup in followup_ip_ins:
                
                patient = Patient_IP_Registration_Detials.objects.get(Registration_Id=followup.Ip_Registration_Id_id)
                print(patient.PatientId_id,'patient')
                patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                date_str = followup.Date
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                formatted_date = date_obj.strftime("%d-%m-%Y")
                todaydate = datetime.today().strftime("%d-%m-%Y")
                followupdate_dt = datetime.strptime(formatted_date, "%d-%m-%Y")
                todaydate_dt = datetime.strptime(todaydate, "%d-%m-%Y")

                # Calculate difference
                difference = (followupdate_dt - todaydate_dt).days
                #print(difference)

                if difference == 2:
                    followup_data = {
                       
                        'patientid' : patient.PatientId_id,
                        'patient_name': f'{patient_ins.Title.Title_Name}.{patient_ins.FirstName}{patient_ins.MiddleName}',
                        'Gender' : patient_ins.Gender,
                        'Age':patient_ins.Age,
                        'PhoneNo':patient_ins.PhoneNo,
                        'Email':patient_ins.Email,
                        'Followup_Date':formatted_date,
                        'fname':patient_ins.FirstName,
                        'mname':patient_ins.MiddleName,
                        'lname':patient_ins.SurName,
                        'title':patient_ins.Title.Title_Name,
                        'Department':'IP',
                        'registerid':followup.Registration_Id_id,
                        'reviewid':followup.NextReview_Id,
                        'reason':followup.Reason if followup.Reason else '-',
                        'status': 'Confirm' if followup.Status else 'pending',
                        'Department':'IP',
                        'Doctorname':f'{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
 
                       }
               
                    follow_up_data_list.append(followup_data)
        elif SearchQuery:

            patient_instance = Patient_Detials.objects.filter(Q(PatientId__icontains=SearchQuery) | Q(FirstName__icontains=SearchQuery))
            if patient_instance:

                for patient in patient_instance:
                    followup_ins = OPD_GeneralAdviceFollowUp.objects.filter(Patient_Id_id=patient.PatientId)
                    follow_up_data_list = []
                    for followup in followup_ins:
                        date_str = followup.Date
                        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                        formatted_date = date_obj.strftime("%d-%m-%Y")
                        patient = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=followup.Registration_Id.Registration_Id)
                        followup_data = {
                                                'patientid' : followup.Patient_Id.PatientId,
                                                'patient_name': f'{followup.Patient_Id.Title.Title_Name}.{followup.Patient_Id.FirstName}{followup.Patient_Id.MiddleName}',
                                                'fname':followup.Patient_Id.FirstName,
                                                'mname':followup.Patient_Id.MiddleName,
                                                'lname':followup.Patient_Id.SurName,
                                                'title':followup.Patient_Id.Title.Title_Name,
                                                'Gender' : followup.Patient_Id.Gender,
                                                'Age':followup.Patient_Id.Age,
                                                'PhoneNo':followup.Patient_Id.PhoneNo,
                                                'Email':followup.Patient_Id.Email,
                                                'Followup_Date':formatted_date,
                                                'registerid':followup.Registration_Id_id,
                                                'reviewid':followup.NextReview_Id,
                                                'reason':followup.Reason if followup.Reason else '-',
                                                'status': 'Confirm' if followup.Status else 'pending',
                                                'Department':'OP',
                                                'Doctorname':f'{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
                        
                                            }
                                    
                        follow_up_data_list.append(followup_data)

                for patient in patient_instance:
                    Patient_ip  = Patient_IP_Registration_Detials.objects.filter(PatientId_id=patient.PatientId)
                    for patientip in Patient_ip:
                         print(patientip.PrimaryDoctor.First_Name,'patientip.PatientId_id')
                         followup_ins = IP_DischargeSummary.objects.filter(Ip_Registration_Id_id=patientip.Registration_Id)
                         for followup in followup_ins:
                              date_str = followup.Date
                              date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                              formatted_date = date_obj.strftime("%d-%m-%Y")
                             # patient = Patient_IP_Registration_Detials.objects.get(PatientId_id=followup.Patient_Id.PatientId)
                              followup_data = {
                                                'patientid' : patientip.PatientId_id,
                                                'patient_name': f'{patient.Title.Title_Name}.{patient.FirstName}{patient.MiddleName}',
                                                'fname':patient.FirstName,
                                                'mname':patient.MiddleName,
                                                'lname':patient.SurName,
                                                'title':patient.Title.Title_Name,
                                                'Gender' : patient.Gender,
                                                'Age':patient.Age,
                                                'PhoneNo':patient.PhoneNo,
                                                'Email':patient.Email,
                                                'Followup_Date':formatted_date,
                                                'registerid':followup.Ip_Registration_Id_id,
                                                'reviewid':followup.Id,
                                                'reason':followup.Reason if followup.Reason else '-',
                                                'status': 'Confirm' if followup.Status else 'pending',
                                                'Department':'IP',
                                                'Doctorname':f'{patientip.PrimaryDoctor.Tittle.Title_Name}.{patientip.PrimaryDoctor.First_Name}{patientip.PrimaryDoctor.Middle_Name}'
                        
                                            }
                                    
                              follow_up_data_list.append(followup_data)
 
        else:
             patient__op_ins = Patient_Appointment_Registration_Detials.objects.all()
            
             follow_up_data_list =[]
            
             for patient in patient__op_ins:
                    
                    try:
            
                        followup_op_ins = OPD_GeneralAdviceFollowUp.objects.filter(Registration_Id=patient.pk)

                        print(followup_op_ins,'followup_op_ins')
                    
                        for followup in followup_op_ins:
                         if followup.FollowUpDataCheck == True:
                        
                            date_str = followup.Date
                            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                            formatted_date = date_obj.strftime("%d-%m-%Y")
                            # Get today's date dynamically
                            todaydate = datetime.today().strftime("%d-%m-%Y")
                            #print("Today's Date:", todaydate)

                            # Example to compare follow-up dates
                            
                            followupdate_dt = datetime.strptime(formatted_date, "%d-%m-%Y")
                            #print(followupdate_dt)
                            todaydate_dt = datetime.strptime(todaydate, "%d-%m-%Y")
                           # print(todaydate_dt)

                            # Calculate difference
                            difference = (followupdate_dt - todaydate_dt).days
                            
                            if difference == 2:
                                followup_data = {
                                
                                    'patientid' : followup.Patient_Id.PatientId,
                                    'patient_name': f'{followup.Patient_Id.Title.Title_Name}.{followup.Patient_Id.FirstName}{followup.Patient_Id.MiddleName}',
                                    'fname':followup.Patient_Id.FirstName,
                                    'mname':followup.Patient_Id.MiddleName,
                                    'lname':followup.Patient_Id.SurName,
                                    'title':followup.Patient_Id.Title.Title_Name,
                                    'Gender' : followup.Patient_Id.Gender,
                                    'Age':followup.Patient_Id.Age,
                                    'PhoneNo':followup.Patient_Id.PhoneNo,
                                    'Email':followup.Patient_Id.Email,
                                    'Followup_Date':formatted_date,
                                    'registerid':followup.Registration_Id_id,
                                    'reviewid':followup.NextReview_Id,
                                    'reason':followup.Reason if followup.Reason else '-',
                                    'status': 'Confirm' if followup.Status else 'pending',
                                    'Department':'OP',
                                    # 'Doctorname':f'{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
            
                                }
                        
                                follow_up_data_list.append(followup_data)
                    except OPD_GeneralAdviceFollowUp.DoesNotExist:
                        continue
            
             Patient_ip  = Patient_IP_Registration_Detials.objects.all()
            #  follow_up_data_list =[]
 
             for patient in Patient_ip:
                #print(patient.PatientId_id)
                try:
           
                    followup_ins = IP_DischargeSummary.objects.filter(Ip_Registration_Id_id=patient.Registration_Id)
                
                    for followup in followup_ins:
                    
                        date_str = followup.Date
                        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                        formatted_date = date_obj.strftime("%d-%m-%Y")
                        todaydate = datetime.today().strftime("%d-%m-%Y")
                        followupdate_dt = datetime.strptime(formatted_date, "%d-%m-%Y")
                        todaydate_dt = datetime.strptime(todaydate, "%d-%m-%Y")

                        # Calculate difference
                        difference = (followupdate_dt - todaydate_dt).days
                        #print(difference)

                        if difference == 2:
                            followup_data = {
                            
                                'patientid' : patient_ins.PatientId,
                                'patient_name': f'{patient_ins.Title.Title_Name}.{patient_ins.FirstName}{patient_ins.MiddleName}',
                                'fname':patient_ins.FirstName,
                                'mname':patient_ins.MiddleName,
                                'lname':patient_ins.SurName,
                                'title':patient_ins.Title.Title_Name,
                                'Gender' : patient_ins.Gender,
                                'Age':patient_ins.Age,
                                'PhoneNo':patient_ins.PhoneNo,
                                'Email':patient_ins.Email,
                                'Followup_Date':formatted_date,
                                'registerid':followup.Ip_Registration_Id_id,
                                'reviewid':followup.Id,
                                'reason':followup.Reason if followup.Reason else '-',
                                'status': 'Confirm' if followup.Status else 'pending',
                                'Department':'IP',
                                'Doctorname':f'{patient.PrimaryDoctor.Tittle.Title_Name}.{patient.PrimaryDoctor.First_Name}{patient.PrimaryDoctor.Middle_Name}'
        
                            }
                    
                            follow_up_data_list.append(followup_data)
                        
                        
                except IP_DischargeSummary.DoesNotExist:
                    continue
        for idx, patient in enumerate(follow_up_data_list, start=1):
                      patient["id"] = idx
        return JsonResponse(follow_up_data_list,safe=False) 
      except Exception as e:
                        print(f"An error occurred: {str(e)}")
                        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
         

        # if VisitPurpose and not search_query:
        #      patient_vp_ins = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose=VisitPurpose)
        #      print(patient_vp_ins)
        #      for patient in patient_vp_ins:
                  
        #           vp_patient_dict = {
                       
        #           "PatientName":f"{patient.PatientId.FirstName}{patient.PatientId.MiddleName}",
        #           "gender" : patient.PatientId.Gender,
        #           "phoneno": patient.PatientId.PhoneNo
                       
        #           }

        #           patient_list.append(vp_patient_dict)

        # elif search_query:
             
        #      patient_instance = Patient_Detials.objects.filter(Q(PatientId__icontains=search_query) | Q(FirstName__icontains=search_query))
        #      if patient_instance:
        #           for patient in patient_instance:
        #                Patient_data = Patient_Appointment_Registration_Detials.objects.filter(PatientId_id=patient.PatientId)
        #                for patient_search in Patient_data:
        #                     all_patient_dict = {     
        #                         "PatientName":f"{patient_search.PatientId.FirstName}{patient_search.PatientId.MiddleName}",
        #                         "gender" : patient_search.PatientId.Gender,
        #                         "phoneno": patient_search.PatientId.PhoneNo
        #                     }
        #                     patient_list.append(all_patient_dict)
                        
        # else:
        #    for patient in patient_ins:
        #                 all_patient_dict = {     
        #                         "PatientName":f"{patient.PatientId.FirstName}{patient.PatientId.MiddleName}",
        #                         "gender" : patient.PatientId.Gender,
        #                         "phoneno": patient.PatientId.PhoneNo
        #                 }
        #                 patient_list.append(all_patient_dict)





@csrf_exempt
@require_http_methods(["GET"])
def get_Pending_documents(request):
 
    if request.method == "GET":
 
        try:
 
            SearchQuery = request.GET.get('SearchQuery')
 
            print(SearchQuery,'SearchQuery')
 
            patient_ins = Patient_Detials.objects.all()
 
            patient_ins = Patient_Detials.objects.filter(UniqueIdNo__isnull=True) | Patient_Detials.objects.filter(UniqueIdNo="")
 
 
            pendingdoc_list = []
 
 
            if SearchQuery:
                 
                 patient_ins = Patient_Detials.objects.filter(Q(PatientId__icontains=SearchQuery) | Q(FirstName__icontains=SearchQuery) | Q(PhoneNo__icontains=SearchQuery) | Q(MiddleName__icontains=SearchQuery) | Q(SurName__icontains=SearchQuery))
                 for datas in patient_ins:
 
                    data_list = {
                       
                        'patientid' : datas.PatientId,
                        'patient_name' : f"{datas.FirstName}{datas.MiddleName}{datas.SurName}",
                        'Gender' : datas.Gender,
                        'Age' : datas.Age,
                        'PhoneNo' : datas.PhoneNo,
                    }
                    pendingdoc_list.append(data_list)
 
            else :
           
                for datas in patient_ins:
 
                    data_list = {
                       
                        'patientid' : datas.PatientId,
                        'patient_name' : f"{datas.FirstName}{datas.MiddleName}{datas.SurName}",
                        'Gender' : datas.Gender,
                        'Age' : datas.Age,
                        'PhoneNo' : datas.PhoneNo,
                    }
                    pendingdoc_list.append(data_list)
 
 
 
            for idx,patient  in enumerate(pendingdoc_list,start=1):
                 patient["id"] = idx
            return JsonResponse(pendingdoc_list,safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    