import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function EmployeeDutyManagement() {
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [allocations, setAllocations] = useState({});
  const [bulkShift, setBulkShift] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const tableRef = useRef();

  // Generate weekdays dynamically between two dates
  const getDaysArray = (start, end) => {
    let arr = [];
    let dt = new Date(start);
    while (dt <= end) {
      arr.push({
        key: dt.toISOString().split("T")[0],
        label: dt.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        date: dt.toLocaleDateString("en-GB")
      });
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  const weekDays =
    fromDate && toDate
      ? getDaysArray(new Date(fromDate), new Date(toDate))
      : [];

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/get_employees_department_wise`)
      .then((res) => setDepartments(res.data.departments || []));
    axios
      .get(`${UrlLink}HR_Management/get_shift_master`)
      .then((res) => setShifts(res.data.shifts || []));
  }, [UrlLink]);

  const handleShiftChange = (empId, dayKey, value) => {
    setAllocations((prev) => ({
      ...prev,
      [empId]: { ...(prev[empId] || {}), [dayKey]: value }
    }));
  };

  const handleBulkSchedule = () => {
    if (!bulkShift) return alert("Select a shift first!");
    const dept = departments.find((d) => d.Department_Id === selectedDept);
    if (!dept) return;

    let updated = { ...allocations };
    dept.Employees.forEach((emp) => {
      weekDays.forEach((d) => {
        updated[emp.Employee_ID] = {
          ...(updated[emp.Employee_ID] || {}),
          [d.key]: bulkShift
        };
      });
    });
    setAllocations(updated);
    alert("Bulk shift applied to all employees. You can edit individually.");
  };

  const handleSave = () => {
    if (!selectedDept || !weekDays.length) return;
    const dept = departments.find((d) => d.Department_Id === selectedDept);
    if (!dept) return;

    const data = {
      created_by: "admin",
      location_id: 1,
      allocations: []
    };

    dept.Employees.forEach((emp) => {
      weekDays.forEach((day) => {
        const shiftId = allocations[emp.Employee_ID]?.[day.key] || null;
        if (shiftId) {
          data.allocations.push({
            employee_id: emp.Employee_ID,
            shift_id: shiftId,
            day: day.label,
            date: day.date
          });
        }
      });
    });

    axios
      .post(`${UrlLink}HR_Management/save_employee_shifts`, data)
      .then(() => alert("Duty roster saved successfully!"))
      .catch((err) => alert("Error saving roster: " + err.message));
  };

  const handlePrint = () => {
    let printContents = tableRef.current.innerHTML;
    let win = window.open("", "", "width=900,height=700");
    win.document.write("<html><head><title>Duty Roster</title>");
    win.document.write(
      `<style>
        @page { margin: 10px; }
        body { margin: 0; font-family: Arial, sans-serif; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #ccc; padding:6px; text-align:center; font-size:16px; }
      </style>`
    );
    win.document.write("</head><body>");
    win.document.write(printContents);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
    win.close(); // close immediately to prevent blank page
  };




  const handleExportExcel = () => {
  if (!selectedDept) return alert("Select a department first!");

  const dept = departments.find((d) => d.Department_Id === selectedDept);
  if (!dept) return;

  const data = [];

  // Header row
  const header = ["Sl No", "Employee ID", "Existing ID", "Name", "Gender"];
  weekDays.forEach((d) => header.push(`${d.label} (${d.date})`));
  data.push(header);

  // Data rows
  dept.Employees.forEach((emp, index) => {
    const row = [
      index + 1,
      emp.Employee_ID,
      emp.Existing_Employee_ID,
      emp.Employee_Name,
      emp.Gender
    ];
    weekDays.forEach((d) => {
      const shiftId = allocations[emp.Employee_ID]?.[d.key];
      const shiftName = shifts.find((s) => s.ShiftId == shiftId)?.ShiftName || "";
      row.push(shiftName);
    });
    data.push(row);
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Duty Roster");

  // Export
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "Duty_Roster.xlsx");
};


  return (
    <div style={{ padding: "15px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
        Duty Roster
      </h2>

      {/* Date range selector */}
      <div style={{ marginBottom: "15px" }}>
      
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ marginRight: "10px" ,width:'150px',height:'30px',padding:'3px',borderRadius:'5px',backgroundColor:'var(--ProjectColor)'}}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
            style={{ marginRight: "10px" ,width:'150px',height:'30px',padding:'3px',borderRadius:'5px',backgroundColor:'var(--ProjectColor)'}}
        />
      </div>

      {/* Department selection */}
      <div style={{ padding: "5px", gap: "15px", marginBottom: "10px" }}>
        {departments.map((dept) => (
          <button
            key={dept.Department_Id}
            style={{
              padding: "8px ",
              borderRadius: "5px",
              marginRight: "5px",
              marginTop: "5px",
              backgroundColor:
                selectedDept === dept.Department_Id
                  ? "#b17aa9ff"
                  : "var(--opacityColor)",
              color: selectedDept === dept.Department_Id ? "white" : "black",
              cursor: "pointer"
            }}
            onClick={() => setSelectedDept(dept.Department_Id)}
          >
            {dept.Department_Name}
          </button>
        ))}
      </div>

      {selectedDept && weekDays.length > 0 && (
        <>
          {/* Bulk Schedule */}
          <div style={{ marginBottom: "12px" }}>
            <select
              value={bulkShift}
              onChange={(e) => setBulkShift(e.target.value)}
              style={{ padding: "6px", marginRight: "10px" }}
            >
              <option value="">-- Select Bulk Shift --</option>
              {shifts.map((s) => (
                <option key={s.ShiftId} value={s.ShiftId}>
                  {s.ShiftName}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkSchedule}
              style={{
                backgroundColor: "#1e2e3fff",
                color: "white",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Apply Bulk Schedule
            </button>
          </div>

          {/* Table */}
          <div ref={tableRef} style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "900px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={thStyle}>Sl No</th>
                  <th style={thStyle}>Employee ID</th>
                  <th style={thStyle}>Existing ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Gender</th>
                  {weekDays.map((d) => (
                    <th key={d.key} style={thStyle}>
                      {d.label}
                      <br />
                      {d.date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments
                  .find((d) => d.Department_Id === selectedDept)
                  ?.Employees.map((emp, index) => (
                    <tr
                      key={emp.Employee_ID}
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9"
                      }}
                    >
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{emp.Employee_ID}</td>
                      <td style={tdStyle}>{emp.Existing_Employee_ID}</td>
                      <td style={tdStyle}>{emp.Employee_Name}</td>
                      <td style={tdStyle}>{emp.Gender}</td>
                      {weekDays.map((d) => (
                        <td key={d.key} style={tdStyle}>
                          <select
                             style={{
    fontSize: "16px",  // makes the selected value bigger
    fontWeight: "bold", // bold selected value
    padding: "6px",

  }}
                            value={allocations[emp.Employee_ID]?.[d.key] || ""}
                            onChange={(e) =>
                              handleShiftChange(emp.Employee_ID, d.key, e.target.value)
                            }
                          >
                            <option style={{fontSize:'16px'}} value="">--</option>
                            {shifts.map((s) => (
                              <option key={s.ShiftId} value={s.ShiftId} style={{ fontSize: '16px' }}>
  {s.ShiftName}
</option>

                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px"
            }}
          >
            <button onClick={handleSave} style={btnGreen}>
              Save Roster
            </button>
            <button onClick={handlePrint} style={btnGray}>
              Print
            </button>
            <button onClick={handleExportExcel} style={btnGray}>
  Export to Excel
</button>

          </div>
        </>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "6px",
  textAlign: "center",
  fontWeight: "bold"
};
const tdStyle = {
  border: "1px solid #ccc",
  padding: "6px",
  textAlign: "center",
  fontSize:"16px"
};
const btnGreen = {
  backgroundColor: "#1ea190ff",
  color: "white",
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold"
};
const btnGray = {
  backgroundColor: "#b17aa9ff",
  color: "white",
  padding: "8px ",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold"
};

export default EmployeeDutyManagement;
