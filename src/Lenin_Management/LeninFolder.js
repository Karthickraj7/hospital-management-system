import React, { useState, useEffect } from "react";
import LeninMaster from "./LeninMaster";
import Lenin_DeptWise_MinMax from "./Lenin_DeptWise_MinMax";
import Lenin_Stock from "./Lenin_Stock";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LeninIssue from "./LeninIssue";
import Lenin_Laundry_Vendor  from "./Lenin_Laundry_Vendor";
import Lenin_Qc_Checking from "./Lenin_Qc_Checking";
import LeninVendorMaster from"./Lenin_Vendor_Master";



const LeninFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  const dispatchvalue = useDispatch()

  // const [activeFolder, setActiveFolder] = useState("LeninMaster");
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
      case "LeninMaster":
        return <LeninMaster />;
      case "Lenin_DeptWise_MinMax":
        return <Lenin_DeptWise_MinMax />;
      case "Lenin_Stock":
        return <Lenin_Stock />; 
      case "LeninIssue":
        return <LeninIssue />;
      case "Lenin_Laundry_Vendor":
        return <Lenin_Laundry_Vendor />;
      case "Lenin_Qc_Checking":
        return <Lenin_Qc_Checking />;
      case "LeninVendorMaster":
        return <LeninVendorMaster />;
        default:
            return <LeninMaster />;     
      
        }
      };
  return (
    <div className="folder-container">
          {/* <h2>Lenin</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
      
     {showMenu && subAccess.includes('R18-1') && (
      <div  onClick={() => handleFolderClick("LeninMaster")}
              className="folder-box" >Lenin Master</div>
      )}
     {showMenu && subAccess.includes('R18-2') && (

      <div  onClick={() => handleFolderClick("Lenin_DeptWise_MinMax")}
              className="folder-box" >Lenin DeptWise MinMax</div>
      )}

     {showMenu && subAccess.includes('R18-3') && (

      <div  onClick={() => handleFolderClick("Lenin_Stock")}
              className="folder-box" >Lenin Stock</div>
      )}
       {showMenu && subAccess.includes('R18-3') && (

      <div  onClick={() => handleFolderClick("Lenin_Laundry_Vendor")}
              className="folder-box" >Lenin_Laundry_Vendor</div>
      )} 
      {showMenu && subAccess.includes('R18-3') && (

      <div  onClick={() => handleFolderClick("LeninIssue")}
              className="folder-box" >LeninIssue</div>
      )} 
      {showMenu && subAccess.includes('R18-3') && (

      <div  onClick={() => handleFolderClick("Lenin_Qc_Checking")}
              className="folder-box" >Lenin_Qc_Checking</div>
      )} 
      {/* {showMenu && subAccess.includes('R18-3') && (

      <div  onClick={() => handleFolderClick("LeninVendorMaster")}
              className="folder-box" >LeninVendorMaster</div>
      )}  */}
      </div>
      {renderFolderContent()}
    </div>
  )
}

export default LeninFolder