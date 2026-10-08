import React, { useState, useEffect } from "react";
// import LabQueuelist from "./LabQueuelist";
import LabCompletedlist from "./LabCompletedlist";


const LaboratoryFolder = () => {

    const [activeFolder, setActiveFolder] = useState("LabQuelist");
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
      // case "LabQuelist":
        // return <LabQueuelist />;
      case "LabCompleted":
        return <LabCompletedlist />;

      default:
        return null;
        }
      };
  return (
    <div className="folder-container">
      <h2>Lab</h2>
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

         {/* <div onClick={() => handleFolderClick("LabQuelist")}
                className="folder-box"> Lab Quelist</div> */}
         <div onClick={() => handleFolderClick("LabCompleted")}
                className="folder-box"> Lab Completed List</div>







      </div>

      {renderFolderContent()}
    </div>
  )
}

export default LaboratoryFolder;



