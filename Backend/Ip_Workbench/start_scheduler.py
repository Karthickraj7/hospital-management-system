from django.core.management.base import BaseCommand
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, time
from django.utils import timezone
from .models import IP_Intake_Details, IP_Output_Details, Patient_IP_Registration_Detials, Patient_Casuality_Registration_Detials, IP_Balance_Details
import threading

# Functions for calculating input/output
def calculate_total_input(patient_ip=None, patient_casuality=None, start_time=None):
    try:
        if patient_ip:
            print(f"Calculating total input for IP patient {patient_ip.pk}")
            intake_records = IP_Intake_Details.objects.filter(
                Ip_Registration_Id=patient_ip,
                created_at__gte=start_time
            )
        else:
            print(f"Calculating total input for Casuality patient {patient_casuality.pk}")
            intake_records = IP_Intake_Details.objects.filter(
                Casuality_Registration_Id=patient_casuality,
                created_at__gte=start_time
            )
        
        total_input = sum(float(record.Measurement) for record in intake_records if record.Measurement.replace('.', '', 1).isdigit())
        print(f"Total input: {total_input}")
        return total_input
    except Exception as e:
        print(f"Error calculating total input: {e}")
        return 0

def calculate_total_output(patient_ip=None, patient_casuality=None, start_time=None):
    try:
        if patient_ip:
            print(f"Calculating total output for IP patient {patient_ip.pk}")
            output_records = IP_Output_Details.objects.filter(
                Ip_Registration_Id=patient_ip,
                created_at__gte=start_time
            )
        else:
            print(f"Calculating total output for Casuality patient {patient_casuality.pk}")
            output_records = IP_Output_Details.objects.filter(
                Casuality_Registration_Id=patient_casuality,
                created_at__gte=start_time
            )
        
        total_output = sum(float(record.Measurement) for record in output_records if record.Measurement.replace('.', '', 1).isdigit())
        print(f"Total output: {total_output}")
        return total_output
    except Exception as e:
        print(f"Error calculating total output: {e}")
        return 0

# Determine the balance type based on value
def determine_balance_type(balance):
    return 'Positive' if balance >= 0 else 'Negative'

# Main job function to calculate and log input/output details
def log_intake_output_details():
    now = datetime.now()
    one_day_ago = now - timedelta(days=1)

    print('Starting to log intake and output details')
    try:
        patients_ip = Patient_IP_Registration_Detials.objects.all()
        patients_casuality = Patient_Casuality_Registration_Detials.objects.all()

        print(f"Found {patients_ip.count()} IP patients")
        for patient_ip in patients_ip:
            print(f"Processing IP patient {patient_ip.pk}")
            total_input_day = calculate_total_input(patient_ip=patient_ip, start_time=one_day_ago)
            total_output_day = calculate_total_output(patient_ip=patient_ip, start_time=one_day_ago)
            balance = total_input_day - total_output_day
            balanceType = determine_balance_type(balance)

            # Save balance for IP patient
            balance_instance = IP_Balance_Details(
                Ip_Registration_Id=patient_ip,
                totalInputDay=total_input_day,
                totalOutputDay=total_output_day,
                balance=balance,
                balanceType=balanceType,
                DepartmentType='IP',
                Created_by='system'
            )
            balance_instance.save()

            print(balance_instance,'balance_instance')

            print(f"IP Patient {patient_ip.pk} - Total Intake: {total_input_day}, Total Output: {total_output_day}, Balance: {balance}, Balance Type: {balanceType}")

        print(f"Found {patients_casuality.count()} Casuality patients")
        for patient_casuality in patients_casuality:
            print(f"Processing Casuality patient {patient_casuality.pk}")
            total_input_day = calculate_total_input(patient_casuality=patient_casuality, start_time=one_day_ago)
            total_output_day = calculate_total_output(patient_casuality=patient_casuality, start_time=one_day_ago)
            balance = total_input_day - total_output_day
            balanceType = determine_balance_type(balance)

            # Save balance for Casuality patient
            balance_instance = IP_Balance_Details(
                Casuality_Registration_Id=patient_casuality,
                totalInputDay=total_input_day,
                totalOutputDay=total_output_day,
                balance=balance,
                balanceType=balanceType,
                DepartmentType='Casuality',
                Created_by='system'
            )
            balance_instance.save()

            print(f"Casuality Patient {patient_casuality.pk} - Total Intake: {total_input_day}, Total Output: {total_output_day}, Balance: {balance}, Balance Type: {balanceType}")

        print('Intake and output details saved successfully')

    except Exception as e:
        print(f"Error logging intake/output details: {e}")

# Function to start the scheduler
def start_scheduler():
    global scheduler
    scheduler = BackgroundScheduler()

    now = datetime.now()
    next_run_time = datetime.combine(now, time(00, 00))  # Set the time for the task to run daily

    if next_run_time < now:
        next_run_time += timedelta(days=1)

    scheduler.add_job(log_intake_output_details, 'date', run_date=next_run_time)
    print(f'Scheduled job to log intake/output details at {next_run_time}')

    scheduler.start()
    print('Scheduler started successfully')




# def start_scheduler():
#     global scheduler
#     scheduler = BackgroundScheduler()

#     now = timezone.now()
#     next_run_time = datetime.combine(now, time(17, 48))

#     if next_run_time < now:
#         next_run_time += timedelta(days=1)

#     scheduler.add_job(save_balance_details, 'date', run_date=next_run_time)
#     print(f'Scheduled job to save balance details at {next_run_time}')

#     scheduler.start()
#     print('Scheduler started successfully')















