import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExport } from "react-icons/fa";

const SecurityDeposit = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    fetch(`${UrlLink}HR_Management/get_security_deposit_from_table`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.employees || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching security deposit:", err);
        setLoading(false);
      });
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const exportAllToExcel = () => {
    const wsData = data.map((emp) => ({
      EmployeeID: emp.EmployeeID,
      EmployeeName: emp.EmployeeName,
      DateOfJoining: emp.DateOfJoining,
      BasicSalary: emp.BasicSalary,
      TotalDeposit: emp.TotalDeposit,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "SecurityDeposit");
    XLSX.writeFile(wb, "SecurityDeposit_All.xlsx");
  };

  const exportEmployeeToExcel = (emp) => {
    const wsData = emp.MonthlyDeposit.map((m) => ({
      Month: m.Month,
      Percentage: m.Percentage,
      DepositAmount: m.DepositAmount,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, emp.EmployeeName);
    XLSX.writeFile(wb, `SecurityDeposit_${emp.EmployeeID}.xlsx`);
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
  }

  if (!data.length) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>No records found.</p>;
  }

  return (
    <div style={{ padding: 16, overflowX: "auto", maxWidth: "100%" }}>
 <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>Security Deposit Report</h1>

      <button
        onClick={exportAllToExcel}
        style={{
          marginBottom: 16,
          backgroundColor: "var(--opacityColor)",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
      <FaFileExport />
      </button>

       <table
        style={{
          width: "1200px",
          borderCollapse: "fixed",
          tableLayout: "fixed",
          margin: "0 auto",
        }}
      >
        <thead style={{ backgroundColor: "var(--opacityColor)", color: "#fff", position: "sticky", top: 0 }}>
          <tr>
            <th style={{ border: "1px solid #999", padding: 8, textAlign: "left", width: 120 }}>Employee ID</th>
            <th style={{ border: "1px solid #999", padding: 8, textAlign: "left", width: 150 }}>Employee Name</th>
            <th style={{ border: "1px solid #999", padding: 8, textAlign: "left", width: 120 }}>DOJ</th>
            <th style={{ border: "1px solid #999", padding: 8, textAlign: "left", width: 120 }}> Salary</th>
            <th style={{ border: "1px solid #999", padding: 8, textAlign: "left", width: 120 }}>Total Deposit</th>
            <th style={{ border: "1px solid #999", padding: 8, textAlign: "left", width: 100 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp) => (
            <React.Fragment key={emp.EmployeeID}>
              <tr style={{ borderTop: "1px solid #ccc", backgroundColor: "#fff" }}>
                <td style={{ padding: 8 ,  borderBottom: "1px solid #000",}}>{emp.EmployeeID}</td>
                <td style={{ padding: 8,  borderBottom: "1px solid #000", textAlign:'left'}}>{emp.EmployeeName}</td>
                <td style={{ padding: 8,  borderBottom: "1px solid #000", }}>{emp.DateOfJoining}</td>
                <td style={{ padding: 8,  borderBottom: "1px solid #000", }}>{emp.TotalSalary.toLocaleString()}</td>
                <td style={{ padding: 8,  borderBottom: "1px solid #000", fontWeight: "bold" }}>{emp.TotalDeposit.toLocaleString()}</td>
                <td style={{ padding: 8,  borderBottom: "1px solid #000", }}>
                  <button
                    onClick={() => toggleRow(emp.EmployeeID)}
                    style={{
                      backgroundColor: "#e279baff",
                      color: "#fff",
                      border: "none",
                      padding: "4px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginRight: 4,
                    }}
                  >
                    {expandedRows[emp.EmployeeID] ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => exportEmployeeToExcel(emp)}
                    style={{
                      backgroundColor: "#4d9b87ff",
                      color: "#000",
                      border: "none",
                      padding: "4px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Export
                  </button>
                </td>
              </tr>

              {expandedRows[emp.EmployeeID] && (
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td colSpan={6} style={{ padding: 8 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#ddd" }}>
                          <th style={{ border: "1px solid #999", padding: 6, textAlign: "left" }}>Month</th>
                          <th style={{ border: "1px solid #999", padding: 6, textAlign: "left" }}>Percentage</th>
                          <th style={{ border: "1px solid #999", padding: 6, textAlign: "left" }}>Deposit Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emp.MonthlyDeposit.map((m, idx) => (
                          <tr key={idx} style={{ borderTop: "1px solid #ccc" }}>
                            <td style={{ padding: 6 }}>{m.Month}</td>
                            <td style={{ padding: 6 }}>{m.Percentage}</td>
                            <td style={{ padding: 6 }}>{m.DepositAmount.toLocaleString()}</td>
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

export default SecurityDeposit;
