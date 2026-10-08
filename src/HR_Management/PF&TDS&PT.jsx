
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

const PFandTDSandPT = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    fetch(`${UrlLink}HR_Management/get_employee_deductions`)
      .then((res) => res.json())
      .then((data) => {
        setReport({ employees: data.employees });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching deductions report:", err);
        setLoading(false);
      });
  }, [UrlLink]);

  const exportMainTable = () => {
    if (!report || !report.employees) return;

    const wsData = report.employees.map((emp) => ({
      "Employee ID": emp.EmployeeID,
      Name: emp.EmployeeName,
      "Basic Salary": emp.BasicSalary,
      "Total Earned Salary": emp.TotalSalary,
      "Total PF": emp.TotalPF,
      "Total PT": emp.TotalPT,
      "Total TDS": emp.TotalTDS,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Deductions Report");
    XLSX.writeFile(wb, "Employee_Deductions.xlsx");
  };

  const exportEmployeeDetails = (emp) => {
    if (!emp) return;

    const wsData = emp.MonthlyDetails.map((row) => ({
      Month: row.Month,
      "Earned Salary": row.EarnedSalary,
      PF: row.PF,
      PT: row.PT,
      TDS: row.TDS,
      "Attendance Days": row.AttendanceDays,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, `${emp.EmployeeName}_Details`);
    XLSX.writeFile(wb, `${emp.EmployeeName}_Deductions.xlsx`);
  };

  if (loading) return <p style={{ padding: "20px" }}>⏳ Loading deductions report...</p>;
  if (!report || !report.employees || report.employees.length === 0)
    return <p style={{ padding: "20px" }}>⚠️ No deductions data found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>Employee Deductions Report</h1>

      {/* Export buttons */}
      <div style={{ marginBottom: "15px" }}>
        <button style={btnStyle} onClick={exportMainTable}>
          📥 Export Main Table
        </button>
        {selectedEmployee && (
          <button
            style={{ ...btnStyle, marginLeft: "10px", background: "#27ae60" }}
            onClick={() => exportEmployeeDetails(selectedEmployee)}
          >
            📥 Export {selectedEmployee.EmployeeName}'s Details
          </button>
        )}
      </div>

      {/* Main Employees Table */}
        <table
        style={{
          width: "1200px",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          margin: "0 auto",
        }}
      >
        <thead>
          <tr style={{ background: "var(--opacityColor)", color: "white" }}>
            <th style={thStyle}>Employee ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Basic Salary</th>
            <th style={thStyle}>Salary</th>
            <th style={thStyle}>Gender</th>
            <th style={thStyle}>Months Worked</th>
            <th style={thStyle}>Earnings</th>
            <th style={thStyle}>Total PF</th>
            <th style={thStyle}>Total PT</th>
            <th style={thStyle}>Total TDS</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {report.employees.map((emp, idx) => (
            <React.Fragment key={idx}>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{emp.EmployeeID}</td>
                <td style={tdStyle}>{emp.EmployeeName}</td>
                <td style={tdStyle}>{emp.BasicSalary}</td>
                <td style={tdStyle}>{emp.Salary}</td>
                <td style={tdStyle}>{emp.Gender}</td>
                <td style={tdStyle}>{emp.MonthsWorked}</td>
                <td style={tdStyle}>{emp.TotalSalary.toLocaleString()}</td>
                <td style={tdStyle}>{emp.TotalPF.toLocaleString()}</td>
                <td style={tdStyle}>{emp.TotalPT.toLocaleString()}</td>
                <td style={tdStyle}>{emp.TotalTDS.toLocaleString()}</td>
                <td style={tdStyle}>
                  <button
                    style={btnStyle}
                    onClick={() =>
                      setSelectedEmployee(
                        selectedEmployee?.EmployeeID === emp.EmployeeID ? null : emp
                      )
                    }
                  >
                    {selectedEmployee?.EmployeeID === emp.EmployeeID ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>

              {/* Monthly Details Row */}
              {selectedEmployee?.EmployeeID === emp.EmployeeID && (
                <tr>
                  <td colSpan={10} style={{ background: "#f9f9f9", padding: "15px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <thead>
                        <tr style={{ background: "rgb(204 144 210)", color: "white" }}>
                          <th style={thStyle}>Month</th>
                          <th style={thStyle}>Earned Salary</th>
                          <th style={thStyle}>PF</th>
                          <th style={thStyle}>PT</th>
                          <th style={thStyle}>TDS</th>
                          <th style={thStyle}>Attendance Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emp.MonthlyDetails.map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={tdStyle}>{row.Month}</td>
                            <td style={tdStyle}>{row.EarnedSalary.toLocaleString()}</td>
                            <td style={tdStyle}>{row.PF.toLocaleString()}</td>
                            <td style={tdStyle}>{row.PT.toLocaleString()}</td>
                            <td style={tdStyle}>{row.TDS.toLocaleString()}</td>
                            <td style={tdStyle}>{row.AttendanceDays}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  padding: "8px 12px",
  textAlign: "center",
  borderBottom: "2px solid #444",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
};
const tdStyle = {
  padding: "8px 12px",
  textAlign: "left",
  borderBottom: "1px solid #000",
  fontWeight: "bold",
};
const btnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "var(--opacityColor)",
  color: "white",
};

export default PFandTDSandPT;
