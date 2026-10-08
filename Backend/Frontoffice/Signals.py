from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from .models import *
from Frontoffice.models import *
from Masters.models import *
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist


@receiver(post_save, sender=Patient_Admission_Room_Detials)
def create_Patient_Admission_Room_Detials(sender, instance, created, **kwargs):
    if created:

 
        roomid = instance.RoomId.Room_Id      
        roommaster_instance = Room_Master_Detials.objects.get(Room_Id = roomid)
        roommaster_instance.Booking_Status = 'Booked'
 
        try:
           roommaster_instance.save()
        except Exception as e:
            print(str(e),'err')
  
        print('✅ Room Updated  successfully.')
 
 
 


from django.db import transaction

@receiver(post_save, sender=Op_to_Ip_Convertion_Table)
def update_app_regis_op_to_ip_on_update(sender, instance, created, **kwargs):
    print('-0-9-9-9-0-0')

    if Patient_Appointment_Registration_Detials.objects.filter(pk=instance.Registration_id.pk).exists():
        app_instance = Patient_Appointment_Registration_Detials.objects.get(pk=instance.Registration_id.pk)
        print(f"Before saving: IP_Request_status = {app_instance.IP_Request_status}")

        if created:
            print('-11', app_instance.Status)
            app_instance.IP_Request_status = 'Requested'
        else:
            print('-00', app_instance.Status)
            app_instance.IP_Request_status = 'Transfered'
            app_instance.Status = 'Completed'

        with transaction.atomic():
            app_instance.save(update_fields=['IP_Request_status','Status'])
            print(f"After saving: IP_Request_status = {app_instance.IP_Request_status}")
            app_instance.refresh_from_db()
            print(f"from db saving: IP_Request_status = {app_instance.IP_Request_status}")





#-------Jeeva------ Don't Change---------

@receiver(post_save, sender=OP_Patient_Appointment_With_Multiple_Doctor)
@transaction.atomic
def Create_OP_Billing_Details(sender, instance, created, **kwargs):
    print(f"Signal received for creating OP billing details for {instance}")
   
    if created:
        try:
            # Fetch the doctor rate card if a PrimaryDoctor is assigned
            if instance.PrimaryDoctor:
                Doctors_Instance = Doctor_Ratecard_Master.objects.get(
                    Doctor_ID__Doctor_ID=instance.PrimaryDoctor.Doctor_ID
                )
            else:
                Doctors_Instance = None
 
            print(f"Doctor Ratecard Instance: {Doctors_Instance}")
            
            regis_in = OP_Billing_QueueList_Detials.objects.filter(
                Registration_Id=instance.Registration_Id
            ).exists()

            if not regis_in:
                billing_type_mapping = {
                    'OP': 'Consultation',
                    'CASUALITY':'Consultation',
                    'LAB': 'Lab',
                    'RADIOLOGY': 'Radiology',
                    'SERVICES' : 'Services',
                    'MHC' : 'MCH',
                }

                billing_type = billing_type_mapping.get(instance.Registration_Id.VisitPurpose)

                if billing_type:
                    OP_Billing_QueueList_Detials.objects.create(
                        Billing_Type=billing_type,
                        Registration_Id=instance.Registration_Id,
                        Doctor_Ratecard_Id=Doctors_Instance,
                        Status='Pending',
                        created_by=instance.created_by,
                        created_at=instance.created_at,
                        updated_at=instance.updated_at
                    )
                    print(f"OP Billing details created successfully for {instance.Registration_Id}")

        except Doctor_Ratecard_Master.DoesNotExist:
            print(f"Error: No Doctor Ratecard found for Doctor ID {instance.PrimaryDoctor.Doctor_ID}")
        except Exception as e:
            print(f"Unexpected error in Create_OP_Billing_Details: {e}")

# @receiver(post_save, sender=Patient_Emergency_Registration_Detials)
# @transaction.atomic
# def Create_OP_Billing_Details_For_Casuality(sender, instance, created, **kwargs):
#     print(f"Signal received for creating emg OP billing details for {instance}")
   
#     if created:
#         try:

#             # Fetch the doctor rate card if a PrimaryDoctor is assigned

#             if instance.VisitType in ['NewConsultation','FollowUp No Fee','FollowUp With Fee'] :


#                 if instance.PrimaryDoctor:
#                     Doctors_Instance = Doctor_Ratecard_Master.objects.get(
#                         Doctor_ID__Doctor_ID=instance.PrimaryDoctor.Doctor_ID
#                     )
#                 else:
#                     Doctors_Instance = None
    
#                 print(f"Doctor Emg Ratecard Instance: {Doctors_Instance}")
                
#                 regis_in = OP_Billing_QueueList_Detials.objects.filter(
#                     EmgRegistration_Id=instance.Registration_Id
#                 ).exists()

#                 if not regis_in:
#                     # billing_type_mapping = {
#                     #     'OP': 'Consultation',
#                     #     'CASUALITY':'Consultation',
#                     #     'LAB': 'Lab',
#                     #     'RADIOLOGY': 'Radiology'
#                     # }

#                     # billing_type = billing_type_mapping.get(instance.Registration_Id.VisitPurpose)

#                         OP_Billing_QueueList_Detials.objects.create(
#                             Billing_Type='Consultation',
#                             EmgRegistration_Id=instance,
#                             Doctor_Ratecard_Id=Doctors_Instance,
#                             Status='Pending',
#                             created_by=instance.created_by,
#                             created_at=instance.created_at,
#                             updated_at=instance.updated_at
#                         )
#                         print(f" Emg OP Billing details created successfully for {instance.Registration_Id}")



#         except Doctor_Ratecard_Master.DoesNotExist:
#             print(f"Error: No Doctor Ratecard found for Doctor ID {instance.PrimaryDoctor.Doctor_ID}")
#         except Exception as e:
#             print(f"Unexpected error in Create_OP_Billing_Details: {e}")


#-------Jeeva------ Don't Change---------




@receiver(post_save, sender=OP_Patient_Appointment_With_Multiple_Doctor)
def Create_OPD_Flow_Registration(sender, instance, created, **kwargs):
    print(f"OPD flow signal triggered for {instance}")
    
    if created:
        try:
            # Fetch the related patient from the Registration_Id
            RegisterInstance = instance.Registration_Id
            patient = RegisterInstance.PatientId  # Corrected way to fetch the patient

            # Fetch the primary doctor and specialization
            primary_doctor = instance.PrimaryDoctor.Doctor_ID if instance.PrimaryDoctor else None
            specialization = instance.Specialization.Speciality_Id if instance.Specialization else None

            print(f"Patient: {patient}, Doctor: {primary_doctor}, Specialization: {specialization}")

            # Create the OPD Flow record
            OPD_Flow.objects.create(
                Patient_Id=patient,
                Specialization=specialization,
                DoctorId=primary_doctor,
                RegisterType='Registration',
                Registration_Id=RegisterInstance,
                Registration_Status=instance.Registration_Id.Status,
                Appointment_Id=instance.Registration_Id.ApptoRegId,
                AppointmentType='AppointmentType' if instance.Registration_Id.ApptoRegId else '',
                Appointment_Status='REGISTERED' if instance.Registration_Id.ApptoRegId else '',
                created_by=instance.created_by,
                created_at=instance.created_at,
                updated_at=instance.updated_at
            )
            print(f"OPD_Flow record created successfully for Patient {patient}")

        except ObjectDoesNotExist as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error in Create_OPD_Flow_Registration: {e}")


#-------Jeeva------ Don't Change---------



@receiver(post_save, sender=Patient_Appointment_Registration_Cancel_Details)
def create_opd_flow_cancel(sender, instance, created, **kwargs):
    print("OPD Flow Cancel signal triggered")
    if created:
        try:
            # Fetch the related Patient, Doctor, and Specialization details
            patient = instance.Registration_Id.PatientId
            print("Patient fetched:", patient)

            primary_doctor = instance.Registration_Id.PrimaryDoctor
            print("Primary doctor fetched:", primary_doctor)

            specialization = instance.Registration_Id.Specialization
            print("Specialization fetched:", specialization)

            # Check if all required data exists
            if not all([patient, primary_doctor, specialization]):
                print("Missing related data. Patient, doctor, or specialization not found.")
                return

            # Create a new OPD_Flow record
            OPD_Flow.objects.create(
                Patient_Id=patient,  # Use the related patient instance
                Specialization=specialization,  # Use the related specialization instance
                DoctorId=primary_doctor,  # Use the related doctor instance
                RegisterType='Registration',  # Static value
                Registration_Id=instance.Registration_Id,  # Use the Registration object
                Registration_Cancel_Reason=instance.Cancel_Reason,  # Cancel reason from instance
                Registration_Status=instance.Status,  # Status from instance
                Appointment_Id = instance.Registration_Id.ApptoRegId if instance.Registration_Id else '',
                AppointmentType = 'AppointmentType' if instance.Registration_Id.ApptoRegId else '',
                Appointment_Status = 'REGISTERED' if instance.Registration_Id.ApptoRegId else '',
                created_by=instance.created_by,  # Use created_by from instance
                updated_by = instance.updated_by,
                created_at=instance.created_at,  # Preserve created_at timestamp
                updated_at=instance.updated_at  # Preserve updated_at timestamp
            )
            print("OPD_Flow Cancel record created successfully.")
        except Exception as e:
            print(f"Error creating OPD_Flow Cancelrecord:{e}")


@receiver(post_save, sender=Patient_Registration_Reshedule_Details)
def create_opd_flow_reshedule(sender, instance, created, **kwargs):
    print("OPD Flow Reshedule signal triggered")
    if created:
        try:
            # Fetch the related Patient, Doctor, and Specialization details
            patient = instance.Registration_Id.PatientId
            print("Patient fetched:", patient)
            
            Status = "Reshedule"
              
            primary_doctor = instance.Registration_Id.PrimaryDoctor
            print("Primary doctor fetched:", primary_doctor)

            specialization = instance.Registration_Id.Specialization
            print("Specialization fetched:", specialization)

            # Check if all required data exists
            if not all([patient, primary_doctor, specialization]):
                print("Missing related data. Patient, doctor, or specialization not found.")
                return

            # Create a new OPD_Flow record
            OPD_Flow.objects.create(
                Patient_Id=patient,  # Use the related patient instance
                Specialization=specialization,  # Use the related specialization instance
                DoctorId=primary_doctor,  # Use the related doctor instance
                RegisterType='Registration',  # Static value
                Registration_Id=instance.Registration_Id,  # Use the Registration object 
                Registration_Status=Status,  # Status from instance
                AppointmentDoctor = instance.AppointmentDoctor,
                RegistrationReshedule_Reason = instance.ChangingReason,
                Appointment_Id = instance.Registration_Id.ApptoRegId if instance.Registration_Id else '',
                AppointmentType = 'AppointmentType' if instance.Registration_Id.ApptoRegId else '',
                Appointment_Status = 'REGISTERED' if instance.Registration_Id.ApptoRegId else '',
                created_by=instance.created_by,  # Use created_by from instance
                updated_by = instance.updated_by,
                created_at=instance.created_at,  # Preserve created_at timestamp
                updated_at=instance.updated_at  # Preserve updated_at timestamp
            )
            print("OPD_Flow Reshedule record created successfully.")
        except Exception as e:
            print(f"Error creating OPD_Flow Reshedule record: {e}")


# @receiver(post_save, sender=Patient_Registration_Reshedule_Details)
# def create_opd_flow_reshedule(sender, instance, created, **kwargs):
#     print("OPD Flow Reshedule signal triggered")
#     if created:
#         try:
#             patient = instance.Registration_Id.PatientId
#             print("Patient fetched Reshedule:", patient)
            
#             primary_doctor = instance.Registration_Id.PrimaryDoctor
#             print("Primary doctor fetched Reshedule :", primary_doctor)
            
#             Status = "Reshedule"
#             specialization = instance.Registration_Id.Specialization
#             print("Specialization fetched:", specialization)
            
            
#             if not all([patient, primary_doctor, specialization]):
#                 print("Missing related data. Patient, doctor, or specialization not found.")
#                 return
#                # Create a new OPD_Flow record
#             OPD_Flow.objects.create(
#                 Patient_Id=patient,  # Use the related patient instance
#                 Specialization=specialization,  # Use the related specialization instance
#                 DoctorId=primary_doctor,  # Use the related doctor instance
#                 RegisterType='Registration',  # Static value
#                 Registration_Id=instance.Registration_Id,  # Use the Registration object
#                 RegistrationReshedule_Reason=instance.ChangingReason, 
#                 AppointmentDoctor = instance.AppointmentDoctor,# Cancel reason from instance
#                 Appointment_Id = instance.Registration_Id.ApptoRegId if instance.Registration_Id else '',
#                 Appointment_Status = instance.Registration_Id.ApptoRegId.status,
#                 Registration_Status=Status,  # Status from instance
#                 created_by=instance.created_by,  # Use created_by from instance
#                 created_at=instance.created_at,  # Preserve created_at timestamp
#                 updated_at=instance.updated_at  # Preserve updated_at timestamp
#             )
#             print("OPD_Flow Reshedule record created successfully.")
#         except Exception as e:
#             print(f"Error creating OPD_Flow Cancel record: {e}")
        



@receiver(post_save,sender=Appointment_Request_List)
def Create_OPD_flow_Appointment(sender,instance,created, **kwargs):
    print("OPD Appointment flow signal triggered")
    if created:
        try:
            AppointmentInstance = Appointment_Request_List.objects.get(appointment_id = instance.appointment_id)
            if instance.cancelReason in ['', None]:
                
                doctor = instance.doctor_name
                print("Doctor", doctor)
                specialization = instance.specialization
                print("specssss", specialization)

                OPD_Flow.objects.create(
                    Specialization=specialization,
                    DoctorId=doctor,
                    AppointmentType ='AppointmentType',
                    Appointment_Id = AppointmentInstance,
                    Appointment_Status = instance.status,
                    created_by=instance.created_by,  # Use data from the instance
                    created_at=instance.created_at,  # Use the original created_at from the instance
                    updated_at=instance.updated_at  # Use the updated_at from the instance
                )
                print("OPD_Flow App record created successfully.")

        except Doctor_Personal_Form_Detials.DoesNotExist:
            print(f"Error: Doctor with ID {instance.PrimaryDoctor_id} does not exist.")
        except Speciality_Detials.DoesNotExist:
            print(f"Error: Specialization with ID {instance.Specialization_id} does not exist.")
        except Exception as e:
            print(f'GeneralError:{e}')


@receiver(post_save, sender=Appointment_Request_List)
def Cancel_OPD_Flow_Appointment(sender, instance, created, **kwargs):
    print("OPD Flow Cancel App signal triggered")

    # Check if the appointment is being updated (not newly created)
    if not created:
        try:
            # Check if the status is CANCELLED and cancelReason is not empty
            if instance.status == 'CANCELLED' and instance.cancelReason and instance.cancelReason.strip():
                
                doctor = instance.doctor_name
                specialization = instance.specialization
                
                print(f"Doctor: {doctor}")
                print(f"Specialization: {specialization}")
                print(f"Specialization: {instance.updated_by}")
                
                # Create the OPD_Flow record for the cancelled appointment
                OPD_Flow.objects.create(
                    Specialization=specialization,
                    DoctorId=doctor,
                    AppointmentType='AppointmentType',  # Adjust this as necessary
                    Appointment_Id=instance,  # Reference the current instance
                    Appointment_Status=instance.status,
                    Appointment_Cancel_Reason = instance.cancelReason,
                    created_by=instance.created_by,  # Maintain original created_by field
                    updated_by = instance.updated_by if instance.updated_by else '',
                    created_at=instance.created_at,  # Maintain original created_at timestamp
                    updated_at=instance.updated_at   # Maintain the updated_at timestamp
                )
                print("OPD_Flow Cancel App record created successfully.")
                
        except Doctor_Personal_Form_Detials.DoesNotExist:
            print(f"Error: Doctor with ID {instance.PrimaryDoctor_id} does not exist.")
        except Speciality_Detials.DoesNotExist:
            print(f"Error: Specialization with ID {instance.Specialization_id} does not exist.")
        except Exception as e:
            print(f"GeneralError: {e}")

@receiver(post_save, sender = Appointment_ReSchedule_Request)
def Reschedule_OPD_Flow_Appointment(sender, instance,created, **kwargs):
    print("OPD Appointment flow Reschedule signal triggered")
    if created:
        try:
            Appointment_instance = Appointment_ReSchedule_Request(appointmentId = instance.appointmentId)
            doctor = instance.doctor_name
            print("Doctor", doctor)
            specialization = instance.specialization
            print("specssss", specialization)
            
            OPD_Flow.objects.create(
                Specialization=specialization,
                DoctorId=doctor,
                AppointmentType='AppointmentType',  # Adjust this as necessary
                Appointment_Id=  instance.appointmentId,  # Reference the current instance
                Appointment_Status='RE-SCHEDULED',
                Appointment_Reschedule_Reason = instance.ChangingReason,
                created_by=instance.created_by,  # Maintain original created_by field
                updated_by = instance.updated_by if instance.updated_by else '',
                created_at=instance.created_at,  # Maintain original created_at timestamp
                updated_at=instance.updated_at   # Maintain the updated_at timestamp
            )
            print("OPD_Flow Reschedule App record created successfully.")
        
        except Doctor_Personal_Form_Detials.DoesNotExist:
            print(f"Error: Doctor with ID {instance.PrimaryDoctor_id} does not exist.")
        except Speciality_Detials.DoesNotExist:
            print(f"Error: Specialization with ID {instance.Specialization_id} does not exist.")

        except Exception as e:
            print(f'GeneralError:{e}')
            
            

@receiver(post_save, sender=Patient_IP_Registration_Detials)
def Create_IP_Billing_Detailes(sender, instance, created, **kwargs):
    print('Signal received for creating IP billing details')
    try:
        if created:
            RegisterInstance = Patient_IP_Registration_Detials.objects.get(Registration_Id=instance.Registration_Id)
            # print('RegisterInstance', RegisterInstance.PrimaryDoctor.Doctor_ID)
            Doctors_Instance = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID=RegisterInstance.PrimaryDoctor.Doctor_ID) if RegisterInstance.PrimaryDoctor else None

            print('Doctor Ratecard Instance:', Doctors_Instance)
            IP_Billing_QueueList_Detials.objects.create(
                Billing_Type='Consultation',
                Registration_Id=RegisterInstance,
                Doctor_Ratecard_Id=Doctors_Instance,
                Status='Pending',
                created_by=instance.created_by,
                created_at=instance.created_at,
                updated_at=instance.updated_at
            )
            print('Sucessfully creating IP billing details')

    except ObjectDoesNotExist as e:
        print(f"Error: {e}")
    except Doctor_Ratecard_Master.DoesNotExist as e:
        print(f"Doctor Ratecard not found: {e}")

# @receiver(post_save, sender=Patient_Casuality_Registration_Detials)
# def Create_CASUALITY_Billing_Detailes(sender, instance, created, **kwargs):
#     print('Signal received for creating Casuality billing details')
#     try:
#         if created:
#             RegisterInstance = Patient_Casuality_Registration_Detials.objects.get(Registration_Id=instance.Registration_Id)
#             # print('RegisterInstance', RegisterInstance.PrimaryDoctor.Doctor_ID)
#             Doctors_Instance = Doctor_Ratecard_Master.objects.get(Doctor_ID__Doctor_ID=RegisterInstance.PrimaryDoctor.Doctor_ID) if RegisterInstance.PrimaryDoctor else None

#             print('Doctor Ratecard Instance:', Doctors_Instance)
#             Casuality_Billing_QueueList_Detials.objects.create(
#                 Billing_Type='Consultation',
#                 Registration_Id=RegisterInstance,
#                 Doctor_Ratecard_Id=Doctors_Instance,
#                 Status='Pending',
#                 created_by=instance.created_by,
#                 created_at=instance.created_at,
#                 updated_at=instance.updated_at
#             )
#             print('Sucessfully creating Casuality billing details')

#     except ObjectDoesNotExist as e:
#         print(f"Error: {e}")
#     except Doctor_Ratecard_Master.DoesNotExist as e:
#         print(f"Doctor Ratecard not found: {e}")








