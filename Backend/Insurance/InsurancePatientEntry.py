from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from Insurance.models import *
from django.db.models import Q
import json


@csrf_exempt
@require_http_methods(["GET"])
def Get_StatusCount(request):
    try:
        PENDING_count = Insuranse_Patient_Entery_Details.objects.filter(
            Papersstatus="PENDING"
        ).count()
        DRAFT_count = Insuranse_Patient_Entery_Details.objects.filter(
            Papersstatus="DRAFT"
        ).count()
        SUBMITTED_count = Insuranse_Patient_Entery_Details.objects.filter(
            Papersstatus="SUBMITTED"
        ).count()
        APPROVED_count = Insuranse_Patient_Entery_Details.objects.filter(
            Papersstatus="APPROVED"
        ).count()
        REJECTED_count = Insuranse_Patient_Entery_Details.objects.filter(
            Papersstatus="REJECTED"
        ).count()
        DISCHARGED = Insuranse_Patient_Entery_Details.objects.filter(
            Papersstatus="DISCHARGED"
        ).count()

        Count_data = {
            "PENDINGCount": PENDING_count,
            "DraftCount": DRAFT_count,
            "SubmittedCount": SUBMITTED_count,
            "ApprovedCount": APPROVED_count,
            "RejectedCount": REJECTED_count,
            "DischargeCount": DISCHARGED,
        }

        return JsonResponse(Count_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


# @csrf_exempt
# @require_http_methods(['GET'])
# def Get_StatusCount(request):
#     try:

#         All_count = Insuranse_Patient_Entery_Details.objects.all().count()
#         Pending_count = Insuranse_Patient_Entery_Details.objects.filter(Papersstatus='PENDING').count()
#         APPROVED_count = Insuranse_Patient_Entery_Details.objects.filter(Papersstatus='APPROVED').count()
#         REJECTED_count = Insuranse_Patient_Entery_Details.objects.filter(Papersstatus='REJECTED').count()
#         COMPLETED_count = Insuranse_Patient_Entery_Details.objects.filter(Papersstatus='COMPLETED').count()

#         Count_data={

#             'Allcount':All_count,
#             'Pendingcount':Pending_count,
#             'ApprovedCount':APPROVED_count,
#             'RejectedCount':REJECTED_count,
#             'CompletedCount':COMPLETED_count
#             }

#         return JsonResponse (Count_data,safe=False)

#     except Exception as e:
#         print(f'An error occurred: {str(e)}')
#         return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


# @csrf_exempt
# @require_http_methods(['GET'])
# def Signal_PatientEntry_Get_Details(request):
#     try:
#         Patient_arr = []

#         Status=request.GET.get('Filterby')
#         ServiceType=request.GET.get('ServiceType')
#         PatientId=request.GET.get('PatientId')
#         PatientName=request.GET.get('PatientName')

#         query = Q()

#         if Status:
#             query &= Q(Papersstatus=Status)
#         if ServiceType:
#             query &= Q(Patient_ServiesType=ServiceType)

#         insurance_entries = Insuranse_Patient_Entery_Details.objects.filter(query)

#         for entry in insurance_entries:
#             related_instance = entry.IP_Registration
#             Patient_inst = getattr(related_instance, 'PatientId', None)

#             if Patient_inst is not None:
#                 Patient_dec = {
#                     'id': entry.pk,
#                     'PatientServiesType': getattr(entry, 'Patient_ServiesType',''),
#                     'RegistrationId': related_instance.pk,
#                     'PatientId': getattr(Patient_inst, 'PatientId',''),
#                     'PatientName': f"{getattr(Patient_inst, 'FirstName', '')} {getattr(Patient_inst, 'MiddleName', '')} {getattr(Patient_inst, 'SurName', '')}",
#                     'PhoneNo': getattr(Patient_inst, 'PhoneNo',''),
#                     'Gender': getattr(Patient_inst, 'Gender',''),
#                     'DOB': getattr(Patient_inst, 'DOB',''),
#                     'Age': getattr(Patient_inst, 'Age',''),
#                     'Email': getattr(Patient_inst, 'Email',''),
#                     'Address': f"{getattr(Patient_inst, 'DoorNo', '')},{getattr(Patient_inst, 'Street', '')},{getattr(Patient_inst, 'Area', '')},{getattr(Patient_inst, 'City', '')},{getattr(Patient_inst, 'State', '')},{getattr(Patient_inst, 'Country', '')}.",
#                     'Pincode': getattr(Patient_inst, 'Pincode',''),
#                     'VisitPurpose': getattr(related_instance, 'VisitPurpose',''),
#                     'Specialization': getattr(getattr(related_instance, 'Specialization',''), 'Speciality_Name',''),  # Assuming 'name' is a field in Speciality_Detials
#                     'PrimaryDoctor': getattr(getattr(related_instance, 'PrimaryDoctor',''), 'ShortName',''),  # Assuming 'name' is a field in Doctor_Personal_Form_Detials
#                     'Complaint': getattr(related_instance, 'Complaint',''),
#                     'PatientType': getattr(related_instance, 'PatientType',''),
#                     'PatientCategory': getattr(related_instance, 'PatientCategory',''),
#                     'InsuranceId': getattr(getattr(related_instance, 'InsuranceName',''), 'pk',''),
#                     'InsuranceName': getattr(getattr(related_instance, 'InsuranceName',''), 'Insurance_Name',''),
#                     'InsuranceType': getattr(related_instance, 'InsuranceType',''),
#                     'InsuranceContactPerson': getattr(getattr(related_instance, 'InsuranceName',''), 'ContactPerson',''),
#                     'InsuranceMailId': getattr(getattr(related_instance, 'InsuranceName',''), 'MailId',''),
#                     'InsurancePhoneNumber': getattr(getattr(related_instance, 'InsuranceName',''), 'PhoneNumber',''),
#                     'Papersstatus':entry.Papersstatus,
#                     'CreatedAt':entry.Created_at.strftime('%d-%m-%Y')
#                 }
#                 # print('Patient Data:', Patient_dec)
#                 Patient_arr.append(Patient_dec)

#         if PatientId:
#             Patient_arr = [p for p in Patient_arr if PatientId in p.get('PatientId', '')]
#         if PatientName:
#             Patient_arr = [p for p in Patient_arr if PatientName.lower() in p.get('PatientName', '').lower()]


#         return JsonResponse(Patient_arr, safe=False)

#     except Exception as e:
#         print(f'An error occurred: {str(e)}')
#         return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Patient_Insurance_Register(request):
    try:
        data = json.loads(request.body)

        print("ppppp", data)

        EditId = data.get("EditId")

        CreditBill = data.get("CreditBill")
        PayerName = data.get("PayerName")
        AvailedRateCard = data.get("AvailedRateCard")
        EligibleRoomType = data.get("EligibleRoomType")
        IsDefaultPayer = data.get("IsDefaultPayer")

        AllAreMedicalItems = data.get("AllAreMedicalItems")

        PolicyNo = data.get("PolicyNo")
        PolicyStartDate = data.get("PolicyStartDate")
        PolicyEndDate = data.get("PolicyEndDate")

        PreAuthType = data.get("PreAuthType")
        PreAuthTypeValue = data.get("PreAuthTypeValue")
        PreAuthAmount = data.get("PreAuthAmount")
        PreAuthApprovalNumber = data.get("PreAuthApprovalNumber")
        PreAuthCreditLimit = data.get("PreAuthCreditLimit")
        PreAuthCreditLimitValue = data.get("PreAuthCreditLimitValue")

        CoPaymentType = data.get("CoPaymentType")
        CoPaymentTypeValue = data.get("CoPaymentTypeValue")
        CoPaymentLogic = data.get("CoPaymentLogic")
        CoPaymentToBeDeductedFrom = data.get("CoPaymentToBeDeductedFrom")

        # Insuranse_Update_data=Insuranse_Patient_Entery_Details.objects.filter(pk=EditId).first()
        # Insuranse_Update_data.CreditBill =  CreditBill
        # Insuranse_Update_data.PayerName =  PayerName
        # Insuranse_Update_data.AvailedRateCard =  AvailedRateCard
        # Insuranse_Update_data.EligibleRoomType =  EligibleRoomType
        # Insuranse_Update_data.IsDefaultPayer =  IsDefaultPayer

        # Insuranse_Update_data.PolicyNo = PolicyNo
        # Insuranse_Update_data.PolicyStartDate = PolicyStartDate
        # Insuranse_Update_data.PolicyEndDate = PolicyEndDate

        # Insuranse_Update_data.PreAuthType = PreAuthType
        # Insuranse_Update_data.PreAuthTypeValue = PreAuthTypeValue
        # Insuranse_Update_data.PreAuthAmount = PreAuthAmount
        # Insuranse_Update_data.PreAuthApprovalNumber = PreAuthApprovalNumber
        # Insuranse_Update_data.PreAuthCreditLimit = PreAuthCreditLimit
        # Insuranse_Update_data.PreAuthCreditLimitValue = PreAuthCreditLimitValue

        # Insuranse_Update_data.CoPaymentType = CoPaymentType
        # Insuranse_Update_data.CoPaymentTypeValue = CoPaymentTypeValue
        # Insuranse_Update_data.CoPaymentLogic = CoPaymentLogic
        # Insuranse_Update_data.CoPaymentToBeDeductedFrom = CoPaymentToBeDeductedFrom

        # Insuranse_Update_data.AllAreMedicalItems = AllAreMedicalItems

        # Insuranse_Update_data.save()

        return JsonResponse({"success": "Insurance details saved successfully"})

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST", "GET"])
def Update_StatusFor_Insurance_Patient_Detailes(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("+++++++++", data)  # Debug log to verify received data

            InstId = data.get("InstId")
            Status = data.get("Status")
            RejectionReason = data.get(
                "RejectionReason", ""
            )  # Get RejectionReason, default to empty string if not provided

            Insuranse_Patient_Entery_Ins = Insuranse_Patient_Entery_Details.objects.get(
                pk=InstId
            )

            Insuranse_Patient_Entery_Ins.Papersstatus = Status
            if (
                Status == "REJECTED" and RejectionReason
            ):  # Only update RejectionReason if status is REJECTED and reason is provided
                Insuranse_Patient_Entery_Ins.RejectedReason = RejectionReason

            Insuranse_Patient_Entery_Ins.save()

            # Return the updated record including RejectionReason
            updated_record = Insuranse_Patient_Entery_Details.objects.get(pk=InstId)
            return JsonResponse(
                {
                    "success": "Update Status successfully",
                    "data": {
                        "id": updated_record.pk,
                        "Papersstatus": updated_record.Papersstatus,
                        "RejectionReason": updated_record.RejectedReason,
                    },
                }
            )

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"})


@csrf_exempt
@require_http_methods(["GET"])
def Signal_PatientEntry_Get_Details(request):
    try:
        Patient_arr = []

        Status = request.GET.get("Filterby")
        ServiceType = request.GET.get("ServiceType")
        PatientId = request.GET.get("PatientId")
        PatientName = request.GET.get("PatientName")

        query = Q()

        if Status:
            query &= Q(Papersstatus=Status)
        if ServiceType:
            query &= Q(Patient_ServiesType=ServiceType)

        insurance_entries = Insuranse_Patient_Entery_Details.objects.filter(query)

        for entry in insurance_entries:
            related_instance = entry.IP_Registration
            Patient_inst = getattr(related_instance, "PatientId", None)

            # Get the latest preauth transaction for this insurance entry
            preauth = (
                preauth_transaction_history.objects.filter(insurance_patient=entry)
                .order_by("-Created_at")
                .first()
            )
            preauth_amount = preauth.preauth_request_amt if preauth else None
            preauth_id = preauth.preauth_id if preauth else None
            Approveamount = preauth.approved_amt if preauth else None

            if Patient_inst is not None:
                Patient_dec = {
                    "id": entry.pk,
                    "PatientServiesType": getattr(entry, "Patient_ServiesType", ""),
                    "RegistrationId": related_instance.pk,
                    "PatientId": getattr(Patient_inst, "PatientId", ""),
                    "PatientName": f"{getattr(Patient_inst, 'FirstName', '')} {getattr(Patient_inst, 'MiddleName', '')} {getattr(Patient_inst, 'SurName', '')}",
                    "PhoneNo": getattr(Patient_inst, "PhoneNo", ""),
                    "Gender": getattr(Patient_inst, "Gender", ""),
                    "DOB": getattr(Patient_inst, "DOB", ""),
                    "Age": getattr(Patient_inst, "Age", ""),
                    "Address": f"{getattr(Patient_inst, 'DoorNo', '')},{getattr(Patient_inst, 'Street', '')},{getattr(Patient_inst, 'Area', '')},{getattr(Patient_inst, 'City', '')},{getattr(Patient_inst, 'State', '')},{getattr(Patient_inst, 'Country', '')}.",
                    "Pincode": getattr(Patient_inst, "Pincode", ""),
                    "PatientType": getattr(related_instance, "PatientType", ""),
                    "PatientCategory": getattr(related_instance, "PatientCategory", ""),
                    "InsuranceId": getattr(
                        getattr(related_instance, "InsuranceName", ""), "pk", ""
                    ),
                    "InsuranceName": getattr(
                        getattr(related_instance, "InsuranceName", ""),
                        "Insurance_Name",
                        "",
                    ),
                    "IsMLC": getattr(related_instance, "IsMLC", ""),
                    "Papersstatustype": entry.Papersstatustype,
                    "Papersstatus": entry.Papersstatus,
                    "CreatedAt": entry.Created_at.strftime("%d-%m-%Y"),
                    "PreAuthAmount": preauth_amount,  # Added preauth amount
                    "preauthid": preauth_id,
                    "Approveamount": Approveamount,
                }
                Patient_arr.append(Patient_dec)

                print("Patient_arr:", Patient_arr)

        if PatientId:
            Patient_arr = [
                p for p in Patient_arr if PatientId in p.get("PatientId", "")
            ]
        if PatientName:
            Patient_arr = [
                p
                for p in Patient_arr
                if PatientName.lower() in p.get("PatientName", "").lower()
            ]

        return JsonResponse(Patient_arr, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST", "OPTIONS", "GET"])
def Pre_Auth_Form_Personal_Information_Link(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            InsurancePatientId = data.get("InsurancePatientId")
            createAt = data.get("createAt")

            if not InsurancePatientId:
                return JsonResponse({"error": "Insurance Patient Id is required"})

            Insuranse_Patient_Ins = Insuranse_Patient_Entery_Details.objects.get(
                pk=InsurancePatientId
            )

            try:
                Personal_Information_Ins = (
                    Pre_Auth_Form_Personal_Information.objects.get(
                        Insuranse_Patient=Insuranse_Patient_Ins
                    )
                )
            except Pre_Auth_Form_Personal_Information.DoesNotExist:
                Personal_Information_Ins = None

            esicCoverage = data.get("esicCoverage")
            ESINumberstate = data.get("ESINumberstate")
            InsuranceCompany = data.get("InsuranceCompany")
            PolicyNumber = data.get("PolicyNumber")
            PolicyType = data.get("PolicyType")
            PayerTPAName = data.get("PayerTPAName")
            PayerTPAZone = data.get("PayerTPAZone")
            PayerTPAMemberID = data.get("PayerTPAMemberID")
            PolicyStartDate = data.get("PolicyStartDate")
            PolicyEndDate = data.get("PolicyEndDate")
            employed = data.get("employed")
            CorporateName = data.get("CorporateName")
            EmployeeID = data.get("EmployeeID")
            MedicalLegalCase = data.get("MedicalLegalCase")
            InformedBY = data.get("InformedBY")
            OfficerName = data.get("OfficerName")
            Policestation = data.get("Policestation")
            FIRNo = data.get("FIRNo")
            CodeStatus = data.get("CodeStatus")
            TypeOfAdmit = data.get("TypeOfAdmit")
            Admitting_diagnosis = data.get("Admitting_diagnosis")
            MainPageCompleted = data.get("MainPageCompleted")
            PageCompleted = data.get("PageCompleted")

            if Personal_Information_Ins:
                Personal_Information_Ins.Insuranse_Patient = Insuranse_Patient_Ins
                Personal_Information_Ins.ESI_Coverage = esicCoverage
                Personal_Information_Ins.Medico_Legal_Case = MedicalLegalCase
                Personal_Information_Ins.Employed = employed
                Personal_Information_Ins.Insurance_Company = InsuranceCompany
                Personal_Information_Ins.Policy_Number = PolicyNumber
                Personal_Information_Ins.Policy_Type = PolicyType
                Personal_Information_Ins.Payer_TPA_Name = PayerTPAName
                Personal_Information_Ins.Payer_TPA_Zone = PayerTPAZone
                Personal_Information_Ins.Payer_TPA_Member_ID = PayerTPAMemberID
                Personal_Information_Ins.PolicyStartDate = PolicyStartDate
                Personal_Information_Ins.PolicyEndDate = PolicyEndDate
                Personal_Information_Ins.Corporate_Name = CorporateName
                Personal_Information_Ins.Employee_ID = EmployeeID
                Personal_Information_Ins.ESI_Number = ESINumberstate
                Personal_Information_Ins.Informed_By = InformedBY
                Personal_Information_Ins.Officer_Name = OfficerName
                Personal_Information_Ins.Police_Station = Policestation
                Personal_Information_Ins.FIR_No = FIRNo
                Personal_Information_Ins.Code_Status = CodeStatus
                Personal_Information_Ins.Type_Of_Admit = TypeOfAdmit
                Personal_Information_Ins.Admitting_Diagnosis = Admitting_diagnosis
                Personal_Information_Ins.Updated_by = createAt
                Personal_Information_Ins.save()
            else:
                Pre_Auth_Form_Personal_Information.objects.create(
                    Insuranse_Patient=Insuranse_Patient_Ins,
                    ESI_Coverage=esicCoverage,
                    Medico_Legal_Case=MedicalLegalCase,
                    Employed=employed,
                    Insurance_Company=InsuranceCompany,
                    Policy_Number=PolicyNumber,
                    Policy_Type=PolicyType,
                    Payer_TPA_Name=PayerTPAName,
                    Payer_TPA_Zone=PayerTPAZone,
                    Payer_TPA_Member_ID=PayerTPAMemberID,
                    PolicyStartDate=PolicyStartDate,
                    PolicyEndDate=PolicyEndDate,
                    Corporate_Name=CorporateName,
                    Employee_ID=EmployeeID,
                    ESI_Number=ESINumberstate,
                    Informed_By=InformedBY,
                    Officer_Name=OfficerName,
                    Police_Station=Policestation,
                    FIR_No=FIRNo,
                    Code_Status=CodeStatus,
                    Type_Of_Admit=TypeOfAdmit,
                    Admitting_Diagnosis=Admitting_diagnosis,
                    Created_by=createAt,
                )

            Insuranse_Patient_Ins.MainPageCompleted = MainPageCompleted
            Insuranse_Patient_Ins.PageCompleted = PageCompleted
            Insuranse_Patient_Ins.save()

            return JsonResponse({"success": "Personal details saved successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"})
        except Insuranse_Patient_Entery_Details.DoesNotExist:
            return JsonResponse({"error": "Insurance Patient not found"})
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": f"Unexpected error: {str(e)}"})

    if request.method == "GET":
        try:
            obj = {}

            InsurancePatientId = request.GET.get("InsurancePatientId")

            print("InsurancePatientDetailes", InsurancePatientId)

            if InsurancePatientId:
                Personal_Information_Ins = (
                    Pre_Auth_Form_Personal_Information.objects.filter(
                        Insuranse_Patient=InsurancePatientId
                    ).first()
                )

            if Personal_Information_Ins:

                send_Obj = {
                    "esicCoverage": Personal_Information_Ins.ESI_Coverage,
                    "MedicalLegalCase": Personal_Information_Ins.Medico_Legal_Case,
                    "employed": Personal_Information_Ins.Employed,
                    "InsuranceCompany": Personal_Information_Ins.Insurance_Company,
                    "PolicyNumber": Personal_Information_Ins.Policy_Number,
                    "PolicyType": Personal_Information_Ins.Policy_Type,
                    "PayerTPAName": Personal_Information_Ins.Payer_TPA_Name,
                    "PayerTPAZone": Personal_Information_Ins.Payer_TPA_Zone,
                    "PayerTPAMemberID": Personal_Information_Ins.Payer_TPA_Member_ID,
                    "PolicyStartDate": Personal_Information_Ins.PolicyStartDate,
                    "PolicyEndDate": Personal_Information_Ins.PolicyEndDate,
                    "CorporateName": Personal_Information_Ins.Corporate_Name,
                    "EmployeeID": Personal_Information_Ins.Employee_ID,
                    "InformedBY": Personal_Information_Ins.Informed_By,
                    "OfficerName": Personal_Information_Ins.Officer_Name,
                    "Policestation": Personal_Information_Ins.Police_Station,
                    "FIRNo": Personal_Information_Ins.FIR_No,
                    "CodeStatus": Personal_Information_Ins.Code_Status,
                    "TypeOfAdmit": Personal_Information_Ins.Type_Of_Admit,
                    "Admitting_diagnosis": Personal_Information_Ins.Admitting_Diagnosis,
                }
                return JsonResponse(send_Obj, safe=False)
            else:
                return JsonResponse(obj, safe=False)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({"error": f"An error occurred: {str(e)}"})


@require_http_methods(["GET"])
def Insurance_Patient_Details(request):
    try:
        PatientId = request.GET.get("PatientId")
        RegistrationId = request.GET.get("RegistrationId")
        PatientServiesType = request.GET.get("PatientServiesType")

        print("PatientId:", PatientId)
        print("RegistrationId:", RegistrationId)
        print("PatientServiesType:", PatientServiesType)

        if not RegistrationId:
            return JsonResponse({"warn": "Registration id required"})
        if not PatientId:
            return JsonResponse({"warn": "PatientId required"})
        if not PatientServiesType:
            return JsonResponse({"warn": "Service Type required"})

        admission_instance = None
        admissiondate = None
        patient_data = []

        # Initialize patient data holders to avoid NameErrors
        patient_ins_op = patient_ins_ip = patient_ins_casuality = []

        if PatientServiesType == "OP":
            patient_ins_op = Patient_Appointment_Registration_Detials.objects.filter(
                pk=RegistrationId, PatientId=PatientId
            )
        elif PatientServiesType == "IP":
            patient_ins_ip = Patient_IP_Registration_Detials.objects.filter(
                Registration_Id=RegistrationId, PatientId=PatientId
            )
            admission_instance = Patient_Admission_Detials.objects.filter(
                IP_Registration_Id__pk=RegistrationId
            ).first()
            if admission_instance:
                admissiondate = admission_instance.created_at.strftime("%d/%m/%Y")
        elif PatientServiesType == "Casuality":
            patient_ins_casuality = (
                Patient_Emergency_Registration_Detials.objects.filter(
                    Registration_Id=RegistrationId, PatientId=PatientId
                )
            )
            admission_instance = Patient_Admission_Detials.objects.filter(
                Emergency_Registration_Id__pk=RegistrationId
            ).first()
            if admission_instance:
                admissiondate = admission_instance.created_at.strftime("%d/%m/%Y")
        else:
            return JsonResponse({"warn": "Invalid Patient Services Type"})

        # Process IP patients
        if patient_ins_ip and patient_ins_ip.exists():
            for idx, register in enumerate(patient_ins_ip, start=1):
                patient_dict = {
                    "id": idx,
                    "PhoneNo": register.PatientId.PhoneNo,
                    "Gender": register.PatientId.Gender,
                    "Age": register.PatientId.Age,
                    "DoctorId": (
                        register.PrimaryDoctor.Doctor_ID
                        if register.PrimaryDoctor
                        else None
                    ),
                    "DoctorName": (
                        f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
                        f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
                        f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
                    ),
                    "PurposeofAdmission": (
                        admission_instance.AdmissionPurpose
                        if admission_instance
                        else ""
                    ),
                    "DateofAdmission": admissiondate if admissiondate else "",
                    "isMlc": "Yes" if register.IsMLC else "No",
                }
                patient_data.append(patient_dict)
            return JsonResponse(patient_data, safe=False)

        # Process OP patients
        elif patient_ins_op and patient_ins_op.exists():
            for idx, register in enumerate(patient_ins_op, start=1):
                patient_dict = {
                    "id": idx,
                    "PhoneNo": register.PatientId.PhoneNo,
                    "Gender": register.PatientId.Gender,
                    "Age": register.PatientId.Age,
                    "DoctorId": (
                        register.PrimaryDoctor.Doctor_ID
                        if register.PrimaryDoctor
                        else None
                    ),
                    "DoctorName": (
                        f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
                        f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
                        f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
                    ),
                    "VisitId": register.VisitId,
                    "VisitPurpose": register.VisitPurpose,
                    "Date": register.created_at.strftime("%d/%m/%Y"),
                }
                patient_data.append(patient_dict)
            return JsonResponse(patient_data, safe=False)

        # Process Casualty patients
        elif patient_ins_casuality and patient_ins_casuality.exists():
            for idx, register in enumerate(patient_ins_casuality, start=1):
                patient_dict = {
                    "id": idx,
                    "PhoneNo": register.PatientId.PhoneNo,
                    "Gender": register.PatientId.Gender,
                    "Age": register.PatientId.Age,
                    "DoctorId": (
                        register.PrimaryDoctor.Doctor_ID
                        if register.PrimaryDoctor
                        else None
                    ),
                    "DoctorName": (
                        f"{register.PrimaryDoctor.Tittle.Title_Name if register.PrimaryDoctor and register.PrimaryDoctor.Tittle else None}."
                        f"{register.PrimaryDoctor.First_Name if register.PrimaryDoctor else None} "
                        f"{register.PrimaryDoctor.Last_Name if register.PrimaryDoctor else None}"
                    ),
                    "PurposeofAdmission": (
                        admission_instance.AdmissionPurpose
                        if admission_instance
                        else ""
                    ),
                    "DateofAdmission": admissiondate if admissiondate else "",
                    "isMlc": "Yes" if register.IsMLC else "No",
                }
                patient_data.append(patient_dict)
            return JsonResponse(patient_data, safe=False)

        else:
            return JsonResponse({"warn": "No matching records found"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def Insurance_Details_get(request):
    try:
        InsuranceId = request.GET.get("InsuranceId")

        if not InsuranceId:
            return JsonResponse({"warn": "Insurance id not found"})

        # Fetch the single insurance detail by ID
        try:
            insurance_details = Insurance_Master_Detials.objects.get(
                Insurance_Id=InsuranceId
            )
        except Insurance_Master_Detials.DoesNotExist:
            return JsonResponse({"warn": "Insurance details not found"})

        # Extract relevant fields into a dictionary
        insurance_data = [
            {
                "InsuranceId": insurance_details.Insurance_Id,
                "Insurance_Name": insurance_details.Insurance_Name,
                "Payer_Zone": insurance_details.Payer_Zone or "",
                "PayerMember_Id": insurance_details.PayerMember_Id or "",
                "ContactPerson": insurance_details.ContactPerson or "",
                "MailId": insurance_details.MailId or "",
                "PhoneNumber": insurance_details.PhoneNumber or "",
            }
        ]

        return JsonResponse(insurance_data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)})


@csrf_exempt
@require_http_methods(["POST"])
def SubmitInusranceDetails(request):
    try:
        # Parse JSON body
        data = json.loads(request.body.decode("utf-8"))

        preauth_amt = data.get("PreAuthAmount")
        if not preauth_amt:
            return JsonResponse({"warn": "please enter the amount"})

        # Extract values from frontend payload
        mrn = data.get("MRN")
        contact_number = data.get("ContactNumber")
        location = data.get("Location")
        created_by = data.get("createAt")
        billing_info = data.get("billingInfo")
        rows6 = data.get("rows6")
        main_completed = data.get("MainPageCompleted")
        page_completed = data.get("PageCompleted")

        # Try to get the patient (IP or OP)
        try:
            pat = Patient_IP_Registration_Detials.objects.get(Registration_Id=mrn)
        except Patient_IP_Registration_Detials.DoesNotExist:
            pat = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=mrn
            )

        # Get content type for the patient
        content_type = ContentType.objects.get_for_model(pat)

        # Filter insurance entries linked to this patient
        entry_qs = Insuranse_Patient_Entery_Details.objects.filter(
            content_type=content_type, object_id=pat.Registration_Id
        )

        # If entry exists, update it; otherwise create a new one
        if entry_qs.exists():
            entry_qs.update(
                Papersstatus="Submitted",
            )
            entry = entry_qs.first()

        if preauth_amt:
            preauth_transaction_history.objects.create(
                insurance_patient=entry,
                preauth_request_amt=preauth_amt,
                requested_date=str(datetime.now().strftime("%d/%m/%Y")),
                created_by=created_by,
            )

        else:
            return JsonResponse({"err": "doesn,t exist"})

        return JsonResponse(
            {
                "status": "success",
                "message": "Insurance details submitted successfully",
                "id": entry.id,
            },
            status=201,
        )

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def ApproveAmountUpdation(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        mrn = data.get("MRN")
        contact_number = data.get("ContactNumber")
        location = data.get("Location")
        created_by = data.get("createAt")
        billing_info = data.get("billingInfo")
        rows6 = data.get("rows6")
        main_completed = data.get("MainPageCompleted")
        page_completed = data.get("PageCompleted")
        preauthid = data.get("preauthid")
        Approveamount = data.get("Approveamount")

        try:
            pat = Patient_IP_Registration_Detials.objects.get(Registration_Id=mrn)
        except Patient_IP_Registration_Detials.DoesNotExist:
            pat = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=mrn
            )

        # Get content type for the patient
        content_type = ContentType.objects.get_for_model(pat)

        # Filter insurance entries linked to this patient
        entry_qs = Insuranse_Patient_Entery_Details.objects.filter(
            content_type=content_type, object_id=pat.Registration_Id
        ).first()
        entry_qs.Papersstatus = "APPROVED"
        entry_qs.save()

        pre_ins = preauth_transaction_history.objects.filter(
            preauth_id=preauthid, insurance_patient=entry_qs
        ).last()
        if Approveamount:
            pre_ins.isapproved = True
            pre_ins.approved_amt = Approveamount
            pre_ins.approved_by = created_by
            pre_ins.approved_date = str(datetime.now().strftime("%d/%m/%Y"))
            pre_ins.save()

            return JsonResponse({"success": "update successfully"})

        else:
            return JsonResponse({"err": str(e)}, status=400)

    except Exception as e:
        return JsonResponse({"err": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def DischargeApproval(request):

    try:
        data = json.loads(request.body.decode("utf-8"))
        mrn = data.get("MRN")

        try:
            pat = Patient_IP_Registration_Detials.objects.get(Registration_Id=mrn)
        except Patient_IP_Registration_Detials.DoesNotExist:
            pat = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=mrn
            )

        regis_ins = Insuranse_Patient_Entery_Details.objects.filter(
            object_id=pat.Registration_Id
        ).first()
        regis_ins.Papersstatus = "DISCHARGED"
        regis_ins.save()

        return JsonResponse(
            {"status": "success", "message": "Discharge approved successfully"},
            status=200,
        )

    except Exception as e:
        return JsonResponse({"err": str(e)}, status=500)


from .models import preauth_transaction_history


@csrf_exempt
@require_http_methods(["GET"])
def GetPreauthHistory(request):
    try:
        registration_id = request.GET.get("registrationId")
        if not registration_id:
            return JsonResponse({"error": "Missing registrationId"}, status=400)

        pat = None
        try:
            pat = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=registration_id
            )
        except Patient_IP_Registration_Detials.DoesNotExist:
            pat = Patient_Appointment_Registration_Detials.objects.get(
                Registration_Id=registration_id
            )

        regis_ins = Insuranse_Patient_Entery_Details.objects.filter(
            object_id=pat.Registration_Id
        ).first()

        history_qs = preauth_transaction_history.objects.filter(
            insurance_patient_id=regis_ins
        ).values(
            "preauth_id",
            "preauth_request_amt",
            "requested_date",
            "approved_amt",
            "approved_date",
            "created_by",
        )

        history_list = list(history_qs)

        return JsonResponse(history_list, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def UpdatePreauthHistory(request):
    try:
        data = json.loads(request.body.decode("utf-8"))

        preauth_id = data.get("preauth_id")
        preauth_request_amt = data.get("preauth_request_amt")
        approved_amt = data.get("approved_amt")
        created_by = data.get("updated_by", "system")

        if not preauth_id:
            return JsonResponse({"error": "preauth_id is required"}, status=400)

        try:
            entry = preauth_transaction_history.objects.get(preauth_id=preauth_id)
        except preauth_transaction_history.DoesNotExist:
            return JsonResponse({"error": "Preauth record not found"}, status=404)

        if preauth_request_amt is not None:
            entry.preauth_request_amt = preauth_request_amt
            entry.requested_date = datetime.now().strftime("%d/%m/%Y")

        if approved_amt is not None:
            entry.approved_amt = approved_amt
            entry.approved_date = datetime.now().strftime("%d/%m/%Y")

        entry.created_by = created_by
        entry.save()

        return JsonResponse(
            {
                "status": "success",
                "message": "Preauth history updated successfully",
                "preauth_id": entry.preauth_id,
                "preauth_request_amt": str(entry.preauth_request_amt),
                "approved_amt": str(entry.approved_amt),
                "requested_date": entry.requested_date,
                "approved_date": entry.approved_date,
                "created_by": entry.created_by,
            },
            status=200,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime
from .models import preauth_transaction_history, Insuranse_Patient_Entery_Details


@csrf_exempt
@require_http_methods(["POST"])
def AddPreauthHistory(request):
    try:
        data = json.loads(request.body.decode("utf-8"))

        registration_id = data.get("RegistrationId")  # comes from URL
        preauth_request_amt = data.get("preauth_request_amt")
        approved_amt = data.get("approved_amt")
        if approved_amt == "":
            approved_amt = 0.0
        created_by = data.get("created_by", "system")
        if not registration_id:
            return JsonResponse({"err": "reg id is required"})
        # ✅ Get patient (IP or OP)
        try:
            pat = Patient_IP_Registration_Detials.objects.get(
                Registration_Id=registration_id
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

        # ✅ Find insurance entry for that patient
        regis_ins = Insuranse_Patient_Entery_Details.objects.filter(
            object_id=pat.Registration_Id
        ).first()

        if not regis_ins:
            return JsonResponse(
                {"error": "Insurance entry not found for this patient"}, status=404
            )

        # ✅ Create new record
        new_entry = preauth_transaction_history.objects.create(
            insurance_patient=regis_ins,
            preauth_request_amt=preauth_request_amt,
            requested_date=datetime.now().strftime("%d/%m/%Y"),
            approved_amt=approved_amt,
            approved_date=datetime.now().strftime("%d/%m/%Y") if approved_amt else None,
            created_by=created_by,
            # updated_by=created_by,
        )

        return JsonResponse(
            {
                "status": "success",
                "message": "Preauth record added successfully",
                "data": {
                    "preauth_id": new_entry.preauth_id,
                    "preauth_request_amt": str(new_entry.preauth_request_amt),
                    "requested_date": new_entry.requested_date,
                    "approved_amt": (
                        str(new_entry.approved_amt) if new_entry.approved_amt else None
                    ),
                    "approved_date": new_entry.approved_date,
                    "created_by": new_entry.created_by,
                },
            },
            status=201,
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)






