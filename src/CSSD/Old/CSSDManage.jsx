import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CSSDTrayMaster from "./CSSDTrayMaster";
import CSSDTrayCreation from "./CSSDTrayCreation";

const CSSDManage = () => {
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
      case "TrayMaster":
        return <CSSDTrayMaster />;
      case "TrayCreation":
        return <CSSDTrayCreation />;

      default:
        return <CSSDTrayMaster />;
    }
  };

  return (
    <div className="folder-container">
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {showMenu && !subAccess.includes("V20-1") && (
          <div
            onClick={() => handleFolderClick("TrayMaster")}
            className="folder-box"
          >
            CSSD Tray Hit Master
          </div>
        )}
        
        {showMenu && !subAccess.includes("V20-2") && (
          <div
            onClick={() => handleFolderClick("TrayCreation")}
            className="folder-box"
          >
            CSSD Tray Creation
          </div>
        )}
      </div>

      {renderFolderContent()}
    </div>
  );
};

export default CSSDManage;
