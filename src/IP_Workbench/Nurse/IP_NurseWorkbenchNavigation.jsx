// import React, { useState, useEffect, lazy, Suspense } from "react";
// import "../../DoctorWorkBench/Navigation.css";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import bgImg2 from "../../Assets/bgImg2.jpg";
// import "../../DoctorWorkBench/TreatmentComponent.css";
// import axios from "axios";
// import Ip_ot_request from "../../OtManagement/Ip_ot_request.jsx";


// const IP_NurseVitals = lazy(() => import("./IP_NurseVitals.jsx"));
// const IPNURSEEMR = lazy(() => import("./IPNURSEEMR.jsx"));
// const IP_NurseSurgicalHistory = lazy(() =>
//   import("./IP_NurseSurgicalHistory.jsx")
// );
// const IP_NurseAssesment = lazy(() => import("./IP_NurseAssesment.jsx"));
// const IP_NurseInputOutputChart = lazy(() =>
//   import("./IP_NurseInputOutputChart.jsx")
// );
// const IP_NurseProgressNotes = lazy(() => import("./IP_NurseProgressNotes.jsx"));
// const AdmissionPurpose = lazy(() => import("./AdmissionPurpose.jsx"));
// const IP_NurseMlc = lazy(() => import("./IP_NurseMlc.jsx"));
// const IP_CaseSheet = lazy(() => import("./IP_CaseSheet.jsx"));
// const IP_Nurse_DAMA = lazy(() => import("./IP_Nurse_DAMA.jsx"));
// const IP_NursePreoperativeChecklist = lazy(() =>
//   import("./IP_NursePreoperativeChecklist.jsx")
// );
// const IP_NursePreOPIns = lazy(() => import("./IP_NursePreOPIns.jsx"));
// const IP_ConsentForms = lazy(() => import("./IP_ConsentForms.jsx"));
// const BedTransferRequest = lazy(() => import("./BedTransferRequest.jsx"));
// const BedtransferRecieve = lazy(() => import("./BedtransferRecieve.jsx"));
// const OtRequest = lazy(()=>import("../../OtManagement/Ip_ot_request.jsx"));
// const ServiceProcedureRequest = lazy(() =>
//   import("./ServiceProcedureRequest.jsx")
// );
// const IP_VentilatorSettings = lazy(() =>
//   import("../Nurse/IPM/IP_VentilatorSettings.jsx")
// );
// const IP_BloodLines = lazy(() => import("../Nurse/IPM/IP_BloodLines.jsx"));
// const IP_UrinaryCathetor = lazy(() =>
//   import("../Nurse/IPM/IP_UrinaryCathetor.jsx")
// );
// const IP_BloodTransfusedRecord = lazy(() =>
//   import("../Nurse/IPM/IP_BloodTransfusedRecord.jsx")
// );
// const IP_DrainageTubes = lazy(() =>
//   import("../Nurse/IPM/IP_DrainageTubes.jsx")
// );
// const IP_SurgicalSite = lazy(() => import("../Nurse/IPM/IP_SurgicalSite.jsx"));
// const IP_BedsoreManagement = lazy(() =>
//   import("../Nurse/IPM/IP_BedsoreManagement.jsx")
// );
// const IP_PatientCare = lazy(() => import("../Nurse/IPM/IP_PatientCare.jsx"));
// const IP_ReferAndInchargeDoctor = lazy(() =>
//   import("../Nurse/ServiceRequest/IP_ReferAndInchargeDoctor.jsx")
// );
// const DischargeRequest = lazy(() =>
//   import("../Nurse/Discharge/IP_DischargeRequest.jsx")
// );
// const IP_DischargeSummary = lazy(() =>
//   import("../Nurse/Discharge/IP_DischargeSummary.jsx")
// );
// const IP_DischargeStatus = lazy(() =>
//   import("../Nurse/Discharge/IP_DischargeStatus.jsx")
// );
// const DischargeChecklist = lazy(() =>
//   import("./Discharge/IP_DischargeChecklist.jsx")
// );
// const DisChargeClearance = lazy(() =>
//   import("./Discharge/IP_DischargeClearance.jsx")
// );
// const PhysicalDischarge = lazy(() =>
//   import("./Discharge/IP_Physical_Discharge.jsx")
// );
// const DischargeCancel = lazy(() =>
//   import("./Discharge/IP_DischargeCancel.jsx")
// );
// const LabTest = lazy(() => import("./Labtest.jsx"));
// const RadiologyTest = lazy(() => import("./RadiologyTest.jsx"));
// const Consultation = lazy(() => import("./Consultation.jsx"));
// const IP_NurseDrugRequest = lazy(() => import("./IP_NurseDrugRequest.jsx"));
// const PatientTimeEntry = lazy(() => import("./Casuality/PatientTimeEntry.jsx"));
// const EmgToIpconnect = lazy(() => import("./Casuality/EmgToIpconnect.jsx"));
// const BirthRegister = lazy(() => import("./BirthRegister.jsx"));
// const DeathRegister = lazy(() => import("./DeathRegister.jsx"));
// const IP_NurseAllergy = lazy(() => import("./IP_NurseAllergy.jsx"));
// const MlcRegisterForm = lazy(() => import("./MlcRegisterForm.jsx"));
// const IpDrugAdminister = lazy(() => import("./IpDrugAdminister.jsx"));
// const Therapy = lazy(() => import("./NurseTherapyRequest.jsx"));


// const IP_NurseWorkbenchNavigation = () => {
//   const IP_DoctorWorkbenchNavigation = useSelector(
//     (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
//   );
//   console.log(IP_DoctorWorkbenchNavigation, "IP_DoctorWorkbenchNavigation");
  
    
//   const [AdmissionDetails, setAdmissionDetails] = useState([]);
//   const [Assesment, setAssesment] = useState([]);
  
//   const [CurrentPreviousRoom, setCurrentPreviousRoom] = useState(null);

//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const [ActiveTab, setActiveTab] = useState("IP_NurseVitals");
//   const [isToggled, setIsToggled] = useState(false);

//   const toggle = () => setIsToggled(!isToggled);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     closeToggle();
//   };

//   const closeToggle = () => {
//     setIsToggled(false);
//   };

//   useEffect(() => {
//     console.log(IP_DoctorWorkbenchNavigation);
//     if (Object.keys(IP_DoctorWorkbenchNavigation).length === 0) {
//       navigate("/Home/IP_NurseQuelist");
//     }
//     // else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
//     //   navigate('/Home/CasualityNurseQuelist')
//     // }
//   }, [IP_DoctorWorkbenchNavigation]);

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [AllergyData, setAllergyData] = useState([]);
//   const [GetAdmissionDetails, setGetAdmissionDetails] = useState([]);

//   const [ShowAllergyData, setShowAllergyData] = useState(false);
//   const [ShowAdmissionPurposeData, setShowAdmissionPurposeData] = useState(false);

//   console.log(GetAdmissionDetails,'GetAdmissionDetails');
//   console.log(ShowAllergyData,'ShowAllergyData');
//   console.log(ShowAdmissionPurposeData,'ShowAdmissionPurposeData');
  
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   console.log(AllergyData, "gridData");

//   const [showTooltip, setShowTooltip] = useState(false);

//   const [openModal, setOpenModal] = useState(false);

//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

//   const handleEditClick = () => {
//     setOpenModal(true);
//   };

//   console.log('qq---RegistrationId',IP_DoctorWorkbenchNavigation?.RegistrationId,'qq---RegistrationId')


//   useEffect(() => {
//     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
//     const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;
  
//     console.log(RegistrationId, 'qq---RegistrationId');
  
//     if (RegistrationId) {
//       axios
//         .get(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, {
//           params: {
//             RegistrationId: RegistrationId,
//             DepartmentType: departmentType,
//           },
//         })
//         .then((res) => {
//           if (Array.isArray(res.data) && res.data.length > 0) {
//             setAllergyData(res.data);
//             setShowAllergyData(true);
//             console.log(res.data, 'Allergy data loaded');
//           } else {
//             // setAllergyData([]);          // Optional: clear previous data if empty
//             setShowAllergyData(false);   // Optional: hide if no data
//             console.log('No allergy data found');
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, IP_DoctorWorkbenchNavigation, ShowAllergyData]);
  

//     const handleAllergyDataUpdate = (updatedAllergyData) => {
//       setAllergyData(updatedAllergyData);
//       setShowAllergyData(true);
//     };


//   useEffect(() => {
//     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;

//     axios.get(`${UrlLink}Frontoffice/Patient_Admission_Purpose_Details`, {
//         params: { RegistrationId }
//     })
//     .then((res) => {
//       if (Array.isArray(res.data) && res.data.length > 0) {
//         setGetAdmissionDetails(res.data);
//         setShowAdmissionPurposeData(true)
//       } else {
//         setShowAdmissionPurposeData(false)

//       }
        
//     })
//     .catch((err) => {
//         console.error('Error fetching admission details:', err);
//     });
//   }, [UrlLink, IP_DoctorWorkbenchNavigation,ShowAdmissionPurposeData]);

//    const handleAdmissionPurposeData = (updatedAdmissionPurpose) => {
//       setGetAdmissionDetails(updatedAdmissionPurpose);
//       setShowAdmissionPurposeData(true);
//     };

//   useEffect(() => {
//     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
//     axios
//       .get(`${UrlLink}Frontoffice/get_AdmissionDetails`, {
//         params: {
//           RegistrationId: RegistrationId,
//         },
//       })
//       .then((res) => {
//         setAdmissionDetails(res.data);
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, IP_DoctorWorkbenchNavigation]);

//   useEffect(() => {
//     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
//     const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

//     if (RegistrationId) {
//       axios
//         .get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
//           params: {
//             RegistrationId: RegistrationId,
//             DepartmentType: departmentType,
//           },
//         })
//         .then((res) => {
//           const ress = res.data;
//           console.log(res);
//           setAssesment(ress);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, IP_DoctorWorkbenchNavigation]);

//   useEffect(() => {
//     axios
//       .get(
//         `${UrlLink}Frontoffice/get_ip_roomdetials_for_bedtransfer_details?RegistrationId=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
//       )
//       .then((res) => {
//         const ress = res.data;
//         setCurrentPreviousRoom(ress);
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink, IP_DoctorWorkbenchNavigation]);

//   // useEffect(() => {
//   //   if (Object.keys(IP_DoctorWorkbenchNavigation).length === 0 && Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
//   //     navigate('/Home/IP_NurseQuelist');
//   //   } else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
//   //     navigate('/Home/CasualityNurseQuelist');
//   //   }
//   // }, [IP_DoctorWorkbenchNavigation, Casuality_DoctorWorkbenchNavigation]);

//   return (
//     <>
//       <div className="Main_container_app">
//         <div className="new-patient-registration-form">
//           <div className="dctr_info_up_head">
//             <div className="RegisFormcon ">
//               <div className="dctr_info_up_head22">
//                 <img src={bgImg2} alt="Default Patient Photo" />

//                 <label>Profile</label>
//               </div>
//             </div>



//             <div className="RegisFormcon_1">


//               <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                 <label htmlFor="PatientID">
//                   Patient ID <span>:</span>
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientID">
//                   {IP_DoctorWorkbenchNavigation?.PatientId}
//                 </span>
//               </div>

//               <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                 <label htmlFor="PatientName">
//                   Patient Name <span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientName">
//                   {IP_DoctorWorkbenchNavigation?.PatientName || ""}
//                 </span>
//               </div>
//               <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                 <label htmlFor="AgeGender">
//                   Age / Gender <span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Age">
//                   {IP_DoctorWorkbenchNavigation?.Age} /{" "}
//                   {IP_DoctorWorkbenchNavigation?.Gender}
//                 </span>
//               </div>

             

//               {IP_DoctorWorkbenchNavigation?.BloodGroup && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="BloodGroup">
//                     Blood Group <span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="BloodGroup">
//                     {IP_DoctorWorkbenchNavigation?.BloodGroup}
//                   </span>
//                 </div>
//               )}
              

//               <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                 <label htmlFor="RegistrationIdBedNo">
//                   IP No / Bed No<span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="RegistrationIdBedNo">
//                   {IP_DoctorWorkbenchNavigation?.RegistrationId} /
//                   { IP_DoctorWorkbenchNavigation?.BedNo}
//                 </span>
//               </div>
              
//               {IP_DoctorWorkbenchNavigation?.DoctorName && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="DoctorName">
//                     Doctor Name <span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="DoctorName">
//                     {IP_DoctorWorkbenchNavigation?.DoctorName}
//                   </span>
//                 </div>
//               )}
              


//               {ShowAdmissionPurposeData && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="AdmissionPurpose">
//                     POA<span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmissionPurpose">
//                     {GetAdmissionDetails[GetAdmissionDetails.length - 1]?.AdmissionPurpose}
//                     {/* {GetAdmissionDetails?.AdmissionPurpose}ss */}
//                   </span>
//                 </div>
//               )}

//               {/* {AdmissionDetails.length > 0 && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="AdmissionPurpose">
//                     POA<span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmissionPurpose">
//                     {AdmissionDetails?.[0]?.AdmissionPurpose}
//                   </span>
//                 </div>
//               )} */}
              
//               {(IP_DoctorWorkbenchNavigation?.CurrDate || CurrentPreviousRoom?.ip_register_data?.[0]?.AdmitDate) && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="AdmitDate">
//                     DOA<span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmitDate">
//                     {CurrentPreviousRoom?.ip_register_data?.[0]?.AdmitDate || IP_DoctorWorkbenchNavigation?.CurrDate}
//                   </span>
//                 </div>
//               )}
              

//               {IP_DoctorWorkbenchNavigation?.PatientCategory && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666">
//                   <label htmlFor="PatientCategory">
//                     Patient Category <span>:</span>
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientCategory">
//                     {IP_DoctorWorkbenchNavigation?.PatientCategory}
//                   </span>
//                 </div>
//               )}
              

//               {["Insurance", "Client"].includes(IP_DoctorWorkbenchNavigation?.PatientCategory && IP_DoctorWorkbenchNavigation?.PatientCategoryName) && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666">
//                   <label htmlFor="InsuranceNameClientName">
//                     {IP_DoctorWorkbenchNavigation?.PatientCategory === "Insurance"
//                       ? "Insurance Name"
//                       : "Client Name"}
//                     <span>:</span>
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="InsuranceNameClientName">
//                     {IP_DoctorWorkbenchNavigation?.PatientCategoryName}
//                   </span>
//                 </div>
//               )}


//               {IP_DoctorWorkbenchNavigation?.IsMLC === 'Yes' && (

//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="IsMLC">
//                     MLC<span>:</span>
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="IsMLC">
//                     {IP_DoctorWorkbenchNavigation?.IsMLC}
//                   </span>
//                 </div>

//               )}
              
//               {Assesment.length > 0 && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                   <label htmlFor="FinalDiagnosis">
//                     FinalDiagnosis<span>:</span>
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="FinalDiagnosis">
//                     {Assesment?.[0]?.FinalDiagnosis}
//                   </span>
//                 </div>
//               )}

//               {/* <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                 <label htmlFor="Allergy">
//                 Allergy <span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Gender">
//                   {Array.isArray(AllergyDetails) && AllergyDetails.length > 0
//                     ? AllergyDetails.map((allergy) => allergy.Allergent).join(", ")
//                     : "No allergy details available"}
//                 </span>

//               </div> */}
              

              
//               {/* <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Gender">
//                 {AllergyDetails?.map((allergy) => allergy.Allergent).join(", ")}
//               </span> */}

//               { ShowAllergyData && (
//                 <div className="RegisFormcon_j">
//                 {/* Only render Allergy button and modal if there is allergy data */}
//                   {AllergyData?.length > 0 && (
//                     <div className="jhidusch_90">
//                       <button onClick={handleEditClick}>Allergy</button>

//                       {/* Conditional rendering for the modal */}
//                       {openModal && (
//                         <div
//                           className={
//                             isSidebarOpen
//                               ? "sideopen_showcamera_profile_chirayu"
//                               : "showcamera_profile_chirayu"
//                           }
//                           onClick={() => {
//                             setOpenModal(false);
//                           }}
//                         >
//                           <div
//                             className="neww_chirayu"
//                             onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
//                           >
//                             <button
//                               className="modal-close-btnSS"
//                               onClick={() => setOpenModal(false)}
//                             >
//                               &times; {/* Close button */}
//                             </button>

//                             <div className="judscy_uj11">
//                               <div className="wwdsdlm_o">
//                                 {AllergyData.map(
//                                   (allergy) => allergy.Allergent
//                                 ).join(", ")}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
              

              
//               {IP_DoctorWorkbenchNavigation?.Flagging && (
//                 <div className="RegisFormcon_j">
//                   <div className="jjxss_07">
//                     {/* <h4>
//                       Flagging<span>:</span>
//                     </h4> */}
//                     <h4
//                       style={{
//                         width: "30px",
//                         height: "20px",
//                         backgroundColor:
//                           IP_DoctorWorkbenchNavigation?.FlaggingColour || "green",
//                         position: "relative",
//                         cursor: "pointer",
//                       }}
//                       onMouseEnter={() => setShowTooltip(true)}
//                       onMouseLeave={() => setShowTooltip(false)}
//                     >
//                       {/* Tooltip div */}
//                       {showTooltip && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: "-25px",
//                             left: "0",
//                             backgroundColor: "rgba(0, 0, 0, 0.75)",
//                             color: "#fff",
//                             padding: "5px 10px",
//                             borderRadius: "4px",
//                             fontSize: "12px",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {IP_DoctorWorkbenchNavigation?.Flagging ||
//                             "No flagging data"}
//                         </div>
//                       )}
//                     </h4>
//                   </div>
//                 </div>
//               )}  

//               {/* <div className="RegisForm_1 dctr_wrbvh_pice666 ">
//                 <label htmlFor="Allergent">
//                  Allergy <span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Allergent">
//                 {AllergyData?.map((allergy) => allergy.Allergent).join(", ")}


//                 </span>
//               </div> */}
//             </div>
//           </div>

//           <div className="new-patient-registration-form">
//             <div className="new-navigation">
//               <h2>
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseVitals" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseVitals")}
//                 >
//                   Vitals
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseAllergy" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseAllergy")}
//                 >
//                   Allergy
//                 </button>
//                 |
//                 {IP_DoctorWorkbenchNavigation?.RequestType === 'Casuality' && (
//                   <>
//                     <button
//                       style={{
//                         color: ActiveTab === "PatientTimeEntry" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("PatientTimeEntry")}
//                     >
//                       PatientTimeEntry
//                     </button>
//                     |
//                     <button
//                       style={{
//                         color: ActiveTab === "EmgToIpconnect" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("EmgToIpconnect")}
//                     >
//                       EmgToIpconnect
//                     </button>
//                     |
//                   </>
                  
//                 )}
                
             
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseAssesment" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseAssesment")}
//                 >
//                   Assesment
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_NurseInputOutputChart" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseInputOutputChart")}
//                 >
//                   Input Output Chart
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseProgressNotes" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseProgressNotes")}
//                 >
//                   Nursing Notes
//                 </button>
               
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "AdmissionPurpose" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("AdmissionPurpose")}
//                 >
//                   Admission Purpose
//                 </button>
               
//                 |

//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color: [
//                         "BedTransferRequest",
//                         "BedTransferRecieve",
//                         "Service_request",
//                         "IP_ReferAndInchargeDoctor",
//                       ].includes(ActiveTab)
//                         ? "white"
//                         : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     Request
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "BedTransferRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("BedTransferRequest")}
//                     >
//                       BT Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "BedTransferRecieve" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("BedTransferRecieve")}
//                     >
//                       BT Recieve / cancel
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "Service_request" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Service_request")}
//                     >
//                       Service Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_ReferAndInchargeDoctor"
//                             ? "Black"
//                             : "",
//                       }}
//                       onClick={() =>
//                         handleTabChange("IP_ReferAndInchargeDoctor")
//                       }
//                     >
//                       ReferAndInchargeDoctor
//                     </button>

//                     <button
//                       style={{
//                         color: ActiveTab === "Consultation" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Consultation")}
//                     >
//                       Consultation
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "RadiologyTest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("RadiologyTest")}
//                     >
//                       Radiology
//                     </button>
//                     <button
//                       style={{ color: ActiveTab === "LabTest" ? "white" : "" }}
//                       onClick={() => handleTabChange("LabTest")}
//                     >
//                       Lab
//                     </button>

//                     {/* <button style={{ color: ActiveTab === "RadiologyTest" ? 'white' : '' }} onClick={() => handleTabChange("RadiologyTest")}>
//                       Radiology
//                     </button>
//                     <button style={{ color: ActiveTab === "LabTest" ? 'white' : '' }} onClick={() => handleTabChange("LabTest")}>
//                       Lab
//                     </button> */}
//                     <button
//                       style={{
//                         color: ActiveTab === "OtRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("OtRequest")}
//                     >
//                       OT Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_NurseDrugRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_NurseDrugRequest")}
//                     >
//                       Drug Request
//                     </button>

//                     {/* <button style={{ color: ActiveTab === "DrugRequest" ? 'white' : '' }} onClick={() => handleTabChange("DrugRequest")}>
//                       Drug Request
//                     </button> */}
//                     <button
//                       style={{
//                         color: ActiveTab === "LeninRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("LeninRequest")}
//                     >
//                       Lenin Request
//                     </button>
//                   </div>
//                 </div>
//                 |

//                 <button
//                   style={{
//                     color: ActiveTab === "IpDrugAdminister" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IpDrugAdminister")}
//                 >
//                   DrugAdministration
//                 </button>
//                  |

//                 <button
//                   style={{
//                     color: ActiveTab === "Therapy" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("Therapy")}
//                 >
//                   Therapy
//                 </button>
// |  
//  <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "IP_VentilatorSettings" ||
//                         ActiveTab === "IP_BloodLines" ||
//                         ActiveTab === "IP_UrinaryCathetor" ||
//                         ActiveTab === "IP_BloodTransfusedRecord" ||
//                         ActiveTab === "IP_DrainageTubes"
//                           ? "white"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     IPM
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_VentilatorSettings")}
//                     >
//                       VentilatorSettings
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_BloodLines" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BloodLines")}
//                     >
//                       BloodLines
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_UrinaryCathetor")}
//                     >
//                       UrinaryCathetor
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BloodTransfusedRecord"
//                             ? "Black"
//                             : "",
//                       }}
//                       onClick={() =>
//                         handleTabChange("IP_BloodTransfusedRecord")
//                       }
//                     >
//                       BloodTransfusedRecord
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DrainageTubes")}
//                     >
//                       DrainageTubes
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_SurgicalSite")}
//                     >
//                       SurgicalSite
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BedsoreManagement")}
//                     >
//                       BedsoreManagement
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_PatientCare" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_PatientCare")}
//                     >
//                       PatientCare
//                     </button>
//                   </div>
//                 </div>

// |

// <button
//                   style={{
//                     color: ActiveTab === "IP_ConsentForms" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_ConsentForms")}
//                 >
//                   IP_ConsentForms
//                 </button>
//                 |


//                 <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_NursePreoperativeChecklist"
//                         ? "white"
//                         : "",
//                   }}
//                   onClick={() =>
//                     handleTabChange("IP_NursePreoperativeChecklist")
//                   }
//                 >
//                   IP_NursePreoperativeChecklist
//                 </button>
//                 |

//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NursePreOPIns" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NursePreOPIns")}
//                 >
//                   IP_NursePreOPIns
//                 </button>
//                 |
              
              
             
//                 {/* |
//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "IP_VentilatorSettings" ||
//                         ActiveTab === "IP_BloodLines" ||
//                         ActiveTab === "IP_UrinaryCathetor" ||
//                         ActiveTab === "IP_BloodTransfusedRecord" ||
//                         ActiveTab === "IP_DrainageTubes"
//                           ? "white"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     IPM
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_VentilatorSettings")}
//                     >
//                       VentilatorSettings
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_BloodLines" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BloodLines")}
//                     >
//                       BloodLines
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_UrinaryCathetor")}
//                     >
//                       UrinaryCathetor
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BloodTransfusedRecord"
//                             ? "Black"
//                             : "",
//                       }}
//                       onClick={() =>
//                         handleTabChange("IP_BloodTransfusedRecord")
//                       }
//                     >
//                       BloodTransfusedRecord
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DrainageTubes")}
//                     >
//                       DrainageTubes
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_SurgicalSite")}
//                     >
//                       SurgicalSite
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BedsoreManagement")}
//                     >
//                       BedsoreManagement
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_PatientCare" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_PatientCare")}
//                     >
//                       PatientCare
//                     </button>
//                   </div>
//                 </div> */}
                
             
//                 {/* |
//                 <div className="Lab_dropdown">
//                   <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'white' : '' }} className="Lab_button">Service Request</button>
//                   <div className="Lab_dropdown_content">
//                     <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'Black' : '' }} onClick={() => handleTabChange("IP_ReferAndInchargeDoctor")}>
//                     ReferAndInchargeDoctor
//                     </button>
                    
                    
//                   </div>
//                 </div> */}


// <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_NurseSurgicalHistory" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseSurgicalHistory")}
//                 >
//                   Surgical History
//                 </button>
                
                

//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_NurseMlc" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_NurseMlc")}
//                 >
//                   MLC
//                 </button>

//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_CaseSheet" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_CaseSheet")}
//                 >
//                   Case Sheet
//                 </button>
//                 |
//                   <button
//                   style={{ color: ActiveTab === "IPNURSEEMR" ? "white" : "" }}
//                   onClick={() => handleTabChange("IPNURSEEMR")}
//                 >
//                  IP NURSE EMR
//                 </button>
//                 |


//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "IP_Nurse_DAMA" ||
//                         ActiveTab === "DischargeRequest" ||
//                         ActiveTab === "IP_DischargeSummary" ||
//                         ActiveTab === "IP_DischargeStatus" ||
//                         ActiveTab === "DischargeChecklist" ||
//                         ActiveTab === "PhysicalDischarge" ||
//                         ActiveTab === "DischargeCancel" ||
//                         ActiveTab === "DisChargeClearance"
//                           ? "White"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     Discharge
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_Nurse_DAMA" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_Nurse_DAMA")}
//                     >
//                       DAMA
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "DischargeRequest" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DischargeRequest")}
//                     >
//                       Discharge Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_DischargeSummary" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DischargeSummary")}
//                     >
//                       Discharge Summary
//                     </button>

//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_DischargeStatus" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DischargeStatus")}
//                     >
//                       DischargeStatus
//                     </button>
                   
//                     {/* <button
//                       style={{
//                         color:
//                           ActiveTab === "DischargeChecklist" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DischargeChecklist")}
//                     >
//                       Discharge Checklist
//                     </button>
                   
//                     <button
//                       style={{
//                         color: ActiveTab === "PhysicalDischarge" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("PhysicalDischarge")}
//                     >
//                       Physical Discharge
//                     </button> */}

//                     <button
//                       style={{
//                         color: ActiveTab === "DischargeCancel" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DischargeCancel")}
//                     >
//                       Discharge Cancel
//                     </button>
                    
//                     {/* <button
//                       style={{
//                         color:
//                           ActiveTab === "DisChargeClearance" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DisChargeClearance")}
//                     >
//                       Discharge Clearance
//                     </button> */}

//                   </div>
//                 </div>
//               </h2>
//             </div>

//             <div className="new-kit ">
//               <button className="new-tog" onClick={toggle}>
//                 {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
//               </button>

//               <div>
//                 {isToggled && (

//                     <div className="new-navigation-toggle">
                      
//               <h2>
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseVitals" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseVitals")}
//                 >
//                   Vitals
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseAllergy" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseAllergy")}
//                 >
//                   Allergy
//                 </button>
//                 |
//                 {IP_DoctorWorkbenchNavigation?.RequestType === 'Casuality' && (
//                   <>
//                     <button
//                       style={{
//                         color: ActiveTab === "PatientTimeEntry" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("PatientTimeEntry")}
//                     >
//                       PatientTimeEntry
//                     </button>
//                     |
//                     <button
//                       style={{
//                         color: ActiveTab === "EmgToIpconnect" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("EmgToIpconnect")}
//                     >
//                       EmgToIpconnect
//                     </button>
//                     |
//                   </>
                  
//                 )}
                
             
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseAssesment" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseAssesment")}
//                 >
//                   Assesment
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_NurseInputOutputChart" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseInputOutputChart")}
//                 >
//                   Input Output Chart
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NurseProgressNotes" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseProgressNotes")}
//                 >
//                   Nursing Notes
//                 </button>
               
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "AdmissionPurpose" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("AdmissionPurpose")}
//                 >
//                   Admission Purpose
//                 </button>
               
//                 |

//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color: [
//                         "BedTransferRequest",
//                         "BedTransferRecieve",
//                         "Service_request",
//                         "IP_ReferAndInchargeDoctor",
//                       ].includes(ActiveTab)
//                         ? "white"
//                         : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     Request
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "BedTransferRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("BedTransferRequest")}
//                     >
//                       BT Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "BedTransferRecieve" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("BedTransferRecieve")}
//                     >
//                       BT Recieve / cancel
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "Service_request" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Service_request")}
//                     >
//                       Service Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_ReferAndInchargeDoctor"
//                             ? "Black"
//                             : "",
//                       }}
//                       onClick={() =>
//                         handleTabChange("IP_ReferAndInchargeDoctor")
//                       }
//                     >
//                       ReferAndInchargeDoctor
//                     </button>

//                     <button
//                       style={{
//                         color: ActiveTab === "Consultation" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Consultation")}
//                     >
//                       Consultation
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "RadiologyTest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("RadiologyTest")}
//                     >
//                       Radiology
//                     </button>
//                     <button
//                       style={{ color: ActiveTab === "LabTest" ? "white" : "" }}
//                       onClick={() => handleTabChange("LabTest")}
//                     >
//                       Lab
//                     </button>

//                     {/* <button style={{ color: ActiveTab === "RadiologyTest" ? 'white' : '' }} onClick={() => handleTabChange("RadiologyTest")}>
//                       Radiology
//                     </button>
//                     <button style={{ color: ActiveTab === "LabTest" ? 'white' : '' }} onClick={() => handleTabChange("LabTest")}>
//                       Lab
//                     </button> */}
//                     <button
//                       style={{
//                         color: ActiveTab === "OtRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("OtRequest")}
//                     >
//                       OT Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_NurseDrugRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_NurseDrugRequest")}
//                     >
//                       Drug Request
//                     </button>

//                     {/* <button style={{ color: ActiveTab === "DrugRequest" ? 'white' : '' }} onClick={() => handleTabChange("DrugRequest")}>
//                       Drug Request
//                     </button> */}
//                     <button
//                       style={{
//                         color: ActiveTab === "LeninRequest" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("LeninRequest")}
//                     >
//                       Lenin Request
//                     </button>
//                   </div>
//                 </div>
//                 |

//                 <button
//                   style={{
//                     color: ActiveTab === "IpDrugAdminister" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IpDrugAdminister")}
//                 >
//                   DrugAdministration
//                 </button>
//                  |

//                 <button
//                   style={{
//                     color: ActiveTab === "Therapy" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("Therapy")}
//                 >
//                   Therapy
//                 </button>
// |  
//  <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "IP_VentilatorSettings" ||
//                         ActiveTab === "IP_BloodLines" ||
//                         ActiveTab === "IP_UrinaryCathetor" ||
//                         ActiveTab === "IP_BloodTransfusedRecord" ||
//                         ActiveTab === "IP_DrainageTubes"
//                           ? "white"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     IPM
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_VentilatorSettings")}
//                     >
//                       VentilatorSettings
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_BloodLines" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BloodLines")}
//                     >
//                       BloodLines
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_UrinaryCathetor")}
//                     >
//                       UrinaryCathetor
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BloodTransfusedRecord"
//                             ? "Black"
//                             : "",
//                       }}
//                       onClick={() =>
//                         handleTabChange("IP_BloodTransfusedRecord")
//                       }
//                     >
//                       BloodTransfusedRecord
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DrainageTubes")}
//                     >
//                       DrainageTubes
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_SurgicalSite")}
//                     >
//                       SurgicalSite
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BedsoreManagement")}
//                     >
//                       BedsoreManagement
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_PatientCare" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_PatientCare")}
//                     >
//                       PatientCare
//                     </button>
//                   </div>
//                 </div>

// |

// <button
//                   style={{
//                     color: ActiveTab === "IP_ConsentForms" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_ConsentForms")}
//                 >
//                   IP_ConsentForms
//                 </button>
//                 |


//                 <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_NursePreoperativeChecklist"
//                         ? "white"
//                         : "",
//                   }}
//                   onClick={() =>
//                     handleTabChange("IP_NursePreoperativeChecklist")
//                   }
//                 >
//                   IP_NursePreoperativeChecklist
//                 </button>
//                 |

//                 <button
//                   style={{
//                     color: ActiveTab === "IP_NursePreOPIns" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NursePreOPIns")}
//                 >
//                   IP_NursePreOPIns
//                 </button>
//                 |
              
              
             
//                 {/* |
//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "IP_VentilatorSettings" ||
//                         ActiveTab === "IP_BloodLines" ||
//                         ActiveTab === "IP_UrinaryCathetor" ||
//                         ActiveTab === "IP_BloodTransfusedRecord" ||
//                         ActiveTab === "IP_DrainageTubes"
//                           ? "white"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     IPM
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_VentilatorSettings")}
//                     >
//                       VentilatorSettings
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_BloodLines" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BloodLines")}
//                     >
//                       BloodLines
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_UrinaryCathetor")}
//                     >
//                       UrinaryCathetor
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BloodTransfusedRecord"
//                             ? "Black"
//                             : "",
//                       }}
//                       onClick={() =>
//                         handleTabChange("IP_BloodTransfusedRecord")
//                       }
//                     >
//                       BloodTransfusedRecord
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DrainageTubes")}
//                     >
//                       DrainageTubes
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_SurgicalSite")}
//                     >
//                       SurgicalSite
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_BedsoreManagement")}
//                     >
//                       BedsoreManagement
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_PatientCare" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_PatientCare")}
//                     >
//                       PatientCare
//                     </button>
//                   </div>
//                 </div> */}
                
             
//                 {/* |
//                 <div className="Lab_dropdown">
//                   <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'white' : '' }} className="Lab_button">Service Request</button>
//                   <div className="Lab_dropdown_content">
//                     <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'Black' : '' }} onClick={() => handleTabChange("IP_ReferAndInchargeDoctor")}>
//                     ReferAndInchargeDoctor
//                     </button>
                    
                    
//                   </div>
//                 </div> */}


// <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_NurseSurgicalHistory" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_NurseSurgicalHistory")}
//                 >
//                   Surgical History
//                 </button>
                
                

//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_NurseMlc" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_NurseMlc")}
//                 >
//                   MLC
//                 </button>

//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_CaseSheet" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_CaseSheet")}
//                 >
//                   Case Sheet
//                 </button>
//                 |
//   <button
//                   style={{ color: ActiveTab === "IPNURSEEMR" ? "white" : "" }}
//                   onClick={() => handleTabChange("IPNURSEEMR")}
//                 >
//                   IP NURSE EMR
//                 </button>

//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "IP_Nurse_DAMA" ||
//                         ActiveTab === "DischargeRequest" ||
//                         ActiveTab === "IP_DischargeSummary" ||
//                         ActiveTab === "IP_DischargeStatus" ||
//                         ActiveTab === "DischargeChecklist" ||
//                         ActiveTab === "PhysicalDischarge" ||
//                         ActiveTab === "DischargeCancel" ||
//                         ActiveTab === "DisChargeClearance"
//                           ? "White"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     Discharge
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{
//                         color: ActiveTab === "IP_Nurse_DAMA" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_Nurse_DAMA")}
//                     >
//                       DAMA
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "DischargeRequest" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DischargeRequest")}
//                     >
//                       Discharge Request
//                     </button>
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_DischargeSummary" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DischargeSummary")}
//                     >
//                       Discharge Summary
//                     </button>
                    
//                     <button
//                       style={{
//                         color:
//                           ActiveTab === "IP_DischargeStatus" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("IP_DischargeStatus")}
//                     >
//                       DischargeStatus
//                     </button>
                  
//                     {/* <button
//                       style={{
//                         color:
//                           ActiveTab === "DischargeChecklist" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DischargeChecklist")}
//                     >
//                       Discharge Checklist
//                     </button>
                    
//                     <button
//                       style={{
//                         color: ActiveTab === "PhysicalDischarge" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("PhysicalDischarge")}
//                     >
//                       Physical Discharge
//                     </button> */}

//                     <button
//                       style={{
//                         color: ActiveTab === "DischargeCancel" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DischargeCancel")}
//                     >
//                       Discharge Cancel
//                     </button>
                    
//                     {/* <button
//                       style={{
//                         color:
//                           ActiveTab === "DisChargeClearance" ? "Black" : "",
//                       }}
//                       onClick={() => handleTabChange("DisChargeClearance")}
//                     >
//                       Discharge Clearance
//                     </button> */}

//                   </div>
//                 </div>
//               </h2>
//             </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <Suspense fallback={<div>Loading...</div>}>
//           {ActiveTab === "IP_NurseVitals" && <IP_NurseVitals />}
//           {ActiveTab === "IP_NurseAllergy" && <IP_NurseAllergy onAllergySubmitSuccess={handleAllergyDataUpdate}/>}
//           {ActiveTab === "PatientTimeEntry" && <PatientTimeEntry />}
//           {ActiveTab === "EmgToIpconnect" && <EmgToIpconnect />}

//           {ActiveTab === "IP_NurseSurgicalHistory" && (
//             <IP_NurseSurgicalHistory />
//           )}

//           {ActiveTab === "IP_NurseAssesment" && <IP_NurseAssesment />}

//           {ActiveTab === "IP_NurseInputOutputChart" && (
//             <IP_NurseInputOutputChart />
//           )}

//           {ActiveTab === "IP_NurseProgressNotes" && <IP_NurseProgressNotes />}
//           {ActiveTab === "AdmissionPurpose" && <AdmissionPurpose onAdmissionSubmitSuccess={handleAdmissionPurposeData}/>}

//           {ActiveTab === "IP_NurseMlc" && <IP_NurseMlc />}
//           {ActiveTab === "IP_CaseSheet" && <IP_CaseSheet />}
//           {ActiveTab === "IPNURSEEMR" && <IPNURSEEMR />}

//           {ActiveTab === "IP_Nurse_DAMA" && <IP_Nurse_DAMA />}

//           {ActiveTab === "IP_NursePreoperativeChecklist" && (
//             <IP_NursePreoperativeChecklist />
//           )}

//           {ActiveTab === "IP_NursePreOPIns" && <IP_NursePreOPIns />}
//           {ActiveTab === "IP_ConsentForms" && <IP_ConsentForms />}
//           {ActiveTab === "BedTransferRequest" && <BedTransferRequest />}
//           {ActiveTab === "BedTransferRecieve" && <BedtransferRecieve />}
//           {ActiveTab === "Service_request" && <ServiceProcedureRequest />}
//           {ActiveTab === "IP_VentilatorSettings" && <IP_VentilatorSettings />}
//           {ActiveTab === "IP_BloodLines" && <IP_BloodLines />}
//           {ActiveTab === "IP_UrinaryCathetor" && <IP_UrinaryCathetor />}
//           {ActiveTab === "IP_BloodTransfusedRecord" && (
//             <IP_BloodTransfusedRecord />
//           )}

//           {ActiveTab === "IP_DrainageTubes" && <IP_DrainageTubes />}
//           {ActiveTab === "IP_SurgicalSite" && <IP_SurgicalSite />}
//           {ActiveTab === "IP_BedsoreManagement" && <IP_BedsoreManagement />}
//           {ActiveTab === "IP_PatientCare" && <IP_PatientCare />}
//           {ActiveTab === "IP_ReferAndInchargeDoctor" && (
//             <IP_ReferAndInchargeDoctor />
//           )}

//           {ActiveTab === "DischargeRequest" && <DischargeRequest />}
//           {ActiveTab === "IP_DischargeSummary" && <IP_DischargeSummary />}
//           {ActiveTab === "IP_DischargeStatus" && <IP_DischargeStatus />}
//           {ActiveTab === "DischargeChecklist" && <DischargeChecklist />}
//           {ActiveTab === "DisChargeClearance" && <DisChargeClearance />}
//           {ActiveTab === "PhysicalDischarge" && <PhysicalDischarge />}
//           {ActiveTab === "DischargeCancel" && <DischargeCancel />}
//           {ActiveTab === "LabTest" && <LabTest />}
//           {ActiveTab === "RadiologyTest" && <RadiologyTest />}
//           {ActiveTab === "Consultation" && <Consultation />}
//           {ActiveTab === "IP_NurseDrugRequest" && <IP_NurseDrugRequest />}

//           {ActiveTab === "MlcRegisterForm" && <MlcRegisterForm />}
//           {ActiveTab === "IpDrugAdminister" && <IpDrugAdminister />}
//           {ActiveTab === "Therapy" && <Therapy />}
//           {ActiveTab === "OtRequest" && <Ip_ot_request />}
//         </Suspense>
//       </div>
//     </>
//   );
// };

// export default IP_NurseWorkbenchNavigation;
import React, { useState, useEffect, lazy, Suspense } from "react";
import "../../DoctorWorkBench/Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bgImg2 from "../../Assets/bgImg2.jpg";
import "../../DoctorWorkBench/TreatmentComponent.css";
import axios from "axios";
import Ip_ot_request from "../../OtManagement/Ip_ot_request.jsx";
import TreatmentsForms from "./Casuality/TreatmentsForms.jsx";

const Pediortics = lazy(() => import("./Pediotrics.jsx"));


const IP_NurseVitals = lazy(() => import("./IP_NurseVitals.jsx"));
const IPNURSEEMR = lazy(() => import("./IPNURSEEMR.jsx"));
const IP_NurseSurgicalHistory = lazy(() =>
  import("./IP_NurseSurgicalHistory.jsx")
);
const IP_NurseAssesment = lazy(() => import("./IP_NurseAssesment.jsx"));
const IP_NurseInputOutputChart = lazy(() =>
  import("./IP_NurseInputOutputChart.jsx")
);
const IP_NurseProgressNotes = lazy(() => import("./IP_NurseProgressNotes.jsx"));
const AdmissionPurpose = lazy(() => import("./AdmissionPurpose.jsx"));
const IP_NurseMlc = lazy(() => import("./IP_NurseMlc.jsx"));
const IP_CaseSheet = lazy(() => import("./IP_CaseSheet.jsx"));
const IP_Nurse_DAMA = lazy(() => import("./IP_Nurse_DAMA.jsx"));
const IP_NursePreoperativeChecklist = lazy(() =>
  import("./IP_NursePreoperativeChecklist.jsx")
);
const IP_NursePreOPIns = lazy(() => import("./IP_NursePreOPIns.jsx"));
const IP_ConsentForms = lazy(() => import("./IP_ConsentForms.jsx"));
const BedTransferRequest = lazy(() => import("./BedTransferRequest.jsx"));
const BedtransferRecieve = lazy(() => import("./BedtransferRecieve.jsx"));
const OtRequest = lazy(()=>import("../../OtManagement/Ip_ot_request.jsx"));
const ServiceProcedureRequest = lazy(() =>
  import("./ServiceProcedureRequest.jsx")
);
const IP_VentilatorSettings = lazy(() =>
  import("../Nurse/IPM/IP_VentilatorSettings.jsx")
);
const IP_BloodLines = lazy(() => import("../Nurse/IPM/IP_BloodLines.jsx"));
const IP_UrinaryCathetor = lazy(() =>
  import("../Nurse/IPM/IP_UrinaryCathetor.jsx")
);
const IP_BloodTransfusedRecord = lazy(() =>
  import("../Nurse/IPM/IP_BloodTransfusedRecord.jsx")
);
const IP_DrainageTubes = lazy(() =>
  import("../Nurse/IPM/IP_DrainageTubes.jsx")
);
const IP_SurgicalSite = lazy(() => import("../Nurse/IPM/IP_SurgicalSite.jsx"));
const IP_BedsoreManagement = lazy(() =>
  import("../Nurse/IPM/IP_BedsoreManagement.jsx")
);
const IP_PatientCare = lazy(() => import("../Nurse/IPM/IP_PatientCare.jsx"));
const IP_ReferAndInchargeDoctor = lazy(() =>
  import("../Nurse/ServiceRequest/IP_ReferAndInchargeDoctor.jsx")
);
const DischargeRequest = lazy(() =>
  import("../Nurse/Discharge/IP_DischargeRequest.jsx")
);
const IP_DischargeSummary = lazy(() =>
  import("../Nurse/Discharge/IP_DischargeSummary.jsx")
);
const IP_DischargeStatus = lazy(() =>
  import("../Nurse/Discharge/IP_DischargeStatus.jsx")
);
const DischargeChecklist = lazy(() =>
  import("./Discharge/IP_DischargeChecklist.jsx")
);
const DisChargeClearance = lazy(() =>
  import("./Discharge/IP_DischargeClearance.jsx")
);
const PhysicalDischarge = lazy(() =>
  import("./Discharge/IP_Physical_Discharge.jsx")
);
const DischargeCancel = lazy(() =>
  import("./Discharge/IP_DischargeCancel.jsx")
);
const LabTest = lazy(() => import("./Labtest.jsx"));
const RadiologyTest = lazy(() => import("./RadiologyTest.jsx"));
const Consultation = lazy(() => import("./Consultation.jsx"));
const IP_NurseDrugRequest = lazy(() => import("./IP_NurseDrugRequest.jsx"));
const PatientTimeEntry = lazy(() => import("./Casuality/PatientTimeEntry.jsx"));
const EmgToIpconnect = lazy(() => import("./Casuality/EmgToIpconnect.jsx"));
const BirthRegister = lazy(() => import("./BirthRegister.jsx"));
const DeathRegister = lazy(() => import("./DeathRegister.jsx"));
const IP_NurseAllergy = lazy(() => import("./IP_NurseAllergy.jsx"));
const MlcRegisterForm = lazy(() => import("./MlcRegisterForm.jsx"));
const IpDrugAdminister = lazy(() => import("./IpDrugAdminister.jsx"));
const Therapy = lazy(() => import("./NurseTherapyRequest.jsx"));
const Drug_Flow_Chart = lazy(() => import("./Drug_Flow_Chart.jsx"));


const IP_NurseWorkbenchNavigation = () => {
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  console.log(IP_DoctorWorkbenchNavigation, "IP_DoctorWorkbenchNavigation");
  
    
  const [AdmissionDetails, setAdmissionDetails] = useState([]);
  const [Assesment, setAssesment] = useState([]);
  
  const [CurrentPreviousRoom, setCurrentPreviousRoom] = useState(null);

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState("IP_NurseVitals");
  const [isToggled, setIsToggled] = useState(false);

  const toggle = () => setIsToggled(!isToggled);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const closeToggle = () => {
    setIsToggled(false);
  };

  useEffect(() => {
    console.log(IP_DoctorWorkbenchNavigation);
    if (Object.keys(IP_DoctorWorkbenchNavigation).length === 0) {
      navigate("/Home/IP_NurseQuelist");
    }
    // else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
    //   navigate('/Home/CasualityNurseQuelist')
    // }
  }, [IP_DoctorWorkbenchNavigation]);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [AllergyData, setAllergyData] = useState([]);
  const [GetAdmissionDetails, setGetAdmissionDetails] = useState([]);

  const [ShowAllergyData, setShowAllergyData] = useState(false);
  const [ShowAdmissionPurposeData, setShowAdmissionPurposeData] = useState(false);

  console.log(GetAdmissionDetails,'GetAdmissionDetails');
  console.log(ShowAllergyData,'ShowAllergyData');
  console.log(ShowAdmissionPurposeData,'ShowAdmissionPurposeData');
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  console.log(AllergyData, "gridData");

  const [showTooltip, setShowTooltip] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const handleEditClick = () => {
    setOpenModal(true);
  };

  console.log('qq---RegistrationId',IP_DoctorWorkbenchNavigation?.RegistrationId,'qq---RegistrationId')


  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;
  
    console.log(RegistrationId, 'qq---RegistrationId');
  
    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Allergy_Details_Link`, {
          params: {
            RegistrationId: RegistrationId,
            DepartmentType: departmentType,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setAllergyData(res.data);
            setShowAllergyData(true);
            console.log(res.data, 'Allergy data loaded');
          } else {
            // setAllergyData([]);          // Optional: clear previous data if empty
            setShowAllergyData(false);   // Optional: hide if no data
            console.log('No allergy data found');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation, ShowAllergyData]);
  

    const handleAllergyDataUpdate = (updatedAllergyData) => {
      setAllergyData(updatedAllergyData);
      setShowAllergyData(true);
    };


  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;

    axios.get(`${UrlLink}Frontoffice/Patient_Admission_Purpose_Details`, {
        params: { RegistrationId }
    })
    .then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setGetAdmissionDetails(res.data);
        setShowAdmissionPurposeData(true)
      } else {
        setShowAdmissionPurposeData(false)

      }
        
    })
    .catch((err) => {
        console.error('Error fetching admission details:', err);
    });
  }, [UrlLink, IP_DoctorWorkbenchNavigation,ShowAdmissionPurposeData]);

   const handleAdmissionPurposeData = (updatedAdmissionPurpose) => {
      setGetAdmissionDetails(updatedAdmissionPurpose);
      setShowAdmissionPurposeData(true);
    };

  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    axios
      .get(`${UrlLink}Frontoffice/get_AdmissionDetails`, {
        params: {
          RegistrationId: RegistrationId,
        },
      })
      .then((res) => {
        setAdmissionDetails(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  useEffect(() => {
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
          params: {
            RegistrationId: RegistrationId,
            DepartmentType: departmentType,
          },
        })
        .then((res) => {
          const ress = res.data;
          console.log(res);
          setAssesment(ress);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/get_ip_roomdetials_for_bedtransfer_details?RegistrationId=${IP_DoctorWorkbenchNavigation?.RegistrationId}`
      )
      .then((res) => {
        const ress = res.data;
        setCurrentPreviousRoom(ress);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, IP_DoctorWorkbenchNavigation]);

  // useEffect(() => {
  //   if (Object.keys(IP_DoctorWorkbenchNavigation).length === 0 && Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
  //     navigate('/Home/IP_NurseQuelist');
  //   } else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
  //     navigate('/Home/CasualityNurseQuelist');
  //   }
  // }, [IP_DoctorWorkbenchNavigation, Casuality_DoctorWorkbenchNavigation]);

  return (
    <>
      <div className="Main_container_app">
        <div className="new-patient-registration-form">
          <div className="dctr_info_up_head">
            <div className="RegisFormcon ">
              <div className="dctr_info_up_head22">
                <img src={bgImg2} alt="Default Patient Photo" />

                <label>Profile</label>
              </div>
            </div>



            <div className="RegisFormcon_1">


              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="PatientID">
                  Patient ID <span>:</span>
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientID">
                  {IP_DoctorWorkbenchNavigation?.PatientId}
                </span>
              </div>

              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientName">
                  {IP_DoctorWorkbenchNavigation?.PatientName || ""}
                </span>
              </div>
              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="AgeGender">
                  Age / Gender <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Age">
                  {IP_DoctorWorkbenchNavigation?.Age} /{" "}
                  {IP_DoctorWorkbenchNavigation?.Gender}
                </span>
              </div>

             

              {IP_DoctorWorkbenchNavigation?.BloodGroup && (
                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="BloodGroup">
                    Blood Group <span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="BloodGroup">
                    {IP_DoctorWorkbenchNavigation?.BloodGroup}
                  </span>
                </div>
              )}
              

              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="RegistrationIdBedNo">
                  IP No / Bed No<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="RegistrationIdBedNo">
                  {IP_DoctorWorkbenchNavigation?.RegistrationId} /
                  { IP_DoctorWorkbenchNavigation?.BedNo}
                </span>
              </div>
              
              {IP_DoctorWorkbenchNavigation?.DoctorName && (
                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="DoctorName">
                    Doctor Name <span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="DoctorName">
                    {IP_DoctorWorkbenchNavigation?.DoctorName}
                  </span>
                </div>
              )}
              


              {ShowAdmissionPurposeData && (
                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="AdmissionPurpose">
                    POA<span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmissionPurpose">
                    {GetAdmissionDetails[GetAdmissionDetails.length - 1]?.AdmissionPurpose}
                    {/* {GetAdmissionDetails?.AdmissionPurpose}ss */}
                  </span>
                </div>
              )}

              {/* {AdmissionDetails.length > 0 && (
                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="AdmissionPurpose">
                    POA<span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmissionPurpose">
                    {AdmissionDetails?.[0]?.AdmissionPurpose}
                  </span>
                </div>
              )} */}
              
              {(IP_DoctorWorkbenchNavigation?.CurrDate || CurrentPreviousRoom?.ip_register_data?.[0]?.AdmitDate) && (
                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="AdmitDate">
                    DOA<span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmitDate">
                    {CurrentPreviousRoom?.ip_register_data?.[0]?.AdmitDate || IP_DoctorWorkbenchNavigation?.CurrDate}
                  </span>
                </div>
              )}
              

              {IP_DoctorWorkbenchNavigation?.PatientCategory && (
                <div className="RegisForm_1 dctr_wrbvh_pice666">
                  <label htmlFor="PatientCategory">
                    Patient Category <span>:</span>
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientCategory">
                    {IP_DoctorWorkbenchNavigation?.PatientCategory}
                  </span>
                </div>
              )}
              

              {["Insurance", "Client"].includes(IP_DoctorWorkbenchNavigation?.PatientCategory && IP_DoctorWorkbenchNavigation?.PatientCategoryName) && (
                <div className="RegisForm_1 dctr_wrbvh_pice666">
                  <label htmlFor="InsuranceNameClientName">
                    {IP_DoctorWorkbenchNavigation?.PatientCategory === "Insurance"
                      ? "Insurance Name"
                      : "Client Name"}
                    <span>:</span>
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="InsuranceNameClientName">
                    {IP_DoctorWorkbenchNavigation?.PatientCategoryName}
                  </span>
                </div>
              )}


              {IP_DoctorWorkbenchNavigation?.IsMLC === 'Yes' && (

                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="IsMLC">
                    MLC<span>:</span>
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="IsMLC">
                    {IP_DoctorWorkbenchNavigation?.IsMLC}
                  </span>
                </div>

              )}
              
              {Assesment.length > 0 && (
                <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                  <label htmlFor="FinalDiagnosis">
                    FinalDiagnosis<span>:</span>
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="FinalDiagnosis">
                    {Assesment?.[0]?.FinalDiagnosis}
                  </span>
                </div>
              )}

              {/* <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="Allergy">
                Allergy <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Gender">
                  {Array.isArray(AllergyDetails) && AllergyDetails.length > 0
                    ? AllergyDetails.map((allergy) => allergy.Allergent).join(", ")
                    : "No allergy details available"}
                </span>

              </div> */}
              

              
              {/* <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Gender">
                {AllergyDetails?.map((allergy) => allergy.Allergent).join(", ")}
              </span> */}

              { ShowAllergyData && (
                <div className="RegisFormcon_j">
                {/* Only render Allergy button and modal if there is allergy data */}
                  {AllergyData?.length > 0 && (
                    <div className="jhidusch_90">
                      <button onClick={handleEditClick}>Allergy</button>

                      {/* Conditional rendering for the modal */}
                      {openModal && (
                        <div
                          className={
                            isSidebarOpen
                              ? "sideopen_showcamera_profile_chirayu"
                              : "showcamera_profile_chirayu"
                          }
                          onClick={() => {
                            setOpenModal(false);
                          }}
                        >
                          <div
                            className="neww_chirayu"
                            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
                          >
                            <button
                              className="modal-close-btnSS"
                              onClick={() => setOpenModal(false)}
                            >
                              &times; {/* Close button */}
                            </button>

                            <div className="judscy_uj11">
                              <div className="wwdsdlm_o">
                                {AllergyData.map(
                                  (allergy) => allergy.Allergent
                                ).join(", ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              

              
              {IP_DoctorWorkbenchNavigation?.Flagging && (
                <div className="RegisFormcon_j">
                  <div className="jjxss_07">
                    {/* <h4>
                      Flagging<span>:</span>
                    </h4> */}
                    <h4
                      style={{
                        width: "30px",
                        height: "20px",
                        backgroundColor:
                          IP_DoctorWorkbenchNavigation?.FlaggingColour || "green",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      {/* Tooltip div */}
                      {showTooltip && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-25px",
                            left: "0",
                            backgroundColor: "rgba(0, 0, 0, 0.75)",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {IP_DoctorWorkbenchNavigation?.Flagging ||
                            "No flagging data"}
                        </div>
                      )}
                    </h4>
                  </div>
                </div>
              )}  

              {/* <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="Allergent">
                 Allergy <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Allergent">
                {AllergyData?.map((allergy) => allergy.Allergent).join(", ")}


                </span>
              </div> */}
            </div>
          </div>

          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
                <button
                  style={{
                    color: ActiveTab === "IP_NurseVitals" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseVitals")}
                >
                  Vitals
                </button>
                |
                <button
                  style={{
                    color: ActiveTab === "IP_NurseAllergy" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseAllergy")}
                >
                  Allergy
                </button>
                |
                {IP_DoctorWorkbenchNavigation?.RequestType === 'Casuality' && (
                  <>
                    <button
                      style={{
                        color: ActiveTab === "PatientTimeEntry" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("PatientTimeEntry")}
                    >
                      PatientTimeEntry
                    </button>
                    |
                     <button
                      style={{
                        color: ActiveTab === "TreatmentsForms" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("TreatmentsForms")}
                    >
                      TreatmentsForms
                    </button>
                    |                                    
                    <button
                      style={{
                        color: ActiveTab === "EmgToIpconnect" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("EmgToIpconnect")}
                    >
                      EmgToIpconnect
                    </button>
                    |
                  </>
                  
                )}
                <button
                  style={{
                    color: ActiveTab === "Pediortics" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("Pediortics")}
                >
                  Pediotrics
                </button>
                |
             
                <button
                  style={{
                    color: ActiveTab === "IP_NurseAssesment" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseAssesment")}
                >
                  Assesment
                </button>
                 |
                     <button
                      style={{
                        color: ActiveTab === "TreatmentsForms" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("TreatmentsForms")}
                    >
                      TreatmentsForms
                    </button>
                |
                <button
                  style={{
                    color:
                      ActiveTab === "IP_NurseInputOutputChart" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseInputOutputChart")}
                >
                  Input Output Chart
                </button>
                |
                <button
                  style={{
                    color: ActiveTab === "IP_NurseProgressNotes" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseProgressNotes")}
                >
                  Nursing Notes
                </button>
               
                |
                <button
                  style={{
                    color: ActiveTab === "AdmissionPurpose" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("AdmissionPurpose")}
                >
                  Admission Purpose
                </button>
               
                |

                <div className="Lab_dropdown">
                  <button
                    style={{
                      color: [
                        "BedTransferRequest",
                        "BedTransferRecieve",
                        "Service_request",
                        "IP_ReferAndInchargeDoctor",
                      ].includes(ActiveTab)
                        ? "white"
                        : "",
                    }}
                    className="Lab_button"
                  >
                    Request
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color:
                          ActiveTab === "BedTransferRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("BedTransferRequest")}
                    >
                      BT Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "BedTransferRecieve" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("BedTransferRecieve")}
                    >
                      BT Recieve / cancel
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "Service_request" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Service_request")}
                    >
                      Service Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_ReferAndInchargeDoctor"
                            ? "Black"
                            : "",
                      }}
                      onClick={() =>
                        handleTabChange("IP_ReferAndInchargeDoctor")
                      }
                    >
                      ReferAndInchargeDoctor
                    </button>

                    <button
                      style={{
                        color: ActiveTab === "Consultation" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Consultation")}
                    >
                      Consultation
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "RadiologyTest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("RadiologyTest")}
                    >
                      Radiology
                    </button>
                    <button
                      style={{ color: ActiveTab === "LabTest" ? "white" : "" }}
                      onClick={() => handleTabChange("LabTest")}
                    >
                      Lab
                    </button>

                    {/* <button style={{ color: ActiveTab === "RadiologyTest" ? 'white' : '' }} onClick={() => handleTabChange("RadiologyTest")}>
                      Radiology
                    </button>
                    <button style={{ color: ActiveTab === "LabTest" ? 'white' : '' }} onClick={() => handleTabChange("LabTest")}>
                      Lab
                    </button> */}
                    <button
                      style={{
                        color: ActiveTab === "OtRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("OtRequest")}
                    >
                      OT Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_NurseDrugRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("IP_NurseDrugRequest")}
                    >
                      Drug Request
                    </button>

                      <button
                      style={{
                        color:
                          ActiveTab === "Drug_Flow_Chart" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Drug_Flow_Chart")}
                    >

                    
                    Drug Flow Chart
                    </button>

                    {/* <button style={{ color: ActiveTab === "DrugRequest" ? 'white' : '' }} onClick={() => handleTabChange("DrugRequest")}>
                      Drug Request
                    </button> */}
                    <button
                      style={{
                        color: ActiveTab === "LeninRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("LeninRequest")}
                    >
                      Lenin Request
                    </button>
                  </div>
                </div>
                |

                <button
                  style={{
                    color: ActiveTab === "IpDrugAdminister" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IpDrugAdminister")}
                >
                  DrugAdministration
                </button>
                 |

                <button
                  style={{
                    color: ActiveTab === "Therapy" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("Therapy")}
                >
                  Therapy
                </button>
|  
 <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "IP_VentilatorSettings" ||
                        ActiveTab === "IP_BloodLines" ||
                        ActiveTab === "IP_UrinaryCathetor" ||
                        ActiveTab === "IP_BloodTransfusedRecord" ||
                        ActiveTab === "IP_DrainageTubes"
                          ? "white"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    IPM
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_VentilatorSettings")}
                    >
                      VentilatorSettings
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_BloodLines" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BloodLines")}
                    >
                      BloodLines
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_UrinaryCathetor")}
                    >
                      UrinaryCathetor
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BloodTransfusedRecord"
                            ? "Black"
                            : "",
                      }}
                      onClick={() =>
                        handleTabChange("IP_BloodTransfusedRecord")
                      }
                    >
                      BloodTransfusedRecord
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DrainageTubes")}
                    >
                      DrainageTubes
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_SurgicalSite")}
                    >
                      SurgicalSite
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BedsoreManagement")}
                    >
                      BedsoreManagement
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_PatientCare" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_PatientCare")}
                    >
                      PatientCare
                    </button>
                  </div>
                </div>

|

<button
                  style={{
                    color: ActiveTab === "IP_ConsentForms" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_ConsentForms")}
                >
                  IP_ConsentForms
                </button>
                |


                <button
                  style={{
                    color:
                      ActiveTab === "IP_NursePreoperativeChecklist"
                        ? "white"
                        : "",
                  }}
                  onClick={() =>
                    handleTabChange("IP_NursePreoperativeChecklist")
                  }
                >
                  IP_NursePreoperativeChecklist
                </button>
                |

                <button
                  style={{
                    color: ActiveTab === "IP_NursePreOPIns" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NursePreOPIns")}
                >
                  IP_NursePreOPIns
                </button>
                |
              
              
             
                {/* |
                <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "IP_VentilatorSettings" ||
                        ActiveTab === "IP_BloodLines" ||
                        ActiveTab === "IP_UrinaryCathetor" ||
                        ActiveTab === "IP_BloodTransfusedRecord" ||
                        ActiveTab === "IP_DrainageTubes"
                          ? "white"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    IPM
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_VentilatorSettings")}
                    >
                      VentilatorSettings
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_BloodLines" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BloodLines")}
                    >
                      BloodLines
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_UrinaryCathetor")}
                    >
                      UrinaryCathetor
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BloodTransfusedRecord"
                            ? "Black"
                            : "",
                      }}
                      onClick={() =>
                        handleTabChange("IP_BloodTransfusedRecord")
                      }
                    >
                      BloodTransfusedRecord
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DrainageTubes")}
                    >
                      DrainageTubes
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_SurgicalSite")}
                    >
                      SurgicalSite
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BedsoreManagement")}
                    >
                      BedsoreManagement
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_PatientCare" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_PatientCare")}
                    >
                      PatientCare
                    </button>
                  </div>
                </div> */}
                
             
                {/* |
                <div className="Lab_dropdown">
                  <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'white' : '' }} className="Lab_button">Service Request</button>
                  <div className="Lab_dropdown_content">
                    <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'Black' : '' }} onClick={() => handleTabChange("IP_ReferAndInchargeDoctor")}>
                    ReferAndInchargeDoctor
                    </button>
                    
                    
                  </div>
                </div> */}


<button
                  style={{
                    color:
                      ActiveTab === "IP_NurseSurgicalHistory" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseSurgicalHistory")}
                >
                  Surgical History
                </button>
                
                

                |
                <button
                  style={{ color: ActiveTab === "IP_NurseMlc" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_NurseMlc")}
                >
                  MLC
                </button>

                |
                <button
                  style={{ color: ActiveTab === "IP_CaseSheet" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_CaseSheet")}
                >
                  Case Sheet
                </button>
                |
                  <button
                  style={{ color: ActiveTab === "IPNURSEEMR" ? "white" : "" }}
                  onClick={() => handleTabChange("IPNURSEEMR")}
                >
                 IP NURSE EMR
                </button>
                |


                <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "IP_Nurse_DAMA" ||
                        ActiveTab === "DischargeRequest" ||
                        ActiveTab === "IP_DischargeSummary" ||
                        ActiveTab === "IP_DischargeStatus" ||
                        ActiveTab === "DischargeChecklist" ||
                        ActiveTab === "PhysicalDischarge" ||
                        ActiveTab === "DischargeCancel" ||
                        ActiveTab === "DisChargeClearance"
                          ? "White"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    Discharge
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color: ActiveTab === "IP_Nurse_DAMA" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_Nurse_DAMA")}
                    >
                      DAMA
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "DischargeRequest" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeRequest")}
                    >
                      Discharge Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_DischargeSummary" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DischargeSummary")}
                    >
                      Discharge Summary
                    </button>

                    <button
                      style={{
                        color:
                          ActiveTab === "IP_DischargeStatus" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DischargeStatus")}
                    >
                      DischargeStatus
                    </button>
                   
                    {/* <button
                      style={{
                        color:
                          ActiveTab === "DischargeChecklist" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeChecklist")}
                    >
                      Discharge Checklist
                    </button>
                   
                    <button
                      style={{
                        color: ActiveTab === "PhysicalDischarge" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("PhysicalDischarge")}
                    >
                      Physical Discharge
                    </button> */}

                    <button
                      style={{
                        color: ActiveTab === "DischargeCancel" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeCancel")}
                    >
                      Discharge Cancel
                    </button>
                    
                    {/* <button
                      style={{
                        color:
                          ActiveTab === "DisChargeClearance" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DisChargeClearance")}
                    >
                      Discharge Clearance
                    </button> */}

                  </div>
                </div>
              </h2>
            </div>

            <div className="new-kit ">
              <button className="new-tog" onClick={toggle}>
                {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
              </button>

              <div>
                {isToggled && (

                    <div className="new-navigation-toggle">
                      
              <h2>
                <button
                  style={{
                    color: ActiveTab === "IP_NurseVitals" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseVitals")}
                >
                  Vitals
                </button>
                |
                <button
                  style={{
                    color: ActiveTab === "IP_NurseAllergy" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseAllergy")}
                >
                  Allergy
                </button>
                |
                {IP_DoctorWorkbenchNavigation?.RequestType === 'Casuality' && (
                  <>
                    <button
                      style={{
                        color: ActiveTab === "PatientTimeEntry" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("PatientTimeEntry")}
                    >
                      PatientTimeEntry
                    </button>
                    |
                    <button
                      style={{
                        color: ActiveTab === "EmgToIpconnect" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("EmgToIpconnect")}
                    >
                      EmgToIpconnect
                    </button>
                    |
                    <button
                      style={{
                        color: ActiveTab === "TreatmentsForms" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("TreatmentsForms")}
                    >
                      TreatmentsForms
                    </button>
                    |  
                  </>
                  
                )}
                
             
                <button
                  style={{
                    color: ActiveTab === "IP_NurseAssesment" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseAssesment")}
                >
                  Assesment
                </button>
                |
                <button
                  style={{
                    color:
                      ActiveTab === "IP_NurseInputOutputChart" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseInputOutputChart")}
                >
                  Input Output Chart
                </button>
                |
                <button
                  style={{
                    color: ActiveTab === "IP_NurseProgressNotes" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseProgressNotes")}
                >
                  Nursing Notes
                </button>
               
                |
                <button
                  style={{
                    color: ActiveTab === "AdmissionPurpose" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("AdmissionPurpose")}
                >
                  Admission Purpose
                </button>
               
                |

                <div className="Lab_dropdown">
                  <button
                    style={{
                      color: [
                        "BedTransferRequest",
                        "BedTransferRecieve",
                        "Service_request",
                        "IP_ReferAndInchargeDoctor",
                      ].includes(ActiveTab)
                        ? "white"
                        : "",
                    }}
                    className="Lab_button"
                  >
                    Request
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color:
                          ActiveTab === "BedTransferRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("BedTransferRequest")}
                    >
                      BT Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "BedTransferRecieve" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("BedTransferRecieve")}
                    >
                      BT Recieve / cancel
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "Service_request" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Service_request")}
                    >
                      Service Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_ReferAndInchargeDoctor"
                            ? "Black"
                            : "",
                      }}
                      onClick={() =>
                        handleTabChange("IP_ReferAndInchargeDoctor")
                      }
                    >
                      ReferAndInchargeDoctor
                    </button>

                    <button
                      style={{
                        color: ActiveTab === "Consultation" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Consultation")}
                    >
                      Consultation
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "RadiologyTest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("RadiologyTest")}
                    >
                      Radiology
                    </button>
                    <button
                      style={{ color: ActiveTab === "LabTest" ? "white" : "" }}
                      onClick={() => handleTabChange("LabTest")}
                    >
                      Lab
                    </button>

                    {/* <button style={{ color: ActiveTab === "RadiologyTest" ? 'white' : '' }} onClick={() => handleTabChange("RadiologyTest")}>
                      Radiology
                    </button>
                    <button style={{ color: ActiveTab === "LabTest" ? 'white' : '' }} onClick={() => handleTabChange("LabTest")}>
                      Lab
                    </button> */}
                    <button
                      style={{
                        color: ActiveTab === "OtRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("OtRequest")}
                    >
                      OT Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_NurseDrugRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("IP_NurseDrugRequest")}
                    >
                      Drug Request
                    </button>
 <button
                      style={{
                        color:
                          ActiveTab === "Drug_Flow_Chart" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Drug_Flow_Chart")}
                    >

                    
                    Drug Flow Chart
                    </button>
                    {/* <button style={{ color: ActiveTab === "DrugRequest" ? 'white' : '' }} onClick={() => handleTabChange("DrugRequest")}>
                      Drug Request
                    </button> */}
                    <button
                      style={{
                        color: ActiveTab === "LeninRequest" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("LeninRequest")}
                    >
                      Lenin Request
                    </button>
                  </div>
                </div>
                |

                <button
                  style={{
                    color: ActiveTab === "IpDrugAdminister" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IpDrugAdminister")}
                >
                  DrugAdministration
                </button>
                 |

                <button
                  style={{
                    color: ActiveTab === "Therapy" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("Therapy")}
                >
                  Therapy
                </button>
|  
 <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "IP_VentilatorSettings" ||
                        ActiveTab === "IP_BloodLines" ||
                        ActiveTab === "IP_UrinaryCathetor" ||
                        ActiveTab === "IP_BloodTransfusedRecord" ||
                        ActiveTab === "IP_DrainageTubes"
                          ? "white"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    IPM
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_VentilatorSettings")}
                    >
                      VentilatorSettings
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_BloodLines" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BloodLines")}
                    >
                      BloodLines
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_UrinaryCathetor")}
                    >
                      UrinaryCathetor
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BloodTransfusedRecord"
                            ? "Black"
                            : "",
                      }}
                      onClick={() =>
                        handleTabChange("IP_BloodTransfusedRecord")
                      }
                    >
                      BloodTransfusedRecord
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DrainageTubes")}
                    >
                      DrainageTubes
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_SurgicalSite")}
                    >
                      SurgicalSite
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BedsoreManagement")}
                    >
                      BedsoreManagement
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_PatientCare" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_PatientCare")}
                    >
                      PatientCare
                    </button>
                  </div>
                </div>

|

<button
                  style={{
                    color: ActiveTab === "IP_ConsentForms" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_ConsentForms")}
                >
                  IP_ConsentForms
                </button>
                |


                <button
                  style={{
                    color:
                      ActiveTab === "IP_NursePreoperativeChecklist"
                        ? "white"
                        : "",
                  }}
                  onClick={() =>
                    handleTabChange("IP_NursePreoperativeChecklist")
                  }
                >
                  IP_NursePreoperativeChecklist
                </button>
                |

                <button
                  style={{
                    color: ActiveTab === "IP_NursePreOPIns" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NursePreOPIns")}
                >
                  IP_NursePreOPIns
                </button>
                |
              
              
             
                {/* |
                <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "IP_VentilatorSettings" ||
                        ActiveTab === "IP_BloodLines" ||
                        ActiveTab === "IP_UrinaryCathetor" ||
                        ActiveTab === "IP_BloodTransfusedRecord" ||
                        ActiveTab === "IP_DrainageTubes"
                          ? "white"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    IPM
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_VentilatorSettings" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_VentilatorSettings")}
                    >
                      VentilatorSettings
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_BloodLines" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BloodLines")}
                    >
                      BloodLines
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_UrinaryCathetor" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_UrinaryCathetor")}
                    >
                      UrinaryCathetor
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BloodTransfusedRecord"
                            ? "Black"
                            : "",
                      }}
                      onClick={() =>
                        handleTabChange("IP_BloodTransfusedRecord")
                      }
                    >
                      BloodTransfusedRecord
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_DrainageTubes" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DrainageTubes")}
                    >
                      DrainageTubes
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_SurgicalSite" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_SurgicalSite")}
                    >
                      SurgicalSite
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_BedsoreManagement" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_BedsoreManagement")}
                    >
                      BedsoreManagement
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "IP_PatientCare" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_PatientCare")}
                    >
                      PatientCare
                    </button>
                  </div>
                </div> */}
                
             
                {/* |
                <div className="Lab_dropdown">
                  <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'white' : '' }} className="Lab_button">Service Request</button>
                  <div className="Lab_dropdown_content">
                    <button style={{ color: ActiveTab === "IP_ReferAndInchargeDoctor" ? 'Black' : '' }} onClick={() => handleTabChange("IP_ReferAndInchargeDoctor")}>
                    ReferAndInchargeDoctor
                    </button>
                    
                    
                  </div>
                </div> */}


<button
                  style={{
                    color:
                      ActiveTab === "IP_NurseSurgicalHistory" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_NurseSurgicalHistory")}
                >
                  Surgical History
                </button>
                
                

                |
                <button
                  style={{ color: ActiveTab === "IP_NurseMlc" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_NurseMlc")}
                >
                  MLC
                </button>

                |
                <button
                  style={{ color: ActiveTab === "IP_CaseSheet" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_CaseSheet")}
                >
                  Case Sheet
                </button>
                |
  <button
                  style={{ color: ActiveTab === "IPNURSEEMR" ? "white" : "" }}
                  onClick={() => handleTabChange("IPNURSEEMR")}
                >
                  IP NURSE EMR
                </button>

                <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "IP_Nurse_DAMA" ||
                        ActiveTab === "DischargeRequest" ||
                        ActiveTab === "IP_DischargeSummary" ||
                        ActiveTab === "IP_DischargeStatus" ||
                        ActiveTab === "DischargeChecklist" ||
                        ActiveTab === "PhysicalDischarge" ||
                        ActiveTab === "DischargeCancel" ||
                        ActiveTab === "DisChargeClearance"
                          ? "White"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    Discharge
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{
                        color: ActiveTab === "IP_Nurse_DAMA" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_Nurse_DAMA")}
                    >
                      DAMA
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "DischargeRequest" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeRequest")}
                    >
                      Discharge Request
                    </button>
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_DischargeSummary" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DischargeSummary")}
                    >
                      Discharge Summary
                    </button>
                    
                    <button
                      style={{
                        color:
                          ActiveTab === "IP_DischargeStatus" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DischargeStatus")}
                    >
                      DischargeStatus
                    </button>
                  
                    {/* <button
                      style={{
                        color:
                          ActiveTab === "DischargeChecklist" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeChecklist")}
                    >
                      Discharge Checklist
                    </button>
                    
                    <button
                      style={{
                        color: ActiveTab === "PhysicalDischarge" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("PhysicalDischarge")}
                    >
                      Physical Discharge
                    </button> */}

                    <button
                      style={{
                        color: ActiveTab === "DischargeCancel" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeCancel")}
                    >
                      Discharge Cancel
                    </button>
                    
                    {/* <button
                      style={{
                        color:
                          ActiveTab === "DisChargeClearance" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DisChargeClearance")}
                    >
                      Discharge Clearance
                    </button> */}

                  </div>
                </div>
              </h2>
            </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {ActiveTab === "IP_NurseVitals" && <IP_NurseVitals />}
          {ActiveTab === "Pediortics" && <Pediortics />}
          {ActiveTab === "IP_NurseAllergy" && <IP_NurseAllergy onAllergySubmitSuccess={handleAllergyDataUpdate}/>}
          {ActiveTab === "PatientTimeEntry" && <PatientTimeEntry />}
          {ActiveTab === "TreatmentsForms" && <TreatmentsForms />}
          {ActiveTab === "EmgToIpconnect" && <EmgToIpconnect />}\
                  

          {ActiveTab === "IP_NurseSurgicalHistory" && (
            <IP_NurseSurgicalHistory />
          )}

          {ActiveTab === "IP_NurseAssesment" && <IP_NurseAssesment />}

          {ActiveTab === "IP_NurseInputOutputChart" && (
            <IP_NurseInputOutputChart />
          )}

          {ActiveTab === "IP_NurseProgressNotes" && <IP_NurseProgressNotes />}
          {ActiveTab === "AdmissionPurpose" && <AdmissionPurpose onAdmissionSubmitSuccess={handleAdmissionPurposeData}/>}

          {ActiveTab === "IP_NurseMlc" && <IP_NurseMlc />}
          {ActiveTab === "IP_CaseSheet" && <IP_CaseSheet />}
          {ActiveTab === "IPNURSEEMR" && <IPNURSEEMR />}

          {ActiveTab === "IP_Nurse_DAMA" && <IP_Nurse_DAMA />}

          {ActiveTab === "IP_NursePreoperativeChecklist" && (
            <IP_NursePreoperativeChecklist />
          )}

          {ActiveTab === "IP_NursePreOPIns" && <IP_NursePreOPIns />}
          {ActiveTab === "IP_ConsentForms" && <IP_ConsentForms />}
          {ActiveTab === "BedTransferRequest" && <BedTransferRequest />}
          {ActiveTab === "BedTransferRecieve" && <BedtransferRecieve />}
          {ActiveTab === "Service_request" && <ServiceProcedureRequest />}
          {ActiveTab === "IP_VentilatorSettings" && <IP_VentilatorSettings />}
          {ActiveTab === "IP_BloodLines" && <IP_BloodLines />}
          {ActiveTab === "IP_UrinaryCathetor" && <IP_UrinaryCathetor />}
          {ActiveTab === "IP_BloodTransfusedRecord" && (
            <IP_BloodTransfusedRecord />
          )}

          {ActiveTab === "IP_DrainageTubes" && <IP_DrainageTubes />}
          {ActiveTab === "IP_SurgicalSite" && <IP_SurgicalSite />}
          {ActiveTab === "IP_BedsoreManagement" && <IP_BedsoreManagement />}
          {ActiveTab === "IP_PatientCare" && <IP_PatientCare />}
          {ActiveTab === "IP_ReferAndInchargeDoctor" && (
            <IP_ReferAndInchargeDoctor />
          )}

          {ActiveTab === "DischargeRequest" && <DischargeRequest />}
          {ActiveTab === "IP_DischargeSummary" && <IP_DischargeSummary />}
          {ActiveTab === "IP_DischargeStatus" && <IP_DischargeStatus />}
          {ActiveTab === "DischargeChecklist" && <DischargeChecklist />}
          {ActiveTab === "DisChargeClearance" && <DisChargeClearance />}
          {ActiveTab === "PhysicalDischarge" && <PhysicalDischarge />}
          {ActiveTab === "DischargeCancel" && <DischargeCancel />}
          {ActiveTab === "LabTest" && <LabTest />}
          {ActiveTab === "RadiologyTest" && <RadiologyTest />}
          {ActiveTab === "Consultation" && <Consultation />}
          {ActiveTab === "IP_NurseDrugRequest" && <IP_NurseDrugRequest />}
          {ActiveTab === "Drug_Flow_Chart" && <Drug_Flow_Chart />}

          {ActiveTab === "MlcRegisterForm" && <MlcRegisterForm />}
          {ActiveTab === "IpDrugAdminister" && <IpDrugAdminister />}
          {ActiveTab === "Therapy" && <Therapy />}
          {ActiveTab === "OtRequest" && <Ip_ot_request />}
           
        </Suspense>
      </div>
    </>
  );
};

export default IP_NurseWorkbenchNavigation;
