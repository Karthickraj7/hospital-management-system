import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

function EmployeeReport() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [searchQuery, setsearchQuery] = useState("");
  const [Filterdata, setFilterdata] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(Filterdata.length / pageSize);
  const paginatedData =
    Array.isArray(Filterdata) &&
    Filterdata?.slice(page * pageSize, (page + 1) * pageSize);
  const [rows, setRows] = useState([]);
  const [dateQueries, setDateQueries] = useState({});
  const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    designation: "",
    location: userRecord?.location,
  });

  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const handleSearchChange = (e) => {
    setsearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const filteredData = PatientRegisterData.filter((row) => {
        const { EmployeeID, EmployeeName, PhoneNumber, Designation } = row;
        return (
          (EmployeeID && EmployeeID.toLowerCase().includes(lowerCaseQuery)) ||
          (PhoneNumber && PhoneNumber.toLowerCase().includes(lowerCaseQuery)) ||
          (EmployeeName &&
            EmployeeName.toLowerCase().includes(lowerCaseQuery)) ||
          (Designation && Designation.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilterdata(filteredData);
    } else {
      setFilterdata(PatientRegisterData);
    }
  }, [searchQuery, PatientRegisterData]);

  const handleDateChange = (event, employeeId) => {
    const { value } = event.target;
    setDateQueries((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Report_Details_link`, {
        params: searchOPParams,
      })
      .then((response) => {
        console.log("8989", response.data);
        const data = response.data;
        setRows(
          data.map((row) => ({
            id: row.EmployeeID,
            ...row,
          }))
        );
        if (Array.isArray(data)) {
          setPatientRegisterData(data);
          setFilterdata(data);
        } else {
          setPatientRegisterData([]);
          setFilterdata([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink, userRecord?.location]);

  const handledownloadreport = (employee, dateQuery) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format
    const newdate = dateQuery || currentMonth;
    console.log("newdate", newdate);
    console.log("employee", employee);

    axios
      .get(
        `${UrlLink}HR_Management/Employee_Monthly_Report?date=${newdate}&EmployeeID=${employee?.EmployeeID}`
      )
      .then((response) => {
        const data = response.data;
        console.log(data);

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFont("times", "normal");
        const margin = 14;
        let currentY = 20;

        // Title
        doc.setFontSize(18);
        doc.text(`Employee Report of ${newdate}`, margin, currentY);
        currentY += 15;

        // Employee Personal Details
        doc.setFontSize(16);
        doc.text("Employee Personal Details", margin, currentY);
        currentY += 10;
        doc.setFontSize(12);
        const details = [
          `Employee ID    : ${employee.EmployeeID}`,
          `Employee Name  : ${employee.EmployeeName}`,
          `Designation    : ${employee.Designation}`,
          `Present Days    : ${data.present_days} Days`,
          `Salary    : ${data.paid_salary} /-`,
        ];
        details.forEach((detail, index) => {
          doc.text(detail, margin, currentY + index * 10);
        });
        currentY += details.length * 10 + 10;

        // Advance Details Table
        doc.setFontSize(16);
        doc.text("Advance Details", margin, currentY);
        currentY += 10;

        if (data.advances?.length > 0) {
          doc.autoTable({
            startY: currentY,
            head: [
              [
                "Sl_No",
                "IssuedDate",
                "ApprovedAmount",
                "Due Months",
                "AmountDeductPerMonth",
                "Installment_Status",
                "No of Month Paid",
                "PaidAmount",
              ],
            ],
            body: data.advances.map((item) => [
              item.Sl_No,
              item.IssuedDate,
              item.RequestAmount,
              item.RepaymentDue,
              item.AmountDeductPerMonth,
              item.Installment_Status,
              item.No_of_MonthPaid,
              item.PaidAmount,
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
          });
          currentY = doc.autoTable.previous.finalY + 10;
        }

        // Casual Leave Table
        doc.setFontSize(16);
        doc.text("Casual Leave Details", margin, currentY);
        currentY += 10;

        const casualLeaves = data.leaves.filter(
          (item) => item.LeaveType === "casual"
        );
        if (casualLeaves.length > 0) {
          doc.autoTable({
            startY: currentY,
            head: [
              [
                "Sl_No",
                "LeaveType",
                "FromDate",
                "ToDate",
                "DaysCount",
                "Reason",
                "Status",
                "Reject_Reason",
              ],
            ],
            body: casualLeaves.map((item) => [
              item.Sl_No,
              item.LeaveType,
              item.FromDate,
              item.ToDate,
              item.DaysCount,
              item.Reason,
              item.Status,
              item.Reject_Reason || "-",
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
          });
          currentY = doc.autoTable.previous.finalY + 10;
        }

        doc.setFontSize(16);
        doc.text("Sick Leave Details", margin, currentY);
        currentY += 10;

        const sickleave = data.leaves.filter(
          (item) => item.LeaveType === "sick"
        );
        if (sickleave.length > 0) {
          doc.autoTable({
            startY: currentY,
            head: [
              [
                "Sl_No",
                "LeaveType",
                "FromDate",
                "ToDate",
                "DaysCount",
                "Reason",
                "Status",
                "Reject_Reason",
              ],
            ],
            body: sickleave.map((item) => [
              item.Sl_No,
              item.LeaveType,
              item.FromDate,
              item.ToDate,
              item.DaysCount,
              item.Reason,
              item.Status,
              item.Reject_Reason || "-",
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
          });
          currentY = doc.autoTable.previous.finalY + 10;
        }

        // Permission Leave Table
        doc.setFontSize(16);
        doc.text("Permission Leave Details", margin, currentY);
        currentY += 10;

        const permissionLeaves = data.leaves.filter(
          (item) => item.LeaveType === "permission"
        );
        if (permissionLeaves.length > 0) {
          doc.autoTable({
            startY: currentY,
            head: [
              [
                "Sl_No",
                "LeaveType",
                "PermissionDate",
                "FromTime",
                "ToTime",
                "HoursCount",
                "Reason",
                "Status",
                "Reject_Reason",
              ],
            ],
            body: permissionLeaves.map((item) => [
              item.Sl_No,
              item.LeaveType,
              item.PermissionDate,
              item.FromTime,
              item.ToTime,
              item.HoursCount,
              item.Reason,
              item.Status,
              item.Reject_Reason || "-",
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
          });
          currentY = doc.autoTable.previous.finalY + 10;
        }

        doc.setFontSize(16);
        doc.text("Shift Details", margin, currentY);
        currentY += 10;

        if (data.ShiftDetails?.length > 0) {
          doc.autoTable({
            startY: currentY,
            head: [
              [
                "Sl No",
                "Shift Date",
                "Shift StartTime",
                "Shift EndTime",
                "ShiftHours",
                "Status",
                "ShiftName",
              ],
            ],
            body: data.ShiftDetails.map((item) => [
              item.Sl_No,
              item.Shift_StartDate,
              item.Shift_StartTime,
              item.Shift_EndTime,
              item.ShiftHours,
              item.Status,
              item.ShiftName,
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
          });
          currentY = doc.autoTable.previous.finalY + 10;
        }

        // Save PDF
        const blob = doc.output("blob");
        saveAs(blob, `Employee_Report_${newdate}.pdf`);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  return (
    <div className="Main_container_app">
      <h3>Employee Monthly Report</h3>
      <br />
      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="input">
            Search by <span>:</span>
          </label>
          <input
            style={{
              width: "370px",
            }}
            type="text"
            name="employeeName"
            placeholder="Name or Id or PhoneNo or Designation "
            value={searchQuery} // Use the correct state variable here
            onChange={handleSearchChange} // Call the handler on input change
          />
        </div>
      </div>

      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Photo</th>
              <th>Employee Name</th>
              <th>Phone No</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Date</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(Filterdata) &&
              Filterdata.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.EmployeeID}</td>
                  <td>
                    <img
                      src={employee.EmployeePhoto}
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "100px",
                      }}
                      alt={employee.EmployeeName}
                    />
                  </td>
                  <td>{employee.EmployeeName}</td>
                  <td>{employee.PhoneNumber}</td>
                  <td>{employee.Designation}</td>
                  <td>{employee.Department}</td>
                  <td>
                    <div className="foremployeereportdonw">
                      <label htmlFor="firstName">
                        <span></span>
                      </label>
                      <input
                        type="month"
                        value={dateQueries[employee.EmployeeID] || currentMonth}
                        onChange={(e) =>
                          handleDateChange(e, employee.EmployeeID)
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        handledownloadreport(
                          employee,
                          dateQueries[employee.EmployeeID]
                        )
                      }
                      startIcon={<DownloadIcon />}
                    ></Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="grid_foot">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          Page {page + 1} of {totalPages}
          <button
            onClick={() =>
              setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))
            }
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default EmployeeReport;
