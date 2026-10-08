import React, { useState, useEffect } from "react";
import IPQAIndicatorQue from './QA_Indicator_Quelist';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MedicalErrorMaster from "./MedicalErrorMaster";
import QATimingMaster from "./QATimingMaster";


const QualityIndicatorsFolder = () => {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

  const [showFolders, setShowFolders] = useState(false);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const [subAccess, setSubAccess] = useState([]);


  useEffect(() => {
      console.log(UserData, "UserData");
  
      if (UserData) {
        const setAccess2 =
          (UserData.AccessTwo &&
            UserData.AccessTwo.split(",").map((item) => item.trim())) ||
          [];
  
        setSubAccess(setAccess2); // Update state for sub access
      }
    }, [UserData]); // Dependency array


  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);
  
    const handleFolderClick = (folderName) => {
      dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
      dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
      dispatchvalue({ type: "showMenu", value: false }); // Close menu when navigating to homepage
    };
    
    

    useEffect(() => {
        console.log(activeHrFolder, "activeHrFolder");
    
        if (activeHrFolder !== "") {
          dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
          dispatchvalue({ type: "HrFolder", value: "" }); // Reset HrFolder
        }
        setShowFolders(true);
      }, [activeHrFolder, dispatchvalue]);
    
      const renderFolderContent = () => {
        switch (activeFolder) {


          case 'IP_Quality_Indicator_Quelist':
            return <IPQAIndicatorQue />;

        
          case 'MedicalErrorMaster':
            return < MedicalErrorMaster/>;    
          case 'QATimingMaster':
            return < QATimingMaster/>;
          default:
            return <IPQAIndicatorQue />;  
        }
      };

  return (
    <div className="folder-container">
      {/* <h2>Masters</h2> */}

      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
          {showMenu && subAccess.includes("AA27-1") && (
          <div
            onClick={() => handleFolderClick("IP_Quality_Indicator_Quelist")}
            className="folder-box"
          >
           Quality Indicator Quelist
          </div>
        )}

{showMenu && subAccess.includes("AA27-2") && (
          <div
            onClick={() => handleFolderClick("MedicalErrorMaster")}
            className="folder-box"
          >
           Medical Error Master
          </div>
        )}
           
{showMenu && subAccess.includes("AA27-3") && (
          <div
            onClick={() => handleFolderClick("QATimingMaster")}
            className="folder-box"
          >
          IP QA Timing Master
          </div>
        )}


        </div>
        {renderFolderContent()}
        </div>
  );
};

export default QualityIndicatorsFolder;