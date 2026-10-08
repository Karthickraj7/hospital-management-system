import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function DrugAdministrationNurseStation() {
  const [selectedType, setSelectedType] = useState("Request to CS");

  return (
    <>
      <div className="Main_container_app">
       <br />


        <div className="RegisterTypecon navchange">
          <div className="RegisterType">
            {[
              "Request to CS",
           
              "Request to NS",
              "Stock Replace",
            ].map((p, ind) => (
              <div className="registertypeval" key={ind + "key"}>
                <input
                  type="radio"
                  id={p}
                  name="appointment_type"
                  checked={selectedType === p}
                  onChange={() => setSelectedType(p)}
                  value={p}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>
<br />

        <div className="content" style={{ width: "100%" }}>
          {selectedType === "Request to CS" && <div>Request to CS Content</div>}
          {selectedType === "Request to NS" && <div>Request to NS Content</div>}
          {selectedType === "Stock Replace" && <div>Stock Replace Content</div>}
          </div>
      </div>
    </>
  );
}

export default DrugAdministrationNurseStation;

