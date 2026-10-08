import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Complainthistory = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = () => {
    const employeeid = userRecord?.Employeeid;
    setLoading(true); // Start loading when fetch is initiated
    fetch(`${UrlLink}HR_Management/Complaint_Details?employeeid=${employeeid}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const Records = data.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.id,
            EmployeeID: userdata.employeeid,
            EmployeeName: userdata.Employeename,
            IncidentDate: userdata.IncidentDate,
            IncidentTime: userdata.IncidentTime,
            Complaint: userdata.Complaint,
            Description: userdata.Description,
            Remarks: userdata.Remarks,
            AgainstEmployeeId: userdata.AgainstEmployeeId,
            AgainstEmployeeName: userdata.AgainstEmployeeName,
            AgainstEmployeeDepartment: userdata.AgainstEmployeeDepartment,
            Witness: userdata.Witness,
            Status: userdata.Status,
          }));
          setRows(Records);
        } else {
          console.error('Data is not an array:', data);
          setError('No data found');
        }
      })
      .catch((error) => {
        console.log(error);
        setError('Error fetching complaint data');
      })
      .finally(() => {
        setLoading(false); // End loading when the fetch is complete
      });
  };

  return (
    <div>
      <div className="Selected-table-container">
        {loading ? (
          <p>Loading complaints...</p> // Show loading message while data is fetching
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p> // Show error message if fetch fails
        ) : rows.length > 0 ? (
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th id="slectbill_ins">Employee ID</th>
                <th id="slectbill_ins">Employee Name</th>
                <th id="slectbill_ins">Incident Date</th>
                <th id="slectbill_ins">Incident Time</th>
                <th id="slectbill_ins">Complaint</th>
                <th id="slectbill_ins">Description</th>
                <th id="slectbill_ins">Remarks</th>
                <th id="slectbill_ins">Against Employee ID</th>
                <th id="slectbill_ins">Against Employee Name</th>
                <th id="slectbill_ins">Employee Department</th>
                <th id="slectbill_ins">Witness</th>
                <th id="slectbill_ins">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.EmployeeID}</td>
                  <td>{leave.EmployeeName}</td>
                  <td>{leave.IncidentDate}</td>
                  <td>{leave.IncidentTime}</td>
                  <td>{leave.Complaint}</td>
                  <td>{leave.Description || 'No Description'}</td>
                  <td>{leave.Remarks || 'No Remarks'}</td>
                  <td>{leave.AgainstEmployeeId}</td>
                  <td>{leave.AgainstEmployeeName}</td>
                  <td>{leave.AgainstEmployeeDepartment}</td>
                  <td>{leave.Witness || 'No Witness'}</td>
                  <td>{leave.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', color: '#555', fontSize: '18px' }}>
            No complaints applied.
          </p>
        )}
      </div>
    </div>
  );
};

export default Complainthistory;
