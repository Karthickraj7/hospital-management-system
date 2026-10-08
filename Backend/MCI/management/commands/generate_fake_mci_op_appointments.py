import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Max
from faker import Faker
from MCI.models import *
from Masters.models import (
    Doctor_ProfessForm_Detials,
    Insurance_Master_Detials,
    Client_Master_Detials,
    Corporate_Master_Detials,
    Donation_Master_Detials,
    Employee_Personal_Form_Detials,
    Location_Detials,
)
from Frontoffice.models import *
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@transaction.atomic
def generate_or_update_mci_visit_id(patient, register_type):
    """Generate or update MCI visit ID for a patient."""
    max_visit_id = MCI_Patient_Visit_Detials.objects.filter(
        PatientId=patient
    ).aggregate(max_id=Max('VisitId'))['max_id']
    next_visit_id = 1 if max_visit_id is None else max_visit_id + 1
    patient_visit = MCI_Patient_Visit_Detials.objects.create(
        PatientId=patient,
        VisitId=next_visit_id,
        RegisterType=register_type
    )
    return patient_visit.VisitId

def get_next_token_no(specialization, date_obj):
    """Generate the next token number for a specialization."""
    speciality_patient_queryset = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
        Specialization=specialization,
        created_at__date=date_obj
    ).order_by('created_at')
    speciality_patient_count = speciality_patient_queryset.count()
    token_no = speciality_patient_count + 1
    speciality_abbr = specialization.Speciality_Name[:3].upper()
    formatted_token_no = f"{speciality_abbr}{token_no:03d}"
    return formatted_token_no

def generate_fake_registration_id(current_year_month):
    """Generate a unique Registration_Id with FOP prefix."""
    prefix = f"OP{current_year_month}"
    with transaction.atomic():
        matching_entries = MCI_Patient_Appointment_Registration_Detials.objects.select_for_update().filter(
            Registration_Id__startswith=prefix
        ).values_list('Registration_Id', flat=True)
        if matching_entries:
            numeric_parts = [
                int(reg_id[len(prefix):]) for reg_id in matching_entries if reg_id[len(prefix):].isdigit()
            ]
            next_number = max(numeric_parts) + 1 if numeric_parts else 1
        else:
            next_number = 1
        return f"{prefix}{next_number}"

def get_age_value(age_str):
    """Extract numeric age from a string."""
    try:
        if not age_str:  # Handle None or empty string
            return 0
        if isinstance(age_str, (int, float)):
            return int(age_str)
        if age_str.isdigit():
            return int(age_str)
        parts = age_str.split()
        for part in parts:
            if part.isdigit():
                return int(part)
        return 0
    except (ValueError, AttributeError) as e:
        logger.error(f"Invalid age format: {age_str}, Error: {e}")
        return 0

class Command(BaseCommand):
    help = "Generate a batch of fake OP patient appointments with department-specific batch patterns for today's date"

    def handle(self, *args, **kwargs):
        appointment_date = datetime.now().date()
        yesterday = appointment_date - timedelta(days=1)
        current_year_month = datetime.now().strftime('%y%m')
        logger.info(f"Starting OP appointment generation for {appointment_date}")

        # Step 1: Update yesterday's appointments to Completed
        with transaction.atomic():
            reg_updated = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                IsOriginal = False,
                created_at__date=yesterday,
                Status='Registered'
            ).update(
                Status='Completed',
                updated_by='system'
            )
            multi_doc_updated = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__IsOriginal = False,
                created_at__date=yesterday,
                Status='Registered'
            ).update(
                Status='Completed',
                updated_by='system'
            )
            logger.info(f"Updated {reg_updated} MCI registration records and {multi_doc_updated} MCI multi-doctor records to Completed for {yesterday}")

            original_reg_updated = Patient_Appointment_Registration_Detials.objects.filter(
                Registration_Id__startswith='OP',
                created_at__date=yesterday,
                Status='Registered'
            ).update(
                Status='Completed',
                updated_by='system'
            )
            original_multi_doc_updated = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__Registration_Id__startswith='OP',
                created_at__date=yesterday,
                Status='Registered'
            ).update(
                Status='Completed',
                updated_by='system'
            )
            logger.info(f"Updated {original_reg_updated} original registration records and {original_multi_doc_updated} original multi-doctor records to Completed for {yesterday}")

        # Batch size per run
        BATCH_SIZE = 500  # Increased batch size to accommodate batch pattern

        # Define department-specific batch patterns (department: [batch_size1, batch_size2, ...])
        department_batch_patterns = {
            'GENERAL MEDICINE': [1, 1, 2, 1, 1],  # Alternating batches of 3-4 appointments
            'CARDIOLOGY': [1, 2, 1, 1, 1],        # Alternating batches of 2-3 appointments
            'DENTAL': [1, 2, 1, 1, 1],            # Alternating batches of 1-2 appointments
            'ENT': [1, 2, 1, 1, 1],
            'DERMATOLOGY': [1, 2, 1, 1, 1],
            'SURGERY': [1, 2, 1, 1, 1],
            'GYNECOLOGY': [1, 2, 1, 1, 1],
            'OPTHALMOLOGY': [1, 2, 1, 1, 1],
            'ORTHOPEDIC': [1, 2, 1, 1, 1],
            'PAEDIATRICS': [1, 2, 1, 1, 1],
            'PSYCHIATRY': [1, 2, 1, 1, 1],
            'PULMONOLOGY': [1, 1, 1, 1, 2],
            'UROLOGY': [1, 1, 1, 1, 2]
        }

        # Define department daily limits
        department_limits = {
            'GENERAL MEDICINE': (180, 200),
            'CARDIOLOGY': (120, 130),
            'DENTAL': (60, 70),
            'ENT': (120, 130),
            'DERMATOLOGY': (80, 90),
            'SURGERY': (180, 200),
            'GYNECOLOGY': (100, 130),
            'OPTHALMOLOGY': (80, 90),
            'ORTHOPEDIC': (120, 130),
            'PAEDIATRICS': (120, 130),
            'PSYCHIATRY': (80, 90),
            'PULMONOLOGY': (80, 90),
            'UROLOGY': (30, 40)
        }

        # Step 2: Count existing appointments per department
        existing_counts = {}
        for dept in department_limits:
            existing_counts[dept] = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Specialization__Speciality_Name=dept,
                created_at__date=appointment_date
            ).count()
            logger.info(f"Existing appointments for {dept}: {existing_counts[dept]}")

        # Step 3: Check AppointmentGenerationLog for today's target and generated count
        with transaction.atomic():
            log_entry = AppointmentGenerationLog.objects.filter(date=appointment_date).select_for_update().first()
            if log_entry:
                target_appointments = log_entry.appointment_count
                generated_so_far = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                    created_at__date=appointment_date,
                    VisitPurpose='OP',
                    IsOriginal = False
                ).count()
                if generated_so_far >= target_appointments:
                    self.stdout.write(self.style.WARNING(f'Already generated {generated_so_far}/{target_appointments} fake OP appointments today. Skipping.'))
                    return
                num_appointments = min(BATCH_SIZE, target_appointments - generated_so_far)
            else:
                target_appointments = random.choice([1110,1153,1148,1163,1213,1233,1208,1209,1137,1145,1212])
                num_appointments = min(BATCH_SIZE, target_appointments)
                generated_so_far = 0

        logger.info(f"Target OP appointments: {target_appointments}")
        logger.info(f"Generated so far: {generated_so_far}")
        logger.info(f"Num appointments to generate: {num_appointments}")

        # Step 4: Initialize Faker and fetch data
        fake = Faker()
        active_op_patients = MCI_Patient_Appointment_Registration_Detials.objects.filter(
            Status='Registered'
        ).values_list('PatientId', flat=True)
        # active_ip_patients = MCI_Patient_Admission_Room_Detials.objects.filter(
        #     CurrentlyStayed=True
        # ).values_list('IP_Registration_Id__PatientId', flat=True)
        past_patient_ids = set(MCI_Patient_Appointment_Registration_Detials.objects.filter(
            created_at__date__lt=appointment_date
        ).values_list('PatientId', flat=True).distinct())
        available_patients = MCI_Patient_Detials.objects.exclude(
            PatientId__in=active_op_patients
        )
        followup_eligible_patients = [
            p for p in available_patients 
            if p.PatientId in past_patient_ids
        ]
        new_patients = [
            p for p in available_patients 
            if p.PatientId not in past_patient_ids
        ]
        logger.info(f"Available patients: {len(available_patients)}")
        logger.info(f"Follow-up eligible patients: {len(followup_eligible_patients)}")
        logger.info(f"New patients: {len(new_patients)}")

        doctor_specs = Doctor_ProfessForm_Detials.objects.filter(
            Specialization__isnull=False,
            Department__Department_Name='OP'
        ).exclude(
            Specialization__Speciality_Name__in=['ANAESTHESIOLOGIST', 'HEMATOLOGY', 'RADIOLOGY']
        ).select_related('Doctor_ID', 'Specialization').distinct()
        
        insurances = list(Insurance_Master_Detials.objects.all())
        clients = list(Client_Master_Detials.objects.all())
        corporates = list(Corporate_Master_Detials.objects.all())
        donations = list(Donation_Master_Detials.objects.all())
        employees = list(Employee_Personal_Form_Detials.objects.all())
        locations = list(Location_Detials.objects.all())

        if not (available_patients.exists() and doctor_specs.exists()):
            self.stdout.write(self.style.ERROR('Ensure MCI_Patient_Detials and Doctor_ProfessForm_Detials with non-null Specialization and OP Department have records.'))
            return
        if available_patients.count() + generated_so_far < target_appointments:
            self.stdout.write(self.style.ERROR(f'Not enough available patients ({available_patients.count()}) to generate {target_appointments - generated_so_far} remaining OP appointments.'))
            return

        # Step 5: Generate appointments using batch pattern
        generated_count = 0
        departments = list(department_batch_patterns.keys())
        random.shuffle(departments)  # Shuffle departments for variety
        
        # Track batch indices for each department
        batch_indices = {dept: 0 for dept in departments}
        dept_appointment_counts = {dept: 0 for dept in departments}

        with transaction.atomic():
            while generated_count < num_appointments:
                for dept in departments:
                    if generated_count >= num_appointments:
                        break
                        
                    # Check if department has reached its daily limit
                    min_limit, max_limit = department_limits[dept]
                    if dept_appointment_counts[dept] >= max_limit:
                        logger.info(f"Department {dept} reached daily limit {max_limit}. Skipping.")
                        continue
                    
                    # Get the next batch size for this department
                    batch_pattern = department_batch_patterns[dept]
                    current_batch_index = batch_indices[dept]
                    batch_size = batch_pattern[current_batch_index % len(batch_pattern)]
                    
                    # Adjust batch size based on remaining capacity and overall limit
                    remaining_capacity = max_limit - dept_appointment_counts[dept]
                    remaining_needed = num_appointments - generated_count
                    actual_batch_size = min(batch_size, remaining_capacity, remaining_needed)
                    
                    if actual_batch_size <= 0:
                        batch_indices[dept] = (current_batch_index + 1) % len(batch_pattern)
                        continue
                    
                    logger.info(f"Generating batch of {actual_batch_size} appointments for {dept}")
                    
                    # Get department-specific doctors
                    if dept in ['GYNECOLOGY', 'OBSTETRICS']:
                        dept_doctor_specs = doctor_specs.filter(Specialization__Speciality_Name='OBST&GYNECOLOGY')
                    else:
                        dept_doctor_specs = doctor_specs.filter(Specialization__Speciality_Name=dept)
                    
                    if not dept_doctor_specs.exists():
                        logger.warning(f"No doctors available for {dept}. Skipping.")
                        batch_indices[dept] = (current_batch_index + 1) % len(batch_pattern)
                        continue
                    
                    # Generate batch of appointments for this department
                    batch_generated = 0
                    for _ in range(actual_batch_size):
                        if generated_count >= num_appointments:
                            break
                            
                        # Choose appointment type (60% New, 40% Follow-up)
                        appt_type = 'NewConsultation' if random.random() < 0.6 else 'FollowUp'
                        patient_pool = new_patients if appt_type == 'NewConsultation' else followup_eligible_patients
                        
                        if not patient_pool:
                            logger.warning(f"No patients available for {dept} {appt_type}. Skipping.")
                            continue
                        
                        # Filter patients based on department requirements
                        if dept == 'GYNECOLOGY':
                            filtered_patients = [p for p in patient_pool if p.Gender == 'Female' and get_age_value(p.Age) >= 18]
                        elif dept == 'PAEDIATRICS':
                            filtered_patients = [p for p in patient_pool if get_age_value(p.Age) <= 18]
                        elif dept == 'OPTHALMOLOGY':
                            filtered_patients = [p for p in patient_pool if get_age_value(p.Age) >= 30]
                        else:
                            filtered_patients = patient_pool
                            
                        if not filtered_patients:
                            logger.warning(f"No suitable patients for {dept} {appt_type}. Using unfiltered pool.")
                            filtered_patients = patient_pool
                            if not filtered_patients:
                                continue
                        
                        patient = random.choice(filtered_patients)
                        if appt_type == 'FollowUp' and patient in followup_eligible_patients:
                            followup_eligible_patients.remove(patient)
                        elif appt_type == 'NewConsultation' and patient in new_patients:
                            new_patients.remove(patient)
                            
                        doctor_spec = random.choice(dept_doctor_specs)
                        doctor = doctor_spec.Doctor_ID
                        specialization = doctor_spec.Specialization
                        register_type = 'OP'
                        visit_type = appt_type
                        token_no = get_next_token_no(specialization, appointment_date)
                        if appt_type == 'FollowUp':
                            token_no = f"FU-{token_no}"
                        complaint = fake.paragraph(nb_sentences=2)
                        
                        self.create_appointment(
                            patient, register_type, visit_type, token_no, doctor, specialization,
                            complaint, appointment_date, current_year_month, fake,
                            insurances, clients, corporates, donations, employees, locations, doctor_specs
                        )
                        
                        generated_count += 1
                        dept_appointment_counts[dept] += 1
                        batch_generated += 1
                        
                        logger.info(f"Generated {appt_type} appointment for {dept}, total: {generated_count}")
                    
                    # Move to next batch pattern for this department
                    batch_indices[dept] = (current_batch_index + 1) % len(batch_pattern)
                    logger.info(f"Completed batch for {dept}: generated {batch_generated} appointments")

            # Update generation log
            with transaction.atomic():
                log_entry, created = AppointmentGenerationLog.objects.get_or_create(
                    date=appointment_date,
                    defaults={'appointment_count': target_appointments}
                )
                if not created:
                    log_entry.appointment_count = max(log_entry.appointment_count, generated_so_far + generated_count)
                    log_entry.save()

        logger.info(f"Final appointment counts per department: {dept_appointment_counts}")
        self.stdout.write(self.style.SUCCESS(f'Successfully generated {generated_count} fake OP appointments for {appointment_date} (total: {generated_so_far + generated_count}/{target_appointments}).'))

    def create_appointment(self, patient, register_type, visit_type, token_no, doctor, specialization,
                          complaint, appointment_date, current_year_month, fake,
                          insurances, clients, corporates, donations, employees, locations, doctor_specs):
        """Helper method to create an OP appointment."""
        is_mlc = random.choice(['Yes', 'No']) if random.random() > 0.5 else None
        is_referral = 'No'
        referral_source = fake.company() if is_referral == 'Yes' else ''
        referred_by = random.choice(doctor_specs).Doctor_ID if is_referral == 'Yes' else None
        next_to_kin_name = fake.name() if random.random() > 0.5 else None
        relation = random.choice(['Spouse', 'Parent', 'Sibling']) if next_to_kin_name else None
        relative_phone_no = fake.phone_number()[:30] if next_to_kin_name else None
        patient_category = random.choice(['General', 'Student', 'Camp', 'FreeAll', 'Insurance'])
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
        service_category = random.choice(['Outpatient', 'Diagnostic']) if random.random() > 0.5 else None
        service_sub_category = random.choice(['General', 'Specialized']) if service_category else None
        created_by = 'system'
        patient_visit_id = generate_or_update_mci_visit_id(patient, register_type)
        registration_id = None
        today = datetime.now().strftime('%Y-%m-%d')
        max_id_today = MCI_Patient_Appointment_Registration_Detials.objects.filter(
            created_at__date=today
        ).aggregate(max_id=Max('AppointmentId'))['max_id']
        appointment_id = (max_id_today or 0) + 1
        appointment = MCI_Patient_Appointment_Registration_Detials(
            Registration_Id=registration_id,
            PatientId=patient,
            VisitId=patient_visit_id,
            VisitPurpose=register_type,
            ApptoRegId=None,
            AppointmentId=appointment_id,
            IsMLC=is_mlc,
            IsReferral=is_referral,
            NextToKinName=next_to_kin_name,
            Relation=relation,
            RelativePhNo=relative_phone_no,
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
            Status='Registered',
            Bill_Status='Pending',
            ConsultingTime=datetime.combine(appointment_date, fake.time_object()),
            Reason=fake.sentence(nb_words=10),
            IP_Request_status='No',
            Location=random.choice(locations) if locations else None,
            ServiceCategory=service_category,
            ServiceSubCategory=service_sub_category,
            created_by=created_by,
            updated_by=''
        )
        appointment.save()
        multi_doctor = MCI_OP_Patient_Appointment_With_Multiple_Doctor(
            Registration_Id=appointment,
            PrimaryDoctor=doctor,
            Specialization=specialization,
            VisitType=visit_type,
            Complaint=complaint,
            TokenNo=token_no,
            created_by=created_by,
            Status='Registered',
            updated_by=''
        )
        multi_doctor.save()
        if is_referral == 'Yes':
            referral = MCI_Patient_Referral_Detials(
                OP_Register_Id=appointment,
                ReferralRegisteredBy=register_type,
                ReferralSource=referral_source,
                ReferredBy=referred_by,
                created_by=created_by,
                updated_by=''
            )
            referral.save()







            


















