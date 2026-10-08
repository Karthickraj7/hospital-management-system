import React, { useState, useEffect } from "react";
import BirthRegisterList from "./BirthRegisterList";
import DeathRegister from "./DeathRegister";
import TotalNursePatientList from "../../Nurse/TotalNursePatientList";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OpNurse_WorkbenchNavigation from "../../OP_Nurse/OpNurse_WorkbenchNavigation";
import IP_NurseWorkbenchNavigation from "./IP_NurseWorkbenchNavigation";
import DeathRegisterList from "./DeathRegisterList";


const NurseFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    console.log(activeHrFolder,"activeHrFolder")
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 

  const dispatchvalue = useDispatch();
  

  // const [activeFolder, setActiveFolder] = useState("PatientQuelist");
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
          
    
         
    
          case "PatientQuelist":
            return <TotalNursePatientList />;
          case "BirthRegisterList":
            return <BirthRegisterList />;
          case "DeathRegisterList":
            return <DeathRegisterList />;
          // case "DeathRegisterList":
          //   return <DeathRegister />;

          case "OpNurse_WorkbenchNavigation":
            return <OpNurse_WorkbenchNavigation />;
            
          case "IP_NurseWorkbenchNavigation":
            return <IP_NurseWorkbenchNavigation />;

          default:
            return <TotalNursePatientList />;
        }
      };
  return (
    <div className="folder-container">
      {/* <h2>Nurse</h2> */}

      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
         {showMenu && subAccess.includes('C3-1') && (
        <div
          onClick={() => handleFolderClick("PatientQuelist")}
          className="folder-box"
        >
          Patient Quelist
        </div>
        )}

         {showMenu && subAccess.includes('C3-2') && (
        <div
          onClick={() => handleFolderClick("BirthRegisterList")}
          className="folder-box"
        >
          Birth Register List
        </div>
        )}

         {showMenu && subAccess.includes('C3-3') && (
        <div
          onClick={() => handleFolderClick("DeathRegisterList")}
          className="folder-box"
        >
          Death Register List
        </div>
        )}


        {/* {showMenu && subAccess.includes('C3-4') && (
        <div
          onClick={() => handleFolderClick("OpNurse_WorkbenchNavigation")}
          className="folder-box"
        >
          Death Register List
        </div>
        )} */}

        {/* {showMenu && subAccess.includes('C3-5') && (
        <div
          onClick={() => handleFolderClick("IP_NurseWorkbenchNavigation")}
          className="folder-box"
        >
          Death Register List
        </div>
        )} */}


        </div>

        {renderFolderContent()}
      </div>
  )
}

export default NurseFolder