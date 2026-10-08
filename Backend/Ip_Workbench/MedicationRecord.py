from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Casuality_MedicationRecord_Details
# from django.http import JsonResponse
from collections import defaultdict

# -------------------------
# CREATE MEDICATION RECORD
# -------------------------

@csrf_exempt
@require_http_methods(['POST','GET'])
def Medication_Record_Details_Link(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid Method"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))

        patient_id = data.get("Patient_id")
        registration_id = data.get("Registration_id")
        created_by = data.get("Created_by", "SYSTEM")
        records = data.get("records", [])

        # Form-level fields
        consultation = data.get("consultation", [])
        final_diagnosis = data.get("final_diagnosis", "")
        prepared_by = data.get("prepared_by", "")
        admission = data.get("admission", False)
        discharge = data.get("discharge", False)
        referral = data.get("referral", False)
        lama = data.get("lama", False)
        transfer_time = data.get("transfer_time", "")

        hr = data.get("hr", "")
        bp = data.get("bp", "")
        spo2 = data.get("spo2", "")
        gcs = data.get("gcs", "")
        condition_during = data.get("condition_during", "")

        for row in records:
            Casuality_MedicationRecord_Details.objects.create(
                Patient_id=patient_id,
                registration_id=registration_id,
                created_by=created_by,
                consultation=consultation,
                final_diagnosis=final_diagnosis,
                prepared_by=prepared_by,
                admission=admission,
                discharge=discharge,
                referral=referral,
                lama=lama,
                transfer_time=transfer_time,
                hr=hr,
                bp=bp,
                spo2=spo2,
                gcs=gcs,
                condition_during=condition_during,
                datetime=row.get("datetime", ""),
                drug=row.get("drug", ""),
                dose=row.get("dose", ""),
                route=row.get("route", ""),
                frequency=row.get("frequency", ""),
                admin_time = row.get("admin_time", ""),
                doctor=row.get("doctor", ""),
                nurse=row.get("nurse", ""),
            )

        return JsonResponse({"message": "Medication Record Saved"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# -------------------------
# GET MEDICATION RECORDS
# -------------------------

@require_http_methods(["GET"])
def get_medication_forms(request, patient_id):
    if request.method == "GET":
        try:
            records = Casuality_MedicationRecord_Details.objects.filter(
                Patient_id=patient_id
            ).order_by("-created_date", "-id")

            data = [
                {
                    "id": f.id,
                    "Patient_id": patient_id,
                    "Registration_id": f.registration_id,
                    "datetime": f.datetime,
                    "drug": f.drug,
                    "dose": f.dose,
                    "route": f.route,
                    "frequency": f.frequency,
                    "admin_time": f.admin_time,
                    "doctor": f.doctor,
                    "nurse": f.nurse,
                    "consultation": f.consultation or [],
                    "final_diagnosis": f.final_diagnosis or "",
                    "prepared_by": f.prepared_by or "",
                    "admission": f.admission,
                    "discharge": f.discharge,
                    "referral": f.referral,
                    "lama": f.lama,
                    "transfer_time": f.transfer_time or "",
                    "hr": f.hr or "",
                    "bp": f.bp or "",
                    "spo2": f.spo2 or "",
                    "gcs": f.gcs or "",
                    "condition_during": f.condition_during or "",
                    "Created_by": f.created_by,
                    "CreatedDate": f.created_date.strftime("%Y-%m-%d %H:%M")
                    if f.created_date else None,
                }
                for f in records
            ]

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=405)


# -------------------------
# UPDATE MEDICATION RECORD
# -------------------------
@csrf_exempt
def update_Medication_Record(request, pk):
    if request.method != "PUT":
        return JsonResponse({"error": "Invalid Method"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        obj = Casuality_MedicationRecord_Details.objects.get(id=pk)

        # Update individual medication row fields
        obj.datetime = data.get("datetime", obj.datetime)
        obj.drug = data.get("drug", obj.drug)
        obj.dose = data.get("dose", obj.dose)
        obj.route = data.get("route", obj.route)
        obj.frequency = data.get("frequency", obj.frequency)
        obj.admin_time = data.get("adminTime", obj.admin_time)
        obj.doctor = data.get("doctor", obj.doctor)
        obj.nurse = data.get("nurse", obj.nurse)

        # Update form-level fields
        obj.consultation = data.get("consultation", obj.consultation)
        obj.final_diagnosis = data.get("finalDiagnosis", obj.final_diagnosis)
        obj.prepared_by = data.get("preparedBy", obj.prepared_by)
        obj.admission = data.get("admission", obj.admission)
        obj.discharge = data.get("discharge", obj.discharge)
        obj.referral = data.get("referral", obj.referral)
        obj.lama = data.get("lama", obj.lama)
        obj.transfer_time = data.get("transferTime", obj.transfer_time)

        # Vitals / additional info
        obj.hr = data.get("hr", obj.hr)
        obj.bp = data.get("bp", obj.bp)
        obj.spo2 = data.get("spo2", obj.spo2)
        obj.gcs = data.get("gcs", obj.gcs)
        obj.condition_during = data.get("conditionDuring", obj.condition_during)

        obj.save()

        return JsonResponse({"message": "Updated Successfully"}, status=200)

    except Casuality_MedicationRecord_Details.DoesNotExist:
        return JsonResponse({"error": "Record not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
