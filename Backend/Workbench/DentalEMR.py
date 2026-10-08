

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
import json

from .models import (
    DentalEMREvaluation,
    DentalProcedureItem,
    Patient_Appointment_Registration_Detials,
    Patient_IP_Registration_Detials
)

@csrf_exempt
def workbench_dentalemr_evaluation(request):
    if request.method == 'GET':
        reg_id = request.GET.get('RegistrationId')
        reg_type = request.GET.get('RegistrationType')

        if not reg_id or not reg_type:
            return JsonResponse([], safe=False)

        reg_type = reg_type.strip().upper()

        try:
            if reg_type == "IP":
                ip_reg = Patient_IP_Registration_Detials.objects.get(Registration_Id=reg_id)
                evaluations = DentalEMREvaluation.objects.filter(IP_RegistrationId=ip_reg)
            else:
                op_reg = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=reg_id)
                evaluations = DentalEMREvaluation.objects.filter(Registration_Id=op_reg)

            data = []
            for e in evaluations:
                procedure_details = [
                    {
                        'tooth': item.tooth,
                        'procedures': item.procedures or '',
                        'status': item.status or '',
                        'qty': item.qty or 1,
                        'fee': item.fee or 0,
                        'billed': getattr(item, 'billed', False)
                    }
                    for item in e.procedure_items.all().order_by('tooth')
                ]
                
                data.append({
                    'Id': e.Id,
                    'Procedures': e.procedures or '',
                    'Existing': e.existing or '',
                    'Planned': e.planned or '',
                    'InProgress': e.in_progress or '',
                    'Completed': e.completed or '',
                    'Status': e.status or '',
                    'Teeth': e.teeth or '',
                    'Qty': e.qty or 0,
                    'Amount': e.amount or 0,
                    'ProcedureDetails': procedure_details,
                    'ChooseDocument': e.choose_document.url if e.choose_document else None,
                    'created_by': e.created_by or 'Unknown',
                    'created_at': e.created_at.isoformat() if e.created_at else None,
                })
            return JsonResponse(data, safe=False)

        except (Patient_IP_Registration_Detials.DoesNotExist, Patient_Appointment_Registration_Detials.DoesNotExist):
            return JsonResponse([], safe=False)
        except Exception as err:
            return JsonResponse({'error': f'Fetch error: {str(err)}'}, status=500)

    elif request.method == 'POST':
        try:
            reg_id = request.POST.get('RegistrationId')
            reg_type = request.POST.get('RegistrationType', '').strip().upper()

            if not reg_id or reg_type not in ['OP', 'IP']:
                return JsonResponse({'error': 'Invalid RegistrationId or RegistrationType'}, status=400)

            # 🔥 STEP 1: Get registration FIRST
            if reg_type == "IP":
                reg_obj = Patient_IP_Registration_Detials.objects.get(Registration_Id=reg_id)
            else:
                reg_obj = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=reg_id)

            # 🔥 STEP 2: SIMPLIFIED - DELETE ALL OLD UNBILLED ITEMS
            if reg_type == "IP":
                DentalProcedureItem.objects.filter(
                    evaluation__IP_RegistrationId=reg_obj,
                    billed=False
                ).delete()
            else:
                DentalProcedureItem.objects.filter(
                    evaluation__Registration_Id=reg_obj,
                    billed=False
                ).delete()

            # 🔥 STEP 3: Create fresh evaluation
            eval_id = request.POST.get('Id')
            if eval_id:
                try:
                    e = DentalEMREvaluation.objects.get(Id=int(eval_id))
                    # Delete ALL items from this evaluation (not just unbilled)
                    e.procedure_items.all().delete()
                except (ValueError, DentalEMREvaluation.DoesNotExist):
                    e = DentalEMREvaluation()
            else:
                e = DentalEMREvaluation()

            # Set registration correctly
            if reg_type == "IP":
                e.IP_RegistrationId = reg_obj
                e.Registration_Id = None
            else:
                e.Registration_Id = reg_obj
                e.IP_RegistrationId = None

            e.existing = request.POST.get('Existing', '')
            e.planned = request.POST.get('Planned', '')
            e.in_progress = request.POST.get('InProgress', '')
            e.completed = request.POST.get('Completed', '')
            e.status = request.POST.get('Status', '')
            e.created_by = request.POST.get('created_by', 'Unknown User')

            if 'ChooseDocument' in request.FILES:
                e.choose_document = request.FILES['ChooseDocument']

            e.save()

            # 🔥 STEP 4: Create ONLY NEW FRESH ITEMS
            procedure_list = json.loads(request.POST.get('ProcedureDetails', '[]'))
            total_amount = 0
            total_qty = 0
            teeth_list = []
            procedures_summary = []

            for item_data in procedure_list:
                if isinstance(item_data, dict):
                    try:
                        tooth = int(item_data.get('tooth', 0))
                        fee = float(item_data.get('fee', 0))
                        qty = int(item_data.get('qty', 1))
                        status = item_data.get('status', 'Planned')
                        procedures = str(item_data.get('procedures', 'Unnamed'))

                        DentalProcedureItem.objects.create(
                            evaluation=e,
                            tooth=tooth,
                            procedures=procedures,
                            status=status,
                            qty=qty,
                            fee=fee,
                            billed=False  # Always fresh
                        )
                        
                        total_amount += fee * qty
                        total_qty += qty
                        teeth_list.append(str(tooth))
                        procedures_summary.append(f"{procedures} - Tooth {tooth} ({status})")
                    except (ValueError, TypeError):
                        continue

            e.amount = total_amount
            e.qty = total_qty
            e.teeth = ", ".join(sorted(set(teeth_list)))
            e.procedures = "\r\n".join(procedures_summary)
            e.save()

            return JsonResponse({
                'success': True,
                'Id': e.Id,
                'message': 'Fresh items created - ready for billing'
            })

        except Exception as err:
            return JsonResponse({'error': f'Save error: {str(err)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# =====================================================
# BILLING - ULTRA SIMPLE & RELIABLE
# =====================================================
# @csrf_exempt
# def get_dental_request_details_op(request):
#     try:
#         registration_id = request.GET.get("Registration_id")
#         status_filter = request.GET.get("Status")

#         if not registration_id:
#             return JsonResponse([], safe=False)

#         op_reg = Patient_Appointment_Registration_Detials.objects.filter(
#             Registration_Id=registration_id
#         ).first()

#         if not op_reg:
#             return JsonResponse([], safe=False)

#         response_data = {
#             'RegistrationId': registration_id,
#             'VisitPurpose': 'DENTAL',
#             'BillingType': 'DENTAL',
#             'ServiceProcedureForm': 'DENTAL',
#             'dentallist': []
#         }

#         s_no = 1

#         # 🔥 ULTRA-SIMPLE: Direct query for unbilled items
#         items = DentalProcedureItem.objects.filter(
#             evaluation__Registration_Id=op_reg,
#             billed=False
#         )

#         for item in items:
#             if status_filter and item.status != status_filter:
#                 continue
            
#             response_data['dentallist'].append({
#                 'S_No': s_no,
#                 'request_id': item.id,
#                 'ServiceType': 'DENTAL',
#                 'ServiceName': item.procedures or 'Unnamed Procedure',
#                 'Test_Code': f"DENTAL-{item.tooth}",
#                 'SelectItemName': f"{item.procedures or 'Unnamed'} (Tooth {item.tooth})",
#                 'TestCode': f"DENTAL-{item.tooth}",
#                 'TestName': item.procedures or 'Unnamed Procedure',
#                 'Charges': float(item.fee or 0),
#                 'Amount': float(item.fee or 0),
#                 'Total': float((item.fee or 0) * (item.qty or 1)),
#                 'NetAmount': float((item.fee or 0) * (item.qty or 1)),
#                 'Quantity': int(item.qty or 1),
#                 'DiscountType': "",
#                 'Discount': "",
#                 'GST_per': "",
#                 'GST': "",
#                 'isReimbursable': "No",
#             })
#             s_no += 1

#         return JsonResponse([response_data], safe=False)

#     except Exception as e:
#         return JsonResponse({'error': f'Billing error: {str(e)}'}, status=500)





 
def get_dental_request_details_op(request):
    try:
        registration_id = request.GET.get("Registration_id")
        status_filter = request.GET.get("Status")
        if not registration_id:
            return JsonResponse([], safe=False)
 
        op_reg = Patient_Appointment_Registration_Detials.objects.filter(
            Registration_Id=registration_id
        ).first()
        if not op_reg:
            return JsonResponse([], safe=False)
 
        # ── Add temporary debug ────────────────────────────────
        all_items_count = DentalProcedureItem.objects.filter(
            evaluation__Registration_Id=op_reg
        ).count()
       
        unbilled_count = DentalProcedureItem.objects.filter(
            evaluation__Registration_Id=op_reg,
            billed=False
        ).count()
 
        response_data = {
            'RegistrationId': registration_id,
            'VisitPurpose': 'DENTAL',
            'BillingType': 'DENTAL',
            'ServiceProcedureForm': 'DENTAL',
            'debug': {
                'total_dental_items': all_items_count,
                'unbilled_items': unbilled_count,
                'Registration_pk': op_reg.pk,
            },
            'dentallist': []
        }
 
 
        s_no = 1
 
        # 🔥 ULTRA-SIMPLE: Direct query for unbilled items
        items = DentalProcedureItem.objects.filter(
            evaluation__Registration_Id=op_reg,
            billed=False
        )
 
        for item in items:
            if status_filter and item.status != status_filter:
                continue
           
            response_data['dentallist'].append({
                'S_No': s_no,
                'request_id': item.id,
                'ServiceType': 'DENTAL',
                'ServiceName': item.procedures or 'Unnamed Procedure',
                'Test_Code': f"DENTAL-{item.tooth}",
                'SelectItemName': f"{item.procedures or 'Unnamed'} (Tooth {item.tooth})",
                'TestCode': f"DENTAL-{item.tooth}",
                'TestName': item.procedures or 'Unnamed Procedure',
                'Charges': float(item.fee or 0),
                'Amount': float(item.fee or 0),
                'Total': float((item.fee or 0) * (item.qty or 1)),
                'NetAmount': float((item.fee or 0) * (item.qty or 1)),
                'Quantity': int(item.qty or 1),
                'DiscountType': "",
                'Discount': "",
                'GST_per': "",
                'GST': "",
                'isReimbursable': "No",
            })
            s_no += 1
 
        return JsonResponse([response_data], safe=False)
 
    except Exception as e:
        return JsonResponse({'error': f'Billing error: {str(e)}'}, status=500)
 
       




# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.core.exceptions import ObjectDoesNotExist
# import json
# import base64
# # from django.core.files.base import ContentFile


# from .models import (
#     DentalEMREvaluation,
#     DentalProcedureItem,
#     Patient_Appointment_Registration_Detials,
#     Patient_IP_Registration_Detials
# )

# @csrf_exempt
# def workbench_dentalemr_evaluation(request):
#     if request.method == 'GET':
#         reg_id = request.GET.get('RegistrationId')
#         reg_type = request.GET.get('RegistrationType')

#         if not reg_id or not reg_type:
#             return JsonResponse([], safe=False)

#         reg_type = reg_type.strip().upper()

#         try:
#             if reg_type == "IP":
#                 ip_reg = Patient_IP_Registration_Detials.objects.get(Registration_Id=reg_id)
#                 evaluations = DentalEMREvaluation.objects.filter(IP_RegistrationId=ip_reg)
#             else:
#                 op_reg = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=reg_id)
#                 evaluations = DentalEMREvaluation.objects.filter(Registration_Id=op_reg)

#             data = []
#             for e in evaluations:
#                 procedure_details = [
#                     {
#                         'tooth': item.tooth,
#                         'procedures': item.procedures or '',
#                         'status': item.status or '',
#                         'qty': item.qty or 1,
#                         'fee': item.fee or 0,
#                         'billed': getattr(item, 'billed', False)
#                     }
#                     for item in e.procedure_items.all().order_by('tooth')
#                 ]

#                 data.append({
#                     'Id': e.Id,
#                     'Procedures': e.procedures or '',
#                     'Existing': e.existing or '',
#                     'Planned': e.planned or '',
#                     'InProgress': e.in_progress or '',
#                     'Completed': e.completed or '',
#                     'Status': e.status or '',
#                     'Teeth': e.teeth or '',
#                     'Qty': e.qty or 0,
#                     'Amount': e.amount or 0,
#                     'ProcedureDetails': procedure_details,
#                     'ChooseDocument': e.choose_document.url if e.choose_document else None,
#                     # 'PatientSignature': (
#                     #     request.build_absolute_uri(e.patient_signature.url)
#                     #     if e.patient_signature else None
#                     # ),
#                     # 'PatientSignature': e.patient_signature.url if e.patient_signature else None,
#                 #    'PatientSignature': (request.build_absolute_uri(e.patient_signature.url)if e.patient_signature else None),
#                      'PatientSignature': e.patient_signature,
#                     'created_by': e.created_by or 'Unknown',
#                     'created_at': e.created_at.isoformat() if e.created_at else None,
#                 })
#             return JsonResponse(data, safe=False)

#         except Exception as err:
#             return JsonResponse({'error': f'Fetch error: {str(err)}'}, status=500)

#     elif request.method == 'POST':
#         try:
#             reg_id = request.POST.get('RegistrationId')
#             reg_type = request.POST.get('RegistrationType', '').strip().upper()

#             if not reg_id or reg_type not in ['OP', 'IP']:
#                 return JsonResponse({'error': 'Invalid RegistrationId or RegistrationType'}, status=400)

#             if reg_type == "IP":
#                 reg_obj = Patient_IP_Registration_Detials.objects.get(Registration_Id=reg_id)
#             else:
#                 reg_obj = Patient_Appointment_Registration_Detials.objects.get(Registration_Id=reg_id)

#             if reg_type == "IP":
#                 DentalProcedureItem.objects.filter(
#                     evaluation__IP_RegistrationId=reg_obj,
#                     billed=False
#                 ).delete()
#             else:
#                 DentalProcedureItem.objects.filter(
#                     evaluation__Registration_Id=reg_obj,
#                     billed=False
#                 ).delete()

#             eval_id = request.POST.get('Id')
#             if eval_id:
#                 try:
#                     e = DentalEMREvaluation.objects.get(Id=int(eval_id))
#                     e.procedure_items.all().delete()
#                 except (ValueError, DentalEMREvaluation.DoesNotExist):
#                     e = DentalEMREvaluation()
#             else:
#                 e = DentalEMREvaluation()

#             if reg_type == "IP":
#                 e.IP_RegistrationId = reg_obj
#                 e.Registration_Id = None
#             else:
#                 e.Registration_Id = reg_obj
#                 e.IP_RegistrationId = None

#             e.existing = request.POST.get('Existing', '')
#             e.planned = request.POST.get('Planned', '')
#             e.in_progress = request.POST.get('InProgress', '')
#             e.completed = request.POST.get('Completed', '')
#             e.status = request.POST.get('Status', '')
#             e.created_by = request.POST.get('created_by', 'Unknown User')

#             if 'ChooseDocument' in request.FILES:
#                 e.choose_document = request.FILES['ChooseDocument']

#             # ===============================
#             # SAVE PATIENT SIGNATURE (FIXED)
#             # ===============================
#             signature_data = request.POST.get("PatientSignature")
#             if signature_data and signature_data.startswith("data:image"):
#                 e.patient_signature = signature_data
      

# # Save ONLY if a new base64 signature is sent
#             # if signature_data and signature_data.startswith("data:image"):
#             #     try:
#             #         format, imgstr = signature_data.split(";base64,")
#             #         ext = format.split("/")[-1]

#             #         e.patient_signature.save(
#             #             f"patient_signature_{reg_id}.{ext}",
#             #             ContentFile(base64.b64decode(imgstr)),
#             #             save=False
#             #         )
#             #     except Exception as ex:
#             #         print("Signature save error:", ex)


#             e.save()

#             procedure_list = json.loads(request.POST.get('ProcedureDetails', '[]'))
#             total_amount = 0
#             total_qty = 0
#             teeth_list = []
#             procedures_summary = []

#             for item_data in procedure_list:
#                 try:
#                     tooth = int(item_data.get('tooth', 0))
#                     fee = float(item_data.get('fee', 0))
#                     qty = int(item_data.get('qty', 1))
#                     status = item_data.get('status', 'Planned')
#                     procedures = str(item_data.get('procedures', 'Unnamed'))

#                     DentalProcedureItem.objects.create(
#                         evaluation=e,
#                         tooth=tooth,
#                         procedures=procedures,
#                         status=status,
#                         qty=qty,
#                         fee=fee,
#                         billed=False
#                     )

#                     total_amount += fee * qty
#                     total_qty += qty
#                     teeth_list.append(str(tooth))
#                     procedures_summary.append(f"{procedures} - Tooth {tooth} ({status})")
#                 except Exception:
#                     continue

#             e.amount = total_amount
#             e.qty = total_qty
#             e.teeth = ", ".join(sorted(set(teeth_list)))
#             e.procedures = "\r\n".join(procedures_summary)
#             e.save()

#             return JsonResponse({'success': True, 'Id': e.Id})

#         except Exception as err:
#             return JsonResponse({'error': f'Save error: {str(err)}'}, status=500)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)

# # =====================================================
# # BILLING - ULTRA SIMPLE & RELIABLE
# # =====================================================



# def get_dental_request_details_op(request):
#     try:
#         registration_id = request.GET.get("Registration_id")
#         status_filter = request.GET.get("Status")
#         if not registration_id:
#             return JsonResponse([], safe=False)

#         op_reg = Patient_Appointment_Registration_Detials.objects.filter(
#             Registration_Id=registration_id
#         ).first()
#         if not op_reg:
#             return JsonResponse([], safe=False)

#         # ── Add temporary debug ────────────────────────────────
#         all_items_count = DentalProcedureItem.objects.filter(
#             evaluation__Registration_Id=op_reg
#         ).count()
        
#         unbilled_count = DentalProcedureItem.objects.filter(
#             evaluation__Registration_Id=op_reg,
#             billed=False
#         ).count()

#         response_data = {
#             'RegistrationId': registration_id,
#             'VisitPurpose': 'DENTAL',
#             'BillingType': 'DENTAL',
#             'ServiceProcedureForm': 'DENTAL',
#             'debug': {
#                 'total_dental_items': all_items_count,
#                 'unbilled_items': unbilled_count,
#                 'Registration_pk': op_reg.pk,
#             },
#             'dentallist': []
#         }


#         s_no = 1

#         # 🔥 ULTRA-SIMPLE: Direct query for unbilled items
#         items = DentalProcedureItem.objects.filter(
#             evaluation__Registration_Id=op_reg,
#             billed=False
#         )

#         for item in items:
#             if status_filter and item.status != status_filter:
#                 continue
            
#             response_data['dentallist'].append({
#                 'S_No': s_no,
#                 'request_id': item.id,
#                 'ServiceType': 'DENTAL',
#                 'ServiceName': item.procedures or 'Unnamed Procedure',
#                 'Test_Code': f"DENTAL-{item.tooth}",
#                 'SelectItemName': f"{item.procedures or 'Unnamed'} (Tooth {item.tooth})",
#                 'TestCode': f"DENTAL-{item.tooth}",
#                 'TestName': item.procedures or 'Unnamed Procedure',
#                 'Charges': float(item.fee or 0),
#                 'Amount': float(item.fee or 0),
#                 'Total': float((item.fee or 0) * (item.qty or 1)),
#                 'NetAmount': float((item.fee or 0) * (item.qty or 1)),
#                 'Quantity': int(item.qty or 1),
#                 'DiscountType': "",
#                 'Discount': "",
#                 'GST_per': "",
#                 'GST': "",
#                 'isReimbursable': "No",
#             })
#             s_no += 1

#         return JsonResponse([response_data], safe=False)

#     except Exception as e:
#         return JsonResponse({'error': f'Billing error: {str(e)}'}, status=500)

        
