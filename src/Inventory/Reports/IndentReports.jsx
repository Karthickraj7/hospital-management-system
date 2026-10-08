// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const IndentReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [reportType, setReportType] = useState("raise");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     if (!fromDate || !toDate) return;
//     setLoading(true);
//     let endpoint = "";
//     if (reportType === "raise") endpoint = "Inventory/IndentRaiseReport";
//     else if (reportType === "issue") endpoint = "Inventory/IndentIssueReport";
//     else if (reportType === "receive")
//       endpoint = "Inventory/IndentReceiveReport";
//     axios
//       .get(`${UrlLink}${endpoint}`, {
//         params: {
//           FromDate: fromDate,
//           ToDate: toDate,
//           Location: location,
//         },
//       })
//       .then((res) => {
//         setReportData(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(() => {
//         setReportData([]);
//       })
//       .finally(() => setLoading(false));
//   }, [reportType, fromDate, toDate, location, UrlLink]);

//   const getColumns = () => {
//     if (reportType === "raise") {
//       return [
//         { key: "Invoice_No", name: "Indent No" },
//         { key: "RaisedFromLocation", name: "From Location" },
//         { key: "RaisedToLocation", name: "To Location" },
//         { key: "RaisedBy", name: "Raised By" },
//         { key: "Date", name: "Date" },
//         { key: "Status", name: "Status" },
//       ];
//     } else if (reportType === "issue") {
//       return [
//         { key: "Issue_Invoice_No", name: "Issue No" },
//         { key: "RaisedFromLocation", name: "From Location" },
//         { key: "RaisedToLocation", name: "To Location" },
//         { key: "IssuedBy", name: "Issued By" },
//         { key: "Date", name: "Date" },
//         { key: "Status", name: "Status" },
//       ];
//     } else {
//       return [
//         { key: "Receive_Invoice_No", name: "Receive No" },
//         { key: "IssueFromLocation", name: "From Location" },
//         { key: "ReceiveFromLocation", name: "To Location" },
//         { key: "ReceivedBy", name: "Received By" },
//         { key: "Date", name: "Date" },
//         { key: "Status", name: "Status" },
//       ];
//     }
//   };

//   return (
//     <div className="Main_container_app">
//       <h3>Indent Reports</h3>
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Report Type:</label>
//           <select
//             value={reportType}
//             onChange={(e) => setReportType(e.target.value)}
//           >
//             <option value="raise">Indent Raise</option>
//             <option value="issue">Indent Issue</option>
//             <option value="receive">Indent Receive</option>
//           </select>
//         </div>
//         <div className="RegisForm_1">
//           <label>From Date:</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>
//         <div className="RegisForm_1">
//           <label>To Date:</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>
//         <div className="RegisForm_1">
//           <label>Location:</label>
//           <input
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </div>
//       </div>
//       {reportData.length > 0 && (
//         <div className="RegisFormcon_1 jjxjx_">
//           <ReactGrid columns={getColumns()} RowData={reportData} />
//         </div>
//       )}
//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default IndentReports;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const IndentReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [reportType, setReportType] = useState("raise");
//   const [reportData, setReportData] = useState([]);
//   const [selectedIndent, setSelectedIndent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     if (!fromDate || !toDate) return;

//     setLoading(true);
//     let endpoint = "";

//     if (reportType === "raise") endpoint = "Inventory/IndentRaiseReport";
//     else if (reportType === "issue") endpoint = "Inventory/IndentIssueReport";
//     else if (reportType === "receive") endpoint = "Inventory/IndentReceiveReport";

//     axios
//       .get(`${UrlLink}${endpoint}`, {
//         params: { FromDate: fromDate, ToDate: toDate, Location: location },
//       })
//       .then((res) => {
//         setReportData(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(() => {
//         setReportData([]);
//       })
//       .finally(() => setLoading(false));
//   }, [reportType, fromDate, toDate, location, UrlLink]);

//   // 🔹 Columns for main report table
//   const getColumns = () => {
//     if (reportType === "raise") {
//       return [
//         { key: "Invoice_No", name: "Indent No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "RaisedBy", name: "Raised By" },
//         { key: "RequestDate", name: "Date" },
//         { key: "Status", name: "Status" },
//       ];
//     } else if (reportType === "issue") {
//       return [
//         { key: "Issue_Invoice_No", name: "Issue No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "IssuedBy", name: "Issued By" },
//         { key: "IssueDate", name: "Date" },
//         { key: "Status", name: "Status" },
//       ];
//     } else {
//       return [
//         { key: "Receive_Invoice_No", name: "Receive No" },
//         { key: "IssueFrom", name: "From Location" },
//         { key: "ReceiveTo", name: "To Location" },
//         { key: "ReceivedBy", name: "Received By" },
//         { key: "ReceiveDate", name: "Date" },
//         { key: "Status", name: "Status" },
//       ];
//     }
//   };

//   // 🔹 Columns for indented item details
//   const itemColumns = [
//     { key: "ItemCode", name: "Item Code" },
//     { key: "ItemName", name: "Item Name" },
//     { key: "ProductCategory", name: "Category" },
//     { key: "SubCategory", name: "Sub Category" },
//     { key: "PackType", name: "Pack Type" },
//     { key: "PackQuantity", name: "Pack Qty" },
//     { key: "RaisedQuantity", name: "Raised Qty" },
//     { key: "IssueQuantity", name: "Issued Qty" },
//     { key: "ReceivedQuantity", name: "Received Qty" },
//     { key: "Status", name: "Status" },
//   ];

//   return (
//     <div className="Main_container_app">
//       <h3>Indent Reports</h3>

//       {/* 🔹 Filters Section */}
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Report Type:</label>
//           <select
//             value={reportType}
//             onChange={(e) => {
//               setReportType(e.target.value);
//               setSelectedIndent(null);
//             }}
//           >
//             <option value="raise">Indent Raise</option>
//             <option value="issue">Indent Issue</option>
//             <option value="receive">Indent Receive</option>
//           </select>
//         </div>

//         <div className="RegisForm_1">
//           <label>From Date:</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div className="RegisForm_1">
//           <label>To Date:</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         <div className="RegisForm_1">
//           <label>Location:</label>
//           <input
//             type="text"
//             placeholder="Enter Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* 🔹 Main Report Grid */}
//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading...</p>
//       ) : reportData.length > 0 ? (
//         <div className="RegisFormcon_1">
//           <ReactGrid
//             columns={getColumns()}
//             RowData={reportData}
//             onRowClick={(row) => setSelectedIndent(row)} // click to show items
//           />
//         </div>
//       ) : (
//         <p style={{ textAlign: "center", marginTop: "10px" }}>No data found</p>
//       )}

//       {/* 🔹 Show Indented Item Details */}
//       {selectedIndent && selectedIndent.Items && (
//         <div className="RegisFormcon_1" style={{ marginTop: "20px" }}>
//           <h4>
//             Item Details for:{" "}
//             {selectedIndent.Invoice_No ||
//               selectedIndent.Issue_Invoice_No ||
//               selectedIndent.Receive_Invoice_No}
//           </h4>
//           <ReactGrid columns={itemColumns} RowData={selectedIndent.Items} />
//         </div>
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default IndentReports;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const IndentReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [reportType, setReportType] = useState("raise");
//   const [reportData, setReportData] = useState([]);
//   const [selectedIndent, setSelectedIndent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     if (!fromDate || !toDate) return;

//     setLoading(true);
//     let endpoint = "";

//     if (reportType === "raise") endpoint = "Inventory/IndentRaiseReport";
//     else if (reportType === "issue") endpoint = "Inventory/IndentIssueReport";
//     else if (reportType === "receive")
//       endpoint = "Inventory/IndentReceiveReport";

//     axios
//       .get(`${UrlLink}${endpoint}`, {
//         params: { FromDate: fromDate, ToDate: toDate, Location: location },
//       })
//       .then((res) => {
//         setReportData(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(() => setReportData([]))
//       .finally(() => setLoading(false));
//   }, [reportType, fromDate, toDate, location, UrlLink]);

//   // 🔹 Columns for main report
//   const getColumns = () => {
//     const commonColumns = [
//       {
//         key: "Date",
//         name: "Date",
//         renderCell: (params) =>
//           params.row.RequestDate ||
//           params.row.IssueDate ||
//           params.row.ReceiveDate ||
//           "-",
//       },
//       { key: "Status", name: "Status" },
//       {
//         key: "ViewItems",
//         name: "View Items",
//         renderCell: (params) => (
//           <button
//             className="cell_btn"
//             onClick={() => handleViewItems(params.row)}
//           >
//             👁️
//           </button>
//         ),
//       },
//     ];

//     if (reportType === "raise") {
//       return [
//         { key: "Invoice_No", name: "Indent No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "RaisedBy", name: "Raised By" },
//         { key: "RequestDate", name: "Date" },
//         { key: "Status", name: "Status" },
//         {
//           key: "ViewItems",
//           name: "View Items",
//           renderCell: (params) => (
//             <button
//               className="cell_btn"
//               onClick={() => handleViewItems(params.row)}
//             >
//               👁️
//             </button>
//           ),
//         },
//       ];
//     } else if (reportType === "issue") {
//       return [
//         { key: "Issue_Invoice_No", name: "Issue No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "IssuedBy", name: "Issued By" },
//         ...commonColumns,
//       ];
//     } else {
//       // For 'receive', use IssueFrom and ReceiveTo as in IndentRecieveList.jsx
//       return [
//         { key: "Receive_Invoice_No", name: "Receive No" },
//         {
//           key: "IssueFrom",
//           name: "From Location",
//           renderCell: (params) => params.row.IssueFrom || "-",
//         },
//         {
//           key: "ReceiveTo",
//           name: "To Location",
//           renderCell: (params) => params.row.ReceiveTo || "-",
//         },
//         { key: "ReceivedBy", name: "Received By" },
//         { key: "ReceiveDate", name: "Date" },
//         { key: "Status", name: "Status" },
//         {
//           key: "ViewItems",
//           name: "View Items",
//           renderCell: (params) => (
//             <button
//               className="cell_btn"
//               onClick={() => handleViewItems(params.row)}
//             >
//               👁️
//             </button>
//           ),
//         },
//       ];
//     }
//   };

//   // 🔹 Columns for item details
//   // Dynamically show only the relevant quantity column
//   let itemColumns = [
//     { key: "ItemCode", name: "Item Code" },
//     { key: "ItemName", name: "Item Name" },
//     { key: "ProductCategory", name: "Category" },
//     { key: "SubCategory", name: "Sub Category" },
//     { key: "PackType", name: "Pack Type" },
//     { key: "PackQuantity", name: "Pack Qty" },
//   ];
//   if (reportType === "raise") {
//     itemColumns.push({ key: "RaisedQuantity", name: "Raised Qty" });
//   } else if (reportType === "issue") {
//     itemColumns.push({ key: "IssueQuantity", name: "Issued Qty" });
//   } else if (reportType === "receive") {
//     itemColumns.push({ key: "ReceivedQuantity", name: "Received Qty" });
//   }
//   itemColumns.push({ key: "Status", name: "Status" });

//   // 🔹 Show indented product details
//   const handleViewItems = (row) => {
//     if (row?.Items && row.Items.length > 0) {
//       setSelectedIndent(row);
//     } else {
//       alert("No item details found for this indent.");
//     }
//   };

//   return (
//     <div className="Main_container_app">
//       <h3>Indent Reports</h3>

//       {/* 🔹 Filter Section */}
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Report Type:</label>
//           <select
//             value={reportType}
//             onChange={(e) => {
//               setReportType(e.target.value);
//               setSelectedIndent(null);
//             }}
//           >
//             <option value="raise">Indent Raise</option>
//             <option value="issue">Indent Issue</option>
//             <option value="receive">Indent Receive</option>
//           </select>
//         </div>

//         <div className="RegisForm_1">
//           <label>From Date:</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div className="RegisForm_1">
//           <label>To Date:</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         <div className="RegisForm_1">
//           <label>Location:</label>
//           <input
//             type="text"
//             placeholder="Enter Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* 🔹 Main Report */}
//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading...</p>
//       ) : reportData.length > 0 ? (
//         <div className="RegisFormcon_1">
//           <ReactGrid columns={getColumns()} RowData={reportData} />
//         </div>
//       ) : (
//         <p style={{ textAlign: "center", marginTop: "10px" }}>No data found</p>
//       )}

//       {/* 🔹 Item Details Section */}
//       {selectedIndent && selectedIndent.Items && (
//         <div className="RegisFormcon_1" style={{ marginTop: "20px" }}>
//           <h4>
//             Items for{" "}
//             {selectedIndent.Invoice_No ||
//               selectedIndent.Issue_Invoice_No ||
//               selectedIndent.Receive_Invoice_No}
//           </h4>
//           <ReactGrid columns={itemColumns} RowData={selectedIndent.Items} />
//         </div>
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default IndentReports;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
// import PrintIcon from "@mui/icons-material/Print";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const IndentReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [reportType, setReportType] = useState("raise");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [location, setLocation] = useState("");
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [expandedIndents, setExpandedIndents] = useState(new Set());

//   useEffect(() => {
//     if (!fromDate || !toDate) {
//       setReportData([]);
//       return;
//     }

//     setLoading(true);
//     let endpoint = "";

//     if (reportType === "raise") endpoint = "Inventory/IndentRaiseReport";
//     else if (reportType === "issue") endpoint = "Inventory/IndentIssueReport";
//     else if (reportType === "receive") endpoint = "Inventory/IndentReceiveReport";

//     axios
//       .get(`${UrlLink}${endpoint}`, {
//         params: { FromDate: fromDate, ToDate: toDate, Location: location },
//       })
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : [];
//         setReportData(data);
        
//         // Auto-expand all indents that have items
//         const newExpanded = new Set();
//         data.forEach(indent => {
//           const indentKey = getIndentKey(indent);
//           if (indent?.Items && indent.Items.length > 0) {
//             newExpanded.add(indentKey);
//           }
//         });
//         setExpandedIndents(newExpanded);
//       })
//       .catch(() => setReportData([]))
//       .finally(() => setLoading(false));
//   }, [reportType, fromDate, toDate, location, UrlLink]);

//   // 🔹 Columns for main report
//   const getColumns = () => {
//     if (reportType === "raise") {
//       return [
//         { key: "Invoice_No", name: "Indent No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "RaisedBy", name: "Raised By" },
//         { 
//           key: "RequestDate", 
//           name: "Date",
//           renderCell: (params) => {
//             const date = new Date(params.row.RequestDate);
//             return date.toLocaleDateString("en-GB");
//           }
//         },
//         { key: "Status", name: "Status" },
//         {
//           key: "ItemCount",
//           name: "Items Count",
//           renderCell: (params) => (
//             <span style={{ 
//               color: params.row.Items && params.row.Items.length > 0 ? "green" : "gray",
//               fontWeight: "bold"
//             }}>
//               {params.row.Items ? params.row.Items.length : 0}
//             </span>
//           ),
//         },
//       ];
//     } else if (reportType === "issue") {
//       return [
//         { key: "Issue_Invoice_No", name: "Issue No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "IssuedBy", name: "Issued By" },
//         { 
//           key: "IssueDate", 
//           name: "Date",
//           renderCell: (params) => {
//             const date = new Date(params.row.IssueDate);
//             return date.toLocaleDateString("en-GB");
//           }
//         },
//         { key: "Status", name: "Status" },
//         {
//           key: "ItemCount",
//           name: "Items Count",
//           renderCell: (params) => (
//             <span style={{ 
//               color: params.row.Items && params.row.Items.length > 0 ? "green" : "gray",
//               fontWeight: "bold"
//             }}>
//               {params.row.Items ? params.row.Items.length : 0}
//             </span>
//           ),
//         },
//       ];
//     } else {
//       return [
//         { key: "Receive_Invoice_No", name: "Receive No" },
//         { key: "IssueFrom", name: "From Location" },
//         { key: "ReceiveTo", name: "To Location" },
//         { key: "ReceivedBy", name: "Received By" },
//         { 
//           key: "ReceiveDate", 
//           name: "Date",
//           renderCell: (params) => {
//             const date = new Date(params.row.ReceiveDate);
//             return date.toLocaleDateString("en-GB");
//           }
//         },
//         { key: "Status", name: "Status" },
//         {
//           key: "ItemCount",
//           name: "Items Count",
//           renderCell: (params) => (
//             <span style={{ 
//               color: params.row.Items && params.row.Items.length > 0 ? "green" : "gray",
//               fontWeight: "bold"
//             }}>
//               {params.row.Items ? params.row.Items.length : 0}
//             </span>
//           ),
//         },
//       ];
//     }
//   };

//   // 🔹 Columns for item details
//   const itemColumns = [
//     { key: "ItemCode", name: "Item Code" },
//     { key: "ItemName", name: "Item Name" },
//     { key: "ProductCategory", name: "Category" },
//     { key: "SubCategory", name: "Sub Category" },
//     { key: "PackType", name: "Pack Type" },
//     { key: "PackQuantity", name: "Pack Qty" },
//     ...(reportType === "raise" ? [{ key: "RaisedQuantity", name: "Raised Qty" }] : []),
//     ...(reportType === "issue" ? [{ key: "IssueQuantity", name: "Issued Qty" }] : []),
//     ...(reportType === "receive" ? [{ key: "ReceivedQuantity", name: "Received Qty" }] : []),
//     { key: "SellablePrice", name: "Sellable Price", renderCell: (params) => (params.row.SellablePrice || 0).toFixed(2) },
//     // Add this new column for Total
//     { 
//       key: "Total", 
//       name: "Total", 
//       renderCell: (params) => {
//         const quantity = reportType === "raise" ? params.row.RaisedQuantity || 0 :
//                        reportType === "issue" ? params.row.IssueQuantity || 0 :
//                        params.row.ReceivedQuantity || 0;
//         const price = params.row.SellablePrice || 0;
//         return (quantity * price).toFixed(2);
//       }
//     },
//     { key: "Status", name: "Status" },
//   ];

//   // 🔹 Helper functions
//   const getReportTypeTitle = () => {
//     switch(reportType) {
//       case "raise": return "Indent Raise";
//       case "issue": return "Indent Issue";
//       case "receive": return "Indent Receive";
//       default: return "Indent Report";
//     }
//   };

//   const getIndentNumber = (indent) => {
//     switch(reportType) {
//       case "raise": return `Indent No: ${indent.Invoice_No}`;
//       case "issue": return `Issue No: ${indent.Issue_Invoice_No}`;
//       case "receive": return `Receive No: ${indent.Receive_Invoice_No}`;
//       default: return "Indent";
//     }
//   };

//   const getIndentKey = (indent) => {
//     return indent.Invoice_No || indent.Issue_Invoice_No || indent.Receive_Invoice_No;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB");
//   };

//   const toggleIndentExpansion = (indentKey) => {
//     const newExpanded = new Set(expandedIndents);
//     if (newExpanded.has(indentKey)) {
//       newExpanded.delete(indentKey);
//     } else {
//       newExpanded.add(indentKey);
//     }
//     setExpandedIndents(newExpanded);
//   };

//   // Calculate total amount for an indent
//   const calculateIndentTotal = (indent) => {
//     if (!indent.Items || indent.Items.length === 0) return 0;
    
//     return indent.Items.reduce((sum, item) => {
//       const quantity = reportType === "raise" ? item.RaisedQuantity || 0 :
//                      reportType === "issue" ? item.IssueQuantity || 0 :
//                      item.ReceivedQuantity || 0;
//       const price = item.SellablePrice || 0;
//       return sum + (quantity * price);
//     }, 0);
//   };

//   // 🔹 Enhanced Print Function
//   const handlePrint = () => {
//     if (!reportData || reportData.length === 0) {
//       alert("No data to print.");
//       return;
//     }

//     setIsPrinting(true);

//     let reportHTML = `
//       <div style="text-align: center; margin-bottom: 20px;">
//         <h1>Indent Report - ${getReportTypeTitle()}</h1>
//         <p><strong>Period:</strong> ${fromDate} to ${toDate}</p>
//         <p><strong>Generated on:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
//       </div>
//     `;

//     reportData.forEach((indent, index) => {
//       const totalAmount = calculateIndentTotal(indent);
      
//       reportHTML += `
//         <div class="indent-section" style="page-break-inside: avoid; border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
//           <h2>${getIndentNumber(indent)}</h2>
//           <p>
//             <strong>From Location:</strong> ${indent.RaisedFrom || indent.IssueFrom || "N/A"} | 
//             <strong>To Location:</strong> ${indent.RaisedTo || indent.ReceiveTo || "N/A"} | 
//             <strong>Date:</strong> ${formatDate(indent.RequestDate || indent.IssueDate || indent.ReceiveDate)} |
//             <strong>Status:</strong> ${indent.Status || "N/A"}
//           </p>
//           <p>
//             <strong>${reportType === "raise" ? "Raised By" : reportType === "issue" ? "Issued By" : "Received By"}:</strong> 
//             ${indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"}
//           </p>
          
//           <h3>Item Details</h3>
//           ${
//             indent.Items && indent.Items.length > 0
//               ? `
//                 <table style="width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
//                   <thead>
//                     <tr style="background-color: #f2f2f2;">
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Item Code</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Item Name</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Category</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Pack Type</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Pack Qty</th>
//                       ${
//                         reportType === "raise" 
//                           ? '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Raised Qty</th>' 
//                           : reportType === "issue" 
//                           ? '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Issued Qty</th>' 
//                           : '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Received Qty</th>'
//                       }
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Sellable Price</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Total</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${indent.Items.map((item) => {
//                       const quantity = reportType === "raise" ? item.RaisedQuantity || 0 :
//                                      reportType === "issue" ? item.IssueQuantity || 0 :
//                                      item.ReceivedQuantity || 0;
//                       const price = item.SellablePrice || 0;
//                       const total = quantity * price;
                      
//                       return `
//                         <tr>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.ItemCode || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.ItemName || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.ProductCategory || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.PackType || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.PackQuantity || 0}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${quantity}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${price.toFixed(2)}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${total.toFixed(2)}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.Status || ""}</td>
//                         </tr>
//                       `;
//                     }).join("")}
//                   </tbody>
//                 </table>
//                 <p style="text-align: right; font-weight: bold; margin-top: 10px;">
//                   Total Items: ${indent.Items.length} | Total Amount: ₹${totalAmount.toFixed(2)}
//                 </p>
//               `
//               : "<p>No items found for this indent.</p>"
//           }
//         </div>
//       `;
//     });

//     const newWin = window.open("", "_blank");
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>Indent Report - ${getReportTypeTitle()}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             table { width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
//             th { background-color: #f2f2f2; }
//             h1, h2, h3, p { margin: 8px 0; }
//             .indent-section { 
//               page-break-inside: avoid; 
//               border: 1px solid #ccc;
//               border-radius: 5px;
//               padding: 15px;
//               margin-bottom: 20px;
//             }
//             @media print {
//               .indent-section { 
//                 page-break-inside: avoid; 
//               }
//             }
//           </style>
//         </head>
//         <body>${reportHTML}</body>
//       </html>`);
//     newWin.document.close();
    
//     setTimeout(() => {
//       newWin.focus();
//       newWin.print();
//       newWin.close();
//       setIsPrinting(false);
//     }, 500);
//   };

//   // 🔹 Excel Export Function
//   const handleExportExcel = () => {
//     if (!reportData || reportData.length === 0) {
//       alert("No data to export.");
//       return;
//     }

//     const wb = XLSX.utils.book_new();
//     const ws_data = [];

//     // Define headers for the item table
//     const itemHeaders = [
//       "S.No",
//       "Item Code",
//       "Item Name",
//       "Category",
//       "Pack Type",
//       "Pack Qty",
//       reportType === "raise" ? "Raised Qty" : reportType === "issue" ? "Issued Qty" : "Received Qty",
//       "Sellable Price",
//       "Total",
//       "Status"
//     ];

//     reportData.forEach((indent) => {
//       const totalAmount = calculateIndentTotal(indent);
      
//       // Add space before each new indent section
//       ws_data.push([]);

//       // Add Indent Header information
//       ws_data.push([getReportTypeTitle() + " Number:", getIndentNumber(indent).split(": ")[1]]);
//       ws_data.push([
//         "From Location:",
//         indent.RaisedFrom || indent.IssueFrom || "N/A",
//         "",
//         "To Location:",
//         indent.RaisedTo || indent.ReceiveTo || "N/A"
//       ]);
//       ws_data.push([
//         "Date:",
//         formatDate(indent.RequestDate || indent.IssueDate || indent.ReceiveDate),
//         "",
//         "Status:",
//         indent.Status || "N/A"
//       ]);
//       ws_data.push([
//         `${reportType === "raise" ? "Raised By" : reportType === "issue" ? "Issued By" : "Received By"}:`,
//         indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"
//       ]);

//       // Add space before the item table
//       ws_data.push([]);

//       // Add the item table headers
//       ws_data.push(itemHeaders);

//       // Add item data rows
//       if (indent.Items && indent.Items.length > 0) {
//         indent.Items.forEach((item, index) => {
//           const quantity = reportType === "raise" ? item.RaisedQuantity || 0 :
//                          reportType === "issue" ? item.IssueQuantity || 0 :
//                          item.ReceivedQuantity || 0;
//           const price = item.SellablePrice || 0;
//           const total = quantity * price;
          
//           ws_data.push([
//             index + 1,
//             item.ItemCode || "",
//             item.ItemName || "",
//             item.ProductCategory || "",
//             item.PackType || "",
//             item.PackQuantity || 0,
//             quantity,
//             price,
//             total,
//             item.Status || ""
//           ]);
//         });
        
//         // Add total items count and amount
//         ws_data.push([]);
//         ws_data.push(["Total Items:", indent.Items.length, "", "", "", "", "", "Total Amount:", totalAmount]);
//       } else {
//         ws_data.push(["No items found for this indent."]);
//       }
      
//       // Add separator between indents
//       ws_data.push([]);
//       ws_data.push(["=".repeat(100)]);
//     });

//     const ws = XLSX.utils.aoa_to_sheet(ws_data);

//     // Auto-fit column widths
//     const columnWidths = [
//       { wch: 8 },
//       { wch: 15 },
//       { wch: 30 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 10 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//     ];
//     ws["!cols"] = columnWidths;

//     XLSX.utils.book_append_sheet(wb, ws, "Indent Report");
//     XLSX.writeFile(wb, `Indent_Report_${reportType}_${fromDate}_to_${toDate}.xlsx`);
//   };

//   // 🔹 Render item details for each indent
//   const renderItemDetails = (indent) => {
//     const indentKey = getIndentKey(indent);
//     const isExpanded = expandedIndents.has(indentKey);
//     const totalAmount = calculateIndentTotal(indent);

//     if (!indent.Items || indent.Items.length === 0) {
//       return (
//         <div style={{ padding: "10px", backgroundColor: "#f9f9f9", marginTop: "5px" }}>
//           <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
//             No items found for this indent
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div style={{ marginTop: "10px" }}>
//         <div 
//           style={{ 
//             padding: "10px", 
//             backgroundColor: "#f0f8ff", 
//             border: "1px solid #d1e7ff",
//             borderRadius: "4px",
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center"
//           }}
//           onClick={() => toggleIndentExpansion(indentKey)}
//         >
//           <strong>Item Details ({indent.Items.length} items) - Total: ₹{totalAmount.toFixed(2)}</strong>
//           <span style={{ fontWeight: "bold" }}>
//             {isExpanded ? "▲" : "▼"}
//           </span>
//         </div>
        
//         {isExpanded && (
//           <div style={{ 
//             marginTop: "5px", 
//             border: "1px solid #e0e0e0", 
//             borderRadius: "4px",
//             overflow: "hidden"
//           }}>
//             <ReactGrid 
//               columns={itemColumns} 
//               RowData={indent.Items}
//               style={{ fontSize: "12px" }}
//             />
//             {/* Add total amount display */}
//             <div style={{
//               padding: "10px",
//               backgroundColor: "#f8f9fa",
//               borderTop: "2px solid #dee2e6",
//               textAlign: "right",
//               fontWeight: "bold",
//               fontSize: "14px"
//             }}>
//               Total Amount: ₹{totalAmount.toFixed(2)}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="Main_container_app">
//       <h3>Indent Reports</h3>
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Report Type:</label>
//           <select 
//             value={reportType} 
//             onChange={(e) => { 
//               setReportType(e.target.value); 
//               setExpandedIndents(new Set());
//             }}
//           >
//             <option value="raise">Indent Raise</option>
//             <option value="issue">Indent Issue</option>
//             <option value="receive">Indent Receive</option>
//           </select>
//         </div>
//         <div className="RegisForm_1">
//           <label>From Date:</label>
//           <input 
//             type="date" 
//             value={fromDate} 
//             onChange={(e) => setFromDate(e.target.value)} 
//           />
//         </div>
//         <div className="RegisForm_1">
//           <label>To Date:</label>
//           <input 
//             type="date" 
//             value={toDate} 
//             onChange={(e) => setToDate(e.target.value)} 
//           />
//         </div>
//         <div className="RegisForm_1">
//           <label>Location:</label>
//           <input 
//             type="text" 
//             placeholder="Enter Location" 
//             value={location} 
//             onChange={(e) => setLocation(e.target.value)} 
//           />
//         </div>
        
//         <div className="RegisForm_1" style={{ marginLeft: '1rem', alignItems: 'center' }}>
//           <button 
//             className="RegisterForm_1_btns" 
//             onClick={handlePrint} 
//             title="Print Report" 
//             disabled={loading || reportData.length === 0 || isPrinting}
//           >
//             {isPrinting ? "Preparing..." : <PrintIcon />}
//           </button>
//           <button 
//             className="RegisterForm_1_btns" 
//             onClick={handleExportExcel} 
//             title="Download Excel" 
//             disabled={loading || reportData.length === 0}
//           >
//             <BrowserUpdatedIcon />
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading...</p>
//       ) : reportData.length > 0 ? (
//         <div style={{ marginTop: '1rem' }}>
//           {reportData.map((indent, index) => {
//             const totalAmount = calculateIndentTotal(indent);
            
//             return (
//               <div 
//                 key={getIndentKey(indent)} 
//                 style={{ 
//                   marginBottom: "20px", 
//                   border: "1px solid #e0e0e0", 
//                   borderRadius: "8px",
//                   padding: "15px",
//                   backgroundColor: "#fff",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//                 }}
//               >
//                 {/* Main Indent Info */}
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <div style={{ flex: 1 }}>
//                     <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
//                       {getIndentNumber(indent)}
//                     </h4>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
//                       <div>
//                         <strong>From:</strong> {indent.RaisedFrom || indent.IssueFrom || "N/A"}
//                       </div>
//                       <div>
//                         <strong>To:</strong> {indent.RaisedTo || indent.ReceiveTo || "N/A"}
//                       </div>
//                       <div>
//                         <strong>Date:</strong> {formatDate(indent.RequestDate || indent.IssueDate || indent.ReceiveDate)}
//                       </div>
//                       <div>
//                         <strong>Status:</strong> {indent.Status || "N/A"}
//                       </div>
//                       <div style={{ gridColumn: "1 / -1" }}>
//                         <strong>
//                           {reportType === "raise" ? "Raised By" : reportType === "issue" ? "Issued By" : "Received By"}:
//                         </strong> {indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"}
//                       </div>
//                     </div>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <div style={{ 
//                       color: indent.Items && indent.Items.length > 0 ? "green" : "gray",
//                       fontWeight: "bold",
//                       fontSize: "16px",
//                       marginBottom: "5px"
//                     }}>
//                       {indent.Items ? indent.Items.length : 0} Items
//                     </div>
//                     <div style={{ 
//                       color: "#d32f2f",
//                       fontWeight: "bold",
//                       fontSize: "14px"
//                     }}>
//                       Total: ₹{totalAmount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Item Details - Directly Displayed */}
//                 {renderItemDetails(indent)}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p style={{ textAlign: "center", marginTop: "10px" }}>
//           {fromDate && toDate ? "No data found for the selected criteria." : "Please select a date range to generate a report."}
//         </p>
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default IndentReports;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
// import PrintIcon from "@mui/icons-material/Print";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const IndentReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [reportType, setReportType] = useState("raise");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [location, setLocation] = useState("");
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [expandedIndents, setExpandedIndents] = useState(new Set());

//   useEffect(() => {
//     if (!fromDate || !toDate) {
//       setReportData([]);
//       return;
//     }

//     setLoading(true);
//     let endpoint = "";

//     if (reportType === "raise") endpoint = "Inventory/IndentRaiseReport";
//     else if (reportType === "issue") endpoint = "Inventory/IndentIssueReport";
//     else if (reportType === "receive") endpoint = "Inventory/IndentReceiveReport";

//     axios
//       .get(`${UrlLink}${endpoint}`, {
//         params: { FromDate: fromDate, ToDate: toDate, Location: location },
//       })
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : [];
//         setReportData(data);
        
//         // Auto-expand all indents that have items
//         const newExpanded = new Set();
//         data.forEach(indent => {
//           const indentKey = getIndentKey(indent);
//           if (indent?.Items && indent.Items.length > 0) {
//             newExpanded.add(indentKey);
//           }
//         });
//         setExpandedIndents(newExpanded);
//       })
//       .catch(() => setReportData([]))
//       .finally(() => setLoading(false));
//   }, [reportType, fromDate, toDate, location, UrlLink]);

//   // 🔹 Columns for main report
//   const getColumns = () => {
//     if (reportType === "raise") {
//       return [
//         { key: "Invoice_No", name: "Indent No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "RaisedBy", name: "Raised By" },
//         { 
//           key: "RequestDate", 
//           name: "Date",
//           renderCell: (params) => {
//             const date = new Date(params.row.RequestDate);
//             return date.toLocaleDateString("en-GB");
//           }
//         },
//         { key: "Status", name: "Status" },
//         {
//           key: "ItemCount",
//           name: "Items Count",
//           renderCell: (params) => (
//             <span style={{ 
//               color: params.row.Items && params.row.Items.length > 0 ? "green" : "gray",
//               fontWeight: "bold"
//             }}>
//               {params.row.Items ? params.row.Items.length : 0}
//             </span>
//           ),
//         },
//       ];
//     } else if (reportType === "issue") {
//       return [
//         { key: "Issue_Invoice_No", name: "Issue No" },
//         { key: "RaisedFrom", name: "From Location" },
//         { key: "RaisedTo", name: "To Location" },
//         { key: "IssuedBy", name: "Issued By" },
//         { 
//           key: "IssueDate", 
//           name: "Date",
//           renderCell: (params) => {
//             const date = new Date(params.row.IssueDate);
//             return date.toLocaleDateString("en-GB");
//           }
//         },
//         { key: "Status", name: "Status" },
//         {
//           key: "ItemCount",
//           name: "Items Count",
//           renderCell: (params) => (
//             <span style={{ 
//               color: params.row.Items && params.row.Items.length > 0 ? "green" : "gray",
//               fontWeight: "bold"
//             }}>
//               {params.row.Items ? params.row.Items.length : 0}
//             </span>
//           ),
//         },
//       ];
//     } else {
//       return [
//         { key: "Receive_Invoice_No", name: "Receive No" },
//         { key: "IssueFrom", name: "From Location" },
//         { key: "ReceiveTo", name: "To Location" },
//         { key: "ReceivedBy", name: "Received By" },
//         { 
//           key: "ReceiveDate", 
//           name: "Date",
//           renderCell: (params) => {
//             const date = new Date(params.row.ReceiveDate);
//             return date.toLocaleDateString("en-GB");
//           }
//         },
//         { key: "Status", name: "Status" },
//         {
//           key: "ItemCount",
//           name: "Items Count",
//           renderCell: (params) => (
//             <span style={{ 
//               color: params.row.Items && params.row.Items.length > 0 ? "green" : "gray",
//               fontWeight: "bold"
//             }}>
//               {params.row.Items ? params.row.Items.length : 0}
//             </span>
//           ),
//         },
//       ];
//     }
//   };

//   // 🔹 Columns for item details
//   const itemColumns = [
//     { key: "ItemCode", name: "Item Code" },
//     { key: "ItemName", name: "Item Name" },
//     { key: "ProductCategory", name: "Category" },
//     { key: "SubCategory", name: "Sub Category" },
//     { key: "PackType", name: "Pack Type" },
//     { key: "PackQuantity", name: "Pack Qty" },
//     ...(reportType === "raise" ? [{ key: "RaisedQuantity", name: "Raised Qty" }] : []),
//     ...(reportType === "issue" ? [{ key: "IssueQuantity", name: "Issued Qty" }] : []),
//     ...(reportType === "receive" ? [{ key: "ReceivedQuantity", name: "Received Qty" }] : []),
//     { key: "SellablePrice", name: "Sellable Price", renderCell: (params) => (params.row.SellablePrice || 0).toFixed(2) },
//     // Add this new column for Total
//     { 
//       key: "Total", 
//       name: "Total", 
//       renderCell: (params) => {
//         const quantity = reportType === "raise" ? params.row.RaisedQuantity || 0 :
//                        reportType === "issue" ? params.row.IssueQuantity || 0 :
//                        params.row.ReceivedQuantity || 0;
//         const price = params.row.SellablePrice || 0;
//         return (quantity * price).toFixed(2);
//       }
//     },
//     { key: "Status", name: "Status" },
//   ];

//   // 🔹 Helper functions
//   const getReportTypeTitle = () => {
//     switch(reportType) {
//       case "raise": return "Indent Raise";
//       case "issue": return "Indent Issue";
//       case "receive": return "Indent Receive";
//       default: return "Indent Report";
//     }
//   };

//   const getIndentNumber = (indent) => {
//     switch(reportType) {
//       case "raise": return `Indent No: ${indent.Invoice_No}`;
//       case "issue": return `Issue No: ${indent.Issue_Invoice_No}`;
//       case "receive": return `Receive No: ${indent.Receive_Invoice_No}`;
//       default: return "Indent";
//     }
//   };

//   const getIndentKey = (indent) => {
//     return indent.Invoice_No || indent.Issue_Invoice_No || indent.Receive_Invoice_No;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB");
//   };

//   const toggleIndentExpansion = (indentKey) => {
//     const newExpanded = new Set(expandedIndents);
//     if (newExpanded.has(indentKey)) {
//       newExpanded.delete(indentKey);
//     } else {
//       newExpanded.add(indentKey);
//     }
//     setExpandedIndents(newExpanded);
//   };

//   // Calculate total amount for an indent
//   const calculateIndentTotal = (indent) => {
//     if (!indent.Items || indent.Items.length === 0) return 0;
    
//     return indent.Items.reduce((sum, item) => {
//       const quantity = reportType === "raise" ? item.RaisedQuantity || 0 :
//                      reportType === "issue" ? item.IssueQuantity || 0 :
//                      item.ReceivedQuantity || 0;
//       const price = item.SellablePrice || 0;
//       return sum + (quantity * price);
//     }, 0);
//   };

//   // 🔹 Enhanced Print Function
//   const handlePrint = () => {
//     if (!reportData || reportData.length === 0) {
//       alert("No data to print.");
//       return;
//     }

//     setIsPrinting(true);

//     let reportHTML = `
//       <div style="text-align: center; margin-bottom: 20px;">
//         <h1>Indent Report - ${getReportTypeTitle()}</h1>
//         <p><strong>Period:</strong> ${fromDate} to ${toDate}</p>
//         <p><strong>Generated on:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
//       </div>
//     `;

//     reportData.forEach((indent, index) => {
//       const totalAmount = calculateIndentTotal(indent);
      
//       reportHTML += `
//         <div class="indent-section" style="page-break-inside: avoid; border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
//           <h2>${getIndentNumber(indent)}</h2>
//           <p>
//             <strong>From Location:</strong> ${indent.RaisedFrom || indent.IssueFrom || "N/A"} | 
//             <strong>To Location:</strong> ${indent.RaisedTo || indent.ReceiveTo || "N/A"} | 
//             <strong>Date:</strong> ${formatDate(indent.RequestDate || indent.IssueDate || indent.ReceiveDate)} |
//             <strong>Status:</strong> ${indent.Status || "N/A"}
//           </p>
//           <p>
//             <strong>${reportType === "raise" ? "Raised By" : reportType === "issue" ? "Issued By" : "Received By"}:</strong> 
//             ${indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"}
//           </p>
          
//           <h3>Item Details</h3>
//           ${
//             indent.Items && indent.Items.length > 0
//               ? `
//                 <table style="width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
//                   <thead>
//                     <tr style="background-color: #f2f2f2;">
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Item Code</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Item Name</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Category</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Pack Type</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Pack Qty</th>
//                       ${
//                         reportType === "raise" 
//                           ? '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Raised Qty</th>' 
//                           : reportType === "issue" 
//                           ? '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Issued Qty</th>' 
//                           : '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Received Qty</th>'
//                       }
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Sellable Price</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Total</th>
//                       <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${indent.Items.map((item) => {
//                       const quantity = reportType === "raise" ? item.RaisedQuantity || 0 :
//                                      reportType === "issue" ? item.IssueQuantity || 0 :
//                                      item.ReceivedQuantity || 0;
//                       const price = item.SellablePrice || 0;
//                       const total = quantity * price;
                      
//                       return `
//                         <tr>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.ItemCode || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.ItemName || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.ProductCategory || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.PackType || ""}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.PackQuantity || 0}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${quantity}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${price.toFixed(2)}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${total.toFixed(2)}</td>
//                           <td style="border: 1px solid #ccc; padding: 6px;">${item.Status || ""}</td>
//                         </tr>
//                       `;
//                     }).join("")}
//                   </tbody>
//                 </table>
//                 <p style="text-align: right; font-weight: bold; margin-top: 10px;">
//                   Total Items: ${indent.Items.length} | Total Amount: ₹${totalAmount.toFixed(2)}
//                 </p>
//               `
//               : "<p>No items found for this indent.</p>"
//           }
//         </div>
//       `;
//     });

//     const newWin = window.open("", "_blank");
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>Indent Report - ${getReportTypeTitle()}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             table { width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
//             th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
//             th { background-color: #f2f2f2; }
//             h1, h2, h3, p { margin: 8px 0; }
//             .indent-section { 
//               page-break-inside: avoid; 
//               border: 1px solid #ccc;
//               border-radius: 5px;
//               padding: 15px;
//               margin-bottom: 20px;
//             }
//             @media print {
//               .indent-section { 
//                 page-break-inside: avoid; 
//               }
//             }
//           </style>
//         </head>
//         <body>${reportHTML}</body>
//       </html>`);
//     newWin.document.close();
    
//     setTimeout(() => {
//       newWin.focus();
//       newWin.print();
//       newWin.close();
//       setIsPrinting(false);
//     }, 500);
//   };

//   // 🔹 Excel Export Function
//   const handleExportExcel = () => {
//     if (!reportData || reportData.length === 0) {
//       alert("No data to export.");
//       return;
//     }

//     const wb = XLSX.utils.book_new();
//     const ws_data = [];

//     // Define headers for the item table
//     const itemHeaders = [
//       "S.No",
//       "Item Code",
//       "Item Name",
//       "Category",
//       "Pack Type",
//       "Pack Qty",
//       reportType === "raise" ? "Raised Qty" : reportType === "issue" ? "Issued Qty" : "Received Qty",
//       "Sellable Price",
//       "Total",
//       "Status"
//     ];

//     reportData.forEach((indent) => {
//       const totalAmount = calculateIndentTotal(indent);
      
//       // Add space before each new indent section
//       ws_data.push([]);

//       // Add Indent Header information
//       ws_data.push([getReportTypeTitle() + " Number:", getIndentNumber(indent).split(": ")[1]]);
//       ws_data.push([
//         "From Location:",
//         indent.RaisedFrom || indent.IssueFrom || "N/A",
//         "",
//         "To Location:",
//         indent.RaisedTo || indent.ReceiveTo || "N/A"
//       ]);
//       ws_data.push([
//         "Date:",
//         formatDate(indent.RequestDate || indent.IssueDate || indent.ReceiveDate),
//         "",
//         "Status:",
//         indent.Status || "N/A"
//       ]);
//       ws_data.push([
//         `${reportType === "raise" ? "Raised By" : reportType === "issue" ? "Issued By" : "Received By"}:`,
//         indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"
//       ]);

//       // Add space before the item table
//       ws_data.push([]);

//       // Add the item table headers
//       ws_data.push(itemHeaders);

//       // Add item data rows
//       if (indent.Items && indent.Items.length > 0) {
//         indent.Items.forEach((item, index) => {
//           const quantity = reportType === "raise" ? item.RaisedQuantity || 0 :
//                          reportType === "issue" ? item.IssueQuantity || 0 :
//                          item.ReceivedQuantity || 0;
//           const price = item.SellablePrice || 0;
//           const total = quantity * price;
          
//           ws_data.push([
//             index + 1,
//             item.ItemCode || "",
//             item.ItemName || "",
//             item.ProductCategory || "",
//             item.PackType || "",
//             item.PackQuantity || 0,
//             quantity,
//             price,
//             total,
//             item.Status || ""
//           ]);
//         });
        
//         // Add total items count and amount
//         ws_data.push([]);
//         ws_data.push(["Total Items:", indent.Items.length, "", "", "", "", "", "Total Amount:", totalAmount]);
//       } else {
//         ws_data.push(["No items found for this indent."]);
//       }
      
//       // Add separator between indents
//       ws_data.push([]);
//       ws_data.push(["=".repeat(100)]);
//     });

//     const ws = XLSX.utils.aoa_to_sheet(ws_data);

//     // Auto-fit column widths
//     const columnWidths = [
//       { wch: 8 },
//       { wch: 15 },
//       { wch: 30 },
//       { wch: 20 },
//       { wch: 15 },
//       { wch: 10 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//       { wch: 15 },
//     ];
//     ws["!cols"] = columnWidths;

//     XLSX.utils.book_append_sheet(wb, ws, "Indent Report");
//     XLSX.writeFile(wb, `Indent_Report_${reportType}_${fromDate}_to_${toDate}.xlsx`);
//   };

//   // 🔹 Render item details for each indent
//   const renderItemDetails = (indent) => {
//     const indentKey = getIndentKey(indent);
//     const isExpanded = expandedIndents.has(indentKey);
//     const totalAmount = calculateIndentTotal(indent);

//     if (!indent.Items || indent.Items.length === 0) {
//       return (
//         <div style={{ padding: "10px", backgroundColor: "#f9f9f9", marginTop: "5px" }}>
//           <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
//             No items found for this indent
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div style={{ marginTop: "10px" }}>
//         <div 
//           style={{ 
//             padding: "10px", 
//             backgroundColor: "#f0f8ff", 
//             border: "1px solid #d1e7ff",
//             borderRadius: "4px",
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center"
//           }}
//           onClick={() => toggleIndentExpansion(indentKey)}
//         >
//           <strong>Item Details ({indent.Items.length} items) - Total: ₹{totalAmount.toFixed(2)}</strong>
//           <span style={{ fontWeight: "bold" }}>
//             {isExpanded ? "▲" : "▼"}
//           </span>
//         </div>
        
//         {isExpanded && (
//           <div style={{ 
//             marginTop: "5px", 
//             border: "1px solid #e0e0e0", 
//             borderRadius: "4px",
//             overflow: "hidden"
//           }}>
//             <ReactGrid 
//               columns={itemColumns} 
//               RowData={indent.Items}
//               style={{ fontSize: "12px" }}
//             />
//             {/* Add total amount display */}
//             <div style={{
//               padding: "10px",
//               backgroundColor: "#f8f9fa",
//               borderTop: "2px solid #dee2e6",
//               textAlign: "right",
//               fontWeight: "bold",
//               fontSize: "14px"
//             }}>
//               Total Amount: ₹{totalAmount.toFixed(2)}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="Main_container_app">
//       <h3>Indent Reports</h3>
//       <div className="RegisFormcon_1">
//         <div className="RegisForm_1">
//           <label>Report Type:</label>
//           <select 
//             value={reportType} 
//             onChange={(e) => { 
//               setReportType(e.target.value); 
//               setExpandedIndents(new Set());
//             }}
//           >
//             <option value="raise">Indent Raise</option>
//             <option value="issue">Indent Issue</option>
//             <option value="receive">Indent Receive</option>
//           </select>
//         </div>
//         <div className="RegisForm_1">
//           <label>From Date:</label>
//           <input 
//             type="date" 
//             value={fromDate} 
//             onChange={(e) => setFromDate(e.target.value)} 
//           />
//         </div>
//         <div className="RegisForm_1">
//           <label>To Date:</label>
//           <input 
//             type="date" 
//             value={toDate} 
//             onChange={(e) => setToDate(e.target.value)} 
//           />
//         </div>
//         <div className="RegisForm_1">
//           <label>Location:</label>
//           <input 
//             type="text" 
//             placeholder="Enter Location" 
//             value={location} 
//             onChange={(e) => setLocation(e.target.value)} 
//           />
//         </div>
        
//         <div className="RegisForm_1" style={{ marginLeft: '1rem', alignItems: 'center' }}>
//           <button 
//             className="RegisterForm_1_btns" 
//             onClick={handlePrint} 
//             title="Print Report" 
//             disabled={loading || reportData.length === 0 || isPrinting}
//           >
//             {isPrinting ? "Preparing..." : <PrintIcon />}
//           </button>
//           <button 
//             className="RegisterForm_1_btns" 
//             onClick={handleExportExcel} 
//             title="Download Excel" 
//             disabled={loading || reportData.length === 0}
//           >
//             <BrowserUpdatedIcon />
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <p style={{ textAlign: "center" }}>Loading...</p>
//       ) : reportData.length > 0 ? (
//         <div style={{ marginTop: '1rem' }}>
//           {reportData.map((indent, index) => {
//             const totalAmount = calculateIndentTotal(indent);
            
//             return (
//               <div 
//                 key={getIndentKey(indent)} 
//                 style={{ 
//                   marginBottom: "20px", 
//                   border: "1px solid #e0e0e0", 
//                   borderRadius: "8px",
//                   padding: "15px",
//                   backgroundColor: "#fff",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//                 }}
//               >
//                 {/* Main Indent Info */}
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <div style={{ flex: 1 }}>
//                     <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
//                       {getIndentNumber(indent)}
//                     </h4>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
//                       <div>
//                         <strong>From:</strong> {indent.RaisedFrom || indent.IssueFrom || "N/A"}
//                       </div>
//                       <div>
//                         <strong>To:</strong> {indent.RaisedTo || indent.ReceiveTo || "N/A"}
//                       </div>
//                       <div>
//                         <strong>Date:</strong> {formatDate(indent.RequestDate || indent.IssueDate || indent.ReceiveDate)}
//                       </div>
//                       <div>
//                         <strong>Status:</strong> {indent.Status || "N/A"}
//                       </div>
//                       <div style={{ gridColumn: "1 / -1" }}>
//                         <strong>
//                           {reportType === "raise" ? "Raised By" : reportType === "issue" ? "Issued By" : "Received By"}:
//                         </strong> {indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"}
//                       </div>
//                     </div>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <div style={{ 
//                       color: indent.Items && indent.Items.length > 0 ? "green" : "gray",
//                       fontWeight: "bold",
//                       fontSize: "16px",
//                       marginBottom: "5px"
//                     }}>
//                       {indent.Items ? indent.Items.length : 0} Items
//                     </div>
//                     <div style={{ 
//                       color: "#d32f2f",
//                       fontWeight: "bold",
//                       fontSize: "14px"
//                     }}>
//                       Total: ₹{totalAmount.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Item Details - Directly Displayed */}
//                 {renderItemDetails(indent)}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p style={{ textAlign: "center", marginTop: "10px" }}>
//           {fromDate && toDate ? "No data found for the selected criteria." : "Please select a date range to generate a report."}
//         </p>
//       )}

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </div>
//   );
// };

// export default IndentReports;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import PrintIcon from "@mui/icons-material/Print";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

const IndentReports = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [reportType, setReportType] = useState("raise");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [location, setLocation] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [expandedIndents, setExpandedIndents] = useState(new Set());

  useEffect(() => {
    if (!fromDate || !toDate) {
      setReportData([]);
      return;
    }

    setLoading(true);
    let endpoint = "";

    if (reportType === "raise") endpoint = "Inventory/IndentRaiseReport";
    else if (reportType === "issue") endpoint = "Inventory/IndentIssueReport";
    else if (reportType === "receive")
      endpoint = "Inventory/IndentReceiveReport";

    axios
      .get(`${UrlLink}${endpoint}`, {
        params: { FromDate: fromDate, ToDate: toDate, Location: location },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setReportData(data);

        // Auto-expand all indents that have items (initial fill). Further expansion
        // will be handled by filteredReportData effect so search respects expansion.
        const newExpanded = new Set();
        data.forEach((indent) => {
          const indentKey = getIndentKey(indent);
          if (indent?.Items && indent.Items.length > 0) {
            newExpanded.add(indentKey);
          }
        });
        setExpandedIndents(newExpanded);
      })
      .catch(() => setReportData([]))
      .finally(() => setLoading(false));
  }, [reportType, fromDate, toDate, location, UrlLink]);

  // 🔹 Helper functions (moved before they're used)
  const getIndentKey = (indent) => {
    return (
      indent.Invoice_No || indent.Issue_Invoice_No || indent.Receive_Invoice_No
    );
  };

  // Helper to detect whether an item is GRN-related.
  // Assumptions: an item is considered 'GRN-related' if it has a ReceivedQuantity > 0
  // or contains common GRN-identifying fields such as GRNNo, GRN_No, GrnNo, etc.
  const isGrnItem = (item) => {
    if (!item) return false;
    try {
      const qty = Number(
        item.ReceivedQuantity || item.ReceivedQty || item.Received || 0
      );
      if (!isNaN(qty) && qty > 0) return true;

      const keys = [
        "GRNNo",
        "GRN_No",
        "GrnNo",
        "Grn_No",
        "GRN",
        "Grn",
        "GRN_Number",
        "GRNNumber",
        "GrnNumber",
        "GrnRef",
      ];

      return keys.some((k) => !!item[k]);
    } catch (e) {
      return false;
    }
  };

  // Compute filtered and sorted data based on itemSearch. Items that are GRN-related
  // will be ordered first within an indent and indents with GRN-matching items come first.
  const filteredReportData = React.useMemo(() => {
    const search = (itemSearch || "").trim().toLowerCase();
    console.log("Search term:", search); // Debug log
    const data = (Array.isArray(reportData) ? reportData : []).map((indent) => {
      const items = Array.isArray(indent.Items) ? indent.Items.slice() : [];

      // Filter by item name or item code when search present
      const filteredItems = search
        ? items.filter((item) => {
            const name = (item.ItemName || "").toString().toLowerCase();
            const code = (item.ItemCode || "").toString().toLowerCase();
            const matches = name.includes(search) || code.includes(search);
            if (matches)
              console.log("Found match:", item.ItemName, item.ItemCode); // Debug log
            return matches;
          })
        : items;

      // Sort items so GRN-related items come first
      filteredItems.sort((a, b) => {
        const aGrn = isGrnItem(a) ? 1 : 0;
        const bGrn = isGrnItem(b) ? 1 : 0;
        return bGrn - aGrn;
      });

      const hasGrnMatch = filteredItems.some((it) => isGrnItem(it));

      return { ...indent, Items: filteredItems, _hasGrnMatch: hasGrnMatch };
    });

    // If searching, remove indents with zero matching items
    let final = search
      ? data.filter((d) => d.Items && d.Items.length > 0)
      : data;

    // Sort indents so those with GRN matches come first
    final.sort((a, b) => {
      const aG = a._hasGrnMatch ? 1 : 0;
      const bG = b._hasGrnMatch ? 1 : 0;
      return bG - aG;
    });

    console.log("Filtered data:", final.length, "indents"); // Debug log
    return final;
  }, [reportData, itemSearch]);

  // When filteredReportData changes (for example after search), auto-expand indents
  // that have items so the user sees the matching items immediately.
  useEffect(() => {
    const newExpanded = new Set();
    filteredReportData.forEach((indent) => {
      const key = getIndentKey(indent);
      if (indent?.Items && indent.Items.length > 0) newExpanded.add(key);
    });
    setExpandedIndents(newExpanded);
  }, [filteredReportData]);

  // 🔹 Columns for main report
  const getColumns = () => {
    if (reportType === "raise") {
      return [
        { key: "Invoice_No", name: "Indent No" },
        { key: "RaisedFrom", name: "From Location" },
        { key: "RaisedTo", name: "To Location" },
        { key: "RaisedBy", name: "Raised By" },
        {
          key: "RequestDate",
          name: "Date",
          renderCell: (params) => {
            const date = new Date(params.row.RequestDate);
            return date.toLocaleDateString("en-GB");
          },
        },
        { key: "Status", name: "Status" },
        {
          key: "ItemCount",
          name: "Items Count",
          renderCell: (params) => (
            <span
              style={{
                color:
                  params.row.Items && params.row.Items.length > 0
                    ? "green"
                    : "gray",
                fontWeight: "bold",
              }}
            >
              {params.row.Items ? params.row.Items.length : 0}
            </span>
          ),
        },
      ];
    } else if (reportType === "issue") {
      return [
        { key: "Issue_Invoice_No", name: "Issue No" },
        { key: "RaisedFrom", name: "From Location" },
        { key: "RaisedTo", name: "To Location" },
        { key: "IssuedBy", name: "Issued By" },
        {
          key: "IssueDate",
          name: "Date",
          renderCell: (params) => {
            const date = new Date(params.row.IssueDate);
            return date.toLocaleDateString("en-GB");
          },
        },
        { key: "Status", name: "Status" },
        {
          key: "ItemCount",
          name: "Items Count",
          renderCell: (params) => (
            <span
              style={{
                color:
                  params.row.Items && params.row.Items.length > 0
                    ? "green"
                    : "gray",
                fontWeight: "bold",
              }}
            >
              {params.row.Items ? params.row.Items.length : 0}
            </span>
          ),
        },
      ];
    } else {
      return [
        { key: "Receive_Invoice_No", name: "Receive No" },
        { key: "IssueFrom", name: "From Location" },
        { key: "ReceiveTo", name: "To Location" },
        { key: "ReceivedBy", name: "Received By" },
        {
          key: "ReceiveDate",
          name: "Date",
          renderCell: (params) => {
            const date = new Date(params.row.ReceiveDate);
            return date.toLocaleDateString("en-GB");
          },
        },
        { key: "Status", name: "Status" },
        {
          key: "ItemCount",
          name: "Items Count",
          renderCell: (params) => (
            <span
              style={{
                color:
                  params.row.Items && params.row.Items.length > 0
                    ? "green"
                    : "gray",
                fontWeight: "bold",
              }}
            >
              {params.row.Items ? params.row.Items.length : 0}
            </span>
          ),
        },
      ];
    }
  };

  // 🔹 Columns for item details
  const itemColumns = [
    { key: "ItemCode", name: "Item Code" },
    { key: "ItemName", name: "Item Name" },
    { key: "BatchNo", name: "Batch No" }, // 👈 ADD THIS LINE for batch no  
    { key: "ProductCategory", name: "Category" },
    { key: "SubCategory", name: "Sub Category" },
    { key: "PackType", name: "Pack Type" },
    { key: "PackQuantity", name: "Pack Qty" },
    ...(reportType === "raise"
      ? [{ key: "RaisedQuantity", name: "Raised Qty" }]
      : []),
    ...(reportType === "issue"
      ? [{ key: "IssueQuantity", name: "Issued Qty" }]
      : []),
    ...(reportType === "receive"
      ? [{ key: "ReceivedQuantity", name: "Received Qty" }]
      : []),
    {
      key: "SellablePrice",
      name: "Sellable Price",
      renderCell: (params) => (params.row.SellablePrice || 0).toFixed(2),
    },
    // Add this new column for Total
    {
      key: "Total",
      name: "Total",
      renderCell: (params) => {
        const quantity =
          reportType === "raise"
            ? params.row.RaisedQuantity || 0
            : reportType === "issue"
            ? params.row.IssueQuantity || 0
            : params.row.ReceivedQuantity || 0;
        const price = params.row.SellablePrice || 0;
        return (quantity * price).toFixed(2);
      },
    },
    { key: "Status", name: "Status" },
  ];

  // 🔹 Helper functions
  const getReportTypeTitle = () => {
    switch (reportType) {
      case "raise":
        return "Indent Raise";
      case "issue":
        return "Indent Issue";
      case "receive":
        return "Indent Receive";
      default:
        return "Indent Report";
    }
  };

  const getIndentNumber = (indent) => {
    switch (reportType) {
      case "raise":
        return `Indent No: ${indent.Invoice_No}`;
      case "issue":
        return `Issue No: ${indent.Issue_Invoice_No}`;
      case "receive":
        return `Receive No: ${indent.Receive_Invoice_No}`;
      default:
        return "Indent";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const toggleIndentExpansion = (indentKey) => {
    const newExpanded = new Set(expandedIndents);
    if (newExpanded.has(indentKey)) {
      newExpanded.delete(indentKey);
    } else {
      newExpanded.add(indentKey);
    }
    setExpandedIndents(newExpanded);
  };

  // Calculate total amount for an indent
  const calculateIndentTotal = (indent) => {
    if (!indent.Items || indent.Items.length === 0) return 0;

    return indent.Items.reduce((sum, item) => {
      const quantity =
        reportType === "raise"
          ? item.RaisedQuantity || 0
          : reportType === "issue"
          ? item.IssueQuantity || 0
          : item.ReceivedQuantity || 0;
      const price = item.SellablePrice || 0;
      return sum + quantity * price;
    }, 0);
  };

  // 🔹 Enhanced Print Function
  const handlePrint = () => {
    if (!filteredReportData || filteredReportData.length === 0) {
      alert("No data to print.");
      return;
    }

    setIsPrinting(true);

    let reportHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1>Indent Report - ${getReportTypeTitle()}</h1>
        <p><strong>Period:</strong> ${fromDate} to ${toDate}</p>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString(
          "en-GB"
        )}</p>
      </div>
    `;

    filteredReportData.forEach((indent, index) => {
      const totalAmount = calculateIndentTotal(indent);

      reportHTML += `
        <div class="indent-section" style="page-break-inside: avoid; border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <h2>${getIndentNumber(indent)}</h2>
          <p>
            <strong>From Location:</strong> ${
              indent.RaisedFrom || indent.IssueFrom || "N/A"
            } | 
            <strong>To Location:</strong> ${
              indent.RaisedTo || indent.ReceiveTo || "N/A"
            } | 
            <strong>Date:</strong> ${formatDate(
              indent.RequestDate || indent.IssueDate || indent.ReceiveDate
            )} |
            <strong>Status:</strong> ${indent.Status || "N/A"}
          </p>
          <p>
            <strong>${
              reportType === "raise"
                ? "Raised By"
                : reportType === "issue"
                ? "Issued By"
                : "Received By"
            }:</strong> 
            ${indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A"}
          </p>
          
          <h3>Item Details</h3>
          ${
            indent.Items && indent.Items.length > 0
              ? `
                <table style="width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
                  <thead>
                    <tr style="background-color: #f2f2f2;">
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Item Code</th>
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Item Name</th>
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Batch No</th> 
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Category</th>
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Pack Type</th>
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Pack Qty</th>
                      ${
                        reportType === "raise"
                          ? '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Raised Qty</th>'
                          : reportType === "issue"
                          ? '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Issued Qty</th>'
                          : '<th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Received Qty</th>'
                      }
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Sellable Price</th>
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Total</th>
                      <th style="border: 1px solid #ccc; padding: 6px; text-align: left;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${indent.Items.map((item) => {
                      const quantity =
                        reportType === "raise"
                          ? item.RaisedQuantity || 0
                          : reportType === "issue"
                          ? item.IssueQuantity || 0
                          : item.ReceivedQuantity || 0;
                      const price = item.SellablePrice || 0;
                      const total = quantity * price;

                      return `
                        <tr>
                          <td style="border: 1px solid #ccc; padding: 6px;">${
                            item.ItemCode || ""
                          }</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${
                            item.ItemName || ""
                          }</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${item.BatchNo || ""}</td> {/* ADD THIS */}
                          <td style="border: 1px solid #ccc; padding: 6px;">${
                            item.ProductCategory || ""
                          }</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${
                            item.PackType || ""
                          }</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${
                            item.PackQuantity || 0
                          }</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${quantity}</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${price.toFixed(
                            2
                          )}</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${total.toFixed(
                            2
                          )}</td>
                          <td style="border: 1px solid #ccc; padding: 6px;">${
                            item.Status || ""
                          }</td>
                        </tr>
                      `;
                    }).join("")}
                  </tbody>
                </table>
                <p style="text-align: right; font-weight: bold; margin-top: 10px;">
                  Total Items: ${
                    indent.Items.length
                  } | Total Amount: ₹${totalAmount.toFixed(2)}
                </p>
              `
              : "<p>No items found for this indent.</p>"
          }
        </div>
      `;
    });

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>Indent Report - ${getReportTypeTitle()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width:100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1, h2, h3, p { margin: 8px 0; }
            .indent-section { 
              page-break-inside: avoid; 
              border: 1px solid #ccc;
              border-radius: 5px;
              padding: 15px;
              margin-bottom: 20px;
            }
            @media print {
              .indent-section { 
                page-break-inside: avoid; 
              }
            }
          </style>
        </head>
        <body>${reportHTML}</body>
      </html>`);
    newWin.document.close();

    setTimeout(() => {
      newWin.focus();
      newWin.print();
      newWin.close();
      setIsPrinting(false);
    }, 500);
  };

  // 🔹 Excel Export Function
  const handleExportExcel = () => {
    if (!filteredReportData || filteredReportData.length === 0) {
      alert("No data to export.");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Define headers for the item table
    const itemHeaders = [
      "S.No",
      "Item Code",
      "Item Name",
      "Batch No", // 👈 ADD THIS
      "Category",
      "Pack Type",
      "Pack Qty",
      reportType === "raise"
        ? "Raised Qty"
        : reportType === "issue"
        ? "Issued Qty"
        : "Received Qty",
      "Sellable Price",
      "Total",
      "Status",
    ];

    filteredReportData.forEach((indent) => {
      const totalAmount = calculateIndentTotal(indent);

      // Add space before each new indent section
      ws_data.push([]);

      // Add Indent Header information
      ws_data.push([
        getReportTypeTitle() + " Number:",
        getIndentNumber(indent).split(": ")[1],
      ]);
      ws_data.push([
        "From Location:",
        indent.RaisedFrom || indent.IssueFrom || "N/A",
        "",
        "To Location:",
        indent.RaisedTo || indent.ReceiveTo || "N/A",
      ]);
      ws_data.push([
        "Date:",
        formatDate(
          indent.RequestDate || indent.IssueDate || indent.ReceiveDate
        ),
        "",
        "Status:",
        indent.Status || "N/A",
      ]);
      ws_data.push([
        `${
          reportType === "raise"
            ? "Raised By"
            : reportType === "issue"
            ? "Issued By"
            : "Received By"
        }:`,
        indent.RaisedBy || indent.IssuedBy || indent.ReceivedBy || "N/A",
      ]);

      // Add space before the item table
      ws_data.push([]);

      // Add the item table headers
      ws_data.push(itemHeaders);

      // Add item data rows
      if (indent.Items && indent.Items.length > 0) {
        indent.Items.forEach((item, index) => {
          const quantity =
            reportType === "raise"
              ? item.RaisedQuantity || 0
              : reportType === "issue"
              ? item.IssueQuantity || 0
              : item.ReceivedQuantity || 0;
          const price = item.SellablePrice || 0;
          const total = quantity * price;

          ws_data.push([
            index + 1,
            item.ItemCode || "",
            item.ItemName || "",
            item.BatchNo || "", // 👈 ADD THIS
            item.ProductCategory || "",
            item.PackType || "",
            item.PackQuantity || 0,
            quantity,
            price,  
            total,
            item.Status || "",
          ]);
        });

        // Add total items count and amount
        ws_data.push([]);
        ws_data.push([
          "Total Items:",
          indent.Items.length,
          "",
          "",
          "",
          "",
          "",
          "Total Amount:",
          totalAmount,
        ]);
      } else {
        ws_data.push(["No items found for this indent."]);
      }

      // Add separator between indents
      ws_data.push([]);
      ws_data.push(["=".repeat(100)]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Auto-fit column widths
    const columnWidths = [
      { wch: 8 },
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    ws["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Indent Report");
    XLSX.writeFile(
      wb,
      `Indent_Report_${reportType}_${fromDate}_to_${toDate}.xlsx`
    );
  };

  // 🔹 Render item details for each indent
  const renderItemDetails = (indent) => {
    const indentKey = getIndentKey(indent);
    const isExpanded = expandedIndents.has(indentKey);
    const totalAmount = calculateIndentTotal(indent);

    if (!indent.Items || indent.Items.length === 0) {
      return (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f9f9f9",
            marginTop: "5px",
          }}
        >
          <p
            style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}
          >
            No items found for this indent
          </p>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f8ff",
            border: "1px solid #d1e7ff",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => toggleIndentExpansion(indentKey)}
        >
          <strong>
            Item Details ({indent.Items.length} items) - Total: ₹
            {totalAmount.toFixed(2)}
          </strong>
          <span style={{ fontWeight: "bold" }}>{isExpanded ? "▲" : "▼"}</span>
        </div>

        {isExpanded && (
          <div
            style={{
              marginTop: "5px",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <ReactGrid
              columns={itemColumns}
              RowData={indent.Items}
              style={{ fontSize: "12px" }}
            />
            {/* Add total amount display */}
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderTop: "2px solid #dee2e6",
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Total Amount: ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="Main_container_app">
      <h3>Indent Reports</h3>
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setExpandedIndents(new Set());
            }}
          >
            <option value="raise">Indent Raise</option>
            <option value="issue">Indent Issue</option>
            <option value="receive">Indent Receive</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label>Location:</label>
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label>Search Item:</label>
          <input
            type="text"
            placeholder="Search by item name or code"
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
          />
        </div>

        <div
          className="RegisForm_1"
          style={{ marginLeft: "1rem", alignItems: "center" }}
        >
          <button
            className="RegisterForm_1_btns"
            onClick={handlePrint}
            title="Print Report"
            disabled={loading || filteredReportData.length === 0 || isPrinting}
          >
            {isPrinting ? "Preparing..." : <PrintIcon />}
          </button>
          <button
            className="RegisterForm_1_btns"
            onClick={handleExportExcel}
            title="Download Excel"
            disabled={loading || filteredReportData.length === 0}
          >
            <BrowserUpdatedIcon />
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : filteredReportData.length > 0 ? (
        <div style={{ marginTop: "1rem" }}>
          {filteredReportData.map((indent, index) => {
            const totalAmount = calculateIndentTotal(indent);

            return (
              <div
                key={getIndentKey(indent)}
                style={{
                  marginBottom: "20px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {/* Main Indent Info */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
                      {getIndentNumber(indent)}
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        fontSize: "14px",
                      }}
                    >
                      <div>
                        <strong>From:</strong>{" "}
                        {indent.RaisedFrom || indent.IssueFrom || "N/A"}
                      </div>
                      <div>
                        <strong>To:</strong>{" "}
                        {indent.RaisedTo || indent.ReceiveTo || "N/A"}
                      </div>
                      <div>
                        <strong>Date:</strong>{" "}
                        {formatDate(
                          indent.RequestDate ||
                            indent.IssueDate ||
                            indent.ReceiveDate
                        )}
                      </div>
                      <div>
                        <strong>Status:</strong> {indent.Status || "N/A"}
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <strong>
                          {reportType === "raise"
                            ? "Raised By"
                            : reportType === "issue"
                            ? "Issued By"
                            : "Received By"}
                          :
                        </strong>{" "}
                        {indent.RaisedBy ||
                          indent.IssuedBy ||
                          indent.ReceivedBy ||
                          "N/A"}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        color:
                          indent.Items && indent.Items.length > 0
                            ? "green"
                            : "gray",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      {indent.Items ? indent.Items.length : 0} Items
                    </div>
                    <div
                      style={{
                        color: "#d32f2f",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      Total: ₹{totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Item Details - Directly Displayed */}
                {renderItemDetails(indent)}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          {fromDate && toDate
            ? "No data found for the selected criteria."
            : "Please select a date range to generate a report."}
        </p>
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default IndentReports;

