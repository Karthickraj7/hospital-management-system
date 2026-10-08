// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import "../../OtManagement/OtManagement.css";
// import axios from "axios";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
// import { useNavigate } from "react-router-dom";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from '@mui/icons-material/Remove';


// const IpAttenderPassDetails = ({rowData}) => {
// //   const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
//   console.log("egggggggggggg", rowData);

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const UserData = useSelector((state) => state.userRecord?.UserData);
//   const [getdata, setgetdata] = useState(false);
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const [AdmitCard, setAdmitCard] = useState({});
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();


//   const [attenderNames, setAttenderNames] = useState([""]);

//   const [selectedPrintOption, setSelectedPrintOption] = useState("1"); // Default: Print 1


//   const handlePrintSelection = (e) => {
//     setSelectedPrintOption(e.target.value);
//   };

//   const handleAddVisitor = () => {
//     setAttenderNames([...attenderNames, ""]);
//   };

//   const removeVisitorNameField = (index) => {
//     setAttenderNames(attenderNames.filter((_, i) => i !== index));
//   };

//   const handleVisitorChange = (index, value) => {
//     const updatedVisitors = [...attenderNames];
//     updatedVisitors[index] = value;
//     setAttenderNames(updatedVisitors);
//   };
//   const handlesave = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint2();
//       setIsPrintButtonVisible(true); // Resetting print button visibility
//     }, 500);
//   };

//   // useEffect(() => {
//   //   axios.get(`${UrlLink}Frontoffice/post_ip_handover_details?RegistrationId=${Registeredit?.RegistrationId}`,)
//   //     .then((res) => {
//   //       const ress = res.data;
//   //       setAdmitCard({
//   //         ReasonForAdmission: ress.ReasonForAdmission,
//   //         PatientConditionOnAdmission: ress.PatientConditionOnAdmission,
//   //         PatientFileGiven: ress.PatientFileGiven,
//   //         AadharGiven: ress.AadharGiven,
//   //         getdata: true
//   //       });

//   //     })
//   //     .catch((err) => {
//   //       setAdmitCard({
//   //         ReasonForAdmission: "",
//   //         PatientConditionOnAdmission: "",
//   //         PatientFileGiven: "No",
//   //         AadharGiven: "No",
//   //         getdata: false
//   //       });
//   //       console.log(err);
//   //     });
//   // }, [getdata, UrlLink, Registeredit])
//   const PrintContent = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref} id="reactprintcontent">
//         {props.children}
//       </div>
//     );
//   });

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     onAfterPrint: async () => {
//       // Additional action after printing, if needed
//     },
//   });

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">
//             <div className="DivCenter_container">Patient Attender Card</div>
//             <div className="RegisForm_con_Admit handover">
//             {attenderNames.map((visitor, index) => (
//                 <div className="RegisForm_Admit" key={index}>
//                   <label>
//                     Attender Name {index + 1}
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={visitor}
//                     onChange={(e) => handleVisitorChange(index, e.target.value)}
//                   />
//                   <button onClick={handleAddVisitor} className="add-visitor-button">
//                 <AddIcon />
               
//               </button>
//               {attenderNames.length > 1 && (
//                     <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
//                   )}
//                 </div>
//               ))}
              

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Named
//                   <span>:</span>
//                 </label>
//                 {rowData?.PatientName}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Age
//                   <span>:</span>
//                 </label>
//                 {rowData?.Age}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   D.O.A
//                   <span>:</span>
//                 </label>
//                 {rowData?.AdmissionDate}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Contact No
//                   <span>:</span>
//                 </label>
//                 {rowData?.PhoneNo}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Doctor/Specialization
//                   <span>:</span>
//                 </label>
//                 {`${rowData?.DoctorName}/${rowData?.Specilization}`}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Ward/Room No/Bed No
//                   <span>:</span>
//                 </label>
//                 {`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   In-Patient No
//                   <span>:</span>
//                 </label>
//                 {rowData?.RegistrationId}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Barcode
//                   <span>:</span>
//                 </label>
//                 {rowData?.RegistrationId ? (
//                   <Barcode
//                     value={rowData?.RegistrationId}
//                     lineColor="Black"
//                     height={35}
//                     width={1.2}
//                     fontSize={10}
//                     displayValue={false}
//                   />
//                 ) : (
//                   "N/A"
//                 )}
//               </div>

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">Print Copies<span>:</span></label>
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="1"
//                   checked={selectedPrintOption === "1"}

//                   onChange={handlePrintSelection}
//                 /> Print 1
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="2"
//                   checked={selectedPrintOption === "2"}

//                   onChange={handlePrintSelection}
//                 /> Print 2
//               </div>
//             </div>
//             <div className="please_return_p">
//             <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
//             </div>  </div>
//           <div className="Main_container_Btn">
//             <button onClick={handlesave}>{"Print"}</button>
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </>
//       ) : (
//         <PrintContent
//           ref={componentRef}
//           style={{
//             marginTop: "50px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >

// {selectedPrintOption === "1" && (

// <div className="form-section5 handover_con erfewf_Asck9 page-break">
// <h2>Patient Attender Card</h2>
// <table className="RegisForm_con_Admit handover RegisForm_Admit_print">
//   <tbody>
//     {attenderNames.map((visitor, index) => (
//       <tr className="RegisForm_Admit RegisForm_Admit_print" key={index}>
//         <td><label>Attender Name {index + 1}<span>:</span> </label></td>
//         <td>
//           <input
//             type="text"
//             value={visitor}
//             onChange={(e) => handleVisitorChange(index, e.target.value)}
//           />
//         </td>
//       </tr>
//     ))}
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>Name<span>:</span> </label></td>
//       <td>{rowData?.PatientName}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>Age<span>:</span> </label></td>
//       <td>{rowData?.Age}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>D.O.A<span>:</span> </label></td>
//       <td>{rowData?.AdmissionDate}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>Contact No<span>:</span> </label></td>
//       <td>{rowData?.PhoneNo}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>Doctor/Specialization<span>:</span> </label></td>
//       <td>{`${rowData?.DoctorName}/${rowData?.Specilization}`}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>Ward/Room No/Bed No<span>:</span> </label></td>
//       <td>{`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>In-Patient No<span>:</span></label></td>
//       <td>{rowData?.RegistrationId}</td>
//     </tr>
//     <tr className="RegisForm_Admit RegisForm_Admit_print">
//       <td><label>Barcode<span>:</span> </label></td>
//       <td>
//         {rowData?.RegistrationId ? (
//           <Barcode
//             value={rowData?.RegistrationId}
//             lineColor="Black"
//             height={30}
//             width={1}
//             fontSize={11}
//             displayValue={false}
//           />
//         ) : (
//           "N/A"
//         )}
//       </td>
//     </tr>
//   </tbody>
// </table>
// <div className="please_return_p RegisForm_Admit_print">
//   <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
// </div>
// </div>
// )}

// {selectedPrintOption === "2" && (
//   <>
  
//     <div className="form-section5 handover_con erfewf_Asck9 page-break">
//       <h2>Patient Attender Card</h2>
//       <table className="RegisForm_con_Admit handover RegisForm_Admit_print">
//         <tbody>
//           {attenderNames.map((visitor, index) => (
//             <tr className="RegisForm_Admit RegisForm_Admit_print" key={index}>
//               <td><label>Attender Name {index + 1}<span>:</span> </label></td>
//               <td>
//                 <input
//                   type="text"
//                   value={visitor}
//                   onChange={(e) => handleVisitorChange(index, e.target.value)}
//                 />
//               </td>
//             </tr>
//           ))}
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Name<span>:</span> </label></td>
//             <td>{rowData?.PatientName}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Age<span>:</span> </label></td>
//             <td>{rowData?.Age}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>D.O.A<span>:</span> </label></td>
//             <td>{rowData?.AdmissionDate}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Contact No<span>:</span> </label></td>
//             <td>{rowData?.PhoneNo}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Doctor/Specialization<span>:</span> </label></td>
//             <td>{`${rowData?.DoctorName}/${rowData?.Specilization}`}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Ward/Room No/Bed No<span>:</span> </label></td>
//             <td>{`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>In-Patient No<span>:</span></label></td>
//             <td>{rowData?.RegistrationId}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Barcode<span>:</span> </label></td>
//             <td>
//               {rowData?.RegistrationId ? (
//                 <Barcode
//                   value={rowData?.RegistrationId}
//                   lineColor="Black"
//                   height={30}
//                   width={1}
//                   fontSize={11}
//                   displayValue={false}
//                 />
//               ) : (
//                 "N/A"
//               )}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <div className="please_return_p RegisForm_Admit_print">
//         <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
//       </div>
//     </div>

//     {/* Second Card with page break */}
//     <div className="form-section5 handover_con erfewf_Asck9" style={{ pageBreakBefore: "always" }}>
//       <h2>Patient Attender Card</h2>
//       <table className="RegisForm_con_Admit handover RegisForm_Admit_print">
//         <tbody>
//           {attenderNames.map((visitor, index) => (
//             <tr className="RegisForm_Admit RegisForm_Admit_print" key={index}>
//               <td><label>Attender Name {index + 1}<span>:</span> </label></td>
//               <td>
//                 <input
//                   type="text"
//                   value={visitor}
//                   onChange={(e) => handleVisitorChange(index, e.target.value)}
//                 />
//               </td>
//             </tr>
//           ))}
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Name<span>:</span> </label></td>
//             <td>{rowData?.PatientName}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Age<span>:</span> </label></td>
//             <td>{rowData?.Age}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>D.O.A<span>:</span></label></td>
//             <td>{rowData?.AdmissionDate}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Contact No<span>:</span> </label></td>
//             <td>{rowData?.PhoneNo}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Doctor/Specialization<span>:</span> </label></td>
//             <td>{`${rowData?.DoctorName}/${rowData?.Specilization}`}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Ward/Room No/Bed No<span>:</span> </label></td>
//             <td>{`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>In-Patient No<span>:</span> </label></td>
//             <td>{rowData?.RegistrationId}</td>
//           </tr>
//           <tr className="RegisForm_Admit RegisForm_Admit_print">
//             <td><label>Barcode<span>:</span> </label></td>
//             <td>
//               {rowData?.RegistrationId ? (
//                 <Barcode
//                   value={rowData?.RegistrationId}
//                   lineColor="Black"
//                   height={30}
//                   width={1}
//                   fontSize={11}
//                   displayValue={false}
//                 />
//               ) : (
//                 "N/A"
//               )}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <div className="please_return_p RegisForm_Admit_print">
//         <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
//       </div>
//     </div>
//   </>
// )}


//         </PrintContent>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;


// import React, { useRef, useState } from "react";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import './BarcodeHashwar.css';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const printBarcodeStyles = `
// @page {
//   size: 80mm 40mm !important;
//   margin: 0 !important;
//   padding: 0 !important;
// }

// @media print {
//   .print-container-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   .barcode-label-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     page-break-after: always !important;
//     page-break-inside: avoid !important;
//     display: block !important;
//     overflow: hidden !important;
//     margin: 0 !important;
//     padding: 5px !important;
//     background-color: transparent !important;
//     box-sizing: border-box !important;
//   }

//   .barcode-label-barHash:last-child {
//     page-break-after: avoid !important;
//   }
// }
// `;

// const IpAttenderPassDetails = ({ rowData }) => {
//   console.log("egggggggggggg", rowData);

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();

//   const [attenderNames, setAttenderNames] = useState([""]);
//   const [selectedPrintOption, setSelectedPrintOption] = useState("1");

//   const handlePrintSelection = (e) => {
//     setSelectedPrintOption(e.target.value);
//   };

//   const handleAddVisitor = () => {
//     setAttenderNames([...attenderNames, ""]);
//   };

//   const removeVisitorNameField = (index) => {
//     setAttenderNames(attenderNames.filter((_, i) => i !== index));
//   };

//   const handleVisitorChange = (index, value) => {
//     const updatedVisitors = [...attenderNames];
//     updatedVisitors[index] = value;
//     setAttenderNames(updatedVisitors);
//   };

//   const handlesave = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint2();
//       setIsPrintButtonVisible(true);
//     }, 500);
//   };

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: printBarcodeStyles,
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   // Generate sample data for printing
//   const generatePrintData = () => {
//     const baseData = {
//       patientName: rowData?.PatientName || "",
//       age: rowData?.Age || "",
//       admissionDate: formatDate(rowData?.AdmissionDate),
//       phone: rowData?.PhoneNo || "",
//       doctor: rowData?.DoctorName || "",
//       specialization: rowData?.Specilization || "",
//       ward: rowData?.WardName || "",
//       room: rowData?.RoomNo || "",
//       bed: rowData?.BedNo || "",
//       ipNo: rowData?.RegistrationId || "",
//       attenderNames: attenderNames.filter(name => name.trim() !== "")
//     };

//     const result = [];
    
//     if (selectedPrintOption === "1") {
//       result.push(baseData);
//     } else {
//       // For two copies
//       result.push(baseData);
//       result.push({...baseData});
//     }

//     return result;
//   };

//   const printData = generatePrintData();

//   const PrintContent = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref} id="reactprintcontent">
//         {props.children}
//       </div>
//     );
//   });

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">
//             <div className="DivCenter_container">Patient Attender Card</div>
//             <div className="RegisForm_con_Admit handover">
//               {attenderNames.map((visitor, index) => (
//                 <div className="RegisForm_Admit" key={index}>
//                   <label>
//                     Attender Name {index + 1}
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={visitor}
//                     onChange={(e) => handleVisitorChange(index, e.target.value)}
//                   />
//                   <button onClick={handleAddVisitor} className="add-visitor-button">
//                     <AddIcon />
//                   </button>
//                   {attenderNames.length > 1 && (
//                     <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
//                   )}
//                 </div>
//               ))}

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Named
//                   <span>:</span>
//                 </label>
//                 {rowData?.PatientName}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Age
//                   <span>:</span>
//                 </label>
//                 {rowData?.Age}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   D.O.A
//                   <span>:</span>
//                 </label>
//                 {rowData?.AdmissionDate}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Contact No
//                   <span>:</span>
//                 </label>
//                 {rowData?.PhoneNo}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Doctor/Specialization
//                   <span>:</span>
//                 </label>
//                 {`${rowData?.DoctorName}/${rowData?.Specilization}`}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Ward/Room No/Bed No
//                   <span>:</span>
//                 </label>
//                 {`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   In-Patient No
//                   <span>:</span>
//                 </label>
//                 {rowData?.RegistrationId}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Print Copies<span>:</span>
//                 </label>
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="1"
//                   checked={selectedPrintOption === "1"}
//                   onChange={handlePrintSelection}
//                 /> Print 1
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="2"
//                   checked={selectedPrintOption === "2"}
//                   onChange={handlePrintSelection}
//                 /> Print 2
//               </div>
//             </div>
//             <div className="please_return_p">
//               <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
//             </div>
//           </div>
//           <div className="Main_container_Btn">
//             <button onClick={handlesave}>{"Print"}</button>
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </>
//       ) : (
//         <PrintContent ref={componentRef}>
//           <div className="print-container-barHash">
//             {printData.map((data, index) => (
//               <div
//                 key={index}
//                 className="barcode-label-barHash"
//                 style={{
//                   backgroundColor: "rgb(230, 240, 245)",
//                   width: "80mm",
//                   height: "40mm",
//                   padding: "5px",
//                   borderRadius: "8px",
//                   fontFamily: "Arial, sans-serif",
//                   marginBottom: "10px",
//                   boxSizing: "border-box",
//                   position: "relative",
//                 }}
//               >
//                 {/* Barcode on top right corner */}
//                 <div style={{
//                   position: "absolute",
//                   top: "5px",
//                   right: "8px",
//                   zIndex: 1
//                 }}>
//                   {data.ipNo ? (
//                     <Barcode
//                       value={data.ipNo}
//                       lineColor="Black"
//                       height={20}
//                       width={0.8}
//                       fontSize={8}
//                       displayValue={false}
//                     />
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>

//                 {/* Centered Content */}
//                 <div style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: "100%",
//                   height: "100%",
//                   textAlign: "center",
//                   paddingTop: "10px"
//                 }}>
//                   {/* Title */}
//                   <div style={{
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                     marginBottom: "8px",
//                     textDecoration: "underline"
//                   }}>
//                     PATIENT ATTENDER CARD
//                   </div>

//                   {/* Attender Names */}
//                   {data.attenderNames.map((attender, attIndex) => (
//                     <div key={attIndex} style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "3px",
//                       marginBottom: "2px",
//                       width: "100%"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         minWidth: "85px",
//                         textAlign: "right"
//                       }}>
//                         ATTENDER {attIndex + 1}
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left",
//                         flex: 1
//                       }}>
//                         {attender}
//                       </span>
//                     </div>
//                   ))}

//                   {/* Patient Details */}
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       NAME
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.patientName}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       AGE
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.age}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       D.O.A
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.admissionDate}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       CONTACT NO
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.phone}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       DOCTOR
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.doctor}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       SPECIALIZATION
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.specialization}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       WARD/ROOM/BED
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {`${data.ward}/${data.room}/${data.bed}`}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "3px",
//                     marginBottom: "2px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       minWidth: "85px",
//                       textAlign: "right"
//                     }}>
//                       IP NO
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.ipNo}
//                     </span>
//                   </div>

//                   {/* Footer Note */}
//                   <div style={{
//                     fontSize: "6px",
//                     fontWeight: "bold",
//                     marginTop: "5px",
//                     textAlign: "center",
//                     width: "100%"
//                   }}>
//                     * PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </PrintContent>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;



// import React, { useRef, useState } from "react";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import './BarcodeHashwar.css';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const printBarcodeStyles = `
// @page {
//   size: 80mm 40mm !important;
//   margin: 0 !important;
//   padding: 0 !important;
// }

// @media print {
//   .print-container-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   .barcode-label-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     page-break-after: always !important;
//     page-break-inside: avoid !important;
//     display: block !important;
//     overflow: hidden !important;
//     margin: 0 !important;
//     padding: 5px !important;
//     background-color: transparent !important;
//     box-sizing: border-box !important;
//   }

//   .barcode-label-barHash:last-child {
//     page-break-after: avoid !important;
//   }
// }
// `;

// const IpAttenderPassDetails = ({ rowData }) => {
//   console.log("egggggggggggg", rowData);

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();

//   const [attenderNames, setAttenderNames] = useState([""]);
//   const [selectedPrintOption, setSelectedPrintOption] = useState("1");

//   const handlePrintSelection = (e) => {
//     setSelectedPrintOption(e.target.value);
//   };

//   const handleAddVisitor = () => {
//     setAttenderNames([...attenderNames, ""]);
//   };

//   const removeVisitorNameField = (index) => {
//     setAttenderNames(attenderNames.filter((_, i) => i !== index));
//   };

//   const handleVisitorChange = (index, value) => {
//     const updatedVisitors = [...attenderNames];
//     updatedVisitors[index] = value;
//     setAttenderNames(updatedVisitors);
//   };

//   const handlesave = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint2();
//       setIsPrintButtonVisible(true);
//     }, 500);
//   };

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: printBarcodeStyles,
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   const getCurrentTime = () => {
//     const now = new Date();
//     const hours = String(now.getHours()).padStart(2, "0");
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const seconds = String(now.getSeconds()).padStart(2, "0");
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 || 12;
    
//     return `${formattedHours}.${minutes}.${seconds} ${ampm}`;
//   };

//   // Generate sample data for printing
//   const generatePrintData = () => {
//     const baseData = {
//       patientName: rowData?.PatientName || "",
//       age: rowData?.Age || "",
//       admissionDate: formatDate(rowData?.AdmissionDate),
//       phone: rowData?.PhoneNo || "",
//       doctor: rowData?.DoctorName || "",
//       specialization: rowData?.Specilization || "",
//       ward: rowData?.WardName || "",
//       room: rowData?.RoomNo || "",
//       bed: rowData?.BedNo || "",
//       ipNo: rowData?.RegistrationId || "",
//       attenderNames: attenderNames.filter(name => name.trim() !== ""),
//       currentTime: getCurrentTime()
//     };

//     const result = [];
    
//     if (selectedPrintOption === "1") {
//       result.push(baseData);
//     } else {
//       // For two copies
//       result.push(baseData);
//       result.push({...baseData});
//     }

//     return result;
//   };

//   const printData = generatePrintData();

//   const PrintContent = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref} id="reactprintcontent">
//         {props.children}
//       </div>
//     );
//   });

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">
//             <div className="DivCenter_container">Patient Attender Card</div>
//             <div className="RegisForm_con_Admit handover">
//               {attenderNames.map((visitor, index) => (
//                 <div className="RegisForm_Admit" key={index}>
//                   <label>
//                     Attender Name {index + 1}
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={visitor}
//                     onChange={(e) => handleVisitorChange(index, e.target.value)}
//                   />
//                   <button onClick={handleAddVisitor} className="add-visitor-button">
//                     <AddIcon />
//                   </button>
//                   {attenderNames.length > 1 && (
//                     <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
//                   )}
//                 </div>
//               ))}

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Named
//                   <span>:</span>
//                 </label>
//                 {rowData?.PatientName}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Age
//                   <span>:</span>
//                 </label>
//                 {rowData?.Age}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   D.O.A
//                   <span>:</span>
//                 </label>
//                 {rowData?.AdmissionDate}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Contact No
//                   <span>:</span>
//                 </label>
//                 {rowData?.PhoneNo}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Doctor/Specialization
//                   <span>:</span>
//                 </label>
//                 {`${rowData?.DoctorName}/${rowData?.Specilization}`}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Ward/Room No/Bed No
//                   <span>:</span>
//                 </label>
//                 {`${rowData?.WardName}/${rowData?.RoomNo}/${rowData?.BedNo}`}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   In-Patient No
//                   <span>:</span>
//                 </label>
//                 {rowData?.RegistrationId}
//               </div>
//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Print Copies<span>:</span>
//                 </label>
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="1"
//                   checked={selectedPrintOption === "1"}
//                   onChange={handlePrintSelection}
//                 /> Print 1
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="2"
//                   checked={selectedPrintOption === "2"}
//                   onChange={handlePrintSelection}
//                 /> Print 2
//               </div>
//             </div>
//             <div className="please_return_p">
//               <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
//             </div>
//           </div>
//           <div className="Main_container_Btn">
//             <button onClick={handlesave}>{"Print"}</button>
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </>
//       ) : (
//         <PrintContent ref={componentRef}>
//           <div className="print-container-barHash">
//             {printData.map((data, index) => (
//               <div
//                 key={index}
//                 className="barcode-label-barHash"
//                 style={{
//                   backgroundColor: "rgb(230, 240, 245)",
//                   width: "80mm",
//                   height: "40mm",
//                   padding: "5px",
//                   borderRadius: "8px",
//                   fontFamily: "Arial, sans-serif",
//                   marginBottom: "10px",
//                   boxSizing: "border-box",
//                   position: "relative",
//                 }}
//               >
//                 {/* Barcode on top right corner */}
//                 <div style={{
//                   position: "absolute",
//                   top: "5px",
//                   right: "8px",
//                   zIndex: 1
//                 }}>
//                   {data.ipNo ? (
//                     <Barcode
//                       value={data.ipNo}
//                       lineColor="Black"
//                       height={20}
//                       width={0.8}
//                       fontSize={8}
//                       displayValue={false}
//                     />
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>

//                 {/* Centered Content - Exact layout like the example image */}
//                 <div style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   width: "100%",
//                   height: "100%",
//                   padding: "3px",
//                   paddingTop: "25px" // Space for barcode
//                 }}>
//                   {/* Attender Names */}
//                   {data.attenderNames.map((attender, attIndex) => (
//                     <div key={attIndex} style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "1px",
//                       width: "100%"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         width: "45px",
//                         textAlign: "left"
//                       }}>
//                         ATTENDER {attIndex + 1}
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left",
//                         flex: 1
//                       }}>
//                         {attender}
//                       </span>
//                     </div>
//                   ))}

//                   {/* Patient Details - Centered like the example */}
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       NAME
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.patientName}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       AGE
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.age}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       D.O.A
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.admissionDate}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       PH
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.phone}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       DR
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.doctor}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       DEPT
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.specialization}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       WARD
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {`${data.ward}/${data.room}/${data.bed}`}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       IP NO
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.ipNo}
//                     </span>
//                   </div>

//                   {/* Date and Time at bottom like the example */}
//                   <div style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginTop: "3px",
//                     width: "100%"
//                   }}>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         width: "35px",
//                         textAlign: "left"
//                       }}>
//                         Date
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left"
//                       }}>
//                         {data.admissionDate}
//                       </span>
//                     </div>

//                     <div style={{
//                       display: "flex",
//                       alignItems: "center"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         width: "30px",
//                         textAlign: "left"
//                       }}>
//                         Time
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left"
//                       }}>
//                         {data.currentTime}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Footer Note */}
//                   <div style={{
//                     fontSize: "6px",
//                     fontWeight: "bold",
//                     marginTop: "5px",
//                     textAlign: "center",
//                     width: "100%"
//                   }}>
//                     * PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </PrintContent>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;



// import React, { useRef, useState } from "react";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import './BarcodeHashwar.css';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const printBarcodeStyles = `
// @page {
//   size: 80mm 40mm !important;
//   margin: 0 !important;
//   padding: 0 !important;
// }

// @media print {
//   .print-container-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   .barcode-label-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     page-break-after: always !important;
//     page-break-inside: avoid !important;
//     display: block !important;
//     overflow: hidden !important;
//     margin: 0 !important;
//     padding: 5px !important;
//     background-color: transparent !important;
//     box-sizing: border-box !important;
//   }

//   .barcode-label-barHash:last-child {
//     page-break-after: avoid !important;
//   }
// }
// `;

// const IpAttenderPassDetails = ({ rowData }) => {
//   console.log("egggggggggggg", rowData);

//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();

//   const [attenderNames, setAttenderNames] = useState([""]);
//   const [selectedPrintOption, setSelectedPrintOption] = useState("1");

//   const handlePrintSelection = (e) => {
//     setSelectedPrintOption(e.target.value);
//   };

//   const handleAddVisitor = () => {
//     setAttenderNames([...attenderNames, ""]);
//   };

//   const removeVisitorNameField = (index) => {
//     setAttenderNames(attenderNames.filter((_, i) => i !== index));
//   };

//   const handleVisitorChange = (index, value) => {
//     const updatedVisitors = [...attenderNames];
//     updatedVisitors[index] = value;
//     setAttenderNames(updatedVisitors);
//   };

//   const handlesave = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint2();
//       setIsPrintButtonVisible(true);
//     }, 500);
//   };

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: printBarcodeStyles,
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   const getCurrentTime = () => {
//     const now = new Date();
//     const hours = String(now.getHours()).padStart(2, "0");
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const seconds = String(now.getSeconds()).padStart(2, "0");
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const formattedHours = hours % 12 || 12;
    
//     return `${formattedHours}.${minutes}.${seconds} ${ampm}`;
//   };

//   // Generate sample data for printing
//   const generatePrintData = () => {
//     const baseData = {
//       patientName: rowData?.PatientName || "",
//       age: rowData?.Age || "",
//       admissionDate: formatDate(rowData?.AdmissionDate),
//       phone: rowData?.PhoneNo || "",
//       doctor: rowData?.DoctorName || "",
//       specialization: rowData?.Specilization || "",
//       ward: rowData?.WardName || "",
//       room: rowData?.RoomNo || "",
//       bed: rowData?.BedNo || "",
//       ipNo: rowData?.RegistrationId || "",
//       attenderNames: attenderNames.filter(name => name.trim() !== ""),
//       currentTime: getCurrentTime()
//     };

//     const result = [];
    
//     if (selectedPrintOption === "1") {
//       result.push(baseData);
//     } else {
//       // For two copies
//       result.push(baseData);
//       result.push({...baseData});
//     }

//     return result;
//   };

//   const printData = generatePrintData();

//   const PrintContent = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref} id="reactprintcontent">
//         {props.children}
//       </div>
//     );
//   });

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">
//             <div className="DivCenter_container">Patient Attender Card</div>
            
//             {/* Preview that matches the print layout */}
//             <div className="preview-container" style={{
//               backgroundColor: "rgb(230, 240, 245)",
//               width: "80mm",
//               height: "40mm",
//               padding: "5px",
//               borderRadius: "8px",
//               fontFamily: "Arial, sans-serif",
//               margin: "20px auto",
//               boxSizing: "border-box",
//               position: "relative",
//               border: "1px solid #ccc"
//             }}>
//               {/* Barcode on top right corner */}
//               <div style={{
//                 position: "absolute",
//                 top: "5px",
//                 right: "8px",
//                 zIndex: 1
//               }}>
//                 {rowData?.RegistrationId ? (
//                   <Barcode
//                     value={rowData?.RegistrationId}
//                     lineColor="Black"
//                     height={20}
//                     width={0.8}
//                     fontSize={8}
//                     displayValue={false}
//                   />
//                 ) : (
//                   "N/A"
//                 )}
//               </div>

//               {/* Centered Content - Exact layout like the print */}
//               <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 width: "100%",
//                 height: "100%",
//                 padding: "3px",
//                 paddingTop: "25px" // Space for barcode
//               }}>
//                 {/* Attender Names */}
//                 {attenderNames.map((attender, attIndex) => (
//                   <div key={attIndex} style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       ATTENDER {attIndex + 1}
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {attender || "______"}
//                     </span>
//                   </div>
//                 ))}

//                 {/* Patient Details */}
//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     NAME
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.PatientName || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     AGE
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.Age || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     D.O.A
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {formatDate(rowData?.AdmissionDate)}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     PH
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.PhoneNo || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     DR
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.DoctorName || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     DEPT
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.Specilization || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     WARD
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {`${rowData?.WardName || ""}/${rowData?.RoomNo || ""}/${rowData?.BedNo || ""}`}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "1px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "45px",
//                     textAlign: "left"
//                   }}>
//                     IP NO
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.RegistrationId || ""}
//                   </span>
//                 </div>

//                 {/* Date and Time at bottom */}
//                 <div style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginTop: "3px",
//                   width: "100%"
//                 }}>
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "35px",
//                       textAlign: "left"
//                     }}>
//                       Date
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left"
//                     }}>
//                       {formatDate(rowData?.AdmissionDate)}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "30px",
//                       textAlign: "left"
//                     }}>
//                       Time
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left"
//                     }}>
//                       {getCurrentTime()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Footer Note */}
//                 <div style={{
//                   fontSize: "6px",
//                   fontWeight: "bold",
//                   marginTop: "5px",
//                   textAlign: "center",
//                   width: "100%"
//                 }}>
//                   * PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *
//                 </div>
//               </div>
//             </div>

//             {/* Input Form */}
//             <div className="RegisForm_con_Admit handover" style={{ marginTop: "50px" }}>
//               {attenderNames.map((visitor, index) => (
//                 <div className="RegisForm_Admit" key={index}>
//                   <label>
//                     Attender Name {index + 1}
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={visitor}
//                     onChange={(e) => handleVisitorChange(index, e.target.value)}
//                     placeholder="Enter attender name"
//                   />
//                   <button onClick={handleAddVisitor} className="add-visitor-button">
//                     <AddIcon />
//                   </button>
//                   {attenderNames.length > 1 && (
//                     <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
//                   )}
//                 </div>
//               ))}

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Print Copies<span>:</span>
//                 </label>
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="1"
//                   checked={selectedPrintOption === "1"}
//                   onChange={handlePrintSelection}
//                 /> Print 1
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="2"
//                   checked={selectedPrintOption === "2"}
//                   onChange={handlePrintSelection}
//                 /> Print 2
//               </div>
//             </div>

//             <div className="please_return_p">
//               <h6>* PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *</h6>
//             </div>
//           </div>
          
//           <div className="Main_container_Btn">
//             <button onClick={handlesave}>{"Print"}</button>
//             <button onClick={() => window.history.back()} style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}>
//               Close
//             </button>
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </>
//       ) : (
//         <PrintContent ref={componentRef}>
//           <div className="print-container-barHash">
//             {printData.map((data, index) => (
//               <div
//                 key={index}
//                 className="barcode-label-barHash"
//                 style={{
//                   backgroundColor: "rgb(230, 240, 245)",
//                   width: "80mm",
//                   height: "40mm",
//                   padding: "5px",
//                   borderRadius: "8px",
//                   fontFamily: "Arial, sans-serif",
//                   marginBottom: "10px",
//                   boxSizing: "border-box",
//                   position: "relative",
//                 }}
//               >
//                 {/* Barcode on top right corner */}
//                 <div style={{
//                   position: "absolute",
//                   top: "5px",
//                   right: "8px",
//                   zIndex: 1
//                 }}>
//                   {data.ipNo ? (
//                     <Barcode
//                       value={data.ipNo}
//                       lineColor="Black"
//                       height={20}
//                       width={0.8}
//                       fontSize={8}
//                       displayValue={false}
//                     />
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>

//                 {/* Centered Content - Exact layout like the print */}
//                 <div style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   width: "100%",
//                   height: "100%",
//                   padding: "3px",
//                   paddingTop: "25px" // Space for barcode
//                 }}>
//                   {/* Attender Names */}
//                   {data.attenderNames.map((attender, attIndex) => (
//                     <div key={attIndex} style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "1px",
//                       width: "100%"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         width: "45px",
//                         textAlign: "left"
//                       }}>
//                         ATTENDER {attIndex + 1}
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left",
//                         flex: 1
//                       }}>
//                         {attender}
//                       </span>
//                     </div>
//                   ))}

//                   {/* Patient Details */}
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       NAME
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.patientName}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       AGE
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.age}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       D.O.A
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.admissionDate}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       PH
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.phone}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       DR
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.doctor}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       DEPT
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.specialization}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       WARD
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {`${data.ward}/${data.room}/${data.bed}`}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "1px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "45px",
//                       textAlign: "left"
//                     }}>
//                       IP NO
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.ipNo}
//                     </span>
//                   </div>

//                   {/* Date and Time at bottom */}
//                   <div style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginTop: "3px",
//                     width: "100%"
//                   }}>
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         width: "35px",
//                         textAlign: "left"
//                       }}>
//                         Date
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left"
//                       }}>
//                         {data.admissionDate}
//                       </span>
//                     </div>

//                     <div style={{
//                       display: "flex",
//                       alignItems: "center"
//                     }}>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         width: "30px",
//                         textAlign: "left"
//                       }}>
//                         Time
//                       </span>
//                       <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                       <span style={{
//                         fontSize: "9px",
//                         fontWeight: "bolder",
//                         textAlign: "left"
//                       }}>
//                         {data.currentTime}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Footer Note */}
//                   <div style={{
//                     fontSize: "6px",
//                     fontWeight: "bold",
//                     marginTop: "5px",
//                     textAlign: "center",
//                     width: "100%"
//                   }}>
//                     * PLEASE RETURN TO RECEPTION AND SIGN OUT BEFORE LEAVING THE PREMISES *
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </PrintContent>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;


//workingggg
// import React, { useRef, useState } from "react";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";

// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const printBarcodeStyles = `
// @page {
//   size: 80mm 40mm !important;
//   margin: 0 !important;
//   padding: 0 !important;
// }

// @media print {

//   body {
//     -webkit-print-color-adjust: exact !important;
//     print-color-adjust: exact !important;
//   }

//   .print-container-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   .barcode-label-barHash {
//     width: 80mm !important;
//     height: 40mm !important;
//     margin: 0 !important;
//     padding: 4mm !important;
//     box-sizing: border-box;
//     border-radius: 4px;
//     border: 1px solid #ddd; /* optional if you want border like image */
//     background: white !important;
//     overflow: hidden;
//   }

//   .barcode-label-barHash .barcode-image {
//     width: 100%;
//     height: 14mm;       /* exactly like image */
//     display: flex;
//     justify-content: center;
//     margin-bottom: 3mm; /* spacing below barcode */
//   }

//   .barcode-label-barHash .details {
//     font-size: 3.2mm;   /* perfect size for 80×40 label */
//     line-height: 1.2;
//     color: #000;
//   }

//   .barcode-label-barHash:last-child {
//     page-break-after: avoid !important;
//   }
// }
// `;

// const IpAttenderPassDetails = ({ rowData }) => {
//   console.log("egggggggggggg", rowData);

//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();

//   const [attenderNames, setAttenderNames] = useState([""]);
//   const [selectedPrintOption, setSelectedPrintOption] = useState("1");

//   const handlePrintSelection = (e) => {
//     setSelectedPrintOption(e.target.value);
//   };

//   const handleAddVisitor = () => {
//     setAttenderNames([...attenderNames, ""]);
//   };

//   const removeVisitorNameField = (index) => {
//     setAttenderNames(attenderNames.filter((_, i) => i !== index));
//   };

//   const handleVisitorChange = (index, value) => {
//     const updatedVisitors = [...attenderNames];
//     updatedVisitors[index] = value;
//     setAttenderNames(updatedVisitors);
//   };

//   const handlesave = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint2();
//       setIsPrintButtonVisible(true);
//     }, 500);
//   };

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: printBarcodeStyles,
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   // Generate sample data for printing
//   const generatePrintData = () => {
//     const baseData = {
//       patientName: rowData?.PatientName || "",
//       age: rowData?.Age || "",
//       admissionDate: formatDate(rowData?.AdmissionDate),
//       ward: rowData?.WardName || "",
//       room: rowData?.RoomNo || "",
//       bed: rowData?.BedNo || "",
//       ipNo: rowData?.RegistrationId || "",
//       attenderNames: attenderNames.filter(name => name.trim() !== "")
//     };

//     const result = [];
    
//     if (selectedPrintOption === "1") {
//       result.push(baseData);
//     } else {
//       // For two copies
//       result.push(baseData);
//       result.push({...baseData});
//     }

//     return result;
//   };

//   const printData = generatePrintData();

//   const PrintContent = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref} id="reactprintcontent">
//         {props.children}
//       </div>
//     );
//   });

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">
//             <div className="DivCenter_container">Patient Attender Card</div>
            
//             {/* Preview that matches the print layout */}
//             <div className="preview-container" style={{
//               backgroundColor: "white",
//               width: "80mm",
//               height: "40mm",
//               padding: "5px",
//               borderRadius: "8px",
//               fontFamily: "Arial, sans-serif",
//               margin: "20px auto",
//               boxSizing: "border-box",
//               position: "relative",
//               border: "1px solid #ccc"
//             }}>
//               {/* Barcode on top right corner without white background */}
//               <div style={{
//                 position: "absolute",
//                 right: "57px",
//                 top: "-4px",
//                 zIndex: 1,
//                 backgroundColor: "transparent"
//               }}>
//                 {rowData?.RegistrationId ? (
//                   <Barcode
//                     value={rowData?.RegistrationId}
//                     lineColor="Black"
//                     background="transparent"
//                     height={20}
//                     width={0.8}
//                     fontSize={8}
//                     displayValue={false}
//                   />
//                 ) : (
//                   "N/A"
//                 )}
//               </div>

//               {/* Centered Content - Only required fields */}
//               <div style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 width: "100%",
//                 height: "100%",
//                 padding: "3px",
//                 paddingTop: "25px" 
//               }}>
                
//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "3px",
//                   marginleft: "35px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "25px",
//                     textAlign: "left"
//                   }}>
//                     NAME
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.PatientName || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "3px",
//                   marginleft: "35px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "25px",
//                     textAlign: "left"
//                   }}>
//                     AGE
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.Age || ""}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "3px",
//                   marginleft: "35px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "25px",
//                     textAlign: "left"
//                   }}>
//                     D.O.A
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {formatDate(rowData?.AdmissionDate)}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "3px",
//                   marginleft: "35px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "25px",
//                     textAlign: "left"
//                   }}>
//                     WARD
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {`${rowData?.WardName || ""}/${rowData?.RoomNo || ""}/${rowData?.BedNo || ""}`}
//                   </span>
//                 </div>

//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "3px",
//                   marginleft: "35px",
//                   width: "100%"
//                 }}>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     width: "25px",
//                     textAlign: "left"
//                   }}>
//                     IP NO
//                   </span>
//                   <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                   <span style={{
//                     fontSize: "9px",
//                     fontWeight: "bolder",
//                     textAlign: "left",
//                     flex: 1
//                   }}>
//                     {rowData?.RegistrationId || ""}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Input Form - Only Attender and Print Copies */}
//             {/* <div className="RegisForm_con_Admit handover" style={{ marginTop: "20px" }}>
//               {attenderNames.map((visitor, index) => (
//                 <div className="RegisForm_Admit" key={index}>
//                   <label>
//                     Attender {index + 1}
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={visitor}
//                     onChange={(e) => handleVisitorChange(index, e.target.value)}
//                     placeholder="Enter attender name"
//                   />
//                   <button onClick={handleAddVisitor} className="add-visitor-button">
//                     <AddIcon />
//                   </button>
//                   {attenderNames.length > 1 && (
//                     <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
//                   )}
//                 </div>
//               ))}

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Print Copies<span>:</span>
//                 </label>
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="1"
//                   checked={selectedPrintOption === "1"}
//                   onChange={handlePrintSelection}
//                 /> Print 1
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="2"
//                   checked={selectedPrintOption === "2"}
//                   onChange={handlePrintSelection}
//                 /> Print 2
//               </div>
//             </div> */}
//           </div>
          
//           <div className="Main_container_Btn">
//             <button onClick={handlesave}>{"Print"}</button>
//             <button onClick={() => window.history.back()} style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}>
//               Close
//             </button>
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </>
//       ) : (
//         <PrintContent ref={componentRef}>
//           <div className="print-container-barHash">
//             {printData.map((data, index) => (
//               <div
//                 key={index}
//                 className="barcode-label-barHash"
//                 style={{
//                   backgroundColor: "white",
//                   width: "80mm",
//                   height: "40mm",
//                   padding: "5px",
//                   borderRadius: "8px",
//                   fontFamily: "Arial, sans-serif",
//                   marginBottom: "10px",
//                   boxSizing: "border-box",
//                   position: "relative",
//                 }}
//               >
//                 {/* Barcode on top right corner without white background */}
//                 <div style={{
//                   position: "absolute",
//                   top: "5px",
//                   right: "57px",
//                   margintop: "-10px",
//                   zIndex: 1,
//                   backgroundColor: "transparent"
//                 }}>
//                   {data.ipNo ? (
//                     <Barcode
//                       value={data.ipNo}
//                       lineColor="Black"
//                       background="transparent"
//                       height={20}
//                       width={0.8}
//                       fontSize={8}
//                       displayValue={false}
//                     />
//                   ) : (
//                     "N/A"
//                   )}
//                 </div>

//                 {/* Centered Content - Only required fields */}
//                 <div style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   width: "100%",
//                   height: "100%",
//                   padding: "3px",
//                   paddingTop: "25px" // Space for barcode
//                 }}>
//                   {/* Required Fields Only */}
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "3px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "25px",
//                       textAlign: "left"
//                     }}>
//                       NAME
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.patientName}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "3px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "25px",
//                       textAlign: "left"
//                     }}>
//                       AGE
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.age}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "3px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "25px",
//                       textAlign: "left"
//                     }}>
//                       D.O.A
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.admissionDate}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "3px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "25px",
//                       textAlign: "left"
//                     }}>
//                       WARD
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {`${data.ward}/${data.room}/${data.bed}`}
//                     </span>
//                   </div>

//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "3px",
//                     width: "100%"
//                   }}>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       width: "25px",
//                       textAlign: "left"
//                     }}>
//                       IP NO
//                     </span>
//                     <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
//                     <span style={{
//                       fontSize: "9px",
//                       fontWeight: "bolder",
//                       textAlign: "left",
//                       flex: 1
//                     }}>
//                       {data.ipNo}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </PrintContent>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;


// import React, { useRef, useState } from "react";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// // const printBarcodeStyles = `
// // @page {
// //   size: 80mm 40mm !important;
// //   margin: 0 !important;
// // }

// // @media print {

// //   body {
// //     -webkit-print-color-adjust: exact !important;
// //     print-color-adjust: exact !important;
// //     margin: 0 !important;
// //     padding: 0 !important;
// //   }

// //   #print-wrapper {
// //     width: 80mm !important;
// //     height: 40mm !important;
// //     margin: 0 !important;
// //     padding: 0 !important;
// //     display: flex;
// //     justify-content: center;
// //     align-items: center;
// //   }

// //   .print-card {
// //     width: 80mm !important;
// //     height: 40mm !important;
// //     background: white !important;
// //     padding: 4mm !important;
// //     box-sizing: border-box;
// //     border: 1px solid #ddd;
// //     border-radius: 4px;
// //     position: relative;
// //   }

// //   .print-line {
// //     font-size: 3.2mm;
// //     font-weight: bold;
// //     display: flex;
// //     margin-bottom: 1.5mm;
// //   }

// //   .print-label {
// //     width: 18mm;
// //     text-align: left;
// //     font-weight: bold;
// //   }

// //   .print-value {
// //     flex: 1;
// //     font-weight: bold;
// //   }
// // }
// // `;

// const printBarcodeStyles = `
// @page {
//   size: 85mm 55mm !important;
//   margin: 0 !important;
// }

// @media print {

//   body {
//     -webkit-print-color-adjust: exact !important;
//     print-color-adjust: exact !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   /* 🔥 Force everything to print in black */
//   * {
//     color: #000 !important;
//   }

//   #print-wrapper {
//     width: 85mm !important;
//     height: 55mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   .print-card {
//     width: 85mm !important;
//     height: 55mm !important;
//     background: white !important;
//     padding: 4mm !important;
//     box-sizing: border-box;
//     border: 1px solid #000; /* black border */
//     border-radius: 2px;
//     position: relative;
//   }

//   .print-line {
//     font-size: 3.2mm;
//     font-weight: bold;
//     display: flex;
//     margin-bottom: 1.5mm;
//     color: #000 !important;
//   }

//   .print-label {
//     width: 18mm;
//     text-align: left;
//     font-weight: bold;
//     color: #000 !important;
//   }

//   .print-value {
//     flex: 1;
//     font-weight: bold;
//     color: #000 !important;
//   }
// }
// `;


// const IpAttenderPassDetails = ({ rowData }) => {

//   const toast = useSelector((state) => state.userRecord?.toast);

//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();

//   // ---------- PRINT HANDLER ----------
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: printBarcodeStyles,
//   });

//   const handleSaveAndPrint = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint();
//       setIsPrintButtonVisible(true);
//     }, 300);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const d = new Date(dateString);
//       if (isNaN(d)) return "";
//       return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
//     } catch {
//       return "";
//     }
//   };

//   const printData = {
//     name: rowData?.PatientName || "",
//     age: rowData?.Age || "",
//     doa: formatDate(rowData?.AdmissionDate),
//     ward: `${rowData?.WardName || ""}/${rowData?.RoomNo || ""}/${rowData?.BedNo || ""}`,
//     ip: rowData?.RegistrationId || "",
//   };

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">

//             <div className="DivCenter_container">Patient Attender Card</div>

//             {/* PREVIEW */}
//             <div
//               style={{
//                 width: "80mm",
//                 height: "40mm",
//                 background: "white",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc",
//                 padding: "4mm",
//                 boxSizing: "border-box",
//                 margin: "20px auto",
//                 position: "relative",
//                 fontFamily: "Arial",
//               }}
//             >
//               {/* BARCODE  */}
//               <div
//                 style={{
//                   position: "absolute",
//                   right: "10mm",
//                   top: "2mm",
//                   background: "transparent",
//                 }}
//               >
//                 {printData.ip ? (
//                   <Barcode
//                     value={printData.ip}
//                     lineColor="black"
//                     background="transparent"
//                     height={20}
//                     width={0.8}
//                     displayValue={false}
//                   />
//                 ) : (
//                   "N/A"
//                 )}
//               </div>

//               {/* TEXT CONTENT */}
//               <div style={{ marginTop: "14mm" }}>
//                 <div style={{ display: "flex", fontSize: "3.2mm", marginBottom: "2mm", fontWeight: "bold" }}>
//                   <span style={{ width: "18mm" }}>NAME</span>
//                   <span>:</span>
//                   <span style={{ marginLeft: "2mm" }}>{printData.name}</span>
//                 </div>

//                 <div style={{ display: "flex", fontSize: "3.2mm", marginBottom: "2mm", fontWeight: "bold" }}>
//                   <span style={{ width: "18mm" }}>AGE</span>
//                   <span>:</span>
//                   <span style={{ marginLeft: "2mm" }}>{printData.age}</span>
//                 </div>

//                 <div style={{ display: "flex", fontSize: "3.2mm", marginBottom: "2mm", fontWeight: "bold" }}>
//                   <span style={{ width: "18mm" }}>D.O.A</span>
//                   <span>:</span>
//                   <span style={{ marginLeft: "2mm" }}>{printData.doa}</span>
//                 </div>

//                 <div style={{ display: "flex", fontSize: "3.2mm", marginBottom: "2mm", fontWeight: "bold" }}>
//                   <span style={{ width: "18mm" }}>WARD</span>
//                   <span>:</span>
//                   <span style={{ marginLeft: "2mm" }}>{printData.ward}</span>
//                 </div>

//                 <div style={{ display: "flex", fontSize: "3.2mm", marginBottom: "2mm", fontWeight: "bold" }}>
//                   <span style={{ width: "18mm" }}>IP NO</span>
//                   <span>:</span>
//                   <span style={{ marginLeft: "2mm" }}>{printData.ip}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="Main_container_Btn">
//             <button onClick={handleSaveAndPrint}>Print</button>
//             <button onClick={() => window.history.back()} style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}>
//               Close
//             </button>
//           </div>

//           <ToastAlert Message={toast?.message} Type={toast?.type} />
//         </>
//       ) : (
//         <div id="print-wrapper" ref={componentRef}>
//           <div className="print-card">

//             {/* BARCODE */}
//             <div
//               style={{
//                 position: "absolute",
//                 right: "10mm",
//                 top: "2mm",
//               }}
//             >
//               {printData.ip && (
//                 <Barcode
//                   value={printData.ip}
//                   lineColor="black"
//                   background="transparent"
//                   height={20}
//                   width={0.8}
//                   displayValue={false}
//                 />
//               )}
//             </div>

//             {/* PRINT TEXT */}
//             <div style={{ marginTop: "14mm" }}>
//               <div className="print-line">
//                 <span className="print-label">NAME</span>
//                 <span style={{ marginRight: "1mm" }}>:</span>
//                 <span className="print-value">{printData.name}</span>
//               </div>

//               <div className="print-line">
//                 <span className="print-label">AGE</span>
//                 <span style={{ marginRight: "1mm" }}>:</span>
//                 <span className="print-value">{printData.age}</span>
//               </div>

//               <div className="print-line">
//                 <span className="print-label">D.O.A</span>
//                 <span style={{ marginRight: "1mm" }}>:</span>
//                 <span className="print-value">{printData.doa}</span>
//               </div>

//               <div className="print-line">
//                 <span className="print-label">WARD</span>
//                 <span style={{ marginRight: "1mm" }}>:</span>
//                 <span className="print-value">{printData.ward}</span>
//               </div>

//               <div className="print-line">
//                 <span className="print-label">IP NO</span>
//                 <span style={{ marginRight: "1mm" }}>:</span>
//                 <span className="print-value">{printData.ip}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;


// import React, { useRef, useState } from "react";
// import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
// import { useSelector } from "react-redux";
// import './BarcodeHashwar.css';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

// const printBarcodeStyles = `
// @page {
//   size: 85mm 55mm !important;
//   margin: 0 !important;
// }

// @media print {

//   body {
//     -webkit-print-color-adjust: exact !important;
//     print-color-adjust: exact !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   /* 🔥 Force everything to print in black */
//   * {
//     color: #000 !important;
//   }

//   #print-wrapper {
//     width: 85mm !important;
//     height: 55mm !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   .print-card {
//     width: 85mm !important;
//     height: 55mm !important;
//     background: white !important;
//     padding: 4mm !important;
//     box-sizing: border-box;
//     border: 1px solid #000; /* black border */
//     border-radius: 2px;
//     position: relative;
//   }

//   .print-line {
//     font-size: 3.2mm;
//     font-weight: bold;
//     display: flex;
//     margin-bottom: 1.5mm;
//     color: #000 !important;
//   }

//   .print-label {
//     width: 18mm;
//     text-align: left;
//     font-weight: bold;
//     color: #000 !important;
//   }

//   .print-value {
//     flex: 1;
//     font-weight: bold;
//     color: #000 !important;
//   }

//   .barcode-print {
//     position: absolute !important;
//     top: 4mm !important;
//     right: 4mm !important;
//     height: 6mm !important;
//     z-index: 10 !important;
//     background: transparent !important;
//   }
// }
// `;

// const IpAttenderPassDetails = ({ rowData }) => {
//   console.log("egggggggggggg", rowData);

//   const toast = useSelector((state) => state.userRecord?.toast);
//   const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
//   const componentRef = useRef();

//   const [attenderNames, setAttenderNames] = useState([""]);
//   const [selectedPrintOption, setSelectedPrintOption] = useState("1");

//   const handlePrintSelection = (e) => {
//     setSelectedPrintOption(e.target.value);
//   };

//   const handleAddVisitor = () => {
//     setAttenderNames([...attenderNames, ""]);
//   };

//   const removeVisitorNameField = (index) => {
//     setAttenderNames(attenderNames.filter((_, i) => i !== index));
//   };

//   const handleVisitorChange = (index, value) => {
//     const updatedVisitors = [...attenderNames];
//     updatedVisitors[index] = value;
//     setAttenderNames(updatedVisitors);
//   };

//   const handlesave = () => {
//     setIsPrintButtonVisible(false);
//     setTimeout(() => {
//       handlePrint2();
//       setIsPrintButtonVisible(true);
//     }, 500);
//   };

//   const handlePrint2 = useReactToPrint({
//     content: () => componentRef.current,
//     pageStyle: printBarcodeStyles,
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Invalid Date";
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
      
//       const day = String(date.getDate()).padStart(2, "0");
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const year = date.getFullYear();
      
//       return `${day}-${month}-${year}`;
//     } catch (e) {
//       return "Invalid Date";
//     }
//   };

//   // Generate sample data for printing
//   const generatePrintData = () => {
//     const baseData = {
//       patientName: rowData?.PatientName || "",
//       age: rowData?.Age || "",
//       admissionDate: formatDate(rowData?.AdmissionDate),
//       ward: rowData?.WardName || "",
//       ipNo: rowData?.RegistrationId || "",
//       attenderNames: attenderNames.filter(name => name.trim() !== "")
//     };

//     const result = [];
    
//     if (selectedPrintOption === "1") {
//       result.push(baseData);
//     } else {
//       // For two copies
//       result.push(baseData);
//       result.push({...baseData});
//     }

//     return result;
//   };

//   const printData = generatePrintData();

//   const PrintContent = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref} id="reactprintcontent">
//         {props.children}
//       </div>
//     );
//   });

//   const LabelContent = ({ data, isPrint = false }) => (
//     <div
//       className="print-card"
//       style={{
//         backgroundColor: "white",
//         width: "85mm",
//         height: "55mm",
//         padding: "4mm",
//         fontFamily: "Arial, sans-serif",
//         boxSizing: "border-box",
//         position: "relative",
//         borderRadius: "2px",
//         border: isPrint ? "1px solid #000" : "1px solid #ccc",
//         fontSize: isPrint ? "3.2mm" : "12px", // Adjust preview font to approximate
//         lineHeight: "1.2",
//         color: "#000",
//       }}
//     >
//       {/* Barcode positioned at top-right with padding offset */}
//       <div
//         className={isPrint ? "barcode-print" : ""}
//         style={{
//           position: "absolute",
//           top: isPrint ? "4mm" : "16px",
//           right: isPrint ? "4mm" : "16px",
//           height: isPrint ? "6mm" : "24px",
//           zIndex: 10,
//           backgroundColor: "transparent",
//         }}
//       >
//         {data.ipNo ? (
//           <Barcode
//             value={data.ipNo}
//             format="CODE128"
//             lineColor="#000"
//             background="transparent"
//             height={isPrint ? 24 : 24} // px for both, approx 6mm
//             width={0.6}
//             fontSize={isPrint ? 8 : 10}
//             displayValue={false}
//             marginTop={0}
//             margin={0}
//             marginBottom={0}
//           />
//         ) : (
//           <span style={{ visibility: "hidden" }}>N/A</span>
//         )}
//       </div>

//       {/* Content area starting below barcode */}
//       <div
//         style={{
//           marginTop: isPrint ? "10mm" : "40px", // Space for barcode
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           paddingLeft: "1mm",
//           paddingRight: "1mm",
//         }}
//       >
//         {/* NAME field */}
//         <div
//           className="print-line"
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             marginBottom: isPrint ? "1.5mm" : "6px",
//             width: "100%",
//             fontWeight: "bold",
//           }}
//         >
//           <span
//             className="print-label"
//             style={{
//               width: isPrint ? "18mm" : "72px",
//               textAlign: "left",
//             }}
//           >
//             NAME
//           </span>
//           <span style={{ width: isPrint ? "3mm" : "12px", textAlign: "left" }}>:</span>
//           <span
//             className="print-value"
//             style={{
//               flex: 1,
//               textAlign: "left",
//               marginLeft: isPrint ? "1mm" : "4px",
//               wordBreak: "break-word",
//             }}
//           >
//             {data.patientName}
//           </span>
//         </div>

//         {/* AGE field */}
//         <div
//           className="print-line"
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             marginBottom: isPrint ? "1.5mm" : "6px",
//             width: "100%",
//             fontWeight: "bold",
//           }}
//         >
//           <span
//             className="print-label"
//             style={{
//               width: isPrint ? "18mm" : "72px",
//               textAlign: "left",
//             }}
//           >
//             AGE
//           </span>
//           <span style={{ width: isPrint ? "5mm" : "20px", textAlign: "left" }}> :</span>
//           <span
//             className="print-value"
//             style={{
//               flex: 1,
//               textAlign: "left",
//               marginLeft: isPrint ? "0" : "0",
//             }}
//           >
//             {data.age}
//           </span>
//         </div>

//         {/* D.O.A field */}
//         <div
//           className="print-line"
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             marginBottom: isPrint ? "1.5mm" : "6px",
//             width: "100%",
//             fontWeight: "bold",
//           }}
//         >
//           <span
//             className="print-label"
//             style={{
//               width: isPrint ? "18mm" : "72px",
//               textAlign: "left",
//             }}
//           >
//             D.O.A
//           </span>
//           <span style={{ width: isPrint ? "5mm" : "20px", textAlign: "left" }}> :</span>
//           <span
//             className="print-value"
//             style={{
//               flex: 1,
//               textAlign: "left",
//               marginLeft: isPrint ? "0" : "0",
//             }}
//           >
//             {data.admissionDate}
//           </span>
//         </div>

//         {/* WARD field - No colon, direct value after space */}
//         <div
//           className="print-line"
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             marginBottom: isPrint ? "1.5mm" : "6px",
//             width: "100%",
//             fontWeight: "bold",
//           }}
//         >
//           <span
//             className="print-label"
//             style={{
//               width: isPrint ? "18mm" : "72px",
//               textAlign: "left",
//             }}
//           >
//             WARD
//           </span>
//           <span
//             className="print-value"
//             style={{
//               flex: 1,
//               textAlign: "left",
//               marginLeft: isPrint ? "2mm" : "8px",
//             }}
//           >
//             {data.ward}
//           </span>
//         </div>

//         {/* IP NO field */}
//         <div
//           className="print-line"
//           style={{
//             display: "flex",
//             alignItems: "flex-start",
//             marginBottom: isPrint ? "1.5mm" : "6px",
//             width: "100%",
//             fontWeight: "bold",
//           }}
//         >
//           <span
//             className="print-label"
//             style={{
//               width: isPrint ? "18mm" : "72px",
//               textAlign: "left",
//             }}
//           >
//             IP NO
//           </span>
//           <span style={{ width: isPrint ? "5mm" : "20px", textAlign: "left" }}> :</span>
//           <span
//             className="print-value"
//             style={{
//               flex: 1,
//               textAlign: "left",
//               marginLeft: isPrint ? "0" : "0",
//             }}
//           >
//             {data.ipNo}
//           </span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {isPrintButtonVisible ? (
//         <>
//           <div className="form-section5 handover_con">
//             <div className="DivCenter_container">Patient Attender Card</div>
            
//             {/* Preview - Exact match to image layout */}
//             <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
//               <LabelContent data={printData[0]} isPrint={false} />
//             </div>

//             {/* Input Form - Only Attender and Print Copies (commented out as per original, but kept for reference) */}
//             {/* <div className="RegisForm_con_Admit handover" style={{ marginTop: "20px" }}>
//               {attenderNames.map((visitor, index) => (
//                 <div className="RegisForm_Admit" key={index}>
//                   <label>
//                     Attender {index + 1}
//                     <span>:</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={visitor}
//                     onChange={(e) => handleVisitorChange(index, e.target.value)}
//                     placeholder="Enter attender name"
//                   />
//                   <button onClick={handleAddVisitor} className="add-visitor-button">
//                     <AddIcon />
//                   </button>
//                   {attenderNames.length > 1 && (
//                     <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
//                   )}
//                 </div>
//               ))}

//               <div className="RegisForm_Admit">
//                 <label htmlFor="">
//                   Print Copies<span>:</span>
//                 </label>
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="1"
//                   checked={selectedPrintOption === "1"}
//                   onChange={handlePrintSelection}
//                 /> Print 1
//                 <input
//                   type="radio"
//                   name="printOption"
//                   value="2"
//                   checked={selectedPrintOption === "2"}
//                   onChange={handlePrintSelection}
//                 /> Print 2
//               </div>
//             </div> */}
//           </div>
          
//           <div className="Main_container_Btn">
//             <button onClick={handlesave}>{"Print"}</button>
//             <button onClick={() => window.history.back()} style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}>
//               Close
//             </button>
//           </div>
//           <ToastAlert Message={toast.message} Type={toast.type} />
//         </>
//       ) : (
//         <PrintContent ref={componentRef}>
//           <div id="print-wrapper">
//             {printData.map((data, index) => (
//               <LabelContent key={index} data={data} isPrint={true} />
//             ))}
//           </div>
//         </PrintContent>
//       )}
//     </>
//   );
// };

// export default IpAttenderPassDetails;

import React, { useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import './ipattender.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

const printBarcodeStyles = `
@page {
  size: 80mm 40mm !important;
  margin: 0 !important;
  padding: 0 !important;
}

@media print {

  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .print-container-barHash {
    width: 80mm !important;
    /* Removed fixed height to support multiple copies with page breaks */
    margin: 0 !important;
    padding: 0 !important;
    display: block; /* Changed to block for vertical stacking with page breaks */
  }

  .barcode-label-barHash {
    width: 80mm !important;
    height: 40mm !important;
    margin: 0 !important;
    padding: 4mm !important;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ddd; /* optional if you want border like image */
    background: white !important;
    overflow: hidden;
    position: relative; /* Ensure relative positioning for absolute children */
  }

  /* Add page break before each label except the first to print on separate pages */
  .barcode-label-barHash:not(:first-child) {
    page-break-before: always !important;
  }

  .barcode-label-barHash:last-child {
    page-break-after: avoid !important;
  }

  .barcode-label-barHash .barcode-image {
    width: 100%;
    height: 14mm;       /* exactly like image */
    display: flex;
    justify-content: center;
    margin-bottom: 3mm; /* spacing below barcode */
  }

  .barcode-label-barHash .details {
    font-size: 3.2mm;   /* perfect size for 80×40 label */
    line-height: 1.2;
    color: #000;
  }
}
`;

const IpAttenderPassDetails = ({ rowData }) => {
  console.log("egggggggggggg", rowData);

  const toast = useSelector((state) => state.userRecord?.toast);
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();

  const [attenderNames, setAttenderNames] = useState([""]);
  const [selectedPrintOption, setSelectedPrintOption] = useState("1");

  const handlePrintSelection = (e) => {
    setSelectedPrintOption(e.target.value);
  };

  const handleAddVisitor = () => {
    setAttenderNames([...attenderNames, ""]);
  };

  const removeVisitorNameField = (index) => {
    setAttenderNames(attenderNames.filter((_, i) => i !== index));
  };

  const handleVisitorChange = (index, value) => {
    const updatedVisitors = [...attenderNames];
    updatedVisitors[index] = value;
    setAttenderNames(updatedVisitors);
  };

  const handlesave = () => {
    setIsPrintButtonVisible(false);
    // Increased timeout slightly to ensure DOM update
    setTimeout(() => {
      handlePrint2();
      setIsPrintButtonVisible(true);
    }, 1000); // Bumped to 1000ms for safety
  };

  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printBarcodeStyles,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Generate sample data for printing
  const generatePrintData = () => {
    const baseData = {
      patientName: rowData?.PatientName || "",
      age: rowData?.Age || "",
      admissionDate: formatDate(rowData?.AdmissionDate),
      ward: rowData?.WardName || "",
      room: rowData?.RoomNo || "",
      bed: rowData?.BedNo || "",
      ipNo: rowData?.RegistrationId || "",
      attenderNames: attenderNames.filter(name => name.trim() !== ""),
      NextToKinName : rowData?.NextToKinName
    };

    const result = [];
    
    if (selectedPrintOption === "1") {
      result.push(baseData);
    } else {
      // For two copies
      result.push(baseData);
      result.push({...baseData});
    }

    return result;
  };

  const printData = generatePrintData();

  const PrintContent = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} id="reactprintcontent">
        {props.children}
      </div>
    );
  });

  return (
    <>
      {isPrintButtonVisible ? (
        <>
          <div className="form-section5 handover_con">
            <div className="DivCenter_container">Patient Attender Card</div>
            
            {/* Preview that matches the print layout */}
            <div className="preview-container" style={{
              backgroundColor: "white",
              width: "80mm",
              height: "40mm",
              padding: "5px",
              borderRadius: "8px",
              fontFamily: "Arial, sans-serif",
              margin: "20px auto",
              boxSizing: "border-box",
              position: "relative",
              border: "1px solid #ccc"
            }}>
              {/* Barcode on top right corner without white background */}
              <div style={{
                position: "absolute",
                right: "57px",
                top: "-4px",
                zIndex: 1,
                backgroundColor: "transparent"
              }}>
                {rowData?.RegistrationId ? (
                  <Barcode
                    value={rowData?.RegistrationId}
                    lineColor="Black"
                    background="transparent"
                    height={20}
                    width={0.8}
                    fontSize={8}
                    displayValue={false}
                  />
                ) : (
                  "N/A"
                )}
              </div>

              {/* Centered Content - Only required fields */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                padding: "3px",
                paddingTop: "25px" 
              }}>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  marginLeft: "35px", // Fixed: camelCase marginLeft
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    width: "25px",
                    textAlign: "left"
                  }}>
                    NAME
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    textAlign: "left",
                    flex: 1
                  }}>
                    {rowData?.PatientName || ""}
                  </span>
                </div>

                 <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  marginLeft: "35px", // Fixed: camelCase marginLeft
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    width: "25px",
                    textAlign: "left"
                  }}>
                    IP NO
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    textAlign: "left",
                    flex: 1
                  }}>
                    {rowData?.RegistrationId || ""}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  marginLeft: "35px", // Fixed: camelCase marginLeft
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    width: "25px",
                    textAlign: "left"
                  }}>
                    BYSTANDER NAME
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    textAlign: "left",
                    flex: 1
                  }}>
                    {rowData?.NextToKinName || ""}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  marginLeft: "35px", // Fixed: camelCase marginLeft
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    width: "25px",
                    textAlign: "left"
                  }}>
                    AGE
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    textAlign: "left",
                    flex: 1
                  }}>
                    {rowData?.Age || ""}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  marginLeft: "35px", // Fixed: camelCase marginLeft
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    width: "25px",
                    textAlign: "left"
                  }}>
                    D.O.A
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    textAlign: "left",
                    flex: 1
                  }}>
                    {formatDate(rowData?.AdmissionDate)}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  marginLeft: "35px", // Fixed: camelCase marginLeft
                  width: "100%"
                }}>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    width: "25px",
                    textAlign: "left"
                  }}>
                    WARD
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bolder",
                    textAlign: "left",
                    flex: 1
                  }}>
                    {`${rowData?.WardName || ""}/${rowData?.RoomNo || ""}/${rowData?.BedNo || ""}`}
                  </span>
                </div>

               
              </div>
            </div>

            {/* Input Form - Only Attender and Print Copies */}
            {/* <div className="RegisForm_con_Admit handover" style={{ marginTop: "20px" }}>
              {attenderNames.map((visitor, index) => (
                <div className="RegisForm_Admit" key={index}>
                  <label>
                    Attender {index + 1}
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={visitor}
                    onChange={(e) => handleVisitorChange(index, e.target.value)}
                    placeholder="Enter attender name"
                  />
                  <button onClick={handleAddVisitor} className="add-visitor-button">
                    <AddIcon />
                  </button>
                  {attenderNames.length > 1 && (
                    <button onClick={() => removeVisitorNameField(index)}><RemoveIcon /></button>
                  )}
                </div>
              ))}

              <div className="RegisForm_Admit">
                <label htmlFor="">
                  Print Copies<span>:</span>
                </label>
                <input
                  type="radio"
                  name="printOption"
                  value="1"
                  checked={selectedPrintOption === "1"}
                  onChange={handlePrintSelection}
                /> Print 1
                <input
                  type="radio"
                  name="printOption"
                  value="2"
                  checked={selectedPrintOption === "2"}
                  onChange={handlePrintSelection}
                /> Print 2
              </div>
            </div> */}
          </div>
          
          <div className="Main_container_Btn">
            <button onClick={handlesave}>{"Print"}</button>
            <button onClick={() => window.history.back()} style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}>
              Close
            </button>
          </div>
          <ToastAlert Message={toast.message} Type={toast.type} />
        </>
      ) : (
        <PrintContent ref={componentRef}>
          <div className="print-container-barHash">
            {printData.map((data, index) => (
              <div
                key={index}
                className="barcode-label-barHash"
                style={{
                  backgroundColor: "white",
                  // Removed inline padding/width/height to let CSS handle consistently
                  fontFamily: "Arial, sans-serif",
                  boxSizing: "border-box",
                  position: "relative",
                }}
              >
                {/* Barcode on top right corner without white background */}
                <div style={{
                  position: "absolute",
                  top: "-4px", // Matched preview for consistency
                  right: "57px",
                  // Removed invalid margintop
                  zIndex: 1,
                  backgroundColor: "transparent"
                }}>
                  {data.ipNo ? (
                    <Barcode
                      value={data.ipNo}
                      lineColor="Black"
                      background="transparent"
                      height={20}
                      width={0.8}
                      fontSize={8}
                      displayValue={false}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>

                {/* Centered Content - Only required fields */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  // Let CSS padding handle
                  paddingTop: "25px" // Keep for barcode space, but CSS padding will add overall
                }}>
                  {/* Required Fields Only - Added marginLeft to match preview */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3px",
                    marginLeft: "35px", // Added for consistent indentation
                    width: "100%"
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      width: "25px",
                      textAlign: "left"
                    }}>
                      NAME
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      textAlign: "left",
                      flex: 1
                    }}>
                      {data.patientName}
                    </span>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3px",
                    marginLeft: "35px", // Added for consistent indentation
                    width: "100%"
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      width: "25px",
                      textAlign: "left"
                    }}>
                      BYSTANDER NAME
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      textAlign: "left",
                      flex: 1
                    }}>
                      {data.NextToKinName}
                    </span>
                  </div>

                   <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3px",
                    marginLeft: "35px", // Added for consistent indentation
                    width: "100%"
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      width: "25px",
                      textAlign: "left"
                    }}>
                      IP NO
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      textAlign: "left",
                      flex: 1
                    }}>
                      {data.ipNo}
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3px",
                    marginLeft: "35px", // Added for consistent indentation
                    width: "100%"
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      width: "25px",
                      textAlign: "left"
                    }}>
                      AGE
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      textAlign: "left",
                      flex: 1
                    }}>
                      {data.age}
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3px",
                    marginLeft: "35px", // Added for consistent indentation
                    width: "100%"
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      width: "25px",
                      textAlign: "left"
                    }}>
                      D.O.A
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      textAlign: "left",
                      flex: 1
                    }}>
                      {data.admissionDate}
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "3px",
                    marginLeft: "35px", // Added for consistent indentation
                    width: "100%"
                  }}>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      width: "25px",
                      textAlign: "left"
                    }}>
                      WARD
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "bolder", margin: "0 2px" }}>:</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: "bolder",
                      textAlign: "left",
                      flex: 1
                    }}>
                      {`${data.ward}/${data.room}/${data.bed}`}
                    </span>
                  </div>

                 
                </div>
              </div>
            ))}
          </div>
        </PrintContent>
      )}
    </>
  );
};

export default IpAttenderPassDetails;
