

import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function PF_Report() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const fetchPFData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${UrlLink}HR_Management/get_Employee_PF_Details_for_rep`,
        { params: { month, year } }
      );
      setEmployees(response.data.employees || []);
    } catch (err) {
      setError(
        err.response?.data?.error || "Error fetching PF data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPFData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PF Report");
    XLSX.writeFile(wb, `Employee_PF_${month}_${year}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Employee PF Report - ${month}/${year}`, 14, 16);
    const tableColumn = ["Employee ID", "Name", "PF Amount", "Status", "Earning Salary"];
    const tableRows = employees.map((emp) => [
      emp.Employee_ID,
      emp.EmployeeName,
      emp.PF_Amount,
      emp.Status,
      emp.Earnig_salary,
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20, styles: { fontSize: 10 } });
    doc.save(`Employee_PF_${month}_${year}.pdf`);
  };

  const printReport = () => {
    const tableContent = document.getElementById("pf-table").outerHTML;
    const totalPF = employees.reduce((sum, emp) => sum + parseFloat(emp.PF_Amount || 0), 0);

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Employee PF Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h2 { text-align: center; }
            .total { font-weight: bold; margin-bottom: 10px; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
            tr.pending { background-color: #fff8dc; }
            @media print {
              body { margin: 0; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <h2>Employee PF Report - ${month}/${year}</h2>
          <div class="total">Total PF Amount: ${totalPF.toFixed(2)}</div>
          ${tableContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
  };

  const totalPF = employees.reduce((sum, emp) => sum + parseFloat(emp.PF_Amount || 0), 0);

  // Inline styles
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
  const thStyle = { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f0f0f0", textAlign: "left" };
  const tdStyle = { border: "1px solid #ccc", padding: "8px" };
  const pendingRowStyle = { backgroundColor: "#fff8dc" };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Employee PF Report</h2>

      <div style={filterContainer}>
        <div>
          <label>Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={inputStyle}
          >
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
          <button onClick={fetchPFData} style={buttonStyle("#8b9ac5ff")}><SearchIcon size={16} /></button>
          <button onClick={exportToExcel} style={buttonStyle("#85b396ff")}>Export Excel</button>
          <button onClick={exportToPDF} style={buttonStyle("#ac8383ff")}>Export PDF</button>
          <button onClick={printReport} style={buttonStyle("#dabd8cff")}>Print</button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div style={tableContainer}>
        <table id="pf-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Employee ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Earned Salary</th>
              <th style={thStyle}>PF Amount</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "8px" }}>No data found</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.Employee_ID} style={emp.Status.toLowerCase() === "pending" ? pendingRowStyle : {}}>
                  <td style={tdStyle}>{emp.Employee_ID}</td>
                  <td style={tdStyle}>{emp.EmployeeName}</td>
                  <td style={tdStyle}>{emp.Earnig_salary}</td>
                  <td style={tdStyle}>{emp.PF_Amount}</td>
                  <td style={tdStyle}>{emp.Status}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
              <td style={tdStyle} colSpan="2">Total PF</td>
              <td style={tdStyle}>{totalPF.toFixed(2)}</td>
              <td style={tdStyle} colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default PF_Report;
