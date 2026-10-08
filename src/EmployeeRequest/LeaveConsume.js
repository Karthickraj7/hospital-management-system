import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const LeaveConsume = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [leaveStatusRows, setLeaveStatusRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const fetchLeaveData = () => {
    const employeeid = userRecord?.Employeeid;
    fetch(
      `${UrlLink}HR_Management/Employee_FullLeave_Status_Link?EmployeeID=${employeeid}&location=${userRecord?.location}`
    )
      .then((response) => response.json())

      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          const Records = data.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.id,
            EmployeeID: userdata.Employee_Id,
            EmployeeName: userdata.EmployeeName,
            LeaveType: userdata.Leave_Type,
            FromDate: userdata.FromDate,
            ToDate: userdata.ToDate,
            DaysCount: userdata.DaysCount,
            Reason: userdata.Reason,
            status: userdata.Status,
            rejectstatus: userdata.RejectReason,
          }));
          setLeaveStatusRows(Records);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching leave data:", error);
      });
  };
  const fetchPermissionData = () => {
    const employeeid = userRecord?.Employeeid;
    setLoading(true); // Set loading to true before fetching
    fetch(
      `${UrlLink}HR_Management/Employee_Consume_Permission_Link?EmployeeID=${employeeid}&location=${userRecord?.location}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          const Records = data.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.id,
            EmployeeID: userdata.Employee_Id,
            EmployeeName: userdata.EmployeeName,
            LeaveType: userdata.Leave_Type,
            PermissionDate: userdata.Date,
            fromtime: userdata.FromTime,
            totime: userdata.ToTime,
            hours: userdata.HoursCount,
            Reason: userdata.Reason,
            status: userdata.Status,
            rejectstatus: userdata.rejectstatus,
          }));
          setRows(Records);
        } else {
          console.error("Data is not an array:", data);
        }
        setLoading(false); // Set loading to false after data is processed
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Set loading to false on error
      });
  };

  useEffect(() => {
    fetchLeaveData();
    fetchPermissionData();
  }, []);

  return (
    <>
      <div className="Main_container_app">
        <div className="common_center_tag">
          <span>Leave Details</span>
        </div>
        <div className="Selected-table-container">
          {leaveStatusRows.length > 0 ? (
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th id="slectbill_ins">Employee ID</th>
                  <th id="slectbill_ins">Employee Name</th>
                  <th id="slectbill_ins">Leave Type</th>
                  <th id="slectbill_ins">From Date</th>
                  <th id="slectbill_ins">To Date</th>
                  <th id="slectbill_ins">Days</th>
                  <th id="slectbill_ins">Reason</th>
                  <th id="slectbill_ins">Status</th>
                  <th id="slectbill_ins">Reject Reason</th>
                </tr>
              </thead>
              <tbody>
                {leaveStatusRows.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.EmployeeID}</td>
                    <td>{leave.EmployeeName}</td>
                    <td>{leave.LeaveType}</td>
                    <td>{leave.FromDate}</td>
                    <td>{leave.DaysCount > 1 ? leave.ToDate : "-"}</td>
                    <td>{leave.DaysCount}</td>
                    <td>{leave.Reason}</td>
                    <td>{leave.status}</td>
                    <td>{leave.rejectstatus ? leave.rejectstatus : "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "120px",
                fontSize: "18px",
                color: "#555",
              }}
            >
              No leave requests applied.
            </p>
          )}
        </div>

        <br></br>
        <div className="common_center_tag">
          <span>Permission Details</span>
        </div>
        <div className="Selected-table-container">
          {loading ? (
            <p>Loading...</p> // Show loading indicator while fetching
          ) : rows.length > 0 ? (
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th id="slectbill_ins">Employee ID</th>
                  <th id="slectbill_ins">Employee Name</th>
                  <th id="slectbill_ins">Leave Type</th>
                  <th id="slectbill_ins">Date</th>
                  <th id="slectbill_ins">From Time</th>
                  <th id="slectbill_ins">To Time</th>
                  <th id="slectbill_ins">Hours</th>
                  <th id="slectbill_ins">Reason</th>
                  <th id="slectbill_ins">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.EmployeeID}</td>
                    <td>{leave.EmployeeName}</td>
                    <td>{leave.LeaveType}</td>
                    <td>{leave.PermissionDate}</td>
                    <td>{leave.fromtime}</td>
                    <td>{leave.totime}</td>
                    <td>{leave.hours}</td>
                    <td>{leave.Reason}</td>
                    <td>{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "150px", // Optional: adjust as needed for spacing
                fontSize: "18px", // Optional: adjust font size
                color: "#555", // Optional: text color for better visibility
              }}
            >
              No permission requests available.
            </p> // Show message if no data is available
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveConsume;
