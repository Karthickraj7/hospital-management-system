
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
import json
from .models import (
    Casuality_TreatmentSummary_Details,
    Patient_Detials,
    Patient_Emergency_Registration_Detials,
    Employee_Personal_Form_Detials,
)

@csrf_exempt
@require_http_methods(['POST','GET'])
def Treatment_summary_Details_Link(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode('utf-8'))

            # Fix: Use correct key names from frontend
            patient_id = body.get("Patient_id")        # ← Was "PatientId"
            registration_id = body.get("Registration_id")
            employee_id = body.get("Employeeid")
            created_by = body.get("Created_by", "System")
            form_data = body.get("formData", {})

            # Fix: Query Patient via PatientId field (not primary key)
            try:
                patient = Patient_Detials.objects.get(PatientId=patient_id)
            except Patient_Detials.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "error": f"Patient with PatientId {patient_id} not found."
                }, status=404)

            # Optional: Registration & Employee
            registration = None
            if registration_id:
                try:
                    registration = Patient_Emergency_Registration_Detials.objects.get(Registration_Id=registration_id)
                except Patient_Emergency_Registration_Detials.DoesNotExist:
                    pass  # or raise error if required

            employee = None
            if employee_id:
                try:
                    employee = Employee_Personal_Form_Detials.objects.get(EmployeeId=employee_id)
                except Employee_Personal_Form_Detials.DoesNotExist:
                    pass

            # Create record
            treatment = Casuality_TreatmentSummary_Details(
                Patient_id=patient,
                Casuality_Registration_Id=registration,
                Employeeid=employee,
                CreatedBy=created_by,

                # Map form data
                Name=form_data.get("Name", ""),
                AgeSex=form_data.get("AgeSex", ""),
                Date=form_data.get("Date") or None,
                InTime=form_data.get("InTime") or None,
                OutTime=form_data.get("OutTime") or None,
                PR=form_data.get("PR", ""),
                BP=form_data.get("BP", ""),
                RR=form_data.get("RR", ""),
                SPO2=form_data.get("SPO2", ""),
                GRBS=form_data.get("GRBS", ""),
                GCS=form_data.get("GCS", ""),
                TEMP=form_data.get("TEMP", ""),
                Diagnosis=form_data.get("Diagnosis", ""),
                History=form_data.get("History", ""),
                Examination=form_data.get("Examination", ""),
                Investigations=form_data.get("Investigations", ""),
                Medications=form_data.get("Medications", ""),
                Consultations=form_data.get("Consultations", ""),
                DischargePlan=form_data.get("DischargePlan", ""),
                PR_Dis=form_data.get("PR_Dis", ""),
                BP_Dis=form_data.get("BP_Dis", ""),
                RR_Dis=form_data.get("RR_Dis", ""),
                SPO2_Dis=form_data.get("SPO2_Dis", ""),
                GRBS_Dis=form_data.get("GRBS_Dis", ""),
                GCS_Dis=form_data.get("GCS_Dis", ""),
                TEMP_Dis=form_data.get("TEMP_Dis", ""),
                LamaName=form_data.get("LamaName", ""),
                LamaDate=form_data.get("LamaDate") or None,
                LamaTime=form_data.get("LamaTime") or None,
                PatientRelativeName=form_data.get("PatientRelativeName", ""),
                PatientRelationship=form_data.get("PatientRelationship", ""),
                WitnessSignature=form_data.get("WitnessSignature", ""),
                DoctorSignature=form_data.get("DoctorSignature", ""),
            )
            treatment.save()

            return JsonResponse({"success": True, "message": "Saved Successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)



def get_treatment_summary(request, patient_id):
    if request.method == "GET":
        try:
            records = Casuality_TreatmentSummary_Details.objects.filter(
                Patient_id__PatientId=patient_id
            ).order_by('-CreatedDate')

            response = []
            for r in records:
                response.append({
                    "Id": r.id,
                    "CreatedDate": r.CreatedDate.isoformat() if r.CreatedDate else "",
                    "Name": r.Name or "",
                    "AgeSex": r.AgeSex or "",
                    "Date": str(r.Date) if r.Date else "",
                    "InTime": str(r.InTime) if r.InTime else "",
                    "OutTime": str(r.OutTime) if r.OutTime else "",
                    "Diagnosis": r.Diagnosis or "",
                    # ... include all other fields
                    "PR": r.PR or "", "BP": r.BP or "", "RR": r.RR or "",
                    "SPO2": r.SPO2 or "", "GRBS": r.GRBS or "", "GCS": r.GCS or "", "TEMP": r.TEMP or "",
                    "History": r.History or "", "Examination": r.Examination or "",
                    "Investigations": r.Investigations or "", "Medications": r.Medications or "",
                    "Consultations": r.Consultations or "", "DischargePlan": r.DischargePlan or "",
                    "PR_Dis": r.PR_Dis or "", "BP_Dis": r.BP_Dis or "", "RR_Dis": r.RR_Dis or "",
                    "SPO2_Dis": r.SPO2_Dis or "", "GRBS_Dis": r.GRBS_Dis or "",
                    "GCS_Dis": r.GCS_Dis or "", "TEMP_Dis": r.TEMP_Dis or "",
                    "LamaName": r.LamaName or "", "LamaDate": str(r.LamaDate) if r.LamaDate else "",
                    "LamaTime": str(r.LamaTime) if r.LamaTime else "",
                    "PatientRelativeName": r.PatientRelativeName or "",
                    "PatientRelationship": r.PatientRelationship or "",
                    "WitnessSignature": r.WitnessSignature or "",
                    "DoctorSignature": r.DoctorSignature or "",
                })

            return JsonResponse({"success": True, "data": response}, status=200)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
def update_treatment_summary(request, record_id):
    if request.method == "PUT":
        try:
            body = json.loads(request.body.decode('utf-8'))
            form_data = body.get("formData", {})
            updated_by = body.get("UpdatedBy")

            record = Casuality_TreatmentSummary_Details.objects.get(id=record_id)

            # Update all fields dynamically
            for key, value in form_data.items():
                if hasattr(record, key):
                    setattr(record, key, None if value == "" else value)

            if updated_by:
                record.UpdatedBy = updated_by
            record.save()

            return JsonResponse({"success": True, "message": "Updated Successfully"}, status=200)

        except Casuality_TreatmentSummary_Details.DoesNotExist:
            return JsonResponse({"error": "Record not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)



@csrf_exempt
def delete_treatment_summary(request, record_id):
    if request.method == "DELETE":
        try:
            record = Casuality_TreatmentSummary_Details.objects.get(id=record_id)
            record.delete()
            return JsonResponse({"success": True, "message": "Deleted successfully"}, status=200)
        except Casuality_TreatmentSummary_Details.DoesNotExist:
            return JsonResponse({"error": "Record not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)