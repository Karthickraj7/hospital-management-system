import React, { useState, useEffect } from "react";
import Mis_Navigation from "../MIS_Report/Mis_Navigation";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Reports from "../MIS_Report/Reports";
import Opd_Nagarparishad_Register from "../MIS_Report/Opd_Nagarparishad_Register";
import MctsRegister from "../MIS_Report/MctsRegister";
import AncCardRegister from "../MIS_Report/AncCardRegister";
import Financial from "./Financial";
import Insurance from "./Insurance";
import Client from "./Client";
import PatientRegistrationSummary from "../FrontOffice/Reports/PatientRegistrationSummary";
import ReferalDoctorReport from "../FrontOffice/Reports/ReferalDoctorReport";
import RegistrationByReferralReport from "../FrontOffice/Reports/ReferalPatientReport";
import TotalPatientReportList from "../FrontOffice/Reports/TotalPatientReportList";
import FPatientsReports from "./FPatientsReports";
import RadiologyReportsMIS from "./RadiologyReportsMIS";


function MISFolder() {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    
  const SidebarToggle = useSelector(state => state.userRecord?.SidebarToggle)
  const UserData = useSelector(state => state.userRecord?.UserData)
  const dispatchvalue = useDispatch()
  const [openSubMenu, setOpenSubMenu] = useState(null)
   
  const [subAccess, setSubAccess] = useState([])
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);
  
  useEffect(() => {
    if (!SidebarToggle) {
      setOpenSubMenu(null) // Close all submenus when sidebar collapses
    }
  }, [SidebarToggle])

  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {
      // const setAccess1 =
      //   (UserData.AccessOne &&
      //     UserData.AccessOne.split(',').map(item => item.trim())) ||
      //   []
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      // setMainAccess(setAccess1) // Update state for main access
      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array

  const handleFolderClick = (folderName) => {
    
    dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
    dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
    dispatchvalue({ type: "showMenu", value: false });  // Close menu when navigating to homepage

  };
  

  useEffect(() => {
        
    console.log(activeHrFolder, 'activeHrFolder');

    if (activeHrFolder !== "") {
      dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
      dispatchvalue({ type: "HrFolder", value: "" }); // Reset HrFolder
    }
    setShowFolders(true);

  }, [activeHrFolder, dispatchvalue]);
  
  const renderFolderContent = () => {
    switch (activeFolder) {
      case "PatientRegistrationSummary":
        return <PatientRegistrationSummary />;
      case "ReferalDoctorReport":
        return <ReferalDoctorReport />;
      case "RegistrationByReferralReport":
        return <RegistrationByReferralReport />;
      case "TotalPatientReportList":
        return <TotalPatientReportList />;
      // case "Mis_Navigation":
      //   return <Mis_Navigation />;
      
      // case "AncCardRegister":
      //   return <AncCardRegister />;
      // case "MctsRegister":
      //   return <MctsRegister />;
      
      // case "Opd_Nagarparishad_Register":
      //   return <Opd_Nagarparishad_Register />;
      case "Reports":
        return <Reports />;
      case "Financial":
        return <Financial />
      case "Insurance":
        return <Insurance />
      case "Client":
        return <Client />
      case "FPatientsReports":
        return <FPatientsReports />
      case "RadiologyReportsMIS":
        return <RadiologyReportsMIS />;
      

      default:
        return <Financial />;
    }
  };


  return (
    <div className="folder-container">
      {/* <h2>Doctor</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
         {showMenu && subAccess.includes('V22-1') && (
        <div
          onClick={() => handleFolderClick("PatientRegistrationSummary")}
          className="folder-box"
        >
        Patient Registration Summary
        </div>
        )}
         {showMenu && subAccess.includes('V22-2') && (
        <div
          onClick={() => handleFolderClick("ReferalDoctorReport")}
          className="folder-box"
        >
        Referal Doctor Report
        </div>
        )}
         {showMenu && subAccess.includes('V22-3') && (
        <div
          onClick={() => handleFolderClick("RegistrationByReferralReport")}
          className="folder-box"
        >
        Registration By Referral Report
        </div>
        )}
         {showMenu && subAccess.includes('V22-4') && (
        <div
          onClick={() => handleFolderClick("TotalPatientReportList")}
          className="folder-box"
        >
        Total Patient Report List
        </div>
        )}
         {/* {showMenu && subAccess.includes('V22-5') && (
        <div
          onClick={() => handleFolderClick("Mis_Navigation")}
          className="folder-box"
        >
          OPD Reports
        </div>
        )} */}

      {showMenu && subAccess.includes('V22-6') && (
        <div
          onClick={() => handleFolderClick("Financial")}
          className="folder-box"
        >
          Financial Reports
        </div>
        )}

      {showMenu && subAccess.includes('V22-7') && (
        <div
          onClick={() => handleFolderClick("Client")}
          className="folder-box"
        >
          Client Reports
        </div>
        )}

      {showMenu && subAccess.includes('V22-8') && (
        <div
          onClick={() => handleFolderClick("Insurance")}
          className="folder-box"
        >
          Insurance Reports
        </div>
        )}


      {showMenu && subAccess.includes('V22-5') && (
        <div
          onClick={() => handleFolderClick("FPatientsReports")}
          className="folder-box"
        >
          Patients Reports
        </div>
        )}


        {showMenu && subAccess.includes('V22-9') && (
        <div
          onClick={() => handleFolderClick("RadiologyReportsMIS")}
          className="folder-box"
        >
          Radiology Reports
        </div>
        )}



      </div>

      <br />

      {renderFolderContent()}
    </div>
  )
}

export default MISFolder;