import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
// import "./Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import PastHistory from "./PastHistory";
import Samplecapture from "../LabTechnician/Capturesample";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { MdPhonelinkRing } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { TbDelta } from "react-icons/tb";
import { useSelector } from "react-redux";
import Barcode from "react-barcode";
// import Reportcapture from "./ReportCapture";
import Reportverify from "./Reportverify";
import bgImg2 from "../../Assets/bgImg2.jpg";


function Navigationseior({ userRecord, isSidebarOpen, Data }) {
  console.log(Data);

  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);

  const navigatelab = useSelector((state) => state.userRecord?.navigationlab);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Reportentrysenior");
  const [isToggled, setIsToggled] = useState(false);
  const [formData, setFormData] = useState({
    SerialNo: "",
    PatientID: "",
    AppointmentID: "",
    visitNo: "",
    firstName: "",
    lastName: "",
    AppointmentDate: "",
  });

  useEffect(() => {
    console.log("navigatelab........", navigatelab);
   
      setActiveTab("Reportentrysenior");
    
  }, [navigatelab]);

  const toggle = () => setIsToggled(!isToggled);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const closeToggle = () => {
    setIsToggled(false);
  };

  useEffect(() => {
    const handleBodyClick = (event) => {
      if (!event.target.closest(".new-kit")) {
        closeToggle();
      }
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  });

  return (
    <>
      <div className="samplecapture_component">
        <div className="ShiftClosing_Container">
          <div className="ShiftClosing_header">
            <div className="lab_head" >
              <h3 >Result Verify Form</h3>
            </div>
          </div>
        </div>
        {/* <div className="patientdetails_lab">
          <div className='patientdata'>
            
            <label className='phelobotomist_head'><span className='logo_profile'><CgProfile /></span>Patient Name<span>:</span></label>
            <span>{capturedatas.Patient_Name}</span>
          </div>

          <div className='patientdata'>
            <label className='phelobotomist_head'><span className='logo_profile'><SlCalender /></span>Date  <span>:</span></label>
            <span>{capturedatas.UpdatedAt}</span>
          </div>

          <div className='patientdata'>
            <label className='phelobotomist_head'><span className='logo_profile'><MdPhonelinkRing /></span>Phone <span>:</span></label>
            <span>{capturedatas.Phone}</span>
          </div>

          <div className='patientdata'>
            <Barcode value={capturedatas.Barcode || ''} lineColor="black" height={50} width={1.5} />
          </div>
        </div> */}

        <div className="dctr_info_up_head">
          <div className="RegisFormcon ">
            <div className="dctr_info_up_head22">
              <img src={bgImg2} alt="Default Patient Photo" />

              <label>Profile</label>
            </div>
          </div>

          <div className="RegisFormcon_1">
            <div className="RegisFormcon_1">
              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="PatientID">
                  Patient ID <span>:</span>
                </label>
                <span
                  className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                  htmlFor="PatientID"
                >
                  {capturedatas?.Patient_Id}
                </span>
              </div>
              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="PatientID">
                  Sample ID <span>:</span>
                </label>
                <span
                  className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                  htmlFor="PatientID"
                >
                  {capturedatas?.Barcode}
                </span>
              </div>

              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span
                  className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                  htmlFor="PatientName"
                >
                  {capturedatas?.Patient_Name}
                </span>
              </div>
              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="AgeGender">
                  Age / Gender <span>:</span>{" "}
                </label>
                <span
                  className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                  htmlFor="Age"
                >
                  {capturedatas?.Age} / {capturedatas?.Gender}
                </span>
              </div>

              <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                <label htmlFor="DoctorName">
                  Doctor Name <span>:</span>{" "}
                </label>
                <span
                  className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                  htmlFor="DoctorName"
                >
                  {capturedatas?.Refering_Doctor}
                </span>
              </div>

              <div className="RegisForm_1 dctr_wrbvh_pice666">
                <label htmlFor="PatientCategory">
                  Patient Category <span>:</span>
                </label>
                <span
                  className="dctr_wrbvh_pice dctr_wrbvh_pice5ttt66"
                  htmlFor="PatientCategory"
                >
                  {capturedatas?.Patient_Group}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="new-patient-registration-form1">
          <div className="new-navigation">
            <h2>
              <button onClick={() => handleTabChange("CaptureApprovesenior")}>
               Capture Sample
              </button>
              |
              <button onClick={() => handleTabChange("Reportentrysenior")}>
                Report Entry
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
                    <button onClick={() => handleTabChange("CaptureApprovesenior")}>
                    Capture Sample
                    </button>
                    |
                    <button onClick={() => handleTabChange("Reportentrysenior")}>
                    Report Entry
                    </button>
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>

      {/* {activeTab === "CaptureApprovesenior" && (
        <Samplecapture formData={formData} userRecord={userRecord} />
      )} */}
      {activeTab === "Reportentrysenior" && (
        <Reportverify formData={formData} userRecord={userRecord} />
      )}
    </>
  );
}

export default Navigationseior;
