import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import FrontofficeexpensesList from "./FrontofficeexpensesList";
import Frontofficeexpenses from "./Frontofficeexpenses";
import DayCloseing from "./DayCloseing";
import DayCloseingList from "./DayCloseingList";

const PettyCashFolder = () => {

    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu); 
    const dispatchvalue = useDispatch()

    const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
    const UserData = useSelector((state) => state.userRecord?.UserData);
      
    const [subAccess, setSubAccess] = useState([]);

    const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

     useEffect(() => {
          console.log(UserData, "UserData");
      
          if (UserData) {
            const setAccess2 =
              (UserData.AccessTwo &&
                UserData.AccessTwo.split(",").map((item) => item.trim())) ||
              [];
      
            setSubAccess(setAccess2); // Update state for sub access
          }
        }, [UserData]);
    
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
            case "FrontofficeexpensesList":
                return <FrontofficeexpensesList />;
            case "Frontofficeexpenses":
                return <Frontofficeexpenses />;
            case "DayCloseingList":
              return <DayCloseingList />;
            case "DayCloseing":
              return <DayCloseing />;
            default:
                return <FrontofficeexpensesList />;
            }
          };

  return (
    <div className="folder-container">
    
            {/* <h2>Finance</h2> */}
            <div
              className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
            >
                {showMenu && subAccess.includes('AD30-1') && (  <div
                    onClick={() => handleFolderClick("FrontofficeexpensesList")}
                    className="folder-box"
                  >
                    Expenses List
                  </div>
                )}

                {showMenu && subAccess.includes('AD30-2') && (  <div
                    onClick={() => handleFolderClick("DayCloseingList")}
                    className="folder-box"
                  >
                    Day Closeing List
                  </div>
                )}
            </div>

      <br />

      {renderFolderContent()}
    </div>
  )
}

export default PettyCashFolder;