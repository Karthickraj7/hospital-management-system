import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ShiftManagement() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(
      `${UrlLink}HR_Management/Employee_Shift_Details_Link?location=${userRecord?.location}&employeeid=${userRecord?.Employeeid}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRows(data);
      })
      .catch((error) => {
        console.error("Error fetching shift data:", error);
      });
  }, [userRecord?.location, userRecord?.Employeeid]);

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Shift Details</h4>
      </div>
      <br />

      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th id="slectbill_ins">Shift startdate</th>
              <th id="slectbill_ins">Shift Enddate</th>
              <th id="slectbill_ins">Shift</th>
              <th id="slectbill_ins">Start Time</th>
              <th id="slectbill_ins">End Time</th>
              <th id="slectbill_ins">Shift Hours</th>
              <th id="slectbill_ins">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.Shift_StartDate}</td>
                  <td>{leave.Shift_EndDate}</td>
                  <td>{leave.ShiftName}</td>
                  <td>{leave.Shift_StartTime}</td>
                  <td>{leave.Shift_EndTime}</td>
                  <td>{leave.ShiftHours}</td>
                  <td>{leave.Status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="IP_norecords">
                    <span>No Records Found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShiftManagement;
