// import React, { useState, useEffect } from "react";
// // import Mis_Navigation from "../MIS_Report/Mis_Navigation";
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import RadiologyMaster from "./RadiologyMaster";
// import Radiologytestmaster from "./Radiologytestmaster";
// // import Reports from "../MIS_Report/Reports";
// // import Opd_Nagarparishad_Register from "../MIS_Report/Opd_Nagarparishad_Register";
// // import MctsRegister from "../MIS_Report/MctsRegister";
// // import AncCardRegister from "../MIS_Report/AncCardRegister";
// // import Financial from "./Financial";
// // import Insurance from "./Insurance";
// // import Client from "./Client";
// // import PatientRegistrationSummary from "../FrontOffice/Reports/PatientRegistrationSummary";
// // import ReferalDoctorReport from "../FrontOffice/Reports/ReferalDoctorReport";
// // import RegistrationByReferralReport from "../FrontOffice/Reports/ReferalPatientReport";
// // import TotalPatientReportList from "../FrontOffice/Reports/TotalPatientReportList";


// function Radiologyfolder() {
//   const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
//   const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    
//   const SidebarToggle = useSelector(state => state.userRecord?.SidebarToggle)
//   const UserData = useSelector(state => state.userRecord?.UserData)
//   const dispatchvalue = useDispatch()
//   const [openSubMenu, setOpenSubMenu] = useState(null)
   
//   const [subAccess, setSubAccess] = useState([])
//   const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
//   const activeFolder = useSelector((state) => state.userRecord?.activeFolder);
  
//   useEffect(() => {
//     if (!SidebarToggle) {
//       setOpenSubMenu(null) // Close all submenus when sidebar collapses
//     }
//   }, [SidebarToggle])

//   useEffect(() => {
//     console.log(UserData, 'UserData')

//     if (UserData) {
//       // const setAccess1 =
//       //   (UserData.AccessOne &&
//       //     UserData.AccessOne.split(',').map(item => item.trim())) ||
//       //   []
//       const setAccess2 =
//         (UserData.AccessTwo &&
//           UserData.AccessTwo.split(',').map(item => item.trim())) ||
//         []

//       // setMainAccess(setAccess1) // Update state for main access
//       setSubAccess(setAccess2) // Update state for sub access
//     }
//   }, [UserData]) // Dependency array

//   const handleFolderClick = (folderName) => {
    
//     dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
//     dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
//     dispatchvalue({ type: "showMenu", value: false });  // Close menu when navigating to homepage

//   };
  

//   useEffect(() => {
        
//     console.log(activeHrFolder, 'activeHrFolder');

//     if (activeHrFolder !== "") {
//       dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
//       dispatchvalue({ type: "HrFolder", value: "" }); // Reset HrFolder
//     }
//     setShowFolders(true);

//   }, [activeHrFolder, dispatchvalue]);
  
//   const renderFolderContent = () => {
//     switch (activeFolder) {
    
//       case "Radiologytestmaster":
//         return <Radiologytestmaster />;

//         case "RadiologyMaster":
//             return <RadiologyMaster />;

//       default:
//         return <RadiologyMaster/>;
//     }
//   };


//   return (
//     <div className="folder-container">
//       {/* <h2>Doctor</h2> */}
//       <div
//         className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
//       >
//          {showMenu && subAccess.includes('V22-1') && (
//         <div
//           onClick={() => handleFolderClick("RadiologyMaster")}
//           className="folder-box"
//         >
//         Radiology master
//         </div>
//         )}
//          {showMenu && subAccess.includes('V22-2') && (
//         <div
//           onClick={() => handleFolderClick("Radiologytestmaster")}
//           className="folder-box"
//         >
//         Radiology Test master
//         </div>
//         )}
       
//       </div>

//       <br />

//       {renderFolderContent()}
//     </div>
//   )
// }

// export default Radiologyfolder;
