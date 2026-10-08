
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import IP_Doctor_Payout from "./IP_Doctor_PayOut";
import OP_Doctor_PayOut from "./OP_Doctor_PayOut";
const DoctorPayOutFolder = () =>{
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
             case 'OP_Doctor_Payout':
                return <OP_Doctor_PayOut />    
            case 'IP_Doctor_Payout':
                return <IP_Doctor_Payout />
           
            default:
               return <OP_Doctor_PayOut />
             
           }
         };
   
     return (
       <div className="folder-container">
         {/* <h2>Masters</h2> */}
   
         <div
           className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
         >
            {showMenu && subAccess.includes("AA27-2") && (
             <div
               onClick={() => handleFolderClick("OP_Doctor_Payout")}
               className="folder-box"
             >
             OP Doctor Payout
             </div>
           )}
             {showMenu && subAccess.includes("AA27-1") && (
             <div
               onClick={() => handleFolderClick("IP_Doctor_Payout")}
               className="folder-box"
             >
             IP Doctor Payout
             </div>
           )}
 
   
   
   
           </div>
           {renderFolderContent()}
           </div>
     );
}
export default DoctorPayOutFolder;