import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q,F, ExpressionWrapper, FloatField

from django.db import transaction
from .models import *
from io import BytesIO
from PIL import Image
import base64

from django.db.models import Sum, Q 
from PyPDF2 import PdfReader, PdfWriter
# import magic
from Masters.models import *
from DrugAdminstrations.models import *
from django.db import transaction
from django.db.models.functions import Lower, Replace, Cast
from django.db.models import IntegerField, CharField, Value
import pandas as pd



@csrf_exempt
@require_http_methods(["GET"])
def Manufacturer_Names_link(request):
    try:
        ProductCategory = request.GET.get("Productname", "").strip()
        Subcategory = request.GET.get("Subcategory", "").strip()
        CompanyName = request.GET.get("CompanyName", "").strip().lower()  # Convert input to lowercase

     

        # Build filter dictionary dynamically
        filters = {}
        if ProductCategory:
            filters["ProductCategory"] = ProductCategory
        if Subcategory:
            filters["SubProductCategory"] = Subcategory
        if CompanyName:
            filters["CompanyName__istartswith"] = CompanyName  # Case-insensitive search

        # Fetch data using filters
        Manufacturer_Names = CompanyName_mfg_Master_Details.objects.filter(**filters)[:20]
        print("Manufacturer_Names:", Manufacturer_Names)

        # Convert QuerySet to JSON format
        companyname_data = [
            {
                "id": company.CompanyName_Id,
                "CompanyName": company.CompanyName
            }
            for company in Manufacturer_Names
        ]
        return JsonResponse(companyname_data, safe=False)

    except Exception as e:
        print(f"Error: {e}")  # Debugging log
        return JsonResponse({"error": "An internal server error occurred"}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def ItemNames_for_RepMaster(request):
    try:
        ProductCategory = request.GET.get("Productname")
        Subcategory = request.GET.get("Subcategory")
        ItemName = request.GET.get("ItemName", "").strip().lower()

        print("ProductCategory:", ProductCategory)
        print("Subcategory:", Subcategory)
        print("ItemName:", ItemName)

        filters = {}

        if ProductCategory:
            filters["ProductCategory"] = ProductCategory
        if Subcategory:
            filters["SubCategory"] = Subcategory
        if ItemName:
            filters["ItemName__istartswith"] = ItemName  # Case-insensitive search

        # Fetch filtered data
        ItemNames = Product_Master_All_Category_Details.objects.filter(**filters)[:20]

      

        item_data = [
            {
                "id": product.id,
                "ItemName": product.ItemName
            }
            for product in ItemNames
        ]

        return JsonResponse(item_data, safe=False)


    
    except Exception as e:
        print(f"Error: {e}")  # Debugging log
        return JsonResponse({"error": "An internal server error occurred"}, status=500)



@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def MedicalRep_Details_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data", data)

            SelectedDataList = data.get('SelectedDataList', [])
            RepName = data.get('RepName', '')
            RepPhonenumber = data.get('RepPhonenumber', '')
            RepDoorno = data.get('RepDoorno', '')
            RepCompanyName = data.get('RepCompanyName', '')
            RepArea = data.get('RepArea', '')
            RepCity = data.get('RepCity', '')
            RepDistrict = data.get('RepDistrict', '')
            RepCountry = data.get('RepCountry', '')
            RepPincode = data.get('RepPincode', '')
            RepState = data.get('RepState', '')
            RepStreet = data.get('RepStreet', '')
            created_by = data.get('created_by', '')
            location = data.get('location', '')

            location_ins = None
            if location:
                try:
                    location_ins = Location_Detials.objects.get(Location_Id=location)
                except Location_Detials.DoesNotExist:
                    return JsonResponse({'warn': 'Location not found'})

            # Check if the Medical Rep already exists
            if Medical_Rep_Master.objects.filter(Rep_Name=RepName, Rep_PhoneNumber=RepPhonenumber).exists():
                return JsonResponse({'warn': f"The Rep {RepName} with phone number {RepPhonenumber} already exists"})


            # Create Medical Rep Master
            medical_repmaster = Medical_Rep_Master.objects.create(
                Rep_Name=RepName,
                Rep_PhoneNumber=RepPhonenumber,
                Rep_CompanyName=RepCompanyName,
                Rep_DoorNo=RepDoorno,
                Rep_Street=RepStreet,
                Rep_Area=RepArea,
                Rep_City=RepCity,
                Rep_District=RepDistrict,
                Rep_State=RepState,
                Rep_Pincode=RepPincode,
                Rep_Country=RepCountry,
                created_by=created_by,
                Location=location_ins
            )

            for item in SelectedDataList:
                ProductCategoryName = item.get('ProductCategoryName')
                SubProductCategoryName = item.get('SubProductCategoryName')
                CompanyId = item.get('CompanyId')
                GenericId = item.get('GenericId')
                ItemName = item.get('GenericName', '')
                CompanyName = item.get('CompanyName', '')
                SupplierId = item.get('SupllierId')
                SupplierName = item.get('SupplierName', '')
                Rate = item.get('Rate',0)

                if not ProductCategoryName:
                    return JsonResponse({'warn': 'ProductCategory not found'})

                if not SubProductCategoryName:
                    return JsonResponse({'warn': 'SubCategory not found'})

                try:
                    ProductCategory_instance = Product_Category_Product_Details.objects.get(pk=ProductCategoryName)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'warn': "ProductCategory ID not found"})

                try:
                    Sub_ProductCategory_instance = SubCategory_Detailes.objects.get(pk=SubProductCategoryName)
                except SubCategory_Detailes.DoesNotExist:
                    return JsonResponse({'warn': 'SubProduct Category not found'})

                # Handling Company Name
                if CompanyId and isinstance(CompanyId, int): 
                    try:
                        company_ins = CompanyName_mfg_Master_Details.objects.get(
                            ProductCategory=ProductCategory_instance,
                            SubProductCategory=Sub_ProductCategory_instance,
                            CompanyName_Id=CompanyId  
                        )
                    except CompanyName_mfg_Master_Details.DoesNotExist:
                        return JsonResponse({'warn': 'Company not found'})
                else:
                    if not CompanyName:
                        return JsonResponse({'warn': 'Company name is required for new entries'})
                    
                    company_ins = CompanyName_mfg_Master_Details.objects.create(
                        ProductCategory=ProductCategory_instance,
                        SubProductCategory=Sub_ProductCategory_instance,
                        CompanyName=CompanyName,
                        Create_by=created_by,
                    )

                # Handling Product Master
                if GenericId:
                    try:
                        item_ins = Product_Master_All_Category_Details.objects.get(
                            pk=GenericId, 
                            ProductCategory=ProductCategory_instance, 
                            SubCategory=Sub_ProductCategory_instance
                        )
                    except Product_Master_All_Category_Details.DoesNotExist:
                        return JsonResponse({'warn': 'Generic Product not found'})
                else:
                    item_ins = Product_Master_All_Category_Details.objects.create(
                        ItemName=ItemName,
                        ProductCategory=ProductCategory_instance,
                        SubCategory=Sub_ProductCategory_instance,
                        CompanyName=company_ins
                    )
                
                if SupplierId:
                    try:
                        supplier_ins = Supplier_Master_Details.objects.get(Supplier_Id = SupplierId)
                    
                    except Supplier_Master_Details.DoesNotExist:
                        return JsonResponse({'warn': 'Supplier  not found'})
                else:
                    supplier_ins = Supplier_Master_Details.objects.create(
                        Supplier_Name=SupplierName,
                        created_by=created_by,
                    )
                # Create Medical Rep Item Entry
                MedicalRep_ItemName_Table.objects.create(
                    Medical_Rep=medical_repmaster,
                    ItemName=item_ins,
                    CompanyName=company_ins,
                    SupplierName=supplier_ins,
                    Rate=Rate
                )

                if Supplier_Product_Details.objects.filter(Supplier_Detials=supplier_ins, Product_Detials=item_ins ).exists():
                    continue
                else:
                    supp_prod_inss = Supplier_Product_Details.objects.create(
                        Supplier_Detials=supplier_ins,
                        Product_Detials=item_ins,
                        created_by=created_by
                    )

                    
            return JsonResponse({'success': 'Medical Rep saved successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred', 'details': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Medical_Rep(request):
    try:
        medical_reps = Medical_Rep_Master.objects.all()
        MedicalRep_Data = []

        for idss, medicalrep in enumerate(medical_reps, start=1):
            medicalrep_dict = {
                'id': idss,
                'MedicalRepId': medicalrep.Rep_Id,
                'MedicalRep_Name': medicalrep.Rep_Name,
                'MedicalRep_PhoneNumber': medicalrep.Rep_PhoneNumber,
                'MedicalRep_CompanyName': medicalrep.Rep_CompanyName,
                'SelectedDatalist': []
            }

            medical_items = MedicalRep_ItemName_Table.objects.filter(Medical_Rep=medicalrep)
            for sids, res in enumerate(medical_items, start=1):
                items = {
                    'id': sids,
                    'CompanyName': res.CompanyName.CompanyName,
                    'BrandName': res.ItemName.ItemName,
                    'ProductCategoryCompanyName': res.CompanyName.ProductCategory.ProductCategory_Name,
                    'SubProductCategoryCompanyName': res.CompanyName.SubProductCategory.SubCategoryName,
                    'ProductCategoryCompanyNameBrandName': res.ItemName.ProductCategory.ProductCategory_Name,
                    'SubProductCategoryCompanyNameBrandName': res.ItemName.SubCategory.SubCategoryName,
                    'SupplierName': getattr(res.SupplierName, 'Supplier_Name', None),
                    'Rate':res.Rate


                }
                medicalrep_dict['SelectedDatalist'].append(items)

            MedicalRep_Data.append(medicalrep_dict)



        return JsonResponse(MedicalRep_Data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@require_http_methods(["GET"])
def all_supplier_details_link(request):
    try:
        medical_reps = Supplier_Master_Details.objects.values('Supplier_Id', 'Supplier_Name')

        medical_rep_data = [
            {'id': medicalrep['Supplier_Id'], 'Supplier_Name': medicalrep['Supplier_Name']}
            for medicalrep in medical_reps
        ]

        return JsonResponse(medical_rep_data, safe=False)

    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)


@csrf_exempt
def Medical_RepMaster_File_Upload(request):
    try:
        file = request.FILES.get("file")
        created_by = request.POST.get("created_by")
        location = request.POST.get('location')
        location_instance =None
        if location:
            try:
                location_instance = Location_Detials.objects.get(Location_Id=location)
            except Location_Detials.DoesNotExist:
                return JsonResponse({'warn': 'Location not found'})

        if file.name.endswith(".csv"):
            df = pd.read_csv(file, encoding="utf-8", encoding_errors="ignore")  # Handle encoding errors
        elif file.name.endswith(".xlsx"):
            df = pd.read_excel(file, engine="openpyxl")
        else:
            return JsonResponse({"error": "Unsupported file format. Please upload a CSV or Excel file"}, status=400)
 
 
        for col in df.select_dtypes(include=["object"]):  
            df[col] = df[col].str.replace("\xa0", " ").str.strip()
 

        csv_dataone = df.to_dict(orient="records")
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
            filter_conditions = {}
            for key, value in filters.items():
                if value:
                    filter_conditions[key] = value
            instance = model.objects.filter(**filter_conditions).first()
            if instance is not None and any(getattr(instance, field, None) for field in ['RepName', 'CompanyName','SupplierName', 'SubCategoryName', 'ItemName','ProductCategory_Name']):
                if hasattr(instance, 'Rep_Id'):
                    return instance.Rep_Id
                elif hasattr(instance, 'CompanyName_Id'):
                    return instance.CompanyName_Id
                elif hasattr(instance, 'Supplier_Id'):
                    return instance.Supplier_Id
                elif hasattr(instance, 'SubCategory_Id'):
                    return instance.SubCategory_Id
                    
                elif hasattr(instance, 'pk'):
                    return instance.pk
                return instance
            else:
                instance = model.objects.create(**{**filters, **defaults})

                if hasattr(instance, 'Rep_Id'):
                    return instance.Rep_Id
                elif hasattr(instance, 'CompanyName_Id'):
                    return instance.CompanyName_Id
                elif hasattr(instance, 'Supplier_Id'):
                    return instance.Supplier_Id
                elif hasattr(instance, 'SubCategory_Id'):
                    return instance.SubCategory_Id
                elif hasattr(instance, 'pk'):
                    return instance.pk
                return instance
                

        for row in csv_dataone:
            # print("row-------------", row)

            productcategory = None
            if row["ProductCategory"] != '' and row["ProductCategory"] is not None:
                productcategory = get_or_create_foreign_key(
                    Product_Category_Product_Details,
                    filters={"ProductCategory_Name": row["ProductCategory"]},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True          
                )
            

            if row["SubCategory"] != '' and row["SubCategory"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                
                sub_category = get_or_create_foreign_key(
                    SubCategory_Detailes,
                    filters={"SubCategoryName": row["SubCategory"], "ProductCategoryId": productcategory_instance},
                    defaults={"Status": True, "Created_by": created_by},
                    return_existing_code=True
                )
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)
            
            supplier_instance = None

            if row["SupplierName"] !='' and row["SupplierName"] is not None:
                supplier_instance = get_or_create_foreign_key(
                    Supplier_Master_Details,
                    filters={"Supplier_Name": row["SupplierName"]},
                    defaults={"Status": True, "created_by": created_by},
                    return_existing_code=True

                )
                supplier_master_instance=Supplier_Master_Details.objects.get(Supplier_Id = supplier_instance )
            company_name = None

            if row["CompanyName"] != '' and row["CompanyName"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)

                company_name = get_or_create_foreign_key(
                    CompanyName_mfg_Master_Details,
                    filters={"CompanyName": row["CompanyName"], "ProductCategory": productcategory_instance, "SubProductCategory": sub_productcategory_instance},
                    defaults={"Status":True, "Create_by": created_by},
                    return_existing_code=True
                )
                company_name_instance = CompanyName_mfg_Master_Details.objects.get(CompanyName_Id=company_name)

            item_name = None

            if row["ItemName"] !='' and row["ItemName"] is not None:
                productcategory_instance = Product_Category_Product_Details.objects.get(pk=productcategory)
                sub_productcategory_instance = SubCategory_Detailes.objects.get(SubCategory_Id=sub_category)

                item_name = get_or_create_foreign_key(
                    Product_Master_All_Category_Details,
                    filters={"ItemName": row["ItemName"], "ProductCategory": productcategory_instance, "SubCategory": sub_productcategory_instance,"CompanyName":company_name_instance},
                    defaults={"Status":True, "created_by": created_by},
                    return_existing_code=True
                )
                item_name_instance = Product_Master_All_Category_Details.objects.get(pk=item_name)
                # print("item_name_instance-------------",item_name_instance)
                
            

                rep_name_cleaned = row.get("RepName", "").replace(" ", "").lower()
                rep_phone_cleaned = row.get("RepPhoneNumber", "")
                existing_rep = Medical_Rep_Master.objects.annotate(
                    cleaned_rep_name=Lower(Replace("Rep_Name", Value(" "), Value("")))
                ).filter(
                    cleaned_rep_name=rep_name_cleaned, 
                    Rep_PhoneNumber__iexact=rep_phone_cleaned
                ).first()

                

                
                if not existing_rep:
                    rep_instance = Medical_Rep_Master.objects.create(
                        Rep_Name=row.get("RepName"),
                        Rep_PhoneNumber=row.get("RepPhoneNumber"),
                        Rep_CompanyName=row.get("RepCompanyName"),
                        Rep_DoorNo=row.get("RepDoorNo"),
                        Rep_Street=row.get("RepStreet"),
                        Rep_Area=row.get("RepArea"),
                        Rep_City=row.get("RepCity"),
                        Rep_District=row.get("RepDistrict"),
                        Rep_State=row.get("RepState"),
                        Rep_Pincode=row.get("RepPincode"),
                        Rep_Country=row.get("RepCountry"),
                        created_by=created_by,
                        Location=location_instance
                    )
                else:
                    rep_instance = existing_rep
                
                existing_medical_item = MedicalRep_ItemName_Table.objects.annotate(
                    cleaned_item_name=Lower(Replace("ItemName__ItemName", Value(" "), Value(""))),
                    cleaned_company_name=Lower(Replace("CompanyName__CompanyName", Value(" "), Value("")))
                ).filter(
                    Medical_Rep=rep_instance,
                    cleaned_item_name=item_name_instance.ItemName.replace(" ", "").lower(),
                    cleaned_company_name=company_name_instance.CompanyName.replace(" ", "").lower()
                ).exists()

                
                if not existing_medical_item:
                    MedicalRep_ItemName_Table.objects.create(
                        Medical_Rep=rep_instance,
                        ItemName_id=item_name_instance.pk,
                        CompanyName_id=company_name_instance.pk,
                        SupplierName_id=supplier_master_instance.pk
                    )
                
                    existing_supplier_product = Supplier_Product_Details.objects.annotate(
                        cleaned_supplier_name=Lower(Replace("Supplier_Detials__Supplier_Name", Value(" "), Value(""))),
                        cleaned_product_name=Lower(Replace("Product_Detials__ItemName", Value(" "), Value("")))
                    ).filter(
                        cleaned_supplier_name=supplier_master_instance.Supplier_Name.replace(" ", "").lower(),
                        cleaned_product_name=item_name_instance.ItemName.replace(" ", "").lower()
                    ).exists()

                if not existing_supplier_product:
                    Supplier_Product_Details.objects.create(
                        Supplier_Detials_id=supplier_master_instance.pk,
                        Product_Detials_id=item_name_instance.pk,
                        created_by=created_by
                    )
        
        return JsonResponse({'success': 'Medical RepMaster file uploaded successfully'})
    except Exception as e:
        print(f"Error occurred: {e}")
        return JsonResponse({'warn': f'An internal server error occurred: {str(e)}'}, status=500)

# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def get_itpurem_details_batchwiseExpiryStatus(request):
#     try:
#         Status = request.GET.get('Status')
#         ItemName = request.GET.get('ItemName')
#         BatchNumber = request.GET.get('BatchNumber')
#         SupplierName = request.GET.get('SupplierName')
#         ExpiryDateFrom = request.GET.get('ExpiryDateFrom')
#         ExpiryDateTo = request.GET.get('ExpiryDateTo')
#         StoreLocation = request.GET.get('StoreLocation')

#         print("Received StoreLocation:", StoreLocation)

#         batch_data = []
#         query = Q()

#         # Handle StoreLocation filtering
#         if StoreLocation:
#             try:
#                 StoreLocation = int(StoreLocation)
#                 query &= Q(Store_location__Store_Id=StoreLocation)
#             except ValueError:
#                 print("Invalid StoreLocation:", StoreLocation)

#         # Handle expiry status filtering
#         if Status == 'All':
#             query &= Q(Expiry_Status__in=['90 Days Expiry', '60 Days Expiry', '30 Days Expiry'])
#         elif Status:
#             query &= Q(Expiry_Status=Status)

#         # Handle other filters
#         if ItemName:
#             query &= Q(Product_Detials__ItemName__icontains=ItemName)
#         if BatchNumber:
#             query &= Q(Batch_No__icontains=BatchNumber)
#         if SupplierName:
#             query &= Q(Grn_Details_Item__Grn_Detials__Supplier_Detials__Supplier_Name__icontains=SupplierName)

#         # Convert date filters
#         if ExpiryDateFrom:
#             ExpiryDateFrom = datetime.strptime(ExpiryDateFrom, '%Y-%m-%d').date()
#         if ExpiryDateTo:
#             ExpiryDateTo = datetime.strptime(ExpiryDateTo, '%Y-%m-%d').date()

#         if ExpiryDateFrom and ExpiryDateTo:
#             query &= Q(Expiry_Date__range=[ExpiryDateFrom, ExpiryDateTo])
#         elif ExpiryDateFrom:
#             query &= Q(Expiry_Date__gte=ExpiryDateFrom)
#         elif ExpiryDateTo:
#             query &= Q(Expiry_Date__lte=ExpiryDateTo)

#         # Fetch filtered data
#         batchwise_items = Stock_Maintance_Table_Detials.objects.filter(query)
#         print('batchwise_items---------', batchwise_items)
#         index = 1

#         for item in batchwise_items:
#             expiry_date = item.Expiry_Date.date() if isinstance(item.Expiry_Date, datetime) else item.Expiry_Date
#             today = datetime.now().date()
#             days_to_expiry = (expiry_date - today).days if expiry_date else None
#             expiry_date_str = expiry_date.strftime('%Y-%m-%d') if expiry_date else None

#             item_dict = {
#                 'id': index,
#                 'Pk': item.pk,
#                 'ProductCategory': item.Product_Detials.ProductCategory.ProductCategory_Name if item.Product_Detials else None,
#                 'SubCategory': item.Product_Detials.SubCategory.SubCategoryName if item.Product_Detials else None,
#                 'GRNNumber':item.Grn_Details_Item.Grn_Detials.pk,
#                 'GRNDate':item.Grn_Details_Item.Grn_Detials.GrnDate.strftime('%d-%m-%Y') if item.Grn_Details_Item.Grn_Detials.GrnDate else None,
#                 'SupplierName': item.Grn_Details_Item.Grn_Detials.Supplier_Detials.Supplier_Name if item.Grn_Details_Item else None,
#                 'ItemCode': item.Product_Detials.pk if item.Product_Detials else None,
#                 'ItemName': item.Product_Detials.ItemName if item.Product_Detials else None,
#                 'ProductType': item.Product_Detials.ProductType.ProductType_Name if item.Product_Detials else None,
#                 'BatchNo': item.Batch_No,
#                 'DaysToExpiry': days_to_expiry,
#                 'ExpiryDate': expiry_date_str,
#                 'AvailableQuantity': item.AvailableQuantity if item.AvailableQuantity else 0,
#                 'Status': item.Expiry_Status
#             }
#             batch_data.append(item_dict)
#             index += 1

#         return JsonResponse(batch_data, safe=False)

#     except Exception as e:
#         print(str(e))  # Log the exception for debugging
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)
from django.db.models import Case, When, CharField

# @csrf_exempt
# @require_http_methods(["GET", "OPTIONS"])
# def get_item_details_batchwiseExpiryStatus(request):
#     try:
#         Status = request.GET.get('Status')
#         print('Status----',Status)
#         ItemName = request.GET.get('ItemName')
#         print('ItemName-----', ItemName)
#         BatchNumber = request.GET.get('BatchNumber')
#         print('BatchNumber---',BatchNumber)
#         SupplierName = request.GET.get('SupplierName')
#         print('SupplierName---',SupplierName)
#         ExpiryDateFrom = request.GET.get('ExpiryDateFrom')
#         print('ExpiryDateFrom----',ExpiryDateFrom)
#         ExpiryDateTo = request.GET.get('ExpiryDateTo')
#         print('ExpiryDateTo---',ExpiryDateTo)
#         StoreLocation = request.GET.get('StoreLocation')

      
#         batch_data = []
#         Reasonone = "ExpiredReturn"
#         query = Q()

#         # Handle StoreLocation filtering
#         if StoreLocation:
#             try:
#                 StoreLocation = int(StoreLocation)
#                 query &= Q(Store_location__Store_Id=StoreLocation)
#             except ValueError:
#                 print("Invalid StoreLocation:", StoreLocation)

#         # Handle expiry status filtering
#         if Status == 'All':
#             query &= Q(Expiry_Status__in=['90 Days Expiry', '60 Days Expiry', '30 Days Expiry'])
#         elif Status:
#             query &= Q(Expiry_Status=Status)

#         # Handle other filters
#         if ItemName:
#             query &= Q(Product_Detials__ItemName__icontains=ItemName)
#         if BatchNumber:
#             query &= Q(Batch_No__icontains=BatchNumber)
#         if SupplierName:
#             query &= Q(Grn_Details_Item__Grn_Detials__Supplier_Detials__Supplier_Name__icontains=SupplierName)

#         # Convert date filters
#         if ExpiryDateFrom:
#             ExpiryDateFrom = datetime.strptime(ExpiryDateFrom, '%Y-%m-%d').date()
#         if ExpiryDateTo:
#             ExpiryDateTo = datetime.strptime(ExpiryDateTo, '%Y-%m-%d').date()

#         if ExpiryDateFrom and ExpiryDateTo:
#             query &= Q(Expiry_Date__range=[ExpiryDateFrom, ExpiryDateTo])
#         elif ExpiryDateFrom:
#             query &= Q(Expiry_Date__gte=ExpiryDateFrom)
#         elif ExpiryDateTo:
#             query &= Q(Expiry_Date__lte=ExpiryDateTo)

#         # Define custom ordering
#         expiry_ordering = Case(
#             When(Expiry_Status='30 Days Expiry', then=1),
#             When(Expiry_Status='60 Days Expiry', then=2),
#             When(Expiry_Status='90 Days Expiry', then=3),
#             default=4,
#             output_field=CharField()
#         )

#         # Fetch filtered and ordered data
#         batchwise_items = Stock_Maintance_Table_Detials.objects.filter(query, AvailableQuantity__gt=0).order_by(expiry_ordering)
#         print('batchwise_items---------', batchwise_items)
#         index = 1

#         for item in batchwise_items:
#             expiry_date = item.Expiry_Date.date() if isinstance(item.Expiry_Date, datetime) else item.Expiry_Date
#             today = datetime.now().date()
#             days_to_expiry = (expiry_date - today).days if expiry_date else None
#             expiry_date_str = expiry_date.strftime('%Y-%m-%d') if expiry_date else None

#             grn_item = item.Grn_Details_Item
#             grn_details = grn_item.Grn_Detials if grn_item else None
#             supplier = grn_details.Supplier_Detials if grn_details else None

#             item_dict = {
#                 'id': index,
#                 'Pk': item.pk,
#                 'ProductCategory': item.Product_Detials.ProductCategory.ProductCategory_Name if item.Product_Detials and item.Product_Detials.ProductCategory else '',
#                 'SubCategory': item.Product_Detials.SubCategory.SubCategoryName if item.Product_Detials and item.Product_Detials.SubCategory else '',
#                 'GRNNumber': grn_details.pk if grn_details else '',
#                 'GRNDate': grn_details.GrnDate.strftime('%d-%m-%Y') if grn_details and grn_details.GrnDate else '',
#                 'SupplierCode': supplier.pk if supplier else '',
#                 'SupplierName': supplier.Supplier_Name if supplier else '',
#                 'SupplierMailId': supplier.Email_Address if supplier else '',
#                 'SupplierContactNumber': supplier.Contact_Number if supplier else '',
#                 'SupplierContactPerson': supplier.Contact_Person if supplier else '',
#                 'ItemCode': item.Product_Detials.pk if item.Product_Detials else '',
#                 'ItemName': item.Product_Detials.ItemName if item.Product_Detials else '',
#                 'ProductType': item.Product_Detials.ProductType.ProductType_Name if item.Product_Detials and item.Product_Detials.ProductType else '',
#                 'BatchNo': item.Batch_No,
#                 'DaysToExpiry': days_to_expiry,
#                 'ExpiryDate': expiry_date_str,
#                 'AvailableQuantity': item.AvailableQuantity if item.AvailableQuantity else 0,
#                 'Status': item.Expiry_Status,
#                 'StoreLocation': item.Store_location.Store_Id if item.Store_location else '',
#                 'Location': item.Store_location.Location_Name.Location_Id if item.Store_location and item.Store_location.Location_Name else '',
#                 'Reason': Reasonone
#             }

#             batch_data.append(item_dict)
#             index += 1

#         return JsonResponse(batch_data, safe=False)

#     except Exception as e:
#         print(str(e))  # Log the exception for debugging
#         return JsonResponse({'error': 'An internal server error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_item_details_batchwiseExpiryStatus(request):
    try:
        Status = request.GET.get('Status')
        ItemName = request.GET.get('ItemName')
        BatchNumber = request.GET.get('BatchNumber')
        SupplierName = request.GET.get('SupplierName')
        ExpiryDateFrom = request.GET.get('ExpiryDateFrom')
        ExpiryDateTo = request.GET.get('ExpiryDateTo')
        StoreLocation = request.GET.get('StoreLocation')

        Reasonone = "ExpiredReturn"
        batch_data = []
        query = Q(AvailableQuantity__gt=0, Is_Expiry_Date_Available=True)

        # Store Location
        if StoreLocation:
            try:
                query &= Q(Store_location__Store_Id=int(StoreLocation))
            except ValueError:
                pass

        # Other filters
        if ItemName:
            query &= Q(Product_Detials__ItemName__icontains=ItemName)
        if BatchNumber:
            query &= Q(Batch_No__icontains=BatchNumber)
        if SupplierName:
            query &= Q(
                Grn_Details_Item__Grn_Detials__Supplier_Detials__Supplier_Name__icontains=SupplierName
            )

        # Expiry date range
        if ExpiryDateFrom:
            ExpiryDateFrom = datetime.strptime(ExpiryDateFrom, '%Y-%m-%d').date()
            query &= Q(Expiry_Date__gte=ExpiryDateFrom)

        if ExpiryDateTo:
            ExpiryDateTo = datetime.strptime(ExpiryDateTo, '%Y-%m-%d').date()
            query &= Q(Expiry_Date__lte=ExpiryDateTo)

        # Fetch data (NO Expiry_Status usage)
        items = Stock_Maintance_Table_Detials.objects.filter(query).select_related(
            'Product_Detials',
            'Store_location',
            'Grn_Details_Item__Grn_Detials__Supplier_Detials'
        )

        today = timezone.now().date()
        index = 1

        for item in items:
            if not item.Expiry_Date:
                continue

            days_to_expiry = (item.Expiry_Date - today).days

            # Dynamic expiry status
            if days_to_expiry < 0:
                expiry_status = 'Expired'
            elif days_to_expiry <= 30:
                expiry_status = '30 Days Expiry'
            elif days_to_expiry <= 60:
                expiry_status = '60 Days Expiry'
            elif days_to_expiry <= 90:
                expiry_status = '90 Days Expiry'
            else:
                expiry_status = 'Not-Expired'

            # Status filter
            if Status and Status != 'All' and Status != expiry_status:
                continue

            grn_item = item.Grn_Details_Item
            grn = grn_item.Grn_Detials if grn_item else None
            supplier = grn.Supplier_Detials if grn else None

            batch_data.append({
                'id': index,
                'Pk': item.pk,
                'ItemName': item.Product_Detials.ItemName if item.Product_Detials else '',
                'BatchNo': item.Batch_No,
                'ExpiryDate': item.Expiry_Date.strftime('%Y-%m-%d'),
                'DaysToExpiry': days_to_expiry,
                'Status': expiry_status,   # 👈 Dynamic
                'AvailableQuantity': item.AvailableQuantity or 0,
                'SupplierName': supplier.Supplier_Name if supplier else '',
                'StoreLocation': item.Store_location.Store_Id if item.Store_location else '',
                'Reason': Reasonone
            })

            index += 1

        return JsonResponse(batch_data, safe=False)

    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Internal server error'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Supplier_Data_Get(request):
    try:
        # Extract GET parameters
        ForQuickGrn = request.GET.get('ForQuickGrn', 'false').lower() == 'true'
        SupplierCode = request.GET.get('SupplierCode')
        SupplierName = request.GET.get('SupplierName')

        # Case 1: Fetch a specific supplier by SupplierCode
        if not ForQuickGrn and SupplierCode:
            try:
                Supplier_Master_instance = Supplier_Master_Details.objects.get(pk=SupplierCode)
                dic = {
                    'id': Supplier_Master_instance.Supplier_Id,
                    'SupplierName': Supplier_Master_instance.Supplier_Name,
                    'SupplierType': Supplier_Master_instance.Supplier_Type if Supplier_Master_instance.Supplier_Type is not None else "",
                    'ContactPerson': Supplier_Master_instance.Contact_Person if Supplier_Master_instance.Contact_Person is not None else "",
                    'ContactNumber': Supplier_Master_instance.Contact_Number if Supplier_Master_instance.Contact_Number is not None else "",
                    'EmailAddress': Supplier_Master_instance.Email_Address if Supplier_Master_instance.Email_Address is not None else "",
                    'Address': Supplier_Master_instance.Address if Supplier_Master_instance.Address is not None else "",
                    'RegistrationNumber': Supplier_Master_instance.Registration_Number if Supplier_Master_instance.Registration_Number is not None else "",
                    'GSTNumber': Supplier_Master_instance.GST_Number if Supplier_Master_instance.GST_Number is not None else "",
                    'PANNumber': Supplier_Master_instance.PAN_Number if Supplier_Master_instance.PAN_Number is not None else "",
                    'PaymentTerms': Supplier_Master_instance.Payment_Terms if Supplier_Master_instance.Payment_Terms is not None else "",
                    'CreditLimit': Supplier_Master_instance.Credit_Limit if Supplier_Master_instance.Credit_Limit is not None else "",
                    'LeadTime': Supplier_Master_instance.DeliveryDuration if Supplier_Master_instance.DeliveryDuration is not None else "",
                    'Status': 'Active' if Supplier_Master_instance.Status else 'Inactive',
                    'Notes': Supplier_Master_instance.Notes if Supplier_Master_instance.Notes is not None else "",
                }
                return JsonResponse(dic, safe=False)


            except Supplier_Master_Details.MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple suppliers found with this code'})

        # Case 2: Fetch multiple suppliers for quick GRN search
        elif ForQuickGrn:
            filterQuery = Q(Status=True)
            if SupplierCode:
                filterQuery &= Q(pk__icontains=SupplierCode)
            if SupplierName:
                filterQuery &= Q(Supplier_Name__icontains=SupplierName)

            Supplier_Master_instances = Supplier_Master_Details.objects.filter(filterQuery)
            Supplier_Array = [
                {
                    'id': row.pk,
                    'SupplierName': row.Supplier_Name,
                    'ContactNo': row.Contact_Number,
                } for row in Supplier_Master_instances
            ]

            return JsonResponse(Supplier_Array, safe=False)

        return JsonResponse({'error': 'Invalid request parameters'}, status=400)

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def Supplier_Data_Get_GEN(request):
    try:
        # Extract GET parameters
        ForQuickGrn = request.GET.get('ForQuickGrn', 'false').lower() == 'true'
        SupplierCode = request.GET.get('SupplierCode')
        SupplierName = request.GET.get('SupplierName')

        # Case 1: Fetch a specific supplier by SupplierCode
        if not ForQuickGrn and SupplierCode:
            try:
                Supplier_Master_instance = Supplier_Master_Details.objects.get(pk=SupplierCode)
                dic = {
                    'id': Supplier_Master_instance.Supplier_Id,
                    'SupplierName': Supplier_Master_instance.Supplier_Name,
                    'SupplierType': Supplier_Master_instance.Supplier_Type if Supplier_Master_instance.Supplier_Type is not None else "",
                    'ContactPerson': Supplier_Master_instance.Contact_Person if Supplier_Master_instance.Contact_Person is not None else "",
                    'ContactNumber': Supplier_Master_instance.Contact_Number if Supplier_Master_instance.Contact_Number is not None else "",
                    'EmailAddress': Supplier_Master_instance.Email_Address if Supplier_Master_instance.Email_Address is not None else "",
                    'Address': Supplier_Master_instance.Address if Supplier_Master_instance.Address is not None else "",
                    'RegistrationNumber': Supplier_Master_instance.Registration_Number if Supplier_Master_instance.Registration_Number is not None else "",
                    'GSTNumber': Supplier_Master_instance.GST_Number if Supplier_Master_instance.GST_Number is not None else "",
                    'PANNumber': Supplier_Master_instance.PAN_Number if Supplier_Master_instance.PAN_Number is not None else "",
                    'PaymentTerms': Supplier_Master_instance.Payment_Terms if Supplier_Master_instance.Payment_Terms is not None else "",
                    'CreditLimit': Supplier_Master_instance.Credit_Limit if Supplier_Master_instance.Credit_Limit is not None else "",
                    'LeadTime': Supplier_Master_instance.DeliveryDuration if Supplier_Master_instance.DeliveryDuration is not None else "",
                    'Status': 'Active' if Supplier_Master_instance.Status else 'Inactive',
                    'Notes': Supplier_Master_instance.Notes if Supplier_Master_instance.Notes is not None else "",
                }
                return JsonResponse(dic, safe=False)


            except Supplier_Master_Details.MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple suppliers found with this code'})

        # Case 2: Fetch multiple suppliers for quick GRN search
        elif ForQuickGrn:
            filterQuery = Q(Status=True)
            filterQuery = Q(Is_GEN=True)
            if SupplierCode:
                filterQuery &= Q(pk__icontains=SupplierCode)
            if SupplierName:
                filterQuery &= Q(Supplier_Name__icontains=SupplierName)

            Supplier_Master_instances = Supplier_Master_Details.objects.filter(filterQuery)
            Supplier_Array = [
                {
                    'id': row.pk,
                    'SupplierName': row.Supplier_Name,
                    'ContactNo': row.Contact_Number,
                } for row in Supplier_Master_instances
            ]

            return JsonResponse(Supplier_Array, safe=False)

        return JsonResponse({'error': 'Invalid request parameters'}, status=400)

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Supplier_Data_Get_Optical(request):
    try:
        # Extract GET parameters
        ForQuickGrn = request.GET.get('ForQuickGrn', 'false').lower() == 'true'
        SupplierCode = request.GET.get('SupplierCode')
        SupplierName = request.GET.get('SupplierName')

        # Case 1: Fetch a specific supplier by SupplierCode
        if not ForQuickGrn and SupplierCode:
            try:
                Supplier_Master_instance = Supplier_Master_Details.objects.get(pk=SupplierCode)
                dic = {
                    'id': Supplier_Master_instance.Supplier_Id,
                    'SupplierName': Supplier_Master_instance.Supplier_Name,
                    'SupplierType': Supplier_Master_instance.Supplier_Type if Supplier_Master_instance.Supplier_Type is not None else "",
                    'ContactPerson': Supplier_Master_instance.Contact_Person if Supplier_Master_instance.Contact_Person is not None else "",
                    'ContactNumber': Supplier_Master_instance.Contact_Number if Supplier_Master_instance.Contact_Number is not None else "",
                    'EmailAddress': Supplier_Master_instance.Email_Address if Supplier_Master_instance.Email_Address is not None else "",
                    'Address': Supplier_Master_instance.Address if Supplier_Master_instance.Address is not None else "",
                    'RegistrationNumber': Supplier_Master_instance.Registration_Number if Supplier_Master_instance.Registration_Number is not None else "",
                    'GSTNumber': Supplier_Master_instance.GST_Number if Supplier_Master_instance.GST_Number is not None else "",
                    'PANNumber': Supplier_Master_instance.PAN_Number if Supplier_Master_instance.PAN_Number is not None else "",
                    'PaymentTerms': Supplier_Master_instance.Payment_Terms if Supplier_Master_instance.Payment_Terms is not None else "",
                    'CreditLimit': Supplier_Master_instance.Credit_Limit if Supplier_Master_instance.Credit_Limit is not None else "",
                    'LeadTime': Supplier_Master_instance.DeliveryDuration if Supplier_Master_instance.DeliveryDuration is not None else "",
                    'Status': 'Active' if Supplier_Master_instance.Status else 'Inactive',
                    'Notes': Supplier_Master_instance.Notes if Supplier_Master_instance.Notes is not None else "",
                }
                return JsonResponse(dic, safe=False)


            except Supplier_Master_Details.MultipleObjectsReturned:
                return JsonResponse({'error': 'Multiple suppliers found with this code'})

        # Case 2: Fetch multiple suppliers for quick GRN search
        elif ForQuickGrn:
            filterQuery = Q(Status=True)
            if SupplierCode:
                filterQuery &= Q(pk__icontains=SupplierCode)
            if SupplierName:
                filterQuery &= Q(Supplier_Name__icontains=SupplierName)

            Supplier_Master_instances = Supplier_Master_Details.objects.filter(filterQuery,Is_Optical=True)
            Supplier_Array = [
                {
                    'id': row.pk,
                    'SupplierName': row.Supplier_Name,
                    'ContactNo': row.Contact_Number,
                } for row in Supplier_Master_instances
            ]

            return JsonResponse(Supplier_Array, safe=False)

        return JsonResponse({'error': 'Invalid request parameters'}, status=400)

    except Exception as e:
        print(f'An error occurred: {str(e)}')
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Product_Master_data_link(request):
    try:
        # Fetch all product master details
        item_all_details = Product_Master_All_Category_Details.objects.all()
       
        item_data = []
        for item in item_all_details:
            # Create a dictionary for each item and append it to the item_data list
            item_dict = {
                "ItemCode": item.pk,
                "ItemName": item.ItemName,
            }
            item_data.append(item_dict)  # Append the dictionary to the list
 
        # Return the item data as JSON response
        return JsonResponse(item_data, safe=False)
 
    except Exception as e:
        print(f"Exception occurred: {e}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)
 
 
@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def Get_BatchNumber_From_Stock_data_link(request):
    try:
        ItemCode = request.GET.get('ItemCode')
 
        stock_ins = Stock_Maintance_Table_Detials.objects.filter(
            Product_Detials__pk=ItemCode
        )
 
        data=[]
 
        id = 1
        if stock_ins.exists():
            for stock in stock_ins:
 
                idata = {
                    'id' : id,
                    'Batch_No': stock.Batch_No,
                }
               
                id = id + 1
                data.append(idata)
            
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse(data, safe=False)
 
    except Exception as e:
        return JsonResponse({'error': 'An internal server error occurred'})
 



@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_items_details_StockEvaluationSingleItem(request):
    try:
        ItemCode = request.GET.get('ItemCode')
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        StoreLocation = request.GET.get('StoreLocation')

        if not StoreLocation:
            return JsonResponse({'warn': 'StoreLocation is required.'})
        try:
            StoreLocation = int(StoreLocation)

        except ValueError:
            return JsonResponse({'warn': 'Invalid StoreLocation value'})


        if FromDate:
            FromDate = datetime.strptime(FromDate, '%Y-%m-%d')
        if ToDate:
            ToDate = datetime.strptime(ToDate, '%Y-%m-%d')

        
        query = Q(Store_location__Store_Id=StoreLocation)
        # Date filtering
        if FromDate and ToDate:
            query &= Q(Grn_Details_Item__Grn_Detials__GrnDate__range=[FromDate, ToDate])
        elif FromDate:
            query &= Q(Grn_Details_Item__Grn_Detials__GrnDate__gte=FromDate)
        elif ToDate:
            query &= Q(Grn_Details_Item__Grn_Detials__GrnDate__lte=ToDate)


        StockTable = Stock_Maintance_Table_Detials.objects.filter(query,Product_Detials__pk=ItemCode,AvailableQuantity__gt=0).values(
            'Product_Detials__pk',
            'Product_Detials__ItemName',
            'Product_Detials__ProductCategory__ProductCategory_Name',
            'Product_Detials__PackQty',
            'Batch_No',
            'Grn_Details_Item__Grn_Detials__GrnDate'
        ).annotate(
            GRNRecieveQuantity=Sum('Grn_Recieve_Quantity'),
            AvailableQuantity=Sum('AvailableQuantity'),
            SoldQuantity=Sum('Sold_Quantity'),
            PurchaseRate=Max('Grn_Details_Item__Purchase_rate_taxable')
        ).order_by('Product_Detials__ItemName')

        ArrayData = []
        
        idnum=1
        for item in StockTable:
            packqty = item.get('Product_Detials__PackQty', 1)  # Default to 1 if PackQty is None
            purchaseRate = item['PurchaseRate'] if item['PurchaseRate'] else 0

            if packqty and purchaseRate:
                purchaseRate /= packqty

            ItemObj = {
                'id':idnum,
                'PurchaseDate':item['Grn_Details_Item__Grn_Detials__GrnDate'],
                'ItemCode': item['Product_Detials__pk'],
                'ItemName': item['Product_Detials__ItemName'],
                'BatchNo':item['Batch_No'],
                'ProductCategory': item['Product_Detials__ProductCategory__ProductCategory_Name'],
                'GRNRecieveQuantity': item['GRNRecieveQuantity'],
                'PurchaseRate': round(purchaseRate, 2),  # Optional: Rounding off
                'SoldQuantity': item['SoldQuantity'],
                'AvailableQuantity': item['AvailableQuantity'],
                'StockValue': round(item['AvailableQuantity'] * purchaseRate, 2) if item['AvailableQuantity'] else 0
            }
            ArrayData.append(ItemObj)
            idnum+=1

        print('ArrayData?????',ArrayData)

        return JsonResponse(ArrayData, safe=False)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_items_details_StockEvaluationReport(request):
    try:
        # Get parameters
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        ItemName = request.GET.get('ItemName')
        StoreLocation = request.GET.get('StoreLocation')

        # Check if StoreLocation is provided
        if not StoreLocation:
            return JsonResponse({'warn': 'StoreLocation is required.'})

        try:
            StoreLocation = int(StoreLocation)
        except ValueError:
            return JsonResponse({'warn': 'Invalid StoreLocation value.'})

        print('StoreLocation----', StoreLocation)

        query = Q(Store_location__Store_Id=StoreLocation)

        # Date filtering
        if FromDate and ToDate:
            query &= Q(Grn_Details_Item__Grn_Detials__GrnDate__range=[FromDate, ToDate])
        elif FromDate:
            query &= Q(Grn_Details_Item__Grn_Detials__GrnDate__gte=FromDate)
        elif ToDate:
            query &= Q(Grn_Details_Item__Grn_Detials__GrnDate__lte=ToDate)

        # Item Name Filtering
        if ItemName:
            query &= Q(Product_Detials__ItemName__icontains=ItemName)

        # Fetch filtered stock data with grouping and aggregation
        StockTable = Stock_Maintance_Table_Detials.objects.filter(query).values(
            'Product_Detials__pk',
            'Product_Detials__ItemName',
            'Product_Detials__ProductCategory__ProductCategory_Name',
            'Product_Detials__PackQty',
            'Store_location__Store_Id'
        ).annotate(
            GRNRecieveQuantity=Sum('Grn_Recieve_Quantity'),
            AvailableQuantity=Sum('AvailableQuantity'),
            SoldQuantity=Sum('Sold_Quantity'),
            PurchaseRate=Max('Grn_Details_Item__Purchase_rate_taxable')
        ).order_by('Product_Detials__ItemName')

        ArrayData = []

        idnum = 1
        for item in StockTable:
            packqty = item.get('Product_Detials__PackQty', 1) or 1  # Default to 1 if missing
            purchaseRate = item['PurchaseRate'] if item['PurchaseRate'] else 0

            # Divide purchase rate by pack qty if available
            if packqty and purchaseRate:
                purchaseRate /= packqty

            ItemObj = {
                'id': idnum,
                'ItemCode': item['Product_Detials__pk'],
                'ItemName': item['Product_Detials__ItemName'],
                'ProductCategory': item['Product_Detials__ProductCategory__ProductCategory_Name'],
                'GRNRecieveQuantity': item['GRNRecieveQuantity'] or 0,
                'PurchaseRate': round(purchaseRate, 2),
                'SoldQuantity': item['SoldQuantity'] or 0,
                'AvailableQuantity': item['AvailableQuantity'] or 0,
                'StockValue': round((item['AvailableQuantity'] or 0) * purchaseRate, 2),
                'StoreLocation': item['Store_location__Store_Id'],
            }
            ArrayData.append(ItemObj)
            idnum += 1

        return JsonResponse(ArrayData, safe=False)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'An internal server error occurred.'}, status=500)




@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def get_items_details_StockMovementReport(request):
    try:
        FromDate = request.GET.get('FromDate')
        ToDate = request.GET.get('ToDate')
        ItemName = request.GET.get('ItemName')
        MovementCategory = request.GET.get('MovementCategory')
        StoreLocation = request.GET.get('StoreLocation')

        if not StoreLocation:
            return JsonResponse({'warn':  'StoreLocation is required.'})
        try:
            StoreLocation = int(StoreLocation)
        except ValueError:
            return JsonResponse({'warn': 'Invalid StoreLocation value'})

        query = Q()
        query = Q(Store_location__Store_Id=StoreLocation)
        Subquery = Q()

        if FromDate:
            FromDate = datetime.strptime(FromDate, '%Y-%m-%d')
        if ToDate:
            ToDate = datetime.strptime(ToDate, '%Y-%m-%d')

        if ItemName:
            query &= Q(Product_Detials__ItemName__icontains=ItemName)

        StockTable = Stock_Maintance_Table_Detials.objects.filter(query, AvailableQuantity__gt=0).values(
            'Product_Detials__pk',
            'Product_Detials__ItemName',
            'Product_Detials__ProductCategory__ProductCategory_Name',
            'Product_Detials__PackQty'
        ).annotate(
            AvailableQuantity=Sum('AvailableQuantity'),
            PurchaseRate=Max('Grn_Details_Item__Purchase_rate_taxable')
        ).order_by('Product_Detials__ItemName')

        # Remove duplicate records based on Product_Detials__pk
        unique_dict = {item['Product_Detials__pk']: item for item in StockTable}
        StockArrayData = list(unique_dict.values())

        ArrayData = []
        idnum = 1

        for item in StockArrayData:
            if FromDate and ToDate:
                Subquery &= Q(Billing__Billing_Date__range=[FromDate, ToDate])

            packqty = item.get('Product_Detials__PackQty', 1)
            purchaseRate = item['PurchaseRate'] if item['PurchaseRate'] else 0

            if packqty and purchaseRate:
                purchaseRate /= packqty

            stock_value = round(item['AvailableQuantity'] * purchaseRate, 2)

                        # Fetch Sales Data from both OP and IP Billing Items
            op_sales_data = OP_BillingItem.objects.filter(
                Subquery, ItemId__Product_Detials__pk=item['Product_Detials__pk']
            ).annotate(
                Total_Sales_Quantity=Sum('Billing_Quantity'),
                Total_Qty=Sum('Billing__Total_Qty'),
                Billing_Date=Max('Billing__Billing_Date')
            ).values('Total_Sales_Quantity', 'Total_Qty', 'Billing_Date')

            ip_sales_data = IP_BillingItem.objects.filter(
                Subquery, ItemId__Product_Detials__pk=item['Product_Detials__pk']
            ).annotate(
                Total_Sales_Quantity=Sum('Billing_Quantity'),
                Total_Qty=Sum('Billing__Total_Qty'),
                Billing_Date=Max('Billing__Billing_Date')
            ).values('Total_Sales_Quantity', 'Total_Qty', 'Billing_Date')

                        # Aggregate OP and IP sales data
            total_sales_quantity = (
                (op_sales_data[0]['Total_Sales_Quantity'] if op_sales_data.exists() else 0) +
                (ip_sales_data[0]['Total_Sales_Quantity'] if ip_sales_data.exists() else 0)
            )

            total_qty = (
                (op_sales_data[0]['Total_Qty'] if op_sales_data.exists() else 0) +
                (ip_sales_data[0]['Total_Qty'] if ip_sales_data.exists() else 0)
            )

            latest_billing_date = max(
                filter(None, [
                    op_sales_data[0]['Billing_Date'] if op_sales_data.exists() else None,
                    ip_sales_data[0]['Billing_Date'] if ip_sales_data.exists() else None
                ])
            ) if any([
                op_sales_data.exists() and op_sales_data[0]['Billing_Date'],
                ip_sales_data.exists() and ip_sales_data[0]['Billing_Date']
            ]) else None


            sales_period = (ToDate - FromDate).days if FromDate and ToDate else 1
            sales_rate = round(total_sales_quantity / sales_period, 2) if sales_period > 0 else 0

            if sales_rate > 10:
                movement_category = "Fast Moving"
            elif 1 <= sales_rate <= 10:
                movement_category = "Slow Moving"
            else:
                movement_category = "Non-Moving"

            ItemObj = {
                'id': idnum,
                'ItemName': item['Product_Detials__ItemName'],
                'ProductCategory': item['Product_Detials__ProductCategory__ProductCategory_Name'],
                'SoldQuantity': total_sales_quantity,
                'Total_Qty': total_qty,
                'AvailableQuantity': item['AvailableQuantity'],
                'PurchaseRate': round(purchaseRate, 2),
                'StockValue': stock_value,
                'SalesRate': sales_rate,
                'MovementCategory': movement_category,
                'Billing_Date': latest_billing_date
            }

            # Apply MovementCategory filter
            if not MovementCategory or MovementCategory == movement_category:
                ArrayData.append(ItemObj)
                idnum += 1

        return JsonResponse(ArrayData, safe=False)

    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)

# -----------------doctor item mapping


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Item_Doctor_Mapping_Link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print('Received data:', data)

            Itemmapcode = data.get('Itemmapcode')
            itemcode = data.get('itemcode')
            created_by = data.get('created_by')
            MappedItems = data.get('MappedItems', [])

            # Validate itemcode
            if not itemcode:
                return JsonResponse({'warn': 'itemcode is required'}, status=400)

            try:
                itemname_instance = Product_Master_All_Category_Details.objects.get(pk=itemcode)
            except Product_Master_All_Category_Details.DoesNotExist:
                return JsonResponse({'error': "Itemcode does not exist"}, status=400)

            # If Itemmapcode exists, delete existing mappings before inserting new ones
            if Itemmapcode:
                existing_records = Item_Doctor_Mapping.objects.filter(ItemName=itemname_instance)
                print(f"Deleting------- {existing_records.count()} existing records for itemcode {itemcode}")
                existing_records.delete()
            # Insert new mappings
            for item in MappedItems:
                if 'doctors' in item:
                    for doctor in item['doctors']:
                        try:
                            doctor_instance = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=doctor.get('doctorid'))
                        except Doctor_Personal_Form_Detials.DoesNotExist:
                            return JsonResponse({'error': f'DoctorId {doctor.get("doctorid")} not found'}, status=400)

                        # Create new mapping entry
                        Item_Doctor_Mapping.objects.create(
                            ItemName=itemname_instance,
                            Doctor=doctor_instance,
                            created_by=created_by,
                        )

            return JsonResponse({'success': 'Item mappings updated successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
    elif request.method == 'GET':
        try:
            item_mappings = Item_Doctor_Mapping.objects.select_related('ItemName', 'Doctor').all()
            response_data = {}

            for mapping in item_mappings:
                itemcode = mapping.ItemName.pk
                itemname = mapping.ItemName.ItemName  # Ensure correct field name

                if itemcode not in response_data:
                    response_data[itemcode] = {
                        "id": len(response_data) + 1, 
                        "itemname": itemname,
                        "itemcode": itemcode,
                        "doctors": []
                    }

                response_data[itemcode]["doctors"].append({
                    "doctorname": f"{mapping.Doctor.Tittle.Title_Name}. {mapping.Doctor.First_Name} {mapping.Doctor.Middle_Name or ''} {mapping.Doctor.Last_Name or ''}".strip(),
                    "doctorid": mapping.Doctor.Doctor_ID
                })

            response_list = list(response_data.values())

            return JsonResponse(response_list, status=200, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        

from django.db.models.functions import Coalesce,NullIf

# @csrf_exempt
# @require_http_methods(["GET"])
# def GST_Sales_Report(request):
#     try:

#         items = OP_BillingItem.objects.select_related(
#             "Billing",
#             "ItemId__Product_Detials"
#         ).order_by("Billing__created_at")

#         # ---------------------- FILTERS ----------------------
#         product = request.GET.get("product")
#         batch = request.GET.get("batch")
#         gst = request.GET.get("gst")
#         start_date = request.GET.get("start_date")
#         end_date = request.GET.get("end_date")
#         month = request.GET.get("month")
#         year = request.GET.get("year")
#         quarter = request.GET.get("quarter")

#         if product:
#             items = items.filter(ItemName__icontains=product)

#         if batch:
#             items = items.filter(BatchNo__icontains=batch)

#         if gst:
#             items = items.filter(ItemId__Product_Detials__GST_Value=gst)

#         if start_date and end_date:
#             items = items.filter(Billing__created_at__Date__range=[start_date, end_date])

#         if month and year:
#             items = items.filter(
#                 Billing__created_at__month=month,
#                 Billing__created_at__year=year
#             )

#         if year and not month:
#             items = items.filter(Billing__created_at__year=year)

#         if quarter and year:
#             q_map = {"1": (1, 3), "2": (4, 6), "3": (7, 9), "4": (10, 12)}
#             m1, m2 = q_map.get(quarter, (1, 12))

#             items = items.filter(
#               Billing__created_at__year=year,
#                Billing__created_at__month__gte=m1,
#                 Billing__created_at__month__lte=m2
#             )

#         # ---------------- BILL-WISE DATA ----------------
#         bill_data = {}

#         # ---------------- GRAND TOTAL BUCKETS ----------------
#         total_amount_5 = total_gst_5 = 0.0
#         total_amount_18 = total_gst_18 = 0.0
#         total_amount_0 = total_gst_0 = 0.0

#         for item in items:
#             bill = item.Billing
#             invoice_no = bill.Billing_Invoice_No

#             qty = float(item.Billing_Quantity or 0)
#             rate = float(item.Unit_Price or 0)

#             # GST %
#             gst_raw = (
#                 item.ItemId.Product_Detials.GST_Value
#                 if (item.ItemId and item.ItemId.Product_Detials)
#                 else None
#             )
#             gst_percent = float(gst_raw or 5)  # default = 5%

#             amount = float(qty * rate)
#             gst_amount = float(amount * (gst_percent / 100))

#             # Create bill entry
#             if invoice_no not in bill_data:
#                 bill_data[invoice_no] = {
#                     "invoice_no": invoice_no,
#                     "patient_name": (
#                         bill.Patient_Id.FirstName if bill.Patient_Id else bill.Patient_name
#                     ),
#                     "bill_date": bill.Billing_Date,

#                     "gst_5":  {"amount": 0.0, "gst": 0.0},
#                     "gst_18": {"amount": 0.0, "gst": 0.0},
#                     "gst_0":  {"amount": 0.0, "gst": 0.0},

#                     "net_amount": 0.0,
#                 }

#             # Select bucket
#             if gst_percent == 5:
#                 bucket = "gst_5"
#                 total_amount_5 += amount
#                 total_gst_5 += gst_amount

#             elif gst_percent == 18:
#                 bucket = "gst_18"
#                 total_amount_18 += amount
#                 total_gst_18 += gst_amount

#             else:
#                 bucket = "gst_0"
#                 total_amount_0 += amount
#                 total_gst_0 += gst_amount

#             bill_data[invoice_no][bucket]["amount"] += amount
#             bill_data[invoice_no][bucket]["gst"] += gst_amount

#             bill_data[invoice_no]["net_amount"] += (amount + gst_amount)

#         # ---------------- ROUND VALUES (2 DIGITS) ----------------
#         for b in bill_data.values():
#             b["gst_5"]["amount"] = round(b["gst_5"]["amount"], 2)
#             b["gst_5"]["gst"] = round(b["gst_5"]["gst"], 2)

#             b["gst_18"]["amount"] = round(b["gst_18"]["amount"], 2)
#             b["gst_18"]["gst"] = round(b["gst_18"]["gst"], 2)

#             b["gst_0"]["amount"] = round(b["gst_0"]["amount"], 2)
#             b["gst_0"]["gst"] = round(b["gst_0"]["gst"], 2)

#             b["net_amount"] = round(b["net_amount"], 2)

#         # ---------------- GRAND TOTALS ----------------
#         grand_total_amount = round(total_amount_5 + total_amount_18 + total_amount_0, 2)
#         grand_total_gst = round(total_gst_5 + total_gst_18 + total_gst_0, 2)
#         grand_total_net = round(grand_total_amount + grand_total_gst, 2)

#         # ---------------- RETURN RESPONSE ----------------
#         return JsonResponse({
#             "bills": list(bill_data.values()),

#             "totals": {
#                 "gst_5": {
#                     "amount": round(total_amount_5, 2),
#                     "gst": round(total_gst_5, 2)
#                 },
#                 "gst_18": {
#                     "amount": round(total_amount_18, 2),
#                     "gst": round(total_gst_18, 2)
#                 },
#                 "gst_0": {
#                     "amount": round(total_amount_0, 2),
#                     "gst": round(total_gst_0, 2)
#                 },
#                 "grand_total_amount": grand_total_amount,
#                 "grand_total_gst": grand_total_gst,
#                 "grand_total_net": grand_total_net
#             }
#         }, safe=False)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

# @csrf_exempt
# @require_http_methods(["GET"])
# def GST_Sales_Report(request):
#     try:
#         items = OP_BillingItem.objects.select_related(
#             "Billing",
#             "ItemId__Product_Detials"
#         )
#         count = items.count()
#         # ---------------------- FILTERS ----------------------
#         product = request.GET.get("product")
#         batch = request.GET.get("batch")
#         gst = request.GET.get("gst")

#         # FRONTEND PARAM NAMES
#         start_date = request.GET.get("startDate")
#         end_date = request.GET.get("endDate")

#         month = request.GET.get("month")
#         year = request.GET.get("year")
#         quarter = request.GET.get("quarter")

#         if product:
#             items = items.filter(
#                 ItemId__Product_Detials__Product_Name__icontains=product
#             )

#         if batch:
#             items = items.filter(BatchNo__icontains=batch)

#         if gst:
#             items = items.filter(ItemId__Product_Detials__GST_Value=gst)

#         # ---------------- DATE FILTER (PRIORITY BASED) ----------------
#         if start_date and end_date:
#             items = items.filter(
#                 Billing__created_at__date__range=[start_date, end_date]
#             )

#         elif month and year:
#             items = items.filter(
#                 Billing__created_at__month=int(month),
#                 Billing__created_at__year=int(year)
#             )

#         elif quarter and year:
#             q_map = {
#                 "1": (1, 3),
#                 "2": (4, 6),
#                 "3": (7, 9),
#                 "4": (10, 12)
#             }
#             m1, m2 = q_map.get(quarter)
#             items = items.filter(
#                 Billing__created_at__year=int(year),
#                 Billing__created_at__month__gte=m1,
#                 Billing__created_at__month__lte=m2
#             )

#         elif year:
#             items = items.filter(Billing__created_at__year=int(year))

#         items = items.order_by("Billing__created_at")

#         # ---------------- BILL AGGREGATION ----------------
#         bill_data = {}

#         total_amount_5 = total_gst_5 = 0
#         total_amount_18 = total_gst_18 = 0
#         total_amount_0 = total_gst_0 = 0

#         for item in items:
#             bill = item.Billing
#             invoice_no = bill.Billing_Invoice_No

#             qty = float(item.Billing_Quantity or 0)
#             rate = float(item.Unit_Price or 0)

#             gst_percent = float(
#                 item.ItemId.Product_Detials.GST_Value
#                 if item.ItemId and item.ItemId.Product_Detials and
#                    item.ItemId.Product_Detials.GST_Value is not None
#                 else 0
#             )

#             amount = qty * rate
#             gst_amount = amount * gst_percent / 100

#             if invoice_no not in bill_data:
#                 bill_data[invoice_no] = {
#                     "invoice_no": invoice_no,
#                     "patient_name": bill.Patient_Id.FirstName if bill.Patient_Id else bill.Patient_name,
#                     "bill_date": bill.Billing_Date,

#                     "gst_5": {"amount": 0, "gst": 0},
#                     "gst_18": {"amount": 0, "gst": 0},
#                     "gst_0": {"amount": 0, "gst": 0},

#                     "net_amount": 0,
#                 }

#             if gst_percent == 5:
#                 bucket = "gst_5"
#                 total_amount_5 += amount
#                 total_gst_5 += gst_amount

#             elif gst_percent == 18:
#                 bucket = "gst_18"
#                 total_amount_18 += amount
#                 total_gst_18 += gst_amount

#             else:
#                 bucket = "gst_0"
#                 total_amount_0 += amount
#                 total_gst_0 += gst_amount

#             bill_data[invoice_no][bucket]["amount"] += amount
#             bill_data[invoice_no][bucket]["gst"] += gst_amount
#             bill_data[invoice_no]["net_amount"] += amount + gst_amount

#         # ---------------- ROUND ----------------
#         for b in bill_data.values():
#             for g in ("gst_5", "gst_18", "gst_0"):
#                 b[g]["amount"] = round(b[g]["amount"], 2)
#                 b[g]["gst"] = round(b[g]["gst"], 2)
#             b["net_amount"] = round(b["net_amount"], 2)

#         return JsonResponse({
#             "bills": list(bill_data.values()),
#             "totals": {
#                 "count":count,
#                 "gst_5": {"amount": round(total_amount_5, 2), "gst": round(total_gst_5, 2)},
#                 "gst_18": {"amount": round(total_amount_18, 2), "gst": round(total_gst_18, 2)},
#                 "gst_0": {"amount": round(total_amount_0, 2), "gst": round(total_gst_0, 2)},
#                 "grand_total_amount": round(total_amount_5 + total_amount_18 + total_amount_0, 2),
#                 "grand_total_gst": round(total_gst_5 + total_gst_18 + total_gst_0, 2),
#                 "grand_total_net": round(
#                     total_amount_5 + total_amount_18 + total_amount_0 +
#                     total_gst_5 + total_gst_18 + total_gst_0, 2
#                 )
#             }
#         })

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)

# ---------- MONEY HELPERS ----------

from decimal import Decimal, ROUND_HALF_UP

def money(val):
    return Decimal(str(val or 0)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )

def money_json(val):
    return float(money(val))


@csrf_exempt
@require_http_methods(["GET"])
def GST_Sales_Report(request):
    try:
        # -------- BILL FILTER (SOURCE OF TRUTH) --------
        bills = OP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=["host", "admin"]
        ).filter(
            Bill_Status__in=["Paid", "Refunded", "Due"]
        ).order_by('created_at')

        # -------- DATE FILTER --------
        start_date = request.GET.get("startDate")
        end_date = request.GET.get("endDate")
        month = request.GET.get("month")
        year = request.GET.get("year")

        if start_date and end_date:
            bills = bills.filter(created_at__date__range=[start_date, end_date])
        elif month and year:
            bills = bills.filter(created_at__month=month, created_at__year=year)
        elif year:
            bills = bills.filter(created_at__year=year)

        bill_count = bills.count()

        bill_ids = bills.values_list("Billing_Invoice_No", flat=True)

        # -------- ITEMS --------
        items = OP_BillingItem.objects.select_related(
            "Billing",
            "ItemId__Product_Detials"
        ).filter(
            Billing_id__in=bill_ids
        )

        bill_data = {}

        # -------- GRAND TOTALS --------
        total_amount_5 = Decimal("0")
        total_gst_5 = Decimal("0")
        total_amount_18 = Decimal("0")
        total_gst_18 = Decimal("0")
        total_amount_0 = Decimal("0")

        # ================= BILL LOOP =================
        for bill in bills:
            invoice = bill.Bill_No
            bill_items = items.filter(Billing=bill)

            bill_net = money(bill.Net_Amount)

            taxable_total = Decimal("0")
            gst_total = Decimal("0")
            rows = []

            # -------- FIRST PASS (RAW TOTAL) --------
            for item in bill_items:
                qty = money(item.Billing_Quantity)
                rate = money(item.Unit_Price)
                base = money(qty * rate)

                gst_p = money(
                    item.ItemId.Product_Detials.GST_Value
                    if item.ItemId and item.ItemId.Product_Detials else 0
                )

                gst_amt = money(base * gst_p / 100)

                taxable_total += base
                gst_total += gst_amt

                rows.append((gst_p, base, gst_amt, item))

            scale = (
                bill_net / (taxable_total + gst_total)
                if (taxable_total + gst_total) > 0
                else Decimal("0")
            )

            bill_data[invoice] = {
                "invoice_no": invoice,
                "patient_name": bill.Patient_Id.FirstName if bill.Patient_Id else bill.Patient_name,
                "bill_date": bill.Billing_Date,
                "items": [],
                "gst_5": {"amount": Decimal("0"), "gst": Decimal("0")},
                "gst_18": {"amount": Decimal("0"), "gst": Decimal("0")},
                "gst_0": {"amount": Decimal("0"), "gst": Decimal("0")},
                "net_amount": money(bill_net),
            }

            # -------- SECOND PASS (SCALED & ROUNDED) --------
            for gst_p, base, gst_amt, item in rows:
                adj_base = money(base * scale)
                adj_gst = money(gst_amt * scale)
                net_item = money(adj_base + adj_gst)

                if gst_p == 5:
                    bucket = "gst_5"
                    total_amount_5 += adj_base
                    total_gst_5 += adj_gst
                elif gst_p == 18:
                    bucket = "gst_18"
                    total_amount_18 += adj_base
                    total_gst_18 += adj_gst
                else:
                    bucket = "gst_0"
                    total_amount_0 += adj_base

                bill_data[invoice][bucket]["amount"] += adj_base
                bill_data[invoice][bucket]["gst"] += adj_gst

                bill_data[invoice]["items"].append({
                    "product": item.ItemId.Product_Detials.ItemName if item.ItemId else "",
                    "batch": item.BatchNo,
                    "qty": money_json(item.Billing_Quantity),
                    "rate": money_json(item.Unit_Price),
                    "amount": money_json(adj_base),
                    "gst_percent": money_json(gst_p),
                    "gst_amount": money_json(adj_gst),
                    "net_amount": money_json(net_item),
                })

            # -------- LAST ITEM ROUND-OFF FIX --------
            items_sum = sum(
                money(i["net_amount"]) for i in bill_data[invoice]["items"]
            )

            diff = money(bill_net - items_sum)

            if diff != 0 and bill_data[invoice]["items"]:
                bill_data[invoice]["items"][-1]["gst_amount"] = money_json(
                    money(bill_data[invoice]["items"][-1]["gst_amount"]) + diff
                )
                bill_data[invoice]["items"][-1]["net_amount"] = money_json(
                    money(bill_data[invoice]["items"][-1]["net_amount"]) + diff
                )

        # ================= RESPONSE =================
        return JsonResponse({
            "bills": list(bill_data.values()),
            "totals": {
                "count": bill_count,
                "grand_total_net": money_json(
                    sum(money(b["net_amount"]) for b in bill_data.values())
                ),
                "gst_5": {
                    "amount": money_json(total_amount_5),
                    "gst": money_json(total_gst_5),
                },
                "gst_18": {
                    "amount": money_json(total_amount_18),
                    "gst": money_json(total_gst_18),
                },
                "gst_0": {
                    "amount": money_json(total_amount_0),
                    "gst": 0.0,
                },
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


    
@csrf_exempt
@require_http_methods(["GET"])
def GST_Refund_Report(request):
    try:
        # Get query parameters for filters
        voucher = request.GET.get('voucher', '')
        patient = request.GET.get('patient', '')
        gst = request.GET.get('gst', '')
        start_date = request.GET.get('start_date', '')
        end_date = request.GET.get('end_date', '')
        month = request.GET.get('month', '')
        year = request.GET.get('year', '')
        quarter = request.GET.get('quarter', '')

        # Start with the full refund queryset
        refunds = OPPharmacyBillingRefundReceipt.objects.all().order_by("CreatedAt")

        # Apply filters if provided
        if voucher:
            refunds = refunds.filter(Voucher_Number__icontains=voucher)

        if patient:
            refunds = refunds.filter(Patient_Name__icontains=patient)

        if gst:
            if gst == '5':
                refunds = refunds.filter(Remaining_Items__Product_Detials__GST_Value=5)
            elif gst == '18':
                refunds = refunds.filter(Remaining_Items__Product_Detials__GST_Value=18)
            elif gst == '0':
                refunds = refunds.filter(Remaining_Items__Product_Detials__GST_Value=0)

        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            refunds = refunds.filter(Billing_Date__gte=start_date)

        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
            refunds = refunds.filter(Billing_Date__lte=end_date)

        if month:
            refunds = refunds.filter(Billing_Date__month=month)

        if year:
            refunds = refunds.filter(Billing_Date__year=year)

        if quarter:
            if quarter == '1':
                refunds = refunds.filter(Billing_Date__month__in=[1, 2, 3])
            elif quarter == '2':
                refunds = refunds.filter(Billing_Date__month__in=[4, 5, 6])
            elif quarter == '3':
                refunds = refunds.filter(Billing_Date__month__in=[7, 8, 9])
            elif quarter == '4':
                refunds = refunds.filter(Billing_Date__month__in=[10, 11, 12])

        refund_list = []
        total_amt_5 = total_gst_5 = 0.0
        total_amt_18 = total_gst_18 = 0.0
        total_amt_0 = total_gst_0 = 0.0

        # Process refunds
        for refund in refunds:
            gst_5_amount = gst_5_gst = 0.0
            gst_18_amount = gst_18_gst = 0.0
            gst_0_amount = gst_0_gst = 0.0

            items = refund.Remaining_Items or []

            for item in items:
                qty = float(item.get("Billing_Quantity", 0))
                rate = float(item.get("Unit_Price", 0))
                amount = float(qty * rate)

                # Get GST% from Product table
                try:
                    product = Stock_Maintance_Table_Detials.objects.filter(id=item["ItemId"]).first()
                    gst_percent = float(product.Product_Detials.GST_Value or 5)
                except:
                    gst_percent = 5  # default GST if not found

                gst_value = amount * (gst_percent / 100)

                # Bucket selection
                if gst_percent == 5:
                    gst_5_amount += amount
                    gst_5_gst += gst_value
                    total_amt_5 += amount
                    total_gst_5 += gst_value

                elif gst_percent == 18:
                    gst_18_amount += amount
                    gst_18_gst += gst_value
                    total_amt_18 += amount
                    total_gst_18 += gst_value

                else:
                    gst_0_amount += amount
                    gst_0_gst += gst_value
                    total_amt_0 += amount
                    total_gst_0 += gst_value

            # Append bill-level breakdown
            refund_list.append({
                "voucher_no": refund.Voucher_Number,
                "billing_date": refund.Billing_Date,
                "patient_name": refund.Patient_Name,
                "gst_5": {
                    "amount": round(gst_5_amount, 2),
                    "gst": round(gst_5_gst, 2),
                },
                "gst_18": {
                    "amount": round(gst_18_amount, 2),
                    "gst": round(gst_18_gst, 2),
                },
                "gst_0": {
                    "amount": round(gst_0_amount, 2),
                    "gst": round(gst_0_gst, 2),
                },
                "total_refund": round(
                    gst_5_amount + gst_18_amount + gst_0_amount +
                    gst_5_gst + gst_18_gst + gst_0_gst, 2
                )
            })

        # Grand totals
        grand_amount = round(total_amt_5 + total_amt_18 + total_amt_0, 2)
        grand_gst = round(total_gst_5 + total_gst_18 + total_gst_0, 2)

        return JsonResponse({
            "refunds": refund_list,
            "totals": {
                "5%":  {"amount": round(total_amt_5, 2), "gst": round(total_gst_5, 2)},
                "18%": {"amount": round(total_amt_18, 2), "gst": round(total_gst_18, 2)},
                "0%":  {"amount": round(total_amt_0, 2), "gst": round(total_gst_0, 2)},
                "grand_total_amount": grand_amount,
                "grand_total_gst": grand_gst,
                "grand_total_with_gst": grand_amount + grand_gst,
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Sales_Return_HSN_Report(request):
    try:
        # Get filters from query params
        hsn_filter = request.GET.get('hsn', '')  # HSN code filter
        item_name_filter = request.GET.get('itemName', '')  # Item Name filter
        product_type_filter = request.GET.get('productType', '')  # Product Type filter
        gst_filter = request.GET.get('gst', '')  # GST Percentage filter (e.g., '5', '18', '0')
        start_date = request.GET.get('startDate', '')  # Start Date filter
        end_date = request.GET.get('endDate', '')  # End Date filter

        # Filter refunds based on the date range (if provided)
        refunds = OPPharmacyBillingRefundReceipt.objects.all()

        if start_date:
            refunds = refunds.filter(CreatedAt__gte=datetime.strptime(start_date, "%Y-%m-%d"))
        if end_date:
            refunds = refunds.filter(CreatedAt__lte=datetime.strptime(end_date, "%Y-%m-%d"))

        refunds = refunds.order_by("-CreatedAt")

        # GST GROUP TEMPLATE
        def gst_template():
            return {
                "items": {},     # dict for grouping
                "total_qty": 0.0,
                "total_taxable": 0.0,
                "total_cgst": 0.0,
                "total_sgst": 0.0,
                "total_gst": 0.0,
            }

        # GST % GROUPS
        gst_data = {
            "0%": gst_template(),
            "5%": gst_template(),
            "18%": gst_template(),
        }

        # GRAND TOTALS
        grand_qty = 0.0
        grand_taxable = 0.0
        grand_cgst = 0.0
        grand_sgst = 0.0
        grand_gst = 0.0

        for refund in refunds:
            items = refund.Remaining_Items or []

            for item in items:
                # Apply filters on item properties
                if hsn_filter and hsn_filter not in item.get("HSN", ""):
                    continue
                if item_name_filter and item_name_filter.lower() not in item.get("ItemName", "").lower():
                    continue
                if product_type_filter and product_type_filter.lower() not in item.get("ProductType", "").lower():
                    continue

                qty = float(item.get("Billing_Quantity", 0))
                rate = float(item.get("Unit_Price", 0))
                amount = qty * rate  # taxable amount

                # Get product details
                try:
                    product = Stock_Maintance_Table_Detials.objects.filter(id=item["ItemId"]).first()

                    gst_percent = float(product.Product_Detials.GST_Value or 0)
                    hsn = product.Product_Detials.HSNCode or ""
                    product_type = product.Product_Detials.ProductType.ProductType_Name or ""

                except:
                    gst_percent = 0
                    hsn = ""
                    product_type = ""

                # Filter by GST percentage
                if gst_filter and int(gst_filter) != int(gst_percent):
                    continue

                # Select GST bucket
                gst_key = f"{int(gst_percent)}%"
                if gst_key not in gst_data:
                    gst_key = "0%"

                # GST split
                cgst = amount * (gst_percent / 2) / 100
                sgst = amount * (gst_percent / 2) / 100
                gst_total = cgst + sgst

                # Group key
                group_key = f"{hsn}|{item.get('ItemName', '')}|{product_type}"

                # If item not created, create
                if group_key not in gst_data[gst_key]["items"]:
                    gst_data[gst_key]["items"][group_key] = {
                        "HSN": hsn,
                        "itemName": item.get("ItemName", ""),
                        "product_type": product_type,
                        "qty": 0.0,
                        "taxable": 0.0,
                        "CGST": 0.0,
                        "SGST": 0.0,
                    }

                # Update group totals
                gst_data[gst_key]["items"][group_key]["qty"] += qty
                gst_data[gst_key]["items"][group_key]["taxable"] += amount
                gst_data[gst_key]["items"][group_key]["CGST"] += cgst
                gst_data[gst_key]["items"][group_key]["SGST"] += sgst

                # Update GST totals
                gst_data[gst_key]["total_qty"] += qty
                gst_data[gst_key]["total_taxable"] += amount
                gst_data[gst_key]["total_cgst"] += cgst
                gst_data[gst_key]["total_sgst"] += sgst
                gst_data[gst_key]["total_gst"] += gst_total

                # Update grand totals
                grand_qty += qty
                grand_taxable += amount
                grand_cgst += cgst
                grand_sgst += sgst
                grand_gst += gst_total

        # Convert dict groups to list + round values to 2 decimals
        for key in gst_data:
            items_list = []
            for gkey, row in gst_data[key]["items"].items():
                items_list.append({
                    "HSN": row["HSN"],
                    "itemName": row["itemName"],
                    "product_type": row["product_type"],
                    "qty": round(row["qty"], 2),
                    "taxable": round(row["taxable"], 2),
                    "CGST": round(row["CGST"], 2),
                    "SGST": round(row["SGST"], 2),
                })
            gst_data[key]["items"] = items_list

        # Final response
        return JsonResponse({
            "GST_Report": {
                key: {
                    "items": gst_data[key]["items"],
                    "total_qty": round(gst_data[key]["total_qty"], 2),
                    "total_taxable": round(gst_data[key]["total_taxable"], 2),
                    "total_cgst": round(gst_data[key]["total_cgst"], 2),
                    "total_sgst": round(gst_data[key]["total_sgst"], 2),
                    "total_gst": round(gst_data[key]["total_gst"], 2),
                }
                for key in gst_data
            },
            "grand_totals": {
                "grand_qty": round(grand_qty, 2),
                "grand_taxable": round(grand_taxable, 2),
                "grand_cgst": round(grand_cgst, 2),
                "grand_sgst": round(grand_sgst, 2),
                "grand_gst": round(grand_gst, 2),
                "grand_with_gst": round(grand_taxable + grand_gst, 2),
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def round0(val):
    return int(Decimal(val or 0).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

@csrf_exempt
@require_http_methods(["GET"])
def GST_Purchase_Report_GST(request):
    try:
        items = GRN_Product_Item_Detials.objects.filter(
            Status='Approved',
            Reason='OPPHARMACY'
        ).select_related(
            "Grn_Detials",
            "Product_Detials"
        ).order_by("Grn_Detials__Supplier_Bill_Date")

        # ---------------- Filters ---------------- #
        supplier = request.GET.get("supplier")
        product = request.GET.get("product")
        hsn = request.GET.get("hsn")
        gst = request.GET.get("gst")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        month = request.GET.get("month")
        year = request.GET.get("year")
        quarter = request.GET.get("quarter")

        if supplier:
            items = items.filter(Grn_Detials__Supplier_Detials__Supplier_Name__icontains=supplier)

        if product:
            items = items.filter(Product_Detials__ProductName__icontains=product)

        if hsn:
            items = items.filter(Product_Detials__HSNCode__icontains=hsn)

        if gst:
            items = items.filter(Tax_Percentage=gst)

        if start_date and end_date:
            items = items.filter(Grn_Detials__Supplier_Bill_Date__range=[start_date, end_date])

        if month and year:
            items = items.filter(
                Grn_Detials__Supplier_Bill_Date__month=month,
                Grn_Detials__Supplier_Bill_Date__year=year
            )

        if year and not month:
            items = items.filter(Grn_Detials__Supplier_Bill_Date__year=year)

        if quarter and year:
            q_map = {"1": (1, 3), "2": (4, 6), "3": (7, 9), "4": (10, 12)}
            m1, m2 = q_map.get(quarter, (1, 12))
            items = items.filter(
                Grn_Detials__Supplier_Bill_Date__year=year,
                Grn_Detials__Supplier_Bill_Date__month__gte=m1,
                Grn_Detials__Supplier_Bill_Date__month__lte=m2
            )

        # ---------------- BILL WISE GROUPING ---------------- #

        bill_summary = {}

        for item in items:
            bill_no = item.Grn_Detials.Supplier_Bill_Number
            bill_date = item.Grn_Detials.Supplier_Bill_Date

            supplier_name = item.Grn_Detials.Supplier_Detials.Supplier_Name
            net_amount = item.Grn_Detials.Net_Amount
            gst_percent = f"{int(Decimal(item.Tax_Percentage or 0))}%"

            taxable = round0(item.Final_Total_Pack_Taxable_Amount)
            gst_amount = round0(item.Final_Total_Pack_Tax_Amount)

            if bill_no not in bill_summary:
                bill_summary[bill_no] = {
                    "bill_no": bill_no,
                    "bill_date": bill_date,
                    "supplier": supplier_name,
                    "total_taxable": 0,
                    "gst_wise_taxable": {},
                    "gst_wise_gst": {},
                    "net_amount": item.Grn_Detials.Net_Amount,
                }

            bill_summary[bill_no]["total_taxable"] += taxable

            bill_summary[bill_no]["gst_wise_taxable"].setdefault(gst_percent, 0)
            bill_summary[bill_no]["gst_wise_taxable"][gst_percent] += taxable

            bill_summary[bill_no]["gst_wise_gst"].setdefault(gst_percent, 0)
            bill_summary[bill_no]["gst_wise_gst"][gst_percent] += gst_amount

            # bill_summary[bill_no]["net_amount"] += taxable + gst_amount

        # ---------------- Dynamic GST Columns ---------------- #

        gst_list = sorted(
            {g for b in bill_summary.values() for g in b["gst_wise_taxable"].keys()}
        )

        gst_columns = []
        for g in gst_list:
            gst_columns.append(f"{g}_Amount")
            gst_columns.append(f"{g}_GST")

        # ---------------- Final Output ---------------- #

        final = []

        for b in bill_summary.values():
            row = {
                "Bill_No": b["bill_no"],
                "Bill_Date": b["bill_date"].strftime('%d-%m-%Y'),
                "Supplier_Name": b["supplier"],
                "Taxable_Amount": b["total_taxable"],  # INTEGER
            }

            for g in gst_list:
                row[f"{g}_Amount"] = b["gst_wise_taxable"].get(g, 0)
                row[f"{g}_GST"] = b["gst_wise_gst"].get(g, 0)

            row["Net_Amount"] = b["net_amount"]  # INTEGER
            final.append(row)

        return JsonResponse({
            "columns": ["Bill_No", "Bill_Date", "Supplier_Name", "Taxable_Amount"]
                       + gst_columns +
                       ["Net_Amount"],
            "data": final
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# @csrf_exempt
# @require_http_methods(["GET"])
# def HSN_Sales_Report(request):
#     try:

#         # 2-decimal formatter
#         def f2(v):
#             return float(f"{v:.2f}")

#         items = OP_BillingItem.objects.select_related(
#             "Billing",
#             "ItemId__Product_Detials",
#             "ItemId__Product_Detials__ProductType",
#         ).order_by("Billing__created_at")

#         # ---------------------- FILTERS ----------------------
#         product = request.GET.get("product")
#         batch = request.GET.get("batch")
#         gst = request.GET.get("gst")
#         start_date = request.GET.get("start_date")
#         end_date = request.GET.get("end_date")
#         month = request.GET.get("month")
#         year = request.GET.get("year")
#         quarter = request.GET.get("quarter")

#         if product:
#             items = items.filter(ItemName__icontains=product)
#         if batch:
#             items = items.filter(BatchNo__icontains=batch)
#         if gst:
#             items = items.filter(ItemId__Product_Detials__GST_Value=gst)
#         if start_date and end_date:
#             items = items.filter(Billing__Billing_Date__range=[start_date, end_date])
#         if month and year:
#             items = items.filter(
#                 Billing__Billing_Date__month=month,
#                 Billing__Billing_Date__year=year
#             )
#         if year and not month:
#             items = items.filter(Billing__Billing_Date__year=year)
#         if quarter and year:
#             q_map = {"1": (1, 3), "2": (4, 6), "3": (7, 9), "4": (10, 12)}
#             m1, m2 = q_map.get(quarter, (1, 12))

#             items = items.filter(
#                 Billing__Billing_Date__year=year,
#                 Billing__Billing_Date__month__gte=m1,
#                 Billing__Billing_Date__month__lte=m2
#             )

#         # ---------------------- GST GROUP TEMPLATE ----------------------
#         def gst_template():
#             return {
#                 "items": {},
#                 "total_qty": 0.0,
#                 "total_taxable": 0.0,
#                 "total_cgst": 0.0,
#                 "total_sgst": 0.0,
#                 "total_gst": 0.0,
#             }

#         gst_data = {
#             "0%": gst_template(),
#             "5%": gst_template(),
#             "12%": gst_template(),
#             "18%": gst_template(),
#         }

#         # ---------------------- GRAND TOTALS ----------------------
#         grand_qty = 0.0
#         grand_taxable = 0.0
#         grand_cgst = 0.0
#         grand_sgst = 0.0
#         grand_gst = 0.0

#         # ---------------------- PROCESS ITEMS ----------------------
#         for item in items:
#             try:
#                 product = item.ItemId.Product_Detials
#                 hsn = product.HSNCode or ""
#                 gst_percent = float(product.GST_Value or 0)
#                 product_type = product.ProductType.ProductType_Name or ""
#             except:
#                 hsn = ""
#                 gst_percent = 0
#                 product_type = ""

#             qty = float(item.Billing_Quantity or 0)
#             rate = float(item.Unit_Price or 0)
#             taxable = qty * rate

#             cgst = taxable * (gst_percent / 2) / 100
#             sgst = taxable * (gst_percent / 2) / 100
#             gst_total = cgst + sgst

#             gst_key = f"{int(gst_percent)}%"
#             if gst_key not in gst_data:
#                 gst_key = "0%"

#             group_key = f"{hsn}|{item.ItemName}|{product_type}"

#             if group_key not in gst_data[gst_key]["items"]:
#                 gst_data[gst_key]["items"][group_key] = {
#                     "HSN": hsn,
#                     "itemName": item.ItemName,
#                     "product_type": product_type,
#                     "qty": 0.0,
#                     "taxable": 0.0,
#                     "CGST": 0.0,
#                     "SGST": 0.0,
#                 }

#             gst_data[gst_key]["items"][group_key]["qty"] += qty
#             gst_data[gst_key]["items"][group_key]["taxable"] += taxable
#             gst_data[gst_key]["items"][group_key]["CGST"] += cgst
#             gst_data[gst_key]["items"][group_key]["SGST"] += sgst

#             gst_data[gst_key]["total_qty"] += qty
#             gst_data[gst_key]["total_taxable"] += taxable
#             gst_data[gst_key]["total_cgst"] += cgst
#             gst_data[gst_key]["total_sgst"] += sgst
#             gst_data[gst_key]["total_gst"] += gst_total

#             grand_qty += qty
#             grand_taxable += taxable
#             grand_cgst += cgst
#             grand_sgst += sgst
#             grand_gst += gst_total

#         # ---------------------- FORMAT GST GROUP OUTPUT ----------------------
#         for key in gst_data:
#             new_items = []
#             for gkey, row in gst_data[key]["items"].items():
#                 new_items.append({
#                     "HSN": row["HSN"],
#                     "itemName": row["itemName"],
#                     "product_type": row["product_type"],
#                     "qty": f2(row["qty"]),
#                     "taxable": f2(row["taxable"]),
#                     "CGST": f2(row["CGST"]),
#                     "SGST": f2(row["SGST"]),
#                 })
#             gst_data[key]["items"] = new_items

#         # ---------------------- GRAND TOTALS ----------------------
#         grand = {
#             "grand_qty": f2(grand_qty),
#             "grand_taxable": f2(grand_taxable),
#             "grand_cgst": f2(grand_cgst),
#             "grand_sgst": f2(grand_sgst),
#             "grand_gst": f2(grand_gst),
#             "grand_with_gst": f2(grand_taxable + grand_gst),
#         }

#         return JsonResponse({
#             "GST_Report": {
#                 key: {
#                     "items": gst_data[key]["items"],
#                     "total_qty": f2(gst_data[key]["total_qty"]),
#                     "total_taxable": f2(gst_data[key]["total_taxable"]),
#                     "total_cgst": f2(gst_data[key]["total_cgst"]),
#                     "total_sgst": f2(gst_data[key]["total_sgst"]),
#                     "total_gst": f2(gst_data[key]["total_gst"]),
#                 }
#                 for key in gst_data
#             },
#             "grand_totals": grand,
#         })

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)


from decimal import Decimal, ROUND_HALF_UP
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


# ---------- MONEY HELPERS ----------
def money(v):
    return Decimal(str(v or 0)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )

def money_json(v):
    return float(money(v))


@csrf_exempt
@require_http_methods(["GET"])
def HSN_Sales_Report(request):
    try:
        # -------- BILL SOURCE (TRUTH) --------
        bills = OP_Pharmacy_Billing_Table_Detials.objects.exclude(
            created_by__in=["host", "admin"]
        ).filter(
            Bill_Status__in=["Paid", "Refunded", "Due"]
        )

        # -------- DATE FILTER --------
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        month = request.GET.get("month")
        year = request.GET.get("year")
        quarter = request.GET.get("quarter")

        if start_date and end_date:
            bills = bills.filter(created_at__date__range=[start_date, end_date])
        elif month and year:
            bills = bills.filter(created_at__month=month, created_at__year=year)
        elif quarter and year:
            q_map = {"1": (1, 3), "2": (4, 6), "3": (7, 9), "4": (10, 12)}
            m1, m2 = q_map.get(quarter, (1, 12))
            bills = bills.filter(
                created_at__year=year,
                created_at__month__gte=m1,
                created_at__month__lte=m2
            )
        elif year:
            bills = bills.filter(created_at__year=year)

        bill_ids = bills.values_list("Billing_Invoice_No", flat=True)

        # -------- ITEMS --------
        items = OP_BillingItem.objects.select_related(
            "Billing",
            "ItemId__Product_Detials",
            "ItemId__Product_Detials__ProductType",
        ).filter(
            Billing_id__in=bill_ids
        )

        # -------- GST STRUCTURE --------
        def gst_block():
            return {
                "items": {},
                "total_qty": Decimal("0"),
                "total_taxable": Decimal("0"),
                "total_cgst": Decimal("0"),
                "total_sgst": Decimal("0"),
                "total_gst": Decimal("0"),
            }

        gst_data = {
            "0%": gst_block(),
            "5%": gst_block(),
            "12%": gst_block(),
            "18%": gst_block(),
        }

        # -------- GRAND TOTALS --------
        grand_qty = Decimal("0")
        grand_taxable = Decimal("0")
        grand_cgst = Decimal("0")
        grand_sgst = Decimal("0")
        grand_gst = Decimal("0")

        # ================= PROCESS ITEMS =================
        for item in items:
            product = item.ItemId.Product_Detials if item.ItemId else None

            hsn = product.HSNCode if product else ""
            gst_percent = money(product.GST_Value if product else 0)
            product_type = (
                product.ProductType.ProductType_Name
                if product and product.ProductType else ""
            )

            qty = money(item.Billing_Quantity)
            rate = money(item.Unit_Price)
            taxable = money(qty * rate)

            cgst = money(taxable * gst_percent / 200)
            sgst = money(taxable * gst_percent / 200)
            gst_total = money(cgst + sgst)

            gst_key = f"{int(gst_percent)}%"
            if gst_key not in gst_data:
                gst_key = "0%"

            group_key = f"{hsn}|{item.ItemName}|{product_type}"

            if group_key not in gst_data[gst_key]["items"]:
                gst_data[gst_key]["items"][group_key] = {
                    "HSN": hsn,
                    "itemName": item.ItemName,
                    "product_type": product_type,
                    "qty": Decimal("0"),
                    "taxable": Decimal("0"),
                    "CGST": Decimal("0"),
                    "SGST": Decimal("0"),
                }

            row = gst_data[gst_key]["items"][group_key]

            row["qty"] += qty
            row["taxable"] += taxable
            row["CGST"] += cgst
            row["SGST"] += sgst

            gst_data[gst_key]["total_qty"] += qty
            gst_data[gst_key]["total_taxable"] += taxable
            gst_data[gst_key]["total_cgst"] += cgst
            gst_data[gst_key]["total_sgst"] += sgst
            gst_data[gst_key]["total_gst"] += gst_total

            grand_qty += qty
            grand_taxable += taxable
            grand_cgst += cgst
            grand_sgst += sgst
            grand_gst += gst_total

        # ================= FORMAT OUTPUT =================
        for key in gst_data:
            gst_data[key]["items"] = [
                {
                    "HSN": r["HSN"],
                    "itemName": r["itemName"],
                    "product_type": r["product_type"],
                    "qty": money_json(r["qty"]),
                    "taxable": money_json(r["taxable"]),
                    "CGST": money_json(r["CGST"]),
                    "SGST": money_json(r["SGST"]),
                }
                for r in gst_data[key]["items"].values()
            ]

        return JsonResponse({
            "GST_Report": {
                key: {
                    "items": gst_data[key]["items"],
                    "total_qty": money_json(gst_data[key]["total_qty"]),
                    "total_taxable": money_json(gst_data[key]["total_taxable"]),
                    "total_cgst": money_json(gst_data[key]["total_cgst"]),
                    "total_sgst": money_json(gst_data[key]["total_sgst"]),
                    "total_gst": money_json(gst_data[key]["total_gst"]),
                }
                for key in gst_data
            },
            "grand_totals": {
                "grand_qty": money_json(grand_qty),
                "grand_taxable": money_json(grand_taxable),
                "grand_cgst": money_json(grand_cgst),
                "grand_sgst": money_json(grand_sgst),
                "grand_gst": money_json(grand_gst),
                "grand_with_gst": money_json(grand_taxable + grand_gst),
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


