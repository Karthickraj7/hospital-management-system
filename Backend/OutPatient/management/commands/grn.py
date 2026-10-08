from django.core.management.base import BaseCommand
from django.db import transaction
from Inventory.models import GRN_Table_Detials


class Command(BaseCommand):
    help = "Re-generate GRN and OPT sequences in order of Created_at"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting GRN resquence process...")

        with transaction.atomic():

            # Non Optical GRN
            non_opt = GRN_Table_Detials.objects.filter(is_Optical=False).order_by('Created_at')
            count = 1
            for rec in non_opt:
                rec.GRN_No = f"GRN-{count}"
                rec.save(update_fields=['GRN_No'])
                count += 1

            # Optical GRN
            opt = GRN_Table_Detials.objects.filter(is_Optical=True).order_by('Created_at')
            count = 1
            for rec in opt:
                rec.GRN_No = f"OPT-{count}"
                rec.save(update_fields=['GRN_No'])
                count += 1

        self.stdout.write(self.style.SUCCESS("✔ GRN sequence re-generated successfully!"))
