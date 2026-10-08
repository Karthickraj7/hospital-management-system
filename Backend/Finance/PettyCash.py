from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import *
from Masters.models import *
from django.db.models import Q
import json
from django.apps import apps
import re
from datetime import datetime
from decimal import Decimal
 
 
@csrf_exempt
@require_http_methods(['POST','OPTIONS','GET'])
def postdataforpettycash(request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)
 
            updateId=data.get('id')
 
            Location=data.get('Location')
            ExpenceDate=data.get('ExpenceDate')
            IssueBy=data.get('IssueBy')
            Expenses=data.get('Expenses')
            ExpensesAmount=data.get('ExpensesAmount')
            Narration=data.get('Narration')
            Create_by=data.get('Create_by')
 
            billAmount=data.get('billAmount')
 
            Expenses_Table_inst=None
 
            print('dataaa',data)
 
            if Location:
                Location_ins=Location_Detials.objects.get(pk=Location)
            if Expenses:
                ExpensesMaster_ins=ExpensesMasterDetailes.objects.get(pk=Expenses)
 
            if updateId:
                Expenses_Table_inst=Frontoffice_Expenses_Table_Detailes.objects.get(pk=updateId)
                Expenses_Table_inst.ExpenceDate=ExpenceDate
                Expenses_Table_inst.IssueBy=IssueBy
                Expenses_Table_inst.ExpensesName=ExpensesMaster_ins
                Expenses_Table_inst.ExpensesAmount=ExpensesAmount
                Expenses_Table_inst.Remarks=Narration
                Expenses_Table_inst.Location=Location_ins
                Expenses_Table_inst.Updated_by=Create_by
 
                Expenses_Table_inst.save()
 
                Frontoffice_Expenses_Payment_Table_Detials.objects.filter(Voucher_Table=Expenses_Table_inst).delete()
 
            else:
                Expenses_Table_inst=Frontoffice_Expenses_Table_Detailes.objects.create(
                    ExpenceDate=ExpenceDate,
                    IssueBy=IssueBy,
                    ExpensesName=ExpensesMaster_ins,
                    ExpensesAmount=ExpensesAmount,
                    Remarks=Narration,
                    Location=Location_ins,
                    created_by=Create_by
                )
 
            if billAmount:
 
                for amount in billAmount:
                    Frontoffice_Expenses_Payment_Table_Detials.objects.create(
                        Voucher_Table = Expenses_Table_inst,
                        BillpayMethod = amount.get('BillpayMethod'),
                        paidamount = amount.get('paidamount'),
                        Remarks = amount.get('Remarks')
                    )
           
            return JsonResponse ({'success': 'Save successfully'})
 
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
    elif request.method == 'GET':
        try:
            StatusCheck = request.GET.get('StatusCheck')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            IssueBy = request.GET.get('IssueBy')
 
            dataArr=[]
 
            query=Q()
 
            if StatusCheck:
                query &= Q(Status=StatusCheck)
            if IssueBy:
                query &= Q(IssueBy__icontains=IssueBy)
            if DateType == 'CurrentDate' and CurrentDate:
                query &= Q(DayCloseingDate=CurrentDate)
            elif DateType == 'Customize' and FromDate and ToDate:
                query &= Q(DayCloseingDate__range=[FromDate, ToDate])
 
            Expenses_Table_ins=Frontoffice_Expenses_Table_Detailes.objects.filter(query)
 
            for expence in Expenses_Table_ins:
                objc={
                    'id':expence.pk,
                    'Location':expence.Location.Location_Id,
                    'LocationName':expence.Location.Location_Name,
                    'ExpenceDate':expence.ExpenceDate,
                    'IssueBy':expence.IssueBy,
                    'ExpensesNameId':expence.ExpensesName.pk,
                    'ExpensesName':expence.ExpensesName.ExpensesName,
                    'ExpensesAmount':expence.ExpensesAmount,
                    'Narration':expence.Remarks,
                    'Status':expence.Status,
                    'billAmount':[]
                }
                Payment_Table_ins=Frontoffice_Expenses_Payment_Table_Detials.objects.filter(Voucher_Table=expence)
               
                for payment in Payment_Table_ins:
                    payment_obj = {
                        'id':payment.pk,
                        'BillpayMethod': payment.BillpayMethod,
                        'paidamount': payment.paidamount,
                        'Remarks': payment.Remarks
                    }
                    objc['billAmount'].append(payment_obj)
               
                dataArr.append(objc)
 
 
            return JsonResponse(dataArr, safe=False)
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})
       
 
@csrf_exempt
@require_http_methods(['POST','OPTIONS','GET'])
def postdataforDayclosing(request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)
 
            updateId=data.get('id')
 
            Location=data.get('Location')
            Narration=data.get('Narration')
            Create_by=data.get('Create_by')
 
            closeingDate=data.get('closeingDate')
            IssueBy=data.get('IssueBy')
            OpeningCash=data.get('OpeningCash')
            OPCollectionCash=data.get('OPCollectionCash')
            IPCollectionCash=data.get('IPCollectionCash')
            TotalCash=data.get('TotalCollection')
            CashTotal=data.get('CashTotal')
            CardTotal=data.get('CardTotal')
            UPITotal=data.get('UPITotal')
            ExpensesCash=data.get('RefundCash')
            AvailableCash=data.get('AvailableCash')
            HandoverCash=data.get('HandoverCash')
            BalanceCash=data.get('BalanceCash')
            Handoverto=data.get('HandOverTo')
           
            if Location:
                Location_ins=Location_Detials.objects.get(pk=Location)
           
            if updateId:
                DayCloseing_ins=Frontoffice_DayCloseing_Table_Detials.objects.get(pk=updateId)
                DayCloseing_ins.DayCloseingDate=closeingDate
                DayCloseing_ins.IssueBy=IssueBy
                DayCloseing_ins.OpeningCash=OpeningCash
                DayCloseing_ins.OPCollectionCash=OPCollectionCash
                DayCloseing_ins.IPCollectionCash=IPCollectionCash
                DayCloseing_ins.TotalCash=TotalCash
                DayCloseing_ins.ExpensesCash=ExpensesCash
                DayCloseing_ins.AvailableCash=AvailableCash
                DayCloseing_ins.HandoverCash=HandoverCash
                DayCloseing_ins.BalanceCash=BalanceCash
                DayCloseing_ins.Narration=Narration
                DayCloseing_ins.CashTotal=CashTotal
                DayCloseing_ins.CardTotal=CardTotal
                DayCloseing_ins.UPITotal=UPITotal
                DayCloseing_ins.Handoverto=Handoverto
                DayCloseing_ins.Location=Location_ins
                DayCloseing_ins.Updated_by=Create_by
                DayCloseing_ins.save()
               
               
                return JsonResponse ({'success': 'Update successfully'})
 
           
            else:
                Frontoffice_DayCloseing_Table_Detials.objects.create(
                    DayCloseingDate=closeingDate,
                    IssueBy=IssueBy,
                    OpeningCash=OpeningCash,
                    OPCollectionCash=OPCollectionCash,
                    IPCollectionCash=IPCollectionCash,
                    TotalCash=TotalCash,
                    ExpensesCash=ExpensesCash,
                    AvailableCash=AvailableCash,
                    HandoverCash=HandoverCash,
                    BalanceCash=BalanceCash,
                    Narration=Narration,
                    CashTotal=CashTotal,
                    CardTotal=CardTotal,
                    UPITotal=UPITotal,
                    Location=Location_ins,
                    created_by=Create_by
                )
 
                return JsonResponse ({'success': 'Save successfully'})
 
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
 
    elif request.method == 'GET':
        try:
 
            StatusCheck = request.GET.get('StatusCheck')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            IssueBy = request.GET.get('IssueBy')
           
            dataArr=[]
 
            query=Q()
 
            if StatusCheck:
                query &= Q(Status=StatusCheck)
            if IssueBy:
                query &= Q(IssueBy__icontains=IssueBy)
            if DateType == 'CurrentDate' and CurrentDate:
                query &= Q(ExpenceDate=CurrentDate)
            elif DateType == 'Customize' and FromDate and ToDate:
                query &= Q(ExpenceDate__range=[FromDate, ToDate])
 
 
            Frontoffice_DayCloseing_ins=Frontoffice_DayCloseing_Table_Detials.objects.filter(query)
 
            for row in Frontoffice_DayCloseing_ins:
                objc={
                    'id':row.pk,
                    'Location':row.Location.Location_Id,
                    'LocationName':row.Location.Location_Name,
                    'closeingDate':row.DayCloseingDate,
                    'IssueBy':row.IssueBy,
                    'OpeningCash':row.OpeningCash,
                    'OPCollectionCash':row.OPCollectionCash,
                    'IPCollectionCash':row.IPCollectionCash,
                    'TotalCash':row.TotalCash,
                    'ExpensesCash':row.ExpensesCash,
                    'AvailableCash':row.AvailableCash,
                    'HandoverCash':row.HandoverCash,
                    'BalanceCash':row.BalanceCash,
                    'Narration':row.Narration,
                    'Status':row.Status
                }
                dataArr.append(objc)
 
            return JsonResponse(dataArr, safe=False)
 
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
 
@csrf_exempt
@require_http_methods(['POST','OPTIONS','GET'])
def postdataforShiftclosing(request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)
 
            updateId=data.get('id')
 
            Location=data.get('Location')
            Narration=data.get('Narration')
            Create_by=data.get('Create_by')
 
            ShiftName=data.get('ShiftName')
            closeingDate=data.get('closeingDate')
            IssueBy=data.get('IssueBy')
            OpeningCash=data.get('OpeningCash')
            OPCollectionCash=data.get('OPCollection')
            IPCollectionCash=data.get('IPCollection')
            TotalCash=data.get('TotalCollection')
            CashTotal=data.get('CashTotal')
            CardTotal=data.get('CardTotal')
            UPITotal=data.get('UPITotal')
            ExpensesCash=data.get('RefundCash')
            AvailableCash=data.get('AvailableCash')
            HandoverCash=data.get('HandoverCash')
            BalanceCash=data.get('BalanceCash')
            Handoverto=data.get('HandOverTo')
            print('dataaa',data)
            if Location:
                Location_ins=Location_Detials.objects.get(pk=Location)
           
            if updateId:
                DayCloseing_ins=Frontoffice_ShiftClosing_Table_Detials.objects.get(pk=updateId)
                DayCloseing_ins.Shiftname=ShiftName
                DayCloseing_ins.DayCloseingDate=closeingDate
                DayCloseing_ins.IssueBy=IssueBy
                DayCloseing_ins.OpeningCash=OpeningCash
                DayCloseing_ins.OPCollectionCash=OPCollectionCash
                DayCloseing_ins.IPCollectionCash=IPCollectionCash
                DayCloseing_ins.TotalCash=TotalCash
                DayCloseing_ins.ExpensesCash=ExpensesCash
                DayCloseing_ins.AvailableCash=AvailableCash
                DayCloseing_ins.HandoverCash=HandoverCash
                DayCloseing_ins.BalanceCash=BalanceCash
                DayCloseing_ins.Narration=Narration
                DayCloseing_ins.CashTotal=CashTotal
                DayCloseing_ins.CardTotal=CardTotal
                DayCloseing_ins.UPITotal=UPITotal
                DayCloseing_ins.Handoverto=Handoverto
                DayCloseing_ins.Location=Location_ins
                DayCloseing_ins.Updated_by=Create_by
                DayCloseing_ins.save()
               
               
                return JsonResponse ({'success': 'Update successfully'})
 
           
            else:
                shift_closing_check = Frontoffice_ShiftClosing_Table_Detials.objects.filter(DayCloseingDate = closeingDate,IssueBy = IssueBy).exists()
                if shift_closing_check:
                    return JsonResponse({'error':f"Shift Closing Details Already exists for {IssueBy} in {closeingDate}"})
                Frontoffice_ShiftClosing_Table_Detials.objects.create(
                    DayCloseingDate=closeingDate,
                    Shiftname = ShiftName,
                    IssueBy=IssueBy,
                    OpeningCash=OpeningCash,
                    OPCollectionCash=OPCollectionCash,
                    IPCollectionCash=IPCollectionCash,
                    TotalCash=TotalCash,
                    ExpensesCash=ExpensesCash,
                    AvailableCash=AvailableCash,
                    HandoverCash=HandoverCash,
                    BalanceCash=BalanceCash,
                    Narration=Narration,
                    CashTotal=CashTotal,
                    CardTotal=CardTotal,
                    UPITotal=UPITotal,
                    Location=Location_ins,
                    created_by=Create_by,
                    Handoverto = Handoverto,
                )
 
                return JsonResponse ({'success': 'Save successfully'})
 
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
 
    elif request.method == 'GET':
        try:
 
            StatusCheck = request.GET.get('StatusCheck')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            IssueBy = request.GET.get('IssueBy')
           
            dataArr=[]
 
            query=Q()
 
            if StatusCheck:
                query &= Q(Status=StatusCheck)
            if IssueBy:
                query &= Q(IssueBy__icontains=IssueBy)
            if DateType == 'CurrentDate' and CurrentDate:
                query &= Q(DayCloseingDate=CurrentDate)
            elif DateType == 'Customize' and FromDate and ToDate:
                query &= Q(DayCloseingDate__range=[FromDate, ToDate])
 
 
            Frontoffice_DayCloseing_ins=Frontoffice_ShiftClosing_Table_Detials.objects.filter(query)
 
            for idx,row in enumerate(Frontoffice_DayCloseing_ins,start=1):
                objc={
                    'id':idx,
                    'Location':row.Location.Location_Id,
                    'LocationName':row.Location.Location_Name,
                    'ShiftName':row.Shiftname,
                    'closeingDate':row.DayCloseingDate,
                    'IssueBy':row.IssueBy,
                    'OpeningCash':row.OpeningCash,
                    'OPCollection':row.OPCollectionCash,
                    'IPCollection':row.IPCollectionCash,
                    'TotalCollection':row.TotalCash,
                    'CashTotal':row.CashTotal,
                    'CardTotal':row.CardTotal,
                    'UPITotal':row.UPITotal,
                    'RefundCash':row.ExpensesCash,
                    'AvailableCash':row.AvailableCash,
                    'HandoverCash':row.HandoverCash,
                    'BalanceCash':row.BalanceCash,
                    'Narration':row.Narration,
                    'HandOverTo':row.Handoverto,
                    'Status':row.Status
                }
                dataArr.append(objc)
 
            return JsonResponse(dataArr, safe=False)
 
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
 
 
 