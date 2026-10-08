from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, JsonResponse

from django.views.decorators.csrf import csrf_exempt
from .models import *
import json
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
from django.db import transaction
import filetype
import base64
import traceback
from django.db.models import Q


from django.core.files.uploadedfile import InMemoryUploadedFile


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
@require_http_methods(['POST'])
def assetdocumentsuploadpost(request):
    try:
        data = json.loads(request.body)

        asset_id = data.get('asset')
        document_type_name = data.get('document_type')
        description = data.get('description', '')
        category = data.get('category')
        subcategory = data.get('subcategory')
        file_data = data.get('file_data')  
        file_name = data.get('file_name')
        
        file_dataDocument = validate_and_process_file(file_data) if file_data  else None


        print("Received data:", {
            'asset_id': asset_id,
            'category': category,
            'subcategory': subcategory,
            'document_type': document_type_name
        })

        if not file_data:
            return JsonResponse({'error': 'No file data provided'})

        try:
            file_content = file_dataDocument  
            print("file_content:",file_content)
            if not file_content:
                return JsonResponse({'error': 'Invalid or unsupported file format'})

            document_type_instance, created = DocumentType_set.objects.get_or_create(
                name=document_type_name
            )

            asset = AssetReg_Data.objects.filter(
                Q(id=asset_id) | Q(asset_code=asset_id)
            ).first()

            if not asset:
                return JsonResponse({'error': f'Asset not found with ID/code: {asset_id}'})

            category_instance = AssetCategory.objects.get(id=category)
            subcategory_instance = AssetSubCategory.objects.get(id=subcategory)

            document = AssetDocuments_uplode(
                asset=asset,
                document_type=document_type_instance,
                file=file_content, 
                description=description,
                category=category_instance,
                asset_subcategory=subcategory_instance
            )
            document.save()

            return JsonResponse({
                'message': 'Document uploaded successfully',
                'document_id': document.id
            })

        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'error': 'Failed to upload document'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': f'Unexpected error: {str(e)}'})


@csrf_exempt
@require_http_methods(['GET'])
def assetdocumentsuploadget(request):
    try:
        def get_file_image(filedata):
            kind = filetype.guess(filedata)
            
            contenttype1 = 'application/pdf'
            if kind and kind.mime == 'image/jpeg':
                contenttype1 = 'image/jpeg'
            elif kind and kind.mime == 'image/png':
                contenttype1 = 'image/png'

            return f'data:{contenttype1};base64,{base64.b64encode(filedata).decode("utf-8")}'
            
          
        print("GET params:", request.GET)
        
        filters = Q()
        
        if asset_id := request.GET.get('asset'):
            filters &= Q(asset_id=asset_id) 
        
        if category_id := request.GET.get('category'):
            filters &= Q(category_id=category_id)
            
        if subcategory_id := request.GET.get('subcategory'):
            filters &= Q(asset_subcategory_id=subcategory_id)
            
        if doc_type := request.GET.get('document_type'):
            filters &= Q(document_type__name=doc_type)

        if filters == Q():
            print("No filters applied!")
            
        documents = AssetDocuments_uplode.objects.filter(filters).select_related(
            'asset', 
            'document_type', 
            'category', 
            'asset_subcategory'
        ).order_by('-uploaded_at')
        
        print(f"Found {documents.count()} documents")

        doc_list = [{
        'id': doc.id,
        'asset_name': doc.asset.name,
        'asset_code': doc.asset.asset_code,
        'document_type': doc.document_type.name,
        'description': doc.description,
        'file': get_file_image(doc.file if isinstance(doc.file, bytes) else doc.file.read() if doc.file else None),
        'uploaded_at': doc.uploaded_at.strftime('%Y-%m-%d %H:%M:%S'),
        'category_name': doc.category.name,
        'subcategory_name': doc.asset_subcategory.name
    } for doc in documents]

        return JsonResponse(doc_list, safe=False)

    except Exception as e:
        error_message = f"Error: {str(e)}\nTraceback: {traceback.format_exc()}"
        print(error_message)
        return JsonResponse({'error': str(e)})
import mimetypes
from pathlib import Path

@csrf_exempt
@require_http_methods(['GET'])
def get_file_data(request):
    
    document_id=request.GET.get("document_id")
    
    try:
        print(f"Attempting to retrieve document with ID: {document_id}")
        
        document = AssetDocuments_uplode.objects.get(id=document_id)
        
        if not document:
            return JsonResponse({'error': 'Document not found'})
        try:
            file_data = document.file.read()
        except FileNotFoundError:
            return JsonResponse({'error': 'File exists in database but not found on disk'})
        
        file_ext = Path(document.file.name).suffix.lower()
        mime_type = mimetypes.guess_type(document.file.name)[0] or 'application/octet-stream'
        
        if not mime_type:
            mime_type = 'application/octet-stream'
        
        base64_data = base64.b64encode(file_data).decode('utf-8')
        data_url = f"data:{mime_type};base64,{base64_data}"
        
        print(f"Successfully retrieved document. MIME type: {mime_type}")
        
        return JsonResponse({
            'file_data': data_url,
            'file_type': mime_type
        })
        
    except AssetDocuments_uplode.DoesNotExist:
        print(f"Document with ID {document_id} not found")
        return JsonResponse({'error': 'Document not found'})
    except Exception as e:
        print(f"Error retrieving document: {str(e)}")
        return JsonResponse({'error': str(e)})