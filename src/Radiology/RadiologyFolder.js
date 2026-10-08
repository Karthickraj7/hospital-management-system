import React, { useState, useEffect } from "react";
import RadiologyQueList from "./RadiologyQueList";
import Mritechnician from "./Mritechnician";
import Cttechnician from "./Cttechnician";
import XRayTechnician from "./XRayTechnician";
import IP_RadiologyDischargeQueslist from "./IP_RadiologyDischargeQueslist";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UsgTechnician from "./UsgTechnician";
import Radiologistquelist from "./Radiologistdoctor";
import Radiologistdoctor from "./Radiologistdoctor";
import Rough from "./Dispatch";
import RadiologyReports from "./RadiologyReports";

import RadPatienttestlist from "../RadiologyNew/RadPatienttestlist";
import DocTest from "../LabNew/LabTechnician/docTest";
import NavigationRad from "../RadiologyNew/NavigationRad";
import DocTest2 from "../RadiologyNew/docTest2";
import Retro from "./Retro";
import RadiologyReportsnew from "./RadiologyReportsNew";
import RadiologyReportsOriginal from "./RadiologyReportsOriginal";

const RadiologyFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch()

  // const [activeFolder, setActiveFolder] = useState("RadiologyQuelist");
  const [showFolders, setShowFolders] = useState(false);

  const UserData = useSelector(state => state.userRecord?.UserData)

  const [subAccess, setSubAccess] = useState([])

  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {

      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array


  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

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
      case "RadiologyQuelist":
        return <RadiologyQueList />;
      case "Radiologistdoctor":
        return <Radiologistdoctor />;
      case "Mritechnician":
        return <Mritechnician />;
      case "Cttechnician":
        return <Cttechnician />;
      case "XRayTechnician":
        return <XRayTechnician />;
      case "UsgTechnician":
        return <UsgTechnician />;
      case "IP_RadiologyDischargeQueslist":
        return <IP_RadiologyDischargeQueslist />;
      // case "RadiologyReports":
      //   return <RadiologyReports />;
      case "RadiologyReportsNew":
        return <RadiologyReportsnew />;
      case "Dispatch":
        return <Rough />;


      case "PatientList":
        return <RadPatienttestlist />;

      case "ReportCapture":
        return <DocTest />;

      case "ReportVerify":
        return <DocTest2 />;

      case "NavigateRad":
        return <NavigationRad />;

      case "PrintPaper":
        return <Retro />

      case "RadiologyReportsOriginal":
        return <RadiologyReportsOriginal />


      default:
        // return <RadiologyQueList />;
        return <RadPatienttestlist />;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Radiology</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

         {showMenu && subAccess.includes('M13-1') && (
          <div onClick={() => handleFolderClick("RadiologyQuelist")}
            className="folder-box"> Radiology Quelist</div>
        )}

        {showMenu && subAccess.includes('M13-2') && (

          <div onClick={() => handleFolderClick("Mritechnician")}
            className="folder-box"> MRI Technician</div>
        )}
        {showMenu && subAccess.includes('M13-3') && (

          <div onClick={() => handleFolderClick("Cttechnician")}
            className="folder-box"> CT Technician</div>
        )}

        {showMenu && subAccess.includes('M13-4') && (

          <div onClick={() => handleFolderClick("XRayTechnician")}
            className="folder-box"> XRay Technician</div>
        )}
        {showMenu && subAccess.includes('M13-5') && (

          <div onClick={() => handleFolderClick("UsgTechnician")}
            className="folder-box"> USG Technician</div>
        )}
        {showMenu && subAccess.includes('M13-6') && (

          <div onClick={() => handleFolderClick("IP_RadiologyDischargeQueslist")}
            className="folder-box"> Discharge Queslist</div>

        )}
        {showMenu && subAccess.includes('M13-7') && (
          <div onClick={() => handleFolderClick("Radiologistdoctor")}
            className="folder-box"> Radiologistdoctor </div>
        )}
        {showMenu && subAccess.includes('M13-8') && (
          <div onClick={() => handleFolderClick("Dispatch")}
            className="folder-box"> Dispatch </div>
        )} 

        {showMenu && ["M13-8", 'M13-7', 'M13-5', 'M13-4', 'M13-3', 'M13-2'].some((code) => subAccess.includes(code)) && (
          <div onClick={() => handleFolderClick("PatientList")}
            className="folder-box"> Radiology </div>
        )}

        {/* {showMenu && subAccess.includes('M13-9') && (
          <div onClick={() => handleFolderClick("RadiologyReports")}
            className="folder-box"> Radiology Reports </div>
        )} */}

         {showMenu && subAccess.includes("M13-9") && (
          <div
            onClick={() => handleFolderClick("RadiologyReportsNew")}
            className="folder-box"
          >
            {" "}
            Radiology Reports (New){" "}
          </div>
        )}



        {showMenu && subAccess.includes("M13-9") && (
          <div
            onClick={() => handleFolderClick("RadiologyReportsOriginal")}
            className="folder-box"
          >
            {" "}
            Radiology Reports{" "}
          </div>
        )}



 




        {showMenu && subAccess.includes('M13-6') && (
          <div onClick={() => handleFolderClick("IP_RadiologyDischargeQueslist")}
            className="folder-box"> Discharge Queslist</div>
        )}




      </div>

      {renderFolderContent()}
    </div>
  )
}

export default RadiologyFolder
