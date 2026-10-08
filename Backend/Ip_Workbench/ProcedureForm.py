from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from django.views.decorators.http import require_http_methods

from Ip_Workbench.models import Casuality_procedures_form_Details
from Frontoffice.models import (
    Patient_Detials
  
)


@csrf_exempt
@require_http_methods(['POST'])
def procedures_form_Details_Link(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        patient_id = data.get("Patient_id")
        procedure_details = data.get("ProcedureDetails")
        doctor_signature = data.get("DoctorSignature")
        created_by = data.get("Created_by")

        if not patient_id:
            return JsonResponse({"error": "Patient ID is required"}, status=400)

        patient = Patient_Detials.objects.filter(PatientId=patient_id).first()
        if not patient:
            return JsonResponse({"error": "Invalid Patient ID"}, status=404)

        Casuality_procedures_form_Details.objects.create(
            Patient_id=patient,
            Registration_id=data.get("Registration_id"),  # optional
            ProcedureDetails=procedure_details,
            DoctorSignature=doctor_signature,
            Created_by=created_by,
        )
        return JsonResponse({"message": "Procedure form saved successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ======================================================
# GET PROCEDURE FORM DATA (by patient)
# ======================================================

def get_procedure_forms(request, id):
    if request.method == "GET":
        try:
            records = Casuality_procedures_form_Details.objects.filter(Patient_id=id).order_by('-CreatedDate')

            data = [
                {
                    "id": f.id,
                    "Patient_id": f.Patient_id.PatientId if f.Patient_id else None,
                    "Registration_id": f.Registration_id,
                    "ProcedureDetails": f.ProcedureDetails,
                    "DoctorSignature": f.DoctorSignature,
                    "Created_by": f.Created_by,
                    "CreatedDate": f.CreatedDate.strftime("%Y-%m-%d %H:%M") if f.CreatedDate else None,
                    "UpdatedDate": f.UpdatedDate.strftime("%Y-%m-%d %H:%M") if f.UpdatedDate else None,
                }
                for f in records
            ]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=405)


# ======================================================
# UPDATE PROCEDURE FORM (PATCH)
# ======================================================

@csrf_exempt
@require_http_methods(["PATCH"])
def update_procedure_form(request, id):

    print("Received PATCH for ID:", id)

    try:
        raw_body = request.body.decode("utf-8")
        print("RAW BODY:", raw_body)

        data = json.loads(raw_body)
        print("PARSED DATA:", data)

        # Fetch record
        procedure = Casuality_procedures_form_Details.objects.filter(id=id).first()
        if not procedure:
            return JsonResponse({"error": "Procedure record not found"}, status=404)

        # Update fields
        procedure.ProcedureDetails = data.get("ProcedureDetails", procedure.ProcedureDetails)
        procedure.DoctorSignature = data.get("DoctorSignature", procedure.DoctorSignature)
        procedure.Created_by = data.get("Created_by", procedure.Created_by)

        procedure.UpdatedDate = timezone.now()
        procedure.save()

        return JsonResponse({"message": "Procedure form updated successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# Optional: DELETE (if you ever need it)
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_procedure_form(request, id):
    try:
        procedure = Casuality_procedures_form_Details.objects.get(id=id)
        procedure.delete()
        return JsonResponse({"message": "Procedure form deleted successfully"}, status=204)
    except Casuality_procedures_form_Details.DoesNotExist:
        return JsonResponse({"error": "Record not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)