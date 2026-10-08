from Frontoffice.models import *
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http.response import JsonResponse
import traceback
from django.db.models import Sum, Count, F
from django.db.models.functions import Upper
from rest_framework.decorators import api_view

@csrf_exempt
@require_http_methods(["POST", "GET"])
def Get_doctor_payout_details_consultaion(request):
    if request.method == 'GET':
        try:
            # Get list of active doctor IDs
            doctor_ids = list(Doctor_Personal_Form_Detials.objects.values_list('Doctor_ID', flat=True))
            print("Doctors data = ", doctor_ids)

            # Filter consultations for those doctors
            consultations = OP_Billing_QueueList_Detials.objects.filter(
                Billing_Type='Consultation',
                Status='Paid',
                Doctor_Ratecard_Id__Doctor_ID__Doctor_ID__in=doctor_ids
            )

            # Grouping by doctor
            grouped_data = {}

            for cons in consultations:
                ratecard = cons.Doctor_Ratecard_Id
                if not ratecard or not ratecard.Doctor_ID:
                    continue

                doctor = ratecard.Doctor_ID
                doctor_id = doctor.Doctor_ID
                doctor_name = doctor.First_Name or "Unknown"
                contribution = ratecard.Doctor_Contribution_OP or 1  # prevent div by zero
                general_fee = ratecard.General_Consultation_Fee or 0
                doctor_Type = ratecard.Doctor_ID.DoctorType
                # Calculate payout
                try:
                    payout_per_transaction = float(general_fee) / float(contribution)
                except ZeroDivisionError:
                    payout_per_transaction = 0.0

                # Initialize doctor record
                if doctor_id not in grouped_data:
                    grouped_data[doctor_id] = {
                        'Doctor_id': doctor_id,
                        'Doctor_name': doctor_name,
                        'service':'Consultation',
                        'Total_transactions': 0,
                        'Total_profit': 0.0,
                        'doctor_Type': str(doctor_Type),
                        'Transactions': [],
                    }

                # Append transaction data
                grouped_data[doctor_id]['Total_transactions'] += 1
                grouped_data[doctor_id]['Total_profit'] += payout_per_transaction
                grouped_data[doctor_id]['Transactions'].append({
                    'Contribution': str(contribution),
                    'General_fee': str(general_fee),
                    
                    'Doctor_payout_per_one': str(round(payout_per_transaction, 2))
                    
                })

            return JsonResponse({'data': list(grouped_data.values())}, safe=False)

        except Exception as e:
            print("Exception:", str(e))
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)



@csrf_exempt
@require_http_methods(["POST", "GET"])
def Get_doctor_payout_details_Radiology(request):
    if request.method == 'GET':
        try:
            # Get list of active doctor IDs
            doctor_ids = list(Doctor_Personal_Form_Detials.objects.values_list('Doctor_ID', flat=True))
            print("Doctors data = ", doctor_ids)

            # Filter consultations for those doctors
            consultations = OP_Billing_QueueList_Detials.objects.filter(
                Billing_Type='Radiology',
                Status='Paid',
                Doctor_Ratecard_Id__Doctor_ID__Doctor_ID__in=doctor_ids
            )

            # Grouping by doctor
            grouped_data = {}

            for cons in consultations:
                ratecard = cons.Doctor_Ratecard_Id
                if not ratecard or not ratecard.Doctor_ID:
                    continue

                doctor = ratecard.Doctor_ID
                doctor_id = doctor.Doctor_ID
                doctor_name = doctor.First_Name or "Unknown"
                contribution = ratecard.Doctor_Contribution_OP or 1  # prevent div by zero
                general_fee = ratecard.General_Consultation_Fee or 0
                doctor_Type = ratecard.Doctor_ID.DoctorType
                # Calculate payout
                try:
                    payout_per_transaction = float(general_fee) / float(contribution)
                except ZeroDivisionError:
                    payout_per_transaction = 0.0

                # Initialize doctor record
                if doctor_id not in grouped_data:
                    grouped_data[doctor_id] = {
                        'Doctor_id': doctor_id,
                        'Doctor_name': doctor_name,
                        'service':'Radiology',
                        'Total_transactions': 0,
                        'Total_profit': 0.0,
                        'doctor_Type': str(doctor_Type),
                        'Transactions': [],
                    }

                # Append transaction data
                grouped_data[doctor_id]['Total_transactions'] += 1
                grouped_data[doctor_id]['Total_profit'] += payout_per_transaction
                grouped_data[doctor_id]['Transactions'].append({
                    'Contribution': str(contribution),
                    'General_fee': str(general_fee),
                    
                    'Doctor_payout_per_one': str(round(payout_per_transaction, 2))
                    
                })

            return JsonResponse({'data': list(grouped_data.values())}, safe=False)

        except Exception as e:
            print("Exception:", str(e))
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)




@csrf_exempt
@require_http_methods(["POST", "GET"])
def Get_doctor_payout_details_Lab(request):
    if request.method == 'GET':
        try:
            # Get list of active doctor IDs
            doctor_ids = list(Doctor_Personal_Form_Detials.objects.values_list('Doctor_ID', flat=True))
            print("Doctors data = ", doctor_ids)

            # Filter consultations for those doctors
            consultations = OP_Billing_QueueList_Detials.objects.filter(
                Billing_Type='Lab',
                Status='Paid',
                Doctor_Ratecard_Id__Doctor_ID__Doctor_ID__in=doctor_ids
            )

            # Grouping by doctor
            grouped_data = {}

            for cons in consultations:
                ratecard = cons.Doctor_Ratecard_Id
                if not ratecard or not ratecard.Doctor_ID:
                    continue

                doctor = ratecard.Doctor_ID
                doctor_id = doctor.Doctor_ID
                doctor_name = doctor.First_Name or "Unknown"
                contribution = ratecard.Doctor_Contribution_OP or 1  # prevent div by zero
                general_fee = ratecard.General_Consultation_Fee or 0
                doctor_Type = ratecard.Doctor_ID.DoctorType
                # Calculate payout
                try:
                    payout_per_transaction = float(general_fee) / float(contribution)
                except ZeroDivisionError:
                    payout_per_transaction = 0.0

                # Initialize doctor record
                if doctor_id not in grouped_data:
                    grouped_data[doctor_id] = {
                        'Doctor_id': doctor_id,
                        'Doctor_name': doctor_name,
                         'service':'Lab',
                        'Total_transactions': 0,
                        'Total_profit': 0.0,
                        'doctor_Type': str(doctor_Type),
                        'Transactions': [],
                    }

                # Append transaction data
                grouped_data[doctor_id]['Total_transactions'] += 1
                grouped_data[doctor_id]['Total_profit'] += payout_per_transaction
                grouped_data[doctor_id]['Transactions'].append({
                    'Contribution': str(contribution),
                    'General_fee': str(general_fee),
                    
                    'Doctor_payout_per_one': str(round(payout_per_transaction, 2))
                    
                })

            return JsonResponse({'data': list(grouped_data.values())}, safe=False)

        except Exception as e:
            print("Exception:", str(e))
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)



    
@api_view(['GET'])
def get_ip_doctor_service_type_summary(request):
  
    try:
     
        item_data = (
            IP_Billing_Items_Table_Detials.objects
            .filter(Item_Status__in=['Paid']) 
            .select_related('Billing_Invoice_No__Doctor_Id')
            .annotate(service_type=Upper('Service_Type')) 
            .values(
                'Billing_Invoice_No__Doctor_Id',
                'Billing_Invoice_No__Doctor_Id__First_Name',
                'service_type',
                'Billing_Invoice_No__Doctor_Id__DoctorType'
            )
            .annotate(
                total_amount=Sum('Total_Amount'),
                total_transactions=Count('Items_Id')
            )
            .order_by('Billing_Invoice_No__Doctor_Id')
        )

        result = []
        for item in item_data:
            doctor_id = item['Billing_Invoice_No__Doctor_Id']
            doctor_name = item['Billing_Invoice_No__Doctor_Id__First_Name']
            doctor_Type = item['Billing_Invoice_No__Doctor_Id__DoctorType']
            service = item['service_type']
            amount = float(item['total_amount'])
            txn = item['total_transactions']

         
            try:
                ratecard = Doctor_Ratecard_Master.objects.get(Doctor_ID=doctor_id)
                contribution = float(ratecard.Doctor_Contribution_IP)
            except Doctor_Ratecard_Master.DoesNotExist:
                contribution = 0

            doctor_earning = round(amount * contribution / 100, 2)

            result.append({
                "Doctor_ID": doctor_id,
                "Doctor_Name": doctor_name,
                "Service_Type": service,
                "Total_Transactions": txn,
                "Total_Amount": amount,
                "Contribution_Percentage": contribution,
                "Doctor_Earning": doctor_earning,
                "doctor_Type": doctor_Type,
            })

        return JsonResponse({
            "status": "success",
            "data": result
        }, safe=False)

    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)    