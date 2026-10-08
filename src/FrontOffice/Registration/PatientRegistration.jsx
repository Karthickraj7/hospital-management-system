import React, { useState, useEffect, lazy, Suspense } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import NewBasicRegistation from './NewBasicRegistation';
// import PatientFamilyDetails from './PatientFamilyDetails';
import EmergencyRegistration from "./EmergencyRegistration";
import EmergencyPatientRoomRegistration from "./EmergencyPatientRoomRegistration";

const PatientRegistration = () => {
    const [ActiveTab, setActiveTab] = useState('EmergencyRegistration')
    const [isToggled, setIsToggled] = useState(false)
    const toggle = () => setIsToggled(!isToggled);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        closeToggle();
    };

    const closeToggle = () => {
        setIsToggled(false);
      };
    
  return (
    <>
    <div className="Main_container_app">
       <div className="">

        <div className="new-patient-registration-form">
            <div className="new-navigation">
                <h2>
                    <button style={{ color: ActiveTab === "EmergencyRegistration" ? 'white' : '' }} onClick={() => handleTabChange("EmergencyRegistration")}>
                    Emergency Registration
                    </button>
                    |
                    <button style={{ color: ActiveTab === "EmergencyPatientRoomRegistration" ? 'white' : '' }} onClick={() => handleTabChange("EmergencyPatientRoomRegistration")}>
                    Emergency Patient Room Registration
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
                      <button style={{ color: ActiveTab === "EmergencyRegistration" ? 'white' : '' }} onClick={() => handleTabChange("EmergencyRegistration")}>
                      Emergency Registration
                      </button>
                      |
                      <button style={{ color: ActiveTab === "EmergencyPatientRoomRegistration" ? 'white' : '' }} onClick={() => handleTabChange("EmergencyPatientRoomRegistration")}>
                      Emergency Patient Room Registration
                      </button>
                    
                    </h2>
                  </div>
                )}
              </div>
            </div>


            
            

        </div>

        </div>



        <Suspense fallback={<div>Loading...</div>}>
            {ActiveTab === "EmergencyRegistration" && <EmergencyRegistration />}
            {ActiveTab === "EmergencyPatientRoomRegistration" && <EmergencyPatientRoomRegistration />}
        </Suspense>

    </div>

    
    
    </>
  )
}

export default PatientRegistration;





















