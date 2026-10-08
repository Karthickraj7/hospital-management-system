
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { useSelector } from "react-redux";
// import { SearchIcon } from "lucide-react";

// function ProductWisePharmacySalesReport() {
//   const [period, setPeriod] = useState("all");
//   const [department, setDepartment] = useState("iPharmacy");
//   const [status, setStatus] = useState("All");
//   const [viewMode, setViewMode] = useState("summary"); // New: 'summary' or 'details'
//   const [reportData, setReportData] = useState([]);
//   const [summaryData, setSummaryData] = useState([]);
//   const [totalDetailsRecords, setTotalDetailsRecords] = useState(0);
//   const [overallTotals, setOverallTotals] = useState({
//     total_quantity: 0,
//     total_amount: 0,
//   });
//   const [produ, setProdu] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   // Fetch Report Data
//   const fetchReportData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = {
//         type: department === "iPharmacy" ? "ip" : "op",
//       };

//       if (period !== "all") {
//         if (period === "daily" && startDate) {
//           params.start_date = startDate;
//           params.end_date = startDate;
//         } else if (period === "weekly" && startDate && endDate) {
//           params.start_date = startDate;
//           params.end_date = endDate;
//         } else if (period === "monthly" && month && year) {
//           params.month = month;
//           params.year = year;
//         }
//       }

//       if (status && status !== "All") params.status = status;

//       const response = await axios.get(
//         `${UrlLink}Inventory/pharmacysalesproductwise`,
//         { params }
//       );

//       setReportData(response.data.sales_details || []);
//       setSummaryData(response.data.items_summary || []);
//       setOverallTotals(
//         response.data.overall_totals || { total_quantity: 0, total_amount: 0 }
//       );
//       setTotalDetailsRecords(response.data.total_details_records || 0);
//     } catch (err) {
//       setError(err.response?.data?.error || "Error fetching report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   // Export Excel
//   const exportToExcel = () => {
//     const rows = reportData.map((d) => ({
//       Date: d["Billing__Billing_Date"],
//       Invoice: d["Billing__Billing_Invoice_No"],
//       Status: d["Billing__Bill_Status"],
//       Product: d.ItemName,
//       Quantity: d.Billing_Quantity,
//       "Unit Price": d.Unit_Price,
//       Amount: d.Amount,
//       Total: d.Total,
//       "Batch No": d.BatchNo,
//       "Exp Date": d.Exp_Date,
//     }));
//     const ws = XLSX.utils.json_to_sheet(rows);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "ProductWiseSales");
//     XLSX.writeFile(wb, `ProductWisePharmacySales_${period}.xlsx`);
//   };

//   // Export PDF
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text(`Product Wise Pharmacy Sales Report - ${period}`, 14, 16);
//     const tableColumn = [
//       "Date",
//       "Invoice",
//       "Status",
//       "Product",
//       "Quantity",
//       "Unit Price",
//       "Amount",
//       "Total",
//       "Batch No",
//       "Exp Date",
//     ];
//     const tableRows = reportData.map((d) => [
//       d["Billing__Billing_Date"],
//       d["Billing__Billing_Invoice_No"],
//       d["Billing__Bill_Status"],
//       d.ItemName,
//       d.Billing_Quantity,
//       d.Unit_Price,
//       d.Amount,
//       d.Total,
//       d.BatchNo,
//       d.Exp_Date,
//     ]);
//     doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
//     doc.save(`ProductWisePharmacySales_${period}.pdf`);
//   };

//   // Print
//   const printReport = () => {
//     const currentTable = document.getElementById(
//       `report-table-${viewMode}`
//     ).outerHTML;
//     const newWin = window.open("", "_blank");
//     const title = viewMode === "summary" ? "Items Summary" : "Sales Details";
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>Product Wise Pharmacy Sales Report - ${title}</title>
//           <style>
//             body { font-family: Arial; margin: 10px; }
//             h2 { text-align: center; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
//             th { background-color: #f0f0f0; }
//           </style>
//         </head>
//         <body>
//           <h2>Product Wise Pharmacy Sales Report - ${title}</h2>
//           <div style="font-weight: bold; background-color: #e0e0e0; display: flex; justify-content: space-between; padding: 8px;">
//             <span>Total Quantity: ${overallTotals.total_quantity}</span>
//             <span>Total Amount: ${overallTotals.total_amount.toFixed(2)}</span>
//           </div>
//           ${currentTable}
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//     newWin.print();
//     newWin.close();
//   };

//   // Styles
//   const containerStyle = {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "20px",
//   };
//   const headerStyle = {
//     fontSize: "24px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//     textAlign: "center",
//   };
//   const filterContainer = {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//     marginBottom: "20px",
//     justifyContent: "center",
//   };
//   const inputStyle = {
//     border: "1px solid #ccc",
//     padding: "5px",
//     borderRadius: "4px",
//     width: "150px",
//   };
//   const buttonStyle = (bgColor) => ({
//     backgroundColor: bgColor,
//     color: "#fff",
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   });
//   const tableContainer = { overflowX: "auto" };
//   const tableStyle = {
//     minWidth: "100%",
//     borderCollapse: "collapse",
//     border: "1px solid #ccc",
//   };
//   const thStyle = {
//     border: "1px solid #ccc",
//     padding: "4px",
//     backgroundColor: "#f0f0f0",
//     textAlign: "start",
//     minWidth: "90px",
//   };
//   const tdStyle = {
//     border: "1px solid #ccc",
//     padding: "4px",
//     textAlign: "start",
//     fontSize: "12px",
//     minWidth: "90px",
//   };
//   const radioContainerStyle = {
//     display: "flex",
//     justifyContent: "center",
//     marginBottom: "20px",
//     gap: "20px",
//   };
//   const radioLabelStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//     cursor: "pointer",
//   };

//   return (
//     <div style={containerStyle}>
//       <h2 style={headerStyle}>Product Wise Pharmacy Sales Report</h2>

//       {/* Filters */}
//       <div style={filterContainer}>
//         <div>
//           <label>Product:</label>
//           <input
//             value={produ}
//             onChange={(e) => setProdu(e.target.value)}
//             style={inputStyle}
//           />
//         </div>
//         <div>
//           <label>Period:</label>
//           <select
//             value={period}
//             onChange={(e) => setPeriod(e.target.value)}
//             style={inputStyle}
//           >
//             <option value="all">All</option>
//             <option value="daily">Daily</option>
//             <option value="weekly">Weekly</option>
//             <option value="monthly">Monthly</option>
//           </select>
//         </div>

//         <div>
//           <label>Pharmacy Type:</label>
//           <select
//             value={department}
//             onChange={(e) => setDepartment(e.target.value)}
//             style={inputStyle}
//           >
//             <option value="iPharmacy">IP Pharmacy</option>
//             <option value="oPharmacy">OP Pharmacy</option>
//             <option value="focPharmacy">FOC Pharmacy</option>
//           </select>
//         </div>

//         <div>
//           <label>Status:</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             style={inputStyle}
//           >
//             <option value="All">All</option>
//             <option value="Paid">Paid</option>
//             <option value="Due">Due</option>
//             <option value="Refunded">Refunded</option>
//           </select>
//         </div>

//         {/* Conditional Date Inputs */}
//         {period === "daily" && (
//           <div>
//             <label>Date:</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               style={inputStyle}
//             />
//           </div>
//         )}
//         {period === "weekly" && (
//           <>
//             <div>
//               <label>Start Date:</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>
//             <div>
//               <label>End Date:</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>
//           </>
//         )}
//         {period === "monthly" && (
//           <>
//             <div>
//               <label>Month:</label>
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 style={inputStyle}
//               >
//                 {[...Array(12).keys()].map((m) => (
//                   <option key={m + 1} value={m + 1}>
//                     {new Date(0, m).toLocaleString("default", {
//                       month: "long",
//                     })}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Year:</label>
//               <input
//                 type="number"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>
//           </>
//         )}

//         {/* Action Buttons */}
//         <div style={{ display: "flex", gap: "5px", alignItems: "flex-end" }}>
//           <button onClick={fetchReportData} style={buttonStyle("#5e6a8a")}>
//             <SearchIcon size={16} />
//           </button>
//           <button onClick={exportToExcel} style={buttonStyle("#649c79")}>
//             Excel
//           </button>
//           <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>
//             PDF
//           </button>
//           <button onClick={printReport} style={buttonStyle("#947c52")}>
//             Print
//           </button>
//         </div>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
//       {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

//       {/* Totals - Moved to top */}
//       <div
//         style={{
//           fontWeight: "bold",
//           backgroundColor: "#e0e0e0",
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "8px",
//           marginBottom: "20px",
//         }}
//       >
//         <span>Total Quantity: {overallTotals.total_quantity}</span>
//         <span>Total Amount: {overallTotals.total_amount.toFixed(2)}</span>
//       </div>

//       {/* Radio Buttons for View Mode */}
//       <div style={radioContainerStyle}>
//         <label style={radioLabelStyle}>
//           <input
//             type="radio"
//             value="summary"
//             checked={viewMode === "summary"}
//             onChange={(e) => setViewMode(e.target.value)}
//           />
//           Items Summary
//         </label>
//         <label style={radioLabelStyle}>
//           <input
//             type="radio"
//             value="details"
//             checked={viewMode === "details"}
//             onChange={(e) => setViewMode(e.target.value)}
//           />
//           Sales Details ({totalDetailsRecords} records)
//         </label>
//       </div>

//       {/* Conditional Rendering based on View Mode */}
//       {viewMode === "summary" && summaryData.length > 0 && (
//         <div style={tableContainer}>
//           <h3 style={{ marginBottom: "10px" }}>Items Summary</h3>
//           <table id={`report-table-${viewMode}`} style={tableStyle}>
//             <thead>
//               <tr>
//                 <th style={thStyle}>Product</th>
//                 <th style={thStyle}>Total Quantity Sold</th>
//                 <th style={thStyle}>Total Sales Amount</th>
//                 <th style={thStyle}>Average Unit Price</th>
//                 <th style={thStyle}>Number of Sales</th>
//               </tr>
//             </thead>
//             <tbody>
//               {summaryData.map((s, idx) => (
//                 <tr key={idx}>
//                   <td style={tdStyle}>{s.product}</td>
//                   <td style={tdStyle}>{s.total_quantity_sold}</td>
//                   <td style={tdStyle}>{s.total_sales_amount.toFixed(2)}</td>
//                   <td style={tdStyle}>{s.average_unit_price.toFixed(2)}</td>
//                   <td style={tdStyle}>{s.number_of_sales}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {viewMode === "details" && (
//         <div style={tableContainer}>
//           <h3 style={{ marginBottom: "10px" }}>Sales Details</h3>
//           <table id={`report-table-${viewMode}`} style={tableStyle}>
//             <thead>
//               <tr>
//                 <th style={thStyle}>Date</th>
//                 <th style={thStyle}>Invoice No</th>
//                 <th style={thStyle}>Status</th>
//                 <th style={thStyle}>Product</th>
//                 <th style={thStyle}>Quantity</th>
//                 <th style={thStyle}>Unit Price</th>
//                 <th style={thStyle}>Amount</th>
//                 <th style={thStyle}>Total</th>
//                 <th style={thStyle}>Batch No</th>
//                 <th style={thStyle}>Exp Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="10"
//                     style={{ textAlign: "center", padding: "8px" }}
//                   >
//                     No data found
//                   </td>
//                 </tr>
//               ) : (
//                 reportData.map((d, idx) => (
//                   <tr key={idx}>
//                     <td style={tdStyle}>{d["Billing__Billing_Date"]}</td>
//                     <td style={tdStyle}>{d["Billing__Billing_Invoice_No"]}</td>
//                     <td style={tdStyle}>{d["Billing__Bill_Status"]}</td>
//                     <td style={tdStyle}>{d.ItemName}</td>
//                     <td style={tdStyle}>{d.Billing_Quantity}</td>
//                     <td style={tdStyle}>{d.Unit_Price}</td>
//                     <td style={tdStyle}>{d.Amount}</td>
//                     <td style={tdStyle}>{d.Total}</td>
//                     <td style={tdStyle}>{d.BatchNo}</td>
//                     <td style={tdStyle}>{d.Exp_Date}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {viewMode === "summary" && summaryData.length === 0 && (
//         <p style={{ textAlign: "center" }}>No summary data found</p>
//       )}

//       {viewMode === "details" && reportData.length === 0 && (
//         <p style={{ textAlign: "center" }}>No details data found</p>
//       )}
//     </div>
//   );
// }

// export default ProductWisePharmacySalesReport;

import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function ProductWisePharmacySalesReport() {
  const [period, setPeriod] = useState("all");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [viewMode, setViewMode] = useState("summary"); // New: 'summary' or 'details'
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [totalDetailsRecords, setTotalDetailsRecords] = useState(0);
  const [overallTotals, setOverallTotals] = useState({
    total_quantity: 0,
    total_amount: 0,
  });
  const [produ, setProdu] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  // Fetch Report Data
  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        type:
          department === "All"
            ? "all"
            : department === "iPharmacy"
            ? "ip"
            : department === "oPharmacy"
            ? "op"
            : "foc",
      };

      // Add product search filter
      if (produ && produ.trim() !== "") {
        params.product = produ.trim();
      }

      if (period !== "all") {
        if (period === "daily" && startDate) {
          params.start_date = startDate;
          params.end_date = startDate;
        } else if (period === "weekly" && startDate && endDate) {
          params.start_date = startDate;
          params.end_date = endDate;
        } else if (period === "monthly" && month && year) {
          params.month = month;
          params.year = year;
        }
      }

      if (status && status !== "All") params.status = status;

      const response = await axios.get(
        `${UrlLink}Inventory/pharmacysalesproductwise`,
        { params }
      );

      setReportData(response.data.sales_details || []);
      setSummaryData(response.data.items_summary || []);
      setOverallTotals(
        response.data.overall_totals || { total_quantity: 0, total_amount: 0 }
      );
      setTotalDetailsRecords(response.data.total_details_records || 0);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Export Excel
  const exportToExcel = () => {
    const rows = reportData.map((d) => ({
      Date: d["Billing__Billing_Date"],
      Invoice: d["Billing__Billing_Invoice_No"],
      Status: d["Billing__Bill_Status"],
      Product: d.ItemName,
      Quantity: d.Billing_Quantity,
      "Unit Price": d.Unit_Price,
      Amount: d.Amount,
      Total: d.Total,
      "Batch No": d.BatchNo,
      "Exp Date": d.Exp_Date,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProductWiseSales");
    XLSX.writeFile(wb, `ProductWisePharmacySales_${period}.xlsx`);
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Product Wise Pharmacy Sales Report - ${period}`, 14, 16);
    const tableColumn = [
      "Date",
      "Invoice",
      "Status",
      "Product",
      "Quantity",
      "Unit Price",
      "Amount",
      "Total",
      "Batch No",
      "Exp Date",
    ];
    const tableRows = reportData.map((d) => [
      d["Billing__Billing_Date"],
      d["Billing__Billing_Invoice_No"],
      d["Billing__Bill_Status"],
      d.ItemName,
      d.Billing_Quantity,
      d.Unit_Price,
      d.Amount,
      d.Total,
      d.BatchNo,
      d.Exp_Date,
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`ProductWisePharmacySales_${period}.pdf`);
  };

  // Print
  const printReport = () => {
    const currentTable = document.getElementById(
      `report-table-${viewMode}`
    ).outerHTML;
    const newWin = window.open("", "_blank");
    const title = viewMode === "summary" ? "Items Summary" : "Sales Details";
    newWin.document.write(`
      <html>
        <head>
          <title>Product Wise Pharmacy Sales Report - ${title}</title>
          <style>
            body { font-family: Arial; margin: 10px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Product Wise Pharmacy Sales Report - ${title}</h2>
          <div style="font-weight: bold; background-color: #e0e0e0; display: flex; justify-content: space-between; padding: 8px;">
            <span>Total Quantity: ${overallTotals.total_quantity}</span>
            <span>Total Amount: ${overallTotals.total_amount.toFixed(2)}</span>
          </div>
          ${currentTable}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  // Styles
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
  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
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
    padding: "4px",
    backgroundColor: "#f0f0f0",
    textAlign: "start",
    minWidth: "90px",
  };
  const tdStyle = {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "start",
    fontSize: "12px",
    minWidth: "90px",
  };
  const radioContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "20px",
  };
  const radioLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Product Wise Pharmacy Sales Report</h2>

      {/* Filters */}
      <div style={filterContainer}>
        <div>
          <label>Product:</label>
          <input
            value={produ}
            onChange={(e) => setProdu(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label>Pharmacy Type:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Pharmacies</option>
            <option value="iPharmacy">IP Pharmacy</option>
            <option value="oPharmacy">OP Pharmacy</option>
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
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Conditional Date Inputs */}
        {period === "daily" && (
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}
        {period === "weekly" && (
          <>
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
          </>
        )}
        {period === "monthly" && (
          <>
            <div>
              <label>Month:</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={inputStyle}
              >
                {[...Array(12).keys()].map((m) => (
                  <option key={m + 1} value={m + 1}>
                    {new Date(0, m).toLocaleString("default", {
                      month: "long",
                    })}
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
          </>
        )}

        {/* Action Buttons */}
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

      {/* Totals - Moved to top */}
      <div
        style={{
          fontWeight: "bold",
          backgroundColor: "#e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          padding: "8px",
          marginBottom: "20px",
        }}
      >
        <span>Total Quantity: {overallTotals.total_quantity}</span>
        <span>Total Amount: {overallTotals.total_amount.toFixed(2)}</span>
      </div>

      {/* Radio Buttons for View Mode */}
      <div style={radioContainerStyle}>
        <label style={radioLabelStyle}>
          <input
            type="radio"
            value="summary"
            checked={viewMode === "summary"}
            onChange={(e) => setViewMode(e.target.value)}
          />
          Items Summary
        </label>
        <label style={radioLabelStyle}>
          <input
            type="radio"
            value="details"
            checked={viewMode === "details"}
            onChange={(e) => setViewMode(e.target.value)}
          />
          Sales Details ({totalDetailsRecords} records)
        </label>
      </div>

      {/* Conditional Rendering based on View Mode */}
      {viewMode === "summary" && summaryData.length > 0 && (
        <div style={tableContainer}>
          <h3 style={{ marginBottom: "10px" }}>Items Summary</h3>
          <table id={`report-table-${viewMode}`} style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Total Quantity Sold</th>
                <th style={thStyle}>Total Sales Amount</th>
                <th style={thStyle}>Average Unit Price</th>
                <th style={thStyle}>Number of Sales</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((s, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{s.product}</td>
                  <td style={tdStyle}>{s.total_quantity_sold}</td>
                  <td style={tdStyle}>{s.total_sales_amount.toFixed(2)}</td>
                  <td style={tdStyle}>{s.average_unit_price.toFixed(2)}</td>
                  <td style={tdStyle}>{s.number_of_sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "details" && (
        <div style={tableContainer}>
          <h3 style={{ marginBottom: "10px" }}>Sales Details</h3>
          <table id={`report-table-${viewMode}`} style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Invoice No</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Unit Price</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Batch No</th>
                <th style={thStyle}>Exp Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                reportData.map((d, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{d["Billing__Billing_Date"]}</td>
                    <td style={tdStyle}>{d["Billing__Billing_Invoice_No"]}</td>
                    <td style={tdStyle}>{d["Billing__Bill_Status"]}</td>
                    <td style={tdStyle}>{d.ItemName}</td>
                    <td style={tdStyle}>{d.Billing_Quantity}</td>
                    <td style={tdStyle}>{d.Unit_Price}</td>
                    <td style={tdStyle}>{d.Amount}</td>
                    <td style={tdStyle}>{d.Total}</td>
                    <td style={tdStyle}>{d.BatchNo}</td>
                    <td style={tdStyle}>{d.Exp_Date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "summary" && summaryData.length === 0 && (
        <p style={{ textAlign: "center" }}>No summary data found</p>
      )}

      {viewMode === "details" && reportData.length === 0 && (
        <p style={{ textAlign: "center" }}>No details data found</p>
      )}
    </div>
  );
}

export default ProductWisePharmacySalesReport;
