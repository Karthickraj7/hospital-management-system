from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import *



# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def DiseaseName_Master_link(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
            
#             DiseaseNameId = data.get('DiseaseNameId', '')
#             DiseaseName = data.get('DiseaseName')
#             IsChronicle = data.get('IsChronicle', 'No')
#             IsCommunicable = data.get('IsCommunicable', 'No')
#             SpecialityNames = data.get('SpecialityNames', '')
#             Statusedit = data.get('Statusedit', False)

#             if DiseaseNameId:
#                 if Statusedit:
#                     DiseaseName_instance = DiseaseNameMasterDetails.objects.get(pk=DiseaseNameId)
#                     DiseaseName_instance.Status = not DiseaseName_instance.Status
#                     DiseaseName_instance.save()
#                     return JsonResponse({'success': 'DiseaseName status updated successfully'})
#                 else:
#                     DiseaseName_instance = DiseaseNameMasterDetails.objects.get(pk=DiseaseNameId)
#                     DiseaseName_instance.DiseaseName = DiseaseName
#                     DiseaseName_instance.IsChronicle = IsChronicle
#                     DiseaseName_instance.IsCommunicable = IsCommunicable
#                     DiseaseName_instance.SpecialityNames = SpecialityNames
#                     DiseaseName_instance.save()
#                     return JsonResponse({'success': 'DiseaseName updated successfully'})
#             else:
#                 if DiseaseNameMasterDetails.objects.filter(DiseaseName=DiseaseName).exists():
#                     return JsonResponse({'warn': f"The {DiseaseName} already exists."})
                
#                 DiseaseName_instance = DiseaseNameMasterDetails(
#                     DiseaseName=DiseaseName,
#                     IsChronicle=IsChronicle,
#                     IsCommunicable=IsCommunicable,
#                     SpecialityNames=SpecialityNames
#                 )
#                 DiseaseName_instance.save()
#                 return JsonResponse({'success': 'DiseaseName added successfully'})

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
#     elif request.method == 'GET':
#         try:
#             DiseaseNames = DiseaseNameMasterDetails.objects.all()
#             DiseaseName_data = []
            
#             for disease in DiseaseNames:
#                 disease_dict = {
#                     'id': disease.pk,
#                     'DiseaseName': disease.DiseaseName,
#                     'IsChronicle': disease.IsChronicle,
#                     'IsCommunicable': disease.IsCommunicable,
#                     'SpecialityNames': disease.SpecialityNames,
#                     'Status': 'Active' if disease.Status else 'Inactive',
#                 }
#                 DiseaseName_data.append(disease_dict)
            
#             return JsonResponse(DiseaseName_data, safe=False)
        
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def DiseaseName_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            DiseaseNameId = data.get('DiseaseNameId')
            DiseaseName = data.get('DiseaseName')
            IsChronicle = data.get('IsChronicle', 'No')
            IsCommunicable = data.get('IsCommunicable', 'No')
            SpecialityIds = data.get('SpecialityNames', [])  # Should be a list of IDs
            Statusedit = data.get('Statusedit', False)

            if DiseaseNameId:
                DiseaseName_instance = DiseaseNameMasterDetails.objects.get(pk=DiseaseNameId)

                if Statusedit:
                    DiseaseName_instance.Status = not DiseaseName_instance.Status
                    DiseaseName_instance.save()
                    return JsonResponse({'success': 'DiseaseName status updated successfully'})

                # Update existing disease
                DiseaseName_instance.DiseaseName = DiseaseName
                DiseaseName_instance.IsChronicle = IsChronicle
                DiseaseName_instance.IsCommunicable = IsCommunicable
                DiseaseName_instance.save()
                DiseaseName_instance.SpecialityNames.set(SpecialityIds)  # ✅ This is the correct way
                return JsonResponse({'success': 'DiseaseName updated successfully'})

            else:
                # Check for duplicates
                if DiseaseNameMasterDetails.objects.filter(DiseaseName=DiseaseName).exists():
                    return JsonResponse({'warn': f"The {DiseaseName} already exists."})

                # Create new disease
                DiseaseName_instance = DiseaseNameMasterDetails.objects.create(
                    DiseaseName=DiseaseName,
                    IsChronicle=IsChronicle,
                    IsCommunicable=IsCommunicable
                )
                DiseaseName_instance.SpecialityNames.set(SpecialityIds)  # ✅ Set many-to-many after save
                return JsonResponse({'success': 'DiseaseName added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            DiseaseNames = DiseaseNameMasterDetails.objects.all()
            DiseaseName_data = []

            for disease in DiseaseNames:
                disease_dict = {
                    'id': disease.pk,
                    'DiseaseName': disease.DiseaseName,
                    'IsChronicle': disease.IsChronicle,
                    'IsCommunicable': disease.IsCommunicable,
                    'SpecialityNames': list(disease.SpecialityNames.values_list('Speciality_Id', flat=True)),  # ✅ Ensure this works
                    # 'Speciality': list(disease.SpecialityNames.values_list('Speciality_Name', flat=True)),  # ✅ Ensure this works
                    'Speciality': ', '.join(disease.SpecialityNames.values_list('Speciality_Name', flat=True)),
                    'Status': 'Active' if disease.Status else 'Inactive',
                }
                DiseaseName_data.append(disease_dict)

            return JsonResponse(DiseaseName_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def PrimaryComplaint_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data,'data----')
            
            PrimaryComplaintId = data.get('PrimaryComplaintId', '')
            PrimaryComplaintName = data.get('PrimaryComplaintName')
            Statusedit = data.get('Statusedit', False)

            if PrimaryComplaintId:
                if Statusedit:
                    PrimaryComplaint_instance = PrimaryComplaintMaster.objects.get(pk=PrimaryComplaintId)
                    PrimaryComplaint_instance.Status = not PrimaryComplaint_instance.Status
                    PrimaryComplaint_instance.save()
                    return JsonResponse({'success': 'PrimaryComplaintName status updated successfully'})
                else:
                    PrimaryComplaint_instance = PrimaryComplaintMaster.objects.get(pk=PrimaryComplaintId)
                    print('22222---------')
                    print(PrimaryComplaint_instance,'PrimaryComplaint_instance--------')
                    PrimaryComplaint_instance.PrimaryComplaintName = PrimaryComplaintName
                    PrimaryComplaint_instance.save()
                    print('wwwwww')
                    return JsonResponse({'success': 'PrimaryComplaint updated successfully'})
            else:
                if PrimaryComplaintMaster.objects.filter(PrimaryComplaintName=PrimaryComplaintName).exists():
                    return JsonResponse({'warn': f"The {PrimaryComplaintName} already exists."})
                
                PrimaryComplaint_instance = PrimaryComplaintMaster(
                    PrimaryComplaintName=PrimaryComplaintName,
                   
                )
                PrimaryComplaint_instance.save()
                return JsonResponse({'success': 'PrimaryComplaint added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            PrimaryComplaint = PrimaryComplaintMaster.objects.all()
            PrimaryComplaint_data = []
            
            for disease in PrimaryComplaint:
                disease_dict = {
                    'id': disease.pk,
                    'PrimaryComplaintName': disease.PrimaryComplaintName,
                    'Status': 'Active' if disease.Status else 'Inactive',
                }
                PrimaryComplaint_data.append(disease_dict)
            
            return JsonResponse(PrimaryComplaint_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
 

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def ChiefComplaint_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            ChiefComplaintId = data.get('ChiefComplaintId', '')
            PrimaryComplaints = data.get('PrimaryComplaints')
            ChiefComplaintName = data.get('ChiefComplaintName')
            Statusedit = data.get('Statusedit', False)

            PrimaryComplaints_instance=None
            PrimaryComplaints_instance=PrimaryComplaintMaster.objects.filter(pk=PrimaryComplaints).first()
                
            if ChiefComplaintId:
                if Statusedit:
                    ChiefComplaint_instance = ChiefComplaintMaster.objects.get(pk=ChiefComplaintId)
                    ChiefComplaint_instance.Status = not ChiefComplaint_instance.Status
                    ChiefComplaint_instance.save()
                    return JsonResponse({'success': 'ChiefComplaint status updated successfully'})
                else:
                    ChiefComplaint_instance = ChiefComplaintMaster.objects.get(pk=ChiefComplaintId)
                    ChiefComplaint_instance.PrimaryComplaintName = PrimaryComplaints_instance
                    ChiefComplaint_instance.ChiefComplaintName = ChiefComplaintName
                    ChiefComplaint_instance.save()
                    return JsonResponse({'success': 'ChiefComplaint updated successfully'})
            else:
                if ChiefComplaintMaster.objects.filter(ChiefComplaintName=ChiefComplaintName,PrimaryComplaintName=PrimaryComplaints).exists():
                    return JsonResponse({'warn': f"The {ChiefComplaintName} already exists."})
                
               
                ChiefComplaint_instance = ChiefComplaintMaster(
                    PrimaryComplaintName=PrimaryComplaints_instance,
                    ChiefComplaintName=ChiefComplaintName,
                )
                ChiefComplaint_instance.save()
                return JsonResponse({'success': 'ChiefComplaint added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:

            PrimaryComplaint = request.GET.get('PrimaryComplaint')
            if PrimaryComplaint:
                ChiefComplaint = ChiefComplaintMaster.objects.filter(PrimaryComplaintName__pk=PrimaryComplaint)
            else:

                ChiefComplaint = ChiefComplaintMaster.objects.all()
                ChiefComplaint_data = []
            
            
                for idx, disease in enumerate(ChiefComplaint, start=1):
                    disease_dict = {
                        'id': disease.pk,
                        'Idx':idx,
                        'ChiefComplaintName': disease.ChiefComplaintName,
                        'PrimaryComplaintId': disease.PrimaryComplaintName.pk if disease.PrimaryComplaintName else '',
                        'PrimaryComplaintName': disease.PrimaryComplaintName.PrimaryComplaintName if disease.PrimaryComplaintName else '',
                        'Status': 'Active' if disease.Status else 'Inactive',
                    }
                    ChiefComplaint_data.append(disease_dict)
                    
            
                return JsonResponse(ChiefComplaint_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
  



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def History_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            HistoryId = data.get('HistoryId', '')
            PrimaryComplaint = data.get('PrimaryComplaint')
            ChiefComplaint = data.get('ChiefComplaint')
            HistoryName = data.get('HistoryName')
            Statusedit = data.get('Statusedit', False)

            PrimaryComplaints_instance=None
            ChiefComplaint_instance=None

            PrimaryComplaints_instance=PrimaryComplaintMaster.objects.filter(pk=PrimaryComplaint).first()
            ChiefComplaint_instance = ChiefComplaintMaster.objects.filter(pk=ChiefComplaint).first()
            

            if HistoryId:
                if Statusedit:
                    History_instance = HistoryMaster.objects.get(pk=HistoryId)
                    History_instance.Status = not History_instance.Status
                    History_instance.save()
                    return JsonResponse({'success': 'History status updated successfully'})
                else:
                    History_instance = HistoryMaster.objects.get(pk=HistoryId)
                    History_instance.PrimaryComplaintName = PrimaryComplaints_instance
                    History_instance.ChiefComplaintName = ChiefComplaint_instance
                    History_instance.HistoryName = HistoryName
                    History_instance.save()
                    return JsonResponse({'success': 'History updated successfully'})
            else:
                if HistoryMaster.objects.filter(HistoryName=HistoryName).exists():
                    return JsonResponse({'warn': f"The {HistoryName} already exists."})
                
                ChiefComplaint_instance = HistoryMaster(
                    PrimaryComplaintName=PrimaryComplaints_instance,
                    ChiefComplaintName=ChiefComplaint_instance,
                    HistoryName=HistoryName,

                )
                ChiefComplaint_instance.save()
                return JsonResponse({'success': 'History added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            History = HistoryMaster.objects.all()
            History_data = []
            
            for disease in History:
                disease_dict = {
                    'id': disease.pk if disease else '',
                    'HistoryId': disease.pk if disease else '',
                    'HistoryName': disease.HistoryName if disease else '',
                    'PrimaryComplaintId': disease.PrimaryComplaintName.pk if disease.PrimaryComplaintName else '',
                    'PrimaryComplaintName': disease.PrimaryComplaintName.PrimaryComplaintName if disease.PrimaryComplaintName else '',
                    'ChiefComplaintId': disease.ChiefComplaintName.pk if disease.ChiefComplaintName else '',
                    'ChiefComplaintName': disease.ChiefComplaintName.ChiefComplaintName if disease.ChiefComplaintName else '',

                    'Status': 'Active' if disease.Status else 'Inactive',
                }
                History_data.append(disease_dict)
            
            return JsonResponse(History_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
  

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Examination_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            ExaminationId = data.get('ExaminationId', '')
            ExaminationName = data.get('ExaminationName')
            Statusedit = data.get('Statusedit', False)

            if ExaminationId:
                if Statusedit:
                    Examination_instance = ExaminationMaster.objects.get(pk=ExaminationId)
                    Examination_instance.Status = not Examination_instance.Status
                    Examination_instance.save()
                    return JsonResponse({'success': 'Examination status updated successfully'})
                else:
                    Examination_instance = ExaminationMaster.objects.get(pk=ExaminationId)
                    Examination_instance.ExaminationName = ExaminationName
                    Examination_instance.save()
                    return JsonResponse({'success': 'Examination updated successfully'})
            else:
                if ExaminationMaster.objects.filter(ExaminationName=ExaminationName).exists():
                    return JsonResponse({'warn': f"The {ExaminationName} already exists."})
                
                Examination_instance = ExaminationMaster(
                    ExaminationName=ExaminationName,
                )
                Examination_instance.save()
                return JsonResponse({'success': 'Examination added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            Examination = ExaminationMaster.objects.all()
            Examination_data = []
            
            for disease in Examination:
                disease_dict = {
                    'id': disease.pk if disease else '',
                    'Examinationid': disease.pk if disease else '',
                    'ExaminationName': disease.ExaminationName,
                    'Status': 'Active' if disease.Status else 'Inactive',
                }
                Examination_data.append(disease_dict)
            
            return JsonResponse(Examination_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    




# def common_master_view(request, model, endpoint_name):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             id = data.get('id', '')
#             name = data.get('name')
#             Statusedit = data.get('Statusedit', False)

#             if id:
#                 if Statusedit:
#                     instance = model.objects.get(pk=id)
#                     instance.Status = not instance.Status
#                     instance.save()
#                     return JsonResponse({'success': f'{endpoint_name} status updated successfully'})
#                 else:
#                     instance = model.objects.get(pk=id)
#                     instance.name = name
#                     instance.save()
#                     return JsonResponse({'success': f'{endpoint_name} updated successfully'})
#             else:
#                 if model.objects.filter(name=name).exists():
#                     return JsonResponse({'warn': f"The {name} already exists."})
#                 instance = model(name=name)
#                 instance.save()
#                 return JsonResponse({'success': f'{endpoint_name} added successfully'})

#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#     elif request.method == 'GET':
#         try:
#             key_complaint = request.GET.get('KeyComplaint', None)
#             if hasattr(model, 'KeyComplaint'):  
#                 if key_complaint:
#                     items = model.objects.filter(KeyComplaint=key_complaint, Status=True)
#                 else:
#                     items = model.objects.filter(Status=True)
#             else:
#                 items = model.objects.filter(Status=True)  

#             data = [{'id': item.pk, 'name': item.name, 'Status': 'Active' if item.Status else 'Inactive'} for item in items]
#             return JsonResponse(data, safe=False)
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def PrimaryComplaint_Master_link(request):
#     return common_master_view(request, PrimaryComplaintMaster, 'PrimaryComplaint')

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def ChiefComplaint_Master_link(request):
#     return common_master_view(request, ChiefComplaintMaster, 'ChiefComplaint')

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def History_Master_link(request):
#     return common_master_view(request, HistoryMaster, 'History')

# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Examination_Master_link(request):
#     return common_master_view(request, ExaminationMaster, 'Examination')