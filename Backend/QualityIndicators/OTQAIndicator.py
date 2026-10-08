from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from Frontoffice.models import Patient_Appointment_Registration_Detials, Patient_IP_Registration_Detials
from Masters.models import Employee_Personal_Form_Detials, Inventory_Location_Master_Detials
from OTManagement.models import Theatre_Booking_Request_Details
from OutPatient.models import Lab_Request_Details, Radiology_Request_Details
from .models import *
from Inventory.models import *

from datetime import datetime

@csrf_exempt
@require_http_methods(["GET"])
def get_all_OT_patient_for_QA(request):
    try:
        data = []

        # Retrieve query parameters
        from_date = request.GET.get('from', None)
        to_date = request.GET.get('to', None)
        specific_date = request.GET.get('date', None)
        search_query = request.GET.get('search', '').strip()

        # Start building the query based on filters
        registrations = Theatre_Booking_Request_Details.objects.all()

        # Apply date filters if 'from' and 'to' dates are provided
        if from_date and to_date:
            try:
                # Ensure the dates are in correct format before applying the filter
                from_date_obj = datetime.strptime(from_date, "%Y-%m-%d")
                to_date_obj = datetime.strptime(to_date, "%Y-%m-%d")

                # Add the filter for the range between 'from_date' and 'to_date'
                registrations = registrations.filter(
                    created_at__range=[from_date_obj, to_date_obj]
                )
            except ValueError:
                return JsonResponse({'status': 'error', 'message': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Apply filter for a specific date
        elif specific_date:
            try:
                # Ensure the date format is correct
                specific_date_obj = datetime.strptime(specific_date, "%Y-%m-%d")
                registrations = registrations.filter(created_at__date=specific_date_obj)
            except ValueError:
                return JsonResponse({'status': 'error', 'message': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        # Apply search filter (example: search by Booking_Id)
        if search_query:
            registrations = registrations.filter(Booking_Id__icontains=search_query)

        # Iterate through filtered registrations
        for reg in registrations:
            Booking_Id = reg.Booking_Id
            data.append({
                'Booking_Id': Booking_Id,
                'AnaesthesiaPlanModification': True,
                'UnplannedVentilationAfterAnaesthesia': True,
                'ReschedulingOfSurgeries': True,
                'SurgicalSafetyCompliance': True,
                'ProphylacticAntibioticTimeframe': True,
                'TransfusionReactions': True,
                'IncompleteImproperConsentRecords': True,
            })

        return JsonResponse({'status': 'success', 'data': data}, status=200)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def get_row_count_for_qa_dashboard(request):
    # Count rows for each model
    patient_ip_registration_count = Patient_IP_Registration_Detials.objects.count()
    patient_appointment_registration_count = Patient_Appointment_Registration_Detials.objects.count()
    employee_personal_form_count = Employee_Personal_Form_Detials.objects.count()
    lab_request_details_count = Lab_Request_Details.objects.count()
    theatre_booking_request_details_count = Theatre_Booking_Request_Details.objects.count()
    radiology_request_details_count = Radiology_Request_Details.objects.count()
    medical_error_report_count = MedicalErrorReport.objects.count()
    inventory_details=Inventory_Location_Master_Detials.objects.count()

    # Prepare the response data
    data = {
        "Patient_IP_Registration_Detials": patient_ip_registration_count,
        "Patient_Appointment_Registration_Detials": patient_appointment_registration_count,
        "Employee_Personal_Form_Detials": employee_personal_form_count,
        "Lab_Request_Details": lab_request_details_count,
        "Theatre_Booking_Request_Detials": theatre_booking_request_details_count,
        "Radiology_Request_Detials": radiology_request_details_count,
        "MedicalErrorReport": medical_error_report_count,
        "inventory_details":inventory_details,
    }

    # Return the response as JSON
    return JsonResponse(data)