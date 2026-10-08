from rest_framework import serializers
from datetime import datetime
from .models import *
from Masters.models import *


# def get_dynamic_fields(model_instance, max_depth=3, current_depth=0):
#     if current_depth >= max_depth or model_instance is None:
#         return {}
   
#     result = {}
#     for field in model_instance._meta.fields:
#         field_name = field.name
#         if hasattr(model_instance, field_name):
#             value = getattr(model_instance, field_name)
#             if hasattr(value, '_meta'):  
#                 nested_fields = get_dynamic_fields(value, max_depth, current_depth + 1)
#                 for nested_key, nested_value in nested_fields.items():
#                     result[f"{field_name}_{nested_key}"] = nested_value
#             else:
#                 result[field_name] = value
#     return result




class nursestationstockserializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_Maintance_Table_Detials
        fields = "__all__" 



    def to_representation(self, instance):
        ret = super().to_representation(instance)
        nurse_station = instance.Product_Detials
        for field in nurse_station._meta.fields:
            field_name = field.name
            if hasattr(nurse_station, field_name):
                value = getattr(nurse_station, field_name)
                if hasattr(value, '_meta'):
                    display_field = next(
                        (f.name for f in value._meta.fields if isinstance(f, models.CharField)),
                        value._meta.pk.name
                    )
                    ret[f"{field_name}"] = getattr(value, display_field)
                else:
                    ret[f"{field_name}"] = value
        return ret



class DepartmentLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department_Location_Master_Detials
        fields = '__all__'