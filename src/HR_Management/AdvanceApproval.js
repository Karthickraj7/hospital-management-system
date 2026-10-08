import React, { useState, useEffect } from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
const AddvaceApproval = () => {
  const toast = useSelector((state) => state.userRecord?.toast);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [status, setStatus] = useState("");
  const [oldStatus, setOldStatus] = useState("");
  const [reason, setReason] = useState("");
  const [issuedby, setIssued] = useState("");
  const [rejectby, setRejectby] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [installment, setInstallment] = useState(null);
  const [issuedDate, setIssuedDate] = useState("");
  const [rejectDate, setRejectDate] = useState("");
  const [showsudden, setshowsudden] = useState(false);
  const [AmountDeductPerMonth, setAmountDeductPerMonth] = useState(0);

  const handleEditClick = (params) => {
    console.log("params", params);
    setOpenModal(true);
    setSelectedRowData(params);
    setOldStatus(params.status);
    setStatus(params.status);
  };

  const [rolename, setRolename] = useState([]);
  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Designation_Details`)
      .then((response) => {
        console.log(response.data);
        setRolename(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    console.log("Selected Status:", selectedStatus);
    setStatus(selectedStatus);

    if (selectedStatus === "Approved") {
      // Reset fields related to 'Not Approved'
      setReason("");
      setRejectDate("");
      setRejectby("");
    } else {
      // Reset fields related to 'Approved'
      setAmountDeductPerMonth("");
      setIssued("");
      setIssuedDate("");
    }
  };

  const handleReasonChange = (e) => {
    const newReason = e.target.value;
    setReason(newReason);
  };
  const handleInstallmentChange = (e) => {
    const newReason = e.target.value;
    console.log(newReason);
    setInstallment(newReason);

    if (newReason) {
      const monthamount = (
        parseInt(selectedRowData.RequestAmount) / newReason
      ).toFixed(2);
      setAmountDeductPerMonth(monthamount);
    } else {
      setAmountDeductPerMonth(0);
    }
  };

  const handleissuedByChange = (e) => {
    const issued = e.target.value;
    setIssued(issued);
  };
  const handlerejectByChange = (e) => {
    const rejectissued = e.target.value;
    setRejectby(rejectissued);
  };
  const handleissuedDateChange = (e) => {
    const issueddate = e.target.value;
    setIssuedDate(issueddate);
  };
  const handlerejectDateChange = (e) => {
    const rejectdate = e.target.value;
    setRejectDate(rejectdate);
  };

  const handleSubmit = () => {
    // Check if selectedRowData is valid and contains Sl_No
    if (!selectedRowData || !selectedRowData.Sl_No) {
      const tdata = {
        message: "Invalid data: Sl_No is missing.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Prepare the postData object
    const postData = {
      Sl_No: selectedRowData.Sl_No,
      status: status,
      installment: status === "Approved" ? installment : null,
      rejectReason: status === "Not Approved" ? reason : null,
      issuedBy: status === "Approved" ? issuedby : null,
      issuedDate: status === "Approved" ? issuedDate : null,
      rejectedBy: status === "Not Approved" ? rejectby : null,
      rejectedDate: status === "Not Approved" ? rejectDate : null,
      AmountDeductPerMonth: status === "Approved" ? AmountDeductPerMonth : null,
    };

    // Validate fields based on the status
    if (status === "Approved") {
      if (!installment || !issuedby || !issuedDate) {
        const tdata = {
          message:
            "For Approved status, Installment, Issued By, and Issued Date are required.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        return;
      }
    } else if (status === "Not Approved") {
      if (!rejectDate || !rejectby || !reason) {
        const tdata = {
          message:
            "For Not Approved status, Rejected Date, Rejected By, and Reason are required.",
          type: "arn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        return;
      }
    } else {
      const tdata = {
        message: "Status is required.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    console.log("Postdata:", postData);

    // Make the Axios POST request
    axios
      .post(`${UrlLink}HR_Management/update_Advance_Approval`, postData)
      .then((response) => {
        const reste = response.data;
        const typp = Object.keys(reste)[0];
        const mess = Object.values(reste)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        dispatchvalue({ type: "toast", value: tdata });
        setOpenModal(false);
        setshowsudden(!showsudden);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        const tdata = {
          message: "Error submitting data. Please try again.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      });
  };

  const [advanceamountdata, setadvanceamountdata] = useState([]);

  const handleVisibilityClick = (params) => {
    console.log("params", params);
    axios
      .get(`${UrlLink}HR_Management/Prev_Amount_Details?EmployeeId=${params}`)
      .then((response) => {
        console.log(response.data);
        setadvanceamountdata(response.data);
        setOpenModal1(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closemodal = () => {
    setOpenModal(false);
    setSelectedRowData({});
    setInstallment(null);
    setAmountDeductPerMonth("");
  };
  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Pending",
  });

  const [Filterdata, setFilterdata] = useState([]);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target;
    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  useEffect(() => {
    if (SearchQuery !== "") {
      const lowerCaseQuery = SearchQuery.toLowerCase();

      const filteredData = PatientRegisterData.filter((row) => {
        const { EmployeeId, EmployeeName, PhoneNo } = row;
        return (
          (EmployeeId && EmployeeId.toLowerCase().includes(lowerCaseQuery)) ||
          (PhoneNo && PhoneNo.toLowerCase().includes(lowerCaseQuery)) ||
          (EmployeeName && EmployeeName.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilterdata(filteredData);
    } else {
      setFilterdata(PatientRegisterData);
    }
  }, [SearchQuery, PatientRegisterData]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Advance_RequestList_link`, {
        params: searchOPParams,
      })
      .then((res) => {
        const ress = res.data;
        console.log("567", ress);
        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
          setFilterdata(ress);
        } else {
          setPatientRegisterData([]);
          setFilterdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOPParams]);

  return (
    <div>
      <div className="Main_container_app">
        
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Search by <span>:</span>
            </label>
            <input
              type="text"
              name="employeeName"
              placeholder="Employee Name or EmployeeId or PhoneNo"
              value={SearchQuery} // Use the correct state variable here
              onChange={handleSearchChange} // Call the handler on input change
            />
          </div>
          <div className="inp_1">
            <label htmlFor="designation">
              Designation <span>:</span>
            </label>
            <select
              id="designation"
              name="designation"
              value={searchOPParams.designation}
              onChange={handleSearchChangeStatus}
              className="new-custom-input-phone wei32j"
              required
            >
              {/* Explicitly set value to an empty string */}
              <option value="">Select</option>
              {Array.isArray(rolename) && rolename.length > 0 ? (
                rolename.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.Designation}
                  </option>
                ))
              ) : (
                <option disabled>No Option</option>
              )}
            </select>
          </div>
        </div>
        <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th id="slectbill_ins">Employee ID</th>
                <th id="slectbill_ins">Employee Name</th>
                <th id="slectbill_ins">Designation</th>
                <th id="slectbill_ins">Request Date</th>
                <th id="slectbill_ins">Request Amount</th>
                <th id="slectbill_ins">Reason</th>
                <th id="slectbill_ins">Action</th>
              </tr>
            </thead>
            <tbody>
              {Filterdata.length > 0 ? (
                Filterdata.map((leave, index) => (
                  <tr key={leave.id}>
                    <td>{leave.EmployeeId}</td>
                    <td>{leave.EmployeeName}</td>
                    <td>{leave.Designation}</td>
                    <td>{leave.RequestDate}</td>
                    <td>{leave.RequestAmount}</td>
                    <td>{leave.RequestReason}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleVisibilityClick(leave.EmployeeId)}
                        startIcon={<VisibilityIcon />}
                      >
                        {/* View */}
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleEditClick(leave)}
                        startIcon={<CheckCircleOutlineIcon />}
                      >
                        {/* Approve */}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
            className="newwProfiles newwPopupforreason uwagduaguleaveauto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="RegisFormcon leavecon1">
              <div className="RegisForm_1 leaveform_11">
                <label htmlFor="status">
                  Status<span>:</span>
                </label>
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="">Select</option>
                  {oldStatus !== "Approved" && (
                    <option value="Approved">Approved</option>
                  )}
                  {oldStatus !== "Not Approved" && (
                    <option value="Not Approved">Not Approved</option>
                  )}
                </select>
              </div>
            </div>

            {/* Conditional rendering based on status */}
            {status === "Approved" ? (
              <>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="RequestAmount">
                      Request Amount<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="RequestAmount"
                      id="RequestAmount"
                      value={selectedRowData?.RequestAmount}
                      readOnly
                    />
                  </div>
                </div>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="installment">
                      No. of Installments<span>:</span>
                    </label>
                    <input
                      type="number"
                      name="installment"
                      id="installment"
                      value={installment}
                      onChange={handleInstallmentChange}
                    />
                  </div>
                </div>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="AmountDeductPerMonth">
                      Amount Deduct Per Month<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="AmountDeductPerMonth"
                      id="AmountDeductPerMonth"
                      value={AmountDeductPerMonth || 0}
                      readOnly
                    />
                  </div>
                </div>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="issuedDate">
                      Issued Date<span>:</span>
                    </label>
                    <input
                      type="date"
                      name="issuedDate"
                      id="issuedDate"
                      value={issuedDate}
                      onChange={handleissuedDateChange}
                    />
                  </div>
                </div>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="issuedBy">
                      Issued By<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="issued"
                      id="issued"
                      value={issuedby}
                      onChange={handleissuedByChange}
                    />
                  </div>
                </div>
              </>
            ) : status === "Not Approved" ? (
              <>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="rejectedDate">
                      Rejected Date<span>:</span>
                    </label>
                    <input
                      type="date"
                      name="rejectDate"
                      id="rejectDate"
                      value={rejectDate}
                      onChange={handlerejectDateChange}
                    />
                  </div>
                </div>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="rejectedBy">
                      Rejected By<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="rejectby"
                      id="rejectby"
                      value={rejectby}
                      onChange={handlerejectByChange}
                    />
                  </div>
                </div>
                <div className="RegisFormcon leavecon1">
                  <div className="RegisForm_1 leaveform_11">
                    <label htmlFor="rejectReason">
                      Reject Reason<span>:</span>
                    </label>
                    <textarea
                      name="rejectReason"
                      id="rejectReason"
                      onChange={handleReasonChange}
                    ></textarea>
                  </div>
                </div>
              </>
            ) : null}
            <br></br>
            <br></br>

            {/* Submit and Close Buttons */}
            <div className="Register_btn_con regster_btn_contsai">
              <button className="RegisterForm_1_btns" onClick={handleSubmit}>
                Submit
              </button>
              <button className="RegisterForm_1_btns" onClick={closemodal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal1 && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal1(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>Previous Advance Amount</h4>
              </div>
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th id="slectbill_ins">Request Date</th>
                      <th id="slectbill_ins">Advance Amount</th>
                      <th id="slectbill_ins">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advanceamountdata.length > 0 ? (
                      advanceamountdata.map((leave, index) => (
                        <tr key={index}>
                          <td>{leave.RequestDate}</td>
                          <td>{leave.RequestAmount}</td>
                          <td>{leave.Status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No Records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModal1(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default AddvaceApproval;
