from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from datetime import datetime, timedelta
from django.utils import timezone
from .models import LIS_MACHINERESULT
from Masters.models import *
from collections import defaultdict




def notify_departments_for_new_samples():
    channel_layer = get_channel_layer()

    # Fetch results from last minute
    one_minute_ago = timezone.now() - timedelta(minutes=1)

    recent_results = LIS_MACHINERESULT.objects.filter(
        Processed_At__gte=one_minute_ago
    )

    print(f"🔍 Found {recent_results.count()} new results since {one_minute_ago}")

    grouped_alerts = defaultdict(list)  # {(sample_no, sub_dept_id): [test_code1, test_code2]}

    for result in recent_results:
        sample_no = result.LIS_SAMPLENO
        test_code = result.LIS_MACHTESTID

        try:
            test_obj = Test_Descriptions.objects.get(Test_Code=test_code)
            sub_department_id = test_obj.sub_department_id
        except Test_Descriptions.DoesNotExist:
            print(f"❌ Test code {test_code} not found.")
            continue

        if not sub_department_id:
            continue

        grouped_alerts[(sample_no, sub_department_id)].append(test_code)

    for (sample_no, sub_department_id), test_codes in grouped_alerts.items():
        try:
            subdepartment = SubLab_Department_Detials.objects.get(SubDepartment_Code=sub_department_id)
            subdepartment_name = subdepartment.SubDepartment_Name
        except SubLab_Department_Detials.DoesNotExist:
            subdepartment_name = "Unknown"

        print(f"📡 Sending alert to dept_{sub_department_id} for sample {sample_no} with tests {test_codes}")

        async_to_sync(channel_layer.group_send)(
            f"dept_{sub_department_id}",
            {
                "type": "alert_message",
                "sample_no": sample_no,
                "test_codes": test_codes,
                "department_code": sub_department_id,
                "department_name": subdepartment_name,
            }
        )