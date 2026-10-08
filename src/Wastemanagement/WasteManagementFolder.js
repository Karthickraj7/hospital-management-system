import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WasteManagement from "./WasteManagement";
import HandOver from "./HandOver";
import WasteContractor from "./WasteContractor";

const WasteManagementFolder = () => {
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);

  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);
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
      case "WasteManagement":
        return <WasteManagement />;
      case "HandOver":
        return <HandOver />;
      case "Waste Collecting Contractor":
        return <WasteContractor />
      default:
        return <WasteManagement />;
    }
  };

  return (
    <div>
      <div className="folder-box-container">
        {showMenu && subAccess.includes("Y25-1") && (
          <div
            onClick={() => handleFolderClick("WasteManagement")}
            className="folder-box"
          >
            Waste Management
          </div>
        )}

        {showMenu && subAccess.includes("Y25-2") && (
          <div
            onClick={() => handleFolderClick("HandOver")}
            className="folder-box"
          >
            Handover
          </div>
        )}

        {showMenu && subAccess.includes("Y25-3") && (
          <div
            onClick={() => handleFolderClick("Waste Collecting Contractor")}
            className="folder-box"
          >
            Waste Collecting Contractor
          </div>
        )}
      </div>
      {renderFolderContent()}
    </div>
  );
};

export default WasteManagementFolder;
