import React, { useState, useEffect } from "react";



import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ClientDashboard from "./ClientDashboard";
import InsuranceDashboard from "./InsuranceDashboard";
import InsuranceMainpage from "./InsuranceMainpage";

const OldInsuranceFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch()

  // const [activeFolder, setActiveFolder] = useState("InsuranceDashboard");
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
      case "InsuranceDashboard":
        return <InsuranceDashboard />;
      case "ClientDashboard":
        return <ClientDashboard />;

      case "InsuranceMainpage":
        return <InsuranceMainpage />;

      default:
        return <InsuranceDashboard />;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Insurance</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>
        {showMenu && subAccess.includes('J10-1') && (
          <div onClick={() => handleFolderClick("InsuranceDashboard")}
            className="folder-box"> Insurance Dashboard</div>
        )}
        {showMenu && subAccess.includes('J10-2') && (
          <div onClick={() => handleFolderClick("ClientDashboard")}
            className="folder-box"> Client Dashboard</div>
        )}






      </div>

      {renderFolderContent()}
    </div>
  )
}

export default OldInsuranceFolder