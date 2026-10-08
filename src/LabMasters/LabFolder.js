import React, { useState, useEffect } from "react";
import ResultEntryQueueList from "../Lab/ResultEntryQueueList";
import SampleCollectionQueue from "../Lab/SampleCollectionQueue";
import { useDispatch, useSelector } from 'react-redux'
import SampleCollection from "../Lab/SampleCollection";

import LabRequest from "../Lab/LabRequest";
import Labvalue from "../Lab/Labvalue";
import IP_LabDischargeQueslist from "../IP_Workbench/Nurse/Discharge/IP_LabDischargeQueslist";
import PatientLablist from "../Lab/PatientLablist";
import TestWiseReport from "../Lab/TestWiseReport";



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
      case "SampleCollectionQueue":
        return <SampleCollectionQueue />;
      case "ResultEntryQueueList":
        return <ResultEntryQueueList />;
      case "LabRequest":
        return <LabRequest />;
      case "Labvalue":
        return <Labvalue />;
      case "IP_LabDischargeQueslist":
        return <IP_LabDischargeQueslist/>;

      case "TestWiseReport":
        return <TestWiseReport />;
  
      case "PatientLablist":
        return <PatientLablist />;


      case "SampleCollection":
        return <SampleCollection />;
      default:
        return <SampleCollectionQueue />;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Lab</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

        {showMenu && subAccess.includes('L12-1') && (
          <div onClick={() => handleFolderClick("SampleCollectionQueue")}
            className="folder-box"> LabRequest Queue</div>
        )}

        {showMenu && subAccess.includes('L12-2') && (
          <div onClick={() => handleFolderClick("ResultEntryQueueList")}
            className="folder-box"> ResultEntry Queue</div>
        )}
        {showMenu && subAccess.includes('L12-3') && (
          <div onClick={() => handleFolderClick("IP_LabDischargeQueslist")}
            className="folder-box"> IP_LabDischargeQueslist</div>
        )}

        {showMenu && subAccess.includes("L12-4") && (
          <div
            onClick={() => handleFolderClick("TestWiseReport")}
            className="folder-box"
          >
            {" "}
            TestWiseReport
          </div>
        )}
 
        {showMenu && subAccess.includes("L12-5") && (
          <div
            onClick={() => handleFolderClick("PatientLablist")}
            className="folder-box"
          >
            {" "}
            Patient Lab List
          </div>
        )}


      </div>

      {renderFolderContent()}
    </div>
  )
}

export default LabFolder