import React, { useState, useEffect } from "react";
import ResultEntryQueueList from "../Lab/ResultEntryQueueList";
import SampleCollectionQueue from "../Lab/SampleCollectionQueue";
import { useDispatch, useSelector } from 'react-redux'
import SampleCollection from "../Lab/SampleCollection";
import IP_LabDischargeQueslist from "../IP_Workbench/Nurse/Discharge/IP_LabDischargeQueslist";

// import LabRequest from "../Lab/LabRequest";
// import Labvalue from "../Lab/Labvalue";
// import IP_LabDischargeQueslist from "../IP_Workbench/Nurse/Discharge/IP_LabDischargeQueslist";
// import PatientLablist from "../Lab/PatientLablist";
// import TestWiseReport from "../Lab/TestWiseReport";

import Phelobotomist from "./Phelobotomist/CaptureSample";
import LabTechnician from "./LabTechnician/AnalyzeReportEntry";
import SeniorTechnician from "./Sr.LabTechnician/VerifyLabEntry";
import Pathologist from "./Pathologist/Authorize-Approval";
import Dispatch from "./Dispatch/DispatchTransactionHistory";
import TestCount from "./Dispatch/TestCount"
import Provisionalreportlist from "./LabTechnician/provisionalreportlist";
import ProvisionalReports from "./LabTechnician/ProvisionalReport";
import NavigationLab from "./LabTechnician/NavigationLab";
import Navigationseior from "./Sr.LabTechnician/Navigationsenior";
import Verifyreport from "./Sr.LabTechnician/VerifyLabEntry";
import Navigationpath from "./Pathologist/Navigationpath";
import Approvereport from "./Pathologist/Authorize-Approval";
import DispatchList from "./Dispatch/DispatchTransactionHistory";
import Navigationple from "./Phelobotomist/Navigationple";
import Patienttestlist from "./LabTechnician/Patienttestlist";
import { BarcodePrint } from "./Phelobotomist/BarcodePrint";
import DocTest from "./LabTechnician/docTest";
import TAT from "./Report/TAT";

import Reports from "./Report/NewReports";


const LabFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch()

  // const [activeFolder, setActiveFolder] = useState("SampleCollectionQueue");
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
      case "Patienttestlist":
        return <Patienttestlist />;
      case "Phelobotomist":
        return <Phelobotomist />;
      case "LabTechnician":
        return <LabTechnician />;
      case "SrTechnician":
        return <SeniorTechnician />;
      case "Pathologist":
        return <Pathologist />;
      case "Dispatch":
        return <Dispatch />;
      case "IP_LabDischargeQueslist":
        return <IP_LabDischargeQueslist />;
      case "LabTestCount":
        return <TestCount />;
      case "provisionalreportlist":
        return <Provisionalreportlist />;

      case "provisionalreport":
        return <ProvisionalReports />;


      case "NavigationLab":
        return <NavigationLab />;
      case "Navigationseior":
        return <Navigationseior />

      case "Verifyreport":
        return <Verifyreport />
      case "Navigationpath":
        return <Navigationpath />


      case "Approvereport":
        return <Approvereport />

      case "Reports":
        return <Reports />;

      case "DispatchList":
        return <DispatchList />;

      case "phelobotomistnavigation":
        return <Navigationple />;
      case "BarcodePrint":
        return <BarcodePrint />;

      case "TAT":
        return <TAT />

      default:
        return <Patienttestlist />;

    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Lab</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>


        {showMenu && subAccess.includes('L12-8') && (
          <div onClick={() => handleFolderClick("Patienttestlist")}
            className="folder-box"> Patient List</div>
        )}

        {showMenu && subAccess.includes('L12-1') && (
          <div onClick={() => handleFolderClick("Phelobotomist")}
            className="folder-box"> Phelobotomist </div>
        )}

        {showMenu && subAccess.includes('L12-2') && (
          <div onClick={() => handleFolderClick("LabTechnician")}
            className="folder-box"> Lab Technician</div>
        )}
        {showMenu && subAccess.includes('L12-3') && (
          <div onClick={() => handleFolderClick("SrTechnician")}
            className="folder-box"> Senior Technician</div>
        )}
        {showMenu && subAccess.includes('L12-4') && (
          <div onClick={() => handleFolderClick("Pathologist")}
            className="folder-box">Pathologist</div>
        )}
        {showMenu && subAccess.includes('L12-5') && (
          <div onClick={() => handleFolderClick("Dispatch")}
            className="folder-box">Dispatch</div>
        )}
        {showMenu && subAccess.includes('L12-6') && (
          <div onClick={() => handleFolderClick("IP_LabDischargeQueslist")}
            className="folder-box"> IP Lab Discharge Queslist</div>
        )}
        {showMenu && subAccess.includes('L12-7') && (
          <div onClick={() => handleFolderClick("LabTestCount")}
            className="folder-box">Lab Test Data</div>
        )}
         {showMenu && subAccess.includes('L12-7') && (
          <div onClick={() => handleFolderClick("TAT")}
            className="folder-box">TAT Report</div>
        )}

      </div>

      {renderFolderContent()}
    </div>
  )
}

export default LabFolder