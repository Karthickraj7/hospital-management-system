import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Max
from faker import Faker
from MCI.models import *
from Masters.models import (
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

def generate_fake_registration_id(current_year_month):
    """Generate a unique Registration_Id with FOP prefix."""
    prefix = f"FOP{current_year_month}"
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

class Command(BaseCommand):
    help = "Generate a batch of fake Lab and Radiology patient appointments for today's date, excluding active IP patients"

    def handle(self, *args, **kwargs):
        appointment_date = datetime.now().date()
        yesterday = appointment_date - timedelta(days=1)
        current_year_month = datetime.now().strftime('%y%m')
        logger.info(f"Starting Lab/Radiology appointment generation for {appointment_date}")

        # Step 1: Update yesterday's appointments to Completed
        with transaction.atomic():
            reg_updated = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                Registration_Id__startswith='FOP',
                created_at__date=yesterday,
                Status='Registered',
                VisitPurpose__in=['LAB', 'RADIOLOGY']
            ).update(
                Status='Completed',
                updated_by='system'
            )
            multi_doc_updated = MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(
                Registration_Id__Registration_Id__startswith='FOP',
                created_at__date=yesterday,
                Status='Registered',
                VisitType='WALK-IN'
            ).update(
                Status='Completed',
                updated_by='system'
            )
            logger.info(f"Updated {reg_updated} registration records and {multi_doc_updated} multi-doctor records to Completed for {yesterday}")

        # Batch size per run
        BATCH_SIZE = 2

        # Step 2: Check LabRadiologyAppointmentGenerationLog for today's target and generated count
        with transaction.atomic():
            log_entry = LabRadiologyAppointmentGenerationLog.objects.filter(date=appointment_date).select_for_update().first()
            if log_entry:
                target_appointments = log_entry.appointment_count
                generated_so_far = MCI_Patient_Appointment_Registration_Detials.objects.filter(
                    Registration_Id__startswith=f"FOP{current_year_month}",
                    created_at__date=appointment_date,
                    VisitPurpose__in=['LAB', 'RADIOLOGY']
                ).count()
                if generated_so_far >= target_appointments:
                    self.stdout.write(self.style.WARNING(f'Already generated {generated_so_far}/{target_appointments} fake Lab/Radiology appointments today. Skipping.'))
                    return
                num_appointments = min(BATCH_SIZE, target_appointments - generated_so_far)
            else:
                target_appointments = random.choice([50])
                num_appointments = min(BATCH_SIZE, target_appointments)
                generated_so_far = 0

        # Step 3: Randomly assign percentages for Lab and Radiology
        radiology_pct = random.uniform(0.45, 0.55)
        lab_pct = 1 - radiology_pct
        radiology_count = int(target_appointments * radiology_pct)
        lab_count = target_appointments - radiology_count

        # Step 4: Scale down counts to respect num_appointments
        total_target = radiology_count + lab_count
        if total_target > num_appointments:
            scale_factor = num_appointments / total_target
            radiology_count = int(radiology_count * scale_factor)
            lab_count = num_appointments - radiology_count
            logger.info(f"Scaled down to num_appointments: radiology_count={radiology_count}, lab_count={lab_count}")

        logger.info(f"Generating {num_appointments} fake Lab/Radiology appointments (target: {target_appointments}) for {appointment_date}")
        logger.info(f"Allocation: Radiology={radiology_count}, Lab={lab_count}")

        # Step 5: Initialize Faker and fetch data
        fake = Faker()
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
        logger.info(f"Available patients: {len(available_patients)}")

        insurances = list(Insurance_Master_Detials.objects.all())
        clients = list(Client_Master_Detials.objects.all())
        corporates = list(Corporate_Master_Detials.objects.all())
        donations = list(Donation_Master_Detials.objects.all())
        employees = list(Employee_Personal_Form_Detials.objects.all())
        locations = list(Location_Detials.objects.all())

        if not available_patients.exists():
            self.stdout.write(self.style.ERROR('Ensure MCI_Patient_Detials has records.'))
            return
        if available_patients.count() + generated_so_far < target_appointments:
            self.stdout.write(self.style.ERROR(f'Not enough available patients ({available_patients.count()}) to generate {target_appointments - generated_so_far} remaining Lab/Radiology appointments.'))
            return

        # Step 6: Generate appointments
        generated_count = 0
        appointment_types = [
            ('RADIOLOGY', radiology_count),
            ('LAB', lab_count)
        ]

        with transaction.atomic():
            for appt_type, target_count in appointment_types:
                if generated_count >= num_appointments:
                    logger.info(f"Reached num_appointments limit ({num_appointments}). Stopping generation.")
                    break
                remaining_appointments = num_appointments - generated_count
                actual_count = min(target_count, remaining_appointments)
                logger.info(f"Generating up to {actual_count} {appt_type} appointments (remaining: {remaining_appointments})")

                for _ in range(actual_count):
                    if generated_count >= num_appointments:
                        break
                    if not available_patients:
                        logger.warning(f"Ran out of patients after {generated_count} appointments")
                        break
                    patient = random.choice(available_patients)
                    register_type = appt_type
                    visit_type = 'WALK-IN'
                    token_no = ''
                    doctor = None
                    specialization = None
                    complaint = fake.paragraph(nb_sentences=2)
                    self.create_appointment(
                        patient, register_type, visit_type, token_no, doctor, specialization,
                        complaint, appointment_date, current_year_month, fake,
                        insurances, clients, corporates, donations, employees, locations
                    )
                    generated_count += 1
                    logger.info(f"Generated {appt_type} appointment, total: {generated_count}")

            # Update generation log
            with transaction.atomic():
                log_entry, created = LabRadiologyAppointmentGenerationLog.objects.get_or_create(
                    date=appointment_date,
                    defaults={'appointment_count': target_appointments}
                )
                if not created:
                    log_entry.appointment_count = max(log_entry.appointment_count, generated_so_far + generated_count)
                    log_entry.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully generated {generated_count} fake Lab/Radiology appointments for {appointment_date} (total: {generated_so_far + generated_count}/{target_appointments}).'))
        logger.info(f"Breakdown: Radiology={radiology_count}, Lab={lab_count}")

    def create_appointment(self, patient, register_type, visit_type, token_no, doctor, specialization,
                          complaint, appointment_date, current_year_month, fake,
                          insurances, clients, corporates, donations, employees, locations):
        """Helper method to create a Lab/Radiology appointment."""
        is_mlc = random.choice(['Yes', 'No']) if random.random() > 0.5 else None
        is_referral = 'No'
        referral_source = fake.company() if is_referral == 'Yes' else ''
        referred_by = None
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
        service_category = 'Diagnostic'
        service_sub_category = random.choice(['General', 'Specialized'])
        created_by = 'system'
        patient_visit_id = generate_or_update_mci_visit_id(patient, register_type)
        registration_id = generate_fake_registration_id(current_year_month)
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