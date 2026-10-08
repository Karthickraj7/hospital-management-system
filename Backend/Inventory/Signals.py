from django.db.models.signals import post_migrate,post_save
from django.dispatch import receiver
from .models import (UnitOfMeasurement,Product_field_Details,ProductMaster_Drug_Segment_Details,
                     Product_Category_Product_Details,SubCategory_Detailes,GRN_Product_Item_Detials,
                     Stock_Maintance_Table_Detials,GRN_Table_Detials,Supplier_pay_detials,
                     Supplier_Pay_By_Date,Old_Grn_stock_detials,Product_Master_All_Category_Details,
                     Location_Items_Minimum_Maximum_Detailes,
                     Indent_issue_details_table,Indent_issue_items_details_table,SerialNumber_Stock_Maintance_Table_Detials)
from django.db import transaction
from Masters.models import (Inventory_Location_Master_Detials, NurseStationMaster)
from Finance.models import *

@receiver(post_migrate)
def create_default_productcategory(sender, **kwargs):
    if sender.name == 'Inventory':  # Check for the specific app
        
            
        default_units = [
            # Volume units (Liter)
            {'Unit_Name': 'Milliliter', 'Unit_Symbol': 'ml', 'Unit_Type': 'Volume', 'Base_Unit': 'L', 'Conversion_Factor': 0.001, 'Difference_Description': '1 ml = 0.001 L', 'Created_by': 'system'},
            {'Unit_Name': 'Liter', 'Unit_Symbol': 'L', 'Unit_Type': 'Volume', 'Base_Unit': 'L', 'Conversion_Factor': 1.0, 'Difference_Description': 'Base unit for volume', 'Created_by': 'system'},
            {'Unit_Name': 'Kiloliter', 'Unit_Symbol': 'kl', 'Unit_Type': 'Volume', 'Base_Unit': 'L', 'Conversion_Factor': 1000, 'Difference_Description': '1 kl = 1000 L', 'Created_by': 'system'},

            # Mass units (Kilogram)
            {'Unit_Name': 'Milligram', 'Unit_Symbol': 'mg', 'Unit_Type': 'Mass', 'Base_Unit': 'kg', 'Conversion_Factor': 0.000001, 'Difference_Description': '1 mg = 0.000001 kg', 'Created_by': 'system'},
            {'Unit_Name': 'Gram', 'Unit_Symbol': 'g', 'Unit_Type': 'Mass', 'Base_Unit': 'kg', 'Conversion_Factor': 0.001, 'Difference_Description': '1 g = 0.001 kg', 'Created_by': 'system'},
            {'Unit_Name': 'Kilogram', 'Unit_Symbol': 'kg', 'Unit_Type': 'Mass', 'Base_Unit': 'kg', 'Conversion_Factor': 1.0, 'Difference_Description': 'Base unit for mass', 'Created_by': 'system'},

            # Length units (Meter)
            {'Unit_Name': 'Millimeter', 'Unit_Symbol': 'mm', 'Unit_Type': 'Length', 'Base_Unit': 'm', 'Conversion_Factor': 0.001, 'Difference_Description': '1 mm = 0.001 m', 'Created_by': 'system'},
            {'Unit_Name': 'Centimeter', 'Unit_Symbol': 'cm', 'Unit_Type': 'Length', 'Base_Unit': 'm', 'Conversion_Factor': 0.01, 'Difference_Description': '1 cm = 0.01 m', 'Created_by': 'system'},
            {'Unit_Name': 'Meter', 'Unit_Symbol': 'm', 'Unit_Type': 'Length', 'Base_Unit': 'm', 'Conversion_Factor': 1.0, 'Difference_Description': 'Base unit for length', 'Created_by': 'system'},
            {'Unit_Name': 'Kilometer', 'Unit_Symbol': 'km', 'Unit_Type': 'Length', 'Base_Unit': 'm', 'Conversion_Factor': 1000, 'Difference_Description': '1 km = 1000 m', 'Created_by': 'system'},

            # Length units (Inch)
            {'Unit_Name': 'Inch', 'Unit_Symbol': 'in', 'Unit_Type': 'Length', 'Base_Unit': 'in', 'Conversion_Factor': 1.0, 'Difference_Description': 'Base unit for imperial length', 'Created_by': 'system'},
            {'Unit_Name': 'Foot', 'Unit_Symbol': 'ft', 'Unit_Type': 'Length', 'Base_Unit': 'in', 'Conversion_Factor': 12, 'Difference_Description': '1 ft = 12 in', 'Created_by': 'system'},
            {'Unit_Name': 'Yard', 'Unit_Symbol': 'yd', 'Unit_Type': 'Length', 'Base_Unit': 'in', 'Conversion_Factor': 36, 'Difference_Description': '1 yd = 36 in', 'Created_by': 'system'},
            
            # Gas units
            {'Unit_Name': 'Cubic Meter', 'Unit_Symbol': 'm³', 'Unit_Type': 'Gas', 'Base_Unit': 'm³', 'Conversion_Factor': 1.0, 'Difference_Description': 'Base unit for gas volume', 'Created_by': 'system'},
            {'Unit_Name': 'Liter', 'Unit_Symbol': 'L', 'Unit_Type': 'Gas', 'Base_Unit': 'L', 'Conversion_Factor': 0.001, 'Difference_Description': 'For gas volume conversion', 'Created_by': 'system'},
            {'Unit_Name': 'Cubic Centimeter', 'Unit_Symbol': 'cm³', 'Unit_Type': 'Gas', 'Base_Unit': 'L', 'Conversion_Factor': 0.000001, 'Difference_Description': '1 cm³ = 0.000001 m³', 'Created_by': 'system'},
            {'Unit_Name': 'Standard Cubic Meter', 'Unit_Symbol': 'SCM', 'Unit_Type': 'Gas', 'Base_Unit': 'm³', 'Conversion_Factor': 1.0, 'Difference_Description': 'Standard condition for gas measurement', 'Created_by': 'system'},
        ]

        # Insert the default units if they don't exist
        for unit_data in default_units:
            UnitOfMeasurement.objects.get_or_create(
                Unit_Name=unit_data['Unit_Name'],
                defaults=unit_data
            )
            
        defaults_field_name = [
            {'field_Name': 'Item Code','field_Order':1, 'Create_by': 'system'},
            {'field_Name': 'Item Name','field_Order':2, 'Create_by': 'system'},
            {'field_Name': 'Product Category','field_Order':3, 'Create_by': 'system'},
            {'field_Name': 'Sub Category','field_Order':4, 'Create_by': 'system'},
            {'field_Name': 'Generic Name','field_Order':5, 'Create_by': 'system'},
            {'field_Name': 'Manufacturer Name','field_Order':6, 'Create_by': 'system'},
            {'field_Name': 'HSN Code','field_Order':7, 'Create_by': 'system'},
            {'field_Name': 'Product Type','field_Order':8, 'Create_by': 'system'},
            {'field_Name': 'Product Group','field_Order':9, 'Create_by': 'system'},
            {'field_Name': 'Strength','field_Order':10, 'Create_by': 'system'},
            {'field_Name': 'Volume','field_Order':11, 'Create_by': 'system'},
            {'field_Name': 'Pack Type','field_Order':12, 'Create_by': 'system'},
            {'field_Name': 'Pack Quantity','field_Order':13, 'Create_by': 'system'},
            {'field_Name': 'Minimum Quantity','field_Order':14, 'Create_by': 'system'},
            {'field_Name': 'Maximum Quantity','field_Order':15, 'Create_by': 'system'},
            {'field_Name': 'Re order Level','field_Order':16, 'Create_by': 'system'},
            {'field_Name': 'Is Reusable','field_Order':17, 'Create_by': 'system'},
            {'field_Name': 'Is Sellable','field_Order':18, 'Create_by': 'system'},
            {'field_Name': 'Is Partial Use','field_Order':19, 'Create_by': 'system'},
            {'field_Name': 'Is Perishable','field_Order':20, 'Create_by': 'system'},
            {'field_Name': 'Is Manufacture Date Available','field_Order':21, 'Create_by': 'system'},
            {'field_Name': 'Is Expiry Date Available','field_Order':22, 'Create_by': 'system'},
            {'field_Name': 'Is Serial No Available for each quantity','field_Order':23, 'Create_by': 'system'},
            {'field_Name': 'Drug Segment','field_Order':24, 'Create_by': 'system'},
            {'field_Name': 'Product Description','field_Order':25, 'Create_by': 'system'},
            # {'field_Name': 'Department','field_Order':26, 'Create_by': 'system'},
            # {'field_Name': 'Refer Doctor','field_Order':27, 'Create_by': 'system'},
        ]
        
        for field in defaults_field_name:
            Product_field_Details.objects.get_or_create(
                field_Name=field['field_Name'],
                defaults={'Created_by': field['Create_by'],'field_Order':field['field_Order']}
            )
            
            
        default_drug_segments = [
            {'Segment': 'Notified Drug', 'Create_by': 'system', 'Description': 'Drugs officially notified by government or regulatory authorities for specific control or distribution.'},
            {'Segment': 'Schedule Drug', 'Create_by': 'system', 'Description': 'Drugs classified under specific schedules based on their potential for abuse or medical usage.'},
            {'Segment': 'Schedule-G Drug', 'Create_by': 'system', 'Description': 'Drugs under Schedule-G require medical supervision and are subject to strict regulatory guidelines.'},
            {'Segment': 'Schedule-H1', 'Create_by': 'system', 'Description': 'A category of drugs requiring special prescription and storage due to higher risk of misuse.'},
            {'Segment': 'Narcotic Drug', 'Create_by': 'system', 'Description': 'Drugs that have a high potential for abuse and are strictly controlled.'},
            {'Segment': 'High Risk', 'Create_by': 'system', 'Description': 'Drugs classified as having a high potential for causing adverse effects.'},
            {'Segment': 'Sound Alike', 'Create_by': 'system', 'Description': 'Drugs whose names sound similar to other drugs, which could lead to errors in dispensing or administration.'},
            {'Segment': 'Look Alike', 'Create_by': 'system', 'Description': 'Drugs that have packaging or appearance similar to other drugs, increasing the risk of medication errors.'},
            {'Segment': 'Schedule-H Drug', 'Create_by': 'system', 'Description': 'Drugs that can only be sold by a licensed pharmacist on the prescription of a registered medical practitioner.'},
            {'Segment': 'Schedule-X Drug', 'Create_by': 'system', 'Description': 'Highly controlled drugs, often with psychoactive properties, requiring stringent regulation for sale and distribution.'},
            {'Segment': 'OTC Drug', 'Create_by': 'system', 'Description': 'Over-the-counter drugs that can be purchased without a prescription.'},
            {'Segment': 'Prescription Drug', 'Create_by': 'system', 'Description': 'Medications that require a prescription from a qualified healthcare provider.'},
            {'Segment': 'Controlled Substance', 'Create_by': 'system', 'Description': 'Drugs that are regulated under laws controlling their distribution due to their potential for abuse or dependency.'},
            {'Segment': 'Essential Drug', 'Create_by': 'system', 'Description': 'Drugs deemed necessary for a basic healthcare system, identified by health authorities as vital.'},
            {'Segment': 'Life-Saving Drug', 'Create_by': 'system', 'Description': 'Critical drugs used in life-threatening medical conditions.'},
            {'Segment': 'Banned Drug', 'Create_by': 'system', 'Description': 'Drugs that have been prohibited from sale or use due to safety concerns.'},
            {'Segment': 'Psychotropic Substance', 'Create_by': 'system', 'Description': 'Drugs that affect the mind, emotions, and behavior, often used to treat mental health conditions.'},
            {'Segment': 'Ayurvedic / Herbal Drug', 'Create_by': 'system', 'Description': 'Drugs derived from traditional Ayurvedic or herbal medicine practices.'},
            {'Segment': 'Biologicals', 'Create_by': 'system', 'Description': 'Medications made from living organisms or their products, such as vaccines and blood components.'},
            {'Segment': 'Orphan Drug', 'Create_by': 'system', 'Description': 'Drugs developed for rare diseases or conditions, usually not widely available.'},
            {'Segment': 'Investigational Drug', 'Create_by': 'system', 'Description': 'Drugs still in the research and clinical trial phase, not yet approved for general use.'},
            {'Segment': 'Antibiotics', 'Create_by': 'system', 'Description': 'Drugs specifically used to treat bacterial infections.'},
            {'Segment': 'Vaccines', 'Create_by': 'system', 'Description': 'Biological substances used to provide immunity against specific diseases.'},
        ]

        
        for segment in default_drug_segments:
            ProductMaster_Drug_Segment_Details.objects.get_or_create(
                Segment=segment['Segment'],
                defaults={'Description':segment['Description'],'Created_by': segment['Create_by']}
            )
            
            
        default_category = [
            {
                'Name': 'medical',
                'fields':[20],
                'subCategory':[
                    {'Name':'consumables'},
                    {'Name':'non consumables'},
                ],
                'Created_by': 'system'
            },
            {
                'Name': 'non medical',
                'fields':[20,24],
                'subCategory':[
                    {'Name':'consumables'},
                    {'Name':'non consumables'},
                ],
                'Created_by': 'system'
            },
            {
                'Name': 'surgical',
                'fields':[20],
                'subCategory':[
                    {'Name':'consumables'},
                    {'Name':'non consumables'},
                ],
                'Created_by': 'system'
            },
            {
                'Name': 'Stationary',
                'fields':[1,2,3,4,12,13,18,21,22,23],
                'subCategory':[],
                'Created_by': 'system'
            },
             {
                'Name': 'asset',
                'fields':[1,2,3,4,12,13,18,21,22,23],
                'subCategory':[
                    {'Name':'movable'},
                    {'Name':'non movable'},
                ],
                'Created_by': 'system'
            },
            {
                'Name': 'lenin',
                'fields':[1,2,3,4,12,13,18,21,22,23],
                'subCategory':[],
                'Created_by': 'system'
            },
            {
                'Name': 'kitchen',
                'fields':[1,2,3,4,12,13,18,20,21,22,23],
                'subCategory':[],
                'Created_by': 'system'
            },

             {
                'Name': 'General ',
                'fields':[20],
                'subCategory':[],
                'Created_by': 'system'
            },
           
        
        ]
        if Finance_GroupMaster_Detailes:
            for category_data in default_category:
                category_name = category_data['Name'].upper()
 
               
                category_ins,created = Product_Category_Product_Details.objects.get_or_create(
                    ProductCategory_Name = category_name,
                    LedgerName=category_name,
                    LedgerGroupName=Finance_GroupMaster_Detailes.objects.get(pk=2),
                    OpeningBalance=0,
                    DebitOrCredit='Dr',
                    defaults={'Created_by': category_data['Created_by']}
                )
                if created:
                    product_field_ins =None
                    if category_data['Name'] in ['medical','non medical','surgical']:
                        product_field_ins = Product_field_Details.objects.exclude(pk__in = category_data['fields'])
                    else:
                        product_field_ins = Product_field_Details.objects.filter(pk__in = category_data['fields'])
                   
                    if product_field_ins :
                        category_ins.Product_fields.set(product_field_ins)
                       
                    if category_data['subCategory']:
                        for sub in category_data['subCategory']:
                            sub_cat_name = sub['Name'].upper()
                            SubCategory_Detailes.objects.get_or_create(
                                SubCategoryName  = sub_cat_name,
                                ProductCategoryId = category_ins,
                                defaults={'Created_by': category_data['Created_by']}
                            )
   
   


from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime
from .models import GRN_Product_Item_Detials, Stock_Maintance_Table_Detials

@receiver(post_save, sender=GRN_Product_Item_Detials)
def insert_Stock_Maintance_table(sender, instance, created, **kwargs):
    print('Signal called for:', instance)  # Debugging print to confirm signal is triggered

    try:
        if not instance.Grn_Detials.IsOldGRN and instance.Status == 'Approved':
            print("Processing approved stock..--------------.")  # Debugging print

            CheckSerial = instance.Product_Detials.Is_Serial_No_Available_for_each_quantity

            defaults = {
                'Is_MRP_as_sellable_price': instance.Is_MRP_as_sellable_price,
                'Sellable_price': instance.Sellable_price,
                'Sellable_qty_price': instance.Sellable_qty_price,
                'Is_Manufacture_Date_Available': instance.Is_Manufacture_Date_Available,
                'Manufacture_Date': instance.Manufacture_Date,
                'Is_Expiry_Date_Available': instance.Is_Expiry_Date_Available,
                'Expiry_Date': instance.Expiry_Date,
                'Total_Quantity': instance.Total_Pack_Quantity,
                'Grn_Recieve_Quantity': instance.Total_Pack_Quantity,
                'AvailableQuantity': instance.Total_Pack_Quantity,
                'Created_by': instance.Approved_by,
                'Updated_by': instance.Approved_by,
                'Grn_Details_Item': instance  # Linking GRN item to stock maintenance
            }

            # Add serial number details to defaults if applicable
            if CheckSerial:
                defaults['Is_Serial_No_Available_for_each_quantity'] = True
                defaults['Is_Serial_No_Status'] = 'Pending'

            # Create or update stock details
            Stock_instance, stock_created = Stock_Maintance_Table_Detials.objects.get_or_create(
                Product_Detials=instance.Product_Detials,
                Batch_No=instance.Batch_No,
                Store_location=instance.Grn_Detials.Store_location,
                defaults=defaults
            )

            if not stock_created:
                # Update the stock if it already exists
                print(f"Updating existing stock for Batch No: {instance.Batch_No}")  
                Stock_instance.Total_Quantity += instance.Total_Pack_Quantity
                Stock_instance.Grn_Recieve_Quantity += instance.Total_Pack_Quantity
                Stock_instance.AvailableQuantity += instance.Total_Pack_Quantity
                Stock_instance.Updated_by = instance.Approved_by
                Stock_instance.save()
            else:
                print(f"Created new stock record for Batch No: {instance.Batch_No}")  

        else:
            print(f"Stock update skipped for {instance.Product_Detials} (Not Approved or Old GRN)")  

    except Exception as e:
        print(f"Error in stock update: {str(e)}")  # Log errors for debugging



@receiver(post_save, sender=GRN_Table_Detials)
def insert_supplier_pay_table(sender, instance, created, **kwargs):
    if instance.Status == 'Approved':
        Supplier_pay_detials.objects.get_or_create(
            Grn_Detials=instance,
            defaults={
                'GRN_Invoice_Amount': instance.Net_Amount,
                'GRN_Balance_Amount': instance.Net_Amount,
                'Created_by': instance.Created_by,
            }
        )


@receiver(post_save, sender=Supplier_Pay_By_Date)
def insert_supplier_pay_table(sender, instance, created, **kwargs):
    if created:
        # Access the related Supplier_pay_detials instance
        supplier_pay_details = instance.Supplier_pay_detials
        
        # Update the paid and balance amounts
        supplier_pay_details.GRN_Paid_Amount += instance.Paid_Amount
        supplier_pay_details.GRN_Balance_Amount -= instance.Paid_Amount
        supplier_pay_details.Status = True if supplier_pay_details.GRN_Balance_Amount == 0 else False
        # Save the updated Supplier_pay_detials instance
        supplier_pay_details.save()






@receiver(post_save, sender=Old_Grn_stock_detials)
def update_stock_detials_old_grn_table(sender, instance, created, **kwargs):
    if created:
        Stock_instance, stock_created = Stock_Maintance_Table_Detials.objects.get_or_create(
            Product_Detials=instance.Grn_Detials.Product_Detials,
            Batch_No=instance.Grn_Detials.Batch_No,
            IsWardStore=instance.IsWardStore,
            Store_location=instance.Store_location,
            Ward_Store_location=instance.Ward_Store_location,
            defaults={
                'Is_MRP_as_sellable_price': instance.Grn_Detials.Is_MRP_as_sellable_price,
                'Sellable_price': instance.Grn_Detials.Sellable_price,
                'Sellable_qty_price': instance.Grn_Detials.Sellable_qty_price,
                'Is_Manufacture_Date_Available': instance.Grn_Detials.Is_Manufacture_Date_Available,
                'Manufacture_Date': instance.Grn_Detials.Manufacture_Date,
                'Is_Expiry_Date_Available': instance.Grn_Detials.Is_Expiry_Date_Available,
                'Expiry_Date': instance.Grn_Detials.Expiry_Date,
                'Total_Quantity': instance.TotalPackQuantity,
                'Grn_Recieve_Quantity': instance.TotalPackQuantity,
                'AvailableQuantity': instance.TotalPackQuantity,
                'Created_by': instance.Created_by,
            }
        )

        if not stock_created:
            # Update stock using F() expressions for atomic updates
            print(f"Updating existing stock for Batch No: {instance.Grn_Detials.Batch_No}")  # Debugging print
            Stock_instance.Total_Quantity += instance.TotalPackQuantity
            Stock_instance.Grn_Recieve_Quantity += instance.TotalPackQuantity
            Stock_instance.AvailableQuantity += instance.TotalPackQuantity
            Stock_instance.Updated_by = instance.Created_by
            
            Stock_instance.save()

        else:
            print(f"Created new stock entry for Batch No: {instance.Grn_Detials.Batch_No}")  # Debugging print






@receiver(post_save,sender=Inventory_Location_Master_Detials)
def add_min_max_qty_Inventory_Locations(sender,instance,created,**kwargs):
    if created:
        for ins in Product_Master_All_Category_Details.objects.filter(Status=True) :
            Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                Product_Detailes=ins,
                MinimumQty=ins.MinimumQty,
                MaximumQty=ins.MaximumQty,
                ReorderLevel=ins.ReorderLevel,
                Store_location=instance,
                Created_by=instance.created_by,
            )
    if not created and instance.Status is True:
        min_max_Ins = Location_Items_Minimum_Maximum_Detailes.objects.filter(Store_location=instance)
        
        if min_max_Ins.exists():
            min_max_Ins.update(Status=True)

            existing_product_ids = min_max_Ins.values_list('Product_Detailes__pk', flat=True)
            missing_products = Product_Master_All_Category_Details.objects.exclude(pk__in=existing_product_ids)
            
            for ins in missing_products :
                if ins.Status is True:
                    Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                        Product_Detailes=ins,
                        MinimumQty=ins.MinimumQty,
                        MaximumQty=ins.MaximumQty,
                        ReorderLevel=ins.ReorderLevel,
                        Store_location=instance,
                        Created_by=instance.created_by,
                    )

    if not created and instance.Status is False:
        min_max_Ins = Location_Items_Minimum_Maximum_Detailes.objects.filter(Store_location=instance)
        min_max_Ins.update(Status=False)



@receiver(post_save,sender=NurseStationMaster)
def add_min_max_qty_Ward_Location(sender,instance,created,**kwargs):
    if created:
        for ins in Product_Master_All_Category_Details.objects.filter(Status=True):
            Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                Product_Detailes=ins,
                MinimumQty=ins.MinimumQty,
                MaximumQty=ins.MaximumQty,
                ReorderLevel=ins.ReorderLevel,
                IsNurseStation=True,
                NurseStation_location=instance,
                Created_by=instance.created_by,
            )

    if not created and instance.Status is True:

        min_max_Ins = Location_Items_Minimum_Maximum_Detailes.objects.filter(NurseStation_location=instance)
        if min_max_Ins.exists():
            min_max_Ins.update(Status=True)

            existing_product_ids = min_max_Ins.values_list('Product_Detailes__pk', flat=True)
            missing_products = Product_Master_All_Category_Details.objects.exclude(pk__in=existing_product_ids)

            for ins in missing_products :
                if ins.Status is True:
                    Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                        Product_Detailes=ins,
                        MinimumQty=ins.MinimumQty,
                        MaximumQty=ins.MaximumQty,
                        ReorderLevel=ins.ReorderLevel,
                        IsNurseStation=True,
                        NurseStation_location=instance,
                        Created_by=instance.created_by,
                    )
        else:
            for ins in Product_Master_All_Category_Details.objects.filter(Status=True):
                Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                    Product_Detailes=ins,
                    MinimumQty=ins.MinimumQty,
                    MaximumQty=ins.MaximumQty,
                    ReorderLevel=ins.ReorderLevel,
                    IsNurseStation=True,
                    NurseStation_location=instance,
                    Created_by=instance.created_by,
                )

        
    if not created and (instance.Status is False):
       min_max_Ins = Location_Items_Minimum_Maximum_Detailes.objects.filter(NurseStation_location=instance)
       min_max_Ins.update(Status=False)
    


@receiver(post_save,sender=Product_Master_All_Category_Details)
def add_min_max_qty_Product_create_all_location(sender,instance,created,**kwargs):
    if created:
        for ins in Inventory_Location_Master_Detials.objects.filter(Status=True):
            Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                Product_Detailes=instance,
                MinimumQty=instance.MinimumQty,
                MaximumQty=instance.MaximumQty,
                ReorderLevel=instance.ReorderLevel,
                Store_location=ins,
                Created_by=instance.created_by,
            )
        
        for ins in NurseStationMaster.objects.filter(Status=True):
            Location_Items_Minimum_Maximum_Detailes.objects.get_or_create(
                Product_Detailes=instance,
                MinimumQty=instance.MinimumQty,
                MaximumQty=instance.MaximumQty,
                ReorderLevel=instance.ReorderLevel,
                IsNurseStation=True,
                NurseStation_location=ins,
                Created_by=instance.created_by,
            )
    if not created and instance.Status is False:
        min_max_Ins = Location_Items_Minimum_Maximum_Detailes.objects.filter(Product_Detailes=instance)
        min_max_Ins.update(Status=False)
    if not created and instance.Status is True:
        min_max_Ins = Location_Items_Minimum_Maximum_Detailes.objects.filter(Product_Detailes=instance)
        min_max_Ins.update(Status=True)

from django.db.models.signals import pre_save, post_save, pre_delete
from django.forms.models import model_to_dict
from .models import  StockMaintenanceAudit
from django.core.serializers.json import DjangoJSONEncoder
import json

def serialize_instance(instance):
    return json.loads(
        json.dumps(model_to_dict(instance), cls=DjangoJSONEncoder)
    )


@receiver(post_save, sender=Stock_Maintance_Table_Detials)
def stock_insert(sender, instance, created, **kwargs):

    if created:
        StockMaintenanceAudit.objects.create(
            stock_id=instance.pk,
            operation_type="INSERT",
            new_data=serialize_instance(instance),
            changed_by=instance.Created_by
        )


@receiver(pre_save, sender=Stock_Maintance_Table_Detials)
def stock_update(sender, instance, **kwargs):

    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
        except sender.DoesNotExist:
            return

        StockMaintenanceAudit.objects.create(
            stock_id=instance.pk,
            operation_type="UPDATE",
            old_data=serialize_instance(old_instance),
            new_data=serialize_instance(instance),
            changed_by=instance.Updated_by,
            update_reason=instance.Update_Reason
        )


@receiver(pre_delete, sender=Stock_Maintance_Table_Detials)
def stock_delete(sender, instance, **kwargs):

    StockMaintenanceAudit.objects.create(
        stock_id=instance.pk,
        operation_type="DELETE",
        old_data=serialize_instance(instance),
        changed_by=instance.Updated_by
    )
