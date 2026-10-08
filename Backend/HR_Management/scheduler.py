from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta
from django.db.models import Q
from .models import ShiftDetails_Master, Notification, Employee_Personal_Form_Detials,NotificationReadStatus
from Masters.models import *
from apscheduler.triggers.combining import AndTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from datetime import time
from django.db import connection


def table_exists(table_name):
    return table_name in connection.introspection.table_names()


def check_shift_deadlines():
    today = date.today()
    notify_date = today + timedelta(days=2)  

    # shifts_expiring = ShiftDetails_Master.objects.filter(ShiftDate=notify_date)
    shifts_expiring = ShiftDetails_Master.objects.using('default').filter(ShiftDate=notify_date)
    if not shifts_expiring.exists():
        print("No shifts expiring soon.")
        return

    # Get employees whose shifts are ending
    employees_ending_shifts = [shift.Employee for shift in shifts_expiring]

    # Fetch HR & HOD users
    hr_users = Employee_Personal_Form_Detials.objects.filter(
        Employee_ID__in=UserRegister_Master_Details.objects.filter(
            role__Role_Name__in=["HR", "HOD"]
        ).values_list("Employee_Id", flat=True)
    )

    if not hr_users.exists():
        print("No HR or HOD found. Skipping notification.")
        return

    created_by_user = Employee_Personal_Form_Detials.objects.filter(Employee_ID="CRTEMPL001").first()

    # Check if a notification already exists today
    hr_notification_exists = Notification.objects.filter(
        notification_type="SHIFT",
        created_at__date=today,
        priority="HIGH"
    ).exists()

    if not hr_notification_exists:
        # Create message listing all employees
        employee_list_str = "\n".join(
            [f"- {emp.First_Name} (Shift End: {notify_date})" for emp in employees_ending_shifts]
        )
        message = f"The following employees have their shifts ending on {notify_date}. Please update their shifts:\n{employee_list_str}"
        notification = Notification.objects.create(
                notification_type="SHIFT",
                message=message,
                created_by=created_by_user,
                priority="HIGH")
        with transaction.atomic():
            all_recipients = hr_users | Employee_Personal_Form_Detials.objects.filter(Employee_ID__in=[emp.Employee_ID for emp in employees_ending_shifts])
            notification.recipients.set(all_recipients)
            notification.shift_id.set(shifts_expiring)
            read_status_entries = [
                NotificationReadStatus(notification=notification, employee=recipient, is_read=False)
                for recipient in all_recipients
            ]
            NotificationReadStatus.objects.bulk_create(read_status_entries)

        print(f"Notification created for shift-ending employees and HRs/HODs.")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_shift_deadlines, CronTrigger(hour='10-19', minute='*/2'))
    scheduler.start()