from rest_framework import serializers
from .models import Lab_Request_Details, Lab_Request_Items_Details, General_Billing_Table_Detials


class Lab_Request_DetailsSerializer(serializers.ModelSerializer):
    Billing_Invoice_No = serializers.PrimaryKeyRelatedField(queryset=General_Billing_Table_Detials.objects.all())

    class Meta:
        model = Lab_Request_Details
        fields = '__all__'

class Lab_Request_Items_DetailsSerializer(serializers.ModelSerializer):
    Request = serializers.PrimaryKeyRelatedField(queryset=Lab_Request_Details.objects.all())

    class Meta:
        model = Lab_Request_Items_Details
        fields = '__all__'
