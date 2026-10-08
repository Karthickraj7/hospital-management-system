from django.db import models
from Masters.models import *
from Inventory.models import * 
# Create your models here.


class MinMaxForNurseStation(models.Model):
    NurseStation = models.ForeignKey(NurseStationMaster,on_delete=models.CASCADE,related_name='NurseStationId')
    Prod_Stock = models.ForeignKey(Stock_Maintance_Table_Detials,on_delete=models.CASCADE,related_name='Prod_Stock')
    Min_Qty = models.IntegerField(default=0)
    Max_Qty = models.IntegerField(default=0)
    created_by=models.CharField(max_length=70, default='')
    Created_at=models.DateTimeField(auto_now_add=True)
    Updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'MinMaxForNurseStation'