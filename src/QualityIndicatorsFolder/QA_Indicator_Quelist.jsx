// // npm install framer-motion

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Button from "@mui/material/Button";
// import Diversity1Icon from "@mui/icons-material/Diversity1";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { motion } from "framer-motion"; // Import Framer Motion
// import "./QA.css";
// import Dashboard from "./QADashboard";

// const QualityIndicatorsFolder = () => {
//   const navigate = useNavigate();

//   // Example of department options
//   const departmentOptions = [
//     "IP","OPD","HR","LAB", "OT",
//        "RADIOLOGY","INVENTORY", "MEDICAL ERROR"

//   ];

//   // Handle department selection
//   const handleDepartmentSelect = (department) => {
//     if (department === "MEDICAL ERROR") {
//       navigate('/Home/MedicalErrorRegisteration');
//     } else if (department === "IP") {
//       navigate('/Home/IPQAIndicator');
//     }
//     else if (department === "OPD") {
//       navigate('/Home/OPDQAIndicator');
//     }
//     else if (department === "FRONT OFFICE"){
//       navigate('/Home/FrontOfficeQAIndicator')
//     }
//     else if (department === "NURSE"){
//       navigate('/Home/NurseQAIndicator')
//     }
//     else if (department === 'HR')
// {
//   navigate('/Home/HRQAIndicator')
// }
// else if (department === 'OT')
//   {
//     navigate('/Home/OTQAIndicator')
//   }
//   else if (department === 'INVENTORY')
//     {
//       navigate('/Home/InventoryQAIndicator')
//     }
//   else if (department === 'LAB')
//       {
//         navigate('/Home/LabQAIndicator')
//       }
//       else if (department === 'RADIOLOGY')
//         {
//           navigate('/Home/RadiologyQAIndicator')
//         }

//  };

//   return (
//     <>
//       <div className="Main_container_app" style={{padding:'0 50px'}} >
//         {/* Department Buttons */}
//         <div className="department-buttons1venki">
//           {departmentOptions.map((dept) => (
//             <Button
//               key={dept}
//               variant="contained"
//               className="qa-btvenki" // Appended 'venki' to className
//               onClick={() => handleDepartmentSelect(dept)}
//               startIcon={<Diversity1Icon />}
//               style={{ color: "#fff", margin: "0.5rem" , backgroundColor:'#14b8a6',color:'#fff'}} // Text color remains white
//             >
//               {dept}
//               <ArrowForwardIcon />
//             </Button>
//           ))}
//         </div>

//       <Dashboard />
//       </div>
//     </>
//   );
// };

// export default QualityIndicatorsFolder;

import React, { useState, useEffect } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { useDispatch, useSelector } from "react-redux";
import IPQAIndicator from "./IPQAIndicator";
import OPDQAIndicator from "./OPDQAIndicator";
import InventoryQAIndicator from "./InventoryQAIndicator";
import RadiologyQAIndicator from "./RadiologyQAIndicator";
import MedicalErrorRegistration from "./Medical_Error";
import OTQAIndicator from "./OTQAIndicator";
import LabQAIndicator from "./LabQAIndicator";
import HRQAIndicator from "./HRQAIndicator";
import QADashboard from "./QADashboard";

function QualityIndicatorsFolder() {
  const dispatchvalue = useDispatch();

  const OTPatientdata = useSelector(
    (state) => state.Frontoffice?.OTPatientdata
  );
  console.log(OTPatientdata, "OTPatientdata");
  console.log(OTPatientdata?.SurgeryName, "OTPatientdata");

  const [activeTab, setActiveTab] = useState("IPQAIndicator");
  const [isToggled, setIsToggled] = useState(false);

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
      <div className="new-patient-registration-form">
        <br />

        <div className="new-navigationwww">
          <h2>
            <button
              className={activeTab === "QADashboard" ? "active" : ""}
              onClick={() => handleTabChange("QADashboard")}
            >
              QI DashBoard
            </button>
            
            <button
              className={activeTab === "IPQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("IPQAIndicator")}
            >
              IP
            </button>
            
            <button
              className={activeTab === "OPDQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("OPDQAIndicator")}
            >
              OPD
            </button>
            
            <button
              className={activeTab === "HRQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("HRQAIndicator")}
            >
              HR
            </button>
            
            <button
              className={activeTab === "LabQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("LabQAIndicator")}
            >
              LAB
            </button>
            
            <button
              className={activeTab === "OTQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("OTQAIndicator")}
            >
              OT
            </button>
            
            <button
              className={activeTab === "RadiologyQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("RadiologyQAIndicator")}
            >
              RADIOLOGY
            </button>
            
            <button
              className={activeTab === "InventoryQAIndicator" ? "active" : ""}
              onClick={() => handleTabChange("InventoryQAIndicator")}
            >
              INVENTORY
            </button>
            
            <button
              className={
                activeTab === "MedicalErrorRegisteration" ? "active" : ""
              }
              onClick={() => handleTabChange("MedicalErrorRegisteration")}
            >
              MEDICAL ERROR
            </button>
          </h2>
        </div>

        <div className="new-kit ">
         
          <div>
            
          </div>
        </div>
      </div>

      {activeTab === "QADashboard" && <QADashboard />}

      {activeTab === "IPQAIndicator" && <IPQAIndicator />}
      {activeTab === "OPDQAIndicator" && <OPDQAIndicator />}
      {activeTab === "HRQAIndicator" && <HRQAIndicator />}
      {activeTab === "LabQAIndicator" && <LabQAIndicator />}
      {activeTab === "OTQAIndicator" && <OTQAIndicator />}

      {activeTab === "RadiologyQAIndicator" && <RadiologyQAIndicator />}
      {activeTab === "InventoryQAIndicator" && <InventoryQAIndicator />}
      {activeTab === "MedicalErrorRegisteration" && (
        <MedicalErrorRegistration />
      )}
    </>
  );
}

export default QualityIndicatorsFolder;
