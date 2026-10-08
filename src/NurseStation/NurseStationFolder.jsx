import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IndentRaiseList from "./IndentRaiseList";
import IndentRaise from "./IndentRaise";
import IndentRecieve from "./IndentRecieve";
import IndentRecieveList from "./IndentRecieveList";
import IndentIssue from "./IndentIssue";
import IndentIssueList from "./IndentIssueList";
import StockNurseStation from "./StockNurseStation";
import DrugAdministrationNurseStation from "./DrugAdministrationNurseStation";
import NurseStationPatients from "./NurseStationPatients";
import NurseStationPationsRequst from "./NurseStationPationsRequst";
import LabRequest from "./LabRequest";
import RadiologyRequest from "./RadiologyRequest";
import DischargeRequest from "./DischargeRequest";
import OtRequest from "./OtRequest";
import DrugRequest from "./DrugRequest";
import NSAssets from "./NSAssets";
import IpHandoverQuelist from "./IpHandoverQuelist";


const NurseStationFolder = () => {
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

      setSubAccess(setAccess2);
    }
  }, [UserData]);

  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

  const handleFolderClick = (folderName) => {
    dispatchvalue({ type: "setPreviousFolder", value: activeFolder });
    dispatchvalue({ type: "setActiveFolder", value: folderName });
    dispatchvalue({ type: "showMenu", value: false });
  };

  useEffect(() => {
    console.log(activeHrFolder, "activeHrFolder");

    if (activeHrFolder !== "") {
      dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
      dispatchvalue({ type: "HrFolder", value: "" });
    }
    setShowFolders(true);
  }, [activeHrFolder, dispatchvalue]);

  const renderFolderContent = () => {
    switch (activeFolder) {

      case "NurseStationPatients":
        return <NurseStationPatients />;

      case "StockNurseStation":
        return <StockNurseStation />;

      case "DrugAdministrationNurseStation":
        return <DrugAdministrationNurseStation />;

      case "IndentRaiseList":
        return <IndentRaiseList />;

      case "IndentRaise":
        return <IndentRaise />;

      case "IndentRecieve":
        return <IndentRecieve />;

      case "IndentRecieveList":
        return <IndentRecieveList />;

      case "IndentIssue":
        return <IndentRecieveList />;

      case "IndentIssueList":
        return <IndentRecieveList />;

      case "NurseStationPationsRequst":
        return <NurseStationPationsRequst />;

      case "LabRequest":
        return <LabRequest />;

      case "RadiologyRequest":
        return <RadiologyRequest />;

      case "DischargeRequest":
        return <DischargeRequest />;

      case "OtRequest":
        return <OtRequest />;

      case "DrugRequest":
        return <DrugRequest />;

      case "NSAssets":
      return <NSAssets />

      case "IpHandoverQuelist":
        return <IpHandoverQuelist />

      default:
        return <NurseStationPatients />;

    }
  };

  return (
    <div className="folder-container">

      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >

        {showMenu && subAccess.includes("F6-5") && (
          <div
            onClick={() => handleFolderClick("NSAssets")}
            className="folder-box">NurseStation Assets</div>
        )}

        {showMenu && subAccess.includes("F6-6") && (
          <div
            onClick={() => handleFolderClick("IpHandoverQuelist")}
            className="folder-box">IP Handover</div>
        )}

        

        {showMenu && subAccess.includes("F6-1") && (
          <div
            onClick={() => handleFolderClick("NurseStationPatients")}
            className="folder-box">Patients</div>
        )}

        {showMenu && subAccess.includes("F6-2") && (
          <div
            onClick={() => handleFolderClick("StockNurseStation")}
            className="folder-box">Inventory</div>
        )}

        {showMenu && subAccess.includes("F6-3") && (
          <div
            onClick={() => handleFolderClick("DrugAdministrationNurseStation")}
            className="folder-box">Drug Administration NurseStation</div>
        )}

        {showMenu && subAccess.includes("F6-4") && (
          <div
            onClick={() => handleFolderClick("NurseStationPationsRequst")}
            className="folder-box">Patients Request</div>
        )}




      </div>
      {renderFolderContent()}
    </div>
  );
};

export default NurseStationFolder;
