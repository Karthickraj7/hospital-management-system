from rest_framework import serializers
from Ip_Workbench.models import IP_Therapy_order_Details

class IP_Therapy_order_Details_Serializers(serializers.ModelSerializer):

    class Meta:
        model = IP_Therapy_order_Details
        fields = '__all__'