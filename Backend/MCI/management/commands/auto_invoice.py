from django.core.management.base import BaseCommand
from django.db import transaction
from DrugAdminstrations.models import OP_Pharmacy_Billing_Table_Detials

class Command(BaseCommand):
    help = "Regenerate OP Pharmacy Bill numbers sequentially based on created_at"

    def handle(self, *args, **options):
        prefix = "BI/"

        self.stdout.write("Starting Bill number regeneration...")

        with transaction.atomic():
            # Fetch all bills in chronological order
            bills = OP_Pharmacy_Billing_Table_Detials.objects.all().order_by("created_at")

            counter = 1
            for bill in bills:
                # Directly assign Bill_No and save
                bill.Bill_No = f"{prefix}{counter}"
                bill.save()  # no update_fields because of save() override
                counter += 1

        self.stdout.write(
            self.style.SUCCESS("Bill numbers regenerated successfully.")
        )
