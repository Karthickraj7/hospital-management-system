import React, { useState, useEffect } from "react";

import Doctordashboard from "../Doctor/Doctordashboard";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TherapistQuelist from "./TherapistQuelist";
import Oncolgy from "./Oncolgy";
import Physiotherapy from "./Physiotherapy";
import Neurotherapy from "./Neurotherapy";



const Therapyfolder = () => {

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
         
          case "Oncolgy":
            return <Oncolgy />;
          case "Physiotherapy":
            return <Physiotherapy />;
          case "Neurotherapy":
            return <Neurotherapy />;
          // case "IP_RadiologyDischargeQueslist":
          //   return <IP_RadiologyDischargeQueslist />;
          default:
            return <Doctordashboard />
          
        }
      };
  
  return (
    <div className="folder-container">
      {/* <h2>Therapist</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

     {/* {showMenu && subAccess.includes('N14-1') && (
         <div onClick={() => handleFolderClick("RadiologyQuelist")}
                className="folder-box"> Therapy Quelist</div>
      )} */}
      {/* {subAccess.includes('P16-2') && (


         <div onClick={() => handleFolderClick("Mritechnician")}
                className="folder-box"> MRI Technician</div>
      )} */}
      {subAccess.includes('N14-1') && (

         <div onClick={() => handleFolderClick("Oncolgy")}
                className="folder-box"> Oncology</div>
      )}

{subAccess.includes('N14-2') && (

         <div onClick={() => handleFolderClick("Physiotherapy")}
                className="folder-box"> Physiotherapy</div>
)}
     {showMenu && subAccess.includes('N14-3') && (

         <div onClick={() => handleFolderClick("Neurotherapy")}
                className="folder-box"> Neurotherapy </div>

      )}





      </div>

      {renderFolderContent()}
    </div>
  )
}

export default Therapyfolder


