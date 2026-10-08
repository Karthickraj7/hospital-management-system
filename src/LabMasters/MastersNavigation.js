import React, { useState, useEffect } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Department from "./Department";
import Units from "./Unit";
import Container from "./Container";
import Specimen from "./Specimen";
import Methods from "./Methods";
import OrganismMaster from "./OrganismMaster";
import AntibioticMaster from "./AntibioticMaster";
import Equipments from "./Equipments";
import FileUploadForm from "./wordfile";
import RemarksMaster from "./RemarksMaster";
import ReasonMaster from "./ReasonMaster";
import QualificationMaster from "./QualificationMaster";
import LabRemarksMaster from "./LabRemarksMaster";
import FormulaMaster from "./FormulaMaster";

function MastersNavigation() {
  const [activeTab, setActiveTab] = useState("DepartmentManagement");
  const [isToggled, setIsToggled] = useState(false);
  console.log(isToggled);
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
        // closeToggle();
      }
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  });

  return (
    <>
      <div className="new-patient-registration-form">
        <br />
        <div className="new-patient-registration-form1">
          <div className="new-navigation">
            <h2>
              <button onClick={() => handleTabChange("DepartmentManagement")}>
                Department Master
              </button>
              |
              <button onClick={() => handleTabChange("UnitMaster")}>
                Unit Master
              </button>
              |
              <button onClick={() => handleTabChange("ContainerMaster")}>
                Container Master
              </button>
              |
              <button onClick={() => handleTabChange("SpecimenMaster")}>
                Specimen Master
              </button>
              |
              <button onClick={() => handleTabChange("MethodsMaster")}>
                Methods Master
              </button>
              |
              <button onClick={() => handleTabChange("OrganismMaster")}>
                Organism Master
              </button>
              |
              <button onClick={() => handleTabChange("AntibioticMaster")}>
                Antibiotic Master
              </button>
              |
              <button onClick={() => handleTabChange("EquipmentsMaster")}>
                Equipments Master
              </button>
              |
              <button onClick={() => handleTabChange("DocumentUpload")}>
                Report Template Upload
              </button>
              |
              <button onClick={() => handleTabChange("RemarksMaster")}>
                Remarks Master
              </button>
              |
              <button onClick={() => handleTabChange("ReasonMaster")}>
                Reason Master
              </button>
              |
              <button onClick={() => handleTabChange("QualificationMaster")}>
                Qualification Master
              </button>
              |
              <button onClick={() => handleTabChange("LabRemarksMaster")}>
                Lab Remarks Master
              </button>
              {/* |
              <button onClick={() => handleTabChange("FormulaMaster")}>
                Formula Master
              </button> */}
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
                      onClick={() => handleTabChange("DepartmentManagement")}
                    >
                      Department Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("UnitMaster")}>
                      Unit Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("ContainerMaster")}>
                      Container Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("SpecimenMaster")}>
                      Specimen Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("MethodsMaster")}>
                      Methods Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("OrganismMaster")}>
                      Organism Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("AntibioticMaster")}>
                      Antibiotic Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("EquipmentsMaster")}>
                      Equipments Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("DocumentUpload")}>
                      Report Template Upload
                    </button>{" "}
                    |
                    <button onClick={() => handleTabChange("RemarksMaster")}>
                      RemarksMaster
                    </button>
                    |
                    <button onClick={() => handleTabChange("ReasonMaster")}>
                      Reason Master
                    </button>
                    |
                    <button
                      onClick={() => handleTabChange("QualificationMaster")}
                    >
                      Qualification Master
                    </button>
                    |
                    <button onClick={() => handleTabChange("LabRemarksMaster")}>
                      Lab Remarks Master
                    </button>
                    {/* |
              <button onClick={() => handleTabChange("FormulaMaster")}>
                Formula Master
              </button> */}
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeTab === "DepartmentManagement" && <Department />}
      {activeTab === "UnitMaster" && <Units />}
      {activeTab === "ContainerMaster" && <Container />}
      {activeTab === "SpecimenMaster" && <Specimen />}
      {activeTab === "MethodsMaster" && <Methods />}
      {activeTab === "OrganismMaster" && <OrganismMaster />}
      {activeTab === "AntibioticMaster" && <AntibioticMaster />}
      {activeTab === "EquipmentsMaster" && <Equipments />}
      {activeTab === "DocumentUpload" && <FileUploadForm />}
      {activeTab === "RemarksMaster" && <RemarksMaster />}
      {activeTab === "ReasonMaster" && <ReasonMaster />}
      {activeTab === "QualificationMaster" && <QualificationMaster />}
      {activeTab === "LabRemarksMaster" && <LabRemarksMaster />}
      {/* {activeTab === "FormulaMaster" && <FormulaMaster />} */}
    </>
  );
}

export default MastersNavigation;
