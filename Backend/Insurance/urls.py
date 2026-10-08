from django.urls import path
from .ClientPatientEntry import *
from .InsurancePatientEntry import *
from .InsuranceMedicalHistory import *

urlpatterns = [
    path(
        "Signal_PatientEntry_Get_Details",
        Signal_PatientEntry_Get_Details,
        name="Signal_PatientEntry_Get_Details",
    ),
    path(
        "Patient_Insurance_Register",
        Patient_Insurance_Register,
        name="Patient_Insurance_Register",
    ),
    path("Get_StatusCount", Get_StatusCount, name="Get_StatusCount"),
    path(
        "Pre_Auth_Form_Personal_Information_Link",
        Pre_Auth_Form_Personal_Information_Link,
        name="Pre_Auth_Form_Personal_Information_Link",
    ),
    path(
        "Update_StatusFor_Insurance_Patient_Detailes",
        Update_StatusFor_Insurance_Patient_Detailes,
        name="Update_StatusFor_Insurance_Patient_Detailes",
    ),
    path(
        "Signal_ClientPatientEntry_Get_Details",
        Signal_ClientPatientEntry_Get_Details,
        name="Signal_ClientPatientEntry_Get_Details",
    ),
    path(
        "Get_StatusCount_Client", Get_StatusCount_Client, name="Get_StatusCount_Client"
    ),
    path(
        "Post_Client_Patient_Detailes",
        Post_Client_Patient_Detailes,
        name="Post_Client_Patient_Detailes",
    ),
    path(
        "Update_StatusFor_Client_Patient_Detailes",
        Update_StatusFor_Client_Patient_Detailes,
        name="Update_StatusFor_Client_Patient_Detailes",
    ),
    path(
        "Insurance_Patient_Details",
        Insurance_Patient_Details,
        name="Insurance_Patient_Details",
    ),
    path("Insurance_Details_get", Insurance_Details_get, name="Insurance_Details_get"),
    path("Client_Details_get", Client_Details_get, name="Client_Details_get"),
    path(
        "Insurance_Medical_data", Insurance_Medical_data, name="Insurance_Medical_data"
    ),
    path(
        "Post_Pre_Auth_Form_diagnosis",
        Post_Pre_Auth_Form_diagnosis,
        name="Post_Pre_Auth_Form_diagnosis",
    ),
    path(
        "Auth_Form_Examination_Finding",
        Auth_Form_Examination_Finding,
        name="Auth_Form_Examination_Finding",
    ),
    path(
        "Pre_Auth_Treatment_info",
        Pre_Auth_Treatment_info,
        name="Pre_Auth_Treatment_info",
    ),
    path("FetchProcedureDetails", FetchProcedureDetails, name="FetchProcedureDetails"),
    path(
        "Pre_Auth_Form_billing_info_details",
        Pre_Auth_Form_billing_info_details,
        name="Pre_Auth_Form_billing_info_details",
    ),
    path("get_Admission_Purpose", get_Admission_Purpose, name="get_Admission_Purpose"),
    path(
        "Pre_Auth_Form_Submit_Documents_data",
        Pre_Auth_Form_Submit_Documents_data,
        name="Pre_Auth_Form_Submit_Documents_data",
    ),
    path(
        "SubmitInusranceDetails",
        SubmitInusranceDetails,
        name="Pre_Auth_Form_SubmitInusranceDetailsSubmit_Documents_data",
    ),
    path("ApproveAmountUpdation", ApproveAmountUpdation, name="ApproveAmountUpdation"),
    path("DischargeApproval", DischargeApproval, name="DischargeApproval"),
    path("GetPreauthHistory", GetPreauthHistory, name="GetPreauthHistory"),
    path("UpdatePreauthHistory", UpdatePreauthHistory, name="UpdatePreauthHistory"),
    path("AddPreauthHistory", AddPreauthHistory, name="AddPreauthHistory"),
]
