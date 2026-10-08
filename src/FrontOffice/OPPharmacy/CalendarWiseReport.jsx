// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { useSelector } from "react-redux";
// import { SearchIcon } from "lucide-react";

// function CalendarWiseReport() {
//   const [period, setPeriod] = useState("daily");
//   const [department, setDepartment] = useState("All");
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [itemName, setItemName] = useState("");
//   const [patientName, setPatientName] = useState("");
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   const fetchSalesData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = {
//         type: period,
//         department,
//         item_name: itemName.trim(),
//         patient_name: patientName.trim(),
//       };

//       if (period === "daily") params.date = startDate;
//       else if (period === "weekly") {
//         params.start_date = startDate;
//         params.end_date = endDate;
//       } else if (period === "monthly") {
//         params.month = month;
//         params.year = year;
//       }

//       const response = await axios.get(`${UrlLink}DrugAdminstrations/pharmacy_sales_report`, { params });
//       setSales(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       setError(err.response?.data?.error || "Error fetching sales data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.sales || 0), 0);

//   useEffect(() => {
//     fetchSalesData();
//   }, []);

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(sales);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Sales");
//     XLSX.writeFile(wb, `Sales_Report_${period}.xlsx`);
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text(`Pharmacy Sales Report - ${period}`, 14, 16);
//     const tableColumn = ["Product", "Department", "Count", "Total Sales"];
//     const tableRows = sales.map((s) => [s.ItemName, s.department, s.count, s.sales]);
//     doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20, styles: { fontSize: 10 } });
//     doc.save(`Sales_Report_${period}.pdf`);
//   };

//   const printReport = () => {
//     const tableContent = document.getElementById("sales-table").outerHTML;
//     const newWin = window.open("", "_blank");
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>Sales Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 10px; }
//             h2 { text-align: center; }
//             .total { font-weight: bold; margin-bottom: 10px; font-size: 16px; }
//             table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 12px; }
//             th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
//             th { background-color: #f0f0f0; }
//           </style>
//         </head>
//         <body>
//           <h2>Pharmacy Sales Report - ${period}</h2>
//           <div class="total">Total Sales: ${totalSales.toFixed(2)}</div>
//           ${tableContent}
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//     newWin.focus();
//     newWin.print();
//     newWin.close();
//   };

//   // Styles
//   const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };
//   const headerStyle = { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" };
//   const filterContainer = { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", justifyContent: "center" };
//   const inputStyle = { border: "1px solid #ccc", padding: "5px", borderRadius: "4px", width: "150px" };
//   const buttonStyle = (bgColor) => ({ backgroundColor: bgColor, color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" });
//   const tableContainer = { overflowX: "auto" };
//   const tableStyle = { minWidth: "100%", borderCollapse: "collapse", border: "1px solid #ccc" };
//   const thStyle = { border: "1px solid #ccc", padding: "8px", backgroundColor: "#f0f0f0", textAlign: "left" };
//   const tdStyle = { border: "1px solid #ccc", padding: "8px" };

//   return (
//     <div style={containerStyle}>
//       <h2 style={headerStyle}>Pharmacy Sales Report</h2>

//       <div style={filterContainer}>
//         <div>
//           <label>Period:</label>
//           <select value={period} onChange={(e) => setPeriod(e.target.value)} style={inputStyle}>
//             <option value="daily">Daily</option>
//             <option value="weekly">Weekly</option>
//             <option value="monthly">Monthly</option>
//           </select>
//         </div>

//         <div>
//           <label>Department:</label>
//           <select value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle}>
//             <option value="All">All</option>
//             <option value="iPharmacy">iPharmacy</option>
//             <option value="oPharmacy">oPharmacy</option>
//           </select>
//         </div>

//         <div>
//           <label>Item Name:</label>
//           <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} style={inputStyle} />
//         </div>

//         <div>
//           <label>Patient Name:</label>
//           <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={inputStyle} />
//         </div>

//         {period === "daily" && (
//           <div>
//             <label>Date:</label>
//             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
//           </div>
//         )}

//         {period === "weekly" && (
//           <>
//             <div>
//               <label>Start Date:</label>
//               <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
//             </div>
//             <div>
//               <label>End Date:</label>
//               <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
//             </div>
//           </>
//         )}

//         {period === "monthly" && (
//           <>
//             <div>
//               <label>Month:</label>
//               <select value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle}>
//                 {[...Array(12).keys()].map((m) => (
//                   <option key={m + 1} value={m + 1}>{new Date(0, m).toLocaleString("default", { month: "long" })}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Year:</label>
//               <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle} />
//             </div>
//           </>
//         )}

//         <div style={{ display: "flex", alignItems: "flex-end", gap: "5px" }}>
//           <button onClick={fetchSalesData} style={buttonStyle("#5e6a8a")}><SearchIcon size={16} /></button>
//           <button onClick={exportToExcel} style={buttonStyle("#649c79")}>Export Excel</button>
//           <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>Export PDF</button>
//           <button onClick={printReport} style={buttonStyle("#947c52")}>Print</button>
//         </div>
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
//       {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

//       <div style={{ fontWeight: "bold", backgroundColor: "#e0e0e0", display: "flex", justifyContent: "space-between", padding: "8px" }}>
//         <span>Total Sales</span>
//         <span>{totalSales.toFixed(2)}</span>
//       </div>

//       <div style={tableContainer}>
//         <table id="sales-table" style={tableStyle}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Product</th>
//               <th style={thStyle}>Department</th>
//               <th style={thStyle}>Count</th>
//               <th style={thStyle}>Total Sales</th>
//               <th style={thStyle}>Patients</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sales.length === 0 ? (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: "center", padding: "8px" }}>No data found</td>
//               </tr>
//             ) : (
//               sales.map((s, idx) => (
//                 <tr key={idx}>
//                   <td style={tdStyle}>{s.ItemName}</td>
//                   <td style={tdStyle}>{s.department}</td>
//                   <td style={tdStyle}>{s.count}</td>
//                   <td style={tdStyle}>{s.sales}</td>
//                   <td style={tdStyle}>
//                     {s.patients && s.patients.length > 0 ? (
//                       <table style={{ borderCollapse: "collapse", width: "100%" }}>
//                         <thead>
//                           <tr>
//                             <th style={thStyle}>Patient Name</th>
//                             <th style={thStyle}>Patient ID</th>
//                             <th style={thStyle}>Phone</th>
//                             <th style={thStyle}>Qty</th>
//                             <th style={thStyle}>Amount</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {s.patients.map((p, pIdx) => (
//                             <tr key={pIdx}>
//                               <td style={tdStyle}>{p.patient_name}</td>
//                               <td style={tdStyle}>{p.patient_id}</td>
//                               <td style={tdStyle}>{p.patient_phone}</td>
//                               <td style={tdStyle}>{p.qty}</td>
//                               <td style={tdStyle}>{p.total}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     ) : "No patients"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default CalendarWiseReport;


import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";

function CalendarWiseReport() {
  const [period, setPeriod] = useState("daily");
  const [department, setDepartment] = useState("All");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [itemName, setItemName] = useState("");
  const [patientName, setPatientName] = useState("");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const fetchSalesData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        type: period,
        department,
        item_name: itemName.trim(),
        patient_name: patientName.trim(),
      };

      if (period === "daily") params.date = startDate;
      else if (period === "weekly") {
        params.start_date = startDate;
        params.end_date = endDate;
      } else if (period === "monthly") {
        params.month = month;
        params.year = year;
      }

      const response = await axios.get(
        `${UrlLink}DrugAdminstrations/pharmacy_sales_report`,
        { params }
      );
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching sales data");
    } finally {
      setLoading(false);
    }
  };

  const totalSales = sales.reduce(
    (sum, s) => sum + parseFloat(s.sales || 0),
    0
  );

  useEffect(() => {
    fetchSalesData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, `Sales_Report_${period}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Pharmacy Sales Report - ${period}`, 14, 16);
    const tableColumn = ["Product", "Department", "Count", "Total Sales"];
    const tableRows = sales.map((s) => [
      s.ItemName,
      s.department,
      s.count,
      s.sales,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10 },
    });
    doc.save(`Sales_Report_${period}.pdf`);
  };

  const printReport = () => {
    const tableContent = document.getElementById("sales-table").outerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h2 { text-align: center; }
            .total { font-weight: bold; margin-bottom: 10px; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>Pharmacy Sales Report - ${period}</h2>
          <div class="total">Total Sales: ${totalSales.toFixed(2)}</div>
          ${tableContent}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
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
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  };
  const tdStyle = { border: "1px solid #ccc", padding: "8px" };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Pharmacy Sales Report</h2>

      <div style={filterContainer}>
        <div>
          <label>Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={inputStyle}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label>Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            <option value="iPharmacy">iPharmacy</option>
            <option value="oPharmacy">OPharmacy</option>
            <option value="FOCPharmacy">FocPharmacy</option>
          </select>
        </div>

        <div>
          <label>Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Patient Name:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            style={inputStyle}
          />
        </div>

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

        <div style={{ display: "flex", alignItems: "flex-end", gap: "5px" }}>
          <button onClick={fetchSalesData} style={buttonStyle("#5e6a8a")}>
            <SearchIcon size={16} />
          </button>
          <button onClick={exportToExcel} style={buttonStyle("#649c79")}>
            Export Excel
          </button>
          <button onClick={exportToPDF} style={buttonStyle("#8f6262")}>
            Export PDF
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
        <span>Total Sales</span>
        <span>{totalSales.toFixed(2)}</span>
      </div>

      <div style={tableContainer}>
        <table id="sales-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Count</th>
              <th style={thStyle}>Total Sales</th>
              <th style={thStyle}>Patients</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "8px" }}>
                  No data found
                </td>
              </tr>
            ) : (
              sales.map((s, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{s.ItemName}</td>
                  <td style={tdStyle}>{s.department}</td>
                  <td style={tdStyle}>{s.count}</td>
                  <td style={tdStyle}>{s.sales}</td>
                  <td style={tdStyle}>
                    {s.patients && s.patients.length > 0 ? (
                      <table
                        style={{ borderCollapse: "collapse", width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th style={thStyle}>Patient Name</th>
                            <th style={thStyle}>Patient ID</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Qty</th>
                            <th style={thStyle}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.patients.map((p, pIdx) => (
                            <tr key={pIdx}>
                              <td style={tdStyle}>{p.patient_name}</td>
                              <td style={tdStyle}>{p.patient_id}</td>
                              <td style={tdStyle}>{p.patient_phone}</td>
                              <td style={tdStyle}>{p.qty}</td>
                              <td style={tdStyle}>{p.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      "No patients"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CalendarWiseReport;
