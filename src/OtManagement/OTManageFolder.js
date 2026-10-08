import React, { useState, useEffect } from "react";

import TheatreBooking from "./TheatreBooking";
import OtQuelist from "./OtQuelist";
import OtDoctorQueueList from "./OtDoctor/OtDoctorQueueList";
import OtDoctorNavigation from "./OtDoctor/OtDoctorNavigation";
import OtAnaesthesiaNavigation from "./OTAnaesthesia/OtAnaesthesiaNavigation";
import OtNurseeNavigation from "./OtNurse/OtNurseeNavigation";
import New_theater_booking from "./New_theater_booking";
import SurgicalTeam from "./SurgicalTeam";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OtMaster from "../Masters/OtMaster/OtMaster";
import OtCharges from "./OtCharges";
import OTReports from "./OTReports";
import OTCompletelist from "./OTCompletelist";
import Op_otrequest from "./Op_otrequest";
import Ip_ot_request from "./Ip_ot_request";
import OTManagerBooking from "./OTManagerBooking";
import CrewDetails from "./OtDoctor/CrewDetails";
import PreOperativeChecklistForm2 from "../IP/ICU_Management/ICU_Doctor/PreOperativeChecklistForm2";
import PreOperativeChecklistForm from "../IP/ICU_Management/ICU_Doctor/PreOperativeChecklistForm";
import OtAnaesthesiaQueueList from "./OTAnaesthesia/OtAnaesthesiaQueueList";
import OtNurseQueList from "./OtNurse/OtNurseQueList";



const OTManageFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

  const dispatchvalue = useDispatch()

  // const [activeFolder, setActiveFolder] = useState("NewOTBook");

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
      case "New_theater_booking":
        return <New_theater_booking />;
      case "OTManagerBooking":
        return <OTManagerBooking />;
      case "OtQuelist":
        return <OtQuelist />;
      case "SurgicalTeam":
        return <SurgicalTeam />;
      case "Doctor_OueueList":
        return <OtDoctorQueueList />;
      case "OtDoctorNavigation":
        return <OtDoctorNavigation />;
      case "OT_Anaesthesia":
        return <OtAnaesthesiaNavigation />;
      case "OT_Nurse":
        return <OtNurseeNavigation />;
      case "OtMaster":
        return <OtMaster />
      case "OtCharges":
        return <OtCharges/>;
      case "OTReports":
          return <OTReports/>;
      case "OTCompletelist":
          return <OTCompletelist/>
      case "Op_otrequest":
        return <Op_otrequest />
      case "Ip_ot_request":
          return <Ip_ot_request />
      case "CrewDetails":
          return <CrewDetails /> 
      case "OtAnaesthesiaQueueList":
        return <OtAnaesthesiaQueueList />
      case "PreOperativeChecklistForm":
         return <PreOperativeChecklistForm /> 
      case "OtNurseQueList":
          return <OtNurseQueList /> 
          

      default:
        return <OtMaster />;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>OT Management</h2> */}

      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

       {showMenu && subAccess.includes('G7-1') && (

          <div
            onClick={() => handleFolderClick("OtMaster")}
            className="folder-box"
          >
            Operation Theatre Master
          </div>
        )}

       {/* {showMenu && subAccess.includes('G7-2') && (
          <div onClick={() => handleFolderClick("OTManagerBooking")}
            className="folder-box"> OTManagerBooking</div>
        )} */}

       {showMenu && subAccess.includes('G7-3') && (

          <div onClick={() => handleFolderClick("OtQuelist")}
            className="folder-box"> OT QueList</div>
        )}
       {showMenu && subAccess.includes('G7-4') && (

          <div onClick={() => handleFolderClick("SurgicalTeam")}
            className="folder-box"> Surgical Team</div>
        )}
       {showMenu && subAccess.includes('G7-5') && (

          <div onClick={() => handleFolderClick("Doctor_OueueList")}
            className="folder-box"> Doctor QueList</div>
        )}
       {showMenu && subAccess.includes('G7-6') && (

          <div onClick={() => handleFolderClick("OtDoctorNavigation")}
            className="folder-box"> OT Doctor</div>
        )}

        {showMenu && subAccess.includes('G7-7') && (

        <div onClick={() => handleFolderClick("OtAnaesthesiaQueueList")}
          className="folder-box"> OT Anaesthesia Quelist</div>
        )}



       {showMenu && subAccess.includes('G7-8') && (

          <div onClick={() => handleFolderClick("OT_Anaesthesia")}
            className="folder-box"> OT Anaesthesia</div>
        )}

        {showMenu && subAccess.includes('G7-9') && (

        <div onClick={() => handleFolderClick("OtNurseQueList")}
          className="folder-box"> OT NurseQueList</div>
        )}




       {showMenu && subAccess.includes('G7-10') && (

          <div onClick={() => handleFolderClick("OT_Nurse")}
            className="folder-box"> OT Nurse</div>
        )}
       {showMenu && subAccess.includes("G7-11") && (
          <div
            onClick={() => handleFolderClick("OtCharges")}
            className="folder-box"
          >
            OT Charges
          </div>
        )}

        {showMenu && subAccess.includes("G7-12") && (
          <div
            onClick={() => handleFolderClick("OTReports")}
            className="folder-box"
          >
            OT REPORTS
          </div>
        )}

        {showMenu && subAccess.includes("G7-13") && (
          <div
            onClick={() => handleFolderClick("OTCompletelist")}
            className="folder-box"
          >
            OT COMPLETED LIST
          </div>
        )}

      </div>

      {renderFolderContent()}
    </div>
  );
};

export default OTManageFolder;
