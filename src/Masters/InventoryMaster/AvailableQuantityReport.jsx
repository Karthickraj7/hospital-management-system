// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
// import { useSelector } from 'react-redux';
// import PrintIcon from "@mui/icons-material/Print";

// const AvailableQuantityReport = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [stockData, setStockData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
  
//   const [storeFilter, setStoreFilter] = useState('');
//   const [nurseFilter, setNurseFilter] = useState('');
//   const [searchProduct, setSearchProduct] = useState('');

//   const printRef = useRef();

//   // Fetch stock/quantity data
//   const fetchStockData = () => {
//     axios.get(`${UrlLink}Inventory/get_available_stocks`)
//       .then((response) => {
//         setStockData(Array.isArray(response.data)?response.data :[]);
//         setFilteredData(Array.isArray(response.data)?response.data :[]);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock data", error);
//       });
//   };

//   useEffect(() => {
//     fetchStockData();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let data = stockData;

//     if (storeFilter) {
//       data = data.filter(item => item.store_location === storeFilter);
//     }
//     if (nurseFilter) {
//       data = data.filter(item => item.nurse_location === nurseFilter);
//     }
//     if (searchProduct) {
//       data = data.filter(item =>
//         item.product_name.toLowerCase().includes(searchProduct.toLowerCase())
//       );
//     }

//     setFilteredData(data);
//   }, [storeFilter, nurseFilter, searchProduct, stockData]);

//   // Base columns
//   let columns = [
//     { key: 'id', name: 'ID', frozen: true, width: 80 },
//     { key: 'product_name', name: 'Product Name' },
//     { key: 'batch_no', name: 'Batch No' },
//     { key: 'available_qty', name: 'Available Quantity' },
//   ];

//   // Conditionally add location columns
//   if (storeFilter && !nurseFilter) {
//     // Only store filter → hide nurse
//     columns.push({ key: 'store_location', name: 'Store Location' });
//   } else if (!storeFilter && nurseFilter) {
//     // Only nurse filter → hide store
//     columns.push({ key: 'nurse_location', name: 'Nurse Location' });
//   } else {
//     // Both / none → show both
//     columns.push({ key: 'store_location', name: 'Store Location' });
//     columns.push({ key: 'nurse_location', name: 'Nurse Station' });
//   }

//   // Print all filtered data (no reload/blank)
//  const handlePrint = () => {
//   const printContent = `
//     <html>
//       <head>
//         <title>Available Quantity Report</title>
//         <style>
//           table { width:100%; border-collapse:collapse; }
//           th, td { border:1px solid #000; padding:6px; text-align:left; }
//           th { background:#f2f2f2; }
//         </style>
//       </head>
//       <body>
//         <h2>Available Quantity Report</h2>
//         <table>
//           <thead>
//             <tr>
//               ${columns.map(col => `<th>${col.name}</th>`).join("")}
//             </tr>
//           </thead>
//           <tbody>
//             ${filteredData.map(row => `
//               <tr>
//                 ${columns.map(col => `<td>${row[col.key] ?? ""}</td>`).join("")}
//               </tr>
//             `).join("")}
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;

//   const newWin = window.open("", "_blank");
//   newWin.document.write(printContent);
//   newWin.document.close();
//   newWin.focus();
//   newWin.print();
//   newWin.close();
// };

//   const storeOptions = [...new Set(stockData.map(item => item.store_location))];
// const nurseOptions = [...new Set(stockData.map(item => item.nurse_location))];


//   return (
//     <>
//         <div style={{ padding: "10px" }}>
//         <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Available Quantity Report</h3>

//         <div style={{ display: 'flex', flexWrap:'wrap', gap: '15px', marginTop: '10px' ,alignItems:'center'}}>
//           <div>
//             <label>Store:</label>
//             <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}>
//               <option value="">All</option>
//               {storeOptions.map((store, i) => (
//                 <option key={i} value={store}>{store}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Nurse Station:</label>
//             <select value={nurseFilter} onChange={(e) => setNurseFilter(e.target.value)}>
//               <option value="">All</option>
//               {nurseOptions.map((nurse, i) => (
//                 <option key={i} value={nurse}>{nurse}</option>
//               ))}
//             </select>
//           </div>

//           <div style={{ alignItems:'center'}}>
//             <label>Search Product:</label>
//             <input
//             style={{width:'200px',padding:'5px',borderRadius:'5px'}}
//               type="text"
//               value={searchProduct}
//               onChange={(e) => setSearchProduct(e.target.value)}
//               placeholder="Enter product name"
//             />
//           </div>

         
//         </div>
//         <div>

//              <button 
//             style={{width:'50px',borderRadius:'10px',marginLeft:'10px'}} 
//             onClick={handlePrint}
//           >
//             <PrintIcon />
//           </button>
//         </div>
//       </div>

//       <div ref={printRef}>
//         <ReactGrid columns={columns} RowData={filteredData} />
//       </div>
//     </>
//   );
// };

// export default AvailableQuantityReport;
    

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useSelector } from "react-redux";
// import PrintIcon from "@mui/icons-material/Print";

// const AvailableQuantityReport = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [stockData, setStockData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [storeFilter, setStoreFilter] = useState("");
//   const [nurseFilter, setNurseFilter] = useState("");
//   const [searchProduct, setSearchProduct] = useState("");

//   const printRef = useRef();

//   const fetchStockData = () => {
//     axios
//       .get(`${UrlLink}Inventory/get_available_stocks`)
//       .then((response) => {
//         const data = Array.isArray(response.data) ? response.data : [];
//         const withMrp = data.map((item) => ({
//           ...item,
//           mrp_total: (item.available_qty || 0) * (item.sellable_price || 0),
//         }));
//         setStockData(withMrp);
//         setFilteredData(withMrp);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock data", error);
//       });
//   };

//   useEffect(() => {
//     fetchStockData();
//   }, []);

//   useEffect(() => {
//     let data = stockData;

//     if (storeFilter) {
//       data = data.filter((item) => item.store_location === storeFilter);
//     }
//     if (nurseFilter) {
//       data = data.filter((item) => item.nurse_location === nurseFilter);
//     }
//     if (searchProduct) {
//       data = data.filter((item) =>
//         item.product_name.toLowerCase().includes(searchProduct.toLowerCase())
//       );
//     }

//     setFilteredData(data);
//   }, [storeFilter, nurseFilter, searchProduct, stockData]);

//   let columns = [
//     { key: "id", name: "ID", frozen: true, width: 80 },
//     { key: "product_name", name: "Product Name" },
//     { key: "batch_no", name: "Batch No" },
//     { key: "available_qty", name: "Available Quantity" },
//     { key: "sellable_price", name: "Sellable Price" },
//     { key: "mrp_total", name: "MRP Total" },
//   ];

//   if (storeFilter && !nurseFilter) {
//     columns.push({ key: "store_location", name: "Store Location" });
//   } else if (!storeFilter && nurseFilter) {
//     columns.push({ key: "nurse_location", name: "Nurse Location" });
//   } else {
//     columns.push({ key: "store_location", name: "Store Location" });
//     columns.push({ key: "nurse_location", name: "Nurse Station" });
//   }

//   const handlePrint = () => {
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.mrp_total || 0),
//       0
//     );

//     const printContent = ` 
//       <html> 
//         <head> 
//           <title>Available Quantity Report</title> 
//           <style> 
//             table { width:100%; border-collapse:collapse; } 
//             th, td { border:1px solid #000; padding:6px; text-align:left; } 
//             th { background:#f2f2f2; } 
//             h3, h4 { margin: 5px 0; }
//           </style> 
//         </head> 
//         <body> 
//           <h2>Available Quantity Report</h2> 
//           <h4>Total Available Quantity: ${totalQty}</h4>
//           <h4>Total Sellable Price: ₹${totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹${grandTotal.toFixed(2)}</h4>
//           <table> 
//             <thead> 
//               <tr> 
//                 ${columns.map((col) => `<th>${col.name}</th>`).join("")} 
//               </tr> 
//             </thead> 
//             <tbody> 
//               ${filteredData
//                 .map(
//                   (row) => ` 
//                 <tr> 
//                   ${columns
//                     .map((col) => `<td>${row[col.key] ?? ""}</td>`)
//                     .join("")} 
//                 </tr> 
//               `
//                 )
//                 .join("")} 
//             </tbody> 
//           </table> 
//         </body> 
//       </html> 
//     `;

//     const newWin = window.open("", "_blank");
//     newWin.document.open();
//     newWin.document.write(printContent);
//     newWin.document.close();

//     // ✅ Wait until the content is fully loaded before printing
//     const printWhenReady = () => {
//       if (newWin.document.readyState === "complete") {
//         setTimeout(() => {
//           newWin.focus();
//           newWin.print();
//         }, 500);
//       } else {
//         setTimeout(printWhenReady, 200);
//       }
//     };
//     printWhenReady();
//   };

//   const storeOptions = [
//     ...new Set(stockData.map((item) => item.store_location)),
//   ];
//   const nurseOptions = [
//     ...new Set(stockData.map((item) => item.nurse_location)),
//   ];

//   // ✅ Totals for on-screen display
//   const totalQty = filteredData.reduce(
//     (sum, item) => sum + (item.available_qty || 0),
//     0
//   );
//   const totalSellable = filteredData.reduce(
//     (sum, item) => sum + (item.sellable_price || 0),
//     0
//   );
//   const grandTotal = filteredData.reduce(
//     (sum, item) => sum + (item.mrp_total || 0),
//     0
//   );

//   return (
//     <>
//       <div style={{ padding: "10px" }}>
//         <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
//           Available Quantity Report
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "15px",
//             marginTop: "10px",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <label>Store:</label>
//             <select
//               value={storeFilter}
//               onChange={(e) => setStoreFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {storeOptions.map((store, i) => (
//                 <option key={i} value={store}>
//                   {store}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Nurse Station:</label>
//             <select
//               value={nurseFilter}
//               onChange={(e) => setNurseFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {nurseOptions.map((nurse, i) => (
//                 <option key={i} value={nurse}>
//                   {nurse}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ alignItems: "center" }}>
//             <label>Search Product:</label>
//             <input
//               style={{ width: "200px", padding: "5px", borderRadius: "5px" }}
//               type="text"
//               value={searchProduct}
//               onChange={(e) => setSearchProduct(e.target.value)}
//               placeholder="Enter product name"
//             />
//           </div>
//         </div>

//         <div>
//           <button
//             style={{ width: "50px", borderRadius: "10px", marginLeft: "10px" }}
//             onClick={handlePrint}
//           >
//             <PrintIcon />
//           </button>
//         </div>

//         {/* ✅ Show all three totals */}
//         <div
//           style={{
//             marginTop: "15px",
//             textAlign: "right",
//             marginRight: "20px",
//             lineHeight: "1.6",
//           }}
//         >
//           <h4>Total Available Quantity: {totalQty}</h4>
//           <h4>Total Sellable Price: ₹{totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹{grandTotal.toFixed(2)}</h4>
//         </div>
//       </div>

//       <div ref={printRef}>
//         <ReactGrid columns={columns} RowData={filteredData} />
//       </div>
//     </>
//   );
// };

// export default AvailableQuantityReport;



// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useSelector } from "react-redux";
// import PrintIcon from "@mui/icons-material/Print";
// import DescriptionIcon from "@mui/icons-material/Description";
// import * as XLSX from "xlsx";

// const AvailableQuantityReport = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [stockData, setStockData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [storeFilter, setStoreFilter] = useState("");
//   const [nurseFilter, setNurseFilter] = useState("");
//   const [searchProduct, setSearchProduct] = useState("");

//   const printRef = useRef();

//   const fetchStockData = () => {
//     axios
//       .get(`${UrlLink}Inventory/get_available_stocks`)
//       .then((response) => {
//         const data = Array.isArray(response.data) ? response.data : [];
//         setStockData(data);
//         setFilteredData(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock data", error);
//       });
//   };

//   useEffect(() => {
//     fetchStockData();
//   }, []);

//   useEffect(() => {
//     let data = stockData;

//     if (storeFilter) {
//       data = data.filter((item) => item.store_location === storeFilter);
//     }
//     if (nurseFilter) {
//       data = data.filter((item) => item.nurse_location === nurseFilter);
//     }
//     if (searchProduct) {
//       data = data.filter((item) =>
//         item.product_name.toLowerCase().includes(searchProduct.toLowerCase())
//       );
//     }

//     setFilteredData(data);
//   }, [storeFilter, nurseFilter, searchProduct, stockData]);

//   let columns = [
//     { key: "id", name: "ID", frozen: true, width: 80 },
//     { key: "product_name", name: "Product Name" },
//     { key: "batch_no", name: "Batch No" },
//     { key: "available_qty", name: "Available Quantity" },
//     { key: "current_price", name: "PTR (Purchase Rate Before Tax)" },
//     { key: "sellable_price", name: "Sellable Price" },
//     { key: "sellable_qty_price", name: "MRP Per Unit" },
//     { key: "mrp_quantity_price", name: "MRP Total" },
//   ];

//   if (storeFilter && !nurseFilter) {
//     columns.push({ key: "store_location", name: "Store Location" });
//   } else if (!storeFilter && nurseFilter) {
//     columns.push({ key: "nurse_location", name: "Nurse Location" });
//   } else {
//     columns.push({ key: "store_location", name: "Store Location" });
//     columns.push({ key: "nurse_location", name: "Nurse Station" });
//   }

//   const handlePrint = () => {
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.mrp_quantity_price || 0),
//       0
//     );

//     const printContent = ` 
//       <html> 
//         <head> 
//           <title>Available Quantity Report</title> 
//           <style> 
//             table { width:100%; border-collapse:collapse; } 
//             th, td { border:1px solid #000; padding:6px; text-align:left; } 
//             th { background:#f2f2f2; } 
//             h3, h4 { margin: 5px 0; }
//           </style> 
//         </head> 
//         <body> 
//           <h2>Available Quantity Report</h2> 
//           <h4>Total Available Quantity: ${totalQty}</h4>
//           <h4>Total Sellable Price: ₹${totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹${grandTotal.toFixed(2)}</h4>
//           <table> 
//             <thead> 
//               <tr> 
//                 ${columns.map((col) => `<th>${col.name}</th>`).join("")} 
//               </tr> 
//             </thead> 
//             <tbody> 
//               ${filteredData
//                 .map(
//                   (row) => ` 
//                 <tr> 
//                   ${columns
//                     .map((col) => `<td>${row[col.key] ?? ""}</td>`)
//                     .join("")} 
//                 </tr> 
//               `
//                 )
//                 .join("")} 
//             </tbody> 
//           </table> 
//         </body> 
//       </html> 
//     `;

//     const newWin = window.open("", "_blank");
//     newWin.document.open();
//     newWin.document.write(printContent);
//     newWin.document.close();

//     // ✅ Wait until the content is fully loaded before printing
//     const printWhenReady = () => {
//       if (newWin.document.readyState === "complete") {
//         setTimeout(() => {
//           newWin.focus();
//           newWin.print();
//         }, 500);
//       } else {
//         setTimeout(printWhenReady, 200);
//       }
//     };
//     printWhenReady();
//   };

//   const handleExcelExport = () => {
//     // Calculate totals
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.mrp_quantity_price || 0),
//       0
//     );

//     // Prepare data for Excel
//     const excelData = filteredData.map((item, index) => ({
//       "S.No": index + 1,
//       ID: item.id || "",
//       "Product Name": item.product_name || "",
//       "Batch No": item.batch_no || "",
//       "Available Quantity": item.available_qty || 0,
//       "PTR (Purchase Rate Before Tax)": item.current_price || 0,
//       "Sellable Price": item.sellable_price || 0,
//       "MRP Per Unit": item.mrp_per_unit || 0,
//       "MRP Total": item.mrp_quantity_price || 0,
//       "Store Location": item.store_location || "",
//       "Nurse Station": item.nurse_location || "",
//       "Expiry Status": item.expiry_status || "",
//     }));

//     // Add summary rows
//     excelData.push({});
//     excelData.push({
//       "Product Name": "SUMMARY",
//       "Available Quantity": totalQty,
//       "Sellable Price": `₹${totalSellable.toFixed(2)}`,
//       "MRP Total": `₹${grandTotal.toFixed(2)}`,
//     });

//     // Create workbook and worksheet
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(excelData);

//     // Set column widths
//     const colWidths = [
//       { wch: 8 }, // S.No
//       { wch: 8 }, // ID
//       { wch: 25 }, // Product Name
//       { wch: 15 }, // Batch No
//       { wch: 18 }, // Available Quantity
//       { wch: 25 }, // PTR
//       { wch: 15 }, // Sellable Price
//       { wch: 15 }, // MRP Per Unit
//       { wch: 15 }, // MRP Total
//       { wch: 20 }, // Store Location
//       { wch: 20 }, // Nurse Station
//       { wch: 15 }, // Expiry Status
//     ];
//     ws["!cols"] = colWidths;

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Available Quantity Report");

//     // Generate filename with current date
//     const today = new Date();
//     const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format
//     const filename = `Available_Quantity_Report_${dateStr}.xlsx`;

//     // Save file
//     XLSX.writeFile(wb, filename);
//   };

//   const storeOptions = [
//     ...new Set(stockData.map((item) => item.store_location)),
//   ];
//   const nurseOptions = [
//     ...new Set(stockData.map((item) => item.nurse_location)),
//   ];

//   // ✅ Totals for on-screen display
//   const totalQty = filteredData.reduce(
//     (sum, item) => sum + (item.available_qty || 0),
//     0
//   );
//   const totalSellable = filteredData.reduce(
//     (sum, item) => sum + (item.sellable_price || 0),
//     0
//   );
//   const grandTotal = filteredData.reduce(
//     (sum, item) => sum + (item.mrp_quantity_price || 0),
//     0
//   );

//   return (
//     <>
//       <div style={{ padding: "10px" }}>
//         <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
//           Available Quantity Report
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "15px",
//             marginTop: "10px",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <label>Store:</label>
//             <select
//               value={storeFilter}
//               onChange={(e) => setStoreFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {storeOptions.map((store, i) => (
//                 <option key={i} value={store}>
//                   {store}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Nurse Station:</label>
//             <select
//               value={nurseFilter}
//               onChange={(e) => setNurseFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {nurseOptions.map((nurse, i) => (
//                 <option key={i} value={nurse}>
//                   {nurse}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ alignItems: "center" }}>
//             <label>Search Product:</label>
//             <input
//               style={{ width: "200px", padding: "5px", borderRadius: "5px" }}
//               type="text"
//               value={searchProduct}
//               onChange={(e) => setSearchProduct(e.target.value)}
//               placeholder="Enter product name"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             style={{ width: "50px", borderRadius: "10px", marginLeft: "10px" }}
//             onClick={handlePrint}
//             title="Print Report"
//           >
//             <PrintIcon />
//           </button>

//           <button
//             style={{ width: "50px", borderRadius: "10px" }}
//             onClick={handleExcelExport}
//             title="Export to Excel"
//           >
//             <DescriptionIcon />
//           </button>
//         </div>

//         {/* ✅ Show all three totals */}
//         <div
//           style={{
//             marginTop: "15px",
//             textAlign: "right",
//             marginRight: "20px",
//             lineHeight: "1.6",
//           }}
//         >
//           <h4>Total Available Quantity: {totalQty}</h4>
//           <h4>Total Sellable Price: ₹{totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹{grandTotal.toFixed(2)}</h4>
//         </div>
//       </div>

//       <div ref={printRef}>
//         <ReactGrid columns={columns} RowData={filteredData} />
//       </div>
//     </>
//   );
// };

// export default AvailableQuantityReport;


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useSelector } from "react-redux";
// import PrintIcon from "@mui/icons-material/Print";
// import DescriptionIcon from "@mui/icons-material/Description";
// import * as XLSX from "xlsx";

// const AvailableQuantityReport = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [stockData, setStockData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [storeFilter, setStoreFilter] = useState("");
//   const [nurseFilter, setNurseFilter] = useState("");
//   const [searchProduct, setSearchProduct] = useState("");

//   const [storeOptions, setStoreOptions] = useState([]);
//   const [nurseOptions, setNurseOptions] = useState([]);

//   const printRef = useRef();

//   const fetchStockData = () => {
//     // Build query parameters for backend filtering
//     const params = new URLSearchParams();
//     if (searchProduct) params.append("product_name", searchProduct);
//     if (storeFilter) params.append("store_location", storeFilter);
//     if (nurseFilter) params.append("nurse_location", nurseFilter);

//     const queryString = params.toString();
//     const url = `${UrlLink}Inventory/get_available_stocks${
//       queryString ? `?${queryString}` : ""
//     }`;

//     axios
//       .get(url)
//       .then((response) => {
//         const data = Array.isArray(response.data) ? response.data : [];
//         // Calculate MRP Total as available_qty * sellable_qty_price
//         const processedData = data.map((item) => ({
//           ...item,
//           calculated_mrp_total:
//             (item.available_qty || 0) * (item.sellable_qty_price || 0),
//         }));
//         setStockData(processedData);
//         setFilteredData(processedData);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock data", error);
//       });
//   };

//   const fetchDropdownOptions = () => {
//     // Fetch all data to populate dropdown options
//     axios
//       .get(`${UrlLink}Inventory/get_available_stocks`)
//       .then((response) => {
//         const data = Array.isArray(response.data) ? response.data : [];
//         const uniqueStores = [
//           ...new Set(data.map((item) => item.store_location).filter(Boolean)),
//         ];
//         const uniqueNurses = [
//           ...new Set(data.map((item) => item.nurse_location).filter(Boolean)),
//         ];
//         setStoreOptions(uniqueStores);
//         setNurseOptions(uniqueNurses);
//       })
//       .catch((error) => {
//         console.error("Error fetching dropdown options", error);
//       });
//   };

//   useEffect(() => {
//     fetchStockData();
//     fetchDropdownOptions();
//   }, []);

//   useEffect(() => {
//     fetchStockData();
//   }, [storeFilter, nurseFilter, searchProduct]);

//   let columns = [
//     { key: "id", name: "ID", frozen: true, width: 80 },
//     { key: "product_name", name: "Product Name" },
//     { key: "batch_no", name: "Batch No" },
//     { key: "available_qty", name: "Available Quantity" },
//     { key: "purchase_rate_with_tax", name: "PTR (Purchase Rate Before Tax)" },
//     { key: "sellable_price", name: "Sellable Price" },
//     { key: "sellable_qty_price", name: "MRP Per Unit" },
//     { key: "calculated_mrp_total", name: "MRP Total" },
//   ];

//   if (storeFilter && !nurseFilter) {
//     columns.push({ key: "store_location", name: "Store Location" });
//   } else if (!storeFilter && nurseFilter) {
//     columns.push({ key: "nurse_location", name: "Nurse Location" });
//   } else {
//     columns.push({ key: "store_location", name: "Store Location" });
//     columns.push({ key: "nurse_location", name: "Nurse Station" });
//   }

//   const handlePrint = () => {
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const totalPTR = filteredData.reduce(
//       (sum, item) => sum + (item.purchase_rate_with_tax || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.calculated_mrp_total || 0),
//       0
//     );

//     const printContent = ` 
//       <html> 
//         <head> 
//           <title>Available Quantity Report</title> 
//           <style> 
//             table { width:100%; border-collapse:collapse; } 
//             th, td { border:1px solid #000; padding:6px; text-align:left; } 
//             th { background:#f2f2f2; } 
//             h3, h4 { margin: 5px 0; }
//           </style> 
//         </head> 
//         <body> 
//           <h2>Available Quantity Report</h2> 
//           <h4>Total Available Quantity: ${totalQty}</h4>
//           <h4>Total PTR: ₹${totalPTR.toFixed(2)}</h4>
//           <h4>Total Sellable Price: ₹${totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹${grandTotal.toFixed(2)}</h4>
//           <table> 
//             <thead> 
//               <tr> 
//                 ${columns.map((col) => `<th>${col.name}</th>`).join("")} 
//               </tr> 
//             </thead> 
//             <tbody> 
//               ${filteredData
//                 .map(
//                   (row) => ` 
//                 <tr> 
//                   ${columns
//                     .map((col) => `<td>${row[col.key] ?? ""}</td>`)
//                     .join("")} 
//                 </tr> 
//               `
//                 )
//                 .join("")} 
//             </tbody> 
//           </table> 
//         </body> 
//       </html> 
//     `;

//     const newWin = window.open("", "_blank");
//     newWin.document.open();
//     newWin.document.write(printContent);
//     newWin.document.close();

//     // ✅ Wait until the content is fully loaded before printing
//     const printWhenReady = () => {
//       if (newWin.document.readyState === "complete") {
//         setTimeout(() => {
//           newWin.focus();
//           newWin.print();
//         }, 500);
//       } else {
//         setTimeout(printWhenReady, 200);
//       }
//     };
//     printWhenReady();
//   };

//   const handleExcelExport = () => {
//     // Calculate totals
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const totalPTR = filteredData.reduce(
//       (sum, item) => sum + (item.purchase_rate_with_tax || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.calculated_mrp_total || 0),
//       0
//     );

//     // Prepare data for Excel
//     const excelData = filteredData.map((item, index) => ({
//       "S.No": index + 1,
//       ID: item.id || "",
//       "Product Name": item.product_name || "",
//       "Batch No": item.batch_no || "",
//       "Available Quantity": item.available_qty || 0,
//       "PTR (Purchase Rate Before Tax)": item.current_price || 0,
//       "Sellable Price": item.sellable_price || 0,
//       "MRP Per Unit": item.sellable_qty_price || 0,
//       "MRP Total": item.calculated_mrp_total || 0,
//       "Store Location": item.store_location || "",
//       "Nurse Station": item.nurse_location || "",
//       "Expiry Status": item.expiry_status || "",
//     }));

//     // Add summary rows
//     excelData.push({});
//     excelData.push({
//       "Product Name": "SUMMARY",
//       "Available Quantity": totalQty,
//       "PTR (Purchase Rate Before Tax)": `₹${totalPTR.toFixed(2)}`,
//       "Sellable Price": `₹${totalSellable.toFixed(2)}`,
//       "MRP Total": `₹${grandTotal.toFixed(2)}`,
//     });

//     // Create workbook and worksheet
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(excelData);

//     // Set column widths
//     const colWidths = [
//       { wch: 8 }, // S.No
//       { wch: 8 }, // ID
//       { wch: 25 }, // Product Name
//       { wch: 15 }, // Batch No
//       { wch: 18 }, // Available Quantity
//       { wch: 25 }, // PTR
//       { wch: 15 }, // Sellable Price
//       { wch: 15 }, // MRP Per Unit
//       { wch: 15 }, // MRP Total
//       { wch: 20 }, // Store Location
//       { wch: 20 }, // Nurse Station
//       { wch: 15 }, // Expiry Status
//     ];
//     ws["!cols"] = colWidths;

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Available Quantity Report");

//     // Generate filename with current date
//     const today = new Date();
//     const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format
//     const filename = `Available_Quantity_Report_${dateStr}.xlsx`;

//     // Save file
//     XLSX.writeFile(wb, filename);
//   };

//   // ✅ Totals for on-screen display
//   const totalQty = filteredData.reduce(
//     (sum, item) => sum + (item.available_qty || 0),
//     0
//   );
//   const totalSellable = filteredData.reduce(
//     (sum, item) => sum + (item.sellable_price || 0),
//     0
//   );
//   const totalPTR = filteredData.reduce(
//     (sum, item) => sum + (item.purchase_rate_with_tax || 0),
//     0
//   );
//   const grandTotal = filteredData.reduce(
//     (sum, item) => sum + (item.calculated_mrp_total || 0),
//     0
//   );

//   return (
//     <>
//       <div style={{ padding: "10px" }}>
//         <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
//           Available Quantity Report
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "15px",
//             marginTop: "10px",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <label>Store:</label>
//             <select
//               value={storeFilter}
//               onChange={(e) => setStoreFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {storeOptions.map((store, i) => (
//                 <option key={i} value={store}>
//                   {store}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Nurse Station:</label>
//             <select
//               value={nurseFilter}
//               onChange={(e) => setNurseFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {nurseOptions.map((nurse, i) => (
//                 <option key={i} value={nurse}>
//                   {nurse}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ alignItems: "center" }}>
//             <label>Search Product:</label>
//             <input
//               style={{ width: "200px", padding: "5px", borderRadius: "5px" }}
//               type="text"
//               value={searchProduct}
//               onChange={(e) => setSearchProduct(e.target.value)}
//               placeholder="Enter product name"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             style={{ width: "50px", borderRadius: "10px", marginLeft: "10px" }}
//             onClick={handlePrint}
//             title="Print Report"
//           >
//             <PrintIcon />
//           </button>

//           <button
//             style={{ width: "50px", borderRadius: "10px" }}
//             onClick={handleExcelExport}
//             title="Export to Excel"
//           >
//             <DescriptionIcon />
//           </button>
//         </div>

//         {/* ✅ Show all four totals */}
//         <div
//           style={{
//             marginTop: "15px",
//             textAlign: "right",
//             marginRight: "20px",
//             lineHeight: "1.6",
//           }}
//         >
//           <h4>Total Available Quantity: {totalQty}</h4>
//           <h4>Total PTR: ₹{totalPTR.toFixed(2)}</h4>
//           <h4>Total Sellable Price: ₹{totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹{grandTotal.toFixed(2)}</h4>
//         </div>
//       </div>

//       <div ref={printRef}>
//         <ReactGrid columns={columns} RowData={filteredData} />
//       </div>
//     </>
//   );
// };

// export default AvailableQuantityReport;



// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useSelector } from "react-redux";
// import PrintIcon from "@mui/icons-material/Print";
// import DescriptionIcon from "@mui/icons-material/Description";
// import * as XLSX from "xlsx";

// const AvailableQuantityReport = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const [stockData, setStockData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const [storeFilter, setStoreFilter] = useState("");
//   const [nurseFilter, setNurseFilter] = useState("");
//   const [searchProduct, setSearchProduct] = useState("");

//   const [storeOptions, setStoreOptions] = useState([]);
//   const [nurseOptions, setNurseOptions] = useState([]);

//   const printRef = useRef();

//   const fetchStockData = () => {
//     // Build query parameters for backend filtering
//     const params = new URLSearchParams();
//     if (searchProduct) params.append("product_name", searchProduct);
//     if (storeFilter) params.append("store_location", storeFilter);
//     if (nurseFilter) params.append("nurse_location", nurseFilter);

//     const queryString = params.toString();
//     const url = `${UrlLink}Inventory/get_available_stocks${
//       queryString ? `?${queryString}` : ""
//     }`;

//     axios
//       .get(url)
//       .then((response) => {
//         const data = Array.isArray(response.data) ? response.data : [];
//         // Calculate MRP Total as available_qty * sellable_qty_price
//         const processedData = data.map((item) => ({
//           ...item,
//           calculated_mrp_total:
//             (item.available_qty || 0) * (item.sellable_qty_price || 0),
//         }));
//         setStockData(processedData);
//         setFilteredData(processedData);
//       })
//       .catch((error) => {
//         console.error("Error fetching stock data", error);
//       });
//   };

//   const fetchDropdownOptions = () => {
//     // Fetch all data to populate dropdown options
//     axios
//       .get(`${UrlLink}Inventory/get_available_stocks`)
//       .then((response) => {
//         const data = Array.isArray(response.data) ? response.data : [];
//         const uniqueStores = [
//           ...new Set(data.map((item) => item.store_location).filter(Boolean)),
//         ];
//         const uniqueNurses = [
//           ...new Set(data.map((item) => item.nurse_location).filter(Boolean)),
//         ];
//         setStoreOptions(uniqueStores);
//         setNurseOptions(uniqueNurses);
//       })
//       .catch((error) => {
//         console.error("Error fetching dropdown options", error);
//       });
//   };

//   useEffect(() => {
//     fetchStockData();
//     fetchDropdownOptions();
//   }, []);

//   useEffect(() => {
//     fetchStockData();
//   }, [storeFilter, nurseFilter, searchProduct]);

//   let columns = [
//     { key: "id", name: "ID", frozen: true, width: 80 },
//     { key: "product_name", name: "Product Name" },
//     { key: "batch_no", name: "Batch No" },
//     { key: "available_qty", name: "Available Quantity" },
//     { key: "purchase_rate_with_tax", name: "PTR (Purchase Rate Before Tax)" },
//     { key: "sellable_price", name: "Sellable Price" },
//     { key: "sellable_qty_price", name: "MRP Per Unit" },
//     { key: "calculated_mrp_total", name: "MRP Total" },
//   ];

//   if (storeFilter && !nurseFilter) {
//     columns.push({ key: "store_location", name: "Store Location" });
//   } else if (!storeFilter && nurseFilter) {
//     columns.push({ key: "nurse_location", name: "Nurse Location" });
//   } else {
//     columns.push({ key: "store_location", name: "Store Location" });
//     columns.push({ key: "nurse_location", name: "Nurse Station" });
//   }

//   const handlePrint = () => {
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const totalPTR = filteredData.reduce(
//       (sum, item) => sum + (item.purchase_rate_with_tax || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.calculated_mrp_total || 0),
//       0
//     );

//     const printContent = ` 
//       <html> 
//         <head> 
//           <title>Available Quantity Report</title> 
//           <style> 
//             table { width:100%; border-collapse:collapse; } 
//             th, td { border:1px solid #000; padding:6px; text-align:left; } 
//             th { background:#f2f2f2; } 
//             h3, h4 { margin: 5px 0; }
//           </style> 
//         </head> 
//         <body> 
//           <h2>Available Quantity Report</h2> 
//           <h4>Total Available Quantity: ${totalQty}</h4>
//           <h4>Total PTR: ₹${totalPTR.toFixed(2)}</h4>
//           <h4>Total Sellable Price: ₹${totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹${grandTotal.toFixed(2)}</h4>
//           <table> 
//             <thead> 
//               <tr> 
//                 ${columns.map((col) => `<th>${col.name}</th>`).join("")} 
//               </tr> 
//             </thead> 
//             <tbody> 
//               ${filteredData
//                 .map(
//                   (row) => ` 
//                 <tr> 
//                   ${columns
//                     .map((col) => `<td>${row[col.key] ?? ""}</td>`)
//                     .join("")} 
//                 </tr> 
//               `
//                 )
//                 .join("")} 
//             </tbody> 
//           </table> 
//         </body> 
//       </html> 
//     `;

//     const newWin = window.open("", "_blank");
//     newWin.document.open();
//     newWin.document.write(printContent);
//     newWin.document.close();

//     // ✅ Wait until the content is fully loaded before printing
//     const printWhenReady = () => {
//       if (newWin.document.readyState === "complete") {
//         setTimeout(() => {
//           newWin.focus();
//           newWin.print();
//         }, 500);
//       } else {
//         setTimeout(printWhenReady, 200);
//       }
//     };
//     printWhenReady();
//   };

//   const handleExcelExport = () => {
//     // Calculate totals
//     const totalQty = filteredData.reduce(
//       (sum, item) => sum + (item.available_qty || 0),
//       0
//     );
//     const totalSellable = filteredData.reduce(
//       (sum, item) => sum + (item.sellable_price || 0),
//       0
//     );
//     const totalPTR = filteredData.reduce(
//       (sum, item) => sum + (item.purchase_rate_with_tax || 0),
//       0
//     );
//     const grandTotal = filteredData.reduce(
//       (sum, item) => sum + (item.calculated_mrp_total || 0),
//       0
//     );

//     // Prepare data for Excel
//     const excelData = filteredData.map((item, index) => ({
//       "S.No": index + 1,
//       ID: item.id || "",
//       "Product Name": item.product_name || "",
//       "Batch No": item.batch_no || "",
//       "Available Quantity": item.available_qty || 0,
//       "PTR (Purchase Rate Before Tax)": item.current_price || 0,
//       "Sellable Price": item.sellable_price || 0,
//       "MRP Per Unit": item.sellable_qty_price || 0,
//       "MRP Total": item.calculated_mrp_total || 0,
//       "Store Location": item.store_location || "",
//       "Nurse Station": item.nurse_location || "",
//       "Expiry Status": item.expiry_status || "",
//     }));

//     // Add summary rows
//     excelData.push({});
//     excelData.push({
//       "Product Name": "SUMMARY",
//       "Available Quantity": totalQty,
//       "PTR (Purchase Rate Before Tax)": `₹${totalPTR.toFixed(2)}`,
//       "Sellable Price": `₹${totalSellable.toFixed(2)}`,
//       "MRP Total": `₹${grandTotal.toFixed(2)}`,
//     });

//     // Create workbook and worksheet
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(excelData);

//     // Set column widths
//     const colWidths = [
//       { wch: 8 }, // S.No
//       { wch: 8 }, // ID
//       { wch: 25 }, // Product Name
//       { wch: 15 }, // Batch No
//       { wch: 18 }, // Available Quantity
//       { wch: 25 }, // PTR
//       { wch: 15 }, // Sellable Price
//       { wch: 15 }, // MRP Per Unit
//       { wch: 15 }, // MRP Total
//       { wch: 20 }, // Store Location
//       { wch: 20 }, // Nurse Station
//       { wch: 15 }, // Expiry Status
//     ];
//     ws["!cols"] = colWidths;

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Available Quantity Report");

//     // Generate filename with current date
//     const today = new Date();
//     const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format
//     const filename = `Available_Quantity_Report_${dateStr}.xlsx`;

//     // Save file
//     XLSX.writeFile(wb, filename);
//   };

//   // ✅ Totals for on-screen display
//   const totalQty = filteredData.reduce(
//     (sum, item) => sum + (item.available_qty || 0),
//     0
//   );
//   const totalSellable = filteredData.reduce(
//     (sum, item) => sum + (item.sellable_price || 0),
//     0
//   );
//   const totalPTR = filteredData.reduce(
//     (sum, item) => sum + (item.purchase_rate_with_tax || 0),
//     0
//   );
//   const grandTotal = filteredData.reduce(
//     (sum, item) => sum + (item.calculated_mrp_total || 0),
//     0
//   );

//   return (
//     <>
//       <div style={{ padding: "10px" }}>
//         <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
//           Available Quantity Report
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "15px",
//             marginTop: "10px",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <label>Store:</label>
//             <select
//               value={storeFilter}
//               onChange={(e) => setStoreFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {storeOptions.map((store, i) => (
//                 <option key={i} value={store}>
//                   {store}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Nurse Station:</label>
//             <select
//               value={nurseFilter}
//               onChange={(e) => setNurseFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {nurseOptions.map((nurse, i) => (
//                 <option key={i} value={nurse}>
//                   {nurse}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ alignItems: "center" }}>
//             <label>Search Product:</label>
//             <input
//               style={{ width: "200px", padding: "5px", borderRadius: "5px" }}
//               type="text"
//               value={searchProduct}
//               onChange={(e) => setSearchProduct(e.target.value)}
//               placeholder="Enter product name"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             style={{ width: "50px", borderRadius: "10px", marginLeft: "10px" }}
//             onClick={handlePrint}
//             title="Print Report"
//           >
//             <PrintIcon />
//           </button>

//           <button
//             style={{ width: "50px", borderRadius: "10px" }}
//             onClick={handleExcelExport}
//             title="Export to Excel"
//           >
//             <DescriptionIcon />
//           </button>
//         </div>

//         {/* ✅ Show all four totals */}
//         <div
//           style={{
//             marginTop: "15px",
//             textAlign: "right",
//             marginRight: "20px",
//             lineHeight: "1.6",
//           }}
//         >
//           <h4>Total Available Quantity: {totalQty}</h4>
//           <h4>Total PTR: ₹{totalPTR.toFixed(2)}</h4>
//           <h4>Total Sellable Price: ₹{totalSellable.toFixed(2)}</h4>
//           <h4>Grand Total (MRP): ₹{grandTotal.toFixed(2)}</h4>
//         </div>
//       </div>

//       <div ref={printRef}>
//         <ReactGrid columns={columns} RowData={filteredData} />
//       </div>
//     </>
//   );
// };

// export default AvailableQuantityReport;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useSelector } from "react-redux";
import PrintIcon from "@mui/icons-material/Print";
import DescriptionIcon from "@mui/icons-material/Description";
import { SearchIcon } from "lucide-react";
import * as XLSX from "xlsx";

const AvailableQuantityReport = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [storeFilter, setStoreFilter] = useState("");
  const [nurseFilter, setNurseFilter] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const [storeOptions, setStoreOptions] = useState([]);
  const [nurseOptions, setNurseOptions] = useState([]);

  const printRef = useRef();

  const fetchStockData = () => {
    setLoading(true);

    // Build query parameters for backend filtering
    const params = new URLSearchParams();
    if (searchProduct && searchProduct.trim() !== "") {
      params.append("product_name", searchProduct.trim());
    }
    if (storeFilter) params.append("store_location", storeFilter);
    if (nurseFilter) params.append("nurse_location", nurseFilter);

    const queryString = params.toString();
    const url = `${UrlLink}Inventory/get_available_stocks${
      queryString ? `?${queryString}` : ""
    }`;

    axios
      .get(url)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        // Calculate MRP Total as available_qty * sellable_qty_price
        const processedData = data.map((item) => ({
          ...item,
          calculated_mrp_total:
            (item.available_qty || 0) * (item.sellable_qty_price || 0),
        }));
        setStockData(processedData);
        setFilteredData(processedData);
      })
      .catch((error) => {
        console.error("Error fetching stock data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchDropdownOptions = () => {
    // Fetch all data to populate dropdown options
    axios
      .get(`${UrlLink}Inventory/get_available_stocks`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        const uniqueStores = [
          ...new Set(data.map((item) => item.store_location).filter(Boolean)),
        ];
        const uniqueNurses = [
          ...new Set(data.map((item) => item.nurse_location).filter(Boolean)),
        ];
        setStoreOptions(uniqueStores);
        setNurseOptions(uniqueNurses);
      })
      .catch((error) => {
        console.error("Error fetching dropdown options", error);
      });
  };

  useEffect(() => {
    fetchStockData();
    fetchDropdownOptions();
  }, []);

  let columns = [
    { key: "id", name: "ID", frozen: true, width: 80 },
    { key: "product_name", name: "Product Name" },
    { key: "batch_no", name: "Batch No" },
    { key: "available_qty", name: "Available Quantity" },
    { key: "purchase_rate_with_tax", name: "PTR (Purchase Rate Before Tax)" },
    { key: "sellable_price", name: "Sellable Price" },
    { key: "sellable_qty_price", name: "MRP Per Unit" },
    { key: "calculated_mrp_total", name: "MRP Total" },
  ];

  if (storeFilter && !nurseFilter) {
    columns.push({ key: "store_location", name: "Store Location" });
  } else if (!storeFilter && nurseFilter) {
    columns.push({ key: "nurse_location", name: "Nurse Location" });
  } else {
    columns.push({ key: "store_location", name: "Store Location" });
    columns.push({ key: "nurse_location", name: "Nurse Station" });
  }

  const handlePrint = () => {
    const totalQty = filteredData.reduce(
      (sum, item) => sum + (item.available_qty || 0),
      0
    );
    const totalSellable = filteredData.reduce(
      (sum, item) => sum + (item.sellable_price || 0),
      0
    );
    const totalPTR = filteredData.reduce(
      (sum, item) => sum + (item.purchase_rate_with_tax || 0),
      0
    );
    const grandTotal = filteredData.reduce(
      (sum, item) => sum + (item.calculated_mrp_total || 0),
      0
    );

    const printContent = ` 
      <html> 
        <head> 
          <title>Available Quantity Report</title> 
          <style> 
            table { width:100%; border-collapse:collapse; } 
            th, td { border:1px solid #000; padding:6px; text-align:left; } 
            th { background:#f2f2f2; } 
            h3, h4 { margin: 5px 0; }
          </style> 
        </head> 
        <body> 
          <h2>Available Quantity Report</h2> 
          <h4>Total Available Quantity: ${totalQty}</h4>
          <h4>Total PTR: ₹${totalPTR.toFixed(2)}</h4>
          <h4>Total Sellable Price: ₹${totalSellable.toFixed(2)}</h4>
          <h4>Grand Total (MRP): ₹${grandTotal.toFixed(2)}</h4>
          <table> 
            <thead> 
              <tr> 
                ${columns.map((col) => `<th>${col.name}</th>`).join("")} 
              </tr> 
            </thead> 
            <tbody> 
              ${filteredData
                .map(
                  (row) => ` 
                <tr> 
                  ${columns
                    .map((col) => `<td>${row[col.key] ?? ""}</td>`)
                    .join("")} 
                </tr> 
              `
                )
                .join("")} 
            </tbody> 
          </table> 
        </body> 
      </html> 
    `;

    const newWin = window.open("", "_blank");
    newWin.document.open();
    newWin.document.write(printContent);
    newWin.document.close();

    // ✅ Wait until the content is fully loaded before printing
    const printWhenReady = () => {
      if (newWin.document.readyState === "complete") {
        setTimeout(() => {
          newWin.focus();
          newWin.print();
        }, 500);
      } else {
        setTimeout(printWhenReady, 200);
      }
    };
    printWhenReady();
  };

  const handleExcelExport = () => {
    // Calculate totals
    const totalQty = filteredData.reduce(
      (sum, item) => sum + (item.available_qty || 0),
      0
    );
    const totalSellable = filteredData.reduce(
      (sum, item) => sum + (item.sellable_price || 0),
      0
    );
    const totalPTR = filteredData.reduce(
      (sum, item) => sum + (item.purchase_rate_with_tax || 0),
      0
    );
    const grandTotal = filteredData.reduce(
      (sum, item) => sum + (item.calculated_mrp_total || 0),
      0
    );

    // Prepare data for Excel
    const excelData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      ID: item.id || "",
      "Product Name": item.product_name || "",
      "Batch No": item.batch_no || "",
      "Available Quantity": item.available_qty || 0,
      "PTR (Purchase Rate Before Tax)": item.current_price || 0,
      "Sellable Price": item.sellable_price || 0,
      "MRP Per Unit": item.sellable_qty_price || 0,
      "MRP Total": item.calculated_mrp_total || 0,
      "Store Location": item.store_location || "",
      "Nurse Station": item.nurse_location || "",
      "Expiry Status": item.expiry_status || "",
    }));

    // Add summary rows
    excelData.push({});
    excelData.push({
      "Product Name": "SUMMARY",
      "Available Quantity": totalQty,
      "PTR (Purchase Rate Before Tax)": `₹${totalPTR.toFixed(2)}`,
      "Sellable Price": `₹${totalSellable.toFixed(2)}`,
      "MRP Total": `₹${grandTotal.toFixed(2)}`,
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 8 }, // S.No
      { wch: 8 }, // ID
      { wch: 25 }, // Product Name
      { wch: 15 }, // Batch No
      { wch: 18 }, // Available Quantity
      { wch: 25 }, // PTR
      { wch: 15 }, // Sellable Price
      { wch: 15 }, // MRP Per Unit
      { wch: 15 }, // MRP Total
      { wch: 20 }, // Store Location
      { wch: 20 }, // Nurse Station
      { wch: 15 }, // Expiry Status
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Available Quantity Report");

    // Generate filename with current date
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const filename = `Available_Quantity_Report_${dateStr}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  // ✅ Totals for on-screen display
  const totalQty = filteredData.reduce(
    (sum, item) => sum + (item.available_qty || 0),
    0
  );
  const totalSellable = filteredData.reduce(
    (sum, item) => sum + (item.sellable_price || 0),
    0
  );
  const totalPTR = filteredData.reduce(
    (sum, item) => sum + (item.purchase_rate_with_tax || 0),
    0
  );
  const grandTotal = filteredData.reduce(
    (sum, item) => sum + (item.calculated_mrp_total || 0),
    0
  );

  return (
    <>
      <div style={{ padding: "10px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
          Available Quantity Report
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "10px",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label>Search Product:</label>
            <input
              style={{ width: "200px", padding: "5px", borderRadius: "5px" }}
              type="text"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label>Store:</label>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              style={{ padding: "5px", borderRadius: "5px" }}
            >
              <option value="">All</option>
              {storeOptions.map((store, i) => (
                <option key={i} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Nurse Station:</label>
            <select
              value={nurseFilter}
              onChange={(e) => setNurseFilter(e.target.value)}
              style={{ padding: "5px", borderRadius: "5px" }}
            >
              <option value="">All</option>
              {nurseOptions.map((nurse, i) => (
                <option key={i} value={nurse}>
                  {nurse}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchStockData}
            style={{
              backgroundColor: "#5e6a8a",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            title="Search"
          >
            <SearchIcon size={16} />
            Search
          </button>

          <button
            style={{
              backgroundColor: "#649c79",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handlePrint}
            title="Print Report"
          >
            <PrintIcon style={{ fontSize: "18px" }} />
          </button>

          <button
            style={{
              backgroundColor: "#947c52",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleExcelExport}
            title="Export to Excel"
          >
            <DescriptionIcon style={{ fontSize: "18px" }} />
          </button>
        </div>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>Loading...</p>
        )}

        {/* ✅ Show all four totals */}
        {!loading && (
          <div
            style={{
              marginTop: "15px",
              textAlign: "right",
              marginRight: "20px",
              lineHeight: "1.6",
            }}
          >
            <h4>Total Available Quantity: {totalQty}</h4>
            <h4>Total PTR: ₹{totalPTR.toFixed(2)}</h4>
            <h4>Total Sellable Price: ₹{totalSellable.toFixed(2)}</h4>
            <h4>Grand Total (MRP): ₹{grandTotal.toFixed(2)}</h4>
          </div>
        )}
      </div>

      <div ref={printRef}>
        <ReactGrid columns={columns} RowData={filteredData} />
      </div>
    </>
  );
};

export default AvailableQuantityReport;
