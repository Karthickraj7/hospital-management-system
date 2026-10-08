from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import *
from PIL import Image
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
import base64
# import magic
import filetype
import json
from django.db.models import Q
from django.db import transaction

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Insurance_Client_Master_Detials_link(request):
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

    if request.method == 'POST':
        try:
            # data = request.POST
            data = json.loads(request.body)
            MasterType = data.get('MasterType', '')
            # print("data",data)
            # Insurance data
            Code = data.get('Code', '')
            Name = data.get('Name', '')   
            MsType = data.get('Type', '')
            PayerZone = data.get('PayerZone', '')  # Corrected key
            PayerMemberId = data.get('PayerMemberId', '')

            ContactPerson = data.get('ContactPerson', '')
            Designation = data.get('Designation', '')
            PancardNo = data.get('PancardNo', '')
            MsCIN = data.get('CIN', '')
            MsTAN = data.get('TAN', '')
            MailId = data.get('MailId', '')
            PhoneNumber = data.get('PhoneNumber', '')
            AlternateNumber = data.get('AlternateNumber','')
            Address = data.get('Address', '')

            AddDocuments = data.get('AddDocuments', None)
            AddDocumentsDonation = data.get('AddDocumentsDonation', None)
          
            AddDocumentsClient = data.get('AddDocumentsClient', None)
            
            AddDocumentsCorporate = data.get('AddDocumentsCorporate', None)
          



            created_by = data.get('created_by', '')
            with transaction.atomic():
                if MasterType == 'Insurance':
                    if Code:
                        if Insurance_Master_Detials.objects.filter(
                            Insurance_Name=Name).exclude(pk=Code).exists():
                            return JsonResponse({'warn': 'Insurance Name already exists'})
                        
                        else:
                            Insurance_instance = Insurance_Master_Detials.objects.get(pk=Code)
                            Insurance_instance.Insurance_Name = Name
                            Insurance_instance.Payer_Zone = PayerZone
                            Insurance_instance.PayerMember_Id = PayerMemberId
                            Insurance_instance.ContactPerson = ContactPerson
                            Insurance_instance.MailId = MailId
                            Insurance_instance.PhoneNumber = PhoneNumber
                            Insurance_instance.AlternateNumber = AlternateNumber
                            Insurance_instance.Address = Address
                            Insurance_instance.save()
                            if AddDocuments:
                                for item in AddDocuments:
                                    label = item.get('label','')
                                    file = item.get('file', None)
                                    code = item.get('code','')      
                                    if code:
                                        try:
                                            adddocument_ins = Insurance_File_Detials.objects.get(InsuranceFile_Id=code)
                                            status = item.get('Status')
                                            print("statausupdate",status)
                                            if status == "Active":
                                                adddocument_ins.Status = True
                                            elif status == "Inactive":
                                                adddocument_ins.Status = False
                                            adddocument_ins.save()
                                        
                                        except Insurance_File_Detials.DoesNotExist:
                                            print(f"No document found with code {code}.")
                                            return JsonResponse({'warn': f"No document found with code {code}."})
                                            
                                            
                                    else:
                                        if file:
                                            processedfile = validate_and_process_file(file) if file  else None
                                            adddocument_ins = Insurance_File_Detials.objects.create(
                                                InsuranceFile_Name=label,
                                                InsuranceMaster_Name=Insurance_instance,
                                                FileDocuments=processedfile,
                                            )   
                                            
 
                            return JsonResponse({'success': f'{MasterType} Details Updated successfully'})
                    else:
                        if Insurance_Master_Detials.objects.filter(
                            Insurance_Name=Name).exists():
                            return JsonResponse({'warn': 'Insurance Name already exists'})

                        Insurance_instance = Insurance_Master_Detials.objects.create(
                            Insurance_Name=Name,
                            Payer_Zone=PayerZone,
                            PayerMember_Id=PayerMemberId,
                            ContactPerson=ContactPerson,
                            MailId=MailId,
                            PhoneNumber=PhoneNumber,
                            AlternateNumber=AlternateNumber,
                            Address=Address,
                            created_by=created_by
                        )
                        if AddDocuments:
                            print("asdsdsdfd")
                            for item in AddDocuments:
                                # print("item",item)
                                print("89",item.get('label'))
                                label = item.get('label','')
                                file = item.get('file', None)
                                
                                if file:
                                    processedfile = validate_and_process_file(file) if file  else None
                                adddocument_ins = Insurance_File_Detials.objects.create(
                                    InsuranceFile_Name=label,
                                    InsuranceMaster_Name=Insurance_instance,
                                    FileDocuments=processedfile,
                                )

                                
                            
                        return JsonResponse({'success': f'{MasterType} Details added successfully'})
                    
                elif MasterType == 'Client':
                    if Code:
                        if Client_Master_Detials.objects.filter(Client_Name=Name).exclude(pk=Code).exists():
                            return JsonResponse({'warn': 'Client Name already exists'})
                        else:  
                            Client_instance = Client_Master_Detials.objects.get(pk=Code)
                            Client_instance.Client_Name = Name
                            Client_instance.ContactPerson = ContactPerson
                            Client_instance.MailId = MailId
                            Client_instance.PhoneNumber = PhoneNumber
                            Client_instance.AlternateNumber = AlternateNumber
                            Client_instance.Address = Address
                            Client_instance.save()
                            if AddDocumentsClient:
                                for item in AddDocumentsClient:
                                    labelclient = item.get('label','')
                                    fileclient = item.get('file', None)
                                    codeclient = item.get('code','')
                                    if codeclient:
                                        try:
                                            clientadddocument_ins = Client_File_Detials.objects.get(ClientFile_Id=codeclient)
                                            status = item.get('Status')
                                            if status == "Active":
                                                clientadddocument_ins.Status = True
                                            elif status == "Inactive":
                                                clientadddocument_ins.Status = False
                                            clientadddocument_ins.save()
                                        except Client_File_Detials.DoesNotExist:
                                            print(f"No document found with code {code}.")
                                            return JsonResponse({'warn': f"No document found with code {code}."})    
                                    else:
                                        
                                        if fileclient:
                                            processedfileclient = validate_and_process_file(fileclient) if fileclient  else None
                                            clientadddocument_ins = Client_File_Detials.objects.create(
                                                ClientFile_Name=labelclient,
                                                ClientMaster_Name=Client_instance,
                                                FileDocuments=processedfileclient,
                                            )                                        
                                    
                            return JsonResponse({'success': f'{MasterType} Details Updated successfully'})
                    else:
                        if Client_Master_Detials.objects.filter(Client_Name=Name).exists():
                            return JsonResponse({'warn': 'Client Name already exists'})

                        Client_instance = Client_Master_Detials.objects.create(
                            Client_Name=Name,
                            ContactPerson=ContactPerson,
                            MailId=MailId,
                            PhoneNumber=PhoneNumber,
                            AlternateNumber=AlternateNumber,
                            Address=Address,
                            created_by=created_by
                        )
                        if AddDocumentsClient:
                            print("asdsdsdfd")
                            for item in AddDocumentsClient:
                                # print("item",item)
                                print("89",item.get('label'))
                                labelclient = item.get('label','')
                                fileclient = item.get('file', None)
                                if fileclient:
                                    processedfileclient = validate_and_process_file(fileclient) if fileclient  else None
                                clientadddocument_ins = Client_File_Detials.objects.create(
                                    ClientFile_Name=labelclient,
                                    ClientMaster_Name=Client_instance,
                                    FileDocuments=processedfileclient,
                                   
                                )
  
                            
                        return JsonResponse({'success': f'{MasterType} Details added successfully'})
                
                elif MasterType == 'Corporate':
                    if Code:
                        print("updateCode",Code)
                        if Corporate_Master_Detials.objects.filter(Corporate_Name=Name).exclude(pk=Code).exists():
                            return JsonResponse({'warn':'Corporate Name already exists'})
                        else:
                            print("900")
                            Corporate_instance = Corporate_Master_Detials.objects.get(pk=Code)
                            print("Corporate_instance",Corporate_instance)
                            Corporate_instance.Corporate_Name = Name
                            Corporate_instance.ContactPerson = ContactPerson
                            Corporate_instance.MailId = MailId
                            Corporate_instance.PhoneNumber = PhoneNumber
                            Corporate_instance.AlternateNumber = AlternateNumber
                            Corporate_instance.Address = Address
                            Corporate_instance.save()
                            if AddDocumentsCorporate:
                                for item in AddDocumentsCorporate:
                                    labelcorporate = item.get('label','')
                                    codecorporate = item.get('code', '')
                                    print("codecorporate",codecorporate)
                                    filecorporate = item.get('file', None)
                                    if codecorporate:
                                        try:
                                            corporateadddocument_ins = Corporate_File_Detials.objects.get(CorporateFile_Id=codecorporate)
                                            status = item.get('Status')
                                            if status == "Active":
                                                corporateadddocument_ins.Status = True
                                            elif status == "Inactive":
                                                corporateadddocument_ins.Status = False
                                            corporateadddocument_ins.save()   
                                        except Corporate_File_Detials.DoesNotExist:
                                            print(f"No document found with code {code}.")
                                            return JsonResponse({'warn': f"No document found with code {code}."})
                                    else:
                                        print("qwer")
                                        if filecorporate:
                                            processedfilecorporate = validate_and_process_file(filecorporate) if filecorporate  else None
                                            corporateadddocument_ins = Corporate_File_Detials.objects.create(
                                            CorporateFile_Name=labelcorporate,
                                            CorporateMaster_Name=Corporate_instance,
                                            FileDocuments=processedfilecorporate,
                                            
                                        )
    
                            return JsonResponse({'success': f'{MasterType} Details Updated successfully'})
                    else:
                        if Corporate_Master_Detials.objects.filter(Corporate_Name=Name).exists():
                            return JsonResponse({'warn': 'Corporate Name already exists'})
                        Corporate_instance = Corporate_Master_Detials.objects.create(
                            Corporate_Name=Name,
                            ContactPerson=ContactPerson,
                            MailId=MailId,
                            PhoneNumber=PhoneNumber,
                            AlternateNumber=AlternateNumber,
                            Address=Address,
                            created_by=created_by                            
                        )
                        if AddDocumentsCorporate:
                            print("asdsdsdfd")
                            for item in AddDocumentsCorporate:
                                # print("item",item)
                                print("89",item.get('label'))
                                labelcorporate = item.get('label','')
                                filecorporate = item.get('file', None)
                                if filecorporate:
                                    processedfilecorporate = validate_and_process_file(filecorporate) if filecorporate  else None
                                corporateadddocument_ins = Corporate_File_Detials.objects.create(
                                    CorporateFile_Name=labelcorporate,
                                    CorporateMaster_Name=Corporate_instance,
                                    FileDocuments=processedfilecorporate,
                                    
                                )
                          
                        return JsonResponse({'success': f'{MasterType} Details added successfully'})
                            
                else:
                    if Code:
                        if Donation_Master_Detials.objects.filter(Donation_Name=Name).exclude(pk=Code).exists():
                            return JsonResponse({'warn': 'Donation Name already exists'})
                        else:  
                            Donation_instance = Donation_Master_Detials.objects.get(pk=Code)
                            Donation_instance.Donation_Name = Name
                            Donation_instance.Type = MsType
                            Donation_instance.ContactPerson = ContactPerson
                            Donation_instance.Designation = Designation
                            Donation_instance.PancardNo = PancardNo
                            Donation_instance.CIN = MsCIN
                            Donation_instance.TAN = MsTAN
                            Donation_instance.MailId = MailId
                            Donation_instance.PhoneNumber = PhoneNumber
                            Donation_instance.AlternateNumber = AlternateNumber
                            Donation_instance.Address = Address
                            Donation_instance.save()
                            if AddDocumentsDonation:
                                for item in AddDocumentsDonation:
                                    labeldonation = item.get('label','')
                                    filedonation = item.get('file', None)
                                    codedonation = item.get('code', None)
                                    if codedonation:
                                        try:
                                            donationadddocument_ins = Donation_File_Detials.objects.get(DonationFile_Id=codedonation)
                                            status = item.get('Status')
                                            if status == "Active":
                                                donationadddocument_ins.Status = True
                                            elif status == "Inactive":
                                                donationadddocument_ins.Status = False
                                            donationadddocument_ins.save()
                                        except Donation_File_Detials.DoesNotExist:
                                            print(f"No document found with code {code}.")
                                            return JsonResponse({'warn': f"No document found with code {code}."})
                                    else:
                                        if filedonation:
                                            processedfilefiledonation = validate_and_process_file(filedonation) if filedonation  else None
                                            donationadddocument_ins = Donation_File_Detials.objects.create(
                                            DonationFile_Name=labeldonation,
                                            DonationMaster_Name=Donation_instance,
                                            FileDocuments=processedfilefiledonation,
                                            
                                        )

                            return JsonResponse({'success': f'{MasterType} Details Updated successfully'})
                    else:
                        if Donation_Master_Detials.objects.filter(Donation_Name=Name).exists():
                            return JsonResponse({'warn': 'Donation Name already exists'})

                        Donation_instance = Donation_Master_Detials.objects.create(
                            Donation_Name = Name,
                            Type=MsType,
                            ContactPerson = ContactPerson,
                            Designation = Designation,
                            PancardNo = PancardNo,
                            CIN = MsCIN,
                            TAN = MsTAN,
                            MailId = MailId,
                            PhoneNumber = PhoneNumber,
                            AlternateNumber = AlternateNumber,
                            Address = Address,
                            created_by=created_by
                        )
                        if AddDocumentsDonation:
                            print("asdsdsdfd")
                            for item in AddDocumentsDonation:
                                # print("item",item)
                                print("89",item.get('label'))
                                labeldonation = item.get('label','')
                                filedonation = item.get('file', None)
                                if filedonation:
                                    processedfilefiledonation = validate_and_process_file(filedonation) if filedonation  else None
                                donationadddocument_ins = Donation_File_Detials.objects.create(
                                    DonationFile_Name=labeldonation,
                                    DonationMaster_Name=Donation_instance,
                                    FileDocuments=processedfilefiledonation,
                                    
                                )
                        return JsonResponse({'success': f'{MasterType} Details added successfully'})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
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
            
          
            MasterType = request.GET.get('MasterType')
            print("MasterType",MasterType)
            Type = request.GET.get('Type')
            print("Type",Type)
            SearchBy = request.GET.get('SearchBy')
            print("SearchBy",SearchBy)
          
            
            if MasterType == 'Insurance':
                Insurance_Client_Donation_ins = Insurance_Master_Detials.objects.filter(
                   (Q(Insurance_Name__icontains=SearchBy) | Q(Insurance_Id__icontains=SearchBy))
                )
            elif MasterType == 'Client':
                Insurance_Client_Donation_ins = Client_Master_Detials.objects.filter(
                    Q(Client_Name__icontains=SearchBy) | Q(Client_Id__icontains=SearchBy)
                )
            elif MasterType == 'Corporate':
                print("MasterType89",MasterType)
                Insurance_Client_Donation_ins = Corporate_Master_Detials.objects.filter(
                    Q(Corporate_Name__icontains=SearchBy) | Q(Corporate_Id__icontains=SearchBy)
                )
                print("ss",Insurance_Client_Donation_ins)

            else:
                Insurance_Client_Donation_ins = Donation_Master_Detials.objects.filter(
                    Q(Type__icontains=Type) & (Q(Donation_Name__icontains=SearchBy) | Q(Donation_Id__icontains=SearchBy))
                )
                

            Insurance_Client_Donation_data = []
            for InsCli in Insurance_Client_Donation_ins:
                InsCli_dict = {}
                if MasterType == 'Insurance':
                    InsCli_dict = {
                        'id': InsCli.Insurance_Id,
                        'Name': InsCli.Insurance_Name,
                        'PayerZone': InsCli.Payer_Zone,
                        'PayerMemberId': InsCli.PayerMember_Id,
                        'ContactPerson': InsCli.ContactPerson,
                        'MailId': InsCli.MailId,
                        'PhoneNumber': InsCli.PhoneNumber,
                        'AlternateNumber':InsCli.AlternateNumber,
                        'Address': InsCli.Address,
                        'Status': 'Active' if InsCli.Status else 'Inactive',
                        'CreatedBy': InsCli.created_by,
                        'AddDocuments':[],
                    }
                    add_document_instance = Insurance_File_Detials.objects.filter(InsuranceMaster_Name=InsCli.Insurance_Id)
        
        
                    for document in add_document_instance:
                        add_documentdict = {
                            'index': document.InsuranceFile_Id,
                            'code': document.InsuranceFile_Id,
                            'label': document.InsuranceFile_Name if document.InsuranceFile_Name else None,
                            'InsuranceName': document.InsuranceMaster_Name.Insurance_Name,
                            'file': get_file_image(document.FileDocuments) if document.FileDocuments else None,
                            'Status': 'Active' if document.Status else 'Inactive',
                        }
                        InsCli_dict['AddDocuments'].append(add_documentdict)

 
                elif MasterType == 'Client':
                    InsCli_dict = {
                        'id': InsCli.Client_Id,
                        'Name': InsCli.Client_Name,
                        'ContactPerson': InsCli.ContactPerson,
                        'MailId': InsCli.MailId,
                        'PhoneNumber': InsCli.PhoneNumber,
                        'AlternateNumber':InsCli.AlternateNumber,
                        'Address': InsCli.Address,
                        'Status': 'Active' if InsCli.Status else 'Inactive',
                        'CreatedBy': InsCli.created_by,
                        'AddDocumentsClient':[],
                    }
                    add_documentclient_instance = Client_File_Detials.objects.filter(ClientMaster_Name=InsCli.Client_Id)
        
        
                    for document in add_documentclient_instance:
                        add_documentdict_client = {
                            'index': document.ClientFile_Id,
                            'code': document.ClientFile_Id,
                            'label': document.ClientFile_Name if document.ClientFile_Name else None,
                            'InsuranceName': document.ClientMaster_Name.Client_Name,
                            'file': get_file_image(document.FileDocuments) if document.FileDocuments else None,
                            'Status': 'Active' if document.Status else 'Inactive',
                        }
                        InsCli_dict['AddDocumentsClient'].append(add_documentdict_client)                   
                elif MasterType == 'Corporate':
                    print("12232")
                    InsCli_dict = {
                        'id': InsCli.Corporate_Id,
                        'Name': InsCli.Corporate_Name,
                        'ContactPerson': InsCli.ContactPerson,
                        'MailId': InsCli.MailId,
                        'PhoneNumber': InsCli.PhoneNumber,
                        'AlternateNumber':InsCli.AlternateNumber,
                        'Address': InsCli.Address,
                        'Status': 'Active' if InsCli.Status else 'Inactive',
                        'CreatedBy': InsCli.created_by,
                        'AddDocumentsCorporate':[],
                    }  
                    add_documentcorporate_instance = Corporate_File_Detials.objects.filter(CorporateMaster_Name=InsCli.Corporate_Id)
        
        
                    for document in add_documentcorporate_instance:
                        add_documentdict_corporate = {
                            'index': document.CorporateFile_Id,
                            'code': document.CorporateFile_Id,
                            'label': document.CorporateFile_Name if document.CorporateFile_Name else None,
                            'InsuranceName': document.CorporateMaster_Name.Corporate_Name,
                            'file': get_file_image(document.FileDocuments) if document.FileDocuments else None,
                            'Status': 'Active' if document.Status else 'Inactive',
                        }
                        InsCli_dict['AddDocumentsCorporate'].append(add_documentdict_corporate)                   
                    print("123456789",InsCli_dict)                  
                else:
                    InsCli_dict = {
                        'id': InsCli.Donation_Id,
                        'Name': InsCli.Donation_Name,
                        'Type': InsCli.Type,
                        'ContactPerson': InsCli.ContactPerson,
                        'Designation': InsCli.Designation,
                        'PancardNo': InsCli.PancardNo,
                        'CIN': InsCli.CIN,
                        'TAN': InsCli.TAN,
                        'MailId': InsCli.MailId,
                        'PhoneNumber': InsCli.PhoneNumber,
                        'AlternateNumber':InsCli.AlternateNumber,
                        'Address': InsCli.Address,
                        'Status': 'Active' if InsCli.Status else 'Inactive',
                        'CreatedBy': InsCli.created_by,
                        'AddDocumentsDonation':[],
                    }
                    add_documentdonation_instance = Donation_File_Detials.objects.filter(DonationMaster_Name=InsCli.Donation_Id)
        
        
                    for document in add_documentdonation_instance:
                        add_documentdict_cdonation = {
                            'index': document.DonationFile_Id,
                            'code': document.DonationFile_Id,
                            'label': document.DonationFile_Name if document.DonationFile_Name else None,
                            'InsuranceName': document.DonationMaster_Name.Donation_Name,
                            'file': get_file_image(document.FileDocuments) if document.FileDocuments else None,
                            'Status': 'Active' if document.Status else 'Inactive',
                        }
                        InsCli_dict['AddDocumentsDonation'].append(add_documentdict_cdonation) 
                Insurance_Client_Donation_data.append(InsCli_dict)

            return JsonResponse(Insurance_Client_Donation_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


# bharathi

@csrf_exempt
def update_status_Insurance_Client_Detials_link(request):
    try:
        data = json.loads(request.body)
        print(data)
        MasterType = data.get('MasterType', '')

        # Insurance data
        id = data.get('id', '')   
        # Retrieve data from Doctor_Personal_Form_Detials
        if MasterType == 'Insurance':
            if id:
                
                Insurance_data = Insurance_Master_Detials.objects.get(Insurance_Id = id)
                Insurance_data.Status = not Insurance_data.Status
                Insurance_data.save()
                return JsonResponse({'success': 'Insurance Status Updated successfully'})
            
        elif MasterType =='Client':
            if id:
                
                Client_data = Client_Master_Detials.objects.get(Client_Id = id)
                Client_data.Status = not Client_data.Status
                Client_data.save()
                return JsonResponse({'success': 'Client Status Updated successfully'})
        elif MasterType =='Corporate':
            if id:
                Corporate_data = Corporate_Master_Detials.objects.get(Corporate_Id = id)
                Corporate_data.Status = not Corporate_data.Status
                Corporate_data.save()
                return JsonResponse({'success': 'Corporate Status Updated successfully'})
                
       
        else:
            if id:
                Donation_data=Donation_Master_Detials.objects.get(Donation_Id = id) 
                Donation_data.Status = not Donation_data.Status
                Donation_data.save()
                return JsonResponse({'success': 'Donation Status Updated successfully'})  

        # Return JSON response
       
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})


@csrf_exempt
def get_insurance_client_name(request):
    try:
        Insurance_data = Insurance_Master_Detials.objects.filter(Status=True).values('Insurance_Name').distinct()
        data=[]
        for ins in Insurance_data:
            data.append(ins)
        return JsonResponse(data,safe=False)  
       
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})





@csrf_exempt
def get_insurance_data_registration(request):
    try:
        Insurance_data = Insurance_Master_Detials.objects.filter(Status=True).order_by('Insurance_Name')
        data=[]
        indx=0
        for ins in Insurance_data:
            data.append({
                'indx':indx+1,
                'id':ins.Insurance_Id,
                'Name':ins.Insurance_Name,
            })
            indx =+ 1
        return JsonResponse(data,safe=False)  
       
    
    except Exception as e:
        print({'error': str(e)})
        return JsonResponse({'error': str(e)})


@csrf_exempt
def get_client_data_registration(request):
    try:
        client_data = Client_Master_Detials.objects.filter(Status=True)
        data=[]
        indx=0
        for cli in client_data:
            data.append({
                'indx':indx+1,
                'id':cli.Client_Id,
                'Name':cli.Client_Name
            })
        return JsonResponse(data,safe=False)  
       
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})


@csrf_exempt
def get_corporate_data_registration(request):
    try:
        corporate_data = Corporate_Master_Detials.objects.filter(Status=True)
        data=[]
        indx=0
        for cli in corporate_data:
            data.append({
                'indx':indx+1,
                'id':cli.Corporate_Id,
                'Name':cli.Corporate_Name
            })
        return JsonResponse(data,safe=False)  
       
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})



@csrf_exempt
def get_donation_data_registration(request):
    try:
        donation_data = Donation_Master_Detials.objects.filter(Status=True).order_by('Type','Donation_Name')
        data=[]
        indx=0
        for don in donation_data:
            data.append({
                'indx':indx+1,
                'id':don.Donation_Id,
                'Name':don.Donation_Name,
                'Type':don.Type
            })
        return JsonResponse(data,safe=False)  
       
    
    except Exception as e:
        # Handle exceptions and return error response
        return JsonResponse({'error': str(e)})
























