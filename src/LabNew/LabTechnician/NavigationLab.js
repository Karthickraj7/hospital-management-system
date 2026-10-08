import React, { useState, useEffect } from "react";
// import { Helmet } from "react-helmet";
// import "./Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import PastHistory from "./PastHistory";
import Samplecapture from "./Capturesample";
import { CgProfile } from "react-icons/cg";
import { SlCalender } from "react-icons/sl";
import { MdPhonelinkRing } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import { TbDelta } from "react-icons/tb";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import Barcode from "react-barcode";
import Reportcapture from "./ReportCapture.js";
import bgImg2 from "../../Assets/bgImg2.jpg";

// import axios from 'axios';
function NavigationLab() {
  // console.log(Data);
  // const userRecord = useSelector((state) => state.userRecord?.UserData);

  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  console.log("cAPTURE-------",capturedatas);

  const navigatelab = useSelector((state) => state.userRecord?.navigationlab);
  console.log(navigatelab);
  const navigate = useNavigate();
  // const urllink = useSelector((state) => state.userRecord?.UrlLink);
  // const [department, setDepartment] = useState([])

  const newtab = useSelector((state) => state.userRecord?.activeTab);
console.log("________TAB_______",newtab)
  const [activeTab, setActiveTab] = useState(newtab);
  const [isToggled, setIsToggled] = useState(false);
  // const [selectdepartment, setselectdepartment] = useState('')
  // const [formData, setFormData] = useState({
  //   SerialNo: "",
  //   PatientID: "",
  //   AppointmentID: "",
  //   visitNo: "",
  //   firstName: "",
  //   lastName: "",
  //   AppointmentDate: "",
  // });

  // const dispatchvalue = useDispatch()

  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );

  console.log("--------Report---------", navigatelab, activeTab);

  // useEffect(() => {
  //   console.log(navigatelab);
  //   if (navigatelab !== "") {
  //     console.log(
  //       "------------------------------------ITS---PERFECT------------------------------------"
  //     );
  //     setActiveTab(navigatelab);
  //   } else {
  //     setActiveTab("CaptureApprove");
  //   }
  // }, [navigatelab]);

  useEffect(() => {
    if (Object.keys(capturedatas).length === 0) {
      navigate("/Home/AnalayseReportEntry");
    }
  });

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
  // const handledeptchange = (e) => {
  //   setselectdepartment(e.target.value);
  //   dispatchvalue({type :'selecteddepartment', value : selectdepartment})
  // };

  // useEffect(() => {
  //   axios.get(`${urllink}Billing/getfor_barcode_details_print?invoice=${capturedatas?.Billing_Invoice}`)
  //     .then((response) => {
  //       console.log(response);
  //       setDepartment(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [capturedatas, urllink]);

  console.log("---------Capture--------", capturedatas);
  return (
    <>
      <div className="new-patient-registration-form">
        <div className="h_head">
          <h3>Sample Collection Form</h3>
        </div>

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
                  {capturedatas?.Barcode_Id}
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

          {/* <div className="patientdetails_lab">
            <div className="patientdata">
              <label className="phelobotomist_head">
                <span className="logo_profile">
                  <CgProfile />
                </span>
                Patient Name<span>:</span>
              </label>
              <span>{capturedatas.Patient_Name}</span>
            </div>

            <div className="patientdata">
              <label className="phelobotomist_head">
                <span className="logo_profile">
                  <SlCalender />
                </span>
                Date <span>:</span>
              </label>
              <span>{capturedatas.UpdatedAt}</span>
            </div>

            <div className="patientdata">
              <label className="phelobotomist_head">
                <span className="logo_profile">
                  <MdPhonelinkRing />
                </span>
                Phone <span>:</span>
              </label>
              <span>{capturedatas.Phone}</span>
            </div>

            <div className="patientdata">
              <Barcode
                value={capturedatas.Barcode || ""}
                lineColor="black"
                height={50}
                width={1.5}
              />
            </div>
          </div> */}
          <div className="new-patient-registration-form1">
            <div className="new-navigation" style={{ display: "none" }}>
              <h2>
                <button onClick={() => handleTabChange("CaptureApprove")}>
                  Capture Sample
                </button>
                |
                <button onClick={() => handleTabChange("Reportentry")}>
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
                      <button onClick={() => handleTabChange("CaptureApprove")}>
                        Capture Sample
                      </button>
                      |
                      <button onClick={() => handleTabChange("Reportentry")}>
                        Report Entry
                      </button>
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeTab === "CaptureApprove" && <Samplecapture />}
      {activeTab === "Reportentry" && <Reportcapture />}
    </>
  );
}

export default NavigationLab;
