import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Max, Q

import random
import string
from django.db import transaction
from decimal import Decimal
from .Login import authenticate_request

from docx import Document
import base64
# import magic  # Make sure you have the pyathon-magic library installed
import filetype
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter

import logging
 
logger = logging.getLogger(__name__)

#--------------------------------------------Radiology insert,get,update----------------------------------------







@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_Names_link(request):
    api_key = request.headers.get('Apikey')
    api_password = request.headers.get('Apipassword')
    sessionid = request.headers.get('Sessionid')
    if authenticate_request(sessionid, api_key, api_password):
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                print("Received data:", data)

                RadiologyId = data.get('RadiologyId', '')
                RadiologyName = data.get('RadiologyName', '').strip().upper()
                created_by = data.get('created_by', '')
                Location = data.get('Location', '')
                Statusedit = data.get('Statusedit', False)

                if RadiologyId:
                    try:
                        Radiology_instance = RadiologyNames_Details.objects.get(pk=RadiologyId)
                    except RadiologyNames_Details.DoesNotExist:
                        return JsonResponse({'warn': 'Radiology ID not found'})
                    if RadiologyNames_Details.objects.filter(Radiology_Name=RadiologyName).exists():
                        return JsonResponse({'warn': f"The RadiologyName '{RadiologyName}' is already present "})

                    if Statusedit:
                        Radiology_instance.Status = not Radiology_instance.Status
                    else:
                        Radiology_instance.Radiology_Name = RadiologyName
                    Radiology_instance.save()

                    # Clear existing BookingFees_Details for this Radiology instance
                  
                    return JsonResponse({'success': 'RadiologyName updated successfully'})
                else:
                    if not Location:
                        return JsonResponse({'warn': 'Location is required'})

                    try:
                        Location_instance = Location_Detials.objects.get(Location_Id=Location)
                    except Location_Detials.DoesNotExist:
                        return JsonResponse({'warn': 'Invalid location'})

                    if RadiologyNames_Details.objects.filter(Radiology_Name=RadiologyName, Location_Name=Location_instance).exists():
                        return JsonResponse({'warn': f"The RadiologyName '{RadiologyName}' is already present "})

                    Radiology_instance = RadiologyNames_Details(
                        Radiology_Name=RadiologyName,
                        Location_Name=Location_instance,
                        created_by=created_by,
                    )
                    Radiology_instance.save()

                    return JsonResponse({'success': 'RadiologyName added successfully'})

            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}, status=500)

        elif request.method == 'GET':
            try:
                Radiology_Master = RadiologyNames_Details.objects.all()
                Radiology_Master_data = []
                for Radiology in Radiology_Master:


                    Radiology_Master_data.append({
                        'id': Radiology.Radiology_Id,
                        'RadiologyName': Radiology.Radiology_Name,
                        'created_by': Radiology.created_by,
                        'Location_Name': Radiology.Location_Name.Location_Name if Radiology.Location_Name else 'Unknown',
                        'Location_Id': Radiology.Location_Name.pk if Radiology.Location_Name else 'Unknown',
                        'Status': 'Active' if Radiology.Status else 'Inactive',
                    })

                return JsonResponse(Radiology_Master_data, safe=False)
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=200)
        

   
#------------------Sub_TestName------------------------
  
# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def Radiology_details_link(request):
#     api_key = request.headers.get('Apikey')
#     api_password = request.headers.get('Apipassword')
#     sessionid = request.headers.get('Sessionid')
#     if authenticate_request(sessionid, api_key, api_password):
#         def validate_and_process_file(file):
          
#             def get_file_type(file):
#                 if file.startswith('data:application/pdf;base64'):
#                     return 'application/pdf'
#                 elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
#                     return 'image/jpeg'
#                 elif file.startswith('data:image/png;base64'):
#                     return 'image/png'
#                 elif file.startswith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64'):
#                     return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # .docx
#                 elif file.startswith('data:application/msword;base64'):
#                     return 'application/msword'  # .doc
#                 else:
#                     return 'unknown'

#             def compress_image(image, min_quality=10, step=5):
#                 output = BytesIO()
#                 quality = 95
#                 while quality >= min_quality:
#                     output.seek(0)
#                     image.save(output, format='JPEG', quality=quality)
#                     compressed_data = output.getvalue()
#                     quality -= step
#                 return compressed_data, len(compressed_data)

#             def compress_pdf(file):
#                 output = BytesIO()
#                 reader = PdfReader(file)
#                 writer = PdfWriter()
#                 for page_num in range(len(reader.pages)):
#                     writer.add_page(reader.pages[page_num])
#                 writer.write(output)
#                 return output.getvalue(), len(output.getvalue())

#             def process_word_file(file):
#                 # Open the Word file and return some information (or process it as needed)
#                 document = Document(file)
#                 # For demonstration, we return the number of paragraphs as an example of processing
#                 num_paragraphs = len(document.paragraphs)
#                 return num_paragraphs

#             if file:
#                 try:
#                     file_data = file.split(',')[1]
#                     file_content = base64.b64decode(file_data)
#                     file_size = len(file_content)

#                     max_size_mb = 5
#                     if file_size > max_size_mb * 1024 * 1024:
#                         return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'}, status=400)

#                     file_type = get_file_type(file)

#                     if file_type in ['image/jpeg', 'image/png']:
#                         image = image.open(BytesIO(file_content))
#                         if image.mode in ('RGBA', 'P'):
#                             image = image.convert('RGB')
#                         compressed_image_data, _ = compress_image(image)
#                         return compressed_image_data

#                     elif file_type == 'application/pdf':
#                         compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
#                         return compressed_pdf_data

#                     elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
#                         # Process Word files
#                         word_content = process_word_file(BytesIO(file_content))
#                         return JsonResponse({'word_content': word_content}, status=200)

#                     else:
#                         return JsonResponse({'warn': 'Unsupported file format'}, status=400)

#                 except Exception as e:
#                     return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

#             return None

  
#         if request.method == 'POST':
#             try:
#                 data = request.POST
#                 print("TestName ersdsPOST data123:", data)

#                 # Extract data from POST request
#                 TestNameId = data.get('TestNameId', '')
#                 TestCode = data.get('TestCode', '')
#                 RadiologyName = data.get('RadiologyName', '')
#                 TestName = data.get('TestName', '')
#                 Amount = data.get('Amount', '')
#                 Amount = float(Amount) if Amount else 0.0
#                 BookingFees = data.get('BookingFees', '')
#                 BookingFees = float(BookingFees) if BookingFees else 0.0
#                 Prev_Amount = data.get('Prev_Amount', '')
#                 Prev_Amount = float(Prev_Amount) if Prev_Amount else 0.0
#                 Prev_BookingFees = data.get('Prev_BookingFees', '')
#                 Prev_BookingFees = float(Prev_BookingFees) if Prev_BookingFees else 0.0
#                 created_by = data.get('created_by', '')
#                 Status = data.get('Status', '')


#                 # Ensure RadiologyName is provided and is valid
#                 if not RadiologyName:
#                     return JsonResponse({'error': 'RadiologyName is missing'}, status=400)

#                 try:
#                     RadiologyName = int(RadiologyName)
#                     rad_instance = RadiologyNames_Details.objects.get(Radiology_Id=RadiologyName)
#                     radiology_name = rad_instance.Radiology_Name
#                 except RadiologyNames_Details.DoesNotExist:
#                     return JsonResponse({'warn': 'Radiology name does not exist'})
#                 except ValueError:
#                     return JsonResponse({'warn': 'Invalid RadiologyName provided'})

#                 print("Radiology instance:", rad_instance)

#                 # Process file if available
#                 processed_files = {
#                     'ChooseFile': validate_and_process_file(data.get('ChooseFile')) if data.get('ChooseFile') else None,
#                 }

#                 if TestCode:
#                     # Update existing TestName_Details instance
#                     with transaction.atomic():
#                         try:
#                             test_instance = TestName_Details.objects.get(Test_Code=TestCode)
#                         except TestName_Details.DoesNotExist:
#                             return JsonResponse({'warn': 'TestName not found'})

                    
#                         test_instance.Radiology_Id = rad_instance
#                         test_instance.Test_Name = TestName
#                         test_instance.Prev_Amount = test_instance.Amount
#                         test_instance.Amount = Amount
#                         test_instance.Prev_BookingFees = test_instance.BookingFees
#                         test_instance.BookingFees = BookingFees
#                         test_instance.Report_file = processed_files['ChooseFile'] 
#                         test_instance.Status = Status
#                         test_instance.save()
                         
#                         # Handle SubTestName if Types is 'Yes'
#                     return JsonResponse({'success': 'TestName Updated successfully'})   
#                 else:
                    
#                     # Create new TestName_Details instance
#                     with transaction.atomic():
#                         duplicate_test = TestName_Details.objects.filter(
#                             Radiology_Id=rad_instance,
#                             Test_Name=TestName
#                         ).exists()
                        
#                         if duplicate_test:
#                             return JsonResponse({'warn': 'Test name already exists for this radiology department'})
                        
                        
                        
#                         print("errors:---------",rad_instance,TestName,Prev_Amount,Amount,Prev_BookingFees,BookingFees,processed_files,Status,created_by)
#                         inst_test_name_instance = TestName_Details(
#                             Radiology_Id=rad_instance,
#                             Test_Name=TestName,
#                             Prev_Amount=Prev_Amount,
#                             Amount=Amount,
#                             Prev_BookingFees=Prev_BookingFees,
#                             BookingFees=BookingFees,
#                             Report_file=processed_files['ChooseFile'],
#                             Status=Status,
#                             created_by=created_by,
#                         )
#                         inst_test_name_instance.save()

#                         print(inst_test_name_instance,'inst_test_name_instance')
                        
                        
#                 return JsonResponse({'success': 'TestName added successfully'})

#             except Exception as e:
#                 print(f"An error occurred: {str(e)}")
#                 return JsonResponse({'error': 'An internal server error occurred'}, status=500)

                                
                        
                    
#         elif request.method == 'GET':
#             try:

#                 def get_file_image(filedata):
#                     try:
#                         kind = filetype.guess(filedata)

#                         # List of supported MIME types
#                         supported_mime_types = [
#                             'application/pdf',
#                             'image/jpeg',
#                             'image/png',
#                             'application/msword',  # For .doc files
#                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
#                         ]

#                         contenttype1 = 'application/pdf'
#                         if kind:
#                             if kind.mime in supported_mime_types:
#                                 contenttype1 = kind.mime
                        
#                         # Return base64 encoded data with MIME type
#                         return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                    
#                     except Exception as e:
#                         print(f"Error processing file: {e}")
#                         return None

#                 TestNames = TestName_Details.objects.all()
#                 TestName_data = []
                
                
#                 for idss, TestName in enumerate(TestNames, start=1):
#                     print("haaaaaaaaaaaaaa", TestName.Radiology_Id.Location_Name.pk if TestName.Radiology_Id.Location_Name else None)
#                     TestName_dict = {
#                         'id': idss,
#                         'RadiologyId': TestName.Radiology_Id.pk,
#                         'RadiologyName': TestName.Radiology_Id.Radiology_Name,
#                         'locationid': TestName.Radiology_Id.Location_Name.pk if TestName.Radiology_Id.Location_Name else None,
#                         'TestName': TestName.Test_Name,
#                         'TestCode': TestName.Test_Code,
#                         'Prev_Amount': TestName.Prev_Amount,
#                         'Curr_Amount': TestName.Amount,
#                         'Prev_BookingFees':TestName.Prev_BookingFees,
#                         'Curr_BookingFees':TestName.BookingFees,
#                         'ChooseFile': get_file_image(TestName.Report_file) if TestName.Report_file else None,
#                         'Status': TestName.Status,
#                         'created_by': TestName.created_by,
                        
#                     }
                    
                     
#                     TestName_data.append(TestName_dict)
                
#                 return JsonResponse(TestName_data, safe=False)
            
#             except Exception as e:
#                 print(f"An error occurred: {str(e)}")
#                 return JsonResponse({'error': 'An internal server error occurred'}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid credentials'}, status=200)
        

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Radiology_details_link(request):
    api_key = request.headers.get('Apikey')
    api_password = request.headers.get('Apipassword')
    sessionid = request.headers.get('Sessionid')
    if authenticate_request(sessionid, api_key, api_password):
        def validate_and_process_file(file):
         
            def get_file_type(file):
                if file.startswith('data:application/pdf;base64'):
                    return 'application/pdf'
                elif file.startswith('data:image/jpeg;base64') or file.startswith('data:image/jpg;base64'):
                    return 'image/jpeg'
                elif file.startswith('data:image/png;base64'):
                    return 'image/png'
                elif file.startswith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64'):
                    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # .docx
                elif file.startswith('data:application/msword;base64'):
                    return 'application/msword'  # .doc
                else:
                    return 'unknown'
 
            def compress_image(image, min_quality=10, step=5):
                output = BytesIO()
                quality = 95
                while quality >= min_quality:
                    output.seek(0)
                    image.save(output, format='JPEG', quality=quality)
                    compressed_data = output.getvalue()
                    quality -= step
                return compressed_data, len(compressed_data)
 
            def compress_pdf(file):
                output = BytesIO()
                reader = PdfReader(file)
                writer = PdfWriter()
                for page_num in range(len(reader.pages)):
                    writer.add_page(reader.pages[page_num])
                writer.write(output)
                return output.getvalue(), len(output.getvalue())
 
            def process_word_file(file):
                # Open the Word file and return some information (or process it as needed)
                document = Document(file)
                # For demonstration, we return the number of paragraphs as an example of processing
                num_paragraphs = len(document.paragraphs)
                return num_paragraphs
 
            if file:
                try:
                    file_data = file.split(',')[1]
                    file_content = base64.b64decode(file_data)
                    file_size = len(file_content)
 
                    max_size_mb = 5
                    if file_size > max_size_mb * 1024 * 1024:
                        return JsonResponse({'warn': f'File size exceeds the maximum allowed size ({max_size_mb}MB)'}, status=400)
 
                    file_type = get_file_type(file)
 
                    if file_type in ['image/jpeg', 'image/png']:
                        image = image.open(BytesIO(file_content))
                        if image.mode in ('RGBA', 'P'):
                            image = image.convert('RGB')
                        compressed_image_data, _ = compress_image(image)
                        return compressed_image_data
 
                    elif file_type == 'application/pdf':
                        compressed_pdf_data, _ = compress_pdf(BytesIO(file_content))
                        return compressed_pdf_data
 
                    elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
                        # Process Word files
                        word_content = process_word_file(BytesIO(file_content))
                        return JsonResponse({'word_content': word_content}, status=200)
 
                    else:
                        return JsonResponse({'warn': 'Unsupported file format'}, status=400)
 
                except Exception as e:
                    return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)
 
            return None
 
 
        if request.method == 'POST':
            try:
                data = request.POST
                print("TestName ersdsPOST data123:", data)
 
                # Extract data from POST request
                TestNameId = data.get('TestNameId', '')
                TestCode = data.get('TestCode', '')
                RadiologyName = data.get('RadiologyName', '')
                TestName = data.get('TestName', '')
                Amount = data.get('Amount', '')
                Amount = float(Amount) if Amount else 0.0
                BookingFees = data.get('BookingFees', '')
                BookingFees = float(BookingFees) if BookingFees else 0.0
                Prev_Amount = data.get('Prev_Amount', '')
                Prev_Amount = float(Prev_Amount) if Prev_Amount else 0.0
                Prev_BookingFees = data.get('Prev_BookingFees', '')
                Prev_BookingFees = float(Prev_BookingFees) if Prev_BookingFees else 0.0
                created_by = data.get('created_by', '')
                Status = data.get('Status', '')
 
 
                # Ensure RadiologyName is provided and is valid
                if not RadiologyName:
                    return JsonResponse({'error': 'RadiologyName is missing'}, status=400)
 
                try:
                    RadiologyName = int(RadiologyName)
                    rad_instance = RadiologyNames_Details.objects.get(Radiology_Id=RadiologyName)
                    radiology_name = rad_instance.Radiology_Name
                except RadiologyNames_Details.DoesNotExist:
                    return JsonResponse({'warn': 'Radiology name does not exist'})
                except ValueError:
                    return JsonResponse({'warn': 'Invalid RadiologyName provided'})
 
                print("Radiology instance:", rad_instance)
 
                # Process file if available
                processed_files = {
                    'ChooseFile': validate_and_process_file(data.get('ChooseFile')) if data.get('ChooseFile') else None,
                }
 
                if TestCode:
                    # Update existing TestName_Details instance
                    with transaction.atomic():
                        try:
                            test_instance = TestName_Details.objects.get(Test_Code=TestCode)
                        except TestName_Details.DoesNotExist:
                            return JsonResponse({'warn': 'TestName not found'})
 
                   
                        test_instance.Radiology_Id = rad_instance
                        test_instance.Test_Name = TestName
                        test_instance.Prev_Amount = test_instance.Amount
                        test_instance.Amount = Amount
                        test_instance.Prev_BookingFees = test_instance.BookingFees
                        test_instance.BookingFees = BookingFees
                        test_instance.Report_file = processed_files['ChooseFile']
                        test_instance.Status = Status
                        test_instance.save()
                         
                        # Handle SubTestName if Types is 'Yes'
                    return JsonResponse({'success': 'TestName Updated successfully'})  
                else:
                    # Create new TestName_Details instance
                    with transaction.atomic():
                        duplicate_test = TestName_Details.objects.filter(
                            Radiology_Id=rad_instance,
                            Test_Name=TestName
                        ).exists()
 
                        if duplicate_test:
                            return JsonResponse({'warn': 'Test name already exists for this radiology department'})
                        inst_test_name_instance = TestName_Details.objects.create(
                            Radiology_Id=rad_instance,
                            Test_Name=TestName,
                            Prev_Amount=Prev_Amount,
                            Amount=Amount,
                            Prev_BookingFees=Prev_BookingFees,
                            BookingFees=BookingFees,
                            Report_file=processed_files['ChooseFile'],
                            Status=Status,
                            created_by=created_by,
                        )
 
                       
                return JsonResponse({'success': 'TestName added successfully'})
 
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}, status=500)
                   
        elif request.method == 'GET':
            try:
 
                def get_file_image(filedata):
                    try:
                        kind = filetype.guess(filedata)
 
                        # List of supported MIME types
                        supported_mime_types = [
                            'application/pdf',
                            'image/jpeg',
                            'image/png',
                            'application/msword',  # For .doc files
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  # For .docx files
                        ]
 
                        contenttype1 = 'application/pdf'
                        if kind:
                            if kind.mime in supported_mime_types:
                                contenttype1 = kind.mime
                       
                        # Return base64 encoded data with MIME type
                        return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
                   
                    except Exception as e:
                        print(f"Error processing file: {e}")
                        return None

                department= request.GET.get('department','')
                # print("Department------------",department)
                TestNames = None
                if department != "":
                    TestNames = TestName_Details.objects.filter(Radiology_Id__Radiology_Name__iexact=department)
                else:
                    TestNames = TestName_Details.objects.all()
                
                # print("Test===============",len(TestNames))
                TestName_data = []
               
               
                for idss, TestName in enumerate(TestNames, start=1):
                    TestName_dict = {
                        'id': idss,
                        'RadiologyId': TestName.Radiology_Id.pk,
                        'RadiologyName': TestName.Radiology_Id.Radiology_Name,
                        'locationid': TestName.Radiology_Id.Location_Name.pk,
                        'TestName': TestName.Test_Name,
                        'TestCode': TestName.Test_Code,
                        'Prev_Amount': TestName.Prev_Amount,
                        'Curr_Amount': TestName.Amount,
                        'Prev_BookingFees':TestName.Prev_BookingFees,
                        'Curr_BookingFees':TestName.BookingFees,
                        'ChooseFile': get_file_image(TestName.Report_file) if TestName.Report_file else None,
                        'Status': TestName.Status,
                        'created_by': TestName.created_by,
                       
                    }
                   
                     
                    TestName_data.append(TestName_dict)
               
                return JsonResponse(TestName_data, safe=False)
           
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=200)
















@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Radiology_Department_TestNames(request):
    try:

        Radiologyid = request.GET.get('id', '')
        print("Radiologyid",Radiologyid)

        # Check if Radiology ID is provided
        if not Radiologyid:
            return JsonResponse({'warn': 'Radiology department ID is required'})

        # Fetch the test names related to the selected radiology department
        test_names = TestName_Details.objects.filter(Radiology_Id_id=Radiologyid, Status="Active")

        # Prepare the response data
        testname_data = []
        for test in test_names:
            testname_data.append({
                'id': test.Test_Code,  # Test_Code as ID
                'TestName': test.Test_Name,  # Test_Name
                'Amount': test.Amount,
            })
            

        # Return the data in JSON format
        return JsonResponse(testname_data, safe=False)
      
    except Exception as e:
        # Handle any exception and return an error response
        print("Exception:", e)
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["OPTIONS", "GET"])        
def Radiology_details_link_view(request):
    api_key = request.headers.get('Apikey')
    api_password = request.headers.get('Apipassword')
    sessionid = request.headers.get('Sessionid')
    if authenticate_request(sessionid, api_key, api_password):
        try:
            Radiology_Master = RadiologyNames_Details.objects.all()
            
            
            Test_data = []
            index=0
            for rad in Radiology_Master:
                    
                rad_dic={
                    'id':index+1,
                    'RadiologyId':rad.Radiology_Id,
                    'RadiologyName': rad.Radiology_Name,
                    'LocationId': rad.Location_Name.pk,
                    'TestNames':[]
                }
                TestNames = TestName_Details.objects.filter(Radiology_Id=rad,Status='Active')
                testindx=0
                
                for test in TestNames:
                    test_dict={
                        'id':testindx+1,
                        'TestName': test.Test_Name,
                        'TestCode': test.Test_Code,
                        'Prev_Amount': test.Prev_Amount,
                        'Curr_Amount': test.Amount,
                    }
                           
                    rad_dic['TestNames'].append(test_dict)
                    testindx = testindx + 1
                    
                    
                    
                Test_data.append(rad_dic)
                index = index+ 1
            return JsonResponse(Test_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=200)

@csrf_exempt
@require_http_methods(["OPTIONS", "GET"])        
def Radiology_details_link_view_for_technician(request):
   
        try:
            
            Employeeid = request.GET.get('Employeeid','')
            Dept = request.GET.get('Dept')  
            print(Dept,'Deptttt')
            Dept = list(map(int, Dept.split(',')))
 
            empins = Employee_Personal_Form_Detials.objects.get(pk=Employeeid)
   
            depins = Department_Detials.objects.filter(Department_Id__in = Dept)
            dept_names = list(depins.values_list('Department_Name', flat=True))
 
            Radiology_Master = RadiologyNames_Details.objects.filter(Radiology_Name__in=dept_names)
            
            
            Test_data = []
            index=0
            for rad in Radiology_Master:
                    
                rad_dic={
                    'id':index+1,
                    'RadiologyId':rad.Radiology_Id,
                    'RadiologyName': rad.Radiology_Name,
                    'LocationId': rad.Location_Name.pk,
                    'TestNames':[]
                }
                TestNames = TestName_Details.objects.filter(Radiology_Id=rad,Status='Active')
                testindx=0
                
                for test in TestNames:
                    test_dict={
                        'id':testindx+1,
                        'TestName': test.Test_Name,
                        'TestCode': test.Test_Code,
                        'Prev_Amount': test.Prev_Amount,
                        'Curr_Amount': test.Amount,
                    }
                           
                    rad_dic['TestNames'].append(test_dict)
                    testindx = testindx + 1
                    
                    
                    
                Test_data.append(rad_dic)
                index = index+ 1
            return JsonResponse(Test_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 
 
@csrf_exempt
def radiology_ratecard_details_view_by_test_id(request):
    try:
        test_id = request.GET.get('TestId')
 
        print(test_id,'test_id2222222222222222222222')
       
        if test_id:
            test = TestName_Details.objects.get(pk=test_id)
            print(test,'test')
            ratecard = Radiology_Ratecard_Master.objects.get(Room_Id=test)
            print(ratecard,'ratecard')
            insurance_fees = Radiology_Insurance_Fee.objects.filter(Radiology_Ratecard=ratecard)
            print(insurance_fees,'insurance_fees')
            client_fees = Radiology_Client_Fee.objects.filter(Radiology_Ratecard=ratecard)
            print(client_fees,'client_fees')
            corporate_fees = Radiology_Corporate_Fee.objects.filter(Radiology_Ratecard=ratecard)
            print(corporate_fees,'corporate_fees')
           
            test_data = {
                'id': test.Test_Code,
                'test_name': test.Test_Name,
                'Status': 'Active' if test.Status else 'Inactive',
                'Ratecarddetials': [
                    {
                        'id': 1,
                        'isrowgroup': False,
                        'RatecardType': 'General',
                        'RatecardShow': 'General',
                        'RatecardName': None,
                        'radiology_ratecard_id': ratecard.Radiology_RateCard,
                        'prev_fee': ratecard.Prev_Fee,
                        'curr_fee': ratecard.Fee,
                    }
                ]
            }
 
            # Add insurance fees as a grouped section
            if insurance_fees:
                test_data['Ratecarddetials'].append({
                    'id': len(test_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Insurance',
                    'RatecardShow': 'Insurance',
                    'RatecardName': None,
                    'prev_fee': None,
                    'curr_fee': None,
                })
 
            for insurance_fee in insurance_fees:
                insurance_ratecard = {
                    'id': len(test_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': 'Insurance',
                    'RatecardShow': None,
                    'radiology_ratecard_id': insurance_fee.Radiology_Ratecard.Radiology_RateCard,
                    'RatecardName': insurance_fee.Insurance.Insurance_Name,
                    'Ratecardid': insurance_fee.Insurance.Insurance_Id,
                    'prev_fee': insurance_fee.Prev_Fee,
                    'curr_fee': insurance_fee.Fee,
                }
                test_data['Ratecarddetials'].append(insurance_ratecard)
 
            # Add client fees as a grouped section
            if client_fees:
                test_data['Ratecarddetials'].append({
                    'id': len(test_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Client',
                    'RatecardShow': 'Client',
                    'RatecardName': None,
                    'prev_fee': None,
                    'curr_fee': None })
 
            for client_fee in client_fees:
                client_ratecard = {
                    'id': len(test_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': 'Client',
                    'RatecardShow': None,
                    'radiology_ratecard_id': client_fee.Radiology_Ratecard.Radiology_RateCard,
                    'RatecardName': client_fee.Client.Client_Name,
                    'Ratecardid': client_fee.Client.Client_Id,
                    'prev_fee': client_fee.Prev_Fee,
                    'curr_fee': client_fee.Fee,
                }
                test_data['Ratecarddetials'].append(client_ratecard)
 
            # Add corporate fees as a grouped section
            if corporate_fees:
                test_data['Ratecarddetials'].append({
                    'id': len(test_data['Ratecarddetials']) + 1,
                    'isrowgroup': True,
                    'RatecardType': 'Corporate',
                    'RatecardShow': 'Corporate',
                    'RatecardName': None,
                    'prev_fee': None,
                    'curr_fee': None,
                })
 
            for corporate_fee in corporate_fees:
                corporate_ratecard = {
                    'id': len(test_data['Ratecarddetials']) + 1,
                    'isrowgroup': False,
                    'RatecardType': 'Corporate',
                    'RatecardShow': None,
                    'radiology_ratecard_id': corporate_fee.Radiology_Ratecard.Radiology_RateCard,
                    'RatecardName': corporate_fee.Corporate.Corporate_Name,
                    'Ratecardid': corporate_fee.Corporate.Corporate_Id,
                    'prev_fee': corporate_fee.Prev_Fee,
                    'curr_fee': corporate_fee.Fee,
                }
                test_data['Ratecarddetials'].append(corporate_ratecard)
 
            return JsonResponse(test_data, safe=False)
        else:
            return JsonResponse({'warn': 'Test Id required to fetch the ratecard details'}, safe=False)
   
    except Exception as e:
        return JsonResponse({'error': str(e)})
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def radiology_ratecard_details_update(request):
    try:
        data = json.loads(request.body)
        test_id = data.get('test_id')
        RatecardType = data.get('RatecardType')
        radiology_ratecard_id = data.get('radiology_ratecard_id')
        Ratecardid = data.get('Ratecardid')
        col = data.get('col')
        changedRate = data.get('changedRate')
 
        if not test_id:
            return JsonResponse({'error': 'Test ID is required'}, status=400)
       
        test_details = TestName_Details.objects.get(Test_Id=test_id)
 
        if RatecardType == 'General':
            ratecard = Radiology_Ratecard_Master.objects.get(Radiology_RateCard=radiology_ratecard_id)
            if col == 'fee':
                ratecard.Prev_Fee = ratecard.Fee
                ratecard.Fee = changedRate
                ratecard.save()
            else:
                return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
        elif RatecardType == 'Insurance':
            insurance_fee = Radiology_Insurance_Fee.objects.get(
                Radiology_Ratecard__Radiology_RateCard=radiology_ratecard_id,
                Insurance__Insurance_Id=Ratecardid
            )
            if col == 'fee':
                insurance_fee.Prev_Fee = insurance_fee.Fee
                insurance_fee.Fee = changedRate
                insurance_fee.save()
            else:
                return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
        elif RatecardType == 'Client':
            client_fee = Radiology_Client_Fee.objects.get(
                Radiology_Ratecard__Radiology_RateCard=radiology_ratecard_id,
                Client__Client_Id=Ratecardid
            )
            if col == 'fee':
                client_fee.Prev_Fee = client_fee.Fee
                client_fee.Fee = changedRate
                client_fee.save()
            else:
                return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
        elif RatecardType == 'Corporate':
            corporate_fee = Radiology_Corporate_Fee.objects.get(
                Radiology_Ratecard__Radiology_RateCard=radiology_ratecard_id,
                Corporate__Corporate_Id=Ratecardid
            )
            if col == 'fee':
                corporate_fee.Prev_Fee = corporate_fee.Fee
                corporate_fee.Fee = changedRate
                corporate_fee.save()
            else:
                return JsonResponse({'error': f'Invalid column: {col}'}, status=400)
 
        else:
            return JsonResponse({'error': f'Invalid RatecardType: {RatecardType}'}, status=400)
 
        return JsonResponse({
            'success': f'Test {test_details.Test_Name} ratecard details updated successfully'
        }, status=200)
 
    except TestName_Details.DoesNotExist:
        return JsonResponse({'error': 'Test not found'}, status=404)
    except Radiology_Ratecard_Master.DoesNotExist:
        return JsonResponse({'error': 'Ratecard not found'}, status=404)
    except Radiology_Insurance_Fee.DoesNotExist:
        return JsonResponse({'error': 'Insurance fee not found'}, status=404)
    except Radiology_Client_Fee.DoesNotExist:
        return JsonResponse({'error': 'Client fee not found'}, status=404)
    except Radiology_Corporate_Fee.DoesNotExist:
        return JsonResponse({'error': 'Corporate fee not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
   
 
@csrf_exempt
@require_http_methods(["OPTIONS", "GET", "POST"])
def Radiology_Ratecardmaster(request):
    if request.method == "GET":
        try:
            # Fetch all Radiology Ratecard Master entries
            RadsearchTerm = request.GET.get('RadsearchTerm','')
           
            if RadsearchTerm:
                ratecards = Radiology_Ratecard_Master.objects.filter(
                    Room_Id__Test_Name__icontains=RadsearchTerm
                ).select_related('Room_Id__Radiology_Id')
            else:
                ratecards = Radiology_Ratecard_Master.objects.all().select_related('Room_Id__Radiology_Id')[:10]
 
            discount_fees = Discount_Radiology_Fee.objects.all().select_related('discount')
            ratecard_data = []
 
            for ratecard in ratecards:
                department_name = ratecard.Room_Id.Radiology_Id.Radiology_Name
                test_name = ratecard.Room_Id.Test_Name
                cghs_code = ratecard.Room_Id.CGHS_CODE
 
                discount_details = []
                relevant_discounts = [df for df in discount_fees if df.Radiology_Test_Id == ratecard]
                for discount_fee in relevant_discounts:
                    discount_details.append({
                        "Method": discount_fee.discount_method,
                        "Ratecardname": discount_fee.discount.DiscountName or "",
                        "RatecardType": discount_fee.discount.Patient_Type or "",
                        "Prev_Fee": str(discount_fee.Prev_Test_Fee or ""),
                        "Cur_Fee": str(discount_fee.Cur_Test_Fee or ""),
                        "RatecardId": str(discount_fee.discount.Discount_ID or "")
                    })
 
                insurance_details = []
                relevant_insurances = Radiology_Insurance_Fee.objects.filter(Radiology_Ratecard=ratecard)
                for ins in relevant_insurances:
                    insurance_details.append({
                        "RatecardName": ins.Insurance.Insurance_Name,
                        "Ratecardid": ins.Insurance.Insurance_Id,
                        "Fee": str(ins.Fee),
                        "Prev_Fee": str(ins.Prev_Fee or "")
                    })
 
                client_details = []
                relevant_clients = Radiology_Client_Fee.objects.filter(Radiology_Ratecard=ratecard)
                for client in relevant_clients:
                    client_details.append({
                        "RatecardName": client.Client.Client_Name,
                        "Ratecardid": client.Client.Client_Id,
                        "Fee": str(client.Fee),
                        "Prev_Fee": str(client.Prev_Fee or "")
                    })
 
                ratecard_entry = {
                    "id": f"RAD{str(ratecard.Radiology_RateCard)}",
                    "Department": department_name,
                    "TestName": test_name,
                    "CGHSCode": cghs_code,
                    "Status": ratecard.Room_Id.Status,
                    "BasicFee": str(ratecard.Room_Id.Amount),
                    "DiscountDetails": discount_details,
                    "DoctorContribution": [
                        {"Type": "Inhouse", "Value": str(ratecard.inhouse_Doctor_Contribution)},
                        {"Type": "Visiting", "Value": str(ratecard.visiting_Doctor_Contribution)},
                        {"Type": "Referral", "Value": str(ratecard.referal_Doctor_Contribution)}
                    ],
                    "InsuranceDetails": insurance_details,
                    "ClientDetails": client_details
                }
                ratecard_data.append(ratecard_entry)
 
            return JsonResponse(ratecard_data, safe=False)
 
        except Exception as e:
            logger.error(f"Error fetching radiology ratecard data: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.info(f"Received Radiology Ratecard Data for {len(data)} tests")
 
            if not isinstance(data, list):
                logger.error("Invalid payload: Expected a list of test objects")
                return JsonResponse({"error": "Invalid payload format"}, status=400)
 
            with transaction.atomic():
                for test in data:
                    test_id = test.get('Test_Id')
                    if not test_id or not test_id.startswith('RAD'):
                        logger.error(f"Invalid or missing Test_Id: {test_id}")
                        return JsonResponse({"error": "Invalid or missing Test_Id"}, status=400)
 
                    # Extract numeric ID (remove 'RAD' prefix)
                    try:
                        ratecard_num = test_id.replace('RAD', '')
                        ratecard = Radiology_Ratecard_Master.objects.get(Radiology_RateCard=ratecard_num)
                    except Radiology_Ratecard_Master.DoesNotExist:
                        logger.error(f"Radiology_Ratecard_Master not found for test_id: {test_id}")
                        return JsonResponse({"error": f"Ratecard not found for test_id: {test_id}"}, status=404)
 
                    # Update Basic Fee and CGHS Code
                    if 'BasicFee' in test and test['BasicFee'] is not None:
                        try:
                            basic_fee = Decimal(str(test['BasicFee']))
                            if basic_fee < 0:
                                raise ValueError("BasicFee cannot be negative")
                            if ratecard.Room_Id:
                                room = ratecard.Room_Id
                                room.Amount = basic_fee
                                room.save()
                                logger.info(f"Updated Room_Id.Amount for test {test_id}: {basic_fee}")
                            else:
                                logger.warning(f"No Room_Id associated with ratecard {test_id}")
                        except (ValueError, TypeError) as e:
                            logger.error(f"Invalid BasicFee for test_id {test_id}: {test['BasicFee']} - {str(e)}")
                            return JsonResponse({"error": f"Invalid BasicFee for test_id {test_id}"}, status=400)
                   
                    # Update CGHS Code
                    if 'CGHSCode' in test and test['CGHSCode'] is not None:
                        try:
                            cghs_code = str(test['CGHSCode']).strip()
                            if ratecard.Room_Id:
                                room = ratecard.Room_Id
                                room.CGHS_CODE = cghs_code
                                room.save()
                                logger.info(f"Updated CGHS_CODE for test {test_id}: {cghs_code}")
                            else:
                                logger.warning(f"No Room_Id associated with ratecard {test_id}")
                        except Exception as e:
                            logger.error(f"Error updating CGHS code for test_id {test_id}: {str(e)}")
                            return JsonResponse({"error": f"Invalid CGHS code for test_id {test_id}"}, status=400)
                   
                    # Update Doctor Contributions
                    if 'DoctorContribution' in test:
                        for contrib in test['DoctorContribution']:
                            contrib_type = contrib.get('Type')
                            contrib_value = contrib.get('Value')
                            if contrib_value is not None and contrib_value != '':
                                try:
                                    value = Decimal(str(contrib_value))
                                    if value < 0:
                                        raise ValueError(f"{contrib_type} contribution cannot be negative")
                                    if contrib_type == 'Inhouse':
                                        ratecard.inhouse_Doctor_Contribution = value
                                    elif contrib_type == 'Visiting':
                                        ratecard.visiting_Doctor_Contribution = value
                                    elif contrib_type == 'Referral':
                                        ratecard.referal_Doctor_Contribution = value
                                    else:
                                        logger.error(f"Invalid contribution type for test_id {test_id}: {contrib_type}")
                                        return JsonResponse({"error": f"Invalid contribution type: {contrib_type}"}, status=400)
                                except (ValueError, TypeError) as e:
                                    logger.error(f"Invalid {contrib_type} contribution for test_id {test_id}: {contrib_value} - {str(e)}")
                                    return JsonResponse({"error": f"Invalid {contrib_type} contribution for test_id {test_id}"}, status=400)
                       
                        # Save doctor contributions
                        ratecard.save()
                        logger.info(f"Updated Doctor Contributions for test {test_id}")
 
                    # Update Insurance Details
                    if 'InsuranceDetails' in test:
                        for insurance in test['InsuranceDetails']:
                            insurance_id = insurance.get('Ratecardid')
                            if not insurance_id:
                                logger.error(f"Missing Ratecardid for Insurance in test_id {test_id}")
                                return JsonResponse({"error": f"Missing Ratecardid for Insurance in test_id {test_id}"}, status=400)
                           
                            try:
                                insurance_fee = Radiology_Insurance_Fee.objects.get(
                                    Radiology_Ratecard=ratecard,
                                    Insurance__Insurance_Id=insurance_id
                                )
                               
                                if 'Fee' in insurance and insurance['Fee'] is not None and insurance['Fee'] != '':
                                    try:
                                        fee = Decimal(str(insurance['Fee']))
                                        if fee < 0:
                                            raise ValueError("Insurance Fee cannot be negative")
                                        insurance_fee.Prev_Fee = insurance_fee.Fee
                                        insurance_fee.Fee = fee
                                        insurance_fee.save()
                                        logger.info(f"Updated Insurance Fee for test {test_id}, Insurance_Id {insurance_id}: {fee}")
                                    except (ValueError, TypeError) as e:
                                        logger.error(f"Invalid Insurance Fee for test_id {test_id}, Insurance_Id {insurance_id}: {insurance['Fee']} - {str(e)}")
                                        return JsonResponse({"error": f"Invalid Insurance Fee for test_id {test_id}"}, status=400)
                            except Radiology_Insurance_Fee.DoesNotExist:
                                logger.error(f"Radiology_Insurance_Fee not found for test_id {test_id}, Insurance_Id {insurance_id}")
                                return JsonResponse({"error": f"Insurance not found for test_id {test_id}, Insurance_Id {insurance_id}"}, status=404)
 
                    # Update Client Details
                    if 'ClientDetails' in test:
                        for client in test['ClientDetails']:
                            client_id = client.get('Ratecardid')
                            if not client_id:
                                logger.error(f"Missing Ratecardid for Client in test_id {test_id}")
                                return JsonResponse({"error": f"Missing Ratecardid for Client in test_id {test_id}"}, status=400)
                           
                            try:
                                client_fee = Radiology_Client_Fee.objects.get(
                                    Radiology_Ratecard=ratecard,
                                    Client__Client_Id=client_id
                                )
                               
                                if 'Fee' in client and client['Fee'] is not None and client['Fee'] != '':
                                    try:
                                        fee = Decimal(str(client['Fee']))
                                        if fee < 0:
                                            raise ValueError("Client Fee cannot be negative")
                                        client_fee.Prev_Fee = client_fee.Fee
                                        client_fee.Fee = fee
                                        client_fee.save()
                                        logger.info(f"Updated Client Fee for test {test_id}, Client_Id {client_id}: {fee}")
                                    except (ValueError, TypeError) as e:
                                        logger.error(f"Invalid Client Fee for test_id {test_id}, Client_Id {client_id}: {client['Fee']} - {str(e)}")
                                        return JsonResponse({"error": f"Invalid Client Fee for test_id {test_id}"}, status=400)
                            except Radiology_Client_Fee.DoesNotExist:
                                logger.error(f"Radiology_Client_Fee not found for test_id {test_id}, Client_Id {client_id}")
                                return JsonResponse({"error": f"Client not found for test_id {test_id}, Client_Id {client_id}"}, status=404)
 
                    # Update Discount Details
                    if 'DiscountDetails' in test:
                        for discount in test['DiscountDetails']:
                            discount_id = discount.get('RatecardId')
 
                            if not discount_id:
                                logger.error(f"Missing RatecardId for Discount in test_id {test_id}")
                                return JsonResponse({"error": f"Missing RatecardId for Discount in test_id {test_id}"}, status=400)
                           
                            try:
                                discount_fee = Discount_Radiology_Fee.objects.get(
                                    Radiology_Test_Id=ratecard,
                                    discount__Discount_ID=discount_id
                                )
                               
                                if 'Cur_Fee' in discount and discount['Cur_Fee'] is not None and discount['Cur_Fee'] != '':
                                    try:
                                        fee = Decimal(str(discount['Cur_Fee']))
                                        if fee < 0:
                                            raise ValueError("Discount Fee cannot be negative")
                                        discount_fee.Prev_Test_Fee = discount_fee.Cur_Test_Fee
                                        discount_fee.Cur_Test_Fee = fee
                                        logger.info(f"Updated Discount Cur_Fee for test {test_id}, Discount_ID {discount_id}: {fee}")
                                    except (ValueError, TypeError) as e:
                                        logger.error(f"Invalid Discount Cur_Fee for test_id {test_id}, Discount_ID {discount_id}: {discount['Cur_Fee']} - {str(e)}")
                                        return JsonResponse({"error": f"Invalid Discount Cur_Fee for test_id {test_id}"}, status=400)
                               
                                if 'Method' in discount and discount['Method'] is not None and discount['Method'] != '':
                                    if discount['Method'] not in ['Percentage', 'Value']:
                                        logger.error(f"Invalid Method for test_id {test_id}, Discount_ID {discount_id}: {discount['Method']}")
                                        return JsonResponse({"error": f"Invalid Method for Discount in test_id {test_id}"}, status=400)
                                    discount_fee.discount_method = discount['Method']
                               
                                discount_fee.save()
                            except Discount_Radiology_Fee.DoesNotExist:
                                logger.error(f"Discount_Radiology_Fee not found for test_id {test_id}, Discount_ID {discount_id}")
                                return JsonResponse({"error": f"Discount not found for test_id {test_id}, Discount_ID {discount_id}"}, status=404)
 
                return JsonResponse({
                    "success": True,
                    "message": f"Successfully updated {len(data)} radiology ratecard(s)"
                })
 
        except json.JSONDecodeError:
            logger.error("Invalid JSON payload")
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.error(f"Error updating radiology ratecard: {str(e)}")
            return JsonResponse({"error": f"Failed to update radiology ratecard: {str(e)}"}, status=500)
 
 
 
 

@csrf_exempt
@require_http_methods(["OPTIONS", "GET", "POST"])
def Service_Ratecard_Master_API(request):
    if request.method == "GET":
        try:
            SearchbyServiceid = request.GET.get('SearchbyServiceid')
            SearchbyServicesubCategoryid = request.GET.get('SearchbyServicesubCategoryid')
            all_ratecards = Service_Ratecard_Master.objects.select_related('Service')[:10]
 
            if SearchbyServiceid:
                all_ratecards = Service_Ratecard_Master.objects.filter(Service__ServiceCategory__Serviceid = SearchbyServiceid)
           
            if SearchbyServicesubCategoryid:
                all_ratecards = all_ratecards.filter(Service__Service_Id = SearchbyServicesubCategoryid)
 

            data = []
 
            for ratecard in all_ratecards:
                item = {
                    "id": f"SRM{ratecard.Service_RateCard}",
                    "Category": ratecard.Service.ServiceCategory.ServiceCategory,
                    "ServiceName": ratecard.Service.Service_Name,
                    "ServiceId": ratecard.Service.Service_Id,
                    "CGHSCode": ratecard.Service.CGHS_CODE or "",  # Add CGHS Code to response
                    "BasicFee": str(ratecard.Service.Amount),
                    "PrevFee": str(ratecard.Prev_Fee),
                    "Department": str(ratecard.Service.Department),
                    "DoctorContribution": [
                        {"Type": "Inhouse", "Value": str(ratecard.inhouse_Doctor_Contribution)},
                        {"Type": "Visiting", "Value": str(ratecard.visiting_Doctor_Contribution)},
                        {"Type": "Referral", "Value": str(ratecard.referal_Doctor_Contribution)},
                    ],
                    "InsuranceDetails": [],
                    "ClientDetails": [],
                    "CorporateDetails": [],
                    'DiscountDetails': [],
                    'WardDetails': [],
                }
 
                # Insurance Fees
                for ins in ratecard.Service_Insurance_Fee.all():
                    item["InsuranceDetails"].append({
                        "RatecardName": ins.Insurance.Insurance_Name,
                        "Ratecardid": ins.Insurance.Insurance_Id,
                        "Fee": str(ins.Fee),
                        "Prev_Fee": str(ins.Prev_Fee)
                    })
 
                # Client Fees
                for client in ratecard.Service_Client_Fee.all():
                    item["ClientDetails"].append({
                        "RatecardName": client.Client.Client_Name,
                        "Ratecardid": client.Client.Client_Id,
                        "Fee": str(client.Fee),
                        "Prev_Fee": str(client.Prev_Fee)
                    })
 
                # Ward Fees
                ward_fees = WardtypeFee.objects.filter(service_ratecard=ratecard)
               
                for ward_fee in ward_fees:
                    try:
                        item["WardDetails"].append({
                            "WardName": ward_fee.ward.Ward_Name,
                            "WardId": ward_fee.ward.Ward_Id,
                            "GeneralFee": str(ward_fee.General_fee),
                            "GeneralPrevFee": str(ward_fee.General_Prev_fee),
                            "SpecialFee": str(ward_fee.Special_fee),
                            "SpecialPrevFee": str(ward_fee.Special_Prev_fee)
                        })
                    except WardType_Master_Detials.DoesNotExist:
                        logger.warning(f"Ward not found for WardtypeFee ID: {ward_fee.id}")
                        continue
 
                # Discount Details
                disc = Discount_service_Fee.objects.filter(service_Id=ratecard)
                for dis in disc:
                    item["DiscountDetails"].append({
                        "Method": dis.discount_method,
                        "Ratecardid": dis.discount.Discount_ID,
                        "Ratecardname": dis.discount.DiscountName or "",
                        "RatecardType": dis.discount.Patient_Type or "",
                        "Prev_Fee": str(dis.Prev_Test_Fee or ""),
                        "Cur_Fee": str(dis.Cur_Test_Fee or ""),
                        "RatecardId": str(dis.discount.Discount_ID or "")
                    })
 
                # Corporate Fees
                for corp in ratecard.Service_Corporate_Fee.all():
                    item["CorporateDetails"].append({
                        "RatecardName": corp.Corporate.Corporate_Name,
                        "Ratecardid": corp.Corporate.Corporate_Id,
                        "Fee": str(corp.Fee),
                        "Prev_Fee": str(corp.Prev_Fee)
                    })
 
                data.append(item)
 
            return JsonResponse(data, safe=False)
 
        except Exception as e:
            logger.error(f"GET Service Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
       
    elif request.method == "POST":
        try:
            print('on post ...')
            data = json.loads(request.body)
            print('data', data)
            logger.info(f"Received POST Data: {data}")
 
            if not isinstance(data, list):
                return JsonResponse({"error": "Invalid format. Expected list of entries."}, status=400)
 
            with transaction.atomic():
                for entry in data:
                    ratecard_id = entry["id"].replace("SRM", "")
                    ratecard = Service_Ratecard_Master.objects.get(Service_RateCard=ratecard_id)
 
                    # Update Basic Fee
                    ratecard.Prev_Fee = ratecard.Fee
                    ratecard.Fee = Decimal(entry["BasicFee"])
 
                    # Update CGHS Code
                    if "CGHSCode" in entry:
                        service_master = ratecard.Service
                        service_master.CGHS_CODE = entry["CGHSCode"]
                        service_master.save()
                        logger.info(f"Updated CGHS_CODE for service {service_master.Service_Id}: {entry['CGHSCode']}")
 
                    # Doctor Contribution
                    for dc in entry.get("DoctorContribution", []):
                        val = Decimal(dc["Value"])
                        if dc["Type"] == "Inhouse":
                            ratecard.inhouse_Doctor_Contribution = val
                        elif dc["Type"] == "Visiting":
                            ratecard.visiting_Doctor_Contribution = val
                        elif dc["Type"] == "Referral":
                            ratecard.referal_Doctor_Contribution = val
 
                    ratecard.save()
 
                    # Insurance Update
                    for ins in entry.get("InsuranceDetails", []):
                        Service_Insurance_Fee.objects.filter(
                            Service_Ratecard=ratecard,
                            Insurance__Insurance_Id=ins["Ratecardid"]
                        ).update(
                            Prev_Fee=ins["Fee"],
                            Fee=Decimal(ins["Fee"])
                        )
 
                    # Client Update
                    for client in entry.get("ClientDetails", []):
                        Service_Client_Fee.objects.filter(
                            Service_Ratecard=ratecard,
                            Client__Client_Id=client["Ratecardid"]
                        ).update(
                            Prev_Fee=client["Fee"],
                            Fee=Decimal(client["Fee"])
                        )
 
                    # Corporate Update
                    for corp in entry.get("CorporateDetails", []):
                        Service_Corporate_Fee.objects.filter(
                            Service_Ratecard=ratecard,
                            Corporate__Corporate_Id=corp["Ratecardid"]
                        ).update(
                            Prev_Fee=corp["Fee"],
                            Fee=Decimal(corp["Fee"])
                        )
                       
                    # Discount Update
                    for disc in entry.get("DiscountDetails", []):
                        Discount_service_Fee.objects.filter(
                            service_Id=ratecard,
                            discount__Discount_ID=disc["Ratecardid"]
                        ).update(
                            discount_method=disc["Method"],
                            Cur_Test_Fee=disc["Cur_Fee"]
                        )
 
                    # Ward Details Update
                    for ward in entry.get("WardDetails", []):
                        # Get or create WardTypeFee record
                        ward_fee, created = WardtypeFee.objects.get_or_create(
                            service_ratecard=ratecard,
                            ward_id=ward["WardId"],
                            defaults={
                                'General_Prev_fee': Decimal(ward.get("GeneralPrevFee", 0)),
                                'General_fee': Decimal(ward["GeneralFee"]),
                                'Special_Prev_fee': Decimal(ward.get("SpecialPrevFee", 0)),
                                'Special_fee': Decimal(ward["SpecialFee"]),
                            }
                        )
                       
                        if not created:
                            # Update existing ward fee record
                            ward_fee.General_Prev_fee = ward_fee.General_fee
                            ward_fee.Special_Prev_fee = ward_fee.Special_fee
                            ward_fee.General_fee = Decimal(ward["GeneralFee"])
                            ward_fee.Special_fee = Decimal(ward["SpecialFee"])
                            ward_fee.save()
 
            return JsonResponse({"success": "Service Ratecard updated successfully."})
 
        except Service_Ratecard_Master.DoesNotExist:
            logger.error(f"Service Ratecard not found: {ratecard_id}")
            return JsonResponse({'error': 'Service Ratecard not found'}, status=404)
        except Exception as e:
            logger.error(f"POST Service Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)  
 
 
 
 
 
@csrf_exempt
@require_http_methods(["OPTIONS", "GET", "POST"])
def Therapy_Ratecard_Master_API(request):
    if request.method == "GET":
        try:
            all_ratecards = Therapy_Ratecard_Master.objects.select_related('Therapy').all()
 
            data = []
 
            for ratecard in all_ratecards:
                item = {
                    "id": f"TRM{ratecard.Therapy_RateCard}",
                    "TherapyName": ratecard.Therapy.Therapy_Name,
                    "TherapyId": ratecard.Therapy.Therapy_Id,
                    "BasicFee": str(ratecard.Fee),
                    "PrevFee": str(ratecard.Prev_Fee),
                    "Department": str(ratecard.Therapy.Department),
                    "DoctorContribution": [
                        {"Type": "Inhouse", "Value": str(ratecard.inhouse_Doctor_Contribution)},
                        {"Type": "Visiting", "Value": str(ratecard.visiting_Doctor_Contribution)},
                        {"Type": "Referral", "Value": str(ratecard.referal_Doctor_Contribution)},
                    ],
                    "InsuranceDetails": [],
                    "ClientDetails": [],
                    "CorporateDetails": [],
                    "DiscountDetails": [],
                    "WardDetails": [],
                }
 
                # Insurance
                for ins in ratecard.Therapy_Insurance_Fee.all():
                    item["InsuranceDetails"].append({
                        "RatecardName": ins.Insurance.Insurance_Name,
                        "Ratecardid": ins.Insurance.Insurance_Id,
                        "Fee": str(ins.Fee),
                        "Prev_Fee": str(ins.Prev_Fee)
                    })
 
                # Client
                for client in ratecard.Therapy_Client_Fee.all():
                    item["ClientDetails"].append({
                        "RatecardName": client.Client.Client_Name,
                        "Ratecardid": client.Client.Client_Id,
                        "Fee": str(client.Fee),
                        "Prev_Fee": str(client.Prev_Fee)
                    })
 
                # Corporate
                for corp in ratecard.Therapy_Corporate_Fee.all():
                    item["CorporateDetails"].append({
                        "RatecardName": corp.Corporate.Corporate_Name,
                        "Ratecardid": corp.Corporate.Corporate_Id,
                        "Fee": str(corp.Fee),
                        "Prev_Fee": str(corp.Prev_Fee)
                    })
 
                # Discount
                for dis in Therapy_Discount_Fee.objects.filter(therapy_Id=ratecard):
                    item["DiscountDetails"].append({
                        "Method": dis.discount_method,
                        "Ratecardid": dis.discount.Discount_ID,
                        "Ratecardname": dis.discount.DiscountName or "",
                        "RatecardType": dis.discount.Patient_Type or "",
                        "Prev_Fee": str(dis.Prev_Therapy_Fee or ""),
                        "Cur_Fee": str(dis.Cur_Therapy_Fee or ""),
                        "RatecardId": str(dis.discount.Discount_ID or "")
                    })
 
                # Ward
                for ward_fee in WardtypeFeeForTherapy.objects.filter(Therapy_ratecard=ratecard):
                    item["WardDetails"].append({
                        "WardName": ward_fee.ward.Ward_Name,
                        "WardId": ward_fee.ward.Ward_Id,
                        "GeneralFee": str(ward_fee.General_fee),
                        "GeneralPrevFee": str(ward_fee.General_Prev_fee),
                        "SpecialFee": str(ward_fee.Special_fee),
                        "SpecialPrevFee": str(ward_fee.Special_Prev_fee),
                    })
 
                data.append(item)
 
            return JsonResponse(data, safe=False)
 
        except Exception as e:
            logger.error(f"GET Therapy Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
 
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.info(f"Received POST Data: {data}")
 
            if not isinstance(data, list):
                return JsonResponse({"error": "Invalid format. Expected list of entries."}, status=400)
 
            with transaction.atomic():
                for entry in data:
                    ratecard_id = entry["id"].replace("TRM", "")
                    ratecard = Therapy_Ratecard_Master.objects.get(Therapy_RateCard=ratecard_id)
 
                    # Basic Fee
                    ratecard.Prev_Fee = ratecard.Fee
                    ratecard.Fee = Decimal(entry["BasicFee"])
 
                    # Doctor Contributions
                    for dc in entry.get("DoctorContribution", []):
                        val = Decimal(dc["Value"])
                        if dc["Type"] == "Inhouse":
                            ratecard.inhouse_Doctor_Contribution = val
                        elif dc["Type"] == "Visiting":
                            ratecard.visiting_Doctor_Contribution = val
                        elif dc["Type"] == "Referral":
                            ratecard.referal_Doctor_Contribution = val
 
                    ratecard.save()
 
                    # Insurance Update
                    for ins in entry.get("InsuranceDetails", []):
                        Therapy_Insurance_Fee.objects.filter(
                            Therapy_Ratecard=ratecard,
                            Insurance__Insurance_Id=ins["Ratecardid"]
                        ).update(
                            Prev_Fee=ins["Fee"],
                            Fee=Decimal(ins["Fee"])
                        )
 
                    # Client Update
                    for client in entry.get("ClientDetails", []):
                        Therapy_Client_Fee.objects.filter(
                            Therapy_Ratecard=ratecard,
                            Client__Client_Id=client["Ratecardid"]
                        ).update(
                            Prev_Fee=client["Fee"],
                            Fee=Decimal(client["Fee"])
                        )
 
                    # Corporate Update
                    for corp in entry.get("CorporateDetails", []):
                        Therapy_Corporate_Fee.objects.filter(
                            Therapy_Ratecard=ratecard,
                            Corporate__Corporate_Id=corp["Ratecardid"]
                        ).update(
                            Prev_Fee=corp["Fee"],
                            Fee=Decimal(corp["Fee"])
                        )
 
                    # Discount Update
                    for disc in entry.get("DiscountDetails", []):
                        Therapy_Discount_Fee.objects.filter(
                            therapy_Id=ratecard,
                            discount__Discount_ID=disc["Ratecardid"]
                        ).update(
                            discount_method=disc["Method"],
                            Cur_Therapy_Fee=disc["Cur_Fee"]
                        )
 
                    # Ward Update
                    for ward in entry.get("WardDetails", []):
                        ward_fee, created = WardtypeFeeForTherapy.objects.get_or_create(
                            Therapy_ratecard=ratecard,
                            ward_id=ward["WardId"],
                            defaults={
                                'General_Prev_fee': Decimal(ward.get("GeneralPrevFee", 0)),
                                'General_fee': Decimal(ward["GeneralFee"]),
                                'Special_Prev_fee': Decimal(ward.get("SpecialPrevFee", 0)),
                                'Special_fee': Decimal(ward["SpecialFee"]),
                            }
                        )
 
                        if not created:
                            ward_fee.General_Prev_fee = ward_fee.General_fee
                            ward_fee.Special_Prev_fee = ward_fee.Special_fee
                            ward_fee.General_fee = Decimal(ward["GeneralFee"])
                            ward_fee.Special_fee = Decimal(ward["SpecialFee"])
                            ward_fee.save()
 
            return JsonResponse({"message": "Therapy Ratecard updated successfully."})
 
        except Therapy_Ratecard_Master.DoesNotExist:
            logger.error(f"Therapy Ratecard not found: {ratecard_id}")
            return JsonResponse({'error': 'Therapy Ratecard not found'}, status=404)
 
        except Exception as e:
            logger.error(f"POST Therapy Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)


       
@csrf_exempt
@require_http_methods(["OPTIONS", "GET", "POST"])
def Doctor_Ratecard_Master_API(request):
    if request.method == "GET":
        try:
            search_by_name = request.GET.get('SearchbyFirstName')
            search_by_specialityid = request.GET.get('SearchbySpecialityId')

            query = Q()

            if search_by_name:
                query &= (
                    Q(Doctor_ID__Doctor_ID=search_by_name) |
                    Q(Doctor_ID__First_Name__icontains=search_by_name) |
                    Q(Doctor_ID__Middle_Name__icontains=search_by_name) |
                    Q(Doctor_ID__Last_Name__icontains=search_by_name)
                )

            # Filter Doctor_Ratecard_Master based on speciality if provided
            if search_by_specialityid:
                doctor_ids = Doctor_ProfessForm_Detials.objects.filter(
                    Specialization__Speciality_Id=search_by_specialityid
                ).values_list('Doctor_ID', flat=True)
                query &= Q(Doctor_ID__in=doctor_ids)

            all_ratecards = Doctor_Ratecard_Master.objects.select_related('Doctor_ID').filter(query)

            print(all_ratecards.count(),'all_ratecards')
            data = []

            for ratecard in all_ratecards:
                doc_pro = Doctor_ProfessForm_Detials.objects.get(Doctor_ID = ratecard.Doctor_ID.Doctor_ID)
                item = {
                    "id": f"DRM{ratecard.RateCard_Id}",
                    "DoctorName": ratecard.Doctor_ID.First_Name,
                    "Department": doc_pro.Specialization.Speciality_Name if doc_pro.Specialization else "",
                    "DoctorId": ratecard.Doctor_ID.Doctor_ID,
                    "GeneralConsultationFee": str(ratecard.General_Consultation_Fee),
                    "GeneralPrevConsultationFee": str(ratecard.General_Prev_Consultation_Fee),
                    "GeneralFollowUpFee": str(ratecard.General_Follow_Up_Fee),
                    "GeneralPrevFollowUpFee": str(ratecard.General_Prev_Follow_Up_Fee),
                    "GeneralEmgConsultingFee": str(ratecard.General_Emg_Consulting_Fee),
                    "GeneralPrevEmgConsultingFee": str(ratecard.General_Prev_Emg_Consulting_Fee),
                    "SpecialConsultationFee": str(ratecard.Special_Consultation_Fee),
                    "SpecialPrevConsultationFee": str(ratecard.Special_Prev_Consultation_Fee),
                    "SpecialFollowUpFee": str(ratecard.Special_Follow_Up_Fee),
                    "SpecialPrevFollowUpFee": str(ratecard.Special_Prev_Follow_Up_Fee),
                    "SpecialEmgConsultingFee": str(ratecard.Special_Emg_Consulting_Fee),
                    "SpecialPrevEmgConsultingFee": str(ratecard.Special_Prev_Emg_Consulting_Fee),
                    "DoctorContribution": [
                        {"Type": "OP", "Value": str(ratecard.Doctor_Contribution_OP)},
                        {"Type": "IP", "Value": str(ratecard.Doctor_Contribution_IP)},
                    ],
                    "InsuranceDetails": [],
                    "ClientDetails": [],
                    "CorporateDetails": [],
                    "DiscountDetails": [],
                    "WardDetails": [],
                }

                # Insurance Fees
                for ins in ratecard.insurance_fees.all():
                    item["InsuranceDetails"].append({
                        "RatecardName": ins.insurance.Insurance_Name,
                        "RatecardidAng": ins.insurance.Insurance_Id,
                        "ConsultationFee": str(ins.Consultation_Fee),
                        "PrevConsultationFee": str(ins.Prev_Consultation_Fee),
                        "FollowUpFee": str(ins.Follow_Up_Fee),
                        "PrevFollowUpFee": str(ins.Prev_Follow_Up_Fee),
                        "EmgConsultingFee": str(ins.Emg_Consulting_Fee),
                        "PrevEmgConsultingFee": str(ins.Prev_Emg_Consulting_Fee),
                    })

                # Client Fees
                for client in ratecard.client_fees.all():
                    item["ClientDetails"].append({
                        "RatecardName": client.client.Client_Name,
                        "Ratecardid": client.client.Client_Id,
                        "ConsultationFee": str(client.Consultation_Fee),
                        "PrevConsultationFees": str(client.Prev_Consultation_Fee),
                        "FollowUpFee": str(client.Follow_Up_Fee),
                        "PrevFollowUpFee": str(client.Prev_Follow_Up_Fee),
                        "EmgConsultingFee": str(client.Emg_Consulting_Fee),
                        "PrevEmgConsultingFee": str(client.Prev_Emg_Consulting_Fee),
                    })

                # Corporate Fees
                for corp in ratecard.corporate_fees.all():
                    item["CorporateDetails"].append({
                        "RatecardName": corp.corporate.Corporate_Name,
                        "Ratecardid": corp.corporate.Corporate_Id,
                        "ConsultationFee": str(corp.Consultation_Fee),
                        "PrevConsultationFee": str(corp.Prev_Consultation_Fee),
                        "FollowUpFee": str(corp.Follow_Up_Fee),
                        "PrevFollowUpFee": str(corp.Prev_Follow_Up_Fee),
                        "EmgConsultingFee": str(corp.Emg_Consulting_Fee),
                        "PrevEmgConsultingFee": str(corp.Prev_Emg_Consulting_Fee),
                    })

                # Discount Fees
                for disc in ratecard.Discountdoctorfee.all():
                    item["DiscountDetails"].append({
                        "Method": disc.discount_method,
                        "Ratecardid": disc.discount.Discount_ID,
                        "Ratecardname": disc.discount.DiscountName or "",
                        "RatecardType": disc.discount.Patient_Type or "",
                        "Prev_Fee": str(disc.Prev_Test_Fee or ""),
                        "Cur_Fee": str(disc.Cur_Test_Fee or ""),
                        "RatecardId": str(disc.discount.Discount_ID or ""),
                    })

                # Ward Fees
                for ward in ratecard.room_fees.all():
                    item["WardDetails"].append({
                        "WardName": ward.ward.Ward_Name,
                        "WardId": ward.ward.Ward_Id,
                        "GeneralFee": str(ward.General_fee),
                        "GeneralPrevFee": str(ward.General_Prev_fee),
                        "SpecialFee": str(ward.Special_fee),
                        "SpecialPrevFee": str(ward.Special_Prev_fee),
                    })

                data.append(item)

            return JsonResponse(data, safe=False)

        except Exception as e:
            logger.error(f"GET Doctor Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.info(f"Received POST Data: {data}")

            if not isinstance(data, list):
                return JsonResponse({"error": "Invalid format. Expected list of entries."}, status=400)

            with transaction.atomic():
                for entry in data:
                    ratecard_id = entry["id"].replace("DRM", '')
                    print(ratecard_id,'rate id')
                    ratecard = Doctor_Ratecard_Master.objects.get(RateCard_Id=ratecard_id)

                    # Update Fees
                    ratecard.General_Prev_Consultation_Fee = ratecard.General_Consultation_Fee
                    ratecard.General_Consultation_Fee = Decimal(entry["GeneralConsultationFee"])
                    ratecard.General_Prev_Follow_Up_Fee = ratecard.General_Follow_Up_Fee
                    ratecard.General_Follow_Up_Fee = Decimal(entry["GeneralFollowUpFee"])
                    ratecard.General_Prev_Emg_Consulting_Fee = ratecard.General_Emg_Consulting_Fee
                    ratecard.General_Emg_Consulting_Fee = Decimal(entry["GeneralEmgConsultingFee"])
                    ratecard.Special_Prev_Consultation_Fee = ratecard.Special_Consultation_Fee
                    ratecard.Special_Consultation_Fee = Decimal(entry["SpecialConsultationFee"])
                    ratecard.Special_Prev_Follow_Up_Fee = ratecard.Special_Follow_Up_Fee
                    ratecard.Special_Follow_Up_Fee = Decimal(entry["SpecialFollowUpFee"])
                    ratecard.Special_Prev_Emg_Consulting_Fee = ratecard.Special_Emg_Consulting_Fee
                    ratecard.Special_Emg_Consulting_Fee = Decimal(entry["SpecialEmgConsultingFee"])

                    # Doctor Contribution
                    for dc in entry.get("DoctorContribution", []):
                        val = Decimal(dc["Value"])
                        if dc["Type"] == "OP":
                            ratecard.Doctor_Contribution_OP = val
                        elif dc["Type"] == "IP":
                            ratecard.Doctor_Contribution_IP = val

                    ratecard.save()

                    # Insurance Update
                    for ins in entry.get("InsuranceDetails", []):
                        InsuranceFee_for_Doctor.objects.filter(
                            doctor_ratecard=ratecard,
                            insurance__Insurance_Id=ins["RatecardidAng"]
                        ).update(
                            Prev_Consultation_Fee=ins["ConsultationFee"],
                            Consultation_Fee=Decimal(ins["ConsultationFee"]),
                            Prev_Follow_Up_Fee=ins["FollowUpFee"],
                            Follow_Up_Fee=Decimal(ins["FollowUpFee"]),
                            Prev_Emg_Consulting_Fee=ins["EmgConsultingFee"],
                            Emg_Consulting_Fee=Decimal(ins["EmgConsultingFee"]),
                        )

                    # Client Update
                    for client in entry.get("ClientDetails", []):
                        ClientFee_for_Doctor.objects.filter(
                            doctor_ratecard=ratecard,
                            client__Client_Id=client["Ratecardid"]
                        ).update(
                            Prev_Consultation_Fee=client["ConsultationFee"],
                            Consultation_Fee=Decimal(client["ConsultationFee"]),
                            Prev_Follow_Up_Fee=client["FollowUpFee"],
                            Follow_Up_Fee=Decimal(client["FollowUpFee"]),
                            Prev_Emg_Consulting_Fee=client["EmgConsultingFee"],
                            Emg_Consulting_Fee=Decimal(client["EmgConsultingFee"]),
                        )

                    # Corporate Update
                    for corp in entry.get("CorporateDetails", []):
                        CorporateFee_for_Doctor.objects.filter(
                            doctor_ratecard=ratecard,
                            corporate__Corporate_Id=corp["Ratecardid"]
                        ).update(
                            Prev_Consultation_Fee=corp["ConsultationFee"],
                            Consultation_Fee=Decimal(corp["ConsultationFee"]),
                            Prev_Follow_Up_Fee=corp["FollowUpFee"],
                            Follow_Up_Fee=Decimal(corp["FollowUpFee"]),
                            Prev_Emg_Consulting_Fee=corp["EmgConsultingFee"],
                            Emg_Consulting_Fee=Decimal(corp["EmgConsultingFee"]),
                        )

                    # Discount Update
                    for disc in entry.get("DiscountDetails", []):
                        Discount_Doctore_Fee.objects.filter(
                            doctor_id=ratecard,
                            discount__Discount_ID=disc["Ratecardid"]
                        ).update(
                            discount_method=disc["Method"],
                            Cur_Test_Fee=Decimal(disc["Cur_Fee"]),
                            Prev_Test_Fee=disc["Cur_Fee"],
                        )

                    # Ward Details Update
                    for ward in entry.get("WardDetails", []):
                        ward_fee, created = WardTypee_for_Doctor.objects.get_or_create(
                            doctor_ratecard=ratecard,
                            ward_id=ward["WardId"],
                            defaults={
                                'General_Prev_fee': Decimal(ward.get("GeneralPrevFee", 0)),
                                'General_fee': Decimal(ward["GeneralFee"]),
                                'Special_Prev_fee': Decimal(ward.get("SpecialPrevFee", 0)),
                                'Special_fee': Decimal(ward["SpecialFee"]),
                            }
                        )

                        if not created:
                            ward_fee.General_Prev_fee = ward_fee.General_fee
                            ward_fee.Special_Prev_fee = ward_fee.Special_fee
                            ward_fee.General_fee = Decimal(ward["GeneralFee"])
                            ward_fee.Special_fee = Decimal(ward["SpecialFee"])
                            ward_fee.save()

                return JsonResponse({"message": "Doctor Ratecard updated successfully."})

        except Doctor_Ratecard_Master.DoesNotExist:
            logger.error(f"Doctor Ratecard not found: {ratecard_id}")
            return JsonResponse({'error': 'Doctor Ratecard not found'}, status=404)
        except Exception as e:
            logger.error(f"POST Doctor Ratecard Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)                



import pandas as pd
from django.http import JsonResponse
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from .models import TestName_Details, RadiologyNames_Details
 
@csrf_exempt
@require_http_methods(["OPTIONS", "GET", "POST"])
def upload_testname_excel(request):
    if request.method == 'POST':
        try:
            # Check if a file is uploaded
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file uploaded'}, status=400)
 
            excel_file = request.FILES['file']
            if not excel_file.name.endswith(('.xlsx', '.xls','.csv')):
                return JsonResponse({'error': 'File must be an Excel file (.xlsx or .xls)'}, status=400)
 
            # Read Excel file
            df = pd.read_excel(excel_file)
            required_columns = [
                'Radiology_Id', 'Test_Name', 'Amount', 'BookingFees',
                'Prev_Amount', 'Prev_BookingFees', 'Status', 'created_by', 'location'
            ]
 
            # Validate columns
            if not all(col in df.columns for col in required_columns):
                return JsonResponse({'error': 'Missing required columns in Excel file'}, status=400)
 
            errors = []
            success_count = 0
 
            with transaction.atomic():
                for index, row in df.iterrows():
                    try:
                        # Extract data from row
                        radiology_id = row['Radiology_Id']
                        test_name = row['Test_Name']
                        amount = float(row['Amount']) if pd.notna(row['Amount']) else 0.0
                        booking_fees = float(row['BookingFees']) if pd.notna(row['BookingFees']) else 0.0
                        prev_amount = float(row['Prev_Amount']) if pd.notna(row['Prev_Amount']) else 0.0
                        prev_booking_fees = float(row['Prev_BookingFees']) if pd.notna(row['Prev_BookingFees']) else 0.0
                        status = row['Status']
                        created_by = row['created_by']
                        location = row['location']
 
                        # Validate Radiology_Id
                        try:
                            rad_instance = RadiologyNames_Details.objects.get(Radiology_Name=radiology_id)
                        except RadiologyNames_Details.DoesNotExist:
                            errors.append(f"Row {index + 2}: Radiology_Id {radiology_id} does not exist")
                            continue
                        except ValueError:
                            errors.append(f"Row {index + 2}: Invalid Radiology_Id {radiology_id}")
                            continue
 
                       
 
                        # Check for duplicate test name
                        duplicate_test = TestName_Details.objects.filter(
                            Radiology_Id=rad_instance,
                            Test_Name=test_name
                        ).exists()
 
                        if duplicate_test:
                            errors.append(f"Row {index + 2}: Test name '{test_name}' already exists for Radiology_Id {radiology_id}")
                            continue
 
                        # Create new TestName_Details instance
                        TestName_Details.objects.create(
                            Radiology_Id=rad_instance,
                            Test_Name=test_name,
                            Amount=amount,
                            Prev_Amount=prev_amount,
                            BookingFees=booking_fees,
                            Prev_BookingFees=prev_booking_fees,
                            Status=status,
                            created_by=created_by,
                            location=location,
                            Report_file=None  # Assuming no file upload in Excel; adjust if needed
                        )
                        success_count += 1
 
                    except Exception as e:
                        errors.append(f"Row {index + 2}: Error - {str(e)}")
 
            if errors:
                return JsonResponse({
                    'success': f'{success_count} records added successfully',
                    'errors': errors
                }, status=200 if success_count > 0 else 400)
            return JsonResponse({'success': f'{success_count} records added successfully'})
 
        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
 
    return JsonResponse({'error': 'Invalid request method'}, status=405)        
 
 

      