
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function MasterSubmitReport() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const fetchSalaryData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${UrlLink}HR_Management/get_employee_monthwise_payment_full`,
        { params: { month, year } }
      );
      setEmployees(response.data.employees || []);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching Salary data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Report");
    XLSX.writeFile(wb, `Employee_Salary_${month}_${year}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text(`Employee Salary Report - ${month}/${year}`, 14, 16);
    const tableColumn = [
      "ID",
      "Name",
      "Dept",
      "Designation",
      "Basic",
      "Gross",
      "Net",
      "Present",
      "Leave",
      "HRA",
      "Medical",
      "Travel",
      "PF",
      "ESI",
      "PT",
      "TDS",
      "Advance",
      "Security",
      "Status",
    ];
    const tableRows = employees.map((emp) => [
      emp.Employee_ID,
      emp.EmployeeName,
      emp.Departments.join(", "),
      emp.Designation,
      emp.BasicSalary,
      emp.GrossSalary,
      emp.NetSalary,
      emp.PresentDays,
      emp.leave_days,
      emp.HRAfinal,
      emp.MedicalAllowancefinal,
      emp.TravelAllowancefinal,
      emp.PfForEmployee_Amount,
      emp.EsiAmount,
      emp.ProfessionalTax,
      emp.TDS_Amount,
      emp.AmountDeduct_PerMonth,
      emp.SecurityDeposit_ForMonth,
      emp.Status,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 7 },
    });
    doc.save(`Employee_Salary_${month}_${year}.pdf`);
  };

  const printReport = () => {
    const tableContent = document.getElementById("salary-table").outerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Employee Salary Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 11px; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
            tr.pending { background-color: #fff8dc; }
          </style>
        </head>
        <body>
          <h2>Employee Salary Report - ${month}/${year}</h2>
          ${tableContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  };

  // Styles (same as PF_Report)
  const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };
  const headerStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" };
  const filterContainer = { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", justifyContent: "center" };
  const inputStyle = { border: "1px solid #ccc", padding: "5px", borderRadius: "4px", width: "150px" };
  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  });
  const tableContainer = { overflowX: "auto" };
  const tableStyle = { minWidth: "100%", borderCollapse: "collapse", border: "1px solid #ccc" };
  const thStyle = { border: "1px solid #ccc", padding: "6px", backgroundColor: "#f0f0f0", textAlign: "left", fontSize: "12px" };
  const tdStyle = { border: "1px solid #ccc", padding: "6px", fontSize: "11px" };
  const pendingRowStyle = { backgroundColor: "#fff8dc" };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Employee Salary Report</h2>

      <div style={filterContainer}>
        <div>
          <label>Month:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle}>
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {new Date(0, m).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "5px" }}>
          <button onClick={fetchSalaryData} style={buttonStyle("#6f788fff")}><SearchIcon size={16} /></button>
          <button onClick={exportToExcel} style={buttonStyle("#7b9685ff")}>Export Excel</button>
          <button onClick={exportToPDF} style={buttonStyle("#865b5bff")}>Export PDF</button>
          <button onClick={printReport} style={buttonStyle("#a78f66ff")}>Print</button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div style={tableContainer}>
        <table id="salary-table" style={tableStyle}>
         <thead>
  <tr>
    <th style={thStyle}>Employee ID</th>
    <th style={thStyle}>Name</th>
    <th style={thStyle}>Dept</th>
    <th style={thStyle}>Designation</th>
    <th style={thStyle}>Present</th>
    <th style={thStyle}>Leave</th>
    <th style={thStyle}>Basic</th>
    <th style={thStyle}>HRA</th>
    <th style={thStyle}>Medical</th>
    <th style={thStyle}>Travel</th>
    <th style={thStyle}>Gross</th>
    <th style={thStyle}>PF</th>
    <th style={thStyle}>ESI</th>
    <th style={thStyle}>PT</th>
    <th style={thStyle}>TDS</th>
    <th style={thStyle}>Advance</th>
    <th style={thStyle}>Security</th>
    <th style={thStyle}>Net Salary</th>
    <th style={thStyle}>Receiver Sign</th>
  </tr>
</thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="19" style={{ textAlign: "center", padding: "8px" }}>No data found</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.Employee_ID} style={emp.Status.toLowerCase() === "pending" ? pendingRowStyle : {}}>
                <td style={tdStyle}>{emp.Employee_ID}</td>
<td style={tdStyle}>{emp.EmployeeName}</td>
<td style={tdStyle}>{emp.Departments.join(", ")}</td>
<td style={tdStyle}>{emp.Designation}</td>
<td style={tdStyle}>{emp.PresentDays}</td>
<td style={tdStyle}>{emp.leave_days}</td>
<td style={tdStyle}>{emp.BasicSalary}</td>
<td style={tdStyle}>{emp.HRAfinal}</td>
<td style={tdStyle}>{emp.MedicalAllowancefinal}</td>
<td style={tdStyle}>{emp.TravelAllowancefinal}</td>
<td style={tdStyle}>{emp.GrossSalary}</td>
<td style={tdStyle}>{emp.PfForEmployee_Amount}</td>
<td style={tdStyle}>{emp.EsiAmount}</td>
<td style={tdStyle}>{emp.ProfessionalTax}</td>
<td style={tdStyle}>{emp.TDS_Amount}</td>
<td style={tdStyle}>{emp.AmountDeduct_PerMonth}</td>
<td style={tdStyle}>{emp.SecurityDeposit_ForMonth}</td>
<td style={{...tdStyle, fontWeight:"bold"}}>{emp.NetSalary}</td>
<td style={tdStyle}>{""}</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MasterSubmitReport;
