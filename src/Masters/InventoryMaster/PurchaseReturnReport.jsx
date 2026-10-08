// // import axios from 'axios';
// // import React, { useCallback, useEffect, useState } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import * as XLSX from 'xlsx';
// // import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
// // import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// // import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

// // const PurchaseReturnReport = () => {
// //   const userRecord = useSelector((state) => state.userRecord?.UserData);
// //   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
// //   const [searchQuery, setSearchQuery] = useState({
// //     StoreLocation: allowedStoreId || '',
// //     SupplierName: '',
// //     ReturnFromDate: '',
// //     ReturnToDate: '',
// //     ReturnInvoiceNo: '',
// //   });
// //   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
// //   const toast = useSelector((state) => state.userRecord?.toast);

// //   const dispatchvalue = useDispatch();
// //   const [purchasereturninvoice, setPurchasereturninvoice] = useState([]);
// //   const [fetchalldata, setFetchalldata] = useState([]);
// //   const [SupplierData, setSupplierData] = useState([]);
// //   const today = new Date();
// //   const currentDate = today.toISOString().split('T')[0];


// //   const [StoreLocationData, setStoreLocationData] = useState([]);

// //   useEffect(() => {
// //     if (userRecord?.location) {
// //       axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${userRecord?.location}&forquickgrn=${false}`)
// //         .then((res) => {
// //           const data = res.data;
// //           setStoreLocationData(Array.isArray(data) ? data : [])
// //         })
// //         .catch((err) => {
// //           console.log(err);
// //         })

// //     }

// //   }, [UrlLink, userRecord?.location])

// //   useEffect(() => {
// //     axios
// //       .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
// //         params: {
// //           SupplierName: searchQuery.SupplierName,
// //         },
// //       })
// //       .then((res) => {
// //         const data = res.data;
// //         setSupplierData(Array.isArray(data) ? data : []);
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         setSupplierData([]);
// //       });
// //   }, [UrlLink, searchQuery.SupplierName]);

// //   useEffect(() => {
// //     axios
// //       .get(`${UrlLink}Inventory/Purchase_Return_Invoice_linK`)
// //       .then((res) => {
// //         setPurchasereturninvoice(Array.isArray(res.data) ? res.data : []);
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         setPurchasereturninvoice([]);
// //       });
// //   }, [UrlLink]);

// //   const fetchAllData = useCallback(async () => {
// //     try {
// //       const response = await axios.get(
// //         `${UrlLink}Inventory/get_Purchase_Return_Report`,
// //         { params: searchQuery }
// //       );
// //       const data = response.data;
// //       if (Array.isArray(data)) {
// //         setFetchalldata(data);
// //       } else {
// //         setFetchalldata([]);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   }, [UrlLink, searchQuery]);

// //   useEffect(() => {
// //     fetchAllData();
// //   }, [fetchAllData]);
// //   const AllItemColumn = [
// //     {
// //       key: 'id',
// //       name: 'S.NO',
// //       frozen: true,
// //     },
// //     {
// //       key: 'InvoiceDate',
// //       name: 'Invoice Date',
// //     },

// //     {
// //       key: 'Grn',
// //       name: 'Grn No',
// //     },
// //     {
// //       key: 'Supplier',
// //       name: 'Supplier',
// //     },
// //     {
// //       key: 'GSTIN',
// //       name: 'GSTIN',
// //     },
// //     {
// //       key: 'State',
// //       name: 'Supplier State',
// //     },
// //     {
// //       key: 'Product',
// //       name: 'Product',
// //     },
// //     {
// //       key: 'HSN',
// //       name: 'HSN',
// //     },
// //     {
// //       key: 'Quantity',
// //       name: 'Quantity',
// //     },

// //     {
// //       key: 'ProductValueBeforeDiscount',
// //       name: 'Product Value Before Discount',
// //     },
// //     {
// //       key: 'Discount',
// //       name: 'Discount %',
// //     },
// //     {
// //       key: 'ProductValue',
// //       name: 'Product Value',
// //     },
// //     {
// //       key: 'GST',
// //       name: 'GST',
// //     },
// //     {
// //       key: 'CGSTRate',
// //       name: 'CGSTRate',
// //     },
// //     {
// //       key: 'CGSTAmount',
// //       name: 'CGSTAmount',
// //     },
// //     {
// //       key: 'SGST',
// //       name: 'SGST',
// //     },
// //     {
// //       key: 'SGSTAmount',
// //       name: 'SGST Amount',
// //     },
// //     {
// //       key: 'PurchasePrice',
// //       name: 'Purchase Price',
// //     },
// //     {
// //       key: 'MRP',
// //       name: 'MRP',
// //     },
// //   ];
// //   const fetchAndExportData = async () => {
// //     if (Array.isArray(fetchalldata) && fetchalldata.length > 0) {
// //       const formattedData = fetchalldata.map((item) => ({
// //         SNO: item.id,
// //         InvoiceDate: item.InvoiceDate,
// //         ReceiveDate: item.ReceiveDate,
// //         Grn: item.Grn,
// //         Supplier: item.Supplier,
// //         GSTIN: item.GSTIN,
// //         State: item.State,
// //         Product: item.Product,
// //         HSN: item.HSN,
// //         Quantity: item.Quantity,
// //         ProductValueBeforeDiscount: item.ProductValueBeforeDiscount,
// //         Discount: item.Discount,
// //         ProductValue: item.ProductValue,
// //         GST: item.GST,
// //         CGSTRate: item.CGSTRate,
// //         CGSTAmount: item.CGSTAmount,
// //         SGST: item.SGST,
// //         SGSTAmount: item.SGSTAmount,
// //         PurchasePrice: item.PurchasePrice,
// //         MRP: item.MRP,
// //       }));

// //       const workbook = XLSX.utils.book_new();
// //       const worksheet = XLSX.utils.json_to_sheet(formattedData);

// //       XLSX.utils.book_append_sheet(
// //         workbook,
// //         worksheet,
// //         'Purchase Return Report'
// //       );
// //       XLSX.writeFile(workbook, `PurchaseReturnReport${currentDate}.xlsx`);
// //     } else {
// //       alert('No data available to export.');
// //     }
// //   };

// //   const clearSearchdata = () => {
// //     setSearchQuery({
// //       SupplierName: '',
// //       ReturnFromDate: '',
// //       ReturnToDate: '',
// //       ReturnInvoiceNo: '',
// //       StoreLocation: allowedStoreId || '',
// //     });
// //   };

// //   const handleOnChange = (e) => {
// //     const { name, value } = e.target;
// //     if (name === 'SupplierName') {
// //       setSearchQuery((prev) => ({
// //         ...prev,
// //         [name]: value,
// //         ReturnInvoiceNo: '',
// //       }));
// //     } else if (name === 'ReturnInvoiceNo') {
// //       setSearchQuery((prev) => ({
// //         ...prev,
// //         [name]: value,
// //         SupplierName: '',
// //       }));
// //     } else {
// //       setSearchQuery((prev) => ({
// //         ...prev,
// //         [name]: value,
// //       }));
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="Main_container_app">
// //         <h3>Purchase Return Report</h3>
// //         <div className="RegisFormcon_1">
// //           <div className="RegisForm_1">
// //             <label htmlFor="StoreLocation">Store Location<span>:</span></label>

// //             <select
// //               name='StoreLocation'
// //               value={searchQuery.StoreLocation}
// //               onChange={handleOnChange}
// //             >
// //               <option value=''>Select</option>
// //               {StoreLocationData && StoreLocationData.length > 0 &&
// //                 StoreLocationData.map((ele, ind) => (
// //                   <option key={ind + 'key'} value={ele.id} >{ele.StoreName}</option>
// //                 ))
// //               }
// //             </select>
// //           </div>

// //           <div className="RegisForm_1">
// //             <label htmlFor="SupplierName">
// //               Supplier Name<span>:</span>
// //             </label>
// //             <input
// //               type="text"
// //               name="SupplierName"
// //               value={searchQuery.SupplierName}
// //               list="SupplierName-options"
// //               autoComplete="off"
// //               onChange={handleOnChange}
// //             />
// //             <datalist id="SupplierName-options">
// //               {SupplierData.map((ele, ind) => (
// //                 <option key={ind + 'key'} value={ele.SupplierName}>
// //                   {ele.SupplierName}
// //                 </option>
// //               ))}
// //             </datalist>
// //           </div>
// //           <div className="RegisForm_1">
// //             <label htmlFor="BatchNumber">
// //               Purchase Return InvoiceNo<span>:</span>
// //             </label>

// //             <input
// //               type="text"
// //               name="ReturnInvoiceNo"
// //               value={searchQuery?.ReturnInvoiceNo || ''}
// //               list="GrnInvoiceno-options"
// //               onChange={handleOnChange}
// //               autoComplete="off"
// //             />

// //             <datalist id="GrnInvoiceno-options">
// //               {(purchasereturninvoice || []).map((item) => (
// //                 <option key={item.id} value={item.id}>
// //                   {item.id}
// //                 </option>
// //               ))}
// //             </datalist>
// //           </div>
// //           <div className="RegisForm_1">
// //             <label htmlFor="ReturnFromDate">
// //               Purchase Return From Date<span>:</span>
// //             </label>

// //             <input
// //               type="date"
// //               name="ReturnFromDate"
// //               value={searchQuery.ReturnFromDate}
// //               onChange={handleOnChange}
// //             />
// //           </div>
// //           <div className="RegisForm_1">
// //             <label htmlFor="ReturnToDate">
// //               Purchase Return To Date<span>:</span>
// //             </label>

// //             <input
// //               type="date"
// //               name="ReturnToDate"
// //               value={searchQuery.ReturnToDate}
// //               onChange={handleOnChange}
// //             />
// //           </div>
// //           <div
// //             className="RegisForm_1"
// //             style={{ marginLeft: '15px', width: '100px' }}
// //           >
// //             <button
// //               className="RegisterForm_1_btns"
// //               onClick={fetchAndExportData}
// //               title="File Download"
// //             >
// //               <BrowserUpdatedIcon />
// //             </button>

// //             <button
// //               onClick={clearSearchdata}
// //               style={{
// //                 padding: '2px 8px',
// //                 cursor: 'pointer',
// //                 borderRadius: '5px',
// //                 backgroundColor: 'black',
// //                 color: 'white',
// //               }}
// //             >
// //               Clear
// //             </button>
// //           </div>
// //         </div>
// //         {/* grid */}
// //         {fetchalldata.length !== 0 && searchQuery.StoreLocation !== '' && (
// //           <div className="RegisFormcon_1 jjxjx_">
// //             <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
// //           </div>
// //         )}

// //         <ToastAlert Message={toast.message} Type={toast.type} />
// //       </div>
// //     </>
// //   );
// // };

// // export default PurchaseReturnReport;



// import axios from "axios";
// import React, { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
// import PrintIcon from "@mui/icons-material/Print"; // 1. Added Print Icon
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

// const PurchaseReturnReport = () => {
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
//   const [searchQuery, setSearchQuery] = useState({
//     StoreLocation: allowedStoreId || "",
//     SupplierName: "",
//     ReturnFromDate: "",
//     ReturnToDate: "",
//     ReturnInvoiceNo: "",
//     Grn: "",
//     Product: "",
//   });
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [purchasereturninvoice, setPurchasereturninvoice] = useState([]);
//   const [fetchalldata, setFetchalldata] = useState([]);
//   const [SupplierData, setSupplierData] = useState([]);
//   const today = new Date();
//   const currentDate = today.toISOString().split("T")[0];

//   const [StoreLocationData, setStoreLocationData] = useState([]);

//   useEffect(() => {
//     if (userRecord?.location) {
//       axios
//         .get(
//           `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${
//             userRecord?.location
//           }&forquickgrn=${false}`
//         )
//         .then((res) => {
//           const data = res.data;
//           setStoreLocationData(Array.isArray(data) ? data : []);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, userRecord?.location]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
//         params: {
//           SupplierName: searchQuery.SupplierName,
//         },
//       })
//       .then((res) => {
//         const data = res.data;
//         setSupplierData(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.log(err);
//         setSupplierData([]);
//       });
//   }, [UrlLink, searchQuery.SupplierName]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Purchase_Return_Invoice_linK`)
//       .then((res) => {
//         setPurchasereturninvoice(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((err) => {
//         console.log(err);
//         setPurchasereturninvoice([]);
//       });
//   }, [UrlLink]);

//   const fetchAllData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${UrlLink}Inventory/get_Purchase_Return_Report`,
//         { params: searchQuery }
//       );
//       const data = response.data;
//       if (Array.isArray(data)) {
//         setFetchalldata(data);
//       } else {
//         setFetchalldata([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, [UrlLink, searchQuery]);

//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);
  
//   const AllItemColumn = [
//     { key: "id", name: "S.NO" },
//     { key: "InvoiceDate", name: "Invoice Date" },
//     { key: "Grn", name: "Grn No" },
//     { key: "Supplier", name: "Supplier" },
//     { key: "GSTIN", name: "GSTIN" },
//     { key: "State", name: "Supplier State" },
//     { key: "Product", name: "Product" },
//     { key: "HSN", name: "HSN" },
//     { key: "Quantity", name: "Quantity" },
//     { key: "ProductValueBeforeDiscount", name: "Product Value Before Discount" },
//     { key: "Discount", name: "Discount %" },
//     { key: "ProductValue", name: "Product Value" },
//     { key: "GST", name: "GST" },
//     { key: "CGSTRate", name: "CGSTRate" },
//     { key: "CGSTAmount", name: "CGSTAmount" },
//     { key: "SGST", name: "SGST" },
//     { key: "SGSTAmount", name: "SGST Amount" },
//     { key: "PurchasePrice", name: "Purchase Price" },
//     { key: "MRP", name: "MRP" },
//   ];

//   // --- START: NEW EXPORT AND PRINT FUNCTIONS ---
//   const handleExportExcel = () => {
//     if (!fetchalldata || fetchalldata.length === 0) {
//       alert("No data to export.");
//       return;
//     }
//     const worksheet = XLSX.utils.json_to_sheet(fetchalldata);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseReturnReport");
//     XLSX.writeFile(workbook, `Purchase_Return_Report_${currentDate}.xlsx`);
//   };

//   const handlePrint = () => {
//     if (!fetchalldata || fetchalldata.length === 0) {
//       alert("No data to print.");
//       return;
//     }
//     let reportHTML = `
//         <h2 style="text-align:center; font-family: Arial, sans-serif;">Purchase Return Report</h2>
//         <table border="1" style="width:100%; border-collapse: collapse; font-size: 11px; font-family: Arial, sans-serif;">
//             <thead>
//                 <tr style="background:#f2f2f2;">
//                     ${AllItemColumn.map(col => `<th>${col.name}</th>`).join('')}
//                 </tr>
//             </thead>
//             <tbody>
//                 ${fetchalldata.map(row => `
//                     <tr>
//                         ${AllItemColumn.map(col => `<td>${row[col.key] || ''}</td>`).join('')}
//                     </tr>
//                 `).join('')}
//             </tbody>
//         </table>
//     `;
//     const newWin = window.open("", "_blank");
//     newWin.document.write(`
//         <html>
//             <head><title>Purchase Return Report</title></head>
//             <style>
//                 body { font-family: Arial, sans-serif; }
//                 table { width: 100%; border-collapse: collapse; }
//                 th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
//                 th { background-color: #f2f2f2; }
//             </style>
//             <body>${reportHTML}</body>
//         </html>`);
//     newWin.document.close();
//     setTimeout(() => { newWin.focus(); newWin.print(); newWin.close(); }, 500);
//   };
//   // --- END: NEW EXPORT AND PRINT FUNCTIONS ---

//   const clearSearchdata = () => {
//     setSearchQuery({
//       SupplierName: "",
//       ReturnFromDate: "",
//       ReturnToDate: "",
//       ReturnInvoiceNo: "",
//       StoreLocation: allowedStoreId || "",
//       Grn: "",
//       Product: "",
//     });
//   };

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "SupplierName") {
//       setSearchQuery((prev) => ({ ...prev, [name]: value, ReturnInvoiceNo: "" }));
//     } else if (name === "ReturnInvoiceNo") {
//       setSearchQuery((prev) => ({ ...prev, [name]: value, SupplierName: "" }));
//     } else {
//       setSearchQuery((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Purchase Return Report</h3>
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label htmlFor="StoreLocation">Store Location<span>:</span></label>
//             <select name="StoreLocation" value={searchQuery.StoreLocation} onChange={handleOnChange}>
//               <option value="">Select</option>
//               {StoreLocationData?.map((ele, ind) => (
//                 <option key={ind + "key"} value={ele.id}>{ele.StoreName}</option>
//               ))}
//             </select>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="SupplierName">Supplier Name<span>:</span></label>
//             <input type="text" name="SupplierName" value={searchQuery.SupplierName} list="SupplierName-options" autoComplete="off" onChange={handleOnChange} />
//             <datalist id="SupplierName-options">
//               {SupplierData.map((ele, ind) => (
//                 <option key={ind + "key"} value={ele.SupplierName}>{ele.SupplierName}</option>
//               ))}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="BatchNumber">Purchase Return InvoiceNo<span>:</span></label>
//             <input type="text" name="ReturnInvoiceNo" value={searchQuery?.ReturnInvoiceNo || ""} list="GrnInvoiceno-options" onChange={handleOnChange} autoComplete="off" />
//             <datalist id="GrnInvoiceno-options">
//               {(purchasereturninvoice || []).map((item) => (
//                 <option key={item.id} value={item.id}>{item.id}</option>
//               ))}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="ReturnFromDate">Purchase Return From Date<span>:</span></label>
//             <input type="date" name="ReturnFromDate" value={searchQuery.ReturnFromDate} onChange={handleOnChange} />
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="ReturnToDate">Purchase Return To Date<span>:</span></label>
//             <input type="date" name="ReturnToDate" value={searchQuery.ReturnToDate} onChange={handleOnChange} />
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="Grn">GRN No<span>:</span></label>
//             <input type="text" name="Grn" value={searchQuery.Grn || ""} list="Grn-options" onChange={handleOnChange} autoComplete="off" />
//             <datalist id="Grn-options">
//               {[...new Set(fetchalldata.map((item) => item.Grn))].map(
//                 (grn, idx) => (<option key={idx} value={grn} />)
//               )}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="Product">Product<span>:</span></label>
//             <input type="text" name="Product" value={searchQuery.Product || ""} list="Product-options" onChange={handleOnChange} autoComplete="off" />
//             <datalist id="Product-options">
//               {[...new Set(fetchalldata.map((item) => item.Product))].map(
//                 (prod, idx) => (<option key={idx} value={prod} />)
//               )}
//             </datalist>
//           </div>
//           {/* --- UPDATED BUTTONS SECTION --- */}
//           <div className="RegisForm_1" style={{ marginLeft: "15px", alignItems: 'center' }}>
//             <button className="RegisterForm_1_btns" onClick={handlePrint} title="Print Report" disabled={fetchalldata.length === 0}>
//                 <PrintIcon />
//             </button>
//             <button className="RegisterForm_1_btns" onClick={handleExportExcel} title="Download Excel" disabled={fetchalldata.length === 0}>
//                 <BrowserUpdatedIcon />
//             </button>
//             <button onClick={clearSearchdata} style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "black", color: "white", marginLeft: '5px' }}>
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* grid */}
//         {fetchalldata.length > 0 && searchQuery.StoreLocation !== "" && (
//           <div className="RegisFormcon_1 jjxjx_" style={{ marginTop: '1rem' }}>
//             <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
//           </div>
//         )}

//         <ToastAlert Message={toast.message} Type={toast.type} />
//       </div>
//     </>
//   );
// };

// export default PurchaseReturnReport;



// import axios from "axios";
// import React, { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import * as XLSX from "xlsx";
// import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
// import PrintIcon from "@mui/icons-material/Print"; // 1. Added Print Icon
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

// const PurchaseReturnReport = () => {
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
//   const [searchQuery, setSearchQuery] = useState({
//     StoreLocation: allowedStoreId || "",
//     SupplierName: "",
//     ReturnFromDate: "",
//     ReturnToDate: "",
//     ReturnInvoiceNo: "",
//     Grn: "",
//     Product: "",
//   });
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [purchasereturninvoice, setPurchasereturninvoice] = useState([]);
//   const [fetchalldata, setFetchalldata] = useState([]);
//   const [SupplierData, setSupplierData] = useState([]);
//   const today = new Date();
//   const currentDate = today.toISOString().split("T")[0];

//   const [StoreLocationData, setStoreLocationData] = useState([]);

//   useEffect(() => {
//     if (userRecord?.location) {
//       axios
//         .get(
//           `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${
//             userRecord?.location
//           }&forquickgrn=${false}`
//         )
//         .then((res) => {
//           const data = res.data;
//           setStoreLocationData(Array.isArray(data) ? data : []);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, userRecord?.location]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
//         params: {
//           SupplierName: searchQuery.SupplierName,
//         },
//       })
//       .then((res) => {
//         const data = res.data;
//         setSupplierData(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.log(err);
//         setSupplierData([]);
//       });
//   }, [UrlLink, searchQuery.SupplierName]);

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}Inventory/Purchase_Return_Invoice_linK`)
//       .then((res) => {
//         setPurchasereturninvoice(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((err) => {
//         console.log(err);
//         setPurchasereturninvoice([]);
//       });
//   }, [UrlLink]);

//   const fetchAllData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${UrlLink}Inventory/get_Purchase_Return_Report`,
//         { params: searchQuery }
//       );
//       const data = response.data;
//       if (Array.isArray(data)) {
//         setFetchalldata(data);
//       } else {
//         setFetchalldata([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }, [UrlLink, searchQuery]);

//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);
  
//   const AllItemColumn = [
//     { key: "id", name: "S.NO" },
//     { key: "InvoiceDate", name: "Invoice Date" },
//     { key: "Grn", name: "Grn No" },
//     { key: "Supplier", name: "Supplier" },
//     { key: "GSTIN", name: "GSTIN" },
//     { key: "State", name: "Supplier State" },
//     { key: "Product", name: "Product" },
//     { key: "HSN", name: "HSN" },
//     { key: "Quantity", name: "Quantity" },
//     { key: "ProductValueBeforeDiscount", name: "Product Value Before Discount" },
//     { key: "Discount", name: "Discount %" },
//     { key: "ProductValue", name: "Product Value" },
//     { key: "GST", name: "GST" },
//     { key: "CGSTRate", name: "CGSTRate" },
//     { key: "CGSTAmount", name: "CGSTAmount" },
//     { key: "SGST", name: "SGST" },
//     { key: "SGSTAmount", name: "SGST Amount" },
//     { key: "PurchasePrice", name: "Purchase Price" },
//     { key: "MRP", name: "MRP" },
//   ];

//   // --- START: NEW EXPORT AND PRINT FUNCTIONS ---
//   const handleExportExcel = () => {
//     if (!fetchalldata || fetchalldata.length === 0) {
//       alert("No data to export.");
//       return;
//     }
//     const worksheet = XLSX.utils.json_to_sheet(fetchalldata);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseReturnReport");
//     XLSX.writeFile(workbook, `Purchase_Return_Report_${currentDate}.xlsx`);
//   };

//   const handlePrint = () => {
//     if (!fetchalldata || fetchalldata.length === 0) {
//       alert("No data to print.");
//       return;
//     }
//     let reportHTML = `
//         <h2 style="text-align:center; font-family: Arial, sans-serif;">Purchase Return Report</h2>
//         <table border="1" style="width:100%; border-collapse: collapse; font-size: 11px; font-family: Arial, sans-serif;">
//             <thead>
//                 <tr style="background:#f2f2f2;">
//                     ${AllItemColumn.map(col => `<th>${col.name}</th>`).join('')}
//                 </tr>
//             </thead>
//             <tbody>
//                 ${fetchalldata.map(row => `
//                     <tr>
//                         ${AllItemColumn.map(col => `<td>${row[col.key] || ''}</td>`).join('')}
//                     </tr>
//                 `).join('')}
//             </tbody>
//         </table>
//     `;
//     const newWin = window.open("", "_blank");
//     newWin.document.write(`
//         <html>
//             <head><title>Purchase Return Report</title></head>
//             <style>
//                 body { font-family: Arial, sans-serif; }
//                 table { width: 100%; border-collapse: collapse; }
//                 th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
//                 th { background-color: #f2f2f2; }
//             </style>
//             <body>${reportHTML}</body>
//         </html>`);
//     newWin.document.close();
//     setTimeout(() => { newWin.focus(); newWin.print(); newWin.close(); }, 500);
//   };
//   // --- END: NEW EXPORT AND PRINT FUNCTIONS ---

//   const clearSearchdata = () => {
//     setSearchQuery({
//       SupplierName: "",
//       ReturnFromDate: "",
//       ReturnToDate: "",
//       ReturnInvoiceNo: "",
//       StoreLocation: allowedStoreId || "",
//       Grn: "",
//       Product: "",
//     });
//   };

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "SupplierName") {
//       setSearchQuery((prev) => ({ ...prev, [name]: value, ReturnInvoiceNo: "" }));
//     } else if (name === "ReturnInvoiceNo") {
//       setSearchQuery((prev) => ({ ...prev, [name]: value, SupplierName: "" }));
//     } else {
//       setSearchQuery((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <>
//       <div className="Main_container_app">
//         <h3>Purchase Return Report</h3>
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label htmlFor="StoreLocation">Store Location<span>:</span></label>
//             <select name="StoreLocation" value={searchQuery.StoreLocation} onChange={handleOnChange}>
//               <option value="">Select</option>
//               {StoreLocationData?.map((ele, ind) => (
//                 <option key={ind + "key"} value={ele.id}>{ele.StoreName}</option>
//               ))}
//             </select>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="SupplierName">Supplier Name<span>:</span></label>
//             <input type="text" name="SupplierName" value={searchQuery.SupplierName} list="SupplierName-options" autoComplete="off" onChange={handleOnChange} />
//             <datalist id="SupplierName-options">
//               {SupplierData.map((ele, ind) => (
//                 <option key={ind + "key"} value={ele.SupplierName}>{ele.SupplierName}</option>
//               ))}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="BatchNumber">Purchase Return InvoiceNo<span>:</span></label>
//             <input type="text" name="ReturnInvoiceNo" value={searchQuery?.ReturnInvoiceNo || ""} list="GrnInvoiceno-options" onChange={handleOnChange} autoComplete="off" />
//             <datalist id="GrnInvoiceno-options">
//               {(purchasereturninvoice || []).map((item) => (
//                 <option key={item.id} value={item.id}>{item.id}</option>
//               ))}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="ReturnFromDate">Purchase Return From Date<span>:</span></label>
//             <input type="date" name="ReturnFromDate" value={searchQuery.ReturnFromDate} onChange={handleOnChange} />
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="ReturnToDate">Purchase Return To Date<span>:</span></label>
//             <input type="date" name="ReturnToDate" value={searchQuery.ReturnToDate} onChange={handleOnChange} />
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="Grn">GRN No<span>:</span></label>
//             <input type="text" name="Grn" value={searchQuery.Grn || ""} list="Grn-options" onChange={handleOnChange} autoComplete="off" />
//             <datalist id="Grn-options">
//               {[...new Set(fetchalldata.map((item) => item.Grn))].map(
//                 (grn, idx) => (<option key={idx} value={grn} />)
//               )}
//             </datalist>
//           </div>
//           <div className="RegisForm_1">
//             <label htmlFor="Product">Product<span>:</span></label>
//             <input type="text" name="Product" value={searchQuery.Product || ""} list="Product-options" onChange={handleOnChange} autoComplete="off" />
//             <datalist id="Product-options">
//               {[...new Set(fetchalldata.map((item) => item.Product))].map(
//                 (prod, idx) => (<option key={idx} value={prod} />)
//               )}
//             </datalist>
//           </div>
//           {/* --- UPDATED BUTTONS SECTION --- */}
//           <div className="RegisForm_1" style={{ marginLeft: "15px", alignItems: 'center' }}>
//             <button className="RegisterForm_1_btns" onClick={handlePrint} title="Print Report" disabled={fetchalldata.length === 0}>
//                 <PrintIcon />
//             </button>
//             <button className="RegisterForm_1_btns" onClick={handleExportExcel} title="Download Excel" disabled={fetchalldata.length === 0}>
//                 <BrowserUpdatedIcon />
//             </button>
//             <button onClick={clearSearchdata} style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "black", color: "white", marginLeft: '5px' }}>
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* grid */}
//         {fetchalldata.length > 0 && searchQuery.StoreLocation !== "" && (
//           <div className="RegisFormcon_1 jjxjx_" style={{ marginTop: '1rem' }}>
//             <ReactGrid columns={AllItemColumn} RowData={fetchalldata} />
//           </div>
//         )}

//         <ToastAlert Message={toast.message} Type={toast.type} />
//       </div>
//     </>
//   );
// };

// export default PurchaseReturnReport;


import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import PrintIcon from "@mui/icons-material/Print"; // 1. Added Print Icon
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

const PurchaseReturnReport = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const allowedStoreId = userRecord?.inventory_access?.[0]?.Store_Id || "";
  const [searchQuery, setSearchQuery] = useState({
    StoreLocation: allowedStoreId || "",
    SupplierName: "",
    ReturnFromDate: "",
    ReturnToDate: "",
    ReturnInvoiceNo: "",
    Grn: "",
    Product: "",
  });
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [purchasereturninvoice, setPurchasereturninvoice] = useState([]);
  const [fetchalldata, setFetchalldata] = useState([]);
  const [SupplierData, setSupplierData] = useState([]);
  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];

  const [StoreLocationData, setStoreLocationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//   let filtered = fetchalldata;

//   // Filter by GRN
//   if (searchQuery.Grn && searchQuery.Grn.trim() !== "") {
//     filtered = filtered.filter((item) =>
//       String(item.Grn).toLowerCase().includes(searchQuery.Grn.toLowerCase())
//     );
//   }

//   // Filter by Product
//   if (searchQuery.Product && searchQuery.Product.trim() !== "") {
//     filtered = filtered.filter((item) =>
//       String(item.Product).toLowerCase().includes(searchQuery.Product.toLowerCase())
//     );
//   }

//   // Filter by Supplier Name
//   if (searchQuery.SupplierName && searchQuery.SupplierName.trim() !== "") {
//     filtered = filtered.filter((item) =>
//       String(item.Supplier).toLowerCase().includes(searchQuery.SupplierName.toLowerCase())
//     );
//   }

//   setFilteredData(filtered);
// }, [searchQuery.Grn, searchQuery.Product, searchQuery.SupplierName, fetchalldata]);

  useEffect(() => {
  let filtered = fetchalldata;

  // GRN filter
  if (searchQuery.Grn?.trim()) {
    filtered = filtered.filter((item) =>
      String(item.Grn).toLowerCase().includes(searchQuery.Grn.toLowerCase())
    );
  }

  // Product filter
  if (searchQuery.Product?.trim()) {
    filtered = filtered.filter((item) =>
      String(item.Product).toLowerCase().includes(searchQuery.Product.toLowerCase())
    );
  }

  // Supplier filter
  if (searchQuery.SupplierName?.trim()) {
    filtered = filtered.filter((item) =>
      String(item.Supplier).toLowerCase().includes(searchQuery.SupplierName.toLowerCase())
    );
  }

  setFilteredData(filtered);
 }, [searchQuery.Grn, searchQuery.Product, searchQuery.SupplierName, fetchalldata]);



  useEffect(() => {
    if (userRecord?.location) {
      axios
        .get(
          `${UrlLink}Masters/Inventory_Master_Detials_link?SearchLocation=${
            userRecord?.location
          }&forquickgrn=${false}`
        )
        .then((res) => {
          const data = res.data;
          setStoreLocationData(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [UrlLink, userRecord?.location]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Supplier_Data_Get?ForQuickGrn=${true}`, {
        params: {
          SupplierName: searchQuery.SupplierName,
        },
      })
      .then((res) => {
        const data = res.data;
        setSupplierData(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setSupplierData([]);
      });
  }, [UrlLink, searchQuery.SupplierName]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Inventory/Purchase_Return_Invoice_linK`)
      .then((res) => {
        setPurchasereturninvoice(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setPurchasereturninvoice([]);
      });
  }, [UrlLink]);

  const fetchAllData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${UrlLink}Inventory/get_Purchase_Return_Report`,
        { params: searchQuery }
      );
      const data = response.data;
      if (Array.isArray(data)) {
        setFetchalldata(data);
      } else {
        setFetchalldata([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [UrlLink, searchQuery]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  
  const AllItemColumn = [
    { key: "id", name: "S.NO" },
    { key: "InvoiceDate", name: "Invoice Date" },
    { key: "Grn", name: "Grn No" },
    { key: "Supplier", name: "Supplier" },
    { key: "GSTIN", name: "GSTIN" },
    { key: "State", name: "Supplier State" },
    { key: "Product", name: "Product" },
    { key: "HSN", name: "HSN" },
    { key: "Quantity", name: "Quantity" },
    { key: "ProductValueBeforeDiscount", name: "Product Value Before Discount" },
    { key: "Discount", name: "Discount %" },
    { key: "ProductValue", name: "Product Value" },
    { key: "GST", name: "GST" },
    { key: "CGSTRate", name: "CGSTRate" },
    { key: "CGSTAmount", name: "CGSTAmount" },
    { key: "SGST", name: "SGST" },
    { key: "SGSTAmount", name: "SGST Amount" },
    { key: "PurchasePrice", name: "Purchase Price" },
    { key: "MRP", name: "MRP" },
  ];

  // --- START: NEW EXPORT AND PRINT FUNCTIONS ---
  // const handleExportExcel = () => {
  //   if (!fetchalldata || fetchalldata.length === 0) {
  //     alert("No data to export.");
  //     return;
  //   }
  //   const worksheet = XLSX.utils.json_to_sheet(fetchalldata);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseReturnReport");
  //   XLSX.writeFile(workbook, `Purchase_Return_Report_${currentDate}.xlsx`);
  // };

   const handleExportExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseReturnReport");
    XLSX.writeFile(workbook, `Purchase_Return_Report_${currentDate}.xlsx`);
  };


  // const handlePrint = () => {
  //   if (!fetchalldata || fetchalldata.length === 0) {
  //     alert("No data to print.");
  //     return;
  //   }
  //   let reportHTML = `
  //       <h2 style="text-align:center; font-family: Arial, sans-serif;">Purchase Return Report</h2>
  //       <table border="1" style="width:100%; border-collapse: collapse; font-size: 11px; font-family: Arial, sans-serif;">
  //           <thead>
  //               <tr style="background:#f2f2f2;">
  //                   ${AllItemColumn.map(col => `<th>${col.name}</th>`).join('')}
  //               </tr>
  //           </thead>
  //           <tbody>
  //               ${fetchalldata.map(row => `
  //                   <tr>
  //                       ${AllItemColumn.map(col => `<td>${row[col.key] || ''}</td>`).join('')}
  //                   </tr>
  //               `).join('')}
  //           </tbody>
  //       </table>
  //   `;
  //   const newWin = window.open("", "_blank");
  //   newWin.document.write(`
  //       <html>
  //           <head><title>Purchase Return Report</title></head>
  //           <style>
  //               body { font-family: Arial, sans-serif; }
  //               table { width: 100%; border-collapse: collapse; }
  //               th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
  //               th { background-color: #f2f2f2; }
  //           </style>
  //           <body>${reportHTML}</body>
  //       </html>`);
  //   newWin.document.close();
  //   setTimeout(() => { newWin.focus(); newWin.print(); newWin.close(); }, 500);
  // };
  // --- END: NEW EXPORT AND PRINT FUNCTIONS ---


    const handlePrint = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to print.");
      return;
    }

    let reportHTML = `
      <h2 style="text-align:center; font-family: Arial, sans-serif;">Purchase Return Report</h2>
      <table border="1" style="width:100%; border-collapse: collapse; font-size: 11px; font-family: Arial, sans-serif;">
          <thead>
              <tr style="background:#f2f2f2;">
                  ${AllItemColumn.map((col) => `<th>${col.name}</th>`).join("")}
              </tr>
          </thead>
          <tbody>
              ${filteredData
                .map(
                  (row) => `
                  <tr>
                      ${AllItemColumn.map(
                        (col) => `<td>${row[col.key] || ""}</td>`
                      ).join("")}
                  </tr>
              `
                )
                .join("")}
          </tbody>
      </table>
  `;

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
          <head><title>Purchase Return Report</title></head>
          <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
              th { background-color: #f2f2f2; }
          </style>
          <body>${reportHTML}</body>
      </html>
  `);
    newWin.document.close();
    setTimeout(() => {
      newWin.focus();
      newWin.print();
      newWin.close();
    }, 500);
  };


  const clearSearchdata = () => {
    setSearchQuery({
      SupplierName: "",
      ReturnFromDate: "",
      ReturnToDate: "",
      ReturnInvoiceNo: "",
      StoreLocation: allowedStoreId || "",
      Grn: "",
      Product: "",
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "SupplierName") {
      setSearchQuery((prev) => ({ ...prev, [name]: value, ReturnInvoiceNo: "" }));
    } else if (name === "ReturnInvoiceNo") {
      setSearchQuery((prev) => ({ ...prev, [name]: value, SupplierName: "" }));
    } else {
      setSearchQuery((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Purchase Return Reporttt</h3>
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label htmlFor="StoreLocation">Store Location<span>:</span></label>
            <select name="StoreLocation" value={searchQuery.StoreLocation} onChange={handleOnChange}>
              <option value="">Select</option>
              {StoreLocationData?.map((ele, ind) => (
                <option key={ind + "key"} value={ele.id}>{ele.StoreName}</option>
              ))}
            </select>
          </div>
          
          <div className="RegisForm_1">
            <label htmlFor="SupplierName">Supplier Name<span>:</span></label>
            <input type="text" name="SupplierName" value={searchQuery.SupplierName} list="SupplierName-options" autoComplete="off" onChange={handleOnChange} />
            <datalist id="SupplierName-options">
              {SupplierData.map((ele, ind) => (
                <option key={ind + "key"} value={ele.SupplierName}>{ele.SupplierName}</option>
              ))}
            </datalist>
          </div>
          

          <div className="RegisForm_1">
            <label htmlFor="BatchNumber">Purchase Return InvoiceNo<span>:</span></label>
            <input type="text" name="ReturnInvoiceNo" value={searchQuery?.ReturnInvoiceNo || ""} list="GrnInvoiceno-options" onChange={handleOnChange} autoComplete="off" />
            <datalist id="GrnInvoiceno-options">
              {(purchasereturninvoice || []).map((item) => (
                <option key={item.id} value={item.id}>{item.id}</option>
              ))}
            </datalist>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="ReturnFromDate">Purchase Return From Date<span>:</span></label>
            <input type="date" name="ReturnFromDate" value={searchQuery.ReturnFromDate} onChange={handleOnChange} />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="ReturnToDate">Purchase Return To Date<span>:</span></label>
            <input type="date" name="ReturnToDate" value={searchQuery.ReturnToDate} onChange={handleOnChange} />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="Grn">GRN No<span>:</span></label>
            <input type="text" name="Grn" value={searchQuery.Grn || ""} list="Grn-options" onChange={handleOnChange} autoComplete="off" />
            <datalist id="Grn-options">
              {[...new Set(fetchalldata.map((item) => item.Grn))].map(
                (grn, idx) => (<option key={idx} value={grn} />)
              )}
            </datalist>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="Product">Product<span>:</span></label>
            <input type="text" name="Product" value={searchQuery.Product || ""} list="Product-options" onChange={handleOnChange} autoComplete="off" />
            <datalist id="Product-options">
              {[...new Set(fetchalldata.map((item) => item.Product))].map(
                (prod, idx) => (<option key={idx} value={prod} />)
              )}
            </datalist>
          </div>
          {/* --- UPDATED BUTTONS SECTION --- */}
          <div className="RegisForm_1" style={{ marginLeft: "15px", alignItems: 'center' }}>
            <button className="RegisterForm_1_btns" onClick={handlePrint} title="Print Report" disabled={fetchalldata.length === 0}>
                <PrintIcon />
            </button>
            <button className="RegisterForm_1_btns" onClick={handleExportExcel} title="Download Excel" disabled={fetchalldata.length === 0}>
                <BrowserUpdatedIcon />
            </button>
            <button onClick={clearSearchdata} style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", backgroundColor: "black", color: "white", marginLeft: '5px' }}>
              Clear
            </button>
          </div>
        </div>

        {/* grid */}
        {fetchalldata.length > 0 && searchQuery.StoreLocation !== "" && (
          <div className="RegisFormcon_1 jjxjx_" style={{ marginTop: '1rem' }}>
            {/* <ReactGrid columns={AllItemColumn} RowData={fetchalldata} /> */}
            <ReactGrid columns={AllItemColumn} RowData={filteredData} />
          </div>
        )}

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
};

export default PurchaseReturnReport;

