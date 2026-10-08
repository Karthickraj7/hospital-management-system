import React, { useState, useEffect } from "react";
import NewRoomAvail from "../Masters/RoomMaster/NewRoomAvail";
import IP_WorkbenchQuelist from "./Doctor/IP_WorkbenchQuelist";
import IpHandoverQue from "../FrontOffice/RegistrationList/IpHandoverQue";
import Warddashboard from "./Warddashboard";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IP_DoctorWorkbenchNavigation from "./Doctor/IP_DoctorWorkbenchNavigation";
import IpHandoverWorkbench from "../FrontOffice/RegistrationList/IpHandoverWorkbench";
import PatientProfileFromBed from "../Masters/RoomMaster/PatientProfileFromBed";
import IPDischargePendingList from "../FrontOffice/RegistrationList/IPDischargePendingList";


function WardManagementFolder() {
  const dispatchvalue = useDispatch()

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

  // const [activeFolder, setActiveFolder] = useState("Warddashboard");
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
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


  // Render the content dynamically based on the active folder
  const renderFolderContent = () => {
    switch (activeFolder) {
      case "Warddashboard":
        return <Warddashboard />;
      case "IPHandOverList":
        return <IpHandoverQue />;

        case "RoomMangement":
            return <NewRoomAvail />;

                  case "PatientProfileFromBed":
                    return <PatientProfileFromBed />;

            case "IP_DoctorWorkbenchNavigation":
              return <IP_DoctorWorkbenchNavigation />;

            case "IPQueList":
                return <IP_WorkbenchQuelist />;

                case "IpHandoverWorkbench":
                  return <IpHandoverWorkbench />;

            case "IPDischargePendingList":
              return < IPDischargePendingList/>

      default:
        return <IpHandoverQue />;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Ward Management</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
         {/* {showMenu && subAccess.includes('E5-1') && (
        <div
          onClick={() => handleFolderClick("Warddashboard")}
          className="folder-box"
        >
          Ward Dashboard
        </div>
        )} */}

         {showMenu && subAccess.includes('E5-2') && (

        <div
          onClick={() => handleFolderClick("IPHandOverList")}
          className="folder-box"
        >
          IP HandOver List
        </div>
        )}

         {showMenu && subAccess.includes('E5-3') && (

        <div
          onClick={() => handleFolderClick("RoomMangement")}
          className="folder-box"
        >
          Room Management
        </div>
        )}

         {showMenu && subAccess.includes('E5-4') && (


        <div
          onClick={() => handleFolderClick("IPQueList")}
          className="folder-box"
        >
          IP OueList
        </div>
        )}

        {showMenu && subAccess.includes('E5-5') && (


        <div
          onClick={() => handleFolderClick("IPDischargePendingList")}
          className="folder-box"
        >
          IP Discharge Pending List
        </div>
        )}
        
      </div>

      <br />

      {renderFolderContent()}
    </div>
  );
}

export default WardManagementFolder;
