import React, { useState, useEffect, useCallback } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
const LeaveMangement = () => {
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const dispatchvalue = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [rows, setRows] = useState([]);
  const [rows1, setRows1] = useState([]);

  console.log("userdata", userRecord);
  const [openModal, setOpenModal] = useState(false);
  const toast = useSelector((state) => state.userRecord?.toast);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [modalContent, setModalContent] = useState("");
  console.log("modalContent", modalContent);

  const fetchLeaveData = useCallback(() => {
    fetch(
      `${UrlLink}HR_Management/All_Consumed_Leave?location=${userRecord?.location}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        if (Array.isArray(data)) {
          const Records = data.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.Sl_No,
            employeeid: userdata.Employee_Id,
            employeename: userdata.EmployeeName,
            designation: userdata.Designation,
            leaveType: userdata.Leave_Type,
            fromdate: userdata.FromDate,
            todate: userdata.ToDate,
            days: userdata.DaysCount,
            reason: userdata.Reason,
            file: userdata.file,
            status: userdata.Status,
            rejectstatus: userdata.RejectReason,
          }));
          setRows(Records);
          console.log("record", Records);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink, userRecord]);

  const fetchPermissionsData = useCallback(() => {
    fetch(
      `${UrlLink}HR_Management/All_Consume_Permission_details?location=${userRecord?.location}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (Array.isArray(data)) {
          const Records = data.map((userdata, index) => ({
            id: index + 1,
            Sl_No: userdata.Sl_No,
            employeeid: userdata.Employee_Id,
            employeename: userdata.EmployeeName,
            leaveType: userdata.Leave_Type,
            fromtime: userdata.FromTime,
            designation: userdata.Designation,
            totime: userdata.ToTime,
            reason: userdata.Reason,
            hours: userdata.HoursCount,
            status: userdata.Status,
            rejectstatus: userdata.RejectReason,
          }));
          setRows1(Records);
          console.log(Records);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink, userRecord]);

  React.useEffect(() => {
    fetchLeaveData();
    fetchPermissionsData();
  }, [fetchLeaveData, fetchPermissionsData]);

  const handleFileView = (fileval) => {
    console.log("fileval", fileval);
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }

      dispatchvalue({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
    // setModalContent(item?.file);
    // setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setModalContent("");
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Leave & Permission Management</h4>
      </div>
      <div className="Add_items_Purchase_Master">
        <span>Employees Leave Consumed Details</span>
      </div>
      <div className="Selected-table-container">
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
              <th id="slectbill_ins">View</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((leave, index) => (
              <tr key={index}>
                <td>{leave.employeeid}</td>
                <td>{leave.employeename}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.fromdate}</td>
                <td>{leave.todate}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.leaveType === "sick" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleFileView(leave.file)}
                      startIcon={<VisibilityIcon />}
                    >
                      View
                    </Button>
                  ) : (
                    <span>None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />

      <div className="Add_items_Purchase_Master">
        <span>Employees Permission Consumed Details</span>
      </div>
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th id="slectbill_ins">Employee ID</th>
              <th id="slectbill_ins">Employee Name</th>
              <th id="slectbill_ins">Leave Type</th>
              <th id="slectbill_ins">From Time</th>
              <th id="slectbill_ins">To Time</th>
              <th id="slectbill_ins">Hours</th>
              <th id="slectbill_ins">Reason</th>
              <th id="slectbill_ins">Status</th>
              <th id="slectbill_ins">Reject Reason</th>
            </tr>
          </thead>
          <tbody>
            {/* {console.log(filteredRows1)} */}
            {rows1.map((leave, index) => (
              <tr key={index}>
                <td>{leave.employeeid}</td>
                <td>{leave.employeename}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.fromtime}</td>
                <td>{leave.totime}</td>
                <td>{leave.hours}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td>{leave.rejectstatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </div>
  );
};

export default LeaveMangement;
