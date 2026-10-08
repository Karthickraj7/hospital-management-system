import React, { useState, useEffect } from "react";
import EmployeeRegistration from "./EmployeeRegistration";
import EmployeeRegistrationList from "./EmployeeRegistrationList";
import EmployeeReport from "./EmployeeReport";
import JobRequirement from "./JobRequiremet";

import EmployeeSourceWiseList from "./EmployeeSourceWiseList";
import LeaveManagementNavigation from "./LeaveManagementNavigation";
import AdvanceManagementNavigation from "./AdvanceManagementNavigation";
import EmployeeDutyManagement from "./EmployeeDutyManagement";
import EmployeeAttendance from "./Attendance";
import PayRoll from "./PayRoll";
import ApraisalNavigation from "./ApraisalNavigation";
import ComplaintAction from "./ComplaintAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Circular from "./Circular";
import DutyRosterMasterList from "./DutyRosterMasterList";
// import HrDashboard from "./HrDashboard";
import UserRegisterMaster from "../Masters/UserRegisterMaster/UserRegisterMaster";
import DutyRoster from "./DutyRoster";
import TraineeRegistration from "./TraineeRegistration";
import TraineeRegistrationlist from "./TraineeRegistrationlist";
import LeaveMaster from "./LeaveMaster";
import AllowanceMaster from "./AllowanceMaster";
import DeductionMaster from "./DeductionMaster";
import EmployeeGoogleStyleCalendar from "./EmployeeGoogleStyleCalendar";
import ShiftApproval from "./ShiftApproval";
import NurseMappingtoNurseStation from "./NurseMappingtoNurseStation";
import NursevsNurseStationList from "./NursevsNurseStationList";
import EmployeeMaster from "./EmployeeMaster";
import NewPayroll from "./NewPayRoll";
import HRDashBBoardNew from "./HRDashBoardNew";
import EmployeeMapping from "./EmployeeMapping";
import Documents from "./Documents/Documents";
import OverTimeManagement from "./OvertimeManagement";
import OtAssignedTable from "./OtAssignedPrint";
import PayRollReport from "./PayRollReport";
import AttendanceReport from "./AttendanceReport";
import Hr_SubmitReport from "./HR_SubmitReport";
const HRFolder = () => {
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);
  // const [activeFolder, setActiveFolder] = useState("HrDashboard");
  const [showFolders, setShowFolders] = useState(false);
  // console.log(activeHrFolder,'activeHrFolder');

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
    dispatchvalue({ type: "setPreviousFolder", value: activeFolder });
    dispatchvalue({ type: "setActiveFolder", value: folderName });
    dispatchvalue({ type: "showMenu", value: false });
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
      case "HrDashboard":
        return <HRDashBBoardNew />;

      case "EmployeeRegistration":
        return <EmployeeRegistration />;
      case "EmployeeRegistrationList":
        return <EmployeeRegistrationList />;
      case "EmployeeSourceWiseList":
        return <EmployeeSourceWiseList />;
      case "Attendance":
        // return <EmployeeAttendance />;
        return <EmployeeGoogleStyleCalendar />;
      case "DutyRosterMasterList":
        return <DutyRosterMasterList />;
      case "LeaveMangement":
        return <LeaveManagementNavigation />;
      case "EmployeeReport":
        return <EmployeeReport />;
      case "PayRoll":
        return <NewPayroll />;
      case "JobRequirements":
        return <JobRequirement />;
      case "AdvanceManagementNavigation":
        return <AdvanceManagementNavigation />;
      case "ShiftManagement":
        return <EmployeeDutyManagement />;
      case "Performance":
        return <ApraisalNavigation />;
      case "ComplaintAction":
        return <ComplaintAction />;
      case "Circular":
        return <Circular />;
      case "ShiftApproval":
        return <ShiftApproval />;
      case "OverTimeManagement":
        return <OverTimeManagement />;
      case "OtAssignedTable":
        return <OtAssignedTable />;

      case "TraineeRegistrationList":
        return <TraineeRegistrationlist />;

      case "TraineeRegistration":
        return <TraineeRegistration />;

      case "UserRegisterMaster":
        return <UserRegisterMaster />;

      case "DutyRoster":
        return <DutyRoster />;

      case "LeaveMaster":
        return <LeaveMaster />;
      case "AllowanceMaster":
        return <AllowanceMaster />;
      case "DeductionMaster":
        return <DeductionMaster />;
      case "NurseMappingToNurseStation":
        // return <NurseMappingtoNurseStation />;
        return <NursevsNurseStationList />;
      case "EmployeeMaster":
        return <EmployeeMaster />;
      case "EmployeeMapping":
          return <EmployeeMapping />;

          case "Documents":
            return <Documents />;

      case "PayRollReport":
        return <PayRollReport />;
      case "AttendanceReport":
        return <AttendanceReport />;
      case "Hr_SubmitReport":
        return <Hr_SubmitReport />;

      default:
        return <HRDashBBoardNew />;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>HR Management</h2> */}
      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {/* {subAccess.includes('S19-1') && (
          <div onClick={() => handleFolderClick("EmployeeRegistration")}
            className="folder-box"> Employee Registration</div>
        )} */}

        {showMenu && !subAccess.includes("S19-14") && (
          <div
            onClick={() => handleFolderClick("HrDashboard")}
            className="folder-box"
          >
            {" "}
            Hr Dashboard
          </div>
        )}

        {showMenu && subAccess.includes("T20-1") && (
          <div
            onClick={() => handleFolderClick("EmployeeRegistrationList")}
            className="folder-box"
          >
            {" "}
            Employee Registration{" "}
          </div>
        )}

        {showMenu && subAccess.includes("T20-2") && (
          <div
            onClick={() => handleFolderClick("DutyRosterMasterList")}
            className="folder-box"
          >
            {" "}
            Shift Master
          </div>
        )}

        {showMenu && subAccess.includes("T20-3") && (
          <div
            onClick={() => handleFolderClick("NurseMappingToNurseStation")}
            className="folder-box"
          >
            {" "}
            Nurse Vs NurseStation
          </div>
        )}

        {showMenu && subAccess.includes("T20-4") && (
          <div
            onClick={() => handleFolderClick("ShiftManagement")}
            className="folder-box"
          >
            {" "}
            Shift Assign
          </div>
        )}
        {showMenu && subAccess.includes("T20-22") && (
          <div
            onClick={() => handleFolderClick("OverTimeManagement")}
            className="folder-box"
          >
            {" "}
            OverTime Management
          </div>
        )}
        {showMenu && subAccess.includes("T20-23") && (
          <div
            onClick={() => handleFolderClick("OtAssignedTable")}
            className="folder-box"
          >
            {" "}
           Ot Assigned List
          </div>
        )}

        {showMenu && subAccess.includes("T20-5") && (
          <div
            onClick={() => handleFolderClick("EmployeeMaster")}
            className="folder-box"
          >
            {" "}
            Employee Master
          </div>
        )}

        {showMenu && subAccess.includes("T20-6") && (
          <div
            onClick={() => handleFolderClick("ShiftApproval")}
            className="folder-box"
          >
            {" "}
            Shift Approval
          </div>
        )}

        {showMenu && subAccess.includes("T20-7") && (
          <div
            onClick={() => handleFolderClick("LeaveMangement")}
            className="folder-box"
          >
            {" "}
            Leave Mangement
          </div>
        )}

        {showMenu && subAccess.includes("T20-8") && (
          <div
            onClick={() => handleFolderClick("AdvanceManagementNavigation")}
            className="folder-box"
          >
            {" "}
            Advance Management
          </div>
        )}

        {showMenu && subAccess.includes("T20-9") && (
          <div
            onClick={() => handleFolderClick("Attendance")}
            className="folder-box"
          >
            {" "}
            Attendance Management
          </div>
        )}
        {showMenu && subAccess.includes("T20-10") && (
          <div
            onClick={() => handleFolderClick("PayRoll")}
            className="folder-box"
          >
            {" "}
            PayRoll
          </div>
        )}

        {showMenu && subAccess.includes("T20-11") && (
          <div
            onClick={() => handleFolderClick("EmployeeReport")}
            className="folder-box"
          >
            {" "}
            Employee Report
          </div>
        )}
        {showMenu && subAccess.includes("T20-12") && (
          <div
            onClick={() => handleFolderClick("JobRequirements")}
            className="folder-box"
          >
            {" "}
            Job Requirements
          </div>
        )}
        {showMenu && subAccess.includes("T20-13") && (
          <div
            onClick={() => handleFolderClick("EmployeeSourceWiseList")}
            className="folder-box"
          >
            {" "}
            Candidate List
          </div>
        )}

        {showMenu && subAccess.includes("T20-14") && (
          <div
            onClick={() => handleFolderClick("Performance")}
            className="folder-box"
          >
            {" "}
            Performance Management
          </div>
        )}
        {showMenu && subAccess.includes("T20-15") && (
          <div
            onClick={() => handleFolderClick("ComplaintAction")}
            className="folder-box"
          >
            Complaint/Grievance
          </div>
        )}

        {showMenu && subAccess.includes("T20-16") && (
          <div
            onClick={() => handleFolderClick("Circular")}
            className="folder-box"
          >
            Circular
          </div>
        )}

        {showMenu && subAccess.includes("T20-17") && (
          <div
            onClick={() => handleFolderClick("TraineeRegistrationList")}
            className="folder-box"
          >
            TraineeRegistration
          </div>
        )}
        {showMenu && subAccess.includes("T20-18") && (
          <div
            onClick={() => handleFolderClick("LeaveMaster")}
            className="folder-box"
          >
            LeaveMaster
          </div>
        )}
        {showMenu && subAccess.includes("T20-19") && (
          <div
            onClick={() => handleFolderClick("AllowanceMaster")}
            className="folder-box"
          >
            AllowanceMaster
          </div>
        )}
        {showMenu && subAccess.includes("T20-20") && (
          <div
            onClick={() => handleFolderClick("DeductionMaster")}
            className="folder-box"
          >
            DeductionMaster
          </div>
        )}

        {/* {showMenu && subAccess.includes("T20-17") && (
          <div
            onClick={() => handleFolderClick("IDCardPage")}
            className="folder-box"
          >
            IDCardPage
          </div>
        )} */}

        {showMenu && subAccess.includes("T20-21") && (
          <div
            onClick={() => handleFolderClick("EmployeeMapping")}
            className="folder-box"
          >
            {" "}
            Employee Mapping{" "}
          </div>
        )}


{showMenu && !subAccess.includes("T20-22") && (
          <div
            onClick={() => handleFolderClick("Documents")}
            className="folder-box"
          >
            {" "}
            Documents{" "}
          </div>
        )}
{showMenu && subAccess.includes("T20-24") && (
          <div
            onClick={() => handleFolderClick("PayRollReport")}
            className="folder-box"
          >
            {" "}
            Pay Roll Report{" "}
          </div>
        )}
{showMenu && subAccess.includes("T20-25") && (
          <div
            onClick={() => handleFolderClick("AttendanceReport")}
            className="folder-box"
          >
            {" "}
           Attendance Report{" "}
          </div>
        )}
{showMenu && subAccess.includes("T20-26") && (
          <div
            onClick={() => handleFolderClick("Hr_SubmitReport")}
            className="folder-box"
          >
            {" "}
         Hr SubmitReport{" "}
          </div>
        )}


      </div>

      {renderFolderContent()}
    </div>
  );
};

export default HRFolder;
