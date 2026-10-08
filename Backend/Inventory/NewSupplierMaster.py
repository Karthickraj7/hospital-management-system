import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q
from django.db import transaction
from .models import *
from io import BytesIO
from PIL import Image
import base64
from PyPDF2 import PdfReader, PdfWriter
# import magic
import filetype
import pandas as pd
from django.db import transaction



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
            file_data = file.split(',')[1]
            file_content = base64.b64decode(file_data)
            file_size = len(file_content)
            
            max_size_mb = 5

            if file_size > max_size_mb * 1024 * 1024:
                print('maximum mb')
                return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'})

            file_type = get_file_type(file)
            
            if file_type == 'image/jpeg' or file_type == 'image/png':
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
@require_http_methods(["POST", "OPTIONS", "GET"])
def Supplier_Master_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            FileAttachment = data.get('FileAttachment', None)
            FileAttachment_prossed = validate_and_process_file(FileAttachment) if FileAttachment else None
            SupplierId = data.get('SupplierId', None)
            StatusEdit = data.get('StatusEdit',False)
            SupplierName = data.get('SupplierName', '')
            SupplierType = data.get('SupplierType', '')
            ContactPerson = data.get('ContactPerson', '')
            ContactNumber = data.get('ContactNumber', '')
            EmailAddress = data.get('EmailAddress', '')
            Address = data.get('Address', '')
            StateLocation = data.get('StateLocation','')
            RegistrationNumber = data.get('RegistrationNumber', '')
            GSTNumber = data.get('GSTNumber', '')
            PANNumber = data.get('PANNumber', '')
            # PaymentTerms = data.get('PaymentTerms', '')
            CreditLimitstr = data.get('CreditLimit', '')
            CreditLimit = int(CreditLimitstr) if CreditLimitstr !='' else 0
            # LeadTime = data.get('LeadTime', '')
            Notes = data.get('Notes', '')
            BankName = data.get('BankName', '')
            AccountNumber = data.get('AccountNumber', '')
            IFSCCode = data.get('IFSCCode', '')
            BankBranch = data.get('BankBranch', '')
            created_by = data.get('created_by', '')
            DruglicenseNostr = data.get('DruglicenseNoOne','')
            DruglicenseNoTWostr = data.get('DruglicenseNoTwo','')
            Uppercase_name = SupplierName.upper()
            DruglicenseNo = DruglicenseNostr if DruglicenseNostr !='' else None
            DruglicenseNoTwo = DruglicenseNoTWostr if DruglicenseNoTWostr !='' else None
            def clean_number(value, as_type=int):
                try:
                    if str(value).strip().lower() in ["", "nan", "null", "none"]:
                        return None
                    return as_type(value)
                except (ValueError, TypeError):
                    return None
            PaymentTerms = clean_number(data.get("PaymentTerms"))
            LeadTime = clean_number(data.get("LeadTime"))
            with transaction.atomic():
                if SupplierId :
                    print('--',SupplierId)
                    
                    supplier_ins =Supplier_Master_Details.objects.get(pk = SupplierId)
                    print('--')
                    if StatusEdit:
                        supplier_ins.Status = not supplier_ins.Status
                        supplier_ins.save()
                        return JsonResponse ({'success': 'Supplier Master Updated successfully'})
                        
                    else:
                        if Supplier_Master_Details.objects.filter(Supplier_Name = SupplierName).exclude(pk = SupplierId).exists():
                            return JsonResponse({'warn': f"The Supplier Name are already present in the name of {SupplierName}. "})
                        else:
                            supplier_ins.Supplier_Name = SupplierName
                            supplier_ins.Supplier_Type = SupplierType
                            supplier_ins.Contact_Person = ContactPerson
                            supplier_ins.Contact_Number = ContactNumber
                            supplier_ins.Email_Address = EmailAddress
                            supplier_ins.Address = Address
                            supplier_ins.StateLocation=StateLocation
                            supplier_ins.Registration_Number = RegistrationNumber
                            supplier_ins.GST_Number = GSTNumber
                            supplier_ins.PAN_Number = PANNumber
                            supplier_ins.Druglicense_Number = DruglicenseNo
                            supplier_ins.Druglicense_Number_Two = DruglicenseNoTwo
                            supplier_ins.Payment_Terms = PaymentTerms
                            supplier_ins.Credit_Limit = CreditLimit
                            supplier_ins.DeliveryDuration = LeadTime
                            supplier_ins.Notes = Notes
                            supplier_ins.File_Attachment = FileAttachment_prossed
                            supplier_ins.save()
                        
                        
                            
                            if Supplier_Bank_Details.objects.filter(Supplier_Detials__pk = SupplierId).exists():
                                supplier_bank_ins = Supplier_Bank_Details.objects.get(Supplier_Detials__pk =SupplierId)
                                supplier_bank_ins.Bank_Name = BankName
                                supplier_bank_ins.Account_Number= AccountNumber
                                supplier_bank_ins.IFSCCode= IFSCCode
                                supplier_bank_ins.BankBranch=BankBranch
                                supplier_bank_ins.save()
                                    
                            else:
                                Supplier_Bank_Details.objects.create(
                                Supplier_Detials= supplier_ins,
                                Bank_Name= BankName,
                                Account_Number= AccountNumber,
                                IFSCCode= IFSCCode,
                                BankBranch=BankBranch,
                                )
                        return JsonResponse ({'success': 'Supplier Master Updated successfully'})
                            
                else:
                    if Supplier_Master_Details.objects.filter(Supplier_Name = SupplierName).exists():
                            return JsonResponse({'warn': f"The Supplier Name are already present in the name of {SupplierName}. "})
                    else:
                        supplier_ins = Supplier_Master_Details.objects.create(
                            Supplier_Name = SupplierName,
                            Supplier_Type = SupplierType,
                            Contact_Person = ContactPerson,
                            Contact_Number = ContactNumber,
                            Email_Address = EmailAddress,
                            Address = Address,
                            StateLocation = StateLocation,
                            Registration_Number = RegistrationNumber,
                            GST_Number = GSTNumber,
                            PAN_Number = PANNumber,
                            Druglicense_Number = DruglicenseNo,
                            Druglicense_Number_Two = DruglicenseNoTwo,
                            Payment_Terms = PaymentTerms,
                            Credit_Limit = CreditLimit,
                            DeliveryDuration = LeadTime,
                            Notes = Notes,
                            File_Attachment = FileAttachment_prossed,
                            LedgerName=Uppercase_name,
                            LedgerGroupName=Finance_GroupMaster_Detailes.objects.get(pk=22),
                            OpeningBalance=0,
                            DebitOrCredit='Dr',
                            created_by = created_by
                            )
                        

                        Supplier_Bank_Details.objects.create(
                            Supplier_Detials= supplier_ins,
                            Bank_Name= BankName,
                            Account_Number= AccountNumber,
                            IFSCCode= IFSCCode,
                            BankBranch=BankBranch
                        )
                        return JsonResponse ({'success': 'Supplier Master Created successfully'})
                        
                    
               
                        
                    
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
    elif request.method == 'GET':
        
       
        try:
            
            SupplierId = request.GET.get('SupplierId')
            SupplierName = request.GET.get('SupplierName')
            SupplierType = request.GET.get('SupplierType')
            ContactNumber = request.GET.get('ContactNumber')
            FilterBy = request.GET.get('FilterBy','Supplier')
            forfilter =bool(request.GET.get('forfilter',False))
            ProductCategory = request.GET.get('ProductCategory','')
            SubCategory = request.GET.get('SubCategory','')
            ItemCode = request.GET.get('ItemCode','')
            ItemName = request.GET.get('ItemName','')
            GenericName = request.GET.get('GenericName','')
            CompanyName = request.GET.get('CompanyName','')
            HSNCode = request.GET.get('HSNCode','')
            
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
                    
            if FilterBy == 'Supplier':      
                if not forfilter and SupplierId:
                    Supplier_Master_instance=Supplier_Master_Details.objects.get(pk=SupplierId)
                    dic={
                            'id':Supplier_Master_instance.Supplier_Id,
                            'SupplierName':Supplier_Master_instance.Supplier_Name,
                            'SupplierType':Supplier_Master_instance.Supplier_Type,
                            'ContactPerson':Supplier_Master_instance.Contact_Person,
                            'ContactNumber':Supplier_Master_instance.Contact_Number,
                            'EmailAddress':Supplier_Master_instance.Email_Address,
                            'Address':Supplier_Master_instance.Address,
                            'StateLocation':Supplier_Master_instance.StateLocation,
                            'RegistrationNumber':Supplier_Master_instance.Registration_Number,
                            'GSTNumber':Supplier_Master_instance.GST_Number,
                            'PANNumber':Supplier_Master_instance.PAN_Number,
                            'PaymentTerms':Supplier_Master_instance.Payment_Terms,
                            'CreditLimit':Supplier_Master_instance.Credit_Limit,
                            'LeadTime':Supplier_Master_instance.DeliveryDuration,
                            'Status':'Active'if  Supplier_Master_instance.Status else 'Inactive',
                            'Notes':Supplier_Master_instance.Notes                         
                        }

                    return JsonResponse(dic,safe=False)
                else:
                    filter_conditions = Q()
                    if SupplierId:
                        filter_conditions &= Q(pk__icontains = SupplierId)
                    if SupplierName:
                        filter_conditions &= Q(Supplier_Name__icontains =SupplierName)
                    if SupplierType:
                        filter_conditions &= Q(Supplier_Type__icontains =SupplierType)
                    if ContactNumber:
                        filter_conditions &= Q(Contact_Number__icontains =ContactNumber)
                    
                    Supplier_Master_instance=Supplier_Master_Details.objects.filter(filter_conditions,Is_Optical=False,Is_GEN=False).order_by('Supplier_Name')

                    Supplier_Array=[]

                    
                    index = 1
                    for row in Supplier_Master_instance:
                        dic={
                            'id':index,
                            'SupplierId':row.pk,
                            'SupplierName':row.Supplier_Name,
                            'SupplierType':row.Supplier_Type,
                            'ContactPerson':row.Contact_Person,
                            'ContactNumber':row.Contact_Number,
                            'EmailAddress':row.Email_Address,
                            'Address':row.Address,
                            'StateLocation':row.StateLocation,
                            'RegistrationNumber':row.Registration_Number,
                            'GSTNumber':row.GST_Number,
                            'PANNumber':row.PAN_Number,
                            'DruglicenseNoOne':row.Druglicense_Number,
                            'DruglicenseNoTwo':row.Druglicense_Number,
                            'PaymentTerms':row.Payment_Terms,
                            'CreditLimit':row.Credit_Limit,
                            'LeadTime':row.DeliveryDuration,
                            'Status':'Active'if  row.Status else 'Inactive',
                            'Notes':row.Notes,
                            'FileAttachment':get_file_image(row.File_Attachment) if row.File_Attachment else None,
                        }
                        
                    

                        

                        Supplier_Bank_instance=Supplier_Bank_Details.objects.filter(Supplier_Detials__pk=row.Supplier_Id)
                        bank_Array=[]
                        if Supplier_Bank_instance:
                                
                            for Bank in Supplier_Bank_instance:
                                bankdic={
                                    'id':Bank.pk,
                                    'BankName':Bank.Bank_Name,
                                    'AccountNumber':Bank.Account_Number,
                                    'IFSCCode':Bank.IFSCCode,
                                    'BankBranch':Bank.BankBranch,
                                }
                                bank_Array.append(bankdic)
                                
                            dic['Bank_Details']=bank_Array
                        else:
                            dic['Bank_Details']=[]
                       


                        Supplier_Array.append(dic)
                        index += 1



                    return JsonResponse (Supplier_Array,safe=False)
            else:
                
                filter_conditions = Q()
                
                if ProductCategory:
                    filter_conditions &= Q(ProductCategory__pk =ProductCategory)
                if SubCategory:
                    filter_conditions &= Q(SubCategory__pk =SubCategory)
                if ItemCode:
                    filter_conditions &= Q(pk__icontains=ItemCode)
                if ItemName:
                    filter_conditions &= Q(ItemName__icontains=ItemName)
                if GenericName:
                    filter_conditions &= Q(GenericName__pk=GenericName)
                if CompanyName:
                    filter_conditions &= Q(CompanyName__pk=CompanyName)
                if HSNCode:
                    filter_conditions &= Q(HSNCode__icontains=HSNCode)
                    
                Product_Instance = Product_Master_All_Category_Details.objects.filter(filter_conditions).order_by('Supplier_Name')
                productList=[]
                if Product_Instance.exists():
                    for ins in Product_Instance:
                        data={
                            "id":len(productList)+1,
                            "ItemCode":ins.pk,
                            "ItemName":ins.ItemName,
                            "ProductCategory":ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
                            "SubCategory":ins.SubCategory.SubCategoryName if ins.SubCategory else '',
                        }
                        productList.append(data)
                return JsonResponse (productList,safe=False)
                
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':str(e)},status=500)
    else:
        return JsonResponse ({'error':'method not allowed'},status=400)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Supplier_Master_Link_Optical(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            FileAttachment = data.get('FileAttachment', None)
            FileAttachment_prossed = validate_and_process_file(FileAttachment) if FileAttachment else None
            SupplierId = data.get('SupplierId', None)
            StatusEdit = data.get('StatusEdit',False)
            SupplierName = data.get('SupplierName', '')
            SupplierType = data.get('SupplierType', '')
            ContactPerson = data.get('ContactPerson', '')
            ContactNumber = data.get('ContactNumber', '')
            EmailAddress = data.get('EmailAddress', '')
            Address = data.get('Address', '')
            StateLocation = data.get('StateLocation','')
            RegistrationNumber = data.get('RegistrationNumber', '')
            GSTNumber = data.get('GSTNumber', '')
            PANNumber = data.get('PANNumber', '')
            # PaymentTerms = data.get('PaymentTerms', '')
            CreditLimitstr = data.get('CreditLimit', '')
            CreditLimit = int(CreditLimitstr) if CreditLimitstr !='' else 0
            # LeadTime = data.get('LeadTime', '')
            Notes = data.get('Notes', '')
            BankName = data.get('BankName', '')
            AccountNumber = data.get('AccountNumber', '')
            IFSCCode = data.get('IFSCCode', '')
            BankBranch = data.get('BankBranch', '')
            created_by = data.get('created_by', '')
            DruglicenseNostr = data.get('DruglicenseNoOne','')
            DruglicenseNoTWostr = data.get('DruglicenseNoTwo','')
            Uppercase_name = SupplierName.upper()
            DruglicenseNo = DruglicenseNostr if DruglicenseNostr !='' else None
            DruglicenseNoTwo = DruglicenseNoTWostr if DruglicenseNoTWostr !='' else None
            def clean_number(value, as_type=int):
                try:
                    if str(value).strip().lower() in ["", "nan", "null", "none"]:
                        return None
                    return as_type(value)
                except (ValueError, TypeError):
                    return None
            PaymentTerms = clean_number(data.get("PaymentTerms"))
            LeadTime = clean_number(data.get("LeadTime"))
            with transaction.atomic():
                if SupplierId :
                    print('--',SupplierId)
                    
                    supplier_ins =Supplier_Master_Details.objects.get(pk = SupplierId)
                    print('--')
                    if StatusEdit:
                        supplier_ins.Status = not supplier_ins.Status
                        supplier_ins.save()
                        return JsonResponse ({'success': 'Supplier Master Updated successfully'})
                        
                    else:
                        if Supplier_Master_Details.objects.filter(Supplier_Name = SupplierName).exclude(pk = SupplierId).exists():
                            return JsonResponse({'warn': f"The Supplier Name are already present in the name of {SupplierName}. "})
                        else:
                            supplier_ins.Supplier_Name = SupplierName
                            supplier_ins.Is_Optical = True
                            supplier_ins.Supplier_Type = SupplierType
                            supplier_ins.Contact_Person = ContactPerson
                            supplier_ins.Contact_Number = ContactNumber
                            supplier_ins.Email_Address = EmailAddress
                            supplier_ins.Address = Address
                            supplier_ins.StateLocation=StateLocation
                            supplier_ins.Registration_Number = RegistrationNumber
                            supplier_ins.GST_Number = GSTNumber
                            supplier_ins.PAN_Number = PANNumber
                            supplier_ins.Druglicense_Number = DruglicenseNo
                            supplier_ins.Druglicense_Number_Two = DruglicenseNoTwo
                            supplier_ins.Payment_Terms = PaymentTerms
                            supplier_ins.Credit_Limit = CreditLimit
                            supplier_ins.DeliveryDuration = LeadTime
                            supplier_ins.Notes = Notes
                            supplier_ins.File_Attachment = FileAttachment_prossed
                            supplier_ins.save()
                        
                        
                            
                            if Supplier_Bank_Details.objects.filter(Supplier_Detials__pk = SupplierId).exists():
                                supplier_bank_ins = Supplier_Bank_Details.objects.get(Supplier_Detials__pk =SupplierId)
                                supplier_bank_ins.Bank_Name = BankName
                                supplier_bank_ins.Account_Number= AccountNumber
                                supplier_bank_ins.IFSCCode= IFSCCode
                                supplier_bank_ins.BankBranch=BankBranch
                                supplier_bank_ins.save()
                                    
                            else:
                                Supplier_Bank_Details.objects.create(
                                Supplier_Detials= supplier_ins,
                                Bank_Name= BankName,
                                Account_Number= AccountNumber,
                                IFSCCode= IFSCCode,
                                BankBranch=BankBranch,
                                )
                        return JsonResponse ({'success': 'Supplier Master Updated successfully'})
                            
                else:
                    if Supplier_Master_Details.objects.filter(Supplier_Name = SupplierName).exists():
                            return JsonResponse({'warn': f"The Supplier Name are already present in the name of {SupplierName}. "})
                    else:
                        supplier_ins = Supplier_Master_Details.objects.create(
                            Supplier_Name = SupplierName,
                            Supplier_Type = SupplierType,
                            Contact_Person = ContactPerson,
                            Contact_Number = ContactNumber,
                            Email_Address = EmailAddress,
                            Address = Address,
                            Is_Optical = True,
                            StateLocation = StateLocation,
                            Registration_Number = RegistrationNumber,
                            GST_Number = GSTNumber,
                            PAN_Number = PANNumber,
                            Druglicense_Number = DruglicenseNo,
                            Druglicense_Number_Two = DruglicenseNoTwo,
                            Payment_Terms = PaymentTerms,
                            Credit_Limit = CreditLimit,
                            DeliveryDuration = LeadTime,
                            Notes = Notes,
                            File_Attachment = FileAttachment_prossed,
                            LedgerName=Uppercase_name,
                            LedgerGroupName=Finance_GroupMaster_Detailes.objects.get(pk=22),
                            OpeningBalance=0,
                            DebitOrCredit='Dr',
                            created_by = created_by
                            )
                        

                        Supplier_Bank_Details.objects.create(
                            Supplier_Detials= supplier_ins,
                            Bank_Name= BankName,
                            Account_Number= AccountNumber,
                            IFSCCode= IFSCCode,
                            BankBranch=BankBranch
                        )
                        return JsonResponse ({'success': 'Supplier Master Created successfully'})
                        
                    
               
                        
                    
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
    elif request.method == 'GET':
        
       
        try:
            
            SupplierId = request.GET.get('SupplierId')
            SupplierName = request.GET.get('SupplierName')
            SupplierType = request.GET.get('SupplierType')
            ContactNumber = request.GET.get('ContactNumber')
            FilterBy = request.GET.get('FilterBy','Supplier')
            forfilter =bool(request.GET.get('forfilter',False))
            ProductCategory = request.GET.get('ProductCategory','')
            SubCategory = request.GET.get('SubCategory','')
            ItemCode = request.GET.get('ItemCode','')
            ItemName = request.GET.get('ItemName','')
            GenericName = request.GET.get('GenericName','')
            CompanyName = request.GET.get('CompanyName','')
            HSNCode = request.GET.get('HSNCode','')
            
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
                    
            if FilterBy == 'Supplier':      
                if not forfilter and SupplierId:
                    Supplier_Master_instance=Supplier_Master_Details.objects.get(pk=SupplierId)
                    dic={
                            'id':Supplier_Master_instance.Supplier_Id,
                            'SupplierName':Supplier_Master_instance.Supplier_Name,
                            'SupplierType':Supplier_Master_instance.Supplier_Type,
                            'ContactPerson':Supplier_Master_instance.Contact_Person,
                            'ContactNumber':Supplier_Master_instance.Contact_Number,
                            'EmailAddress':Supplier_Master_instance.Email_Address,
                            'Address':Supplier_Master_instance.Address,
                            'StateLocation':Supplier_Master_instance.StateLocation,
                            'RegistrationNumber':Supplier_Master_instance.Registration_Number,
                            'GSTNumber':Supplier_Master_instance.GST_Number,
                            'PANNumber':Supplier_Master_instance.PAN_Number,
                            'PaymentTerms':Supplier_Master_instance.Payment_Terms,
                            'CreditLimit':Supplier_Master_instance.Credit_Limit,
                            'LeadTime':Supplier_Master_instance.DeliveryDuration,
                            'Status':'Active'if  Supplier_Master_instance.Status else 'Inactive',
                            'Notes':Supplier_Master_instance.Notes                         
                        }

                    return JsonResponse(dic,safe=False)
                else:
                    filter_conditions = Q()
                    if SupplierId:
                        filter_conditions &= Q(pk__icontains = SupplierId)
                    if SupplierName:
                        filter_conditions &= Q(Supplier_Name__icontains =SupplierName)
                    if SupplierType:
                        filter_conditions &= Q(Supplier_Type__icontains =SupplierType)
                    if ContactNumber:
                        filter_conditions &= Q(Contact_Number__icontains =ContactNumber)
                    
                    Supplier_Master_instance=Supplier_Master_Details.objects.filter(filter_conditions,Is_Optical=True).order_by('Supplier_Name')

                    Supplier_Array=[]

                    
                    index = 1
                    for row in Supplier_Master_instance:
                        dic={
                            'id':index,
                            'SupplierId':row.pk,
                            'SupplierName':row.Supplier_Name,
                            'SupplierType':row.Supplier_Type,
                            'ContactPerson':row.Contact_Person,
                            'ContactNumber':row.Contact_Number,
                            'EmailAddress':row.Email_Address,
                            'Address':row.Address,
                            'StateLocation':row.StateLocation,
                            'RegistrationNumber':row.Registration_Number,
                            'GSTNumber':row.GST_Number,
                            'PANNumber':row.PAN_Number,
                            'DruglicenseNoOne':row.Druglicense_Number,
                            'DruglicenseNoTwo':row.Druglicense_Number,
                            'PaymentTerms':row.Payment_Terms,
                            'CreditLimit':row.Credit_Limit,
                            'LeadTime':row.DeliveryDuration,
                            'Status':'Active'if  row.Status else 'Inactive',
                            'Notes':row.Notes,
                            'FileAttachment':get_file_image(row.File_Attachment) if row.File_Attachment else None,
                        }
                        
                    

                        

                        Supplier_Bank_instance=Supplier_Bank_Details.objects.filter(Supplier_Detials__pk=row.Supplier_Id)
                        bank_Array=[]
                        if Supplier_Bank_instance:
                                
                            for Bank in Supplier_Bank_instance:
                                bankdic={
                                    'id':Bank.pk,
                                    'BankName':Bank.Bank_Name,
                                    'AccountNumber':Bank.Account_Number,
                                    'IFSCCode':Bank.IFSCCode,
                                    'BankBranch':Bank.BankBranch,
                                }
                                bank_Array.append(bankdic)
                                
                            dic['Bank_Details']=bank_Array
                        else:
                            dic['Bank_Details']=[]
                       


                        Supplier_Array.append(dic)
                        index += 1



                    return JsonResponse (Supplier_Array,safe=False)
            else:
                
                filter_conditions = Q()
                
                if ProductCategory:
                    filter_conditions &= Q(ProductCategory__pk =ProductCategory)
                if SubCategory:
                    filter_conditions &= Q(SubCategory__pk =SubCategory)
                if ItemCode:
                    filter_conditions &= Q(pk__icontains=ItemCode)
                if ItemName:
                    filter_conditions &= Q(ItemName__icontains=ItemName)
                if GenericName:
                    filter_conditions &= Q(GenericName__pk=GenericName)
                if CompanyName:
                    filter_conditions &= Q(CompanyName__pk=CompanyName)
                if HSNCode:
                    filter_conditions &= Q(HSNCode__icontains=HSNCode)
                    
                Product_Instance = Product_Master_All_Category_Details.objects.filter(filter_conditions).order_by('Supplier_Name')
                productList=[]
                if Product_Instance.exists():
                    for ins in Product_Instance:
                        data={
                            "id":len(productList)+1,
                            "ItemCode":ins.pk,
                            "ItemName":ins.ItemName,
                            "ProductCategory":ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
                            "SubCategory":ins.SubCategory.SubCategoryName if ins.SubCategory else '',
                        }
                        productList.append(data)
                return JsonResponse (productList,safe=False)
                
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
    else:
        return JsonResponse ({'error':'method not allowed'},status=400)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Supplier_Master_Link_GEN(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            FileAttachment = data.get('FileAttachment', None)
            FileAttachment_prossed = validate_and_process_file(FileAttachment) if FileAttachment else None
            SupplierId = data.get('SupplierId', None)
            StatusEdit = data.get('StatusEdit',False)
            SupplierName = data.get('SupplierName', '')
            SupplierType = data.get('SupplierType', '')
            ContactPerson = data.get('ContactPerson', '')
            ContactNumber = data.get('ContactNumber', '')
            EmailAddress = data.get('EmailAddress', '')
            Address = data.get('Address', '')
            StateLocation = data.get('StateLocation','')
            RegistrationNumber = data.get('RegistrationNumber', '')
            GSTNumber = data.get('GSTNumber', '')
            PANNumber = data.get('PANNumber', '')
            # PaymentTerms = data.get('PaymentTerms', '')
            CreditLimitstr = data.get('CreditLimit', '')
            CreditLimit = int(CreditLimitstr) if CreditLimitstr !='' else 0
            # LeadTime = data.get('LeadTime', '')
            Notes = data.get('Notes', '')
            BankName = data.get('BankName', '')
            AccountNumber = data.get('AccountNumber', '')
            IFSCCode = data.get('IFSCCode', '')
            BankBranch = data.get('BankBranch', '')
            created_by = data.get('created_by', '')
            DruglicenseNostr = data.get('DruglicenseNoOne','')
            DruglicenseNoTWostr = data.get('DruglicenseNoTwo','')
            Uppercase_name = SupplierName.upper()
            DruglicenseNo = DruglicenseNostr if DruglicenseNostr !='' else None
            DruglicenseNoTwo = DruglicenseNoTWostr if DruglicenseNoTWostr !='' else None
            def clean_number(value, as_type=int):
                try:
                    if str(value).strip().lower() in ["", "nan", "null", "none"]:
                        return None
                    return as_type(value)
                except (ValueError, TypeError):
                    return None
            PaymentTerms = clean_number(data.get("PaymentTerms"))
            LeadTime = clean_number(data.get("LeadTime"))
            with transaction.atomic():
                if SupplierId :
                    print('--',SupplierId)
                    
                    supplier_ins =Supplier_Master_Details.objects.get(pk = SupplierId)
                    print('--')
                    if StatusEdit:
                        supplier_ins.Status = not supplier_ins.Status
                        supplier_ins.save()
                        return JsonResponse ({'success': 'Supplier Master Updated successfully'})
                        
                    else:
                        if Supplier_Master_Details.objects.filter(Supplier_Name = SupplierName).exclude(pk = SupplierId).exists():
                            return JsonResponse({'warn': f"The Supplier Name are already present in the name of {SupplierName}. "})
                        else:
                            supplier_ins.Supplier_Name = SupplierName
                            supplier_ins.Is_GEN = True
                            supplier_ins.Supplier_Type = SupplierType
                            supplier_ins.Contact_Person = ContactPerson
                            supplier_ins.Contact_Number = ContactNumber
                            supplier_ins.Email_Address = EmailAddress
                            supplier_ins.Address = Address
                            supplier_ins.StateLocation=StateLocation
                            supplier_ins.Registration_Number = RegistrationNumber
                            supplier_ins.GST_Number = GSTNumber
                            supplier_ins.PAN_Number = PANNumber
                            supplier_ins.Druglicense_Number = DruglicenseNo
                            supplier_ins.Druglicense_Number_Two = DruglicenseNoTwo
                            supplier_ins.Payment_Terms = PaymentTerms
                            supplier_ins.Credit_Limit = CreditLimit
                            supplier_ins.DeliveryDuration = LeadTime
                            supplier_ins.Notes = Notes
                            supplier_ins.File_Attachment = FileAttachment_prossed
                            supplier_ins.save()
                        
                        
                            
                            if Supplier_Bank_Details.objects.filter(Supplier_Detials__pk = SupplierId).exists():
                                supplier_bank_ins = Supplier_Bank_Details.objects.get(Supplier_Detials__pk =SupplierId)
                                supplier_bank_ins.Bank_Name = BankName
                                supplier_bank_ins.Account_Number= AccountNumber
                                supplier_bank_ins.IFSCCode= IFSCCode
                                supplier_bank_ins.BankBranch=BankBranch
                                supplier_bank_ins.save()
                                    
                            else:
                                Supplier_Bank_Details.objects.create(
                                Supplier_Detials= supplier_ins,
                                Bank_Name= BankName,
                                Account_Number= AccountNumber,
                                IFSCCode= IFSCCode,
                                BankBranch=BankBranch,
                                )
                        return JsonResponse ({'success': 'Supplier Master Updated successfully'})
                            
                else:
                    if Supplier_Master_Details.objects.filter(Supplier_Name = SupplierName).exists():
                            return JsonResponse({'warn': f"The Supplier Name are already present in the name of {SupplierName}. "})
                    else:
                        supplier_ins = Supplier_Master_Details.objects.create(
                            Supplier_Name = SupplierName,
                            Supplier_Type = SupplierType,
                            Contact_Person = ContactPerson,
                            Contact_Number = ContactNumber,
                            Email_Address = EmailAddress,
                            Address = Address,
                            Is_GEN = True,
                            StateLocation = StateLocation,
                            Registration_Number = RegistrationNumber,
                            GST_Number = GSTNumber,
                            PAN_Number = PANNumber,
                            Druglicense_Number = DruglicenseNo,
                            Druglicense_Number_Two = DruglicenseNoTwo,
                            Payment_Terms = PaymentTerms,
                            Credit_Limit = CreditLimit,
                            DeliveryDuration = LeadTime,
                            Notes = Notes,
                            File_Attachment = FileAttachment_prossed,
                            LedgerName=Uppercase_name,
                            LedgerGroupName=Finance_GroupMaster_Detailes.objects.get(pk=22),
                            OpeningBalance=0,
                            DebitOrCredit='Dr',
                            created_by = created_by
                            )
                        

                        Supplier_Bank_Details.objects.create(
                            Supplier_Detials= supplier_ins,
                            Bank_Name= BankName,
                            Account_Number= AccountNumber,
                            IFSCCode= IFSCCode,
                            BankBranch=BankBranch
                        )
                        return JsonResponse ({'success': 'Supplier Master Created successfully'})
                        
                    
               
                        
                    
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':str(e)},status=500)
    elif request.method == 'GET':
        
       
        try:
            
            SupplierId = request.GET.get('SupplierId')
            SupplierName = request.GET.get('SupplierName')
            SupplierType = request.GET.get('SupplierType')
            ContactNumber = request.GET.get('ContactNumber')
            FilterBy = request.GET.get('FilterBy','Supplier')
            forfilter =bool(request.GET.get('forfilter',False))
            ProductCategory = request.GET.get('ProductCategory','')
            SubCategory = request.GET.get('SubCategory','')
            ItemCode = request.GET.get('ItemCode','')
            ItemName = request.GET.get('ItemName','')
            GenericName = request.GET.get('GenericName','')
            CompanyName = request.GET.get('CompanyName','')
            HSNCode = request.GET.get('HSNCode','')
            
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
                    
            if FilterBy == 'Supplier':      
                if not forfilter and SupplierId:
                    Supplier_Master_instance=Supplier_Master_Details.objects.get(pk=SupplierId)
                    dic={
                            'id':Supplier_Master_instance.Supplier_Id,
                            'SupplierName':Supplier_Master_instance.Supplier_Name,
                            'SupplierType':Supplier_Master_instance.Supplier_Type,
                            'ContactPerson':Supplier_Master_instance.Contact_Person,
                            'ContactNumber':Supplier_Master_instance.Contact_Number,
                            'EmailAddress':Supplier_Master_instance.Email_Address,
                            'Address':Supplier_Master_instance.Address,
                            'StateLocation':Supplier_Master_instance.StateLocation,
                            'RegistrationNumber':Supplier_Master_instance.Registration_Number,
                            'GSTNumber':Supplier_Master_instance.GST_Number,
                            'PANNumber':Supplier_Master_instance.PAN_Number,
                            'PaymentTerms':Supplier_Master_instance.Payment_Terms,
                            'CreditLimit':Supplier_Master_instance.Credit_Limit,
                            'LeadTime':Supplier_Master_instance.DeliveryDuration,
                            'Status':'Active'if  Supplier_Master_instance.Status else 'Inactive',
                            'Notes':Supplier_Master_instance.Notes                         
                        }

                    return JsonResponse(dic,safe=False)
                else:
                    filter_conditions = Q()
                    if SupplierId:
                        filter_conditions &= Q(pk__icontains = SupplierId)
                    if SupplierName:
                        filter_conditions &= Q(Supplier_Name__icontains =SupplierName)
                    if SupplierType:
                        filter_conditions &= Q(Supplier_Type__icontains =SupplierType)
                    if ContactNumber:
                        filter_conditions &= Q(Contact_Number__icontains =ContactNumber)
                    
                    Supplier_Master_instance=Supplier_Master_Details.objects.filter(filter_conditions,Is_GEN=True).order_by('Supplier_Name')

                    Supplier_Array=[]

                    
                    index = 1
                    for row in Supplier_Master_instance:
                        dic={
                            'id':index,
                            'SupplierId':row.pk,
                            'SupplierName':row.Supplier_Name,
                            'SupplierType':row.Supplier_Type,
                            'ContactPerson':row.Contact_Person,
                            'ContactNumber':row.Contact_Number,
                            'EmailAddress':row.Email_Address,
                            'Address':row.Address,
                            'StateLocation':row.StateLocation,
                            'RegistrationNumber':row.Registration_Number,
                            'GSTNumber':row.GST_Number,
                            'PANNumber':row.PAN_Number,
                            'DruglicenseNoOne':row.Druglicense_Number,
                            'DruglicenseNoTwo':row.Druglicense_Number,
                            'PaymentTerms':row.Payment_Terms,
                            'CreditLimit':row.Credit_Limit,
                            'LeadTime':row.DeliveryDuration,
                            'Status':'Active'if  row.Status else 'Inactive',
                            'Notes':row.Notes,
                            'FileAttachment':get_file_image(row.File_Attachment) if row.File_Attachment else None,
                        }
                        
                    

                        

                        Supplier_Bank_instance=Supplier_Bank_Details.objects.filter(Supplier_Detials__pk=row.Supplier_Id)
                        bank_Array=[]
                        if Supplier_Bank_instance:
                                
                            for Bank in Supplier_Bank_instance:
                                bankdic={
                                    'id':Bank.pk,
                                    'BankName':Bank.Bank_Name,
                                    'AccountNumber':Bank.Account_Number,
                                    'IFSCCode':Bank.IFSCCode,
                                    'BankBranch':Bank.BankBranch,
                                }
                                bank_Array.append(bankdic)
                                
                            dic['Bank_Details']=bank_Array
                        else:
                            dic['Bank_Details']=[]
                       


                        Supplier_Array.append(dic)
                        index += 1



                    return JsonResponse (Supplier_Array,safe=False)
            else:
                
                filter_conditions = Q()
                
                if ProductCategory:
                    filter_conditions &= Q(ProductCategory__pk =ProductCategory)
                if SubCategory:
                    filter_conditions &= Q(SubCategory__pk =SubCategory)
                if ItemCode:
                    filter_conditions &= Q(pk__icontains=ItemCode)
                if ItemName:
                    filter_conditions &= Q(ItemName__icontains=ItemName)
                if GenericName:
                    filter_conditions &= Q(GenericName__pk=GenericName)
                if CompanyName:
                    filter_conditions &= Q(CompanyName__pk=CompanyName)
                if HSNCode:
                    filter_conditions &= Q(HSNCode__icontains=HSNCode)
                    
                Product_Instance = Product_Master_All_Category_Details.objects.filter(filter_conditions).order_by('Supplier_Name')
                productList=[]
                if Product_Instance.exists():
                    for ins in Product_Instance:
                        data={
                            "id":len(productList)+1,
                            "ItemCode":ins.pk,
                            "ItemName":ins.ItemName,
                            "ProductCategory":ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
                            "SubCategory":ins.SubCategory.SubCategoryName if ins.SubCategory else '',
                        }
                        productList.append(data)
                return JsonResponse (productList,safe=False)
                
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500)
    else:
        return JsonResponse ({'error':'method not allowed'},status=400)







@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Supplier_product_Mapping_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract required fields
            SupplierId = data.get('SupplierId')
            ItemId = data.get('ItemCode')
            PurchaseRateBeforeGST = data.get('PurchaseRateBeforeGST')
            product_GST = data.get('GST')
            PurchaseRateAfterGST = data.get('PurchaseRateAfterGST')
            product_MRP = data.get('MRP')
            edit = data.get('edit', False)
            pk = data.get('pk', None)
            statusedit = data.get('statusedit', False)
            created_by = data.get('created_by', '')

            # Validation for required fields
            if edit:
                if not pk:
                    return JsonResponse({'warn': 'Product Category is a mandatory field'}, status=400)
            else:
                if not SupplierId:
                    return JsonResponse({'warn': 'SupplierId is a mandatory field'}, status=400)
                if not ItemId:
                    return JsonResponse({'warn': 'ItemId is a mandatory field'}, status=400)

            if edit and pk:
                try:
                    supplier_product_ins = Supplier_Product_Details.objects.get(pk=pk)
                    
                    if statusedit:
                        supplier_product_ins.Status = not supplier_product_ins.Status
                        supplier_product_ins.save()
                        return JsonResponse({'success': f'Product status updated for the Supplier of {supplier_product_ins.Supplier_Detials.Supplier_Name}'}, status=200)
                    # Fetch the latest record based on supplier details
                    sup_pro_amount_ins = Supplier_Product_Amount_Details.objects.filter(
                        Supplier_detials=supplier_product_ins
                    ).order_by('-Created_at').first()

                    # Flag to check if any field value has changed
                    is_changed = False

                    # Check if the values differ from the latest record
                    if sup_pro_amount_ins:
                        if (sup_pro_amount_ins.PurchaseRateBeforeGST != PurchaseRateBeforeGST or
                            sup_pro_amount_ins.GST != product_GST or
                            sup_pro_amount_ins.PurchaseRateAfterGST != PurchaseRateAfterGST or
                            sup_pro_amount_ins.MRP != product_MRP):
                            is_changed = True
                    else:
                        # If no previous record exists, consider it a change (new data)
                        is_changed = True

                    # If any field has changed, create a new entry
                    if is_changed:
                        Supplier_Product_Amount_Details.objects.create(
                            Supplier_detials=supplier_product_ins,
                            PurchaseRateBeforeGST=PurchaseRateBeforeGST,
                            GST=product_GST,
                            PurchaseRateAfterGST=PurchaseRateAfterGST,
                            MRP=product_MRP,
                            EditType='Master',
                            created_by=created_by
                        )
                    
                    return JsonResponse({'success': 'Product details updated successfully'}, status=200)

                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=400)

            supplier_ins = Supplier_Master_Details.objects.get(pk=SupplierId)
            product_ins = Product_Master_All_Category_Details.objects.get(pk=ItemId)
            # Create new supplier product mapping
            if Supplier_Product_Details.objects.filter(
                    Supplier_Detials=supplier_ins,
                    Product_Detials=product_ins,
                ).exists():
                return JsonResponse({'warn': f'Product details already exist for {supplier_ins.Supplier_Name}'}, status=200)

            supp_prod_inss = Supplier_Product_Details.objects.create(
                Supplier_Detials=supplier_ins,
                Product_Detials=product_ins,
                created_by=created_by
            )
            Supplier_Product_Amount_Details.objects.create(
                Supplier_detials=supp_prod_inss,
                PurchaseRateBeforeGST=PurchaseRateBeforeGST,
                GST=product_GST,
                PurchaseRateAfterGST=PurchaseRateAfterGST,
                MRP=product_MRP,
                EditType='Master',
                created_by=created_by
            )
            
            return JsonResponse({'success': f'Product details added successfully for {supplier_ins.Supplier_Name}'}, status=201)

        except Supplier_Master_Details.DoesNotExist:
            return JsonResponse({'error': 'Supplier not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    elif request.method == 'GET':
        try:
            from Masters.models import Inventory_Location_Master_Detials
            SupplierId = request.GET.get('SupplierId')
            ItemCode = request.GET.get('ItemCode')
            ItemName = request.GET.get('ItemName')
            Store = request.GET.get('Store')
            mappedProducts = request.GET.get('mappedProducts', 'false').lower() == 'true'
            forquickgrn = request.GET.get('forquickgrn', 'false').lower() == 'true'

            if not SupplierId:
                return JsonResponse({'error': 'SupplierId is required'}, status=400)

            productlist = []

            if not mappedProducts:
                # Fetch mapped products
                if not forquickgrn:
                    supplier_products = Supplier_Product_Details.objects.filter(Supplier_Detials__pk=SupplierId)
                else:
                    filters = Q()
                    if ItemCode:
                        filters &= Q(Product_Detials__pk__icontains=ItemCode)
                    if ItemName:
                        filters &= Q(Product_Detials__ItemName__icontains=ItemName)

                    supplier_products = Supplier_Product_Details.objects.filter(
                        Supplier_Detials__pk=SupplierId, Status=True, Product_Detials__Status=True
                    ).filter(filters)[:30]
                for ins in supplier_products:
                    AvailQuantity  = 0
                    if Store:
                        inv = Inventory_Location_Master_Detials.objects.filter(Store_Id=Store).first()
                        st = Stock_Maintance_Table_Detials.objects.filter(Product_Detials__pk=ins.Product_Detials.pk,Store_location=inv)
                        for s in st:
                            AvailQuantity+=int(s.AvailableQuantity)
                    product_item = ins.Product_Detials
                    amount = Supplier_Product_Amount_Details.objects.filter(
                        Supplier_detials=ins
                    ).order_by('-Created_at').first()

                    field_names = product_item.ProductCategory.Product_fields.values_list('field_Name', flat=True) if product_item.ProductCategory else []
                    cleaned_fields = [f.replace(' ', '') for f in field_names]

                    base_data = {
                        'AvailQuantity':AvailQuantity,
                        'id': ins.pk,
                        'SupplierPoductId': ins.pk,
                        'ItemCode': product_item.pk,
                        'ItemName': product_item.ItemName,
                        'ProductCategory': product_item.ProductCategory.ProductCategory_Name if product_item.ProductCategory else '',
                        'ProductCategory_pk': product_item.ProductCategory.pk if product_item.ProductCategory else '',
                        'SubCategory': product_item.SubCategory.SubCategoryName if product_item.SubCategory else '',
                        'SubCategory_pk': product_item.SubCategory.SubCategory_Id if product_item.SubCategory else '',
                        'ManufacturerName': product_item.CompanyName.CompanyName if product_item.CompanyName else '',
                        'ManufacturerName_pk': product_item.CompanyName.CompanyName_Id if product_item.CompanyName else '',
                        'GenericName': product_item.GenericName.GenericName if product_item.GenericName else '',
                        'GenericName_pk': product_item.GenericName.GenericName_Id if product_item.GenericName else '',
                        'HSNCode': product_item.HSNCode,
                        'PackType': product_item.PackType.PackType_Name if product_item.PackType else '',
                        'PackType_pk': product_item.PackType.PackType_Id if product_item.PackType else '',
                        'PackQuantity': product_item.PackQty,
                        'LeastSellableUnit': product_item.LeastSellableUnit if 'IsSellable' in cleaned_fields else 'Not Sellable',
                        'Status': 'Active' if ins.Status else 'Inactive',
                        'Is_Manufacture_Date_Available': product_item.Is_Manufacture_Date_Available,
                        'Is_Expiry_Date_Available': product_item.Is_Expiry_Date_Available
                    }

                    # Add pricing fields
                    if forquickgrn:
                        base_data.update({
                            'PreviousMRP': amount.MRP if amount else '',
                            'PreviousPurchaseRateBeforeGST': amount.PurchaseRateBeforeGST if amount else '',
                            'PreviousGST': amount.GST if amount else '',
                            'PreviousPurchaseRateAfterGST': amount.PurchaseRateAfterGST if amount else ''
                        })
                    else:
                        base_data.update({
                            'MRP': amount.MRP if amount else '',
                            'PurchaseRateBeforeGST': amount.PurchaseRateBeforeGST if amount else '',
                            'GST': amount.GST if amount else '',
                            'PurchaseRateAfterGST': amount.PurchaseRateAfterGST if amount else ''
                        })

                    productlist.append(base_data)

            else:
                # Fetch unmapped products
                mapped_ids = Supplier_Product_Details.objects.filter(
                    Supplier_Detials__pk=SupplierId
                ).values_list('Product_Detials__pk', flat=True)

                filters = Q()
                if ItemCode:
                    filters &= Q(pk__icontains=ItemCode)
                if ItemName:
                    filters &= Q(ItemName__icontains=ItemName)

                unmapped_products = Product_Master_All_Category_Details.objects.filter(
                    Status=True
                ).filter(filters).exclude(pk__in=mapped_ids)[:30]

                for prod in unmapped_products:
                    amount = Supplier_Product_Amount_Details.objects.filter(
                        Supplier_detials__Supplier_Detials__pk=SupplierId,
                        Supplier_detials__Product_Detials__pk=prod.pk
                    ).order_by('-Created_at').first()

                    try:
                        field_names = prod.ProductCategory.Product_fields.values_list('field_Name', flat=True) if prod.ProductCategory else []
                    except Exception:
                        field_names = []
                    cleaned_fields = [f.replace(' ', '') for f in field_names]

                    data = {
                        'id': prod.pk,
                        'ItemName': prod.ItemName,
                        'ProductCategory': prod.ProductCategory.ProductCategory_Name if prod.ProductCategory else '',
                        'ProductCategory_pk': prod.ProductCategory.pk if prod.ProductCategory else '',
                        'SubCategory': prod.SubCategory.SubCategoryName if prod.SubCategory else '',
                        'SubCategory_pk': prod.SubCategory.SubCategory_Id if prod.SubCategory else '',
                        'CompanyName': prod.CompanyName.CompanyName if prod.CompanyName else '',
                        'ManufacturerName_pk': prod.CompanyName.CompanyName_Id if prod.CompanyName else '',
                        'GenericName': prod.GenericName.GenericName if prod.GenericName else '',
                        'GenericName_pk': prod.GenericName.GenericName_Id if prod.GenericName else '',
                        'HSNCode': prod.HSNCode,
                        'PackType': prod.PackType.PackType_Name if prod.PackType else '',
                        'PackType_pk': prod.PackType.PackType_Id if prod.PackType else '',
                        'PackQuantity': prod.PackQty,
                        'MRP': amount.MRP if amount else '',
                        'PurchaseRateBeforeGST': amount.PurchaseRateBeforeGST if amount else '',
                        'GST': amount.GST if amount else '',
                        'PurchaseRateAfterGST': amount.PurchaseRateAfterGST if amount else ''
                    }

                    # Filter only relevant fields
                    filtered = {k: v for k, v in data.items() if k in cleaned_fields or k in [
                        'id', 'MRP', 'PurchaseRateBeforeGST', 'GST', 'PurchaseRateAfterGST',
                        'ProductCategory_pk', 'SubCategory_pk', 'ManufacturerName_pk', 'PackType_pk', 'GenericName_pk'
                    ]}
                    productlist.append(filtered)

            return JsonResponse(productlist, safe=False)

        except Exception as e:
            print(f'GET Error: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Request method not allowed'}, status=405)


        
# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS","GET"])
# def Supplier_product_Mapping_link(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)

#             # Extract required fields
#             SupplierId = data.get('SupplierId')
#             ItemId = data.get('ItemCode')
#             PurchaseRateBeforeGST = data.get('PurchaseRateBeforeGST')
#             product_GST = data.get('GST')
#             PurchaseRateAfterGST = data.get('PurchaseRateAfterGST')
#             product_MRP = data.get('MRP')
#             edit = data.get('edit', False)
#             pk = data.get('pk', None)
#             statusedit = data.get('statusedit', False)
#             created_by = data.get('created_by','')

#             # Validation for required fields
#             if edit :
#                 if not pk:
#                     return JsonResponse({'warn': 'Product Category is a mandatory field'}, status=400)
#             else:
                
#                 if not SupplierId:
#                     return JsonResponse({'warn': 'SupplierId is a mandatory field'}, status=400)
#                 if not ItemId:
#                     return JsonResponse({'warn': 'ItemId is a mandatory field'}, status=400)

 
#             if edit and pk:
#                 try:
#                     supplier_product_ins = Supplier_Product_Details.objects.get(pk=pk)
                    
#                     if statusedit:
#                         supplier_product_ins.Status = not supplier_product_ins.Status
#                         supplier_product_ins.save()
#                         return JsonResponse({'success': f'Product status updated for the Supplier of {supplier_product_ins.Supplier_Detials.Supplier_Name}'}, status=200)
#                     # Fetch the latest record based on supplier details
#                     sup_pro_amount_ins = Supplier_Product_Amount_Details.objects.filter(
#                         Supplier_detials=supplier_product_ins
#                     ).order_by('-Created_at').first()

#                     # Flag to check if any field value has changed
#                     is_changed = False

#                     # Check if the values differ from the latest record
#                     if sup_pro_amount_ins:
#                         if (sup_pro_amount_ins.PurchaseRateBeforeGST != PurchaseRateBeforeGST or
#                             sup_pro_amount_ins.GST != product_GST or
#                             sup_pro_amount_ins.PurchaseRateAfterGST != PurchaseRateAfterGST or
#                             sup_pro_amount_ins.MRP != product_MRP):
#                             is_changed = True
#                     else:
#                         # If no previous record exists, consider it a change (new data)
#                         is_changed = True

#                     # If any field has changed, create a new entry
#                     if is_changed:
#                         Supplier_Product_Amount_Details.objects.create(
#                             Supplier_detials=supplier_product_ins,
#                             PurchaseRateBeforeGST=PurchaseRateBeforeGST,
#                             GST=product_GST,
#                             PurchaseRateAfterGST=PurchaseRateAfterGST,
#                             MRP=product_MRP,
#                             EditType='Master',
#                             created_by=created_by
#                         )
                    
                    
#                     return JsonResponse({'success': 'Product details updated successfully'}, status=200)

#                 except Supplier_Product_Details.DoesNotExist:
#                     return JsonResponse({'error': 'Product details not found'}, status=404)
           
           

           
#             supplier_ins = Supplier_Master_Details.objects.get(pk=SupplierId)
#             product_ins = Product_Master_All_Category_Details.objects.get(pk = ItemId)
#             # Create new supplier product mapping
#             if Supplier_Product_Details.objects.filter(
#                     Supplier_Detials=supplier_ins,
#                     Product_Detials=product_ins,
#                 ).exists():
#                 return JsonResponse({'warn': f'Product details already exist for {supplier_ins.Supplier_Name}'}, status=200)

#             supp_prod_inss = Supplier_Product_Details.objects.create(
#                 Supplier_Detials=supplier_ins,
#                 Product_Detials=product_ins,
#                 created_by=created_by
#             )
#             Supplier_Product_Amount_Details.objects.create(
#                 Supplier_detials=supp_prod_inss,
#                 PurchaseRateBeforeGST=PurchaseRateBeforeGST,
#                 GST=product_GST,
#                 PurchaseRateAfterGST=PurchaseRateAfterGST,
#                 MRP=product_MRP,
#                 EditType='Master',
#                 created_by=created_by
#             )
            
#             return JsonResponse({'success': f'Product details added successfully for {supplier_ins.Supplier_Name}'}, status=201)

#         except Supplier_Master_Details.DoesNotExist:
#             return JsonResponse({'error': 'Supplier not found'}, status=404)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
#     elif request.method =='GET':
#         try: 
#             SupplierId = request.GET.get('SupplierId')
#             print('SupplierId---',SupplierId)
#             ItemCode = request.GET.get('ItemCode')
#             print('ItemCode---',ItemCode)
#             ItemName = request.GET.get('ItemName')
#             print('ItemName---',ItemName)
#             mappedProducts = request.GET.get('mappedProducts', 'false').lower() == 'true'
#             print('mappedProducts--',mappedProducts)
#             forquickgrn = request.GET.get('forquickgrn', 'false').lower() == 'true'
#             print('forquickgrn',forquickgrn)
            
#             if not SupplierId:
#                 return JsonResponse({'error': 'SupplierId is required'}, status=400)
            
#             productlist = []
            
#             if not mappedProducts:
#                 print('if block working----')
#                 if not forquickgrn:
#                     Supplier_Product_instance = Supplier_Product_Details.objects.filter(Supplier_Detials__pk=SupplierId)
#                 else:
#                     filtercondition=Q()
#                     if ItemCode:
#                         filtercondition &= Q(Product_Detials__pk__icontains=ItemCode)
#                     if ItemName:
#                         filtercondition &= Q(Product_Detials__ItemName__icontains = ItemName)
#                     Supplier_Product_instance = Supplier_Product_Details.objects.filter(Supplier_Detials__pk=SupplierId, Status =True, Product_Detials__Status=True).filter(filtercondition)[:30]
                    
#                     if Supplier_Product_instance.exists():
#                         for ins in Supplier_Product_instance:
#                             product_item = ins.Product_Detials
#                             sup_pro_amount_ins = Supplier_Product_Amount_Details.objects.filter(Supplier_detials=ins).order_by('-Created_at').first()

#                             # Updated to use direct ProductCategory field
#                             product_field_names = product_item.ProductCategory.Product_fields.values_list('field_Name', flat=True) if product_item.ProductCategory else []

#                             data = {
#                                 'id': len(productlist) + 1,
#                                 'SupplierPoductId': ins.pk,
#                                 'ItemCode': product_item.pk,
#                                 'ItemName': product_item.ItemName,
#                                 'ProductCategory': product_item.ProductCategory.ProductCategory_Name if product_item.ProductCategory else '',
#                                 'SubCategory': product_item.SubCategory.SubCategoryName if product_item.SubCategory and product_item.SubCategory.SubCategoryName else '',
#                                 'SubCategory_pk':product_item.SubCategory.SubCategory_Id if product_item.SubCategory and product_item.SubCategory else '',
#                                 'ManufacturerName': product_item.CompanyName.CompanyName if product_item.CompanyName else '',
#                                 'ManufacturerName_pk':product_item.CompanyName.CompanyName_Id if product_item.CompanyName else '',
#                                 'GenericName': product_item.GenericName.GenericName if product_item.GenericName else '',
#                                 'GenericName_pk':product_item.GenericName.GenericName_Id if product_item.GenericName else '',
#                                 'HSNCode': product_item.HSNCode if product_item.HSNCode else '',
#                                 'PackType': product_item.PackType.PackType_Name if product_item.PackType else '',
#                                 'PackType_pk':product_item.PackType.PackType_Id if product_item.PackType else '',
#                                 'PackQuantity': product_item.PackQty if product_item.PackQty else '',
#                                 'LeastSellableUnit': product_item.LeastSellableUnit if product_item.LeastSellableUnit else '',
#                                 'MRP' if not forquickgrn else "PreviousMRP": sup_pro_amount_ins.MRP if sup_pro_amount_ins else '',
#                                 'PurchaseRateBeforeGST' if not forquickgrn else 'PreviousPurchaseRateBeforeGST': sup_pro_amount_ins.PurchaseRateBeforeGST if sup_pro_amount_ins else '',
#                                 'GST' if not forquickgrn else 'PreviousGST': sup_pro_amount_ins.GST if sup_pro_amount_ins else '',
#                                 'PurchaseRateAfterGST' if not forquickgrn else 'PreviousPurchaseRateAfterGST': sup_pro_amount_ins.PurchaseRateAfterGST if sup_pro_amount_ins else '',
#                                 'Status': 'Active' if ins.Status else 'Inactive',
#                                 'Is_Manufacture_Date_Available': product_item.Is_Manufacture_Date_Available,
#                                 'Is_Expiry_Date_Available': product_item.Is_Expiry_Date_Available,
#                             }

#                             filtereddata = {}
#                             cleaned_product_field_names = [field.replace(' ', '') for field in product_field_names]

#                             for fields, value in data.items():
#                                 if fields in [
#                                     'id', 'MRP', 'PurchaseRateBeforeGST', 'GST', 'PurchaseRateAfterGST',
#                                     'PreviousMRP', 'PreviousPurchaseRateBeforeGST', 'PreviousGST',
#                                     'PreviousPurchaseRateAfterGST', 'Status', 'Is_Manufacture_Date_Available',
#                                     'Is_Expiry_Date_Available'
#                                 ]:
#                                     filtereddata[fields] = value
#                                 elif fields == 'LeastSellableUnit':
#                                     if 'IsSellable' in cleaned_product_field_names:
#                                         filtereddata[fields] = value
#                                     else:
#                                         filtereddata[fields] = 'Not Sellable'
#                                 else:
#                                     if fields in cleaned_product_field_names:
#                                         filtereddata[fields] = value

#                             productlist.append(filtereddata)


#                 return JsonResponse(productlist, safe=False)
            
#             else:
#                 print('else block working---------')
#                 Supplier_Product_mapped_ins = Supplier_Product_Details.objects.filter(
#                     Supplier_Detials__pk=SupplierId
#                 ).values_list('Product_Detials__pk', flat=True)

#                 print('Supplier_Product_mapped_ins--', Supplier_Product_mapped_ins)
#                 filtercondition = Q()

#                 if ItemCode:
#                     filtercondition &= Q(pk__icontains=ItemCode)
#                 if ItemName:
#                     filtercondition &= Q(ItemName__icontains=ItemName)

#                 product_ins = Product_Master_All_Category_Details.objects.filter(
#                     Status=True
#                 ).filter(filtercondition).exclude(pk__in=Supplier_Product_mapped_ins)[:30]

#                 print('product_ins----', product_ins)

#                 for ins in product_ins:
#                     print('ProductCategory:', ins.ProductCategory)

#                     sup_pro_amount_ins = Supplier_Product_Amount_Details.objects.filter(
#                         Supplier_detials__Supplier_Detials__pk=SupplierId,
#                         Supplier_detials__Product_Detials__pk=ins.pk
#                     ).order_by('-Created_at').first()

#                     try:
#                         product_category = ins.ProductCategory
#                         if product_category:
#                             product_field_names = product_category.Product_fields.values_list('field_Name', flat=True)
#                         else:
#                             product_field_names = []
#                     except Exception as e:
#                         print(f"Error fetching product category or fields: {e}")
#                         product_field_names = []

#                     data = {
#                         'id': ins.pk,
#                         'ItemName': ins.ItemName,
#                         'ProductCategory': ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
#                         'SubCategory': ins.SubCategory.SubCategoryName if ins.SubCategory and ins.SubCategory.SubCategoryName else '',
#                         'CompanyName': ins.CompanyName.CompanyName if ins.CompanyName else '',
#                         'GenericName': ins.GenericName.GenericName if ins.GenericName else '',
#                         'HSNCode': ins.HSNCode if ins.HSNCode else '',
#                         'PackType': ins.PackType.PackType_Name if ins.PackType else 'Nill',
#                         'PackQuantity': ins.PackQty if ins.PackQty else 'Nill',
#                         'MRP': sup_pro_amount_ins.MRP if sup_pro_amount_ins else '',
#                         'PurchaseRateBeforeGST': sup_pro_amount_ins.PurchaseRateBeforeGST if sup_pro_amount_ins else '',
#                         'GST': sup_pro_amount_ins.GST if sup_pro_amount_ins else '',
#                         'PurchaseRateAfterGST': sup_pro_amount_ins.PurchaseRateAfterGST if sup_pro_amount_ins else '',
#                     }

#                     filtereddata = {}
#                     cleaned_product_field_names = [field.replace(' ', '') for field in product_field_names]

#                     for field, value in data.items():
#                         if field in ['id', 'MRP', 'PurchaseRateBeforeGST', 'GST', 'PurchaseRateAfterGST']:
#                             filtereddata[field] = value
#                         elif field in cleaned_product_field_names:
#                             filtereddata[field] = value

#                     productlist.append(filtereddata)

#             return JsonResponse(productlist, safe=False)


#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
#     else:
#         return JsonResponse({'error': f'An error occurred: Request method not allowed'}, status=500)

    


@csrf_exempt
@require_http_methods(["GET"])
def Supplier_Data_Get(request):
    if request.method == "GET":
        try:
            ForQuickGrn = request.GET.get('ForQuickGrn', 'false').lower() == 'true'
            SupplierCode = request.GET.get('SupplierCode')
            SupplierName = request.GET.get('SupplierName')
            if not ForQuickGrn:
                if SupplierCode:
                    Supplier_Master_instance=Supplier_Master_Details.objects.get(pk=SupplierCode)
                    dic={
                            'id':Supplier_Master_instance.Supplier_Id,
                            'SupplierName':Supplier_Master_instance.Supplier_Name,
                            'SupplierType':Supplier_Master_instance.Supplier_Type,
                            'ContactPerson':Supplier_Master_instance.Contact_Person,
                            'ContactNumber':Supplier_Master_instance.Contact_Number,
                            'EmailAddress':Supplier_Master_instance.Email_Address,
                            'Address':Supplier_Master_instance.Address,
                            'RegistrationNumber':Supplier_Master_instance.Registration_Number,
                            'GSTNumber':Supplier_Master_instance.GST_Number,
                            'PANNumber':Supplier_Master_instance.PAN_Number,
                            'PaymentTerms':Supplier_Master_instance.Payment_Terms,
                            'CreditLimit':Supplier_Master_instance.Credit_Limit,
                            'LeadTime':Supplier_Master_instance.DeliveryDuration,
                            'Status':'Active'if  Supplier_Master_instance.Status else 'Inactive',
                            'Notes':Supplier_Master_instance.Notes,
                            # 'PaymentMode':Supplier_Master_instance.Payment_Mode,
                            
                        }

                    return JsonResponse(dic,safe=False)
            
            else:
                filterQuery=Q()
                if SupplierCode:
                    filterQuery &= Q(pk__icontains = SupplierCode)
                if SupplierName:
                    filterQuery &= Q(Supplier_Name__icontains = SupplierName)

                Supplier_Master_instance=Supplier_Master_Details.objects.filter(Is_Optical=False,Is_GEN=False,Status=True).filter(filterQuery)

                Supplier_Array=[]

                for row in Supplier_Master_instance:
                    dic={
                        'id':row.pk,
                        'SupplierName':row.Supplier_Name,
                        'ContactNo':row.Contact_Number,
                    }
                    Supplier_Array.append(dic)
                
                return JsonResponse (Supplier_Array,safe=False)
            
            
            
        except Exception  as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500) 




@csrf_exempt
@require_http_methods(["GET"])
def Product_wise_supplier_getdata(request):
    if request.method == "GET":
        try:
            ItemCode = request.GET.get('ItemCode', '')

            if ItemCode :
                
                # Get the supplier product details related to the ItemId
                Supplier_Product_instance = Supplier_Product_Details.objects.filter(
                    Product_Detials__pk=ItemCode
                ).order_by('Supplier_Detials__pk')

                # Dictionary to store final result
                list_supplier = {
                    'data': [],
                    'Suppliers':[]
                }

                # Prepare a set of suppliers
                
                for sup_ins in Supplier_Product_instance:
                    list_supplier['Suppliers'].append({
                        "id":sup_ins.Supplier_Detials.pk,
                        "Name":sup_ins.Supplier_Detials.Supplier_Name
                    })
                
                # List of Amount types to loop over
                amount_types = ["PurchaseRateBeforeGST", "GST", "PurchaseRateAfterGST", "MRP"]
                amount_type_labels = {
                    "PurchaseRateBeforeGST": "PurchaseRateBeforeGST",
                    "GST": "GST",
                    "PurchaseRateAfterGST": "PurchaseRateAfterGST",
                    "MRP": "MRP"
                }
                
                # Loop through each amount type and create rows for each supplier
                for amount_type in amount_types:
                    dic = {
                        'id': len(list_supplier['data']) + 1,
                        'AmountType': amount_type_labels[amount_type],
                    }

                    

                    # Populate supplier-specific values
                    for sup_ins in Supplier_Product_instance:
                        supp_pro_amount_ins = Supplier_Product_Amount_Details.objects.filter(
                            Supplier_detials=sup_ins,
                            Supplier_detials__Product_Detials__pk=ItemCode
                        )
                        for s_amount in supp_pro_amount_ins:
                            supplier_key = f"{str(sup_ins.Supplier_Detials.pk)}"
                            dic[supplier_key] = getattr(s_amount, amount_type, "-")

                    list_supplier['data'].append(dic)

                return JsonResponse(list_supplier, safe=False)
            else:
                return JsonResponse({'error': 'Both ProductId and ProductCategory are required'}, status=400)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def PO_Supplier_Data_Get(request):
    if request.method == "GET":
        try:
            SupplierTwo=request.GET.get('SupplierTwo')
            SupplierId = request.GET.get('SupplierId')
            
            if SupplierId:
                Supplier_Master_instance=Supplier_Master_Details.objects.get(pk=SupplierId)
                dic={
                        'id':Supplier_Master_instance.Supplier_Id,
                        'SupplierName':Supplier_Master_instance.Supplier_Name,
                        'SupplierType':Supplier_Master_instance.Supplier_Type,
                        'ContactPerson':Supplier_Master_instance.Contact_Person,
                        'ContactNumber':Supplier_Master_instance.Contact_Number,
                        'EmailAddress':Supplier_Master_instance.Email_Address,
                        'Address':Supplier_Master_instance.Address,
                        'RegistrationNumber':Supplier_Master_instance.Registration_Number,
                        'GSTNumber':Supplier_Master_instance.GST_Number,
                        'PANNumber':Supplier_Master_instance.PAN_Number,
                        'PaymentTerms':Supplier_Master_instance.Payment_Terms,
                        'CreditLimit':Supplier_Master_instance.Credit_Limit,
                        'LeadTime':Supplier_Master_instance.DeliveryDuration,
                        'Status':'Active'if  Supplier_Master_instance.Status else 'Inactive',
                        'Notes':Supplier_Master_instance.Notes,
                        
                    }

                return JsonResponse(dic,safe=False)
            
            elif SupplierTwo:
                

                Supplier_Master_instance=Supplier_Master_Details.objects.filter(Status=True)

                Supplier_Array=[]

                for row in Supplier_Master_instance:
                    dic={
                        'id':row.pk,
                        'SupplierName':row.Supplier_Name,
                    }
                    Supplier_Array.append(dic)
                
                return JsonResponse (Supplier_Array,safe=False)
            
            
            
        except Exception  as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':'An internal server error occurred'},status=500) 




# -------------------change 10.10.24


# @csrf_exempt
# @require_http_methods(["GET"])
# def PO_SupplierWise_product_Get(request):
#     if request.method == "GET":
#         try:
#             SupplierId = request.GET.get('SupplierId')
#             POitems = request.GET.get('POitems')
#             SupplierTwo = request.GET.get('SupplierTwo')

#             Item_Array=[]
#             # Convert POitems to a list of integers if it's not empty
#             if POitems:
#                 POitems_list = [int(item) for item in POitems.split(',')]
#             else:
#                 POitems_list = []

#             if SupplierId:
#                 Supplier_Product_Inst = Supplier_Product_Details.objects.filter(Supplier_Detials__Supplier_Id=SupplierId, Product_Detials__Status=True, Status=True)
#             else:
#                 return JsonResponse({'error': 'Supplier not found'}, status=404)

#             if not Supplier_Product_Inst:
#                 return JsonResponse(Item_Array, safe=False)

#             if SupplierTwo:
#                 for row in Supplier_Product_Inst:
#                     item_Dec = {
#                         'ItemCode': row.Product_Detials.pk,
#                         'ItemName': row.Product_Detials.ItemName,
#                         'ProductCategory': row.Product_Detials.ProductCategory.ProductCategory_Name,
#                         'SubCategory': row.Product_Detials.SubCategory.SubCategoryName if row.Product_Detials.SubCategory else '',

#                     }
#                     Item_Array.append(item_Dec)

#             else:
#                 for row in Supplier_Product_Inst:
#                     if not POitems_list or row.Product_Detials.pk not in POitems_list:
#                         Get_Rate_Inst = Supplier_Product_Amount_Details.objects.filter(Supplier_detials=row,Supplier_detials__Product_Detials=row.Product_Detials).order_by('-Created_at').first()
#                         item_Dec = {
#                             'ItemCode': row.Product_Detials.pk,
#                             'ItemName': row.Product_Detials.ItemName,
#                             'ProductCategory': row.Product_Detials.ProductCategory.ProductCategory_Name,
#                             'SubCategory': row.Product_Detials.SubCategory.SubCategoryName if row.Product_Detials.SubCategory else '',

#                         }

#                         if row.Product_Detials.GenericName:
#                             item_Dec['GenericName'] = row.Product_Detials.GenericName.GenericName
#                         if row.Product_Detials.CompanyName:
#                             item_Dec['ManufacturerName'] = row.Product_Detials.CompanyName.CompanyName
#                         if row.Product_Detials.HSNCode:
#                             item_Dec['HSNCode'] = row.Product_Detials.HSNCode
#                         if row.Product_Detials.Strength:
#                             item_Dec['Strength'] = row.Product_Detials.Strength
#                         if row.Product_Detials.StrengthType:
#                             item_Dec['StrengthType'] = row.Product_Detials.StrengthType
#                         if row.Product_Detials.Volume:
#                             item_Dec['Volume'] = row.Product_Detials.Volume
#                         if row.Product_Detials.VolumeType:
#                             item_Dec['VolumeType'] = row.Product_Detials.VolumeType.Unit_Name
#                         if row.Product_Detials.PackType:
#                             item_Dec['PackType'] = row.Product_Detials.PackType.PackType_Name
#                         if row.Product_Detials.PackQty:
#                             item_Dec['PackQty'] = row.Product_Detials.PackQty

#                         if row.Product_Detials.Is_Manufacture_Date_Available:
#                             item_Dec['Is_Manufacture_Date_Available'] = row.Product_Detials.Is_Manufacture_Date_Available
#                         if row.Product_Detials.Is_Expiry_Date_Available:
#                             item_Dec['Is_Expiry_Date_Available'] = row.Product_Detials.Is_Expiry_Date_Available

#                         # Safely check and assign 'IsSellable'
#                         if row.Product_Detials.IsSellable is not None:
#                             item_Dec['IsSellable'] = 'Yes' if row.Product_Detials.IsSellable else 'No' 
#                             if item_Dec['IsSellable'] == 'Yes':                         
#                                 item_Dec['LeastSellableUnit'] = row.Product_Detials.LeastSellableUnit

#                         item_Dec['MRP'] = Get_Rate_Inst.MRP
#                         item_Dec['PurchaseRateBeforeGST'] = Get_Rate_Inst.PurchaseRateBeforeGST
#                         item_Dec['GST'] = Get_Rate_Inst.GST
#                         item_Dec['PurchaseRateAfterGST'] = Get_Rate_Inst.PurchaseRateAfterGST

#                         Item_Array.append(item_Dec)

#             return JsonResponse(Item_Array, safe=False)
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': 'An internal server error occurred'}, status=500)



 
def replace_supplier_nan_with_none(value, mandatory_fields, field_name, model_field):
    if pd.isna(value) or (isinstance(value, str) and value.strip() == ''):
        if field_name in mandatory_fields:
            raise ValueError(f"Mandatory field {field_name} is missing or empty.")
        if isinstance(model_field, models.CharField):
            return ''  
        elif isinstance(model_field, models.IntegerField):
            return 0  
        elif isinstance(model_field,models.BooleanField):
            return True
        elif isinstance(model_field,models.TextField):
            return ''
        else:
            return None
    return value  
 
 
@csrf_exempt
def All_Supplier_Details_Upload(request):
    try:
        file = request.FILES.get("file")
        print('file',file)
        created_by = request.POST.get("created_by")
 
        if not file:
            return JsonResponse({'error': 'File  fields are required'})
 
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")  # Handle encoding errors
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"})

 
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")

        mandatory_fields = ['Supplier_Name']
 
        for row in csv_data:
            print('row----------------------------------',row)
            try:
                supplier_data = {}
                bank_data = {}
                for column, value in row.items():
                    if column == 'Supplier_Name' and isinstance(value, str):
                        # value = value.strip().replace(" ", "").upper()
                        value = value.strip() .upper()
                    if column in ['Created_at', 'Update_at']:
                        continue
                    model_field = Supplier_Master_Details._meta.get_field(column) if hasattr(Supplier_Master_Details, column) else None
                    value = replace_supplier_nan_with_none(value, mandatory_fields, column, model_field)
                    print('column :',column[:2])
                    if column[:2] == 'B_':
                        bank_field = column[2:]  
                        print('bank_field :',bank_field)
                        bank_data[bank_field] = value.strip() if isinstance(value, str) else value
                    else:
                        supplier_data[column] = value.strip() if isinstance(value, str) else value
                missing_fields = [field for field in mandatory_fields if not row.get(field)]
                print('missing_fields :',missing_fields)
                if len(missing_fields)>0:
                    return JsonResponse({'warn': f'Missing mandatory fields: {", ".join(missing_fields)}'})
 
                with transaction.atomic():
                    existing_supplier = Supplier_Master_Details.objects.filter(
                        Supplier_Name__iexact=row.get("Supplier_Name", "").strip().lower()
                        # Druglicense_Number=row.get("Druglicense_Number")
                    ).first()
                   
                    print("existing_supplier",existing_supplier)
                    if existing_supplier:
                        for field, value in supplier_data.items():
                            setattr(existing_supplier, field, value)
                        existing_supplier.save()
                        supplier_instance = existing_supplier  
                        if bank_data:
                            existing_bank = Supplier_Bank_Details.objects.filter(
                                Supplier_Detials=supplier_instance
                            ).first()
                            if existing_bank:
                                for bank_field, bank_value in bank_data.items():
                                    setattr(existing_bank, bank_field, bank_value)
                                existing_bank.save()
                            else:
                                bank_data['Supplier_Detials'] = supplier_instance
                                Supplier_Bank_Details.objects.create(**bank_data)
                    else:# Set default ledger fields
                        supplier_data['LedgerName'] = supplier_data.get('Supplier_Name', '').replace(" ", "").upper()
                        supplier_data['LedgerGroupName'] = Finance_GroupMaster_Detailes.objects.get(pk=22)
                        supplier_data['OpeningBalance'] = 0
                        supplier_data['DebitOrCredit'] = 'Dr'

                        supplier_instance = Supplier_Master_Details.objects.create(**supplier_data)
                        if bank_data:
                            bank_data['Supplier_Detials'] = supplier_instance  
                            Supplier_Bank_Details.objects.create(**bank_data)
 
            except Exception as row_error:
                continue  
 
        return JsonResponse({'success': 'Supplier Master CSV/Excel file uploaded successfully'})
 
    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)
    

@csrf_exempt
def Supplierid_ItemNameMapping_Upload(request):
    try:
        # Fetching inputs from the request
        file = request.FILES.get("file")

        print('file',file)
        created_by = request.POST.get("created_by",'host')
        SupplierItemId = request.POST.get("SupplierItemId")
        print('SupplierItemId--------',SupplierItemId)
 
        # Validate required inputs
        if not SupplierItemId:
            return JsonResponse({'warn': 'SupplierId is required'})
        if not file:
            return JsonResponse({'warn': 'File is required'})
 
        # Validate file format
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")  # Handle encoding errors
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)

 
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")
        print('csv_data',csv_data)
 
        # Process each row
        for index, row in enumerate(csv_data):
            print('row----------',row)
            try:

                ItemName = row.get("ItemName")
                if isinstance(ItemName, str):
                   
                    ItemName = ItemName.strip()
                else:
                    
                    ItemName = str(ItemName) if ItemName is not None else ""
                GST = row.get("GST", "")
                print('GST-------',GST)
                PurchaseRateBeforeGST = row.get("PurchaseRateBeforeGST")
                print('PurchaseRateBeforeGST-------',PurchaseRateBeforeGST)
                PurchaseRateAfterGST = row.get("PurchaseRateAfterGST")
                print('PurchaseRateAfterGST---------',PurchaseRateAfterGST)
                MRP = row.get("MRP")                   

                print('MRP------',MRP)
                EditType = 'Master'
                Status = True
 
                # Validate mandatory fields
                if not GST:
                    return JsonResponse({'warn': f'Row {index + 1}: GST is required'})
                if not ItemName:
                    return JsonResponse({'warn': f'Row {index + 1}: ItemName is required'})
 
                # Get Supplier Instance
                try:
                    Supplier_Instance = Supplier_Master_Details.objects.get(Supplier_Id=SupplierItemId)
                except Supplier_Master_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {index + 1}: Supplier with ID {SupplierItemId} not found'})
 
                # Get Product Instance
                try:
                    ItemName_Instance = Product_Master_All_Category_Details.objects.get(ItemName__iexact=ItemName)
                except Product_Master_All_Category_Details.DoesNotExist:
                    return JsonResponse({'warn': f'Row {index + 1}: Product with name "{ItemName}" not found'})
 
                # Check for duplicate mapping
                existing_mapping = Supplier_Product_Details.objects.filter(
                    Supplier_Detials=Supplier_Instance,
                    Product_Detials=ItemName_Instance
                ).first()  # Fetch the existing mapping instance if it exists
 
                if existing_mapping:
                    print('exitsing-----------')
                    # Update the existing mapping
                    existing_mapping.Status = Status
                    existing_mapping.created_by = created_by
                    existing_mapping.save()
 
                    # Check and update associated amount details
                    amount_details = Supplier_Product_Amount_Details.objects.filter(
                        Supplier_detials=existing_mapping
                    ).first()
 
                    if amount_details:
                        # Update amount details if they exist
                        amount_details.PurchaseRateBeforeGST = PurchaseRateBeforeGST
                        amount_details.GST = GST
                        amount_details.PurchaseRateAfterGST = PurchaseRateAfterGST
                        amount_details.MRP = MRP
                        amount_details.EditType = EditType
                        amount_details.created_by = created_by
                        amount_details.save()
                    else:
                        # Create new amount details if none exist
                        Supplier_Product_Amount_Details.objects.create(
                            Supplier_detials=existing_mapping,
                            PurchaseRateBeforeGST=PurchaseRateBeforeGST,
                            GST=GST,
                            PurchaseRateAfterGST=PurchaseRateAfterGST,
                            MRP=MRP,
                            EditType=EditType,
                            created_by=created_by,
                        )
 
                else:
                    # Create new mapping if it doesn't exist
                    with transaction.atomic():
                        supplier_item_mapping = Supplier_Product_Details.objects.create(
                            Supplier_Detials=Supplier_Instance,
                            Product_Detials=ItemName_Instance,
                            Status=Status,
                            created_by=created_by,
                        )
                        Supplier_Product_Amount_Details.objects.create(
                            Supplier_detials=supplier_item_mapping,
                            PurchaseRateBeforeGST=PurchaseRateBeforeGST,
                            GST=GST,
                            PurchaseRateAfterGST=PurchaseRateAfterGST,
                            MRP=MRP,
                            EditType=EditType,
                            created_by=created_by,
                        )
 
            except Exception as row_error:
                # Return row-specific error
                return JsonResponse({'warn': f'Row {index + 1}: An error occurred - {str(row_error)}'})
 
        # If all rows are processed successfully
        return JsonResponse({'success': 'Supplier and Product Mapping file uploaded successfully'})
 
    except Exception as e:
        # Handle general exceptions
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)





@csrf_exempt
@require_http_methods(["GET"])
def PO_SupplierWise_product_Get(request):
    if request.method == "GET":
        try:
            SupplierId = request.GET.get('SupplierId')
            POitems = request.GET.get('POitems')
            SupplierTwo = request.GET.get('SupplierTwo')

            Item_Array=[]
            # Convert POitems to a list of integers if it's not empty
            if POitems:
                POitems_list = [int(item) for item in POitems.split(',')]
            else:
                POitems_list = []

            if SupplierId:
                Supplier_Product_Inst = Supplier_Product_Details.objects.filter(Supplier_Detials__Supplier_Id=SupplierId, Status=True)
            else:
                return JsonResponse({'error': 'Supplier not found'}, status=404)

            if not Supplier_Product_Inst:
                return JsonResponse(Item_Array, safe=False)

            if SupplierTwo:
                for row in Supplier_Product_Inst:
                    item_Dec = {
                        'ItemCode': row.Product_Detials.pk,
                        'ItemName': row.Product_Detials.ItemName,
                        'ProductCategory_pk': row.Product_Detials.ProductCategory.pk,
                        'ProductCategory': row.Product_Detials.ProductCategory.ProductCategory_Name,
                        'SubCategory_pk': row.Product_Detials.SubCategory.pk if row.Product_Detials.SubCategory else '',
                        'SubCategory': row.Product_Detials.SubCategory.SubCategoryName if row.Product_Detials.SubCategory else ''
                    }
                    Item_Array.append(item_Dec)

            else:
                for row in Supplier_Product_Inst:
                    if not POitems_list or row.Product_Detials.pk not in POitems_list:
                        Get_Rate_Inst = Supplier_Product_Amount_Details.objects.filter(Supplier_detials=row,Supplier_detials__Product_Detials=row.Product_Detials).order_by('-Created_at').first()
                        item_Dec = {
                            'ItemCode': row.Product_Detials.pk,
                            'ItemName': row.Product_Detials.ItemName,
                            'ProductCategory_pk': row.Product_Detials.ProductCategory.pk,
                            'ProductCategory': row.Product_Detials.ProductCategory.ProductCategory_Name,
                            'SubCategory': row.Product_Detials.SubCategory.SubCategoryName if row.Product_Detials.SubCategory else '',
                            'SubCategory_pk': row.Product_Detials.SubCategory.pk if row.Product_Detials.SubCategory else '',
                        }


                        if row.Product_Detials.GenericName:
                            item_Dec['GenericName_pk'] = row.Product_Detials.GenericName.pk
                        if row.Product_Detials.GenericName:
                            item_Dec['GenericName'] = row.Product_Detials.GenericName.GenericName
                        if row.Product_Detials.CompanyName:
                            item_Dec['ManufacturerName_pk'] = row.Product_Detials.CompanyName.pk
                        if row.Product_Detials.CompanyName:
                            item_Dec['ManufacturerName'] = row.Product_Detials.CompanyName.CompanyName
                        if row.Product_Detials.HSNCode:
                            item_Dec['HSNCode'] = row.Product_Detials.HSNCode
                        if row.Product_Detials.Strength:
                            item_Dec['Strength'] = row.Product_Detials.Strength
                        if row.Product_Detials.StrengthType:
                            item_Dec['StrengthType'] = row.Product_Detials.StrengthType
                        if row.Product_Detials.Volume:
                            item_Dec['Volume'] = row.Product_Detials.Volume
                        if row.Product_Detials.VolumeType:
                            item_Dec['VolumeType'] = row.Product_Detials.VolumeType.Unit_Name
                        if row.Product_Detials.PackType:
                            item_Dec['PackType_pk'] = row.Product_Detials.PackType.pk
                        if row.Product_Detials.PackType:
                            item_Dec['PackType'] = row.Product_Detials.PackType.PackType_Name
                        if row.Product_Detials.PackQty:
                            item_Dec['PackQty'] = row.Product_Detials.PackQty

                        if row.Product_Detials.Is_Manufacture_Date_Available:
                            item_Dec['Is_Manufacture_Date_Available'] = row.Product_Detials.Is_Manufacture_Date_Available
                        if row.Product_Detials.Is_Expiry_Date_Available:
                            item_Dec['Is_Expiry_Date_Available'] = row.Product_Detials.Is_Expiry_Date_Available

                        # Safely check and assign 'IsSellable'
                        if row.Product_Detials.IsSellable is not None:
                            item_Dec['IsSellable'] = 'Yes' if row.Product_Detials.IsSellable else 'No' 
                            if item_Dec['IsSellable'] == 'Yes':                         
                                item_Dec['LeastSellableUnit'] = row.Product_Detials.LeastSellableUnit

                        item_Dec['MRP'] = Get_Rate_Inst.MRP
                        item_Dec['PurchaseRateBeforeGST'] = Get_Rate_Inst.PurchaseRateBeforeGST
                        item_Dec['GST'] = Get_Rate_Inst.GST
                        item_Dec['PurchaseRateAfterGST'] = Get_Rate_Inst.PurchaseRateAfterGST

                        Item_Array.append(item_Dec)

            return JsonResponse(Item_Array, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)






