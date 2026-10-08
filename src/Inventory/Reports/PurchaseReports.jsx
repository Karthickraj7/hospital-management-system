// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const PurchaseReports = () => {
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reportType, setReportType] = useState("date");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");

//   const today = new Date();
//   const currentDate = today.toISOString().split("T")[0];

//   // Fetch master data
//   useEffect(() => {
//     const fetchMasterData = async () => {
//       try {
//         const [suppliersRes, productsRes] = await Promise.all([
//           axios.get(`${UrlLink}Inventory/Supplier_Master_Link`),
//           axios.get(`${UrlLink}Inventory/product_master_Detials_link`),
//         ]);
//         setSuppliers(suppliersRes.data || []);
//         setProducts(productsRes.data || []);
//       } catch (error) {
//         console.error("Error fetching master data:", error);
//       }
//     };
//     fetchMasterData();
//   }, [UrlLink]);

//   const handleGenerateReport = useCallback(async () => {
//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.get(`${UrlLink}Inventory/Purchase_Reports`, {
//         params: {
//           start_date: startDate,
//           end_date: endDate,
//           report_type: reportType,
//           supplier_id: selectedSupplier,
//           product_id: selectedProduct,
//         },
//       });
//       setReportData(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error generating report:", error);
//       alert("Error generating report. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [UrlLink, startDate, endDate, reportType, selectedSupplier, selectedProduct]);

//   const handleExportExcel = useCallback(async () => {
//     if (!startDate || !endDate) {
//       alert("Please select both start and end dates");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${UrlLink}Inventory/Purchase_Reports_Export`,
//         {
//           params: {
//             start_date: startDate,
//             end_date: endDate,
//             report_type: reportType,
//             supplier_id: selectedSupplier,
//             product_id: selectedProduct,
//           },
//           responseType: "blob",
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `Purchase_Report_${startDate}_${endDate}.xlsx`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error exporting report:", error);
//       alert("Error exporting report. Please try again.");
//     }
//   }, [UrlLink, startDate, endDate, reportType, selectedSupplier, selectedProduct]);

//   const clearFilters = () => {
//     setStartDate("");
//     setEndDate("");
//     setReportType("date");
//     setSelectedSupplier("");
//     setSelectedProduct("");
//     setReportData([]);
//   };

//   const getColumns = () => {
//     if (reportType === "date") {
//       return [
//         { key: "date", name: "Date" },
//         { key: "po_number", name: "PO Number" },
//         { key: "supplier_name", name: "Supplier" },
//         { key: "total_items", name: "Total Items" },
//         { key: "total_amount", name: "Total Amount" },
//         { key: "status", name: "Status" },
//       ];
//     } else if (reportType === "product") {
//       return [
//         { key: "product_name", name: "Product Name" },
//         { key: "category", name: "Category" },
//         { key: "po_number", name: "PO Number" },
//         { key: "order_date", name: "Order Date" },
//         { key: "supplier_name", name: "Supplier" },
//         { key: "po_status", name: "Status" },
//         { key: "total_orders", name: "Total Orders" },
//         { key: "total_quantity", name: "Total Quantity" },
//         { key: "total_value", name: "Total Value" },
//         { key: "average_price", name: "Average Price" },
//       ];
//     } else {
//       return [
//         { key: "Supplier_Name", name: "Supplier Name" },
//         { key: "PO_Number", name: "PO Number" },
//         { key: "Order_Date", name: "Order Date" },
//         { key: "PO_Status", name: "Status" },
//         { key: "Total_Order_Value", name: "Order Value" },
//         { key: "Total_Items", name: "Total Items" },
//         { key: "Total_Value", name: "Total Value" },
//         { key: "Average_Order_Value", name: "Avg Order Value" },
//         { key: "Billing_Location", name: "Billing Location" },
//         { key: "Shipping_Location", name: "Shipping Location" },
//       ];
//     }
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Purchase Reports</h3>

//         <div className="RegisFormcon_1">
//           {/* Date Range */}
//           <div className="RegisForm_1">
//             <label htmlFor="startDate">
//               Start Date<span>:</span>
//             </label>
//             <input
//               type="date"
//               id="startDate"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label htmlFor="endDate">
//               End Date<span>:</span>
//             </label>
//             <input
//               type="date"
//               id="endDate"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>

//           {/* Report Type */}
//           <div className="RegisForm_1">
//             <label htmlFor="reportType">
//               Report Type<span>:</span>
//             </label>
//             <select
//               id="reportType"
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//             >
//               <option value="date">Date Wise</option>
//               <option value="product">Product Wise</option>
//               <option value="supplier">Supplier Wise</option>
//             </select>
//           </div>

//           {/* Supplier Filter */}
//           {reportType === "supplier" && (
//             <div className="RegisForm_1">
//               <label htmlFor="supplier">
//                 Supplier<span>:</span>
//               </label>
//               <select
//                 id="supplier"
//                 value={selectedSupplier}
//                 onChange={(e) => setSelectedSupplier(e.target.value)}
//               >
//                 <option value="">All Suppliers</option>
//                 {suppliers.map((supplier) => (
//                   <option key={supplier.id} value={supplier.SupplierId}>
//                     {supplier.SupplierName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Product Filter */}
//           {reportType === "product" && (
//             <div className="RegisForm_1">
//               <label htmlFor="product">
//                 Product<span>:</span>
//               </label>
//               <select
//                 id="product"
//                 value={selectedProduct}
//                 onChange={(e) => setSelectedProduct(e.target.value)}
//               >
//                 <option value="">All Products</option>
//                 {products.map((product) => (
//                   <option key={product.id} value={product.Item_Code}>
//                     {product.Item_Name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Buttons */}
//           <div
//             className="RegisForm_1"
//             style={{ marginLeft: "15px", width: "100px" }}
//           >
//             <button
//               className="RegisterForm_1_btns"
//               onClick={handleExportExcel}
//               title="Download Excel"
//               disabled={loading || reportData.length === 0}
//             >
//               <BrowserUpdatedIcon />
//             </button>

//             <button
//               onClick={handleGenerateReport}
//               style={{
//                 padding: "2px 8px",
//                 cursor: "pointer",
//                 borderRadius: "5px",
//                 backgroundColor: "green",
//                 color: "white",
//                 marginLeft: "5px",
//               }}
//               disabled={loading}
//             >
//               Generate
//             </button>

//             <button
//               onClick={clearFilters}
//               style={{
//                 padding: "2px 8px",
//                 cursor: "pointer",
//                 borderRadius: "5px",
//                 backgroundColor: "black",
//                 color: "white",
//                 marginLeft: "5px",
//               }}
//             >
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* Grid */}
//         {reportData.length > 0 && (
//           <div className="RegisFormcon_1 jjxjx_">
//             <ReactGrid columns={getColumns()} RowData={reportData} />
//           </div>
//         )}

//         <ToastAlert Message={toast.message} Type={toast.type} />
//       </div>
//     </>
//   );
// };

// export default PurchaseReports;


import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import PrintIcon from "@mui/icons-material/Print"; // 1. Added Print Icon
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

const PurchaseReports = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("date");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
const [selectedSupplierName, setSelectedSupplierName] = useState("");

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          axios.get(`${UrlLink}Inventory/Supplier_Master_Link`),
          axios.get(`${UrlLink}Inventory/product_master_Detials_link`),
        ]);
        setSuppliers(suppliersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, [UrlLink]);

  const handleGenerateReport = useCallback(async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${UrlLink}Inventory/Purchase_Reports`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          report_type: reportType,
          supplier_id: selectedSupplier,
          product_id: selectedProduct,
        },
      });
      setReportData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [UrlLink, startDate, endDate, reportType, selectedSupplier, selectedProduct]);

  // --- START: NEW EXPORT AND PRINT FUNCTIONS ---
  
  // New function for client-side Excel export
  const handleExportExcel = useCallback(() => {
    if (reportData.length === 0) {
      alert("No data to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseReport");
    XLSX.writeFile(workbook, `Purchase_Report_${reportType}_${startDate}_to_${endDate}.xlsx`);
  }, [reportData, reportType, startDate, endDate]);

  // New function for printing
  const handlePrint = () => {
    if (reportData.length === 0) {
        alert("No data to print.");
        return;
    }
    const columns = getColumns();
    let reportHTML = `
        <h2 style="text-align:center; font-family: Arial, sans-serif;">Purchase Report (${reportType} wise)</h2>
        <p style="text-align:center; font-family: Arial, sans-serif;">From: ${startDate} To: ${endDate}</p>
        <table border="1" style="width:100%; border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif;">
            <thead>
                <tr style="background:#f2f2f2;">
                    ${columns.map(col => `<th>${col.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${reportData.map(row => `
                    <tr>
                        ${columns.map(col => `<td>${row[col.key] || ''}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    const newWin = window.open("", "_blank");
    newWin.document.write(`
        <html>
            <head><title>Purchase Report</title></head>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
            <body>${reportHTML}</body>
        </html>`);
    newWin.document.close();
    setTimeout(() => { newWin.focus(); newWin.print(); newWin.close(); }, 500);
  };
  // --- END: NEW EXPORT AND PRINT FUNCTIONS ---

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setReportType("date");
    setSelectedSupplier("");
    setSelectedProduct("");
    setReportData([]);
  };

  const getColumns = () => {
    if (reportType === "date") {
      return [
        { key: "date", name: "Date" },
        { key: "po_number", name: "PO Number" },
        { key: "supplier_name", name: "Supplier" },
        { key: "total_items", name: "Total Items" },
        { key: "total_amount", name: "Total Amount" },
        { key: "status", name: "Status" },
      ];
    } else if (reportType === "product") {
      return [
        { key: "product_name", name: "Product Name" },
        { key: "category", name: "Category" },
        { key: "po_number", name: "PO Number" },
        { key: "order_date", name: "Order Date" },
        { key: "supplier_name", name: "Supplier" },
        { key: "po_status", name: "Status" },
        { key: "total_orders", name: "Total Orders" },
        { key: "total_quantity", name: "Total Quantity" },
        { key: "total_value", name: "Total Value" },
        { key: "average_price", name: "Average Price" },
      ];
    } else {
      return [
        { key: "Supplier_Name", name: "Supplier Name" },
        { key: "PO_Number", name: "PO Number" },
        { key: "Order_Date", name: "Order Date" },
        { key: "PO_Status", name: "Status" },
        { key: "Total_Order_Value", name: "Order Value" },
        { key: "Total_Items", name: "Total Items" },
        { key: "Total_Value", name: "Total Value" },
        { key: "Average_Order_Value", name: "Avg Order Value" },
        { key: "Billing_Location", name: "Billing Location" },
        { key: "Shipping_Location", name: "Shipping Location" },
      ];
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Purchase Reports</h3>

        <div className="RegisFormcon_1">
          {/* Date Range */}
          <div className="RegisForm_1">
            <label htmlFor="startDate">Start Date<span>:</span></label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="endDate">End Date<span>:</span></label>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          {/* Report Type */}
          <div className="RegisForm_1">
            <label htmlFor="reportType">Report Type<span>:</span></label>
            <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="date">Date Wise</option>
              <option value="product">Product Wise</option>
              <option value="supplier">Supplier Wise</option>
            </select>
          </div>

          {/* Supplier Filter */}
          {reportType === "supplier" && (
            <>
        <div className="RegisForm_1">
  <label htmlFor="supplier">
    Supplier<span>:</span>
  </label>
  <input
    list="supplier-list"
    id="supplier"
    value={selectedSupplier}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedSupplier(value);

      // Find supplier object and set name
      const supplier = suppliers.find(
        (s) => s.SupplierId === value || s.SupplierName === value
      );
      setSelectedSupplierName(supplier ? supplier.SupplierName : "");
    }}
    placeholder="Select or type supplier"
  />
  <datalist id="supplier-list">
    {suppliers.map((supplier) => (
      <option
        key={supplier.SupplierId} 
        value={supplier.SupplierId} // or supplier.SupplierName if you want typing by name
      >
        {supplier.SupplierName}
      </option>
    ))}
  </datalist>
  </div>
<div className="RegisForm_1">
  <label htmlFor="supplier-name">Supplier Name:</label>
  <input
    id="supplier-name"
    value={selectedSupplierName}
    readOnly
    placeholder="Selected supplier name will appear here"
  />
</div>
</>


          )}

          {/* Product Filter */}
          {reportType === "product" && (
          <>
  <div className="RegisForm_1">
    <label htmlFor="product">
      Product<span>:</span>
    </label>
    <input
      list="product-list"
      id="product"
      value={selectedProduct}
      onChange={(e) => {
        const value = e.target.value;
        setSelectedProduct(value);

        // Find product by code or name
        const product = products.find(
          (p) => p.Item_Code === value || p.Item_Name === value
        );

        // Update the read-only product name
        setSelectedProductName(product ? product.Item_Name : "");
      }}
      placeholder="Select or type product"
    />
    <datalist id="product-list">
      {products.map((product) => (
        <option key={product.id} value={product.Item_Code}>
          {product.Item_Name}
        </option>
      ))}
    </datalist>
  </div>

  <div className="RegisForm_1">
    <label htmlFor="product-name">Product Name:</label>
    <input
      id="product-name"
      value={selectedProductName}
      readOnly
      placeholder="Selected product name will appear here"
    />
  </div>
</>

          )}

          {/* --- UPDATED BUTTONS SECTION --- */}
          <div className="RegisForm_1" style={{ marginLeft: "15px", alignItems: 'center' }}>
            <button
                className="RegisterForm_1_btns"
                onClick={handlePrint}
                title="Print Report"
                disabled={loading || reportData.length === 0}
            >
                <PrintIcon />
            </button>
            <button
                className="RegisterForm_1_btns"
                onClick={handleExportExcel}
                title="Download Excel"
                disabled={loading || reportData.length === 0}
            >
                <BrowserUpdatedIcon />
            </button>
            <button onClick={handleGenerateReport} style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "green", color: "white", marginLeft: "5px" }} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
            <button onClick={clearFilters} style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "black", color: "white", marginLeft: "5px" }}>
              Clear
            </button>
          </div>
        </div>

        {/* Grid */}
        {reportData.length > 0 && (
          <div className="RegisFormcon_1 jjxjx_" style={{ marginTop: '1rem' }}>
            <ReactGrid columns={getColumns()} RowData={reportData} />
          </div>
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default PurchaseReports;
