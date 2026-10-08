


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import *
from django.db.models import Sum, Q
from .serializers import *
import pandas as pd
from PyPDF2 import PdfReader, PdfWriter
from io import BytesIO
import base64
from PIL import Image
import filetype

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Title_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
           
            # Extract and validate data
            TitleId = data.get('TitleId')
            Title = data.get('Title')
            Statusedit = data.get('statusEdit',False)
            created_by = data.get('created_by','')
     
           
           
            if TitleId:
                if Statusedit:
                   Title_instance = Title_Detials.objects.get(Title_Id=TitleId)
                   Title_instance.Status= not Title_instance.Status
                   Title_instance.save()
                else:  
                    if Title_Detials.objects.filter(Title_Name=Title).exists():
                       return JsonResponse({'warn': f"The Title already present in the name of {Title} "})
                    else:
               
                        Title_instance = Title_Detials.objects.get(Title_Id=TitleId)
                        Title_instance.Title_Name=Title
                        Title_instance.save()
 
                return JsonResponse({'success': 'Title Updated successfully'})
            else:
                if Title_Detials.objects.filter(Title_Name=Title).exists():
                    return JsonResponse({'warn': f"The Title_Name  are already present in the name of {Title} "})
                else:
                    Religion_instance = Title_Detials(
                        Title_Name=Title,
                        created_by=created_by
                    )
                Religion_instance.save()
                return JsonResponse({'success': 'Religion added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Titles = Title_Detials.objects.all()
           
            # Construct a list of dictionaries containing location data
            Titles_Master_data = []
            for Title in Titles:
                Title_dict = {
                    'id': Title.Title_Id,
                    'Title': Title.Title_Name,
                    'status': 'Active' if Title.Status else 'Inactive',
                    'created_by': Title.created_by,
                   
                }
                Titles_Master_data.append(Title_dict)
 
            return JsonResponse(Titles_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
 
 
 
# ------------------------flaggg

@csrf_exempt   
@require_http_methods(["POST", "OPTIONS", "GET"])
def Flagg_color_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            FlaggId = data.get('FlaggId', '')
            FlaggName = data.get('FlaggName', '')
            FlaggColor = data.get('FlaggColor', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
      
            if FlaggId:
                if Statusedit:
                    try:
                        Flagg_instance = Flaggcolor_Detials.objects.get(Flagg_Id=FlaggId)
                        Flagg_instance.Status = not Flagg_instance.Status
                        Flagg_instance.save()
                        return JsonResponse({'success': 'Flagg status updated successfully'})
                    except Flaggcolor_Detials.DoesNotExist:
                        return JsonResponse({'error': f"No entry found with FlaggId '{FlaggId}'."}, status=404)
                
              
                 # Update the existing Flaggcolor_Detials object if FlaggId is provided
                try:
                    Flagg_instance = Flaggcolor_Detials.objects.get(Flagg_Id=FlaggId)
                except Flaggcolor_Detials.DoesNotExist:
                    return JsonResponse({'error': f"No entry found with FlaggId '{FlaggId}'."}, status=404)
                    
                # Check if the new FlaggName exists with a different FlaggColor or vice versa
                if Flaggcolor_Detials.objects.filter(
                    (Q(Flagg_Name=FlaggName) & ~Q(Flagg_Color=FlaggColor)) | 
                    (Q(Flagg_Color=FlaggColor) & ~Q(Flagg_Name=FlaggName))
                ).exclude(Flagg_Id=FlaggId).exists():
                    return JsonResponse({'warn': f"A Flagg Name '{FlaggName}' already exists for a different Flagg Color."})
                   
                # Update the Flagg Name and/or Flagg Color
                Flagg_instance.Flagg_Name = FlaggName
                Flagg_instance.Flagg_Color = FlaggColor
                Flagg_instance.save()

                return JsonResponse({'success': 'Flagg updated successfully'})
            else:
                if Flaggcolor_Detials.objects.filter(Q(Flagg_Name=FlaggName) & ~Q(Flagg_Color=FlaggColor)).exists():
                    return JsonResponse({'warn': f"A Flagg Name '{FlaggName}' already exists for the Flagg Color '{FlaggColor}'."})
                    
                # Create a new entry if it does not exist
                Flagg_instance = Flaggcolor_Detials(
                    Flagg_Name=FlaggName,
                    Flagg_Color=FlaggColor,
                    created_by=created_by
                )
                Flagg_instance.save()
                return JsonResponse({'success': 'Flagg added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Flagg_instance = Flaggcolor_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Flagg_instance_data = []
            for flagg in Flagg_instance:
                flagg_dict = {
                    'id': flagg.Flagg_Id,
                    'FlaggName': flagg.Flagg_Name,
                    'FlaggColor': flagg.Flagg_Color,
                    'Status': 'Active' if flagg.Status else "Inactive",
                    'created_by': flagg.created_by,
                }
                Flagg_instance_data.append(flagg_dict)

            return JsonResponse(Flagg_instance_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



#--------------------------------------------Location insert,get,update----------------------------------------






@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Location_Detials_link(request):
    if request.method == 'POST':

        
        try:


            
            data = json.loads(request.body)
            
            # Extract and validate data
            locationId = data.get('locationId','')
            locationName = data.get('locationName','')
            bedCount = data.get('bedCount','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by', '')
      
            if locationId:
                if Statusedit:
                    Location_instance = Location_Detials.objects.get(pk=locationId)
                    Location_instance.Status = not Location_instance.Status
                    Location_instance.save()
                else:
                    # if Location_Detials.objects.filter(Location_Name=locationName).exists():
                    #     pass
                    # else:
                        
                        # Update existing location
                        Location_instance = Location_Detials.objects.get(pk=locationId)
                        Location_instance.Location_Name = locationName
                        Location_instance.Bed_Count = bedCount

                        Location_instance.save()

                return JsonResponse({'success': 'Location_Name Updated successfully'})
            else:
                # Insert new location
                total_bed_count = Location_Detials.objects.filter(Location_Name='ALL').aggregate(total=Sum('Bed_Count'))['total']
                total_bed_count = total_bed_count if total_bed_count else 500

                created_bed_count = Location_Detials.objects.filter(~Q(Location_Name='ALL')).aggregate(total=Sum('Bed_Count'))['total']
                created_bed_count = created_bed_count if created_bed_count else 0

                created_bed_count_sum = created_bed_count + int(bedCount)

                if total_bed_count >= created_bed_count_sum:
                    if Location_Detials.objects.filter(Location_Name=locationName).exists():
                        return JsonResponse({'error': 'Location with the same name already exists'})

                   

                    Location_instance = Location_Detials(
                        Location_Name=locationName,
                        Bed_Count=bedCount,
                        created_by=created_by
                    )
                    Location_instance.save()

                    return JsonResponse({'success': 'Location added successfully'})
                else:
                    return JsonResponse({'warn': f'Your Registered Bed Count is {total_bed_count}, so please stay below or equal to that'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the Location_Detials model
            locations = Location_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            location_data = [
                {
                    'id': location.Location_Id,
                    'locationName': location.Location_Name,
                    'bedCount': location.Bed_Count,
                    'Status': 'Active' if location.Status else 'Inactive',
                    'created_by': location.created_by
                } for location in locations
            ]

            return JsonResponse(location_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)









#--------------------------------------------Department insert,get,update----------------------------------------




@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Department_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            DepartmentId = data.get('DepartmentId','')
            DepartmentName = data.get('DepartmentName','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
      
            
           
            if DepartmentId:
                if Statusedit:
                    Department_instance = Department_Detials.objects.get(pk=DepartmentId)
                    # Create a new LocationName instance
                    Department_instance.Status= not Department_instance.Status
                    Department_instance.save()
                else:
                    if Department_Detials.objects.filter(Department_Name=DepartmentName).exists():
                        return JsonResponse({'warn': f"The DepartmentName  are already present in the name of {DepartmentName} "})
                    else:
                        Department_instance = Department_Detials.objects.get(pk=DepartmentId)
                        # Create a new LocationName instance
                        Department_instance.Department_Name=DepartmentName
                        Department_instance.save()

                return JsonResponse({'success': 'DepartmentName Updated successfully'})
            else:
                if Department_Detials.objects.filter(Department_Name=DepartmentName).exists():
                    return JsonResponse({'warn': f"The DepartmentName  are already present in the name of {DepartmentName} "})
                else:
                    Department_instance = Department_Detials(
                        Department_Name=DepartmentName,
                        created_by=created_by
                    )
                Department_instance.save()
                return JsonResponse({'success': 'Department added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Department_Master = Department_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Department_Master_data = []
            for Department in Department_Master:
                Department_dict = {
                    'id': Department.Department_Id,
                    'DepartmentName': Department.Department_Name,
                    'Status': 'Active' if Department.Status else 'Inactive',
                    'created_by': Department.created_by,
                    
                }
                Department_Master_data.append(Department_dict)

            return JsonResponse(Department_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




#-------------------------------------------- Designation insert,get,update----------------------------------------



@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Designation_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            # Extract and validate data
            DesignationId = data.get('DesignationId','')
            # Department = data.get('Department','')
            Designation = data.get('Designation','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            # if Department:
            #     Department_instance = Department_Detials.objects.get(Department_Id=Department)
           
            if DesignationId:
                if Statusedit:
                    Designation_instance = Designation_Detials.objects.get(pk=DesignationId)
                    Designation_instance.Status= not Designation_instance.Status
                    Designation_instance.save()
                else:
                    if Designation_Detials.objects.filter(Designation_Name=Designation).exists():
                        return JsonResponse({'warn': f"The Designation {Designation} already exists."})
                    else:
                        Designation_instance = Designation_Detials.objects.get(pk=DesignationId)
                        # Create a new LocationName instance
                        
                        Designation_instance.Designation_Name=Designation
                        # Designation_instance.Department_Name=Department_instance
                        Designation_instance.save()

                return JsonResponse({'success': ' Updated successfully'})
            else:
                if Designation_Detials.objects.filter(Designation_Name=Designation).exists():
                    return JsonResponse({'warn': f"The  Designation {Designation} already exists."})
                else:
                    Designation_instance = Designation_Detials(
                        
                        Designation_Name=Designation,
                        # Department_Name=Department_instance,
                        created_by=created_by
                    )
                Designation_instance.save()
                return JsonResponse({'success': ' added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Designations = Designation_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Designation_Master_data = []
            for Designation in Designations:
                Designation_dict = {
                    'id': Designation.Designation_Id,
                    'Designation': Designation.Designation_Name,
                    # 'DepartmentId': Designation.Department_Name.Department_Id,
                    # 'Department': Designation.Department_Name.Department_Name,
                    'Status':'Active' if Designation.Status else 'Inactive' ,
                    'created_by': Designation.created_by,
                    
                }
                Designation_Master_data.append(Designation_dict)

            return JsonResponse(Designation_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


#--------------------------------------------Classification-----------------------------------------
@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Classification_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            # Extract and validate data
            ClassificationId = data.get('ClassificationId','')
            Classification = data.get('Classification','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            # if Department:
            #     Department_instance = Department_Detials.objects.get(Department_Id=Department)
           
            if ClassificationId:
                if Statusedit:
                    Classification_instance = Classification_Detials.objects.get(pk=ClassificationId)
                    Classification_instance.Status= not Classification_instance.Status
                    Classification_instance.save()
                else:
                    if Classification_Detials.objects.filter(Classification_Name=Classification).exists():
                        return JsonResponse({'warn': f"The Classification {Classification} already exists."})
                    else:
                        Classification_instance = Classification_Detials.objects.get(pk=ClassificationId)
                        # Create a new LocationName instance
                        
                        Classification_instance.Classification_Name=Classification
                        # Designation_instance.Department_Name=Department_instance
                        Classification_instance.save()

                return JsonResponse({'success': ' Updated successfully'})
            else:
                if Classification_Detials.objects.filter(Classification_Name=Classification).exists():
                    return JsonResponse({'warn': f"The  Classification {Classification} already exists."})
                else:
                    Classification_instance = Classification_Detials(
                        
                        Classification_Name=Classification,
                        created_by=created_by
                    )
                Classification_instance.save()
                return JsonResponse({'success': ' added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Classifications = Classification_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Classification_Master_data = []
            for Classification in Classifications:
                Classification_dict = {
                    'id': Classification.Classification_Id,
                    'Classification': Classification.Classification_Name,
                    'Status':'Active' if Classification.Status else 'Inactive' ,
                    'created_by': Classification.created_by,
                    
                }
                Classification_Master_data.append(Classification_dict)

            return JsonResponse(Classification_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

#-------------------------------------------- ConsentName insert,get,update----------------------------------------



@csrf_exempt   
@require_http_methods(["POST", "OPTIONS", "GET"])
def ConsentName_Detials_link(request):
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
            data = json.loads(request.body)
            # print("Consentdata",data)
            ConsentFormsID = data.get('ConsentFormsID','')
            ConsentFormFile= data.get('ConsentFile', None)
            Department = data.get('Department', '')
            ConsentFormsName = data.get('ConsentFormsName', '')
            Statusedit = data.get('Statusedit', False)
            print("-------Statusedit----------------",Statusedit)
            ConsentId = data.get('ConsentId', None) 
            print("ConsentId",ConsentId)
            created_by = data.get('created_by', '')
            ConsentFormFileDocument = validate_and_process_file(ConsentFormFile) if ConsentFormFile  else None

            if Department:
                Department_instance = Department_Detials.objects.get(Department_Id=Department)
            else:
                return JsonResponse({'error': 'Department is required'})

            if ConsentId:
                Consent_instance = ConsentName_Detials.objects.get(pk=ConsentId)
                
                if Statusedit:
                    # Toggle the status of the Consent
                    Consent_instance.Status = not Consent_instance.Status
                    Consent_instance.save()
                    return JsonResponse({'success': 'Status updated successfully'})
                else:
                    if ConsentName_Detials.objects.filter(
                            ConsentFormsID=ConsentFormsID,
                            ConsentName=ConsentFormsName, 
                            DepartmentName=Department_instance,
                            ConsentFormFile=ConsentFormFileDocument
                        ).exclude(pk=ConsentId).exists():
                        return JsonResponse({'warn': f"The ConsentFormsName '{ConsentFormsName}' already exists in this department."})
                    else:
                        # Update the existing consent details
                        Consent_instance.ConsentFormsID = ConsentFormsID
                        Consent_instance.DepartmentName = Department_instance
                        Consent_instance.ConsentFormFile = ConsentFormFileDocument
                        Consent_instance.ConsentName = ConsentFormsName
                        Consent_instance.save()
                        return JsonResponse({'success': 'Consent updated successfully'})
            else:
                if ConsentName_Detials.objects.filter(
                        ConsentFormsID=ConsentFormsID,
                        ConsentName=ConsentFormsName, 
                        DepartmentName=Department_instance,
                        ConsentFormFile=ConsentFormFileDocument
                    ).exists():
                    return JsonResponse({'warn': f"The ConsentFormsName '{ConsentFormsName}' already exists in this department."})
                else:
                    # Create a new Consent
                    Consent_instance = ConsentName_Detials(
                        ConsentFormsID=ConsentFormsID,
                        DepartmentName=Department_instance,
                        ConsentName=ConsentFormsName,
                        ConsentFormFile=ConsentFormFileDocument,
                        created_by=created_by
                    )
                    Consent_instance.save()
                    return JsonResponse({'success': 'Consent added successfully'})
        
        except Department_Detials.DoesNotExist:
            return JsonResponse({'error': 'Department not found'}, status=404)
        except ConsentName_Detials.DoesNotExist:
            return JsonResponse({'error': 'Consent not found'}, status=404)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            def get_file_image(filedata):
                # Detect the file type using file content
                kind = filetype.guess(filedata)
                
                # Default to PDF if the type is undetermined
                contenttype1 = 'application/pdf'
                if kind and kind.mime == 'image/jpeg':
                    contenttype1 = 'image/jpeg'
                elif kind and kind.mime == 'image/png':
                    contenttype1 = 'image/png'

                # Return base64 encoded data with MIME type
                return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            
            # Fetch all records from the ConsentName_Detials model
            ConsentNames = ConsentName_Detials.objects.all()
            
            # Construct a list of dictionaries containing consent data
            Consent_Master_data = []
            for Consent in ConsentNames:
                Consent_dict = {
                    'id': Consent.ConsentName_Id,
                    'DepartmentId': Consent.DepartmentName.Department_Id,
                    'Department': Consent.DepartmentName.Department_Name,
                    'ConsentFormsID':Consent.ConsentFormsID if Consent.ConsentFormsID else None,
                    'ConsentFormsName': Consent.ConsentName,
                    'ChooseFile':get_file_image(Consent.ConsentFormFile) if Consent.ConsentFormFile else None,
                    'Status': 'Active' if Consent.Status else 'Inactive',
                    'created_by': Consent.created_by,
                }
                Consent_Master_data.append(Consent_dict)

            return JsonResponse(Consent_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




#-------------------------------------------- Category insert,get,update----------------------------------------


@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Category_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            
            # Extract and validate data
            CategoryId = data.get('CategoryId','')
            CategoryName = data.get('Category','')
            
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            
            
           
            if CategoryId:
                if Statusedit:
                    Category_instance = Category_Detials.objects.get(pk=CategoryId)

                    Category_instance.Status=not Category_instance.Status
                    Category_instance.save()
                else:
                    if Category_Detials.objects.filter(Category_Name=CategoryName).exists():
                        return JsonResponse({'warn': f"The CategoryName {CategoryName} already exists."})
                    else:
                        Category_instance = Category_Detials.objects.get(pk=CategoryId)
                        # Create a new Category instance
                        
                        
                        Category_instance.Category_Name=CategoryName
                        Category_instance.save()

                return JsonResponse({'success': 'Category Updated successfully'})
            else:
                if Category_Detials.objects.filter(Category_Name=CategoryName).exists():
                    return JsonResponse({'warn': f"The CategoryName {CategoryName} already exists."})
                else:
                    Category_instance = Category_Detials(
                        
                        
                        Category_Name=CategoryName,
                        created_by=created_by
                    )
                Category_instance.save()
                return JsonResponse({'success': 'Category added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the Category model
            Categories = Category_Detials.objects.all()
            
            # Construct a list of dictionaries containing Category data
            Category_Master_data = []
            for Category in Categories:
                Category_dict = {
                    'id': Category.Category_Id,
                    'CategoryName': Category.Category_Name,
                    'Status':'Active' if Category.Status else 'Inactive',
                    'created_by': Category.created_by,
                    
                }
                Category_Master_data.append(Category_dict)

            return JsonResponse(Category_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)






# ---------------------------------Speciality---------------

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Speciality_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
           
            # Extract and validate data
            SpecialityId = data.get('SpecialityId','')
            SpecialityName = data.get('SpecialityName','')
            Category = data.get('Category','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
            if Category:
                Category_instance = Category_Detials.objects.get(pk = Category)
           
            if SpecialityId:
                if Statusedit:
                    Speciality_instance = Speciality_Detials.objects.get(pk=SpecialityId)
 
                    Speciality_instance.Status= not Speciality_instance.Status
                    Speciality_instance.save()
                else:
                    if Speciality_Detials.objects.filter(Speciality_Name=SpecialityName,Category_Name=Category_instance).exists():
                        return JsonResponse({'warn': f"The SpecialityName {SpecialityName} with Category {Category_instance.Category_Name} already exists."})
                    else:
                        Speciality_instance = Speciality_Detials.objects.get(pk=SpecialityId)
                        # Create a new Category instance
                       
                        Speciality_instance.Category_Name=Category_instance
                        Speciality_instance.Speciality_Name=SpecialityName
                        Speciality_instance.save()
 
                return JsonResponse({'success': 'Speciality Updated successfully'})
            else:
                if Speciality_Detials.objects.filter(Speciality_Name=SpecialityName,Category_Name=Category_instance).exists():
                    return JsonResponse({'warn': f"The SpecialityName {SpecialityName} with Category {Category_instance.Category_Name} already exists."})
                else:
                    Speciality_instance = Speciality_Detials(
                       
                        Category_Name=Category_instance,
                        Speciality_Name=SpecialityName,
                        created_by=created_by
                    )
                Speciality_instance.save()
                return JsonResponse({'success': 'Speciality Detials added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
    elif request.method == 'GET':
        try:
 
            id = request.GET.get('id')
           
 
 
            if id:
                Speciality_Master_data = []
               
                Speciality_ins = Speciality_Detials.objects.get(Speciality_Id=id)
               
                Speciality_dict = {
                        'id': Speciality_ins.Speciality_Id,
                        'Speciality_Id': Speciality_ins.Speciality_Id,
                        'CategoryId': Speciality_ins.Category_Name.Category_Id,
                        'CategoryName': Speciality_ins.Category_Name.Category_Name,
                        'SpecialityName': Speciality_ins.Speciality_Name,
                        'Status': 'Active' if Speciality_ins.Status else 'Inactive',
                        'created_by': Speciality_ins.created_by,
                       
                    }
                Speciality_Master_data.append(Speciality_dict)
 
                return JsonResponse(Speciality_Master_data, safe=False)
 
            # Fetch all records from the Category model
            Specialities = Speciality_Detials.objects.all()
           
 
           
            # Construct a list of dictionaries containing Category data
            Speciality_Master_data = []
            for Speciality in Specialities:
                Speciality_dict = {
                    'id': Speciality.Speciality_Id,
                    'Speciality_Id': Speciality.Speciality_Id,
                    'CategoryId': Speciality.Category_Name.Category_Id,
                    'CategoryName': Speciality.Category_Name.Category_Name,
                    'SpecialityName': Speciality.Speciality_Name,
                    'Status': 'Active' if Speciality.Status else 'Inactive',
                    'created_by': Speciality.created_by,
                   
                }
                Speciality_Master_data.append(Speciality_dict)
 
            return JsonResponse(Speciality_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 
 



@csrf_exempt  
@require_http_methods(["POST", "OPTIONS", "GET"])
def Doctors_Speciality_Detials_link(request):
    if request.method == 'GET':
        try:
            # Fetch the 'Doctor' designation
            Catg_instance = Category_Detials.objects.get(Category_Name='DOCTOR')
           
            # Fetch all specialties associated with the 'Doctor' designation
            Specialities = Speciality_Detials.objects.filter(Category_Name=Catg_instance)
   
            # Construct a list of dictionaries containing the data
            Speciality_Master_data = []
            for Speciality in Specialities:
                Speciality_dict = {
                    'id': Speciality.Speciality_Id,
                    'DesignationId': Speciality.Category_Name.Category_Id,
                    'DesignationName': Speciality.Category_Name.Category_Name,
                    'SpecialityName': Speciality.Speciality_Name,
                    'Status': 'Active' if Speciality.Status else 'Inactive',
                    'created_by': Speciality.created_by,
                }
                Speciality_Master_data.append(Speciality_dict)
 
            return JsonResponse(Speciality_Master_data, safe=False)
 
        except Designation_Detials.DoesNotExist:
            return JsonResponse({'error': 'Doctor designation not found'}, status=404)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)




@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def UserControl_Role_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            RoleId = data.get('RoleId','')
            Role = data.get('Role','')
            Statusedit = data.get('Statusedit',False)
            created_by = data.get('created_by','')
      
            
           
            if RoleId:
                if Statusedit:
                    Role_instance = Role_Master.objects.get(Role_Id=RoleId)

                    Role_instance.Status= not Role_instance.Status
                    Role_instance.save()
                else:
                    if Role_Master.objects.filter(Role_Name=Role).exists():
                        return JsonResponse({'warn': f"The Role Name  are already present in the name of {Role} "})
                    else:
                        Role_instance = Role_Master.objects.get(Role_Id=RoleId)
                        # Create a new LocationName instance
                        Role_instance.Role_Name=Role
                        Role_instance.save()

                return JsonResponse({'success': 'Role Updated successfully'})
            else:
                if Role_Master.objects.filter(Role_Name=Role).exists():
                     return JsonResponse({'warn': f"The Role Name  are already present in the name of {Role} "})
                else:
                    Role_instance = Role_Master(
                        Role_Name=Role,
                        created_by=created_by
                    )
                Role_instance.save()
                return JsonResponse({'success': 'Role added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Roles = Role_Master.objects.exclude(created_by='system')
            
            # Construct a list of dictionaries containing location data
            Role_Master_data = []
            for role in Roles:
                Role_dict = {
                    'id': role.Role_Id,
                    'Role': role.Role_Name,
                    'Status': 'Active' if role.Status else "Inactive",
                    'created_by': role.created_by,
                    
                }
                Role_Master_data.append(Role_dict)

            return JsonResponse(Role_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Relegion_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            RelegionId = data.get('religionId')
            Relegion = data.get('religion')
            Statusedit = data.get('statusEdit',False)
            created_by = data.get('created_by','')
      
            
           
            if RelegionId:
                if Statusedit:
                   Relegion_instance = Religion_Detials.objects.get(Religion_Id=RelegionId)
                   Relegion_instance.Status= not Relegion_instance.Status
                   Relegion_instance.save()
                else:   
                    if Religion_Detials.objects.filter(Religion_Name=Relegion).exists():
                       return JsonResponse({'warn': f"The Relegion already present in the name of {Relegion} "})
                    else:
                
                        Relegion_instance = Religion_Detials.objects.get(Religion_Id=RelegionId)
                        Relegion_instance.Religion_Name=Relegion
                        Relegion_instance.save()

                return JsonResponse({'success': 'Relegion Updated successfully'})
            else:
                if Religion_Detials.objects.filter(Religion_Name=Relegion).exists():
                    return JsonResponse({'warn': f"The Religion_Name  are already present in the name of {Relegion} "})
                else:
                    Religion_instance = Religion_Detials(
                        Religion_Name=Relegion,
                        created_by=created_by
                    )
                Religion_instance.save()
                return JsonResponse({'success': 'Religion added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Religions = Religion_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Religions_Master_data = []
            for Religion in Religions:
                Religion_dict = {
                    'id': Religion.Religion_Id,
                    'religion': Religion.Religion_Name,
                    'status': 'Active' if Religion.Status else 'Inactive',
                    'created_by': Religion.created_by,
                    
                }
                Religions_Master_data.append(Religion_dict)

            return JsonResponse(Religions_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def Cast_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            CastId = data.get('CastId')
            Cast = data.get('Cast')
            Statusedit = data.get('statusEdit',False)
            created_by = data.get('created_by','')
      
            
           
            if CastId:
                if Statusedit:
                   Cast_instance = Cast_Detials.objects.get(Cast_Id=CastId)
                   Cast_instance.Status= not Cast_instance.Status
                   Cast_instance.save()
                else:   
                    if Cast_Detials.objects.filter(Cast_Name=Cast).exists():
                       return JsonResponse({'warn': f"The Cast already present in the name of {Cast} "})
                    else:
                
                        Cast_instance = Cast_Detials.objects.get(Cast_Id=CastId)
                        Cast_instance.Cast_Name=Cast
                        Cast_instance.save()

                return JsonResponse({'success': 'Cast Updated successfully'})
            else:
                if Cast_Detials.objects.filter(Cast_Name=Cast).exists():
                    return JsonResponse({'warn': f"The Cast_Name  are already present in the name of {Cast} "})
                else:
                    Religion_instance = Cast_Detials(
                        Cast_Name=Cast,
                        created_by=created_by
                    )
                Religion_instance.save()
                return JsonResponse({'success': 'Religion added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Casts = Cast_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            Casts_Master_data = []
            for Cast in Casts:
                Cast_dict = {
                    'id': Cast.Cast_Id,
                    'Cast': Cast.Cast_Name,
                    'status': 'Active' if Cast.Status else 'Inactive',
                    'created_by': Cast.created_by,
                    
                }
                Casts_Master_data.append(Cast_dict)

            return JsonResponse(Casts_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})






@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def TriageCategory_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            Triage_Id = data.get('Triage_Id')
            Description = data.get('Description')
            Statusedit = data.get('statusEdit', False)
            
            if Triage_Id:
                Triage_instance = TriageCategory_Detials.objects.get(Triage_Id=Triage_Id)
                
                if Statusedit:
                    Triage_instance.Status = not Triage_instance.Status
                    Triage_instance.save()
                    return JsonResponse({'success': 'Status updated successfully'})
                
                # Update Description only if Description is provided
                if Description:
                    if TriageCategory_Detials.objects.filter(Description=Description).exclude(Triage_Id=Triage_Id).exists():
                        return JsonResponse({'warn': f"The Description '{Description}' already exists."})
                    Triage_instance.Description = Description
                    Triage_instance.save()
                    return JsonResponse({'success': 'Description updated successfully'})
                else:
                    return JsonResponse({'error': 'Description is required for updating'}, status=400)

            else:
                # Handle case where no Triage_Id is provided, assuming it's a new entry
                # Additional logic for new entry if needed here...
                return JsonResponse({'error': 'Triage_Id required'}, status=400)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            TriageCategory = TriageCategory_Detials.objects.all()
            Triage_Master_data = [
                {
                    'id': Triage.Triage_Id,
                    'Description': Triage.Description,
                    'Category': Triage.Category,
                    'Colour': Triage.Colour,
                    'status': 'Active' if Triage.Status else 'Inactive',
                    'created_by': Triage.created_by,
                }
                for Triage in TriageCategory
            ]
            return JsonResponse(Triage_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})



@csrf_exempt   
@require_http_methods(["POST","OPTIONS","GET"])
def BloodGroup_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract and validate data
            BloodGroupId = data.get('BloodGroupId')
            BloodGroup = data.get('BloodGroup')
            Statusedit = data.get('statusEdit',False)
            created_by = data.get('created_by','')
      
            
           
            if BloodGroupId:
                if Statusedit:
                   BloodGroup_instance = BloodGroup_Detials.objects.get(BloodGroup_Id=BloodGroupId)
                   BloodGroup_instance.Status= not BloodGroup_instance.Status
                   BloodGroup_instance.save()
                else:   
                    if BloodGroup_Detials.objects.filter(BloodGroup_Name=BloodGroup).exists():
                       return JsonResponse({'warn': f"The BloodGroup already present in the name of {BloodGroup} "})
                    else:
                
                        BloodGroup_instance = BloodGroup_Detials.objects.get(BloodGroup_Id=BloodGroupId)
                        BloodGroup_instance.BloodGroup_Name=BloodGroup
                        BloodGroup_instance.save()

                return JsonResponse({'success': 'BloodGroup Updated successfully'})
            else:
                if BloodGroup_Detials.objects.filter(BloodGroup_Name=BloodGroup).exists():
                    return JsonResponse({'warn': f"The BloodGroup_Name  are already present in the name of {BloodGroup} "})
                else:
                    Religion_instance = BloodGroup_Detials(
                        BloodGroup_Name=BloodGroup,
                        created_by=created_by
                    )
                Religion_instance.save()
                return JsonResponse({'success': 'Religion added successfully'})
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            BloodGroups = BloodGroup_Detials.objects.all()
            
            # Construct a list of dictionaries containing location data
            BloodGroups_Master_data = []
            for BloodGroup in BloodGroups:
                BloodGroup_dict = {
                    'id': BloodGroup.BloodGroup_Id,
                    'BloodGroup': BloodGroup.BloodGroup_Name,
                    'status': 'Active' if BloodGroup.Status else 'Inactive',
                    'created_by': BloodGroup.created_by,
                    
                }
                BloodGroups_Master_data.append(BloodGroup_dict)

            return JsonResponse(BloodGroups_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def ICDCode_Master_InsetLink(request):
    if request.method == "POST":
        try:
            Getfile = request.FILES.get('file')
            print('File:', Getfile)
            print('File name:', Getfile.name)
            print('File content type:', Getfile.content_type)
 
            if Getfile.name.lower().endswith('.csv'):
                try:
                    df = pd.read_csv(Getfile, encoding='utf-8', on_bad_lines='skip')
                    print("Parsed CSV:", df.head())
                except Exception as e:
                    print("CSV read error:", str(e))
                    return JsonResponse({'error': f'CSV Read Error: {str(e)}'}, status=500)
            else:
                return JsonResponse({
                    'error': 'Unsupported file format. Please upload a CSV file'
                })
 
            csv_data = df.to_dict(orient='records')
            ICDCode_Masterdata_FileUpload.objects.all().delete()
 
            for row in csv_data:
                # Replace NaN/empty with 'None'
                for key in row:
                    if pd.isna(row[key]):
                        row[key] = 'None'
 
                ICDCode_Masterdata_FileUpload.objects.create(
                    ICDCode=row.get('ICD 10 Code', 'None'),
                    ICDCode_Description=row.get('Code Discription', 'None'),
                    Diagnosis=row.get('Diagnosis', 'None'),
                )
 
            return JsonResponse({'success': 'File uploaded and data inserted successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse(
                {"error": "An internal server error occurred"}, status=500
            )
 
 
    elif request.method == "GET":
        try:
 
            Searchbyname = request.GET.get("Searchbyname")
            Searchbyvalue = request.GET.get("Searchbyvalue")
 
            query = Q()
 
            if Searchbyname == "SearchICDCode":
                query &= Q(ICDCode__icontains=Searchbyvalue)
            if Searchbyname == "SearchDescription":
                query &= Q(ICDCode_Description__icontains=Searchbyvalue)
            if Searchbyname == "SearchDiagnosis":
                query &= Q(Diagnosis__icontains=Searchbyvalue)
 
            ICDCode_Masterdata = ICDCode_Masterdata_FileUpload.objects.filter(query)
 
            data = [
                {
                    "id": index + 1,
                    "ICDCode": item.ICDCode,
                    "ICDCode_Description": item.ICDCode_Description,
                    "Diagnosis": item.Diagnosis,
                    "CreatedAt": item.CreatedAt.strftime("%d-%m-%Y"),
                }
                for index, item in enumerate(ICDCode_Masterdata)
            ]
            return JsonResponse(data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse(
                {"error": "An internal server error occurred"}, status=500
            )




@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def ICDCode_Master_DoctorGetLink(request):
    if request.method == "GET":
        try:

            SearchICDCode=request.GET.get('SearchICDCode')
            SearchDescription=request.GET.get('SearchDescription')
            SearchDiagnosis=request.GET.get('SearchDiagnosis')


            query = Q()

            if SearchICDCode :
                query &= Q(ICDCode__icontains=SearchICDCode)
            if SearchDescription:
                query &= Q(ICDCode_Description__icontains=SearchDescription)
            if SearchDiagnosis:
                query &= Q(Diagnosis__icontains=SearchDiagnosis)
            
            ICDCode_Masterdata = ICDCode_Masterdata_FileUpload.objects.filter(query)
           

            data = [
                {
                    'id': index + 1, 
                    'ICDCode': item.ICDCode,
                    'ICDCode_Description': item.ICDCode_Description,
                    'Diagnosis': item.Diagnosis,
                    'CreatedAt': item.CreatedAt.strftime('%d-%m-%Y'),
                }
                for index, item in enumerate(ICDCode_Masterdata)
            ]
            return JsonResponse(data, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def GradeName_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("datagradename", data)

            # Extract and validate data
            GradeNameId = data.get('GradeNameId')
            GradeName = data.get('GradeName')
            Roomid = data.get('Roomid', None)
            Statusedit = data.get('statusEdit', False)
            created_by = data.get('created_by', '')

            # If GradeNameId is provided
            if GradeNameId:
                if Statusedit:
                    print("Statusedit", Statusedit)
                    GradeName_instance = GradeName_Detials.objects.get(GradeName_Id=GradeNameId)
                    GradeName_instance.Status = not GradeName_instance.Status
                    GradeName_instance.save()
                    return JsonResponse({'success': 'GradeName status updated successfully'})

                else:
                    if GradeName_Detials.objects.filter(GradeName_Name=GradeName, RoomName=Roomid).exists():
                        return JsonResponse({'warn': f"The GradeName is already present in the room {Roomid} with the name {GradeName}"})
                    else:
                        if Roomid:
                            try:
                                Room_Instance = RoomType_Master_Detials.objects.get(pk=Roomid)
                                print('Room_Instance:', Room_Instance)
                            except RoomType_Master_Detials.DoesNotExist:
                                return JsonResponse({'warn': "Room not found."})

                        GradeName_instance = GradeName_Detials.objects.get(GradeName_Id=GradeNameId)
                        GradeName_instance.GradeName_Name = GradeName
                        GradeName_instance.RoomName = Room_Instance if Room_Instance else None
                        GradeName_instance.save()

                        return JsonResponse({'success': 'GradeName Updated successfully'})

            else:
                # If no GradeNameId is provided, create a new GradeName
                if GradeName_Detials.objects.filter(GradeName_Name=GradeName, RoomName=Roomid).exists():
                    return JsonResponse({'warn': f"The GradeName is already present in the room {Roomid} with the name {GradeName}"})
                else:
                    if Roomid:
                        try:
                            Room_Instance = RoomType_Master_Detials.objects.get(pk=Roomid)
                            print('Room_Instance:', Room_Instance)
                        except RoomType_Master_Detials.DoesNotExist:
                            return JsonResponse({'warn': "Room not found."})

                    GradeName_instance = GradeName_Detials(
                        GradeName_Name=GradeName,
                        RoomName=Room_Instance if Room_Instance else None,
                        created_by=created_by
                    )
                    GradeName_instance.save()
                    return JsonResponse({'success': 'GradeName added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    elif request.method == 'GET':
        try:
            # Fetch all records from the GradeName_Detials model
            GradeNames = GradeName_Detials.objects.all()

            # Construct a list of dictionaries containing GradeName data
            GradeNames_Master_data = []
            for GradeName in GradeNames:
                GradeName_dict = {
                    'id': GradeName.GradeName_Id,
                    'GradeName': GradeName.GradeName_Name,
                    'Roomid': GradeName.RoomName.pk if GradeName.RoomName else None,
                    'Roomtype': GradeName.RoomName.Room_Name if GradeName.RoomName else None,
                    'status': 'Active' if GradeName.Status else 'Inactive',
                    'created_by': GradeName.created_by,
                }
                GradeNames_Master_data.append(GradeName_dict)

            return JsonResponse(GradeNames_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})




@csrf_exempt   
@require_http_methods(["OPTIONS","GET"])
def Active_GradeNames_link(request):
    if request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            GradeNames = GradeName_Detials.objects.filter(Status=1)
            if not GradeNames.exists():
                return JsonResponse([], safe=False)
            
            # Construct a list of dictionaries containing location data
            GradeNames_Master_data = []
            for GradeName in GradeNames:
                GradeName_dict = {
                    'id': GradeName.GradeName_Id,
                    'GradeName': GradeName.GradeName_Name,
                    
                }
                GradeNames_Master_data.append(GradeName_dict)

            return JsonResponse(GradeNames_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})






@csrf_exempt   
@require_http_methods(["OPTIONS","GET"])
def Active_Rooms_link(request):
    if request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            RoomNames = RoomType_Master_Detials.objects.filter(Status=1)
            if not RoomNames.exists():
                return JsonResponse([], safe=False)
            
            # Construct a list of dictionaries containing location data
            RoomNames_Master_data = []
            for RoomName in RoomNames:
                RoomName_dict = {
                    'id': RoomName.Room_Id,
                    'RoomName': RoomName.Room_Name,
                    'Amount': RoomName.Current_Charge
                    
                }
                RoomNames_Master_data.append(RoomName_dict)

            return JsonResponse(RoomNames_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})



@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def therapy_type_master_view(request):
    try:
        if request.method == "GET":
            therapy_id = request.GET.get('id', None)
            if therapy_id:
                obj = TherapyType_Master.objects.get(TherapyType_Id=therapy_id)
                data = {
                    "TherapyType_Id": obj.TherapyType_Id,
                    "TherapyType_Name": obj.TherapyType_Name
                }
            else:
                data = list(TherapyType_Master.objects.values("TherapyType_Id", "TherapyType_Name"))
            return JsonResponse({"status": "success", "data": data}, status=200)
 
        elif request.method == "POST":
            body = json.loads(request.body)
            name = body.get("TherapyType_Name")
            if TherapyType_Master.objects.filter(TherapyType_Name=name).exists():
                return JsonResponse({"status": "error", "message": "Therapy Type already exists."}, status=400)
            obj = TherapyType_Master.objects.create(TherapyType_Name=name)
            return JsonResponse({"status": "success", "message": "Created", "TherapyType_Id": obj.TherapyType_Id}, status=201)
 
        # elif request.method == "PUT":
           
 
        elif request.method == "DELETE":
            body = json.loads(request.body)
            therapy_id = body.get("TherapyType_Id")
            obj = TherapyType_Master.objects.get(TherapyType_Id=therapy_id)
            obj.delete()
            return JsonResponse({"status": "success", "message": "Deleted"}, status=200)
 
    except TherapyType_Master.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Therapy Type not found"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
   
@csrf_exempt
def therapy_type_master_edit(request, id):
    try:
        if request.method == "PUT":
            body = json.loads(request.body)
            name = body.get("TherapyType_Name")
 
            obj = TherapyType_Master.objects.get(TherapyType_Id=id)
            obj.TherapyType_Name = name
            obj.save()
 
            return JsonResponse({"status": "success", "message": "Updated"}, status=200)
 
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)
 
 
@csrf_exempt  
@require_http_methods(["OPTIONS","GET"])
def TherapyTypes_Active_link(request):
    if request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            TherapyTypes = TherapyType_Detials.objects.all()
            if not TherapyTypes.exists():
                return JsonResponse([], safe=False)
           
            # Construct a list of dictionaries containing location data
            TherapyTypes_Master_data = []
            for therapy in TherapyTypes:
                speciality = therapy.TherapyType_Name
                Therapy_dict = {
                    'id':therapy.TherapyType_Id,
                    'TherapyName':therapy.Therapy_Name,
                    'SubTherapyName':therapy.Sub_Therapy_Name,
                    'Speciality_Id' :speciality.Speciality_Id,
                    'Speciality_Name': speciality.Speciality_Name
                }
                TherapyTypes_Master_data.append(Therapy_dict)
 
            return JsonResponse(TherapyTypes_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

 
@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Ward_Detials_link(request):
   if request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            Ward_Master = WardType_Master_Detials.objects.all()
           
            # Construct a list of dictionaries containing location data
            Ward_Master_data = []
            for Ward in Ward_Master:
                Ward_dict = {
                    'id': Ward.Ward_Id,
                    'WardName': Ward.Ward_Name,
                    'Status': 'Active' if Ward.Status else 'Inactive',
                    'created_by': Ward.created_by,
                   
                }
                Ward_Master_data.append(Ward_dict)
 
            return JsonResponse(Ward_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def OtTheaterMaster_Detials_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
 
            print(f"Received data: {data}")
           
            # Extract and validate data
            OtId = data.get('OtId')
            Location = data.get('Location')
            TheatreName = data.get('TheatreName')
            ShortName = data.get('ShortName')
            FloorName = data.get('FloorName')
            Building = data.get('Building')
            Block = data.get('Block')
           
            speciality = data.get('Speciality')
            SpecialityName = data.get('SpecialityName')
            TheatreType = data.get('TheatreType')
            Rent = data.get('Rent')
            Emergency = data.get('Emergency',False)
            Details = data.get('Details')
            Remarks = data.get('Remarks')
            Statusedit = data.get('StatusEdit',False)
            created_by = data.get('created_by','')
     
            try:
                location_instance = Location_Detials.objects.get(pk=Location)
                floor_instance = Floor_Master_Detials.objects.get(pk=FloorName)
                Buiding_ins = Building_Master_Detials.objects.get(pk=Building)
                Block_ins = Block_Master_Detials.objects.get(pk=Block)
               
               
            except (Location_Detials.DoesNotExist, Floor_Master_Detials.DoesNotExist,Building_Master_Detials.DoesNotExist,Block_Master_Detials.DoesNotExist,WardType_Master_Detials.DoesNotExist):
                return JsonResponse({'error': 'Invalid Location or FloorName'})
 
           
           
           
            if OtId:
                if Statusedit:
                   
                    OtTheater_instance = OtTheaterMaster_Detials.objects.get(Ot_Id=OtId)
                    OtTheater_instance.Status = not OtTheater_instance.Status
                    OtTheater_instance.save()
                     
                   
                else:  
                   
                        OtTheater_instance = OtTheaterMaster_Detials.objects.get(Ot_Id=OtId)
                        print(OtTheater_instance)
                        OtTheater_instance.Location=location_instance
                        OtTheater_instance.TheatreName=TheatreName
                        OtTheater_instance.ShortName=ShortName
                        OtTheater_instance.FloorName=floor_instance
                        OtTheater_instance.Building = Buiding_ins
                        OtTheater_instance.Block = Block_ins
                   
                        OtTheater_instance.Speciality=speciality
                        OtTheater_instance.TheatreType = TheatreType
                        OtTheater_instance.Rent = Rent
                        OtTheater_instance.Emergency=Emergency
                        OtTheater_instance.Details=Details
                        OtTheater_instance.Remarks=Remarks
                        OtTheater_instance.save()
                        print('Premkumar')
 
                return JsonResponse({'success': 'OtTheater Updated successfully'})
            else:
               
                if OtTheaterMaster_Detials.objects.filter(TheatreName=TheatreName).exists():
                    return JsonResponse({'warn': f"The TheatreName  are already present in the name of {TheatreName} "})
                else:
                   
                    OtTheater_instance = OtTheaterMaster_Detials(
                        Location=location_instance,
                        TheatreName=TheatreName,
                        ShortName=ShortName,
                        FloorName=floor_instance,
                        Building = Buiding_ins,
                        Block = Block_ins,
                         
                        Speciality = speciality,
                        TheatreType = TheatreType,
                        Rent = Rent,
                        Emergency=Emergency,
                        Details=Details,
                        Remarks=Remarks,
                        created_by=created_by
                    )
                OtTheater_instance.save()
               
            return JsonResponse({'success': 'OtTheater added successfully'})
       
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
       
    elif request.method == 'GET':
        try:
            # Fetch all records from the LocationName model
            OtTheaters = OtTheaterMaster_Detials.objects.all()
           
            # Construct a list of dictionaries containing location data
            OtTheaters_Master_data = []
            for OtTheater in OtTheaters:
                OtTheater_dict = {
                    'id': OtTheater.pk,
                    'LocationId': OtTheater.Location.Location_Id,
                    'Location': OtTheater.Location.Location_Name,
                    'TheatreName': OtTheater.TheatreName,
                    'ShortName': OtTheater.ShortName,
                    'FloorId': OtTheater.FloorName.Floor_Id,
                    'FloorName': OtTheater.FloorName.Floor_Name,
                    'BuidingId':OtTheater.Building.Building_Id,
                    'BuildingName':OtTheater.Building.Building_Name,
                    'BlockId':OtTheater.Block.Block_Id,
                    'BlockName':OtTheater.Block.Block_Name,
                   
                    'SpecialityName':OtTheater.Speciality,
                    'TheatreType':OtTheater.TheatreType,
                    'Rent':OtTheater.Rent,
                    'Emergency': OtTheater.Emergency,
                    'Details': OtTheater.Details,
                    'Remarks': OtTheater.Remarks,
                    'Status': 'Active' if OtTheater.Status else 'Inactive',
                    'created_by': OtTheater.created_by,
                   
                }
                OtTheaters_Master_data.append(OtTheater_dict)
 
                for idx, theatre in enumerate(OtTheaters_Master_data, start=1):
                        theatre["sno"] = idx
 
            return JsonResponse(OtTheaters_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})

@csrf_exempt
def Flagg_color_Detials_by_specialtype(request):
     try:
            # Fetch all records from the LocationName model
            Flagg_instance = Flaggcolor_Detials.objects.all()
            specialtypelist = ['GENERAL','VIP','GOVT','INSURANCE','MLC','CLIENT','CORPORATE','DONATION','EMPLOYEE','EMPLOYEERELATION','DOCTOR','DOCTORRELATION']
           
            # Construct a list of dictionaries containing location data
            Flagg_instance_data = []
            for flagg in Flagg_instance:
                flagg_dict = {
                    'id': flagg.Flagg_Id,
                    'FlaggName' : flagg.Flagg_Name ,
                    'FlaggColor': flagg.Flagg_Color,
                    'Status': 'Active' if flagg.Status else "Inactive",
                    'created_by': flagg.created_by,
                }
 
                if flagg.Flagg_Name not  in specialtypelist:
 
                 
                    Flagg_instance_data.append(flagg_dict)
                #print(Flagg_instance_data)
 
            return JsonResponse(Flagg_instance_data, safe=False)
 
     except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
 
# service masters
 
@csrf_exempt
@require_http_methods(['POST', 'GET', 'OPTIONS'])
def Insert_service_category_master(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data, 'data')
 
            Serviceid = data.get('Serviceid')
 
            if Serviceid:
                try:
                    instance = Service_Category_Masters.objects.get(Serviceid=Serviceid)
                    serializers = ServiceCategoryMasterSerializer(instance, data=data, partial=True)
                    if serializers.is_valid():
                        serializers.save()
                        return JsonResponse({'success': 'Updated Successfully'})
                    else:
                        return JsonResponse(serializers.errors)
                except Service_Category_Masters.DoesNotExist:
                    return JsonResponse({"error": "Service Not Found"})
 
            else:
                # Set default values to these fields before passing data to serializer
                upper_name = str(data.get('ServiceCategory', '')).upper()
                F_instance = Finance_GroupMaster_Detailes.objects.get(pk=12)
                print('instance......',F_instance)
                data['LedgerName'] = upper_name
                data['LedgerGroupName'] = F_instance.pk
                data['DebitOrCredit'] = 'Cr'
 
                serializers = ServiceCategoryMasterSerializer(data=data)
                if serializers.is_valid():
                    serializers.save()
                    return JsonResponse({"success": "Saved successfully."})
                else:
                    print('error :', serializers.errors)
                    return JsonResponse(serializers.errors)
 
        except Exception as e:
            print('error', e)
            return JsonResponse({"Error": str(e)})
    elif request.method == 'GET':
        try:
            # Get all records from Service_Category_Masters
            subdepartments = Service_Category_Masters.objects.all()
            # Serialize the data
            serializers = ServiceCategoryMasterSerializer(subdepartments, many=True)
            # Add custom 'id' field
            for index, i in enumerate(serializers.data, start=1):
                i["id"] = index
            # Return serialized data as JSON
            return JsonResponse(serializers.data, safe=False)
        except Exception as e:
            # Catch any exceptions, convert to string, and return as a JSON response
            return JsonResponse({'error': str(e)})
 
 
    
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def PaymentMode_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("datagradename", data)

            # Extract and validate data
            PaymentId = data.get('PaymentModeId', '')
            if isinstance(PaymentId, str) and PaymentId.isdigit():
                PaymentId = int(PaymentId)
            elif not isinstance(PaymentId, int):  # If it's neither int nor a valid numeric string, set to None
                PaymentId = None
            PaymentMode = data.get('PaymentMode')
            Statusedit = data.get('statusEdit', False)
            created_by = data.get('created_by', '')

            # If PaymentId is provided
            if PaymentId is not None:
                if Statusedit:
                    print("Statusedit", Statusedit)
                    GradeName_instance = PaymentModeMaster.objects.get(PaymentModeId=PaymentId)
                    GradeName_instance.Status = not GradeName_instance.Status
                    GradeName_instance.save()
                    return JsonResponse({'success': 'PaymentMode status updated successfully'})

                else:
                    GradeName_instance = PaymentModeMaster.objects.get(PaymentModeId=PaymentId)
                    GradeName_instance.PaymentMode = PaymentMode
                    GradeName_instance.save()
                    return JsonResponse({'success': 'GradeName Updated successfully'})

            else:
                # If no PaymentId is provided, create a new entry
                if PaymentModeMaster.objects.filter(PaymentMode=PaymentMode).exists():
                    return JsonResponse({'warn': f"The Payment Mode {PaymentMode} already exists."})

                GradeName_instance = PaymentModeMaster(
                    PaymentMode=PaymentMode,
                    created_by=created_by
                )
                GradeName_instance.save()
                return JsonResponse({'success': 'Payment Mode added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    elif request.method == 'GET':
        try:
            # Fetch all records from the GradeName_Detials model
            GradeNames = PaymentModeMaster.objects.all()

            # Construct a list of dictionaries containing GradeName data
            GradeNames_Master_data = []
            for GradeName in GradeNames:
                GradeName_dict = {
                    'id': GradeName.PaymentModeId,
                    'GradeName': GradeName.PaymentMode,
                    'status': 'Active' if GradeName.Status else 'Inactive',
                    'created_by': GradeName.created_by,
                }
                GradeNames_Master_data.append(GradeName_dict)

            return JsonResponse(GradeNames_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
 
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Expenses_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("datagradename", data)
 
            ExpensesId = data.get('ExpensesId', '')
           
 
            ExpensesName = data.get('ExpensesName')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
 
            print('Statusedit---------111',Statusedit,type(Statusedit))
 
            if ExpensesId :
                if Statusedit:
                    print("Statusedit---kkkkkk", Statusedit,ExpensesId)
                    ExpensesMaster_instance = ExpensesMasterDetailes.objects.get(pk=ExpensesId)
                    ExpensesMaster_instance.Status = not ExpensesMaster_instance.Status
                    ExpensesMaster_instance.save()
                    return JsonResponse({'success': 'ExpensesName status updated successfully'})
 
                else:
                    ExpensesMaster_instance = ExpensesMasterDetailes.objects.get(pk=ExpensesId)
                    ExpensesMaster_instance.ExpensesName = ExpensesName
                    ExpensesMaster_instance.save()
                    return JsonResponse({'success': 'ExpensesName Updated successfully'})
 
            else:
                if ExpensesMasterDetailes.objects.filter(ExpensesName=ExpensesName).exists():
                    return JsonResponse({'warn': f"The {ExpensesName} already exists."})
 
                ExpensesMaster_instance = ExpensesMasterDetailes(
                    ExpensesName=ExpensesName,
                    created_by=created_by
                )
                ExpensesMaster_instance.save()
                return JsonResponse({'success': 'Expenses Name added successfully'})
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    elif request.method == 'GET':
        try:
           
            ExpensesNames = ExpensesMasterDetailes.objects.all()
 
           
            ExpensesNames_Master_data = []
            for ExpensesName in ExpensesNames:
                ExpensesName_dict = {
                    'id': ExpensesName.pk,
                    'ExpensesName': ExpensesName.ExpensesName,
                    'Status': 'Active' if ExpensesName.Status else 'Inactive',
                    'created_by': ExpensesName.created_by,
                }
                ExpensesNames_Master_data.append(ExpensesName_dict)
 
            return JsonResponse(ExpensesNames_Master_data, safe=False)
 
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
 
 
 
 
# ------------------------IntakeType---------------------

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IntakeType_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            IntakeTypeId = data.get('IntakeTypeId', '')
            IntakeTypeName = data.get('IntakeTypeName')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            if IntakeTypeId:
                if Statusedit:
                    IntakeType_instance = IntakeTypeMasterDetails.objects.get(pk=IntakeTypeId)
                    IntakeType_instance.Status = not IntakeType_instance.Status
                    IntakeType_instance.save()
                    return JsonResponse({'success': 'IntakeType status updated successfully'})
                else:
                    IntakeType_instance = IntakeTypeMasterDetails.objects.get(pk=IntakeTypeId)
                    IntakeType_instance.IntakeTypeName = IntakeTypeName
                    IntakeType_instance.save()
                    return JsonResponse({'success': 'IntakeType updated successfully'})
            else:
                if IntakeTypeMasterDetails.objects.filter(IntakeTypeName=IntakeTypeName).exists():
                    return JsonResponse({'warn': f"The {IntakeTypeName} already exists."})
                
                IntakeType_instance = IntakeTypeMasterDetails(
                    IntakeTypeName=IntakeTypeName,
                    created_by=created_by
                )
                IntakeType_instance.save()
                print("IntakeType_instance post:",IntakeType_instance)
                return JsonResponse({'success': 'IntakeType added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            IntakeTypes = IntakeTypeMasterDetails.objects.all()
            IntakeType_data = []
            
            for intake in IntakeTypes:
                intake_dict = {
                    'id': intake.pk,
                    'IntakeTypeName': intake.IntakeTypeName,
                    'Status': 'Active' if intake.Status else 'Inactive',
                    'created_by': intake.created_by,
                }
                IntakeType_data.append(intake_dict)
                print("IntakeType_data get:",IntakeType_data)
            
            return JsonResponse(IntakeType_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})


# ------------------------IntakeMode_Master_link---------------------
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def IntakeMode_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            IntakeModeId = data.get('IntakeModeId', '')
            IntakeModeName = data.get('IntakeModeName')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            if IntakeModeId:
                if Statusedit:
                    IntakeMode_instance = IntakeModeMasterDetails.objects.get(pk=IntakeModeId)
                    IntakeMode_instance.Status = not IntakeMode_instance.Status
                    IntakeMode_instance.save()
                    return JsonResponse({'success': 'IntakeMode status updated successfully'})
                else:
                    IntakeMode_instance = IntakeModeMasterDetails.objects.get(pk=IntakeModeId)
                    IntakeMode_instance.IntakeModeName = IntakeModeName
                    IntakeMode_instance.save()
                    return JsonResponse({'success': 'IntakeMode updated successfully'})
            else:
                if IntakeModeMasterDetails.objects.filter(IntakeModeName=IntakeModeName).exists():
                    return JsonResponse({'warn': f"The {IntakeModeName} already exists."})
                
                IntakeMode_instance = IntakeModeMasterDetails(
                    IntakeModeName=IntakeModeName,
                    created_by=created_by
                )
                IntakeMode_instance.save()
                return JsonResponse({'success': 'IntakeMode added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            IntakeModes = IntakeModeMasterDetails.objects.all()
            IntakeMode_data = []
            
            for mode in IntakeModes:
                mode_dict = {
                    'id': mode.pk,
                    'IntakeModeName': mode.IntakeModeName,
                    'Status': 'Active' if mode.Status else 'Inactive',
                    'created_by': mode.created_by,
                }
                IntakeMode_data.append(mode_dict)
            
            return JsonResponse(IntakeMode_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
        
        
  
  
# ------------------------Measurement_Master_link---------------------
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Measurement_Master_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            MeasurementId = data.get('MeasurementId', '')
            MeasurementName = data.get('MeasurementName')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')

            if MeasurementId:
                if Statusedit:
                    Measurement_instance = MeasurementMasterDetails.objects.get(pk=MeasurementId)
                    Measurement_instance.Status = not Measurement_instance.Status
                    Measurement_instance.save()
                    return JsonResponse({'success': 'Measurement status updated successfully'})
                else:
                    Measurement_instance = MeasurementMasterDetails.objects.get(pk=MeasurementId)
                    Measurement_instance.MeasurementName = MeasurementName
                    Measurement_instance.save()
                    return JsonResponse({'success': 'Measurement updated successfully'})
            else:
                if MeasurementMasterDetails.objects.filter(MeasurementName=MeasurementName).exists():
                    return JsonResponse({'warn': f"The {MeasurementName} already exists."})
                
                Measurement_instance = MeasurementMasterDetails(
                    MeasurementName=MeasurementName,
                    created_by=created_by
                )
                Measurement_instance.save()
                return JsonResponse({'success': 'Measurement added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    
    elif request.method == 'GET':
        try:
            Measurements = MeasurementMasterDetails.objects.all()
            Measurement_data = []
            
            for measurement in Measurements:
                measurement_dict = {
                    'id': measurement.pk,
                    'MeasurementName': measurement.MeasurementName,
                    'Status': 'Active' if measurement.Status else 'Inactive',
                    'created_by': measurement.created_by,
                }
                Measurement_data.append(measurement_dict)
            
            return JsonResponse(Measurement_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'})
        

@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Ward_Detials_link_by_NS(request):
   if request.method == 'GET':
        try:
            NurseStationid = request.GET.get('NurseStationid')
 
            NurseStationidins = NurseStationMaster.objects.filter(NurseStationid=NurseStationid).first()
 
            WardforNs = NurseStationMasterDetails.objects.filter(NurseStationid=NurseStationidins)
            Ward_Master_data = []
           
            for wdata in WardforNs:
 
                Ward_Master = WardType_Master_Detials.objects.filter(Ward_Id=wdata.Wardid.Ward_Id).first()
           
 
                # for Ward in Ward_Master:
                Ward_dict = {
                    'id': Ward_Master.Ward_Id,
                    'WardName': Ward_Master.Ward_Name,
                    'WardType' : Ward_Master.Type,
                    'Status': 'Active' if Ward_Master.Status else 'Inactive',
                    'created_by': Ward_Master.created_by,              
                }
                Ward_Master_data.append(Ward_dict)
 
 
   
            return JsonResponse(Ward_Master_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
@csrf_exempt  
@require_http_methods(["POST","OPTIONS","GET"])
def Room_Detials_link_by_NSWard(request):
   if request.method == 'GET':
        try:
            Wardid = request.GET.get('Wardid')
 
 
            Room_Master_data = []
            Roomins = RoomType_Master_Detials.objects.filter(Ward_Name_id = Wardid)
           
            for wdata in Roomins:
 
                Ward_dict = {
                    'id': wdata.Room_Id,
                    'RoomNo': wdata.RoomNo,
             
                }
                Room_Master_data.append(Ward_dict)
 
 
   
            return JsonResponse(Room_Master_data, safe=False)
 

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
   
 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import ICDCode_Masterdata_FileUpload  # Adjust import as per your project structure
 
@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def ICDCode_Master_MRDGetLink(request):
    if request.method == "GET":
        try:
            SearchICDCode = request.GET.get('SearchICDCode')
            SearchDescription = request.GET.get('SearchDescription')
            SearchDiagnosis = request.GET.get('SearchDiagnosis')
 
            # Start with an empty Q object
            query = Q()
 
            # Build query conditionally
            if SearchICDCode:
                query &= Q(ICDCode__icontains=SearchICDCode)
            if SearchDescription:
                query &= Q(ICDCode_Description__istartswith=SearchDescription)
            if SearchDiagnosis:
                query &= Q(Diagnosis__icontains=SearchDiagnosis)
 
            # If no search parameters are provided, limit results to 100
            if not SearchICDCode and not SearchDescription and not SearchDiagnosis:
                ICDCode_Masterdata = ICDCode_Masterdata_FileUpload.objects.all()[:100]
            else:
                ICDCode_Masterdata = ICDCode_Masterdata_FileUpload.objects.filter(query)
 
            # Serialize data
            data = [
                {
                    'id': index + 1,
                    'ICDCode': item.ICDCode,
                    'ICDCode_Description': item.ICDCode_Description,
                    'Diagnosis': item.Diagnosis,
                    'CreatedAt': item.CreatedAt.strftime('%d-%m-%Y') if item.CreatedAt else '',
                }
                for index, item in enumerate(ICDCode_Masterdata)
            ]
 
            return JsonResponse(data, safe=False)
 
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
 


 

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def createVaccinationMaster(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            vaccinName = data.get('vaccinName')
            VaccineCategory = data.get('VaccineCategory')
            Age = data.get('Age')
            AgeType = data.get('AgeType')
            DoseNo = data.get('DoseNo')
            Route = data.get('Route')
            Remark = data.get('Remark')
            created_by = data.get('created_by', '')
            action = data.get('action', '')
            
            print("data", vaccinName, VaccineCategory, Age, AgeType, DoseNo, Route, Remark, created_by,action)
            if action == 'delete':
                vaccin_id = data.get('id')
                vaccin = Vaccine_Master_Details.objects.get(pk=vaccin_id)
                vaccin.delete()
                return JsonResponse({'success': 'Data Deleted Successfully...'})
            else:
                vaccin = Vaccine_Master_Details.objects.create(
                    Vaccine_Name = vaccinName,
                    VaccineCategory= VaccineCategory,
                    Age = Age,
                    AgeType = AgeType,
                    DoseCount = DoseNo,
                    Route = Route,
                    Remarks = Remark,
                    created_by = created_by
                )
                vaccin.save()
                return JsonResponse({'success': 'Data Saved Successfully...'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': str(e)})
        
    elif request.method == "GET":
        try:
            vaccinMaster = Vaccine_Master_Details.objects.all()
            vaccin_data = []
            for vaccin in vaccinMaster:
                vaccin_dict = {
                    'id': vaccin.pk,
                    'Vaccine_Name': vaccin.Vaccine_Name,
                    'VaccineCategory': vaccin.VaccineCategory,
                    'Age': vaccin.Age,
                    'AgeType': vaccin.AgeType,
                    'DoseCount': vaccin.DoseCount,
                    'Route': vaccin.Route,
                    'Remarks': vaccin.Remarks,
                    'created_by': vaccin.created_by,
                }
                vaccin_data.append(vaccin_dict)
            return JsonResponse(vaccin_data, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': str(e)})
        
        
@csrf_exempt
def get_Employee_by_PatientCategory(request):
    if request.method == 'GET':
        try:
           
            # Retrieve all employees, you might want to filter this based on specific criteria
            employee_query_set = Employee_Personal_Form_Detials.objects.filter(Category__Category_Name = 'NURSE')
           
            # Check if any employee records exist
            if not employee_query_set.exists():
                return JsonResponse({'error': 'No employees found'})
           
            emp_datas = []
            for emp in employee_query_set:
                emp_dict = {
                    'id': emp.Employee_ID,
                    'Name': f"""{'NR'}.{emp.First_Name if emp.First_Name else ''} {emp.Middle_Name if emp.Middle_Name else ''} {emp.Last_Name if emp.Last_Name else ''}""",
                    # 'ShortName': f'{emp.Tittle}.{emp.First_Name} {emp.Last_Name}',
                }
                emp_datas.append(emp_dict)
           
            # Return JSON response
            return JsonResponse(emp_datas, safe=False)
       
        except Exception as e:
            # Handle exceptions and return error response
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
 
 
         
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def ICDCode_Master_Reports_Get_Link(request):
    try:
        # Get list of selected letters (can be multiple)
        selected_letters = request.GET.getlist('selectedLetters[]')
 
        print(selected_letters,'selected_letterssssss')
 
        # Build query
        query = Q()
        if selected_letters:
            letter_query = Q()
            for letter in selected_letters:
                # Use upper-case to make it case-insensitive properly
                letter_query |= Q(ICDCode__istartswith=letter.upper())
            query &= letter_query
 
        # Fetch data
        if not selected_letters:
            # No filter → return first 100 (or all, up to you)
            queryset = ICDCode_Masterdata_FileUpload.objects.all()[:100]
        else:
            # Apply filter
            queryset = ICDCode_Masterdata_FileUpload.objects.filter(query)
 
        # Serialize
        data = [
            {
                'id': index + 1,
                'ICDCode': item.ICDCode,
                'ICDCode_Description': item.ICDCode_Description,
                'Diagnosis': item.Diagnosis,
                'CreatedAt': item.CreatedAt.strftime('%d-%m-%Y') if item.CreatedAt else '',
            }
            for index, item in enumerate(queryset)
        ]
 
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print('Error:', str(e))
        return JsonResponse({'error': str(e)}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def ICDDiagnosis_Master_Reports_Get_Link(request):
    try:
        # Get list of selected letters (can be multiple)
        selectedDiagnosisLetters = request.GET.getlist('selectedDiagnosisLetters[]')
 
        print(selectedDiagnosisLetters,'selected_letterssssss')
 
        # Build query
        query = Q()
        if selectedDiagnosisLetters:
            letter_query = Q()
            for letter in selectedDiagnosisLetters:
                # Use upper-case to make it case-insensitive properly
                letter_query |= Q(ICDCode_Description__istartswith=letter.upper())
            query &= letter_query
 
        # Fetch data
        if not selectedDiagnosisLetters:
            # No filter → return first 100 (or all, up to you)
            queryset = ICDCode_Masterdata_FileUpload.objects.all()[:100]
        else:
            # Apply filter
            queryset = ICDCode_Masterdata_FileUpload.objects.filter(query)
 
        # Serialize
        data = [
            {
                'id': index + 1,
                'ICDCode': item.ICDCode,
                'ICDCode_Description': item.ICDCode_Description,
                'Diagnosis': item.Diagnosis,
                'CreatedAt': item.CreatedAt.strftime('%d-%m-%Y') if item.CreatedAt else '',
            }
            for index, item in enumerate(queryset)
        ]
 
        return JsonResponse(data, safe=False)
 
    except Exception as e:
        print('Error:', str(e))
        return JsonResponse({'error': str(e)}, status=500)
 
 
         
     