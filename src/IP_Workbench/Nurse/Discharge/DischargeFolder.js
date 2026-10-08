import React, { useState, useEffect } from "react";

import IP_LabDischargeQueslist from './IP_LabDischargeQueslist';
import IP_RadiologyDischargeQueslist from "./IP_RadiologyDischargeQueslist";
import IP_BillingDischargeQueslist from "./IP_BillingDischargeQueslist";


import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const DischargeFolder = () => {

    const [activeFolder, setActiveFolder] = useState("IP_LabDischargeQueslist");
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
           
    const handleFolderClick = (folderName) => {
      setActiveFolder(folderName); // Update the state to show the clicked folder's content
    };
  
    // Trigger folder boxes animation when the component mounts
    useEffect(() => {
      setShowFolders(true);
    }, []);

    const renderFolderContent = () => {
        switch (activeFolder) {
          case "IP_LabDischargeQueslist":
            return <IP_LabDischargeQueslist />;
          case "IP_RadiologyDischargeQueslist":
            return <IP_RadiologyDischargeQueslist />;
          case "IP_BillingDischargeQueslist":
            return <IP_BillingDischargeQueslist />;
          default:
            return null;
        }
      };
  return (
    <div className="folder-container">
      <h2>Discharge Request</h2>

      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
        
        {subAccess.includes('I9-1') && (
          <div onClick={() => handleFolderClick("IP_LabDischargeQueslist")}
            className="folder-box"> Lab Discharge
          </div>
        )}

        {subAccess.includes('I9-2') && (

          <div onClick={() => handleFolderClick("IP_RadiologyDischargeQueslist")}
            className="folder-box"> Radiology Discharge
          </div>
        )}

        {subAccess.includes('I9-3') && (

          <div onClick={() => handleFolderClick("IP_BillingDischargeQueslist")}
            className="folder-box"> Billing Discharge
          </div>
        )}


      </div>

      {renderFolderContent()}
    </div>
  )
}

export default DischargeFolder