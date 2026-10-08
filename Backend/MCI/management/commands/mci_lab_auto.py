from datetime import date
import random
from django.core.management.base import BaseCommand
from django.db.models import Max
from MCI.models import (
    MCI_Patient_Appointment_Registration_Detials,
    MCI_Lab_Request_Details,
    MCI_Lab_Request_Items_Details
)
from OutPatient.models import Lab_Request_Details, Lab_Request_Items_Details, Location_Detials

from django.db.models import OuterRef, Exists
from django.db.models import IntegerField
from django.db.models.functions import Cast

class Command(BaseCommand):
    help = "Automatically create lab data for today's patients"

    def get_random_lab_request(self):
        try:
            count = Lab_Request_Details.objects.count()
            if count > 0:
                random_index = random.randint(0, count - 1)
                request = Lab_Request_Details.objects.all()[random_index]
                items = Lab_Request_Items_Details.objects.filter(Request=request)
            else:
                items = None
            return items

        except Exception as err:
            print("Error At Get Item |", str(err))
            return None

    def handle(self, *args, **kwargs):
        try:
            today = date.today()
            today_records = (
                    MCI_Patient_Appointment_Registration_Detials.objects
                    .filter(created_at__date=today)
                    .annotate(
                        has_lab=Exists(
                            MCI_Lab_Request_Details.objects.filter(OP_Register_Id=OuterRef('pk'))
                        )
                    )
                    .filter(has_lab=False)
                )

            print(f"Found {today_records.count()} patients for today.")

            for OP_Patient in today_records:
                items = self.get_random_lab_request()

                # while not items:
                #     items = self.get_random_lab_request()

                if not items:
                    continue

                req_id = items.first().Request.Request_Id if items.exists() else None
                register_kwargs = {
                    "RegisterType": "WALK-IN",
                    "OP_Register_Id": OP_Patient,
                    "created_by": OP_Patient.created_by,
                    "Location": OP_Patient.Location,
                    "Remarks": req_id,
                }

                lab_request = MCI_Lab_Request_Details.objects.create(**register_kwargs)
                lab_request.save()
                for test in items:
                    NextItemID = (
                        MCI_Lab_Request_Items_Details.objects
                        .annotate(item_id_int=Cast("Item_Id", IntegerField()))
                        .aggregate(max_id=Max("item_id_int"))["max_id"] or 0
                    ) + 1

                    # Convert to string if Item_Id is a CharField
                    lab_request_item_data = {
                        "Item_Id": str(NextItemID),
                        "Request": lab_request,
                        "TestType": test.TestType,
                        "Service_Status": "Completed",
                        "Analysis_Status": "Completed",
                        "Verify_Status": "Completed",
                        "Approve_Status": "Completed",
                        "SubDepartment_Code": test.SubDepartment_Code,
                        "Department_Code": test.Department_Code,
                        "Test_Code": getattr(test, "Test_Code", None),
                        "Group_Code": getattr(test, "Group_Code", None),
                        "Package_Code": getattr(test, "Package_Code", None),
                    }

                    MCI_Lab_Request_Items_Details.objects.create(**lab_request_item_data)

                print(f"✅ Lab request created for patient ID {OP_Patient.pk}")

        except Exception as err:
            print("Error| " + str(err))





