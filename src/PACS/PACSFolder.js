import React, { useState, useEffect } from "react";
import RadiologyQueList from "./RadiologyQueList";
import Mritechnician from "./Mritechnician";
import Cttechnician from "./Cttechnician";
import XRayTechnician from "./XRayTechnician";
import UsgTechnician from "./UsgTechnician";
import IP_RadiologyDischargeQueslist from "./IP_RadiologyDischargeQueslist";

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Radiologistdoctor from "./Radiologistdoctor";
import Rough from "./Dispatch";
import RadiologyReportsnew from "./RadiologyReportsNew";
import RadiologyReportsOriginal from "./RadiologyReportsOriginal";

import RadPatienttestlist from "../PACSNew/RadPatienttestlist";
import DocTest from "../LabNew/LabTechnician/docTest";
import NavigationRad from "../PACSNew/NavigationRad";
import DocTest2 from "../PACSNew/docTest2";
import Retro from "./Retro";

const PACS = () => {
  const activeHrFolder  = useSelector((state) => state.userRecord?.HrFolder);
  const showMenu        = useSelector((state) => state.userRecord?.showMenu);
  const activeFolder    = useSelector((state) => state.userRecord?.activeFolder);
  const UserData        = useSelector(state  => state.userRecord?.UserData);
  const dispatchvalue   = useDispatch();

  const [showFolders, setShowFolders] = useState(false);
  const [subAccess, setSubAccess]     = useState([]);

  useEffect(() => {
    if (UserData) {
      const setAccess2 =
        (UserData.AccessTwo && UserData.AccessTwo.split(',').map(item => item.trim())) || [];
      setSubAccess(setAccess2);
    }
  }, [UserData]);

  const handleFolderClick = (folderName) => {
    dispatchvalue({ type: "setPreviousFolder", value: activeFolder });
    dispatchvalue({ type: "setActiveFolder",   value: folderName  });
    dispatchvalue({ type: "showMenu",          value: false       });
  };

  useEffect(() => {
    if (activeHrFolder !== "") {
      dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
      dispatchvalue({ type: "HrFolder",        value: ""            });
    }
    setShowFolders(true);
  }, [activeHrFolder, dispatchvalue]);

  const renderFolderContent = () => {
    switch (activeFolder) {
      case "RadiologyQuelist":              return <RadiologyQueList />;
      case "Radiologistdoctor":             return <Radiologistdoctor />;
      case "Mritechnician":                 return <Mritechnician />;
      case "Cttechnician":                  return <Cttechnician />;
      case "XRayTechnician":                return <XRayTechnician />;
      case "UsgTechnician":                 return <UsgTechnician />;
      case "IP_RadiologyDischargeQueslist": return <IP_RadiologyDischargeQueslist />;
      case "RadiologyReportsNew":           return <RadiologyReportsnew />;
      case "RadiologyReportsOriginal":      return <RadiologyReportsOriginal />;
      case "Dispatch":                      return <Rough />;
      case "PatientList":                   return <RadPatienttestlist />;
      case "ReportCapture":                 return <DocTest />;
      case "ReportVerify":                  return <DocTest2 />;
      case "NavigateRad":                   return <NavigationRad />;
      case "PrintPaper":                    return <Retro />;
      default:                              return <RadPatienttestlist />;
    }
  };

  return (
    <div className="folder-container">
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

        {showMenu && subAccess.includes('M13-1') && (
          <div onClick={() => handleFolderClick("RadiologyQuelist")} className="folder-box">
            Radiology Quelist
          </div>
        )}

        {showMenu && subAccess.includes('M13-2') && (
          <div onClick={() => handleFolderClick("Mritechnician")} className="folder-box">
            MRI Technician
          </div>
        )}

        {showMenu && subAccess.includes('M13-3') && (
          <div onClick={() => handleFolderClick("Cttechnician")} className="folder-box">
            CT Technician
          </div>
        )}

        {showMenu && subAccess.includes('M13-4') && (
          <div onClick={() => handleFolderClick("XRayTechnician")} className="folder-box">
            XRay Technician
          </div>
        )}

        {showMenu && subAccess.includes('M13-5') && (
          <div onClick={() => handleFolderClick("UsgTechnician")} className="folder-box">
            USG Technician
          </div>
        )}

        {showMenu &&
          ["M13-8", 'M13-7', 'M13-5', 'M13-4', 'M13-3', 'M13-2'].some(code => subAccess.includes(code)) && (
          <div onClick={() => handleFolderClick("PatientList")} className="folder-box">
            Radiology
          </div>
        )}

      </div>

      {renderFolderContent()}
    </div>
  );
};

export default PACS;
