# from django.urls import path
# from .Lenin import *

# urlpatterns = [
#     path('LeninMaster_Detials_link/', LeninMaster_Detials_link,name="LeninMaster_Detials_link"),
#     path('Lenin_MinMax_Master_Detials_link/', Lenin_MinMax_Master_Detials_link,name="Lenin_MinMax_Master_Detials_link"),
#     path('Lenin_Stock_Detials_link/', Lenin_Stock_Detials_link,name="Lenin_Stock_Detials_link"),
#     path('Lenin_Catg_Master_Detials_link/', Lenin_Catg_Master_Detials_link,name="Lenin_Catg_Master_Detials_link"),
#     path('Linen_Issue_Details_Link/', Linen_Issue_Details_Link,name="Linen_Issue_Details_Link"),

#     # ✅ THIS IS THE IMPORTANT FIX
#     path(
#         'Lenin_Laundry_Vendor_Details_Link/',
#         Lenin_Laundry_Vendor_Details_Link,
#         name='Lenin_Laundry_Vendor_Details_Link'
#     ),
# ]

from django.urls import path 
from .Lenin import * 
urlpatterns = [  
path('LeninMaster_Detials_link',LeninMaster_Detials_link,name='LeninMaster_Detials_link'), 
path('Lenin_MinMax_Master_Detials_link',Lenin_MinMax_Master_Detials_link,name='Lenin_MinMax_Master_Detials_link'),
path('Lenin_Stock_Detials_link',Lenin_Stock_Detials_link,name='Lenin_Stock_Detials_link'), 
path('Lenin_Catg_Master_Detials_link',Lenin_Catg_Master_Detials_link,name='Lenin_Catg_Master_Detials_link'), 
path("Linen_Issue_Details_Link", Linen_Issue_Details_Link, name="Linen_Issue_Details_Link"), 
path('Laundry_Details_Link', Laundry_Details_Link, name='Laundry_Details_Link'),
path("QC_Details_link",QC_Details_link,name="QC_Details_link"),
path('laundryVendorMasterdetails', laundryVendorMasterdetails, name='laundryVendorMasterdetails'),

path('LeninMaster_Detials_link_by_id',LeninMaster_Detials_link_by_id,name='LeninMaster_Detials_link_by_id')
 
 
]