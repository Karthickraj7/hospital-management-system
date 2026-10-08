from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from .models import *
from Frontoffice.models import *
from Masters.models import *
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from Ip_Workbench.models import *
from OTManagement.models import *

import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Patient_Detials)
def sync_patient_to_mci(sender, instance, created, **kwargs):

    try:

        if created:
            print('signal created for MCI_Patient_Detials')

            mci_patient_data = {
                'PatientId': instance.PatientId,  # Use same PatientId
                'DuplicateId': instance.DuplicateId,
                'Patient_profile': instance.Patient_profile,
                'ExistingPtNo': instance.ExistingPtNo,
                'Title': instance.Title,
                'FirstName': instance.FirstName,
                'MiddleName': instance.MiddleName,
                'SurName': instance.SurName,
                'Gender': instance.Gender,
                'MaritalStatus': instance.MaritalStatus,
                'SpouseName': instance.SpouseName,
                'FatherName': instance.FatherName,
                'DOB': instance.DOB,
                'Age': instance.Age,
                'PhoneNo': instance.PhoneNo,
                'Email': instance.Email,
                'BloodGroup': instance.BloodGroup,
                'Occupation': instance.Occupation,
                'Religion': instance.Religion,
                'Nationality': instance.Nationality,
                'UniqueIdType': instance.UniqueIdType,
                'UniqueIdNo': instance.UniqueIdNo,
                'PatientType': instance.PatientType,
                'ABHA': instance.ABHA,
                'Flagging': instance.Flagging,
                'DoorNo': instance.DoorNo,
                'Street': instance.Street,
                'Area': instance.Area,
                'City': instance.City,
                'District': instance.District,
                'State': instance.State,
                'Country': instance.Country,
                'Pincode': instance.Pincode,
                'PermanentAddressSameAsAbove': instance.PermanentAddressSameAsAbove,
                'PermanentdoorNo': instance.PermanentdoorNo,
                'PermanentStreet': instance.PermanentStreet,
                'PermanentArea': instance.PermanentArea,
                'PermanentCity': instance.PermanentCity,
                'PermanentDistrict': instance.PermanentDistrict,
                'PermanentState': instance.PermanentState,
                'PermanentCountry': instance.PermanentCountry,
                'PermanentPincode': instance.PermanentPincode,
                'LedgerName': instance.LedgerName,
                'LedgerGroupName': instance.LedgerGroupName,
                'OpeningBalance': instance.OpeningBalance,
                'DebitOrCredit': instance.DebitOrCredit,
                'DoctorID': instance.DoctorID,
                'SpecializationId': instance.SpecializationId,
                # 'appointmentId': instance.appointmentId,
                'created_by': instance.created_by,
                'Status': instance.Status,
                'updated_by': instance.updated_by,
                # Note: created_at and updated_at are handled by the model (auto_now_add, auto_now)
            }

            mci_patient, mci_created = MCI_Patient_Detials.objects.get_or_create(
                PatientId=instance.PatientId,
                defaults=mci_patient_data
            )

            if not mci_created:
                # Update existing MCI_Patient_Detials instance
                for field, value in mci_patient_data.items():
                    if field not in ['PatientId']:  # Skip primary key
                        setattr(mci_patient, field, value)
                mci_patient.save()
            
            print('signal ended for MCI_Patient_Detials')

    except ObjectDoesNotExist as e:
        print(f"Error: {e}")



@receiver(post_save, sender=Patient_Visit_Detials)
def sync_patient_visit_to_mci(sender, instance, created, **kwargs):
    """
    Signal to copy Patient_Visit_Detials data into MCI_Patient_Visit_Detials
    only when created, with duplicate protection.
    """
    logger.debug(f"Signal triggered for Patient_Visit_Detials, created={created}, instance={instance.id}")
 
    # Run only when a new record is created
    if not created:
        logger.debug("Existing Patient_Visit_Detials updated — skipping MCI sync.")
        return
 
    # Get corresponding MCI patient record
    try:
        mci_patient = MCI_Patient_Detials.objects.get(PatientId=instance.PatientId.PatientId)
        logger.debug(f"Found MCI_Patient_Detials for PatientId: {mci_patient.PatientId}")
    except MCI_Patient_Detials.DoesNotExist:
        logger.warning(f"No MCI_Patient_Detials found for PatientId: {instance.PatientId.PatientId}")
        return
 
    # Prepare data for insertion
    mci_visit_data = {
        'PatientId': mci_patient,
        'VisitId': instance.VisitId,
        'RegisterType': instance.RegisterType,
    }
 
    # Check for duplicates (same PatientId + VisitId)
    exists = MCI_Patient_Visit_Detials.objects.filter(
        PatientId=mci_patient,
        VisitId=instance.VisitId
    ).exists()
 
    if exists:
        logger.debug(
            f"MCI_Patient_Visit_Detials already exists for PatientId={mci_patient.PatientId}, VisitId={instance.VisitId} — skipping."
        )
        return
 
    # Create new record (no update)
    try:
        with transaction.atomic():
            mci_visit = MCI_Patient_Visit_Detials.objects.create(**mci_visit_data)
            logger.debug(f"Created new MCI_Patient_Visit_Detials (id={mci_visit.id}) for PatientId={mci_patient.PatientId}")
    except Exception as e:
        logger.error(f"Error while creating MCI_Patient_Visit_Detials: {str(e)}")
 
 
@receiver(post_save, sender=Patient_Appointment_Registration_Detials)
def sync_appointment_to_mci(sender, instance, created, **kwargs):
    """
    Signal to copy data from Patient_Appointment_Registration_Detials
    into MCI_Patient_Appointment_Registration_Detials only when created.
    """
    if not created:
        # Do nothing if updating an existing appointment
        return
 
    # Find corresponding MCI patient record
    try:
        mci_patient = MCI_Patient_Detials.objects.get(PatientId=instance.PatientId.PatientId)
    except MCI_Patient_Detials.DoesNotExist:
        return  # Skip if not found
 
    # Map ApptoRegId if present
    mci_apptoreg = None
    if instance.ApptoRegId:
        try:
            mci_apptoreg = MCI_Appointment_Request_List.objects.get(pk=instance.ApptoRegId.pk)
        except MCI_Appointment_Request_List.DoesNotExist:
            pass
 
    # Prepare the data for new MCI record
    mci_appointment_data = {
        'Registration_Id': instance.Registration_Id,
        'PatientId': mci_patient,
        'VisitId': instance.VisitId,
        'CardValidity': instance.CardValidity,
        'VisitPurpose': instance.VisitPurpose,
        'AppointmentId': instance.AppointmentId,
        'ApptoRegId': mci_apptoreg,
        'PatientCategory': instance.PatientCategory,
        'InsuranceName': instance.InsuranceName,
        'InsuranceType': instance.InsuranceType,
        'ClientName': instance.ClientName,
        'ClientType': instance.ClientType,
        'ClientEmployeeId': instance.ClientEmployeeId,
        'ClientEmployeeDesignation': instance.ClientEmployeeDesignation,
        'ClientEmployeeRelation': instance.ClientEmployeeRelation,
        'CorporateName': instance.CorporateName,
        'CorporateType': instance.CorporateType,
        'CorporateEmployeeId': instance.CorporateEmployeeId,
        'CorporateEmployeeDesignation': instance.CorporateEmployeeDesignation,
        'CorporateEmployeeRelation': instance.CorporateEmployeeRelation,
        'EmployeeId': instance.EmployeeId,
        'EmployeeRelation': instance.EmployeeRelation,
        'DoctorId': instance.DoctorId,
        'DoctorRelation': instance.DoctorRelation,
        'DonationType': instance.DonationType,
        'IsMLC': instance.IsMLC,
        'IsReferral': instance.IsReferral,
        'Status': instance.Status,
        'Bill_Status': instance.Bill_Status,
        'ConsultingTime': instance.ConsultingTime,
        'CompletedTime': instance.CompletedTime,
        'FinalCompletedTime': instance.FinalCompletedTime,
        'CancelTime': instance.CancelTime,
        'CancelReason': instance.CancelReason,
        'ResheduleDoctor': instance.ResheduleDoctor,
        'ResheduleSpeciality': instance.ResheduleSpeciality,
        'ResheduleReason': instance.ResheduleReason,
        'ResheduleTime': instance.ResheduleTime,
        'Reason': instance.Reason,
        'IP_Request_status': instance.IP_Request_status,
        'Location': instance.Location,
        'NextToKinName': instance.NextToKinName,
        'Relation': instance.Relation,
        'RelativePhNo': instance.RelativePhNo,
        'ServiceCategory': instance.ServiceCategory,
        'ServiceSubCategory': instance.ServiceSubCategory,
        'created_by': instance.created_by,
        'updated_by': instance.updated_by,
        'IsOriginal': True
    }
 
    # Create only (no update)
    MCI_Patient_Appointment_Registration_Detials.objects.create(**mci_appointment_data)
 
 
@receiver(post_save, sender=OP_Patient_Appointment_With_Multiple_Doctor)
def sync_multiple_doctor_appointment_to_mci(sender, instance, created, **kwargs):
    """
    Signal to copy OP_Patient_Appointment_With_Multiple_Doctor data
    into MCI_OP_Patient_Appointment_With_Multiple_Doctor only when created.
    """
    if not created:
        # Do nothing if the record is being updated
        return
 
    # Try to get the corresponding MCI_Patient_Appointment_Registration_Detials record
    mci_registration = None
    if instance.Registration_Id:
        try:
            print(instance.Registration_Id.Registration_Id, 'instance.pk')
            mci_registration = (
                MCI_Patient_Appointment_Registration_Detials.objects
                .filter(Registration_Id=instance.Registration_Id.Registration_Id)
                .last()
            )
        except MCI_Patient_Appointment_Registration_Detials.DoesNotExist:
            return  # Skip if not found
 
    # If no linked MCI registration found, stop
    if not mci_registration:
        return
 
    # Prepare data to insert into MCI table
    mci_appointment_data = {
        'Registration_Id': mci_registration,
        'PrimaryDoctor': instance.PrimaryDoctor,
        'Specialization': instance.Specialization,
        'AppointmentSlot_by_Specialization': instance.AppointmentSlot_by_Specialization,
        'AppointmentSlot_by_Doctor': instance.AppointmentSlot_by_Doctor,
        'VisitType': instance.VisitType,
        'Complaint': instance.Complaint,
        'TokenNo': instance.TokenNo,
        'created_by': instance.created_by,
        'Status': instance.Status,
        'updated_by': instance.updated_by,
    }
 
    # Create only — do not update if already exists
    MCI_OP_Patient_Appointment_With_Multiple_Doctor.objects.create(**mci_appointment_data)
 
 


# @receiver(post_save, sender=Patient_Referral_Detials)
# def sync_referral_to_mci(sender, instance, created, **kwargs):
#     logger.debug(f"Signal triggered for Patient_Referral_Detials, created={created}, instance={instance.id}")
 
#     # Run only when a new record is created
#     if not created:
#         logger.debug("Existing Patient_Referral_Detials updated — skipping MCI sync.")
#         return
 
#     mci_op_register = None
#     if instance.OP_Register_Id:
#         try:
#             mci_op_register = MCI_Patient_Appointment_Registration_Detials.objects.get(
#                 Registration_Id=instance.OP_Register_Id.Registration_Id
#             )
#             logger.debug(f"Found MCI_Patient_Appointment_Registration_Detials: {mci_op_register.Registration_Id}")
#         except MCI_Patient_Appointment_Registration_Detials.DoesNotExist:
#             logger.warning(
#                 f"No MCI_Patient_Appointment_Registration_Detials found for OP_Register_Id: {instance.OP_Register_Id}"
#             )
#             return
 
#     # If no matching registration found, stop
#     if not mci_op_register:
#         logger.warning("No corresponding MCI registration found — skipping MCI referral creation.")
#         return
 
#     # Prepare the data for insertion
#     mci_referral_data = {
#         'ReferralRegisteredBy': instance.ReferralRegisteredBy,
#         'OP_Register_Id': mci_op_register,
#         'ReferralSource': instance.ReferralSource,
#         'ReferredBy': instance.ReferredBy,
#         'created_by': instance.created_by,
#         'updated_by': instance.updated_by,
#     }
 
#     # Check if referral already exists to prevent duplicates
#     exists = MCI_Patient_Referral_Detials.objects.filter(
#         OP_Register_Id=mci_op_register
#     ).exists()
 
#     if exists:
#         logger.debug(f"MCI_Patient_Referral_Detials already exists for OP_Register_Id: {mci_op_register}")
#         return  # Skip duplicate creation
 
#     # Create only (no update)
#     try:
#         with transaction.atomic():
#             mci_referral = MCI_Patient_Referral_Detials.objects.create(**mci_referral_data)
#             logger.debug(f"Created new MCI_Patient_Referral_Detials (id={mci_referral.id}) for OP_Register_Id: {mci_op_register}")
#     except Exception as e:
#         logger.error(f"Error while creating MCI_Patient_Referral_Detials: {str(e)}")




@receiver(post_save, sender=RoomType_Master_Detials)
def sync_room_type_to_mci(sender, instance, created, **kwargs):
    try:
        if created:
            print('Signal created for MCI_RoomType_Master_Detials')

        mci_room_type_data = {
            'Building_Name': instance.Building_Name,
            'Block_Name': instance.Block_Name,
            'Floor_Name': instance.Floor_Name,
            'Ward_Name': instance.Ward_Name,
            'Location_Name': instance.Location_Name,
            'RoomNo': instance.RoomNo,
            'Status': instance.Status,
            'created_by': instance.created_by,
        }

        mci_room_type, mci_created = MCI_RoomType_Master_Detials.objects.get_or_create(
            Room_Id=instance.Room_Id,
            defaults=mci_room_type_data
        )

        if not mci_created:
            for field, value in mci_room_type_data.items():
                if field not in ['Room_Id']:
                    setattr(mci_room_type, field, value)
            mci_room_type.save()

        print('Signal ended for MCI_RoomType_Master_Detials')

    except ObjectDoesNotExist as e:
        print(f"Error: {e}")

@receiver(post_save, sender=Room_Master_Detials)
def sync_room_master_to_mci(sender, instance, created, **kwargs):
    try:
        if created:
            print('Signal created for MCI_Room_Master_Detials')

        mci_room_master_data = {
            'Building_Name': instance.Building_Name,
            'Block_Name': instance.Block_Name,
            'Floor_Name': instance.Floor_Name,
            'Ward_Name': instance.Ward_Name,  # Note: This is RoomType_Master_Detials in source, but MCI_RoomType_Master_Detials in MCI
            'Location_Name': instance.Location_Name,
            'NOB': instance.NOB,
            'Bed_No': instance.Bed_No,
            'Status': instance.Status,
            'Booking_Status': instance.Booking_Status,
            'created_by': instance.created_by,
        }

        mci_room_master, mci_created = MCI_Room_Master_Detials.objects.get_or_create(
            Room_Id=instance.Room_Id,
            defaults=mci_room_master_data
        )

        if not mci_created:
            for field, value in mci_room_master_data.items():
                if field not in ['Room_Id']:
                    setattr(mci_room_master, field, value)
            mci_room_master.save()

        print('Signal ended for MCI_Room_Master_Detials')

    except ObjectDoesNotExist as e:
        print(f"Error: {e}")


@receiver(post_save, sender=Patient_IP_Registration_Detials)
def sync_patient_ip_registration_to_mci(sender, instance, created, **kwargs):
    try:
        # Run only when a new Patient_IP_Registration_Detials record is created
        if not created:
            return  # skip updates entirely

        # Only process if instance has a valid PatientId
        if not instance.PatientId:
            print('No PatientId provided, skipping synchronization')
            return

        print('Signal triggered for creating MCI_Patient_IP_Registration_Detials')

        try:
            mci_patient = MCI_Patient_Detials.objects.get(PatientId=instance.PatientId.PatientId)
        except MCI_Patient_Detials.DoesNotExist:
            print(f'No MCI_Patient_Detials found for PatientId: {instance.PatientId.PatientId}')
            return

        mci_ip_registration_data = {
            'PatientId': mci_patient,
            'Specialization': instance.Specialization,
            'PrimaryDoctor': instance.PrimaryDoctor,
            'Complaint': instance.Complaint,
            'IsMLC': instance.IsMLC,
            'Flagging': instance.Flagging,
            'IsReferral': instance.IsReferral,
            'PatientCategory': instance.PatientCategory,
            'InsuranceName': instance.InsuranceName,
            'InsuranceType': instance.InsuranceType,
            'ClientName': instance.ClientName,
            'ClientType': instance.ClientType,
            'ClientEmployeeId': instance.ClientEmployeeId,
            'ClientEmployeeDesignation': instance.ClientEmployeeDesignation,
            'ClientEmployeeRelation': instance.ClientEmployeeRelation,
            'CorporateName': instance.CorporateName,
            'CorporateType': instance.CorporateType,
            'CorporateEmployeeId': instance.CorporateEmployeeId,
            'CorporateEmployeeDesignation': instance.CorporateEmployeeDesignation,
            'CorporateEmployeeRelation': instance.CorporateEmployeeRelation,
            'EmployeeId': instance.EmployeeId,
            'EmployeeRelation': instance.EmployeeRelation,
            'DoctorId': instance.DoctorId,
            'DoctorRelation': instance.DoctorRelation,
            'DonationType': instance.DonationType,
            'Status': 'Admitted',
            'Booking_Status': 'Occupied',
            'Reason': instance.Reason,
            'Location': instance.Location,
            'created_by': instance.created_by,
            'updated_by': instance.updated_by,
            'IsOriginal' : True,
            'created_at' : instance.created_at
 
        }

        # Create a new record (no update or overwrite)
        MCI_Patient_IP_Registration_Detials.objects.create(
            Registration_Id=instance.Registration_Id,
            **mci_ip_registration_data
        )

        print('✅ MCI_Patient_IP_Registration_Detials created successfully.')

    except Exception as e:
        print(f"❌ Error in sync_patient_ip_registration_to_mci: {str(e)}")

@receiver(post_save, sender=Patient_Admission_Detials)
def sync_patient_admission_to_mci(sender, instance, created, **kwargs):
    try:
        # Only run when a new record is created
        if not created:
            return  # Skip updates entirely

        # Must have a valid IP_Registration_Id
        if not instance.IP_Registration_Id:
            print('No IP_Registration_Id provided, skipping synchronization')
            return

        print('Signal triggered for creating MCI_Patient_Admission_Detials')

        # Find the corresponding MCI IP Registration record
        mci_ip_regid = MCI_Patient_IP_Registration_Detials.objects.filter(
            Registration_Id=instance.IP_Registration_Id.Registration_Id
        ).first()

        if not mci_ip_regid:
            print(f'No MCI_Patient_IP_Registration_Detials found for Registration_Id: {instance.IP_Registration_Id.Registration_Id}')
            return

        # Prepare admission data for MCI table
        mci_admission_data = {
            'IsConverted': instance.IsConverted,
            'IsCasualityPatient': instance.IsCasualityPatient,
            'IP_Registration_Id': mci_ip_regid,
            'OP_Registration_Id': instance.OP_Registration_Id,
            'Emergency_Registration_Id': instance.Emergency_Registration_Id,
            'Casuality_Registration_Id': instance.Casuality_Registration_Id,
            'Diagnosis_Registration_Id': instance.Diagnosis_Registration_Id,
            'Laboratory_Registration_Id': instance.Laboratory_Registration_Id,
            'AdmissionPurpose': instance.AdmissionPurpose,
            'DrInchargeAtTimeOfAdmission': instance.DrInchargeAtTimeOfAdmission,
            'NextToKinName': instance.NextToKinName,
            'Relation': instance.Relation,
            'RelativePhoneNo': instance.RelativePhoneNo,
            'PersonLiableForPayment': instance.PersonLiableForPayment,
            'PersonLiablecontactno': instance.PersonLiablecontactno,
            'visitDate': instance.visitDate,
            'visitTime': instance.visitTime,
            'FamilyHead': instance.FamilyHead,
            'FamilyHeadName': instance.FamilyHeadName,
            'IpKitGiven': instance.IpKitGiven,
            'created_by': instance.created_by,
            'updated_by': instance.updated_by,
        }

        # Create new MCI admission record (no updates)
        MCI_Patient_Admission_Detials.objects.create(
            
            **mci_admission_data
        )

        print('✅ MCI_Patient_Admission_Detials created successfully.')

    except Exception as e:
        print(f"❌ Error in sync_patient_admission_to_mci: {str(e)}")

# @receiver(post_save, sender=Patient_Admission_Room_Detials)
# def sync_patient_admission_room_to_mci(sender, instance, created, **kwargs):
#     try:
#         if not instance.IP_Registration_Id:
#             logger.warning('No IP_Registration_Id provided, skipping synchronization')
#             return

#         if created:
#             logger.info(f'Signal triggered for creating MCI_Patient_Admission_Room_Detials for Admission Id: {instance.id}')

#         # Get matching MCI IP Registration record
#         mci_ip_regid = MCI_Patient_IP_Registration_Detials.objects.filter(
#             Registration_Id=instance.IP_Registration_Id.Registration_Id
#         ).first()

#         if not mci_ip_regid:
#             logger.error(f'No MCI_Patient_IP_Registration_Detials found for Registration_Id: {instance.IP_Registration_Id.Registration_Id}')
#             return

#         # Get matching MCI Room
#         mci_room_id = MCI_Room_Master_Detials.objects.filter(Room_Id=instance.RoomId.Room_Id).first()
#         if not mci_room_id:
#             logger.error(f'No MCI_Room_Master_Detials found for Room_Id: {instance.RoomId.Room_Id}')
#             return
        
#         print(mci_room_id.Booking_Status,'mci_room_id.Booking_Status')

#         if mci_room_id.Booking_Status == 'Available':

#             print('available')
#             mci_admission_room_data = {
#                 'RegisterType': instance.RegisterType,
#                 'IP_Registration_Id': mci_ip_regid,
#                 'Emergency_Registration_Id': instance.Emergency_Registration_Id,
#                 'Casuality_Registration_Id': instance.Casuality_Registration_Id,
#                 'RoomId': mci_room_id,
#                 'Admitted_Date': instance.created_at,
#                 'Discharge_Date': instance.Discharge_Date,
#                 'Status': instance.Status,
#                 'IsStayed': True,
#                 'CurrentlyStayed': True,
#                 'Iscanceled': instance.Iscanceled,
#                 'created_by': instance.created_by,
#                 'updated_by': instance.updated_by,
#                 'Approved_by': instance.Approved_by,
#                 'CancelReason': instance.CancelReason,
#                 'PatientfileRecieved': instance.PatientfileRecieved,
#                 'MedicineTransfered': instance.MedicineTransfered,
#                 'AnyMedicalRecordError': instance.AnyMedicalRecordError,
#                 'ConfirmationfromReletives': instance.ConfirmationfromReletives,  # Corrected typo
#                 'ReletiveName': instance.ReletiveName,  # Corrected typo
#                 'MedRecReason': instance.MedRecReason,
#                 'bedtransferReason': instance.bedtransferReason,
#             }

#             mci_admission_room, mci_created = MCI_Patient_Admission_Room_Detials.objects.update_or_create(
               
#                 defaults=mci_admission_room_data
#             )

#             # Update room status to Occupied
#             mci_room_id.Booking_Status = 'Occupied'
#             mci_room_id.save()

#             logger.info(f'MCI Admission Room record {"created" if mci_created else "updated"} successfully for Admission Id: {instance.id}')

#         elif mci_room_id.Booking_Status == 'Occupied':

#             print('Occupied')
#             # Find patient currently staying in that room
#             occupied_pat_ins = MCI_Patient_Admission_Room_Detials.objects.filter(
#                 RoomId=mci_room_id,  # Changed to mci_room_id for consistency
#                 CurrentlyStayed=True,
#                 IsStayed=True
#             ).first()

#             if not occupied_pat_ins:
#                 logger.warning(f"No occupied patient found in Room_Id: {mci_room_id.Room_Id} to vacate")
#                 # Proceed with new admission even if no occupant is found
#             else:
#                 occupied_pat_ins.CurrentlyStayed = False
#                 occupied_pat_ins.IsStayed = False
#                 occupied_pat_ins.Discharge_Date = instance.created_at
#                 occupied_pat_ins.save()

#                 Regid = occupied_pat_ins.IP_Registration_Id.Registration_Id
#                 Regins = MCI_Patient_IP_Registration_Detials.objects.filter(
#                     Registration_Id=Regid
#                 ).first()

#                 if not Regins:
#                     logger.error(f"No MCI_Patient_IP_Registration_Detials found for Registration_Id: {Regid}")
#                 else:
#                     Regins.Booking_Status = 'Vacated'
#                     Regins.Status = 'Completed'
#                     Regins.save()

#                     discharge_ins = MCI_Patient_Discharge_Detials(
#                         Registration_Id=Regins,
#                         Discharge_Date=instance.created_at,
#                         Discharge_Reason='Room reassigned to new patient',  # Added discharge reason
#                         created_by=instance.created_by
#                     )
#                     discharge_ins.save()

#                     logger.info(f'Discharge details created for Registration_Id: {Regid}')

#             # Update room status to Available before creating new admission
#             mci_room_id.Booking_Status = 'Available'
#             mci_room_id.save()

#             mci_admission_room_data = {
#                 'RegisterType': instance.RegisterType,
#                 'IP_Registration_Id': mci_ip_regid,
#                 'Emergency_Registration_Id': instance.Emergency_Registration_Id,
#                 'Casuality_Registration_Id': instance.Casuality_Registration_Id,
#                 'RoomId': mci_room_id,
#                 'Admitted_Date': instance.Admitted_Date,
#                 'Discharge_Date': instance.Discharge_Date,
#                 'Status': instance.Status,
#                 'IsStayed': True,
#                 'CurrentlyStayed': True,
#                 'Iscanceled': instance.Iscanceled,
#                 'created_by': instance.created_by,
#                 'updated_by': instance.updated_by,
#                 'Approved_by': instance.Approved_by,
#                 'CancelReason': instance.CancelReason,
#                 'PatientfileRecieved': instance.PatientfileRecieved,
#                 'MedicineTransfered': instance.MedicineTransfered,
#                 'AnyMedicalRecordError': instance.AnyMedicalRecordError,
#                 'ConfirmationfromReletives': instance.ConfirmationfromReletives,  # Corrected typo
#                 'ReletiveName': instance.ReletiveName,  # Corrected typo
#                 'MedRecReason': instance.MedRecReason,
#                 'bedtransferReason': instance.bedtransferReason,
#             }

#             mci_admission_room, mci_created = MCI_Patient_Admission_Room_Detials.objects.update_or_create(
#                 id=instance.id,
#                 defaults=mci_admission_room_data
#             )

#             # Update room status to Occupied after new admission
#             mci_room_id.Booking_Status = 'Occupied'
#             mci_room_id.save()

#             logger.info(f'MCI Admission Room record {"created" if mci_created else "updated"} successfully for Admission Id: {instance.id}')

#         logger.info(f'Signal processing completed for Admission Id: {instance.id}')

#     except Exception as e:
#         logger.error(f"Error in sync_patient_admission_room_to_mci for Admission Id: {instance.id}: {str(e)}")




@receiver(post_save, sender=Patient_Admission_Room_Detials)
def sync_patient_admission_room_to_mci(sender, instance, created, **kwargs):
    try:
        if not instance.IP_Registration_Id:
            logger.warning('No IP_Registration_Id provided, skipping synchronization')
            return
 
        if created:
            logger.info(f'Signal triggered for creating MCI_Patient_Admission_Room_Detials for Admission Id: {instance.id}')
 
        # Get matching MCI IP Registration record
        mci_ip_regid = MCI_Patient_IP_Registration_Detials.objects.filter(
            Registration_Id=instance.IP_Registration_Id.Registration_Id
        ).first()
 
        if not mci_ip_regid:
            logger.error(f'No MCI_Patient_IP_Registration_Detials found for Registration_Id: {instance.IP_Registration_Id.Registration_Id}')
            return
 
        # Get matching MCI Room
        mci_room_id = MCI_Room_Master_Detials.objects.filter(Room_Id=instance.RoomId.Room_Id).first()
        if not mci_room_id:
            logger.error(f'No MCI_Room_Master_Detials found for Room_Id: {instance.RoomId.Room_Id}')
            return
       
        print(mci_room_id.Booking_Status,'mci_room_id.Booking_Status')
 
        if mci_room_id.Booking_Status == 'Available':
 
            print('available fakeeeeeeeeeeeeeeeee')
            mci_admission_room_data = {
                'RegisterType': instance.RegisterType,
                'IP_Registration_Id': mci_ip_regid,
                'Emergency_Registration_Id': instance.Emergency_Registration_Id,
                'Casuality_Registration_Id': instance.Casuality_Registration_Id,
                'RoomId': mci_room_id,
                'Admitted_Date': instance.created_at,
                'Discharge_Date': instance.Discharge_Date,
                'Status': True,
                'IsStayed': True,
                'CurrentlyStayed': True,
                'Iscanceled': instance.Iscanceled,
                'created_by': instance.created_by,
                'updated_by': instance.updated_by,
                'Approved_by': instance.Approved_by,
                'CancelReason': instance.CancelReason,
                'PatientfileRecieved': instance.PatientfileRecieved,
                'MedicineTransfered': instance.MedicineTransfered,
                'AnyMedicalRecordError': instance.AnyMedicalRecordError,
                'ConfirmationfromReletives': instance.ConfirmationfromReletives,  # Corrected typo
                'ReletiveName': instance.ReletiveName,  # Corrected typo
                'MedRecReason': instance.MedRecReason,
                'bedtransferReason': instance.bedtransferReason,
            }
 
            mci_admission_room = MCI_Patient_Admission_Room_Detials.objects.create(**mci_admission_room_data)
 
 
            # Update room status to Occupied
            mci_room_id.Booking_Status = 'Occupied'
            mci_room_id.save()
 
 
            prev_mci_admission_room = (
                MCI_Patient_Admission_Room_Detials.objects
                .filter(IP_Registration_Id__IPNo=mci_ip_regid.IPNo)
                .exclude(pk=mci_admission_room.pk)  
            )
 
            if prev_mci_admission_room:
 
                for prev in prev_mci_admission_room:
 
                    prev.IsStayed = False
                    prev.CurrentlyStayed = False
 
                    prev_room_ins = MCI_Room_Master_Detials.objects.filter(Room_Id = prev.RoomId.Room_Id).first()
 
                    if prev_room_ins:
                        prev_room_ins.Booking_Status = 'Available'
                        prev_room_ins.save()
 
 
 
 
        else:
 
            print('Occupied fakeeeeeeeeeeeeeeeee')
            # Find patient currently staying in that room
            occupied_pat_ins = MCI_Patient_Admission_Room_Detials.objects.filter(
                RoomId=mci_room_id,  # Changed to mci_room_id for consistency
                CurrentlyStayed=True,
                IsStayed=True
            ).first()
 
           
 
            ward_ins = WardType_Master_Detials.objects.filter(Ward_Id = mci_room_id.Ward_Name.Ward_Name.Ward_Id).first()
            print(ward_ins,'ward_ins for Fake Patient')
           
            Room_ins = MCI_RoomType_Master_Detials.objects.filter(Ward_Name__Ward_Id = ward_ins.Ward_Id).first()
            print(Room_ins,'Room_ins for Fake Patient')
           
            Bed_ins = MCI_Room_Master_Detials.objects.filter(Ward_Name__Room_Id = Room_ins.Room_Id,Booking_Status='Available').first()
            print(Bed_ins,'Bed_ins for Fake Patient')
           
 
            mci_admission_room_data = {
                'RegisterType': instance.RegisterType,
                'IP_Registration_Id': mci_ip_regid,
                'Emergency_Registration_Id': instance.Emergency_Registration_Id,
                'Casuality_Registration_Id': instance.Casuality_Registration_Id,
                'RoomId': Bed_ins,
                'Admitted_Date': instance.Admitted_Date,
                'Discharge_Date': instance.Discharge_Date,
                'Status': instance.Status,
                'IsStayed': True,
                'CurrentlyStayed': True,
                'Iscanceled': instance.Iscanceled,
                'created_by': instance.created_by,
                'updated_by': instance.updated_by,
                'Approved_by': instance.Approved_by,
                'CancelReason': instance.CancelReason,
                'PatientfileRecieved': instance.PatientfileRecieved,
                'MedicineTransfered': instance.MedicineTransfered,
                'AnyMedicalRecordError': instance.AnyMedicalRecordError,
                'ConfirmationfromReletives': instance.ConfirmationfromReletives,  # Corrected typo
                'ReletiveName': instance.ReletiveName,  # Corrected typo
                'MedRecReason': instance.MedRecReason,
                'bedtransferReason': instance.bedtransferReason,
            }
 
            mci_admission_room = MCI_Patient_Admission_Room_Detials.objects.create(**mci_admission_room_data)
 
            # Update room status to Occupied after new admission
            Bed_ins.Booking_Status = 'Occupied'
            Bed_ins.save()
 
 
            prev_mci_admission_room = (
                MCI_Patient_Admission_Room_Detials.objects
                .filter(IP_Registration_Id__IPNo=mci_ip_regid.IPNo)
                .exclude(pk=mci_admission_room.pk)  
            )
 
            if prev_mci_admission_room:
 
                for prev in prev_mci_admission_room:
 
                    prev.IsStayed = False
                    prev.CurrentlyStayed = False
 
                    prev_room_ins = MCI_Room_Master_Detials.objects.filter(Room_Id = prev.RoomId.Room_Id).first()
 
                    if prev_room_ins:
                        prev_room_ins.Booking_Status = 'Available'
                        prev_room_ins.save()
 
 
 
        logger.info(f'Signal processing completed for Admission Id: {instance.id}')
 
    except Exception as e:
        logger.error(f"Error in sync_patient_admission_room_to_mci for Admission Id: {instance.id}: {str(e)}")
 
 
 
























# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.core.management import call_command
# from MCI.models import MCI_Patient_Discharge_Detials
# import logging

# logger = logging.getLogger(__name__)

# @receiver(post_save, sender=MCI_Patient_Discharge_Detials)
# def trigger_ip_admissions(sender, instance, created, **kwargs):
#     if created:
#         logger.info("New discharge detected, triggering manage_ip_admissions")
#         try:
#             call_command('manage_ip_admissions')
#             logger.info("Successfully ran manage_ip_admissions after discharge")
#         except Exception as e:
#             logger.error(f"Error running manage_ip_admissions after discharge: {e}")



@receiver(post_save, sender=IP_PhysicalDischargeChecklist)
def trigger_discharge_patients(sender, instance, created, **kwargs):
    """
    Signal handler to update patient IP registration and room details when a physical discharge checklist is created.
    """
    if not created:
        return  # Only process new discharge checklists
 
    print('Discharge startsssss')
 
    try:
        # Fetch the IP registration record
        ip_registration = MCI_Patient_IP_Registration_Detials.objects.filter(
            Registration_Id=instance.Ip_Registration_Id.Registration_Id
        ).first()
 
        if not ip_registration:
            logger.error(f"No IP registration found for Registration_Id: {instance.Ip_Registration_Id.Registration_Id}")
            return
 
        # Update IP registration status
        
 
        # Fetch and update room details
        room_details = MCI_Patient_Admission_Room_Detials.objects.filter(
            IP_Registration_Id=ip_registration
        )
 
        discharge_date = instance.created_at  # Use discharge checklist creation time
 
        if not room_details.exists():
            logger.warning(f"No room details found for Registration_Id: {ip_registration.Registration_Id}")
        else:
            for room_data in room_details:
                room_data.Discharge_Date = discharge_date
                room_data.CurrentlyStayed = False
                room_data.IsStayed = False
                room_data.Status = False  # Assuming Status should also be updated
                room_data.save()
 
                # Update room's booking status
                if room_data.RoomId:
                    room_data.RoomId.Booking_Status = 'Available'
                    room_data.RoomId.save()
 
        # Create discharge details entry
        MCI_Patient_Discharge_Detials.objects.create(
            Registration_Id=ip_registration,
            Discharge_Date=discharge_date,
            Discharge_Reason='Routine Discharge',  # Default or you can customize
            created_by=instance.Created_by if hasattr(instance, 'Created_by') else 'system'
        )

        ip_registration.Status = 'Completed'
        ip_registration.Booking_Status = 'Vacated'
        ip_registration.DischargeDate = discharge_date
        ip_registration.save()
 
        logger.info(f"Successfully processed discharge for Registration_Id: {ip_registration.Registration_Id}")
 
    except Exception as e:
        logger.error(f"Error processing discharge for Registration_Id: {instance.Ip_Registration_Id.Registration_Id}: {str(e)}")
 
 
 
from django.db.models.signals import post_save
from django.dispatch import receiver
 
from .models import IP_Patient_Diagnosis_Data, MRD_IP_Patient_Diagnosis_Data
 
 
@receiver(post_save, sender=IP_Patient_Diagnosis_Data)
def transfer_diagnosis_to_mrd(sender, instance, created, **kwargs):
    """
    When a new record is created in IP_Patient_Diagnosis_Data,
    copy it to MRD_IP_Patient_Diagnosis_Data.
    This does NOT run on updates.
    """
    if not created:
        return  # Only run on creation
 
    # Check if a record with the same Patient_Id and Register_Id already exists
    # to avoid duplicates (optional but recommended)
 
    patins = MCI_Patient_Detials.objects.filter(PatientId = instance.Patient_Id.PatientId).first()
 
    regins = MCI_Patient_IP_Registration_Detials.objects.filter(Registration_Id = instance.Register_Id.Registration_Id).first()

    if regins:
 
 
        exists = MRD_IP_Patient_Diagnosis_Data.objects.filter(
            Patient_Id=patins,
            Register_Id=regins,
            ICDCode=instance.ICDCode,
            Diagnosis=instance.Diagnosis,
        ).exists()
    
        if exists:
            return  # Skip if already transferred
    
        # Create the new record in MRD table
        MRD_IP_Patient_Diagnosis_Data.objects.create(
            Patient_Id=patins,
            Register_Id=regins,
            ICDCode=instance.ICDCode,
            Code_Description=instance.Code_Description,
            Diagnosis=instance.Diagnosis,
            created_by=instance.created_by,
            # created_at and updated_at will be auto-filled
            canceled_by=instance.canceled_by,
            Status=instance.Status,
        )
 
 
 
  


