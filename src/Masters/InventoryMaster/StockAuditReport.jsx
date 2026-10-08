import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

function StockAuditReport() {

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [auditData, setAuditData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const [filters, setFilters] = useState({
    stock_id: "",
    operation: "",
    changed_by: "",
    date_from: "",
    date_to: ""
  });

  const fetchData = () => {
    const query = new URLSearchParams(filters).toString();

    fetch(`${UrlLink}Inventory/stock_audit_report?${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAuditData(data.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  /* =======================
        EXCEL EXPORT
  ======================== */

  const exportToExcel = () => {
    const formattedData = auditData.map(row => ({
      ID: row.id,
      Stock_ID: row.stock_id,
      Operation: row.operation,
      User: row.changed_by,
      Date: row.changed_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StockAudit");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "Stock_Audit_Report.xlsx");
  };

  /* =======================
        PDF EXPORT
  ======================== */

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["ID", "Stock", "Operation", "User", "Date"];
    const tableRows = [];

    auditData.forEach(row => {
      tableRows.push([
        row.id,
        row.stock_id,
        row.operation,
        row.changed_by,
        row.changed_at
      ]);
    });

    doc.text("Stock Audit Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [tableColumn],
      body: tableRows
    });

    doc.save("Stock_Audit_Report.pdf");
  };

  return (
    <div style={{ padding: "30px", background: "#f4f6f9", minHeight: "100vh" }}>
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ marginBottom: "20px" }}>Stock Audit Report</h2>

        {/* ================= FILTER SECTION ================= */}

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px"
        }}>

          <input
            placeholder="Stock ID"
            value={filters.stock_id}
            onChange={e => setFilters({...filters, stock_id: e.target.value})}
            style={inputStyle}
          />

          <select
            value={filters.operation}
            onChange={e => setFilters({...filters, operation: e.target.value})}
            style={inputStyle}
          >
            <option value="">All</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            placeholder="Changed By"
            value={filters.changed_by}
            onChange={e => setFilters({...filters, changed_by: e.target.value})}
            style={inputStyle}
          />

          <input
            type="date"
            value={filters.date_from}
            onChange={e => setFilters({...filters, date_from: e.target.value})}
            style={inputStyle}
          />

          <input
            type="date"
            value={filters.date_to}
            onChange={e => setFilters({...filters, date_to: e.target.value})}
            style={inputStyle}
          />

          <button onClick={fetchData} style={btnStyleGreen}>Apply</button>
          <button onClick={exportToExcel} style={btnStyleBlue}>Excel</button>
          <button onClick={exportToPDF} style={btnStyleRed}>PDF</button>

        </div>

        {/* ================= TABLE ================= */}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "#fff" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Operation</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>View</th>
            </tr>
          </thead>

          <tbody>
            {auditData.map(row => (
              <React.Fragment key={row.id}>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>{row.id}</td>
                  <td style={tdStyle}>{row.stock_id}</td>
                  <td style={tdStyle}>{row.operation}</td>
                  <td style={tdStyle}>{row.changed_by}</td>
                  <td style={tdStyle}>{row.changed_at}</td>
                  <td style={tdStyle}>
                    <button onClick={() => toggleRow(row.id)} style={btnStyleBlue}>
                      {expandedRow === row.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedRow === row.id && row.operation === "UPDATE" && (
                  <tr>
                    <td colSpan="6" style={{ background: "#f9fafb", padding: "15px" }}>
                      <table style={{ width: "100%" }}>
                        <thead>
                          <tr style={{ background: "#ecf0f1" }}>
                            <th style={thStyle}>Field</th>
                            <th style={thStyle}>Old</th>
                            <th style={thStyle}>New</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.changes?.map((change, index) => (
                            <tr key={index}>
                              <td style={tdStyle}>{change.field}</td>
                              <td style={{ ...tdStyle, color: "red" }}>{change.old}</td>
                              <td style={{ ...tdStyle, color: "green" }}>{change.new}</td>
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
    </div>
  );
}

/* ================= STYLES ================= */

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "13px"
};

const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "10px", fontSize: "13px" };

const btnStyleGreen = {
  padding: "8px 14px",
  background: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const btnStyleBlue = {
  padding: "8px 14px",
  background: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const btnStyleRed = {
  padding: "8px 14px",
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default StockAuditReport;
