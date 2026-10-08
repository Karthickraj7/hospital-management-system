import json
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .models import *
from .serializers import RadiologyDocumentSerializer
from django.core.exceptions import ObjectDoesNotExist
import base64
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
import base64
import os
from django.http import JsonResponse
from html2docx import HTML2Docx
from django.shortcuts import get_object_or_404
from .models import RadiologyDocument, RadiologyNames_Details
from OutPatient.models import *
from docx import Document
import mammoth
from django.core.files.base import ContentFile
from bs4 import BeautifulSoup
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
import tempfile
from django.conf import settings

import tempfile
import base64
import io
import requests
from io import BytesIO
from PIL import Image
from bs4 import BeautifulSoup
import mammoth
import pdfplumber
from docx import Document
from docx.shared import Inches, RGBColor, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.conf import settings
from .models import *
from django.core.files.storage import FileSystemStorage
from django.db.models import Q


def word_html_export_patch(raw_html):
    soup = BeautifulSoup(raw_html, "lxml")

    # Fix bullet points and lists
    for ul in soup.find_all("ul"):
        if not ul.find("li"):
            ul.decompose()
        else:
            # Ensure proper bullet style
            for li in ul.find_all("li"):
                existing = li.get("style", "")
                # Preserve existing styles (e.g., line-height) and append list-style
                if "list-style-type" in existing:
                    # Replace existing list-style-type value only
                    parts = [p for p in existing.split(";") if p.strip()]
                    for i, part in enumerate(parts):
                        if part.strip().lower().startswith("list-style-type"):
                            parts[i] = "list-style-type: disc"
                    li["style"] = "; ".join(parts) + ";"
                else:
                    li["style"] = (existing + "; list-style-type: disc;").strip("; ") + ";"

    for ol in soup.find_all("ol"):
        if not ol.find("li"):
            ol.decompose()
        else:
            # Ensure proper numbering
            for li in ol.find_all("li"):
                existing = li.get("style", "")
                if "list-style-type" in existing:
                    parts = [p for p in existing.split(";") if p.strip()]
                    for i, part in enumerate(parts):
                        if part.strip().lower().startswith("list-style-type"):
                            parts[i] = "list-style-type: decimal"
                    li["style"] = "; ".join(parts) + ";"
                else:
                    li["style"] = (existing + "; list-style-type: decimal;").strip("; ") + ";"

    # Fix table formatting
    for table in soup.find_all("table"):
        table["style"] = "border-collapse: collapse; width: 100%;"
        for td in table.find_all(["td", "th"]):
            td["style"] = "border: 1px solid black; padding: 5pt;"

    # Fix paragraph spacing
    for p in soup.find_all("p"):
        if p.contents and getattr(p.contents[0], "name", None) == "br":
            p.contents[0].extract()
        # Add proper spacing
        existing_style = p.get("style", "")
        p["style"] = (
            f"{existing_style}; margin-bottom: 10pt; font-family: Tahoma; font-size: 11pt;"
        )

    # Fix headings
    for tag in ["h1", "h2", "h3"]:
        for heading in soup.find_all(tag):
            heading["style"] = (
                f"font-family: Tahoma; font-weight: bold; margin-top: 15pt; margin-bottom: 10pt;"
            )

    return str(soup)


# Updated Mammoth style map for better Word formatting preservation
MAMMOTH_STYLE_MAP = """
p[style-name='Normal'] => p:fresh { font-family: Tahoma; font-size: 11pt; margin-bottom: 10pt; }
p[style-name='List Paragraph'] => p:fresh { font-family: Tahoma; font-size: 11pt; margin-left: 24pt; }
r[style-name='Heading 1'] => h1:fresh { font-family: Tahoma; font-size: 16pt; font-weight: bold; }
r[style-name='Heading 2'] => h2:fresh { font-family: Tahoma; font-size: 14pt; font-weight: bold; }
r[style-name='Heading 3'] => h3:fresh { font-family: Tahoma; font-size: 12pt; font-weight: bold; }
table => table { border: 1px solid black; border-collapse: collapse; width: 100%; }
tr => tr
td => td { border: 1px solid black; padding: 5pt; }
th => th { border: 1px solid black; padding: 5pt; font-weight: bold; }
comment-reference => sup
u => u
i => i
b => strong
br => br
"""


def html_to_base64(html_content: str) -> str:
    """Always use this to encode html as utf-8 before storing as base64."""
    return base64.b64encode(html_content.encode("utf-8")).decode("utf-8")


def convert_docx_file_to_html_base64(file_path) -> str:
    """Convert docx to HTML (preserving formatting) and encode as utf-8 base64."""
    with open(file_path, "rb") as f:
        result = mammoth.convert_to_html(f, style_map=MAMMOTH_STYLE_MAP)
        html_content = result.value or "<p>No valid content.</p>"
    return html_to_base64(html_content)


class RadiologyDocumentListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            documents = RadiologyDocument.objects.select_related(
                "department", "doctorName"
            ).all()
            serializer = RadiologyDocumentSerializer(documents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RadiologyDocumentUploadView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            edit_id = request.POST.get("edit_id")
            file = request.FILES.get("file")
            doctor_name = request.POST.get("doctorName")
            doctorId = request.POST.get("doctorId")
            department_id = request.POST.get("department")
            created_by = request.POST.get("created_by")

            docins = (
                Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=doctorId).first()
                if doctorId
                else None
            )
            print(edit_id, type(edit_id), "edit_id")

            # ---- Edit (update) document ----
            if edit_id != "null":
                document = RadiologyDocument.objects.filter(id=edit_id).first()
                if not document:
                    return JsonResponse(
                        {"error": "Document not found for update"}, status=404
                    )
                if file:
                    fs = FileSystemStorage(location="media/radiology_docs/")
                    file_name = fs.save(file.name, file)
                    file_path = os.path.join("media/radiology_docs/", file_name)
                    file_extension = os.path.splitext(file_name)[1].lower()
                    if file_extension in [".docx", ".doc"]:
                        try:
                            encoded_html = convert_docx_file_to_html_base64(file_path)
                        except Exception as e:
                            html_content = f"<p>Error reading DOCX file: {str(e)}</p>"
                            encoded_html = html_to_base64(html_content)
                    else:
                        html_content = "<p>Document updated, no HTML extracted.</p>"
                        encoded_html = html_to_base64(html_content)
                    document.file = file_path
                    document.fileName = file_name
                    document.html_content = encoded_html

                document.doctorName = docins
                document.department_id = department_id
                document.created_by = created_by
                document.save()
                return JsonResponse({"success": "Document updated successfully"})

            # ---- New document upload ----
            else:
                if not file:
                    return JsonResponse({"error": "No file provided"}, status=400)
                fs = FileSystemStorage(location="media/radiology_docs/")
                file_name = fs.save(file.name, file)
                file_path = os.path.join("media/radiology_docs/", file_name)
                file_extension = os.path.splitext(file_name)[1].lower()
                if file_extension in [".docx", ".doc"]:
                    try:
                        encoded_html = convert_docx_file_to_html_base64(file_path)
                    except Exception as e:
                        html_content = f"<p>Error reading DOCX file: {str(e)}</p>"
                        encoded_html = html_to_base64(html_content)
                else:
                    html_content = (
                        "<p>Document uploaded, no HTML content extracted.</p>"
                    )
                    encoded_html = html_to_base64(html_content)
                document = RadiologyDocument(
                    file=file_path,
                    fileName=file_name,
                    doctorName=docins,
                    department_id=department_id,
                    created_by=created_by,
                    html_content=encoded_html,
                )
                document.save()

                return JsonResponse(
                    {
                        "success": "Document uploaded successfully",
                        "id": document.id,
                        "fileUrl": getattr(document.file, "url", None),
                    }
                )
        except Exception as e:
            print(f"Upload Error: {str(e)}")
            return JsonResponse(
                {"error": f"Error uploading document: {str(e)}"}, status=400
            )


class RadiologyDocumentDetailView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            document = RadiologyDocument.objects.get(pk=pk)
            serializer = RadiologyDocumentSerializer(document)
            file_content = (
                base64.b64encode(document.content).decode("utf-8")
                if document.content
                else None
            )
            response_data = {**serializer.data, "fileContent": file_content}
            return Response(response_data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def process_inline_formatting(elem, paragraph):
    """Process inline HTML tags (e.g., strong, em) and add to paragraph run."""
    for child in elem.children:
        if isinstance(child, str):
            paragraph.add_run(child)
        elif child.name == "strong":
            run = paragraph.add_run(child.get_text())
            run.bold = True
        elif child.name == "em":
            run = paragraph.add_run(child.get_text())
            run.italic = True
        elif child.name:
            paragraph.add_run(child.get_text())  # Fallback for other tags


def process_cell_content(cell, docx_cell):
    """Process content of a table cell."""
    p = docx_cell.paragraphs[0]
    process_inline_formatting(cell, p)


def process_list(elem, doc):
    """Process ul/ol lists (simplified)."""
    for li in elem.find_all("li"):
        p = doc.add_paragraph()
        p.add_run(li.get_text())


def convert_html_to_docx(html_content):
    """Enhanced conversion from HTML to DOCX with better formatting preservation"""
    try:
        html_content = f"<html><body>{html_content}</body></html>"
        soup = BeautifulSoup(html_content, "html.parser")
        doc = Document()

        # Set default document style
        doc.styles["Normal"].font.name = "Tahoma"
        doc.styles["Normal"].font.size = Pt(11)

        def apply_paragraph_block_styles(paragraph, elem):
            # Alignment
            if elem and hasattr(elem, "attrs") and "style" in elem.attrs:
                style = elem.get("style", "")
                if "text-align:center" in style.replace(" ", "").lower():
                    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
                elif "text-align:right" in style.replace(" ", "").lower():
                    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT

                # Line-height -> python-docx line spacing (in lines)
                # Supports numeric (e.g., 1.5), percent (e.g., 150%), px (e.g., 18px)
                import re
                m = re.search(r"line-height\s*:\s*([^;]+)", style, re.I)
                if m:
                    raw = m.group(1).strip()
                    try:
                        if raw.endswith("%"):
                            lines = float(raw.rstrip("%")) / 100.0
                        elif raw.endswith("px"):
                            px = float(raw.rstrip("px"))
                            # Convert px to pt (96dpi) then to lines using 11pt default
                            pt = px * 72.0 / 96.0
                            lines = pt / 11.0 if pt > 0 else None
                        elif raw.lower() == "normal":
                            lines = None
                        else:
                            lines = float(raw)
                        if lines and lines > 0:
                            paragraph.paragraph_format.line_spacing = lines
                    except Exception:
                        pass

        for elem in soup.body.contents:
            if not hasattr(elem, "name"):
                if isinstance(elem, str) and elem.strip():
                    p = doc.add_paragraph()
                    p.add_run(elem.strip())
                continue

            if elem.name == "p":
                p = doc.add_paragraph()
                apply_paragraph_block_styles(p, elem)
                process_inline_formatting(elem, p)

            elif elem.name.startswith("h"):
                try:
                    level = int(elem.name[1]) if elem.name[1].isdigit() else 1
                    level = max(1, min(level, 9))  # Ensure level is between 1 and 9
                    heading = doc.add_heading(level=level)
                    heading.style.font.name = "Tahoma"
                    process_inline_formatting(elem, heading)
                except (IndexError, ValueError):
                    # Fallback to normal paragraph if heading level is invalid
                    p = doc.add_paragraph()
                    apply_paragraph_block_styles(p, elem)
                    process_inline_formatting(elem, p)

            elif elem.name == "ul":
                for li in elem.find_all("li"):
                    p = doc.add_paragraph(style="List Bullet")
                    apply_paragraph_block_styles(p, li)
                    process_inline_formatting(li, p)

            elif elem.name == "ol":
                for li in elem.find_all("li"):
                    p = doc.add_paragraph(style="List Number")
                    apply_paragraph_block_styles(p, li)
                    process_inline_formatting(li, p)

            elif elem.name == "table":
                rows = elem.find_all("tr")
                if rows:
                    # Calculate max columns accounting for colspan
                    max_cols = max(
                        sum(
                            int(cell.get("colspan", 1))
                            for cell in row.find_all(["td", "th"])
                        )
                        for row in rows
                    )

                    table = doc.add_table(rows=0, cols=max_cols)
                    table.style = "Table Grid"

                    for row in rows:
                        cells = row.find_all(["td", "th"])
                        row_cells = table.add_row().cells
                        cell_idx = 0

                        for cell in cells:
                            if cell_idx >= max_cols:
                                break

                            colspan = int(cell.get("colspan", 1))
                            cell_text = cell.get_text().strip()
                            row_cells[cell_idx].text = cell_text

                            # Apply cell formatting
                            if cell.name == "th":
                                row_cells[cell_idx].paragraphs[0].runs[0].bold = True

                            # Handle colspan
                            if colspan > 1 and (cell_idx + colspan) <= max_cols:
                                for i in range(1, colspan):
                                    row_cells[cell_idx].merge(row_cells[cell_idx + 1])

                            cell_idx += colspan

        return doc

    except Exception as e:
        print(f"HTML to DOCX conversion error: {str(e)}")
        raise ValueError(f"Failed to convert HTML to DOCX: {str(e)}")





def process_inline_formatting(elem, paragraph):
    """Process inline HTML formatting (bold, italic, etc.) and add to paragraph"""
    if isinstance(elem, str):
        paragraph.add_run(elem.strip())
        return

    # Handle direct text content
    if not elem.contents:
        text = elem.get_text().strip()
        if text:
            paragraph.add_run(text)
        return

    for child in elem.children:
        if isinstance(child, str):
            text = child.strip()
            if text:
                paragraph.add_run(text)
        elif child.name in ["strong", "b"]:
            run = paragraph.add_run(child.get_text().strip())
            run.bold = True
        elif child.name in ["em", "i"]:
            run = paragraph.add_run(child.get_text().strip())
            run.italic = True
        elif child.name == "u":
            run = paragraph.add_run(child.get_text().strip())
            run.underline = True
        elif child.name == "sup":
            run = paragraph.add_run(child.get_text().strip())
            run.font.superscript = True
        elif child.name == "sub":
            run = paragraph.add_run(child.get_text().strip())
            run.font.subscript = True
        else:
            # For any other tags, just add the text
            text = child.get_text().strip()
            if text:
                paragraph.add_run(text)


def resize_image(img_bytes, max_width=800):
    """Resize image to max_width (default: 800px)"""
    image = Image.open(io.BytesIO(img_bytes))
    if image.width > max_width:
        ratio = max_width / float(image.width)
        height = int(float(image.height) * ratio)
        image = image.resize((max_width, height), Image.LANCZOS)
    output = io.BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


def convert_docx_to_html(file):
    """Convert DOCX file to styled HTML"""
    result = mammoth.convert_to_html(file)
    html = result.value
    soup = BeautifulSoup(html, "html.parser")

    for table in soup.find_all("table"):
        table["class"] = "doc-table"
        for cell in table.find_all(["td", "th"]):
            if "contenteditable" in cell.attrs:
                del cell["contenteditable"]
            cell["class"] = "editable-cell"

    # Add basic CSS styling
    style = soup.new_tag("style")
    style.string = """
    .doc-table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
        table-layout: fixed;
    }
    .doc-table td, .doc-table th {
        border: 1px solid #ddd;
        padding: 8px;
        word-wrap: break-word;
        white-space: pre-wrap;
        min-height: 20px;
    }
    .editable-cell:focus {
        outline: 2px solid #0078d4;
        background-color: #f8f8f8;
    }
    """
    if soup.head:
        soup.head.append(style)
    else:
        head = soup.new_tag("head")
        head.append(style)
        soup.insert(0, head)

    return str(soup)


def convert_file_to_html(file, file_type):
    """Convert various file types to base64-encoded HTML"""
    html_content = ""

    if file_type == "docx":
        html_content = convert_docx_to_html(file)

    elif file_type == "pdf":
        try:
            html_parts = [
                "<div class='pdf-document'><style>body{font-family:Arial,sans-serif;line-height:1.6}</style>"
            ]
            with pdfplumber.open(file) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        for para in text.split("\n"):
                            html_parts.append(f"<p>{para.strip()}</p>")
            html_parts.append("</div>")
            html_content = "".join(html_parts)
        except Exception as e:
            html_content = f"<p>Error processing PDF: {str(e)}</p>"

    elif file_type == "txt":
        try:
            text = file.read().decode("utf-8")
            html_content = f"<div style='white-space: pre-wrap; font-family: monospace;'>{text}</div>"
        except Exception as e:
            html_content = f"<p>Error reading TXT: {str(e)}</p>"

    elif file_type in ["jpg", "jpeg", "png"]:
        try:
            img_data = file.read()
            img_data = resize_image(img_data)  # Resize image if needed
            encoded_img = base64.b64encode(img_data).decode("utf-8")
            html_content = f"<div><img src='data:image/png;base64,{encoded_img}' style='max-width:100%;'/></div>"
        except Exception as e:
            html_content = f"<p>Error processing Image: {str(e)}</p>"

    elif file_type in ["mp4", "webm"]:
        try:
            video_data = file.read()
            encoded_video = base64.b64encode(video_data).decode("utf-8")
            html_content = f"<div><video controls><source src='data:video/{file_type};base64,{encoded_video}' type='video/{file_type}'></video></div>"
        except Exception as e:
            html_content = f"<p>Error processing Video: {str(e)}</p>"

    else:
        html_content = "<p>Unsupported file type</p>"

    return base64.b64encode(html_content.encode("utf-8")).decode("utf-8")


@csrf_exempt
def Documents_Edit_link(request):
    if request.method == "GET":
        requestid = request.GET.get("request", None)
        test = request.GET.get("test", None)
        document_id = request.GET.get("document_id", None)
        fromm = request.GET.get("from", None)
            
        try:
            if fromm == "doctor":
                document = get_object_or_404(Radiology_Complete_Details, Radiology_RequestId=requestid, TestCode=test)
               
                print("fromm doctor")
                if document.html_content.startswith("("):
                    html_content = document.html_content[1:-1]
                else: 
                    html_content = document.html_content
                
                try:
                    if html_content:
                        base64.b64decode(html_content)
                    else:
                        html_content = None
                    if document.content:
                        file_base64 = base64.b64encode(document.content).decode('utf-8')
                        file_base64 = f"data:application/pdf;base64,{file_base64}"
                    else:
                        file_base64 = None
                except Exception:
                    print(
                        f"Invalid base64 in document ID : {html_content[:50]}..."
                    )
                    html_content = html_to_base64("<p>Invalid document content</p>")
                    document.html_content = html_content
                    document.save()

                response_data = {
                    "completeId": document.Radiology_CompleteId,
                    "fileid": document.Document_Id,
                    "fileName": document.fileName,
                    "html": html_content,  
                    "doctor": document.RadiologistName,
                    "file": file_base64,
                }
                return JsonResponse(response_data)
            

            else:
                document = get_object_or_404(RadiologyDocument, id=document_id)
                print("fromm else")
                html_content = document.html_content  # Already base64
                file_url = document.file.url if document.file else None
                file_extension = (
                    os.path.splitext(document.file.name)[1].lower()
                    if document.file
                    else ""
                )
                if not html_content:
                    if (
                        file_extension in [".docx", ".doc"]
                        and document.file
                        and os.path.exists(document.file.path)
                    ):
                        try:
                            encoded_html = convert_docx_file_to_html_base64(
                                document.file.path
                            )
                            document.html_content = encoded_html
                            document.save()
                            html_content = encoded_html
                        except Exception as e:
                            html_content = html_to_base64(
                                f"<p>Error reading DOCX file: {str(e)}</p>"
                            )
                            document.html_content = html_content
                            document.save()
                    else:
                        html_content = html_to_base64(
                            f"<p>No content available for {file_extension or 'unknown'} file. <a href='{file_url}' target='_blank'>Download file</a> if available.</p>"
                        )
                        document.html_content = html_content
                        document.save()
                try:
                    base64.b64decode(html_content)
                except Exception:
                    print(
                        f"Invalid base64 in document ID {document.id}: {html_content[:50]}..."
                    )
                    html_content = html_to_base64("<p>Invalid document content</p>")
                    document.html_content = html_content
                    document.save()


                response_data = {
                    "id": document.id,
                    "doctorName": (
                        str(document.doctorName.Tittle.Title_Name)
                        if document.doctorName and document.doctorName.Tittle
                        else ""
                    ),
                    "fileName": document.fileName,
                    "department": getattr(document.department, "Radiology_Name", None),
                    "html": html_content,  # base64-encoded
                    "fileUrl": file_url,
                    "fileType": file_extension,
                }
                # print(
                #     f"GET document ID {document.id}, HTML length: {len(html_content)}, Base64 sample: {html_content[:50]}..."
                # )
                return JsonResponse(response_data)
        except Exception as e:
            print(f"GET Error: {str(e)}")
            error_html = f"<p>Error retrieving document: {str(e)}</p>"
            return JsonResponse({"error": f"{str(e)}"}, status=500)
    elif request.method == "POST":
        try:
            document_id = request.GET.get("document_id", None) or request.POST.get(
                "document_id"
            )
            document = get_object_or_404(RadiologyDocument, id=document_id)
            data = json.loads(request.body)
            html_content = data.get("html")
            department_id = data.get("department")
            doctor_id = data.get("doctorId")
            created_by = data.get("created_by")
            print(data, "doctor_id")
            if department_id:
                department = get_object_or_404(
                    RadiologyNames_Details, Radiology_Id=department_id
                )
                document.department = department
            if doctor_id:
                doctor = get_object_or_404(
                    Doctor_Personal_Form_Detials, Doctor_Id=doctor_id
                )
                document.doctorName = doctor
            if created_by:
                document.created_by = created_by
            file_extension = (
                os.path.splitext(document.file.name)[1].lower() if document.file else ""
            )
            if html_content:
                encoded_html = html_to_base64(html_content)
                print(encoded_html, "encoded_htmlll")
                document.html_content = encoded_html
                document.size = len(encoded_html)
            document.save()
            return JsonResponse({"success": "Document updated successfully"})
        except Exception as e:
            return JsonResponse(
                {"error": f"Error updating document: {str(e)}"}, status=400
            )
    return JsonResponse({"error": "Invalid request method"}, status=400)





@csrf_exempt
def Update_Document_link(request, document_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            document = get_object_or_404(RadiologyDocument, id=document_id)

            html_content = data.get("html")
            department_id = data.get("department")
            doctor_id = data.get("doctorId")
            doctor_name = data.get("doctorName")
            created_by = data.get("created_by")

            # Update document fields
            if department_id:
                department = get_object_or_404(
                    RadiologyNames_Details, Radiology_Id=department_id
                )
                document.department = department
            if doctor_id:
                document.doctorName.Doctor_ID = doctor_id
            if doctor_name:
                document.doctorName = doctor_name
            if created_by:
                document.created_by = created_by

            file_extension = (
                os.path.splitext(document.file.name)[1].lower() if document.file else ""
            )
            if html_content:
                encoded_html = base64.b64encode(html_content.encode("utf-8")).decode(
                    "utf-8"
                )
                document.html_content = encoded_html
                document.size = len(encoded_html)

                if file_extension in [".docx", ".doc"]:
                    try:
                        # docx = convert_html_to_docx(html_content)
                        safe_html = word_html_export_patch(html_content)
                        docx = convert_html_to_docx(safe_html)

                        file_name = f"updated_{document.fileName}"
                        with tempfile.NamedTemporaryFile(
                            delete=False, suffix=".docx"
                        ) as temp_file:
                            temp_file_path = temp_file.name
                            docx.save(temp_file_path)

                        with open(temp_file_path, "rb") as f:
                            document.file.save(file_name, ContentFile(f.read()))

                        os.remove(temp_file_path)
                    except Exception as e:
                        return JsonResponse(
                            {"error": f"Error converting HTML to DOCX: {str(e)}"},
                            status=400,
                        )

            document.save()
            return JsonResponse({"success": "Document updated successfully"})

        except Exception as e:
            return JsonResponse(
                {"error": f"Error updating document: {str(e)}"}, status=400
            )

    return JsonResponse({"error": "Invalid request method"}, status=400)


def Get_Report_From_Doctor(request):
    if request.method == "GET":
        try:
            radiologist = request.GET.get("Radiologist")
            department = request.GET.get("Department")

            print(radiologist, "radiologisttttttttttt")

            report = RadiologyDocument.objects.filter(doctorName__Doctor_ID=radiologist,department__Radiology_Name=department)            
            report_list = []

            print(report, "reporttttttt")
            for doc in report:
                document = get_object_or_404(RadiologyDocument, id=doc.id)

                print(document, "documenttttt")

                try:
                    html_content = document.html_content  # Stored as base64
                    file_url = document.file.url if document.file else None
                    file_extension = (
                        os.path.splitext(document.file.name)[1].lower()
                        if document.file
                        else ""
                    )

                    # If no HTML content, convert DOCX or set default message
                    if not html_content:
                        if (
                            file_extension in [".docx", ".doc"]
                            and document.file
                            and os.path.exists(document.file.path)
                        ):
                            try:
                                with open(document.file.path, "rb") as f:
                                    result = mammoth.convert_to_html(f)
                                    html_content = result.value
                                    encoded_html = base64.b64encode(
                                        html_content.encode("utf-8")
                                    ).decode("utf-8")
                                    document.html_content = encoded_html
                                    document.save()
                                    print(
                                        f"Converted DOCX to HTML for document ID {document.id}"
                                    )
                            except Exception as e:
                                html_content = (
                                    f"<p>Error reading DOCX file: {str(e)}</p>"
                                )
                                encoded_html = base64.b64encode(
                                    html_content.encode("utf-8")
                                ).decode("utf-8")
                                document.html_content = encoded_html
                                document.save()
                                html_content = encoded_html
                        else:
                            html_content = f"<p>No content available for {file_extension or 'unknown'} file. <a href='{file_url}' target='_blank'>Download file</a> if available.</p>"
                            encoded_html = base64.b64encode(
                                html_content.encode("utf-8")
                            ).decode("utf-8")
                            document.html_content = encoded_html
                            document.save()
                            html_content = encoded_html
                    print("htmlll", html_content)
                    # Validate base64
                    try:
                        base64.b64decode(html_content)
                    except Exception:
                        print(
                            f"Invalid base64 in document ID {document.id}: {html_content[:50]}..."
                        )
                        html_content = base64.b64encode(
                            "<p>Invalid document content</p>".encode("utf-8")
                        ).decode("utf-8")
                        document.html_content = html_content
                        document.save()

                    response_data = {
                        "id": document.id,
                        "doctorName": document.doctorName.First_Name,
                        "fileName": document.fileName,
                        "department": document.department.Radiology_Name,
                        "html": html_content,  # Always base64-encoded
                        "fileUrl": file_url,
                        "fileType": file_extension,
                        "doctorid": document.doctorName.Doctor_ID,
                    }

                    report_list.append(response_data)

                    print(
                        f"GET document ID {document.id}, HTML length: {len(html_content)}, Base64 sample: {html_content[:50]}..."
                    )

                except Exception as e:
                    print(f"GET Error: {str(e)}")
                    error_html = f"<p>Error retrieving document: {str(e)}</p>"

            return JsonResponse(report_list, safe=False)

        except Exception as e:
            return JsonResponse(
                {"error": f"Error updating document: {str(e)}"}, status=400
            )


@csrf_exempt
@require_http_methods(["GET"])
def get_radiology_reports_queue(request):
    try:

        Radiology_RequestId = request.GET.get("Radiology_RequestId", "")
        testCode = request.GET.get("TestCode", "")
        SubTestCode = request.GET.get("SubTestCode", "")

        # Fetch the report based on filters
        report = Radiology_Complete_Details.objects.filter(
            department_id=testCode,
            TestCode=SubTestCode,
            Radiology_RequestId=Radiology_RequestId,
        ).first()

        if not report:
            return JsonResponse({"message": "No matching report found"}, status=404)

        # Prepare response
        response_data = {
            "html": report.html_content,
            "fileName": report.fileName,
            "department": report.department.Radiology_Name if report.department else "",
            "DoctorId": report.doctorId if report.doctorId else "",
            "DoctorName": report.doctorName if report.doctorName else "",
        }

        return JsonResponse(response_data, status=200)

    except Exception as err:
        return JsonResponse(
            {"error": f"Error fetching document: {str(err)}"}, status=400
        )


@csrf_exempt
@require_http_methods(["GET"])
def Get_Data_For_Dispatch(request):
    try:
        if request.method == "GET":
            completedId = request.GET.get('completedId',None)

            # if department:
            Request_Data = list(
                Radiology_Request_Details.objects.filter(
                    Service_Status="Completed",
                    Radiology_RequestId = completedId
                ).values()
            )

            Result = []
            for data in Request_Data:
                Completed_Data = Radiology_Complete_Details.objects.filter(
                    Radiology_RequestId_id=data["Radiology_RequestId"],
                    TestCode=data["SubTestCode"],
                ).first()
                department = RadiologyNames_Details.objects.filter(
                    Radiology_Id=data["TestCode"]
                ).first()
                Test = TestName_Details.objects.filter(
                    Test_Code=data["SubTestCode"]
                ).first()
                doctor = Doctor_Personal_Form_Detials.objects.filter(
                    Doctor_ID=data["Doctorid_id"]
                ).first()

                if doctor:
                    DoctorName = f"""{getattr(doctor.Tittle, 'Title_Name', '') or ''}.{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}"""

                else:
                    DoctorName = "Self"

                file_base64 = None
                if Completed_Data.content:
                    file_base64 = base64.b64encode(Completed_Data.content).decode('utf-8')
                    file_base64 = f"data:application/pdf;base64,{file_base64}"

                print("testttttttttt")
                print(data["Billing_Invoice_No_id"], "OPrrrrrrrrr")

                if data["RegisterType"] in ["OP", "WALK-IN"]:

                    patient = Patient_Appointment_Registration_Detials.objects.filter(
                        pk=data["OP_Register_Id_id"]
                    ).first()

                    receiveddate = ""

                    if data["Billing_Invoice_No_id"]:

                        billins = General_Billing_Table_Detials.objects.filter(
                            Billing_Invoice_No=data["Billing_Invoice_No_id"]
                        ).first()
                        receiveddate = billins.Billing_Date

                    elif data["Interim_Billing_Invoice_No_id"]:
                        billins = Interim_Billing_Table_Detials.objects.filter(
                            Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                        ).first()
                        receiveddate = billins.Billing_Date

                    que = {
                        "Radiology_CompleteId": Completed_Data.Radiology_CompleteId,
                        "RequestId": data["Radiology_RequestId"],
                        "Invoice": data["Billing_Invoice_No_id"],
                        "TestCode": data["SubTestCode"],
                        "TestName": Test.Test_Name,
                        "Department": department.Radiology_Name,
                        "RegisterType": data["RegisterType"],
                        "BillingStatus": data["Status"],
                        "CreatedBy": data["created_by"],
                        "CreatedAt": data["created_at"],
                        "UpdatedAt": data["updated_at"],
                        "Casuality_Register_Id_id": data["Casuality_Register_Id_id"],
                        "Diagnosis_Register_Id_id": data["Diagnosis_Register_Id_id"],
                        "Doctorid_id": data["Doctorid_id"],
                        "DoctorName": DoctorName,
                        "IP_Billing_Invoice_No_id": data["IP_Billing_Invoice_No_id"],
                        "IP_Register_Id_id": data["IP_Register_Id_id"],
                        "Registrationid": patient.Registration_Id if patient else None,
                        "Service_Status": data["Service_Status"],
                        # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                        "FirstName": (
                            patient.PatientId.FirstName
                            if patient and patient.PatientId
                            else None
                        ),
                        "MiddleName": (
                            patient.PatientId.MiddleName
                            if patient and patient.PatientId
                            else None
                        ),
                        "Phone": (
                            patient.PatientId.PhoneNo
                            if patient and patient.PatientId
                            else None
                        ),
                        "Gender": (
                            patient.PatientId.Gender
                            if patient and patient.PatientId
                            else None
                        ),
                        "Age": (
                            patient.PatientId.Age
                            if patient and patient.PatientId
                            else None
                        ),
                        "ReportTime": Completed_Data.ReportDate,
                        "RadiologistId": Completed_Data.RadiologistName,
                        # 'RadiologistTitle': doctor.Tittle.Title_Name,
                        # 'RadiologistName': doctor.First_Name,
                        "Technician": Completed_Data.Technician_Name,
                        "ReportHandover": Completed_Data.Report_HandOverTo,
                        "CreatedBy": Completed_Data.Createdby,
                        "Status": Completed_Data.Status,
                        "html": Completed_Data.html_content,
                        "DocumentId": Completed_Data.Document_Id,
                        "VisitId": patient.VisitId,
                        "receiveddate": receiveddate,
                        "File":file_base64
                    }
                    Result.append(que)

                elif data["RegisterType"] in ["IP"]:

                    patient = Patient_IP_Registration_Detials.objects.filter(
                        pk=data["IP_Register_Id_id"]
                    ).first()
                    receiveddate = ""
                    if data["IP_Billing_Invoice_No_id"]:
                        billins = IP_Billing_Table_Detials.objects.filter(
                            Billing_Invoice_No=data["IP_Billing_Invoice_No_id"]
                        ).first()
                        receiveddate = billins.Billing_Date

                    elif data["Interim_Billing_Invoice_No_id"]:
                        billins = Interim_Billing_Table_Detials.objects.filter(
                            Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                        ).first()
                        receiveddate = billins.Billing_Date

                    que = {
                        "Radiology_CompleteId": Completed_Data.Radiology_CompleteId,
                        "RequestId": data["Radiology_RequestId"],
                        "Invoice": data["Billing_Invoice_No_id"],
                        "TestCode": data["SubTestCode"],
                        "TestName": Test.Test_Name,
                        "Department": department.Radiology_Name,
                        "RegisterType": data["RegisterType"],
                        "BillingStatus": data["Status"],
                        "CreatedBy": data["created_by"],
                        "CreatedAt": data["created_at"],
                        "UpdatedAt": data["updated_at"],
                        "Casuality_Register_Id_id": data["Casuality_Register_Id_id"],
                        "Diagnosis_Register_Id_id": data["Diagnosis_Register_Id_id"],
                        "Doctorid_id": data["Doctorid_id"],
                        "DoctorName": DoctorName,
                        "IP_Billing_Invoice_No_id": data["IP_Billing_Invoice_No_id"],
                        "Registrationid": data["IP_Register_Id_id"],
                        "OP_Register_Id_id": (
                            patient.Registration_Id if patient else None
                        ),
                        "Service_Status": data["Service_Status"],
                        # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                        "FirstName": (
                            f"""{patient.PatientId.FirstName} {patient.PatientId.MiddleName} .{patient.PatientId.SurName}"""
                            if patient and patient.PatientId
                            else None
                        ),
                        "MiddleName": (
                            patient.PatientId.MiddleName
                            if patient and patient.PatientId
                            else None
                        ),
                        "Phone": (
                            patient.PatientId.PhoneNo
                            if patient and patient.PatientId
                            else None
                        ),
                        "Gender": (
                            patient.PatientId.Gender
                            if patient and patient.PatientId
                            else None
                        ),
                        "Age": (
                            patient.PatientId.Age
                            if patient and patient.PatientId
                            else None
                        ),
                        "ReportTime": Completed_Data.ReportDate,
                        "RadiologistId": Completed_Data.RadiologistName,
                        # 'RadiologistTitle': doctor.Tittle.Title_Name,
                        # 'RadiologistName': doctor.First_Name,
                        "Technician": Completed_Data.Technician_Name,
                        "ReportHandover": Completed_Data.Report_HandOverTo,
                        "CreatedBy": Completed_Data.Createdby,
                        "Status": Completed_Data.Status,
                        "html": Completed_Data.html_content,
                        "DocumentId": Completed_Data.Document_Id,
                        "receiveddate": receiveddate,
                    }
                    Result.append(que)

            return JsonResponse(Result, safe=False)

    except Exception as err:
        return JsonResponse(
            {"error": f"Error fetching document: {str(err)}"}, status=400
        )


# views.py


@csrf_exempt
@require_http_methods(["GET"])
def Get_Dispatch_By_Patient(request):
    try:
        if request.method == "GET":
            RegistrationId = request.GET.get("RegistrationId", None)
            Type = request.GET.get("Type", None)

            print(RegistrationId, "RegistrationId")
            print(Type, "Type")

            if Type == "OP":

                # Get only completed requests
                Request_Data = list(
                    Radiology_Request_Details.objects.filter(
                        Service_Status="Completed",
                        OP_Register_Id__Registration_Id=RegistrationId,
                    ).values()
                )

                Result = []
                for data in Request_Data:
                    Completed_Data = Radiology_Complete_Details.objects.filter(
                        Radiology_RequestId_id=data["Radiology_RequestId"],
                        TestCode=data["SubTestCode"],
                    ).first()
                    department = RadiologyNames_Details.objects.filter(
                        Radiology_Id=data["TestCode"]
                    ).first()
                    Test = TestName_Details.objects.filter(
                        Test_Code=data["SubTestCode"]
                    ).first()
                    doctor = Doctor_Personal_Form_Detials.objects.filter(
                        Doctor_ID=data["Doctorid_id"]
                    ).first()

                    if doctor:
                        DoctorName = f"""{getattr(doctor.Tittle, 'Title_Name', '') or ''}.{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}"""

                    else:
                        DoctorName = "Self"

                    print("testttttttttt")
                    print(data["Billing_Invoice_No_id"], "OPrrrrrrrrr")

                    if data["RegisterType"] in ["OP", "WALK-IN"]:

                        patient = (
                            Patient_Appointment_Registration_Detials.objects.filter(
                                pk=data["OP_Register_Id_id"]
                            ).first()
                        )

                        receiveddate = ""

                        if data["Billing_Invoice_No_id"]:

                            billins = General_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        elif data["Interim_Billing_Invoice_No_id"]:
                            billins = Interim_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        que = {
                            "Radiology_CompleteId" : Completed_Data.Radiology_CompleteId,
                            "RequestId": data["Radiology_RequestId"],
                            "Invoice": data["Billing_Invoice_No_id"],
                            "TestCode": data["SubTestCode"],
                            "TestName": Test.Test_Name,
                            "Department": department.Radiology_Name,
                            "RegisterType": data["RegisterType"],
                            "BillingStatus": data["Status"],
                            "CreatedBy": data["created_by"],
                            "CreatedAt": data["created_at"],
                            "UpdatedAt": data["updated_at"],
                            "Casuality_Register_Id_id": data[
                                "Casuality_Register_Id_id"
                            ],
                            "Diagnosis_Register_Id_id": data[
                                "Diagnosis_Register_Id_id"
                            ],
                            "Doctorid_id": data["Doctorid_id"],
                            "DoctorName": DoctorName,
                            "IP_Billing_Invoice_No_id": data[
                                "IP_Billing_Invoice_No_id"
                            ],
                            "IP_Register_Id_id": data["IP_Register_Id_id"],
                            "Registrationid": (
                                patient.Registration_Id if patient else None
                            ),
                            "Service_Status": data["Service_Status"],
                            # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                            "FirstName": (
                                patient.PatientId.FirstName
                                if patient and patient.PatientId
                                else None
                            ),
                            "MiddleName": (
                                patient.PatientId.MiddleName
                                if patient and patient.PatientId
                                else None
                            ),
                            "Phone": (
                                patient.PatientId.PhoneNo
                                if patient and patient.PatientId
                                else None
                            ),
                            "Gender": (
                                patient.PatientId.Gender
                                if patient and patient.PatientId
                                else None
                            ),
                            "Age": (
                                patient.PatientId.Age
                                if patient and patient.PatientId
                                else None
                            ),
                            "ReportTime": Completed_Data.ReportDate,
                            "RadiologistId": Completed_Data.RadiologistName,
                            # 'RadiologistTitle': doctor.Tittle.Title_Name,
                            # 'RadiologistName': doctor.First_Name,
                            "Technician": Completed_Data.Technician_Name,
                            "ReportHandover": Completed_Data.Report_HandOverTo,
                            "CreatedBy": Completed_Data.Createdby,
                            "Status": Completed_Data.Status,
                            "html": Completed_Data.html_content,
                            "DocumentId": Completed_Data.Document_Id,
                            "VisitId": patient.VisitId,
                            "receiveddate": receiveddate,
                        }
                        Result.append(que)

                return JsonResponse(Result, safe=False)

            if Type == "IP":

                # Get only completed requests
                Request_Data = list(
                    Radiology_Request_Details.objects.filter(
                        Service_Status="Completed",
                        IP_Register_Id__Registration_Id=RegistrationId,
                    ).values()
                )

                print(Request_Data, "Request_Data")

                Result = []
                for data in Request_Data:
                    Completed_Data = Radiology_Complete_Details.objects.filter(
                        Radiology_RequestId_id=data["Radiology_RequestId"],
                        TestCode=data["SubTestCode"],
                    ).first()
                    department = RadiologyNames_Details.objects.filter(
                        Radiology_Id=data["TestCode"]
                    ).first()
                    Test = TestName_Details.objects.filter(
                        Test_Code=data["SubTestCode"]
                    ).first()
                    doctor = Doctor_Personal_Form_Detials.objects.filter(
                        Doctor_ID=data["Doctorid_id"]
                    ).first()

                    if doctor:
                        DoctorName = f"""{getattr(doctor.Tittle, 'Title_Name', '') or ''}.{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}"""

                    else:
                        DoctorName = "Self"

                    print("testttttttttt")
                    print(data["Billing_Invoice_No_id"], "OPrrrrrrrrr")

                    if data["RegisterType"] in ["IP"]:

                        patient = Patient_IP_Registration_Detials.objects.filter(
                            pk=data["IP_Register_Id_id"]
                        ).first()
                        receiveddate = ""
                        if data["IP_Billing_Invoice_No_id"]:
                            billins = IP_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["IP_Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        elif data["Interim_Billing_Invoice_No_id"]:
                            billins = Interim_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        que = {
                            "RequestId": data["Radiology_RequestId"],
                            "Invoice": data["Billing_Invoice_No_id"],
                            "TestCode": data["SubTestCode"],
                            "TestName": Test.Test_Name,
                            "Department": department.Radiology_Name,
                            "RegisterType": data["RegisterType"],
                            "BillingStatus": data["Status"],
                            "CreatedBy": data["created_by"],
                            "CreatedAt": data["created_at"],
                            "UpdatedAt": data["updated_at"],
                            "Casuality_Register_Id_id": data[
                                "Casuality_Register_Id_id"
                            ],
                            "Diagnosis_Register_Id_id": data[
                                "Diagnosis_Register_Id_id"
                            ],
                            "Doctorid_id": data["Doctorid_id"],
                            "DoctorName": DoctorName,
                            "IP_Billing_Invoice_No_id": data[
                                "IP_Billing_Invoice_No_id"
                            ],
                            "Registrationid": data["IP_Register_Id_id"],
                            "OP_Register_Id_id": (
                                patient.Registration_Id if patient else None
                            ),
                            "Service_Status": data["Service_Status"],
                            # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                            "FirstName": (
                                f"""{patient.PatientId.FirstName} {patient.PatientId.MiddleName} .{patient.PatientId.SurName}"""
                                if patient and patient.PatientId
                                else None
                            ),
                            "MiddleName": (
                                patient.PatientId.MiddleName
                                if patient and patient.PatientId
                                else None
                            ),
                            "Phone": (
                                patient.PatientId.PhoneNo
                                if patient and patient.PatientId
                                else None
                            ),
                            "Gender": (
                                patient.PatientId.Gender
                                if patient and patient.PatientId
                                else None
                            ),
                            "Age": (
                                patient.PatientId.Age
                                if patient and patient.PatientId
                                else None
                            ),
                            "ReportTime": Completed_Data.ReportDate,
                            "RadiologistId": Completed_Data.RadiologistName,
                            # 'RadiologistTitle': doctor.Tittle.Title_Name,
                            # 'RadiologistName': doctor.First_Name,
                            "Technician": Completed_Data.Technician_Name,
                            "ReportHandover": Completed_Data.Report_HandOverTo,
                            "CreatedBy": Completed_Data.Createdby,
                            "Status": Completed_Data.Status,
                            "html": Completed_Data.html_content,
                            "DocumentId": Completed_Data.Document_Id,
                            "receiveddate": receiveddate,
                        }
                        Result.append(que)

                return JsonResponse(Result, safe=False)

    except Exception as err:
        return JsonResponse(
            {"error": f"Error fetching document: {str(err)}"}, status=400
        )


@csrf_exempt
@require_http_methods(["GET"])
def Get_for_Patient_master(request):
    try:
        if request.method == "GET":
            RegistrationId = request.GET.get("RegistrationId", None)
            Type = request.GET.get("Type", None)
            PatientId = request.GET.get("PatientId")

            print(RegistrationId, "RegistrationId")
            print(Type, "Type")

            if Type == "OP":

                # Get only completed requests
                Request_Data = list(
                    Radiology_Request_Details.objects.filter(
                        Service_Status="Completed", OP_Register_Id__PatientId=PatientId
                    ).values()
                )

                Result = []
                for data in Request_Data:
                    Completed_Data = Radiology_Complete_Details.objects.filter(
                        Radiology_RequestId_id=data["Radiology_RequestId"],
                        TestCode=data["SubTestCode"],
                    ).first()
                    department = RadiologyNames_Details.objects.filter(
                        Radiology_Id=data["TestCode"]
                    ).first()
                    Test = TestName_Details.objects.filter(
                        Test_Code=data["SubTestCode"]
                    ).first()
                    doctor = Doctor_Personal_Form_Detials.objects.filter(
                        Doctor_ID=data["Doctorid_id"]
                    ).first()

                    if doctor:
                        DoctorName = f"""{getattr(doctor.Tittle, 'Title_Name', '') or ''}.{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}"""

                    else:
                        DoctorName = "Self"

                    print("testttttttttt")
                    print(data["Billing_Invoice_No_id"], "OPrrrrrrrrr")

                    if data["RegisterType"] in ["OP", "WALK-IN"]:

                        patient = (
                            Patient_Appointment_Registration_Detials.objects.filter(
                                pk=data["OP_Register_Id_id"]
                            ).first()
                        )

                        receiveddate = ""

                        if data["Billing_Invoice_No_id"]:

                            billins = General_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        elif data["Interim_Billing_Invoice_No_id"]:
                            billins = Interim_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        que = {
                            "RequestId": data["Radiology_RequestId"],
                            "Invoice": data["Billing_Invoice_No_id"],
                            "TestCode": data["SubTestCode"],
                            "TestName": Test.Test_Name,
                            "Department": department.Radiology_Name,
                            "RegisterType": data["RegisterType"],
                            "BillingStatus": data["Status"],
                            "CreatedBy": data["created_by"],
                            "CreatedAt": data["created_at"],
                            "UpdatedAt": data["updated_at"],
                            "Casuality_Register_Id_id": data[
                                "Casuality_Register_Id_id"
                            ],
                            "Diagnosis_Register_Id_id": data[
                                "Diagnosis_Register_Id_id"
                            ],
                            "Doctorid_id": data["Doctorid_id"],
                            "DoctorName": DoctorName,
                            "IP_Billing_Invoice_No_id": data[
                                "IP_Billing_Invoice_No_id"
                            ],
                            "IP_Register_Id_id": data["IP_Register_Id_id"],
                            "Registrationid": (
                                patient.Registration_Id if patient else None
                            ),
                            "Service_Status": data["Service_Status"],
                            # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                            "FirstName": (
                                patient.PatientId.FirstName
                                if patient and patient.PatientId
                                else None
                            ),
                            "MiddleName": (
                                patient.PatientId.MiddleName
                                if patient and patient.PatientId
                                else None
                            ),
                            "Phone": (
                                patient.PatientId.PhoneNo
                                if patient and patient.PatientId
                                else None
                            ),
                            "Gender": (
                                patient.PatientId.Gender
                                if patient and patient.PatientId
                                else None
                            ),
                            "Age": (
                                patient.PatientId.Age
                                if patient and patient.PatientId
                                else None
                            ),
                            "ReportTime": Completed_Data.ReportDate,
                            "RadiologistId": Completed_Data.RadiologistName,
                            # 'RadiologistTitle': doctor.Tittle.Title_Name,
                            # 'RadiologistName': doctor.First_Name,
                            "Technician": Completed_Data.Technician_Name,
                            "ReportHandover": Completed_Data.Report_HandOverTo,
                            "CreatedBy": Completed_Data.Createdby,
                            "Status": Completed_Data.Status,
                            "html": Completed_Data.html_content,
                            "DocumentId": Completed_Data.Document_Id,
                            "VisitId": patient.VisitId,
                            "receiveddate": receiveddate,
                        }
                        Result.append(que)

                return JsonResponse(Result, safe=False)

            if Type == "IP":

                # Get only completed requests
                Request_Data = list(
                    Radiology_Request_Details.objects.filter(
                        Service_Status="Completed", IP_Register_Id__PatientId=PatientId
                    ).values()
                )

                print(Request_Data, "Request_Data")

                Result = []
                for data in Request_Data:
                    Completed_Data = Radiology_Complete_Details.objects.filter(
                        Radiology_RequestId_id=data["Radiology_RequestId"],
                        TestCode=data["SubTestCode"],
                    ).first()
                    department = RadiologyNames_Details.objects.filter(
                        Radiology_Id=data["TestCode"]
                    ).first()
                    Test = TestName_Details.objects.filter(
                        Test_Code=data["SubTestCode"]
                    ).first()
                    doctor = Doctor_Personal_Form_Detials.objects.filter(
                        Doctor_ID=data["Doctorid_id"]
                    ).first()

                    if doctor:
                        DoctorName = f"""{getattr(doctor.Tittle, 'Title_Name', '') or ''}.{getattr(doctor, 'First_Name', '') or ''}{getattr(doctor, 'Middle_Name', '') or ''} {getattr(doctor, 'Last_Name', '') or ''}"""

                    else:
                        DoctorName = "Self"

                    print("testttttttttt")
                    print(data["Billing_Invoice_No_id"], "OPrrrrrrrrr")

                    if data["RegisterType"] in ["IP"]:

                        patient = Patient_IP_Registration_Detials.objects.filter(
                            pk=data["IP_Register_Id_id"]
                        ).first()
                        receiveddate = ""
                        if data["IP_Billing_Invoice_No_id"]:
                            billins = IP_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["IP_Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        elif data["Interim_Billing_Invoice_No_id"]:
                            billins = Interim_Billing_Table_Detials.objects.filter(
                                Billing_Invoice_No=data["Interim_Billing_Invoice_No_id"]
                            ).first()
                            receiveddate = billins.Billing_Date

                        que = {
                            "RequestId": data["Radiology_RequestId"],
                            "Invoice": data["Billing_Invoice_No_id"],
                            "TestCode": data["SubTestCode"],
                            "TestName": Test.Test_Name,
                            "Department": department.Radiology_Name,
                            "RegisterType": data["RegisterType"],
                            "BillingStatus": data["Status"],
                            "CreatedBy": data["created_by"],
                            "CreatedAt": data["created_at"],
                            "UpdatedAt": data["updated_at"],
                            "Casuality_Register_Id_id": data[
                                "Casuality_Register_Id_id"
                            ],
                            "Diagnosis_Register_Id_id": data[
                                "Diagnosis_Register_Id_id"
                            ],
                            "Doctorid_id": data["Doctorid_id"],
                            "DoctorName": DoctorName,
                            "IP_Billing_Invoice_No_id": data[
                                "IP_Billing_Invoice_No_id"
                            ],
                            "Registrationid": data["IP_Register_Id_id"],
                            "OP_Register_Id_id": (
                                patient.Registration_Id if patient else None
                            ),
                            "Service_Status": data["Service_Status"],
                            # 'Title': patient.PatientId.Title.Title_Name if patient and patient.PatientId.Title else None,
                            "FirstName": (
                                f"""{patient.PatientId.FirstName} {patient.PatientId.MiddleName} .{patient.PatientId.SurName}"""
                                if patient and patient.PatientId
                                else None
                            ),
                            "MiddleName": (
                                patient.PatientId.MiddleName
                                if patient and patient.PatientId
                                else None
                            ),
                            "Phone": (
                                patient.PatientId.PhoneNo
                                if patient and patient.PatientId
                                else None
                            ),
                            "Gender": (
                                patient.PatientId.Gender
                                if patient and patient.PatientId
                                else None
                            ),
                            "Age": (
                                patient.PatientId.Age
                                if patient and patient.PatientId
                                else None
                            ),
                            "ReportTime": Completed_Data.ReportDate,
                            "RadiologistId": Completed_Data.RadiologistName,
                            # 'RadiologistTitle': doctor.Tittle.Title_Name,
                            # 'RadiologistName': doctor.First_Name,
                            "Technician": Completed_Data.Technician_Name,
                            "ReportHandover": Completed_Data.Report_HandOverTo,
                            "CreatedBy": Completed_Data.Createdby,
                            "Status": Completed_Data.Status,
                            "html": Completed_Data.html_content,
                            "DocumentId": Completed_Data.Document_Id,
                            "receiveddate": receiveddate,
                        }
                        Result.append(que)

                return JsonResponse(Result, safe=False)

    except Exception as err:
        return JsonResponse(
            {"error": f"Error fetching document: {str(err)}"}, status=400
        )


@csrf_exempt
@require_http_methods(["POST"])
def Delete_Document_link(request, document_id):
    try:
        document = RadiologyDocument.objects.get(id=document_id)

        # Delete file from storage if it exists
        if document.file and os.path.isfile(document.file.path):
            os.remove(document.file.path)

        document.delete()

        return JsonResponse({"success": "Document deleted successfully"}, status=200)

    except RadiologyDocument.DoesNotExist:
        return JsonResponse({"error": "Document not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# @csrf_exempt
# @require_http_methods(["GET"])
# def radiology_doctor_wise_report(request):
#     try:
#         # Get doctor_id from query parameters
#         doctor_id = request.GET.get("doctor_id")
#         if not doctor_id:
#             return JsonResponse({"error": "Doctor ID is required"}, status=400)

#         # Get doctor details first
#         doctor = Doctor_Personal_Form_Detials.objects.filter(
#             Doctor_ID=doctor_id
#         ).first()
#         if not doctor:
#             return JsonResponse({"error": "Doctor not found"}, status=404)

#         # Format doctor name
#         doctor_name = f"{doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}".strip()
  
        
#         # Query completed radiology reports for this doctor
#         reports = Radiology_Complete_Details.objects.filter(
#             RadiologistName=doctor_id
#         ).select_related("Radiology_RequestId", "department")
        


#         # Format the report data
#         report_list = []
#         for report in reports:
#             TestName_Detailsins = TestName_Details.objects.filter(Test_Code=report.Radiology_RequestId.SubTestCode).first()
            
#             report_data = {
#                 "request_id": report.Radiology_RequestId.Radiology_RequestId,
#                 "test_name": TestName_Detailsins.Test_Name if TestName_Detailsins else None,
#                 "test_code": report.TestCode,
#                 "doctor_id": doctor_id,
#                 "doctor_name": doctor_name,
#                 "department": (
#                     report.department.Radiology_Name if report.department else None
#                 ),
#                 "report_date": report.ReportDate,
#                 "status": report.Status,
#                 "register_type": report.Radiology_RequestId.RegisterType,
#                 "technician": report.Technician_Name,
#                 "created_at": report.created_at,
#                 "updated_at": report.updated_at,
#             }
#             report_list.append(report_data)

#         # Calculate summary counts
#         total_reports = len(report_list)
#         completed_reports = sum(1 for r in report_list if r["status"] == "Completed")
#         pending_reports = sum(1 for r in report_list if r["status"] == "Pending")

#         # Group reports by department
#         department_summary = {}
#         for report in report_list:
#             dept = report["department"]
#             if dept:
#                 if dept not in department_summary:
#                     department_summary[dept] = {
#                         "total": 0,
#                         "completed": 0,
#                         "pending": 0,
#                     }
#                 department_summary[dept]["total"] += 1
#                 if report["status"] == "Completed":
#                     department_summary[dept]["completed"] += 1
#                 elif report["status"] == "Pending":
#                     department_summary[dept]["pending"] += 1

#         response_data = {
#             "doctor_details": {"doctor_id": doctor_id, "doctor_name": doctor_name},
#             "summary": {
#                 "total_reports": total_reports,
#                 "completed": completed_reports,
#                 "pending": pending_reports,
#                 "department_wise": department_summary,
#             },
#             "reports": report_list,
#         }

#         return JsonResponse(response_data, safe=False)

#     except Exception as e:
#         print(f"Error in radiology_doctor_wise_report: {str(e)}")
#         return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def radiology_doctor_wise_report(request):
    try:
        # Get doctor_id from query parameters
        doctor_id = request.GET.get("doctor_id")
        if not doctor_id:
            return JsonResponse({"error": "Doctor ID is required"}, status=400)
 
        # Get doctor details first
        doctor = Doctor_Personal_Form_Detials.objects.filter(
            Doctor_ID=doctor_id
        ).first()
        if not doctor:
            return JsonResponse({"error": "Doctor not found"}, status=404)
 
        # Format doctor name
        doctor_name = f"{doctor.First_Name or ''} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}".strip()
 
       
        # Query completed radiology reports for this doctor
        reports = Radiology_Complete_Details.objects.filter(
            RadiologistName=doctor_id
        ).select_related("Radiology_RequestId", "department")
       
 
 
        # Format the report data
        report_list = []
        for report in reports:
            TestName_Detailsins = TestName_Details.objects.filter(Test_Code=report.Radiology_RequestId.SubTestCode).first()
           
            report_data = {
                "request_id": report.Radiology_RequestId.Radiology_RequestId,
                "test_name": TestName_Detailsins.Test_Name if TestName_Detailsins else None,
                "test_code": report.TestCode,
                "doctor_id": doctor_id,
                "doctor_name": doctor_name,
                "patientname": report.Radiology_RequestId.OP_Register_Id.PatientId.FirstName if report.Radiology_RequestId.OP_Register_Id else None,
                "patient_id": report.Radiology_RequestId.OP_Register_Id.PatientId.PatientId if report.Radiology_RequestId.OP_Register_Id else None,
                "patient_phone": report.Radiology_RequestId.OP_Register_Id.PatientId.PhoneNo if report.Radiology_RequestId.OP_Register_Id else None,
                "patient_age": report.Radiology_RequestId.OP_Register_Id.PatientId.Age if report.Radiology_RequestId.OP_Register_Id else None,
                "department": (
                    report.department.Radiology_Name if report.department else None
                ),
                "report_date": report.ReportDate,
                "status": report.Status,
                "register_type": report.Radiology_RequestId.RegisterType,
                "technician": report.Technician_Name,
                "created_at": report.created_at,
                "updated_at": report.updated_at,
            }
            report_list.append(report_data)
 
        # Calculate summary counts
        total_reports = len(report_list)
        completed_reports = sum(1 for r in report_list if r["status"] == "Completed")
        pending_reports = sum(1 for r in report_list if r["status"] == "Pending")
 
        # Group reports by department
        department_summary = {}
        for report in report_list:
            dept = report["department"]
            if dept:
                if dept not in department_summary:
                    department_summary[dept] = {
                        "total": 0,
                        "completed": 0,
                        "pending": 0,
                    }
                department_summary[dept]["total"] += 1
                if report["status"] == "Completed":
                    department_summary[dept]["completed"] += 1
                elif report["status"] == "Pending":
                    department_summary[dept]["pending"] += 1
 
        response_data = {
            "doctor_details": {"doctor_id": doctor_id, "doctor_name": doctor_name},
            "summary": {
                "total_reports": total_reports,
                "completed": completed_reports,
                "pending": pending_reports,
                "department_wise": department_summary,
            },
            "reports": report_list,
        }
 
        return JsonResponse(response_data, safe=False)
 
    except Exception as e:
        print(f"Error in radiology_doctor_wise_report: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)











from datetime import datetime


@csrf_exempt
@require_http_methods(["GET"])
def get_patienttestlist(request):
    try:
        patientName = request.GET.get('patient_name')
        patientId = request.GET.get('patientid')
        requestId = request.GET.get('barcode')
        department = request.GET.get('departments')
        dateOption = request.GET.get('dateType')
        CurrentDate = request.GET.get('date')
        fromDate = request.GET.get('from')
        toDate = request.GET.get('to')
        status = request.GET.get('status')

        filters = Q()
        print("DEpartments---------",department)
        # Handle date filters
        if dateOption:
            if dateOption == 'currentdate' and CurrentDate:
                filters &= Q(created_at__date=CurrentDate)
            elif dateOption == 'customdate' and fromDate and toDate:
                from_date = datetime.strptime(fromDate, '%Y-%m-%d').date()
                to_date = datetime.strptime(toDate, '%Y-%m-%d').date()
                filters &= Q(created_at__date__range=(from_date, to_date))


        # Other filters
        if patientName:
            filters &= (
            Q(OP_Register_Id__PatientId__FirstName__icontains=patientName) |
            Q(IP_Register_Id__PatientId__FirstName__icontains=patientName) |
            Q(Casuality_Register_Id__PatientId__FirstName__icontains=patientName)
)
        if patientId:
            filters &= (
            Q(OP_Register_Id__PatientId=patientId) |
            Q(IP_Register_Id__PatientId=patientId) |
            Q(Casuality_Register_Id__PatientId=patientId)
)
        if requestId:
            filters &= Q(request_id=requestId)

        if status:
            filters &= Q(Service_Status=status)

            
        if department:
            filters &= Q(TestCode__in=department)

        # Fetch queryset
        queryset = Radiology_Request_Details.objects.exclude(Status='Canceled').filter(filters)
 

        index = 1
        response_data = []
        for req in queryset:

            reg_type = req.RegisterType
            registration = None
            if reg_type in ['OP', 'WALK-IN'] and req.OP_Register_Id:
                registration = req.OP_Register_Id
            elif reg_type == 'IP' and req.IP_Register_Id:
                registration = req.IP_Register_Id
            elif reg_type == 'Casuality' and req.Casuality_Register_Id:
                registration = req.Casuality_Register_Id

            if not registration:
                continue

            patient = registration.PatientId if registration else None
            doctor = req.Doctorid if reg_type in ['OP', 'WALK-IN'] else registration.PrimaryDoctor
            TestNames = TestName_Details.objects.filter(Test_Code=req.SubTestCode).first() if req.TestCode else None
            TestName = TestNames.Test_Name if TestNames else ''
            subDepartment = RadiologyNames_Details.objects.get(Radiology_Id = req.TestCode)
            formatted_date = req.created_at.strftime("%d-%m-%Y")
            completedId = None
            file_base64 = None
            if req.Service_Status == "Completed":
                completedId = Radiology_Complete_Details.objects.filter(Radiology_RequestId = req.Radiology_RequestId,TestCode = req.SubTestCode).last()
                
                if completedId.content:
                    file_base64 = base64.b64encode(completedId.content).decode('utf-8')
                    file_base64 = f"data:application/pdf;base64,{file_base64}"
            
            response_data.append({
                'id': index,
                "invoice": (getattr(req.Billing_Invoice_No, "Billing_Invoice_No", None) or getattr(req.IP_Billing_Invoice_No, "Billing_Invoice_No", None) or getattr(req.Interim_Billing_Invoice_No, "Billing_Invoice_No", None)),                'Patient_Id': patient.PatientId if patient else '',
                'Visit_Id': registration.VisitId if reg_type in ['OP', 'WALK-IN'] else None,
                'RegistrationId': registration.Registration_Id,
                'Patient_Name': f"{patient.FirstName or ''} {patient.MiddleName or ''} {patient.SurName or ''}".strip() if patient else '',
                'Phone': patient.PhoneNo if patient else '',
                'DoctorId': doctor.Doctor_ID if doctor else '',
                'DoctorName': f"{doctor.Tittle.Title_Name}. {doctor.First_Name}{doctor.Middle_Name}{doctor.Last_Name}" if doctor else '',
                'RegisterType': reg_type,
                'Age': patient.Age if patient else '',
                'gender': patient.Gender if patient else '',
                'Status': req.Status,
                'subDepartment':subDepartment.Radiology_Name,
                'TestCode': req.SubTestCode,
                'TestName':TestName,
                'Radiology_RequestId':req.Radiology_RequestId,
                'isCompleted': False,  # Flag to indicate this is from Request Details
                'Service_Status': req.Service_Status,
                "CreatedAt": formatted_date,
                "completedId": completedId.Radiology_CompleteId if completedId else '',
                "File": file_base64 if file_base64 else None,
                'IsCritical' : req.IsCritical
            })
            index += 1
        print("DAta---------->>",response_data)


        # return JsonResponse({'Success': 'Query Okay'}, status=200)
        return JsonResponse(response_data, safe=False)
 
 
    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': str(e)}, status=500)
 
 






@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def Radiology_Complete_Details_Link(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'warn': 'Request body is empty'}, status=400)
            
            data = json.loads(request.body)
            Age = data.get('Age')
            CreatedAt = data.get('CreatedAt')
            refDoctorId = data.get('DoctorId')
            refDoctorName = data.get('DoctorName')
            HTMLCont = data.get('HTMLCont')
            Patient_Id = data.get('Patient_Id')
            Patient_Name = data.get('Patient_Name')
            Phone = data.get('Phone')
            Radiology_RequestId = data.get('Radiology_RequestId')
            RegisterType = data.get('RegisterType')
            RegistrationId = data.get('RegistrationId')
            Service_Status = data.get('Service_Status')
            Status = data.get('Status')
            TestCode = data.get('TestCode')
            TestName = data.get('TestName')
            Visit_Id = data.get('Visit_Id')
            createdBy = data.get('createdBy')
            doctorId = data.get('doctorId')
            doctorName = data.get('doctorName', "")
            documentId = data.get('documentId')
            documentName = data.get('documentName')
            gender = data.get('gender')
            id_ = data.get('id')  
            invoice = data.get('invoice')
            isCompleted = data.get('isCompleted')
            subDepartment = data.get('subDepartment')

            completeId = data.get('completeId')

            file = data.get('File')
            if file and file.startswith("data:application/pdf;base64,"):
                file = file.split(",")[1]  # strip prefix ✅
                file = base64.b64decode(file)
            else:
                file = None

            encoded_html = base64.b64encode(HTMLCont.encode('utf-8')).decode('utf-8')


            if completeId:
                Radiology_Request_ins = Radiology_Request_Details.objects.get(pk=Radiology_RequestId, SubTestCode=TestCode)
                CompleteData = Radiology_Complete_Details.objects.get(Radiology_CompleteId = completeId)

                CompleteData.html_content = encoded_html
                if documentName:
                    CompleteData.fileName = documentName
                if documentId:
                    CompleteData.Document_Id = documentId
                if file:
                    CompleteData.content = file

                CompleteData.save()

                Radiology_Request_ins.Service_Status = "Completed"
                Radiology_Request_ins.save()

                print("Report Verifyed By Doctor...")
                return JsonResponse({'success': 'Report Entry Saved successfully'}, status=200)
            
            else:
                department_instance = RadiologyNames_Details.objects.filter(Radiology_Name=subDepartment).first() if subDepartment else None

                # Correcting the typo in variable name
                current_datetime = datetime.now()
                current_date = current_datetime.strftime("%Y-%m-%d")   # Example: '2025-08-22'
                current_time = current_datetime.strftime("%H:%M:%S")   # Example: '14:35:12'


                registration_instance = None
                if RegisterType == "OP" or RegisterType == "WALK-IN":
                    registration_instance = Patient_Appointment_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
                elif RegisterType == "IP":
                    registration_instance = Patient_IP_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
                elif RegisterType == "Casuality":
                    registration_instance = Patient_Casuality_Registration_Detials.objects.filter(Registration_Id=RegistrationId).first()
                
                if not registration_instance:
                    return JsonResponse({'warn': 'Invalid registration ID or RegisterType'})
                
                if TestCode:
                    Radiology_Request_ins = Radiology_Request_Details.objects.filter(pk=Radiology_RequestId, SubTestCode=TestCode).first()
                else:
                    Radiology_Request_ins = Radiology_Request_Details.objects.filter(pk=Radiology_RequestId, SubTestCode=TestCode).first()

                Radiology_Complete_ins = Radiology_Complete_Details.objects.create(
                    RegisterType=RegisterType,
                    OP_Register_Id=registration_instance if RegisterType == "OP" else None,
                    IP_Register_Id=registration_instance if RegisterType == "IP" else None,
                    Casuality_Register_Id=registration_instance if RegisterType == "Casuality" else None,
                    Radiology_RequestId=Radiology_Request_ins,
                    ReportDate = current_date,
                    ReportTime=current_time,
                    RadiologistName=doctorName,
                    Technician_Name=createdBy,
                    Report= "",
                    Report_fileone= None,
                    Report_filetwo= None,
                    Report_filethree= None,
                    Report_HandOverTo= "",
                    RelativeName= "",
                    Createdby= createdBy,
                    department = department_instance,
                    doctorId = doctorId,
                    html_content = encoded_html,
                    fileName = documentName,
                    TestCode = TestCode,
                    Document_Id = documentId,
                    content = file
                )

                if subDepartment == "XRAY":
                    Radiology_Request_ins.Service_Status = "Completed"
                else:
                    Radiology_Request_ins.Service_Status = "Analyzd"
                Radiology_Request_ins.save()
                Radiology_Complete_ins.save()

                print("Report Analy By Doctor...")

                return JsonResponse({'success': 'Report Entry Saved successfully'}, status=200)
        
        except Exception as e:
            print("Exception:", e)
            return JsonResponse({'error': f'Bad Request, Error in Report Entry...'}, status=500)

    return JsonResponse({'warn': 'Invalid request method'}, status=405)

              






              
# @csrf_exempt
# def insert_External_Lab_Report(request):
#     if request.method != 'POST':
#         return JsonResponse({"Error": "Invalid request method. Only POST is allowed."}, status=405)
    
#     try:
#         billing_invoice_id = request.POST.get('Billing_Invoice')
#         patientId = request.POST.get('Patient_Id')
#         visitId = request.POST.get('Visit_Id')
#         barcodeId = request.POST.get('Barcode')
#         created_by = request.POST.get('created_by')
#         Location = request.POST.get('Location')
#         report = request.POST.get('file')
        
#         # if base64_file.startswith("data:application/pdf;base64,"):
#         #     base64_file = base64_file.split("base64,")[1]
#         # report = base64.b64decode(base64_file)
        
                
#         if not billing_invoice_id:
#             return JsonResponse({"Error": "Billing_Invoice is required."}, status=400)

#         cursor = db.cursor()
        
#         cursor.execute("SELECT * FROM External_Lab_Report WHERE Billing_Invoice = %s", (billing_invoice_id,))
#         existing_report = cursor.fetchone()
#         if existing_report:
#             print("Its Update")
#             update_query = """
#                 UPDATE External_Lab_Report
#                 SET Report_File = %s
#                 WHERE Billing_Invoice = %s
#             """
#             cursor.execute(update_query, (report, billing_invoice_id))
            
#         else:
#             print("Its Insert")
#             insert_query = """
#                 INSERT INTO External_Lab_Report (Billing_Invoice, Patient_Id, Visit_Id, CreatedBy, Location, Report_File, Report_Date, CreatedAt, UpdatedAt)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             cursor.execute(insert_query, (
#                 billing_invoice_id,
#                 patientId,
#                 visitId,
#                 created_by,
#                 Location,
#                 report,
#                 datetime.now(),
#                 datetime.now(),
#                 datetime.now()
#             ))
        
#         # query = """UPDATE Billing_Item_Table_for_lab
#         #            SET Service_Status = 'Completed', 
#         #                Analysis_Status = 'Completed', 
#         #                Verify_Status =  'Completed',
#         #                Approve_Status = 'Completed'
#         #            WHERE Billing_Invoice = %s AND Test_Code = %s"""
#         # cursor.execute(query, (datetime.now(), report, billing_invoice_id, barcodeId))
            
#         db.commit()
#         return JsonResponse({"Success": "Report inserted successfully."})

#     except Exception as e:
#         print(e)
#         return JsonResponse({"Error": str(e)}, status=500)




from MCI.models import *
from django.db.models import Q
from itertools import chain
from dateutil.relativedelta import relativedelta

# @csrf_exempt
# @require_http_methods(["GET"])
# def Radiology_Data_Summarys(request):
#     if request.method == "GET":
#         try:
#             location = request.GET.get("Location")
#             limit = request.GET.get("limit")
#             offset = request.GET.get("offset")
#             test = request.GET.get("testName") or ""
#             date = request.GET.get("date")
#             dateType = request.GET.get("dateType")
#             patientType = request.GET.get("patient")
#             method = request.GET.get("testType")
#             fromm = request.GET.get("from")
#             to = request.GET.get("to")
#             patient = request.GET.get("patientName")
#             department = request.GET.get('dept')
#             BatMan = request.GET.get('batman')
#             BatMant = True if BatMan == 'true' else False

#             dep_name = RadiologyNames_Details.objects.all()
#             departments_list = [
#                 {
#                     "dept_name": dep.Radiology_Name,
#                     "dept_code": dep.Radiology_Id,
#                     "ipcount": 0,
#                     "opcount": 0
#                 }
#                 for dep in dep_name
#             ]



#             print("I AM BatMan -",BatMan)
#             where=[]
#             pharams=[]
#             filters = Q()
#             test_filters = Q()
#             if dateType and dateType != "":
#                 if dateType == "month":
#                     year, month = map(int, date.split("-"))
#                     print("Year------aa-",year,month)
#                     filters &= Q(created_at__year=year, created_at__month=month)
                    
#                 elif dateType == "date":
#                     _date = datetime.strptime(date, "%Y-%m-%d").date()
#                     print("date--------",_date)
#                     filters &= Q(created_at__date=_date)
                    
#                 elif dateType == "customdate":
#                     if fromm and to and fromm != "" and to != "":
#                         from_date = datetime.strptime(fromm, "%Y-%m-%d").date()
#                         to_date   = datetime.strptime(to, "%Y-%m-%d").date()
#                         print("custom---------",from_date,to_date)
#                         filters &= Q(created_at__date__range=[from_date, to_date])
                        
#                 elif dateType == "custommonth":
#                     if fromm and to:
#                         from_date = datetime.strptime(fromm, "%Y-%m").replace(day=1)
#                         to_date = datetime.strptime(to, "%Y-%m").replace(day=1)
#                         last_day = (to_date + relativedelta(months=1)) - relativedelta(days=1)
#                         to_datetime = datetime.combine(last_day, datetime.max.time())
#                         print("custom month range:", from_date, "to", to_datetime)
#                         filters &= Q(created_at__range=[from_date, to_datetime])
        
#             if patientType and patientType != "All" and patientType != "":
#                 if patientType == "OP":
#                     filters &= Q(OP_Register_Id__isnull=False)
#                 else:
#                     filters &= Q(IP_Register_Id__isnull=False)

#             if patient and patient != "":
#                 print("Patient-------", patient)
#                 patient_filter = ( 
#                     Q(OP_Register_Id__PatientId__PatientId__icontains=patient) |
#                     Q(IP_Register_Id__PatientId__PatientId__icontains=patient) |
#                     Q(OP_Register_Id__PatientId__FirstName__icontains=patient) |
#                     Q(IP_Register_Id__PatientId__FirstName__icontains=patient) |
#                     Q(OP_Register_Id__Registration_Id__icontains=patient) |
#                     Q(IP_Register_Id__Registration_Id__icontains=patient)  )
#                 filters &= patient_filter

#             if test and test != "":
#                 print("Test-------",test)
#                 patient_filter = Q(SubTestCode=test) 
#                 filters &= patient_filter

#             if department and department!="":
#                 print("Department---------",department)
#                 dep_name = RadiologyNames_Details.objects.get(Radiology_Id = department).Radiology_Id
#                 patient_filter = Q(TestCode=department) 
                     
#                 filters &= patient_filter


#             if BatMan:
#                 if method and method == "Patient":
#                     lab_rq = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(SubTestCode='TSTCODE0032').filter(filters)
#                 elif method and method == "PatientS":
#                     lab_rq = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(SubTestCode='TSTCODE0032').filter(filters)
#                 else:
#                     qs1 = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(SubTestCode='TSTCODE0032').filter(filters)
#                     qs2 = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(SubTestCode='TSTCODE0032').filter(filters)
#                     lab_rq = chain(qs1, qs2) 
#             else:
#                 qs1 = Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(SubTestCode='TSTCODE0032').filter(filters)
#                 qs2 = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled').exclude(SubTestCode='TSTCODE0032').filter(filters)
#                 lab_rq = chain(qs1, qs2)            
            
#             print("no problm at lab_rq")
#             Report = []
#             no = 0
#             ip = 0
#             op = 0
            
#             deptName = ""
#             testName = ""
#             for lab in lab_rq:
#                 no+=1
#                 try:

#                     if lab.IP_Register_Id:
#                         # print("IP Patient...",lab.IP_Register_Id)
#                         ip += 1
#                         patientType = "IP"
#                         patient = lab.IP_Register_Id
#                     elif lab.OP_Register_Id:
#                         # print("OP Patient...",lab.OP_Register_Id)
#                         op += 1
#                         patientType = "OP"
#                         patient = lab.OP_Register_Id
#                     else:
#                         # print("None Patient...")
#                         patientType = "General"
#                         Patient = None
                        
#                     if lab.TestCode:
#                         deptName = RadiologyNames_Details.objects.get(Radiology_Id = lab.TestCode).Radiology_Name
#                         for dept in departments_list:
#                             if dept["dept_code"] == lab.TestCode or dept["dept_name"] == deptName:
#                                 if lab.OP_Register_Id:
#                                     dept["opcount"] += 1
                                    
#                                 elif lab.IP_Register_Id:
#                                     dept["ipcount"] += 1

#                     if lab.SubTestCode:
#                         testName = TestName_Details.objects.get(Test_Code = lab.SubTestCode).Test_Name

#                 except:
#                     continue
                
#                 Report.append({
#                     "Sno": no,
#                     "date": lab.created_at.date() if lab.created_at else None,
#                     "CreatedAt": lab.created_at.strftime("%d-%m-%Y %H:%M:%S"),
#                     "request": lab.Radiology_RequestId, 
#                     "patientType": patientType, 
#                     "patientid": patient.PatientId.PatientId,
#                     "opipid": "Dr."+lab.Doctorid.First_Name if lab.Doctorid else "",
#                     "patientName": f"""{patient.PatientId.Title.Title_Name}. {patient.PatientId.FirstName}""" if patient and patient.PatientId and patient.PatientId.Title else "",
#                     "Phone": patient.PatientId.PhoneNo,
#                     'Age':  patient.PatientId.Age,
#                     'Gender': patient.PatientId.Gender,
#                     'test': testName,
#                     'dept': deptName,
#                 }) 
#                 # else:
#                 #     print("Its a Empty Row...")
#             print("Report-----------------",op+ip)
            
#             return JsonResponse({
#                 "total_records": op+ip,
#                 "OP_records": op,
#                 "IP_records": ip,
#                 "test_data": Report,
#                 "deptData": departments_list,
#             }, safe=False)
        



#         except Exception as err:
#             print("Error:",err)
#             return JsonResponse({"error":str(err)})




from django.db.models import Q, Max
from datetime import datetime
from dateutil.relativedelta import relativedelta
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods



def get_specialization_and_doctor(rad_request):
    """
    Extract specialization and doctor info from radiology request
    Handles both regular and MCI patients
    """
    specialization = None
    doctor_name = None
    
    # Check if it's an IP patient
    if rad_request.IP_Register_Id:
        patient = rad_request.IP_Register_Id
        # Get specialization from IP registration
        if hasattr(patient, 'Specialization') and patient.Specialization:
            specialization = patient.Specialization.Speciality_Name
        # Get doctor from IP registration
        if hasattr(patient, 'PrimaryDoctor') and patient.PrimaryDoctor:
            doctor_name = f"Dr. {patient.PrimaryDoctor.First_Name}"
    
    # Check if it's an OP patient
    elif rad_request.OP_Register_Id:
        patient = rad_request.OP_Register_Id
        
        # Determine if this is an MCI patient by checking the model type
        is_mci_patient = isinstance(patient, MCI_Patient_Appointment_Registration_Detials)
        
        try:
            if is_mci_patient:
                # For MCI patients - get from MCI_OP_Patient_Appointment_With_Multiple_Doctor
                multiple_doctor_entry = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id=patient
                ).select_related('PrimaryDoctor', 'Specialization').first()
            else:
                # For regular patients - get from OP_Patient_Appointment_With_Multiple_Doctor
                multiple_doctor_entry = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id=patient
                ).select_related('PrimaryDoctor', 'Specialization').first()
            
            if multiple_doctor_entry:
                if multiple_doctor_entry.PrimaryDoctor:
                    doctor_name = f"Dr. {multiple_doctor_entry.PrimaryDoctor.First_Name}"
                if multiple_doctor_entry.Specialization:
                    specialization = multiple_doctor_entry.Specialization.Speciality_Name
                    
        except Exception as e:
            print(f"Error getting multiple doctor entry for patient {patient.id if hasattr(patient, 'id') else 'N/A'}: {e}")
        
        # Fallback: Check direct DoctorId in patient registration
        if not doctor_name and hasattr(patient, 'DoctorId') and patient.DoctorId:
            doctor_name = f"Dr. {patient.DoctorId.First_Name}"
    
    # Final fallback: Use the requesting doctor from radiology request
    if not doctor_name and hasattr(rad_request, 'Doctorid') and rad_request.Doctorid:
        doctor_name = f"Dr. {rad_request.Doctorid.First_Name}"
    
    return specialization, doctor_name



@csrf_exempt
@require_http_methods(["GET"])
def Radiology_Data_Summarys(request):
    if request.method == "GET":
        try:
            location = request.GET.get("Location")
            limit = request.GET.get("limit")
            offset = request.GET.get("offset")
            test = request.GET.get("testName") or ""
            date = request.GET.get("date")
            dateType = request.GET.get("dateType")
            patientType = request.GET.get("patient")
            method = request.GET.get("testType")
            fromm = request.GET.get("from")
            to = request.GET.get("to")
            patient = request.GET.get("patientName")
            department = request.GET.get('dept')
            BatMan = request.GET.get('batman')
            BatMant = True if BatMan == 'true' else False

            dep_name = RadiologyNames_Details.objects.all()
            departments_list = [
                {
                    "dept_name": dep.Radiology_Name,
                    "dept_code": dep.Radiology_Id,
                    "ipcount": 0,
                    "opcount": 0
                }
                for dep in dep_name
            ]

            print("I AM BatMan -", BatMant)
            
            # Build filters
            filters = Q()
            
            # Date filters
            if dateType and dateType != "":
                if dateType == "month":
                    year, month = map(int, date.split("-"))
                    filters &= Q(created_at__year=year, created_at__month=month)
                    
                elif dateType == "date":
                    _date = datetime.strptime(date, "%Y-%m-%d").date()
                    filters &= Q(created_at__date=_date)
                    
                elif dateType == "customdate":
                    if fromm and to and fromm != "" and to != "":
                        from_date = datetime.strptime(fromm, "%Y-%m-%d").date()
                        to_date = datetime.strptime(to, "%Y-%m-%d").date()
                        filters &= Q(created_at__date__range=[from_date, to_date])
                        
                elif dateType == "custommonth":
                    if fromm and to:
                        from_date = datetime.strptime(fromm, "%Y-%m").replace(day=1)
                        to_date = datetime.strptime(to, "%Y-%m").replace(day=1)
                        last_day = (to_date + relativedelta(months=1)) - relativedelta(days=1)
                        to_datetime = datetime.combine(last_day, datetime.max.time())
                        filters &= Q(created_at__range=[from_date, to_datetime])
        
            # Patient type filter
            if patientType and patientType != "All" and patientType != "":
                if patientType == "OP":
                    filters &= Q(OP_Register_Id__isnull=False)
                else:
                    filters &= Q(IP_Register_Id__isnull=False)

            # Patient name/ID filter
            if patient and patient != "":
                patient_filter = ( 
                    Q(OP_Register_Id__PatientId__PatientId__icontains=patient) |
                    Q(IP_Register_Id__PatientId__PatientId__icontains=patient) |
                    Q(OP_Register_Id__PatientId__FirstName__icontains=patient) |
                    Q(IP_Register_Id__PatientId__FirstName__icontains=patient) |
                    Q(OP_Register_Id__Registration_Id__icontains=patient) |
                    Q(IP_Register_Id__Registration_Id__icontains=patient))
                filters &= patient_filter

            # Test filter
            if test and test != "":
                filters &= Q(SubTestCode=test)

            # Department filter
            if department and department != "":
                filters &= Q(TestCode=department)

            exclude_codes = [
                'TSTCODE0222', 'TSTCODE0183', 'TSTCODE0179', 'TSTCODE0032', 'TSTCODE0033', 
                'TSTCODE0184', 'TSTCODE0195', 'TSTCODE0208', 'TSTCODE0210', 'TSTCODE0206', 
                'TSTCODE0032', 'TSTCODE0076'
            ]

            # Query based on BatMan flag
            if BatMant:
                if method and method == "Patient":
                    # Regular patients only
                    lab_rq = Radiology_Request_Details.objects.exclude(Status='Canceled')\
                        .exclude(
                        SubTestCode__in=exclude_codes
                            )\
                        .filter(filters)\
                        .select_related(
                            'OP_Register_Id__PatientId__Title',
                            'OP_Register_Id__DoctorId',
                            'IP_Register_Id__PatientId__Title',
                            'IP_Register_Id__Specialization',
                            'IP_Register_Id__PrimaryDoctor',
                            'Doctorid'
                        )\
                        .order_by('-created_at')
                elif method and method == "PatientS":
                    # MCI patients only
                    lab_rq = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled')\
                        .exclude(
                        SubTestCode__in=exclude_codes
                            )\
                        .filter(filters)\
                        .select_related(
                            'OP_Register_Id__PatientId__Title',
                            'OP_Register_Id__DoctorId',
                            'IP_Register_Id__PatientId__Title',
                            'IP_Register_Id__Specialization',
                            'IP_Register_Id__PrimaryDoctor',
                            'Doctorid'
                        )\
                        .order_by('-created_at')
                else:
                    # Both regular and MCI patients
                    qs1 = Radiology_Request_Details.objects.exclude(Status='Canceled')\
                        .exclude(
                        SubTestCode__in=exclude_codes
                            )\
                        .filter(filters)\
                        .select_related(
                            'OP_Register_Id__PatientId__Title',
                            'OP_Register_Id__DoctorId',
                            'IP_Register_Id__PatientId__Title',
                            'IP_Register_Id__Specialization',
                            'IP_Register_Id__PrimaryDoctor',
                            'Doctorid'
                        )
                    qs2 = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled')\
                        .exclude(
                        SubTestCode__in=exclude_codes
                            )\
                        .filter(filters)\
                        .select_related(
                            'OP_Register_Id__PatientId__Title',
                            'OP_Register_Id__DoctorId',
                            'IP_Register_Id__PatientId__Title',
                            'IP_Register_Id__Specialization',
                            'IP_Register_Id__PrimaryDoctor',
                            'Doctorid'
                        )
                    # Convert to list and sort by date (newest first)
                    qs1_list = list(qs1)
                    qs2_list = list(qs2)
                    lab_rq = qs1_list + qs2_list
                    lab_rq.sort(key=lambda x: x.created_at, reverse=True)
            else:
                # Combine both querysets (normal mode)
                qs1 = Radiology_Request_Details.objects.exclude(Status='Canceled')\
                    .exclude(
                        SubTestCode__in=exclude_codes
                            )\
                    .filter(filters)\
                    .select_related(
                        'OP_Register_Id__PatientId__Title',
                        'OP_Register_Id__DoctorId',
                        'IP_Register_Id__PatientId__Title',
                        'IP_Register_Id__Specialization',
                        'IP_Register_Id__PrimaryDoctor',
                        'Doctorid'
                    )
                qs2 = MCI_Radiology_Request_Details.objects.exclude(Status='Canceled')\
                    .exclude(
                        SubTestCode__in=exclude_codes
                            )\
                    .filter(filters)\
                    .select_related(
                        'OP_Register_Id__PatientId__Title',
                        'OP_Register_Id__DoctorId',
                        'IP_Register_Id__PatientId__Title',
                        'IP_Register_Id__Specialization',
                        'IP_Register_Id__PrimaryDoctor',
                        'Doctorid'
                    )
                # Convert to list and sort by date (newest first)
                qs1_list = list(qs1)
                qs2_list = list(qs2)
                lab_rq = qs1_list + qs2_list
                lab_rq.sort(key=lambda x: x.created_at, reverse=True)
            
            print(f"Total records found: {len(lab_rq)}")
            
            # Prefetch MCI doctor entries for better performance
            mci_op_ids = []
            for lab in lab_rq:
                if hasattr(lab, 'OP_Register_Id') and lab.OP_Register_Id and \
                   isinstance(lab.OP_Register_Id, MCI_Patient_Appointment_Registration_Detials):
                    mci_op_ids.append(lab.OP_Register_Id.id)
            
            mci_doctor_entries = {}
            if mci_op_ids:
                entries = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id_id__in=mci_op_ids
                ).select_related('Specialization', 'PrimaryDoctor')
                for entry in entries:
                    mci_doctor_entries[entry.Registration_Id_id] = entry
            
            # Prefetch regular doctor entries
            regular_op_ids = []
            for lab in lab_rq:
                if hasattr(lab, 'OP_Register_Id') and lab.OP_Register_Id and \
                   not isinstance(lab.OP_Register_Id, MCI_Patient_Appointment_Registration_Detials):
                    regular_op_ids.append(lab.OP_Register_Id.id)
            
            regular_doctor_entries = {}
            if regular_op_ids:
                entries = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                    Registration_Id_id__in=regular_op_ids
                ).select_related('Specialization', 'PrimaryDoctor')
                for entry in entries:
                    regular_doctor_entries[entry.Registration_Id_id] = entry
            
            Report = []
            no = 0
            ip_count = 0
            op_count = 0
            
            # Process each radiology request
            for lab in lab_rq:
                no += 1
                try:
                    # Get patient type and basic info
                    if lab.IP_Register_Id:
                        ip_count += 1
                        patient_type = "IP"
                        patient = lab.IP_Register_Id
                        registration_id = patient.Registration_Id if patient and hasattr(patient, 'Registration_Id') else ""
                    elif lab.OP_Register_Id:
                        op_count += 1
                        patient_type = "OP"
                        patient = lab.OP_Register_Id
                        registration_id = patient.Registration_Id if patient and hasattr(patient, 'Registration_Id') else ""
                    else:
                        patient_type = "General"
                        patient = None
                        registration_id = ""
                    
                    # Get specialization and doctor info
                    specialization = None
                    doctor_name = None
                    
                    # Check if it's an IP patient
                    if lab.IP_Register_Id:
                        patient = lab.IP_Register_Id
                        if hasattr(patient, 'Specialization') and patient.Specialization:
                            specialization = patient.Specialization.Speciality_Name
                        if hasattr(patient, 'PrimaryDoctor') and patient.PrimaryDoctor:
                            doctor_name = f"Dr. {patient.PrimaryDoctor.First_Name}"
                    
                    # Check if it's an OP patient
                    elif lab.OP_Register_Id and lab.OP_Register_Id_id:
                        patient = lab.OP_Register_Id
                        patient_id = patient.id
                        
                        # Check if it's an MCI patient
                        is_mci_patient = isinstance(patient, MCI_Patient_Appointment_Registration_Detials)
                        
                        if is_mci_patient:
                            # Get from MCI doctor entries cache
                            entry = mci_doctor_entries.get(patient_id)
                        else:
                            # Get from regular doctor entries cache
                            entry = regular_doctor_entries.get(patient_id)
                        
                        if entry:
                            if entry.PrimaryDoctor:
                                doctor_name = f"Dr. {entry.PrimaryDoctor.First_Name}"
                            if entry.Specialization:
                                specialization = entry.Specialization.Speciality_Name
                        
                        # Fallback: Check direct DoctorId
                        if not doctor_name and hasattr(patient, 'DoctorId') and patient.DoctorId:
                            doctor_name = f"Dr. {patient.DoctorId.First_Name}"
                    
                    # Final fallback: Use requesting doctor
                    if not doctor_name and hasattr(lab, 'Doctorid') and lab.Doctorid:
                        doctor_name = f"Dr. {lab.Doctorid.First_Name}"
                    
                    # Get department and test names
                    dept_name = ""
                    test_name = ""
                    
                    if hasattr(lab, 'TestCode') and lab.TestCode:
                        try:
                            dept_obj = RadiologyNames_Details.objects.get(Radiology_Id=lab.TestCode)
                            dept_name = dept_obj.Radiology_Name
                            
                            # Update department counts
                            for dept in departments_list:
                                if dept["dept_code"] == lab.TestCode or dept["dept_name"] == dept_name:
                                    if lab.OP_Register_Id:
                                        dept["opcount"] += 1
                                    elif lab.IP_Register_Id:
                                        dept["ipcount"] += 1
                                    break
                        except RadiologyNames_Details.DoesNotExist:
                            dept_name = lab.TestCode
                        except Exception as e:
                            print(f"Error getting department for TestCode {lab.TestCode}: {e}")
                            dept_name = lab.TestCode
                    
                    if hasattr(lab, 'SubTestCode') and lab.SubTestCode:
                        try:
                            test_obj = TestName_Details.objects.get(Test_Code=lab.SubTestCode)
                            test_name = test_obj.Test_Name
                        except TestName_Details.DoesNotExist:
                            test_name = lab.SubTestCode
                        except Exception as e:
                            print(f"Error getting test name for SubTestCode {lab.SubTestCode}: {e}")
                            test_name = lab.SubTestCode
                    
                    # Prepare patient info
                    patient_info = {}
                    if patient and hasattr(patient, 'PatientId') and patient.PatientId:
                        # Handle Title safely
                        title_name = ""
                        try:
                            if hasattr(patient.PatientId, 'Title') and patient.PatientId.Title:
                                title_name = patient.PatientId.Title.Title_Name
                        except Exception:
                            pass
                        
                        patient_info = {
                            "patientid": patient.PatientId.PatientId if hasattr(patient.PatientId, 'PatientId') else "",
                            "patientName": f"{title_name}. {patient.PatientId.FirstName}" if title_name else patient.PatientId.FirstName,
                            "Phone": patient.PatientId.PhoneNo if hasattr(patient.PatientId, 'PhoneNo') else "",
                            'Age': patient.PatientId.Age if hasattr(patient.PatientId, 'Age') else "",
                            'Gender': patient.PatientId.Gender if hasattr(patient.PatientId, 'Gender') else "",
                        }
                    else:
                        patient_info = {
                            "patientid": "",
                            "patientName": "",
                            "Phone": "",
                            'Age': "",
                            'Gender': "",
                        }
                    
                    # Append to report - ALL DATA, no pagination
                    Report.append({
                        "Sno": no,
                        "date": lab.created_at.strftime("%d-%m-%y") if lab.created_at else None,
                        "CreatedAt": lab.created_at.strftime("%d-%m-%Y %H:%M:%S") if lab.created_at else "",
                        "request": lab.Radiology_RequestId if hasattr(lab, 'Radiology_RequestId') else "", 
                        "patientType": patient_type, 
                        "registrationId": registration_id,
                        "patientid": patient_info["patientid"],
                        "patientName": patient_info["patientName"],
                        "Phone": patient_info["Phone"],
                        'Age': patient_info["Age"],
                        'Gender': patient_info["Gender"],
                        'test': test_name,
                        'dept': dept_name,
                        'specialization': specialization or "",
                        'doctor': doctor_name or "",
                        'status': lab.Status if hasattr(lab, 'Status') else "",
                        'service_status': lab.Service_Status if hasattr(lab, 'Service_Status') else "",
                        'reason': lab.Reason if hasattr(lab, 'Reason') else "",
                        'Testcode' : lab.SubTestCode
                    })
                    
                except Exception as e:
                    print(f"Error processing record {no}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            # Get specialization statistics
            specialization_stats = {}
            for item in Report:
                spec = item.get('specialization', 'Not Specified')
                if spec not in specialization_stats:
                    specialization_stats[spec] = {"OP": 0, "IP": 0, "Total": 0}
                
                if item.get('patientType') == 'OP':
                    specialization_stats[spec]["OP"] += 1
                elif item.get('patientType') == 'IP':
                    specialization_stats[spec]["IP"] += 1
                specialization_stats[spec]["Total"] += 1
            
            # Convert to list for easier consumption
            specialization_list = [
                {
                    "specialization": spec,
                    "op_count": stats["OP"],
                    "ip_count": stats["IP"],
                    "total_count": stats["Total"]
                }
                for spec, stats in specialization_stats.items()
            ]
            
            return JsonResponse({
                "success": True,
                "total_records": len(Report),
                "OP_records": op_count,
                "IP_records": ip_count,
                "test_data": Report,  # Returning ALL data, not paginated
                "deptData": departments_list,
                "specialization_stats": specialization_list,
                "message": f"Returning all {len(Report)} records"
            }, safe=False)
        
        except Exception as err:
            print("Error in Radiology_Data_Summarys:", err)
            import traceback
            traceback.print_exc()
            return JsonResponse({
                "success": False,
                "error": str(err)
            }, status=500)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from OutPatient.models import Radiology_Request_Details


@csrf_exempt
@require_http_methods(["POST"])
def delete_patienttest(request):
    try:
        data = json.loads(request.body)

        print(data,'data:::::::::::::::::')
        radiology_request_id = data.get("Radiology_RequestId")
        canceled_by = data.get("Canceledby", "system")
        print(radiology_request_id,"hiiiiiiiiiiiiiiiii")

        if not radiology_request_id:
            return JsonResponse({
                "status": "error",
                "message": "Radiology_RequestId is required"
            }, status=400)

        obj = Radiology_Request_Details.objects.get(
            Radiology_RequestId=radiology_request_id
        )

        # ❌ Prevent cancelling completed reports
        if obj.Service_Status == "Completed":
            return JsonResponse({
                "status": "error",
                "message": "Completed reports cannot be cancelled"
            }, status=403)

        # ✅ Soft delete (Cancel)
        obj.Status = "Canceled"
        obj.Canceledby = canceled_by
        obj.save(update_fields=["Status", "Canceledby"])

        return JsonResponse({
            "status": "success",
            "message": "Radiology request cancelled successfully"
        })

    except Radiology_Request_Details.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Record not found"
        }, status=404)

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)

# //------------------------this is for delete function in radiology dummy -------


@csrf_exempt
@require_http_methods(["POST"])
def delete_mci_radiology_request(request):
    try:
        data = json.loads(request.body)

        print(data,'data:::::::::::::::::')
        radiology_request_id = data.get("Radiology_RequestId")
        canceled_by = data.get("Canceledby", "system")
        print(radiology_request_id,"hiiiiiiiiiiiiiiiii")

        if not radiology_request_id:
            return JsonResponse({
                "status": "error",
                "message": "Radiology_RequestId is required"
            }, status=400)

        obj = MCI_Radiology_Request_Details.objects.get(
            Radiology_RequestId=radiology_request_id
        )

        # ❌ Prevent cancelling completed reports
        if obj.Service_Status == "Completed":
            return JsonResponse({
                "status": "error",
                "message": "Completed reports cannot be cancelled"
            }, status=403)

        # ✅ Soft delete (Cancel)
        obj.Status = "Canceled"
        obj.Canceledby = canceled_by
        obj.save(update_fields=["Status", "Canceledby"])

        return JsonResponse({
            "status": "success",
            "message": "Radiology request cancelled successfully"
        })

    except MCI_Radiology_Request_Details.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Record not found"
        }, status=404)

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)







from datetime import datetime
@csrf_exempt
@require_http_methods(["POST"])
def Notify_Critical_patienttest(request):
    try:
        data = json.loads(request.body)

        print(data,'data:::::::::::::::::')
        radiology_request_id = data.get("Radiology_RequestId")
        canceled_by = data.get("Canceledby", "system")
        print(radiology_request_id,"hiiiiiiiiiiiiiiiii")

        if not radiology_request_id:
            return JsonResponse({
                "status": "error",
                "message": "Radiology_RequestId is required"
            }, status=400)

        obj = Radiology_Request_Details.objects.get(
            Radiology_RequestId=radiology_request_id
        )

        # ❌ Prevent cancelling completed reports
        if obj.Service_Status == "Completed":
            return JsonResponse({
                "status": "error",
                "message": "Completed reports cannot be cancelled"
            }, status=403)

        obj.IsCritical = True
        obj.CriticalIntimateDate = datetime.now().date()
        obj.save(update_fields=["IsCritical", "CriticalIntimateDate"])

        return JsonResponse({
            "status": "success",
            "message": "Radiology request Notified successfully"
        })

    except Radiology_Request_Details.DoesNotExist:
        return JsonResponse({
            "status": "error",
            "message": "Record not found"
        }, status=404)

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)




# import base64
# import io
# import fitz  # PyMuPDF
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from reportlab.pdfgen import canvas
# from reportlab.lib.pagesizes import A4
# from pypdf import PdfReader, PdfWriter

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_original_patient_report_for_dummy_link(request):
#     try:
#         # 1. Get Params
#         test_code = request.GET.get('Testcode', '')
#         patient_name = request.GET.get('patientName', '')
#         age = request.GET.get('Age', '')
#         gender = request.GET.get('Gender', '')
#         patient_id = request.GET.get('patientid', '')
#         date = request.GET.get('date', '')
#         ref_dr = request.GET.get('RefDr', 'Self')

#         # 2. Fetch Report (Mocked for logic flow)
#         prevtest = Radiology_Request_Details.objects.filter(SubTestCode=test_code).last()
#         if not prevtest: return JsonResponse([], safe=False)
        
#         prevreport = Radiology_Complete_Details.objects.filter(
#             Radiology_RequestId__Radiology_RequestId=prevtest.Radiology_RequestId
#         ).first()
        
#         if not prevreport or not prevreport.content:
#             return JsonResponse([], safe=False)

#         # 3. Process PDF with PyMuPDF (fitz)
#         doc = fitz.open(stream=io.BytesIO(prevreport.content), filetype="pdf")
#         page = doc[0]
        
#         # Keywords to identify the patient info table/section
#         keywords = ['Name', 'Patient', 'Age', 'Gender', 'ID', 'Date', 'Dr.']
        
#         # Find all occurrences of these keywords to define the "Danger Zone"
#         matching_rects = []
#         for kw in keywords:
#             inst = page.search_for(kw)
#             matching_rects.extend(inst)

#         if matching_rects:
#             # Create a bounding box around all found keywords in the top half of the page
#             # We filter for y < 300 to avoid accidentally redacting the report body
#             top_rects = [r for r in matching_rects if r.y1 < 300]
            
#             if top_rects:
#                 # Calculate the union of all rects to find the table area
#                 area_x0 = min([r.x0 for r in top_rects]) - 20
#                 area_y0 = min([r.y0 for r in top_rects]) - 20
#                 area_x1 = max([r.x1 for r in top_rects]) + 250 # Extended for values next to labels
#                 area_y1 = max([r.y1 for r in top_rects]) + 10
                
#                 # Apply Redaction (This removes text AND table lines)
#                 target_rect = fitz.Rect(area_x0, area_y0, area_x1, area_y1)
#                 page.add_redact_annot(target_rect, fill=(1, 1, 1)) # White fill
#                 page.apply_redactions()
                
#                 new_info_y_start = area_y0 + 20 # Position to start drawing new info
#             else:
#                 new_info_y_start = 100
#         else:
#             new_info_y_start = 100

#         # 4. Generate Overlay with ReportLab
#         overlay_stream = io.BytesIO()
#         c = canvas.Canvas(overlay_stream, pagesize=A4)
#         pdf_height = A4[1]
        
#         # Convert fitz Y (top-down) to ReportLab Y (bottom-up)
#         rl_y = pdf_height - new_info_y_start
        
#         # Header
#         c.setFont("Helvetica-Bold", 12)
#         c.drawString(50, rl_y, "")
        
#         # Table-like Layout for New Info
#         c.setFont("Helvetica-Bold", 9)
#         # Row 1
#         c.drawString(50, rl_y - 25, f"Patient Name: {patient_name}")
#         c.drawString(300, rl_y - 25, f"Patient ID: {patient_id}")
#         # Row 2
#         c.drawString(50, rl_y - 40, f"Age / Gender: {age} / {gender}")
#         c.drawString(300, rl_y - 40, f"Ref. Dr.: {ref_dr}")
#         # Row 3
#         c.drawString(50, rl_y - 55, f"Date: {date}")
#         c.drawString(300, rl_y - 55, f"Test Code: {test_code}")
        
#         c.line(50, rl_y - 65, 550, rl_y - 65)
#         c.save()

#         # 5. Merge and Output
#         # Save PyMuPDF doc to a buffer first
#         cleaned_pdf_buffer = io.BytesIO()
#         doc.save(cleaned_pdf_buffer)
#         doc.close()
#         cleaned_pdf_buffer.seek(0)

#         reader = PdfReader(cleaned_pdf_buffer)
#         overlay_reader = PdfReader(io.BytesIO(overlay_stream.getvalue()))
#         writer = PdfWriter()

#         first_page = reader.pages[0]
#         first_page.merge_page(overlay_reader.pages[0])
#         writer.add_page(first_page)

#         for p in range(1, len(reader.pages)):
#             writer.add_page(reader.pages[p])

#         final_buffer = io.BytesIO()
#         writer.write(final_buffer)
        
#         file_base64 = base64.b64encode(final_buffer.getvalue()).decode("utf-8")
#         return JsonResponse([{"File": f"data:application/pdf;base64,{file_base64}"}], safe=False)

#     except Exception as e:
#         import traceback
#         return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=500)




# import base64
# import io
# import fitz  # PyMuPDF
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from reportlab.pdfgen import canvas
# from reportlab.lib.pagesizes import A4
# from pypdf import PdfReader, PdfWriter

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_original_patient_report_for_dummy_link(request):
#     try:
#         # 1. Get Params
#         test_code = request.GET.get('Testcode', '')
#         patient_name = request.GET.get('patientName', '')
#         age = request.GET.get('Age', '')
#         gender = request.GET.get('Gender', '')
#         patient_id = request.GET.get('patientid', '')
#         date = request.GET.get('date', '')
#         ref_dr = request.GET.get('RefDr', 'Self')

#         # 2. Fetch Report (Mocked for logic flow)
#         prevtest = Radiology_Request_Details.objects.filter(SubTestCode=test_code).last()
#         if not prevtest: return JsonResponse([], safe=False)
        
#         prevreport = Radiology_Complete_Details.objects.filter(
#             Radiology_RequestId__Radiology_RequestId=prevtest.Radiology_RequestId
#         ).first()
        
#         if not prevreport or not prevreport.content:
#             return JsonResponse([], safe=False)

#         # 3. Process PDF with PyMuPDF (fitz) to find area only (no redaction here)
#         doc = fitz.open(stream=io.BytesIO(prevreport.content), filetype="pdf")
#         page = doc[0]
#         pdf_height = page.rect.height  # Typically 842 for A4
        
#         # Expanded keywords to better capture table labels and common fragments
#         keywords = ['Name', 'Patient', 'Age', 'Gender', 'ID', 'Date', 'Dr.', 'Ref.', 'Test', 'Code', ' / ', 'Y,', 'yrs', 'Male', 'Female']
        
#         # Find all occurrences of these keywords
#         matching_rects = []
#         for kw in keywords:
#             inst = page.search_for(kw)
#             matching_rects.extend(inst)
        
#         if matching_rects:
#             # Filter for top section (y1 < 300 to avoid body)
#             top_rects = [r for r in matching_rects if r.y1 < 300]
            
#             if top_rects:
#                 # Calculate bounding box with extra padding
#                 area_x0 = min([r.x0 for r in top_rects]) - 30
#                 area_y0 = min([r.y0 for r in top_rects]) - 30
#                 area_x1 = max([r.x1 for r in top_rects]) + 300  # Extended width for right-column values
#                 area_y1 = max([r.y1 for r in top_rects]) + 50   # Extended height for bottom lines
                
#                 # Ensure minimum cover height (e.g., for full table)
#                 min_height = 150
#                 if area_y1 - area_y0 < min_height:
#                     area_y1 = area_y0 + min_height
                
#                 # Convert to ReportLab coordinates (bottom-up)
#                 cover_y0 = pdf_height - area_y1
#                 cover_height = area_y1 - area_y0
#                 new_info_y_start = pdf_height - area_y0 - 20  # Start new info near top of covered area
#             else:
#                 cover_y0 = pdf_height - 150
#                 cover_height = 150
#                 new_info_y_start = pdf_height - 20
#         else:
#             # Fallback: Cover top 150pt if no keywords found
#             cover_y0 = pdf_height - 150
#             cover_height = 150
#             new_info_y_start = pdf_height - 20
        
#         doc.close()

#         # 4. Generate Overlay with ReportLab (cover area + new info)
#         overlay_stream = io.BytesIO()
#         c = canvas.Canvas(overlay_stream, pagesize=A4)
        
#         # Cover the area with white rectangle (hides text AND lines)
#         c.setFillColorRGB(1, 1, 1)
#         c.rect(area_x0, cover_y0, area_x1 - area_x0, cover_height, fill=1, stroke=0)
        
#         # Add new patient info in table-like layout
#         c.setFillColorRGB(0, 0, 0)
#         c.setFont("Helvetica-Bold", 9)
#         # Row 1
#         c.drawString(area_x0 + 20, new_info_y_start - 25, f"Patient Name: {patient_name}")
#         c.drawString(area_x0 + 270, new_info_y_start - 25, f"Patient ID: {patient_id}")
#         # Row 2
#         c.drawString(area_x0 + 20, new_info_y_start - 40, f"Age / Gender: {age} / {gender}")
#         c.drawString(area_x0 + 270, new_info_y_start - 40, f"Ref. Dr.: {ref_dr}")
#         # Row 3
#         c.drawString(area_x0 + 20, new_info_y_start - 55, f"Date: {date}")
#         c.drawString(area_x0 + 270, new_info_y_start - 55, f"Test Code: {test_code}")
        
#         # Redraw separator line
#         c.setStrokeColorRGB(0, 0, 0)
#         c.line(area_x0 + 10, new_info_y_start - 65, area_x1 - 10, new_info_y_start - 65)
        
#         c.save()

#         # 5. Merge and Output
#         original_pdf_stream = io.BytesIO(prevreport.content)
#         reader = PdfReader(original_pdf_stream)
#         overlay_reader = PdfReader(io.BytesIO(overlay_stream.getvalue()))
#         writer = PdfWriter()
        
#         first_page = reader.pages[0]
#         first_page.merge_page(overlay_reader.pages[0])
#         writer.add_page(first_page)
        
#         for p in range(1, len(reader.pages)):
#             writer.add_page(reader.pages[p])
        
#         final_buffer = io.BytesIO()
#         writer.write(final_buffer)
        
#         file_base64 = base64.b64encode(final_buffer.getvalue()).decode("utf-8")
#         return JsonResponse([{"File": f"data:application/pdf;base64,{file_base64}"}], safe=False)
    
#     except Exception as e:
#         import traceback
#         return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=500)




# import base64
# import io
# import fitz  # PyMuPDF
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from reportlab.pdfgen import canvas
# from reportlab.lib.pagesizes import A4
# from pypdf import PdfReader, PdfWriter

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_original_patient_report_for_dummy_link(request):
#     try:
#         # 1. Get Params
#         test_code = request.GET.get('Testcode', '')
#         patient_name = request.GET.get('patientName', '')
#         age = request.GET.get('Age', '')
#         gender = request.GET.get('Gender', '')
#         patient_id = request.GET.get('patientid', '')
#         date = request.GET.get('date', '')
#         ref_dr = request.GET.get('RefDr', 'Self')

#         # 2. Fetch Report
#         prevtest = Radiology_Request_Details.objects.filter(SubTestCode=test_code).last()
#         if not prevtest: return JsonResponse([], safe=False)
        
#         prevreport = Radiology_Complete_Details.objects.filter(
#             Radiology_RequestId__Radiology_RequestId=prevtest.Radiology_RequestId
#         ).first()
        
#         if not prevreport or not prevreport.content:
#             return JsonResponse([], safe=False)

#         # 3. Process PDF with PyMuPDF (fitz)
#         doc = fitz.open(stream=io.BytesIO(prevreport.content), filetype="pdf")
#         page = doc[0]
        
#         # Keywords to identify the BOTTOM of the patient info section
#         # We only care about finding where the info ENDS.
#         keywords = ['Test Code', 'Ref. Dr', 'Date:', 'Patient ID']
        
#         found_bottoms = []
#         for kw in keywords:
#             inst = page.search_for(kw)
#             for rect in inst:
#                 found_bottoms.append(rect.y1) # Collect the bottom Y coordinate of all keys

#         if found_bottoms:
#             # Find the lowest point of the patient info text
#             max_y = max(found_bottoms)
            
#             # DEFINE REDACTION AREA
#             # x0 = 0 (Left edge)
#             # y0 = 0 (Top edge - Removes FABER LLP logo)
#             # x1 = page.rect.width (Right edge - Removes all horizontal lines/grids)
#             # y1 = max_y + 10 (Just below the last piece of info)
            
#             # Safety check: Don't go too deep into the page (e.g. into Findings)
#             safe_y1 = min(max_y + 20, 300) 
            
#             target_rect = fitz.Rect(0, 0, page.rect.width, safe_y1)
            
#             # Apply Redaction (White fill)
#             # This physically deletes lines, text, and images in this box
#             page.add_redact_annot(target_rect, fill=(1, 1, 1)) 
#             page.apply_redactions()
            
#             new_info_y_start = 20 # Start drawing new info near top
#         else:
#             # Fallback if OCR fails
#             target_rect = fitz.Rect(0, 0, page.rect.width, 250)
#             page.add_redact_annot(target_rect, fill=(1, 1, 1))
#             page.apply_redactions()
#             new_info_y_start = 20

#         # 4. Generate Overlay with ReportLab
#         overlay_stream = io.BytesIO()
#         c = canvas.Canvas(overlay_stream, pagesize=A4)
#         pdf_height = A4[1]
        
#         # ReportLab coordinates (Bottom-Up)
#         # We place text at the top area we just cleared
#         rl_y = pdf_height - 100 
        
#         # Header (New Branding)
#         # c.setFont("Helvetica-Bold", 14)
#         # c.drawString(50, rl_y + 30, "") 
        
#         # Table-like Layout for New Info
#         c.setFont("Helvetica-Bold", 10)
#         # Row 1
#         c.drawString(50, rl_y, f"Patient Name: {patient_name}")
#         c.drawString(320, rl_y, f"Patient ID: {patient_id}")
#         # Row 2
#         c.drawString(50, rl_y - 20, f"Age / Gender: {age} / {gender}")
#         c.drawString(320, rl_y - 20, f"Ref. Dr.: {ref_dr}")
#         # Row 3
#         c.drawString(50, rl_y - 40, f"Date: {date}")
#         c.drawString(320, rl_y - 40, f"Test Code: {test_code}")
        
#         # Draw a clean separator line
#         c.setLineWidth(1)
#         c.line(50, rl_y - 55, 550, rl_y - 55)
#         c.save()

#         # 5. Merge and Output
#         cleaned_pdf_buffer = io.BytesIO()
#         doc.save(cleaned_pdf_buffer)
#         doc.close()
#         cleaned_pdf_buffer.seek(0)

#         reader = PdfReader(cleaned_pdf_buffer)
#         overlay_reader = PdfReader(io.BytesIO(overlay_stream.getvalue()))
#         writer = PdfWriter()

#         first_page = reader.pages[0]
#         first_page.merge_page(overlay_reader.pages[0])
#         writer.add_page(first_page)

#         for p in range(1, len(reader.pages)):
#             writer.add_page(reader.pages[p])

#         final_buffer = io.BytesIO()
#         writer.write(final_buffer)
        
#         file_base64 = base64.b64encode(final_buffer.getvalue()).decode("utf-8")
#         return JsonResponse([{"File": f"data:application/pdf;base64,{file_base64}"}], safe=False)

#     except Exception as e:
#         import traceback
#         return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=500)





# import base64
# import io
# import fitz  # PyMuPDF
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from reportlab.pdfgen import canvas
# from reportlab.lib.pagesizes import A4
# from pypdf import PdfReader, PdfWriter

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_original_patient_report_for_dummy_link(request):
#     try:
#         # 1. Get Params
#         test_code = request.GET.get('Testcode', '')
#         patient_name = request.GET.get('patientName', '')
#         age = request.GET.get('Age', '')
#         gender = request.GET.get('Gender', '')
#         patient_id = request.GET.get('patientid', '')
#         date = request.GET.get('date', '')
#         ref_dr = request.GET.get('RefDr', 'Self')

#         # 2. Fetch Report
#         prevtest = Radiology_Request_Details.objects.filter(SubTestCode=test_code).last()
#         if not prevtest: 
#             return JsonResponse([], safe=False)
        
#         prevreport = Radiology_Complete_Details.objects.filter(
#             Radiology_RequestId__Radiology_RequestId=prevtest.Radiology_RequestId
#         ).first()
        
#         if not prevreport or not prevreport.content:
#             return JsonResponse([], safe=False)

#         # 3. Process PDF with PyMuPDF (fitz)
#         doc = fitz.open(stream=io.BytesIO(prevreport.content), filetype="pdf")
#         page = doc[0]
        
#         # Get page dimensions for reference
#         page_width = page.rect.width
#         page_height = page.rect.height
        
#         # DEBUG: Print page dimensions
#         print(f"Page dimensions: {page_width} x {page_height}")
        
#         # Strategy: Find where the patient info ends more precisely
#         # Look for specific markers in the patient info section
#         patient_info_markers = [
#             'Patient Name:', 'Name:', 
#             'Age:', 'Age / Gender:',
#             'Date:', 
#             'Patient ID:', 'ID:',
#             'Ref. Dr.:', 'Ref Dr:',
#             'Test Code:'
#         ]
        
#         # Find all instances of these markers
#         marker_rects = []
#         for marker in patient_info_markers:
#             instances = page.search_for(marker)
#             for rect in instances:
#                 marker_rects.append(rect)
        
#         if marker_rects:
#             # Find the lowest Y position of patient info
#             max_y = max([rect.y1 for rect in marker_rects])
            
#             # Also find the values after the markers (they might be lower)
#             # Search for common patient info patterns
#             text_blocks = page.get_text("blocks")
#             for block in text_blocks:
#                 if len(block) > 4:
#                     x0, y0, x1, y1, text = block[:5]
#                     # Check if this block looks like patient info values
#                     if y1 < 300:  # Only top area
#                         # Check for common patient value patterns
#                         if any(pattern in text for pattern in ['Mr.', 'Mrs.', 'Y,', 'M,', '/ Male', '/ Female', 'TSTCODE']):
#                             if y1 > max_y:
#                                 max_y = y1
            
#             # Add padding and create redaction area
#             redaction_top = 0
#             redaction_bottom = max_y + 25  # Add extra padding
            
#             print(f"Patient info bottom found at: {max_y}")
#             print(f"Redaction area: 0 to {redaction_bottom}")
            
#             # Create redaction rectangle
#             target_rect = fitz.Rect(0, redaction_top, page_width, redaction_bottom)
#             page.add_redact_annot(target_rect, fill=(1, 1, 1))
            
#             # Position for new info - start below redaction
#             new_info_y_start = redaction_bottom + 10
#         else:
#             # Fallback: Redact fixed top area
#             print("No markers found, using fallback")
#             target_rect = fitz.Rect(0, 0, page_width, 180)
#             page.add_redact_annot(target_rect, fill=(1, 1, 1))
#             new_info_y_start = 190
        
#         # Apply redactions
#         page.apply_redactions()
        
#         # 4. Generate Overlay with ReportLab - FIXED POSITIONING
#         overlay_stream = io.BytesIO()
#         c = canvas.Canvas(overlay_stream, pagesize=A4)
#         pdf_height = A4[1]
        
#         # FIX: Always place new patient info at a consistent position
#         # Use top of page (around y=750 in ReportLab coordinates)
#         rl_y = 750  # Fixed position near top
        
#         print(f"Placing new info at ReportLab Y: {rl_y}")
        
#         # Draw new patient info with proper formatting
#         c.setFont("Helvetica-Bold", 11)
        
#         # Column 1 - Left side (with proper width checking)
#         left_x = 50
#         right_x = 350  # Increased spacing for longer IDs
        
#         # Check if text will fit
#         name_text = f"Patient Name: {patient_name}"
#         if len(name_text) > 40:  # If name is too long
#             c.setFont("Helvetica-Bold", 10)  # Use smaller font
        
#         c.drawString(left_x, rl_y, name_text)
#         c.setFont("Helvetica-Bold", 11)  # Reset font
        
#         c.drawString(left_x, rl_y - 20, f"Age / Gender: {age} / {gender}")
#         c.drawString(left_x, rl_y - 40, f"Date: {date}")
        
#         # Column 2 - Right side
#         id_text = f"Patient ID: {patient_id}"
#         if len(id_text) > 30:
#             c.setFont("Helvetica-Bold", 10)
        
#         c.drawString(right_x, rl_y, id_text)
#         c.setFont("Helvetica-Bold", 11)
        
#         c.drawString(right_x, rl_y - 20, f"Ref. Dr.: {ref_dr}")
#         c.drawString(right_x, rl_y - 40, f"Test Code: {test_code}")
        
#         # Draw separator line
#         c.setLineWidth(0.5)
#         c.line(50, rl_y - 55, 550, rl_y - 55)
        
#         c.save()

#         # 5. Merge and Output
#         cleaned_pdf_buffer = io.BytesIO()
#         doc.save(cleaned_pdf_buffer)
#         doc.close()
#         cleaned_pdf_buffer.seek(0)

#         reader = PdfReader(cleaned_pdf_buffer)
#         overlay_reader = PdfReader(io.BytesIO(overlay_stream.getvalue()))
#         writer = PdfWriter()

#         first_page = reader.pages[0]
#         first_page.merge_page(overlay_reader.pages[0])
#         writer.add_page(first_page)

#         for p in range(1, len(reader.pages)):
#             writer.add_page(reader.pages[p])

#         final_buffer = io.BytesIO()
#         writer.write(final_buffer)
        
#         file_base64 = base64.b64encode(final_buffer.getvalue()).decode("utf-8")
#         return JsonResponse([{"File": f"data:application/pdf;base64,{file_base64}"}], safe=False)

#     except Exception as e:
#         import traceback
#         return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=500)

# import base64
# import io
# import fitz  # PyMuPDF
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from reportlab.pdfgen import canvas
# from reportlab.lib.pagesizes import A4
# from pypdf import PdfReader, PdfWriter

# @csrf_exempt
# @require_http_methods(["GET"])
# def get_original_patient_report_for_dummy_link(request):
#     try:
#         # 1. Get Params
#         test_code = request.GET.get('Testcode', '')
#         patient_name = request.GET.get('patientName', '')
#         age = request.GET.get('Age', '')
#         gender = request.GET.get('Gender', '')
#         patient_id = request.GET.get('patientid', '')
#         date = request.GET.get('date', '')
#         ref_dr = request.GET.get('RefDr', 'Self')

#         # 2. Fetch Report
#         prevtest = Radiology_Request_Details.objects.filter(SubTestCode=test_code).last()
#         if not prevtest: return JsonResponse([], safe=False)
        
#         prevreport = Radiology_Complete_Details.objects.filter(
#             Radiology_RequestId__Radiology_RequestId=prevtest.Radiology_RequestId
#         ).first()
        
#         if not prevreport or not prevreport.content:
#             return JsonResponse([], safe=False)

#         # 3. Process PDF with PyMuPDF (fitz)
#         doc = fitz.open(stream=io.BytesIO(prevreport.content), filetype="pdf")
#         page = doc[0]

#         # Expanded keywords to identify the BOTTOM of the patient info section
#         base_keywords = ['Test Code', 'Ref. Dr', 'Date', 'Patient ID', 'Age / Gender', 'Patient Name', 'Age', 'Gender', 'Pat. No', 'Ref. Consultant', 'OP No']

#         found_bottoms = []
#         for kw in base_keywords:
#             # Search for multiple case variations to handle case-sensitivity
#             variations = [kw, kw.lower(), kw.upper(), kw.title()]
#             for var in variations:
#                 inst = page.search_for(var)
#                 for rect in inst:
#                     found_bottoms.append(rect.y1)  # Collect the bottom Y coordinate

#         if found_bottoms:
#             # Find the lowest point of the patient info text
#             max_y = max(found_bottoms)
            
#             # DEFINE REDACTION AREA
#             # x0=0 (left), y0=0 (top, includes logo), x1=full width (covers horizontal lines), y1=below last info with padding
#             safe_y1 = min(max_y + 40, 350)  # Increased padding/max for lines
            
#             target_rect = fitz.Rect(0, 0, page.rect.width, safe_y1)
            
#             # Apply Redaction (White fill) - removes text, images, and intersecting paths/lines
#             page.add_redact_annot(target_rect, fill=(1, 1, 1))
#             page.apply_redactions()
            
#             new_info_y_start = 20  # Start drawing new info near top
#         else:
#             # Fallback if no matches (e.g., garbled text) - increased to 300pt
#             target_rect = fitz.Rect(0, 0, page.rect.width, 300)
#             page.add_redact_annot(target_rect, fill=(1, 1, 1))
#             page.apply_redactions()
#             new_info_y_start = 20

#         # 4. Generate Overlay with ReportLab
#         overlay_stream = io.BytesIO()
#         c = canvas.Canvas(overlay_stream, pagesize=A4)
#         pdf_height = A4[1]
        
#         # ReportLab coordinates (Bottom-Up)
#         # Place text at the top area we just cleared
#         rl_y = pdf_height - 100
        
#         # Header (New Branding) - uncomment and customize if needed
#         # c.setFont("Helvetica-Bold", 14)
#         # c.drawString(30, rl_y + 40, "FABER LLP")
        
#         # Table-like Layout for New Info - adjusted x for better left margin
#         c.setFont("Helvetica-Bold", 10)
#         # Row 1
#         c.drawString(30, rl_y, f"Patient Name: {patient_name}")
#         c.drawString(300, rl_y, f"Patient ID: {patient_id}")
#         # Row 2
#         c.drawString(30, rl_y - 20, f"Age / Gender: {age} / {gender}")
#         c.drawString(300, rl_y - 20, f"Ref. Dr.: {ref_dr}")
#         # Row 3
#         c.drawString(30, rl_y - 40, f"Date: {date}")
#         c.drawString(300, rl_y - 40, f"Test Code: {test_code}")
        
#         # Draw a clean separator line
#         c.setLineWidth(1)
#         c.line(30, rl_y - 55, 570, rl_y - 55)  # Extended width for full coverage
        
#         c.save()

#         # 5. Merge and Output
#         cleaned_pdf_buffer = io.BytesIO()
#         doc.save(cleaned_pdf_buffer)
#         doc.close()
#         cleaned_pdf_buffer.seek(0)
#         reader = PdfReader(cleaned_pdf_buffer)
#         overlay_reader = PdfReader(io.BytesIO(overlay_stream.getvalue()))
#         writer = PdfWriter()
#         first_page = reader.pages[0]
#         first_page.merge_page(overlay_reader.pages[0])
#         writer.add_page(first_page)
#         for p in range(1, len(reader.pages)):
#             writer.add_page(reader.pages[p])
#         final_buffer = io.BytesIO()
#         writer.write(final_buffer)
        
#         file_base64 = base64.b64encode(final_buffer.getvalue()).decode("utf-8")
#         return JsonResponse([{"File": f"data:application/pdf;base64,{file_base64}"}], safe=False)
    
#     except Exception as e:
#         import traceback
#         return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=500)




import base64
import io
import fitz  # PyMuPDF
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# NOTE: We do not need ReportLab or pypdf anymore.

@csrf_exempt
@require_http_methods(["GET"])
def get_original_patient_report_for_dummy_link(request):
    try:
        # 1. ---------------- GET PARAMS ----------------
        # Keeping your existing parameter logic
        test_code = request.GET.get('Testcode', '')
        patient_name = request.GET.get('patientName', '')
        age = request.GET.get('Age', '')
        gender = request.GET.get('Gender', '')
        patient_id = request.GET.get('patientid', '')
        date = request.GET.get('date', '')
        ref_dr = request.GET.get('doctor', 'Self')
        test = request.GET.get('test','')
        

        # 2. ---------------- FETCH DATA ----------------
        # (Mocking your DB calls - ensure these match your actual model names)
        prevtest = Radiology_Request_Details.objects.filter(SubTestCode=test_code).last()
        if not prevtest:
            return JsonResponse([], safe=False)

        prevreport = Radiology_Complete_Details.objects.filter(
            Radiology_RequestId__Radiology_RequestId=prevtest.Radiology_RequestId
        ).first()

        if not prevreport or not prevreport.content:
            return JsonResponse([], safe=False)

        # 3. ---------------- PROCESS PDF (ALL IN ONE PLACE) ----------------
        doc = fitz.open(stream=io.BytesIO(prevreport.content), filetype="pdf")
        page = doc[0]  # First page
        
        # --- STEP A: REDACTION (The "Wipe" Phase) ---
        # We define a fixed "Safe Zone" at the top. 
        # 280 units deep is usually safe to cover logos, old patient tables, and grid lines.
        # We use page.rect.width to ensure we cut lines extending to the far right edge.
        
        HEADER_HEIGHT = 280
        # Rect(x0, y0, x1, y1) -> Top-Left to Bottom-Right
        header_rect = fitz.Rect(0, 0, page.rect.width, HEADER_HEIGHT)
        
        # Apply the redaction (fills with white AND removes vector lines/images)
        page.add_redact_annot(header_rect, fill=(1, 1, 1))
        page.apply_redactions()
        
        # --- STEP B: INSERT NEW TEXT (The "Write" Phase) ---
        # We write directly using PyMuPDF coordinates (Top-Down).
        # y=50 is 50 units from the top, so it will ALWAYS be visible.
        
        start_y = 60
        col1_x = 50
        col2_x = 350
        font_size = 10
        # You can choose "helv" (Helvetica), "times", "courier", etc.
        font_name = "helv" 
        
        # (Optional) Header Title if you want one
        # page.insert_text((col1_x, start_y - 20), "PATIENT REPORT", fontsize=14, fontname="helv-bold", color=(0,0,0))

        # Row 1
        page.insert_text((col1_x, start_y), f"Patient Name: {patient_name}", fontsize=font_size, fontname=font_name)
        page.insert_text((col2_x, start_y), f"Patient ID: {patient_id}", fontsize=font_size, fontname=font_name)
        
        # Row 2
        page.insert_text((col1_x, start_y + 20), f"Age / Gender: {age} / {gender}", fontsize=font_size, fontname=font_name)
        page.insert_text((col2_x, start_y + 20), f"Ref. Dr.: {ref_dr}", fontsize=font_size, fontname=font_name)
        
        # Row 3
        # page.insert_text((col1_x, start_y + 40), f"Date: {date}", fontsize=font_size, fontname=font_name)
        page.insert_text((col2_x, start_y + 40), f"Date: {date} / {test}", fontsize=font_size, fontname=font_name)
        
        # --- STEP C: DRAW SEPARATOR LINE ---
        # Draw a line just below our new text to separate it from Findings
        line_y = start_y + 55
        shape = page.new_shape()
        shape.draw_line(fitz.Point(col1_x, line_y), fitz.Point(page.rect.width - 50, line_y))
        shape.finish(color=(0, 0, 0), width=1) # Black line, 1pt wide
        shape.commit()

        # 4. ---------------- OUTPUT RESPONSE ----------------
        output_stream = io.BytesIO()
        doc.save(output_stream)
        doc.close()
        
        file_base64 = base64.b64encode(output_stream.getvalue()).decode("utf-8")
        
        response_data = [{
            "File": f"data:application/pdf;base64,{file_base64}"
        }]
        
        return JsonResponse(response_data, safe=False)

    except Exception as e:
        import traceback
        return JsonResponse({"error": str(e), "traceback": traceback.format_exc()}, status=500)




 
