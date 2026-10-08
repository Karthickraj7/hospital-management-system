// import * as React from "react";
// import { useEffect, useState, useRef } from "react";
// import SearchIcon from "@mui/icons-material/Search";
// import LoupeIcon from "@mui/icons-material/Loupe";
// import axios from "axios";
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import Button from "@mui/material/Button";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

// import PrintIcon from '@mui/icons-material/Print';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import { useReactToPrint } from "react-to-print";
// const PharmacyRefundBillingLIst = () => {
//   const componentRef = useRef();
//   const dispatchvalue = useDispatch();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const navigate = useNavigate();

//   const [SearchQuery, setSearchQuery] = useState({
//     searchBy: "",
//     Status: "Pending"
//   });
//   const toast = useSelector(state => state.userRecord?.toast);
//   const formatDate = (date) => {
//     const d = new Date(date);
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const day = d.getDate().toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   };
//   const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
//   const [Prescription_Patient_list, setPrescription_Patient_list] = useState(
//     []
//   );
//   console.log('todayy', TodayDate);

//   const [searchOptions, setSearchOptions] = useState({
//     DateType: 'Current',
//     CurrentDate: TodayDate,
//     FromDate: '',
//     ToDate: '',
//     SearchbyFirstName: '',
//     SearchbySpeciality: '',
//     SearchbyDoctor: '',
//     SearchTimeOrderby: '',
//   })
//   const [printView, setPrintView] = useState(null);


//   const [Filterdata, setFilterdata] = useState([])

//   const HandleOnchangeSearch = (e) => {
//     const { name, value } = e.target;

//     console.log(`Updating ${name} with value:`, value);

//     if (name === 'SearchbyPhoneNumber') {
//       if (value.length <= 10) {
//         setSearchOptions((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       }
//     }
//     else if (name === 'DateType') {
//       if (value === 'Current') {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: TodayDate, // Ensure TodayDate is properly defined
//           FromDate: '',
//           ToDate: '',
//         }));
//       }
//       else if (value === 'Customize') {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: '',
//         }));
//       }
//     }
//     else {
//       setSearchOptions((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleRequestEdit1 = (params) => {
//     if (!params) {
//       console.error("Invalid params:", params);
//       return;
//     }

//     console.log("params", params);

//     // Extracting values from params
//     const { PatientId, VisitID, PatientName, DoctorName, Doctorid } = params;

//     dispatchvalue({
//       type: "Selected_Patient_Pharmacy",
//       value: {
//         PatientID: PatientId,
//         VisitID: VisitID,
//         Patient_Name: PatientName,
//         Doctor_name: DoctorName,
//         Doctorid: Doctorid,
//         type: "OP",
//         Department: 2,
//         Edit: true,
//         ...params, // Spread all other params to keep additional values
//       },
//     });

//     navigate("/Home/Pharmacy");
//     dispatchvalue({ type: "HrFolder", value: "IPPharmacyRefundBilling" });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };

//   useEffect(() => {
//     axios
//       .get(`${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_Billing_link`, {
//         params: { ...searchOptions, location: userRecord?.location }
//       })
//       .then((response) => {
//         console.log('232332323', response.data);

//         const Datas = Array.isArray(response.data) ? response.data : [];
//         setFilterdata(Datas);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, [userRecord, UrlLink, searchOptions]);



//   const handlePharmacybilling = () => {
//     dispatchvalue({
//       type: "Selected_Patient_Pharmacy",
//       value: {

//         type: "OP",
//         Department: 2,
//       },
//     });

//     navigate('/Home/Pharmacy')
//     dispatchvalue({ type: 'HrFolder', value: 'OPPharmacyRefundBilling' });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };

//   const UserRegisterColumns = [
//     {
//       key: "id",
//       name: "S No",
//       filter: true,
//       frozen: true,
//     },
//     {
//       key: "Patient_Name",
//       name: "Patient Name",
//       filter: true,
//       frozen: true,
//     },
//     {
//       key: "PhoneNo",
//       name: "Contact Number",
//       frozen: true,
//     },
//     {
//       key: "Doctor_Name",
//       name: "Doctor Name",
//       frozen: true,
//     },
//     {
//       key: 'PatientCategory',
//       name: 'Patient Category',
//     },
//     {
//       key: 'Net_Amount',
//       name: 'Net Amount',
//     },
//     {
//       key: 'PaidAmount',
//       name: 'Paid Amount',
//     },
//     {
//       key: 'BalanceAmount',
//       name: 'Balance Amount',
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => {
//         return (
//           <Button
//             className="cell_btn"
//             onClick={() => handleRequestEdit1(params.row)}
//           >
//             <ArrowForwardIcon className="check_box_clrr_cancell" />
//           </Button>
//         )
//       },
//     },

//   ];

//   const HandlePrintBill = () => {
//     setPrintView("bill"); // Show Bill Print View
//   };

//   const HandlePrintReceipt = () => {
//     setPrintView("receipt"); // Show Receipt Print View
//   };

//   const ForPrintBill = () => {
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
//           <h3>Billlll Summaaaa</h3>
//         </div>

//         <div className="Register_btn_con added_Register_btn_con">
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrint2}
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
//   const ForPrintReceipt = () => {
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
//           <h3>Receipt Summaaaa</h3>
//         </div>

//         <div className="Register_btn_con added_Register_btn_con">
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrint2}
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


//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,

//     onAfterPrint: async () => {
//       navigate("/Home/Pharmacy");
//       dispatchvalue({ type: "HrFolder", value: "PharmacyBillingLIst" });
//       dispatchvalue({ type: "setPreviousFolder", value: null });
//       dispatchvalue({ type: "showMenu", value: true });
//     },
//   });


//   const handlePrintClose = () => {
//     setPrintView(null);
//     navigate("/Home/Pharmacy");
//     dispatchvalue({ type: "HrFolder", value: "PharmacyBillingLIst" });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   }

//   return (
//     <>
//       {printView === null ? (
//         <div className="Main_container_app">
//           <h3>OP Pharmacy Refund Billing List</h3>
//           <div className="search_div_bar">
//             <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
//               <div className="RegisForm_1">
//                 <label>Date Type<span>:</span></label>
//                 <select
//                   name="DateType"
//                   value={searchOptions.DateType}
//                   onChange={HandleOnchangeSearch}
//                 >
//                   <option value="Current">Current Date</option>
//                   <option value="Customize">Customize</option>
//                 </select>
//               </div>

//               {searchOptions.DateType === "Current" ? (
//                 <div className="RegisForm_1">
//                   <label>Current Date<span>:</span></label>
//                   <input
//                     type="date"
//                     name="CurrentDate"
//                     value={searchOptions.CurrentDate}
//                     onChange={HandleOnchangeSearch}
//                     readOnly
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <div className="RegisForm_1">
//                     <label>From Date<span>:</span></label>
//                     <input
//                       type="date"
//                       name="FromDate"
//                       value={searchOptions.FromDate}
//                       onChange={HandleOnchangeSearch}
//                     />
//                   </div>
//                   <div className="RegisForm_1">
//                     <label>To Date<span>:</span></label>
//                     <input
//                       type="date"
//                       name="ToDate"
//                       value={searchOptions.ToDate}
//                       onChange={HandleOnchangeSearch}
//                       min={searchOptions.FromDate}
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="RegisForm_1">
//                 <label htmlFor="input">Name/PhoneNo<span>:</span></label>
//                 <input
//                   type="text"
//                   name="SearchbyFirstName"
//                   value={searchOptions.SearchbyFirstName}
//                   onChange={HandleOnchangeSearch}
//                 />
//               </div>
//             </div>

//             {/* Table with Patient Data */}
//             <ReactGrid columns={UserRegisterColumns}
//               RowData={Filterdata} />
//           </div>

//           {/* Toast Notification */}
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </div>
//       ) : printView === "bill" ? (
//         <ForPrintBill onClose={() => setPrintView(null)} />
//       ) : (
//         <ForPrintReceipt onClose={() => setPrintView(null)} />
//       )}
//     </>
//   );
// };
// export default PharmacyRefundBillingLIst;



// import * as React from "react";
// import { useEffect, useState, useRef } from "react";
// import SearchIcon from "@mui/icons-material/Search";
// import LoupeIcon from "@mui/icons-material/Loupe";
// import axios from "axios";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import Button from "@mui/material/Button";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
// import PrintIcon from "@mui/icons-material/Print";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import { useReactToPrint } from "react-to-print";
// import "./OPpharmacy.css";

// const PharmacyRefundBillingLIst = () => {
//   const componentRef = useRef();
//   const dispatchvalue = useDispatch();
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const userRecord = useSelector((state) => state.userRecord?.UserData);
//   const navigate = useNavigate();

//   const [SearchQuery, setSearchQuery] = useState({
//     searchBy: "",
//     Status: "Pending",
//   });
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const formatDate = (date) => {
//     const d = new Date(date);
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const day = d.getDate().toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${year}-${month}-${day}`;
//   };
//   const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
//   const [Prescription_Patient_list, setPrescription_Patient_list] = useState(
//     []
//   );
//   const [searchOptions, setSearchOptions] = useState({
//     DateType: "Current",
//     CurrentDate: TodayDate,
//     FromDate: "",
//     ToDate: "",
//     SearchbyFirstName: "",
//     SearchbySpeciality: "",
//     SearchbyDoctor: "",
//     SearchTimeOrderby: "",
//   });
//   const [printView, setPrintView] = useState(null);
//   const [Filterdata, setFilterdata] = useState([]);
//   const [RefundList, setRefundList] = useState([]);

//   const HandleOnchangeSearch = (e) => {
//     const { name, value } = e.target;
//     if (name === "SearchbyPhoneNumber") {
//       if (value.length <= 10) {
//         setSearchOptions((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       }
//     } else if (name === "DateType") {
//       if (value === "Current") {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: TodayDate,
//           FromDate: "",
//           ToDate: "",
//         }));
//       } else if (value === "Customize") {
//         setSearchOptions((prev) => ({
//           ...prev,
//           DateType: value,
//           CurrentDate: "",
//         }));
//       }
//     } else {
//       setSearchOptions((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleRequestEdit1 = (params) => {
//     if (!params) {
//       console.error("Invalid params:", params);
//       return;
//     }
//     dispatchvalue({
//       type: "Selected_Patient_Pharmacy",
//       value: {
//         PatientID: params.PatientId,
//         VisitID: params.Visit_Id,
//         Patient_Name: params.Patient_Name,
//         Doctor_name: params.Doctor_Name,
//         Doctorid: params.Doctor_Id,
//         type: "OP",
//         Department: 2,
//         Edit: true,
//         ...params,
//       },
//     });
//     navigate("/Home/Pharmacy");
//     dispatchvalue({ type: "HrFolder", value: "IPPharmacyRefundBilling" });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };
//     console.log("dddd")
//   // Fetch pending bills
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_Billing_link`, {
//         params: { ...searchOptions, location: userRecord?.location },
//       })
//       .then((response) => {
//         const Datas = Array.isArray(response.data) ? response.data : [];
//         setFilterdata(Datas);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, [userRecord, UrlLink, searchOptions]);

//   // Fetch refund list
//   useEffect(() => {
//     axios
//       .get(`${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_List_link`, {
//         params: { ...searchOptions, location: userRecord?.location },
//       })
//       .then((response) => {
//         const Datas = Array.isArray(response.data) ? response.data : [];
//         setRefundList(Datas);
//       })
//       .catch((error) => {
//         console.error("Error fetching refund list:", error);
//       });
//   }, [userRecord, UrlLink, searchOptions]);

//   const handlePharmacybilling = () => {
//     dispatchvalue({
//       type: "Selected_Patient_Pharmacy",
//       value: {
//         type: "OP",
//         Department: 2,
//       },
//     });
//     navigate("/Home/IPPharmacyRefundBilling");
//     dispatchvalue({ type: "HrFolder", value: "IPPharmacyRefundBilling" });
//     dispatchvalue({ type: "setPreviousFolder", value: null });
//     dispatchvalue({ type: "showMenu", value: true });
//   };

//   const UserRegisterColumns = [
//     {
//       key: "id",
//       name: "S No",
//       filter: true,
//       frozen: true,
//     },
//     {
//       key: "Patient_Name",
//       name: "Patient Name",
//       filter: true,
//       frozen: true,
//     },
//     {
//       key: "PhoneNo",
//       name: "Contact Number",
//       frozen: true,
//     },
//     {
//       key: "Doctor_Name",
//       name: "Doctor Name",
//       frozen: true,
//     },
//     {
//       key: "PatientCategory",
//       name: "Patient Category",
//     },
//     {
//       key: "Net_Amount",
//       name: "Net Amount",
//     },
//     {
//       key: "PaidAmount",
//       name: "Paid Amount",
//     },
//     {
//       key: "BalanceAmount",
//       name: "Balance Amount",
//     },
//     {
//       key: "Action",
//       name: "Action",
//       renderCell: (params) => {
//         return (
//           <Button
//             className="cell_btn"
//             onClick={() => handleRequestEdit1(params.row)}
//           >
//             <ArrowForwardIcon className="check_box_clrr_cancell" />
//           </Button>
//         );
//       },
//     },
//   ];

//   const RefundColumns = [
//   { key: "id", name: "S No", filter: true, frozen: true },
//   { key: "Patient_Name", name: "Patient Name", filter: true, frozen: true },
//   { key: "PhoneNo", name: "Contact Number", frozen: true },
//   // { key: "Doctor_Name", name: "Doctor Name", frozen: true },
//   // { key: "PatientCategory", name: "Patient Category" },
//   { key: "PaidAmount", name: "Refunded Amount" },
//   // { key: "PaidAmount", name: "Paid Amount" },
//   { key: "BalanceAmount", name: "Balance Amount" },
//   {
//     key: "Billing_Items",
//     name: "Refunded Items",
//     renderCell: (params) => (
//       <ul style={{ margin: 0, padding: 0 }}>
//         {params.row.Billing_Items.map((item) => (
//           <li key={item.S_No}>
//             {item.ItemName} ({item.Billing_Quantity} × {item.Unit_Price})
//           </li>
//         ))}
//       </ul>
//     ),
//   },
//   {
//     key: "Action",
//     name: "Action",
//     renderCell: (params) => (
//       <Button className="cell_btn" onClick={() => handlePrintReceipt(params.row)}>
//         <ReceiptIcon />
//       </Button>
//     ),
//   },
// ];


//   const handlePrintBill = () => {
//     setPrintView("bill");
//   };

//   const handlePrintReceipt = (row) => {
//     setPrintView({ type: "receipt", data: row });
//   };

//   const ForPrintBill = () => {
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
//           <h3>Bill Print</h3>
//           {/* Add bill details here */}
//         </div>
//         <div className="Register_btn_con added_Register_btn_con">
//           <button
//             className="RegisterForm_1_btns jwedu6_99"
//             onClick={handlePrint2}
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

//   // const ForPrintReceipt = ({ data }) => {
//   //   return (
//   //     <div ref={componentRef}>
//   //       <div
//   //         style={{
//   //           display: "flex",
//   //           flexDirection: "column",
//   //           minHeight: "100vh",
//   //         }}
//   //         id="reactprintcontent"
//   //       >
//   //         <h3>Refund Receipt</h3>
//   //         <p>Patient: {data.Patient_Name}</p>
//   //         <p>Receipt No: {data.id}</p>
//   //         <p>Date: {data.Billing_Date}</p>
//   //         <h4>Refunded Items</h4>
//   //         <table>
//   //           <thead>
//   //             <tr>
//   //               <th>S.No</th>
//   //               <th>Item Name</th>
//   //               <th>Batch No</th>
//   //               <th>Quantity</th>
//   //               <th>Unit Price</th>
//   //               <th>Total</th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             {data.Billing_Items.map((item) => (
//   //               <tr key={item.S_No}>
//   //                 <td>{item.S_No}</td>
//   //                 <td>{item.ItemName}</td>
//   //                 <td>{item.BatchNo}</td>
//   //                 <td>{item.Billing_Quantity}</td>
//   //                 <td>{item.Unit_Price}</td>
//   //                 <td>{item.Total}</td>
//   //               </tr>
//   //             ))}
//   //           </tbody>
//   //         </table>
//   //         <p>Total Refunded Amount: {data.Net_Amount}</p>
//   //         <p>Paid Amount: {data.PaidAmount}</p>
//   //         <p>Balance Amount: {data.BalanceAmount}</p>
//   //       </div>
//   //       <div className="Register_btn_con added_Register_btn_con">
//   //         <button
//   //           className="RegisterForm_1_btns jwedu6_99"
//   //           onClick={handlePrint2}
//   //         >
//   //           Print
//   //         </button>
//   //         <button
//   //           className="RegisterForm_1_btns jwedu6_99"
//   //           onClick={handlePrintClose}
//   //         >
//   //           Close
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   const ForPrintReceipt = ({ data }) => {
//   return (
//     <div className="dotmatrix-container">
//       <div ref={componentRef} className="dotmatrix-wrapper">
//         <table className="dotmatrix-table">
//           {/* Header Section */}
//           <thead>
//             <tr>
//               <td colSpan="20" className="dotmatrix-header">
//                 <div className="dotmatrix-header-content">
//                   <div className="dotmatrix-clinic-info">
//                     {/* <span>{ClinicDetails?.Cname}</span> */}
//                   </div>
//                 </div>
//               </td>
//             </tr>

//             <tr>
//               <td colSpan="20" className="dotmatrix-header">
//                 {/* <div className="dotmatrix-clinic-info">
//                   <span>
//                     {[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")}
//                     ,{" "}
//                     {[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode]
//                       .filter((detail) => detail)
//                       .join(", ")}
//                   </span>
//                 </div> */}
//               </td>
//             </tr>

//             <tr>
//               <td colSpan="20" className="dotmatrix-bill-title">
//                 OP Pharmacy Refund Receipt
//               </td>
//             </tr>

//             {/* Patient / Bill Info */}
//             <table className="info-table">
//               <tbody>
//                 <tr>
//                   <td className="label">Patient Name</td>
//                   <td className="value">: {data.Patient_Name}</td>
//                   <td className="label-Right">Receipt No</td>
//                   <td className="value-Right">: {data.id}</td>
//                 </tr>
//                 <tr>
//                   <td className="label">Patient ID</td>
//                   <td className="value">: {data.PatientId}</td>
//                   <td className="label-Right">Date</td>
//                   <td className="value-Right">: {data.Billing_Date}</td>
//                 </tr>
//                 <tr>
//                   <td className="label">Phone No</td>
//                   <td className="value">: {data.PhoneNo}</td>
                  
//                 </tr>
//               </tbody>
//             </table>
//           </thead>

//           {/* Medicines Table */}
//           <tbody>
//             <tr>
//               <td colSpan="20">
//                 <div className="dotmatrix-separator" />
//                 <table className="dotmatrix-inner-table">
//                   <thead>
//                     <tr className="item-header">
//                       <th>S.No</th>
//                       <th>Item</th>
//                       <th>Batch</th>
//                       <th>Exp</th>
//                       <th>Qty</th>
//                       <th style={{ textAlign: "center" }}>Rate</th>
//                       <th style={{ textAlign: "center" }}>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.Billing_Items.map((item) => (
//                       <tr key={item.S_No}>
//                         <td>{item.S_No}</td>
//                         <td>{item.ItemName}</td>
//                         <td>{item.BatchNo}</td>
//                         <td>{item.Exp_Date}</td>
//                         <td>{item.Billing_Quantity}</td>
//                         <td style={{ textAlign: "right" }}>{item.Unit_Price.toFixed(2)}</td>
//                         <td style={{ textAlign: "right" }}>{item.Total}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <div className="dotmatrix-separator" />
//               </td>
//             </tr>
//           </tbody>

//           {/* Totals Section */}
//           <tfoot>
//             <tr>
//               <td colSpan="20">
//                 <table className="totals-table">
//                   <tbody>
//                     <tr>
//                       <td className="pharm-label">Total Items</td>
//                       <td className="pharm-value">: {data.TotalItems}</td>
//                       <td className="pharm-label-right"></td>
//                       <td className="pharm-value-right"> </td>
//                     </tr>
//                     <tr>
//                       <td className="pharm-label">Balance Amount</td>
//                       <td className="pharm-value">: {data.BalanceAmount}</td>
//                       <td className="pharm-label-right">Refunded Amt</td>
//                       <td className="pharm-value-right">: {data.PaidAmount}</td>
//                     </tr>
//                   </tbody>
//                 </table>

//                 <div className="dotmatrix-separator" />
//                 <div className="dotmatrix-footer-note">
//                   {/* Medicine refund is possible within 7 days of its original bill. */}
//                 </div>
//                 <div className="dotmatrix-footer-note">
//                   Medicines/injections needing cold storage, once sold cannot be taken back.
//                 </div>
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       <div className="dotmatrix-buttons">
//         <button onClick={handlePrint2}>Print</button>
//         <button onClick={handlePrintClose}>Close</button>
//       </div>
//     </div>
//   );
// };

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     onAfterPrint: () => {
//       setPrintView(null);
//     },
//   });

//   const handlePrintClose = () => {
//     setPrintView(null);
//   };

//   return (
//     <>
//       {printView === null ? (
//         <div className="Main_container_app">
//           <h3>OP Pharmacy Refund Billing List</h3>
//           <div className="search_div_bar">
//             <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
//               <div className="RegisForm_1">
//                 <label>
//                   Date Type<span>:</span>
//                 </label>
//                 <select
//                   name="DateType"
//                   value={searchOptions.DateType}
//                   onChange={HandleOnchangeSearch}
//                 >
//                   <option value="Current">Current Date</option>
//                   <option value="Customize">Customize</option>
//                 </select>
//               </div>
//               {searchOptions.DateType === "Current" ? (
//                 <div className="RegisForm_1">
//                   <label>
//                     Current Date<span>:</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="CurrentDate"
//                     value={searchOptions.CurrentDate}
//                     onChange={HandleOnchangeSearch}
//                     readOnly
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <div className="RegisForm_1">
//                     <label>
//                       From Date<span>:</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="FromDate"
//                       value={searchOptions.FromDate}
//                       onChange={HandleOnchangeSearch}
//                     />
//                   </div>
//                   <div className="RegisForm_1">
//                     <label>
//                       To Date<span>:</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="ToDate"
//                       value={searchOptions.ToDate}
//                       onChange={HandleOnchangeSearch}
//                       min={searchOptions.FromDate}
//                     />
//                   </div>
//                 </>
//               )}
//               <div className="RegisForm_1">
//                 <label htmlFor="input">
//                   Name/PhoneNo<span>:</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="SearchbyFirstName"
//                   value={searchOptions.SearchbyFirstName}
//                   onChange={HandleOnchangeSearch}
//                 />
//               </div>
//             </div>
//             <h4>Pending Bills</h4>
//             <ReactGrid columns={UserRegisterColumns} RowData={Filterdata} />
//             <h4>Refund list</h4>
//             <ReactGrid columns={RefundColumns} RowData={RefundList} />
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </div>
//       ) : printView.type === "bill" ? (
//         <ForPrintBill />
//       ) : (
//         <ForPrintReceipt data={printView.data} />
//       )}
//     </>
//   );
// };

// export default PharmacyRefundBillingLIst;



import * as React from "react";
import { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LoupeIcon from "@mui/icons-material/Loupe";
import axios from "axios";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useReactToPrint } from "react-to-print";
import "./OPpharmacy.css";
import VisibilityIcon from "@mui/icons-material/Visibility";


const PharmacyRefundBillingLIst = () => {
  const componentRef = useRef();
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();
    const [ClinicDetials, setClinicDetials] = useState({
      ClinicLogo: null,
      ClinicName: "",
      ClinicGST: "",
      ClinicAddress: "",
      ClinicCity: "",
      ClinicState: "",
      ClinicCode: "",
      ClinicMobileNo: "",
      ClinicLandLineNo: "",
      ClinicMailID: "",
    });
  

  const [SearchQuery, setSearchQuery] = useState({
    searchBy: "",
    Status: "Pending",
  });
  const toast = useSelector((state) => state.userRecord?.toast);
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
  const [Prescription_Patient_list, setPrescription_Patient_list] = useState(
    []
  );
  // const [searchOptions, setSearchOptions] = useState({
  //   DateType: "Current",
  //   CurrentDate: TodayDate,
  //   FromDate: "",
  //   ToDate: "",
  //   SearchbyFirstName: "",
  //   SearchbySpeciality: "",
  //   SearchbyDoctor: "",
  //   SearchTimeOrderby: "",
  //   PatientId: "",
  //   Register_Id: "",

  // });

  const getDefaultFilters = (today) => ({
      DateType: "Current",
    CurrentDate: TodayDate,
    FromDate: "",
    ToDate: "",
    SearchbyFirstName: "",
    SearchbySpeciality: "",
    SearchbyDoctor: "",
    SearchTimeOrderby: "",
    PatientId: "",
    Register_Id: "",
  });
  
  const savedFilters = useSelector(
    state => state.userRecord?.opPharmacyRefundFilters
  );
  
  const initialFilters = savedFilters ? savedFilters : getDefaultFilters(TodayDate);
  const [searchOptions, setSearchOptions] = useState(initialFilters);
  
  const firstRender = useRef(true);
  
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // skip saving on first render
    }
    dispatchvalue({
      type: "SAVE_OP_PHARMACY_REFUND_FILTERS",
      value: searchOptions,
    });
  }, [searchOptions]);
  
  const resetFilters = () => {
    setSearchOptions(getDefaultFilters(TodayDate));
  };
  
  const [printView, setPrintView] = useState(null);
  const [Filterdata, setFilterdata] = useState([]);
  const [RefundList, setRefundList] = useState([]);

  // const HandleOnchangeSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "SearchbyPhoneNumber") {
  //     if (value.length <= 10) {
  //       setSearchOptions((prev) => ({
  //         ...prev,
  //         [name]: value,
  //       }));
  //     }
  //   } else if (name === "DateType") {
  //     if (value === "Current") {
  //       setSearchOptions((prev) => ({
  //         ...prev,
  //         DateType: value,
  //         CurrentDate: TodayDate,
  //         FromDate: "",
  //         ToDate: "",
  //       }));
  //     } else if (value === "Customize") {
  //       setSearchOptions((prev) => ({
  //         ...prev,
  //         DateType: value,
  //         CurrentDate: "",
  //       }));
  //     }
  //   } else {
  //     setSearchOptions((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };


  const HandleOnchangeSearch = (e) => {
  const { name, value } = e.target;

  if (name === "SearchbyPhoneNumber") {
    if (/^\d*$/.test(value) && value.length <= 10) {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

  } else if (
    name ==="id" ||
    name === "SearchbyFirstName" ||
    name === "SearchbyPhoneNumber" ||
    name === "PatientId" ||
    name === "RegisterId"

    
  ) {
    setSearchOptions((prev) => ({ ...prev, [name]: value }));
  } else if (name === "DateType") {
    if (value === "Current") {
      setSearchOptions((prev) => ({
        ...prev,
        DateType: value,
        CurrentDate: TodayDate,
        FromDate: "",
        ToDate: "",
      }));
    } else if (value === "Customize") {
      setSearchOptions((prev) => ({
        ...prev,
        DateType: value,
        CurrentDate: "",
      }));
    }

  } else {
    setSearchOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};






    useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(Boolean);
          setClinicDetials({
            ClinicName: clinicData.Clinic_Name || "",
            ClinicAddress: addressComponents.join(", "),
            ClinicGST: clinicData.GSTNo || "",
            ClinicCity: clinicData.City || "",
            ClinicState: clinicData.State || "",
            ClinicCode: clinicData.Pincode || "",
            ClinicMobileNo: clinicData.PhoneNo || "",
            ClinicLandLineNo: clinicData.LandlineNo || "",
            ClinicMailID: clinicData.Mail || "",
            Clinic_DoorNo: clinicData?.DoorNo|| "",
            Clinic_Street: clinicData?.Street|| "",
            Clinic_Area: clinicData?.Area|| "",
            Clinic_City: clinicData?.City|| "",
            Clinic_State: clinicData?.State|| "",
            Clinic_LandlineNo: clinicData?.LandlineNo|| "",
            Clinic_PhoneNo: clinicData?.PhoneNo|| "",


          });
        }
      })
      .catch((error) => {
        console.error("Error fetching clinic details:", error);
      })
  }, [UrlLink]);

  const handleRequestEdit1 = (params) => {
    if (!params) {
      console.error("Invalid params:", params);
      return;
    }


    console.log(params.Billing_Type ,'row.Billing_Type')

    if(params.Billing_Type === 'WalkinPharmacy') {
      dispatchvalue({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: params.PatientId,
        VisitID: params.Visit_Id,
        Patient_Name: params.Patient_Name,
        Doctor_name: params.Doctor_Name,
        Doctorid: params.Doctor_Id,
        type: "OP",
        Department: 2,
        Edit: true,
        ...params,
      },
    });
    // navigate("/Home/NewRefundbilling");
    dispatchvalue({ type: "HrFolder", value: "NewOPWalkinrefundBilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
    }

    else{
dispatchvalue({
      type: "Selected_Patient_Pharmacy",
      value: {
        PatientID: params.PatientId,
        VisitID: params.Visit_Id,
        Patient_Name: params.Patient_Name,
        Doctor_name: params.Doctor_Name,
        Doctorid: params.Doctor_Id,
        type: "OP",
        Department: 2,
        Edit: true,
        ...params,
      },
    });
    // navigate("/Home/NewRefundbilling");
    dispatchvalue({ type: "HrFolder", value: "NewRefundbilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
    }


    
  };
    console.log("dddd")
  // Fetch pending bills
  useEffect(() => {
    axios
      .get(`${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_Billing_link`, {
        params: { ...searchOptions, location: userRecord?.location },
      })
      .then((response) => {
        const Datas = Array.isArray(response.data) ? response.data : [];
        setFilterdata(Datas);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userRecord, UrlLink, searchOptions]);

  // Fetch refund list
  useEffect(() => {
    axios
      .get(`${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_List_link`, {
        params: { ...searchOptions, location: userRecord?.location },
      })
      .then((response) => {
        const Datas = Array.isArray(response.data) ? response.data : [];
        setRefundList(Datas);
      })
      .catch((error) => {
        console.error("Error fetching refund list:", error);
      });
  }, [userRecord, UrlLink, searchOptions]);

  const handlePharmacybilling = () => {
    dispatchvalue({
      type: "Selected_Patient_Pharmacy",
      value: {
        type: "OP",
        Department: 2,
      },
    });
    navigate("/Home/NewRefundbilling");
    dispatchvalue({ type: "HrFolder", value: "NewRefundbilling" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  console.log("print-------",printView?.data);
  

  const [Viewitemmodal,setViewitemmodal] = useState(false);
  
    const [ViewBilledItems,setViewBilledItems] = useState([]);

  console.log(ViewBilledItems,'ViewBilledItems')
  
  
    const handleproductsviewfun =  (row) => {
      console.log('rowwwwwwwwww',row)
      setViewitemmodal(true)
      setViewBilledItems(row.Billing_Items)
  
    }

  const UserRegisterColumns = [
    {
      key: "id",
      name: "S No",
      filter: true,
      frozen: true,
    },
    {
      key: "Patient_Name",
      name: "Patient Name",
      filter: true,
      frozen: true,
    },
    {
      key: "PhoneNo",
      name: "Contact Number",
      frozen: true,
    },
    {
      key: "Doctor_Name",
      name: "Doctor Name",
      frozen: true,
    },
    {
      key: "PatientCategory",
      name: "Patient Category",
    },
    {
      key: "Net_Amount",
      name: "Net Amount",
    },
    {
      key: "PaidAmount",
      name: "Paid Amount",
    },
    // {
    //   key: "BalanceAmount",
    //   name: "Balance Amount",
    // },

    {
          key:'View',name:'View',
          renderCell:(params) => {
    
            return <Button onClick={() => handleproductsviewfun(params.row)}><VisibilityIcon /></Button>;
    
          }
    
        },
    {
      key: "Action",
      name: "Action",
      renderCell: (params) => {
        return (
          <Button
            className="cell_btn"
            onClick={() => handleRequestEdit1(params.row)}
          >
            <ArrowForwardIcon className="check_box_clrr_cancell" />
          </Button>
        );
      },
    },
  ];

  const RefundColumns = [
  { key: "id", name: "S No", filter: true, frozen: true },
  { key: "Patient_Name", name: "Patient Name", filter: true, frozen: true },
  { key: "PhoneNo", name: "Contact Number", frozen: true },
  // { key: "Doctor_Name", name: "Doctor Name", frozen: true },
  // { key: "PatientCategory", name: "Patient Category" },
  { key: "PaidAmount", name: "Refunded Amount" },
  // { key: "PaidAmount", name: "Paid Amount" },
  // { key: "BalanceAmount", name: "Balance Amount" },
  {
    key: "Billing_Items",
    name: "Refunded Items",
    renderCell: (params) => (
      <ul style={{ margin: 0, padding: 0 }}>
        {params.row.Billing_Items.map((item) => (
          <li key={item.S_No}>
            {item.ItemName} ({item.Billing_Quantity} × {item.Unit_Price})
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: "Action",
    name: "Action",
    renderCell: (params) => (
      <Button className="cell_btn" onClick={() => handlePrintReceipt(params.row)}>
        <ReceiptIcon />
      </Button>
    ),
  },
];


  const handlePrintBill = () => {
    setPrintView("bill");
  };

  const handlePrintReceipt = (row) => {
    setPrintView({ type: "receipt", data: row });

  };

  const ForPrintBill = () => {
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
          <h3>Bill Print</h3>
          {/* Add bill details here */}
        </div>
        <div className="Register_btn_con added_Register_btn_con">
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint2}
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

  // const ForPrintReceipt = ({ data }) => {
  //   return (
  //     <div ref={componentRef}>
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           minHeight: "100vh",
  //         }}
  //         id="reactprintcontent"
  //       >
  //         <h3>Refund Receipt</h3>
  //         <p>Patient: {data.Patient_Name}</p>
  //         <p>Receipt No: {data.id}</p>
  //         <p>Date: {data.Billing_Date}</p>
  //         <h4>Refunded Items</h4>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>S.No</th>
  //               <th>Item Name</th>
  //               <th>Batch No</th>
  //               <th>Quantity</th>
  //               <th>Unit Price</th>
  //               <th>Total</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {data.Billing_Items.map((item) => (
  //               <tr key={item.S_No}>
  //                 <td>{item.S_No}</td>
  //                 <td>{item.ItemName}</td>
  //                 <td>{item.BatchNo}</td>
  //                 <td>{item.Billing_Quantity}</td>
  //                 <td>{item.Unit_Price}</td>
  //                 <td>{item.Total}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //         <p>Total Refunded Amount: {data.Net_Amount}</p>
  //         <p>Paid Amount: {data.PaidAmount}</p>
  //         <p>Balance Amount: {data.BalanceAmount}</p>
  //       </div>
  //       <div className="Register_btn_con added_Register_btn_con">
  //         <button
  //           className="RegisterForm_1_btns jwedu6_99"
  //           onClick={handlePrint2}
  //         >
  //           Print
  //         </button>
  //         <button
  //           className="RegisterForm_1_btns jwedu6_99"
  //           onClick={handlePrintClose}
  //         >
  //           Close
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  const ForPrintReceipt = ({ data }) => {
  return (
    <div className="dotmatrix-container">
      <div ref={componentRef} className="dotmatrix-wrapper">
        <table className="dotmatrix-table">
          {/* Header Section */}
          <thead>
            <tr>
              <td colSpan="20" className="dotmatrix-header">
                <div className="dotmatrix-header-content">
                  <div className="dotmatrix-clinic-info">
                    {/* <span>{ClinicDetails?.Cname}</span> */}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan="20" className="dotmatrix-header">
                {/* <div className="dotmatrix-clinic-info">
                  <span>
                    {[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")}
                    ,{" "}
                    {[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode]
                      .filter((detail) => detail)
                      .join(", ")}
                  </span>
                </div> */}
              </td>
            </tr>

            <tr>
              <td colSpan="20" className="dotmatrix-bill-title">
                OP Pharmacy Refund Receipt
              </td>
            </tr>

            {/* Patient / Bill Info */}
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label">Patient Name</td>
                  <td className="value">: {data?.Patient_Name}</td>
                  <td className="label-Right">Receipt No</td>
                  <td className="value-Right">: {data?.id}</td>
                </tr>
                <tr>
                  <td className="label">Patient ID</td>
                  <td className="value">: {data?.PatientId}</td>
                  <td className="label-Right">Date</td>
                  <td className="value-Right">: {data?.Billing_Date}</td>
                </tr>
                <tr>
                  <td className="label">Phone No</td>
                  <td className="value">: {data?.PhoneNo}</td>
                  
                </tr>
              </tbody>
            </table>
          </thead>

          {/* Medicines Table */}
          <tbody>
            <tr>
              <td colSpan="20">
                <div className="dotmatrix-separator" />
                <table className="dotmatrix-inner-table">
                  <thead>
                    <tr className="item-header">
                      <th>S.No</th>
                      <th>Item</th>
                      <th>Batch</th>
                      <th>Exp</th>
                      <th>Qty</th>
                      <th style={{ textAlign: "center" }}>Rate</th>
                      <th style={{ textAlign: "center" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.Billing_Items.map((item) => (
                      <tr key={item.S_No}>
                        <td>{item?.S_No}</td>
                        <td>{item?.ItemName}</td>
                        <td>{item?.BatchNo}</td>
                        <td>{item?.Exp_Date}</td>
                        <td>{item?.Billing_Quantity}</td>
                        <td style={{ textAlign: "right" }}>{item?.Unit_Price.toFixed(2)}</td>
                        <td style={{ textAlign: "right" }}>{item?.Total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="dotmatrix-separator" />
              </td>
            </tr>
          </tbody>

          {/* Totals Section */}
          <tfoot>
            <tr>
              <td colSpan="20">
                <table className="totals-table">
                  <tbody>
                    <tr>
                      <td className="pharm-label">Total Items</td>
                      <td className="pharm-value">: {data?.TotalItems}</td>
                      <td className="pharm-label-right"></td>
                      <td className="pharm-value-right"> </td>
                    </tr>
                    <tr>
                      <td className="pharm-label">Balance Amount</td>
                      <td className="pharm-value">: {data?.BalanceAmount}</td>
                      <td className="pharm-label-right">Refunded Amt</td>
                      <td className="pharm-value-right">: {data?.PaidAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="dotmatrix-separator" />
                <div className="dotmatrix-footer-note">
                  {/* Medicine refund is possible within 7 days of its original bill. */}
                </div>
                <div className="dotmatrix-footer-note">
                  Medicines/injections needing cold storage, once sold cannot be taken back.
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="dotmatrix-buttons">
        <button onClick={handlePrints2}>Print</button>
        <button onClick={handlePrintClose}>Close</button>
      </div>
    </div>
  );
};

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setPrintView(null);
    },
  });

  const handlePrints2 = async () => {
    try {
      console.log("Clinic++++++", ClinicDetials);
      const Sdata = {
        ...printView?.data,
        Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
        Clinic_DoorNo: ClinicDetials?.Clinic_DoorNo,
        Clinic_Street: ClinicDetials?.Clinic_Street,
        Clinic_Area: ClinicDetials?.Clinic_Area,
        Clinic_City: ClinicDetials?.Clinic_City,
        Clinic_State: ClinicDetials?.Clinic_State,
        Clinic_LandlineNo: ClinicDetials?.Clinic_LandlineNo,
        Clinic_PhoneNo: ClinicDetials?.Clinic_PhoneNo,
        DrugLicenseNoOne: ClinicDetials?.DrugLicenseNoOne,
        print: "Refund_Reprint",
      }
      console.log("Clinic++++++", Sdata);

      const response = await fetch("http://localhost:5000/print-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Sdata),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Print job sent successfully:", data);
        return { success: true, data };
      } else {
        console.error("Print job failed:", data);
        return { success: false, error: data.message || "Unknown error" };
      }
    } catch (error) {
      console.error("Error sending print job:", error);
      handlePrint2()
    }
  };




  const handlePrintClose = () => {
    setPrintView(null);
  };

  return (
    <>
      {/* Main View: Search + Grids */}
      {printView === null && !Viewitemmodal ? (
        <div className="Main_container_app">
          <h3>OP Pharmacy Refund Billing List</h3>

          {/* Search Bar */}
          <div className="search_div_bar">
            <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
              {/* Date Type Selector */}
              <div className="RegisForm_1">
                <label>Date Type<span>:</span></label>
                <select
                  name="DateType"
                  value={searchOptions.DateType}
                  onChange={HandleOnchangeSearch}
                >
                  <option value="Current">Current Date</option>
                  <option value="Customize">Customize</option>
                </select>
              </div>

              {/* Conditional Date Inputs */}
              {searchOptions.DateType === "Current" ? (
                <div className="RegisForm_1">
                  <label>Current Date<span>:</span></label>
                  <input
                    type="date"
                    name="CurrentDate"
                    value={searchOptions.CurrentDate}
                    onChange={HandleOnchangeSearch}
                    readOnly
                  />
                </div>
              ) : (
                <>
                  <div className="RegisForm_1">
                    <label>From Date<span>:</span></label>
                    <input
                      type="date"
                      name="FromDate"
                      value={searchOptions.FromDate}
                      onChange={HandleOnchangeSearch}
                    />
                  </div>
                  <div className="RegisForm_1">
                    <label>To Date<span>:</span></label>
                    <input
                      type="date"
                      name="ToDate"
                      value={searchOptions.ToDate}
                      onChange={HandleOnchangeSearch}
                      min={searchOptions.FromDate} // Prevents invalid range
                    />
                  </div>
                </>
              )}

              
              {/* Name/Phone Search */}
              <div className="RegisForm_1">
                <label htmlFor="SearchbyFirstName">
                  Name/PhoneNo/Billno<span>:</span>
                </label>
                <input
                  type="text"
                  name="SearchbyFirstName"
                  value={searchOptions.SearchbyFirstName}
                  onChange={HandleOnchangeSearch}
                  placeholder="Enter name or phone"
                />
              </div>
              
            </div>
             <div className="RegisForm_1">
                <label>Registeration No:</label>
                <input
                  type="text"
                  name="Register_Id"
                  value={searchOptions.Register_Id}
                  onChange={HandleOnchangeSearch}
                />
              </div>
              <button
                className="search_div_bar_btn_1"
                onClick={resetFilters}
              >
                Reset
              </button>


            {/* Pending Bills Grid */}
            <h4>Pending Bills</h4>
            <ReactGrid columns={UserRegisterColumns} RowData={Filterdata} />

            {/* Refund List Grid */}
            <h4>Refund List</h4>
            <ReactGrid columns={RefundColumns} RowData={RefundList} />
          </div>

          {/* Toast Notification */}
          <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
      ) : printView?.type === "bill" && !Viewitemmodal ? (
        /* Print Bill View */
        <ForPrintBill />
      ) : !Viewitemmodal ? (
        /* Print Receipt View */
        <ForPrintReceipt data={printView?.data} />
      ) : null}

      {/* Item Details Modal */}
      {Viewitemmodal && (
        <div className="modal-overlay" onClick={() => setViewitemmodal(false)}>
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto"
            onClick={(e) => e.stopPropagation()}
          >
            <br />
            <div className="appointment">
              <div className="h_head">
                <h4>Items</h4>
              </div>

              <div className="Main_container_app">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {[
                        "S.No",
                        "Item Name",
                        "Batch No",
                        "Expiry Date",
                        "Unit Price",
                        "Quantity",
                        "Amount",
                        "Total",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            backgroundColor: "#f2f2f2",
                            textAlign: header.includes("Price") || header.includes("Amount") || header === "Total" ? "right" : "left",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(ViewBilledItems) &&
                      ViewBilledItems.map((item, index) => (
                        <tr key={item.itemid || index}>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                            {item.S_No || index + 1}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {item.ItemName}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {item.BatchNo}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {item.Exp_Date
                              ? new Date(item.Exp_Date).toLocaleDateString("en-GB")
                              : "N/A"}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                            {Number(item.Unit_Price).toFixed(2)}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                            {item.Billing_Quantity}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                            {Number(item.Amount).toFixed(2)}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                            {Number(item.Total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close Button */}
            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={() => setViewitemmodal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmacyRefundBillingLIst;
