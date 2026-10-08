from django.urls import path
# from .Lenin import *
from .Reports import *
from .FinancialReport import *

urlpatterns = [
    path('MisCasePaper_Detials_link',MisCasePaper_Detials_link,name='MisCasePaper_Detials_link'),
    path('MisAncCard_Detials_link',MisAncCard_Detials_link,name='MisAncCard_Detials_link'),

    path('user_details_for_report',user_details_for_report,name='user_details_for_report'),
    path('User_wise_Collection_Report',User_wise_Collection_Report,name='User_wise_Collection_Report'),


        path('Insurance_Report_Details',Insurance_Report_Details,name='Insurance_Report_Details'),
    path('Client_Report_Details',Client_Report_Details,name='Client_Report_Details'),
    # path('User_wise_Collection_Report',User_wise_Collection_Report,name='User_wise_Collection_Report'),
    # path('User_wise_Collection_Report',User_wise_Collection_Report,name='User_wise_Collection_Report'),
    # path('User_wise_Collection_Report',User_wise_Collection_Report,name='User_wise_Collection_Report'),
    # path('User_wise_Collection_Report',User_wise_Collection_Report,name='User_wise_Collection_Report'),

    
    
]
