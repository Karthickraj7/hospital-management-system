

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Opfollowup from './Opfollowup';
import Discharge from "./Discharge";
import Therapy from "./Therapy";
import Labque from "./Labque";
import Radiologyque from "./Radiologyque";
import PendingDoc from "./PendingDoc";



const CRMdashboard = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);

  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

    // const [activeFolder, setActiveFolder] = useState("OP_patients");
    const [showFolders, setShowFolders] = useState(false);
    const UserData = useSelector(state => state.userRecord?.UserData)
  
    console.log(UserData,'UserData');
    
    const [subAccess, setSubAccess] = useState([])
    
    console.log(subAccess,'subAccess');
    

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
          case "Opfollowup":
            return <Opfollowup />;
          case "PendingDoc":
            return <PendingDoc />;
          case "Discharge":
            return <Discharge />;
          case "Therapy":
            return <Therapy />;
          case "Labque":
            return <Labque />;
          case "Radiologyque":
            return <Radiologyque />;
          default:
            return <Opfollowup />;
        }
      };

  return (
    <div className="folder-container">
      {/* <h2>Out Patients Reception</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

      {showMenu && subAccess.includes('AD30-1') && (
        <div onClick={() => handleFolderClick("Opfollowup")}
          className="folder-box"> Followup
          
        </div> 
      )}
      {showMenu && subAccess.includes('AD30-2') && (
        <div onClick={() => handleFolderClick("PendingDoc")}
          className="folder-box"> Pending Documents
          
        </div> 
      )}
      {showMenu && subAccess.includes('AD30-3') && (
        <div onClick={() => handleFolderClick("Discharge")}
          className="folder-box"> Discharged PatientQuelist
          
        </div> 
      )}
      {showMenu && subAccess.includes('AD30-4') && (
        <div onClick={() => handleFolderClick("Therapy")}
          className="folder-box"> Therapy PatientQuelist
          
        </div> 
      )}
      {showMenu && subAccess.includes('AD30-5') && (
        <div onClick={() => handleFolderClick("Labque")}
          className="folder-box"> Lab PatientQuelist
          
        </div> 
      )}
      {showMenu && subAccess.includes('AD30-6') && (
        <div onClick={() => handleFolderClick("Radiologyque")}
          className="folder-box"> Radiology PatientQuelist
          
        </div> 
      )}





    </div>
      {renderFolderContent()}
    </div>
  )
}

export default CRMdashboard;
