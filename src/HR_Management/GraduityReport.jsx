import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const GratuityReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    fetch(`${UrlLink}HR_Management/get_employee_gratuity_monthly`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gratuity report:", err);
        setLoading(false);
      });
  }, [UrlLink]);

  // Export main table to Excel
  const exportMainTable = () => {
    if (!report || !report.employees) return;

    const wsData = report.employees.map((emp) => ({
      "Employee ID": emp.EmployeeID,
      Name: emp.EmployeeName,
      "Date of Joining": emp.DateOfJoining,
      "Basic Salary": emp.BasicSalary,
      Accrued: emp.Accrued,
      "This Month": emp.ThisMonthGratuity,
      "Accrued + This Month": emp.AccruedWithThisMonth,
      Total: emp.EmployeeTotalGratuity,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Gratuity Report");
    XLSX.writeFile(wb, "Gratuity_Report.xlsx");
  };

  // Export selected employee details
  const exportEmployeeDetails = (emp) => {
    if (!emp) return;

    const wsData = emp.MonthlyGratuity.map((row) => ({
      Month: row.Month,
      "Gratuity Amount": row.GratuityAmount,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, `${emp.EmployeeName} Details`);
    XLSX.writeFile(wb, `${emp.EmployeeName}_Gratuity.xlsx`);
  };

  if (loading) return <p style={{ padding: "20px" }}>⏳ Loading gratuity report...</p>;
  if (!report || !report.employees || report.employees.length === 0)
    return <p style={{ padding: "20px" }}>⚠️ No gratuity data found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>Gratuity Report</h1>

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
            <th style={{ ...thStyle, width: "150px" }}>Employee ID</th>
            <th style={{ ...thStyle, width: "250px" }}>Name</th>
            <th style={{ ...thStyle, width: "150px" }}>D O J</th>
            <th style={{ ...thStyle, width: "150px" }}>Basic Salary</th>
            <th style={{ ...thStyle, width: "150px" }}>Accrued</th>
            <th style={{ ...thStyle, width: "150px" }}>This Month</th>
            <th style={{ ...thStyle, width: "150px" }}>AC + This Month</th>
            <th style={{ ...thStyle, width: "150px" }}>Total</th>
            <th style={{ ...thStyle, width: "100px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {report.employees.map((emp, idx) => (
            <React.Fragment key={idx}>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{emp.EmployeeID}</td>
                <td style={tdStyle}>{emp.EmployeeName}</td>
                <td style={tdStyle}>{emp.DateOfJoining}</td>
                <td style={tdStyle}>{emp.BasicSalary}</td>
                <td style={tdStyle}>{emp.Accrued}</td>
                <td style={tdStyle}>{emp.ThisMonthGratuity}</td>
                <td style={tdStyle}>{emp.AccruedWithThisMonth}</td>
                <td style={tdStyle}>
                  {emp.EmployeeTotalGratuity.toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>
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

              {/* Employee Details Row */}
              {selectedEmployee?.EmployeeID === emp.EmployeeID && (
                <tr>
                  <td colSpan={9} style={{ background: "#f9f9f9", padding: "15px" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "rgb(204 144 210)", color: "white" }}>
                          <th style={thStyle}>Month</th>
                          <th style={thStyle}>Gratuity Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emp.MonthlyGratuity.map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={tdStyle}>{row.Month}</td>
                            <td style={tdStyle}>
                              {row.GratuityAmount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <h4 style={{ marginTop: "10px", color: "#27ae60" }}>
                      Total Gratuity: ₹{" "}
                      {emp.EmployeeTotalGratuity.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h4>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h2 style={{ color: "green", marginTop: "20px" }}>
        Grand Total Gratuity (All Employees): ₹{" "}
        {report.grand_total_gratuity.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h2>
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

export default GratuityReport;
