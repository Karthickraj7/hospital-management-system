import React, { useState, useEffect, lazy, Suspense } from "react";
// import "./Navigation.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bgImg2 from "../Assets/bgImg2.jpg";
import axios from 'axios';
import Therapist from "./Therapist.jsx";


const Vitals = lazy(() => import('./vitals.jsx'));
const IP_Vitals = lazy(() => import('./IP_Vitals.jsx'))
const Prescription =  lazy(()=> import('./Prescription.js'))
const TherapyInformations = lazy(()=>import('./TherapyInformation.jsx'))
const TherapistNavigation = () => {
  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.TherapistWorkbenchNavigation);
  const SpecialityWise_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.TherapistWorkbenchNavigation);
 
 
  console.log(SpecialityWise_DoctorWorkbenchNavigation,'SpecialityWise_DoctorWorkbenchNavigation');
  console.log(DoctorWorkbenchNavigation,'DoctorWorkbenchNavigation');
 
 
  const UserData = useSelector(state => state.userRecord?.UserData)
  console.log(UserData,'UserData');
  
  
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [ActiveTab, setActiveTab] = useState('TherapyInformations')
  const [isToggled, setIsToggled] = useState(false)

  const toggle = () => setIsToggled(!isToggled);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const closeToggle = () => {
    setIsToggled(false);
  };




  const [SpecialityData, setSpecialityData] = useState([])
  console.log(SpecialityData,'SpecialityData');
  const findSpecialityName = (specId) => {
  return SpecialityData.find((p) => p?.Speciality_Id === specId)?.SpecialityName || null;
};


  useEffect(() => {
    axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
        .then((res) => {
            const ress = res.data
            setSpecialityData(ress)
        })
        .catch((err) => {
            console.log(err);
        })
}, [UrlLink])


  const [AllergyData, setAllergyData] = useState([])
  console.log(AllergyData,'AllergyData');
  



  useEffect(() => {
    let registerid = null
    if (Object.keys(DoctorWorkbenchNavigation).length > 0){
      registerid =  DoctorWorkbenchNavigation?.Registration_id
    }
   

    console.log(registerid,'registerididijfijfijfjijfkueygcuidojgcjb');
    
    axios.get(`${UrlLink}Workbench/Allergy_Details_Link`, {
        params: {
            RegistrationId: registerid, 
        }
    })
    .then((res) => {
        setAllergyData(res.data);
    })
    .catch((err) => {
        console.log(err);
    });
}, [UrlLink, DoctorWorkbenchNavigation?.Registration_id]);


const [condition,setCondition] = useState(false)
const [specialityName, setSpecialityName] = useState(null);
const [DocWiseSpeciality, setDocWiseSpeciality] = useState(null);
const [isHost, setIsHost] = useState(false);
console.log(specialityName,'specialityName');
console.log(DocWiseSpeciality,'DocWiseSpeciality');



useEffect(() => {
  console.log("1111111111");

  let SpecData = null;
  let DocSpecWise = null;

  if (UserData?.username === 'host' || UserData?.username === 'admin') {
    setIsHost(true); // Set isHost to true if the user is 'host'

    // Get SpecData based on DoctorWorkbenchNavigation
    if (DoctorWorkbenchNavigation?.Specialization) {
      SpecData = SpecialityData?.find(
        (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
      );
      console.log(SpecData, 'SpecData');
      console.log(SpecData?.Speciality_Id,'SpecData?.Speciality_Id');
      console.log(DoctorWorkbenchNavigation?.Specialization,'DoctorWorkbenchNavigation?.Specialization');
      
      if (SpecData) {
        setSpecialityName(SpecData?.SpecialityName);
        console.log('matching patient',SpecData?.SpecialityName);
        setDocWiseSpeciality(null)
      } else {
        setSpecialityName(null)
      }
    }

    // Get DocSpecWise based on SpecialityWise_DoctorWorkbenchNavigation
    if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
      DocSpecWise = SpecialityData?.find(
        (p) => p?.Speciality_Id === SpecialityWise_DoctorWorkbenchNavigation?.Specialization
      );
      console.log(DocSpecWise, 'DocSpecWise');
      console.log(DocSpecWise?.Speciality_Id, 'DocSpecWise?.Speciality_Id');
      console.log(SpecialityWise_DoctorWorkbenchNavigation?.Specialization,'SpecialityWise_DoctorWorkbenchNavigation?.Specialization');
      
      if (DocSpecWise) {
        setDocWiseSpeciality(DocSpecWise?.SpecialityName);
        console.log('matching speciality',DocSpecWise?.SpecialityName);
        setSpecialityName(null)
      } else {
        setDocWiseSpeciality(null)
      }
      
    }

    
    

  } else {
   
    
    setIsHost(false); // Reset isHost if not 'host'
    
    
    // Get SpecData based on DoctorWorkbenchNavigation
    if (DoctorWorkbenchNavigation?.Specialization){
      const SpecData = SpecialityData?.find(
        (p) => p?.Speciality_Id === DoctorWorkbenchNavigation?.Specialization
      );
      console.log(SpecData, "SpecData");
      console.log(SpecData?.Speciality_Id,'SpecData?.Speciality_Id');
      console.log(UserData?.Specialization,'UserData?.Specialization');
      console.log(DoctorWorkbenchNavigation?.Specialization,'DoctorWorkbenchNavigation?.Specialization');
      
      const PatientSpeciality = UserData?.Specialization && DoctorWorkbenchNavigation?.Specialization === SpecData?.Speciality_Id;
      console.log("PatientSpeciality", PatientSpeciality);
      
      setSpecialityName(null);
      if (PatientSpeciality) {
        console.log('pppppppp');
        
        setSpecialityName(SpecData?.SpecialityName); 
        console.log('matching totalpatient');
        
        setDocWiseSpeciality(null)
      } else {
        setSpecialityName(null); // Reset if no match
      }

    }
    


    if (SpecialityWise_DoctorWorkbenchNavigation?.Specialization) {
      DocSpecWise = SpecialityData?.find(
        (p) => p?.Speciality_Id === SpecialityWise_DoctorWorkbenchNavigation?.Specialization
      );
      console.log(DocSpecWise, 'DocSpecWise');
      console.log(DocSpecWise?.Speciality_Id, 'DocSpecWise?.Speciality_Id');
      console.log(UserData?.Specialization,'UserData?.Specialization');
      console.log(SpecialityWise_DoctorWorkbenchNavigation?.Specialization,'SpecialityWise_DoctorWorkbenchNavigation?.Specialization');
      
      
      const DocPatientSpeciality = UserData?.Specialization && SpecialityWise_DoctorWorkbenchNavigation?.Specialization === DocSpecWise?.Speciality_Id;

      console.log('DocPatientSpeciality',DocPatientSpeciality);
      console.log("DocSpecWise?.SpecialityName", DocSpecWise?.SpecialityName);
    
      setDocWiseSpeciality(null);

      if (DocPatientSpeciality) {
        console.log('4444444444444');
        
        setDocWiseSpeciality(DocSpecWise?.SpecialityName); 
        console.log('matching specialitywise ');
        
        setSpecialityName(null)
      } else {
        setDocWiseSpeciality(null); // Reset if no match
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
          <br />
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
                  {SpecialityWise_DoctorWorkbenchNavigation?.PatientId || DoctorWorkbenchNavigation?.Patient_id}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PatientName">
                  Patient Name <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {SpecialityWise_DoctorWorkbenchNavigation?.PatientName || DoctorWorkbenchNavigation?.PatientName}

                </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="OpNo">
                  Registration No <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {SpecialityWise_DoctorWorkbenchNavigation?.Registration_Id || DoctorWorkbenchNavigation?.Registration_Id}
                </span>
              </div>
              <div className="RegisForm_1 ">
                <label htmlFor="PrimaryDoctor">
                  Primary Doctor <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="PatientName">
                  {SpecialityWise_DoctorWorkbenchNavigation?.Doctor_Id || DoctorWorkbenchNavigation?.Doctor_Id}
                </span>
              </div>
    
              <div className="RegisForm_1">
                <label htmlFor="AgeGender">
                  Age / Gender<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" id="AgeGender">
                  {SpecialityWise_DoctorWorkbenchNavigation?.Age || DoctorWorkbenchNavigation?.Age} /{" "}
                  {SpecialityWise_DoctorWorkbenchNavigation?.Gender || DoctorWorkbenchNavigation?.Gender}
                </span>
              </div>
              {/* <div className="RegisForm_1">
                <label htmlFor="Client">
                  Client<span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" id="Client">
                  {SpecialityWise_DoctorWorkbenchNavigation?.Client || DoctorWorkbenchNavigation?.Client}
                </span>
              </div> */}
              <div className="RegisForm_1 ">
                <label htmlFor="BloodGroup">
                  Blood Group <span>:</span>{" "}
                </label>
                <span className="dctr_wrbvh_pice" htmlFor="BloodGroup">
                  {SpecialityWise_DoctorWorkbenchNavigation?.BloodGroup || DoctorWorkbenchNavigation?.BloodGroup}
                </span>
              </div>
              {/* <div className="RegisForm_1 ">
                <label htmlFor="Gender">
                Allergy <span>:</span>{" "}
                </label>
                
              </div> */}
            </div>
          </div>
          <br />
{DoctorWorkbenchNavigation?.RegisterType == 'OP' && 
          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
              <button style={{ color: ActiveTab === "TherapyInformations" ? 'white' : '' }} onClick={() => handleTabChange("TherapyInformations")}>
              Therapy Informations
                      </button>
                      |
                <button style={{ color: ActiveTab === "Vitals" ? 'white' : '' }} onClick={() => handleTabChange("Vitals")}>
                  Vitals
                </button>
                |
                  <button style={{ color: ActiveTab === "Prescription" ? 'white' : '' }} onClick={() => handleTabChange("Prescription")}>
                  Prescription
                </button>
                |
                {/* <button style={{ color: ActiveTab === "Medications" ? 'white' : '' }} onClick={() => handleTabChange("Medications")}>
                  Medications
                </button>
                | */}
                <button style={{ color: ActiveTab === "Therapy" ? 'white' : '' }} onClick={() => handleTabChange("Therapy")}>
                  Therapy
                </button>
                |

                
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
                    <button style={{ color: ActiveTab === "TherapyInformations" ? 'white' : '' }} onClick={() => handleTabChange("TherapyInformations")}>
                    Therapy Informations
                      </button>
                      |
                      {/* <button style={{ color: ActiveTab === "Vitals" ? 'white' : '' }} onClick={() => handleTabChange("Vitals")}>
                        Vitals
                      </button>
                      | */}
                      {/* <button style={{ color: ActiveTab === "Medications" ? 'white' : '' }} onClick={() => handleTabChange("Medications")}>
                  Medications
                      </button>
                      | */}
                      <button style={{ color: ActiveTab === "Therapy" ? 'white' : '' }} onClick={() => handleTabChange("Therapy")}>
                        Therapy
                      </button>
                      |
                      
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
              }
              {DoctorWorkbenchNavigation?.RegisterType == 'IP' && 
          <div className="new-patient-registration-form">
            <div className="new-navigation">
              <h2>
              <button style={{ color: ActiveTab === "TherapyInformations" ? 'white' : '' }} onClick={() => handleTabChange("TherapyInformations")}>
              Therapy Informations
                      </button>
                      |
                <button style={{ color: ActiveTab === "IP_Vitals" ? 'white' : '' }} onClick={() => handleTabChange("Vitals")}>
                  Vitals
                </button>
                |
              
                <button style={{ color: ActiveTab === "Therapy" ? 'white' : '' }} onClick={() => handleTabChange("Therapy")}>
                  Therapy
                </button>
                |

                
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
                    <button style={{ color: ActiveTab === "TherapyInformations" ? 'white' : '' }} onClick={() => handleTabChange("TherapyInformations")}>
                    Therapy Informations
                      </button>
                      |
                      {/* <button style={{ color: ActiveTab === "Vitals" ? 'white' : '' }} onClick={() => handleTabChange("Vitals")}>
                        Vitals
                      </button>
                      | */}
                      {/* <button style={{ color: ActiveTab === "Medications" ? 'white' : '' }} onClick={() => handleTabChange("Medications")}>
                  Medications
                      </button>
                      | */}
                      <button style={{ color: ActiveTab === "Therapy" ? 'white' : '' }} onClick={() => handleTabChange("Therapy")}>
                        Therapy
                      </button>
                      |
                      
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
              }
        </div>
       <Suspense fallback={<div>Loading...</div>}>
  {ActiveTab === "Vitals" && (
    (DoctorWorkbenchNavigation?.RegisterType === "IP" || SpecialityWise_DoctorWorkbenchNavigation?.RegisterType === "IP") ? 
      <IP_Vitals /> : 
      <Vitals />
  )}
  {ActiveTab === "Prescription" && <Prescription />}
  {ActiveTab === 'TherapyInformations' && <TherapyInformations />}
  {ActiveTab === 'Therapy' && <Therapist />}
</Suspense>




      </div >



    </>
  );
}

export default TherapistNavigation;





