import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const LeaveStatus = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [rows, setRows] = useState([]);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = () => {
    const employeeid = userRecord?.Employeeid;
    fetch(`${UrlLink}HR_Management/Employee_Leave_Status_Link?EmployeeID=${employeeid}&location=${userRecord?.location}`)
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
            rejectstatus: userdata.rejectstatus,
          }));
          setRows(Records);
          console.log('record', Records);
        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="Selected-table-container">
        {rows.length > 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {rows.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.EmployeeID}</td>
                  <td>{leave.EmployeeName}</td>
                  <td>{leave.LeaveType}</td>
                  <td>{leave.FromDate}</td>
                  {/* Conditionally render ToDate */}
                  <td>{leave.DaysCount > 1 ? leave.ToDate : '-'}</td>
                  <td>{leave.DaysCount}</td>
                  <td>{leave.Reason}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '120px',
              fontSize: '18px',
              color: '#555',
            }}
          >
            No leave requests applied.
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaveStatus;
