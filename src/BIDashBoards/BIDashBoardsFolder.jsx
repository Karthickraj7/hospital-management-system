import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FODashboard from "../FrontOffice/FODashboard";
import Sixdoctor from "../OPD_Reception/Sixdoctor";
import Warddashboard from "../IP_Workbench/Warddashboard";
import CashierDashboard from "../FrontOffice/Billing/CashierDashboard";
// import HRDashBBoardNew from "../HR_Management/HRDashBoardNew";
import RevenueDashboard from "../FrontOffice/CalendarNew/RevenueDashboard";
import HRDashBBoardNew from "../FrontOffice/CalendarNew/HRDashBoardNew";


const BIDashBoardsFolder = () => {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);

  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

  // const [activeFolder, setActiveFolder] = useState("OP_patients");
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
      case "FronntOfficeDashboard":
        return <FODashboard />;

        case "Sixdoctor":
            return <Sixdoctor />;
            
            case "CashierDashboard":
                return <CashierDashboard />;
      case "Warddashboard":
        return <Warddashboard />;

        case "HRManagement":
            return <HRDashBBoardNew />;





                case "RevenueDashboard":
                    return <RevenueDashboard />;


      default:
        return <FODashboard />;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Out Patients Reception</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {showMenu && subAccess.includes("AE31-1") && (
          <div
            onClick={() => handleFolderClick("FronntOfficeDashboard")}
            className="folder-box"
          >
            {" "}
            Front Office
          </div>
        )}
        {showMenu && subAccess.includes("AE31-2") && (
          <div
            onClick={() => handleFolderClick("Sixdoctor")}
            className="folder-box"
          >
            {" "}
            OPD Reception
          </div>
        )}

        {showMenu && subAccess.includes("AE31-3") && (
          <div
            onClick={() => handleFolderClick("Warddashboard")}
            className="folder-box"
          >
            Ward Management
          </div>
        )}

{showMenu && subAccess.includes("AE31-4") && (
          <div
            onClick={() => handleFolderClick("CashierDashboard")}
            className="folder-box"
          >
            Cashier
          </div>
        )}


{showMenu && subAccess.includes("AE31-5") && (
          <div
            onClick={() => handleFolderClick("HRManagement")}
            className="folder-box"
          >
            HR Management
          </div>
        )}

{showMenu && subAccess.includes("AE31-6") && (
          <div
            onClick={() => handleFolderClick("RevenueDashboard")}
            className="folder-box"
          >
            Revenue
          </div>
        )}


      </div>
      {renderFolderContent()}
    </div>
  );
};

export default BIDashBoardsFolder;
