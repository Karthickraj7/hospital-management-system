import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from Frontoffice.models import *





# @csrf_exempt
# def get_Patient_Registration_Summary_Details(request):
#     if request.method == 'GET':
#         try:

#             search_query = request.GET.get('search', None)
#             limit = request.GET.get('limit', None)
#             Date = request.GET.get('Date', None)

#             queryset = Patient_Detials.objects.all()

#             if search_query:
#                 queryset = queryset.filter(
#                     PatientId__icontains=search_query 
#                 ) | queryset.filter(
#                     FirstName__icontains=search_query
#                 )
            
#             if limit:
#                 queryset = queryset[:int(limit)]

#             PatientRegisterSummary_list = [
#             {
#                 'id': indx + 1,  
#                 'PatientId': patient.PatientId,
#                 'PatientName': patient.FirstName,
#                 'Age': patient.Age,
#                 'Gender': patient.Gender,
#                 'created_by': patient.created_by,
#                 'CurrDate': patient.created_at.strftime('%d-%m-%y'),
#                 'CurrTime': patient.created_at.strftime('%H:%M:%S'),
#         } 
#             for indx, patient in enumerate(queryset)
#             ]

#             return JsonResponse(PatientRegisterSummary_list, safe=False)    


#         



@csrf_exempt
def get_Patient_Registration_Summary_Details(request):
    if request.method == 'GET':
        try:
            # Fetch query parameters
            search_query = request.GET.get('search', None)
            limit = request.GET.get('limit', None)
            from_date = request.GET.get('fromDate', None)
            to_date = request.GET.get('toDate', None)

            # Base queryset
            queryset = Patient_Detials.objects.all()

            # Filtering by search_query
            if search_query:
                queryset = queryset.filter(
                    Q(PatientId__icontains=search_query) |
                    Q(FirstName__icontains=search_query)
                )

            # Filtering by date range
            if from_date and to_date:
                from_date = datetime.strptime(from_date, '%Y-%m-%d')
                to_date = datetime.strptime(to_date, '%Y-%m-%d')
                queryset = queryset.filter(created_at__date__range=(from_date, to_date))

            # Limiting the results if limit is provided
            if limit:
                queryset = queryset[:int(limit)]

            # Serialize the filtered data
            PatientRegisterSummary_list = [
                {
                    'id': indx + 1,
                    'PatientId': patient.PatientId,
                    'PatientName': patient.FirstName,
                    'Age': patient.Age,
                    'Gender': patient.Gender,
                    'created_by': patient.created_by,
                    'CurrDate': patient.created_at.strftime('%d-%m-%y'),
                    'CurrTime': patient.created_at.strftime('%H:%M:%S'),
                }
                for indx, patient in enumerate(queryset)
            ]

            # Return JSON response
            return JsonResponse(PatientRegisterSummary_list, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
def get_referal_doctor_report_details(request):

    if request.method == 'GET':

         try:
           
           search_query = request.GET.get('search',None)
           print(search_query)
           limit = request.GET.get('limit', None)
           dept = request.GET.get('dept',None)
           

           queryset = Doctor_Personal_Form_Detials.objects.filter(DoctorType='Referral')
           
   
           if search_query and not dept:
                
                queryset = Doctor_Personal_Form_Detials.objects.filter( Q(Doctor_ID=search_query) | Q(First_Name__icontains=search_query),
                                                                              DoctorType='Referral')
                ReferalDoctorSummary_list = []
                count=0
                for Queryset in queryset: 
                        count = count+1

                        print(Queryset.Doctor_ID)

                        queryset1 = Doctor_ProfessForm_Detials.objects.get( Doctor_ID = Queryset.Doctor_ID)
                        route_ins = Route_Master_Detials.objects.get(pk=queryset1.RouteId_id)

                        ref_doc_dict={

                            'id': count,
                            'Did':queryset1.Doctor_ID.Doctor_ID,   
                            'DoctorName': f"{queryset1.Doctor_ID.Tittle.Title_Name}.{queryset1.Doctor_ID.First_Name} {queryset1.Doctor_ID.Last_Name}",
                            'PhoneNo' : queryset1.Doctor_ID.Contact_Number,
                            'RouteName':route_ins.Route_Name,
                            'TahsilName':route_ins.Teshil_Name,
                            'VillageName':route_ins.Village_Name
                        }
                        ReferalDoctorSummary_list.append(ref_doc_dict)
                return JsonResponse(ReferalDoctorSummary_list,safe=False)
                
           elif  dept :
              ReferalDoctorSummary_list=[]
              count=0
              for Queryset in queryset: 
               
               dept_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=Queryset.Doctor_ID)
               route_ins = Route_Master_Detials.objects.get(pk=dept_ins.RouteId_id)
               departmentId = ', '.join(str(department.Department_Id) for department in dept_ins.Department.all())
               
               if departmentId == dept:
                       
                   doctor_data = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=dept_ins.Doctor_ID.Doctor_ID)
                   count = count + 1
                   data_dict = {
                       
                        'id': count, 
                        'Did':doctor_data.Doctor_ID, 
                        'DoctorName': f"{doctor_data.Tittle.Title_Name}.{doctor_data.First_Name} {doctor_data.Last_Name}",
                        'PhoneNo' : doctor_data.Contact_Number,
                        'RouteName':route_ins.Route_Name,
                            'TahsilName':route_ins.Teshil_Name,
                            'VillageName':route_ins.Village_Name
                       
                   }
                   ReferalDoctorSummary_list.append(data_dict)
              return JsonResponse(ReferalDoctorSummary_list,safe=False)
               
           elif limit:
                queryset = queryset[:int(limit)]

           ReferalDoctorSummary_list = []
           count=0
           for Queryset in queryset: 
                count = count+1

                queryset1 = Doctor_ProfessForm_Detials.objects.get(Doctor_ID = Queryset.Doctor_ID)
                print(queryset1.RouteId_id)
                route_ins = Route_Master_Detials.objects.get(pk=queryset1.RouteId_id)
                print(route_ins)

                ref_doc_dict={

                    'id': count,
                    'Did':queryset1.Doctor_ID.Doctor_ID,   
                    'DoctorName': f"{queryset1.Doctor_ID.Tittle.Title_Name}.{queryset1.Doctor_ID.First_Name} {queryset1.Doctor_ID.Last_Name}",
                    'PhoneNo' : queryset1.Doctor_ID.Contact_Number,
                    'RouteName':route_ins.Route_Name,
                    'TahsilName':route_ins.Teshil_Name,
                    'VillageName':route_ins.Village_Name
                }
                ReferalDoctorSummary_list.append(ref_doc_dict)
            
           return JsonResponse(ReferalDoctorSummary_list,safe=False)



           
         except Exception as e:
           return JsonResponse({'error': str(e)},status=500)
    
@csrf_exempt
def get_referal_doctor_by_dept(request):
     
     if request.method == 'GET':
          try:
                dept = request.GET.get('dept')
                queryset = Doctor_Personal_Form_Detials.objects.filter(DoctorType='Referral')
                if dept:
                    ReferalDoctorSummary_list=[]
                    count=0
                    for Queryset in queryset: 
                
                            dept_ins = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=Queryset.Doctor_ID)
                            departmentId = ', '.join(str(department.Department_Id) for department in dept_ins.Department.all())
                        
                            if departmentId == dept:
                                
                                doctor_data = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=dept_ins.Doctor_ID.Doctor_ID)
                                count = count + 1
                                data_dict = {
                                    
                                        'id': count, 
                                        'Did':doctor_data.Doctor_ID, 
                                        'DoctorName': f"{doctor_data.Tittle.Title_Name}.{doctor_data.First_Name} {doctor_data.Last_Name}",
                                        'PhoneNo' : doctor_data.Contact_Number,
                                    
                                }
                                ReferalDoctorSummary_list.append(data_dict)
                    return JsonResponse(ReferalDoctorSummary_list,safe=False)
                else:
                    ReferalDoctorSummary_list = []
                    count=0
                    for Queryset in queryset: 
                            count = count+1

                            queryset1 = Doctor_ProfessForm_Detials.objects.get(Doctor_ID = Queryset.Doctor_ID)
                            

                            ref_doc_dict={

                                'id': count,
                                'Did':queryset1.Doctor_ID.Doctor_ID,   
                                'DoctorName': f"{queryset1.Doctor_ID.Tittle.Title_Name}.{queryset1.Doctor_ID.First_Name} {queryset1.Doctor_ID.Last_Name}",
                                'PhoneNo' : queryset1.Doctor_ID.Contact_Number,
                                
                            }
                            ReferalDoctorSummary_list.append(ref_doc_dict)
                    return JsonResponse(ReferalDoctorSummary_list,safe=False)

          except Exception as e:
           return JsonResponse({'error': str(e)},status=500)
            
@csrf_exempt
def get_referal_patient_report_details(request):

    if request.method == 'GET':

         try:
           search_query = request.GET.get('search',None)
           limit = request.GET.get('limit', None)
           dept = request.GET.get('dept',None)
           doct = request.GET.get('doct',None)
           from_date = request.GET.get('fromDate', None)
           to_date = request.GET.get('toDate', None)
        

           if dept and not doct:
               
               if dept == str(1):
                          
                 ip_referal_patient = Patient_IP_Registration_Detials.objects.filter(IsReferral='Yes')
                 
                 from_date = datetime.strptime(from_date, '%Y-%m-%d')
                 to_date = datetime.strptime(to_date, '%Y-%m-%d')
                 queryset_ip = ip_referal_patient.filter(created_at__date__range=(from_date, to_date))
                 
                 ip_patient_list=[]
                    
                 for ippatient in queryset_ip:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=ippatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ippatient.DoctorId_id)
                            
                            ip_patient_dict = {


                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            ip_patient_list.append(ip_patient_dict)

                    
                 for idx, patient in enumerate(ip_patient_list, start=1):
                      patient["id"] = idx
                 return JsonResponse(ip_patient_list,safe=False)
               

               elif dept == str(2):
                   
                    op_referal_patient = Patient_Appointment_Registration_Detials.objects.filter(IsReferral='Yes')
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_op = op_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    
                    op_patient_list=[]
                    for oppatient in queryset_op:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=oppatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=oppatient.DoctorId_id)
                            
                            op_patient_dict = {
                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                           }
                            op_patient_list.append(op_patient_dict)
                    for idx, patient in enumerate(op_patient_list, start=1):
                      patient["id"] = idx
                    return JsonResponse(op_patient_list,safe=False)
               elif dept == str(3):
                   
                    Cas_referal_patient = Patient_Casuality_Registration_Detials.objects.filter(IsReferral='Yes') 
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_cas = Cas_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    
                    cas_patient_list=[]
                    
                    for caspatient in queryset_cas:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=caspatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=caspatient.DoctorId_id)
                            
                            cas_patient_dict = {
                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            cas_patient_list.append(cas_patient_dict)
                    for idx, patient in enumerate(cas_patient_list, start=1):
                      patient["id"] = idx
                
                    return JsonResponse(cas_patient_list,safe=False)
               
               elif dept == str(4):
                   
                    ds_referal_patient = Patient_Diagnosis_Registration_Detials.objects.filter(IsReferral='Yes')
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_ds = ds_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    
                    ds_patient_list=[]
                    
                    for dspatient in queryset_ds:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=dspatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=dspatient.DoctorId_id)
                            
                            ds_patient_dict = {


                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"

                            }
                            ds_patient_list.append(ds_patient_dict)
                    
                    for idx, patient in enumerate(ds_patient_list, start=1):
                      patient["id"] = idx
                    return JsonResponse(ds_patient_list,safe=False)
               elif dept == str(5):
                   
                    lab_referal_patient = Patient_Laboratory_Registration_Detials.objects.filter(IsReferral='Yes')
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_lab = lab_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    lab_patient_list=[]
                     
                    for labpatient in queryset_lab:
                                                
                            patient_ins = Patient_Detials.objects.get(PatientId=labpatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=labpatient.DoctorId_id)
                            
                            lab_patient_dict = {


                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"

                            }
                            lab_patient_list.append(lab_patient_dict)
                    
                    for idx, patient in enumerate(lab_patient_list, start=1):
                      patient["id"] = idx
                    return JsonResponse(lab_patient_list,safe=False)
           elif dept and doct:
                
                if dept == str(1):
                        
                 ip_referal_patient = Patient_IP_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
                 from_date = datetime.strptime(from_date, '%Y-%m-%d')
                 to_date = datetime.strptime(to_date, '%Y-%m-%d')
                 queryset_ip = ip_referal_patient.filter(created_at__date__range=(from_date, to_date))
                 
                 ip_patient_list=[]
        
                 for ippatient in queryset_ip:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=ippatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ippatient.DoctorId_id)
                            
                            ip_patient_dict = {


                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            ip_patient_list.append(ip_patient_dict)

                 for idx, patient in enumerate(ip_patient_list, start=1):
                      patient["id"] = idx  
                
                 return JsonResponse(ip_patient_list,safe=False)       
                elif dept == str(2):       
                    op_referal_patient = Patient_Appointment_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_op = op_referal_patient.filter(created_at__date__range=(from_date, to_date))
            
                    op_patient_list=[]
                    for oppatient in queryset_op:
                                    
                            patient_ins = Patient_Detials.objects.get(PatientId=oppatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=oppatient.DoctorId_id)
                            
                            op_patient_dict = {
                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            op_patient_list.append(op_patient_dict)
                           
                    
                    for idx, patient in enumerate(op_patient_list, start=1):
                      patient["id"] = idx 
                    return JsonResponse(op_patient_list,safe=False)
                elif dept == str(3):
                   
                    cas_referal_patient = Patient_Casuality_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_cas = cas_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    cas_patient_list=[]
                    for caspatient in queryset_cas:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=caspatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=caspatient.DoctorId_id)
                            
                            cas_patient_dict = {
                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            cas_patient_list.append(cas_patient_dict)
                    
                    for idx, patient in enumerate(cas_patient_list, start=1):
                      patient["id"] = idx 
                    return JsonResponse(cas_patient_list,safe=False)
                elif dept == str(4):
                   
                    ds_referal_patient = Patient_Diagnosis_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_ds = ds_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    ds_patient_list=[]
                    for dspatient in queryset_ds:
                            
                            print(oppatient.PatientId_id)
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=dspatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=dspatient.DoctorId_id)
                            
                            ds_patient_dict = {
                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            ds_patient_list.append(ds_patient_dict)

                    
                    for idx, patient in enumerate(ds_patient_list, start=1):
                      patient["id"] = idx 
                    return JsonResponse(ds_patient_list,safe=False)
                elif dept == str(5):
                   
                    lab_referal_patient = Patient_Laboratory_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_lab = lab_referal_patient.filter(created_at__date__range=(from_date, to_date))

                    lab_patient_list=[]
                    for labpatient in queryset_lab:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=labpatient.PatientId_id)
                            doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=labpatient.DoctorId_id)
                            
                            lab_patient_dict = {
                                    "patientid":patient_ins.PatientId,
                                    "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                    "PhoneNo":patient_ins.PhoneNo,
                                    "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                            }
                            lab_patient_list.append(lab_patient_dict)
                            print(lab_patient_list)
                    for idx, patient in enumerate(lab_patient_list, start=1):
                      patient["id"] = idx
                
                    return JsonResponse(lab_patient_list,safe=False)                
           elif doct and not dept:
               #fetch data for op patinet
               patient_op_ins = Patient_Appointment_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
               doctor_op_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doct)
               from_date = datetime.strptime(from_date, '%Y-%m-%d')
               to_date = datetime.strptime(to_date, '%Y-%m-%d')
               queryset_op = patient_op_ins.filter(created_at__date__range=(from_date, to_date))
               op_patient_list=[]
               for patient in queryset_op:
                    
                    patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                    op_patient_dict = {
                                        "patientid":patient.PatientId_id,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_op_ins.Tittle.Title_Name}.{doctor_op_ins.First_Name} {doctor_op_ins.Middle_Name}"
                                }
                    op_patient_list.append(op_patient_dict)

               # fetch data for ip patient
               patient_ip_ins = Patient_IP_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
               doctor_ip_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doct)
               from_date1 = from_date.date()
               to_date1 = to_date.date()
               queryset_ip = patient_ip_ins.filter(created_at__date__range=(from_date1, to_date1))
               ip_patient_list=[]
               for patient in queryset_ip:
                    print(patient.PatientId_id)
                    patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                    ip_patient_dict = {
                                        "patientid":patient.PatientId_id,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_ip_ins.Tittle.Title_Name}.{doctor_ip_ins.First_Name} {doctor_ip_ins.Middle_Name}"
                                }
                    op_patient_list.append(ip_patient_dict)

               #fetch data for casuality patient
               patient_cas_ins = Patient_Casuality_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
               doctor_cas_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doct)
               from_date1 = from_date.date()
               to_date1 = to_date.date()
               queryset_cas = patient_cas_ins.filter(created_at__date__range=(from_date1, to_date1))  
               cas_patient_list=[]
               for patient in queryset_cas:
                    
                    patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                    cas_patient_dict = {
                                        "patientid":patient.PatientId_id,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_cas_ins.Tittle.Title_Name}.{doctor_cas_ins.First_Name} {doctor_cas_ins.Middle_Name}"
                                }
                    op_patient_list.append(cas_patient_dict)
  
               # fetch data for  diagnosis patient             
               patient_ds_ins = Patient_Diagnosis_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)
               doctor_ds_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doct)
               from_date1 = from_date.date()
               to_date1 = to_date.date()
               queryset_ds = patient_ds_ins.filter(created_at__date__range=(from_date1, to_date1))
                
               ds_patient_list=[]
               
               for patient in queryset_ds:
                    print(patient.PatientId_id)
                    patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                    ds_patient_dict = {
                                        "patientid":patient.PatientId_id,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_ds_ins.Tittle.Title_Name}.{doctor_ds_ins.First_Name} {doctor_ds_ins.Middle_Name}"
                                }
                    op_patient_list.append(ds_patient_dict)

               #fetch data for lab patient
               patient_lab_ins = Patient_Laboratory_Registration_Detials.objects.filter(IsReferral='Yes',DoctorId_id=doct)   
               doctor_lab_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doct)
               from_date1 = from_date.date()
               to_date1 = to_date.date()
               queryset_lab = patient_lab_ins.filter(created_at__date__range=(from_date1, to_date1))    
               lab_patient_list=[]
               
               for patient in queryset_lab:
                    patient_ins = Patient_Detials.objects.get(PatientId=patient.PatientId_id)
                    lab_patient_dict = {
                                        "patientid":patient.PatientId_id,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_lab_ins.Tittle.Title_Name}.{doctor_lab_ins.First_Name} {doctor_lab_ins.Middle_Name}"
                                }
                    op_patient_list.append(lab_patient_dict)
    
               for idx, patient in enumerate(op_patient_list, start=1):
                      patient["id"] = idx 
               return JsonResponse(op_patient_list,safe=False)   
           elif search_query and not dept and not doct:
               patient_instance = Patient_Detials.objects.filter(Q(PatientId__icontains=search_query) | Q(FirstName__icontains=search_query))

               if patient_instance:
                
                for patient in patient_instance:
                
                    op_referal_patient = Patient_Appointment_Registration_Detials.objects.filter(IsReferral='Yes',PatientId_id=patient.PatientId)
                    from_date = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date = datetime.strptime(to_date, '%Y-%m-%d')
                    queryset_op = op_referal_patient.filter(created_at__date__range=(from_date, to_date))
                    
                    op_patient_list=[]
                    for opref in queryset_op:
                        if opref.DoctorId_id:    
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=opref.DoctorId_id)
                                op_patient_dict = {
                                        "patientid":patient.PatientId,
                                        "patientname": f"{patient.FirstName} {patient.MiddleName}",
                                        "PhoneNo":patient.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                op_patient_list.append(op_patient_dict)
                        

                    ip_referal_patient = Patient_IP_Registration_Detials.objects.filter(IsReferral='Yes',PatientId_id=patient.PatientId)
                    from_date1 = from_date.date()
                    to_date1 = to_date.date()
                    queryset_ip = ip_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                    ip_patient_list=[]
                    for ipref in queryset_ip:
                        if ipref.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ipref.DoctorId_id)
                                ip_patient_dict = {
                                        "patientid":patient.PatientId,
                                        "patientname": f"{patient.FirstName} {patient.MiddleName}",
                                        "PhoneNo":patient.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                op_patient_list.append(ip_patient_dict)

                    cas_referal_patient = Patient_Casuality_Registration_Detials.objects.filter(IsReferral='Yes',PatientId_id=patient.PatientId)
                    
                    from_date1 = from_date.date()
                    to_date1 = to_date.date()
                    queryset_cas = cas_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                    cas_patient_list=[]
                    for casref in queryset_cas:
                        if casref.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=casref.DoctorId_id)
                                cas_patient_dict = {
                                        "patientid":patient.PatientId,
                                        "patientname": f"{patient.FirstName} {patient.MiddleName}",
                                        "PhoneNo":patient.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                
                                op_patient_list.append(cas_patient_dict)

                    lab_referal_patient = Patient_Laboratory_Registration_Detials.objects.filter(IsReferral='Yes',PatientId_id=patient.PatientId)
                    
                    from_date1 = from_date.date()
                    to_date1 = to_date.date()
                    queryset_lab = lab_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                    lab_patient_list=[]
                    for labref in queryset_lab:
                        if labref.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=labref.DoctorId_id)
                                lab_patient_dict = {
                                        "patientid":patient.PatientId,
                                        "patientname": f"{patient.FirstName} {patient.MiddleName}",
                                        "PhoneNo":patient.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                
                                op_patient_list.append(lab_patient_dict)

                    ds_referal_patient = Patient_Diagnosis_Registration_Detials.objects.filter(IsReferral='Yes',PatientId_id=patient.PatientId)
                    
                    from_date1 = from_date.date()
                    to_date1 = to_date.date()
                    queryset_ds = ds_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                    ds_patient_list=[]
                    for dsref in queryset_ds:
                        if dsref.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=dsref.DoctorId_id)
                                ds_patient_dict = {
                                        "patientid":patient.PatientId,
                                        "patientname": f"{patient.FirstName} {patient.MiddleName}",
                                        "PhoneNo":patient.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                
                                op_patient_list.append(ds_patient_dict)
                        
                    print(op_patient_list)
                    for idx, patient in enumerate(op_patient_list, start=1):
                        patient["id"] = idx 
                    return JsonResponse(op_patient_list,safe=False) 
               else:
                     op_patient_list=[]
                     return JsonResponse(op_patient_list,safe=False)        
           elif from_date and to_date and not search_query and not doct:
            
                op_referal_patient = Patient_Appointment_Registration_Detials.objects.filter(IsReferral='Yes')      
                from_date = datetime.strptime(from_date, '%Y-%m-%d')
                to_date = datetime.strptime(to_date, '%Y-%m-%d')
                queryset_op = op_referal_patient.filter(created_at__date__range=(from_date, to_date))
                 
                op_patient_list=[]
                for oppatient in queryset_op:
                        
                        patient_ins = Patient_Detials.objects.get(PatientId=oppatient.PatientId_id)
                        
                        if oppatient.DoctorId_id:
                          doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=oppatient.DoctorId_id)
                        
                          op_patient_dict = {

                                "patientid":patient_ins.PatientId,
                                "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                "PhoneNo":patient_ins.PhoneNo,
                                "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"

                          }
                          op_patient_list.append(op_patient_dict)
                
         

                ip_referal_patient = Patient_IP_Registration_Detials.objects.filter(IsReferral='Yes')
                from_date1 = from_date.date()
                to_date1 = to_date.date()
                queryset_ip = ip_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                ip_patient_list=[]
                                                    
                for ippatient in queryset_ip:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=ippatient.PatientId_id)
                            if ippatient.DoctorId_id:
                                    
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=ippatient.DoctorId_id)
                                
                                ip_patient_dict = {
                                        "patientid":patient_ins.PatientId,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                op_patient_list.append(ip_patient_dict)


                cas_referal_patient = Patient_Casuality_Registration_Detials.objects.filter(IsReferral='Yes')
                from_date1 = from_date.date()
                to_date1 = to_date.date()
                queryset_cas = cas_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                
                cas_patient_list=[]
                                                    
                for caspatient in queryset_cas:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=caspatient.PatientId_id)
                            if caspatient.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=caspatient.DoctorId_id)
                                
                                cas_patient_dict = {
                                        "patientid":patient_ins.PatientId,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                op_patient_list.append(cas_patient_dict)

                ds_referal_patient = Patient_Diagnosis_Registration_Detials.objects.filter(IsReferral='Yes')
                from_date1 = from_date.date()
                to_date1 = to_date.date()
                queryset_ds = ds_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                
                ds_patient_list=[]
                                                    
                for dspatient in queryset_ds:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=dspatient.PatientId_id)
                            if dspatient.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=dspatient.DoctorId_id)
                                
                                ds_patient_dict = {
                                        "patientid":patient_ins.PatientId,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                op_patient_list.append(ds_patient_dict)

                lab_referal_patient = Patient_Laboratory_Registration_Detials.objects.filter(IsReferral='Yes')
                from_date1 = from_date.date()
                to_date1 = to_date.date()
                queryset_lab = lab_referal_patient.filter(created_at__date__range=(from_date1, to_date1))
                print(queryset_lab)
                lab_patient_list=[]
                                                    
                for labpatient in queryset_lab:
                            
                            patient_ins = Patient_Detials.objects.get(PatientId=labpatient.PatientId_id)
                            if labpatient.DoctorId_id:
                                doctor_ins = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=labpatient.DoctorId_id)
                                
                                lab_patient_dict = {
                                        "patientid":patient_ins.PatientId,
                                        "patientname": f"{patient_ins.FirstName} {patient_ins.MiddleName}",
                                        "PhoneNo":patient_ins.PhoneNo,
                                        "doctorname":f"{doctor_ins.Tittle.Title_Name}.{doctor_ins.First_Name} {doctor_ins.Middle_Name}"
                                }
                                op_patient_list.append(lab_patient_dict)

                for idx, patient in enumerate(op_patient_list, start=1):
                      patient["id"] = idx   
                
                return JsonResponse(op_patient_list,safe=False)
                           
                                             
           else:
               return JsonResponse('success',safe=False)

           return JsonResponse('success',safe=False)   

         
         except Exception as e:
           return JsonResponse({'error': str(e)},status=500)


@csrf_exempt
def get_total_patient_report_details(request):
  if request.method == 'GET':
     try:
        VisitPurpose = request.GET.get('VisitPurpose',None)
        search_query = request.GET.get('search', None)

        patient_ins = Patient_Appointment_Registration_Detials.objects.all()
        patient_list = []

        if VisitPurpose and not search_query:
             patient_vp_ins = Patient_Appointment_Registration_Detials.objects.filter(VisitPurpose=VisitPurpose)
            
             for patient in patient_vp_ins:
                  
                  vp_patient_dict = {
                       
                  "PatientName":f"{patient.PatientId.FirstName}{patient.PatientId.MiddleName}",
                  "gender" : patient.PatientId.Gender,
                  "phoneno": patient.PatientId.PhoneNo
                       
                  }

                  patient_list.append(vp_patient_dict)

        elif search_query:
             
             patient_instance = Patient_Detials.objects.filter(Q(PatientId__icontains=search_query) | Q(FirstName__icontains=search_query))
             if patient_instance:
                  for patient in patient_instance:
                       Patient_data = Patient_Appointment_Registration_Detials.objects.filter(PatientId_id=patient.PatientId)
                       for patient_search in Patient_data:
                            all_patient_dict = {     
                                "PatientName":f"{patient_search.PatientId.FirstName}{patient_search.PatientId.MiddleName}",
                                "gender" : patient_search.PatientId.Gender,
                                "phoneno": patient_search.PatientId.PhoneNo
                            }
                            patient_list.append(all_patient_dict)
                        
        else:
           for patient in patient_ins:
                        all_patient_dict = {     
                                "PatientName":f"{patient.PatientId.FirstName}{patient.PatientId.MiddleName}",
                                "gender" : patient.PatientId.Gender,
                                "phoneno": patient.PatientId.PhoneNo
                        }
                        patient_list.append(all_patient_dict)

        for idx, patient in enumerate(patient_list, start=1):
                      patient["id"] = idx 
        return JsonResponse(patient_list,safe=False)
     
     except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
















# get inhouse doctor list
 
@csrf_exempt
@require_http_methods(["GET"])
def get_inhouse_doctor_list(request):
     
     if request.method == 'GET':
         
          try:
         
                inhouse_ins = Doctor_Personal_Form_Detials.objects.filter(DoctorType = 'InHouse')
                doct_list = []
 
                for datas in inhouse_ins:
 
                        data_list ={
                             
                             'id' : datas.Doctor_ID,
                             'Doctorname' : f'{datas.Tittle.Title_Name}.{datas.First_Name}{datas.Middle_Name}{datas.Last_Name}',
 
                        }
                        doct_list.append(data_list)
                       
 
                return JsonResponse(doct_list,safe=False)
 
          except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 
@csrf_exempt
@require_http_methods(["GET"])
def get_inhouse_doctor_related_patient_list(request):
    try:
        # Get parameters
        doctorid = request.GET.get('doctorid', None)
        searchdept = request.GET.get('searchDept', None)
        currentDate = request.GET.get('currentDate', None)
        from_date = request.GET.get('fromDate', None)
        to_date = request.GET.get('toDate', None)
        search_query = request.GET.get('searchQuery', None)  # New search query parameter
 
        print(f"doctor id : {doctorid}")
        print(f"search dept is : {searchdept}")
        print(f"current date is {currentDate}")
        print(f"from date : {from_date}, to date : {to_date}")
        print(f"search query {search_query}")
 
        doctor_related_patient_list = []
        inhouse_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.all()
        data_list = []
        ip_registration_ins = Patient_IP_Registration_Detials.objects.all()
        # If search department is 'OP', fetch patients from Patient_Appointment_Registration_Detials
        if searchdept == 'OP':
            # Get the appointment details from Patient_Appointment_Registration_Detials
            inhouse_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.all()
 
            if doctorid:
                inhouse_ins = inhouse_ins.filter(PrimaryDoctor__Doctor_ID=doctorid)
 
            # Filter by department
            if searchdept:
                inhouse_ins = inhouse_ins.filter(Registration_Id__VisitPurpose=searchdept)
 
            # Filter by current date
            if currentDate:
                try:
                    currentDate_obj = datetime.strptime(currentDate, '%Y-%m-%d').date()
                    inhouse_ins = inhouse_ins.filter(created_at__date=currentDate_obj)
                except ValueError as e:
                    print(f"An error occurred: {str(e)}")
                    return JsonResponse({'error': 'Invalid currentDate format. Expected YYYY-MM-DD.'}, status=400)
 
            # Filter by custom date range
            if from_date and to_date:
                try:
                    from_date_obj = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date_obj = datetime.strptime(to_date, '%Y-%m-%d') + timedelta(days=1)
                    inhouse_ins = inhouse_ins.filter(created_at__range=[from_date_obj, to_date_obj])
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format for fromDate or toDate. Expected YYYY-MM-DD.'}, status=400)
 
            # Search by patient name or ID
            if search_query:
                inhouse_ins = inhouse_ins.filter(
                    Q(Registration_Id__PatientId__FirstName=search_query) |
                    Q(Registration_Id__PatientId__PatientId__icontains=search_query)
                )
 
            # Add data from Patient_Appointment_Registration_Detials to list
            for datas in inhouse_ins:
                data_list = {
                    'patientid': datas.Registration_Id.PatientId.PatientId,
                    'patientname': datas.Registration_Id.PatientId.FirstName,
                    'phoneno': datas.Registration_Id.PatientId.PhoneNo,
                    'gender': datas.Registration_Id.PatientId.Gender,
                    'age': datas.Registration_Id.PatientId.Age,
                    'doctorid': datas.PrimaryDoctor.Doctor_ID,
                }
                doctor_related_patient_list.append(data_list)
 
        # If search department is 'IP', fetch patients from Patient_IP_Registration_Detials
        elif searchdept == 'IP':
            ip_registration_ins = Patient_IP_Registration_Detials.objects.all()
 
            if doctorid:
                ip_registration_ins = ip_registration_ins.filter(PrimaryDoctor_id=doctorid)
 
            # Filter by current date
            if currentDate:
                try:
                    currentDate_obj = datetime.strptime(currentDate, '%Y-%m-%d').date()
                    ip_registration_ins = ip_registration_ins.filter(created_at__date=currentDate_obj)
                except ValueError as e:
                    print(f"An error occurred: {str(e)}")
                    return JsonResponse({'error': 'Invalid currentDate format. Expected YYYY-MM-DD.'}, status=400)
 
            # Filter by custom date range
            if from_date and to_date:
                try:
                    from_date_obj = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date_obj = datetime.strptime(to_date, '%Y-%m-%d') + timedelta(days=1)
                    ip_registration_ins = ip_registration_ins.filter(created_at__range=[from_date_obj, to_date_obj])
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format for fromDate or toDate. Expected YYYY-MM-DD.'}, status=400)
 
            # Search by patient name or ID
            if search_query:
                ip_registration_ins = ip_registration_ins.filter(
                    Q(PatientId__FirstName__icontains=search_query) |
                    Q(PatientId__PatientId__icontains=search_query)
                )
 
            # Add data from Patient_IP_Registration_Detials to list
            for datas in ip_registration_ins:
                data_list = {
                    'patientid': datas.PatientId.PatientId,
                    'patientname': datas.PatientId.FirstName,
                    'phoneno': datas.PatientId.PhoneNo,
                    'gender': datas.PatientId.Gender,
                    'age': datas.PatientId.Age,
                    'doctorid': datas.PrimaryDoctor.Doctor_ID if datas.PrimaryDoctor else '',
                }
                doctor_related_patient_list.append(data_list)
 
        # Return the combined data (either OP or IP based on searchDept)
       
   
        else :
             # Get the appointment details from Patient_Appointment_Registration_Detials
            inhouse_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.all()
 
            if doctorid:
                inhouse_ins = inhouse_ins.filter(PrimaryDoctor__Doctor_ID=doctorid)
 
            # Filter by department
            if searchdept:
                inhouse_ins = inhouse_ins.filter(Registration_Id__VisitPurpose=searchdept)
 
            # Filter by current date
            if currentDate:
                try:
                    currentDate_obj = datetime.strptime(currentDate, '%Y-%m-%d').date()
                    inhouse_ins = inhouse_ins.filter(created_at__date=currentDate_obj)
                except ValueError as e:
                    print(f"An error occurred: {str(e)}")
                    return JsonResponse({'error': 'Invalid currentDate format. Expected YYYY-MM-DD.'}, status=400)
 
            # Filter by custom date range
            if from_date and to_date:
                try:
                    from_date_obj = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date_obj = datetime.strptime(to_date, '%Y-%m-%d') + timedelta(days=1)
                    inhouse_ins = inhouse_ins.filter(created_at__range=[from_date_obj, to_date_obj])
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format for fromDate or toDate. Expected YYYY-MM-DD.'}, status=400)
 
            # Search by patient name or ID
            if search_query:
                inhouse_ins = inhouse_ins.filter(
                     Q(Registration_Id__PatientId__FirstName=search_query) |
                    Q(Registration_Id__PatientId__PatientId__icontains=search_query)
                )
 
            # Add data from Patient_Appointment_Registration_Detials to list
            for datas in inhouse_ins:
                data_list = {
                    'patientid': datas.Registration_Id.PatientId.PatientId,
                    'patientname': datas.Registration_Id.PatientId.FirstName,
                    'phoneno': datas.Registration_Id.PatientId.PhoneNo,
                    'gender': datas.Registration_Id.PatientId.Gender,
                    'age': datas.Registration_Id.PatientId.Age,
                    'doctorid': datas.PrimaryDoctor.Doctor_ID if datas.PrimaryDoctor else '',
                }
                doctor_related_patient_list.append(data_list)
                ip_registration_ins = Patient_IP_Registration_Detials.objects.all()
 
            if doctorid:
                ip_registration_ins = ip_registration_ins.filter(PrimaryDoctor_id=doctorid)
 
            # Filter by current date
            if currentDate:
                try:
                    currentDate_obj = datetime.strptime(currentDate, '%Y-%m-%d').date()
                    ip_registration_ins = ip_registration_ins.filter(created_at__date=currentDate_obj)
                except ValueError as e:
                    print(f"An error occurred: {str(e)}")
                    return JsonResponse({'error': 'Invalid currentDate format. Expected YYYY-MM-DD.'}, status=400)
 
            # Filter by custom date range
            if from_date and to_date:
                try:
                    from_date_obj = datetime.strptime(from_date, '%Y-%m-%d')
                    to_date_obj = datetime.strptime(to_date, '%Y-%m-%d')+ timedelta(days=1)
                    ip_registration_ins = ip_registration_ins.filter(created_at__range=[from_date_obj, to_date_obj])
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format for fromDate or toDate. Expected YYYY-MM-DD.'}, status=400)
 
            # Search by patient name or ID
            if search_query:
                ip_registration_ins = ip_registration_ins.filter(
                    Q(PatientId__FirstName__icontains=search_query) |
                    Q(PatientId__PatientId__icontains=search_query)
                )
 
            # Add data from Patient_IP_Registration_Detials to list
            for datas in ip_registration_ins:
                data_list = {
                    'patientid': datas.PatientId.PatientId,
                    'patientname': datas.PatientId.FirstName,
                    'phoneno': datas.PatientId.PhoneNo,
                    'gender': datas.PatientId.Gender,
                    'age': datas.PatientId.Age,
                    'doctorid': datas.PrimaryDoctor.Doctor_ID if datas.PrimaryDoctor else '' ,
                }
                doctor_related_patient_list.append(data_list)
 
            print(data_list)
        return JsonResponse(doctor_related_patient_list, safe=False)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500) 