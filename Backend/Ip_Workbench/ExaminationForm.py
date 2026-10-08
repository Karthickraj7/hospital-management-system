import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.base import ContentFile
from django.utils import timezone
import json, base64

from .models import Casuality_ExaminationForm_Details
from Frontoffice.models import (
    Patient_Detials,
    Patient_Emergency_Registration_Detials,
    Employee_Personal_Form_Detials
)



@csrf_exempt
@require_http_methods(["POST"])
def Examination_form_Details_Link(request):
    try:
        body = json.loads(request.body.decode("utf-8"))

        print(body,'bodybodybody')

        # ---------- REQUIRED ----------
        patient_id = body.get("Patient_id")
        if not patient_id:
            return JsonResponse(
                {"success": False, "message": "Patient ID is required"},
                status=400
            )

        # ---------- PATIENT ----------
        patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
        if not patient:
            return JsonResponse(
                {"success": False, "message": "Invalid Patient ID"},
                status=404
            )

        # ---------- OPTIONAL ----------
        registration = None
        registration_id = body.get("Registration_id")
        if registration_id:
            registration = Patient_Emergency_Registration_Detials.objects.filter(
                id=registration_id
            ).first()

        employee = None
        employee_id = body.get("Employeeid")
        if employee_id:
            employee = Employee_Personal_Form_Detials.objects.filter(
                id=employee_id
            ).first()

        created_by = body.get("Created_by", "System")

        # ---------- IMAGE ----------
        image_file = None
        image_data = body.get("LocalExaminationImage")
        if image_data and image_data.startswith("data:image"):
            fmt, imgstr = image_data.split(";base64,")
            ext = fmt.split("/")[-1]
            image_file = ContentFile(
                base64.b64decode(imgstr),
                name=f"exam_{patient_id}_{int(timezone.now().timestamp())}.{ext}"
            )

        # ---------- CREATE ----------
        Casuality_ExaminationForm_Details.objects.create(
            Patient_id=patient,  # ✅ FIXED
            Casuality_Registration_Id=registration,
            Employeeid=employee,
            CreatedBy=created_by,

            POCUS=body.get("POCUS"),
            CCT=body.get("CCT"),
            PCT=body.get("PCT"),
            LOGROLL=body.get("LOGROLL"),
            Front=body.get("Front"),
            Back=body.get("Back"),
            ProvisionalDiagnosis=body.get("ProvisionalDiagnosis"),
            Investigation=body.get("Investigations"),
            LocalExaminationImage=image_file,
        )

        return JsonResponse(
            {"success": True, "message": "Saved Successfully"},
            status=201
        )

    except Exception as e:
        return JsonResponse(
            {"success": False, "message": str(e)},
            status=500
        )

def get_examination_forms(request, patient_id):
    try:
        records = Casuality_ExaminationForm_Details.objects.filter(
            Patient_id__PatientId=patient_id
        ).order_by("-CreatedDate")
 
        response = []
        for r in records:
            image_base64 = ""
 
            if r.LocalExaminationImage and r.LocalExaminationImage.name:
                image_path = r.LocalExaminationImage.path
                if os.path.exists(image_path):
                    with open(image_path, "rb") as img_file:
                        image_base64 = (
                            "data:image/png;base64," +
                            base64.b64encode(img_file.read()).decode("utf-8")
                        )
 
            response.append({
                "id": r.id,
                "CreatedDate": r.CreatedDate.isoformat() if r.CreatedDate else "",
                "POCUS": r.POCUS or "",
                "CCT": r.CCT or "",
                "PCT": r.PCT or "",
                "LOGROLL": r.LOGROLL or "",
                "Front": r.Front or "",
                "Back": r.Back or "",
                "ProvisionalDiagnosis": r.ProvisionalDiagnosis or "",
                "Investigations": r.Investigation or "",
                "LocalExaminationImage": image_base64,
            })
 
        return JsonResponse({"success": True, "data": response}, status=200)
 
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)

# def get_examination_forms(request, patient_id):
#     if request.method == "GET":
#         try:
#             records = Casuality_ExaminationForm_Details.objects.filter(
#                 Patient_id__PatientId=patient_id
#             ).order_by("-CreatedDate")

#             response = []
#             for r in records:

#                 image_base64 = ""
#                 if r.LocalExaminationImage:
#                     with open(r.LocalExaminationImage.path, "rb") as img_file:
#                         image_base64 = (
#                             "data:image/png;base64," +
#                             base64.b64encode(img_file.read()).decode("utf-8")
#                         )

#                 response.append({
#                     "id": r.id,
#                     "CreatedDate": r.CreatedDate.isoformat() if r.CreatedDate else "",
#                     "POCUS": r.POCUS or "",
#                     "CCT": r.CCT or "",
#                     "PCT": r.PCT or "",
#                     "LOGROLL": r.LOGROLL or "",
#                     "Front": r.Front or "",
#                     "Back": r.Back or "",
#                     "ProvisionalDiagnosis": r.ProvisionalDiagnosis or "",
#                     "Investigations": r.Investigation or "",
#                     "LocalExaminationImage": image_base64,  # ✅ FIX
#                 })

#             return JsonResponse({"success": True, "data": response}, status=200)

#         except Exception as e:
#             return JsonResponse({"success": False, "error": str(e)}, status=400)            

            
@csrf_exempt
@require_http_methods(["PATCH"])
def update_examination_forms(request, record_id):
    try:
        record = Casuality_ExaminationForm_Details.objects.get(id=record_id)

        body = json.loads(request.body.decode("utf-8"))
        form_data = body.get("formData", {})

        # ---------- IMAGE ----------
        image_data = body.get("LocalExaminationImage")
        if image_data and image_data.startswith("data:image"):
            fmt, imgstr = image_data.split(";base64,")
            ext = fmt.split("/")[-1]
            record.LocalExaminationImage = ContentFile(
                base64.b64decode(imgstr),
                name=f"exam_updated_{record_id}.{ext}"
            )

        # ---------- UPDATE FIELDS ----------
        for key, value in form_data.items():
            if hasattr(record, key):
                setattr(record, key, value if value != "" else None)

        # ---------- SPECIAL FIELD MAPPING ----------
        if "Investigations" in form_data:
            record.Investigation = form_data.get("Investigations")

        record.save()

        return JsonResponse(
            {"success": True, "message": "Updated Successfully"},
            status=200
        )

    except Casuality_ExaminationForm_Details.DoesNotExist:
        return JsonResponse(
            {"success": False, "message": "Record not found"},
            status=404
        )
    except Exception as e:
        return JsonResponse(
            {"success": False, "error": str(e)},
            status=400
        )


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_examination_form(request, record_id):
    try:
        record = Casuality_ExaminationForm_Details.objects.get(id=record_id)
        record.delete()
        return JsonResponse(
            {"success": True, "message": "Deleted successfully"},
            status=200
        )
    except Casuality_ExaminationForm_Details.DoesNotExist:
        return JsonResponse(
            {"success": False, "message": "Record not found"},
            status=404
        )
    except Exception as e:
        return JsonResponse(
            {"success": False, "error": str(e)},
            status=400
        )
