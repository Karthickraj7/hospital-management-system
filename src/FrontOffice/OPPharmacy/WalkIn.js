import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Walkinbilling from "./Walkinbilling";
import Walkinbillingip from "./Walkinbillingip";
import WalkinbillingRefundList from "./WalkinbillingRefundList";


const WalkIn = () => {
  const [type, setType] = useState("Billing");


    const [subAccess, setSubAccess] = useState([]);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  useEffect(() => {
    console.log(UserData, "UserData");

    if (UserData) {
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(",").map((item) => item.trim())) ||
        [];

      setSubAccess(setAccess2); // Update state for sub access
    }
  }, [UserData]);

  const handlePageChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
    }
  };



  return (
     <div className="appointment">
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handlePageChange}
          aria-label="Platform"
        >
          <ToggleButton
            value="Billing"
            style={{
              height: "30px",
              width: "180px",
              backgroundColor:
                type === "Patient" ? "var(--selectbackgroundcolor)" : "inherit",
            }}
            className="togglebutton_container"
          >
            OP
          </ToggleButton>
          <ToggleButton
            value="Due"
            style={{
              backgroundColor:
                type === "Due"
                  ? "var(--selectbackgroundcolor)"
                  : "inherit",
              width: "180px",
              height: "30px",
            }}
            className="togglebutton_container"
          >
            IP
          </ToggleButton>
          <ToggleButton
            value="Refund"
            style={{
              backgroundColor:
                type === "Refund"
                  ? "var(--selectbackgroundcolor)"
                  : "inherit",
              width: "180px",
              height: "30px",
            }}
            className="togglebutton_container"
          >
            Refund
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    {type==="Billing" && <Walkinbilling /> }
    {type==="Due" && <Walkinbillingip /> }
    {type==="Refund" && <WalkinbillingRefundList /> }



     </div>
  )
}

export default WalkIn