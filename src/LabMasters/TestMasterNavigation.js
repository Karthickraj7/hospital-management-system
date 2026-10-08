import React, { useState, useEffect } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import AddInterpretation from "./AddInterpretation";
import ReflexMaster from "./ReflexMaster";
import AgeSetUp from "./AgeSetUp";
import AddGuidelines from "./AddGuidelines";

function TestMasterNavigation() {
  const [activeTab, setActiveTab] = useState("AgeSetUp");
  const [isToggled, setIsToggled] = useState(false);
  // const urllink = useSelector(state => state.userRecord?.UrlLink)

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
      <div className="appointment">
       
        <br />
        <div className="new-patient-registration-form1">
          <div className="new-navigation">
            <h2>
            <button onClick={() => handleTabChange("AgeSetUp")}>
            AgeSetUp
              </button>
              |
              <button onClick={() => handleTabChange("ReflexMaster")}>
                Reflex Master
              </button>
              |
              <button onClick={() => handleTabChange("AddInterpretation")}>
                Add Interpretation
              </button>
              |
              <button onClick={() => handleTabChange("AddGuidelines")}>
                Add Guidelines
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
                  <button onClick={() => handleTabChange("AgeSetUp")}>
            AgeSetUp
              </button>
              |
                    <div class="Lab_dropdown">
                      <button class="Lab_button">Lab</button>
                      <div class="Lab_dropdown_content">
                        <button onClick={() => handleTabChange("ReflexMaster")}>
                          Reflex Master
                        </button>
                        |
                        <button
                          onClick={() => handleTabChange("AddInterpretation")}
                        >
                          Add Interpretation
                        </button>
                        |
                        <button
                          onClick={() => handleTabChange("AddGuidelines")}
                        >
                           Add Guidelines
                        </button>
                      </div>
                    </div>
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeTab === "ReflexMaster" && <ReflexMaster />}
      {activeTab === "AddInterpretation" && <AddInterpretation />}
      {activeTab === "AddGuidelines" && <AddGuidelines />}
      {activeTab === "AgeSetUp" && <AgeSetUp />}
    </>
  );
}

export default TestMasterNavigation;

