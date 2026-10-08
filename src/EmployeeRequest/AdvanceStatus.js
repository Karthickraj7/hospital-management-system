import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AddvaceStatus = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [openModal, setOpenModal] = useState(false);
  const [advancedetails, setadvancedetails] = useState([]);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = () => {
    const employeeId = userRecord?.Employeeid;
    fetch(
      `${UrlLink}HR_Management/Req_Recent_Advance_Register_Recent?Employeeid=${employeeId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const Records = data.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.Sl_No,
            employeeid: userdata.EmployeeId,
            employeename: userdata.EmployeeName,
            designation: userdata.Designation,
            reqdate: userdata.RequestDate,
            reqamount: userdata.RequestAmount,
            reason: userdata.RequestReason,
            installment: userdata.Repayment_Due,
            status: userdata.Status,
            rejectreason: userdata.Reject_Reason,
            issueddate: userdata.IssuedDate,
            issuedby: userdata.Issuever_Name,
            AmountDeductPerMonth: userdata?.AmountDeduct_PerMonth,
            Installment_Status: userdata?.InstallmentStatus,
            No_of_MonthPaid: userdata?.No_of_MonthPaid,
            PaidAmount: userdata?.PaidAmount,
          }));
          setRows(Records);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVisibilityClick = (params) => {
    console.log("params", params);
    setOpenModal(true);
    axios
      .get(
        `${UrlLink}HR_Management/Advance_Amount_Details?employeeid=${params?.employeeid}`
      )
      .then((res) => {
        console.log(res);
        setadvancedetails(res.data);
      })
      .catch((err) => {
        console.error(err);
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
                <th id="slectbill_ins">Request Date</th>
                <th id="slectbill_ins">Request Amount</th>
                <th id="slectbill_ins">Reason</th>
                <th id="slectbill_ins">Status</th>
                <th id="slectbill_ins">View Installment Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.employeeid}</td>
                  <td>{leave.employeename}</td>
                  <td>{leave.reqdate}</td>
                  <td>{leave.reqamount}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    {leave.status === "Approved" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleVisibilityClick(leave)}
                        startIcon={<VisibilityIcon />}
                      >
                        View
                      </Button>
                    ) : (
                      "None"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No advance status available</p>
        )}
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>Installment Details</h4>
              </div>
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th id="slectbill_ins">Approved Amount</th>
                      <th id="slectbill_ins">Approved Date</th>
                      <th id="slectbill_ins">No.of Installment</th>
                      <th id="slectbill_ins">Amount Per Month</th>
                      <th id="slectbill_ins">No.of Month Paid</th>
                      <th id="slectbill_ins">Installment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(advancedetails)}
                    {Array.isArray(advancedetails) &&
                    advancedetails.length > 0 ? (
                      advancedetails.map((employee, index) => (
                        <tr key={index}>
                          <td>{employee.Request_Amount}</td>
                          <td>{employee.IssuedDate}</td>
                          <td>{employee.Repayment_Due}</td>
                          <td>{employee.AmountPerMonth}</td>
                          <td>{employee.NoofMonthPaid}</td>
                          <td>{employee.InstallmentStatus}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddvaceStatus;
