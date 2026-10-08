import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const AddvaceConsume = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userRecord || !UrlLink) {
      setErrorMessage("Invalid user or URL settings.");
      return;
    }
    setIsLoading(true);
    fetchLeaveData();
  }, [userRecord, UrlLink]);

  const fetchLeaveData = async () => {
    const employeeid = userRecord?.Employeeid;
    try {
      const response = await fetch(
        `${UrlLink}HR_Management/AdvanceComplete_Amount_Details?EmployeeID=${employeeid}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        const Records = data.map((userdata, index) => ({
          id: index + 1,
          Sl_No: userdata.Sl_No,
          employeeid: userdata.EmployeeId,
          employeename: userdata.EmployeeName,
          reqdate: userdata.RequestDate,
          reqamount: userdata.RequestAmount,
          reason: userdata.RequestReason,
          installment: userdata.Repayment_Due,
          status: userdata.Status,
          rejectreason: userdata.Reject_Reason || "-",
          approvedby: userdata.Issuever_Name || "-",
          issueddate: userdata.IssuedDate || "-",
        }));
        setRows(Records);
      } else {
        setRows([]);
        setErrorMessage("Unexpected data format.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="Selected-table-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : rows.length > 0 ? (
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th id="slectbill_ins">Employee ID</th>
                <th id="slectbill_ins">Employee Name</th>
                <th id="slectbill_ins">Request Amount</th>
                <th id="slectbill_ins">Reason</th>
                <th id="slectbill_ins">No.of.Installment</th>
                <th id="slectbill_ins">Status</th>
                <th id="slectbill_ins">Reject Reason</th>
                <th id="slectbill_ins">Issued Date</th>
                <th id="slectbill_ins">Issued By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((leave) => (
                <tr key={leave.Sl_No}>
                  <td>{leave.employeeid}</td>
                  <td>{leave.employeename}</td>
                  <td>{leave.reqamount}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.installment}</td>
                  <td>{leave.status}</td>
                  <td>{leave.rejectreason}</td>
                  <td>{leave.issueddate}</td>
                  <td>{leave.approvedby}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No complete installment</p>
        )}
      </div>
    </div>
  );
};

export default AddvaceConsume;
