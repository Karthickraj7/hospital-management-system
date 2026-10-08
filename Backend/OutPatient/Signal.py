from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from Masters.models import *
from Frontoffice.models import *
from .models import *
from django.db.models import Q
from Workbench.models import *

@receiver(post_save, sender=ReferalDoctorDetails)
def create_appointment_with_refer_doctor(sender, instance, created, **kwargs):
    if created:
        try:
            patient = Patient_Detials.objects.get(PatientId=instance.PatientId)
            primary_doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=instance.PrimaryDoctorId)
            refer_doctor = Doctor_Personal_Form_Detials.objects.get(Doctor_ID=instance.ReferDoctorId)
            specialization = Doctor_ProfessForm_Detials.objects.get(Doctor_ID=refer_doctor.Doctor_ID).Specialization

            # Assuming there is a way to get the latest Patient_Casuality_Registration_Detials for the patient
            casuality_details = Patient_Appointment_Registration_Detials.objects.filter(PatientId=patient).last()
            
            Patient_Appointment_Registration_Detials.objects.create(
                PatientId=patient,
                VisitId=instance.VisitId,
                VisitPurpose=casuality_details.VisitPurpose,
                PrimaryDoctor=refer_doctor,
                Specialization=specialization,
                Complaint=instance.Remarks,
                PatientType=casuality_details.PatientType,
                PatientCategory=casuality_details.PatientCategory,
                InsuranceName=casuality_details.InsuranceName,
                InsuranceType=casuality_details.InsuranceType,
                ClientName=casuality_details.ClientName,
                ClientType=casuality_details.ClientType,
                ClientEmployeeId=casuality_details.ClientEmployeeId,
                ClientEmployeeDesignation=casuality_details.ClientEmployeeDesignation,
                ClientEmployeeRelation=casuality_details.ClientEmployeeRelation,
                EmployeeId=casuality_details.EmployeeId,
                EmployeeRelation=casuality_details.EmployeeRelation,
                DoctorId=casuality_details.DoctorId,
                DoctorRelation=casuality_details.DoctorRelation,
                DonationType=casuality_details.DonationType,
                IsMLC=casuality_details.IsMLC,
                Flagging=casuality_details.Flagging,
                IsReferral=casuality_details.IsReferral,
                Status='Registered',
                created_by=instance.created_by,
                Reason=casuality_details.Reason,
            )
        except ObjectDoesNotExist as e:
            print(f"Error: {e}")




@receiver(post_save, sender=Lab_Request_Details)
def create_lab_request_list_for_billing(sender, instance, created, **kwargs):
    if created:
        try:
            print('Lab request details started')
 
            patient = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=instance.OP_Register_Id.Registration_Id
            )
            bill_patient = OP_Billing_QueueList_Detials.objects.filter(
                Registration_Id__Registration_Id=instance.OP_Register_Id.Registration_Id
            )
 
            print('Patient:', patient)
            print('Billing Entries:', bill_patient)
 
            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = patient.pk).first()
            print('doccccc',doc_ins)
            Doctors_Instance = Doctor_Ratecard_Master.objects.get(
                Doctor_ID__Doctor_ID=doc_ins.PrimaryDoctor.Doctor_ID
            )
            print('fdvfssdvs',Doctors_Instance)
 
            # ✅ Move the "exists" check outside
            exists = OP_Billing_QueueList_Detials.objects.filter(
                Q(Registration_Id__Registration_Id=instance.OP_Register_Id.Registration_Id) &
                Q(Billing_Type='Lab') & Q(Status = 'Pending')
            ).exists()
 
            print('jhvjmj',exists)
            if not exists and not instance.Status == 'Paid' and not instance.Status == 'Due':
                print('juyvjhkvk')
                # 🔥 Create only if no entry exists and Bill_Status is Paid
                OP_Billing_QueueList_Detials.objects.create(
                    Billing_Type='Lab',
                    Registration_Id=instance.OP_Register_Id,
                    Doctor_Ratecard_Id=Doctors_Instance,
                    Status='Pending',
                    created_by=instance.created_by,
                    created_at=instance.created_at,
                    updated_at=instance.updated_at
                )
                print('Signal created for Lab billing details')
            else:
                print('Duplicate entry detected, skipping insertion')
 
        except Exception as e:
            print(f"Error: {str(e)}")
 
@receiver(post_save, sender=Radiology_Request_Details)
def create_radiology_request_list_for_billing(sender, instance, created, **kwargs):
    if created:
        try:
            print('Radiology request details started')
 
            patient = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=instance.OP_Register_Id.Registration_Id
            )
 
            bill_patient = OP_Billing_QueueList_Detials.objects.filter(
                Registration_Id__Registration_Id=instance.OP_Register_Id.Registration_Id
            )
 
            print('Patient:', patient)
            print('Billing Entries:', bill_patient)
 
            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = patient.pk).first()
            print('doccccc',doc_ins)
            Doctors_Instance = Doctor_Ratecard_Master.objects.get(
                Doctor_ID__Doctor_ID=doc_ins.PrimaryDoctor.Doctor_ID
            )
            print('fdvfssdvs',Doctors_Instance)
            # ✅ Move exists check outside
            exists = OP_Billing_QueueList_Detials.objects.filter(
                Q(Registration_Id__Registration_Id=instance.OP_Register_Id.Registration_Id) &
                Q(Billing_Type='Radiology') & Q(Status = 'Pending')
            ).exists()
 
            if not exists and not instance.Status == 'Paid' and not instance.Status == 'Due':
                OP_Billing_QueueList_Detials.objects.create(
                    Billing_Type='Radiology',
                    Registration_Id=instance.OP_Register_Id,
                    Doctor_Ratecard_Id=Doctors_Instance,
                    Status='Pending',
                    created_by=instance.created_by,
                    created_at=instance.created_at,
                    updated_at=instance.updated_at
                )
                print('Signal created for Radiology billing details')
            else:
                print('Duplicate entry detected, skipping insertion')
 
        except Exception as e:
            print(f"Error: {str(e)}")
 
 
 
@receiver(post_save, sender=DentalEMREvaluation)
def create_dental_request_list_for_billing(sender, instance, created, **kwargs):
    if created:
        try:
            print('dental request details started')
 
            patient = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=instance.Registration_Id.Registration_Id
            )
 
            bill_patient = OP_Billing_QueueList_Detials.objects.filter(
                Registration_Id__Registration_Id=instance.Registration_Id.Registration_Id
            )
 
            print('Patient:', patient)
            print('Billing Entries:', bill_patient)
 
            doc_ins = OP_Patient_Appointment_With_Multiple_Doctor.objects.filter(Registration_Id = patient.pk).first()
            print('doccccc',doc_ins)
            Doctors_Instance = Doctor_Ratecard_Master.objects.get(
                Doctor_ID__Doctor_ID=doc_ins.PrimaryDoctor.Doctor_ID
            )
            print('fdvfssdvs',Doctors_Instance)
            # ✅ Move exists check outside
            exists = OP_Billing_QueueList_Detials.objects.filter(
                Q(Registration_Id__Registration_Id=instance.Registration_Id.Registration_Id) &
                Q(Billing_Type='Dental') & Q(Status = 'Pending')
            ).exists()
 
            if not exists and not instance.status == 'Paid' and not instance.status == 'Due':
                OP_Billing_QueueList_Detials.objects.create(
                    Billing_Type='Dental',
                    Registration_Id=instance.Registration_Id,
                    Doctor_Ratecard_Id=Doctors_Instance,
                    Status='Pending',
                    created_by=instance.created_by,
                    created_at=instance.created_at,
                    updated_at=instance.updated_at
                )
                print('Signal created for Dental billing details')
            else:
                print('Duplicate entry detected, skipping insertion')
 
        except Exception as e:
            print(f"Error: {str(e)}")
 
 
 