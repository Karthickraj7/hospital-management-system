import React, { useEffect, useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import bgImg2 from "../Assets/bgImg2.jpg";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useNavigate } from "react-router-dom";
import "../DoctorWorkBench/Navigation.css";
import Addtest from "./Addtest.jsx";

const Radiology_Vitals = lazy(() => import('./RadiologyVitals.jsx'));
const Radiology_Prescription = lazy(() => import('./RadiologyPrescription.jsx'));
const Radiology_ReportEntry = lazy(() => import('./RadiologyReport.jsx'));
const Medical_History = lazy(() => import('./MedicalHistory.jsx'));
const RadiologyReportEntry = () => {
  const [isToggled, setIsToggled] = useState(false);
  const toggle = () => setIsToggled(!isToggled);
  const toast = useSelector((state) => state.userRecord?.toast);
  const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState('Radiology_ReportEntry');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };
  const closeToggle = () => {
    setIsToggled(false);
  };
  useEffect(() => {
    if (Object.keys(RadiologyWorkbenchNavigation).length === 0) {
      navigate('/Home/RadiologyQuelist');
    }
  }, [RadiologyWorkbenchNavigation, navigate]);
  return (
    <>
      <div className="Main_container_app">
        <div className="new-patient-registration-form">
          <br />
          <div className="dctr_info_up_head">
            <div className="RegisFormcon ">
              <div className="dctr_info_up_head22">
                <img src={bgImg2} alt="Patient Profile" />

                <label>Profile</label>
              </div>
            </div>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1 ">
                <label htmlFor="PatientID">
                  Patient ID <span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientID">
                  {RadiologyWorkbenchNavigation?.params?.PatientId}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {RadiologyWorkbenchNavigation?.params?.PatientName}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="Age">
                  Age <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="Age">
                  {RadiologyWorkbenchNavigation?.params?.age}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="Gender">
                  Gender <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="Gender">
                  {RadiologyWorkbenchNavigation?.params?.gender}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PhoneNumber">
                  Phone Number<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PhoneNumber">
                  {RadiologyWorkbenchNavigation?.params?.PhoneNumber}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="DoctorShortName">
                  Doctor Name<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="DoctorShortName">
                  {RadiologyWorkbenchNavigation?.params?.DoctorShortName}
                </span>
              </div>
            </div>
          </div>
          <br />
          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
                {/* <button style={{ color: ActiveTab === "Radiology_Vitals" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_Vitals")}>
                  Radiology Vitals
                </button>
                |
                <button style={{ color: ActiveTab === "Medical_History" ? 'white' : '' }} onClick={() => handleTabChange("Medical_History")}>
                 Past Medical History
                </button>
                |
                <button style={{ color: ActiveTab === "Radiology_Prescription" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_Prescription")}>
                 Medication Section
                </button>
                | */}
                <button style={{ color: ActiveTab === "Radiology_ReportEntry" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_ReportEntry")}>
                  Radiology ReportEntry
                </button>

                
                |
              
              <button style={{ color: ActiveTab === "Add_Test" ? 'white' : '' }} onClick={() => handleTabChange("Add_Test")}>
              Add Test
              </button>

              </h2>
            </div>

            <div className="new-kit ">
              <button className="new-tog" onClick={toggle}>
                {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
              </button>

              <div>
                {isToggled && (
                  <div className="new-navigation-toggle">
                    <h2>
                      {/* <button style={{ color: ActiveTab === "Radiology_Vitals" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_Vitals")}>
                        Radiology Vitals
                      </button>
                      |
              
                      <button style={{ color: ActiveTab === "Medical_History" ? 'white' : '' }} onClick={() => handleTabChange("Medical_History")}>
                      Past Medical History
                      </button>
                      |
                      <button style={{ color: ActiveTab === "Radiology_Prescription" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_Prescription")}>
                      Medication Section
                      </button>
                      | */}
                      <button style={{ color: ActiveTab === "Radiology_ReportEntry" ? 'white' : '' }} onClick={() => handleTabChange("Radiology_ReportEntry")}>
                        Radiology ReportEntry
                      </button>

                      |
              
                      <button style={{ color: ActiveTab === "Add_Test" ? 'white' : '' }} onClick={() => handleTabChange("Add_Test")}>
                        Add Test
                      </button>
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>

          {ActiveTab === "Radiology_Vitals" && <Radiology_Vitals />}
          {ActiveTab === "Radiology_Prescription" && <Radiology_Prescription />}
          {ActiveTab === "Radiology_ReportEntry" && <Radiology_ReportEntry />}
          {ActiveTab === "Medical_History" && <Medical_History />}
          {ActiveTab === "Add_Test" && <Addtest />}
        </Suspense>

      </div>
    </>
  );
};

export default RadiologyReportEntry;
