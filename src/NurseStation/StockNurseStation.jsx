import React, { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StockDetailsNurseStation from "./StockDetailsNurseStation";

import IndentRaise from "./IndentRaise";
import IndentIssue from "./IndentIssue";
import IndentIssueList from "./IndentIssueList";
import IndentRaiseList from "./IndentRaiseList";
import IndentRecieveList from "./IndentRecieveList";
import Indentrequest from "./Indentrequest";
import MinMaxReorder from "./MinMaxReorder";

function StockNurseStation() {
  const [selectedType, setSelectedType] = useState("Stock Details");

  return (
    <>
      <div className="Main_container_app">
        <br />

        <div className="RegisterTypecon navchange">
          <div className="RegisterType">
            {[
              "Stock Details",
              "Indent Raise",
              "Indent Issue",
              "Indent Recieve",
              "Request",
              "Mini Max Reorder"
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
          {selectedType === "Stock Details" && <StockDetailsNurseStation />}
          {selectedType === "Indent Raise" && <IndentRaiseList />}
          {selectedType === "Indent Issue" && <IndentIssueList />}
          {selectedType === "Indent Recieve" && <IndentRecieveList />}
          {selectedType === "Request" && <Indentrequest/>}
          {selectedType === "Mini Max Reorder" && <MinMaxReorder/>}
        </div>
      </div>
    </>
  );
}

export default StockNurseStation;
