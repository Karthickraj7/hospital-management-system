// import React, { useState, useEffect,useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
// import Button from "@mui/material/Button";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddBoxIcon from "@mui/icons-material/AddBox";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import { NumberToWords } from "../../OtherComponent/OtherFunctions";
// import { useNavigate } from "react-router-dom";


// const AdvanceRefundPage = () => {

// const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//     const userRecord = useSelector(state => state.userRecord?.UserData);
//     const toast = useSelector((state) => state.userRecord?.toast);
//       const componentRef = useRef();
//         const navigate = useNavigate();
      
    

//     const dispatchvalue = useDispatch();

//     const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
    
//      const [ClinicDetials, setClinicDetials] = useState({
//         ClinicLogo: null,
//         ClinicName: "",
//         ClinicGST: "",
//         ClinicAddress: "",
//         ClinicCity: "",
//         ClinicState: "",
//         ClinicCode: "",
//         ClinicMobileNo: "",
//         ClinicLandLineNo: "",
//         ClinicMailID: "",
//       });

//     useEffect(() => {
//         axios
//           .get(`${UrlLink}Masters/Clinic_Detials_link`)
//           .then((response) => {
//             const clinicData = response.data[0];
//             console.log('clinccccc', clinicData);
    
//             if (clinicData) {
//               const addressComponents = [clinicData.Area].filter(
//                 (component) => component
//               );
    
//               setClinicDetials((prev) => ({
//                 ...prev,
//                 ClinicAddress: addressComponents.join(", "),
//                 ClinicGST: clinicData.GSTNo || prev.ClinicGST,
//                 ClinicCity: clinicData.City || prev.ClinicCity,
//                 ClinicState: clinicData.State || prev.ClinicState,
//                 ClinicCode: clinicData.Pincode || prev.ClinicCode,
//                 ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
//                 ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
//                 ClinicMailID: clinicData.Mail || prev.ClinicMailID,
//               }));
//               // if (clinicData.Clinic_Logo) {
//               //   setClinic_Logo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
//               // }
//             }
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       }, [UrlLink]);

//     const AdvanceDetails = useSelector((state) => state.Frontoffice?.AdvanceDetails)

//     const [PatientData,setPatientData] = useState({
//         PatientName :  AdvanceDetails?.PatientName || "",
//         PatientId : AdvanceDetails?.PatientId || "",
//         Gender : AdvanceDetails?.Gender ||"",
//         Age : AdvanceDetails?.Age ||"",
//         RegisterId : AdvanceDetails?.RegistrationId || "",
//         PhoneNo : AdvanceDetails?.PhoneNo || "",
//         PatientCategory : AdvanceDetails?.PatientCategory || "",

//     })


//     const [Refunddatas,setRefunddatas] = useState([]);
//     const [AdvanceRcptid,setAdvanceRcptid] = useState("");

//     const [IPPrintView,setIPPrintView] = useState(false);
//     const [OPPrintView,setOPPrintView] = useState(false);

//     useEffect(() => {
//             axios.get(`${UrlLink}Frontoffice/Advance_Details_For_Refund?AdvanceType=${AdvanceDetails?.AdvanceType}&Receiptid=${AdvanceDetails?.Receiptid}`)
//                 .then((res) => setRefunddatas(res.data))
//                 .catch((err) => console.log(err));
//         }, [UrlLink,AdvanceDetails]);

//     const handleSubmit = () => {

//         const submitdata = {
//             Refunddatas : Refunddatas,
//             ... AdvanceDetails,
//             Billedby : userRecord?.username

//         }

//         console.log(submitdata,'submitdata')

//         axios
//       .post(`${UrlLink}Frontoffice/Advance_Refund_Billing`, submitdata)
//       .then((resp) => {
//         const response = resp.data;
//         console.log(response,'response');

//         const messageType = Object.keys(response)[0];
//         const messageContent = Object.values(response)[0];

//         const AdvanceRcptid = response.AdvanceRcptid
//         setAdvanceRcptid(AdvanceRcptid);

//         console.log(AdvanceRcptid,'AdvanceRcptid')
//         // setSelectAdvance(false);
//         // setLoad((prev) => !prev);

//         if (AdvanceDetails?.AdvanceType == 'OP'){
//           setOPPrintView(true);
//         }

//         else if (AdvanceDetails?.AdvanceType == 'IP'){
//           setIPPrintView(true);
//         }

//         dispatchvalue({
//                     type: 'toast',
//                     value: { message: messageContent, type: messageType },
//                 });
        

//       })
//       .catch((e) => console.log(e));


//     }

//     const handlePrint2 = useReactToPrint({
//         content: () => componentRef.current,
    
//         onAfterPrint: async () => {
//           navigate("/Home/AdvanceCollectionList");
//         },
//       });
    
//       const handleClose = () => {
//         navigate("/Home/CashierFolder");
//         dispatchvalue({ type: "HrFolder", value: "AdvanceCollectionList" });
//         dispatchvalue({ type: "setPreviousFolder", value: null });
//         dispatchvalue({ type: "showMenu", value: true });
//       }


//     const IPForPrintData = () => {
//   // const hasCard = SelectDatalist.some((p) => p.Billpay_method === "Card");
//   // const hasCheque = SelectDatalist.some((p) => p.Billpay_method === "Cheque");
//   // const hasBank = SelectDatalist.some((p) => p.Billpay_method === "Bank");

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
//         <table className="print-table33">
//           <thead
//             className="print_header"
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               height: "150px",
//             }}
//           >
//             <tr>
//               <td colSpan="7" style={{ border: "none" }}>
//                 <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
//                   <div className="new_billing_logo_con">
//                     <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
//                   </div>
//                   <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                     <span style={{ fontWeight: "bold" }}>
//                       {ClinicDetails?.Cname}
//                     </span>
//                     <div>
//                       <span>
//                         {[ClinicDetials.ClinicAddress]
//                           .filter((detail) => detail)
//                           .join(", ")}
//                         {[ClinicDetials.ClinicCity,
//                         ClinicDetials.ClinicState,
//                         ClinicDetials.ClinicCode]
//                           .filter((detail) => detail)
//                           .join(", ")}
//                       </span>
//                     </div>
//                     <div>
//                       {[ClinicDetials.ClinicMobileNo,
//                       ClinicDetials.ClinicLandLineNo,
//                       ClinicDetials.ClinicMailID]
//                         .filter((detail) => detail)
//                         .join(" , ")}
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td
//                 colSpan="7"
//                 style={{
//                   textAlign: "center",
//                   fontWeight: "600",
//                   color: "black",
//                   fontSize: "20px",
//                 }}
//               >
//                 Advance Refund Receipt
//               </td>
//             </tr>
//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_address new_addn_p037">
//                   <div className="new_billing_address_2 new_billing_address_2_new_up">
//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient Name <span>:</span>
//                       </label>
//                       <h4>{PatientData.PatientName}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient ID <span>:</span>
//                       </label>
//                       <h4>{PatientData.PatientId}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Age / Gender <span>:</span>
//                       </label>
//                       <h4>
//                         {PatientData.Age} / {PatientData.Gender}
//                       </h4>
//                     </div>
//                   </div>

//                   <div className="new_billing_address_2 new_billing_address_2_new_up">
//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         IP NO <span>:</span>
//                       </label>
//                       <h4>{PatientData.RegisterId}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         Payer Type <span>:</span>
//                       </label>
//                       <h4>{PatientData.PatientCategory}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         Mobile No <span>:</span>
//                       </label>
//                       <h4>{PatientData.PhoneNo}</h4>
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </thead>

//           <tbody>
//             <tr>
//               <td colSpan="7" className="prin_nnrmll_table">
//                 <table style={{ width: "100%", border: "none" }}>
//                   <thead>
//                     <tr
//                       style={{
//                         borderTop: "1.5px solid black",
//                         borderBottom: "1.5px solid black",
//                       }}
//                     >
//                       <th style={{ borderTop: "1px solid black" }}>
//                         Service Type / Name
//                       </th>
//                       <th style={{ border: "none" }}>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody
//                     style={{
//                       borderBottom: "1.5px solid black",
//                       padding: "2px",
//                     }}
//                   >
//                     {Refunddatas.map((row, index) => (
//                       <React.Fragment key={index}>
//                         {index === 0 ||
//                         Refunddatas[index - 1].ServiceType !==
//                           row.ServiceType ? (
//                           <tr
//                             style={{
//                               borderTop: "1px solid grey",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <td
//                               style={{
//                                 fontWeight: "bold",
//                                 textAlign: "left",
//                                 border: "none",
//                               }}
//                             >
//                               {row.ServiceType}
//                             </td>
//                             <td colSpan="3" style={{ border: "none" }}></td>
//                           </tr>
//                         ) : null}

//                         <tr>
//                           <td style={{ paddingLeft: "20px", border: "none" }}>
//                             {row.AdvancePurpose}
//                           </td>
//                           <td style={{ border: "none" }}>
//                             {row.AdvanceAmount}
//                           </td>
//                         </tr>
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </td>
//             </tr>

//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_invoice_detials">
//                   <div className="invoice_detials_total_1">
//                     <div className="total_con_bill">

//                       {/* <div className="bill_body_new_phar">
//                         <table className="print-table33">
//                           <thead>
//                             <tr>
//                               <th>S.No</th>
//                               <th>Payment Type</th>
//                               {hasCard && <th>Card Type</th>}
//                               {hasCheque && <th>Cheque No</th>}
//                               {hasBank && <th>Bank Name</th>}
//                               <th>Amount</th>
//                               {hasCard && <th>Transaction Fee</th>}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {SelectDatalist.map((row, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{row.Billpay_method || "-"}</td>
//                                 {hasCard && (
//                                   <td>
//                                     {row.Billpay_method === "Card"
//                                       ? row.CardType || "-"
//                                       : "-"}
//                                   </td>
//                                 )}
//                                 {hasCheque && (
//                                   <td>
//                                     {row.Billpay_method === "Cheque"
//                                       ? row.ChequeNo || "-"
//                                       : "-"}
//                                   </td>
//                                 )}
//                                 {hasBank && (
//                                   <td>
//                                     {row.Billpay_method === "Bank"
//                                       ? row.BankName || "-"
//                                       : "-"}
//                                   </td>
//                                 )}
//                                 <td>{row.Amount || "-"}</td>
//                                 {hasCard && (
//                                   <td>
//                                     {row.transactionFee
//                                       ? `${parseInt(row.transactionFee)}%`
//                                       : "-"}
//                                   </td>
//                                 )}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div> */}

//                       <br />

//                       <div className="bill_body_new_phar">
//                         <label>
//                           Amount In Words <span>:</span>
//                         </label>
//                         <span>{NumberToWords(+AdvanceDetails?.Amount)}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Billed By <span>:</span>
//                         </label>
//                         <span>{userRecord?.username}</span>
//                       </div>
//                       {/* <div className="bill_body_new_phar">
//                         <label>
//                           Signature <span>:</span>
//                         </label>
//                         <span></span>
//                       </div> */}
//                     </div>

//                     <div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Bill Amount <span>:</span>
//                         </label>
//                         <span>{AdvanceDetails?.Amount}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Refund Amount <span>:</span>
//                         </label>
//                         <span>{AdvanceDetails?.Amount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="Register_btn_con added_Register_btn_con">
//         <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
//           Print
//         </button>
//         <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
//     };


//     const OPForPrintData = () => {
//   // const hasCard = SelectDatalist.some((p) => p.Billpay_method === "Card");
//   // const hasCheque = SelectDatalist.some((p) => p.Billpay_method === "Cheque");
//   // const hasBank = SelectDatalist.some((p) => p.Billpay_method === "Bank");

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
//         <table className="print-table33">
//           <thead
//             className="print_header"
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               height: "150px",
//             }}
//           >
//             <tr>
//               <td colSpan="7" style={{ border: "none" }}>
//                 <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
//                   <div className="new_billing_logo_con">
//                     <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
//                   </div>
//                   <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
//                     <span style={{ fontWeight: "bold" }}>
//                       {ClinicDetails?.Cname}
//                     </span>
//                     <div>
//                       <span>
//                         {[ClinicDetials.ClinicAddress]
//                           .filter((detail) => detail)
//                           .join(", ")}
//                         {[ClinicDetials.ClinicCity,
//                         ClinicDetials.ClinicState,
//                         ClinicDetials.ClinicCode]
//                           .filter((detail) => detail)
//                           .join(", ")}
//                       </span>
//                     </div>
//                     <div>
//                       {[ClinicDetials.ClinicMobileNo,
//                       ClinicDetials.ClinicLandLineNo,
//                       ClinicDetials.ClinicMailID]
//                         .filter((detail) => detail)
//                         .join(" , ")}
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td
//                 colSpan="7"
//                 style={{
//                   textAlign: "center",
//                   fontWeight: "600",
//                   color: "black",
//                   fontSize: "20px",
//                 }}
//               >
//                 Advance Refund Receipt
//               </td>
//             </tr>
//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_address new_addn_p037">
//                   <div className="new_billing_address_2 new_billing_address_2_new_up">
//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient Name <span>:</span>
//                       </label>
//                       <h4>{PatientData.PatientName}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Patient ID <span>:</span>
//                       </label>
//                       <h4>{PatientData.PatientId}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg wdwdwswdw">
//                       <label>
//                         Age / Gender <span>:</span>
//                       </label>
//                       <h4>
//                         {PatientData.Age} / {PatientData.Gender}
//                       </h4>
//                     </div>
//                   </div>

//                   <div className="new_billing_address_2 new_billing_address_2_new_up">
//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         OP NO <span>:</span>
//                       </label>
//                       <h4>{PatientData.RegisterId}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         Payer Type <span>:</span>
//                       </label>
//                       <h4>{PatientData.PatientCategory}</h4>
//                     </div>

//                     <div className="new_billing_div phrmy_newbilg mvfg_p7u">
//                       <label>
//                         Mobile No <span>:</span>
//                       </label>
//                       <h4>{PatientData.PhoneNo}</h4>
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </thead>

//           <tbody>
//             <tr>
//               <td colSpan="7" className="prin_nnrmll_table">
//                 <table style={{ width: "100%", border: "none" }}>
//                   <thead>
//                     <tr
//                       style={{
//                         borderTop: "1.5px solid black",
//                         borderBottom: "1.5px solid black",
//                       }}
//                     >
//                       <th style={{ borderTop: "1px solid black" }}>
//                         Service Type / Name
//                       </th>
//                       <th style={{ border: "none" }}>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody
//                     style={{
//                       borderBottom: "1.5px solid black",
//                       padding: "2px",
//                     }}
//                   >
//                     {Refunddatas.map((row, index) => (
//                       <React.Fragment key={index}>
//                         {index === 0 ||
//                         Refunddatas[index - 1].ServiceType !==
//                           row.ServiceType ? (
//                           <tr
//                             style={{
//                               borderTop: "1px solid grey",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <td
//                               style={{
//                                 fontWeight: "bold",
//                                 textAlign: "left",
//                                 border: "none",
//                               }}
//                             >
//                               {row.ServiceType}
//                             </td>
//                             <td colSpan="3" style={{ border: "none" }}></td>
//                           </tr>
//                         ) : null}

//                         <tr>
//                           <td style={{ paddingLeft: "20px", border: "none" }}>
//                             {row.AdvancePurpose}
//                           </td>
//                           <td style={{ border: "none" }}>
//                             {row.AdvanceAmount}
//                           </td>
//                         </tr>
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </td>
//             </tr>

//             <tr>
//               <td colSpan="7">
//                 <div className="new_billing_invoice_detials">
//                   <div className="invoice_detials_total_1">
//                     <div className="total_con_bill">

//                       {/* <div className="bill_body_new_phar">
//                         <table className="print-table33">
//                           <thead>
//                             <tr>
//                               <th>S.No</th>
//                               <th>Payment Type</th>
//                               {hasCard && <th>Card Type</th>}
//                               {hasCheque && <th>Cheque No</th>}
//                               {hasBank && <th>Bank Name</th>}
//                               <th>Amount</th>
//                               {hasCard && <th>Transaction Fee</th>}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {SelectDatalist.map((row, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{row.Billpay_method || "-"}</td>
//                                 {hasCard && (
//                                   <td>
//                                     {row.Billpay_method === "Card"
//                                       ? row.CardType || "-"
//                                       : "-"}
//                                   </td>
//                                 )}
//                                 {hasCheque && (
//                                   <td>
//                                     {row.Billpay_method === "Cheque"
//                                       ? row.ChequeNo || "-"
//                                       : "-"}
//                                   </td>
//                                 )}
//                                 {hasBank && (
//                                   <td>
//                                     {row.Billpay_method === "Bank"
//                                       ? row.BankName || "-"
//                                       : "-"}
//                                   </td>
//                                 )}
//                                 <td>{row.Amount || "-"}</td>
//                                 {hasCard && (
//                                   <td>
//                                     {row.transactionFee
//                                       ? `${parseInt(row.transactionFee)}%`
//                                       : "-"}
//                                   </td>
//                                 )}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div> */}

//                       <br />

//                       <div className="bill_body_new_phar">
//                         <label>
//                           Amount In Words <span>:</span>
//                         </label>
//                         <span>{NumberToWords(+AdvanceDetails?.Amount)}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Billed By <span>:</span>
//                         </label>
//                         <span>{userRecord?.username}</span>
//                       </div>
//                       {/* <div className="bill_body_new_phar">
//                         <label>
//                           Signature <span>:</span>
//                         </label>
//                         <span></span>
//                       </div> */}
//                     </div>

//                     <div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Bill Amount <span>:</span>
//                         </label>
//                         <span>{AdvanceDetails?.Amount}</span>
//                       </div>
//                       <div className="bill_body_new_phar">
//                         <label>
//                           Refund Amount <span>:</span>
//                         </label>
//                         <span>{AdvanceDetails?.Amount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <div className="Register_btn_con added_Register_btn_con">
//         <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
//           Print
//         </button>
//         <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
//     };






//   return (

//     <>
//   {IPPrintView ? (
//     <IPForPrintData />
//   ) : OPPrintView ? (
//     <OPForPrintData />
//   ) : (
//     <>
//       <div className="Main_container_app">
//         <h3>Patient Details</h3>
//         <br />
//         <div className="RegisFormcon_1">
//           <div className="RegisForm_1">
//             <label>Patient Id<span>:</span></label>
//             <input
//               type="text"
//               name="PatientId"
//               value={PatientData.PatientId}
//               autoComplete="off"
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>OP / IP NO<span>:</span></label>
//             <input
//               type="text"
//               name="RegisterId"
//               value={PatientData.RegisterId}
//               autoComplete="off"
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Patient Name<span>:</span></label>
//             <input
//               type="text"
//               name="PatientName"
//               value={PatientData.PatientName}
//               autoComplete="off"
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>PhoneNo<span>:</span></label>
//             <input
//               type="text"
//               name="PhoneNo"
//               value={PatientData.PhoneNo}
//               autoComplete="off"
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Age<span>:</span></label>
//             <input
//               type="text"
//               name="Age"
//               value={PatientData.Age}
//               autoComplete="off"
//             />
//           </div>

//           <div className="RegisForm_1">
//             <label>Gender<span>:</span></label>
//             <input
//               type="text"
//               name="Gender"
//               value={PatientData.Gender}
//               autoComplete="off"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="Main_container_app">
//         <h3>Advance Details</h3>
//         <br />
//         <div className="RegisFormcon_1">
//           <div className="new-patient-registration-form">
//             <div className="Selected-table-container444 DEWSDXWED">
//               {Refunddatas.length > 0 && (
//                 <table
//                   className="selected-medicine-table222"
//                   style={{ fontSize: "14px", borderCollapse: "collapse" }}
//                 >
//                   <thead>
//                     <tr>
//                       <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>S.No</th>
//                       <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>Advance Purpose</th>
//                       <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Refunddatas.map((row, index) => (
//                       <tr key={index}>
//                         <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>{row.SerialNo}</td>
//                         <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>{row.AdvancePurpose}</td>
//                         <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>{row.AdvanceAmount || "-"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//             <div className="">
//               <br />
//               <br />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="Register_btn_con added_Register_btn_con">
//         <button
//           className="RegisterForm_1_btns added_RegisterForm_1_btns"
//           onClick={() => handleSubmit()}
//         >
//           Print
//         </button>
//       </div>

//       <ToastAlert Message={toast.message} Type={toast.type} />
//     </>
//   )}
//     </>

    
//   )


// }

// export default AdvanceRefundPage




import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";
import { useNavigate } from "react-router-dom";

const AdvanceRefundPage = () => {
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const componentRef = useRef();
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const AdvanceDetails = useSelector((state) => state.Frontoffice?.AdvanceDetails);

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

    const [Remarks, setRemarks] = useState('')
  

  const [PatientData, setPatientData] = useState({
    PatientName: AdvanceDetails?.PatientName || "",
    PatientId: AdvanceDetails?.PatientId || "",
    Gender: AdvanceDetails?.Gender || "",
    Age: AdvanceDetails?.Age || "",
    RegisterId: AdvanceDetails?.RegistrationId || "",
    PhoneNo: AdvanceDetails?.PhoneNo || "",
    PatientCategory: AdvanceDetails?.PatientCategory || "",
  });

  const [Refunddatas, setRefunddatas] = useState([]);
  const [AdvanceRcptid, setAdvanceRcptid] = useState("");
  const [IPPrintView, setIPPrintView] = useState(false);
  const [OPPrintView, setOPPrintView] = useState(false);
  const [TotalRefundAmount, setTotalRefundAmount] = useState(0);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.Area].filter(
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
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/Advance_Details_For_Refund?AdvanceType=${AdvanceDetails?.AdvanceType}&Receiptid=${AdvanceDetails?.Receiptid}`)
      .then((res) => {
        const data = res.data.map(item => ({
          ...item,
          RefundAmount: 0, // Initialize refund amount to 0
          MaxRefundAmount: item.AdvanceAmount // Set maximum refundable amount
        }));
        setRefunddatas(data);
      })
      .catch((err) => console.log(err));
  }, [UrlLink, AdvanceDetails]);

  const handleRefundAmountChange = (index, value) => {
    const updatedRefundDatas = [...Refunddatas];
    const numericValue = parseFloat(value) || 0;
    
    // Ensure refund amount doesn't exceed the maximum available amount
    if (numericValue > updatedRefundDatas[index].MaxRefundAmount) {
      updatedRefundDatas[index].RefundAmount = updatedRefundDatas[index].MaxRefundAmount;
    } else if (numericValue < 0) {
      updatedRefundDatas[index].RefundAmount = 0;
    } else {
      updatedRefundDatas[index].RefundAmount = numericValue;
    }
    
    setRefunddatas(updatedRefundDatas);
    
    // Calculate total refund amount
    const total = updatedRefundDatas.reduce((sum, item) => sum + (item.RefundAmount || 0), 0);
    setTotalRefundAmount(total);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
const abortControllerRef = useRef(null);

const handleSubmit = () => {
  // If already submitting, cancel the current request
  if (isSubmitting) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('Previous request aborted due to ongoing submission');
    }
    // Reset submitting state immediately
    setIsSubmitting(false);
    return;
  }

  // Abort previous request if it exists
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
    console.log('Previous request aborted');
  }

  // Filter out items with zero refund amount
  const refundItems = Refunddatas.filter(item => item.RefundAmount > 0);
  
  if (refundItems.length === 0) {
    dispatchvalue({
      type: 'toast',
      value: { message: "Please enter refund amount", type: "error" },
    });
    return;
  }

  // Set submitting state to true
  setIsSubmitting(true);

  const submitdata = {
    Refunddatas: refundItems,
    ...AdvanceDetails,
    Billedby: userRecord?.username,
    TotalRefundAmount: TotalRefundAmount,
    Remarks: Remarks
  };

  // Create new AbortController for this request
  abortControllerRef.current = new AbortController();

  axios
    .post(`${UrlLink}Frontoffice/Advance_Refund_Billing`, submitdata, {
      signal: abortControllerRef.current.signal // Attach abort signal
    })
    .then((resp) => {
      const response = resp.data;
      const messageType = Object.keys(response)[0];
      const messageContent = Object.values(response)[0];

      const AdvanceRcptid = response.AdvanceRcptid;
      setAdvanceRcptid(AdvanceRcptid);

      if (AdvanceDetails?.AdvanceType == 'OP') {
        setOPPrintView(true);
      } else if (AdvanceDetails?.AdvanceType == 'IP') {
        setIPPrintView(true);
      }

      // Clear the abort controller reference and reset submitting state
      abortControllerRef.current = null;
      setIsSubmitting(false);

      dispatchvalue({
        type: 'toast',
        value: { message: messageContent, type: messageType },
      });
    })
    .catch((e) => {
      // Clear the abort controller reference and reset submitting state
      abortControllerRef.current = null;
      setIsSubmitting(false);
      
      if (axios.isCancel(e)) {
        console.log('Request canceled:', e.message);
        // Optional: Show cancellation message
        // dispatchvalue({
        //   type: 'toast',
        //   value: { message: "Refund request was cancelled", type: "info" },
        // });
      } else {
        console.log(e);
        // Show error message
        dispatchvalue({
          type: 'toast',
          value: { message: "An error occurred while processing refund", type: "error" },
        });
      }
    });
};

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: async () => {
      navigate("/Home/AdvanceCollectionList");
    },
  });

  const handleClose = () => {
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "AdvanceCollectionList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

 const IPForPrintData = () => {
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
                    <span style={{ fontWeight: "bold" }}>
                      {ClinicDetails?.Cname}
                    </span>
                    <div>
                      <span>
                        {[ClinicDetials.ClinicAddress]
                          .filter((detail) => detail)
                          .join(", ")}
                        {[ClinicDetials.ClinicCity,
                        ClinicDetials.ClinicState,
                        ClinicDetials.ClinicCode]
                          .filter((detail) => detail)
                          .join(", ")}
                      </span>
                    </div>
                    <div>
                      {[ClinicDetials.ClinicMobileNo,
                      ClinicDetials.ClinicLandLineNo,
                      ClinicDetials.ClinicMailID]
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
                  fontSize: "20px",
                }}
              >
                Advance Refund Receipt
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
                      <h4>{PatientData.PatientName}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient ID <span>:</span>
                      </label>
                      <h4>{PatientData.PatientId}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Age / Gender <span>:</span>
                      </label>
                      <h4>
                        {PatientData.Age} / {PatientData.Gender}
                      </h4>
                    </div>
                  </div>

                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        IP NO <span>:</span>
                      </label>
                      <h4>{PatientData.RegisterId}</h4>
                    </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Receipt NO <span>:</span>
                      </label>
                      <h4>{AdvanceRcptid}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Payer Type <span>:</span>
                      </label>
                      <h4>{PatientData.PatientCategory}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Mobile No <span>:</span>
                      </label>
                      <h4>{PatientData.PhoneNo}</h4>
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
                      <th style={{ borderTop: "1px solid black" }}>
                        Service Type / Name
                      </th>
                      <th style={{ border: "none" }}>Original Amount</th>
                      <th style={{ border: "none" }}>Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      borderBottom: "1.5px solid black",
                      padding: "2px",
                    }}
                  >
                    {Refunddatas.filter(item => item.RefundAmount > 0).map((row, index) => (
                      <React.Fragment key={index}>
                        {index === 0 ||
                        Refunddatas[index - 1].ServiceType !==
                          row.ServiceType ? (
                          <tr
                            style={{
                              borderTop: "1px solid grey",
                              marginBottom: "10px",
                            }}
                          >
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "left",
                                border: "none",
                              }}
                            >
                              {row.ServiceType}
                            </td>
                            <td colSpan="2" style={{ border: "none" }}></td>
                          </tr>
                        ) : null}

                        <tr>
                          <td style={{ paddingLeft: "20px", border: "none" }}>
                            {row.AdvancePurpose}
                          </td>
                          <td style={{ border: "none" }}>
                            {row.AdvanceAmount}
                          </td>
                          <td style={{ border: "none" }}>
                            {row.RefundAmount}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "1.5px solid black" }}>
                      <td style={{ fontWeight: "bold", border: "none" }}>Total</td>
                      <td style={{ fontWeight: "bold", border: "none" }}>
                        {Refunddatas.filter(item => item.RefundAmount > 0)
                          .reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td style={{ fontWeight: "bold", border: "none" }}>
                        {TotalRefundAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>{NumberToWords(+TotalRefundAmount)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{userRecord?.username}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Receipt No <span>:</span>
                        </label>
                        <span>{AdvanceRcptid}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Advance Amount <span>:</span>
                        </label>
                        <span>{Refunddatas.filter(item => item.RefundAmount > 0)
                          .reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0)
                          .toFixed(2)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Refund Amount <span>:</span>
                        </label>
                        <span>{TotalRefundAmount.toFixed(2)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Refund Date <span>:</span>
                        </label>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
          Print
        </button>
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const OPForPrintData = () => {
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
                    <span style={{ fontWeight: "bold" }}>
                      {ClinicDetails?.Cname}
                    </span>
                    <div>
                      <span>
                        {[ClinicDetials.ClinicAddress]
                          .filter((detail) => detail)
                          .join(", ")}
                        {[ClinicDetials.ClinicCity,
                        ClinicDetials.ClinicState,
                        ClinicDetials.ClinicCode]
                          .filter((detail) => detail)
                          .join(", ")}
                      </span>
                    </div>
                    <div>
                      {[ClinicDetials.ClinicMobileNo,
                      ClinicDetials.ClinicLandLineNo,
                      ClinicDetials.ClinicMailID]
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
                  fontSize: "20px",
                }}
              >
                Advance Refund Receipt
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
                      <h4>{PatientData.PatientName}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Patient ID <span>:</span>
                      </label>
                      <h4>{PatientData.PatientId}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                      <label>
                        Age / Gender <span>:</span>
                      </label>
                      <h4>
                        {PatientData.Age} / {PatientData.Gender}
                      </h4>
                    </div>
                  </div>

                  <div className="new_billing_address_2 new_billing_address_2_new_up">
                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        OP NO <span>:</span>
                      </label>
                      <h4>{PatientData.RegisterId}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Receipt NO <span>:</span>
                      </label>
                      <h4>{AdvanceRcptid}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Payer Type <span>:</span>
                      </label>
                      <h4>{PatientData.PatientCategory}</h4>
                    </div>

                    <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                      <label>
                        Mobile No <span>:</span>
                      </label>
                      <h4>{PatientData.PhoneNo}</h4>
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
                      <th style={{ borderTop: "1px solid black" }}>
                        Service Type / Name
                      </th>
                      <th style={{ border: "none" }}>Original Amount</th>
                      <th style={{ border: "none" }}>Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      borderBottom: "1.5px solid black",
                      padding: "2px",
                    }}
                  >
                    {Refunddatas.filter(item => item.RefundAmount > 0).map((row, index) => (
                      <React.Fragment key={index}>
                        {index === 0 ||
                        Refunddatas[index - 1].ServiceType !==
                          row.ServiceType ? (
                          <tr
                            style={{
                              borderTop: "1px solid grey",
                              marginBottom: "10px",
                            }}
                          >
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "left",
                                border: "none",
                              }}
                            >
                              {row.ServiceType}
                            </td>
                            <td colSpan="2" style={{ border: "none" }}></td>
                          </tr>
                        ) : null}

                        <tr>
                          <td style={{ paddingLeft: "20px", border: "none" }}>
                            {row.AdvancePurpose}
                          </td>
                          <td style={{ border: "none" }}>
                            {row.AdvanceAmount}
                          </td>
                          <td style={{ border: "none" }}>
                            {row.RefundAmount}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "1.5px solid black" }}>
                      <td style={{ fontWeight: "bold", border: "none" }}>Total</td>
                      <td style={{ fontWeight: "bold", border: "none" }}>
                        {Refunddatas.filter(item => item.RefundAmount > 0)
                          .reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0)
                          .toFixed(2)}
                      </td>
                      <td style={{ fontWeight: "bold", border: "none" }}>
                        {TotalRefundAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <tr>
              <td colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>{NumberToWords(+TotalRefundAmount)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{userRecord?.username}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Receipt No <span>:</span>
                        </label>
                        <span>{AdvanceRcptid}</span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Total Advance Amount <span>:</span>
                        </label>
                        <span>{Refunddatas.filter(item => item.RefundAmount > 0)
                          .reduce((sum, item) => sum + parseFloat(item.AdvanceAmount || 0), 0)
                          .toFixed(2)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Refund Amount <span>:</span>
                        </label>
                        <span>{TotalRefundAmount.toFixed(2)}</span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Refund Date <span>:</span>
                        </label>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="Register_btn_con added_Register_btn_con">
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>
          Print
        </button>
        <button className="RegisterForm_1_btns jwedu6_99" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};
  return (
    <>
      {IPPrintView ? (
        <IPForPrintData />
      ) : OPPrintView ? (
        <OPForPrintData />
      ) : (
        <>
          <div className="Main_container_app">
            <h3>Patient Details</h3>
            <br />
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>Patient Id<span>:</span></label>
                <input
                  type="text"
                  name="PatientId"
                  value={PatientData.PatientId}
                  autoComplete="off"
                  readOnly
                />
              </div>

              <div className="RegisForm_1">
                <label>OP / IP NO<span>:</span></label>
                <input
                  type="text"
                  name="RegisterId"
                  value={PatientData.RegisterId}
                  autoComplete="off"
                  readOnly
                />
              </div>

              <div className="RegisForm_1">
                <label>Patient Name<span>:</span></label>
                <input
                  type="text"
                  name="PatientName"
                  value={PatientData.PatientName}
                  autoComplete="off"
                  readOnly
                />
              </div>

              <div className="RegisForm_1">
                <label>PhoneNo<span>:</span></label>
                <input
                  type="text"
                  name="PhoneNo"
                  value={PatientData.PhoneNo}
                  autoComplete="off"
                  readOnly
                />
              </div>

              <div className="RegisForm_1">
                <label>Age<span>:</span></label>
                <input
                  type="text"
                  name="Age"
                  value={PatientData.Age}
                  autoComplete="off"
                  readOnly
                />
              </div>

              <div className="RegisForm_1">
                <label>Gender<span>:</span></label>
                <input
                  type="text"
                  name="Gender"
                  value={PatientData.Gender}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="Main_container_app">
            <h3>Advance Details</h3>
            <br />
            <div className="RegisFormcon_1">
              <div className="new-patient-registration-form">
                <div className="Selected-table-container444 DEWSDXWED">
                  {Refunddatas.length > 0 && (
                    <table
                      className="selected-medicine-table222"
                      style={{ fontSize: "14px", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>S.No</th>
                          <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>Advance Purpose</th>
                          <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>Original Amount</th>
                          <th style={{ fontSize: "14px", fontWeight: "bold", padding: "10px" }}>Refund Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Refunddatas.map((row, index) => (
                          <tr key={index}>
                            <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>{row.SerialNo}</td>
                            <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>{row.AdvancePurpose}</td>
                            <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>{row.AdvanceAmount || "-"}</td>
                            <td style={{ fontSize: "14px", fontWeight: "bolder", padding: "10px" }}>
                              <input
                                type="number"
                                value={row.RefundAmount}
                                onChange={(e) => handleRefundAmountChange(index, e.target.value)}
                                min="0"
                                max={row.MaxRefundAmount}
                                style={{ width: "100px", padding: "5px" }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2" style={{ textAlign: "right", fontWeight: "bold", padding: "10px" }}>Total Refund Amount:</td>
                          <td colSpan="2" style={{ fontWeight: "bold", padding: "10px" }}>{TotalRefundAmount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </div>
              </div>
            </div>


            <div className="RegisFormcon_1">
              <div className="edwqw_c2">
  <label>Remarks</label>

  <input
    list="remarksList"
    id="Remarks"
    name="Remarks"
    value={Remarks}
    onChange={(e) => setRemarks(e.target.value)}
    style={{
      width: "100%",
      height: "70px",      // Adjust height as needed
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
      boxSizing: "border-box"
    }}
  />

  <datalist id="remarksList">
    <option value="KASP REFUND" />
    <option value="MEDISEP REFUND" />

  </datalist>
</div>


            </div>


          </div>

          <div className="Register_btn_con added_Register_btn_con">
            <button
              className="RegisterForm_1_btns added_RegisterForm_1_btns"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}

            >
              Process Refund
            </button>
          </div>

          <ToastAlert Message={toast.message} Type={toast.type} />
        </>
      )}
    </>
  );
};

export default AdvanceRefundPage;




