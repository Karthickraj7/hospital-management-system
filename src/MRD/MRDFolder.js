import React, { useState, useEffect } from "react";
import Mis_Navigation from "../MIS_Report/Mis_Navigation";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Mrdscanner from "./Mrdfilescanner";
import Mrdfilerack from "./MrdfileRack_Master";
import MCIRegistrationList from "./MCIRegistrationList";
import PatientReports from "../FrontOffice/Reports/PatientReports";
import MCIPatientReports from "./MCIPatientReports";
import MCIVisitEntry from "./MCIVisitEntry";
import RadiologyMCIReport from "./RadiologyMCIReport";
import RadiologyReportsMCI from "./RadiologyReportsMCI";
import FakeReportView from "./FakeReportView";
// import TestCount from "../LabNew/Dispatch/TestCount";

import TestCount from "./LabSums";
import LabReport from "./MRDReports";
import MCIOTRequest from "./MCIOTRequest";
import MCIIPRegistration from "./MCIIPRegistration";
import CountIncrease from "./CountIncrease";
import IPCountIncrease from "./IPCountIncrease";
import OPRegistration from "./OPRegistration";
import MRDNewRegistration from "./MRDNewRegistration";
import MRDPatientList from "./MRDPatientList";
import MRDPatientDetailsEdit from "./MRDPatientDetailsEdit";
import MRDRoomMaster from "./MRDRoomMaster";
import DiagnosisData from "./DiagnosisData";
import MedicalCodingReport from "./MedicalCodingReport";
import CasualityAdmission from "./CasualityAdmission";
import OPCountDecrease from "./OPCountDecrease";

import RadSums from "./RadSums";
import MRDMedicalDiagnosisReport from "./MRDMedicalDiagnosisReport";
import RadiologyCountIncrease from "./RadiologyCountIncrease";


function MRDFolder() {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);

  const SidebarToggle = useSelector(state => state.userRecord?.SidebarToggle)
  const UserData = useSelector(state => state.userRecord?.UserData)
  const dispatchvalue = useDispatch()
  const [openSubMenu, setOpenSubMenu] = useState(null)

  const [subAccess, setSubAccess] = useState([])
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

  useEffect(() => {
    if (!SidebarToggle) {
      setOpenSubMenu(null) // Close all submenus when sidebar collapses
    }
  }, [SidebarToggle])

  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {
      // const setAccess1 =
      //   (UserData.AccessOne &&
      //     UserData.AccessOne.split(',').map(item => item.trim())) ||
      //   []
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      // setMainAccess(setAccess1) // Update state for main access
      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array

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

      case "Mrdscanner":
        return <Mrdscanner />;

      case "Mrdfilerack":
        return <Mrdfilerack />

      case "MCIRegistrationList":
        return <MCIRegistrationList />

      case "MCIPatientReports":
        return <MCIPatientReports />

      case "MCIVisitEntry":
        return <MCIVisitEntry />

      case "RadiologyMCIReport":
        return <RadiologyMCIReport />

      case "RadiologyReportsMCI":
        return <RadiologyReportsMCI />;

      case "FakeReportView":
        return <FakeReportView />;

      case "LabTestCount":
        return <TestCount />;

      case "labReport":
        return <LabReport />;

      case "MCIOTRequest":
        return <MCIOTRequest />;

      case "MCIIPRegistration":
        return <MCIIPRegistration />

      case "OPCountDecrease":
        return <OPCountDecrease />

      case "IPCountIncrease":
        return <IPCountIncrease />;

      case "OPRegistration":
        return <OPRegistration />;

      case "MRDNewRegistration":
        return <MRDNewRegistration />;

      case "MRDPatientList":
        return <MRDPatientList />;

      case "MRDPatientDetailsEdit":
        return <MRDPatientDetailsEdit />;

      case "MRDRoomMaster":
        return <MRDRoomMaster />;

      case "DiagnosisData":

        return <DiagnosisData />;

      case "MedicalCodingReport":
        return <MedicalCodingReport />;

      case "CasualityAdmission":
        return <CasualityAdmission />;

      case "RadSums":
        return <RadSums />;

      case "MRDMedicalDiagnosisReport":

        return <MRDMedicalDiagnosisReport />;

      case "RadiologyCountIncrease":
        return <RadiologyCountIncrease />;

      case "CountIncrease":
        return <CountIncrease />;



      // default:
      //   return <Mrdscanner/>;
    }
  };


  return (
    <div className="folder-container">
      {/* <h2>Doctor</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {showMenu && subAccess.includes('W23-1') && (
          <div
            onClick={() => handleFolderClick("Mrdscanner")}
            className="folder-box"
          >
            MRD file track
          </div>
        )}

        {showMenu && subAccess.includes('W23-2') && (
          <div
            onClick={() => handleFolderClick("Mrdfilerack")}
            className="folder-box"
          >
            MRD Rack Shelf
          </div>
        )}

        {showMenu && subAccess.includes('W23-3') && (
          <div
            onClick={() => handleFolderClick("MCIRegistrationList")}
            className="folder-box"
          >
            Total Patient List
          </div>
        )}

        {showMenu && subAccess.includes('W23-4') && (
          <div
            onClick={() => handleFolderClick("MCIPatientReports")}
            className="folder-box"
          >
            Patient Reports
          </div>
        )}

        {showMenu && subAccess.includes('W23-5') && (
          <div
            onClick={() => handleFolderClick("RadiologyReportsMCI")}
            className="folder-box"
          >
            Radiology Reports
          </div>
        )}

        {showMenu && subAccess.includes("W23-6") && (
          <div
            onClick={() => handleFolderClick("LabTestCount")}
            className="folder-box"
          >
            Lab Summary Report
          </div>
        )}
        
        {showMenu && subAccess.includes("W23-6") && (
          <div
            onClick={() => handleFolderClick("RadSums")}
            className="folder-box"
          >
            Radiology Summary Report
          </div>
        )}

        {showMenu && subAccess.includes("W23-7") && (
          <div
            onClick={() => handleFolderClick("MCIOTRequest")}
            className="folder-box"
          >
            OT Request
          </div>
        )}

        {showMenu && subAccess.includes("W23-8") && (
          <div
            onClick={() => handleFolderClick("MCIIPRegistration")}
            className="folder-box"
          >
            IP Registration
          </div>
        )}

        {showMenu && subAccess.includes("W23-9") && (
          <div
            onClick={() => handleFolderClick("OPCountDecrease")}
            className="folder-box"
          >
            CountIncrease
          </div>
        )}

        {showMenu && subAccess.includes("W23-10") && (
          <div
            onClick={() => handleFolderClick("IPCountIncrease")}
            className="folder-box"
          >
            IP Count Increase
          </div>
        )}


        {showMenu && subAccess.includes("W23-11") && (
          <div
            onClick={() => handleFolderClick("OPRegistration")}
            className="folder-box"
          >
            OP Registration
          </div>
        )}


        {showMenu && subAccess.includes("W23-12") && (
          <div
            onClick={() => handleFolderClick("MRDNewRegistration")}
            className="folder-box"
          >
            New Registration
          </div>
        )}

        {showMenu && subAccess.includes("W23-13") && (
          <div
            onClick={() => handleFolderClick("MRDPatientList")}
            className="folder-box"
          >
            Patient Master
          </div>
        )}


        {showMenu && subAccess.includes("W23-14") && (
          <div
            onClick={() => handleFolderClick("MRDRoomMaster")}
            className="folder-box"
          >
            Room Master
          </div>
        )}


        {showMenu && subAccess.includes("W23-15") && (
          <div
            onClick={() => handleFolderClick("DiagnosisData")}
            className="folder-box"
          >
            Diagnosis Entry
          </div>
        )}


        {/* {showMenu && subAccess.includes("W23-16") && (
          <div
            onClick={() => handleFolderClick("MedicalCodingReport")}
            className="folder-box"
          >
            Medical Coding Report
          </div>
        )} */}


        {showMenu && subAccess.includes("W23-17") && (
          <div
            onClick={() => handleFolderClick("CasualityAdmission")}
            className="folder-box"
          >
            Casuality Admission
          </div>
        )}


        {showMenu && subAccess.includes("W23-16") && (
          <div
            onClick={() => handleFolderClick("MRDMedicalDiagnosisReport")}
            className="folder-box"
          >
            Medical Diagnosis Report
          </div>
        )}


        {showMenu && subAccess.includes("W23-18") && (
          <div
            onClick={() => handleFolderClick("RadiologyCountIncrease")}
            className="folder-box"
          >
            Radiology Entry
          </div>
        )}

        {showMenu && subAccess.includes("W23-18") && (
          <div
            onClick={() => handleFolderClick("CountIncrease")}
            className="folder-box"
          >
            Lab Entry
          </div>
        )}


        





















      </div>

      <br />

      {renderFolderContent()}
    </div>
  )
}

export default MRDFolder;
