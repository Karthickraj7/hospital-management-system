import React, { useState, useEffect } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import bgImg2 from "../../Assets/bgImg2.jpg";
import OtNursePre from "./OtNursePre";
import OtNurseIntra from "./OtNurseIntra";
import OtNursePost from "./OtNursePost";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";



function OtNurseeNavigation() {


  const dispatchvalue = useDispatch();
   const OTPatientdata = useSelector((state) => state.Frontoffice?.OTPatientdata);
   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [activeTab, setActiveTab] = useState("OtNursePost");
    const [isToggled, setIsToggled] = useState(false);

     const toast = useSelector((state) => state.userRecord?.toast);

    console.log(OTPatientdata,'OTPatientdata')

    const [formdata,setformdata] = useState({

      WheelInTime : "",
      WheelOutTime : "",
      DoctorInTime : "",
      ProcedureStartTime : "",
      ProcedureendTime : ""
    })

    const handleChange = (e) => {

      const {value,name} = e.target;

      setformdata((prev) => ({

        ...prev,
        [name]: value,

      }))


    }
   
    const toggle = () => setIsToggled(!isToggled);
    const handleTabChange = (tab) => {
      setActiveTab(tab);
      closeToggle();
    };
  
    const closeToggle = () => {
      setIsToggled(false);
    };

    const [isChecked, setIsChecked] = useState(OTPatientdata?.Status === "Completed" ?? false);
    
    
      const handleConfirmationChange = (event) => {
    
        console.log(event.target.checked,'event.target.checked');  
        setIsChecked(event.target.checked);
        console.log("Checkbox Checked:", event.target.checked);
    
        const data = {
            isChecked : !isChecked,
            Booking_Id : OTPatientdata?.Booking_Id,
            ...formdata
        }
    
        console.log(data)
    
        axios.post(`${UrlLink}OT/Confirmation_by_nurse`, data)
        .then((res) => {
      
          const response = res.data;
                      const messageType = Object.keys(response)[0];
                      const messageContent = Object.values(response)[0];
                      console.log(messageType);
                      console.log(messageContent);
                      dispatchvalue({
                          type: 'toast',
                          value: { message: messageContent, type: messageType },
                      });      
        })
        .catch((err) => console.log(err));
    
      };
    
  
    return (
      <>
        <br />
        <div className="new-patient-registration-form">
          <div className="dctr_info_up_head">
            <div className="RegisFormcon ">
              <div className="dctr_info_up_head22">
                {/* {workbenchformData.PatientPhoto ? (
                  <img src={workbenchformData.PatientPhoto} alt="Patient Photo" /> */}
                {/* ) : ( */}
                <img src={bgImg2} alt="Default Patient Photo" />
                {/* )} */}
                <label>Profile</label>
              </div>
            </div>
  
            <div className="RegisFormcon">
              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                  Patient Name <span>:</span>{" "}
                </label>
  
                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                { OTPatientdata?.PatientName }
                </span>
              </div>
              
              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                  Patient ID <span>:</span>
                </label>
  
                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                  
                { OTPatientdata?.patientId }
                </span>
              </div>
              {/* <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                  Date of birth <span>:</span>{" "}
                </label>
  
                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                  {workbenchformData.firstName + " " + workbenchformData.lastName}{" "}
                </span>
              </div> */}
              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                  Age <span>:</span>{" "}
                </label>
  
                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                { OTPatientdata?.Age }
                </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                  Gender <span>:</span>{" "}
                </label>
  
                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                {OTPatientdata?.Gender }
                </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                  Primary Doctor <span>:</span>{" "}
                </label>
  
                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                { OTPatientdata?.DoctorName }
                </span>
              </div>

              <div className="RegisForm_1 ">
              <label htmlFor="FirstName">
              SurgeryName <span>:</span>{" "}
              </label>

              <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                {/* {workbenchformData.Location}{" "} */}
                {OTPatientdata?.SurgeryName}
              </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                PatientCategory <span>:</span>{" "}
                </label>

                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                  {/* {workbenchformData.Location}{" "} */}
                  {OTPatientdata?.PatientCategory}
                </span>
              </div>

              <div className="RegisForm_1 ">
                <label htmlFor="FirstName">
                BloodGroup <span>:</span>{" "}
                </label>

                <span className="dctr_wrbvh_pice" htmlFor="FirstName">
                  {/* {workbenchformData.Location}{" "} */}
                  {OTPatientdata?.BloodGroup}
                </span>
              </div>

              <div className="RegisForm_1 ">
              <label>
                          Wheel In Time <span>:</span>
                        </label>
                        <input
                          type="Time"
                       //   onKeyDown={blockInvalidChar}
                          name="WheelInTime"
                         value={formdata.WheelInTime || ""}
                        onChange={handleChange}
                        />
              </div>

                <div className="RegisForm_1 ">
              <label>
                          Doctor In Time <span>:</span>
                        </label>
                        <input
                          type="Time"
                       //   onKeyDown={blockInvalidChar}
                          name="DoctorInTime"
                         value={formdata.DoctorInTime || ""}
                         onChange={handleChange}
                        />
              </div>

              <div className="RegisForm_1 ">
              <label>
                          Procedure Start Time <span>:</span>
                        </label>
                        <input
                          type="Time"
                       //   onKeyDown={blockInvalidChar}
                          name="ProcedureStartTime"
                         value={formdata.ProcedureStartTime || ""}
                         onChange={handleChange}
                        />
              </div>

              <div className="RegisForm_1 ">
              <label>
                          Procedure End Time <span>:</span>
                        </label>
                        <input
                          type="Time"
                       //   onKeyDown={blockInvalidChar}
                          name="ProcedureendTime"
                         value={formdata.ProcedureendTime || ""}
                         onChange={handleChange}
                        />
              </div>

              <div className="RegisForm_1 ">
              <label>
                          Wheel Out Time <span>:</span>
                        </label>
                        <input
                          type="Time"
                       //   onKeyDown={blockInvalidChar}
                          name="WheelOutTime"
                         value={formdata.WheelOutTime || ""}
                         onChange={handleChange}
                        />
              </div>

            

              

              
             
            </div>

           

          </div>
          <br />
  
          <div className="new-patient-registration-form1">
            <div className="new-navigation">
              <h2>
                <button onClick={() => handleTabChange("OtNursePre")}>
                  Pre-Operative Checklist
                </button>
                |
                <button onClick={() => handleTabChange("OtNurseIntra")}>
                  Intra-Operative Checklist
                </button>
                |
                <button onClick={() => handleTabChange("OtNursePost")}>
                  Post-Operative Checklist
                </button>
                |
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px" }}>
        <input
          type="checkbox"
          id="confirmation"
          checked={isChecked}
          onChange={handleConfirmationChange}
          style={{ width: "24px", height: "24px", cursor: "pointer" }}
        />
        <label
          htmlFor="confirmation"
          style={{ marginLeft: "12px", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}
        >
          Completed
        </label>
      </div>
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
                      <button onClick={() => handleTabChange("OtNursePre")}>
                        Pre-Operative Checklist
                      </button>
                      |
                      <button onClick={() => handleTabChange("OtNurseIntra")}>
                        Intra-Operative Checklist
                      </button>
                      |
                      <button onClick={() => handleTabChange("OtNursePost")}>
                        Post-Operative Checklist
                      </button>
                      |
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px" }}>
        <input
          type="checkbox"
          id="confirmation"
          checked={isChecked}
          onChange={handleConfirmationChange}
          style={{ width: "24px", height: "24px", cursor: "pointer" }}
        />
        <label
          htmlFor="confirmation"
          style={{ marginLeft: "12px", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}
        >
          Completed
        </label>
      </div>
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>

         <ToastAlert Message={toast.message} Type={toast.type} />
          
        </div>
  
        {activeTab === "OtNursePre" && <OtNursePre />}
        {activeTab === "OtNurseIntra" && <OtNurseIntra />}
        {activeTab === "OtNursePost" && <OtNursePost />}

        

       
      </>
    );
  }
export default OtNurseeNavigation





