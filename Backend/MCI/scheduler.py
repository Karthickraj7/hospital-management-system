# from apscheduler.schedulers.background import BackgroundScheduler
# from apscheduler.triggers.cron import CronTrigger
# from apscheduler.triggers.interval import IntervalTrigger
# from django.core.management import call_command
# from datetime import datetime
# from django.apps import apps
# from django.db import transaction
# import logging
# from zoneinfo import ZoneInfo

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # IST timezone
# IST = ZoneInfo("Asia/Kolkata")

# def generate_fake_op_appointments():
#     """Generate fake OP appointments."""
#     logger.info('Starting fake OP appointment generation')
#     if not apps.is_installed('MCI'):
#         logger.error("MCI app not ready. Skipping.")
#         return
#     # today = datetime.now(IST).date()
#     # with transaction.atomic():
#     #     if AppointmentGenerationLog.objects.filter(date=today).select_for_update().exists():
#     #         logger.info(f"Fake OP appointments already generated for {today}. Skipping.")
#     #         return
#     try:
#         call_command('generate_fake_mci_op_appointments')
#         logger.info("Successfully generated fake MCI OP appointments.")
#     except Exception as e:
#         logger.error(f"Error running generate_fake_mci_op_appointments: {e}")


# def generate_fake_ip_appointments():
#     """Run IP admission management to maintain target count."""
#     logger.info('Starting fake IP admission management')
#     if not apps.is_installed('MCI'):
#         logger.error("MCI app not ready. Skipping.")
#         return
#     try:
#         call_command('manage_ip_admissions')
#         logger.info("Successfully managed fake MCI IP admissions.")
#     except Exception as e:
#         logger.error(f"Error running manage_ip_admissions: {e}")

# def generate_fake_Lab_Radiology_appointments():
#     """Run LR admission management to maintain target count."""
#     logger.info('Starting fake LR admission management')
#     if not apps.is_installed('MCI'):
#         logger.error("MCI app not ready. Skipping.")
#         return
#     try:
#         call_command('generate_lab_radiology_appointments')
#         logger.info("Successfully managed fake MCI Lab Radiology appointments.")
#     except Exception as e:
#         logger.error(f"Error running generate_lab_radiology_appointments: {e}")


# def start_scheduler():
#     """Start a single scheduler for OP and IP jobs."""
#     scheduler = BackgroundScheduler(timezone=IST)
#     scheduler.remove_all_jobs()  # Clear existing jobs to prevent duplicates

#     # Schedule OP appointments daily at 14:55 IST
#     # scheduler.add_job(
#     #     generate_fake_op_appointments,
#     #     trigger=IntervalTrigger(minutes=1, timezone=IST),
#     #     id='op_appointment_job',
#     #     replace_existing=True
#     # )

#     # scheduler.add_job(
#     #     generate_fake_Lab_Radiology_appointments,
#     #     trigger=IntervalTrigger(minutes=1, timezone=IST),
#     #     id='lr_appointment_job',
#     #     replace_existing=True
#     # )

#     # Schedule IP admission management every 4 hours
#     # scheduler.add_job(
#     #     generate_fake_ip_appointments,
#     #     # trigger=CronTrigger(hour=18, minute=52, timezone=IST),
#     #     trigger=IntervalTrigger(minutes=1, timezone=IST),
#     #     id='ip_appointment_job',
#     #     replace_existing=True
#     # )

#     try:
#         scheduler.start()
#         logger.info("Scheduler started for fake OP and IP tasks")
#     except Exception as e:
#         logger.error(f"Error starting scheduler: {e}")




from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django.core.management import call_command
from datetime import datetime, time
from django.apps import apps
import logging
from zoneinfo import ZoneInfo

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# IST timezone
IST = ZoneInfo("Asia/Kolkata")

def is_within_op_hours():
    """Check if current time is within OP hours (8:30 to 12:30)"""
    now = datetime.now(IST)
    current_time = now.time()
    
    # Monday to Saturday: 8:30 to 12:30
    if now.weekday() < 6:  # 0-5 = Monday to Saturday
        return time(8, 30) <= current_time <= time(12, 30)
    else:  # Sunday
        return False

def is_within_emergency_hours():
    """Check if current time is within emergency hours (13:00 to 17:00)"""
    now = datetime.now(IST)
    current_time = now.time()
    
    # Monday to Saturday: 13:00 to 17:00 (after 30 min gap from 12:30)
    if now.weekday() < 6:
        return time(13, 0) <= current_time <= time(17, 0)
    else:  # Sunday: anytime for emergency
        return True

def generate_fake_op_appointments():
    """Generate fake OP appointments - ORIGINAL + FAKE with department constraints"""
    if not is_within_op_hours():
        logger.info('Outside OP hours (8:30-12:30). Skipping OP appointment generation.')
        return
        
    logger.info('Starting fake OP appointment generation - Adding fake to original')
    if not apps.is_installed('MCI'):
        logger.error("MCI app not ready. Skipping.")
        return
    try:
        call_command('generate_fake_mci_op_appointments')
        logger.info("""
        Successfully generated fake MCI OP appointments (Original + Fake) with constraints:
        - Pediatrics: <15 years only (Any gender)
        - Obstetrics: >18 and <=45 years only (FEMALE only)
        - Gynecology: FEMALE only (Any age)
        - Other departments: No gender/age restrictions
        """)
    except Exception as e:
        logger.error(f"Error running generate_fake_mci_op_appointments: {e}")

def generate_fake_followup_op_appointments():
    """Generate fake follow-up OP appointments - ORIGINAL + FAKE with constraints"""
    if not is_within_op_hours():
        logger.info('Outside OP hours (8:30-12:30). Skipping follow-up appointment generation.')
        return
        
    logger.info('Starting fake follow-up OP appointment generation - Adding fake to original')
    if not apps.is_installed('MCI'):
        logger.error("MCI app not ready. Skipping.")
        return
    try:
        call_command('generate_fake_mci_followup_Appointments')
        logger.info("""
        Successfully generated fake MCI follow-up OP appointments (Original + Fake) with constraints:
        - Pediatrics: <15 years only (Any gender)
        - Obstetrics: >18 and <=45 years only (FEMALE only) 
        - Gynecology: FEMALE only (Any age)
        """)
    except Exception as e:
        logger.error(f"Error running generate_fake_mci_followup_Appointments: {e}")

def generate_fake_ip_appointments():
    """Run IP admission management - ORIGINAL + FAKE with constraints"""
    if not is_within_emergency_hours():
        logger.info('Outside emergency hours (13:00-17:00). Skipping IP admission management.')
        return
        
    logger.info('Starting fake IP admission management - Adding fake to original')
    if not apps.is_installed('MCI'):
        logger.error("MCI app not ready. Skipping.")
        return
    try:
        call_command('manage_ip_admissions')
        logger.info("""
        Successfully managed fake MCI IP admissions (Original + Fake) with constraints:
        - Pediatrics: <15 years only (Any gender)
        - Obstetrics: >18 and <=45 years only (FEMALE only)
        - Gynecology: FEMALE only (Any age)
        - Emergency: All departments with constraints
        """)
    except Exception as e:
        logger.error(f"Error running manage_ip_admissions: {e}")

def generate_fake_Lab_Radiology_appointments():
    """Run LR admission management - ORIGINAL + FAKE"""
    now = datetime.now(IST)
    
    if now.weekday() < 6:  # Monday to Saturday
        if not (is_within_op_hours() or is_within_emergency_hours()):
            logger.info('Outside working hours. Skipping LR appointments.')
            return
    # Sunday: emergency only
    elif not is_within_emergency_hours():
        return
            
    logger.info('Starting fake LR admission management - Adding fake to original')
    if not apps.is_installed('MCI'):
        logger.error("MCI app not ready. Skipping.")
        return
    try:
        call_command('generate_lab_radiology_appointments')
        logger.info("Successfully managed fake MCI Lab Radiology appointments (Original + Fake).")
    except Exception as e:
        logger.error(f"Error running generate_lab_radiology_appointments: {e}")

def lab_data_generate():
    """Run auto lab requests - ORIGINAL + FAKE"""
    now = datetime.now(IST)
    
    if now.weekday() < 6:  # Monday to Saturday
        if not (is_within_op_hours() or is_within_emergency_hours()):
            logger.info('Outside working hours. Skipping lab data generation.')
            return
    # Sunday: emergency only
    elif not is_within_emergency_hours():
        return
            
    logger.info('Starting Auto Lab Requests - Adding fake to original')
    if not apps.is_installed('MCI'):
        logger.error("MCI app not ready. Skipping.")
        return
    try:
        call_command('mci_lab_auto')
        logger.info("Successfully generated MCI Lab data (Original + Fake).")
    except Exception as e:
        logger.error(f"Error running mci_lab_auto: {e}")

def start_scheduler():
    """Start scheduler with time constraints and department constraints"""
    scheduler = BackgroundScheduler(timezone=IST)
    scheduler.remove_all_jobs()

    today = datetime.now(IST).date()
    
    # Start and end times
    op_start_time = datetime.combine(today, time(8, 30))
    op_end_time = datetime.combine(today, time(12, 30))
    emergency_start_time = datetime.combine(today, time(13, 0))
    emergency_end_time = datetime.combine(today, time(17, 0))

    # # OP appointments (8:30-12:30) - ORIGINAL + FAKE
    # scheduler.add_job(
    #     generate_fake_op_appointments,
    #     trigger=IntervalTrigger(
    #         minutes=1, 
    #         start_date=op_start_time, 
    #         end_date=op_end_time,
    #         timezone=IST
    #     ),
    #     id='op_appointment_job',
    #     replace_existing=True
    # )

    # # Follow-up OP appointments (8:30-12:30) - ORIGINAL + FAKE
    # scheduler.add_job(
    #     generate_fake_followup_op_appointments,
    #     trigger=IntervalTrigger(
    #         minutes=1, 
    #         start_date=op_start_time, 
    #         end_date=op_end_time,
    #         timezone=IST
    #     ),
    #     id='followup_op_appointment_job',
    #     replace_existing=True
    # )

    # # Emergency appointments (13:00-17:00) - ORIGINAL + FAKE
    # scheduler.add_job(
    #     generate_fake_ip_appointments,
    #     trigger=IntervalTrigger(
    #         minutes=1, 
    #         start_date=emergency_start_time, 
    #         end_date=emergency_end_time,
    #         timezone=IST
    #     ),
    #     id='ip_appointment_job',
    #     replace_existing=True
    # )

    # # Lab & Radiology (8:30-17:00) - ORIGINAL + FAKE
    # scheduler.add_job(
    #     generate_fake_Lab_Radiology_appointments,
    #     trigger=IntervalTrigger(
    #         minutes=1, 
    #         start_date=op_start_time, 
    #         end_date=emergency_end_time,
    #         timezone=IST
    #     ),
    #     id='lr_appointment_job',
    #     replace_existing=True
    # )

    # # Lab data generation (8:30-17:00) - ORIGINAL + FAKE
    # scheduler.add_job(
    #     lab_data_generate,
    #     trigger=IntervalTrigger(
    #         minutes=1, 
    #         start_date=op_start_time, 
    #         end_date=emergency_end_time,
    #         timezone=IST
    #     ),
    #     id='lab_data_job',
    #     replace_existing=True
    # )

    try:
        scheduler.start()
        logger.info(f"""
        🏥 SCHEDULER STARTED WITH DEPARTMENT CONSTRAINTS:
        
        📅 SCHEDULE:
        - Monday-Saturday: 8:30 AM - 12:30 PM (OP) + 1:00 PM - 5:00 PM (Emergency)
        - Sunday: Emergency only
        
        👥 PATIENT TOTALS (Real + Fake):
        - OP Hours: 1400-1450 patients
        - Emergency: 100-110 patients
        
        🎯 DEPARTMENT CONSTRAINTS:
        - PEDIATRICS: <15 years only (Any gender)
        - OBSTETRICS: >18 and <=35 years only (FEMALE only)
        - GYNECOLOGY: >=40 FEMALE only (Any age)
        - Other departments: No restrictions
        
        💾 DATA: Original Real Patients + Fake Generated Patients
        """)
    except Exception as e:
        logger.error(f"Error starting scheduler: {e}")

