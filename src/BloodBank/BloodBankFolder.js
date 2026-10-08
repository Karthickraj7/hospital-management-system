import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import DonorMaster from "./Masters/DonorMaster";
import DonorConscentForm from "./Masters/DonorConscentForm";
import BagTypeMaster from "./Masters/BagTypeMaster";
import BloodBankMaster from "./Masters/BloodBankMaster";
import QuestionMaster from "./Masters/QuestionMaster";
import TitreMaster from "./Masters/TitreMaster";
import BloodGroupMaster from "./Masters/BloodGroupMaster";

const BloodBankFolder = () => {

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
           
            case "DonorMaster":
                return <DonorMaster />;
            case "DonorConscentForm":
                return <DonorConscentForm />;
            case "BloodBankMaster":
              return <BloodBankMaster />;
            case "BagTypeMaster":
              return <BagTypeMaster />;
            case "QuestionMaster":
              return <QuestionMaster />;
            case "TitreMaster":
                return <TitreMaster />;  
                case "BloodGroupMaster":
                  return <BloodGroupMaster />;     
            default:
                return <BloodGroupMaster />;
            }
          };

  return (
    <div className="folder-container">
    
            {/* <h2>Finance</h2> */}
            <div
              className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
            >


              
                {showMenu && subAccess.includes('Ac29-1') && (  <div
                    onClick={() => handleFolderClick("DonorMaster")}
                    className="folder-box"
                  >
                   Donor Master
                  </div>
                )}

                {showMenu && subAccess.includes('Ac29-2') && (  <div
                    onClick={() => handleFolderClick("DonorConscentForm")}
                    className="folder-box"
                  >
                    Donor ConscentForm
                  </div>
                )}

{showMenu && subAccess.includes('Ac29-3') && (  <div
                    onClick={() => handleFolderClick("BloodBankMaster")}
                    className="folder-box"
                  >
                   Blood Bank Master
                  </div>
                )}

 {showMenu && subAccess.includes('Ac29-4') && (  <div
                    onClick={() => handleFolderClick("BagTypeMaster")}
                    className="folder-box"
                  >
                   Bag Type Master
                  </div>
                )}       


{showMenu && subAccess.includes('Ac29-5') && (  <div
                    onClick={() => handleFolderClick("QuestionMaster")}
                    className="folder-box"
                  >
                   Question Master
                  </div>
                )}    


{showMenu && subAccess.includes('Ac29-6') && (  <div
                    onClick={() => handleFolderClick("TitreMaster")}
                    className="folder-box"
                  >
                   Titre Master
                  </div>
                )}   

{showMenu && subAccess.includes('Ac29-7') && (  <div
                    onClick={() => handleFolderClick("BloodGroupMaster")}
                    className="folder-box"
                  >
                   Blood Group Master
                  </div>
                )}
                
            </div>

      <br />

      {renderFolderContent()}
    </div>
  )
}

export default BloodBankFolder;