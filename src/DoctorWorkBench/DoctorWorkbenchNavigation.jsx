import React, { useState, useEffect, lazy, Suspense } from "react";
import "./Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bgImg2 from "../Assets/bgImg2.jpg";
import "./TreatmentComponent.css";
import "../DoctorWorkBench/TreatmentComponent.css";
import axios from "axios";
import PastCasesheets from "./PastCasesheets.jsx";
import TreatmentsForms from "../IP_Workbench/Nurse/Casuality/TreatmentsForms.jsx";
import DentalEMR from "./DentalEMR .jsx";

const Vitals = lazy(() => import("./vitals.jsx"));
const Allergy = lazy(() => import("./Allergy.jsx"));
const Neurology = lazy(() => import("./Neurology.jsx"));
const IFCard = lazy(() => import("./IFCard.jsx"));
const Gynecology = lazy(() => import("./Gynecology.jsx"));
const OP_Sheet = lazy(() => import("./OP_Sheet.jsx"));
const PastHistory = lazy(() => import("./PastHistory.js"));
const Prescription = lazy(() => import("./Prescription.js"));
const NewProcedure = lazy(() => import("./NewProcedure.js"));
const GeneralEvaluation = lazy(() => import("./GeneralEvaluation.jsx"));
const LabTest = lazy(() => import("./LabTest.jsx"));
const RadiologyTest = lazy(() => import("./RadiologyTest.jsx"));
const Opthalmology = lazy(() => import("./Opthalmology.jsx"));
const AncCard = lazy(() => import("./ANCCard.jsx"));
const Therapy = lazy(() => import("./TherapyRequest.jsx"));
const EMR = lazy(() => import("./EMR.jsx"));

const DoctorWorkbenchNavigation = () => {
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
  const SpecialityWise_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.SpecialityWise_DoctorWorkbenchNavigation
  );

  console.log(DoctorWorkbenchNavigation,'DoctorWorkbenchNavigation')
  console.log(SpecialityWise_DoctorWorkbenchNavigation,'SpecialityWise_DoctorWorkbenchNavigation')


  const UserData = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState("Vitals");
  const [isToggled, setIsToggled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const toggle = () => setIsToggled(!isToggled);

  const handleEditClick = () => {
    setOpenModal(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const closeToggle = () => {
    setIsToggled(false);
  };

  const [SpecialityData, setSpecialityData] = useState([]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Speciality_Detials_link`)
      .then((res) => {
        const ress = res.data;
        setSpecialityData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const [AllergyData, setAllergyData] = useState([]);
  const [ShowAllergyData, setShowAllergyData] = useState(false);

  useEffect(() => {
    let registerid = null;
    if (Object.keys(DoctorWorkbenchNavigation).length > 0) {
      registerid = DoctorWorkbenchNavigation?.RegistrationId;
    }
    if (Object.keys(SpecialityWise_DoctorWorkbenchNavigation).length > 0) {
      registerid = SpecialityWise_DoctorWorkbenchNavigation?.RegistrationId;
    }

    axios
      .get(`${UrlLink}Workbench/Allergy_Details_Link`, {
        params: {
          RegistrationId: registerid,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAllergyData(res.data);
          setShowAllergyData(true);
        } else {
          setShowAllergyData(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, DoctorWorkbenchNavigation, ShowAllergyData]);

  const handleAllergyDataUpdate = (updatedAllergyData) => {
    setAllergyData(updatedAllergyData);
    setShowAllergyData(true);
  };

  const [specialityName, setSpecialityName] = useState(null);
  const [DocWiseSpeciality, setDocWiseSpeciality] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [Complaint, setComplaint] = useState('');
  const [DocComplaint, setDocComplaint] = useState('');

  const [shouldShowForms, setShouldShowForms] = useState(true);
  const allowedSpecialities = ["NEUROLOGY", "GYNECOLOGY", "OPTHALMOLOGY", "OBST&GYNECOLOGY"];
    
  useEffect(() => {
    const isSpecialityAllowed = isHost && (allowedSpecialities.includes(DocWiseSpeciality) || allowedSpecialities.includes(specialityName));
    
    let shouldShow = isSpecialityAllowed;
    if (DocWiseSpeciality === "OBST&GYNECOLOGY" || specialityName === "OBST&GYNECOLOGY") {
      shouldShow = isSpecialityAllowed && (Complaint === "GYNECOLOGY" || DocComplaint === "GYNECOLOGY");
    }
  
    setShouldShowForms(shouldShow);
  }, [isHost, DocWiseSpeciality, specialityName, Complaint, DocComplaint]);
    


  useEffect(() => {
    let SpecData = null;
    let DocSpecWise = null;

    if (UserData?.username === "host" || UserData?.username === "admin") {
      setIsHost(true);

      if (DoctorWorkbenchNavigation?.Specialization) {
        SpecData = SpecialityData?.find(
          (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
        );

        if (SpecData) {
          setSpecialityName(SpecData?.SpecialityName);
          setDocWiseSpeciality(null);
          setComplaint(DoctorWorkbenchNavigation?.Complaint);
          setDocComplaint('');
        } else {
          setSpecialityName(null);
        }
      }

      if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
        DocSpecWise = SpecialityData?.find(
          (p) =>
            p?.Speciality_Id ===
            SpecialityWise_DoctorWorkbenchNavigation?.Specialization
        );

        if (DocSpecWise) {
          setDocWiseSpeciality(DocSpecWise?.SpecialityName);
          setSpecialityName(null);
          setDocComplaint(SpecialityWise_DoctorWorkbenchNavigation?.Complaint);
          setComplaint('');
        } else {
          setDocWiseSpeciality(null);
        }
      }
    } else {
      setIsHost(false);

      if (DoctorWorkbenchNavigation?.Specialization) {
        const SpecData = SpecialityData?.find(
          (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
        );

        const PatientSpeciality =
          UserData?.Specialization &&
          DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;

        setSpecialityName(null);
        if (PatientSpeciality) {
          setSpecialityName(SpecData?.SpecialityName);
          setDocWiseSpeciality(null);

          setComplaint(DoctorWorkbenchNavigation?.Complaint);
          setDocComplaint('');
        } else {
          setSpecialityName(null);
        }
      }

      if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
        DocSpecWise = SpecialityData?.find(
          (p) =>
            p?.Speciality_Id ===
            SpecialityWise_DoctorWorkbenchNavigation?.Specialization
        );

        const DocPatientSpeciality =
          UserData?.Specialization &&
          SpecialityWise_DoctorWorkbenchNavigation?.Specialization ===
            DocSpecWise?.Speciality_Id;

        setDocWiseSpeciality(null);

        if (DocPatientSpeciality) {
          setDocWiseSpeciality(DocSpecWise?.SpecialityName);
          setSpecialityName(null);

          setDocComplaint(SpecialityWise_DoctorWorkbenchNavigation?.Complaint);
          setComplaint('');
        } else {
          setDocWiseSpeciality(null);
        }
      }
    }
  }, [
    UserData,
    DoctorWorkbenchNavigation,
    SpecialityData,
    SpecialityWise_DoctorWorkbenchNavigation,
  ]);

  return (
    <>
      <div className="Main_container_app">
        <div className="new-patient-registration-form">
          <div className="dctr_info_up_head">
            <div className="RegisFormcon ">
              <div className="dctr_info_up_head22">
                <img src={bgImg2} alt="Default Patient Photo" />
                <label>Profile</label>
              </div>
            </div>

            <div className="RegisFormcon_1">
              <div className="RegisForm_1 ">
                <label htmlFor="PatientID">
                  Patient ID <span>:</span>
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientID">
                  {SpecialityWise_DoctorWorkbenchNavigation?.PatientId ||
                    DoctorWorkbenchNavigation?.PatientId}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {SpecialityWise_DoctorWorkbenchNavigation?.PatientName ||
                    DoctorWorkbenchNavigation?.PatientName}
                </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="OpNo">
                  OP No <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {SpecialityWise_DoctorWorkbenchNavigation?.RegistrationId ||
                    DoctorWorkbenchNavigation?.RegistrationId}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PrimaryDoctor">
                  Primary Doctor <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {SpecialityWise_DoctorWorkbenchNavigation?.DoctorName ||
                    DoctorWorkbenchNavigation?.DoctorName}
                </span>
              </div>

              <div className="RegisForm_1">
                <label htmlFor="AgeGender">
                  Age / Gender<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" id="AgeGender">
                  {SpecialityWise_DoctorWorkbenchNavigation?.Age ||
                    DoctorWorkbenchNavigation?.Age}{" "}
                  /{" "}
                  {SpecialityWise_DoctorWorkbenchNavigation?.Gender ||
                    DoctorWorkbenchNavigation?.Gender}
                </span>
              </div>
              <div className="RegisForm_1">
                <label htmlFor="PatientCategory">
                  Patient Category<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" id="PatientCategory">
                  {SpecialityWise_DoctorWorkbenchNavigation?.PatientCategory ||
                    DoctorWorkbenchNavigation?.PatientCategory}
                </span>
              </div>

              {SpecialityWise_DoctorWorkbenchNavigation?.BloodGroup || DoctorWorkbenchNavigation?.BloodGroup && (
                <div className="RegisForm_1 ">
                  <label htmlFor="BloodGroup">
                    Blood Group <span>:</span>{" "}
                  </label>
                  <span className="dctr_wrbvh_pice" htmlFor="BloodGroup">
                    {SpecialityWise_DoctorWorkbenchNavigation?.BloodGroup ||
                      DoctorWorkbenchNavigation?.BloodGroup}
                  </span>
                </div>
              )}
              
              {ShowAllergyData && (
                <div className="jhidusch_90">
                  <button onClick={handleEditClick}>Allergy</button>

                  {openModal && (
                    <div
                      className={
                        isSidebarOpen
                          ? "sideopen_showcamera_profile_chirayu"
                          : "showcamera_profile_chirayu"
                      }
                      onClick={() => {
                        setOpenModal(false);
                      }}
                    >
                      <div
                        className="neww_chirayu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="modal-close-btnSS"
                          onClick={() => setOpenModal(false)}
                        >
                          ×
                        </button>

                        <div className="judscy_uj11">
                          <div className="wwdsdlm_o">
                            {AllergyData.map(
                              (allergy) => allergy.Allergent
                            ).join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
            </div>
          </div>

          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
                <button
                  style={{ color: ActiveTab === "Vitals" ? "white" : "" }}
                  onClick={() => handleTabChange("Vitals")}
                >
                  Vitals
                </button>
                |
                <button
                  style={{ color: ActiveTab === "PastHistory" ? "white" : "" }}
                  onClick={() => handleTabChange("PastHistory")}
                >
                  Past History
                </button>
                |

                <button
                        style={{
                          color: ActiveTab === "DentalEMR" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("DentalEMR")}
                      >
                        Dental ERM
                      </button>
                      |
                <button
                  style={{ color: ActiveTab === "Allergy" ? "white" : "" }}
                  onClick={() => handleTabChange("Allergy")}
                >
                  Allergy
                </button>
                |
                <button
                  style={{ color: ActiveTab === "TreatmentsForms" ? "white" : "" }}
                  onClick={() => handleTabChange("TreatmentsForms")}
                >
                  TreatmentsForms
                </button>
                |
                <button
                  style={{
                    color: ActiveTab === "GeneralEvaluation" ? "white" : "",
                  }}
                  onClick={() => handleTabChange("GeneralEvaluation")}
                >
                  GeneralEvaluation
                </button>
                |
                <div className="Lab_dropdown">
                  <button
                    style={{
                      color:
                        ActiveTab === "Lab_Test" ||
                        ActiveTab === "Radiology_Test" ||
                        ActiveTab === "Therapy_Request"
                          ? "white"
                          : "",
                    }}
                    className="Lab_button"
                  >
                    Diagnostics
                  </button>
                  <div className="Lab_dropdown_content">
                    <button
                      style={{ color: ActiveTab === "Lab_Test" ? "white" : "" }}
                      onClick={() => handleTabChange("Lab_Test")}
                    >
                      Lab
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "Radiology_Test" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Radiology_Test")}
                    >
                      Radiology
                    </button>
                    <button
                      style={{
                        color: ActiveTab === "Therapy_Request" ? "white" : "",
                      }}
                      onClick={() => handleTabChange("Therapy_Request")}
                    >
                      Therapy Request  
                    </button>
                  </div>
                </div>
                |
                <button
                  style={{ color: ActiveTab === "Prescription" ? "white" : "" }}
                  onClick={() => handleTabChange("Prescription")}
                >
                  Prescription
                </button>
                
                |
                <button
                  style={{ color: ActiveTab === "EMR" ? "white" : "" }}
                  onClick={() => handleTabChange("EMR")}
                >
                  EMR
                </button>
                |
                <button
                  style={{ color: ActiveTab === "Casesheets" ? "white" : "" }}
                  onClick={() => handleTabChange("Casesheets")}
                >
                  Past Casesheets
                </button>

                {shouldShowForms && (
                  <>
                    <div className="Lab_dropdown">
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "Neurology" ||
                            ActiveTab === "Gynecology" ||
                            ActiveTab === "AncCard" ||
                            ActiveTab === "Opthalmology" ||
                            ActiveTab === "IFCard"
                              ? "white"
                              : "",
                        }}
                        className="Lab_button"
                      >
                        Forms
                      </button>
                      <div className="Lab_dropdown_content">
                        <>
                          {(DocWiseSpeciality === "NEUROLOGY" || specialityName === "NEUROLOGY") && (
                            <>
                              <button
                                style={{ color: ActiveTab === "Neurology" ? "white" : "" }}
                                onClick={() => handleTabChange("Neurology")}
                              >
                                Neurology Form
                              </button>
                              <button
                                style={{ color: ActiveTab === "OP_Sheet" ? "white" : "" }}
                                onClick={() => handleTabChange("OP_Sheet")}
                              >
                                Neuro Surgery
                              </button>
                            </>
                          )}
                          {(DocWiseSpeciality === "OPTHALMOLOGY" || specialityName === "OPTHALMOLOGY") && (
                            <button
                              style={{ color: ActiveTab === "Opthalmology" ? "white" : "" }}
                              onClick={() => handleTabChange("Opthalmology")}
                            >
                              Opthalmology
                            </button>
                          )}
                          {(DocComplaint === "GYNECOLOGY" || Complaint === "GYNECOLOGY" || DocWiseSpeciality === "GYNECOLOGY" || specialityName === "GYNECOLOGY") && (
                            <>
                              <button
                                style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                                onClick={() => handleTabChange("IFCard")}
                              >
                                IFCard
                              </button>
                              <button
                                style={{ color: ActiveTab === "Gynecology" ? "white" : "" }}
                                onClick={() => handleTabChange("Gynecology")}
                              >
                                Gynecology
                              </button>
                              <button
                                style={{ color: ActiveTab === "AncCard" ? "white" : "" }}
                                onClick={() => handleTabChange("AncCard")}
                              >
                                ANCCard
                              </button>
                            </>
                          )}
                        </>
                      </div>
                    </div>
                  </>
                )}

                {!isHost && 
                  (specialityName === "OPTHALMOLOGY" ||
                    DocWiseSpeciality === "OPTHALMOLOGY") && (
                    <>
                    |
                      <button
                        style={{
                          color: ActiveTab === "Opthalmology" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("Opthalmology")}
                      >
                        Opthalmology
                      </button>
                      |
                    </>
                  )}
                {!isHost &&
                  (specialityName === "NEUROLOGY" ||
                    DocWiseSpeciality === "NEUROLOGY") && (
                    <>
                    |
                      <button
                        style={{
                          color: ActiveTab === "Neurology" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("Neurology")}
                      >
                        Neurology Form
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "OP_Sheet" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("OP_Sheet")}
                      >
                        Neuro Surgery
                      </button>
                      |
                    </>
                  )}
                {!isHost &&
                  (Complaint === "GYNECOLOGY" ||
                    DocComplaint === "GYNECOLOGY" || specialityName === "GYNECOLOGY" ||
                    DocWiseSpeciality === "GYNECOLOGY") && (
                    <>
                    |
                      <button
                        style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                        onClick={() => handleTabChange("IFCard")}
                      >
                        IFCard
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "Gynecology" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("Gynecology")}
                      >
                        Gynecology
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "AncCard" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("AncCard")}
                      >
                        ANCCard
                      </button>
                      |
                    </>
                  )}
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
                      <button
                        style={{ color: ActiveTab === "Vitals" ? "white" : "" }}
                        onClick={() => handleTabChange("Vitals")}
                      >
                        Vitals
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "PastHistory" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("PastHistory")}
                      >
                        Past History
                      </button>
                      |
                      <button
                        style={{
                          color: ActiveTab === "Allergy" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("Allergy")}
                      >
                        Allergy
                      </button>
                      |
                      <button
                        style={{
                          color:
                            ActiveTab === "GeneralEvaluation" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("GeneralEvaluation")}
                      >
                        GeneralEvaluation
                      </button>
                      |
                      <div className="Lab_dropdown">
                        <button
                          style={{
                            color:
                              ActiveTab === "Lab_Test" ||
                              ActiveTab === "Radiology_Test" ||
                              ActiveTab === "Therapy_Request"  
                                ? "white"
                                : "",
                          }}
                          className="Lab_button"
                        >
                          Diagnostics
                        </button>
                        <div className="Lab_dropdown_content">
                          <button
                            style={{
                              color: ActiveTab === "Lab_Test" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Lab_Test")}
                          >
                            Lab
                          </button>
                          <button
                            style={{
                              color:
                                ActiveTab === "Radiology_Test" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Radiology_Test")}
                          >
                            Radiology
                          </button>
                          <button
                            style={{
                              color:
                                ActiveTab === "Therapy_Request" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Therapy_Request")}
                          >
                            Therapy Request  
                          </button>
                        </div>
                      </div>
                      |
                      <button
                        style={{
                          color: ActiveTab === "Prescription" ? "white" : "",
                        }}
                        onClick={() => handleTabChange("Prescription")}
                      >
                        Prescription
                      </button>
                      |
                      <button
                        style={{ color: ActiveTab === "EMR" ? "white" : "" }}
                        onClick={() => handleTabChange("EMR")}
                      >
                        EMR
                      </button>
                      |
                      <button
                        style={{ color: ActiveTab === "Casesheets" ? "white" : "" }}
                        onClick={() => handleTabChange("Casesheets")}
                      >
                        Past Casesheets
                      </button>

                      {shouldShowForms && (
                        <>
                          <div className="Lab_dropdown">
                            |
                            <button
                              style={{
                                color:
                                  ActiveTab === "Neurology" ||
                                  ActiveTab === "Gynecology" ||
                                  ActiveTab === "AncCard" ||
                                  ActiveTab === "Opthalmology" ||
                                  ActiveTab === "IFCard"
                                    ? "white"
                                    : "",
                              }}
                              className="Lab_button"
                            >
                              Forms
                            </button>
                            <div className="Lab_dropdown_content">
                              <>
                                {(DocWiseSpeciality === "NEUROLOGY" || specialityName === "NEUROLOGY") && (
                                  <>
                                    <button
                                      style={{ color: ActiveTab === "Neurology" ? "white" : "" }}
                                      onClick={() => handleTabChange("Neurology")}
                                    >
                                      Neurology Form
                                    </button>
                                    <button
                                      style={{ color: ActiveTab === "OP_Sheet" ? "white" : "" }}
                                      onClick={() => handleTabChange("OP_Sheet")}
                                    >
                                      Neuro Surgery
                                    </button>
                                  </>
                                )}
                                {(DocWiseSpeciality === "OPTHALMOLOGY" || specialityName === "OPTHALMOLOGY") && (
                                  <button
                                    style={{ color: ActiveTab === "Opthalmology" ? "white" : "" }}
                                    onClick={() => handleTabChange("Opthalmology")}
                                  >
                                    Opthalmology
                                  </button>
                                )}
                                {(DocComplaint === "GYNECOLOGY" || Complaint === "GYNECOLOGY" ||DocWiseSpeciality === "GYNECOLOGY" || specialityName === "GYNECOLOGY") && (
                                  <>
                                    <button
                                      style={{ color: ActiveTab === "IFCard" ? "white" : "" }}
                                      onClick={() => handleTabChange("IFCard")}
                                    >
                                      IFCard
                                    </button>
                                    <button
                                      style={{ color: ActiveTab === "Gynecology" ? "white" : "" }}
                                      onClick={() => handleTabChange("Gynecology")}
                                    >
                                      Gynecology
                                    </button>
                                    <button
                                      style={{ color: ActiveTab === "AncCard" ? "white" : "" }}
                                      onClick={() => handleTabChange("AncCard")}
                                    >
                                      ANCCard
                                    </button>
                                  </>
                                )}
                              </>
                            </div>
                          </div>
                        </>
                      )}

                      {!isHost && specialityName === "OPTHALMOLOGY" && (
                        <>
                        |
                          <button
                            style={{
                              color:
                                ActiveTab === "Opthalmology" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Opthalmology")}
                          >
                            Opthalmology
                          </button>
                          |
                        </>
                      )}
                      {!isHost && specialityName === "NEUROLOGY" && (
                        <>
                        |
                          <button
                            style={{
                              color: ActiveTab === "Neurology" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Neurology")}
                          >
                            Neurology Form
                          </button>
                          |
                          <button
                            style={{
                              color: ActiveTab === "OP_Sheet" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("OP_Sheet")}
                          >
                            Neuro Surgery
                          </button>
                          |
                        </>
                      )}
                      {!isHost && ( Complaint === "GYNECOLOGY" || specialityName === "GYNECOLOGY")  && (
                        <>
                        |
                          <button
                            style={{
                              color: ActiveTab === "IFCard" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("IFCard")}
                          >
                            IFCard
                          </button>
                          |
                          <button
                            style={{
                              color: ActiveTab === "Gynecology" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("Gynecology")}
                          >
                            Gynecology
                          </button>
                          |
                          <button
                            style={{
                              color: ActiveTab === "AncCard" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("AncCard")}
                          >
                            ANCCard
                          </button>
                          |
                        </>
                      )}
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {ActiveTab === "Vitals" && <Vitals />}
          {ActiveTab === "Allergy" && <Allergy onAllergySubmitSuccess={handleAllergyDataUpdate}/>}
          {ActiveTab === "PastHistory" && <PastHistory />}
          {ActiveTab === "DentalEMR" && <DentalEMR />}
          {ActiveTab === "TreatmentsForms" && <TreatmentsForms />}
          {ActiveTab === "Prescription" && <Prescription />}
          {ActiveTab === "NewProcedure" && <NewProcedure />}
          {ActiveTab === "Neurology" && <Neurology />}
          {ActiveTab === "IFCard" && <IFCard />}
          {ActiveTab === "Gynecology" && <Gynecology />}
          {ActiveTab === "AncCard" && <AncCard />}
          {ActiveTab === "OP_Sheet" && <OP_Sheet />}
          {ActiveTab === "GeneralEvaluation" && <GeneralEvaluation />}
          {ActiveTab === "Opthalmology" && <Opthalmology />}
          {ActiveTab === "Lab_Test" && <LabTest />}
          {ActiveTab === "Radiology_Test" && <RadiologyTest />}
          {ActiveTab === "Therapy_Request" && <Therapy />}
          {ActiveTab === "EMR" && <EMR />}
          {ActiveTab === "Casesheets" && <PastCasesheets />}
          
        </Suspense>
      </div>
    </>
  );
};

export default DoctorWorkbenchNavigation;