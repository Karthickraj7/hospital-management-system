# from django.http import JsonResponse
# from django.views.decorators.http import require_http_methods
# from django.views.decorators.csrf import csrf_exempt
# import json
# from .models import Casuality_TreatmentRecord_Details
 
 
# def to_bool(val):
#     return val in (True, "true", "True", 1, "1")
 
 
# @csrf_exempt
# @require_http_methods(['POST','GET'])
# def treatment_record_Details_Link(request):
#     if request.method == "POST":
#         try:
#             payload = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
 
        
#         dt = payload.get("DateTime")
#         if dt and "T" in dt:
#             dt = dt.replace("T", " ") + ":00"
 
#         try:
#             record = Casuality_TreatmentRecord_Details.objects.create(
#                 Patient_id_id=payload.get("Patient_id"),
#                 Created_by=payload.get("Created_by"),
 
#                 DateTime=dt,
#                 Name=payload.get("Name"),
#                 UHID=payload.get("UHID"),
#                 Age=payload.get("Age"),
#                 Gender=payload.get("Gender"),
#                 BroughtBy=payload.get("BroughtBy"),
 
#                 IDMark1=payload.get("IDMark1"),
#                 IDMark2=payload.get("IDMark2"),
#                 MLC=to_bool(payload.get("MLC", False)),
#                 NONMLC=to_bool(payload.get("NONMLC", False)),
 
#                 AirwayPatency=payload.get("AirwayPatency"),
#                 AirwaySecretion=payload.get("AirwaySecretion"),
#                 BreathingWOB=payload.get("BreathingWOB"),
#                 RR=payload.get("RR"),
#                 SpO2=payload.get("SpO2"),
#                 AE=payload.get("AE"),
 
#                 HR=payload.get("HR"),
#                 BP=payload.get("BP"),
#                 PeripheralPulses=payload.get("PeripheralPulses"),
 
#                 GCS=payload.get("GCS"),
#                 Pupils=payload.get("Pupils"),
#                 GRBS=payload.get("GRBS"),
 
#                 Temp=payload.get("Temp"),
#                 ExposureOthers=payload.get("ExposureOthers"),
 
#                 ChiefSymptoms=payload.get("ChiefSymptoms"),
#                 Allergies=payload.get("Allergies"),
#                 LastMeal=payload.get("LastMeal"),
 
#                 PastHistoryandMedications=payload.get("PastHistoryandMedications"),
#                 GeneralExamination=payload.get("GeneralExamination"),
 
#                 RS=payload.get("RS"),
#                 CVS=payload.get("CVS"),
#                 ABDPELVIS=payload.get("ABDPELVIS"),
#                 CNS=payload.get("CNS"),
#             )
 
#             return JsonResponse({"success": True, "id": record.Id})
 
#         except Exception as e:
#             return JsonResponse({"success": False, "error": str(e)}, status=500)
 
#     return JsonResponse({"success": False, "error": "Invalid method"}, status=405)
 
 
# @csrf_exempt
# def get_treatment_record(request, patient_id):
#     if request.method != "GET":
#         return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)
 
#     try:
#         records = Casuality_TreatmentRecord_Details.objects.filter(
#             Patient_id__PatientId=patient_id
#         ).order_by("-Id")
 
#         data = [
#             {
#                 "id": r.Id,
#                 "DateTime": r.DateTime.strftime("%Y-%m-%dT%H:%M") if r.DateTime else "",
#                 "Name": r.Name or "",
#                 "UHID": r.UHID or "",
#                 "Age": r.Age or "",
#                 "Gender": r.Gender or "",
#                 "BroughtBy": r.BroughtBy or "",
#                 "IDMark1": r.IDMark1 or "",
#                 "IDMark2": r.IDMark2 or "",
#                 "MLC": r.MLC,
#                 "NONMLC": r.NONMLC,
#                 "AirwayPatency": r.AirwayPatency or "",
#                 "AirwaySecretion": r.AirwaySecretion or "",
#                 "BreathingWOB": r.BreathingWOB or "",
#                 "RR": r.RR or "",
#                 "SpO2": r.SpO2 or "",
#                 "AE": r.AE or "",
#                 "HR": r.HR or "",
#                 "BP": r.BP or "",
#                 "PeripheralPulses": r.PeripheralPulses or "",
#                 "GCS": r.GCS or "",
#                 "Pupils": r.Pupils or "",
#                 "GRBS": r.GRBS or "",
#                 "Temp": r.Temp or "",
#                 "ExposureOthers": r.ExposureOthers or "",
#                 "ChiefSymptoms": r.ChiefSymptoms or "",
#                 "Allergies": r.Allergies or "",
#                 "LastMeal": r.LastMeal or "",
#                 "PastHistoryandMedications": r.PastHistoryandMedications or "",
#                 "GeneralExamination": r.GeneralExamination or "",
#                 "RS": r.RS or "",
#                 "CVS": r.CVS or "",
#                 "ABDPELVIS": r.ABDPELVIS or "",
#                 "CNS": r.CNS or "",
#             }
#             for r in records
#         ]
 
#         return JsonResponse({"success": True, "data": data})
 
#     except Exception as e:
#         return JsonResponse({"success": False, "error": str(e)}, status=500)
 
 
# @csrf_exempt
# def update_treatment_record(request, record_id):
#     if request.method != "PUT":
#         return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)
 
#     try:
#         payload = json.loads(request.body.decode("utf-8"))
#     except Exception:
#         return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
 
#     try:
       
#         rec = Casuality_TreatmentRecord_Details.objects.get(Id=record_id)
 
#         for field, value in payload.items():
 
#             if value in ["", None]:
#                 continue
 
#             if field in ["MLC", "NONMLC"]:
#                 value = to_bool(value)
 
#             if field == "DateTime":
#                 from django.utils.dateparse import parse_datetime
#                 value = parse_datetime(value)
#                 if not value:
#                     return JsonResponse(
#                         {"success": False, "error": "Invalid DateTime format"},
#                         status=400
#                     )
 
#             setattr(rec, field, value)
 
#         rec.save()
#         return JsonResponse({"success": True})
 
#     except Casuality_TreatmentRecord_Details.DoesNotExist:
#         return JsonResponse({"success": False, "error": "Record not found"}, status=404)
 
#     except Exception as e:
#         return JsonResponse({"success": False, "error": str(e)}, status=500)





from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Casuality_TreatmentRecord_Details
 
 
def to_bool(val):
    return val in (True, "true", "True", 1, "1")
 
 
@csrf_exempt
@require_http_methods(['POST','GET'])
def treatment_record_Details_Link(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
 
       
        dt = payload.get("DateTime")
        if dt and "T" in dt:
            dt = dt.replace("T", " ") + ":00"
 
        try:
            record = Casuality_TreatmentRecord_Details.objects.create(
                Patient_id_id=payload.get("Patient_id"),
                Created_by=payload.get("Created_by"),
 
                DateTime=dt,
                Name=payload.get("Name"),
                UHID=payload.get("UHID"),
                Age=payload.get("Age"),
                Gender=payload.get("Gender"),
                BroughtBy=payload.get("BroughtBy"),
 
                IDMark1=payload.get("IDMark1"),
                IDMark2=payload.get("IDMark2"),
                MLC=to_bool(payload.get("MLC", False)),
                NONMLC=to_bool(payload.get("NONMLC", False)),
                AIRWAY=payload.get("AIRWAY"),
                AirwayPatency=payload.get("AirwayPatency"),
                AirwaySecretion=payload.get("AirwaySecretion"),
                BREATHING=payload.get("BREATHING"),
                BreathingWOB=payload.get("BreathingWOB"),
                RR=payload.get("RR"),
                SpO2=payload.get("SpO2"),
                AE=payload.get("AE"),
                CIRCULATION=payload.get("CIRCULATION"),
                HR=payload.get("HR"),
                BP=payload.get("BP"),
                PeripheralPulses=payload.get("PeripheralPulses"),
                DISABILITY=payload.get("DISABILITY"),
                GCS=payload.get("GCS"),
                Pupils=payload.get("Pupils"),
                GRBS=payload.get("GRBS"),
                EXPOSURE=payload.get("EXPOSURE"),
                Temp=payload.get("Temp"),
                ExposureOthers=payload.get("ExposureOthers"),
 
                ChiefSymptoms=payload.get("ChiefSymptoms"),
                Allergies=payload.get("Allergies"),
                LastMeal=payload.get("LastMeal"),
 
                PastHistoryandMedications=payload.get("PastHistoryandMedications"),
                GeneralExamination=payload.get("GeneralExamination"),
 
                RS=payload.get("RS"),
                CVS=payload.get("CVS"),
                ABDPELVIS=payload.get("ABDPELVIS"),
                CNS=payload.get("CNS"),
            )
 
            return JsonResponse({"success": True, "id": record.Id})
 
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)
 
    return JsonResponse({"success": False, "error": "Invalid method"}, status=405)
 
 
@csrf_exempt
def get_treatment_record(request, patient_id):
    if request.method != "GET":
        return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)
 
    try:
        records = Casuality_TreatmentRecord_Details.objects.filter(
            Patient_id__PatientId=patient_id
        ).order_by("-Id")
 
        data = [
            {
                "id": r.Id,
                "DateTime": r.DateTime.strftime("%Y-%m-%dT%H:%M") if r.DateTime else "",
                "Name": r.Name or "",
                "UHID": r.UHID or "",
                "Age": r.Age or "",
                "Gender": r.Gender or "",
                "BroughtBy": r.BroughtBy or "",
                "IDMark1": r.IDMark1 or "",
                "IDMark2": r.IDMark2 or "",
                "MLC": r.MLC,
                "NONMLC": r.NONMLC,
                "AIRWAY": r.AIRWAY or "",
                "AirwayPatency": r.AirwayPatency or "",
                "AirwaySecretion": r.AirwaySecretion or "",
                "BREATHING": r.BREATHING or "",
                "BreathingWOB": r.BreathingWOB or "",
                "RR": r.RR or "",
                "SpO2": r.SpO2 or "",
                "AE": r.AE or "",
                "CIRCULATION": r.CIRCULATION or "",
                "HR": r.HR or "",
                "BP": r.BP or "",
                "PeripheralPulses": r.PeripheralPulses or "",
                "DISABILITY": r.DISABILITY or "",
                "GCS": r.GCS or "",
                "Pupils": r.Pupils or "",
                "GRBS": r.GRBS or "",
                "EXPOSURE": r.EXPOSURE or "",
                "Temp": r.Temp or "",
                "ExposureOthers": r.ExposureOthers or "",
                "ChiefSymptoms": r.ChiefSymptoms or "",
                "Allergies": r.Allergies or "",
                "LastMeal": r.LastMeal or "",
                "PastHistoryandMedications": r.PastHistoryandMedications or "",
                "GeneralExamination": r.GeneralExamination or "",
                "RS": r.RS or "",
                "CVS": r.CVS or "",
                "ABDPELVIS": r.ABDPELVIS or "",
                "CNS": r.CNS or "",
            }
            for r in records
        ]
 
        return JsonResponse({"success": True, "data": data})
 
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
 
 
@csrf_exempt
def update_treatment_record(request, record_id):
    if request.method != "PUT":
        return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)
 
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
 
    try:
       
        rec = Casuality_TreatmentRecord_Details.objects.get(Id=record_id)
 
        for field, value in payload.items():
 
            if value in ["", None]:
                continue
 
            if field in ["MLC", "NONMLC"]:
                value = to_bool(value)
 
            if field == "DateTime":
                from django.utils.dateparse import parse_datetime
                value = parse_datetime(value)
                if not value:
                    return JsonResponse(
                        {"success": False, "error": "Invalid DateTime format"},
                        status=400
                    )
 
            setattr(rec, field, value)
 
        rec.save()
        return JsonResponse({"success": True})
 
    except Casuality_TreatmentRecord_Details.DoesNotExist:
        return JsonResponse({"success": False, "error": "Record not found"}, status=404)
 
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)