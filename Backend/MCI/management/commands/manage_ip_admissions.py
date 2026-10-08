# import random
# from datetime import timedelta
# from django.core.management.base import BaseCommand
# from django.db import transaction
# from django.utils import timezone
# from faker import Faker
# from MCI.models import (
#     MCI_Patient_IP_Registration_Detials,
#     MCI_Patient_Admission_Detials,
#     MCI_Patient_Admission_Room_Detials,
#     MCI_Room_Master_Detials,
#     MCI_Patient_Detials,
#     MCI_Patient_Discharge_Detials,
#     MCI_Patient_Appointment_Registration_Detials,
# )
# from Masters.models import (
#     Doctor_ProfessForm_Detials,
#     Insurance_Master_Detials,
#     Client_Master_Detials,
#     Corporate_Master_Detials,
#     Donation_Master_Detials,
#     Employee_Personal_Form_Detials,
#     Location_Detials,
# )
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def generate_fake_ip_registration_id(current_year_month):
#     """Generate a unique Registration_Id with FIP prefix."""
#     prefix = f"FIP{current_year_month}"
#     with transaction.atomic():
#         matching_entries = MCI_Patient_IP_Registration_Detials.objects.select_for_update().filter(
#             Registration_Id__startswith=prefix
#         ).values_list('Registration_Id', flat=True)
#         if matching_entries:
#             numeric_parts = [
#                 int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
#             ]
#             next_number = max(numeric_parts) + 1 if numeric_parts else 1
#         else:
#             next_number = 1
#         return f"{prefix}{next_number}"


# def get_age_value(age_str):
#     """Extract numeric age from a string."""
#     try:
#         if not age_str:  # Handle None or empty string
#             return 0
#         if isinstance(age_str, (int, float)):
#             return int(age_str)
#         if age_str.isdigit():
#             return int(age_str)
#         parts = age_str.split()
#         for part in parts:
#             if part.isdigit():
#                 return int(part)
#         return 0
#     except (ValueError, AttributeError) as e:
#         logger.error(f"Invalid age format: {age_str}, Error: {e}")
#         return 0


# class Command(BaseCommand):
#     help = 'Manage IP admissions to maintain a target of 640 active admissions'

#     def handle(self, *args, **kwargs):
#         now = timezone.now()
#         fake = Faker()
#         target_admissions = 640
#         discharge_after_days = 2
#         current_year_month = now.strftime('%y%m')  # e.g., '2506' for June 2025

#         department_ranges = {

#             {
#                 'Dept': 'ENT',
#                 'BED OCCUPANCY' : (120,130),
#                 'TOTAL BED' : 150
#             },
#             {
#                 'Dept': 'GENERAL SURGERY',
#                 'BED OCCUPANCY' : (120,130),
#                 'TOTAL BED' : 150
#             },
#             {
#                 'Dept': 'GYNECOLOGY',
#                 'BED OCCUPANCY' : (25,40),
#                 'TOTAL BED' : 45
#             },
#             {
#                 'Dept': 'ORTHOPEDIC',
#                 'BED OCCUPANCY' : (48,54),
#                 'TOTAL BED' : 60
#             },
#             {
#                 'Dept': 'PEDIATRICS',
#                 'BED OCCUPANCY' : (60,65),
#                 'TOTAL BED' : 75
#             },
#             {
#                 'Dept': 'OPTHALMOLOGY',
#                 'BED OCCUPANCY' : (16,18),
#                 'TOTAL BED' : 20
#             },
#             {
#                 'Dept': 'DERMATOLOGY',
#                 'BED OCCUPANCY' : (7,8),
#                 'TOTAL BED' : 10
#             },
#             {
#                 'Dept': 'TB&CHEST',
#                 'BED OCCUPANCY' : (16,18),
#                 'TOTAL BED' : 20
#             },




#         }

           



#         # Use a transaction to ensure data consistency
#         with transaction.atomic():
#             # Step 1: Discharge patients admitted for more than 2 days
#             # admissions_to_discharge = MCI_Patient_Admission_Room_Detials.objects.filter(
#             #     CurrentlyStayed=True,
#             #     Admitted_Date__lt=now - timedelta(days=discharge_after_days)
#             # )
#             # discharged_count = 0
#             # for admission in admissions_to_discharge:
#             #     admission.Discharge_Date = now
#             #     admission.CurrentlyStayed = False
#             #     admission.save()

#             #     # Update room status to Available
#             #     room = admission.RoomId
#             #     room.Booking_Status = 'Available'
#             #     room.save()

#             #     # Create discharge record
#             #     MCI_Patient_Discharge_Detials.objects.create(
#             #         Registration_Id=admission.IP_Registration_Id,
#             #         Discharge_Date=now,
#             #         Discharge_Reason='Routine Discharge after 2 days',
#             #         created_by='system'
#             #     )
#             #     discharged_count += 1

#             #     # Update IP registration status
#             #     ip_reg = MCI_Patient_IP_Registration_Detials.objects.filter(
#             #         Registration_Id=admission.IP_Registration_Id
#             #     ).first()
#             #     if ip_reg:
#             #         ip_reg.Status = 'Completed'
#             #         ip_reg.save()

#             # # Log and report discharges
#             # logger.info(f"Discharged {discharged_count} patients.")
#             # self.stdout.write(self.style.SUCCESS(f'Discharged {discharged_count} patients.'))

#             # Step 2: Count current active IP admissions
#             active_admissions = MCI_Patient_Admission_Room_Detials.objects.filter(
#                 CurrentlyStayed=True
#             ).count()
#             logger.info(f"Current active IP admissions: {active_admissions}")

#             # Step 3: Generate fake IP registrations if below target
#             if active_admissions < target_admissions:
#                 num_to_create = target_admissions - active_admissions
#                 logger.info(f"Generating {num_to_create} fake IP admissions.")

#                 # Fetch patients not in active OP or IP
#                 active_op_patients = MCI_Patient_Appointment_Registration_Detials.objects.filter(
#                     Status='Registered'
#                 ).values_list('PatientId', flat=True)
#                 active_ip_patients = MCI_Patient_Admission_Room_Detials.objects.filter(
#                     CurrentlyStayed=True
#                 ).values_list('IP_Registration_Id__PatientId', flat=True)
#                 available_patients = MCI_Patient_Detials.objects.exclude(
#                     PatientId__in=active_op_patients
#                 ).exclude(
#                     PatientId__in=active_ip_patients
#                 )

#                 # Fetch available rooms
#                 available_rooms = MCI_Room_Master_Detials.objects.filter(Booking_Status='Available')

#                 for dep in department_ranges:               
#                     if dep == 'ENT':
#                         entrooms = MCI_Room_Master_Detials.objects.filter(Booking_Status='Available',Ward_Name__Ward_Name__Ward_Name__in=['FEMALE ENT','MALE ENT'])
#                     elif dep == 'GYNECOLOGY':
#                         gynrooms =  MCI_Room_Master_Detials.objects.filter(Booking_Status='Available',Ward_Name__Ward_Name__Ward_Name__in=['GYNAECOLOGY'])
#                     elif dep == 'ORTHOPEDIC':
#                         ortrooms =  MCI_Room_Master_Detials.objects.filter(Booking_Status='Available',Ward_Name__Ward_Name__Ward_Name__in=['MALE ORTHO','FEMALE ORTHO'])            
#                     elif dep == 'OPTHALMOLOGY':
#                         opthrooms =  MCI_Room_Master_Detials.objects.filter(Booking_Status='Available',Ward_Name__Ward_Name__Ward_Name__in=['MALE OPTHALMOLOGY','FEMALE OPTHALMOLOGY'])
                        
#                     elif dep == 'PEDIATRICS':
#                         pedrooms =  MCI_Room_Master_Detials.objects.filter(Booking_Status='Available',Ward_Name__Ward_Name__Ward_Name__in=['PAEDIATRICS'])

#                     elif dep == 'DERMATOLOGY':
#                         derrooms =  MCI_Room_Master_Detials.objects.filter(Booking_Status='Available',Ward_Name__Ward_Name__Ward_Name__in=['MALE DERMATOLOGY','FEMALE DERMATOLOGY'])

                
             

#                 # Fetch doctor_specs for IP department
#                 doctor_specs = Doctor_ProfessForm_Detials.objects.filter(
#                     Specialization__isnull=False,
#                     Department__Department_Name='IP'
#                 ).exclude(
#                     Specialization__Speciality_Name__in=['ANAESTHESIOLOGIST', 'HEMATOLOGY', 'RADIOLOGY']
#                 ).select_related('Doctor_ID', 'Specialization').distinct()

#                 # Fetch other master data for patient category
#                 insurances = list(Insurance_Master_Detials.objects.all())
#                 clients = list(Client_Master_Detials.objects.all())
#                 corporates = list(Corporate_Master_Detials.objects.all())
#                 donations = list(Donation_Master_Detials.objects.all())
#                 employees = list(Employee_Personal_Form_Detials.objects.all())
#                 locations = list(Location_Detials.objects.all())

#                 # Check if we have enough resources
#                 if not available_patients.exists() or not available_rooms.exists() or not doctor_specs.exists():
#                     self.stdout.write(self.style.ERROR('Not enough available patients, rooms, or IP doctors to create new admissions.'))
#                     return

#                 # Convert querysets to lists for random selection
#                 available_patients_list = list(available_patients)
#                 available_rooms_list = list(available_rooms)
#                 doctor_specs_list = list(doctor_specs)

#                 created_count = 0
#                 for _ in range(num_to_create):
#                     if not available_patients_list or not available_rooms_list:
#                         logger.warning(f"Stopped after {created_count} admissions due to insufficient patients or rooms.")
#                         self.stdout.write(self.style.WARNING(
#                             f'Not enough available patients or rooms after creating {created_count} admissions.'
#                         ))
#                         break

#                     # Select random room, doctor_spec, and location
#                     room = random.choice(available_rooms_list)
#                     doctor_spec = random.choice(doctor_specs_list)
#                     doctor = doctor_spec.Doctor_ID
#                     specialization = doctor_spec.Specialization
#                     location = random.choice(locations) if locations else None

#                     # Filter patients based on specialization
#                     if specialization.Speciality_Name == 'GYNECOLOGY':
#                         filtered_patients = [p for p in available_patients if p.Gender == 'Female' and get_age_value(p.Age) > 45]
#                     elif specialization.Speciality_Name == 'PEADIATRICS':
#                         filtered_patients = [p for p in available_patients if get_age_value(p.Age) < 15]
#                     elif specialization.Speciality_Name == 'OPTHALMOLOGY':
#                         filtered_patients = [p for p in available_patients if get_age_value(p.Age) > 50]
#                     elif specialization.Speciality_Name == 'OBST&GYNECOLOGY':
#                         filtered_patients = [p for p in available_patients if p.Gender == 'Female' and get_age_value(p.Age) < 28]       
#                     else:
#                         filtered_patients = available_patients

#                     if not filtered_patients:
#                         logger.warning(f"No suitable patients for {specialization.Speciality_Name} specialization. Skipping admission.")
#                         continue

#                     # Select random patient from filtered list
#                     patient = random.choice(filtered_patients)

#                     # Patient category
#                     patient_category = random.choice(['General', 'Student', 'FreeAll','Insurance'])
#                     insurance = None
#                     insurance_type = None
#                     client = None
#                     client_type = None
#                     client_employee_id = None
#                     client_employee_designation = None
#                     client_employee_relation = None
#                     corporate = None
#                     corporate_type = None
#                     corporate_employee_id = None
#                     corporate_employee_designation = None
#                     corporate_employee_relation = None
#                     employee = None
#                     employee_relation = None
#                     doctor_id = None
#                     doctor_relation = None
#                     donation = None

#                     if patient_category == 'Insurance' and insurances:
#                         insurance = random.choice(insurances)
#                         insurance_type = random.choice(['HMO', 'PPO', 'POS'])
#                     elif patient_category == 'Client' and clients:
#                         client = random.choice(clients)
#                         client_type = random.choice(['Individual', 'Family'])
#                         client_employee_id = fake.uuid4()[:8]
#                         client_employee_designation = random.choice(['Manager', 'Engineer'])
#                         client_employee_relation = random.choice(['Self', 'Spouse'])
#                     elif patient_category == 'Corporate' and corporates:
#                         corporate = random.choice(corporates)
#                         corporate_type = random.choice(['Private', 'Public'])
#                         corporate_employee_id = fake.uuid4()[:8]
#                         corporate_employee_designation = random.choice(['Executive', 'Analyst'])
#                         corporate_employee_relation = random.choice(['Self', 'Spouse'])
#                     elif patient_category in ['Employee', 'EmployeeRelation'] and employees:
#                         employee = random.choice(employees)
#                         employee_relation = random.choice(['Self', 'Spouse'])
#                     elif patient_category in ['Doctor', 'DoctorRelation'] and doctor_specs:
#                         doctor_id = random.choice(doctor_specs).Doctor_ID
#                         doctor_relation = random.choice(['Self', 'Spouse'])
#                     elif patient_category == 'Donation' and donations:
#                         donation = random.choice(donations)

#                     # Generate unique Registration_Id with FIP prefix
#                     registration_id = generate_fake_ip_registration_id(current_year_month)

#                     # Create IP registration
#                     ip_reg = MCI_Patient_IP_Registration_Detials(
#                         Registration_Id=registration_id,
#                         PatientId=patient,
#                         Specialization=specialization,
#                         PrimaryDoctor=doctor,
#                         Complaint=fake.paragraph(nb_sentences=2),
#                         IsMLC=random.choice(['Yes', 'No']) if random.random() > 0.5 else 'No',
#                         IsReferral='No',
#                         PatientCategory=patient_category,
#                         InsuranceName=insurance,
#                         InsuranceType=insurance_type,
#                         ClientName=client,
#                         ClientType=client_type,
#                         ClientEmployeeId=client_employee_id,
#                         ClientEmployeeDesignation=client_employee_designation,
#                         ClientEmployeeRelation=client_employee_relation,
#                         CorporateName=corporate,
#                         CorporateType=corporate_type,
#                         CorporateEmployeeId=corporate_employee_id,
#                         CorporateEmployeeDesignation=corporate_employee_designation,
#                         CorporateEmployeeRelation=corporate_employee_relation,
#                         EmployeeId=employee,
#                         EmployeeRelation=employee_relation,
#                         DoctorId=doctor_id,
#                         DoctorRelation=doctor_relation,
#                         DonationType=donation,
#                         Status='Admitted',
#                         Booking_Status='Booked',
#                         Location=location,
#                         created_by='system'
#                     )
#                     ip_reg.save()

#                     # Create admission details
#                     admission_details = MCI_Patient_Admission_Detials(
#                         IP_Registration_Id=ip_reg,
#                         AdmissionPurpose='Routine Admission',
#                         DrInchargeAtTimeOfAdmission=doctor,
#                         NextToKinName=fake.name() if random.random() > 0.5 else None,
#                         Relation=random.choice(['Spouse', 'Parent', 'Sibling']) if random.random() > 0.5 else None,
#                         RelativePhoneNo=fake.phone_number()[:30] if random.random() > 0.5 else None,
#                         visitDate=now.date(),
#                         visitTime=now.time(),
#                         created_by='system'
#                     )
#                     admission_details.save()

#                     # Create admission room details
#                     admission_room = MCI_Patient_Admission_Room_Detials(
#                         RegisterType='IP',
#                         IP_Registration_Id=ip_reg,
#                         RoomId=room,
#                         Admitted_Date=now,
#                         Status=True,
#                         IsStayed=True,
#                         CurrentlyStayed=True,
#                         Iscanceled=False,
#                         created_by='system'
#                     )
#                     admission_room.save()

#                     # Update room status to Occupied
#                     room.Booking_Status = 'Occupied'
#                     room.save()

#                     # Remove used patient and room from lists
#                     available_patients_list.remove(patient)
#                     available_rooms_list.remove(room)
#                     created_count += 1

#                 # Log and report new admissions
#                 logger.info(f"Created {created_count} new IP admissions.")
#                 self.stdout.write(self.style.SUCCESS(f'Created {created_count} new IP admissions.'))

#             else:
#                 self.stdout.write(self.style.SUCCESS('Active IP admissions already at or above target. No new admissions created.'))

#         # Final success message
#         self.stdout.write(self.style.SUCCESS('Successfully managed IP admissions'))
#         logger.info("IP admission management completed successfully.")


import logging
import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from faker import Faker
from MCI.models import (
    MCI_Patient_IP_Registration_Detials,
    MCI_Patient_Admission_Detials,
    MCI_Patient_Admission_Room_Detials,
    MCI_Room_Master_Detials,
    MCI_Patient_Detials,
    MCI_Patient_Discharge_Detials,
    MCI_Patient_Appointment_Registration_Detials,
)
from Masters.models import (
    Doctor_ProfessForm_Detials,
    Insurance_Master_Detials,
    Client_Master_Detials,
    Corporate_Master_Detials,
    Donation_Master_Detials,
    Employee_Personal_Form_Detials,
    Location_Detials,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_fake_ip_registration_id(current_year_month):
    """Generate a unique Registration_Id with FIP prefix."""
    prefix = f"FIP{current_year_month}"
    with transaction.atomic():
        matching_entries = MCI_Patient_IP_Registration_Detials.objects.select_for_update().filter(
            Registration_Id__startswith=prefix
        ).values_list('Registration_Id', flat=True)
        numeric_parts = [
            int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
        ]
        next_number = max(numeric_parts) + 1 if numeric_parts else 1
        return f"{prefix}{next_number}"

def get_age_value(age_str):
    """Extract numeric age from a string."""
    try:
        if not age_str:
            return 0
        if isinstance(age_str, (int, float)):
            return int(age_str)
        if isinstance(age_str, str) and age_str.isdigit():
            return int(age_str)
        parts = str(age_str).split()
        for part in parts:
            if part.isdigit():
                return int(part)
        return 0
    except (ValueError, AttributeError) as e:
        logger.error(f"Invalid age format: {age_str}, Error: {e}")
        return 0

class Command(BaseCommand):
    help = 'Manage IP admissions to maintain a target of 640 active admissions'

    def handle(self, *args, **kwargs):
        try:
            now = timezone.now()
            fake = Faker()
            target_admissions = 640
            discharge_after_days = 2
            current_year_month = now.strftime('%y%m')

            department_ranges = [
                {'Dept': 'ENT', 'BED OCCUPANCY': (120, 130), 'TOTAL BED': 150, 'WARDS': ['FEMALE ENT', 'MALE ENT']},
                {'Dept': 'SURGERY', 'BED OCCUPANCY': (120, 130), 'TOTAL BED': 150, 'WARDS': ['MALE SURGERY', 'FEMALE SURGERY']},
                {'Dept': 'GENERAL MEDICINE', 'BED OCCUPANCY': (120, 130), 'TOTAL BED': 150, 'WARDS': ['MALE MEDICINE', 'FEMALE MEDICINE']},
                {'Dept': 'GYNECOLOGY', 'BED OCCUPANCY': (25, 40), 'TOTAL BED': 45, 'WARDS': ['GYNAECOLOGY']},
                {'Dept': 'OBSTETRICS', 'BED OCCUPANCY': (24, 26), 'TOTAL BED': 30, 'WARDS': ['OBSTETRICS']},
                {'Dept': 'ORTHOPEDIC', 'BED OCCUPANCY': (48, 54), 'TOTAL BED': 60, 'WARDS': ['MALE ORTHO', 'FEMALE ORTHO']},
                {'Dept': 'PAEDIATRICS', 'BED OCCUPANCY': (60, 65), 'TOTAL BED': 75, 'WARDS': ['PAEDIATRICS']},  # Corrected typo
                {'Dept': 'OPTHALMOLOGY', 'BED OCCUPANCY': (16, 18), 'TOTAL BED': 20, 'WARDS': ['MALE OPTHALMOLOGY', 'FEMALE OPTHALMOLOGY']},
                {'Dept': 'DERMATOLOGY', 'BED OCCUPANCY': (7, 8), 'TOTAL BED': 10, 'WARDS': ['MALE DERMATOLOGY', 'FEMALE DERMATOLOGY']},
                {'Dept': 'PULMONOLOGY', 'BED OCCUPANCY': (16, 18), 'TOTAL BED': 20, 'WARDS': ['MALE PULMONOLOGY','FEMALE PULMONOLOGY']},
            ]

            with transaction.atomic():
                # Step 1: Discharge patients admitted for more than 2 days
                # admissions_to_discharge = MCI_Patient_Admission_Room_Detials.objects.filter(
                #     CurrentlyStayed=True,
                #     Admitted_Date__lt=now - timedelta(days=discharge_after_days)
                # )
                # discharged_count = 0
                # for admission in admissions_to_discharge:
                #     try:
                #         admission.Discharge_Date = now
                #         admission.CurrentlyStayed = False
                #         admission.IsStayed = False
                #         admission.Status = False
                #         admission.save()

                #         room = admission.RoomId
                #         if room:
                #             room.Booking_Status = 'Available'
                #             room.save()

                #         ip_reg = admission.IP_Registration_Id
                #         if ip_reg:
                #             MCI_Patient_Discharge_Detials.objects.create(
                #                 Registration_Id=ip_reg,
                #                 Discharge_Date=now,
                #                 Discharge_Reason='Routine Discharge after 2 days',
                #                 created_by='system'
                #             )
                #             ip_reg.Status = 'Completed'
                #             ip_reg.Booking_Status = 'Vacated'
                #             ip_reg.save()

                #         discharged_count += 1
                #     except Exception as e:
                #         logger.error(f"Error discharging admission for Registration_Id {admission.IP_Registration_Id.Registration_Id}: {str(e)}")
                #         continue

                # logger.info(f"Discharged {discharged_count} patients")
                # self.stdout.write(self.style.SUCCESS(f"Discharged {discharged_count} patients"))

                # Step 2: Count current active IP admissions per department
                active_admissions = MCI_Patient_Admission_Room_Detials.objects.filter(CurrentlyStayed=True)
                dept_counts = {}
                for admission in active_admissions:
                    dept_name = admission.IP_Registration_Id.Specialization.Speciality_Name
                    dept_counts[dept_name] = dept_counts.get(dept_name, 0) + 1

                # Step 3: Fetch available patients, rooms, and doctors
                active_op_patients = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                    Status='Registered'
                ).values_list('PatientId', flat=True)
                active_ip_patients = MCI_Patient_Admission_Room_Detials.objects.filter(
                    CurrentlyStayed=True
                ).values_list('IP_Registration_Id__PatientId', flat=True)
                available_patients = MCI_Patient_Detials.objects.exclude(
                    PatientId__in=active_op_patients
                ).exclude(
                    PatientId__in=active_ip_patients
                )

                logger.info(f"Active OP patients: {len(active_op_patients)}")
                logger.info(f"Active IP patients: {len(active_ip_patients)}")
                logger.info(f"Available patients: {available_patients.count()}")

                doctor_specs = Doctor_ProfessForm_Detials.objects.filter(
                    Specialization__isnull=False,
                    Department__Department_Name='IP'
                ).exclude(
                    Specialization__Speciality_Name__in=['ANAESTHESIOLOGIST', 'HEMATOLOGY', 'RADIOLOGY']
                ).select_related('Doctor_ID', 'Specialization').distinct()

                insurances = list(Insurance_Master_Detials.objects.all())
                clients = list(Client_Master_Detials.objects.all())
                corporates = list(Corporate_Master_Detials.objects.all())
                donations = list(Donation_Master_Detials.objects.all())
                employees = list(Employee_Personal_Form_Detials.objects.all())
                locations = list(Location_Detials.objects.all())

                if not available_patients.exists() or not doctor_specs.exists():
                    logger.error("Insufficient patients or doctors")
                    self.stdout.write(self.style.ERROR("Not enough available patients or IP doctors"))
                    return

                # Step 4: Generate fake IP admissions
                created_count = 0
                total_admissions_needed = target_admissions - active_admissions.count()

                for dept in department_ranges:
                    dept_name = dept['Dept']
                    min_beds, max_beds = dept['BED OCCUPANCY']
                    current_beds = dept_counts.get(dept_name, 0)
                    beds_needed = random.randint(min_beds, max_beds) - current_beds

                    if beds_needed <= 0:
                        logger.info(f"{dept_name} already has {current_beds} beds, no more needed")
                        continue

                    try:
                        # Fetch available rooms for the department
                        available_rooms = MCI_Room_Master_Detials.objects.filter(
                            Booking_Status='Available',
                            Ward_Name__Ward_Name__Ward_Name__in=dept['WARDS']
                        )
                        available_room_count = available_rooms.count()
                        logger.info(f"Available rooms for {dept_name}: {available_room_count}")

                        if available_room_count == 0:
                            logger.warning(f"No available rooms for {dept_name}")
                            continue

                        # Limit beds_needed to available rooms
                        beds_needed = min(beds_needed, available_room_count)

                        # Modified: Fetch doctors from OBST&GYNECOLOGY for GYNECOLOGY and OBSTETRICS
                        if dept_name in ['GYNECOLOGY', 'OBSTETRICS']:
                            dept_doctor_specs = doctor_specs.filter(Specialization__Speciality_Name='OBST&GYNECOLOGY')
                        
                        else:
                            dept_doctor_specs = doctor_specs.filter(Specialization__Speciality_Name=dept_name)

                        if not dept_doctor_specs.exists():
                            logger.warning(f"No doctors available for {dept_name}")
                            continue

                        # Filter patients based on specialization, keeping as QuerySet
                        filtered_patients = available_patients
                        if dept_name == 'GYNECOLOGY':
                            filtered_patients = filtered_patients.filter(Gender='Female').filter(Age__gte=45)
                        elif dept_name == 'PEDIATRICS':
                            filtered_patients = filtered_patients.filter(Age__lte=15)
                        elif dept_name == 'OPTHALMOLOGY':
                            filtered_patients = filtered_patients.filter(Age__gte=50)
                        elif dept_name == 'OBSTETRICS':
                            filtered_patients = filtered_patients.filter(Gender='Female').filter(Age__lte=28)  # Adjusted for OBSTETRICS

                        eligible_patient_count = filtered_patients.count()
                        logger.info(f"Eligible patients for {dept_name}: {eligible_patient_count}")

                        if eligible_patient_count == 0:
                            logger.warning(f"No suitable patients for {dept_name}")
                            continue

                        # Process admissions for this department
                        dept_created_count = 0
                        for _ in range(min(beds_needed, total_admissions_needed - created_count, eligible_patient_count)):
                            try:
                                room = random.choice(list(available_rooms))
                                doctor_spec = random.choice(list(dept_doctor_specs))
                                doctor = doctor_spec.Doctor_ID
                                specialization = doctor_spec.Specialization
                                patient = random.choice(list(filtered_patients[:100]))  # Limit to 100 to avoid memory issues
                                location = random.choice(locations) if locations else None

                                # Patient category
                                patient_category = random.choice(['General', 'Student', 'FreeAll', 'Insurance'])
                                insurance = None
                                insurance_type = None
                                client = None
                                client_type = None
                                client_employee_id = None
                                client_employee_designation = None
                                client_employee_relation = None
                                corporate = None
                                corporate_type = None
                                corporate_employee_id = None
                                corporate_employee_designation = None
                                corporate_employee_relation = None
                                employee = None
                                employee_relation = None
                                doctor_id = None
                                doctor_relation = None
                                donation = None

                                if patient_category == 'Insurance' and insurances:
                                    insurance = random.choice(insurances)
                                    insurance_type = random.choice(['HMO', 'PPO', 'POS'])
                                elif patient_category == 'Client' and clients:
                                    client = random.choice(clients)
                                    client_type = random.choice(['Individual', 'Family'])
                                    client_employee_id = fake.uuid4()[:8]
                                    client_employee_designation = random.choice(['Manager', 'Engineer'])
                                    client_employee_relation = random.choice(['Self', 'Spouse'])
                                elif patient_category == 'Corporate' and corporates:
                                    corporate = random.choice(corporates)
                                    corporate_type = random.choice(['Private', 'Public'])
                                    corporate_employee_id = fake.uuid4()[:8]
                                    corporate_employee_designation = random.choice(['Executive', 'Analyst'])
                                    corporate_employee_relation = random.choice(['Self', 'Spouse'])
                                elif patient_category in ['Employee', 'EmployeeRelation'] and employees:
                                    employee = random.choice(employees)
                                    employee_relation = random.choice(['Self', 'Spouse'])
                                elif patient_category in ['Doctor', 'DoctorRelation'] and dept_doctor_specs:
                                    doctor_id = random.choice(dept_doctor_specs).Doctor_ID
                                    doctor_relation = random.choice(['Self', 'Spouse'])
                                elif patient_category == 'Donation' and donations:
                                    donation = random.choice(donations)

                                registration_id = generate_fake_ip_registration_id(current_year_month)

                                ip_reg = MCI_Patient_IP_Registration_Detials(
                                    Registration_Id=registration_id,
                                    PatientId=patient,
                                    Specialization=specialization,
                                    PrimaryDoctor=doctor,
                                    Complaint=fake.paragraph(nb_sentences=2),
                                    IsMLC=random.choice(['Yes', 'No']) if random.random() > 0.5 else 'No',
                                    IsReferral='No',
                                    PatientCategory=patient_category,
                                    InsuranceName=insurance,
                                    InsuranceType=insurance_type,
                                    ClientName=client,
                                    ClientType=client_type,
                                    ClientEmployeeId=client_employee_id,
                                    ClientEmployeeDesignation=client_employee_designation,
                                    ClientEmployeeRelation=client_employee_relation,
                                    CorporateName=corporate,
                                    CorporateType=corporate_type,
                                    CorporateEmployeeId=corporate_employee_id,
                                    CorporateEmployeeDesignation=corporate_employee_designation,
                                    CorporateEmployeeRelation=corporate_employee_relation,
                                    EmployeeId=employee,
                                    EmployeeRelation=employee_relation,
                                    DoctorId=doctor_id,
                                    DoctorRelation=doctor_relation,
                                    DonationType=donation,
                                    Status='Admitted',
                                    Booking_Status='Occupied',
                                    Location=location,
                                    created_by='system'
                                )
                                ip_reg.save()

                                admission_details = MCI_Patient_Admission_Detials(
                                    IP_Registration_Id=ip_reg,
                                    AdmissionPurpose='Routine Admission',
                                    DrInchargeAtTimeOfAdmission=doctor,
                                    NextToKinName=fake.name() if random.random() > 0.5 else None,
                                    Relation=random.choice(['Spouse', 'Parent', 'Sibling']) if random.random() > 0.5 else None,
                                    RelativePhoneNo=fake.phone_number()[:30] if random.random() > 0.5 else None,
                                    visitDate=now.date(),
                                    visitTime=now.time(),
                                    created_by='system'
                                )
                                admission_details.save()

                                admission_room = MCI_Patient_Admission_Room_Detials(
                                    RegisterType='IP',
                                    IP_Registration_Id=ip_reg,
                                    RoomId=room,
                                    Admitted_Date=now,
                                    Status=True,
                                    IsStayed=True,
                                    CurrentlyStayed=True,
                                    Iscanceled=False,
                                    created_by='system'
                                )
                                admission_room.save()

                                room.Booking_Status = 'Occupied'
                                room.save()

                                # Update available resources
                                available_patients = available_patients.exclude(PatientId=patient.PatientId)
                                available_rooms = available_rooms.exclude(Room_Id=room.Room_Id)
                                filtered_patients = filtered_patients.exclude(PatientId=patient.PatientId)
                                dept_created_count += 1
                                created_count += 1

                            except Exception as e:
                                logger.error(f"Error creating admission for {dept_name}: {str(e)}")
                                continue  # Skip to next patient if error occurs

                        logger.info(f"Created {dept_created_count} new admissions for {dept_name}")

                    except Exception as e:
                        logger.error(f"Error processing department {dept_name}: {str(e)}")
                        continue  # Move to next department

                logger.info(f"Created {created_count} new IP admissions")
                self.stdout.write(self.style.SUCCESS(f"Created {created_count} new IP admissions"))

                # Step 5: Verify total active admissions
                final_count = MCI_Patient_Admission_Room_Detials.objects.filter(CurrentlyStayed=True).count()
                self.stdout.write(self.style.SUCCESS(f"Total active IP admissions: {final_count}"))

        except Exception as e:
            logger.error(f"Critical error in IP admission process: {str(e)}")
            self.stdout.write(self.style.ERROR(f"Failed to complete IP admissions: {str(e)}"))











