import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q
from django.db import transaction
from .models import (
    GRN_Product_Item_Detials,
    UnitOfMeasurement,
    SubCategory_Detailes,
    Product_Master_All_Category_Details,
    ProductMaster_Drug_Segment_Details,
    Product_Category_Product_Details,
    Stock_Maintance_Table_Detials,
    StockAdjustment_Item_Details
    
)
from Masters.models import(
    Product_Group_Master_Details,
    Pack_Type_Master_Details,
    ProductType_Master_Details,
    GenericName_Master_Details,
    CompanyName_mfg_Master_Details,
    Doctor_Personal_Form_Detials,
    Inventory_Location_Master_Detials,
    NurseStationMaster,
    Tray_management_Details
    
   
)
from django.db.models import Func
import pandas as pd
from django.db import transaction
from django.db.models.functions import Lower, Replace, Cast
from django.db.models import IntegerField, CharField, Value

 # reorder_level = stock_item.Product_Detials.ReorderLevel or 0


@csrf_exempt
def All_Product_Files_Upload(request):
    try:
        file = request.Files.get("file")
        created_by = request.POST.get("created_by")
        print("created_by",created_by)
        pack_type_instance=None
        if file.name.endswith(".csv"):
            df = pd.read_csv(file)
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse(
                {
                    "error": "'Unsupported file format. Please upload a CSV or Excel file'"
                }
            )         
        
        csv_data = df.to_dict(orient="records")
        def clean_number(value, as_type=int):
            try:
                if str(value).strip().lower() in ["nan", "null", "none", ""]:
                    return 0
                return as_type(value)
            except (ValueError, TypeError):
                return None

        def clean_string(value):
            if value is None:
                return None
            value = str(value).strip()
            return None if value.lower() in ["nan", "null", "none", ""] else value


        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            """
            Helper function to get or create a foreign key instance.
            Args:
                model: Django model to query.
                filters: Dictionary of fields to filter.
                defaults: Dictionary of fields for creating an object if not found.
                return_existing_code: Whether to return the existing instance's code if found.
            Returns:
                Instance of the model or existing code if specified.
            """
            print('model :', model)
            print('filters :', filters)
            print('defaults :', defaults)
            filter_conditions = {}
            for key, value in filters.items():
                if value:  # Only add to filter_conditions if value is not empty
                    filter_conditions[key] = value

            print('filter_conditions :', filter_conditions)
            instance = model.objects.filter(**filter_conditions).first()
            print('instance :', instance)
            if instance is not None and any(getattr(instance, field, None) for field in ['Department_Name', 'SubDepartment_Name', 'Container_Name','Method_Name','Specimen_Name','Unit_Name']):  # Replace with your relevant fields

                if hasattr(instance, 'SubCategory_Id'):
                    return instance.SubCategory_Id
                elif hasattr(instance, 'GenericName_Id'):
                    return instance.GenericName_Id
                elif hasattr(instance, 'CompanyName_Id'):
                    return instance.CompanyName_Id
                elif hasattr(instance, 'ProductType_Id'):
                    return instance.ProductType_Id
                elif hasattr(instance, 'ProductGroup_Id'):
                    return instance.ProductGroup_Id
                elif hasattr(instance, 'Unit_Id'):
                    return instance.Unit_Id
                elif hasattr(instance, 'PackType_Id'):
                    return instance.PackType_Id
                elif hasattr(instance, 'pk'):
                    return instance.pk
                
                print('Existing instance :', instance)
                return instance  # Return instance if no code attribute found

            else:
                print('hai')
                # Create a new instance
                instance = model.objects.create(**{**filters, **defaults})
                print('new instance :', instance)

                if hasattr(instance, 'SubCategory_Id'):
                    return instance.SubCategory_Id
                elif hasattr(instance, 'GenericName_Id'):
                    return instance.GenericName_Id
                elif hasattr(instance, 'CompanyName_Id'):
                    return instance.CompanyName_Id
                elif hasattr(instance, 'ProductType_Id'):
                    return instance.ProductType_Id
                elif hasattr(instance, 'ProductGroup_Id'):
                    return instance.ProductGroup_Id
                elif hasattr(instance, 'Unit_Id'):
                    return instance.Unit_Id
                elif hasattr(instance, 'PackType_Id'):
                    return instance.PackType_Id
                elif hasattr(instance, 'pk'):
                    return instance.pk

                return instance     

        for row in csv_data:
            print("row", row)
            productcategory = None
            if row["ProductCategory"] != '' and row["ProductCategory"] is not None:
                productcategory = get_or_create_foreign_key(
                    Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                
                )
            print("product:", productcategory)

            
            sub_category = None

            if row["SubCategory"] != '' and row["SubCategory"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                
                sub_category = get_or_create_foreign_key(
                    SubCategory_Detailes,
                    filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
            
            generic_name = None

            if row["GenericName"] != '' and row["GenericName"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                
                generic_name = get_or_create_foreign_key(
                    GenericName_Master_Details,
                    filters={"GenericName": row["GenericName"], "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                    defaults={"Status":True, "Create_by": created_by},
                    return_existing_code=True
                )
                genericname_instance = GenericName_Master_Details.objects.get(GenericName_Id=generic_name)
            
            manufacturer_name = None

            if row["CompanyName"] != '' and row["CompanyName"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)

                manufacturer_name = get_or_create_foreign_key(
                    CompanyName_mfg_Master_Details,
                    filters={"CompanyName": row["CompanyName"], "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                    defaults={"Status":True, "Create_by": created_by},
                    return_existing_code=True
                )
                manufacturer_name_instance = CompanyName_mfg_Master_Details.objects.get(CompanyName_Id=manufacturer_name)
            
            product_Type = None

            if row["ProductType"] != '' and row["ProductType"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                product_Type = get_or_create_foreign_key(
                    ProductType_Master_Details,
                    filters={"ProductType_Name": row["ProductType"], "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                    defaults={"Status":True, "Create_by": created_by},
                    return_existing_code=True
                )
                product_Type_instance = ProductType_Master_Details.objects.get(ProductType_Id=product_Type)

            product_group = None

            if row["ProductGroup"] != '' and row["ProductGroup"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                product_group = get_or_create_foreign_key(
                    Product_Group_Master_Details,
                    filters={"ProductGroup_Name": row["ProductGroup"], "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                    defaults={"Status":True, "Create_by": created_by},
                    return_existing_code=True
                )
                product_group_instance = Product_Group_Master_Details.objects.get(ProductGroup_Id=product_group)
            
            pack_type = None

            if row["PackType"] != '' and row["PackType"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                pack_type = get_or_create_foreign_key(
                    Pack_Type_Master_Details,
                    filters={"PackType_Name": row["PackType"], "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                    defaults={"Status":True, "Create_by": created_by},
                    return_existing_code=True
                )
                pack_type_instance = Pack_Type_Master_Details.objects.get(PackType_Id=pack_type)
            def clean_int_value(value):
                if str(value).strip().lower() in ["nan", "null", "none", ""]:
                    return None
                return int(value)
            ItemName = row["ItemName"]
            HSNCode = clean_string(row.get("HSNCode"))
            Strength = clean_number(row.get("Strength"), float)
            # HSNCode = row["HSNCode"]
            # Strength = row["Strength"]
            # StrengthType = row["StrengthType"]
            StrengthType = clean_string(row.get("StrengthType")).lower() if clean_string(row.get("StrengthType")) else None
            # PackQty = row["PackQty"]
            PackQty = clean_number(row.get("PackQty"))
            # MinimumQty = clean_int_value(row["MinimumQty"])
            # MaximumQty = clean_int_value(row["MaximumQty"])
            # ReorderLevel = clean_int_value(row["ReorderLevel"])
            MinimumQty = clean_number(row.get("MinimumQty"))
            MaximumQty = clean_number(row.get("MaximumQty"))
            ReorderLevel = clean_number(row.get("ReorderLevel"))
            print('MaximumQty-----',MaximumQty)
            # ReorderLevel = row["ReorderLevel"]
            # IsReUsable = row["IsReUsable"]
            IsReUsable = clean_string(row.get("IsReUsable"))
            # ReUsableTimes = row["ReUsableTimes"]
            ReUsableTimes = clean_number(row.get("ReUsableTimes"))
            # IsSellable = row["IsSellable"]
            IsSellable = clean_string(row.get("IsSellable"))
            # LeastSellableUnit = row["LeastSellableUnit"]
            LeastSellableUnit = clean_number(row.get("LeastSellableUnit"), float)
            # Selling_Price_Without_Tax = row["Selling_Price_Without_Tax"]
            Selling_Price_Without_Tax = clean_number(row.get("Selling_Price_Without_Tax"), float)
            # IsPartialUse = row["IsPartialUse"]
            IsPartialUse = clean_string(row.get("IsPartialUse"))
            # IsPerishable = row["IsPerishable"]
            IsPerishable = clean_string(row.get("IsPerishable"))
            PerishableDuration = row["PerishableDuration"]
            PerishableDurationType = row["PerishableDurationType"]
            Department = row["Department"]
            Doctorname = row["Doctorname"]
            # Is_Manufacture_Date_Available = row["Is_Manufacture_Date_Available"]
            # Is_Expiry_Date_Available = row["Is_Expiry_Date_Available"]
            # Is_Serial_No_Available_for_each_quantity = row["Is_Serial_No_Available_for_each_quantity"]
            # ProductDescription = row["ProductDescription"]
            # Status = True
            # PerishableDuration = clean_number(row.get("PerishableDuration"))
            # PerishableDurationType = clean_string(row.get("PerishableDurationType"))
            Is_Manufacture_Date_Available = clean_string(row.get("Is_Manufacture_Date_Available"))
            Is_Expiry_Date_Available = clean_string(row.get("Is_Expiry_Date_Available"))
            Is_Serial_No_Available_for_each_quantity = clean_string(row.get("Is_Serial_No_Available_for_each_quantity"))
            ProductDescription = clean_string(row.get("ProductDescription"))
            Status = True
        
            with transaction.atomic():
    # Check if a product with the same ItemName already exists
                existing_item = Product_Master_All_Category_Details.objects.filter(
                    ItemName=ItemName
                ).first()

                if not existing_item:
                    # Create new product
                    item_description = Product_Master_All_Category_Details.objects.create(
                        ItemName=ItemName,
                        ProductCategory=productcategory_instance,
                        SubCategory=sub_productcategory_instance,
                        GenericName=genericname_instance,
                        CompanyName=manufacturer_name_instance,
                        HSNCode=HSNCode,
                        ProductType=product_Type_instance,
                        ProductGroup=product_group_instance,
                        Strength=Strength,
                        StrengthType=StrengthType,
                        PackType=pack_type_instance,
                        PackQty=PackQty,
                        MinimumQty=MinimumQty,
                        MaximumQty=MaximumQty,
                        ReorderLevel=ReorderLevel,
                        IsReUsable=IsReUsable,
                        ReUsableTimes=ReUsableTimes,
                        IsSellable=IsSellable,
                        LeastSellableUnit=LeastSellableUnit,
                        Selling_Price_Without_Tax=Selling_Price_Without_Tax,
                        IsPartialUse=IsPartialUse,
                        IsPerishable=IsPerishable,
                        PerishableDuration=PerishableDuration,
                        PerishableDurationType=PerishableDurationType,
                        Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                        Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                        Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                        ProductDescription=ProductDescription,
                        Status=Status,
                        created_by=created_by,
                        Department=Department,
                        Doctorname=Doctorname
                    )
                    message = f"Item '{ItemName}' added successfully."
                else:
                    message = f"Item '{ItemName}' already exists. Skipped."


        return JsonResponse({"success":True,"message": message}, status=200)

 
    except Exception as e:
        return JsonResponse({'warn': 'An internal server error occurred'}, status=500)


# @csrf_exempt
# @require_http_methods(["POST", "OPTIONS","GET"])
# def product_master_Detials_link(request):
    
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             print("data---------",data)
#             Item_Code = data.get("Item_Code")
#             Item_Name = data.get("Item_Name")
#             normalized_name = Item_Name.replace(" ", "").lower()
#             Product_Category = data.get("Product_Category")
#             Sub_Category = data.get("Sub_Category")
#             Generic_Name = data.get("Generic_Name")
#             Manufacturer_Name = data.get("Manufacturer_Name")
#             HSN_Code = data.get("HSN_Code")
#             Product_Type = data.get("Product_Type")
#             Product_Group = data.get("Product_Group")
#             Strength = data.get("Strength")
#             Strength_Type = data.get("Strength_Type")
#             Volume = data.get("Volume")
#             Volume_Type = data.get("Volume_Type")
#             Pack_Type = data.get("Pack_Type")
#             Pack_Quantity = data.get("Pack_Quantity")
#             Minimum_Quantity = data.get("Minimum_Quantity")
#             Maximum_Quantity = data.get("Maximum_Quantity")
#             Re_order_Level = data.get("Re_order_Level")
#             Is_Reusable = data.get("Is_Reusable")=='Yes'
#             Re_Usable_Times = data.get("Re_Usable_Times")
#             Is_Sellable = data.get("Is_Sellable")=='Yes'
#             Least_Sellable_Unit = data.get("Least_Sellable_Unit")
#             Is_Partial_Use = data.get("Is_Partial_Use")=='Yes'
#             Is_Perishable = data.get("Is_Perishable")=='Yes'
#             Perishable_Duration = data.get("Perishable_Duration")
#             Perishable_Duration_Type = data.get("Perishable_Duration_Type")
#             Is_Manufacture_Date_Available = data.get("Is_Manufacture_Date_Available") =='Yes'
#             Is_Expiry_Date_Available = data.get("Is_Expiry_Date_Available")=='Yes'
#             Is_Serial_No_Available_for_each_quantity = data.get("Is_Serial_No_Available_for_each_quantity")=='Yes'
#             Drug_Segment = data.get("Drug_Segment")
#             print('Drug_Segment---',Drug_Segment)
#             Product_Description = data.get("Product_Description")
#             Created_by = data.get("Created_by")
#             Department = data.get('Department')
#             Doctorname = data.get('Doctorname')
            
            
#             Product_Category_instance = None
            
#             Sub_Category_instance = None
#             Generic_instance = None
#             Manufacturer_instance = None
#             Product_Type_instance = None
#             Product_Group_instance = None
#             Volume_Type_instance = None
#             Pack_Type_instance = None
#             field_instances = None
            
            
#             if Product_Category:
#                 Product_Category_instance =Product_Category_Product_Details.objects.get(pk = int(Product_Category))
            
#             if Sub_Category:
#                 Sub_Category_instance =SubCategory_Detailes.objects.get(pk = int(Sub_Category))
            
#             if Generic_Name:
#                 Generic_instance =GenericName_Master_Details.objects.get(pk = int(Generic_Name))
            
#             if Manufacturer_Name:
#                 Manufacturer_instance =CompanyName_mfg_Master_Details.objects.get(pk = int(Manufacturer_Name))
            
#             if Product_Type:
#                 Product_Type_instance =ProductType_Master_Details.objects.get(pk = int(Product_Type))
            
#             if Product_Group:
#                 Product_Group_instance =Product_Group_Master_Details.objects.get(pk = int(Product_Group))
            
#             if Volume_Type:
#                 Volume_Type_instance =UnitOfMeasurement.objects.get(pk = int(Volume_Type))
            
#             if Pack_Type:
#                 Pack_Type_instance =Pack_Type_Master_Details.objects.get(pk = int(Pack_Type))
            
#             DrugSegment_instances=None
#             if Drug_Segment in [None, "null", ""]:
#                 print('-----------------')
#                 DrugSegment_instances=None
    
#             elif Drug_Segment:
#                 print('11111-Drug_Segment',Drug_Segment)                   
#                 DrugSegment_instances = ProductMaster_Drug_Segment_Details.objects.get(pk=Drug_Segment)
#             print('900000000000000')
#             if Item_Code:
#                 print('updata')
#                 existing_Product = Product_Master_All_Category_Details.objects.annotate(
#                         normalized_name=Func(
#                             'ItemName',
#                             function='LOWER',
#                             template="REPLACE(%(expressions)s, ' ', '')"
#                         )
#                     ).filter(normalized_name=normalized_name).exclude(pk=Item_Code)
#                 print('9999999999-------------')
#                 # if existing_Product.exists():
#                 #     print('76777777777777')
#                 #     return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})
                
#                 Product_instance = Product_Master_All_Category_Details.objects.get(pk = Item_Code)
#                 Product_instance.ItemName =Item_Name
#                 Product_instance.ProductCategory =Product_Category_instance
#                 Product_instance.SubCategory =Sub_Category_instance
#                 Product_instance.GenericName =Generic_instance
#                 Product_instance.CompanyName =Manufacturer_instance
#                 Product_instance.HSNCode =HSN_Code
#                 Product_instance.ProductType =Product_Type_instance
#                 Product_instance.ProductGroup =Product_Group_instance
#                 Product_instance.Strength =Strength
#                 Product_instance.StrengthType =Strength_Type
#                 Product_instance.Volume =Volume
#                 Product_instance.VolumeType =Volume_Type_instance
#                 Product_instance.PackType =Pack_Type_instance
#                 Product_instance.PackQty =Pack_Quantity
#                 Product_instance.MinimumQty =Minimum_Quantity
#                 Product_instance.MaximumQty =Maximum_Quantity
#                 Product_instance.ReorderLevel =Re_order_Level
#                 Product_instance.IsReUsable =Is_Reusable
#                 Product_instance.ReUsableTimes =Re_Usable_Times
#                 Product_instance.IsSellable =Is_Sellable
#                 Product_instance.LeastSellableUnit =Least_Sellable_Unit
#                 Product_instance.IsPartialUse =Is_Partial_Use
#                 Product_instance.IsPerishable =Is_Perishable
#                 Product_instance.PerishableDuration =Perishable_Duration
#                 Product_instance.PerishableDurationType =Perishable_Duration_Type
#                 Product_instance.Is_Manufacture_Date_Available =Is_Manufacture_Date_Available
#                 Product_instance.Is_Expiry_Date_Available =Is_Expiry_Date_Available
#                 Product_instance.Is_Serial_No_Available_for_each_quantity =Is_Serial_No_Available_for_each_quantity
#                 Product_instance.ProductDescription =Product_Description
#                 Product_instance.DrugSegment=DrugSegment_instances
#                 Product_instance.Updated_by =Created_by
#                 Product_instance.Department = Department
#                 Product_instance.Doctorname = Doctorname
#                 Product_instance.save()
               
#                 return JsonResponse({'success': 'Item Updated successfully'})
                
#             else:
#                 print("else block working--------------------------")
#                 existing_Product = Product_Master_All_Category_Details.objects.annotate(
#                         normalized_name=Func(
#                             'ItemName',
#                             function='LOWER',
#                             template="REPLACE(%(expressions)s, ' ', '')"
#                         )
#                     ).filter(normalized_name=normalized_name)
                
#                 if existing_Product.exists():
#                     print("existing_Product------------------------------",existing_Product)
#                     return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})
#                 print('909099099999999999999999999999999')
#                 if Drug_Segment:
#                     print("Drug_Segment---------------------",Drug_Segment)
                
            
#                     field_instances = ProductMaster_Drug_Segment_Details.objects.get( pk = Drug_Segment)
                   
#                 Product_instance = Product_Master_All_Category_Details(
#                     ItemName = Item_Name,
#                     ProductCategory = Product_Category_instance,
#                     SubCategory = Sub_Category_instance,
#                     GenericName = Generic_instance,
#                     CompanyName = Manufacturer_instance,
#                     HSNCode = HSN_Code,
#                     ProductType = Product_Type_instance,
#                     ProductGroup = Product_Group_instance,
#                     Strength = Strength,
#                     StrengthType = Strength_Type,
#                     Volume = Volume,
#                     VolumeType =Volume_Type_instance,
#                     PackType =Pack_Type_instance,
#                     PackQty =Pack_Quantity,
#                     MinimumQty = Minimum_Quantity,
#                     MaximumQty = Maximum_Quantity,
#                     ReorderLevel = Re_order_Level,
#                     IsReUsable = Is_Reusable,
#                     ReUsableTimes = Re_Usable_Times,
#                     IsSellable = Is_Sellable,
#                     LeastSellableUnit = Least_Sellable_Unit,
#                     IsPartialUse = Is_Partial_Use,
#                     IsPerishable = Is_Perishable,
#                     PerishableDuration = Perishable_Duration,
#                     PerishableDurationType = Perishable_Duration_Type,
#                     Is_Manufacture_Date_Available =Is_Manufacture_Date_Available,
#                     Is_Expiry_Date_Available =Is_Expiry_Date_Available,
#                     Is_Serial_No_Available_for_each_quantity =Is_Serial_No_Available_for_each_quantity,
#                     DrugSegment=DrugSegment_instances,
#                     ProductDescription = Product_Description,
#                     Created_at = Created_by,
#                     Department = Department,
#                     Doctorname = Doctorname

#                     )
#                 Product_instance.save()
#                 return JsonResponse({'success': 'Item added successfully'})
                
            

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON input'}, status=400)

#         except Exception as e:
#             return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
#     elif request.method == 'GET':
#         try:
#             ProductCategory = request.GET.get('ProductCategory')
#             SubCategory = request.GET.get('SubCategory','')
#             ItemCode = request.GET.get('ItemCode','')
#             ItemName = request.GET.get('ItemName','')
#             GenericName = request.GET.get('GenericName','')
#             CompanyName = request.GET.get('CompanyName','')
#             GroupName = request.GET.get('GroupName','')
#             HSNCode = request.GET.get('HSNCode','')
#             Singledata = bool(request.GET.get('Singledata',False))
#             ForFilter = bool(request.GET.get('ForFilter',False))
#             filter_conditions = Q()
            
#             if ProductCategory:
#                 filter_conditions &= Q(ProductCategory__pk =ProductCategory)
#             if SubCategory:
#                 filter_conditions &= Q(SubCategory__pk =SubCategory)
#             if ItemCode:
#                 filter_conditions &= Q(pk__icontains=ItemCode)
#             if ItemName:
#                 filter_conditions &= Q(ItemName__icontains=ItemName)
#             if GenericName:
#                 filter_conditions &= Q(GenericName__pk=GenericName)
#             if CompanyName:
#                 filter_conditions &= Q(CompanyName__pk=CompanyName)
#             if GroupName:
#                 filter_conditions &= Q(ProductGroup__pk=GroupName)

#             if HSNCode:
#                 filter_conditions &= Q(HSNCode__icontains=HSNCode)

            
#             if ForFilter :
#                 pass
#             elif ItemCode and Singledata:
#                 pass
           
#             else:
#                 Product_Instance = Product_Master_All_Category_Details.objects.filter(filter_conditions,Status=1).order_by('ItemName')
#                 product_instance_data =[]
#                 index =1
#                 for ins in Product_Instance:
                    
#                     ins_data={
#                         "id":index,
#                         "Item_Code":ins.pk,
#                         "Item_Name":ins.ItemName,
#                         "Product_Category_pk":ins.ProductCategory.pk if ins.ProductCategory else '',
#                         "Product_Category":ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
#                         "Sub_Category_pk":ins.SubCategory.pk if ins.SubCategory else '',
#                         "Sub_Category":ins.SubCategory.SubCategoryName if ins.SubCategory else '',
#                         "Generic_Name_pk":ins.GenericName.pk if ins.GenericName  else '',
#                         "Generic_Name":ins.GenericName.GenericName if ins.GenericName else '',
#                         "Manufacturer_pk":ins.CompanyName.pk if ins.CompanyName else '',
#                         "Manufacturer_Name":ins.CompanyName.CompanyName if ins.CompanyName else '',
#                         "HSN_Code":ins.HSNCode,
#                         "Product_Type_pk":ins.ProductType.pk if ins.ProductType else '',
#                         "Product_Type":ins.ProductType.ProductType_Name if ins.ProductType else '',
#                         "Product_Group_pk":ins.ProductGroup.pk if ins.ProductGroup else '',
#                         "Product_Group":ins.ProductGroup.ProductGroup_Name if ins.ProductGroup else '',
#                         "Strength":ins.Strength,
#                         "Strength_Type":ins.StrengthType,
#                         "Volume":ins.Volume,
#                         "Volume_Type_pk":ins.VolumeType.pk if ins.VolumeType else '',
#                         "Volume_Type":f"{ins.VolumeType.Unit_Name} ({ins.VolumeType.Unit_Symbol})" if ins.VolumeType else '',
#                         "Pack_Type_pk":ins.PackType.pk if ins.PackType else '',
#                         "Pack_Type":ins.PackType.PackType_Name if ins.PackType else '',
#                         "Pack_Quantity":ins.PackQty,
#                         "Minimum_Quantity":ins.MinimumQty,
#                         "Maximum_Quantity":ins.MaximumQty,
#                         "Re_order_Level":ins.ReorderLevel,
#                         "Is_Reusable":'Yes' if ins.IsReUsable else "No",
#                         "Re_Usable_Times":ins.ReUsableTimes,
#                         "Is_Sellable":'Yes' if ins.IsSellable else "No",
#                         "Least_Sellable_Unit":ins.LeastSellableUnit,
#                         "Is_Partial_Use":'Yes' if ins.IsPartialUse else "No",
#                         "Is_Perishable":'Yes' if ins.IsPerishable else "No",
#                         "Perishable_Duration":ins.PerishableDuration,
#                         "Perishable_Duration_Type":ins.PerishableDurationType,
#                         "Is_Manufacture_Date_Available":'Yes' if ins.Is_Manufacture_Date_Available else "No",
#                         "Is_Expiry_Date_Available":'Yes' if ins.Is_Expiry_Date_Available else "No",
#                         "Is_Serial_No_Available_for_each_quantity":'Yes' if ins.Is_Serial_No_Available_for_each_quantity else "No",
#                         "Drug_Segment_pk": ins.DrugSegment.pk if ins.DrugSegment else None,
#                         "Drug_Segment": ins.DrugSegment.Segment if ins.DrugSegment else None,
#                         "Product_Description":ins.ProductDescription,
#                         "Department":ins.Department,
#                         "Doctorname":ins.Doctorname,
#                         "Status": "Active" if ins.Status else "Inactive"
#                     }
#                     product_instance_data.append(ins_data)
#                     index += 1
#                 return JsonResponse(product_instance_data, safe=False)
                
#         except Exception as e:
#             print(f"An error occurred: {str(e)}")
#             return JsonResponse({'error': f"An error occurred: {str(e)}"}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def product_master_Detials_link(request):

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("data---------", data)
            Item_Code = data.get("Item_Code")
            Item_Name = data.get("Item_Name")
            normalized_name = Item_Name.replace(" ", "").lower()
            Product_Category = data.get("Product_Category")
            Sub_Category = data.get("Sub_Category")
            Generic_Name = data.get("Generic_Name")
            Manufacturer_Name = data.get("Manufacturer_Name")
            HSN_Code = data.get("HSN_Code")
            Product_Type = data.get("Product_Type")
            Product_Group = data.get("Product_Group")
            Strength = data.get("Strength")
            Strength_Type = data.get("Strength_Type")
            Volume = data.get("Volume")
            Volume_Type = data.get("Volume_Type")
            Pack_Type = data.get("Pack_Type")
            Pack_Quantity = data.get("Pack_Quantity")
            Minimum_Quantity = data.get("Minimum_Quantity")
            Maximum_Quantity = data.get("Maximum_Quantity")
            Re_order_Level = data.get("Re_order_Level")
            Is_Reusable = data.get("Is_Reusable") == "Yes"
            Re_Usable_Times = data.get("Re_Usable_Times")
            Is_Sellable = data.get("Is_Sellable") == "Yes"
            Least_Sellable_Unit = data.get("Least_Sellable_Unit")
            Is_Partial_Use = data.get("Is_Partial_Use") == "Yes"
            Is_Perishable = data.get("Is_Perishable") == "Yes"
            Perishable_Duration = data.get("Perishable_Duration")
            Perishable_Duration_Type = data.get("Perishable_Duration_Type")
            Is_Manufacture_Date_Available = (
                data.get("Is_Manufacture_Date_Available") == "Yes"
            )
            Is_Expiry_Date_Available = data.get("Is_Expiry_Date_Available") == "Yes"
            Is_Serial_No_Available_for_each_quantity = (
                data.get("Is_Serial_No_Available_for_each_quantity") == "Yes"
            )
            Drug_Segment = data.get("Drug_Segment")
            print("Drug_Segment---", Drug_Segment)
            Product_Description = data.get("Product_Description")
            Created_by = data.get("Created_by")
            Department = data.get("Department")
            Doctorname = data.get("Doctorname")
            # Add GST fields
            GST_Type = data.get("GST_Type")
            GST_Value = data.get("GST_Value")

            Product_Category_instance = None

            Sub_Category_instance = None
            Generic_instance = None
            Manufacturer_instance = None
            Product_Type_instance = None
            Product_Group_instance = None
            Volume_Type_instance = None
            Pack_Type_instance = None
            field_instances = None

            if Product_Category:
                Product_Category_instance = (
                    Product_Category_Product_Details.objects.get(
                        pk=int(Product_Category)
                    )
                )

            if Sub_Category:
                Sub_Category_instance = SubCategory_Detailes.objects.get(
                    pk=int(Sub_Category)
                )

            if Generic_Name:
                Generic_instance = GenericName_Master_Details.objects.get(
                    pk=int(Generic_Name)
                )

            if Manufacturer_Name:
                Manufacturer_instance = CompanyName_mfg_Master_Details.objects.get(
                    pk=int(Manufacturer_Name)
                )

            if Product_Type:
                Product_Type_instance = ProductType_Master_Details.objects.get(
                    pk=int(Product_Type)
                )

            if Product_Group:
                Product_Group_instance = Product_Group_Master_Details.objects.get(
                    pk=int(Product_Group)
                )

            if Volume_Type:
                Volume_Type_instance = UnitOfMeasurement.objects.get(
                    pk=int(Volume_Type)
                )

            if Pack_Type:
                Pack_Type_instance = Pack_Type_Master_Details.objects.get(
                    pk=int(Pack_Type)
                )

            DrugSegment_instances = None
            if Drug_Segment in [None, "null", ""]:
                print("-----------------")
                DrugSegment_instances = None

            elif Drug_Segment:
                print("11111-Drug_Segment", Drug_Segment)
                DrugSegment_instances = ProductMaster_Drug_Segment_Details.objects.get(
                    pk=Drug_Segment
                )
            print("900000000000000")
            if Item_Code:
                print("updata")
                existing_Product = (
                    Product_Master_All_Category_Details.objects.annotate(
                        normalized_name=Func(
                            "ItemName",
                            function="LOWER",
                            template="REPLACE(%(expressions)s, ' ', '')",
                        )
                    )
                    .filter(normalized_name=normalized_name)
                    .exclude(pk=Item_Code)
                )
                print("9999999999-------------")
                # if existing_Product.exists():
                #     print('76777777777777')
                #     return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})

                Product_instance = Product_Master_All_Category_Details.objects.get(
                    pk=Item_Code
                )
                Product_instance.ItemName = Item_Name
                Product_instance.ProductCategory = Product_Category_instance
                Product_instance.SubCategory = Sub_Category_instance
                Product_instance.GenericName = Generic_instance
                Product_instance.CompanyName = Manufacturer_instance
                Product_instance.HSNCode = HSN_Code
                Product_instance.ProductType = Product_Type_instance
                Product_instance.ProductGroup = Product_Group_instance
                Product_instance.Strength = Strength
                Product_instance.StrengthType = Strength_Type
                Product_instance.Volume = Volume
                Product_instance.VolumeType = Volume_Type_instance
                Product_instance.PackType = Pack_Type_instance
                Product_instance.PackQty = Pack_Quantity
                Product_instance.MinimumQty = Minimum_Quantity
                Product_instance.MaximumQty = Maximum_Quantity
                Product_instance.ReorderLevel = Re_order_Level
                Product_instance.IsReUsable = Is_Reusable
                Product_instance.ReUsableTimes = Re_Usable_Times
                Product_instance.IsSellable = Is_Sellable
                Product_instance.LeastSellableUnit = Least_Sellable_Unit
                Product_instance.IsPartialUse = Is_Partial_Use
                Product_instance.IsPerishable = Is_Perishable
                Product_instance.PerishableDuration = Perishable_Duration
                Product_instance.PerishableDurationType = Perishable_Duration_Type
                Product_instance.Is_Manufacture_Date_Available = (
                    Is_Manufacture_Date_Available
                )
                Product_instance.Is_Expiry_Date_Available = Is_Expiry_Date_Available
                Product_instance.Is_Serial_No_Available_for_each_quantity = (
                    Is_Serial_No_Available_for_each_quantity
                )
                Product_instance.ProductDescription = Product_Description
                Product_instance.DrugSegment = DrugSegment_instances
                Product_instance.Updated_by = Created_by
                Product_instance.Department = Department
                Product_instance.Doctorname = Doctorname
                # Add GST fields for update
                Product_instance.GST_Type = GST_Type
                Product_instance.GST_Value = GST_Value
                Product_instance.save()

                return JsonResponse({"success": "Item Updated successfully"})

            else:
                print("else block working--------------------------")
                existing_Product = Product_Master_All_Category_Details.objects.annotate(
                    normalized_name=Func(
                        "ItemName",
                        function="LOWER",
                        template="REPLACE(%(expressions)s, ' ', '')",
                    )
                ).filter(normalized_name=normalized_name)

                if existing_Product.exists():
                    print(
                        "existing_Product------------------------------",
                        existing_Product,
                    )
                    return JsonResponse(
                        {
                            "warn": f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"
                        }
                    )
                print("909099099999999999999999999999999")
                if Drug_Segment:
                    print("Drug_Segment---------------------", Drug_Segment)

                    field_instances = ProductMaster_Drug_Segment_Details.objects.get(
                        pk=Drug_Segment
                    )

                Product_instance = Product_Master_All_Category_Details(
                    ItemName=Item_Name,
                    ProductCategory=Product_Category_instance,
                    SubCategory=Sub_Category_instance,
                    GenericName=Generic_instance,
                    CompanyName=Manufacturer_instance,
                    HSNCode=HSN_Code,
                    ProductType=Product_Type_instance,
                    ProductGroup=Product_Group_instance,
                    Strength=Strength,
                    StrengthType=Strength_Type,
                    Volume=Volume,
                    VolumeType=Volume_Type_instance,
                    PackType=Pack_Type_instance,
                    PackQty=Pack_Quantity,
                    MinimumQty=Minimum_Quantity,
                    MaximumQty=Maximum_Quantity,
                    ReorderLevel=Re_order_Level,
                    IsReUsable=Is_Reusable,
                    ReUsableTimes=Re_Usable_Times,
                    IsSellable=Is_Sellable,
                    LeastSellableUnit=Least_Sellable_Unit,
                    IsPartialUse=Is_Partial_Use,
                    IsPerishable=Is_Perishable,
                    PerishableDuration=Perishable_Duration,
                    PerishableDurationType=Perishable_Duration_Type,
                    Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                    Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                    Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                    DrugSegment=DrugSegment_instances,
                    ProductDescription=Product_Description,
                    Created_at=Created_by,
                    Department=Department,
                    Doctorname=Doctorname,
                    # Add GST fields for create
                    GST_Type=GST_Type,
                    GST_Value=GST_Value,
                )
                Product_instance.save()
                return JsonResponse({"success": "Item added successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON input"}, status=400)

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )
    elif request.method == "GET":
        try:
            ProductCategory = request.GET.get("ProductCategory")
            SubCategory = request.GET.get("SubCategory", "")
            ItemCode = request.GET.get("ItemCode", "")
            ItemName = request.GET.get("ItemName", "")
            GenericName = request.GET.get("GenericName", "")
            CompanyName = request.GET.get("CompanyName", "")
            GroupName = request.GET.get("GroupName", "")
            HSNCode = request.GET.get("HSNCode", "")
            Singledata = bool(request.GET.get("Singledata", False))
            ForFilter = bool(request.GET.get("ForFilter", False))
            filter_conditions = Q()

            if ProductCategory:
                filter_conditions &= Q(ProductCategory__pk=ProductCategory)
            if SubCategory:
                filter_conditions &= Q(SubCategory__pk=SubCategory)
            if ItemCode:
                filter_conditions &= Q(pk__icontains=ItemCode)
            if ItemName:
                filter_conditions &= Q(ItemName__icontains=ItemName)
            if GenericName:
                filter_conditions &= Q(GenericName__pk=GenericName)
            if CompanyName:
                filter_conditions &= Q(CompanyName__pk=CompanyName)
            if GroupName:
                filter_conditions &= Q(ProductGroup__pk=GroupName)

            if HSNCode:
                filter_conditions &= Q(HSNCode__icontains=HSNCode)

            if ForFilter:
                pass
            elif ItemCode and Singledata:
                pass

            else:
                Product_Instance = Product_Master_All_Category_Details.objects.filter(
                    filter_conditions,Is_Optical=False,Is_GEN=False
                ).order_by("ItemName")
                product_instance_data = []
                index = 1
                for ins in Product_Instance:

                    ins_data = {
                        "id": index,
                        "Item_Code": ins.pk,
                        "Item_Name": ins.ItemName,
                        "Product_Category_pk": (
                            ins.ProductCategory.pk if ins.ProductCategory else ""
                        ),
                        "Product_Category": (
                            ins.ProductCategory.ProductCategory_Name
                            if ins.ProductCategory
                            else ""
                        ),
                        "Sub_Category_pk": (
                            ins.SubCategory.pk if ins.SubCategory else ""
                        ),
                        "Sub_Category": (
                            ins.SubCategory.SubCategoryName if ins.SubCategory else ""
                        ),
                        "Generic_Name_pk": (
                            ins.GenericName.pk if ins.GenericName else ""
                        ),
                        "Generic_Name": (
                            ins.GenericName.GenericName if ins.GenericName else ""
                        ),
                        "Manufacturer_pk": (
                            ins.CompanyName.pk if ins.CompanyName else ""
                        ),
                        "Manufacturer_Name": (
                            ins.CompanyName.CompanyName if ins.CompanyName else ""
                        ),
                        "HSN_Code": ins.HSNCode,
                        "Product_Type_pk": (
                            ins.ProductType.pk if ins.ProductType else ""
                        ),
                        "Product_Type": (
                            ins.ProductType.ProductType_Name if ins.ProductType else ""
                        ),
                        "Product_Group_pk": (
                            ins.ProductGroup.pk if ins.ProductGroup else ""
                        ),
                        "Product_Group": (
                            ins.ProductGroup.ProductGroup_Name
                            if ins.ProductGroup
                            else ""
                        ),
                        "Strength": ins.Strength,
                        "Strength_Type": ins.StrengthType,
                        "Volume": ins.Volume,
                        "Volume_Type_pk": ins.VolumeType.pk if ins.VolumeType else "",
                        "Volume_Type": (
                            f"{ins.VolumeType.Unit_Name} ({ins.VolumeType.Unit_Symbol})"
                            if ins.VolumeType
                            else ""
                        ),
                        "Pack_Type_pk": ins.PackType.pk if ins.PackType else "",
                        "Pack_Type": ins.PackType.PackType_Name if ins.PackType else "",
                        "Pack_Quantity": ins.PackQty,
                        "Minimum_Quantity": ins.MinimumQty,
                        "Maximum_Quantity": ins.MaximumQty,
                        "Re_order_Level": ins.ReorderLevel,
                        "Is_Reusable": "Yes" if ins.IsReUsable else "No",
                        "Re_Usable_Times": ins.ReUsableTimes,
                        "Is_Sellable": "Yes" if ins.IsSellable else "No",
                        "Least_Sellable_Unit": ins.LeastSellableUnit,
                        "Is_Partial_Use": "Yes" if ins.IsPartialUse else "No",
                        "Is_Perishable": "Yes" if ins.IsPerishable else "No",
                        "Perishable_Duration": ins.PerishableDuration,
                        "Perishable_Duration_Type": ins.PerishableDurationType,
                        "Is_Manufacture_Date_Available": (
                            "Yes" if ins.Is_Manufacture_Date_Available else "No"
                        ),
                        "Is_Expiry_Date_Available": (
                            "Yes" if ins.Is_Expiry_Date_Available else "No"
                        ),
                        "Is_Serial_No_Available_for_each_quantity": (
                            "Yes"
                            if ins.Is_Serial_No_Available_for_each_quantity
                            else "No"
                        ),
                        "Drug_Segment_pk": (
                            ins.DrugSegment.pk if ins.DrugSegment else None
                        ),
                        "Drug_Segment": (
                            ins.DrugSegment.Segment if ins.DrugSegment else None
                        ),
                        "Product_Description": ins.ProductDescription,
                        "Department": ins.Department,
                        "Doctorname": ins.Doctorname,
                        # Add GST fields to response
                        "GST_Type": ins.GST_Type if ins.GST_Type else "",
                        "GST_Value": ins.GST_Value if ins.GST_Value else "",
                        "Status": "Active" if ins.Status else "Inactive",
                    }
                    product_instance_data.append(ins_data)
                    index += 1
                return JsonResponse(product_instance_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def product_master_Detials_link_Optical(request):

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("data---------", data)
            Item_Code = data.get("Item_Code")
            Item_Name = data.get("Item_Name")
            normalized_name = Item_Name.replace(" ", "").lower()
            Product_Category = data.get("Product_Category")
            Sub_Category = data.get("Sub_Category")
            Generic_Name = data.get("Generic_Name")
            Manufacturer_Name = data.get("Manufacturer_Name")
            HSN_Code = data.get("HSN_Code")
            Product_Type = data.get("Product_Type")
            Product_Group = data.get("Product_Group")
            Strength = data.get("Strength")
            Strength_Type = data.get("Strength_Type")
            Volume = data.get("Volume")
            Volume_Type = data.get("Volume_Type")
            Pack_Type = data.get("Pack_Type")
            Pack_Quantity = data.get("Pack_Quantity")
            Minimum_Quantity = data.get("Minimum_Quantity")
            Maximum_Quantity = data.get("Maximum_Quantity")
            Re_order_Level = data.get("Re_order_Level")
            Is_Reusable = data.get("Is_Reusable") == "Yes"
            Re_Usable_Times = data.get("Re_Usable_Times")
            Is_Sellable = data.get("Is_Sellable") == "Yes"
            Least_Sellable_Unit = data.get("Least_Sellable_Unit")
            Is_Partial_Use = data.get("Is_Partial_Use") == "Yes"
            Is_Perishable = data.get("Is_Perishable") == "Yes"
            Perishable_Duration = data.get("Perishable_Duration")
            Perishable_Duration_Type = data.get("Perishable_Duration_Type")
            Is_Manufacture_Date_Available = (
                data.get("Is_Manufacture_Date_Available") == "Yes"
            )
            Is_Expiry_Date_Available = data.get("Is_Expiry_Date_Available") == "Yes"
            Is_Serial_No_Available_for_each_quantity = (
                data.get("Is_Serial_No_Available_for_each_quantity") == "Yes"
            )
            Drug_Segment = data.get("Drug_Segment")
            print("Drug_Segment---", Drug_Segment)
            Product_Description = data.get("Product_Description")
            Created_by = data.get("Created_by")
            Department = data.get("Department")
            Doctorname = data.get("Doctorname")
            # Add GST fields
            GST_Type = data.get("GST_Type")
            GST_Value = data.get("GST_Value")

            Product_Category_instance = None

            Sub_Category_instance = None
            Generic_instance = None
            Manufacturer_instance = None
            Product_Type_instance = None
            Product_Group_instance = None
            Volume_Type_instance = None
            Pack_Type_instance = None
            field_instances = None

            if Product_Category:
                Product_Category_instance = (
                    Product_Category_Product_Details.objects.get(
                        pk=int(Product_Category)
                    )
                )

            if Sub_Category:
                Sub_Category_instance = SubCategory_Detailes.objects.get(
                    pk=int(Sub_Category)
                )

            if Generic_Name:
                Generic_instance = GenericName_Master_Details.objects.get(
                    pk=int(Generic_Name)
                )

            if Manufacturer_Name:
                Manufacturer_instance = CompanyName_mfg_Master_Details.objects.get(
                    pk=int(Manufacturer_Name)
                )

            if Product_Type:
                Product_Type_instance = ProductType_Master_Details.objects.get(
                    pk=int(Product_Type)
                )

            if Product_Group:
                Product_Group_instance = Product_Group_Master_Details.objects.get(
                    pk=int(Product_Group)
                )

            if Volume_Type:
                Volume_Type_instance = UnitOfMeasurement.objects.get(
                    pk=int(Volume_Type)
                )

            if Pack_Type:
                Pack_Type_instance = Pack_Type_Master_Details.objects.get(
                    pk=int(Pack_Type)
                )

            DrugSegment_instances = None
            if Drug_Segment in [None, "null", ""]:
                print("-----------------")
                DrugSegment_instances = None

            elif Drug_Segment:
                print("11111-Drug_Segment", Drug_Segment)
                DrugSegment_instances = ProductMaster_Drug_Segment_Details.objects.get(
                    pk=Drug_Segment
                )
            print("900000000000000")
            if Item_Code:
                print("updata")
                existing_Product = (
                    Product_Master_All_Category_Details.objects.annotate(
                        normalized_name=Func(
                            "ItemName",
                            function="LOWER",
                            template="REPLACE(%(expressions)s, ' ', '')",
                        )
                    )
                    .filter(normalized_name=normalized_name)
                    .exclude(pk=Item_Code)
                )
                print("9999999999-------------")
                # if existing_Product.exists():
                #     print('76777777777777')
                #     return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})

                Product_instance = Product_Master_All_Category_Details.objects.get(
                    pk=Item_Code
                )
                Product_instance.ItemName = Item_Name
                Product_instance.Is_Optical = True
                Product_instance.ProductCategory = Product_Category_instance
                Product_instance.SubCategory = Sub_Category_instance
                Product_instance.GenericName = Generic_instance
                Product_instance.CompanyName = Manufacturer_instance
                Product_instance.HSNCode = HSN_Code
                Product_instance.ProductType = Product_Type_instance
                Product_instance.ProductGroup = Product_Group_instance
                Product_instance.Strength = Strength
                Product_instance.StrengthType = Strength_Type
                Product_instance.Volume = Volume
                Product_instance.VolumeType = Volume_Type_instance
                Product_instance.PackType = Pack_Type_instance
                Product_instance.PackQty = Pack_Quantity
                Product_instance.MinimumQty = Minimum_Quantity
                Product_instance.MaximumQty = Maximum_Quantity
                Product_instance.ReorderLevel = Re_order_Level
                Product_instance.IsReUsable = Is_Reusable
                Product_instance.ReUsableTimes = Re_Usable_Times
                Product_instance.IsSellable = Is_Sellable
                Product_instance.LeastSellableUnit = Least_Sellable_Unit
                Product_instance.IsPartialUse = Is_Partial_Use
                Product_instance.IsPerishable = Is_Perishable
                Product_instance.PerishableDuration = Perishable_Duration
                Product_instance.PerishableDurationType = Perishable_Duration_Type
                Product_instance.Is_Manufacture_Date_Available = (
                    Is_Manufacture_Date_Available
                )
                Product_instance.Is_Expiry_Date_Available = Is_Expiry_Date_Available
                Product_instance.Is_Serial_No_Available_for_each_quantity = (
                    Is_Serial_No_Available_for_each_quantity
                )
                Product_instance.ProductDescription = Product_Description
                Product_instance.DrugSegment = DrugSegment_instances
                Product_instance.Updated_by = Created_by
                Product_instance.Department = Department
                Product_instance.Doctorname = Doctorname
                # Add GST fields for update
                Product_instance.GST_Type = GST_Type
                Product_instance.GST_Value = GST_Value
                Product_instance.save()

                return JsonResponse({"success": "Item Updated successfully"})

            else:
                print("else block working--------------------------")
                existing_Product = Product_Master_All_Category_Details.objects.annotate(
                    normalized_name=Func(
                        "ItemName",
                        function="LOWER",
                        template="REPLACE(%(expressions)s, ' ', '')",
                    )
                ).filter(normalized_name=normalized_name)

                if existing_Product.exists():
                    print(
                        "existing_Product------------------------------",
                        existing_Product,
                    )
                    return JsonResponse(
                        {
                            "warn": f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"
                        }
                    )
                print("909099099999999999999999999999999")
                if Drug_Segment:
                    print("Drug_Segment---------------------", Drug_Segment)

                    field_instances = ProductMaster_Drug_Segment_Details.objects.get(
                        pk=Drug_Segment
                    )

                Product_instance = Product_Master_All_Category_Details(
                    ItemName=Item_Name,
                    Is_Optical=True,
                    ProductCategory=Product_Category_instance,
                    SubCategory=Sub_Category_instance,
                    GenericName=Generic_instance,
                    CompanyName=Manufacturer_instance,
                    HSNCode=HSN_Code,
                    ProductType=Product_Type_instance,
                    ProductGroup=Product_Group_instance,
                    Strength=Strength,
                    StrengthType=Strength_Type,
                    Volume=Volume,
                    VolumeType=Volume_Type_instance,
                    PackType=Pack_Type_instance,
                    PackQty=Pack_Quantity,
                    MinimumQty=Minimum_Quantity,
                    MaximumQty=Maximum_Quantity,
                    ReorderLevel=Re_order_Level,
                    IsReUsable=Is_Reusable,
                    ReUsableTimes=Re_Usable_Times,
                    IsSellable=Is_Sellable,
                    LeastSellableUnit=Least_Sellable_Unit,
                    IsPartialUse=Is_Partial_Use,
                    IsPerishable=Is_Perishable,
                    PerishableDuration=Perishable_Duration,
                    PerishableDurationType=Perishable_Duration_Type,
                    Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                    Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                    Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                    DrugSegment=DrugSegment_instances,
                    ProductDescription=Product_Description,
                    Created_at=Created_by,
                    Department=Department,
                    Doctorname=Doctorname,
                    # Add GST fields for create
                    GST_Type=GST_Type,
                    GST_Value=GST_Value,
                )
                Product_instance.save()
                return JsonResponse({"success": "Item added successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON input"}, status=400)

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )
    elif request.method == "GET":
        try:
            ProductCategory = request.GET.get("ProductCategory")
            SubCategory = request.GET.get("SubCategory", "")
            ItemCode = request.GET.get("ItemCode", "")
            ItemName = request.GET.get("ItemName", "")
            GenericName = request.GET.get("GenericName", "")
            CompanyName = request.GET.get("CompanyName", "")
            GroupName = request.GET.get("GroupName", "")
            HSNCode = request.GET.get("HSNCode", "")
            Singledata = bool(request.GET.get("Singledata", False))
            ForFilter = bool(request.GET.get("ForFilter", False))
            filter_conditions = Q()

            if ProductCategory:
                filter_conditions &= Q(ProductCategory__pk=ProductCategory)
            if SubCategory:
                filter_conditions &= Q(SubCategory__pk=SubCategory)
            if ItemCode:
                filter_conditions &= Q(pk__icontains=ItemCode)
            if ItemName:
                filter_conditions &= Q(ItemName__icontains=ItemName)
            if GenericName:
                filter_conditions &= Q(GenericName__pk=GenericName)
            if CompanyName:
                filter_conditions &= Q(CompanyName__pk=CompanyName)
            if GroupName:
                filter_conditions &= Q(ProductGroup__pk=GroupName)

            if HSNCode:
                filter_conditions &= Q(HSNCode__icontains=HSNCode)

            if ForFilter:
                pass
            elif ItemCode and Singledata:
                pass

            else:
                Product_Instance = Product_Master_All_Category_Details.objects.filter(
                    filter_conditions,Is_Optical=True
                ).order_by("ItemName")
                product_instance_data = []
                index = 1
                for ins in Product_Instance:

                    ins_data = {
                        "id": index,
                        "Item_Code": ins.pk,
                        "Item_Name": ins.ItemName,
                        "Product_Category_pk": (
                            ins.ProductCategory.pk if ins.ProductCategory else ""
                        ),
                        "Product_Category": (
                            ins.ProductCategory.ProductCategory_Name
                            if ins.ProductCategory
                            else ""
                        ),
                        "Sub_Category_pk": (
                            ins.SubCategory.pk if ins.SubCategory else ""
                        ),
                        "Sub_Category": (
                            ins.SubCategory.SubCategoryName if ins.SubCategory else ""
                        ),
                        "Generic_Name_pk": (
                            ins.GenericName.pk if ins.GenericName else ""
                        ),
                        "Generic_Name": (
                            ins.GenericName.GenericName if ins.GenericName else ""
                        ),
                        "Manufacturer_pk": (
                            ins.CompanyName.pk if ins.CompanyName else ""
                        ),
                        "Manufacturer_Name": (
                            ins.CompanyName.CompanyName if ins.CompanyName else ""
                        ),
                        "HSN_Code": ins.HSNCode,
                        "Product_Type_pk": (
                            ins.ProductType.pk if ins.ProductType else ""
                        ),
                        "Product_Type": (
                            ins.ProductType.ProductType_Name if ins.ProductType else ""
                        ),
                        "Product_Group_pk": (
                            ins.ProductGroup.pk if ins.ProductGroup else ""
                        ),
                        "Product_Group": (
                            ins.ProductGroup.ProductGroup_Name
                            if ins.ProductGroup
                            else ""
                        ),
                        "Strength": ins.Strength,
                        "Strength_Type": ins.StrengthType,
                        "Volume": ins.Volume,
                        "Volume_Type_pk": ins.VolumeType.pk if ins.VolumeType else "",
                        "Volume_Type": (
                            f"{ins.VolumeType.Unit_Name} ({ins.VolumeType.Unit_Symbol})"
                            if ins.VolumeType
                            else ""
                        ),
                        "Pack_Type_pk": ins.PackType.pk if ins.PackType else "",
                        "Pack_Type": ins.PackType.PackType_Name if ins.PackType else "",
                        "Pack_Quantity": ins.PackQty,
                        "Minimum_Quantity": ins.MinimumQty,
                        "Maximum_Quantity": ins.MaximumQty,
                        "Re_order_Level": ins.ReorderLevel,
                        "Is_Reusable": "Yes" if ins.IsReUsable else "No",
                        "Re_Usable_Times": ins.ReUsableTimes,
                        "Is_Sellable": "Yes" if ins.IsSellable else "No",
                        "Least_Sellable_Unit": ins.LeastSellableUnit,
                        "Is_Partial_Use": "Yes" if ins.IsPartialUse else "No",
                        "Is_Perishable": "Yes" if ins.IsPerishable else "No",
                        "Perishable_Duration": ins.PerishableDuration,
                        "Perishable_Duration_Type": ins.PerishableDurationType,
                        "Is_Manufacture_Date_Available": (
                            "Yes" if ins.Is_Manufacture_Date_Available else "No"
                        ),
                        "Is_Expiry_Date_Available": (
                            "Yes" if ins.Is_Expiry_Date_Available else "No"
                        ),
                        "Is_Serial_No_Available_for_each_quantity": (
                            "Yes"
                            if ins.Is_Serial_No_Available_for_each_quantity
                            else "No"
                        ),
                        "Drug_Segment_pk": (
                            ins.DrugSegment.pk if ins.DrugSegment else None
                        ),
                        "Drug_Segment": (
                            ins.DrugSegment.Segment if ins.DrugSegment else None
                        ),
                        "Product_Description": ins.ProductDescription,
                        "Department": ins.Department,
                        "Doctorname": ins.Doctorname,
                        # Add GST fields to response
                        "GST_Type": ins.GST_Type if ins.GST_Type else "",
                        "GST_Value": ins.GST_Value if ins.GST_Value else "",
                        "Status": "Active" if ins.Status else "Inactive",
                    }
                    product_instance_data.append(ins_data)
                    index += 1
                return JsonResponse(product_instance_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def product_master_Detials_link_GEN(request):

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("data---------", data)
            Item_Code = data.get("Item_Code")
            Item_Name = data.get("Item_Name")
            normalized_name = Item_Name.replace(" ", "").lower()
            Product_Category = data.get("Product_Category")
            Sub_Category = data.get("Sub_Category")
            Generic_Name = data.get("Generic_Name")
            Manufacturer_Name = data.get("Manufacturer_Name")
            HSN_Code = data.get("HSN_Code")
            Product_Type = data.get("Product_Type")
            Product_Group = data.get("Product_Group")
            Strength = data.get("Strength")
            Strength_Type = data.get("Strength_Type")
            Volume = data.get("Volume")
            Volume_Type = data.get("Volume_Type")
            Pack_Type = data.get("Pack_Type")
            Pack_Quantity = data.get("Pack_Quantity")
            Minimum_Quantity = data.get("Minimum_Quantity")
            Maximum_Quantity = data.get("Maximum_Quantity")
            Re_order_Level = data.get("Re_order_Level")
            Is_Reusable = data.get("Is_Reusable") == "Yes"
            Re_Usable_Times = data.get("Re_Usable_Times")
            Is_Sellable = data.get("Is_Sellable") == "Yes"
            Least_Sellable_Unit = data.get("Least_Sellable_Unit")
            Is_Partial_Use = data.get("Is_Partial_Use") == "Yes"
            Is_Perishable = data.get("Is_Perishable") == "Yes"
            Perishable_Duration = data.get("Perishable_Duration")
            Perishable_Duration_Type = data.get("Perishable_Duration_Type")
            Is_Manufacture_Date_Available = (
                data.get("Is_Manufacture_Date_Available") == "Yes"
            )
            Is_Expiry_Date_Available = data.get("Is_Expiry_Date_Available") == "Yes"
            Is_Serial_No_Available_for_each_quantity = (
                data.get("Is_Serial_No_Available_for_each_quantity") == "Yes"
            )
            Drug_Segment = data.get("Drug_Segment")
            print("Drug_Segment---", Drug_Segment)
            Product_Description = data.get("Product_Description")
            Created_by = data.get("Created_by")
            Department = data.get("Department")
            Doctorname = data.get("Doctorname")
            # Add GST fields
            GST_Type = data.get("GST_Type")
            GST_Value = data.get("GST_Value")

            Product_Category_instance = None

            Sub_Category_instance = None
            Generic_instance = None
            Manufacturer_instance = None
            Product_Type_instance = None
            Product_Group_instance = None
            Volume_Type_instance = None
            Pack_Type_instance = None
            field_instances = None

            if Product_Category:
                Product_Category_instance = (
                    Product_Category_Product_Details.objects.get(
                        pk=int(Product_Category)
                    )
                )

            if Sub_Category:
                Sub_Category_instance = SubCategory_Detailes.objects.get(
                    pk=int(Sub_Category)
                )

            if Generic_Name:
                Generic_instance = GenericName_Master_Details.objects.get(
                    pk=int(Generic_Name)
                )

            if Manufacturer_Name:
                Manufacturer_instance = CompanyName_mfg_Master_Details.objects.get(
                    pk=int(Manufacturer_Name)
                )

            if Product_Type:
                Product_Type_instance = ProductType_Master_Details.objects.get(
                    pk=int(Product_Type)
                )

            if Product_Group:
                Product_Group_instance = Product_Group_Master_Details.objects.get(
                    pk=int(Product_Group)
                )

            if Volume_Type:
                Volume_Type_instance = UnitOfMeasurement.objects.get(
                    pk=int(Volume_Type)
                )

            if Pack_Type:
                Pack_Type_instance = Pack_Type_Master_Details.objects.get(
                    pk=int(Pack_Type)
                )

            DrugSegment_instances = None
            if Drug_Segment in [None, "null", ""]:
                print("-----------------")
                DrugSegment_instances = None

            elif Drug_Segment:
                print("11111-Drug_Segment", Drug_Segment)
                DrugSegment_instances = ProductMaster_Drug_Segment_Details.objects.get(
                    pk=Drug_Segment
                )
            print("900000000000000")
            if Item_Code:
                print("updata")
                existing_Product = (
                    Product_Master_All_Category_Details.objects.annotate(
                        normalized_name=Func(
                            "ItemName",
                            function="LOWER",
                            template="REPLACE(%(expressions)s, ' ', '')",
                        )
                    )
                    .filter(normalized_name=normalized_name)
                    .exclude(pk=Item_Code)
                )
                print("9999999999-------------")
                # if existing_Product.exists():
                #     print('76777777777777')
                #     return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})

                Product_instance = Product_Master_All_Category_Details.objects.get(
                    pk=Item_Code
                )
                Product_instance.ItemName = Item_Name
                Product_instance.Is_GEN = True
                Product_instance.ProductCategory = Product_Category_instance
                Product_instance.SubCategory = Sub_Category_instance
                Product_instance.GenericName = Generic_instance
                Product_instance.CompanyName = Manufacturer_instance
                Product_instance.HSNCode = HSN_Code
                Product_instance.ProductType = Product_Type_instance
                Product_instance.ProductGroup = Product_Group_instance
                Product_instance.Strength = Strength
                Product_instance.StrengthType = Strength_Type
                Product_instance.Volume = Volume
                Product_instance.VolumeType = Volume_Type_instance
                Product_instance.PackType = Pack_Type_instance
                Product_instance.PackQty = Pack_Quantity
                Product_instance.MinimumQty = Minimum_Quantity
                Product_instance.MaximumQty = Maximum_Quantity
                Product_instance.ReorderLevel = Re_order_Level
                Product_instance.IsReUsable = Is_Reusable
                Product_instance.ReUsableTimes = Re_Usable_Times
                Product_instance.IsSellable = Is_Sellable
                Product_instance.LeastSellableUnit = Least_Sellable_Unit
                Product_instance.IsPartialUse = Is_Partial_Use
                Product_instance.IsPerishable = Is_Perishable
                Product_instance.PerishableDuration = Perishable_Duration
                Product_instance.PerishableDurationType = Perishable_Duration_Type
                Product_instance.Is_Manufacture_Date_Available = (
                    Is_Manufacture_Date_Available
                )
                Product_instance.Is_Expiry_Date_Available = Is_Expiry_Date_Available
                Product_instance.Is_Serial_No_Available_for_each_quantity = (
                    Is_Serial_No_Available_for_each_quantity
                )
                Product_instance.ProductDescription = Product_Description
                Product_instance.DrugSegment = DrugSegment_instances
                Product_instance.Updated_by = Created_by
                Product_instance.Department = Department
                Product_instance.Doctorname = Doctorname
                # Add GST fields for update
                Product_instance.GST_Type = GST_Type
                Product_instance.GST_Value = GST_Value
                Product_instance.save()

                return JsonResponse({"success": "Item Updated successfully"})

            else:
                print("else block working--------------------------")
                existing_Product = Product_Master_All_Category_Details.objects.annotate(
                    normalized_name=Func(
                        "ItemName",
                        function="LOWER",
                        template="REPLACE(%(expressions)s, ' ', '')",
                    )
                ).filter(normalized_name=normalized_name)

                if existing_Product.exists():
                    print(
                        "existing_Product------------------------------",
                        existing_Product,
                    )
                    return JsonResponse(
                        {
                            "warn": f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"
                        }
                    )
                print("909099099999999999999999999999999")
                if Drug_Segment:
                    print("Drug_Segment---------------------", Drug_Segment)

                    field_instances = ProductMaster_Drug_Segment_Details.objects.get(
                        pk=Drug_Segment
                    )

                Product_instance = Product_Master_All_Category_Details(
                    ItemName=Item_Name,
                    Is_GEN=True,
                    ProductCategory=Product_Category_instance,
                    SubCategory=Sub_Category_instance,
                    GenericName=Generic_instance,
                    CompanyName=Manufacturer_instance,
                    HSNCode=HSN_Code,
                    ProductType=Product_Type_instance,
                    ProductGroup=Product_Group_instance,
                    Strength=Strength,
                    StrengthType=Strength_Type,
                    Volume=Volume,
                    VolumeType=Volume_Type_instance,
                    PackType=Pack_Type_instance,
                    PackQty=Pack_Quantity,
                    MinimumQty=Minimum_Quantity,
                    MaximumQty=Maximum_Quantity,
                    ReorderLevel=Re_order_Level,
                    IsReUsable=Is_Reusable,
                    ReUsableTimes=Re_Usable_Times,
                    IsSellable=Is_Sellable,
                    LeastSellableUnit=Least_Sellable_Unit,
                    IsPartialUse=Is_Partial_Use,
                    IsPerishable=Is_Perishable,
                    PerishableDuration=Perishable_Duration,
                    PerishableDurationType=Perishable_Duration_Type,
                    Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                    Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                    Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                    DrugSegment=DrugSegment_instances,
                    ProductDescription=Product_Description,
                    Created_at=Created_by,
                    Department=Department,
                    Doctorname=Doctorname,
                    # Add GST fields for create
                    GST_Type=GST_Type,
                    GST_Value=GST_Value,
                )
                Product_instance.save()
                return JsonResponse({"success": "Item added successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON input"}, status=400)

        except Exception as e:
            return JsonResponse(
                {"error": f"An internal server error occurred: {str(e)}"}, status=500
            )
    elif request.method == "GET":
        try:
            ProductCategory = request.GET.get("ProductCategory")
            SubCategory = request.GET.get("SubCategory", "")
            ItemCode = request.GET.get("ItemCode", "")
            ItemName = request.GET.get("ItemName", "")
            GenericName = request.GET.get("GenericName", "")
            CompanyName = request.GET.get("CompanyName", "")
            GroupName = request.GET.get("GroupName", "")
            HSNCode = request.GET.get("HSNCode", "")
            Singledata = bool(request.GET.get("Singledata", False))
            ForFilter = bool(request.GET.get("ForFilter", False))
            filter_conditions = Q()

            if ProductCategory:
                filter_conditions &= Q(ProductCategory__pk=ProductCategory)
            if SubCategory:
                filter_conditions &= Q(SubCategory__pk=SubCategory)
            if ItemCode:
                filter_conditions &= Q(pk__icontains=ItemCode)
            if ItemName:
                filter_conditions &= Q(ItemName__icontains=ItemName)
            if GenericName:
                filter_conditions &= Q(GenericName__pk=GenericName)
            if CompanyName:
                filter_conditions &= Q(CompanyName__pk=CompanyName)
            if GroupName:
                filter_conditions &= Q(ProductGroup__pk=GroupName)

            if HSNCode:
                filter_conditions &= Q(HSNCode__icontains=HSNCode)

            if ForFilter:
                pass
            elif ItemCode and Singledata:
                pass

            else:
                Product_Instance = Product_Master_All_Category_Details.objects.filter(
                    filter_conditions,Is_GEN=True
                ).order_by("ItemName")
                product_instance_data = []
                index = 1
                for ins in Product_Instance:

                    ins_data = {
                        "id": index,
                        "Item_Code": ins.pk,
                        "Item_Name": ins.ItemName,
                        "Product_Category_pk": (
                            ins.ProductCategory.pk if ins.ProductCategory else ""
                        ),
                        "Product_Category": (
                            ins.ProductCategory.ProductCategory_Name
                            if ins.ProductCategory
                            else ""
                        ),
                        "Sub_Category_pk": (
                            ins.SubCategory.pk if ins.SubCategory else ""
                        ),
                        "Sub_Category": (
                            ins.SubCategory.SubCategoryName if ins.SubCategory else ""
                        ),
                        "Generic_Name_pk": (
                            ins.GenericName.pk if ins.GenericName else ""
                        ),
                        "Generic_Name": (
                            ins.GenericName.GenericName if ins.GenericName else ""
                        ),
                        "Manufacturer_pk": (
                            ins.CompanyName.pk if ins.CompanyName else ""
                        ),
                        "Manufacturer_Name": (
                            ins.CompanyName.CompanyName if ins.CompanyName else ""
                        ),
                        "HSN_Code": ins.HSNCode,
                        "Product_Type_pk": (
                            ins.ProductType.pk if ins.ProductType else ""
                        ),
                        "Product_Type": (
                            ins.ProductType.ProductType_Name if ins.ProductType else ""
                        ),
                        "Product_Group_pk": (
                            ins.ProductGroup.pk if ins.ProductGroup else ""
                        ),
                        "Product_Group": (
                            ins.ProductGroup.ProductGroup_Name
                            if ins.ProductGroup
                            else ""
                        ),
                        "Strength": ins.Strength,
                        "Strength_Type": ins.StrengthType,
                        "Volume": ins.Volume,
                        "Volume_Type_pk": ins.VolumeType.pk if ins.VolumeType else "",
                        "Volume_Type": (
                            f"{ins.VolumeType.Unit_Name} ({ins.VolumeType.Unit_Symbol})"
                            if ins.VolumeType
                            else ""
                        ),
                        "Pack_Type_pk": ins.PackType.pk if ins.PackType else "",
                        "Pack_Type": ins.PackType.PackType_Name if ins.PackType else "",
                        "Pack_Quantity": ins.PackQty,
                        "Minimum_Quantity": ins.MinimumQty,
                        "Maximum_Quantity": ins.MaximumQty,
                        "Re_order_Level": ins.ReorderLevel,
                        "Is_Reusable": "Yes" if ins.IsReUsable else "No",
                        "Re_Usable_Times": ins.ReUsableTimes,
                        "Is_Sellable": "Yes" if ins.IsSellable else "No",
                        "Least_Sellable_Unit": ins.LeastSellableUnit,
                        "Is_Partial_Use": "Yes" if ins.IsPartialUse else "No",
                        "Is_Perishable": "Yes" if ins.IsPerishable else "No",
                        "Perishable_Duration": ins.PerishableDuration,
                        "Perishable_Duration_Type": ins.PerishableDurationType,
                        "Is_Manufacture_Date_Available": (
                            "Yes" if ins.Is_Manufacture_Date_Available else "No"
                        ),
                        "Is_Expiry_Date_Available": (
                            "Yes" if ins.Is_Expiry_Date_Available else "No"
                        ),
                        "Is_Serial_No_Available_for_each_quantity": (
                            "Yes"
                            if ins.Is_Serial_No_Available_for_each_quantity
                            else "No"
                        ),
                        "Drug_Segment_pk": (
                            ins.DrugSegment.pk if ins.DrugSegment else None
                        ),
                        "Drug_Segment": (
                            ins.DrugSegment.Segment if ins.DrugSegment else None
                        ),
                        "Product_Description": ins.ProductDescription,
                        "Department": ins.Department,
                        "Doctorname": ins.Doctorname,
                        # Add GST fields to response
                        "GST_Type": ins.GST_Type if ins.GST_Type else "",
                        "GST_Value": ins.GST_Value if ins.GST_Value else "",
                        "Status": "Active" if ins.Status else "Inactive",
                    }
                    product_instance_data.append(ins_data)
                    index += 1
                return JsonResponse(product_instance_data, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Update_product_master_status(request):
   
    
    try:
        data = json.loads(request.body)
        ItemCode = data.get('ItemCode')

        if not ItemCode:
            return JsonResponse({'error': 'ItemCode is required'}, status=400)

       
        try:
            product_instance = Product_Master_All_Category_Details.objects.get(pk = ItemCode)
            product_instance.Status = not product_instance.Status  # Toggle the status
            product_instance.save()

            return JsonResponse({'success': 'Product status updated successfully.'}, status=200)

        except Product_Master_All_Category_Details.DoesNotExist:
            return JsonResponse({'error': 'Product with given Item Code not found.'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON input'}, status=400)

    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




# ----------------------------------New get----------------------------------------
@csrf_exempt
@require_http_methods(["GET"])
def GET_Product_Detials_For_Tray_link(request):
    try:
        store_location = request.GET.get('StoreLocation')
        location = request.GET.get('Location')  # if needed
        print(store_location,location,"location store..")
        # Step 1: Get used Batch_Nos from Tray management
        used_batch_nos = Tray_management_Details.objects.values_list(
            'Product_Detials__pk'
        )

        print(used_batch_nos,'8998987789')

        # Step 2: Filter Product_Master excluding used Batch_Nos
        products = Product_Master_All_Category_Details.objects.select_related(
            'ProductCategory', 'SubCategory'
        )

        # Step 3: Prepare response data
        product_data = []
        for product in products:

          
            product_data.append({
                "Item_Code": product.pk,
                "Item_Name": product.ItemName,
                "Product_Category": product.ProductCategory.ProductCategory_Name if product.ProductCategory else '',
                "Sub_Category": product.SubCategory.SubCategoryName if product.SubCategory else '',
                
            })

        return JsonResponse(product_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
@csrf_exempt
def GET_Product_Detials_For_Tray_link2(request):
    try:
        if request.method == 'GET':
            product_data = []
           
            products = Product_Master_All_Category_Details.objects.all()
            for item in products:
              if item:
                product_data.append({
                    "Item_Code": item.pk,
                    "Item_Name": item.ItemName,
                    "Product_Category": item.ProductCategory.ProductCategory_Name if item.ProductCategory else '',
                    "Sub_Category": item.SubCategory.SubCategoryName if item.SubCategory else '',
                    # "Batch_No": item.Batch_No
                })
            return JsonResponse(product_data, safe=False)    
           
    except Exception as e:
        print(f"An error ocuured {str(e)}")    
        return JsonResponse({'error' : 'An internal server error ocuured'},status = 500)
    
    
@csrf_exempt
def Product_Master_File_Upload(request):    
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")
        pack_type_instance = None
        product_group_instance = None

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)

        # Normalize column names
        df.columns = df.columns.str.strip().str.lower()

        # Required columns
        required_columns = [
            "itemname", "productcategory", "subcategory", "genericname", "companyname",
            "producttype", "productgroup", "packtype", "hsncode", "strength",
            "strengthtype", "volume", "volumetype", "packqty", "minimumqty",
            "maximumqty", "reorderlevel", "productdescription", 
            "isreusable", "issellable", "isperishable", "ispartialuse",
            "is_manufacture_date_available", "is_expiry_date_available",
            "is_serial_no_available_for_each_quantity"
        ]
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return JsonResponse({"error": f"Missing required columns: {', '.join(missing_columns)}"}, status=400)

        # Clean object columns
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_dataone = df.to_dict(orient="records")

        skipped_count = 0  # <-- Track skipped rows

        def clean_number(value, as_type=int):
            try:
                if str(value).strip().lower() in ["nan", "null", "none", ""]:
                    return None
                return as_type(value)
            except (ValueError, TypeError):
                return None

        def clean_string(value):
            if value is None:
                return None
            value = str(value).strip()
            return None if value.lower() in ["nan", "null", "none", ""] else value

        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            filter_conditions = {key: value for key, value in filters.items() if value}
            instance = model.objects.filter(**filter_conditions).first()
            if instance is not None:
                if hasattr(instance, 'SubCategory_Id'): return instance.SubCategory_Id
                if hasattr(instance, 'GenericName_Id'): return instance.GenericName_Id
                if hasattr(instance, 'CompanyName_Id'): return instance.CompanyName_Id
                if hasattr(instance, 'ProductType_Id'): return instance.ProductType_Id
                if hasattr(instance, 'ProductGroup_Id'): return instance.ProductGroup_Id
                if hasattr(instance, 'PackType_Id'): return instance.PackType_Id
                if hasattr(instance, 'Unit_Id'): return instance.Unit_Id
                return instance.pk
            instance = model.objects.create(**{**filters, **defaults})
            if hasattr(instance, 'SubCategory_Id'): return instance.SubCategory_Id
            if hasattr(instance, 'GenericName_Id'): return instance.GenericName_Id
            if hasattr(instance, 'CompanyName_Id'): return instance.CompanyName_Id
            if hasattr(instance, 'ProductType_Id'): return instance.ProductType_Id
            if hasattr(instance, 'ProductGroup_Id'): return instance.ProductGroup_Id
            if hasattr(instance, 'PackType_Id'): return instance.PackType_Id
            if hasattr(instance, 'Unit_Id'): return instance.Unit_Id
            return instance.pk

        for row in csv_dataone:
            try:
                productcategory = None
                if clean_string(row.get("productcategory")):
                    productcategory = get_or_create_foreign_key(
                        Product_Category_Product_Details,
                        filters={"ProductCategory_Name": row.get("productcategory")},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )

                sub_category = None
                if clean_string(row.get("subcategory")) and productcategory:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        SubCategory_Detailes,
                        filters={"SubCategoryName": row.get("subcategory"), "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)

                generic_name = None
                if clean_string(row.get("genericname")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    generic_name = get_or_create_foreign_key(
                        GenericName_Master_Details,
                        filters={"GenericName": row.get("genericname"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    genericname_instance = GenericName_Master_Details.objects.get(GenericName_Id=generic_name)

                manufacturer_name = None
                if clean_string(row.get("companyname")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    manufacturer_name = get_or_create_foreign_key(
                        CompanyName_mfg_Master_Details,
                        filters={"CompanyName": row.get("companyname"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    manufacturer_name_instance = CompanyName_mfg_Master_Details.objects.get(CompanyName_Id=manufacturer_name)

                product_Type = None
                if clean_string(row.get("producttype")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    product_Type = get_or_create_foreign_key(
                        ProductType_Master_Details,
                        filters={"ProductType_Name": row.get("producttype"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    product_Type_instance = ProductType_Master_Details.objects.get(ProductType_Id=product_Type)

                product_group = None
                if clean_string(row.get("productgroup")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    product_group = get_or_create_foreign_key(
                        Product_Group_Master_Details,
                        filters={"ProductGroup_Name": row.get("productgroup"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    product_group_instance = Product_Group_Master_Details.objects.get(ProductGroup_Id=product_group)

                pack_type = None
                if clean_string(row.get("packtype")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    pack_type = get_or_create_foreign_key(
                        Pack_Type_Master_Details,
                        filters={"PackType_Name": row.get("packtype"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    pack_type_instance = Pack_Type_Master_Details.objects.get(PackType_Id=pack_type)

                # === Product Core Fields ===
                Volume_Type_instance = None
                ItemName = clean_string(row.get("itemname"))
                if not ItemName:
                    skipped_count += 1
                    continue

                HSNCode = clean_string(row.get("hsncode"))
                Strength = clean_number(row.get("strength"))
                StrengthType = clean_string(row.get("strengthtype"))
                PackQty = clean_number(row.get("packqty"))
                MinimumQty = clean_number(row.get("minimumqty"))
                MaximumQty = clean_number(row.get("maximumqty"))
                ReorderLevel = clean_number(row.get("reorderlevel"))
                ProductDescription = clean_string(row.get("productdescription"))
                Drug_Segment = clean_string(row.get("drug_segment"))
                Status = True
                Volume = clean_number(row.get("volume"))
                VolumeType = clean_string(row.get("volumetype"))

                IsReUsable = True if clean_string(row.get("isreusable")) == "yes" else False
                IsSellable = True if clean_string(row.get("issellable")) == "yes" else False
                IsPerishable = True if clean_string(row.get("isperishable")) == "yes" else False
                IsPartialUse = True if clean_string(row.get("ispartialuse")) == "yes" else False
                Is_Manufacture_Date_Available = True if clean_string(row.get("is_manufacture_date_available")) == "yes" else False
                Is_Expiry_Date_Available = True if clean_string(row.get("is_expiry_date_available")) == "yes" else False
                Is_Serial_No_Available_for_each_quantity = True if clean_string(row.get("is_serial_no_available_for_each_quantity")) == "yes" else False
                ReUsableTimes = None
                PerishableDuration = None
                PerishableDurationType = None
                LeastSellableUnit = None
                DrugSegment_instances = None

                if Drug_Segment:
                    try:
                        cleaned_drug_segment = Drug_Segment.replace(" ", "").lower()
                        for obj in ProductMaster_Drug_Segment_Details.objects.all():
                            if obj.Segment.replace(" ", "").lower() == cleaned_drug_segment:
                                DrugSegment_instances = obj
                                break
                        if DrugSegment_instances is None:
                            skipped_count += 1
                            continue
                    except Exception:
                        skipped_count += 1
                        continue

                if VolumeType:
                    Volume_Type_instance = UnitOfMeasurement.objects.filter(Unit_Symbol__iexact=VolumeType).first()

                if IsPerishable:
                    PerishableDuration = clean_number(row.get("perishableduration"))
                    PerishableDurationType = clean_string(row.get("perishabledurationtype"))
                    if not PerishableDuration or not PerishableDurationType:
                        skipped_count += 1
                        continue

                if IsSellable:
                    LeastSellableUnit = clean_string(row.get("leastsellableunit"))
                    if not LeastSellableUnit:
                        skipped_count += 1
                        continue

                if IsReUsable:
                    ReUsableTimes = clean_number(row.get("reusabletimes"))
                    if not ReUsableTimes:
                        skipped_count += 1
                        continue

                with transaction.atomic():
                    # Check duplicates
                    existing_product = Product_Master_All_Category_Details.objects.filter(
                        ItemName__iexact=ItemName
                    ).first()

                    if existing_product:
                        continue

                    Product_instance = Product_Master_All_Category_Details.objects.create(
                        ItemName=ItemName,
                        ProductCategory=productcategory_instance if productcategory else None,
                        SubCategory=sub_productcategory_instance if sub_category else None,
                        GenericName=genericname_instance if generic_name else None,
                        CompanyName=manufacturer_name_instance if manufacturer_name else None,
                        HSNCode=HSNCode,
                        ProductType=product_Type_instance if product_Type else None,
                        ProductGroup=product_group_instance if product_group else None,
                        Strength=Strength,
                        StrengthType=StrengthType,
                        Volume=Volume,
                        VolumeType=Volume_Type_instance,
                        PackType=pack_type_instance if pack_type else None,
                        PackQty=PackQty,
                        MinimumQty=MinimumQty,
                        MaximumQty=MaximumQty,
                        ReorderLevel=ReorderLevel,
                        IsReUsable=IsReUsable,
                        ReUsableTimes=ReUsableTimes,
                        IsSellable=IsSellable,
                        LeastSellableUnit=LeastSellableUnit,
                        IsPartialUse=IsPartialUse,
                        IsPerishable=IsPerishable,
                        PerishableDuration=PerishableDuration,
                        PerishableDurationType=PerishableDurationType,
                        Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                        Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                        Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                        ProductDescription=ProductDescription,
                        DrugSegment=DrugSegment_instances,
                        Status=Status,
                        created_by=created_by,
                    )
                    Product_instance.save()

            except Exception as inner_e:
                skipped_count += 1
                continue

        return JsonResponse({
            'success': 'Productmaster xlxs/csv file upload completed',
            'skipped_rows': skipped_count
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)

    
@csrf_exempt
def Product_Master_File_Upload_GEN(request):    
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")
        pack_type_instance = None
        product_group_instance = None

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)

        # Normalize column names
        df.columns = df.columns.str.strip().str.lower()

        # Required columns
        required_columns = [
            "itemname", "productcategory", "subcategory", "genericname", "companyname",
            "producttype", "productgroup", "packtype", "hsncode", "strength",
            "strengthtype", "volume", "volumetype", "packqty", "minimumqty",
            "maximumqty", "reorderlevel", "productdescription", 
            "isreusable", "issellable", "isperishable", "ispartialuse",
            "is_manufacture_date_available", "is_expiry_date_available",
            "is_serial_no_available_for_each_quantity"
        ]
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return JsonResponse({"error": f"Missing required columns: {', '.join(missing_columns)}"}, status=400)

        # Clean object columns
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()

        csv_dataone = df.to_dict(orient="records")

        skipped_count = 0  # <-- Track skipped rows

        def clean_number(value, as_type=int):
            try:
                if str(value).strip().lower() in ["nan", "null", "none", ""]:
                    return None
                return as_type(value)
            except (ValueError, TypeError):
                return None

        def clean_string(value):
            if value is None:
                return None
            value = str(value).strip()
            return None if value.lower() in ["nan", "null", "none", ""] else value

        def get_or_create_foreign_key(model, filters, defaults, return_existing_code=False):
            filter_conditions = {key: value for key, value in filters.items() if value}
            instance = model.objects.filter(**filter_conditions).first()
            if instance is not None:
                if hasattr(instance, 'SubCategory_Id'): return instance.SubCategory_Id
                if hasattr(instance, 'GenericName_Id'): return instance.GenericName_Id
                if hasattr(instance, 'CompanyName_Id'): return instance.CompanyName_Id
                if hasattr(instance, 'ProductType_Id'): return instance.ProductType_Id
                if hasattr(instance, 'ProductGroup_Id'): return instance.ProductGroup_Id
                if hasattr(instance, 'PackType_Id'): return instance.PackType_Id
                if hasattr(instance, 'Unit_Id'): return instance.Unit_Id
                return instance.pk
            instance = model.objects.create(**{**filters, **defaults})
            if hasattr(instance, 'SubCategory_Id'): return instance.SubCategory_Id
            if hasattr(instance, 'GenericName_Id'): return instance.GenericName_Id
            if hasattr(instance, 'CompanyName_Id'): return instance.CompanyName_Id
            if hasattr(instance, 'ProductType_Id'): return instance.ProductType_Id
            if hasattr(instance, 'ProductGroup_Id'): return instance.ProductGroup_Id
            if hasattr(instance, 'PackType_Id'): return instance.PackType_Id
            if hasattr(instance, 'Unit_Id'): return instance.Unit_Id
            return instance.pk

        for row in csv_dataone:
            try:
                productcategory = None
                if clean_string(row.get("productcategory")):
                    productcategory = get_or_create_foreign_key(
                        Product_Category_Product_Details,
                        filters={"ProductCategory_Name": row.get("productcategory")},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )

                sub_category = None
                if clean_string(row.get("subcategory")) and productcategory:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_category = get_or_create_foreign_key(
                        SubCategory_Detailes,
                        filters={"SubCategoryName": row.get("subcategory"), "ProductCategoryId": productcategory_instance},
                        defaults={"Status": True, "Created_by": created_by},
                        return_existing_code=True
                    )
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)

                generic_name = None
                if clean_string(row.get("genericname")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    generic_name = get_or_create_foreign_key(
                        GenericName_Master_Details,
                        filters={"GenericName": row.get("genericname"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    genericname_instance = GenericName_Master_Details.objects.get(GenericName_Id=generic_name)

                manufacturer_name = None
                if clean_string(row.get("companyname")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    manufacturer_name = get_or_create_foreign_key(
                        CompanyName_mfg_Master_Details,
                        filters={"CompanyName": row.get("companyname"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    manufacturer_name_instance = CompanyName_mfg_Master_Details.objects.get(CompanyName_Id=manufacturer_name)

                product_Type = None
                if clean_string(row.get("producttype")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    product_Type = get_or_create_foreign_key(
                        ProductType_Master_Details,
                        filters={"ProductType_Name": row.get("producttype"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    product_Type_instance = ProductType_Master_Details.objects.get(ProductType_Id=product_Type)

                product_group = None
                if clean_string(row.get("productgroup")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    product_group = get_or_create_foreign_key(
                        Product_Group_Master_Details,
                        filters={"ProductGroup_Name": row.get("productgroup"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    product_group_instance = Product_Group_Master_Details.objects.get(ProductGroup_Id=product_group)

                pack_type = None
                if clean_string(row.get("packtype")) and productcategory and sub_category:
                    productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                    sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
                    pack_type = get_or_create_foreign_key(
                        Pack_Type_Master_Details,
                        filters={"PackType_Name": row.get("packtype"), "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                        defaults={"Status": True, "Create_by": created_by},
                        return_existing_code=True
                    )
                    pack_type_instance = Pack_Type_Master_Details.objects.get(PackType_Id=pack_type)

                # === Product Core Fields ===
                Volume_Type_instance = None
                ItemName = clean_string(row.get("itemname"))
                if not ItemName:
                    skipped_count += 1
                    continue

                HSNCode = clean_string(row.get("hsncode"))
                Strength = clean_number(row.get("strength"))
                StrengthType = clean_string(row.get("strengthtype"))
                PackQty = clean_number(row.get("packqty"))
                MinimumQty = clean_number(row.get("minimumqty"))
                MaximumQty = clean_number(row.get("maximumqty"))
                ReorderLevel = clean_number(row.get("reorderlevel"))
                ProductDescription = clean_string(row.get("productdescription"))
                Drug_Segment = clean_string(row.get("drug_segment"))
                Status = True
                Volume = clean_number(row.get("volume"))
                VolumeType = clean_string(row.get("volumetype"))

                IsReUsable = True if clean_string(row.get("isreusable")) == "yes" else False
                IsSellable = True if clean_string(row.get("issellable")) == "yes" else False
                IsPerishable = True if clean_string(row.get("isperishable")) == "yes" else False
                IsPartialUse = True if clean_string(row.get("ispartialuse")) == "yes" else False
                Is_Manufacture_Date_Available = True if clean_string(row.get("is_manufacture_date_available")) == "yes" else False
                Is_Expiry_Date_Available = True if clean_string(row.get("is_expiry_date_available")) == "yes" else False
                Is_Serial_No_Available_for_each_quantity = True if clean_string(row.get("is_serial_no_available_for_each_quantity")) == "yes" else False
                ReUsableTimes = None
                PerishableDuration = None
                PerishableDurationType = None
                LeastSellableUnit = None
                DrugSegment_instances = None

                if Drug_Segment:
                    try:
                        cleaned_drug_segment = Drug_Segment.replace(" ", "").lower()
                        for obj in ProductMaster_Drug_Segment_Details.objects.all():
                            if obj.Segment.replace(" ", "").lower() == cleaned_drug_segment:
                                DrugSegment_instances = obj
                                break
                        if DrugSegment_instances is None:
                            skipped_count += 1
                            continue
                    except Exception:
                        skipped_count += 1
                        continue

                if VolumeType:
                    Volume_Type_instance = UnitOfMeasurement.objects.filter(Unit_Symbol__iexact=VolumeType).first()

                if IsPerishable:
                    PerishableDuration = clean_number(row.get("perishableduration"))
                    PerishableDurationType = clean_string(row.get("perishabledurationtype"))
                    if not PerishableDuration or not PerishableDurationType:
                        skipped_count += 1
                        continue

                if IsSellable:
                    LeastSellableUnit = clean_string(row.get("leastsellableunit"))
                    if not LeastSellableUnit:
                        skipped_count += 1
                        continue

                if IsReUsable:
                    ReUsableTimes = clean_number(row.get("reusabletimes"))
                    if not ReUsableTimes:
                        skipped_count += 1
                        continue

                with transaction.atomic():
                    # Check duplicates
                    existing_product = Product_Master_All_Category_Details.objects.filter(
                        ItemName__iexact=ItemName
                    ).first()

                    if existing_product:
                        continue

                    Product_instance = Product_Master_All_Category_Details.objects.create(
                        ItemName=ItemName,
                        Is_GEN=True,
                        ProductCategory=productcategory_instance if productcategory else None,
                        SubCategory=sub_productcategory_instance if sub_category else None,
                        GenericName=genericname_instance if generic_name else None,
                        CompanyName=manufacturer_name_instance if manufacturer_name else None,
                        HSNCode=HSNCode,
                        ProductType=product_Type_instance if product_Type else None,
                        ProductGroup=product_group_instance if product_group else None,
                        Strength=Strength,
                        StrengthType=StrengthType,
                        Volume=Volume,
                        VolumeType=Volume_Type_instance,
                        PackType=pack_type_instance if pack_type else None,
                        PackQty=PackQty,
                        MinimumQty=MinimumQty,
                        MaximumQty=MaximumQty,
                        ReorderLevel=ReorderLevel,
                        IsReUsable=IsReUsable,
                        ReUsableTimes=ReUsableTimes,
                        IsSellable=IsSellable,
                        LeastSellableUnit=LeastSellableUnit,
                        IsPartialUse=IsPartialUse,
                        IsPerishable=IsPerishable,
                        PerishableDuration=PerishableDuration,
                        PerishableDurationType=PerishableDurationType,
                        Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                        Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                        Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                        ProductDescription=ProductDescription,
                        DrugSegment=DrugSegment_instances,
                        Status=Status,
                        created_by=created_by,
                    )
                    Product_instance.save()

            except Exception as inner_e:
                skipped_count += 1
                continue

        return JsonResponse({
            'success': 'Productmaster xlxs/csv file upload completed',
            'skipped_rows': skipped_count
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def All_Items_Link(request):
    try:
        
        product_names = Product_Master_All_Category_Details.objects.all()

        product_data = []
        for ids, item in enumerate(product_names, start=1):  
            item_dict = {
                'id': ids,
                'itemcode': item.pk,
                'itemname': item.ItemName  
            }
            product_data.append(item_dict)

        return JsonResponse(product_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




@csrf_exempt
@require_http_methods(["GET"])
def All_Doctors_Item_Link(request):
    try:
        Doctornames = Doctor_Personal_Form_Detials.objects.all()
        Doctor_Data = []

        for ids, doctor in enumerate(Doctornames, start=1):
            doctor_dict = {
                'id': ids,
                'doctorid': doctor.Doctor_ID,
                'doctorname': f"{doctor.Tittle.Title_Name}. {doctor.First_Name} {doctor.Middle_Name or ''} {doctor.Last_Name or ''}".strip(),
            }
            Doctor_Data.append(doctor_dict)

        return JsonResponse(Doctor_Data, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




@csrf_exempt
def get_all_store_locations(request):
    stores = Inventory_Location_Master_Detials.objects.all().values('Store_Id', 'Store_Name')
    return JsonResponse(list(stores), safe=False)


@csrf_exempt
def get_all_nurse_station_link(request):
    nurse_stations = NurseStationMaster.objects.all().values('NurseStationid','NurseStationName')
    return JsonResponse(list(nurse_stations), safe=False)
    


# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def get_item_details_batchwise_for_stockadjusment(request):
#     try:
#         itemCode = request.GET.get('itemcode')
#         ItemName = request.GET.get('ItemName')
#         StoreLocation = request.GET.get('StoreLocation')
#         StoreLocationNurseStation = request.GET.get('StoreLocationNurseStation')
#         print('StoreLocationNurseStation----',StoreLocationNurseStation)
#         BatchNumber = request.GET.get('BatchNumber')
#         ExpiryDateFrom = request.GET.get('ExpiryDateFrom')
#         ExpiryDateTo = request.GET.get('ExpiryDateTo')

#         batch_data = []

#         query =Q()
#         if StoreLocationNurseStation==True:
#             query &=Q(NurseStation_location__NurseStationid__icontains=StoreLocation)
#         else:  
#             query &=Q(Store_location__Store_Id__icontains=StoreLocation)
            

#         if ItemName:
#             query &=Q(Product_Detials__ItemName__icontains=ItemName)
#         if BatchNumber:
#            query &=Q(Batch_No__icontains=BatchNumber)
           
#         if ExpiryDateFrom and ExpiryDateTo:
#             query &= Q(Expiry_Date__range=[ExpiryDateFrom, ExpiryDateTo])
#         elif ExpiryDateFrom:
#             query &= Q(Expiry_Date__gte=ExpiryDateFrom)
#         elif ExpiryDateTo:
#             query &= Q(Expiry_Date__lte=ExpiryDateTo)


#         batchwise_items = Stock_Maintance_Table_Detials.objects.filter(query).order_by('Product_Detials__pk')
#         index = 1
#         for item in batchwise_items:
#             item_dict = {
#                 'id': index,
#                 'Pk':item.pk,
#                 'ProductCategory': item.Product_Detials.ProductCategory.ProductCategory_Name,
#                 'SubCategory':item.Product_Detials.SubCategory.SubCategoryName,
#                 'ItemCode': item.Product_Detials.pk,
#                 'ItemName': item.Product_Detials.ItemName,
#                 'BatchNo': item.Batch_No,
#                 'ExpiryDate': item.Expiry_Date.strftime('%d-%m-%Y') if item.Expiry_Date else None,
#                 'AvailableQuantity': item.AvailableQuantity if item.AvailableQuantity else 0,
#             }
#             batch_data.append(item_dict)
#             index += 1

#         return JsonResponse(batch_data, safe=False)

#     except Exception as e:
#         print(str(e))  # Log the exception for better debugging
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_item_details_batchwise_for_stockadjusment(request):
    try:
        itemCode = request.GET.get('itemcode')
        ItemName = request.GET.get('ItemName')
        StoreLocation = request.GET.get('StoreLocation')
        print('StoreLocation-----',StoreLocation)
        StoreLocationNurseStation = request.GET.get('StoreLocationNurseStation', 'false').lower() == 'true'
        print('StoreLocationNurseStation----', StoreLocationNurseStation)
        BatchNumber = request.GET.get('BatchNumber')
        ExpiryDateFrom = request.GET.get('ExpiryDateFrom')
        ExpiryDateTo = request.GET.get('ExpiryDateTo')

        batch_data = []

        query = Q()
        if StoreLocationNurseStation:
            query &= Q(NurseStation_location__NurseStationid__icontains=StoreLocation)
        else:
            query &= Q(Store_location__Store_Id__icontains=StoreLocation)

        if ItemName:
            query &= Q(Product_Detials__ItemName__icontains=ItemName)
        if BatchNumber:
            query &= Q(Batch_No__icontains=BatchNumber)

        if ExpiryDateFrom and ExpiryDateTo:
            query &= Q(Expiry_Date__range=[ExpiryDateFrom, ExpiryDateTo])
        elif ExpiryDateFrom:
            query &= Q(Expiry_Date__gte=ExpiryDateFrom)
        elif ExpiryDateTo:
            query &= Q(Expiry_Date__lte=ExpiryDateTo)

        batchwise_items = Stock_Maintance_Table_Detials.objects.filter(query).order_by('Product_Detials__pk')
        index = 1
        for item in batchwise_items:
            item_dict = {
                'id': index,
                'Pk': item.pk,
                'ProductCategory': item.Product_Detials.ProductCategory.ProductCategory_Name if item.Product_Detials.ProductCategory and item.Product_Detials.ProductCategory.ProductCategory_Name else '',
                'SubCategory': item.Product_Detials.SubCategory.SubCategoryName if item.Product_Detials.SubCategory and item.Product_Detials.SubCategory.SubCategoryName else '',
                'ItemCode': item.Product_Detials.pk,
                'ItemName': item.Product_Detials.ItemName,
                'BatchNo': item.Batch_No,
                'ExpiryDate': item.Expiry_Date.strftime('%d-%m-%Y') if item.Expiry_Date else None,
                'AvailableQuantity': item.AvailableQuantity if item.AvailableQuantity else 0,
                'MRP': item.Sellable_qty_price if item.Sellable_qty_price else 0,
            }
            batch_data.append(item_dict)
            index += 1

        return JsonResponse(batch_data, safe=False)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST"])
def changestockavailableqty (request) :
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            StockPk=data.get('Pk')
            ItemCode=data.get('ItemCode')
            BatchNo=data.get('BatchNo')
            ManufactureDate=data.get('ManufactureDate')
            ExpiryDate=data.get('ExpiryDate')
            AvailableQuantity = int(data.get('AvailableQuantity', 0))  # Ensure conversion to int
            AdjustQuantity = int(data.get('AdjustQuantity', 0)) 
            AdjustDate=data.get('AdjustDate')
            AdjustMode=data.get('AdjustMode')

            Reason=data.get('Reason')
            Create_by=data.get('Create_by')


            print('----StockPk',StockPk,BatchNo)
            if AdjustMode :
                Stock_Maintance_Ins=Stock_Maintance_Table_Detials.objects.get(pk=StockPk,Product_Detials=ItemCode,Batch_No=BatchNo)
                

                StockAdjustment_Item_Details.objects.create(
                Stock_Instance=Stock_Maintance_Ins,
                AdjustDate=AdjustDate,
                OldAvailQty=Stock_Maintance_Ins.AvailableQuantity,
                AdjustMode=AdjustMode,
                AdjustQty=AdjustQuantity,
                Reason=Reason,
                Created_by=Create_by
                )


                if AdjustMode == 'Add':
                    Stock_Maintance_Ins.AvailableQuantity +=  AdjustQuantity
                    Stock_Maintance_Ins.Add_Adjust_Quantity += AdjustQuantity

                elif AdjustMode == 'Less':
                    Stock_Maintance_Ins.AvailableQuantity -=  AdjustQuantity
                    Stock_Maintance_Ins.Less_Adjust_Quantity += AdjustQuantity

                
                
                Stock_Maintance_Ins.save()

            return JsonResponse({'success': 'Stock Change successfully'})

        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        


 
# @csrf_exempt
# def Stock_Excel_File_Upload(request):
#     try:
#         file = request.FILES.get("file")
#         created_by = request.POST.get("created_by")
 
#         if file.name.endswith(".csv"):
#             df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
#         elif file.name.endswith(".xlsx"):
#             df = pd.read_excel(file, engine="openpyxl")
#         else:
#             return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)
       
#         for col in df.select_dtypes(include=["object"]):
#             df[col] = df[col].str.replace("\xa0", " ").str.strip()
       
#         csv_dataone = df.to_dict(orient="records")
#         for row in csv_dataone:
#             product_instance = None
#             Is_Serial_No_Status = None
#             Manufacture_Date = None
#             Expiry_Date = None
#             Serial_No_Type = None
 
#             ItemName = row.get("ItemName", "").strip() if row.get("ItemName") else ""
#             Batch_No = row.get("Batch_No")
#             AvailableQuantity = row.get("AvailableQuantity", 0)
#             # print("AvailableQuantity,AvailableQuantity",AvailableQuantity)
#             AvailableQuantity = pd.to_numeric(row.get("AvailableQuantity", 0))
#             if not isinstance(AvailableQuantity, (int, float)):
#                 return JsonResponse({'warn': f'Invalid AvailableQuantity type for {ItemName}. Expected a number but got {type(AvailableQuantity).__name__}.'})
#             if pd.isna(AvailableQuantity):  # Check if AvailableQuantity is NaN
#                 AvailableQuantity = 0
#             elif AvailableQuantity is None or AvailableQuantity == "":
#                 AvailableQuantity = 0
           
 
 
#             Is_Manufacture_Date_Available = True if row.get("Is_Manufacture_Date_Available", "").strip().lower() == "yes" else False if row.get("Is_Manufacture_Date_Available", "").strip().lower() == "no" else False
#             Is_Expiry_Date_Available = True if row.get("Is_Expiry_Date_Available", "").strip().lower() == "yes" else False if row.get("Is_Expiry_Date_Available", "").strip().lower() == "no" else False
#             Is_Serial_No_Available_for_each_quantity = True if row.get("Is_Serial_No_Available_for_each_quantity", "").strip().lower() == "yes" else False if row.get("Is_Serial_No_Available_for_each_quantity", "").strip().lower() == "no" else False
#             if not ItemName:
#                 return JsonResponse({'warn':'Itemname is required'})
           
#             if Is_Serial_No_Available_for_each_quantity == True:
#                 Is_Serial_No_Status = "Applicable"
             
 
#             elif Is_Serial_No_Available_for_each_quantity == False:
#                 Is_Serial_No_Status = "Not_Applicable"
           
#             if not Batch_No:
#                 return JsonResponse({'warn': 'Batch_No is required'})
           
 
#             if Is_Serial_No_Available_for_each_quantity:
#                 Serial_No_Type = row.get("Serial_No_Type")
#                 if not Serial_No_Type:
#                     return JsonResponse({'warn': f'{ItemName} is Is Serial No Available for each quantity but you have not defined Serial_No_Type'})
 
#             if Is_Manufacture_Date_Available:
#                 manufacture_date = row.get("Manufacture_Date")
#                 if not manufacture_date:
#                     return JsonResponse({'error': 'Manufacture Date is required'})
#                 try:
#                     Manufacture_Date = pd.to_datetime(manufacture_date, format="%d-%m-%Y", errors='raise')
#                 except ValueError:
#                     return JsonResponse({'error': 'Invalid Manufacture Date format'})
 
#             if Is_Expiry_Date_Available:
#                 print("Expiry Date Check")
#                 expiry_date = row.get("Expiry_Date")
#                 print("Raw Expiry_Date from file:", expiry_date)
 
#                 if not expiry_date:
#                     return JsonResponse({'error': 'Expiry Date is required'})
 
#                 # Ensure expiry_date is a string and clean it
#                 expiry_date = str(expiry_date).strip()
 
#                 # Check if expiry_date has an invalid length
#                 if len(expiry_date.split("-")[-1]) != 4:  # Ensure the year has 4 digits
#                     return JsonResponse({'error': f'Invalid Expiry Date format: {expiry_date}. Expected DD-MM-YYYY.'})
 
#                 try:
#                     Expiry_Date = pd.to_datetime(expiry_date, format="%d-%m-%Y", errors='raise')
#                 except ValueError:
#                     return JsonResponse({'error': f'Invalid Expiry Date format: {expiry_date}. Expected DD-MM-YYYY.'})
 
 
 
#                 with transaction.atomic():
#                     if ItemName is not None and ItemName != '':
#                         product_instance = Product_Master_All_Category_Details.objects.filter(ItemName=ItemName).first()
 
#                         if not product_instance:
#                             return JsonResponse({'warn': f'{ItemName} not found in ProductMaster. Please create it first.'})
 
#                         print("product_instance:", product_instance)
 
#                         stock_instance = Stock_Maintance_Table_Detials.objects.filter(Product_Detials=product_instance).first()
#                         print("stock_instance:", stock_instance)
 
#                         if stock_instance:
#                             stock_instance.Batch_No = Batch_No
#                             stock_instance.Is_Manufacture_Date_Available = Is_Manufacture_Date_Available
#                             stock_instance.Manufacture_Date = Manufacture_Date
#                             stock_instance.Is_Expiry_Date_Available = Is_Expiry_Date_Available
#                             stock_instance.Expiry_Date = Expiry_Date
#                             stock_instance.Total_Quantity = AvailableQuantity
#                             stock_instance.AvailableQuantity = AvailableQuantity
#                             stock_instance.Is_Serial_No_Available_for_each_quantity = Is_Serial_No_Available_for_each_quantity
#                             stock_instance.Is_Serial_No_Status = Is_Serial_No_Status
#                             stock_instance.Serial_No_Type = Serial_No_Type
#                             stock_instance.Created_by = created_by
#                             stock_instance.save()
#                         else:
#                             Stock_Maintance_Table_Detials.objects.create(
#                                 Product_Detials=product_instance,
#                                 Batch_No=Batch_No,
#                                 Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
#                                 Manufacture_Date=Manufacture_Date,
#                                 Is_Expiry_Date_Available=Is_Expiry_Date_Available,
#                                 Expiry_Date=Expiry_Date,
#                                 Total_Quantity=AvailableQuantity,
#                                 AvailableQuantity=AvailableQuantity,
#                                 Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
#                                 Is_Serial_No_Status=Is_Serial_No_Status,
#                                 Serial_No_Type=Serial_No_Type,
#                                 Created_by=created_by
#                             )
 
#         return JsonResponse({'success': 'Stock xlxs/csv file upload successfully'})
 
#     except Exception as e:
#         print(f"Error occurred: {e}")
#         return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)
 


from decimal import Decimal
import pandas as pd
import datetime
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import pandas as pd
from decimal import Decimal
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import pandas as pd
from decimal import Decimal
import datetime
from django.db.models import Q

@csrf_exempt
def Stock_Excel_File_Upload(request):
    try:
        file = request.FILES.get("file")
        created_by = (request.POST.get("created_by") or "").strip()
        pack_type_instance = None

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        # --- Read file ---
        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload CSV or Excel"}, status=400)

        # --- Clean string columns ---
        for col in df.select_dtypes(include=["object"]):
            df[col] = df[col].astype(str).str.replace("\xa0", " ").str.strip()

        csv_data = df.to_dict(orient="records")

        inserted, updated, skipped = 0, 0, 0
        skipped_rows = []
        inserted_items = []
        updated_items = []

        for row in csv_data:
            # --- Extract values ---
            ItemName = str(row.get("ItemName") or "").strip()
            Batch_No = str(row.get("Batch_No") or "").strip()
            store_location_name = str(row.get("store_location_id") or "").strip()

            if not ItemName or not Batch_No:
                skipped += 1
                skipped_rows.append({"ItemName": ItemName, "reason": "Missing ItemName or Batch_No"})
                continue

            # --- Quantity ---
            try:
                AvailableQuantity = int(float(str(row.get("AvailableQuantity") or "0").replace("“", "").replace("”", "").strip()))
            except Exception:
                skipped += 1
                skipped_rows.append({"ItemName": ItemName, "reason": "Invalid AvailableQuantity"})
                continue

            # --- Sellable Price ---
            try:
                sellable_price_clean = str(row.get("Sellable_price") or "0").replace("“", "").replace("”", "").strip()
                sellable_price = Decimal(sellable_price_clean)
            except Exception:
                skipped += 1
                skipped_rows.append({"ItemName": ItemName, "reason": "Invalid Sellable_price"})
                continue

            # --- Fetch product from master ---
            product_instance = Product_Master_All_Category_Details.objects.filter(ItemName__iexact=ItemName).first()
            if not product_instance:
                skipped += 1
                skipped_rows.append({"ItemName": ItemName, "reason": "Product not found in ProductMaster"})
                continue

            # --- PackType logic ---
            if product_instance.PackType and product_instance.PackQty and product_instance.PackQty > 1:
                # If PackType exists, calculate unit price
                sellable_qty_price = (sellable_price / Decimal(product_instance.PackQty)) * Decimal(AvailableQuantity)
            else:
                # Normal calculation
                sellable_qty_price = sellable_price * Decimal(AvailableQuantity)

            # --- Flags ---
            Is_Manufacture_Date_Available = str(row.get("Is_Manufacture_Date_Available") or "").strip().lower() == "yes"
            Is_Expiry_Date_Available = str(row.get("Is_Expiry_Date_Available") or "").strip().lower() == "yes"
            Is_Serial_No_Available_for_each_quantity = str(row.get("Is_Serial_No_Available_for_each_quantity") or "").strip().lower() == "yes"
            Is_Serial_No_Status = "Applicable" if Is_Serial_No_Available_for_each_quantity else "Not_Applicable"

            Serial_No_Type = None
            if Is_Serial_No_Available_for_each_quantity:
                Serial_No_Type = row.get("Serial_No_Type")
                if not Serial_No_Type:
                    skipped += 1
                    skipped_rows.append({"ItemName": ItemName, "reason": "Serial_No_Type missing"})
                    continue

            # --- Manufacture Date ---
            Manufacture_Date = None
            if Is_Manufacture_Date_Available:
                manufacture_date_val = row.get("Manufacture_Date")
                if not manufacture_date_val or str(manufacture_date_val).strip() in ["", "nan", "NaT"]:
                    skipped += 1
                    skipped_rows.append({"ItemName": ItemName, "reason": "Manufacture Date missing"})
                    continue
                try:
                    Manufacture_Date = pd.to_datetime(manufacture_date_val, dayfirst=True, errors="raise").date()
                except Exception:
                    skipped += 1
                    skipped_rows.append({"ItemName": ItemName, "reason": f"Invalid Manufacture Date: {manufacture_date_val}"})
                    continue

            # --- Expiry Date ---
            Expiry_Date = None
            if Is_Expiry_Date_Available:
                expiry_date_val = row.get("Expiry_Date")
                if not expiry_date_val or str(expiry_date_val).strip() in ["", "nan", "NaT"]:
                    skipped += 1
                    skipped_rows.append({"ItemName": ItemName, "reason": "Expiry Date missing"})
                    continue
                try:
                    Expiry_Date = pd.to_datetime(expiry_date_val, dayfirst=True, errors="raise").date()
                except Exception:
                    skipped += 1
                    skipped_rows.append({"ItemName": ItemName, "reason": f"Invalid Expiry Date: {expiry_date_val}"})
                    continue

            # --- Fetch store location ---
            store_location = None
            if store_location_name:
                store_location = Inventory_Location_Master_Detials.objects.filter(Store_Name__iexact=store_location_name).first()

            if not store_location:
                skipped += 1
                skipped_rows.append({"ItemName": ItemName, "reason": f"Store location '{store_location_name}' not found"})
                continue

            # --- DB Transaction ---
            with transaction.atomic():
                stock_instance = Stock_Maintance_Table_Detials.objects.filter(
                    Product_Detials=product_instance, Batch_No=Batch_No
                ).first()

                stock_data = {
                    "ItemName": ItemName,
                    "Batch_No": Batch_No,
                    "AvailableQuantity": AvailableQuantity,
                    "Total_Quantity": AvailableQuantity,
                    "Sellable_price": str(sellable_price),
                    "Sellable_qty_price": str(sellable_qty_price),
                    "Store_location": store_location.Store_Name if store_location else None,
                    "Manufacture_Date": str(Manufacture_Date) if Manufacture_Date else None,
                    "Expiry_Date": str(Expiry_Date) if Expiry_Date else None,
                    "Is_Manufacture_Date_Available": Is_Manufacture_Date_Available,
                    "Is_Expiry_Date_Available": Is_Expiry_Date_Available,
                    "Is_Serial_No_Available_for_each_quantity": Is_Serial_No_Available_for_each_quantity,
                    "Is_Serial_No_Status": Is_Serial_No_Status,
                    "Serial_No_Type": Serial_No_Type,
                    "Created_by": created_by
                }

                if stock_instance:
                    # Update existing
                    stock_instance.Is_Manufacture_Date_Available = Is_Manufacture_Date_Available
                    stock_instance.Manufacture_Date = Manufacture_Date
                    stock_instance.Is_Expiry_Date_Available = Is_Expiry_Date_Available
                    stock_instance.Expiry_Date = Expiry_Date
                    stock_instance.Total_Quantity = AvailableQuantity
                    stock_instance.AvailableQuantity = AvailableQuantity
                    stock_instance.Sellable_price = sellable_price
                    stock_instance.Sellable_qty_price = sellable_qty_price
                    stock_instance.Is_Serial_No_Available_for_each_quantity = Is_Serial_No_Available_for_each_quantity
                    stock_instance.Is_Serial_No_Status = Is_Serial_No_Status
                    stock_instance.Serial_No_Type = Serial_No_Type
                    stock_instance.Created_by = created_by
                    stock_instance.Store_location = store_location
                    stock_instance.save()
                    updated += 1
                    updated_items.append(stock_data)
                else:
                    # Create new
                    Stock_Maintance_Table_Detials.objects.create(
                        Product_Detials=product_instance,
                        Batch_No=Batch_No,
                        Is_Manufacture_Date_Available=Is_Manufacture_Date_Available,
                        Manufacture_Date=Manufacture_Date,
                        Sellable_price=sellable_price,
                        Sellable_qty_price=sellable_qty_price,
                        Is_Expiry_Date_Available=Is_Expiry_Date_Available,
                        Expiry_Date=Expiry_Date,
                        Total_Quantity=AvailableQuantity,
                        AvailableQuantity=AvailableQuantity,
                        Is_Serial_No_Available_for_each_quantity=Is_Serial_No_Available_for_each_quantity,
                        Is_Serial_No_Status=Is_Serial_No_Status,
                        Serial_No_Type=Serial_No_Type,
                        Created_by=created_by,
                        Store_location=store_location
                    )
                    inserted += 1
                    inserted_items.append(stock_data)

        # --- Final response ---
        return JsonResponse({
            "success": True,
            "inserted": inserted,
            "updated": updated,
            "skipped": skipped,
            "inserted_items": inserted_items,
            "updated_items": updated_items,
            "skipped_rows": skipped_rows,
            "message": f"Stock file processed: {inserted} inserted, {updated} updated, {skipped} skipped."
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({"warn": f"An internal server error occurred: {str(e)}"}, status=500)



#---------------------------------doom----------------------------




from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta

@csrf_exempt
@require_http_methods(['GET'])
def Stock_Maintenance_List(request):
    filters = request.GET.dict()

    qs = Stock_Maintance_Table_Detials.objects.select_related(
        "Product_Detials__ProductCategory",
        "Product_Detials__SubCategory",
        "Product_Detials__GenericName",
        "Product_Detials__CompanyName",
        "Product_Detials__DrugSegment",
    ).all().exclude(AvailableQuantity=0)

    # --- Product master filters ---
    if filters.get("ItemName"):
        qs = qs.filter(Product_Detials__ItemName__icontains=filters["ItemName"])

    if filters.get("Category"):
        qs = qs.filter(Product_Detials__ProductCategory=filters["Category"])

    if filters.get("SubCategory"):
        qs = qs.filter(Product_Detials__SubCategory=filters["SubCategory"])

    if filters.get("GenericName"):
        qs = qs.filter(Product_Detials__GenericName=filters["GenericName"])

    if filters.get("CompanyName"):
        qs = qs.filter(Product_Detials__CompanyName=filters["CompanyName"])

    if filters.get("HSNCode"):
        qs = qs.filter(Product_Detials__HSNCode__icontains=filters["HSNCode"])

    if filters.get("Department"):
        qs = qs.filter(Product_Detials__Department__icontains=filters["Department"])

    if filters.get("Doctorname"):
        qs = qs.filter(Product_Detials__Doctorname__icontains=filters["Doctorname"])

    # --- Drug Segment filter ---
    if filters.get("DrugSegment"):
        qs = qs.filter(Product_Detials__DrugSegment__Segment__icontains=filters["DrugSegment"])

    # --- Stock level filters ---
    if filters.get("Batch_No"):
        qs = qs.filter(Batch_No__icontains=filters["Batch_No"])

    if filters.get("Expiry_Status"):
        qs = qs.filter(Expiry_Status=filters["Expiry_Status"])

    # --- Nurse Station filter ---
    is_nurse = filters.get("IsNurseStation")
    if is_nurse in ["true", "false", "True", "False", "1", "0"]:
        qs = qs.filter(IsNurseStation=is_nurse.lower() in ["true", "1"])


    if filters.get("Store_location"):
        qs = qs.filter(Store_location=filters["Store_location"])

    if filters.get("NurseStation_location"):
        qs = qs.filter(NurseStation_location=filters["NurseStation_location"])

    # --- Special Price Filters ---
    if filters.get("price_range"):
        if filters.get("price_range") == "high":
            qs = qs.order_by("-Sellable_price")  # highest price first
        elif filters.get("price_range") == "low":
            qs = qs.order_by("Sellable_price")   # lowest price first
        elif filters.get("price_range") == "medium":
            # optional: you can calculate median or just skip ordering
            qs = qs.order_by("Sellable_price")


    # --- Expiry days filter ---
    if filters.get("expiry_within_days"):
        today = timezone.now().date()
        qs = qs.filter(Expiry_Date__lte=today + timedelta(days=int(filters["expiry_within_days"])))

    # --- Final JSON Response ---
    data = list(qs.values(
    "id",
    "Batch_No",
    "Sellable_price",
    "AvailableQuantity",
    "Expiry_Status",
    "Created_at",
    "Update_at",
    "Product_Detials__ItemName",
    "Product_Detials__HSNCode",
    "Product_Detials__ProductCategory__ProductCategory_Name",  # ✅ from error log
    "Product_Detials__SubCategory__SubCategoryName",           # ✅ corrected
    "Product_Detials__GenericName__GenericName",               # check model
    "Product_Detials__CompanyName__CompanyName",               # check model
    "Product_Detials__DrugSegment__Segment",               # ok
))


    return JsonResponse({"count": len(data), "results": data}, safe=False)



from django.shortcuts import get_object_or_404
from datetime import datetime

@csrf_exempt
@require_http_methods(["GET", "POST"])
def edit_stock(request):
    if request.method == "GET":
        stock_id = request.GET.get("id")
        if not stock_id:
            return JsonResponse({"success": False, "error": "Stock id is required"}, status=400)

        stock = get_object_or_404(Stock_Maintance_Table_Detials, pk=stock_id)

        return JsonResponse({
    "success": True,
    "data": {
        "id": stock.pk,
        "ItemName": stock.Product_Detials.ItemName,
        "Store_Name": stock.Store_location.Store_Name,
        "Batch_No": stock.Batch_No,
        "AvailableQuantity": stock.AvailableQuantity,
        "Sellable_price": str(stock.Sellable_price),
        "Sellable_qty_price": str(stock.Sellable_qty_price),
        "Current_Price": str(stock.Current_Price),
        "Current_Qunatity_Price": str(stock.Current_Qunatity_Price),
        "MRP_Qunatity_Price": str(stock.MRP_Qunatity_Price),
        "Tax_Type": stock.Tax_Type,
        "Tax_Percentage": str(stock.Tax_Percentage),   # ✅ added
        "Tax_Amount": str(stock.Tax_Amount),
        "Expiry_Date": str(stock.Expiry_Date) if stock.Expiry_Date else None,
        "Expiry_Status": stock.Expiry_Status,
    }
}, status=200)


    elif request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            stock_id = data.get("id")
            if not stock_id:
                return JsonResponse({"success": False, "error": "Stock id is required"}, status=400)

            stock = get_object_or_404(Stock_Maintance_Table_Detials, id=stock_id)

            # Update only provided fields
            if "AvailableQuantity" in data:
                stock.AvailableQuantity = int(data["AvailableQuantity"])

            if "Sellable_price" in data:
                stock.Sellable_price = data["Sellable_price"]
                stock.Sellable_qty_price = data["Sellable_price"]

            if "Current_Price" in data:
                stock.Current_Price = data["Current_Price"]

            if "Tax_Type" in data:
                stock.Tax_Type = data["Tax_Type"]

            if "Tax_Amount" in data:
                stock.Tax_Amount = data["Tax_Amount"]

            if "Batch_No" in data:
                stock.Batch_No = data["Batch_No"]

            if "editedby" in data:
                stock.Updated_by = data["editedby"]
            if "Tax_Percentage" in data:
                 stock.Tax_Percentage = data["Tax_Percentage"]
   

            if "Expiry_Date" in data and data["Expiry_Date"]:
                stock.Expiry_Date = datetime.strptime(data["Expiry_Date"], "%Y-%m-%d").date()

            # Expiry & recalculations done in save()
            stock.check_and_update_expiry_status()
            stock.save()

            return JsonResponse({
                "success": True,
                "message": "Stock updated successfully",
                "data": {
                    "id": stock.pk,
                    "Batch_No": stock.Batch_No,
                    "AvailableQuantity": stock.AvailableQuantity,
                    "Sellable_price": str(stock.Sellable_price),
                    "Sellable_qty_price": str(stock.Sellable_qty_price),
                    "Current_Price": str(stock.Current_Price),
                    "Current_Qunatity_Price": str(stock.Current_Qunatity_Price),
                    "MRP_Qunatity_Price": str(stock.MRP_Qunatity_Price),
                    "Tax_Type": stock.Tax_Type,
                    "Tax_Amount": str(stock.Tax_Amount),
                    "Expiry_Date": str(stock.Expiry_Date) if stock.Expiry_Date else None,
                    "Expiry_Status": stock.Expiry_Status,
                }
            }, status=200)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    return JsonResponse({"success": False, "error": "Only GET or POST allowed"}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def bulk_edit_stock(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        updates = data.get("updates", [])

        if not updates:
            return JsonResponse({"success": False, "error": "No updates provided"}, status=400)

        updated_records = []
        
        for item in updates:
            stock_id = item.get("id")
            if not stock_id:
                continue

            stock = get_object_or_404(Stock_Maintance_Table_Detials, id=stock_id)
           
            if "AvailableQuantity" in item:
                stock.AvailableQuantity = item["AvailableQuantity"]
                
            if "Sellable_qty_price" in item:
                # stock.Sellable_price = item["Sellable_price"]
                stock.Sellable_qty_price = item["Sellable_qty_price"]

            if "Current_Price" in item:
                stock.Current_Price = item["Current_Price"]

            if "Tax_Type" in item:
                stock.Tax_Type = item["Tax_Type"]

            if "Tax_Amount" in item:
                stock.Tax_Amount = item["Tax_Amount"]

            if "Batch_No" in item:
                stock.Batch_No = item["Batch_No"]
            if "BoxName" in item:
                stock.BoxName = item["BoxName"]

            if "editedby" in item:
                stock.Updated_by = item["editedby"]

            if "Expiry_Date" in item and item["Expiry_Date"]:
                stock.Expiry_Date = datetime.strptime(item["Expiry_Date"], "%Y-%m-%d").date()
            if "Tax_Percentage" in item:
                stock.Tax_Percentage = item["Tax_Percentage"]
         
            stock.check_and_update_expiry_status()
            stock.Update_Reason = 'Stock Edited'
            stock.Update_at = datetime.now()
            stock.save()

            updated_records.append({
    "id": stock.pk,
    "Batch_No": stock.Batch_No,
    "AvailableQuantity": stock.AvailableQuantity,
    # "Sellable_price": str(stock.Sellable_price),
    "Sellable_qty_price": str(stock.Sellable_qty_price),
    "Current_Price": str(stock.Current_Price),
    "Current_Qunatity_Price": str(stock.Current_Qunatity_Price),
    "MRP_Qunatity_Price": str(stock.MRP_Qunatity_Price),
    "Tax_Type": stock.Tax_Type,
    "BoxName": stock.BoxName,
    "Update_Reason": stock.Update_Reason,
    "Tax_Percentage": str(stock.Tax_Percentage),   # ✅ added
    "Tax_Amount": str(stock.Tax_Amount),
    "Expiry_Date": str(stock.Expiry_Date) if stock.Expiry_Date else None,
    "Expiry_Status": stock.Expiry_Status,
})


        return JsonResponse({
            "success": True,
            "message": f"{len(updated_records)} stock items updated successfully",
            "data": updated_records
        }, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)



@csrf_exempt
@require_http_methods(["GET"])
def list_stocks(request):
    item_name = request.GET.get("ItemName", "").strip() 
    batch_no = request.GET.get("Batch_No", "").strip()
    store_name = request.GET.get("Store_Name", "").strip()
    BoxName = request.GET.get("BoxName", "").strip()

    stocks = Stock_Maintance_Table_Detials.objects.all()

    if item_name:
        stocks = stocks.filter(Product_Detials__ItemName__icontains=item_name)
    if batch_no:
        stocks = stocks.filter(Batch_No__icontains=batch_no)
    if BoxName:
        stocks = stocks.filter(BoxName__icontains=BoxName)

    if store_name:
        stocks = stocks.filter(Store_location__Store_Name__icontains=store_name)

    stocks = stocks.order_by('Product_Detials__ItemName')

    data = []
    for stock in stocks:
        data.append({
    "id": stock.pk,
    "ItemName": stock.Product_Detials.ItemName,
    "Batch_No": stock.Batch_No,
    "AvailableQuantity": stock.AvailableQuantity,
    # "Sellable_price": str(stock.Sellable_price),
    "Sellable_qty_price": str(stock.Sellable_qty_price),
    "Current_Price": str(stock.Current_Price),
    "Current_Qunatity_Price": str(stock.Current_Qunatity_Price),
    "MRP_Qunatity_Price": str(stock.MRP_Qunatity_Price),
    "Tax_Type": stock.Tax_Type,
    "Tax_Percentage": str(stock.Tax_Percentage),   # ✅ added
    "Tax_Amount": str(stock.Tax_Amount),
    "Expiry_Date": str(stock.Expiry_Date) if stock.Expiry_Date else None,
    "Expiry_Status": stock.Expiry_Status,
    "Created_by": stock.Created_by,
    "Created_at": stock.Created_at,
    "Update_at": stock.Update_at,
    "Updated_by": stock.Updated_by,
    "Update_Reason":stock.Update_Reason,
    "Store_Name": stock.Store_location.Store_Name,
    "BoxName": stock.BoxName,
})

    return JsonResponse({"success": True, "data": data})



@csrf_exempt
@require_http_methods(["GET"])
def list_stocks1(request):
    item_name = request.GET.get("ItemName", "").strip()
    batch_no = request.GET.get("Batch_No", "").strip()
    Store_Id = request.GET.get("Store_Id", "").strip()
    BoxName = request.GET.get("BoxName", "").strip()

    stocks = Stock_Maintance_Table_Detials.objects.all()
    ins = None

    if item_name:
        stocks = stocks.filter(Product_Detials__ItemName__icontains=item_name)
    if batch_no:
        stocks = stocks.filter(Batch_No__icontains=batch_no)
    if BoxName:
        stocks = stocks.filter(BoxName__icontains=BoxName)
    if Store_Id:
        ins = Inventory_Location_Master_Detials.objects.filter(Store_Id=Store_Id).first()
        stocks = stocks.filter(Store_location=ins)

    # ⚠️ Order safely (NULLs won’t crash)
    stocks = stocks.select_related('Product_Detials', 'Store_location') \
                   .order_by('Product_Detials__ItemName')

    data = []
    skipped = []

    for stock in stocks:

        product = stock.Product_Detials  # may be None

        # 🛑 Product is NULL or missing
        if product is None:
            skipped.append({
                "stock_id": stock.id,
                "product_id": stock.Product_Detials_id,
                "reason": "Product is NULL or missing"
            })
            continue

        # ✅ Safe to use product now
        data.append({
            "id": stock.id,
            "ItemName": product.ItemName,
            "Batch_No": stock.Batch_No,
            "AvailableQuantity": stock.AvailableQuantity,
            "Sellable_qty_price": str(stock.Sellable_qty_price),
            "Current_Price": str(stock.Current_Price),
            "Current_Qunatity_Price": str(stock.Current_Qunatity_Price),
            "MRP_Qunatity_Price": str(stock.MRP_Qunatity_Price),
            "Tax_Type": stock.Tax_Type,
            "Tax_Percentage": str(stock.Tax_Percentage),
            "Tax_Amount": str(stock.Tax_Amount),
            "Expiry_Date": str(stock.Expiry_Date) if stock.Expiry_Date else None,
            "Expiry_Status": stock.Expiry_Status,
            "Created_by": stock.Created_by,
            "Created_at": stock.Created_at,
            "Update_at": stock.Update_at,
            "Updated_by": stock.Updated_by,
            "Store_Name": stock.Store_location.Store_Name if stock.Store_location else None,
            "BoxName": stock.BoxName,
        })

    return JsonResponse({
    "success": True,
    "counts": {
        "valid": len(data),
        "skipped": len(skipped)
    },
    "data": data,
    "skipped": skipped
})


@csrf_exempt
@require_http_methods(["POST"])
def delete_stock(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        stock_id = data.get("id")
        if not stock_id:
            return JsonResponse({"success": False, "error": "Stock id is required"}, status=400)

        stock = get_object_or_404(Stock_Maintance_Table_Detials, pk=stock_id)
        stock.delete()

        return JsonResponse({"success": True, "message": "Stock deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    



@csrf_exempt
@require_http_methods(['GET'])
def Store_Data_list(request):
    try:
       int1 = Inventory_Location_Master_Detials.objects.all()    

       data = []
       for i in int1:
           data.append({
               
               'Store_Id':i.Store_Id,
               'Store_Name':i.Store_Name,
               'Store_Type':i.Store_Type,

           })

       return JsonResponse(data,safe=False)   

    except Exception as e:
        return JsonResponse({'err':str(e)},safe=False)      
    

@csrf_exempt
@require_http_methods(['GET'])
def Store_Data_list_optical(request):
    try:
       int1 = Inventory_Location_Master_Detials.objects.filter(Store_Id__in=[9,10])    

       data = []
       for i in int1:
           data.append({
               
               'Store_Id':i.Store_Id,
               'Store_Name':i.Store_Name,
               'Store_Type':i.Store_Type,

           })

       return JsonResponse(data,safe=False)   

    except Exception as e:
        return JsonResponse({'err':str(e)},safe=False)      
    

@csrf_exempt
@require_http_methods(['GET'])
def Product_Data_list(request):
    try:
        products = Product_Master_All_Category_Details.objects.filter(Is_Optical=False)

        data = []
        for p in products:
            data.append({
                'Product_Id': p.pk,          # clearer than Store_Id
                'ItemName': p.ItemName,      # product name
              
            })

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({'err': str(e)}, safe=False)


@csrf_exempt
@require_http_methods(['GET'])
def Product_Data_list_Opticals(request):
    try:
        products = Product_Master_All_Category_Details.objects.filter(Is_Optical=True)

        data = []
        for p in products:
            data.append({
                'Product_Id': p.pk,          # clearer than Store_Id
                'ItemName': p.ItemName,      # product name
              
            })

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({'err': str(e)}, safe=False)


@csrf_exempt
@require_http_methods(['POST'])
def Add_Stock_Item(request):
    try:
        data = json.loads(request.body)

        # Validate required fields
        product_id = data.get('Product_Id')
        store_id = data.get('Store_Id')
        batch_no = data.get('Batch_No', '')
        available_qty = data.get('AvailableQuantity', 0)
        current_price = data.get('Current_Price', 0)
        sellable_price = data.get('Sellable_qty_price', 0)
        BoxName = data.get('BoxName', '')
        expiry_date_str = data.get('Expiry_Date', None)
        createdby = data.get('createdby', None)

        if not product_id or not store_id or sellable_price is None:
            return JsonResponse({'success': False, 'error': 'Product, Store, and Sellable Price are required!'})

        # Get product and store objects
        product = Product_Master_All_Category_Details.objects.filter(pk=product_id).first()
        store = Inventory_Location_Master_Detials.objects.filter(Store_Id=store_id).first()

        # Handle expiry date
        sts_exp = False
        expiry_date = None
        if expiry_date_str:
            try:
                # Accept both "YYYY-MM-DD" or "YYYY/MM/DD"
                expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d").date()
                sts_exp = True
            except ValueError:
                try:
                    expiry_date = datetime.strptime(expiry_date_str, "%Y/%m/%d").date()
                    sts_exp = True
                except ValueError:
                    return JsonResponse({'success': False, 'error': 'Invalid Expiry_Date format. Use YYYY-MM-DD.'})

        # Create new stock entry
        Stock_Maintance_Table_Detials.objects.create(
            Product_Detials=product,
            Batch_No=batch_no,
            AvailableQuantity=available_qty,
            Current_Price=current_price,
            Created_by = createdby,
            # Sellable_price=sellable_price,
            Sellable_qty_price=sellable_price,
            Update_Reason = 'Stock Added',
            BoxName=BoxName,
            Store_location=store,
            Is_Expiry_Date_Available=sts_exp,
            Expiry_Date=expiry_date
        )

        return JsonResponse({'success': True, 'message': 'Stock added successfully!'})

    except Product_Master_All_Category_Details.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Invalid Product ID'})
    except Inventory_Location_Master_Detials.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Invalid Store ID'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})