
from django.urls import path


from .views import *
from .TrayMaster import *
from .IndentProduct import*
from .IndentTray import*
urlpatterns=[
   path('create_tray_sterilize',create_tray_sterlize,name='create'),
   path('selectcategory',select_category,name="category"),
   path('selectproduct',select_product,name="product"),
   path('createtraymaster',create_tray_master,name='tray master'),
   path('createproductmaster',create_product_master,name='tray master update'),
   path('getproducts',view_product_master,name='viwe products'),
   path('getstorelocation',get_store_details,name='get Store'),
   path('getrequest',get_Indent_Request,name='get'),
   path('indentTray',indent_tray,name='indentTray'),
   path('indentRecive',indent_recive,name='indentRecive'),
]
