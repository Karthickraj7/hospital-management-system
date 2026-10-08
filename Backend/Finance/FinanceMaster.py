# from django.views.decorators.http import require_http_methods
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from .models import *
# from django.db.models import Q
# import json
# from django.apps import apps
# import re
# from . import FinanceMaster
# from datetime import datetime
# from decimal import Decimal

# @csrf_exempt
# @require_http_methods(['GET'])
# def Get_Finance_PrimeGroupMasters(request):
#     if request.method == 'GET':
#         try:
#             Finance_PrimeGgroup_Inst=Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Prime')

#             Group_Arr=[]

#             for row in Finance_PrimeGgroup_Inst:
#                 Group_Dis={
#                     'id':row.pk,
#                     'GroupName':row.GroupName,
#                 }
#                 Group_Arr.append(Group_Dis)


#             return JsonResponse(Group_Arr,safe=False)
        
#         except Exception as e:
#             print(f'An error Accurred:{str(e)}')
#             return JsonResponse({'error':f'An error Accurred:{str(e)}'})
        
# # ---------------------------------------------------------------------------------


# @csrf_exempt
# @require_http_methods(["GET"])
# def  Get_NatureOfGroupMaster_detailes(request):
#     if request.method == 'GET':
#         try:
#             NatureOfGroup_Ins=Finance_NatureOfGroup_Detailes.objects.all()

#             NOG_Arr=[]

#             for row in NatureOfGroup_Ins:
#                 NOG_dec={
#                     'id':row.pk,
#                     'NatureOfGroupName':row.NatureOfGroupName,
#                 }
#                 NOG_Arr.append(NOG_dec)

#             return JsonResponse(NOG_Arr,safe=False)

#         except Exception as e:
#             print(f'An error Accurred:{str(e)}')
#             return JsonResponse({'error':f'An error Accurred:{str(e)}'})
        
# # ---------------------------------------------------------------------------------


# @csrf_exempt
# @require_http_methods(["POST"])
# def Postdata_GroupMasters(request):
#     if request.method == 'POST':
#         try:
#             data=json.loads(request.body)

#             # print('tttttttttt',data)

#             GroupName=data.get('GroupName')
#             UnderCategory=data.get('UnderCategory')
#             NatureOfGroup=data.get('NatureOfGroup')
#             createby=data.get('createby')

#             EditGroupID=data.get('EditGroupID')

#             # print(UnderCategory,EditGroupID,'iiiiiiii')

#             if EditGroupID:
#                 Update_Ins=Finance_GroupMaster_Detailes.objects.get(pk=EditGroupID)
#                 Update_Ins.GroupName=GroupName
#                 Update_Ins.Updated_by=createby

#                 if UnderCategory == 'Prime':
#                     NatureOfGroup_INS=Finance_NatureOfGroup_Detailes.objects.get(pk=NatureOfGroup)
#                     Update_Ins.NatureOfGroup=NatureOfGroup_INS
#                     Update_Ins.ParentGroup=None
#                     Update_Ins.TypeofGroup=UnderCategory
#                 else:
#                     # print('kkkkkk')                   
#                     Finance_Prime_Group_INS=Finance_GroupMaster_Detailes.objects.get(pk=UnderCategory)
#                     Update_Ins.NatureOfGroup=Finance_Prime_Group_INS.NatureOfGroup
#                     Update_Ins.ParentGroup=Finance_Prime_Group_INS   
#                     Update_Ins.TypeofGroup='Sub'

#                 Update_Ins.save()
#                 return JsonResponse ({'success': 'Update successfully'})


#             else:
#                 if UnderCategory == 'Prime':
#                     NatureOfGroup_INS=Finance_NatureOfGroup_Detailes.objects.get(pk=NatureOfGroup)
#                     Finance_GroupMaster_Detailes.objects.create(
#                         GroupName=GroupName,
#                         TypeofGroup=UnderCategory,
#                         NatureOfGroup=NatureOfGroup_INS,
#                         created_by=createby
#                     )
                
#                 else:
#                     Finance_Prime_Group_INS=Finance_GroupMaster_Detailes.objects.get(pk=UnderCategory)
#                     Finance_GroupMaster_Detailes.objects.create(
#                     GroupName=GroupName,
#                     TypeofGroup='Sub',
#                     ParentGroup=Finance_Prime_Group_INS,
#                     NatureOfGroup=Finance_Prime_Group_INS.NatureOfGroup,
#                     created_by=createby
#                     )

#                 return JsonResponse ({'success': 'Save successfully'})

#         except Exception as e:
#             print(f'An error Accurred:{str(e)}')
#             return JsonResponse({'error':f'An error Accurred:{str(e)}'})
         

# # ---------------------------------------------------------------------------------



# @csrf_exempt
# @require_http_methods(['GET'])
# def allgrouplistmasterget(request):
#     if request.method == 'GET':
#         try:
#             GroupArray=[]
#             Get_Group=Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Prime')            
#             if Get_Group:
#                 for row in Get_Group:
#                     dataObj={
#                         'id':row.pk,
#                         'GroupName':row.GroupName,
#                         'UnderGroupId':row.TypeofGroup,
#                         'NatureOfGroupId':row.NatureOfGroup.pk,
#                         'UnderGroup':row.NatureOfGroup.NatureOfGroupName,
#                     }
#                     GroupArray.append(dataObj)
#                     Get_SubGroup=Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Sub',ParentGroup=row)
#                     if Get_SubGroup:
#                         for subrow in Get_SubGroup:
#                             subdataObj={
#                                 'id':subrow.pk,
#                                 'GroupName':subrow.GroupName,
#                                 'UnderGroupId':subrow.ParentGroup.pk,
#                                 'NatureOfGroupId':subrow.ParentGroup.NatureOfGroup.pk,
#                                 'UnderGroup':subrow.ParentGroup.GroupName,
#                             }
#                             GroupArray.append(subdataObj)
#             # print('dataArray',GroupArray)
#             return JsonResponse(GroupArray,safe=False)
#         except Exception as e:
#             print(f'An error Accurred:{str(e)}')
#             return JsonResponse({'error':f'An error Accurred:{str(e)}'})


# # ---------------------------------------------------------------------------------


# @csrf_exempt
# @require_http_methods(['POST','GET'])
# def postledgermasterdata (request):
#     if request.method == 'POST':
#         try:
#             data=json.loads(request.body)

#             # print('data',data)

#             LedgerName=data.get('LedgerName')
#             GroupName=data.get('GroupName')
#             OpeningBalance=data.get('OpeningBalance')
#             DebitOrCredit=data.get('DebitOrCredit')
#             PhoneNumber=data.get('PhoneNumber')
#             PANORITNO=data.get('PANORITNO')
#             GSTNo=data.get('GSTNo')
#             Address=data.get('Address')
#             ProvideBankDetails=data.get('ProvideBankDetails')

#             BankHolderName=data.get('BankHolderName')
#             BankName=data.get('BankName')
#             AccountNumber=data.get('AccountNumber')
#             Branch=data.get('Branch')
#             IFSCcode=data.get('IFSCcode')
#             PanNumber=data.get('PanNumber')

#             createby=data.get('createby')

#             LedgerEditId=data.get('LedgerEditId')

#             if GroupName:
#                 GroupMaster_Ins=Finance_GroupMaster_Detailes.objects.get(pk=GroupName)

#             if LedgerEditId:
#                 LedgerMasters_Ins=Finance_LedgerMasters_Detailes.objects.get(pk=LedgerEditId)
                
#                 LedgerMasters_Ins.LedgerName=LedgerName
#                 LedgerMasters_Ins.LedgerGroupName=GroupMaster_Ins
#                 LedgerMasters_Ins.OpeningBalance=OpeningBalance
#                 LedgerMasters_Ins.DebitOrCredit=DebitOrCredit
#                 LedgerMasters_Ins.PhoneNumber=PhoneNumber
#                 LedgerMasters_Ins.PANorITNo=PANORITNO
#                 LedgerMasters_Ins.GSTNo=GSTNo
#                 LedgerMasters_Ins.Address=Address
#                 LedgerMasters_Ins.ProvideBankDetails=ProvideBankDetails
#                 LedgerMasters_Ins.Updated_by=createby
#                 LedgerMasters_Ins.save()
#                 if ProvideBankDetails == True :
#                     try:
#                         LedgerMasters_Bank_Ins=Finance_LedgerMasters_Bank_Detailes.objects.get(LedgerMaster=LedgerMasters_Ins)
            
#                         LedgerMasters_Bank_Ins.BankHolderName=BankHolderName
#                         LedgerMasters_Bank_Ins.BankName=BankName
#                         LedgerMasters_Bank_Ins.AccountNumber=AccountNumber
#                         LedgerMasters_Bank_Ins.Branch=Branch
#                         LedgerMasters_Bank_Ins.IFSCcode=IFSCcode
#                         LedgerMasters_Bank_Ins.PANNumber=PanNumber
#                         LedgerMasters_Bank_Ins.save()

#                     except Finance_LedgerMasters_Bank_Detailes.DoesNotExist:
                        
#                         Finance_LedgerMasters_Bank_Detailes.objects.create(
#                         LedgerMaster=LedgerMasters_Ins,
#                         BankHolderName=BankHolderName,
#                         BankName=BankName,
#                         AccountNumber=AccountNumber,
#                         Branch=Branch,
#                         IFSCcode=IFSCcode,
#                         PANNumber=PanNumber
#                         )
#                 else:
#                     LedgerMasters_Bank_Ins = Finance_LedgerMasters_Bank_Detailes.objects.filter(LedgerMaster=LedgerMasters_Ins)
#                     if LedgerMasters_Bank_Ins.exists():
#                         LedgerMasters_Bank_Ins.delete()
#                     else:
#                         print("No matching record found in Finance_LedgerMasters_Bank_Detailes for the given LedgerMaster.")


#                 return JsonResponse ({'success': 'Update successfully'})

#             else:
#                 Ledger_Ins = Finance_LedgerMasters_Detailes.objects.create(
#                     LedgerName=LedgerName,
#                     LedgerGroupName=GroupMaster_Ins,
#                     OpeningBalance=OpeningBalance,
#                     DebitOrCredit=DebitOrCredit,
#                     PhoneNumber=PhoneNumber,
#                     PANorITNo=PANORITNO,
#                     GSTNo=GSTNo,
#                     Address=Address,
#                     ProvideBankDetails=ProvideBankDetails,
#                     created_by=createby
#                 )

#                 if ProvideBankDetails == True :
#                     Finance_LedgerMasters_Bank_Detailes.objects.create(
#                         LedgerMaster=Ledger_Ins,
#                         BankHolderName=BankHolderName,
#                         BankName=BankName,
#                         AccountNumber=AccountNumber,
#                         Branch=Branch,
#                         IFSCcode=IFSCcode,
#                         PANNumber=PanNumber
#                     )
                                    
#                 return JsonResponse ({'success': 'Save successfully'})

#         except Exception as e:
#             print(f'An error Accurred:{str(e)}')
#             return JsonResponse({'error':f'An error Accurred:{str(e)}'})
    
#     elif request.method == 'GET':
#         try:

#             LedgerArray=[]

#             LedgerMasters=Finance_LedgerMasters_Detailes.objects.all()

#             for Ledger in LedgerMasters:
#                 Led_dic={
#                     'id':Ledger.pk,
#                     'LedgerName':Ledger.LedgerName,
#                     'GroupName':Ledger.LedgerGroupName.pk,
#                     'UseGroupName':Ledger.LedgerGroupName.GroupName,
#                     'OpeningBalance':Ledger.OpeningBalance,
#                     'DebitOrCredit':Ledger.DebitOrCredit,
#                     'PhoneNumber':Ledger.PhoneNumber,
#                     'PANORITNO':Ledger.PANorITNo,
#                     'GSTNo':Ledger.GSTNo,
#                     'Address':Ledger.Address,
#                     'ProvideBankDetails':Ledger.ProvideBankDetails,
#                 }         

#                 if Led_dic['ProvideBankDetails'] == True :
#                     Bank_Detailes=Finance_LedgerMasters_Bank_Detailes.objects.get(LedgerMaster=Ledger)
#                     if Bank_Detailes:
#                         Led_dic['Bank_Detailes']={
#                             'BankHolderName':Bank_Detailes.BankHolderName,
#                             'BankName':Bank_Detailes.BankName,
#                             'AccountNumber':Bank_Detailes.AccountNumber,
#                             'Branch':Bank_Detailes.Branch,
#                             'IFSCcode':Bank_Detailes.IFSCcode,
#                             'PanNumber':Bank_Detailes.PANNumber
#                         }

#                 LedgerArray.append(Led_dic)

#             return JsonResponse (LedgerArray,safe=False)
        
#         except Exception as e:
#             print(f'An error Accurred:{str(e)}')
#             return JsonResponse({'error':f'An error Accurred:{str(e)}'})


# # ---------------------------------------------------------------------------------



# @csrf_exempt
# @require_http_methods(["GET"])
# def getassetledgerforvouchersbytype(request):
#     try:
#         voucher_type = request.GET.get('voucherType')
#         if not voucher_type:
#             return JsonResponse({'error': 'Voucher type is required'}, status=400)

#         query = Q()
#         if voucher_type == 'ContraVoucher':
#             query = Q(LedgerGroupName__NatureOfGroup__pk=1)

#         ledgers_grp = AllLedgers_Mapping_Detailes.objects.all()
#         result_array = []

#         for ledger in ledgers_grp:
#             try:
#                 match = re.search(r"<class '(\w+)\.models\.(\w+)'>", ledger.TableName)
#                 if not match:
#                     continue

#                 app_label, model_name = match.groups()
#                 table_model = apps.get_model(app_label, model_name)
#                 ledger_instance = table_model.objects.filter(Q(pk=ledger.TableId) & query).first()
#                 if ledger_instance:
#                     result_array.append({
#                         'id': ledger.pk,
#                         'LedgerName': ledger_instance.LedgerName,
#                         'GroupName': ledger_instance.LedgerGroupName.pk,
#                         'UseGroupName': ledger_instance.LedgerGroupName.GroupName,
#                         'OpeningBalance': ledger_instance.OpeningBalance,
#                         'DebitOrCredit': ledger_instance.DebitOrCredit,
#                     })
#             except Exception as e:
#                 print(f"Error processing ledger {ledger.pk}: {str(e)}")

#         return JsonResponse(result_array, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)



# # ---------------------------------------------------------------------------------


# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS", "GET"])
# def postvoucherdataallvouchers(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             VoucherNo = data.get('VoucherNo')
#             # print('VoucherNo', VoucherNo)

#             voucherType = data.get('voucherType')
#             # print('voucherType????', voucherType)
#             VoucherDate = data.get('VoucherDate')
#             PaymentType = data.get('PaymentType')
#             VoucherNarration = data.get('VoucherNarration')
#             createby = data.get('createby')

#             VoucherEntryarray = data.get('VoucherEntryarray')
            
#             # print('VoucherEntryarray',VoucherEntryarray)


#             EditNumchange = data.get('EditNumchange')

#             if EditNumchange:
                
#                 model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                 Voucher_Main_Debit_Ins = model_class.objects.get(pk=EditNumchange)
#                 Voucher_Main_Debit_Ins.Status = not Voucher_Main_Debit_Ins.Status
#                 Voucher_Main_Debit_Ins.save()

#                 return JsonResponse({'success': 'Status updated successfully'})

#             if VoucherEntryarray:

#                 if VoucherNo:
#                     model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                     Voucher_Main_Debit_Ins = model_class.objects.get(pk=VoucherNo)

#                     Voucher_Main_Debit_Ins.VoucherDate = VoucherDate
#                     if voucherType != 'JournalVoucher':
#                         Voucher_Main_Debit_Ins.PaymentType = PaymentType
#                     Voucher_Main_Debit_Ins.VoucherNarration = VoucherNarration

#                     Voucher_Main_Debit_Ins.save()

#                     entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
#                     entry_model_class.objects.filter(**{f"{voucherType}MainTable": Voucher_Main_Debit_Ins}).delete()
                    
#                     # print('VoucherEntryarray',VoucherEntryarray)

#                     for rowdata in VoucherEntryarray:
#                         CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

#                         entry_model_class.objects.create(
#                             **{f"{voucherType}MainTable": Voucher_Main_Debit_Ins},
#                             Particulars=CreditLedger_Ins,
#                             DebitAmount=rowdata.get('Debit'),
#                             CreditAmount=rowdata.get('Credit')
#                         )

#                     return JsonResponse({'success': 'Updated successfully'})

#                 else:
#                     if voucherType != 'JournalVoucher':
#                         model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                         Vocher_Main_Ins = model_class.objects.create(
#                             VoucherDate=VoucherDate,
#                             PaymentType=PaymentType,
#                             VoucherNarration=VoucherNarration,
#                             created_by=createby
#                         )
#                     else:
#                         model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                         Vocher_Main_Ins = model_class.objects.create(
#                             VoucherDate=VoucherDate,
#                             VoucherNarration=VoucherNarration,
#                             created_by=createby
#                         )

#                     entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
#                     for rowdata in VoucherEntryarray:
#                         CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

#                         entry_model_class.objects.create(
#                             **{f"{voucherType}MainTable": Vocher_Main_Ins},  
#                             Particulars=CreditLedger_Ins,
#                             DebitAmount=rowdata.get('Debit'),
#                             CreditAmount=rowdata.get('Credit')
#                         )

#                     return JsonResponse({'success': 'Saved successfully'})

#             else:
#                 return JsonResponse({'error': 'Data Not Found'})

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})

#     elif request.method == "GET":
#         try:
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')

#             voucherType = request.GET.get('voucherType')
            
#             # print('voucherType*****', voucherType)

#             qeary = Q()

#             if FromDate and ToDate:
#                 qeary &= Q(VoucherDate__range=[FromDate, ToDate])

#             model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#             entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")

#             Contra_main_data = model_class.objects.filter(qeary)

#             Cantraarray = []
#             for main in Contra_main_data:
#                 Maindic = {
#                     'id': main.pk,
#                     'VoucherDate': main.VoucherDate,
#                     'PaymentType': main.PaymentType if voucherType != 'JournalVoucher' else None,
#                     'VoucherNarration': main.VoucherNarration,
#                     'Status': main.Status,
#                     'VoucherEntryarray': []
#                 }

#                 Credit_Table_Ins = entry_model_class.objects.filter(**{f"{voucherType}MainTable": main})

#                 num = 1
#                 for getdata in Credit_Table_Ins:

#                     # print('kkkk',getdata.Particulars.TableName)

#                     match = re.search(r"<class '(\w+)\.models\.(\w+)'>", getdata.Particulars.TableName)
#                     if match:
#                         app_label = match.group(1) 
#                         model_name = match.group(2)  
#                         # print(f"App Label: {app_label}, Model Name: {model_name}")
#                     else:
#                         print("Invalid class string format")
#                     table_model = apps.get_model(app_label, model_name)
#                     getsingleledger = table_model.objects.get(pk=getdata.Particulars.TableId)

#                     Creditdic = {
#                         'id': num,                        
#                         'ParticularsId':getdata.Particulars.pk,
#                         'Particulars': getsingleledger.LedgerName,
#                         'Debit': float(getdata.DebitAmount),
#                         'Credit': float(getdata.CreditAmount),
#                     }
#                     Maindic['VoucherEntryarray'].append(Creditdic)
#                     num += 1

#                 Cantraarray.append(Maindic)
#                 Cantraarray = sorted(Cantraarray, key=lambda x: (x['VoucherDate'], x['id']), reverse=True)

#             return JsonResponse(Cantraarray, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})

# # ---------------------------------------------------------------------------------


# @csrf_exempt
# @require_http_methods(["POST","OPTIONS","GET"])
# def postvoucherdataSecondfourvouchers(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             VoucherNo = data.get('VoucherNo')
#             # print('VoucherNo', VoucherNo)

#             voucherType = data.get('voucherType')
#             # print('voucherType+++++', voucherType)
#             VoucherDate = data.get('VoucherDate')
#             PaymentType = data.get('PaymentType')
#             VoucherNarration = data.get('VoucherNarration')
#             createby = data.get('createby')

#             VoucherEntryarray = data.get('VoucherEntryarray')

#             EditNumchange = data.get('EditNumchange')

#             if EditNumchange:
                
#                 model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                 Voucher_Main_Debit_Ins = model_class.objects.get(pk=EditNumchange)
#                 Voucher_Main_Debit_Ins.Status = not Voucher_Main_Debit_Ins.Status
#                 Voucher_Main_Debit_Ins.save()

#                 return JsonResponse({'success': 'Status updated successfully'})
            
#             if VoucherEntryarray:
#                 if VoucherNo:
#                     model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                     Voucher_Main_Debit_Ins = model_class.objects.get(pk=VoucherNo)
#                     Voucher_Main_Debit_Ins.VoucherDate = VoucherDate
#                     Voucher_Main_Debit_Ins.PaymentType = PaymentType
#                     Voucher_Main_Debit_Ins.VoucherNarration = VoucherNarration

#                     Voucher_Main_Debit_Ins.save()

#                     entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
#                     entry_model_class.objects.filter(**{f"{voucherType}MainTable": Voucher_Main_Debit_Ins}).delete()

#                     for rowdata in VoucherEntryarray:
#                         CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

#                         entry_model_class.objects.create(
#                             **{f"{voucherType}MainTable": Voucher_Main_Debit_Ins},
#                             Particulars=CreditLedger_Ins,
#                             UnitOrTax=rowdata.get('UnitOrTax'),
#                             UnitOrTaxValue=rowdata.get('UnitOrTaxValue'),
#                             PerUnitOrTaxable=rowdata.get('PerUnitOrTaxable'),
#                             RatePerUnitOrTaxableValue=rowdata.get('RatePerUnitOrTaxableValue'),
#                             DebitAmount=rowdata.get('Debit'),
#                             CreditAmount=rowdata.get('Credit')
#                         )
                    

#                     return JsonResponse({'success': 'Updated successfully'})

#                 else:
#                     model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#                     Voucher_Main_Debit_Ins = model_class.objects.create(
#                         VoucherDate=VoucherDate,
#                         PaymentType=PaymentType,
#                         VoucherNarration=VoucherNarration,
#                         created_by=createby
#                     )

#                     entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
                    
#                     for rowdata in VoucherEntryarray:
#                         CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

#                         entry_model_class.objects.create(
#                             **{f"{voucherType}MainTable": Voucher_Main_Debit_Ins},
#                             Particulars=CreditLedger_Ins,
#                             UnitOrTax=rowdata.get('UnitOrTax'),
#                             UnitOrTaxValue=rowdata.get('UnitOrTaxValue'),
#                             PerUnitOrTaxable=rowdata.get('PerUnitOrTaxable'),
#                             RatePerUnitOrTaxableValue=rowdata.get('RatePerUnitOrTaxableValue'),
#                             DebitAmount=rowdata.get('Debit'),
#                             CreditAmount=rowdata.get('Credit')
#                         )
                
#                     return JsonResponse({'success': 'Saved successfully'})
#             else:
#                 return JsonResponse({'error': 'Data Not Found'})
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})

#     elif request.method == "GET":
#         try:
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')

#             voucherType = request.GET.get('voucherType')
        

#             qeary = Q()

#             if FromDate and ToDate:
#                 qeary &= Q(VoucherDate__range=[FromDate, ToDate])

#             model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#             entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")

#             Contra_main_data = model_class.objects.filter(qeary)

#             Cantraarray = []
#             for main in Contra_main_data:
#                 Maindic = {
#                     'id': main.pk,
#                     'VoucherDate': main.VoucherDate,
#                     'PaymentType': main.PaymentType,
#                     'VoucherNarration': main.VoucherNarration,
#                     'Status': main.Status,
#                     'VoucherEntryarray': []
#                 }

#                 Credit_Table_Ins = entry_model_class.objects.filter(**{f"{voucherType}MainTable": main})

#                 num = 1
#                 for getdata in Credit_Table_Ins:

#                     match = re.search(r"<class '(\w+)\.models\.(\w+)'>", getdata.Particulars.TableName)
#                     if match:
#                         app_label = match.group(1) 
#                         model_name = match.group(2)  
#                         # print(f"App Label: {app_label}, Model Name: {model_name}")
#                     else:
#                         print("Invalid class string format")
#                     table_model = apps.get_model(app_label, model_name)
#                     getsingleledger = table_model.objects.get(pk=getdata.Particulars.TableId)

#                     Creditdic = {
#                         'id': num,
#                         'ParticularsId':getdata.Particulars.pk,
#                         'Particulars': getsingleledger.LedgerName,
#                         'UnitOrTax':getdata.UnitOrTax,
#                         'UnitOrTaxValue': float(getdata.UnitOrTaxValue),
#                         'PerUnitOrTaxable':getdata.PerUnitOrTaxable,
#                         'RatePerUnitOrTaxableValue': float(getdata.RatePerUnitOrTaxableValue),
#                         'Debit': float(getdata.DebitAmount),
#                         'Credit': float(getdata.CreditAmount),
#                     }
#                     Maindic['VoucherEntryarray'].append(Creditdic)
#                     num += 1

#                 Cantraarray.append(Maindic)
#                 Cantraarray = sorted(Cantraarray, key=lambda x: (x['VoucherDate'], x['id']), reverse=True)

#             return JsonResponse(Cantraarray, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})



# # ---------------------------------------------------------------------------------




# @csrf_exempt
# @require_http_methods(["GET"])
# def get_ledger_report_list(request):
#     try:
#         ledgers_grp = AllLedgers_Mapping_Detailes.objects.all()
#         result_array = []

       
#         voucher_models = {
#             ContraVoucher_Entry_Table_Detailes: 'ContraVoucherMainTable',
#             PaymentVoucher_Entry_Table_Detailes: 'PaymentVoucherMainTable',
#             ReceiptVoucher_Entry_Table_Detailes: 'ReceiptVoucherMainTable',
#             JournalVoucher_Entry_Table_Detailes: 'JournalVoucherMainTable',
#             SalesVoucher_Entry_Table_Detailes: 'SalesVoucherMainTable',
#             PurchaseVoucher_Entry_Table_Detailes: 'PurchaseVoucherMainTable',
#             CreditNoteVoucher_Entry_Table_Detailes: 'CreditNoteVoucherMainTable',
#             DebitNoteVoucher_Entry_Table_Detailes: 'DebitNoteVoucherMainTable',
#         }

#         for ledger in ledgers_grp:
#             try:
#                 match = re.search(r"<class '(\w+)\.models\.(\w+)'>", ledger.TableName)
#                 if not match:
#                     continue

#                 app_label, model_name = match.groups()
#                 table_model = apps.get_model(app_label, model_name)
#                 ledger_instance = table_model.objects.filter(pk=ledger.TableId).first()

#                 if ledger_instance:
#                     Led_dic = {
#                         'id': ledger.pk,
#                         'LedgerName': ledger_instance.LedgerName,
#                         'GroupName': ledger_instance.LedgerGroupName.pk,
#                         'UseGroupName': ledger_instance.LedgerGroupName.GroupName,
#                         'OpeningBalance': ledger_instance.OpeningBalance,
#                         'DebitOrCredit': ledger_instance.DebitOrCredit,
#                         'Debit': 0,
#                         'Credit': 0,
#                         'ClosingBalance': 0,
#                         'NatureOfgroupId': ledger_instance.LedgerGroupName.NatureOfGroup.pk,
#                     }

#                     for model, foreign_key in voucher_models.items():
#                         filter_criteria = {
#                             f"{foreign_key}__Status": True,
#                             'Particulars_id': ledger.pk,
#                         }
#                         entries = model.objects.filter(**filter_criteria)

#                         Led_dic['Debit'] += entries.aggregate(total=models.Sum('DebitAmount'))['total'] or 0
#                         Led_dic['Credit'] += entries.aggregate(total=models.Sum('CreditAmount'))['total'] or 0

                    
#                     nature_of_group_id = ledger_instance.LedgerGroupName.NatureOfGroup.pk

#                     Led_dic['ClosingBalance'] = 0

#                     if  ledger_instance.DebitOrCredit == 'Dr' and (ledger_instance.OpeningBalance + Led_dic['Debit']) >= Led_dic['Credit']:
#                         print('111',Led_dic['LedgerName'],ledger_instance.OpeningBalance)
#                         TotalAmo = (
#                                 ledger_instance.OpeningBalance + (Led_dic['Debit'] - Led_dic['Credit'])
#                             ) 
#                         Led_dic['ClosingBalance']=f"{TotalAmo} {'Dr'}"

#                     elif ledger_instance.DebitOrCredit == 'Dr' and (ledger_instance.OpeningBalance + Led_dic['Debit']) <= Led_dic['Credit'] :
#                         print('222',Led_dic['LedgerName'],ledger_instance.OpeningBalance)

#                         TotalAmo = (Led_dic['Credit'] - (Led_dic['Debit'] + ledger_instance.OpeningBalance))

#                         Led_dic['ClosingBalance']=f"{TotalAmo} {'Cr'}"
                    
#                     elif ledger_instance.DebitOrCredit == 'Cr' and (ledger_instance.OpeningBalance + Led_dic['Credit']) >= Led_dic['Debit'] :
#                         print('333',Led_dic['LedgerName'],ledger_instance.OpeningBalance)

#                         TotalAmo = (
#                                 ledger_instance.OpeningBalance + (Led_dic['Credit'] - Led_dic['Debit'])
#                             ) 
#                         Led_dic['ClosingBalance']=f"{TotalAmo} {'Cr'}"

#                     elif ledger_instance.DebitOrCredit == 'Cr' and (ledger_instance.OpeningBalance + Led_dic['Credit']) <= Led_dic['Debit'] :
#                         print('444',Led_dic['LedgerName'],ledger_instance.OpeningBalance)

#                         TotalAmo = (Led_dic['Debit'] - (Led_dic['Credit'] + ledger_instance.OpeningBalance))

#                         Led_dic['ClosingBalance']=f"{TotalAmo} {'Dr'}"

                    
                     
                        

#                     Led_dic['OpeningBalance'] = f"{ledger_instance.OpeningBalance} {ledger_instance.DebitOrCredit}"

#                     result_array.append(Led_dic)

#             except Exception as e:
#                 print(f"Error processing ledger {ledger.pk}: {str(e)}")

#         return JsonResponse(result_array, safe=False)

#     except Exception as e:
#         return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)


# # ---------------------------------------------------------------------------------



# @csrf_exempt
# @require_http_methods(["GET"])
# def getsingleledgeralldata(request):
#     if request.method == "GET":
#         try:
#             LedgerMasterId = request.GET.get('LedgerMasterId')
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')

#             # print('LedgerMasterId------',LedgerMasterId, FromDate, ToDate)

#             arrayy = []

#             entry_tables = [
#                 ContraVoucher_Entry_Table_Detailes,
#                 PaymentVoucher_Entry_Table_Detailes,
#                 ReceiptVoucher_Entry_Table_Detailes,
#                 JournalVoucher_Entry_Table_Detailes,
#                 SalesVoucher_Entry_Table_Detailes,
#                 PurchaseVoucher_Entry_Table_Detailes,
#                 CreditNoteVoucher_Entry_Table_Detailes,
#                 DebitNoteVoucher_Entry_Table_Detailes,
#             ]

#             ForeignKeydata = {
#                 ContraVoucher_Entry_Table_Detailes: 'ContraVoucherMainTable',
#                 PaymentVoucher_Entry_Table_Detailes: 'PaymentVoucherMainTable',
#                 ReceiptVoucher_Entry_Table_Detailes: 'ReceiptVoucherMainTable',
#                 JournalVoucher_Entry_Table_Detailes: 'JournalVoucherMainTable',
#                 SalesVoucher_Entry_Table_Detailes: 'SalesVoucherMainTable',
#                 PurchaseVoucher_Entry_Table_Detailes: 'PurchaseVoucherMainTable',
#                 CreditNoteVoucher_Entry_Table_Detailes: 'CreditNoteVoucherMainTable',
#                 DebitNoteVoucher_Entry_Table_Detailes: 'DebitNoteVoucherMainTable',
#             }

#             for entry_table in entry_tables:
#                 filter_criteria = {'Particulars_id': LedgerMasterId}
#                 filter_criteria[f"{ForeignKeydata[entry_table]}__Status"] = True
                
#                 if FromDate and ToDate:
#                     filter_criteria[f"{ForeignKeydata[entry_table]}__VoucherDate__range"] = (FromDate, ToDate)
                
#                 print('filter_criteria',filter_criteria)

#                 voucher_ids = entry_table.objects.filter(**filter_criteria) 

#                 for main in voucher_ids:
#                     entry_data = {
#                         "id": len(arrayy) + 1,
#                         'EntryId':main.pk,
#                         "VoucherNo": getattr(main, ForeignKeydata[entry_table]).pk,
#                         "VoucherDate": getattr(main, ForeignKeydata[entry_table]).VoucherDate,
#                         "VoucherNarration": getattr(main, ForeignKeydata[entry_table]).VoucherNarration,
#                         "Particulars": [],
#                         "Debit": main.DebitAmount,
#                         "Credit": main.CreditAmount,
#                     }

#                     arrayy.append(entry_data)

#                     filter_criteriaSec = {f"{ForeignKeydata[entry_table]}__pk": getattr(main, ForeignKeydata[entry_table]).pk}
#                     voucher_Sec_ids = entry_table.objects.filter(**filter_criteriaSec).exclude(Particulars_id=LedgerMasterId,pk=entry_data['EntryId'])

#                     for every in voucher_Sec_ids:
#                         for row in arrayy:
#                             if row['VoucherNo'] == getattr(every, ForeignKeydata[entry_table]).pk:
                                
#                                 match = re.search(r"<class '(\w+)\.models\.(\w+)'>", every.Particulars.TableName)
#                                 if not match:
#                                     continue

#                                 app_label, model_name = match.groups()
#                                 table_model = apps.get_model(app_label, model_name)
#                                 ledger_instance = table_model.objects.get(pk=every.Particulars.TableId)
                                
#                                 particulars_entry = {
#                                     'Sub_EntryId':every.id,
#                                     "Particulars": ledger_instance.LedgerName,
#                                 }

#                                 if float(every.DebitAmount):
#                                     particulars_entry["Debit"] = f"{every.DebitAmount} Dr"

#                                 if float(every.CreditAmount):
#                                     particulars_entry["Credit"] = f"{every.CreditAmount} Cr"

#                                 row['Particulars'].append(particulars_entry)

#             merged_data = {}
#             # print('000000----++',arrayy)
#             for item in arrayy:
#                 if item["VoucherNo"] not in merged_data:
#                     merged_data[item["VoucherNo"]] = {
#                         "VoucherNo": item["VoucherNo"],
#                         "EntryId": item["EntryId"],
#                         "VoucherDate": item["VoucherDate"],
#                         "VoucherNarration": item["VoucherNarration"],
#                         "Particulars": item["Particulars"],
#                         "Debit": item["Debit"],
#                         "Credit": item["Credit"],
#                     }
#                 else:
#                     merged_data[item["VoucherNo"]]["Debit"] = str(
#                         float(merged_data[item["VoucherNo"]]["Debit"]) + float(item["Debit"])
#                     )
#                     merged_data[item["VoucherNo"]]["Credit"] = str(
#                         float(merged_data[item["VoucherNo"]]["Credit"]) + float(item["Credit"])
#                     )

#             merged_data_list=list(merged_data.values())
            
#             for row in merged_data_list:
#                 sub_entry_ids_seen = set()  
#                 sub_entry_ids_seen.add(row['EntryId'])
#                 unique_particulars = []     
#                 for subrow in row['Particulars']:
#                     if subrow['Sub_EntryId'] not in sub_entry_ids_seen:
#                         sub_entry_ids_seen.add(subrow['Sub_EntryId'])
#                         editobj={
#                             "Particulars": subrow['Particulars'],
#                         }
#                         debit = subrow.get('Debit', None)
#                         credit = subrow.get('Credit', None)

#                         if debit:  
#                             editobj["Debit"] = f"{debit}"
#                         if credit: 
#                             editobj["Credit"] = f"{credit}"
                        
#                         unique_particulars.append(editobj)
#                 row['Particulars'] = unique_particulars 
            
#             alaignArr = []
#             num = 1
#             for Snrow in merged_data_list:
#                 setobj = {
#                     'id': num,
#                     'VoucherNo': Snrow.get('VoucherNo'),
#                     'VoucherDate': Snrow.get('VoucherDate'),
#                     'VoucherNarration': Snrow.get('VoucherNarration'),
#                     'Particulars': Snrow.get('Particulars'),
#                     'Debit': Snrow.get('Debit'),
#                     'Credit': Snrow.get('Credit'),
#                 }
#                 num += 1 
#                 alaignArr.append(setobj)
            
#             return JsonResponse(alaignArr, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})
        


# # ---------------------------------------------------------------------------------


# @csrf_exempt
# @require_http_methods(["GET"])
# def getsinglevoucherbyinvoicenumber (request):
#     if request.method == "GET":
#         try:
#             VoucherNo = request.GET.get('VoucherNo')
#             voucherType = request.GET.get('voucherType')
            
#             print('voucherType*****', voucherType,VoucherNo)

#             qeary = Q()

#             if VoucherNo:
#                 qeary &= Q(VoucherNo=VoucherNo)
            

#             model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
#             entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")

#             Contra_main_data = model_class.objects.filter(qeary).first()

            
#             Maindic = {
#                 'VoucherNo': Contra_main_data.pk,
#                 'VoucherDate': Contra_main_data.VoucherDate,
#                 'VoucherNarration': Contra_main_data.VoucherNarration,
#                 'VoucherEntryarray': []
#                 }
#             if voucherType not in ['JournalVoucher']:
#                 Maindic['PaymentType']=Contra_main_data.PaymentType

#             Credit_Table_Ins = entry_model_class.objects.filter(**{f"{voucherType}MainTable": Contra_main_data})

#             num = 1
#             for getdata in Credit_Table_Ins:
#                 match = re.search(r"<class '(\w+)\.models\.(\w+)'>", getdata.Particulars.TableName)
#                 if match:
#                     app_label = match.group(1) 
#                     model_name = match.group(2)  
#                     # print(f"App Label: {app_label}, Model Name: {model_name}")
#                 else:
#                     print("Invalid class string format")
#                 table_model = apps.get_model(app_label, model_name)
#                 getsingleledger = table_model.objects.get(pk=getdata.Particulars.TableId)

#                 if voucherType in ['ContraVoucher','PaymentVoucher','ReceiptVoucher', 'JournalVoucher'] :
#                     Creditdic = {
#                         'id': num,
#                         'ParticularsId':getdata.Particulars.pk,
#                         'Particulars': getsingleledger.LedgerName,
#                         'Debit': float(getdata.DebitAmount),
#                         'Credit': float(getdata.CreditAmount),
#                     }
#                     Maindic['VoucherEntryarray'].append(Creditdic)
#                     num += 1

#                 else:
#                     Creditdic = {
#                         'id': num,
#                         'ParticularsId':getdata.Particulars.pk,
#                         'Particulars': getsingleledger.LedgerName,
#                         'UnitOrTax':getdata.UnitOrTax,
#                         'UnitOrTaxValue': float(getdata.UnitOrTaxValue),
#                         'PerUnitOrTaxable':getdata.PerUnitOrTaxable,
#                         'RatePerUnitOrTaxableValue': float(getdata.RatePerUnitOrTaxableValue),
#                         'Debit': float(getdata.DebitAmount),
#                         'Credit': float(getdata.CreditAmount),
#                     }
#                     Maindic['VoucherEntryarray'].append(Creditdic)
#                     num += 1

                

#             return JsonResponse(Maindic, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})


# # ---------------------------------------------------------------------------------




# @csrf_exempt
# @require_http_methods(["GET"])
# def getdaybookforallvouchers(request):
#     if request.method == "GET":
#         try:
#             VouchersType = request.GET.get('VouchersType')
#             FromDate = request.GET.get('FromDate')
#             ToDate = request.GET.get('ToDate')

#             # Parse dates
#             FromDate = datetime.strptime(FromDate, '%Y-%m-%d') if FromDate else None
#             ToDate = datetime.strptime(ToDate, '%Y-%m-%d') if ToDate else None

#             arrayy = []

#             Main_tables=[]

#             if VouchersType:
#                 if VouchersType == 'Contra' :
#                     Main_tables.append(ContraVoucher_Main_Table_Detailes)
#                 if VouchersType == 'Payment' :
#                     Main_tables.append(PaymentVoucher_Main_Table_Detailes)
#                 if VouchersType == 'Receipt' :
#                     Main_tables.append(ReceiptVoucher_Main_Table_Detailes)
#                 if VouchersType == 'Journal' :
#                     Main_tables.append(JournalVoucher_Main_Table_Detailes)
#                 if VouchersType == 'Sales' :
#                     Main_tables.append(SalesVoucher_Main_Table_Detailes)
#                 if VouchersType == 'Purchase' :
#                     Main_tables.append(PurchaseVoucher_Main_Table_Detailes)
#                 if VouchersType == 'CreditNote' :
#                     Main_tables.append(CreditNoteVoucher_Main_Table_Detailes)
#                 if VouchersType == 'DebitNote' :
#                     Main_tables.append(DebitNoteVoucher_Main_Table_Detailes)

#             else:
#                 Main_tables = [
#                 ContraVoucher_Main_Table_Detailes,
#                 PaymentVoucher_Main_Table_Detailes,
#                 ReceiptVoucher_Main_Table_Detailes,
#                 JournalVoucher_Main_Table_Detailes,
#                 SalesVoucher_Main_Table_Detailes,
#                 PurchaseVoucher_Main_Table_Detailes,
#                 CreditNoteVoucher_Main_Table_Detailes,
#                 DebitNoteVoucher_Main_Table_Detailes,
#                 ]


#             for table in Main_tables:
#                 filter_criteria = {'Status': True}
#                 if FromDate and ToDate:
#                     filter_criteria["VoucherDate__range"] = (FromDate, ToDate)

#                 voucher_ids = table.objects.filter(**filter_criteria)

#                 for main in voucher_ids:
#                     entry_data = {
#                         "id": len(arrayy) + 1,
#                         "VoucherNo": main.pk,
#                         "VoucherDate": main.VoucherDate,
#                         "VoucherNarration": main.VoucherNarration,
#                     }

#                     if table == ContraVoucher_Main_Table_Detailes:
#                         filterparticular = ContraVoucher_Entry_Table_Detailes.objects.filter(ContraVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'Contra'
#                     elif table == PaymentVoucher_Main_Table_Detailes:
#                         filterparticular = PaymentVoucher_Entry_Table_Detailes.objects.filter(PaymentVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'Payment'
#                     elif table == ReceiptVoucher_Main_Table_Detailes:
#                         filterparticular = ReceiptVoucher_Entry_Table_Detailes.objects.filter(ReceiptVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'Receipt'
#                     elif table == JournalVoucher_Main_Table_Detailes:
#                         filterparticular = JournalVoucher_Entry_Table_Detailes.objects.filter(JournalVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'Journal'
#                     elif table == SalesVoucher_Main_Table_Detailes:
#                         filterparticular = SalesVoucher_Entry_Table_Detailes.objects.filter(SalesVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'Sales'
#                     elif table == PurchaseVoucher_Main_Table_Detailes:
#                         filterparticular = PurchaseVoucher_Entry_Table_Detailes.objects.filter(PurchaseVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'Purchase'
#                     elif table == CreditNoteVoucher_Main_Table_Detailes:
#                         filterparticular = CreditNoteVoucher_Entry_Table_Detailes.objects.filter(CreditNoteVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'CreditNote'
#                     elif table == DebitNoteVoucher_Main_Table_Detailes:
#                         filterparticular = DebitNoteVoucher_Main_Table_Detailes.objects.filter(DebitNoteVoucherMainTable__pk=main.pk).first()
#                         entry_data["VouchersType"] = 'DebitNote'

#                     match = re.search(r"<class '(\w+)\.models\.(\w+)'>", filterparticular.Particulars.TableName)
#                     if not match:
#                         continue
#                     app_label, model_name = match.groups()
#                     table_model = apps.get_model(app_label, model_name)
#                     ledger_instance = table_model.objects.get(pk=filterparticular.Particulars.TableId)

#                     # print('ledger_instance',ledger_instance) 
#                     entry_data["Particulars"] = ledger_instance.LedgerName
#                     entry_data["Debit"] = float(filterparticular.DebitAmount) if float(filterparticular.DebitAmount) != 0 else ''
#                     entry_data["Credit"] = float(filterparticular.CreditAmount) if float(filterparticular.CreditAmount) != 0 else ''

#                     arrayy.append(entry_data)

#             return JsonResponse(arrayy, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})



# # ----------------------------------------------------------------------------------------

# @csrf_exempt
# @require_http_methods(["GET"])
# def getcashbookforallvouchers(request):
#     if request.method == "GET":
#         try:
           
            
#             from_date = request.GET.get('FromDate')
#             to_date = request.GET.get('ToDate')

#             FromDate = datetime.strptime(from_date, '%Y-%m-%d') if from_date else None
#             ToDate = datetime.strptime(to_date, '%Y-%m-%d') if to_date else None

            

#             arrayy = []

#             entry_tables = [
#                 ContraVoucher_Entry_Table_Detailes,
#                 PaymentVoucher_Entry_Table_Detailes,
#                 ReceiptVoucher_Entry_Table_Detailes,
#                 JournalVoucher_Entry_Table_Detailes,
#                 SalesVoucher_Entry_Table_Detailes,
#                 PurchaseVoucher_Entry_Table_Detailes,
#                 CreditNoteVoucher_Entry_Table_Detailes,
#                 DebitNoteVoucher_Entry_Table_Detailes,
#             ]

#             ForeignKeydata = {
#                 ContraVoucher_Entry_Table_Detailes: 'ContraVoucherMainTable',
#                 PaymentVoucher_Entry_Table_Detailes: 'PaymentVoucherMainTable',
#                 ReceiptVoucher_Entry_Table_Detailes: 'ReceiptVoucherMainTable',
#                 JournalVoucher_Entry_Table_Detailes: 'JournalVoucherMainTable',
#                 SalesVoucher_Entry_Table_Detailes: 'SalesVoucherMainTable',
#                 PurchaseVoucher_Entry_Table_Detailes: 'PurchaseVoucherMainTable',
#                 CreditNoteVoucher_Entry_Table_Detailes: 'CreditNoteVoucherMainTable',
#                 DebitNoteVoucher_Entry_Table_Detailes: 'DebitNoteVoucherMainTable',
#             }

#             all_ledgers = AllLedgers_Mapping_Detailes.objects.get(pk=1)
#             openingbal = {}

#             if all_ledgers:
#                 match = re.search(r"<class '(\w+)\.models\.(\w+)'>", all_ledgers.TableName)
#                 if match:
#                     app_label, model_name = match.groups()
#                     table_model = apps.get_model(app_label, model_name)
#                     cashledger_instance = table_model.objects.get(pk=all_ledgers.TableId)
                
#                     createat = None
                    
#                     if hasattr(cashledger_instance, 'Created_at') and cashledger_instance.Created_at:
#                         createat = cashledger_instance.Created_at.strftime('%Y-%m-%d')
#                     elif hasattr(cashledger_instance, 'created_at') and cashledger_instance.created_at:
#                         createat = cashledger_instance.created_at.strftime('%Y-%m-%d')
#                     else:
#                         createat = datetime.today().strftime('%Y-%m-%d')

#                 openingbal={
#                         'id':1,
#                         "VoucherNo": '',
#                         "VoucherDate": createat,
#                         "VoucherNarration": '',
#                         "Particulars":[{'Particulars':'Opening Balance'}],
#                     }
#                 print('7777',cashledger_instance.DebitOrCredit)
#                 if cashledger_instance.DebitOrCredit == 'Dr':
#                     openingbal["Debit"] = cashledger_instance.OpeningBalance
#                 elif cashledger_instance.DebitOrCredit == 'Cr':
#                     openingbal["Credit"] = cashledger_instance.OpeningBalance           

#                 # print('openingbal',openingbal)
            
#             for entry_table in entry_tables:
#                 filter_criteria = {'Particulars_id': 1}
#                 filter_criteria[f"{ForeignKeydata[entry_table]}__Status"] = True
                
#                 if FromDate and ToDate:
#                     filter_criteria[f"{ForeignKeydata[entry_table]}__VoucherDate__range"] = (FromDate, ToDate)
                
#                 # print('filter_criteria',filter_criteria)

#                 voucher_ids = entry_table.objects.filter(**filter_criteria)

#                 for main in voucher_ids:
#                     entry_data = {
#                         "id": len(arrayy) + 1,
#                         'EntryId':main.pk,
#                         "VoucherNo": getattr(main, ForeignKeydata[entry_table]).pk,
#                         "VoucherDate": getattr(main, ForeignKeydata[entry_table]).VoucherDate,
#                         "VoucherNarration": getattr(main, ForeignKeydata[entry_table]).VoucherNarration,
#                         "Particulars": [],
#                         "Debit": main.DebitAmount,
#                         "Credit": main.CreditAmount,
#                     }

#                     arrayy.append(entry_data)

#                     filter_criteriaSec = {f"{ForeignKeydata[entry_table]}__pk": getattr(main, ForeignKeydata[entry_table]).pk}

#                     if float(main.DebitAmount) == 0:
#                         filter_criteriaSec["CreditAmount"] = 0  # Corrected dictionary assignment
#                     elif float(main.CreditAmount) == 0:
#                         filter_criteriaSec["DebitAmount"] = 0
                    
#                     voucher_Sec_id = entry_table.objects.filter(**filter_criteriaSec).exclude(
#                         Particulars_id=1, pk=entry_data['EntryId']
#                     ).first() 


#                     if voucher_Sec_id:  
#                         match = re.search(r"<class '(\w+)\.models\.(\w+)'>", voucher_Sec_id.Particulars.TableName)
#                         if match:
#                             app_label, model_name = match.groups()
#                             table_model = apps.get_model(app_label, model_name)
#                             ledger_instance = table_model.objects.get(pk=voucher_Sec_id.Particulars.TableId)

#                             particulars_entry = {
#                                 'Sub_EntryId': voucher_Sec_id.pk,
#                                 "Particulars": ledger_instance.LedgerName,
#                             }

#                             if float(voucher_Sec_id.DebitAmount):
#                                 particulars_entry["Debit"] = f"{voucher_Sec_id.DebitAmount} Dr"

#                             if float(voucher_Sec_id.CreditAmount):
#                                 particulars_entry["Credit"] = f"{voucher_Sec_id.CreditAmount} Cr"

#                             for row in arrayy:
#                                 if row['VoucherNo'] == getattr(voucher_Sec_id, ForeignKeydata[entry_table]).pk:
#                                     row['Particulars'].append(particulars_entry)
        
        
        
#             merged_data = {}
#             for item in arrayy:
#                 if item["VoucherNo"] not in merged_data:
#                     merged_data[item["VoucherNo"]] = {
#                         "VoucherNo": item["VoucherNo"],
#                         "EntryId": item["EntryId"],
#                         "VoucherDate": item["VoucherDate"],
#                         "VoucherNarration": item["VoucherNarration"],
#                         "Particulars": item["Particulars"],
#                         "Debit": item["Debit"],
#                         "Credit": item["Credit"],
#                     }
#                 else:
#                     merged_data[item["VoucherNo"]]["Debit"] = str(
#                         float(merged_data[item["VoucherNo"]]["Debit"]) + float(item["Debit"])
#                     )
#                     merged_data[item["VoucherNo"]]["Credit"] = str(
#                         float(merged_data[item["VoucherNo"]]["Credit"]) + float(item["Credit"])
#                     )

#             merged_data_list=list(merged_data.values())
            
#             for row in merged_data_list:
#                 sub_entry_ids_seen = set()  
#                 sub_entry_ids_seen.add(row['EntryId'])
#                 unique_particulars = []     
#                 for subrow in row['Particulars']:
#                     if subrow['Sub_EntryId'] not in sub_entry_ids_seen:
#                         sub_entry_ids_seen.add(subrow['Sub_EntryId'])
#                         editobj={
#                             "Particulars": subrow['Particulars'],
#                         }
#                         debit = subrow.get('Debit', None)
#                         credit = subrow.get('Credit', None)

#                         if debit:  
#                             editobj["Debit"] = f"{debit}"
#                         if credit: 
#                             editobj["Credit"] = f"{credit}"
                        
#                         unique_particulars.append(editobj)
#                 row['Particulars'] = unique_particulars 
            
#             alaignArr = []
#             if openingbal :
#                  alaignArr.append(openingbal)
#             num = 2
#             for Snrow in merged_data_list:
#                 setobj = {
#                     'id': num,
#                     'VoucherNo': Snrow.get('VoucherNo'),
#                     'VoucherDate': Snrow.get('VoucherDate'),
#                     'VoucherNarration': Snrow.get('VoucherNarration'),
#                     'Particulars': Snrow.get('Particulars'),
#                     'Debit': Snrow.get('Debit'),
#                     'Credit': Snrow.get('Credit'),
#                 }
#                 num += 1 
#                 alaignArr.append(setobj)

#             # credit_entries = []
#             # debit_entries = []

#             # if openingbal :
#             #     if openingbal['Debit']:
#             #         debit_entries.append(openingbal)
#             #     elif openingbal['Credit']:
#             #         credit_entries.append(openingbal)

#             # for entry in alaignArr:
#             #     if float(entry['Credit']) != 0 and float(entry['Debit']) == 0:
#             #         entry_copy = entry.copy() 
#             #         entry_copy['id'] = len(credit_entries) + 1
#             #         credit_entries.append(entry_copy)
#             #     elif float(entry['Debit']) != 0 and float(entry['Credit']) == 0:
#             #         entry_copy = entry.copy()
#             #         entry_copy['id'] = len(debit_entries) + 1
#             #         debit_entries.append(entry_copy)
#             #     elif float(entry['Debit']) != 0 and float(entry['Credit']) != 0:
#             #         credit_copy = entry.copy()
#             #         credit_copy['id'] = len(credit_entries) + 1
#             #         credit_entries.append(credit_copy)

#             #         debit_copy = entry.copy()
#             #         debit_copy['id'] = len(debit_entries) + 1
#             #         debit_entries.append(debit_copy)

#             # response_data = {
#             #     "credit_entries": credit_entries,
#             #     "debit_entries": debit_entries
#             # }

            
#             return JsonResponse(alaignArr, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})



# def process_ledgers(group_obj, all_ledgers, entry_tables):
#     """
#     Processes ledgers for the given group object and updates Debit/Credit totals.
#     """
#     for ledger in all_ledgers:
#         match = re.search(r"<class '(\w+)\.models\.(\w+)'>", ledger.TableName)
#         if match:
#             app_label, model_name = match.groups()
#             table_model = apps.get_model(app_label, model_name)
#             ledger_instance = table_model.objects.filter(pk=ledger.TableId, LedgerGroupName__pk=group_obj['Groupid']).first()

#             if ledger_instance:
#                 ledger_obj = {
#                     'id': len(group_obj['ledgerarr']) + 1,
#                     'ledgerid': ledger.pk,
#                     'LedgerName': ledger_instance.LedgerName,
#                     'OpeningBalance': ledger_instance.OpeningBalance,
#                     'DebitOrCredit': ledger_instance.DebitOrCredit,
#                     'ledger_Debit':0,
#                     'ledger_Credit':0,
#                     'Debit': 0,
#                     'Credit': 0,
#                     'ClosingBalance':0, 
#                     'NatureOfGroupId':group_obj['NatureOfGroupId']
#                 }

#                 if ledger_instance.OpeningBalance is not None and float(ledger_instance.OpeningBalance) != 0:
#                     if ledger_instance.DebitOrCredit == 'Dr':
#                         ledger_obj['Debit'] += float(ledger_instance.OpeningBalance)
#                         group_obj['TotalDebit'] += float(ledger_instance.OpeningBalance)
#                         group_obj['OpeningBalanceDr'] += float(ledger_instance.OpeningBalance)


#                     elif ledger_instance.DebitOrCredit == 'Cr':
#                         ledger_obj['Credit'] += float(ledger_instance.OpeningBalance)
#                         group_obj['TotalCredit'] += float(ledger_instance.OpeningBalance)
#                         group_obj['OpeningBalanceCr'] += float(ledger_instance.OpeningBalance)
                
                    
#                 for entry_table in entry_tables:
#                     entries = entry_table.objects.filter(Particulars__pk=ledger.pk).exclude(DebitAmount=0, CreditAmount=0)
#                     for entry in entries:
#                         if entry.DebitAmount is not None and float(entry.DebitAmount) != 0:
#                             ledger_obj['ledger_Debit'] += float(entry.DebitAmount)
#                             ledger_obj['Debit'] += float(entry.DebitAmount)
#                             group_obj['TotalDebit'] += float(entry.DebitAmount)


#                         if entry.CreditAmount is not None and float(entry.CreditAmount) != 0:
#                             ledger_obj['ledger_Credit'] += float(entry.CreditAmount)
#                             ledger_obj['Credit'] += float(entry.CreditAmount)
#                             group_obj['TotalCredit'] += float(entry.CreditAmount)
                        
                
#                 ledger_obj['ClosingBalance'] = 0
                
                
#                 if ledger_instance.DebitOrCredit == 'Dr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['ledger_Debit'])) >= Decimal(ledger_obj['ledger_Credit']):
#                     print('111', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
#                     TotalAmo = (
#                         Decimal(ledger_instance.OpeningBalance) + (Decimal(ledger_obj['ledger_Debit']) - Decimal(ledger_obj['ledger_Credit']))
#                     )
#                     ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Dr'}"

#                 elif ledger_instance.DebitOrCredit == 'Dr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['ledger_Debit'])) <= Decimal(ledger_obj['ledger_Credit']):
#                     print('222', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
#                     TotalAmo = Decimal(ledger_obj['ledger_Credit']) - (Decimal(ledger_obj['ledger_Debit']) + Decimal(ledger_instance.OpeningBalance))
#                     ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Cr'}"

#                 elif ledger_instance.DebitOrCredit == 'Cr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['ledger_Credit'])) >= Decimal(ledger_obj['ledger_Debit']):
#                     print('333', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
#                     TotalAmo = (
#                         Decimal(ledger_instance.OpeningBalance) + (Decimal(ledger_obj['ledger_Credit']) - Decimal(ledger_obj['ledger_Debit']))
#                     )
#                     ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Cr'}"

#                 elif ledger_instance.DebitOrCredit == 'Cr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['Credit'])) <= Decimal(ledger_obj['Debit']):
#                     print('444', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
#                     TotalAmo = Decimal(ledger_obj['ledger_Debit']) - (Decimal(ledger_obj['ledger_Credit']) + Decimal(ledger_instance.OpeningBalance))
#                     ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Dr'}"

#                 group_obj['ledgerarr'].append(ledger_obj)





# @csrf_exempt
# @require_http_methods(['GET'])
# def gettrialbalance(request):
#     if request.method == 'GET':
#         try:
#             GroupArray = []

#             entry_tables = [
#                 ContraVoucher_Entry_Table_Detailes,
#                 PaymentVoucher_Entry_Table_Detailes,
#                 ReceiptVoucher_Entry_Table_Detailes,
#                 JournalVoucher_Entry_Table_Detailes,
#                 SalesVoucher_Entry_Table_Detailes,
#                 PurchaseVoucher_Entry_Table_Detailes,
#                 CreditNoteVoucher_Entry_Table_Detailes,
#                 DebitNoteVoucher_Entry_Table_Detailes,
#             ]

#             primary_groups = Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Prime')

#             if primary_groups.exists():
#                 for group in primary_groups:
#                     group_obj = {
#                         'Groupid': group.pk,
#                         'GroupName': group.GroupName,
#                         'UnderGroupId': group.TypeofGroup,
#                         'NatureOfGroupId': group.NatureOfGroup.pk,
#                         'UnderGroup': group.NatureOfGroup.NatureOfGroupName,
#                         'ledgerarr': [],
#                         'TotalDebit': 0,  
#                         'TotalCredit': 0, 
#                         'OpeningBalanceDr':0,
#                         'OpeningBalanceCr':0, 
#                         'OpeningBalance':0, 
#                         'SubGroup': [],
#                     }

#                     sub_groups = Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Sub', ParentGroup=group)
#                     for sub_group in sub_groups:
#                         sub_group_obj = {
#                             'Groupid': sub_group.pk,
#                             'GroupName': sub_group.GroupName,
#                             'UnderGroupId': sub_group.ParentGroup.pk,
#                             'NatureOfGroupId': sub_group.ParentGroup.NatureOfGroup.pk,
#                             'UnderGroup': sub_group.ParentGroup.GroupName,
#                             'ledgerarr': [],
#                             'TotalDebit': 0,
#                             'TotalCredit': 0,
#                             'OpeningBalanceDr':0,
#                             'OpeningBalanceCr':0,
#                             'OpeningBalance':0, 


#                         }
#                         group_obj['SubGroup'].append(sub_group_obj)

#                     GroupArray.append(group_obj)

#             all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

#             for group in GroupArray:
#                 process_ledgers(group, all_ledgers, entry_tables)

#                 for subgroup in group['SubGroup']:
#                     process_ledgers(subgroup, all_ledgers, entry_tables)
#                     group['TotalDebit'] += subgroup['TotalDebit']
#                     group['TotalCredit'] += subgroup['TotalCredit']

#             Sendarr=[]

#             for mainrow in GroupArray:
#                 filtered_subgroups = []
#                 ledger_new = []

                
#                 for subgrow in mainrow['SubGroup']:
#                     subrowledger_new = []

#                     if subgrow['OpeningBalanceDr'] :
#                         mainrow['OpeningBalanceDr'] +=int(subgrow['OpeningBalanceDr'])
#                         subgrow['OpeningBalance'] = f"{subgrow['OpeningBalanceDr']} Dr"
                    
#                     if subgrow['OpeningBalanceCr'] :
#                         mainrow['OpeningBalanceCr'] +=int(subgrow['OpeningBalanceCr'])
#                         subgrow['OpeningBalance'] = f"{subgrow['OpeningBalanceCr']} Cr"


#                     if mainrow['OpeningBalanceDr'] > mainrow['OpeningBalanceCr'] :
#                         Openoutput = mainrow['OpeningBalanceDr'] - mainrow['OpeningBalanceCr'] 
#                         if Openoutput != 0 :
#                             mainrow['OpeningBalance'] = f"{Openoutput} Dr"
#                         else:
#                             mainrow['OpeningBalance'] = 0
                    
#                     else:
#                         Openoutput = mainrow['OpeningBalanceCr'] - mainrow['OpeningBalanceDr']
#                         if Openoutput != 0 : 
#                             mainrow['OpeningBalance'] = f"{Openoutput} Cr"
#                         else:
#                             mainrow['OpeningBalance'] = 0                  



#                     if subgrow['TotalDebit'] != 0 or subgrow['TotalCredit'] != 0:
                    
#                         for subrowledg in subgrow['ledgerarr']:
#                             if subrowledg['Debit'] != 0 or subrowledg['Credit'] != 0:
#                                 subrowledger_new.append(subrowledg)
#                         subgrow['ledgerarr'] = subrowledger_new
#                         filtered_subgroups.append(subgrow)

#                 for mainledgrow in mainrow['ledgerarr']:
#                     if mainledgrow['Debit'] != 0 or mainledgrow['Credit'] != 0:
#                         ledger_new.append(mainledgrow)

#                 mainrow['ledgerarr'] = ledger_new
#                 mainrow['SubGroup'] = filtered_subgroups

#                 if mainrow['TotalDebit'] != 0 or mainrow['TotalCredit'] != 0:
#                     Sendarr.append(mainrow)

            
#             return JsonResponse(Sendarr, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})




# @csrf_exempt
# @require_http_methods(['GET'])
# def getprofitandloss(request):
#     if request.method == 'GET':
#         try:
#             entry_tables = [
#                 ContraVoucher_Entry_Table_Detailes,
#                 PaymentVoucher_Entry_Table_Detailes,
#                 ReceiptVoucher_Entry_Table_Detailes,
#                 JournalVoucher_Entry_Table_Detailes,
#                 SalesVoucher_Entry_Table_Detailes,
#                 PurchaseVoucher_Entry_Table_Detailes,
#                 CreditNoteVoucher_Entry_Table_Detailes,
#                 DebitNoteVoucher_Entry_Table_Detailes,
#             ]

#             allArr = []

#             for grpId in [2, 3]:
#                 Expgroup = Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=grpId)
#                 for grouprow in Expgroup:
#                     exgroup_obj = {
#                         'Groupid': grouprow.pk,
#                         'GroupName': grouprow.GroupName,
#                         'UnderGroupId': grouprow.TypeofGroup,
#                         'NatureOfGroupId': grouprow.NatureOfGroup.pk,
#                         'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
#                         'ledgerarr': [],
#                         'TotalDebit':0,
#                         'TotalCredit':0,
#                         'OpeningBalanceDr':0,
#                         'OpeningBalanceCr':0,
#                     }
#                     allArr.append(exgroup_obj)

#             all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

#             for group in allArr:
#                 process_ledgers(group, all_ledgers, entry_tables)

#             ExpenArr = [entry.copy() for entry in allArr if entry['TotalDebit'] > 0]
#             IncomeArr = [entry.copy() for entry in allArr if entry['TotalCredit'] > 0]

#             TotalDeb = sum(exp['TotalDebit'] for exp in ExpenArr)
#             TotalCre = sum(inc['TotalCredit'] for inc in IncomeArr)

#             empty_Obj = {
#                 'Groupid': '',
#                 'GroupName': '',
#                 'UnderGroupId': '',
#                 'NatureOfGroupId': '',
#                 'UnderGroup': '',
#                 'ledgerarr': [],
#                 'TotalDebit': 0,
#                 'TotalCredit': 0,
#             }

#             if TotalDeb < TotalCre:
#                 profitin = TotalCre - TotalDeb
#                 ExpenArr.append({'Groupid': '', 'GroupName': 'Gross Profit c/o', 'ledgerarr': [], 'TotalDebit': profitin, 'TotalCredit': 0})
#                 IncomeArr.append(empty_Obj)
#             elif TotalDeb > TotalCre:
#                 lossexp = TotalDeb - TotalCre
#                 ExpenArr.append(empty_Obj)
#                 IncomeArr.append({'Groupid': '', 'GroupName': 'Gross loss c/o', 'ledgerarr': [], 'TotalDebit': 0, 'TotalCredit': lossexp})

#             # Calculate maxRows, considering ledger entries
#             maxRows = max(
#                 len(ExpenArr) + sum(len(entry['ledgerarr']) for entry in ExpenArr),
#                 len(IncomeArr) + sum(len(entry['ledgerarr']) for entry in IncomeArr)
#             )
#             print('maxRows-----', maxRows)

#             # Add empty rows to balance ExpenArr and IncomeArr
#             while len(ExpenArr) + sum(len(entry['ledgerarr']) for entry in ExpenArr) < maxRows:
#                 ExpenArr.append(empty_Obj)

#             while len(IncomeArr) + sum(len(entry['ledgerarr']) for entry in IncomeArr) < maxRows:
#                 IncomeArr.append(empty_Obj)

#             print('maxRows-----1111', maxRows, '1111', len(ExpenArr), '22222', len(IncomeArr))

#             if TotalDeb < TotalCre:
#                 profitin = TotalCre - TotalDeb
#                 ExpenArr.extend([
#                     {**empty_Obj, 'TotalDebit': TotalDeb + profitin},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Nett Profit', 'TotalDebit': profitin},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Total', 'TotalDebit': profitin}
#                 ])
#                 IncomeArr.extend([
#                     {**empty_Obj, 'TotalCredit': TotalCre},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Gross Profit b/f', 'TotalCredit': profitin},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Total', 'TotalCredit': profitin}
#                 ])

#             elif TotalDeb > TotalCre:
#                 lossexp = TotalDeb - TotalCre
#                 ExpenArr.extend([
#                     {**empty_Obj, 'TotalDebit': TotalDeb},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Gross Loss b/f', 'TotalDebit': lossexp},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Total', 'TotalDebit': lossexp}
#                 ])
#                 IncomeArr.extend([
#                     {**empty_Obj, 'TotalCredit': lossexp + TotalCre},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Nett Loss', 'TotalCredit': lossexp},
#                     empty_Obj,
#                     {**empty_Obj, 'GroupName': 'Total', 'TotalCredit': lossexp}
#                 ])

#             return JsonResponse({'ExpenArr': ExpenArr, 'IncomeArr': IncomeArr}, safe=False)

#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse({'error': f'An error occurred: {str(e)}'})
        



# @csrf_exempt
# @require_http_methods(['GET'])
# def getbalancesheetreport(request):
#     if request.method == 'GET':
#         try: 
#             AsetArr=[]

#             entry_tables = [
#                 ContraVoucher_Entry_Table_Detailes,
#                 PaymentVoucher_Entry_Table_Detailes,
#                 ReceiptVoucher_Entry_Table_Detailes,
#                 JournalVoucher_Entry_Table_Detailes,
#                 SalesVoucher_Entry_Table_Detailes,
#                 PurchaseVoucher_Entry_Table_Detailes,
#                 CreditNoteVoucher_Entry_Table_Detailes,
#                 DebitNoteVoucher_Entry_Table_Detailes,
#             ]

#             Assetgroup=Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=1)

#             for grouprow in Assetgroup:
#                 exgroup_obj = {
#                         'Groupid': grouprow.pk,
#                         'GroupName': grouprow.GroupName,
#                         'UnderGroupId': grouprow.TypeofGroup,
#                         'NatureOfGroupId': grouprow.NatureOfGroup.pk,
#                         'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
#                         'ledgerarr': [],
#                         'TotalDebit': 0,  
#                         'TotalCredit': 0,
#                         'OpeningBalanceDr':0,
#                         'OpeningBalanceCr':0,
#                         'ClosingBalance':0,
#                         'filterrarr': [],

                        
#                 }
#                 AsetArr.append(exgroup_obj)
            
#             all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

#             for group in AsetArr:
#                 process_ledgers(group, all_ledgers, entry_tables)
#             newAsetArr=[]
#             for mainrow in AsetArr:
#                 for subgrow in mainrow['ledgerarr']:
#                     value, side = subgrow['ClosingBalance'].split()
#                     if float(value) != 0 :
#                         # print('vvv-111',mainrow['GroupName'],subgrow['LedgerName'],value,type(value))
#                         amount = float(value)
#                         subgrow['ClosingBalance'] = amount
#                         mainrow['ClosingBalance'] +=amount
#                         mainrow['filterrarr'].append(subgrow)

#                 if mainrow['ClosingBalance'] != 0 :
#                         newAsetArr.append(mainrow)



#             liabilityArr=[]
#             liabilitygroup=Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=4)

#             for grouprow in liabilitygroup:
#                 libgroup_obj = {
#                         'Groupid': grouprow.pk,
#                         'GroupName': grouprow.GroupName,
#                         'UnderGroupId': grouprow.TypeofGroup,
#                         'NatureOfGroupId': grouprow.NatureOfGroup.pk,
#                         'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
#                         'ledgerarr': [],
#                         'TotalDebit': 0,  
#                         'TotalCredit': 0,
#                         'OpeningBalanceDr':0,
#                         'OpeningBalanceCr':0,
#                         'ClosingBalance':0,
#                         'filterrarr': [],

#                 }
#                 liabilityArr.append(libgroup_obj)

#             for group1 in liabilityArr:
#                 process_ledgers(group1, all_ledgers, entry_tables)  
            
#             newliabilityArr=[]

#             for mainrow in liabilityArr:
#                 for subgrow in mainrow['ledgerarr']:
#                     value, side = subgrow['ClosingBalance'].split()
#                     if float(value) !=0:  
#                         # print('vvv-222',mainrow['GroupName'],subgrow['LedgerName'],value,type(value))
#                         amount = float(value)
#                         subgrow['ClosingBalance'] = amount
#                         mainrow['ClosingBalance'] +=amount
#                         mainrow['filterrarr'].append(subgrow)

#                 if mainrow['ClosingBalance'] != 0 :
#                     newliabilityArr.append(mainrow)



#             allArr = []
#             for grpId in [2, 3]:
#                 Expgroup = Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=grpId)
#                 for grouprow in Expgroup:
#                     exgroup_obj = {
#                         'Groupid': grouprow.pk,
#                         'GroupName': grouprow.GroupName,
#                         'UnderGroupId': grouprow.TypeofGroup,
#                         'NatureOfGroupId': grouprow.NatureOfGroup.pk,
#                         'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
#                         'ledgerarr': [],
#                         'TotalDebit':0,
#                         'TotalCredit':0,
#                         'OpeningBalanceDr':0,
#                         'OpeningBalanceCr':0,
#                     }
#                     allArr.append(exgroup_obj)

#             all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

#             for group in allArr:
#                 process_ledgers(group, all_ledgers, entry_tables)

#             ExpenArr = [entry.copy() for entry in allArr if entry['TotalDebit'] > 0]
#             IncomeArr = [entry.copy() for entry in allArr if entry['TotalCredit'] > 0]

#             TotalDeb = sum(exp['TotalDebit'] for exp in ExpenArr)
#             TotalCre = sum(inc['TotalCredit'] for inc in IncomeArr)


            
#             empty_Obj = {
#                         'Groupid':'',
#                         'GroupName':'',
#                         'UnderGroupId':'',
#                         'NatureOfGroupId':'',
#                         'UnderGroup':'',
#                         'ledgerarr': [],
#                         'TotalDebit': 0,  
#                         'TotalCredit': 0,
#                         'OpeningBalanceDr':0,
#                         'OpeningBalanceCr':0,
#                         'ClosingBalance':0,
#                         'filterrarr': [],
#                         }
        
            
#             liabilityArr_total_closing_balance=0
#             newAsetArr_total_closing_balance=0

#             for item in newliabilityArr:
#                 liabilityArr_total_closing_balance += item.get('ClosingBalance', 0)
                
#             for item in newAsetArr:
#                 newAsetArr_total_closing_balance += item.get('ClosingBalance', 0)


#             if TotalDeb < TotalCre:
#                 profitin = TotalCre - TotalDeb
#                 newliabilityArr.append({'Groupid': '', 'GroupName': 'Net Profit c/o', 'ledgerarr': [],'TotalDebit': 0,'TotalCredit': 0,'ClosingBalance': profitin, 'filterrarr': []})
#                 liabilityArr_total_closing_balance+=profitin


#             elif TotalDeb > TotalCre:
#                 lossexp = TotalDeb - TotalCre
#                 newliabilityArr.append({'Groupid': '', 'GroupName': 'Net loss c/o', 'ledgerarr': [],'TotalDebit': 0,'TotalCredit': 0, 'ClosingBalance': lossexp,'filterrarr': []})
#                 liabilityArr_total_closing_balance-=lossexp
            
#             maxRows = max(
#                 len(newliabilityArr) + sum(len(entry['filterrarr']) for entry in newliabilityArr),
#                 len(newAsetArr) + sum(len(entry['filterrarr']) for entry in newAsetArr)
#             )
#             while len(newliabilityArr) + sum(len(entry['filterrarr']) for entry in newliabilityArr) < maxRows:
#                 newliabilityArr.append(empty_Obj)

#             while len(newAsetArr) + sum(len(entry['filterrarr']) for entry in newAsetArr) < maxRows:
#                 newAsetArr.append(empty_Obj)

#             return JsonResponse ({'liabilityArr':newliabilityArr,'AsetArr':newAsetArr,'Totalamount_lib':liabilityArr_total_closing_balance,'Totalamount_Ass':newAsetArr_total_closing_balance},safe=False)
        
#         except Exception as e:
#             print(f'An error occurred: {str(e)}')
#             return JsonResponse ({'error':f'An error occurred:{str(e)}'})


from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import *
from django.db.models import Q
import json
from django.apps import apps
import re
from . import FinanceMaster
from datetime import datetime
from decimal import Decimal

@csrf_exempt
@require_http_methods(['GET'])
def Get_Finance_PrimeGroupMasters(request):
    if request.method == 'GET':
        try:
            Finance_PrimeGgroup_Inst=Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Prime')

            Group_Arr=[]

            for row in Finance_PrimeGgroup_Inst:
                Group_Dis={
                    'id':row.pk,
                    'GroupName':row.GroupName,
                }
                Group_Arr.append(Group_Dis)


            return JsonResponse(Group_Arr,safe=False)
        
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
        
# ---------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["GET"])
def  Get_NatureOfGroupMaster_detailes(request):
    if request.method == 'GET':
        try:
            NatureOfGroup_Ins=Finance_NatureOfGroup_Detailes.objects.all()

            NOG_Arr=[]

            for row in NatureOfGroup_Ins:
                NOG_dec={
                    'id':row.pk,
                    'NatureOfGroupName':row.NatureOfGroupName,
                }
                NOG_Arr.append(NOG_dec)

            return JsonResponse(NOG_Arr,safe=False)

        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
        
# ---------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["POST"])
def Postdata_GroupMasters(request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)

            # print('tttttttttt',data)

            GroupName=data.get('GroupName')
            UnderCategory=data.get('UnderCategory')
            NatureOfGroup=data.get('NatureOfGroup')
            createby=data.get('createby')

            EditGroupID=data.get('EditGroupID')

            # print(UnderCategory,EditGroupID,'iiiiiiii')

            if EditGroupID:
                Update_Ins=Finance_GroupMaster_Detailes.objects.get(pk=EditGroupID)
                Update_Ins.GroupName=GroupName
                Update_Ins.Updated_by=createby

                if UnderCategory == 'Prime':
                    NatureOfGroup_INS=Finance_NatureOfGroup_Detailes.objects.get(pk=NatureOfGroup)
                    Update_Ins.NatureOfGroup=NatureOfGroup_INS
                    Update_Ins.ParentGroup=None
                    Update_Ins.TypeofGroup=UnderCategory
                else:
                    # print('kkkkkk')                   
                    Finance_Prime_Group_INS=Finance_GroupMaster_Detailes.objects.get(pk=UnderCategory)
                    Update_Ins.NatureOfGroup=Finance_Prime_Group_INS.NatureOfGroup
                    Update_Ins.ParentGroup=Finance_Prime_Group_INS   
                    Update_Ins.TypeofGroup='Sub'

                Update_Ins.save()
                return JsonResponse ({'success': 'Update successfully'})


            else:
                if UnderCategory == 'Prime':
                    NatureOfGroup_INS=Finance_NatureOfGroup_Detailes.objects.get(pk=NatureOfGroup)
                    Finance_GroupMaster_Detailes.objects.create(
                        GroupName=GroupName,
                        TypeofGroup=UnderCategory,
                        NatureOfGroup=NatureOfGroup_INS,
                        created_by=createby
                    )
                
                else:
                    Finance_Prime_Group_INS=Finance_GroupMaster_Detailes.objects.get(pk=UnderCategory)
                    Finance_GroupMaster_Detailes.objects.create(
                    GroupName=GroupName,
                    TypeofGroup='Sub',
                    ParentGroup=Finance_Prime_Group_INS,
                    NatureOfGroup=Finance_Prime_Group_INS.NatureOfGroup,
                    created_by=createby
                    )

                return JsonResponse ({'success': 'Save successfully'})

        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
         

# ---------------------------------------------------------------------------------



@csrf_exempt
@require_http_methods(['GET'])
def allgrouplistmasterget(request):
    if request.method == 'GET':
        try:
            GroupArray=[]
            Get_Group=Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Prime')            
            if Get_Group:
                for row in Get_Group:
                    dataObj={
                        'id':row.pk,
                        'GroupName':row.GroupName,
                        'UnderGroupId':row.TypeofGroup,
                        'NatureOfGroupId':row.NatureOfGroup.pk,
                        'UnderGroup':row.NatureOfGroup.NatureOfGroupName,
                    }
                    GroupArray.append(dataObj)
                    Get_SubGroup=Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Sub',ParentGroup=row)
                    if Get_SubGroup:
                        for subrow in Get_SubGroup:
                            subdataObj={
                                'id':subrow.pk,
                                'GroupName':subrow.GroupName,
                                'UnderGroupId':subrow.ParentGroup.pk,
                                'NatureOfGroupId':subrow.ParentGroup.NatureOfGroup.pk,
                                'UnderGroup':subrow.ParentGroup.GroupName,
                            }
                            GroupArray.append(subdataObj)
            # print('dataArray',GroupArray)
            return JsonResponse(GroupArray,safe=False)
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})


# ---------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(['POST','GET'])
def postledgermasterdata (request):
    if request.method == 'POST':
        try:
            data=json.loads(request.body)

            # print('data',data)

            LedgerName=data.get('LedgerName')
            GroupName=data.get('GroupName')
            OpeningBalance=data.get('OpeningBalance')
            DebitOrCredit=data.get('DebitOrCredit')
            PhoneNumber=data.get('PhoneNumber')
            PANORITNO=data.get('PANORITNO')
            GSTNo=data.get('GSTNo')
            Address=data.get('Address')
            ProvideBankDetails=data.get('ProvideBankDetails')

            BankHolderName=data.get('BankHolderName')
            BankName=data.get('BankName')
            AccountNumber=data.get('AccountNumber')
            Branch=data.get('Branch')
            IFSCcode=data.get('IFSCcode')
            PanNumber=data.get('PanNumber')

            createby=data.get('createby')

            LedgerEditId=data.get('LedgerEditId')

            if GroupName:
                GroupMaster_Ins=Finance_GroupMaster_Detailes.objects.get(pk=GroupName)

            if LedgerEditId:
                LedgerMasters_Ins=Finance_LedgerMasters_Detailes.objects.get(pk=LedgerEditId)
                
                LedgerMasters_Ins.LedgerName=LedgerName
                LedgerMasters_Ins.LedgerGroupName=GroupMaster_Ins
                LedgerMasters_Ins.OpeningBalance=OpeningBalance
                LedgerMasters_Ins.DebitOrCredit=DebitOrCredit
                LedgerMasters_Ins.PhoneNumber=PhoneNumber
                LedgerMasters_Ins.PANorITNo=PANORITNO
                LedgerMasters_Ins.GSTNo=GSTNo
                LedgerMasters_Ins.Address=Address
                LedgerMasters_Ins.ProvideBankDetails=ProvideBankDetails
                LedgerMasters_Ins.Updated_by=createby
                LedgerMasters_Ins.save()
                if ProvideBankDetails == True :
                    try:
                        LedgerMasters_Bank_Ins=Finance_LedgerMasters_Bank_Detailes.objects.get(LedgerMaster=LedgerMasters_Ins)
            
                        LedgerMasters_Bank_Ins.BankHolderName=BankHolderName
                        LedgerMasters_Bank_Ins.BankName=BankName
                        LedgerMasters_Bank_Ins.AccountNumber=AccountNumber
                        LedgerMasters_Bank_Ins.Branch=Branch
                        LedgerMasters_Bank_Ins.IFSCcode=IFSCcode
                        LedgerMasters_Bank_Ins.PANNumber=PanNumber
                        LedgerMasters_Bank_Ins.save()

                    except Finance_LedgerMasters_Bank_Detailes.DoesNotExist:
                        
                        Finance_LedgerMasters_Bank_Detailes.objects.create(
                        LedgerMaster=LedgerMasters_Ins,
                        BankHolderName=BankHolderName,
                        BankName=BankName,
                        AccountNumber=AccountNumber,
                        Branch=Branch,
                        IFSCcode=IFSCcode,
                        PANNumber=PanNumber
                        )
                else:
                    LedgerMasters_Bank_Ins = Finance_LedgerMasters_Bank_Detailes.objects.filter(LedgerMaster=LedgerMasters_Ins)
                    if LedgerMasters_Bank_Ins.exists():
                        LedgerMasters_Bank_Ins.delete()
                    else:
                        print("No matching record found in Finance_LedgerMasters_Bank_Detailes for the given LedgerMaster.")


                return JsonResponse ({'success': 'Update successfully'})

            else:
                Ledger_Ins = Finance_LedgerMasters_Detailes.objects.create(
                    LedgerName=LedgerName,
                    LedgerGroupName=GroupMaster_Ins,
                    OpeningBalance=OpeningBalance,
                    DebitOrCredit=DebitOrCredit,
                    PhoneNumber=PhoneNumber,
                    PANorITNo=PANORITNO,
                    GSTNo=GSTNo,
                    Address=Address,
                    ProvideBankDetails=ProvideBankDetails,
                    created_by=createby
                )

                if ProvideBankDetails == True :
                    Finance_LedgerMasters_Bank_Detailes.objects.create(
                        LedgerMaster=Ledger_Ins,
                        BankHolderName=BankHolderName,
                        BankName=BankName,
                        AccountNumber=AccountNumber,
                        Branch=Branch,
                        IFSCcode=IFSCcode,
                        PANNumber=PanNumber
                    )
                                    
                return JsonResponse ({'success': 'Save successfully'})

        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})
    
    elif request.method == 'GET':
        try:

            LedgerArray=[]

            LedgerMasters=Finance_LedgerMasters_Detailes.objects.all()

            for Ledger in LedgerMasters:
                Led_dic={
                    'id':Ledger.pk,
                    'LedgerName':Ledger.LedgerName,
                    'GroupName':Ledger.LedgerGroupName.pk,
                    'UseGroupName':Ledger.LedgerGroupName.GroupName,
                    'OpeningBalance':Ledger.OpeningBalance,
                    'DebitOrCredit':Ledger.DebitOrCredit,
                    'PhoneNumber':Ledger.PhoneNumber,
                    'PANORITNO':Ledger.PANorITNo,
                    'GSTNo':Ledger.GSTNo,
                    'Address':Ledger.Address,
                    'ProvideBankDetails':Ledger.ProvideBankDetails,
                }         

                if Led_dic['ProvideBankDetails'] == True :
                    Bank_Detailes=Finance_LedgerMasters_Bank_Detailes.objects.get(LedgerMaster=Ledger)
                    if Bank_Detailes:
                        Led_dic['Bank_Detailes']={
                            'BankHolderName':Bank_Detailes.BankHolderName,
                            'BankName':Bank_Detailes.BankName,
                            'AccountNumber':Bank_Detailes.AccountNumber,
                            'Branch':Bank_Detailes.Branch,
                            'IFSCcode':Bank_Detailes.IFSCcode,
                            'PanNumber':Bank_Detailes.PANNumber
                        }

                LedgerArray.append(Led_dic)

            return JsonResponse (LedgerArray,safe=False)
        
        except Exception as e:
            print(f'An error Accurred:{str(e)}')
            return JsonResponse({'error':f'An error Accurred:{str(e)}'})


# ---------------------------------------------------------------------------------



@csrf_exempt
@require_http_methods(["GET"])
def getassetledgerforvouchersbytype(request):
    try:
        voucher_type = request.GET.get('voucherType')
        if not voucher_type:
            return JsonResponse({'error': 'Voucher type is required'}, status=400)

        query = Q()
        if voucher_type == 'ContraVoucher':
            query = Q(LedgerGroupName__NatureOfGroup__pk=1)

        ledgers_grp = AllLedgers_Mapping_Detailes.objects.all()
        result_array = []

        for ledger in ledgers_grp:
            try:
                match = re.search(r"<class '(\w+)\.models\.(\w+)'>", ledger.TableName)
                if not match:
                    continue

                app_label, model_name = match.groups()
                table_model = apps.get_model(app_label, model_name)
                ledger_instance = table_model.objects.filter(Q(pk=ledger.TableId) & query).first()
                if ledger_instance:
                    result_array.append({
                        'id': ledger.pk,
                        'LedgerName': ledger_instance.LedgerName,
                        'GroupName': ledger_instance.LedgerGroupName.pk,
                        'UseGroupName': ledger_instance.LedgerGroupName.GroupName,
                        'OpeningBalance': ledger_instance.OpeningBalance,
                        'DebitOrCredit': ledger_instance.DebitOrCredit,
                    })
            except Exception as e:
                print(f"Error processing ledger {ledger.pk}: {str(e)}")

        return JsonResponse(result_array, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)



# ---------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def postvoucherdataallvouchers(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            VoucherNo = data.get('VoucherNo')
            # print('VoucherNo', VoucherNo)

            voucherType = data.get('voucherType')
            # print('voucherType????', voucherType)
            VoucherDate = data.get('VoucherDate')
            PaymentType = data.get('PaymentType')
            VoucherNarration = data.get('VoucherNarration')
            createby = data.get('createby')

            VoucherEntryarray = data.get('VoucherEntryarray')
            
            # print('VoucherEntryarray',VoucherEntryarray)


            EditNumchange = data.get('EditNumchange')

            if EditNumchange:
                
                model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                Voucher_Main_Debit_Ins = model_class.objects.get(pk=EditNumchange)
                Voucher_Main_Debit_Ins.Status = not Voucher_Main_Debit_Ins.Status
                Voucher_Main_Debit_Ins.save()

                return JsonResponse({'success': 'Status updated successfully'})

            if VoucherEntryarray:

                if VoucherNo:
                    model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                    Voucher_Main_Debit_Ins = model_class.objects.get(pk=VoucherNo)

                    Voucher_Main_Debit_Ins.VoucherDate = VoucherDate
                    if voucherType != 'JournalVoucher':
                        Voucher_Main_Debit_Ins.PaymentType = PaymentType
                    Voucher_Main_Debit_Ins.VoucherNarration = VoucherNarration

                    Voucher_Main_Debit_Ins.save()

                    entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
                    entry_model_class.objects.filter(**{f"{voucherType}MainTable": Voucher_Main_Debit_Ins}).delete()
                    
                    # print('VoucherEntryarray',VoucherEntryarray)

                    for rowdata in VoucherEntryarray:
                        CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

                        entry_model_class.objects.create(
                            **{f"{voucherType}MainTable": Voucher_Main_Debit_Ins},
                            Particulars=CreditLedger_Ins,
                            DebitAmount=rowdata.get('Debit'),
                            CreditAmount=rowdata.get('Credit')
                        )

                    return JsonResponse({'success': 'Updated successfully'})

                else:
                    if voucherType != 'JournalVoucher':
                        model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                        Vocher_Main_Ins = model_class.objects.create(
                            VoucherDate=VoucherDate,
                            PaymentType=PaymentType,
                            VoucherNarration=VoucherNarration,
                            created_by=createby
                        )
                    else:
                        model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                        Vocher_Main_Ins = model_class.objects.create(
                            VoucherDate=VoucherDate,
                            VoucherNarration=VoucherNarration,
                            created_by=createby
                        )

                    entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
                    for rowdata in VoucherEntryarray:
                        CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

                        entry_model_class.objects.create(
                            **{f"{voucherType}MainTable": Vocher_Main_Ins},  
                            Particulars=CreditLedger_Ins,
                            DebitAmount=rowdata.get('Debit'),
                            CreditAmount=rowdata.get('Credit')
                        )

                    return JsonResponse({'success': 'Saved successfully'})

            else:
                return JsonResponse({'error': 'Data Not Found'})

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})

    elif request.method == "GET":
        try:
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')

            voucherType = request.GET.get('voucherType')
            
            # print('voucherType*****', voucherType)

            qeary = Q()

            if FromDate and ToDate:
                qeary &= Q(VoucherDate__range=[FromDate, ToDate])

            model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
            entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")

            Contra_main_data = model_class.objects.filter(qeary)

            Cantraarray = []
            for main in Contra_main_data:
                Maindic = {
                    'id': main.pk,
                    'VoucherDate': main.VoucherDate,
                    'PaymentType': main.PaymentType if voucherType != 'JournalVoucher' else None,
                    'VoucherNarration': main.VoucherNarration,
                    'Status': main.Status,
                    'VoucherEntryarray': []
                }

                Credit_Table_Ins = entry_model_class.objects.filter(**{f"{voucherType}MainTable": main})

                num = 1
                for getdata in Credit_Table_Ins:

                    # print('kkkk',getdata.Particulars.TableName)

                    match = re.search(r"<class '(\w+)\.models\.(\w+)'>", getdata.Particulars.TableName)
                    if match:
                        app_label = match.group(1) 
                        model_name = match.group(2)  
                        # print(f"App Label: {app_label}, Model Name: {model_name}")
                    else:
                        print("Invalid class string format")
                    table_model = apps.get_model(app_label, model_name)
                    getsingleledger = table_model.objects.get(pk=getdata.Particulars.TableId)

                    Creditdic = {
                        'id': num,                        
                        'ParticularsId':getdata.Particulars.pk,
                        'Particulars': getsingleledger.LedgerName,
                        'Debit': float(getdata.DebitAmount),
                        'Credit': float(getdata.CreditAmount),
                    }
                    Maindic['VoucherEntryarray'].append(Creditdic)
                    num += 1

                Cantraarray.append(Maindic)
                Cantraarray = sorted(Cantraarray, key=lambda x: (x['VoucherDate'], x['id']), reverse=True)

            return JsonResponse(Cantraarray, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})

# ---------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["POST","OPTIONS","GET"])
def postvoucherdataSecondfourvouchers(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            VoucherNo = data.get('VoucherNo')
            # print('VoucherNo', VoucherNo)

            voucherType = data.get('voucherType')
            # print('voucherType+++++', voucherType)
            VoucherDate = data.get('VoucherDate')
            PaymentType = data.get('PaymentType')
            VoucherNarration = data.get('VoucherNarration')
            createby = data.get('createby')

            VoucherEntryarray = data.get('VoucherEntryarray')

            EditNumchange = data.get('EditNumchange')

            if EditNumchange:
                
                model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                Voucher_Main_Debit_Ins = model_class.objects.get(pk=EditNumchange)
                Voucher_Main_Debit_Ins.Status = not Voucher_Main_Debit_Ins.Status
                Voucher_Main_Debit_Ins.save()

                return JsonResponse({'success': 'Status updated successfully'})
            
            if VoucherEntryarray:
                if VoucherNo:
                    model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                    Voucher_Main_Debit_Ins = model_class.objects.get(pk=VoucherNo)
                    Voucher_Main_Debit_Ins.VoucherDate = VoucherDate
                    Voucher_Main_Debit_Ins.PaymentType = PaymentType
                    Voucher_Main_Debit_Ins.VoucherNarration = VoucherNarration

                    Voucher_Main_Debit_Ins.save()

                    entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
                    entry_model_class.objects.filter(**{f"{voucherType}MainTable": Voucher_Main_Debit_Ins}).delete()

                    for rowdata in VoucherEntryarray:
                        CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

                        entry_model_class.objects.create(
                            **{f"{voucherType}MainTable": Voucher_Main_Debit_Ins},
                            Particulars=CreditLedger_Ins,
                            UnitOrTax=rowdata.get('UnitOrTax'),
                            UnitOrTaxValue=rowdata.get('UnitOrTaxValue'),
                            PerUnitOrTaxable=rowdata.get('PerUnitOrTaxable'),
                            RatePerUnitOrTaxableValue=rowdata.get('RatePerUnitOrTaxableValue'),
                            DebitAmount=rowdata.get('Debit'),
                            CreditAmount=rowdata.get('Credit')
                        )
                    

                    return JsonResponse({'success': 'Updated successfully'})

                else:
                    model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
                    Voucher_Main_Debit_Ins = model_class.objects.create(
                        VoucherDate=VoucherDate,
                        PaymentType=PaymentType,
                        VoucherNarration=VoucherNarration,
                        created_by=createby
                    )

                    entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")
                    
                    for rowdata in VoucherEntryarray:
                        CreditLedger_Ins = AllLedgers_Mapping_Detailes.objects.get(pk=rowdata.get('ParticularsId'))

                        entry_model_class.objects.create(
                            **{f"{voucherType}MainTable": Voucher_Main_Debit_Ins},
                            Particulars=CreditLedger_Ins,
                            UnitOrTax=rowdata.get('UnitOrTax'),
                            UnitOrTaxValue=rowdata.get('UnitOrTaxValue'),
                            PerUnitOrTaxable=rowdata.get('PerUnitOrTaxable'),
                            RatePerUnitOrTaxableValue=rowdata.get('RatePerUnitOrTaxableValue'),
                            DebitAmount=rowdata.get('Debit'),
                            CreditAmount=rowdata.get('Credit')
                        )
                
                    return JsonResponse({'success': 'Saved successfully'})
            else:
                return JsonResponse({'error': 'Data Not Found'})
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})

    elif request.method == "GET":
        try:
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')

            voucherType = request.GET.get('voucherType')
        

            qeary = Q()

            if FromDate and ToDate:
                qeary &= Q(VoucherDate__range=[FromDate, ToDate])

            model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
            entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")

            Contra_main_data = model_class.objects.filter(qeary)

            Cantraarray = []
            for main in Contra_main_data:
                Maindic = {
                    'id': main.pk,
                    'VoucherDate': main.VoucherDate,
                    'PaymentType': main.PaymentType,
                    'VoucherNarration': main.VoucherNarration,
                    'Status': main.Status,
                    'VoucherEntryarray': []
                }

                Credit_Table_Ins = entry_model_class.objects.filter(**{f"{voucherType}MainTable": main})

                num = 1
                for getdata in Credit_Table_Ins:

                    match = re.search(r"<class '(\w+)\.models\.(\w+)'>", getdata.Particulars.TableName)
                    if match:
                        app_label = match.group(1) 
                        model_name = match.group(2)  
                        # print(f"App Label: {app_label}, Model Name: {model_name}")
                    else:
                        print("Invalid class string format")
                    table_model = apps.get_model(app_label, model_name)
                    getsingleledger = table_model.objects.get(pk=getdata.Particulars.TableId)

                    Creditdic = {
                        'id': num,
                        'ParticularsId':getdata.Particulars.pk,
                        'Particulars': getsingleledger.LedgerName,
                        'UnitOrTax':getdata.UnitOrTax,
                        'UnitOrTaxValue': float(getdata.UnitOrTaxValue),
                        'PerUnitOrTaxable':getdata.PerUnitOrTaxable,
                        'RatePerUnitOrTaxableValue': float(getdata.RatePerUnitOrTaxableValue),
                        'Debit': float(getdata.DebitAmount),
                        'Credit': float(getdata.CreditAmount),
                    }
                    Maindic['VoucherEntryarray'].append(Creditdic)
                    num += 1

                Cantraarray.append(Maindic)
                Cantraarray = sorted(Cantraarray, key=lambda x: (x['VoucherDate'], x['id']), reverse=True)

            return JsonResponse(Cantraarray, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})



# ---------------------------------------------------------------------------------




@csrf_exempt
@require_http_methods(["GET"])
def get_ledger_report_list(request):
    try:
        ledgers_grp = AllLedgers_Mapping_Detailes.objects.all()
        result_array = []

       
        voucher_models = {
            ContraVoucher_Entry_Table_Detailes: 'ContraVoucherMainTable',
            PaymentVoucher_Entry_Table_Detailes: 'PaymentVoucherMainTable',
            ReceiptVoucher_Entry_Table_Detailes: 'ReceiptVoucherMainTable',
            JournalVoucher_Entry_Table_Detailes: 'JournalVoucherMainTable',
            SalesVoucher_Entry_Table_Detailes: 'SalesVoucherMainTable',
            PurchaseVoucher_Entry_Table_Detailes: 'PurchaseVoucherMainTable',
            CreditNoteVoucher_Entry_Table_Detailes: 'CreditNoteVoucherMainTable',
            DebitNoteVoucher_Entry_Table_Detailes: 'DebitNoteVoucherMainTable',
        }

        for ledger in ledgers_grp:
            try:
                match = re.search(r"<class '(\w+)\.models\.(\w+)'>", ledger.TableName)
                if not match:
                    continue

                app_label, model_name = match.groups()
                table_model = apps.get_model(app_label, model_name)
                ledger_instance = table_model.objects.filter(pk=ledger.TableId).first()

                if ledger_instance:
                    Led_dic = {
                        'id': ledger.pk,
                        'LedgerName': ledger_instance.LedgerName,
                        'GroupName': ledger_instance.LedgerGroupName.pk,
                        'UseGroupName': ledger_instance.LedgerGroupName.GroupName,
                        'OpeningBalance': ledger_instance.OpeningBalance,
                        'DebitOrCredit': ledger_instance.DebitOrCredit,
                        'Debit': 0,
                        'Credit': 0,
                        'ClosingBalance': 0,
                        'NatureOfgroupId': ledger_instance.LedgerGroupName.NatureOfGroup.pk,
                    }

                    for model, foreign_key in voucher_models.items():
                        filter_criteria = {
                            f"{foreign_key}__Status": True,
                            'Particulars_id': ledger.pk,
                        }
                        entries = model.objects.filter(**filter_criteria)

                        Led_dic['Debit'] += entries.aggregate(total=models.Sum('DebitAmount'))['total'] or 0
                        Led_dic['Credit'] += entries.aggregate(total=models.Sum('CreditAmount'))['total'] or 0

                    
                    nature_of_group_id = ledger_instance.LedgerGroupName.NatureOfGroup.pk

                    Led_dic['ClosingBalance'] = 0

                    if  ledger_instance.DebitOrCredit == 'Dr' and (ledger_instance.OpeningBalance + Led_dic['Debit']) >= Led_dic['Credit']:
                        print('111',Led_dic['LedgerName'],ledger_instance.OpeningBalance)
                        TotalAmo = (
                                ledger_instance.OpeningBalance + (Led_dic['Debit'] - Led_dic['Credit'])
                            ) 
                        Led_dic['ClosingBalance']=f"{TotalAmo} {'Dr'}"

                    elif ledger_instance.DebitOrCredit == 'Dr' and (ledger_instance.OpeningBalance + Led_dic['Debit']) <= Led_dic['Credit'] :
                        print('222',Led_dic['LedgerName'],ledger_instance.OpeningBalance)

                        TotalAmo = (Led_dic['Credit'] - (Led_dic['Debit'] + ledger_instance.OpeningBalance))

                        Led_dic['ClosingBalance']=f"{TotalAmo} {'Cr'}"
                    
                    elif ledger_instance.DebitOrCredit == 'Cr' and (ledger_instance.OpeningBalance + Led_dic['Credit']) >= Led_dic['Debit'] :
                        print('333',Led_dic['LedgerName'],ledger_instance.OpeningBalance)

                        TotalAmo = (
                                ledger_instance.OpeningBalance + (Led_dic['Credit'] - Led_dic['Debit'])
                            ) 
                        Led_dic['ClosingBalance']=f"{TotalAmo} {'Cr'}"

                    elif ledger_instance.DebitOrCredit == 'Cr' and (ledger_instance.OpeningBalance + Led_dic['Credit']) <= Led_dic['Debit'] :
                        print('444',Led_dic['LedgerName'],ledger_instance.OpeningBalance)

                        TotalAmo = (Led_dic['Debit'] - (Led_dic['Credit'] + ledger_instance.OpeningBalance))

                        Led_dic['ClosingBalance']=f"{TotalAmo} {'Dr'}"

                    
                     
                        

                    Led_dic['OpeningBalance'] = f"{ledger_instance.OpeningBalance} {ledger_instance.DebitOrCredit}"

                    result_array.append(Led_dic)

            except Exception as e:
                print(f"Error processing ledger {ledger.pk}: {str(e)}")

        return JsonResponse(result_array, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)


# ---------------------------------------------------------------------------------



@csrf_exempt
@require_http_methods(["GET"])
def getsingleledgeralldata(request):
    if request.method == "GET":
        try:
            LedgerMasterId = request.GET.get('LedgerMasterId')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')

            # print('LedgerMasterId------',LedgerMasterId, FromDate, ToDate)

            arrayy = []

            entry_tables = [
                ContraVoucher_Entry_Table_Detailes,
                PaymentVoucher_Entry_Table_Detailes,
                ReceiptVoucher_Entry_Table_Detailes,
                JournalVoucher_Entry_Table_Detailes,
                SalesVoucher_Entry_Table_Detailes,
                PurchaseVoucher_Entry_Table_Detailes,
                CreditNoteVoucher_Entry_Table_Detailes,
                DebitNoteVoucher_Entry_Table_Detailes,
            ]

            ForeignKeydata = {
                ContraVoucher_Entry_Table_Detailes: 'ContraVoucherMainTable',
                PaymentVoucher_Entry_Table_Detailes: 'PaymentVoucherMainTable',
                ReceiptVoucher_Entry_Table_Detailes: 'ReceiptVoucherMainTable',
                JournalVoucher_Entry_Table_Detailes: 'JournalVoucherMainTable',
                SalesVoucher_Entry_Table_Detailes: 'SalesVoucherMainTable',
                PurchaseVoucher_Entry_Table_Detailes: 'PurchaseVoucherMainTable',
                CreditNoteVoucher_Entry_Table_Detailes: 'CreditNoteVoucherMainTable',
                DebitNoteVoucher_Entry_Table_Detailes: 'DebitNoteVoucherMainTable',
            }

            for entry_table in entry_tables:
                filter_criteria = {'Particulars_id': LedgerMasterId}
                filter_criteria[f"{ForeignKeydata[entry_table]}__Status"] = True
                
                if FromDate and ToDate:
                    filter_criteria[f"{ForeignKeydata[entry_table]}__VoucherDate__range"] = (FromDate, ToDate)
                
                print('filter_criteria',filter_criteria)

                voucher_ids = entry_table.objects.filter(**filter_criteria) 

                for main in voucher_ids:
                    entry_data = {
                        "id": len(arrayy) + 1,
                        'EntryId':main.pk,
                        "VoucherNo": getattr(main, ForeignKeydata[entry_table]).pk,
                        "VoucherDate": getattr(main, ForeignKeydata[entry_table]).VoucherDate,
                        "VoucherNarration": getattr(main, ForeignKeydata[entry_table]).VoucherNarration,
                        "Particulars": [],
                        "Debit": main.DebitAmount,
                        "Credit": main.CreditAmount,
                    }

                    arrayy.append(entry_data)

                    filter_criteriaSec = {f"{ForeignKeydata[entry_table]}__pk": getattr(main, ForeignKeydata[entry_table]).pk}
                    voucher_Sec_ids = entry_table.objects.filter(**filter_criteriaSec).exclude(Particulars_id=LedgerMasterId,pk=entry_data['EntryId'])

                    for every in voucher_Sec_ids:
                        for row in arrayy:
                            if row['VoucherNo'] == getattr(every, ForeignKeydata[entry_table]).pk:
                                
                                match = re.search(r"<class '(\w+)\.models\.(\w+)'>", every.Particulars.TableName)
                                if not match:
                                    continue

                                app_label, model_name = match.groups()
                                table_model = apps.get_model(app_label, model_name)
                                ledger_instance = table_model.objects.get(pk=every.Particulars.TableId)
                                
                                particulars_entry = {
                                    'Sub_EntryId':every.id,
                                    "Particulars": ledger_instance.LedgerName,
                                }

                                if float(every.DebitAmount):
                                    particulars_entry["Debit"] = f"{every.DebitAmount} Dr"

                                if float(every.CreditAmount):
                                    particulars_entry["Credit"] = f"{every.CreditAmount} Cr"

                                row['Particulars'].append(particulars_entry)

            merged_data = {}
            # print('000000----++',arrayy)
            for item in arrayy:
                if item["VoucherNo"] not in merged_data:
                    merged_data[item["VoucherNo"]] = {
                        "VoucherNo": item["VoucherNo"],
                        "EntryId": item["EntryId"],
                        "VoucherDate": item["VoucherDate"],
                        "VoucherNarration": item["VoucherNarration"],
                        "Particulars": item["Particulars"],
                        "Debit": item["Debit"],
                        "Credit": item["Credit"],
                    }
                else:
                    merged_data[item["VoucherNo"]]["Debit"] = str(
                        float(merged_data[item["VoucherNo"]]["Debit"]) + float(item["Debit"])
                    )
                    merged_data[item["VoucherNo"]]["Credit"] = str(
                        float(merged_data[item["VoucherNo"]]["Credit"]) + float(item["Credit"])
                    )

            merged_data_list=list(merged_data.values())
            
            for row in merged_data_list:
                sub_entry_ids_seen = set()  
                sub_entry_ids_seen.add(row['EntryId'])
                unique_particulars = []     
                for subrow in row['Particulars']:
                    if subrow['Sub_EntryId'] not in sub_entry_ids_seen:
                        sub_entry_ids_seen.add(subrow['Sub_EntryId'])
                        editobj={
                            "Particulars": subrow['Particulars'],
                        }
                        debit = subrow.get('Debit', None)
                        credit = subrow.get('Credit', None)

                        if debit:  
                            editobj["Debit"] = f"{debit}"
                        if credit: 
                            editobj["Credit"] = f"{credit}"
                        
                        unique_particulars.append(editobj)
                row['Particulars'] = unique_particulars 
            
            alaignArr = []
            num = 1
            for Snrow in merged_data_list:
                setobj = {
                    'id': num,
                    'VoucherNo': Snrow.get('VoucherNo'),
                    'VoucherDate': Snrow.get('VoucherDate'),
                    'VoucherNarration': Snrow.get('VoucherNarration'),
                    'Particulars': Snrow.get('Particulars'),
                    'Debit': Snrow.get('Debit'),
                    'Credit': Snrow.get('Credit'),
                }
                num += 1 
                alaignArr.append(setobj)
            
            return JsonResponse(alaignArr, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})
        


# ---------------------------------------------------------------------------------


@csrf_exempt
@require_http_methods(["GET"])
def getsinglevoucherbyinvoicenumber (request):
    if request.method == "GET":
        try:
            VoucherNo = request.GET.get('VoucherNo')
            voucherType = request.GET.get('voucherType')
            
            print('voucherType*****', voucherType,VoucherNo)

            qeary = Q()

            if VoucherNo:
                qeary &= Q(VoucherNo=VoucherNo)
            

            model_class = getattr(FinanceMaster, f"{voucherType}_Main_Table_Detailes")
            entry_model_class = getattr(FinanceMaster, f"{voucherType}_Entry_Table_Detailes")

            Contra_main_data = model_class.objects.filter(qeary).first()

            
            Maindic = {
                'VoucherNo': Contra_main_data.pk,
                'VoucherDate': Contra_main_data.VoucherDate,
                'VoucherNarration': Contra_main_data.VoucherNarration,
                'VoucherEntryarray': []
                }
            if voucherType not in ['JournalVoucher']:
                Maindic['PaymentType']=Contra_main_data.PaymentType

            Credit_Table_Ins = entry_model_class.objects.filter(**{f"{voucherType}MainTable": Contra_main_data})

            num = 1
            for getdata in Credit_Table_Ins:
                match = re.search(r"<class '(\w+)\.models\.(\w+)'>", getdata.Particulars.TableName)
                if match:
                    app_label = match.group(1) 
                    model_name = match.group(2)  
                    # print(f"App Label: {app_label}, Model Name: {model_name}")
                else:
                    print("Invalid class string format")
                table_model = apps.get_model(app_label, model_name)
                getsingleledger = table_model.objects.get(pk=getdata.Particulars.TableId)

                if voucherType in ['ContraVoucher','PaymentVoucher','ReceiptVoucher', 'JournalVoucher'] :
                    Creditdic = {
                        'id': num,
                        'ParticularsId':getdata.Particulars.pk,
                        'Particulars': getsingleledger.LedgerName,
                        'Debit': float(getdata.DebitAmount),
                        'Credit': float(getdata.CreditAmount),
                    }
                    Maindic['VoucherEntryarray'].append(Creditdic)
                    num += 1

                else:
                    Creditdic = {
                        'id': num,
                        'ParticularsId':getdata.Particulars.pk,
                        'Particulars': getsingleledger.LedgerName,
                        'UnitOrTax':getdata.UnitOrTax,
                        'UnitOrTaxValue': float(getdata.UnitOrTaxValue),
                        'PerUnitOrTaxable':getdata.PerUnitOrTaxable,
                        'RatePerUnitOrTaxableValue': float(getdata.RatePerUnitOrTaxableValue),
                        'Debit': float(getdata.DebitAmount),
                        'Credit': float(getdata.CreditAmount),
                    }
                    Maindic['VoucherEntryarray'].append(Creditdic)
                    num += 1

                

            return JsonResponse(Maindic, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})


# ---------------------------------------------------------------------------------




@csrf_exempt
@require_http_methods(["GET"])
def getdaybookforallvouchers(request):
    if request.method == "GET":
        try:
            VouchersType = request.GET.get('VouchersType')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')

            # Parse dates
            FromDate = datetime.strptime(FromDate, '%Y-%m-%d') if FromDate else None
            ToDate = datetime.strptime(ToDate, '%Y-%m-%d') if ToDate else None

            arrayy = []

            Main_tables=[]

            if VouchersType:
                if VouchersType == 'Contra' :
                    Main_tables.append(ContraVoucher_Main_Table_Detailes)
                if VouchersType == 'Payment' :
                    Main_tables.append(PaymentVoucher_Main_Table_Detailes)
                if VouchersType == 'Receipt' :
                    Main_tables.append(ReceiptVoucher_Main_Table_Detailes)
                if VouchersType == 'Journal' :
                    Main_tables.append(JournalVoucher_Main_Table_Detailes)
                if VouchersType == 'Sales' :
                    Main_tables.append(SalesVoucher_Main_Table_Detailes)
                if VouchersType == 'Purchase' :
                    Main_tables.append(PurchaseVoucher_Main_Table_Detailes)
                if VouchersType == 'CreditNote' :
                    Main_tables.append(CreditNoteVoucher_Main_Table_Detailes)
                if VouchersType == 'DebitNote' :
                    Main_tables.append(DebitNoteVoucher_Main_Table_Detailes)

            else:
                Main_tables = [
                ContraVoucher_Main_Table_Detailes,
                PaymentVoucher_Main_Table_Detailes,
                ReceiptVoucher_Main_Table_Detailes,
                JournalVoucher_Main_Table_Detailes,
                SalesVoucher_Main_Table_Detailes,
                PurchaseVoucher_Main_Table_Detailes,
                CreditNoteVoucher_Main_Table_Detailes,
                DebitNoteVoucher_Main_Table_Detailes,
                ]


            for table in Main_tables:
                filter_criteria = {'Status': True}
                if FromDate and ToDate:
                    filter_criteria["VoucherDate__range"] = (FromDate, ToDate)

                voucher_ids = table.objects.filter(**filter_criteria)

                for main in voucher_ids:
                    entry_data = {
                        "id": len(arrayy) + 1,
                        "VoucherNo": main.pk,
                        "VoucherDate": main.VoucherDate,
                        "VoucherNarration": main.VoucherNarration,
                    }

                    if table == ContraVoucher_Main_Table_Detailes:
                        filterparticular = ContraVoucher_Entry_Table_Detailes.objects.filter(ContraVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'Contra'
                    elif table == PaymentVoucher_Main_Table_Detailes:
                        filterparticular = PaymentVoucher_Entry_Table_Detailes.objects.filter(PaymentVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'Payment'
                    elif table == ReceiptVoucher_Main_Table_Detailes:
                        filterparticular = ReceiptVoucher_Entry_Table_Detailes.objects.filter(ReceiptVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'Receipt'
                    elif table == JournalVoucher_Main_Table_Detailes:
                        filterparticular = JournalVoucher_Entry_Table_Detailes.objects.filter(JournalVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'Journal'
                    elif table == SalesVoucher_Main_Table_Detailes:
                        filterparticular = SalesVoucher_Entry_Table_Detailes.objects.filter(SalesVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'Sales'
                    elif table == PurchaseVoucher_Main_Table_Detailes:
                        filterparticular = PurchaseVoucher_Entry_Table_Detailes.objects.filter(PurchaseVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'Purchase'
                    elif table == CreditNoteVoucher_Main_Table_Detailes:
                        filterparticular = CreditNoteVoucher_Entry_Table_Detailes.objects.filter(CreditNoteVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'CreditNote'
                    elif table == DebitNoteVoucher_Main_Table_Detailes:
                        filterparticular = DebitNoteVoucher_Main_Table_Detailes.objects.filter(DebitNoteVoucherMainTable__pk=main.pk).first()
                        entry_data["VouchersType"] = 'DebitNote'

                    match = re.search(r"<class '(\w+)\.models\.(\w+)'>", filterparticular.Particulars.TableName)
                    if not match:
                        continue
                    app_label, model_name = match.groups()
                    table_model = apps.get_model(app_label, model_name)
                    ledger_instance = table_model.objects.get(pk=filterparticular.Particulars.TableId)

                    # print('ledger_instance',ledger_instance) 
                    entry_data["Particulars"] = ledger_instance.LedgerName
                    entry_data["Debit"] = float(filterparticular.DebitAmount) if float(filterparticular.DebitAmount) != 0 else ''
                    entry_data["Credit"] = float(filterparticular.CreditAmount) if float(filterparticular.CreditAmount) != 0 else ''

                    arrayy.append(entry_data)

            return JsonResponse(arrayy, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})



# ----------------------------------------------------------------------------------------

@csrf_exempt
@require_http_methods(["GET"])
def getcashbookforallvouchers(request):
    if request.method == "GET":
        try:
           
            
            from_date = request.GET.get('FromDate')
            to_date = request.GET.get('ToDate')

            FromDate = datetime.strptime(from_date, '%Y-%m-%d') if from_date else None
            ToDate = datetime.strptime(to_date, '%Y-%m-%d') if to_date else None

            

            arrayy = []

            entry_tables = [
                ContraVoucher_Entry_Table_Detailes,
                PaymentVoucher_Entry_Table_Detailes,
                ReceiptVoucher_Entry_Table_Detailes,
                JournalVoucher_Entry_Table_Detailes,
                SalesVoucher_Entry_Table_Detailes,
                PurchaseVoucher_Entry_Table_Detailes,
                CreditNoteVoucher_Entry_Table_Detailes,
                DebitNoteVoucher_Entry_Table_Detailes,
            ]

            ForeignKeydata = {
                ContraVoucher_Entry_Table_Detailes: 'ContraVoucherMainTable',
                PaymentVoucher_Entry_Table_Detailes: 'PaymentVoucherMainTable',
                ReceiptVoucher_Entry_Table_Detailes: 'ReceiptVoucherMainTable',
                JournalVoucher_Entry_Table_Detailes: 'JournalVoucherMainTable',
                SalesVoucher_Entry_Table_Detailes: 'SalesVoucherMainTable',
                PurchaseVoucher_Entry_Table_Detailes: 'PurchaseVoucherMainTable',
                CreditNoteVoucher_Entry_Table_Detailes: 'CreditNoteVoucherMainTable',
                DebitNoteVoucher_Entry_Table_Detailes: 'DebitNoteVoucherMainTable',
            }
            finance_master1 = Finance_LedgerMasters_Detailes.objects.get(LedgerName='Cash')
            all_ledgers = AllLedgers_Mapping_Detailes.objects.get(TableName=Finance_LedgerMasters_Detailes,TableId=finance_master1.pk)
            openingbal = {}

            if all_ledgers:
                match = re.search(r"<class '(\w+)\.models\.(\w+)'>", all_ledgers.TableName)
                if match:
                    app_label, model_name = match.groups()
                    table_model = apps.get_model(app_label, model_name)
                    cashledger_instance = table_model.objects.get(pk=all_ledgers.TableId)
                    
                    createat = None
                    
                    if hasattr(cashledger_instance, 'Created_at') and cashledger_instance.Created_at:
                        createat = cashledger_instance.Created_at.strftime('%Y-%m-%d')
                    elif hasattr(cashledger_instance, 'created_at') and cashledger_instance.created_at:
                        createat = cashledger_instance.created_at.strftime('%Y-%m-%d')
                    else:
                        createat = datetime.today().strftime('%Y-%m-%d')

                openingbal={
                        'id':1,
                        "VoucherNo": '',
                        "VoucherDate":createat,
                        "VoucherNarration": '',
                        "Particulars":[{'Particulars':'Opening Balance'}],
                    }
                print('7777',cashledger_instance.DebitOrCredit,cashledger_instance.OpeningBalance)
                if cashledger_instance.DebitOrCredit == 'Dr':
                    openingbal["Debit"] = cashledger_instance.OpeningBalance
                elif cashledger_instance.DebitOrCredit == 'Cr':
                    openingbal["Credit"] = cashledger_instance.OpeningBalance           

                # print('openingbal',openingbal)
            
            for entry_table in entry_tables:
                filter_criteria = {'Particulars_id': all_ledgers.pk}
                filter_criteria[f"{ForeignKeydata[entry_table]}__Status"] = True
                
                if FromDate and ToDate:
                    filter_criteria[f"{ForeignKeydata[entry_table]}__VoucherDate__range"] = (FromDate, ToDate)
                
                # print('filter_criteria',filter_criteria)

                voucher_ids = entry_table.objects.filter(**filter_criteria)

                for main in voucher_ids:
                    
                    entry_data = {
                        "id": len(arrayy) + 1,
                        'EntryId':main.pk,
                        "VoucherNo": getattr(main, ForeignKeydata[entry_table]).pk,
                        "VoucherDate": getattr(main, ForeignKeydata[entry_table]).VoucherDate,
                        "VoucherNarration": getattr(main, ForeignKeydata[entry_table]).VoucherNarration,
                        "Particulars": [],
                        "Debit": main.DebitAmount,
                        "Credit": main.CreditAmount,
                    }

                    arrayy.append(entry_data)

                    filter_criteriaSec = {f"{ForeignKeydata[entry_table]}__pk": getattr(main, ForeignKeydata[entry_table]).pk}

                    if float(main.DebitAmount) == 0:
                        filter_criteriaSec["CreditAmount"] = 0  # Corrected dictionary assignment
                    elif float(main.CreditAmount) == 0:
                        filter_criteriaSec["DebitAmount"] = 0
                    
                    voucher_Sec_id = entry_table.objects.filter(**filter_criteriaSec).exclude(
                        Particulars_id=1, pk=entry_data['EntryId']
                    ).first() 


                    if voucher_Sec_id:  
                        match = re.search(r"<class '(\w+)\.models\.(\w+)'>", voucher_Sec_id.Particulars.TableName)
                        if match:
                            app_label, model_name = match.groups()
                            table_model = apps.get_model(app_label, model_name)
                            ledger_instance = table_model.objects.get(pk=voucher_Sec_id.Particulars.TableId)

                            particulars_entry = {
                                'Sub_EntryId': voucher_Sec_id.pk,
                                "Particulars": ledger_instance.LedgerName,
                            }

                            if float(voucher_Sec_id.DebitAmount):
                                particulars_entry["Debit"] = f"{voucher_Sec_id.DebitAmount} Dr"

                            if float(voucher_Sec_id.CreditAmount):
                                particulars_entry["Credit"] = f"{voucher_Sec_id.CreditAmount} Cr"

                            for row in arrayy:
                                if row['VoucherNo'] == getattr(voucher_Sec_id, ForeignKeydata[entry_table]).pk:
                                    row['Particulars'].append(particulars_entry)
        
        
        
            merged_data = {}
            for item in arrayy:
                if item["VoucherNo"] not in merged_data:
                    merged_data[item["VoucherNo"]] = {
                        "VoucherNo": item["VoucherNo"],
                        "EntryId": item["EntryId"],
                        "VoucherDate": item["VoucherDate"],
                        "VoucherNarration": item["VoucherNarration"],
                        "Particulars": item["Particulars"],
                        "Debit": item["Debit"],
                        "Credit": item["Credit"],
                    }
                else:
                    merged_data[item["VoucherNo"]]["Debit"] = str(
                        float(merged_data[item["VoucherNo"]]["Debit"]) + float(item["Debit"])
                    )
                    merged_data[item["VoucherNo"]]["Credit"] = str(
                        float(merged_data[item["VoucherNo"]]["Credit"]) + float(item["Credit"])
                    )

            merged_data_list=list(merged_data.values())
            
            for row in merged_data_list:
                sub_entry_ids_seen = set()  
                sub_entry_ids_seen.add(row['EntryId'])
                unique_particulars = []     
                for subrow in row['Particulars']:
                    if subrow['Sub_EntryId'] not in sub_entry_ids_seen:
                        sub_entry_ids_seen.add(subrow['Sub_EntryId'])
                        editobj={
                            "Particulars": subrow['Particulars'],
                        }
                        debit = subrow.get('Debit', None)
                        credit = subrow.get('Credit', None)

                        if debit:  
                            editobj["Debit"] = f"{debit}"
                        if credit: 
                            editobj["Credit"] = f"{credit}"
                        
                        unique_particulars.append(editobj)
                row['Particulars'] = unique_particulars 
            
            alaignArr = []
            if openingbal :
                 alaignArr.append(openingbal)
            num = 2
            for Snrow in merged_data_list:
                setobj = {
                    'id': num,
                    'VoucherNo': Snrow.get('VoucherNo'),
                    'VoucherDate': Snrow.get('VoucherDate'),
                    'VoucherNarration': Snrow.get('VoucherNarration'),
                    'Particulars': Snrow.get('Particulars'),
                    'Debit': Snrow.get('Debit'),
                    'Credit': Snrow.get('Credit'),
                }
                num += 1 
                alaignArr.append(setobj)


            
            return JsonResponse(alaignArr, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})



def process_ledgers(group_obj, all_ledgers, entry_tables):
    """
    Processes ledgers for the given group object and updates Debit/Credit totals.
    """
    for ledger in all_ledgers:
        match = re.search(r"<class '(\w+)\.models\.(\w+)'>", ledger.TableName)
        if match:
            app_label, model_name = match.groups()
            table_model = apps.get_model(app_label, model_name)
            ledger_instance = table_model.objects.filter(pk=ledger.TableId, LedgerGroupName__pk=group_obj['Groupid']).first()

            if ledger_instance:
                ledger_obj = {
                    'id': len(group_obj['ledgerarr']) + 1,
                    'ledgerid': ledger.pk,
                    'LedgerName': ledger_instance.LedgerName,
                    'OpeningBalance': ledger_instance.OpeningBalance,
                    'DebitOrCredit': ledger_instance.DebitOrCredit,
                    'ledger_Debit':0,
                    'ledger_Credit':0,
                    'Debit': 0,
                    'Credit': 0,
                    'ClosingBalance':0, 
                    'NatureOfGroupId':group_obj['NatureOfGroupId']
                }

                if ledger_instance.OpeningBalance is not None and float(ledger_instance.OpeningBalance) != 0:
                    if ledger_instance.DebitOrCredit == 'Dr':
                        ledger_obj['Debit'] += float(ledger_instance.OpeningBalance)
                        group_obj['TotalDebit'] += float(ledger_instance.OpeningBalance)
                        group_obj['OpeningBalanceDr'] += float(ledger_instance.OpeningBalance)


                    elif ledger_instance.DebitOrCredit == 'Cr':
                        ledger_obj['Credit'] += float(ledger_instance.OpeningBalance)
                        group_obj['TotalCredit'] += float(ledger_instance.OpeningBalance)
                        group_obj['OpeningBalanceCr'] += float(ledger_instance.OpeningBalance)
                
                    
                for entry_table in entry_tables:
                    entries = entry_table.objects.filter(Particulars__pk=ledger.pk).exclude(DebitAmount=0, CreditAmount=0)
                    for entry in entries:
                        if entry.DebitAmount is not None and float(entry.DebitAmount) != 0:
                            ledger_obj['ledger_Debit'] += float(entry.DebitAmount)
                            ledger_obj['Debit'] += float(entry.DebitAmount)
                            group_obj['TotalDebit'] += float(entry.DebitAmount)


                        if entry.CreditAmount is not None and float(entry.CreditAmount) != 0:
                            ledger_obj['ledger_Credit'] += float(entry.CreditAmount)
                            ledger_obj['Credit'] += float(entry.CreditAmount)
                            group_obj['TotalCredit'] += float(entry.CreditAmount)
                        
                
                ledger_obj['ClosingBalance'] = 0
                
                
                if ledger_instance.DebitOrCredit == 'Dr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['ledger_Debit'])) >= Decimal(ledger_obj['ledger_Credit']):
                    print('111', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
                    TotalAmo = (
                        Decimal(ledger_instance.OpeningBalance) + (Decimal(ledger_obj['ledger_Debit']) - Decimal(ledger_obj['ledger_Credit']))
                    )
                    ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Dr'}"

                elif ledger_instance.DebitOrCredit == 'Dr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['ledger_Debit'])) <= Decimal(ledger_obj['ledger_Credit']):
                    print('222', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
                    TotalAmo = Decimal(ledger_obj['ledger_Credit']) - (Decimal(ledger_obj['ledger_Debit']) + Decimal(ledger_instance.OpeningBalance))
                    ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Cr'}"

                elif ledger_instance.DebitOrCredit == 'Cr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['ledger_Credit'])) >= Decimal(ledger_obj['ledger_Debit']):
                    print('333', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
                    TotalAmo = (
                        Decimal(ledger_instance.OpeningBalance) + (Decimal(ledger_obj['ledger_Credit']) - Decimal(ledger_obj['ledger_Debit']))
                    )
                    ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Cr'}"

                elif ledger_instance.DebitOrCredit == 'Cr' and (Decimal(ledger_instance.OpeningBalance) + Decimal(ledger_obj['Credit'])) <= Decimal(ledger_obj['Debit']):
                    print('444', ledger_obj['LedgerName'], ledger_instance.OpeningBalance)
                    TotalAmo = Decimal(ledger_obj['ledger_Debit']) - (Decimal(ledger_obj['ledger_Credit']) + Decimal(ledger_instance.OpeningBalance))
                    ledger_obj['ClosingBalance'] = f"{TotalAmo} {'Dr'}"

                group_obj['ledgerarr'].append(ledger_obj)





@csrf_exempt
@require_http_methods(['GET'])
def gettrialbalance(request):
    if request.method == 'GET':
        try:
            GroupArray = []

            entry_tables = [
                ContraVoucher_Entry_Table_Detailes,
                PaymentVoucher_Entry_Table_Detailes,
                ReceiptVoucher_Entry_Table_Detailes,
                JournalVoucher_Entry_Table_Detailes,
                SalesVoucher_Entry_Table_Detailes,
                PurchaseVoucher_Entry_Table_Detailes,
                CreditNoteVoucher_Entry_Table_Detailes,
                DebitNoteVoucher_Entry_Table_Detailes,
            ]

            primary_groups = Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Prime')

            if primary_groups.exists():
                for group in primary_groups:
                    group_obj = {
                        'Groupid': group.pk,
                        'GroupName': group.GroupName,
                        'UnderGroupId': group.TypeofGroup,
                        'NatureOfGroupId': group.NatureOfGroup.pk,
                        'UnderGroup': group.NatureOfGroup.NatureOfGroupName,
                        'ledgerarr': [],
                        'TotalDebit': 0,  
                        'TotalCredit': 0, 
                        'OpeningBalanceDr':0,
                        'OpeningBalanceCr':0, 
                        'OpeningBalance':0, 
                        'SubGroup': [],
                    }

                    sub_groups = Finance_GroupMaster_Detailes.objects.filter(TypeofGroup='Sub', ParentGroup=group)
                    for sub_group in sub_groups:
                        sub_group_obj = {
                            'Groupid': sub_group.pk,
                            'GroupName': sub_group.GroupName,
                            'UnderGroupId': sub_group.ParentGroup.pk,
                            'NatureOfGroupId': sub_group.ParentGroup.NatureOfGroup.pk,
                            'UnderGroup': sub_group.ParentGroup.GroupName,
                            'ledgerarr': [],
                            'TotalDebit': 0,
                            'TotalCredit': 0,
                            'OpeningBalanceDr':0,
                            'OpeningBalanceCr':0,
                            'OpeningBalance':0, 


                        }
                        group_obj['SubGroup'].append(sub_group_obj)

                    GroupArray.append(group_obj)

            all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

            for group in GroupArray:
                process_ledgers(group, all_ledgers, entry_tables)

                for subgroup in group['SubGroup']:
                    process_ledgers(subgroup, all_ledgers, entry_tables)
                    group['TotalDebit'] += subgroup['TotalDebit']
                    group['TotalCredit'] += subgroup['TotalCredit']

            Sendarr=[]

            for mainrow in GroupArray:
                filtered_subgroups = []
                ledger_new = []

                
                for subgrow in mainrow['SubGroup']:
                    subrowledger_new = []

                    if subgrow['OpeningBalanceDr'] :
                        mainrow['OpeningBalanceDr'] +=int(subgrow['OpeningBalanceDr'])
                        subgrow['OpeningBalance'] = f"{subgrow['OpeningBalanceDr']} Dr"
                    
                    if subgrow['OpeningBalanceCr'] :
                        mainrow['OpeningBalanceCr'] +=int(subgrow['OpeningBalanceCr'])
                        subgrow['OpeningBalance'] = f"{subgrow['OpeningBalanceCr']} Cr"


                    if mainrow['OpeningBalanceDr'] > mainrow['OpeningBalanceCr'] :
                        Openoutput = mainrow['OpeningBalanceDr'] - mainrow['OpeningBalanceCr'] 
                        if Openoutput != 0 :
                            mainrow['OpeningBalance'] = f"{Openoutput} Dr"
                        else:
                            mainrow['OpeningBalance'] = 0
                    
                    else:
                        Openoutput = mainrow['OpeningBalanceCr'] - mainrow['OpeningBalanceDr']
                        if Openoutput != 0 : 
                            mainrow['OpeningBalance'] = f"{Openoutput} Cr"
                        else:
                            mainrow['OpeningBalance'] = 0                  



                    if subgrow['TotalDebit'] != 0 or subgrow['TotalCredit'] != 0:
                    
                        for subrowledg in subgrow['ledgerarr']:
                            if subrowledg['Debit'] != 0 or subrowledg['Credit'] != 0:
                                subrowledger_new.append(subrowledg)
                        subgrow['ledgerarr'] = subrowledger_new
                        filtered_subgroups.append(subgrow)

                for mainledgrow in mainrow['ledgerarr']:
                    if mainledgrow['Debit'] != 0 or mainledgrow['Credit'] != 0:
                        ledger_new.append(mainledgrow)

                mainrow['ledgerarr'] = ledger_new
                mainrow['SubGroup'] = filtered_subgroups

                if mainrow['TotalDebit'] != 0 or mainrow['TotalCredit'] != 0:
                    Sendarr.append(mainrow)

            
            return JsonResponse(Sendarr, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})




@csrf_exempt
@require_http_methods(['GET'])
def getprofitandloss(request):
    if request.method == 'GET':
        try:
            entry_tables = [
                ContraVoucher_Entry_Table_Detailes,
                PaymentVoucher_Entry_Table_Detailes,
                ReceiptVoucher_Entry_Table_Detailes,
                JournalVoucher_Entry_Table_Detailes,
                SalesVoucher_Entry_Table_Detailes,
                PurchaseVoucher_Entry_Table_Detailes,
                CreditNoteVoucher_Entry_Table_Detailes,
                DebitNoteVoucher_Entry_Table_Detailes,
            ]

            allArr = []

            for grpId in [2, 3]:
                Expgroup = Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=grpId)
                for grouprow in Expgroup:
                    exgroup_obj = {
                        'Groupid': grouprow.pk,
                        'GroupName': grouprow.GroupName,
                        'UnderGroupId': grouprow.TypeofGroup,
                        'NatureOfGroupId': grouprow.NatureOfGroup.pk,
                        'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
                        'ledgerarr': [],
                        'TotalDebit':0,
                        'TotalCredit':0,
                        'OpeningBalanceDr':0,
                        'OpeningBalanceCr':0,
                    }
                    allArr.append(exgroup_obj)

            all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

            for group in allArr:
                process_ledgers(group, all_ledgers, entry_tables)

            ExpenArr = [entry.copy() for entry in allArr if entry['TotalDebit'] > 0]
            IncomeArr = [entry.copy() for entry in allArr if entry['TotalCredit'] > 0]

            TotalDeb = sum(exp['TotalDebit'] for exp in ExpenArr)
            TotalCre = sum(inc['TotalCredit'] for inc in IncomeArr)

            empty_Obj = {
                'Groupid': '',
                'GroupName': '',
                'UnderGroupId': '',
                'NatureOfGroupId': '',
                'UnderGroup': '',
                'ledgerarr': [],
                'TotalDebit': 0,
                'TotalCredit': 0,
            }

            if TotalDeb < TotalCre:
                profitin = TotalCre - TotalDeb
                ExpenArr.append({'Groupid': '', 'GroupName': 'Gross Profit c/o', 'ledgerarr': [], 'TotalDebit': profitin, 'TotalCredit': 0})
                IncomeArr.append(empty_Obj)
            elif TotalDeb > TotalCre:
                lossexp = TotalDeb - TotalCre
                ExpenArr.append(empty_Obj)
                IncomeArr.append({'Groupid': '', 'GroupName': 'Gross loss c/o', 'ledgerarr': [], 'TotalDebit': 0, 'TotalCredit': lossexp})

            # Calculate maxRows, considering ledger entries
            maxRows = max(
                len(ExpenArr) + sum(len(entry['ledgerarr']) for entry in ExpenArr),
                len(IncomeArr) + sum(len(entry['ledgerarr']) for entry in IncomeArr)
            )
            print('maxRows-----', maxRows)

            # Add empty rows to balance ExpenArr and IncomeArr
            while len(ExpenArr) + sum(len(entry['ledgerarr']) for entry in ExpenArr) < maxRows:
                ExpenArr.append(empty_Obj)

            while len(IncomeArr) + sum(len(entry['ledgerarr']) for entry in IncomeArr) < maxRows:
                IncomeArr.append(empty_Obj)

            print('maxRows-----1111', maxRows, '1111', len(ExpenArr), '22222', len(IncomeArr))

            if TotalDeb < TotalCre:
                profitin = TotalCre - TotalDeb
                ExpenArr.extend([
                    {**empty_Obj, 'TotalDebit': TotalDeb + profitin},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Nett Profit', 'TotalDebit': profitin},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Total', 'TotalDebit': profitin}
                ])
                IncomeArr.extend([
                    {**empty_Obj, 'TotalCredit': TotalCre},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Gross Profit b/f', 'TotalCredit': profitin},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Total', 'TotalCredit': profitin}
                ])

            elif TotalDeb > TotalCre:
                lossexp = TotalDeb - TotalCre
                ExpenArr.extend([
                    {**empty_Obj, 'TotalDebit': TotalDeb},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Gross Loss b/f', 'TotalDebit': lossexp},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Total', 'TotalDebit': lossexp}
                ])
                IncomeArr.extend([
                    {**empty_Obj, 'TotalCredit': lossexp + TotalCre},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Nett Loss', 'TotalCredit': lossexp},
                    empty_Obj,
                    {**empty_Obj, 'GroupName': 'Total', 'TotalCredit': lossexp}
                ])

            return JsonResponse({'ExpenArr': ExpenArr, 'IncomeArr': IncomeArr}, safe=False)

        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse({'error': f'An error occurred: {str(e)}'})
        



@csrf_exempt
@require_http_methods(['GET'])
def getbalancesheetreport(request):
    if request.method == 'GET':
        try: 
            AsetArr=[]

            entry_tables = [
                ContraVoucher_Entry_Table_Detailes,
                PaymentVoucher_Entry_Table_Detailes,
                ReceiptVoucher_Entry_Table_Detailes,
                JournalVoucher_Entry_Table_Detailes,
                SalesVoucher_Entry_Table_Detailes,
                PurchaseVoucher_Entry_Table_Detailes,
                CreditNoteVoucher_Entry_Table_Detailes,
                DebitNoteVoucher_Entry_Table_Detailes,
            ]

            Assetgroup=Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=1)

            for grouprow in Assetgroup:
                exgroup_obj = {
                        'Groupid': grouprow.pk,
                        'GroupName': grouprow.GroupName,
                        'UnderGroupId': grouprow.TypeofGroup,
                        'NatureOfGroupId': grouprow.NatureOfGroup.pk,
                        'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
                        'ledgerarr': [],
                        'TotalDebit': 0,  
                        'TotalCredit': 0,
                        'OpeningBalanceDr':0,
                        'OpeningBalanceCr':0,
                        'ClosingBalance':0,
                        'filterrarr': [],

                        
                }
                AsetArr.append(exgroup_obj)
            
            all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

            for group in AsetArr:
                process_ledgers(group, all_ledgers, entry_tables)
            newAsetArr=[]
            for mainrow in AsetArr:
                for subgrow in mainrow['ledgerarr']:
                    value, side = subgrow['ClosingBalance'].split()
                    if float(value) != 0 :
                        # print('vvv-111',mainrow['GroupName'],subgrow['LedgerName'],value,type(value))
                        amount = float(value)
                        subgrow['ClosingBalance'] = amount
                        mainrow['ClosingBalance'] +=amount
                        mainrow['filterrarr'].append(subgrow)

                if mainrow['ClosingBalance'] != 0 :
                        newAsetArr.append(mainrow)



            liabilityArr=[]
            liabilitygroup=Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=4)

            for grouprow in liabilitygroup:
                libgroup_obj = {
                        'Groupid': grouprow.pk,
                        'GroupName': grouprow.GroupName,
                        'UnderGroupId': grouprow.TypeofGroup,
                        'NatureOfGroupId': grouprow.NatureOfGroup.pk,
                        'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
                        'ledgerarr': [],
                        'TotalDebit': 0,  
                        'TotalCredit': 0,
                        'OpeningBalanceDr':0,
                        'OpeningBalanceCr':0,
                        'ClosingBalance':0,
                        'filterrarr': [],

                }
                liabilityArr.append(libgroup_obj)

            for group1 in liabilityArr:
                process_ledgers(group1, all_ledgers, entry_tables)  
            
            newliabilityArr=[]

            for mainrow in liabilityArr:
                for subgrow in mainrow['ledgerarr']:
                    value, side = subgrow['ClosingBalance'].split()
                    if float(value) !=0:  
                        # print('vvv-222',mainrow['GroupName'],subgrow['LedgerName'],value,type(value))
                        amount = float(value)
                        subgrow['ClosingBalance'] = amount
                        mainrow['ClosingBalance'] +=amount
                        mainrow['filterrarr'].append(subgrow)

                if mainrow['ClosingBalance'] != 0 :
                    newliabilityArr.append(mainrow)



            allArr = []
            for grpId in [2, 3]:
                Expgroup = Finance_GroupMaster_Detailes.objects.filter(NatureOfGroup__pk=grpId)
                for grouprow in Expgroup:
                    exgroup_obj = {
                        'Groupid': grouprow.pk,
                        'GroupName': grouprow.GroupName,
                        'UnderGroupId': grouprow.TypeofGroup,
                        'NatureOfGroupId': grouprow.NatureOfGroup.pk,
                        'UnderGroup': grouprow.NatureOfGroup.NatureOfGroupName,
                        'ledgerarr': [],
                        'TotalDebit':0,
                        'TotalCredit':0,
                        'OpeningBalanceDr':0,
                        'OpeningBalanceCr':0,
                    }
                    allArr.append(exgroup_obj)

            all_ledgers = AllLedgers_Mapping_Detailes.objects.all()

            for group in allArr:
                process_ledgers(group, all_ledgers, entry_tables)

            ExpenArr = [entry.copy() for entry in allArr if entry['TotalDebit'] > 0]
            IncomeArr = [entry.copy() for entry in allArr if entry['TotalCredit'] > 0]

            TotalDeb = sum(exp['TotalDebit'] for exp in ExpenArr)
            TotalCre = sum(inc['TotalCredit'] for inc in IncomeArr)


            
            empty_Obj = {
                        'Groupid':'',
                        'GroupName':'',
                        'UnderGroupId':'',
                        'NatureOfGroupId':'',
                        'UnderGroup':'',
                        'ledgerarr': [],
                        'TotalDebit': 0,  
                        'TotalCredit': 0,
                        'OpeningBalanceDr':0,
                        'OpeningBalanceCr':0,
                        'ClosingBalance':0,
                        'filterrarr': [],
                        }
        
            
            liabilityArr_total_closing_balance=0
            newAsetArr_total_closing_balance=0

            for item in newliabilityArr:
                liabilityArr_total_closing_balance += item.get('ClosingBalance', 0)
                
            for item in newAsetArr:
                newAsetArr_total_closing_balance += item.get('ClosingBalance', 0)


            if TotalDeb < TotalCre:
                profitin = TotalCre - TotalDeb
                newliabilityArr.append({'Groupid': '', 'GroupName': 'Net Profit c/o', 'ledgerarr': [],'TotalDebit': 0,'TotalCredit': 0,'ClosingBalance': profitin, 'filterrarr': []})
                liabilityArr_total_closing_balance+=profitin


            elif TotalDeb > TotalCre:
                lossexp = TotalDeb - TotalCre
                newliabilityArr.append({'Groupid': '', 'GroupName': 'Net loss c/o', 'ledgerarr': [],'TotalDebit': 0,'TotalCredit': 0, 'ClosingBalance': lossexp,'filterrarr': []})
                liabilityArr_total_closing_balance-=lossexp
            
            maxRows = max(
                len(newliabilityArr) + sum(len(entry['filterrarr']) for entry in newliabilityArr),
                len(newAsetArr) + sum(len(entry['filterrarr']) for entry in newAsetArr)
            )
            while len(newliabilityArr) + sum(len(entry['filterrarr']) for entry in newliabilityArr) < maxRows:
                newliabilityArr.append(empty_Obj)

            while len(newAsetArr) + sum(len(entry['filterrarr']) for entry in newAsetArr) < maxRows:
                newAsetArr.append(empty_Obj)

            return JsonResponse ({'liabilityArr':newliabilityArr,'AsetArr':newAsetArr,'Totalamount_lib':liabilityArr_total_closing_balance,'Totalamount_Ass':newAsetArr_total_closing_balance},safe=False)
        
        except Exception as e:
            print(f'An error occurred: {str(e)}')
            return JsonResponse ({'error':f'An error occurred:{str(e)}'})






