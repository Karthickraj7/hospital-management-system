# Radiology/pacs_views.py
import requests
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

# ── Orthanc connection ────────────────────────────────────────────
# Change this to your actual Orthanc server IP/hostname if not localhost
ORTHANC_URL = getattr(settings, 'ORTHANC_URL', 'http://localhost:8042')
ORTHANC_USER = getattr(settings, 'ORTHANC_USER', None)   # set in settings.py if auth enabled
ORTHANC_PASS = getattr(settings, 'ORTHANC_PASS', None)


def _orthanc_auth():
    """Return requests auth tuple if credentials are configured."""
    if ORTHANC_USER and ORTHANC_PASS:
        return (ORTHANC_USER, ORTHANC_PASS)
    return None


def _get(url, params=None, timeout=10):
    return requests.get(url, params=params, auth=_orthanc_auth(), timeout=timeout)


def _post(url, payload, timeout=10):
    return requests.post(url, json=payload, auth=_orthanc_auth(), timeout=timeout)


# ─────────────────────────────────────────────────────────────────
# 1. Test connection
# ─────────────────────────────────────────────────────────────────
@csrf_exempt
def test_pacs_connection(request):
    """Test endpoint to verify Orthanc PACS connectivity."""
    try:
        response = _get(f"{ORTHANC_URL}/system", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return JsonResponse({
                'status': 'connected',
                'version': data.get('Version', 'unknown'),
                'name': data.get('Name', 'unknown'),
                'orthanc_url': ORTHANC_URL,
            })
        return JsonResponse({
            'status': 'error',
            'message': f'Orthanc returned HTTP {response.status_code}',
        }, status=500)
    except requests.exceptions.ConnectionError:
        return JsonResponse({
            'status': 'disconnected',
            'message': f'Cannot connect to Orthanc at {ORTHANC_URL}. Is it running?',
            'orthanc_url': ORTHANC_URL,
        }, status=503)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


# ─────────────────────────────────────────────────────────────────
# 2. Get studies for a patient
#    FIX: Modality lives on Series, NOT Study level in DICOM.
#         Query by PatientID only, then optionally filter series by modality.
# ─────────────────────────────────────────────────────────────────
@csrf_exempt
def get_pacs_studies(request, patient_id):
    """
    GET /pacs/studies/<patient_id>/
    Optional query param: ?modality=CT|MR|US|CR|DX

    Returns a list of studies belonging to this patient.
    """
    try:
        modality = request.GET.get('modality', '').strip().upper()

        # ── Step 1: find all studies for the patient ──────────────
        find_payload = {
            "Level": "Study",
            "Query": {
                "PatientID": patient_id,
            },
            "Expand": True,          # include full metadata in one shot
        }

        find_response = _post(f"{ORTHANC_URL}/tools/find", find_payload)

        if find_response.status_code != 200:
            logger.error(f"Orthanc /tools/find failed: {find_response.status_code} {find_response.text}")
            return JsonResponse(
                {'error': f'Orthanc query failed (HTTP {find_response.status_code})'},
                status=500,
            )

        raw_studies = find_response.json()  # list of full study objects when Expand=True

        # ── Step 2: build response list ───────────────────────────
        studies = []
        for study in raw_studies:
            study_id = study.get('ID', '')
            main_tags = study.get('MainDicomTags', {})
            patient_tags = study.get('PatientMainDicomTags', {})

            # If a modality filter was requested, check whether at least one
            # series in this study matches (modality is a Series-level tag).
            if modality:
                series_list = study.get('Series', [])
                modality_match = False
                for series_id in series_list:
                    series_resp = _get(f"{ORTHANC_URL}/series/{series_id}")
                    if series_resp.status_code == 200:
                        s_tags = series_resp.json().get('MainDicomTags', {})
                        if s_tags.get('Modality', '').upper() == modality:
                            modality_match = True
                            break
                if not modality_match:
                    continue   # skip this study — no matching modality

            studies.append({
                'ID': study_id,
                'PatientName': patient_tags.get('PatientName', 'Unknown'),
                'PatientID': patient_tags.get('PatientID', patient_id),
                'MainDicomTags': main_tags,
                'SeriesCount': len(study.get('Series', [])),
                'InstancesCount': study.get('InstancesCount', 0),
            })

        return JsonResponse(studies, safe=False)

    except requests.exceptions.ConnectionError:
        return JsonResponse(
            {'error': f'Cannot reach Orthanc at {ORTHANC_URL}. Check server connectivity.'},
            status=503,
        )
    except requests.exceptions.Timeout:
        return JsonResponse({'error': 'Orthanc request timed out'}, status=504)
    except Exception as e:
        logger.exception("get_pacs_studies error")
        return JsonResponse({'error': str(e)}, status=500)


# ─────────────────────────────────────────────────────────────────
# 3. Get series for a study
#    URL (backend):  pacs/study/<study_uid>/series/
#    URL (frontend): pacs/series/<studyID>/          ← mismatch fixed below
#    We expose BOTH paths in urls.py so the frontend works.
# ─────────────────────────────────────────────────────────────────
@csrf_exempt
def get_study_series(request, study_uid):
    """
    GET /pacs/study/<study_uid>/series/    (original)
    GET /pacs/series/<study_uid>/          (alias used by frontend PACSWorkflow)

    Returns all series for a given study.
    """
    try:
        url = f"{ORTHANC_URL}/studies/{study_uid}/series"
        response = _get(url)

        if response.status_code == 200:
            series_list = response.json()  # list of series objects from Orthanc
            return JsonResponse(series_list, safe=False)

        return JsonResponse({'error': f'Orthanc returned HTTP {response.status_code}'}, status=500)

    except requests.exceptions.ConnectionError:
        return JsonResponse({'error': 'Cannot reach Orthanc'}, status=503)
    except Exception as e:
        logger.exception("get_study_series error")
        return JsonResponse({'error': str(e)}, status=500)


# ─────────────────────────────────────────────────────────────────
# 4. Get instances for a series
#    URL (backend):  pacs/series/<series_uid>/instances/
#    URL (frontend): pacs/instances/<seriesID>/          ← mismatch fixed below
#    We expose BOTH paths in urls.py.
# ─────────────────────────────────────────────────────────────────
@csrf_exempt
def get_series_instances(request, series_uid):
    """
    GET /pacs/series/<series_uid>/instances/   (original)
    GET /pacs/instances/<series_uid>/          (alias used by frontend PACSWorkflow)

    Returns all instances (images) for a series.
    """
    try:
        url = f"{ORTHANC_URL}/series/{series_uid}/instances"
        response = _get(url)

        if response.status_code == 200:
            return JsonResponse(response.json(), safe=False)

        return JsonResponse({'error': f'Orthanc returned HTTP {response.status_code}'}, status=500)

    except requests.exceptions.ConnectionError:
        return JsonResponse({'error': 'Cannot reach Orthanc'}, status=503)
    except Exception as e:
        logger.exception("get_series_instances error")
        return JsonResponse({'error': str(e)}, status=500)


# ─────────────────────────────────────────────────────────────────
# 5. Get rendered image (JPEG) for an instance
# ─────────────────────────────────────────────────────────────────
@csrf_exempt
def pacs_debug(request):
    """
    GET /pacs/debug/
    Lists ALL patients stored in Orthanc so you can verify
    which PatientIDs are available and how they are formatted.
    Use this to confirm the PatientID in your HIS matches Orthanc.
    """
    try:
        # Get all patient IDs in Orthanc
        patients_resp = _get(f"{ORTHANC_URL}/patients")
        if patients_resp.status_code != 200:
            return JsonResponse({'error': 'Cannot list patients'}, status=500)

        patient_ids = patients_resp.json()
        result = []
        for pid in patient_ids[:20]:   # limit to first 20 to avoid overload
            p_resp = _get(f"{ORTHANC_URL}/patients/{pid}")
            if p_resp.status_code == 200:
                p_data = p_resp.json()
                tags = p_data.get('MainDicomTags', {})
                result.append({
                    'OrthancID': pid,
                    'PatientID': tags.get('PatientID', ''),
                    'PatientName': tags.get('PatientName', ''),
                    'StudiesCount': len(p_data.get('Studies', [])),
                })

        return JsonResponse({
            'orthanc_url': ORTHANC_URL,
            'total_patients_in_orthanc': len(patient_ids),
            'sample_patients': result,
            'note': 'Compare PatientID values above with what your HIS sends. They must match exactly.',
        })
    except requests.exceptions.ConnectionError:
        return JsonResponse({'error': f'Cannot reach Orthanc at {ORTHANC_URL}'}, status=503)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_rendered_image(request, instance_uid):
    """
    GET /pacs/image/<instance_uid>/
    Optional params: ?frame=0&width=512&height=512

    Proxies the rendered JPEG from Orthanc back to the frontend.
    Frame index is 0-based in this view (Orthanc also uses 0-based).
    """
    try:
        frame  = request.GET.get('frame', '0')
        width  = request.GET.get('width', '512')
        height = request.GET.get('height', '512')

        # Orthanc rendered endpoint — frame is 0-based
        url = f"{ORTHANC_URL}/instances/{instance_uid}/frames/{frame}/rendered"
        params = {'width': width, 'height': height}

        response = requests.get(
            url,
            params=params,
            auth=_orthanc_auth(),
            timeout=30,
            stream=True,
        )

        if response.status_code == 200:
            resp = HttpResponse(response.content, content_type='image/jpeg')
            # Allow the React frontend (possibly different origin) to receive image
            resp['Access-Control-Allow-Origin'] = '*'
            return resp

        logger.warning(f"Orthanc image {instance_uid} frame {frame}: HTTP {response.status_code}")
        return HttpResponse(status=response.status_code)

    except requests.exceptions.ConnectionError:
        return HttpResponse(status=503)
    except Exception as e:
        logger.exception("get_rendered_image error")
        return HttpResponse(status=500)