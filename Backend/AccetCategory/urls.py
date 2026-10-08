from django.urls import path
from .AssetCategories import *
from .AssetSubCategorieManagement import *
from .Suppliers import *
from .ServiceProviderMangement import *
from .ChecklistManagement import *
from .ChecklistMasterEntry import *
from .AssetManagement import *
from .AssetDocumentsupload import *
from .AssetAMC_CMC import *
from .Maintenance import *
from .BreakageForm import *
from .AssetBackend import *


 
urlpatterns = [
    path('asset_categories/', asset_categories, name='asset_categories'),
    path('update_asset_category/<int:category_id>/', update_asset_category, name='update_asset_category'),
    path('get_asset_category/<int:category_id>/', get_asset_category, name='get_asset_category'),
    path('asset_categories_list/', asset_categories_list, name='asset_categories_list'),
    path('delete_Category/<int:id>',delete_Category,name='delete_Category'),
   
    # -----------------------------sub Categories-------------------------------
    path('asset_subcategories/',asset_subcategories,name='asset_subcategories'),
    path('get_asset_subcategories/',get_asset_subcategories,name='get_asset_subcategories'),
    path('update_asset_subcategory/<int:subcategory_id>/',update_asset_subcategory,name='update_asset_subcategory'),
    path('delete_AssetSubCategory/<int:id>',delete_AssetSubCategory,name='delete_AssetSubCategory'),

 
    # -----------------------------suppliers Data-------------------------------
    path('suppliers_Data/',suppliers_Data,name='suppliers_Data'),
    path('suppliers_Data_Get/',suppliers_Data_Get,name='suppliers_Data_Get'),
    path('suppliers_Data_Put/<int:supplier_id>/',suppliers_Data_Put,name='suppliers_Data_Put'),
    path('delete_Supplier/<int:id>',delete_Supplier,name='delete_Supplier'),

    
    # --------------------------ServiceProviderManagement_POST--------------------------------
    path('ServiceProviderManagement_POST/',ServiceProviderManagement_POST,name='ServiceProviderManagement_POST'),
    path('ServiceProviderManagement_GET/',ServiceProviderManagement_GET,name='ServiceProviderManagement_GET'),
    path('ServiceProviderManagement_PUT/<int:ServiceProviderManagement_id>/',ServiceProviderManagement_PUT,name='ServiceProviderManagement_PUT'),
    path('delete_Provider/<int:id>', delete_Provider, name='delete_Provider'),

    # --------------------------------------ChecklistManagement-------------------------------------
    path('ChecklistManagement_post/',ChecklistManagement_post,name='ChecklistManagement_post'),
    path('ChecklistManagement_get/',ChecklistManagement_get,name='ChecklistManagement_get'),
    path('ChecklistManagement_Put/',ChecklistManagement_Put,name='ChecklistManagement_Put'),
    
    # ---------------------------------ChecklistMasterEntry--------------------------------------
    path('ChecklistMasterEntry_post/',ChecklistMasterEntry_post,name='ChecklistMasterEntry_post'),
    path('ChecklistMasterEntry_get/',ChecklistMasterEntry_get,name='ChecklistMasterEntry_get'),
    path('ChecklistMasterEntry_Put/<int:entry_id>/',ChecklistMasterEntry_Put,name='ChecklistMasterEntry_Put'),
    # ------------------------------------AssetReg------------------------------------------------
    path('Asset_Reg_post/',Asset_Reg_post,name='Asset_Reg_post'),
    path('Asset_Reg_Get/',Asset_Reg_Get,name='Asset_Reg_Get'),
    path('Asset_Reg_put/<int:asset_id>/', Asset_Reg_put, name='Asset_Reg_put'),
    path('delete_AssetManegment/<int:id>',delete_AssetManegment,name='delete_AssetManegment'),

    # ---------------------------------------------assetList---------------------------------------------------
    path('assetList_Get/',assetList_Get,name='assetList_Get'),
    path('assetList_PUT/<int:asset_id>',assetList_PUT,name='assetList_PUT'),
    # ---------------------------------------------AssetDocumentsupload-----------------------------------------------
    path('assetdocumentsuploadpost',assetdocumentsuploadpost,name="assetdocumentsuploadpost"),
    path('assetdocumentsuploadget',assetdocumentsuploadget,name='assetdocumentsuploadget'),
    path('get_file_data', get_file_data, name='get_file_data'),

     # ---------------------------------------------AssetAMC-----------------------------------------------
    path('AMC_CMC_POST',AMC_CMC_POST,name="AMC_CMC_POST"),
    path('AMC_CMC_GET',AMC_CMC_GET,name='AMC_CMC_GET'),
    path('AMC_CMC_PUT/<int:amc_id>',AMC_CMC_PUT,name='AMC_CMC_PUT'),
    path('delete_amc_cmc/<int:id>', delete_amc_cmc, name='delete_amc_cmc'),
    path('AMC_CMC_INS_get/<int:id>',AMC_CMC_INS_get,name='AMC_CMC_INS_get'),
    path('delete_AMC/<int:id>',delete_AMC,name='delete_AMC'),

    # ------------------------------------------Maintenance------------------------------------------------------
    path('submit_maintenance',submit_maintenance,name='submit_maintenance'),
    path('get_maintenance_list',get_maintenance_list,name='get_maintenance_list'),
    path('delete_maintenance/<int:id>',delete_maintenance,name='delete_maintenance'),
    path('Post_Maintenance_ChecklistData', Post_Maintenance_ChecklistData, name='Post_Maintenance_ChecklistData'), 
    path("Get_Maintenance_Log_Summary/<int:asset_id>",Get_Maintenance_Log_Summary,name='Get_Maintenance_Log_Summary'),   
    path('get_technicians',get_technicians,name='get_technicians'),
    path('get_all_maintenance_list',get_all_maintenance_list,name='get_all_maintenance_list'),
    path('Get_Asset_Details_By_Id/<int:asset_id>',Get_Asset_Details_By_Id,name='Get_Asset_Details_By_Id'),

    # ------------------------------------------Breakage Form------------------------------------------------------
    path('breakage_report_create',breakage_report_create,name='breakage_report_create'),
    path('breakage_report_list',breakage_report_list,name='breakage_report_list'),
    path('breakage_report_update/<int:id>',breakage_report_update,name='breakage_report_update'),
    path('get_department_users',get_department_users,name='get_department_users'),
    path('repair_fixd_create',repair_fixd_create,name='repair_fixd_create'),
    path('get_repair_fixd_records',get_repair_fixd_records,name='get_repair_fixd_records'),
    path('repair_fixd_update/<int:record_id>',repair_fixd_update,name='repair_fixd_update'),
    path('increment_visit_frequency',increment_visit_frequency,name='increment_visit_frequency'),
    path('get_visit_frequency_counts',get_visit_frequency_counts,name='get_visit_frequency_counts'),
    path('post_Update_Status',post_Update_Status,name='post_Update_Status'),
    path('get_Update_Status/<int:id>',get_Update_Status,name='get_Update_Status'),
    
    # ------------------------------AssetMovementPage------------------------------------------------
    path('asset_movement_list',asset_movement_list,name='asset_movement_list'),
    path('asset_outside_movement_list',asset_outside_movement_list,name='asset_outside_movement_list'),
    path('delete_asset_outside_movement/<int:id>',delete_asset_outside_movement,name='delete_asset_outside_movement'),
    path('Asset_insurance_registration_list',Asset_insurance_registration_list,name='Asset_insurance_registration_list'),
    
    # ------------------------------------Asset Scrap---------------------------------------------------
    path('scrap_asset_list',scrap_asset_list,name='scrap_asset_list'),
    path('delete_scrap_asset/<int:id>',delete_scrap_asset,name='delete_scrap_asset'),
    
    path('asset_disposal_list',asset_disposal_list,name='asset_disposal_list'),
    path('delete_asset_disposal/<int:id>',delete_asset_disposal,name='delete_asset_disposal'),
]
