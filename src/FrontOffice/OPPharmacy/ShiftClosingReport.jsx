// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { useSelector } from "react-redux";
// import { SearchIcon } from "lucide-react";

// function ShiftClosingReport() {
//   const [department, setDepartment] = useState("All");
//   const [status, setStatus] = useState("All"); // Paid / Due / All
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [shift, setShift] = useState("All"); // All / Morning / Night



//   // ✅ Fetch Shift-wise Report
//   const fetchReportData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//      const params = { department, status };
// if (shift && shift !== "All") params.shift = shift; // ✅ add shift filter
// if (startDate) params.start_date = startDate;
// if (endDate) params.end_date = endDate;


//       const response = await axios.get(`${UrlLink}DrugAdminstrations/shift_closing_report`, { params });
//       const data = Array.isArray(response.data) ? response.data : [];
//       setReportData(data);
//     } catch (err) {
//       setError(err.response?.data?.error || "Error fetching report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   // ✅ Totals
//   const totalPaid = reportData.reduce(
//     (sum, r) => sum + r.bills.filter(b => b.Bill_Status === "Paid").reduce((s, b) => s + b.Paid_Amount, 0),
//     0
//   );
//   const totalDue = reportData.reduce(
//     (sum, r) => sum + r.bills.filter(b => b.Bill_Status !== "Paid").reduce((s, b) => s + b.Paid_Amount, 0),
//     0
//   );

//   // ✅ Export Excel
//   const exportToExcel = () => {
//     const rows = reportData.flatMap(r =>
//       r.bills.map(b => ({
//         Shift: r.shift,
//         Department: r.department,
//         User: b.user,
//         Invoice: b.Billing_Invoice_No,
//         Date: b.Billing_Date,
//         Status: b.Bill_Status,
//         Amount: b.Paid_Amount
//       }))
//     );
//     const ws = XLSX.utils.json_to_sheet(rows);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "ShiftReport");
//     XLSX.writeFile(wb, `ShiftClosingReport.xlsx`);
//   };

//   // ✅ Export PDF
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Shift Closing Report", 14, 16);
//     const tableColumn = ["Shift", "Department", "User", "Invoice", "Date", "Status", "Amount"];
//     const tableRows = reportData.flatMap(r =>
//       r.bills.map(b => [
//         r.shift,
//         r.department,
//         b.user,
//         b.Billing_Invoice_No,
//         b.Billing_Date,
//         b.Bill_Status,
//         b.Paid_Amount
//       ])
//     );
//     doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
//     doc.save("ShiftClosingReport.pdf");
//   };

//   // ✅ Print
//   const printReport = () => {
//     const tableContent = document.getElementById("shift-report-table").outerHTML;
//     const newWin = window.open("", "_blank");
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>Shift Closing Report</title>
//           <style>
//             body { font-family: Arial; margin: 10px; }
//             h2 { text-align: center; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
//             th { background-color: #f0f0f0; }
//             td.paid { color: green; }
//             td.due { color: red; }
//           </style>
//         </head>
//         <body>
//           <h2>Shift Closing Report</h2>
//           <div>Total Paid: ${totalPaid.toFixed(2)}</div>
//           <div>Total Due: ${totalDue.toFixed(2)}</div>
//           ${tableContent}
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//     newWin.print();
//     newWin.close();
//   };

//   // ✅ Styles
//   const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };
//   const headerStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" };
//   const filterContainer = { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", justifyContent: "center" };
//   const inputStyle = { border: "1px solid #ccc", padding: "5px", borderRadius: "4px", width: "150px" };
//   const buttonStyle = (bg) => ({ backgroundColor: bg, color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" });
//   const tableContainer = { overflowX: "auto" };
//   const tableStyle = { minWidth: "100%", borderCollapse: "collapse", border: "1px solid #ccc" };
//   const thStyle = { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f0f0f0", textAlign: "left" };
//   const tdStyle = { border: "1px solid #ccc", padding: "8px" };

//   return (
//     <div style={containerStyle}>
//       <h2 style={headerStyle}>Shift Closing Report</h2>

//       {/* Filters */}
//       <div style={filterContainer}>
//   <div>
//     <label>Department:</label>
//     <select value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
//       <option value="All">All</option>
//       <option value="iPharmacy">iPharmacy</option>
//       <option value="oPharmacy">oPharmacy</option>
//     </select>
//   </div>

//   <div>
//     <label>Status:</label>
//     <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
//       <option value="All">All</option>
//       <option value="Paid">Paid</option>
//       <option value="Due">Due</option>
//     </select>
//   </div>

//   <div>
//     <label>Shift:</label>
//     <select value={shift} onChange={(e) => setShift(e.target.value)} style={inputStyle}>
//       <option value="All">All</option>
//       <option value="Morning">Morning (8 AM - 5 PM)</option>
//       <option value="Night">Night (5 PM - 8 AM)</option>
//     </select>
//   </div>

//   <div>
//     <label>Start Date:</label>
//     <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
//   </div>

//   <div>
//     <label>End Date:</label>
//     <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
//   </div>

//   <div style={{ display: "flex", gap: "5px", alignItems: "flex-end" }}>
//     <button onClick={fetchReportData} style={buttonStyle("#5e6a8a")}><SearchIcon size={16} /></button>
//     <button onClick={exportToExcel} style={buttonStyle("#649c79")}>Excel</button>
//     <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>PDF</button>
//     <button onClick={printReport} style={buttonStyle("#947c52")}>Print</button>
//   </div>
// </div>

//       {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
//       {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

//       <div style={{ fontWeight: "bold", backgroundColor: "#e0e0e0", display: "flex", justifyContent: "space-between", padding: "8px" }}>
//         <span>Total Paid: {totalPaid.toFixed(2)}</span>
//         <span>Total Due: {totalDue.toFixed(2)}</span>
//       </div>

//       <div style={tableContainer}>
//         <table id="shift-report-table" style={tableStyle}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Shift</th>
//               <th style={thStyle}>Department</th>
//               <th style={thStyle}>User</th>
//               <th style={thStyle}>Invoice</th>
//               <th style={thStyle}>Date</th>
//               <th style={thStyle}>Status</th>
//               <th style={thStyle}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reportData.length === 0 ? (
//               <tr><td colSpan="7" style={{ textAlign: "center", padding: "8px" }}>No data found</td></tr>
//             ) : (
//               reportData.flatMap(r =>
//                 r.bills.map((b, idx) => (
//                   <tr key={`${r.shift}-${idx}`}>
//                     <td style={tdStyle}>{r.shift}</td>
//                     <td style={tdStyle}>{r.department}</td>
//                     <td style={tdStyle}>{b.user}</td>
//                     <td style={tdStyle}>{b.Billing_Invoice_No}</td>
//                     <td style={tdStyle}>{b.Billing_Date}</td>
//                     <td style={{...tdStyle, color: b.Bill_Status === "Paid" ? "green" : "red"}}>{b.Bill_Status}</td>
//                     <td style={tdStyle}>{b.Paid_Amount}</td>
//                   </tr>
//                 ))
//               )
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default ShiftClosingReport;


import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function ShiftClosingReport() {
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All"); // Paid / Due / All
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [shift, setShift] = useState("All"); // All / Morning / Night

  // ✅ Fetch Shift-wise Report
  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { department, status };
      if (shift && shift !== "All") params.shift = shift; // ✅ add shift filter
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get(
        `${UrlLink}DrugAdminstrations/shift_closing_report`,
        { params }
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setReportData(data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // ✅ Totals
  const totalPaid = reportData.reduce(
    (sum, r) =>
      sum +
      r.bills
        .filter((b) => b.Bill_Status === "Paid")
        .reduce((s, b) => s + b.Paid_Amount, 0),
    0
  );
  const totalDue = reportData.reduce(
    (sum, r) =>
      sum +
      r.bills
        .filter((b) => b.Bill_Status !== "Paid")
        .reduce((s, b) => s + b.Paid_Amount, 0),
    0
  );

  // ✅ Export Excel
  const exportToExcel = () => {
    const rows = reportData.flatMap((r) =>
      r.bills.map((b) => ({
        Shift: r.shift,
        Department: r.department,
        User: b.user,
        Invoice: b.Billing_Invoice_No,
        Date: b.Billing_Date,
        Status: b.Bill_Status,
        Amount: b.Paid_Amount,
      }))
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ShiftReport");
    XLSX.writeFile(wb, `ShiftClosingReport.xlsx`);
  };

  // ✅ Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Shift Closing Report", 14, 16);
    const tableColumn = [
      "Shift",
      "Department",
      "User",
      "Invoice",
      "Date",
      "Status",
      "Amount",
    ];
    const tableRows = reportData.flatMap((r) =>
      r.bills.map((b) => [
        r.shift,
        r.department,
        b.user,
        b.Billing_Invoice_No,
        b.Billing_Date,
        b.Bill_Status,
        b.Paid_Amount,
      ])
    );
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("ShiftClosingReport.pdf");
  };

  // ✅ Print
  const printReport = () => {
    const tableContent =
      document.getElementById("shift-report-table").outerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Shift Closing Report</title>
          <style>
            body { font-family: Arial; margin: 10px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
            td.paid { color: green; }
            td.due { color: red; }
          </style>
        </head>
        <body>
          <h2>Shift Closing Report</h2>
          <div>Total Paid: ${totalPaid.toFixed(2)}</div>
          <div>Total Due: ${totalDue.toFixed(2)}</div>
          ${tableContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  // ✅ Styles
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  };
  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  };
  const filterContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  };
  const inputStyle = {
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "4px",
    width: "150px",
  };
  const buttonStyle = (bg) => ({
    backgroundColor: bg,
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  });
  const tableContainer = { overflowX: "auto" };
  const tableStyle = {
    minWidth: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
  };
  const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  };
  const tdStyle = { border: "1px solid #ccc", padding: "8px" };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Shift Closing Report</h2>

      {/* Filters */}
      <div style={filterContainer}>
        <div>
          <label>Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            <option value="iPharmacy">iPharmacy</option>
            <option value="oPharmacy">oPharmacy</option>
            <option value="focPharmacy">FOC Pharmacy</option> 
          </select>
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
        </div>

        <div>
          <label>Shift:</label>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            <option value="Morning">Morning (8 AM - 5 PM)</option>
            <option value="Night">Night (5 PM - 8 AM)</option>
          </select>
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: "5px", alignItems: "flex-end" }}>
          <button onClick={fetchReportData} style={buttonStyle("#5e6a8a")}>
            <SearchIcon size={16} />
          </button>
          <button onClick={exportToExcel} style={buttonStyle("#649c79")}>
            Excel
          </button>
          <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>
            PDF
          </button>
          <button onClick={printReport} style={buttonStyle("#947c52")}>
            Print
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div
        style={{
          fontWeight: "bold",
          backgroundColor: "#e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          padding: "8px",
        }}
      >
        <span>Total Paid: {totalPaid.toFixed(2)}</span>
        <span>Total Due: {totalDue.toFixed(2)}</span>
      </div>

      <div style={tableContainer}>
        <table id="shift-report-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Shift</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Invoice</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "8px" }}>
                  No data found
                </td>
              </tr>
            ) : (
              reportData.flatMap((r) =>
                r.bills.map((b, idx) => (
                  <tr key={`${r.shift}-${idx}`}>
                    <td style={tdStyle}>{r.shift}</td>
                    <td style={tdStyle}>{r.department}</td>
                    <td style={tdStyle}>{b.user}</td>
                    <td style={tdStyle}>{b.Billing_Invoice_No}</td>
                    <td style={tdStyle}>{b.Billing_Date}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: b.Bill_Status === "Paid" ? "green" : "red",
                      }}
                    >
                      {b.Bill_Status}
                    </td>
                    <td style={tdStyle}>{b.Paid_Amount}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShiftClosingReport;
