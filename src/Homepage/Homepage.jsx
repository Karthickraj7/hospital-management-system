import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Homepage.css";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faHandsBound,
  faHospital,
  faUserTie,
  faIdCard,
  faHospitalUser,
  faUserDoctor,
  faBriefcaseMedical,
  faUserNurse,
  faBuildingShield,
  faPersonPregnant,
  faHandHoldingMedical,
  faSitemap,
  faBookMedical,
  faSackDollar,

  faPersonHiking,
  faClipboard,
  faBuildingWheat,
  faBedPulse,
  faXRay,
  faCashRegister,
  faSnowflake,
  faPersonBooth,
  faTape ,
  faDumpster ,
  faChartSimple,
  faRankingStar,
  faWorm,
  faTruckDroplet,
  faMoneyBill,
  faChartLine,
  faCartFlatbedSuitcase,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const navigate = useNavigate();
  const SidebarToggle = useSelector((state) => state.userRecord?.SidebarToggle);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const Usersessionid = useSelector((state) => state.userRecord?.Usersessionid);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const dispatchvalue = useDispatch();

  const [mainAccess, setMainAccess] = useState([]);
  const [subAccess, setSubAccess] = useState([]);

  useEffect(() => {
    if (!SidebarToggle) {
      setOpenSubMenu(null); // Close all submenus when sidebar collapses
    }
  }, [SidebarToggle]);

  useEffect(() => {
    console.log(UserData, "UserData");

    if (UserData) {
      const setAccess1 =
        (UserData.AccessOne &&
          UserData.AccessOne.split(",").map((item) => item.trim())) ||
        [];
      // const setAccess2 =
      //   (UserData.AccessTwo &&
      //     UserData.AccessTwo.split(',').map(item => item.trim())) ||
      //   []

      setMainAccess(setAccess1); // Update state for main access
      // setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]); // Dependency array

  const handleCardClick = (cardName, cardLink) => {
    dispatchvalue({ type: "activeCardName", value: cardName }); // Dispatch activeCardName to Redux
    navigate(cardLink); // Navigate to the corresponding page
  };

  return (
    <>
      <div className="home-page-container">
        <div className="cards-container">
          {mainAccess.includes("A") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("FrontOffice", "/Home/FrontOfficeFolder")
              }
            >
              <FontAwesomeIcon icon={faIdCard} className="card-icon" />
              <p className="card-title">Front Office</p>
            </div>
          )}

          {mainAccess.includes("B") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("OPD_Reception", "/Home/OPD_Reception")
              }
            >
              <FontAwesomeIcon
                icon={faBriefcaseMedical}
                className="card-icon"
              />
              <p className="card-title">OPD Reception</p>
            </div>
          )}

          {mainAccess.includes("C") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Nurse", "/Home/Nurse")}
            >
              <FontAwesomeIcon icon={faUserNurse} className="card-icon" />
              <p className="card-title">Nurse / EMR Technician</p>
            </div>
          )}

          {mainAccess.includes("D") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Doctor", "/Home/DoctorFolder")}
            >
              <FontAwesomeIcon icon={faUserDoctor} className="card-icon" />
              <p className="card-title">DOCTOR</p>
            </div>
          )}

          {mainAccess.includes("E") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("WardManagement", "/Home/WardManagementFolder")
              }
            >
              <FontAwesomeIcon icon={faBuildingShield} className="card-icon" />
              <p className="card-title">Ward Management</p>
            </div>
          )}

          {mainAccess.includes("F") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("NurseStationFolder", "/Home/NurseStationFolder")
              }
            >
              <FontAwesomeIcon icon={faPersonPregnant} className="card-icon" />
              <p className="card-title">Nurse Station</p>
            </div>
          )}

          {mainAccess.includes("G") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("OTManagement", "/Home/OTManagement")
              }
            >
              <FontAwesomeIcon icon={faHospital} className="card-icon" />
              <p className="card-title">OT Management</p>
            </div>
          )}

          {mainAccess.includes("H") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Pharmacy", "/Home/Pharmacy")}
            >
              <FontAwesomeIcon
                icon={faHandHoldingMedical}
                className="card-icon"
              />
              <p className="card-title">Pharmacy</p>
            </div>
          )}

          {mainAccess.includes("I") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Cashier", "/Home/CashierFolder")}
            >
              <FontAwesomeIcon icon={faSackDollar} className="card-icon" />
              <p className="card-title">Cashier</p>
            </div>
          )}


          {mainAccess.includes("J") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("Insurance", "/Home/Insurance")
              }
            >
              <FontAwesomeIcon icon={faHandsBound} className="card-icon" />
              <p className="card-title">Insurance / Client</p>
            </div>
          )}

          {/* CRMdashboard change K to AD */}
          
          {mainAccess.includes("AD") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("CRMdashboard", "/Home/CRMdashboard")}
            >
              <FontAwesomeIcon icon={faHospitalUser} className="card-icon" />
              <p className="card-title">CRM</p>
            </div>
          )}
          
          {/* {mainAccess.includes("K") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("CRMdashboard", "/Home/CRMdashboard")}
            >
              <FontAwesomeIcon icon={faHospitalUser} className="card-icon" />
              <p className="card-title">CRM</p>
            </div>
          )} */}

          {mainAccess.includes("L") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Lab", "/Home/Lab")}
            >
              <FontAwesomeIcon icon={faFlask} className="card-icon" />
              <p className="card-title">Lab</p>
            </div>
          )}

          {mainAccess.includes("M") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Radiology", "/Home/Radiology")}
            >
              <FontAwesomeIcon icon={faXRay} className="card-icon" />
              <p className="card-title">Radiology</p>
            </div>
          )}


          {mainAccess.includes("N") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Therapy", "/Home/Therapyfolder")}
            >
              <FontAwesomeIcon icon={faPersonHiking} className="card-icon" />
              <p className="card-title">Therapy</p>
            </div>
          )}

          {/* {mainAccess.includes('I') && (
          <div
            className="card_new_M"
            onClick={() => navigate("/Home/DischargeRequest")}
          >
            <FontAwesomeIcon icon={faPersonHiking} className="card-icon" />
            <p className="card-title">Discharge Request</p>
          </div>
        )} */}

          {mainAccess.includes("O") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Master", "/Home/MasterFolder")}
            >
              <FontAwesomeIcon icon={faPersonBooth} className="card-icon" />
              <p className="card-title">Master</p>
            </div>
          )}

          {mainAccess.includes("P") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("Inventory", "/Home/InventoryMaster")
              }
            >
              <FontAwesomeIcon icon={faClipboard} className="card-icon" />
              <p className="card-title">Inventory Master</p>
            </div>
          )}

          {mainAccess.includes("Q") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("AssetManagement", "/Home/AssetDashboard")
              }
            >
              <FontAwesomeIcon icon={faBuildingWheat} className="card-icon" />
              <p className="card-title">Asset Management</p>
            </div>
          )}

          {mainAccess.includes("R") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Lenin", "/Home/Lenin")}
            >
              <FontAwesomeIcon
                icon={faCartFlatbedSuitcase}
                className="card-icon"
              />
              <p className="card-title">Linen</p>
            </div>
          )}

          {mainAccess.includes("S") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("Finance", "/Home/Financefolder")}
            >
              <FontAwesomeIcon icon={faCashRegister} className="card-icon" />
              <p className="card-title">Finance</p>
            </div>
          )}

          {mainAccess.includes("T") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("HR", "/Home/HR")}
            >
              <FontAwesomeIcon icon={faSnowflake} className="card-icon" />
              <p className="card-title">HR</p>
            </div>
          )}


          {mainAccess.includes("U") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick(
                  "EmployeeRequest",
                  "/Home/EmployeeRequestFolder"
                )
              }
            >
              <FontAwesomeIcon icon={faUserTie} className="card-icon" />
              <p className="card-title">Employee Request</p>
            </div>
          )}

          {mainAccess.includes("V") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("MIS", "/Home/MISFolder")}
            >
              <FontAwesomeIcon icon={faSitemap} className="card-icon" />
              <p className="card-title">MIS</p>
            </div>
          )}

          {mainAccess.includes("W") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("MRD", "/Home/MRDFolder")}
            >
              <FontAwesomeIcon icon={faBookMedical} className="card-icon" />
              <p className="card-title">MRD</p>
            </div>
          )}

          {mainAccess.includes("X") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("CSSDManage", "/Home/CSSDManage")}
            >
             <FontAwesomeIcon icon={faTape}  className="card-icon" />
              <p className="card-title">CSSD</p>
            </div>
          )}

          {mainAccess.includes("Y") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick(
                  "WasteManagement",
                  "/Home/WasteManagementFolder"
                )
              }
            >
              <FontAwesomeIcon icon={faDumpster} className="card-icon" />
              <p className="card-title">Waste Management</p>
            </div>
          )}

          {/* {mainAccess.includes("Z") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("Marketing", "/Home/MarketingFolder")
              }
            >
              <FontAwesomeIcon icon={faChartSimple} className="card-icon" />
              <p className="card-title">Marketing</p>
            </div>
          )} */}

          {mainAccess.includes("AA") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick(
                  "QualityIndicators",
                  "/Home/QualityIndicatorsFolder"
                )
              }
            >
              <FontAwesomeIcon icon={faRankingStar} className="card-icon" />
              <p className="card-title">Quality Indicators</p>
            </div>
          )}

          {mainAccess.includes("AB") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("Casuality", "/Home/CasualityFolder")
              }
            >
              <FontAwesomeIcon icon={faWorm} className="card-icon" />
              <p className="card-title">Casuality</p>
            </div>
          )}

          {mainAccess.includes("AC") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("BloodBank", "/Home/BloodBankFolder")
              }
            >
              <FontAwesomeIcon icon={faTruckDroplet} className="card-icon" />
              <p className="card-title">Blood Bank</p>
            </div>
          )}

          {mainAccess.includes("AD") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("PettyCash", "/Home/PettyCashFolder")
              }
            >
              <FontAwesomeIcon icon={faMoneyBill} className="card-icon" />
              <p className="card-title">Petty Cash</p>
            </div>
          )}


          {mainAccess.includes("AE") && (
            <div
              className="card_new_M"
              onClick={() =>
                handleCardClick("BussinessIntelligence", "/Home/BussinessIntelligence")
              }
            >
              <FontAwesomeIcon icon={faChartLine} className="card-icon" />
              <p className="card-title">BI</p>
            </div>
          )}

                  {mainAccess.includes("AH") && (
            <div
              className="card_new_M"
              onClick={() => handleCardClick("PACS", "/Home/PACS")}
            >
              <FontAwesomeIcon icon={faXRay} className="card-icon" />
              <p className="card-title">PACS</p>
            </div>
          )}


         {mainAccess.includes("AF") && (
                      <div
                        className="card_new_M"
                        onClick={() =>
                          handleCardClick("DoctorPayOutFolder", "/Home/DoctorPayOutFolder")
                        }
                      >
                        <FontAwesomeIcon icon={faMoneyBillWave} className="card-icon" />
                        <p className="card-title">Doctor PayOut</p>
                      </div>
                    )}

      
        </div>
      </div>
    </>
  );
};

export default HomePage;
