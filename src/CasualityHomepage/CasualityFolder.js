import React, { useState, useEffect } from "react";
import "../FrontOffice/FolderBox.css"; 
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EmergencyRegistration from "../FrontOffice/Registration/EmergencyRegistration";
import EmergencyPatientRoomRegistration from "../FrontOffice/Registration/EmergencyPatientRoomRegistration";

function CasualityFolder() {


  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); // Get showMenu from Redux
  
    const SidebarToggle = useSelector(state => state.userRecord?.SidebarToggle)
    const UrlLink = useSelector(state => state.userRecord?.UrlLink)
    const Usersessionid = useSelector(state => state.userRecord?.Usersessionid)
    const UserData = useSelector(state => state.userRecord?.UserData)
    const [openSubMenu, setOpenSubMenu] = useState(null)
    const navigate = useNavigate()
    const dispatchvalue = useDispatch()
  
    const [mainAccess, setMainAccess] = useState([])
    const [subAccess, setSubAccess] = useState([])
  
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
  
  
  
  
  
  
  
  
  
  
  
  
    // const [activeFolder, setActiveFolder] = useState("Dashboard");
  
    const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
  
    const activeFolder = useSelector((state) => state.userRecord?.activeFolder);
  
    const handleFolderClick = (folderName) => {
  
      dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
      dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
      dispatchvalue({ type: "showMenu", value: false });  // Close menu when navigating to homepage
      dispatchvalue({ type: "Registeredit", value: {} });
      dispatchvalue({ type: "RegisterData", value: {} });
      dispatchvalue({ type: "PatientDetails", value: {} });
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
  
  
  
        case "EmergencyRegistration":
          return <EmergencyRegistration />;
        case "EmergencyPatientRoomRegistration":
          return <EmergencyPatientRoomRegistration />;
      
        default:
          return <EmergencyRegistration />
      }
    };



  return (
    <div className="folder-container">

<div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >

{showMenu && subAccess.includes('AB28-1') && (
          <div onClick={() => handleFolderClick("EmergencyRegistration")} className="folder-box">
            Emg Registration
          </div>
        )}

{showMenu && subAccess.includes('AB28-2') && (
          <div onClick={() => handleFolderClick("EmergencyPatientRoomRegistration")} className="folder-box">
            Emg Patient Registration
          </div>
        )}

</div>

{renderFolderContent()}


      </div>
  )
}

export default CasualityFolder