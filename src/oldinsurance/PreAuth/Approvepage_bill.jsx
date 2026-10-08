// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

// function Approvepage_bill() {
//   const location = useLocation();
//   const rowData = location.state?.row; // 👈 comes from Dashboard
//   const [history, setHistory] = useState([]);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   useEffect(() => {
//     if (!rowData) return;

//     axios
//       .get(`${UrlLink}Insurance/GetPreauthHistory?registrationId=${rowData.RegistrationId}`)
//       .then((response) => {
//         setHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching preauth history:", error);
//       });
//   }, [rowData, UrlLink]);

//  const columns =[
//      { key: "preauth_id", name: "Preauth ID", frozen: true },
//     { key: "preauth_request_amt", name: "Requested Amount" },
//     { key: "approved_amt", name: "Approved Amount" },
//     { key: "requested_date", name: "Requested Date" },
//     { key: "approved_date", name: "Approved Date" },
//     { key: "created_by", name: "Created By" },
//  ]

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Preauth Transaction History</h2>
//       <p>
//         <b>Patient Name:</b> {rowData?.PatientName}
//       </p>
//       <p>
//         <b>MRN:</b> {rowData?.RegistrationId}
//       </p>

//       <div style={{ height: "400px", marginTop: "20px" }}>
//         <ReactGrid
//           columns={columns}
//           RowData={history}

//         />
//       </div>
//     </div>
//   );
// }

// export default Approvepage_bill;

//beffore print
// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

// function Approvepage_bill() {
//   const location = useLocation();
//   const rowData = location.state?.row; // 👈 comes from Dashboard
//   const [history, setHistory] = useState([]);
//   const [newRequestAmt, setNewRequestAmt] = useState("");
//   const [newApprovedAmt, setNewApprovedAmt] = useState("");
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);

//   // ✅ Fetch history on load

//   const getdata = ()=>{
//   if (!rowData) return;

//   axios
//   .get(
//         `${UrlLink}Insurance/GetPreauthHistory?registrationId=${rowData.RegistrationId}`
//       )
//       .then((response) => {
//         setHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching preauth history:", error);
//       });

//       }
//       useEffect(() => {
// getdata();

//   }, [UrlLink]);

//   // ✅ Columns for the grid
//   const columns = useMemo(() => {
//     return [
//       { key: "preauth_id", name: "Preauth ID", frozen: true },
//       { key: "preauth_request_amt", name: "Requested Amount" },
//       { key: "approved_amt", name: "Approved Amount" },
//       { key: "requested_date", name: "Requested Date" },
//       { key: "approved_date", name: "Approved Date" },
//       { key: "created_by", name: "Created By" },
//       {
//         key: "action",
//         name: "Action",
//         renderCell: ({ row }) => (
//           <button
//             onClick={() => {
//               const newRequest = prompt(
//                 "Enter new Request Amount:",
//                 row.preauth_request_amt
//               );
//               const newApproved = prompt(
//                 "Enter new Approved Amount:",
//                 row.approved_amt
//               );

//               if (newRequest !== null && newApproved !== null) {
//                 const params = {
//                   preauth_id: row.preauth_id,
//                   preauth_request_amt: newRequest,
//                   approved_amt: newApproved,
//                   created_by: UserData?.username,
//                 };

//                 axios
//                   .post(`${UrlLink}Insurance/UpdatePreauthHistory`, params)
//                   .then(() => {
//                     getdata();
//                     setHistory((prev) =>
//                       prev.map((item) =>
//                         item.preauth_id === row.preauth_id
//                           ? { ...item, ...params }
//                           : item
//                       )
//                     );
//                   })
//                   .catch((error) => {
//                     console.error("Error updating preauth:", error);
//                   });
//               }
//             }}
//           >
//             Edit
//           </button>
//         ),
//       },
//     ];
//   }, [UrlLink, UserData]);

//   const handleAddPreauth = () => {
//     if (!newRequestAmt) {
//       alert("Please enter Request Amount");
//       return;
//     }

//     const params = {
//       RegistrationId: rowData?.RegistrationId,
//       preauth_request_amt: newRequestAmt,
//       approved_amt: newApprovedAmt,
//       created_by: UserData?.username || "system",
//     };

//     axios
//       .post(`${UrlLink}Insurance/AddPreauthHistory`, params)
//       .then((response) => {
//         getdata();

//         // append new row from backend response
//         setHistory((prev) => [...prev, response.data]);
//         setNewRequestAmt("");
//         setNewApprovedAmt("");
//       })
//       .catch((error) => {
//         console.error("Error adding preauth:", error);
//       });
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Preauth Transaction History</h2>
//       <p>
//         <b>Patient Name:</b> {rowData?.PatientName}
//       </p>
//       <p>
//         <b>MRN:</b> {rowData?.RegistrationId}
//       </p>

//       {/* ✅ Input form above grid */}
//       <div style={{ marginBottom: "20px" }}>
//         <h3>Add New Preauth Record</h3>
//         <input
//           type="number"
//           placeholder="Request Amount"
//           value={newRequestAmt}
//           onChange={(e) => setNewRequestAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <input
//           type="number"
//           placeholder="Approved Amount"
//           value={newApprovedAmt}
//           onChange={(e) => setNewApprovedAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <button onClick={handleAddPreauth}>Submit</button>
//       </div>

//       {/* ✅ Grid */}
//       <div style={{ height: "400px", marginTop: "20px" }}>
//         <ReactGrid columns={columns} RowData={history} />
//       </div>
//     </div>
//   );
// }

// export default Approvepage_bill;

// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

// function Approvepage_bill() {
//   const location = useLocation();
//   const rowData = location.state?.row;
//   const [history, setHistory] = useState([]);
//   const [newRequestAmt, setNewRequestAmt] = useState("");
//   const [newApprovedAmt, setNewApprovedAmt] = useState("");
//   const [billingData, setBillingData] = useState([]);
//   const [showBill, setShowBill] = useState(false);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);

//   // ✅ Fetch history on load
//   const getdata = () => {
//     if (!rowData) return;

//     axios
//       .get(
//         `${UrlLink}Insurance/GetPreauthHistory?registrationId=${rowData.RegistrationId}`
//       )
//       .then((response) => {
//         setHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching preauth history:", error);
//       });
//   };

//   useEffect(() => {
//     getdata();
//   }, [UrlLink]);

//   // ✅ Fetch IP Billing Service List
//   useEffect(() => {
//     if (rowData && rowData.RegistrationId) {
//       axios
//         .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
//           params: {
//             QueueList_ID: rowData.RegistrationId,
//           },
//         })
//         .then((res) => {
//           let GetIPBillingdata = res.data.Billing_data;
//           let GetIPBillingdataService = res.data.services;
//           let GetIPRoomServices = res.data.Room_data?.RoomDatas || [];
//           let GetIPPharmacy = res.data.pharmacy_list || [];
//           let GetOT = res.data.OT_data || [];
//           let GetLab = res.data.Lab_list || [];
//           let GetRad = res.data.Rad_list || [];
//           let GetInterim = res.data.InterimList || [];

//           console.log("GetIPBillingdata", GetIPBillingdata);
//           console.log("GetIPBillingdataService", GetIPBillingdataService);
//           console.log("GetIPRoomServices", GetIPRoomServices);

//           if (GetIPBillingdata && Object.values(GetIPBillingdata).length > 0) {
//             // Map over GetIPBillingdataService to get service data
//             let mappedServiceData = GetIPBillingdataService.map(
//               (service, index) => {
//                 return {
//                   S_No: index + 1,
//                   ServiceType: service.category,
//                   VoucherNo: service.VoucherNo,
//                   SelectItemName: service.service_subcategory,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                 };
//               }
//             );

//             let serviceCount = mappedServiceData.length;

//             // Map over GetIPPharmacy to get pharmacy service data
//             let mappedPharmacyServiceData = GetIPPharmacy.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1,
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 Charges: parseFloat(service.rate),
//                 Amount: "",
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: 0.0,
//                 GST: 0.0,
//                 NetAmount: parseFloat(service.total),
//                 Quantity: service.Units,
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//               };
//             });
//             serviceCount += mappedPharmacyServiceData.length;

//             // Map room services
//             let mappedRoomServiceData = GetIPRoomServices.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   ServiceType: "ROOM CHARGES",
//                   SelectItemName: service.SelectItemName || `${service.WardName}-${service.Room_No}-${service.Bed_No}`,
//                   Charges: parseFloat(service.Charge),
//                   Amount: parseFloat(service.Total_Current_Charge),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST,
//                   NetAmount: parseFloat(service.Total_amount),
//                   Quantity: service.Days,
//                   isReimbursable: service.isReimbursable,
//                   Date: service.DateRange,
//                 };
//               }
//             );
//             serviceCount += mappedRoomServiceData.length;

//             // Map OT data
//             let mappedOTData = GetOT.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                 };
//               }
//             );
//             serviceCount += mappedOTData.length;

//             // Map Lab data
//             let mappedLABData = GetLab.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   VoucherNo: service.VoucherNo,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   servicecode: service.servicecode,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                   Requestid: service.Requestid
//                 };
//               }
//             );
//             serviceCount += mappedLABData.length;

//             // Map Radiology data
//             let mappedRadata = GetRad.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   VoucherNo: service.VoucherNo,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   servicecode: service.servicecode,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                   Requestid: service.Requestid
//                 };
//               }
//             );
//             serviceCount += mappedRadata.length;

//             // Map Interim data
//             let mappedInterimData = GetInterim.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1,
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 Charges: parseFloat(service.rate),
//                 Amount: "",
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: 0.0,
//                 GST: 0.0,
//                 NetAmount: parseFloat(service.total),
//                 Quantity: service.Units,
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//               };
//             });

//             // Combine all data
//             const combinedData = [
//               ...mappedServiceData,
//               ...mappedPharmacyServiceData,
//               ...mappedRoomServiceData,
//               ...mappedOTData,
//               ...mappedLABData,
//               ...mappedRadata,
//               ...mappedInterimData
//             ];

//             setBillingData(combinedData);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, rowData]);

//   // ✅ Columns for the grid
//   const columns = useMemo(() => {
//     return [
//       { key: "preauth_id", name: "Preauth ID", frozen: true },
//       { key: "preauth_request_amt", name: "Requested Amount" },
//       { key: "approved_amt", name: "Approved Amount" },
//       { key: "requested_date", name: "Requested Date" },
//       { key: "approved_date", name: "Approved Date" },
//       { key: "created_by", name: "Created By" },
//       {
//         key: "action",
//         name: "Action",
//         renderCell: ({ row }) => (
//           <button
//             onClick={() => {
//               const newRequest = prompt(
//                 "Enter new Request Amount:",
//                 row.preauth_request_amt
//               );
//               const newApproved = prompt(
//                 "Enter new Approved Amount:",
//                 row.approved_amt
//               );

//               if (newRequest !== null && newApproved !== null) {
//                 const params = {
//                   preauth_id: row.preauth_id,
//                   preauth_request_amt: newRequest,
//                   approved_amt: newApproved,
//                   created_by: UserData?.username,
//                 };

//                 axios
//                   .post(`${UrlLink}Insurance/UpdatePreauthHistory`, params)
//                   .then(() => {
//                     getdata();
//                   })
//                   .catch((error) => {
//                     console.error("Error updating preauth:", error);
//                   });
//               }
//             }}
//           >
//             Edit
//           </button>
//         ),
//       },
//     ];
//   }, [UrlLink, UserData]);

//   const handleAddPreauth = () => {
//     if (!newRequestAmt) {
//       alert("Please enter Request Amount");
//       return;
//     }

//     const params = {
//       RegistrationId: rowData?.RegistrationId,
//       preauth_request_amt: newRequestAmt,
//       approved_amt: newApprovedAmt,
//       created_by: UserData?.username || "system",
//     };

//     axios
//       .post(`${UrlLink}Insurance/AddPreauthHistory`, params)
//       .then(() => {
//         getdata();
//         setNewRequestAmt("");
//         setNewApprovedAmt("");
//       })
//       .catch((error) => {
//         console.error("Error adding preauth:", error);
//       });
//   };

//   // Calculate total bill amount
//   const totalBillAmount = billingData.reduce((total, item) => {
//     return total + (parseFloat(item.NetAmount) || 0);
//   }, 0);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Preauth Transaction History</h2>
//       <p>
//         <b>Patient Name:</b> {rowData?.PatientName}
//       </p>
//       <p>
//         <b>MRN:</b> {rowData?.RegistrationId}
//       </p>

//       {/* Bill View Toggle Button */}
//       <div style={{ marginBottom: "20px" }}>
//         <button
//           onClick={() => setShowBill(!showBill)}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginBottom: "10px"
//           }}
//         >
//           {showBill ? "Hide Bill" : "View Bill"} ({billingData.length} items)
//         </button>

//         {showBill && (
//           <div style={{
//             border: "1px solid #ddd",
//             padding: "15px",
//             borderRadius: "5px",
//             marginBottom: "20px",
//             backgroundColor: "#f9f9f9"
//           }}>
//             <h3>Patient Bill Summary</h3>
//             <p><strong>Total Bill Amount: ₹{totalBillAmount.toFixed(2)}</strong></p>

//             <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#f0f0f0" }}>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>S.No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Service Type</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Service Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Rate</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Quantity</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                   {billingData.map((item, index) => (
//                     <tr key={index}>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.S_No}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.ServiceType}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.SelectItemName}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{item.Charges}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Quantity}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{item.NetAmount}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ✅ Input form above grid */}
//       <div style={{ marginBottom: "20px" }}>
//         <h3>Add New Preauth Record</h3>
//         <input
//           type="number"
//           placeholder="Request Amount"
//           value={newRequestAmt}
//           onChange={(e) => setNewRequestAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <input
//           type="number"
//           placeholder="Approved Amount"
//           value={newApprovedAmt}
//           onChange={(e) => setNewApprovedAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <button onClick={handleAddPreauth}>Submit</button>
//       </div>

//       {/* ✅ Grid */}
//       <div style={{ height: "400px", marginTop: "20px" }}>
//         <ReactGrid columns={columns} RowData={history} />
//       </div>
//     </div>
//   );
// }

// export default Approvepage_bill;

// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useReactToPrint } from "react-to-print";
// import { NumberToWords } from "../../OtherComponent/OtherFunctions";

// function Approvepage_bill() {
//   const location = useLocation();
//   const rowData = location.state?.row;
//   const [history, setHistory] = useState([]);
//   const [newRequestAmt, setNewRequestAmt] = useState("");
//   const [newApprovedAmt, setNewApprovedAmt] = useState("");
//   const [billingData, setBillingData] = useState([]);
//   const [showBill, setShowBill] = useState(false);
//   const [printData, setPrintData] = useState(null);
//   const componentRef = useRef();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);

//   // ✅ Fetch history on load
//   const getdata = () => {
//     if (!rowData) return;

//     axios
//       .get(
//         `${UrlLink}Insurance/GetPreauthHistory?registrationId=${rowData.RegistrationId}`
//       )
//       .then((response) => {
//         setHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching preauth history:", error);
//       });
//   };

//   useEffect(() => {
//     getdata();
//   }, [UrlLink]);

//   // ✅ Fetch IP Billing Service List
//   useEffect(() => {
//     if (rowData && rowData.RegistrationId) {
//       axios
//         .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
//           params: {
//             QueueList_ID: rowData.RegistrationId,
//           },
//         })
//         .then((res) => {
//           let GetIPBillingdata = res.data.Billing_data;
//           let GetIPBillingdataService = res.data.services;
//           let GetIPRoomServices = res.data.Room_data?.RoomDatas || [];
//           let GetIPPharmacy = res.data.pharmacy_list || [];
//           let GetOT = res.data.OT_data || [];
//           let GetLab = res.data.Lab_list || [];
//           let GetRad = res.data.Rad_list || [];
//           let GetInterim = res.data.InterimList || [];

//           if (GetIPBillingdata && Object.values(GetIPBillingdata).length > 0) {
//             // Map over GetIPBillingdataService to get service data
//             let mappedServiceData = GetIPBillingdataService.map(
//               (service, index) => {
//                 return {
//                   S_No: index + 1,
//                   ServiceType: service.category,
//                   VoucherNo: service.VoucherNo,
//                   SelectItemName: service.service_subcategory,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                 };
//               }
//             );

//             let serviceCount = mappedServiceData.length;

//             // Map over GetIPPharmacy to get pharmacy service data
//             let mappedPharmacyServiceData = GetIPPharmacy.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1,
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 Charges: parseFloat(service.rate),
//                 Amount: "",
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: 0.0,
//                 GST: 0.0,
//                 NetAmount: parseFloat(service.total),
//                 Quantity: service.Units,
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//               };
//             });
//             serviceCount += mappedPharmacyServiceData.length;

//             // Map room services
//             let mappedRoomServiceData = GetIPRoomServices.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   ServiceType: "ROOM CHARGES",
//                   SelectItemName: service.SelectItemName || `${service.WardName}-${service.Room_No}-${service.Bed_No}`,
//                   Charges: parseFloat(service.Charge),
//                   Amount: parseFloat(service.Total_Current_Charge),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST,
//                   NetAmount: parseFloat(service.Total_amount),
//                   Quantity: service.Days,
//                   isReimbursable: service.isReimbursable,
//                   Date: service.DateRange,
//                 };
//               }
//             );
//             serviceCount += mappedRoomServiceData.length;

//             // Map OT data
//             let mappedOTData = GetOT.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                 };
//               }
//             );
//             serviceCount += mappedOTData.length;

//             // Map Lab data
//             let mappedLABData = GetLab.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   VoucherNo: service.VoucherNo,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   servicecode: service.servicecode,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                   Requestid: service.Requestid
//                 };
//               }
//             );
//             serviceCount += mappedLABData.length;

//             // Map Radiology data
//             let mappedRadata = GetRad.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   VoucherNo: service.VoucherNo,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   servicecode: service.servicecode,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                   Requestid: service.Requestid
//                 };
//               }
//             );
//             serviceCount += mappedRadata.length;

//             // Map Interim data
//             let mappedInterimData = GetInterim.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1,
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 Charges: parseFloat(service.rate),
//                 Amount: "",
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: 0.0,
//                 GST: 0.0,
//                 NetAmount: parseFloat(service.total),
//                 Quantity: service.Units,
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//               };
//             });

//             // Combine all data
//             const combinedData = [
//               ...mappedServiceData,
//               ...mappedPharmacyServiceData,
//               ...mappedRoomServiceData,
//               ...mappedOTData,
//               ...mappedLABData,
//               ...mappedRadata,
//               ...mappedInterimData
//             ];

//             setBillingData(combinedData);
//             setPrintData({
//               patientData: rowData,
//               billingData: combinedData,
//               clinicData: ClinicDetails,
//               totalAmount: combinedData.reduce((total, item) => total + (parseFloat(item.NetAmount) || 0), 0)
//             });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [UrlLink, rowData, ClinicDetails]);

//   // Print function
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   // ✅ Columns for the grid
//   const columns = useMemo(() => {
//     return [
//       { key: "preauth_id", name: "Preauth ID", frozen: true },
//       { key: "preauth_request_amt", name: "Requested Amount" },
//       { key: "approved_amt", name: "Approved Amount" },
//       { key: "requested_date", name: "Requested Date" },
//       { key: "approved_date", name: "Approved Date" },
//       { key: "created_by", name: "Created By" },
//       {
//         key: "action",
//         name: "Action",
//         renderCell: ({ row }) => (
//           <button
//             onClick={() => {
//               const newRequest = prompt(
//                 "Enter new Request Amount:",
//                 row.preauth_request_amt
//               );
//               const newApproved = prompt(
//                 "Enter new Approved Amount:",
//                 row.approved_amt
//               );

//               if (newRequest !== null && newApproved !== null) {
//                 const params = {
//                   preauth_id: row.preauth_id,
//                   preauth_request_amt: newRequest,
//                   approved_amt: newApproved,
//                   created_by: UserData?.username,
//                 };

//                 axios
//                   .post(`${UrlLink}Insurance/UpdatePreauthHistory`, params)
//                   .then(() => {
//                     getdata();
//                   })
//                   .catch((error) => {
//                     console.error("Error updating preauth:", error);
//                   });
//               }
//             }}
//           >
//             Edit
//           </button>
//         ),
//       },
//     ];
//   }, [UrlLink, UserData]);

//   const handleAddPreauth = () => {
//     if (!newRequestAmt) {
//       alert("Please enter Request Amount");
//       return;
//     }

//     const params = {
//       RegistrationId: rowData?.RegistrationId,
//       preauth_request_amt: newRequestAmt,
//       approved_amt: newApprovedAmt,
//       created_by: UserData?.username || "system",
//     };

//     axios
//       .post(`${UrlLink}Insurance/AddPreauthHistory`, params)
//       .then(() => {
//         getdata();
//         setNewRequestAmt("");
//         setNewApprovedAmt("");
//       })
//       .catch((error) => {
//         console.error("Error adding preauth:", error);
//       });
//   };

//   // Calculate total bill amount
//   const totalBillAmount = billingData.reduce((total, item) => {
//     return total + (parseFloat(item.NetAmount) || 0);
//   }, 0);

//   // Print Component
//   const ForPrintDetailedBill = () => {
//     if (!printData) return null;

//     return (
//       <div ref={componentRef}>
//         <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} id="reactprintcontent">
//           <table className="print-table33">
//             <thead className="print_header" style={{ width: "100%", borderCollapse: "collapse", height: "150px" }}>
//               <tr>
//                 <td colSpan="7" style={{ border: "none" }}>
//                   <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
//                     <div className="new_billing_logo_con">
//                       <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
//                     </div>
//                     <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                       <span>{ClinicDetails?.Cname}</span>
//                       <div>
//                         <span>
//                           {ClinicDetails?.ClinicAddress}, {ClinicDetails?.ClinicCity}, {ClinicDetails?.ClinicState} - {ClinicDetails?.ClinicCode}
//                         </span>
//                       </div>
//                       <div>
//                         Ph: {ClinicDetails?.ClinicMobileNo}, Landline: {ClinicDetails?.ClinicLandLineNo}, Email: {ClinicDetails?.ClinicMailID}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan="7" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "18px" }}>
//                   Detailed Invoice
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan="7">
//                   <div className="new_billing_address new_addn_p037">
//                     <div className="new_billing_address_2 new_billing_address_2_new_up">
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>Patient Name <span>:</span></label>
//                         <h4>{printData.patientData.PatientName}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>Patient ID <span>:</span></label>
//                         <h4>{printData.patientData.RegistrationId}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>Age / Gender <span>:</span></label>
//                         <h4>{printData.patientData.AgeGender}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>Address <span>:</span></label>
//                         <h4>{printData.patientData.Address}</h4>
//                       </div>
//                     </div>
//                     <div className="new_billing_address_2 new_billing_address_2_new_up">
//                       <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                         <label>IP NO <span>:</span></label>
//                         <h4>{printData.patientData.RegistrationId}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                         <label>Invoice Date<span>:</span></label>
//                         <h4>{new Date().toLocaleDateString()}</h4>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td colSpan="7" className="prin_nnrmll_table">
//                   <table style={{ width: "100%", border: "none" }}>
//                     <thead>
//                       <tr style={{ borderTop: "1.5px solid black", borderBottom: "1.5px solid black" }}>
//                         <th style={{ borderTop: "1px solid black" }}>Date</th>
//                         <th style={{ border: "none" }}>Service</th>
//                         <th style={{ border: "none" }}>Item Name</th>
//                         <th style={{ border: "none" }}>Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody style={{ borderBottom: "1.5px solid black", padding: "2px" }}>
//                       {printData.billingData.map((row, index) => (
//                         <tr key={index}>
//                           <td style={{ border: "none" }}>{row.Date}</td>
//                           <td style={{ border: "none" }}>{row.ServiceType}</td>
//                           <td style={{ border: "none" }}>{row.SelectItemName}</td>
//                           <td style={{ border: "none" }}>{row.NetAmount}</td>
//                         </tr>
//                       ))}
//                       <tr style={{ borderTop: "1px solid grey", marginBottom: "10px" }}>
//                         <td colSpan="3" style={{ border: "none", textAlign: "right", fontWeight: "bold" }}>
//                           Total Amount <span>:</span>
//                         </td>
//                         <td style={{ border: "none" }}>
//                           {printData.totalAmount.toFixed(2)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//             </tbody>

//             <tfoot className="print_footerr">
//               <tr className="jjxcdsjjej_"></tr>
//               <tr className="ehdhe_9ikw">
//                 <td className="shshxhxs_secfooter">
//                   <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
//                     <p className="disclaimer23">
//                       This page is created automatically without a signature.
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Preauth Transaction History</h2>
//       <p>
//         <b>Patient Name:</b> {rowData?.PatientName}
//       </p>
//       <p>
//         <b>MRN:</b> {rowData?.RegistrationId}
//       </p>

//       {/* Print Button */}
//       <div style={{ marginBottom: "20px" }}>
//         <button
//           onClick={handlePrint}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#28a745",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginRight: "10px"
//           }}
//         >
//           Print Bill
//         </button>

//         <button
//           onClick={() => setShowBill(!showBill)}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginBottom: "10px"
//           }}
//         >
//           {showBill ? "Hide Bill" : "View Bill"} ({billingData.length} items)
//         </button>

//         {showBill && (
//           <div style={{
//             border: "1px solid #ddd",
//             padding: "15px",
//             borderRadius: "5px",
//             marginBottom: "20px",
//             backgroundColor: "#f9f9f9"
//           }}>
//             <h3>Patient Bill Summary</h3>
//             <p><strong>Total Bill Amount: ₹{totalBillAmount.toFixed(2)}</strong></p>

//             <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#f0f0f0" }}>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>S.No</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Service Type</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Service Name</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Rate</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Quantity</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Amount</th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>Date</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                   {billingData.map((item, index) => (
//                     <tr key={index}>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.S_No}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.ServiceType}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.SelectItemName}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{item.Charges}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Quantity}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{item.NetAmount}</td>
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.Date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ✅ Input form above grid */}
//       <div style={{ marginBottom: "20px" }}>
//         <h3>Add New Preauth Record</h3>
//         <input
//           type="number"
//           placeholder="Request Amount"
//           value={newRequestAmt}
//           onChange={(e) => setNewRequestAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <input
//           type="number"
//           placeholder="Approved Amount"
//           value={newApprovedAmt}
//           onChange={(e) => setNewApprovedAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <button onClick={handleAddPreauth}>Submit</button>
//       </div>

//       {/* ✅ Grid */}
//       <div style={{ height: "400px", marginTop: "20px" }}>
//         <ReactGrid columns={columns} RowData={history} />
//       </div>

//       {/* Print Component (hidden) */}
//       <div style={{ display: "none" }}>
//         <ForPrintDetailedBill />
//       </div>
//     </div>
//   );
// }

// export default Approvepage_bill;

// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import { useReactToPrint } from "react-to-print";
// import { NumberToWords } from "../../OtherComponent/OtherFunctions";

// function Approvepage_bill() {
//   const location = useLocation();
//   const rowData = location.state?.row;
//   const [history, setHistory] = useState([]);
//   const [newRequestAmt, setNewRequestAmt] = useState("");
//   const [newApprovedAmt, setNewApprovedAmt] = useState("");
//   const [billingData, setBillingData] = useState([]);
//   const [showBill, setShowBill] = useState(false);
//   const [showPrintView, setShowPrintView] = useState(false);
//   const componentRef = useRef();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
//   const IP_BillingData = useSelector(
//     (state) => state.Frontoffice?.IPBillingData
//   );
//   const [patientsearch, setpatientsearch] = useState({
//     Search: "",
//   });
//   const [SmartCard, setSmartCard] = useState({
//     SmartCardNo: "",
//   });
//   const [RegisterData, setRegisterData] = useState({
//     PatientId: "",
//     ABHA: "",
//     PatientName: "",
//     AgeGender: "",
//     PhoneNo: "",
//     PatientCategory: "",
//     PatientCategoryName: "",
//     WardName: "",
//     Address: "",
//   });
//   const [AppointmentRegisType, setAppointmentRegisType] = useState("IP");
//   const [SelectedPatient_list, setSelectedPatient_list] = useState({
//     PatientId: "",
//     PatientName: "",
//     PhoneNumber: "",
//     PatientCategory: "General",
//     PatientCategoryType: "",
//     InsuranceName: "",
//     Gender: "",
//     City: "",
//     State: "",
//     PatientAddress: "",
//     Pincode: "",
//     VisitId: "",
//     WardBedNo: "",
//     DischargeDate: "",
//   });
//   const [SelectDatalist, setSelectDatalist] = useState([]);

//   // ✅ Fetch history on load
//   const getdata = () => {
//     if (!rowData) return;

//     axios
//       .get(
//         `${UrlLink}Insurance/GetPreauthHistory?registrationId=${rowData.RegistrationId}`
//       )
//       .then((response) => {
//         setHistory(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching preauth history:", error);
//       });
//   };

//   useEffect(() => {
//     getdata();
//   }, [UrlLink]);

//   useEffect(() => {
//    if (rowData && rowData.RegistrationId) {
//       console.log(rowData,"rowData123")
//       axios
//         .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
//           params: {
//             QueueList_ID: rowData.RegistrationId,
//           },
//         })
//         .then((res) => {
//           let GetIPBillingdata = res.data.Billing_data;
//           let GetIPBillingdataService = res.data.services;
//           let GetIPRoomServices = res.data.Room_data.RoomDatas;
//           let GetIPPharmacy = res.data.pharmacy_list;
//           let GetOT = res.data.OT_data;
//           let GetLab = res.data.Lab_list;
//           let GetRad = res.data.Rad_list;
//           let GetInterim = res.data.InterimList;

//           console.log("GetIPBillingdata", GetIPBillingdata);
//           console.log("GetIPBillingdataService", GetIPBillingdataService);
//           console.log("GetIPRoomServices", GetIPRoomServices);

//           if (Object.values(GetIPBillingdata).length > 5) {
//             // Setting Doctor and Patient details
//             setBillingData((prev) => ({
//               ...prev,
//               DoctorName: GetIPBillingdata.Doctor_ShortName || "",
//               DoctorId: GetIPBillingdata.Doctor_ID || "",
//             }));
//             setpatientsearch((prev) => ({
//               ...prev,
//               Search: IP_BillingData.PatientId,
//             }));
//             setSmartCard((prev) => ({
//               ...prev,
//               SmartCardNo: IP_BillingData.PatientId,
//             }));

//             setRegisterData((prev) => ({
//               ...prev,
//               ABHA: "64-9456-6541-8451",
//               PatientName: IP_BillingData.Patient_Name || "",
//               AgeGender: IP_BillingData.AgeGender || "",
//               PhoneNo: IP_BillingData.PhoneNo || "",
//               PatientCategory: IP_BillingData.PatientCategory || "",
//               PatientCategoryName: IP_BillingData.PatientCategoryName || "",
//               Address: IP_BillingData.Address || "",
//               PatientId: IP_BillingData.PatientId || "",
//               WardName: IP_BillingData.ward || "",
//             }));
//             setAppointmentRegisType(IP_BillingData.VisitType);
//             const lastRoomService =
//               GetIPRoomServices[GetIPRoomServices.length - 1];
//             setSelectedPatient_list((prev) => ({
//               ...prev,
//               PatientId: GetIPBillingdata.PatientId,
//               PatientName: GetIPBillingdata.Patient_Name,
//               PhoneNumber: GetIPBillingdata.PhoneNo,
//               PatientCategory: GetIPBillingdata.PatientCategory,
//               Gender: GetIPBillingdata.Gender,
//               City: GetIPBillingdata.City,
//               State: GetIPBillingdata.State,
//               PatientAddress: GetIPBillingdata.Area,
//               Pincode: GetIPBillingdata.Pincode,
//               RegisterId: GetIPBillingdata.Registration_Id,
//               QueueList_ID: GetIPBillingdata.id,
//               VisitId: GetIPBillingdata.VisitId,
//               DischargeDate: lastRoomService?.Discharge_Date || "Not Available",
//               WardBedNo: `${lastRoomService?.WardName}-${lastRoomService?.Bed_No}`,
//             }));
//             // Map over GetIPBillingdataService to get service data
//             let mappedServiceData = GetIPBillingdataService.map(
//               (service, index) => {
//                 return {
//                   S_No: index + 1, // Add serial number based on index
//                   ServiceType: service.category,
//                   VoucherNo: service.VoucherNo,
//                   SelectItemName: service.service_subcategory,
//                   Charges: parseFloat(service.rate),
//                   Amount: parseFloat(service.rate),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST_Charge,
//                   NetAmount: parseFloat(service.rate),
//                   Quantity: parseFloat(service.Units),
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                 };
//               }
//             );
//             let serviceCount = mappedServiceData.length;
//             // Map over GetIPBillingdataService to get service data
//             // Map over GetIPPharmacy to get pharmacy service data
//             let mappedPharmacyServiceData = GetIPPharmacy.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1,
//                   VoucherNo: service.VoucherNo,
//                   ServiceType: service.category,
//                   SelectItemName: service.service_subcategory,
//                   Charges: parseFloat(service.rate),
//                   Amount: "",
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: 0.0,
//                   GST: 0.0,
//                   NetAmount: parseFloat(service.total),
//                   Quantity: service.Units,
//                   isReimbursable: service.isReimbursable,
//                   Date: service.Date,
//                 };
//               }
//             );
//             serviceCount += mappedPharmacyServiceData.length;

//             let mappedRoomServiceData = GetIPRoomServices.map(
//               (service, index) => {
//                 return {
//                   S_No: serviceCount + index + 1, // Add serial number based on index
//                   ServiceType: "ROOM CHARGES",
//                   // SelectItemName: `${service.WardName}-${service.Room_No}-${service.Bed_No}`,
//                   SelectItemName: service.SelectItemName,
//                   Charges: parseFloat(service.Charge),
//                   Amount: parseFloat(service.Total_Current_Charge),
//                   DiscountType: "",
//                   Discount: "",
//                   GST_per: service.GST_per,
//                   GST: service.GST,
//                   NetAmount: parseFloat(service.Total_amount),
//                   Quantity: service.Days,
//                   isReimbursable: service.isReimbursable,
//                   Date: service.DateRange,
//                 };
//               }
//             );
//             console.log("rooommmm", mappedRoomServiceData);
//             serviceCount += mappedRoomServiceData.length;

//             let mappedOTData = GetOT.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1, // Add serial number based on index
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 Charges: parseFloat(service.rate),
//                 Amount: parseFloat(service.rate),
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: service.GST_per,
//                 GST: service.GST_Charge,
//                 NetAmount: parseFloat(service.rate),
//                 Quantity: parseFloat(service.Units),
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//               };
//             });
//             console.log("ottttt", mappedOTData);

//             let mappedLABData = GetLab.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1, // Add serial number based on index
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 servicecode: service.servicecode,
//                 Charges: parseFloat(service.rate),
//                 Amount: parseFloat(service.rate),
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: service.GST_per,
//                 GST: service.GST_Charge,
//                 NetAmount: parseFloat(service.rate),
//                 Quantity: parseFloat(service.Units),
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//                 Requestid: service.Requestid,
//               };
//             });

//             let mappedRadata = GetRad.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1, // Add serial number based on index
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 servicecode: service.servicecode,
//                 Charges: parseFloat(service.rate),
//                 Amount: parseFloat(service.rate),
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: service.GST_per,
//                 GST: service.GST_Charge,
//                 NetAmount: parseFloat(service.rate),
//                 Quantity: parseFloat(service.Units),
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//                 Requestid: service.Requestid,
//               };
//             });
//             let mappedInterimData = GetInterim.map((service, index) => {
//               return {
//                 S_No: serviceCount + index + 1,
//                 VoucherNo: service.VoucherNo,
//                 ServiceType: service.category,
//                 SelectItemName: service.service_subcategory,
//                 Charges: parseFloat(service.rate),
//                 Amount: "",
//                 DiscountType: "",
//                 Discount: "",
//                 GST_per: 0.0,
//                 GST: 0.0,
//                 NetAmount: parseFloat(service.total),
//                 Quantity: service.Units,
//                 isReimbursable: service.isReimbursable,
//                 Date: service.Date,
//               };
//             });

//             // Only add Adddata if the necessary fields are not empty
//             let Adddata = {
//               ServiceType: GetIPBillingdata.category,
//               SelectItemName: GetIPBillingdata.service_subcategory,
//               Rate: GetIPBillingdata.Service_Fee,
//               Charges: GetIPBillingdata.Service_Fee,
//               Amount: GetIPBillingdata.Service_Fee,
//               DiscountType: "",
//               Discount: "",
//               GST_per: "",
//               Total: GetIPBillingdata.Service_Fee,
//               GST: "",
//               Quantity: 1,
//               DiscountAmount: "",
//               isReimbursable: "No",
//             };

//             // Conditionally add Adddata only if ServiceName and Service_Fee are present
//             if (
//               Adddata.SelectItemName &&
//               Adddata.ServiceType &&
//               Adddata.Service_Fee
//             ) {
//               mappedServiceData = [
//                 Adddata,
//                 ...mappedServiceData,
//                 ...mappedRoomServiceData,
//                 ...mappedPharmacyServiceData,
//                 ...mappedOTData,
//                 ...mappedLABData,
//                 ...mappedRadata,
//                 ...mappedInterimData,
//               ];
//             } else {
//               mappedServiceData = [
//                 ...mappedServiceData,
//                 ...mappedRoomServiceData,
//                 ...mappedPharmacyServiceData,
//                 ...mappedOTData,
//                 ...mappedLABData,
//                 ...mappedRadata,
//                 ...mappedInterimData,
//               ];
//             }

//             // Set the updated service data to SelectDatalist
//             setSelectDatalist(mappedServiceData);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else if (
//       Object.keys(IP_BillingData).length !== 0 &&
//       IP_BillingData?.ServiceProcedureForm === "Lab"
//     ) {
//       setBillingData((prev) => ({
//         ...prev,
//         DoctorName: IP_BillingData.Doctor_ShortName || "",
//         DoctorId: IP_BillingData.DoctorID || "",
//       }));
//       setpatientsearch((prev) => ({
//         ...prev,
//         Search: IP_BillingData.PatientId,
//       }));
//       setSmartCard((prev) => ({
//         ...prev,
//         SmartCardNo: IP_BillingData.PatientId,
//       }));

//       setRegisterData((prev) => ({
//         ...prev,
//         ABHA: "64-9456-6541-8451",
//         PatientName: IP_BillingData.Patient_Name || "",
//         AgeGender: IP_BillingData.AgeGender || "",
//         PhoneNo: IP_BillingData.PhoneNo || "",
//         PatientCategory: IP_BillingData.PatientCategory || "",
//         PatientCategoryName: IP_BillingData.PatientCategoryName || "",
//         Address: IP_BillingData.Address || "",
//         PatientId: IP_BillingData.PatientId || "",
//         WardName: IP_BillingData.ward || "",
//       }));
//       setAppointmentRegisType(IP_BillingData.VisitType);
//       setSelectedPatient_list((prev) => ({
//         ...prev,
//         PatientId: IP_BillingData.PatientId,
//         PatientName: IP_BillingData.Patient_Name,
//         PhoneNumber: IP_BillingData.PhoneNo,
//         PatientCategory: IP_BillingData.PatientCategory,
//         Gender: IP_BillingData.Gender,
//         City: IP_BillingData.City,
//         State: IP_BillingData.State,
//         PatientAddress: IP_BillingData.Area,
//         Pincode: IP_BillingData.Pincode,
//         RegisterId: IP_BillingData.Registration_Id,
//         QueueList_ID: IP_BillingData.id,
//         // VisitId: IP_BillingData.VisitId,
//       }));
//       setSelectDatalist(IP_BillingData?.ItemDetails);
//     } else if (
//       Object.keys(IP_BillingData).length !== 0 &&
//       IP_BillingData?.ServiceProcedureForm === "RADIOLOGY"
//     ) {
//       setBillingData((prev) => ({
//         ...prev,
//         DoctorName: IP_BillingData?.Doctor_ShortName || "",
//         DoctorId: IP_BillingData?.DoctorId || "",
//       }));
//       setpatientsearch((prev) => ({
//         ...prev,
//         Search: IP_BillingData?.PatientId,
//       }));
//       setSmartCard((prev) => ({
//         ...prev,
//         SmartCardNo: IP_BillingData?.PatientId,
//       }));

//       setRegisterData((prev) => ({
//         ...prev,
//         ABHA: "64-9456-6541-8451",
//         PatientName: IP_BillingData?.Patient_Name || "",
//         AgeGender: IP_BillingData?.AgeGender || "",
//         PhoneNo: IP_BillingData?.PhoneNo || "",
//         PatientCategory: IP_BillingData?.PatientCategory || "",
//         PatientCategoryName: IP_BillingData?.PatientCategoryName || "",
//         Address: IP_BillingData?.Address || "",
//         PatientId: IP_BillingData?.PatientId || "",
//         WardName: IP_BillingData?.ward || "",
//       }));
//       setAppointmentRegisType(IP_BillingData.VisitType);
//       setSelectedPatient_list((prev) => ({
//         ...prev,
//         PatientId: IP_BillingData?.PatientId,
//         PatientName: IP_BillingData?.Patient_Name,
//         PhoneNumber: IP_BillingData?.PhoneNo,
//         PatientCategory: IP_BillingData?.PatientCategory,
//         Gender: IP_BillingData?.gender,
//         City: IP_BillingData?.City,
//         State: IP_BillingData?.State,
//         PatientAddress: IP_BillingData?.Area,
//         Pincode: IP_BillingData?.Pincode,
//         RegisterId: IP_BillingData?.RegistrationId,
//         QueueList_ID: IP_BillingData?.id,
//         // VisitId: IP_BillingData.VisitId,
//       }));
//       setSelectDatalist(IP_BillingData?.radiologytestlist);
//     }
//     // else {
//     //   navigate("/Home/QuickBilling")
//     // }
//   }, [UrlLink, IP_BillingData.Registration_Id, IP_BillingData]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const handlePrintClose = () => {
//     setShowPrintView(false);
//   };

//   const columns = useMemo(() => {
//     return [
//       { key: "preauth_id", name: "Preauth ID", frozen: true },
//       { key: "preauth_request_amt", name: "Requested Amount" },
//       { key: "approved_amt", name: "Approved Amount" },
//       { key: "requested_date", name: "Requested Date" },
//       { key: "approved_date", name: "Approved Date" },
//       { key: "created_by", name: "Created By" },
//       {
//         key: "action",
//         name: "Action",
//         renderCell: ({ row }) => (
//           <button
//             onClick={() => {
//               const newRequest = prompt(
//                 "Enter new Request Amount:",
//                 row.preauth_request_amt
//               );
//               const newApproved = prompt(
//                 "Enter new Approved Amount:",
//                 row.approved_amt
//               );

//               if (newRequest !== null && newApproved !== null) {
//                 const params = {
//                   preauth_id: row.preauth_id,
//                   preauth_request_amt: newRequest,
//                   approved_amt: newApproved,
//                   created_by: UserData?.username,
//                 };

//                 axios
//                   .post(`${UrlLink}Insurance/UpdatePreauthHistory`, params)
//                   .then(() => {
//                     getdata();
//                   })
//                   .catch((error) => {
//                     console.error("Error updating preauth:", error);
//                   });
//               }
//             }}
//           >
//             Edit
//           </button>
//         ),
//       },
//     ];
//   }, [UrlLink, UserData]);

//   const handleAddPreauth = () => {
//     if (!newRequestAmt) {
//       alert("Please enter Request Amount");
//       return;
//     }

//     const params = {
//       RegistrationId: rowData?.RegistrationId,
//       preauth_request_amt: newRequestAmt,
//       approved_amt: newApprovedAmt,
//       created_by: UserData?.username || "system",
//     };

//     axios
//       .post(`${UrlLink}Insurance/AddPreauthHistory`, params)
//       .then(() => {
//         getdata();
//         setNewRequestAmt("");
//         setNewApprovedAmt("");
//       })
//       .catch((error) => {
//         console.error("Error adding preauth:", error);
//       });
//   };

//   // Calculate total bill amount
//   const totalBillAmount = billingData.reduce((total, item) => {
//     return total + (parseFloat(item.NetAmount) || 0);
//   }, 0);

//   // Print Component
//   const ForPrintDetailedBill = () => {
//     return (
//       <div ref={componentRef}>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh",
//           }}
//           id="reactprintcontent"
//         >
//           <table className="print-table33">
//             <thead
//               className="print_header"
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 height: "150px",
//               }}
//             >
//               <tr>
//                 <td colSpan="7" style={{ border: "none" }}>
//                   <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
//                     <div className="new_billing_logo_con">
//                       <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
//                     </div>
//                     <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                       <span>{ClinicDetails?.Cname}</span>
//                       <div>
//                         <span>
//                           {ClinicDetails?.ClinicAddress},{" "}
//                           {ClinicDetails?.ClinicCity},{" "}
//                           {ClinicDetails?.ClinicState} -{" "}
//                           {ClinicDetails?.ClinicCode}
//                         </span>
//                       </div>
//                       <div>
//                         Ph: {ClinicDetails?.ClinicMobileNo}, Landline:{" "}
//                         {ClinicDetails?.ClinicLandLineNo}, Email:{" "}
//                         {ClinicDetails?.ClinicMailID}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <td
//                   colSpan="7"
//                   style={{
//                     textAlign: "center",
//                     fontWeight: "600",
//                     color: "black",
//                     fontSize: "18px",
//                   }}
//                 >
//                   Detailed Invoice
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan="7">
//                   <div className="new_billing_address new_addn_p037">
//                     <div className="new_billing_address_2 new_billing_address_2_new_up">
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>
//                           Patient Name <span>:</span>
//                         </label>
//                         <h4>{rowData?.PatientName}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>
//                           Patient ID <span>:</span>
//                         </label>
//                         <h4>{rowData?.RegistrationId}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>
//                           Age / Gender <span>:</span>
//                         </label>
//                         <h4>{rowData?.AgeGender}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>
//                           Address <span>:</span>
//                         </label>
//                         <h4>{rowData?.Address}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                         <label>
//                           Payer Type <span>:</span>
//                         </label>
//                         <h4>{rowData?.PatientCategory} [IP]</h4>
//                       </div>
//                     </div>
//                     <div className="new_billing_address_2 new_billing_address_2_new_up">
//                       <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                         <label>
//                           IP NO <span>:</span>
//                         </label>
//                         <h4>{rowData?.RegistrationId}</h4>
//                       </div>
//                       <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
//                         <label>
//                           Invoice Date<span>:</span>
//                         </label>
//                         <h4>{new Date().toLocaleDateString()}</h4>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </thead>

//             <tbody>
//               <br />
//               <tr>
//                 <td colSpan="7" className="prin_nnrmll_table">
//                   <table style={{ width: "100%", border: "none" }}>
//                     <thead>
//                       <tr
//                         style={{
//                           borderTop: "1.5px solid black",
//                           borderBottom: "1.5px solid black",
//                         }}
//                       >
//                         <th style={{ borderTop: "1px solid black" }}>Date</th>
//                         <th style={{ border: "none" }}>Service</th>
//                         <th style={{ border: "none" }}>Item Name</th>
//                         <th style={{ border: "none" }}>Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       style={{
//                         borderBottom: "1.5px solid black",
//                         padding: "2px",
//                       }}
//                     >
//                       {billingData.map((row, index) => (
//                         <tr key={index}>
//                           <td style={{ border: "none" }}>{row.Date}</td>
//                           <td style={{ border: "none" }}>{row.ServiceType}</td>
//                           <td style={{ border: "none" }}>
//                             {row.SelectItemName}
//                           </td>
//                           <td style={{ border: "none" }}>{row.NetAmount}</td>
//                         </tr>
//                       ))}
//                       <tr
//                         style={{
//                           borderTop: "1px solid grey",
//                           marginBottom: "10px",
//                         }}
//                       >
//                         <td
//                           colSpan="3"
//                           style={{
//                             border: "none",
//                             textAlign: "right",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Total Amount <span>:</span>
//                         </td>
//                         <td style={{ border: "none" }}>
//                           {totalBillAmount.toFixed(2)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </td>
//               </tr>
//             </tbody>

//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_invoice_detials">
//                   <div className="invoice_detials_total_1">
//                     <div className="total_con_bill">
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Amount In Words <span>:</span>
//                         </label>
//                         <span>{NumberToWords(totalBillAmount)}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Billed By <span>:</span>
//                         </label>
//                         <span>{UserData?.Employeename}</span>
//                       </div>
//                     </div>
//                     <div style={{ width: "40%", justifyContent: "flex-end" }}>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Total Amount <span>:</span>
//                         </label>
//                         <span>{totalBillAmount.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>

//             <tfoot className="print_footerr">
//               <tr className="jjxcdsjjej_"></tr>
//               <tr className="ehdhe_9ikw">
//                 <td className="shshxhxs_secfooter">
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <p className="disclaimer23">
//                       This page is created automatically without a signature.
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>

//         <div className="Register_btn_con added_Register_btn_con">
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrint}
//           >
//             Print
//           </button>
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrintClose}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (showPrintView) {
//     return <ForPrintDetailedBill />;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Preauth Transaction History</h2>
//       <p>
//         <b>Patient Name:</b> {rowData?.PatientName}
//       </p>
//       <p>
//         <b>MRN:</b> {rowData?.RegistrationId}
//       </p>

//       {/* Bill View Toggle Button */}
//       <div style={{ marginBottom: "20px" }}>
//         <button
//           onClick={() => setShowPrintView(true)}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginBottom: "10px",
//           }}
//         >
//           View Printable Bill ({billingData.length} items)
//         </button>
//         <button
//           onClick={() => setShowBill(!showBill)}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#28a745",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             marginBottom: "10px",
//           }}
//         >
//           {showBill ? "Hide Bill" : "View Bill"} ({billingData.length} items)
//         </button>
//         {showBill && (
//           <div
//             style={{
//               border: "1px solid #ddd",
//               padding: "15px",
//               borderRadius: "5px",
//               marginBottom: "20px",
//               backgroundColor: "#f9f9f9",
//             }}
//           >
//             <h3>Patient Bill Summary</h3>
//             <p>
//               <strong>Total Bill Amount: ₹{totalBillAmount.toFixed(2)}</strong>
//             </p>
//             <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#f0f0f0" }}>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       S.No
//                     </th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       Service Type
//                     </th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       Service Name
//                     </th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       Rate
//                     </th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       Quantity
//                     </th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       Amount
//                     </th>
//                     <th style={{ padding: "8px", border: "1px solid #ddd" }}>
//                       Date
//                     </th>
//                   </tr>
//                 </thead>{" "}
//                 <tbody>
//                   {" "}
//                   {billingData.map((item, index) => (
//                     <tr key={index}>
//                       {" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         {item.S_No}
//                       </td>{" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         {item.ServiceType}
//                       </td>{" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         {item.SelectItemName}
//                       </td>{" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         ₹{item.Charges}
//                       </td>{" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         {item.Quantity}
//                       </td>{" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         ₹{item.NetAmount}
//                       </td>{" "}
//                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
//                         {item.Date}
//                       </td>{" "}
//                     </tr>
//                   ))}{" "}
//                 </tbody>{" "}
//               </table>{" "}
//             </div>{" "}
//           </div>
//         )}{" "}
//       </div>

//       {/* ✅ Input form above grid */}
//       <div style={{ marginBottom: "20px" }}>
//         <h3>Add New Preauth Record</h3>
//         <input
//           type="number"
//           placeholder="Request Amount"
//           value={newRequestAmt}
//           onChange={(e) => setNewRequestAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <input
//           type="number"
//           placeholder="Approved Amount"
//           value={newApprovedAmt}
//           onChange={(e) => setNewApprovedAmt(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <button onClick={handleAddPreauth}>Submit</button>
//       </div>

//       {/* ✅ Grid */}
//       <div style={{ height: "400px", marginTop: "20px" }}>
//         <ReactGrid columns={columns} RowData={history} />
//       </div>
//     </div>
//   );
// }

// export default Approvepage_bill;

import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";

function Approvepage_bill() {
  const location = useLocation();
  const rowData = location.state?.row;
  console.log(rowData, "rowData2323");
  const [history, setHistory] = useState([]);
  const [newRequestAmt, setNewRequestAmt] = useState("");
  const [newApprovedAmt, setNewApprovedAmt] = useState("");
  const [billingData, setBillingData] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const IP_BillingData = useSelector(
    (state) => state.Frontoffice?.IPBillingData
  );
  const [PostInvoicedate1, setPostInvoiceDate1] = useState(null);
   const [initialState1, setinitialState1] = useState({
      totalItems: 0,
      totalTaxable: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalUnits: 0,
      totalNetAmount: 0,
      PaidAmount: 0,
      BalanceAmount: 0,
      Roundoff: 0,
      ReimbursableAmount: 0,
      totalAmountt: 0,
    });
  
  const InsurancePatientDetailes = useSelector(
      (state) => state.Insurancedata?.InsurancePatientDetailes
    );
    const [SelectedPatient_list, setSelectedPatient_list] = useState({
      PatientId: "",
      PatientName: "",
      PhoneNumber: "",
      PatientCategory: "General",
      PatientCategoryType: "",
      InsuranceName: "",
      Gender: "",
      City: "",
      State: "",
      PatientAddress: "",
      Pincode: "",
      VisitId: "",
      WardBedNo: "",
      DischargeDate: "",
      AgeGender: "",
      AdmissionDate: "",
      Date: "",
      RegisterId: "",
  
  
    });
    const [SelectDatalist, setSelectDatalist] = useState([]);
     const HandlePrintReimbursable = (params) => {

    console.log(params, "HandlePrintSummary");

    let updatedTotals = {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalNetAmount: 0,
    };

    let reimbursableTotals = {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalNetAmount: 0,
    };

    let nonReimbursableTotals = {
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGstamount: 0,
      totalNetAmount: 0,
    };


    const reimbursableItems = params?.Billing_Items.filter((item) => item.IsReimbursable === "Yes");
    const nonReimbursableItems = params?.Billing_Items.filter((item) => item.IsReimbursable !== "Yes");


    const calculateTotals = (items) => {
      return items.reduce(
        (totals, item) => {
          totals.totalUnits += +item.Quantity || 0;
          totals.totalAmount += parseFloat(item.Charges) || 0;
          totals.totalDiscount += parseFloat(item.Discount) || 0;
          totals.totalGstamount += parseFloat(item.GST) || 0;
          totals.totalNetAmount += parseFloat(item.NetAmount) || 0;
          return totals;
        },
        { totalUnits: 0, totalAmount: 0, totalDiscount: 0, totalGstamount: 0, totalNetAmount: 0 }
      );
    };

    reimbursableTotals = calculateTotals(reimbursableItems);
    nonReimbursableTotals = calculateTotals(nonReimbursableItems);


    updatedTotals = {
      totalUnits: reimbursableTotals.totalUnits + nonReimbursableTotals.totalUnits,
      totalAmount: reimbursableTotals.totalAmount + nonReimbursableTotals.totalAmount,
      totalDiscount: reimbursableTotals.totalDiscount + nonReimbursableTotals.totalDiscount,
      totalGstamount: reimbursableTotals.totalGstamount + nonReimbursableTotals.totalGstamount,
      totalNetAmount: reimbursableTotals.totalNetAmount + nonReimbursableTotals.totalNetAmount,
    };


    let additionalDiscount = 0;


    let finalDiscount = Math.min(
      updatedTotals.totalNetAmount,
      updatedTotals.totalDiscount + additionalDiscount
    );


    let totalTaxableAmount = updatedTotals.totalNetAmount - finalDiscount;


    let updatedGst = (totalTaxableAmount * (updatedTotals.totalGstamount / updatedTotals.totalNetAmount)) || 0;


    let finalNetAmount = totalTaxableAmount + updatedGst;


    setinitialState1((prevState) => ({
      ...prevState,
      totalItems: SelectDatalist.length,
      totalTaxable: updatedTotals.totalAmount.toFixed(2),
      totalUnits: updatedTotals.totalUnits,
      totalDiscount: finalDiscount.toFixed(2),
      totalGstamount: updatedGst.toFixed(2),
      totalNetAmount: finalNetAmount.toFixed(2),
      totalAmount: finalNetAmount.toFixed(2),
      BalanceAmount: (finalNetAmount - prevState.PaidAmount).toFixed(2),
      Roundoff: (Math.round(finalNetAmount) - finalNetAmount).toFixed(2),


      reimbursableTotal: reimbursableTotals.totalNetAmount.toFixed(2),
      nonReimbursableTotal: nonReimbursableTotals.totalNetAmount.toFixed(2),
    }));
  };
  
  

  // State variables for print function
  const [billAmount, setBillAmount] = useState([]);
  const [AdvanceAmountGet, setAdvanceAmountGet] = useState([]);
  const [BillingDataState, setBillingDataState] = useState({});
  const [initialState, setInitialState] = useState({
    totalAmount: 0,
    totalDiscount: 0,
    totalNetAmount: 0,
    totalAmountt: 0,
    PaidAmount: 0,
  });
  const [Paytype, setPaytype] = useState({ isCash: "No" });
  const [AdvanceTotal, setAdvanceTotal] = useState(0);
  const [PostInvoice, setPostInvoice] = useState("");
  const [PostInvoicedate, setPostInvoicedate] = useState("");
  const [ClinicDetials, setClinicDetials] = useState({
    Clogo: ClinicDetails?.Clogo,
    Cname: ClinicDetails?.Cname,
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
  });

  // ✅ Fetch history on load
  const getdata = () => {
    if (!rowData) return;

    axios
      .get(
        `${UrlLink}Insurance/GetPreauthHistory?registrationId=${rowData.RegistrationId}`
      )
      .then((response) => {
        setHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching preauth history:", error);
      });
  };

  useEffect(() => {
    getdata();
  }, [UrlLink]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        console.log("clinccccc", clinicData);

        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
            (component) => component
          );

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: addressComponents.join(", "),
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
          // if (clinicData.Clinic_Logo) {
          //   setClinic_Logo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
          // }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UserData?.location, UrlLink]);


  const handleFinalBillPrint1 = () => {
  // Fetch final bill data from IP_Billing_Items_Table_For_Insurance_Patient
  axios
    .get(
      `${UrlLink}Frontoffice/IP_Billing_Items_Table_For_Insurance_Patient?Register_Id=${rowData?.RegistrationId}&PatientServiesType=IP`
    )
    .then((res) => {
      console.log('API Response:', res.data); // Add this to debug
      
      // Check if response is an array and has data
      if (Array.isArray(res.data) && res.data.length > 0) {
        const ress = res.data[0];
        console.log('Final bill data:', ress);
        
        // Set the data for printing
        setSelectedPatient_list({
          PatientId: ress?.PatientId || "",
          PatientName: ress?.Patient_Name || "",
          PhoneNumber: ress?.PhoneNo || "",
          PatientCategory: ress?.PatientCategory || "",
          PatientCategoryType: ress?.PatientCategoryName || "",
          InsuranceName: ress?.PatientCategoryName || "",
          Gender: "",
          City: ress?.City || "",
          State: ress?.State || "",
          PatientAddress: ress?.Address || "",
          Pincode: ress?.Pincode || "",
          VisitId: "",
          WardBedNo: ress?.ward || "",
          DischargeDate: "",
          AgeGender: ress?.AgeGender || "",
          AdmissionDate: ress?.AdmissionDate
            ? new Date(ress?.AdmissionDate).toLocaleDateString()
            : "",
          Date: ress?.Billing_Date || "",
          RegisterId: ress?.Register_Id || "",
        });

        setPostInvoice(ress.id || "");
        setPostInvoicedate(ress?.Billing_Date || "");
        setSelectDatalist(ress.Billing_Items || []);
        setBillAmount(ress.Payment_Details || []);
        
        // Show the print view
        setShowPrintView(true);
      } else {
        console.log("No data found in response");
        alert("No billing data found for this patient");
      }
    })
    .catch((err) => {
      console.log("Error fetching final bill:", err);
      alert("Failed to load final bill data");
    });
};


  // ✅ Fetch IP Billing Service List
  useEffect(() => {
    if (rowData && rowData.RegistrationId) {
      setLoading(true);
      setError(null);
      axios
        .get(`${UrlLink}Frontoffice/IP_Billing_Service_List`, {
          params: {
            QueueList_ID: rowData.RegistrationId,
          },
        })
        .then((res) => {
          let GetIPBillingdata = res.data.Billing_data;
          let GetIPBillingdataService = res.data.services;
          let GetIPRoomServices = res.data.Room_data?.RoomDatas || [];
          let GetIPPharmacy = res.data.pharmacy_list || [];
          let GetOT = res.data.OT_data || [];
          let GetLab = res.data.Lab_list || [];
          let GetRad = res.data.Rad_list || [];
          let GetInterim = res.data.InterimList || [];

          console.log("GetIPBillingdata", GetIPBillingdata);
          console.log("GetIPBillingdataService", GetIPBillingdataService);
          console.log("GetIPRoomServices", GetIPRoomServices);

          if (GetIPBillingdata && Object.values(GetIPBillingdata).length > 0) {
            // Map over GetIPBillingdataService to get service data
            let mappedServiceData = GetIPBillingdataService.map(
              (service, index) => {
                return {
                  S_No: index + 1,
                  ServiceType: service.category,
                  VoucherNo: service.VoucherNo,
                  SelectItemName: service.service_subcategory,
                  Charges: parseFloat(service.rate),
                  Amount: parseFloat(service.rate),
                  DiscountType: "",
                  Discount: "",
                  GST_per: service.GST_per,
                  GST: service.GST_Charge,
                  NetAmount: parseFloat(service.rate),
                  Quantity: parseFloat(service.Units),
                  isReimbursable: service.isReimbursable,
                  Date: service.Date,
                };
              }
            );

            let serviceCount = mappedServiceData.length;

            // Map over GetIPPharmacy to get pharmacy service data
            let mappedPharmacyServiceData = GetIPPharmacy.map(
              (service, index) => {
                return {
                  S_No: serviceCount + index + 1,
                  VoucherNo: service.VoucherNo,
                  ServiceType: service.category,
                  SelectItemName: service.service_subcategory,
                  Charges: parseFloat(service.rate),
                  Amount: "",
                  DiscountType: "",
                  Discount: "",
                  GST_per: 0.0,
                  GST: 0.0,
                  NetAmount: parseFloat(service.total),
                  Quantity: service.Units,
                  isReimbursable: service.isReimbursable,
                  Date: service.Date,
                };
              }
            );
            serviceCount += mappedPharmacyServiceData.length;

            // Map room services
            let mappedRoomServiceData = GetIPRoomServices.map(
              (service, index) => {
                return {
                  S_No: serviceCount + index + 1,
                  ServiceType: "ROOM CHARGES",
                  SelectItemName:
                    service.SelectItemName ||
                    `${service.WardName}-${service.Room_No}-${service.Bed_No}`,
                  Charges: parseFloat(service.Charge),
                  Amount: parseFloat(service.Total_Current_Charge),
                  DiscountType: "",
                  Discount: "",
                  GST_per: service.GST_per,
                  GST: service.GST,
                  NetAmount: parseFloat(service.Total_amount),
                  Quantity: service.Days,
                  isReimbursable: service.isReimbursable,
                  Date: service.DateRange,
                };
              }
            );
            serviceCount += mappedRoomServiceData.length;

            // Map OT data
            let mappedOTData = GetOT.map((service, index) => {
              return {
                S_No: serviceCount + index + 1,
                ServiceType: service.category,
                SelectItemName: service.service_subcategory,
                Charges: parseFloat(service.rate),
                Amount: parseFloat(service.rate),
                DiscountType: "",
                Discount: "",
                GST_per: service.GST_per,
                GST: service.GST_Charge,
                NetAmount: parseFloat(service.rate),
                Quantity: parseFloat(service.Units),
                isReimbursable: service.isReimbursable,
                Date: service.Date,
              };
            });
            serviceCount += mappedOTData.length;

            // Map Lab data
            let mappedLABData = GetLab.map((service, index) => {
              return {
                S_No: serviceCount + index + 1,
                VoucherNo: service.VoucherNo,
                ServiceType: service.category,
                SelectItemName: service.service_subcategory,
                servicecode: service.servicecode,
                Charges: parseFloat(service.rate),
                Amount: parseFloat(service.rate),
                DiscountType: "",
                Discount: "",
                GST_per: service.GST_per,
                GST: service.GST_Charge,
                NetAmount: parseFloat(service.rate),
                Quantity: parseFloat(service.Units),
                isReimbursable: service.isReimbursable,
                Date: service.Date,
                Requestid: service.Requestid,
              };
            });
            serviceCount += mappedLABData.length;

            // Map Radiology data
            let mappedRadata = GetRad.map((service, index) => {
              return {
                S_No: serviceCount + index + 1,
                VoucherNo: service.VoucherNo,
                ServiceType: service.category,
                SelectItemName: service.service_subcategory,
                servicecode: service.servicecode,
                Charges: parseFloat(service.rate),
                Amount: parseFloat(service.rate),
                DiscountType: "",
                Discount: "",
                GST_per: service.GST_per,
                GST: service.GST_Charge,
                NetAmount: parseFloat(service.rate),
                Quantity: parseFloat(service.Units),
                isReimbursable: service.isReimbursable,
                Date: service.Date,
                Requestid: service.Requestid,
              };
            });
            serviceCount += mappedRadata.length;

            // Map Interim data
            let mappedInterimData = GetInterim.map((service, index) => {
              return {
                S_No: serviceCount + index + 1,
                VoucherNo: service.VoucherNo,
                ServiceType: service.category,
                SelectItemName: service.service_subcategory,
                Charges: parseFloat(service.rate),
                Amount: "",
                DiscountType: "",
                Discount: "",
                GST_per: 0.0,
                GST: 0.0,
                NetAmount: parseFloat(service.total),
                Quantity: service.Units,
                isReimbursable: service.isReimbursable,
                Date: service.Date,
              };
            });

            // Combine all data
            const combinedData = [
              ...mappedServiceData,
              ...mappedPharmacyServiceData,
              ...mappedRoomServiceData,
              ...mappedOTData,
              ...mappedLABData,
              ...mappedRadata,
              ...mappedInterimData,
            ];

            setBillingData(combinedData);

            // Set data for print function
            setBillingDataState({
              DoctorName: GetIPBillingdata.Doctor_ShortName || "",
              Doctor_name: GetIPBillingdata.Doctor_name || "",
              Billedby: UserData?.Employeename || "",
            });

            // Calculate totals for print
            const totalNetAmount = combinedData.reduce(
              (sum, item) => sum + (parseFloat(item.NetAmount) || 0),
              0
            );
            setInitialState({
              totalAmount: totalNetAmount,
              totalDiscount: 0,
              totalNetAmount: totalNetAmount,
              totalAmountt: totalNetAmount,
              PaidAmount: totalNetAmount,
            });

            setPostInvoice(`INV-${rowData.RegistrationId}`);
            setPostInvoicedate(new Date().toLocaleDateString());
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error fetching billing data:", err);
          setError(
            "Failed to load billing data. Please check if the patient has complete admission dates."
          );
          setLoading(false);
          setBillingData([]);
        });
    }
  }, [UrlLink, rowData, UserData]);

  // Print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

    const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
  });



  const handlePrintClose = () => {
    setShowPrintView(false);
  };

  // ✅ Columns for the grid
  const columns = useMemo(() => {
    return [
      { key: "preauth_id", name: "Preauth ID", frozen: true },
      { key: "preauth_request_amt", name: "Preauth Amount" },
      { key: "approved_amt", name: "Approved Amount" },
      { key: "requested_date", name: "Requested Date" },
      { key: "approved_date", name: "Approved Date" },
      { key: "created_by", name: "Created By" },
      {
        key: "action",
        name: "Action",
        renderCell: ({ row }) => (
          <button
            onClick={() => {
              const newRequest = prompt(
                "Enter new Request Amount:",
                row.preauth_request_amt
              );
              const newApproved = prompt(
                "Enter new Approved Amount:",
                row.approved_amt
              );

              if (newRequest !== null && newApproved !== null) {
                const params = {
                  preauth_id: row.preauth_id,
                  preauth_request_amt: newRequest,
                  approved_amt: newApproved,
                  created_by: UserData?.username,
                };

                axios
                  .post(`${UrlLink}Insurance/UpdatePreauthHistory`, params)
                  .then(() => {
                    getdata();
                  })
                  .catch((error) => {
                    console.error("Error updating preauth:", error);
                  });
              }
            }}
          >
            Edit
          </button>
        ),
      },
    ];
  }, [UrlLink, UserData]);

  const handleAddPreauth = () => {
    if (!newRequestAmt) {
      alert("Please enter Request Amount");
      return;
    }

    const params = {
      RegistrationId: rowData?.RegistrationId,
      preauth_request_amt: newRequestAmt,
      approved_amt: newApprovedAmt,
      created_by: UserData?.username || "system",
    };

    axios
      .post(`${UrlLink}Insurance/AddPreauthHistory`, params)
      .then(() => {
        getdata();
        setNewRequestAmt("");
        setNewApprovedAmt("");
      })
      .catch((error) => {
        console.error("Error adding preauth:", error);
      });
  };

  // Calculate total bill amount
  const totalBillAmount = billingData.reduce((total, item) => {
    return total + (parseFloat(item.NetAmount) || 0);
  }, 0);

  // Print Component - Your original function adapted
  const ForPrintDetailedBill = () => {
    const hasCard = billAmount.some((p) => p.Billpay_method === "Card");
    const hasCheque = billAmount.some((p) => p.Billpay_method === "Cheque");
    const hasBank = billAmount.some((p) => p.Billpay_method === "Bank");

    return (
      <div ref={componentRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
          id="reactprintcontent"
        >
          <table className="print-table33">
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetails?.Cname}</span>
                      <div>
                        <span>
                          {ClinicDetials?.ClinicAddress},{" "}
                          {ClinicDetials?.ClinicCity},{" "}
                          {ClinicDetials?.ClinicState} -{" "}
                          {ClinicDetials?.ClinicCode}
                        </span>
                      </div>
                      <div>
                        {ClinicDetials?.ClinicMobileNo},{" "}
                        {ClinicDetials?.ClinicLandLineNo},{" "}
                        {ClinicDetials?.ClinicMailID}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "18px",
                  }}
                >
                  Detailed Invoice
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
                    {/* LEFT SIDE */}
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{rowData?.PatientName}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{rowData?.RegistrationId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>
                          {rowData?.Age}/{rowData?.Gender}
                        </h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          D.O.A <span>:</span>
                        </label>
                        <h4>{rowData?.CreatedAt}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Address <span>:</span>
                        </label>
                        <h4>{rowData?.Address}</h4>
                      </div>
                    </div>

                    {/* RIGHT SIDE (moved Payer, Consultant, Mobile here) */}
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          IP NO <span>:</span>
                        </label>
                        <h4>{rowData?.RegistrationId}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Ward - Bed No <span>:</span>
                        </label>
                        <h4>{"Not Available"}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Payer Type <span>:</span>
                        </label>
                        <h4>{rowData?.PatientCategory} [IP]</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Consultant <span>:</span>
                        </label>
                        <h4>Dr.{BillingDataState.Doctor_name}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                        <label>
                          Mobile No <span>:</span>
                        </label>
                        <h4>{rowData?.PhoneNo}</h4>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <br />
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", border: "none" }}>
                    <thead>
                      <tr
                        style={{
                          borderTop: "1.5px solid black",
                          borderBottom: "1.5px solid black",
                        }}
                      >
                        <th style={{ borderTop: "1px solid black" }}>Date</th>
                        <th style={{ border: "none" }}>Service</th>
                        <th style={{ border: "none" }}>Item Name</th>
                        <th style={{ border: "none" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        borderBottom: "1.5px solid black",
                        padding: "2px",
                      }}
                    >
                      {billingData.map((row, index) => (
                        <tr key={index}>
                          <td style={{ border: "none" }}>{row.Date}</td>
                          <td style={{ border: "none" }}>{row.ServiceType}</td>
                          <td style={{ border: "none" }}>
                            {row.SelectItemName}
                          </td>
                          <td style={{ border: "none" }}>{row.NetAmount}</td>
                        </tr>
                      ))}
                      <tr
                        style={{
                          borderTop: "1px solid grey",
                          marginBottom: "10px",
                        }}
                      >
                        <td
                          colSpan="3"
                          style={{
                            border: "none",
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          Total Amount <span>:</span>
                        </td>
                        <td style={{ border: "none" }}>
                          {totalBillAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>

            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>
                          {NumberToWords(+initialState.totalNetAmount)}
                        </span>
                      </div>

                      {/* COMMENTED OUT Billed By */}
                      {/*
                <div className="bill_body_new_phar">
                  <label>Billed By <span>:</span></label>
                  <span>{BillingDataState.Billedby}</span>
                </div>
                */}

                      {/* MOVED total table LEFT side */}
                      <div style={{ marginTop: "10px" }}>
                        <table
                          style={{ border: "none", borderCollapse: "collapse" }}
                        >
                          <tr style={{ borderTop: "1px solid black" }}>
                            <td style={{ borderTop: "1px solid black" }}>
                              Total Advance
                            </td>
                            <td style={{ borderTop: "1px solid black" }}>
                              {AdvanceTotal}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Bill</td>
                            <td>{initialState.totalNetAmount}</td>
                          </tr>
                          <tr
                            style={{
                              borderTop: "1px solid black",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <td
                              style={{
                                borderTop: "1px solid black",
                                borderBottom: "1px solid black",
                              }}
                            >
                              Paid Amount
                            </td>
                            <td
                              style={{
                                borderTop: "1px solid black",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {initialState.PaidAmount}
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>

                    {/* RIGHT SIDE now only shows summary numbers */}
                    <div style={{ width: "40%", justifyContent: "flex-end" }}>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <span>{initialState.totalAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Discount Amount<span>:</span>
                        </label>
                        <span>{initialState.totalDiscount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Net Amount <span>:</span>
                        </label>
                        <span>{initialState.totalNetAmount}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Paid Amount<span>:</span>
                        </label>
                        <span>{initialState.totalAmountt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tfoot className="print_footerr">
              <tr className="jjxcdsjjej_"></tr>
              <tr className="ehdhe_9ikw">
                <td className="shshxhxs_secfooter">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p className="disclaimer23">
                      This page is created automatically without a signature.
                    </p>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="Register_btn_con added_Register_btn_con">
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint}
          >
            Print
          </button>
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrintClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (showPrintView) {
    return <ForPrintDetailedBill />;
  }

  const ForPrintDetailedBill1 = () => {
  const hasCard = billAmount.some((p) => p.Billpay_method === "Card");
  const hasCheque = billAmount.some((p) => p.Billpay_method === "Cheque");
  const hasBank = billAmount.some((p) => p.Billpay_method === "Bank");

  return (
    <div ref={componentRef}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        id="reactprintcontent"
      >
        <table className="print-table33">
          <thead
            className="print_header"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              height: "150px",
            }}
          >
            <tr>
              <td colSpan="7" style={{ border: "none" }}>
                <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                  <div className="new_billing_logo_con">
                    <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                  </div>
                  <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                    <span>{ClinicDetails?.Cname}</span>
                    <div>
                      <span>
                        {[ClinicDetials?.ClinicAddress]
                          .filter((detail) => detail)
                          .join(", ")}
                        ,{" "}
                        {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
                          .filter((detail) => detail)
                          .join(", ")}
                      </span>
                    </div>
                    <div>
                      {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID]
                        .filter((detail) => detail)
                        .join(" , ")}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  color: "black",
                  fontSize: "18px",
                }}
              >
                Detailed Invoice
              </td>
            </tr>
            <tr>
              <td colSpan="7">
                <div className="new_billing_address new_addn_p037">
                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.PatientName}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient ID <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.PatientId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Age / Gender <span>:</span>
                      </label>
                      <h4>{IP_BillingData.AgeGender}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        D.O.A <span>:</span>
                      </label>
                      <h4>{IP_BillingData.AdmittionDate}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Address <span>:</span>
                      </label>
                      <h4>{IP_BillingData.Address}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Payer Type <span>:</span>
                      </label>
                      <h4>{`${IP_BillingData.PatientCategory} [IP]`}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Consultant <span>:</span>
                      </label>
                      <h4>{IP_BillingData.Doctor_ShortName}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Mobile No <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.PhoneNumber}</h4>
                    </div>
                  </div>
                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        IP NO <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.RegisterId}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Ward - Bed No <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.WardBedNo}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Invoice No<span>:</span>
                      </label>
                      <h4>{PostInvoice}</h4>
                    </div>
                    {/* <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>Receipt No<span>:</span></label>
                      <h4>{RecieptInvoice}</h4>
                    </div> */}
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Invoice Date<span>:</span>
                      </label>
                      <h4>{PostInvoicedate}</h4>
                    </div>
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u mvfg_p7u_po9">
                      <label>
                        Discharge Date <span>:</span>
                      </label>
                      <h4>{SelectedPatient_list.DischargeDate}</h4>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="7" className="prin_nnrmll_table">
                <table style={{ width: "100%", border: "none" }}>
                  <thead>
                    <tr
                      style={{
                        borderTop: "1.5px solid black",
                        borderBottom: "1.5px solid black",
                      }}
                    >
                      <th style={{ borderTop: "1px solid black" }}>Date</th>
                      <th style={{ border: "none" }}>Service</th>
                      <th style={{ border: "none" }}>Item Name</th>
                      <th style={{ border: "none" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      borderBottom: "1.5px solid black",
                      padding: "2px",
                    }}
                  >
                    {SelectDatalist.map((row, index) => (
                      <tr key={index}>
                        <td style={{ border: "none" }}>{row.Date}</td>
                        <td style={{ border: "none" }}>{row.ServiceType}</td>
                        <td style={{ border: "none" }}>{row.SelectItemName}</td>
                        <td style={{ border: "none" }}>{row.NetAmount}</td>
                      </tr>
                    ))}
                    <tr
                      style={{
                        borderTop: "1px solid grey",
                        marginBottom: "10px",
                      }}
                    >
                      <td
                        colSpan="3"
                        style={{
                          border: "none",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        Total Amount <span>:</span>
                      </td>
                      <td style={{ border: "none" }}>
                        {SelectDatalist.reduce(
                          (sum, row) => sum + parseFloat(row.NetAmount),
                          0
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>

          <tr>
            <td colSpan="7">
              <div className="new_billing_invoice_detials">
                <div className="invoice_detials_total_1">
                  <div className="total_con_bill">
                    <div className="bill_body_new_phar">
                      {billAmount.length > 0 && (
                        <table className="print-table33">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Payment Type</th>
                              {hasCard && <th>Card Type</th>}
                              {hasCheque && <th>Cheque No</th>}
                              {hasBank && <th>Bank Name</th>}
                              <th>Amount</th>
                              {hasCard && <th>Transaction Fee</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {billAmount.map((row, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.Billpay_method || "-"}</td>
                                {hasCard && (
                                  <td>
                                    {row.Billpay_method === "Card"
                                      ? row.CardType || "-"
                                      : "-"}
                                  </td>
                                )}
                                {hasCheque && (
                                  <td>
                                    {row.Billpay_method === "Cheque"
                                      ? row.ChequeNo || "-"
                                      : "-"}
                                  </td>
                                )}
                                {hasBank && (
                                  <td>
                                    {row.Billpay_method === "Bank"
                                      ? row.BankName || "-"
                                      : "-"}
                                  </td>
                                )}
                                <td>{row.paidamount || "-"}</td>
                                {hasCard && (
                                  <td>
                                    {row.Billpay_method === "Card" &&
                                    row.transactionFee
                                      ? `${parseInt(row.transactionFee)}%`
                                      : "-"}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                    {AdvanceAmountGet.length > 0 && (
                      <table className="print-table33">
                        <thead>
                          <tr>
                            <th colSpan="4" style={{ textAlign: "center" }}>
                              Advance Amount
                            </th>
                          </tr>
                          <tr style={{ textAlign: "center" }}>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {AdvanceAmountGet.map((row, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{row.Date || "-"}</td>
                              <td>{row.Time || "-"}</td>
                              <td>{row.AdvanceAmount || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <div className="bill_body_new_phar">
                      <label>
                        Amount In Words <span>:</span>
                      </label>
                      <span>{NumberToWords(+initialState.totalNetAmount)}</span>
                    </div>
                    <div className="bill_body_new_phar">
                      <label>
                        Billed By <span>:</span>
                      </label>
                      <span>{billingData.Billedby}</span>
                    </div>
                  </div>
                  <div style={{ width: "40%", justifyContent: "flex-end" }}>
                    <div className="bill_body_new_phar">
                      <label>
                        Total Amount <span>:</span>
                      </label>
                      <span>{initialState.totalAmount}</span>
                    </div>
                    <div className="bill_body_new_phar">
                      <label>
                        Gross Amount <span>:</span>
                      </label>
                      <span>{initialState.totalAmount}</span>
                    </div>
                    <div className="bill_body_new_phar">
                      <label>
                        Discount Amount<span>:</span>
                      </label>
                      <span>{initialState.totalDiscount}</span>
                    </div>
                    <div className="bill_body_new_phar">
                      <label>
                        Net Amount <span>:</span>
                      </label>
                      <span>{initialState.totalNetAmount}</span>
                    </div>
                    <div className="bill_body_new_phar">
                      <label>
                        {Math.abs(IP_BillingData.ReceivableAmount) > 0 &&
                        Paytype.isCash === "Yes"
                          ? "Paid Amount"
                          : "Refund Amount"}
                        <span>:</span>
                      </label>
                      <span>{initialState.totalAmountt}</span>
                    </div>
                    <br />
                    <div>
                      <table
                        style={{ border: "none", borderCollapse: "collapse" }}
                      >
                        <tr style={{ borderTop: "1px solid black" }}>
                          <td style={{ borderTop: "1px solid black" }}>
                            Total Advance
                          </td>
                          <td style={{ borderTop: "1px solid black" }}>
                            {AdvanceTotal}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Bill</td>
                          <td>{initialState.totalNetAmount}</td>
                        </tr>
                        <tr
                          style={{
                            borderTop: "1px solid black",
                            borderBottom: "1px solid black",
                          }}
                        >
                          <td
                            style={{
                              borderTop: "1px solid black",
                              borderBottom: "1px solid black",
                            }}
                          >
                            {Math.abs(IP_BillingData.ReceivableAmount) > 0 &&
                            Paytype.isCash === "Yes"
                              ? "Paid Amount"
                              : "Refund Amount"}
                          </td>
                          <td
                            style={{
                              borderTop: "1px solid black",
                              borderBottom: "1px solid black",
                            }}
                          >
                            {initialState.PaidAmount}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tfoot className="print_footerr">
            <tr className="ehdhe_9ikw">
              <td colSpan="7" className="shshxhxs_secfooter">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p className="disclaimer23">
                    This page is created automatically without a signature.
                  </p>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
          Print
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrintClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};



  if (showPrintView) {
  return <ForPrintDetailedBill1 />;
 }





  return (
    <div style={{ padding: "20px" }}>
      <h2>Preauth Transaction History</h2>
      <p>
        <b>Patient Name:</b> {rowData?.PatientName}
      </p>
      <p>
        <b>MRN:</b> {rowData?.RegistrationId}
      </p>

      {/* Loading and Error Messages */}
      {loading && (
        <div style={{ padding: "10px", color: "#007bff" }}>
          Loading billing data...
        </div>
      )}
      {error && (
        <div
          style={{
            padding: "10px",
            color: "#dc3545",
            backgroundColor: "#f8d7da",
          }}
        >
          {error}
        </div>
      )}

      {/* Bill View Toggle Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowPrintView(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
            marginRight: "10px",
          }}
          disabled={loading || error}
        >
          View Printable Bill ({billingData.length} items)
        </button>

        <button
          onClick={() => setShowBill(!showBill)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
          disabled={loading || error}
        >
          {showBill ? "Hide Bill" : "View Bill"} ({billingData.length} items)
        </button>

        {/* <button
          onClick={() => handleFinalBillPrint1()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff6b35",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
            marginRight: "10px",
          }}
          disabled={loading || error}
        >
          Final Bill
        </button> */}

        {showBill && !loading && !error && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>Patient Bill Summary</h3>
            <p>
              <strong>Total Bill Amount: ₹{totalBillAmount.toFixed(2)}</strong>
            </p>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      S.No
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Service Type
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Service Name
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Rate
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Quantity
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Amount
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.S_No}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.ServiceType}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.SelectItemName}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        ₹{item.Charges}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.Quantity}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        ₹{item.NetAmount}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {item.Date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Input form above grid */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Add New Preauth Record</h3>
        <input
          type="number"
          placeholder="Request Amount"
          value={newRequestAmt}
          onChange={(e) => setNewRequestAmt(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Approved Amount"
          value={newApprovedAmt}
          onChange={(e) => setNewApprovedAmt(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddPreauth}>Submit</button>
      </div>

      {/* ✅ Grid */}
      <div style={{ height: "400px", marginTop: "20px" }}>
        <ReactGrid columns={columns} RowData={history} />
      </div>
    </div>
  );
}

export default Approvepage_bill;
