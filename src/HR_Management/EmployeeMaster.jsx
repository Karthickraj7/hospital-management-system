import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LeaveManagement from "../EmployeeRequest/LeaveManagement";

function EmployeeMaster() {
  const [PageType, setPageType] = useState("LeaveRequest");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  


  return (
    <>
      <div className="Main_container_app">
        <h3>Basic Masters</h3>
        <br />
        <div className="RegisterTypecon">
          <div className="RegisterType eced_p00 NewEmployeeamster">
            {[
              "LeaveRequest",
              "AdvanceRequest",
              "Performance",
              "Complaint/Grievance",
              "Circular",
              "Attendance",
              "EmployeeReport",
            ].map((p, ind) => (
              <div
                style={{
                  width: "auto",
                }}
                className="registertypeval registertypeval_222"
                key={ind}
              >
                <input
                  type="radio"
                  id={p}
                  name="appointment_type"
                  checked={PageType === p}
                  onChange={(e) => {
                    setPageType(e.target.value);
                  }}
                  value={p}
                />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </div>
        </div>
        {PageType === "LeaveRequest" && <LeaveManagement />}
        {/* {activeTab === "BasicMasters" && <NewNavigationMasters />}
        {activeTab === "TestMasterNavigation" && <TestMasterNavigation />}
        {activeTab === "ExternalLabList" && <ExternalLabList />}
        {activeTab === "ReferDoctorList" && <ReferDoctorList />}
        {activeTab === "RatecardLims" && <RatecardLims />}
        {activeTab === "GroupMasterList" && <GroupMasterList />} */}
      </div>
    </>
  );
}

export default EmployeeMaster;
