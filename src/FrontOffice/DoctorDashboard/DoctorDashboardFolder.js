import React, { useState, useEffect } from "react";
import DoctorDashboard from "./DoctorDashboard";


const DoctorDashboardFolder  = () => {

    const [activeFolder, setActiveFolder] = useState("DoctorDashboard");
    const [showFolders, setShowFolders] = useState(false);
  
    const handleFolderClick = (folderName) => {
      setActiveFolder(folderName); // Update the state to show the clicked folder's content
    };
  
    // Trigger folder boxes animation when the component mounts
    useEffect(() => {
      setShowFolders(true);
    }, []);

    const renderFolderContent = () => {
        switch (activeFolder) {
          case "DoctorDashboard":
            return <DoctorDashboard />;
          default:
            return null;
        }
      };
  return (
    <div className="folder-container">
      <h2>Doctor DashBoard</h2>
      
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

      <div onClick={() => handleFolderClick("DoctorDashboard")}
                className="folder-box"> Doctor Dashboard</div>
 






      </div>

      {renderFolderContent()}
    </div>
  )
}

export default DoctorDashboardFolder