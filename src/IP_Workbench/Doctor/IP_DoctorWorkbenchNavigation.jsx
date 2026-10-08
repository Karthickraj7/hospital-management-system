// import React, { useState, useEffect, lazy, Suspense } from "react";
// import "../../DoctorWorkBench/Navigation.css";
// // import "../Navigation.css";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import "../../DoctorWorkBench/TreatmentComponent.css";
// import axios from "axios";
// import bgImg2 from "../../Assets/bgImg2.jpg";
// import Neurology from "../../DoctorWorkBench/Neurology.jsx";
// import IFCard from "../../DoctorWorkBench/IFCard.jsx";
// import Gynecology from "../../DoctorWorkBench/Gynecology.jsx";
// import AncCard from "../../DoctorWorkBench/ANCCard.jsx";
// import OP_Sheet from "../../DoctorWorkBench/OP_Sheet.jsx";
// import Opthalmology from "../../DoctorWorkBench/Opthalmology.jsx";


// const IPDOCTOREMR = lazy(()=>import("./IPDOCTOREMR.jsx"));
// const LabTest = lazy(() => import("./LabTest.jsx"));
// const RadiologyTest = lazy(() => import("./RadiologyTest.jsx"));
// const Therapy = lazy(() => import("./TherapyRequestForIP.jsx"));

// const IP_Vitals = lazy(() => import("./IP_Vitals.jsx"));
// const GeneralEvaluation = lazy(() => import("../../DoctorWorkBench/GeneralEvaluation.jsx"));

// const IP_SurgicalHistory = lazy(() => import("./IP_SurgicalHistory.jsx"));
// const IP_Assesment = lazy(() => import("./IP_Assesment.jsx"));
// const IP_InputOutputChart = lazy(() => import("./IP_InputOutputChart.jsx"));
// const IP_ProgressNotes = lazy(() => import("./IP_ProgressNotes.jsx"));
// const IP_DocMlc = lazy(() => import("./IP_DocMlc.jsx"));
// const IP_Doc_DAMA = lazy(() => import("./IP_Doc_DAMA.jsx"));
// const IP_Doc_PreoperativeChecklist = lazy(() =>
//   import("./IP_Doc_PreoperativeChecklist.jsx")
// );
// const IP_DoctorPrescribtion = lazy(() => import("./Ip_DoctorPrescribtion.jsx"));
// const NewProcedure = lazy(() => import("./NewProcedure.js"));

// const IP_DoctorWorkbenchNavigation = () => {
//   const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
//   const UserData = useSelector((state) => state.userRecord?.UserData);

//   console.log(IP_DoctorWorkbenchNavigation);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const AllergyDetails = useSelector(state => state.Frontoffice?.AllergyDetails);

//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const [ActiveTab, setActiveTab] = useState("IP_Vitals");
//   const [isToggled, setIsToggled] = useState(false);
//   const [AdmissionDetails, setAdmissionDetails] = useState([]);
//   const [CurrentPreviousRoom, setCurrentPreviousRoom] = useState(null);
//   const [Assesment, setAssesment] = useState([]);
//   const [AllergyData, setAllergyData] = useState([]);
//   const [ShowAllergyData, setShowAllergyData] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const [openModal, setOpenModal] = useState(false);
//   const [SpecialityData, setSpecialityData] = useState([]);
  
//   const [specialityName, setSpecialityName] = useState(null);
//   const [DocWiseSpeciality, setDocWiseSpeciality] = useState(null);
//   const [isHost, setIsHost] = useState(false);

//     const [Complaint, setComplaint] = useState('');
//     const [DocComplaint, setDocComplaint] = useState('');
  
//   console.log(isHost, "isHost");
//   console.log(specialityName, "specialityName");
//   console.log(DocWiseSpeciality, "DocWiseSpeciality");

//   console.log(Complaint,'Complaint',DocComplaint,'DocComplaint')


//   const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

//   const handleEditClick = () => {
//     setOpenModal(true);
//   };


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
//       navigate("/Home/IP_WorkbenchQuelist");
//     }
//     // else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
//     //   navigate('/Home/CasualityDocQuelist')
//     // }
//   }, [IP_DoctorWorkbenchNavigation]);

// useEffect(() => {
//   if (AllergyData.length > 0) {
//       dispatchvalue({ type: "AllergyDetails", value: AllergyData });
//       console.log({ type: "AllergyDetails", value: AllergyData }, 'Dispatching AllergyDetails');
//   }
// }, [AllergyData]); // This will run whenever gridData changes

// //----------FOR SPECIALITY FORMS------------------------
//  useEffect(() => {
//     axios
//       .get(`${UrlLink}Masters/Speciality_Detials_link`)
//       .then((res) => {
//         const ress = res.data;
//         setSpecialityData(ress);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [UrlLink]);

//   const [shouldShowForms, setShouldShowForms] = useState(true);
//   const allowedSpecialities = ["NEUROLOGY", "GYNECOLOGY", "OPTHALMOLOGY", "OBST&GYNECOLOGY"];
  

//   useEffect(() => {
//   const isSpecialityAllowed = isHost && (allowedSpecialities.includes(DocWiseSpeciality) || allowedSpecialities.includes(specialityName));
  
//   let shouldShow = isSpecialityAllowed;
//   if (DocWiseSpeciality === "OBST&GYNECOLOGY" || specialityName === "OBST&GYNECOLOGY") {
//     shouldShow = isSpecialityAllowed && (Complaint === "GYNECOLOGY" || DocComplaint === "GYNECOLOGY");
//   }

//   setShouldShowForms(shouldShow);
// }, [isHost, DocWiseSpeciality, specialityName, Complaint, DocComplaint]);
  

// useEffect(() => {
//     console.log("1222222222------");

//     let SpecData = null;
//     let DocSpecWise = null;

//     if (UserData?.username === "host" || UserData?.username === "admin") {
//       setIsHost(true); // Set isHost to true if the user is 'host'

//       // Get SpecData based on IP_DoctorWorkbenchNavigation
//       if (IP_DoctorWorkbenchNavigation?.Specialization) {
//         SpecData = SpecialityData?.find(
//           (p) => p?.Speciality_Id === IP_DoctorWorkbenchNavigation?.Specialization
//         );
//         console.log(SpecData, "SpecData");
//         console.log(SpecData?.Speciality_Id, "SpecData?.Speciality_Id");
//         console.log(
//           IP_DoctorWorkbenchNavigation?.Specialization,
//           "IP_DoctorWorkbenchNavigation?.Specialization"
//         );

//         if (SpecData) {
//           setSpecialityName(SpecData?.SpecialityName);
//           console.log("matching patient", SpecData?.SpecialityName);
//           setDocWiseSpeciality(null);

//           setComplaint(IP_DoctorWorkbenchNavigation?.Complaint);
//           setDocComplaint('');
//         } else {
//           setSpecialityName(null);
//         }
//       }

//       console.log('rrrrr--------1');
      

//       // // Get DocSpecWise based on SpecialityWise_DoctorWorkbenchNavigation
//       // if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
//       //   DocSpecWise = SpecialityData?.find(
//       //     (p) =>
//       //       p?.Speciality_Id ===
//       //       SpecialityWise_DoctorWorkbenchNavigation?.Specialization
//       //   );
//       //   console.log(DocSpecWise, "11----DocSpecWise");
//       //   console.log(DocSpecWise?.Speciality_Id, "11-----DocSpecWise?.Speciality_Id");
//       //   console.log(
//       //     SpecialityWise_DoctorWorkbenchNavigation?.Specialization,
//       //     "11-----SpecialityWise_DoctorWorkbenchNavigation?.Specialization"
//       //   );

//       //   if (DocSpecWise) {
//       //     setDocWiseSpeciality(DocSpecWise?.SpecialityName);
//       //     console.log("matching speciality", DocSpecWise?.SpecialityName);
//       //     setSpecialityName(null);
//       //   } else {
//       //     setDocWiseSpeciality(null);
//       //   }
//       // }
//       // console.log('rrrrr--------2');

//     } else {
//       setIsHost(false); // Reset isHost if not 'host'
//       console.log("133333333333333------");

//       // Get SpecData based on IP_DoctorWorkbenchNavigation
//       if (IP_DoctorWorkbenchNavigation?.Specialization) {
//         const SpecData = SpecialityData?.find(
//           (p) => p?.Speciality_Id === IP_DoctorWorkbenchNavigation?.Specialization
//         );
//         console.log(SpecData, "SpecData");
//         console.log(SpecData?.Speciality_Id, "SpecData?.Speciality_Id");
//         console.log(UserData?.Specialization, "UserData?.Specialization");
//         console.log(
//           IP_DoctorWorkbenchNavigation?.Specialization,
//           "IP_DoctorWorkbenchNavigation?.Specialization"
//         );

//         const PatientSpeciality =
//           UserData?.Specialization &&
//           IP_DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;
//         console.log("PatientSpeciality", PatientSpeciality);

//         setSpecialityName(null);
//         if (PatientSpeciality) {
//           console.log("pppppppp");

//           setSpecialityName(SpecData?.SpecialityName);
//           console.log("matching totalpatient");

//           setDocWiseSpeciality(null);

//           setComplaint(IP_DoctorWorkbenchNavigation?.Complaint);
//           setDocComplaint('');
//         } else {
//           setSpecialityName(null); // Reset if no match
//         }
//       }

//       // if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
//       //   DocSpecWise = SpecialityData?.find(
//       //     (p) =>
//       //       p?.Speciality_Id ===
//       //       SpecialityWise_DoctorWorkbenchNavigation?.Specialization
//       //   );
//       //   console.log(DocSpecWise, "DocSpecWise");
//       //   console.log(DocSpecWise?.Speciality_Id, "DocSpecWise?.Speciality_Id");
//       //   console.log(UserData?.Specialization, "UserData?.Specialization");
//       //   console.log(
//       //     SpecialityWise_DoctorWorkbenchNavigation?.Specialization,
//       //     "SpecialityWise_DoctorWorkbenchNavigation?.Specialization"
//       //   );

//       //   const DocPatientSpeciality =
//       //     UserData?.Specialization &&
//       //     SpecialityWise_DoctorWorkbenchNavigation?.Specialization ===
//       //       DocSpecWise?.Speciality_Id;

//       //   console.log("DocPatientSpeciality", DocPatientSpeciality);
//       //   console.log("DocSpecWise?.SpecialityName", DocSpecWise?.SpecialityName);

//       //   setDocWiseSpeciality(null);

//       //   if (DocPatientSpeciality) {
//       //     console.log("4444444444444");

//       //     setDocWiseSpeciality(DocSpecWise?.SpecialityName);
//       //     console.log("matching specialitywise ");

//       //     setSpecialityName(null);
//       //   } else {
//       //     setDocWiseSpeciality(null); // Reset if no match
//       //   }
//       // }

      
//     }
//   }, [
//     UserData,
//     IP_DoctorWorkbenchNavigation,
//     SpecialityData,
//     // SpecialityWise_DoctorWorkbenchNavigation,
//   ]);

// //----------FOR SPECIALITY FORMS------------------------

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
//     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
//     const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

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


//   useEffect(() => {
//     if (AllergyData.length > 0) {
//       setShowAllergyData(true);
//       dispatchvalue({ type: "AllergyDetails", value: AllergyData });
//       console.log({ type: "AllergyDetails", value: AllergyData }, 'Dispatching AllergyDetails');

      
//     }
//   }, [AllergyData,ShowAllergyData]); // This will run whenever gridData changes


//   // useEffect(() => {
//   //   if (Object.keys(IP_DoctorWorkbenchNavigation).length === 0 && Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
//   //     navigate('/Home/IP_WorkbenchQuelist');
//   //   } else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
//   //     navigate('/Home/CasualityDocQuelist');
//   //   }
//   // }, [IP_DoctorWorkbenchNavigation, Casuality_DoctorWorkbenchNavigation]);

//   return (
//     <>
//       <div className="Main_container_app">
//         <div className="new-patient-registration-form">
//           <div className="dctr_info_up_head">
//             <div className="RegisFormcon ">
//               <div className="dctr_info_up_head22">
//                 <img
//                   src={bgImg2}
//                   // src={IP_DoctorWorkbenchNavigation?.PatientProfile}
//                   alt="Default Patient Photo"
//                 />

//                 <label>Profile</label>
//               </div>
//             </div>

//             <div className="RegisFormcon_1">
//               <div className="RegisForm_1 dctr_wrbvh_pice666">
//                 <label htmlFor="PatientID">
//                   Patient ID <span>:</span>
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientID">
//                   {IP_DoctorWorkbenchNavigation?.PatientId}
//                 </span>
//               </div>
//               <div className="RegisForm_1 dctr_wrbvh_pice666">
//                 <label htmlFor="PatientName">
//                   Patient Name <span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientName">
//                   {IP_DoctorWorkbenchNavigation?.PatientName}
//                 </span>
//               </div>

//               <div className="RegisForm_1 dctr_wrbvh_pice666">
//                 <label htmlFor="AgeGender">
//                   Age / Gender <span>:</span>{" "}
//                 </label>
//                 <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Age">
//                   {IP_DoctorWorkbenchNavigation?.Age} /{" "}
//                   {IP_DoctorWorkbenchNavigation?.Gender}
//                 </span>
//               </div>


             
//               {IP_DoctorWorkbenchNavigation?.BloodGroup && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666">
//                   <label htmlFor="Gender">
//                     Blood Group <span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Gender">
//                     {IP_DoctorWorkbenchNavigation?.BloodGroup}
//                   </span>
//                 </div>
//               )}
              

//               <div className="RegisForm_1 dctr_wrbvh_pice666">
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

              
//               {AdmissionDetails.length > 0 && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666">
//                   <label htmlFor="AdmissionPurpose">
//                     POA<span>:</span>{" "}
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmissionPurpose">
//                     {AdmissionDetails?.[0]?.AdmissionPurpose}
//                   </span>
//                 </div>
//               )}


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
//                 <div className="RegisForm_1 dctr_wrbvh_pice666">
//                   <label htmlFor="IsMLC">
//                     MLC<span>:</span>
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="IsMLC">
//                     {IP_DoctorWorkbenchNavigation?.IsMLC}
//                   </span>
//                 </div>
//               )}
              


//               {Assesment.length > 0 && (
//                 <div className="RegisForm_1 dctr_wrbvh_pice666">
//                   <label htmlFor="FinalDiagnosis">
//                     FinalDiagnosis<span>:</span>
//                   </label>
//                   <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="FinalDiagnosis">
//                     {Assesment?.[0]?.FinalDiagnosis}
//                   </span>
//                 </div>
//               )}

//               {ShowAllergyData && (
//                 <div className="RegisFormcon_j">
//                   {/* Only render Allergy button and modal if there is allergy data */}
//                   {AllergyDetails?.length > 0 && (
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
//                                 {AllergyDetails.map(
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
              








//             </div>
//           </div>

//           <div className="new-patient-registration-form">
//             <div className="new-navigation">
//               <h2>
//                 <button
//                   style={{ color: ActiveTab === "IP_Vitals" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_Vitals")}
//                 >
//                   Vitals
//                 </button>
//                 |
//                 {/* <button style={{ color: ActiveTab === "IP_MedicalHistory" ? 'white' : '' }} onClick={() => handleTabChange("IP_MedicalHistory")}>
//                 MedicalHistory
//                 </button>
//                 | */}
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_SurgicalHistory" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_SurgicalHistory")}
//                 >
//                   Surgical History
//                 </button>
//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_Assesment" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_Assesment")}
//                 >
//                   Assesment
//                 </button>
//                 {/* |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_InputOutputChart" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_InputOutputChart")}
//                 >
//                   Input Output Chart
//                 </button> */}
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_ProgressNotes" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_ProgressNotes")}
//                 >
//                   ProgressNotes
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "GeneralEvaluation" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("GeneralEvaluation")}
//                 >
//                   GeneralEvaluation
//                 </button>
//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_DocMlc" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_DocMlc")}
//                 >
//                   MLC
//                 </button>
//                 |
//                 <button
//                   style={{ color: ActiveTab === "IP_Doc_DAMA" ? "white" : "" }}
//                   onClick={() => handleTabChange("IP_Doc_DAMA")}
//                 >
//                   DAMA
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color:
//                       ActiveTab === "IP_Doc_PreoperativeChecklist"
//                         ? "white"
//                         : "",
//                   }}
//                   onClick={() =>
//                     handleTabChange("IP_Doc_PreoperativeChecklist")
//                   }
//                 >
//                   PreoperativeChecklist
//                 </button>
//                 |
//                 <div className="Lab_dropdown">
//                   <button
//                     style={{
//                       color:
//                         ActiveTab === "Lab_Test" ||
//                           ActiveTab === "Radiology_Test"
//                           ? "white"
//                           : "",
//                     }}
//                     className="Lab_button"
//                   >
//                     Diagnostics
//                   </button>
//                   <div className="Lab_dropdown_content">
//                     <button
//                       style={{ color: ActiveTab === "Lab_Test" ? "white" : "" }}
//                       onClick={() => handleTabChange("Lab_Test")}
//                     >
//                       Lab
//                     </button>
//                     <button
//                       style={{
//                         color: ActiveTab === "Radiology_Test" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Radiology_Test")}
//                     >
//                       Radiology
//                     </button>
                    
//                   </div>
//                 </div>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "IP_DoctorPrescribtion" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IP_DoctorPrescribtion")}
//                 >
//                   Prescription
//                 </button>
//                 |
//                 <button
//                   style={{
//                     color: ActiveTab === "Therapy" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("Therapy")}
//                 >
//                   Therapy
//                 </button>
//                  |
//                 <button
//                   style={{
//                     color: ActiveTab === "IPDOCTOREMR" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IPDOCTOREMR")}
//                 >
//                   IP DOCTOR EMR
//                 </button>
                
//                 {shouldShowForms && (
//                   <>
//                     <div className="Lab_dropdown">
//                       |
//                       <button
//                         style={{
//                           color:
//                             ActiveTab === "Neurology" ||
//                             ActiveTab === "Gynecology" ||
//                             ActiveTab === "AncCard" ||
//                             ActiveTab === "Opthalmology" ||
//                             ActiveTab === "IFCard"
//                               ? "white"
//                               : "",
//                         }}
//                         className="Lab_button"
//                       >
//                         Forms
//                       </button>
//                       <div className="Lab_dropdown_content">
//                         <>
//                           {/* Neurology */}
//                           {(DocWiseSpeciality === "NEUROLOGY" || specialityName === "NEUROLOGY") && (
//                             <>
//                               <button
//                                 style={{ color: ActiveTab === "Neurology" ? "white" : "" }}
//                                 onClick={() => handleTabChange("Neurology")}
//                               >
//                                 Neurology Form
//                               </button>

//                               <button
//                                 style={{ color: ActiveTab === "OP_Sheet" ? "white" : "" }}
//                                 onClick={() => handleTabChange("OP_Sheet")}
//                               >
//                                 Neuro Surgery
//                               </button>
//                             </>
//                           )}

//                           {/* Opthalmology */}
//                           {(DocWiseSpeciality === "OPTHALMOLOGY" || specialityName === "OPTHALMOLOGY") && (
//                             <button
//                               style={{ color: ActiveTab === "Opthalmology" ? "white" : "" }}
//                               onClick={() => handleTabChange("Opthalmology")}
//                             >
//                               Opthalmology
//                             </button>
//                           )}

//                           {/* Gynecology */}
//                           {(DocComplaint === "GYNECOLOGY" || Complaint === "GYNECOLOGY" || DocWiseSpeciality === "GYNECOLOGY" || specialityName === "GYNECOLOGY") && (
//                             <>
//                               <button
//                                 style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
//                                 onClick={() => handleTabChange("IFCard")}
//                               >
//                                 IFCard
//                               </button>

//                               <button
//                                 style={{ color: ActiveTab === "Gynecology" ? "white" : "" }}
//                                 onClick={() => handleTabChange("Gynecology")}
//                               >
//                                 Gynecology
//                               </button>

//                               <button
//                                 style={{ color: ActiveTab === "AncCard" ? "white" : "" }}
//                                 onClick={() => handleTabChange("AncCard")}
//                               >
//                                 ANCCard
//                               </button>
//                             </>
//                           )}
//                         </>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {!isHost && 
//                   (specialityName === "OPTHALMOLOGY" ||
//                   DocWiseSpeciality === "OPTHALMOLOGY") && (
//                     <>
//                     |
//                       <button
//                         style={{
//                           color: ActiveTab === "Opthalmology" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("Opthalmology")}
//                       >
//                         Opthalmology
//                       </button>
//                       |
//                     </>
//                 )}
//                 {!isHost &&
//                   (specialityName === "NEUROLOGY" ||
//                   DocWiseSpeciality === "NEUROLOGY") && (
//                   <>
//                   |
//                     <button
//                       style={{
//                         color: ActiveTab === "Neurology" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Neurology")}
//                     >
//                       Neurology Form
//                     </button>
//                     |
//                     <button
//                       style={{
//                         color: ActiveTab === "OP_Sheet" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("OP_Sheet")}
//                     >
//                       Neuro Surgery
//                     </button>
//                     |
//                   </>
//                 )}
//                 {!isHost &&
//                   (Complaint === "GYNECOLOGY" ||
//                   DocComplaint === "GYNECOLOGY" || specialityName === "GYNECOLOGY" ||
//                   DocWiseSpeciality === "GYNECOLOGY") && (
//                   <>
//                   |
//                     <button
//                       style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
//                       onClick={() => handleTabChange("IFCard")}
//                     >
//                       IFCard
//                     </button>
//                     |
//                     <button
//                       style={{
//                         color: ActiveTab === "Gynecology" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("Gynecology")}
//                     >
//                       Gynecology
//                     </button>
//                     |
//                     <button
//                       style={{
//                         color: ActiveTab === "AncCard" ? "white" : "",
//                       }}
//                       onClick={() => handleTabChange("AncCard")}
//                     >
//                       ANCCard
//                     </button>
//                     |
//                   </>
//                 )}
//                 |
//               </h2>
//             </div>

//             <div className="new-kit ">
//               <button className="new-tog" onClick={toggle}>
//                 {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
//               </button>

//               <div>
//                 {isToggled && (
//                   <div className="new-navigation-toggle">
//                     <h2>
//                       <button
//                         style={{
//                           color: ActiveTab === "IP_Vitals" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_Vitals")}
//                       >
//                         Vitals
//                       </button>
//                       |
//                       {/* <button style={{ color: ActiveTab === "IP_MedicalHistory" ? 'white' : '' }} onClick={() => handleTabChange("IP_MedicalHistory")}>
//                       MedicalHistory
//                       </button>
//                       | */}
//                       <button
//                         style={{
//                           color:
//                             ActiveTab === "IP_SurgicalHistory" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_SurgicalHistory")}
//                       >
//                         Surgical History
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color: ActiveTab === "IP_Assesment" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_Assesment")}
//                       >
//                         Assesment
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color:
//                             ActiveTab === "IP_InputOutputChart" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_InputOutputChart")}
//                       >
//                         Input Output Chart
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color:
//                             ActiveTab === "IP_ProgressNotes" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_ProgressNotes")}
//                       >
//                         ProgressNotes
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color: ActiveTab === "GeneralEvaluation" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("GeneralEvaluation")}
//                       >
//                         GeneralEvaluation
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color: ActiveTab === "IP_DocMlc" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_DocMlc")}
//                       >
//                         MLC
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color: ActiveTab === "IP_Doc_DAMA" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("IP_Doc_DAMA")}
//                       >
//                         DAMA
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color:
//                             ActiveTab === "IP_Doc_PreoperativeChecklist"
//                               ? "white"
//                               : "",
//                         }}
//                         onClick={() =>
//                           handleTabChange("IP_Doc_PreoperativeChecklist")
//                         }
//                       >
//                         PreoperativeChecklist
//                       </button>
//                       |
//                       <div className="Lab_dropdown">
//                         <button
//                           style={{
//                             color:
//                               ActiveTab === "Lab_Test" ||
//                                 ActiveTab === "Radiology_Test"
//                                 ? "white"
//                                 : "",
//                           }}
//                           className="Lab_button"
//                         >
//                           Diagnostics
//                         </button>
//                         <div className="Lab_dropdown_content">
//                           <button
//                             style={{
//                               color: ActiveTab === "Lab_Test" ? "white" : "",
//                             }}
//                             onClick={() => handleTabChange("Lab_Test")}
//                           >
//                             Lab
//                           </button>
//                           <button
//                             style={{
//                               color:
//                                 ActiveTab === "Radiology_Test" ? "white" : "",
//                             }}
//                             onClick={() => handleTabChange("Radiology_Test")}
//                           >
//                             Radiology
//                           </button>
//                         </div>
//                       </div>
//                       |
//                       <button
//                         style={{
//                           color:
//                             ActiveTab === "IP_DoctorPrescribtion"
//                               ? "white"
//                               : "",
//                         }}
//                         onClick={() => handleTabChange("IP_DoctorPrescribtion")}
//                       >
//                         Prescription
//                       </button>
//                       |
//                       <button
//                         style={{
//                           color: ActiveTab === "NewProcedure" ? "white" : "",
//                         }}
//                         onClick={() => handleTabChange("NewProcedure")}
//                       >
//                         Therapy
//                       </button>
//                       |
//                 <button
//                   style={{
//                     color: ActiveTab === "IPDOCTOREMR" ? "white" : "",
//                   }}
//                   onClick={() => handleTabChange("IPDOCTOREMR")}
//                 >
//                   IP DOCTOR EMR
//                 </button>
//                       {shouldShowForms && (
//                         <>
//                           <div className="Lab_dropdown">
//                             |
//                             <button
//                               style={{
//                                 color:
//                                   ActiveTab === "Neurology" ||
//                                   ActiveTab === "Gynecology" ||
//                                   ActiveTab === "AncCard" ||
//                                   ActiveTab === "Opthalmology" ||
//                                   ActiveTab === "IFCard"
//                                     ? "white"
//                                     : "",
//                               }}
//                               className="Lab_button"
//                             >
//                               Forms
//                             </button>
//                             <div className="Lab_dropdown_content">
//                               <>
//                                 {/* Neurology */}
//                                 {(DocWiseSpeciality === "NEUROLOGY" || specialityName === "NEUROLOGY") && (
//                                   <>
//                                     <button
//                                       style={{ color: ActiveTab === "Neurology" ? "white" : "" }}
//                                       onClick={() => handleTabChange("Neurology")}
//                                     >
//                                       Neurology Form
//                                     </button>

//                                     <button
//                                       style={{ color: ActiveTab === "OP_Sheet" ? "white" : "" }}
//                                       onClick={() => handleTabChange("OP_Sheet")}
//                                     >
//                                       Neuro Surgery
//                                     </button>
//                                   </>
//                                 )}

//                                 {/* Opthalmology */}
//                                 {(DocWiseSpeciality === "OPTHALMOLOGY" || specialityName === "OPTHALMOLOGY") && (
//                                   <button
//                                     style={{ color: ActiveTab === "Opthalmology" ? "white" : "" }}
//                                     onClick={() => handleTabChange("Opthalmology")}
//                                   >
//                                     Opthalmology
//                                   </button>
//                                 )}

//                                 {/* Gynecology */}
//                                 {(DocComplaint === "GYNECOLOGY" || Complaint === "GYNECOLOGY" || DocWiseSpeciality === "GYNECOLOGY" || specialityName === "GYNECOLOGY") && (
//                                   <>
//                                     <button
//                                       style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
//                                       onClick={() => handleTabChange("IFCard")}
//                                     >
//                                       IFCard
//                                     </button>

//                                     <button
//                                       style={{ color: ActiveTab === "Gynecology" ? "white" : "" }}
//                                       onClick={() => handleTabChange("Gynecology")}
//                                     >
//                                       Gynecology
//                                     </button>

//                                     <button
//                                       style={{ color: ActiveTab === "AncCard" ? "white" : "" }}
//                                       onClick={() => handleTabChange("AncCard")}
//                                     >
//                                       ANCCard
//                                     </button>
//                                   </>
//                                 )}
//                               </>
//                             </div>
//                           </div>
//                         </>
//                       )}
                      
//                       {!isHost && 
//                         (specialityName === "OPTHALMOLOGY" ||
//                         DocWiseSpeciality === "OPTHALMOLOGY") && (
//                           <>
//                           |
//                             <button
//                               style={{
//                                 color: ActiveTab === "Opthalmology" ? "white" : "",
//                               }}
//                               onClick={() => handleTabChange("Opthalmology")}
//                             >
//                               Opthalmology
//                             </button>
//                             |
//                           </>
//                       )}
//                       {!isHost &&
//                         (specialityName === "NEUROLOGY" ||
//                         DocWiseSpeciality === "NEUROLOGY") && (
//                         <>
//                         |
//                           <button
//                             style={{
//                               color: ActiveTab === "Neurology" ? "white" : "",
//                             }}
//                             onClick={() => handleTabChange("Neurology")}
//                           >
//                             Neurology Form
//                           </button>
//                           |
//                           <button
//                             style={{
//                               color: ActiveTab === "OP_Sheet" ? "white" : "",
//                             }}
//                             onClick={() => handleTabChange("OP_Sheet")}
//                           >
//                             Neuro Surgery
//                           </button>
//                           |
//                         </>
//                       )}
//                       {!isHost &&
//                         (Complaint === "GYNECOLOGY" ||
//                         DocComplaint === "GYNECOLOGY" || specialityName === "GYNECOLOGY" ||
//                         DocWiseSpeciality === "GYNECOLOGY") && (
//                         <>
//                         |
//                           <button
//                             style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
//                             onClick={() => handleTabChange("IFCard")}
//                           >
//                             IFCard
//                           </button>
//                           |
//                           <button
//                             style={{
//                               color: ActiveTab === "Gynecology" ? "white" : "",
//                             }}
//                             onClick={() => handleTabChange("Gynecology")}
//                           >
//                             Gynecology
//                           </button>
//                           |
//                           <button
//                             style={{
//                               color: ActiveTab === "AncCard" ? "white" : "",
//                             }}
//                             onClick={() => handleTabChange("AncCard")}
//                           >
//                             ANCCard
//                           </button>
//                           |
//                         </>
//                       )}
//                       |
//                     </h2>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <Suspense fallback={<div>Loading...</div>}>
//           {ActiveTab === "IP_Vitals" && <IP_Vitals />}
//           {ActiveTab === "GeneralEvaluation" && <GeneralEvaluation />}

//           {/* {ActiveTab === "IPD_Handover" && <IPD_Handover />}  */}
//           {/* {ActiveTab === "IP_MedicalHistory" && <IP_MedicalHistory />}  */}
//           {ActiveTab === "IP_SurgicalHistory" && <IP_SurgicalHistory />}
//           {ActiveTab === "IP_Assesment" && <IP_Assesment />}
//           {ActiveTab === "IP_InputOutputChart" && <IP_InputOutputChart />}
//           {ActiveTab === "IP_ProgressNotes" && <IP_ProgressNotes />}
//           {ActiveTab === "IP_DocMlc" && <IP_DocMlc />}
//           {ActiveTab === "IP_Doc_DAMA" && <IP_Doc_DAMA />}
//           {ActiveTab === "IP_Doc_PreoperativeChecklist" && (
//             <IP_Doc_PreoperativeChecklist />
//           )}
//           {ActiveTab === "Lab_Test" && <LabTest />}
//           {ActiveTab === "Radiology_Test" && <RadiologyTest />}
//           {ActiveTab === "IP_DoctorPrescribtion" && <IP_DoctorPrescribtion />}
//           {ActiveTab === "Therapy" && <Therapy />}
//           {ActiveTab === "IPDOCTOREMR" && <IPDOCTOREMR />}

//           {/* / Speciality Forms / */}
//           {ActiveTab === "IFCard" && <IFCard />}
//           {ActiveTab === "Gynecology" && <Gynecology />}
//           {ActiveTab === "AncCard" && <AncCard />}
//           {ActiveTab === "Neurology" && <Neurology />}
//           {ActiveTab === "OP_Sheet" && <OP_Sheet />}
//           {ActiveTab === "Opthalmology" && <Opthalmology />}

//         </Suspense>
//       </div>
//     </>
//   );
// };

// export default IP_DoctorWorkbenchNavigation;


import React, { useState, useEffect, lazy, Suspense } from "react";
import "../../DoctorWorkBench/Navigation.css";
// import "../Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../DoctorWorkBench/TreatmentComponent.css";
import axios from "axios";
import bgImg2 from "../../Assets/bgImg2.jpg";
import Neurology from "../../DoctorWorkBench/Neurology.jsx";
import IFCard from "../../DoctorWorkBench/IFCard.jsx";
import Gynecology from "../../DoctorWorkBench/Gynecology.jsx";
import AncCard from "../../DoctorWorkBench/ANCCard.jsx";
import OP_Sheet from "../../DoctorWorkBench/OP_Sheet.jsx";
import Opthalmology from "../../DoctorWorkBench/Opthalmology.jsx";
import DischargeRequest from "../Nurse/Discharge/IP_DischargeRequest.jsx";
import IP_DischargeSummary from "../Nurse/Discharge/IP_DischargeSummary.jsx";
import IP_DischargeStatus from "../Nurse/Discharge/IP_DischargeStatus.jsx";
import DischargeChecklist from "../Nurse/Discharge/IP_DischargeChecklist.jsx";
import DisChargeClearance from "../Nurse/Discharge/IP_DischargeClearance.jsx";
import PhysicalDischarge from "../Nurse/Discharge/IP_Physical_Discharge.jsx";
import DischargeCancel from "../Nurse/Discharge/IP_DischargeCancel.jsx";
import IP_Nurse_DAMA from "../Nurse/IP_Nurse_DAMA.jsx";
import TreatmentsForms from "../Nurse/Casuality/TreatmentsForms.jsx";


const IPDOCTOREMR = lazy(()=>import("./IPDOCTOREMR.jsx"));
const LabTest = lazy(() => import("./LabTest.jsx"));
const RadiologyTest = lazy(() => import("./RadiologyTest.jsx"));
const Therapy = lazy(() => import("./TherapyRequestForIP.jsx"));

const IP_Vitals = lazy(() => import("./IP_Vitals.jsx"));
const GeneralEvaluation = lazy(() => import("../../DoctorWorkBench/GeneralEvaluation.jsx"));

const IP_SurgicalHistory = lazy(() => import("./IP_SurgicalHistory.jsx"));
const IP_Assesment = lazy(() => import("./IP_Assesment.jsx"));
const IP_InputOutputChart = lazy(() => import("./IP_InputOutputChart.jsx"));
const IP_ProgressNotes = lazy(() => import("./IP_ProgressNotes.jsx"));
const IP_DocMlc = lazy(() => import("./IP_DocMlc.jsx"));
const IP_Doc_DAMA = lazy(() => import("./IP_Doc_DAMA.jsx"));
const IP_Doc_PreoperativeChecklist = lazy(() =>
  import("./IP_Doc_PreoperativeChecklist.jsx")
);
const IP_DoctorPrescribtion = lazy(() => import("./Ip_DoctorPrescribtion.jsx"));
const NewProcedure = lazy(() => import("./NewProcedure.js"));


const IP_DoctorWorkbenchNavigation = () => {
  const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  const UserData = useSelector((state) => state.userRecord?.UserData);

  console.log(IP_DoctorWorkbenchNavigation);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const AllergyDetails = useSelector(state => state.Frontoffice?.AllergyDetails);

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState("IP_Vitals");
  const [isToggled, setIsToggled] = useState(false);
  const [AdmissionDetails, setAdmissionDetails] = useState([]);
  const [CurrentPreviousRoom, setCurrentPreviousRoom] = useState(null);
  const [Assesment, setAssesment] = useState([]);
  const [AllergyData, setAllergyData] = useState([]);
  const [ShowAllergyData, setShowAllergyData] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [SpecialityData, setSpecialityData] = useState([]);
  
  const [specialityName, setSpecialityName] = useState(null);
  const [DocWiseSpeciality, setDocWiseSpeciality] = useState(null);
  const [isHost, setIsHost] = useState(false);

    const [Complaint, setComplaint] = useState('');
    const [DocComplaint, setDocComplaint] = useState('');
  
  console.log(isHost, "isHost");
  console.log(specialityName, "specialityName");
  console.log(DocWiseSpeciality, "DocWiseSpeciality");

  console.log(Complaint,'Complaint',DocComplaint,'DocComplaint')


  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const handleEditClick = () => {
    setOpenModal(true);
  };


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
      navigate("/Home/IP_WorkbenchQuelist");
    }
    // else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
    //   navigate('/Home/CasualityDocQuelist')
    // }
  }, [IP_DoctorWorkbenchNavigation]);

useEffect(() => {
  if (AllergyData.length > 0) {
      dispatchvalue({ type: "AllergyDetails", value: AllergyData });
      console.log({ type: "AllergyDetails", value: AllergyData }, 'Dispatching AllergyDetails');
  }
}, [AllergyData]); // This will run whenever gridData changes

//----------FOR SPECIALITY FORMS------------------------
 useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setSpecialityData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const [shouldShowForms, setShouldShowForms] = useState(true);
  const allowedSpecialities = ["NEUROLOGY", "GYNECOLOGY", "OPTHALMOLOGY", "OBST&GYNECOLOGY"];
  

  useEffect(() => {
  const isSpecialityAllowed = isHost && (allowedSpecialities.includes(DocWiseSpeciality) || allowedSpecialities.includes(specialityName));
  
  let shouldShow = isSpecialityAllowed;
  if (DocWiseSpeciality === "OBST&GYNECOLOGY" || specialityName === "OBST&GYNECOLOGY") {
    shouldShow = isSpecialityAllowed && (Complaint === "GYNECOLOGY" || DocComplaint === "GYNECOLOGY");
  }

  setShouldShowForms(shouldShow);
}, [isHost, DocWiseSpeciality, specialityName, Complaint, DocComplaint]);
  

useEffect(() => {
    console.log("1222222222------");

    let SpecData = null;
    let DocSpecWise = null;

    if (UserData?.username === "host" || UserData?.username === "admin") {
      setIsHost(true); // Set isHost to true if the user is 'host'

      // Get SpecData based on IP_DoctorWorkbenchNavigation
      if (IP_DoctorWorkbenchNavigation?.Specialization) {
        SpecData = SpecialityData?.find(
          (p) => p?.Speciality_Id === IP_DoctorWorkbenchNavigation?.Specialization
        );
        console.log(SpecData, "SpecData");
        console.log(SpecData?.Speciality_Id, "SpecData?.Speciality_Id");
        console.log(
          IP_DoctorWorkbenchNavigation?.Specialization,
          "IP_DoctorWorkbenchNavigation?.Specialization"
        );

        if (SpecData) {
          setSpecialityName(SpecData?.SpecialityName);
          console.log("matching patient", SpecData?.SpecialityName);
          setDocWiseSpeciality(null);

          setComplaint(IP_DoctorWorkbenchNavigation?.Complaint);
          setDocComplaint('');
        } else {
          setSpecialityName(null);
        }
      }

      console.log('rrrrr--------1');
      

      // // Get DocSpecWise based on SpecialityWise_DoctorWorkbenchNavigation
      // if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
      //   DocSpecWise = SpecialityData?.find(
      //     (p) =>
      //       p?.Speciality_Id ===
      //       SpecialityWise_DoctorWorkbenchNavigation?.Specialization
      //   );
      //   console.log(DocSpecWise, "11----DocSpecWise");
      //   console.log(DocSpecWise?.Speciality_Id, "11-----DocSpecWise?.Speciality_Id");
      //   console.log(
      //     SpecialityWise_DoctorWorkbenchNavigation?.Specialization,
      //     "11-----SpecialityWise_DoctorWorkbenchNavigation?.Specialization"
      //   );

      //   if (DocSpecWise) {
      //     setDocWiseSpeciality(DocSpecWise?.SpecialityName);
      //     console.log("matching speciality", DocSpecWise?.SpecialityName);
      //     setSpecialityName(null);
      //   } else {
      //     setDocWiseSpeciality(null);
      //   }
      // }
      // console.log('rrrrr--------2');

    } else {
      setIsHost(false); // Reset isHost if not 'host'
      console.log("133333333333333------");

      // Get SpecData based on IP_DoctorWorkbenchNavigation
      if (IP_DoctorWorkbenchNavigation?.Specialization) {
        const SpecData = SpecialityData?.find(
          (p) => p?.Speciality_Id === IP_DoctorWorkbenchNavigation?.Specialization
        );
        console.log(SpecData, "SpecData");
        console.log(SpecData?.Speciality_Id, "SpecData?.Speciality_Id");
        console.log(UserData?.Specialization, "UserData?.Specialization");
        console.log(
          IP_DoctorWorkbenchNavigation?.Specialization,
          "IP_DoctorWorkbenchNavigation?.Specialization"
        );

        const PatientSpeciality =
          UserData?.Specialization &&
          IP_DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;
        console.log("PatientSpeciality", PatientSpeciality);

        setSpecialityName(null);
        if (PatientSpeciality) {
          console.log("pppppppp");

          setSpecialityName(SpecData?.SpecialityName);
          console.log("matching totalpatient");

          setDocWiseSpeciality(null);

          setComplaint(IP_DoctorWorkbenchNavigation?.Complaint);
          setDocComplaint('');
        } else {
          setSpecialityName(null); // Reset if no match
        }
      }

      // if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
      //   DocSpecWise = SpecialityData?.find(
      //     (p) =>
      //       p?.Speciality_Id ===
      //       SpecialityWise_DoctorWorkbenchNavigation?.Specialization
      //   );
      //   console.log(DocSpecWise, "DocSpecWise");
      //   console.log(DocSpecWise?.Speciality_Id, "DocSpecWise?.Speciality_Id");
      //   console.log(UserData?.Specialization, "UserData?.Specialization");
      //   console.log(
      //     SpecialityWise_DoctorWorkbenchNavigation?.Specialization,
      //     "SpecialityWise_DoctorWorkbenchNavigation?.Specialization"
      //   );

      //   const DocPatientSpeciality =
      //     UserData?.Specialization &&
      //     SpecialityWise_DoctorWorkbenchNavigation?.Specialization ===
      //       DocSpecWise?.Speciality_Id;

      //   console.log("DocPatientSpeciality", DocPatientSpeciality);
      //   console.log("DocSpecWise?.SpecialityName", DocSpecWise?.SpecialityName);

      //   setDocWiseSpeciality(null);

      //   if (DocPatientSpeciality) {
      //     console.log("4444444444444");

      //     setDocWiseSpeciality(DocSpecWise?.SpecialityName);
      //     console.log("matching specialitywise ");

      //     setSpecialityName(null);
      //   } else {
      //     setDocWiseSpeciality(null); // Reset if no match
      //   }
      // }

      
    }
  }, [
    UserData,
    IP_DoctorWorkbenchNavigation,
    SpecialityData,
    // SpecialityWise_DoctorWorkbenchNavigation,
  ]);

//----------FOR SPECIALITY FORMS------------------------

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
    const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

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


  useEffect(() => {
    if (AllergyData.length > 0) {
      setShowAllergyData(true);
      dispatchvalue({ type: "AllergyDetails", value: AllergyData });
      console.log({ type: "AllergyDetails", value: AllergyData }, 'Dispatching AllergyDetails');

      
    }
  }, [AllergyData,ShowAllergyData]); // This will run whenever gridData changes


  // useEffect(() => {
  //   if (Object.keys(IP_DoctorWorkbenchNavigation).length === 0 && Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
  //     navigate('/Home/IP_WorkbenchQuelist');
  //   } else if (Object.keys(Casuality_DoctorWorkbenchNavigation).length === 0) {
  //     navigate('/Home/CasualityDocQuelist');
  //   }
  // }, [IP_DoctorWorkbenchNavigation, Casuality_DoctorWorkbenchNavigation]);

  return (
    <>
      <div className="Main_container_app">
        <div className="new-patient-registration-form">
          <div className="dctr_info_up_head">
            <div className="RegisFormcon ">
              <div className="dctr_info_up_head22">
                <img
                  src={bgImg2}
                  // src={IP_DoctorWorkbenchNavigation?.PatientProfile}
                  alt="Default Patient Photo"
                />

                <label>Profile</label>
              </div>
            </div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="PatientID">
                  Patient ID <span>:</span>
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientID">
                  {IP_DoctorWorkbenchNavigation?.PatientId}
                </span>
              </div>
              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="PatientName">
                  {IP_DoctorWorkbenchNavigation?.PatientName}
                </span>
              </div>

              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="AgeGender">
                  Age / Gender <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Age">
                  {IP_DoctorWorkbenchNavigation?.Age} /{" "}
                  {IP_DoctorWorkbenchNavigation?.Gender}
                </span>
              </div>


             
              {IP_DoctorWorkbenchNavigation?.BloodGroup && (
                <div className="RegisForm_1 dctr_wrbvh_pice666">
                  <label htmlFor="Gender">
                    Blood Group <span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="Gender">
                    {IP_DoctorWorkbenchNavigation?.BloodGroup}
                  </span>
                </div>
              )}
              

              <div className="RegisForm_1 dctr_wrbvh_pice666">
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

              
              {AdmissionDetails.length > 0 && (
                <div className="RegisForm_1 dctr_wrbvh_pice666">
                  <label htmlFor="AdmissionPurpose">
                    POA<span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="AdmissionPurpose">
                    {AdmissionDetails?.[0]?.AdmissionPurpose}
                  </span>
                </div>
              )}


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
                <div className="RegisForm_1 dctr_wrbvh_pice666">
                  <label htmlFor="IsMLC">
                    MLC<span>:</span>
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="IsMLC">
                    {IP_DoctorWorkbenchNavigation?.IsMLC}
                  </span>
                </div>
              )}
              


              {Assesment.length > 0 && (
                <div className="RegisForm_1 dctr_wrbvh_pice666">
                  <label htmlFor="FinalDiagnosis">
                    FinalDiagnosis<span>:</span>
                  </label>
                  <span className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66" htmlFor="FinalDiagnosis">
                    {Assesment?.[0]?.FinalDiagnosis}
                  </span>
                </div>
              )}

              {ShowAllergyData && (
                <div className="RegisFormcon_j">
                  {/* Only render Allergy button and modal if there is allergy data */}
                  {AllergyDetails?.length > 0 && (
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
                                {AllergyDetails.map(
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
              








            </div>
          </div>

          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
                <button
                  style={{ color: ActiveTab === "IP_Vitals" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_Vitals")}
                >
                  Vitals
                </button>
                |
                {/* <button style={{ color: ActiveTab === "IP_MedicalHistory" ? 'white' : '' }} onClick={() => handleTabChange("IP_MedicalHistory")}>
                MedicalHistory
                </button>
                | */}
                <button
                  style={{
                    color: ActiveTab === "IP_SurgicalHistory" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_SurgicalHistory")}
                >
                  Surgical History
                </button>
                |
                <button
                  style={{ color: ActiveTab === "IP_Assesment" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_Assesment")}
                >
                  Assesment
                </button>
                |
                <button
                  style={{ color: ActiveTab === "TreatmentsForms" ? "white" : "" }}
                  onClick={() => handleTabChange("TreatmentsForms")}
                >
                  TreatmentsForms
                </button>
                {/* |
                <button
                  style={{
                    color: ActiveTab === "IP_InputOutputChart" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_InputOutputChart")}
                >
                  Input Output Chart
                </button> */}
                |
                <button
                  style={{
                    color: ActiveTab === "IP_ProgressNotes" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_ProgressNotes")}
                >
                  ProgressNotes
                </button>
                |
                <button
                  style={{
                    color: ActiveTab === "GeneralEvaluation" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("GeneralEvaluation")}
                >
                  GeneralEvaluation
                </button>
                |
                <button
                  style={{ color: ActiveTab === "IP_DocMlc" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_DocMlc")}
                >
                  MLC
                </button>
                |
                <button
                  style={{ color: ActiveTab === "IP_Doc_DAMA" ? "white" : "" }}
                  onClick={() => handleTabChange("IP_Doc_DAMA")}
                >
                  DAMA
                </button>
                |
                <button
                  style={{
                    color:
                      ActiveTab === "IP_Doc_PreoperativeChecklist"
                        ? "white"
                        : "",
                  }}
                  onClick={() =>
                    handleTabChange("IP_Doc_PreoperativeChecklist")
                  }
                >
                  PreoperativeChecklist
                </button>
                |
                <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "Lab_Test" ||
                          ActiveTab === "Radiology_Test"
                          ? "white"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    Diagnostics
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{ color: ActiveTab === "Lab_Test" ? "white" : "" }}
                      onClick={() => handleTabChange("Lab_Test")}
                    >
                      Lab
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "Radiology_Test" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Radiology_Test")}
                    >
                      Radiology
                    </button>
                    
                  </div>
                </div>
                |
                <button
                  style={{
                    color: ActiveTab === "IP_DoctorPrescribtion" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IP_DoctorPrescribtion")}
                >
                  Prescription
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
                <button
                  style={{
                    color: ActiveTab === "IPDOCTOREMR" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IPDOCTOREMR")}
                >
                  IP DOCTOR EMR
                </button>
                
                {shouldShowForms && (
                  <>
                    <div className="Lab_dropdown">
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "Neurology" ||
                            ActiveTab === "Gynecology" ||
                            ActiveTab === "AncCard" ||
                            ActiveTab === "Opthalmology" ||
                            ActiveTab === "IFCard"
                              ? "white"
                              : "",
                        }}
                        className="Lab_button"
                      >
                        Forms
                      </button>
                      <div className="Lab_dropdown_content">
                        <>
                          {/* Neurology */}
                          {(DocWiseSpeciality === "NEUROLOGY" || specialityName === "NEUROLOGY") && (
                            <>
                              <button
                                style={{ color: ActiveTab === "Neurology" ? "white" : "" }}
                                onClick={() => handleTabChange("Neurology")}
                              >
                                Neurology Form
                              </button>

                              <button
                                style={{ color: ActiveTab === "OP_Sheet" ? "white" : "" }}
                                onClick={() => handleTabChange("OP_Sheet")}
                              >
                                Neuro Surgery
                              </button>
                            </>
                          )}

                          {/* Opthalmology */}
                          {(DocWiseSpeciality === "OPTHALMOLOGY" || specialityName === "OPTHALMOLOGY") && (
                            <button
                              style={{ color: ActiveTab === "Opthalmology" ? "white" : "" }}
                              onClick={() => handleTabChange("Opthalmology")}
                            >
                              Opthalmology
                            </button>
                          )}

                          {/* Gynecology */}
                          {(DocComplaint === "GYNECOLOGY" || Complaint === "GYNECOLOGY" || DocWiseSpeciality === "GYNECOLOGY" || specialityName === "GYNECOLOGY") && (
                            <>
                              <button
                                style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                                onClick={() => handleTabChange("IFCard")}
                              >
                                IFCard
                              </button>

                              <button
                                style={{ color: ActiveTab === "Gynecology" ? "white" : "" }}
                                onClick={() => handleTabChange("Gynecology")}
                              >
                                Gynecology
                              </button>

                              <button
                                style={{ color: ActiveTab === "AncCard" ? "white" : "" }}
                                onClick={() => handleTabChange("AncCard")}
                              >
                                ANCCard
                              </button>
                            </>
                          )}
                        </>
                      </div>
                    </div>
                  </>
                )}

                {!isHost && 
                  (specialityName === "OPTHALMOLOGY" ||
                  DocWiseSpeciality === "OPTHALMOLOGY") && (
                    <>
                    |
                      <button
                        style={{
                          color: ActiveTab === "Opthalmology" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("Opthalmology")}
                      >
                        Opthalmology
                      </button>
                      |
                    </>
                )}
                {!isHost &&
                  (specialityName === "NEUROLOGY" ||
                  DocWiseSpeciality === "NEUROLOGY") && (
                  <>
                  |
                    <button
                      style={{
                        color: ActiveTab === "Neurology" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Neurology")}
                    >
                      Neurology Form
                    </button>
                    |
                    <button
                      style={{
                        color: ActiveTab === "OP_Sheet" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("OP_Sheet")}
                    >
                      Neuro Surgery
                    </button>
                    |
                  </>
                )}
                {!isHost &&
                  (Complaint === "GYNECOLOGY" ||
                  DocComplaint === "GYNECOLOGY" || specialityName === "GYNECOLOGY" ||
                  DocWiseSpeciality === "GYNECOLOGY") && (
                  <>
                  |
                    <button
                      style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                      onClick={() => handleTabChange("IFCard")}
                    >
                      IFCard
                    </button>
                    |
                    <button
                      style={{
                        color: ActiveTab === "Gynecology" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Gynecology")}
                    >
                      Gynecology
                    </button>
                    |
                    <button
                      style={{
                        color: ActiveTab === "AncCard" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("AncCard")}
                    >
                      ANCCard
                    </button>
                    |
                  </>
                )}
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
                    {/* <button
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
                    </button> */}

                    <button
                      style={{
                        color:
                          ActiveTab === "IP_DischargeSummary" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DischargeSummary")}
                    >
                      Discharge Summary
                    </button>

                    {/* <button
                      style={{
                        color:
                          ActiveTab === "IP_DischargeStatus" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("IP_DischargeStatus")}
                    >
                      DischargeStatus
                    </button> */}

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

                    {/* <button
                      style={{
                        color: ActiveTab === "DischargeCancel" ? "Black" : "",
                      }}
                      onClick={() => handleTabChange("DischargeCancel")}
                    >
                      Discharge Cancel
                    </button> */}

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
                          color: ActiveTab === "IP_Vitals" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_Vitals")}
                      >
                        Vitals
                      </button>
                      |
                      {/* <button style={{ color: ActiveTab === "IP_MedicalHistory" ? 'white' : '' }} onClick={() => handleTabChange("IP_MedicalHistory")}>
                      MedicalHistory
                      </button>
                      | */}
                      <button
                        style={{
                          color:
                            ActiveTab === "IP_SurgicalHistory" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_SurgicalHistory")}
                      >
                        Surgical History
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "IP_Assesment" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_Assesment")}
                      >
                        Assesment
                      </button>
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "IP_InputOutputChart" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_InputOutputChart")}
                      >
                        Input Output Chart
                      </button>
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "IP_ProgressNotes" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_ProgressNotes")}
                      >
                        ProgressNotes
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "GeneralEvaluation" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("GeneralEvaluation")}
                      >
                        GeneralEvaluation
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "IP_DocMlc" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_DocMlc")}
                      >
                        MLC
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "IP_Doc_DAMA" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("IP_Doc_DAMA")}
                      >
                        DAMA
                      </button>
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "IP_Doc_PreoperativeChecklist"
                              ? "white"
                              : "",
                        }}
                        onClick={() =>
                          handleTabChange("IP_Doc_PreoperativeChecklist")
                        }
                      >
                        PreoperativeChecklist
                      </button>
                      |
                      <div className="Lab_dropdown">
                        <button
                          style={{
                            color:
                              ActiveTab === "Lab_Test" ||
                                ActiveTab === "Radiology_Test"
                                ? "white"
                                : "",
                          }}
                          className="Lab_button"
                        >
                          Diagnostics
                        </button>
                        <div className="Lab_dropdown_content">
                          <button
                            style={{
                              color: ActiveTab === "Lab_Test" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Lab_Test")}
                          >
                            Lab
                          </button>
                          <button
                            style={{
                              color:
                                ActiveTab === "Radiology_Test" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Radiology_Test")}
                          >
                            Radiology
                          </button>
                        </div>
                      </div>
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "IP_DoctorPrescribtion"
                              ? "white"
                              : "",
                        }}
                        onClick={() => handleTabChange("IP_DoctorPrescribtion")}
                      >
                        Prescription
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "NewProcedure" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("NewProcedure")}
                      >
                        Therapy
                      </button>
                      |
                <button
                  style={{
                    color: ActiveTab === "IPDOCTOREMR" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("IPDOCTOREMR")}
                >
                  IP DOCTOR EMR
                </button>
                      {shouldShowForms && (
                        <>
                          <div className="Lab_dropdown">
                            |
                            <button
                              style={{
                                color:
                                  ActiveTab === "Neurology" ||
                                  ActiveTab === "Gynecology" ||
                                  ActiveTab === "AncCard" ||
                                  ActiveTab === "Opthalmology" ||
                                  ActiveTab === "IFCard"
                                    ? "white"
                                    : "",
                              }}
                              className="Lab_button"
                            >
                              Forms
                            </button>
                            <div className="Lab_dropdown_content">
                              <>
                                {/* Neurology */}
                                {(DocWiseSpeciality === "NEUROLOGY" || specialityName === "NEUROLOGY") && (
                                  <>
                                    <button
                                      style={{ color: ActiveTab === "Neurology" ? "white" : "" }}
                                      onClick={() => handleTabChange("Neurology")}
                                    >
                                      Neurology Form
                                    </button>

                                    <button
                                      style={{ color: ActiveTab === "OP_Sheet" ? "white" : "" }}
                                      onClick={() => handleTabChange("OP_Sheet")}
                                    >
                                      Neuro Surgery
                                    </button>
                                  </>
                                )}

                                {/* Opthalmology */}
                                {(DocWiseSpeciality === "OPTHALMOLOGY" || specialityName === "OPTHALMOLOGY") && (
                                  <button
                                    style={{ color: ActiveTab === "Opthalmology" ? "white" : "" }}
                                    onClick={() => handleTabChange("Opthalmology")}
                                  >
                                    Opthalmology
                                  </button>
                                )}

                                {/* Gynecology */}
                                {(DocComplaint === "GYNECOLOGY" || Complaint === "GYNECOLOGY" || DocWiseSpeciality === "GYNECOLOGY" || specialityName === "GYNECOLOGY") && (
                                  <>
                                    <button
                                      style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                                      onClick={() => handleTabChange("IFCard")}
                                    >
                                      IFCard
                                    </button>

                                    <button
                                      style={{ color: ActiveTab === "Gynecology" ? "white" : "" }}
                                      onClick={() => handleTabChange("Gynecology")}
                                    >
                                      Gynecology
                                    </button>

                                    <button
                                      style={{ color: ActiveTab === "AncCard" ? "white" : "" }}
                                      onClick={() => handleTabChange("AncCard")}
                                    >
                                      ANCCard
                                    </button>
                                  </>
                                )}
                              </>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {!isHost && 
                        (specialityName === "OPTHALMOLOGY" ||
                        DocWiseSpeciality === "OPTHALMOLOGY") && (
                          <>
                          |
                            <button
                              style={{
                                color: ActiveTab === "Opthalmology" ? "white" : "",
                              }}
                              onClick={() => handleTabChange("Opthalmology")}
                            >
                              Opthalmology
                            </button>
                            |
                          </>
                      )}
                      {!isHost &&
                        (specialityName === "NEUROLOGY" ||
                        DocWiseSpeciality === "NEUROLOGY") && (
                        <>
                        |
                          <button
                            style={{
                              color: ActiveTab === "Neurology" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Neurology")}
                          >
                            Neurology Form
                          </button>
                          |
                          <button
                            style={{
                              color: ActiveTab === "OP_Sheet" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("OP_Sheet")}
                          >
                            Neuro Surgery
                          </button>
                          |
                        </>
                      )}
                      {!isHost &&
                        (Complaint === "GYNECOLOGY" ||
                        DocComplaint === "GYNECOLOGY" || specialityName === "GYNECOLOGY" ||
                        DocWiseSpeciality === "GYNECOLOGY") && (
                        <>
                        |
                          <button
                            style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                            onClick={() => handleTabChange("IFCard")}
                          >
                            IFCard
                          </button>
                          |
                          <button
                            style={{
                              color: ActiveTab === "Gynecology" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Gynecology")}
                          >
                            Gynecology
                          </button>
                          |
                          <button
                            style={{
                              color: ActiveTab === "AncCard" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("AncCard")}
                          >
                            ANCCard
                          </button>
                          |
                        </>
                      )}
                      |
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {ActiveTab === "IP_Vitals" && <IP_Vitals />}
          {ActiveTab === "GeneralEvaluation" && <GeneralEvaluation />}

          {/* {ActiveTab === "IPD_Handover" && <IPD_Handover />}  */}
          {/* {ActiveTab === "IP_MedicalHistory" && <IP_MedicalHistory />}  */}
          {ActiveTab === "IP_SurgicalHistory" && <IP_SurgicalHistory />}
          {ActiveTab === "IP_Assesment" && <IP_Assesment />}
          {ActiveTab === "TreatmentsForms" && <TreatmentsForms />}
          {ActiveTab === "IP_InputOutputChart" && <IP_InputOutputChart />}
          {ActiveTab === "IP_ProgressNotes" && <IP_ProgressNotes />}
          {ActiveTab === "IP_DocMlc" && <IP_DocMlc />}
          {ActiveTab === "IP_Doc_DAMA" && <IP_Doc_DAMA />}
          {ActiveTab === "IP_Doc_PreoperativeChecklist" && (
            <IP_Doc_PreoperativeChecklist />
          )}
          {ActiveTab === "Lab_Test" && <LabTest />}
          {ActiveTab === "Radiology_Test" && <RadiologyTest />}
          {ActiveTab === "IP_DoctorPrescribtion" && <IP_DoctorPrescribtion />}
          {ActiveTab === "Therapy" && <Therapy />}
          {ActiveTab === "IPDOCTOREMR" && <IPDOCTOREMR />}

          {/* / Speciality Forms / */}
          {ActiveTab === "IFCard" && <IFCard />}
          {ActiveTab === "Gynecology" && <Gynecology />}
          {ActiveTab === "AncCard" && <AncCard />}
          {ActiveTab === "Neurology" && <Neurology />}
          {ActiveTab === "OP_Sheet" && <OP_Sheet />}
          {ActiveTab === "Opthalmology" && <Opthalmology />}

          {ActiveTab === "DischargeRequest" && <DischargeRequest />}
          {ActiveTab === "IP_DischargeSummary" && <IP_DischargeSummary />}
          {ActiveTab === "IP_DischargeStatus" && <IP_DischargeStatus />}
          {ActiveTab === "DischargeChecklist" && <DischargeChecklist />}
          {ActiveTab === "DisChargeClearance" && <DisChargeClearance />}
          {ActiveTab === "PhysicalDischarge" && <PhysicalDischarge />}
          {ActiveTab === "DischargeCancel" && <DischargeCancel/>}
          {ActiveTab === "IP_Nurse_DAMA" && <IP_Nurse_DAMA />}

        </Suspense>
      </div>
    </>
  );
};

export default IP_DoctorWorkbenchNavigation;


