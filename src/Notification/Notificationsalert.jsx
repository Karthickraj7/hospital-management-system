import React, { useState, useEffect } from "react";
import Feedbackview from "./Feedbackview";
// import InsuranceDashboard from "./InsuranceDashboard";

const Notificationsalert = () => {

    const [activeFolder, setActiveFolder] = useState("InsuranceDashboard");
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
          case "FeedBacks":
            return <Feedbackview />;
          default:
            return null;
        }
      };
  return (
    <div className="folder-container">
      <h2>Notifications</h2>
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

      <div onClick={() => handleFolderClick("FeedBacks")}
                className="folder-box">Feed Back</div>







      </div>

      {renderFolderContent()}
    </div>
  )
}

export default Notificationsalert