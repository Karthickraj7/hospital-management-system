from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from Insurance.models import *
from django.db.models import Q
import json


@csrf_exempt
@require_http_methods(['GET'])
def Signal_ClientPatientEntry_Get_Details(request):
    try:
        Patient_arr = []

        Status=request.GET.get('Filterby')
        ServiceType=request.GET.get('ServiceType')
        PatientId=request.GET.get('PatientId')
        PatientName=request.GET.get('PatientName')

        query = Q()

        if Status:
            if Status !='ALL':
                query &= Q(Papersstatus=Status)
        if ServiceType:
            query &= Q(Patient_ServiesType=ServiceType)

        insurance_entries = Client_Patient_Entry_Details.objects.filter(query)

        for entry in insurance_entries:
            related_instance = entry.IP_Registration  
            Patient_inst = getattr(related_instance, 'PatientId', None)  

            if Patient_inst is not None:
                Patient_dec = {
                    'id': entry.pk,
                    'PatientServiesType': getattr(entry, 'Patient_ServiesType',''),
                    'RegistrationId': related_instance.pk,
                    'PatientId': getattr(Patient_inst, 'PatientId',''),
                    'PatientName': f"{getattr(Patient_inst, 'FirstName', '')} {getattr(Patient_inst, 'MiddleName', '')} {getattr(Patient_inst, 'SurName', '')}",
                    'PhoneNo': getattr(Patient_inst, 'PhoneNo',''),
                    'ClientId': getattr(getattr(related_instance, 'ClientName',''), 'pk',''),
                    'ClientName': getattr(getattr(related_instance, 'ClientName',''), 'Client_Name',''),
                    'Papersstatus':entry.Papersstatus,
                    'CreatedAt':entry.Created_at.strftime('%d-%m-%Y')
                }
                # print('Patient Data:', Patient_dec)
                Patient_arr.append(Patient_dec)

        if PatientId:
            Patient_arr = [p for p in Patient_arr if PatientId in p.get('PatientId', '')]
        if PatientName:
            Patient_arr = [p for p in Patient_arr if PatientName.lower() in p.get('PatientName', '').lower()]



        return JsonResponse(Patient_arr, safe=False)

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse ({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(['GET'])
def Get_StatusCount_Client(request):
    try:

        All_count = Client_Patient_Entry_Details.objects.all().count()
        Pending_count = Client_Patient_Entry_Details.objects.filter(Papersstatus='PENDING').count()
        APPROVED_count = Client_Patient_Entry_Details.objects.filter(Papersstatus='APPROVED').count()
        REJECTED_count = Client_Patient_Entry_Details.objects.filter(Papersstatus='REJECTED').count()
        COMPLETED_count = Client_Patient_Entry_Details.objects.filter(Papersstatus='COMPLETED').count()

        Count_data={
            
            'Allcount':All_count,
            'Pendingcount':Pending_count,
            'ApprovedCount':APPROVED_count,
            'RejectedCount':REJECTED_count,
            'CompletedCount':COMPLETED_count
            }

        return JsonResponse (Count_data,safe=False)
    
    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


def parse_date_safe(date_str):
    """Safely parse a date string to a date object."""
    if date_str:
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            print(f"Invalid date format: {date_str}")
            return None
    return None



@csrf_exempt
@require_http_methods(["POST","GET"])
def Post_Client_Patient_Detailes(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            TableId=data.get('TableId')

            print('11111',TableId)
            
            PreAuthDate=data.get('PreAuthDate')
            PreAuthAmount=data.get('PreAuthAmount')
            DischargeDate=data.get('DischargeDate')
            FinalBillAmount=data.get('FinalBillAmount')
            RaisedAmount=data.get('RaisedAmount')
            ApprovedAmount=data.get('ApprovedAmount')
            CourierDate=data.get('CourierDate')
            SettlementDateCount=data.get('SettlementDateCount')
            
            Created_By=data.get('Created_By')

            Status=data.get('Status')


            AmountArray=data.get('AmountArray')

            copayment_details = data.get('CoPaymentDetails', {})
            print("copayment_details",copayment_details)
            CoPaymentType = copayment_details.get('CoPaymentType','')
            CoPaymentTypeValuestr = copayment_details.get('CoPaymentTypeValue',0)
            CoPaymentTypeValue = float(CoPaymentTypeValuestr) if CoPaymentTypeValuestr !='' else 0
            CoPaymentBillAmountstr = copayment_details.get('CoPaymentBillAmount',0)
            CoPaymentBillAmount = float(CoPaymentBillAmountstr) if CoPaymentBillAmountstr !='' else 0
            CoPaymentFinalAmountstr = copayment_details.get('CoPaymentFinalAmount',0)
            CoPaymentFinalAmount = float(CoPaymentFinalAmountstr) if CoPaymentFinalAmountstr !='' else 0

            CoPaymentCoverage= data.get('CoPaymentCoverage','No')
            print("CoPaymentCoverage",CoPaymentCoverage)
            TdsPercentagestr = data.get('TdsPercentage',0)
            print("TdsPercentage",TdsPercentagestr)
            TdsPercentage = float(TdsPercentagestr) if TdsPercentagestr !='' else 0
            TdsAmountstr = data.get('TdsAmount',0)
            print("TdsAmount",TdsAmountstr)
            TdsAmount = float(TdsAmountstr) if TdsAmountstr !='' else 0 
            FinalSettlementAmountstr = data.get('FinalSettlementAmount',0)
            print('FinalSettlementAmount',FinalSettlementAmountstr)
            FinalSettlementAmount = float(FinalSettlementAmountstr) if FinalSettlementAmountstr !='' else 0 

            Client_Patient_Entery=Client_Patient_Entry_Details.objects.get(pk=TableId)

            if Client_Patient_Entery :
                Client_Patient_Entery.PreAuthDate = parse_date_safe(PreAuthDate)
                Client_Patient_Entery.PreAuthAmount = PreAuthAmount
                Client_Patient_Entery.DischargeDate = parse_date_safe(DischargeDate)
                Client_Patient_Entery.FinalBillAmount = FinalBillAmount
                Client_Patient_Entery.RaisedAmount = RaisedAmount
                Client_Patient_Entery.ApprovedAmount = ApprovedAmount
                Client_Patient_Entery.CourierDate = parse_date_safe(CourierDate)
                Client_Patient_Entery.SettlementDateCount = SettlementDateCount
                Client_Patient_Entery.TdsPercentage = TdsPercentage
                Client_Patient_Entery.TdsAmount = TdsAmount
                Client_Patient_Entery.FinalSettlementAmount = FinalSettlementAmount


                if CoPaymentCoverage == 'Yes':
                    Client_Patient_Entery.IsCopayment = CoPaymentCoverage
                    Client_Patient_Entery.CopaymentBillAmount = CoPaymentBillAmount
                    Client_Patient_Entery.CopaymentType = CoPaymentType
                    Client_Patient_Entery.CopaymentTypeValue = CoPaymentTypeValue
                    Client_Patient_Entery.CoPaymentFinalAmount = CoPaymentFinalAmount
                else:
                    Client_Patient_Entery.IsCopayment = 'No'
                    Client_Patient_Entery.CopaymentBillAmount = 0
                    Client_Patient_Entery.CopaymentType = ''
                    Client_Patient_Entery.CopaymentTypeValue = 0
                    Client_Patient_Entery.CoPaymentFinalAmount = 0


                if Status :
                    Client_Patient_Entery.Papersstatus=Status
                
                Client_Patient_Entery.save()

                if AmountArray:

                    Client_Patient_Amount_Details.objects.filter(
                    Client_Entry=Client_Patient_Entery
                    ).delete()

                    for row in AmountArray :
                        Client_Patient_Amount_Details.objects.create(
                            Client_Entry=Client_Patient_Entery,
                            SettlementDate=parse_date_safe(row.get('SettlementDate')),
                            SettlementAmount=row.get('SettlementAmount'),
                            UTR_Number=row.get('UTRNumber'),
                            Created_By=Created_By
                        )


            else:
                return JsonResponse ({'warn': 'Patient Entery Find.Patient Not Found'})


            return JsonResponse ({'success': 'Save successfully'})
        except Exception as e:
            print(f'An error Accurred :{str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})

    if request.method == 'GET':
        try:
            GetId = request.GET.get('GetId')
            print('GetId', GetId)

            patient_Detailes = {}
            Single_Ins = Client_Patient_Entry_Details.objects.get(pk=GetId)

            # Base patient details
            patient_Detailes = {
                'PreAuthDate': Single_Ins.PreAuthDate,
                'PreAuthAmount': Single_Ins.PreAuthAmount,
                'DischargeDate': Single_Ins.DischargeDate,
                'FinalBillAmount': Single_Ins.FinalBillAmount,
                'RaisedAmount': Single_Ins.RaisedAmount,
                'ApprovedAmount': Single_Ins.ApprovedAmount,
                'CourierDate': Single_Ins.CourierDate,
                'SettlementDateCount': Single_Ins.SettlementDateCount,
                'TdsPercentage': Single_Ins.TdsPercentage,
                'TdsAmount': Single_Ins.TdsAmount,
                'FinalSettlementAmount': Single_Ins.FinalSettlementAmount,
                'CoPaymentCoverage': Single_Ins.IsCopayment,
                'AmountArray': []
            }

            # Include copayment details only if CoPaymentCoverage is 'Yes'
            if Single_Ins.IsCopayment == 'Yes':
                patient_Detailes.update({
                    'CoPaymentType': Single_Ins.CopaymentType,
                    'CoPaymentTypeValue': Single_Ins.CopaymentTypeValue,
                    'CoPaymentBillAmount': Single_Ins.CopaymentBillAmount,
                    'CoPaymentFinalAmount': Single_Ins.CoPaymentFinalAmount,
                })

            Amount_Array = Client_Patient_Amount_Details.objects.filter(Client_Entry=Single_Ins)
            if Amount_Array:
                num = 1
                for row in Amount_Array:
                    patient_Detailes['AmountArray'].append({
                        'id': num,
                        'SettlementDate': row.SettlementDate,
                        'SettlementAmount': row.SettlementAmount,
                        'UTRNumber': row.UTR_Number,
                    })
                    num += 1

            return JsonResponse(patient_Detailes, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})






@csrf_exempt
@require_http_methods(["POST","GET"])
def Update_StatusFor_Client_Patient_Detailes(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            print('+++++++++',data)
            
            InstId=data.get('InstId')
            Status=data.get('Status')

            

            Client_Patient_Entery_Ins=Client_Patient_Entry_Details.objects.get(pk=InstId)

            Client_Patient_Entery_Ins.Papersstatus=Status

            Client_Patient_Entery_Ins.save()

            return JsonResponse({'success': 'Update Status successfully'})
        
        except Exception as e:
            print(f'An error occurred :{str(e)}')
            return JsonResponse({'error':f'An error occurred :{str(e)}'})      




@csrf_exempt
@require_http_methods(['GET'])
def Client_Details_get(request):
    try:
        ClientId = request.GET.get('ClientId')
        print("ClientId",ClientId)

        if not ClientId:
            return JsonResponse({'warn': 'Client is not found'})
        
        try:
            client_details = Client_Master_Detials.objects.get(Client_Id=ClientId)
        except Client_Master_Detials.DoesNotExist:
            return JsonResponse({'warn': 'Client details not found'})

        client_data = [{
            'ClientId':client_details.Client_Id,
            'Client_Name':client_details.Client_Name,
            'ContactPerson':client_details.ContactPerson or '',
            'MailId':client_details.MailId or '',
            'PhoneNumber':client_details.PhoneNumber or '',

        }]
        return JsonResponse(client_data, safe=False)

    
    except Exception as e:
        return JsonResponse({'error': str(e)})