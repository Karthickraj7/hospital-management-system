// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import { useReactToPrint } from "react-to-print";
// import { EyeIcon } from "lucide-react";

// const AccountsReport = () => {
//   const [reason, setReason] = useState("IPPHARMACY");
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAll, setShowAll] = useState(false);

//   // ✅ Date states
//   const today = new Date().toISOString().split("T")[0];
//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState();

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const printRef = useRef();

//   const fetchReport = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${UrlLink}Inventory/grn_report_by_reason?reason=${reason}&start_date=${startDate}&end_date=${endDate}`
//       );
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching GRN report:", error);
//       setData(null);
//     }
//     setLoading(false);
//   };

//   // Export Excel (only products data)
//   const handleExport = () => {
//     if (!data) return;
//     const ws = XLSX.utils.json_to_sheet(data.products);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "GRN Report");
//     XLSX.writeFile(wb, `GRN_Report_${reason}_${startDate}_to_${endDate}.xlsx`);
//   };

//   // Print only table + total
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `GRN_Report_${reason}_${startDate}_to_${endDate}`,
//     pageStyle: `
//       @page { size: A4; margin: 15mm; }
//       body { font-family: Arial, sans-serif; font-size: 12px; }
//       table { border-collapse: collapse; width: 100%; }
//       th, td { border: 1px solid #999; padding: 6px; text-align: left; font-weight:bold;}
//       th { background-color: #f2f2f2; }
//       h4,h2 { margin-top: 15px;text-align:center; }
//     `,
//   });




//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
//         GRN Report (Product Wise)
//       </h2>

//       {/* Reason Dropdown */}
//       <select
//         value={reason}
//         onChange={(e) => setReason(e.target.value)}
//         style={{ padding: "6px 10px", borderRadius: "4px" }}
//       >
//         <option value="IPPHARMACY">IPPHARMACY</option>
//         <option value="OPPHARMACY">OPPHARMACY</option>
//         <option value="KARUNAPHARMACY">KARUNAPHARMACY</option>
//       </select>

//       {/* ✅ Date Filters */}
  
//       <input
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//         style={{ marginLeft: "5px", padding: "6px" ,borderRadius:'5px'}}
//       />

   
//       <input
//         type="date"
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//         style={{ marginLeft: "5px", padding: "6px" ,borderRadius:'5px'}}
//       />

//       {/* Show Button */}
//       <button
//         onClick={fetchReport}
//         style={{
//           backgroundColor: "#616469ff",
//           color: "white",
//           padding: "8px 8px",
//           borderRadius: "5px",
//           marginLeft: "10px",
//           border: "none",
//           cursor: "pointer",
//         }}
//       >
//         show
//       </button>

//       {/* Print & Export Buttons */}
//       {data && (
//         <>
//           <button
//             onClick={handlePrint}
//             style={{
//               backgroundColor: "#169ea3ff",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "5px",
//               marginLeft: "10px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Print
//           </button>
//           <button
//             onClick={handleExport}
//             style={{
//               backgroundColor: "#7ec09fff",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "5px",
//               marginLeft: "10px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Export Excel
//           </button>
//         </>
//       )}

//       {/* Loading */}
//       {loading && <p style={{ marginTop: "15px" }}>Loading...</p>}

//       {/* Data Section (also printable) */}
//       {data && (
//         <div style={{ marginTop: "25px" }} ref={printRef}>
//           <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px"}}>
//             {reason} 
//           </h2>

//           <h4 style={{ fontWeight: "bold" }}>
//             Total Amount: {data.summary.total_amount}
//           </h4>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               marginTop: "10px",
//             }}
//           >
//             <thead>
//               <tr style={{ backgroundColor: "#e5e7eb" }}>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Product ID</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>PO NUMBER</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item Name</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Batch No</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Qty</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Rate </th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total </th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received By </th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Time </th>

//               </tr>
//             </thead>
//             <tbody>
//               {(showAll ? data.products : data.products.slice(0, 7)).map((p, idx) => (
//                 <tr key={idx}>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Product_Detials__id}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Grn_Detials__Purchase_order_Detials__PurchaseOrder_Number}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Product_Detials__ItemName}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Batch_No}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Received_Quantity}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Purchase_rate_with_tax}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Total_Pack_Amount_with_tax}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Created_by}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Created_at}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Show More / Less */}
//           {data.products.length > 7 && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               style={{
//                 backgroundColor: "#4a5568",
//                 color: "white",
//                 padding: "6px 12px",
//                 borderRadius: "4px",
//                 marginTop: "10px",
//                 cursor: "pointer",
//                 border: "none",
//               }}
//             >
//               {showAll ? "Show Less" : "Show All"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountsReport;

//latest
// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import { useReactToPrint } from "react-to-print";

// const AccountsReport = () => {
//   const reasonOptions = ["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY"];

//   const [reason, setReason] = useState([]); // array for multiple selection
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAll, setShowAll] = useState(false);

//   const today = new Date().toISOString().split("T")[0];
//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState();

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const printRef = useRef();

//   // Fetch report based on selected reasons and date range
//   const fetchReport = async () => {
//     if (reason.length === 0) {
//       alert("Please select at least one reason.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.get(`${UrlLink}Inventory/grn_report_by_reason`, {
//         params: {
//           reason: reason.join(","), // send as comma-separated string
//           start_date: startDate,
//           end_date: endDate,
//         },
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching GRN report:", error);
//       setData(null);
//     }
//     setLoading(false);
//   };

//   // Export Excel
//   const handleExport = () => {
//     if (!data) return;
//     const ws = XLSX.utils.json_to_sheet(data.products);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "GRN Report");
//     XLSX.writeFile(
//       wb,
//       `GRN_Report_${reason.join("_")}_${startDate}_to_${endDate}.xlsx`
//     );
//   };

//   // Print only table + total
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `GRN_Report_${reason.join("_")}_${startDate}_to_${endDate}`,
//     pageStyle: `
//       @page { size: A4; margin: 15mm; }
//       body { font-family: Arial, sans-serif; font-size: 12px; }
//       table { border-collapse: collapse; width: 100%; }
//       th, td { border: 1px solid #999; padding: 6px; text-align: left; font-weight:bold;}
//       th { background-color: #f2f2f2; }
//       h4,h2 { margin-top: 15px;text-align:center; }
//     `,
//   });

//   // Toggle reason selection
//   const toggleReason = (option) => {
//     setReason((prev) =>
//       prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
//     );
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
//         Acconts Report (Product Wise)
//       </h2>

//       {/* Reason Checkbox Multi-Select */}
//       <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
//         {reasonOptions.map((option) => (
//           <label key={option} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
//             <input
//               type="checkbox"
//               value={option}
//               checked={reason.includes(option)}
//               onChange={() => toggleReason(option)}
//               style={{ marginRight: "5px" }}
//             />
//             {option}
//           </label>
//         ))}
//       </div>

//       {/* Date Filters */}
//       <input
//         type="date"
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//         style={{ marginLeft: "0px", padding: "6px", borderRadius: "5px" }}
//       />
//       <input
//         type="date"
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//         style={{ marginLeft: "5px", padding: "6px", borderRadius: "5px" }}
//       />

//       {/* Show Button */}
//       <button
//         onClick={fetchReport}
//         style={{
//           backgroundColor: "#616469ff",
//           color: "white",
//           padding: "8px 8px",
//           borderRadius: "5px",
//           marginLeft: "10px",
//           border: "none",
//           cursor: "pointer",
//         }}
//       >
//         Show
//       </button>

//       {/* Print & Export Buttons */}
//       {data && (
//         <>
//           <button
//             onClick={handlePrint}
//             style={{
//               backgroundColor: "#169ea3ff",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "5px",
//               marginLeft: "10px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Print
//           </button>
//           <button
//             onClick={handleExport}
//             style={{
//               backgroundColor: "#7ec09fff",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "5px",
//               marginLeft: "10px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Export Excel
//           </button>
//         </>
//       )}

//       {/* Loading */}
//       {loading && <p style={{ marginTop: "15px" }}>Loading...</p>}

//       {/* Data Section */}
//       {data && (
//         <div style={{ marginTop: "25px" }} ref={printRef}>
//           <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
//             {reason.join(", ")}
//           </h2>

//           <h4 style={{ fontWeight: "bold" }}>
//             Total Amount: {data.summary.total_amount}
//           </h4>

//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#e5e7eb" }}>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Product ID</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>PO NUMBER</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item Name</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Batch No</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Qty</th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Rate </th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total </th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received By </th>
//                 <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Time </th>
//               </tr>
//             </thead>
//             <tbody>
//               {(showAll ? data.products : data.products.slice(0, 7)).map((p, idx) => (
//                 <tr key={idx}>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Product_Detials__id}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Grn_Detials__Purchase_order_Detials__PurchaseOrder_Number}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Product_Detials__ItemName}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Batch_No}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Received_Quantity}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Purchase_rate_with_tax}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Total_Pack_Amount_with_tax}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Created_by}
//                   </td>
//                   <td style={{ padding: "8px", border: "1px solid #ccc" }}>
//                     {p.Created_at}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Show More / Less */}
//           {data.products.length > 7 && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               style={{
//                 backgroundColor: "#4a5568",
//                 color: "white",
//                 padding: "6px 12px",
//                 borderRadius: "4px",
//                 marginTop: "10px",
//                 cursor: "pointer",
//                 border: "none",
//               }}
//             >
//               {showAll ? "Show Less" : "Show All"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountsReport;




//deep1
// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import { useReactToPrint } from "react-to-print";

// const AccountsReport = () => {
//   const reasonOptions = ["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY"];
//   const reportTypeOptions = ["Product Wise", "Supplier Wise", "Summary Report"];
  
//   const [selectedReasons, setSelectedReasons] = useState([]);
//   const [selectedReportTypes, setSelectedReportTypes] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAll, setShowAll] = useState(false);
//   const [activeTab, setActiveTab] = useState("product"); // "product" or "supplier"
  
//   const today = new Date().toISOString().split("T")[0];
//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState();

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const printRef = useRef();

//   // Toggle reason selection
//   const toggleReason = (option) => {
//     setSelectedReasons((prev) =>
//       prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
//     );
//   };

//   // Toggle report type selection
//   const toggleReportType = (option) => {
//     setSelectedReportTypes((prev) =>
//       prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
//     );
//   };

//   // Fetch report based on selected options
//   const fetchReport = async () => {
//     if (selectedReasons.length === 0) {
//       alert("Please select at least one reason.");
//       return;
//     }

//     if (selectedReportTypes.length === 0) {
//       alert("Please select at least one report type.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Determine which endpoint to call based on report types
//       const params = {
//         reason: selectedReasons.join(","),
//         start_date: startDate,
//         end_date: endDate,
//         report_types: selectedReportTypes.join(",")
//       };

//       // Default to product report
//       const endpoint = activeTab === "supplier" 
//         ? `${UrlLink}Inventory/supplier_accounts_report`
//         : `${UrlLink}Inventory/grn_report_by_reason`;

//       const response = await axios.get(endpoint, { params });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching report:", error);
//       setData(null);
//     }
//     setLoading(false);
//   };

//   // Export Excel
//   const handleExport = () => {
//     if (!data) return;
    
//     let wsData = [];
//     let fileName = "";

//     if (activeTab === "product") {
//       wsData = data.products || [];
//       fileName = `Product_Wise_Report_${selectedReasons.join("_")}`;
//     } else {
//       wsData = data.suppliers || data.data || [];
//       fileName = `Supplier_Wise_Report_${selectedReasons.join("_")}`;
//     }

//     const ws = XLSX.utils.json_to_sheet(wsData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Report");
//     XLSX.writeFile(
//       wb,
//       `${fileName}_${startDate}_to_${endDate}.xlsx`
//     );
//   };

//   // Print report
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `${activeTab === "product" ? "Product" : "Supplier"}_Report_${selectedReasons.join("_")}_${startDate}_to_${endDate}`,
//     pageStyle: `
//       @page { size: A4; margin: 15mm; }
//       body { font-family: Arial, sans-serif; font-size: 12px; }
//       table { border-collapse: collapse; width: 100%; }
//       th, td { border: 1px solid #999; padding: 6px; text-align: left; }
//       th { background-color: #f2f2f2; font-weight: bold; }
//       h4, h2 { margin-top: 15px; text-align: center; }
//       .summary-box { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
//     `,
//   });

//   // Clear all filters
//   const handleClear = () => {
//     setSelectedReasons([]);
//     setSelectedReportTypes([]);
//     setStartDate("");
//     setEndDate("");
//     setData(null);
//   };

//   // Calculate if all checkboxes are selected
//   const allReasonsSelected = selectedReasons.length === reasonOptions.length;
//   const allReportTypesSelected = selectedReportTypes.length === reportTypeOptions.length;

//   // Select all reasons
//   const selectAllReasons = () => {
//     setSelectedReasons(allReasonsSelected ? [] : [...reasonOptions]);
//   };

//   // Select all report types
//   const selectAllReportTypes = () => {
//     setSelectedReportTypes(allReportTypesSelected ? [] : [...reportTypeOptions]);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
//         Accounts Report
//       </h2>

//       {/* Report Type Tabs */}
//       <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
//         <button
//           onClick={() => setActiveTab("product")}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: activeTab === "product" ? "#007bff" : "#f8f9fa",
//             color: activeTab === "product" ? "white" : "#333",
//             border: "1px solid #ddd",
//             borderBottom: activeTab === "product" ? "2px solid #007bff" : "none",
//             cursor: "pointer",
//             fontWeight: "bold"
//           }}
//         >
//           Product Wise Report
//         </button>
//         <button
//           onClick={() => setActiveTab("supplier")}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: activeTab === "supplier" ? "#007bff" : "#f8f9fa",
//             color: activeTab === "supplier" ? "white" : "#333",
//             border: "1px solid #ddd",
//             borderBottom: activeTab === "supplier" ? "2px solid #007bff" : "none",
//             cursor: "pointer",
//             fontWeight: "bold"
//           }}
//         >
//           Supplier Wise Report
//         </button>
//       </div>

//       {/* Filter Section */}
//       <div style={{ 
//         backgroundColor: "#f8f9fa", 
//         padding: "20px", 
//         borderRadius: "8px",
//         marginBottom: "20px",
//         border: "1px solid #dee2e6"
//       }}>
//         <div style={{ marginBottom: "15px" }}>
//           <h4 style={{ marginBottom: "10px", fontWeight: "bold" }}>Select Pharmacy Reason:</h4>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//             <label style={{ display: "flex", alignItems: "center", marginRight: "20px", cursor: "pointer" }}>
//               <input
//                 type="checkbox"
//                 checked={allReasonsSelected}
//                 onChange={selectAllReasons}
//                 style={{ marginRight: "5px" }}
//               />
//               <span style={{ fontWeight: "bold" }}>Select All</span>
//             </label>
//           </div>
//           <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//             {reasonOptions.map((option) => (
//               <label key={option} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
//                 <input
//                   type="checkbox"
//                   value={option}
//                   checked={selectedReasons.includes(option)}
//                   onChange={() => toggleReason(option)}
//                   style={{ marginRight: "8px" }}
//                 />
//                 {option}
//               </label>
//             ))}
//           </div>
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <h4 style={{ marginBottom: "10px", fontWeight: "bold" }}>Select Report Type:</h4>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//             <label style={{ display: "flex", alignItems: "center", marginRight: "20px", cursor: "pointer" }}>
//               <input
//                 type="checkbox"
//                 checked={allReportTypesSelected}
//                 onChange={selectAllReportTypes}
//                 style={{ marginRight: "5px" }}
//               />
//               <span style={{ fontWeight: "bold" }}>Select All</span>
//             </label>
//           </div>
//           <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//             {reportTypeOptions.map((option) => (
//               <label key={option} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
//                 <input
//                   type="checkbox"
//                   value={option}
//                   checked={selectedReportTypes.includes(option)}
//                   onChange={() => toggleReportType(option)}
//                   style={{ marginRight: "8px" }}
//                 />
//                 {option}
//               </label>
//             ))}
//           </div>
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <h4 style={{ marginBottom: "10px", fontWeight: "bold" }}>Date Range:</h4>
//           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             <div>
//               <label style={{ display: "block", marginBottom: "5px" }}>From Date:</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
//               />
//             </div>
//             <div>
//               <label style={{ display: "block", marginBottom: "5px" }}>To Date:</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ced4da" }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             onClick={fetchReport}
//             style={{
//               backgroundColor: "#007bff",
//               color: "white",
//               padding: "10px 20px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//               fontWeight: "bold"
//             }}
//           >
//             Generate Report
//           </button>
//           <button
//             onClick={handleClear}
//             style={{
//               backgroundColor: "#6c757d",
//               color: "white",
//               padding: "10px 20px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//               fontWeight: "bold"
//             }}
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Loading Indicator */}
//       {loading && (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//           <div style={{ fontSize: "16px", fontWeight: "bold", color: "#007bff" }}>
//             Loading report data...
//           </div>
//         </div>
//       )}

//       {/* Report Display Section */}
//       {data && !loading && (
//         <div>
//           {/* Summary Information */}
//           <div style={{ 
//             backgroundColor: "#e7f3ff", 
//             padding: "15px", 
//             borderRadius: "5px",
//             marginBottom: "20px",
//             border: "1px solid #b3d7ff"
//           }}>
//             <h3 style={{ marginBottom: "10px", color: "#0056b3" }}>Report Summary</h3>
//             <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
//               <div>
//                 <strong>Report Type:</strong> {activeTab === "product" ? "Product Wise" : "Supplier Wise"}
//               </div>
//               <div>
//                 <strong>Selected Reasons:</strong> {selectedReasons.join(", ")}
//               </div>
//               <div>
//                 <strong>Date Range:</strong> {startDate} to {endDate}
//               </div>
//               <div>
//                 <strong>Total Records:</strong> {data.summary?.total_records || data.products?.length || 0}
//               </div>
//               {data.summary?.total_amount && (
//                 <div>
//                   <strong>Total Amount:</strong> ₹{data.summary.total_amount.toLocaleString()}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//             <button
//               onClick={handlePrint}
//               style={{
//                 backgroundColor: "#28a745",
//                 color: "white",
//                 padding: "10px 20px",
//                 borderRadius: "5px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: "bold"
//               }}
//             >
//               Print Report
//             </button>
//             <button
//               onClick={handleExport}
//               style={{
//                 backgroundColor: "#17a2b8",
//                 color: "white",
//                 padding: "10px 20px",
//                 borderRadius: "5px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: "bold"
//               }}
//             >
//               Export to Excel
//             </button>
//           </div>

//           {/* Report Content */}
//           <div ref={printRef}>
//             {/* Report Header for Print */}
//             <div style={{ textAlign: "center", marginBottom: "20px" }}>
//               <h2 style={{ marginBottom: "5px" }}>
//                 {activeTab === "product" ? "PRODUCT WISE REPORT" : "SUPPLIER WISE REPORT"}
//               </h2>
//               <p style={{ color: "#666" }}>
//                 {selectedReasons.join(" | ")} | {startDate} to {endDate}
//               </p>
//             </div>

//             {/* Conditional Table Rendering */}
//             {activeTab === "product" ? (
//               /* PRODUCT WISE TABLE */
//               <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#e9ecef" }}>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "center" }}>SL No</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Reason</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Product ID</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Product Name</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Batch No</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Received Qty</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Rate (₹)</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Total (₹)</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Received By</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Received Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(showAll ? data.products : data.products.slice(0, 10)).map((p, idx) => (
//                     <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "center" }}>
//                         {idx + 1}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {p.Reason || p.Reason}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {p.Product_Detials__id || p.id}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {p.Product_Detials__ItemName || p.item_name}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {p.Batch_No || p.batch_no}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>
//                         {p.Received_Quantity || p.quantity}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>
//                         ₹{p.Purchase_rate_with_tax || p.rate}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>
//                         ₹{p.Total_Pack_Amount_with_tax || p.amount}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {p.Created_by || p.received_by}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {p.Created_at || p.received_time}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               /* SUPPLIER WISE TABLE */
//               <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#e9ecef" }}>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "center" }}>SL No</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Supplier ID</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Supplier Name</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Contact Person</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Contact Number</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Total Transactions</th>
//                     <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Total Amount (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {((data.suppliers || data.data || []).slice(0, showAll ? undefined : 10)).map((supplier, idx) => (
//                     <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "center" }}>
//                         {idx + 1}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {supplier.supplier_id || supplier.Supplier_Code}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {supplier.supplier_name || supplier.Supplier_Name}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {supplier.contact_person || supplier.Contact_Person}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6" }}>
//                         {supplier.contact_number || supplier.Contact_Number}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>
//                         {supplier.total_transactions || supplier.transactions || 0}
//                       </td>
//                       <td style={{ padding: "10px", border: "1px solid #dee2e6", textAlign: "right" }}>
//                         ₹{(supplier.total_amount || supplier.net_amt || 0).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}

//             {/* Total Summary */}
//             {data.summary && (
//               <div style={{ 
//                 marginTop: "30px", 
//                 padding: "15px", 
//                 backgroundColor: "#f8f9fa",
//                 border: "1px solid #dee2e6",
//                 borderRadius: "5px"
//               }}>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <div style={{ fontWeight: "bold", fontSize: "16px" }}>Grand Total:</div>
//                   <div style={{ fontWeight: "bold", fontSize: "16px", color: "#dc3545" }}>
//                     ₹{data.summary.total_amount?.toLocaleString() || 
//                        data.summary.net_amount?.toLocaleString() || 
//                        data.summary.total?.toLocaleString() || 
//                        "0"}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Show More/Less Button */}
//           {((activeTab === "product" && data.products && data.products.length > 10) ||
//             (activeTab === "supplier" && (data.suppliers || data.data) && 
//              (data.suppliers || data.data).length > 10)) && (
//             <div style={{ textAlign: "center", marginTop: "20px" }}>
//               <button
//                 onClick={() => setShowAll(!showAll)}
//                 style={{
//                   backgroundColor: "#6c757d",
//                   color: "white",
//                   padding: "8px 20px",
//                   borderRadius: "5px",
//                   border: "none",
//                   cursor: "pointer",
//                   fontWeight: "bold"
//                 }}
//               >
//                 {showAll ? "Show Less" : "Show All Records"}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountsReport;


//deep2
// import React, { useState, useRef,useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import { useReactToPrint } from "react-to-print";

// const AccountsReport = () => {
//   const reasonOptions = ["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY"];

//   console.log('hacker heshwar')

//     const [suppliers, setSuppliers] = useState([]);
//       const [selectedSupplier, setSelectedSupplier] = useState("");
    
   
  
//   const [reason, setReason] = useState([]);
//   const [reportType, setReportType] = useState("product"); // "product" or "supplier"
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAll, setShowAll] = useState(false);

//   const today = new Date().toISOString().split("T")[0];
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const printRef = useRef();


//   useEffect(() => {
//     const fetchMasterData = async () => {
//       try {
//         const [suppliersRes] = await Promise.all([
//           axios.get(
//             `${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=true`
//           )
//         ]);
//         setSuppliers(suppliersRes.data || []);
//       } catch (error) {
//         console.error("Error fetching master data:", error);
//       }
//     };
//     fetchMasterData();
//   }, [UrlLink]);

//   // Fetch report based on selected options
//   const fetchReport = async () => {
//     if (reason.length === 0) {
//       alert("Please select at least one reason.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const endpoint = reportType === "supplier" 
//         ? `${UrlLink}Inventory/supplier_accounts_report`
//         : `${UrlLink}Inventory/grn_report_by_reason`;
      
//       const response = await axios.get(endpoint, {
//         params: {
//           reason: reason.join(","),
//           start_date: startDate,
//           end_date: endDate,
//           selectedSupplier : selectedSupplier
//         },
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching report:", error);
//       setData(null);
//     }
//     setLoading(false);
//   };


//   useEffect(() => {
//     fetchReport();
//   }, [selectedSupplier]);

//   // Export Excel
//   const handleExport = () => {
//     if (!data) return;
    
//     let wsData = [];
//     let fileName = "";
    
//     if (reportType === "product") {
//       wsData = data.products || [];
//       fileName = `Product_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
//     } else {
//       wsData = data.suppliers || [];
//       fileName = `Supplier_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
//     }
    
//     const ws = XLSX.utils.json_to_sheet(wsData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Report");
//     XLSX.writeFile(wb, `${fileName}.xlsx`);
//   };

//   // Print report
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `${reportType === "product" ? "Product" : "Supplier"}_Report_${reason.join("_")}_${startDate}_to_${endDate}`,
//     pageStyle: `
//       @page { size: A4; margin: 15mm; }
//       body { font-family: Arial, sans-serif; font-size: 12px; }
//       table { border-collapse: collapse; width: 100%; }
//       th, td { border: 1px solid #999; padding: 6px; text-align: left; }
//       th { background-color: #f2f2f2; font-weight: bold; }
//       h4,h2 { margin-top: 15px; text-align: center; }
//     `,
//   });

//   // Toggle reason selection
//   const toggleReason = (option) => {
//     setReason((prev) =>
//       prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
//     );
//   };

//   // Toggle report type
//   const toggleReportType = (type) => {
//     setReportType(type);
//     setData(null); // Clear data when switching report type
//     setShowAll(false);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
//         Accounts Report
//       </h2>

//       {/* Report Type Selection */}
//       <div style={{ marginBottom: "15px" }}>
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//           <button
//             onClick={() => toggleReportType("product")}
//             style={{
//               backgroundColor: reportType === "product" ? "#616469ff" : "#e5e7eb",
//               color: reportType === "product" ? "white" : "#333",
//               padding: "6px 12px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Product Wise
//           </button>
//           <button
//             onClick={() => toggleReportType("supplier")}
//             style={{
//               backgroundColor: reportType === "supplier" ? "#616469ff" : "#e5e7eb",
//               color: reportType === "supplier" ? "white" : "#333",
//               padding: "6px 12px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Supplier Wise
//           </button>

//           <div className="RegisForm_1">
//             <label>Supplier:</label>
//             <input
//               list="supplierList"
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               placeholder="Type to search suppliers..."
//               style={{ padding: "5px", width: "100%" }}
//             />
//             <datalist id="supplierList">
//               <option value="">All Suppliers</option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.SupplierName}
//                 </option>
//               ))}
//             </datalist>
//           </div>
//         </div>
//       </div>

//       {/* Reason Checkbox Multi-Select */}
//       <div style={{ marginBottom: "15px" }}>
//         <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>
//           {reasonOptions.map((option) => (
//             <label key={option} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
//               <input
//                 type="checkbox"
//                 value={option}
//                 checked={reason.includes(option)}
//                 onChange={() => toggleReason(option)}
//                 style={{ marginRight: "5px" }}
//               />
//               {option}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Date Filters */}
//       <div style={{ marginBottom: "15px" }}>
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc" }}
//         />
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           style={{ marginLeft: "5px", padding: "6px", borderRadius: "5px", border: "1px solid #ccc" }}
//         />
//       </div>

//       {/* Show Button */}
//       <button
//         onClick={fetchReport}
//         style={{
//           backgroundColor: "#616469ff",
//           color: "white",
//           padding: "8px 16px",
//           borderRadius: "5px",
//           border: "none",
//           cursor: "pointer",
//           marginBottom: "15px"
//         }}
//       >
//         Show
//       </button>

//       {/* Print & Export Buttons */}
//       {data && (
//         <div style={{ marginBottom: "15px" }}>
//           <button
//             onClick={handlePrint}
//             style={{
//               backgroundColor: "#169ea3ff",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "5px",
//               marginRight: "10px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Print
//           </button>
//           <button
//             onClick={handleExport}
//             style={{
//               backgroundColor: "#7ec09fff",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Export Excel
//           </button>
//         </div>
//       )}

//       {/* Loading */}
//       {loading && <p style={{ marginTop: "15px" }}>Loading...</p>}

//       {/* Data Section */}
//       {data && (
//         <div style={{ marginTop: "25px" }} ref={printRef}>
//           <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>
//             {reportType === "product" ? "Product Wise Report" : "Supplier Wise Report"} - {reason.join(", ")}
//           </h2>

//           {/* Summary */}
//           <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
//             Total {reportType === "product" ? "Products" : "Records"}: {data.summary?.total_records || data.summary?.total_products || 0} | 
//             Total Amount: {data.summary?.total_amount || data.summary?.total_net_amount || 0}
//           </h4>

//           {/* Dynamic Table based on Report Type */}
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#e5e7eb" }}>
//                 {reportType === "product" ? (
//                   <>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Product ID</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>PO NUMBER</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Batch No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Qty</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Rate</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received By</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Time</th>
//                   </>
//                 ) : (
//                   <>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>SL No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN Date</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill Date</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Net Amount</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total Amount</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill No</th>
//                   </>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportType === "product" ? (
//                 // Product Wise Table Rows
//                 (showAll ? data.products : data.products.slice(0, 7)).map((p, idx) => (
//                   <tr key={idx}>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Product_Detials__id}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Grn_Detials__Purchase_order_Detials__PurchaseOrder_Number}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Product_Detials__ItemName}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Batch_No}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Received_Quantity}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Purchase_rate_with_tax}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Total_Pack_Amount_with_tax}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Created_by}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Created_at}</td>
//                   </tr>
//                 ))
//               ) : (
//                 // Supplier Wise Table Rows
//                 (showAll ? data.suppliers : data.suppliers.slice(0, 7)).map((s, idx) => (
//                   <tr key={idx}>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.sl_no}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.grn_no}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.grn_date}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_bill_date}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_name}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.net_amt}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.total_amount}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_bill_no}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Show More / Less */}
//           {((reportType === "product" && data.products.length > 7) ||
//             (reportType === "supplier" && data.suppliers && data.suppliers.length > 7)) && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               style={{
//                 backgroundColor: "#4a5568",
//                 color: "white",
//                 padding: "6px 12px",
//                 borderRadius: "4px",
//                 marginTop: "10px",
//                 cursor: "pointer",
//                 border: "none",
//               }}
//             >
//               {showAll ? "Show Less" : "Show All"}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountsReport;




import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";

const AccountsReport = () => {
  const reasonOptions = ["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY"];

  console.log('heloooooooooo')

    const [suppliers, setSuppliers] = useState([]);
      const [selectedSupplier, setSelectedSupplier] = useState("");
    
   
  
  const [reason, setReason] = useState([]);
  const [reportType, setReportType] = useState("product"); // "product" or "supplier"
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const printRef = useRef();


  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [suppliersRes] = await Promise.all([
          axios.get(
            `${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=true`
          )
        ]);
        setSuppliers(suppliersRes.data || []);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, [UrlLink]);

  // Fetch report based on selected options
  const fetchReport = async () => {
    if (reason.length === 0) {
      alert("Please select at least one reason.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = reportType === "supplier" 
        ? `${UrlLink}Inventory/supplier_accounts_report`
        : `${UrlLink}Inventory/grn_report_by_reason`;
      
      const response = await axios.get(endpoint, {
        params: {
          reason: reason.join(","),
          start_date: startDate,
          end_date: endDate,
          selectedSupplier : selectedSupplier
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setData(null);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchReport();
  }, [selectedSupplier]);

  // Export Excel
  const handleExport = () => {
    if (!data) return;
    
    let wsData = [];
    let fileName = "";
    
    if (reportType === "product") {
      wsData = data.products || [];
      fileName = `Product_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
    } else {
      wsData = data.suppliers || [];
      fileName = `Supplier_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
    }
    
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // Print report
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${reportType === "product" ? "Product" : "Supplier"}_Report_${reason.join("_")}_${startDate}_to_${endDate}`,
    pageStyle: `
      @page { size: A4; margin: 15mm; }
      body { font-family: Arial, sans-serif; font-size: 12px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #999; padding: 6px; text-align: left; }
      th { background-color: #f2f2f2; font-weight: bold; }
      h4,h2 { margin-top: 15px; text-align: center; }
    `,
  });

  // Toggle reason selection
  const toggleReason = (option) => {
    setReason((prev) =>
      prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
    );
  };

  // Toggle report type
  const toggleReportType = (type) => {
    setReportType(type);
    setData(null); // Clear data when switching report type
    setShowAll(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
        Accounts Report
      </h2>

      {/* Report Type Selection */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={() => toggleReportType("product")}
            style={{
              backgroundColor: reportType === "product" ? "#616469ff" : "#e5e7eb",
              color: reportType === "product" ? "white" : "#333",
              padding: "6px 12px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Product Wise
          </button>
          <button
            onClick={() => toggleReportType("supplier")}
            style={{
              backgroundColor: reportType === "supplier" ? "#616469ff" : "#e5e7eb",
              color: reportType === "supplier" ? "white" : "#333",
              padding: "6px 12px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Supplier Wise
          </button>

          <div className="RegisForm_1">
            <label>Supplier:</label>
            <input
              list="supplierList"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              placeholder="Type to search suppliers..."
              style={{ padding: "5px", width: "100%" }}
            />
            <datalist id="supplierList">
              <option value="">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.SupplierName}
                </option>
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {/* Reason Checkbox Multi-Select */}
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>
          {reasonOptions.map((option) => (
            <label key={option} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                value={option}
                checked={reason.includes(option)}
                onChange={() => toggleReason(option)}
                style={{ marginRight: "5px" }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Date Filters */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginLeft: "5px", padding: "6px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Show Button */}
      <button
        onClick={fetchReport}
        style={{
          backgroundColor: "#616469ff",
          color: "white",
          padding: "8px 16px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginBottom: "15px"
        }}
      >
        Show
      </button>

      {/* Print & Export Buttons */}
      {data && (
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: "#169ea3ff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              marginRight: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Print
          </button>
          <button
            onClick={handleExport}
            style={{
              backgroundColor: "#7ec09fff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Export Excel
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <p style={{ marginTop: "15px" }}>Loading...</p>}

      {/* Data Section */}
      {data && (
        <div style={{ marginTop: "25px" }} ref={printRef}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>
            {reportType === "product" ? "Product Wise Report" : "Supplier Wise Report"} - {reason.join(", ")}
          </h2>

          {/* Summary */}
          <h4 style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Total {reportType === "product" ? "Products" : "Records"}: {data.summary?.total_records || data.summary?.total_products || 0} | 
            Total Amount: {data.summary?.total_amount || data.summary?.total_net_amount || 0}
          </h4>

          {/* Dynamic Table based on Report Type */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#e5e7eb" }}>
                {reportType === "product" ? (
                  <>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>SL No</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN No</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN Date</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Name</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill Date</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item Name</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Qty</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>PTR</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Net Amount</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Reason</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>SL No</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN No</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN Date</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill Date</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Name</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Net Amount</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total Amount</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill No</th>
                    <th style={{ padding: "8px", border: "1px solid #ccc" }}>Reason</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reportType === "product" ? (
                // Product Wise Table Rows
                (showAll ? data.products : data.products.slice(0, 7)).map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {idx + 1}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {p.Grn_Detials__GRN_No}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {p.Grn_Detials__GrnDate}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {p.Grn_Detials__Supplier_Detials__Supplier_Name}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {p.Grn_Detials__Supplier_Bill_Date}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {p.Product_Detials__ItemName}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>
                      {p.Received_Quantity}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>
                      {p.Purchase_rate_with_tax}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>
                      {p.Grn_Detials__Net_Amount}
                    </td>

                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                      {p.Reason}
                    </td>
                  </tr>
                ))
              ) : (
                // Supplier Wise Table Rows
                (showAll ? data.suppliers : data.suppliers.slice(0, 7)).map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.sl_no}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.grn_no}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.grn_date}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_bill_date}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_name}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.net_amt}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.total_amount}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_bill_no}</td>
                    <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Show More / Less */}
          {((reportType === "product" && data.products.length > 7) ||
            (reportType === "supplier" && data.suppliers && data.suppliers.length > 7)) && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                backgroundColor: "#4a5568",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                marginTop: "10px",
                cursor: "pointer",
                border: "none",
              }}
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountsReport;


// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import { useReactToPrint } from "react-to-print";

// const AccountsReport = () => {
//   const reasonOptions = ["IPPHARMACY", "OPPHARMACY", "KARUNAPHARMACY"];
  
//   const [reason, setReason] = useState([]);
//   const [reportType, setReportType] = useState("product"); // "product", "supplier", or "supplier_list"
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAll, setShowAll] = useState(false);

//   const today = new Date().toISOString().split("T")[0];
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const printRef = useRef();

//   // Fetch report based on selected options
//   const fetchReport = async () => {
//     if (reason.length === 0) {
//       alert("Please select at least one reason.");
//       return;
//     }

//     setLoading(true);
//     try {
//       let endpoint = "";
//       let params = {
//         reason: reason.join(","),
//         start_date: startDate,
//         end_date: endDate,
//       };

//       switch(reportType) {
//         case "product":
//           endpoint = `${UrlLink}Inventory/grn_report_by_reason`;
//           break;
//         case "supplier":
//           endpoint = `${UrlLink}Inventory/supplier_accounts_report`;
//           break;
//         case "supplier_list":
//           endpoint = `${UrlLink}Inventory/supplier_list_by_reason`;
//           break;
//         default:
//           endpoint = `${UrlLink}Inventory/grn_report_by_reason`;
//       }
      
//       const response = await axios.get(endpoint, { params });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching report:", error);
//       setData(null);
//     }
//     setLoading(false);
//   };

//   // Export Excel
//   const handleExport = () => {
//     if (!data) return;
    
//     let wsData = [];
//     let fileName = "";
    
//     if (reportType === "product") {
//       wsData = data.products || [];
//       fileName = `Product_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
//     } else if (reportType === "supplier") {
//       wsData = data.suppliers || [];
//       fileName = `Supplier_GRN_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
//     } else if (reportType === "supplier_list") {
//       wsData = data.suppliers || [];
//       fileName = `Supplier_List_Report_${reason.join("_")}_${startDate}_to_${endDate}`;
//     }
    
//     const ws = XLSX.utils.json_to_sheet(wsData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Report");
//     XLSX.writeFile(wb, `${fileName}.xlsx`);
//   };

//   // Print report
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `${reportType === "product" ? "Product" : reportType === "supplier" ? "Supplier_GRN" : "Supplier_List"}_Report_${reason.join("_")}_${startDate}_to_${endDate}`,
//     pageStyle: `
//       @page { size: A4; margin: 15mm; }
//       body { font-family: Arial, sans-serif; font-size: 12px; }
//       table { border-collapse: collapse; width: 100%; }
//       th, td { border: 1px solid #999; padding: 6px; text-align: left; }
//       th { background-color: #f2f2f2; font-weight: bold; }
//       h4,h2 { margin-top: 15px; text-align: center; }
//     `,
//   });

//   // Toggle reason selection
//   const toggleReason = (option) => {
//     setReason((prev) =>
//       prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
//     );
//   };

//   // Toggle report type
//   const toggleReportType = (type) => {
//     setReportType(type);
//     setData(null); // Clear data when switching report type
//     setShowAll(false);
//   };

//   // Clear all filters
//   const handleClear = () => {
//     setReason([]);
//     setStartDate("");
//     setEndDate("");
//     setData(null);
//     setShowAll(false);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
//         Accounts Report
//       </h2>

//       {/* Report Type Selection */}
//       <div style={{ marginBottom: "15px" }}>
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
//           <button
//             onClick={() => toggleReportType("product")}
//             style={{
//               backgroundColor: reportType === "product" ? "#616469ff" : "#e5e7eb",
//               color: reportType === "product" ? "white" : "#333",
//               padding: "6px 12px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Product Wise
//           </button>
//           <button
//             onClick={() => toggleReportType("supplier")}
//             style={{
//               backgroundColor: reportType === "supplier" ? "#616469ff" : "#e5e7eb",
//               color: reportType === "supplier" ? "white" : "#333",
//               padding: "6px 12px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Supplier Wise (GRN Details)
//           </button>
//           <button
//             onClick={() => toggleReportType("supplier_list")}
//             style={{
//               backgroundColor: reportType === "supplier_list" ? "#616469ff" : "#e5e7eb",
//               color: reportType === "supplier_list" ? "white" : "#333",
//               padding: "6px 12px",
//               borderRadius: "5px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Supplier List
//           </button>
//         </div>
//       </div>

//       {/* Reason Checkbox Multi-Select */}
//       <div style={{ marginBottom: "15px" }}>
//         <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
//           <span style={{ fontWeight: "bold", marginRight: "10px" }}>Pharmacy Reason:</span>
//         </div>
//         <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "10px" }}>
//           {reasonOptions.map((option) => (
//             <label key={option} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
//               <input
//                 type="checkbox"
//                 value={option}
//                 checked={reason.includes(option)}
//                 onChange={() => toggleReason(option)}
//                 style={{ marginRight: "5px" }}
//               />
//               {option}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Date Filters */}
//       <div style={{ marginBottom: "15px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
//           <div>
//             <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>From Date:</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc", width: "150px" }}
//             />
//           </div>
//           <div>
//             <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>To Date:</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc", width: "150px" }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
//         <button
//           onClick={fetchReport}
//           style={{
//             backgroundColor: "#616469ff",
//             color: "white",
//             padding: "8px 16px",
//             borderRadius: "5px",
//             border: "none",
//             cursor: "pointer",
//             fontWeight: "bold"
//           }}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Show Report"}
//         </button>
        
//         <button
//           onClick={handleClear}
//           style={{
//             backgroundColor: "#6c757d",
//             color: "white",
//             padding: "8px 16px",
//             borderRadius: "5px",
//             border: "none",
//             cursor: "pointer",
//             fontWeight: "bold"
//           }}
//         >
//           Clear
//         </button>

//         {data && (
//           <>
//             <button
//               onClick={handlePrint}
//               style={{
//                 backgroundColor: "#169ea3ff",
//                 color: "white",
//                 padding: "8px 16px",
//                 borderRadius: "5px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: "bold"
//               }}
//             >
//               Print
//             </button>
//             <button
//               onClick={handleExport}
//               style={{
//                 backgroundColor: "#7ec09fff",
//                 color: "white",
//                 padding: "8px 16px",
//                 borderRadius: "5px",
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: "bold"
//               }}
//             >
//               Export Excel
//             </button>
//           </>
//         )}
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//           <div style={{ fontSize: "16px", color: "#007bff" }}>Loading report data...</div>
//         </div>
//       )}

//       {/* Data Section */}
//       {data && !loading && (
//         <div style={{ marginTop: "25px" }} ref={printRef}>
//           {/* Report Header */}
//           <div style={{ textAlign: "center", marginBottom: "20px" }}>
//             <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
//               {reportType === "product" ? "PRODUCT WISE REPORT" : 
//                reportType === "supplier" ? "SUPPLIER WISE (GRN DETAILS)" : 
//                "SUPPLIER LIST REPORT"}
//             </h2>
//             <p style={{ color: "#666" }}>
//               {reason.join(" | ")} | {startDate || "All dates"} to {endDate || "All dates"}
//             </p>
//           </div>

//           {/* Summary */}
//           {data.summary && (
//             <div style={{ 
//               backgroundColor: "#e7f3ff", 
//               padding: "15px", 
//               borderRadius: "5px",
//               marginBottom: "15px",
//               border: "1px solid #b3d7ff"
//             }}>
//               <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//                 <div>
//                   <strong>Total Records:</strong> {data.summary.total_records || data.summary.total_products || data.suppliers?.length || 0}
//                 </div>
//                 {data.summary.total_amount && (
//                   <div>
//                     <strong>Total Amount:</strong> ₹{data.summary.total_amount.toLocaleString()}
//                   </div>
//                 )}
//                 {data.summary.total_net_amount && (
//                   <div>
//                     <strong>Total Net Amount:</strong> ₹{data.summary.total_net_amount.toLocaleString()}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Dynamic Table based on Report Type */}
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#e5e7eb" }}>
//                 {reportType === "product" ? (
//                   <>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>SL No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Product ID</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Item Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Batch No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Qty</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Rate (₹)</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total (₹)</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received By</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Received Time</th>
//                   </>
//                 ) : reportType === "supplier" ? (
//                   <>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>SL No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>GRN Date</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill Date</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Bill No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Net Amount (₹)</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total Amount (₹)</th>
//                   </>
//                 ) : (
//                   // Supplier List Columns
//                   <>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>SL No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier ID</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Contact Person</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Contact Number</th>
//                     <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total GRNs</th>
//                   </>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {reportType === "product" ? (
//                 // Product Wise Table Rows
//                 (showAll ? data.products : data.products.slice(0, 10)).map((p, idx) => (
//                   <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "center" }}>{idx + 1}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Product_Detials__id || p.id}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Product_Detials__ItemName || p.item_name}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Batch_No || p.batch_no}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>{p.Received_Quantity || p.quantity}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>₹{p.Purchase_rate_with_tax || p.rate}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>₹{p.Total_Pack_Amount_with_tax || p.amount}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Created_by || p.received_by}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.Created_at || p.received_time}</td>
//                   </tr>
//                 ))
//               ) : reportType === "supplier" ? (
//                 // Supplier Wise (GRN Details) Table Rows
//                 (showAll ? data.suppliers : (data.suppliers || []).slice(0, 10)).map((s, idx) => (
//                   <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "center" }}>{s.sl_no || idx + 1}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.grn_no}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.grn_date}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_bill_date}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_name}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_bill_no}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>₹{s.net_amt}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "right" }}>₹{s.total_amount}</td>
//                   </tr>
//                 ))
//               ) : (
//                 // Supplier List Table Rows
//                 (showAll ? data.suppliers : (data.suppliers || []).slice(0, 10)).map((s, idx) => (
//                   <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8f9fa" }}>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "center" }}>{s.sl_no || idx + 1}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_id}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.supplier_name}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.contact_person || "-"}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc" }}>{s.contact_number || "-"}</td>
//                     <td style={{ padding: "8px", border: "1px solid #ccc", textAlign: "center" }}>{s.total_grns || 0}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Show More / Less */}
//           {((reportType === "product" && data.products && data.products.length > 10) ||
//             (reportType === "supplier" && data.suppliers && data.suppliers.length > 10) ||
//             (reportType === "supplier_list" && data.suppliers && data.suppliers.length > 10)) && (
//             <div style={{ textAlign: "center", marginTop: "20px" }}>
//               <button
//                 onClick={() => setShowAll(!showAll)}
//                 style={{
//                   backgroundColor: "#6c757d",
//                   color: "white",
//                   padding: "8px 20px",
//                   borderRadius: "5px",
//                   border: "none",
//                   cursor: "pointer",
//                   fontWeight: "bold"
//                 }}
//               >
//                 {showAll ? "Show Less (First 10)" : "Show All Records"}
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* No Data Message */}
//       {!loading && !data && reason.length > 0 && (
//         <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
//           <div>No report data found. Please click "Show Report" to generate.</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountsReport;