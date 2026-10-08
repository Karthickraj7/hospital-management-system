from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import IPQATimingMaster

@receiver(post_migrate)
def create_default_qa_timing(sender, **kwargs):
    IPQATimingMaster.objects.get_or_create(
        department='IP',
        process='Registration to Assessment Time',
        defaults={'average_time': 30.0, 'status': True}
    )
    # print("✅ Default IPQATimingMaster record ensured after migration.")
