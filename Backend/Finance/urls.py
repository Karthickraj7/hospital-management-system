from django.urls import path
from .FinanceMaster import *
from .PettyCash import *


urlpatterns = [
    path('Get_Finance_PrimeGroupMasters',Get_Finance_PrimeGroupMasters,name='Get_Finance_PrimeGroupMasters'),
    path('Get_NatureOfGroupMaster_detailes',Get_NatureOfGroupMaster_detailes,name='Get_NatureOfGroupMaster_detailes'),
    path('Postdata_GroupMasters',Postdata_GroupMasters,name='Postdata_GroupMasters'),
    path('postledgermasterdata',postledgermasterdata,name='postledgermasterdata'),
    path('allgrouplistmasterget',allgrouplistmasterget,name='allgrouplistmasterget'),   
    path('getassetledgerforvouchersbytype',getassetledgerforvouchersbytype,name='getassetledgerforvouchersbytype'),
    path('postvoucherdataallvouchers',postvoucherdataallvouchers,name='postvoucherdataallvouchers'),
    path('postvoucherdataSecondfourvouchers',postvoucherdataSecondfourvouchers,name='postvoucherdataSecondfourvouchers'),
    path('get_ledger_report_list',get_ledger_report_list,name='get_ledger_report_list'),
    path('getsingleledgeralldata',getsingleledgeralldata,name='getsingleledgeralldata'),
    path('getsinglevoucherbyinvoicenumber',getsinglevoucherbyinvoicenumber,name='getsinglevoucherbyinvoicenumber'),
    path('getdaybookforallvouchers',getdaybookforallvouchers,name='getdaybookforallvouchers'),
    path('getcashbookforallvouchers',getcashbookforallvouchers,name='getcashbookforallvouchers'),
    path('gettrialbalance',gettrialbalance,name='gettrialbalance'),
    path('getprofitandloss',getprofitandloss,name='getprofitandloss'),
    path('getbalancesheetreport',getbalancesheetreport,name='getbalancesheetreport'),
    
    path('postdataforpettycash',postdataforpettycash,name='postdataforpettycash'),
    path('postdataforDayclosing',postdataforDayclosing,name='postdataforDayclosing'),
    path('postdataforShiftclosing',postdataforShiftclosing,name='postdataforShiftclosing'),
 
]

