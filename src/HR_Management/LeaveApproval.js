import React, { useState, useCallback } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const LeaveApproval = () => {
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord", userRecord);
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [showsudden, setshowsudden] = useState(false);
  const [leaveCounts, setLeaveCounts] = useState([]);
  const [rows, setRows] = useState([]);
  const [rows1, setRows1] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [status, setStatus] = useState("");
  const [reject, setReject] = useState("");

  const [permissionLeaveCounts, setpermissionLeaveCounts] = useState([]);
  const [prevleavedetails, setprevleavedetails] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const url = `${UrlLink}HR_Management/All_Employee_Leave_Status_Link?location=${userRecord?.location}`;
      const leaveRegisterResponse = await fetch(url);

      // Use .text() instead of .json() to get the raw response as text
      const textData = await leaveRegisterResponse.text();

      // Try to parse the response as JSON
      try {
        const leaveRegisterData = JSON.parse(textData);

        let combinedData = [];

        if (Array.isArray(leaveRegisterData)) {
          combinedData = leaveRegisterData.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.Sl_No,
            employeeid: userdata.Employee_Id,
            employeename: userdata.EmployeeName,
            leaveType: userdata.Leave_Type,
            fromdate: userdata.FromDate,
            todate: userdata.ToDate,
            days: userdata.DaysCount,
            designation: userdata.Designation,
            reason: userdata.Reason,
          }));
        } else {
          console.log(
            "Leave register data is not an array:",
            leaveRegisterData
          );
        }

        setRows(combinedData);
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
      }
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  }, [UrlLink, userRecord]);

  const fetchPermissionsData = useCallback(() => {
    fetch(
      `${UrlLink}HR_Management/All_Permission_details_link?location=${userRecord?.location}`
    )
      .then((response) => response.text()) // Read the response as text
      .then((textData) => {
        try {
          const data = JSON.parse(textData); // Manually parse the text into JSON
          if (Array.isArray(data)) {
            const Records = data.map((userdata, index) => ({
              id: index + 1,
              Sl_No: userdata.Sl_No, // Updated to map from backend
              employeeid: userdata.Employee_Id,
              employeename: userdata.EmployeeName,
              leaveType: userdata.Leave_Type,
              fromtime: userdata.FromTime,
              totime: userdata.ToTime,
              hours: userdata.HoursCount,
              reason: userdata.Reason,
              designation: userdata.Designation,
            }));
            setRows1(Records);
          } else {
            console.log("Data is not an array:", data);
          }
        } catch (error) {
          console.error("Error parsing response data:", error);
        }
      })
      .catch((error) => {
        console.log("Error fetching permissions data:", error);
      });
  }, [UrlLink, userRecord]);

  const handleVisibilityClick = async (prams) => {
    // Extract required values
    const location1 = userRecord?.location;
    const employeeId = prams.employeeid;

    // Ensure essential data exists before making the request
    if (!employeeId || !location1) {
      setLeaveCounts([]); // Clear the leave counts
      setprevleavedetails([]); // Clear previous leave details
      setOpenModal1(false); // Ensure modal is closed
      return;
    }

    try {
      // Make the first API call to fetch leave details
      const leaveResponse = await axios.get(
        `${UrlLink}HR_Management/Employee_Leave_Details`,
        {
          params: {
            location: location1,
            EmployeeId: employeeId,
          },
        }
      );

      const leaveData = leaveResponse.data;

      // Set leave counts based on the first API response
      if (leaveData) {
        setLeaveCounts(leaveData);
      } else {
        setLeaveCounts([]); // Fallback if no data is received
      }

      // Make the second API call to fetch previous leave details
      const prevLeaveResponse = await axios.get(
        `${UrlLink}HR_Management/Employee_Previous_Leave_Details`,
        {
          params: {
            location: location1,
            EmployeeId: employeeId,
          },
        }
      );

      const prevLeaveData = prevLeaveResponse.data;

      // Set previous leave details based on the second API response
      if (prevLeaveData) {
        setprevleavedetails(prevLeaveData);
      } else {
        setprevleavedetails([]); // Fallback if no data is received
      }

      // Open the modal only after both API calls have completed successfully
      setOpenModal1(true);
    } catch (error) {
      console.error("Error fetching leave data:", error);

      // Ensure both state variables are cleared in case of an error
      setLeaveCounts([]);
      setprevleavedetails([]);
      setOpenModal1(false); // Ensure modal is closed in case of an error
    }
  };

  const handleVisibilityClick1 = async (prams) => {
    console.log("prams123", prams);
    // Mark function as async
    const location1 = userRecord?.location;

    const employeeId = prams;

    // Validate inputs
    if (!employeeId || !location1) {
      setpermissionLeaveCounts([]);
      setOpenModal3(false);
      return;
    }

    try {
      // Perform API request
      const PermissionResponse = await axios.get(
        `${UrlLink}HR_Management/Employee_Permission_Details`,
        {
          params: {
            location: location1,
            EmployeeId: employeeId,
          },
        }
      );

      const PermissionData = PermissionResponse.data;

      // Update state with the fetched data or an empty array if no data
      if (PermissionData) {
        setpermissionLeaveCounts(PermissionData);
        setOpenModal3(true);
      } else {
        setpermissionLeaveCounts([]);
        setOpenModal3(true);
      }
    } catch (error) {
      console.error("Error fetching permission data:", error);
      setpermissionLeaveCounts([]);
      setOpenModal3(false);
    }
  };

  const handleEditClick = (params) => {
    console.log("12323123", params);
    setOpenModal(true);
    setSelectedRowData(params);
  };

  const handleEditClick1 = (params) => {
    console.log("123456", params);
    setOpenModal(true);
    setSelectedRowData(params);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;

    if (selectedStatus === "Approved") {
      setStatus(selectedStatus);
    } else if (selectedStatus === "Not Approved") {
      setStatus(selectedStatus);
      setReject("");
    }
  };

  const handleReasonChange = (e) => {
    const newReason = e.target.value;
    setReject(newReason);
  };

  const handleSubmission = async () => {
    console.log("234455");
    try {
      // Validate selected row data
      if (!selectedRowData || !selectedRowData.Sl_No) {
        const tdata = {
          message: "Invalid data: Employee ID is missing.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
        return;
      }

      // Prepare payload for the API request
      const postData = {
        Sl_No: selectedRowData.Sl_No,
        status: status,
        reject: status === "Not Approved" ? reject : null,
      };

      console.log("postData", postData);

      // Make the API call
      const response = await axios.post(
        `${UrlLink}HR_Management/update_Advance_Leave`,
        postData
      );
      const reste = response.data;

      // Handle API response
      if (reste) {
        const typp = Object.keys(reste)[0]; // Extract success/warn/error key
        const mess = Object.values(reste)[0]; // Extract message
        const tdata = {
          message: mess,
          type: typp,
        };
        dispatchvalue({ type: "toast", value: tdata });
      }

      // Reset states and fetch updated data
      setOpenModal2(false);
      setStatus("");
      setReject("");
      fetchPermissionsData();
      fetchData();
      setshowsudden((prevState) => !prevState);
    } catch (error) {
      console.error("Error submitting data:", error);

      // Handle submission error
      const tdata = {
        message:
          "An error occurred while submitting data. Please try again later.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

 
  React.useEffect(() => {
    fetchData();
    fetchPermissionsData();
  }, [fetchData, fetchPermissionsData]);

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Manage Leave & Permission Requests</h4>
        </div>
        <div className="common_center_tag">
          <span>Leave Request List</span>
        </div>
        <div className="appointment">
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th id="slectbill_ins">Sl. No</th>
                  <th id="slectbill_ins">Employee ID</th>
                  <th id="slectbill_ins">Employee Name</th>
                  <th id="slectbill_ins">Designation</th>
                  <th id="slectbill_ins">Leave Type</th>
                  <th id="slectbill_ins">From Date</th>
                  <th id="slectbill_ins">To Date</th>
                  <th id="slectbill_ins">Days</th>
                  <th id="slectbill_ins">Reason</th>
                  <th id="slectbill_ins">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows && rows.length > 0 ? (
                  rows.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      {/* Use index + 1 to display row number starting from 1 */}
                      <td>{row.employeeid}</td>
                      <td>{row.employeename}</td>
                      <td>{row.designation}</td>
                      <td>{row.leaveType}</td>
                      <td>{row.fromdate}</td>
                      <td>{row.todate}</td>
                      <td>{row.days}</td>
                      <td>{row.reason}</td>
                      <td>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleVisibilityClick(row)}
                          startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => handleEditClick(row)}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No leave applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <div className="common_center_tag">
          <span>Permission Request List</span>
        </div>
        <div className="appointment">
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th id="slectbill_ins">Sl. No</th>
                  <th id="slectbill_ins">Employee ID</th>
                  <th id="slectbill_ins">Employee Name</th>
                  <th id="slectbill_ins">Designation</th>
                  <th id="slectbill_ins">Permission Type</th>
                  <th id="slectbill_ins">From Time</th>
                  <th id="slectbill_ins">To Time</th>
                  <th id="slectbill_ins">Reason</th>
                  <th id="slectbill_ins">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows1 && rows1.length > 0 ? (
                  rows1.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.employeeid}</td>
                      <td>{row.employeename}</td>
                      <td>{row.designation}</td>
                      <td>{row.leaveType}</td>
                      <td>{row.fromtime}</td>
                      <td>{row.totime}</td>
                      <td>{row.reason}</td>
                      <td>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleVisibilityClick1(row.employeeid)}
                          startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => handleEditClick1(row)}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No permission details found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {openModal && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
            }
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <div
              className="newwProfiles newwPopupforreason uwagduaguleaveauto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="RegisFormcon leavecon">
                <div className="RegisForm_1 leaveform_1">
                  <label htmlFor="issued">
                    Status<span>:</span>
                  </label>
                  <select
                    name="approval"
                    id="approval"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="">Select</option>
                    <option value="Approved">Approved</option>
                    <option value="Not Approved">Not Approved</option>
                  </select>
                </div>
              </div>
              {status === "Not Approved" && (
                <div className="RegisFormcon leavecon">
                  <div className="RegisForm_1 leaveform_1 leaveaiftesatg">
                    <label htmlFor="reason">
                      Reason <span>:</span>
                    </label>
                    <textarea
                      type="text"
                      name="reason"
                      id=""
                      onChange={handleReasonChange}
                    ></textarea>
                  </div>
                </div>
              )}
              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleSubmission}
                >
                  Submit
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {openModal2 && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
            }
            onClick={() => {
              setOpenModal2(false);
            }}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="RegisFormcon leavecon">
                <div className="RegisForm_1 leaveform_1">
                  <label htmlFor="issued">
                    Status<span>:</span>
                  </label>
                  <select
                    name="approval"
                    id="approval"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="">Select</option>

                    <option value="Approved">Approved</option>

                    <option value="Not Approved">Not Approved</option>
                  </select>
                </div>
              </div>
              <br></br>
              {status === "Not Approved" && (
                <div className="RegisFormcon leavecon">
                  <div className="RegisForm_1 leaveform_1 leaveaiftesatg">
                    <label htmlFor="reason">
                      Reason <span>:</span>
                    </label>
                    <textarea
                      type="text"
                      name="reason"
                      id=""
                      onChange={handleReasonChange}
                    ></textarea>
                  </div>
                </div>
              )}
              <br></br>
              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={handleSubmission}
                >
                  Submit
                </button>

                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal2(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {openModal1 && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
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
                <div className="Add_items_Purchase_Master">
                  <span>Total Leave Details</span>
                </div>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th id="slectbill_ins">Leave Type</th>
                        <th id="slectbill_ins">Total Leave</th>
                        <th id="slectbill_ins">Availed Leaves</th>
                        <th id="slectbill_ins">Remaining Leaves</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveCounts.length > 0 ? (
                        leaveCounts.map((leave, index) => (
                          <tr key={index}>
                            <td>{leave.leavetype}</td>
                            <td>{leave.Totalleave}</td>
                            <td>{leave.AvailedLeave}</td>
                            <td>{leave.RemainingLeave}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            No leave data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="Add_items_Purchase_Master">
                  <span>Prev Leave Details</span>
                </div>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th id="slectbill_ins">Leave Type</th>
                        <th id="slectbill_ins">From Date</th>
                        <th id="slectbill_ins">To Date</th>
                        <th id="slectbill_ins">Days</th>
                        <th id="slectbill_ins">Reason</th>
                        <th id="slectbill_ins">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(prevleavedetails) &&
                      prevleavedetails.length > 0 ? (
                        prevleavedetails.map((leave, index) => (
                          <tr key={index}>
                            <td>{leave.Leave_Type}</td>
                            <td>{leave.FromDate}</td>
                            <td>{leave.ToDate != null ? leave.ToDate : "-"}</td>
                            <td>{leave.DaysCount}</td>
                            <td>{leave.Reason}</td>
                            <td>{leave.Status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No previous leave available
                          </td>
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
        {openModal3 && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
            }
            onClick={() => {
              setOpenModal3(false);
            }}
          >
            <div
              className="newwProfiles newwPopupforreason uwagduaguleaveauto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="appointment">
                <div className="h_head">
                  <h4>Previous Approved Permission Hours</h4>
                </div>
                <div className="Selected-table-container">
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th id="slectbill_ins">Leave Type</th>
                        <th id="slectbill_ins">Date</th>
                        <th id="slectbill_ins">Approved Hours</th>
                        <th id="slectbill_ins">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionLeaveCounts.length > 0 ? (
                        permissionLeaveCounts.map((leave, index) => (
                          <tr key={index}>
                            <td>{leave.Leave_Type}</td>
                            <td>{leave.Date}</td>
                            <td>{leave.HoursCount}</td>
                            <td>{leave.Reason}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No Permission records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal3(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default LeaveApproval;
