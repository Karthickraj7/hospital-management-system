from django.urls import path
# from .Lenin import *
from .Mrd import *


urlpatterns = [

            path('Mrd_Scanner',Mrd_Scanner, name='Mrd_Scanner'),
            path('MRD_Rack_Detials_link',MRD_Rack_Detials_link,name='MRD_Rack_Detials_link'),
            path('MRD_Shelf_Detials_link',MRD_Shelf_Detials_link,name='MRD_Shelf_Detials_link'),
            path('MRD_File_Detials_link',MRD_File_Detials_link,name='MRD_File_Detials_link'),
            path('get_file_patient_details',get_file_patient_details,name='get_file_patient_details'),
            path('get_all_patients_list',get_all_patients_list,name='get_all_patients_list'),
            path('MedicalCodingReport',MedicalCodingReport,name='MedicalCodingReport'),
            path('Change_Mrd_MCI_Test',Change_Mrd_MCI_Test,name='Change_Mrd_MCI_Test'),
            path('Change_Mrd_MCI_Lab_Test',Change_Mrd_MCI_Lab_Test,name='Change_Mrd_MCI_Lab_Test'),
            path('Add_Manual_Mrd_Lab',Add_Manual_Mrd_Lab,name='Add_Manual_Mrd_Lab'),
 

            
]