import React, { useState, useEffect } from "react";
import HospitalDetials from "./HospitalMaster/HospitalDetials";
import DutyRousterMaster from "./HRMasters/DutyRousterMaster";
import ConsentFormsMaster from "./ConsentForms/ConsentFormsMaster";
import RoomMaster from "./RoomMaster/RoomMaster";
import ReferalRoute from "./ReferalRouteMaster/ReferalRoute";
import DoctorList from "./DoctorMaster/DoctorList";
import BasicMaster from "./BasicMaster/BasicMaster";
import OtMaster from "./OtMaster/OtMaster";
import AnaesthesiaMaster from "./OtMaster/AnaesthesiaMaster";
import UserRegisterList from "./UserRegisterMaster/UserRegisterList";
import ServiceProcedureMasterList from "./ServiceProcedureMaster/ServiceProcedureMasterList";
import LabMaster from "./LabMaster/LabMaster";
import SurgeryMaster from "./SurgeryMaster/SurgeryMaster";
import FrequencyMaster from "./RoomMaster/FrequencyMaster";
import Apprenewal from "./BasicMaster/Apprenewal";
import LocationMaster from "./LocationMaster/LocationMaster";
import TherapyMaster from "./TherapyMaster/TherapyMaster";
import RadiologyMaster from "./RadiologyMaster/RadiologyMaster";
// import RatecardMaster from "./RatecardMaster/RatecardMaster";
import ICDCodeMaster from "./ICD10code/ICDCodeMaster";
import RatecardMaster from "./RateCard/Ratecard";
import NurseStationMaser from "./NurseStationMaser";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LabMasterNavigation from "./LabMaster/LabMasterNavigation";
import Servicecategory from "./ServiceProcedureMaster/Servicecategory";
import ServiceSubCategory from "./ServiceSubCategory/ServiceSubCategory";
import PackageMaster from "./PackageMaster/PackageMaster";
import DoctorCalender from "./DoctorMaster/DoctorCalender";
import DoctorRatecardList from "./DoctorMaster/DoctorRatecardList";
import DoctorMaster from "./DoctorMaster/DoctorMaster";
import UserRegisterMaster from "./UserRegisterMaster/UserRegisterMaster";
import InsClientDonationMaster from "./InsuranceClientMaster/InsClientDonationMaster";
import ServiceProcedureRatecard from "./ServiceProcedureMaster/ServiceProcedureRatecard";
import ServiceProcedureMaster from "./ServiceProcedureMaster/ServiceProcedureMaster";
import TestMaster from "../LabMasters/TestMaster";
import ExternalLab from "../LabMasters/ExternalLab";
import ReferDocs from "../LabMasters/ReferDocs";
import GroupMaster from "../LabMasters/GroupMaster";
import SurgeryProcedureRatecardView from "./SurgeryMaster/SurgeryProcedureRatecardView";
import VentilatorType from "./VentilatorType/VentilatorType";
import DiseaseNameMaster from "./DiseaseNameMaster/DiseaseNameMaster";
import GeneralEvaluationMaster from "./GeneralEvaluationMaster/GeneralEvaluationMaster";
import InsClientDonationList from "./InsuranceClientMaster/InsClientDonationList";
import RoomRateCardList from "./RoomMaster/RoomRateCardList";
import DiscountMaster from "./DiscountMaster/DiscountMaster";
import PatientDetailsMaster from "./PatientDetailsMaster/PatientDetailsMaster";
import NurseStationAssets from "./NurseStationAssets";

import VaccinationChart from "./VaccinationMaster";


const MasterFolder = () => {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  const dispatchvalue = useDispatch();

  // const [activeFolder, setActiveFolder] = useState("HospitalClinicMaster");
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
      case "HospitalClinicMaster":
        return <HospitalDetials />;
      case "DutyRousterMaster":
        return <DutyRousterMaster />;
      case "ConsentFormsMaster":
        return <ConsentFormsMaster />;
      case "RoomMaster":
        return <RoomMaster />;
      case "Referal_Route":
        return <ReferalRoute />;
      case "DoctorList":
        return <DoctorList />;

      case "Doctor_Calender":
        return <DoctorCalender />;

      case "DoctorRatecardList":
        return <DoctorRatecardList />;
      case "SurgeryProcedureRatecardView":
        return <SurgeryProcedureRatecardView />;

      case "Doctor_Master":
        return <DoctorMaster />;

      case "UserRegisterMaster":
        return <UserRegisterMaster />;

      case "InsClientDonationMaster":
        return <InsClientDonationMaster />;

      case "ServiceProcedureRatecard":
        return <ServiceProcedureRatecard />;

      case "ServiceProcedureMaster":
        return <ServiceProcedureMaster />;

      case "Basic_Master":
        return <BasicMaster />;
      case "OtMaster":
        return <OtMaster />;
      case "AnaesthesiaMaster":
        return <AnaesthesiaMaster />;
      case "UserRegisterList":
        return <UserRegisterList />;
      case "InsClientDonationList":
        return <InsClientDonationList />;
      case "Radiology_Master":
        return <RadiologyMaster />;
      case "ServiceProcedureMasterList":
        return <ServiceProcedureMasterList />;
      case "TestMaster":
        return <TestMaster />;

      case "Servicecategory":
        return <Servicecategory />;
      case "ServiceSubCategory":
        return <ServiceSubCategory />;
      case "Lab_Master":
        return <LabMasterNavigation />;
      case "Surgery_Master":
        return <SurgeryMaster />;
      case "FrequencyMaster":
        return <FrequencyMaster />;
      case "apprenewal":
        return <Apprenewal />;
      case "LocationMaster":
        return <LocationMaster />;
      case "TherapyMaster":
        return <TherapyMaster />;
      case "RatecardMaster":
        return <RatecardMaster />;
      case "RatecardMaster1":
        return <RatecardMaster />;
      case "ICDCodeMaster":
        return <ICDCodeMaster />;
      case "NurseStationMaser":
        return <NurseStationMaser />;
      case "PackageMaster":
        return <PackageMaster />;

      case "ExternalLab":
        return <ExternalLab />;
      case "Referdoctormaster":
        return <ReferDocs />;

      case "GroupMaster":
        return <GroupMaster />;
      case "VentilatorType":
        return <VentilatorType />;
      case "DiseaseNameMaster":
        return <DiseaseNameMaster />;
      case "GeneralEvaluationMaster":
        return <GeneralEvaluationMaster />; 
      case "RoomRateCardList":
          return <RoomRateCardList />;
      case "DiscountMaster":
            return <DiscountMaster />;
      case "PatientDetailsMaster":
            return <PatientDetailsMaster />;
      case "NurseStationAssets":
            return <NurseStationAssets />;
      case "VaccinationChart":
            return <VaccinationChart />;
            
          
      default:
        return <HospitalDetials />;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Masters</h2> */}

      <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {showMenu && subAccess.includes("O15-1") && (
          <div
            onClick={() => handleFolderClick("HospitalClinicMaster")}
            className="folder-box"
          >
            Hospital / Clinic Master
          </div>
        )}

        {/* {subAccess.includes('J10-2') && (


          <div
            onClick={() => handleFolderClick("DutyRousterMaster")}
            className="folder-box"
          >
            Duty Rouster Master
          </div>
        )} */}

        {showMenu && subAccess.includes("O15-3") && (
          <div
            onClick={() => handleFolderClick("ConsentFormsMaster")}
            className="folder-box"
          >
            Consent Forms Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-4") && (
          <div
            onClick={() => handleFolderClick("RoomMaster")}
            className="folder-box"
          >
            Room Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-5") && (
          <div
            onClick={() => handleFolderClick("Referal_Route")}
            className="folder-box"
          >
            Referal Route
          </div>
        )}

        {showMenu && subAccess.includes("O15-6") && (
          <div
            onClick={() => handleFolderClick("DoctorList")}
            className="folder-box"
          >
            Doctor Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-7") && (
          <div
            onClick={() => handleFolderClick("Basic_Master")}
            className="folder-box"
          >
            Basic Master
          </div>
        )}

        {/* {showMenu && subAccess.includes('O15-8') && (

          <div
            onClick={() => handleFolderClick("OtMaster")}
            className="folder-box"
          >
            Operation Theatre Master
          </div>
        )} */}

        {showMenu && subAccess.includes("O15-9") && (
          <div
            onClick={() => handleFolderClick("AnaesthesiaMaster")}
            className="folder-box"
          >
            Anaesthesia Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-10") && (
          <div
            onClick={() => handleFolderClick("UserRegisterList")}
            className="folder-box"
          >
            User Register List
          </div>
        )}

        {showMenu && subAccess.includes("O15-11") && (
          <div
            onClick={() => handleFolderClick("InsClientDonationList")}
            className="folder-box"
          >
            Insurence/ Client/ Donation List
          </div>
        )}

        {showMenu && subAccess.includes("O15-12") && (
          <div
            onClick={() => handleFolderClick("ServiceProcedureMasterList")}
            className="folder-box"
          >
            Service Therapy Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-13") && (
          <div
            onClick={() => handleFolderClick("Servicecategory")}
            className="folder-box"
          >
            Servicecategory
          </div>
        )}

        {showMenu && subAccess.includes("O15-14") && (
          <div
            onClick={() => handleFolderClick("ServiceSubCategory")}
            className="folder-box"
          >
            ServiceSubCategory
          </div>
        )}

        {showMenu && subAccess.includes("O15-15") && (
          <div
            onClick={() => handleFolderClick("Radiology_Master")}
            className="folder-box"
          >
            Radiology Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-16") && (
          <div
            onClick={() => handleFolderClick("Lab_Master")}
            className="folder-box"
          >
            Lab Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-17") && (
          <div
            onClick={() => handleFolderClick("Surgery_Master")}
            className="folder-box"
          >
            Surgery Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-18") && (
          <div
            onClick={() => handleFolderClick("FrequencyMaster")}
            className="folder-box"
          >
            Frequency Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-19") && (
          <div
            onClick={() => handleFolderClick("apprenewal")}
            className="folder-box"
          >
            Software Renewal
          </div>
        )}

        {showMenu && subAccess.includes("O15-20") && (
          <div
            onClick={() => handleFolderClick("LocationMaster")}
            className="folder-box"
          >
            Location Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-21") && (
          <div
            onClick={() => handleFolderClick("TherapyMaster")}
            className="folder-box"
          >
            Therapy Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-22") && (
          <div
            onClick={() => handleFolderClick("RatecardMaster1")}
            className="folder-box"
          >
            Ratecard Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-23") && (
          <div
            onClick={() => handleFolderClick("ICDCodeMaster")}
            className="folder-box"
          >
            ICDCode Master
          </div>
        )}
        {showMenu && subAccess.includes("O15-24") && (
          <div
            onClick={() => handleFolderClick("NurseStationMaser")}
            className="folder-box"
          >
            NurseStation Master
          </div>
        )}

        {showMenu && subAccess.includes("O15-25") && (
          <div
            onClick={() => handleFolderClick("PackageMaster")}
            className="folder-box"
          >
            PackageMaster
          </div>
        )}
        {showMenu && subAccess.includes("O15-26") && (
          <div
            onClick={() => handleFolderClick("VentilatorType")}
            className="folder-box"
          >
            Ventilator Type
          </div>
        )}

        {showMenu && subAccess.includes("O15-27") && (
          <div
            onClick={() => handleFolderClick("GeneralEvaluationMaster")}
            className="folder-box"
          >
            Disease Name
          </div>
        )}
 
        {showMenu && subAccess.includes("O15-28") && (
          <div
            onClick={() => handleFolderClick("DiscountMaster")}
            className="folder-box"
          >
            Discount Master
          </div>
        )} 

        {showMenu && subAccess.includes("O15-29") && (
          <div
            onClick={() => handleFolderClick("PatientDetailsMaster")}
            className="folder-box"
          >
           Patient Details Master
          </div>
        )} 
          {showMenu && subAccess.includes("O15-30") && (
          <div
            onClick={() => handleFolderClick("VaccinationChart")}
            className="folder-box"
          >
           Vaccination Master
          </div>
        )} 
      </div>

      {renderFolderContent()}
    </div>
  );
};

export default MasterFolder;
